"use client";

import { FAQSection } from '@/components/faq/FAQSection'

import { InteractiveOCR } from "@/components/ocr/InteractiveOCR";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreditCard, Shield, Zap, Globe } from 'lucide-react'

export default function CreditCardOCRClient() {
  return (
    <div className="min-h-screen bg-background via-white bg-background   ">
      <Header />
      
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-secondary  rounded-full">
              <CreditCard className="h-12 w-12 text-primary " />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground  mb-4">
            Credit Card OCR: Extract Text from Credit Cards
          </h1>
          <p className="text-xl text-muted-foreground  max-w-3xl mx-auto">
            Securely extract text and information from credit card images with our advanced OCR technology. 
            Fast, accurate, and completely free to use.
          </p>
        </div>
      </div>

      {/* OCR Section */}
      <div className="container mx-auto px-4 pb-12">
        <InteractiveOCR />
      </div>

      {/* How to Use Section */}
      <div className="bg-card  py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground ">
            How to Use Credit Card OCR
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary ">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Upload Credit Card Image</h3>
              <p className="text-muted-foreground ">
                Select or drag & drop your credit card image. Supports JPG, PNG, and other common formats.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary ">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Process with OCR</h3>
              <p className="text-muted-foreground ">
                Our advanced OCR technology analyzes your credit card image and extracts text information.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary ">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Get Results</h3>
              <p className="text-muted-foreground ">
                View, copy, or download the extracted text. Results are processed securely and privately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground ">
            Why Choose Our Credit Card OCR?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary  mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Secure & Private</h3>
              <p className="text-muted-foreground ">
                Your credit card images are processed securely and never stored on our servers.
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-primary  mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Fast Processing</h3>
              <p className="text-muted-foreground ">
                Get accurate text extraction results in seconds with our optimized OCR engine.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-primary  mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground ">Multiple Languages</h3>
              <p className="text-muted-foreground ">
                Supports text extraction from credit cards in various languages and formats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        items={[
          { question: <> Is it safe to upload credit card images? </>, answer: (
<>


<p className="text-muted-foreground ">
                Yes, your images are processed securely and are never stored on our servers. We recommend removing sensitive information before processing.
              </p>

</>
          ) },
          { question: <> What image formats are supported? </>, answer: (
<>


<p className="text-muted-foreground ">
                We support JPG, JPEG, PNG, BMP, and other common image formats. For best results, use high-quality, well-lit images.
              </p>

</>
          ) },
          { question: <> How accurate is the OCR recognition? </>, answer: (
<>


<p className="text-muted-foreground ">
                Our OCR technology provides high accuracy for clear, well-lit credit card images. Results may vary based on image quality and card condition.
              </p>

</>
          ) },
          { question: <> Is there a file size limit? </>, answer: (
<>


<p className="text-muted-foreground ">
                Yes, the maximum file size is 10MB per image. You can process up to 50 images at once.
              </p>

</>
          ) },
        ]}
      />
      
      <Footer />
    </div>
  )
}