/**
 * Google Analytics 配置和工具函数
 * 提供类型安全的 GA 事件跟踪和配置管理
 */

// Google Analytics 事件类型定义
export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// 页面浏览事件参数
export interface GAPageView {
  page_title: string
  page_location: string
  page_path: string
}

// 自定义事件类型
export interface GACustomEvent {
  event_name: string
  event_parameters?: Record<string, string | number | boolean>
}

// 用户属性设置
export interface GAUserProperties {
  [key: string]: string | number | boolean
}

/**
 * 检查 Google Analytics 是否已加载
 * @returns {boolean} GA 是否可用
 */
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined'
}

/**
 * 获取 GA 测量 ID
 * @returns {string | undefined} GA 测量 ID
 */
export const getGAMeasurementId = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
}

/**
 * 检查是否应该启用 GA（生产环境且有有效的测量 ID）
 * @returns {boolean} 是否应该启用 GA
 */
export const shouldEnableGA = (): boolean => {
  const gaId = getGAMeasurementId()
  return !!gaId && process.env.NODE_ENV === 'production'
}

/**
 * 发送自定义事件到 Google Analytics
 * @param {GAEvent} event - 事件参数
 */
export const trackEvent = (event: GAEvent): void => {
  if (!isGALoaded() || !shouldEnableGA()) {
    console.debug('GA not loaded or not enabled, skipping event:', event)
    return
  }

  try {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    })
  } catch (error) {
    console.error('Error tracking GA event:', error)
  }
}

/**
 * 发送页面浏览事件
 * @param {GAPageView} pageView - 页面浏览参数
 */
export const trackPageView = (pageView: GAPageView): void => {
  if (!isGALoaded() || !shouldEnableGA()) {
    console.debug('GA not loaded or not enabled, skipping page view:', pageView)
    return
  }

  try {
    window.gtag('config', getGAMeasurementId()!, {
      page_title: pageView.page_title,
      page_location: pageView.page_location,
      page_path: pageView.page_path,
    })
  } catch (error) {
    console.error('Error tracking GA page view:', error)
  }
}

/**
 * 发送自定义事件
 * @param {GACustomEvent} customEvent - 自定义事件参数
 */
export const trackCustomEvent = (customEvent: GACustomEvent): void => {
  if (!isGALoaded() || !shouldEnableGA()) {
    console.debug('GA not loaded or not enabled, skipping custom event:', customEvent)
    return
  }

  try {
    window.gtag('event', customEvent.event_name, customEvent.event_parameters)
  } catch (error) {
    console.error('Error tracking GA custom event:', error)
  }
}

/**
 * 设置用户属性
 * @param {GAUserProperties} properties - 用户属性
 */
export const setUserProperties = (properties: GAUserProperties): void => {
  if (!isGALoaded() || !shouldEnableGA()) {
    console.debug('GA not loaded or not enabled, skipping user properties:', properties)
    return
  }

  try {
    window.gtag('config', getGAMeasurementId()!, {
      user_properties: properties,
    })
  } catch (error) {
    console.error('Error setting GA user properties:', error)
  }
}

/**
 * OCR 相关的预定义事件跟踪函数
 */
export const ocrEvents = {
  /**
   * 跟踪 OCR 处理开始
   * @param {string} ocrType - OCR 类型
   */
  startOCR: (ocrType: string) => {
    trackEvent({
      action: 'ocr_start',
      category: 'OCR',
      label: ocrType,
    })
  },

  /**
   * 跟踪 OCR 处理完成
   * @param {string} ocrType - OCR 类型
   * @param {number} processingTime - 处理时间（毫秒）
   */
  completeOCR: (ocrType: string, processingTime: number) => {
    trackEvent({
      action: 'ocr_complete',
      category: 'OCR',
      label: ocrType,
      value: processingTime,
    })
  },

  /**
   * 跟踪 OCR 处理错误
   * @param {string} ocrType - OCR 类型
   * @param {string} errorType - 错误类型
   */
  errorOCR: (ocrType: string, errorType: string) => {
    trackEvent({
      action: 'ocr_error',
      category: 'OCR',
      label: `${ocrType}_${errorType}`,
    })
  },

  /**
   * 跟踪图片上传
   * @param {number} fileCount - 文件数量
   * @param {number} totalSize - 总文件大小（字节）
   */
  uploadImages: (fileCount: number, totalSize: number) => {
    trackEvent({
      action: 'image_upload',
      category: 'Upload',
      label: `${fileCount}_files`,
      value: totalSize,
    })
  },
}

// Google Analytics gtag 配置类型
export interface GtagConfig {
  page_title?: string
  page_location?: string
  page_path?: string
  user_properties?: Record<string, string | number | boolean>
  [key: string]: string | number | boolean | undefined | Record<string, string | number | boolean>
}

// 扩展 Window 接口以包含 gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: GtagConfig | Record<string, string | number | boolean>) => void
  }
}