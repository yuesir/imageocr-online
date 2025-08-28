'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'

interface OCRResult {
  text: string
  confidence: number
}

const ReceiptOCR: React.FC = () => {
  const [viewMode, setViewMode] = useState<'upload' | 'preview' | 'result'>('upload')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      return validTypes.includes(file.type)
    })
    
    if (validFiles.length === 0) {
      setError('Please select valid image files (JPG, PNG) or PDF files.')
      return
    }
    
    setSelectedImages(validFiles)
    setViewMode('preview')
    setError(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const processOCR = async () => {
    if (selectedImages.length === 0) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const results: OCRResult[] = []
      
      for (const image of selectedImages) {
        const base64Image = await convertToBase64(image)
        
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            imageType: image.type
          })
        })
        
        if (!response.ok) {
          throw new Error(`OCR processing failed: ${response.statusText}`)
        }
        
        const data = await response.json()
        results.push({
          text: data.text || 'No text detected in this receipt.',
          confidence: data.confidence || 0
        })
      }
      
      setOcrResults(results)
      setViewMode('result')
    } catch (error) {
      console.error('OCR Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process receipt. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const resetToUpload = () => {
    setViewMode('upload')
    setSelectedImages([])
    setOcrResults([])
    setError(null)
  }

  if (viewMode === 'upload') {
    return (
      <div className="max-w-4xl mx-auto">
        <div 
          className="border-2 border-dashed border-green-300 rounded-lg p-12 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('receipt-file-input')?.click()}
        >
          <Upload className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Upload Your Receipt Images
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop your receipt files here, or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports: JPG, PNG, PDF • Max file size: 10MB
          </p>
          <input
            id="receipt-file-input"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    )
  }

  if (viewMode === 'preview') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Receipt Preview ({selectedImages.length} file{selectedImages.length > 1 ? 's' : ''})
            </h3>
            <button
              onClick={resetToUpload}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Upload
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedImages.map((file, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={processOCR}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Receipt...</span>
                </>
              ) : (
                <span>Convert Receipt to Text</span>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (viewMode === 'result') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Receipt OCR Results
            </h3>
            <button
              onClick={resetToUpload}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Process New Receipt
            </button>
          </div>
          
          <div className="space-y-6">
            {ocrResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">
                    Receipt {index + 1} - {selectedImages[index]?.name}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(result.text)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {result.text}
                  </pre>
                </div>
                
                {result.confidence > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
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

export default ReceiptOCR