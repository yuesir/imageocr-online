'use client'

import { FAQSection } from '@/components/faq/FAQSection'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Star, Image } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { ToolHero } from '@/components/ocr/ToolHero'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Footer } from '@/components/layout/Footer'

export default function GreekOCRClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header Section */}
      <ToolHero
        label="Greek / Image OCR"
        icon={Image}
        title="Greek OCR: Greek Text Recognition"
        description="Extract Greek text from images with our advanced AI-powered OCR technology. Recognize modern and ancient Greek script, handwriting, and printed text with high accuracy."
      />

      {/* Greek OCR Section */}
      <section id="greek-ocr-section" className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your Greek Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images containing Greek text or click to browse. Our OCR will extract all Greek text content instantly.
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
              How to Extract Greek Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Greek text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Greek Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your images containing Greek text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-sage">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Greek AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI analyzes Greek script patterns and extracts all readable Greek text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Greek Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Greek text. Download results as text files or copy to clipboard with proper Greek formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Greek OCR FAQ"
        description={<> Common questions about Greek text recognition </>}
        items={[
          { question: <> What is Greek OCR and how does it work? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed">
                    Greek OCR (Optical Character Recognition) is specialized technology that extracts Greek text from images. Our AI-powered system recognizes both modern and ancient Greek script patterns, handles the Greek alphabet including diacritical marks, and processes various Greek fonts and handwriting styles. It can identify uppercase and lowercase Greek letters, accents, breathing marks, and special Greek characters.
                  </p>

</>
          ) },
          { question: <> How accurate is Greek text extraction? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Our Greek OCR accuracy typically ranges from 90-97% for high-quality images with clear Greek text. Accuracy depends on several factors:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Text Quality:</strong> Clear, well-contrasted Greek text produces better results</li>
                    <li><strong>Font Style:</strong> Standard Greek fonts work better than decorative or stylized scripts</li>
                    <li><strong>Image Resolution:</strong> Higher resolution images (300+ DPI) improve recognition</li>
                    <li><strong>Diacritical Marks:</strong> Proper recognition of Greek accents and breathing marks</li>
                    <li><strong>Script Type:</strong> Modern Greek typically has higher accuracy than ancient Greek texts</li>
                  </ul>

<p className="text-muted-foreground">
                    For optimal results, ensure your images contain clear Greek text with good contrast and proper orientation.
                  </p>

</>
          ) },
          { question: <> What Greek scripts and periods are supported? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Our Greek OCR supports a wide range of Greek text variations:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Modern Greek:</strong> Contemporary Greek text with modern orthography</li>
                    <li><strong>Ancient Greek:</strong> Classical and Koine Greek texts with historical spelling</li>
                    <li><strong>Printed Text:</strong> Books, newspapers, documents, and digital content</li>
                    <li><strong>Handwritten Greek:</strong> Clear handwriting in various styles</li>
                    <li><strong>Mixed Content:</strong> Greek text combined with numbers and Latin characters</li>
                    <li><strong>Diacritical Marks:</strong> Proper handling of accents, breathing marks, and iota subscript</li>
                  </ul>

<p className="text-muted-foreground">
                    The system automatically detects and processes Greek text regardless of historical period or writing style.
                  </p>

</>
          ) },
          { question: <> Is my Greek text data secure during processing? </>, answer: (
<>

<p className="text-muted-foreground leading-relaxed mb-4">
                    Yes, we prioritize the security and privacy of your Greek text and images:
                  </p>

<ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Encrypted Transfer:</strong> All uploads use HTTPS encryption</li>
                    <li><strong>Temporary Processing:</strong> Images are processed in memory and not permanently stored</li>
                    <li><strong>Auto-Deletion:</strong> Uploaded files are automatically deleted after processing</li>
                    <li><strong>No Data Retention:</strong> We don't store your images or extracted Greek text</li>
                    <li><strong>Privacy Compliance:</strong> Full compliance with GDPR and privacy regulations</li>
                  </ul>

<p className="text-muted-foreground">
                    Your Greek content remains completely private and is never shared with third parties.
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
              Why Choose Our Greek OCR?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized Greek text recognition with advanced AI technology for superior results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Greek Specialized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Specifically optimized for Greek script recognition with enhanced algorithms for both modern and ancient Greek text processing.
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
                  Lightning-fast Greek text analysis and extraction, processing multiple images with Greek content in seconds.
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
                  Advanced AI models trained specifically on Greek text patterns for maximum recognition accuracy and proper diacritical mark handling.
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