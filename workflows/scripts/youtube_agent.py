import urllib.request, urllib.error, json, os, datetime, pathlib, time

API_KEY = os.environ["ANTHROPIC_API_KEY"]
URL = "https://api.anthropic.com/v1/messages"

def call_claude(prompt, retries=3):
    payload = json.dumps({
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}]
    }).encode('utf-8')

    for attempt in range(1, retries + 1):
        req = urllib.request.Request(
            URL,
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            method='POST'
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())['content'][0]['text']
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"Attempt {attempt}: HTTP {e.code}", flush=True)
            if e.code == 429:
                if "quota" in body.lower() or "overloaded" in body.lower():
                    print("Rate limited or overloaded. Re-run later.", flush=True)
                    import sys; sys.exit(1)
                if attempt < retries:
                    wait = 30 * attempt
                    print(f"Rate limited. Waiting {wait}s...", flush=True)
                    time.sleep(wait)
                else:
                    raise
            else:
                raise

today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")
week_start = today - datetime.timedelta(days=today.weekday())
week_end = week_start + datetime.timedelta(days=6)
week_date_str = f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}"

# Read latest Substack devotion from substack-pending/
substack_dir = pathlib.Path("workflows/output/substack-pending")
substack_title = ""
substack_intro = ""

if substack_dir.exists():
    pending_files = sorted(substack_dir.glob("*.md"), reverse=True)
    if pending_files:
        latest_substack = pending_files[0].read_text()
        lines = latest_substack.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('---'):
                body_start = i + 1
                break
        if body_start < len(lines):
            body = '\n'.join(lines[body_start:]).strip()
            body_lines = body.split('\n')
            if body_lines:
                substack_title = body_lines[0].strip()
                for j in range(1, len(body_lines)):
                    if body_lines[j].strip():
                        substack_intro = body_lines[j].strip()
                        break

VOICE = """
PRIMARY MANDATE — Luke 4:18:
"The Spirit of the Lord is upon me, because he hath anointed me
to preach the gospel to the poor; he hath sent me to heal the
brokenhearted, to preach deliverance to the captives, and
recovering of sight to the blind, to set at liberty them
that are bruised."

SUPPORTING SCRIPTURES (in order):

Revelation 3:14-22 (THE DIAGNOSIS):
She is the Laodicean woman — lukewarm, performing, doing all the
right things but empty inside. Christ stands at the door knocking.

Proverbs 3:5-6 (THE SURRENDER):
Trust in the Lord with all your heart. Lean not on your own understanding.
In all your ways acknowledge Him. He shall direct your paths.

Psalm 27:14 (THE WAITING):
Wait on the Lord. Be of good courage. He shall strengthen thine heart.
I had fainted unless I had believed.

Matthew 6:33 (THE REORDER):
Seek ye first the kingdom of God and his righteousness.
And all these things shall be added unto you.

Psalm 22:6 (THE BECOMING):
The crimson worm. Christ made Himself nothing so she could be raised.

Romans 8:28-29 (THE PROMISE):
All things work together for good to them that love God
and are called according to His purpose.

MISSION: Reach burned-out women who sacrificed themselves empty,
are in debt, can't sleep at night, and need to encounter Christ as
their Redeemer (not self-help).

VOICE: Sacred, tender, prophetic. Minister to her brokenness with Gospel clarity.
Speak directly to: financial crisis, sleepless nights, pouring from empty,
guilt, shame, loss of self.
Point to CHRIST as Redemption — not as wellness strategy or life hack.

Audience: Women, 30-55, exhausted, in crisis, praying in secret.
Forbidden: Hustle language, wellness jargon, emojis, exclamation marks,
urgency language, generic platitudes.

Every teaching: Names her burden specifically. Quotes Scripture directly.
Invites her to surrender to Christ. Opens from Luke 4:18 as the mandate.
Ends with: Come as you are. https://sanctuary-grace.com/
"""

prompt = f"""{VOICE}

Foundation: {substack_title}

Opening line: {substack_intro}

Write a VIDEO SCRIPT for The Quiet Authority YouTube (2-3 minutes of speaking time).
Build from the Substack foundation above — open with the topic, deepen with teaching.

## SCRIPT TITLE
Under 60 characters. Sacred, not clickbait.

## FULL SCRIPT
Conversational, 2-3 minutes of reading (~500-600 words).
Include one full scripture verse (book chapter:verse).
Structure: Opening (30s) → Teaching (2 min) → Close (30s).

## SEO DESCRIPTION
200-250 words. Sacred voice. End with: https://sanctuary-grace.com/

## TAGS
10 YouTube tags (no hash). Examples: ChristianWomen, SpiritualRest, Devotional, BibleStudy, WomenInFaith, ChristianMinistry, FaithJourney, SpiritualPeace, WomenOfFaith, FaithAndWellness

## THUMBNAIL CONCEPT
One sentence. Example: "Woman in peaceful prayer, dark background, gold text 'FIND REST'"
"""

print(f"Generating script from Substack foundation...")
content = call_claude(prompt)

# Save to approval gate
out_dir = pathlib.Path("workflows/output/youtube-pending")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"

scrolling_ticker = """---SCROLLING TICKER---
Romans 10:9-10 (KJV)
That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved. For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.
---END TICKER---"""

output_text = f"""---
week: {week_date_str}
date: {date_str}
substack_title: {substack_title}
canva_candidate_id: dg-db32bf4c-9d45-4ee1-83f4-a45ccd878cce
canva_template: Dark background, 3 rings, gold typography
status: DRAFT
---

## VIDEO SCRIPT

{content}

## SCROLLING TICKER FOR CANVA

{scrolling_ticker}

---

**Canva instructions:**
- Use candidate template: dg-db32bf4c-9d45-4ee1-83f4-a45ccd878cce
- Design: Dark background with 3 rings (gold accent)
- Add scrolling ticker at bottom with Romans 10:9-10
- Export as MP4 ready for Grace to record voiceover
"""

out_file.write_text(output_text)

# Log
log_file = pathlib.Path("workflows/output/youtube-log.md")
entry = f"| {date_str} | {substack_title[:30]}... | Substack foundation | DRAFT |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Substack Title | Foundation | Status |\n|---|---|---|---|\n" + entry)

print(f"✅ Script saved: {out_file}")
print(f"   Substack title: {substack_title}")
print(f"   Canva template: dg-db32bf4c-9d45-4ee1-83f4-a45ccd878cce")
print(f"   Ticker: Romans 10:9-10")
