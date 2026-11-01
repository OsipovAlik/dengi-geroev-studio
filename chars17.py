"""Three Little Pigs (folk tale) and Wolf on the shared Watson rig: pink/grey skin, ears, snout, tails. Original storybook designs."""
import chars as C
from chars import *
from chars15 import _draw as _unused  # noqa

PINK = (244, 168, 168, 255)
PINK_SH = (222, 136, 140, 255)
GREY = (150, 150, 162, 255)
GREY_SH = (112, 112, 128, 255)


def _pal(coat, vest, trousers, hat, eye=(40, 30, 30, 255)):
    return dict(coat=coat, coat_dk=coat, vest=vest, trousers=trousers, shirt=WHITE, tie=vest, hair=PINK,
                stache=PINK, hat=hat, eye=eye, shoe=(70, 44, 30, 255))


PIG1 = _pal((236, 206, 90, 255), (250, 238, 170, 255), (190, 150, 60, 255), (226, 190, 80, 255))   # straw
PIG2 = _pal((170, 110, 64, 255), (214, 170, 110, 255), (110, 76, 50, 255), (140, 92, 56, 255))      # wood
PIG3 = _pal((70, 110, 180, 255), (230, 236, 246, 255), (60, 76, 120, 255), (200, 70, 60, 255))      # stone / builder
WOLF = _pal((88, 88, 104, 255), (60, 60, 76, 255), (50, 50, 64, 255), (60, 60, 76, 255), eye=(240, 200, 60, 255))


def _head_xy(pose):
    return 16 * pose.get("turn", 0.25) * 1.3 + pose.get("head", 0) * -2, -774 - 125 + pose.get("bob", 0)


def _base(pal, skin, skin_sh, brow, ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    s0, s1, hd = C.SKIN, C.SKIN_SH, C.hand.__defaults__
    try:
        C.WATSON.update(pal)
        C.W_CFG.update(brow=brow, eye=pal["eye"], hair=pal["hair"], stache=pal["stache"], hat=pal["hat"])
        C.SKIN, C.SKIN_SH = skin, skin_sh
        C.hand.__defaults__ = (skin,) + tuple(hd[1:])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)
        C.SKIN, C.SKIN_SH = s0, s1
        C.hand.__defaults__ = hd


def _pig(pal, ctx, pose):
    _base(pal, PINK, PINK_SH, (160, 90, 96, 255), ctx, pose)
    x0, y0 = _head_xy(pose)
    t = pose.get("turn", 0.25)
    for s in (-1, 1):  # floppy ears
        ctx.poly([(x0 + s * 40, y0 - 62), (x0 + s * 92, y0 - 96), (x0 + s * 88, y0 - 30)], PINK_SH, 5)
    # snout
    ctx.ellipse(x0 + 12 * t, y0 + 38, 46, 32, PINK_SH, 5)
    ctx.circle(x0 + 12 * t - 15, y0 + 38, 7, (120, 56, 64, 255), 2)
    ctx.circle(x0 + 12 * t + 15, y0 + 38, 7, (120, 56, 64, 255), 2)
    # curly tail
    ctx.line(bezier((-60, -330), (-130, -330), (-150, -400), (-110, -420)), 16, PINK_SH)
    ctx.line(bezier((-110, -420), (-80, -430), (-86, -390)), 14, PINK_SH)


def draw_pig1(ctx, pose):
    _pig(PIG1, ctx, pose)


def draw_pig2(ctx, pose):
    _pig(PIG2, ctx, pose)


def draw_pig3(ctx, pose):
    _pig(PIG3, ctx, pose)


def draw_wolf(ctx, pose):
    _base(WOLF, GREY, GREY_SH, (70, 70, 84, 255), ctx, pose)
    x0, y0 = _head_xy(pose)
    t = pose.get("turn", 0.25)
    for s in (-1, 1):  # pointed ears
        ctx.poly([(x0 + s * 24, y0 - 66), (x0 + s * 56, y0 - 190), (x0 + s * 96, y0 - 52)], GREY, 5)
        ctx.poly([(x0 + s * 42, y0 - 74), (x0 + s * 58, y0 - 140), (x0 + s * 80, y0 - 62)], (230, 170, 170, 255), 3)
    # long muzzle with nose and fangs
    ctx.poly([(x0 + 6 * t - 30, y0 + 14), (x0 + 6 * t + 96 + 14 * t, y0 + 44), (x0 + 6 * t - 30, y0 + 76)], GREY_SH, 5)
    ctx.circle(x0 + 6 * t + 96 + 14 * t, y0 + 44, 12, (24, 24, 30, 255), 3)
    ctx.poly([(x0 + 6 * t + 20, y0 + 60), (x0 + 6 * t + 34, y0 + 84), (x0 + 6 * t + 48, y0 + 58)], WHITE, 3)
    # bushy tail
    ctx.poly([(-70, -330), (-190, -290), (-270, -380), (-220, -500), (-150, -450), (-110, -390)], GREY, 6)
    ctx.poly([(-220, -500), (-270, -380), (-240, -350), (-190, -430)], WHITE, 4)
