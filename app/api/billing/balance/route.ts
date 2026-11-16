import { NextRequest, NextResponse } from 'next/server'
import { identity, rpc } from '@/lib/billing/server'
import { allowanceFailure } from '@/lib/billing/allowance'
export async function GET(request: NextRequest) {
  try {
    const { db, actor, guest, user } = await identity(request)
    return NextResponse.json(await rpc(db, 'billing_balance', { p_actor: actor, p_guest: guest, p_user: user?.id ?? null }), { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return allowanceFailure(error) }
}
