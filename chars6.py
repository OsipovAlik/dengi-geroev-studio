"""Scrooge and Bob Cratchit (Dickens, A Christmas Carol) - original storybook designs on the shared rig."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, WHITE, INK

PALE = (226, 210, 196, 255)
PALE_SH = (198, 178, 162, 255)
YOUNG = (240, 206, 176, 255)
YOUNG_SH = (216, 176, 146, 255)
SCR = dict(coat=(52, 50, 58, 255), coat_dk=(38, 36, 44, 255), vest=(90, 80, 70, 255), trousers=(60, 58, 64, 255),
           shirt=WHITE, cravat=(30, 28, 32, 255), hair=(214, 212, 206, 255), eye=(110, 120, 130, 255), shoe=(24, 22, 22, 255),
           scarf=(180, 40, 40, 255))
BOB = dict(coat=(110, 96, 70, 255), coat_dk=(90, 78, 56, 255), scarf=(220, 220, 210, 255), trousers=(96, 84, 70, 255),
           hair=(150, 96, 60, 255), eye=(80, 100, 70, 255), shoe=(40, 30, 24, 255))


def face6(ctx, pose, cfg, kind):
    turn = P(pose, "turn", 0.25)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    skin, skin_sh = (PALE, PALE_SH) if kind == "scrooge" else (YOUNG, YOUNG_SH)
    ctx.ellipse(-rx + 2 - 8 * turn, cy + 6, 11, 18, skin, 4)
    ctx.ellipse(rx - 2 - 8 * turn, cy + 6, 11, 18, skin, 4)
    if kind == "scrooge":  # wispy white hair at the sides
        for sd in (-1, 1):
            ctx.poly([(sd * (rx + 2), cy + 20), (sd * (rx + 18), cy - 10), (sd * (rx + 4), cy - 50), (sd * (rx - 14), cy - 40),
                      (sd * (rx - 8), cy + 10)], cfg["hair"], 4)
    pts = []
    for i in range(40):
        a = math.radians(i * 9)
        s = math.sin(a)
        if kind == "scrooge":  # narrow, long, sharp chin
            r_x = rx * (1 - 0.42 * max(0, s) ** 1.5)
            r_y = ry * (1.15 if s > 0.7 else 1.0)
        else:
            r_x, r_y = rx, ry
        pts.append((math.cos(a) * r_x + (fx * 0.5 if s > 0.8 else 0), cy + s * r_y))
    ctx.poly(pts, skin, 5)
    if kind == "scrooge":
        ctx.line(bezier((fx - 22, cy + 10), (fx - 30, cy + 34), (fx - 20, cy + 56)), 3, (176, 150, 132, 255))
        ctx.line(bezier((fx + 22, cy + 10), (fx + 30, cy + 34), (fx + 20, cy + 56)), 3, (176, 150, 132, 255))
        ctx.line([(fx - 18, cy - 50), (fx + 18, cy - 50)], 2, (180, 156, 140, 255))
    else:
        ctx.ellipse(fx - 34, cy + 22, 12, 8, (240, 170, 150, 255), 0, None)
        ctx.ellipse(fx + 34, cy + 22, 12, 8, (240, 170, 150, 255), 0, None)
        for k in range(6):  # freckles
            ctx.ellipse(fx - 30 + k * 12, cy + 8 + (k % 2) * 6, 1.8, 1.8, (190, 120, 90, 255), 0, None)
    ey = cy - 12
    er = 9 if kind == "scrooge" else 10
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = (6 if kind == "scrooge" else 8) * (1 - blink)
        if h > 1.5:
            ctx.ellipse(ex, ey, er, h, WHITE, 3)
            px, py = ex + look[0] * 4, ey + look[1] * 2.5
            pr = min(4.2, h)
            ctx.ellipse(px, py, pr, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 2, min(2, pr), INK, 0, None)
        else:
            ctx.line([(ex - er, ey), (ex + er, ey + 1)], 4)
        by = ey - 18 - brow * 5
        inner = fx + side * 6
        outer = fx + side * (cfg["eye_sep"] + 16)
        inner_y = by + max(0, -brow) * 10 - max(0, brow) * 3
        outer_y = by - max(0, -brow) * 4 - (4 if kind == "scrooge" else 0)
        ctx.line([(inner, inner_y), (outer, outer_y)], 7 if kind == "scrooge" else 5, cfg["brow"])
    s = 1 if turn >= 0 else -1
    if kind == "scrooge":  # long hooked nose
        ctx.poly([(fx - 4, ey + 2), (fx + s * 30, cy + 34), (fx + s * 20, cy + 42), (fx + s * 2, cy + 36), (fx - s * 8, cy + 30)],
                 skin_sh, 4)
    else:
        ctx.ellipse(fx + 3 * turn, cy + 18, 9, 9, skin_sh, 4)
    my = cy + (56 if kind == "scrooge" else 44)
    mw = 15 if kind == "scrooge" else 18
    sm = P(pose, "smile", -0.3 if kind == "scrooge" else 0.4)
    if mouth == "frown":
        sm = -0.8
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 7, 9, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - mw, my - 3), (fx, my + 18), (fx + mw, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - mw, my - 3), (fx + mw, my - 3)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 10 * sm), (fx + mw, my)), 4)
    if kind == "scrooge":
        hat = P(pose, "hat", "cap")
        if hat == "cap":  # nightcap
            ctx.poly([(-rx + 2, cy - ry + 30), (rx - 2, cy - ry + 30), (rx - 20, cy - ry - 16), (20, cy - ry - 60),
                      (100, cy - ry - 40), (106, cy - ry - 20), (30, cy - ry - 30), (-rx + 16, cy - ry - 6)],
                     (236, 230, 214, 255), 4)
            ctx.circle(106, cy - ry - 22, 12, (236, 230, 214, 255), 3)
        elif hat == "top":
            ctx.poly([(-rx - 26, cy - ry + 30), (rx + 26, cy - ry + 30), (rx + 20, cy - ry + 14), (-rx - 20, cy - ry + 14)],
                     (30, 28, 32, 255), 4)
            ctx.poly([(-rx + 4, cy - ry + 18), (rx - 4, cy - ry + 18), (rx - 10, cy - ry - 100), (-rx + 10, cy - ry - 100)],
                     (30, 28, 32, 255), 4)
    else:
        h = cfg["hair"]
        ctx.poly([(-rx - 4, cy + 4), (-rx + 2, cy - 44), (-26, cy - ry - 10), (34, cy - ry - 8), (rx - 2, cy - 40), (rx + 4, cy + 4),
                  (rx - 10, cy - 30), (fx + 24, cy - ry + 18), (fx - 20, cy - ry + 26), (-rx + 12, cy - 30)], h, 5)


def item_candle(ctx, pose, side, tot, hk):
    ctx.push(0, 40, -tot)
    ctx.ellipse(0, 10, 34, 10, (180, 160, 120, 255), 3)
    ctx.poly([(-10, 6), (10, 6), (10, -60), (-10, -60)], (246, 240, 220, 255), 3)
    ctx.poly([(0, -64), (8, -78), (0, -100), (-8, -78)], (250, 200, 80, 255), 2)
    ctx.pop()
    hand(ctx, "fist", PALE)


def item_turkey(ctx, pose, side, tot, hk):
    ctx.push(0, 70, -tot)
    ctx.ellipse(0, 0, 90, 60, (200, 140, 80, 255), 5)
    for sd in (-1, 1):
        ctx.limb(sd * 60, -30, sd * 100, -70, 26, 18, (200, 140, 80, 255), 4)
        ctx.circle(sd * 104, -74, 12, (246, 240, 220, 255), 3)
    ctx.line(bezier((-50, 10), (0, 30), (50, 10)), 3, (160, 100, 50, 255))
    ctx.pop()
    hand(ctx, "fist", PALE)


def item_quill6(ctx, pose, side, tot, hk):
    hand(ctx, "fist", PALE)
    ctx.push(0, 24, -tot + 30)
    ctx.poly([(0, 10), (10, -40), (26, -110), (8, -100), (-4, -40)], (246, 242, 230, 255), 3)
    ctx.pop()


C.ITEMS.update(candle=item_candle, turkey=item_turkey, quill6=item_quill6)

S_CFG = dict(hrx=50, hry=76, eye_sep=21, brow=(214, 212, 206, 255), eye=SCR["eye"], hair=SCR["hair"],
             ua=180, fa=170, arm_w=36, th=230, sh=220, leg_w=38)
B_CFG = dict(hrx=58, hry=70, eye_sep=24, brow=(140, 90, 56, 255), eye=BOB["eye"], hair=BOB["hair"],
             ua=165, fa=155, arm_w=40, th=210, sh=200, leg_w=44)


def draw_scrooge(ctx, pose):
    c = SCR
    cfg = S_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -455
    shiv = P(pose, "shiver", 0)
    ctx.push(shiv, 0, 0)
    leg(ctx, pose, "L", cfg, -26, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 26, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 10)
    ctx.push(0, hipy, base)
    ny = -360
    shy = ny + 30
    sx = 78
    coat = [(-sx + 6, shy - 6), (-30, ny - 4), (30, ny - 4), (sx - 6, shy - 6), (sx + 6, shy + 40), (sx + 30, 260), (10, 274),
            (-10, 274), (-sx - 30, 260), (-sx - 6, shy + 40)]
    ctx.poly(coat, c["coat"], 6)
    ctx.poly([(sx - 20, shy + 30), (sx + 6, shy + 40), (sx + 30, 260), (sx, 262), (sx - 26, 40)], c["coat_dk"], 0, None)
    ctx.poly([(-24, ny), (24, ny), (0, ny + 120)], c["shirt"], 3)
    ctx.poly([(-16, ny + 4), (16, ny + 4), (6, ny + 40), (-6, ny + 40)], c["cravat"], 3)
    ctx.line([(-24, ny), (-40, ny + 60), (-4, ny + 130), (-6, 270)], 4)
    ctx.line([(24, ny), (40, ny + 60), (4, ny + 130)], 4)
    if P(pose, "scarf", False):
        ctx.poly([(-40, ny - 14), (40, ny - 14), (44, ny + 20), (-44, ny + 20)], c["scarf"], 4)
        ctx.poly([(10, ny + 14), (40, ny + 14), (46, ny + 150), (16, ny + 150)], c["scarf"], 4)
    ctx.push(0, ny + 6, P(pose, "head", 6), 1.3)
    face6(ctx, pose, cfg, "scrooge")
    ctx.pop()
    for side in ("L", "R"):
        it = C.get_item(pose, side)
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 14), shy + 14, "arm" + side, c["coat"],
            item_fn=it or (lambda ctx_, pose_, s_, tot, hk: hand(ctx_, hk, PALE, 22)), base_ang=base)
    ctx.pop()
    ctx.pop()
    ctx.pop()


def draw_bob(ctx, pose):
    c = BOB
    cfg = B_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -410
    shiv = P(pose, "shiver", 0)
    ctx.push(shiv, 0, 0)
    leg(ctx, pose, "L", cfg, -32, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 32, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -330
    shy = ny + 30
    sx = 90
    body = [(-sx + 6, shy - 6), (-34, ny - 2), (34, ny - 2), (sx - 6, shy - 6), (sx + 4, shy + 40), (sx + 6, 40), (-sx - 6, 40),
            (-sx - 4, shy + 40)]
    ctx.poly(body, c["coat"], 6)
    for (px, py) in ((-50, ny + 160), (40, ny + 230)):
        ctx.poly([(px, py), (px + 30, py - 2), (px + 32, py + 30), (px - 2, py + 32)], c["coat_dk"], 3)
    # long white comforter (scarf)
    ctx.poly([(-46, ny - 16), (46, ny - 16), (50, ny + 22), (-50, ny + 22)], c["scarf"], 4)
    ctx.poly([(-40, ny + 14), (-14, ny + 14), (-10, ny + 190), (-36, ny + 190)], c["scarf"], 4)
    for yy in (ny + 176, ny + 184):
        ctx.line([(-36, yy), (-10, yy)], 2, (160, 160, 150, 255))
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.25)
    face6(ctx, pose, cfg, "bob")
    ctx.pop()
    for side in ("L", "R"):
        it = C.get_item(pose, side)
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 14), shy + 14, "arm" + side, c["coat"], cuff=c["coat_dk"],
            item_fn=it or (lambda ctx_, pose_, s_, tot, hk: hand(ctx_, hk, YOUNG, 22)), base_ang=base)
    ctx.pop()
    ctx.pop()
    ctx.pop()
