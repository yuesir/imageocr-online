import { Metadata } from 'next'
import PassportOCRClient from './PassportOCRClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Passport OCR - Extract Text from Passport Images | ImageOCRAI',
    description: 'Advanced Passport OCR tool to extract text from passport images. Convert JPG, PNG, and WEBP passport documents to editable text with high accuracy using AI-powered optical character recognition.',
    keywords: 'Passport OCR, passport text extraction, passport to text, OCR passport, passport data extraction, passport processing, passport digitization, passport scanner, travel document OCR',
    openGraph: {
      title: 'Passport OCR - Extract Text from Passport Images',
      description: 'Convert your passport images to editable text instantly with our advanced AI-powered Passport OCR technology.',
      type: 'website',
      url: 'https://imageocr.ai/passports-ocr',
      siteName: 'ImageOCRAI',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Passport OCR - Extract Text from Passport Images',
      description: 'Convert your passport images to editable text instantly with our advanced AI-powered Passport OCR technology.',
    },
  }
}

export default function PassportOCRPage() {
  return <PassportOCRClient />
}