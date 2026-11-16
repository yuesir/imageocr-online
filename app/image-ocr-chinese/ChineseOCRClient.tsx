'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { FileImage } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ChineseOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Chinese / Image OCR"
        icon={FileImage}
        title="Chinese Image OCR: Extract Chinese Text from Images"
        description="Advanced AI-powered OCR technology specifically optimized for Chinese text recognition. Extract Chinese characters from images with exceptional accuracy and speed."
      />

      {/* Chinese OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Images with Chinese Text</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images or click to browse. Our specialized Chinese OCR will extract all Chinese text content instantly.
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
              How to Extract Chinese Text from Images?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Chinese text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-destructive">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
                <p className="text-muted-foreground">
                  Upload images containing Chinese text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Chinese AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI is specifically trained for Chinese character recognition and layout analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Chinese Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Chinese text. Download results as text files or copy to clipboard for further use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Chinese OCR FAQ"
        description={<> Common questions about Chinese text recognition </>}
        items={[
          { question: <> What is Chinese OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground">
                    Chinese OCR (Optical Character Recognition) is a specialized technology that recognizes and extracts Chinese characters from images. 
                    Our AI is specifically trained on Chinese fonts, handwriting styles, and layout patterns to provide superior accuracy for Chinese text recognition.
                  </p>

</>
          ) },
          { question: <> Can it recognize both Simplified and Traditional Chinese? </>, answer: (
<>

<p className="text-muted-foreground">
                    Yes! Our Chinese OCR technology supports both Simplified Chinese (简体中文) and Traditional Chinese (繁體中文) characters. 
                    The system automatically detects and processes both character sets with high accuracy.
                  </p>

</>
          ) },
          { question: <> What image formats are supported for Chinese OCR? </>, answer: (
<>

<p className="text-muted-foreground">
                    We support all major image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP. 
                    For best results with Chinese text, we recommend high-resolution images with clear, well-lit text.
                  </p>

</>
          ) },
          { question: <> How accurate is the Chinese text recognition? </>, answer: (
<>

<p className="text-muted-foreground">
                    Our Chinese OCR achieves over 95% accuracy on clear, well-formatted Chinese text. 
                    Accuracy may vary depending on image quality, font styles, and text layout complexity.
                  </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}