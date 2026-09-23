# Circle of Silence — Record Library
*Last updated: 2026-08-22*

One record per gate (`gate-N-name.md`), plus `products.md` for the full product catalog (gates + standalone products + lead magnets). Each gate record covers: Stripe product/pricing, email sequence content, delivery-mechanism status, and next action.

Corrected 2026-09-23 — all six gates are built and live. This file previously said Gates 2–6 were "Not yet built"; that was stale and wrong, confirmed against the live worker code and a real browser test.

## The 6 Gates

| # | Name | Meaning | Status |
|---|---|---|---|
| 1 | HaKria | The Calling | Built, live on Stripe — email delivery blocked, see `gate-1-hakria.md` |
| 2 | Sheket | Stillness | Built, live on Stripe, see `gate-2-sheket.md` |
| 3 | HaMidbar | The Wilderness | Built, live on Stripe, see `gate-3-hamidbar.md` |
| 4 | Hitkania | Preparation | Built, live on Stripe, see `gate-4-hitkania.md` |
| 5 | Bitachon | Trust | Built, live on Stripe, see `gate-5-bitachon.md` |
| 6 | Hithavut | Becoming | Built, live on Stripe, see `gate-6-hithavut.md` |

Price: $9/gate.

## Pipeline

- **Stripe** — one live Payment Link per gate. Webhook `we_1TmPsDDvGX7GhwdzZ15UzERO` fires on `checkout.session.completed`; where it delivers is not confirmed in this repo.
- **Verification** — Cloudflare Worker `lively-dew-924c` (source: `THE-CIRCLE-OF-SILENCE/worker/worker.js`), route `/verify-purchase`. Checks the Stripe session and matches its payment link to a gate.
- **Access** — each gate's page (`gate-one.html` … `gate-six.html`, held at repo root, see `SITE-CONTEXT.md`) is reached by the Stripe redirect appending `?session_id={CHECKOUT_SESSION_ID}`, which the page sends to the Worker above. The old `?purchased=gateN` param is dead — do not rely on it, and correct any doc still describing it.
- **Buyer tagging** — on a verified purchase, the Worker adds the buyer's email to that gate's MailerLite group directly (see `worker.js` `GATE_MAILERLITE_GROUPS`). No Systeme.io or Make.com step exists in this path.
- **Open item**: the buyer's MailerLite welcome-sequence automation is built but disabled — see `gate-1-hakria.md`.
