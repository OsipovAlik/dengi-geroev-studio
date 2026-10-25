"""Mr Micawber (Dickens) on the shared puppet rig. Original design:
stout, egg-bald head, enormous shirt collar, brown surtout, black tights, jaunty tasselled stick, quizzing-glass."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, WHITE, INK

PINK = (238, 196, 168, 255)
PINK_SH = (214, 166, 138, 255)
MIC = dict(coat=(118, 82, 52, 255), coat_dk=(96, 64, 40, 255), vest=(196, 168, 96, 255), tights=(40, 36, 40, 255),
           collar=(248, 244, 232, 255), cravat=(70, 40, 60, 255), hair=(150, 120, 96, 255), eye=(80, 70, 60, 255),
           shoe=(28, 24, 22, 255))


def face4(ctx, pose, cfg):
    turn = P(pose, "turn", 0.25)
    fx = 18 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    skin, skin_sh = PINK, PINK_SH
    # ears
    ctx.ellipse(-rx + 2 - 8 * turn, cy + 10, 13, 19, skin, 4)
    ctx.ellipse(rx - 2 - 8 * turn, cy + 10, 13, 19, skin, 4)
    # side fringe of hair (bald crown)
    for sd in (-1, 1):
        ctx.poly([(sd * (rx + 4), cy + 26), (sd * (rx + 12), cy - 4), (sd * (rx + 2), cy - 30), (sd * (rx - 12), cy - 18),
                  (sd * (rx - 8), cy + 18)], cfg["hair"], 4)
    # egg-shaped, broad face: wider at the jaw
    pts = []
    for i in range(40):
        a = math.radians(i * 9)
        s = math.sin(a)
        r_x = rx * (1 + 0.10 * max(0, s)) * (0.92 if s < -0.3 else 1.0)
        r_y = ry * (1.08 if s < 0 else 1.0)
        pts.append((math.cos(a) * r_x, cy + s * r_y))
    ctx.poly(pts, skin, 5)
    # shine on bald head
    ctx.ellipse(-22 + fx * 0.4, cy - ry * 0.72, 18, 8, (252, 228, 206, 255), 0, None)
    # cheeks
    ctx.ellipse(fx - 42, cy + 26, 15, 10, (240, 166, 144, 255), 0, None)
    ctx.ellipse(fx + 42, cy + 26, 15, 10, (240, 166, 144, 255), 0, None)
    ey = cy - 8
    er = 10
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = 8 * (1 - blink)
        if h > 1.5:
            ctx.ellipse(ex, ey, er, h, WHITE, 3)
            px, py = ex + look[0] * 4, ey + look[1] * 2.5
            pr = min(4.6, h)
            ctx.ellipse(px, py, pr, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 2.2, min(2.2, pr), INK, 0, None)
        else:
            ctx.line([(ex - er, ey), (ex + er, ey + 1)], 4)
        by = ey - 20 - brow * 5
        inner = fx + side * 8
        outer = fx + side * (cfg["eye_sep"] + 16)
        inner_y = by + max(0, -brow) * 9 - max(0, brow) * 4
        outer_y = by - max(0, -brow) * 3 + 2
        ctx.line([(inner, inner_y), ((inner + outer) / 2, min(inner_y, outer_y) - 5), (outer, outer_y)], 6, cfg["brow"])
    # quizzing-glass held to the right eye
    if P(pose, "glass", False):
        ex = fx + cfg["eye_sep"]
        ctx.ellipse(ex, ey, 19, 19, (220, 236, 240, 120), 4, (150, 120, 60, 255))
    # round nose
    ctx.ellipse(fx + 4 * turn, cy + 18, 13, 12, skin_sh, 4)
    my = cy + 44
    mw = 22
    sm = P(pose, "smile", 0.4)
    if mouth == "frown":
        sm = -0.7
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 8, 10, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - mw, my - 3), (fx, my + 20), (fx + mw, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - mw, my - 3), (fx + mw, my - 3)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 11 * sm), (fx + mw, my)), 4)
    # double chin line
    ctx.line(bezier((fx - 30, cy + ry - 4), (fx, cy + ry + 6), (fx + 30, cy + ry - 4)), 3, (200, 150, 124, 255))


def item_stick(ctx, pose, side, tot, hk):
    """jaunty stick with a pair of tassels"""
    ctx.push(0, 20, -tot + P(pose, "stick_ang", 0))
    Lc = 300
    ctx.limb(0, -60, 0, Lc, 12, 10, (60, 40, 30, 255), 4)
    ctx.circle(0, -64, 13, (200, 170, 80, 255), 3)
    sw = P(pose, "tassel_swing", 0)
    for dx in (-10, 10):
        ctx.push(dx, -30, sw + dx)
        ctx.line([(0, 0), (0, 30)], 3, (150, 110, 60, 255))
        ctx.poly([(-8, 28), (8, 28), (10, 56), (-10, 56)], (180, 120, 60, 255), 3)
        ctx.pop()
    ctx.pop()
    hand(ctx, "fist", PINK)


def item_quill(ctx, pose, side, tot, hk):
    hand(ctx, "fist", PINK)
    ctx.push(0, 24, -tot + 30)
    ctx.poly([(0, 10), (10, -40), (26, -110), (8, -100), (-4, -40)], (246, 242, 230, 255), 3)
    ctx.line([(0, 10), (16, -100)], 2)
    ctx.pop()


def item_letter(ctx, pose, side, tot, hk):
    ctx.push(0, 30, -tot)
    ctx.poly([(-46, -34), (46, -34), (46, 34), (-46, 34)], (244, 236, 214, 255), 4)
    for y in (-14, 0, 14):
        ctx.line([(-34, y), (34, y)], 2, (120, 100, 80, 255))
    ctx.pop()
    hand(ctx, "fist", PINK)


C.ITEMS.update(stick=item_stick, quill=item_quill, letter=item_letter)


MI_CFG = dict(hrx=70, hry=78, eye_sep=26, brow=(130, 100, 78, 255), eye=MIC["eye"], hair=MIC["hair"],
              ua=165, fa=155, arm_w=50, th=210, sh=205, leg_w=50)


def _arm(ctx, pose, side, cfg, sx, sy, base):
    # hands drawn in pink skin: temporarily wrap hand drawing
    arm(ctx, pose, side, cfg, sx, sy, "arm" + side, MIC["coat"], cuff=MIC["collar"],
        item_fn=C.get_item(pose, side), base_ang=base)


def draw_micawber(ctx, pose):
    c = MIC
    cfg = MI_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -425
    # coat tails behind legs
    ctx.push(0, hipy, 0)
    ctx.poly([(-104, -20), (-6, -20), (-22, 230), (-80, 214)], c["coat_dk"], 5)
    ctx.poly([(104, -20), (6, -20), (22, 230), (80, 214)], c["coat_dk"], 5)
    ctx.pop()
    leg(ctx, pose, "L", cfg, -40, hipy, "legL", c["tights"], c["shoe"])
    leg(ctx, pose, "R", cfg, 40, hipy, "legR", c["tights"], c["shoe"])
    base = P(pose, "lean", -4)
    ctx.push(0, hipy, base)
    ny = -330
    shy = ny + 30
    sx = 122
    # stout body
    body = [(-sx + 8, shy - 6), (-40, ny - 2), (40, ny - 2), (sx - 8, shy - 6), (sx + 18, shy + 90), (sx + 14, -10),
            (sx - 10, 30), (-sx + 10, 30), (-sx - 14, -10), (-sx - 18, shy + 90)]
    ctx.poly(body, c["coat"], 6)
    ctx.poly([(sx - 26, shy + 30), (sx + 18, shy + 90), (sx + 14, -10), (sx - 10, 30), (sx - 40, 20)], c["coat_dk"], 0, None)
    # waistcoat with watch chain
    ctx.poly([(-46, ny + 30), (46, ny + 30), (62, 0), (0, 36), (-62, 0)], c["vest"], 4)
    ctx.line(bezier((-40, ny + 200), (0, ny + 240), (40, ny + 200)), 3, (200, 170, 80, 255))
    for by in (ny + 120, ny + 175, ny + 230, ny + 285):
        ctx.circle(0, by, 6, (120, 90, 40, 255), 3)
    # lapels
    ctx.line([(-36, ny), (-60, ny + 80), (-46, ny + 300)], 4)
    ctx.line([(36, ny), (60, ny + 80), (46, ny + 300)], 4)
    # cravat + the imposing shirt-collar
    ctx.poly([(-26, ny + 2), (26, ny + 2), (14, ny + 46), (-14, ny + 46)], c["cravat"], 3)
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.28)
    face4(ctx, pose, cfg)
    # collar points rising up the cheeks (drawn over jaw)
    for sd in (-1, 1):
        ctx.poly([(sd * 10, -6), (sd * 64, -2), (sd * 78, -70), (sd * 54, -40)], c["collar"], 4)
    ctx.pop()
    # quizzing-glass on a ribbon hanging outside the coat
    if not P(pose, "glass", False):
        ctx.line(bezier((-30, ny + 60), (-70, ny + 160), (-56, ny + 200)), 2, INK)
        ctx.ellipse(-56, ny + 214, 15, 15, (220, 236, 240, 255), 4, (150, 120, 60, 255))
    for side in ("L", "R"):
        _arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 18), shy + 16, base)
    ctx.pop()
    ctx.pop()
