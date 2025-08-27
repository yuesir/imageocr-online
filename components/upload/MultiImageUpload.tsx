'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileImage, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { validateImageFile, formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageFile {
  id: string
  file: File
  preview: string
  selected: boolean
}

interface MultiImageUploadProps {
  onFilesChange: (files: ImageFile[]) => void
  onFilesSelect?: (files: File[]) => void
  selectedFiles: ImageFile[]
  isProcessing?: boolean
  className?: string
  maxFiles?: number
}

export function MultiImageUpload({
  onFilesChange,
  onFilesSelect,
  selectedFiles,
  isProcessing = false,
  className = '',
  maxFiles = 10
}: MultiImageUploadProps) {
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

    if (selectedFiles.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    const imageFiles = await Promise.all(validFiles.map(createImageFile))
    const newFiles = [...selectedFiles, ...imageFiles]
    onFilesChange(newFiles)
    toast.success(`${validFiles.length} file(s) added successfully`)
  }, [selectedFiles, maxFiles, onFilesChange, createImageFile])

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
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFilesSelect])

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }, [isProcessing])

  const handleRemoveFile = useCallback((fileId: string) => {
    const newFiles = selectedFiles.filter(f => f.id !== fileId)
    onFilesChange(newFiles)
    toast.success('File removed')
  }, [selectedFiles, onFilesChange])

  const handleToggleSelection = useCallback((fileId: string) => {
    const newFiles = selectedFiles.map(f => 
      f.id === fileId ? { ...f, selected: !f.selected } : f
    )
    onFilesChange(newFiles)
  }, [selectedFiles, onFilesChange])

  const handleSelectAll = useCallback(() => {
    const allSelected = selectedFiles.every(f => f.selected)
    const newFiles = selectedFiles.map(f => ({ ...f, selected: !allSelected }))
    onFilesChange(newFiles)
  }, [selectedFiles, onFilesChange])

  const handleDeleteSelected = useCallback(() => {
    const newFiles = selectedFiles.filter(f => !f.selected)
    onFilesChange(newFiles)
    const deletedCount = selectedFiles.length - newFiles.length
    toast.success(`${deletedCount} file(s) deleted`)
  }, [selectedFiles, onFilesChange])

  const selectedCount = selectedFiles.filter(f => f.selected).length
  const allSelected = selectedFiles.length > 0 && selectedFiles.every(f => f.selected)

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
        multiple
      />
      
      {/* Upload Area */}
      <Card
        className={`cursor-pointer transition-all duration-200 hover:border-blue-400 mb-4 ${
          isDragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : ''
        } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className={`mx-auto h-10 w-10 mb-3 ${
              isDragOver ? 'text-blue-500' : 'text-muted-foreground'
            }`} />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragOver ? 'Drop your images here' : 'Upload Images'}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop your images here, or click to browse
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>
                Supports: JPG, PNG, WebP, BMP, TIFF (max {maxFiles} files, {process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10MB'} each)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {selectedFiles.length} file(s) uploaded
              </span>
              {selectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({selectedCount} selected)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isProcessing}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={isProcessing}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedCount})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={isProcessing || selectedFiles.length >= maxFiles}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add More
              </Button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((imageFile) => (
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
                      {imageFile.file.name}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(imageFile.file.size)}</span>
                      <span>{imageFile.file.type.split('/')[1]?.toUpperCase()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}