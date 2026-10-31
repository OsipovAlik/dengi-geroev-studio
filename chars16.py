"""Fox, Crow (Krylov), Monkey (Krylov) on the shared Watson rig: own palettes plus ears/beak/tail add-ons. Original storybook designs."""
import chars as C
from chars import *
from chars15 import _draw

FOX = dict(
    coat=(214, 112, 48, 255), coat_dk=(168, 80, 34, 255), vest=(250, 238, 214, 255),
    trousers=(96, 62, 44, 255), shirt=WHITE, tie=(250, 238, 214, 255), hair=(214, 112, 48, 255),
    stache=(250, 238, 214, 255), hat=(214, 112, 48, 255), eye=(60, 40, 20, 255), shoe=(40, 28, 22, 255))
CROW = dict(
    coat=(52, 52, 74, 255), coat_dk=(36, 36, 56, 255), vest=(120, 120, 150, 255),
    trousers=(36, 36, 52, 255), shirt=WHITE, tie=(200, 60, 52, 255), hair=(40, 40, 60, 255),
    stache=(40, 40, 60, 255), hat=(40, 40, 60, 255), eye=(230, 200, 80, 255), shoe=(24, 22, 30, 255))
MONKEY = dict(
    coat=(76, 130, 96, 255), coat_dk=(56, 100, 72, 255), vest=(236, 220, 170, 255),
    trousers=(120, 86, 56, 255), shirt=WHITE, tie=(210, 70, 60, 255), hair=(130, 90, 56, 255),
    stache=(130, 90, 56, 255), hat=(130, 90, 56, 255), eye=(60, 40, 24, 255), shoe=(60, 40, 28, 255))


def _head_xy(pose):
    return 16 * pose.get("turn", 0.25) * 1.3 + pose.get("head", 0) * -2, -774 - 125 + pose.get("bob", 0)


def draw_fox(ctx, pose):
    _draw(FOX, (150, 80, 36, 255), ctx, pose)
    x0, y0 = _head_xy(pose)
    o, w = (214, 112, 48, 255), (250, 238, 214, 255)
    for s in (-1, 1):
        ctx.poly([(x0 + s * 28, y0 - 70), (x0 + s * 86, y0 - 190), (x0 + s * 96, y0 - 40)], o, 5)
        ctx.poly([(x0 + s * 48, y0 - 72), (x0 + s * 82, y0 - 150), (x0 + s * 86, y0 - 56)], w, 3)
    # white muzzle patch and nose
    ctx.ellipse(x0 + 14 * pose.get("turn", 0.25), y0 + 40, 40, 24, w, 4)
    ctx.circle(x0 + 14 * pose.get("turn", 0.25), y0 + 28, 10, (30, 24, 24, 255), 3)
    # tail with white tip
    ctx.poly([(-70, -330), (-190, -300), (-260, -420), (-210, -520), (-150, -470), (-110, -400)], o, 6)
    ctx.poly([(-210, -520), (-260, -420), (-232, -380), (-186, -440), (-170, -500)], w, 4)


def draw_crow(ctx, pose):
    _draw(CROW, (30, 30, 46, 255), ctx, pose)
    x0, y0 = _head_xy(pose)
    t = pose.get("turn", 0.25)
    b = (232, 176, 60, 255)
    # big beak
    ctx.poly([(x0 + 10 * t - 8, y0 + 18), (x0 + 110 + 20 * t, y0 + 44), (x0 + 10 * t - 8, y0 + 70)], b, 5)
    # head feathers
    ctx.poly([(x0 - 30, y0 - 70), (x0 - 10, y0 - 160), (x0 + 12, y0 - 78)], (40, 40, 60, 255), 5)
    ctx.poly([(x0 + 4, y0 - 74), (x0 + 36, y0 - 146), (x0 + 50, y0 - 66)], (40, 40, 60, 255), 5)
    # tail feathers
    for i, a in enumerate((-30, 0, 30)):
        ctx.poly([(-80, -300), (-150 - a, -250 - i * 20), (-210 - a, -300 - i * 40), (-110, -370)], (40, 40, 60, 255), 5)


def draw_monkey(ctx, pose):
    _draw(MONKEY, (100, 64, 36, 255), ctx, pose)
    x0, y0 = _head_xy(pose)
    t = pose.get("turn", 0.25)
    br = (130, 90, 56, 255)
    for s in (-1, 1):
        ctx.circle(x0 + s * 84, y0 + 10, 36, br, 5)
        ctx.circle(x0 + s * 84, y0 + 10, 20, (236, 196, 160, 255), 3)
    ctx.ellipse(x0 + 12 * t, y0 + 40, 44, 26, (236, 196, 160, 255), 4)
    ctx.circle(x0 + 12 * t - 14, y0 + 34, 5, (60, 40, 30, 255), 2)
    ctx.circle(x0 + 12 * t + 14, y0 + 34, 5, (60, 40, 30, 255), 2)
    # curly tail
    ctx.line(bezier((-60, -330), (-200, -330), (-230, -480), (-130, -520)), 22, br)
    ctx.line(bezier((-130, -520), (-90, -540), (-80, -480)), 22, br)
