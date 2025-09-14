'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView, shouldEnableGA } from '@/lib/analytics'
import { getCookieConsent } from '@/lib/cookie-consent'

/**
 * 页面浏览量自动跟踪 Hook
 * 在路由变化时自动发送 Google Analytics 页面浏览事件
 */
function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 检查是否应该启用跟踪
    if (!shouldEnableGA()) {
      return
    }

    // 检查用户是否同意 cookies
    const consent = getCookieConsent()
    if (consent !== 'accepted') {
      return
    }

    // 构建完整的 URL
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // 获取页面标题
    const pageTitle = document.title || 'ImageOCRAI'
    
    // 发送页面浏览事件
    trackPageView({
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: url,
    })

    // 调试日志
    console.debug('Page view tracked:', {
      title: pageTitle,
      path: url,
      location: window.location.href,
    })
  }, [pathname, searchParams])
}

/**
 * 内部页面跟踪组件 - 使用 useSearchParams
 */
function PageTrackingComponent() {
  usePageTracking()
  return null
}

/**
 * 页面跟踪提供者组件
 * 在应用根部使用以启用自动页面跟踪
 */
export function PageTrackingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PageTrackingComponent />
      </Suspense>
      {children}
    </>
  )
}