import { NextRequest, NextResponse } from 'next/server'
import { billingDB } from '@/lib/billing/server'
import { meteredOCR } from '@/lib/billing/ocr'
import { Buffer } from 'buffer'
import OpenAI from 'openai'

// 阿里云视觉API配置
const aliVLClient = new OpenAI({
  timeout: 90000,
  maxRetries: 0,
  apiKey: process.env.ALI_VL_API_KEY || 'unconfigured',
  baseURL: "https://llm-rr2wkq7dbif1x2pb.cn-beijing.maas.aliyuncs.com/compatible-mode/v1"
})

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
    const base64Regex = /^data:image\/(jpeg|jpg|png|bmp|gif|webp|tiff|heic);base64,/
    if (!base64Regex.test(imageBase64)) {
      return { isValid: false, error: 'Invalid Base64 image format. Must be data:image/[type];base64,[data]' }
    }

    // 检查图片大小（Base64编码后的大小限制为10MB）
    const base64Data = imageBase64.split(',')[1]
    const sizeInBytes = (base64Data.length * 3) / 4
    const maxSizeInBytes = 10 * 1024 * 1024 // 10MB
    
    if (sizeInBytes > maxSizeInBytes) {
      return { isValid: false, error: 'Image size exceeds 10MB limit' }
    }
  }

  return { isValid: true }
}

// 阿里云错误类型定义
interface AliVLError {
  code?: string;
  message?: string;
  type?: string;
}

// 错误处理函数
function handleAliVLError(error: AliVLError): { status: number; message: string } {
  console.error('Ali VL OCR Error:', error)

  // 阿里云特定错误码处理
  if (error.code) {
    switch (error.code) {
      case 'InvalidApiKey':
      case 'Unauthorized':
        return { status: 401, message: 'Invalid API key or unauthorized access' }
      case 'InvalidParameter':
        return { status: 400, message: 'Invalid parameter provided' }
      case 'RateLimitExceeded':
      case 'Throttling':
        return { status: 429, message: 'Request rate limit exceeded' }
      case 'InsufficientBalance':
        return { status: 402, message: 'Insufficient account balance' }
      case 'ModelNotFound':
        return { status: 404, message: 'Model not found' }
      case 'InternalError':
      case 'ServiceUnavailable':
        return { status: 500, message: 'internal error' }
      case 'RequestTimeout':
        return { status: 504, message: 'Request timeout' }
      default:
        return { status: 500, message: `OCR error: ${error.code}` }
    }
  }

  // 网络错误
  if (error.message && error.message.includes('network')) {
    return { status: 503, message: 'Network error when connecting to cloud service' }
  }

  // 超时错误
  if (error.message && error.message.includes('timeout')) {
    return { status: 504, message: 'Request timeout' }
  }

  return { status: 500, message: 'Unknown error occurred' }
}

// 阿里云OCR结果类型
interface AliVLOCRResult {
  choices: Array<{
    message: {
      content: string | null;
    };
  }>;
}

// 标准化OCR结果格式
function formatOCRResult(aliResult: AliVLOCRResult) {
  // 从阿里云视觉API响应中提取文本
  const extractedText = aliResult.choices?.[0]?.message?.content || ''
  
  // 由于阿里云视觉API返回的是文本内容，我们需要模拟置信度和检测结果
  const confidence = 0.95 // 默认置信度
  
  // 检测语言（简单启发式）
  const chineseCharRegex = /[\u4e00-\u9fff]/g
  const chineseCharCount = (extractedText.match(chineseCharRegex) || []).length
  const detectedLanguage = chineseCharCount > extractedText.length * 0.3 ? 'zh' : 'en'

  // 统计字数和字符数
  const wordCount = extractedText.trim().split(/\s+/).filter((word: string) => word.length > 0).length
  const characterCount = extractedText.length

  // 模拟文本检测结果
  const textDetections = extractedText.split('\n').filter(line => line.trim()).map((line, index) => ({
    text: line.trim(),
    confidence: confidence,
    polygon: [
      { X: 0, Y: index * 20 },
      { X: 100, Y: index * 20 },
      { X: 100, Y: (index + 1) * 20 },
      { X: 0, Y: (index + 1) * 20 }
    ]
  }))

  return {
    text: extractedText,
    confidence: confidence,
    language: detectedLanguage,
    word_count: wordCount,
    character_count: characterCount,
    text_detections: textDetections
  }
}

async function processOCR(request: NextRequest) {
  try {
    const supabase = billingDB()
    // 检查环境变量配置
    if (!process.env.ALI_VL_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // 检查用户认证（从请求头获取token）
    const authHeader = request.headers.get('authorization')
    let user = null
    let isAuthenticated = false
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
        if (!authError && authUser) {
          user = authUser
          isAuthenticated = true
        }
      } catch (error) {
        console.log('Auth token validation failed:', error)
      }
    }
    
    const body = await request.json()
    const { fileId, imageUrl, imageBase64 } = body
    

    // 参数校验
    if (!fileId && !imageUrl && !imageBase64) {
      console.log('Error: No image parameter provided')
      return NextResponse.json(
        { error: 'Either fileId, imageUrl, or imageBase64 is required' },
        { status: 400 }
      )
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

    let imageDataUrl = ''
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
      if (!user) {
        return NextResponse.json(
          { error: 'User authentication required for file access' },
          { status: 401 }
        )
      }
      
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

      // 转换为Base64 Data URL
      const arrayBuffer = await fileBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString('base64')
      const mimeType = file?.mime_type || 'image/jpeg'
      
      imageDataUrl = `data:${mimeType};base64,${base64}`
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
        imageDataUrl = imageUrl
      } else if (imageBase64) {
        imageDataUrl = imageBase64
      }
    }

    const startTime = Date.now()


    // 调用阿里云视觉API
    const response = await aliVLClient.chat.completions.create({
      // model: "qwen-vl-max-2025-08-13",
      model: "qwen3-vl-plus",
      messages: [{
        role: "system",
        content: [{
          type: "text",
          text: "You are an OCR assistant. Extract all text from the image and return only the extracted text content without any additional explanation or formatting."
        }]
      }, {
        role: "user",
        content: [{
          type: "image_url",
          image_url: {
            url: imageDataUrl
          }
        }, {
          type: "text",
          // text: "Please extract all text from this image. Return only the text content without any additional explanation."
          text: "提取图片文字并原样输出"
        }]
      }]
    })
    
    const processingTime = Date.now() - startTime
    console.info('ocr_cost_sample', JSON.stringify({ requestId: request.headers.get('idempotency-key'), provider: 'ali_vl', model: response.model, durationMs: processingTime, usage: response.usage }))

    // 格式化结果
    const formattedResult = formatOCRResult(response)
    
    // 如果有fileId且用户已登录，保存OCR结果到数据库
    if (fileId && file && isAuthenticated && user) {
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
          ocr_provider: 'ali_vl'
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
          provider: 'ali_vl',
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
        provider: 'ali_vl',
        user_type: isAuthenticated ? 'authenticated' : 'anonymous'
      }
    })

  } catch (error: unknown) {
    const aliError = error as AliVLError
    const errorInfo = handleAliVLError(aliError)
    return NextResponse.json(
      { error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}
export const POST = meteredOCR(processOCR)
