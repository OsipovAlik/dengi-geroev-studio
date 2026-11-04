from flow import *
import json
T=json.load(open('timing.json'))
e=T[-1]['end']+.8
THUMB=dict(body='#e86aa5',rim='#fff0c8')
TOAD=dict(body='#5a9a3a',rim='#ffe6b4')
VIGNETTE=.16;GRAIN=0;CURVE=.16
KEYS=[(0,300,-50,1800,-.03),(2.8,50,-80,2200,.01),(3.4,350,-60,2100,0),(5.0,900,100,2000,0),(6.7,1500,250,2200,0),(7.3,1500,260,2300,0),
(8.8,1500,330,3000,0),(9.85,1500,350,3280,0),(9.9,3900,-20,1700,0),(10.2,3900,60,2000,0),(12.9,3900,60,2000,0),(13.2,3900,-40,2150,0),
(16.5,3900,-40,2150,0),(16.9,3900,100,2200,0),(20.0,4100,100,2200,0),(20.05,7500,100,2300,0),(23.1,7500,100,2300,0),(23.5,8250,100,2100,0),
(26.8,8250,100,2100,0),(27.2,9100,0,2300,0),(31.8,9100,0,2300,0),(32.6,7900,-20,2050,0),(37.2,7650,-20,2050,0),(40,7650,-40,2050,0),(e+.2,7650,-40,2050,0)]
camat=path(KEYS)
def K(t0,t1,t):return min(1,max(0,(t-t0)/(t1-t0)))
c_=[None]
def char4(c,cam,x,y,d,s=1,extra=None,**k):
    k.setdefault('shadow',False)
    def f():
        ell(c,x,y,118*s,24*s,(0,0,0,.28));char(c,x,y,s,**k)
        if extra:
            c.save();c.translate(x,y);c.scale(s,s);extra();c.restore()
    on(c,cam,d,f)
def flower():
    c=c_[0]
    for i in range(6):
        a=i/6*6.2832;circ(c,40*math.cos(a),-565+40*math.sin(a),26,'#ffd1e6',INK,4)
    circ(c,0,-565,22,'#ffd23f',INK,4)
def toadx():
    c=c_[0]
    for dx in(-52,52):circ(c,dx,-570,32,'#7ab852',INK,6);circ(c,dx+6,-570,12,INK)
    for dx,dy in((-60,-200),(30,-260),(55,-170),(-20,-130)):circ(c,dx,dy,12,'#3f7a2a')
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.12,abs(math.cos(rot))),1)
    circ(c,0,0,r,rg(-r*.3,-r*.3,r*.1,r*1.1,[(0,'#fff0a0'),(1,'#d79a1f')]),INK,max(3,r*.07));circ(c,0,0,r*.7,None,'#a8730f',max(2,r*.05));c.restore()
def meadow(c,cam):
    sky(c,'#5cb7ec','#a9def5','#fff1cf',cam)
    floor(c,cam,-3000,11500,520,cam.z+60,6200,cols=('#5db13f','#68bd45','#54a838'),n=24,seams=False,line='#2f6d2a')
def tree(c,cam,x,d,h=900):
    def f():
        rect(c,x-70,520-h,140,h,'#7b4a26',INK,6)
        for ox,oy,r in((0,-h-40,260),(-200,-h+80,200),(200,-h+60,210)):circ(c,x+ox,520+oy,r,rg(x+ox-60,520+oy-80,30,r*1.1,[(0,'#69c04a'),(1,'#2f7d3a')]),INK,6)
    on(c,cam,d,f)
def flowers(c,cam,x0,x1,d):
    def f():
        r=random.Random(5)
        for i in range(26):
            x=r.uniform(x0,x1);y=520-r.uniform(0,40);h=r.uniform(60,160);col=r.choice(['#ff6f91','#ffd23f','#ffffff','#b48cff'])
            c.set_source_rgba(*rgb('#2f7d3a'));c.set_line_width(8);c.move_to(x,y);c.line_to(x,y-h);c.stroke();circ(c,x,y-h,24,col,INK,4)
    on(c,cam,d,f)
def tulip(c,cam,t):
    def f():
        x=1500
        ell(c,x,500,300,60,(0,0,0,.2))
        c.set_source_rgba(*rgb('#2f7d3a'));c.set_line_width(26);c.move_to(x,520);c.line_to(x,150);c.stroke()
        poly(c,[(x-300,-80),(x-80,-180),(x,-40),(x+80,-180),(x+300,-80),(x+240,260),(x,360),(x-240,260)],'#e0426a',INK,9)
        c.save();c.translate(x,150);c.scale(190,150);c.arc(0,0,1,0,6.2832);c.restore();c.set_source(rg(x,150,10,200,[(0,'#05030a'),(1,'#2a1a3a')])) if False else None
        ell(c,x,130,190,150,'#120818');c.save();c.translate(x,130);c.scale(190,150);c.arc(0,0,1,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.stroke()
        glow(c,x,130,260,(1,.8,.5),.35+.15*math.sin(t*4))
    on(c,cam,3400,f)
def s_z1(c,cam,t,ts):
    meadow(c,cam);tree(c,cam,-900,4300);tree(c,cam,2600,4600,780);flowers(c,cam,-1500,3000,3600);tulip(c,cam,ts)
    def shell():
        ell(c,-160,505,170,44,(0,0,0,.2))
        c.save();c.translate(-160,500);c.new_path();c.arc(0,0,150,0,3.1416);c.close_path()
        c.set_source(lg(c,-150,0,150,120,[(0,'#c8925a'),(1,'#8a5a2e')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.stroke();c.restore()
    on(c,cam,3010,shell)
    char4(c,cam,-160,470,3000,.85,extra=lambda:(c_.__setitem__(0,c),flower()),boil=int(ts*15)%3,mouth='o',eyes='normal',sweat=1,look=(1,0),hl=(-110,-200),hr=(110,-200),**THUMB)
    tx=1000-560*eout(K(2.6,4.0,t)) if t>2.6 else 1000
    char4(c,cam,tx,520,2990,1.2,extra=lambda:(c_.__setitem__(0,c),toadx()),boil=int(ts*15)%3,mouth='open',brow=1,look=(-1,0),hl=(-150,-230),hr=(150-80*K(3,4,t),-230),**TOAD)
    if 2.9<t<6.7:
        k=max(.02,eout(K(3.0,3.3,t)))
        def tag():
            c.save();c.translate(560,-140);c.scale(k,k);rect(c,-170,-60,340,120,'#f1dfae',INK,8);text(c,'ЖЕНИХ!',0,24,76,'#7a2317');c.restore()
        on(c,cam,2980,tag)
def cards(c,cam,t,ts):
    for i,x in enumerate((3500,3900,4300)):
        k=eout(K(10.3+i*.8,10.6+i*.8,t))
        if k<=0:continue
        def card(x=x,i=i,k=k):
            c.save();c.translate(x,150);c.scale(k,k)
            rect(c,-150,-140,300,280,'#fffdf4',INK,8);rect(c,-150,-140,300,64,'#d8342b',INK,8);text(c,'МЕСЯЦ %d'%(i+1),0,-90,40,'#ffffff');text(c,'60',0,70,130,'#2d2350');c.restore()
        on(c,cam,3000,card)
def s_z2(c,cam,t,ts):
    meadow(c,cam);tree(c,cam,2900,4400,800);tree(c,cam,5300,4500,860);flowers(c,cam,2800,5400,3600)
    char4(c,cam,3150,520,3000,.85,extra=lambda:(c_.__setitem__(0,c),flower()),boil=int(ts*15)%3,mouth='flat',look=(1,0),hl=(-110,-200),hr=(120,-230),**THUMB)
    if t<16.78:
        cards(c,cam,t,ts)
        if t>=13.12:
            k=eout(K(13.12,13.4,t))
            def sg():
                c.save();c.translate(3900,-190);c.scale(.5+.5*k,.5+.5*k);rect(c,-290,-100,580,200,'#2d2350',INK,10);text(c,'60 × 3 = 180',0,40,100,'#ffd23f',stroke=INK,sw=10);c.restore()
            on(c,cam,2900,sg)
    else:
        text_k=eout(K(16.78,17.1,t))
        def head():
            c.save();c.translate(3900,-190);c.scale(.5+.5*text_k,.5+.5*text_k);rect(c,-290,-100,580,200,'#2d2350',INK,10);text(c,'15 × 12',0,40,110,'#ffd23f',stroke=INK,sw=10);c.restore()
        on(c,cam,2900,head)
        n=int(max(0,(t-17.0)/.26))
        def grid():
            for i in range(12):
                x=3560+(i%4)*170;y=-10+(i//4)*170
                rect(c,x-70,y-70,140,140,'#fffdf4',INK,6)
                if i<min(n,12):coin(c,x,y,46,0);text(c,'15',x,y+14,40,'#7a4f08')
        on(c,cam,3000,grid)
        def jar():
            x=4800;poly(c,[(x-90,60),(x+90,60),(x+110,150),(x+110,500),(x-110,500),(x-110,150)],'#bfe6f0aa',INK,7)
            hh=min(n,12)/12*380
            if hh>0:rect(c,x-104,500-hh,208,hh,'#f4c84a')
            text(c,'ЗАПАС',x,330,50,'#3a2312')
        on(c,cam,3000,jar)
def swallow(c,x,y,t):
    c.save();c.translate(x,y);fl=math.sin(t*12)*.5
    poly(c,[(-150,0),(-260,-30),(-230,30)],'#1e2f66',INK,6)
    ell(c,0,0,160,62,'#2a3f7a');c.save();c.scale(160,62);c.arc(0,0,1,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.stroke()
    ell(c,20,22,120,30,'#f4ecd8');circ(c,150,-18,42,'#2a3f7a',INK,6);circ(c,162,-26,7,INK);poly(c,[(188,-14),(240,-4),(190,6)],'#ffb02e',INK,5)
    poly(c,[(-30,-30),(-130,-140-fl*140),(40,-60)],'#1e2f66',INK,6);poly(c,[(0,-20),(-90,-210-fl*160),(70,-50)],'#2a3f7a',INK,6)
    c.restore()
def s_z3(c,cam,t,ts):
    meadow(c,cam);tree(c,cam,6600,4600,850);tree(c,cam,9700,4500,780);flowers(c,cam,7000,9800,3600)
    if t<32.2:
        # wallet and jar (rule 1)
        def wj():
            rect(c,7330,330,200,150,'#8a5a2e',INK,7);text(c,'НА ДЕНЬ',7430,420,36,'#ffe6b4')
            x=7700;poly(c,[(x-80,240),(x+80,240),(x+100,300),(x+100,480),(x-100,480),(x-100,300)],'#bfe6f0aa',INK,7);rect(c,x-104,360,208,120,'#f4c84a')
            rect(c,x-30,300,60,56,'#7a7f8c',INK,5);text(c,'ЗАПАС',x,420,40,'#3a2312');text(c,'🔒' if False else '',x,300,10)
            text(c,'ОТДЕЛЬНО',7580,170,64,'#ffd23f',stroke=INK,sw=11)
        on(c,cam,3000,wj)
        # rule 2: discount (crossed) and exit (check)
        k=K(24.6,25.1,t)
        def r2():
            rect(c,8000,280,200,200,'#d8342b',INK,7);text(c,'-70%',8100,410,70,'#ffffff')
            rect(c,8330,250,240,250,'#2f9a5b',INK,7);rect(c,8390,310,120,190,'#173d28',INK,5);text(c,'ВЫХОД',8450,285,44,'#ffffff')
            if k>0:
                c.set_source_rgba(.95,.1,.15,1);c.set_line_width(18);c.set_line_cap(cairo.LINE_CAP_ROUND)
                c.move_to(7970,250);c.line_to(7970+260*k,250+260*k);c.stroke();c.move_to(8230,250);c.line_to(8230-260*k,250+260*k);c.stroke()
        on(c,cam,3000,r2)
        # rule 3: swallow carries Thumbelina away
        if t>=27.0:
            u=ease(K(28.6,31.8,t));x=9000+800*u;y=300-260*u+math.sin(ts*8)*10
            on(c,cam,2950,lambda:swallow(c,x,y,ts))
            char4(c,cam,x-20,y-52,2940,.55,extra=lambda:(c_.__setitem__(0,c),flower()),boil=int(ts*15)%3,mouth='grin',look=(1,0),hl=(-110,-200),hr=(110,-220),**THUMB)
    else:
        def sign():
            rect(c,7475,30,50,490,'#6e4420',INK,6);rect(c,7210,-190,580,250,'#f1dfae',INK,8)
            text(c,'ЗАВТРА:',7500,-90,78,'#3a2312');text(c,'ШЕЙЛОК',7500,10,100,'#7a2317')
        on(c,cam,3000,sign)
        char4(c,cam,7900,520,2900,.85,extra=lambda:(c_.__setitem__(0,c),flower()),boil=int(ts*15)%3,mouth='grin',look=(-1,0),hl=(-110,-210),hr=(110,-230),**THUMB)
def world(c,t,ts):
    cam=camat(t)
    c.save();apply_roll(c,cam)
    if t<9.9:s_z1(c,cam,t,ts)
    elif t<20.05:s_z2(c,cam,t,ts)
    else:s_z3(c,cam,t,ts)
    c.restore()
    if 9.2<t<9.9:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,K(9.2,9.85,t)))
    if 9.9<=t<10.4:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,1-K(9.9,10.4,t)))
    if 19.75<t<20.45:smoke_wipe(c,(t-19.75)/.7)
    if t<2.9:
        al=1 if t<2.3 else 1-(t-2.3)/.6
        text(c,'УЙТИ НЕ НА ЧТО?',W/2,330,100,(1,1,1,al),stroke=INK,sw=16);text(c,'ТЕРПИТЕ ПЛОХУЮ РАБОТУ?',W/2,445,66,(1,.85,.2,al),stroke=INK,sw=14)
CUTS=[0,2.94,6.68,9.9,13.12,16.78,20.05,23.32,26.99,32.18,37.11,e]
NAMES=['hook','toad','fly','months','sum','jar','rule1','rule2','rule3','ask','teaser']
def _mk(a,b):
    def fn(c,u,t,bo):world(c,a+u*(b-a),a+t)
    return fn
SH_LIST=[(NAMES[i],CUTS[i],CUTS[i+1],_mk(CUTS[i],CUTS[i+1]),0) for i in range(len(NAMES))]
GR=[(0,1,1,1,1),(9.0,1,1,1,1),(9.9,1.04,1,.94,1),(19.5,1.04,1,.94,1),(20.2,1,1,1,1),(32,1,1,1,1),(33.5,1.1,.98,.84,1.08),(e+1,1.1,.98,.84,1.08)]
_gf=PchipInterpolator([g[0] for g in GR],np.array([g[1:] for g in GR]))
def POST(a,t):
    g=_gf(t)
    if abs(g-1).sum()>.01:a=grade(a,g[:3],g[3])
    if not(9.2<t<10.4 or 19.7<t<20.5):
        c0,c1=camat(t),camat(t+1/30)
        dx=c1.x-c0.x;dy=c1.y-c0.y
        if abs(dx)+abs(dy)>32:a=speed_blur(a,max(-180,min(180,dx*.55)),max(-180,min(180,dy*.55)))
    return a
CAP=make_caps(T,json.load(open('script.json'))['captions'])
MUSIC_STOP=('hook','toad')
def CUES(f,d):
    for t,g in((0.2,.4),(3.0,.5),(4.9,.5),(7.6,.6),(9.0,.6),(13.1,.4),(16.8,.4),(19.8,.8),(23.4,.5),(27.1,.5),(28.6,.6),(32.2,.5),(37.2,.5)):f['whoosh'](t,g)
    for i in range(3):f['thud'](10.4+i*.8,.4);f['ding'](10.45+i*.8,1318,.25)
    f['thud'](13.2,.6);f['ding'](13.25,1568,.3)
    for i in range(12):f['tick'](17.0+i*.26,.28,2400)
    f['ding'](20.5,1046,.25);f['crack'](24.65,.5);f['ding'](25.3,1760,.25);f['ding'](28.7,1318,.3);f['ding'](33.0,1568,.3)
