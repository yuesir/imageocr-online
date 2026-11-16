# Waffo Pancake integration

Provider: `@waffo/pancake-ts` (server only). See [billing setup and launch checklist](docs/billing.md).

Merchant credentials belong in ignored `.env.local` or your deployment secret manager. Checkout uses authenticated SDK sessions. Raw-body webhooks use SDK RSA-SHA256 verification and a durable database inbox before fulfillment.

`npm run billing:setup` provisions the three one-time packages in the configured **test** store and optionally registers `WAFFO_WEBHOOK_URL`. It never publishes production products.
