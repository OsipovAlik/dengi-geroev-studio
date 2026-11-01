from lib_ep import *
from chars17 import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


@cached
def bg_swamp():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (190, 206, 190), (226, 226, 200)), (0, 0))
    for x, w_ in ((90, 90), (990, 100)):
        d.rect(x - w_ / 2, 300, x + w_ / 2, 1560, (110, 82, 58, 255), 6)
        d.poly([(x - 230, 420), (x, 40), (x + 230, 420)], (84, 120, 96, 255), 6)
    d.rect(-10, 1560, W + 10, H + 10, (96, 120, 80, 255), 6)
    d.ell(540, 1700, 460, 90, (84, 100, 70, 255), 6)
    d.ell(540, 1700, 330, 55, (110, 130, 90, 255), 0)
    return d.done()


def scene1(t, dur):
    img = bg_swamp().copy().convert("RGBA")
    p = t / dur
    pose = dict(armR=(80, 150), handR="point", armL=(20, 30), smile=0.7, mouth="grin", brow=0.8, look=(0.5, -0.2), turn=0.3,
                bob=-abs(math.sin(t * 4)) * 6)
    A(img, draw_munch, 380, 1800, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_swamp().copy().convert("RGBA")
    p = t / dur
    k = ease(seg(p, 0.3, 0.8))
    pose = dict(turn=0.0, smile=0.8, mouth="grin", brow=0.7, look=(0, -0.3), armL=(lerp(20, 150, k), 140), armR=(20, 30),
                bob=-k * 60)
    A(img, draw_munch, 540, 1800, 0.8, pose)
    burst(img, 840, 520, "ХОП!", seg(p, 0.55, 0.8), 64)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_swamp().filter(ImageFilter.GaussianBlur(4)).convert("RGBA")
    p = t / dur
    pose = dict(turn=0.2, smile=-0.2, mouth="neutral", brow=0.2, look=(0.3, 0), armL=(100, 60), armR=(100, 60), handL="open", handR="open")
    A(img, draw_munch, 540, 1800, 0.8, pose)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "1,5 × 1,5 × … 12 раз", seg(p, 0.0, 0.12), size=54)
    card(img, 560, "50% в месяц", seg(p, 0.25, 0.4), size=60)
    card(img, 760, "≈ в 130 раз за год", seg(p, 0.5, 0.7), fill=(200, 60, 48), col=(255, 250, 240), size=60, h=140)
    A(img, draw_munch, 200, 2250, 0.62, dict(turn=0.4, look=(0.5, -0.9), mouth="o", brow=0.9, armR=(80, 150), handR="point", armL=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "10 → 1 300", seg(p, 0.0, 0.15), size=64, h=130)
    card(img, 620, "Такого не бывает", seg(p, 0.35, 0.55), fill=(250, 220, 90), size=58, h=130)
    A(img, draw_munch, 860, 2250, 0.62, dict(turn=-0.3, look=(-0.4, -0.9), smile=0.9, mouth="grin", armL=(10, 20), armR=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Источник дохода?", seg(p, 0.0, 0.15), size=54)
    card(img, 600, "2. Документы и срок?", seg(p, 0.3, 0.5), size=54)
    card(img, 780, "3. Не проверить — не верь", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=50, h=120)
    A(img, draw_munch, 540, 2250, 0.62, dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_swamp().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    A(img, draw_munch, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
