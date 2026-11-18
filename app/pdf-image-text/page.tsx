import { Metadata } from 'next'
import PDFImageTextClient from './PDFImageTextClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PDF Image OCR - PDF Image to Text Converter Online | ImageOCRAI',
    description: 'Advanced OCR technology to convert PDF images to text. Extract text from PDF documents, scanned PDFs, and PDF images with high accuracy. Daily free allowance and optional one-time image packs.',
    keywords: ['convert PDF image to text', 'PDF OCR', 'PDF to text converter', 'extract text from PDF', 'scanned PDF to text', 'PDF image text extraction', 'PDF text recognition', 'PDF document OCR'],
    openGraph: {
      title: 'PDF Image to Text - Convert PDF Images to Text | ImageOCRAI',
      description: 'Advanced OCR technology to convert PDF images to text. Extract text from PDF documents, scanned PDFs, and PDF images with high accuracy.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PDF Image to Text - Convert PDF Images to Text | ImageOCRAI',
      description: 'Advanced OCR technology to convert PDF images to text. Extract text from PDF documents, scanned PDFs, and PDF images with high accuracy.',
    },
  }
}

export default function PDFImageTextPage() {
  return <PDFImageTextClient />
}