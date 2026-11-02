"""usage: /home/claude/tts_venv/bin/python tts_ru.py STORY_DIR [dmitry|denis]  -> vo.wav, timing.json in STORY_DIR.
Numbers in script.json phrases are written as words. Falls back to Piper denis only when asked."""
import asyncio,json,os,subprocess,sys,tempfile,time,wave
import numpy as np
d=sys.argv[1];voice=sys.argv[2] if len(sys.argv)>2 else "dmitry";S=json.load(open(d+"/script.json"));SR=24000;L=set(S.get("long_gap_after",[]))
def edge(t):
    import edge_tts
    last=None
    for a in range(40):
        try:
            with tempfile.NamedTemporaryFile(suffix=".mp3") as f:
                asyncio.run(edge_tts.Communicate(t,"ru-RU-DmitryNeural",rate=S.get("rate","+8%"),proxy=os.environ.get("HTTPS_PROXY")).save(f.name))
                if os.path.getsize(f.name)==0:raise RuntimeError("empty")
                pcm=subprocess.run(["ffmpeg","-loglevel","error","-i",f.name,"-f","s16le","-ac","1","-ar",str(SR),"-"],check=True,capture_output=True).stdout
            return np.frombuffer(pcm,np.int16).astype(np.float32)/32768
        except Exception as e:
            last=e;time.sleep(min(20,3+a))
    raise RuntimeError(f"edge-tts failed: {last}")
def piper(t):
    from piper import PiperVoice,SynthesisConfig
    global _p
    if "_p" not in globals():_p=PiperVoice.load(os.environ.get("PIPER_DIR","/home/claude/piper_voices")+"/ru_RU-denis-medium.onnx")
    ch=list(_p.synthesize(t,SynthesisConfig(length_scale=.9)));x=np.concatenate([c.audio_int16_array for c in ch]).astype(np.float32)/32768
    return np.interp(np.arange(int(len(x)*SR/ch[0].sample_rate))*ch[0].sample_rate/SR,np.arange(len(x)),x)
out=[np.zeros(int(.12*SR))];t=.12;tl=[]
for i,p in enumerate(S["phrases"]):
    a=(edge if voice=="dmitry" else piper)(p);idx=np.where(np.abs(a)>.008)[0];a=a[max(idx[0]-200,0):idx[-1]+800];n=len(a)/SR
    tl.append(dict(i=i,text=p,start=round(t,3),end=round(t+n,3)));out.append(a)
    g=.16 if i in L else .08;out.append(np.zeros(int(g*SR)));t+=n+g
x=(np.concatenate(out)*32767).astype(np.int16)
with wave.open(d+"/vo.wav","wb") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(x.tobytes())
json.dump(tl,open(d+"/timing.json","w"),ensure_ascii=False,indent=0);print(round(t,2))
