'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Cookie, Shield } from 'lucide-react'

/**
 * Cookie 同意组件
 * 符合 GDPR 和其他隐私法规要求
 */
export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 检查用户是否已经做出选择
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // 延迟显示，避免影响页面加载性能
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      // 保存用户同意
      localStorage.setItem('cookie-consent', 'accepted')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      
      // 启用 Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied', // 我们不使用广告，所以拒绝
        })
      }
      
      setShowConsent(false)
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      // 保存用户拒绝
      localStorage.setItem('cookie-consent', 'declined')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      
      // 拒绝所有非必要 cookies
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      }
      
      setShowConsent(false)
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowConsent(false)
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card className="w-full max-w-md pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Cookie 使用通知</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            我们使用 cookies 来改善您的体验并分析网站使用情况。这些数据帮助我们了解用户如何使用我们的 OCR 服务，以便持续改进。
          </CardDescription>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <strong>隐私保护：</strong>我们不会收集个人身份信息，所有数据都经过匿名化处理。您可以随时在设置中更改这些偏好。
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              {isLoading ? '处理中...' : '接受'}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              {isLoading ? '处理中...' : '拒绝'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            继续使用本网站即表示您同意我们的
            <a href="/privacy" className="underline hover:no-underline ml-1">
              隐私政策
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * 检查用户的 cookie 同意状态
 * @returns {'accepted' | 'declined' | null} 同意状态
 */
export function getCookieConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null
  
  const consent = localStorage.getItem('cookie-consent')
  return consent as 'accepted' | 'declined' | null
}

/**
 * 重置 cookie 同意状态（用于设置页面）
 */
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('cookie-consent')
  localStorage.removeItem('cookie-consent-date')
  
  // 重新加载页面以显示同意对话框
  window.location.reload()
}

/**
 * 获取 cookie 同意的日期
 * @returns {Date | null} 同意日期
 */
export function getCookieConsentDate(): Date | null {
  if (typeof window === 'undefined') return null
  
  const dateStr = localStorage.getItem('cookie-consent-date')
  return dateStr ? new Date(dateStr) : null
}