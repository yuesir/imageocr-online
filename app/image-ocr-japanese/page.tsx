'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, Zap, Upload, Shield, Star, Settings, FileText, FileImage, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { JapaneseOCR } from '@/components/ocr/JapaneseOCR'

export default function JapaneseOCRPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-pink-600" />
              <span className="text-2xl font-bold text-foreground">ImageOCRAI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/preferences">
                    <Button variant="ghost" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </>
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
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <FileImage className="mr-2 h-4 w-4" />
              Japanese Text Recognition
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Japanese Image OCR: Extract Japanese Text from Images
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Advanced OCR technology for Japanese text extraction. Accurately recognizes Hiragana, Katakana, and Kanji characters from your images with high precision and speed.
            </p>
          </div>
        </div>
      </section>

      {/* OCR Tool Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <JapaneseOCR />
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Extract Japanese Text</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to extract Japanese text from your images
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Select images containing Japanese text. Supports JPG, PNG, and other common formats.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">2. Process Text</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your images and extracts Japanese characters with high accuracy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Copy, edit, or download the extracted Japanese text in various formats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about Japanese OCR and text extraction
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What Japanese writing systems are supported?</h3>
                <p className="text-muted-foreground">
                  Our Japanese OCR supports all three writing systems: Hiragana (ひらがな), Katakana (カタカナ), and Kanji (漢字). It can also handle mixed text containing multiple writing systems.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How accurate is the Japanese text recognition?</h3>
                <p className="text-muted-foreground">
                  Our advanced OCR technology achieves high accuracy rates for Japanese text, especially with clear, well-lit images. Accuracy may vary depending on image quality, font style, and text complexity.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What image formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support JPG, PNG, BMP, TIFF, and WebP formats. For best results, use high-resolution images with clear, readable Japanese text.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I process multiple images at once?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upload and process up to 50 images simultaneously. Each image can be up to 10MB in size.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold">ImageOCRAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced Japanese OCR technology for extracting text from images with high accuracy.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Japanese Text Recognition</li>
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