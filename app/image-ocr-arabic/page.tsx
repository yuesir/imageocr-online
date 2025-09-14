import { Metadata } from 'next'
import ArabicOCRClient from './ArabicOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Arabic OCR - Extract Arabic Text from Images | ImageOCRAI',
    description: 'Advanced Arabic OCR technology to extract Arabic text from images. Supports Arabic script, handwriting, and printed text with high accuracy. Free online Arabic text recognition.',
    keywords: ['Arabic OCR', 'Arabic text recognition', 'extract Arabic text', 'Arabic script OCR', 'Arabic handwriting recognition', 'Arabic text extraction', 'RTL text OCR'],
    openGraph: {
      title: 'Arabic OCR - Extract Arabic Text from Images | ImageOCRAI',
      description: 'Advanced Arabic OCR technology to extract Arabic text from images. Supports Arabic script, handwriting, and printed text with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Arabic OCR - Extract Arabic Text from Images | ImageOCRAI',
      description: 'Advanced Arabic OCR technology to extract Arabic text from images. Supports Arabic script, handwriting, and printed text with high accuracy.',
    },
  }
}

export default function ArabicOCRPage() {
  return <ArabicOCRClient />
}