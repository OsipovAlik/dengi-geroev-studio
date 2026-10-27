import json, re, difflib, subprocess, wave
import numpy as np

LEAD, TAIL = 0.5, 2.2
txt = open("/home/user/dengi-geroev-studio/long/bezos_script.md", encoding="utf-8").read()
body = txt.split("## 1.")[0] and ("## 1." + txt.split("## 1.", 1)[1]).split("\n---")[0]
parts = re.split(r"^## \d+\..*$", body, flags=re.M)[1:]
scene_text = [" ".join(p.split()) for p in parts]
assert len(scene_text) == 14, len(scene_text)


def norm(w):
    w = w.lower().replace("ё", "е")
    return re.sub(r"[^0-9a-zа-я]", "", w)


S = []  # (scene, token)
for k, t in enumerate(scene_text):
    for tok in t.split():
        S.append((k, tok))
asr = json.load(open("asr_words.json"))
a_norm = [norm(w["w"]) for w in asr]
s_norm = [norm(t) for _, t in S]
sm = difflib.SequenceMatcher(None, s_norm, a_norm, autojunk=False)
st = [None] * len(S)
en = [None] * len(S)
for i, j, n in sm.get_matching_blocks():
    for q in range(n):
        st[i + q], en[i + q] = asr[j + q]["s"], asr[j + q]["e"]
matched = sum(1 for x in st if x is not None)
print("matched", matched, "/", len(S))
# interpolate gaps
i = 0
while i < len(S):
    if st[i] is None:
        j = i
        while j < len(S) and st[j] is None:
            j += 1
        t0 = en[i - 1] if i > 0 else 0.0
        t1 = st[j] if j < len(S) else asr[-1]["e"]
        lens = [len(norm(S[q][1])) + 1 for q in range(i, j)]
        tot = sum(lens)
        cur = t0
        for q, L in zip(range(i, j), lens):
            d = (t1 - t0) * L / tot
            st[q], en[q] = cur, cur + d
            cur += d
        i = j
    else:
        i += 1
for q in range(len(S)):
    if en[q] <= st[q]:
        en[q] = st[q] + 0.08
    if q + 1 < len(S) and en[q] > st[q + 1]:
        en[q] = max(st[q] + 0.05, st[q + 1])
# ---- edit audio: cut spoken block headings and the trailing notes
import scipy.io.wavfile as wf
sr, x0 = wf.read("voice44.wav")
x0 = x0.astype(np.float32) / 32768
env = np.sqrt(np.convolve(x0 ** 2, np.ones(int(0.01 * sr)) / int(0.01 * sr), "same"))
amap = {}
for i_, j_, n_ in sm.get_matching_blocks():
    for q_ in range(n_):
        amap[i_ + q_] = j_ + q_
ORD = ("перв", "втор", "трет", "четв", "четер", "пят", "шест", "седьм", "восьм", "девят", "десят", "одиннадц", "двенадц", "тринадц")
first_ = {}
for q_, (k_, _) in enumerate(S):
    first_.setdefault(k_, q_)


def quiet(t, lo, hi):
    a, b = int((t + lo) * sr), int((t + hi) * sr)
    a, b = max(0, a), min(len(env), b)
    return (a + int(np.argmin(env[a:b]))) / sr


cuts = []  # (old_a, old_b)
for k_ in range(14):
    q_ = first_[k_]
    while q_ not in amap:
        q_ += 1
    j_ = amap[q_]
    h = j_
    for back in range(1, 10):
        jj = j_ - back
        if jj < 0:
            break
        w = norm(asr[jj]["w"])
        prev_ok = jj == 0 or asr[jj - 1]["w"].rstrip()[-1:] in ".?!"
        if prev_ok and w.startswith(ORD):
            h = jj
    ca = 0.0 if h == 0 else quiet(asr[h]["s"], -0.7, -0.05)
    cb = quiet(asr[j_]["s"], -0.5, -0.02)
    cuts.append((ca, cb))
# trailing notes
lastq = max(q_ for q_, (k_, _) in enumerate(S) if k_ == 13 and q_ in amap)
end_old = quiet(asr[amap[lastq]]["e"], 0.05, 0.5)
GAP = 0.35
segs = []
pos = 0.0
for ca, cb in cuts:
    if ca > pos:
        segs.append((pos, ca))
    pos = cb
segs.append((pos, end_old))
new = []
mp = []  # (old_a, old_b, new_a)
cur = 0.0
for i_, (a, b) in enumerate(segs):
    piece = x0[int(a * sr):int(b * sr)].copy()
    f = int(0.006 * sr)
    piece[:f] *= np.linspace(0, 1, f)
    piece[-f:] *= np.linspace(1, 0, f)
    if i_ > 0:
        new.append(np.zeros(int(GAP * sr), np.float32))
        cur += GAP
    mp.append((a, b, cur))
    new.append(piece)
    cur += len(piece) / sr


def remap(t):
    for a, b, na in mp:
        if t < a:
            return na
        if t <= b:
            return na + (t - a)
    a, b, na = mp[-1]
    return na + (b - a)


vo_edit = np.concatenate(new)
st = [remap(v) for v in st]
en = [remap(v) for v in en]
for q in range(len(S)):
    if en[q] <= st[q]:
        en[q] = st[q] + 0.08
print("edited voice", round(len(vo_edit) / sr, 1), "s; cuts", len(cuts))

# scene bounds
first = {}
for q, (k, _) in enumerate(S):
    first.setdefault(k, q)
vo_dur = len(vo_edit) / sr
total = LEAD + vo_dur + TAIL
starts = [0.0] + [max(0.0, st[first[k]] + LEAD - 0.4) for k in range(1, 14)]
scenes = []
for k in range(14):
    e = starts[k + 1] if k < 13 else total
    scenes.append(dict(start=round(starts[k], 3), dur=round(e - starts[k], 3)))
sentences = []
for k in range(14):
    qs = [q for q, (kk, _) in enumerate(S) if kk == k]
    cur = []
    for q in qs:
        cur.append(q)
        if re.search(r"[.!?…]$", S[q][1]):
            sentences.append(cur)
            cur = []
    if cur:
        sentences.append(cur)
out_s = []
for qs in sentences:
    words = [dict(w=S[q][1], s=round(st[q] + LEAD, 3), e=round(en[q] + LEAD, 3)) for q in qs]
    out_s.append(dict(scene=S[qs[0]][0], s=words[0]["s"], e=words[-1]["e"], text=" ".join(w["w"] for w in words), words=words))
json.dump(dict(scenes=scenes, sentences=out_s, total=round(total, 3)), open("timeline.json", "w"), ensure_ascii=False, indent=1)
print("total", round(total, 1), [round(s["dur"]) for s in scenes])
# padded voice wav
y = np.concatenate([np.zeros(int(LEAD * sr), np.float32), vo_edit, np.zeros(int(TAIL * sr), np.float32)])
wf.write("vo.wav", sr, (np.clip(y, -1, 1) * 32767).astype(np.int16))
