# THE QUIET AUTHORITY — Workspace

Sanctuary Grace Ministry's assessment app, content operation, and product line for burned-out Christian women. Three subsystems, glued by one entry file (`CLAUDE.md`):

1. **The live app** — a static SPA (8-question assessment → profile reveal → 7-day practice → shop) served by GitHub Pages from repo root. Contract: `SITE-CONTEXT.md`. Cannot be reorganized without a Pages-source-path change and a full relative-path rewrite — held in place on purpose.
2. **`content-ops/`** — the content-agent pipelines (Pinterest, Instagram, YouTube, Substack, repurposing, lead tracking, reporting). Each numbered folder is one stage. Contract: `content-ops/CONTEXT.md`. Note: the *automation* half of these pipelines (the actual `.py` scripts + their live output queues) still lives at `workflows/scripts/` and `workflows/output/` — GitHub Actions hardcodes those exact paths. `content-ops/` holds the prompts, factory reference material, and documentation; `workflows/` holds what's actually executed. This split is real, not an oversight.
3. **`circle-of-silence/`** — a record library, one record per gate (1–6) plus the standalone product catalog. Contract: `circle-of-silence/CONTEXT.md`.

`_system/` holds cross-cutting reference (brand tokens, integration map, git workflow, live/dead status) that all three subsystems draw from.
`_archive/` holds everything superseded, stale, or dead — kept, never deleted, with a note on why.

## Why the split between `content-ops/` and `workflows/`

This repo restructure (2026-08-22) tried to move `workflows/scripts/*.py` and `workflows/output/*` into `content-ops/` for a cleaner pipeline layout, then reverted it: `.github/workflows/*.yml` invokes these scripts by hardcoded path, and the scripts themselves hardcode their own output/log paths internally (e.g. `LOG_FILE = pathlib.Path('workflows/youtube-log.md')`). Moving them requires rewriting both the YAML and every internal path constant, then verifying nothing else depends on the old location — not done in this pass. Treat `workflows/scripts/` and `workflows/output/` as live infrastructure, not documentation to be tidied.
