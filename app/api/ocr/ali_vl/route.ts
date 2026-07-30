import { NextRequest } from 'next/server'
import { handleOCRRequest } from '@/lib/ocr-handler'

// 阿里云视觉API OCR端点（固定使用阿里云VL）
export async function POST(request: NextRequest) {
  return handleOCRRequest(request, 'ali_vl')
}
