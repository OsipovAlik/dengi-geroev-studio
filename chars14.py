"""Tsar Dadon (Pushkin) on the shared Watson rig, own palette + crown. Original storybook design."""
import chars as C
from chars import *

DADON = dict(
    coat=(150, 40, 60, 255), coat_dk=(114, 28, 46, 255), vest=(232, 196, 90, 255),
    trousers=(70, 40, 80, 255), shirt=WHITE, tie=(232, 196, 90, 255), hair=(210, 206, 200, 255),
    stache=(210, 206, 200, 255), hat=(232, 196, 90, 255), eye=(90, 80, 70, 255), shoe=(60, 30, 30, 255))


def item_deal(ctx, pose, side, tot, hk):
    ctx.push(0, -34, -tot)
    ctx.poly([(-110, -260), (110, -260), (110, 30), (-110, 30)], (240, 232, 212, 255), 5)
    ctx.text(0, -214, "ДОГОВОР", 34, (40, 30, 24, 255))
    for i in range(4):
        ctx.line([(-86, -170 + i * 26), (86 - (i % 2) * 30, -170 + i * 26)], 3, (150, 140, 120, 255))
    ctx.text(-30, -30, "подпись", 30, (40, 90, 50, 255))
    ctx.pop()
    hand(ctx, "fist")


C.ITEMS.update(deal=item_deal)


def draw_dadon(ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    try:
        C.WATSON.update(DADON)
        C.W_CFG.update(brow=(190, 186, 180, 255), eye=DADON["eye"], hair=DADON["hair"], stache=DADON["stache"], hat=DADON["hat"])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)
    # crown on top of the head
    g = (236, 196, 70, 255)
    b = pose.get("bob", 0)
    x0 = 16 * pose.get("turn", 0.25) * 1.3 + pose.get("head", 0) * -2
    y0 = -774 + b - 123 - 94 + 8 + 440 * 0 + (pose.get("lean", 0) * 0)
    ctx.poly([(x0 - 60, y0), (x0 - 64, y0 - 62), (x0 - 32, y0 - 32), (x0, y0 - 74), (x0 + 32, y0 - 32), (x0 + 64, y0 - 62),
              (x0 + 60, y0)], g, 5)
    ctx.circle(x0, y0 - 80, 9, (200, 40, 50, 255), 3)
