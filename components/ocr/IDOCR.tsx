'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, Download, Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface OCRResult {
  text: string
  confidence: number
}

interface SelectedImage {
  file: File
  preview: string
}

export default function IDOCR() {
  const [viewMode, setViewMode] = useState<'upload' | 'preview' | 'result'>('upload')
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a supported format`)
        return false
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`)
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    const newImages: SelectedImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setSelectedImages(newImages)
    setViewMode('preview')
    setOcrResults([])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleConvert = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one ID document image')
      return
    }

    setIsProcessing(true)
    const results: OCRResult[] = []

    try {
      for (const image of selectedImages) {
        const base64 = await convertToBase64(image.file)
        
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            type: 'id_document'
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to process ${image.file.name}`)
        }

        const data = await response.json()
        results.push({
          text: data.text || 'No text detected in this ID document',
          confidence: data.confidence || 0
        })
      }

      setOcrResults(results)
      setViewMode('result')
      toast.success('ID document text extracted successfully!')
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('Failed to extract text from ID document. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  }

  const downloadText = (text: string, index: number) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `id-document-text-${index + 1}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Text file downloaded!')
  }

  const resetUpload = () => {
    setSelectedImages([])
    setOcrResults([])
    setViewMode('upload')
    setShowPreview(true)
  }

  if (viewMode === 'upload') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Upload Your ID Document
            </h2>
            <p className="text-gray-600">
              Drag and drop your ID document images here, or click to browse
            </p>
          </div>

          <div
            className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              Drop your ID document images here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPG, PNG, PDF • Max 10MB per file
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Choose Files
            </button>
          </div>

          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>✓ Secure processing • ✓ No data stored • ✓ Free to use</p>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'preview') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Preview Your ID Document Images
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={resetUpload}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Upload Different Images
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedImages.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img
                    src={image.preview}
                    alt={`ID document ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-600 truncate">
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing ID Document...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Extract Text from ID Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'result') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Extracted ID Document Text
            </h2>
            <button
              onClick={resetUpload}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Process New Document
            </button>
          </div>

          <div className="space-y-6">
            {ocrResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Document {index + 1} - {selectedImages[index]?.file.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(result.text)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadText(result.text, index)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {result.text}
                  </pre>
                </div>
                
                {result.confidence > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}