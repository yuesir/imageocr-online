'use client'

import { useEffect } from 'react'

interface ClarityProps {
  clarityId: string
}

/**
 * Microsoft Clarity Analytics Component
 *
 * This component integrates Microsoft Clarity for user behavior analytics.
 * It should only be used in production environments and respects user privacy.
 *
 * @param clarityId - Your Clarity project ID (e.g., "unvs63hqfx")
 *
 * @example
 * ```tsx
 * <Clarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID!} />
 * ```
 */
export function Clarity({ clarityId }: ClarityProps) {
  useEffect(() => {
    // Only initialize Clarity in production and if ID is provided
    if (!clarityId || process.env.NODE_ENV !== 'production') {
      return
    }

    // Check if Clarity is already loaded
    if (window.clarity) {
      return
    }

    // Initialize Clarity
    (function(c: Window, l: Document, a: string, r: string, i: string, t: HTMLScriptElement, y: HTMLScriptElement) {
      // @ts-expect-error - Clarity global initialization
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) }
      t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0] as HTMLScriptElement
      y.parentNode!.insertBefore(t, y)
    })(window, document, 'clarity', 'script', clarityId, {} as HTMLScriptElement, {} as HTMLScriptElement)
  }, [clarityId])

  return null
}

// Type declaration for Clarity global
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}
