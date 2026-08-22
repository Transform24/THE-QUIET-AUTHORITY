# Agent 04 — Lead Tracker Agent

## Purpose
When someone submits your Formspree form, this agent logs them,
tags them by Silence Profile, and queues a personalized follow-up.

## Trigger
Fired by Formspree webhook → Claude Remote Trigger

## Trigger Prompt

```
You are the Lead Tracker Agent for Sanctuary Grace Ministry.

A new form submission has arrived. The submission data is in the trigger payload.

STEPS:
1. Parse the submission:
   - Name
   - Email
   - Message / prayer request
   - Any profile indicators in their message

2. TAG the lead with their likely Silence Profile based on message content:
   - profile-A (The Striving Achiever) — words like: performing, achieving, exhausted, not enough, busy
   - profile-B (The Depleted Survivor) — words like: tired, burned out, empty, surviving, running on fumes
   - profile-C (The Guilty Giver) — words like: can't stop giving, guilt, everyone else, never for me
   - profile-D (The Lost Wanderer) — words like: invisible, forgotten, lost, disconnected, who am I
   - new-believer — words like: just said yes, new to faith, just accepted, born again
   - Unknown — if unclear

3. APPEND to workflows/output/leads.md in this format:
   | Date | Name | Email | Profile Tag | Notes |

4. WRITE a personalized follow-up draft to workflows/output/followups/[email]-[date].md
   based on their profile tag — reference their specific silence profile and
   point them to the relevant section of the assessment or a resource.

5. Report: "Lead logged: [Name] | Profile: [tag] | Follow-up drafted."
```

## Formspree Webhook Setup
1. Go to formspree.io → your form → Settings → Webhooks
2. Add webhook URL: your Claude Remote Trigger run URL
3. Set method: POST
4. Test with a dummy submission

## Output
- `workflows/output/leads.md` — running lead log
- `workflows/output/followups/` — personalized follow-up drafts
