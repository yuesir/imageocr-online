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
    } catch {
      // Never expose provider errors, authorization codes, or tokens to the browser.
    }
  }
  response.headers.set('Location', failure.toString())
  return response
}
