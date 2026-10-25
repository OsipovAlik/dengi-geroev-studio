import math
from engine import *

SKIN = (236, 200, 168, 255)
SKIN_SH = (214, 170, 138, 255)
BLUSH = (238, 178, 156, 255)
WHITE = (240, 232, 214, 255)

HOLMES = dict(
    coat=(56, 61, 70, 255), coat_dk=(42, 46, 54, 255), trousers=(72, 72, 80, 255),
    shirt=WHITE, cravat=(30, 28, 32, 255), hair=(38, 31, 27, 255), eye=(110, 130, 140, 255),
    shoe=(30, 24, 20, 255),
)
WATSON = dict(
    coat=(146, 108, 72, 255), coat_dk=(120, 88, 58, 255), vest=(112, 80, 54, 255),
    trousers=(110, 96, 80, 255), shirt=WHITE, tie=(118, 40, 36, 255), hair=(150, 110, 70, 255),
    stache=(128, 88, 54, 255), hat=(38, 32, 28, 255), eye=(92, 70, 48, 255), shoe=(48, 34, 26, 255),
)
HUDSON = dict(
    dress=(52, 76, 112, 255), dress_dk=(40, 60, 92, 255), apron=(242, 236, 222, 255),
    hair=(196, 192, 186, 255), cap=(250, 246, 236, 255), eye=(80, 90, 100, 255), shawl=(150, 70, 60, 255),
)


def P(pose, k, d):
    return pose.get(k, d)


# ---------------------------------------------------------------- face

def face(ctx, pose, cfg, kind):
    """head frame: origin at neck top. Head centre (0,-95)."""
    turn = P(pose, "turn", 0.25)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")

    # back hair (Hudson bun)
    if kind == "hudson":
        ctx.circle(-30 * turn, cy - ry + 6, 34, cfg["hair"], 5)
    # ears
    ear_x = rx - 4
    ctx.ellipse(-ear_x - 8 * turn + 4, cy + 4, 12, 18, SKIN, 4)
    ctx.ellipse(ear_x - 8 * turn - 4, cy + 4, 12, 18, SKIN, 4)
    # neck
    ctx.poly([(-22, -10), (22, -10), (20, cy + 40), (-20, cy + 40)], SKIN, 4)
    # face
    if kind == "holmes":
        pts = []
        for i in range(40):
            a = math.radians(i * 9)
            r_x = rx * (1 - 0.18 * max(0, math.sin(a)) ** 2)
            pts.append((math.cos(a) * r_x, cy + math.sin(a) * ry))
        ctx.poly(pts, SKIN, 5)
    else:
        ctx.ellipse(0, cy, rx, ry, SKIN, 5)
    # cheeks shading/blush
    if kind != "holmes":
        ctx.ellipse(fx - 36, cy + 22, 14, 9, BLUSH, 0, None)
        ctx.ellipse(fx + 36, cy + 22, 14, 9, BLUSH, 0, None)
    else:
        ctx.line([(fx - 40, cy + 8), (fx - 34, cy + 32)], 3, (190, 150, 120, 255))
        ctx.line([(fx + 40, cy + 8), (fx + 34, cy + 32)], 3, (190, 150, 120, 255))

    # eyes
    ey = cy - 10
    for side in (-1, 1):
        ex = fx + side * cfg["eye_sep"]
        h = 9 * (1 - blink)
        if h > 1.5:
            ctx.ellipse(ex, ey, 12, h, WHITE, 3)
            px = ex + look[0] * 5
            py = ey + look[1] * 3
            pr = min(6.0, h)
            ctx.ellipse(px, py, 6, pr, cfg["eye"], 0, None)
            ctx.ellipse(px, py, 3, min(3.0, pr), INK, 0, None)
            if blink > 0.25:  # heavy lids (squint)
                ctx.line([(ex - 13, ey - h + 1), (ex + 13, ey - h + 1)], 4)
        else:
            ctx.line([(ex - 12, ey), (ex + 12, ey + 1)], 4)
        # brows
        by = ey - 20 - brow * 4
        inner = fx + side * 7
        outer = fx + side * (cfg["eye_sep"] + 15)
        inner_y = by + max(0, -brow) * 9 - max(0, brow) * 3
        outer_y = by - max(0, -brow) * 3
        ctx.line([(inner, inner_y), (outer, outer_y)], cfg.get("brow_w", 6), cfg["brow"])

    # nose
    if kind == "holmes":
        s = 1 if turn >= 0 else -1
        ctx.poly([(fx - 3, ey + 2), (fx + s * 20, cy + 30), (fx + s * 2, cy + 36), (fx - s * 6, cy + 33)],
                 SKIN_SH, 4)
    elif kind == "watson":
        ctx.ellipse(fx + 4 * turn, cy + 22, 11, 13, SKIN_SH, 4)
    else:
        ctx.ellipse(fx + 3 * turn, cy + 18, 9, 10, SKIN_SH, 3)

    # mouth
    my = cy + (52 if kind == "holmes" else 46)
    mw = 20 if kind != "hudson" else 18
    sm = P(pose, "smile", 0.0)
    if mouth == "smile":
        sm = max(sm, 0.8)
    if mouth == "frown":
        sm = -0.7
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 8, 10, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - mw, my - 3), (fx, my + 20), (fx + mw, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - mw, my - 3), (fx + mw, my - 3)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 12 * sm), (fx + mw, my - 2 * abs(sm) * 0)), 4)
        if kind == "holmes" and sm > 0.3:  # smirk
            ctx.line([(fx + mw, my - 2), (fx + mw + 6, my - 7)], 3)

    # moustache
    if kind == "watson":
        ctx.poly([(fx - 2, my - 14), (fx - 24, my - 12), (fx - 36, my - 2), (fx - 20, my - 4), (fx, my - 6),
                  (fx + 20, my - 4), (fx + 36, my - 2), (fx + 24, my - 12)], cfg["stache"], 3)

    # hair
    if kind == "holmes":
        ctx.poly([(-rx - 2, cy + 2), (-rx + 2, cy - 42), (-30, cy - ry - 10), (20, cy - ry - 14),
                  (rx + 2, cy - 50), (rx + 3, cy - 4), (rx - 6, cy - 20), (fx + 30, cy - ry + 18),
                  (fx - 20, cy - ry + 14), (-rx + 10, cy - 30)], cfg["hair"], 5)
        ctx.line(bezier((-30, cy - ry), (0, cy - ry - 6), (40, cy - ry + 4)), 3, (90, 80, 76, 255))
    elif kind == "watson":
        if P(pose, "hat", False):
            ctx.poly([(-rx - 26, cy - ry + 30), (rx + 26, cy - ry + 30), (rx + 18, cy - ry + 18),
                      (-rx - 18, cy - ry + 18)], cfg["hat"], 4)
            ctx.poly(ell_pts(0, cy - ry + 18, rx - 4, 62, 30, 180, 360), cfg["hat"], 5)
            ctx.line([(-rx + 4, cy - ry + 12), (rx - 4, cy - ry + 12)], 6, (80, 40, 36, 255))
        else:
            ctx.poly([(-rx - 2, cy + 6), (-rx + 4, cy - 40), (-24, cy - ry - 6), (30, cy - ry - 4),
                      (rx, cy - 36), (rx + 2, cy + 4), (rx - 8, cy - 22), (fx + 10, cy - ry + 22),
                      (-rx + 12, cy - 26)], cfg["hair"], 5)
    else:  # hudson
        ctx.poly([(-rx - 4, cy + 10), (-rx, cy - 40), (-30, cy - ry - 6), (30, cy - ry - 6),
                  (rx, cy - 40), (rx + 4, cy + 10), (rx - 10, cy - 30), (0, cy - ry + 20),
                  (-rx + 10, cy - 30)], cfg["hair"], 5)
        ctx.poly(ell_pts(0, cy - ry + 4, 46, 22, 20, 180, 360), cfg["cap"], 4)


# ---------------------------------------------------------------- limbs

def hand(ctx, kind, col=SKIN, r=24):
    if kind == "fist":
        ctx.circle(0, r * 0.9, r, col, 4)
    elif kind == "point":
        ctx.circle(0, r * 0.9, r, col, 4)
        ctx.limb(0, r * 1.2, 0, r * 3.3, 15, 13, col, 4)
    elif kind == "palm":
        ctx.ellipse(0, r, r * 0.95, r * 1.15, col, 4)
        ctx.limb(-r * 0.7, r * 0.5, -r * 1.3, r * 0.1, 13, 11, col, 4)
    else:
        ctx.ellipse(0, r, r * 0.9, r * 1.1, col, 4)
        ctx.limb(r * 0.6, r * 0.6, r * 1.15, r * 1.2, 12, 10, col, 4)


def arm(ctx, pose, side, cfg, sx, sy, out_key, sleeve, cuff=WHITE, item_fn=None, base_ang=0.0):
    sign = 1 if side == "L" else -1
    out, elb = P(pose, out_key, (8, 10))
    L1, L2 = cfg["ua"], cfg["fa"]
    ctx.push(sx, sy, sign * out)
    ctx.limb(0, 0, 0, L1, cfg["arm_w"] + 6, cfg["arm_w"], sleeve, 5)
    ctx.push(0, L1, -sign * elb)
    ctx.limb(0, 0, 0, L2, cfg["arm_w"], cfg["arm_w"] - 6, sleeve, 5)
    ctx.poly([(-cfg["arm_w"] / 2 + 3, L2 - 8), (cfg["arm_w"] / 2 - 3, L2 - 8),
              (cfg["arm_w"] / 2 - 4, L2 + 4), (-cfg["arm_w"] / 2 + 4, L2 + 4)], cuff, 3)
    wr = P(pose, "wrot" + side, 0)
    ctx.push(0, L2 + 2, -sign * wr)
    hk = P(pose, "hand" + side, "open")
    if item_fn is None:
        hand(ctx, hk)
    tot = base_ang + sign * out - sign * elb - sign * wr
    pose["_hand_" + side] = ctx_local(ctx, 0, 24)
    if item_fn:
        item_fn(ctx, pose, side, tot, hk)
    ctx.pop(); ctx.pop(); ctx.pop()


def ctx_local(ctx, x, y):
    a, b, c, d, e, f = ctx.stack[-1]
    return (a * x + b * y + c, d * x + e * y + f)


def leg(ctx, pose, side, cfg, hx, hy, key, col, shoe):
    sign = 1 if side == "L" else -1
    h, k = P(pose, key, (2, 0))
    ctx.push(hx, hy, sign * h)
    ctx.limb(0, 0, 0, cfg["th"], cfg["leg_w"] + 8, cfg["leg_w"], col, 5)
    ctx.push(0, cfg["th"], sign * k)
    ctx.limb(0, 0, 0, cfg["sh"], cfg["leg_w"], cfg["leg_w"] - 6, col, 5)
    fd = P(pose, "face_dir", 1)
    ctx.push(0, cfg["sh"], -sign * (h + k))
    ctx.poly([(-cfg["leg_w"] / 2 - 2, -10), (cfg["leg_w"] / 2 + 2, -10),
              (cfg["leg_w"] / 2 + 6 + 18 * fd, 14), (-cfg["leg_w"] / 2 - 6 + 10 * fd * 0, 16)], shoe, 4)
    ctx.pop(); ctx.pop(); ctx.pop()


# ---------------------------------------------------------------- items

def item_coins(ctx, pose, side, tot, hk):
    hand(ctx, "palm")
    ctx.push(0, 20, -tot)
    n = P(pose, "coins" + side, P(pose, "coins", 3))
    for i in range(int(n)):
        ox = (i % 3 - 1) * 15
        oy = -18 - (i // 3) * 7 - (i % 2) * 3
        ctx.ellipse(ox, oy, 13, 6, (214, 170, 70, 255), 3)
        ctx.ellipse(ox, oy - 1, 7, 2.5, (240, 206, 110, 255), 0, None)
    ctx.pop()


def item_wallet(ctx, pose, side, tot, hk):
    ctx.push(0, 22, -tot)
    o = P(pose, "wallet_open", 1.0)
    ctx.poly([(-40, -26), (0, -18), (0, 26), (-40, 20)], (100, 62, 40, 255), 4)
    ctx.poly([(0, -18), (40 * o + 2, -26), (40 * o + 2, 20), (0, 26)], (124, 78, 50, 255), 4)
    ctx.line([(-34, -12), (-6, -8)], 3, (70, 40, 26, 255))
    ctx.pop()
    hand(ctx, "open")


def item_cane(ctx, pose, side, tot, hk):
    ctx.push(0, 20, -tot)
    Lc = P(pose, "cane_len", 330)
    ctx.limb(0, -8, 0, Lc, 12, 11, (112, 72, 40, 255), 4)
    ctx.poly(bezier((0, -6), (-4, -34), (-26, -30)) + bezier((-26, -18), (-10, -22), (6, -6)),
             (112, 72, 40, 255), 4)
    ctx.pop()
    hand(ctx, "fist")


def item_keys(ctx, pose, side, tot, hk):
    ctx.push(0, 30, -tot + P(pose, "keys_swing", 0))
    ctx.ellipse(0, 18, 16, 16, None, 4, (110, 96, 80, 255))
    for i, a in enumerate((-30, 0, 25)):
        ctx.push(0, 30, a)
        ctx.line([(0, 0), (0, 34)], 5, (126, 112, 92, 255))
        ctx.line([(0, 30), (8, 30)], 4, (126, 112, 92, 255))
        ctx.pop()
    ctx.pop()
    hand(ctx, "fist")


def item_pencil(ctx, pose, side, tot, hk):
    hand(ctx, "fist")
    ctx.push(0, 24, 0)
    ctx.line([(0, -20), (14, 36)], 6, (150, 110, 60, 255))
    ctx.pop()


def item_bow(ctx, pose, side, tot, hk):
    hand(ctx, "fist")


def item_point(ctx, pose, side, tot, hk):
    hand(ctx, "point")


ITEMS = dict(coins=item_coins, wallet=item_wallet, cane=item_cane, keys=item_keys, pencil=item_pencil,
             bow=item_bow, point=item_point)


def get_item(pose, side):
    k = P(pose, "item" + side, None)
    return ITEMS.get(k) if k else None


# ---------------------------------------------------------------- characters

H_CFG = dict(hrx=58, hry=80, eye_sep=24, brow=(34, 28, 24, 255), eye=HOLMES["eye"], hair=HOLMES["hair"],
             ua=190, fa=180, arm_w=42, th=240, sh=230, leg_w=52)


def draw_holmes(ctx, pose):
    c = HOLMES
    cfg = H_CFG
    bob = P(pose, "bob", 0)
    ctx.push(0, bob, 0)
    hipy = -470
    sway = P(pose, "sway", 0)
    # legs
    leg(ctx, pose, "L", cfg, -36, hipy, "legL", c["trousers"], c["shoe"])
    leg(ctx, pose, "R", cfg, 36, hipy, "legR", c["trousers"], c["shoe"])
    # torso frame
    ctx.push(0, hipy, P(pose, "lean", 0))
    ny = -375  # neck relative to hip
    shy = ny + 30
    sx = 92
    base = P(pose, "lean", 0)
    if P(pose, "back_arm", None):
        side = pose["back_arm"]
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            item_fn=get_item(pose, side), base_ang=base)
    # coat
    coat = [(-sx + 6, shy - 6), (-34, ny - 4), (34, ny - 4), (sx - 6, shy - 6), (sx + 4, shy + 40),
            (sx - 8, 40), (sx + 22 + sway, 220), (12, 236), (-12, 236), (-sx - 22 + sway, 220), (-sx + 8, 40),
            (-sx - 4, shy + 40)]
    ctx.poly(coat, c["coat"], 6)
    # shading on one side
    ctx.poly([(sx - 26, shy + 30), (sx + 2, shy + 44), (sx - 10, 40), (sx + 20 + sway, 218), (sx - 6, 222),
              (sx - 30, 40)], c["coat_dk"], 0, None)
    # shirt + cravat
    ctx.poly([(-30, ny - 2), (30, ny - 2), (0, ny + 150)], c["shirt"], 4)
    ctx.poly([(-20, ny + 4), (20, ny + 4), (8, ny + 36), (-8, ny + 36)], c["cravat"], 3)
    ctx.poly([(-8, ny + 30), (8, ny + 30), (12, ny + 90), (0, ny + 104), (-12, ny + 90)], c["cravat"], 3)
    # lapels
    ctx.line([(-30, ny - 2), (-46, ny + 60), (-6, ny + 160), (-8, 30)], 4)
    ctx.line([(30, ny - 2), (46, ny + 60), (6, ny + 160)], 4)
    for by in (ny + 190, ny + 250, ny + 310):
        ctx.circle(-16, by, 6, (30, 30, 34, 255), 3)
    ctx.line([(0, 40), (0, 236)], 4)
    # head
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.32)
    face(ctx, pose, cfg, "holmes")
    ctx.pop()
    # arms
    for side in ("L", "R"):
        if P(pose, "back_arm", None) == side:
            continue
        if P(pose, "hide_arm" + side, False):
            continue
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            item_fn=get_item(pose, side), base_ang=base)
    if P(pose, "violin", False):
        pose["_chin"] = ctx_local(ctx, -46, ny - 4)
    ctx.pop()
    ctx.pop()
    if P(pose, "violin", False):
        draw_violin(ctx, pose)


def draw_violin(ctx, pose):
    cx, cy = pose["_chin"]
    hx, hy = pose["_hand_L"]
    dx, dy = hx - cx, hy - cy
    L = math.hypot(dx, dy)
    ang = math.degrees(math.atan2(dx / L, -dy / L))
    ctx.push(cx, cy, ang)
    # body centred just behind the chin, neck running to the hand
    ctx.poly(bezier((0, -20), (-46, -10), (-40, 50)) + bezier((-40, 50), (-30, 80), (-44, 120)) +
             bezier((-44, 120), (0, 170), (44, 120)) + bezier((44, 120), (30, 80), (40, 50)) +
             bezier((40, 50), (46, -10), (0, -20)), (150, 78, 34, 255), 5)
    ctx.line([(-12, 60), (-16, 84)], 3)
    ctx.line([(12, 60), (16, 84)], 3)
    ctx.poly([(-10, 96), (10, 96), (10, 104), (-10, 104)], (40, 30, 24, 255), 2)
    ctx.limb(0, -10, 0, -L + 10, 16, 12, (40, 30, 24, 255), 4)
    ctx.circle(0, -L + 2, 12, (120, 64, 30, 255), 4)
    for sx_ in (-4, 4):
        ctx.line([(sx_, 100), (sx_ * 0.6, -L + 20)], 1.5, (230, 220, 200, 255))
    bxl, byl = 0, 76  # bowing point on the strings
    ctx.pop()
    r = math.radians(ang)
    bx = cx + bxl * math.cos(r) - byl * math.sin(r)
    by = cy + bxl * math.sin(r) + byl * math.cos(r)
    hx2, hy2 = pose.get("_hand_R", (60, -300))
    ddx, ddy = bx - hx2, by - hy2
    dl = math.hypot(ddx, ddy) or 1
    ux, uy = ddx / dl, ddy / dl
    p0 = (hx2 - ux * 30, hy2 - uy * 30)
    p1 = (hx2 + ux * 330, hy2 + uy * 330)
    ctx.line([p0, p1], 6, (90, 54, 30, 255))
    ctx.line([(p0[0], p0[1] + 6), (p1[0], p1[1] + 6)], 2, (230, 220, 200, 255))
    ctx.push(hx2, hy2, 0)
    hand(ctx, "fist")
    ctx.pop()


def _old_violin(ctx, pose):
    # violin tucked under chin on screen-left shoulder, pointing to screen-left/up
    ctx.push(-50, -350, -58)
    ctx.poly(bezier((0, 0), (-46, 10), (-40, 70)) + bezier((-40, 70), (-30, 100), (-44, 140)) +
             bezier((-44, 140), (0, 190), (44, 140)) + bezier((44, 140), (30, 100), (40, 70)) +
             bezier((40, 70), (46, 10), (0, 0)), (150, 78, 34, 255), 5)
    ctx.line([(-10, 90), (-14, 110)], 3)
    ctx.line([(10, 90), (14, 110)], 3)
    ctx.poly([(-8, 120), (8, 120), (8, 128), (-8, 128)], (40, 30, 24, 255), 2)
    ctx.limb(0, 0, 0, -170, 16, 12, (40, 30, 24, 255), 4)
    ctx.circle(0, -182, 12, (120, 64, 30, 255), 4)
    ctx.pop()
    # bow from right hand
    hx, hy = pose.get("_hand_R", (60, -300))
    a = math.radians(P(pose, "bow_ang", 200))
    L = 300
    p0 = (hx - math.cos(a) * 40, hy - math.sin(a) * 40)
    p1 = (hx + math.cos(a) * L, hy + math.sin(a) * L)
    ctx.line([p0, p1], 6, (90, 54, 30, 255))
    ctx.line([(p0[0], p0[1] + 6), (p1[0], p1[1] + 6)], 2, (230, 220, 200, 255))


W_CFG = dict(hrx=64, hry=72, eye_sep=24, brow=(120, 84, 52, 255), eye=WATSON["eye"], hair=WATSON["hair"],
             ua=170, fa=160, arm_w=50, th=220, sh=210, leg_w=58, stache=WATSON["stache"], hat=WATSON["hat"])


def draw_watson(ctx, pose):
    c = WATSON
    cfg = W_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    sit = P(pose, "sit", False)
    hipy = -440 if not sit else -380
    if not sit:
        leg(ctx, pose, "L", cfg, -42, hipy, "legL", c["trousers"], c["shoe"])
        leg(ctx, pose, "R", cfg, 42, hipy, "legR", c["trousers"], c["shoe"])
    else:
        for s in (-1, 1):
            ctx.limb(s * 46, hipy, s * 62, hipy + 70, 84, 76, c["trousers"], 5)
            ctx.limb(s * 62, hipy + 70, s * 66, -14, 62, 54, c["trousers"], 5)
            ctx.poly([(s * 66 - 34, -24), (s * 66 + 34, -24), (s * 66 + 38, 10), (s * 66 - 38, 10)], c["shoe"], 4)
    ctx.push(0, hipy, P(pose, "lean", 0))
    ny = -340
    shy = ny + 30
    sx = 112
    base = P(pose, "lean", 0)
    if P(pose, "back_arm", None):
        side = pose["back_arm"]
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            item_fn=get_item(pose, side), base_ang=base)
    jacket = [(-sx + 6, shy - 6), (-36, ny - 2), (36, ny - 2), (sx - 6, shy - 6), (sx + 8, shy + 40),
              (sx + 2, 0), (sx + 10, 56), (14, 70), (-14, 70), (-sx - 10, 56), (-sx - 2, 0), (-sx - 8, shy + 40)]
    ctx.poly(jacket, c["coat"], 6)
    # tweed check
    for yy in range(int(shy + 20), 60, 34):
        ctx.line([(-sx + 4, yy), (-44, yy)], 2, (120, 86, 56, 200))
        ctx.line([(44, yy), (sx - 2, yy)], 2, (120, 86, 56, 200))
    # waistcoat
    ctx.poly([(-34, ny + 2), (34, ny + 2), (48, 20), (0, 44), (-48, 20)], c["vest"], 4)
    ctx.poly([(-26, ny), (26, ny), (0, ny + 90)], c["shirt"], 3)
    ctx.poly([(-12, ny + 6), (12, ny + 6), (6, ny + 70), (0, ny + 80), (-6, ny + 70)], c["tie"], 3)
    for by in (ny + 130, ny + 180, ny + 230, ny + 280):
        ctx.circle(0, by, 5, (70, 50, 34, 255), 2)
    ctx.line(bezier((-30, ny + 220), (0, ny + 240), (30, ny + 220)), 3, (200, 170, 80, 255))  # watch chain
    ctx.line([(-36, ny - 2), (-56, ny + 70), (-44, 30)], 4)
    ctx.line([(36, ny - 2), (56, ny + 70), (44, 30)], 4)
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.3)
    face(ctx, pose, cfg, "watson")
    ctx.pop()
    for side in ("L", "R"):
        if P(pose, "back_arm", None) == side:
            continue
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["coat"],
            item_fn=get_item(pose, side), base_ang=base)
    if sit and P(pose, "notebook", False):
        ctx.push(0, 40, 0)
        ctx.poly([(-70, -10), (70, -24), (80, 60), (-60, 76)], (236, 226, 200, 255), 4)
        ctx.line([(4, -16), (10, 68)], 3)
        for i in range(4):
            ctx.line([(-50, 8 + i * 15), (-10, 4 + i * 15)], 2, (120, 100, 80, 255))
        ctx.pop()
    ctx.pop()
    ctx.pop()


U_CFG = dict(hrx=64, hry=68, eye_sep=24, brow=(150, 140, 130, 255), eye=HUDSON["eye"], hair=HUDSON["hair"],
             cap=HUDSON["cap"], ua=160, fa=145, arm_w=50, brow_w=5)


def draw_hudson(ctx, pose):
    c = HUDSON
    cfg = U_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    ny = -720
    shy = ny + 34
    sx = 108
    skirt = [(-90, -500), (90, -500), (190, -30), (200, 0), (-200, 0), (-190, -30)]
    ctx.poly(skirt, c["dress"], 6)
    ctx.poly([(60, -500), (90, -500), (190, -30), (200, 0), (140, 0)], c["dress_dk"], 0, None)
    # bodice
    ctx.poly([(-sx + 4, shy - 4), (-30, ny), (30, ny), (sx - 4, shy - 4), (sx + 6, shy + 60), (96, -496),
              (-96, -496), (-sx - 6, shy + 60)], c["dress"], 6)
    # apron
    ctx.poly([(-70, -520), (70, -520), (120, -40), (-120, -40)], c["apron"], 5)
    ctx.poly([(-50, -640), (50, -640), (56, -520), (-56, -520)], c["apron"], 4)
    ctx.line([(-96, -522), (96, -522)], 8, (220, 210, 190, 255))
    ctx.poly([(-40, -300), (40, -300), (36, -220), (-36, -220)], c["apron"], 3)
    # shawl collar
    ctx.poly([(-sx, shy), (-30, ny - 2), (30, ny - 2), (sx, shy), (40, ny + 90), (0, ny + 110),
              (-40, ny + 90)], c["shawl"], 5)
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.25)
    face(ctx, pose, cfg, "hudson")
    ctx.pop()
    for side in ("L", "R"):
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * (sx - 16), shy + 14, "arm" + side, c["dress"],
            cuff=c["apron"], item_fn=get_item(pose, side))
    ctx.pop()
