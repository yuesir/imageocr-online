import { Metadata } from 'next'
import HandwrittenNotesOCRClient from './HandwrittenNotesOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Handwritten Notes OCR - Extract Text from Handwritten Notes | ImageOCRAI',
    description: 'Advanced OCR technology to extract text from handwritten notes and documents. Convert handwritten notes to digital text with high accuracy using AI-powered recognition.',
    keywords: ['handwritten notes OCR', 'extract text from handwritten notes', 'handwriting to text', 'handwritten document OCR', 'handwriting recognition', 'digital handwriting conversion'],
    openGraph: {
      title: 'Handwritten Notes OCR - Extract Text from Handwritten Notes | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from handwritten notes and documents. Convert handwritten notes to digital text with high accuracy using AI-powered recognition.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Handwritten Notes OCR - Extract Text from Handwritten Notes | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from handwritten notes and documents. Convert handwritten notes to digital text with high accuracy using AI-powered recognition.',
    },
  }
}

export default function HandwrittenNotesOCRPage() {
  return <HandwrittenNotesOCRClient />
}