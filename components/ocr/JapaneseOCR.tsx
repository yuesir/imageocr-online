'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileImage, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/components/MultiImagePreview'
import { MultiImageResult } from '@/components/MultiImageResult'

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

export function JapaneseOCR() {
  const [viewMode, setViewMode] = useState<ViewMode>('multi-upload')
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([])
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Auto-switch to preview mode when images are added
  useEffect(() => {
    if (selectedImages.length > 0 && viewMode === 'multi-upload') {
      setViewMode('multi-preview')
    }
  }, [selectedImages.length, viewMode])

  const handleAddMoreImages = () => {
    setViewMode('multi-upload')
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Keep the full data URL format for Tencent Cloud OCR API
        resolve(result)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleProcessImages = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select images with Japanese text first')
      return
    }

    setIsProcessing(true)
    setViewMode('multi-result')
    setProcessingProgress(0)
    const results: OCRResult[] = []

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
        
        toast.info(`Processing Japanese text ${i + 1} of ${selectedImages.length}: ${image.file.name}`)

        try {
          const base64Image = await fileToBase64(image.file)
          
          const response = await fetch('/api/ocr/tencent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageBase64: base64Image,
              language: 'ja' // Specify Japanese language for better recognition
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
          const processingTime = Date.now() - Date.now()
          
          if (ocrResult.success) {
            // Update with success result
            results.push({
              id: Date.now().toString() + i,
              imageId: image.id,
              text: ocrResult.result.text || '',
              confidence: ocrResult.result.confidence || 0,
              language: ocrResult.result.language || 'ja',
              processingTime,
              status: 'success'
            })
            toast.success(`Successfully extracted Japanese text from ${image.file.name}`)
          } else {
            throw new Error(ocrResult.error || 'Japanese OCR processing failed')
          }
        } catch (error) {
          console.error(`Japanese OCR processing failed for image ${i + 1}:`, error)
          results.push({
            id: Date.now().toString() + i,
            imageId: image.id,
            text: '',
            confidence: 0,
            language: 'ja',
            processingTime: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Japanese text processing failed'
          })
        }
      }

      setOcrResults(results)
      toast.success(`Completed processing ${selectedImages.length} images with Japanese text`)
    } catch (error) {
      console.error('Multi Japanese OCR processing failed:', error)
      toast.error('Japanese OCR processing failed, please try again')
    } finally {
      setIsProcessing(false)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [selectedImages])

  return (
    <div className="w-full max-w-6xl mx-auto" id="japanese-ocr-section">
      <Card className="border-2 border-dashed border-purple-300 dark:border-purple-600">
        <CardContent className="p-8">
          {viewMode === 'multi-upload' && selectedImages.length === 0 && (
            <div className="text-center">
              <div className="mb-8">
                <FileImage className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Upload Images with Japanese Text</h3>
                <p className="text-muted-foreground mb-6">
                  Select images containing Japanese characters (Hiragana, Katakana, Kanji). Maximum 10MB per file, up to 50 files.
                </p>
              </div>
              
              <MultiImageUpload 
                onFilesChange={setSelectedImages}
                selectedFiles={selectedImages}
                isProcessing={isProcessing}
                maxFiles={10}
              />
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2"><strong>Supported:</strong> JPG, PNG, BMP, TIFF, WebP files</p>
                <p className="mb-2"><strong>File Size:</strong> Up to 10MB per image</p>
                <p className="mb-2"><strong>Japanese Text:</strong> Supports Hiragana (ひらがな), Katakana (カタカナ), and Kanji (漢字)</p>
                <p><strong>Batch Processing:</strong> Up to 50 images at once</p>
              </div>
            </div>
          )}

          {/* Multi Image Preview Mode */}
          {viewMode === 'multi-preview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">Japanese Text Images Preview</h3>
                  <p className="text-muted-foreground">
                    {selectedImages.length} image(s) selected. Review and process to extract Japanese text.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleAddMoreImages}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add More Images
                  </Button>
                  <Button 
                    onClick={handleProcessImages}
                    disabled={isProcessing || selectedImages.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing... ({Math.round(processingProgress)}%)
                      </>
                    ) : (
                      <>
                        <FileImage className="mr-2 h-4 w-4" />
                        Extract Japanese Text ({selectedImages.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <MultiImagePreview 
                images={selectedImages}
                onImagesChange={setSelectedImages}
                onConvert={handleProcessImages}
                isProcessing={isProcessing}
              />
              
              {isProcessing && (
                <div className="mt-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Processing Japanese Text Images...
                      </span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">
                        {Math.round(processingProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multi Image Result Mode */}
          {viewMode === 'multi-result' && (
            <MultiImageResult
              images={selectedImages}
              results={ocrResults}
              onBack={() => setViewMode('multi-preview')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}