import math, random
from base import *


def coin_ell(d, x, y, r=16):
    d.ellipse([x - r, y - r * 0.5, x + r, y + r * 0.5], fill=(214, 170, 70), outline=INK, width=3)


# =============================================================== SCENE 1: the chest of gold

@cached
def bg_store():
    d = BD(opaque=True)
    rnd = random.Random(1)
    wallpaper(d, 0, 0, W, 1500, (120, 106, 80, 255), (110, 96, 72, 255), rnd)
    d.rect(-10, 1500, W + 10, H + 10, (92, 72, 52, 255), 5)
    for y in range(1540, H, 60):
        d.line([(0, y), (W, y)], 3, (74, 56, 40, 255))
    # the famous junk heap
    d.poly([(640, 1520), (700, 1200), (780, 1120), (900, 1150), (1000, 1260), (1080, 1300), (1080, 1520)], (110, 96, 76, 255), 5)
    for (x, y, w_, h_, c) in ((720, 1260, 90, 30, (90, 70, 50, 255)), (840, 1200, 60, 70, (150, 140, 120, 255)),
                              (930, 1300, 110, 24, (70, 60, 50, 255)), (760, 1360, 70, 50, (130, 90, 60, 255))):
        d.rect(x, y, x + w_, y + h_, c, 3)
    d.line([(800, 1180), (1000, 1130)], 6, (90, 66, 44, 255))  # broken chair leg
    d.ell(980, 1400, 40, 22, (170, 160, 140, 255), 3)  # old sole
    # cobwebs
    for (cx, cy, s) in ((0, 0, 1), (W, 0, -1)):
        for k in range(5):
            d.line([(cx, cy), (cx + s * (60 + k * 40), cy + 200 - k * 40)], 2, (200, 196, 186, 255))
        for r in (60, 110, 160):
            d.line([(cx + s * r * 0.3, cy + r), (cx + s * r * 0.8, cy + r * 0.6), (cx + s * r, cy + r * 0.1)], 2, (200, 196, 186, 255))
    return d.done()


def chest(img, x, y, lid, t):
    d = ImageDraw.Draw(img)
    if lid > 0.02:
        img.alpha_composite(radial_glow(700, 700, 350, 350, 330, (255, 200, 90), 0.75 * lid), (x - 350, y - 420))
        d = ImageDraw.Draw(img)
    d.rectangle([x - 200, y - 150, x + 200, y + 60], fill=(110, 70, 40), outline=INK, width=6)
    d.rectangle([x - 200, y - 110, x + 200, y - 90], fill=(70, 60, 50), outline=INK, width=3)
    if lid > 0.02:
        rnd = random.Random(3)
        for i in range(34):
            cx = x - 170 + rnd.random() * 340
            cy = y - 160 + rnd.random() * 30 - abs(cx - x) * 0.1
            coin_ell(d, cx, cy, 20)
        for i in range(5):
            ph = (t * 1.5 + i * 0.2) % 1
            sx, sy = x - 150 + i * 75, y - 200 - ph * 60
            a = int(255 * (1 - ph))
            d.line([(sx - 8, sy), (sx + 8, sy)], fill=(255, 250, 210, a), width=3)
            d.line([(sx, sy - 8), (sx, sy + 8)], fill=(255, 250, 210, a), width=3)
    # lid: hinged at back edge, open = upright
    h = 180 * lid + 30 * (1 - lid)
    top = y - 150 - h
    d.polygon([(x - 205, y - 150), (x + 205, y - 150), (x + 195, top), (x - 195, top)], fill=(126, 82, 48), outline=INK)
    d.line([(x - 205, y - 150), (x + 205, y - 150), (x + 195, top), (x - 195, top), (x - 205, y - 150)], fill=INK, width=6)
    d.rectangle([x - 20, y - 140, x + 20, y - 100], fill=(200, 170, 80), outline=INK, width=3)


def scene1(t, dur):
    img = bg_store().copy()
    p = t / dur
    lid = 1 - ease(seg(p, 0.62, 0.72))
    chest(img, 300, 1700, lid, t)
    if p < 0.6:
        dip = math.sin(t * 5) * 10
        pose = dict(armL=(58, 30 + dip), itemL="coin", armR=(40, 70 - dip), handR="palm", look=(0.2, 1.0), brow=0.3,
                    smile=0.7, head=12, lean=16, turn=0.2)
    else:
        sus = math.sin(t * 3)
        pose = dict(armL=(10, 30), armR=(10, 30), look=(sus, -0.2), brow=-0.8, mouth="frown", head=2, lean=8,
                    turn=0.3 * sus)
    render_actor(img, draw_plushkin, 780, 1900, 1.1, pose)
    darken(img, 0.15)
    return img, dict(zoom=1.05 + 0.05 * ease(p), cx=0.5, cy=0.6)


# =============================================================== SCENE 2: the manor, Chichikov arrives

@cached
def bg_manor():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (150, 156, 150), (196, 194, 176)), (0, 0))
    rnd = random.Random(5)
    # far trees
    for i in range(14):
        x = rnd.randint(-40, W)
        d.ell(x, 900 + rnd.randint(-40, 40), rnd.randint(90, 160), rnd.randint(120, 200), (96, 110, 92, 255), 0)
    # the dilapidated house
    d.poly([(80, 1500), (80, 760), (1000, 760), (1000, 1500)], (130, 112, 86, 255), 6)
    for y in range(790, 1500, 36):
        d.line([(84, y), (996, y)], 2, (110, 94, 70, 255))
    d.poly([(40, 780), (540, 420), (1040, 780)], (90, 80, 70, 255), 6)
    d.poly([(600, 560), (700, 600), (660, 640)], (160, 150, 140, 255), 3)  # hole in roof
    d.rect(250, 440, 300, 600, (110, 80, 60, 255), 5)  # chimney
    for (x, broken) in ((150, False), (380, True), (760, True), (880, False)):
        d.rect(x, 860, x + 110, 1040, (40, 44, 48, 255), 5)
        if broken:
            d.poly([(x + 6, 866), (x + 60, 866), (x + 20, 930)], (170, 176, 172, 255), 2)
        else:
            d.rect(x + 6, 866, x + 104, 1034, (60, 66, 70, 255), 0)
            d.line([(x + 55, 860), (x + 55, 1040)], 4)
        d.poly([(x + 6, 1040), (x + 50, 1040), (x - 8, 1010)], (110, 84, 60, 255), 3)  # loose shutter
    # door
    d.rect(560, 1160, 720, 1500, (80, 60, 42, 255), 5)
    # boards nailed over a window
    d.line([(370, 900), (510, 1000)], 14, (150, 120, 80, 255))
    d.line([(370, 1000), (510, 900)], 14, (150, 120, 80, 255))
    # ground & weeds
    d.rect(-10, 1500, W + 10, H + 10, (112, 116, 80, 255), 5)
    for i in range(60):
        x = rnd.randint(0, W)
        y = rnd.randint(1490, H)
        d.line([(x, y), (x - 10, y - 40), (x + 4, y - 60)], 4, (80, 100, 60, 255))
    return d.done()


def bubble(img, x, y, text, k, size=56):
    if k <= 0:
        return
    lay = Image.new("RGBA", img.size)
    d = ImageDraw.Draw(lay)
    f = font(FONT_SERIF_BI, size)
    tw = d.textlength(text, font=f)
    s = ease_out(min(1, k * 2))
    w_, h_ = (tw + 70) * s, 120 * s
    d.ellipse([x - w_ / 2, y - h_ / 2, x + w_ / 2, y + h_ / 2], fill=(250, 246, 234), outline=INK, width=5)
    for i, r in enumerate((16, 10)):
        cx, cy = x + 40 + i * 30, y + h_ / 2 + 20 + i * 28
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 246, 234), outline=INK, width=4)
    if s > 0.9:
        d.text((x, y), text, font=f, fill=(60, 40, 30), anchor="mm")
    img.alpha_composite(lay)


def scene2(t, dur):
    img = bg_manor().copy()
    p = t / dur
    jing = math.sin(t * 9) * 25
    pp = dict(armR=(18, 40), itemR="keys", keys_swing=jing, armL=(6, 14), look=(0.8, 0.0), brow=-0.6, mouth="frown",
              turn=0.4, head=4)
    render_actor(img, draw_plushkin, 330, 1760, 1.0, pp)
    wk = ease(seg(p, 0.0, 0.35))
    x = lerp(1250, 790, wk)
    ph = t * 2 * math.pi * 0.9
    sw = math.sin(ph) * (1 - seg(p, 0.33, 0.36))
    cp = dict(legL=(18 * sw, max(0, -sw) * 24), legR=(-18 * sw, max(0, sw) * 24), armR=(6 + 6 * sw, 12), itemR="tophat",
              armL=(6 - 6 * sw, 12), turn=-0.5, look=(-0.9, 0.0), smile=0.8 if p < 0.45 else 0.2,
              brow=0.0 if p < 0.45 else 0.9, mouth="o" if 0.45 < p < 0.75 else "neutral", head=0 if p < 0.45 else -6,
              bob=-abs(sw) * 6)
    render_actor(img, draw_chichikov, x, 1800, 0.98, cp)
    bubble(img, 760, 520, "Ключница?..", seg(p, 0.5, 0.58), 60)
    return img, dict(zoom=1.04, cx=0.5, cy=0.52)


# =============================================================== SCENE 3: everything rots in the barn

@cached
def bg_barn():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (90, 70, 50), (60, 46, 34)), (0, 0))
    for x in range(0, W, 90):
        d.rect(x, 0, x + 86, 1560, (104, 80, 56, 255), 3, (70, 52, 36, 255))
    d.line([(0, 380), (W, 380)], 26, (70, 52, 36, 255))
    d.rect(-10, 1560, W + 10, H + 10, (80, 64, 44, 255), 5)
    for y in range(1600, H, 50):
        d.line([(0, y), (W, y)], 2, (70, 54, 38, 255))
    d.rect(420, 200, 640, 360, (40, 40, 44, 255), 5)  # small high window
    d.line([(530, 200), (530, 360)], 5)
    return d.done()


def grain_pile(img, x, y, rot, t):
    d = ImageDraw.Draw(img)
    col = mix((214, 170, 80), (110, 120, 70), rot)
    d.polygon([(x - 230, y), (x - 120, y - 210), (x, y - 260), (x + 120, y - 210), (x + 230, y)], fill=col, outline=INK)
    d.line([(x - 230, y), (x - 120, y - 210), (x, y - 260), (x + 120, y - 210), (x + 230, y)], fill=INK, width=5)
    rnd = random.Random(7)
    for i in range(60):
        gx = x + rnd.uniform(-180, 180)
        gy = y - rnd.uniform(10, 220) * (1 - abs(gx - x) / 260)
        c = mix((240, 200, 110), (90, 110, 60), rot)
        d.ellipse([gx - 4, gy - 3, gx + 4, gy + 3], fill=c)
    if rot > 0.3:
        for i in range(int(14 * rot)):  # mould spots
            mx, my = x + rnd.uniform(-150, 150), y - rnd.uniform(20, 180)
            r = rnd.uniform(10, 26)
            d.ellipse([mx - r, my - r * 0.6, mx + r, my + r * 0.6], fill=(84, 100, 70))
        for i in range(6):  # flies
            a = t * (3 + i) + i
            fx, fy = x + math.cos(a) * (80 + i * 14), y - 300 + math.sin(a * 1.3) * 40
            d.ellipse([fx - 5, fy - 4, fx + 5, fy + 4], fill=(20, 20, 20))
            d.line([(fx - 8, fy - 6), (fx, fy)], fill=(200, 200, 210), width=2)


def flour_sacks(img, x, y, stone):
    d = ImageDraw.Draw(img)
    col = mix((236, 228, 206), (130, 128, 124), stone)
    for i, (dx, dy) in enumerate(((-90, 0), (90, 0), (0, -170))):
        cx, cy = x + dx, y + dy
        d.rounded_rectangle([cx - 85, cy - 170, cx + 85, cy], 30, fill=col, outline=INK, width=5)
        d.polygon([(cx - 30, cy - 170), (cx + 30, cy - 170), (cx + 14, cy - 200), (cx - 14, cy - 200)], fill=col, outline=INK)
        if stone < 0.5:
            d.text((cx, cy - 80), "МУКА", font=font(FONT_SERIF_B, 32), fill=(120, 100, 80), anchor="mm")
        if stone > 0.4:
            k = (stone - 0.4) / 0.6
            d.line([(cx - 40, cy - 140), (cx - 10, cy - 100), (cx - 30, cy - 60), (cx + 10, cy - 30)][:2 + int(k * 2)],
                   fill=INK, width=4)
            d.line([(cx + 50, cy - 150), (cx + 30, cy - 110), (cx + 54, cy - 80)][:1 + int(k * 2)] if k > 0.3 else [(cx, cy), (cx, cy)],
                   fill=INK, width=4)


def cloth(img, x, y, dust_k, t):
    d = ImageDraw.Draw(img)
    rnd = random.Random(11)
    if dust_k < 1:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        for i, c in enumerate(((150, 60, 50), (60, 90, 120), (180, 160, 100))):
            yy = y - i * 70
            ld.rounded_rectangle([x - 150, yy - 64, x + 150, yy], 26, fill=c + (255,), outline=INK, width=5)
            ld.line([(x - 120, yy - 32), (x + 120, yy - 32)], fill=(0, 0, 0, 60), width=3)
        a = 1 - ease(dust_k)
        lay.putalpha(lay.split()[3].point(lambda v: int(v * a)))
        img.alpha_composite(lay)
    if dust_k > 0:
        lay = Image.new("RGBA", img.size)
        ld = ImageDraw.Draw(lay)
        for i in range(160):
            bx, by = x + rnd.uniform(-150, 150), y - rnd.uniform(0, 200)
            vx, vy = rnd.uniform(-60, 60), rnd.uniform(-200, -40)
            k = dust_k
            px, py = bx + vx * k * 2, by + vy * k * 2 + 200 * k * k
            r = rnd.uniform(2, 5)
            al = int(220 * (1 - k) + 30)
            ld.ellipse([px - r, py - r, px + r, py + r], fill=(200, 190, 170, al))
        img.alpha_composite(lay)
        d = ImageDraw.Draw(img)
        d.ellipse([x - 160, y - 14, x + 160, y + 14], fill=(160, 150, 130))


def scene3(t, dur):
    img = bg_barn().copy()
    p = t / dur
    light_beam(img, [(420, 200), (640, 200), (900, 1700), (300, 1700)], 0.12)
    grain_pile(img, 260, 1640, ease(seg(p, 0.3, 0.5)), t)
    flour_sacks(img, 800, 1650, ease(seg(p, 0.5, 0.68)))
    cloth(img, 560, 1880, seg(p, 0.7, 0.92), t)
    look = (-0.9, 0.6) if p < 0.5 else (0.9, 0.6) if p < 0.68 else (0.0, 1.0)
    pose = dict(armL=(10, 30), armR=(10, 30), look=look, brow=0.9 if p > 0.3 else 0.0, mouth="o" if p > 0.4 else "neutral",
                head=4, turn=look[0] * 0.5)
    render_actor(img, draw_plushkin, 560, 1560, 0.72, pose)
    cloth(img, 560, 1880, seg(p, 0.7, 0.92), t)
    return img, dict(zoom=1.0 + 0.04 * ease(p), cx=0.5, cy=0.6)


# =============================================================== SCENE 4: inflation basket

ITEMS4 = ["bread", "milk", "cheese", "apple", "egg", "sausage", "fish", "tea"]


def grocery(d, kind, x, y, a=255):
    o = (43, 29, 20, a)
    if kind == "bread":
        d.rounded_rectangle([x - 60, y - 40, x + 60, y + 30], 30, fill=(200, 140, 70, a), outline=o, width=4)
        for k in (-30, 0, 30):
            d.line([(x + k - 10, y - 30), (x + k + 10, y - 10)], fill=(150, 90, 40, a), width=4)
    elif kind == "milk":
        d.rectangle([x - 34, y - 70, x + 34, y + 40], fill=(240, 240, 240, a), outline=o, width=4)
        d.polygon([(x - 34, y - 70), (x, y - 100), (x + 34, y - 70)], fill=(80, 140, 200, a), outline=o)
    elif kind == "cheese":
        d.polygon([(x - 60, y + 30), (x + 60, y + 30), (x + 60, y - 20), (x - 60, y - 50)], fill=(240, 200, 70, a), outline=o)
        for (hx, hy) in ((-20, 0), (20, 10), (36, -10)):
            d.ellipse([x + hx - 8, y + hy - 8, x + hx + 8, y + hy + 8], fill=(210, 170, 50, a))
    elif kind == "apple":
        d.ellipse([x - 40, y - 40, x + 40, y + 36], fill=(200, 50, 40, a), outline=o, width=4)
        d.line([(x, y - 40), (x + 6, y - 60)], fill=o, width=4)
        d.ellipse([x + 6, y - 66, x + 34, y - 50], fill=(80, 140, 60, a), outline=o, width=3)
    elif kind == "egg":
        for k in (-26, 26):
            d.ellipse([x + k - 22, y - 30, x + k + 22, y + 26], fill=(246, 236, 214, a), outline=o, width=4)
    elif kind == "sausage":
        d.rounded_rectangle([x - 70, y - 20, x + 70, y + 20], 20, fill=(170, 70, 60, a), outline=o, width=4)
    elif kind == "fish":
        d.polygon([(x - 70, y), (x - 20, y - 30), (x + 40, y - 20), (x + 70, y - 40), (x + 60, y), (x + 70, y + 40),
                   (x + 40, y + 20), (x - 20, y + 30)], fill=(150, 170, 190, a), outline=o)
    else:
        d.rectangle([x - 40, y - 50, x + 40, y + 30], fill=(60, 120, 80, a), outline=o, width=4)
        d.text((x, y - 10), "ЧАЙ", font=font(FONT_SERIF_B, 26), fill=(240, 230, 200, a), anchor="mm")


def scene4(t, dur):
    img = vgrad(W, H, (236, 222, 190), (214, 192, 150))
    p = t / dur
    d = ImageDraw.Draw(img)
    d.rectangle([40, 340, W - 40, 1700], outline=(70, 46, 30), width=6)
    yk = clamp((p - 0.25) / 0.6)
    year = int(yk * 9 + 1e-6)
    frac = (1.08) ** (-yk * 9)  # purchasing power
    d.text((W / 2, 440), f"Год {year}", font=font(FONT_SERIF_B, 90), fill=(60, 36, 26), anchor="mm")
    d.text((W / 2, 530), "цены +8% каждый год", font=font(FONT_SERIF_I, 46), fill=(110, 70, 50), anchor="mm")
    # basket
    bx, by = W / 2, 1180
    lay = Image.new("RGBA", img.size)
    ld = ImageDraw.Draw(lay)
    keep = frac * len(ITEMS4)
    pos = [(-200, -70), (-70, -110), (70, -100), (200, -70), (-150, 0), (-20, -20), (110, 0), (220, 10)]
    for i, (kind, (dx, dy)) in enumerate(zip(ITEMS4, pos)):
        a = clamp(keep - (len(ITEMS4) - 1 - i))  # items vanish from the end
        if a > 0.01:
            grocery(ld, kind, bx + dx, by + dy, int(255 * a))
    img.alpha_composite(lay)
    d = ImageDraw.Draw(img)
    d.polygon([(bx - 300, by + 20), (bx + 300, by + 20), (bx + 240, by + 260), (bx - 240, by + 260)], fill=(170, 120, 70), outline=INK)
    d.line([(bx - 300, by + 20), (bx + 300, by + 20), (bx + 240, by + 260), (bx - 240, by + 260), (bx - 300, by + 20)], fill=INK, width=6)
    for k in range(1, 6):
        xx = bx - 300 + k * 100
        d.line([(xx, by + 20), (xx - (xx - bx) * 0.2, by + 260)], fill=(130, 86, 50), width=4)
    d.arc([bx - 260, by - 330, bx + 260, by + 120], 190, 350, fill=INK, width=12)
    d.text((bx, by + 320), "на 10 000 руб.", font=font(FONT_SERIF_B, 54), fill=(60, 36, 26), anchor="mm")
    # purchasing power bar
    x0, y0, x1 = 120, 680, W - 120
    d.text((W / 2, 640), "можно купить:", font=font(FONT_SERIF_I, 42), fill=(110, 70, 50), anchor="mm")
    d.rounded_rectangle([x0, y0, x1, y0 + 64], 20, fill=(230, 214, 180), outline=INK, width=5)
    col = mix((60, 150, 80), (200, 50, 40), 1 - (frac - 0.5) / 0.5)
    d.rounded_rectangle([x0 + 6, y0 + 6, x0 + 6 + (x1 - x0 - 12) * frac, y0 + 58], 16, fill=col)
    d.text(((x0 + x1) / 2, y0 + 32), f"{round(frac * 100)}%", font=font(FONT_SERIF_B, 46), fill=(255, 255, 255),
           anchor="mm", stroke_width=4, stroke_fill=INK)
    img = img.convert("RGBA")
    pose = dict(armL=(10, 30), armR=(26, 120), itemR="coin", look=(0.6, -0.6), brow=0.8, mouth="o" if p > 0.6 else "neutral",
                turn=0.5, head=-4)
    render_actor(img, draw_plushkin, 900, 2140, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# =============================================================== SCENE 5: the mattress

@cached
def bg_bedroom():
    d = BD(opaque=True)
    rnd = random.Random(9)
    wallpaper(d, 0, 0, W, 1520, (140, 124, 92, 255), (128, 112, 82, 255), rnd)
    d.rect(-10, 1520, W + 10, H + 10, (92, 72, 52, 255), 5)
    return d.done()


def scene5(t, dur):
    img = bg_bedroom().copy()
    p = t / dur
    d = ImageDraw.Draw(img)
    # bed
    d.rectangle([80, 1180, 1000, 1560], fill=(110, 76, 50), outline=INK, width=6)
    d.rectangle([60, 900, 120, 1700], fill=(96, 66, 44), outline=INK, width=6)
    d.rectangle([960, 1100, 1020, 1700], fill=(96, 66, 44), outline=INK, width=6)
    lift = ease(seg(p, 0.0, 0.2))
    # money stack melting under the mattress
    melt = ease(seg(p, 0.2, 0.95))
    sx, sy = 560, 1180
    hgt = 220 * (1 - 0.75 * melt)
    for i in range(int(hgt / 14)):
        y = sy - i * 14
        d.rectangle([sx - 160, y - 12, sx + 160, y], fill=(150, 190, 140), outline=(60, 90, 60), width=2)
    d.rectangle([sx - 40, sy - hgt, sx + 40, sy], fill=(230, 220, 200), outline=(60, 90, 60), width=2)
    # drips
    lay = Image.new("RGBA", img.size)
    ld = ImageDraw.Draw(lay)
    for k in range(7):
        ph = (t * 0.9 + k * 0.17) % 1
        dx = sx - 140 + k * 46
        dy = sy + ph * 300
        a = int(255 * (1 - ph) * min(1, melt * 4))
        ld.ellipse([dx - 9, dy - 14, dx + 9, dy + 10], fill=(140, 180, 130, a))
    ld.ellipse([sx - 200, sy + 330, sx + 200, sy + 380], fill=(140, 180, 130, int(200 * melt)))
    img.alpha_composite(lay)
    d = ImageDraw.Draw(img)
    # mattress, lifted at the right edge
    ang = -14 * lift
    mat = Image.new("RGBA", (980, 200))
    md = ImageDraw.Draw(mat)
    md.rounded_rectangle([10, 10, 970, 190], 40, fill=(214, 200, 170), outline=INK, width=6)
    for x in range(120, 900, 140):
        md.ellipse([x - 8, 92, x + 8, 108], fill=(160, 140, 110))
    mat = mat.rotate(-ang, expand=True, resample=Image.BICUBIC, center=(10, 100))
    img.alpha_composite(mat, (80, int(1180 - 190 - (mat.height - 200))))
    pose = dict(armL=(80, 130), armR=(80, 130), look=(-0.6, 1.0), brow=1.0, mouth="o", head=8, turn=-0.4, lean=10)
    render_actor(img, draw_plushkin, 900, 1900, 0.9, pose)
    return img, dict(zoom=1.04, cx=0.5, cy=0.55)


# =============================================================== SCENE 6: two jars

def jar(img, x, y, level, label, sub, col, tag_k=0.0):
    d = ImageDraw.Draw(img)
    w_, h_ = 300, 520
    d.rounded_rectangle([x - w_ / 2, y - h_, x + w_ / 2, y], 50, fill=(220, 232, 230), outline=INK, width=6)
    lh = (h_ - 40) * level
    if lh > 0:
        d.rounded_rectangle([x - w_ / 2 + 14, y - 20 - lh, x + w_ / 2 - 14, y - 20], 36, fill=col)
        for i in range(int(lh / 40)):
            yy = y - 30 - i * 40
            d.line([(x - w_ / 2 + 30, yy), (x + w_ / 2 - 30, yy)], fill=tuple(int(c * 0.85) for c in col), width=3)
    d.rectangle([x - w_ / 2 + 20, y - h_ - 40, x + w_ / 2 - 20, y - h_ + 6], fill=(150, 120, 80), outline=INK, width=5)
    d.text((x, y + 60), label, font=font(FONT_SERIF_B, 50), fill=(60, 36, 26), anchor="mm")
    d.text((x, y + 116), sub, font=font(FONT_SERIF_I, 36), fill=(110, 70, 50), anchor="mm")
    if tag_k > 0:
        s = ease_out(tag_k)
        lay = Image.new("RGBA", (320, 120))
        ld = ImageDraw.Draw(lay)
        ld.rounded_rectangle([6, 6, 314, 114], 20, fill=(250, 214, 80), outline=INK, width=5)
        ld.text((160, 60), "ЦЕЛЬ: подушка", font=font(FONT_SERIF_B, 38), fill=(60, 36, 26), anchor="mm")
        lay = lay.rotate(8, expand=True, resample=Image.BICUBIC)
        lay = lay.resize((max(1, int(lay.width * s)), max(1, int(lay.height * s))), Image.BICUBIC)
        img.alpha_composite(lay, (int(x - lay.width / 2), int(y - h_ - 150 - lay.height / 2)))


def scene6(t, dur):
    img = bg_bedroom().copy()
    p = t / dur
    k = ease(seg(p, 0.1, 0.6))
    jar(img, 260, 1340, 0.8 * (1 - 0.4 * k), "МАТРАС", "0% годовых", (150, 190, 140))
    jar(img, 820, 1340, 0.8 * (1 + 0.15 * k), "ВКЛАД", "доход ≥ инфляции", (214, 170, 70), seg(p, 0.66, 0.74))
    d = ImageDraw.Draw(img)
    if k > 0.05:
        d.text((470, 1080), "↓", font=font(FONT_SERIF_B, 120), fill=(200, 50, 40), anchor="mm")
        d.text((1020, 1080), "↑", font=font(FONT_SERIF_B, 120), fill=(40, 150, 70), anchor="mm")
    look_r = p > 0.35
    pose = dict(armL=(10, 30), armR=(10, 30), look=(0.9, -0.2) if look_r else (-0.9, -0.2), turn=0.5 if look_r else -0.5,
                smile=0.8 * ease(seg(p, 0.5, 0.8)), brow=0.3 if p < 0.5 else -0.1, head=2)
    render_actor(img, draw_plushkin, 540, 2160, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# =============================================================== SCENE 7: close-up CTA

@cached
def bg_close():
    return bg_store().filter(ImageFilter.GaussianBlur(18))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    tk = ease(seg(p, 0.0, 0.15))
    dart = math.sin(t * 6) if p < 0.45 else 0
    pk = ease(seg(p, 0.55, 0.7))
    pose = dict(turn=lerp(-0.6, 0.0, tk), look=(lerp(-1, 0, tk) + 0.6 * dart, 0), head=lerp(-6, 4, tk), brow=-0.3,
                armL=(18, 40), itemL="keys", keys_swing=math.sin(t * 8) * 20,
                armR=(lerp(4, 20, pk), lerp(8, 170, pk)), handR="point", wrotR=-10 * pk,
                smile=0.7 * pk, mouth="grin" if p > 0.75 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_plushkin, 520, 3300, 2.4, pose)
    return img, dict(zoom=1.0 + 0.06 * ease(p), cx=0.5, cy=0.42)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
