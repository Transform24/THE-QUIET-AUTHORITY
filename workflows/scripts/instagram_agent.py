import json, os, datetime, pathlib
from anthropic import Anthropic

ANTHROPIC_API_KEY = os.environ['ANTHROPIC_API_KEY']
client = Anthropic(api_key=ANTHROPIC_API_KEY)

def call_claude(prompt):
    try:
        message = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text
    except Exception as e:
        print(f"Claude API error: {str(e)}", flush=True)
        raise

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

Voice: Sacred, tender, prophetic. Minister to her brokenness with Gospel clarity.
Speak directly to: financial crisis, sleepless nights, pouring from empty,
guilt, shame, loss of self.
Point to CHRIST as Redemption — not as wellness strategy or life hack.

Audience: Women, 30-55, exhausted, in crisis, praying in secret.
Forbidden: Hustle language, wellness jargon, emojis in copy, exclamation marks,
urgency language, generic platitudes.

Every post: Names her burden specifically. Quotes Scripture directly.
Invites her to surrender to Christ. Opens from Luke 4:18 as the mandate.
Ends with: https://sanctuary-grace.com/ | Max: 150 words.
"""

HASHTAGS = "#ChristianWomen #SpiritualRest #FaithAndWellness #QuietTime #SanctuaryGrace #SpiritualBurnout #FaithJourney #ScriptureForWomen #SacredSpace #HopeForWomen #ChristianMom #DailyDevotion"

INSTRUCTIONS = {
    "carousel": """Write a PROFILE REVEAL CAROUSEL (5-7 slides).
Each slide: 1-2 sentences, sacred and tender. Each ends on a turn — reader wants to swipe.
Topic: one of the 4 profiles (The Striving Achiever, The Depleted Survivor, The Guilty Giver, or The Lost Wanderer).
Final slide: soft CTA to https://sanctuary-grace.com/

Format:
SLIDE 1: [text]
...
CAPTION: [max 150 words, ends with https://sanctuary-grace.com/]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [1080x1080px, black bg, Cinzel ALL CAPS, terra text #C1593C, per slide]""",

    "scripture": """Write a SCRIPTURE + REFLECTION post.
Choose one scripture about spiritual exhaustion, rest, or identity in Christ. Write verse in full.
Reflection: 2 paragraphs, first-person, tender, prophetic.
Close with: https://sanctuary-grace.com/

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
CTA (5 sec): soft close to https://sanctuary-grace.com/

Format:
HOOK: [text]
BEAT 1: [text]
BEAT 2: [text]
BEAT 3: [text]
CTA: [close]
CAPTION: [max 150 words, ends with https://sanctuary-grace.com/]
HASHTAGS: [5-8 from pool]
THUMBNAIL BRIEF: [Canva cover brief]""",

    "devotional": """Write a DEVOTIONAL PREVIEW post.
One scripture. 2-3 sentences of teaching. Soft invitation.
CTA: "Full devotional at https://sanctuary-grace.com/"

Format:
CAPTION: [max 150 words, ends with https://sanctuary-grace.com/]
HASHTAGS: [5-8 from pool]
CANVA BRIEF: [devotional cover image brief]""",

    "silence": """Write a CIRCLE OF SILENCE invitation.
Invite the reader into 15 minutes with God. Tender, unhurried.
Link to: https://youtube.com/@TheQuietAuthority-f1z
Also: https://sanctuary-grace.com/

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

content = call_claude(prompt)

out_dir = pathlib.Path("workflows/output/instagram-pending")
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
