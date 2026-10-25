import numpy as np


def add(sc, sfx, music, g):
    place, clink, thump, creak, bell, note_f, tick, whoosh, bubble, scratch, rng = (g[k] for k in ('place','clink','thump','creak','bell','note_f','tick','whoosh','bubble','scratch','rng'))
    s = sc[0]
    for i, k in enumerate(np.arange(s["start"] + 0.1, s["start"] + s["dur"] * 0.3, 1 / 1.9)):
        place(sfx, thump(110 if i % 2 else 140) * 0.6, k, 0.35)
    place(sfx, bell(note_f(79), 0.8) * 0.6, s["start"] + s["dur"] * 0.33, 0.45)
    for k in np.arange(s["start"] + s["dur"] * 0.64, s["start"] + s["dur"] * 0.92, 0.18):
        place(sfx, scratch(0.2) * 0.5, k, 0.3)
    s = sc[1]
    for k in np.arange(s["start"] + 0.05, s["start"] + s["dur"] * 0.6, 1 / 3):
        if (k - s["start"]) * 3 % 1 < 0.5:
            place(sfx, thump(80) * 1.3, k, 0.8)
    place(sfx, thump(50) * 1.8, s["start"] + s["dur"] * 0.72, 1.0)
    place(sfx, clink(0.4), s["start"] + s["dur"] * 0.72, 0.6)
    s = sc[2]
    for frac in (0.17, 0.3, 0.72):
        place(sfx, scratch(0.5), s["start"] + s["dur"] * frac, 0.5)
    place(sfx, bell(note_f(84), 1.2), s["start"] + s["dur"] * 0.5, 0.6)
    place(sfx, thump(60) * 1.4, s["start"] + s["dur"] * 0.86, 0.8)
    s = sc[3]
    for k in np.arange(s["start"] + 0.3, s["start"] + s["dur"] * 0.55, 0.6):
        place(sfx, creak(0.3) * 0.5, k, 0.3)
    place(sfx, whoosh(0.4), s["start"] + s["dur"] * 0.58, 0.5)
    s = sc[4]
    for m in range(13):
        k = s["start"] + s["dur"] * (0.42 + 0.45 * m / 12)
        place(sfx, tick() * 1.5, k, 0.6)
        place(sfx, bell(note_f(76 - m), 0.4) * 0.3, k, 0.3)
    s = sc[5]
    for i in range(6):
        place(sfx, clink(1.0 + i * 0.05), s["start"] + s["dur"] * (0.48 + i * 0.035), 0.45)
    place(sfx, bell(note_f(81), 1.2), s["start"] + s["dur"] * 0.92, 0.5)
    s = sc[6]
    place(sfx, whoosh(0.35), s["start"] + s["dur"] * 0.12, 0.4)
    place(sfx, clink(0.7), s["start"] + s["dur"] * 0.55, 0.4)
