'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Upload, Shield, Star, ArrowRight, ChevronDown, ChevronUp, Image } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'

export default function ArabicOCRClient() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Image className="h-16 w-16 text-white/90 mr-4" />
            <h1 className="text-5xl font-bold">
              Arabic OCR: Arabic Text Recognition
            </h1>
          </div>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Extract Arabic text from images with our advanced AI-powered OCR technology. 
            Recognize Arabic script, handwriting, and printed text with high accuracy.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Secure Processing</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              <span>High Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Arabic OCR Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your Arabic Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images containing Arabic text or click to browse. Our OCR will extract all Arabic text content instantly.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <InteractiveOCR />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How to Extract Arabic Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Arabic text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Arabic Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your images containing Arabic text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Arabic AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI analyzes Arabic script patterns and extracts all readable Arabic text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Arabic Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Arabic text. Download results as text files or copy to clipboard with proper Arabic formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Arabic OCR FAQ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common questions about Arabic text recognition
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleFAQ(0)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  What is Arabic OCR and how does it work?
                </h3>
                {openFAQ === 0 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 0 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Arabic OCR (Optical Character Recognition) is specialized technology that extracts Arabic text from images. Our AI-powered system recognizes Arabic script patterns, handles right-to-left text direction, and processes various Arabic fonts including Naskh, Kufi, and handwritten styles. It can identify diacritics, ligatures, and contextual letter forms unique to Arabic writing.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleFAQ(1)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  How accurate is Arabic text extraction?
                </h3>
                {openFAQ === 1 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our Arabic OCR accuracy typically ranges from 92-98% for high-quality images with clear Arabic text. Accuracy depends on several factors:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Text Quality:</strong> Clear, well-contrasted Arabic text produces better results</li>
                    <li><strong>Font Style:</strong> Standard Arabic fonts work better than decorative or stylized scripts</li>
                    <li><strong>Image Resolution:</strong> Higher resolution images (300+ DPI) improve recognition</li>
                    <li><strong>Text Layout:</strong> Properly aligned Arabic text with correct RTL direction</li>
                    <li><strong>Diacritics:</strong> Text with or without diacritical marks is supported</li>
                  </ul>
                  <p className="text-muted-foreground">
                    For optimal results, ensure your images contain clear Arabic text with good contrast and proper orientation.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleFAQ(2)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  What Arabic dialects and scripts are supported?
                </h3>
                {openFAQ === 2 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 2 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our Arabic OCR supports a wide range of Arabic text variations:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Modern Standard Arabic:</strong> Classical and contemporary Arabic text</li>
                    <li><strong>Script Styles:</strong> Naskh, Kufi, Thuluth, and other traditional calligraphy</li>
                    <li><strong>Printed Text:</strong> Books, newspapers, documents, and digital content</li>
                    <li><strong>Handwritten Arabic:</strong> Clear handwriting in various styles</li>
                    <li><strong>Mixed Content:</strong> Arabic text combined with numbers and Latin characters</li>
                  </ul>
                  <p className="text-muted-foreground">
                    The system automatically detects and processes Arabic text regardless of regional variations or writing styles.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleFAQ(3)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Is my Arabic text data secure during processing?
                </h3>
                {openFAQ === 3 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Yes, we prioritize the security and privacy of your Arabic text and images:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Encrypted Transfer:</strong> All uploads use HTTPS encryption</li>
                    <li><strong>Temporary Processing:</strong> Images are processed in memory and not permanently stored</li>
                    <li><strong>Auto-Deletion:</strong> Uploaded files are automatically deleted after processing</li>
                    <li><strong>No Data Retention:</strong> We don't store your images or extracted Arabic text</li>
                    <li><strong>Privacy Compliance:</strong> Full compliance with GDPR and privacy regulations</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Your Arabic content remains completely private and is never shared with third parties.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Our Arabic OCR?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized Arabic text recognition with advanced AI technology for superior results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Arabic Specialized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Specifically optimized for Arabic script recognition with enhanced algorithms for right-to-left text processing.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>High Speed Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Lightning-fast Arabic text analysis and extraction, processing multiple images with Arabic content in seconds.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Superior Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced AI models trained specifically on Arabic text patterns for maximum recognition accuracy and proper formatting.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Extract Arabic Text from Images?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start recognizing Arabic text from your images instantly with our advanced OCR technology
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => {
            document.querySelector('#arabic-ocr-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <Upload className="mr-2 h-5 w-5" />
            Start Arabic Text Recognition
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}