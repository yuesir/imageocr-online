import nextEnv from '@next/env'
import { PACKAGES } from '../lib/billing/catalog'
import { billingDB, rpc } from '../lib/billing/server'
import { storeProducts, usdCents, waffoClient, waffoEnvironment, waffoProductId, waffoStoreId } from '../lib/billing/waffo'
nextEnv.loadEnvConfig(process.cwd())

class ReadinessError extends Error {}

// Read-only readiness check. No orders, charges, credits or products are created.
async function main() {
  if (waffoEnvironment() !== 'test') throw new ReadinessError('Run this check with WAFFO_ENVIRONMENT=test')
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (!site || !['http:', 'https:'].includes(new URL(site).protocol)) throw new ReadinessError('Set NEXT_PUBLIC_SITE_URL to the application URL')
  const client = waffoClient()
  const products = await storeProducts(client)
  for (const pack of PACKAGES) {
    const product = products.find(p => p.id === waffoProductId(pack.id))
    if (!product || product.status !== 'active' || usdCents(product.prices.find(p => p.currency === 'USD')?.priceInfo.amount) !== pack.cents) throw new ReadinessError(`Run billing:setup: ${pack.name} test product is missing or has an unexpected price/status`)
    console.log(`${pack.name}: catalog verified`)
  }
  const url = process.env.WAFFO_WEBHOOK_URL
  if (!url || new URL(url).protocol !== 'https:') throw new ReadinessError('Set WAFFO_WEBHOOK_URL to a reachable HTTPS /api/billing/webhook endpoint, then run billing:setup')
  const hooks = await client.graphql.query<{ store: { storeWebhooks: Array<{ url: string; testMode: boolean; events: string[] }> } }>({
    query: 'query ($id: String!) { store(id: $id) { storeWebhooks { url testMode events } } }', variables: { id: waffoStoreId() },
  })
  if (hooks.errors?.length || !hooks.data?.store?.storeWebhooks.some(h => h.url === url && h.testMode && ['order.completed', 'refund.succeeded'].every(e => h.events.includes(e)))) throw new ReadinessError('Test payment/refund webhook registration is missing; run billing:setup')
  const db = billingDB()
  await rpc(db, 'billing_balance', { p_actor: 'guest:read-only-healthcheck', p_guest: 'guest:read-only-healthcheck', p_user: null })
  for (const table of ['billing_orders', 'billing_waffo_inbox']) {
    const { error } = await db.from(table).select('id').limit(0)
    if (error) throw new ReadinessError(`Check database migrations and service-role access: ${table}`)
  }
  console.log('Test catalog, webhook registration and database reads verified. This does not verify webhook delivery or settlement.')
  console.log(`Checkout switch: ${process.env.BILLING_ENABLED === 'true' ? 'enabled' : 'disabled (BILLING_ENABLED=false)'}`)
}
main().catch((error: unknown) => {
  if (error instanceof ReadinessError) console.error(error.message)
  console.error('Waffo readiness check failed. Check site URL, test product IDs, webhook registration, database migrations and network connectivity. Run billing:setup and billing:check for individual checks. No credentials were logged.')
  process.exitCode = 1
})
