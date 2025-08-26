'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Metadata } from 'next'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { OCRResult } from '@/components/ocr/OCRResult'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChangeEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
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

export default function OCRPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [ocrResult, setOcrResult] = useState<OCRResultData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

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
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedFile(data.file)
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleProcessOCR = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileId: uploadedFile.id,
          imageUrl: uploadedFile.url
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'OCR processing failed')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <ThemeToggle />
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">OCR Processing</h1>
            <p className="text-lg text-muted-foreground">
              Extract text from your images with AI-powered OCR
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                  1
                </div>
                <h3 className="font-semibold text-sm">Upload Image</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select your image file
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${uploadedFile ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold ${
                  uploadedFile ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <h3 className="font-semibold text-sm">Process OCR</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Extract text from image
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${ocrResult ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold ${
                  ocrResult ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
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
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">
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
                      className="bg-blue-600 hover:bg-blue-700"
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI algorithms for quick and accurate text extraction
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your files are processed securely and deleted after processing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
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