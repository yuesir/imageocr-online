'use client'

import { OCRDataNotice } from '@/components/ocr/OCRServiceInfo'
import { FAQSection } from '@/components/faq/FAQSection'

import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Image } from 'lucide-react'

export default function IndianOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <ToolHero
        label="Indian languages / Image OCR"
        icon={Image}
        title="Indian OCR: Indian Text Recognition"
        description="Extract Indian text from images with our advanced AI-powered OCR technology. Recognize Hindi, Tamil, Telugu, Bengali, and other Indian scripts with high accuracy."
      />

      {/* Indian OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your Indian Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images containing Indian text or click to browse. Our OCR will extract all Indian text content instantly.
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
              How to Extract Indian Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Indian text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Indian Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your images containing Indian text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Indian AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI analyzes Indian script patterns and extracts all readable Indian text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Indian Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Indian text. Download results as text files or copy to clipboard with proper Indian formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Indian OCR FAQ"
        description={<> Common questions about Indian text recognition </>}
        items={[
          { question: <> What is Indian OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground">
                    Indian OCR (Optical Character Recognition) is a specialized technology that can recognize and extract text from images containing Indian scripts like Hindi, Tamil, Telugu, Bengali, and others. Our AI-powered system analyzes the visual patterns of Indian characters and converts them into editable digital text.
                  </p>

</>
          ) },
          { question: <> Which Indian languages are supported? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our Indian OCR supports major Indian languages including Hindi (Devanagari), Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Marathi, Oriya, Punjabi, and Sanskrit. The system can automatically detect and process text in these scripts with high accuracy.
                  </p>

</>
          ) },
          { question: <> What image formats are supported for Indian OCR? </>, answer: (
<>

<p className="text-muted-foreground">
                    We support all common image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP. For best results with Indian text recognition, we recommend using high-resolution images (at least 300 DPI) with clear, well-lit text. The maximum file size is 10MB per image.
                  </p>

</>
          ) },
          { question: <> How accurate is the Indian text recognition? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our Indian OCR achieves over 95% accuracy for clear, high-quality images with standard fonts. Accuracy may vary depending on image quality, font styles, text size, and lighting conditions. For handwritten Indian text, accuracy is typically lower but still highly functional for most use cases.
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