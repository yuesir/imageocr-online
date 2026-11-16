import { createHash, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { identity, rpc } from './server'
import { allowanceFailure, exhaustedAllowance } from './allowance'

// All providers share this reservation boundary. Completed responses are replayed
// without invoking a provider again; in-flight requests are never stolen.
export function meteredOCR(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    let context: Awaited<ReturnType<typeof identity>> | undefined
    let requestId: string | undefined
    let reserved = false
    let providerSucceeded = false
    try {
      context = await identity(request)
      requestId = request.headers.get('idempotency-key') || randomUUID()
      if (!/^[a-zA-Z0-9_-]{8,128}$/.test(requestId)) return NextResponse.json({ error: 'Invalid request identifier' }, { status: 400 })
      const body = await request.clone().text()
      const fingerprint = createHash('sha256').update(request.nextUrl.pathname + '\n' + body).digest('hex')
      const reservation = await rpc(context.db, 'billing_reserve', { p_actor: context.actor, p_guest: context.guest, p_user: context.user?.id ?? null, p_id: requestId, p_fingerprint: fingerprint })
      if (reservation.kind === 'replay') return NextResponse.json(reservation.response)
      if (reservation.kind === 'conflict') return NextResponse.json({ error: 'Request identifier already used for another image.' }, { status: 409 })
      if (reservation.kind === 'pending') return NextResponse.json({ error: 'This image is still processing. Retry with the same request identifier.' }, { status: 409 })
      if (reservation.kind === 'busy') return NextResponse.json({ error: 'Concurrent image limit reached', errorCode: 'OCR_CONCURRENCY_LIMIT', message: 'All your parallel tasks are busy. Please retry this image shortly.', concurrencyLimit: reservation.concurrencyLimit }, { status: 429, headers: { 'Retry-After': '2' } })
      if (reservation.kind === 'exhausted') return exhaustedAllowance(Boolean(context.user))
      reserved = true
      const response = await handler(request)
      const payload = await response.clone().json()
      providerSucceeded = response.ok && payload.success === true
      await rpc(context.db, 'billing_finish', { p_actor: context.actor, p_id: requestId, p_success: providerSucceeded, p_response: providerSucceeded ? payload : null })
      reserved = false
      return response
    } catch (error) {
      // If persistence fails after provider success, keep the reservation. An
      // operator can reconcile it; refunding here could make a retry double-run.
      if (reserved && !providerSucceeded && context && requestId) {
        try { await rpc(context.db, 'billing_finish', { p_actor: context.actor, p_id: requestId, p_success: false, p_response: null }) } catch { console.error('OCR reservation needs reconciliation', requestId) }
      }
      return allowanceFailure(error)
    }
  }
}
