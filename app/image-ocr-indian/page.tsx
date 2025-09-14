import { Metadata } from 'next'
import IndianOCRClient from './IndianOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Indian OCR - Extract Text from Indian Language Images | ImageOCRAI',
    description: 'Advanced Indian OCR tool to extract text from Hindi, Tamil, Telugu, Bengali and other Indian script images. AI-powered optical character recognition with high accuracy for Indian languages.',
    keywords: 'Indian OCR, Hindi OCR, Tamil OCR, Telugu OCR, Bengali OCR, Indian text recognition, Devanagari OCR, Indian script extraction, multilingual OCR',
    openGraph: {
      title: 'Indian OCR - Extract Text from Indian Language Images',
      description: 'Extract text from Hindi, Tamil, Telugu, Bengali and other Indian script images with our advanced AI-powered OCR technology.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Indian OCR - Extract Text from Indian Language Images',
      description: 'Extract text from Hindi, Tamil, Telugu, Bengali and other Indian script images with our advanced AI-powered OCR technology.',
    },
  }
}

export default function IndianOCRPage() {
  return <IndianOCRClient />
}