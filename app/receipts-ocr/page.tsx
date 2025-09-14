import { Metadata } from 'next'
import ReceiptsOCRClient from './ReceiptsOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Receipt OCR - Extract Text from Receipt Images | ImageOCRAI',
    description: 'Advanced Receipt OCR tool to extract text from receipt images. Convert JPG, PNG, and PDF receipts to editable text with high accuracy using AI-powered optical character recognition.',
    keywords: 'Receipt OCR, receipt text extraction, receipt to text, OCR receipt, receipt data extraction, receipt processing, receipt digitization, receipt scanner',
    openGraph: {
      title: 'Receipt OCR - Extract Text from Receipt Images',
      description: 'Convert your receipt images to editable text instantly with our advanced AI-powered Receipt OCR technology.',
      type: 'website',
      url: 'https://imageocr.ai/receipts-ocr',
      siteName: 'ImageOCRAI',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Receipt OCR - Extract Text from Receipt Images',
      description: 'Convert your receipt images to editable text instantly with our advanced AI-powered Receipt OCR technology.',
    },
  }
}

export default function ReceiptOCRPage() {
  return <ReceiptsOCRClient />
}