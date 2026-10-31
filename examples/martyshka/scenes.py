from lib_ep import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


def scene1(t, dur):
    img = bg_street().copy().convert("RGBA")
    p = t / dur
    card(img, 330, "КУПИЛ — И ПЫЛИТСЯ?", seg(p, 0.05, 0.2), fill=(250, 220, 90), size=58, h=130)
    glasses(img, 780, 700, 1.0)
    pose = dict(armR=(80, 150), handR="point", armL=(20, 30), smile=-0.3, mouth="o", brow=0.8, look=(0.5, -0.2), turn=0.3,
                bob=-abs(math.sin(t * 4)) * 6)
    A(img, draw_monkey, 380, 1800, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    glasses(img, 740, 1100, 0.8)
    A(img, draw_monkey, 380, 1800, 0.8, dict(turn=0.3, look=(0.5, 0.3), brow=0.6, mouth="o", armL=(120, 40), armR=(70, 150), handR="point"))
    bubble(img, 540, 480, ["Говорят, очки —", "полезная вещь..."], seg(p, 0.35, 0.5), 50, tail=1)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    d = ImageDraw.Draw(img)
    d.ellipse([650, 1500, 960, 1620], fill=(130, 130, 130), outline=INK, width=6)
    k = seg(p, 0.5, 0.75)
    glasses(img, 380 + 300 * ease(k), 1050 + 400 * ease(k), 0.8)
    A(img, draw_monkey, 300, 1800, 0.8, dict(turn=0.3, look=(0.5, 0.4), mouth="o", brow=-0.5, armL=(120, 40), armR=(130, 100)))
    burst(img, 800, 520, "ВРУТ!", seg(p, 0.75, 0.95), 56)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Вещь за 100", seg(p, 0.0, 0.1), size=68)
    card(img, 560, "использовал 2 раза", seg(p, 0.2, 0.3), size=60)
    card(img, 760, "100 ÷ 2 = 50 за раз", seg(p, 0.45, 0.6), fill=(200, 60, 48), col=(255, 250, 240), size=64, h=140)
    A(img, draw_monkey, 200, 2250, 0.62, dict(turn=0.4, look=(0.5, -0.9), mouth="frown", armR=(80, 150), handR="point", armL=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "использовал 100 раз", seg(p, 0.0, 0.12), size=60)
    card(img, 560, "100 ÷ 100 = 1 за раз", seg(p, 0.3, 0.45), fill=(250, 220, 90), size=64, h=140)
    card(img, 760, "дорого — то, что пылится", seg(p, 0.6, 0.78), size=50, h=120)
    A(img, draw_monkey, 860, 2250, 0.62, dict(turn=-0.3, look=(-0.4, -0.9), smile=0.9, mouth="grin", armL=(10, 20), armR=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Какая у меня задача?", seg(p, 0.0, 0.15), size=50)
    card(img, 600, "2. Что буду делать на этой неделе?", seg(p, 0.3, 0.5), size=42)
    card(img, 780, "3. Потом — покупка", seg(p, 0.65, 0.8), fill=(250, 220, 90), size=54, h=120)
    A(img, draw_monkey, 540, 2250, 0.62, dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_forest().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    A(img, draw_monkey, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
