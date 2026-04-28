# The Quiet Authority — AI Agent Workflows

This folder contains the full AI agent team for Sanctuary Grace Ministry.
Each agent is a Claude trigger prompt that can be run manually or on a schedule.

## Agent Team Overview

```
CONTENT IN (YouTube / Drive / idea)
        ↓
[01] REPURPOSE AGENT      — turns any content into Pinterest, social, email copy
        ↓
[02] PIN CREATION AGENT   — formats and posts pins to Pinterest
        ↓
[03] STOREFRONT SYNC      — keeps Beacons + Stripe aligned, updates site links
        ↓
[04] LEAD TRACKER         — logs Formspree submissions to Drive, tags by profile
        ↓
[05] WEEKLY REPORT        — Monday summary of pins, leads, and next actions
```

## Folder Structure

```
workflows/
  agents/
    01-repurpose-agent.md       Core repurposing prompt + instructions
    02-pin-creation-agent.md    Pinterest pin creation workflow
    03-storefront-sync-agent.md Beacons + Stripe sync workflow
    04-lead-tracker-agent.md    Formspree lead capture + Drive logging
    05-weekly-report-agent.md   Monday performance summary
  templates/
    pin-template.md             Pinterest pin copy format
    email-template.md           Email/newsletter format
    repurpose-brief.md          Content input brief (fill this in per piece)
  triggers/
    trigger-registry.md         All remote trigger IDs + schedules
```

## How to Use

1. Fill in `workflows/templates/repurpose-brief.md` with your new content
2. Fire the **Repurpose Agent** trigger — it reads the brief and outputs copy
3. Review copy in `workflows/output/` (auto-created by agents)
4. Fire the **Pin Creation Agent** trigger — it posts approved pins
5. Everything else runs on schedule automatically

## Platform Connections Needed

| Platform | Connection Type | Status |
|----------|----------------|--------|
| Pinterest | Pinterest API v5 | Setup needed |
| Google Drive | Service account or OAuth | Setup needed |
| Beacons | Manual URL sync | Active |
| Stripe | Webhook → agent trigger | Setup needed |
| Formspree | Webhook → agent trigger | Setup needed |
| YouTube | YouTube Data API v3 | Setup needed |
| GitHub Pages | Git push (already works) | Active |
