'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Shield, Clock, Star, ArrowRight, ChevronDown, ChevronUp, Zap, User } from 'lucide-react'
import Link from 'next/link'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'

export default function HomePage() {
  const { user } = useAuth()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />



      {/* Interactive OCR Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience OCR Image to Text Recognition Instantly</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload images, photos and get accurate text extract results instantly
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
              How to Use This Image to Text Converter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload or Drag and Drop</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your image file. We support JPG, PNG, WebP, BMP, and TIFF formats up to 10MB.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Click Convert Button</h3>
                <p className="text-muted-foreground">
                  Click the "Convert" button to process your image. Our AI will analyze and extract all text content from your image.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">View and Copy Results</h3>
                <p className="text-muted-foreground">
                  View and copy the converted text results. You can edit, format, or save the extracted text as needed.
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our OCR technology
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
                  What is image OCR?
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
                    Image OCR (Optical Character Recognition) is an advanced technology that automatically identifies and extracts text from images, scanned documents, photos, and PDFs. It uses artificial intelligence and machine learning algorithms to analyze visual patterns and convert them into editable, searchable text. Modern OCR systems can recognize multiple languages, various fonts, and even handwritten text with high accuracy. This technology is essential for digitizing physical documents, automating data entry, and making image-based content accessible and searchable.
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
                  How to convert image to text?
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
                    Converting images to text is simple with our OCR tool. Follow these steps for best results:
                  </p>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
                    <li><strong>Prepare your image:</strong> Ensure the image is clear, well-lit, and text is readable. Higher resolution images (300+ DPI) produce better results.</li>
                    <li><strong>Upload the file:</strong> Drag and drop or click to upload your image. We support JPG, PNG, WebP, BMP, TIFF, and PDF formats up to 10MB.</li>
                    <li><strong>Process the image:</strong> Click the "Convert" button to start OCR processing. Our AI will analyze the image and extract all visible text.</li>
                    <li><strong>Review and edit:</strong> Check the extracted text for accuracy. You can edit, format, or copy the results as needed.</li>
                  </ol>
                  <p className="text-muted-foreground">
                    <strong>Pro tip:</strong> For optimal results, ensure text is horizontal, avoid shadows or glare, and use images with good contrast between text and background.
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
                  How to transcribe text from image?
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
                    ImageOcrAI transcribes text from images using advanced AI algorithms. Here's how to maximize accuracy:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Image Quality Tips:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li>Use high-resolution images (minimum 300 DPI for scanned documents)</li>
                        <li>Ensure good lighting and avoid shadows or reflections</li>
                        <li>Keep text horizontal and avoid skewed or rotated images</li>
                        <li>Maintain clear contrast between text and background</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Processing Steps:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li>Upload your image using the drag-and-drop interface</li>
                        <li>Wait for automatic processing - our AI will detect text regions</li>
                        <li>Review the confidence score for each extracted text block</li>
                        <li>Use the copy function to transfer text to your clipboard</li>
                        <li>Edit any misrecognized characters if necessary</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Supported Content:</h4>
                      <p className="text-muted-foreground ml-4">
                        Our OCR works with printed text, typed documents, screenshots, photos of signs, handwritten notes (with varying accuracy), and multi-language content including English, Chinese, Spanish, French, and more.
                      </p>
                    </div>
                  </div>
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
                  How to batch OCR images?
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
                    Batch processing allows you to extract text from multiple images simultaneously, saving time and effort. Here's a comprehensive guide:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Preparation Phase:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li>Organize all images in a single folder on your computer</li>
                        <li>Ensure consistent naming convention (e.g., doc_001.jpg, doc_002.jpg)</li>
                        <li>Verify all images meet quality standards mentioned above</li>
                        <li>Check file formats are supported (JPG, PNG, WebP, BMP, TIFF, PDF)</li>
                        <li>Ensure total file size doesn't exceed processing limits</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Batch Processing Steps:</h4>
                      <ol className="list-decimal list-inside text-muted-foreground space-y-1 ml-4">
                        <li>Select multiple files using Ctrl+Click (Windows) or Cmd+Click (Mac)</li>
                        <li>Drag and drop all selected files into the upload area</li>
                        <li>Wait for the upload progress to complete for all files</li>
                        <li>Click "Process All" to start batch OCR processing</li>
                        <li>Monitor the progress bar showing completion status</li>
                        <li>Review results for each processed image individually</li>
                        <li>Export all results as a combined text file or individual files</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Important Considerations:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li><strong>Processing Time:</strong> Batch processing may take longer depending on image count and complexity</li>
                        <li><strong>File Limits:</strong> Maximum 50 images per batch, 10MB per individual file</li>
                        <li><strong>Quality Control:</strong> Review results carefully as batch processing may have varying accuracy across different images</li>
                        <li><strong>Output Options:</strong> Choose between combined output or separate text files for each image</li>
                        <li><strong>Error Handling:</strong> Failed images will be reported separately - you can reprocess them individually</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Best Practices:</h4>
                      <p className="text-muted-foreground ml-4">
                        Start with a small test batch (5-10 images) to verify quality and processing time. Use consistent image settings and formats for better results. Keep backup copies of original images. For large volumes (100+ images), consider processing in smaller batches to maintain system performance and easier error management.
                      </p>
                    </div>
                  </div>
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
              Why Choose ImageOCRAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets user-friendly design for the best OCR experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Process images in seconds with our optimized AI algorithms. 
                  No waiting, just instant results.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your files are encrypted and processed securely. 
                  We respect your privacy and data protection.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>24/7 Available</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access our OCR service anytime, anywhere. 
                  Cloud-based processing means no downtime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users say about ImageOCRAI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "ImageOCRAI has revolutionized how I handle document digitization. 
                  The accuracy is incredible and it saves me hours of manual typing."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Business Analyst</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a researcher, I process hundreds of documents daily. 
                  ImageOCRAI's speed and accuracy have made my workflow so much more efficient."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Research Scientist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The user interface is intuitive and the results are consistently accurate. 
                  ImageOCRAI has become an essential tool for our team."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Emily Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Project Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Extract Text from Your Images?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust ImageOCRAI for their text extraction needs
          </p>
          
          {user ? (
            <Link href="/ocr">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Upload className="mr-2 h-5 w-5" />
                Start Processing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">ImageOCRAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered text extraction from images. Fast, accurate, and secure.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ocr" className="hover:text-white transition-colors">OCR Processing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Access</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ImageOCRAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}