'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { Card, CardContent } from '@/components/ui/card'
import { Zap, Upload, FileImage, CheckCircle } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function JapaneseOCRClient() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <ToolHero
        label="Japanese / Image OCR"
        icon={FileImage}
        title="Japanese Image OCR: Extract Japanese Text from Images"
        description="Advanced OCR technology for Japanese text extraction. Accurately recognizes Hiragana, Katakana, and Kanji characters from your images with high precision and speed."
      />

      {/* OCR Tool Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <InteractiveOCR />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-card/50 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Extract Japanese Text</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Japanese text from your images
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-border ">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-primary " />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Select images containing Japanese text. Supports JPG, PNG, and other common formats.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border ">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary " />
                </div>
                <h3 className="font-semibold mb-2">2. Process Text</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your images and extracts Japanese characters with high accuracy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border ">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary  rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary " />
                </div>
                <h3 className="font-semibold mb-2">3. Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Copy, edit, or download the extracted Japanese text in various formats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        description={<> Common questions about Japanese OCR and text extraction </>}
        items={[
          { question: <> What Japanese writing systems are supported? </>, answer: (
<>


<p className="text-muted-foreground">
                  Our Japanese OCR supports all three writing systems: Hiragana (ひらがな), Katakana (カタカナ), and Kanji (漢字). It can also handle mixed text containing multiple writing systems.
                </p>

</>
          ) },
          { question: <> How accurate is the Japanese text recognition? </>, answer: (
<>


<p className="text-muted-foreground">
                  Our advanced OCR technology achieves high accuracy rates for Japanese text, especially with clear, well-lit images. Accuracy may vary depending on image quality, font style, and text complexity.
                </p>

</>
          ) },
          { question: <> What image formats are supported? </>, answer: (
<>


<p className="text-muted-foreground">
                  We support JPG, PNG, BMP, TIFF, and WebP formats. For best results, use high-resolution images with clear, readable Japanese text.
                </p>

</>
          ) },
          { question: <> Can I process multiple images at once? </>, answer: (
<>


<p className="text-muted-foreground">
                  Yes! You can upload and process up to 50 images simultaneously. Each image can be up to 10MB in size.
                </p>

</>
          ) },
        ]}
      />

      <Footer />
    </div>
  )
}