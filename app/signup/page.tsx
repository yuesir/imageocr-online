import type { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sign Up | ImageOCRAI',
    description: 'Create your ImageOCRAI account to start extracting text from images with AI-powered OCR.',
  }
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ImageOCRAI</h1>
          <p className="text-muted-foreground">
            Extract text from images with AI-powered OCR
          </p>
        </div>
        
        <SignUpForm />
      </div>
    </div>
  )
}