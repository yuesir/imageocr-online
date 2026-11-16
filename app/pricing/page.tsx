import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Pricing } from '@/components/billing/Pricing'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Image Packs & Pricing | ImageOCRAI',
  description: 'One-time image recognition packs from $5.99. Get 300 images for $9.99. No subscriptions; purchased images never expire.',
}
export default function PricingPage() {
  return <div className="min-h-screen bg-background"><Header /><main><Pricing enabled={process.env.BILLING_ENABLED === 'true'} /></main><Footer /></div>
}
