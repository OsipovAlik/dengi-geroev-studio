import numpy as np


def add(sc, sfx, music, g):
    place, clink, thump, creak, bell, note_f, tick, whoosh, bubble, scratch, rng = (g[k] for k in ('place','clink','thump','creak','bell','note_f','tick','whoosh','bubble','scratch','rng'))
    s = sc[0]
    for i in range(6):
        place(sfx, bell(note_f(79 + (0, 2, 4, 7, 4, 2)[i]), 0.6) * 0.5, s["start"] + 0.3 + i * 0.5, 0.35)
    place(sfx, whoosh(1.2, False), s["start"] + s["dur"] * 0.62, 0.6)
    s = sc[1]
    for i, k in enumerate(np.arange(s["start"] + 0.1, s["start"] + s["dur"] * 0.5, 1 / 1.8)):
        place(sfx, thump(150) * 0.4, k, 0.3)
    place(sfx, whoosh(0.8, False), s["start"] + s["dur"] * 0.3, 0.4)
    s = sc[2]
    place(sfx, creak(0.7), s["start"] + 0.05, 0.6)
    place(sfx, thump(70) * 1.2, s["start"] + s["dur"] * 0.45, 0.6)
    s = sc[3]
    for i in range(6):
        place(sfx, tick() * 1.5, s["start"] + s["dur"] * (0.1 + i * 0.058), 0.6)
    for frac in (0.5, 0.7):
        place(sfx, clink(1.0), s["start"] + s["dur"] * frac, 0.5)
    s = sc[4]
    for frac in (0.05, 0.25, 0.42):
        place(sfx, thump(60) * 1.3, s["start"] + s["dur"] * (frac + 0.1), 0.7)
    place(sfx, bell(note_f(60), 1.0), s["start"] + s["dur"] * 0.68, 0.5)
    s = sc[5]
    for m in range(12):
        k = s["start"] + s["dur"] * (0.08 + 0.42 * m / 11)
        place(sfx, clink(1.0 + m * 0.02), k, 0.4)
    place(sfx, bell(note_f(84), 1.2), s["start"] + s["dur"] * 0.52, 0.5)
    s = sc[6]
    place(sfx, whoosh(0.35), s["start"] + s["dur"] * 0.35, 0.4)
