import { NextRequest } from 'next/server'
import { handleOCRRequest } from '@/lib/ocr-handler'

// 自动OCR端点：后台在阿里云VL与百度OCR之间随机选择，失败时自动切换
export async function POST(request: NextRequest) {
  return handleOCRRequest(request, 'auto')
}
