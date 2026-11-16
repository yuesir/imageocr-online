import nextEnv from '@next/env'
import { TaxCategory, WaffoPancakeError } from '@waffo/pancake-ts'
import { appendFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { PACKAGES } from '../lib/billing/catalog'
import { storeProducts, usdCents, waffoClient, waffoEnvironment, waffoStoreId } from '../lib/billing/waffo'
nextEnv.loadEnvConfig(process.cwd())

async function main() {
  if (waffoEnvironment() !== 'test') throw new Error('This setup command only provisions test products; production requires a separate reviewed rollout.')
  const client = waffoClient()
  const storeId = waffoStoreId()
  const store = await client.graphql.query<{ store: { id: string; status: string } | null }>({ query: 'query ($id: String!) { store(id: $id) { id status } }', variables: { id: storeId } })
  if (store.errors?.length || store.data?.store?.id !== storeId || store.data.store.status !== 'active') throw new Error('The configured store is not available to this merchant')
  const products = await storeProducts(client)
  for (const pack of PACKAGES) {
    const name = `ImageOCRAI ${pack.name} — ${pack.credits} images`
    const configured = process.env[`WAFFO_PRODUCT_${pack.id.toUpperCase()}`]
    const matches = products.filter(p => configured ? p.id === configured : p.name === name)
    if (matches.length > 1) throw new Error(`Ambiguous ${pack.name} products; configure the intended product ID`)
    let product = matches[0]
    if (!product && configured) throw new Error(`Configured ${pack.name} product does not belong to this store`)
    if (!product) {
      const { product: created } = await client.onetimeProducts.create({ storeId, name, description: `${pack.credits} image recognitions. One-time purchase, no renewal. Purchased images never expire.`, prices: { USD: { amount: (pack.cents / 100).toFixed(2), taxCategory: TaxCategory.SaaS } }, metadata: { app: 'imageocrai', package_id: pack.id, credits: pack.credits } }, { idempotencyKey: `imageocr-${storeId}-${pack.id}-${pack.cents}-test` })
      product = { ...created, prices: Object.entries(created.prices).map(([currency, priceInfo]) => ({ currency, priceInfo })) }
    }
    if (product.status !== 'active' || usdCents(product.prices.find(p => p.currency === 'USD')?.priceInfo.amount) !== pack.cents) throw new Error(`Unexpected price/status for ${pack.name}; review instead of silently updating a product`)
    if (!configured) appendFileSync('.env.local', `\nWAFFO_PRODUCT_${pack.id.toUpperCase()}=${product.id}\n`, { mode: 0o600 })
    console.log(`${pack.name}: ${product.id}, USD ${(pack.cents / 100).toFixed(2)}, ${pack.credits} images`)
  }
  const webhookUrl = process.env.WAFFO_WEBHOOK_URL
  if (!webhookUrl) { console.log('Products configured. Set WAFFO_WEBHOOK_URL to a public HTTPS endpoint, then rerun to register callbacks.'); return }
  if (new URL(webhookUrl).protocol !== 'https:') throw new Error('Webhook URL must use HTTPS')
  const hooks = await client.graphql.query<{ store: { storeWebhooks: Array<{ id: string; url: string; testMode: boolean }> } }>({ query: 'query ($id: String!) { store(id: $id) { storeWebhooks { id url testMode } } }', variables: { id: storeId } })
  if (hooks.errors?.length || !hooks.data?.store) throw new Error('Cannot inspect store webhooks')
  const events = ['order.completed', 'refund.succeeded'] as const
  const existing = hooks.data.store.storeWebhooks.find(h => h.url === webhookUrl && h.testMode)
  if (existing) await client.webhooks.update({ id: existing.id, events: [...events] })
  else await client.webhooks.add({ storeId, channel: 'http', url: webhookUrl, events: [...events], testMode: true }, { idempotencyKey: `imageocr-webhook-${storeId}-${createHash('sha256').update(webhookUrl).digest('hex').slice(0, 16)}-test` })
  console.log('Test webhook configured. No products were published to production.')
}
main().catch((error: unknown) => {
  const cause = error instanceof Error && 'cause' in error ? error.cause as { code?: string } | undefined : undefined
  const detail = error instanceof WaffoPancakeError ? `HTTP ${error.status}` : ['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED'].includes(cause?.code || '') ? cause!.code : 'check network access, credentials and product configuration'
  console.error(`Waffo test setup failed (${detail}). No private key was logged.`)
  process.exitCode = 1
})
