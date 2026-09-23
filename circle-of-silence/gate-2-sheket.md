# Gate 2 — Sheket — Stillness

## STATUS: BUILT, LIVE ON STRIPE

Corrected 2026-09-23 — this file previously said "NOT YET BUILT." That was wrong. Gate 2 is live now, same pattern as Gate 1.

## Stripe
- Payment link: https://buy.stripe.com/6oU3cv8Bac0pcna0sacQU0x
- Price: $9

## Access
- Page: `gate-two.html` at repo root (see gate-*.html files)
- Unlock: Stripe redirects to the gate page with `?session_id={CHECKOUT_SESSION_ID}`; the page calls the Cloudflare Worker (`lively-dew-924c`) `/verify-purchase` route, which checks the session against Stripe and against this gate's payment link above.
- Old `?purchased=gateN` param is NOT used anymore and is not trusted by the page — ignore any doc that still says otherwise.
- On verified purchase, buyer's email is added to MailerLite group `194025316835919214`.

## Verified
- Buy link above matches `GATE_PAYMENT_LINKS` in `THE-CIRCLE-OF-SILENCE/worker/worker.js` and the live `href` in this gate's html page.
- Locked by default, stays locked on fake/bad session id, unlocks correctly — tested in a real browser, 2026-09-22/23.

## NEXT ACTION
Same as Gate 1: email delivery destination (MailerLite migration) still pending.
