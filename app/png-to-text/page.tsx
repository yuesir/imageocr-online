import { Metadata } from 'next'
import { PNGToTextClient } from './PNGToTextClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PNG to Text Converter - Extract Text from PNG Images | ImageOCRAI',
    description: 'Convert PNG images to text instantly with our AI-powered OCR technology. Extract text from PNG files with high accuracy and speed. Daily free allowance and optional one-time image packs.',
    keywords: 'PNG to text, PNG OCR, image to text, extract text from PNG, PNG text converter, optical character recognition',
    openGraph: {
      title: 'PNG to Text Converter - AI-Powered OCR | ImageOCRAI',
      description: 'Convert PNG images to text instantly with our advanced AI OCR technology. High accuracy text extraction from PNG files.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PNG to Text Converter - AI OCR | ImageOCRAI',
      description: 'Convert PNG images to text instantly with AI-powered OCR technology.',
    },
  }
}

export default function PNGToTextPage() {
  return <PNGToTextClient />
}