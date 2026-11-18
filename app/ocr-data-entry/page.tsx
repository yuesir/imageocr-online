import { Metadata } from 'next'
import DataEntryOCRClient from './DataEntryOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Data Entry OCR - Extract Text from Data Entry Forms | ImageOCRAI',
    description: 'Advanced OCR technology to extract text from data entry forms, spreadsheets, and structured documents. Convert data entry images to editable text with high accuracy. Daily free allowance and optional one-time image packs.',
    keywords: ['data entry OCR', 'extract text from data entry', 'form OCR', 'spreadsheet OCR', 'data extraction', 'structured document OCR', 'form text recognition', 'data entry automation'],
    openGraph: {
      title: 'Data Entry OCR - Extract Text from Data Entry Forms | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from data entry forms, spreadsheets, and structured documents. Convert data entry images to editable text with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Data Entry OCR - Extract Text from Data Entry Forms | ImageOCRAI',
      description: 'Advanced OCR technology to extract text from data entry forms, spreadsheets, and structured documents. Convert data entry images to editable text with high accuracy.',
    },
  }
}

export default function DataEntryOCRPage() {
  return <DataEntryOCRClient />
}