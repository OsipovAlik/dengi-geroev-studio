import math, random
from base import *
from chars4 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)


def bubble(img, x, y, text, k, size=56, tail=1):
    if k <= 0:
        return
    lay = Image.new("RGBA", img.size)
    d = ImageDraw.Draw(lay)
    f = font(FONT_SERIF_BI, size)
    tw = d.textlength(text, font=f)
    s = ease_out(min(1, k * 2))
    w_, h_ = (tw + 80) * s, (size * 2.1) * s
    d.ellipse([x - w_ / 2, y - h_ / 2, x + w_ / 2, y + h_ / 2], fill=(250, 246, 234), outline=INK, width=5)
    for i, r in enumerate((16, 10)):
        cx, cy = x + tail * (40 + i * 30), y + h_ / 2 + 20 + i * 28
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 246, 234), outline=INK, width=4)
    if s > 0.9:
        d.text((x, y), text, font=f, fill=(60, 40, 30), anchor="mm")
    img.alpha_composite(lay)


def bill(d, x, y, ang, label="СЧЁТ", s=1.0, col=(244, 236, 214)):
    w, h = 130 * s, 170 * s
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    P_ = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in pts]
    d.polygon(P_, fill=col, outline=INK)
    d.line(P_ + [P_[0]], fill=INK, width=4)
    for k in range(3):
        yy = -h / 2 + 70 * s + k * 26 * s
        a_ = (x + (-w / 2 + 20 * s) * ca - yy * sa, y + (-w / 2 + 20 * s) * sa + yy * ca)
        b_ = (x + (w / 2 - 20 * s) * ca - yy * sa, y + (w / 2 - 20 * s) * sa + yy * ca)
        d.line([a_, b_], fill=(150, 130, 110), width=3)
    tx, ty = x - (-h / 2 + 34 * s) * sa, y + (-h / 2 + 34 * s) * ca
    d.text((tx, ty), label, font=font(FONT_SERIF_B, int(30 * s)), fill=(150, 40, 32), anchor="mm")


# ================================================================ SCENE 1: London street, "something will turn up"

@cached
def bg_street():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (176, 170, 156), (210, 200, 178)), (0, 0))
    rnd = random.Random(3)
    # row of narrow brick houses
    x = -40
    cols = [(132, 84, 64, 255), (150, 110, 80, 255), (118, 92, 74, 255), (140, 96, 70, 255)]
    i = 0
    while x < W + 40:
        w_ = rnd.randint(250, 320)
        top = rnd.randint(380, 560)
        d.rect(x, top, x + w_, 1560, cols[i % 4], 5)
        d.rect(x - 8, top - 30, x + w_ + 8, top, (80, 60, 50, 255), 4)
        for cx in (x + 40, x + w_ - 80):
            d.rect(cx, top - 110, cx + 34, top - 30, (100, 70, 56, 255), 4)
        for row in range(3):
            for col in range(2):
                wx = x + 40 + col * (w_ - 140)
                wy = top + 70 + row * 260
                if wy + 170 < 1240:
                    d.rect(wx, wy, wx + 70, wy + 150, (60, 66, 72, 255), 4)
                    d.line([(wx + 35, wy), (wx + 35, wy + 150)], 3)
                    d.line([(wx, wy + 75), (wx + 70, wy + 75)], 3)
        d.rect(x + w_ / 2 - 50, 1320, x + w_ / 2 + 50, 1560, (60, 44, 36, 255), 4)
        x += w_
        i += 1
    d.rect(-10, 1560, W + 10, H + 10, (150, 140, 124, 255), 5)
    for y in range(1600, H, 70):
        off = 0 if (y // 70) % 2 else 60
        d.line([(0, y), (W, y)], 3, (120, 110, 96, 255))
        for xx in range(off, W, 120):
            d.line([(xx, y), (xx, y + 70)], 3, (120, 110, 96, 255))
    # street lamp
    d.rect(150, 900, 166, 1600, (40, 40, 40, 255), 3)
    d.poly([(118, 840), (198, 840), (184, 910), (132, 910)], (240, 220, 150, 255), 4)
    return d.done()


def scene1(t, dur):
    img = bg_street().copy()
    p = t / dur
    wk = ease(seg(p, 0.0, 0.3))
    x = lerp(1300, 600, wk)
    ph = t * 2 * math.pi * 0.95
    sw = math.sin(ph) * (1 - seg(p, 0.28, 0.32))
    # bills pile up behind once he "lives in debt"
    if p > 0.62:
        lay, ld = layer_draw(img)
        rnd = random.Random(4)
        n = int(14 * ease(seg(p, 0.64, 0.92)))
        for i in range(n):
            bx, by = rnd.uniform(140, 960), rnd.uniform(1660, 1880)
            bill(ld, bx, by - 30 * (i // 5), rnd.uniform(-35, 35), s=0.9)
        img.alpha_composite(lay)
    worried = p > 0.7
    pose = dict(legL=(18 * sw, max(0, -sw) * 24), legR=(-18 * sw, max(0, sw) * 24), bob=-abs(sw) * 6,
                armR=(26 + 8 * math.sin(t * 3), 50), itemR="stick", stick_ang=20 * math.sin(t * 5), tassel_swing=25 * math.sin(t * 7),
                armL=(12 - 8 * sw, 20) if p < 0.32 else (40, 150), handL="point" if 0.32 < p < 0.62 else "open",
                turn=-0.5 if p < 0.3 else 0.2, look=(-0.8, -0.2) if p < 0.3 else (0.3, -0.6), smile=0.9,
                mouth="grin" if 0.32 < p < 0.62 else "neutral", brow=0.6)
    if worried:
        pose.update(look=(0.8, 0.8), brow=-0.5, smile=-0.2, mouth="o", armL=(10, 20), handL="open")
    render_actor(img, draw_micawber, x, 1800, 1.0, pose)
    bubble(img, 520, 520, "Что-нибудь подвернётся!", seg(p, 0.32, 0.4) * (1 - seg(p, 0.62, 0.66)), 58)
    return img, dict(zoom=1.03 + 0.03 * ease(p), cx=0.5, cy=0.55)


# ================================================================ SCENE 2: creditors at the door -> debtors' prison

@cached
def bg_hall():
    d = BD(opaque=True)
    rnd = random.Random(8)
    wallpaper(d, 0, 0, W, 1540, (150, 128, 96, 255), (136, 116, 86, 255), rnd, peel=False)
    d.rect(-10, 1540, W + 10, H + 10, (96, 72, 52, 255), 5)
    for y in range(1580, H, 60):
        d.line([(0, y), (W, y)], 3, (78, 58, 42, 255))
    return d.done()


def door(img, x, y, shake):
    d = ImageDraw.Draw(img)
    dx = shake
    d.rectangle([x - 230, y - 820, x + 230, y + 10], fill=(70, 50, 36), outline=INK, width=6)
    d.rectangle([x - 200 + dx, y - 790, x + 200 + dx, y], fill=(110, 76, 50), outline=INK, width=6)
    for (a, b) in ((-170, -770), (20, -770), (-170, -380), (20, -380)):
        d.rectangle([x + a + dx, y + b, x + a + 150 + dx, y + b + 340], outline=(80, 54, 36), width=5)
    d.ellipse([x + 140 + dx, y - 420, x + 172 + dx, y - 388], fill=(200, 170, 80), outline=INK, width=3)


def bars(img, k):
    if k <= 0:
        return
    lay, d = layer_draw(img)
    yoff = -H * (1 - ease_out(k))
    d.rectangle([0, 360 + yoff, W, 420 + yoff], fill=(70, 70, 76), outline=INK, width=5)
    d.rectangle([0, 1240 + yoff, W, 1300 + yoff], fill=(70, 70, 76), outline=INK, width=5)
    for x in range(70, W, 135):
        d.rectangle([x - 14, 300 + yoff, x + 14, H + 40 + yoff], fill=(84, 84, 92), outline=INK, width=5)
        d.line([(x - 6, 300 + yoff), (x - 6, H + yoff)], fill=(130, 130, 138), width=3)
    img.alpha_composite(lay)


def scene2(t, dur):
    img = bg_hall().copy()
    p = t / dur
    knock = p < 0.6
    shake = math.sin(t * 40) * 8 if knock and (t * 3) % 1 < 0.4 else 0
    door(img, 330, 1560, shake)
    lay, ld = layer_draw(img)
    rnd = random.Random(12)
    # fists / bills flying in under the door
    for i in range(10):
        st = 0.05 + i * 0.05
        k = seg(p, st, st + 0.3)
        if k > 0:
            bx = lerp(340, rnd.uniform(380, 1000), ease_out(k))
            by = lerp(1520, rnd.uniform(500, 1200), ease_out(k)) + 400 * k * k
            bill(ld, bx, by, rnd.uniform(-60, 60) + 200 * k, s=0.8)
    img.alpha_composite(lay)
    if knock:
        for i, (fx, fy) in enumerate(((330, 1050), (300, 1200))):
            if (t * 3 + i * 0.5) % 1 < 0.4:
                d = ImageDraw.Draw(img)
                d.text((fx + 260, fy - 60), "ТУК!", font=font(FONT_SERIF_B, 70), fill=(150, 40, 32), anchor="mm",
                       stroke_width=4, stroke_fill=(250, 240, 220))
    pose = dict(armL=(60, 120), armR=(60, 120), handL="palm", handR="palm", look=(-0.9, 0), turn=-0.5, brow=1.0, mouth="o",
                lean=6) if knock else dict(armL=(10, 20), armR=(10, 20), look=(0, 0.8), brow=-0.9, mouth="frown", head=8, turn=0.1)
    render_actor(img, draw_micawber, 800, 1840, 0.95, pose)
    bars(img, seg(p, 0.6, 0.75))
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ SCENE 3: prison cell, the famous rule

@cached
def bg_cell():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (120, 112, 100), (96, 88, 78)), (0, 0))
    rnd = random.Random(21)
    for row, y in enumerate(range(0, 1560, 80)):
        off = 0 if row % 2 else 70
        for x in range(-off, W, 140):
            c = rnd.randint(-10, 10)
            d.rect(x + 3, y + 3, x + 137, y + 77, (128 + c, 118 + c, 104 + c, 255), 3, (80, 72, 62, 255))
    d.rect(-10, 1560, W + 10, H + 10, (88, 80, 70, 255), 5)
    # small barred window up high
    d.rect(800, 150, 1000, 330, (190, 200, 206, 255), 6)
    for x in (850, 900, 950):
        d.line([(x, 150), (x, 330)], 10, (60, 60, 66, 255))
    # straw on the floor
    for i in range(70):
        x, y = rnd.randint(0, W), rnd.randint(1580, H)
        d.line([(x, y), (x + rnd.randint(-30, 30), y - rnd.randint(4, 14))], 3, (190, 164, 90, 255))
    return d.done()


def sun(d, x, y, r, a=255):
    for i in range(12):
        an = i * math.pi / 6
        d.line([(x + math.cos(an) * r * 1.2, y + math.sin(an) * r * 1.2), (x + math.cos(an) * r * 1.6, y + math.sin(an) * r * 1.6)],
               fill=(240, 180, 40, a), width=8)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(250, 200, 60, a), outline=(43, 29, 20, a), width=5)
    d.arc([x - r * 0.5, y - r * 0.3, x + r * 0.5, y + r * 0.5], 20, 160, fill=(43, 29, 20, a), width=5)
    for s in (-1, 1):
        d.ellipse([x + s * r * 0.35 - 6, y - r * 0.3 - 6, x + s * r * 0.35 + 6, y - r * 0.3 + 6], fill=(43, 29, 20, a))


def cloud(d, x, y, r, t, a=255):
    for i in range(6):
        xx = x - r + i * r * 0.4
        yy = y + r * 0.5 + ((t * 3 + i * 0.37) % 1) * r * 0.9
        d.line([(xx, yy), (xx - 8, yy + 26)], fill=(90, 120, 170, a), width=5)
    for (dx, dy, rr) in ((-r * 0.6, 0, r * 0.6), (0, -r * 0.3, r * 0.75), (r * 0.6, 0, r * 0.6)):
        d.ellipse([x + dx - rr, y + dy - rr, x + dx + rr, y + dy + rr], fill=(140, 140, 150, a), outline=(43, 29, 20, a), width=5)
    d.rectangle([x - r * 0.6, y - r * 0.1, x + r * 0.6, y + r * 0.55], fill=(140, 140, 150, a))
    d.line([(x - r * 1.15, y + r * 0.58), (x + r * 1.15, y + r * 0.58)], fill=(43, 29, 20, a), width=5)


def scene3(t, dur):
    img = bg_cell().copy()
    p = t / dur
    # parchment board
    d = ImageDraw.Draw(img)
    bx0, by0, bx1, by1 = 70, 390, W - 70, 1260
    k0 = ease_out(seg(p, 0.05, 0.14))
    if k0 > 0:
        lay, ld = layer_draw(img)
        ld.rounded_rectangle([bx0, by0, bx1, by1], 24, fill=(242, 230, 200, int(250 * k0)), outline=(43, 29, 20, int(255 * k0)), width=6)
        img.alpha_composite(lay)
        d = ImageDraw.Draw(img)
    fB, fI = font(FONT_SERIF_B, 64), font(FONT_SERIF_I, 46)
    if p > 0.17:
        d.text((W / 2, 470), "Доход: £20 в год", font=fB, fill=BROWN, anchor="mm")
    if p > 0.3:
        d.text((120, 600), "Расход:", font=fI, fill=BROWN2, anchor="lm")
        d.text((320, 600), "£19 19s 6d", font=fB, fill=(40, 110, 60), anchor="lm")
    if p > 0.5:
        lay, ld = layer_draw(img)
        sun(ld, 880, 610, 46 * ease_out(seg(p, 0.5, 0.56)) + 1)
        img.alpha_composite(lay)
        d = ImageDraw.Draw(img)
        d.text((W / 2, 740), "итог: СЧАСТЬЕ", font=font(FONT_SERIF_B, 72), fill=(40, 110, 60), anchor="mm")
    if p > 0.72:
        d.line([(120, 830), (W - 120, 830)], fill=(150, 120, 90), width=3)
        d.text((120, 930), "Расход:", font=fI, fill=BROWN2, anchor="lm")
        d.text((320, 930), "£20 0s 6d", font=fB, fill=(160, 40, 32), anchor="lm")
    if p > 0.86:
        lay, ld = layer_draw(img)
        cloud(ld, 880, 920, 50 * ease_out(seg(p, 0.86, 0.9)) + 1, t)
        img.alpha_composite(lay)
        d = ImageDraw.Draw(img)
        d.text((W / 2, 1110), "итог: БЕДА", font=font(FONT_SERIF_B, 72), fill=(160, 40, 32), anchor="mm")
    happy = p < 0.72
    pose = dict(armR=(40, 110), itemR="quill", armL=(14, 30), turn=-0.3, look=(-0.4, -0.9), brow=0.7 if happy else -0.6,
                smile=0.9 if happy else -0.5, mouth="neutral" if happy else "frown", head=-4)
    if 0.5 < p < 0.72:
        pose["mouth"] = "grin"
    render_actor(img, draw_micawber, 860, 2370, 0.72, pose)
    return img, dict(zoom=1.0 + 0.02 * ease(p), cx=0.5, cy=0.5)


# ================================================================ SCENE 4: balance - the sign matters

def paper_bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


def scene4(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    d.rectangle([40, 340, W - 40, 1280], outline=(70, 46, 30), width=6)
    cx, cy = W / 2, 560
    # beam tilts: first to "+" side, then to "-" side
    tilt = 10 * math.sin(t * 1.7)
    d.polygon([(cx - 30, 1060), (cx + 30, 1060), (cx + 10, cy), (cx - 10, cy)], fill=(150, 110, 60), outline=INK)
    d.rectangle([cx - 120, 1060, cx + 120, 1090], fill=(120, 86, 50), outline=INK, width=4)
    r = math.radians(tilt)
    L = 360
    ax, ay = cx - L * math.cos(r), cy - L * math.sin(r)
    bx, by = cx + L * math.cos(r), cy + L * math.sin(r)
    d.line([(ax, ay), (bx, by)], fill=INK, width=12)
    d.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=(200, 170, 80), outline=INK, width=4)
    for (px, py, txt, col) in ((ax, ay, "+6d", (40, 120, 60)), (bx, by, "−6d", (170, 40, 32))):
        d.line([(px, py), (px - 110, py + 220)], fill=INK, width=4)
        d.line([(px, py), (px + 110, py + 220)], fill=INK, width=4)
        d.chord([px - 140, py + 150, px + 140, py + 290], 0, 180, fill=(200, 170, 80), outline=INK, width=5)
        d.text((px, py + 180), txt, font=font(FONT_SERIF_B, 64), fill=col, anchor="mm", stroke_width=3, stroke_fill=(250, 240, 220))
    if p > 0.25:
        d.text((W / 2, 1150), "разница 12d = 0,25% дохода", font=font(FONT_SERIF_I, 52), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.58, 0.68))
    if k > 0:
        f = font(FONT_SERIF_B, int(260 * k) + 1)
        d.text((W * 0.42, 1720), "+", font=f, fill=(40, 130, 60), anchor="mm", stroke_width=8, stroke_fill=INK)
        d.text((W * 0.88, 1720), "−", font=f, fill=(180, 40, 32), anchor="mm", stroke_width=8, stroke_fill=INK)
        d.text((W * 0.65, 1720), "или", font=font(FONT_SERIF_I, 60), fill=BROWN2, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(armL=(30, 60), armR=(30, 60), turn=0.4, look=(0.7, -0.9), brow=0.8, mouth="o" if p > 0.58 else "neutral", head=4)
    render_actor(img, draw_micawber, 170, 2160, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 5: modern month by month

def scene5(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    # phone
    px0, py0, px1, py1 = 170, 360, 910, 1260
    d.rounded_rectangle([px0 - 20, py0 - 20, px1 + 20, py1 + 20], 60, fill=(40, 40, 46), outline=INK, width=6)
    d.rounded_rectangle([px0, py0, px1, py1], 40, fill=(246, 244, 238))
    d.text((W / 2, 430), "Мой бюджет", font=font(FONT_SERIF_B, 54), fill=BROWN, anchor="mm")
    d.text((210, 530), "Доход", font=font(FONT_SERIF_I, 46), fill=BROWN2, anchor="lm")
    d.text((870, 530), "100 000 ₽", font=font(FONT_SERIF_B, 52), fill=(40, 120, 60), anchor="rm")
    d.text((210, 620), "Расходы", font=font(FONT_SERIF_I, 46), fill=BROWN2, anchor="lm")
    d.text((870, 620), "102 000 ₽", font=font(FONT_SERIF_B, 52), fill=(170, 40, 32), anchor="rm")
    d.line([(210, 680), (870, 680)], fill=(180, 170, 150), width=3)
    km = clamp((p - 0.42) / 0.45)
    month = int(round(km * 12))
    d.text((W / 2, 760), f"Месяц {month} из 12", font=font(FONT_SERIF_I, 46), fill=BROWN2, anchor="mm")
    bal = -2000 * month
    s = f"{bal:,}".replace(",", " ").replace("-", "−") + " ₽"
    d.text((W / 2, 880), s, font=font(FONT_SERIF_B, 110), fill=(170, 40, 32) if bal < 0 else BROWN, anchor="mm")
    # bar chart of monthly deficit growing downward
    for i in range(12):
        x = 230 + i * 52
        hgt = (i + 1) * 18 if i < month else 0
        d.line([(210, 980), (870, 980)], fill=INK, width=3)
        if hgt:
            d.rectangle([x, 980, x + 38, 980 + hgt], fill=(200, 70, 56), outline=INK, width=2)
    if p > 0.75:
        d.text((W / 2, 1210), "+ проценты по кредитке", font=font(FONT_SERIF_I, 40), fill=(170, 40, 32), anchor="mm")
    img = img.convert("RGBA")
    pose = dict(glass=True, armR=(30, 150), armL=(10, 20), turn=-0.5, look=(-0.8, -0.8), brow=0.9 if p < 0.5 else -0.8,
                mouth="o" if p > 0.5 else "neutral", smile=0.0, head=-6)
    render_actor(img, draw_micawber, 880, 2130, 0.68, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 6: pay yourself first

def jar(img, x, y, level, label, sub, col, w_=300, h_=480):
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x - w_ / 2, y - h_, x + w_ / 2, y], 50, fill=(220, 232, 230), outline=INK, width=6)
    lh = (h_ - 40) * level
    if lh > 2:
        d.rounded_rectangle([x - w_ / 2 + 14, y - 20 - lh, x + w_ / 2 - 14, y - 20], 36, fill=col)
        for i in range(int(lh / 40)):
            yy = y - 30 - i * 40
            d.line([(x - w_ / 2 + 30, yy), (x + w_ / 2 - 30, yy)], fill=tuple(int(c * 0.85) for c in col), width=3)
    d.rectangle([x - w_ / 2 + 20, y - h_ - 40, x + w_ / 2 - 20, y - h_ + 6], fill=(150, 120, 80), outline=INK, width=5)
    d.text((x, y - h_ - 100), label, font=font(FONT_SERIF_B, 60), fill=BROWN, anchor="mm")
    d.text((x, y + 50), sub, font=font(FONT_SERIF_BI, 44), fill=(250, 240, 214), anchor="mm", stroke_width=4, stroke_fill=INK)


def scene6(t, dur):
    img = bg_hall().copy()
    p = t / dur
    darken(img, 0.1)
    k1 = ease(seg(p, 0.5, 0.68))
    k2 = ease(seg(p, 0.7, 0.92))
    jar(img, 260, 1180, 0.85 * k1, "10%", "сначала — себе", (214, 170, 70), 260, 420)
    jar(img, 760, 1180, 0.85 * k2, "90%", "на жизнь", (150, 190, 140), 420, 420)
    d = ImageDraw.Draw(img)
    if p < 0.48:
        lay, ld = layer_draw(img)
        ld.rounded_rectangle([110, 420, W - 110, 560], 30, fill=(250, 240, 214, 240), outline=INK, width=5)
        img.alpha_composite(lay)
        d = ImageDraw.Draw(img)
        d.text((W / 2, 490), "расход < доход", font=font(FONT_SERIF_B, 80), fill=(40, 110, 60), anchor="mm")
    # coins dropping into the 10% jar first
    if 0.45 < p < 0.7:
        for i in range(4):
            ph = ((t * 1.6) + i * 0.25) % 1
            yy = lerp(560, 1000, ph)
            d.ellipse([260 - 30, yy - 12, 260 + 30, yy + 12], fill=(214, 170, 70), outline=INK, width=3)
    pose = dict(armR=(30, 50), itemR="stick", stick_ang=10, armL=(60, 140), handL="point", turn=-0.3, look=(-0.6, -0.5),
                smile=0.9, mouth="grin" if p > 0.7 else "neutral", brow=0.5)
    render_actor(img, draw_micawber, 860, 2200, 0.7, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 7: close-up CTA

@cached
def bg_close():
    return bg_street().filter(ImageFilter.GaussianBlur(18))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    pk = ease(seg(p, 0.1, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", wrotL=-10 * pk,
                armR=(20, 40), itemR="stick", smile=0.8, mouth="grin" if 0.3 < p < 0.6 else "neutral",
                glass=p > 0.55)
    if pose["glass"]:
        pose["armR"] = (40, 160)
        pose["itemR"] = None
    if 0.82 < p < 0.85:
        pose["blink"] = 1.0
    render_actor(img, draw_micawber, 540, 2950, 2.3, pose)
    d = ImageDraw.Draw(img)
    k = ease_out(seg(p, 0.15, 0.3))
    if k > 0:
        f = font(FONT_SERIF_B, int(170 * k) + 1)
        d.text((230, 620), "+", font=f, fill=(40, 130, 60), anchor="mm", stroke_width=7, stroke_fill=INK)
        d.text((850, 620), "−", font=f, fill=(180, 40, 32), anchor="mm", stroke_width=7, stroke_fill=INK)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
