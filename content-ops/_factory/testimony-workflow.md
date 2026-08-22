# TESTIMONY APPROVAL & AMPLIFICATION WORKFLOW

**Phase 5 → Phase 6 Bridge**  
*Last updated: 2026-06-04*

---

## SUBMISSION PIPELINE

### Step 1: Collection (Automated)
- Women click "Share My Story" button in Circle of Silence section
- Google Form opens with pre-filled name + profile type
- Form fields:
  - Full Name (pre-filled if logged in)
  - Profile Type (pre-filled: Striving Achiever / Depleted Survivor / Guilty Giver / Lost Wanderer)
  - Your Story (text area, 200-500 words recommended)
  - What Changed? (specific breakthrough or shift)
  - What Are You Doing Differently? (behavior change)
  - Permission to Share (checkbox: I give permission to share my story on social media with my first name)
  - Contact Email

**Form responses feed directly to:** Google Sheet tab "Testimonies" (auto-populate)

---

## STEP 2: GRACE'S REVIEW (Weekly, Fridays)

**Where:** Google Sheet `19Not5fUa4dO-2Vmt6k5lmIo7tLnxUrDP1ZarlsuEEe8` (TQA Testimonies - Responses)  
**Access:** https://docs.google.com/spreadsheets/d/19Not5fUa4dO-2Vmt6k5lmIo7tLnxUrDP1ZarlsuEEe8/edit  
**Columns to assess:**
| Column | Criteria | Action |
|--------|----------|--------|
| Name | Valid? | Block if spam/fake |
| Profile | Assigned correctly? | Verify matches app |
| Story | 150+ words? Sacred tone? | Reject if <100 words or generic |
| Changed | Specific? (not "I felt better") | Reject if vague |
| Permission | Checkbox marked? | Must be YES to amplify |
| Authenticity | Reads like real woman? | Trust your gut |

**Decision columns:**
- Status: `APPROVED` / `REJECTED` / `NEEDS_EDIT`
- Amplify Month: Which month (e.g., "June" / "July")
- Platform Priority: `PINTEREST_FIRST` / `INSTAGRAM_FIRST` / `BOTH`
- Notes: Edit suggestions or rejection reason

**Approval Rate Target:** 60% (some stories will be too generic or permission missing)

---

## STEP 3: EDITORIAL EDITS (Mon–Wed After Grace Decides)

If `Status = NEEDS_EDIT`:
1. Grace emails woman: "We love your story. We'd like to polish one thing..."
2. Include specific edit suggestion (e.g., "Can you add what changed in your daily rhythm?")
3. Woman replies with edit
4. Grace updates sheet, sets `Status = APPROVED`

**Timeline:** Edit request sent by Tue 5pm PT → response by Thu 5pm PT → posted in approved month

---

## STEP 4: FORMATTING FOR PLATFORM (Fridays)

Once `Status = APPROVED`:

### Pinterest Card
- Dimensions: 1000×1500px (vertical)
- Layout:
  - Top 40%: Profile image (A/B/C/D.png, grayscale)
  - Middle 30%: Quote from story (20-30 words, terra text, Cinzel)
  - Bottom 30%: 
    - Woman's first name + profile type (gold)
    - "Read her story" link button
    - `sanctuary-grace.com` CTA
- File: `pin-testimony-[Month]-[#].png`
- Save to: `workflows/output/story-pins/`

### Instagram Carousel (5 slides)
- Slide 1: Hero image + "Meet [Name]"
- Slides 2-3: Story excerpt (break into 2 cards max 100 words each)
- Slide 4: Quote from story
- Slide 5: CTA + link tree ("Find your profile: sanctuary-grace.com")
- Caption: 100-150 words, same sacred voice
- Save to: `workflows/output/story-carousel/`

### Email Feature (Nurture Sequence)
- Subject: "[Profile Type] Breakthrough: [Name]'s Story"
- Body:
  - Greeting
  - Full story (400-600 words)
  - "Your story matters too" CTA
  - Link to assess/share
- Save to: `workflows/output/story-emails/[Month]/`

---

## STEP 5: POSTING SCHEDULE

| Platform | Cadence | Priority | Month Example |
|----------|---------|----------|---|
| Pinterest | 2x/month (Wed + Fri) | Highest | June: stories 1 & 3 |
| Instagram | 1x/month (Thu) | High | June: story 1 carousel |
| Email | 1x/month (in nurture sequence) | Medium | June: story 1 feature |
| YouTube | Community post weekly | Low | Snippet + link |

**Posting SOP:**
1. Mon: Create all graphics (Pinterest + Instagram)
2. Tue: Schedule on Buffer/Later or upload drafts to shared Drive folder
3. Wed: Publish Pinterest card 1 at 2pm UTC
4. Thu: Publish Instagram carousel at 2pm UTC
5. Fri: Publish Pinterest card 2 at 2pm UTC + Schedule email for Mon 6am PT

---

## STEP 6: TRAFFIC TRACKING

**Every post must link back to assessment:**

- **Pinterest:** Button text "Find Your Profile" → `sanctuary-grace.com/`
- **Instagram:** Linktree or pinned comment with `sanctuary-grace.com`
- **Email:** CTA text "Discover Your Profile" → `sanctuary-grace.com/`
- **YouTube:** Community post: "What's your profile? Take the free assessment"

**Metrics to track (monthly):**
- Pinterest pin saves + clicks
- Instagram engagement + link clicks
- Email click rate on story feature
- Assessment starts attributed to "testimony posts"
- Conversion rate from testimony traffic (how many start → complete → email captured)

---

## APPROVAL RATE TARGETS

| Metric | Target | Why |
|--------|--------|-----|
| Testimonies collected/month | 3-5 | Consistency |
| Approval rate | 60%+ | Quality bar high |
| Amplified posts/month | 2-3 | Pipeline stays full |
| Time from submission to post | <14 days | Fresh content, fast loop |
| Traffic from story posts | 3-8 new assessments/month | Flywheel closing |

---

## GOOGLE FORM SETUP CHECKLIST

- [ ] Create Google Form titled "Share Your Transformation — The Quiet Authority"
- [ ] Add fields: Name, Profile Type, Story, What Changed, Doing Differently, Permission (checkbox), Email
- [ ] Set to collect email addresses (for follow-up)
- [ ] Link response sheet to TQA Drive folder
- [ ] Share form link in app ("Share My Story" button)
- [ ] Test form submission end-to-end
- [ ] Set up auto-email when form submitted: "We've received your story. Grace reviews testimonies every Friday."

---

## IF AMPLIFICATION FAILS

**Symptom:** Stories submitted but never posted  
**Fix:** 
1. Check approval sheet — did Grace review? (Every Friday)
2. Check if "Status = APPROVED" — if stuck at "NEEDS_EDIT," woman didn't respond to edit request
3. If story approved but not posted → Graphics not created → Create immediately

**Symptom:** Stories posted but zero traffic  
**Fix:**
1. Check link in post — does it go to `sanctuary-grace.com/`?
2. Check Pinterest pin visibility — did it get pinned to right board?
3. Check Instagram caption — does it have the link or story link?
4. If all correct → pin/post may not be resonating. Next month test different type of story (focus on breakthrough vs. struggle)

---

## NEXT: EMAIL WELCOME SEQUENCE

Once testimonies are flowing (month 2+), feature top-performing stories in welcome sequence email #3 to show new women real transformation.

