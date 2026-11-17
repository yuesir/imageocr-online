import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MyOrders } from '@/components/billing/MyOrders'

export const metadata: Metadata = {
  title: 'My Orders | ImageOCRAI',
  description: 'View your image pack purchases and payment status.',
  robots: { index: false, follow: false },
}
export default function OrdersPage() {
  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-12 md:py-16"><MyOrders /></main><Footer /></div>
}
