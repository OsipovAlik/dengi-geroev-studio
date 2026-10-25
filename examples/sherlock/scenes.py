import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import *
from chars import *

B = 2  # background supersample


class BD:
    """background drawer at 2x"""

    def __init__(self, w=W, h=H, col=(0, 0, 0, 0)):
        self.img = Image.new("RGBA", (w * B, h * B), col)
        self.d = ImageDraw.Draw(self.img)

    def poly(self, pts, fill, w=4, ol=INK):
        P = [(x * B, y * B) for x, y in pts]
        if fill is not None:
            self.d.polygon(P, fill=fill)
        if w:
            self.d.line(P + [P[0]], fill=ol, width=w * B, joint="curve")

    def rect(self, x0, y0, x1, y1, fill, w=4, ol=INK):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fill, w, ol)

    def line(self, pts, w=4, col=INK):
        self.d.line([(x * B, y * B) for x, y in pts], fill=col, width=max(1, int(w * B)), joint="curve")

    def ell(self, cx, cy, rx, ry, fill, w=4, ol=INK):
        self.d.ellipse([(cx - rx) * B, (cy - ry) * B, (cx + rx) * B, (cy + ry) * B], fill=fill,
                       outline=ol if w else None, width=w * B)

    def paste(self, im, x, y):
        im2 = im.resize((im.width * B, im.height * B), Image.BICUBIC)
        self.img.alpha_composite(im2, (x * B, y * B))

    def done(self):
        return self.img.resize((self.img.width // B, self.img.height // B), Image.LANCZOS)


_cache = {}


def cached(fn):
    def g(*a):
        k = (fn.__name__,) + a
        if k not in _cache:
            _cache[k] = fn(*a)
        return _cache[k]
    return g


# =============================================================== SCENE 1: window

@cached
def bg_window():
    d = BD()
    d.img.paste(vgrad(W * B, H * B, (92, 86, 74), (60, 52, 46)), (0, 0))
    for i in range(0, W, 90):
        d.rect(i, 0, i + 45, H, (84, 96, 90, 255), 0)
        for j in range(30, H, 120):
            d.ell(i + 67, j, 8, 12, (104, 98, 84, 255), 0)
    # window opening
    wx0, wy0, wx1, wy1 = 150, 230, 930, 1380
    sky = vgrad(wx1 - wx0, wy1 - wy0, (150, 168, 164), (206, 202, 182))
    d.paste(sky, wx0, wy0)
    rnd = random.Random(3)
    # far skyline
    x = wx0
    while x < wx1:
        bw = rnd.randint(60, 130)
        bh = rnd.randint(150, 330)
        d.rect(x, wy1 - 280 - bh, x + bw, wy1, (132, 148, 146, 255), 0)
        if rnd.random() < 0.7:
            cxp = x + rnd.randint(10, bw - 30)
            d.rect(cxp, wy1 - 280 - bh - 50, cxp + 22, wy1 - 280 - bh, (132, 148, 146, 255), 0)
        x += bw
    x = wx0 - 20
    while x < wx1:
        bw = rnd.randint(90, 170)
        bh = rnd.randint(80, 220)
        d.rect(x, wy1 - 160 - bh, x + bw, wy1, (102, 118, 118, 255), 0)
        for k in range(rnd.randint(1, 3)):
            cxp = x + rnd.randint(8, bw - 26)
            d.rect(cxp, wy1 - 160 - bh - 60, cxp + 20, wy1 - 160 - bh, (102, 118, 118, 255), 0)
        for wy in range(int(wy1 - 140 - bh), int(wy1), 70):
            for wxp in range(x + 14, x + bw - 20, 40):
                if rnd.random() < 0.3:
                    d.rect(wxp, wy, wxp + 16, wy + 24, (232, 196, 120, 255), 0)
        x += bw
    # frame & mullions
    fc = (70, 52, 38, 255)
    d.rect(wx0 - 30, wy0 - 30, wx1 + 30, wy0, fc, 4)
    d.rect(wx0 - 30, wy0, wx0, wy1, fc, 4)
    d.rect(wx1, wy0, wx1 + 30, wy1, fc, 4)
    d.rect(wx0 - 60, wy1, wx1 + 60, wy1 + 50, (86, 64, 46, 255), 5)
    for xx in (wx0 + (wx1 - wx0) / 3, wx0 + 2 * (wx1 - wx0) / 3):
        d.rect(xx - 9, wy0, xx + 9, wy1, fc, 3)
    for yy in (wy0 + (wy1 - wy0) / 3, wy0 + 2 * (wy1 - wy0) / 3):
        d.rect(wx0, yy - 9, wx1, yy + 9, fc, 3)
    return d.done()


@cached
def curtains():
    d = BD()
    cc = (112, 42, 38, 255)
    d.poly([(0, 150), (230, 150), (200, 600), (150, 1100), (190, 1600), (0, 1600)], cc, 5)
    d.poly([(W, 150), (W - 230, 150), (W - 200, 600), (W - 150, 1100), (W - 190, 1600), (W, 1600)], cc, 5)
    for x0 in (40, 110, 170):
        d.line([(x0, 170), (x0 - 10, 900), (x0 + 10, 1580)], 3, (80, 28, 26, 255))
        d.line([(W - x0, 170), (W - x0 + 10, 900), (W - x0 - 10, 1580)], 3, (80, 28, 26, 255))
    d.rect(0, 120, W, 160, (90, 66, 44, 255), 4)
    return d.done()


@cached
def fog_tex():
    rng = np.random.default_rng(11)
    n = rng.random((12, 40)).astype(np.float32)
    im = Image.fromarray(np.uint8(n * 255)).resize((W * 3, 520), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    a = np.asarray(im).astype(np.float32) / 255.0
    out = np.zeros((520, W * 3, 4), np.uint8)
    out[..., :3] = (226, 224, 210)
    yy = np.linspace(0, 1, 520)[:, None]
    out[..., 3] = np.uint8(np.clip((a - 0.25) * 1.6, 0, 1) * 200 * np.sin(yy * math.pi))
    return Image.fromarray(out, "RGBA")


def scene1(t, dur):
    img = bg_window().copy()
    fog = fog_tex()
    off = int((t * 40) % (W * 2))
    win = Image.new("RGBA", (780, 1150), (0, 0, 0, 0))
    win.alpha_composite(fog.crop((off, 0, off + 780, 520)), (0, 560))
    win.alpha_composite(fog.crop(((off * 2 + 300) % (W * 2), 0, (off * 2 + 300) % (W * 2) + 780, 520)), (0, 300))
    # window pane mask: only inside glass, but drawing over mullions is fine/softened
    img.alpha_composite(win, (150, 230))
    img.alpha_composite(curtains())
    # re-draw mullions over fog (cheap: from cached bg crop of frame)
    p = t / dur
    # counting: finger taps 3 coins
    tap = math.sin(t * 2 * math.pi * 1.6)
    counting = p < 0.62
    look = (0.2, 0.9) if counting else (0.0, 0.0)
    pose = dict(
        armL=(30, 130), itemL="coins", coins=3,
        armR=(30, 158 - 6 * max(0, tap) * counting), handR="point", wrotR=-107,
        brow=-0.3 - 0.9 * ease(seg(p, 0.3, 0.6)), mouth="frown" if p > 0.45 else "neutral",
        look=look, turn=0.15 if counting else 0.05, head=4 * counting - 2 * ease(seg(p, 0.6, 0.8)),
        blink=1.0 if 0.82 < p < 0.85 else 0.0, bob=math.sin(t * 2) * 3,
    )
    if p > 0.68:
        pose["armR"] = (4, 20)
        pose["handR"] = "fist"
        pose["wrotR"] = 0
        pose["coins"] = 3
    render_actor(img, draw_holmes, 540, 2440, 1.62, pose)
    return img, dict(zoom=1.0 + 0.06 * ease(p), cx=0.5, cy=0.42)


# =============================================================== SCENE 2: street

@cached
def street_layers():
    rnd = random.Random(5)
    sky = vgrad(W, H, (52, 70, 76), (110, 118, 112))
    # far row (tile width 1080)
    far = BD(W, 1200)
    x = -20
    while x < W:
        bw = rnd.randint(80, 150)
        bh = rnd.randint(300, 560)
        far.rect(x, 1200 - bh, x + bw, 1200, (70, 88, 92, 255), 0)
        far.rect(x + 20, 1200 - bh - 60, x + 40, 1200 - bh, (70, 88, 92, 255), 0)
        x += bw
    far = far.done()
    # near facades tile
    near = BD(W * 2, 1300)
    x = 0
    cols = [(124, 70, 52, 255), (110, 82, 64, 255), (136, 96, 70, 255), (98, 74, 60, 255)]
    i = 0
    while x < W * 2:
        bw = 360 if x + 360 <= W * 2 else W * 2 - x
        c = cols[i % 4]
        near.rect(x, 80, x + bw, 1300, c, 5)
        for yy in range(130, 1300, 20 * 4):
            near.line([(x + 4, yy), (x + bw - 4, yy)], 1, (0, 0, 0, 40))
        for wy in (180, 470, 760):
            for wxp in (x + 50, x + 210):
                lit = rnd.random() < 0.5
                near.rect(wxp, wy, wxp + 100, wy + 170, (236, 196, 120, 255) if lit else (44, 52, 58, 255), 5)
                near.line([(wxp + 50, wy), (wxp + 50, wy + 170)], 4)
                near.line([(wxp, wy + 85), (wxp + 100, wy + 85)], 4)
                near.rect(wxp - 10, wy + 170, wxp + 110, wy + 186, (190, 176, 150, 255), 4)
        near.rect(x + 120, 1030, x + 240, 1300, (40, 36, 34, 255), 5)
        near.rect(x - 4, 60, x + bw + 4, 90, (80, 66, 56, 255), 4)
        x += bw
        i += 1
    near = near.done()
    # ground
    g = BD(W * 2, 520)
    g.rect(0, 0, W * 2, 60, (120, 116, 106, 255), 4)
    g.img.paste(vgrad(W * 2 * B, 460 * B, (78, 84, 84), (52, 56, 58)), (0, 60 * B))
    for row in range(8):
        y = 80 + row * 52
        off = (row % 2) * 40
        for x in range(-80 + off, W * 2, 80):
            g.ell(x + 40, y + 20, 36, 18 + row * 1.2, (88 + row * 2, 94, 94, 255), 2, (40, 44, 46, 255))
    ground = g.done()
    return sky, far, near, ground


def lamp(img, x, y, t):
    d = BD(220, 1100)
    d.rect(100, 160, 120, 1080, (34, 36, 38, 255), 4)
    d.rect(80, 1040, 140, 1090, (34, 36, 38, 255), 4)
    d.poly([(70, 60), (150, 60), (138, 160), (82, 160)], (240, 210, 140, 255), 5)
    d.poly([(60, 60), (160, 60), (110, 20)], (34, 36, 38, 255), 4)
    im = d.done()
    img.alpha_composite(im, (int(x) - 110, int(y) - 1080))
    glow = radial_glow(500, 500, 250, 250, 250, (255, 214, 140), 0.55 + 0.05 * math.sin(t * 9))
    img.alpha_composite(glow, (int(x) - 250, int(y) - 1080 + 110 - 250))


def scene2(t, dur):
    sky, far, near, ground = street_layers()
    img = sky.copy()
    sp = 150  # px/s near
    o_far = int(t * sp * 0.3) % W
    img.alpha_composite(far.crop((o_far, 0, W, 1200)), (0, 260))
    if o_far:
        img.alpha_composite(far.crop((0, 0, o_far, 1200)), (W - o_far, 260))
    o = int(t * sp) % (W * 2)
    strip = Image.new("RGBA", (W, 1300))
    strip.alpha_composite(near.crop((o, 0, min(W * 2, o + W), 1300)), (0, 0))
    if o + W > W * 2:
        strip.alpha_composite(near.crop((0, 0, o + W - W * 2, 1300)), (W * 2 - o, 0))
    img.alpha_composite(strip, (0, 160))
    og = int(t * sp) % (W * 2)
    gs = Image.new("RGBA", (W, 520))
    gs.alpha_composite(ground.crop((og, 0, min(W * 2, og + W), 520)), (0, 0))
    if og + W > W * 2:
        gs.alpha_composite(ground.crop((0, 0, og + W - W * 2, 520)), (W * 2 - og, 0))
    img.alpha_composite(gs, (0, 1400))
    # lamps scroll
    for k in range(3):
        lx = (k * 700 - t * sp) % 2100 - 300
        lamp(img, lx, 1470, t + k)
    # fog band
    fog = fog_tex()
    fo = int(t * 25) % (W * 2)
    img.alpha_composite(fog.crop((fo, 0, fo + W, 520)), (0, 900))
    # Watson walking (to the right, background scrolls left)
    ph = t * 2 * math.pi * 0.95
    sw = math.sin(ph)
    limp = abs(math.sin(ph)) * 10
    p = t / dur
    pose = dict(
        legL=(22 * sw, max(0, -sw) * 30), legR=(-22 * sw, max(0, sw) * 30),
        armL=(-30, 108), itemL="wallet", wallet_open=1.0,
        armR=(8 + 10 * sw, 8), itemR="cane", cane_len=300,
        hat=True, look=(0.4, 1.0) if p > 0.25 else (0.6, 0.2), brow=0.8, mouth="frown" if p > 0.3 else "neutral",
        head=5 if p > 0.25 else 0, turn=0.3, bob=-limp, face_dir=1,
    )
    render_actor(img, draw_watson, 520, 1700, 1.0, pose)
    # rain
    rnd = random.Random(int(t * FPS))
    rd = ImageDraw.Draw(img)
    for i in range(170):
        x = rnd.randint(-100, W)
        y = rnd.randint(0, H)
        rd.line([(x, y), (x + 14, y + 56)], fill=(200, 214, 220, 120), width=2)
    for i in range(14):
        x = rnd.randint(0, W)
        y = rnd.randint(1500, 1900)
        rd.ellipse([x - 16, y - 4, x + 16, y + 4], outline=(200, 214, 220, 150), width=2)
    return img, dict(zoom=1.04, cx=0.5, cy=0.5)


# =============================================================== SCENE 3: lab

@cached
def bg_lab():
    d = BD()
    d.img.paste(vgrad(W * B, H * B, (118, 120, 104), (78, 74, 62)), (0, 0))
    rnd = random.Random(9)
    for sy in (330, 640, 950):
        d.rect(40, sy, W - 40, sy + 26, (92, 66, 44, 255), 4)
        x = 70
        xmax = 700 if sy == 640 else W - 110
        while x < xmax:
            bw = rnd.randint(36, 70)
            bh = rnd.randint(70, 150)
            col = rnd.choice([(84, 128, 124, 255), (168, 120, 60, 255), (120, 58, 50, 255), (200, 196, 170, 255),
                              (70, 90, 70, 255)])
            if rnd.random() < 0.5:
                d.rect(x, sy - bh, x + bw, sy, col, 3)
                d.rect(x + bw * 0.3, sy - bh - 20, x + bw * 0.7, sy - bh, (200, 190, 170, 255), 3)
            else:
                d.ell(x + bw / 2, sy - bw / 2, bw / 2, bw / 2, col, 3)
                d.rect(x + bw * 0.35, sy - bw - 40, x + bw * 0.65, sy - bw + 4, col, 3)
            x += bw + rnd.randint(8, 30)
    # pinned note
    d.poly([(720, 390), (1030, 372), (1040, 580), (728, 598)], (236, 226, 198, 255), 4)
    d.ell(880, 388, 9, 9, (160, 40, 36, 255), 3)
    note = BD(330, 220)
    f1 = font(FONT_SERIF_BI, 36 * B)
    note.d.text((165 * B, 70 * B), "Ищу соседа!", font=f1, fill=(60, 40, 30), anchor="mm")
    f2 = font(FONT_SERIF_I, 30 * B)
    note.d.text((165 * B, 130 * B), "Аренда пополам.", font=f2, fill=(60, 40, 30), anchor="mm")
    note.d.text((165 * B, 175 * B), "— Ш. Х.", font=f2, fill=(60, 40, 30), anchor="mm")
    n = note.done().rotate(3.5, resample=Image.BICUBIC, expand=True)
    d.paste(n, 716, 362)
    return d.done()


@cached
def lab_table():
    d = BD(W, 560)
    d.rect(-10, 40, W + 10, 120, (110, 78, 50, 255), 5)
    d.rect(-10, 120, W + 10, 560, (86, 60, 40, 255), 5)
    for x in (120, 520, 920):
        d.line([(x, 130), (x, 560)], 3, (60, 40, 28, 255))
    return d.done()


def flask(img, x, y, col, t, k, kind=0):
    d = ImageDraw.Draw(img)
    if kind == 0:
        d.polygon([(x - 18, y - 170), (x + 18, y - 170), (x + 18, y - 100), (x + 70, y), (x - 70, y), (x - 18, y - 100)],
                  fill=(220, 230, 226, 170), outline=INK, width=5)
        d.polygon([(x - 52, y - 34), (x + 52, y - 34), (x + 68, y - 4), (x - 68, y - 4)], fill=col)
    else:
        d.rectangle([x - 22, y - 200, x + 22, y], fill=(220, 230, 226, 170), outline=INK, width=5)
        d.rectangle([x - 17, y - 90, x + 17, y - 5], fill=col)
    rnd = random.Random(k)
    for i in range(6):
        ph = (t * (0.6 + rnd.random()) + rnd.random()) % 1.0
        bx = x + rnd.randint(-14, 14) + math.sin(ph * 9 + i) * 4
        by = y - 20 - ph * 170
        r = 4 + rnd.random() * 6
        d.ellipse([bx - r, by - r, bx + r, by + r], outline=(240, 246, 240, 220), width=3)
    # steam
    for i in range(3):
        ph = (t * 0.4 + i / 3) % 1.0
        sy = y - 200 - ph * 160
        sx = x + math.sin(ph * 6 + i) * 20
        r = 14 + ph * 30
        pass


def scene3(t, dur):
    img = bg_lab().copy()
    p = t / dur
    # Holmes left, Watson right
    reach = ease(seg(p, 0.35, 0.55))
    shake = math.sin(t * 2 * math.pi * 2.2) * 6 * seg(p, 0.55, 0.6) * (1 - seg(p, 0.85, 0.95))
    hp = dict(armL=(-14, 60), handL="fist", armR=(lerp(-6, 15, reach), lerp(70, -38, reach) + shake),
              handR="open", turn=0.6, look=(0.9, 0.1), brow=0.2 if p > 0.4 else -0.2,
              smile=0.5 if p > 0.5 else 0.0, head=-3 + 4 * reach, lean=4 * reach)
    if p < 0.3:  # still busy with experiment, looking down
        hp["look"] = (0.6, 1.0)
        hp["armR"] = (-10, 90 + math.sin(t * 6) * 6)
        hp["head"] = 6
    wp = dict(armR=(4, 6), itemR="cane", cane_len=300, armL=(lerp(-6, 15, reach), lerp(40, -46, reach) - shake),
              handL="open", turn=-0.6, look=(-0.9, 0.1), smile=0.8 if p > 0.5 else 0.3, brow=0.4,
              head=3 - 6 * reach, lean=-4 * reach)
    render_actor(img, draw_holmes, 260, 1800, 0.98, hp)
    render_actor(img, draw_watson, 830, 1800, 0.98, wp)
    img.alpha_composite(lab_table(), (0, 1400))
    flask(img, 140, 1460, (90, 170, 150, 255), t, 1, 0)
    flask(img, 300, 1460, (200, 140, 60, 255), t, 2, 1)
    flask(img, 930, 1460, (170, 70, 60, 255), t, 3, 0)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.55)


# =============================================================== SCENE 4: Baker Street

@cached
def bg_baker():
    d = BD()
    d.img.paste(vgrad(W * B, H * B, (120, 130, 126), (150, 150, 136)), (0, 0))
    # brick facade
    d.rect(-10, 0, W + 10, 1260, (128, 76, 56, 255), 0)
    for row, y in enumerate(range(0, 1260, 34)):
        off = (row % 2) * 40
        d.line([(0, y), (W, y)], 2, (100, 56, 42, 255))
        for x in range(off, W, 80):
            d.line([(x, y), (x, y + 34)], 2, (100, 56, 42, 255))
    # windows
    for wx in (90, 790):
        for wy in (160, 560):
            d.rect(wx - 14, wy - 14, wx + 214, wy + 304, (220, 210, 186, 255), 5)
            d.rect(wx, wy, wx + 200, wy + 290, (58, 70, 74, 255), 5)
            d.line([(wx + 100, wy), (wx + 100, wy + 290)], 6)
            d.line([(wx, wy + 145), (wx + 200, wy + 145)], 6)
            d.rect(wx - 24, wy + 290, wx + 224, wy + 312, (220, 210, 186, 255), 4)
    # door frame
    d.rect(370, 520, 710, 1270, (226, 216, 192, 255), 5)
    d.poly(ell_pts(540, 560, 150, 110, 30, 180, 360), (240, 214, 150, 255), 5)
    for a in range(200, 345, 24):
        r = math.radians(a)
        d.line([(540, 560), (540 + 148 * math.cos(r), 560 + 108 * math.sin(r))], 3)
    d.rect(390, 560, 690, 1270, (246, 214, 150, 255), 5)  # warm interior behind door
    d.rect(330, 500, 750, 530, (226, 216, 192, 255), 5)
    # steps
    for i, y in enumerate((1270, 1320, 1370)):
        d.rect(330 - i * 40, y, 750 + i * 40, y + 50, (186, 180, 166, 255), 4)
    # railings
    for x in list(range(40, 300, 34)) + list(range(800, 1060, 34)):
        d.line([(x, 1180), (x, 1420)], 6, (30, 30, 32, 255))
        d.poly([(x - 8, 1186), (x + 8, 1186), (x, 1166)], (30, 30, 32, 255), 2)
    d.line([(30, 1200), (300, 1200)], 8, (30, 30, 32, 255))
    d.line([(790, 1200), (1070, 1200)], 8, (30, 30, 32, 255))
    # pavement
    d.rect(-10, 1420, W + 10, H + 10, (150, 146, 134, 255), 4)
    for y in range(1480, H, 110):
        d.line([(0, y), (W, y)], 3, (110, 106, 98, 255))
    return d.done()


def door_panel(open_):
    w = int(300 * (1 - 0.82 * open_))
    d = BD(310, 720)
    d.rect(2, 2, max(8, w), 708, (34, 34, 36, 255), 5)
    if w > 60:
        for yy in (60, 380):
            d.rect(30 * w / 300, yy, w - 30 * w / 300, yy + 270, (46, 46, 50, 255), 4)
        d.ell(w - 40 * w / 300 - 4, 360, 12, 12, (200, 170, 80, 255), 3)
    return d.done()


def coin(d, x, y, s=1.0):
    d.ellipse([x - 16 * s, y - 8 * s, x + 16 * s, y + 8 * s], fill=(214, 170, 70), outline=INK, width=3)
    d.ellipse([x - 8 * s, y - 3 * s, x + 8 * s, y + 3 * s], fill=(244, 210, 116))


def scene4(t, dur):
    img = bg_baker().copy()
    p = t / dur
    op = ease(seg(p, 0.02, 0.22))
    hud = dict(armL=(14, 30), armR=(16, 54), itemR="keys", keys_swing=math.sin(t * 9) * 25 * (1 - seg(p, 0.5, 0.6)),
               smile=0.9, turn=0.0, look=(0, 0.6), head=math.sin(t * 3) * 3)
    render_actor(img, draw_hudson, 540, 1268, 0.62, hud)
    img.alpha_composite(door_panel(op), (390, 560))
    # plaque 221Б
    dd = ImageDraw.Draw(img)
    dd.rounded_rectangle([470, 470, 610, 520], 8, fill=(200, 170, 90), outline=INK, width=4)
    dd.text((540, 495), "221Б", font=font(FONT_SERIF_B, 40), fill=(40, 28, 20), anchor="mm")
    # tenants in foreground
    nod = math.sin(seg(p, 0.75, 0.9) * math.pi) * 6
    hp = dict(armR=(-34, 100), itemR="coins", coins=3 if p < 0.55 else 2, armL=(4, 10), turn=0.5,
              look=(0.8, -0.2), smile=0.5, head=nod, brow=0.2)
    wp = dict(armL=(-34, 100), itemL="coins", coinsL=3 if p < 0.55 else 2, armR=(4, 6), itemR="cane", cane_len=280,
              turn=-0.5, look=(-0.8, -0.2), smile=0.8, head=-nod, hat=True)
    render_actor(img, draw_holmes, 240, 2160, 0.92, hp)
    render_actor(img, draw_watson, 850, 2160, 0.92, wp)
    # one coin from each flies to Mrs Hudson
    k = seg(p, 0.5, 0.7)
    if 0 < k < 1:
        dd = ImageDraw.Draw(img)
        for (sx, sy) in ((330, 1540), (760, 1540)):
            ex, ey = 600, 1000
            x = lerp(sx, ex, k)
            y = lerp(sy, ey, k) - math.sin(k * math.pi) * 260
            coin(dd, x, y, 1.1)
    return img, dict(zoom=1.0 + 0.04 * ease(p), cx=0.5, cy=0.52)


# =============================================================== SCENE 5: desk & pie chart

@cached
def bg_desk():
    d = BD()
    d.img.paste(vgrad(W * B, H * B, (96, 66, 44), (70, 46, 30)), (0, 0))
    for y in range(0, H, 70):
        d.line([(0, y + 10), (W, y + 30)], 3, (84, 56, 36, 255))
    # parchment
    d.poly([(90, 380), (1000, 350), (1010, 1500), (80, 1530)], (238, 224, 190, 255), 6)
    d.line([(110, 1480), (990, 1460)], 2, (210, 190, 150, 255))
    # inkpot
    d.ell(930, 1660, 70, 26, (30, 30, 40, 255), 4)
    d.rect(870, 1580, 990, 1660, (34, 34, 46, 255), 4)
    d.ell(930, 1580, 60, 20, (60, 60, 80, 255), 4)
    # book
    d.poly([(40, 1600), (420, 1580), (440, 1840), (60, 1870)], (110, 40, 36, 255), 5)
    d.line([(60, 1630), (420, 1612)], 3, (220, 200, 160, 255))
    return d.done()


def candle(img, t):
    d = ImageDraw.Draw(img)
    x, y = 150, 300
    d.rectangle([x - 34, y, x + 34, y + 260], fill=(240, 232, 210), outline=INK, width=5)
    d.ellipse([x - 70, y + 240, x + 70, y + 290], fill=(150, 120, 60), outline=INK, width=5)
    fl = 1 + 0.12 * math.sin(t * 17) + 0.08 * math.sin(t * 29)
    d.polygon([(x - 16, y - 6), (x, y - 70 * fl), (x + 16, y - 6), (x, y + 6)], fill=(255, 200, 90), outline=(200, 110, 40), width=3)
    img.alpha_composite(radial_glow(700, 700, 350, 350, 340 * fl, (255, 190, 110), 0.55), (x - 350, y - 380))


def scene5(t, dur):
    img = bg_desk().copy()
    candle(img, t)
    p = t / dur
    d = ImageDraw.Draw(img)
    cx, cy, r = 545, 860, 300
    circ = ease(seg(p, 0.03, 0.35))
    ink = (54, 36, 26)
    if circ > 0:
        d.arc([cx - r, cy - r, cx + r, cy + r], -90, -90 + 360 * circ, fill=ink, width=10)
    wedge = ease(seg(p, 0.38, 0.55))
    if wedge > 0:
        a = -90 + 108  # 30%
        d.line([(cx, cy), (cx, cy - r)], fill=ink, width=8)
        ex, ey = cx + r * math.cos(math.radians(a)) * wedge, cy + r * math.sin(math.radians(a)) * wedge
        d.line([(cx, cy), (ex, ey)], fill=ink, width=8)
    hatch = ease(seg(p, 0.5, 0.72))
    if hatch > 0:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.pieslice([cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6], -90, 18, fill=(196, 92, 60, int(200 * hatch)))
        img.alpha_composite(layer)
        d = ImageDraw.Draw(img)
        lx, ly = cx + 0.55 * r * math.cos(math.radians(-36)), cy + 0.55 * r * math.sin(math.radians(-36))
        d.text((lx, ly - 30), "ЖИЛЬЁ", font=font(FONT_SERIF_B, 44), fill=(54, 30, 22, int(255 * hatch)), anchor="mm")
        d.text((lx, ly + 28), "30%", font=font(FONT_SERIF_B, 66), fill=(54, 30, 22, int(255 * hatch)), anchor="mm")
    rest = seg(p, 0.7, 0.8)
    if rest > 0:
        d.text((cx - 70, cy + 110), "всё остальное", font=font(FONT_SERIF_I, 46), fill=(70, 50, 36, int(255 * rest)), anchor="mm")
        d.text((cx - 70, cy + 170), "70%", font=font(FONT_SERIF_B, 54), fill=(70, 50, 36, int(255 * rest)), anchor="mm")
    # quill tip position
    if p < 0.35:
        a = math.radians(-90 + 360 * circ)
        tx, ty = cx + r * math.cos(a), cy + r * math.sin(a)
    elif p < 0.55:
        a = math.radians(18)
        tx, ty = cx + r * math.cos(a) * wedge, cy + r * math.sin(a) * wedge
    else:
        k = ease(seg(p, 0.55, 0.66))
        tx, ty = lerp(cx + r * math.cos(math.radians(18)), 1250, k), lerp(cy + r * math.sin(math.radians(18)), 1900, k)
    if p < 0.66:
        quill_hand(img, tx, ty)
    return img, dict(zoom=1.0 + 0.05 * ease(p), cx=0.5, cy=0.46)


def quill_hand(img, tx, ty):
    lay = BD(W, H)
    # quill feather
    qa = math.radians(-62)
    L = 360
    qx, qy = tx + math.cos(qa) * L, ty + math.sin(qa) * L
    lay.poly([(tx, ty), (qx - 40, qy + 30), (qx + 20, qy - 20), (tx + 10, ty - 6)], (246, 240, 226, 255), 4)
    lay.line([(tx, ty), (qx - 8, qy + 4)], 3, (150, 130, 100, 255))
    # sleeve + hand from right bottom
    hx, hy = tx + 70, ty - 40
    lay.poly([(hx + 20, hy - 10), (W + 200, hy + 340), (W + 200, hy + 560), (hx + 10, hy + 90)], HOLMES["coat"], 6)
    lay.poly([(hx + 4, hy + 10), (hx + 60, hy - 4), (hx + 70, hy + 80), (hx + 14, hy + 96)], WHITE, 4)
    lay.ell(hx - 12, hy + 46, 54, 46, SKIN, 5)
    lay.ell(hx - 52, hy + 30, 22, 16, SKIN, 4)
    img.alpha_composite(lay.done())


# =============================================================== SCENE 6: sitting room

@cached
def bg_room():
    d = BD()
    d.img.paste(vgrad(W * B, H * B, (96, 64, 52), (66, 44, 36)), (0, 0))
    for i in range(0, W, 120):
        d.rect(i, 0, i + 60, 1500, (106, 74, 60, 255), 0)
    d.rect(0, 1380, W, 1440, (70, 48, 34, 255), 4)
    d.rect(0, 1440, W, H, (90, 62, 44, 255), 4)
    for y in range(1470, H, 60):
        d.line([(0, y), (W, y)], 3, (70, 48, 34, 255))
    # rug
    d.ell(540, 1720, 520, 150, (120, 50, 44, 255), 5)
    d.ell(540, 1720, 440, 110, (150, 100, 60, 255), 4)
    # fireplace
    d.rect(100, 760, 620, 1420, (196, 186, 166, 255), 6)
    d.rect(70, 720, 650, 780, (176, 166, 146, 255), 6)
    d.rect(210, 900, 510, 1420, (36, 26, 22, 255), 6)
    # mantel clock & candles
    d.rect(300, 600, 420, 720, (110, 70, 40, 255), 5)
    d.ell(360, 650, 40, 40, (236, 226, 200, 255), 4)
    d.line([(360, 650), (360, 622)], 4)
    d.line([(360, 650), (380, 660)], 4)
    for x in (140, 580):
        d.rect(x - 12, 620, x + 12, 720, (240, 232, 210, 255), 4)
    # painting
    d.rect(170, 260, 550, 540, (150, 110, 50, 255), 8)
    d.rect(200, 290, 520, 510, (110, 130, 120, 255), 4)
    d.poly([(200, 510), (300, 400), (380, 470), (450, 380), (520, 510)], (80, 96, 84, 255), 0)
    # window on right
    d.rect(720, 260, 1000, 900, (60, 80, 92, 255), 7)
    d.line([(860, 260), (860, 900)], 7)
    d.line([(720, 580), (1000, 580)], 7)
    d.poly([(690, 220), (780, 220), (760, 1000), (680, 1000)], (60, 90, 84, 255), 5)
    d.poly([(1030, 220), (940, 220), (960, 1000), (1040, 1000)], (60, 90, 84, 255), 5)
    # bookshelf
    d.rect(700, 1020, 1060, 1400, (86, 58, 36, 255), 5)
    rnd = random.Random(4)
    for sy in (1110, 1210, 1310, 1395):
        d.line([(700, sy), (1060, sy)], 5)
        x = 712
        while x < 1040:
            bw = rnd.randint(16, 30)
            d.rect(x, sy - rnd.randint(60, 85), x + bw, sy, rnd.choice([(120, 50, 40, 255), (60, 80, 70, 255), (150, 120, 70, 255), (70, 60, 90, 255)]), 2)
            x += bw + 2
    return d.done()


def fire(img, t):
    d = ImageDraw.Draw(img)
    d.rectangle([230, 1360, 490, 1400], fill=(60, 40, 30), outline=INK, width=4)
    rnd = random.Random(int(t * 12))
    for k, (col, hm, wm) in enumerate((((200, 70, 36), 1.0, 1.0), ((246, 146, 50), 0.75, 0.7), ((255, 222, 120), 0.45, 0.45))):
        pts = [(250 + (1 - wm) * 110, 1370)]
        n = 7
        for i in range(n):
            x = 250 + (1 - wm) * 110 + (220 * wm) * (i + 0.5) / n
            h = (150 + 110 * math.sin(t * 7 + i * 1.7 + k) + rnd.random() * 40) * hm
            pts.append((x - 8, 1370 - h * 0.6))
            pts.append((x, 1370 - h))
            pts.append((x + 8, 1370 - h * 0.6))
        pts.append((470 - (1 - wm) * 110, 1370))
        d.polygon(pts, fill=col)
    g = 0.55 + 0.1 * math.sin(t * 11) + 0.05 * math.sin(t * 23)
    img.alpha_composite(radial_glow(1100, 1100, 550, 550, 560, (255, 170, 90), g), (360 - 550, 1250 - 550))


@cached
def armchair_back():
    d = BD(460, 640)
    d.poly([(30, 600), (20, 120), (60, 30), (400, 30), (440, 120), (430, 600)], (60, 96, 86, 255), 6)
    for x in (130, 230, 330):
        for y in (140, 260, 380):
            d.ell(x, y, 7, 7, (40, 66, 60, 255), 0)
    return d.done()


@cached
def armchair_front():
    d = BD(560, 480)
    d.poly([(0, 60), (90, 40), (110, 470), (10, 470)], (70, 110, 98, 255), 6)
    d.poly([(560, 60), (470, 40), (450, 470), (550, 470)], (70, 110, 98, 255), 6)
    d.ell(50, 60, 54, 40, (80, 124, 110, 255), 5)
    d.ell(510, 60, 54, 40, (80, 124, 110, 255), 5)
    d.rect(100, 300, 460, 470, (66, 104, 92, 255), 6)
    return d.done()


def scene6(t, dur):
    img = bg_room().copy()
    fire(img, t)
    p = t / dur
    # armchair & Watson
    img.alpha_composite(armchair_back(), (80, 1080))
    write = math.sin(t * 9) * 5
    look_up = 0.45 < p < 0.75
    wp = dict(sit=True, notebook=True, armR=(-14, 98 + write), itemR="pencil", armL=(-12, 84), handL="fist",
              look=(0.8, -0.2) if look_up else (0.2, 1.0), head=6 if not look_up else -4, turn=0.4,
              smile=0.9 if look_up else 0.4, brow=0.3)
    render_actor(img, draw_watson, 310, 1700, 0.7, wp)
    img.alpha_composite(armchair_front(), (30, 1300))
    # Holmes with violin
    bow = math.sin(t * 2 * math.pi * 0.7)
    hp = dict(violin=True, armL=(20, -110), handL="fist", armR=(62 + 8 * bow, 150 - 16 * bow), itemR="bow", blink=1.0, turn=-0.35, head=-12 + math.sin(t * 1.4) * 4, smile=0.6,
              lean=-4 + math.sin(t * 1.4) * 2)
    render_actor(img, draw_holmes, 780, 1760, 0.78, hp)
    # warm flicker overlay
    return img, dict(zoom=1.02 + 0.04 * ease(p), cx=0.5 - 0.05 * p, cy=0.55)


# =============================================================== SCENE 7: close-up + CTA

@cached
def bg_close():
    im = bg_room().copy()
    return im.filter(ImageFilter.GaussianBlur(18))


def scene7(t, dur):
    img = bg_close().copy()
    fire_glow = 0.35 + 0.08 * math.sin(t * 9)
    img.alpha_composite(radial_glow(1200, 1200, 600, 600, 700, (255, 170, 90), fire_glow), (-500, 600))
    p = t / dur
    turn_k = ease(seg(p, 0.0, 0.18))
    point_k = ease(seg(p, 0.15, 0.32))
    hp = dict(turn=lerp(-0.7, 0.0, turn_k), look=(lerp(-1, 0, turn_k), 0), head=lerp(-6, 0, turn_k),
              blink=0.0 if p < 0.2 else 0.42, brow=-0.5 * turn_k, smile=0.8 * turn_k,
              armR=(lerp(-6, 20, point_k), lerp(10, 170, point_k)), handR="point", wrotR=-10 * point_k, armL=(4, 6))
    if 0.6 < p < 0.63:
        hp["blink"] = 1.0
    render_actor(img, draw_holmes, 520, 3520, 2.55, hp)
    return img, dict(zoom=1.0 + 0.1 * ease(p), cx=0.5, cy=0.38)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
