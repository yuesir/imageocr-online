'use client'

import { useState } from 'react'
import { Copy, Download, Edit3, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { copyToClipboard, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { ChangeEvent } from 'react'

interface OCRResultProps {
  result: {
    id: string
    text: string
    confidence: number
    language: string
    processingTime: number
    status: string
    createdAt?: string
  }
  onClose?: () => void
  onSave?: (text: string) => void
  className?: string
}

export function OCRResult({
  result,
  onClose,
  onSave,
  className = ''
}: OCRResultProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(result.text)
  const [isSaving, setIsSaving] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(editedText)
      toast.success('Text copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-result-${result.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Text downloaded')
  }

  const handleSave = async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave(editedText)
      setIsEditing(false)
      toast.success('Changes saved')
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedText(result.text)
    setIsEditing(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          Extracted Text
        </CardTitle>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* OCR Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold text-foreground">
              {Math.round(result.confidence * 100)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Language</p>
            <p className="text-lg font-semibold text-foreground uppercase">
              {result.language}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
            <p className="text-lg font-semibold text-foreground">
              {(result.processingTime / 1000).toFixed(1)}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-green-600 capitalize">
              {result.status}
            </p>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Extracted Text ({editedText.length} characters)
          </label>
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full min-h-[300px] p-4 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Edit the extracted text..."
            />
          ) : (
            <div className="w-full min-h-[300px] p-4 border border-input bg-muted/30 rounded-md whitespace-pre-wrap font-mono text-sm">
              {editedText || 'No text extracted'}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {result.createdAt && (
          <div className="text-xs text-muted-foreground text-right">
            Processed on {formatDate(result.createdAt)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}