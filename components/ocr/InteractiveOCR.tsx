'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/components/MultiImagePreview'
import { MultiImageResult } from '@/components/MultiImageResult'
import { Images } from 'lucide-react'
import { toast } from 'sonner'
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
  status: 'success' | 'error' | 'processing'
  error?: string
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

    setIsMultiProcessing(true)
    setMultiResults([])
    setViewMode('multi-result')

    try {
      toast.info('Initializing OCR engine...')
      
      const results: MultiOCRResult[] = []
      
      for (let i = 0; i < multiImages.length; i++) {
        const image = multiImages[i]
        const startTime = Date.now()
        
        try {
          toast.info(`Processing image ${i + 1} of ${multiImages.length}...`)
          
          // Add processing result
          const processingResult: MultiOCRResult = {
            id: Date.now().toString() + i,
            imageId: image.id,
            text: '',
            confidence: 0,
            language: 'zh',
            processingTime: 0,
            status: 'processing'
          }
          results.push(processingResult)
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
          }
          
          // Add Authorization header if user is authenticated
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
          
          const response = await fetch('/api/ocr/ali_vl', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              imageBase64: base64Image
            })
          })
          
          if (!response.ok) {
            // 尝试解析错误响应中的message字段
            try {
              const errorData = await response.json()
              if (errorData.message) {
                throw new Error(errorData.message)
              } else if (errorData.error) {
                throw new Error(errorData.error)
              } else {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
            } catch {
              // 如果解析失败，使用默认错误信息
              throw new Error(`HTTP error! status: ${response.status}`)
            }
          }
          
          const ocrResult = await response.json()
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
            error: error instanceof Error ? error.message : 'Processing failed'
          }
          setMultiResults([...results])
        }
      }
      
      toast.success(`Completed processing ${multiImages.length} images`)
      
    } catch (error) {
      console.error('Multi OCR processing failed:', error)
      toast.error('OCR processing failed, please try again')
    } finally {
      setIsMultiProcessing(false)
    }
  }, [multiImages, session?.access_token])

  // Removed handleModeSwitch - unified to multi-image mode only

  return (
    <div className="space-y-6">
      {/* Removed single image mode - unified to multi-image mode only */}

      {/* Multi Image Upload Mode */}
      {viewMode === 'multi-upload' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Images className="h-5 w-5 text-blue-600" />
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