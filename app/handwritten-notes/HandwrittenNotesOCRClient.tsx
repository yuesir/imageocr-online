'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { PenTool } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HandwrittenNotesOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Handwritten notes / Image OCR"
        icon={PenTool}
        title="Handwritten Notes OCR: Extract Text from Handwritten Notes"
        description="Advanced AI-powered OCR technology specifically designed for handwritten text recognition. Convert your handwritten notes to digital text with exceptional accuracy and speed."
      />

      {/* Handwritten Notes OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Images with Handwritten Notes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your handwritten notes or click to browse. Our specialized handwriting OCR will extract all text content instantly.
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
              How to Extract Text from Handwritten Notes?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to digitize your handwritten notes
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Handwritten Images</h3>
                <p className="text-muted-foreground">
                  Upload images of your handwritten notes. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-violet-100  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-violet-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Handwriting AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI is specifically trained for handwriting recognition and cursive text analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Digital Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted text from your handwritten notes. Download results as text files or copy to clipboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Handwritten Notes OCR FAQ"
        description={<> Common questions about handwriting text recognition </>}
        items={[
          { question: <> How accurate is handwritten text recognition? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our handwriting OCR achieves 85-95% accuracy on clear, legible handwritten text. 
                    Accuracy depends on handwriting style, image quality, and text clarity. Print-style handwriting typically yields better results than cursive.
                  </p>

</>
          ) },
          { question: <> Can it recognize different handwriting styles? </>, answer: (
<>

<p className="text-muted-foreground">
                    Yes! Our AI is trained on various handwriting styles including print, cursive, and mixed styles. 
                    It adapts to different pen types, writing angles, and personal handwriting characteristics for optimal recognition.
                  </p>

</>
          ) },
          { question: <> What image quality is needed for best results? </>, answer: (
<>

<p className="text-muted-foreground">
                    For optimal results, use high-resolution images (300+ DPI) with good lighting and minimal shadows. 
                    Ensure the handwritten text is clear, well-contrasted against the background, and not blurred or distorted.
                  </p>

</>
          ) },
          { question: <> Does it work with notes in different languages? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our handwriting OCR supports multiple languages including English, Spanish, French, German, and many others. 
                    The system automatically detects the language and applies appropriate recognition models for better accuracy.
                  </p>

</>
          ) },
          { question: <> Can I edit the extracted text before downloading? </>, answer: (
<>

<p className="text-muted-foreground">
                    Absolutely! After OCR processing, you can review and edit the extracted text in our built-in editor. 
                    Make corrections, format the text, and then download or copy the final result to your clipboard.
                  </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}