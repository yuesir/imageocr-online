import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getClientIP, checkIPDailyLimit, updateIPUsage, checkUserDailyLimit, updateUserUsage } from '@/lib/ip-usage'
import { Buffer } from 'buffer'
import {
  OCRProviderName,
  OCRProviderError,
  OCRProviderResult,
  isAliVLConfigured,
  isBaiduOCRConfigured,
  getAvailableProviders,
  pickRandomProvider,
  recognizeWithProvider
} from '@/lib/ocr-providers'

// 'auto'模式下后台在可用provider（阿里云VL/百度OCR）中随机选择，失败时自动切换到另一个
export type OCRRouteMode = OCRProviderName | 'auto'

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

function isModeConfigured(mode: OCRRouteMode): boolean {
  switch (mode) {
    case 'ali_vl':
      return isAliVLConfigured()
    case 'baidu':
      return isBaiduOCRConfigured()
    case 'auto':
      return isAliVLConfigured() || isBaiduOCRConfigured()
  }
}

export async function handleOCRRequest(request: NextRequest, mode: OCRRouteMode): Promise<NextResponse> {
  try {
    // 检查环境变量配置
    if (!isModeConfigured(mode)) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // 获取客户端IP
    const clientIP = getClientIP(request)

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

    // 检查使用限制：已登录用户检查邮箱限制，未登录用户检查IP限制
    if (isAuthenticated && user?.email) {
      const userLimitCheck = await checkUserDailyLimit(user.email)

      if (!userLimitCheck.allowed) {
        return NextResponse.json(
          {
            error: 'Daily usage limit exceeded',
            message: 'You have reached the upper limit for today\'s usage. Please try again tomorrow or purchase a package.',
            currentCount: userLimitCheck.currentCount,
            limit: userLimitCheck.limit
          },
          { status: 429 }
        )
      }
    } else if (!isAuthenticated) {
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
      mode,
      hasFileId: !!fileId,
      hasImageUrl: !!imageUrl,
      hasImageBase64: !!imageBase64,
      imageBase64Length: imageBase64?.length
    })

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

    // 选择provider：指定模式直接使用，auto模式随机选择
    let selectedProvider: OCRProviderName
    if (mode === 'auto') {
      const availableProviders = getAvailableProviders(imageDataUrl)
      if (availableProviders.length === 0) {
        return NextResponse.json(
          { error: 'No OCR provider available for this image' },
          { status: 500 }
        )
      }
      selectedProvider = pickRandomProvider(availableProviders)
    } else {
      selectedProvider = mode
    }

    const startTime = Date.now()

    console.log(`Processing OCR with provider: ${selectedProvider}`)

    let formattedResult: OCRProviderResult
    let usedProvider = selectedProvider

    try {
      formattedResult = await recognizeWithProvider(selectedProvider, imageDataUrl)
    } catch (providerError) {
      // auto模式下provider失败时，自动切换到另一个可用provider
      const fallbackProvider = mode === 'auto'
        ? getAvailableProviders(imageDataUrl).find((p) => p !== selectedProvider)
        : undefined

      if (!fallbackProvider) {
        throw providerError
      }

      console.error(`Provider ${selectedProvider} failed, falling back to ${fallbackProvider}:`, providerError)
      usedProvider = fallbackProvider
      formattedResult = await recognizeWithProvider(fallbackProvider, imageDataUrl)
    }

    const processingTime = Date.now() - startTime

    // 更新使用次数：已登录用户更新邮箱使用次数，未登录用户更新IP使用次数
    if (isAuthenticated && user?.email) {
      await updateUserUsage(user.email)
    } else if (!isAuthenticated) {
      await updateIPUsage(clientIP)
    }

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
          ocr_provider: usedProvider
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
          provider: usedProvider,
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
        provider: usedProvider,
        user_type: isAuthenticated ? 'authenticated' : 'anonymous'
      }
    })

  } catch (error: unknown) {
    if (error instanceof OCRProviderError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    console.error('OCR request failed:', error)
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
