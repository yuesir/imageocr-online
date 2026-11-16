'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Star, Image } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'

export default function ArabicOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Arabic / Image OCR"
        icon={Image}
        title="Arabic OCR: Arabic Text Recognition"
        description="Extract Arabic text from images with our advanced AI-powered OCR technology. Recognize Arabic script, handwriting, and printed text with high accuracy."
      />

      {/* Arabic OCR Section */}
      <section className="py-12 sm:py-20 bg-background">
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
      <section className="py-20 bg-background ">
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Arabic Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your images containing Arabic text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Arabic AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI analyzes Arabic script patterns and extracts all readable Arabic text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
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
      <FAQSection
        title="Arabic OCR FAQ"
        description={<> Common questions about Arabic text recognition </>}
        items={[
          { question: <> What is Arabic OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed">
                    Arabic OCR (Optical Character Recognition) is specialized technology that extracts Arabic text from images. Our AI-powered system recognizes Arabic script patterns, handles right-to-left text direction, and processes various Arabic fonts including Naskh, Kufi, and handwritten styles. It can identify diacritics, ligatures, and contextual letter forms unique to Arabic writing.
                  </p>

</>
          ) },
          { question: <> How accurate is Arabic text extraction? </>, answer: (
<>

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

</>
          ) },
          { question: <> What Arabic dialects and scripts are supported? </>, answer: (
<>

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

</>
          ) },
          { question: <> Is my Arabic text data secure during processing? </>, answer: (
<>

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

</>
          ) },
        ]}
      />

      {/* Features Section */}
      <section className="py-20 bg-card/50 ">
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-primary" />
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-sage" />
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
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
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

      <Footer />
    </div>
  )
}