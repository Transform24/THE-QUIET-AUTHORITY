# Names of God — Printful Design Files

Print-ready design files extending the free "Hebrew Names of God — Reference Guide"
lead magnet (`names-of-god.html`) into two physical products: wall art and a
promotional pen. Content (all 25 Hebrew names, English titles, and short glosses)
was pulled directly from `names-of-god.html` — nothing invented. Palette and type
are locked to `_system/brand-tokens.md` (gold `#C9A84C`, terracotta `#C1593C`,
cream `#F5F0E8`, parchment `#C4A47C`, bg `#0d0d0d`; Cormorant Garamond / Cinzel /
Jost / Noto Serif Hebrew).

## Files

### `WallArt_NamesOfGod_Poster_12x12_300dpi.jpg`
- **Pixel dimensions:** 3600 x 3600 px (1:1 square)
- **DPI:** 300
- **Format:** JPEG, RGB (no alpha), sRGB (default Chromium/Pillow export — no
  manual color profile conversion was applied)
- **Content:** all 25 names in a 5x5 grid (Hebrew + English title + one-line
  gloss), matching the ministry's hero/lede treatment on `names-of-god.html`,
  closed with the Isaiah 9:6 verse and the Sanctuary Grace Ministry wordmark.
- **Aspect ratio source:** matches the existing live wall art files
  (`wall-art-WOMT9.jpg` etc. — verified at 1200x1200 px, 1:1, via PIL) used in
  `circle-of-silence/products.md`'s $9.99 Wall Art line. This file is built
  at true print resolution (300 DPI) rather than the 72–96 DPI those existing
  JPGs carry, since those are web/Stripe-listing thumbnails, not print masters.
- **Printful product mapping:** Printful's **Enhanced Matte Paper Poster (in)**
  line lists a 12x12in square size, so 3600x3600px @ 300 DPI is built to that
  spec. **Not confirmed against Printful's live catalog in this session (no
  Printful account/API access) — verify the exact size list and bleed
  requirements on the product's "File guidelines" tab before ordering.**
  Printful's general paper-product minimum is 75 DPI with 300 DPI recommended;
  this file exceeds that.

### `Pen_NamesOfGod_WrapStrip_3x1.7in_300dpi.png`
- **Pixel dimensions:** 900 x 510 px
- **DPI:** 300
- **Format:** PNG, RGB (no alpha)
- **Content:** a single wrap-around strip carrying two names (El Shaddai /
  Yahweh Shalom) flanking a centered "Sanctuary Grace · The Names of God"
  brand lockup, in the same gold/terracotta/cream palette.
- **Dimensions source — not a Printful spec:** Printful's current catalog does
  not list a full-color wrap-print pen product (its pens, where offered, are
  a much smaller pad-printed logo area, not a full barrel wrap). 3in x 1.7in
  was chosen as a commonly cited flat-wrap template size for slim promotional
  click pens across third-party sublimation/dye-sub pen vendors (general
  industry pattern, not a single confirmed spec sheet — WebFetch to the
  vendor page that named this size was blocked by the network egress proxy
  in this session, so treat it as a reasonable starting point, not a
  guaranteed fit). **Verify against the actual blank pen template supplied by
  whichever pen vendor/product is used (Printful does not appear to carry
  this item type — confirm before ordering, or source the pen product
  elsewhere and use this file as the wrap art).**

## Skill coverage note

The `printful-aop-design` skill (loaded for this task) covers all-over-print
apparel (dresses, crop tops, leggings, wide-leg pants) and includes one
generic wall-art canvas dimension reference (24x36in canvas, ~4560x5700px)
but nothing about flat paper posters or pens specifically. Its production
discipline (fixed pixel dimensions matching target DPI, flattened RGB with no
alpha, Playwright + Pillow build/flatten pipeline) was applied here, but the
actual poster and pen size figures above were sourced separately via web
search (Printful's public poster product pages and general promotional-pen
vendor references), not from the skill's own confirmed-dimensions table.

## What has NOT been done

No Printful account or API credentials are available in this session. These
are **ready-to-upload design files only**. Nothing has been created in, or
submitted to, any Printful store, product listing, or mockup generator.

**Next step for Grace (or a future session with Printful credentials):**
Log into the Printful dashboard, start a new product from these two files
(Enhanced Matte Paper Poster for the wall art square, and whichever pen/notion
product is chosen for the pen), confirm sizing against that product's live
"File guidelines" tab, generate mockups, and publish the listing (then add the
new Stripe/store links to `circle-of-silence/products.md` the same way the
existing $9.99 Wall Art rows are recorded).
