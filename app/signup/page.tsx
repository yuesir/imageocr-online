import type { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign Up | OCR365',
  description: 'Create your OCR365 account to start extracting text from images with AI-powered OCR.',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">OCR365</h1>
          <p className="text-muted-foreground">
            Extract text from images with AI-powered OCR
          </p>
        </div>
        
        <SignUpForm />
      </div>
    </div>
  )
}