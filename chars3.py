"""Plushkin & Chichikov on the same puppet rig."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, WHITE, INK
from chars2 import item_watch  # registers extra items

OLD = (226, 198, 172, 255)
OLD_SH = (198, 166, 140, 255)
ROSY = (240, 204, 176, 255)
ROSY_SH = (220, 176, 148, 255)

PLUSH = dict(robe=(150, 136, 98, 255), robe_dk=(122, 110, 78, 255), patch=(110, 96, 70, 255), stain=(120, 104, 70, 255),
             rag=(176, 168, 150, 255), trousers=(90, 84, 74, 255), shoe=(60, 46, 36, 255), hair=(200, 196, 188, 255),
             eye=(70, 60, 50, 255))
CHICH = dict(coat=(150, 44, 56, 255), coat_dk=(122, 32, 44, 255), vest=(230, 220, 196, 255), trousers=(200, 190, 170, 255),
             shirt=WHITE, tie=(40, 36, 40, 255), hair=(120, 92, 62, 255), eye=(80, 70, 60, 255), shoe=(36, 30, 26, 255))


def face3(ctx, pose, cfg, kind):
    turn = P(pose, "turn", 0.25)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    skin, skin_sh = (OLD, OLD_SH) if kind == "plush" else (ROSY, ROSY_SH)
    ear_x = rx - 4
    ctx.ellipse(-ear_x - 8 * turn + 4, cy + 4, 12, 18, skin, 4)
    ctx.ellipse(ear_x - 8 * turn - 4, cy + 4, 12, 18, skin, 4)
    ctx.poly([(-18, -10), (18, -10), (16, cy + 40), (-16, cy + 40)], skin, 4)
    pts = []
    for i in range(40):
        a = math.radians(i * 9)
        s = math.sin(a)
        if kind == "plush":  # long, protruding chin
            r_x = rx * (1 - 0.32 * max(0, s) ** 2)
            r_y = ry * (1.12 if s > 0.85 else 1.0)
        else:  # round, well fed
            r_x = rx * (1 + 0.06 * max(0, s))
            r_y = ry
        pts.append((math.cos(a) * r_x + (fx * 0.6 if s > 0.8 and kind == "plush" else 0), cy + s * r_y))
    ctx.poly(pts, skin, 5)
    if kind == "plush":
        for s_ in (-1, 1):
            ctx.line(bezier((fx + s_ * 16, cy + 22), (fx + s_ * 28, cy + 44), (fx + s_ * 18, cy + 64)), 3, (176, 140, 116, 255))
        ctx.line([(fx - 20, cy - 52), (fx + 20, cy - 52)], 2, (190, 156, 130, 255))
        ctx.line([(fx - 16, cy - 44), (fx + 16, cy - 44)], 2, (190, 156, 130, 255))
        for k in range(14):  # stubble
            ang = math.radians(20 + k * 10)
            x, y = fx * 0.6 + math.cos(ang) * rx * 0.62, cy + math.sin(ang) * ry * 0.95
            ctx.ellipse(x, y, 1.6, 1.6, (150, 140, 130, 255), 0, None)
    else:
        ctx.ellipse(fx - 36, cy + 24, 14, 9, (240, 170, 150, 255), 0, None)
        ctx.ellipse(fx + 36, cy + 24, 14, 9, (240, 170, 150, 255), 0, None)
    ey = cy - 12
    er = 8 if kind == "plush" else 11
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = (6 if kind == "plush" else 8.5) * (1 - blink)
        if h > 1.5:
            ctx.ellipse(ex, ey, er, h, WHITE, 3)
            px, py = ex + look[0] * 4, ey + look[1] * 2.5
            pr = min(4.5, h)
            ctx.ellipse(px, py, pr, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 2.2, min(2.2, pr), INK, 0, None)
        else:
            ctx.line([(ex - er, ey), (ex + er, ey + 1)], 4)
        by = ey - (24 if kind == "plush" else 19) - brow * 4
        inner = fx + side * 6
        outer = fx + side * (cfg["eye_sep"] + 16)
        inner_y = by + max(0, -brow) * 9 - max(0, brow) * 3
        outer_y = by - max(0, -brow) * 3 - (6 if kind == "plush" else 0)
        if kind == "plush":  # bushy, high brows
            ctx.poly([(inner, inner_y + 4), (inner, inner_y - 6), ((inner + outer) / 2, inner_y - 12),
                      (outer + side * 4, outer_y - 4), (outer, outer_y + 4)], cfg["brow"], 3)
        else:
            ctx.line([(inner, inner_y), (outer, outer_y)], 6, cfg["brow"])
    s = 1 if turn >= 0 else -1
    if kind == "plush":
        ctx.poly([(fx - 2, ey + 4), (fx + s * 14, cy + 32), (fx + s * 2, cy + 36), (fx - s * 8, cy + 32)], skin_sh, 4)
    else:
        ctx.ellipse(fx + 3 * turn, cy + 20, 11, 11, skin_sh, 4)
    my = cy + (54 if kind == "plush" else 46)
    mw = 15 if kind == "plush" else 20
    sm = P(pose, "smile", 0.0)
    if mouth == "frown":
        sm = -0.7
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 7, 9, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - mw, my - 3), (fx, my + 18), (fx + mw, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - mw, my - 3), (fx + mw, my - 3)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 10 * sm), (fx + mw, my)), 4)
    if kind == "plush":  # bald crown with grey tufts, nightcap
        h = cfg["hair"]
        for sd in (-1, 1):
            ctx.poly([(sd * (rx + 6), cy + 10), (sd * (rx + 14), cy - 20), (sd * (rx + 4), cy - 40), (sd * (rx - 10), cy - 30),
                      (sd * (rx - 6), cy)], h, 4)
        if P(pose, "cap", True):
            ctx.poly([(-rx + 2, cy - ry + 34), (rx - 2, cy - ry + 34), (rx - 18, cy - ry - 10), (30, cy - ry - 40), (90, cy - ry - 10),
                      (96, cy - ry + 6), (40, cy - ry - 20), (-rx + 16, cy - ry - 4)], (196, 186, 160, 255), 4)
            ctx.circle(94, cy - ry + 6, 12, (196, 186, 160, 255), 3)
    else:
        h = cfg["hair"]
        ctx.poly([(-rx - 4, cy + 6), (-rx + 2, cy - 40), (-26, cy - ry - 6), (30, cy - ry - 6), (rx - 2, cy - 40),
                  (rx + 4, cy + 6), (rx - 8, cy - 26), (fx + 20, cy - ry + 20), (fx - 30, cy - ry + 16), (-rx + 10, cy - 26)], h, 5)


# ------------------------------------------------------------------ items

def item_keys2(ctx, pose, side, tot, hk):
    C.item_keys(ctx, pose, side, tot, hk)


def item_coin(ctx, pose, side, tot, hk):
    hand(ctx, "palm")
    ctx.push(0, 18, -tot)
    ctx.ellipse(0, -18, 20, 9, (214, 170, 70, 255), 3)
    ctx.pop()


def item_hat(ctx, pose, side, tot, hk):
    ctx.push(0, 40, -tot)
    ctx.poly([(-54, 10), (54, 10), (48, -4), (-48, -4)], (40, 34, 30, 255), 4)
    ctx.poly([(-36, -2), (36, -2), (32, -80), (-32, -80)], (40, 34, 30, 255), 4)
    ctx.pop()
    hand(ctx, "fist")


C.ITEMS.update(coin=item_coin, tophat=item_hat)

# ------------------------------------------------------------------ bodies

PL_CFG = dict(hrx=50, hry=74, eye_sep=21, brow=(200, 196, 190, 255), eye=PLUSH["eye"], hair=PLUSH["hair"],
              ua=170, fa=160, arm_w=40, th=210, sh=200, leg_w=44)


def draw_plushkin(ctx, pose):
    c = PLUSH
    cfg = PL_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -410
    leg(ctx, pose, "L", cfg, -30, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 30, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 8)
    ctx.push(0, hipy, base)
    ny = -330
    shy = ny + 30
    sx = 82
    sw = P(pose, "sway", 0)
    hem = []
    for i in range(11):
        x = lerp(sx + 40 + sw, -sx - 40 + sw, i / 10)
        hem.append((x, 330 + (16 if i % 2 else 0) + (i % 3) * 4))
    robe = [(-sx + 6, shy - 6), (-30, ny - 4), (30, ny - 4), (sx - 6, shy - 6), (sx + 8, shy + 50)] + hem + [(-sx - 8, shy + 50)]
    ctx.poly(robe, c["robe"], 6)
    ctx.poly([(sx - 20, shy + 40), (sx + 8, shy + 50), (sx + 40 + sw, 330), (sx + 10, 336), (sx - 30, 40)], c["robe_dk"], 0, None)
    for (px, py, w_, h_) in ((-60, -60, 34, 40), (30, 90, 40, 34), (-40, 180, 30, 36)):
        ctx.poly([(px, py), (px + w_, py - 4), (px + w_ + 2, py + h_), (px - 2, py + h_ + 2)], c["patch"], 3)
    ctx.ellipse(20, -150, 22, 14, c["stain"], 0, None)
    ctx.ellipse(-30, 40, 16, 10, c["stain"], 0, None)
    ctx.line([(-10, ny + 10), (6, 330)], 4)
    # rag wound round the neck
    ctx.poly([(-40, ny - 12), (40, ny - 12), (46, ny + 26), (0, ny + 46), (-46, ny + 26)], c["rag"], 4)
    ctx.line([(-30, ny + 4), (30, ny + 10)], 2, (140, 130, 110, 255))
    ctx.push(0, ny + 4, P(pose, "head", 6), 1.3)
    face3(ctx, pose, cfg, "plush")
    ctx.pop()
    for side in ("L", "R"):
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 14), shy + 14, "arm" + side, c["robe"],
            cuff=c["rag"], item_fn=C.get_item(pose, side), base_ang=base)
    ctx.pop()
    ctx.pop()


CH_CFG = dict(hrx=64, hry=74, eye_sep=24, brow=(110, 84, 58, 255), eye=CHICH["eye"], hair=CHICH["hair"],
              ua=170, fa=160, arm_w=50, th=220, sh=210, leg_w=58)


def draw_chichikov(ctx, pose):
    c = CHICH
    cfg = CH_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -440
    ctx.push(0, hipy, 0)
    ctx.poly([(-96, -10), (-8, -10), (-20, 250), (-70, 236)], c["coat_dk"], 5)
    ctx.poly([(96, -10), (8, -10), (20, 250), (70, 236)], c["coat_dk"], 5)
    ctx.pop()
    leg(ctx, pose, "L", cfg, -42, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 42, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -340
    shy = ny + 30
    sx = 116
    # tailcoat tails behind
    # belly / waistcoat
    ctx.poly([(-sx + 6, shy - 6), (-36, ny - 2), (36, ny - 2), (sx - 6, shy - 6), (sx + 12, shy + 60), (sx + 2, 30),
              (-sx - 2, 30), (-sx - 12, shy + 60)], c["coat"], 6)
    ctx.poly([(-40, ny + 20), (40, ny + 20), (54, 20), (0, 44), (-54, 20)], c["vest"], 4)
    ctx.poly([(-26, ny), (26, ny), (0, ny + 80)], c["shirt"], 3)
    ctx.poly([(-22, ny + 4), (22, ny + 4), (12, ny + 30), (-12, ny + 30)], c["tie"], 3)
    for by in (ny + 130, ny + 190, ny + 250):
        ctx.circle(0, by, 6, (200, 170, 80, 255), 3)
    # sparkle on the cranberry cloth
    for (sx_, sy_) in ((-80, ny + 90), (86, ny + 160), (-70, ny + 230)):
        ctx.line([(sx_ - 6, sy_), (sx_ + 6, sy_)], 2, (240, 190, 190, 255))
        ctx.line([(sx_, sy_ - 6), (sx_, sy_ + 6)], 2, (240, 190, 190, 255))
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.28)
    face3(ctx, pose, cfg, "chich")
    ctx.pop()
    for side in ("L", "R"):
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            item_fn=C.get_item(pose, side), base_ang=base)
    ctx.pop()
    ctx.pop()
