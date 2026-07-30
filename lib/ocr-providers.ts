import OpenAI from 'openai'

// 统一的OCR provider层：封装阿里云VL与百度OCR，供API路由随机选择使用

export type OCRProviderName = 'ali_vl' | 'baidu'

export interface TextDetection {
  text: string
  confidence: number
  polygon: Array<{ X: number; Y: number }>
}

export interface OCRProviderResult {
  text: string
  confidence: number
  language: string
  word_count: number
  character_count: number
  text_detections: TextDetection[]
}

export class OCRProviderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'OCRProviderError'
    this.status = status
  }
}

// ---------- 共享的结果格式化 ----------

function detectLanguageHeuristic(text: string): string {
  const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length
  return chineseCharCount > text.length * 0.3 ? 'zh' : 'en'
}

function buildResult(text: string, confidence: number, language?: string): OCRProviderResult {
  const wordCount = text.trim().split(/\s+/).filter((word) => word.length > 0).length

  // 各provider均不返回精确坐标，这里按行模拟文本检测框，保持与历史返回格式一致
  const textDetections: TextDetection[] = text
    .split('\n')
    .filter((line) => line.trim())
    .map((line, index) => ({
      text: line.trim(),
      confidence,
      polygon: [
        { X: 0, Y: index * 20 },
        { X: 100, Y: index * 20 },
        { X: 100, Y: (index + 1) * 20 },
        { X: 0, Y: (index + 1) * 20 }
      ]
    }))

  return {
    text,
    confidence,
    language: language || detectLanguageHeuristic(text),
    word_count: wordCount,
    character_count: text.length,
    text_detections: textDetections
  }
}

// ---------- 阿里云视觉API ----------

const aliVLClient = new OpenAI({
  apiKey: process.env.ALI_VL_API_KEY || 'sk-04d1c56672e94809be1009cfe7345126',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

export function isAliVLConfigured(): boolean {
  return !!process.env.ALI_VL_API_KEY
}

interface AliVLError {
  code?: string
  message?: string
  type?: string
}

function mapAliVLError(error: AliVLError): OCRProviderError {
  console.error('Ali VL OCR Error:', error)

  if (error.code) {
    switch (error.code) {
      case 'InvalidApiKey':
      case 'Unauthorized':
        return new OCRProviderError(401, 'Invalid API key or unauthorized access')
      case 'InvalidParameter':
        return new OCRProviderError(400, 'Invalid parameter provided')
      case 'RateLimitExceeded':
      case 'Throttling':
        return new OCRProviderError(429, 'Request rate limit exceeded')
      case 'InsufficientBalance':
        return new OCRProviderError(402, 'Insufficient account balance')
      case 'ModelNotFound':
        return new OCRProviderError(404, 'Model not found')
      case 'InternalError':
      case 'ServiceUnavailable':
        return new OCRProviderError(500, 'internal error')
      case 'RequestTimeout':
        return new OCRProviderError(504, 'Request timeout')
      default:
        return new OCRProviderError(500, `OCR error: ${error.code}`)
    }
  }

  if (error.message && error.message.includes('network')) {
    return new OCRProviderError(503, 'Network error when connecting to cloud service')
  }

  if (error.message && error.message.includes('timeout')) {
    return new OCRProviderError(504, 'Request timeout')
  }

  return new OCRProviderError(500, 'Unknown error occurred')
}

export async function recognizeWithAliVL(imageDataUrl: string): Promise<OCRProviderResult> {
  try {
    const response = await aliVLClient.chat.completions.create({
      model: 'qwen3-vl-plus-2025-09-23',
      messages: [{
        role: 'system',
        content: [{
          type: 'text',
          text: 'You are an OCR assistant. Extract all text from the image and return only the extracted text content without any additional explanation or formatting.'
        }]
      }, {
        role: 'user',
        content: [{
          type: 'image_url',
          image_url: {
            url: imageDataUrl
          }
        }, {
          type: 'text',
          text: '提取图片文字并原样输出'
        }]
      }]
    })

    const extractedText = response.choices?.[0]?.message?.content || ''
    return buildResult(extractedText, 0.95)
  } catch (error) {
    if (error instanceof OCRProviderError) {
      throw error
    }
    throw mapAliVLError(error as AliVLError)
  }
}

// ---------- 百度OCR（通用文字识别标准版） ----------
// 文档: https://cloud.baidu.com/doc/OCR/s/zk3h7xz52

const BAIDU_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token'
const BAIDU_GENERAL_BASIC_URL = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic'

// 百度通用文字识别仅支持 jpg/jpeg/png/bmp
const BAIDU_SUPPORTED_BASE64_REGEX = /^data:image\/(jpeg|jpg|png|bmp);base64,/

export function isBaiduOCRConfigured(): boolean {
  return !!(process.env.BAIDU_OCR_API_KEY && process.env.BAIDU_OCR_SECRET_KEY)
}

export function baiduSupportsImage(imageDataUrl: string): boolean {
  // http(s) 链接直接透传给百度（url参数），由百度侧拉取
  if (!imageDataUrl.startsWith('data:')) {
    return true
  }
  return BAIDU_SUPPORTED_BASE64_REGEX.test(imageDataUrl)
}

let cachedBaiduToken: { token: string; expiresAt: number } | null = null

async function getBaiduAccessToken(): Promise<string> {
  if (cachedBaiduToken && Date.now() < cachedBaiduToken.expiresAt) {
    return cachedBaiduToken.token
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.BAIDU_OCR_API_KEY || '',
    client_secret: process.env.BAIDU_OCR_SECRET_KEY || ''
  })

  let response: Response
  try {
    response = await fetch(`${BAIDU_TOKEN_URL}?${params.toString()}`, { method: 'POST' })
  } catch (error) {
    console.error('Baidu token request failed:', error)
    throw new OCRProviderError(503, 'Network error when connecting to cloud service')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.access_token) {
    const description = data?.error_description || data?.error || `HTTP ${response.status}`
    console.error('Failed to get Baidu access token:', description)
    throw new OCRProviderError(401, 'Invalid API key or unauthorized access')
  }

  // access_token 有效期约30天（expires_in 单位为秒），提前5分钟刷新
  const ttlMs = Math.max((Number(data.expires_in) || 0) - 300, 60) * 1000
  cachedBaiduToken = { token: data.access_token, expiresAt: Date.now() + ttlMs }
  return data.access_token
}

interface BaiduWordsResult {
  words?: string
  probability?: { average?: number; variance?: number; min?: number }
}

interface BaiduOCRResponse {
  log_id?: number
  error_code?: number
  error_msg?: string
  words_result_num?: number
  words_result?: BaiduWordsResult[]
  language?: number
}

function mapBaiduError(errorCode: number, errorMsg: string): OCRProviderError {
  console.error('Baidu OCR Error:', errorCode, errorMsg)

  switch (errorCode) {
    case 6:   // 无接口权限
    case 14:  // IAM鉴权失败
    case 110: // access_token无效
    case 111: // access_token过期
      return new OCRProviderError(401, 'Invalid API key or unauthorized access')
    case 17:  // 日调用量超限
    case 18:  // QPS超限
    case 19:  // 总调用量超限
      return new OCRProviderError(429, 'Request rate limit exceeded')
    case 100:    // 无效参数
    case 216100: // 非法参数
    case 216101: // 参数数量不足
      return new OCRProviderError(400, 'Invalid parameter provided')
    case 216200: // 空图片
    case 216201: // 图片格式错误
    case 216202: // 图片大小错误
    case 216203: // 图片base64编码错误
      return new OCRProviderError(400, 'Invalid image provided')
    case 282000: // 服务器内部错误
    case 216630: // 识别错误
      return new OCRProviderError(500, 'internal error')
    default:
      return new OCRProviderError(500, `OCR error: ${errorCode}`)
  }
}

export async function recognizeWithBaiduOCR(imageDataUrl: string): Promise<OCRProviderResult> {
  const accessToken = await getBaiduAccessToken()

  const body = new URLSearchParams()
  if (imageDataUrl.startsWith('data:')) {
    const base64Data = imageDataUrl.split(',')[1] || ''
    body.set('image', base64Data)
  } else {
    body.set('url', imageDataUrl)
  }
  body.set('probability', 'true')
  body.set('detect_language', 'true')

  let response: Response
  try {
    response = await fetch(`${BAIDU_GENERAL_BASIC_URL}?access_token=${encodeURIComponent(accessToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
  } catch (error) {
    console.error('Baidu OCR request failed:', error)
    throw new OCRProviderError(503, 'Network error when connecting to cloud service')
  }

  const data = (await response.json().catch(() => null)) as BaiduOCRResponse | null
  if (!data) {
    throw new OCRProviderError(500, 'Invalid response from cloud service')
  }

  if (data.error_code) {
    // token失效时清空缓存，下次请求重新获取
    if (data.error_code === 110 || data.error_code === 111) {
      cachedBaiduToken = null
    }
    throw mapBaiduError(data.error_code, data.error_msg || '')
  }

  const wordsResult = data.words_result || []
  const text = wordsResult.map((item) => item.words || '').join('\n')

  const probabilities = wordsResult
    .map((item) => item.probability?.average)
    .filter((value): value is number => typeof value === 'number')
  const confidence = probabilities.length > 0
    ? Math.round((probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length) * 10000) / 10000
    : 0.95

  // detect_language=true时返回：0英文 1日文 2韩文 3中文
  const languageMap: Record<number, string> = { 0: 'en', 1: 'ja', 2: 'ko', 3: 'zh' }
  const language = data.language !== undefined ? languageMap[data.language] : undefined

  return buildResult(text, confidence, language)
}

// ---------- provider选择 ----------

export function getAvailableProviders(imageDataUrl: string): OCRProviderName[] {
  const providers: OCRProviderName[] = []
  if (isAliVLConfigured()) {
    providers.push('ali_vl')
  }
  if (isBaiduOCRConfigured() && baiduSupportsImage(imageDataUrl)) {
    providers.push('baidu')
  }
  return providers
}

export function pickRandomProvider(providers: OCRProviderName[]): OCRProviderName {
  return providers[Math.floor(Math.random() * providers.length)]
}

export async function recognizeWithProvider(
  provider: OCRProviderName,
  imageDataUrl: string
): Promise<OCRProviderResult> {
  return provider === 'baidu'
    ? recognizeWithBaiduOCR(imageDataUrl)
    : recognizeWithAliVL(imageDataUrl)
}
