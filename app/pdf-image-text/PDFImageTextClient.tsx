'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { FileText } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PDFImageTextClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="PDF images / Image to text"
        icon={FileText}
        title="PDF Image to Text: Convert PDF Images to Text"
        description="Advanced AI-powered OCR technology specifically designed for PDF documents and images. Convert PDF images to editable text with exceptional accuracy and speed."
      />

      {/* PDF Image OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload PDF Images and Documents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your PDF images or scanned documents. Our specialized OCR will extract all text content instantly.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <InteractiveOCR />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-background ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How to Convert PDF Images to Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your PDF images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload PDF Images</h3>
                <p className="text-muted-foreground">
                  Upload images of PDF pages, scanned documents, or PDF screenshots. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-amber-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with PDF AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your PDF images. Our AI is specifically trained for PDF document layout and text recognition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Extracted Text</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted PDF text. Download results as text files or copy to clipboard for further use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="PDF Image to Text FAQ"
        description={<> Common questions about PDF image text extraction </>}
        items={[
          { question: <> What is PDF Image to Text conversion and how does it work? </>, answer: (
<>

<p className="text-muted-foreground">
                    PDF Image to Text conversion uses advanced OCR (Optical Character Recognition) technology to extract text from PDF images and scanned documents. 
                    Our AI is specifically trained on PDF layouts, fonts, and document structures to provide superior accuracy for PDF text extraction.
                  </p>

</>
          ) },
          { question: <> Can it extract text from scanned PDF documents? </>, answer: (
<>

<p className="text-muted-foreground">
                    Yes! Our PDF OCR technology excels at extracting text from scanned PDF documents, PDF images, and even low-quality PDF scans. 
                    The system can handle various PDF formats including multi-page documents and complex layouts.
                  </p>

</>
          ) },
          { question: <> What PDF image formats are supported? </>, answer: (
<>

<p className="text-muted-foreground">
                    We support all major image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP for PDF images. 
                    For best results with PDF text extraction, we recommend high-resolution images with clear, well-lit text.
                  </p>

</>
          ) },
          { question: <> How accurate is the PDF text extraction? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our PDF OCR achieves over 95% accuracy on clear, well-formatted PDF documents. 
                    Accuracy may vary depending on image quality, PDF layout complexity, and text clarity.
                  </p>

</>
          ) },
          { question: <> Can it preserve PDF document formatting? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our OCR technology attempts to preserve basic formatting such as paragraphs and line breaks. 
                    However, complex formatting like tables and columns may require manual adjustment after extraction.
                  </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}