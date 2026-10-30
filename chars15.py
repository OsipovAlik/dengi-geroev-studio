"""Pop and Balda (Pushkin), King (Andersen) on the shared Watson rig, own palettes. Original storybook designs."""
import chars as C
from chars import *

POP = dict(
    coat=(70, 60, 96, 255), coat_dk=(52, 44, 76, 255), vest=(226, 190, 90, 255),
    trousers=(52, 46, 70, 255), shirt=WHITE, tie=(226, 190, 90, 255), hair=(120, 90, 66, 255),
    stache=(120, 90, 66, 255), hat=(40, 34, 56, 255), eye=(90, 80, 60, 255), shoe=(30, 24, 20, 255))
BALDA = dict(
    coat=(200, 90, 70, 255), coat_dk=(160, 66, 52, 255), vest=(236, 220, 180, 255),
    trousers=(110, 120, 150, 255), shirt=WHITE, tie=(236, 220, 180, 255), hair=(220, 170, 80, 255),
    stache=(220, 170, 80, 255), hat=(180, 140, 80, 255), eye=(70, 120, 150, 255), shoe=(120, 86, 56, 255))
KING = dict(
    coat=(60, 90, 160, 255), coat_dk=(44, 68, 128, 255), vest=(240, 236, 220, 255),
    trousers=(196, 60, 60, 255), shirt=WHITE, tie=(232, 196, 90, 255), hair=(150, 110, 70, 255),
    stache=(150, 110, 70, 255), hat=(232, 196, 90, 255), eye=(90, 80, 70, 255), shoe=(60, 30, 30, 255))


def _draw(pal, brow, ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    try:
        C.WATSON.update(pal)
        C.W_CFG.update(brow=brow, eye=pal["eye"], hair=pal["hair"], stache=pal["stache"], hat=pal["hat"])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)


def draw_pop(ctx, pose):
    _draw(POP, (100, 76, 56, 255), ctx, pose)


def draw_balda(ctx, pose):
    _draw(BALDA, (180, 130, 60, 255), ctx, pose)


def draw_king(ctx, pose):
    _draw(KING, (130, 90, 56, 255), ctx, pose)
    g = (236, 196, 70, 255)
    b = pose.get("bob", 0)
    x0 = 16 * pose.get("turn", 0.25) * 1.3 + pose.get("head", 0) * -2
    y0 = -774 + b - 123 - 94 + 8
    ctx.poly([(x0 - 60, y0), (x0 - 64, y0 - 62), (x0 - 32, y0 - 32), (x0, y0 - 74), (x0 + 32, y0 - 32), (x0 + 64, y0 - 62),
              (x0 + 60, y0)], g, 5)
    ctx.circle(x0, y0 - 80, 9, (60, 90, 200, 255), 3)
