from lib_ep import *


def tag(img, x, y, lines, k, rot=0):
    if k <= 0:
        return
    d = ImageDraw.Draw(img)
    k = ease_out(k)
    d.polygon([(x - 300 * k, y - 150 * k), (x + 300 * k, y - 150 * k), (x + 300 * k, y + 150 * k), (x - 300 * k, y + 150 * k)],
              fill=(250, 244, 230), outline=INK)
    d.ellipse([x - 270, y - 8, x - 240, y + 22], fill=(214, 192, 150), outline=INK, width=3) if False else None
    if k > 0.9:
        for i, (s, sz, col) in enumerate(lines):
            d.text((x, y + (i - (len(lines) - 1) / 2) * 110), s, font=font(FONT_SERIF_B, sz), fill=col, anchor="mm")


def scene1(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    tag(img, 540, 560, [("всего", 56, BROWN2), ("1 тыс. в месяц!", 80, RED)], seg(p, 0.05, 0.2))
    pose = dict(armR=(60 + 8 * math.sin(t * 4), 110), itemR="coins", armL=(20, 30), smile=0.9, mouth="grin", brow=0.7,
                look=(0.5, -0.4), turn=0.2, bob=-abs(math.sin(t * 4)) * 8)
    render_actor(img, draw_pop, 540, 1880, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_hut().copy()
    p = t / dur
    pose = dict(armL=(30, 40), armR=(70, 150), handR="point", turn=0.3, look=(0.5, -0.5), brow=0.8, smile=0.5, mouth="grin")
    render_actor(img, draw_pop, 380, 1880, 0.85, pose)
    bubble(img, 600, 560, ["Нанять бы", "подешевле!"], seg(p, 0.3, 0.45), 62, tail=-1)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_hut().copy()
    p = t / dur
    flick = lambda a: seg(p, a, a + 0.12)
    pose_p = dict(armL=(120, 40), armR=(120, 40), turn=0.3, look=(0.6, 0.0), brow=1.0, mouth="o", head=-3 * math.sin(p * 40) if p > 0.3 else 0)
    render_actor(img, draw_pop, 330, 1880, 0.85, pose_p)
    pose_b = dict(armR=(60, 150), handR="point", turn=-0.3, look=(-0.6, 0), brow=0.3, smile=0.9, mouth="grin")
    render_actor(img, draw_balda, 800, 1880, 0.85, pose_b, flip=True)
    for i, a in enumerate((0.3, 0.5, 0.7)):
        burst(img, 520 + i * 40, 640 + i * 150, "ЩЕЛК!", flick(a) * 1.0 if p < a + 0.15 else 0, 70)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "Цена: 20 тыс.", seg(p, 0.0, 0.1), size=62)
    card(img, 540, "1 тыс. × 24 месяца", seg(p, 0.2, 0.3), size=60)
    card(img, 700, "= 24 тыс.", seg(p, 0.4, 0.5), size=72)
    card(img, 900, "Переплата: 4 тыс. = 20%", seg(p, 0.65, 0.78), fill=(200, 60, 48), col=(255, 250, 240), size=62, h=130)
    pose = dict(armR=(80, 150), handR="point", armL=(10, 20), turn=0.4, look=(0.5, -0.9), brow=0.5, smile=0.4)
    render_actor(img, draw_pop, 200, 2300, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    d = ImageDraw.Draw(img)
    card(img, 420, "1 тыс. в месяц", seg(p, 0.0, 0.12), size=70)
    k = ease_out(seg(p, 0.15, 0.3))
    if k > 0:
        d.line([(160, 420), (160 + 760 * k, 420)], fill=RED, width=10)
    card(img, 700, "СКОЛЬКО ВСЕГО?", seg(p, 0.45, 0.6), fill=(250, 220, 90), size=84, h=170)
    pose = dict(turn=-0.3, look=(-0.4, -0.9), brow=-0.8, mouth="frown", armL=(10, 20), armR=(10, 20), head=4)
    render_actor(img, draw_pop, 860, 2300, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene6(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "платёж", seg(p, 0.0, 0.1), size=66)
    card(img, 540, "× число месяцев", seg(p, 0.2, 0.3), size=66)
    card(img, 700, "сравни с ценником", seg(p, 0.4, 0.5), size=66)
    card(img, 900, "разница = твоя цена", seg(p, 0.65, 0.78), fill=(200, 60, 48), col=(255, 250, 240), size=66, h=130)
    pose = dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1)
    render_actor(img, draw_pop, 540, 2300, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_street().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_pop, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
