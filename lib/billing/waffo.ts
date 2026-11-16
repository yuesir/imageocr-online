import { WaffoPancake, verifyWebhook, type WebhookEvent, type WebhookEventData } from '@waffo/pancake-ts'
import type { PackageId } from './catalog'

export function waffoEnvironment(): 'test' | 'prod' {
  const mode = process.env.WAFFO_ENVIRONMENT || 'test'
  if (mode !== 'test' && mode !== 'prod') throw new Error('Invalid Waffo environment')
  return mode
}
export function waffoStoreId() {
  const id = process.env.WAFFO_STORE_ID
  if (!id) throw new Error('Waffo store is not configured')
  return id
}
export function waffoProductId(id: PackageId) {
  const product = process.env[`WAFFO_PRODUCT_${id.toUpperCase()}`]
  if (!product) throw new Error(`Waffo ${id} product is not configured`)
  return product
}
export function waffoClient() {
  const merchantId = process.env.WAFFO_MERCHANT_ID
  const privateKey = process.env.WAFFO_PRIVATE_KEY || (process.env.WAFFO_PRIVATE_KEY_BASE64 ? Buffer.from(process.env.WAFFO_PRIVATE_KEY_BASE64, 'base64').toString('utf8') : '')
  if (!merchantId || !privateKey) throw new Error('Waffo merchant credentials are not configured')
  return new WaffoPancake({ merchantId, privateKey, environment: waffoEnvironment(), fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(12000), cache: 'no-store' }) })
}
// The SDK boundary uses display strings exclusively. Internal accounting retains
// integer USD cents; never pass those integers into SDK amount fields.
export function usdCents(value: unknown): number {
  if (typeof value !== 'string' || !/^\d+(?:\.\d{1,2})?$/.test(value)) throw new Error('Invalid USD amount')
  const [whole, decimal = ''] = value.split('.')
  const amount = Number(whole) * 100 + Number(decimal.padEnd(2, '0'))
  if (!Number.isSafeInteger(amount) || amount > 2147483647) throw new Error('USD amount out of range')
  return amount
}
export function verifiedWaffoEvent(raw: string, signature: string | null): WebhookEvent {
  const event = verifyWebhook<WebhookEventData>(raw, signature, { environment: waffoEnvironment() })
  if (event.mode !== waffoEnvironment() || event.storeId !== waffoStoreId()) throw new Error('Wrong Waffo store or environment')
  if (!event.id || !event.eventId || !event.data?.orderId) throw new Error('Missing Waffo event identifiers')
  return event
}
export interface WaffoProduct {
  id: string; name: string; status: string
  prices: Array<{ currency: string; priceInfo: { amount: string; taxCategory: string } }>
}
export async function storeProducts(client = waffoClient()) {
  const result = await client.graphql.query<{ onetimeProducts: WaffoProduct[] }>({
    query: 'query ($storeId: String!) { onetimeProducts(storeId: $storeId) { id name status prices { currency priceInfo { amount taxCategory } } } }',
    variables: { storeId: waffoStoreId() },
  })
  if (result.errors?.length || !result.data?.onetimeProducts) throw new Error('Waffo product catalog unavailable')
  return result.data.onetimeProducts
}
