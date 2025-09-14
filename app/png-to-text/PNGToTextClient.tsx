'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Upload, Shield, Star, ArrowRight, ChevronDown, ChevronUp, Image } from 'lucide-react'
import { useState } from 'react'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function PNGToTextClient() {
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
              PNG to Text Converter: PNG Image OCR
            </h1>
          </div>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Convert PNG images to text instantly with our advanced AI-powered OCR technology. 
            Extract text from PNG files with high accuracy and speed.
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

      {/* PNG OCR Section */}
      <section className="py-20 bg-background" id="png-ocr-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your PNG Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your PNG files or click to browse. Our OCR will extract all text content instantly.
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
              How to Convert PNG to Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your PNG images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload PNG Files</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your PNG image files. We support high-quality PNG processing up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your PNG images. Our AI analyzes the image structure and extracts all readable text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted text. Download results as text files or copy to clipboard.
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
              PNG to Text Converter FAQ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common questions about converting PNG images to text
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
                  What is PNG to text conversion?
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
                    PNG to text conversion is the process of extracting readable text from PNG image files using Optical Character Recognition (OCR) technology. This allows you to convert scanned documents, photos of text, screenshots, and other PNG images into editable, searchable text format. Our AI-powered OCR can recognize various fonts, languages, and text layouts within PNG files with high accuracy.
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
                  How accurate is PNG text extraction?
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
                    Our PNG text extraction accuracy typically ranges from 95-99% for high-quality images with clear text. Accuracy depends on several factors:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Image Quality:</strong> Higher resolution PNG files (300+ DPI) produce better results</li>
                    <li><strong>Text Clarity:</strong> Clear, well-contrasted text against backgrounds</li>
                    <li><strong>Font Type:</strong> Standard fonts work better than decorative or handwritten text</li>
                    <li><strong>Image Orientation:</strong> Horizontal text alignment improves accuracy</li>
                    <li><strong>Lighting:</strong> Even lighting without shadows or glare</li>
                  </ul>
                  <p className="text-muted-foreground">
                    For optimal results, ensure your PNG images are clear, well-lit, and contain horizontal text with good contrast.
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
                  What PNG file sizes are supported?
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
                    We support PNG files with the following specifications:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>File Size:</strong> Up to 10MB per PNG file</li>
                    <li><strong>Resolution:</strong> Minimum 100x100 pixels, maximum 10,000x10,000 pixels</li>
                    <li><strong>Color Depth:</strong> 8-bit grayscale to 32-bit RGBA with transparency</li>
                    <li><strong>Compression:</strong> All standard PNG compression levels supported</li>
                    <li><strong>Batch Processing:</strong> Up to 50 PNG files simultaneously</li>
                  </ul>
                  <p className="text-muted-foreground">
                    <strong>Recommendation:</strong> For best OCR results, use PNG files with at least 300 DPI resolution and lossless compression.
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
                  Is my PNG data secure during processing?
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
                    Yes, we prioritize the security and privacy of your PNG files and extracted text data:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Encrypted Transfer:</strong> All PNG uploads use HTTPS encryption</li>
                    <li><strong>Temporary Processing:</strong> Files are processed in memory and not permanently stored</li>
                    <li><strong>Auto-Deletion:</strong> Uploaded PNG files are automatically deleted after processing</li>
                    <li><strong>No Data Retention:</strong> We don't store your images or extracted text content</li>
                    <li><strong>Privacy Compliance:</strong> Full compliance with GDPR and privacy regulations</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Your PNG files and extracted text remain completely private and are never shared with third parties.
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
              Why Choose Our PNG to Text Converter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized PNG processing with advanced AI technology for superior text extraction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>PNG Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Specifically optimized for PNG image processing with enhanced algorithms for lossless image formats.
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
                  Lightning-fast PNG analysis and text extraction, processing multiple files in seconds.
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
                  Advanced AI models trained specifically on PNG image characteristics for maximum text recognition accuracy.
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
            Ready to Convert Your PNG Images to Text?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start extracting text from your PNG files instantly with our advanced OCR technology
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => {
            document.querySelector('#png-ocr-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <Upload className="mr-2 h-5 w-5" />
            Start Converting PNG to Text
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}