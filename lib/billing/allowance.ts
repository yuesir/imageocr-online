import { NextResponse } from 'next/server'
import { BillingError, BillingStorageError } from './server'

export function exhaustedAllowance(authenticated: boolean) {
  return NextResponse.json({
    error: 'Image allowance exhausted',
    errorCode: 'IMAGE_ALLOWANCE_EXHAUSTED',
    message: authenticated
      ? 'Your available images have been used. Buy an image pack to continue, or wait until 00:00 UTC for 4 free images.'
      : 'Your 2 free guest images for today have been used. Sign in to use up to 4 free images per day total, or buy an image pack.',
    ...(!authenticated ? { loginUrl: '/login?redirectTo=%2Focr' } : {}),
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
