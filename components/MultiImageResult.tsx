'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Eye, 
  FileText, 
  Clock,
  Languages,
  Percent,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface OCRResult {
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

interface ImageFile {
  id: string
  file: File
  preview: string
  selected: boolean
}

interface MultiImageResultProps {
  images: ImageFile[]
  results: OCRResult[]
  onBack: () => void
  onRetry?: (imageIds: string[]) => void
}

export function MultiImageResult({
  images,
  results,
  onBack,
  onRetry
}: MultiImageResultProps) {
  const [editingResults, setEditingResults] = useState<Record<string, string>>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard')
  }

  const handleDownloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename.replace(/\.[^/.]+$/, '')}_ocr.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Text file downloaded')
  }

  const handleEditStart = (resultId: string, currentText: string) => {
    setEditingResults(prev => ({ ...prev, [resultId]: currentText }))
  }

  const handleEditSave = (resultId: string) => {
    // In a real app, you would save this to your state management or backend
    setEditingResults(prev => {
      const { [resultId]: _, ...rest } = prev
      return rest
    })
    toast.success('Text saved')
  }

  const handleEditCancel = (resultId: string) => {
    setEditingResults(prev => {
      const { [resultId]: _, ...rest } = prev
      return rest
    })
  }

  const handlePreviewImage = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (image) {
      setPreviewImage(image.preview)
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">OCR Results</h2>
            <Badge variant="secondary">{results.filter(result => result.status === 'success' || result.status === 'error').length} / {images.length} processed</Badge>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {images.map((image) => {
          const result = results.find(r => r.imageId === image.id)
          
          return (
            <Card key={image.id} className="overflow-hidden">
              {/* Header with filename and action buttons */}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium truncate">
                    {image.file.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewImage(image.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {result && result.status === 'success' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyText(editingResults[result.id] || result.text)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadText(
                            editingResults[result.id] || result.text,
                            image.file.name
                          )}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Image Preview */}
                  <div className="space-y-2">
                    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={image.preview}
                        alt={image.file.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {result && result.status === 'success' && (
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Percent className="h-3 w-3" />
                          <span>{result.confidence}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Languages className="h-3 w-3" />
                          <span>{result.language}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{result.processingTime}ms</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: OCR Text */}
                  <div className="space-y-2">
                    {result ? (
                      result.status === 'success' ? (
                        <div className="space-y-2">
                          {editingResults[result.id] !== undefined ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editingResults[result.id]}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingResults(prev => ({
                                  ...prev,
                                  [result.id]: e.target.value
                                }))}
                                className="min-h-[200px] font-mono text-sm"
                                placeholder="Extracted text will appear here..."
                              />
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleEditSave(result.id)}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCancel(result.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="min-h-[200px] p-3 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">
                                {result.text || 'No text detected'}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => handleEditStart(result.id, result.text)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : result.status === 'error' ? (
                        <div className="flex items-center justify-center h-[200px] text-center">
                          <div>
                            <div className="text-destructive mb-2">{result.errorCode === 'IMAGE_ALLOWANCE_EXHAUSTED' ? 'Image allowance used' : result.errorCode?.startsWith('ALLOWANCE_') ? 'Image allowance unavailable' : 'Processing failed'}</div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {result.error || 'An error occurred during processing'}
                            </p>
                            {onRetry && (
                              <Button
                                variant="outline"
                                onClick={() => onRetry([result.imageId])}
                              >
                                Retry
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[200px] text-center">
                          <div>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-border mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">{result.status === 'queued' ? 'Queued — waiting for an available slot' : 'Processing...'}</p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-center">
                        <div>
                          <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No result available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}