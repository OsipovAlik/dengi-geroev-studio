from lib_ep import *


def tag(img, x, y, lines, k):
    if k <= 0:
        return
    d = ImageDraw.Draw(img)
    k = ease_out(k)
    d.rounded_rectangle([x - 320 * k, y - 150 * k, x + 320 * k, y + 150 * k], 24, fill=(250, 244, 230), outline=INK, width=5)
    if k > 0.9:
        for i, (s, sz, col) in enumerate(lines):
            d.text((x, y + (i - (len(lines) - 1) / 2) * 110), s, font=font(FONT_SERIF_B, sz), fill=col, anchor="mm")


def dashed_dress(img, x, y, k):
    d = ImageDraw.Draw(img)
    pts = [(x - 90, y - 160), (x + 90, y - 160), (x + 200, y + 140), (x + 130, y + 260), (x - 130, y + 260), (x - 200, y + 140)]
    pts.append(pts[0])
    for a, b in zip(pts, pts[1:]):
        n = 14
        for i in range(0, n, 2):
            u0, u1 = i / n, (i + 1) / n
            d.line([(lerp(a[0], b[0], u0), lerp(a[1], b[1], u0)), (lerp(a[0], b[0], u1), lerp(a[1], b[1], u1))], fill=(120, 80, 60), width=6)
    d.text((x, y + 40), "?", font=font(FONT_SERIF_B, 160), fill=(120, 80, 60), anchor="mm")


def scene1(t, dur):
    img = bg_street().copy().convert("RGBA")
    p = t / dur
    tag(img, 540, 520, [("ВСЕ КУПИЛИ!", 84, RED), ("а я?", 64, BROWN2)], seg(p, 0.05, 0.2))
    pose = dict(armR=(80, 150), handR="point", armL=(20, 30), smile=0.5, mouth="o", brow=0.8, look=(0.5, -0.4), turn=0.2,
                bob=-abs(math.sin(t * 4)) * 8)
    render_actor(img, draw_king, 540, 1880, 0.8, pose)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


def scene2(t, dur):
    img = bg_hall().copy()
    p = t / dur
    pose = dict(armL=(30, 40), armR=(70, 150), handR="point", turn=0.3, look=(0.5, -0.5), brow=0.8, smile=0.5, mouth="grin")
    render_actor(img, draw_king, 400, 1880, 0.85, pose)
    dashed_dress(img, 790, 760, 1)
    bubble(img, 540, 330, ["Платье, которого", "нет!"], seg(p, 0.3, 0.45), 62, tail=-1)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


def scene3(t, dur):
    img = bg_hall().copy()
    p = t / dur
    pose = dict(armL=(120, 40), armR=(120, 40), turn=0.2, look=(0.6, -0.2), brow=0.9, smile=0.7, mouth="grin")
    render_actor(img, draw_king, 540, 1880, 0.85, pose)
    dashed_dress(img, 540, 700, 1)
    bubble(img, 330, 330, "Какая красота!", seg(p, 0.15, 0.3), 56, tail=1)
    bubble(img, 760, 450, "Только умные видят", seg(p, 0.5, 0.65), 46, tail=-1)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


def scene4(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    card(img, 380, "5 покупок × 20", seg(p, 0.0, 0.1), size=64)
    card(img, 540, "= 100 в месяц", seg(p, 0.2, 0.3), size=68)
    card(img, 700, "× 12 месяцев", seg(p, 0.4, 0.5), size=64)
    card(img, 900, "= 1200 в год", seg(p, 0.6, 0.75), fill=(200, 60, 48), col=(255, 250, 240), size=80, h=140)
    pose = dict(armR=(80, 150), handR="point", armL=(10, 20), turn=0.4, look=(0.5, -0.9), brow=0.5, smile=0.4)
    render_actor(img, draw_king, 200, 2250, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene5(t, dur):
    img = paper().convert("RGBA")
    p = t / dur
    d = ImageDraw.Draw(img)
    card(img, 420, "«все купили»", seg(p, 0.0, 0.12), size=72)
    card(img, 600, "≠ «мне нужно»", seg(p, 0.3, 0.45), fill=(250, 220, 90), size=76, h=140)
    pose = dict(turn=-0.3, look=(-0.4, -0.9), brow=-0.8, mouth="frown", armL=(10, 20), armR=(10, 20), head=4)
    render_actor(img, draw_king, 860, 2250, 0.62, pose)
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
    card(img, 860, "24 часа", seg(p, 0.1, 0.25), fill=(250, 220, 90), size=84, h=140)
    card(img, 1030, "не хочется завтра — не нужно", seg(p, 0.5, 0.7), size=46, h=110)
    pose = dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1)
    render_actor(img, draw_king, 540, 2250, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


def scene7(t, dur):
    img = bg_hall().filter(ImageFilter.GaussianBlur(10)).convert("RGBA")
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_king, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
