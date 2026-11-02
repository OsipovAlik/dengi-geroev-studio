from lib_ep import *
from chars17 import *
from chars18 import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


@cached
def bg_road():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (170, 206, 236), (240, 232, 200)), (0, 0))
    d.poly([(-20, 1100), (300, 760), (560, 1100)], (150, 170, 140, 255), 6)
    d.poly([(300, 1100), (700, 700), (1100, 1100)], (130, 156, 126, 255), 6)
    d.rect(-10, 1100, W + 10, H + 10, (112, 140, 90, 255), 6)
    d.poly([(380, 1100), (700, 1100), (1100, H + 10), (-100, H + 10)], (190, 160, 110, 255), 6)
    return d.done()


def sack(img, x, y, s=1.0, k=1.0):
    d = ImageDraw.Draw(img)
    d.ellipse([x - 120 * s, y - 220 * s, x + 120 * s, y + 20 * s], fill=(196, 160, 104), outline=INK, width=5)
    d.polygon([(x - 50 * s, y - 200 * s), (x + 50 * s, y - 200 * s), (x + 30 * s, y - 250 * s), (x - 30 * s, y - 250 * s)], fill=(176, 140, 90), outline=INK)
    d.line([(x - 60 * s, y - 205 * s), (x + 60 * s, y - 205 * s)], fill=(120, 60, 40), width=8)


def cat(img, x, y, s, **pose):
    A(img, draw_cat, x, y, s, pose)


def scene1(t, dur):
    img = bg_road().copy().convert("RGBA")
    p = t / dur
    cat(img, 600, 1800, 0.85, turn=0.2, smile=0.8, mouth="grin", brow=0.7, armL=(30, 30), armR=(20, 30), bob=-abs(math.sin(t * 3)) * 6)
    sack(img, 250, 1800, 1.0)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_hut().copy().convert("RGBA")
    p = t / dur
    cat(img, 700, 1800, 0.85, turn=-0.1, smile=0.3, mouth="neutral", brow=0.3, armL=(20, 30), armR=(20, 30))
    A(img, draw_pop, 250, 1800, 0.7, dict(turn=0.3, smile=-0.3, mouth="neutral", brow=0.2, armL=(20, 30), armR=(20, 30)))
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_road().copy().convert("RGBA")
    p = t / dur
    k = ease(seg(p, 0.3, 0.8))
    cat(img, 560, 1800, 0.9, turn=0.1, smile=0.9, mouth="grin", brow=0.8, armR=(lerp(20, 80, k), 150), handR="point", armL=(20, 30))
    sack(img, 880, 1800, 0.9)
    burst(img, 800, 520, "ПЛАН!", seg(p, 0.5, 0.8), 64)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Цель: 60", seg(p, 0.0, 0.12), size=60)
    card(img, 560, "Срок: 6 месяцев", seg(p, 0.25, 0.4), size=58)
    card(img, 760, "60 ÷ 6 = 10 в месяц", seg(p, 0.5, 0.7), fill=(200, 60, 48), col=(255, 250, 240), size=62, h=140)
    cat(img, 540, 2250, 0.62, turn=0.3, look=(0.5, -0.9), mouth="grin", brow=0.8, armR=(80, 150), handR="point", armL=(10, 20))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "«Когда-нибудь» ✗", seg(p, 0.0, 0.15), fill=(236, 200, 190), size=56)
    card(img, 620, "Сумма + дата ✓", seg(p, 0.35, 0.55), fill=(250, 220, 90), size=58, h=130)
    cat(img, 540, 2250, 0.62, turn=-0.3, look=(-0.4, -0.9), smile=0.9, mouth="grin", armL=(10, 20), armR=(10, 20))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Цель", seg(p, 0.0, 0.15), size=56)
    card(img, 600, "2. Срок", seg(p, 0.3, 0.5), size=56)
    card(img, 780, "3. Сумма — в день получки", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=50, h=120)
    cat(img, 540, 2250, 0.62, armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_road().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    cat(img, 540, 2600, 2.0, turn=lerp(-0.4, 0.0, pk), look=(0, 0), brow=0.6, armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point",
        armR=(20, 40), smile=0.8, mouth="grin" if 0.3 < p < 0.7 else "neutral")
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
