import numpy as np


def add(sc, sfx, music, g):
    place, clink, thump, bell, note_f, whoosh, scratch, rng = (g[k] for k in ('place', 'clink', 'thump', 'bell', 'note_f', 'whoosh', 'scratch', 'rng'))
    s = sc[0]
    for k in np.arange(s["start"] + 0.3, s["start"] + s["dur"] * 0.5, 0.3):
        place(sfx, clink(rng.uniform(0.9, 1.3)), k, 0.45)
    s = sc[1]
    place(sfx, whoosh(0.4), s["start"] + s["dur"] * 0.4, 0.4)
    for i, n in enumerate((67, 71, 74)):
        place(sfx, bell(note_f(n), 0.8) * 0.6, s["start"] + s["dur"] * 0.55 + i * 0.15, 0.4)
    s = sc[2]
    for frac in (0.08, 0.14, 0.2):
        place(sfx, scratch(0.3), s["start"] + s["dur"] * frac, 0.4)
    place(sfx, thump(80), s["start"] + s["dur"] * 0.3, 0.6)
    place(sfx, bell(note_f(50), 1.5), s["start"] + s["dur"] * 0.55, 0.5)
    s = sc[3]
    for frac in (0.1, 0.25, 0.4):
        place(sfx, thump(100) * 0.8, s["start"] + s["dur"] * frac, 0.5)
    place(sfx, bell(note_f(84), 0.9), s["start"] + s["dur"] * 0.72, 0.4)
    s = sc[4]
    for frac in (0.1, 0.35, 0.6):
        place(sfx, bell(note_f(79), 0.5) * 0.7, s["start"] + s["dur"] * frac, 0.4)
    s = sc[5]
    place(sfx, thump(110), s["start"] + s["dur"] * 0.55, 0.6)
    place(sfx, bell(note_f(88), 1.0), s["start"] + s["dur"] * 0.8, 0.5)
    s = sc[6]
    place(sfx, whoosh(0.35), s["start"] + s["dur"] * 0.1, 0.4)
