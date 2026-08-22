# Email Flow — Beacons (replaces MailerLite)

Beacons is the email engine. Not MailerLite. Not Zapier.

## How it works
1. User completes assessment → Formspree fires → Agent 04 tags subscriber in Beacons
2. Beacons tag: profile-A, profile-B, profile-C, profile-D, or new-believer
3. Beacons automation fires the correct welcome sequence for that tag
4. Agent 06 sends daily inspiration email every morning at 7am

## Email Cadence — 5 emails per sequence

| Day | Purpose |
|---|---|
| Day 0 | Welcome — immediate on join |
| Day 1 | Reframe — deepen the opening |
| Day 3 | Interrupt — mid-week presence |
| Day 7 | Invitation — one week in |
| Day 14 | Next Step — two weeks in, CTA |

---

## Profile A — The Striving Achiever
**Tag:** `profile-A` · **Tone:** Permission to stop. You are enough without the achievement.

| # | Day | Subject | Preview | Body |
|---|---|---|---|---|
| 1 | 0 | You can stop striving now | You're enough before you do anything. | Welcome. Take a breath. You don't have to earn God's presence — He already chose you. |
| 2 | 1 | Your worth isn't measured by output | Heaven isn't impressed by your pace. | Your value isn't tied to performance. God is after your heart, not your hustle. |
| 3 | 3 | Let stillness interrupt the pressure | Rest is not a setback — it's alignment. | Pause today. Let God remind you who you are without the doing. |
| 4 | 7 | Lay down the checklist | Rest is a spiritual discipline too. | Release the pressure to keep producing. Let Him speak into the places you've been overworking. |
| 5 | 14 | You are already enough | Start from rest, not pressure. | Your journey begins with permission — permission to stop, breathe, and be held. |

---

## Profile B — The Depleted Survivor
**Tag:** `profile-B` · **Tone:** You were meant to be the vessel, not the source.

| # | Day | Subject | Preview | Body |
|---|---|---|---|---|
| 1 | 0 | You don't have to carry this alone | God sees the exhaustion you've been hiding. | You're here — and that matters. God sees the weight you've been holding. |
| 2 | 1 | You were never meant to be the source | You're the vessel. He's the well. | You don't have to hold everything together. Let God refill what life has drained. |
| 3 | 3 | Your strength isn't failing | You're tired, not broken. | Your limits aren't a flaw. They're a signal to rest in Him. |
| 4 | 7 | You can rest without guilt | God isn't disappointed in your limits. | You don't have to push through this moment. You can rest inside it. |
| 5 | 14 | This is where you receive again | No more surviving — start receiving. | Let this be the place where you stop surviving and start being filled. |

---

## Profile C — The Guilty Giver
**Tag:** `profile-C` · **Tone:** Boundaries aren't selfish — they're sacred.

| # | Day | Subject | Preview | Body |
|---|---|---|---|---|
| 1 | 0 | God saw every unseen sacrifice | You've poured out so much. | Your generosity is beautiful — but God cares about your heart, not your depletion. |
| 2 | 1 | Generosity needs boundaries | Love without limits becomes loss. | Giving without rest drains the soul. Boundaries protect what God entrusted to you. |
| 3 | 3 | Saying "no" can be holy | Rest is sacred too. | It's holy to pause. Holy to protect your energy. Holy to honor your limits. |
| 4 | 7 | Boundaries don't block love | They preserve it. | Boundaries create space for God to be God — not your exhaustion. |
| 5 | 14 | Step into sacred limits | Give from overflow, not obligation. | Let this be your season of protected peace and intentional giving. |

---

## Profile D — The Lost Wanderer
**Tag:** `profile-D` · **Tone:** Silence isn't where you lose yourself — it's where you remember.

| # | Day | Subject | Preview | Body |
|---|---|---|---|---|
| 1 | 0 | You're not as lost as you feel | God has been with you the whole time. | You haven't drifted beyond His reach. He's been walking with you. |
| 2 | 1 | Silence isn't abandonment | It's an invitation. | Confusion isn't punishment. Silence is where God speaks differently. |
| 3 | 3 | Stillness is your compass | Clarity grows in quiet places. | Your soul finds direction in stillness — not noise. |
| 4 | 7 | You're still His | You're still held. Still wanted. | You haven't wandered too far. God hasn't let go of you. |
| 5 | 14 | Listen inward again | God meets you in the quiet. | Let this be the moment you stop searching outward and start listening inward. |

---

## New Believer
**Tag:** `new-believer` · **Tone:** Heaven rejoiced. Now let Him lead you into stillness.

| # | Day | Subject | Preview | Body |
|---|---|---|---|---|
| 1 | 0 | Heaven celebrated you | Your "yes" mattered more than you know. | Heaven rejoiced when you said yes. You're not walking alone. |
| 2 | 1 | You don't have to know everything | God grows you gently. | You're learning. You're growing. God leads with patience, not pressure. |
| 3 | 3 | Stillness helps you hear Him | You don't have to perform. | Stillness is where His voice becomes familiar. Just come close. |
| 4 | 7 | Every step counts | Every question is welcome. | Your journey is guided. Nothing is wasted. Nothing is rushed. |
| 5 | 14 | Let Him lead you into the quiet | Your destiny begins here. | Let Him draw you into a quieter, grace-rooted life. |

---

## Deliverability — Inbox vs Promotions

Emails currently landing in Gmail Promotions. To move them to Primary:

1. **Add to Email 1 of every sequence** (first line of body): *"If this arrived in Promotions, please move it to Primary — that's where our conversations belong."*
2. **Reduce header image size** — start each email with plain text, image second
3. **Connect a sending domain** — Beacons → Settings → Sending Domain → add SPF + DKIM for sanctuarygrace.com or transform24.com
4. **Avoid Stripe links in email body** — link to the app or Beacons storefront instead of buy.stripe.com directly

---

## Setup in Beacons
- Log into beacons.ai/sanctuarygrace
- Go to Email → Automations
- Create one automation per tag (5 total)
- Trigger: subscriber joins tag
- Schedule: Day 0, Day 1, Day 3, Day 7, Day 14
