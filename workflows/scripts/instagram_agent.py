import os, datetime, pathlib, json, urllib.request, urllib.error

IG_ACCESS_TOKEN = os.environ.get('IG_ACCESS_TOKEN', '').strip()
IG_USER_ID = os.environ.get('IG_USER_ID', '').strip()
PILLAR_OVERRIDE = os.environ.get('PILLAR_OVERRIDE', '').strip()

today = datetime.date.today()
day_name = today.strftime('%A')
date_str = today.strftime('%Y-%m-%d')
start_date = datetime.date(2026, 5, 26)
day_number = ((today - start_date).days % 30) + 1

PILLAR_BY_DAY = {
    'Monday': 'carousel',
    'Tuesday': 'scripture',
    'Thursday': 'reel',
    'Friday': 'devotional',
    'Saturday': 'silence',
}
pillar = PILLAR_OVERRIDE if PILLAR_OVERRIDE else PILLAR_BY_DAY.get(day_name, 'scripture')

# ─── 30 DAYS OF INSTAGRAM CONTENT ────────────────────────────────────────────

SCHEDULE = {
    1: {
        "pillar": "carousel",
        "content": """SLIDE 1: She gave until there was nothing left. And she called it faithfulness.

SLIDE 2: But faithfulness was never meant to cost you yourself.

SLIDE 3: You said yes when your whole body said no. You poured when the well was empty. You smiled through the silence of your own depletion.

SLIDE 4: God did not design you to be emptied. He designed you to be filled.

SLIDE 5: You are not more holy because you are more depleted. You are more in need of the Shepherd who leads to still waters.

SLIDE 6: This is the invitation — not to give more, but to finally receive.

SLIDE 7: The Quiet Authority. A free spiritual profile for women who are ready to stop. https://sanctuarygrace.store

CAPTION: She gave until there was nothing left. Not because she was weak — because she had learned that her worth lived in what she could offer. If you recognize yourself in this, you are not alone. The Quiet Authority was created for this moment. Free assessment at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #HopeForWomen #ChristianMom #SpiritualRest

CANVA BRIEF: 1080x1080px, black background, Cinzel font ALL CAPS in white, terra accent #C1593C for slide numbers, soft gold star detail in corner."""
    },
    2: {
        "pillar": "scripture",
        "content": """SCRIPTURE: Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28

He did not say come when you have finished. He did not say come when you have earned it. He said come weary. Come burdened. Come exactly as you are right now.

Rest is not a reward for productivity. It is a gift offered to those who are too tired to keep refusing it.

You do not have to earn what he has already offered. You only have to receive it.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #FaithJourney #QuietTime #DailyDevotion #SpiritualRest #SanctuaryGrace

CANVA BRIEF: Black background, Matthew 11:28 in Cinzel gold, soft white body text below, single gold star accent."""
    },
    3: {
        "pillar": "reel",
        "content": """HOOK: You are not behind. You are just exhausted.

BEAT 1: There is a version of you that existed before the striving began. Before you learned to measure your worth by your output.

BEAT 2: She is still there. Underneath the productivity. Underneath the performance. Underneath the yes you gave when your whole body said no.

BEAT 3: The invitation is not to do more. It is to return. To the self that was made on purpose, before the world told you who to be instead.

CTA: The Quiet Authority is a free 8-question assessment for women who are ready to find their way back. Link in bio.

CAPTION: You are not behind. You are just exhausted. And exhaustion, when we finally stop and listen to it, is one of the most honest things our body ever says. The return begins at the link below.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #FaithAndWellness #SpiritualRest #HopeForWomen #SanctuaryGrace #FaithJourney

THUMBNAIL BRIEF: Dark frame, woman's hands open and still, text overlay: YOU ARE NOT BEHIND in Cinzel terra #C1593C."""
    },
    4: {
        "pillar": "devotional",
        "content": """CAPTION: Be still, and know that I am God. — Psalm 46:10

The knowing comes in the stopping. Not in the striving. You cannot know — truly know, in your bones — that he is God while you are sprinting past him.

Today, stop before you have finished. The stillness is not something you earn. It is the place where knowing begins.

Full devotional: Week 1 — Vision. Available now at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #QuietTime #SacredSpace #SpiritualRest #FaithJourney #SanctuaryGrace

CANVA BRIEF: Devotional cover — black background, Cinzel title, soft candlelight texture, terra border detail."""
    },
    5: {
        "pillar": "silence",
        "content": """CAPTION: Fifteen minutes. Just you and God. No agenda. No performance. No words required.

The Circle of Silence is a guided stillness practice for the woman who has forgotten what it feels like to simply be present without producing anything.

You do not have to be good at silence to begin. You only have to be willing.

Watch on YouTube: youtube.com/@TheQuietAuthority-f1z

Begin here: https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #QuietTime #SpiritualRest #FaithAndWellness #SanctuaryGrace #CircleOfSilence

CANVA BRIEF: Deep charcoal background, single candle flame photograph, minimal white text, no clutter."""
    },
    6: {
        "pillar": "carousel",
        "content": """SLIDE 1: She survived things she never speaks about.

SLIDE 2: She rebuilt herself more than once. Quietly. Without applause.

SLIDE 3: She learned to function in crisis because crisis became familiar.

SLIDE 4: And somewhere along the way, surviving became her identity. And rest became something she did not know how to trust.

SLIDE 5: The Depleted Survivor carries wounds that look like strength from the outside.

SLIDE 6: But survival was never meant to be a permanent address.

SLIDE 7: There is more on the other side of survival. The Quiet Authority can help you find it. https://sanctuarygrace.store

CAPTION: Survival mode was meant to be temporary. If you have been living there for years, the Quiet Authority was created for this moment. Free spiritual profile at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #HopeForWomen #FaithAndWellness #SanctuaryGrace #SpiritualRest #FaithJourney

CANVA BRIEF: 1080x1080px series, black background, Cinzel white text, one profile image (B&W Depleted Survivor) on final slide."""
    },
    7: {
        "pillar": "scripture",
        "content": """SCRIPTURE: He heals the brokenhearted and binds up their wounds. — Psalm 147:3

He binds up. This is not passive. It is deliberate, personal, attentive. The image is of a physician who knows exactly where it hurts and does not rush the treatment.

You wanted to be further along by now. But healing is not linear. And the fact that you are still in the middle does not mean you are stuck — it means the work is still happening.

You are not behind. You are healing.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #SpiritualRest #FaithJourney #HopeForWomen #SanctuaryGrace #DailyDevotion

CANVA BRIEF: Psalm 147:3 in Cinzel gold on black, soft texture background, single gold star."""
    },
    8: {
        "pillar": "reel",
        "content": """HOOK: What if rest is not something you earn — but something you were made for?

BEAT 1: We have built an entire theology around earning rest. We rest on Sunday because we worked all week. We allow peace after the crisis passes.

BEAT 2: But this is not the Gospel. The Gospel says rest is not a reward. It is a design feature of the human soul.

BEAT 3: Your exhaustion is not a character flaw. It is evidence that you are finite. And finitude is not a spiritual problem.

CTA: You were made for more than this exhaustion. The Quiet Authority — free assessment at the link in bio.

CAPTION: Rest is not something you earn. It is something you were made for. If you have been waiting until you deserve it, this is the invitation to stop waiting.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualRest #FaithAndWellness #SanctuaryGrace #HopeForWomen #SpiritualBurnout #FaithJourney

THUMBNAIL BRIEF: Dark still frame, text: REST IS NOT A REWARD in Cinzel terra, woman's face turned upward, peaceful."""
    },
    9: {
        "pillar": "devotional",
        "content": """CAPTION: The Lord is close to the brokenhearted. — Psalm 34:18

Not the triumphant. Not the thriving. The brokenhearted — the woman who is holding her faith together with trembling hands and wondering if it will be enough.

You do not have to feel his presence for it to be real. You do not have to manufacture the joy. Just stay.

He is closer than the silence feels.

Week 2 devotional — Renewal — available now at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #SacredSpace #FaithJourney #SpiritualRest #QuietTime #SanctuaryGrace

CANVA BRIEF: Week 2 Renewal cover, candle glow, Cinzel title, warm dark tones."""
    },
    10: {
        "pillar": "silence",
        "content": """CAPTION: There is a stillness that heals what striving never could.

Not the quiet of an empty calendar. But the presence of God inside the noise — the kind that rises from somewhere deeper than circumstance.

This is what the Circle of Silence makes space for. Fifteen minutes. You and God. No agenda.

New session available now on YouTube. Link in bio.

youtube.com/@TheQuietAuthority-f1z

https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #QuietTime #SpiritualRest #CircleOfSilence #FaithAndWellness #SanctuaryGrace

CANVA BRIEF: Near-black background, soft candlelight edge, minimal white text centered, meditative feeling."""
    },
    11: {
        "pillar": "carousel",
        "content": """SLIDE 1: She sets the alarm early. She finishes what others abandon.

SLIDE 2: She believes that faithfulness looks like productivity and that rest must be earned before it can be received.

SLIDE 3: She is not lazy. She is not faithless. She is exhausted in a way that no amount of accomplishment seems to fix.

SLIDE 4: The Striving Achiever has confused doing with being. Her identity lives in her output.

SLIDE 5: When she slows down, the silence feels like failure.

SLIDE 6: But God is not measuring your productivity. He is calling you by name — not by your achievements.

SLIDE 7: The Quiet Authority. Free 8-question assessment. Begin at the link. https://sanctuarygrace.store

CAPTION: She is not lazy. She is not faithless. She is the Striving Achiever — and she is one of four spiritual profiles in The Quiet Authority. If this is you, the assessment was built for this moment. Free. Link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #SpiritualRest #HopeForWomen #ChristianMom

CANVA BRIEF: Striving Achiever profile image (B&W) on final slide, black background, Cinzel text throughout."""
    },
    12: {
        "pillar": "scripture",
        "content": """SCRIPTURE: But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary. — Isaiah 40:31

This is a promise for the woman who is faint. Not for the one who has already rested. For the one who cannot imagine soaring because she can barely walk.

The renewal is not something you manufacture. It is something you receive. It flows from the act of waiting on him — of being honest that you have run out.

You were not made for permanent exhaustion.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #FaithJourney #SpiritualRest #HopeForWomen #SanctuaryGrace #DailyDevotion

CANVA BRIEF: Isaiah 40:31 in Cinzel gold on black, eagle feather detail in corner, warm light gradient edge."""
    },
    13: {
        "pillar": "reel",
        "content": """HOOK: There is a woman inside you who existed before the exhaustion.

BEAT 1: Before the years of giving too much. Before you learned to shrink yourself to fit the space you were allowed.

BEAT 2: She is still there. Quieter now. But present. Waiting with a patience more faithful than anything you have managed.

BEAT 3: The return to her is the work of this season. Not a career goal. The return to the woman you were made to be.

CTA: The Quiet Authority. Free assessment. Eight minutes of honesty. Begin at the link in bio.

CAPTION: The woman you were made to be is still there. Underneath the striving. Underneath the performance. Underneath all of it. She is waiting to be found.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualRest #HopeForWomen #SanctuaryGrace #FaithJourney #SpiritualBurnout #FaithAndWellness

THUMBNAIL BRIEF: Woman looking inward, soft side lighting, text: SHE IS STILL THERE in Cinzel terra."""
    },
    14: {
        "pillar": "devotional",
        "content": """CAPTION: Give us today our daily bread. — Matthew 6:11

Jesus taught us to ask for today's portion. Not this week's. Not enough to stop depending. Today.

The woman who is anxious about the future is trying to borrow provision for days she has not yet lived. And the weight of next week on a body built for today is crushing.

Today's grace is enough for today. You do not have to secure next month's supply before you can rest.

Week 3 devotional — Peace — at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #QuietTime #SpiritualRest #FaithJourney #SacredSpace #SanctuaryGrace

CANVA BRIEF: Week 3 Peace cover, soft gold light on black, Cinzel title, minimal and still."""
    },
    15: {
        "pillar": "silence",
        "content": """CAPTION: The Circle of Silence is not a program. It is a practice.

Every week: fifteen minutes of guided music and stillness for the woman who has forgotten what it feels like to not be needed for a moment.

You do not have to be good at silence. You only have to be willing.

New session on YouTube now. Link in bio.

youtube.com/@TheQuietAuthority-f1z

https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #CircleOfSilence #QuietTime #SpiritualRest #FaithAndWellness #SanctuaryGrace

CANVA BRIEF: Single candle, dark background, soft glow, text in white: FIFTEEN MINUTES. YOU AND GOD."""
    },
    16: {
        "pillar": "carousel",
        "content": """SLIDE 1: She used to know who she was.

SLIDE 2: She had a sense of direction. A sense of self. A sense that God was near and she was moving toward something meaningful.

SLIDE 3: And then, somewhere between the seasons of life, she lost the thread.

SLIDE 4: The Lost Wanderer is not faithless. She is disoriented.

SLIDE 5: She has not walked away from God — she simply cannot find her footing.

SLIDE 6: She wonders if she has been forgotten. She has not been.

SLIDE 7: The Quiet Authority. A path back to the thread. Free assessment at the link. https://sanctuarygrace.store

CAPTION: She is not faithless. She is disoriented. The Lost Wanderer is one of four profiles in The Quiet Authority. If you have lost the thread, the assessment is a gentle place to begin finding it again. Free. Link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #FaithJourney #HopeForWomen #SanctuaryGrace #SpiritualRest #SpiritualBurnout #FaithAndWellness

CANVA BRIEF: Lost Wanderer profile image (B&W) on final slide, black background, Cinzel, fog or haze texture."""
    },
    17: {
        "pillar": "scripture",
        "content": """SCRIPTURE: For God has not given us a spirit of fear, but of power and of love and of a sound mind. — 2 Timothy 1:7

Fear has been speaking in your voice for so long you have started to believe it is your voice. It tells you to stay small, to stay safe, to protect yourself.

But the spirit of fear is not from God.

The spirit God gave is power. Love. A sound mind. You are allowed to live from that spirit.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #FaithJourney #SpiritualRest #HopeForWomen #SanctuaryGrace #QuietTime

CANVA BRIEF: 2 Timothy 1:7 in Cinzel gold, bold and centered, dark background, gold accent line beneath."""
    },
    18: {
        "pillar": "reel",
        "content": """HOOK: You are safe to be honest with God.

BEAT 1: He already knows your anxious thoughts. The invitation in Psalm 139 is not for his information — it is for your liberation.

BEAT 2: The act of naming what is real, honestly, before the God who already sees it — that is how the hidden places begin to heal.

BEAT 3: Bring the real thing. Not the edited version. Not the spiritually appropriate version. The raw, in-progress, falling-apart version.

CTA: He will not be shocked. He will not love you less. He is waiting for the honest one.

https://sanctuarygrace.store

CAPTION: You are safe to be honest with God. Bring the real version today — the unedited, exhausted, uncertain one. He has been waiting for exactly her.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #FaithJourney #SpiritualRest #SanctuaryGrace #QuietTime #HopeForWomen #FaithAndWellness

THUMBNAIL BRIEF: Hands open, palms up, soft light, text: BE HONEST in Cinzel terra."""
    },
    19: {
        "pillar": "devotional",
        "content": """CAPTION: We are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do. — Ephesians 2:10

You have not been disqualified. You have not missed the window. The God who made you with purpose does not revoke the purpose when the path gets complicated.

He reroutes. He redeems. He takes what looked like detour and weaves it into the thing he was building all along.

You are not behind. You are becoming.

Week 4 devotional — Calling — at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #FaithJourney #SpiritualRest #SacredSpace #SanctuaryGrace #HopeForWomen

CANVA BRIEF: Week 4 Calling cover, dawn light quality, Cinzel title in warm gold."""
    },
    20: {
        "pillar": "silence",
        "content": """CAPTION: Stillness is not the absence of noise. It is the presence of God inside it.

The Circle of Silence makes space for the kind of quiet that meets you in the middle of your life — not after it settles down. Not when you have finished everything on the list.

Now. In this moment. Before the day begins.

New session on YouTube. Link in bio.

youtube.com/@TheQuietAuthority-f1z

https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #CircleOfSilence #QuietTime #SpiritualRest #SanctuaryGrace #FaithAndWellness

CANVA BRIEF: Near-black, candle glow at center, text: IN THE STILLNESS, HE IS HERE — Cinzel white, minimal."""
    },
    21: {
        "pillar": "carousel",
        "content": """SLIDE 1: Four women. Four wounds. One invitation.

SLIDE 2: The Striving Achiever — she cannot stop moving, even when her body is asking her to.

SLIDE 3: The Depleted Survivor — she has rebuilt herself so many times she has forgotten her original shape.

SLIDE 4: The Guilty Giver — she says yes to everyone and no to herself, and calls it faithfulness.

SLIDE 5: The Lost Wanderer — she is searching for the thread back to who she was before life changed her.

SLIDE 6: One of these is you. You already know which one.

SLIDE 7: The Quiet Authority. Free. 8 questions. 8 minutes. Begin at the link. https://sanctuarygrace.store

CAPTION: Four profiles. One for each kind of tired. You already know which one is yours. The Quiet Authority is free, takes 8 minutes, and opens a path designed for where you actually are — not where you think you should be. Link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #HopeForWomen #SpiritualRest #FaithJourney

CANVA BRIEF: All four profile images in a 2x2 grid, black background, Cinzel labels, terra accent color."""
    },
    22: {
        "pillar": "scripture",
        "content": """SCRIPTURE: His mercies are new every morning; great is your faithfulness. — Lamentations 3:23

This was written from inside devastation — the city in ruins, the exile beginning. And from inside that wreckage, the writer found the one thing that held.

Every morning is a beginning. Not a continuation of yesterday's failures. New mercies. The same faithful God. Fresh grace.

You are allowed to begin again. You always were.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #FaithJourney #SpiritualRest #HopeForWomen #SanctuaryGrace #DailyDevotion

CANVA BRIEF: Lamentations 3:23 in Cinzel gold, sunrise-dark palette, soft glow from bottom edge."""
    },
    23: {
        "pillar": "reel",
        "content": """HOOK: Your needs are not inconvenient to God.

BEAT 1: Somewhere you learned that wanting comfort, rest, or help was weakness. So you became very skilled at not needing.

BEAT 2: But a thirst you refuse to name does not go away. It goes underground — and shows up as resentment, as exhaustion, as a grief you cannot explain.

BEAT 3: God satisfies the thirsty. Not the woman who has mastered pretending she is not thirsty. The honest one. The one who finally admits she is dry.

CTA: Name what you need today. That honesty is the beginning of being filled.

https://sanctuarygrace.store

CAPTION: Your needs are not inconvenient to God. He is not burdened by your thirst. He is the answer to it. Be honest today about what you need.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualRest #FaithAndWellness #HopeForWomen #SanctuaryGrace #SpiritualBurnout #FaithJourney

THUMBNAIL BRIEF: Woman's face, eyes closed, peaceful surrender, text: YOUR NEEDS ARE NOT INCONVENIENT in Cinzel terra."""
    },
    24: {
        "pillar": "devotional",
        "content": """CAPTION: Even though I walk through the darkest valley, I will fear no evil, for you are with me. — Psalm 23:4

He does not say you will not walk through the darkest valley. He says through.

The valley is not the destination. It is the path. And the path has a guide — the God who walks through it with you. Not ahead of you waving from the other side. Present. Close enough to touch.

You are not alone in the valley. You have never been alone in the valley.

All four devotional weeks available now at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #QuietTime #FaithJourney #SpiritualRest #SanctuaryGrace #HopeForWomen

CANVA BRIEF: Psalm 23 cover style, dark valley aesthetic, single light source from above, Cinzel text."""
    },
    25: {
        "pillar": "silence",
        "content": """CAPTION: The Circle of Silence began as something I needed for myself.

I was the woman who could not stop. Who believed that stillness was something I had to earn. Who had forgotten what it felt like to simply exist in the presence of God without a purpose or a plan.

This practice changed me. Slowly. Quietly. The way all real change happens.

Come and see. New session every week. YouTube link in bio.

youtube.com/@TheQuietAuthority-f1z

https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #CircleOfSilence #SpiritualRest #QuietTime #FaithAndWellness #SanctuaryGrace

CANVA BRIEF: Personal, warm — single candle, handwritten feel, Cinzel text, most minimal of all designs."""
    },
    26: {
        "pillar": "carousel",
        "content": """SLIDE 1: She did not know how to receive.

SLIDE 2: Every gift felt like a debt. Every act of kindness required immediate repayment.

SLIDE 3: She had been taught that needing was weakness and that the godly woman was always the one giving.

SLIDE 4: So she gave. And gave. And gave. Until she could not remember who she was when she was not being useful.

SLIDE 5: The Guilty Giver does not receive because receiving feels like taking.

SLIDE 6: But every good gift comes from the Father. And when you refuse the gifts, you are refusing something he sent.

SLIDE 7: You are allowed to receive. You always were. https://sanctuarygrace.store

CAPTION: The Guilty Giver is one of the most common patterns among women of faith. If you recognize yourself here, you are not alone — and there is a path forward. Free assessment at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #SpiritualBurnout #FaithAndWellness #SanctuaryGrace #HopeForWomen #ChristianMom #SpiritualRest

CANVA BRIEF: Guilty Giver profile image (B&W) on final slide, black background series, hands open receiving pose."""
    },
    27: {
        "pillar": "scripture",
        "content": """SCRIPTURE: And we all are being transformed into his image with ever-increasing glory. — 2 Corinthians 3:18

You are not finished. The version of you that exists right now is not the final draft. You are mid-transformation.

The failures are not disqualifying. The wilderness is not the end of the story. Even the places where you have been most lost are part of the path that leads to the image of the One who holds you.

The glory is increasing even when you cannot see it.

https://sanctuarygrace.store

HASHTAGS: #ScriptureForWomen #ChristianWomen #FaithJourney #SpiritualRest #HopeForWomen #SanctuaryGrace #DailyDevotion

CANVA BRIEF: 2 Corinthians 3:18 in Cinzel gold, increasing light from left to right across dark background."""
    },
    28: {
        "pillar": "reel",
        "content": """HOOK: The long road is not evidence that God has forgotten you.

BEAT 1: You thought you would be further along by now. You had a picture of where this journey was supposed to take you — and this is not it.

BEAT 2: But the path that forms character, that does the deep work, that leads to the kind of life that holds under pressure — that path almost never takes the direct route.

BEAT 3: The length of your journey is not a measure of your value. It is simply the length of your journey. And every step of it has been building something the direct path could not have built.

CTA: You are not behind. You are on the road. The Quiet Authority — free assessment at the link in bio.

CAPTION: You are not behind. You are on a long road that is doing something thorough. And the destination has not moved.

https://sanctuarygrace.store

HASHTAGS: #ChristianWomen #FaithJourney #HopeForWomen #SanctuaryGrace #SpiritualRest #FaithAndWellness #SpiritualBurnout

THUMBNAIL BRIEF: Long empty path at dusk, warm light ahead, text: YOU ARE NOT BEHIND in Cinzel terra."""
    },
    29: {
        "pillar": "devotional",
        "content": """CAPTION: She is clothed with strength and dignity; she can laugh at the days to come. — Proverbs 31:25

The laughter at days to come is not naivety. It is the confidence of a woman who has been through enough to know that she has what it takes — not because she is extraordinary, but because the God who has walked with her this far is not going to stop.

You are clothed in more than you know. The scars are part of the clothing.

The full devotional series — four weeks, four movements — available at the link in bio.

https://sanctuarygrace.store

HASHTAGS: #DailyDevotion #ChristianWomen #FaithJourney #SpiritualRest #HopeForWomen #SanctuaryGrace #ScriptureForWomen

CANVA BRIEF: Proverbs 31 woman aesthetic, dignified and strong, black background, gold Cinzel text, powerful composition."""
    },
    30: {
        "pillar": "silence",
        "content": """CAPTION: A month of returning. And it is only the beginning.

Thirty days of sacred content for the woman who is tired of being tired. A community forming in the quiet. A practice of stillness that is changing things — slowly, in the way all real change happens.

Month Two begins soon. The same voice. The same invitation. Deeper into the work of becoming who you were always meant to be.

Thank you for being here. The door remains open.

https://sanctuarygrace.store

HASHTAGS: #SacredSpace #ChristianWomen #SpiritualRest #FaithAndWellness #SanctuaryGrace #CircleOfSilence #FaithJourney

CANVA BRIEF: Month milestone post — warm, personal, single candle, thank you tone, Cinzel text minimal and gracious."""
    },
}

# ─── BUILD CONTENT ────────────────────────────────────────────────────────────

entry = SCHEDULE.get(day_number, SCHEDULE[1])
# If pillar override or day-based pillar differs from scheduled, use scheduled content
content = entry['content']
actual_pillar = entry['pillar']

# ─── SAVE OUTPUT ─────────────────────────────────────────────────────────────

out_dir = pathlib.Path('workflows/output/ig-drafts')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f'{date_str}.md'
out_file.write_text(
    f'---\ndate: {date_str}\nday: {day_number}\npillar: {actual_pillar}\nstatus: DRAFT — review before posting\n---\n\n{content}\n'
)

log_file = pathlib.Path('workflows/output/ig-log.md')
entry_log = f'| {date_str} | Day {day_number} | {actual_pillar} | DRAFT SAVED | {out_file} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry_log)
else:
    log_file.write_text('| Date | Day | Pillar | Status | File |\n|---|---|---|---|---|\n' + entry_log)

print(f'Instagram draft saved — Day {day_number}, Pillar: {actual_pillar}')
print(f'File: {out_file}')
