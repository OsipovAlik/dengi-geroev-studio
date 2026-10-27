import math, random
from base import *
from chars12 import *

BROWN = (60, 36, 26)
BROWN2 = (110, 70, 50)
RED = (170, 40, 32)
GREEN = (60, 140, 86)
BLUE = (70, 112, 164)
GOLD = (214, 160, 60)
CREAM = (250, 244, 230)
SC = 0.7
FY = 1070


def bg():
    return vgrad(W, H, (236, 222, 190), (214, 192, 150))


def T(d, x, y, s, size, col=BROWN, f=FONT_SERIF_B, a="mm"):
    d.text((x, y), s, font=font(f, size), fill=col, anchor=a)


def panel(d, x0, y0, x1, y1, fill=CREAM, r=26):
    d.rounded_rectangle([x0, y0, x1, y1], r, fill=fill, outline=INK, width=5)


def bubble(img, x, y, lines, k, size=50, tail=1):
    if k <= 0:
        return
    if isinstance(lines, str):
        lines = [lines]
    lay = Image.new("RGBA", img.size)
    d = ImageDraw.Draw(lay)
    f = font(FONT_SERIF_BI, size)
    tw = max(d.textlength(s, font=f) for s in lines)
    s = ease_out(min(1, k * 2))
    w_, h_ = (tw + 100) * s, (size * 1.25 * len(lines) + size * 1.0) * s
    d.ellipse([x - w_ / 2, y - h_ / 2, x + w_ / 2, y + h_ / 2], fill=(250, 246, 234), outline=INK, width=5)
    for i, r in enumerate((14, 9)):
        cx, cy = x + tail * (50 + i * 28), y + h_ / 2 + 16 + i * 24
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 246, 234), outline=INK, width=4)
    if s > 0.9:
        for i, ln in enumerate(lines):
            d.text((x, y + (i - (len(lines) - 1) / 2) * size * 1.25), ln, font=f, fill=BROWN, anchor="mm")
    img.alpha_composite(lay)


def coin(d, x, y, r=28):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(232, 186, 70), outline=INK, width=4)
    d.ellipse([x - r * 0.6, y - r * 0.6, x + r * 0.6, y + r * 0.6], outline=(170, 120, 30), width=3)


def arrow(d, x0, y0, x1, y1, col=BROWN, w=8, k=1.0):
    x1 = x0 + (x1 - x0) * k
    y1 = y0 + (y1 - y0) * k
    d.line([(x0, y0), (x1, y1)], fill=col, width=w)
    if k > 0.95:
        a = math.atan2(y1 - y0, x1 - x0)
        for da in (2.6, -2.6):
            d.line([(x1, y1), (x1 + math.cos(a + da) * 28, y1 + math.sin(a + da) * 28)], fill=col, width=w)


def reveal(p, a, dur=0.08):
    return ease_out(seg(p, a, a + dur))


def jeff(img, x, pose, fn=None, s=SC, y=FY):
    render_actor(img, fn or draw_jeff, x, y, s, pose)


def idle(t, **kw):
    pose = dict(turn=0.2, head=2 * math.sin(t * 1.3), armL=(14, 24), armR=(14, 24), smile=0.3, bob=1.5 * math.sin(t * 2))
    pose.update(kw)
    return pose


def book(d, x, y, w_, h_, col):
    d.rectangle([x, y - h_, x + w_, y], fill=col, outline=INK, width=3)
    d.line([(x + 8, y - h_ + 10), (x + 8, y - 10)], fill=INK, width=2)


CAM = dict(zoom=1.0, cx=0.5, cy=0.5)


# ---------------------------------------------------------- 1 hook
def scene1(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = reveal(p, 0.03)
    if k > 0:
        panel(d, 110, 230, 700, 770, (226, 220, 206))
        T(d, 405, 280, "УОЛЛ-СТРИТ", 52, BROWN)
        for i, (bx, bh) in enumerate(((170, 330), (290, 400), (410, 300), (520, 360))):
            d.rectangle([bx, 740 - bh * k, bx + 90, 740], fill=(120, 130, 150), outline=INK, width=4)
            for wy in range(int(740 - bh * k) + 20, 720, 50):
                d.rectangle([bx + 15, wy, bx + 35, wy + 24], fill=(236, 226, 150))
                d.rectangle([bx + 55, wy, bx + 75, wy + 24], fill=(236, 226, 150))
    k = reveal(p, 0.35)
    if k > 0:
        panel(d, 1220, 230, 1810, 770, (216, 232, 220))
        T(d, 1515, 280, "ИНТЕРНЕТ-МАГАЗИН", 50, BROWN)
        d.rectangle([1330, 430, 1700, 620], fill=(60, 70, 90), outline=INK, width=6)
        d.rectangle([1348, 448, 1682, 602], fill=(180, 210, 236), outline=INK, width=3)
        d.polygon([(1300, 640), (1730, 640), (1760, 690), (1270, 690)], fill=(150, 154, 160), outline=INK)
        for i, c in enumerate(((190, 90, 70), (70, 130, 90), (200, 160, 60), (80, 100, 170))):
            book(d, 1380 + i * 70, 600, 56, 90 + (i % 2) * 40, c)
        T(d, 1515, 730, "книги через интернет", 34, BROWN2, FONT_SERIF_I)
    arrow(d, 740, 480, 1180, 480, RED, 10, ease(seg(p, 0.3, 0.45)))
    bubble(img, 960, 225, "Всё бросаю!", seg(p, 0.5, 0.58), 46)
    jeff(img, 960, idle(t, smile=0.5, armR=(90, 150) if p > 0.5 else (14, 24)))
    return img, CAM


# ---------------------------------------------------------- 2 who
def scene2(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    nodes = [("1986", "Принстон"), ("до 1994", "Уолл-стрит"), ("1994", "решение")]
    for i, (a, b) in enumerate(nodes):
        k = reveal(p, 0.05 + i * 0.12)
        if k > 0:
            x = 800 + i * 380
            d.ellipse([x - 24, 280 - 24, x + 24, 280 + 24], fill=GOLD, outline=INK, width=5)
            T(d, x, 220, a, 44, RED)
            T(d, x, 345, b, 40, BROWN)
            if i:
                d.line([(x - 380 + 30, 280), (x - 30, 280)], fill=BROWN, width=6)
    k = ease(seg(p, 0.45, 0.85))
    if k > 0:
        panel(d, 760, 420, 1800, 860, (246, 240, 224))
        pts = []
        for i in range(60):
            xx = 830 + i * 16
            yy = 820 - 340 * ((math.exp(i / 14.0) - 1) / (math.exp(60 / 14.0) - 1))
            pts.append((xx, yy))
        n = max(2, int(len(pts) * k))
        d.line(pts[:n], fill=GREEN, width=10)
        T(d, 1270, 470, "интернет растёт в разы", 42, BROWN)
    jeff(img, 340, idle(t, smile=0.1, brow=0.3, turn=0.3))
    return img, CAM


# ---------------------------------------------------------- 3 regret
def scene3(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    T(d, 340, 210, "30 лет", 44, BROWN2, FONT_SERIF_BI)
    k = reveal(p, 0.12)
    if k > 0:
        T(d, 1580, 210, "80 лет", 44, BROWN2, FONT_SERIF_BI)
    k = reveal(p, 0.3, 0.1)
    if k > 0:
        panel(d, 640, 260, 1280, 380, (200, 232, 206))
        T(d, 960, 320, "попробовал — не вышло", 40, BROWN)
    k = reveal(p, 0.5, 0.1)
    if k > 0:
        panel(d, 640, 420, 1280, 540, (240, 200, 190))
        T(d, 960, 480, "даже не попытался", 40, RED)
    k = reveal(p, 0.72, 0.1)
    if k > 0:
        T(d, 960, 640, "что обиднее?", 66 * k + 1, BROWN, FONT_SERIF_BI)
    bubble(img, 1560, 225, "а что, если бы…", seg(p, 0.55, 0.65), 38, tail=-1)
    jeff(img, 340, idle(t, turn=0.3))
    jeff(img, 1580, idle(t + 1, turn=-0.3, smile=0.1, armL=(10, 20)), draw_jeff_old)
    return img, CAM


# ---------------------------------------------------------- 4 lesson 1
def scene4(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    rows = [("расходы", "60 тыс. ₽ / мес", BLUE, 0.06), ("× запас", "6 месяцев", GOLD, 0.3), ("= подушка", "360 тыс. ₽", GREEN, 0.55)]
    for i, (a, b, col, st) in enumerate(rows):
        k = reveal(p, st)
        if k > 0:
            yy = 300 + i * 170
            d.rounded_rectangle([780, yy - 62, 1760, yy + 62], 26, fill=col, outline=INK, width=5)
            T(d, 960, yy, a, 46, (255, 250, 240))
            T(d, 1400, yy, b, 56, (255, 250, 240))
    k = reveal(p, 0.78)
    if k > 0:
        # parachute
        cx, cy = 1500, 150
        d.pieslice([cx - 100, cy - 40, cx + 100, cy + 100], 180, 360, fill=(200, 80, 70), outline=INK, width=5)
        d.line([(cx - 100, cy + 30), (cx, 250)], fill=INK, width=3)
        d.line([(cx + 100, cy + 30), (cx, 250)], fill=INK, width=3)
        T(d, cx, 275, "парашют", 30, BROWN2, FONT_SERIF_I)
    jeff(img, 380, idle(t, armR=(80, 120) if p > 0.5 else (14, 24), smile=0.5))
    return img, CAM


# ---------------------------------------------------------- 5 garage & books
def scene5(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = reveal(p, 0.04, 0.1)
    if k > 0:
        d.polygon([(70, 480), (340, 340), (610, 480)], fill=(170, 80, 70), outline=INK)
        d.rectangle([100, 480, 580, 780], fill=(214, 196, 160), outline=INK, width=5)
        d.rectangle([190, 560, 490, 780], fill=(150, 150, 156), outline=INK, width=5)
        for yy in range(580, 780, 36):
            d.line([(190, yy), (490, yy)], fill=INK, width=2)
        T(d, 340, 280, "гараж · 1995", 44, BROWN)
    k = reveal(p, 0.35)
    if k > 0:
        panel(d, 660, 260, 1080, 800, (246, 240, 224))
        T(d, 870, 305, "обычный магазин", 34, BROWN)
        for i in range(8):
            book(d, 690 + i * 44, 700, 36, 80 + (i * 17) % 40, [(190, 90, 70), (70, 130, 90), (200, 160, 60)][i % 3])
        T(d, 870, 750, "тысячи книг", 32, BROWN2, FONT_SERIF_I)
    k = ease(seg(p, 0.55, 0.8))
    if k > 0:
        panel(d, 1120, 260, 1540, 800, (216, 232, 220))
        T(d, 1330, 305, "онлайн", 34, BROWN)
        for i in range(9):
            for j in range(int(9 * k)):
                book(d, 1145 + i * 43, 740 - j * 46, 36, 40, [(190, 90, 70), (70, 130, 90), (200, 160, 60), (80, 100, 170)][(i + j) % 4])
        if k > 0.9:
            T(d, 1330, 775, "миллионы книг", 32, GREEN, FONT_SERIF_I)
    jeff(img, 1740, idle(t, turn=-0.3, smile=0.4), s=0.62)
    return img, CAM


# ---------------------------------------------------------- 6 lesson 2
def scene6(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    rows = [("зарплата", "100 000 ₽", BLUE, 0.05), ("10% в себя", "10 000 ₽ / мес", GOLD, 0.25), ("за год", "120 000 ₽", GREEN, 0.45)]
    for i, (a, b, col, st) in enumerate(rows):
        k = reveal(p, st)
        if k > 0:
            yy = 300 + i * 150
            d.rounded_rectangle([780, yy - 56, 1760, yy + 56], 24, fill=col, outline=INK, width=5)
            T(d, 980, yy, a, 42, (255, 250, 240))
            T(d, 1440, yy, b, 52, (255, 250, 240))
    tags = ["курсы", "книги", "инструменты", "здоровье"]
    for i, tg in enumerate(tags):
        k = reveal(p, 0.62 + i * 0.07)
        if k > 0:
            x = 850 + i * 245
            d.rounded_rectangle([x - 105, 700, x + 105, 770], 30, fill=CREAM, outline=INK, width=4)
            T(d, x, 735, tg, 34, BROWN)
    jeff(img, 380, idle(t, armR=(80, 120) if 0.45 < p < 0.7 else (14, 24)))
    return img, CAM


# ---------------------------------------------------------- 7 bubble
def scene7(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    panel(d, 110, 250, 1180, 850, (246, 240, 224))
    pts = []
    for i in range(0, 56):
        yr = 1995 + i / 56 * 8
        if yr < 2000.2:
            v = 0.12 + 0.8 * ((yr - 1995) / 5.2) ** 2.2
        elif yr < 2001.5:
            v = 0.92 - 0.65 * ease(min(1, (yr - 2000.2) / 0.9))
        else:
            v = 0.27 + 0.18 * (yr - 2001.5) / 1.5
        pts.append((170 + i * 18, 800 - v * 480))
    k = ease(seg(p, 0.05, 0.6))
    n = max(2, int(len(pts) * k))
    d.line(pts[:n], fill=BLUE, width=9)
    for yr in (1995, 1997, 1999, 2001, 2003):
        x = 170 + (yr - 1995) / 8 * 56 * 18
        T(d, x, 830, str(yr), 26, BROWN2)
    k = reveal(p, 0.38)
    if k > 0:
        T(d, 690, 300, "2000: пузырь лопнул", 40, RED)
    k = reveal(p, 0.7)
    if k > 0:
        panel(d, 1220, 300, 1580, 620, (200, 232, 206))
        T(d, 1400, 360, "конец 2001", 38, BROWN)
        T(d, 1400, 430, "первая чистая", 34, BROWN)
        T(d, 1400, 475, "прибыль", 34, BROWN)
        T(d, 1400, 555, "≈ 5 млн $", 54, GREEN)
    jeff(img, 1740, idle(t, turn=-0.3, brow=-0.3 if 0.38 < p < 0.7 else 0.3, smile=-0.2 if p < 0.7 else 0.7), s=0.62)
    return img, CAM


# ---------------------------------------------------------- 8 lesson 3
def scene8(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    T(d, 1270, 215, "10 000 ₽ в месяц · условные 10% годовых", 38, BROWN)
    base = 800
    for i, (lab, v, st, col) in enumerate((("20 лет", 7.6, 0.2, GOLD), ("30 лет", 22.6, 0.5, GREEN))):
        k = ease(seg(p, st, st + 0.2))
        if k > 0:
            x0 = 880 + i * 420
            h = v / 22.6 * 460 * k
            d.rectangle([x0, base - h, x0 + 300, base], fill=col, outline=INK, width=5)
            T(d, x0 + 150, base + 40, lab, 40, BROWN)
            if k > 0.9:
                T(d, x0 + 150, base - h - 36, f"≈ {v:.1f} млн ₽".replace(".", ","), 46, RED if i else BROWN)
    k = reveal(p, 0.8)
    if k > 0:
        T(d, 1270, 880, "расчёт условный, это не обещание", 34, BROWN2, FONT_SERIF_I)
    jeff(img, 380, idle(t, armR=(80, 150), handR="point") if 0.2 < p < 0.8 else idle(t))
    return img, CAM


# ---------------------------------------------------------- 9 expansion
def scene9(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    cards = [("Книги", "1995", (200, 160, 80)), ("Подписка Prime", "2005 · 79 $/год", BLUE), ("Облако AWS", "аренда серверов", GREEN)]
    for i, (a, b, col) in enumerate(cards):
        k = reveal(p, 0.06 + i * 0.28)
        if k > 0:
            x0 = 110 + i * 500
            d.rounded_rectangle([x0, 330, x0 + 440, 640], 32, fill=col, outline=INK, width=5)
            T(d, x0 + 220, 440, a, 48, (255, 250, 240))
            T(d, x0 + 220, 530, b, 36, (255, 250, 240), FONT_SERIF_I)
            if i:
                arrow(d, x0 - 55, 485, x0 - 5, 485, BROWN, 8, 1.0)
    k = reveal(p, 0.85)
    if k > 0:
        T(d, 800, 730, "магазин + аренда компьютеров", 40, BROWN, FONT_SERIF_BI)
    jeff(img, 1740, idle(t, turn=-0.3, smile=0.7, armL=(10, 20)), s=0.62)
    return img, CAM


# ---------------------------------------------------------- 10 lesson 4
def scene10(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    base = 830
    k = ease(seg(p, 0.05, 0.25))
    if k > 0:
        d.rectangle([880, base - 400 * k, 1100, base], fill=BLUE, outline=INK, width=5)
        T(d, 990, base + 36, "зарплата 100", 34, BROWN)
    k = ease(seg(p, 0.4, 0.6))
    if k > 0:
        d.rectangle([1220, base - 400 * 1.0, 1440, base], fill=BLUE, outline=INK, width=5)
        d.rectangle([1220, base - 400 - 80 * k, 1440, base - 400], fill=GREEN, outline=INK, width=5)
        T(d, 1330, base + 36, "+ подработка 20", 34, BROWN)
    k = reveal(p, 0.65)
    if k > 0:
        panel(d, 1500, 330, 1820, 560, (200, 232, 206))
        T(d, 1660, 400, "+20%", 64, GREEN)
        T(d, 1660, 480, "240 тыс. ₽", 42, BROWN)
        T(d, 1660, 525, "за год", 32, BROWN2, FONT_SERIF_I)
    k = reveal(p, 0.82)
    if k > 0:
        d.rounded_rectangle([760, 210, 1360, 290], 30, fill=CREAM, outline=INK, width=4)
        T(d, 1060, 250, "запасной выход", 40, BROWN, FONT_SERIF_BI)
    jeff(img, 380, idle(t, smile=0.6, armR=(90, 140) if p > 0.4 else (14, 24)))
    return img, CAM


# ---------------------------------------------------------- 11 fire phone
def scene11(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = reveal(p, 0.05)
    if k > 0:
        d.rounded_rectangle([200, 260, 420, 700], 36, fill=(60, 64, 76), outline=INK, width=6)
        d.rounded_rectangle([218, 300, 402, 660], 14, fill=(190, 210, 232), outline=INK, width=3)
        T(d, 310, 480, "2014", 44, BROWN)
    k = ease(seg(p, 0.3, 0.42))
    if k > 0:
        d.line([(180, 250), (180 + 260 * k, 250 + 460 * k)], fill=RED, width=14)
        d.line([(440, 250), (440 - 260 * k, 250 + 460 * k)], fill=RED, width=14)
    k = reveal(p, 0.45)
    if k > 0:
        panel(d, 560, 270, 1150, 380, (240, 200, 190))
        T(d, 855, 325, "закрыли примерно через год", 38, RED)
    k = reveal(p, 0.6)
    if k > 0:
        panel(d, 560, 420, 1150, 530, CREAM)
        T(d, 855, 475, "убыток ≈ 170 млн $", 42, BROWN)
    k = ease(seg(p, 0.75, 0.9))
    if k > 0:
        d.rectangle([560, 620, 1150, 700], fill=(200, 232, 206), outline=INK, width=4)
        d.rectangle([560, 620, 560 + 30, 700], fill=RED)
        T(d, 855, 740, "лишь часть бизнеса", 36, GREEN, FONT_SERIF_I)
    jeff(img, 1560, idle(t, turn=-0.3, mouth="o", brow=-0.5, smile=0.0))
    return img, CAM


# ---------------------------------------------------------- 12 lesson 5
def scene12(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    cx, cy, r = 1130, 520, 230
    k = ease(seg(p, 0.05, 0.3))
    if k > 0:
        d.pieslice([cx - r, cy - r, cx + r, cy + r], -90 + 18 * 0, 270 - 18 * k, fill=BLUE, outline=INK, width=5)
        d.pieslice([cx - r, cy - r, cx + r, cy + r], 270 - 18 * k, 270, fill=GOLD, outline=INK, width=5)
    k = reveal(p, 0.35)
    if k > 0:
        T(d, 1560, 400, "95%", 70, BLUE)
        T(d, 1560, 470, "жизнь, цели, подушка", 34, BROWN)
    k = reveal(p, 0.55)
    if k > 0:
        T(d, 1560, 600, "5%", 70, GOLD)
        T(d, 1560, 670, "эксперименты", 36, BROWN)
        T(d, 1560, 715, "5 000 ₽ в месяц", 40, RED)
    k = reveal(p, 0.78)
    if k > 0:
        T(d, 1130, 230, "малая ставка — малый риск", 42, BROWN, FONT_SERIF_BI)
    jeff(img, 380, idle(t, smile=0.7, armL=(110, 40) if p > 0.5 else (14, 24)))
    return img, CAM


# ---------------------------------------------------------- 13 recap
def scene13(t, dur):
    img = bg()
    p = t / dur
    d = ImageDraw.Draw(img)
    items = [("1  подушка безопасности", BLUE), ("2  вкладывай в себя", GOLD), ("3  дай времени поработать", GREEN),
             ("4  второй источник дохода", (150, 90, 140)), ("5  маленькие эксперименты", (200, 110, 70))]
    for i, (lab, col) in enumerate(items):
        k = reveal(p, 0.06 + i * 0.16)
        if k > 0:
            yy = 290 + i * 118
            d.rounded_rectangle([200, yy - 46, 1160, yy + 46], 26, fill=col, outline=INK, width=5)
            T(d, 680, yy, lab, 46, (255, 250, 240))
    jeff(img, 1560, idle(t, smile=0.8, armL=(100, 40) if p > 0.7 else (14, 24)))
    return img, CAM


# ---------------------------------------------------------- 14 finale
@cached
def bg_close():
    return bg().filter(ImageFilter.GaussianBlur(10))


def scene14(t, dur):
    img = bg_close().copy()
    p = t / dur
    d = ImageDraw.Draw(img)
    k = reveal(p, 0.08)
    if k > 0:
        T(d, 1300, 350, "Какой урок вам ближе", 62 * k + 1, BROWN, FONT_SERIF_BI)
        T(d, 1300, 430, "прямо сегодня?", 62 * k + 1, BROWN, FONT_SERIF_BI)
    k = reveal(p, 0.45)
    if k > 0:
        T(d, 1300, 560, "Пишите в комментариях", 44, RED)
    k = reveal(p, 0.7)
    if k > 0:
        d.rounded_rectangle([860, 650, 1760, 760], 24, fill=CREAM, outline=INK, width=4)
        T(d, 1310, 705, "Не финансовая рекомендация, а объяснение принципов", 32, BROWN2, FONT_SERIF_I)
    pk = ease(seg(p, 0.05, 0.2))
    pose = dict(turn=lerp(-0.3, 0.2, pk), head=lerp(-3, 3, pk), brow=0.5, armL=(lerp(10, 26, pk), lerp(20, 150, pk)), handL="point",
                armR=(14, 24), smile=0.8, mouth="grin" if 0.3 < p < 0.6 else "neutral", bob=1.5 * math.sin(t * 2))
    if 0.8 < p < 0.82:
        pose["blink"] = 1.0
    jeff(img, 460, pose, s=0.95, y=1260)
    return img, dict(zoom=1.0 + 0.03 * ease(p), cx=0.5, cy=0.5)


SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9, scene10, scene11, scene12, scene13, scene14]
