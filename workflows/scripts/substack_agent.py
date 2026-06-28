import os, datetime, json, urllib.request, urllib.error

SUBSTACK_COOKIE_ID = os.environ.get('SUBSTACK_COOKIE_ID', '').strip()
BASE_URL = 'https://5apop2sotwm.substack.com'

today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')
day_name = today.strftime('%A')

# ─── DEVOTION CONTENT ─────────────────────────────────────────────────────────
# KJV scripture, Grace Turner voice, 200-300 words, points to Christ only.

start_date = datetime.date(2026, 5, 26)
day_number = ((today - start_date).days % 30) + 1

DEVOTIONS = {
    1: {
        "title": "The Weight You Were Never Meant to Carry",
        "scripture": "Cast thy burden upon the LORD, and he shall sustain thee. — Psalm 55:22 (KJV)",
        "body": """Cast thy burden upon the LORD, and he shall sustain thee. — Psalm 55:22 (KJV)

You have been carrying it so long that you have forgotten it was never yours to begin with. The weight of other people's disappointment. The fear of not being enough. The quiet dread that if you slow down, everything will fall apart.

You picked it up gradually — one responsibility at a time, one yes when your whole body said no. And somewhere between the first burden and the hundredth, you stopped noticing it was there. It became who you were.

But the LORD does not ask you to manage your burden. He does not say organize it or push through it. He says cast it. The word is complete and deliberate — a throwing off, a release that requires a decision of the will.

He is not asking you to hand him a portion of what troubles you while you hold the rest. He is asking for all of it. Every fear. Every grief. Every weight you have been calling your own.

You do not have to figure out how to feel less burdened before you come to him. You come burdened. That is the invitation.

Christ bore the cross so that you would not have to carry what was never designed for human hands. He sustained the unsustainable on your behalf. And now he stands, arms open, asking for the thing that is breaking you.

Lay it down today. Not because you have the strength to carry it any further, but because the One who holds the universe is asking you to let him hold you.

Come as you are. https://sanctuary-grace.com/"""
    },
    2: {
        "title": "Permission to Stop",
        "scripture": "Be still, and know that I am God. — Psalm 46:10 (KJV)",
        "body": """Be still, and know that I am God. — Psalm 46:10 (KJV)

This is not a suggestion. It is not a reward for those who have finished everything on their list. It is a command — and like all of God's commands, it is also an invitation into something your soul has been aching for.

Be still.

You have been moving for so long that stillness feels like failure. Like something is wrong with you if you are not producing, helping, fixing, serving. You have confused motion with faithfulness and rest with laziness, and the confusion has cost you something deep.

But God does not need your motion. He was God before you got up this morning. He will be God long after this day ends. Your stillness does not diminish him. It returns you to yourself.

The knowing comes in the stopping. Not in the striving. You cannot know — truly know, in your bones — that he is God while you are sprinting past him.

This is a word for the woman who has been sprinting so long she cannot remember why she started. The sprint has become its own justification. The motion has become identity. And somewhere in the motion, she lost the quiet place where God speaks.

Today, stop for five minutes. Not to pray a perfect prayer. Not to read a chapter. Just to be present with the One who has been present with you through all of it.

You have permission to stop. You always did.

Come as you are. https://sanctuary-grace.com/"""
    },
    3: {
        "title": "When You Have Given Everything Away",
        "scripture": "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures. — Psalm 23:1-2 (KJV)",
        "body": """The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures. — Psalm 23:1-2 (KJV)

She gave until there was nothing left. Not because she was weak, but because she had been taught that her worth lived in what she could offer. So she offered everything. And when the offering was finished, she stood empty and wondered why she felt so far from God.

Depletion is not consecration. Emptiness is not holiness. The woman who has given herself away completely is not more faithful — she is more lost.

The Shepherd does not lead the exhausted sheep to the next task. He maketh her to lie down. The word is tender and firm in equal measure. He does not ask her if she is ready. He leads her to the place her soul has been avoiding — the green pasture, the still water, the restoration that feels too slow and too quiet for someone used to moving.

This is the shepherd's wisdom: he knows that the sheep who will not rest will eventually collapse. The rest is not weakness; it is wisdom. It is the Shepherd's own prescription for a soul that has been giving from an emptying vessel.

You are not too far gone for the Shepherd to reach. You are not too depleted for the well to fill again. But you have to let him lead you to the water. You have to be willing to lie down.

Today, let him be enough. You do not have to produce anything. You only have to follow.

Come as you are. https://sanctuary-grace.com/"""
    },
    4: {
        "title": "The Lie That Rest Must Be Earned",
        "scripture": "Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28 (KJV)",
        "body": """Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28 (KJV)

He does not say come when you have finished. He does not say come when you have earned it, when you have been productive enough, faithful enough, useful enough to deserve a moment of peace.

He says come weary. Come heavy laden. Come exactly as you are right now, with the undone list and the tired body and the heart that has been running on empty for longer than you want to admit.

We have built an entire practice around earning rest. We rest on Sunday because we worked all week. We allow ourselves peace after the crisis has passed. But this is not the Gospel. The Gospel says rest is not a reward. It is a gift offered to those who are too tired to keep refusing it.

The word Jesus uses for rest here is not a pause in activity. It is the rest that settles in the soul — the kind that holds even when circumstances remain difficult. The kind that does not depend on the situation being resolved before it arrives.

You do not have to earn what he has already offered. You only have to receive it. That receiving begins with honesty: I am weary. I am heavy laden. And I am coming to you not with my accomplishments but with my exhaustion.

He is not waiting for a better version of you.

Come. He is ready now.

Come as you are. https://sanctuary-grace.com/"""
    },
    5: {
        "title": "Surviving Is Not the Destination",
        "scripture": "I am come that they might have life, and that they might have it more abundantly. — John 10:10 (KJV)",
        "body": """I am come that they might have life, and that they might have it more abundantly. — John 10:10 (KJV)

You are good at surviving. You have done it more times than most people know. You rebuilt yourself quietly, without applause, without anyone fully understanding what it cost. And you learned to function in the wreckage — because functioning felt like victory, and victory felt like proof that you were still standing.

But surviving was never the destination. Jesus did not come so that you could manage. He came so that you could live — abundantly, deeply, with roots that go down into something that does not shake when the wind comes.

The Greek word translated abundant here means exceeding some number or measure — beyond what you would dare ask or expect. This is the quality of life Christ offers: not barely enough, not minimum sufficiency, but a life that overflows the container of your circumstances.

The woman who has been in survival mode for years does not always know how to receive abundance. The abundance feels suspicious. She is waiting for the other shoe to drop, for the peace to be taken, for the goodness to prove itself a trick.

But the life Jesus offers is not fragile. It does not depend on your circumstances holding together. It is the kind of life that sustains you inside the difficulty — not after it, not around it, but in the very middle of it.

You were made for more than survival. Not because you earned it, but because the One who holds your life is not a God of bare minimum.

Come as you are. https://sanctuary-grace.com/"""
    },
    6: {
        "title": "Return to Your Rest",
        "scripture": "Return unto thy rest, O my soul; for the LORD hath dealt bountifully with thee. — Psalm 116:7 (KJV)",
        "body": """Return unto thy rest, O my soul; for the LORD hath dealt bountifully with thee. — Psalm 116:7 (KJV)

She fills every silence. Not with noise, necessarily — but with movement. Another task, another plan, another conversation she initiates to avoid the one she is not having with herself. She has learned that busyness is safer than stillness. Because in the stillness, the things she has not processed begin to rise.

If this is you, I am not here to shame you. I am here to tell you that the avoidance makes sense, and that God is not surprised by it.

But the soul that cannot be still is a soul that is not resting. And a soul that is not resting is a soul that is slowly unraveling — even if no one can see it yet, even if you have become very good at looking composed.

Return. That is the word the Psalmist speaks to his own soul. Not a command from the outside, but a word spoken from the deeper place to the restless place within. Return — to the place you knew before the striving began, before survival mode took over, before you forgot that being held was something you were allowed to receive.

The LORD hath dealt bountifully with thee. Even in the hard seasons. Even when you could not feel it. The bountiful dealing is the reason you can return. Not your own worthiness. His faithfulness.

Speak this to your own soul today: Return unto thy rest. The LORD has been faithful. You are allowed to stop.

Come as you are. https://sanctuary-grace.com/"""
    },
    7: {
        "title": "Your Needs Are Not Inconvenient",
        "scripture": "He satisfieth the longing soul, and filleth the hungry soul with goodness. — Psalm 107:9 (KJV)",
        "body": """He satisfieth the longing soul, and filleth the hungry soul with goodness. — Psalm 107:9 (KJV)

Somewhere you learned that your needs were a burden. That wanting comfort, rest, or help was a sign of weakness — or worse, selfishness. So you became very skilled at not needing. At anticipating everyone else's needs while quietly ignoring your own.

But a thirst you refuse to name does not go away. It goes underground. It shows up as resentment, as exhaustion, as a low-grade grief you cannot explain to anyone. And eventually it shows up as an inability to give the very thing you have been pouring out — because you have been drawing from a well you never allowed anyone to fill.

God satisfies the longing soul. Not the person who has mastered pretending they are not longing. Not the woman who has convinced everyone, including herself, that she needs nothing. The longing soul. The honest one. The one who finally admits she is dry.

The word longing here carries the weight of a real craving — a thirst that has been present long enough to become defining. God does not look at that thirst and tell you to manage it more quietly. He satisfies it. He fills the hungry soul with goodness.

Your needs are not inconvenient to God. He is not burdened by your hunger. He is the answer to it.

Name what you need today. You do not have to fix it. Just name it — to yourself, to him. Honesty is the beginning of being filled.

Come as you are. https://sanctuary-grace.com/"""
    },
    8: {
        "title": "When Faith Feels Far Away",
        "scripture": "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit. — Psalm 34:18 (KJV)",
        "body": """The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit. — Psalm 34:18 (KJV)

There are seasons when faith does not feel like faith. When prayer feels like speaking into a ceiling. When the scripture you have loved for years sounds flat on the page. When you go through the motions because stopping entirely feels like a betrayal of everything you have built your life around.

You are not losing your faith. You are in the desert.

The desert is not punishment. It is not evidence that God has moved. The saints who walked before us understood this — the silence that feels like absence is often the place where the roots grow deepest, where the soul is stripped of everything that was performance and left with what is real.

The LORD is nigh. Not to the triumphant. Not to the thriving. Nigh unto them that are of a broken heart. The woman who is holding her faith together with trembling hands and wondering if it will be enough — she is precisely the one he draws near to.

The nearness is not conditional on your ability to feel it. He was near to the Psalmist in the pit before the Psalmist could sense his presence. He is near to you in this desert whether or not the nearness registers.

You do not have to feel his presence for it to be real. You do not have to manufacture the joy. Just stay. Keep showing up, even when it feels hollow. He is closer than the silence feels.

Come as you are. https://sanctuary-grace.com/"""
    },
    9: {
        "title": "The Slow Work of Healing",
        "scripture": "He healeth the broken in heart, and bindeth up their wounds. — Psalm 147:3 (KJV)",
        "body": """He healeth the broken in heart, and bindeth up their wounds. — Psalm 147:3 (KJV)

You wanted to be further along by now. You thought the healing would come faster — that at some point you would wake up and the weight would be gone, the old patterns replaced, the wounds sealed over into something that no longer hurt when pressed.

But healing does not work the way we want it to. It is not linear. It does not arrive on schedule. It comes in waves — forward and back, better and then raw again — and the rawness can feel like failure when it is actually just part of the process.

He healeth. He bindeth up. These are not passive acts. They are deliberate, personal, attentive. The image is of a physician who knows exactly where it hurts and does not rush the treatment. The binding up takes time. The healing happens underneath the surface, in the places you cannot see.

God is not finished with you. The fact that you are still in the middle does not mean you are stuck. It means the work is still happening — at a pace that is slower than you want and more thorough than you know.

The broken heart is not beyond his skill. The wound that has resisted your own attempts to close it is not beyond his ability to bind. He who calls the stars by name knows the precise location of every wound in you.

Be patient with yourself today. You are not behind. You are healing. Those are not the same thing.

Come as you are. https://sanctuary-grace.com/"""
    },
    10: {
        "title": "Strength for the Weary",
        "scripture": "He giveth power to the faint; and to them that have no might he increaseth strength. — Isaiah 40:29 (KJV)",
        "body": """He giveth power to the faint; and to them that have no might he increaseth strength. — Isaiah 40:29 (KJV)

This is a promise written for the woman who has run out. Not for the woman who is doing well. Not for the woman who has already rested and renewed and returned strong. For the faint one. For the one who has no might left — and is somehow still showing up anyway.

He giveth power to the faint. The giving flows toward the depletion. If you are full of your own strength, you have no room to receive what he offers. But if you are faint — if you have come to the genuine end of your own resources — you are precisely the person this promise is addressed to.

Isaiah wrote this for people in exile. People who were tired not from a bad week but from years of loss, displacement, and the grinding uncertainty of not knowing when or whether the situation would change. The weariness in this passage is deep. It is the weariness of the long road, the kind that settles into the bones.

And to that weariness, God speaks: I am the source you cannot deplete. I do not grow faint. I do not run low. And the strength that I have is available to you — not as a reward for having recovered, but as the gift given to those who have run out.

You do not have to find strength inside yourself today. You only have to receive what he is offering.

Come as you are. https://sanctuary-grace.com/"""
    },
    11: {
        "title": "Grief Does Not Disqualify You",
        "scripture": "Blessed are they that mourn: for they shall be comforted. — Matthew 5:4 (KJV)",
        "body": """Blessed are they that mourn: for they shall be comforted. — Matthew 5:4 (KJV)

You have been trying to outrun the grief. To stay busy enough, spiritual enough, that the sadness cannot catch you. And on most days, it works. But on the days when it does catch you, the shame is almost worse than the grief itself — because you thought you should be over this by now.

Grief does not have a schedule. Loss does not follow a timeline you can plan around. And the woman who was never given permission to mourn carries the weight of unmourned things for years, sometimes decades, until the body begins to insist on what the spirit never allowed.

Jesus does not say blessed are those who have moved on. He says blessed are they that mourn. The mourning itself is the blessed condition — not because suffering is good, but because the willingness to feel it fully is the doorway to comfort.

The Greek word for comfort here is the same root as the Holy Spirit's name — the Paraclete, the one called alongside. The comfort that comes to those who mourn is not a distant comfort. It is the presence of the Spirit drawing alongside the grieving one, entering the mourning rather than ending it.

You cannot be comforted in a wound you refuse to acknowledge. The comfort is real. It is available. But it comes to the honest one, the one who stops pretending and lets the grief be what it is.

Mourn what needs to be mourned. You are not weak. You are human. And the Comforter is near.

Come as you are. https://sanctuary-grace.com/"""
    },
    12: {
        "title": "God Is Not Your Audience",
        "scripture": "God is love. — 1 John 4:8 (KJV)",
        "body": """God is love. — 1 John 4:8 (KJV)

You have been performing for so long that you have forgotten what it feels like to simply be. To enter the presence of God without an agenda, without a list, without the quiet fear that if you are not useful you will not be welcome.

But God is not your audience. He is not waiting for you to perform correctly before he draws near. His love is not contingent on your output. He is not more present when you pray eloquently and more distant when you cannot find the words.

He is love. Not a God who sometimes loves, whose affection fluctuates based on your behavior. The love is the substance of who he is — the eternal, unchanging, relentless love that pursued you before you knew to look for it and will hold you long after you have stopped trying to earn it.

John does not say God loves. He says God is love. The distinction matters. Love is not something God does as one of many activities. It is what he is. And it is turned toward you, completely, even now, even in this moment when you feel least deserving of it.

This does not mean nothing matters. It means everything begins from love, not toward it. You do not earn your way into his presence. You are already held there.

Today, try not to perform. Sit quietly. Say nothing if nothing comes. Let the love hold you without trying to deserve it.

Come as you are. https://sanctuary-grace.com/"""
    },
    13: {
        "title": "When You Cannot Pray",
        "scripture": "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered. — Romans 8:26 (KJV)",
        "body": """Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered. — Romans 8:26 (KJV)

There are seasons when prayer dries up. When you sit in the silence and have nothing to say — no words for what you are carrying, no language for the ache, no petition that feels adequate for the size of what you are facing.

This is not spiritual failure. This is the place Paul addresses directly.

The wordless groan. The breath that cannot form itself into a sentence. The showing up before God with empty hands and no prepared remarks. The Holy Spirit takes what you cannot articulate and carries it to the Father in language that transcends human speech.

You do not have to find the right words. You do not have to be coherent. The infirmities Paul speaks of include not knowing how to pray — which means the very incapacity you are experiencing is something the Spirit was sent to help with.

Sometimes the prayer is just being present. Sometimes it is just sitting in the room. The Spirit who searches all things takes your silence and your tears and your exhaustion and speaks on your behalf with a thoroughness you could not manage even on your best day.

This is grace beyond what we usually think to ask for: that when we cannot pray, the Spirit prays in us.

You are not doing it wrong. You are exactly where prayer sometimes lives.

Come as you are. https://sanctuary-grace.com/"""
    },
    14: {
        "title": "Enough for Today",
        "scripture": "Give us this day our daily bread. — Matthew 6:11 (KJV)",
        "body": """Give us this day our daily bread. — Matthew 6:11 (KJV)

Jesus taught us to ask for today's portion. Not this week's portion. Not enough to get through the month. Today. This day. This morning's measure of grace.

The woman who is anxious about the future is trying to borrow provision for days she has not yet lived. She is exhausting herself carrying the weight of next week on a body that only has capacity for today. And the weight is crushing her — not because the future is unbearable, but because it is not hers to carry yet.

The pattern of manna in the wilderness was not accidental. God gave enough for one day. When they tried to gather more, it spoiled. The daily dependence was the design. The returning each morning to receive what they needed was the lesson that could not be learned any other way: I am your source. Come back to me. Again and again. Every morning.

This is still the invitation. Not to secure next month's supply before you can rest, but to receive today's bread today and trust that when tomorrow arrives, he will be there with tomorrow's portion.

What do you need today? Not eventually. Today. Ask for that. Receive that.

Today's bread is enough for today. The God who provided this morning will provide tomorrow. But you cannot live on tomorrow's grace. Only on today's.

Come as you are. https://sanctuary-grace.com/"""
    },
    15: {
        "title": "You Are Dust and You Are Held",
        "scripture": "For he knoweth our frame; he remembereth that we are dust. — Psalm 103:14 (KJV)",
        "body": """For he knoweth our frame; he remembereth that we are dust. — Psalm 103:14 (KJV)

You have been angry at your limitations. The body that cannot keep the pace your will demands. The mind that reaches a wall after a certain number of hours. The emotional capacity that runs out faster than you think it should. You have been pushing past these edges for years, treating limitation as a character flaw rather than a design feature.

But God knows your frame. He made your frame. The limitation is not a mistake he is waiting for you to overcome. It is built into the design — intentionally, wisely — as a boundary that keeps you returning to the One who has no limits.

He remembereth that we are dust. The word remember here does not suggest he had forgotten. It means he keeps this truth present and active in how he relates to you. He does not deal with you as though you were infinite. He deals with you as the dust creature you are — with all the tenderness and accommodation that requires.

Your exhaustion is not evidence that you are failing. It is evidence that you are finite. And finitude is not a spiritual problem. It is the human condition — the very condition God himself took on when he put on flesh and needed to sleep.

Today, instead of fighting your limitations, try befriending one. Acknowledge where your edge is. Stop before you hit it. Let the boundary do what it was designed to do.

You are dust. And dust, held in the hands of God, becomes something breathtaking.

Come as you are. https://sanctuary-grace.com/"""
    },
    16: {
        "title": "Beloved Before the Doing",
        "scripture": "And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased. — Matthew 3:17 (KJV)",
        "body": """And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased. — Matthew 3:17 (KJV)

These words were spoken before Jesus had done a single miracle. Before the Sermon on the Mount. Before he healed anyone, taught anyone, gave himself for anyone. The Father's declaration of pleasure was not a reward for performance. It was a statement of identity before the work began.

This is your inheritance in Christ: the same belovedness that the Father spoke over the Son is now spoken over you, because you are hidden in him. The beloved Son has brought you into the family. And the Father's delight in the Son extends to all who belong to him.

If your sense of who you are is built on what you do, then your identity is only as stable as your productivity. A hard season becomes an identity crisis. But the belovedness is beneath the doing. It is not something you build. It is something you were given.

The spiritual work is not to achieve this status. It is to believe it. To let the Father's declaration become the foundation from which you move through the world, rather than the reward you are still striving to reach.

Before the credentials. Before the service record. Before the list of ways you have been useful — you are beloved. The voice from heaven has spoken it over your life in Christ, and no season of failure or limitation can change what the Father has declared.

You are beloved today. Before you have done a single thing.

Come as you are. https://sanctuary-grace.com/"""
    },
    17: {
        "title": "The Courage to Receive",
        "scripture": "Every good gift and every perfect gift is from above, and cometh down from the Father of lights. — James 1:17 (KJV)",
        "body": """Every good gift and every perfect gift is from above, and cometh down from the Father of lights. — James 1:17 (KJV)

Receiving is harder than giving. You know how to give. You have practiced it until it is second nature. But someone offers you help, and your first instinct is to decline. Someone speaks kindness over you, and something in you deflects it before it can land.

You have made yourself un-receivable.

It is not humility. It is armor. Somewhere you decided that needing was dangerous — that to receive care was to be in someone's debt, or to admit a weakness, or to take up too much space. So you closed off that channel and called the closing godliness.

But James says every good gift comes down from the Father. He is the source of all that is given and received in this world. And when you refuse the gifts — including the gift of being cared for by others — you are refusing something he sent.

To receive well is an act of faith. It says: I believe that good things come from God, and I will not deflect what he has provided. It says: I am willing to be the recipient for once, rather than always the source.

The Father of lights does not send good gifts toward you so that you can redirect them to someone more deserving. They were sent for you. With full knowledge of who you are. With full awareness of your need.

Today, practice receiving one small thing without deflecting. Let it land. Let it count.

Come as you are. https://sanctuary-grace.com/"""
    },
    18: {
        "title": "Something New in the Wilderness",
        "scripture": "Behold, I will do a new thing; now it shall spring forth; shall ye not know it? I will even make a way in the wilderness, and rivers in the desert. — Isaiah 43:19 (KJV)",
        "body": """Behold, I will do a new thing; now it shall spring forth; shall ye not know it? I will even make a way in the wilderness, and rivers in the desert. — Isaiah 43:19 (KJV)

You have been staring at what was and cannot see what is becoming. The old season ended in a way that left marks, and the marks have made you cautious about new beginnings — because new beginnings have disappointed you before, and you have learned to guard yourself against hope that might not hold.

But God announces the new thing. He does not wait until it is finished to reveal it. He says behold — look now, while it is still springing forth, while the path is still forming. He invites you to perceive it before it is complete.

The wilderness is real. The desert is real. He does not pretend these away. But he makes a way through them. Not around. Through.

This matters because you may be waiting for the wilderness to end before you believe the new thing is real. But the way is made in the wilderness itself — while you are still in it, while the ground is still dry, while the path has not yet become obvious to anyone else.

The rivers he promises are not rivers that flow around the desert. They flow in the desert. In the very place that has felt most barren, he places evidence of his presence.

Look up. Something is springing forth. It may be quiet. It may be subtle. But the One who made a way through the Red Sea is making a way now.

Do you not know it?

Come as you are. https://sanctuary-grace.com/"""
    },
    19: {
        "title": "Safe to Be Honest",
        "scripture": "Search me, O God, and know my heart: try me, and know my thoughts. — Psalm 139:23 (KJV)",
        "body": """Search me, O God, and know my heart: try me, and know my thoughts. — Psalm 139:23 (KJV)

David did not present God with a polished version of himself. He brought the real thing — the anger, the doubt, the questions that kept him up at night, the parts of his heart he barely understood himself. And he invited God into all of it.

You have been bringing God the edited version. The one that sounds appropriately humble and spiritually mature. The version that does not include the resentment, the exhaustion you are embarrassed by, the prayers you stopped praying because they were not answered the way you hoped.

But God already knows your thoughts before they are formed. The invitation in this psalm is not for his information — it is for your liberation. The act of naming what is real, honestly, before the God who already sees it, is how the hidden places begin to heal.

To say search me is to stop hiding. It is to open the rooms you have been keeping closed — not because God could not find them, but because you were not ready to go in there with him. This psalm is the moment of readiness. This prayer is the turning of the key.

You are safe to be honest with him. He will not be shocked. He will not love you less. He will not use it against you. He is not looking for reasons to condemn what you bring — he is looking for openings to heal it.

Bring the real thing today. All of it. Let him search what you have been hiding and find you there.

Come as you are. https://sanctuary-grace.com/"""
    },
    20: {
        "title": "When You Are Too Tired to Be Faithful",
        "scripture": "He giveth power to the faint; and to them that have no might he increaseth strength. — Isaiah 40:29 (KJV)",
        "body": """He giveth power to the faint; and to them that have no might he increaseth strength. — Isaiah 40:29 (KJV)

There are days when faithfulness is just showing up. When the prayer is short and the Bible stays closed and the most you can manage is a single sentence before you fall asleep. When the week has taken more than you had to give, and you are giving it anyway, from a deficit you cannot afford.

This is not spiritual failure. This is the human condition. And the God who gives power to the faint does not require you to have strength before he gives it.

The sequence matters. He gives to the faint. Not to the rested. Not to those who have already recovered and are asking for more. He gives to the one who is running on empty — which means the emptiness is the very condition that qualifies you to receive what you need.

You do not have to perform faithfulness when you are this tired. You only have to remain. Stay in the general direction of God. Keep your face pointed toward the light, even if you cannot feel the warmth.

The patriarchs of our faith were not extraordinary people. They were ordinary people who kept showing up to a God who kept showing up for them. The faithfulness was not in their strength — it was in their returning. Again and again. Through every season of depletion.

The strength you need is not stored inside you. It flows from outside, from the One who does not weary, who does not grow faint, who is never running low.

Come as you are. https://sanctuary-grace.com/"""
    },
    21: {
        "title": "Leaning Into Trust",
        "scripture": "Trust in the LORD with all thine heart; and lean not unto thine own understanding. — Proverbs 3:5 (KJV)",
        "body": """Trust in the LORD with all thine heart; and lean not unto thine own understanding. — Proverbs 3:5 (KJV)

You are very good at understanding. It is one of the tools you have used to stay safe — if you can analyze the situation, anticipate the outcomes, prepare for every possibility, you feel less vulnerable. Knowledge has been your armor.

But there are seasons when understanding fails. When the situation does not make sense no matter how many angles you approach it from. When the why remains unanswered and the how remains unclear and you are left standing in front of something your comprehension cannot hold.

This is where trust lives. Not in the season when everything makes sense. In the season when it does not.

Lean not unto thine own understanding. The word lean suggests weight-bearing — the way you lean against a wall, putting your full weight on it and trusting it to hold. Solomon is saying: do not put that weight on what you can figure out. The wall of human understanding will not hold the weight of a life.

But the LORD will. All thine heart — not a portion. Not the parts you have decided are safe to surrender while you keep managing the rest. All of it. The full weight of everything you are carrying.

You do not have to understand it to survive it. You only have to trust the One who does understand it — who sees the end from the beginning and holds both in his hands.

That is a wall that will not fall.

Come as you are. https://sanctuary-grace.com/"""
    },
    22: {
        "title": "What You Carry in Secret",
        "scripture": "Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28 (KJV)",
        "body": """Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28 (KJV)

The thing you carry in secret is the heaviest. The grief you have not told anyone about. The fear that lives in the part of you no one sees. The failure you have tucked away where it cannot be discovered. The longing for something you are not sure you are allowed to want.

Secret burdens do not stay contained. They seep. They color everything — the way you interpret a glance, the way you respond to kindness, the way you lie awake at 3am turning over what cannot be fixed in the dark.

Jesus said come. He did not specify the presentable burdens only. He said all ye that labour and are heavy laden — which includes the things you have never said out loud, the burdens you carry alone because you cannot imagine handing them to another person.

He can hold what no other person can. He is not shocked by the weight. He is not overwhelmed by the contents. He has already absorbed the fullness of human suffering on the cross, and his offer of rest is not a small thing. It is the deep, settling rest that comes when the hiding is finally over.

You do not have to explain it perfectly. You do not have to understand it. You only have to bring it to the One who already knows it and is waiting not to judge it, but to lift it.

He is waiting. And he has never turned away the one who came honestly.

Come as you are. https://sanctuary-grace.com/"""
    },
    23: {
        "title": "The Long Middle",
        "scripture": "And let us not be weary in well doing: for in due season we shall reap, if we faint not. — Galatians 6:9 (KJV)",
        "body": """And let us not be weary in well doing: for in due season we shall reap, if we faint not. — Galatians 6:9 (KJV)

The beginning had energy. The ending will have resolution. But you are in the middle — the long, unglamorous, faithfulness-requiring middle where nothing seems to be happening fast enough and the finish line is not yet visible.

Paul wrote to people who were weary in well doing. Not people who had given up. People who were still showing up but barely — who needed someone to tell them that the not-giving-up was itself the harvest in progress.

Due season is not your season. It is God's. The harvest does not consult your timeline before it arrives. The reaping comes when the conditions are right — which is a reality that requires you to keep doing the faithful thing even when the evidence of fruit is not yet visible.

This is the harder obedience: to continue in the quiet, faithful, unseeing work. To serve without applause. To give without visible return. To pray without immediate answer. To plant in ground that looks unlikely to produce and trust the One who makes things grow.

The middle is not a failure. It is the work. It is the place where character is formed, where faithfulness gets its truest test, where the roots go down into soil that is harder than the surface suggested.

You are in the middle. Stay. The due season has not been canceled. It is coming.

And you are closer than you know.

Come as you are. https://sanctuary-grace.com/"""
    },
    24: {
        "title": "Fear Is Not Your Voice",
        "scripture": "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind. — 2 Timothy 1:7 (KJV)",
        "body": """For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind. — 2 Timothy 1:7 (KJV)

Fear has been speaking in your voice for so long you have started to believe it is your voice. It tells you to stay small, to stay safe, to protect yourself before something takes what you have not fully secured. It wears the face of wisdom and calls its contraction prudence, its shrinking discernment.

But the spirit of fear is not from God. Paul is unambiguous. The voice that contracts your life, that whispers you will fail, that keeps you circling the edge of what you were made for without ever stepping into it — that voice was not given to you by the One who made you.

What God has given is more expansive than we usually remember. Power — not arrogance, but genuine God-given capacity to act, to move, to step forward in the face of uncertainty. Love — the kind that casts out fear because it is larger than fear, because it has already calculated the cost and chosen the beloved anyway. And a sound mind — the Greek word is sophronismos, a disciplined, clear-eyed wisdom that sees without the distortion of panic.

You are allowed to live from that spirit. You are not required to obey the fear.

Today, notice where fear has been making decisions you thought you were making. And choose, once, to act from the spirit you were actually given.

Power. Love. A sound mind.

Come as you are. https://sanctuary-grace.com/"""
    },
    25: {
        "title": "The Faithful Witness of Your Own Life",
        "scripture": "Strength and honour are her clothing; and she shall rejoice in time to come. — Proverbs 31:25 (KJV)",
        "body": """Strength and honour are her clothing; and she shall rejoice in time to come. — Proverbs 31:25 (KJV)

You have survived things that would have undone someone less rooted. You have rebuilt yourself more than once, quietly, without asking anyone to admire the work. You have shown up when showing up was the hardest thing. You have loved people through their worst seasons while holding your own pain carefully out of their way.

This is not nothing. This is a testimony written in the substance of a life.

The woman in Proverbs does not fear the time to come because she knows who she is — not what she has accomplished, but who she is, the depth of what she carries, the faithfulness she has demonstrated through seasons no one fully witnessed. Her clothing is not something she purchased. It is something she became.

You are that woman. Not the polished version. The real version — the one with scars and unanswered questions and a faith that has been tested in fire and has held even when it was barely holding.

The rejoicing in time to come is not naivety. It is the confidence of a woman who has been through enough to know that she has what it takes — not because she is extraordinary, but because the God who has walked with her this far is not going to stop in the next season, or the one after that.

You are clothed in more than you know. And the time to come is not beyond what you can bear.

Come as you are. https://sanctuary-grace.com/"""
    },
    26: {
        "title": "A Tenderness Toward Yourself",
        "scripture": "Thou shalt love thy neighbour as thyself. — Mark 12:31 (KJV)",
        "body": """Thou shalt love thy neighbour as thyself. — Mark 12:31 (KJV)

The command assumes you love yourself. Not the performance of self-regard — the curated presentations of wholeness. The real thing. The quiet, steady tenderness toward your own soul that you would extend, without hesitation, to a beloved friend in the same situation.

You would not speak to a friend the way you speak to yourself. You would not tell her that her rest is selfish, her needs are inconvenient, her grief is indulgent, her pace is an embarrassment. You would hold her. You would tell her she is doing the best she can. You would mean it.

She deserves from you what you would give her. And so do you.

This is not selfishness. It is the prerequisite for genuine love. The woman who has no tenderness left for herself cannot give it from an honest place. She gives from depletion and calls it devotion, and eventually the depletion wins and neither she nor anyone near her receives what real love actually looks like.

Christ loved us while we were yet sinners — not after we had cleaned ourselves up, not after we had become worthy of the love. He loved us in our unloveliness. That is the model. Not the love that waits until the recipient has earned it.

You are your own neighbor too. The command applies.

Today, try one act of tenderness toward yourself. A rest you did not earn. A grace you did not deserve.

Come as you are. https://sanctuary-grace.com/"""
    },
    27: {
        "title": "The Calling That Has Not Been Canceled",
        "scripture": "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them. — Ephesians 2:10 (KJV)",
        "body": """For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them. — Ephesians 2:10 (KJV)

There is something in you that was made on purpose. Not as an afterthought, not as a rough draft, but as workmanship — a word that in the Greek is poiema, the same root as poem. You are the handiwork of a God who makes things with intention and craft and meaning.

The works he prepared were ordained before you arrived in them. They are not contingent on your timeline, your performance record, or the detours your life has taken. They were prepared in advance — which means the preparation took into account every season you would walk through before you reached them, including this one.

But the calling can feel buried under the exhaustion, the detour, the season that has lasted longer than you planned. You knew once what you were made for. And somewhere between then and now, that knowing got covered over.

The works are still prepared. God does not cancel the poem because a difficult chapter has been written.

You have not been disqualified. You have not missed the window. He reroutes. He redeems. He takes what looked like detour and weaves it into what he was building all along — because he is not surprised by anything that has happened, and his purposes are not thwarted by what catches us off guard.

The calling is not buried. It is waiting. And you are not behind — you are becoming.

Come as you are. https://sanctuary-grace.com/"""
    },
    28: {
        "title": "Held in the Hard Season",
        "scripture": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me. — Psalm 23:4 (KJV)",
        "body": """Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me. — Psalm 23:4 (KJV)

He does not say you will not walk through the valley. He says through.

The valley is not the destination. It is the path. And the path has a guide — the LORD himself, walking through it with you. Not ahead of you waving from the other side. Not watching from a safe distance. Present. Staff in hand. Close enough to touch.

This season has been hard in ways that are difficult to name. The darkness has been real. The length of it has surprised you. You came in thinking it would be shorter, and it has stretched beyond what you thought you could bear, and somehow you are still bearing it.

That endurance is not your own strength. That staying power comes from the One who has been with you every step — even the steps you cannot remember clearly, even the steps you took alone at 3am when you were certain no one was there.

The shadow of death is not death itself. It is the valley where death casts its shadow — where the darkness is enough to obscure the path, where the fear is enough to feel like the end. But the Shepherd walks in the shadow without losing sight of you.

You are not alone in the valley. You have never been alone in the valley.

Fear no evil. Not because nothing bad can happen, but because the One who walks with you is greater than what pursues you.

Come as you are. https://sanctuary-grace.com/"""
    },
    29: {
        "title": "The Woman You Are Becoming",
        "scripture": "But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image from glory to glory, even as by the Spirit of the Lord. — 2 Corinthians 3:18 (KJV)",
        "body": """But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image from glory to glory, even as by the Spirit of the Lord. — 2 Corinthians 3:18 (KJV)

You are not finished. The version of you that exists right now is not the final draft. You are mid-transformation — which means the process is incomplete, the edges are still rough, and there are parts of you that have not yet become what they are becoming.

This should be a relief.

Being changed means the hard seasons are not wasted. The failures are not disqualifying. The wilderness is not the end of the story. Even the places where you have been most lost are part of the path that leads toward the image of the One who holds you.

From glory to glory. Not all at once. Gradually, continuously, in a direction that moves toward him — which is always a direction that moves toward your truest self, the self that was designed before the wounding, before the survival mode took over, before the world had its way with you for a season.

The Spirit is the agent of the transformation. You are not managing this process. You are beholding — turning your face toward the glory of the Lord and allowing the looking to change you in ways you cannot manufacture through effort.

You are becoming. Even today. Even in this season that feels like stagnation.

The glory is increasing even when you cannot see it. Trust the Spirit. Trust the process.

Come as you are. https://sanctuary-grace.com/"""
    },
    30: {
        "title": "New Every Morning",
        "scripture": "It is of the LORD'S mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness. — Lamentations 3:22-23 (KJV)",
        "body": """It is of the LORD'S mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness. — Lamentations 3:22-23 (KJV)

Every morning is a beginning. Not a continuation of yesterday's failures. Not a resumption of the burden you were carrying when you fell asleep. A new morning. New mercies. The same faithful God who was there yesterday, present again today, with fresh grace for whatever this day holds.

You have been carrying yesterday's weight into today. The shame of what you did not finish, where you fell short, how you failed the people you love. You have been treating the new morning as if the old account still stands — as if the mercies were not actually new.

But they are new. Lamentations was written inside devastation — the city in ruins, the exile underway, the worst imaginable thing having actually happened. This is not poetry from a comfortable season. This is testimony from the wreckage.

And from inside that wreckage, Jeremiah found the one thing that held: the faithfulness of a God whose compassions do not fail. Not because circumstances improved. Because God did not change.

If the mercies were new in the ruins of Jerusalem, they are new for you today.

Whatever yesterday held — whatever the last season held — this morning is a door. Step through it without the old weight. Receive what is fresh.

His faithfulness is great. His compassions have not failed. And this morning is new.

Come as you are. https://sanctuary-grace.com/"""
    },
}

# ─── SELECT TODAY'S DEVOTION ─────────────────────────────────────────────────

devotion = DEVOTIONS[day_number]
draft_title = devotion['title']
draft_body = devotion['body']

# ─── PUBLISH VIA SUBSTACK DRAFTS API ────────────────────────────────────────

if not SUBSTACK_COOKIE_ID:
    print("ERROR: SUBSTACK_COOKIE_ID environment variable is not set.")
    print(f"Title: {draft_title}")
    print("Add SUBSTACK_COOKIE_ID to GitHub Secrets to enable publishing.")
    exit(1)

cookie_header = f'connect.sid={SUBSTACK_COOKIE_ID}'
headers = {
    'Content-Type': 'application/json',
    'Cookie': cookie_header,
}

# Step 1: Create draft
print(f"Creating draft: {draft_title}")
payload = json.dumps({
    "draft_title": draft_title,
    "draft_body": draft_body,
    "draft_subtitle": "",
}).encode('utf-8')

try:
    req = urllib.request.Request(
        f'{BASE_URL}/api/v1/drafts',
        data=payload,
        headers=headers,
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read())
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"FAILURE: Draft creation failed with HTTP {e.code}")
    print(f"Response: {body[:500]}")
    exit(1)
except Exception as e:
    print(f"FAILURE: {e}")
    exit(1)

draft_id = result.get('id')
if not draft_id:
    print(f"FAILURE: Draft created but no id in response: {result}")
    exit(1)

print(f"SUCCESS: Draft created — id: {draft_id}")

# Step 2: Publish draft
print(f"Publishing draft {draft_id} ...")
try:
    pub_req = urllib.request.Request(
        f'{BASE_URL}/api/v1/drafts/{draft_id}/publish',
        data=b'{}',
        headers=headers,
        method='POST',
    )
    with urllib.request.urlopen(pub_req, timeout=30) as resp:
        pub_result = json.loads(resp.read())
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"FAILURE: Publish failed with HTTP {e.code}")
    print(f"Response: {body[:500]}")
    exit(1)
except Exception as e:
    print(f"FAILURE during publish: {e}")
    exit(1)

post_url = pub_result.get('canonical_url', pub_result.get('url', ''))
print(f"SUCCESS: Published — {post_url or pub_result}")
print(f"Date: {date_str} | Day: {day_number} | Title: {draft_title}")
