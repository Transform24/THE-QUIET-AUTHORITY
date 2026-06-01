import os, datetime, pathlib, json, urllib.request, urllib.error

PINTEREST_ACCESS_TOKEN = os.environ.get('PINTEREST_ACCESS_TOKEN', '').strip()
DAY_OVERRIDE = os.environ.get('DAY_OVERRIDE', '').strip()

REPO_IMAGE_BASE = 'https://transform24.github.io/THE-QUIET-AUTHORITY'

today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')
start_date = datetime.date(2026, 5, 26)

if DAY_OVERRIDE and DAY_OVERRIDE.isdigit():
    day_number = int(DAY_OVERRIDE)
else:
    day_number = ((today - start_date).days % 30) + 1

SCHEDULE = {
    1: {
        "pin": "The Guilty Giver wall art",
        "board": "The Quiet Authority",
        "image_file": "profile-C.png",
        "caption": """She gave until there was nothing left to give. Not because she was weak, but because she believed her worth was measured in what she could offer. She said yes when her body said no. She poured when the well was dry. She smiled through the silence of her own depletion.

But God did not design you to be emptied. He designed you to be filled.

The Guilty Giver is one of four spiritual profiles in The Quiet Authority — a free assessment created for women who are tired of carrying more than they were called to carry. If you have ever felt that your rest was selfish, that your needs were inconvenient, that your exhaustion was a spiritual failure — this is for you.

You were not made to pour from empty. You were made to receive.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #ChristianMom"""
    },
    2: {
        "pin": "Sacred aesthetic",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """There is a stillness that heals what striving never could.

Not the stillness of an empty calendar or a cleared inbox. Not the quiet of a world that has finally stopped demanding. But the stillness that meets you in the middle of the noise — the kind that rises from somewhere deeper than circumstance.

This is what God offers the woman who is tired of running. Not a solution to every problem. Not a rescue from every responsibility. But a presence that holds her while everything continues to move.

If you have been waiting until things settle down to finally rest — the invitation is here now. In this moment. Before the day begins.

The Quiet Authority was created for women who are ready to stop waiting and begin returning to themselves.

https://sanctuarygrace.store

#SpiritualRest #QuietTime #ChristianWomen #FaithJourney #SacredSpace"""
    },
    3: {
        "pin": "The Depleted Survivor wall art",
        "board": "The Quiet Authority",
        "image_file": "profile-B.png",
        "caption": """She survived things she never speaks about. She rebuilt herself more than once, quietly, without applause. She learned to function in crisis because crisis became familiar. And somewhere along the way, surviving became her identity — and rest became something she did not know how to trust.

The Depleted Survivor carries wounds that look like strength from the outside. She keeps moving because stopping feels dangerous. She plans for the worst because hope has disappointed her before.

But survival was never meant to be a permanent address.

The Quiet Authority is a free spiritual profile assessment for women who are ready to move from surviving into something deeper. If this is you, the door is open.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #HopeForWomen #FaithAndWellness #SanctuaryGrace"""
    },
    4: {
        "pin": "Scripture — Matthew 11:28",
        "board": "Christian Women Encouragement",
        "image_file": None,
        "caption": """Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28

He did not say come when you have rested enough. He did not say come when you have finished everything on your list. He did not say come when you have figured out how to be less tired.

He said come as you are. Weary. Burdened. Exactly as you are right now.

This is not a call to perform rest correctly. It is an invitation to stop performing entirely and simply receive what you cannot manufacture for yourself.

If you are weary today, this word is for you. You do not have to earn what He has already offered.

https://sanctuarygrace.store

#ScriptureForWomen #ChristianWomen #FaithJourney #QuietTime #DailyDevotion"""
    },
    5: {
        "pin": "The Striving Achiever wall art",
        "board": "The Quiet Authority",
        "image_file": "profile-A.png",
        "caption": """She sets the alarm early. She finishes what others abandon. She believes that faithfulness looks like productivity and that rest must be earned before it can be received.

She is not lazy. She is not faithless. She is exhausted in a way that no amount of accomplishment seems to fix.

The Striving Achiever has confused doing with being. Her identity lives in her output. And when she slows down, the silence feels like failure.

But God is not measuring your productivity. He is calling you by name — not by your achievements.

The Quiet Authority is a free spiritual assessment for women who are ready to rest without guilt. If you recognize yourself here, begin at the link below.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #ScriptureForWomen"""
    },
    6: {
        "pin": "Devotional Week 1 Vision",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """Before the clarity comes, there is the quiet.

Week One of The Quiet Authority devotional series is called Vision — not because you will suddenly see everything clearly, but because you will begin to see yourself the way God has always seen you. Whole. Beloved. Not behind.

This devotional was written for the woman who has lost sight of who she is beneath everything she does. It is gentle. It is honest. It moves at the pace of the soul, not the schedule.

Five days of scripture, reflection, and invitation. Designed for the morning, before the demands begin. Yours for $4.99.

If you are ready to begin returning to yourself, this is a gentle place to start.

https://sanctuarygrace.store

#DailyDevotion #ChristianWomen #SacredSpace #FaithJourney #SpiritualRest"""
    },
    7: {
        "pin": "The Lost Wanderer wall art",
        "board": "The Quiet Authority",
        "image_file": "profile-D.png",
        "caption": """She used to know who she was. She had a sense of direction, a sense of self, a sense that God was near and she was moving toward something meaningful.

And then, somewhere between the seasons of life, she lost the thread.

The Lost Wanderer is not faithless. She is disoriented. She has not walked away from God — she simply cannot find her footing. She questions her calling, her purpose, her belonging. She wonders if she has been forgotten.

She has not been.

The Quiet Authority is a free spiritual profile assessment for women who are ready to find their way back to themselves and to the One who has never stopped calling their name.

https://sanctuarygrace.store

#ChristianWomen #FaithJourney #HopeForWomen #SpiritualRest #SanctuaryGrace"""
    },
    8: {
        "pin": "Which type are you",
        "board": "Spiritual Rest for Women",
        "image_file": None,
        "caption": """Four women. Four wounds. One invitation.

The Striving Achiever — she cannot stop moving, even when her body is asking her to.
The Depleted Survivor — she has rebuilt herself so many times she has forgotten her original shape.
The Guilty Giver — she says yes to everyone and no to herself, and calls it faithfulness.
The Lost Wanderer — she is searching for the thread back to who she was before life changed her.

One of these is you. You already know which one.

The Quiet Authority is a free 8-question spiritual assessment that identifies your profile and opens a path designed for where you are — not where you think you should be.

Begin at the link below. It takes 8 minutes. What it opens may take your breath away.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #SpiritualRest #HopeForWomen"""
    },
    9: {
        "pin": "Scripture and Guilty Giver quote",
        "board": "Christian Women Encouragement",
        "image_file": None,
        "caption": """She learned to call her depletion devotion. She gave until the giving felt like worship, and the exhaustion felt like proof that she was doing enough. But somewhere in the quiet, God began to ask a different question.

Not how much have you given. But have you let me give to you.

The Guilty Giver believes that receiving is selfish. That rest is earned. That her value lives in her willingness to sacrifice. But the Gospel was not built on your sacrifice — it was built on His. You are invited to receive, not to endlessly give.

If this is your story, the assessment at The Quiet Authority was built for this moment.

https://sanctuarygrace.store

#ScriptureForWomen #ChristianWomen #SpiritualBurnout #FaithAndWellness #ChristianMom"""
    },
    10: {
        "pin": "Devotional Week 2 Renewal",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """Renewal does not always look like transformation. Sometimes it looks like one morning of honesty. One day of staying. One quiet moment of letting God see what you have been hiding.

Week Two of The Quiet Authority devotional series is called Renewal — five days of scripture and reflection designed to meet the woman who is too tired to pretend any longer.

This is not a self-improvement plan. It is an invitation to be renewed from the inside, at a pace your soul can bear. Written for the woman who has been waiting for permission to stop holding everything together.

Yours for $4.99. A gentle companion for the morning before everything begins.

https://sanctuarygrace.store

#DailyDevotion #ChristianWomen #SacredSpace #SpiritualRest #FaithJourney"""
    },
    11: {
        "pin": "Re-pin Guilty Giver wall art",
        "board": "Spiritual Rest for Women",
        "image_file": "profile-C.png",
        "caption": """She gave until there was nothing left to give. And she called it faithfulness.

But faithfulness was never meant to cost you yourself. The woman who pours from empty is not more devoted — she is more depleted. And depletion is not a spiritual virtue.

The Guilty Giver is one of four profiles in The Quiet Authority — a free spiritual assessment for women who are tired of the weight they were never meant to carry alone.

If you have been confusing exhaustion with consecration, this is the invitation you have been waiting for.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #FaithAndWellness #SanctuaryGrace #HopeForWomen"""
    },
    12: {
        "pin": "The assessment is free",
        "board": "The Quiet Authority",
        "image_file": None,
        "caption": """The assessment is free. The stillness it opens is real.

Eight questions. Eight minutes. A result that names what you have been carrying and offers a path designed for exactly where you are.

The Quiet Authority was created for the woman who knows something is wrong but cannot find the words for it. The woman who is doing everything right and still feels like she is falling behind. The woman who loves God and is exhausted by that love in a way she cannot explain to anyone.

You do not have to figure this out alone. Begin at the link below. It costs nothing but a few minutes of honesty.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #QuietTime"""
    },
    13: {
        "pin": "You were not made to pour from empty",
        "board": "Christian Women Encouragement",
        "image_file": None,
        "caption": """You were not made to pour from empty. You were not made to carry what was never assigned to you. You were not made to perform wellness while suffering in silence.

You were made to be held, to be filled, to be known by the One who formed you before you learned to be useful.

Rest is not a reward for productivity. It is a design feature of the human soul. And when we ignore it long enough, the soul begins to speak in symptoms — exhaustion, detachment, a quiet grief that has no name.

If any of this is familiar, The Quiet Authority was built for this moment. A free assessment, a gentle path, an invitation to return.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #HopeForWomen #FaithJourney #DailyDevotion"""
    },
    14: {
        "pin": "Circle of Silence",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """Fifteen minutes. Just you and God.

No agenda. No performance. No words required.

The Circle of Silence is a guided stillness practice offered through The Quiet Authority — a space created for women who have forgotten what it feels like to simply be present without producing anything.

Five minutes of music to quiet the mind. Ten minutes of silence to let God speak in the way He speaks best — not in the noise, but in the still small voice that waits beneath it.

You do not have to be good at silence to begin. You only have to be willing.

Join us at the link below. The door is open, and the pace is yours.

https://sanctuarygrace.store

#SacredSpace #ChristianWomen #QuietTime #SpiritualRest #FaithAndWellness"""
    },
    15: {
        "pin": "Start here",
        "board": "Spiritual Rest for Women",
        "image_file": None,
        "caption": """If you are new here, begin with the assessment.

The Quiet Authority is a free spiritual profile experience for women who are carrying more than they were called to carry. Eight questions. Eight minutes. A result that names your pattern and opens a path designed for where you are right now.

Four profiles. One for each kind of tired.

The Striving Achiever. The Depleted Survivor. The Guilty Giver. The Lost Wanderer.

You already know something is off. You have known it for a while. The assessment simply gives it a name and offers you a direction.

Begin at the link below. It is free. It is gentle. And it may be the most honest eight minutes you have spent in a long time.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #HopeForWomen #SanctuaryGrace"""
    },
    16: {
        "pin": "Devotional Week 3 Peace",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """Peace is not the absence of difficulty. It is the presence of God inside it.

Week Three of The Quiet Authority devotional series is called Peace — five days of scripture and gentle reflection for the woman who has been searching for quiet in all the wrong places.

This devotional does not promise that your circumstances will change. It promises that you will be met inside them. That the stillness you have been chasing exists and it is closer than you think.

Five days. One scripture per day. One honest reflection. One invitation to receive what you cannot manufacture.

Yours for $4.99. A companion for the morning before the day begins.

https://sanctuarygrace.store

#DailyDevotion #ChristianWomen #SpiritualRest #FaithJourney #SacredSpace"""
    },
    17: {
        "pin": "Re-pin Guilty Giver wall art",
        "board": "Christian Women Encouragement",
        "image_file": "profile-C.png",
        "caption": """To the woman who has never stopped giving long enough to ask what she needs — this is for you.

Your generosity is beautiful. But it was never meant to cost you your own soul.

The Guilty Giver gives from a place of fear — fear that if she stops, she will be found unworthy. Fear that her value lives in her usefulness. Fear that God, too, will be disappointed if she finally rests.

But the Father is not waiting for your next act of service. He is waiting for you to sit down.

The Quiet Authority is a free spiritual assessment that identifies your pattern and opens a path toward something gentler. Begin at the link below.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #ChristianMom #FaithAndWellness #HopeForWomen"""
    },
    18: {
        "pin": "Quote from Guilty Giver profile",
        "board": "The Quiet Authority",
        "image_file": None,
        "caption": """She did not know how to receive. Every gift felt like a debt. Every act of kindness toward her required immediate repayment. She had been taught, somewhere along the way, that needing was weakness and that the godly woman was always the one giving.

So she gave. And gave. And gave.

Until the day she could not remember who she was when she was not being useful to someone else.

If this is your story, you are not alone. The Quiet Authority was created for the woman who has given so much of herself away that she can no longer find where she begins.

The assessment is free. The path it opens is real. Begin at the link below.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #FaithJourney #SanctuaryGrace #DailyDevotion"""
    },
    19: {
        "pin": "R.E.S.T. Workbook",
        "board": "Spiritual Rest for Women",
        "image_file": None,
        "caption": """Free. No catch. Just a path forward.

The R.E.S.T. Workbook was created for the woman who is ready to do the quiet work of returning to herself. R.E.S.T. stands for Recognize the Lie. Embrace the Pause. See Your True Shape. Trust the Authority.

Four movements. Each one designed to gently loosen what has been held too tightly for too long.

This is not a productivity system. It is not a 30-day transformation plan. It is a companion for the woman who is willing to move slowly in a direction that actually matters.

Download it free at Sanctuary Grace. No email required. No strings attached. Just an offering.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #FaithAndWellness #SanctuaryGrace #HopeForWomen"""
    },
    20: {
        "pin": "Your exhaustion is not failure",
        "board": "Christian Women Encouragement",
        "image_file": None,
        "caption": """Your exhaustion is not failure. It is an invitation.

An invitation to stop. To be honest. To let someone hold what you have been carrying alone for longer than you should have.

Exhaustion is the soul's way of telling you something true. Not that you are weak. Not that you are faithless. But that you have been running on a fuel that was never designed to sustain you.

The woman who is tired of being tired is not beyond help. She is right at the beginning of something.

The Quiet Authority is a free spiritual profile assessment created for this exact moment. Eight questions. A result that meets you where you are. A path designed for where you need to go.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #HopeForWomen #FaithJourney #ScriptureForWomen"""
    },
    21: {
        "pin": "Devotional Week 4 Calling",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """You were called before you were qualified. You were chosen before you were ready. And the calling on your life has not expired because you have been too depleted to pursue it.

Week Four of The Quiet Authority devotional series is called Calling — five days of scripture and reflection for the woman who is ready to ask the question she has been afraid to ask. What was I made for, and am I still allowed to pursue it.

The answer is yes. It has always been yes.

This devotional is a gentle guide back to the thread of purpose that has been waiting for you all along. Yours for $4.99.

https://sanctuarygrace.store

#DailyDevotion #ChristianWomen #FaithJourney #SacredSpace #SpiritualRest"""
    },
    22: {
        "pin": "Re-pin top performer Week 1",
        "board": "Spiritual Rest for Women",
        "image_file": "profile-C.png",
        "caption": """She gave until there was nothing left to give. And she called it faithfulness.

But faithfulness was never meant to cost you yourself. The Guilty Giver is one of four spiritual profiles in The Quiet Authority — and if this is you, the assessment was built for this moment.

Free. Eight minutes. A path designed for exactly where you are.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #SanctuaryGrace #FaithAndWellness #HopeForWomen"""
    },
    23: {
        "pin": "Re-pin top performer Week 2",
        "board": "Christian Women Encouragement",
        "image_file": "profile-B.png",
        "caption": """She survived things she never speaks about. She rebuilt herself more than once. And somewhere along the way, surviving became her identity.

But survival was never meant to be a permanent address.

The Depleted Survivor is one of four spiritual profiles in The Quiet Authority. If you recognize yourself in this, the door is open. Free assessment. A gentle path forward.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #HopeForWomen #FaithJourney #SanctuaryGrace"""
    },
    24: {
        "pin": "Re-pin top performer",
        "board": "Sacred Morning Practices",
        "image_file": "profile-A.png",
        "caption": """She sets the alarm early. She finishes what others abandon. She believes that rest must be earned before it can be received.

The Striving Achiever has confused doing with being. And no amount of accomplishment seems to fill what is actually empty.

The Quiet Authority is a free spiritual assessment for women who are ready to rest without guilt. Begin at the link below.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #FaithAndWellness #SacredSpace #SanctuaryGrace"""
    },
    25: {
        "pin": "Brand story",
        "board": "Spiritual Rest for Women",
        "image_file": None,
        "caption": """I built The Quiet Authority because I needed it.

I was the woman who had all the right answers and none of the rest. Who served faithfully and quietly fell apart. Who kept showing up because stopping felt like failure, and failure felt like a verdict on my faith.

I did not find healing in a program or a plan. I found it in the slow, honest work of learning who I was when I was not being useful to anyone.

The Quiet Authority is an invitation to that same work. A free spiritual profile assessment, devotionals, and a community being built for women who are done pretending they are fine.

If any part of this story sounds familiar, the door is open. Begin at the link below.

https://sanctuarygrace.store

#ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #HopeForWomen"""
    },
    26: {
        "pin": "Re-pin Guilty Giver wall art",
        "board": "The Quiet Authority",
        "image_file": "profile-C.png",
        "caption": """To the woman who has forgotten that she is allowed to have needs — this image was made for you.

The Guilty Giver gives from fear and calls it love. She exhausts herself in service and wonders why she feels so far from God. She does not realize that the distance she feels is not abandonment. It is depletion.

You cannot love from empty. You cannot serve from a place of hidden resentment and call it grace. The invitation is to be filled before you pour.

Begin the free assessment at The Quiet Authority. Eight questions. A path designed for the woman who has been giving herself away.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #ChristianMom #FaithJourney #SanctuaryGrace"""
    },
    27: {
        "pin": "Devotional bundle",
        "board": "The Quiet Authority",
        "image_file": None,
        "caption": """Four weeks. Four movements. One direction.

The complete Quiet Authority devotional series — Vision, Renewal, Peace, and Calling — was written for the woman who is ready to move through her exhaustion toward something real. Not quickly. Not perfectly. But honestly.

Week One opens your eyes to who you are.
Week Two loosens what has been held too tightly.
Week Three invites you into the quiet.
Week Four calls you back to purpose.

All four weeks together for $19.96. A companion for the season ahead, written in the voice of a minister who has walked this path and knows it is possible to come through.

https://sanctuarygrace.store

#DailyDevotion #ChristianWomen #FaithJourney #SpiritualRest #SanctuaryGrace"""
    },
    28: {
        "pin": "Circle of Silence waitlist",
        "board": "Sacred Morning Practices",
        "image_file": None,
        "caption": """The Circle of Silence is a community being built for women who are done doing this alone.

Not a program. Not a course. A circle. A gathering of women who have chosen, together, to practice stillness, to speak honestly, and to hold one another in the quiet work of returning to themselves.

Monthly gatherings. Guided silence. Sacred conversation. A space where you do not have to perform wellness or explain your exhaustion.

The waitlist is open. There is no pressure and no deadline. Only an open door for the woman who is ready to stop being strong alone.

Add your name at the link below. The circle is forming.

https://sanctuarygrace.store

#ChristianWomen #SacredSpace #SpiritualRest #FaithAndWellness #SanctuaryGrace"""
    },
    29: {
        "pin": "Scripture from 7-day practice",
        "board": "Christian Women Encouragement",
        "image_file": None,
        "caption": """The Lord is my shepherd. I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. — Psalm 23:1-3

He makes me lie down. Not suggests. Not invites. Makes.

Because sometimes the soul that has been running will not stop on its own. It has to be led. It has to be brought, gently, to the place it has been avoiding. The still water. The green pasture. The restoration it told itself it did not have time for.

If you have been running, this word is a hand on your shoulder. A quiet voice. A direction.

Lie down. The Shepherd is here.

https://sanctuarygrace.store

#ScriptureForWomen #ChristianWomen #QuietTime #DailyDevotion #FaithJourney"""
    },
    30: {
        "pin": "Month 2 preview",
        "board": "The Quiet Authority",
        "image_file": None,
        "caption": """A month of returning. And it is only the beginning.

Thirty days of sacred content for the woman who is tired of being tired. Wall art that speaks the truth about who she is. Scripture that meets her before the day begins. Devotionals that move at the pace of the soul. A community forming in the quiet.

Month Two begins soon. The same voice. The same invitation. Deeper into the work of becoming who you were always meant to be before the world taught you to be useful instead.

If The Quiet Authority has been part of your morning this month, thank you for being here. The door remains open. The work continues.

https://sanctuarygrace.store

#ChristianWomen #SpiritualRest #FaithAndWellness #SanctuaryGrace #FaithJourney"""
    },
}

pin_data = SCHEDULE.get(day_number, SCHEDULE[1])
caption = pin_data['caption'].strip()

print(f"Day {day_number}: {pin_data['pin']}")

post_status = 'DRAFT'

def get_board_id(token, board_name):
    try:
        req = urllib.request.Request(
            'https://api.pinterest.com/v5/boards?page_size=100',
            headers={'Authorization': f'Bearer {token}'}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            for board in data.get('items', []):
                if board['name'].lower().strip() == board_name.lower().strip():
                    return board['id']
    except Exception as e:
        print(f"Board lookup error: {e}")
    return None

if PINTEREST_ACCESS_TOKEN:
    image_file = pin_data.get('image_file')
    if image_file:
        image_url = f"{REPO_IMAGE_BASE}/{image_file}"
        board_id = get_board_id(PINTEREST_ACCESS_TOKEN, pin_data['board'])
        if board_id:
            payload = json.dumps({
                "board_id": board_id,
                "media_source": {"source_type": "image_url", "url": image_url},
                "title": pin_data['pin'][:100],
                "description": caption[:500],
                "link": "https://sanctuarygrace.store"
            }).encode('utf-8')
            try:
                post_req = urllib.request.Request(
                    'https://api.pinterest.com/v5/pins',
                    data=payload,
                    headers={
                        'Authorization': f'Bearer {PINTEREST_ACCESS_TOKEN}',
                        'Content-Type': 'application/json'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(post_req, timeout=30) as resp:
                    result = json.loads(resp.read())
                    pin_id = result.get('id')
                    post_status = f'POSTED — pin_id: {pin_id}'
                    print(f"Posted to Pinterest: {pin_id}")
            except urllib.error.HTTPError as e:
                error_body = e.read().decode()
                post_status = f'API ERROR {e.code}: {error_body[:300]}'
                print(f"Pinterest error {e.code}: {error_body}")
            except Exception as e:
                post_status = f'ERROR: {str(e)[:200]}'
        else:
            post_status = f'DRAFT — board not found: {pin_data["board"]}'
    else:
        post_status = 'DRAFT — Canva image required for this day.'
else:
    post_status = 'DRAFT — PINTEREST_ACCESS_TOKEN not set'

out_dir = pathlib.Path('workflows/output/pin-drafts')
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / f'{date_str}.md').write_text(
    f'---\ndate: {date_str}\npinterest_day: {day_number}\npin: {pin_data["pin"]}\nboard: {pin_data["board"]}\nstatus: {post_status}\n---\n\n{caption}\n'
)

log_file = pathlib.Path('workflows/output/pin-log.md')
log_entry = f'| {date_str} | Day {day_number} | {pin_data["pin"]} | {pin_data["board"]} | {post_status} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + log_entry)
else:
    log_file.write_text('| Date | Day | Pin | Board | Status |\n|---|---|---|---|---|\n' + log_entry)

print(f'Done. Status: {post_status}')
