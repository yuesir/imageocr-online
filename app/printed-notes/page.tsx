import { Metadata } from 'next'
import PrintedNotesOCRClient from './PrintedNotesOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Printed Notes OCR - Extract Text from Printed Notes | ImageOCRAI',
    description: 'Advanced OCR technology to extract text from printed notes and documents. Convert handwritten and printed notes to digital text with high accuracy.',
    keywords: ['printed notes OCR', 'extract text from notes', 'notes to text', 'document OCR', 'text recognition', 'digital notes conversion', 'printed document OCR', 'note digitization'],
    openGraph: {
      title: 'Printed Notes OCR - Extract Text from Printed Notes | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from printed notes and documents. Convert handwritten and printed notes to digital text with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Printed Notes OCR - Extract Text from Printed Notes | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from printed notes and documents. Convert handwritten and printed notes to digital text with high accuracy.',
    },
  }
}

export default function PrintedNotesOCRPage() {
  return <PrintedNotesOCRClient />
}