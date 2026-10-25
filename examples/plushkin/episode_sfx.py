import numpy as np


def add(sc, sfx, music, g):
    place, clink, thump, creak, bell, note_f, tick, whoosh, bubble, scratch, rng = (g[k] for k in ('place','clink','thump','creak','bell','note_f','tick','whoosh','bubble','scratch','rng'))
    # scene sfx
    s1 = sc[0]
    for k in np.arange(s1["start"] + 0.2, s1["start"] + s1["dur"] * 0.6, 0.22):
        place(sfx, clink(rng.uniform(0.8, 1.2)), k, 0.45)
    place(sfx, thump(70) * 1.6, s1["start"] + s1["dur"] * 0.7, 1.0)
    place(sfx, creak(0.6), s1["start"] + s1["dur"] * 0.62, 0.5)

    s2 = sc[1]
    for k in np.arange(s2["start"] + 0.1, s2["start"] + s2["dur"], 0.45):
        place(sfx, clink(0.5) * 0.5, k, 0.35)
    for i, k in enumerate(np.arange(s2["start"] + 0.1, s2["start"] + s2["dur"] * 0.35, 1 / 1.8)):
        place(sfx, thump(90 if i % 2 else 120), k, 0.4)
    place(sfx, bell(note_f(76), 0.8) * 0.7, s2["start"] + s2["dur"] * 0.5, 0.5)

    s3 = sc[2]
    for k in np.arange(s3["start"] + s3["dur"] * 0.3, s3["start"] + s3["dur"] * 0.55, 0.05):
        place(sfx, bubble() * 0.4, k + rng.uniform(0, 0.04), 0.3)
    place(sfx, thump(55) * 1.4, s3["start"] + s3["dur"] * 0.6, 0.8)
    place(sfx, whoosh(0.8, False), s3["start"] + s3["dur"] * 0.7, 0.6)

    s4 = sc[3]
    for yr in range(10):
        k = s4["start"] + s4["dur"] * (0.25 + 0.6 * yr / 9)
        place(sfx, tick() * 1.5, k, 0.6)
        place(sfx, bell(note_f(84 - yr), 0.5) * 0.4, k, 0.35)

    s5 = sc[4]
    place(sfx, creak(0.5), s5["start"] + 0.05, 0.6)
    place(sfx, whoosh(1.5, False), s5["start"] + s5["dur"] * 0.25, 0.4)
    for k in np.arange(s5["start"] + 0.8, s5["start"] + s5["dur"], 0.35):
        place(sfx, bubble() * 0.5, k, 0.35)

    s6 = sc[5]
    for i in range(6):
        place(sfx, clink(1.0 + i * 0.05), s6["start"] + s6["dur"] * (0.15 + i * 0.08), 0.4)
    place(sfx, bell(note_f(81), 1.2), s6["start"] + s6["dur"] * 0.68, 0.6)

    s7 = sc[6]
    place(sfx, whoosh(0.35), s7["start"] + s7["dur"] * 0.1, 0.4)
    for k in np.arange(s7["start"] + 0.2, s7["start"] + s7["dur"] - 1.6, 0.5):
        place(sfx, clink(0.5) * 0.4, k, 0.25)
