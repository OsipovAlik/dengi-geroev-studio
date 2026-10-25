import math, random
from base import *
from chars5 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)


def bubble(img, x, y, lines, k, size=54, tail=1):
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


def notes(img, x, y, t, a=1.0):
    lay, d = layer_draw(img)
    for i in range(4):
        ph = (t * 0.6 + i * 0.25) % 1
        nx = x + math.sin(ph * 6 + i) * 50 + i * 30
        ny = y - ph * 300
        al = int(255 * (1 - ph) * a)
        d.ellipse([nx - 16, ny - 11, nx + 16, ny + 11], fill=(60, 40, 30, al))
        d.line([(nx + 14, ny), (nx + 14, ny - 60)], fill=(60, 40, 30, al), width=5)
        d.line([(nx + 14, ny - 60), (nx + 34, ny - 46)], fill=(60, 40, 30, al), width=5)
    img.alpha_composite(lay)


def snow(img, t, k, n=90, seed=2):
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


# ================================================================ backgrounds

@cached
def bg_summer():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (170, 210, 220), (226, 230, 196)), (0, 0))
    rnd = random.Random(1)
    d.ell(820, 330, 110, 110, (250, 214, 100, 255), 5)
    for i in range(8):
        x = rnd.randint(-60, W)
        d.ell(x, 1080 + rnd.randint(-30, 30), rnd.randint(160, 240), rnd.randint(90, 140), (120, 170, 90, 255), 0)
    d.rect(-10, 1150, W + 10, H + 10, (140, 186, 100, 255), 0)
    for i in range(140):
        x, y = rnd.randint(0, W), rnd.randint(1160, H)
        d.line([(x, y), (x + rnd.randint(-12, 12), y - rnd.randint(30, 70))], 4, (90, 140, 70, 255))
    # giant flowers / daisies (insect scale)
    for (x, y, h_, col) in ((140, 1700, 760, (250, 250, 240, 255)), (930, 1760, 900, (240, 120, 120, 255)), (520, 1300, 330, (250, 220, 90, 255))):
        d.line([(x, y), (x + 20, y - h_)], 12, (80, 130, 60, 255))
        d.poly([(x + 6, y - h_ * 0.5), (x + 90, y - h_ * 0.6), (x + 10, y - h_ * 0.45)], (100, 160, 70, 255), 3)
        for k in range(10):
            a = k * math.pi / 5
            d.ell(x + 20 + math.cos(a) * 64, y - h_ + math.sin(a) * 64, 40, 40, col, 4)
        d.ell(x + 20, y - h_, 44, 44, (240, 180, 60, 255), 4)
    return d.done()


@cached
def bg_winter():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (150, 160, 178), (206, 210, 220)), (0, 0))
    rnd = random.Random(4)
    for i in range(8):
        x = rnd.randint(-60, W)
        d.ell(x, 1100 + rnd.randint(-30, 30), rnd.randint(160, 240), rnd.randint(90, 140), (226, 230, 238, 255), 0)
    d.rect(-10, 1170, W + 10, H + 10, (236, 238, 244, 255), 0)
    for i in range(40):
        x, y = rnd.randint(0, W), rnd.randint(1190, H)
        d.line([(x, y), (x + rnd.randint(-10, 10), y - rnd.randint(20, 50))], 4, (120, 100, 80, 255))
    # bare dry stalks
    for (x, h_) in ((150, 700), (930, 820)):
        d.line([(x, 1750), (x + 30, 1750 - h_)], 10, (120, 96, 70, 255))
        d.line([(x + 18, 1750 - h_ * 0.6), (x + 110, 1750 - h_ * 0.75)], 6, (120, 96, 70, 255))
    return d.done()


@cached
def bg_anthill():
    d = BD(opaque=True)
    d.img.paste(bg_winter().resize((W * B, H * B)).convert("RGB"), (0, 0))
    # snowy anthill with a warm round door
    d.poly([(-80, 1800), (60, 900), (300, 640), (520, 600), (720, 760), (900, 1100), (1100, 1800)], (150, 110, 74, 255), 6)
    d.poly([(60, 900), (300, 640), (520, 600), (720, 760), (900, 1100), (760, 980), (560, 860), (380, 880), (200, 960)],
           (244, 246, 250, 255), 5)
    rnd = random.Random(9)
    for i in range(60):
        x, y = rnd.randint(120, 900), rnd.randint(1000, 1750)
        d.ell(x, y, 6, 4, (120, 86, 56, 255), 0)
    return d.done()


def door_glow(img, x, y, open_k):
    d = ImageDraw.Draw(img)
    img.alpha_composite(radial_glow(600, 600, 300, 300, 290, (255, 200, 110), 0.7 * open_k), (x - 300, y - 360))
    d = ImageDraw.Draw(img)
    d.ellipse([x - 170, y - 300, x + 170, y + 40], fill=(90, 60, 40), outline=INK, width=6)
    d.ellipse([x - 150, y - 280, x + 150, y + 40], fill=(255, 210, 130) if open_k > 0 else (110, 76, 50), outline=INK, width=4)
    d.rectangle([x - 200, y + 20, x + 200, y + 50], fill=(150, 110, 74))
    d.line([(x - 200, y + 24), (x + 200, y + 24)], fill=INK, width=5)


# ================================================================ SCENE 1: summer song, then winter

def scene1(t, dur):
    p = t / dur
    wk = seg(p, 0.62, 0.8)
    img = bg_summer().copy()
    if wk > 0:
        img = Image.blend(img, bg_winter(), ease(wk))
    dance = math.sin(t * 5)
    if p < 0.65:
        pose = dict(armR=(70, 120), itemR="flowermic", armL=(110 + 20 * dance, 30), legL=(20 * max(0, dance), 20 * max(0, dance)),
                    legR=(10 * max(0, -dance), 10), mouth="o" if (t * 3) % 1 < 0.5 else "grin", flap=math.sin(t * 20),
                    turn=0.3 * dance, look=(0.3, -0.6), brow=0.6, bob=-abs(dance) * 20, lean=6 * dance)
        notes(img, 420, 900, t)
    else:
        sh = math.sin(t * 50) * 4
        pose = dict(armL=(20, 140), armR=(20, 140), shiver=sh, mouth="o", brow=1.0, look=(0.2, -0.9), turn=0.1,
                    itemR=None)
    render_actor(img, draw_dragonfly, 380, 1800, 1.0, pose)
    # ant hauling grain in the background
    ax = lerp(1150, 760, seg(p, 0.0, 0.6))
    ph = math.sin(t * 6)
    apose = dict(armL=(160, 20), armR=(160, 20), itemL="sack", legL=(14 * ph, max(0, -ph) * 20), legR=(-14 * ph, max(0, ph) * 20),
                 turn=-0.4, look=(-0.6, 0), mouth="neutral", brow=-0.2, bob=-abs(ph) * 6)
    render_actor(img, draw_ant, ax, 1560, 0.55, apose)
    snow(img, t, ease(wk))
    return img, dict(zoom=1.03 + 0.03 * ease(p), cx=0.5, cy=0.55)


# ================================================================ SCENE 2: walking to the anthill

def scene2(t, dur):
    img = bg_anthill().copy()
    p = t / dur
    door_glow(img, 520, 1640, 0.0)
    wk = ease(seg(p, 0.0, 0.5))
    x = lerp(1250, 860, wk)
    ph = math.sin(t * 2 * math.pi * 0.9) * (1 - seg(p, 0.48, 0.52))
    sh = math.sin(t * 50) * 3
    pose = dict(legL=(18 * ph, max(0, -ph) * 22), legR=(-18 * ph, max(0, ph) * 22), armL=(20, 140), armR=(20, 140), shiver=sh,
                turn=-0.5, look=(-0.9, 0), mouth="o", brow=1.0, bob=-abs(ph) * 6)
    if p > 0.55:
        pose.update(armL=(70, 60), armR=(70, 60), handL="palm", handR="palm", mouth="o", look=(-0.9, -0.3))
    render_actor(img, draw_dragonfly, x, 1840, 0.9, pose)
    bubble(img, 600, 470, ["Прокорми", "до весны!"], seg(p, 0.6, 0.68), 62, tail=1)
    snow(img, t, 1.0)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ SCENE 3: the Ant's answer

def scene3(t, dur):
    img = bg_anthill().copy()
    p = t / dur
    door_glow(img, 520, 1640, 1.0)
    q = p < 0.42
    apose = dict(armL=(40, 120), armR=(40, 120), handL="fist", handR="fist", turn=0.4, look=(0.8, 0), brow=-0.6,
                 mouth="neutral" if not q else "o", smile=0.0)
    if not q:
        apose.update(armR=(60 + 20 * math.sin(t * 6), 40), handR="point", armL=(30, 130), mouth="grin" if (t * 3) % 1 < 0.5 else "o",
                     brow=-0.3)
    render_actor(img, draw_ant, 480, 1660, 0.7, apose)
    sh = math.sin(t * 50) * 3
    dpose = dict(armL=(70, 60), armR=(70, 60), handL="palm", handR="palm", shiver=sh, turn=-0.4, look=(-0.9, 0),
                 mouth="o" if q else "frown", brow=1.0 if q else -0.4, head=6 if not q else 0)
    if q:
        notes(img, 980, 1000, t, 0.0)
    render_actor(img, draw_dragonfly, 860, 1840, 0.85, dpose)
    if q:
        bubble(img, 380, 520, ["А летом ты", "работала?"], seg(p, 0.08, 0.16), 58, tail=1)
    else:
        bubble(img, 520, 520, ["Ты всё пела? Это дело:", "так поди же, попляши!"], seg(p, 0.45, 0.52), 52, tail=-1)
    snow(img, t, 1.0)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ SCENE 4: 3-6 months of expenses

def paper_bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


def scene4(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    d.text((W / 2, 420), "Подушка безопасности", font=font(FONT_SERIF_B, 68), fill=BROWN, anchor="mm")
    d.text((W / 2, 500), "= расходы на 3–6 месяцев", font=font(FONT_SERIF_I, 52), fill=BROWN2, anchor="mm")
    # six month blocks
    nshow = int(clamp((p - 0.1) / 0.35) * 6 + 1e-6)
    for i in range(6):
        x = 110 + i * 145
        y = 600
        col = (214, 170, 70) if i < 3 else (240, 214, 150)
        if i < nshow:
            d.rounded_rectangle([x, y, x + 130, y + 170], 16, fill=col, outline=INK, width=4)
            d.rectangle([x, y, x + 130, y + 40], fill=(170, 60, 50), outline=INK, width=4)
            d.text((x + 65, y + 105), f"{i + 1}", font=font(FONT_SERIF_B, 64), fill=BROWN, anchor="mm")
            d.text((x + 65, y + 200), "40 000", font=font(FONT_SERIF_B, 30), fill=BROWN2, anchor="mm")
    if p > 0.3:
        d.line([(110, 820), (530, 820)], fill=(40, 120, 60), width=6)
        d.text((320, 860), "минимум", font=font(FONT_SERIF_I, 40), fill=(40, 120, 60), anchor="mm")
    if p > 0.5:
        k = ease_out(seg(p, 0.5, 0.62))
        d.text((W / 2, 1010), "40 000 × 3 = 120 000 ₽", font=font(FONT_SERIF_B, int(64 * k) + 1), fill=BROWN, anchor="mm")
    if p > 0.7:
        k = ease_out(seg(p, 0.7, 0.82))
        d.text((W / 2, 1110), "40 000 × 6 = 240 000 ₽", font=font(FONT_SERIF_B, int(64 * k) + 1), fill=BROWN, anchor="mm")
    img = img.convert("RGBA")
    apose = dict(armL=(40, 120), itemL="grain", armR=(80, 150), handR="point", turn=0.4, look=(0.5, -0.9), smile=0.7, brow=0.4)
    render_actor(img, draw_ant, 200, 2080, 0.62, apose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 5: everyone's winter

def card(d, x, y, ang, title, col):
    w, h = 380, 130
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    P_ = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in pts]
    d.polygon(P_, fill=col, outline=INK)
    d.line(P_ + [P_[0]], fill=INK, width=5)
    d.text((x, y), title, font=font(FONT_SERIF_B, 50), fill=(250, 244, 230), anchor="mm", stroke_width=3, stroke_fill=INK)


def scene5(t, dur):
    img = bg_winter().copy()
    p = t / dur
    lay, ld = layer_draw(img)
    items = [("увольнение", (170, 60, 50), 0.05, 300, 560, -8), ("болезнь", (70, 100, 150), 0.25, 780, 700, 7),
             ("поломка", (110, 90, 70), 0.42, 420, 860, 4)]
    for title, col, st, x, y, ang in items:
        k = ease_out(seg(p, st, st + 0.12))
        if k > 0:
            card(ld, x, lerp(-120, y, k), ang + 20 * (1 - k), title, col)
    img.alpha_composite(lay)
    sh = math.sin(t * 50) * 4
    pose = dict(armL=(20, 140), armR=(20, 140), shiver=sh, mouth="o", brow=1.0, look=(0, -0.9), turn=0.0)
    render_actor(img, draw_dragonfly, 540, 1960, 0.8, pose)
    if p > 0.66:
        k = ease_out(seg(p, 0.66, 0.74))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([W / 2 - 260 * k, 1030 - 80 * k + 0, W / 2 + 260 * k, 1030 + 80 * k], 26, fill=(200, 50, 40), outline=INK, width=6)
        if k > 0.9:
            d.text((W / 2, 1030), "КРЕДИТ + %", font=font(FONT_SERIF_B, 70), fill=(255, 245, 230), anchor="mm")
    snow(img, t, 1.0)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


# ================================================================ SCENE 6: build it month by month

@cached
def bg_pantry():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (140, 100, 66), (110, 78, 52)), (0, 0))
    for y in (700, 1240):
        d.rect(40, y, W - 40, y + 30, (90, 60, 40, 255), 4)
    d.rect(-10, 1600, W + 10, H + 10, (96, 68, 46, 255), 5)
    return d.done()


def scene6(t, dur):
    img = bg_pantry().copy()
    p = t / dur
    img.alpha_composite(radial_glow(W, H, W / 2, 800, 700, (255, 210, 140), 0.35))
    d = ImageDraw.Draw(img)
    km = clamp((p - 0.08) / 0.42)
    month = int(km * 12 + 1e-6)
    # 12 little jars on two shelves
    for i in range(12):
        x = 110 + (i % 6) * 150
        y = 700 if i < 6 else 1240
        if i < month:
            d.rounded_rectangle([x, y - 190, x + 120, y], 24, fill=(214, 170, 70), outline=INK, width=4)
            d.rectangle([x + 10, y - 215, x + 110, y - 186], fill=(150, 110, 70), outline=INK, width=3)
            d.text((x + 60, y - 95), "10к", font=font(FONT_SERIF_B, 40), fill=BROWN, anchor="mm")
        else:
            d.rounded_rectangle([x, y - 190, x + 120, y], 24, outline=(200, 170, 130), width=3)
    tot = month * 10000
    lay, ld = layer_draw(img)
    ld.rounded_rectangle([200, 300, W - 200, 400], 30, fill=(250, 240, 214, 240), outline=INK, width=5)
    img.alpha_composite(lay)
    d = ImageDraw.Draw(img)
    s = f"{tot:,}".replace(",", " ") + " ₽"
    d.text((W / 2, 350), s, font=font(FONT_SERIF_B, 72), fill=(40, 110, 60) if month == 12 else BROWN, anchor="mm")
    if p > 0.55:
        k = ease_out(seg(p, 0.55, 0.65))
        lay, ld = layer_draw(img)
        ld.rounded_rectangle([W / 2 - 360, 800, W / 2 + 360, 800 + 120 * k], 26, fill=(250, 240, 214, 245), outline=INK, width=5)
        img.alpha_composite(lay)
        if k > 0.9:
            d = ImageDraw.Draw(img)
            d.text((W / 2, 860), "отдельный счёт · доступ в любой день", font=font(FONT_SERIF_BI, 38), fill=BROWN, anchor="mm")
    apose = dict(armL=(60, 140), itemL="grain", armR=(30, 60), turn=0.3, look=(0.4, -0.9), smile=0.9,
                 mouth="grin" if month == 12 else "neutral", brow=0.4)
    render_actor(img, draw_ant, 860, 2040, 0.62, apose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ SCENE 7: CTA - which one are you?

@cached
def bg_close():
    return bg_summer().filter(ImageFilter.GaussianBlur(16))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    flap = math.sin(t * 18)
    render_actor(img, draw_dragonfly, 290, 2250, 1.45,
                 dict(armR=(70, 120), itemR="flowermic", armL=(30, 40), flap=flap, turn=0.4, look=(0.3, 0), smile=0.6,
                      mouth="grin" if p > 0.4 else "neutral", brow=0.5, blink=1.0 if 0.5 < p < 0.53 else 0.0))
    render_actor(img, draw_ant, 790, 2250, 1.45,
                 dict(armL=(20, 30), armR=(lerp(10, 40, ease(seg(p, 0.05, 0.2))), lerp(20, 160, ease(seg(p, 0.05, 0.2)))),
                      handR="point", turn=-0.3, look=(-0.2, 0), smile=0.6, brow=0.2, blink=1.0 if 0.7 < p < 0.73 else 0.0))
    d = ImageDraw.Draw(img)
    k = ease_out(seg(p, 0.35, 0.5))
    if k > 0:
        d.text((W / 2, 620), "?", font=font(FONT_SERIF_B, int(240 * k) + 1), fill=(170, 40, 32), anchor="mm", stroke_width=8,
               stroke_fill=(250, 240, 214))
    return img, dict(zoom=1.0 + 0.04 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
