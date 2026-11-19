'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/components/MultiImagePreview'
import { MultiImageResult } from '@/components/MultiImageResult'
import { Images } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { runImageBatch, fetchQueuedOCR } from '@/lib/ocr/batch'
import { Balance } from '@/components/billing/Balance'
import { GUEST_DAILY_LIMIT, USER_DAILY_LIMIT } from '@/lib/billing/catalog'
import { useAuth } from '@/hooks/useAuth'

// Removed OCRResultData interface - unified to use MultiOCRResult

interface ImageFile {
  id: string
  file: File
  preview: string
  selected: boolean
}

interface MultiOCRResult {
  id: string
  imageId: string
  text: string
  confidence: number
  language: string
  processingTime: number
  status: 'success' | 'error' | 'processing' | 'queued'
  error?: string
  errorCode?: string
}

class OCRRequestError extends Error {
  constructor(message: string, readonly errorCode?: string) { super(message) }
}

type ViewMode = 'multi-upload' | 'multi-preview' | 'multi-result'

export function InteractiveOCR() {
  // Auth hook
  const { user: _user, session } = useAuth()
  
  // Multi image mode states (unified approach)
  const [viewMode, setViewMode] = useState<ViewMode>('multi-upload')
  const [multiImages, setMultiImages] = useState<ImageFile[]>([])
  const [multiResults, setMultiResults] = useState<MultiOCRResult[]>([])
  const [isMultiProcessing, setIsMultiProcessing] = useState(false)
  const [allowanceExhausted, setAllowanceExhausted] = useState(false)

  useEffect(() => { setAllowanceExhausted(false) }, [session?.user.id])

  // Removed single image mode handlers - unified to multi-image approach

  // Multi-image handlers

  // Auto-switch to preview mode when images are added
  useEffect(() => {
    if (multiImages.length > 0 && viewMode === 'multi-upload') {
      setViewMode('multi-preview')
    } else if (multiImages.length === 0 && viewMode === 'multi-preview') {
      setViewMode('multi-upload')
    }
  }, [multiImages.length, viewMode])



  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Keep the full data URL format for Ali Cloud Vision API
        // Required format: data:image/[type];base64,[data]
        resolve(result)
      }
      reader.onerror = error => reject(error)
    })
  }

  const processMultiOCR = useCallback(async () => {
    if (multiImages.length === 0) {
      toast.error('Please select images first')
      return
    }

    if (multiResults.some(result => result.status === 'success') && !window.confirm('Recognizing these images again uses another image allowance for each successful image. Continue?')) return
    setAllowanceExhausted(false)
    setIsMultiProcessing(true)
    setMultiResults([])
    setViewMode('multi-result')

    try {
      toast.info('Initializing OCR engine...')
      
      const balanceResponse = await fetch('/api/billing/balance', {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        cache: 'no-store',
      })
      const allowance = await balanceResponse.json().catch(() => ({}))
      if (!balanceResponse.ok) throw new Error(allowance.message || 'Image allowance is temporarily unavailable.')
      const concurrency = allowance.concurrencyLimit === 3 ? 3 : 1
      const results: MultiOCRResult[] = multiImages.map(image => ({
        id: crypto.randomUUID(), imageId: image.id, text: '', confidence: 0,
        language: 'zh', processingTime: 0, status: 'queued',
      }))
      setMultiResults([...results])
      await runImageBatch(multiImages, concurrency, async (image, i) => {
        const startTime = Date.now()
        
        try {
          toast.info(`Processing image ${i + 1} of ${multiImages.length}...`)
          
          const processingResult: MultiOCRResult = { ...results[i], status: 'processing' }
          results[i] = processingResult
          setMultiResults([...results])

          // Convert image to base64
          const base64Image = await fileToBase64(image.file)
          

          
          // Validate Base64 format for Ali Cloud API
          const base64Regex = /^data:image\/(jpeg|jpg|png|bmp|gif|webp|tiff|heic);base64,/
          if (!base64Regex.test(base64Image)) {
            throw new Error(`Invalid Base64 format. Expected: data:image/[type];base64,[data], Got: ${base64Image.substring(0, 50)}...`)
          }
          
          console.log('Sending OCR request:', {
            imageBase64Length: base64Image.length,
            imageBase64Prefix: base64Image.substring(0, 50),
            fileName: image.file.name,
            fileType: image.file.type,
            base64Valid: base64Regex.test(base64Image)
          })
          
          // Call Ali Cloud Vision OCR API
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Idempotency-Key': crypto.randomUUID(),
          }
          
          // Add Authorization header if user is authenticated
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
          
          const response = await fetchQueuedOCR('/api/ocr/ali_vl', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              imageBase64: base64Image
            })
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            if (response.status === 402 && errorData.errorCode === 'IMAGE_ALLOWANCE_EXHAUSTED') setAllowanceExhausted(true)
            throw new OCRRequestError(errorData.message || errorData.error || `HTTP error: ${response.status}`, errorData.errorCode)
          }
          const ocrResult = await response.json()
          window.dispatchEvent(new Event('billing:refresh'))
          const processingTime = Date.now() - startTime
          
          if (ocrResult.success) {
            // Update with success result from Ali Cloud Vision API
            results[i] = {
              ...processingResult,
              text: ocrResult.result.text || '',
              confidence: ocrResult.result.confidence || 0,
              language: ocrResult.result.language || 'zh',
              processingTime,
              status: 'success'
            }
          } else {
            throw new Error(ocrResult.error || 'OCR processing failed')
          }
          
          setMultiResults([...results])
          
        } catch (error) {
          console.error(`OCR processing failed for image ${i + 1}:`, error)
          results[i] = {
            ...results[i],
            status: 'error',
            error: error instanceof Error ? error.message : 'Processing failed',
            errorCode: error instanceof OCRRequestError ? error.errorCode : undefined
          }
          setMultiResults([...results])
        }
      })
      
      const succeeded = results.filter(r => r.status === 'success').length
      toast.info(`${succeeded} of ${multiImages.length} images processed successfully.`)
      
    } catch (error) {
      console.error('Multi OCR processing failed:', error)
      toast.error(error instanceof Error ? error.message : 'OCR processing failed, please try again')
      setViewMode('multi-preview')
    } finally {
      setIsMultiProcessing(false)
      window.dispatchEvent(new Event('billing:refresh'))
    }
  }, [multiImages, multiResults, session?.access_token])

  // Removed handleModeSwitch - unified to multi-image mode only

  return (
    <div className="optical-workbench space-y-6">
      <Balance />
      {allowanceExhausted && <div role="alert" className="rounded-xl border p-4 text-sm">
        <p>{session ? 'Buy an image pack to continue, or wait for your daily free images to reset.' : `You have used your daily guest allowance of ${GUEST_DAILY_LIMIT} free image. Sign in with Google to use the rest of your ${USER_DAILY_LIMIT}-image daily free allowance, or buy an image pack.`}</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {!session && <Link href="/login?next=%2Focr" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">Sign in ↗</Link>}
          <Link href="/pricing" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">Buy image packs ↗</Link>
        </div>
        <p className="mt-2 text-muted-foreground">Your selected images stay in this tab.</p>
      </div>}
      {/* Removed single image mode - unified to multi-image mode only */}

      {/* Multi Image Upload Mode */}
      {viewMode === 'multi-upload' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Images className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Select Multiple Images</h3>
          </div>
          <MultiImageUpload
            onFilesChange={setMultiImages}
            selectedFiles={multiImages}
            maxFiles={10}
          />
        </div>
      )}

      {/* Multi Image Preview Mode */}
      {viewMode === 'multi-preview' && (
        <MultiImagePreview
          images={multiImages}
          onImagesChange={setMultiImages}
          onConvert={() => processMultiOCR()}
          isProcessing={isMultiProcessing}
        />
      )}

      {/* Multi Image Result Mode */}
      {viewMode === 'multi-result' && (
        <MultiImageResult
          images={multiImages}
          results={multiResults}
          onBack={() => setViewMode('multi-preview')}
        />
      )}
    </div>
  )
}
