import { Metadata } from 'next'
import InvoicesOCRClient from './InvoicesOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Invoice OCR - Extract Text from Invoice Images | ImageOCRAI',
    description: 'Advanced Invoice OCR tool to extract text from invoice images. Convert JPG, PNG, and PDF invoices to editable text with high accuracy using AI-powered optical character recognition.',
    keywords: 'Invoice OCR, invoice text extraction, invoice to text, OCR invoice, invoice data extraction, invoice processing, invoice digitization, invoice scanner',
    openGraph: {
      title: 'Invoice OCR - Extract Text from Invoice Images',
      description: 'Convert your invoice images to editable text instantly with our advanced AI-powered Invoice OCR technology.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Invoice OCR - Extract Text from Invoice Images',
      description: 'Convert your invoice images to editable text instantly with our advanced AI-powered Invoice OCR technology.',
    },
  }
}

export default function InvoiceOCRPage() {
  return <InvoicesOCRClient />
}