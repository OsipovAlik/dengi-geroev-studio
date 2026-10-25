import math, random
from base import *
from chars6 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)


def bubble(img, x, y, lines, k, size=56, tail=1):
    if k <= 0:
        return
    if isinstance(lines, str):
        lines = [lines]
    lay = Image.new("RGBA", img.size)
    d = ImageDraw.Draw(lay)
    f = font(FONT_SERIF_BI, size)
    tw = max(d.textlength(s, font=f) for s in lines)
    s = ease_out(min(1, k * 2))
    w_, h_ = (tw + 110) * s, (size * 1.25 * len(lines) + size * 1.2) * s
    d.ellipse([x - w_ / 2, y - h_ / 2, x + w_ / 2, y + h_ / 2], fill=(250, 246, 234), outline=INK, width=5)
    for i, r in enumerate((16, 10)):
        cx, cy = x + tail * (60 + i * 30), y + h_ / 2 + 20 + i * 28
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 246, 234), outline=INK, width=4)
    if s > 0.9:
        for i, ln in enumerate(lines):
            d.text((x, y + (i - (len(lines) - 1) / 2) * size * 1.25), ln, font=f, fill=(60, 40, 30), anchor="mm")
    img.alpha_composite(lay)


def snow(img, t, k, n=80, seed=2):
    if k <= 0:
        return
    lay, d = layer_draw(img)
    rnd = random.Random(seed)
    for i in range(n):
        bx = rnd.uniform(0, W)
        sp = rnd.uniform(80, 200)
        y = (rnd.uniform(0, H) + t * sp) % H
        x = bx + math.sin(t * 1.3 + i) * 30
        r = rnd.uniform(4, 9)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, int(230 * k)))
    img.alpha_composite(lay)


def coin(d, x, y, r=18):
    d.ellipse([x - r, y - r * 0.5, x + r, y + r * 0.5], fill=(214, 170, 70), outline=INK, width=3)


# ================================================================ backgrounds

@cached
def bg_office():
    d = BD(opaque=True)
    rnd = random.Random(3)
    wallpaper(d, 0, 0, W, 1500, (100, 92, 80, 255), (90, 82, 72, 255), rnd, peel=False)
    d.rect(-10, 1500, W + 10, H + 10, (70, 56, 44, 255), 5)
    for y in range(1540, H, 60):
        d.line([(0, y), (W, y)], 3, (58, 46, 36, 255))
    # tall frosty window
    d.rect(640, 240, 980, 900, (150, 166, 180, 255), 8)
    d.line([(810, 240), (810, 900)], 8)
    d.line([(640, 570), (980, 570)], 8)
    for i in range(30):
        x, y = rnd.randint(650, 970), rnd.randint(250, 890)
        d.ell(x, y, 5, 5, (230, 236, 240, 255), 0)
    return d.done()


def desk(img, x, y, coins_k, t):
    d = ImageDraw.Draw(img)
    d.rectangle([x - 300, y - 30, x + 300, y + 10], fill=(110, 76, 50), outline=INK, width=5)
    d.rectangle([x - 280, y + 10, x - 240, y + 330], fill=(90, 62, 40), outline=INK, width=4)
    d.rectangle([x + 240, y + 10, x + 280, y + 330], fill=(90, 62, 40), outline=INK, width=4)
    # ledger
    d.polygon([(x - 250, y - 30), (x - 60, y - 30), (x - 80, y - 70), (x - 230, y - 70)], fill=(236, 226, 200), outline=INK)
    # coin stacks
    for k in range(3):
        n = int(6 + 5 * coins_k) if k != 1 else int(9 + 6 * coins_k)
        for i in range(n):
            coin(d, x + 60 + k * 70, y - 40 - i * 10, 26)


def candle_glow(img, x, y, a=0.6):
    img.alpha_composite(radial_glow(600, 600, 300, 300, 280, (255, 200, 120), a), (x - 300, y - 300))


# ================================================================ SCENE 1: rich and miserable

def scene1(t, dur):
    img = bg_office().copy()
    p = t / dur
    darken(img, 0.25)
    candle_glow(img, 600, 1350, 0.55)
    desk(img, 560, 1500, ease(seg(p, 0.0, 0.5)), t)
    d = ImageDraw.Draw(img)
    d.rectangle([590, 1400, 610, 1470], fill=(246, 240, 220), outline=INK, width=3)
    fl = 1 + 0.15 * math.sin(t * 13)
    d.polygon([(600, 1394 - 30 * fl), (610, 1384), (600, 1400), (590, 1384)], fill=(250, 200, 80))
    counting = p < 0.6
    pose = dict(hat="none", armR=(50, 100 + 10 * math.sin(t * 8)), handR="palm", armL=(30, 80), turn=0.4, look=(0.6, 0.8),
                brow=-0.6, mouth="neutral", smile=-0.4, head=10, lean=14)
    if not counting:
        pose.update(look=(-0.2, 0), turn=0.0, brow=-0.9, mouth="frown", armR=(10, 20), armL=(10, 20), head=4, lean=8)
    render_actor(img, draw_scrooge, 300, 1880, 0.95, pose)
    bubble(img, 380, 520, "Вздор!", seg(p, 0.62, 0.7), 70)
    return img, dict(zoom=1.04 + 0.03 * ease(p), cx=0.5, cy=0.58)


# ================================================================ SCENE 2: Bob freezing over one coal

def scene2(t, dur):
    img = bg_office().copy()
    p = t / dur
    darken(img, 0.3)
    d = ImageDraw.Draw(img)
    # tiny fireplace with a single coal
    d.rectangle([90, 1200, 390, 1500], fill=(80, 60, 50), outline=INK, width=6)
    d.rectangle([130, 1280, 350, 1500], fill=(30, 24, 22), outline=INK, width=4)
    glow = 0.5 + 0.2 * math.sin(t * 7)
    img.alpha_composite(radial_glow(200, 200, 100, 100, 60, (255, 120, 40), glow), (140, 1380))
    d = ImageDraw.Draw(img)
    d.ellipse([228, 1462, 262, 1486], fill=(200, 70, 30), outline=INK, width=3)
    d.text((240, 1180), "1 уголёк", font=font(FONT_SERIF_BI, 40), fill=(240, 230, 210), anchor="mm")
    # high clerk desk
    d.polygon([(560, 1360), (1000, 1320), (1000, 1360), (560, 1400)], fill=(110, 76, 50), outline=INK)
    d.rectangle([600, 1390, 630, 1700], fill=(90, 62, 40), outline=INK, width=4)
    d.rectangle([940, 1360, 970, 1700], fill=(90, 62, 40), outline=INK, width=4)
    sh = math.sin(t * 45) * 3
    pose = dict(armL=(60, 130), armR=(60, 130), shiver=sh, mouth="o", brow=1.0, look=(-0.8, 0), turn=-0.4)
    render_actor(img, draw_bob, 760, 1830, 0.92, pose)
    # wage tag
    k = ease_out(seg(p, 0.55, 0.65))
    if k > 0:
        lay, ld = layer_draw(img)
        ld.rounded_rectangle([W / 2 - 330 * k, 440, W / 2 + 330 * k, 440 + 150 * k], 26, fill=(250, 240, 214, 245), outline=INK, width=5)
        img.alpha_composite(lay)
        if k > 0.9:
            d = ImageDraw.Draw(img)
            d.text((W / 2, 490), "15 шиллингов", font=font(FONT_SERIF_B, 64), fill=(160, 40, 32), anchor="mm")
            d.text((W / 2, 556), "в неделю", font=font(FONT_SERIF_I, 44), fill=BROWN2, anchor="mm")
    snow(img, t, 0.35, 30)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ SCENE 3: ghost of the future -> Christmas morning

@cached
def bg_grave():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (40, 44, 56), (70, 72, 80)), (0, 0))
    rnd = random.Random(5)
    d.ell(820, 360, 90, 90, (210, 214, 220, 255), 0)
    for i in range(6):
        x = rnd.randint(-60, W)
        d.line([(x, 1500), (x + rnd.randint(-40, 40), 900)], 14, (30, 30, 36, 255))
    d.rect(-10, 1500, W + 10, H + 10, (56, 58, 62, 255), 0)
    # gravestone
    d.poly([(360, 1560), (360, 1100), (420, 1040), (660, 1040), (720, 1100), (720, 1560)], (130, 130, 136, 255), 6)
    d.text(540, 1200, "ЭБЕНЕЗЕР", FONT_SERIF_B, 50, (60, 60, 66, 255))
    d.text(540, 1270, "СКРУДЖ", FONT_SERIF_B, 64, (60, 60, 66, 255))
    for i in range(30):
        x, y = rnd.randint(300, 780), rnd.randint(1500, 1640)
        d.line([(x, y), (x + rnd.randint(-10, 10), y - rnd.randint(20, 50))], 4, (80, 90, 70, 255))
    return d.done()


@cached
def bg_morning():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (200, 220, 236), (240, 236, 220)), (0, 0))
    rnd = random.Random(8)
    x = -40
    while x < W + 40:
        w_ = rnd.randint(240, 320)
        top = rnd.randint(500, 700)
        d.rect(x, top, x + w_, 1560, (150, 100, 76, 255), 5)
        d.poly([(x - 10, top), (x + w_ + 10, top), (x + w_ - 20, top - 60), (x + 20, top - 60)], (245, 248, 252, 255), 4)
        for row in range(2):
            wx = x + 50
            wy = top + 80 + row * 260
            d.rect(wx, wy, wx + 80, wy + 140, (250, 220, 140, 255), 4)
        x += w_
    d.rect(-10, 1560, W + 10, H + 10, (244, 246, 250, 255), 0)
    return d.done()


def ghost(img, x, y, t, a):
    lay, d = layer_draw(img)
    sway = math.sin(t * 1.5) * 10
    pts = [(x + sway, y - 900), (x + 160, y - 600), (x + 200, y), (x - 200, y), (x - 160, y - 600)]
    d.polygon(pts, fill=(14, 14, 18, int(240 * a)))
    d.ellipse([x - 90 + sway, y - 880, x + 90 + sway, y - 680], fill=(4, 4, 6, int(255 * a)))
    # pointing arm
    d.line([(x - 120, y - 640), (x - 300, y - 760)], fill=(14, 14, 18, int(240 * a)), width=50)
    d.line([(x - 300, y - 760), (x - 380, y - 800)], fill=(200, 196, 190, int(230 * a)), width=10)
    img.alpha_composite(lay)


def scene3(t, dur):
    p = t / dur
    morning = p > 0.5
    if not morning:
        img = bg_grave().copy()
        ghost(img, 900, 1700, t, ease(seg(p, 0.0, 0.15)))
        pose = dict(hat="cap", armL=(60, 140), armR=(60, 140), handL="palm", handR="palm", mouth="o", brow=1.0, look=(-0.3, 0.6),
                    turn=-0.2, shiver=math.sin(t * 40) * 3, lean=0)
        render_actor(img, draw_scrooge, 230, 1880, 0.78, pose)
        snow(img, t, 0.4, 40)
        cam = dict(zoom=1.03, cx=0.5, cy=0.55)
    else:
        img = bg_morning().copy()
        k = ease(seg(p, 0.5, 0.56))
        hop = abs(math.sin(t * 5)) * 20
        pose = dict(hat="top", scarf=True, armL=(30, 110), itemL="turkey", armR=(130 + 15 * math.sin(t * 5), 30), smile=0.9,
                    mouth="grin", brow=0.8, look=(0.6, -0.3), turn=0.4, bob=-hop, lean=-4, legL=(10, 10))
        render_actor(img, draw_scrooge, 430, 1880, 0.9, pose)
        bpose = dict(armL=(80, 140), armR=(80, 140), mouth="o", brow=1.0, smile=0.8, look=(-0.7, -0.2), turn=-0.5)
        if p > 0.78:
            bpose.update(mouth="grin", armL=(150, 20), armR=(150, 20))
        render_actor(img, draw_bob, 860, 1880, 0.82, bpose)
        if p > 0.8:
            bubble(img, 760, 520, "+ жалованье!", seg(p, 0.8, 0.88), 64, tail=1)
        snow(img, t, 0.5, 40)
        img = Image.blend(bg_grave().copy().convert("RGBA"), img, k) if k < 1 else img
        cam = dict(zoom=1.03, cx=0.5, cy=0.55)
    return img, cam


# ================================================================ SCENE 4: 50 / 30 / 20 of 80 000

def paper_bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


def scene4(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    d.text((W / 2, 410), "Доход 80 000 ₽", font=font(FONT_SERIF_B, 72), fill=BROWN, anchor="mm")
    parts = [("40 000", "обязательное", "50%", (170, 90, 70), 0.30), ("24 000", "жизнь и радость", "30%", (90, 140, 170), 0.48),
             ("16 000", "цели и подушка", "20%", (214, 170, 70), 0.66)]
    y0 = 520
    x0, x1 = 90, W - 90
    tot = 0.0
    for val, lab, pct, col, st in parts:
        frac = float(pct[:-1]) / 100
        k = ease_out(seg(p, st, st + 0.1))
        xa = x0 + (x1 - x0) * tot
        xb = xa + (x1 - x0) * frac * k
        if k > 0:
            d.rectangle([xa, y0, xb, y0 + 150], fill=col, outline=INK, width=4)
            if k > 0.9:
                d.text(((xa + xb) / 2, y0 + 75), pct, font=font(FONT_SERIF_B, 56), fill=(255, 250, 240), anchor="mm",
                       stroke_width=3, stroke_fill=INK)
                row = parts.index((val, lab, pct, col, st))
                yy = 780 + row * 110
                d.rectangle([110, yy - 30, 170, yy + 30], fill=col, outline=INK, width=3)
                d.text((200, yy), f"{val} ₽ — {lab}", font=font(FONT_SERIF_B, 54), fill=BROWN, anchor="lm")
        tot += frac
    if p < 0.28:
        d.text((W / 2, 900), "копить — да,", font=font(FONT_SERIF_I, 60), fill=BROWN2, anchor="mm")
        d.text((W / 2, 980), "но у денег должна быть задача", font=font(FONT_SERIF_I, 52), fill=BROWN2, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(hat="none", armR=(80, 150), handR="point", armL=(10, 20), turn=0.4, look=(0.5, -0.9), brow=0.5, smile=0.5)
    render_actor(img, draw_scrooge, 180, 2160, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 5: the modern Scrooge

def scene5(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    # bank balance growing
    bal = int(lerp(300000, 900000, ease(seg(p, 0.0, 0.9))) / 1000) * 1000
    d.rounded_rectangle([200, 360, W - 200, 560], 30, fill=(246, 244, 238), outline=INK, width=5)
    d.text((W / 2, 410), "на счёте", font=font(FONT_SERIF_I, 42), fill=BROWN2, anchor="mm")
    d.text((W / 2, 490), f"{bal:,}".replace(",", " ") + " ₽", font=font(FONT_SERIF_B, 76), fill=(40, 110, 60), anchor="mm")
    items = [("отдых", 0.25), ("здоровье", 0.45), ("друзья", 0.65)]
    for i, (lab, st) in enumerate(items):
        yy = 680 + i * 140
        k = seg(p, st - 0.12, st)
        if k > 0:
            d.rounded_rectangle([260, yy - 50, W - 260, yy + 50], 20, fill=(236, 226, 200), outline=INK, width=4)
            d.text((W / 2, yy), lab, font=font(FONT_SERIF_B, 56), fill=BROWN, anchor="mm")
        kx = ease_out(seg(p, st, st + 0.08))
        if kx > 0:
            d.line([(270, yy - 40), (270 + (W - 540) * kx, yy + 40)], fill=(190, 40, 32), width=7)
            d.line([(270, yy + 40), (270 + (W - 540) * kx, yy - 40)], fill=(190, 40, 32), width=7)
            d.text((W / 2, yy), lab, font=font(FONT_SERIF_B, 56), fill=BROWN, anchor="mm", stroke_width=5, stroke_fill=(236, 226, 200))
    img = img.convert("RGBA")
    pose = dict(hat="top", armL=(10, 20), armR=(10, 20), turn=-0.4, look=(-0.3, -0.9), brow=-0.8, mouth="frown", head=6)
    render_actor(img, draw_scrooge, 880, 2180, 0.64, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 6: every ruble has a job

def scene6(t, dur):
    img = bg_morning().copy()
    p = t / dur
    lay, ld = layer_draw(img)
    ld.rectangle([0, 0, W, H], fill=(250, 240, 214, 120))
    img.alpha_composite(lay)
    d = ImageDraw.Draw(img)
    jobs = [("подушка", (110, 140, 170), 0.12), ("цели", (214, 170, 70), 0.3), ("радость", (200, 90, 100), 0.62)]
    for i, (lab, col, st) in enumerate(jobs):
        k = ease_out(seg(p, st, st + 0.1))
        if k <= 0:
            continue
        x = 200 + i * 340
        y = lerp(300, 820, k)
        r = 120
        d.ellipse([x - r, y - r, x + r, y + r], fill=col, outline=INK, width=6)
        d.ellipse([x - r + 20, y - r + 20, x + r - 20, y + r - 20], outline=(255, 250, 230), width=4)
        d.text((x, y - 10), "₽", font=font(FONT_SERIF_B, 110), fill=(255, 250, 235), anchor="mm", stroke_width=3, stroke_fill=INK)
        d.rounded_rectangle([x - 150, y + 140, x + 150, y + 220], 20, fill=(250, 244, 230), outline=INK, width=4)
        d.text((x, y + 180), lab, font=font(FONT_SERIF_B, 48), fill=BROWN, anchor="mm")
    pose = dict(hat="top", scarf=True, armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin" if p > 0.6 else "neutral",
                brow=0.6, look=(0, -0.4), turn=0.1)
    render_actor(img, draw_scrooge, 540, 2200, 0.66, pose)
    snow(img, t, 0.4, 30)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 7: CTA

@cached
def bg_close():
    return bg_morning().filter(ImageFilter.GaussianBlur(16))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(hat="top", scarf=True, turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_scrooge, 540, 2700, 2.0, pose)
    snow(img, t, 0.6, 50)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
