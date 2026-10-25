import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 24
SS = 2  # supersampling for characters
INK = (43, 29, 20, 255)

FONT_CAP = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONT_SERIF_B = "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf"
FONT_SERIF_I = "/usr/share/fonts/truetype/freefont/FreeSerifItalic.ttf"
FONT_SERIF_BI = "/usr/share/fonts/truetype/freefont/FreeSerifBoldItalic.ttf"

_fc = {}
def font(path, size):
    k = (path, int(size))
    if k not in _fc:
        _fc[k] = ImageFont.truetype(path, int(size))
    return _fc[k]

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def lerp(a, b, t):
    return a + (b - a) * t

def ease(t):
    t = clamp(t)
    return t * t * (3 - 2 * t)

def ease_out(t):
    t = clamp(t)
    return 1 - (1 - t) ** 3

def seg(t, a, b):
    """0..1 progress of t inside [a,b]"""
    if b <= a:
        return 1.0 if t >= b else 0.0
    return clamp((t - a) / (b - a))

def mix(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(len(c1)))

def ell_pts(cx, cy, rx, ry, n=36, a0=0, a1=360):
    pts = []
    for i in range(n + 1 if a1 - a0 < 360 else n):
        a = math.radians(a0 + (a1 - a0) * i / (n if a1 - a0 < 360 else n))
        pts.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
    return pts


class Ctx:
    """Draws in character-local units onto a supersampled layer, with a transform stack."""

    def __init__(self, draw, ox, oy, s, flip=False):
        self.d = draw
        self.ox, self.oy, self.s = ox, oy, s
        self.flip = flip
        self.stack = [(1.0, 0.0, 0.0, 0.0, 1.0, 0.0)]  # a b c / d e f  : x'=a x + b y + c

    # --- transforms
    def push(self, tx=0.0, ty=0.0, ang=0.0, sc=1.0):
        a, b, c, d, e, f = self.stack[-1]
        r = math.radians(ang)
        ca, sa = math.cos(r) * sc, math.sin(r) * sc
        # local M = [ca -sa tx; sa ca ty]
        na = a * ca + b * sa
        nb = -a * sa + b * ca
        nc = a * tx + b * ty + c
        nd = d * ca + e * sa
        ne = -d * sa + e * ca
        nf = d * tx + e * ty + f
        self.stack.append((na, nb, nc, nd, ne, nf))

    def pop(self):
        self.stack.pop()

    def P(self, x, y):
        a, b, c, d, e, f = self.stack[-1]
        lx = a * x + b * y + c
        ly = d * x + e * y + f
        if self.flip:
            lx = -lx
        return ((self.ox + lx * self.s) * SS, (self.oy + ly * self.s) * SS)

    def W_(self, w):
        a, b, c, d, e, f = self.stack[-1]
        sc = math.hypot(a, d)
        return max(1, int(w * self.s * SS * sc))

    # --- primitives
    def poly(self, pts, fill, w=5, ol=INK):
        P = [self.P(x, y) for x, y in pts]
        if fill is not None:
            self.d.polygon(P, fill=fill)
        if w and ol:
            self.d.line(P + [P[0]], fill=ol, width=self.W_(w), joint="curve")
            r = self.W_(w) / 2
            for p in P[:: max(1, len(P) // 12)]:
                pass

    def line(self, pts, w=5, col=INK):
        P = [self.P(x, y) for x, y in pts]
        self.d.line(P, fill=col, width=self.W_(w), joint="curve")
        r = self.W_(w) / 2
        for p in (P[0], P[-1]):
            self.d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=col)

    def ellipse(self, cx, cy, rx, ry, fill, w=5, ol=INK, n=40):
        self.poly(ell_pts(cx, cy, rx, ry, n), fill, w, ol)

    def circle(self, cx, cy, r, fill, w=5, ol=INK):
        self.ellipse(cx, cy, r, r, fill, w, ol, n=max(16, int(r * self.s * 0.6) + 12))

    def limb(self, x1, y1, x2, y2, w1, w2, fill, w=5, ol=INK):
        ang = math.atan2(y2 - y1, x2 - x1)
        nx, ny = -math.sin(ang), math.cos(ang)
        pts = []
        # cap at start
        for i in range(9):
            a = ang + math.pi / 2 + math.pi * i / 8
            pts.append((x1 + math.cos(a) * w1 / 2, y1 + math.sin(a) * w1 / 2))
        for i in range(9):
            a = ang - math.pi / 2 + math.pi * i / 8
            pts.append((x2 + math.cos(a) * w2 / 2, y2 + math.sin(a) * w2 / 2))
        self.poly(pts, fill, w, ol)

    def text(self, x, y, s, size, fill, path=FONT_SERIF_B):
        p = self.P(x, y)
        f = font(path, size * self.s * SS)
        self.d.text(p, s, font=f, fill=fill, anchor="mm")


def bezier(p0, p1, p2, p3=None, n=16):
    pts = []
    for i in range(n + 1):
        t = i / n
        if p3 is None:
            x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
            y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
        else:
            x = (1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t * t * p2[0] + t ** 3 * p3[0]
            y = (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t * t * p2[1] + t ** 3 * p3[1]
        pts.append((x, y))
    return pts


def render_actor(canvas, drawfn, x, y, s, pose, flip=False, bbox=(-560, -1320, 560, 80)):
    """Draw an actor whose feet are at canvas (x,y) with scale s."""
    bx0, by0, bx1, by1 = bbox
    if flip:
        bx0, bx1 = -bx1, -bx0
    rx0 = int(max(0, x + bx0 * s))
    ry0 = int(max(0, y + by0 * s))
    rx1 = int(min(canvas.width, x + bx1 * s))
    ry1 = int(min(canvas.height, y + by1 * s))
    if rx1 <= rx0 or ry1 <= ry0:
        return
    lw, lh = (rx1 - rx0) * SS, (ry1 - ry0) * SS
    layer = Image.new("RGBA", (lw, lh), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ctx = Ctx(d, x - rx0, y - ry0, s, flip)
    drawfn(ctx, pose)
    layer = layer.resize((rx1 - rx0, ry1 - ry0), Image.LANCZOS)
    canvas.alpha_composite(layer, (rx0, ry0))


# ---------- global looks ----------
_rng = np.random.default_rng(7)

def make_paper():
    n = _rng.normal(0, 1, (H // 4, W // 4)).astype(np.float32)
    img = Image.fromarray(np.uint8(np.clip(128 + n * 30, 0, 255))).resize((W, H), Image.BICUBIC)
    img = img.filter(ImageFilter.GaussianBlur(2))
    a = (np.asarray(img).astype(np.float32) - 128) / 128.0
    fine = _rng.normal(0, 1, (H, W)).astype(np.float32) * 0.35
    tex = a * 0.6 + fine * 0.25
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx = (xx - W / 2) / (W / 2)
    dy = (yy - H / 2) / (H / 2)
    vig = np.clip(1 - 0.32 * (dx ** 2 * 0.9 + dy ** 2 * 0.6), 0.55, 1)
    return tex, vig

PAPER, VIG = None, None
GRAINS = None

def finish(frame_rgb, t_idx, warm=(1.04, 1.0, 0.92)):
    """paper texture, vignette, grain, colour grade. frame_rgb PIL RGB -> PIL RGB"""
    global PAPER, VIG, GRAINS
    if PAPER is None:
        PAPER, VIG = make_paper()
        GRAINS = [_rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32) for _ in range(6)]
    a = np.asarray(frame_rgb).astype(np.float32)
    g = GRAINS[t_idx % 6]
    g = np.repeat(np.repeat(g, 2, 0), 2, 1)
    lum = PAPER * 9 + g * 5
    a = a * VIG[..., None] + lum[..., None]
    a[..., 0] *= warm[0]
    a[..., 1] *= warm[1]
    a[..., 2] *= warm[2]
    return Image.fromarray(np.uint8(np.clip(a, 0, 255)))


def camera(img, zoom=1.0, cx=0.5, cy=0.5, rot=0.0):
    if abs(zoom - 1) < 1e-3 and abs(rot) < 1e-3:
        return img
    w, h = img.size
    cw, ch = w / zoom, h / zoom
    x0 = clamp(cx * w - cw / 2, 0, w - cw)
    y0 = clamp(cy * h - ch / 2, 0, h - ch)
    return img.transform((w, h), Image.EXTENT, (x0, y0, x0 + cw, y0 + ch), Image.BICUBIC)


def vgrad(w, h, top, bot):
    a = np.linspace(0, 1, h)[:, None, None]
    c = np.array(top, np.float32)[None, None, :] * (1 - a) + np.array(bot, np.float32)[None, None, :] * a
    c = np.repeat(c, w, axis=1)
    return Image.fromarray(np.uint8(c)).convert("RGBA")


def radial_glow(w, h, cx, cy, r, col, strength=1.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    a = np.clip(1 - d, 0, 1) ** 2 * strength
    out = np.zeros((h, w, 4), np.float32)
    out[..., :3] = col
    out[..., 3] = a * 255
    return Image.fromarray(np.uint8(np.clip(out, 0, 255)), "RGBA")


def add_glow(img, glow):
    """additive-ish screen of glow layer onto RGBA image"""
    a = np.asarray(img).astype(np.float32)
    g = np.asarray(glow).astype(np.float32)
    al = g[..., 3:4] / 255.0
    a[..., :3] = 255 - (255 - a[..., :3]) * (1 - al * g[..., :3] / 255.0)
    return Image.fromarray(np.uint8(np.clip(a, 0, 255)), "RGBA")
