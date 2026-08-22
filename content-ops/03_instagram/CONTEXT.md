# 03 — Instagram
*Last updated: 2026-08-22*

## STATUS: PAUSED — Meta account restriction. Not dead.

All files stay in place: `agent.md`, `workflows/scripts/instagram_agent.py`, `workflows/scripts/instagram-deploy.py`. This stage reconnects to the Pinterest content flow once the restriction lifts — Instagram repurposes Pinterest captions into shorter IG copy, so resuming it is a re-enable, not a rebuild. Do not delete or archive anything here.

- **Reads (when active):** content calendar, Drive `/content-queue/`, Pinterest captions from `02_pinterest/`
- **Does:** repurposes into IG captions (max 150 words, sacred voice), Reel scripts, carousel text
- **Writes:** `workflows/output/ig-drafts/`, `workflows/output/ig-log.md`
- **Trigger:** daily per schedule (currently not firing — paused)
- **Human check:** `approval-gate.html` before any post

`instagram-deploy.py` also expects `workflows/output/instagram-approved/` and logs to `workflows/instagram-log.md` — neither exists yet in this repo; that half of the pipeline was never fully built out even before the pause.
