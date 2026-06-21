import os, datetime, pathlib, json, urllib.request, urllib.error

SUBSTACK_SESSION_COOKIE = os.environ.get('SUBSTACK_SESSION_COOKIE', '').strip()
SUBSTACK_PUBLICATION_URL = os.environ.get('SUBSTACK_PUBLICATION_URL', '5apop2sotwm.substack.com').strip()
MODE_OVERRIDE = os.environ.get('MODE_OVERRIDE', '').strip()

today = datetime.date.today()
day_name = today.strftime('%A')
date_str = today.strftime('%Y-%m-%d')
start_date = datetime.date(2026, 5, 26)
day_number = ((today - start_date).days % 30) + 1
week_number = ((today - start_date).days // 7) % 5

mode = MODE_OVERRIDE if MODE_OVERRIDE else ('sunday' if day_name == 'Sunday' else 'daily')

# ─── 30 DAILY DEVOTIONS ───────────────────────────────────────────────────────

DAILY_SCHEDULE = {
    1: {
        "title": "The Weight You Were Never Meant to Carry",
        "body": """Cast all your anxiety on him because he cares for you. — 1 Peter 5:7

You have been carrying it so long that you have forgotten it was never yours to begin with. The weight of other people's disappointment. The fear of not being enough. The quiet dread that if you slow down, everything will fall apart.

You picked it up gradually — one responsibility at a time, one yes when your whole body said no. And somewhere between the first burden and the hundredth, you stopped noticing it was there. It just became who you were.

But Peter does not say manage your anxiety. He does not say organize it or push through it. He says cast it. The word is violent and complete. A throwing off. A release that requires a decision.

God is not asking you to hand him a portion of what troubles you while you hold the rest. He is asking for all of it.

You do not have to figure out how to feel less burdened before you come to him. You come burdened. That is the invitation.

Lay it down today. Not because you have the strength to carry it any further. But because the One who holds the universe is asking you to let him hold you.

Come as you are. https://sanctuary-grace.com/"""
    },
    2: {
        "title": "Permission to Stop",
        "body": """Be still, and know that I am God. — Psalm 46:10

This is not a suggestion. It is not a reward for those who have finished everything on their list. It is a command — and like all of God's commands, it is also an invitation.

Be still.

You have been moving for so long that stillness feels like failure. Like something is wrong with you if you are not producing, helping, fixing, serving. You have confused motion with faithfulness and rest with laziness, and the confusion has cost you something deep.

But God does not need your motion. He was God before you got up this morning. He will be God long after this day ends. Your stillness does not diminish him. It returns you to yourself.

The knowing comes in the stopping. Not in the striving. You cannot know — truly know, in your bones — that he is God while you are sprinting past him.

Today, stop for five minutes. Not to pray a perfect prayer. Not to read a chapter. Just to be present with the One who has been present with you through all of it.

You have permission to stop. You always did.

Come as you are. https://sanctuary-grace.com/"""
    },
    3: {
        "title": "When You Have Given Everything Away",
        "body": """The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. — Psalm 23:1-2

She gave until there was nothing left. Not because she was weak, but because she had been taught, somewhere along the way, that her worth lived in what she could offer. So she offered everything. And when the offering was finished, she stood empty and wondered why she felt so far from God.

Depletion is not consecration. Emptiness is not holiness. The woman who has given herself away completely is not more faithful — she is more lost.

The Shepherd does not lead the exhausted sheep to the next task. He makes her lie down. The word is tender and firm in equal measure. He does not ask her if she is ready. He leads her to the place her soul has been avoiding — the green pasture, the still water, the restoration that feels too slow and too quiet for someone used to moving.

You are not too far gone for the Shepherd to reach. You are not too depleted for the well to fill again. But you have to let him lead you to the water. You have to be willing to lie down.

Today, let him be enough. You do not have to produce anything. You only have to follow.

Come as you are. https://sanctuary-grace.com/"""
    },
    4: {
        "title": "The Lie That Rest Must Be Earned",
        "body": """Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28

He does not say come when you have finished. He does not say come when you have earned it, when you have been productive enough, faithful enough, useful enough to deserve a moment of peace.

He says come weary. Come burdened. Come exactly as you are right now, with the undone list and the tired body and the heart that has been running on empty for longer than you want to admit.

We have built an entire theology around earning rest. We rest on Sunday because we worked all week. We take a vacation because we completed the project. We allow ourselves to feel peace after the crisis has passed. But this is not the Gospel. The Gospel says rest is not a reward. It is a gift offered to those who are too tired to keep refusing it.

You do not have to earn what he has already offered. You only have to receive it.

The weariness you feel today is not a sign of spiritual failure. It is a sign that you are human, and that you have been trying to do in your own strength what was never meant to be carried alone.

Come. He is not waiting for a better version of you.

Come as you are. https://sanctuary-grace.com/"""
    },
    5: {
        "title": "Surviving Is Not Enough",
        "body": """I have come that they may have life, and have it to the full. — John 10:10

You are good at surviving. You have done it more times than most people know. You rebuilt yourself quietly, without applause, without anyone fully understanding what it cost. And you learned to function in the wreckage — because functioning felt like victory, and victory felt like proof that you were still standing.

But surviving was never the destination. Jesus did not come so that you could manage. He came so that you could live — fully, deeply, with roots that go down into something that does not shake when the wind comes.

The woman who has been in survival mode for years does not always know how to receive abundance. The abundance feels suspicious. She is waiting for the other shoe to drop, for the peace to be taken, for the goodness to prove itself a trick.

But the life Jesus offers is not fragile. It does not depend on your circumstances holding together. It is the kind of life that sustains you inside the difficulty — not after it, not around it, but in the middle of it.

You deserve more than survival. Not because you earned it. Because the One who holds your life is not a God of bare minimum.

Come as you are. https://sanctuary-grace.com/"""
    },
    6: {
        "title": "The Woman Who Cannot Be Still",
        "body": """Return to your rest, my soul, for the Lord has been good to you. — Psalm 116:7

She fills every silence. Not with noise, necessarily — but with movement. Another task, another plan, another conversation she initiates to avoid the one she is not having with herself. She has learned that busyness is safer than stillness. Because in the stillness, the things she has not processed begin to rise.

If this is you, I am not here to shame you. I am here to tell you that the avoidance makes sense, and that God is not surprised by it.

But the soul that cannot be still is a soul that is not resting. And a soul that is not resting is a soul that is slowly unraveling — even if no one can see it yet, even if you have become very good at looking composed.

Return. That is the word. Not arrive somewhere new. Return — to the place you knew before the striving began, before the survival mode took over, before you forgot that being held was something you were allowed to receive.

The Lord has been good to you. Even in the hard seasons. Even when you could not feel it. The goodness is the reason you can return. Not your own worthiness. His faithfulness.

Come as you are. https://sanctuary-grace.com/"""
    },
    7: {
        "title": "Your Needs Are Not Inconvenient",
        "body": """For he satisfies the thirsty and fills the hungry with good things. — Psalm 107:9

Somewhere you learned that your needs were a burden. That wanting comfort, rest, tenderness, or help was a sign of weakness — or worse, a sign of selfishness. So you became very skilled at not needing. At anticipating everyone else's needs while quietly ignoring your own.

But a thirst you refuse to name does not go away. It goes underground. It shows up as resentment, as exhaustion, as a low-grade grief you cannot explain to anyone. And eventually, it shows up as an inability to give the very thing you have been pouring out — because you have been drawing from a well you never allowed anyone to fill.

God satisfies the thirsty. Not the person who has mastered pretending they are not thirsty. Not the woman who has convinced everyone, including herself, that she needs nothing. The thirsty one. The honest one. The one who finally admits she is dry.

Your needs are not inconvenient to God. He is not burdened by your hunger. He is the answer to it.

Name what you need today. You do not have to fix it. Just name it — to yourself, to him. Honesty is the beginning of being filled.

Come as you are. https://sanctuary-grace.com/"""
    },
    8: {
        "title": "When Faith Feels Far Away",
        "body": """The Lord is close to the brokenhearted and saves those who are crushed in spirit. — Psalm 34:18

There are seasons when faith does not feel like faith. When prayer feels like speaking into a ceiling. When the scripture you have loved for years sounds flat on the page. When you go through the motions because stopping entirely feels like a betrayal of everything you have built your life around.

You are not losing your faith. You are in the desert.

The desert is not punishment. It is not evidence that God has moved. The mystics knew this — the silence that feels like absence is often the place where the roots grow deepest, where the soul is stripped of everything that was performance and left with what is real.

The Lord is close to the brokenhearted. Not the triumphant. Not the thriving. The brokenhearted — the woman who is holding her faith together with trembling hands and wondering if it will be enough.

It will be enough. Not because of your grip. Because of his.

You do not have to feel his presence for it to be real. You do not have to manufacture the joy. Just stay. Keep showing up, even when it feels hollow. He is closer than the silence feels.

Come as you are. https://sanctuary-grace.com/"""
    },
    9: {
        "title": "The Slow Work of Healing",
        "body": """He heals the brokenhearted and binds up their wounds. — Psalm 147:3

You wanted to be further along by now. You thought the healing would come faster — that at some point you would wake up and the weight would be gone, the old patterns replaced, the wounds sealed over into something that no longer hurt when pressed.

But healing does not work the way we want it to. It is not linear. It does not arrive on schedule. It comes in waves — forward and back, better and then raw again — and the rawness can feel like failure when it is actually just part of the process.

God heals. He binds up. These are not passive acts. They are deliberate, personal, attentive. The image is of a physician who knows exactly where it hurts and does not rush the treatment.

He is not finished with you. The fact that you are still in the middle does not mean you are stuck. It means the work is still happening — underneath the surface, in the places you cannot see, at a pace that is slower than you want and more thorough than you know.

Be patient with yourself today. You are not behind. You are healing. Those are not the same thing.

Come as you are. https://sanctuary-grace.com/"""
    },
    10: {
        "title": "You Were Made for More Than This Exhaustion",
        "body": """But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint. — Isaiah 40:31

This is a promise for the woman who has been running on fumes. Not for the woman who has it together. Not for the woman who has already rested and renewed and returned. For the one who is faint. For the one who cannot imagine soaring because she can barely walk.

Hope in the Lord. Not hope that circumstances will improve. Not hope that the hard season will end soon. Hope in him — the unchanging, unshakeable, always-present God who sees you exactly as you are and is not diminished by your exhaustion.

The renewal is not something you manufacture. It is something you receive. It flows from the act of waiting on him — of being honest that you have run out, of turning toward the only One who can replenish what striving has drained.

You were not made for permanent exhaustion. The weariness you feel is real, but it is not your destiny. There is still soaring ahead of you. There is still a version of you who walks without fainting.

But she is found in the waiting. In the hoping. In the quiet turning toward the One who renews.

Come as you are. https://sanctuary-grace.com/"""
    },
    11: {
        "title": "Grief Does Not Disqualify You",
        "body": """Blessed are those who mourn, for they will be comforted. — Matthew 5:4

You have been trying to outrun the grief. To stay busy enough, productive enough, spiritual enough that the sadness cannot catch you. And on most days, it works. But on the days when it does catch you, the shame is almost worse than the grief itself — because you thought you should be over this by now.

Grief does not have a schedule. Loss does not follow a timeline you can plan around. And the woman who was never given permission to mourn carries the weight of unmourned things for years, sometimes decades, until the body begins to insist on what the spirit never allowed.

Jesus does not say blessed are those who have moved on. He says blessed are those who mourn. The mourning itself is the blessed thing — not because suffering is good, but because the willingness to feel it fully is the doorway to comfort.

You cannot be comforted in a wound you refuse to acknowledge. The comfort is real. It is available. But it comes to the honest one, the one who stops pretending and lets the grief be what it is.

Mourn what needs to be mourned. You are not weak. You are human. And the Comforter is near.

Come as you are. https://sanctuary-grace.com/"""
    },
    12: {
        "title": "The God Who Does Not Require Performance",
        "body": """God is love. — 1 John 4:8

You have been performing for so long that you have forgotten what it feels like to simply be. To enter a room without calculating what is needed. To sit with God without an agenda, without a list, without the quiet fear that if you are not useful you will not be welcome.

But God is not your audience. He is not waiting for you to perform correctly before he draws near. His love is not contingent on your output. He is not more present when you pray eloquently and more distant when you cannot find the words.

He is love. Not a God who sometimes loves. Not a God whose love fluctuates based on your behavior. The love is the substance of who he is — and it is turned toward you, completely, even now.

This does not mean nothing matters. It means everything begins from love, not toward it. You do not earn your way into his presence. You are already held there.

Today, try not to perform. Sit quietly. Say nothing if nothing comes. Let the love hold you without trying to deserve it.

He is not grading the session. He is glad you are here.

Come as you are. https://sanctuary-grace.com/"""
    },
    13: {
        "title": "When You Cannot Pray",
        "body": """In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans. — Romans 8:26

There are seasons when prayer dries up. When you sit in the silence and have nothing to say — no words for what you are carrying, no language for the ache, no petition that feels adequate for the size of what you are facing.

This is not spiritual failure. This is the place where Paul says the Spirit steps in.

The wordless groan. The breath that cannot form itself into a sentence. The showing up before God with empty hands and no prepared remarks. This is a form of prayer the Holy Spirit takes and carries to the Father in language that transcends what you can articulate.

You do not have to find the right words. You do not have to be coherent. You do not have to present a well-organized prayer that covers all the appropriate topics.

Sometimes the prayer is just being present. Sometimes it is just sitting in the room. And the Spirit who searches all things takes your silence and your tears and your exhaustion and speaks on your behalf.

You are not doing it wrong. You are exactly where prayer sometimes lives.

Come as you are. https://sanctuary-grace.com/"""
    },
    14: {
        "title": "Enough for Today",
        "body": """Give us today our daily bread. — Matthew 6:11

Jesus taught us to ask for today's portion. Not this week's, not enough to get through the month, not a stockpile that would allow us to stop depending. Today. This day. This morning's measure of grace.

The woman who is anxious about the future is trying to borrow provision for days she has not yet lived. She is exhausting herself carrying the weight of next week on a body that only has capacity for today. And the weight is crushing her, not because the future is unbearable, but because it is not hers to carry yet.

Sufficient for the day is its own trouble, Jesus said. Not as a warning, but as a boundary. The day has a container. It is not designed to hold more than itself.

What do you need today? Not eventually. Today. Ask for that. Receive that. Trust that when tomorrow arrives, there will be provision for tomorrow too — but you cannot access it today, and you were never meant to.

Today's bread is enough for today. You do not have to secure next month's supply before you can rest.

Come as you are. https://sanctuary-grace.com/"""
    },
    15: {
        "title": "The Gift of Limitations",
        "body": """He knows how we are formed; he remembers that we are dust. — Psalm 103:14

You have been angry at your limitations. The body that cannot keep the pace your will demands. The mind that reaches a wall after a certain number of hours. The emotional capacity that runs out faster than you think it should. You have been pushing past these edges for years, treating limitation as a character flaw rather than a design feature.

But God knows you are dust. He made you dust. The limitation is not a mistake he is waiting for you to overcome. It is built into the form — intentionally, wisely, as a boundary that keeps you returning to the One who has no limits.

Your exhaustion is not evidence that you are failing. It is evidence that you are finite. And finitude is not a spiritual problem. It is the human condition — the condition God himself took on when he put on flesh and walked into our world and needed to sleep.

Today, instead of fighting your limitations, try befriending one. Acknowledge where your edge is. Stop before you hit it. Let the boundary do what it was designed to do.

You are dust. And dust, held in the hands of God, becomes something breathtaking.

Come as you are. https://sanctuary-grace.com/"""
    },
    16: {
        "title": "Identity Beneath the Doing",
        "body": """You are my beloved; with you I am well pleased. — Mark 1:11

These words were spoken before Jesus had done a single miracle. Before the Sermon on the Mount. Before he healed anyone, taught anyone, died for anyone. The Father's declaration of love was not a reward for performance. It was a statement of identity.

You are my beloved.

If your sense of who you are is built on what you do, then your identity is only as stable as your productivity. A bad season becomes an identity crisis. Illness becomes abandonment. Rest becomes loss of self. And you are left with the exhausting work of constantly earning the right to feel known.

But the belovedness is beneath the doing. It is not something you build. It is something you are. Before the credentials, before the service record, before the list of ways you have been useful — you are beloved.

The spiritual work is not to achieve this status. It is to believe it. To let it be the foundation from which you move through the world, rather than the reward you are still striving to reach.

You are beloved. Today. Before you have done a single thing.

Come as you are. https://sanctuary-grace.com/"""
    },
    17: {
        "title": "The Courage to Receive",
        "body": """Every good and perfect gift is from above, coming down from the Father of the heavenly lights. — James 1:17

Receiving is harder than giving. You know how to give. You have practiced it until it is second nature. But someone offers you help, and your first instinct is to decline. Someone speaks kindness, and something in you deflects it. Someone tries to care for you, and you redirect their attention to someone who needs it more.

You have made yourself un-receivable.

It is not humility. It is armor. Somewhere you decided that needing was dangerous — that to receive care was to be in someone's debt, or to admit a weakness, or to take up too much space. So you closed off that channel and called the closing godliness.

But every good gift comes from the Father. And when you refuse the gifts — including the gift of being cared for by others — you are refusing something he sent.

Today, practice receiving one small thing without deflecting. A compliment. An offer of help. A moment of beauty. Let it land. Let it count. Let yourself be the recipient for once, rather than always the source.

The Father gives good gifts. You are allowed to open them.

Come as you are. https://sanctuary-grace.com/"""
    },
    18: {
        "title": "A New Thing in the Wilderness",
        "body": """See, I am doing a new thing. Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland. — Isaiah 43:19

You have been staring at what was and cannot see what is becoming. The old season ended in a way that left marks, and the marks have made you cautious about new beginnings — because new beginnings have disappointed you before, and you have learned to protect yourself from hope that might not hold.

But God announces the new thing. He does not hide it until it is complete. He invites you to perceive it — to look up from the wilderness you are standing in and notice that something is moving, something is opening, something that looks like a path is forming where there was no path before.

The wilderness is real. The wasteland is real. He does not pretend these away. But he makes a way through them. Not around. Through.

You are not stuck in this season forever. The God who parts seas and opens rivers in dry ground is the same God standing in your wilderness right now. The new thing may be quiet. It may be subtle. But it is here.

Look up. Do you perceive it?

Come as you are. https://sanctuary-grace.com/"""
    },
    19: {
        "title": "Safe to Be Honest",
        "body": """Search me, God, and know my heart; test me and know my anxious thoughts. — Psalm 139:23

David did not present God with a polished version of himself. He brought the real thing — the anger, the doubt, the questions that kept him up at night, the parts of his heart he barely understood himself. And he invited God into all of it.

You have been bringing God the edited version. The one that sounds appropriately humble and spiritually mature. The version that does not include the resentment, the exhaustion you are embarrassed by, the prayers you stopped saying because they were not answered the way you hoped.

But God already knows your anxious thoughts. The invitation in this psalm is not for his information — it is for your liberation. The act of naming what is real, honestly, before the God who already sees it, is how the hidden places begin to heal.

You are safe to be honest with him. He will not be shocked. He will not love you less. He will not use it against you. He is not looking for reasons to condemn what you bring — he is looking for openings to heal it.

Bring the real thing today. All of it. Let him search what you have been hiding and find you there.

Come as you are. https://sanctuary-grace.com/"""
    },
    20: {
        "title": "When You Are Too Tired to Be Faithful",
        "body": """He gives strength to the weary and increases the power of the weak. — Isaiah 40:29

There are days when faithfulness is just showing up. When the prayer is short and the bible stays closed and the most you can manage is a single line before you fall asleep. When the week has taken more than you had to give, and you are giving it anyway, from a deficit you cannot afford.

This is not spiritual failure. This is the human condition. And the God who gives strength to the weary does not require you to have strength before he gives it.

The sequence matters. He gives to the weary. Not to the rested. Not to those who have already recovered. He gives to the one who is running on empty — which means the emptiness is the very condition that qualifies you to receive what you need.

You do not have to perform faithfulness when you are this tired. You only have to remain. Stay in the general direction of God. Keep your face pointed toward the light, even if you cannot feel the warmth.

The strength you need is not stored inside you. It flows from outside, from the One who does not weary, who does not grow faint, who is never running low.

Come as you are. https://sanctuary-grace.com/"""
    },
    21: {
        "title": "The Practice of Not Knowing",
        "body": """Trust in the Lord with all your heart and lean not on your own understanding. — Proverbs 3:5

You are very good at understanding. It is one of the tools you have used to stay safe — if you can analyze the situation, anticipate the outcomes, prepare for every possibility, you feel less vulnerable. Knowledge is your armor.

But there are seasons when understanding fails. When the situation does not make sense no matter how many angles you approach it from. When the why remains unanswered and the how remains unclear and you are left standing in front of something that your comprehension cannot hold.

This is where trust lives. Not in the season when everything makes sense. In the season when it does not.

Leaning not on your own understanding does not mean becoming passive or uninformed. It means acknowledging the edge of what you can know and choosing to place your weight on something other than your own analysis. It means believing that the God who holds the end of this story is trustworthy even when you cannot see the middle clearly.

You do not have to understand it to survive it. You only have to trust the One who does.

Come as you are. https://sanctuary-grace.com/"""
    },
    22: {
        "title": "What You Carry in Secret",
        "body": """Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28

The thing you carry in secret is the heaviest. The grief you have not told anyone about. The fear that lives in the part of you no one sees. The failure you have tucked away where it cannot be discovered. The longing for something you are not sure you are allowed to want.

Secret burdens do not stay contained. They seep. They color everything — the way you interpret a glance, the way you respond to kindness, the way you lie awake at 3am turning over what cannot be fixed in the dark.

Jesus said come. He did not specify the presentable burdens only. He said all. The weary and burdened in their entirety — including the parts you have hidden from everyone, including yourself.

He already knows what you are carrying. The invitation is not for his information. It is for your relief. The act of bringing the secret thing into the light of his presence is how it begins to lose its power.

You do not have to explain it perfectly. You do not have to understand it. You only have to bring it.

He is waiting. And he has never turned away the one who came honestly.

Come as you are. https://sanctuary-grace.com/"""
    },
    23: {
        "title": "The Long Middle",
        "body": """Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up. — Galatians 6:9

The beginning had energy. The ending will have resolution. But you are in the middle — the long, unglamorous, faithfulness-requiring middle where nothing seems to be happening fast enough and the finish line is not yet visible and the beginning feels very far behind.

Paul wrote to people who were tired of doing good. Not people who had given up. People who were still showing up but barely — who needed someone to tell them that the not-giving-up was itself the harvest in progress.

Do not give up. Not because you can see the results. Because the proper time is coming, and the harvest does not consult your timeline before it arrives.

The middle is not a failure. It is the work. It is the place where character is formed in the absence of applause, where faithfulness gets its truest test, where the roots go down into soil that is harder than the surface suggested.

You are in the middle. Stay. Keep doing the quiet, faithful thing no one is watching. The proper time has not been canceled. It is coming.

Come as you are. https://sanctuary-grace.com/"""
    },
    24: {
        "title": "Fear and the Open Hand",
        "body": """For God has not given us a spirit of fear, but of power and of love and of a sound mind. — 2 Timothy 1:7

Fear has been speaking in your voice for so long you have started to believe it is your voice. It tells you to stay small, to stay safe, to protect yourself before something takes what you have not fully secured. It wears the face of wisdom and calls its caution prudence, its shrinking discernment.

But the spirit of fear is not from God. The contraction in your chest when you think about moving forward — that tightness, that voice that says you will fail, that you are not enough, that something will go wrong — that is not the Holy Spirit.

The spirit God gave is power — capacity, courage, the ability to act in the face of uncertainty. Love — the kind that casts out fear because it is larger than fear. And a sound mind — clarity, wisdom, a settled knowing that is not shaken by every wind.

You are allowed to live from that spirit. You are not required to obey the fear.

Today, notice where fear has been making decisions you thought you were making. And choose, once, to act from love and power instead.

Come as you are. https://sanctuary-grace.com/"""
    },
    25: {
        "title": "The Faithful Witness of Your Own Life",
        "body": """She is clothed with strength and dignity; she can laugh at the days to come. — Proverbs 31:25

You have survived things that would have undone someone less rooted. You have rebuilt yourself more than once, quietly, without asking anyone to admire the work. You have shown up when showing up was the hardest thing. You have loved people through their worst seasons while holding your own pain out of their way.

This is not nothing. This is a testimony.

The woman in Proverbs does not fear the future because she knows who she is — not what she has accomplished, but who she is, the depth of what she carries, the faithfulness she has demonstrated through seasons no one fully witnessed.

You are that woman. Not the polished version. The real version — the one with scars and questions and a faith that has been tested and has held even when it was barely holding.

The laughter at days to come is not naivety. It is the confidence of a woman who has been through enough to know that she has what it takes — not because she is extraordinary, but because the God who has walked with her this far is not going to stop.

You are clothed in more than you know.

Come as you are. https://sanctuary-grace.com/"""
    },
    26: {
        "title": "A Tenderness Toward Yourself",
        "body": """Love your neighbor as yourself. — Mark 12:31

The command assumes you love yourself. Not the performance of self-love — the filters and affirmations and curated presentations of wholeness. The real thing. The quiet, steady tenderness toward your own soul that you would extend, without hesitation, to a beloved friend in the same situation.

You would not speak to a friend the way you speak to yourself. You would not tell her that her rest is selfish, her needs are inconvenient, her grief is indulgent, her pace is an embarrassment. You would hold her. You would tell her she is doing the best she can. You would mean it.

She deserves the same from you that you would give her. And so do you.

This is not selfishness. It is the prerequisite for love. The woman who has no tenderness left for herself cannot give it from an honest place. She gives from depletion and calls it devotion, and eventually the depletion wins.

Today, try one act of tenderness toward yourself. A rest you did not earn. A grace you did not deserve. A word of kindness to the part of you that has been working the hardest.

You are your own neighbor too.

Come as you are. https://sanctuary-grace.com/"""
    },
    27: {
        "title": "When the Calling Feels Buried",
        "body": """For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do. — Ephesians 2:10

There is something in you that was made on purpose. Not as an afterthought, not as a rough draft, but as intentional handiwork — crafted for specific works that were prepared before you arrived in them.

But the calling can feel buried under the exhaustion, the detour, the season that has lasted longer than you planned. You knew once, or thought you knew, what you were made for. And somewhere between then and now, that knowing got covered over by survival and obligation and the slow erosion of years that did not go the way you hoped.

The works are still prepared. The preparation was not conditional on your timeline.

You have not been disqualified. You have not missed the window. The God who made you with purpose does not revoke the purpose when the path gets complicated. He reroutes. He redeems. He takes what looked like detour and weaves it into the thing he was building all along.

The calling is not buried. It is waiting. And you are not behind — you are becoming.

Come as you are. https://sanctuary-grace.com/"""
    },
    28: {
        "title": "Held in the Hard Season",
        "body": """Even though I walk through the darkest valley, I will fear no evil, for you are with me. — Psalm 23:4

He does not say you will not walk through the darkest valley. He says through.

The valley is not the destination. It is the path. And the path has a guide — the God who walks through it with you, not ahead of you waving from the other side, not watching from a safe distance, but present, staff in hand, close enough to touch.

This season has been hard in ways that are difficult to name. The darkness has been real. The length of it has surprised you. You came in thinking it would be shorter, and it has stretched beyond what you thought you could bear, and somehow you are still bearing it.

That endurance is not your own strength. That staying power comes from the One who has been with you every step — even the steps you cannot remember clearly, even the steps you took alone at 3am when you were sure no one was there.

You are not alone in the valley. You have never been alone in the valley.

Fear no evil. Not because nothing bad can happen. But because the One who walks with you is larger than what pursues you.

Come as you are. https://sanctuary-grace.com/"""
    },
    29: {
        "title": "The Woman You Are Becoming",
        "body": """And we all, who with unveiled faces contemplate the Lord's glory, are being transformed into his image with ever-increasing glory. — 2 Corinthians 3:18

You are not finished. The version of you that exists right now is not the final draft. You are mid-transformation — which means the process is incomplete, the edges are still rough, and there are parts of you that have not yet become what they are becoming.

This should be a relief.

Being transformed means the hard seasons are not wasted. The failures are not disqualifying. The wilderness is not the end of the story. Even the places where you have been most lost are part of the path that leads to the image of the One who holds you.

With ever-increasing glory. Not all at once. Gradually, continuously, in a direction that moves toward him — which is always a direction that moves toward your truest self, the self that was designed before the wounding, before the striving, before the survival mode took over.

You are becoming. Even today. Even in this season that feels like stagnation.

The glory is increasing even when you cannot see it. The transformation is happening even when you cannot feel it.

Trust the process. Trust the One who holds it.

Come as you are. https://sanctuary-grace.com/"""
    },
    30: {
        "title": "An Invitation to Begin Again",
        "body": """His mercies are new every morning; great is your faithfulness. — Lamentations 3:23

Every morning is a beginning. Not a continuation of yesterday's failures. Not a resumption of the burden you were carrying when you fell asleep. A new morning. New mercies. The same faithful God who was there yesterday, present again today, with fresh grace for whatever this day holds.

You have been carrying yesterday's weight into today. The shame of what you did not finish, what you said wrong, how you fell short, where you failed the people you love. You have been treating the new morning as if the old account still stands — as if the mercies were not actually new.

But they are new. Lamentations was written in the middle of devastation — the city in ruins, the exile beginning, the worst imaginable thing having actually happened. And from inside that wreckage, the writer found the one thing that held: the faithfulness of a God whose mercies do not run out.

If they were new in the ruins, they are new for you today.

Whatever yesterday held — whatever the last season held — this morning is a door. Step through it without the old weight. Receive what is fresh.

You are allowed to begin again. You always were.

Come as you are. https://sanctuary-grace.com/"""
    },
}

# ─── 5 SUNDAY WEEKLY LETTERS ─────────────────────────────────────────────────

SUNDAY_LETTERS = {
    0: {
        "title": "To the Woman Who Is Tired of Being Strong",
        "subtitle": "A letter for the one who has held it together long enough.",
        "body": """Dear friend,

I want to begin with something I do not say enough: I see you. Not the version you present when you are managing well. The real version — the one who is running on less than she lets on, who answers "fine" because the truth would take too long, who has been strong for so many people for so long that she has forgotten what it feels like to be held.

You are tired of being strong. And the tiredness itself has become something you are managing — because there is no room, in the life you have built, for the person at the center of it to fall apart.

I understand this more than I can say in one letter. I have been that woman. I have performed wellness so convincingly that people were surprised when I finally stopped performing. I have given from a well I pretended was full. I have used service as armor against the very tenderness I was aching for.

Here is what I have learned from the other side of that season:

Strength is not a spiritual virtue. Strength is a capacity, like a muscle. Muscles that are never rested do not grow stronger — they tear. And the woman who does not allow herself to be weak, to need, to receive, is not more faithful. She is more fragile than she knows.

The Gospel does not ask you to be strong. It asks you to be honest. To acknowledge the weakness and bring it to the One who is strong enough for both of you. To stop performing the version of faith that looks composed and let the real thing — the messy, uncertain, exhausted real thing — be what it actually is.

Come as you are does not mean come when you have recovered. It means come broken. Come depleted. Come with the grief you have been carrying alone and the fear you have not named to anyone. Come in the middle of the falling apart, not after it.

This week, I want to invite you to practice one form of weakness. Tell one person the truth about how you are doing. Put down one responsibility that is not actually yours to carry. Rest before you have earned it. Let someone take care of you without deflecting their care.

You do not have to hold everything together. You never did. There is One who holds everything, including you.

You are not alone in this.

With love and solidarity,
Grace

Come as you are. https://sanctuary-grace.com/"""
    },
    1: {
        "title": "The Return",
        "subtitle": "A letter about finding your way back to yourself.",
        "body": """Dear friend,

There is a woman inside you who existed before the wounding. Before the years of giving too much. Before the season that changed everything. Before you learned to shrink yourself to fit the space you were allowed.

She is still there. I want you to know that. She has not been replaced by the tired version or the guarded version or the version that has forgotten how to want things without immediately dismissing the wanting as selfish. She is underneath all of that — quieter now, waiting with a patience that is more faithful than anything you have managed, but there.

The return to her is the work of your life right now. Not a career milestone. Not a relationship goal. The return to the woman you were made to be, before the world told you who to be instead.

I know this sounds abstract. Let me make it specific.

The return looks like pausing before you automatically say yes. Like sitting with a question long enough to hear your own answer before you give someone else's. Like noticing what you love — not what you are good at, not what is useful, but what makes you feel like yourself when you are doing it — and treating that thing as sacred information rather than an indulgence.

The return looks like grief, sometimes. You cannot go back to who you were before loss, before damage, before the long seasons of survival. The return is not a return to innocence. It is a return to the essential self — the one God formed, the one that carries his image, the one that is larger and more whole than the self you have been living from.

This week, I invite you to ask a question you may not have asked in a long time: What do I actually need right now? Not what would be responsible, not what would be appropriate, not what would take the least from others. What do I need?

Sit with the answer. You do not have to act on it immediately. Just let yourself know the truth of it. That knowing is the beginning of the return.

You are not too far gone. The path back to yourself is shorter than you fear.

With tenderness,
Grace

Come as you are. https://sanctuary-grace.com/"""
    },
    2: {
        "title": "What Stays When Everything Else Goes",
        "subtitle": "A letter written from the place where only the essential remains.",
        "body": """Dear friend,

There are seasons that strip things away. The plans you made — gone. The certainties you built your stability on — shaken or removed entirely. The version of yourself you thought would carry you through this decade — revealed as thinner than you knew. The faith that used to feel sturdy — now something you are holding in trembling hands, hoping it holds.

Stripping seasons are terrifying. And they are also, when we can get a little distance from them, clarifying.

Because when things fall away, you find out what stays. You find out what you actually believe when believing is not comfortable. You find out who you are when you are not defined by what you do. You find out which relationships are built on something real and which were built on what you could offer.

What has stayed with you through this season?

I am not asking about what you have kept together. I mean what has held, without your effort — what has been present even when you could not manufacture presence, true even when you could not feel its truth, real even when it did not feel real.

This is the bedrock. This is what you build from going forward.

The Psalms are full of people who were stripped down to bedrock and found, there, that the bedrock held. That the God they could not perform for was still God. That the love they could not earn was still love. That the mercy they had not been able to secure through behavior was still available, new, every morning.

This is the gift hidden inside the stripping: you find out that what you truly need was never dependent on what you could provide for yourself.

You are being held by something that does not require your maintenance to remain solid.

This week, I invite you to name one thing that has stayed. One thing that has proven true through this season regardless of what you could do to make it true. Hold it. Let it be enough for today.

You are not starting over. You are starting from something more solid than you knew you had.

With love,
Grace

Come as you are. https://sanctuary-grace.com/"""
    },
    3: {
        "title": "The Permission You Have Been Waiting For",
        "subtitle": "A letter for the woman who needs someone to say it out loud.",
        "body": """Dear friend,

You have been waiting for permission. I know this because I have waited for it too — for someone with authority over the situation to tell me that it was okay to stop, to rest, to need, to not have it together for a season without that season becoming a verdict on my character.

Permission never came. Or if it did, I did not recognize it. So I kept going without it, on a momentum that was mostly fear dressed up as faithfulness.

I want to try to say something clearly today, in case you need to hear it from outside your own head:

You have permission to rest before you have finished.

You have permission to need things — comfort, help, tenderness, time — without first justifying those needs to anyone.

You have permission to be in a hard season without performing resilience. You can be in it honestly, visibly, without the mask, and that honesty is not weakness. It is one of the bravest things a person can do.

You have permission to grieve what has been lost without immediately pivoting to gratitude. Grief and gratitude are not enemies. You can be thankful and still mourn. You can trust God's goodness and still feel the weight of what is hard.

You have permission to not have the answers. To say I do not know. To hold uncertainty without immediately resolving it into a lesson or a silver lining.

You have permission to take up space. To have a perspective that differs from the room you are in. To want things. To be someone with interior life that is not always in service of someone else's needs.

You have permission to come to God exactly as you are — not the prepared version, not the grateful version, not the version that has already processed and is ready to help others process. The raw version. The in-progress version. The version that does not know how to pray but shows up anyway.

This is not the permission of another person, ultimately. This is the permission that was always yours, embedded in the Gospel, available every morning. But sometimes we need to hear it said plainly.

You are allowed. All of it. Come as you are.

With love and a kind of fierce protectiveness,
Grace

Come as you are. https://sanctuary-grace.com/"""
    },
    4: {
        "title": "A Letter for the Long Road",
        "subtitle": "For the woman who thought she would be further along by now.",
        "body": """Dear friend,

You thought you would be further along by now. Further along in your healing, your calling, your faith, your becoming. You had a picture in your mind of where this journey was supposed to take you — and while you cannot say exactly where you went wrong, you know that this is not where the map said you would be.

The gap between where you are and where you expected to be is a painful place to live. It is the place where comparison does the most damage, where shame speaks loudest, where the enemy of your soul is most likely to tell you that the delay is permanent, that you have missed the window, that the thing you hoped for has quietly become unavailable to you.

None of that is true.

The road is longer than you thought it would be. This is almost always true. The path that forms character, that does the deep work rather than the surface work, that leads to the kind of life that holds under pressure — that path is almost never the direct route. It moves through territory you would not have chosen. It takes longer than the version you planned.

Abraham waited twenty-five years for the promise. Moses was in the wilderness for forty before his calling began. The disciples did not understand what they were being formed for until after the resurrection.

The long road is not evidence that God has forgotten you. It is evidence that he is doing something thorough.

The length of your journey is not a measure of your value or your faithfulness or his affection. It is simply the length of your journey. And every step of it, including the steps that felt like detour, has been building something in you that the direct path could not have built.

You are not behind. You are on the road. And the destination has not moved.

Keep walking. With a little more patience for yourself if you can manage it. And know that I am walking too, and you are not alone on this long and sacred road.

With love for the journey,
Grace

Come as you are. https://sanctuary-grace.com/"""
    },
}

# ─── BUILD CONTENT ────────────────────────────────────────────────────────────

if mode == 'sunday':
    letter = SUNDAY_LETTERS[week_number]
    title = letter['title']
    subtitle = letter['subtitle']
    body_text = letter['body']
else:
    devotion = DAILY_SCHEDULE[day_number]
    title = devotion['title']
    subtitle = ''
    body_text = devotion['body']

# ─── FORMAT FOR SUBSTACK ──────────────────────────────────────────────────────

paragraphs = []
for para in body_text.split('\n\n'):
    para = para.strip()
    if para:
        paragraphs.append({"type": "paragraph", "content": [{"type": "text", "text": para}]})
if not paragraphs:
    paragraphs = [{"type": "paragraph", "content": [{"type": "text", "text": body_text}]}]

body_doc = json.dumps({"type": "doc", "content": paragraphs})

post_status = 'DRAFT'
post_url = ''

if SUBSTACK_SESSION_COOKIE:
    payload = json.dumps({
        "draft_title": title,
        "draft_subtitle": subtitle,
        "draft_body": body_doc,
        "type": "newsletter",
        "audience": "everyone",
        "draft_section_id": None,
        "section_chosen": False
    }).encode('utf-8')
    try:
        post_req = urllib.request.Request(
            f'https://{SUBSTACK_PUBLICATION_URL}/api/v1/posts',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'Cookie': f'substack-session={SUBSTACK_SESSION_COOKIE}'
            },
            method='POST'
        )
        with urllib.request.urlopen(post_req, timeout=30) as resp:
            result = json.loads(resp.read())
            post_id = result.get('id')
            post_url = result.get('canonical_url', '')
            post_status = f'DRAFT IN SUBSTACK — id: {post_id}'
            print(f"Substack draft created: {post_id}")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        post_status = f'SUBSTACK API ERROR {e.code}: {error_body[:300]}'
        print(f"Substack error {e.code}: {error_body}")
    except Exception as e:
        post_status = f'ERROR: {str(e)[:200]}'
else:
    post_status = 'DRAFT SAVED — add SUBSTACK_SESSION_COOKIE to GitHub Secrets to auto-create drafts'

out_dir = pathlib.Path('workflows/output/substack-pending')
out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / f'{date_str}.md').write_text(
    f'---\ndate: {date_str}\nmode: {mode}\nday: {day_number}\nstatus: {post_status}\nurl: {post_url or "pending"}\n---\n\n# {title}\n\n{("*" + subtitle + "*" + chr(10) + chr(10)) if subtitle else ""}{body_text}\n'
)

log_file = pathlib.Path('workflows/output/substack-log.md')
log_entry = f'| {date_str} | {mode} | {title[:40]} | {post_status[:60]} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + log_entry)
else:
    log_file.write_text('| Date | Mode | Title | Status |\n|---|---|---|---|\n' + log_entry)

print(f'Done. Status: {post_status}')
print(f'Title: {title}')