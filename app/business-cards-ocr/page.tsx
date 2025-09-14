import { Metadata } from 'next'
import BusinessCardOCRClient from './BusinessCardOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Business Card OCR - Extract Contact Information | ImageOCR Online',
    description: 'Extract contact information from business card images instantly with our advanced OCR technology. Fast, accurate, and completely free business card text recognition.',
    keywords: 'business card OCR, contact extraction, business card scanner, OCR text recognition, contact information, business card reader',
    openGraph: {
      title: 'Business Card OCR - Extract Contact Information | ImageOCR Online',
      description: 'Extract contact information from business card images instantly with our advanced OCR technology. Fast, accurate, and completely free business card text recognition.',
      type: 'website',
      url: 'https://imageocr.online/business-cards-ocr',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Business Card OCR - Extract Contact Information | ImageOCR Online',
      description: 'Extract contact information from business card images instantly with our advanced OCR technology. Fast, accurate, and completely free business card text recognition.',
    },
  }
}

export default function BusinessCardOCRPage() {
  return <BusinessCardOCRClient />
}