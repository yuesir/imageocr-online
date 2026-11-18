'use client'

import { OCRDataNotice } from '@/components/ocr/OCRServiceInfo'
import { FAQSection } from '@/components/faq/FAQSection'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Upload, Star, ArrowRight, Image } from 'lucide-react'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function JPGToTextClient() {
  return (
    <div className="min-h-screen bg-background ">
      <Header />

      {/* JPG OCR Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">JPG to Text Converter: JPG Image OCR</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Convert JPG images to text instantly with our advanced AI-powered OCR technology. 
            Extract text from JPG files with high accuracy and speed.
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
              How to Convert JPG to Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your JPG images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload JPG Files</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your JPG image files. We support high-quality JPG processing up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your JPG images. Our AI analyzes the image structure and extracts all readable text.
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
        title="JPG to Text Converter FAQ"
        description={<> Common questions about converting JPG images to text </>}
        items={[
          { question: <> What is JPG to text conversion? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed">
                    JPG to text conversion is the process of extracting readable text from JPG image files using Optical Character Recognition (OCR) technology. This allows you to convert scanned documents, photos of text, screenshots, and other JPG images into editable, searchable text format. Our AI-powered OCR can recognize various fonts, languages, and text layouts within JPG files with high accuracy.
                  </p>

</>
          ) },
          { question: <> How accurate is JPG text extraction? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Our JPG text extraction accuracy typically ranges from 95-99% for high-quality images with clear text. Accuracy depends on several factors:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Image Quality:</strong> Higher resolution JPG files (300+ DPI) produce better results</li>
                    <li><strong>Text Clarity:</strong> Clear, well-contrasted text against backgrounds</li>
                    <li><strong>Font Type:</strong> Standard fonts work better than decorative or handwritten text</li>
                    <li><strong>Image Orientation:</strong> Horizontal text alignment improves accuracy</li>
                    <li><strong>Lighting:</strong> Even lighting without shadows or glare</li>
                  </ul>

<p className="text-muted-foreground">
                    For optimal results, ensure your JPG images are clear, well-lit, and contain horizontal text with good contrast.
                  </p>

</>
          ) },
          { question: <> What JPG file sizes are supported? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    We support JPG files with the following specifications:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>File Size:</strong> Up to 10MB per JPG file</li>
                    <li><strong>Resolution:</strong> Minimum 100x100 pixels, maximum 10,000x10,000 pixels</li>
                    <li><strong>Color Depth:</strong> 8-bit grayscale to 24-bit full color</li>
                    <li><strong>Compression:</strong> All standard JPG compression levels supported</li>
                    <li><strong>Batch Processing:</strong> Up to 50 JPG files simultaneously</li>
                  </ul>

<p className="text-muted-foreground">
                    <strong>Recommendation:</strong> For best OCR results, use JPG files with at least 300 DPI resolution and minimal compression artifacts.
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
              Why Choose Our JPG to Text Converter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized JPG processing with advanced AI technology for superior text extraction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>JPG Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Specifically optimized for JPG image processing with enhanced algorithms for compressed image formats.
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
                  Lightning-fast JPG analysis and text extraction, processing multiple files in seconds.
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
                  Advanced AI models trained specifically on JPG image characteristics for maximum text recognition accuracy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Convert Your JPG Images to Text?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start extracting text from your JPG files instantly with our advanced OCR technology
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => {
            document.querySelector('#jpg-ocr-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <Upload className="mr-2 h-5 w-5" />
            Start Converting JPG to Text
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
