import { NextRequest, NextResponse, after } from 'next/server'
import { billingDB, billingFailure } from '@/lib/billing/server'
import { verifiedWaffoEvent } from '@/lib/billing/waffo'
import { processWaffoInbox } from '@/lib/billing/waffo-events'
export const runtime = 'nodejs'
export const maxDuration = 60
export async function POST(request: NextRequest) {
  const raw = await request.text()
  let event
  try {
    event = verifiedWaffoEvent(raw, request.headers.get('x-waffo-signature'))
  } catch {
    return NextResponse.json({ error: 'Invalid Waffo signature or event context' }, { status: 401 })
  }
  if (event.eventType !== 'order.completed' && event.eventType !== 'refund.succeeded') return NextResponse.json({ received: true })
  try {
    const { error } = await billingDB().from('billing_waffo_inbox').upsert({ id: event.id, event_id: event.eventId, event_type: event.eventType, store_id: event.storeId, mode: event.mode, payload: event }, { onConflict: 'store_id,mode,event_type,event_id', ignoreDuplicates: true })
    if (error) throw error
    // Never acknowledge an event before its durable write succeeds.
    after(async () => { try { await processWaffoInbox() } catch { console.error('Waffo inbox worker unavailable') } })
    return NextResponse.json({ received: true })
  } catch (error) { return billingFailure(error) }
}
