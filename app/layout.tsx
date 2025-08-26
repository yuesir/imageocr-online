import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OCR365 - AI-Powered Text Extraction',
  description: 'Extract text from images instantly with our advanced OCR technology. Support for multiple languages, formats, and real-time processing.',
  keywords: 'OCR, text extraction, image to text, AI, machine learning, document processing',
  authors: [{ name: 'OCR365 Team' }],
  creator: 'OCR365',
  publisher: 'OCR365',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ocr365.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OCR365 - AI-Powered Text Extraction',
    description: 'Extract text from images instantly with our advanced OCR technology.',
    url: 'https://ocr365.com',
    siteName: 'OCR365',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OCR365 - AI-Powered Text Extraction',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OCR365 - AI-Powered Text Extraction',
    description: 'Extract text from images instantly with our advanced OCR technology.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="ocr365-ui-theme"
        >
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}