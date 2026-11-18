import { Metadata } from 'next';
import DriversLicenseOCRClient from './DriversLicenseOCRClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Driver's License OCR: Extract Text from License Images | Online OCR Tool",
    description: "Convert your driver's license images to editable text instantly. Our advanced OCR technology accurately extracts text from licenses in JPG, PNG, and PDF formats. Daily free allowance and optional one-time image packs.",
    keywords: "driver's license OCR, license text extraction, OCR tool, image to text, license scanner, document processing, text recognition, license data extraction",
    openGraph: {
      title: "Driver's License OCR: Extract Text from License Images",
      description: "Convert your driver's license images to editable text instantly. Advanced OCR technology for accurate text extraction.",
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Driver's License OCR: Extract Text from License Images",
      description: "Convert your driver's license images to editable text instantly. Advanced OCR technology for accurate text extraction.",
    },
  }
}

export default function DriversLicenseOCRPage() {
  return <DriversLicenseOCRClient />;
}