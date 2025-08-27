import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Buffer } from 'buffer'

// 腾讯云OCR SDK
const tencentcloud = require('tencentcloud-sdk-nodejs-ocr')
const OcrClient = tencentcloud.ocr.v20181119.Client

// 腾讯云配置
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'ocr.tencentcloudapi.com',
    },
  },
}

// 参数校验函数
function validateImageInput(imageUrl?: string, imageBase64?: string): { isValid: boolean; error?: string } {
  if (!imageUrl && !imageBase64) {
    return { isValid: false, error: 'Either imageUrl or imageBase64 is required' }
  }

  if (imageUrl && imageBase64) {
    return { isValid: false, error: 'Only one of imageUrl or imageBase64 should be provided' }
  }

  // 校验图片URL格式
  if (imageUrl) {
    try {
      const url = new URL(imageUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        return { isValid: false, error: 'Invalid image URL protocol' }
      }
    } catch {
      return { isValid: false, error: 'Invalid image URL format' }
    }
  }

  // 校验Base64格式和大小
  if (imageBase64) {
    // 检查Base64格式
    const base64Regex = /^data:image\/(jpeg|jpg|png|bmp|gif|webp);base64,/
    if (!base64Regex.test(imageBase64)) {
      return { isValid: false, error: 'Invalid Base64 image format. Must be data:image/[type];base64,[data]' }
    }

    // 检查图片大小（Base64编码后的大小限制为7MB）
    const base64Data = imageBase64.split(',')[1]
    const sizeInBytes = (base64Data.length * 3) / 4
    const maxSizeInBytes = 7 * 1024 * 1024 // 7MB
    
    if (sizeInBytes > maxSizeInBytes) {
      return { isValid: false, error: 'Image size exceeds 7MB limit' }
    }
  }

  return { isValid: true }
}

// 错误处理函数
function handleTencentError(error: any): { status: number; message: string } {
  console.error('Tencent OCR Error:', error)

  // 腾讯云特定错误码处理
  if (error.code) {
    switch (error.code) {
      case 'AuthFailure.SignatureExpire':
        return { status: 401, message: 'Authentication signature expired' }
      case 'AuthFailure.SecretIdNotFound':
        return { status: 401, message: 'Invalid SecretId' }
      case 'AuthFailure.SignatureFailure':
        return { status: 401, message: 'Authentication signature failure' }
      case 'InvalidParameter':
        return { status: 400, message: 'Invalid parameter provided' }
      case 'InvalidParameter.InvalidParameter':
        return { status: 400, message: 'Invalid parameter format' }
      case 'LimitExceeded':
        return { status: 429, message: 'Request limit exceeded' }
      case 'ResourceNotFound':
        return { status: 404, message: 'Resource not found' }
      case 'InternalError':
        return { status: 500, message: 'Tencent Cloud internal error' }
      case 'UnsupportedOperation':
        return { status: 400, message: 'Unsupported operation' }
      default:
        return { status: 500, message: `Tencent Cloud error: ${error.code}` }
    }
  }

  // 网络错误
  if (error.message && error.message.includes('network')) {
    return { status: 503, message: 'Network error when connecting to Tencent Cloud' }
  }

  // 超时错误
  if (error.message && error.message.includes('timeout')) {
    return { status: 504, message: 'Request timeout' }
  }

  return { status: 500, message: 'Unknown error occurred' }
}

// 标准化OCR结果格式
function formatOCRResult(tencentResult: any) {
  const textDetections = tencentResult.TextDetections || []
  
  // 提取所有文本
  const extractedText = textDetections
    .map((detection: any) => detection.DetectedText)
    .join('\n')

  // 计算平均置信度
  const avgConfidence = textDetections.length > 0
    ? textDetections.reduce((sum: number, detection: any) => sum + (detection.Confidence || 0), 0) / textDetections.length / 100
    : 0

  // 检测语言（简单启发式）
  const chineseCharRegex = /[\u4e00-\u9fff]/g
  const chineseCharCount = (extractedText.match(chineseCharRegex) || []).length
  const detectedLanguage = chineseCharCount > extractedText.length * 0.3 ? 'zh' : 'en'

  // 统计字数和字符数
  const wordCount = extractedText.trim().split(/\s+/).filter((word: string) => word.length > 0).length
  const characterCount = extractedText.length

  return {
    text: extractedText,
    confidence: avgConfidence,
    language: detectedLanguage,
    word_count: wordCount,
    character_count: characterCount,
    text_detections: textDetections.map((detection: any) => ({
      text: detection.DetectedText,
      confidence: detection.Confidence / 100,
      polygon: detection.Polygon
    }))
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量配置
    if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Tencent Cloud credentials not configured' },
        { status: 500 }
      )
    }

    // 检查用户认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fileId, imageUrl, imageBase64 } = body

    // 参数校验
    if (!fileId && !imageUrl && !imageBase64) {
      return NextResponse.json(
        { error: 'Either fileId, imageUrl, or imageBase64 is required' },
        { status: 400 }
      )
    }

    let ocrParams: any = {}
    let file: any = null

    // 处理文件ID方式
    if (fileId) {
      // 验证文件所有权
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single()

      if (fileError || !fileData) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }

      file = fileData

      // 从Supabase Storage获取文件
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('ocr-files')
        .download(file.file_path)

      if (downloadError || !fileBlob) {
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
      }

      // 转换为Base64
      const arrayBuffer = await fileBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString('base64')
      
      ocrParams.ImageBase64 = base64
    }
    // 处理直接传入的图片
    else {
      const validation = validateImageInput(imageUrl, imageBase64)
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      if (imageUrl) {
        ocrParams.ImageUrl = imageUrl
      } else if (imageBase64) {
        // 提取Base64数据部分
        const base64Data = imageBase64.split(',')[1]
        ocrParams.ImageBase64 = base64Data
      }
    }

    const startTime = Date.now()

    // 创建腾讯云OCR客户端
    const client = new OcrClient(clientConfig)

    // 调用通用印刷体识别接口
    const ocrResult = await client.GeneralBasicOCR(ocrParams)
    
    const processingTime = Date.now() - startTime

    // 格式化结果
    const formattedResult = formatOCRResult(ocrResult)

    // 如果有fileId，保存OCR结果到数据库
    if (fileId && file) {
      const { data: savedResult, error: saveError } = await supabase
        .from('ocr_results')
        .insert({
          file_id: fileId,
          user_id: user.id,
          extracted_text: formattedResult.text,
          confidence_score: formattedResult.confidence,
          language_detected: formattedResult.language,
          processing_time_ms: processingTime,
          word_count: formattedResult.word_count,
          character_count: formattedResult.character_count,
          status: 'completed',
          ocr_provider: 'tencent'
        })
        .select()
        .single()

      if (saveError) {
        console.error('Error saving OCR result:', saveError)
        // 不阻断返回，只记录错误
      }

      return NextResponse.json({
        success: true,
        result: {
          id: savedResult?.id,
          ...formattedResult,
          processing_time: processingTime,
          status: 'completed',
          provider: 'tencent'
        }
      })
    }

    // 直接返回OCR结果（不保存到数据库）
    return NextResponse.json({
      success: true,
      result: {
        ...formattedResult,
        processing_time: processingTime,
        status: 'completed',
        provider: 'tencent'
      }
    })

  } catch (error: any) {
    const errorInfo = handleTencentError(error)
    return NextResponse.json(
      { error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}