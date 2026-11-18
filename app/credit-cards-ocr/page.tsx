import { Metadata } from 'next'
import CreditCardOCRClient from './CreditCardOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
    description: 'Securely extract text and information from credit card images with our advanced OCR technology. Daily free allowance and optional one-time image packs.',
    keywords: 'credit card OCR, credit card scanner, OCR text recognition, card information extraction, secure OCR, credit card reader',
    openGraph: {
      title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
      description: 'Securely extract text and information from credit card images with our advanced OCR technology. Daily free allowance and optional one-time image packs.',
      type: 'website',
      url: 'https://imageocr.online/credit-cards-ocr',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
      description: 'Securely extract text and information from credit card images with our advanced OCR technology. Daily free allowance and optional one-time image packs.',
    },
  }
}

export default function CreditCardOCRPage() {
  return <CreditCardOCRClient />
}