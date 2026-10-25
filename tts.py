"""Synthesize the voiceover sentence by sentence and build timeline.json + vo.wav.
Usage: python tts.py [--estimate] [voice]
voice: denis (default), dmitri, ruslan, irina — Piper (models from huggingface.co, see setup.sh);
       aleksandr, anna, elena — RHVoice (old voice)."""
import io, json, os, re, sys, wave
import numpy as np
from script import SCRIPT, HEADLINES, LEAD_IN, TAIL, SENT_GAP

SR = 24000
estimate = "--estimate" in sys.argv
args = [a for a in sys.argv[1:] if not a.startswith("--")]
voice = args[0] if args else "denis"
PIPER_VOICES = ("denis", "dmitri", "ruslan", "irina")
PIPER_DIR = os.environ.get("PIPER_DIR", "/home/claude/piper_voices")


def synth_piper(text):
    from piper import PiperVoice, SynthesisConfig
    global _piper
    if "_piper" not in globals():
        _piper = PiperVoice.load(f"{PIPER_DIR}/ru_RU-{voice}-medium.onnx")
    chunks = list(_piper.synthesize(text, SynthesisConfig(length_scale=0.92)))
    x = np.concatenate([c.audio_int16_array for c in chunks]).astype(np.float32) / 32768
    return chunks[0].sample_rate, x


def synth_rhvoice(text):
    from rhvoice_wrapper import TTS
    global _tts
    if "_tts" not in globals():
        import rhvoice_wrapper_bin as b, rhvoice_wrapper_data as dd
        _tts = TTS(threads=1, lib_path=b.lib_path, data_path=dd.data_path, quiet=True)
    data = _tts.get(text, voice=voice, format_="wav", sets=dict(absolute_rate=0.15, absolute_pitch=-0.08))
    with wave.open(io.BytesIO(data)) as w:
        return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def synth(text):
    sr, x = (synth_piper if voice in PIPER_VOICES else synth_rhvoice)(text)
    if sr != SR:
        from scipy import signal
        x = signal.resample_poly(x, SR, sr)
    # trim silence
    a = np.abs(x)
    thr = 0.02 * a.max()
    idx = np.where(a > thr)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.02 * SR)): idx[-1] + int(0.05 * SR)]
    return x


def word_times(text, s, e):
    words = text.split()
    weights = [len(re.sub(r"[^\wЁё%]", "", w)) + 1.5 + (2.5 if re.search(r"[.,!?—:]$", w) else 0) for w in words]
    # trailing punctuation pause shouldn't extend the last word
    tot = sum(weights)
    out, cur = [], s
    for w, wt in zip(words, weights):
        d = (e - s) * wt / tot
        out.append(dict(w=w, s=round(cur, 3), e=round(cur + d, 3)))
        cur += d
    return out


timeline = dict(scenes=[], sentences=[])
audio = []
t = 0.0
for k, sents in enumerate(SCRIPT):
    start = t
    t += LEAD_IN[k]
    audio.append(np.zeros(int(LEAD_IN[k] * SR)))
    for j, (say, show) in enumerate(sents):
        if estimate:
            d = len(say) / 14.5
            x = np.zeros(int(d * SR))
        else:
            x = synth(say)
            d = len(x) / SR
        timeline["sentences"].append(dict(scene=k, s=round(t, 3), e=round(t + d, 3), text=show,
                                          words=word_times(show, t, t + d)))
        audio.append(x)
        t += d
        if j < len(sents) - 1:
            audio.append(np.zeros(int(SENT_GAP * SR)))
            t += SENT_GAP
    audio.append(np.zeros(int(TAIL[k] * SR)))
    t += TAIL[k]
    timeline["scenes"].append(dict(start=round(start, 3), dur=round(t - start, 3)))
timeline["total"] = round(t, 3)

vo = np.concatenate(audio)
with wave.open("vo.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(vo, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump(timeline, open("timeline.json", "w"), ensure_ascii=False, indent=1)
print("total", timeline["total"], [s["dur"] for s in timeline["scenes"]])

import os
os._exit(0)
