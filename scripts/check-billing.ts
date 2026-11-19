import nextEnv from '@next/env'
import { billingDB, BillingStorageError, rpc } from '../lib/billing/server'
nextEnv.loadEnvConfig(process.cwd())
try {
  const balance = await rpc(billingDB(), 'billing_balance', { p_actor: 'guest:read-only-healthcheck', p_guest: 'guest:read-only-healthcheck', p_user: null })
  console.log(`Image allowance service is ready. Free images remaining for the guest check: ${balance.freeRemaining}.`)
} catch (error) {
  const code = error instanceof BillingStorageError ? error.publicCode : 'ALLOWANCE_UNAVAILABLE'
  console.error('Image allowance check failed:', code)
  if (code === 'ALLOWANCE_MIGRATION_REQUIRED') console.error('Apply supabase/migrations/202611160001_billing.sql in Supabase, then rerun this check.')
  else if (code === 'ALLOWANCE_NOT_CONFIGURED' || code === 'ALLOWANCE_ACCESS_DENIED') console.error('Check server Supabase URL and service-role credentials. Never use the anonymous key as the service-role key.')
  else console.error('Check connectivity to Supabase from the application server and confirm the project is running. This is not quota exhaustion.')
  process.exitCode = 1
}
