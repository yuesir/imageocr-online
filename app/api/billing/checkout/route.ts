import { NextRequest, NextResponse } from 'next/server'
import { billingFailure, BillingError, identity } from '@/lib/billing/server'
import { findPackage } from '@/lib/billing/catalog'
import { storeProducts, usdCents, waffoClient, waffoEnvironment, waffoProductId, waffoStoreId } from '@/lib/billing/waffo'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  try {
    if (process.env.BILLING_ENABLED !== 'true') throw new BillingError('Purchases are not available yet.', 503)
    const { db, user } = await identity(request)
    if (!user) throw new BillingError('Please sign in to buy an image pack.', 401)
    const body = await request.json().catch(() => null)
    const pack = findPackage(body?.packageId)
    if (!pack) throw new BillingError('Unknown image pack.', 400)
    const client = waffoClient()
    const productId = waffoProductId(pack.id)
    const remote = (await storeProducts(client)).find(p => p.id === productId)
    const price = remote?.prices.find(p => p.currency === 'USD')?.priceInfo
    if (!remote || remote.status !== 'active' || !price || usdCents(price.amount) !== pack.cents) throw new Error('Waffo product does not match the image pack')
    const site = process.env.NEXT_PUBLIC_SITE_URL
    if (!site) throw new Error('Site URL is not configured')
    const origin = new URL(site).origin
    const { data: order, error } = await db.from('billing_orders').insert({ user_id: user.id, package_id: pack.id, amount: pack.cents, credits: pack.credits, product_id: productId, provider: 'waffo', provider_mode: waffoEnvironment(), provider_store_id: waffoStoreId() }).select('id').single()
    if (error) throw error
    const session = await client.checkout.authenticated.create({
      productId, currency: 'USD', buyerIdentity: user.id, buyerEmail: user.email,
      orderMerchantExternalId: order.id,
      metadata: { order_id: order.id, user_id: user.id },
      successUrl: `${origin}/pricing?order=${order.id}`, expiresInSeconds: 3600,
      allowPromotionCodes: false,
    }, { idempotencyKey: `imageocr-${order.id}` })
    const { error: updateError } = await db.from('billing_orders').update({ checkout_id: session.sessionId }).eq('id', order.id).eq('user_id', user.id)
    if (updateError) throw updateError
    return NextResponse.json({ checkoutUrl: session.checkoutUrl })
  } catch (error) { return billingFailure(error) }
}
