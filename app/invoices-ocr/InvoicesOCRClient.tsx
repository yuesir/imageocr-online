"use client";

import { OCRDataNotice, OCRPricingInfo, OCRPrivacyLink } from '@/components/ocr/OCRServiceInfo'
import { FAQSection } from '@/components/faq/FAQSection'

import { InteractiveOCR } from "@/components/ocr/InteractiveOCR";
import { Header } from '@/components/layout/Header'
import { Footer } from "@/components/layout/Footer";

export default function InvoicesOCRClient() {
  return (
    <div className="min-h-screen bg-background ">
      <Header />
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground  mb-4">
            Invoice OCR: Extract Text from Invoice Images
          </h1>
          <p className="text-xl text-muted-foreground  max-w-2xl mx-auto">
            Convert your invoice images to editable text instantly. Our advanced OCR technology 
            accurately extracts text from invoices in JPG, PNG, and PDF formats.
          </p>
        </div>
      </div>

      {/* OCR Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <InteractiveOCR />
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-card  py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground  mb-12">
            How to Use Our Invoice OCR Tool
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 ">Upload Invoice</h3>
              <p className="text-muted-foreground ">
                Select your invoice image file (JPG, PNG, PDF) or drag and drop it into the upload area.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 ">Process Invoice</h3>
              <p className="text-muted-foreground ">
                Click the "Convert" button and our AI will analyze your invoice and extract all text content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 ">Get Results</h3>
              <p className="text-muted-foreground ">
                View, copy, or download the extracted text from your invoice. Perfect for data entry and record keeping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background  py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground  mb-12">
            Why Choose Our Invoice OCR?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 ">High Accuracy</h3>
              <p className="text-muted-foreground  text-sm">
                Advanced AI ensures precise text extraction from invoice images
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 ">Fast Processing</h3>
              <p className="text-muted-foreground  text-sm">
                Get your invoice text extracted in seconds, not minutes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 ">Data Handling</h3>
              <p className="text-muted-foreground  text-sm">
                <OCRPrivacyLink />
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 ">Daily Free Allowance</h3>
              <p className="text-muted-foreground  text-sm">
                <OCRPricingInfo />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        items={[
          { question: <> What invoice formats are supported? </>, answer: (
<>


<p className="text-muted-foreground ">
                Our Invoice OCR tool supports JPG, PNG, and PDF formats. You can upload invoices in any of these formats for text extraction.
              </p>

</>
          ) },
          { question: <> How accurate is the invoice text extraction? </>, answer: (
<>


<p className="text-muted-foreground ">
                Our advanced OCR technology provides high accuracy for invoice text extraction, especially for clear, well-formatted invoice images. The accuracy may vary depending on image quality and invoice layout.
              </p>

</>
          ) },
          { question: <> How are my images and results handled? </>, answer: (
<>


<p className="text-muted-foreground ">
                <OCRDataNotice />
              </p>

</>
          ) },
          { question: <> Can I extract data from multiple invoices at once? </>, answer: (
<>


<p className="text-muted-foreground ">
                Currently, our tool processes one invoice at a time to ensure optimal accuracy and performance. You can upload and process multiple invoices sequentially.
              </p>

</>
          ) },
          { question: <> What should I do if the OCR results are not accurate? </>, answer: (
<>


<p className="text-muted-foreground ">
                For best results, ensure your invoice image is clear, well-lit, and high resolution. Avoid blurry or skewed images. You can also try adjusting the image orientation before uploading.
              </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}