import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@next/third-parties/google'
import { PageTrackingProvider } from '@/hooks/usePageTracking'
import { Clarity } from '@/components/analytics/Clarity'

const inter = Inter({ subsets: ['latin'] })

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Free Online Image to Text OCR Converter & Batch Transcribe Image to Text - ImageOCRAI',
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
    title: 'ImageOCRAI - Free Online Image to Text OCR Converter & Batch Photo Scanner',
    description: 'Accurate online OCR tool to instantly convert image, photo to editable text. Batch OCR multiple files, extract text on any device—no software needed.',
    url: 'https://imageocrai.com',
    siteName: 'ImageOCRAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ImageOCRAI - Free Online Image to Text OCR Converter & Batch Photo Scanner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageOCRAI - Free Online Image to Text OCR Converter & Batch Photo Scanner',
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
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 获取 Google Analytics 测量 ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  // 获取 Microsoft Clarity 项目 ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3161682431818340"
          crossOrigin="anonymous"
        />

        {/* Google Analytics - 基础配置 */}
        {gaId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="imageocrai-ui-theme"
        >
          <AuthProvider>
            <PageTrackingProvider>
              {children}
              <Toaster position="top-right" richColors />
            </PageTrackingProvider>
          </AuthProvider>
        </ThemeProvider>
        {/* Google Analytics - 仅在有有效 GA ID 时加载 */}
        {gaId && (
          <GoogleAnalytics gaId={gaId} />
        )}
        {/* Microsoft Clarity - 仅在有有效 Clarity ID 时加载 */}
        {clarityId && (
          <Clarity clarityId={clarityId} />
        )}
      </body>
    </html>
  )
}