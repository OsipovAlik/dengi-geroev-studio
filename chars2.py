"""Raskolnikov & Alyona Ivanovna, built on the same puppet rig as the Sherlock episode."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, ctx_local, WHITE, INK

PALE = (234, 212, 190, 255)
PALE_SH = (210, 184, 160, 255)
OLD = (226, 196, 168, 255)
OLD_SH = (200, 168, 140, 255)

RASK = dict(
    coat=(92, 84, 74, 255), coat_dk=(70, 64, 56, 255), patch=(120, 104, 80, 255), trousers=(66, 62, 58, 255),
    shirt=(222, 214, 196, 255), scarf=(110, 50, 44, 255), hair=(112, 84, 56, 255), eye=(70, 58, 50, 255),
    hat=(140, 80, 50, 255), hat_dk=(110, 62, 40, 255), shoe=(40, 32, 28, 255),
)
ALYONA = dict(
    skirt=(70, 58, 52, 255), skirt_dk=(56, 46, 42, 255), jacket=(186, 154, 96, 255), fur=(226, 208, 168, 255),
    rag=(170, 160, 140, 255), hair=(214, 196, 150, 255), eye=(60, 70, 60, 255),
)


# ------------------------------------------------------------------ faces

def face2(ctx, pose, cfg, kind):
    turn = P(pose, "turn", 0.25)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    skin, skin_sh = (PALE, PALE_SH) if kind == "rask" else (OLD, OLD_SH)

    if kind == "alyona":  # tiny bun behind
        ctx.circle(-34 * turn - 10, cy - ry + 16, 20, cfg["hair"], 4)
    ear_x = rx - 4
    ctx.ellipse(-ear_x - 8 * turn + 4, cy + 4, 11, 17, skin, 4)
    ctx.ellipse(ear_x - 8 * turn - 4, cy + 4, 11, 17, skin, 4)
    ctx.poly([(-18, -10), (18, -10), (16, cy + 40), (-16, cy + 40)], skin, 4)
    # gaunt / sharp face
    pts = []
    taper = 0.22 if kind == "rask" else 0.3
    for i in range(40):
        a = math.radians(i * 9)
        r_x = rx * (1 - taper * max(0, math.sin(a)) ** 2)
        pts.append((math.cos(a) * r_x, cy + math.sin(a) * ry))
    ctx.poly(pts, skin, 5)
    # hollow cheeks / wrinkles
    if kind == "rask":
        ctx.line([(fx - 38, cy + 14), (fx - 30, cy + 40)], 3, (196, 166, 146, 255))
        ctx.line([(fx + 38, cy + 14), (fx + 30, cy + 40)], 3, (196, 166, 146, 255))
    else:
        for s in (-1, 1):
            ctx.line(bezier((fx + s * 18, cy + 24), (fx + s * 28, cy + 40), (fx + s * 22, cy + 56)), 3, (176, 140, 116, 255))
            ctx.line([(fx + s * 40, cy - 12), (fx + s * 48, cy - 6)], 2, (176, 140, 116, 255))
        ctx.line([(fx - 16, cy - 46), (fx + 16, cy - 46)], 2, (190, 156, 130, 255))
    ey = cy - 10
    er = 12 if kind == "rask" else 9
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = (9 if kind == "rask" else 6.5) * (1 - blink)
        if h > 1.5:
            ctx.ellipse(ex, ey, er, h, WHITE, 3)
            px = ex + look[0] * 4
            py = ey + look[1] * 2.5
            pr = min(5.5 if kind == "rask" else 4.5, h)
            ctx.ellipse(px, py, pr, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 2.5, min(2.5, pr), INK, 0, None)
            if kind == "alyona":  # glint
                ctx.ellipse(px + 1.5, py - 1.5, 1.4, 1.4, (255, 255, 255, 255), 0, None)
        else:
            ctx.line([(ex - er, ey), (ex + er, ey + 1)], 4)
        if kind == "rask":  # dark circles under eyes
            ctx.line(bezier((ex - 11, ey + 14), (ex, ey + 19), (ex + 11, ey + 14)), 3, (176, 150, 150, 255))
        by = ey - 19 - brow * 4
        inner = fx + side * 6
        outer = fx + side * (cfg["eye_sep"] + 14)
        inner_y = by + max(0, -brow) * 9 - max(0, brow) * 3
        outer_y = by - max(0, -brow) * 3
        ctx.line([(inner, inner_y), (outer, outer_y)], cfg.get("brow_w", 6), cfg["brow"])
    # nose
    s = 1 if turn >= 0 else -1
    if kind == "rask":
        ctx.poly([(fx - 2, ey + 4), (fx + s * 13, cy + 30), (fx + s * 1, cy + 34), (fx - s * 7, cy + 31)], skin_sh, 4)
    else:  # small sharp nose
        ctx.poly([(fx, ey + 4), (fx + s * 16, cy + 26), (fx - s * 4, cy + 28)], skin_sh, 4)
    my = cy + (50 if kind == "rask" else 42)
    mw = 17 if kind == "rask" else 13
    sm = P(pose, "smile", 0.0)
    if mouth == "frown":
        sm = -0.7
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 7, 9, (90, 40, 36, 255), 3)
    elif mouth == "grin":  # thin mean smile
        ctx.line(bezier((fx - mw - 4, my - 4), (fx, my + 10), (fx + mw + 4, my - 6)), 4)
        ctx.line([(fx + mw + 2, my - 6), (fx + mw + 8, my - 10)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 10 * sm), (fx + mw, my)), 4)
    # hair
    if kind == "rask":
        h = cfg["hair"]
        ctx.poly([(-rx - 6, cy + 20), (-rx - 4, cy - 40), (-34, cy - ry - 8), (14, cy - ry - 14), (rx + 4, cy - 44),
                  (rx + 8, cy + 18), (rx - 4, cy - 6), (rx - 12, cy - 30), (fx + 34, cy - ry + 22), (fx + 4, cy - ry + 30),
                  (fx - 24, cy - ry + 20), (-rx + 12, cy - 26), (-rx + 4, cy + 4)], h, 5)
        for k in (-30, -6, 20):
            ctx.line(bezier((k, cy - ry - 4), (k + 8, cy - ry + 20), (k + 2, cy - ry + 36)), 3, (80, 60, 40, 255))
        if P(pose, "hat", False):
            hc, hd = cfg["hat"], cfg["hat_dk"]
            base = cy - ry + 26
            ctx.poly([(-rx - 4, base + 8), (rx + 4, base + 8), (rx + 2, base - 6), (-rx - 2, base - 6)], hd, 4)
            ctx.poly([(-rx + 2, base - 2), (rx - 2, base - 2), (rx - 14, base - 100), (10, base - 108), (-12, base - 98),
                      (-rx + 12, base - 102)], hc, 5)
            ctx.ellipse(-1, base - 102, rx - 14, 11, hd, 4)
            ctx.line([(-16, base - 98), (-6, base - 76), (6, base - 100)], 3, hd)  # dent
            ctx.poly([(16, base - 60), (36, base - 63), (37, base - 42), (18, base - 40)], (156, 104, 70, 255), 3)  # patch
            ctx.ellipse(-26, base - 30, 6, 4, (60, 36, 26, 255), 0, None)  # hole
    else:
        h = cfg["hair"]
        ctx.poly([(-rx - 2, cy - 4), (-rx + 6, cy - 46), (-24, cy - ry - 6), (24, cy - ry - 6), (rx - 6, cy - 46),
                  (rx + 2, cy - 4), (rx - 8, cy - 30), (8, cy - ry + 14), (-rx + 8, cy - 30)], h, 4)
        for k in (-26, -8, 10, 26):
            ctx.line([(k * 0.4, cy - ry + 2), (k, cy - 40)], 2, (180, 160, 110, 255))


# ------------------------------------------------------------------ items

def item_bundle(ctx, pose, side, tot, hk):
    ctx.push(0, 30, -tot)
    ctx.ellipse(0, 0, 58, 44, (196, 176, 140, 255), 5)
    ctx.line([(-40, -10), (40, 12)], 3, (150, 130, 100, 255))
    ctx.poly([(-8, -46), (8, -46), (14, -62), (0, -54), (-14, -62)], (196, 176, 140, 255), 3)
    ctx.pop()
    hand(ctx, "fist")


def item_watch(ctx, pose, side, tot, hk):
    hand(ctx, "palm")
    ctx.push(0, 18, -tot)
    ctx.line(bezier((10, -6), (40, 30), (24, 60)), 3, (190, 190, 186, 255))
    ctx.circle(0, -20, 24, (200, 202, 200, 255), 4)
    ctx.circle(0, -20, 18, (240, 236, 222, 255), 2)
    ctx.line([(0, -20), (0, -32)], 2)
    ctx.line([(0, -20), (8, -16)], 2)
    ctx.circle(0, -48, 6, (200, 202, 200, 255), 3)
    ctx.pop()


def item_contract(ctx, pose, side, tot, hk):
    ctx.push(0, -34, -tot)
    ctx.poly([(-110, -260), (110, -260), (110, 30), (-110, 30)], (240, 232, 212, 255), 5)
    ctx.text(0, -222, "ДОГОВОР", 30, (40, 30, 24, 255))
    ctx.text(0, -192, "ЗАЙМА", 26, (40, 30, 24, 255))
    for i in range(5):
        ctx.line([(-86, -160 + i * 22), (86 - (i % 2) * 30, -160 + i * 22)], 3, (150, 140, 120, 255))
    ctx.text(-20, -30, "ПСК:", 34, (150, 30, 26, 255))
    ctx.text(62, -30, "?%", 38, (150, 30, 26, 255))
    k = P(pose, "circle_psk", 0.0)
    if k > 0:
        pts = ell_pts(18, -30, 92, 34, 40, -100, -100 + 360 * k)
        ctx.line(pts, 6, (200, 40, 30, 255))
    ctx.pop()
    hand(ctx, "fist")


C.ITEMS.update(bundle=item_bundle, watch=item_watch, contract=item_contract)

# ------------------------------------------------------------------ bodies

R_CFG = dict(hrx=54, hry=82, eye_sep=23, brow=(80, 60, 44, 255), eye=RASK["eye"], hair=RASK["hair"],
             hat=RASK["hat"], hat_dk=RASK["hat_dk"], ua=190, fa=180, arm_w=40, th=240, sh=232, leg_w=48)


def draw_rask(ctx, pose):
    c = RASK
    cfg = R_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -470
    leg(ctx, pose, "L", cfg, -34, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 34, hipy, "legR", c["trousers"], c["shoe"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -375
    shy = ny + 30
    sx = 88
    get = C.get_item
    if P(pose, "back_arm", None):
        side = pose["back_arm"]
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            cuff=c["shirt"], item_fn=get(pose, side), base_ang=base)
    sw = P(pose, "sway", 0)
    hem = []
    for i in range(9):  # ragged hem
        x = lerp(sx + 26 + sw, -sx - 26 + sw, i / 8)
        hem.append((x, 236 + (14 if i % 2 else 0)))
    coat = [(-sx + 6, shy - 6), (-30, ny - 4), (30, ny - 4), (sx - 6, shy - 6), (sx + 4, shy + 40), (sx - 6, 40)] + hem + \
           [(-sx + 6, 40), (-sx - 4, shy + 40)]
    ctx.poly(coat, c["coat"], 6)
    ctx.poly([(sx - 24, shy + 30), (sx + 2, shy + 44), (sx - 8, 40), (sx + 24 + sw, 236), (sx - 4, 240), (sx - 30, 40)],
             c["coat_dk"], 0, None)
    ctx.poly([(-70, -20), (-36, -26), (-34, 20), (-68, 24)], c["patch"], 3)  # patches
    ctx.poly([(40, ny + 200), (66, ny + 196), (68, ny + 226), (42, ny + 228)], c["patch"], 3)
    ctx.poly([(-26, ny - 2), (26, ny - 2), (0, ny + 120)], c["shirt"], 4)
    ctx.poly([(-32, ny - 6), (32, ny - 6), (26, ny + 22), (-26, ny + 22)], c["scarf"], 4)
    ctx.poly([(10, ny + 16), (30, ny + 16), (36, ny + 110), (16, ny + 104)], c["scarf"], 4)
    ctx.line([(-28, ny + 10), (-44, ny + 70), (-4, ny + 170), (-6, 30)], 4)
    ctx.line([(28, ny + 10), (44, ny + 70), (4, ny + 170)], 4)
    for by in (ny + 200, ny + 270):
        ctx.circle(-14, by, 5, (40, 36, 32, 255), 3)
    ctx.line([(0, 40), (0, 236)], 4)
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.3)
    face2(ctx, pose, cfg, "rask")
    ctx.pop()
    for side in ("L", "R"):
        if P(pose, "back_arm", None) == side or P(pose, "hide_arm" + side, False):
            continue
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            cuff=c["shirt"], item_fn=get(pose, side), base_ang=base)
    ctx.pop()
    ctx.pop()


A_CFG = dict(hrx=50, hry=62, eye_sep=19, brow=(170, 150, 110, 255), eye=ALYONA["eye"], hair=ALYONA["hair"],
             ua=140, fa=130, arm_w=40, brow_w=5)


def draw_alyona(ctx, pose):
    c = ALYONA
    cfg = A_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    ny = -560
    shy = ny + 30
    sx = 82
    ctx.poly([(-74, -380), (74, -380), (150, -20), (156, 0), (-156, 0), (-150, -20)], c["skirt"], 6)
    ctx.poly([(46, -380), (74, -380), (150, -20), (156, 0), (100, 0)], c["skirt_dk"], 0, None)
    # kacaveika (fur-trimmed jacket)
    ctx.poly([(-sx + 4, shy - 4), (-26, ny), (26, ny), (sx - 4, shy - 4), (sx + 8, shy + 50), (96, -300),
              (-96, -300), (-sx - 8, shy + 50)], c["jacket"], 6)
    ctx.poly([(-100, -330), (100, -330), (104, -294), (-104, -294)], c["fur"], 4)
    for x in range(-90, 100, 22):
        ctx.line([(x, -296), (x + 6, -284)], 3, c["fur"])
    ctx.poly([(-60, -460), (-40, -470), (-30, -430), (-54, -424)], (160, 130, 80, 255), 3)  # worn spot
    ctx.line([(0, ny + 20), (0, -330)], 4)
    # flannel rag round the neck
    ctx.poly([(-40, ny - 10), (40, ny - 10), (46, ny + 30), (0, ny + 48), (-46, ny + 30)], c["rag"], 4)
    ctx.push(0, ny + 2, P(pose, "head", 0), 1.25)
    face2(ctx, pose, cfg, "alyona")
    ctx.pop()
    for side in ("L", "R"):
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 12), shy + 12, "arm" + side, c["jacket"],
            cuff=c["fur"], item_fn=C.get_item(pose, side))
    ctx.pop()
