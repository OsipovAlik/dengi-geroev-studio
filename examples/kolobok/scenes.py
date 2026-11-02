from lib_ep import *
from chars17 import *
from chars18 import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


@cached
def bg_forest():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (196, 220, 200), (232, 232, 196)), (0, 0))
    for x, w_ in ((90, 90), (990, 100)):
        d.rect(x - w_ / 2, 320, x + w_ / 2, 1560, (110, 82, 58, 255), 6)
        d.poly([(x - 230, 440), (x, 40), (x + 230, 440)], (84, 124, 92, 255), 6)
    d.rect(-10, 1560, W + 10, H + 10, (104, 130, 84, 255), 6)
    d.ell(540, 1760, 480, 70, (170, 140, 96, 255), 6)
    return d.done()


def kol(img, x, y, s, **pose):
    A(img, draw_kolobok, x, y, s, pose)


def scene1(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    kol(img, 540, 1130, 1.35, bob=-abs(math.sin(t * 5)) * 50, mouth="o", brow=0.8, look=(0.6, 0), turn=0.2)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.5)


def scene2(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    kol(img, 380, 1130, 1.2, bob=-abs(math.sin(t * 4)) * 40, mouth="grin", brow=0.6, look=(0.5, 0), turn=0.3)
    A(img, draw_fox, 900 + 300 * (1 - ease(seg(p, 0.5, 0.95))), 1900, 0.8,
      dict(turn=-0.3, smile=0.9, mouth="grin", brow=0.7), flip=True)
    burst(img, 780, 520, "ХОП!", seg(p, 0.1, 0.35), 64)
    return img, dict(zoom=1.02, cx=0.5, cy=0.5)


def scene3(t, dur):
    img = bg_forest().filter(ImageFilter.GaussianBlur(3)).convert("RGBA")
    p = t / dur
    A(img, draw_fox, 700, 1850, 0.95, dict(turn=0.0, smile=0.9, mouth="grin", brow=0.8, look=(-0.5, 0),
      armL=(20, 30), armR=(70, 150), handR="point"), flip=True)
    kol(img, 260, 1130, 0.9, mouth="o", brow=0.9, look=(0.5, 0), turn=0.3, bob=math.sin(t * 8) * 6)
    return img, dict(zoom=1.02, cx=0.5, cy=0.52)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Долг: 100", seg(p, 0.0, 0.12), size=60)
    card(img, 560, "Штраф: 1% в день", seg(p, 0.25, 0.4), size=58)
    card(img, 760, "100 дней → 270", seg(p, 0.5, 0.7), fill=(200, 60, 48), col=(255, 250, 240), size=64, h=140)
    kol(img, 540, 1250, 0.7, mouth="o", brow=0.9, look=(0, -0.5))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    for i, (lab, h) in enumerate((("день 0", 100), ("день 50", 165), ("день 100", 270))):
        k = ease(seg(p, 0.1 + 0.25 * i, 0.4 + 0.25 * i))
        x = 240 + i * 300
        hh = h * 1.3 * k
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([x - 90, 780 - hh, x + 90, 780], 14, fill=(200, 60, 48) if i == 2 else (240, 190, 90), outline=INK, width=5)
        if k > 0.9:
            d.text((x, 840), lab, font=font(FONT_SERIF_B, 44), fill=BROWN, anchor="mm")
            d.text((x, 780 - hh - 36), str(h), font=font(FONT_SERIF_B, 56), fill=BROWN, anchor="mm")
    kol(img, 540, 1250, 0.7, mouth="sad", brow=0.1, look=(0, -0.6))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Скажи первым", seg(p, 0.0, 0.15), size=56)
    card(img, 600, "2. Договорись о графике", seg(p, 0.3, 0.5), size=52)
    card(img, 780, "3. Плати с первой получки", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=50, h=120)
    kol(img, 540, 1250, 0.7, mouth="grin", brow=0.6, look=(0, -0.4))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_forest().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    kol(img, 540, 1130, 1.5, mouth="grin", brow=0.6, bob=-abs(math.sin(t * 3)) * 30, look=(0, 0))
    return img, dict(zoom=1.0 + 0.04 * ease(p), cx=0.5, cy=0.5)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
