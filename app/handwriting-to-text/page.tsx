import { Metadata } from 'next'
import { HandwritingToTextClient } from './HandwritingToTextClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Handwriting to Text Converter - Extract Text from Handwritten Images | ImageOCRAI',
    description: 'Convert handwriting images to text instantly with our AI-powered OCR technology. Extract text from handwritten documents with high accuracy and speed. Free online handwriting to text converter.',
    keywords: 'handwriting to text, handwriting OCR, image to text, extract text from handwriting, handwriting text converter, optical character recognition',
    openGraph: {
      title: 'Handwriting to Text Converter - AI-Powered OCR | ImageOCRAI',
      description: 'Convert handwriting images to text instantly with our advanced AI OCR technology. High accuracy text extraction from handwritten documents.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Handwriting to Text Converter - AI OCR | ImageOCRAI',
      description: 'Convert handwriting images to text instantly with AI-powered OCR technology.',
    },
  }
}

export default function HandwritingToTextPage() {
  return <HandwritingToTextClient />
}