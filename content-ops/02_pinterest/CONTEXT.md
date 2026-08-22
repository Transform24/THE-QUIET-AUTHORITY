# Pinterest — SOP
*Last updated: 2026-08-22 — board names corrected against the live posting code (`workflows/scripts/pinterest_agent.py`)*

## Reads / Does / Writes
- **Reads:** this file (schedule, brand kit, hashtag pool), repo-root wall art images (`profile-A/B/C/D.png`), Drive `/content-queue/` for devotional covers
- **Does:** generates or selects the pin image, writes the caption in sacred TQA voice, publishes via Pinterest API
- **Writes:** Pinterest (live post), `workflows/output/pin-log.md`, `workflows/output/pin-drafts/` (when no API token)
- **Human check:** Grace reviews via `approval-gate.html` before anything posts when the token isn't set; once the token is set, posting is direct — see `agent.md` Failure Handling for the fallback path

## Why Pinterest → email

Pinterest is 76% women, strongest 25–54, faith/wellness is a top category. Traffic flows to the assessment site; the email engine (MailerLite, see `_system/integrations.md`) warms them, then the assessment converts.

## Brand Kit
- **Canva brand kit ID:** `kAHKceDuDGk` — "TQA Pinterest — Sacred Profiles"
- **Colors:** `#000000` (background) · `#C1593C` (terra, all text) · `#C9A84C` (gold, stars)
- **Font:** Cinzel · Regular · ALL CAPS only
- **Stars:** 4-point starburst, 3 sizes (large ~100px, medium ~50px, small ~28px), left margin
- **Photo:** B&W only, high contrast, no tint, no overlay

## Boards — verified against live code, 2026-08-22

`workflows/scripts/pinterest_agent.py` calls the Pinterest API by these exact names at post time. Treat this list as ground truth over any other board list you find in older docs:

- **The Quiet Authority for Women**
- **Sacred Morning Practices**
- **Christian Women Encouragement**
- **Spiritual Rest for Women**

## Pin Image Sources
| Pin type | Source | Do NOT recreate in Canva |
|---|---|---|
| Wall art profile pins | `profile-A/B/C/D.png` from repo root | ✓ Already perfect — download and upload directly |
| Scripture quote cards | Generate in Canva with brand kit | — |
| Devotional covers | Existing product images from Drive | — |
| Sacred aesthetic | Generate in Canva or source from Drive | — |

## Caption Rules
- Sacred, tender, prophetic — minister not marketer
- No emojis, no exclamation points, no urgency language
- Every caption ends with the current site CTA (see `_system/integrations.md` for the live URL)
- 100–200 words per caption
- 3–5 hashtags, always last line, never repeated same 5 twice in a row

## Hashtag Pool
`#ChristianWomen` `#SpiritualRest` `#FaithAndWellness` `#QuietTime` `#SanctuaryGrace` `#SpiritualBurnout` `#FaithJourney` `#ScriptureForWomen` `#SacredSpace` `#HopeForWomen` `#ChristianMom` `#DailyDevotion`

## 30-Day Pin Schedule

| Day | Pin | Board | Image source |
|---|---|---|---|
| 1 | The Guilty Giver wall art | The Quiet Authority for Women | `profile-C.png` |
| 2 | Sacred aesthetic + "There is a stillness that heals what striving never could" | Sacred Morning Practices | Canva / Drive |
| 3 | The Depleted Survivor wall art | The Quiet Authority for Women | `profile-B.png` |
| 4 | Scripture pin — Matthew 11:28 | Christian Women Encouragement | Canva |
| 5 | The Striving Achiever wall art | The Quiet Authority for Women | `profile-A.png` |
| 6 | Devotional Week 1 Vision cover | Sacred Morning Practices | Drive |
| 7 | The Lost Wanderer wall art | The Quiet Authority for Women | `profile-D.png` |
| 8 | "Which type are you?" discovery pin — all 4 profiles | Spiritual Rest for Women | Canva |
| 9 | Scripture + Guilty Giver quote | Christian Women Encouragement | Canva |
| 10 | Devotional Week 2 Renewal cover | Sacred Morning Practices | Drive |
| 11 | Re-pin Day 1 Guilty Giver → Spiritual Rest for Women | Spiritual Rest for Women | — |
| 12 | "The assessment is free. The stillness is real." | The Quiet Authority for Women | Canva |
| 13 | Sacred aesthetic + "You were not made to pour from empty" | Christian Women Encouragement | Canva / Drive |
| 14 | Circle of Silence pin — "15 minutes. Just you and God." | Sacred Morning Practices | Canva |
| 15 | "Start here" assessment overview pin | Spiritual Rest for Women | Canva |
| 16 | Devotional Week 3 Peace cover | Sacred Morning Practices | Drive |
| 17 | Re-pin Guilty Giver wall art → Christian Women Encouragement | Christian Women Encouragement | — |
| 18 | Quote pin — line from Guilty Giver profile description | The Quiet Authority for Women | Canva |
| 19 | R.E.S.T. Workbook — "Free. No catch. Just a path forward." | Spiritual Rest for Women | Canva |
| 20 | Scripture + "Your exhaustion is not failure. It is an invitation." | Christian Women Encouragement | Canva |
| 21 | Devotional Week 4 Calling cover | Sacred Morning Practices | Drive |
| 22–24 | Re-pin 3 highest-performing pins from Weeks 1–2 to new boards | All boards | — |
| 25 | Brand story pin — personal, links to assessment | Spiritual Rest for Women | Canva |
| 26 | Re-pin Guilty Giver wall art to all 4 boards | All boards | — |
| 27 | Devotional bundle pin — all 4 weeks, bundle savings | The Quiet Authority for Women | Canva |
| 28 | Circle of Silence waitlist pin | Sacred Morning Practices | Canva |
| 29 | Scripture from 7-day practice | Christian Women Encouragement | Canva |
| 30 | Review: identify top 3 pins by saves → double down Month 2 | — | — |

## Posting Schedule
- Post between 8–11am or 7–9pm (highest engagement for this demographic)
- Minimum 1 day between pins
- Save each wall art pin to at least 2 boards

## Skills Used
- `/copywriting` — caption writing, CTA copy
- `/social` — platform optimization, repurposing
- `/content-strategy` — pillar planning, what to create next
