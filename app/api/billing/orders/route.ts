import { NextRequest, NextResponse } from 'next/server'
import { billingFailure, BillingError, identity } from '@/lib/billing/server'
export async function GET(request: NextRequest) {
  try {
    const { db, user } = await identity(request)
    if (!user) throw new BillingError('Please sign in to view your orders.', 401)
    const rawPage = request.nextUrl.searchParams.get('page')
    const page = rawPage === null ? null : Number(rawPage)
    if (page !== null && (!Number.isSafeInteger(page) || page < 1 || page > 100000)) throw new BillingError('Invalid order page.', 400)
    const size = page === null ? 50 : 20
    const offset = page === null ? 0 : (page - 1) * size
    const { data, error } = await db.from('billing_orders').select('id,package_id,amount,credits,status,created_at,refunded_amount').eq('user_id', user.id).order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + size)
    if (error) throw error
    return NextResponse.json({ orders: (data || []).slice(0, size), hasMore: (data?.length || 0) > size }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return billingFailure(error) }
}
