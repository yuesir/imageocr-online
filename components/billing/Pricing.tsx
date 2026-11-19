'use client'
import { FAQSection } from '@/components/faq/FAQSection'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { GUEST_DAILY_LIMIT, PACKAGES, USER_DAILY_LIMIT, type PackageId } from '@/lib/billing/catalog'
import { trackEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
interface Order { id: string; package_id: string; amount: number; credits: number; status: string; created_at: string }
export function Pricing({ enabled }: { enabled: boolean }) {
  const { session, loading } = useAuth()
  const [busy, setBusy] = useState<PackageId | null>(null)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentMessage, setPaymentMessage] = useState('')
  useEffect(() => {
    if (!session) { setOrders([]); return }
    let disposed = false
    let timer: ReturnType<typeof setTimeout>
    let attempts = 0
    const expected = new URLSearchParams(window.location.search).get('order')
    async function refresh() {
      try {
        const response = await fetch('/api/billing/orders', { headers: { Authorization: `Bearer ${session!.access_token}` }, cache: 'no-store' })
        if (!response.ok) throw new Error('Could not load your orders. Refresh to retry.')
        const data = await response.json()
        if (disposed) return
        setOrders(data.orders)
        if (expected) {
          const order = data.orders.find((o: Order) => o.id === expected)
          if (order?.status === 'paid') {
            setPaymentMessage('Payment confirmed. Your images have been added.')
            window.dispatchEvent(new Event('billing:refresh'))
          } else if (order?.status === 'refunded') setPaymentMessage('This order has been refunded.')
          else {
            setPaymentMessage('Waiting for payment confirmation. Images are added after your payment is verified. Refresh this page later if needed.')
            if (++attempts < 20) timer = setTimeout(() => void refresh(), 3000)
          }
        }
      } catch (e) { if (!disposed) setError(e instanceof Error ? e.message : 'Orders unavailable') }
    }
    void refresh()
    return () => { disposed = true; clearTimeout(timer) }
  }, [session])
  async function buy(packageId: PackageId) {
    if (!session || busy) return
    trackEvent({ action: 'image_pack_checkout', category: 'billing', label: packageId })
    setBusy(packageId); setError('')
    try {
      const response = await fetch('/api/billing/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ packageId }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout unavailable')
      window.location.assign(data.checkoutUrl)
    } catch (e) { setError(e instanceof Error ? e.message : 'Checkout unavailable'); setBusy(null) }
  }
  return <main className="mx-auto max-w-6xl px-4 py-16">
    <div className="mb-12 text-center"><p className="font-medium text-primary">Simple, one-time pricing</p><h1 className="mt-3 text-4xl font-bold md:text-5xl">More images. No subscription.</h1><p className="mt-5 text-lg text-muted-foreground">Buy what you need. Your purchased images never expire.</p><p className="mt-3 text-sm">Try {GUEST_DAILY_LIMIT} free image a day as a guest, or sign in with Google for {USER_DAILY_LIMIT} free images a day total.</p><p className="mt-2 text-sm text-muted-foreground">Free accounts: 1 task at a time · All paid packs: up to 3 concurrent tasks per account.</p></div>
    {paymentMessage && <p role="status" className="my-6 rounded-lg bg-secondary p-4 text-primary">{paymentMessage}</p>}
    {error && <p role="alert" className="my-6 text-destructive">{error}</p>}
    <div className="mt-12 grid gap-8 md:grid-cols-3">{PACKAGES.map(pack => <section key={pack.id} className={`relative flex flex-col rounded-2xl border-2 bg-background p-8 ${pack.id === 'plus' ? 'border-border shadow-tactile' : 'border-border'}`}>
      {pack.id === 'plus' && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1 text-sm font-semibold text-white">Recommended</span>}
      <h2 className="text-2xl font-bold">{pack.name}</h2><p className="mt-6 text-4xl font-bold">${(pack.cents / 100).toFixed(2)}</p><p className="mt-1 text-sm text-muted-foreground">USD · one-time payment</p><p className="mt-6 text-2xl font-semibold">{pack.credits} images</p><p className="mt-1 text-sm text-muted-foreground">${(pack.cents / 100 / pack.credits).toFixed(3)} per image</p>
      <div className="my-6 min-h-16 text-sm">{pack.id === 'plus' ? <><p className="font-semibold text-primary">Just $4 more for 3× the images.</p><p className="mt-2">44% lower cost per image than Starter.</p></> : <p>{pack.id === 'starter' ? 'For a small project or occasional use.' : 'More images for larger projects.'}</p>}</div>
      <ul className="mb-8 space-y-3 text-sm"><li>✓ Images never expire</li><li>✓ No subscription or automatic renewal</li><li>✓ <strong>3 concurrent OCR tasks</strong> per account</li><li>✓ Same AI recognition across all packs</li><li>✓ Buy again anytime; images accumulate</li></ul>
      <div className="mt-auto">{!loading && !session ? <Link href="/login" className="block rounded-lg border px-4 py-3 text-center font-medium">Sign in to buy {pack.name}</Link> : <Button disabled={!enabled || loading || busy !== null} onClick={() => void buy(pack.id)} className={`w-full ${pack.id === 'plus' ? 'bg-primary text-white hover:bg-primary' : ''}`} variant={pack.id === 'plus' ? 'default' : 'outline'}>{busy === pack.id ? 'Opening checkout…' : `Buy ${pack.name}`}</Button>}</div>
    </section>)}</div>
    <p className="mt-6 text-center text-sm text-muted-foreground">Applicable taxes are shown at checkout. <Link href="/refund-policy" className="underline">Refund policy</Link></p>
    <FAQSection title="How image packs work" className="-mx-4" items={[
      { question: <> What uses my image allowance? </>, answer: <> <p className="mt-2 text-muted-foreground">Each successfully processed image uses one image allowance, even if no text is found. Batch processing counts successful images individually. Failed processing and automatic retries are not charged twice. Starting a new recognition uses another image allowance.</p> </> },
      { question: <> Do I still get free images after buying? </>, answer: <> <p className="mt-2 text-muted-foreground">Yes. Your daily free images are used first, then purchased images. Free images reset at 00:00 UTC and do not roll over. Guest use counts toward the {USER_DAILY_LIMIT}-image daily allowance after signing in. Purchased images have no daily limit.</p> </> },
      { question: <> How many images can I process at once? </>, answer: <> <p className="mt-2 text-muted-foreground">Guests and free accounts process 1 image at a time. Any paid pack unlocks up to 3 concurrent OCR tasks per account, shared across tabs. Additional images wait in the queue. Parallel processing costs no extra image allowance: each successfully processed image still uses one. The benefit remains after you use your purchased images, provided you have a purchase that has not been fully refunded.</p> </> },
      { question: <> Are these subscriptions? </>, answer: <> <p className="mt-2 text-muted-foreground">No. Every pack is a one-time purchase for image recognition. All packs use the same recognition engine. PDF processing and public API access are not included.</p> </> },
    ]} />
    {session && <section className="mt-16"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Your recent orders</h2><Link href="/orders" className="text-sm font-medium text-primary underline-offset-4 hover:underline">View all orders →</Link></div>{orders.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Date / Order</th><th>Pack</th><th>Price</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr key={o.id} className="border-t"><td className="p-3">{new Date(o.created_at).toLocaleDateString()}<span className="block text-xs text-muted-foreground">{o.id}</span></td><td className="capitalize">{o.package_id} · {o.credits} images</td><td>${(o.amount / 100).toFixed(2)}</td><td>{o.status}{o.status === 'paid' && 'refunded_amount' in o && Number(o.refunded_amount) > 0 ? ' (partial refund)' : ''}</td></tr>)}</tbody></table></div> : <p className="text-muted-foreground">No recent orders.</p>}</section>}
  </main>
}
