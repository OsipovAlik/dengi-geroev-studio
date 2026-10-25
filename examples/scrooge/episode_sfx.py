import numpy as np


def add(sc, sfx, music, g):
    place, clink, thump, creak, bell, note_f, tick, whoosh, bubble, scratch, rng = (g[k] for k in ('place','clink','thump','creak','bell','note_f','tick','whoosh','bubble','scratch','rng'))
    crackle = g['crackle']
    s = sc[0]
    for k in np.arange(s["start"] + 0.2, s["start"] + s["dur"] * 0.55, 0.25):
        place(sfx, clink(rng.uniform(0.8, 1.2)), k, 0.45)
    place(sfx, thump(70) * 1.4, s["start"] + s["dur"] * 0.62, 0.8)
    s = sc[1]
    place(sfx, crackle(s["dur"]) * 0.6, s["start"], 0.3)
    place(sfx, clink(0.6), s["start"] + s["dur"] * 0.55, 0.5)
    s = sc[2]
    place(sfx, bell(note_f(45), 2.0), s["start"] + 0.1, 0.7)
    place(sfx, whoosh(1.2, False), s["start"] + s["dur"] * 0.2, 0.5)
    for i, n in enumerate((72, 76, 79, 84)):
        place(sfx, bell(note_f(n), 1.0) * 0.6, s["start"] + s["dur"] * 0.5 + i * 0.12, 0.45)
    place(sfx, bell(note_f(88), 1.2), s["start"] + s["dur"] * 0.8, 0.5)
    s = sc[3]
    for frac in (0.3, 0.48, 0.66):
        place(sfx, thump(100) * 0.8, s["start"] + s["dur"] * frac, 0.5)
        place(sfx, clink(1.0), s["start"] + s["dur"] * frac, 0.4)
    s = sc[4]
    for k in np.arange(s["start"] + 0.1, s["start"] + s["dur"] * 0.9, 0.3):
        place(sfx, clink(rng.uniform(0.9, 1.1)) * 0.5, k, 0.3)
    for frac in (0.25, 0.45, 0.65):
        place(sfx, scratch(0.3), s["start"] + s["dur"] * frac, 0.5)
    s = sc[5]
    for frac in (0.12, 0.3, 0.62):
        place(sfx, bell(note_f(79), 0.8) * 0.7, s["start"] + s["dur"] * frac, 0.5)
    s = sc[6]
    place(sfx, whoosh(0.35), s["start"] + s["dur"] * 0.1, 0.4)
