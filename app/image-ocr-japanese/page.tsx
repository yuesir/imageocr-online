import { Metadata } from 'next'
import JapaneseOCRClient from './JapaneseOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Japanese OCR - Extract Text from Japanese Images | ImageOCRAI',
    description: 'Advanced Japanese OCR tool to extract text from Hiragana, Katakana, and Kanji images. AI-powered optical character recognition with high accuracy for Japanese text.',
    keywords: 'Japanese OCR, Hiragana OCR, Katakana OCR, Kanji OCR, Japanese text recognition, Japanese image to text, OCR Japan, Japanese character recognition',
    openGraph: {
      title: 'Japanese OCR - Extract Text from Japanese Images',
      description: 'Extract text from Hiragana, Katakana, and Kanji images with our advanced AI-powered Japanese OCR technology.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Japanese OCR - Extract Text from Japanese Images',
      description: 'Extract text from Hiragana, Katakana, and Kanji images with our advanced AI-powered Japanese OCR technology.',
    },
  }
}

export default function JapaneseOCRPage() {
  return <JapaneseOCRClient />
}