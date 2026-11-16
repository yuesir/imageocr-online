'use client'

import { Balance } from '@/components/billing/Balance'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Loader2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { MultiImageUpload } from '@/components/upload/MultiImageUpload'
import { MultiImagePreview } from '@/components/MultiImagePreview'
import { MultiImageResult } from '@/components/MultiImageResult'
import { useAuth } from '@/hooks/useAuth'

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

export function CreditCardOCR() {
  // Auth hook
  const { user: _user, session } = useAuth()
  
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
      toast.error('Please select credit card images first')
      return
    }

    if (!window.confirm('Each successfully processed image uses 1 image allowance, including images with no text. Running images again uses another allowance. Continue?')) return
    setIsProcessing(true)
    setViewMode('multi-result')
    setProcessingProgress(0)
    const results: OCRResult[] = []

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
        
        toast.info(`Processing credit card ${i + 1} of ${selectedImages.length}: ${image.file.name}`)

        try {
          const base64Image = await fileToBase64(image.file)
          
          const headers: Record<string, string> = {
            'Idempotency-Key': crypto.randomUUID(),
          'Content-Type': 'application/json',
          }
          
          // Add Authorization header if user is authenticated
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
          
          const response = await fetch('/api/ocr/tencent', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              imageBase64: base64Image
            })
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || errorData.error || `HTTP error: ${response.status}`)
          }

          const ocrResult = await response.json()
          window.dispatchEvent(new Event('billing:refresh'))
          const processingTime = Date.now() - Date.now()
          
          if (ocrResult.success) {
            // Update with success result
            results.push({
              id: Date.now().toString() + i,
              imageId: image.id,
              text: ocrResult.result.text || '',
              confidence: ocrResult.result.confidence || 0,
              language: ocrResult.result.language || 'en',
              processingTime,
              status: 'success'
            })
            toast.success(`Successfully extracted text from ${image.file.name}`)
          } else {
            throw new Error(ocrResult.error || 'OCR processing failed')
          }
        } catch (error) {
          console.error(`OCR processing failed for image ${i + 1}:`, error)
          results.push({
            id: Date.now().toString() + i,
            imageId: image.id,
            text: '',
            confidence: 0,
            language: 'en',
            processingTime: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Processing failed'
          })
        }
      }

      setOcrResults(results)
      toast.success(`Completed processing ${selectedImages.length} credit card images`)
    } catch (error) {
      console.error('Multi OCR processing failed:', error)
      toast.error('OCR processing failed, please try again')
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
    <div className="w-full max-w-6xl mx-auto" id="credit-card-ocr-section">
      <Balance />
      <Card className="border-2 border-dashed border-border ">
        <CardContent className="p-8">
          {viewMode === 'multi-upload' && selectedImages.length === 0 && (
            <div className="text-center">
              <div className="mb-8">
                <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Upload Credit Card Images</h3>
                <p className="text-muted-foreground mb-6">
                  Select credit card images to extract text and information. Maximum 10MB per file, up to 50 files.
                </p>
              </div>
              
              <MultiImageUpload 
                onFilesChange={setSelectedImages}
                selectedFiles={selectedImages}
                isProcessing={isProcessing}
                maxFiles={10}
              />
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2"><strong>Supported:</strong> JPG, JPEG, PNG, BMP files</p>
                <p className="mb-2"><strong>File Size:</strong> Up to 10MB per image</p>
                <p className="mb-2"><strong>Security:</strong> Images are processed securely and never stored</p>
                <p><strong>Batch Processing:</strong> Up to 50 credit card images at once</p>
              </div>
            </div>
          )}

          {/* Multi Image Preview Mode */}
          {viewMode === 'multi-preview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">Credit Card Images Preview</h3>
                  <p className="text-muted-foreground">
                    {selectedImages.length} credit card image(s) selected. Review and process to extract text.
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
                    className="bg-primary hover:bg-primary"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Extract Text from Credit Cards
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
            </div>
          )}

          {/* Multi Result Mode */}
          {viewMode === 'multi-result' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">Credit Card OCR Results</h3>
                  <p className="text-muted-foreground">
                    Text extraction completed for {selectedImages.length} credit card image(s).
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleAddMoreImages}>
                    <Upload className="mr-2 h-4 w-4" />
                    Process More Credit Cards
                  </Button>
                </div>
              </div>
              
              {isProcessing && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing credit card images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(processingProgress)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <MultiImageResult 
                images={selectedImages}
                results={ocrResults}
                onBack={() => setViewMode('multi-preview')}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}