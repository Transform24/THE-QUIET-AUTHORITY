# 07 — Lead Tracker
*Last updated: 2026-08-22*

- **Reads:** Formspree webhook payload (form ID `xzdkgbbq`)
- **Does:** logs each submission, tags the lead by profile
- **Writes:** leads log, email-engine tag (MailerLite — see `_system/integrations.md`; older specs say Beacons, superseded)
- **Trigger:** Formspree webhook, on every submission
- **Human check:** none — this stage just logs and tags, no content goes out

Full prompt: `agent.md`.
