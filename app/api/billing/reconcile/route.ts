import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { processWaffoInbox } from '@/lib/billing/waffo-events'
import { billingFailure } from '@/lib/billing/server'
export const runtime = 'nodejs'
export const maxDuration = 60
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const expected = Buffer.from(`Bearer ${secret || ''}`)
  const actual = Buffer.from(request.headers.get('authorization') || '')
  if (!secret || expected.length !== actual.length || !timingSafeEqual(expected, actual)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { return NextResponse.json(await processWaffoInbox(3), { headers: { 'Cache-Control': 'no-store' } }) } catch (error) { return billingFailure(error) }
}
