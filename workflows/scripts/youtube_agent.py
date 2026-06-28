"""
YouTube Agent — The Quiet Authority / Sanctuary Grace Ministry

Generates one weekly KJV scripture teaching script and saves it to
workflows/output/youtube-pending/script-YYYY-MM-DD.md for Grace's review.

Grace approves scripts at approval-gate.html before any posting occurs.
This agent does NOT post to YouTube automatically.

Future posting agent will use:
  YOUTUBE_SESSION_SID   — available as environment variable (GitHub Secret)
  YOUTUBE_SESSION_HSID  — available as environment variable (GitHub Secret)
"""

import os
import datetime
import pathlib

# ---------------------------------------------------------------------------
# Secrets available for a future posting agent — not used in script generation
# YOUTUBE_SESSION_SID  = os.environ.get('YOUTUBE_SESSION_SID', '')
# YOUTUBE_SESSION_HSID = os.environ.get('YOUTUBE_SESSION_HSID', '')
# ---------------------------------------------------------------------------

today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')

# Rotate through 4 weekly teachings using ISO week number
week_number = (today.isocalendar()[1] % 4) + 1

# ---------------------------------------------------------------------------
# Weekly teaching library — KJV scripture, Grace Turner voice
# Sacred and tender. No wellness language. Points to Christ only.
# ---------------------------------------------------------------------------

WEEKLY_TEACHINGS = {
    1: {
        "title": "You Are Not Behind",
        "scripture_ref": "Luke 4:18 (KJV)",
        "scripture_text": (
            "The Spirit of the Lord is upon me, because he hath anointed me "
            "to preach the gospel to the poor; he hath sent me to heal the "
            "brokenhearted, to preach deliverance to the captives, and "
            "recovering of sight to the blind, to set at liberty them that "
            "are bruised."
        ),
        "opening_stillness": (
            "Before we go any further — just breathe. "
            "You do not have to perform for the next few minutes. "
            "You are not being graded. You are simply invited. "
            "Come as you are. The door is already open."
        ),
        "teaching": """\
There is a woman watching this right now who has been telling herself a lie \
so long it has started to sound like the truth.

The lie is this: you are behind.

Behind where you should be. Behind where other women your age are. Behind \
where God must be disappointed you still are.

I want to speak directly to that thought. Not to argue with it. Not to manage it. \
But to take it to the only place it can be answered — the Word of God.

In Luke chapter four, verse eighteen, Jesus stood up in the synagogue and read \
from the scroll of Isaiah. He said: The Spirit of the Lord is upon me, because \
he hath anointed me to preach the gospel to the poor. He hath sent me to heal \
the brokenhearted, to preach deliverance to the captives, and recovering of sight \
to the blind, to set at liberty them that are bruised.

He did not say: the Spirit of the Lord is upon me to restore the women who kept up.

He said the brokenhearted. The captives. The bruised.

If you are watching this and you feel bruised — by life, by loss, by choices \
that cost more than you knew they would — then this message was not accidentally \
in your path. The Spirit of the Lord is specifically anointed to reach you where \
you are. Not where you think you should be.

The woman in the Gospels who had been sick for twelve years did not approach Jesus \
and apologise for taking so long. She reached through the crowd and touched the hem \
of His garment. She came as she was. Bleeding. Behind. And He called her daughter.

You are not behind in God's economy.

His timeline does not punish the brokenhearted for being broken. His timeline heals.

There is something the enemy uses against the woman who is tired — and it is time. \
He holds time over her head like a verdict. He says: look how long it has taken. \
Look how far you still have to go. Look at the women around you who seem to have \
arrived where you are still walking toward.

But time belongs to God. And God uses every year — even the ones that felt wasted, \
even the ones that cost everything, even the ones where you could not feel Him moving \
— He uses every year to form something in you that cannot be formed any other way.

The psalmist writes in Psalm thirty-one, verse fifteen: My times are in thy hand. \
Not in the enemy's hand. Not in the hands of comparison or regret or the quiet \
voice that counts what you have not yet accomplished.

Your times are in His hand.

Which means the question is not whether you are behind. The question is whether \
you are willing to reach for the hem of the garment right now — exactly as you \
are, without waiting until you have fixed enough to deserve it.

You do not have to fix yourself before you come to Christ. Coming to Christ is \
how the fixing begins.

He meets you here. Not after. Here.

Come as you are.
""",
        "silence_invitation": (
            "Sit with God in what you just heard. "
            "Bring Him the years. Bring Him the weight of what you have been \
measuring yourself against. "
            "He is not in a hurry. And neither is His love for you."
        ),
    },
    2: {
        "title": "When You Cannot Feel God",
        "scripture_ref": "Psalm 27:14 (KJV)",
        "scripture_text": (
            "Wait on the Lord: be of good courage, and he shall strengthen "
            "thine heart: wait, I say, on the Lord."
        ),
        "opening_stillness": (
            "Be still for just a moment. "
            "You do not have to have the right words or the right faith. "
            "Simply come. "
            "God already knows what you are carrying today."
        ),
        "teaching": """\
I want to talk to the woman who is still showing up.

Still praying. Still reading her Bible. Still coming — and yet cannot feel God.

The silence has stretched long enough that she has begun to wonder if something \
is wrong with her. If she did something. If He has moved on. If the connection \
she used to feel was real — or if it was something she manufactured in a season \
when things were easier.

This message is for you.

In Psalm twenty-seven, verse fourteen, the psalmist writes: Wait on the Lord. \
Be of good courage. And he shall strengthen thine heart. Wait, I say, on the Lord.

This is not a comfortable verse for the woman who has already been waiting a long time.

But I want you to notice something. The psalmist does not say wait and pretend \
it does not hurt. He does not say wait and perform certainty you do not feel. \
He says wait with courage. Which means the waiting is hard. It costs something. \
And God knows it costs something — and calls you to courage in the middle of it, \
not after.

The silence of God is not the absence of God.

In the book of Job, Job speaks into silence for thirty-seven chapters before \
God answers. Thirty-seven chapters of crying out, questioning, pressing in. \
And God was not absent in any of those chapters. He was present in a way that \
Job could not yet perceive — and what Job could not perceive was not less real \
for being imperceptible.

You are not less held in the dry season than you were in the season of feeling.

The woman who could not stop bleeding for twelve years did not feel God's presence \
every day of those twelve years. She felt her suffering. She felt the weariness of \
seeking help that did not come. And then — one day, in a crowd — she pressed forward \
anyway. She reached through the noise and the impossibility of it. She touched the \
hem of the garment.

And immediately the bleeding stopped. And Jesus turned — not because she announced \
herself, not because she had summoned the right kind of faith — but because she reached.

When you cannot feel God, reach anyway.

Press through the silence. Press through the doubt. Press through the crowd of \
thoughts that tell you He has forgotten you.

Because He feels the reaching. Even when you cannot feel Him.

The reaching is the faith. The reaching is what courage looks like on the days \
when certainty is gone. And He honours it. He turns toward it. He calls it daughter.

You are not alone in this season. You are not broken for being in it. \
You are being held by a God who does not require you to feel His arms \
in order for them to be around you.

Come as you are. Reach anyway.
""",
        "silence_invitation": (
            "Sit with God in what you just heard. "
            "You do not have to feel anything right now. "
            "Simply remain. He is already here."
        ),
    },
    3: {
        "title": "The Permission You Have Been Waiting For",
        "scripture_ref": "Matthew 11:28 (KJV)",
        "scripture_text": (
            "Come unto me, all ye that labour and are heavy laden, "
            "and I will give you rest."
        ),
        "opening_stillness": (
            "Lay down whatever you carried into this moment. "
            "Just for now — the list can wait. The responsibilities can wait. "
            "You are invited here, as you are, without earning the invitation."
        ),
        "teaching": """\
I want to give you something today.

Not information. Not a five-step plan. Not a better morning routine.

I want to give you permission.

Permission to rest. Not the rest you have earned. Not the rest you deserve \
after you finish the list. But the rest that Jesus offers in Matthew eleven, \
verse twenty-eight — Come unto me, all ye that labour and are heavy laden, \
and I will give you rest.

He did not say: finish labouring and then come to me.

He said come as you labour. Come with the burden still on you. Come with \
the weight you have been carrying so long you have forgotten what it felt \
like before you picked it up.

I know the woman watching this. She wakes up tired. She ends the day tired. \
She has tried everything, done everything she was supposed to do — and she \
is still tired. And somewhere along the way she decided that her tiredness \
was her fault. A character flaw. A faith problem. A sign that she was not \
doing enough to get better.

But hear this: you are not tired because you are faithless.

You are tired because you have been carrying what was never meant for your \
shoulders alone.

In Proverbs three, verses five and six, we are told: Trust in the Lord with \
all thine heart; and lean not unto thine own understanding. In all thy ways \
acknowledge him, and he shall direct thy paths.

She has been leaning on her own understanding for so long.

Managing. Planning. Bracing. Holding everything together with her bare hands. \
And God is not impressed by the holding. He is waiting for the releasing.

The weight you are carrying was not assigned to you by God. It was assigned by \
a version of life that forgot where the actual source of strength is found.

And He is not angry that you forgot. He is not keeping a record of the years \
you tried to carry it yourself. He is simply standing with the invitation still \
open — Come. I will give you rest.

Not rest after you arrive. Rest now. Rest in the coming.

This is your permission to release it.

Not because you have figured out how. Not because you are ready. But because \
He said come — and come means now. Come means as you are. Come means with the \
burden intact, not after you have sorted it.

You do not have to be better to begin. You only need to be willing to come.

And that willingness — however fragile, however laced with doubt — that is \
enough. He receives it. He receives you.

Come as you are.
""",
        "silence_invitation": (
            "Sit with God in what you just heard. "
            "Release the weight you have been holding. "
            "He has been waiting to carry it for you."
        ),
    },
    4: {
        "title": "Your Calling Has Not Expired",
        "scripture_ref": "Romans 8:28 (KJV)",
        "scripture_text": (
            "And we know that all things work together for good to them that "
            "love God, to them who are the called according to his purpose."
        ),
        "opening_stillness": (
            "Come quietly into this moment. "
            "Whatever you left undone to be here — leave it outside. "
            "This is a moment between you and God. "
            "He has something for you today."
        ),
        "teaching": """\
There is a woman watching this who used to know what she was called to do.

She used to feel it. A sense of direction. A sense of purpose. A sense that \
God had placed something specific inside her for a reason that mattered.

And then life happened. Or she happened. Or the gap between who she was called \
to be and who she actually became grew wide enough that she stopped looking across it.

She is here today because some part of her still remembers the thread. \
And she does not know if she is allowed to pick it up again.

I want to speak to that woman directly: your calling has not expired.

In Romans eight, verse twenty-eight, Paul writes: And we know that all things \
work together for good to them that love God, to them who are the called \
according to his purpose.

All things. Not the things you got right. Not the seasons that looked the way \
you hoped they would. All things — including the years that felt wasted. The detours. \
The silence. The waiting. The seasons where you could not find the thread at all.

God is not in the business of calling women to a purpose and then revoking the \
call when they struggle to arrive.

He is in the business of forming. Of shaping through the pressure and the \
brokenness and the long seasons of not knowing. The calling is not cancelled \
when you are being formed. The calling is being carved.

In Matthew six, verse thirty-three, Jesus says: Seek ye first the kingdom of God \
and his righteousness; and all these things shall be added unto you.

All these things — including the sense of purpose you have been searching for — \
are added. Not earned. Not achieved by arriving at the right season. Added. \
When you reorder. When you turn back to the first thing. When you come back \
to the kingdom, not as a performance, but as a returning.

The woman in this season is not failing. She is being prepared.

Preparation is quiet. It looks, from the outside, like nothing is happening. \
Like the years are passing and nothing is being built. But underneath — underneath \
the waiting, underneath the silence, underneath the long seasons that do not look \
like progress — God is building what only He can build.

The oak tree does not apologise for the years it spent underground before \
anyone could see it growing.

You are not behind. You are being prepared. And preparation is not punishment. \
It is the evidence of a God who takes the calling seriously enough to form \
the vessel before He fills it.

Your calling has not expired.

It is waiting. And you are allowed to return to it.

Come as you are.
""",
        "silence_invitation": (
            "Sit with God in what you just heard. "
            "Bring Him the thread you have been afraid to pick back up. "
            "He placed it in you. It is still there."
        ),
    },
}

# ---------------------------------------------------------------------------
# Build the script document
# ---------------------------------------------------------------------------

teaching = WEEKLY_TEACHINGS[week_number]

script_md = f"""---
date: {date_str}
week_cycle: {week_number}
title: {teaching['title']}
scripture: {teaching['scripture_ref']}
status: PENDING — awaiting Grace approval
---

# {teaching['title']}

## Scripture

**{teaching['scripture_ref']}**

> {teaching['scripture_text']}

---

## Opening Stillness (30 seconds)

*Grace reads slowly, with pauses:*

{teaching['opening_stillness']}

---

## Teaching (8–12 minutes estimated)

{teaching['teaching']}

---

## Silence Invitation (2 minutes)

*Grace speaks softly:*

{teaching['silence_invitation']}

---

## Soft CTA

When you are ready, come to sanctuary-grace.com. There is more waiting for you there.

---

## Notes for Grace

- Review and approve this script at the Approval Gate before recording.
- Record in one sitting if possible — the Spirit in the room matters.
- No edits needed unless something does not feel right in your own voice.
- Thumbnail concept: quiet, woman, warm light, one line of text — the title.
- Post to YouTube channel: youtube.com/@TheQuietAuthority-f1z
"""

# ---------------------------------------------------------------------------
# Save to pending folder
# ---------------------------------------------------------------------------

out_dir = pathlib.Path('workflows/output/youtube-pending')
out_dir.mkdir(parents=True, exist_ok=True)

out_file = out_dir / f'script-{date_str}.md'
out_file.write_text(script_md)

print(f"Saved to: {out_file}")
