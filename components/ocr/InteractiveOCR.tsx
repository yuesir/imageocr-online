'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/src/components/MultiImagePreview'
import { MultiImageResult } from '@/src/components/MultiImageResult'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Images } from 'lucide-react'
import { toast } from 'sonner'
import { createWorker } from 'tesseract.js'

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
  // Multi image mode states (unified approach)
  const [viewMode, setViewMode] = useState<ViewMode>('multi-upload')
  const [multiImages, setMultiImages] = useState<ImageFile[]>([])
  const [multiResults, setMultiResults] = useState<MultiOCRResult[]>([])
  const [isMultiProcessing, setIsMultiProcessing] = useState(false)

  // Removed single image mode handlers - unified to multi-image approach

  // Multi-image handlers
  const handleMultiFileSelect = useCallback((files: File[]) => {
    const imageFiles: ImageFile[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      selected: false
    }))
    setMultiImages(prev => {
      const newImages = [...prev, ...imageFiles]
      return newImages
    })
  }, [])

  // Auto-switch to preview mode when images are added
  useEffect(() => {
    if (multiImages.length > 0 && viewMode === 'multi-upload') {
      setViewMode('multi-preview')
    }
  }, [multiImages.length, viewMode])

  const handleImageToggle = useCallback((imageId: string) => {
    setMultiImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, selected: !img.selected } : img
    ))
  }, [])

  const handleDeleteSelected = useCallback(() => {
    setMultiImages(prev => {
      const remaining = prev.filter(img => !img.selected)
      // Clean up object URLs for deleted images
      prev.filter(img => img.selected).forEach(img => {
        URL.revokeObjectURL(img.preview)
      })
      return remaining
    })
  }, [])

  const handleAddMoreImages = useCallback((files: File[]) => {
    const imageFiles: ImageFile[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      selected: false
    }))
    setMultiImages(prev => [...prev, ...imageFiles])
  }, [])

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
      const worker = await createWorker('eng+chi_sim', 1, {
        workerPath: 'https://unpkg.com/tesseract.js@5.0.4/dist/worker.min.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        corePath: 'https://unpkg.com/tesseract.js-core@5.0.0/tesseract-core-simd.wasm.js'
      })

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
            language: 'eng',
            processingTime: 0,
            status: 'processing'
          }
          results.push(processingResult)
          setMultiResults([...results])
          
          const { data } = await worker.recognize(image.file)
          const processingTime = Date.now() - startTime
          
          // Update with success result
          results[i] = {
            ...processingResult,
            text: data.text.trim(),
            confidence: data.confidence / 100,
            processingTime,
            status: 'success'
          }
          setMultiResults([...results])
          
        } catch (error) {
          console.error(`OCR processing failed for image ${i + 1}:`, error)
          results[i] = {
            ...results[i],
            status: 'error',
            error: 'Processing failed'
          }
          setMultiResults([...results])
        }
      }
      
      await worker.terminate()
      toast.success(`Completed processing ${multiImages.length} images`)
      
    } catch (error) {
      console.error('Multi OCR processing failed:', error)
      toast.error('OCR processing failed, please try again')
    } finally {
      setIsMultiProcessing(false)
    }
  }, [multiImages])

  // Removed handleModeSwitch - unified to multi-image mode only

  return (
    <div className="space-y-6">
      {/* Removed single image mode - unified to multi-image mode only */}

      {/* Multi Image Upload Mode */}
      {viewMode === 'multi-upload' && multiImages.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Images className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Select Multiple Images</h3>
          </div>
          <MultiImageUpload
            onFilesSelect={handleMultiFileSelect}
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
          onBack={() => setViewMode('multi-upload')}
          onConvert={processMultiOCR}
          isProcessing={isMultiProcessing}
        />
      )}

      {/* Multi Image Result Mode */}
      {viewMode === 'multi-result' && (
        <MultiImageResult
          images={multiImages}
          results={multiResults}
          isProcessing={isMultiProcessing}
          onBack={() => setViewMode('multi-preview')}
          onAddMore={() => setViewMode('multi-upload')}
          onImageToggle={handleImageToggle}
        />
      )}
    </div>
  )
}