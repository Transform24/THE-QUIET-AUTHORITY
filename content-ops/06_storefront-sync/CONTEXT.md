# 06 — Storefront Sync
*Last updated: 2026-08-22*

- **Reads:** `index.html` (repo root), `_factory/templates/product-registry.md`
- **Does:** audits that live site links match active Stripe products, patches drift
- **Writes:** audit report + patches
- **Trigger:** Monday 6am
- **Human check:** patches to `index.html` go through the normal PR/UX-checklist process — see `_system/git-workflow.md` and `SITE-CONTEXT.md`

Full prompt: `agent.md`.
