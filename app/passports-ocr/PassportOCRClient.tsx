'use client'

import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function PassportOCRClient() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Passport OCR Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Extract text from passport images with high accuracy. Our advanced OCR technology 
            recognizes passport information including personal details, passport numbers, and dates.
          </p>
        </div>

        {/* OCR Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <InteractiveOCR />
        </div>

        {/* How to Use Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How to Use Our Passport OCR Tool
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Upload Passport Image</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select your passport image file (JPG, PNG, or WEBP format) from your device.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Process Image</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-powered OCR technology analyzes your passport image and extracts all readable text.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Get Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View, copy, or download the extracted passport information in an organized format.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Choose Our Passport OCR?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">High Accuracy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Advanced AI ensures precise text extraction from passport images</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Secure & Private</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your passport images are processed securely and not stored</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Fast Processing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get your passport text extracted in seconds</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Completely Free</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">No registration or payment required</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <button
                onClick={() => toggleFAQ(0)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What passport formats are supported?
                </h3>
                {openFAQ === 0 ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === 0 && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Our OCR tool supports JPG, PNG, and WEBP image formats. For best results, 
                  ensure your passport image is clear and well-lit.
                </p>
              )}
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <button
                onClick={() => toggleFAQ(1)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Is my passport information secure?
                </h3>
                {openFAQ === 1 ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === 1 && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Yes, your privacy is our priority. Passport images are processed in real-time 
                  and are not stored on our servers. All data is handled securely.
                </p>
              )}
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <button
                onClick={() => toggleFAQ(2)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What information can be extracted from passports?
                </h3>
                {openFAQ === 2 ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === 2 && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Our OCR can extract various passport details including name, passport number, 
                  nationality, date of birth, issue and expiry dates, and other printed information.
                </p>
              )}
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <button
                onClick={() => toggleFAQ(3)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How accurate is the passport OCR?
                </h3>
                {openFAQ === 3 ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === 3 && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Our advanced AI technology provides high accuracy rates, typically above 95% 
                  for clear, high-quality passport images.
                </p>
              )}
            </div>
            <div>
              <button
                onClick={() => toggleFAQ(4)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Can I process multiple passport images at once?
                </h3>
                {openFAQ === 4 ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === 4 && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Currently, our tool processes one passport image at a time to ensure optimal 
                  accuracy and performance for each document.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}