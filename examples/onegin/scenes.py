import math, random
from base import *
from chars8 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)
RED = (170, 40, 32)


def paper_bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


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


@cached
def bg_ball(night=0):
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (120, 40, 50), (70, 24, 40)), (0, 0))
    for x in range(0, W, 180):  # tall windows / pilasters
        d.rect(x + 20, 360, x + 150, 1250, (196, 168, 110, 255), 5)
        d.rect(x + 40, 390, x + 130, 1220, (30, 36, 70, 255) if night else (70, 90, 140, 255), 3)
    d.rect(-10, 1250, W + 10, H + 10, (186, 140, 90, 255), 6)
    for i in range(0, W + 200, 200):  # parquet
        d.line([(i, 1250), (i - 300, H)], 3, (150, 108, 66, 255))
    for yy in (1400, 1600, 1800):
        d.line([(0, yy), (W, yy)], 3, (150, 108, 66, 255))
    for cx in (270, 810):  # chandeliers
        d.line([(cx, 0), (cx, 250)], 4)
        d.poly([(cx - 90, 260), (cx + 90, 260), (cx + 50, 330), (cx - 50, 330)], (232, 196, 90, 255), 4)
        for k in (-70, -35, 0, 35, 70):
            d.ell(cx + k, 245, 8, 16, (255, 236, 150, 255), 3)
    return d.done()


@cached
def bg_study():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (92, 70, 54), (60, 44, 36)), (0, 0))
    d.rect(-10, 1300, W + 10, H + 10, (110, 76, 50, 255), 6)
    for i, x in enumerate(range(80, W, 260)):
        d.rect(x, 380, x + 200, 1000, (74, 50, 34, 255), 5)
        for r in range(4):
            d.rect(x + 12, 400 + r * 150, x + 188, 520 + r * 150, (120, 80, 50, 255), 3)
    return d.done()


def coin(d, x, y, r=30):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(232, 186, 70), outline=INK, width=4)
    d.ellipse([x - r * 0.6, y - r * 0.6, x + r * 0.6, y + r * 0.6], outline=(170, 120, 30), width=3)


def dancers(img, t, k):
    lay, d = layer_draw(img)
    for i, (x, col) in enumerate(((140, (230, 200, 90)), (940, (90, 150, 190)), (330, (200, 90, 130)), (760, (130, 190, 120)))):
        sw = math.sin(t * 2 + i) * 16
        d.polygon([(x - 50 + sw, 1100), (x + 50 + sw, 1100), (x + 90 + sw, 1330), (x - 90 + sw, 1330)], fill=col + (255,), outline=INK)
        d.ellipse([x - 28 + sw, 1020, x + 28 + sw, 1090], fill=(240, 210, 180, 255), outline=INK, width=3)
    img.alpha_composite(lay)


# ---------------------------------------------------------- 1
def scene1(t, dur):
    img = bg_ball().copy()
    p = t / dur
    dancers(img, t, 1)
    pose = dict(armR=(50 + 10 * math.sin(t * 3), 120), itemR="coins", armL=(30, 40), smile=0.8, mouth="grin", brow=0.5, turn=0.2,
                bob=-abs(math.sin(t * 3)) * 8)
    render_actor(img, draw_senior, 540, 2290, 0.62, pose)
    d = ImageDraw.Draw(img)
    for i in range(3):
        k = ease_out(seg(p, 0.1 + i * 0.12, 0.22 + i * 0.12))
        if k > 0:
            cx = 270 + i * 270
            d.rounded_rectangle([cx - 100, 520 - 60 * k, cx + 100, 520 + 60 * k], 20, fill=(250, 244, 226), outline=INK, width=4)
            if k > 0.9:
                d.text((cx, 520), f"бал {i + 1}", font=font(FONT_SERIF_B, 50), fill=BROWN, anchor="mm")
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 2
def scene2(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([110, 360, W - 110, 1000], 30, fill=(250, 244, 230), outline=INK, width=5)
    lines = ["Давал три бала ежегодно", "И промотался наконец", ]
    d.text((W / 2, 440), "А. С. Пушкин", font=font(FONT_SERIF_I, 40), fill=BROWN2, anchor="mm")
    d.text((W / 2, 500), "«Евгений Онегин», гл. 1", font=font(FONT_SERIF_I, 40), fill=BROWN2, anchor="mm")
    for i, ln in enumerate(("«Долгами жил его отец,", "Давал три бала ежегодно", "И промотался наконец».")):
        k = ease_out(seg(p, 0.1 + i * 0.2, 0.25 + i * 0.2))
        if k > 0:
            d.text((W / 2, 640 + i * 110), ln, font=font(FONT_SERIF_BI, 58), fill=BROWN if i < 2 else RED, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(armL=(30, 50), armR=(20, 30), turn=0.3, brow=-0.6, mouth="frown", smile=-0.5, head=-3)
    render_actor(img, draw_senior, 540, 2290, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 3
def scene3(t, dur):
    img = bg_ball(1).copy()
    p = t / dur
    dancers(img, t, 1)
    d = ImageDraw.Draw(img)
    h = lerp(40, 380, ease(p))  # growing pile of debt
    d.rounded_rectangle([60, 720 - h, 330, 720], 16, fill=(236, 226, 200), outline=INK, width=5)
    d.text((195, 720 - h / 2), "ДОЛГ", font=font(FONT_SERIF_B, 56), fill=RED, anchor="mm")
    for i in range(6):
        coin(d, 760 + (i % 3) * 90, 600 + (i // 3) * 60 + math.sin(t * 3 + i) * 8, 30)
    pose = dict(armL=(120, 50), armR=(100, 60), smile=0.2, brow=-0.5, turn=0.3, look=(0.6, 0.5), head=3)
    render_actor(img, draw_senior, 540, 2290, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 4
def scene4(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = ease_out(seg(p, 0.03, 0.12))
    if k > 0:
        d.rounded_rectangle([140, 370, 520, 520], 24, fill=(190, 224, 170), outline=INK, width=4)
        d.text((330, 420), "доход", font=font(FONT_SERIF_B, 40), fill=BROWN, anchor="mm")
        d.text((330, 475), "100 тыс. ₽", font=font(FONT_SERIF_B, 46), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.12, 0.2))
    if k > 0:
        d.rounded_rectangle([560, 370, 940, 520], 24, fill=(236, 190, 170), outline=INK, width=4)
        d.text((750, 420), "траты", font=font(FONT_SERIF_B, 40), fill=BROWN, anchor="mm")
        d.text((750, 475), "120 тыс. ₽", font=font(FONT_SERIF_B, 46), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.35, 0.5))
    if k > 0:
        d.rounded_rectangle([110, 600, W - 110, 600 + 250 * k], 30, fill=(250, 244, 230), outline=INK, width=5)
        if k > 0.9:
            d.text((W / 2, 680), "−20 тыс. ₽ в месяц", font=font(FONT_SERIF_B, 56), fill=BROWN, anchor="mm")
            d.text((W / 2, 780), "×12 = −240 тыс. ₽ + проценты", font=font(FONT_SERIF_B, 52), fill=RED, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(armR=(80, 150), handR="point", armL=(10, 20), turn=0.4, look=(0.5, -0.9), brow=0.3, smile=0.0)
    render_actor(img, draw_senior, 200, 2290, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 5
def scene5(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    items = [("кредитка на отпуск", (90, 140, 180), 0.05), ("рассрочка на телефон", (200, 150, 70), 0.3), ("займ до зарплаты", (190, 70, 60), 0.55)]
    for i, (lab, col, st) in enumerate(items):
        k = ease_out(seg(p, st, st + 0.1))
        if k > 0:
            yy = 420 + i * 190
            d.rounded_rectangle([150, yy - 70, W - 150, yy + 70], 26, fill=col, outline=INK, width=5)
            d.text((W / 2, yy - 18), f"бал {i + 1}", font=font(FONT_SERIF_I, 36), fill=(255, 250, 240), anchor="mm")
            d.text((W / 2, yy + 24), lab, font=font(FONT_SERIF_B, 46), fill=(255, 250, 240), anchor="mm")
    img = img.convert("RGBA")
    pose = dict(turn=-0.3, look=(-0.4, -0.9), brow=-0.8, mouth="frown", armL=(10, 20), armR=(10, 20), head=4)
    render_actor(img, draw_senior, 860, 2290, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 6
def scene6(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = ease_out(seg(p, 0.05, 0.2))
    if k > 0:
        d.rounded_rectangle([150, 400, W - 150, 400 + 150 * k], 30, fill=(70, 150, 90), outline=INK, width=5)
        if k > 0.9:
            d.text((W / 2, 475), "расходы < доходов", font=font(FONT_SERIF_B, 60), fill=(255, 250, 240), anchor="mm")
    k = ease_out(seg(p, 0.4, 0.55))
    if k > 0:
        d.rounded_rectangle([150, 640, W - 150, 640 + 150 * k], 30, fill=(236, 226, 200), outline=INK, width=5)
        if k > 0.9:
            d.text((W / 2, 715), "праздник — из накоплений", font=font(FONT_SERIF_B, 52), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.65, 0.8))
    if k > 0:
        for i in range(5):
            coin(d, 320 + i * 100, 930 + math.sin(t * 3 + i) * 6, 36 * k)
    img = img.convert("RGBA")
    pose = dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1)
    render_actor(img, draw_senior, 540, 2290, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 7
@cached
def bg_close():
    return bg_study().filter(ImageFilter.GaussianBlur(14))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.5,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_senior, 540, 2830, 1.2, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
