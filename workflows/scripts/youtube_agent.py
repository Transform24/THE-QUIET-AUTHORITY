import urllib.request, urllib.error, json, os, datetime, pathlib, time

API_KEY = os.environ["ANTHROPIC_API_KEY"]
URL = "https://api.anthropic.com/v1/messages"

def call_claude(prompt, retries=3):
    payload = json.dumps({
        "model": "claude-3-5-sonnet-20241022",
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

SERIES = ["Profile deep dive", "7-day practice walkthrough", "Circle of Silence session", "Scripture reflection"]
series = SERIES[today.isocalendar()[1] % len(SERIES)]

prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Series: {series}

Write a VIDEO SCRIPT for The Quiet Authority YouTube (2-3 minutes of speaking time).

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

print(f"Generating script...")
content = call_claude(prompt)

# Save to approval gate
out_dir = pathlib.Path("workflows/output/youtube-pending")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"

output_text = f"""---
date: {date_str}
series: {series}
status: SCRIPT READY — Grace records and uploads to YouTube
---

{content}

---

**How to use this script:**
1. Download this script from the Approval Gate
2. Record yourself reading the script (phone, webcam, or camera — 2-3 minutes)
3. Use Canva or simple slides to create visuals while recording
4. Export as MP4
5. Upload to YouTube with the SEO description and tags provided above
"""

out_file.write_text(output_text)

# Log
log_file = pathlib.Path("workflows/output/youtube-log.md")
entry = f"| {date_str} | Script ready | {series} | PENDING GRACE RECORDING |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Content | Series | Status |\n|---|---|---|---|\n" + entry)

print(f"✅ Script saved: {out_file}")
print(f"   Grace downloads from Approval Gate and records herself")
