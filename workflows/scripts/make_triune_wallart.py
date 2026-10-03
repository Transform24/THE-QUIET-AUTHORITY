from PIL import Image, ImageDraw, ImageFont
import os

# 24x36in wall-art canvas at 150 DPI (matches the "Good/150 DPI" bar already
# used and verified for the original 8 Names of God wall-art pieces).
DPI = 150
W, H = 24 * DPI, 36 * DPI  # 3600 x 5400, true 2:3 canvas aspect
BG = (13, 13, 13)          # #0d0d0d -- locked Sanctuary Grace background

# Sovereign design constraints: palette is strictly Terracotta, Black, White.
# Latin text is Cinzel (assets/fonts, OFL). Cinzel has no Hebrew glyphs, so the
# Hebrew name keeps Noto Serif Hebrew.
TERRACOTTA = (193, 89, 60)    # #C1593C
WHITE = (255, 255, 255)

_FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "fonts")
HEB_FONT_PATH = os.environ.get("HEB_FONT_PATH", "/usr/share/fonts/truetype/noto/NotoSerifHebrew-Bold.ttf")
LAT_FONT_PATH = os.path.join(_FONT_DIR, "Cinzel-Regular.ttf")
LAT_FONT_PATH_I = LAT_FONT_PATH  # Cinzel has no italic

OUT_DIR = "triune-wallart"

entries = [
    {"hebrew": "יֵשׁוּעַ הַמָּשִׁיחַ", "translit": "YESHUA HAMASHIACH", "meaning": "Jesus the Messiah", "ref": "Matthew 1:1, KJV", "file": "01_yeshua_hamashiach_wallart.png",
     "heb_max_w": W-500, "heb_start": 480, "heb_min": 160, "translit_size": 60},
    {"hebrew": "עִמָּנוּ אֵל", "translit": "IMMANU EL", "meaning": "God With Us", "ref": "Isaiah 7:14, KJV", "file": "02_immanuel_wallart.png",
     "heb_max_w": W-560, "heb_start": 560, "heb_min": 200, "translit_size": 72},
    {"hebrew": "שֵׂה הָאֱלֹהִים", "translit": "SEH HA-ELOHIM", "meaning": "The Lamb of God", "ref": "John 1:29, KJV", "file": "03_seh_haelohim_wallart.png",
     "heb_max_w": W-520, "heb_start": 520, "heb_min": 180, "translit_size": 66},
    {"hebrew": "הַדָּבָר", "translit": "HA-DAVAR", "meaning": "The Word", "ref": "John 1:1, KJV", "file": "04_hadavar_wallart.png",
     "heb_max_w": W-500, "heb_start": 620, "heb_min": 220, "translit_size": 72},
    {"hebrew": "כּוֹכַב נֹגַהּ הַשַּׁחַר", "translit": "KOCHAV NOGAH HASHACHAR", "meaning": "The Bright and Morning Star", "ref": "Revelation 22:16, KJV", "file": "05_kochav_nogah_wallart.png",
     "heb_max_w": W-460, "heb_start": 400, "heb_min": 130, "translit_size": 46},
    {"hebrew": "רוּחַ הַקֹּדֶשׁ", "translit": "RUACH HAKODESH", "meaning": "The Holy Spirit", "ref": "Genesis 1:2, KJV", "file": "06_ruach_hakodesh_wallart.png",
     "heb_max_w": W-520, "heb_start": 520, "heb_min": 180, "translit_size": 62},
    {"hebrew": "רוּחַ הָאֱמֶת", "translit": "RUACH HA-EMET", "meaning": "The Spirit of Truth", "ref": "John 14:17, KJV", "file": "07_ruach_haemet_wallart.png",
     "heb_max_w": W-520, "heb_start": 520, "heb_min": 180, "translit_size": 62},
    {"hebrew": "רוּחַ חָכְמָה וּבִינָה", "translit": "RUACH CHOKMAH U-VINAH", "meaning": "The Spirit of Wisdom and Understanding", "ref": "Isaiah 11:2, KJV", "file": "08_ruach_chokmah_wallart.png",
     "heb_max_w": W-460, "heb_start": 400, "heb_min": 120, "translit_size": 42},
    {"hebrew": "רוּחַ מִשְׁפַּט בָּנִים", "translit": "RUACH MISHPAT BANIM", "meaning": "The Spirit of Adoption", "ref": "Romans 8:15, KJV", "file": "09_ruach_adoption_wallart.png",
     "heb_max_w": W-460, "heb_start": 440, "heb_min": 140, "translit_size": 48},
]


FIT_MARGIN = 300  # border margin plus padding; Cinzel runs wider than the old serif

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
        size -= 8
    f = ImageFont.truetype(path, min_size)
    bbox = draw.textbbox((0, 0), text, font=f)
    return f, bbox

def render(e, out_dir):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    margin = 140
    d.rectangle([margin, margin, W - margin, H - margin], outline=TERRACOTTA, width=5)

    cy = int(H * 0.135)
    d.line([(W/2-260, cy), (W/2-80, cy)], fill=TERRACOTTA, width=5)
    d.line([(W/2+80, cy), (W/2+260, cy)], fill=TERRACOTTA, width=5)
    d.polygon([(W/2, cy-22), (W/2+22, cy), (W/2, cy+22), (W/2-22, cy)], fill=TERRACOTTA)

    heb_font, heb_bbox = fit_font(d, e["hebrew"], HEB_FONT_PATH, e["heb_max_w"], e["heb_start"], e["heb_min"])
    hw = heb_bbox[2] - heb_bbox[0]
    hx = (W - hw) / 2 - heb_bbox[0]
    hy = int(H * 0.40) - heb_bbox[1]
    d.text((hx, hy), e["hebrew"], font=heb_font, fill=TERRACOTTA)

    ry = int(H * 0.545)
    d.line([(W/2-380, ry), (W/2+380, ry)], fill=TERRACOTTA, width=5)

    translit_spaced = "  ".join(list(e["translit"]))
    trans_font = fit_latin(d, translit_spaced, LAT_FONT_PATH, e["translit_size"])
    tb = d.textbbox((0, 0), translit_spaced, font=trans_font)
    tw = tb[2] - tb[0]
    d.text(((W - tw)/2 - tb[0], int(H*0.585)), translit_spaced, font=trans_font, fill=WHITE)

    meaning_font = fit_latin(d, e["meaning"], LAT_FONT_PATH_I, 92)
    mb = d.textbbox((0, 0), e["meaning"], font=meaning_font)
    mw = mb[2] - mb[0]
    d.text(((W - mw)/2 - mb[0], int(H*0.635)), e["meaning"], font=meaning_font, fill=TERRACOTTA)

    ref_font = fit_latin(d, e["ref"], LAT_FONT_PATH, 58)
    rb = d.textbbox((0, 0), e["ref"], font=ref_font)
    rw = rb[2] - rb[0]
    d.text(((W - rw)/2 - rb[0], int(H*0.70)), e["ref"], font=ref_font, fill=WHITE)

    brand = "S A N C T U A R Y   G R A C E   M I N I S T R Y"
    brand_font = fit_latin(d, brand, LAT_FONT_PATH, 46)
    bb = d.textbbox((0, 0), brand, font=brand_font)
    bw = bb[2] - bb[0]
    d.text(((W - bw)/2 - bb[0], H-int(H*0.075)), brand, font=brand_font, fill=TERRACOTTA)

    cy2 = H - int(H*0.115)
    d.line([(W/2-260, cy2), (W/2-80, cy2)], fill=TERRACOTTA, width=5)
    d.line([(W/2+80, cy2), (W/2+260, cy2)], fill=TERRACOTTA, width=5)
    d.polygon([(W/2, cy2-22), (W/2+22, cy2), (W/2, cy2+22), (W/2-22, cy2)], fill=TERRACOTTA)

    img.save(os.path.join(out_dir, e["file"]), dpi=(DPI, DPI))
    print("saved", e["file"], img.size)

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    for entry in entries:
        render(entry, OUT_DIR)
    print(f"done: {len(entries)} wall-art files written to {OUT_DIR}/ at {W}x{H} ({DPI} DPI, 24x36in)")
