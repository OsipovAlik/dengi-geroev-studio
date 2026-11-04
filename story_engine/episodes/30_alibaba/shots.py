from flow import *
import json
T=json.load(open('timing.json'))
e=T[-1]['end']+.8
ALI=dict(body='#e0902a',rim='#ffe6b4')
KAS=dict(body='#2f9a5b',rim='#ffe6b4')
VIGNETTE=.16;GRAIN=0;CURVE=.16
CROWD=['#7a3fb0','#2f6d9c','#d8342b','#3b4470','#c4458c']
KEYS=[(0,300,-50,1800,-.03),(3.0,100,-80,2200,.01),(3.3,300,-60,2000,0),(4.6,1100,140,2000,0),(5.9,1500,250,2200,0),(6.6,1500,260,2300,0),
(8.0,1500,330,2900,0),(8.9,1500,350,3250,0),(9.0,4000,-30,1600,0),(9.9,4000,-30,1600,0),(10.8,3700,160,2300,0),(12.0,3900,80,2200,0),
(12.3,4300,60,2000,0),(13.8,4300,60,2050,0),(14.5,4300,60,2100,0),(14.55,7500,160,2400,0),(18.6,7500,160,2400,0),(19.4,8000,100,2100,0),
(23.0,8000,100,2100,0),(23.7,8800,200,2450,0),(27.2,8800,200,2450,0),(27.9,9400,120,2200,0),(31,9400,120,2200,0),(31.8,8800,0,2200,0),
(32.8,7900,-20,2050,0),(37.4,7650,-20,2050,0),(38.0,7650,-40,2050,0),(40.5,7650,-40,2050,0),(e+.2,7650,-40,2050,0)]
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
def turban():
    c=c_[0];ell(c,0,-548,98,52,'#f4ecd8');c.save();c.translate(0,-548);c.scale(98,52);c.arc(0,0,1,0,6.2832);c.restore()
    c.set_source_rgba(*rgb(INK));c.set_line_width(5);c.stroke();circ(c,0,-560,16,'#d8342b',INK,4)
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.12,abs(math.cos(rot))),1)
    circ(c,0,0,r,rg(-r*.3,-r*.3,r*.1,r*1.1,[(0,'#fff0a0'),(1,'#d79a1f')]),INK,max(3,r*.07));circ(c,0,0,r*.7,None,'#a8730f',max(2,r*.05));c.restore()
def desert(c,cam):
    sky(c,'#5b52b0','#e98f62','#ffd9a0',cam)
    floor(c,cam,-3000,11500,520,cam.z+60,6200,cols=('#dcb46c','#e5be76','#d3a85f'),n=24,seams=False,line='#a07a3a')
def dunes(c,cam):
    def f():
        for x,w,h in((-1200,900,260),(300,1100,330),(2200,1000,280),(4200,1000,300)):
            c.move_to(x-w,520);c.curve_to(x-w*.4,520-h,x+w*.4,520-h,x+w,520);c.close_path();c.set_source_rgba(*rgb('#c9985a'));c.fill()
    on(c,cam,5600,f)
def rock(c,cam,t):
    def f():
        poly(c,[(500,520),(700,120),(1050,-120),(1500,-180),(1950,-100),(2300,150),(2500,520)],lg(c,0,-180,0,520,[(0,'#9a8aa8'),(1,'#6a5a78')]),INK,8)
        ell(c,1500,360,260,190,'#07030c');c.save();c.translate(1500,360);c.scale(260,190);c.arc(0,0,1,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.stroke()
        glow(c,1500,400,300,(1,.8,.3),.5+.2*math.sin(t*5))
        r=random.Random(3)
        for i in range(8):
            x=1500+r.uniform(-200,200);y=300+r.uniform(-100,150);k=.5+.5*math.sin(t*6+i)
            circ(c,x,y,6+8*k,(1,.95,.6,.9))
    on(c,cam,3400,f)
def crowd(c,cam,x0,ts,n,d=3000,sc=.8,asking=True,t=0,fade=1.):
    for i in range(n):
        s=sc*(1-.05*(i%2));x=x0+i*230
        hr=(150,-270-30*math.sin(ts*5+i)) if asking else (120,-210)
        char4(c,cam,x,520,d+(i%2)*40,s,boil=int(ts*15+i)%3,mouth='open' if asking else 'flat',eyes='normal',brow=1,look=(-1,0),hl=(-120,-210),hr=hr,body=CROWD[i%5],rim='#ffe6b4')
def s_z1(c,cam,t,ts):
    desert(c,cam);dunes(c,cam);rock(c,cam,ts)
    on(c,cam,2995,lambda:bag(c,-20,520,1.1,'#c9a163'))
    char4(c,cam,-160,520,3000,1.0,extra=lambda:(c_.__setitem__(0,c),turban()),boil=int(ts*15)%3,mouth='o' if t<3 else 'grin',eyes='normal',look=(1,0),sweat=1 if t<3 else 0,hl=(-130,-230),hr=(120,-210),**ALI)
    if t<5.9:
        for i in range(4):
            x=420+i*230;k=K(.3+i*.25,.8+i*.25,t)
            if k>0:char4(c,cam,x,520,3000+(i%2)*40,.8,boil=int(ts*15+i)%3,mouth='open',brow=1,look=(-1,0),hl=(-120,-210),hr=(150,-270-30*math.sin(ts*5+i)),body=CROWD[i%5],rim='#ffe6b4')
            if k>0 and t<3.2:on(c,cam,2990,lambda x=x,i=i:text(c,'ДАЙ!',x-30,70-i*10,52,'#ffd23f',stroke=INK,sw=9))
def s_z2(c,cam,t,ts):
    X0,X1=2700,5300
    qd(c,cam,[(X0,-800,3000),(X1,-800,3000),(X1,-800,3700),(X0,-800,3700)],'#2a1d33',INK,3)
    qd(c,cam,[(X0,-800,3000),(X0,-800,3700),(X0,520,3700),(X0,520,3000)],'#4a3555',INK,3)
    qd(c,cam,[(X1,-800,3000),(X1,-800,3700),(X1,520,3700),(X1,520,3000)],'#4a3555',INK,3)
    floor(c,cam,X0,X1,520,2900,3700,cols=('#6b5a78','#76658a','#5f4f6c'),n=10,line='#2a1d33')
    on(c,cam,3700,lambda:(wall(c,X0,X1,-800,520,lg(c,0,-800,0,520,[(0,'#3a2a46'),(1,'#5b4670')]),lw=3),glow(c,4000,150,900,(1,.78,.3),.55)))
    def gold():
        r=random.Random(11)
        for x,w,h in((3150,380,230),(3800,430,300),(4600,400,250)):
            c.move_to(x-w,520);c.curve_to(x-w*.4,520-h*1.3,x+w*.4,520-h*1.3,x+w,520);c.close_path();c.set_source(lg(c,0,520-h,0,520,[(0,'#ffe27a'),(1,'#c98a1a')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.stroke()
            for i in range(10):
                coin(c,x+r.uniform(-w*.6,w*.6),520-r.uniform(20,h),26,r.uniform(0,3)+ts*(.5 if i%3==0 else 0))
        rect(c,4130,330,220,190,'#8a4b24',INK,7);rect(c,4120,300,240,60,'#a8622f',INK,7);rect(c,4220,330,40,40,'#ffd23f',INK,4)
    on(c,cam,3050,gold)
    glow(c,4000,300,500,(1,.8,.3),.25)
    # Ali Baba takes a small bag
    char4(c,cam,3450,520,2950,.95,extra=lambda:(c_.__setitem__(0,c),turban()),boil=int(ts*15)%3,mouth='flat',look=(1,0),hl=(-120,-210),hr=(150,-250),**ALI)
    on(c,cam,2940,lambda:bag(c,3560,520,.7,'#c9a163'))
    # Qasim
    if 11.6<t<13.55:
        kx=4900-400*eout(K(11.6,12.6,t));greedy=K(12.6,13.4,t)
        char4(c,cam,kx,520,2950,1.05,boil=int(ts*15)%3,mouth='open',brow=1,look=(-1,0),hl=(-150,-260),hr=(150,-260),**KAS)
        on(c,cam,2940,lambda:bag(c,kx+120,520,.8+1.4*greedy,'#7a5a2a'))
    if 13.5<=t<14.6:
        k=K(13.5,13.78,t);yb=-700+1190*eout(k)
        if t<13.8:on(c,cam,2900,lambda:sphere(c,4520,yb,300))
        else:
            on(c,cam,2900,lambda:sphere(c,4520,400+0*(t-13.8),300))
            on(c,cam,2890,lambda:blast(c,4520,380,240,t-13.8))
def s_z3(c,cam,t,ts):
    desert(c,cam);dunes(c,cam)
    # shield with "2"
    def sh():
        x=7500;poly(c,[(x-170,20),(x+170,20),(x+170,170),(x,350),(x-170,170)],'#3567a3',INK,9);text(c,'2',x,200,260,'#ffd23f',stroke=INK,sw=14)
        text(c,'ВЫ + ТОТ, КОМУ ВЕРИТЕ',x,-30,36,'#ffffff',stroke=INK,sw=7)
        for dx in(-70,70):circ(c,x+dx,420,0,None)
    if t<32.8:on(c,cam,3000,sh)
    if t<32.8:on(c,cam,3000,lambda:(circ(c,7420,470,36,'#fbf3df',INK,6),circ(c,7580,470,36,'#fbf3df',INK,6)))
    # Ali Baba + bubble
    char4(c,cam,7900,520,2900,1.0,extra=lambda:(c_.__setitem__(0,c),turban()),boil=int(ts*15)%3,mouth='grin' if t>32.8 else 'flat',look=(-1,0),hl=(-130,-210),hr=(130,-230),**ALI)
    if 19.6<t<23.3:
        k=eout(K(19.6,19.9,t))
        def bub():
            c.save();c.translate(8030,-420);c.scale(k,k);ell(c,0,0,230,100,'#ffffff');c.save();c.scale(230,100);c.arc(0,0,1,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.stroke()
            poly(c,[(-60,80),(-120,190),(10,95)],'#ffffff',INK,6);text(c,'«хватает»',0,26,70,'#3a2312');c.restore()
        on(c,cam,2880,bub)
    # bank (rule 3)
    def bank():
        x=8800
        rect(c,x-300,60,600,460,'#d9c9a3',INK,8);poly(c,[(x-340,60),(x+340,60),(x,-120)],'#9a7a52',INK,8)
        for i in range(4):rect(c,x-250+i*140,100,60,380,'#efe3c2',INK,5)
        rect(c,x-80,300,160,220,'#3a2a46',INK,6);text(c,'БАНК',x,10,56,'#3a2312',stroke=None)
        poly(c,[(x+160,-40),(x+330,-40),(x+330,90),(x+245,150),(x+160,90)],'#2f9a5b',INK,6);text(c,'✓',x+245,60,90,'#ffffff')
        text(c,'ВКЛАДЫ ЗАСТРАХОВАНЫ',x,-160,40,'#ffffff',stroke=INK,sw=8)
    on(c,cam,3050,bank)
    # crowd of five
    if 27.4<t<32.7:
        pop=K(31.2,31.6,t)
        if t<31.4:
            crowd(c,cam,9250,ts,5,asking=True)
            def num():text(c,'5',9400,-230,200,'#ffd23f',stroke=INK,sw=16)
            on(c,cam,2900,num)
        else:
            for i in range(5):on(c,cam,2900,lambda i=i:blast(c,9250+i*230,300,90,t-31.4,seed=i)) if t<32.2 else None
            on(c,cam,2900,lambda:text(c,'0',8950,-200,240,'#7fe3a0',stroke=INK,sw=16))
    if t>=32.8:
        def sign():
            rect(c,7475,30,50,490,'#6e4420',INK,6);rect(c,7210,-190,580,250,'#f1dfae',INK,8)
            text(c,'ЗАВТРА:',7500,-90,78,'#3a2312');text(c,'ДЮЙМОВОЧКА',7500,10,70,'#7a2317')
        on(c,cam,3000,sign)
def world(c,t,ts):
    cam=camat(t)
    if 13.78<t<14.2:
        k=(1-(t-13.78)/.42)*30;cam.x+=k*math.sin(t*71);cam.y+=k*math.cos(t*59)
    c.save();apply_roll(c,cam)
    if t<9.0:s_z1(c,cam,t,ts)
    elif t<14.55:desert(c,cam);s_z2(c,cam,t,ts)
    else:s_z3(c,cam,t,ts)
    c.restore()
    if 8.3<t<9.0:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,K(8.3,8.95,t)))
    if 9.0<=t<9.5:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,1-K(9.0,9.5,t)))
    if 13.78<t<13.9:rect(c,-300,-300,W+600,H+600,(1,.95,.8,.7*(1-(t-13.78)/.12)))
    if 14.2<t<14.9:smoke_wipe(c,(t-14.2)/.7)
    if t<3.0:
        al=1 if t<2.4 else 1-(t-2.4)/.6
        text(c,'ПОХВАСТАЛИСЬ —',W/2,330,100,(1,1,1,al),stroke=INK,sw=16);text(c,'ВСЕ ПРОСЯТ В ДОЛГ?',W/2,445,78,(1,.85,.2,al),stroke=INK,sw=18)
CUTS=[0,3.1,6.1,9.0,12.25,14.55,19.0,23.3,27.6,32.8,37.5,e]
NAMES=['hook','cave','fly','treasure','kasym','rule1','rule2','rule3','crowd','ask','teaser']
def _mk(a,b):
    def fn(c,u,t,bo):world(c,a+u*(b-a),a+t)
    return fn
SH_LIST=[(NAMES[i],CUTS[i],CUTS[i+1],_mk(CUTS[i],CUTS[i+1]),0) for i in range(len(NAMES))]
GR=[(0,1,.95,.9,1),(8.5,1,.95,.9,1),(9.2,1.1,.95,.82,1.05),(13.0,1.08,.92,.85,1),(14.6,1,1,1,1),(31,1,1,1,1),(33,1.1,.98,.84,1.08),(e+1,1.1,.98,.84,1.08)]
_gf=PchipInterpolator([g[0] for g in GR],np.array([g[1:] for g in GR]))
def POST(a,t):
    g=_gf(t)
    if abs(g-1).sum()>.01:a=grade(a,g[:3],g[3])
    if not(8.3<t<9.5 or 14.1<t<15):
        c0,c1=camat(t),camat(t+1/30)
        dx=c1.x-c0.x;dy=c1.y-c0.y
        if abs(dx)+abs(dy)>32:a=speed_blur(a,max(-180,min(180,dx*.55)),max(-180,min(180,dy*.55)))
    return a
CAP=make_caps(T,json.load(open('script.json'))['captions'])
MUSIC_STOP=('hook','cave')
def CUES(f,d):
    for t,g in((0.2,.4),(3.2,.5),(4.4,.5),(7.8,.6),(9.0,.6),(10.6,.4),(14.3,.8),(19.3,.5),(23.4,.5),(27.7,.5),(31.9,.4),(37.6,.5)):f['whoosh'](t,g)
    for t in (9.9,10.4,10.9):f['ding'](t,1760,.2)
    for i in range(8):f['tick'](10.2+i*.15,.25,2600)
    f['thud'](13.8,.7);f['crack'](13.82,.6);f['noise'](13.85,15,70,500,.25)
    f['thud'](14.7,.3);f['ding'](15.2,1240,.3);f['ding'](19.8,1046,.25);f['ding'](24.0,1568,.3)
    for i in range(5):f['tick'](28+i*.4,.25,1800)
    f['thud'](31.4,.5);f['ding'](31.8,880,.3);f['ding'](33.0,1318,.3)
