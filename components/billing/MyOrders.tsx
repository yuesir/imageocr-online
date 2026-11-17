'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ReceiptText, RefreshCw, RotateCcw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { PACKAGES } from '@/lib/billing/catalog'

type Order = {
  id: string; package_id: string; amount: number; credits: number
  status: string; created_at: string; refunded_amount: number
}
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

function OrderStatus({ order }: { order: Order }) {
  const refunded = order.status === 'refunded'
  const paid = order.status === 'paid'
  const label = refunded ? 'Refunded' : paid ? (order.refunded_amount > 0 ? 'Partially refunded' : 'Paid') : order.status === 'pending' ? 'Pending' : 'Unknown'
  const Icon = refunded || order.refunded_amount > 0 ? RotateCcw : paid ? CheckCircle2 : Clock3
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${paid && !order.refunded_amount ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}><Icon aria-hidden="true" className="h-3.5 w-3.5" />{label}</span>
}

export function MyOrders() {
  const { session, loading: authLoading } = useAuth()
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<{ token: string; page: number; orders: Order[]; hasMore: boolean } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const token = session?.access_token
  const current = result?.token === token && result?.page === page ? result : null

  useEffect(() => { setPage(1); setResult(null); setError('') }, [session?.user.id])
  useEffect(() => {
    if (!token) { setResult(null); setLoading(false); return }
    const controller = new AbortController()
    setLoading(true); setError('')
    async function load() {
      try {
        const response = await fetch(`/api/billing/orders?page=${page}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 401 ? 'Your session has expired. Please sign in again to view your orders.' : 'We could not load your orders. Please try again.')
        const data = await response.json()
        if (!controller.signal.aborted) setResult({ token: token!, page, orders: data.orders, hasMore: data.hasMore })
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'We could not load your orders.')
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [token, page, refresh])

  return <>
    <Link href="/pricing" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" />Image packs & pricing</Link>
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-sm font-medium text-primary">Your account</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">My Orders</h1><p className="mt-4 text-muted-foreground">Your image packs, all in one place.</p></div>
      {session && <Button variant="outline" disabled={loading} onClick={() => setRefresh(n => n + 1)}><RefreshCw aria-hidden="true" className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh orders</Button>}
    </div>
    {authLoading ? <Loading /> : !session ? <div className="rounded-2xl border bg-card px-6 py-16 text-center"><ReceiptText aria-hidden="true" className="mx-auto mb-5 h-10 w-10 text-primary" /><h2 className="font-serif text-2xl">Your purchases live here</h2><p className="mx-auto mt-3 max-w-md text-muted-foreground">Sign in to see your orders and payment status.</p><Button asChild className="mt-6"><Link href="/login">Sign in</Link></Button></div> : error ? <div role="alert" className="rounded-2xl border bg-card p-8"><h2 className="text-lg font-semibold">Orders unavailable</h2><p className="mt-2 text-muted-foreground">{error}</p><Button variant="outline" className="mt-5" onClick={() => setRefresh(n => n + 1)}>Try again</Button></div> : loading || !current ? <Loading /> : !current.orders.length ? <div className="rounded-2xl border bg-card px-6 py-16 text-center"><ReceiptText aria-hidden="true" className="mx-auto mb-5 h-10 w-10 text-primary" /><h2 className="font-serif text-2xl">{page === 1 ? 'No orders yet' : 'No more orders'}</h2><p className="mt-3 text-muted-foreground">{page === 1 ? 'Find the right image pack for your next project.' : 'Return to the previous page to view your purchases.'}</p>{page === 1 ? <Button asChild className="mt-6"><Link href="/pricing">Explore image packs<ArrowRight className="ml-2 h-4 w-4" /></Link></Button> : <Button variant="outline" className="mt-6" onClick={() => setPage(p => p - 1)}>Previous page</Button>}</div> : <section aria-label="Order history" aria-busy={loading}>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center gap-3 border-b px-5 py-5 sm:px-6"><ReceiptText aria-hidden="true" className="h-5 w-5 text-primary" /><h2 className="font-medium">Order history</h2><span className="ml-auto text-xs text-muted-foreground">Newest first</span></div>
        <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] gap-4 bg-secondary/40 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid" aria-hidden="true"><span>Order / Date</span><span>Image pack</span><span>Amount</span><span>Status</span></div>
        <ul className="divide-y">{current.orders.map(order => <li key={order.id} className="grid gap-5 px-5 py-6 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] md:items-center md:gap-4 md:px-6">
          <div><time dateTime={order.created_at} className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</time><p className="mt-2 break-all font-mono text-xs leading-relaxed text-muted-foreground"><span className="sr-only">Order ID: </span>{order.id}</p></div>
          <div><p className="font-medium">{PACKAGES.find(p => p.id === order.package_id)?.name || order.package_id}</p><p className="mt-1 text-sm text-muted-foreground">{order.credits.toLocaleString()} images</p></div>
          <div><p className="text-sm font-medium tabular-nums">{money(order.amount)} <span className="text-xs font-normal text-muted-foreground">USD</span></p><p className="mt-1 text-xs text-muted-foreground">Pack price{order.refunded_amount > 0 && ` · ${money(order.refunded_amount)} refunded`}</p></div>
          <div><OrderStatus order={order} /></div>
        </li>)}</ul>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Page {page}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button><Button variant="outline" size="sm" disabled={!current.hasMore} onClick={() => setPage(p => p + 1)}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">Pending orders are awaiting payment confirmation. Purchased images are added once payment is verified. Prices are in USD; applicable taxes are shown at checkout.</p>
    </section>}
  </>
}
function Loading() {
  return <div role="status" className="rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground"><RefreshCw aria-hidden="true" className="mx-auto mb-4 h-6 w-6 animate-spin text-primary" />Loading your orders…</div>
}
