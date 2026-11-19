# ImageOCRAI billing — Waffo Pancake

## Current product model

One-time USD image packs: Starter $5.99 / 100 images, Plus $9.99 / 300, Max $19.99 / 800. Plus is recommended. Paid images never expire. Guests receive 1 free image per day. Signed-in accounts receive 2 per day total including guest use on the current IP. Free allowance resets at 00:00 UTC and is used first. One successful recognition, including an empty text result, uses one image allowance. Provider failures release the reservation.

## Test environment setup

1. Install dependencies with Node >=20: `npm ci`. The payment dependency is the official `@waffo/pancake-ts@0.28.0` package. Do not replace its request signing or webhook verification with custom cryptography.
2. Set server-only credentials in ignored `.env.local` (or your deployment secret manager):

   ```dotenv
   WAFFO_ENVIRONMENT=test
   WAFFO_MERCHANT_ID=MER_43OKW9eWvpvqc1s4Y8txgV
   WAFFO_STORE_ID=STO_4uOBdljErxd4STR1n3ehKJ
   WAFFO_PRIVATE_KEY=<your test private key>
   BILLING_ENABLED=false
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   The supplied test credentials have been saved locally with file mode 0600; they are not in tracked source. The SDK accepts raw base64, PEM, or escaped-newline PEM. `WAFFO_PRIVATE_KEY_BASE64` is an alternative for base64 of the **whole PEM**. Never use a `NEXT_PUBLIC_` prefix for credentials. Separate test and production keys.
3. Run `npm run billing:setup`. It verifies the specified store, reuses matching products or creates the three fixed-price **test** one-time products, then appends `WAFFO_PRODUCT_STARTER`, `WAFFO_PRODUCT_PLUS`, and `WAFFO_PRODUCT_MAX` to `.env.local`. USD amounts sent to the SDK are display strings (`"5.99"`, `"9.99"`, `"19.99"`), not integer cents. The script refuses ambiguous products or mismatched prices and never publishes products to production.
4. Apply migrations in order: `202611160001_billing.sql`, `202611160002_waffo.sql`, `202611160003_ocr_concurrency.sql`, then `202611190001_ocr_daily_limits.sql`. Existing rows remain attributed to Creem; new orders explicitly use `provider=waffo`, the configured mode and store. The original payment RPC remains for historical migration compatibility; the application uses only the Waffo routes. Back up before applying migrations.
5. Provide `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and the site URL. Tables have RLS and billing RPCs are service-role only. Deploy behind a trusted proxy that overwrites forwarding headers (e.g. Vercel); do not expose the origin with untrusted forwarding headers. The Vercel config uses Next.js routing; the old SPA rewrites would swallow all API routes.
6. For callbacks set `WAFFO_WEBHOOK_URL=https://<public-host>/api/billing/webhook`, then rerun `npm run billing:setup` to register `order.completed` and `refund.succeeded` for this test store. Use `ngrok http 3000` locally; localtunnel can strip signature headers. Keep the callback URL on a reachable HTTPS host.
7. Set a random `CRON_SECRET` and schedule a GET to `/api/billing/reconcile` every five minutes with `Authorization: Bearer <CRON_SECRET>`. A local secret was generated if absent. The endpoint processes three pending events per call; schedule extra calls if the inbox grows. `npm run billing:reconcile` also drains pending events from a trusted server CLI. Scheduling is intentionally not tied to a specific hosting plan.
8. Once sandbox payment/refund tests and the cost gate pass, set `BILLING_ENABLED=true` **in the test environment** to enable checkout. This switch stops new sales when false; already verified callbacks, purchased credit usage and refunds continue.

## Sandbox verification status (2026-11-17)

The specified merchant/store now has these active test products, created through the SDK and saved in ignored `.env.local`:

| Package | Test product | USD | Images |
| --- | --- | --- | --- |
| Starter | `PROD_5uQgXL2A57Nccxk0qtCYyK` | 5.99 | 100 |
| Plus | `PROD_7ABWVfbj3wgtT5cBQPR6gs` | 9.99 | 300 |
| Max | `PROD_2n5tCiobKDeGIqeyHXPuUg` | 19.99 | 800 |

The remote Supabase read-only allowance check passed. Direct terminal DNS fails on this machine; its system HTTP proxy is `http://127.0.0.1:7890`. Node 20 does not automatically inherit the macOS system proxy; use a proxy-aware runtime when running the application and setup commands here. No proxy is hardcoded into application source.

Run `npm run billing:verify` for read-only checks of the test catalog, registered payment/refund events and database reads. This does not prove webhook delivery or payment settlement. The test callback is registered at `https://voltage-open-bluff.ngrok-free.dev/api/billing/webhook` for `order.completed` and `refund.succeeded`. The local app origin is set to that ngrok host and `BILLING_ENABLED=true` for sandbox testing. The development server was restarted with a temporary proxy preload so it can reach Waffo and Supabase. The tunnel and proxy must remain running during testing; update the callback and app origin if the tunnel hostname changes. Starter sandbox payment verified at 2026-11-17 19:52:58 Asia/Shanghai: Waffo order `ORD_3nYNRGxHtGMtvREvuWgnOW` is completed in test mode for USD 5.99 (tax 0.00). Its callback was processed with zero retries and no error; exactly one purchase ledger entry granted 100 images, and the wallet balance was 100 at verification. No products were published to production. Plus/Max actual payments, declines and actual refunds remain unverified.

## Checkout and callback flow

- `POST /api/billing/checkout`: Supabase Bearer token required; JSON `{ "packageId": "starter" | "plus" | "max" }`. Browser-supplied prices, quantities and user IDs are ignored. The server queries the store's one-time catalog and verifies the configured SKU's USD price/status.
- The server stores the local order before calling `checkout.authenticated.create()`. `buyerIdentity` is the authenticated account UUID; `buyerEmail` is a separate pre-fill field. Local order UUID goes into `orderMerchantExternalId` and metadata. Each session call receives an explicit idempotency key. The SDK signs requests and returns an authenticated URL containing a short-lived token fragment. The browser uses same-tab `window.location.assign`; the success URL returns to pricing.
- Prices live on fixed-price products. Checkout does not accept priceSnapshot overrides or promotions. No quantity selector or subscription is offered. Applicable taxes are shown by Waffo at checkout. An order can only fulfill when its price subtotal matches the immutable local order amount and actual charged amount matches its final total.
- `POST /api/billing/webhook` reads `request.text()` and calls SDK `verifyWebhook` with `x-waffo-signature` and an explicit environment. It also checks event store and mode. The SDK's default replay window is retained; signatures are never disabled or implemented manually.
- Supported verified events are persisted to `billing_waffo_inbox` **before** a 200 acknowledgment. A failed durable write returns non-2xx. Next.js `after()` processes the inbox outside the response path; the protected scheduled reconciliation endpoint retries persisted failures. Do not run fire-and-forget promises in serverless handlers.
- Delivery ID and `(store, mode, eventType, eventId)` provide duplicate protection. A transaction lock makes wallet updates, ledger entries and processed-at changes atomic. Replayed purchases cannot regrant credits after a refund.
- Fulfillment reads the authoritative one-time order through SDK GraphQL and checks completed state, testMode, product ID, local order UUID and merchant-provided buyer identity. Email is not used as proof of ownership. The return page polls persisted, account-owned orders; return URL parameters never grant credits.
- USD strings are parsed strictly at the application boundary into internal integer cents. Financial arithmetic never uses `parseFloat`. Payment events use `chargedAmount`; refunds use `refundedAmount` and `originalChargedAmount`. Deprecated generic `amount` is not used to infer payment/refund figures. Missing or inconsistent figures remain pending for review.
- Successful refunds add their own actual amount exactly once to the order's cumulative refunded amount. The revoked image total is `ceil(pack_images × cumulative_refund / original_charged)`, including tax proportionally. Partial/full refunds, out-of-order deliveries and multiple refunds are supported. A spent refund can create wallet debt; future purchases first repay it. The UI displays this debt.

## Other interfaces and operational checks

- `GET /api/billing/balance`: optional Bearer token; returns freeRemaining, paidRemaining, refundedDebt and resetsAt. No caching.
- `GET /api/billing/orders`: authenticated; returns only that account's 50 latest orders.
- OCR APIs share atomic reservations. Optional `Idempotency-Key`: 8–128 letters/digits/`_`/`-`. Reuse the exact key and body for an automatic retry; generate a new key for a new user-requested recognition. Completed requests replay saved results, pending/different-input retries return 409, exhausted allowance returns 402, database failures fail closed with 503.
- `GET /api/billing/reconcile`: CRON_SECRET required. No public worker endpoint and no buyer token access to other users' orders or the inbox.

Monitor and alert on:

```sql
select id,event_type,attempts,last_error,created_at
from billing_waffo_inbox where processed_at is null order by created_at;
select actor,request_id,source,created_at from billing_requests
where state='pending' and created_at < now()-interval '10 minutes';
```

Inspect Waffo delivery logs for callback failures; resend after fixing configuration. Persisted inbox failures do not need signature replay: the internal worker already received a verified event. Events are retried fairly by attempts then age so a malformed event does not permanently starve newer deliveries. Alert on repeated failures and growing backlog.

Interrupted OCR reservations are deliberately not released automatically, which could let a still-running provider execute twice. Verify provider logs, then an operator calls `billing_finish(actor,id,false,null)` for known failure or `billing_finish(actor,id,true,response_json)` for known success. Keep request-ID tombstones when designing retention; deleting request rows permits old keys to execute again.

## Verification and launch gate

Run `npm run check`, `npm run test:billing`, `npm run build`. Tests apply the billing migrations in isolated in-process PostgreSQL (PGlite), use real SDK signing/verification with ephemeral fixture keys, and mock network responses. They do not write to the live database. PGlite serializes connections; production cross-connection safety relies on the PostgreSQL advisory lock.

SDK installation was blocked by terminal DNS in the implementation environment. For local verification only, the unmodified official SDK source was retrieved through GitHub at commit `69c8878094344fceb1edaed0290a4462b0671b6a` (package version 0.28.0) and compiled into ignored node_modules. The tracked dependency still targets the official npm release. Run `npm ci` with registry access before deployment; this local source build is not a substitute for the published-package deployment check.

Before live rollout, test actual Waffo sandbox checkout and raw signed deliveries: all three prices, login requirement, pending/confirmed return UI, payment success/decline, duplicate events, store/mode mismatches, partial/full/multiple refunds, refunded-before-completed events and repeat purchases. Waffo's documented test cards are `4576750000000110` (success) and `4576750000000220` (decline), with any future expiry and CVC. No production payment or product publishing has been performed locally; the successful Starter sandbox payment is recorded above.

Measure Qwen input/output tokens and billed cost for clear screenshots, dense text, handwriting, large images, empty images and failures. Successful calls log `ocr_cost_sample` without images/text. Include storage, platform, retries and **your Waffo merchant fee schedule**; do not reuse Creem fee assumptions. For an 80% contribution target on Max, average direct cost per image must be at most `(0.20 × $19.99 − payment fees) / 800`. Verify actual tax/refund treatment. Change pack quantities consistently before live sales if the cost gate fails; never rewrite historical orders.

For production use separate credentials, publish reviewed products using the SDK/dashboard, configure production IDs and callbacks, set `WAFFO_ENVIRONMENT=prod`, verify reconciliation scheduling, then enable sales. Do not publish production products as part of test setup. Announce the free-allowance cutover date and deploy at 00:00 UTC. Pause sales with BILLING_ENABLED rather than rolling back to unmetered handlers.

For the first 30 days, use account-owned billing orders/ledger as authoritative purchase, consumption and refund data. Existing consent-aware analytics records pricing visits and `image_pack_checkout` by package. Review conversion, Plus share, consumption, repeat buyers, refunds and direct cost before adding subscriptions.

## References

- [Official Waffo Pancake skill](https://docs.waffo.ai/zh/integrate/skill)
- [Official TypeScript SDK](https://github.com/waffo-com/waffo-pancake-sdk-ts)
- [SDK webhook guide](https://github.com/waffo-com/waffo-pancake-sdk-ts/blob/main/docs/webhook-guide.md)

Previously committed credential fallback literals were removed during the earlier billing work. Rotate any real credentials previously distributed; removing literals does not invalidate old copies. Current private keys belong only in secret storage.

## Diagnosing failed free recognition

Guest free usage does not call Waffo and does not depend on BILLING_ENABLED. It does depend on the Supabase quota tables and RPCs, including while payments are disabled. Run `npm run billing:check` from the same application environment; it only calls the read-only balance function and never consumes an image.

- `IMAGE_ALLOWANCE_EXHAUSTED` (HTTP 402): a successful quota check found no allowance. Guests receive login and pack links; members receive a pack link. Signing in raises the daily total from 1 to 2. Guest use counts toward that total.
- `ALLOWANCE_MIGRATION_REQUIRED` (HTTP 503): apply the billing migration in Supabase and rerun the check.
- `ALLOWANCE_NOT_CONFIGURED` / `ALLOWANCE_ACCESS_DENIED`: check server-only credentials and permissions.
- `ALLOWANCE_UNAVAILABLE`: check Supabase project availability and server network connectivity. This is not exhaustion; do not direct the user to pay to fix an infrastructure failure.

Server logs record the RPC operation and safe error code without credentials. Database requests have a 10-second timeout. Keep the shared persistent quota checks on failure: bypassing them would make the daily limit unenforceable across processes, devices and deployments.

## Parallel image recognition

The shared workbench processes up to 3 images simultaneously for accounts with a successfully paid, not fully refunded purchase; guests and never-purchased accounts process 1 at a time. Spending the purchased images does not remove the parallel-task benefit. All paid packages have the same concurrency limit. A full refund removes that purchase's entitlement; another qualifying purchase keeps it. The upload batch size remains 10 images.

`billing_balance` returns `concurrencyLimit` and `activeRequests`. The workbench uses a bounded worker pool, preserves upload order as results finish out of order, and shows queued/processing/completed states. All three OCR endpoints enforce the limit atomically through `billing_reserve`, counting pending requests for the same actor across providers and tabs. Locks protect only short database transactions; provider calls run concurrently outside the lock.

A busy account receives HTTP 429, `OCR_CONCURRENCY_LIMIT`, and `Retry-After: 2`, without reserving or consuming any image allowance. The shared workbench retries only these admission rejections for at most 3 minutes, reusing the same image body and idempotency key. Provider throttling and ambiguous network failures are not automatically retried. Each successful image still costs one allowance, and failed processing releases it.

Deploy the new concurrency migration before enabling the updated workbench. Without the migration, the workbench conservatively falls back to 1 worker. Existing stuck pending reservations occupy slots until reconciled; monitor them using the operational queries above. Do not expire them while a provider might still be processing the request.
