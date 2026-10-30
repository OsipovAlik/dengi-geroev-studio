import math, random
from base import *
from chars15 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)
RED = (170, 40, 32)


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
            d.text((x, y + (i - (len(lines) - 1) / 2) * size * 1.25), ln, font=f, fill=BROWN, anchor="mm")
    img.alpha_composite(lay)


def card(img, y, text, k, fill=(250, 244, 230), col=BROWN, size=54, h=110, x0=100, x1=W - 100, bold=True):
    if k <= 0:
        return
    d = ImageDraw.Draw(img)
    k = ease_out(k)
    d.rounded_rectangle([x0, y - h / 2 * k, x1, y + h / 2 * k], 26, fill=fill, outline=INK, width=5)
    if k > 0.9:
        d.text(((x0 + x1) / 2, y), text, font=font(FONT_SERIF_B if bold else FONT_SERIF_I, size), fill=col, anchor="mm")


def paper():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


@cached
def bg_hut():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (206, 170, 120), (150, 112, 76)), (0, 0))
    for y in range(0, 1500, 150):
        d.rect(-10, y, W + 10, y + 150, None, 3, (120, 88, 58, 255))
    d.rect(-10, 1560, W + 10, H + 10, (110, 80, 54, 255), 6)
    d.rect(700, 360, 980, 640, (190, 220, 236, 255), 8)
    d.line([(840, 360), (840, 640)], 6)
    d.line([(700, 500), (980, 500)], 6)
    return d.done()


@cached
def bg_hall():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (120, 60, 80), (70, 34, 56)), (0, 0))
    for x in (120, 960):
        d.rect(x - 50, 0, x + 50, 1560, (210, 190, 140, 255), 6)
    d.rect(-10, 1560, W + 10, H + 10, (150, 40, 50, 255), 6)
    d.poly([(300, 300), (780, 300), (840, 520), (240, 520)], (236, 200, 90, 255), 5)
    return d.done()


@cached
def bg_street():
    d = BD(opaque=True)
    d.img.paste(vgrad(W * B, H * B, (170, 210, 236), (240, 236, 214)), (0, 0))
    d.rect(-10, 1560, W + 10, H + 10, (150, 140, 120, 255), 6)
    return d.done()


def burst(img, x, y, txt, k, size=84, col=(220, 60, 40)):
    if not (0 < k < 1.2):
        return
    s = min(1, k * 3)
    d = ImageDraw.Draw(img)
    pts = []
    for i in range(16):
        r = (150 if i % 2 == 0 else 90) * s
        a = i * math.pi / 8
        pts.append((x + math.cos(a) * r, y + math.sin(a) * r))
    d.polygon(pts, fill=(250, 220, 90), outline=INK)
    if s > 0.8:
        d.text((x, y), txt, font=font(FONT_SERIF_B, size), fill=col, anchor="mm", stroke_width=3, stroke_fill=INK)
