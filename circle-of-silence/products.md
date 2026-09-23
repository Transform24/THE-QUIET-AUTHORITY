# Products
*Last updated: 2026-08-22*

## The Circle of Silence — $9/gate
All six corrected 2026-09-23 — previously said Gates 2–6 were not built; they are live.
- Gate 1 HaKria: https://buy.stripe.com/eVqfZh8Ba8Od0Es8YGcQU0w — LIVE, see `gate-1-hakria.md`
- Gate 2 Sheket: https://buy.stripe.com/6oU3cv8Bac0pcna0sacQU0x — LIVE, see `gate-2-sheket.md`
- Gate 3 HaMidbar: https://buy.stripe.com/9B600j9FefcB0EscaScQU0y — LIVE, see `gate-3-hamidbar.md`
- Gate 4 Hitkania: https://buy.stripe.com/dRmdR9g3CfcB72Qgr8cQU0z — LIVE, see `gate-4-hitkania.md`
- Gate 5 Bitachon: https://buy.stripe.com/6oU00j4kU9Sh3QE7UCcQU0A — LIVE, see `gate-5-bitachon.md`
- Gate 6 Hithavut: https://buy.stripe.com/eVq8wP8Ba0hHgDqej0cQU0B — LIVE, see `gate-6-hithavut.md`

## The Woman Who Pours — $15.99
- Standalone product
- Separate Pinterest track
- Email listing needed (MailerLite — see `_system/integrations.md`)

## The Secret Place — three separate things, don't conflate
Corrected 2026-09-23 — this used to describe one free product; there are three.
- **Free entry page** (`the-secret-place.html`) — email capture only, MailerLite groupKey `secretplace`.
- **Free pre-study foyer** (`the-secret-place-foyer.html`) — email capture, MailerLite groupKey `secretplace_foyer`. This groupKey is not in the Worker's `MAILERLITE_GROUPS` map yet — signups from this page currently fail with a 400. Needs its MailerLite group ID added to `worker.js`.
- **Paid guide, "Architecture of Intimacy"** (`secret-place-architecture-of-intimacy.html`) — $9, https://buy.stripe.com/6oU8wPbNmggFevigr8cQU0F, verified the same way as the gates via the Worker's `/secret-place/download` route, which streams the PDF after a verified purchase.

## Four Lead Magnet Apps — Free
- Guilty Giver, Depleted Survivor, Striving Achiever, Lost Wanderer
- Live at transform24.github.io/THE-QUIET-AUTHORITY/
- Corrected 2026-09-23 — each page's email capture was silently dead (pointed at a shut-down Make.com/Brevo webhook, `.catch(()=>{})` swallowed every failure). Fixed to use the same Worker `/mailerlite-subscribe` route as the rest of the site, reusing the real, already-existing groups: Guilty Giver → `C`, Depleted Survivor → `B`, Striving Achiever → `A`, Lost Wanderer → `D`. Tested in a real browser — each now sends the right email to the right group.

## Wall Art — Stripe (live)
| Profile | Price | Link |
|---|---|---|
| A — The Striving Achiever | $9.99 | buy.stripe.com/14AbJ1bNm3tT9aY3EmcQU0n |
| B — The Depleted Survivor | $9.99 | buy.stripe.com/dRm9ATg3Cc0p2MA2AicQU0r |
| C — The Guilty Giver | $9.99 | buy.stripe.com/7sYdR95oY3tT1IwdeWcQU0q |
| D — The Lost Wanderer | $9.99 | buy.stripe.com/5kQdR92cM5C1af23EmcQU0o |
| Bundle — All Four | $29.99 | buy.stripe.com/7sY4gz5oY4xXbj6caScQU0l |

Wall art images: `wall-art-WOMT9.jpg` (A) · `wall-art-WOMT8.jpg` (B) · `wall-art-WOMT-profile3.jpg` (C) · `wall-art-WOMT-profile2.jpg` (D) · `wall-art-WOMT-cover1.jpg` (hero)

## Devotionals — Stripe (live)
| Product | Price | Link |
|---|---|---|
| Week 1 — Vision | $4.99 | buy.stripe.com/cNieVdbNm6G586UdeWcQU03 |
| Week 2 — Renewal | $4.99 | buy.stripe.com/3cI7sL18I7K9evi1wecQU04 |
| Week 3 — Peace | $4.99 | buy.stripe.com/14A7sL8Ba4xX9aY7UCcQU06 |
| Week 4 — Calling | $4.99 | buy.stripe.com/eVqeVd7x66G5gDq0sacQU02 |
| Bundle all 4 | $19.96 | buy.stripe.com/4gM6oH6t28Od5YM3EmcQU0k |

## Books — Stripe (live)
| Product | Price | Link |
|---|---|---|
| The Quiet Authority | $15.99 | buy.stripe.com/00w3cv5oYc0p0EscaScQU0d |
| The Parable of the Cocoon | $15.99 | buy.stripe.com/eVq3cv8Ba6G5bj6fn4cQU0g |
| R.E.S.T. Workbook | Free | https://sanctuarygrace.store |

## Amazon Affiliate (tag: sanctuarygrac-20)
Weighted fleece throw · Travel mug · Prayer journal · Flameless candles · Butterfly mug · Diffuser · Leather journal · Parallel Bible
All links already in `index.html` `SACRED_SPACE` data. Do not modify link structure.

## Digistore24 Affiliate
| Product | Platform | Price | Commission | Link |
|---|---|---|---|---|
| Harmony Within — Faith & Resilience Guide | DigiStore24 Affiliate | $15.03 | $8.26 commission | https://www.digistore24.com/redir/512623/tdwdemp/ |
