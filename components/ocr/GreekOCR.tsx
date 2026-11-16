'use client'

import { supabase } from '@/lib/supabase'
import { Balance } from '@/components/billing/Balance'

import { useState, useEffect } from 'react'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/components/MultiImagePreview'
import { MultiImageResult } from '@/components/MultiImageResult'
import { toast } from 'sonner'

type ViewMode = 'multi-upload' | 'multi-preview' | 'multi-result'

interface ImageFile {
  id: string
  file: File
  preview: string
  selected: boolean
}

interface OCRResult {
  id: string
  imageId: string
  text: string
  confidence: number
  language: string
  processingTime: number
  status: 'success' | 'error' | 'processing'
  error?: string
}

export function GreekOCR() {
  const [viewMode, setViewMode] = useState<ViewMode>('multi-upload')
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([])
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [_processingProgress, setProcessingProgress] = useState(0)

  const _handleImagesSelected = (files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      selected: true
    }))
    
    setSelectedImages(newImages)
    setViewMode('multi-preview')
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:image/jpeg;base64, prefix
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleProcessImages = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select images first')
      return
    }

    if (!window.confirm('Each successfully processed image uses 1 image allowance, including images with no text. Running images again uses another allowance. Continue?')) return
    setIsProcessing(true)
    setProcessingProgress(0)
    const results: OCRResult[] = []

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        const startTime = Date.now()
        
        try {
          // Convert image to base64
          const base64Image = await convertToBase64(image.file)
          
          // Call OCR API with Greek language specification
          const { data: { session } } = await supabase.auth.getSession()
          const response = await fetch('/api/ocr/tencent', {
            method: 'POST',
            headers: {
              ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
              'Idempotency-Key': crypto.randomUUID(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Image,
              language: 'ell', // Greek language code
              scene: 'general' // General scene for Greek text
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || errorData.error || `HTTP error: ${response.status}`)
          }

          const data = await response.json()
      window.dispatchEvent(new Event('billing:refresh'))
          const processingTime = Date.now() - startTime

          if (data.success && data.text) {
            results.push({
              id: Math.random().toString(36).substr(2, 9),
              imageId: image.id,
              text: data.text,
              confidence: data.confidence || 0.95,
              language: 'ell',
              processingTime,
              status: 'success'
            })
            toast.success(`Greek text extracted from image ${i + 1}`)
          } else {
            throw new Error(data.error || 'Failed to extract Greek text')
          }
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error)
          results.push({
            id: Math.random().toString(36).substr(2, 9),
            imageId: image.id,
            text: `Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`,
            confidence: 0,
            language: 'ell',
            processingTime: Date.now() - startTime,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          toast.error(`Failed to process image ${i + 1}`)
        }

        // Update progress
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
      }

      setOcrResults(results)
      setViewMode('multi-result')
      
      const successCount = results.filter(r => r.confidence > 0).length
      if (successCount > 0) {
        toast.success(`Successfully extracted Greek text from ${successCount} image(s)`)
      }
    } catch (error) {
      console.error('Error during Greek OCR processing:', error)
      toast.error('Failed to process images for Greek text extraction')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [selectedImages])

  return (
    <div className="w-full" id="greek-ocr-section">
      <Balance />
      {viewMode === 'multi-upload' && (
        <MultiImageUpload
          selectedFiles={selectedImages}
          onFilesChange={setSelectedImages}
          isProcessing={isProcessing}
          maxFiles={10}
        />
      )}

      {viewMode === 'multi-preview' && (
        <MultiImagePreview
          images={selectedImages}
          onImagesChange={setSelectedImages}
          onConvert={handleProcessImages}
          isProcessing={isProcessing}
        />
      )}

      {viewMode === 'multi-result' && (
        <MultiImageResult
          images={selectedImages}
          results={ocrResults}
          onBack={() => setViewMode('multi-upload')}
        />
      )}
    </div>
  )
}