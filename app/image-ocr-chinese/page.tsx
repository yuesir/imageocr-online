import { Metadata } from 'next'
import ChineseOCRClient from './ChineseOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chinese OCR - Extract Chinese Text from Images | ImageOCRAI',
    description: 'Advanced Chinese OCR technology to extract Chinese text from images. Supports both Simplified and Traditional Chinese characters with high accuracy. Free online Chinese text recognition.',
    keywords: ['Chinese OCR', 'Chinese text recognition', 'extract Chinese text', 'Simplified Chinese OCR', 'Traditional Chinese OCR', 'Chinese character recognition', '中文OCR'],
    openGraph: {
      title: 'Chinese OCR - Extract Chinese Text from Images | ImageOCRAI',
      description: 'Advanced Chinese OCR technology to extract Chinese text from images. Supports both Simplified and Traditional Chinese characters with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Chinese OCR - Extract Chinese Text from Images | ImageOCRAI',
      description: 'Advanced Chinese OCR technology to extract Chinese text from images. Supports both Simplified and Traditional Chinese characters with high accuracy.',
    },
  }
}

export default function ChineseOCRPage() {
  return <ChineseOCRClient />
}