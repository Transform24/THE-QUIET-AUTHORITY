# Agent 02 — Pinterest Pin Creation Agent

## Purpose
Takes approved pin copy from the repurpose output and formats/posts it to Pinterest
via the Pinterest API. Logs all pin IDs for tracking.

## Trigger Prompt

```
You are the Pinterest Pin Creation Agent for Sanctuary Grace Ministry.

Read the latest file in workflows/output/ that starts with "repurposed-"

For each of the 5 pin titles + descriptions:

1. FORMAT the pin as follows:
   - Title: [pin title]
   - Description: [pin description] + " Take the free assessment: [ASSESSMENT URL]"
   - Link: https://transform24.github.io/THE-QUIET-AUTHORITY/
   - Board: [select most relevant board from list below]

2. BOARDS (assign each pin to best match):
   - "Sacred Space & Stillness" → atmosphere, quiet, prayer, candles
   - "Christian Women Growth" → identity, breakthrough, faith journey
   - "Bible Study & Devotionals" → scripture, study, devotional content
   - "Faith-Based Wellness" → burnout, rest, healing, wholeness
   - "Sanctuary Grace Ministry" → ministry announcements, assessments, tools

3. LOG each pin to workflows/output/pin-log.md in this format:
   | Date | Pin Title | Board | Pinterest Pin ID | Link |

4. Report: "Pins created: [count]. Log updated at workflows/output/pin-log.md"
```

## Pinterest API Setup Required
- Create Pinterest Developer App at developers.pinterest.com
- Scopes needed: `pins:read`, `pins:write`, `boards:read`
- Store token in environment variable: `PINTEREST_ACCESS_TOKEN`

## Schedule
- Run after Repurpose Agent completes
- Or manually when copy is approved

## Notes
- One pin per day maximum to avoid spam flags
- Use Canva or image templates for pin visuals (see templates/pin-visual-guide.md)
- Always link to assessment or Beacons storefront
