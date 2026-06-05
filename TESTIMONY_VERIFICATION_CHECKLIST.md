# Testimony Workflow — Manual Verification Checklist

**Date:** 2026-06-05  
**Status:** Code wired and committed. Manual testing required.  
**Sheet ID:** `19Not5fUa4dO-2Vmt6k5lmIo7tLnxUrDP1ZarlsuEEe8`  
**Form ID:** `1COktWrXRfPZXZ90R6qrfOy2ZWIM63CciJLYrsfOUAg4`

---

## MANUAL TEST PLAN

Open browser and navigate to: **https://transform24.github.io/THE-QUIET-AUTHORITY/**

### Test 1: Landing Page → Assessment → Email Capture
- [ ] Landing page loads (shows soul counter, language selector, "Begin Assessment" button)
- [ ] Click "Begin Assessment"
- [ ] Answer all 8 assessment questions
- [ ] Enter name: "Grace Turner" (or your name)
- [ ] Enter email: your Gmail address (so you can see the response in the sheet)
- [ ] Click "Reveal My Profile"
- [ ] Wait 3 seconds for ceremony animation
- [ ] Results page appears with your profile

### Test 2: Circle of Silence Section Visible
- [ ] Scroll down on results page
- [ ] Find section titled **"Circle of Silence — The Next Step"**
- [ ] Section should show:
  - Welcome text about sacred silence
  - "Share My Story" button (gold/terra color)
  - "Join Waitlist" button below it

### Test 3: Share My Story Button
- [ ] Locate **"Share My Story"** button in Circle section
- [ ] Click it
- [ ] **Google Form should open in a NEW TAB** with title: "Share Your Transformation — The Quiet Authority"
- [ ] Form should have these fields visible:
  - Full Name (should be **PRE-FILLED** with "Grace Turner" or your name)
  - Profile Type (should be **PRE-FILLED** with your profile: "The Striving Achiever" / etc.)
  - Your Story (text area)
  - What Changed? (text area)
  - What Are You Doing Differently? (text area)
  - Permission to Share (radio buttons)
  - Email Address

### Test 4: Form Submission
- [ ] Fill in the form:
  - Your Story: Write 200+ words about your breakthrough
  - What Changed?: Describe a specific shift
  - What Are You Doing Differently?: Describe a behavior change
  - Permission: Select "Yes, share my story"
  - Email: (auto-populated)
- [ ] Click "Submit"
- [ ] Form shows confirmation message

### Test 5: Verify Google Sheet
- [ ] Open Google Sheet: https://docs.google.com/spreadsheets/d/19Not5fUa4dO-2Vmt6k5lmIo7tLnxUrDP1ZarlsuEEe8/edit
- [ ] Sheet should contain new row with your submission:
  - Timestamp (auto)
  - Name (Grace Turner)
  - Profile Type (your profile)
  - Your Story (your text)
  - What Changed (your text)
  - Doing Differently (your text)
  - Permission: Yes
  - Email: your email

---

## TROUBLESHOOTING

**If form doesn't open:**
- Check browser popup blocker — form opens in new tab
- Check browser console (F12 → Console) for errors
- Verify you have localStorage enabled

**If form doesn't pre-fill name + profile:**
- Complete assessment first (saves name + profile to localStorage)
- Clear browser cookies and try again

**If sheet isn't collecting responses:**
- Verify form is correctly linked to sheet (contact Google Forms support)
- Manually check Google Drive if share permissions are set correctly

---

## NEXT: Grace's Review Workflow

Once responses arrive in the sheet, Grace:
1. **Reviews** every Friday (criteria in TESTIMONY_APPROVAL_WORKFLOW.md)
2. **Marks** Status = APPROVED / REJECTED / NEEDS_EDIT
3. **Creates graphics** (Pinterest card 1000×1500px, Instagram carousel 5 slides)
4. **Schedules posts** (2x/month Pinterest, 1x/month Instagram + email)

---

## COMPLETION CRITERIA

- [x] Google Sheet created and accessible
- [x] "Share My Story" button wired in code
- [x] Form opens with pre-filled name + profile
- [ ] User submits test form ← **MANUAL STEP REQUIRED**
- [ ] Response appears in Google Sheet ← **MANUAL STEP REQUIRED**
- [ ] Approval workflow tested ← **Pending first submission**

---

**Status:** Waiting for user to test in their browser.
