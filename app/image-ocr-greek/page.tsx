import { Metadata } from 'next'
import GreekOCRClient from './GreekOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Greek OCR - Extract Greek Text from Images | ImageOCRAI',
    description: 'Advanced AI-powered Greek OCR tool to extract text from images. Recognize modern and ancient Greek script, handwriting, and printed text with high accuracy. Daily free allowance and optional one-time image packs.',
    keywords: 'Greek OCR, Greek text recognition, extract Greek text, Greek script OCR, ancient Greek OCR, modern Greek OCR, Greek handwriting recognition, AI Greek OCR',
    openGraph: {
      title: 'Greek OCR - Extract Greek Text from Images | ImageOCRAI',
      description: 'Advanced AI-powered Greek OCR tool to extract text from images. Recognize modern and ancient Greek script, handwriting, and printed text with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Greek OCR - Extract Greek Text from Images | ImageOCRAI',
      description: 'Advanced AI-powered Greek OCR tool to extract text from images. Recognize modern and ancient Greek script, handwriting, and printed text with high accuracy.',
    },
  }
}

export default function GreekOCRPage() {
  return <GreekOCRClient />
}