import { Metadata } from 'next'
import CreditCardOCRClient from './CreditCardOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
    description: 'Securely extract text and information from credit card images with our advanced OCR technology. Fast, accurate, and completely free credit card text recognition.',
    keywords: 'credit card OCR, credit card scanner, OCR text recognition, card information extraction, secure OCR, credit card reader',
    openGraph: {
      title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
      description: 'Securely extract text and information from credit card images with our advanced OCR technology. Fast, accurate, and completely free credit card text recognition.',
      type: 'website',
      url: 'https://imageocr.online/credit-cards-ocr',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Credit Card OCR - Extract Text from Credit Cards | ImageOCR Online',
      description: 'Securely extract text and information from credit card images with our advanced OCR technology. Fast, accurate, and completely free credit card text recognition.',
    },
  }
}

export default function CreditCardOCRPage() {
  return <CreditCardOCRClient />
}