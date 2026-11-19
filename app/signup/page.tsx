import { redirect } from 'next/navigation'
import { safeAuthRedirect } from '@/lib/auth/redirect'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  const returnPath = safeAuthRedirect(typeof next === 'string' ? next : null)
  redirect(returnPath === '/' ? '/login' : `/login?${new URLSearchParams({ next: returnPath })}`)
}
