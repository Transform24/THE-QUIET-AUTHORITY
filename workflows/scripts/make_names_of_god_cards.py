from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 1500
BG = (13, 13, 13)
GOLD = (201, 168, 76)
TERRACOTTA = (193, 89, 60)
CREAM = (245, 240, 232)

HEB_FONT_PATH = "/usr/share/fonts/truetype/noto/NotoSerifHebrew-Bold.ttf"
LAT_FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
LAT_FONT_PATH_I = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"

OUT_DIR = "names-of-god-glyphs"

# Each entry carries its own font-fit params exactly as originally generated,
# so re-running this script reproduces the 25 cards already approved, pixel
# for pixel. Do not "improve" or re-tune these numbers.
entries = [
    # batch 1 params: heb fit (W-260, 220, 90), translit 34, meaning 40
    {"hebrew": "אֵל עוֹלָם", "translit": "EL OLAM", "meaning": "The Everlasting God", "ref": "Genesis 21:33", "file": "01_el_olam.png",
     "heb_max_w": W-260, "heb_start": 220, "heb_min": 90, "translit_size": 34, "meaning_size": 40},
    {"hebrew": "אֵל רֹאִי", "translit": "EL ROI", "meaning": "The God Who Sees Me", "ref": "Genesis 16:13", "file": "02_el_roi.png",
     "heb_max_w": W-260, "heb_start": 220, "heb_min": 90, "translit_size": 34, "meaning_size": 40},
    {"hebrew": "עִמָּנוּ אֵל", "translit": "IMMANU EL", "meaning": "God With Us", "ref": "Isaiah 7:14", "file": "03_immanuel.png",
     "heb_max_w": W-260, "heb_start": 220, "heb_min": 90, "translit_size": 34, "meaning_size": 40},
    {"hebrew": "אֶהְיֶה", "translit": "EHYEH", "meaning": "I AM", "ref": "Exodus 3:14", "file": "04_ehyeh.png",
     "heb_max_w": W-260, "heb_start": 220, "heb_min": 90, "translit_size": 34, "meaning_size": 40},
    {"hebrew": "גֹּאֵל", "translit": "GO'EL", "meaning": "The Redeemer", "ref": "Isaiah 47:4 / Ruth 4", "file": "05_goel.png",
     "heb_max_w": W-260, "heb_start": 220, "heb_min": 90, "translit_size": 34, "meaning_size": 40},

    # batch 2 params: heb fit (W-200, 190, 70), translit 30, meaning 40
    {"hebrew": "אֱלֹהִים", "translit": "ELOHIM", "meaning": "God, Creator", "ref": "Genesis 1:1", "file": "06_elohim.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "אֲדֹנָי", "translit": "ADONAI", "meaning": "Lord, Master", "ref": "Genesis 15:2", "file": "07_adonai.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "אַבָּא", "translit": "ABBA", "meaning": "Father", "ref": "Romans 8:15", "file": "08_abba.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "אֵל שַׁדַּי", "translit": "EL SHADDAI", "meaning": "God Almighty", "ref": "Genesis 17:1", "file": "09_el_shaddai.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "יְהוָה נִסִּי", "translit": "YAHWEH NISSI", "meaning": "The Lord Our Banner", "ref": "Exodus 17:15", "file": "10_yahweh_nissi.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "יְהוָה רָפָא", "translit": "YAHWEH RAPHA", "meaning": "The Lord Our Healer", "ref": "Exodus 15:26", "file": "11_yahweh_rapha.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "יְהוָה שָׁלוֹם", "translit": "YAHWEH SHALOM", "meaning": "The Lord Is Peace", "ref": "Judges 6:24", "file": "12_yahweh_shalom.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "יְהוָה רֹעִי", "translit": "YAHWEH ROHI", "meaning": "The Lord My Shepherd", "ref": "Psalm 23:1", "file": "13_yahweh_rohi.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},
    {"hebrew": "יְהוָה יִרְאֶה", "translit": "YAHWEH JIREH", "meaning": "The Lord Will Provide", "ref": "Genesis 22:14", "file": "14_yahweh_jireh.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 30, "meaning_size": 40},

    # batch 3 params: heb fit (W-200, 190, 70), translit 28, meaning 38
    {"hebrew": "אֵל עֶלְיוֹן", "translit": "EL ELYON", "meaning": "The Most High God", "ref": "Genesis 14:18-20", "file": "15_el_elyon.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "יְהוָה צְבָאוֹת", "translit": "YAHWEH SABAOTH", "meaning": "The Lord of Hosts", "ref": "1 Samuel 1:3", "file": "16_yahweh_sabaoth.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "יְהוָה שָׁמָּה", "translit": "YAHWEH SHAMMAH", "meaning": "The Lord Is There", "ref": "Ezekiel 48:35", "file": "17_yahweh_shammah.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "יְהוָה צִדְקֵנוּ", "translit": "YAHWEH TSIDKENU", "meaning": "The Lord Our Righteousness", "ref": "Jeremiah 23:6", "file": "18_yahweh_tsidkenu.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "אֵל קַנָּא", "translit": "EL QANNA", "meaning": "The Jealous God", "ref": "Exodus 34:14", "file": "19_el_qanna.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "אֵל גִּבּוֹר", "translit": "EL GIBBOR", "meaning": "The Mighty God", "ref": "Isaiah 9:6", "file": "20_el_gibbor.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},
    {"hebrew": "אֵל דֵּעוֹת", "translit": "EL DEOT", "meaning": "God of Knowledge", "ref": "1 Samuel 2:3", "file": "21_el_deot.png",
     "heb_max_w": W-200, "heb_start": 190, "heb_min": 70, "translit_size": 28, "meaning_size": 38},

    # batch 4 params: heb fit (W-160, 170, 60), translit 26 (or 22 if len>=20), meaning 36
    {"hebrew": "עַתִּיק יוֹמִין", "translit": "ATTIQ YOMIN", "meaning": "The Ancient of Days", "ref": "Daniel 7:9", "file": "22_attiq_yomin.png",
     "heb_max_w": W-160, "heb_start": 170, "heb_min": 60, "translit_size": None, "meaning_size": 36},
    {"hebrew": "יְהוָה מְקַדִּשְׁכֶם", "translit": "YAHWEH M'KADDISHKEM", "meaning": "The Lord Who Sanctifies You", "ref": "Exodus 31:13", "file": "23_yahweh_mkaddesh.png",
     "heb_max_w": W-160, "heb_start": 170, "heb_min": 60, "translit_size": None, "meaning_size": 36},
    {"hebrew": "אֵל מְחֹלְלֶךָ", "translit": "EL M'CHOLELECHA", "meaning": "The God Who Gave You Birth", "ref": "Deuteronomy 32:18", "file": "24_el_chuwl.png",
     "heb_max_w": W-160, "heb_start": 170, "heb_min": 60, "translit_size": None, "meaning_size": 36},
    {"hebrew": "אֵל גְּמֻלוֹת", "translit": "EL GEMULOT", "meaning": "God of Recompense", "ref": "Jeremiah 51:56", "file": "25_el_gemulot.png",
     "heb_max_w": W-160, "heb_start": 170, "heb_min": 60, "translit_size": None, "meaning_size": 36},
]

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
    d.rectangle([margin, margin, W - margin, H - margin], outline=GOLD, width=2)

    cy = 200
    d.line([(W/2-90, cy), (W/2-30, cy)], fill=GOLD, width=2)
    d.line([(W/2+30, cy), (W/2+90, cy)], fill=GOLD, width=2)
    d.polygon([(W/2, cy-8), (W/2+8, cy), (W/2, cy+8), (W/2-8, cy)], fill=GOLD)

    heb_font, heb_bbox = fit_font(d, e["hebrew"], HEB_FONT_PATH, e["heb_max_w"], e["heb_start"], e["heb_min"])
    hw = heb_bbox[2] - heb_bbox[0]
    hx = (W - hw) / 2 - heb_bbox[0]
    hy = 520 - heb_bbox[1]
    d.text((hx, hy), e["hebrew"], font=heb_font, fill=GOLD)

    ry = 760
    d.line([(W/2-140, ry), (W/2+140, ry)], fill=TERRACOTTA, width=2)

    translit_spaced = "  ".join(list(e["translit"]))
    translit_size = e["translit_size"]
    if translit_size is None:
        translit_size = 26 if len(e["translit"]) < 20 else 22
    trans_font = ImageFont.truetype(LAT_FONT_PATH, translit_size)
    tb = d.textbbox((0, 0), translit_spaced, font=trans_font)
    tw = tb[2] - tb[0]
    d.text(((W - tw)/2 - tb[0], 810), translit_spaced, font=trans_font, fill=CREAM)

    meaning_font = ImageFont.truetype(LAT_FONT_PATH_I, e["meaning_size"])
    mb = d.textbbox((0, 0), e["meaning"], font=meaning_font)
    mw = mb[2] - mb[0]
    d.text(((W - mw)/2 - mb[0], 880), e["meaning"], font=meaning_font, fill=GOLD)

    ref_font = ImageFont.truetype(LAT_FONT_PATH, 26)
    rb = d.textbbox((0, 0), e["ref"], font=ref_font)
    rw = rb[2] - rb[0]
    d.text(((W - rw)/2 - rb[0], 960), e["ref"], font=ref_font, fill=(154, 154, 148))

    brand = "S A N C T U A R Y   G R A C E"
    brand_font = ImageFont.truetype(LAT_FONT_PATH, 22)
    bb = d.textbbox((0, 0), brand, font=brand_font)
    bw = bb[2] - bb[0]
    d.text(((W - bw)/2 - bb[0], H-120), brand, font=brand_font, fill=GOLD)

    cy2 = H - 170
    d.line([(W/2-90, cy2), (W/2-30, cy2)], fill=GOLD, width=2)
    d.line([(W/2+30, cy2), (W/2+90, cy2)], fill=GOLD, width=2)
    d.polygon([(W/2, cy2-8), (W/2+8, cy2), (W/2, cy2+8), (W/2-8, cy2)], fill=GOLD)

    img.save(os.path.join(out_dir, e["file"]))
    print("saved", e["file"])

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    for entry in entries:
        render(entry, OUT_DIR)
    print(f"done: {len(entries)} cards written to {OUT_DIR}/")
