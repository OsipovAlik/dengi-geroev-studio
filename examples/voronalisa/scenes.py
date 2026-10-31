from lib_ep import *


def A(img, fn, x, y, s, pose, flip=False):
    render_actor(img, fn, x, y, s, pose, flip=flip)


def scene1(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    burst(img, 790, 560, "-90%", seg(p, 0.1, 0.3), 90)
    pose = dict(armR=(80, 150), handR="point", armL=(20, 30), smile=0.8, mouth="grin", brow=0.8, look=(0.5, -0.2), turn=0.3,
                bob=-abs(math.sin(t * 4)) * 6)
    A(img, draw_fox, 380, 1800, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    A(img, draw_crow, 800, 1800, 0.8, dict(turn=-0.3, look=(-0.4, -0.3), brow=0.3, armL=(10, 20), armR=(10, 20)), flip=True)
    cheese(img, 690, 1230, 0.5)
    A(img, draw_fox, 280, 1800, 0.8, dict(turn=0.3, look=(0.5, -0.1), smile=0.9, mouth="grin", armL=(120, 40), armR=(20, 30)))
    bubble(img, 330, 520, ["Какой голос!", "Спой, красавица!"], seg(p, 0.45, 0.6), 50, tail=1)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_forest().copy().convert("RGBA")
    p = t / dur
    A(img, draw_fox, 300, 1800, 0.8, dict(turn=0.3, look=(0.5, 0.4), smile=1, mouth="grin", armR=(80, 150), handR="point"))
    A(img, draw_crow, 790, 1800, 0.8, dict(turn=-0.3, look=(-0.4, -0.2), mouth="o", brow=0.9, armL=(20, 140), armR=(20, 140)), flip=True)
    k = seg(p, 0.35, 0.75)
    cheese(img, 760 - 330 * ease(k), 1000 + 700 * ease_out(k) ** 1.5 * 0.55 + 200 * ease(k), 0.5)
    bubble(img, 780, 520, "Кар-р-р!", seg(p, 0.2, 0.35), 64, tail=-1)
    return img, dict(zoom=1.02, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Скидка 90%", seg(p, 0.0, 0.1), fill=(250, 220, 90), size=78, h=130)
    card(img, 560, "товар за 100", seg(p, 0.2, 0.3), size=64)
    card(img, 720, "отдают за 10", seg(p, 0.35, 0.45), size=64)
    card(img, 900, "на чём заработает продавец?", seg(p, 0.6, 0.78), fill=(200, 60, 48), col=(255, 250, 240), size=52, h=130)
    A(img, draw_fox, 200, 2250, 0.62, dict(turn=0.4, look=(0.5, -0.9), smile=0.9, mouth="grin", armR=(80, 150), handR="point", armL=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 420, "1. Похвала: «вы особенный»", seg(p, 0.0, 0.15), size=48)
    card(img, 600, "2. Срочность: «только сегодня»", seg(p, 0.3, 0.45), size=48)
    card(img, 780, "3. Просьба: «переведите сейчас»", seg(p, 0.6, 0.75), fill=(250, 220, 90), size=48, h=120)
    A(img, draw_fox, 860, 2250, 0.62, dict(turn=-0.3, look=(-0.4, -0.9), smile=0.9, mouth="grin", armL=(10, 20), armR=(10, 20)))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    d = ImageDraw.Draw(img)
    cx, cy, r = 540, 520, 190
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 244, 230), outline=INK, width=8)
    for i in range(12):
        a = i * math.pi / 6
        d.line([(cx + math.sin(a) * (r - 30), cy - math.cos(a) * (r - 30)), (cx + math.sin(a) * (r - 8), cy - math.cos(a) * (r - 8))], fill=INK, width=6)
    ang = p * 2 * math.pi
    d.line([(cx, cy), (cx + math.sin(ang) * 120, cy - math.cos(ang) * 120)], fill=RED, width=10)
    d.line([(cx, cy), (cx, cy - 90)], fill=INK, width=10)
    card(img, 860, "24 часа на проверку", seg(p, 0.1, 0.25), fill=(250, 220, 90), size=64, h=130)
    card(img, 1030, "приятнее и срочнее — проверяй дольше", seg(p, 0.5, 0.7), size=38, h=110)
    A(img, draw_crow, 540, 2250, 0.62, dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1))
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_forest().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    A(img, draw_fox, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
