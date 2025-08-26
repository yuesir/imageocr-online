'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileImage, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { validateImageFile, formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
  isProcessing?: boolean
  className?: string
}

export function ImageUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isProcessing = false,
  className = ''
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file')
      return
    }
    onFileSelect(file)
    toast.success('File selected successfully')
  }, [onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }, [isProcessing])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onFileRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('File removed')
  }, [onFileRemove])

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      {selectedFile ? (
        <Card className="relative">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <FileImage className="h-12 w-12 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile.type}
                </p>
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`cursor-pointer transition-all duration-200 hover:border-blue-400 ${
            isDragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : ''
          } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-12">
            <div className="text-center">
              <Upload className={`mx-auto h-12 w-12 mb-4 ${
                isDragOver ? 'text-blue-500' : 'text-muted-foreground'
              }`} />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isDragOver ? 'Drop your image here' : 'Upload an image'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>
                  Supports: JPG, PNG, WebP, BMP, TIFF (max {process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10MB'})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}