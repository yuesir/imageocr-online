import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getClientIP, checkIPDailyLimit, updateIPUsage } from '@/lib/ip-usage'
import { Buffer } from 'buffer'

// 腾讯云OCR SDK
import * as tencentcloud from 'tencentcloud-sdk-nodejs-ocr'
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

// 腾讯云错误类型定义
interface TencentError {
  code?: string;
  message?: string;
}

// 错误处理函数
function handleTencentError(error: TencentError): { status: number; message: string } {
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

// 腾讯云OCR检测结果类型（匹配SDK类型）
interface TencentTextDetection {
  DetectedText: string;
  Confidence: number;
  Polygon: Array<{ X?: number; Y?: number }>;
}

interface TencentOCRResult {
  TextDetections?: TencentTextDetection[];
}

// 标准化OCR结果格式
function formatOCRResult(tencentResult: TencentOCRResult) {
  const textDetections = tencentResult.TextDetections || []
  
  // 提取所有文本
  const extractedText = textDetections
    .map((detection: TencentTextDetection) => detection.DetectedText)
    .join('\n')

  // 计算平均置信度
  const avgConfidence = textDetections.length > 0
    ? textDetections.reduce((sum: number, detection: TencentTextDetection) => sum + (detection.Confidence || 0), 0) / textDetections.length / 100
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
    text_detections: textDetections.map((detection: TencentTextDetection) => ({
      text: detection.DetectedText,
      confidence: detection.Confidence / 100,
      polygon: detection.Polygon.map(coord => ({ X: coord.X || 0, Y: coord.Y || 0 }))
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

    // 获取客户端IP
    const clientIP = getClientIP(request)
    
    // 检查用户认证（可选）
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const isAuthenticated = !authError && user
    
    // 如果用户未登录，检查IP使用限制
    if (!isAuthenticated) {
      const ipLimitCheck = await checkIPDailyLimit(clientIP)
      
      if (!ipLimitCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Daily usage limit exceeded', 
            message: `You have reached the daily limit of ${ipLimitCheck.limit} free OCR requests. Please try again tomorrow or sign up for unlimited access.`,
            currentCount: ipLimitCheck.currentCount,
            limit: ipLimitCheck.limit
          }, 
          { status: 429 }
        )
      }
    }

    const body = await request.json()
    const { fileId, imageUrl, imageBase64 } = body
    
    console.log('OCR Request received:', {
      hasFileId: !!fileId,
      hasImageUrl: !!imageUrl,
      hasImageBase64: !!imageBase64,
      imageBase64Length: imageBase64?.length,
      imageBase64Prefix: imageBase64?.substring(0, 50)
    })

    // 参数校验
    if (!fileId && !imageUrl && !imageBase64) {
      console.log('Error: No image parameter provided')
      return NextResponse.json(
        { error: 'Either fileId, imageUrl, or imageBase64 is required' },
        { status: 400 }
      )
    }

    // OCR参数类型
    interface OCRParams {
      ImageBase64?: string;
      ImageUrl?: string;
    }

    // 文件数据类型
    interface FileData {
      id: string;
      user_id: string;
      file_path: string;
      filename: string;
      file_size: number;
      mime_type: string;
      created_at: string;
    }

    const ocrParams: OCRParams = {}
    let file: FileData | null = null

    // 处理文件ID方式
    if (fileId) {
      // 只有已登录用户才能访问文件
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'File access requires authentication. Please use imageUrl or imageBase64 for anonymous access.' },
          { status: 401 }
        )
      }
      
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
        .download(file!.file_path)

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
      console.log('Image validation result:', validation)
      if (!validation.isValid) {
        console.log('Validation failed:', validation.error)
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
    
    // 如果用户未登录，更新IP使用次数
    if (!isAuthenticated) {
      await updateIPUsage(clientIP)
    }

    // 如果有fileId且用户已登录，保存OCR结果到数据库
    if (fileId && file && isAuthenticated) {
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
          provider: 'tencent',
          user_type: 'authenticated'
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
        provider: 'tencent',
        user_type: isAuthenticated ? 'authenticated' : 'anonymous'
      }
    })

  } catch (error: unknown) {
    const tencentError = error as TencentError
    const errorInfo = handleTencentError(tencentError)
    return NextResponse.json(
      { error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}