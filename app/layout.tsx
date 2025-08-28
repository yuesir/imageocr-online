import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Free Online Image to Text OCR Converter& Batch Photo Scanner - ImageOCRAI',
  description: 'Accurate online OCR tool to instantly convert image, photo to editable text. Batch OCR multiple files, extract text on any device—no software needed.',
  keywords: '',
  authors: [{ name: 'ImageOCRAI Team' }],
  creator: 'ImageOCRAI',
  publisher: 'ImageOCRAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://imageocrai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ImageOCRAI - Free Online Image to Text OCR Converter& Batch Photo Scanner',
    description: 'Accurate online OCR tool to instantly convert image, photo to editable text. Batch OCR multiple files, extract text on any device—no software needed.',
    url: 'https://imageocrai.com',
    siteName: 'ImageOCRAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImageOCRAI - Free Online Image to Text OCR Converter& Batch Photo Scanner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageOCRAI - Free Online Image to Text OCR Converter& Batch Photo Scanner',
    description: 'Accurate online OCR tool to instantly convert image, photo to editable text. Batch OCR multiple files, extract text on any device—no software needed.',
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
          storageKey="imageocrai-ui-theme"
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