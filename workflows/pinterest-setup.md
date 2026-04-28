# Pinterest Setup — Sanctuary Grace Ministry
*The Quiet Authority · Complete setup guide*

---

## STEP 1 — Create a Pinterest Business Account

1. Go to **pinterest.com/business/create**
2. Sign up with your ministry email
3. Choose category: **Education** or **Religious Organizations**
4. Add your website: `https://transform24.github.io/THE-QUIET-AUTHORITY/`
5. Skip the ad setup — you don't need ads

---

## STEP 2 — Claim Your Website (Domain Verification)

1. In Pinterest: go to **Settings → Claimed Accounts → Website**
2. Choose **Add HTML tag**
3. Pinterest gives you a code that looks like: `abc123xyz`
4. Open `index.html` and find this line:
   ```
   <meta name="p:domain_verify" content="REPLACE_WITH_PINTEREST_VERIFICATION_CODE">
   ```
5. Replace `REPLACE_WITH_PINTEREST_VERIFICATION_CODE` with your actual code
6. Push to GitHub → wait ~60 seconds for GitHub Pages to deploy
7. Back in Pinterest → click **Verify**

When verified, your profile photo shows on every pin from your site. Your pins get priority in search.

---

## STEP 3 — Create Your 5 Boards

Create these boards in this order (most important first):

| Board Name | Description | Secret? |
|---|---|---|
| **Sacred Space & Stillness** | Prayer, quiet, atmosphere, candles, rest | No — public |
| **Christian Women Growth** | Identity, breakthrough, faith journey, calling | No — public |
| **Bible Study & Devotionals** | Scripture, study, devotionals, quiet time | No — public |
| **Faith-Based Wellness** | Burnout, rest, healing, wholeness, peace | No — public |
| **Sanctuary Grace Ministry** | Assessment, resources, tools, ministry updates | No — public |

For each board:
- Add 10–15 description keywords (Pinterest uses these for search)
- Set category to **Education** or **Spirituality**
- Add a cover image (use your banner.png)

---

## STEP 4 — Apply for Rich Pins

Rich Pins pull your title and description directly from your site's meta tags — already set up on your site.

1. Go to: **developers.pinterest.com/tools/url-debugger/**
2. Paste: `https://transform24.github.io/THE-QUIET-AUTHORITY/`
3. Click **Validate** — it should detect your og: tags
4. Click **Apply Now** for Rich Pins
5. Pinterest approves within 24 hours

---

## STEP 5 — Profile Setup

| Field | What to put |
|---|---|
| Display name | Sanctuary Grace \| The Quiet Authority |
| Username | `sanctuarygrace` (or `sanctuarygracefaith`) |
| Bio | Sacred tools for burned-out Christian women. Find your Silence Profile → stillness, breakthrough, and identity. Free assessment below. |
| Website | `https://transform24.github.io/THE-QUIET-AUTHORITY/` |
| Profile photo | Your bio.png headshot |

---

## STEP 6 — Posting Schedule

**Target: 3 pins per day** (batch weekly — post Monday through Sunday)

| Day | Board | Pin Type |
|---|---|---|
| Monday | Christian Women Growth | Motivational / scripture quote |
| Tuesday | Sacred Space & Stillness | Atmosphere / lifestyle image |
| Wednesday | Bible Study & Devotionals | Scripture graphic |
| Thursday | Faith-Based Wellness | Burnout / rest topic |
| Friday | Sanctuary Grace Ministry | Assessment CTA pin |
| Saturday | Sacred Space & Stillness | Weekend quiet-time visual |
| Sunday | Christian Women Growth | Sunday reflection / scripture |

**Always link to:** `https://transform24.github.io/THE-QUIET-AUTHORITY/` or `beacons.ai/sanctuarygrace`

---

## STEP 7 — Pin Image Specs

Pinterest favors **vertical images**.

| Format | Size | Use for |
|---|---|---|
| Standard pin | 1000 × 1500 px (2:3) | All regular pins |
| Long pin | 1000 × 2100 px | Step-by-step / list content |
| Story pin | 1080 × 1920 px (9:16) | Video shorts / reels repurposed |

**Design rules (Canva):**
- Dark background: `#0d0d0d` or `#111111`
- Gold text: `#C9A84C`
- Cream body text: `#F5F0E8`
- Font: Cormorant Garamond (heading) + Jost (body)
- Always include: your logo or "Sanctuary Grace Ministry" in small text at bottom
- Never use stock photos that look generic — use your own or AI-generated sacred imagery

---

## STEP 8 — YouTube → Pinterest Repurposing Flow

When you upload a YouTube video:

1. Drop the video transcript or description into:
   `workflows/templates/repurpose-brief.md`

2. Run **Agent 01 (Repurpose Agent)** → it outputs:
   - 5 Pinterest pin titles
   - 5 Pinterest pin descriptions
   - Suggested boards for each

3. Open Canva → create pin images using the copy from Agent 01 output

4. Post pins manually **or** run **Agent 02 (Pin Creation Agent)** once Pinterest API is connected

5. Log posted pins in: `workflows/output/pin-log.md`

---

## STEP 9 — Pinterest API (for Agent 02 automation)

When you're ready to automate pin posting:

1. Go to **developers.pinterest.com** → Create App
2. App name: `Sanctuary Grace Automation`
3. Request scopes: `pins:read`, `pins:write`, `boards:read`
4. Copy your **Access Token**
5. Store it: add `PINTEREST_ACCESS_TOKEN=your_token_here` to your environment
6. Agent 02 will use it to post pins automatically after Agent 01 runs

---

## Checklist

- [ ] Pinterest Business account created
- [ ] Website claimed + verified (`p:domain_verify` meta tag updated in index.html)
- [ ] Rich Pins applied and approved
- [ ] Profile photo, bio, and website filled in
- [ ] 5 boards created with descriptions
- [ ] First 7 pins posted (one per board category)
- [ ] Posting schedule established (3/day, batch weekly)
- [ ] Agent 01 tested with first YouTube video
- [ ] Pinterest API app created (when ready to automate)

---

*Assessment URL: https://transform24.github.io/THE-QUIET-AUTHORITY/*
*Beacons URL: https://beacons.ai/sanctuarygrace*
*YouTube: @TheQuietAuthority-f1z*
