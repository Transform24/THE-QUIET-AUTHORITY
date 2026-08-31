# PROJECT STATUS — read this first

*This file exists to stop cross-session drift between THE-QUIET-AUTHORITY (TQA) and
THE-CIRCLE-OF-SILENCE (CoS). Any Claude Code, Cowork, or Claude.ai session touching
either repo should read this file before making changes. Every entry below carries
the date it was last confirmed true — if an entry looks stale, verify it against the
live system before trusting it; don't assume this file is current just because it
exists.*

*Maintained by: sessions working across both repos. Last full pass: 2026-08-31.*

---

## Hosting — who serves what (confirmed 2026-08-30)

- **TQA is the single live site.** It owns `CNAME` → `sanctuary-grace.com` and is the
  only one of the two repos with a GitHub Pages deployment. Live at
  `https://sanctuary-grace.com` and `https://transform24.github.io/THE-QUIET-AUTHORITY/`.
- **CoS has no hosting of its own** — no `CNAME`, no `index.html`, no Pages deployment.
  It is the source for the `lively-dew-924c` Cloudflare Worker only (`worker/worker.js`,
  `worker/README.md`, `worker/wrangler.toml`).
- **This is Option B**, adopted 2026-08-30 to fix a real incident: a paywall-bypass fix
  landed in CoS's copy of `gate-one.html` first (PR #1, merged 2026-08-21) but missed
  production entirely, because production is TQA, not CoS — until it was separately
  ported to TQA (PR #51 there, merged 2026-08-23). CoS's duplicate `gate-one.html`
  through `gate-six.html` were then deleted (CoS PR #3, merged 2026-08-30) so there is
  now exactly one copy of each gate page, living in TQA. **Do not recreate gate HTML
  files in CoS.** Gate content changes happen in TQA only.
- TQA's `SITE-CONTEXT.md` already documents `index.html`, `gate-zero.html` …
  `gate-six.html`, `CNAME`, `.nojekyll`, etc. as permanently pinned to repo root
  (GitHub Pages serves from root) — this status entry is consistent with that
  contract, not a change to it.

## Merged vs. pending (confirmed 2026-08-30)

| Repo | PR | What | Status |
|---|---|---|---|
| CoS | #1 | `/verify-purchase` server-side paywall check added to Worker + wired into CoS's (now-deleted) gate copies | Merged 2026-08-21 |
| CoS | #2 | Dead Systeme.io buttons on `gate-zero.html`/`the-secret-place.html` → MailerLite capture forms | Merged 2026-08-23 |
| TQA | #51 | Same two fixes as CoS #1/#2, ported to TQA's actually-live copies | Merged 2026-08-23 |
| CoS | #3 | Philippians citation fix (CoS copy — now deleted, see below), stray `INDEX.HTML` removed, CoS's duplicate `gate-one.html`–`gate-six.html` deleted | Merged 2026-08-30 |

No PRs open in either repo as of 2026-08-30.

## Gate 1 email sequence — known-correct status (confirmed 2026-08-30)

- **Real source of the six-email copy:** `_archive/systeme-io-shutdown-2026-08.md`
  (TQA repo). This is the verbatim original — Day 0/3/5/7/10/14, KJV-anchored,
  written for the Guilty Giver profile, sender `grace@sanctuary-grace.com`.
- **Delivery mechanism:** MailerLite automation **"Gate 1 — The Call — Welcome
  Sequence"** (automation id `193979382021227889`), trigger = subscriber joins
  MailerLite group `193979375492793939` ("Gate 1 Buyer — The Call"). That group ID
  matches `GATE_MAILERLITE_GROUPS.one` in `worker/worker.js` (CoS repo) — buyer
  tagging into this group already happens automatically, in real time, from the
  Worker's `/verify-purchase` route on a confirmed Stripe purchase. No cron job is
  involved or needed.
- **Content status:** all six emails are written into the automation verbatim from
  the archive, with the archive's own Day 0/3/5/7/10/14 schedule. `dry_run_automation`
  confirms `emails_designed: 6, emails_undesigned: 0`.
- **Live status: DISABLED.** The automation has not been turned on. Buyers joining
  the group today receive nothing. Turning it on is a decision for Grace, not yet made.
- **Content gap — resolved 2026-08-31.** Tool Four ("The Response") now carries
  the full twelve declarations email 5 promises, and Tool One is renamed "Brain
  Dump" to match email 4's framing (see "Resolved 2026-08-31" below). Email 5's
  builder HTML and plain text were also updated directly in MailerLite to add
  the "Silence of Verdicts" (John 8) devotional depth Grace flagged — same
  automation, same email, no new email added. **Automation is still DISABLED**
  — this pass did not turn it on; that decision is still Grace's (see item 1
  below).
- Docs that are now **stale** on this topic and should not be trusted over this
  entry: `_system/status.md`'s "Gate 1's email sequence has no live delivery
  mechanism" line, and `circle-of-silence/gate-1-hakria.md`'s "EMAIL DELIVERY
  BLOCKED" header and "content ready, not yet loaded anywhere live" line. Both
  predate this pass and have not been edited to match.

## `gate-buyer-sync.yml` and the old Systeme.io cron workflows (confirmed 2026-08-29)

- `gate-buyer-sync.yml`, `load-gate1-emails.yml`, `setup-gate-pipeline.yml` do not
  exist in either repo. They were intentionally deleted 2026-08-22 (see TQA's
  `_archive/systeme-io-shutdown-2026-08.md`) because they only called the
  now-dead Systeme.io API.
- **This is not a gap to fill.** Buyer tagging for all six gates already happens
  correctly and in real time via the Worker's `/verify-purchase` route (see above).
  A cron-based replacement would duplicate that, not fix anything.

## Resolved 2026-08-31

- **Philippians 4:6 → 1:6 citation, fixed directly on TQA's live `gate-one.html`
  (commit `104ad4b`).** The paraphrased single declaration that carried the bad
  citation was removed as part of the Tool Four rebuild below, not patched in
  place — there is no more "Philippians 4:6" (or 1:6) reference on the page.
- **Tool Four ("The Response") rebuilt with the twelve declarations** email 5
  promises, replacing the single leftover declaration. Same `.declaration`
  markup, repeated twelve times, KJV-verified against `Romans 8:1`,
  `Psalm 103:12`, `John 8:11`, `Psalm 86:5`, `Isaiah 43:25`, `Micah 7:19`,
  `1 John 1:9`, `Psalm 32:1`, `Colossians 2:14`, `Hebrews 10:17`, `Romans 8:34`,
  `John 8:36`.
- **Tool One renamed "The Interruption" → "Brain Dump"** (label only — id
  `gate1_interruption` and all functionality untouched) to match what emails 4
  and the pre-purchase tool list already call it.
- **Email 5 ("12 declarations for the woman who is done proving") given the
  depth Grace flagged.** Added the "Silence of Verdicts" devotional (the John 8
  woman-caught-in-adultery narrative, Salah/pardon, Romans 8:1) ahead of the
  existing closing paragraphs, styled to match the automation's existing dark/
  gold/serif template (verified against the email's rendered screenshot before
  and after). Updated via MailerLite directly (`update_automation_email_content`
  / `update_automation_email` on automation `193979382021227889`, step index 4,
  email id `194025819674249165`) — not a repo file, so no gate-*.html change
  carries this content. Automation left disabled.

## Known bugs still open on the live site (confirmed 2026-08-30)

- `circle-of-silence/CONTEXT.md`'s "Access" section describes gate access as
  `?purchased=gateN` after checkout. That's the old client-only bypass this
  whole incident was about — the live mechanism is now server-verified via
  `/verify-purchase?session_id=...`. Doc not yet updated to match.

## Awaiting Grace's decision

1. **Enable the Gate 1 MailerLite automation?** Content is correct and complete
   per the archive, email 5 now has the added depth, and both tools email 4/5
   promise now exist on `gate-one.html` — it's just switched off. Still Grace's
   call; not turned on by the 2026-08-31 pass either. (confirmed 2026-08-31)
2. ~~Gate 1 email content gap — build or cut?~~ **Resolved 2026-08-31** — built,
   not cut. See "Resolved 2026-08-31" above.
3. ~~Philippians 4:6 → 1:6 on TQA's live `gate-one.html`~~ **Resolved 2026-08-31.**
   See "Resolved 2026-08-31" above.
4. **Carried over from TQA's own docs, unrelated to this pass:** Gates 2–6 have no
   Stripe products yet and are marked "Not yet built" in
   `circle-of-silence/CONTEXT.md`. Not touched in this pass.
