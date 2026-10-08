# Circle of Silence: Gate Scripture Reveals

Vertical 1080x1920 videos for the six gates, one hero verse each, in the same look as the Psalm 91 video in `content-ops/04_youtube/remotion/`. The shared files in the two folders must stay identical (see the central README, section 11).

The words live in `src/data/gates.json`. Each gate holds its label, the verse marker, two lines, the two colors, `reveal_speed_ms` and the `music` file.

| Gate | Verse | Music |
|---|---|---|
| 1 HaKria | Luke 4:18 | `music2.mp3` |
| 2 Sheket | Psalm 46:10 | `music2.mp3` |
| 3 HaMidbar | Isaiah 43:2 | `music2.mp3` |
| 4 Hitkania | Proverbs 3:5-6 | `music3.mp3` |
| 5 Bitachon | Hebrews 11:1 | `music3.mp3` |
| 6 Hithavut | Jeremiah 29:11 | `music3.mp3` |

The verses are the hero verse printed on each gate page (`gate-one.html` to `gate-six.html`). The gate records in the folder above hold no scripture.

1. Edit `src/data/gates.json` only. KJV wording, no em dashes. Colors stay `#F5F0E8` and `#C9A84C`. `music` must be `music2.mp3` or `music3.mp3`.
2. Check it: `npm run validate:gates`
3. Prove the checker still works: `npm run test:validator`
4. Render all six gates in one video: `npm run render:gates` (about 108 seconds). It checks the script and stages the music first.
5. Render one clip per gate: `npm run render:gates:clips` (files appear in `out/clips/`).
6. On GitHub: Actions, "Remotion Render Gates (vertical)", Run workflow. It saves the videos as a downloadable artifact for 14 days. It uses no secrets and never uploads anywhere. Grace uploads herself.

Music is read from the repository root (`music2.mp3`, `music3.mp3`), copied into `public/` (ignored by git) by `scripts/stage-audio.mjs`, and looped softly with a fade in and out. Each gate has its own music and the sound dips softly between gates. Never move the music files out of the root. The website needs them there.
