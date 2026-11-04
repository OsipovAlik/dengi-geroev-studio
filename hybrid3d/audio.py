# usage: python3 audio.py STORY_DIR  -> STORY_DIR/out/mix.m4a  (uses vo.wav, timing.json, sound.json, out/shots.json)
import json,os,sys,subprocess,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,resample_poly
D=sys.argv[1];sr=44100;T=json.load(open(D+'/timing.json'));SND=json.load(open(D+'/sound.json'));SH=json.load(open(D+'/out/shots.json'));dur=T['dur'];N=int(sr*dur)+sr
rs=np.random.RandomState(3);vo,vr=sf.read(D+'/vo.wav');vo=resample_poly(vo,147,80);vo=np.pad(vo,(0,max(0,N-len(vo))))[:N]
caps={c['text']:c for c in T['caps']};seg={s['id']:s for s in T['segs']}
def when(a):
    if isinstance(a,(int,float)):return float(a)
    if 'cap' in a:return caps[a['cap']]['t']+a.get('off',0)
    return seg[a['seg']][a.get('k','t')]+a.get('off',0)
def lp(x,f,o=2):return sosfilt(butter(o,f,'low',fs=sr,output='sos'),x)
def hp(x,f,o=2):return sosfilt(butter(o,f,'high',fs=sr,output='sos'),x)
def bp(x,a,b):return sosfilt(butter(2,[a,b],'band',fs=sr,output='sos'),x)
def add(b,t,s,g=1):
    i=int(t*sr);n=min(len(s),N-i)
    if i<0 or n<=0:return
    b[i:i+n]+=s[:n]*g
def env(n,a,d):
    t=np.arange(n)/sr;return (1-np.exp(-t/a))*np.exp(-t/d)
def pluck(f,d=.35,g=1):
    n=int(sr*d*2);t=np.arange(n)/sr
    s=(np.sin(2*np.pi*f*t)+.45*np.sin(4*np.pi*f*t)+.2*np.sin(6*np.pi*f*t))*env(n,.002,d*.4);return s*g
def bass(f,d=.5):
    n=int(sr*d);t=np.arange(n)/sr;return (np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t))*env(n,.004,d*.55)
def noise(d):return rs.randn(int(sr*d))
def whoosh(d=.42,up=True):
    n=int(sr*d);x=noise(d);u=np.linspace(0,1,n);
    o=np.zeros(n);bl=512
    for i in range(0,n-bl,bl):
        f=300+ (u[i] if up else 1-u[i])**2*5200
        o[i:i+bl]=x[i:i+bl]
    o=bp(o,250,6500)*np.sin(np.pi*u)**1.6;return o
def thud(d=.45,f=62):
    n=int(sr*d);t=np.arange(n)/sr;return np.sin(2*np.pi*(f*t+18*(1-np.exp(-t*30))/3))*env(n,.002,d*.3)+lp(noise(d),900)*env(n,.001,.05)*.5
def tick():return hp(noise(.03),3000)*env(int(sr*.03),.0005,.006)
def crack(d=.9):
    x=noise(d);o=hp(x,1200)*(rs.rand(len(x))>.965)*3+lp(x,300)*env(len(x),.002,d*.35)*1.3;return o*env(len(x),.001,d*.5)
def rumble(d):
    x=lp(noise(d),140,3)*12;u=np.linspace(0,1,len(x));return x*np.sin(np.pi*u)**.6
def debris(d=1.2):
    o=np.zeros(int(sr*d))
    for i in range(36):
        t=rs.rand()*d*.7;f=rs.uniform(500,2600);s=bp(noise(.05),f*.7,f)*env(int(sr*.05),.001,.012)
        j=int(t*sr);o[j:j+len(s)]+=s[:len(o)-j]*rs.uniform(.5,1.6)
    return o
def roller(d):
    x=bp(noise(d),500,2400);t=np.arange(len(x))/sr;return x*(.5+.5*np.sin(2*np.pi*2.6*t))**2
def glug(d):
    o=np.zeros(int(sr*d));
    for k in range(int(d*7)):
        j=int((k+rs.rand())/7*sr);n=int(.09*sr);t=np.arange(n)/sr;s=np.sin(2*np.pi*(180+900*t)*t)*env(n,.003,.03);o[j:j+n]+=s[:max(0,len(o)-j)]
    return o
def clink():
    n=int(sr*.3);t=np.arange(n)/sr;return (np.sin(2*np.pi*2300*t)+.6*np.sin(2*np.pi*3710*t))*env(n,.001,.05)

def ping(f=1000,d=.05):return pluck(f,d)
def coin():
    n=int(sr*.35);t=np.arange(n)/sr;return (np.sin(2*np.pi*3100*t)+.7*np.sin(2*np.pi*4700*t))*env(n,.001,.07)
FX={'whoosh':lambda c:whoosh(c.get('d',.5)),'thud':lambda c:thud(c.get('d',.45),c.get('f',62)),'tick':lambda c:tick(),'crack':lambda c:crack(c.get('d',.9)),'rumble':lambda c:rumble(c.get('d',1.5)),'debris':lambda c:debris(c.get('d',1.2)),'roller':lambda c:roller(c.get('d',2)),'glug':lambda c:glug(c.get('d',2)),'clink':lambda c:clink(),'coin':lambda c:coin(),'ping':lambda c:ping(c.get('f',1000),c.get('d',.05)),'pluck':lambda c:pluck(c.get('f',880),c.get('d',.2))}
mu=np.zeros(N);b=60/SND.get('bpm',104);A=[110,130.81,164.81,196,220,261.63];roots=[55,55,65.41,49]
for bar in range(int(dur/(b*4))+1):
    r=roots[bar%4];bt=bar*b*4
    for i,st in enumerate([0,1.5,2,3,3.5]):
        if bt+st*b<dur-.4:add(mu,bt+st*b,bass(r if i%2==0 else r*1.5),.5)
    for i in range(8):
        tt=bt+i*b/2
        if tt>=dur-.4:break
        f=A[[0,2,4,3,1,2,5,3][i]]*2*(1.189 if r==65.41 else (.89 if r==49 else 1));add(mu,tt,pluck(f,.28),.3 if i%2==0 else .2)
    n=int(sr*b*4);t=np.arange(n)/sr;add(mu,bt,lp(sum(np.sin(2*np.pi*r*4*k*t+k) for k in[1,1.2,1.5])*np.sin(np.pi*t/(b*4))**.8,900),.05)
fxb=np.zeros(N)
for s in SH[:-1]:
    if s.get('out'):add(fxb,s['t1']-.26,whoosh(.5),.55 if s['out'].startswith('whip') else .7)
for c in SND.get('cues',[]):
    t0=when(c['at'])
    for k in range(c.get('n',1)):add(fxb,t0+k*c.get('every',0),FX[c['fx']](c)*1.0,c.get('g',.5))
ta=np.arange(N)/sr;g=np.ones(N);M=SND.get('music',{})
for a0,a1 in M.get('calm',[]):
    a0,a1=when(a0),when(a1);g*=1-.35*np.clip((ta-a0)/.3,0,1)*np.clip((a1-ta)/.3,0,1)
if 'stop' in M:
    ft=when(M['stop']);L=M.get('stop_len',1.3);g*=1-.8*np.clip((ta-ft)/.02,0,1)*np.clip((ft+L-ta)/.2,0,1)
g*=np.clip((dur-.05-ta)/.7,0,1)
e=np.clip(lp(np.abs(vo),6,1)/.05,0,1);mix=vo+mu*g*(1-.55*e)*.42+fxb*.55;mix=np.tanh(mix*1.05)*.92
sf.write(D+'/out/mix_raw.wav',mix[:int(sr*dur)],sr,subtype='PCM_16')
subprocess.check_call(['ffmpeg','-y','-loglevel','error','-i',D+'/out/mix_raw.wav','-af','loudnorm=I=-14:TP=-1.0:LRA=11','-ar','44100','-c:a','aac','-b:a','192k',D+'/out/mix.m4a']);print('mix ok')
