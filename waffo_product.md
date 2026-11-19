# ImageOCRAI one-time image packs

| Product | USD price | Images | Billing type |
| --- | ---: | ---: | --- |
| Starter | $5.99 | 100 | One-time |
| Plus (Recommended) | $9.99 | 300 | One-time |
| Max | $19.99 | 800 | One-time |

Create fixed-price one-time Waffo Pancake products using display amount strings: "5.99", "9.99", and "19.99". Applicable taxes are displayed at checkout. The server validates product price against the catalog and settled subtotal against the local order. No subscriptions, automatic renewals, discounts, or adjustable quantities. Purchased images never expire and packs accumulate. All packs use the same recognition engine.

Plus: Just $4 more for 3× the images; 44% lower cost per image than Starter.

Free allowances: guests 1/day, signed-in accounts 2/day total, resetting at 00:00 UTC. Guest use counts toward the signed-in daily allowance. Free images are used first. Successful recognition with no detected text still counts; failed processing does not. PDF and public API access are not included.

Test store: `STO_4uOBdljErxd4STR1n3ehKJ`. Run `npm run billing:setup` to provision test products; this command does not publish products to production.

All three purchased packages unlock up to 3 simultaneous recognition tasks per account. Free accounts and guests have 1 slot. Parallel processing does not change the per-image allowance cost.
