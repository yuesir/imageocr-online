import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { safeAuthRedirect } from '@/lib/auth/redirect'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const failure = new URL('/login?error=oauth_failed', url.origin)
  const response = NextResponse.redirect(new URL(safeAuthRedirect(url.searchParams.get('next')), url.origin))
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  const code = url.searchParams.get('code')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Record only diagnostic metadata, never callback URLs, codes, tokens, or cookie values.
  const diagnostic = {
    hasCode: Boolean(code),
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseKey: Boolean(key),
    hasCodeVerifier: request.cookies.getAll().some(({ name, value }) => /-code-verifier(?:\.\d+)?$/.test(name) && Boolean(value)),
  }
  if (url.searchParams.has('error')) {
    console.error('[auth/callback] provider_returned_error', diagnostic)
  } else if (!supabaseUrl || !key) {
    console.error('[auth/callback] missing_supabase_configuration', diagnostic)
  } else if (!code) {
    console.error('[auth/callback] missing_authorization_code', diagnostic)
  }
  if (!url.searchParams.has('error') && code && supabaseUrl && key) {
    try {
      const supabase = createServerClient(supabaseUrl, key, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      })
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return response
      console.error('[auth/callback] session_exchange_failed', {
        ...diagnostic,
        status: error.status,
        errorCode: error.code && /^[a-z0-9_]+$/.test(error.code) ? error.code : 'unknown',
      })
    } catch {
      console.error('[auth/callback] unexpected_exchange_failure', diagnostic)
    }
  }
  response.headers.set('Location', failure.toString())
  return response
}
