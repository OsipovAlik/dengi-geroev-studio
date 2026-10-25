import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import *
from chars2 import *

B = 2


class BD:
    def __init__(self, w=W, h=H, col=(0, 0, 0, 0), opaque=False):
        if opaque:
            self.img = Image.new("RGB", (w * B, h * B), col[:3])
            self.d = ImageDraw.Draw(self.img, "RGBA")
        else:
            self.img = Image.new("RGBA", (w * B, h * B), col)
            self.d = ImageDraw.Draw(self.img)

    def poly(self, pts, fill, w=4, ol=INK):
        Pp = [(x * B, y * B) for x, y in pts]
        if fill is not None:
            self.d.polygon(Pp, fill=fill)
        if w:
            self.d.line(Pp + [Pp[0]], fill=ol, width=w * B, joint="curve")

    def rect(self, x0, y0, x1, y1, fill, w=4, ol=INK):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fill, w, ol)

    def line(self, pts, w=4, col=INK):
        self.d.line([(x * B, y * B) for x, y in pts], fill=col, width=max(1, int(w * B)), joint="curve")

    def ell(self, cx, cy, rx, ry, fill, w=4, ol=INK):
        self.d.ellipse([(cx - rx) * B, (cy - ry) * B, (cx + rx) * B, (cy + ry) * B], fill=fill,
                       outline=ol if w else None, width=w * B)

    def text(self, x, y, s, path, size, fill, anchor="mm"):
        self.d.text((x * B, y * B), s, font=font(path, size * B), fill=fill, anchor=anchor)

    def done(self):
        return self.img.resize((self.img.width // B, self.img.height // B), Image.LANCZOS).convert("RGBA")


_cache = {}


def cached(fn):
    def g(*a):
        k = (fn.__name__,) + a
        if k not in _cache:
            _cache[k] = fn(*a)
        return _cache[k]
    return g


def darken(img, amount, col=(20, 18, 24)):
    lay = Image.new("RGBA", img.size, col + (int(255 * amount),))
    img.alpha_composite(lay)


def wallpaper(d, x0, y0, x1, y1, base, stripe, rnd, peel=True):
    d.rect(x0, y0, x1, y1, base, 0)
    for x in range(x0, x1, 64):
        d.rect(x + 20, y0, x + 30, y1, stripe, 0)
        for y in range(y0 + 30, y1, 110):
            d.ell(x + 52, y, 6, 9, stripe, 0)
    if peel:
        for _ in range(7):
            px, py = rnd.randint(x0 + 40, x1 - 120), rnd.randint(y0 + 40, y1 - 160)
            w_, h_ = rnd.randint(60, 140), rnd.randint(70, 160)
            d.poly([(px, py), (px + w_, py + 10), (px + w_ - 20, py + h_), (px + 10, py + h_ - 20)],
                   (196, 184, 150, 255), 3, (120, 104, 70, 255))
        for _ in range(5):  # damp stains
            px, py = rnd.randint(x0, x1), rnd.randint(y0, y1)
            d.ell(px, py, rnd.randint(40, 110), rnd.randint(30, 80), (120, 104, 70, 70), 0)


# =============================================================== SCENE 1: staircase

SL = 0.66  # stair slope


def stair_y(x):
    return 1960 - (x + 60) * SL


@cached
def bg_stairs():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (120, 108, 72), (82, 72, 52)), (0, 0))
    rnd = random.Random(2)
    wallpaper(d, 0, 0, W, 1700, (138, 124, 82, 255), (126, 112, 74, 255), rnd)
    # little window high on the wall
    d.rect(120, 220, 360, 560, (176, 186, 178, 255), 6)
    d.line([(240, 220), (240, 560)], 6)
    d.line([(120, 390), (360, 390)], 6)
    # a door on the upper landing
    d.rect(820, 560, 1040, 1000, (88, 60, 40, 255), 6)
    d.rect(850, 600, 1010, 760, (98, 68, 46, 255), 3)
    d.rect(850, 800, 1010, 960, (98, 68, 46, 255), 3)
    d.ell(1000, 800, 9, 9, (180, 150, 80, 255), 3)
    d.rect(760, 1000, 1080, 1030, (96, 82, 62, 255), 4)
    # stairs: steps
    x = -60
    while x < 1100:
        y = stair_y(x)
        d.poly([(x, y), (x + 72, y), (x + 72, y - 48), (x, y - 48)], None, 0)
        x += 72
    pts = [(-60, stair_y(-60))]
    x = -60
    while x < 900:
        y = stair_y(x)
        pts += [(x, y - 48), (x + 72, y - 48)]
        x += 72
    pts += [(x, H + 10), (-60, H + 10)]
    d.poly(pts, (104, 92, 76, 255), 5)
    x = -60
    while x < 900:
        y = stair_y(x)
        d.line([(x, y - 48), (x + 72, y - 48)], 7, (70, 60, 50, 255))
        x += 72
    # banister behind
    d.line([(-60, stair_y(-60) - 330), (900, stair_y(900) - 330)], 12, (60, 40, 28, 255))
    x = -40
    while x < 900:
        d.line([(x, stair_y(x) - 50), (x, stair_y(x) - 330)], 5, (60, 40, 28, 255))
        x += 72
    return d.done()


def light_beam(img, pts, a):
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon(pts, fill=(255, 240, 200, int(255 * a)))
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(30)))


def scene1(t, dur):
    img = bg_stairs().copy()
    light_beam(img, [(120, 220), (360, 220), (760, 1500), (380, 1700)], 0.12)
    p = t / dur
    x = lerp(160, 700, p)
    ph = t * 2 * math.pi * 0.8
    sw = math.sin(ph)
    y = stair_y(x) - 48 + abs(math.sin(ph)) * -6
    pose = dict(legL=(-18 + 26 * sw, 20 + max(0, sw) * 40), legR=(-18 - 26 * sw, 20 + max(0, -sw) * 40),
                armL=(26, 128), armR=(26, 128), itemR="bundle", hat=True, head=8, lean=6,
                look=(0.5, 0.9) if p < 0.6 else (-0.6, -0.2), brow=0.6, turn=0.45 if p < 0.6 else -0.1,
                blink=1.0 if 0.4 < p < 0.43 else 0.0)
    render_actor(img, draw_rask, x, y, 0.85, pose)
    darken(img, 0.12)
    return img, dict(zoom=1.22, cx=x / W, cy=(y - 520) / H)


# =============================================================== SCENE 2 / 6: garret

CEIL = lambda x: 1060 - x * 0.42


@cached
def bg_garret():
    d = BD(opaque=True)
    rnd = random.Random(8)
    wallpaper(d, 0, 0, W, 1600, (176, 158, 104, 255), (160, 142, 92, 255), rnd)
    # window (right wall)
    d.rect(760, 820, 1000, 1150, (150, 170, 172, 255), 6)
    d.line([(880, 820), (880, 1150)], 6)
    d.line([(760, 985), (1000, 985)], 6)
    d.rect(740, 1150, 1020, 1176, (110, 90, 62, 255), 4)
    # floor
    d.rect(-10, 1600, W + 10, H + 10, (110, 86, 60, 255), 5)
    for y in range(1640, H, 64):
        d.line([(0, y), (W, y)], 3, (86, 66, 46, 255))
    # sloped ceiling
    d.poly([(-10, -10), (W + 10, -10), (W + 10, CEIL(W + 10)), (-10, CEIL(-10))], (92, 80, 66, 255), 6)
    for k in range(1, 6):
        d.line([(-10, CEIL(-10) - k * 150), (W + 10, CEIL(W + 10) - k * 150)], 4, (70, 60, 50, 255))
    # sofa
    d.poly([(20, 1360), (470, 1360), (480, 1640), (10, 1640)], (120, 94, 70, 255), 6)
    d.poly([(40, 1460), (460, 1460), (470, 1560), (30, 1560)], (140, 112, 84, 255), 5)
    d.ell(110, 1430, 70, 34, (210, 200, 176, 255), 4)
    d.poly([(300, 1470), (360, 1462), (366, 1500), (306, 1506)], (100, 76, 56, 255), 3)
    d.line([(30, 1640), (30, 1700)], 10)
    d.line([(460, 1640), (460, 1700)], 10)
    # table
    d.rect(720, 1400, 1060, 1430, (100, 72, 48, 255), 5)
    d.line([(740, 1430), (740, 1700)], 10)
    d.line([(1040, 1430), (1040, 1700)], 10)
    return d.done()


def layer_draw(img):
    lay = Image.new("RGBA", img.size)
    return lay, ImageDraw.Draw(lay)


def dust(img, t, x0, x1, y0, y1, n=26, seed=1):
    lay, d = layer_draw(img)
    rnd = random.Random(seed)
    for i in range(n):
        bx, by = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        x = bx + math.sin(t * 0.7 + i) * 30
        y = by + (t * 18 + i * 37) % (y1 - y0) - (y1 - y0) / 2
        y = y0 + (y - y0) % (y1 - y0)
        r = rnd.uniform(1.5, 3.5)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 246, 220, 140))
    img.alpha_composite(lay)


def table_items(img, t, gone):
    """gone: dict name -> vanish progress (0 present .. 1 gone)"""
    d = ImageDraw.Draw(img)

    def vis(n):
        return 1 - gone.get(n, 0)

    v = vis("books")
    if v > 0.01:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        for i, (c, w_) in enumerate((((120, 48, 40), 150), ((60, 80, 70), 130), ((150, 120, 70), 140), ((70, 60, 90), 120))):
            y = 1400 - (i + 1) * 34
            ld.rectangle([770 + i * 8, y, 770 + i * 8 + w_, y + 34], fill=c + (255,), outline=INK, width=4)
        lay.putalpha(lay.split()[3].point(lambda a: int(a * v)))
        img.alpha_composite(lay)
    v = vis("candle")
    if v > 0.01:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        ld.rectangle([990, 1300, 1016, 1400], fill=(236, 226, 200), outline=INK, width=4)
        fl = 1 + 0.15 * math.sin(t * 15)
        ld.polygon([(996, 1298), (1003, 1260 - 10 * fl), (1010, 1298)], fill=(255, 196, 90), outline=(200, 110, 40))
        lay.putalpha(lay.split()[3].point(lambda a: int(a * v)))
        img.alpha_composite(lay)
    v = vis("ring")
    if v > 0.01:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        ld.ellipse([900, 1376, 940, 1398], outline=(214, 170, 70), width=7)
        ld.ellipse([912, 1366, 928, 1380], fill=(170, 220, 230), outline=INK, width=2)
        lay.putalpha(lay.split()[3].point(lambda a: int(a * v)))
        img.alpha_composite(lay)
    v = vis("picture")
    if v > 0.01:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        ld.rectangle([560, 1000, 700, 1170], fill=(150, 110, 50), outline=INK, width=5)
        ld.rectangle([576, 1016, 684, 1154], fill=(200, 190, 160), outline=INK, width=3)
        ld.ellipse([606, 1040, 654, 1096], fill=(214, 180, 150), outline=INK, width=3)
        ld.rectangle([596, 1100, 664, 1154], fill=(80, 80, 90))
        lay.putalpha(lay.split()[3].point(lambda a: int(a * v)))
        img.alpha_composite(lay)


def poof(img, x, y, k):
    if not (0 < k < 1):
        return
    lay, d = layer_draw(img)
    for i in range(8):
        a = i * math.pi / 4
        r = 20 + 70 * k
        cx, cy = x + math.cos(a) * r, y + math.sin(a) * r * 0.7
        s = 22 * (1 - k)
        d.ellipse([cx - s, cy - s, cx + s, cy + s], fill=(240, 232, 214, int(220 * (1 - k))))
    img.alpha_composite(lay)


def scene2(t, dur):
    img = bg_garret().copy()
    light_beam(img, [(760, 820), (1000, 820), (700, 1900), (300, 1900)], 0.10)
    dust(img, t, 380, 900, 900, 1800)
    table_items(img, t, {})
    p = t / dur
    if p < 0.45:
        shake = math.sin(t * 14) * 6 * seg(p, 0.15, 0.3)
        pose = dict(armL=(26, 120 + shake), itemL="wallet", wallet_open=1.0, armR=(6, 10), look=(0.3, 1.0),
                    brow=0.7, mouth="frown", head=12, lean=3, turn=0.3)
    else:
        k = ease(seg(p, 0.45, 0.6))
        pose = dict(armL=(4, 8), armR=(lerp(6, 26, k), lerp(10, 138, k)), itemR="watch" if k > 0.5 else None,
                    look=(-0.2, 0.9), brow=0.9, head=12, lean=3, turn=-0.1, smile=-0.2)
    pose["blink"] = 1.0 if 0.3 < p < 0.33 or 0.8 < p < 0.83 else 0.0
    render_actor(img, draw_rask, 610, 1860, 0.95, pose)
    return img, dict(zoom=1.0 + 0.06 * ease(p), cx=0.55, cy=0.5)


# =============================================================== SCENE 3: door chain + counter

@cached
def bg_door():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (96, 86, 60), (62, 54, 40)), (0, 0))
    rnd = random.Random(4)
    wallpaper(d, 0, 0, W, H, (110, 98, 66, 255), (100, 88, 60, 255), rnd)
    d.rect(150, 120, 220, H + 10, (80, 58, 40, 255), 6)  # jamb
    d.rect(150, 90, W + 10, 140, (80, 58, 40, 255), 6)  # lintel
    d.rect(220, 140, W + 10, H + 10, (8, 6, 6, 255), 0)  # darkness inside
    return d.done()


def door_slab(gap):
    d = BD(W, H)
    x0 = 220 + gap
    d.rect(x0, 140, x0 + 900, H + 20, (104, 70, 46, 255), 7)
    d.rect(x0 + 60, 220, x0 + 760, 820, (114, 78, 52, 255), 4)
    d.rect(x0 + 60, 900, x0 + 760, 1700, (114, 78, 52, 255), 4)
    d.line([(x0 + 4, 140), (x0 + 4, H)], 10, (70, 48, 32, 255))
    d.ell(x0 + 60, 1020, 18, 18, (180, 150, 80, 255), 4)
    return d.done()


def chain(img, x0, y0, x1, y1, sag):
    d = ImageDraw.Draw(img)
    n = 9
    for i in range(n + 1):
        k = i / n
        x = lerp(x0, x1, k)
        y = lerp(y0, y1, k) + math.sin(k * math.pi) * sag
        if i % 2:
            d.ellipse([x - 13, y - 7, x + 13, y + 7], outline=(150, 150, 146), width=6)
        else:
            d.ellipse([x - 6, y - 12, x + 6, y + 12], outline=(170, 170, 166), width=6)


@cached
def bg_pawn():
    d = BD(opaque=True)
    rnd = random.Random(6)
    wallpaper(d, 0, 0, W, 1500, (150, 140, 92, 255), (138, 128, 84, 255), rnd, peel=False)
    # window with geraniums
    d.rect(560, 300, 940, 760, (176, 190, 184, 255), 6)
    d.line([(750, 300), (750, 760)], 6)
    d.rect(540, 760, 960, 790, (110, 84, 56, 255), 4)
    for x in (620, 860):
        d.poly([(x - 34, 760), (x + 34, 760), (x + 26, 700), (x - 26, 700)], (170, 90, 60, 255), 4)
        for k in range(5):
            d.ell(x + (k - 2) * 18, 670 - (k % 2) * 20, 22, 20, (70, 120, 70, 255), 3)
        d.ell(x - 6, 640, 14, 14, (210, 60, 60, 255), 3)
        d.ell(x + 16, 630, 12, 12, (230, 80, 80, 255), 3)
    # icon corner with lamp
    d.rect(120, 260, 290, 480, (200, 160, 80, 255), 6)
    d.rect(140, 280, 270, 460, (150, 110, 60, 255), 3)
    d.ell(205, 340, 34, 34, (230, 200, 120, 255), 3)
    d.line([(205, 480), (205, 540)], 3)
    d.poly([(185, 540), (225, 540), (215, 580), (195, 580)], (170, 40, 40, 255), 3)
    # floor
    d.rect(-10, 1500, W + 10, H + 10, (96, 74, 52, 255), 5)
    return d.done()


@cached
def counter():
    d = BD(W, 560)
    d.rect(-10, 0, W + 10, 70, (120, 86, 56, 255), 6)
    d.rect(-10, 70, W + 10, 560, (96, 66, 44, 255), 6)
    for x in (180, 540, 900):
        d.rect(x - 120, 130, x + 120, 480, (104, 72, 48, 255), 4)
    return d.done()


def silver(d, x, y, r=34, label=None):
    d.ellipse([x - r, y - r * 0.45, x + r, y + r * 0.45], fill=(206, 208, 204), outline=INK, width=4)
    d.ellipse([x - r * 0.6, y - r * 0.25, x + r * 0.6, y + r * 0.25], outline=(150, 150, 146), width=3)


def scene3(t, dur):
    p = t / dur
    split = 0.42
    if p < split + 0.05:
        a = bg_door().copy()
        gap = 130 * ease(seg(p, 0.02, 0.14))
        eyes = seg(p, 0.12, 0.16)
        if eyes > 0:
            lay, d = layer_draw(a)
            cx = 220 + gap / 2
            lk = math.sin(t * 2.2) * 4
            bl = 0.15 if 0.27 < p < 0.29 else 1.0
            for ex in (cx - 30, cx + 30):
                d.ellipse([ex - 22, 760 - 10 * bl, ex + 22, 760 + 10 * bl], fill=(236, 226, 200, int(255 * eyes)))
                d.ellipse([ex + lk - 7, 760 - 7 * bl, ex + lk + 7, 760 + 7 * bl], fill=(30, 40, 30, int(255 * eyes)))
            d.line([(cx - 40, 728), (cx - 8, 738)], fill=(200, 184, 140), width=5)
            d.line([(cx + 40, 728), (cx + 8, 738)], fill=(200, 184, 140), width=5)
            d.polygon([(cx - 4, 786), (cx + 10, 816), (cx - 6, 818)], fill=(200, 168, 140, int(255 * eyes)))
            a.alpha_composite(lay)
        a.alpha_composite(door_slab(gap))
        chain(a, 196, 900, 220 + gap + 40, 902, 26 * (1 - gap / 260))
        cam_a = dict(zoom=1.0 + 0.08 * ease(p / split), cx=0.3, cy=0.42)
    if p >= split:
        b = bg_pawn().copy()
        q = (p - split) / (1 - split)
        weigh = math.sin(t * 5) * 10 * (1 - seg(q, 0.3, 0.35))
        apose = dict(armR=(26, 128 + weigh) if q < 0.35 else (10, 60), itemR="watch" if q < 0.35 else None,
                     armL=(10, 30), turn=-0.5, look=(-0.4, 0.6) if q < 0.35 else (-0.8, 0.0),
                     mouth="grin" if q > 0.3 else "neutral", brow=-0.4, head=4 if q < 0.35 else -2)
        render_actor(b, draw_alyona, 760, 1960, 1.25, apose)
        rpose = dict(armL=(4, 8), armR=(4, 8), turn=0.6, look=(0.9, 0.3), brow=0.7, mouth="frown" if q > 0.7 else "neutral",
                     head=4)
        render_actor(b, draw_rask, 230, 2380, 1.2, rpose)
        b.alpha_composite(counter(), (0, 1520))
        d = ImageDraw.Draw(b)
        # coins pushed over: 1 rouble + 50 kopecks
        k = ease(seg(q, 0.42, 0.6))
        if k > 0:
            silver(d, lerp(720, 330, k), 1556, 62)
            silver(d, lerp(780, 470, k), 1562, 44)
            if k > 0.95:
                d.text((400, 1660), "1½ руб.", font=font(FONT_SERIF_B, 64), fill=(250, 240, 210),
                       anchor="mm", stroke_width=5, stroke_fill=(40, 28, 20))
        # interest taken back in advance
        k2 = ease(seg(q, 0.7, 0.85))
        if k2 > 0:
            silver(d, lerp(470, 760, k2), 1566, 30)
            al = int(255 * min(1, k2 * 2))
            lay, d2 = layer_draw(b)
            d2.text((760, 1700 - 30 * k2), "− проценты", font=font(FONT_SERIF_B, 64), fill=(255, 96, 64, al),
                   anchor="mm", stroke_width=5, stroke_fill=(40, 28, 20, al))
            b.alpha_composite(lay)
        cam_b = dict(zoom=1.1 + 0.05 * ease(q), cx=0.5, cy=0.6)
    if p < split:
        return a, cam_a
    if p >= split + 0.05:
        return b, cam_b
    m = ease((p - split) / 0.05)
    a2 = camera(a.convert("RGB"), cam_a["zoom"], cam_a["cx"], cam_a["cy"])
    b2 = camera(b.convert("RGB"), cam_b["zoom"], cam_b["cx"], cam_b["cy"])
    return Image.blend(a2, b2, m).convert("RGBA"), dict(zoom=1.0, cx=0.5, cy=0.5)


# =============================================================== SCENE 4: abacus & growing debt

def abacus(img, t, slides):
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 140, 1470, 760, 1760
    d.rounded_rectangle([x0, y0, x1, y1], 14, fill=(120, 80, 48), outline=INK, width=6)
    d.rectangle([x0 + 24, y0 + 22, x1 - 24, y1 - 22], fill=(150, 120, 80), outline=INK, width=3)
    rows = 6
    for r in range(rows):
        y = y0 + 48 + r * 40
        d.line([(x0 + 24, y), (x1 - 24, y)], fill=(70, 50, 34), width=3)
        moved = slides[r]
        for b in range(10):
            # beads: 'moved' of them on the left, rest on right
            if b < moved:
                bx = x0 + 60 + b * 34
            else:
                bx = x1 - 60 - (9 - b) * 34
            col = (230, 214, 180) if b in (4, 5) else (70, 46, 34)
            d.ellipse([bx - 16, y - 15, bx + 16, y + 15], fill=col, outline=INK, width=3)


def scene4(t, dur):
    img = bg_pawn().copy()
    p = t / dur
    months = int(clamp((p - 0.12) / 0.6) * 12 + 0.0001) if p > 0.12 else 0
    step = ((p - 0.12) / 0.6 * 12) % 1 if 0.12 < p < 0.72 else 1
    flick = math.sin(min(1, step * 3) * math.pi) * 14
    apose = dict(armR=(18, 96 + flick), armL=(18, 80), turn=0.1, look=(0.2, 0.9) if p < 0.75 else (0.0, 0.0),
                 mouth="grin", brow=-0.5, head=6 if p < 0.75 else 0, blink=0.4 if p > 0.8 else 0.0)
    render_actor(img, draw_alyona, 450, 2000, 1.2, apose)
    img.alpha_composite(counter(), (0, 1400))
    slides = [min(10, months - r * 2) if months > r * 2 else 0 for r in range(6)]
    slides = [max(0, min(10, s * 2)) for s in slides]
    abacus(img, t, slides)
    # chart panel
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([60, 330, 1020, 1000], 16, fill=(240, 228, 196), outline=INK, width=6)
    d.text((540, 400), "Долг за 100 руб.", font=font(FONT_SERIF_B, 52), fill=(60, 36, 26), anchor="mm")
    base = 905
    for m in range(12):
        x = 130 + m * 70
        d.text((x, base + 40), str(m + 1), font=font(FONT_SERIF_B, 30), fill=(90, 60, 40), anchor="mm")
        if m < months:
            n = 3 + m
            pop = 1.0 if m < months - 1 else ease_out(step * 3)
            for c in range(int(n * pop)):
                cy = base - c * 13
                d.ellipse([x - 28, cy - 9, x + 28, cy + 9], fill=(214, 170, 70), outline=INK, width=3)
    d.text((540, 975), "месяцы", font=font(FONT_SERIF_I, 30), fill=(90, 60, 40), anchor="mm")
    pct = 7 * months
    if months:
        col = (60, 36, 26) if months < 12 else (180, 40, 30)
        d.text((540, 500), f"+{pct}%", font=font(FONT_SERIF_B, 110 if months < 12 else 130), fill=col, anchor="mm")
    return img, dict(zoom=1.0 + 0.04 * ease(p), cx=0.5, cy=0.45)


# =============================================================== SCENE 5: modern phone

@cached
def bg_modern():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (46, 78, 86), (22, 38, 46)), (0, 0))
    rnd = random.Random(3)
    for _ in range(18):
        x, y, r = rnd.randint(0, W), rnd.randint(0, H), rnd.randint(30, 110)
        d.ell(x, y, r, r, (120, 170, 170, 40), 0)
    return d.done()


def phone_screen(t, q):
    S = BD(560, 980, (246, 246, 242, 255))
    S.rect(0, 0, 560, 50, (230, 230, 226, 255), 0)
    S.text(40, 26, "10:09", FONT_CAP, 24, (40, 40, 40), "lm")
    S.rect(0, 50, 560, 150, (40, 170, 110, 255), 0)
    S.text(280, 100, "БЫСТРОЗАЙМ", FONT_CAP, 44, (255, 255, 255))
    S.text(280, 230, "Деньги", FONT_CAP, 62, (30, 30, 30))
    S.text(280, 300, "за 5 минут!", FONT_CAP, 62, (30, 30, 30))
    S.d.rounded_rectangle([40 * B, 360 * B, 520 * B, 640 * B], 30 * B, fill=(226, 246, 234), outline=(40, 170, 110), width=4 * B)
    S.text(280, 400, "ВСЕГО", FONT_CAP, 36, (40, 120, 80))
    S.text(280, 510, "1%", FONT_CAP, 170, (30, 160, 96))
    S.text(280, 610, "в день", FONT_CAP, 40, (40, 120, 80))
    pulse = 1 + 0.05 * math.sin(t * 8)
    bw, bh = 200 * pulse, 46 * pulse
    S.d.rounded_rectangle([(280 - bw) * B, (720 - bh) * B, (280 + bw) * B, (720 + bh) * B], 40 * B, fill=(250, 140, 40))
    S.text(280, 720, "ПОЛУЧИТЬ", FONT_CAP, 44, (255, 255, 255))
    for i in range(4):
        S.line([(40, 820 + i * 22), (520 - (i % 2) * 60, 820 + i * 22)], 3, (200, 200, 196, 255))
    S.text(280, 920, "ПСК: 365% годовых", FONT_CAP, 18, (170, 170, 166))
    return S.done()


def scene5(t, dur):
    img = bg_modern().copy()
    p = t / dur
    slide = ease_out(seg(p, 0.0, 0.08))
    stamp_t = seg(p, 0.3, 0.36)
    shake = math.sin(t * 60) * 14 * (1 - seg(p, 0.36, 0.42)) * (stamp_t > 0)
    px, py = 540 + shake, lerp(2200, 960, slide)
    scr = phone_screen(t, p)
    # phone body
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([px - 310, py - 560, px + 310, py + 560], 70, fill=(24, 24, 28), outline=INK, width=6)
    img.alpha_composite(scr, (int(px - 280), int(py - 490)))
    d.rounded_rectangle([px - 70, py - 536, px + 70, py - 512], 12, fill=(10, 10, 12))
    # hand
    d.polygon([(px + 140, py + 540), (px + 420, py + 300), (W + 200, py + 700), (W + 200, H + 50), (px + 120, H + 50)],
              fill=(120, 124, 132), outline=INK)
    d.line([(px + 140, py + 540), (px + 420, py + 300)], fill=INK, width=6)
    d.ellipse([px + 220, py + 260, px + 360, py + 420], fill=SKIN_M, outline=INK, width=5)
    d.rounded_rectangle([px + 270, py + 140, px + 330, py + 320], 30, fill=SKIN_M, outline=INK, width=5)
    # notification
    nk = seg(p, 0.1, 0.14) * (1 - seg(p, 0.26, 0.3))
    if nk > 0:
        ny = py - 520 + 40 * ease_out(nk) - 60 * (1 - nk)
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        ld.rounded_rectangle([px - 260, ny, px + 260, ny + 110], 24, fill=(255, 255, 255, int(240 * nk)), outline=(60, 60, 60, int(255 * nk)), width=3)
        ld.text((px - 230, ny + 34), "Одобрено!", font=font(FONT_CAP, 34), fill=(30, 160, 96, int(255 * nk)), anchor="lm")
        ld.text((px - 230, ny + 78), "10 000 руб. уже ждут вас", font=font(FONT_CAP, 28), fill=(60, 60, 60, int(255 * nk)), anchor="lm")
        img.alpha_composite(lay)
    # stamp
    if stamp_t > 0:
        s = lerp(2.2, 1.0, ease_out(stamp_t))
        st = Image.new("RGBA", (640, 220))
        sd = ImageDraw.Draw(st)
        sd.rounded_rectangle([10, 10, 630, 210], 24, outline=(210, 40, 30), width=14, fill=(255, 255, 255, 200))
        sd.text((320, 80), "= 365%", font=font(FONT_CAP, 96), fill=(210, 40, 30), anchor="mm")
        sd.text((320, 165), "В ГОД", font=font(FONT_CAP, 54), fill=(210, 40, 30), anchor="mm")
        st = st.rotate(-10, expand=True, resample=Image.BICUBIC)
        st = st.resize((int(st.width * s), int(st.height * s)), Image.BICUBIC)
        a = st.split()[3].point(lambda v: int(v * min(1, stamp_t * 3)))
        st.putalpha(a)
        img.alpha_composite(st, (int(px - st.width / 2 + 40), int(py - 40 - st.height / 2)))
    # magnifier over the fine print
    mk = ease(seg(p, 0.6, 0.7))
    if mk > 0:
        fx, fy = px, py - 490 + 920
        gx, gy = lerp(W + 300, fx, mk), lerp(1700, fy, mk)
        R = 200
        src = img.crop((int(gx - R / 1.8), int(gy - R / 1.8), int(gx + R / 1.8), int(gy + R / 1.8))).resize((2 * R, 2 * R), Image.BICUBIC)
        m = Image.new("L", (2 * R, 2 * R), 0)
        ImageDraw.Draw(m).ellipse([0, 0, 2 * R, 2 * R], fill=255)
        img.paste(src, (int(gx - R), int(gy - R)), m)
        d = ImageDraw.Draw(img)
        d.ellipse([gx - R, gy - R, gx + R, gy + R], outline=(60, 50, 40), width=16)
        d.line([(gx + R * 0.7, gy + R * 0.7), (gx + R * 1.5, gy + R * 1.5)], fill=(90, 60, 40), width=34)
    return img, dict(zoom=1.0 + 0.03 * ease(p), cx=0.5, cy=0.5)


SKIN_M = (232, 196, 164)


# =============================================================== SCENE 6: the room empties

def debt_note(img, amount, k):
    d = ImageDraw.Draw(img)
    d.polygon([(120, 700), (430, 680), (440, 940), (130, 960)], fill=(240, 232, 210), outline=INK)
    d.line([(120, 700), (430, 680), (440, 940), (130, 960), (120, 700)], fill=INK, width=5)
    d.ellipse([268, 680, 286, 698], fill=(160, 40, 36), outline=INK, width=3)
    d.text((280, 750), "ДОЛГ:", font=font(FONT_SERIF_B, 50), fill=(60, 40, 30), anchor="mm")
    size = int(70 + 10 * k)
    d.text((282, 860), amount, font=font(FONT_SERIF_B, size), fill=(180, 40, 30), anchor="mm")


def scene6(t, dur):
    img = bg_garret().copy()
    dust(img, t, 380, 900, 900, 1800, seed=5)
    p = t / dur
    times = dict(ring=0.12, books=0.3, picture=0.48, candle=0.66)
    gone = {k: ease(seg(p, v, v + 0.06)) for k, v in times.items()}
    table_items(img, t, gone)
    pos = dict(ring=(920, 1386), books=(840, 1330), picture=(630, 1085), candle=(1003, 1330))
    for k, v in times.items():
        poof(img, *pos[k], seg(p, v, v + 0.1))
    amounts = ["1½ руб.", "4 руб.", "7 руб.", "12 руб.", "19 руб."]
    idx = sum(1 for v in times.values() if p > v + 0.03)
    debt_note(img, amounts[idx], math.sin(seg(p, list(times.values())[max(0, idx - 1)] + 0.03,
                                                   list(times.values())[max(0, idx - 1)] + 0.15) * math.pi) if idx else 0)
    slump = ease(p)
    pose = dict(armL=(4, 10 + 6 * slump), armR=(4, 10 + 6 * slump), look=(0.1, 1.0), brow=0.9, mouth="frown",
                head=8 + 10 * slump, lean=2 + 4 * slump, turn=0.15, bob=12 * slump)
    if 0.3 < p < 0.62:  # glances at the vanishing things
        pose["look"] = (0.9, 0.2)
        pose["turn"] = 0.5
        pose["head"] = 2
    render_actor(img, draw_rask, 560, 1860, 0.95, pose)
    darken(img, 0.18 * p)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.5)


# =============================================================== SCENE 7: close-up, contract

@cached
def bg_close():
    return bg_garret().filter(ImageFilter.GaussianBlur(18))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    tk = ease(seg(p, 0.0, 0.16))
    rk = ease(seg(p, 0.12, 0.3))
    pose = dict(turn=lerp(-0.6, 0.0, tk), look=(lerp(-1, 0, tk), 0), head=lerp(-6, 0, tk), brow=lerp(0.6, -0.2, tk),
                smile=0.3 * tk, armL=(4, 6), armR=(lerp(4, 120, rk), lerp(8, 130, rk)), itemR="contract" if rk > 0.3 else None,
                circle_psk=ease(seg(p, 0.42, 0.62)))
    if 0.7 < p < 0.73:
        pose["blink"] = 1.0
    render_actor(img, draw_rask, 330, 3380, 2.3, pose)
    return img, dict(zoom=1.0 + 0.06 * ease(p), cx=0.5, cy=0.42)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
