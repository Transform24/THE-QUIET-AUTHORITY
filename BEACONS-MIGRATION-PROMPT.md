# Prompt for a Claude Code session with GitHub/browser file access (Beacons CDN is blocked from this cloud sandbox's egress proxy)

Paste this whole block into that session:

---

Migrate 7 real products off Beacons (sanctuarygrace.store) onto sanctuary-grace.com, using the exact pattern already live for the Names & Attributes ebook and The Woman Who Pours: a Cloudflare Worker (`lively-dew-924c`, repo `Transform24/the-circle-of-silence`, worker.js) with one KV namespace per product, a `/<slug>/seed` + `/<slug>/asset-check` route pair, and a Stripe Payment Link (live mode) for the 3 paid items. The 4 free items skip Stripe and just gate on email capture or direct-download.

### Files to pull from Beacons (download these URLs, they are on cdn.beacons.ai which this session must be able to reach directly):

| Product | Price | Beacons product_id | File type |
|---|---|---|---|
| The Quiet Authority: Transforming Nurturer Burnout into Spiritual Power | $15.99 | 0f44f263-3577-4903-a69b-f886307faf43 | PDF |
| The Parable of the Cocoon | $15.99 | 57645f98-cc69-4d06-96e2-398c350cfcee | docx |
| SANCTUARY: A Place of Peace | $15.99 | c562a2b7-6c29-49c0-bb09-575d5e131ebe | docx |
| The R.E.S.T. Companion Workbook | Free | 278a357e-4ba5-404d-85ad-dbdff0f49970 | PDF |
| The Wilderness (devotional) | Free | c90b8e12-1ab8-4b21-8f55-a1db29f680d3 | docx, **NEEDS A REWRITE, do not port as-is** |
| Sanctuary 7-Day Gratitude Devotional | Free | d95e2cc2-21d0-4a2b-8a29-c8275f1493e8 | docx |
| Gratitude Jar Ritual | Free | 14dd6999-016a-4f29-94c9-2ce259b78ef2 | PDF |

Call `mcp__Beacons__get_shop_product` with each `product_id` above to get the live `files[].item_url` (cdn.beacons.ai), do not use the ids/URLs from this table verbatim, they may have rotated. Download each file and commit it to `Transform24/the-circle-of-silence` under `worker/assets/`.

### For each of the 3 PAID products, do exactly what was already done for the ebook:
1. In Stripe (live mode), create a Payment Link with inline `price_data` at $15.99 (direct `PostPrices` is blocked on this account, inline price_data on the Payment Link works and creates the Price implicitly). Set `after_completion.redirect.url` to `https://sanctuary-grace.com/<page>.html?paid=1&session_id={CHECKOUT_SESSION_ID}`.
2. In `worker/worker.js`: add a KV namespace binding (e.g. `RESTBOOK_ASSETS`, `COCOON_ASSETS`, `SANCTUARY_ASSETS`), add a `<slug>_EBOOK_GITHUB_URL` constant pointing at the raw GitHub path of the committed file, and add `handle<Name>AssetCheck` / `handle<Name>Seed` functions, copy the Names & Attributes ebook handlers verbatim and rename. Wire both routes into the fetch dispatcher.
3. Deploy the Worker (`PUT /accounts/{id}/workers/scripts/lively-dew-924c`, keep_bindings for existing secrets, add the new kv_namespace binding).
4. Extend `.github/workflows/twwp-manual-ops.yml` action choices with `seed-and-check-<slug>` / `asset-check-<slug>-only`, mirroring the ebook block exactly.
5. Build a new page `the-quiet-authority/<slug>.html`, copying `names-and-attributes-ebook.html` structure exactly: price box with the Stripe link, `WORKER_BASE = 'https://lively-dew-924c.tdwdemp.workers.dev'`, fetch to `/<slug>/download?session_id=...`, same buy/download-state markup and styling (brand tokens in `_system/brand-tokens.md`, do not deviate).
6. Add a Worker route `/<slug>/download` that verifies the Stripe session server-side (mirror the ebook's existing download handler) before returning the file from KV.

**The Wilderness is pulled for reference only: pull the docx, but rewrite the devotional copy in Grace's voice (short declarative sentences building to a contrast, no em-dashes) before it goes on any page. Do not publish the old text as-is.**

### For each of the 4 FREE products:
No Stripe, no payment gate. Build a simple page (same brand styling) with an email-capture form wired to the existing MailerLite/email integration (check `_system/integrations.md` for which one is currently live before wiring, do not assume MailerLite is active without checking `_system/status.md` first), then reveal a direct download link (file served from KV via a Worker route, or simply committed as a public repo asset if it's free, no need for the seed/KV pattern on a free item, a public GitHub raw link or a repo-hosted download button is enough).

### Then, for BOTH sets:
Update `library.html` so each of these 7 titles appears as its own entry linking to its new page, same card style as the existing Names & Attributes / TWWP entries. Do not touch any other existing entry.

### Do NOT migrate: no real file behind them, per Grace's own rule (nothing to clone = dead):
- 18 Amazon affiliate external-link products
- "Sanctuary Grace | The Quiet Authority" ($29.99): its delivery file is a JPG image, not a real product; flag to Grace instead of migrating
- "The Woman Who Pours" Beacons listing (hidden, no file): already superseded by the live sanctuary-grace.com version
- "Your Quiet Authority" ($0, just a URL, hidden)

Once all 7 are live and verified (open each page, confirm buy/download flow end to end), report back so Grace can close the Beacons account.

---
