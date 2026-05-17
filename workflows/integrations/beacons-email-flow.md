# Email Flow — Beacons (replaces MailerLite)

Beacons is the email engine. Not MailerLite. Not Zapier.

## How it works
1. User completes assessment → Formspree fires → Agent 04 tags subscriber in Beacons
2. Beacons tag: profile-A, profile-B, profile-C, profile-D, or new-believer
3. Beacons automation fires the correct welcome sequence for that tag
4. Agent 06 sends daily inspiration email every morning at 7am

## Profile Welcome Sequences (set up once in Beacons)
| Tag | Day 0 | Day 3 | Day 7 | Day 14 |
|---|---|---|---|---|
| profile-A | Welcome + download | Devotional Wk 1 | Circle of Silence | Book |
| profile-B | Welcome + download | Devotional Wk 2 | Circle of Silence | Book |
| profile-C | Welcome + download | Devotional Wk 3 | Circle of Silence | R.E.S.T. |
| profile-D | Welcome + download | Devotional Wk 4 | Circle of Silence | Book |
| new-believer | Heaven rejoices + R.E.S.T. | Devotional Wk 1 | Circle of Silence | — |

## Setup
- Log into beacons.ai/sanctuarygrace
- Go to Email → Automations
- Create one automation per tag (5 total)
- Trigger: subscriber joins tag
- Set up the Day 0/3/7/14 email sequence for each
