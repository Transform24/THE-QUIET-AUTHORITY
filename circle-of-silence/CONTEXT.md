# Circle of Silence — Record Library
*Last updated: 2026-08-22*

One record per gate (`gate-N-name.md`), plus `products.md` for the full product catalog (gates + standalone products + lead magnets). Each gate record covers: Stripe product/pricing, email sequence content, delivery-mechanism status, and next action. Copy a new record from `_template/gate.md` when a gate moves from "NOT YET BUILT" to in-progress.

## The 6 Gates

| # | Name | Meaning | Status |
|---|---|---|---|
| 1 | HaKria | The Calling | Built, live on Stripe — email delivery blocked, see `gate-1-hakria.md` |
| 2 | Sheket | Stillness | Not yet built |
| 3 | HaMidbar | The Wilderness | Not yet built |
| 4 | Hitkania | Preparation | Not yet built |
| 5 | Bitachon | Trust | Not yet built |
| 6 | Hithavut | Becoming | Not yet built |

Price: $9/gate.

## Pipeline

- **Stripe** — webhook `we_1TmPsDDvGX7GhwdzZ15UzERO` fires on `checkout.session.completed` for each gate's product.
- **Buyer tagging** — was Stripe → Systeme.io, direct (no Make.com). Systeme.io is now shut down; the `.github/workflows/gate-buyer-sync.yml` cron that did this tagging has been deleted (2026-08-22, see `_archive/systeme-io-shutdown-2026-08.md`). This pipeline stage has no live destination — needs a new CRM decision before it can be rebuilt.
- **Access** — each gate's page (`gate-one.html` … `gate-six.html`, held at repo root, see `SITE-CONTEXT.md`) is reached via `?purchased=gateN` after a successful checkout.
- **Next steps to unblock**: create Gate 2–6 Stripe products, decide the post-Systeme.io email/tagging destination, then rebuild the buyer-sync automation against it.
