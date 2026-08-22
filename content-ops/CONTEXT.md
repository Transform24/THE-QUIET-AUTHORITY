# Content-Ops — Agent Pipeline Overview
*Last updated: 2026-08-22 — replaces the old `workflows/README.md`, which undercounted the team at 6 agents. There are 10.*

Ten agents. Each numbered folder below is one stage: its `CONTEXT.md` (or, where not yet written, its `agent.md` prompt) is the contract — what it reads, what it does, what it writes, who checks it. `_factory/` holds what's stable across every run: brand voice, templates, the skill library, testimony workflow.

**Read this first if you're about to move something:** the executable half of these pipelines — the actual `.py` scripts and the live `pending`/`approved` output queues — is NOT in this folder. It's at `workflows/scripts/` and `workflows/output/`, because `.github/workflows/*.yml` hardcodes those exact paths, and each script also hardcodes its own output/log path internally. This folder holds the prompts and reference material; `workflows/` holds what GitHub Actions actually runs. See root `CONTEXT.md` for why this split exists and stays.

## Pipeline

```
CONTENT IN (YouTube / Drive / idea)
        ↓
[01] REPURPOSE           — turns any content into Pinterest, social, email copy
        ↓
[02] PINTEREST            — formats and posts pins (agent + pin-creation, merged)
[03] INSTAGRAM (PAUSED)   — repurposes Pinterest captions for IG
[04] YOUTUBE              — weekly scripts + Remotion video rendering
[05] SUBSTACK             — daily/weekly devotions
        ↓
[06] STOREFRONT SYNC      — keeps site + Stripe links aligned
[07] LEAD TRACKER         — logs Formspree submissions, tags by profile
[08] WEEKLY REPORT        — Monday summary of pins, leads, next actions
[09] DAILY CHECK-IN       — daily profile-matched inspiration email, 7am
```

## Stages

| # | Stage | Prompt | Script (in `workflows/scripts/`) | Trigger |
|---|---|---|---|---|
| 01 | Repurpose | `01_repurpose/agent.md` | — | Manual |
| 02 | Pinterest | `02_pinterest/agent.md` + `pin-creation-agent.md` | `pinterest_agent.py` | Daily per schedule |
| 03 | Instagram | `03_instagram/agent.md` | `instagram_agent.py`, `instagram-deploy.py` | Daily per schedule (paused) |
| 04 | YouTube | `04_youtube/agent.md` | `youtube_agent.py`, `youtube-deploy.py` | Weekly |
| 05 | Substack | `05_substack/agent.md` | `substack_agent.py`, `substack-deploy.py` | Daily 6am |
| 06 | Storefront Sync | `06_storefront-sync/agent.md` | — | Mon 6am |
| 07 | Lead Tracker | `07_lead-tracker/agent.md` | — | Formspree webhook |
| 08 | Weekly Report | `08_weekly-report/agent.md` | — | Mon 7am |
| 09 | Daily Check-In | `09_daily-checkin/agent.md` | — | Daily 7am |

Approval gate for all content: drafts land in `workflows/output/[platform]-pending/`, `approval-gate.html` (repo root) shows them to Grace, approved items move to `-approved/`, deploy workflows post from there.

## Factory (`_factory/`)

Brand voice, KJV devotion reference, gate email sequence copy, brand assets, email welcome sequence, testimony workflow SOP, templates (pin/repurpose-brief/product-registry/daily-inspiration), the full marketing skill library (`skills/`, 184 files), and `skills-lock.json`.
