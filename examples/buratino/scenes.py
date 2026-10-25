import math, random
from base import *
from chars7 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)


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


def snow(img, t, k, n=80, seed=2):
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




def paper_bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


@cached
def bg_field_night():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (24, 32, 70), (66, 70, 110)), (0, 0))
    rnd = random.Random(4)
    for i in range(40):
        d.ell(rnd.randint(0, W), rnd.randint(300, 1000), 3, 3, (250, 244, 200, 255), 0)
    d.ell(830, 420, 110, 110, (246, 240, 210, 255), 4)
    d.poly([(-10, 1500), (300, 1420), (700, 1470), (W + 10, 1400), (W + 10, H + 10), (-10, H + 10)], (46, 70, 50, 255), 6)
    for x in range(40, W, 90):
        d.line([(x, 1560), (x + 8, 1530)], 5, (30, 54, 36, 255))
    return d.done()


@cached
def bg_field_day():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (170, 210, 236), (240, 236, 214)), (0, 0))
    d.ell(840, 380, 100, 100, (250, 226, 130, 255), 4)
    d.poly([(-10, 1500), (300, 1420), (700, 1470), (W + 10, 1400), (W + 10, H + 10), (-10, H + 10)], (112, 150, 80, 255), 6)
    for x in range(40, W, 90):
        d.line([(x, 1560), (x + 8, 1530)], 5, (80, 120, 56, 255))
    return d.done()


def fox(img, x, y, s, a=1.0, flip=1):
    lay, d = layer_draw(img)
    c = (214, 108, 40, int(255 * a))
    k = lambda px, py: (x + flip * px * s, y + py * s)
    d.polygon([k(-60, -40), k(-170, -90), k(-200, -20), k(-90, 10)], fill=c, outline=INK)  # tail
    d.polygon([k(-80, -120), k(60, -120), k(70, 0), k(-80, 0)], fill=c, outline=INK)  # body
    d.polygon([k(40, -170), k(110, -150), k(160, -100), k(90, -90), k(40, -90)], fill=c, outline=INK)  # head
    d.polygon([k(50, -170), k(60, -220), k(85, -166)], fill=c, outline=INK)
    d.polygon([k(90, -160), k(115, -210), k(120, -150)], fill=c, outline=INK)
    d.ellipse([k(100, -122)[0] - 5, k(100, -122)[1] - 5, k(100, -122)[0] + 5, k(100, -122)[1] + 5], fill=INK)
    img.alpha_composite(lay)


def cat(img, x, y, s, a=1.0, flip=1):
    lay, d = layer_draw(img)
    c = (90, 92, 104, int(255 * a))
    k = lambda px, py: (x + flip * px * s, y + py * s)
    d.polygon([k(-70, -110), k(50, -110), k(60, 0), k(-70, 0)], fill=c, outline=INK)
    d.line([k(-70, -40), k(-150, -150), k(-120, -190)], fill=c, width=int(22 * s))
    xs = sorted([k(-10, 0)[0], k(95, 0)[0]])
    d.ellipse([xs[0], k(0, -200)[1], xs[1], k(0, -110)[1]], fill=c, outline=INK)
    d.polygon([k(5, -195), k(10, -240), k(35, -200)], fill=c, outline=INK)
    d.polygon([k(55, -200), k(80, -240), k(85, -190)], fill=c, outline=INK)
    gx = sorted([k(20, 0)[0], k(85, 0)[0]])
    d.rectangle([gx[0], k(0, -165)[1], gx[1], k(0, -148)[1]], fill=(20, 20, 26, int(255 * a)))  # dark glasses
    img.alpha_composite(lay)


def coin_g(d, x, y, r=34):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(232, 186, 70), outline=INK, width=4)
    d.ellipse([x - r * 0.6, y - r * 0.6, x + r * 0.6, y + r * 0.6], outline=(170, 120, 30), width=3)


# ================================================================ 1: five gold coins

def scene1(t, dur):
    img = bg_field_night().copy()
    p = t / dur
    pose = dict(armR=(60 + 8 * math.sin(t * 4), 110), itemR="coin5", armL=(20, 30), smile=0.9, mouth="grin", brow=0.7,
                look=(0.5, -0.4), turn=0.2, bob=-abs(math.sin(t * 4)) * 10)
    render_actor(img, draw_buratino, 540, 1880, 0.95, pose)
    d = ImageDraw.Draw(img)
    for i in range(5):
        k = ease_out(seg(p, 0.1 + i * 0.07, 0.2 + i * 0.07))
        if k > 0:
            coin_g(d, 150 + i * 195, lerp(250, 640, k) + math.sin(t * 3 + i) * 10, 70 * k)
    return img, dict(zoom=1.03 + 0.02 * ease(p), cx=0.5, cy=0.55)


# ================================================================ 2: fox and cat pitch

def scene2(t, dur):
    img = bg_field_night().copy()
    p = t / dur
    pose = dict(armL=(30, 40), armR=(20, 30), turn=0.5, look=(0.7, 0.2), brow=0.8, smile=0.5, mouth="o" if p > 0.5 else "neutral")
    render_actor(img, draw_buratino, 280, 1880, 0.85, pose)
    fox(img, 660, 1900, 1.15, flip=-1)
    cat(img, 880, 1900, 1.05, flip=-1)
    bubble(img, 560, 600, ["Закопай монеты —", "вырастет дерево", "с золотом!"], seg(p, 0.35, 0.5), 54, tail=-1)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ 3: buried -> stolen

def scene3(t, dur):
    p = t / dur
    night = p < 0.5
    img = (bg_field_night() if night else bg_field_day()).copy()
    d = ImageDraw.Draw(img)
    mound = (700, 1800)
    if night:
        pose = dict(armL=(120, 50), armR=(120, 50), turn=0.4, look=(0.6, 0.6), brow=0.2, smile=0.4, lean=10)
        render_actor(img, draw_buratino, 330, 1880, 0.85, pose)
        d.ellipse([mound[0] - 160, mound[1] - 40, mound[0] + 160, mound[1] + 40], fill=(90, 62, 40), outline=INK, width=5)
        k = seg(p, 0.0, 0.3)
        for i in range(5):
            yy = lerp(1500, 1790, ease(clamp(k * 1.5 - i * 0.12)))
            if yy < 1785:
                coin_g(d, mound[0] - 60 + i * 30, yy, 24)
        if p > 0.25:
            bubble(img, 600, 640, "Крекс-фекс-пекс!", seg(p, 0.25, 0.35), 60, tail=-1)
    else:
        d.ellipse([mound[0] - 160, mound[1] - 40, mound[0] + 160, mound[1] + 40], fill=(60, 40, 26), outline=INK, width=5)
        d.text((mound[0], mound[1] - 110), "пусто!", font=font(FONT_SERIF_BI, 64), fill=(170, 40, 32), anchor="mm")
        pose = dict(armL=(150, 30), armR=(150, 30), turn=0.3, look=(0.6, 0.6), brow=1.0, mouth="o", head=-4)
        render_actor(img, draw_buratino, 330, 1880, 0.85, pose)
        fx = lerp(760, 1180, ease(seg(p, 0.52, 0.9)))
        fox(img, fx, 1180, 0.42, flip=-1)
        cat(img, fx + 150, 1180, 0.4, flip=-1)
    return img, dict(zoom=1.03, cx=0.5, cy=0.55)


# ================================================================ 4: three red flags + 10% per month

def scene4(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    flags = [("гарантия дохода", 0.0), ("срочность", 0.12), ("тайна", 0.24)]
    for i, (lab, st) in enumerate(flags):
        k = ease_out(seg(p, st, st + 0.08))
        if k > 0:
            yy = 400 + i * 130
            d.rounded_rectangle([140, yy - 48, W - 140, yy + 48], 22, fill=(236, 226, 200), outline=INK, width=4)
            d.polygon([(190, yy + 28), (230, yy + 28), (210, yy - 30)], fill=(200, 50, 40), outline=INK)
            d.text((W / 2 + 20, yy), lab, font=font(FONT_SERIF_B, 56), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.55, 0.68))
    if k > 0:
        d.rounded_rectangle([110, 830, W - 110, 830 + 270 * k], 30, fill=(250, 244, 230), outline=INK, width=5)
        if k > 0.9:
            d.text((W / 2, 900), "100 тыс. ₽ при 10% в месяц", font=font(FONT_SERIF_B, 50), fill=BROWN, anchor="mm")
            d.text((W / 2, 990), "через год ≈ 314 тыс. ₽", font=font(FONT_SERIF_B, 62), fill=(170, 40, 32), anchor="mm")
            d.text((W / 2, 1060), "(1,1 в степени 12 ≈ 3,14)", font=font(FONT_SERIF_I, 38), fill=BROWN2, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(armR=(80, 150), handR="point", armL=(10, 20), turn=0.4, look=(0.5, -0.9), brow=0.5, smile=0.4)
    render_actor(img, draw_buratino, 200, 2224, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ 5: Field of Wonders today = chat

def scene5(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([190, 330, W - 190, 1150], 60, fill=(40, 44, 56), outline=INK, width=8)
    d.rounded_rectangle([215, 380, W - 215, 1100], 30, fill=(226, 236, 244), outline=INK, width=3)
    msgs = [("СЕКРЕТНЫЙ заработок!", 0.05), ("Х2 за неделю", 0.3), ("Только сегодня!", 0.55)]
    for i, (m, st) in enumerate(msgs):
        k = ease_out(seg(p, st, st + 0.08))
        if k > 0:
            yy = 480 + i * 180
            d.rounded_rectangle([250, yy - 55, W - 250 - (80 if i % 2 else 0), yy + 55], 28,
                                fill=(250, 250, 250) if i % 2 else (190, 224, 170), outline=INK, width=3)
            d.text(((250 + W - 250) / 2 - (40 if i % 2 else 0), yy), m, font=font(FONT_SERIF_B, 44), fill=BROWN, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(turn=-0.3, look=(-0.4, -0.9), brow=-0.8, mouth="frown", armL=(10, 20), armR=(10, 20), head=4)
    render_actor(img, draw_buratino, 860, 2224, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ 6: rule

def scene6(t, dur):
    img = paper_bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    for i, (lab, st) in enumerate([("гарантируют?", 0.05), ("торопят?", 0.2), ("секрет?", 0.35)]):
        k = ease_out(seg(p, st, st + 0.08))
        if k > 0:
            yy = 400 + i * 120
            d.rounded_rectangle([200, yy - 44, W - 200, yy + 44], 20, fill=(236, 226, 200), outline=INK, width=4)
            d.text((W / 2, yy), lab, font=font(FONT_SERIF_B, 52), fill=BROWN, anchor="mm")
    k = ease_out(seg(p, 0.5, 0.62))
    if k > 0:
        d.rounded_rectangle([200, 800, W - 200, 800 + 140 * k], 30, fill=(200, 60, 48), outline=INK, width=5)
        if k > 0.9:
            d.text((W / 2, 870), "УХОДИ", font=font(FONT_SERIF_B, 84), fill=(255, 250, 240), anchor="mm", stroke_width=3, stroke_fill=INK)
    k = ease_out(seg(p, 0.7, 0.8))
    if k > 0:
        cx, cy = W / 2, 1090
        d.polygon([(cx - 120, cy - 70), (cx + 120, cy - 70), (cx + 120, cy + 20), (cx, cy + 110), (cx - 120, cy + 20)],
                  fill=(90, 140, 170), outline=INK)
        d.line([(cx - 50, cy), (cx - 12, cy + 40), (cx + 56, cy - 36)], fill=(255, 250, 240), width=14)
        d.text((cx, cy + 160), "реестр Банка России", font=font(FONT_SERIF_B, 40), fill=BROWN, anchor="mm")
    img = img.convert("RGBA")
    pose = dict(armL=(140, 30), armR=(140, 30), smile=0.9, mouth="grin", brow=0.6, look=(0, -0.4), turn=0.1)
    render_actor(img, draw_buratino, 540, 2224, 0.62, pose)
    return img, dict(zoom=1.0, cx=0.5, cy=0.5)


# ================================================================ 7: CTA

@cached
def bg_close():
    return bg_field_day().filter(ImageFilter.GaussianBlur(16))


def scene7(t, dur):
    img = bg_close().copy()
    p = t / dur
    pk = ease(seg(p, 0.08, 0.25))
    pose = dict(turn=lerp(-0.4, 0.0, pk), look=(0, 0), head=lerp(-4, 3, pk), brow=0.6,
                armL=(lerp(10, 26, pk), lerp(20, 170, pk)), handL="point", armR=(20, 40), smile=0.8,
                mouth="grin" if 0.3 < p < 0.7 else "neutral")
    if 0.8 < p < 0.84:
        pose["blink"] = 1.0
    render_actor(img, draw_buratino, 540, 2600, 2.0, pose)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.45)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
