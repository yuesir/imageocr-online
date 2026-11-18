'use client'

import { OCRPrivacyLink } from '@/components/ocr/OCRServiceInfo'
import { Balance } from '@/components/billing/Balance'

import { useState } from 'react'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { OCRResult } from '@/components/ocr/OCRResult'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, Zap, Clock, Shield } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface UploadedFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
}

interface OCRResultData {
  id: string
  text: string
  confidence: number
  language: string
  processingTime: number
  status: string
  createdAt?: string
}

interface OCRRequestBody {
  fileId?: string
  imageBase64?: string
}

export default function OCRPage() {
  const { user, session } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [ocrResult, setOcrResult] = useState<OCRResultData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Allow both authenticated and unauthenticated users
  // Unauthenticated users can use OCR with daily limits

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setUploadedFile(null)
    setOcrResult(null)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setUploadedFile(null)
    setOcrResult(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // For authenticated users, upload to server
      if (user) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
          body: formData
        })

        const data = await response.json()
      window.dispatchEvent(new Event('billing:refresh'))

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        setUploadedFile(data.file)
        toast.success('File uploaded successfully')
      } else {
        // For unauthenticated users, create a mock uploaded file object
        // We'll convert to Base64 during OCR processing
        const mockFile: UploadedFile = {
          id: 'temp-' + Date.now(),
          filename: selectedFile.name,
          url: URL.createObjectURL(selectedFile),
          size: selectedFile.size,
          type: selectedFile.type
        }
        setUploadedFile(mockFile)
        toast.success('File ready for processing')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleProcessOCR = async () => {
    if (!uploadedFile || !selectedFile) return

    setIsProcessing(true)
    try {
      let requestBody: OCRRequestBody

      // For authenticated users, use fileId
      if (user) {
        requestBody = {
          fileId: uploadedFile.id
        }
      } else {
        // For unauthenticated users, convert to Base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            // Keep the full data URL format for Ali Cloud Vision API
            // Required format: data:image/[type];base64,[data]
            resolve(result)
          }
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })

        requestBody = {
          imageBase64: base64
        }
      }

      const response = await fetch('/api/ocr/ali_vl', {
        method: 'POST',
        headers: {
          'Idempotency-Key': crypto.randomUUID(),
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      window.dispatchEvent(new Event('billing:refresh'))

      if (!response.ok) {
        // Handle daily limit exceeded
        if (response.status === 429) {
          toast.error(data.message || 'Daily usage limit exceeded. Please try again tomorrow or sign in for 4 daily free images or buy an image pack.')
        } else {
          throw new Error(data.error || 'OCR processing failed')
        }
        return
      }

      setOcrResult({
        ...data.result,
        createdAt: new Date().toISOString()
      })
      toast.success('Text extracted successfully')
    } catch (error) {
      console.error('OCR error:', error)
      toast.error(error instanceof Error ? error.message : 'OCR processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveResult = async (text: string) => {
    // This would typically save the edited text back to the database
    console.log('Saving edited text:', text)
    // For now, just update the local state
    if (ocrResult) {
      setOcrResult({ ...ocrResult, text })
    }
  }

  const handleStartOver = () => {
    setSelectedFile(null)
    setUploadedFile(null)
    setOcrResult(null)
  }

  return (
    <div className="min-h-screen bg-background ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">OCR Processing</h1>
            <p className="text-lg text-muted-foreground">
              Extract text from your images with AI-powered OCR
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Balance />
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${selectedFile ? 'border-border bg-secondary ' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                  1
                </div>
                <h3 className="font-semibold text-sm">Upload Image</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select your image file
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${uploadedFile ? 'border-border bg-secondary ' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold ${
                  uploadedFile ? 'bg-primary text-white' : 'bg-foreground text-muted-foreground'
                }`}>
                  2
                </div>
                <h3 className="font-semibold text-sm">Process OCR</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Extract text from image
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${ocrResult ? 'border-border bg-secondary ' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold ${
                  ocrResult ? 'bg-primary text-white' : 'bg-foreground text-muted-foreground'
                }`}>
                  3
                </div>
                <h3 className="font-semibold text-sm">Get Results</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Copy, edit, or download
                </p>
              </CardContent>
            </Card>
          </div>

          {/* File Upload */}
          {!ocrResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Upload Your Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Images uploaded while signed in are saved for this workflow, and extracted text can appear in your account history. See <OCRPrivacyLink />.
                </p>
                <ImageUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={selectedFile}
                  isProcessing={isUploading || isProcessing}
                />
                
                {selectedFile && !uploadedFile && (
                  <div className="text-center">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      size="lg"
                    >
                      {isUploading ? 'Uploading...' : 'Upload & Continue'}
                    </Button>
                  </div>
                )}
                
                {uploadedFile && (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-secondary  rounded-lg border border-border ">
                      <p className="text-sm text-sage  mb-2">
                        ✓ File uploaded successfully
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ready to process: {uploadedFile.filename}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleProcessOCR}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-primary hover:bg-primary"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Processing OCR...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Extract Text
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* OCR Results */}
          {ocrResult && (
            <div className="space-y-6">
              <OCRResult
                result={ocrResult}
                onSave={handleSaveResult}
              />
              
              <div className="text-center">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  size="lg"
                >
                  Process Another Image
                </Button>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI algorithms for quick and accurate text extraction
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-sage" />
              </div>
              <h3 className="font-semibold mb-2">Data Handling</h3>
              <p className="text-sm text-muted-foreground">
                <OCRPrivacyLink />
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Available</h3>
              <p className="text-sm text-muted-foreground">
                Process your images anytime, anywhere with our cloud service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}