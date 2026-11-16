'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { safeAuthRedirect } from '@/lib/auth/redirect'
import { Button } from '@/components/ui/button'

export function GoogleSignInButton({ disabled = false }: { disabled?: boolean }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'oauth_failed') {
      setError('Google sign-in was cancelled or could not be completed. Please try again.')
    }
  }, [])

  async function signIn() {
    setPending(true)
    setError('')
    try {
      const callback = new URL('/auth/callback', window.location.origin)
      callback.searchParams.set('next', safeAuthRedirect(new URLSearchParams(window.location.search).get('next')))
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback.toString(), queryParams: { prompt: 'select_account' } },
      })
      if (error) throw error
    } catch {
      setError('Unable to start Google sign-in. Please try again or use email.')
      setPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" className="w-full gap-3" disabled={disabled || pending} onClick={signIn} aria-busy={pending}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.89 46.98 24.55Z" />
          <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
        </svg>
        {pending ? 'Connecting to Google...' : 'Continue with Google'}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or continue with email<span className="h-px flex-1 bg-border" /></div>
    </div>
  )
}
