import Link from 'next/link'
import { GUEST_DAILY_LIMIT, USER_DAILY_LIMIT } from '@/lib/billing/catalog'

export function OCRPricingInfo() {
  return (
    <>
      Guests get {GUEST_DAILY_LIMIT} free image per day. Sign in for {USER_DAILY_LIMIT} free images per day total, including guest usage.
      {' '}Need more? <Link href="/pricing" className="underline underline-offset-2">See one-time image packs</Link>.
    </>
  )
}

export function OCRPrivacyLink() {
  return <Link href="/privacy#ocr-data" className="underline underline-offset-2">OCR data processing and retention</Link>
}

export function OCRDataNotice() {
  return (
    <>
      This tool sends your images to a cloud OCR provider to extract text. Successful results are saved so they can be returned if the same request is retried.
      {' '}See <OCRPrivacyLink /> for details.
    </>
  )
}
