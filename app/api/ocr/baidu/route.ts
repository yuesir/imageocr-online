import { NextRequest } from 'next/server'
import { handleOCRRequest } from '@/lib/ocr-handler'

// 百度OCR端点（固定使用百度通用文字识别标准版）
// 文档: https://cloud.baidu.com/doc/OCR/s/zk3h7xz52
export async function POST(request: NextRequest) {
  return handleOCRRequest(request, 'baidu')
}
