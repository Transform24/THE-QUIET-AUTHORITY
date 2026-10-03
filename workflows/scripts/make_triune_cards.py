from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 1500
BG = (13, 13, 13)

# Sovereign design constraints: palette is strictly Terracotta, Black, White.
# Latin text is Cinzel (assets/fonts, OFL). Cinzel has no Hebrew glyphs, so the
# Hebrew name keeps Noto Serif Hebrew.
TERRACOTTA = (193, 89, 60)    # #C1593C
WHITE = (255, 255, 255)

_FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "fonts")
HEB_FONT_PATH = os.environ.get("HEB_FONT_PATH", "/usr/share/fonts/truetype/noto/NotoSerifHebrew-Bold.ttf")
LAT_FONT_PATH = os.path.join(_FONT_DIR, "Cinzel-Regular.ttf")
LAT_FONT_PATH_I = LAT_FONT_PATH  # Cinzel has no italic

OUT_DIR = "triune-glyphs"

# Same layout/params convention as make_names_of_god_cards.py (batch 2 params).
entries = [
    {"hebrew": "יֵשׁוּעַ הַמָּשִׁיחַ", "translit": "YESHUA HAMASHIACH", "meaning": "Jesus the Messiah", "ref": "Matthew 1:1", "file": "01_yeshua_hamashiach.png",
     "heb_max_w": W-160, "heb_start": 170, "heb_min": 60, "translit_size": 24, "meaning_size": 38},
    {"hebrew": "עִמָּנוּ אֵל", "translit": "IMMANU EL", "meaning": "God With Us", "ref": "Isaiah 7:14", "file": "02_immanuel.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "שֵׂה הָאֱלֹהִים", "translit": "SEH HA-ELOHIM", "meaning": "The Lamb of God", "ref": "John 1:29", "file": "03_seh_haelohim.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "הַדָּבָר", "translit": "HA-DAVAR", "meaning": "The Word", "ref": "John 1:1", "file": "04_hadavar.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "כּוֹכַב נֹגַהּ הַשַּׁחַר", "translit": "KOCHAV NOGAH HASHACHAR", "meaning": "The Bright and Morning Star", "ref": "Revelation 22:16", "file": "05_kochav_nogah.png",
     "heb_max_w": W-160, "heb_start": 150, "heb_min": 50, "translit_size": 22, "meaning_size": 34},

    {"hebrew": "רוּחַ הַקֹּדֶשׁ", "translit": "RUACH HAKODESH", "meaning": "The Holy Spirit", "ref": "Genesis 1:2", "file": "06_ruach_hakodesh.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "רוּחַ הָאֱמֶת", "translit": "RUACH HA-EMET", "meaning": "The Spirit of Truth", "ref": "John 14:17", "file": "07_ruach_haemet.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "רוּחַ חָכְמָה וּבִינָה", "translit": "RUACH CHOKMAH U-VINAH", "meaning": "The Spirit of Wisdom and Understanding", "ref": "Isaiah 11:2", "file": "08_ruach_chokmah.png",
     "heb_max_w": W-160, "heb_start": 150, "heb_min": 46, "translit_size": 20, "meaning_size": 30},
    {"hebrew": "רוּחַ מִשְׁפַּט בָּנִים", "translit": "RUACH MISHPAT BANIM", "meaning": "The Spirit of Adoption", "ref": "Romans 8:15", "file": "09_ruach_adoption.png",
     "heb_max_w": W-160, "heb_start": 160, "heb_min": 50, "translit_size": 22, "meaning_size": 36},
]


FIT_MARGIN = 128  # border margin plus padding; Cinzel runs wider than the old serif

def fit_latin(draw, text, path, size):
    """Shrink a Latin line until it sits inside the border."""
    max_w = W - 2 * FIT_MARGIN
    while size > 8:
        f = ImageFont.truetype(path, size)
        b = draw.textbbox((0, 0), text, font=f)
        if b[2] - b[0] <= max_w:
            return f
        size -= 2
    return ImageFont.truetype(path, 8)

def fit_font(draw, text, path, max_width, start_size, min_size):
    size = start_size
    while size > min_size:
        f = ImageFont.truetype(path, size)
        bbox = draw.textbbox((0, 0), text, font=f)
        w = bbox[2] - bbox[0]
        if w <= max_width:
            return f, bbox
        size -= 4
    f = ImageFont.truetype(path, min_size)
    bbox = draw.textbbox((0, 0), text, font=f)
    return f, bbox

def render(e, out_dir):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    margin = 48
    d.rectangle([margin, margin, W - margin, H - margin], outline=TERRACOTTA, width=2)

    cy = 200
    d.line([(W/2-90, cy), (W/2-30, cy)], fill=TERRACOTTA, width=2)
    d.line([(W/2+30, cy), (W/2+90, cy)], fill=TERRACOTTA, width=2)
    d.polygon([(W/2, cy-8), (W/2+8, cy), (W/2, cy+8), (W/2-8, cy)], fill=TERRACOTTA)

    heb_font, heb_bbox = fit_font(d, e["hebrew"], HEB_FONT_PATH, e["heb_max_w"], e["heb_start"], e["heb_min"])
    hw = heb_bbox[2] - heb_bbox[0]
    hx = (W - hw) / 2 - heb_bbox[0]
    hy = 520 - heb_bbox[1]
    d.text((hx, hy), e["hebrew"], font=heb_font, fill=TERRACOTTA)

    ry = 760
    d.line([(W/2-140, ry), (W/2+140, ry)], fill=TERRACOTTA, width=2)

    translit_spaced = "  ".join(list(e["translit"]))
    translit_size = e["translit_size"]
    trans_font = fit_latin(d, translit_spaced, LAT_FONT_PATH, translit_size)
    tb = d.textbbox((0, 0), translit_spaced, font=trans_font)
    tw = tb[2] - tb[0]
    d.text(((W - tw)/2 - tb[0], 810), translit_spaced, font=trans_font, fill=WHITE)

    meaning_font = fit_latin(d, e["meaning"], LAT_FONT_PATH_I, e["meaning_size"])
    mb = d.textbbox((0, 0), e["meaning"], font=meaning_font)
    mw = mb[2] - mb[0]
    d.text(((W - mw)/2 - mb[0], 880), e["meaning"], font=meaning_font, fill=TERRACOTTA)

    ref_font = fit_latin(d, e["ref"], LAT_FONT_PATH, 26)
    rb = d.textbbox((0, 0), e["ref"], font=ref_font)
    rw = rb[2] - rb[0]
    d.text(((W - rw)/2 - rb[0], 960), e["ref"], font=ref_font, fill=WHITE)

    brand = "S A N C T U A R Y   G R A C E"
    brand_font = fit_latin(d, brand, LAT_FONT_PATH, 22)
    bb = d.textbbox((0, 0), brand, font=brand_font)
    bw = bb[2] - bb[0]
    d.text(((W - bw)/2 - bb[0], H-120), brand, font=brand_font, fill=TERRACOTTA)

    cy2 = H - 170
    d.line([(W/2-90, cy2), (W/2-30, cy2)], fill=TERRACOTTA, width=2)
    d.line([(W/2+30, cy2), (W/2+90, cy2)], fill=TERRACOTTA, width=2)
    d.polygon([(W/2, cy2-8), (W/2+8, cy2), (W/2, cy2+8), (W/2-8, cy2)], fill=TERRACOTTA)

    img.save(os.path.join(out_dir, e["file"]))
    print("saved", e["file"])

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    for entry in entries:
        render(entry, OUT_DIR)
    print(f"done: {len(entries)} cards written to {OUT_DIR}/")
