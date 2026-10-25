import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import *
from chars3 import *

B = 2


class BD:
    def __init__(self, w=W, h=H, col=(0, 0, 0, 0), opaque=False):
        if opaque:
            self.img = Image.new("RGB", (w * B, h * B), col[:3])
            self.d = ImageDraw.Draw(self.img, "RGBA")
        else:
            self.img = Image.new("RGBA", (w * B, h * B), col)
            self.d = ImageDraw.Draw(self.img)

    def poly(self, pts, fill, w=4, ol=INK):
        Pp = [(x * B, y * B) for x, y in pts]
        if fill is not None:
            self.d.polygon(Pp, fill=fill)
        if w:
            self.d.line(Pp + [Pp[0]], fill=ol, width=w * B, joint="curve")

    def rect(self, x0, y0, x1, y1, fill, w=4, ol=INK):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fill, w, ol)

    def line(self, pts, w=4, col=INK):
        self.d.line([(x * B, y * B) for x, y in pts], fill=col, width=max(1, int(w * B)), joint="curve")

    def ell(self, cx, cy, rx, ry, fill, w=4, ol=INK):
        self.d.ellipse([(cx - rx) * B, (cy - ry) * B, (cx + rx) * B, (cy + ry) * B], fill=fill,
                       outline=ol if w else None, width=w * B)

    def text(self, x, y, s, path, size, fill, anchor="mm"):
        self.d.text((x * B, y * B), s, font=font(path, size * B), fill=fill, anchor=anchor)

    def done(self):
        return self.img.resize((self.img.width // B, self.img.height // B), Image.LANCZOS).convert("RGBA")


_cache = {}


def cached(fn):
    def g(*a):
        k = (fn.__name__,) + a
        if k not in _cache:
            _cache[k] = fn(*a)
        return _cache[k]
    return g


def darken(img, amount, col=(20, 18, 24)):
    lay = Image.new("RGBA", img.size, col + (int(255 * amount),))
    img.alpha_composite(lay)


def wallpaper(d, x0, y0, x1, y1, base, stripe, rnd, peel=True):
    d.rect(x0, y0, x1, y1, base, 0)
    for x in range(x0, x1, 64):
        d.rect(x + 20, y0, x + 30, y1, stripe, 0)
        for y in range(y0 + 30, y1, 110):
            d.ell(x + 52, y, 6, 9, stripe, 0)
    if peel:
        for _ in range(7):
            px, py = rnd.randint(x0 + 40, x1 - 120), rnd.randint(y0 + 40, y1 - 160)
            w_, h_ = rnd.randint(60, 140), rnd.randint(70, 160)
            d.poly([(px, py), (px + w_, py + 10), (px + w_ - 20, py + h_), (px + 10, py + h_ - 20)],
                   (196, 184, 150, 255), 3, (120, 104, 70, 255))
        for _ in range(5):  # damp stains
            px, py = rnd.randint(x0, x1), rnd.randint(y0, y1)
            d.ell(px, py, rnd.randint(40, 110), rnd.randint(30, 80), (120, 104, 70, 70), 0)




def light_beam(img, pts, a):
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon(pts, fill=(255, 240, 200, int(255 * a)))
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(30)))



def layer_draw(img):
    lay = Image.new("RGBA", img.size)
    return lay, ImageDraw.Draw(lay)



def dust(img, t, x0, x1, y0, y1, n=26, seed=1):
    lay, d = layer_draw(img)
    rnd = random.Random(seed)
    for i in range(n):
        bx, by = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        x = bx + math.sin(t * 0.7 + i) * 30
        y = by + (t * 18 + i * 37) % (y1 - y0) - (y1 - y0) / 2
        y = y0 + (y - y0) % (y1 - y0)
        r = rnd.uniform(1.5, 3.5)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 246, 220, 140))
    img.alpha_composite(lay)



def poof(img, x, y, k):
    if not (0 < k < 1):
        return
    lay, d = layer_draw(img)
    for i in range(8):
        a = i * math.pi / 4
        r = 20 + 70 * k
        cx, cy = x + math.cos(a) * r, y + math.sin(a) * r * 0.7
        s = 22 * (1 - k)
        d.ellipse([cx - s, cy - s, cx + s, cy + s], fill=(240, 232, 214, int(220 * (1 - k))))
    img.alpha_composite(lay)



def silver(d, x, y, r=34, label=None):
    d.ellipse([x - r, y - r * 0.45, x + r, y + r * 0.45], fill=(206, 208, 204), outline=INK, width=4)
    d.ellipse([x - r * 0.6, y - r * 0.25, x + r * 0.6, y + r * 0.25], outline=(150, 150, 146), width=3)



@cached
def counter():
    d = BD(W, 560)
    d.rect(-10, 0, W + 10, 70, (120, 86, 56, 255), 6)
    d.rect(-10, 70, W + 10, 560, (96, 66, 44, 255), 6)
    for x in (180, 540, 900):
        d.rect(x - 120, 130, x + 120, 480, (104, 72, 48, 255), 4)
    return d.done()

