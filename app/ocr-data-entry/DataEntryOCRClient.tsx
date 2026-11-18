'use client'

import { OCRDataNotice } from '@/components/ocr/OCRServiceInfo'
import { FAQSection } from '@/components/faq/FAQSection'

import { Database } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function DataEntryOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Data entry / Image OCR"
        icon={Database}
        title="Data Entry OCR: Extract Text from Data Entry Forms"
        description="Advanced AI-powered OCR technology specifically designed for data entry forms, spreadsheets, and structured documents. Extract text from data entry images with exceptional accuracy and speed."
      />

      {/* Data Entry OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Data Entry Forms and Documents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your data entry forms, spreadsheets, or structured documents. Our specialized OCR will extract all text content instantly.
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
              How to Extract Text from Data Entry Forms?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your data entry documents
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
                <p className="text-muted-foreground">
                  Upload images of data entry forms, spreadsheets, or structured documents. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Data Entry AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your documents. Our AI is specifically trained for structured data recognition and form field extraction.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Extracted Data</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted data entry text. Download results as text files or copy to clipboard for further processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Data Entry OCR FAQ"
        description={<> Common questions about data entry text extraction </>}
        items={[
          { question: <> What is Data Entry OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground">
                    Data Entry OCR is a specialized technology that recognizes and extracts text from structured documents like forms, spreadsheets, and data entry sheets. 
                    Our AI is specifically trained on various form layouts, table structures, and data entry patterns to provide superior accuracy for structured data extraction.
                  </p>

</>
          ) },
          { question: <> What types of data entry documents are supported? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our Data Entry OCR supports various document types including application forms, survey forms, spreadsheets, tables, invoices, receipts, 
                    registration forms, questionnaires, and any structured document with organized data fields.
                  </p>

</>
          ) },
          { question: <> Can it extract data from handwritten forms? </>, answer: (
<>

<p className="text-muted-foreground">
                    Yes! Our OCR technology can extract text from both printed and handwritten data entry forms. 
                    For best results with handwritten text, ensure the writing is clear and legible.
                  </p>

</>
          ) },
          { question: <> How accurate is the data entry text extraction? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our Data Entry OCR achieves over 95% accuracy on clear, well-formatted structured documents. 
                    Accuracy may vary depending on image quality, form layout complexity, and text clarity.
                  </p>

</>
          ) },
          { question: <> How are my images and results handled? </>, answer: (
<>

<p className="text-muted-foreground">
                    <OCRDataNotice />
                  </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}