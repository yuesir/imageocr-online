'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { IndianOCR } from '@/components/ocr/IndianOCR'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import { Zap, Shield, ChevronDown, ChevronUp, LogIn, Star, Image } from 'lucide-react'
import { UserMenu } from '@/components/ui/user-menu'

export default function IndianOCRPage() {
  const { user, signOut } = useAuth()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-orange-600" />
              <Link href="/" className="text-2xl font-bold text-foreground hover:text-orange-600 transition-colors">
                ImageOCRAI
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <UserMenu 
                  userEmail={user.email || ''} 
                  onSignOut={() => signOut()}
                />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Image className="h-16 w-16 text-white/90 mr-4" />
            <h1 className="text-5xl font-bold">
              Indian OCR: Indian Text Recognition
            </h1>
          </div>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Extract Indian text from images with our advanced AI-powered OCR technology. 
            Recognize Hindi, Tamil, Telugu, Bengali, and other Indian scripts with high accuracy.
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

      {/* Indian OCR Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Your Indian Images</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images containing Indian text or click to browse. Our OCR will extract all Indian text content instantly.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <IndianOCR />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How to Extract Indian Text?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Indian text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Indian Images</h3>
                <p className="text-muted-foreground">
                  Upload or drag and drop your images containing Indian text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Indian AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI analyzes Indian script patterns and extracts all readable Indian text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Indian Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Indian text. Download results as text files or copy to clipboard with proper Indian formatting.
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
              Indian OCR FAQ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common questions about Indian text recognition
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
                  What is Indian OCR and how does it work?
                </h3>
                {openFAQ === 0 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 0 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Indian OCR (Optical Character Recognition) is a specialized technology that can recognize and extract text from images containing Indian scripts like Hindi, Tamil, Telugu, Bengali, and others. Our AI-powered system analyzes the visual patterns of Indian characters and converts them into editable digital text.
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
                  Which Indian languages are supported?
                </h3>
                {openFAQ === 1 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Our Indian OCR supports major Indian languages including Hindi (Devanagari), Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Marathi, Oriya, Punjabi, and Sanskrit. The system can automatically detect and process text in these scripts with high accuracy.
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
                  What image formats are supported for Indian OCR?
                </h3>
                {openFAQ === 2 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 2 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    We support all common image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP. For best results with Indian text recognition, we recommend using high-resolution images (at least 300 DPI) with clear, well-lit text. The maximum file size is 10MB per image.
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
                  How accurate is the Indian text recognition?
                </h3>
                {openFAQ === 3 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Our Indian OCR achieves over 95% accuracy for clear, high-quality images with standard fonts. Accuracy may vary depending on image quality, font styles, text size, and lighting conditions. For handwritten Indian text, accuracy is typically lower but still highly functional for most use cases.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleFAQ(4)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Is my Indian text data secure and private?
                </h3>
                {openFAQ === 4 ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openFAQ === 4 && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    Yes, we take data security seriously. All images and extracted Indian text are processed securely and are not stored on our servers after processing. Your data is encrypted during transmission and processing, ensuring complete privacy and confidentiality of your Indian language content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}