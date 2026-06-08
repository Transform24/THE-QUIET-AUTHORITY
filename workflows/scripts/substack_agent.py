import os, datetime, pathlib, json, urllib.request, urllib.error, time

GEMINI_API_KEY = os.environ['GEMINI_API_KEY']
SUBSTACK_SESSION_COOKIE = os.environ.get('SUBSTACK_SESSION_COOKIE', '').strip()
SUBSTACK_PUBLICATION_URL = os.environ.get('SUBSTACK_PUBLICATION_URL', '5apop2sotwm.substack.com').strip()
MODE_OVERRIDE = os.environ.get('MODE_OVERRIDE', '').strip()

today = datetime.date.today()
day_name = today.strftime('%A')
date_str = today.strftime('%Y-%m-%d')

mode = MODE_OVERRIDE if MODE_OVERRIDE else ('sunday' if day_name == 'Sunday' else 'daily')

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

Every piece: Names her burden specifically. Quotes Scripture directly.
Invites her to surrender to Christ. Opens from Luke 4:18 as the mandate.
Ends with: Come as you are. https://sanctuary-grace.com/"""

if mode == 'sunday':
    prompt = f"""{VOICE}
Today: {date_str} ({day_name})

Write the SUNDAY WEEKLY LETTER for The Quiet Authority (600-800 words).

Format:
Line 1: Title only (sacred, no exclamation marks)
Line 2: Subtitle (one tender line)
Line 3: blank
Then the full letter body.

Structure:
- Personal opening (first-person, writing to a beloved friend)
- Central teaching (3-4 paragraphs, one scripture written in full with reference)
- Reflection questions (2-3, gentle)
- Closing blessing
- Final line: Come as you are. https://sanctuary-grace.com/

No markdown symbols. No emojis. No exclamation marks."""
else:
    prompt = f"""{VOICE}
Today: {date_str} ({day_name})

Write a DAILY DEVOTION for The Quiet Authority (200-300 words).

Format:
Line 1: Title only (sacred, tender, no exclamation marks)
Line 2: blank
Then the devotion body.

Structure:
- Scripture verse written in full (Book Chapter:Verse)
- Reflection (2-3 paragraphs, first-person, tender)
- One invitation (gentle offering)
- Final line: Come as you are. https://sanctuary-grace.com/

No markdown symbols. No emojis."""

MODELS = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
]

content = None
for model in MODELS:
    gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}'
    gemini_payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')
    for attempt in range(3):
        try:
            req = urllib.request.Request(gemini_url, data=gemini_payload, headers={'Content-Type': 'application/json'}, method='POST')
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read())
                content = result['candidates'][0]['content']['parts'][0]['text'].strip()
                print(f"Devotion generated using {model}")
                break
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 10 * (attempt + 1)
                print(f"{model} rate limited — waiting {wait}s")
                time.sleep(wait)
            else:
                print(f"{model} error {e.code}")
                break
    if content:
        break

if not content:
    raise RuntimeError('All Gemini models rate limited. Try again in 60 minutes.')

lines = content.split('\n')
title = lines[0].strip()
subtitle = ''
body_start = 1
if mode == 'sunday' and len(lines) > 1:
    subtitle = lines[1].strip()
    body_start = 2

body_text = '\n'.join(lines[body_start:]).strip()
paragraphs = []
for para in body_text.split('\n\n'):
    para = para.strip()
    if para:
        paragraphs.append({"type": "paragraph", "content": [{"type": "text", "text": para}]})
if not paragraphs:
    paragraphs = [{"type": "paragraph", "content": [{"type": "text", "text": content}]}]

body_doc = json.dumps({"type": "doc", "content": paragraphs})

post_status = 'DRAFT — Awaiting Grace approval'
post_url = ''

# Approval gate: don't post directly, save for Grace to review
# Deploy script will handle posting from substack-approved/ folder

out_dir = pathlib.Path('workflows/output/substack-pending')
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / f'{date_str}.md').write_text(
    f'---\ndate: {date_str}\nmode: {mode}\nstatus: {post_status}\nurl: {post_url or "pending"}\n---\n\n{content}\n'
)

log_file = pathlib.Path('workflows/output/substack-log.md')
log_entry = f'| {date_str} | {mode} | {post_status} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + log_entry)
else:
    log_file.write_text('| Date | Mode | Status |\n|---|---|---|\n' + log_entry)

print(f'Done. Status: {post_status}')
