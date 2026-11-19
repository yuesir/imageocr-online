import { NextResponse } from 'next/server'
import { GUEST_DAILY_LIMIT, USER_DAILY_LIMIT } from './catalog'
import { BillingError, BillingStorageError } from './server'

export function exhaustedAllowance(authenticated: boolean) {
  return NextResponse.json({
    error: 'Image allowance exhausted',
    errorCode: 'IMAGE_ALLOWANCE_EXHAUSTED',
    message: authenticated
      ? `Your available images have been used. Buy an image pack to continue, or wait until 00:00 UTC for ${USER_DAILY_LIMIT} free images.`
      : `You have used your daily guest allowance of ${GUEST_DAILY_LIMIT} free image. Sign in with Google for up to ${USER_DAILY_LIMIT} free images per day total, or buy an image pack.`,
    ...(!authenticated ? { loginUrl: '/login?next=%2Focr' } : {}),
    pricingUrl: '/pricing',
  }, { status: 402 })
}
export function allowanceFailure(error: unknown) {
  if (error instanceof BillingError) return NextResponse.json({ error: error.message, message: error.message }, { status: error.status })
  console.error('Image allowance unavailable', error instanceof BillingStorageError ? { operation: error.operation, code: error.code } : { code: 'UNKNOWN' })
  return NextResponse.json({
    error: 'Image allowance unavailable',
    errorCode: error instanceof BillingStorageError ? error.publicCode : 'ALLOWANCE_UNAVAILABLE',
    message: 'We could not check your image allowance. This is a temporary service issue, not a sign that your free images have run out. Please retry later.',
  }, { status: 503 })
}
