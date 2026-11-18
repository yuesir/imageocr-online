'use client'

import { OCRDataNotice } from '@/components/ocr/OCRServiceInfo'
import { FAQSection } from '@/components/faq/FAQSection'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Star, Image } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function PNGToTextClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="PNG / Image to text"
        icon={Image}
        title="PNG to Text Converter: PNG Image OCR"
        description="Convert PNG images to text instantly with our advanced AI-powered OCR technology. Extract text from PNG files with high accuracy and speed."
      />

      {/* PNG OCR Section */}
      <section className="py-12 sm:py-20 bg-background" id="png-ocr-section">
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
      <section className="py-20 bg-background ">
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload PNG Files</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your PNG image files. We support high-quality PNG processing up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your PNG images. Our AI analyzes the image structure and extracts all readable text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
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
      <FAQSection
        title="PNG to Text Converter FAQ"
        description={<> Common questions about converting PNG images to text </>}
        items={[
          { question: <> What is PNG to text conversion? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed">
                    PNG to text conversion is the process of extracting readable text from PNG image files using Optical Character Recognition (OCR) technology. This allows you to convert scanned documents, photos of text, screenshots, and other PNG images into editable, searchable text format. Our AI-powered OCR can recognize various fonts, languages, and text layouts within PNG files with high accuracy.
                  </p>

</>
          ) },
          { question: <> How accurate is PNG text extraction? </>, answer: (
<>

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

</>
          ) },
          { question: <> What PNG file sizes are supported? </>, answer: (
<>

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

</>
          ) },
          { question: <> How are my images and results handled? </>, answer: (
<>

<p className="text-muted-foreground"><OCRDataNotice /></p>

</>
          ) },
        ]}
      />

      {/* Features Section */}
      <section className="py-20 bg-card/50 ">
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-primary" />
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-sage" />
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
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

      <Footer />
    </div>
  )
}