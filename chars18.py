"""Kolobok (folk tale) and Puss in Boots (Perrault) - original storybook designs. Cat uses the shared Watson rig via chars15._draw."""
import math
import chars as C
from chars import *
from chars15 import _draw

GOLD = (242, 192, 84, 255)
GOLD_DK = (214, 150, 56, 255)


def draw_kolobok(ctx, pose):
    bob = pose.get("bob", 0)
    sq = pose.get("squash", 0.0)
    t = pose.get("turn", 0.0)
    cy = -260 + bob
    rx, ry = 215 * (1 + 0.08 * sq), 215 * (1 - 0.08 * sq)
    ctx.ellipse(0, cy, rx, ry, GOLD, 7)
    for a in (-0.9, -0.3, 0.4, 1.0):  # baked-crust marks
        ctx.line([(rx * 0.8 * math.cos(a + 3.1), cy + ry * 0.8 * math.sin(a + 3.1)),
                  (rx * 0.9 * math.cos(a + 3.1), cy + ry * 0.9 * math.sin(a + 3.1))], 6, GOLD_DK)
    look = pose.get("look", (0, 0))
    br = pose.get("brow", 0.3)
    for s in (-1, 1):
        ex = s * 72 + 30 * t
        ctx.circle(ex, cy - 30, 36, (255, 255, 255, 255), 5)
        ctx.circle(ex + look[0] * 12, cy - 30 + look[1] * 10, 15, (40, 30, 30, 255), 2)
        ctx.circle(s * 118 + 30 * t, cy + 40, 24, (240, 130, 110, 255), 0, ol=None)
        ctx.line([(ex - 34, cy - 84 - br * 8 + s * 6 * (0.5 - br)), (ex + 34, cy - 84 - br * 8 - s * 6 * (0.5 - br))], 8, (120, 80, 40, 255))
    m = pose.get("mouth", "grin")
    mx = 30 * t
    if m == "o":
        ctx.ellipse(mx, cy + 70, 24, 30, (110, 40, 40, 255), 5)
    elif m == "neutral":
        ctx.line([(mx - 40, cy + 74), (mx + 40, cy + 74)], 8, (110, 40, 40, 255))
    elif m == "sad":
        ctx.line(bezier((mx - 50, cy + 90), (mx, cy + 50), (mx + 50, cy + 90)), 8, (110, 40, 40, 255))
    else:
        ctx.poly([(mx - 56, cy + 56), (mx + 56, cy + 56), (mx + 40, cy + 100), (mx, cy + 112), (mx - 40, cy + 100)], (110, 40, 40, 255), 5)
    for s in (-1, 1):
        ctx.ellipse(s * 80, -30 + bob * 0.2, 56, 30, (150, 90, 56, 255), 6)


CAT = dict(
    coat=(120, 56, 150, 255), coat_dk=(90, 40, 116, 255), vest=(250, 226, 150, 255),
    trousers=(150, 98, 60, 255), shirt=WHITE, tie=(200, 60, 52, 255), hair=(110, 110, 120, 255),
    stache=(236, 236, 240, 255), hat=(200, 60, 52, 255), eye=(80, 150, 70, 255), shoe=(100, 60, 34, 255))


def draw_cat(ctx, pose):
    _draw(CAT, (110, 110, 120, 255), ctx, pose)
    t = pose.get("turn", 0.25)
    x0 = 16 * t * 1.3 + pose.get("head", 0) * -2
    y0 = -774 - 125 + pose.get("bob", 0)
    g, w = (110, 110, 122, 255), (236, 236, 240, 255)
    for s in (-1, 1):
        ctx.poly([(x0 + s * 30, y0 - 66), (x0 + s * 84, y0 - 196), (x0 + s * 100, y0 - 44)], g, 5)
        ctx.poly([(x0 + s * 50, y0 - 72), (x0 + s * 82, y0 - 156), (x0 + s * 90, y0 - 56)], (240, 170, 170, 255), 3)
    ctx.ellipse(x0 + 12 * t, y0 + 44, 40, 26, w, 4)
    ctx.poly([(x0 + 12 * t - 12, y0 + 24), (x0 + 12 * t + 12, y0 + 24), (x0 + 12 * t, y0 + 38)], (230, 120, 130, 255), 3)
    for s in (-1, 1):
        for k in (-8, 8):
            ctx.line([(x0 + 12 * t + s * 30, y0 + 46 + k * 0.5), (x0 + 12 * t + s * 110, y0 + 46 + k * 3)], 4, (60, 60, 70, 255))
    ctx.line(bezier((x0 + 40, y0 - 120), (x0 + 130, y0 - 230), (x0 + 150, y0 - 150)), 10, (250, 250, 250, 255))
    ctx.line(bezier((-60, -330), (-190, -300), (-200, -480), (-130, -540)), 26, g)
