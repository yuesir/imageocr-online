'use client'

import { useState, useCallback } from 'react'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { OCRResult } from '@/components/ocr/OCRResult'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Image as ImageIcon, FileText, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { createWorker } from 'tesseract.js'
import Image from 'next/image'

interface OCRResultData {
  id: string
  text: string
  confidence: number
  language: string
  processingTime: number
  status: string
  createdAt: string
}

export function InteractiveOCR() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<OCRResultData | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setOcrResult(null)
    
    // 创建图片预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setOcrResult(null)
    setProcessingProgress(0)
  }, [])

  const processOCR = useCallback(async () => {
    if (!selectedFile) {
      toast.error('请先选择一张图片')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    const startTime = Date.now()

    try {
      toast.info('正在初始化OCR引擎...')
      const worker = await createWorker('eng+chi_sim', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProcessingProgress(Math.round(m.progress * 100))
          }
        }
      })

      toast.info('正在识别文字...')
      const { data } = await worker.recognize(selectedFile)
      await worker.terminate()

      const processingTime = Date.now() - startTime
      const result: OCRResultData = {
        id: Date.now().toString(),
        text: data.text.trim(),
        confidence: data.confidence / 100,
        language: 'eng',
        processingTime,
        status: 'completed',
        createdAt: new Date().toISOString()
      }

      setOcrResult(result)
      toast.success(`文字识别完成！识别出 ${result.text.length} 个字符`)
    } catch (error) {
      console.error('OCR processing failed:', error)
      toast.error('文字识别失败，请重试')
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }, [selectedFile])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setOcrResult(null)
    setProcessingProgress(0)
  }, [])

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 文件上传 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">选择图片</h3>
          </div>
          <ImageUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
            isProcessing={isProcessing}
          />
        </div>

        {/* 图片预览 */}
        {imagePreview && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">图片预览</h3>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={processOCR}
                      disabled={isProcessing}
                      className="flex-1 max-w-xs"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          识别中... {processingProgress}%
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          开始识别
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isProcessing}
                    >
                      重新选择
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 处理进度 */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <div className="space-y-2">
                <p className="text-lg font-semibold">正在识别文字...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{processingProgress}% 完成</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OCR结果 */}
      {ocrResult && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">识别结果</h3>
          </div>
          <OCRResult
            result={ocrResult}
            onClose={() => setOcrResult(null)}
          />
        </div>
      )}
    </div>
  )
}