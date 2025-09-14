'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Zap, Upload, FileImage, CheckCircle } from 'lucide-react'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function JapaneseOCRClient() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Header Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <FileImage className="mr-2 h-4 w-4" />
              Japanese Text Recognition
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Japanese Image OCR: Extract Japanese Text from Images
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Advanced OCR technology for Japanese text extraction. Accurately recognizes Hiragana, Katakana, and Kanji characters from your images with high precision and speed.
            </p>
          </div>
        </div>
      </section>

      {/* OCR Tool Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <InteractiveOCR />
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Extract Japanese Text</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Japanese text from your images
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Select images containing Japanese text. Supports JPG, PNG, and other common formats.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">2. Process Text</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your images and extracts Japanese characters with high accuracy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about Japanese OCR and text extraction
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What Japanese writing systems are supported?</h3>
                <p className="text-muted-foreground">
                  Our Japanese OCR supports all three writing systems: Hiragana (ひらがな), Katakana (カタカナ), and Kanji (漢字). It can also handle mixed text containing multiple writing systems.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How accurate is the Japanese text recognition?</h3>
                <p className="text-muted-foreground">
                  Our advanced OCR technology achieves high accuracy rates for Japanese text, especially with clear, well-lit images. Accuracy may vary depending on image quality, font style, and text complexity.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What image formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support JPG, PNG, BMP, TIFF, and WebP formats. For best results, use high-resolution images with clear, readable Japanese text.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I process multiple images at once?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upload and process up to 50 images simultaneously. Each image can be up to 10MB in size.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}