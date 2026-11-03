import sys,os,subprocess,multiprocessing as mp
sys.path.insert(0,os.getcwd())
from lib import *
VIGNETTE=1.;GRAIN=5;CURVE=.42;POST=None  # ролик может переопределить; в стиле «один полёт» POST задаёт свет и смаз
from shots import *
_ov={}
def overlay():
    if 'v' not in _ov:
        s,c=surf(W,H);c.set_source(rg(W/2,H*.46,max(W,H)*.28,max(W,H)*.74,[(0,(0,0,0,0)),(.6,(.03,0,.1,.12)),(1,(.03,0,.14,.62))]));c.paint()
        _ov['v']=s
        s2,c2=surf(W,H);c2.set_source(lg(c2,0,0,W,H,[(0,(1,.72,.3,.28)),(.5,(.5,.5,.5,0)),(1,(.1,.2,.9,.28))]));c2.paint();_ov['g']=s2
        x=np.arange(256)/255.;l=x+.14*np.sin(2*np.pi*x-np.pi)*-.5*-1;l=np.clip(x+(.5*(1-np.cos(np.pi*x))-x)*CURVE,0,1)
        _ov['lut']=(l*255).astype(np.uint8)
    return _ov
def caption(c,t):
    for a,b,w in CAP:
        if a<=t<b:
            k=eout((t-a)/.09);sc=1.16-.16*k
            w=w.strip(',.')
            c.save();c.translate(W/2,float(os.environ.get('CAP_Y',1560)));c.scale(sc,sc)
            text(c,w,4,7,84,'#000000',stroke='#000000',sw=20)
            text(c,w,0,0,84,'#ffffff',stroke='#141021',sw=13)
            c.restore();return
def frame(f):
    t=f/FPS;idx=[i for i,s in enumerate(SH_LIST) if s[1]<=t<s[2]];idx=idx[0] if idx else len(SH_LIST)-1
    name,a,b,fn,wh=SH_LIST[idx]
    s,c=surf(W,H);c.set_source_rgba(0,0,0,1);c.paint();u=(t-a)/(b-a)
    ts=int(t*15)/15 ; ub=(ts-a)/(b-a)   # characters & set animation stepped on 2s
    c.save();fn(c,max(0,u),max(0,ts-a),int(t*10)%3);c.restore()
    if name=='kick' and False:pass
    o=overlay()
    c.set_operator(cairo.OPERATOR_SOFT_LIGHT);c.set_source_surface(o['g'],0,0);c.paint();c.set_operator(cairo.OPERATOR_OVER)
    c.set_source_surface(o['v'],0,0);c.paint_with_alpha(VIGNETTE)
    s.flush();arr=np.ndarray((H,W,4),np.uint8,s.get_data()).copy()
    arr[...,:3]=o['lut'][arr[...,:3]]
    if POST:arr[...,:3]=POST(arr[...,:3],t)
    # whip blur at cut in: first 4 frames of whip shots
    if wh and t-a<4/FPS:
        amt=int(150*(1-(t-a)*FPS/4));acc=np.zeros((H,W,3),np.float32)
        for k in range(-3,4):acc+=np.roll(arr[...,:3],k*amt//3,axis=1)
        arr[...,:3]=(acc/7).astype(np.uint8)
    if name=='burst' and t-a<.1:arr[...,:3]=np.clip(arr[...,:3].astype(np.int16)+int(200*(1-(t-a)/.1)),0,255).astype(np.uint8)
    # captions on top
    s2=cairo.ImageSurface.create_for_data(arr,cairo.FORMAT_ARGB32,W,H);c2=cairo.Context(s2);caption(c2,t);s2.flush()
    # subtle grain
    if GRAIN:
        rng=np.random.default_rng(f);g=rng.integers(-GRAIN,GRAIN+1,(H//2,W//2),dtype=np.int16).repeat(2,0).repeat(2,1)
        a3=arr[...,:3].astype(np.int16)+g[...,None];arr[...,:3]=a3.clip(0,255).astype(np.uint8)
    return arr
def rscene(i):
    name,a,b,fn,wh=SH_LIST[i]
    f0,f1=int(round(a*FPS)),int(round(b*FPS));fn2=f'scenes/{i:02d}.mp4';tmp=f'scenes/.t{i:02d}.mp4'
    p=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','bgra','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',str(FPS),tmp],stdin=subprocess.PIPE)
    for f in range(f0,f1):p.stdin.write(frame(f).tobytes())
    p.stdin.close();p.wait()
    if p.returncode==0:os.replace(tmp,fn2)
    return i
if __name__=='__main__':
    os.makedirs('scenes',exist_ok=True)
    if sys.argv[1]=='p':
        from PIL import Image
        ts=[float(x) for x in sys.argv[2].split(',')];ims=[]
        for t in ts:
            a=frame(int(t*FPS));ims.append(Image.fromarray(a[...,[2,1,0]]))
        n=len(ims);cols=int(sys.argv[3]) if len(sys.argv)>3 else n;tw=int(1600/cols);th=int(tw*16/9);rows=(n+cols-1)//cols
        sh=Image.new('RGB',(tw*cols,th*rows))
        for i,im in enumerate(ims):sh.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
        sh.save(sys.argv[4] if len(sys.argv)>4 else 'prev.png')
    elif sys.argv[1]=='s':
        for i in sys.argv[2].split(','):print(rscene(int(i)))
    else:
        with mp.Pool(2) as P:
            for i in P.imap_unordered(rscene,range(len(SH_LIST))):print('done',i,flush=True)
