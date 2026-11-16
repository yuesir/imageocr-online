import type { WebhookEvent } from '@waffo/pancake-ts'
import { billingDB, rpc } from './server'
import { usdCents, waffoClient, waffoEnvironment, waffoStoreId } from './waffo'

interface RemoteOrder {
  id: string; status: string; testMode: boolean
  priceSnapshot: { currency: string; subtotal: string; taxAmount: string; total: string }
  onetimeProduct: { id: string }
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export async function waffoPaymentArguments(event: WebhookEvent, client = waffoClient()) {
  const data = event.data
  if (event.mode !== waffoEnvironment() || event.storeId !== waffoStoreId() || data.currency !== 'USD') throw new Error('Waffo event context mismatch')
  const localId = data.orderMerchantExternalId || data.orderMetadata?.order_id
  const userId = data.merchantProvidedBuyerIdentity
  if (!localId || !UUID.test(localId) || !userId || !UUID.test(userId)) throw new Error('Missing merchant order/customer identity')
  const result = await client.graphql.query<{ onetimeOrder: RemoteOrder | null }>({
    query: 'query ($id: String!) { onetimeOrder(id: $id) { id status testMode priceSnapshot { currency subtotal taxAmount total } onetimeProduct { id } } }',
    variables: { id: data.orderId },
  })
  const order = result.data?.onetimeOrder
  if (result.errors?.length || !order || order.id !== data.orderId || order.testMode !== (event.mode === 'test') || order.status !== 'completed' || order.priceSnapshot.currency !== 'USD') throw new Error('Waffo order is not completed in this environment')
  const amount = usdCents(order.priceSnapshot.subtotal)
  const total = usdCents(order.priceSnapshot.total)
  if (total !== amount + usdCents(order.priceSnapshot.taxAmount)) throw new Error('Unsupported discounted or inconsistent order')
  let charged: number
  let refund = 0
  if (event.eventType === 'order.completed') {
    if (data.paymentStatus !== 'succeeded') throw new Error('Payment is not successful')
    charged = usdCents(data.chargedAmount)
  } else if (event.eventType === 'refund.succeeded') {
    if (data.refundStatus !== 'succeeded') throw new Error('Refund is not successful')
    charged = usdCents(data.originalChargedAmount)
    refund = usdCents(data.refundedAmount)
    if (refund <= 0 || refund > charged) throw new Error('Invalid refund amount')
  } else throw new Error('Unsupported Waffo event')
  if (charged !== total || charged <= 0) throw new Error('Charged amount does not match order total')
  return { p_delivery: event.id, p_local_id: localId, p_user: userId, p_provider_order: order.id, p_product: order.onetimeProduct.id, p_amount: amount, p_charged: charged, p_refunded: refund }
}

// The durable inbox survives server restarts. `after()` handles normal delivery;
// the protected reconciliation endpoint retries failures and out-of-order events.
export async function processWaffoInbox(limit = 3) {
  const db = billingDB()
  const { data, error } = await db.from('billing_waffo_inbox').select('id,payload,attempts').eq('mode', waffoEnvironment()).eq('store_id', waffoStoreId()).is('processed_at', null).order('attempts').order('created_at').limit(limit)
  if (error) throw error
  let processed = 0
  for (const row of data ?? []) {
    try {
      const event = row.payload as WebhookEvent
      await rpc(db, 'billing_waffo_apply', await waffoPaymentArguments(event))
      processed++
    } catch {
      // Do not log SDK errors, signed payloads, buyer data or credentials.
      console.error('Waffo event requires reconciliation', row.id)
      const { error: updateError } = await db.from('billing_waffo_inbox').update({ attempts: row.attempts + 1, last_error: 'Processing failed; verify order state, identity and amounts.' }).eq('id', row.id).is('processed_at', null)
      if (updateError) console.error('Unable to record Waffo reconciliation failure', row.id)
    }
  }
  return { examined: data?.length ?? 0, processed }
}
