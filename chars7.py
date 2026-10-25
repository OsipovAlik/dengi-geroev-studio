"""Buratino (A. Tolstoy, The Golden Key) - original wooden-boy design on the shared rig."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, WHITE, INK

WOOD = (232, 190, 128, 255)
WOOD_SH = (200, 154, 96, 255)
BUR = dict(jacket=(196, 150, 96, 255), jacket_dk=(160, 118, 72, 255), trousers=(70, 96, 140, 255), shoe=(60, 40, 30, 255),
           cap=(236, 228, 206, 255), cap_st=(200, 60, 52, 255), eye=(60, 100, 150, 255), hair=(120, 70, 36, 255))
BU_CFG = dict(hrx=58, hry=64, eye_sep=24, brow=(110, 64, 34, 255), eye=BUR["eye"], hair=BUR["hair"],
              ua=160, fa=150, arm_w=36, th=190, sh=185, leg_w=40)


def face7(ctx, pose, cfg):
    turn = P(pose, "turn", 0.25)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    nose = P(pose, "nose", 1.0)
    ctx.ellipse(-rx + 2 - 8 * turn, cy + 6, 11, 16, WOOD_SH, 4)
    ctx.ellipse(rx - 2 - 8 * turn, cy + 6, 11, 16, WOOD_SH, 4)
    pts = [(math.cos(math.radians(i * 9)) * rx + (fx * 0.5 if math.sin(math.radians(i * 9)) > 0.8 else 0),
            cy + math.sin(math.radians(i * 9)) * ry) for i in range(40)]
    ctx.poly(pts, WOOD, 5)
    for k in range(3):  # wood grain
        ctx.line(bezier((fx - 40, cy - 30 + k * 26), (fx - 10, cy - 38 + k * 26), (fx + 40, cy - 28 + k * 26)), 2, (190, 142, 86, 255))
    ctx.ellipse(fx - 34, cy + 22, 11, 7, (238, 160, 130, 255), 0, None)
    ctx.ellipse(fx + 34, cy + 22, 11, 7, (238, 160, 130, 255), 0, None)
    ey = cy - 10
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = 13 * (1 - blink)
        if h > 2:
            ctx.ellipse(ex, ey, 13, h, WHITE, 3)
            px, py = ex + look[0] * 4, ey + look[1] * 3
            pr = min(6, h)
            ctx.ellipse(px, py, pr, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 3, min(3, pr), INK, 0, None)
        else:
            ctx.line([(ex - 12, ey), (ex + 12, ey + 1)], 4)
        by = ey - 24 - brow * 5
        ctx.line([(fx + side * 6, by + max(0, -brow) * 8), (fx + side * (cfg["eye_sep"] + 16), by - max(0, -brow) * 3)], 5, cfg["brow"])
    s = 1 if turn >= 0 else -1
    nl = 58 * nose
    ctx.poly([(fx - 8, ey + 6), (fx + s * nl * 0.5, cy + 24 + nl * 0.7), (fx + s * nl * 0.2, cy + 36 + nl * 0.9), (fx - s * 8, cy + 30)],
             WOOD_SH, 4)
    my = cy + 48
    sm = P(pose, "smile", 0.5)
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 8, 10, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - 22, my - 3), (fx, my + 20), (fx + 22, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - 22, my - 3), (fx + 22, my - 3)], 3)
    else:
        if mouth == "frown":
            sm = -0.8
        ctx.line(bezier((fx - 18, my), (fx, my + 10 * sm), (fx + 18, my)), 4)
    # tall striped cap
    ctx.poly([(-rx + 2, cy - ry + 26), (rx - 2, cy - ry + 26), (rx - 14, cy - ry - 30), (30, cy - ry - 120), (90, cy - ry - 96),
              (-rx + 14, cy - ry - 24)], BUR["cap"], 4)
    for k in range(3):
        yy = cy - ry + 8 - k * 28
        ctx.line([(-rx + 6 + k * 6, yy), (rx - 6 - k * 4, yy - 6)], 6, BUR["cap_st"])
    ctx.circle(90, cy - ry - 96, 12, BUR["cap_st"], 3)


def item_coin5(ctx, pose, side, tot, hk):
    ctx.push(0, 40, -tot)
    for i in range(5):
        ctx.ellipse(-30 + i * 15, -10 - i * 6, 22, 12, (232, 186, 70, 255), 3)
    ctx.pop()
    hand(ctx, "fist", WOOD)


C.ITEMS.update(coin5=item_coin5)


def draw_buratino(ctx, pose):
    c = BUR
    cfg = BU_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -375
    ctx.push(P(pose, "shiver", 0), 0, 0)
    leg(ctx, pose, "L", cfg, -28, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 28, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -310
    shy = ny + 30
    sx = 78
    body = [(-sx + 6, shy - 6), (-30, ny - 2), (30, ny - 2), (sx - 6, shy - 6), (sx + 4, shy + 40), (sx + 6, 40), (-sx - 6, 40),
            (-sx - 4, shy + 40)]
    ctx.poly(body, c["jacket"], 6)
    for yy in (ny + 70, ny + 150, ny + 230):  # paper jacket creases
        ctx.line([(-sx + 4, yy), (sx - 4, yy + 6)], 3, c["jacket_dk"])
    ctx.poly([(-22, ny), (22, ny), (0, ny + 70)], (250, 240, 220, 255), 3)
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.25)
    face7(ctx, pose, cfg)
    ctx.pop()
    for side in ("L", "R"):
        it = C.get_item(pose, side)
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 14), shy + 14, "arm" + side, c["jacket"], cuff=c["jacket_dk"],
            item_fn=it or (lambda ctx_, pose_, s_, tot, hk: hand(ctx_, hk, WOOD, 22)), base_ang=base)
    ctx.pop()
    ctx.pop()
    ctx.pop()
