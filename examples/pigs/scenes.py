from lib_ep import *
from chars17 import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


def house(img, kind, x, y, s=1.0, broken=0.0):
    """kind: straw | wood | stone. (x, y) = bottom centre."""
    d = ImageDraw.Draw(img)
    w_, h_ = 300 * s, 240 * s
    col = {"straw": (236, 206, 90), "wood": (170, 110, 64), "stone": (150, 150, 158)}[kind]
    roof = {"straw": (206, 170, 60), "wood": (110, 70, 44), "stone": (170, 70, 60)}[kind]
    if broken >= 1:
        for i in range(7):
            ax, ay = x - 140 * s + i * 46 * s, y - 14 * s
            d.line([(ax, ay), (ax + 70 * s, ay - 10 * s)], fill=col, width=int(14 * s))
            d.line([(ax, ay), (ax + 70 * s, ay - 10 * s)], fill=INK, width=2)
        return
    d.rectangle([x - w_ / 2, y - h_, x + w_ / 2, y], fill=col, outline=INK, width=6)
    if kind == "wood":
        for xx in range(int(x - w_ / 2 + 40 * s), int(x + w_ / 2), int(50 * s)):
            d.line([(xx, y - h_), (xx, y)], fill=INK, width=3)
    if kind == "stone":
        for r in range(4):
            for c in range(5):
                bx = x - w_ / 2 + c * 60 * s + (30 * s if r % 2 else 0)
                by = y - h_ + r * 60 * s
                d.rectangle([bx, by, bx + 60 * s, by + 60 * s], outline=INK, width=3)
    d.polygon([(x - w_ / 2 - 24 * s, y - h_), (x, y - h_ - 140 * s), (x + w_ / 2 + 24 * s, y - h_)], fill=roof, outline=INK)
    d.line([(x - w_ / 2 - 24 * s, y - h_), (x, y - h_ - 140 * s), (x + w_ / 2 + 24 * s, y - h_), (x - w_ / 2 - 24 * s, y - h_)], fill=INK, width=6)
    d.rectangle([x - 34 * s, y - 120 * s, x + 34 * s, y], fill=(90, 56, 40), outline=INK, width=5)


def scene1(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    house(img, "straw", 800, 1530, 0.9)
    pose = dict(armR=(80, 150), handR="point", armL=(20, 30), smile=0.6, mouth="grin", brow=0.8, look=(0.5, -0.2), turn=0.3,
                bob=-abs(math.sin(t * 4)) * 6)
    A(img, draw_pig3, 380, 1800, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    house(img, "straw", 190, 1540, 0.55)
    house(img, "wood", 540, 1540, 0.55)
    house(img, "stone", 890, 1540, 0.55)
    A(img, draw_pig1, 190, 1650, 0.5, dict(turn=0.3, smile=0.8, mouth="grin", armL=(20, 30), armR=(20, 30)))
    A(img, draw_pig2, 540, 1650, 0.5, dict(turn=0.0, smile=0.8, mouth="grin", armL=(20, 30), armR=(20, 30)))
    A(img, draw_pig3, 890, 1650, 0.5, dict(turn=-0.3, smile=0.9, mouth="grin", armL=(20, 30), armR=(130, 40)))
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    k = seg(p, 0.15, 0.55)
    house(img, "straw", 330, 1530, 0.8, broken=1.0 if k > 0.5 else 0.0)
    house(img, "stone", 800, 1530, 0.9)
    d = ImageDraw.Draw(img)
    for i in range(6):  # wind lines
        yy = 700 + i * 60
        off = (t * 900 + i * 120) % 900
        d.line([(100 + off, yy), (260 + off, yy - 14)], fill=(255, 255, 255), width=6)
    for i in range(8):  # flying straw
        if k > 0.5:
            fx = 330 + ((k - 0.5) * 1800 + i * 70) % 800
            fy = 1100 - ((k - 0.5) * 900) % 500 + i * 15
            d.line([(fx, fy), (fx + 40, fy - 10)], fill=(236, 206, 90), width=8)
    A(img, draw_wolf, 140, 1800, 0.8, dict(turn=0.5, mouth="o", brow=0.6, look=(0.8, 0), armL=(20, 30), armR=(20, 30)))
    burst(img, 800, 520, "ФУХ!", seg(p, 0.2, 0.45), 64)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Дешёвый: 10, живёт 1 год", seg(p, 0.0, 0.12), size=50)
    card(img, 560, "Каменный: 30, живёт 10 лет", seg(p, 0.35, 0.5), size=50)
    card(img, 760, "Считай на годы!", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=60, h=130)
    A(img, draw_pig3, 200, 2250, 0.62, dict(turn=0.4, look=(0.5, -0.9), smile=0.6, mouth="grin", armR=(80, 150), handR="point", armL=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "10 лет: дешёвый 10 × 10 = 100", seg(p, 0.0, 0.15), fill=(200, 60, 48), col=(255, 250, 240), size=44, h=130)
    card(img, 580, "10 лет: каменный = 30", seg(p, 0.35, 0.5), fill=(250, 220, 90), size=50, h=130)
    card(img, 780, "100 против 30", seg(p, 0.65, 0.8), size=62, h=130)
    A(img, draw_pig1, 860, 2250, 0.62, dict(turn=-0.3, look=(-0.4, -0.9), smile=-0.5, mouth="frown", armL=(10, 20), armR=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Цена ÷ годы службы", seg(p, 0.0, 0.15), size=54)
    card(img, 600, "2. Сравни цену за год", seg(p, 0.3, 0.5), size=54)
    card(img, 780, "3. Берёшь, где меньше", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=54, h=120)
    A(img, draw_pig3, 540, 2250, 0.62, dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_forest().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    A(img, draw_pig3, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
