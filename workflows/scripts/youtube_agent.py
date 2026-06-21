import os, datetime, pathlib

today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')
week_start = today - datetime.timedelta(days=today.weekday())
week_end = week_start + datetime.timedelta(days=6)
week_date_str = f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}"

# Cycle through 4 weeks using week number
week_number = (today.isocalendar()[1] % 4) + 1

WEEKLY_SCRIPTS = {
    1: {
        "title": "You Are Not Behind",
        "script": """## SCRIPT TITLE
You Are Not Behind

## FULL SCRIPT

There is a woman watching this right now who has been telling herself a lie so long it has started to sound like the truth.

The lie is this: you are behind.

Behind where you should be. Behind where other women your age are. Behind where God must be disappointed you still are.

I want to speak directly to that thought. Not to argue with it. Not to manage it. But to take it to the only place it can be answered: the Word of God.

In Luke chapter four, verse eighteen, Jesus stood up in the synagogue and read from the scroll of Isaiah. He said: The Spirit of the Lord is upon me, because he hath anointed me to preach the gospel to the poor. He hath sent me to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised.

He did not say: the Spirit of the Lord is upon me to restore the women who kept up.

He said: the brokenhearted. The captives. The bruised.

If you are watching this and you feel bruised — by life, by loss, by choices that cost more than you knew they would — then this message was not accidentally in your feed. The Spirit of the Lord is specifically anointed to reach you where you are. Not where you think you should be.

The woman in the Gospels who had been sick for twelve years — twelve years — did not approach Jesus and apologize for taking so long. She reached through the crowd and touched the hem of his garment. She came as she was. Bleeding. Behind. And He called her daughter.

You are not behind in God's economy.

His timeline does not punish the brokenhearted for being broken. His timeline heals.

The question is not whether you are behind. The question is whether you are willing to reach for the hem of the garment right now, exactly as you are, without waiting until you have fixed enough to deserve it.

You do not have to fix yourself before you come to Christ. Coming to Christ is how the fixing begins.

Come as you are. https://sanctuarygrace.store

## SEO DESCRIPTION

Are you carrying the weight of feeling behind in life? This teaching from The Quiet Authority ministry speaks directly to the woman who has been exhausted by the belief that she is behind where she should be — spiritually, financially, personally.

Rooted in Luke 4:18 and the healing ministry of Jesus, this message names the lie and brings it to the only place it can be answered: the Word of God.

The Quiet Authority exists for burned-out Christian women who are done pretending they are fine. If you are tired of performing wellness while suffering in silence, you are in the right place.

Begin with our free spiritual profile assessment — eight questions that identify your pattern and open a path designed for where you are.

Sanctuary Grace Ministry exists to reach the woman who gave everything she had and forgot to keep something for herself. You are not too far gone. You are not too late. You are simply invited.

Come as you are. https://sanctuarygrace.store

## TAGS
ChristianWomen, SpiritualRest, DailyDevotion, BibleStudy, WomenInFaith, ChristianMinistry, FaithJourney, SpiritualPeace, WomenOfFaith, BurnoutRecovery

## THUMBNAIL CONCEPT
Woman with eyes closed, hands open, warm amber light, white text overlay: "YOU ARE NOT BEHIND"
""",
        "substack_title": "You Are Not Behind"
    },
    2: {
        "title": "When You Cannot Feel God",
        "script": """## SCRIPT TITLE
When You Cannot Feel God

## FULL SCRIPT

I want to talk to the woman who is still showing up — still praying, still reading her Bible, still coming to church — but who cannot feel God.

The silence has gone on long enough that you have begun to wonder if something is wrong with you. If you did something. If He has moved on. If the connection you used to feel was real or if it was something you manufactured in a season when things were easier.

This message is for you.

In Psalm twenty-seven, verse fourteen, the psalmist writes: Wait on the Lord. Be of good courage. And he shall strengthen thine heart. Wait, I say, on the Lord.

This is not a comfortable verse for the woman who has been waiting a long time.

But I want you to notice something. The psalmist does not say wait and pretend it does not hurt. He does not say wait and perform certainty you do not feel. He says wait with courage. Which tells you something: the waiting is hard. It requires courage. It costs something.

The silence of God is not the absence of God.

The woman who could not stop bleeding for twelve years did not feel God's presence every day for twelve years. She felt her suffering. She felt the weariness of seeking help that did not come. And then — one day, in a crowd — she pressed forward anyway. She reached through the noise and the bodies and the impossibility of it. She touched the hem of the garment.

And immediately the bleeding stopped. And Jesus turned. Not because she announced herself. Not because she had summoned the right kind of faith. But because she reached.

When you cannot feel God, reach anyway.

Press through the silence. Press through the doubt. Press through the crowd of thoughts that tell you He has forgotten you. Reach for the hem.

Because He feels the reaching. Even when you cannot feel Him.

Come as you are. https://sanctuarygrace.store

## SEO DESCRIPTION

What do you do when you cannot feel God's presence? When you are still showing up but the silence has stretched long enough to make you wonder if something is wrong with you?

This teaching from The Quiet Authority ministry speaks directly to the woman in the dry season — the one who is still faithful but feels spiritually numb, still praying but wondering if anyone is listening.

Rooted in Psalm 27:14 and the testimony of the woman with the issue of blood, this message names the experience of spiritual silence and brings the Gospel to bear on it honestly.

The Quiet Authority exists for burned-out Christian women who love God and are exhausted by that love in a way they cannot explain to anyone. If this is your season, you are not alone.

Begin your journey with our free spiritual profile assessment at the link below. Eight questions. A result that names your pattern and opens a path designed for exactly where you are.

Sanctuary Grace Ministry speaks the Gospel to women in the quiet — not to perform, not to impress, but because the Gospel is the only thing that reaches the places self-help cannot.

Come as you are. https://sanctuarygrace.store

## TAGS
ChristianWomen, SpiritualDryness, FaithJourney, WomenInFaith, ChristianMinistry, SpiritualRest, DailyDevotion, BibleStudy, WomenOfFaith, TrustingGod

## THUMBNAIL CONCEPT
Woman looking toward a window, soft light, dark interior, text overlay: "WHEN YOU CANNOT FEEL GOD"
""",
        "substack_title": "When You Cannot Feel God"
    },
    3: {
        "title": "The Permission You Have Been Waiting For",
        "script": """## SCRIPT TITLE
The Permission You Have Been Waiting For

## FULL SCRIPT

I want to give you something today.

Not information. Not a five-step plan. Not a better morning routine.

I want to give you permission.

Permission to rest. Not the rest you have earned. Not the rest you deserve after you finish the list. But the rest that Jesus offers in Matthew eleven, verse twenty-eight, when He says: Come unto me, all ye that labour and are heavy laden, and I will give you rest.

He did not say: finish labouring and then come to me.

He said: come as you labour. Come with the burden still on you. Come with the weight you have been carrying so long you have forgotten what it felt like before you picked it up.

I know the woman watching this. She wakes up tired. She ends the day tired. She has tried everything the world told her to try and she is still tired. And somewhere along the way she decided that her tiredness was her fault — a character flaw, a faith problem, a sign that she was not doing enough to get better.

But listen: you are not tired because you are faithless. You are tired because you have been carrying what was never meant for your shoulders alone.

The tired woman in the Gospels who came to the feet of Jesus did not come because she had rested enough to be presentable. She came because she had nowhere else to go. And He received her.

He receives you.

In Proverbs three, verses five and six, we are told: Trust in the Lord with all your heart and lean not on your own understanding. In all your ways acknowledge him and he will make your paths straight.

She has been leaning on her own understanding for too long.

She has been managing and planning and bracing herself and holding everything together with her bare hands. And God is not impressed by the holding. He is waiting for the releasing.

This is your permission to release it.

Not because you have figured out how. Not because you are ready. But because He said come. And come means now. Come means as you are. Come means with the burden intact, not after you have sorted it.

You do not need to be better to begin. You only need to be willing to come.

Come as you are. https://sanctuarygrace.store

## SEO DESCRIPTION

This is the permission you have been waiting for. Not a five-step plan. Not a better morning routine. But the simple, Gospel invitation that Jesus extended in Matthew 11:28 to every woman who is labouring and heavy laden.

This teaching from The Quiet Authority ministry speaks directly to the woman who wakes up tired, ends the day tired, and has begun to believe that her exhaustion is her fault.

It is not. And this message names why.

Rooted in Matthew 11:28 and Proverbs 3:5-6, this devotional teaching brings the Gospel to bear on the specific, daily weight that burned-out Christian women carry alone.

The Quiet Authority exists for the woman who loves God and is exhausted by that love. If that is you, begin with our free spiritual profile assessment — eight questions, eight minutes, a result that names your pattern and opens a path designed for where you are.

Sanctuary Grace Ministry speaks the Gospel tenderly and honestly to women who are done performing. If any part of this message met you today, the door is open.

Come as you are. https://sanctuarygrace.store

## TAGS
ChristianWomen, SpiritualRest, Devotional, BibleStudy, WomenInFaith, FaithJourney, RestInGod, WomenOfFaith, GospelTruth, BurnoutRecovery

## THUMBNAIL CONCEPT
Open hands resting on a wooden table, soft window light, gold text overlay: "YOU HAVE PERMISSION TO REST"
""",
        "substack_title": "The Permission You Have Been Waiting For"
    },
    4: {
        "title": "Your Calling Has Not Expired",
        "script": """## SCRIPT TITLE
Your Calling Has Not Expired

## FULL SCRIPT

There is a woman watching this who used to know what she was called to do.

She used to feel it. A sense of direction. A sense of purpose. A sense that God had placed something specific inside her for a reason that mattered.

And then life happened. Or she happened. Or the gap between who she was called to be and who she actually became grew wide enough that she stopped looking across it.

She is watching this today because some part of her still remembers the thread. And she does not know if she is allowed to pick it up again.

I want to speak to that woman directly: your calling has not expired.

In Romans eight, verses twenty-eight and twenty-nine, Paul writes: And we know that in all things God works for the good of those who love him, who have been called according to his purpose. For those God foreknew he also predestined to be conformed to the image of his Son.

All things. Not the things you got right. All things. Including the years that felt wasted. Including the detours. Including the silence and the waiting and the seasons where you could not find the thread.

God is not in the business of calling women to a purpose and then revoking the call when they struggle to arrive.

He is in the business of conforming. Of forming through the pressure and the brokenness and the long seasons of not knowing. The calling is not cancelled when you are being formed. The calling is being carved.

In Matthew six, verse thirty-three, Jesus says: Seek ye first the kingdom of God and his righteousness, and all these things shall be added unto you.

All these things — including the sense of purpose you have been searching for — are added. Not earned. Not achieved. Added.

When you reorder. When you turn back to the first thing. When you come back to the kingdom, not as a performance, but as a returning.

The woman in this season is not failing. She is being prepared.

The preparation hurts. The preparation is quiet. The preparation looks, from the outside, like nothing is happening. But God is not absent in the preparation. He is most present in it.

Your calling has not expired.

It is waiting. And you are allowed to return to it.

Come as you are. https://sanctuarygrace.store

## SEO DESCRIPTION

Do you feel like your calling has passed you by? Like the window closed while you were dealing with life, and the sense of purpose you used to carry has quietly gone quiet?

This teaching from The Quiet Authority ministry speaks directly to the woman who wonders if she is still allowed to pursue what she was created for — after the years that felt lost, after the seasons of survival, after the gap between calling and reality grew too wide to see across.

Rooted in Romans 8:28-29 and Matthew 6:33, this message speaks the Gospel into the specific ache of deferred purpose.

Your calling has not expired. It is being carved.

The Quiet Authority exists for Christian women who are ready to return — to themselves, to their purpose, to the God who has not stopped calling their name.

Begin with our free spiritual profile assessment. Eight questions. Eight minutes. A result that names your pattern and opens a path designed for exactly where you are right now.

Sanctuary Grace Ministry speaks tenderly and honestly to women who are done pretending they are fine. If any part of this message reached you today, the door is open.

Come as you are. https://sanctuarygrace.store

## TAGS
ChristianWomen, CalledByGod, FaithJourney, WomenInFaith, ChristianMinistry, SpiritualPurpose, DailyDevotion, WomenOfFaith, BibleStudy, HopeForWomen

## THUMBNAIL CONCEPT
Woman standing at a window at dusk, silhouette, warm amber glow, text overlay: "YOUR CALLING HAS NOT EXPIRED"
"""
    ,
        "substack_title": "Your Calling Has Not Expired"
    }
}

script_data = WEEKLY_SCRIPTS[week_number]

scrolling_ticker = """---SCROLLING TICKER---
Romans 10:9-10 (KJV)
That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved. For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.
---END TICKER---"""

output_text = f"""---
week: {week_date_str}
date: {date_str}
week_number: {week_number}
script_title: {script_data['title']}
canva_candidate_id: dg-db32bf4c-9d45-4ee1-83f4-a45ccd878cce
canva_template: Dark background, 3 rings, gold typography
status: DRAFT
---

{script_data['script']}

## SCROLLING TICKER FOR CANVA

{scrolling_ticker}

---

**Canva instructions:**
- Use candidate template: dg-db32bf4c-9d45-4ee1-83f4-a45ccd878cce
- Design: Dark background with 3 rings (gold accent)
- Add scrolling ticker at bottom with Romans 10:9-10
- Export as MP4 ready for Grace to record voiceover
"""

out_dir = pathlib.Path('workflows/output/youtube-pending')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f'{date_str}.md'
out_file.write_text(output_text)

log_file = pathlib.Path('workflows/output/youtube-log.md')
entry = f"| {date_str} | Week {week_number} | {script_data['title']} | DRAFT |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Week | Script Title | Status |\n|---|---|---|---|\n" + entry)

print(f"Done. Week {week_number}: {script_data['title']}")
print(f"Saved to: {out_file}")
