import math, re
from PIL import Image, ImageDraw, ImageFilter
from engine import *

LAND = W > H
CAP_Y = 930 if LAND else 1450
YELLOW = (255, 214, 72)


def chunk_words(words, max_words=5 if LAND else 3, max_chars=34 if LAND else 20):
    """words: list of dict(w, s, e). returns list of chunks (list of words)"""
    chunks, cur = [], []
    for wd in words:
        trial = " ".join(x["w"] for x in cur + [wd])
        if cur and (len(cur) >= max_words or len(trial) > max_chars):
            chunks.append(cur)
            cur = []
        cur.append(wd)
        if re.search(r"[.,!?—:]$", wd["w"]) and len(cur) >= 2:
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    return chunks


def build_chunks(timeline):
    out = []
    for sent in timeline["sentences"]:
        for ch in chunk_words(sent["words"]):
            out.append(dict(words=ch, s=ch[0]["s"], e=ch[-1]["e"]))
    # hold each chunk until the next one starts (max +0.35s)
    for i, c in enumerate(out):
        nxt = out[i + 1]["s"] if i + 1 < len(out) else c["e"] + 0.4
        c["hold"] = min(nxt, c["e"] + 0.35)
    return out


def draw_caption(img, chunk, t):
    f = font(FONT_CAP, 62 if LAND else 76)
    words = [w["w"].upper() for w in chunk["words"]]
    d = ImageDraw.Draw(img)
    space = d.textlength(" ", font=f) * 1.7
    widths = [d.textlength(w, font=f) for w in words]
    total = sum(widths) + space * (len(words) - 1)
    # wrap into two lines if too wide
    lines = [[0, len(words)]]
    if total > (W - 120 if not LAND else 1500) and len(words) > 1:
        best = 1
        bestdiff = 1e9
        for k in range(1, len(words)):
            a = sum(widths[:k]) + space * (k - 1)
            b = sum(widths[k:]) + space * (len(words) - k - 1)
            if abs(a - b) < bestdiff:
                bestdiff, best = abs(a - b), k
        lines = [[0, best], [best, len(words)]]
    age = t - chunk["s"]
    pop = 0.86 + 0.14 * ease_out(age / 0.12)
    layer = Image.new("RGBA", (W, 300), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    lh = 76 if LAND else 92
    y0 = 150 - lh * (len(lines) - 1) / 2
    for li, (a, b) in enumerate(lines):
        lw = sum(widths[a:b]) + space * (b - a - 1)
        x = (W - lw) / 2
        for k in range(a, b):
            wd = chunk["words"][k]
            active = wd["s"] - 0.03 <= t < (chunk["words"][k + 1]["s"] if k + 1 < len(chunk["words"]) else chunk["hold"])
            col = YELLOW if active else (255, 255, 255)
            ld.text((x, y0 + li * lh), words[k], font=f, fill=col, anchor="lm", stroke_width=9,
                    stroke_fill=(20, 14, 10))
            x += widths[k] + space
    if pop < 0.999:
        nw, nh = int(W * pop), int(300 * pop)
        layer = layer.resize((nw, nh), Image.BICUBIC)
        img.alpha_composite(layer, ((W - nw) // 2, CAP_Y - nh // 2))
    else:
        img.alpha_composite(layer, (0, CAP_Y - 150))


def captions(img, chunks, t):
    for c in chunks:
        if c["s"] - 0.03 <= t < c["hold"]:
            draw_caption(img, c, t)
            return


def headline(img, text, age):
    if age < 0:
        return
    k = ease_out(age / 0.3)
    f = font(FONT_SERIF_B, 62)
    d = ImageDraw.Draw(img)
    tw = d.textlength(text, font=f)
    while tw > W - 200:
        f = font(FONT_SERIF_B, f.size - 4)
        tw = d.textlength(text, font=f)
    bw = tw + 110
    bh = 104
    layer = Image.new("RGBA", (int(bw) + 60, bh + 40), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ox, oy = 30, 14
    rib = [(ox, oy), (ox + bw, oy), (ox + bw - 26, oy + bh / 2), (ox + bw, oy + bh), (ox, oy + bh), (ox + 26, oy + bh / 2)]
    sh = [(x + 6, y + 8) for x, y in rib]
    ld.polygon(sh, fill=(0, 0, 0, 90))
    ld.polygon(rib, fill=(240, 226, 192, 255))
    ld.line(rib + [rib[0]], fill=(60, 40, 28, 255), width=5)
    ld.line([(ox + 30, oy + 10), (ox + bw - 30, oy + 10)], fill=(150, 110, 70, 255), width=2)
    ld.line([(ox + 30, oy + bh - 10), (ox + bw - 30, oy + bh - 10)], fill=(150, 110, 70, 255), width=2)
    ld.text((ox + bw / 2, oy + bh / 2 + 2), text, font=f, fill=(60, 34, 24, 255), anchor="mm")
    s = 0.6 + 0.4 * k
    if s < 0.999:
        layer = layer.resize((max(1, int(layer.width * s)), max(1, int(layer.height * s))), Image.BICUBIC)
    a = layer.split()[3].point(lambda v: int(v * clamp(k * 1.5)))
    layer.putalpha(a)
    img.alpha_composite(layer, (int((W - layer.width) / 2), int((110 if LAND else 250) - layer.height / 2)))


try:
    from script import NEXT_HERO
except ImportError:
    NEXT_HERO = ""


def end_card(img, k, t):
    """k: 0..1 fade amount"""
    if k <= 0:
        return img
    card = vgrad(W, H, (236, 222, 190), (214, 192, 150))
    d = ImageDraw.Draw(card)
    d.rectangle([60, 60, W - 60, H - 60], outline=(70, 46, 30), width=6)
    d.rectangle([80, 80, W - 80, H - 80], outline=(150, 110, 70), width=2)
    # coin emblem
    if LAND:
        return _end_card_land(img, card, d, k, t)
    cx, cy = W // 2, 640
    bounce = math.sin(t * 3) * 8
    d.ellipse([cx - 170, cy - 170 + bounce, cx + 170, cy + 170 + bounce], fill=(214, 170, 70), outline=(54, 34, 20), width=8)
    d.ellipse([cx - 130, cy - 130 + bounce, cx + 130, cy + 130 + bounce], outline=(150, 110, 40), width=5)
    d.text((cx, cy + bounce + 6), "₽", font=font(FONT_SERIF_B, 200), fill=(90, 58, 24), anchor="mm")
    d.text((W // 2, 980), "ДЕНЬГИ", font=font(FONT_SERIF_B, 130), fill=(54, 30, 20), anchor="mm")
    d.text((W // 2, 1110), "ГЕРОЕВ", font=font(FONT_SERIF_B, 130), fill=(54, 30, 20), anchor="mm")
    d.text((W // 2, 1250), "финансы на примерах персонажей", font=font(FONT_SERIF_I, 46), fill=(90, 60, 40), anchor="mm")
    d.text((W // 2, 1420), "Следующий герой:", font=font(FONT_SERIF_I, 50), fill=(90, 60, 40), anchor="mm")
    d.text((W // 2, 1490), NEXT_HERO, font=font(FONT_SERIF_B, 64 if len(NEXT_HERO) < 14 else 52), fill=(140, 40, 32), anchor="mm")
    card = finish(card.convert("RGB"), int(t * FPS)).convert("RGBA")
    return Image.blend(img, card, clamp(k))


def _end_card_land(img, card, d, k, t):
    cx, cy = 560, H // 2
    bounce = math.sin(t * 3) * 8
    d.ellipse([cx - 170, cy - 170 + bounce, cx + 170, cy + 170 + bounce], fill=(214, 170, 70), outline=(54, 34, 20), width=8)
    d.ellipse([cx - 130, cy - 130 + bounce, cx + 130, cy + 130 + bounce], outline=(150, 110, 40), width=5)
    d.text((cx, cy + bounce + 6), "₽", font=font(FONT_SERIF_B, 200), fill=(90, 58, 24), anchor="mm")
    d.text((1260, 400), "ДЕНЬГИ ГЕРОЕВ", font=font(FONT_SERIF_B, 110), fill=(54, 30, 20), anchor="mm")
    d.text((1260, 520), "финансы на примерах персонажей", font=font(FONT_SERIF_I, 46), fill=(90, 60, 40), anchor="mm")
    d.text((1260, 680), "Подписывайся — новые ролики каждый день", font=font(FONT_SERIF_I, 46), fill=(90, 60, 40), anchor="mm")
    card = finish(card.convert("RGB"), int(t * FPS)).convert("RGBA")
    return Image.blend(img, card, clamp(k))
