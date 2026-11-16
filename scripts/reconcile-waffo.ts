import nextEnv from '@next/env'
import { processWaffoInbox } from '../lib/billing/waffo-events'
nextEnv.loadEnvConfig(process.cwd())
processWaffoInbox(20).then(result => console.log(result)).catch(() => { console.error('Waffo reconciliation failed; check server configuration.'); process.exitCode = 1 })
