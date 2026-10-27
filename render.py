"""Render all frames. Usage: python render.py [start_frame end_frame] [--preview]"""
import json, math, os, sys
from multiprocessing import Pool
from PIL import Image
from engine import *
from scenes import SCENES
from overlay import build_chunks, captions, headline, end_card
from script import HEADLINES

TL = json.load(open("timeline.json"))
CHUNKS = build_chunks(TL)
XF = 0.3  # crossfade seconds
OUT = "frames"
os.makedirs(OUT, exist_ok=True)


def scene_at(t):
    for k, s in enumerate(TL["scenes"]):
        if s["start"] <= t < s["start"] + s["dur"]:
            return k
    return len(TL["scenes"]) - 1


def raw(k, lt):
    s = TL["scenes"][k]
    img, cam = SCENES[k](lt, s["dur"])
    img = camera(img.convert("RGB"), cam["zoom"], cam["cx"], cam["cy"])
    return img


def frame(i):
    path = f"{OUT}/{i:05d}.jpg"
    if os.path.exists(path):
        return
    t = i / FPS
    k = scene_at(t)
    s = TL["scenes"][k]
    lt = t - s["start"]
    img = raw(k, lt)
    if k > 0 and lt < XF:
        p = TL["scenes"][k - 1]
        prev = raw(k - 1, p["dur"] + lt)
        img = Image.blend(prev, img, ease(lt / XF))
    img = finish(img, i).convert("RGBA")
    # headline
    txt, a, b = HEADLINES[k]
    hs = s["start"] + a * s["dur"]
    if t >= hs:
        headline(img, txt, t - hs)
    captions(img, CHUNKS, t)
    # end card
    if k == len(TL["scenes"]) - 1:
        endt = TL["total"] - 1.5
        if t > endt:
            img = end_card(img, ease((t - endt) / 0.35), t)
    img.convert("RGB").save(path, quality=92)


if __name__ == "__main__":
    n = int(math.ceil(TL["total"] * FPS))
    rng_ = range(n)
    if len(sys.argv) >= 3 and sys.argv[1].isdigit():
        rng_ = range(int(sys.argv[1]), min(n, int(sys.argv[2])))
    with Pool(int(os.environ.get("NPROC", "2"))) as pool:
        for j, _ in enumerate(pool.imap_unordered(frame, rng_, chunksize=4)):
            if j % 120 == 0:
                print(j, "/", len(rng_), flush=True)
    print("done", n)
