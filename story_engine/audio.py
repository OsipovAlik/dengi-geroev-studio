import numpy as np,soundfile as sf,json
from scipy.signal import butter,sosfilt
import os,sys
sys.path.insert(0,os.getcwd())
import shots
from shots import SH_LIST,T,e
sr=44100;N=int((e+.2)*sr);rng=np.random.default_rng(3)
def env(n,a=.002,d=.2):
    t=np.arange(n)/sr;return np.minimum(t/a,1)*np.exp(-t/d)
def bp(x,lo,hi):return sosfilt(butter(2,[lo,hi],'band',fs=sr,output='sos'),x)
def lp(x,f):return sosfilt(butter(2,f,'low',fs=sr,output='sos'),x)
sfx=np.zeros(N);mus=np.zeros(N)
def put(b,x,t,g=1):
    i=int(t*sr);n=min(len(x),len(b)-i)
    if n>0 and i>=0:b[i:i+n]+=x[:n]*g
def whoosh(t,g=.5):
    n=int(.28*sr);x=rng.standard_normal(n);w=np.sin(np.linspace(0,np.pi,n))**2;f=np.zeros(n)
    put(sfx,bp(x,500,3500)*w,t-.09,g)
def tick(t,g=.35,f=2600):
    n=int(.04*sr);x=(np.sin(2*np.pi*f*np.arange(n)/sr)+.6*rng.standard_normal(n))*env(n,.0005,.006);put(sfx,x,t,g)
def thud(t,g=1.):
    n=int(.7*sr);tt=np.arange(n)/sr;x=np.sin(2*np.pi*(95*tt-30*tt*tt))*env(n,.001,.16)+.5*bp(rng.standard_normal(n),200,3000)*env(n,.001,.05);put(sfx,x,t,g)
def crack(t,g=.8):
    n=int(.35*sr);x=bp(rng.standard_normal(n),700,6000)*env(n,.001,.05);put(sfx,x,t,g)
def ding(t,f=1560,g=.35):
    n=int(1.1*sr);tt=np.arange(n)/sr;x=(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*f*2.76*tt))*env(n,.001,.32);put(sfx,x,t,g)
def noise(a,b,lo,hi,g,mod=0):
    n=int((b-a)*sr);x=bp(rng.standard_normal(n),lo,hi);w=np.minimum(1,np.minimum(np.arange(n),n-np.arange(n))/(.08*sr))
    if mod:w=w*(.6+.4*np.sin(2*np.pi*mod*np.arange(n)/sr+1.2*np.sin(np.arange(n)/sr*3)))
    put(sfx,x*w,a,g)
d={s[0]:s for s in SH_LIST}
for s in SH_LIST:
    if s[4]:whoosh(s[1],.42)
    else:tick(s[1],.12,900)
# story-specific cues come from shots.py: CUES(fx,d) gets the sound helpers and shots by name
fx=dict(whoosh=whoosh,tick=tick,thud=thud,crack=crack,ding=ding,noise=noise)
if hasattr(shots,'CUES'):shots.CUES(fx,d)
# music: dry western pluck, A minor, 112 bpm; stops at the reveal
bpm=112;beat=60/bpm;NOTE={'A2':110,'C3':130.8,'D3':146.8,'E3':164.8,'G3':196,'A3':220,'C4':261.6,'E4':329.6,'G4':392}
def pluck(f,t,g,dec=.26):
    n=int(.8*sr);tt=np.arange(n)/sr;x=(np.sin(2*np.pi*f*tt)+.45*np.sin(4*np.pi*f*tt)+.2*np.sin(6*np.pi*f*tt))*env(n,.003,dec);put(mus,x,t,g)
bars=['A2','A2','E3','A2','D3','D3','A2','E3'];mel=['A3','C4','E4',None,'G3','E4','C4',None,'A3',None,'C4','E4','G3',None,'E3','G3']
t=0;i=0;stop=d[shots.MUSIC_STOP[0]][1];resume=d[shots.MUSIC_STOP[1]][1]
while t<e:
    if t<stop-.05 or t>=resume:
        amp=.9 if t<stop else .7
        if i%2==0:pluck(NOTE[bars[(i//2)%8]],t,.4*amp,.3)
        m=mel[i%16]
        if m:pluck(NOTE[m],t,.17*amp,.18)
        n=int(.03*sr);put(mus,bp(rng.standard_normal(n),5000,10000)*env(n,.001,.008),t+beat/4,.1*amp)
    t+=beat/2;i+=1
# brief tension drone at reveal
n=int((resume-stop)*sr);tt=np.arange(n)/sr;x=np.sin(2*np.pi*55*tt)*.5+np.sin(2*np.pi*82.4*tt)*.25;put(mus,x*np.minimum(1,tt/.3),stop,.1)
# voice + duck
v,vs=sf.read('vo.wav');assert vs==24000
vi=np.interp(np.arange(int(len(v)*sr/24000))/sr,np.arange(len(v))/24000,v)
vo=np.zeros(N);put(vo,vi,0,1.0)
e2=np.abs(vo);k=int(.06*sr);ev=np.convolve(e2,np.ones(k)/k,'same');duck=1-.5*np.clip(ev*12,0,1);mix=vo*1.0+mus*duck*.5+sfx*.72
mix=np.tanh(mix*1.05)/1.05
sf.write('mix_raw.wav',np.stack([mix,mix],1),sr)
print(e)
