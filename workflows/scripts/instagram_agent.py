import urllib.request, json, os, datetime, pathlib

API_KEY = os.environ["GEMINI_API_KEY"]
URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY}"

def call_gemini(prompt):
    data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
    req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"]

today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")

PILLAR_BY_DAY = {
    "Monday": "carousel",
    "Tuesday": "scripture",
    "Thursday": "reel",
    "Friday": "devotional",
    "Saturday": "silence",
}

pillar_override = os.environ.get("PILLAR_OVERRIDE", "").strip()
pillar = pillar_override if pillar_override else PILLAR_BY_DAY.get(day_name, "scripture")

VOICE = """
BRAND VOICE — SACRED LAW. Never deviate.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis in copy, exclamation marks, urgency language.
Ministry: Sanctuary Grace Ministry.
Every caption ends with: https://sanctuarygrace.store
Max caption: 150 words.
"""

HASHTAGS = "#ChristianWomen #SpiritualRest #FaithAndWellness #QuietTime #SanctuaryGrace #SpiritualBurnout #FaithJourney #ScriptureForWomen #SacredSpace #HopeForWomen #ChristianMom #DailyDevotion"

INSTRUCTIONS = {
    "carousel": """Write a PROFILE REVEAL CAROUSEL (5-7 slides).
Each slide: 1-2 sentences, sacred and tender. Each ends on a turn — reader wants to swipe.
Topic: one of the 4 profiles (The Striving Achiever, The Depleted Survivor, The Guilty Giver, or The Lost Wanderer).
Final slide: soft CTA to https://sanctuarygrace.store

Format:
SLIDE 1: [text]
...
CAPTION: [max 150 words, ends with https://sanctuarygrace.store]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [1080x1080px, black bg, Cinzel ALL CAPS, terra text #C1593C, per slide]""",

    "scripture": """Write a SCRIPTURE + REFLECTION post.
Choose one scripture about spiritual exhaustion, rest, or identity in Christ. Write verse in full.
Reflection: 2 paragraphs, first-person, tender, prophetic.
Close with: https://sanctuarygrace.store

Format:
SCRIPTURE: [Book Chapter:Verse — full text]
CAPTION: [verse + reflection + CTA, max 150 words]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [scripture text on black, Cinzel, gold stars, terra accent]""",

    "reel": """Write a REEL SCRIPT in sacred TQA voice (~45 seconds at unhurried pace).
Hook (3 sec): One line that stops the scroll. Sacred, not clickbait.
Beat 1 (10 sec): One true, tender statement.
Beat 2 (10 sec): One true, tender statement.
Beat 3 (10 sec): One true, tender statement.
CTA (5 sec): soft close to https://sanctuarygrace.store

Format:
HOOK: [text]
BEAT 1: [text]
BEAT 2: [text]
BEAT 3: [text]
CTA: [close]
CAPTION: [max 150 words, ends with https://sanctuarygrace.store]
HASHTAGS: [5-8 from pool]
THUMBNAIL BRIEF: [Canva cover brief]""",

    "devotional": """Write a DEVOTIONAL PREVIEW post.
One scripture. 2-3 sentences of teaching. Soft invitation.
CTA: "Full devotional at https://sanctuarygrace.store"

Format:
CAPTION: [max 150 words, ends with https://sanctuarygrace.store]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [devotional cover image brief]""",

    "silence": """Write a CIRCLE OF SILENCE invitation.
Invite the reader into 15 minutes with God. Tender, unhurried.
Link to: https://youtube.com/@TheQuietAuthority-f1z
Also: https://sanctuarygrace.store

Format:
CAPTION: [max 150 words, links to YouTube + sanctuarygrace.store]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [dark, peaceful, minimal text]""",
}

prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Content pillar: {pillar}

{INSTRUCTIONS.get(pillar, INSTRUCTIONS["scripture"])}

Hashtag pool: {HASHTAGS}"""

content = call_gemini(prompt)

out_dir = pathlib.Path("workflows/output/ig-drafts")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"
out_file.write_text(
    f"---\ndate: {date_str}\npillar: {pillar}\nstatus: DRAFT — review before posting\n---\n\n{content}\n"
)

log_file = pathlib.Path("workflows/output/ig-log.md")
entry = f"| {date_str} | {pillar} | DRAFT SAVED | {out_file} |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Pillar | Status | File |\n|---|---|---|---|\n" + entry)

print(f"Instagram draft saved: {out_file}")
