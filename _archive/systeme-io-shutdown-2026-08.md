# Systeme.io — Historical Record (account shut down, 2026-08)

*Archived 2026-08-22. Kept per ICM convention — never silently delete, always leave a record of what existed. Do not treat anything below as current. Current status: `_system/status.md`.*

Systeme.io was set up as the CRM/automation layer for the Circle of Silence gate-buyer pipeline: Stripe checkout → webhook → Systeme.io contact tagging → automated email sequence delivery. The account has since been fully shut down and no longer exists.

## Gate Tags (Systeme.io tag IDs, now meaningless — account gone)
- gate-1-buyer: 2068973
- gate-2-buyer: 2068974
- gate-3-buyer: 2068975
- gate-4-buyer: 2068976
- gate-5-buyer: 2068977
- gate-6-buyer: 2068978
- secret-place-buyer: 2057950 (existing, pre-dates the gate pipeline)

## Stripe → Systeme.io wiring (as it was configured)
- Webhook ID: `we_1TmPsDDvGX7GhwdzZ15UzERO`
- Webhook URL: `https://api.systeme.io/api/stripe-webhook`
- Webhook events: `checkout.session.completed`
- Gate 1 Product ID: `prod_Ul9eX4XJZNXIem`
- Gate 2–6 Product IDs: were never created (gates 2-6 never built — see `circle-of-silence/`)

## Earlier status notes (superseded)
- "Systeme.io account exists (locked, pending unlock)" — this was the status *before* the account was shut down entirely; superseded.
- "Systeme.io via API: no campaign endpoint exists" / "via MCP: requires OAuth, cannot connect" — earlier integration blockers, now moot since the account doesn't exist.

## ✅ Dead workflows deleted — 2026-08-22

Grace confirmed the Systeme.io account is permanently gone (not paused, not locked — gone). These three GitHub Actions workflows were **deleted** in this pass, since they existed solely to call an API that no longer has anywhere to go:

- `.github/workflows/gate-buyer-sync.yml` — cron, every 15 minutes, read Stripe checkout sessions and tagged contacts in Systeme.io using the tag IDs above and secret `SYSTEME_MAKE_KEY`.
- `.github/workflows/load-gate1-emails.yml` — manual dispatch, created a Systeme.io email campaign and loaded the 6 Gate 1 emails via `SYSTEME_API_KEY`.
- `.github/workflows/setup-gate-pipeline.yml` — manual dispatch, created Systeme.io tags and registered the Stripe webhook to Systeme.io via `SYSTEME_API_KEY`.

Their content is fully recoverable from git history (this repo's commit history, and this PR's diff) if anyone ever needs to see exactly what they did. Nothing else in the repo referenced these three files by path — safe to remove outright rather than move to `_archive/`, since a `.yml` sitting in `_archive/` reads as "maybe still runs" in a way a plain deleted file doesn't.

Still open: where Gate 1 email delivery goes now that both the sender (Systeme.io) and the tagging automation are gone — MailerLite is the live email engine per `_system/integrations.md`, migrating this sequence there is the likely next step but hasn't been done. See `circle-of-silence/gate-1-hakria.md`.

## Gate 1 email sequence — full copy, preserved here since the workflow that held it is gone

6 emails written in Grace's voice, KJV-anchored, for the Guilty Giver / Gate 1 (HaKria) sequence. Sender: Grace Turner `grace@sanctuary-grace.com`. This was the exact body HTML posted to the (now-dead) Systeme.io campaign API — kept verbatim so the copy isn't lost with the workflow file.

**Email 1 — Day 0 — "You are not here by accident"**
> You did not choose this season. Something stopped you. A breaking point. A body that finally said no. A door that closed before you could catch it. And every woman who has ever been stopped believes the same thing at first — that she did something wrong.
>
> *He healeth the broken in heart, and bindeth up their wounds. — Psalm 147:3, KJV*
>
> You did not break because you failed. You were stopped because He had something to say that you could not hear while you were still moving. The Calling does not always come in the quiet. Sometimes it comes in the interruption. You are in Gate 1: HaKria. The Calling. The Summoning. Over the next days, I will walk with you through what this gate holds. Stay close.
>
> Come as you are. Grace

**Email 2 — Day 3 — "The woman who could not stop"**
> She was doing everything right. She opened her home. She served. She prepared. She made sure everything was in order while everyone else sat still. And Jesus looked at her and said her name twice. Martha. Martha.
>
> *Thou art careful and troubled about many things: but one thing is needful. — Luke 10:41-42, KJV*
>
> He was not scolding her. He was trying to reach her through the noise of her own doing. You are allowed to sit at His feet now. That is not laziness. That is obedience.
>
> Come as you are. Grace

**Email 3 — Day 5 — "What you have been carrying was never yours to carry alone"**
> *Cast thy burden upon the LORD, and he shall sustain thee. — Psalm 55:22, KJV*
>
> He did not say reduce your burden. He did not say manage it better or carry it more efficiently. He said cast it. The Guilty Giver does not know how to cast. She knows how to redistribute. She moves the weight from one shoulder to the other and calls it rest. This gate is where you learn the difference. What have you been holding that He has been asking for?
>
> *Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28, KJV*
>
> Come as you are. Grace

**Email 4 — Day 7 — "Your brain dump"**
> Today is not a teaching day. Today is a naming day.
>
> *And the LORD answered me, and said, Write the vision, and make it plain. — Habakkuk 2:2, KJV*
>
> Inside Gate 1, you have your Brain Dump tool. A quiet space to name what you noticed. What stopped you. What you have been carrying that no one else sees. You do not need the right words. You just need to name it. He already knows. He is just waiting for you to put it into words so He can begin to heal it.
>
> Come as you are. Grace

**Email 5 — Day 10 — "12 declarations for the woman who is done proving"**
> There is a practice waiting for you inside Gate 1. Twelve declarations. Spoken aloud — because the voice that has been silenced by serving everyone else needs to hear herself speak truth again.
>
> *Death and life are in the power of the tongue. — Proverbs 18:21, KJV*
>
> These are not affirmations. They are the Word of God spoken over the specific wound the Guilty Giver carries. Speak them this week. One each morning. Out loud. Not because you feel them yet. Because He said them first.
>
> Come as you are. Grace

**Email 6 — Day 14 — "The next room is ready when you are"**
> You have been in Gate 1 for two weeks now.
>
> *The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee. — Jeremiah 31:3, KJV*
>
> He drew you. Not pushed. Drew. Gate 2 is Sheket — Stillness. Once you stop running, something begins. The next room is where you learn to sit in what you find — and discover that the silence is not empty. It is where He speaks.
>
> *Be still, and know that I am God. — Psalm 46:10, KJV*
>
> When you are ready, Gate 2 is waiting.
>
> Come as you are. Grace
