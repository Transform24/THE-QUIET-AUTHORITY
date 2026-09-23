# Products
*Last updated: 2026-09-23*

## OPEN GAP (2026-09-23) — books, devotionals, wall art have NO delivery mechanism
Audited every non-gate paid product (books, devotionals, wall art, R.E.S.T. Workbook) against
what actually happens after checkout. Real, serious gap, not a guess:

- The six gates and the Secret Place guide are the *only* paid products with any delivery
  code. Confirmed by grepping the whole site (`grep -rl "session_id\|verify-purchase" *.html`):
  only `gate-one.html` … `gate-six.html` and `secret-place-architecture-of-intimacy.html` match.
  Those pages append `?session_id={CHECKOUT_SESSION_ID}` on the Stripe redirect and call the
  Worker's `/verify-purchase` or `/secret-place/download` route to unlock/stream the product
  (`worker/worker.js:19-26,52-54,375-381`).
- Every book, devotional-week, devotional-bundle, and wall-art link/button in `index.html`
  (`index.html:1194-1336`, `1248-1302`) is a plain `<a href="https://buy.stripe.com/...">` or
  `onclick="goShop(url)"` (`index.html:2373`, `goShop` just does
  `window.open(u,'_blank','noopener noreferrer')`). There is no `session_id` handling anywhere
  for these products, no return/thank-you page, no Worker route for them (`worker/worker.js` has
  no `PAYMENT_LINKS` entries for books/devotionals/wall-art — only `GATE_PAYMENT_LINKS` and
  `SECRET_PLACE_PAYMENT_LINK`), and no email-delivery logic.
- Concretely: a customer who pays $15.99 for *The Quiet Authority* or $9.99 for a wall-art
  profile lands on whatever generic confirmation Stripe's own Payment Link shows (that part is
  configured in the Stripe Dashboard, outside this repo, and out of scope to check live — Stripe
  MCP here is test-mode only and these are live links). Nothing in this codebase then gives them
  the book, the devotional PDF, or the wall-art files. The gallery copy at
  `index.html:1235` literally promises **"Instant digital download"** for wall art — that promise
  is not backed by any code path.
- **Needs Grace's decision.** The honest fix, matching the pattern already built for the gates,
  is a Worker route (or routes) that verifies the Checkout Session the same way
  `/verify-purchase` does, matches the payment link to a book/devotional/wall-art product, and
  either streams the file back (like `/secret-place/download`) or emails it via MailerLite. Not
  invented here — do not add a fake "thank you" page that implies delivery without it.
- Devotional bundle price note: the shop page shows the bundle at **$14.99** with **$19.96**
  struck through (`index.html:1218-1219`), but this file and the `ARTDEVOT` promo copy
  (`index.html:1684`) both still say $19.96 is the bundle's price. Which one Stripe actually
  charges could not be checked (live-mode link, no live Stripe access here) — flagging so Grace
  can confirm the Payment Link's real price matches the $14.99 shown on-site.

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
| R.E.S.T. Workbook | Free | https://beacons.ai/sanctuarygrace |

Corrected 2026-09-23 — this row said `https://sanctuarygrace.store`; the actual link in
`index.html:1326` is `https://beacons.ai/sanctuarygrace`. Both point at the same ministry —
`sanctuarygrace.store` is Grace's own vanity domain used as the closing CTA across every
Pinterest/Instagram/YouTube/Substack caption (`content-ops/02_pinterest/agent.md:11`,
`content-ops/03_instagram/agent.md:11,45`, etc.), and `content-ops/_factory/brand-assets.md:144`
and `content-ops/_factory/templates/product-registry.md:47,90` both name
`beacons.ai/sanctuarygrace` as the actual Beacons storefront/email platform behind it. So this
is coherent — one ministry, one Beacons storefront, reached by two URLs — but it could not be
confirmed end-to-end because this network can't fetch `sanctuarygrace.store` to verify it really
redirects to Beacons; that's an external DNS/redirect fact outside this repo. This free
workbook is delivered by Beacons itself (not this repo, not the Worker), so it is not part of
the delivery-mechanism gap above.

## "Women of Many Tongues" — not found
Checked for it everywhere the task named: not in this repo (`grep -rn -i "many tongues" .` —
zero hits anywhere, including `index.html`, `library.html`, and every `content-ops/` doc), and
not in Metricool's currently-scheduled pins (checked read-only via `getScheduledPosts` for brand
`_thequietauthority_`, 2026-09-23 through 2026-12-31 — all scheduled Pinterest pins are the
"25 Names of God" series linking to `sanctuary-grace.com/library.html`; none mention "Women of
Many Tongues"). The `wall-art-WOMT*.jpg` filenames are **not** this — `WOMT` is shorthand for
"The Woman Who Pours" per `_archive/2026-06-session-reports/FLYWHEEL_OPERATIONAL_REPORT.md:115-118`
and those five files are the existing, already-wired Profile A–D wall art + hero image listed
above. If "Women of Many Tongues" is a real product, it isn't in this repo and isn't in the
Metricool data checked — needs Grace to say where it actually lives (a past/archived pin, a
different board, or a name that got conflated with something else).

## Amazon Affiliate (tag: sanctuarygrac-20)
Weighted fleece throw · Travel mug · Prayer journal · Flameless candles · Butterfly mug · Diffuser · Leather journal · Parallel Bible
All links already in `index.html` `SACRED_SPACE` data. Do not modify link structure.

Checked 2026-09-23 — all 8 distinct destinations in `index.html:1637-1663` (SACRED_SPACE, profiles
A–D) are `https://amzn.to/XXXXXXX` short-link form, consistently formatted, no missing tag, no
malformed query string, no direct `amazon.com` link in the live site (those only exist as
examples in the older `content-ops/_factory/templates/product-registry.md:58-85`). Because these
are short-links, the actual `sanctuarygrac-20` tag is applied server-side on Amazon's redirect
and can't be confirmed without following the link (no external fetch available on this network);
structurally, though, every link is consistent and nothing here needed fixing.

## Digistore24 Affiliate
| Product | Platform | Price | Commission | Link |
|---|---|---|---|---|
| Harmony Within — Faith & Resilience Guide | DigiStore24 Affiliate | $15.03 | $8.26 commission | https://www.digistore24.com/redir/512623/tdwdemp/ |
