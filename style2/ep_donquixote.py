"""Episode in style 2: Don Quixote and Sancho Panza. Lesson: dream + budget (goal, term, sum)."""
import math

TITLE = "МЕЧТА БЕЗ БЮДЖЕТА?"
EYEBROW = "Пункт повестки 1"
NEXT = "ШЕЙЛОК"
END_CARD = 2.2
BUBBLE_Y = 860

CAST = {
    "DQ": dict(name="ДОН КИХОТ", sub="рыцарь Ламанчи", flag=(150, 150, 160), voice="ruslan", seed=3,
               skin=(236, 214, 186), hair=(150, 140, 130), suit=(52, 60, 76), tie=(214, 56, 44), hat="basin",
               stache=(150, 140, 130), beard=(150, 140, 130)),
    "SP": dict(name="САНЧО ПАНСА", sub="оруженосец", flag=(214, 150, 60), voice="denis", seed=7,
               skin=(222, 184, 148), hair=(90, 64, 48), suit=(30, 42, 66), tie=(214, 56, 44), hat="cap", hatcol=(120, 84, 56), round=1,
               stache=(90, 64, 48)),
}
LAYOUT = {"DQ": (290, 1300), "SP": (790, 1300)}

BEATS = [
    dict(who="NARR", voice="irina", say="Мечта есть, а бюджета нет? Слушай Санчо Пансу.", top="title"),
    dict(who="DQ", say="Куплю доспехи, коня и замок! Сегодня!", top="shop"),
    dict(who="SP", say="А на какие деньги, господин?", top="shop"),
    dict(who="DQ", say="Мечта не считает деньги!", top="shop"),
    dict(who="SP", say="Зато я считаю. Доход сто, доспехи сто двадцать. Минус двадцать.", top="gap"),
    dict(who="DQ", say="Что же делать?", top="gap"),
    dict(who="SP", say="Цель, срок, сумма. Откладывай двадцать в месяц — через шесть месяцев доспехи твои.", top="plan"),
    dict(who="NARR", voice="irina", say="А на что копите вы? Пишите в комментариях. Завтра: Шейлок. Подпишись, чтобы не пропустить.", top="ask"),
]

INK = (0, 0, 0); RED = (214, 56, 44); GREEN = (60, 120, 80); NAVY = (30, 42, 66); TAN = (232, 200, 166)


def _t(d, S, F, x, y, s, f, size, fill=INK, a="mm"):
    d.text((x * S, y * S), s, font=F(f, size), fill=fill, anchor=a)


def draw_top(img, d, tm, beat, S, F, FC, FI, FB, ep):
    top = beat["top"] if beat else "title"
    ix = ep.BEATS.index(beat) if beat else 0
    k = min(1, (tm - (beat["s"] if beat else 0)) / 0.5)
    if top == "title" or top == "ask":
        _t(d, S, F, 540, 430, EYEBROW if top == "title" else "Вопрос зрителям", FI, 56)
        _t(d, S, F, 540, 600, TITLE if top == "title" else "НА ЧТО КОПИТЕ?", FC, 76 if top == "title" else 90)
        if top == "title":
            _t(d, S, F, 540, 720, "Мечта + бюджет", FI, 50, (90, 84, 76))
        return
    _t(d, S, F, 540, 130, EYEBROW, FI, 40)
    _t(d, S, F, 540, 215, TITLE, FC, 64)
    if top == "shop":
        for i, (lab, x) in enumerate((("ДОСПЕХИ", 220), ("КОНЬ", 540), ("ЗАМОК", 860))):
            if tm - beat["s"] + (ix - 1) * 0.0 > -1:
                kk = min(1, max(0, (tm - 0.4 * i - 0.2) / 0.4)) if ix == 1 else 1
                y = 560 - 40 * (1 - kk)
                d.rounded_rectangle([(x - 150) * S, (y - 110) * S, (x + 150) * S, (y + 110) * S], 24 * S, fill=TAN, outline=INK, width=4 * S)
                _t(d, S, F, x, y - 20, lab, FC, 40)
                _t(d, S, F, x, y + 40, "×1", FI, 50, RED)
        _t(d, S, F, 540, 780, "сегодня!" if ix == 1 else "а деньги?", FI, 52, (90, 84, 76))
        return
    if top == "gap":
        x0, y0 = 160, 760
        bars = (("доход", 100, (150, 170, 190), 300), ("доспехи", 120, RED, 640))
        _t(d, S, F, 540, 330, "ДОХОД И ЦЕНА", FC, 46)
        for lab, v, col, x in bars:
            h = v * 3.2 * min(1, max(0, (tm - 0.2) / 0.6)) if ix == 4 else v * 3.2
            d.rectangle([x * S, (y0 - h) * S, (x + 190) * S, y0 * S], fill=col, outline=INK, width=4 * S)
            _t(d, S, F, x + 95, y0 + 40, lab, FI, 40)
            if h > v * 3.1:
                _t(d, S, F, x + 95, y0 - h - 36, str(v), FC, 48)
        d.line([(x0 * S, y0 * S), (930 * S, y0 * S)], fill=INK, width=4 * S)
        if ix >= 4 and tm - beat["s"] > 2.6 or ix == 5:
            _t(d, S, F, 540, 420, "−20", FC, 110, RED)
        return
    if top == "plan":
        _t(d, S, F, 540, 330, "ОТКЛАДЫВАЕМ ПО 20 В МЕСЯЦ", FC, 40)
        y0 = 770
        prog = (tm - beat["s"]) / max(1.0, (beat["e"] - beat["s"]) * 0.8)
        for i in range(6):
            kk = min(1, max(0, prog * 7 - i))
            h = 20 * (i + 1) * 3.4 * kk
            x = 150 + i * 140
            d.rectangle([x * S, (y0 - h) * S, (x + 110) * S, y0 * S], fill=(150, 170, 190) if i < 5 else GREEN, outline=INK, width=4 * S)
            if kk > 0.9:
                _t(d, S, F, x + 55, y0 - h - 28, str(20 * (i + 1)), FC, 36)
            _t(d, S, F, x + 55, y0 + 34, f"мес. {i + 1}", FI, 30)
        d.line([(120 * S, y0 * S), (960 * S, y0 * S)], fill=INK, width=4 * S)


def draw_bottom(img, d, tm, beat, S, F, FC, FI, FB, ep):
    if beat is not None and beat["top"] == "plan" and tm - beat["s"] > 1.5:
        d.rounded_rectangle([60 * S, 1700 * S, 1020 * S, 1860 * S], 30 * S, fill=NAVY, outline=INK, width=4 * S)
        _t(d, S, F, 540, 1745, "ПРАВИЛО", FI, 36, (210, 206, 198))
        _t(d, S, F, 540, 1805, "ЦЕЛЬ + СРОК + СУММА", FC, 62, (237, 233, 226))


def draw_end(img, d, t, S, F, FC, FI, FB):
    _t(d, S, F, 540, 700, "ДЕНЬГИ ГЕРОЕВ", FC, 110)
    _t(d, S, F, 540, 860, "финансы на примерах персонажей", FI, 50, (90, 84, 76))
    _t(d, S, F, 540, 1100, "Следующий герой:", FI, 56)
    _t(d, S, F, 540, 1220, NEXT, FC, 100, RED)
    return img
