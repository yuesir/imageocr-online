'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ImageBalance {
  freeRemaining: number
  paidRemaining: number
  refundedDebt: number
  concurrencyLimit?: number
}
export function Balance() {
  const { session, loading } = useAuth()
  const [balance, setBalance] = useState<ImageBalance | null>(null)
  const [failed, setFailed] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const rulesId = useId()
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/billing/balance', { headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}, cache: 'no-store' })
      if (!response.ok) throw new Error('Unavailable')
      setBalance(await response.json())
      setFailed(false)
    } catch { setFailed(true) }
  }, [session])
  useEffect(() => {
    if (loading) return
    setBalance(null)
    void refresh()
    const update = () => { void refresh() }
    window.addEventListener('billing:refresh', update)
    window.addEventListener('focus', update)
    return () => { window.removeEventListener('billing:refresh', update); window.removeEventListener('focus', update) }
  }, [refresh, loading])
  const exhausted = !failed && balance?.freeRemaining === 0 && balance.paidRemaining === 0
  return (
    <div data-image-allowance className="rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs text-secondary-foreground sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button type="button" onClick={() => setShowRules(!showRules)} aria-label="Image allowance rules" aria-expanded={showRules} aria-controls={rulesId} className="shrink-0 rounded text-accent-foreground" title="Image allowance rules">
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
          <div aria-live="polite" className="min-w-0">
            {failed ? <button onClick={() => void refresh()} className="underline underline-offset-2">Quota unavailable · Retry</button> : balance ? <span>
              Free: <strong>{balance.freeRemaining}</strong>
              {(session || balance.paidRemaining > 0) && <> · Purchased: <strong>{balance.paidRemaining}</strong></>}
              <span className="ml-1">· Resets 00:00 UTC. Packs never expire.</span>
              {balance.refundedDebt > 0 && <span className="ml-1">· Refund balance: −{balance.refundedDebt} images.</span>}
            </span> : <span>Checking quota…</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {exhausted && !session && <Link href="/login?redirectTo=%2Focr" target="_blank" rel="noopener noreferrer" className="font-medium text-accent-foreground underline-offset-4 hover:underline">Sign in ↗</Link>}
          <Link href="/pricing" target="_blank" rel="noopener noreferrer" className="font-medium text-accent-foreground underline-offset-4 hover:underline">Buy image packs ↗</Link>
        </div>
      </div>
      <div id={rulesId} hidden={!showRules} className="mt-3 space-y-2 border-t border-border pt-3 text-sm leading-relaxed">
        <p>Guests get 2 free images per day; signed-in accounts get 4 in total. Free images are used first and reset at 00:00 UTC. Purchased images never expire.</p>
        <p>Each successful recognition uses 1 image, including images with no text. Failed processing is free. Starting recognition again uses another image allowance.</p>
        <p>Free accounts process 1 image at a time. Purchased packs unlock 3 parallel tasks per account.</p>
        {balance && balance.refundedDebt > 0 && <p>New purchases first cover {balance.refundedDebt} previously used images that were refunded.</p>}
      </div>
    </div>
  )
}
