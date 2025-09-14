'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Cookie, Shield } from 'lucide-react'

/**
 * Cookie Consent Component
 * Complies with GDPR and other privacy regulations
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
      
      // Enable Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied', // We don't use ads, so deny
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
      
      // Deny all non-essential cookies
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pointer-events-none">
      <Card className="w-full pointer-events-auto animate-in fade-in duration-500 ease-out">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-base">Cookie Usage Notice</CardTitle>
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
        <CardContent className="flex items-start gap-4 pt-0">
          <div className="flex-1 space-y-2">
            <CardDescription className="text-sm leading-snug">
              We use cookies to improve your experience and analyze website usage. This data helps us understand how users interact with our OCR service for continuous improvement.
              By continuing to use this website, you agree to our
              <a href="/privacy" className="underline hover:no-underline ml-1">
                Privacy Policy
              </a>
            </CardDescription>
            
            <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Privacy Protection:</strong> We do not collect personal identification information, and all data is anonymized. You can change these preferences at any time in settings.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[160px]">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              {isLoading ? 'Processing...' : 'Accept'}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="sm"
            >
              {isLoading ? 'Processing...' : 'Decline'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}