'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileImage, Zap, Plus, Trash2, X, Upload, AlertCircle } from 'lucide-react'
import { validateImageFile, formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageFile {
  id: string
  file: File
  preview: string
  selected: boolean
}

interface MultiImagePreviewProps {
  images: ImageFile[]
  onImagesChange: (images: ImageFile[]) => void
  onBack: () => void
  onConvert: (images: ImageFile[]) => void
  isProcessing?: boolean
}

export function MultiImagePreview({
  images,
  onImagesChange,
  onConvert,
  onBack,
  isProcessing = false
}: MultiImagePreviewProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createImageFile = useCallback((file: File): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          selected: false
        })
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFilesSelect = useCallback(async (files: File[]) => {
    const validFiles: File[] = []
    
    for (const file of files) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    const imageFiles = await Promise.all(validFiles.map(createImageFile))
    const newFiles = [...images, ...imageFiles]
    onImagesChange(newFiles)
    toast.success(`${validFiles.length} file(s) added successfully`)
  }, [images, onImagesChange, createImageFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFilesSelect(files)
    }
  }, [handleFilesSelect])

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
      handleFilesSelect(Array.from(files))
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFilesSelect])

  const handleAddClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }, [isProcessing])

  const handleRemoveFile = useCallback((fileId: string) => {
    const newFiles = images.filter(f => f.id !== fileId)
    onImagesChange(newFiles)
    toast.success('File removed')
  }, [images, onImagesChange])

  const handleToggleSelection = useCallback((fileId: string) => {
    const newFiles = images.map(f => 
      f.id === fileId ? { ...f, selected: !f.selected } : f
    )
    onImagesChange(newFiles)
  }, [images, onImagesChange])

  const handleDeleteSelected = useCallback(() => {
    const selectedImages = images.filter(f => f.selected)
    if (selectedImages.length === 0) {
      toast.error('Please select images to delete')
      return
    }
    
    const newFiles = images.filter(f => !f.selected)
    onImagesChange(newFiles)
    toast.success(`${selectedImages.length} file(s) deleted`)
  }, [images, onImagesChange])

  const handleConvert = () => {
    if (images.length === 0) {
      toast.error('Please add images first')
      return
    }
    onConvert(images)
  }

  const selectedCount = images.filter(f => f.selected).length

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
        multiple
      />

      {/* Header with image count and action buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary" className="text-sm">
                {images.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddClick}
                disabled={isProcessing}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isProcessing || selectedCount === 0}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card
          className={`cursor-pointer transition-all duration-200 hover:border-blue-400 ${isDragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : ''} ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleAddClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-12 text-center">
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragOver ? 'text-blue-500' : 'text-muted-foreground'}`} />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {isDragOver ? 'Drop your images here' : 'No images selected'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-4">
              <AlertCircle className="h-3 w-3" />
              <span>Supports: JPG, PNG, WebP, BMP, TIFF</span>
            </div>
            <Button onClick={handleAddClick} disabled={isProcessing}>
              <Plus className="h-4 w-4 mr-1" />
              Add Images
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageFile) => (
            <Card 
              key={imageFile.id} 
              className={`relative cursor-pointer transition-all duration-200 ${
                imageFile.selected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:shadow-md'
              }`}
              onClick={() => handleToggleSelection(imageFile.id)}
            >
              <CardContent className="p-3">
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    imageFile.selected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}>
                    {imageFile.selected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(imageFile.id)
                  }}
                  disabled={isProcessing}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Image Preview */}
                <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden mb-2">
                  <Image
                    src={imageFile.preview}
                    alt={imageFile.file.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {imageFile.file.name.length > 15 
                      ? `${imageFile.file.name.substring(0, 12)}...` 
                      : imageFile.file.name
                    }
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(imageFile.file.size)}</span>
                    <span>4000 x 6000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Convert Button */}
      <div className="text-center">
        <Button
          onClick={handleConvert}
          disabled={images.length === 0 || isProcessing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
        >
          <Zap className="h-5 w-5 mr-2" />
          {isProcessing ? 'Converting...' : 'Convert'}
        </Button>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Processing images...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}