'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Star, PenTool } from 'lucide-react'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function HandwritingToTextClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Handwriting / Image to text"
        icon={PenTool}
        title="Handwriting to Text Converter: Handwritten Image OCR"
        description="Convert handwriting images to text instantly with our advanced AI-powered OCR technology. Extract text from handwritten documents with high accuracy and speed."
      />

      {/* Handwriting OCR Section */}
      <section className="py-12 sm:py-20 bg-background" id="handwriting-ocr-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your Handwriting Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your handwritten documents or click to browse. Our OCR will extract all text content instantly.
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
              How to Convert Handwriting to Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your handwritten documents
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Handwriting Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your handwritten document images. We support high-quality handwriting processing up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your handwriting images. Our AI analyzes the handwritten text and extracts all readable content.
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
        title="Handwriting to Text Converter FAQ"
        description={<> Common questions about converting handwriting images to text </>}
        items={[
          { question: <> What is handwriting to text conversion? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed">
                    Handwriting to text conversion is the process of extracting readable text from handwritten documents using advanced Optical Character Recognition (OCR) technology. This allows you to convert handwritten notes, letters, forms, and other documents into editable, searchable digital text format. Our AI-powered OCR can recognize various handwriting styles, languages, and text layouts with high accuracy.
                  </p>

</>
          ) },
          { question: <> How accurate is handwriting text extraction? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Our handwriting text extraction accuracy typically ranges from 85-95% for clear handwriting. Accuracy depends on several factors:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Handwriting Clarity:</strong> Clear, legible handwriting produces better results</li>
                    <li><strong>Image Quality:</strong> Higher resolution images (300+ DPI) improve accuracy</li>
                    <li><strong>Writing Style:</strong> Print handwriting works better than cursive script</li>
                    <li><strong>Contrast:</strong> Dark ink on light paper provides optimal results</li>
                    <li><strong>Language:</strong> Common languages have higher recognition rates</li>
                  </ul>

<p className="text-muted-foreground">
                    For optimal results, ensure your handwriting images are clear, well-lit, and contain legible text with good contrast.
                  </p>

</>
          ) },
          { question: <> What handwriting image formats are supported? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    We support handwriting images with the following specifications:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>File Size:</strong> Up to 10MB per handwriting image</li>
                    <li><strong>Formats:</strong> JPG, PNG, PDF, and other common image formats</li>
                    <li><strong>Resolution:</strong> Minimum 150x150 pixels, recommended 300+ DPI</li>
                    <li><strong>Color:</strong> Color, grayscale, and black & white images supported</li>
                    <li><strong>Batch Processing:</strong> Up to 50 handwriting images simultaneously</li>
                  </ul>

<p className="text-muted-foreground">
                    <strong>Recommendation:</strong> For best OCR results, use high-resolution scans or photos with good lighting and minimal shadows.
                  </p>

</>
          ) },
          { question: <> Is my handwriting data secure during processing? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Yes, we prioritize the security and privacy of your handwriting images and extracted text data:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Encrypted Transfer:</strong> All handwriting uploads use HTTPS encryption</li>
                    <li><strong>Temporary Processing:</strong> Files are processed in memory and not permanently stored</li>
                    <li><strong>Auto-Deletion:</strong> Uploaded handwriting images are automatically deleted after processing</li>
                    <li><strong>No Data Retention:</strong> We don't store your images or extracted text content</li>
                    <li><strong>Privacy Compliance:</strong> Full compliance with GDPR and privacy regulations</li>
                  </ul>

<p className="text-muted-foreground">
                    Your handwriting images and extracted text remain completely private and are never shared with third parties.
                  </p>

</>
          ) },
        ]}
      />

      {/* Features Section */}
      <section className="py-20 bg-card/50 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Our Handwriting to Text Converter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized handwriting processing with advanced AI technology for superior text extraction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Handwriting Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Specifically optimized for handwriting recognition with enhanced algorithms for various writing styles and scripts.
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
                  Lightning-fast handwriting analysis and text extraction, processing multiple documents in seconds.
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
                  Advanced AI models trained specifically on handwriting patterns for maximum text recognition accuracy.
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