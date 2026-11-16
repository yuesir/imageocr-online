'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { FileText } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PrintedNotesOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Printed notes / Image OCR"
        icon={FileText}
        title="Printed Notes OCR: Extract Text from Printed Notes"
        description="Advanced AI-powered OCR technology specifically designed for extracting text from printed notes and documents. Convert your printed notes to digital text with exceptional accuracy and speed."
      />

      {/* Printed Notes OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Images with Printed Notes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images or click to browse. Our specialized OCR will extract all text content from your printed notes instantly.
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
              How to Extract Text from Printed Notes?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your printed notes
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Note Images</h3>
                <p className="text-muted-foreground">
                  Upload images containing printed notes or documents. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI is specifically trained for printed text recognition and document layout analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Digital Text</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted text from your notes. Download results as text files or copy to clipboard for further use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Printed Notes OCR FAQ"
        description={<> Common questions about extracting text from printed notes </>}
        items={[
          { question: <> What is Printed Notes OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground">
                    Printed Notes OCR (Optical Character Recognition) is a specialized technology that recognizes and extracts text from printed notes and documents. 
                    Our AI is trained on various fonts, layouts, and document types to provide superior accuracy for printed text recognition.
                  </p>

</>
          ) },
          { question: <> What types of printed notes can be processed? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our OCR technology can process various types of printed materials including typed notes, printed documents, textbooks, 
                    research papers, meeting notes, and any other printed text. It works best with clear, well-formatted printed text.
                  </p>

</>
          ) },
          { question: <> What image formats are supported for printed notes OCR? </>, answer: (
<>

<p className="text-muted-foreground">
                    We support all major image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP. 
                    For best results with printed notes, we recommend high-resolution images with good contrast and clear text.
                  </p>

</>
          ) },
          { question: <> How accurate is the printed text recognition? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our printed notes OCR achieves over 98% accuracy on clear, well-formatted printed text. 
                    Accuracy may vary depending on image quality, font styles, and document layout complexity.
                  </p>

</>
          ) },
          { question: <> Can it handle multiple pages or complex layouts? </>, answer: (
<>

<p className="text-muted-foreground">
                    Yes! Our OCR technology can handle multi-column layouts, tables, and complex document structures. 
                    You can upload multiple images at once, and our system will process each page while maintaining the original layout structure.
                  </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}