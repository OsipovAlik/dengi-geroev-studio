"""Strekoza (Dragonfly) and Muravey (Ant) from Krylov's fable, original storybook designs on the shared rig."""
import math
from engine import *
import chars as C
from chars import P, arm, leg, hand, WHITE, INK

DRAG = dict(body=(86, 170, 160, 255), body_dk=(56, 130, 124, 255), eye=(40, 110, 150, 255), eye_hi=(170, 220, 240, 255),
            dress=(232, 120, 120, 255), dress_dk=(200, 90, 96, 255), skin=(150, 210, 196, 255), wing=(220, 240, 250, 150),
            wing_ol=(90, 140, 160, 255), flower=(250, 220, 90, 255))
ANT = dict(body=(120, 62, 40, 255), body_dk=(92, 44, 28, 255), apron=(236, 226, 200, 255), cap=(70, 90, 60, 255),
           skin=(150, 82, 54, 255), eye=(30, 22, 18, 255))


def _hand(col):
    def h(ctx, kind, c=None, r=22):
        hand(ctx, kind, col, r)
    return h


def insect_face(ctx, pose, kind, cfg):
    turn = P(pose, "turn", 0.2)
    fx = 16 * turn
    rx, ry = cfg["hrx"], cfg["hry"]
    cy = -95
    blink = P(pose, "blink", 0.0)
    look = P(pose, "look", (turn, 0))
    brow = P(pose, "brow", 0.0)
    mouth = P(pose, "mouth", "neutral")
    skin = cfg["skin"]
    # antennae
    sw = P(pose, "ant_swing", 0)
    for sd in (-1, 1):
        x0, y0 = sd * 20 + fx * 0.3, cy - ry + 8
        tip = (sd * (60 + 10 * sw) + fx, cy - ry - 110 + 8 * sw * sd)
        ctx.line(bezier((x0, y0), (sd * 14, cy - ry - 70), tip), 5, INK)
        ctx.circle(tip[0], tip[1], 9 if kind == "drag" else 8, cfg["body_dk"], 3)
    ctx.ellipse(0, cy, rx, ry, skin, 5)
    if kind == "drag":
        er, eh = 30, 34
        ey = cy - 10
        sep = 32
    else:
        er, eh = 15, 18
        ey = cy - 8
        sep = 26
    for side in (-1, 1):
        ex = fx + side * sep
        h = eh * (1 - blink)
        if h > 2:
            if kind == "drag":
                ctx.ellipse(ex, ey, er, h, cfg["eye"], 4)
                ctx.ellipse(ex + look[0] * 6 - 8, ey - h * 0.35 + look[1] * 3, 9, min(9, h * 0.4), cfg["eye_hi"], 0, None)
                ctx.ellipse(ex + look[0] * 7, ey + look[1] * 5, 7, min(7, h * 0.3), INK, 0, None)
            else:
                ctx.ellipse(ex, ey, er, h, WHITE, 3)
                ctx.ellipse(ex + look[0] * 5, ey + look[1] * 4, 8, min(9, h), cfg["eye"], 0, None)
                ctx.ellipse(ex + look[0] * 5 - 3, ey + look[1] * 4 - 3, 2.5, 2.5, WHITE, 0, None)
        else:
            ctx.line([(ex - er, ey), (ex + er, ey)], 4)
        by = ey - eh - 10 - brow * 5
        inner_y = by + max(0, -brow) * 10 - max(0, brow) * 3
        ctx.line([(fx + side * (sep - er + 2), inner_y), (fx + side * (sep + er - 4), by)], 5, INK)
    my = cy + (46 if kind == "drag" else 40)
    mw = 16
    sm = P(pose, "smile", 0.4)
    if mouth == "frown":
        sm = -0.7
    if mouth == "o":
        ctx.ellipse(fx, my + 2, 8, 10, (90, 40, 36, 255), 3)
    elif mouth == "grin":
        ctx.poly(bezier((fx - mw, my - 3), (fx, my + 18), (fx + mw, my - 3)), (120, 50, 44, 255), 3)
        ctx.line([(fx - mw, my - 3), (fx + mw, my - 3)], 3)
    else:
        ctx.line(bezier((fx - mw, my), (fx, my + 10 * sm), (fx + mw, my)), 4)
    if kind == "ant":
        # mandibles
        for sd in (-1, 1):
            ctx.poly([(fx + sd * 22, my + 12), (fx + sd * 34, my + 22), (fx + sd * 14, my + 30)], cfg["body_dk"], 3)
        # cap
        if P(pose, "cap", True):
            ctx.poly([(-rx + 4, cy - ry * 0.45), (rx - 4, cy - ry * 0.45), (rx - 14, cy - ry - 4), (-rx + 14, cy - ry - 4)],
                     ANT["cap"], 4)
            ctx.poly([(fx * 0.5, cy - ry * 0.45), (fx * 0.5 + 70 * (1 if turn >= 0 else -1), cy - ry * 0.4),
                      (fx * 0.5 + 60 * (1 if turn >= 0 else -1), cy - ry * 0.3), (fx * 0.5, cy - ry * 0.3)], ANT["cap"], 4)
    else:
        ctx.ellipse(fx - 44, cy + 34, 10, 7, (240, 160, 160, 255), 0, None)
        ctx.ellipse(fx + 44, cy + 34, 10, 7, (240, 160, 160, 255), 0, None)
        # flower behind the ear
        fxp, fyp = -rx + 6, cy - ry + 26
        for k in range(5):
            a = math.radians(k * 72)
            ctx.circle(fxp + math.cos(a) * 12, fyp + math.sin(a) * 12, 10, DRAG["flower"], 3)
        ctx.circle(fxp, fyp, 7, (230, 120, 60, 255), 2)


# ------------------------------------------------------------------ items

def item_grain(ctx, pose, side, tot, hk):
    ctx.push(0, 40, -tot)
    ctx.ellipse(0, -10, 40, 28, (230, 190, 100, 255), 4)
    ctx.line([(-20, -16), (20, -4)], 3, (190, 150, 70, 255))
    ctx.pop()
    hand(ctx, "fist", ANT["skin"])


def item_sack(ctx, pose, side, tot, hk):
    ctx.push(0, 60, -tot)
    ctx.poly([(-50, -40), (50, -40), (64, 60), (0, 80), (-64, 60)], (200, 176, 120, 255), 4)
    ctx.line([(-40, -40), (40, -40)], 6, (140, 110, 70, 255))
    ctx.pop()
    hand(ctx, "fist", ANT["skin"])


def item_mic_flower(ctx, pose, side, tot, hk):
    hand(ctx, "fist", DRAG["skin"])
    ctx.push(0, 24, -tot)
    ctx.line([(0, 30), (0, -60)], 5, (70, 130, 60, 255))
    for k in range(6):
        a = math.radians(k * 60)
        ctx.ellipse(math.cos(a) * 16, -70 + math.sin(a) * 16, 12, 12, (240, 140, 170, 255), 3)
    ctx.circle(0, -70, 9, (250, 210, 80, 255), 2)
    ctx.pop()


C.ITEMS.update(grain=item_grain, sack=item_sack, flowermic=item_mic_flower)

D_CFG = dict(hrx=72, hry=66, ua=150, fa=140, arm_w=26, th=200, sh=200, leg_w=26, skin=DRAG["skin"], body_dk=DRAG["body_dk"],
             eye=DRAG["eye"], eye_hi=DRAG["eye_hi"])
A_CFG = dict(hrx=62, hry=58, ua=140, fa=130, arm_w=36, th=170, sh=170, leg_w=38, skin=ANT["skin"], body_dk=ANT["body_dk"],
             eye=ANT["eye"])


def _wings(ctx, pose, y):
    flap = P(pose, "flap", 0.0)
    for sd in (-1, 1):
        for k, (ang, ln, wd) in enumerate(((-28, 300, 70), (-6, 270, 60))):
            a = ang + flap * (10 + 6 * k)
            ctx.push(sd * 20, y + k * 50, sd * (90 + a))
            pts = [(0, 0)] + [(math.sin(math.radians(i * 180 / 16)) * wd * (1 if i < 9 else 0.8), -ln * i / 16) for i in range(17)]
            pts = [(x, yy) for x, yy in pts]
            ctx.poly([(0, 0), (wd, -ln * 0.3), (wd * 0.9, -ln * 0.8), (0, -ln), (-wd * 0.5, -ln * 0.7), (-wd * 0.4, -ln * 0.2)],
                     DRAG["wing"], 3, DRAG["wing_ol"])
            ctx.line([(0, 0), (wd * 0.2, -ln * 0.9)], 2, DRAG["wing_ol"])
            ctx.pop()


def draw_dragonfly(ctx, pose):
    c = DRAG
    cfg = D_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -400
    shiver = P(pose, "shiver", 0)
    ctx.push(shiver, 0, 0)
    leg(ctx, pose, "L", cfg, -18, hipy, "legL", c["body"], c["body_dk"])
    leg(ctx, pose, "R", cfg, 18, hipy, "legR", c["body"], c["body_dk"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -300
    # long segmented tail curling behind
    tail = bezier((0, -40), (-120, 40), (-210, -20), (-260, -140), 10)
    for i, (x, y) in enumerate(tail[1:]):
        ctx.ellipse(x, y, 20 - i, 16 - i * 0.6, c["body"] if i % 2 else c["body_dk"], 3)
    _wings(ctx, pose, ny + 50)
    # dress
    ctx.poly([(-36, ny + 30), (36, ny + 30), (50, -60), (110, 40), (0, 56), (-110, 40), (-50, -60)], c["dress"], 5)
    ctx.poly([(-110, 40), (0, 56), (110, 40), (96, 20), (0, 34), (-96, 20)], c["dress_dk"], 3)
    ctx.poly([(-34, ny + 10), (34, ny + 10), (40, ny + 120), (-40, ny + 120)], c["body"], 4)
    for yy in (ny + 50, ny + 90):
        ctx.line([(-36, yy), (36, yy)], 3, c["body_dk"])
    ctx.push(0, ny + 6, P(pose, "head", 0), 1.25)
    insect_face(ctx, pose, "drag", cfg)
    ctx.pop()
    for side in ("L", "R"):
        it = C.get_item(pose, side)
        old = C.hand
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * 36, ny + 30, "arm" + side, c["body"], cuff=c["dress"],
            item_fn=it or (lambda ctx_, pose_, s_, tot, hk: hand(ctx_, hk, c["skin"], 20)), base_ang=base)
    ctx.pop()
    ctx.pop()
    ctx.pop()


def draw_ant(ctx, pose):
    c = ANT
    cfg = A_CFG
    ctx.push(0, P(pose, "bob", 0), 0)
    hipy = -340
    leg(ctx, pose, "L", cfg, -30, hipy, "legL", c["body"], c["body_dk"])
    leg(ctx, pose, "R", cfg, 30, hipy, "legR", c["body"], c["body_dk"])
    base = P(pose, "lean", 0)
    ctx.push(0, hipy, base)
    ny = -300
    # abdomen behind
    ctx.ellipse(-70, 10, 90, 70, c["body_dk"], 5)
    ctx.line([(-120, -20), (-30, -30)], 3, (70, 32, 20, 255))
    ctx.line([(-130, 20), (-20, 14)], 3, (70, 32, 20, 255))
    # middle pair of little arms
    for sd in (-1, 1):
        ctx.limb(sd * 50, ny + 170, sd * 110, ny + 230, 22, 18, c["body"], 4)
        ctx.circle(sd * 112, ny + 234, 13, c["skin"], 3)
    # thorax
    ctx.ellipse(0, ny + 150, 78, 160, c["body"], 5)
    # apron
    ctx.poly([(-50, ny + 100), (50, ny + 100), (66, ny + 290), (-66, ny + 290)], c["apron"], 4)
    ctx.poly([(-30, ny + 190), (30, ny + 190), (30, ny + 240), (-30, ny + 240)], (220, 206, 176, 255), 3)
    ctx.line([(-50, ny + 100), (-30, ny + 30)], 4, c["apron"])
    ctx.line([(50, ny + 100), (30, ny + 30)], 4, c["apron"])
    ctx.push(0, ny + 8, P(pose, "head", 0), 1.3)
    insect_face(ctx, pose, "ant", cfg)
    ctx.pop()
    for side in ("L", "R"):
        it = C.get_item(pose, side)
        arm(ctx, pose, side, cfg, (-1 if side == "L" else 1) * 54, ny + 50, "arm" + side, c["body"], cuff=c["body_dk"],
            item_fn=it or (lambda ctx_, pose_, s_, tot, hk: hand(ctx_, hk, c["skin"], 22)), base_ang=base)
    ctx.pop()
    ctx.pop()
