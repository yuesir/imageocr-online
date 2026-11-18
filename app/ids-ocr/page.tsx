import { Metadata } from 'next';
import IDOCRClient from './IDOCRClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ID Document OCR: Extract Text from ID Images | Online OCR Tool",
    description: "Convert your ID document images to editable text instantly. Our advanced OCR technology accurately extracts text from identity documents in JPG, PNG, and PDF formats. Daily free allowance and optional one-time image packs.",
    keywords: "ID document OCR, identity document text extraction, OCR tool, image to text, ID scanner, document processing, text recognition, ID data extraction",
    openGraph: {
      title: "ID Document OCR: Extract Text from ID Images",
      description: "Convert your ID document images to editable text instantly. Advanced OCR technology for accurate text extraction.",
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "ID Document OCR: Extract Text from ID Images",
      description: "Convert your ID document images to editable text instantly. Advanced OCR technology for accurate text extraction.",
    },
  }
}

export default function IDOCRPage() {
  return <IDOCRClient />;
}