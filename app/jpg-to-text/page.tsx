import { Metadata } from 'next'
import { JPGToTextClient } from './JPGToTextClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'JPG to Text Converter - Extract Text from JPG Images | ImageOCRAI',
    description: 'Convert JPG images to text instantly with our AI-powered OCR technology. Extract text from JPG files with high accuracy and speed. Free online JPG to text converter.',
    keywords: 'JPG to text, JPG OCR, image to text, extract text from JPG, JPG text converter, optical character recognition',
    openGraph: {
      title: 'JPG to Text Converter - AI-Powered OCR | ImageOCRAI',
      description: 'Convert JPG images to text instantly with our advanced AI OCR technology. High accuracy text extraction from JPG files.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JPG to Text Converter - AI OCR | ImageOCRAI',
      description: 'Convert JPG images to text instantly with AI-powered OCR technology.',
    },
  }
}

export default function JPGToTextPage() {
  return <JPGToTextClient />
}