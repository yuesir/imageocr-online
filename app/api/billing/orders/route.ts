import { NextRequest, NextResponse } from 'next/server'
import { billingFailure, BillingError, identity } from '@/lib/billing/server'
export async function GET(request: NextRequest) {
  try {
    const { db, user } = await identity(request)
    if (!user) throw new BillingError('Please sign in to view your orders.', 401)
    const { data, error } = await db.from('billing_orders').select('id,package_id,amount,credits,status,created_at,refunded_amount').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    return NextResponse.json({ orders: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return billingFailure(error) }
}
