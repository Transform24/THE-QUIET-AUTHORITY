# Platform Stack — Sanctuary Grace Ministry
*Last updated: 2026-05-17 · MailerLite removed — Beacons is the email engine*

The complete, streamlined platform map. Nothing extra. Nothing missing.

---

## The Stack

```
CONTENT CREATION
├── Google Drive        Content hub — drop raw videos, scripts, ideas here
└── YouTube             Long-form video — source for all repurposing
    Handle: @TheQuietAuthority-f1z

DISCOVERY (people find you)
└── Pinterest           Primary traffic driver for Christian women audience
    Handle: pinterest.com/sanctuarygracefaith
    └── Pins link to → Assessment site

YOUR SITE
└── GitHub Pages        The Quiet Authority assessment
    URL: transform24.github.io/THE-QUIET-AUTHORITY
    ├── Assessment → captures name + email (Formspree xzdkgbbq)
    ├── Wall art shop → Stripe payment links
    ├── Devotional shop → Stripe payment links
    ├── Sacred Space → Amazon affiliate (tag: sanctuarygrac-20)
    └── CTAs → Beacons storefront

EMAIL (you own this relationship)
├── Formspree           Captures leads from site forms (ID: xzdkgbbq)
│   └── webhook fires →
└── Beacons             Email engine — list, automations, broadcasts
    URL: beacons.ai/sanctuarygrace
    Tags: profile-A · profile-B · profile-C · profile-D · new-believer

STOREFRONT & PAYMENT
├── Beacons             Link-in-bio, storefront, free resources, email
└── Stripe              Paid products — wall art, devotionals, books
```

---

## What Each Platform Does

### Google Drive
- Store: raw video files, scripts, devotional drafts, images
- Agent 01 reads from `/content-inbox/` to repurpose content
- Folder structure:
  ```
  /Sanctuary Grace/
    /content-inbox/      ← drop new content here (agents read this)
    /content-queue/      ← repurposed copy waiting to post
    /pin-images/         ← Canva exports for Pinterest
    /leads/              ← lead log backup
  ```

### Pinterest
- Primary discovery platform for this audience
- Post: 1–3 pins per day (batched weekly via Agent 02)
- All pins link to: assessment site or Beacons
- Boards:
  - Sacred Space & Stillness
  - Christian Women Growth
  - Bible Study & Devotionals
  - Faith-Based Wellness
  - Sanctuary Grace Ministry

### Beacons (email engine — replaces MailerLite)
- URL: `beacons.ai/sanctuarygrace`
- Handles: subscriber list, profile tags, welcome automations, daily broadcasts
- Tags in use: `profile-A` `profile-B` `profile-C` `profile-D` `new-believer`
- Agent 04 tags subscribers after Formspree submission
- Agent 06 sends daily inspiration via Beacons broadcast API (7:00 AM EST)
- Welcome sequences: 5 automations (one per tag) with Day 0/3/7/14 emails
- DO NOT use MailerLite — it has been removed from this stack

### Stripe
- Wall art: 4 individual links + 1 bundle → See product-registry.md
- Devotionals: 4 weekly + 1 bundle → See product-registry.md
- Books: The Quiet Authority + The Parable of the Cocoon
- Agent 03 audits that index.html links match active Stripe products

### Formspree
- Form ID: `xzdkgbbq`
- All site forms submit here
- Webhook fires Agent 04 (Lead Tracker) on each new submission
- Agent 04 tags subscriber in Beacons by profile

---

## Integration Flow

```
YouTube video uploaded
    → drop transcript in Google Drive /content-inbox/
    → run Agent 01 (Repurpose) → pin copy + email + captions
    → run Agent 02 (Pin Creation) → posts to Pinterest
    → email via Beacons broadcast

Someone finds pin on Pinterest
    → clicks to assessment site
    → takes 8-question assessment
    → submits name + email (Formspree xzdkgbbq)
    → webhook fires Agent 04 (Lead Tracker)
    → Agent 04 tags subscriber in Beacons (profile-A through new-believer)
    → Beacons automation fires welcome sequence for that tag
    → Day 0: welcome + download
    → Day 3: devotional
    → Day 7: Circle of Silence
    → Day 14: book or R.E.S.T. workbook

Agent 06 runs every morning at 7:00 AM EST
    → reads daily-inspiration templates (7-day rotation)
    → builds 5 email versions (one per profile tag)
    → sends via Beacons broadcast API filtered by tag

They buy from Stripe
    → wall art download delivered
    → revenue
    → Grace ministers + gets paid
```

---

## What You Don't Need

| Platform | Why Not |
|---|---|
| MailerLite | Replaced by Beacons |
| Zapier | Removed — direct Formspree webhook to Claude trigger |
| Kajabi / Teachable | Not until a full course is ready |
| Linktree | Beacons does this |
| Substack | Optional SEO blog only — not for email |
| Mailchimp / ConvertKit | Beacons handles email |

---

## Monthly Cost

| Platform | Cost |
|---|---|
| GitHub Pages | Free |
| Formspree | Free (Hobbyist) |
| Beacons | Free (basic) |
| Pinterest | Free |
| YouTube | Free |
| Google Drive | Free (15GB) |
| **TOTAL** | **$0/month** |
