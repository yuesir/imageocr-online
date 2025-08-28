"use client";

import { BusinessCardOCR } from "@/components/ocr/BusinessCardOCR";
import { ContactRound, Users, Zap, Globe } from 'lucide-react'

export default function BusinessCardOCRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <ContactRound className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Business Card OCR: Extract Contact Information
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Instantly extract contact information from business card images with our advanced OCR technology. 
            Fast, accurate, and completely free to use.
          </p>
        </div>
      </div>

      {/* OCR Section */}
      <div className="container mx-auto px-4 pb-12">
        <BusinessCardOCR />
      </div>

      {/* How to Use Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How to Use Business Card OCR
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload Business Card Image</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select or drag & drop your business card image. Supports JPG, PNG, and other common formats.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Process with OCR</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced OCR technology analyzes your business card and extracts contact information.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Get Contact Details</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View, copy, or export the extracted contact information in various formats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Our Business Card OCR?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Contact Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily digitize business cards and organize contact information for better networking.
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get accurate contact extraction results in seconds with our optimized OCR engine.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multiple Languages</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Supports business cards in various languages and international formats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                What information can be extracted from business cards?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our OCR can extract names, job titles, company names, phone numbers, email addresses, websites, and physical addresses from business cards.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                What image formats are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support JPG, JPEG, PNG, BMP, and other common image formats. For best results, use high-quality, well-lit images.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                How accurate is the OCR recognition?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our OCR technology provides high accuracy for clear, well-lit business card images. Results may vary based on card design and image quality.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Is there a file size limit?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, the maximum file size is 10MB per image. You can process up to 50 business cards at once.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}