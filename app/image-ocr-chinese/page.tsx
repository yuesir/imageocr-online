'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogIn, Zap, Shield, Star, FileImage, ChevronDown, ChevronUp } from 'lucide-react'
import { UserMenu } from '@/components/ui/user-menu'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useState } from 'react'
import { ChineseOCR } from '@/components/ocr/ChineseOCR'

export default function ChineseOCRPage() {
  const { user, signOut } = useAuth()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-foreground">ImageOCRAI</span>
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <FileImage className="h-16 w-16 text-white/90 mr-4" />
            <h1 className="text-5xl font-bold">
              Chinese Image OCR: Extract Chinese Text from Images
            </h1>
          </div>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Advanced AI-powered OCR technology specifically optimized for Chinese text recognition. 
            Extract Chinese characters from images with exceptional accuracy and speed.
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
              <span>Chinese Optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chinese OCR Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upload Images with Chinese Text</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag and drop your images or click to browse. Our specialized Chinese OCR will extract all Chinese text content instantly.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <ChineseOCR />
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How to Extract Chinese Text from Images?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Chinese text from your images
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
                <p className="text-muted-foreground">
                  Upload images containing Chinese text. We support JPG, PNG, and other common formats up to 10MB per file.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Process with Chinese AI OCR</h3>
                <p className="text-muted-foreground">
                  Click "Convert" to process your images. Our AI is specifically trained for Chinese character recognition and layout analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download Chinese Text Results</h3>
                <p className="text-muted-foreground">
                  View, edit, and copy the extracted Chinese text. Download results as text files or copy to clipboard for further use.
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
              Chinese OCR FAQ
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Common questions about Chinese text recognition
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
                  What is Chinese OCR and how does it work?
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
                    Chinese OCR (Optical Character Recognition) is a specialized technology that recognizes and extracts Chinese characters from images. 
                    Our AI is specifically trained on Chinese fonts, handwriting styles, and layout patterns to provide superior accuracy for Chinese text recognition.
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
                  Can it recognize both Simplified and Traditional Chinese?
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
                    Yes! Our Chinese OCR technology supports both Simplified Chinese (简体中文) and Traditional Chinese (繁體中文) characters. 
                    The system automatically detects and processes both character sets with high accuracy.
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
                  What image formats are supported for Chinese OCR?
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
                    We support all major image formats including JPG, JPEG, PNG, BMP, TIFF, and WebP. 
                    For best results with Chinese text, we recommend high-resolution images with clear, well-lit text.
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
                  How accurate is the Chinese text recognition?
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
                    Our Chinese OCR achieves over 95% accuracy on clear, well-formatted Chinese text. 
                    Accuracy may vary depending on image quality, font styles, and text layout complexity.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-red-400" />
                <span className="text-xl font-bold">ImageOCRAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced Chinese OCR technology for extracting text from images with high accuracy.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Chinese Text Recognition</li>
                <li>Batch Processing</li>
                <li>High Accuracy</li>
                <li>Fast Processing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>API Documentation</li>
                <li>Contact Support</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Shield className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ImageOCRAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}