"""Style 2: editorial-cartoon summit grid (ink outlines, halftone shadows, nameplates, speech bubbles).
Usage: python engine2.py episode.py  -> out.mp4   (episode.py defines BEATS, CAST, HOOK, TITLE, GRAPHIC, RULE, TEASE)"""
import importlib.util, math, random, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, SS = 1080, 1920, 24, 2
BG = (237, 233, 226); NAVY = (30, 42, 66); RED = (214, 56, 44); DOT = (150, 140, 130); INK = (0, 0, 0)
FB = "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf"
FI = "/usr/share/fonts/truetype/freefont/FreeSerifItalic.ttf"
FC = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
PIPER = "/home/claude/piper_voices/ru_RU-%s-medium.onnx"


def F(p, s):
    return ImageFont.truetype(p, int(s * SS))


def wob(pts, seed, a=2.0):
    r = random.Random(seed)
    return [(x + r.uniform(-a, a), y + r.uniform(-a, a)) for x, y in pts]


def ell(cx, cy, rx, ry, n=40):
    return [(cx + math.cos(i * 2 * math.pi / n) * rx, cy + math.sin(i * 2 * math.pi / n) * ry) for i in range(n)]


def halftone(img, poly, bbox, step=11):
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    dots = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(dots)
    x0, y0, x1, y1 = [int(v) for v in bbox]
    for j, y in enumerate(range(y0, y1, step * SS)):
        for x in range(x0 + (j % 2) * step * SS // 2, x1, step * SS):
            d.ellipse([x - 2.6 * SS, y - 2.6 * SS, x + 2.6 * SS, y + 2.6 * SS], fill=DOT + (255,))
    dots.putalpha(Image.composite(dots.getchannel("A"), Image.new("L", img.size, 0), m))
    img.alpha_composite(dots)


BW, BH = 540, 620  # sprite size (px, before SS); bust origin at (270, 250)


def make_bust(c, mouth, blink):
    """c: dict(skin, hair, suit, tie, hat, glasses, stache, beard, round, seed). mouth: 0 closed, 1..2 open."""
    S = SS
    img = Image.new("RGBA", (BW * S, BH * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    X = lambda x: (270 + x) * S
    Y = lambda y: (250 + y) * S
    P = lambda pts: [(X(x), Y(y)) for x, y in pts]
    lw = 4 * S
    seed = c.get("seed", 1)
    sh = [(-230, 340), (-200, 190), (-110, 150), (110, 150), (200, 190), (230, 340)]
    d.polygon(P(wob(sh, seed)), fill=c["suit"])
    d.line(P(wob(sh, seed)), fill=INK, width=lw, joint="curve")
    d.polygon(P([(-50, 150), (50, 150), (0, 262)]), fill=(232, 228, 220), outline=INK)
    d.polygon(P([(-16, 170), (16, 170), (24, 300), (0, 322), (-24, 300)]), fill=c["tie"], outline=INK, width=3 * S)
    nk = [(-48, 70), (48, 70), (52, 160), (0, 190), (-52, 160)]
    d.polygon(P(nk), fill=c["skin"])
    d.line(P([(-48, 70), (-52, 160), (0, 190), (52, 160), (48, 70)]), fill=INK, width=lw)
    rd = c.get("round", 0)
    hx = 96 + 14 * rd
    head = wob([(-hx, -60), (-hx - 4, 10), (-hx + 22, 80 + 8 * rd), (-30, 126 + 6 * rd), (0, 132 + 6 * rd), (30, 126 + 6 * rd), (hx - 22, 80 + 8 * rd),
                (hx + 4, 10), (hx, -60), (70, -118), (0, -140), (-70, -118)], seed + 1, 1.6)
    d.polygon(P(head), fill=c["skin"])
    d.line(P(head) + [P(head)[0]], fill=INK, width=lw, joint="curve")
    if c.get("hair") is not None and not c.get("hat"):
        hair = wob([(-hx - 2, -40), (-hx + 4, -112), (-40, -150), (30, -156), (hx - 8, -120), (hx + 2, -40), (hx - 12, -84), (20, -110), (-60, -96)], seed + 2, 1.5)
        d.polygon(P(hair), fill=c["hair"])
        d.line(P(hair) + [P(hair)[0]], fill=INK, width=lw, joint="curve")
        for i in range(4):
            d.line(P([(-50 + i * 30, -140), (-40 + i * 30, -104)]), fill=INK, width=2 * S)
    if c.get("hair") is not None and c.get("hat"):  # side hair under hat
        for sx in (-1, 1):
            d.polygon(P([(sx * hx, -60), (sx * (hx + 10), 0), (sx * (hx - 14), -10)]), fill=c["hair"], outline=INK)
    for ex in (-38, 38):
        if blink:
            d.line(P([(ex - 22, -18), (ex + 22, -18)]), fill=INK, width=3 * S)
        else:
            e = ell(ex, -18, 22, 11, 24)
            d.polygon(P(e), fill=(244, 240, 232))
            d.line(P(e) + [P(e)[0]], fill=INK, width=3 * S)
            d.ellipse([X(ex + 2 - 5), Y(-18 - 5), X(ex + 2 + 5), Y(-18 + 5)], fill=INK)
        d.line(P([(ex - 26, -42), (ex + 24, -46 if ex > 0 else -44)]), fill=INK, width=3 * S)
    if c.get("glasses"):
        for ex in (-38, 38):
            d.line(P(ell(ex, -18, 30, 24)) + [P(ell(ex, -18, 30, 24))[0]], fill=INK, width=3 * S)
        d.line(P([(-8, -18), (8, -18)]), fill=INK, width=3 * S)
    d.line(P([(0, -6), (-8 - 4 * rd, 30), (8 + 4 * rd, 34)]), fill=INK, width=3 * S)
    if c.get("stache"):
        st = wob([(-44, 52), (-20, 42), (0, 48), (20, 42), (44, 52), (20, 60), (0, 56), (-20, 60)], seed + 5, 1)
        d.polygon(P(st), fill=c["stache"], outline=INK)
    if c.get("beard"):
        bd = wob([(-60, 70), (-30, 126), (0, 150), (30, 126), (60, 70), (30, 100), (0, 108), (-30, 100)], seed + 6, 1.5)
        d.polygon(P(bd), fill=c["beard"], outline=INK)
    if mouth:
        o = 4 + 6 * (mouth - 1)
        m = ell(0, 76, 22, o, 20)
        d.polygon(P(m), fill=(60, 30, 30))
        d.line(P(m) + [P(m)[0]], fill=INK, width=3 * S)
    else:
        d.line(P([(-24, 76), (0, 79), (24, 76)]), fill=INK, width=3 * S)
    if c.get("hat"):
        if c["hat"] == "basin":  # barber's basin helmet
            hp = wob([(-110, -80), (-90, -150), (0, -190), (90, -150), (110, -80), (60, -100), (-60, -100)], seed + 3, 1.5)
            d.polygon(P(hp), fill=(190, 196, 202))
            d.line(P(hp) + [P(hp)[0]], fill=INK, width=lw, joint="curve")
            d.arc([X(-60), Y(-170), X(10), Y(-120)], 200, 300, fill=(250, 250, 250), width=4 * S)
        else:  # cap
            hp = wob([(-104, -70), (-90, -140), (0, -170), (90, -140), (104, -70), (140, -64), (130, -48), (-104, -50)], seed + 3, 1.5)
            d.polygon(P(hp), fill=c["hatcol"])
            d.line(P(hp) + [P(hp)[0]], fill=INK, width=lw, joint="curve")
    # halftone shadow, light from upper-left -> right side
    halftone(img, P([(30, -140), (hx, -60), (hx, 10), (hx - 22, 80), (30, 126), (10, 126), (40, 40), (40, -60)]), (X(10), Y(-140), X(hx + 6), Y(138)))
    halftone(img, P([(20, 70), (52, 70), (52, 160), (0, 190), (8, 130)]), (X(0), Y(70), X(56), Y(190)))
    halftone(img, P([(110, 150), (200, 190), (230, 340), (120, 340)]), (X(100), Y(150), X(232), Y(340)), 13)
    d.line(P([(-34, 168), (-40, 220), (-26, 290)]), fill=INK, width=2 * S)  # lavalier wire
    d.ellipse([X(-42), Y(206), X(-30), Y(218)], fill=INK)
    return img


_cache = {}


def bust_sprite(name, c, mouth, blink):
    k = (name, mouth, blink)
    if k not in _cache:
        _cache[k] = make_bust(c, mouth, blink)
    return _cache[k]


def plate(d, x0, y0, x1, y1, c):
    S = SS
    d.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], fill=NAVY)
    d.rectangle([(x0 + 14) * S, (y0 + 16) * S, (x0 + 62) * S, (y0 + 48) * S], fill=c["flag"], outline=INK, width=2 * S)
    d.text(((x0 + 80) * S, (y0 + 30) * S), c["name"], font=F(FC, 34), fill=BG, anchor="lm")
    d.text(((x0 + 80) * S, (y0 + 68) * S), c["sub"], font=F(FI, 28), fill=(210, 206, 198), anchor="lm")


def bubble(img, cx, ytop, text, k, size=40):
    S = SS
    d = ImageDraw.Draw(img)
    if len(text) > 50:
        size = 33
    f = F(FC, size)
    maxw = 330 + 6 * size
    lines, cur = [], ""
    for w in text.upper().split():
        if cur and d.textlength(cur + " " + w, font=f) / S > maxw:
            lines.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    lines.append(cur)
    lh = size * 1.3
    w_ = max(d.textlength(l, font=f) / S for l in lines) + 60
    h_ = lh * len(lines) + 40
    w_ *= min(1, max(0.05, k * 4))
    x0, y0, x1, y1 = cx - w_ / 2, ytop, cx + w_ / 2, ytop + h_
    d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], 28 * S, fill=(255, 255, 255), outline=INK, width=5 * S)
    d.polygon([((cx - 20) * S, y1 * S), ((cx + 22) * S, y1 * S), ((cx + 4) * S, (y1 + 44) * S)], fill=(255, 255, 255), outline=INK)
    d.line([((cx - 17) * S, (y1 - 1) * S), ((cx + 19) * S, (y1 - 1) * S)], fill=(255, 255, 255), width=7 * S)
    if k > 0.3:
        for i, l in enumerate(lines):
            d.text((cx * S, (y0 + 20 + lh / 2 + i * lh) * S), l, font=f, fill=INK, anchor="mm")
    return h_


def synth(beats, cast):
    from piper import PiperVoice, SynthesisConfig
    voices = {}
    out = []
    for b in beats:
        vn = cast[b["who"]]["voice"] if b["who"] in cast else b["voice"]
        if vn not in voices:
            voices[vn] = PiperVoice.load(PIPER % vn)
        ch = list(voices[vn].synthesize(b["say"], SynthesisConfig(length_scale=b.get("ls", 0.93))))
        a = np.concatenate([c.audio_int16_array for c in ch]).astype(np.float32) / 32768
        out.append((a, ch[0].sample_rate))
    return out


def load(path):
    spec = importlib.util.spec_from_file_location("ep", path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def main(path, out="out.mp4"):
    ep = load(path)
    clips = synth(ep.BEATS, ep.CAST)
    SR = clips[0][1]
    GAP = 0.3
    t = 0.2
    for b, (a, _) in zip(ep.BEATS, clips):
        b["s"], b["e"] = t, t + len(a) / SR
        t = b["e"] + GAP
    END = t + 0.5 + ep.END_CARD
    audio = np.zeros(int(END * SR) + SR, np.float32)
    for b, (a, _) in zip(ep.BEATS, clips):
        audio[int(b["s"] * SR):int(b["s"] * SR) + len(a)] += a
    with wave.open("vo.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(audio[:int(END * SR)], -1, 1) * 32767).astype(np.int16).tobytes())
    print("total", END, [round(b["e"] - b["s"], 1) for b in ep.BEATS], flush=True)

    def frame(tm):
        img = Image.new("RGBA", (W * SS, H * SS), BG + (255,))
        d = ImageDraw.Draw(img)
        beat = None
        for b in ep.BEATS:
            if b["s"] - 0.05 <= tm < b["e"] + GAP:
                beat = b
        if tm >= END - ep.END_CARD:
            return ep.draw_end(img, d, tm - (END - ep.END_CARD), SS, F, FC, FI, FB)
        ep.draw_top(img, d, tm, beat, SS, F, FC, FI, FB, ep)
        for name, (cx, cy) in ep.LAYOUT.items():
            c = ep.CAST[name]
            talking = beat is not None and beat["who"] == name and tm < beat["e"]
            mouth = (1 + int(tm * 9) % 2) if talking else 0
            blink = (int(tm * 24) % 100) in (0, 1)
            sp = bust_sprite(name, c, mouth, blink)
            ox = math.sin(tm * 1.6 + c["seed"]) * 5
            oy = math.sin(tm * 2.2 + c["seed"]) * 3 + (-3 * abs(math.sin(tm * 9)) if talking else 0)
            img.alpha_composite(sp, (int((cx - 270 + ox) * SS), int((cy - 250 + oy) * SS)))
        d = ImageDraw.Draw(img)
        for name, (cx, cy) in ep.LAYOUT.items():
            plate(d, cx - 250, cy + 190, cx + 250, cy + 290, ep.CAST[name])
        if beat is not None and beat["who"] in ep.LAYOUT:
            cx, cy = ep.LAYOUT[beat["who"]]
            bubble(img, cx, ep.BUBBLE_Y, beat["say"], tm - beat["s"])
        ep.draw_bottom(img, ImageDraw.Draw(img), tm, beat, SS, F, FC, FI, FB, ep)
        return img

    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", "vo.wav",
                          "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    n = int(END * FPS)
    for i in range(n):
        im = frame(i / FPS).convert("RGB").resize((W, H), Image.LANCZOS)
        if i in (3, int(n * .3), int(n * .55), int(n * .8), n - 5):
            im.save(f"chk_{i}.png")
        p.stdin.write(im.tobytes())
    p.stdin.close()
    p.wait()
    print("done", n, END)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "out.mp4")
