import json, math, sys, wave
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(42)


def t_arr(d):
    return np.arange(int(d * SR)) / SR


def env_adsr(n, a=0.01, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def place(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]
        i = 0
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * gain


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def note_f(n):  # midi -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


# ------------------------------------------------------------ instruments

def pluck(freq, dur=1.2, bright=0.5, decay=0.996):
    N = int(SR / freq)
    buf = rng.uniform(-1, 1, N)
    buf = lp(buf, 1500 + 6000 * bright, 1) if N > 8 else buf
    out = np.zeros(int(dur * SR))
    b = buf.copy()
    idx = 0
    for i in range(len(out)):
        v = b[idx]
        nxt = b[(idx + 1) % N]
        b[idx] = decay * 0.5 * (v + nxt)
        out[i] = v
        idx = (idx + 1) % N
    return out * env_adsr(len(out), 0.002, 0.08)


_pl_cache = {}


def pluck_c(midi, dur=1.0, bright=0.5):
    k = (midi, round(dur, 2), bright)
    if k not in _pl_cache:
        _pl_cache[k] = pluck(note_f(midi), dur, bright)
    return _pl_cache[k]


def pad(freqs, dur, vol=1.0):
    t = t_arr(dur)
    x = np.zeros_like(t)
    for f in freqs:
        for det in (-0.25, 0.0, 0.3):
            ph = rng.uniform(0, 1)
            x += signal.sawtooth(2 * np.pi * (f * (1 + det / 100)) * t + ph * 6.28)
    x = lp(x, 900, 2)
    return x / (len(freqs) * 3) * env_adsr(len(t), 0.5, 0.6) * vol


def violin(midi, dur, vib=5.5):
    t = t_arr(dur)
    f = note_f(midi)
    vibr = 1 + 0.006 * np.sin(2 * np.pi * vib * t) * np.clip(t / 0.3, 0, 1)
    phase = np.cumsum(2 * np.pi * f * vibr / SR)
    x = signal.sawtooth(phase)
    x = bp(x, 400, 4200, 2) + 0.4 * bp(x, 2400, 3600, 1)
    e = env_adsr(len(t), 0.12, 0.25)
    return x * e * 0.6


def bell(freq, dur=1.6):
    t = t_arr(dur)
    x = np.zeros_like(t)
    for m, a, d in ((1, 1, 1.4), (2.76, 0.5, 0.6), (5.4, 0.25, 0.3), (8.9, 0.12, 0.2)):
        x += a * np.sin(2 * np.pi * freq * m * t) * np.exp(-t / d)
    return x * 0.4


# ------------------------------------------------------------ sfx

def clink(scale=1.0):
    t = t_arr(0.35)
    x = np.zeros_like(t)
    base = rng.uniform(0.9, 1.15) * scale
    for f, a, d in ((2100, 1, 0.12), (3720, 0.7, 0.08), (5310, 0.5, 0.05), (6900, 0.3, 0.04)):
        x += a * np.sin(2 * np.pi * f * base * t + rng.uniform(0, 6)) * np.exp(-t / d)
    return x * 0.35


def tick():
    n = rng.normal(0, 1, int(0.03 * SR))
    return hp(n, 2500) * np.exp(-np.arange(len(n)) / (0.004 * SR)) * 0.5


def thump(f=90):
    t = t_arr(0.18)
    return np.sin(2 * np.pi * f * t * (1 - t)) * np.exp(-t / 0.04) * 0.6 + hp(rng.normal(0, 1, len(t)), 1500) * np.exp(-t / 0.01) * 0.15


def bubble():
    t = t_arr(0.07)
    f = 350 + 900 * (t / 0.07) ** 1.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03) * 0.25


def whoosh(d=0.5, up=True):
    n = rng.normal(0, 1, int(d * SR))
    out = np.zeros_like(n)
    steps = 20
    L = len(n) // steps
    for i in range(steps):
        k = i / steps if up else 1 - i / steps
        lo = 300 + 2500 * k
        seg_ = bp(n[i * L:(i + 1) * L + 200], lo, lo * 1.8, 1)
        out[i * L:i * L + len(seg_)][:len(seg_)] += seg_[:len(out) - i * L]
    e = np.sin(np.linspace(0, np.pi, len(out))) ** 1.5
    return out * e * 0.35


def creak(d=0.9):
    t = t_arr(d)
    f = 160 + 120 * np.sin(2 * np.pi * 1.3 * t) + 40 * rng.normal(0, 1, len(t)).cumsum() / SR
    x = signal.sawtooth(np.cumsum(2 * np.pi * f / SR))
    am = (np.sin(2 * np.pi * 23 * t) > 0.2).astype(float)
    x = bp(x * (0.5 + 0.5 * am), 400, 2500)
    return x * env_adsr(len(t), 0.05, 0.3) * 0.25


def scratch(d=0.6):
    n = rng.normal(0, 1, int(d * SR))
    x = bp(n, 2500, 7000)
    t = t_arr(d)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 7 * t) ** 2
    return x * am * env_adsr(len(x), 0.03, 0.08) * 0.12


def rain(d):
    n = rng.normal(0, 1, int(d * SR))
    x = lp(n, 5000) * 0.25 + hp(n, 4000) * 0.08
    drops = np.zeros_like(n)
    for _ in range(int(d * 40)):
        i = rng.integers(0, len(n) - 400)
        drops[i:i + 300] += hp(rng.normal(0, 1, 300), 2000) * np.exp(-np.arange(300) / 40) * rng.uniform(0.1, 0.4)
    return (x + drops) * env_adsr(len(n), 0.4, 0.5)


def crackle(d):
    n = int(d * SR)
    x = lp(rng.normal(0, 1, n), 300) * 0.25
    for _ in range(int(d * 18)):
        i = rng.integers(0, n - 600)
        x[i:i + 500] += hp(rng.normal(0, 1, 500), 1200) * np.exp(-np.arange(500) / 60) * rng.uniform(0.2, 0.8)
    return x * env_adsr(n, 0.3, 0.4) * 0.5


# ------------------------------------------------------------ music

MINOR = [  # bar chords (bass midi, chord tones)
    (38, [62, 65, 69]),  # Dm
    (43, [62, 67, 70]),  # Gm
    (45, [61, 64, 67]),  # A7
    (38, [62, 65, 69]),  # Dm
    (46, [62, 65, 70]),  # Bb
    (43, [62, 67, 70]),  # Gm
    (45, [61, 64, 69]),  # A
    (38, [62, 65, 69]),  # Dm
]
MAJOR = [
    (41, [65, 69, 72]),  # F
    (36, [64, 67, 72]),  # C
    (38, [62, 65, 69]),  # Dm
    (46, [62, 65, 70]),  # Bb
    (41, [65, 69, 72]),  # F
    (36, [64, 67, 72]),  # C
    (46, [65, 70, 74]),  # Bb
    (41, [65, 69, 72]),  # F
]
VIOLIN_TUNE = [(81, 1.5), (79, 0.5), (77, 1.0), (76, 1.5), (74, 0.5), (73, 1.0), (74, 3.0),
               (77, 1.5), (76, 0.5), (74, 1.0), (73, 1.5), (70, 0.5), (69, 1.0), (74, 3.0)]


def build(timeline, vo_path, out_path):
    total = timeline["total"]
    N = int(total * SR) + SR
    music = np.zeros(N)
    sfx = np.zeros(N)
    vo = np.zeros(N)

    # voice
    with wave.open(vo_path) as w:
        v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        if w.getframerate() != SR:
            v = signal.resample_poly(v, SR, w.getframerate())
    v = hp(v, 80)
    v = v / (np.abs(v).max() + 1e-6) * 0.92
    vo[:len(v)] = v[:N]

    sc = timeline["scenes"]
    lesson_t = sc[4]["start"]
    beat = 0.6
    bar = beat * 3
    t = 0.0
    b = 0
    while t < total - 0.2:
        chords = MINOR
        bass, tones = chords[b % 8]
        place(music, pluck_c(bass, 1.6, 0.3), t, 0.9)
        place(music, pluck_c(bass + 12, 0.9, 0.4), t, 0.25)
        for k in (1, 2):
            for j, n in enumerate(tones):
                place(music, pluck_c(n, 0.8, 0.6), t + k * beat + j * 0.012, 0.32)
        # little melody in odd bars (celesta-ish)
        if b % 2 == 1 and not (sc[5]["start"] <= t < sc[6]["start"]):
            mel = tones[2] + 12
            place(music, bell(note_f(mel), 1.2) * 0.5, t + beat * 0.0, 0.35)
            place(music, bell(note_f(tones[1] + 12), 1.0) * 0.5, t + beat * 2, 0.25)
        place(music, pad([note_f(n - 12) for n in tones], bar + 0.6), t, 0.45)
        t += bar
        b += 1
    # violin solo in scene 6
    vt = 1e9
    end6 = sc[5]["start"] + sc[5]["dur"]
    for n, d in VIOLIN_TUNE:
        if vt > end6:
            break
        place(music, violin(n - 12, d * 0.6 + 0.15), vt, 0.55)
        vt += d * 0.6

    # scene sfx: per-episode file episode_sfx.py with add(sc, sfx, music, g) where g = this module's globals
    try:
        import episode_sfx
        episode_sfx.add(sc, sfx, music, globals())
    except ImportError:
        for s in sc:
            for k in np.arange(s["start"] + 0.3, s["start"] + s["dur"] - 0.2, 1.0):
                place(sfx, tick(), k, 0.3)
    s7 = sc[-1]
    endc = s7["start"] + s7["dur"] - 1.5
    for j_, n in enumerate((62, 65, 69, 74)):
        place(music, pluck_c(n, 1.5, 0.7), endc + j_ * 0.08, 0.5)
    place(music, pad([note_f(50), note_f(53), note_f(57)], 1.8), endc, 0.8)

    # transitions
    for s in sc[1:]:
        place(sfx, whoosh(0.45), s["start"] - 0.25, 0.35)

    # ducking
    envv = np.abs(vo)
    envv = lp(envv, 6, 1)
    envv = np.clip(envv / (envv.max() + 1e-6) * 4, 0, 1)
    duck = 1 - 0.55 * envv
    music = music / (np.abs(music).max() + 1e-6) * 0.42 * duck
    sfx = sfx / (np.abs(sfx).max() + 1e-6) * 0.38 * (1 - 0.35 * envv)
    mix = vo + music + sfx
    # fade end
    fe = int(0.6 * SR)
    mix[int(total * SR) - fe:int(total * SR)] *= np.linspace(1, 0, fe)
    mix[int(total * SR):] = 0
    mix = mix[:int(total * SR)]
    mix = np.tanh(mix * 1.1) * 0.95
    st = np.stack([mix, mix], 1)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    tl = json.load(open(sys.argv[1]))
    build(tl, sys.argv[2], sys.argv[3])
