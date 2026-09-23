# Sanctuary Grace — The Real Funnel, End to End

This replaces the mental model of separate, disconnected pieces. It traces
what actually happens today, in code, from a stranger seeing a pin on
Pinterest to a paying customer inside The Circle of Silence, and out to the
ongoing content (Substack, YouTube).

For every step below: VERIFIED WORKING means the code does what it should.
VERIFIED BUT BROKEN means the connection exists but fails, with the exact
reason. NOT CONNECTED means there is no link in the code at all — a real
gap, not a guess. File paths and line numbers are given so anything here can
be checked again later.

Repo: the-quiet-authority (this repo). Worker repo: THE-CIRCLE-OF-SILENCE,
file worker/worker.js.

---

## Step 1 — Pinterest (the entry gate)

VERIFIED WORKING, but the actual posting is VERIFIED BUT BROKEN.

A GitHub Action runs daily at 14:00 UTC and calls the Pinterest agent
script. `.github/workflows/pinterest-agent.yml` line 6: `cron: '0 14 * * *'`.

The script is `workflows/scripts/pinterest_agent.py`. It has a 30-day
rotating schedule of 30 pins (the `SCHEDULE` dict). Every single pin's
caption ends with the same link: `https://sanctuary-grace.com/`, and the
actual Pinterest API payload sent to Pinterest also sets
`"link": "https://sanctuary-grace.com/"` (pinterest_agent.py, in the POST
payload built right before the `urllib.request.Request` to
`https://api.pinterest.com/v5/pins`). So every pin, whichever day it is, is
meant to send a Pinterest viewer to the ministry's homepage.

The problem: it has never actually posted. `workflows/output/pin-log.md`
is the agent's own running log of every run, and it shows zero rows with
status `POSTED`. Every logged run says `DRAFT` or an error:
- `DRAFT — PINTEREST_ACCESS_TOKEN not set` (the secret is missing in some
  runs)
- `DRAFT — board not found: The Quiet Authority for Women` (the board name
  in the schedule doesn't match a board that actually exists on the
  Pinterest account — pinterest_agent.py's `get_board_id()` function looks
  up boards by exact name match and fails silently, falling back to DRAFT)
- `DRAFT — Canva image required for this day.` (many schedule days have
  `image_file: None`, meaning no image was ever produced for that day, so
  the agent can't post at all — see the `image_file` field in `SCHEDULE`)

Every draft is still saved as a markdown file in
`workflows/output/pinterest-pending/` for Grace to review by hand in
`approval-gate.html`, but there is no evidence anywhere in this repo that a
pin from this pipeline has ever gone live on Pinterest. This is a real,
sitting-in-front-of-us gap: the top of the funnel currently has nothing
flowing into it from Pinterest at all.

## Step 2 — The landing page (sanctuary-grace.com / index.html)

VERIFIED WORKING.

`index.html` is the page every pin points to. What a visitor sees first is
the cover screen with a "Begin the Assessment" button
(`onclick="startAssessment()"`, index.html:890). This starts an 8-question
spiritual profile quiz ("The Quiet Authority").

After the last question, the visitor hits an email-capture screen (the
"Your Silence Profile Is Ready" screen, around index.html:928) and clicks
"Reveal My Profile →" (`onclick="submitAndReveal()"`, index.html:932).

`submitAndReveal()` (index.html:2049) computes which of the four profiles
(Striving Achiever / Depleted Survivor / Guilty Giver / Lost Wanderer) the
visitor matches, and shows the Profile Reveal screen. That screen has two
real, clickable next steps, both actual `<a href>` tags, not decoration:
- index.html:960 — `<a href="https://sanctuary-grace.com/gate-zero.html">Enter The Sanctuary →</a>`
- index.html:963 — `<a href="https://sanctuary-grace.com/the-secret-place.html">Enter The Secret Place →</a>`

So the chain from a Pinterest click to the door of the paid funnel is real
and unbroken: Pinterest → sanctuary-grace.com (quiz) → profile reveal →
gate-zero.html.

## Step 3 — Lead capture (MailerLite)

VERIFIED WORKING for the quiz itself. VERIFIED BUT BROKEN for the two
"foyer" landing pages that were meant to feed it.

When `submitAndReveal()` runs, it calls
`addToMailerLite(email, name, profileKey)` (index.html:2072), where
`profileKey` is `A`, `B`, `C`, or `D` — one per spiritual profile. This
posts to a Cloudflare Worker at
`https://lively-dew-924c.tdwdemp.workers.dev/mailerlite-subscribe`
(index.html:1760, function defined at index.html:1761-1768).

In the Worker (THE-CIRCLE-OF-SILENCE/worker/worker.js), the
`MAILERLITE_GROUPS` map (worker.js:305-318) has real MailerLite group IDs
configured for keys `A`, `B`, `C`, `D` (worker.js:306-309), plus `NB`
(worker.js:310, used when someone clicks "I accept Jesus" —
index.html:2534). So a quiz-taker's email really does land in a MailerLite
group matching their profile. What happens to them after that: no
automation on these four profile groups is referenced anywhere in this
repo or the worker. They sit in the group. There is no evidence of a
nurture sequence built on top of it (separate from the gate buyer groups
covered in Step 6).

The break: two other pages — `the-quiet-authority-foyer.html` and
`the-secret-place-foyer.html` — also call the same `/mailerlite-subscribe`
endpoint, using the keys `tqa_foyer` (the-quiet-authority-foyer.html:238)
and `secretplace_foyer` (the-secret-place-foyer.html:273). But in the
Worker's own `MAILERLITE_GROUPS` map, both keys are explicitly `null`
(worker.js:314-317), with the Worker's own comment above them: `// TODO:
real MailerLite group ID needed from Grace's dashboard — signups with this
key currently 400`. Any visitor who submits their email on either foyer
page gets a `400 Group not configured` response (worker.js:334-336) — the
signup is silently lost. This matches what a prior MailerLite-fixing pass
already found and left as a TODO in the code; it is still unresolved.

## Step 4 — Circle of Silence gate routing

VERIFIED WORKING.

`gate-zero.html` is a free page (a "brain dump" / labor checklist tool). At
the bottom, it has a real Stripe-linked button:
`gate-zero.html:299 — <a href="gate-one.html" class="gate-btn">Enter Gate One, $9</a>`

`gate-one.html` in turn has the actual Stripe Payment Link button:
`gate-one.html:226 — <a href="https://buy.stripe.com/eVqfZh8Ba8Od0Es8YGcQU0w" class="gate-btn">Enter Gate One — $9</a>`

and, further down the page, a link forward into the next gate:
`gate-one.html:384 — <a href="https://sanctuary-grace.com/gate-two.html" class="gate-btn">Enter Gate Two — $9</a>`

So the reader is never dropped at a dead end between the profile reveal and
the first purchase: reveal screen → gate-zero.html → gate-one.html (Stripe)
→ gate-two.html, and so on. This is the one part of the funnel that was
already fully wired and stayed wired.

## Step 5 — Purchase → Worker verification → unlock

VERIFIED WORKING (confirmed in prior work; summarized here, not re-tested).

`gate-one.html` sends the buyer's Stripe Checkout `session_id` to the
Worker's `/verify-purchase` route (gate-one.html:475-499, calling
`WORKER + '/verify-purchase?session_id=...'`). The Worker
(`handleVerifyPurchase`, worker.js:166 onward) calls the real Stripe API to
confirm the session is `paid`/`complete`, matches the session's payment
link URL against `GATE_PAYMENT_LINKS` (worker.js:19-26) to know which gate
was bought, and only then reports the gate as unlocked. This is the solid
part of the system.

## Step 6 — Post-purchase: buyer group → welcome sequence

VERIFIED WORKING for the MailerLite group join. VERIFIED BUT BROKEN for the
welcome sequence that's supposed to follow it.

Once a purchase verifies, the Worker adds the buyer's email to that gate's
own MailerLite "buyer" group (`GATE_MAILERLITE_GROUPS`, worker.js:39-46,
one real group ID per gate; joined via `addToMailerLiteGroup`,
worker.js:81-92, called from `handleVerifyPurchase` around worker.js:220).
The Worker's own comment above that map says plainly: "Joining one of
these groups is what triggers that gate's already-built 11-step welcome
sequence automation (currently disabled, waiting)" (worker.js:37-38).

The fuller and more specific history is in
`circle-of-silence/gate-1-hakria.md`: Gate 1's welcome sequence (6 emails,
KJV-based, written for the Guilty Giver profile) was originally wired to
Systeme.io (tag `gate-1-buyer`), not MailerLite. That Systeme.io account
was fully shut down on 2026-08-22 (gate-1-hakria.md line 13). The 6-email
copy still exists, preserved in
`_archive/systeme-io-shutdown-2026-08.md`, but has never been loaded into
MailerLite, which is now the ministry's only live email engine
(gate-1-hakria.md line 15). The automations tied to the old pipeline —
`gate-buyer-sync.yml`, `load-gate1-emails.yml`, `setup-gate-pipeline.yml` —
have all been deleted (gate-1-hakria.md line 17).

Bottom line: a buyer's purchase is correctly recorded and their email
correctly lands in the right MailerLite buyer group. But nothing currently
sends them anything after that. The unlock works; the "and then we walk
with you" part does not.

## Step 7 — Ongoing touchpoints: Substack and YouTube

Partially VERIFIED WORKING, partially NOT CONNECTED.

Discovery: `index.html`'s footer has real links to both —
`index.html:1438/1481 → https://youtube.com/@TheQuietAuthority-f1z`
`index.html:1439/1482 → https://substack.com/@sapop2sotwm`
So anyone who scrolls to the bottom of the homepage can find both. That is
the only place in the whole funnel these are linked from — none of the
gate pages (gate-zero through gate-six), none of the foyer pages, checked
directly (no `youtube.com` or `substack.com` match in any of them).

YouTube: `.github/workflows/youtube-agent.yml` runs weekly, Monday 9am UTC
(`cron: '0 9 * * 1'`, line 5) — this cron is active.

Substack: `.github/workflows/substack-agent.yml`'s daily cron is disabled
as of this session's earlier commit `3022831` ("Disable Substack daily
cron — failing every day, secret missing") — the workflow file itself now
has the schedule commented out with the note that `SUBSTACK_COOKIE_ID` is
not set (substack-agent.yml lines 4-8).

Because the post-purchase welcome sequence (Step 6) isn't sending anything,
there is also no email-based path introducing buyers to Substack or
YouTube. Right now these two channels are reachable only by a visitor who
scrolls to the site footer — they are effectively islands for anyone who
enters through Pinterest, the quiz, or a gate purchase and never scrolls
that far.

---

## If only one thing gets fixed next

Fix Pinterest posting first (Step 1).

Every other step in this document — the quiz, the reveal screen, the
MailerLite group joins, the gate chain, Stripe verification — is either
fully working or has a specific fix waiting. But none of it matters if
nothing is actually arriving at the front door. The pin-log shows zero
successful posts, ever: every run has ended in DRAFT or an API error
(missing token, a board name that doesn't match the real Pinterest board
names, or a missing Canva image). That is the single break point stopping
the most people from ever reaching Step 2, because right now, effectively
no one from Pinterest is reaching Step 2 at all.

Second priority, once pins are actually landing people on the homepage: the
Step 6 welcome sequence. People who pay $9 for a gate are being correctly
tracked and grouped, but they currently receive nothing after their
purchase confirms — no words of welcome, no next step, nothing pointing
them toward Substack, YouTube, or the next gate by email. That's the
highest-value fix after Pinterest, because those are already-paying
customers with nothing following up on the relationship.

Third: the two foyer pages' broken signup (`tqa_foyer` /
`secretplace_foyer` both return 400). Lower urgency only because those
pages are not yet linked from the main funnel traced above, so today they
mostly lose the traffic that lands on them directly, not traffic coming
through Pinterest.
