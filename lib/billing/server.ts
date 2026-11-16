import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export function billingDB() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new BillingStorageError('configuration', 'MISSING_CONFIGURATION')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000) }) },
  })
}
export class BillingStorageError extends Error {
  readonly publicCode: string
  constructor(public operation: string, public code: string) {
    super('Image allowance storage unavailable')
    this.publicCode = code === 'MISSING_CONFIGURATION' ? 'ALLOWANCE_NOT_CONFIGURED'
      : ['PGRST202', 'PGRST205', '42883', '42P01'].includes(code) ? 'ALLOWANCE_MIGRATION_REQUIRED'
      : ['401', '403', '42501', 'PGRST301', 'PGRST302', 'PGRST303'].includes(code) ? 'ALLOWANCE_ACCESS_DENIED'
      : 'ALLOWANCE_UNAVAILABLE'
  }
}
export class BillingError extends Error {
  constructor(message: string, public status = 503) { super(message) }
}
export async function identity(request: NextRequest) {
  const db = billingDB()
  const authorization = request.headers.get('authorization')
  let user = null
  if (authorization) {
    const token = authorization.match(/^Bearer (.+)$/)?.[1]
    if (!token) throw new BillingError('Please sign in again.', 401)
    const { data, error } = await db.auth.getUser(token)
    if (error || !data.user) throw new BillingError('Please sign in again.', 401)
    user = data.user
  }
  // Deploy behind a trusted proxy that overwrites these headers (e.g. Vercel).
  const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
  const guest = 'guest:' + createHash('sha256').update(ip.split(',')[0].trim()).digest('hex')
  return { db, user, guest, actor: user ? `user:${user.id}` : guest }
}
export function billingFailure(error: unknown) {
  console.error('Billing operation failed:', error instanceof BillingError ? error.message : 'Server operation failed')
  return NextResponse.json({ error: error instanceof BillingError ? error.message : 'Billing is temporarily unavailable. Please retry.', message: error instanceof BillingError ? error.message : 'Billing is temporarily unavailable. Please retry.' }, { status: error instanceof BillingError ? error.status : 503 })
}
export async function rpc(db: ReturnType<typeof billingDB>, name: string, args: Record<string, unknown>) {
  const { data, error } = await db.rpc(name, args)
  if (error) throw new BillingStorageError(name, error.code || 'FETCH_FAILED')
  return data
}
