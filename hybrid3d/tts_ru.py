"""usage: /home/claude/tts_venv/bin/python tts_ru.py STORY_DIR [dmitry|denis] [rate] -> vo.wav, timing.json in STORY_DIR.
script.json: [["s01","Фраза, числа словами.",["Подпись","по частям"]], ...]. Finished phrases are cached in STORY_DIR/.tts, so a rerun resumes."""
import asyncio,json,os,re,subprocess,sys,tempfile,time,wave
import numpy as np
d=sys.argv[1];voice=sys.argv[2] if len(sys.argv)>2 else "dmitry";rate=sys.argv[3] if len(sys.argv)>3 else "+8%";S=json.load(open(d+"/script.json"));SR=24000
def edge(t):
    import edge_tts
    last=None
    for a in range(40):
        try:
            with tempfile.NamedTemporaryFile(suffix=".mp3") as f:
                asyncio.run(edge_tts.Communicate(t,"ru-RU-DmitryNeural",rate=rate,proxy=os.environ.get("HTTPS_PROXY")).save(f.name))
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
def w_(c):
    n=len(re.sub(r"[^\w ]","",c))+sum(4 for ch in c if ch.isdigit())+2
    if re.search(r"[.?!]$",c):n+=7
    elif c.endswith(","):n+=4
    return n
os.makedirs(d+"/.tts",exist_ok=True);t=.2;out=[np.zeros(int(.2*SR),np.float32)];caps=[];segs=[]
for sid,text,chunks in S:
    fn=f"{d}/.tts/{sid}.npy"
    if os.path.exists(fn):a=np.load(fn)
    else:
        a=(edge if voice=="dmitry" else piper)(text);i=np.where(np.abs(a)>.008)[0];a=a[max(i[0]-200,0):i[-1]+800];np.save(fn,a)
    D=len(a)/SR;ws=[w_(c) for c in chunks];tt=t
    for c,x in zip(chunks,ws):
        dd=D*x/sum(ws);caps.append({"t":round(tt,3),"e":round(tt+dd,3),"text":c,"seg":sid});tt+=dd
    segs.append({"id":sid,"t":round(t,3),"e":round(t+D,3)});out+=[a,np.zeros(int(SR*.22),np.float32)];t+=D+.22
out.append(np.zeros(int(SR*.4),np.float32));y=(np.concatenate(out)*32767).astype(np.int16)
with wave.open(d+"/vo.wav","wb") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(y.tobytes())
json.dump({"dur":len(y)/SR,"caps":caps,"segs":segs},open(d+"/timing.json","w"),ensure_ascii=False,indent=0);print(round(len(y)/SR,2))
