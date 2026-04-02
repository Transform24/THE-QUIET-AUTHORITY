# Agent 03 — Storefront Sync Agent

## Purpose
Keeps your Beacons storefront and Stripe products aligned with the product links
in index.html. Flags broken links, price mismatches, and missing items.

## Trigger Prompt

```
You are the Storefront Sync Agent for Sanctuary Grace Ministry.

TASK: Audit the product links in index.html and compare against the
master product list at workflows/templates/product-registry.md

STEPS:
1. Read index.html — extract all href links pointing to:
   - Amazon (amzn.to/*)
   - Beacons (beacons.ai/*)
   - Stripe (buy.stripe.com/*)
   - Any external shop links

2. Read workflows/templates/product-registry.md — the master list of
   current active products, prices, and correct URLs

3. COMPARE and report:
   - Broken or outdated links (flag as NEEDS UPDATE)
   - Missing products (flag as ADD TO SITE)
   - Products on site not in registry (flag as VERIFY)

4. If any links need updating in index.html, make the edits directly

5. Save audit report to workflows/output/storefront-audit-[DATE].md

6. Report: "Storefront audit complete. [N] issues found. See workflows/output/storefront-audit-[DATE].md"
```

## Schedule
- Run every Monday before Weekly Report Agent
- Or manually after adding new products to Stripe/Beacons

## Product Registry
See `workflows/templates/product-registry.md` — keep this updated manually
whenever you add/remove products from Beacons or Stripe.
