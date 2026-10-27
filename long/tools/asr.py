import json
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe("voice.wav", language="ru", word_timestamps=True, vad_filter=False, beam_size=5)
out = []
for s in segs:
    for w in s.words:
        out.append(dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)))
    print(round(s.end), flush=True)
json.dump(out, open("asr_words.json", "w"), ensure_ascii=False)
print("ASRDONE", len(out))
