from flow import *
import json
T=json.load(open('timing.json'))
e=T[-1]['end']+.8
ALICE=dict(body='#3f9be0',bow='#ffd23f',rim='#ffe6b4')
QUEEN=dict(body='#d8342b',rim='#ffe6b4',mst=False)
VIGNETTE=.16;GRAIN=0;CURVE=.16
HX=1500   # rabbit hole (zone 1)
KEYS=[(0,100,-60,1800,-.03),(2.6,100,-70,1950,0),(5.3,-150,-110,2300,.02),(5.6,-120,-110,2300,0),
(8.9,420,-130,2350,0),(9.5,300,-60,1750,0),(10.6,900,60,1700,.02),(11.6,1500,300,2300,0),(12.4,1500,330,3200,0),
(12.45,4000,-30,1500,0),(13.0,3800,120,2350,0),(14.1,3800,220,2650,0),(14.4,4000,220,2650,0),(15.3,4000,220,2650,0),(15.6,4200,220,2650,0),(16.4,4200,220,2650,0),
(16.8,4000,-120,1900,0),(20.0,4000,-100,2100,.01),(20.3,4000,-100,2250,0),(22.4,4000,-60,2000,0),(23.8,4000,120,2300,0),(24.0,4700,150,2000,0),(25.4,7500,160,2000,0),(25.9,7560,190,2400,0),(27.7,7560,190,2400,0),(28.3,7650,160,2000,0),(28.7,8000,160,2000,0),(29.2,8000,230,2450,0),(31.6,8030,230,2450,0),(32.3,8000,160,2000,0),(32.7,8500,200,2450,0),(35.4,8500,200,2450,0),(35.9,8500,100,2050,0),(36.6,7800,-20,2000,0),(40.2,7800,-20,2050,0),(40.8,7800,-40,2100,0),(43.0,7800,-40,2150,0),(e+.2,7800,-40,2200,0)]
camat=path(KEYS)
def K(t0,t1,t):return min(1,max(0,(t-t0)/(t1-t0)))
# ---------- props
def char4(c,cam,x,y,d,s=1,extra=None,**k):
    k.setdefault('shadow',False)
    def f():
        ell(c,x,y,118*s,24*s,(0,0,0,.28));char(c,x,y,s,**k)
        if extra:
            c.save();c.translate(x,y);c.scale(s,s);extra();c.restore()
    on(c,cam,d,f)
def crown():
    poly(c_[0],[(-60,-545),(60,-545),(75,-640),(35,-590),(0,-650),(-35,-590),(-75,-640)],'#ffd23f',INK,6)
c_=[None]
def coin(c,x,y,r,rot=0,lab='5'):
    c.save();c.translate(x,y);c.scale(max(.12,abs(math.cos(rot))),1)
    circ(c,0,0,r,rg(-r*.3,-r*.3,r*.1,r*1.1,[(0,'#fff0a0'),(1,'#d79a1f')]),INK,max(3,r*.07));circ(c,0,0,r*.72,None,'#a8730f',max(2,r*.05))
    text(c,lab,0,r*.3,r*.9,'#7a4f08');c.restore()
def grass(c,cam):
    sky(c,'#5cb7ec','#a9def5','#fff1cf',cam)
    floor(c,cam,-3000,11500,520,cam.z+60,6200,cols=('#5db13f','#68bd45','#54a838'),n=24,seams=False,line='#2f6d2a')
def tree(c,cam,x,d,h=900):
    def f():
        rect(c,x-70,520-h,140,h,'#7b4a26',INK,6)
        for ox,oy,r in((0,-h-40,260),(-200,-h+80,200),(200,-h+60,210)):circ(c,x+ox,520+oy,r,rg(x+ox-60,520+oy-80,30,r*1.1,[(0,'#69c04a'),(1,'#2f7d3a')]),INK,6)
    on(c,cam,d,f)
def hole(c,cam):
    def f():
        ell(c,HX,520,640,150,'#4e8a35');circ_hole=rg(HX,470,10,260,[(0,'#05030a'),(.8,'#100a1a'),(1,'#2a1a3a')])
        c.save();c.translate(HX,470);c.scale(1,.62);c.arc(0,0,260,0,6.2832);c.restore();c.set_source(circ_hole);c.fill()
        c.save();c.translate(HX,470);c.scale(1,.62);c.arc(0,0,260,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.stroke()
    on(c,cam,3400,f)
def s_lawn(c,cam,t,ts):
    grass(c,cam)
    tree(c,cam,-900,4300);tree(c,cam,2400,4600,780);tree(c,cam,650,5200,1000)
    hole(c,cam)
    # treadmill strip
    def strip():
        rect(c,-420,500,980,40,'#45506a',INK,6)
        for i in range(12):
            x=-420+((i*90-ts*420)%1080)
            if x<560-8:rect(c,x,506,30,10,'#8fa0c4')
        text(c,'БЕГИ!',420,230,90,'#ffd23f',stroke=INK,sw=14,rot=-.06) if False else None
    on(c,cam,3000,strip)
    a=ts*9
    char4(c,cam,-220,505,3000,1.0,boil=int(ts*15)%3,mouth='open' if t<5.3 else 'flat',eyes='normal',sweat=1 if t>1.5 else 0,look=(1,0),
          fl=(-42+44*math.sin(a),-26*max(0,math.sin(a))),fr=(42-44*math.sin(a),-26*max(0,-math.sin(a))),hl=(-130,-250+30*math.sin(a)),hr=(120,-230-30*math.sin(a)),**ALICE)
    def qc():c_[0]=c;crown()
    qpoint=K(5.5,6.6,t)
    char4(c,cam,520,520,3000,1.05,extra=qc,boil=int(ts*15)%3,mouth='open' if 5.5<t<9 else 'flat',eyes='normal',brow=1,look=(-1,0),hl=(-120,-220),hr=(120-60*qpoint,-230-90*qpoint),**QUEEN)
    on(c,cam,2990,lambda:(rect(c,640,-40,420,170,'#f1dfae',INK,8),text(c,'БЕГИ!',850,85,100,'#7a2317',stroke='#fff7d6',sw=6)))
    for i in range(6):
        on(c,cam,2900-i*40,lambda i=i:text(c,'$',-520+((i*230-ts*500)%1300)-300,420-i*30,60+i*6,(1,.9,.3,.5),stroke=None))
def cafe(c,cam,t,ts):
    X0,X1=2700,5300
    qd(c,cam,[(X0,-700,3000),(X1,-700,3000),(X1,-700,3700),(X0,-700,3700)],'#5a3d27',INK,3)
    qd(c,cam,[(X0,-700,3000),(X0,-700,3700),(X0,520,3700),(X0,520,3000)],'#8d5c3a',INK,3)
    qd(c,cam,[(X1,-700,3000),(X1,-700,3700),(X1,520,3700),(X1,520,3000)],'#8d5c3a',INK,3)
    floor(c,cam,X0,X1,520,2900,3700,cols=('#b47a42','#c2884c','#a56e39'),n=10)
    def w():
        wall(c,X0,X1,-700,520,lg(c,0,-700,0,520,[(0,'#e5b98a'),(1,'#b98a5a')]),rects=[(3300,-420,3800,-60)],lw=3)
        rect(c,3300,-420,500,360,sky_(c),INK,8)
    def sky_(c):return lg(c,0,-420,0,-60,[(0,'#7cc6f0'),(1,'#fff1cf')])
    on(c,cam,3700,w)
    # table
    box(c,cam,3350,4650,300,330,2900,3150,'#8d5a2b','#6e4420','#a8703a',lw=5)
    def legs():
        rect(c,3400,330,50,190,'#6e4420',INK,5);rect(c,4550,330,50,190,'#6e4420',INK,5)
    on(c,cam,3150,legs)
    def items():
        # cup
        rect(c,3720,220,160,80,'#f6efe2',INK,6);ell(c,3800,300,100,18,(0,0,0,.2))
        c.save();c.new_path();c.arc(3890,262,32,-1.5,1.5);c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke();c.restore()
        ell(c,3800,222,80,16,'#6b3d1c')
        for i in range(3):
            xx=3790+12*math.sin(ts*3+i*2);yy=170-((ts*40+i*30)%110);circ(c,xx+i*18-18,yy,8,(1,1,1,.5))
        # snack (cookie)
        circ(c,4000,262,50,rg(3985,245,6,60,[(0,'#e5b472'),(1,'#a8742f')]),INK,6)
        for dx,dy in((-15,-10),(14,-16),(4,14),(-20,18),(22,10)):circ(c,4000+dx,262+dy,7,'#4a2a14')
        # subscription card
        c.save();c.translate(4200,252);c.rotate(-.12);rect(c,-70,-48,140,96,'#6a4fd2',INK,6);rect(c,-70,-26,140,22,'#2c1f6e');text(c,'ПОДПИСКА',0,34,24,'#ffffff');c.restore()
    on(c,cam,3000,items)
    if t>12.6:
        for i,x in enumerate((3800,4000,4200)):
            sc=K(13.0+i*1.3,13.35+i*1.3,t) if t<16.4 else 1
            def tag(x=x,sc=sc):
                c.save();c.translate(x,60);c.scale(.2+sc*.8,.2+sc*.8)
                circ(c,0,0,52,'#ffd23f',INK,7);text(c,'5',0,24,70,'#3a2312');c.restore()
            if sc>0:on(c,cam,2980,tag)
    # Alice at the table
    sw=1 if t>16 else 0
    char4(c,cam,3430,520,2900,.95,boil=int(ts*15)%3,mouth='open' if t>20 else 'flat',eyes='normal',brow=1,sweat=sw,look=(1,0),hl=(-120,-210),hr=(150,-260),**ALICE)
    # big numbers as objects in the world
    if 16.4<=t<20.3:
        k=K(16.4,16.65,t);big='15' if t<18.3 else '450'
        k2=K(18.3,18.55,t) if t>=18.3 else k
        def num():
            c.save();c.translate(4000,-250);c.scale(.6+.4*eout(k2),.6+.4*eout(k2))
            rect(c,-250,-120,500,250,'#2d2350',INK,10);text(c,big,0,45,200,'#ffd23f',stroke=INK,sw=16)
            text(c,'в день' if big=='15' else 'в месяц',0,108,48,'#ffffff');c.restore()
        on(c,cam,2850,num)
    if t>=20.3:
        k=eout(K(20.3,20.6,t))
        def num2():
            c.save();c.translate(4000,-260);c.scale(.5+.5*k,.5+.5*k)
            rect(c,-290,-130,580,270,'#7a1f2b',INK,10);text(c,'5 475',0,50,190,'#ffd23f',stroke=INK,sw=16);text(c,'в год',0,115,50,'#ffffff');c.restore()
        on(c,cam,2850,num2)
        r=random.Random(5)
        for i in range(14):
            p=r.uniform(0,1);v=r.uniform(.4,.9);tt=((ts-20.3)*v+p)%1
            x=4000+tt*1100+r.uniform(-60,60);y=260+tt*180-math.sin(tt*3.14)*260
            on(c,cam,2800-i*12,lambda x=x,y=y,i=i:coin(c,x,min(y,500),38,ts*6+i))
def coinx(t):return 4700+2800*ease(K(24.2,25.4,t))
def zone3(c,cam,t,ts):
    # table-like shelf and props
    box(c,cam,7300,9000,300,330,2900,3200,'#8d5a2b','#6e4420','#a8703a',lw=5)
    on(c,cam,3200,lambda:(rect(c,7350,330,50,190,'#6e4420',INK,5),rect(c,8900,330,50,190,'#6e4420',INK,5)))
    # note book (rule 1)
    def nb():
        c.save();c.translate(7600,262);c.rotate(-.04);rect(c,-150,-95,300,100,'#fff7d6',INK,7)
        for i in range(3):
            c.set_source_rgba(.3,.3,.5,.6);c.set_line_width(4);c.move_to(-120,-70+i*24);c.line_to(120,-70+i*24);c.stroke()
        c.restore()
        text(c,'ЗАПИСЬ',7600,160,64,'#ffd23f',stroke=INK,sw=10)
        w=K(25.6,28.0,t) if t>25.6 else 0
        for i in range(3):
            if w>i/3:text(c,('кофе 5','снек 5','карта 5')[i],7600,214-0+i*0,0,'#00000000')
        for i in range(3):
            if w>(i+.3)/3.3:text(c,('кофе  5','снек  5','подписка  5')[i],7600,176+i*24,22,'#3a2f6a',stroke=None)
    on(c,cam,2995,nb)
    # three icons (rule 2)
    cross=K(30.0,30.5,t)
    def icons():
        circ(c,7850,250,0,None)
        rect(c,7780,210,130,80,'#f6efe2',INK,6);circ(c,8030,252,44,rg(8015,235,6,60,[(0,'#e5b472'),(1,'#a8742f')]),INK,6)
        c.save();c.translate(8200,252);c.rotate(-.12);rect(c,-60,-42,120,84,'#6a4fd2',INK,6);rect(c,-60,-22,120,18,'#2c1f6e');c.restore()
        if cross>0:
            c.set_source_rgba(.9,.12,.15,1);c.set_line_width(16);c.set_line_cap(cairo.LINE_CAP_ROUND)
            c.move_to(8200-70,252-60);c.line_to(8200-70+140*cross,252-60+120*cross);c.stroke()
            c.move_to(8200+70,252-60);c.line_to(8200+70-140*cross,252-60+120*cross);c.stroke()
    on(c,cam,3000,icons)
    # piggy (rule 3)
    def pig():
        x,y=8500,262
        ell(c,x,y,96,70,rg(x-30,y-40,10,110,[(0,'#ffb8c8'),(1,'#d9728f')]));
        c.save();c.translate(x,y);c.scale(96,70);c.arc(0,0,1,0,6.2832);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.stroke()
        ell(c,x+92,y+6,30,24,'#f08aa5');circ(c,x+60,y-30,8,INK)
        poly(c,[(x-40,y-62),(x-20,y-100),(x+0,y-62)],'#d9728f',INK,5);rect(c,x-70,y+50,24,30,'#d9728f',INK,5);rect(c,x+30,y+50,24,30,'#d9728f',INK,5)
        rect(c,x-30,y-66,60,10,'#2a1020')
    on(c,cam,3000,pig)
    # calendar
    def cal():
        x,y=8760,70
        rect(c,x-120,y-110,240,210,'#fffdf4',INK,8);rect(c,x-120,y-110,240,60,'#d8342b',INK,8)
        text(c,'ПОЛУЧКА',x,y-62,40,'#ffffff');text(c,'1',x,y+60,100,'#2d2350')
    if t>32.4:on(c,cam,3050,cal)
    if 33.5<t<35.6:
        k=K(33.5,35.0,t);yy=-120+k*370
        on(c,cam,2990,lambda:coin(c,8500,min(yy,230),44,ts*6))
    if 24.2<=t<25.45:
        on(c,cam,2990,lambda:coin(c,coinx(t),470,60,ts*8))
    # Alice and Queen
    ha=0 if t<36 else 1
    char4(c,cam,8400 if t<28.5 else 7200 if t<36 else 8100+800*(1-K(36,36.9,t)),520,2900,1.0,boil=int(ts*15)%3,mouth='grin' if ha else 'flat',eyes='normal',look=(1,0),hl=(-120,-210),hr=(130,-240),**ALICE)
    if t>=36:
        def sign():
            rect(c,7625,30,50,490,'#6e4420',INK,6);rect(c,7390,-170,520,230,'#f1dfae',INK,8)
            text(c,'ЗАВТРА:',7650,-80,80,'#3a2312');text(c,'АЛИ-БАБА',7650,20,92,'#7a2317')
        on(c,cam,3000,sign)
def world(c,t,ts):
    cam=camat(t)
    if 24.2<=t<25.4:cam.x=coinx(t)
    if 16.4<t<16.75 or 20.3<t<20.65:
        k=(1-((t-16.4) if t<17 else (t-20.3))/.35)*26;cam.x+=k*math.sin(t*71);cam.y+=k*math.cos(t*59)
    c.save();apply_roll(c,cam)
    grass(c,cam)
    tree(c,cam,6600,4600,850);tree(c,cam,9500,4500,780)
    if t<12.5:s_lawn(c,cam,t,ts)
    if 12.4<=t:
        cafe(c,cam,t,ts)
    if t>=24.3:zone3(c,cam,t,ts)
    if t>=12.4 and cam.x>2700 and False:pass
    c.restore()
    if 11.6<t<12.5:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,K(11.6,12.4,t)))
    if 12.45<=t<12.9:rect(c,-300,-300,W+600,H+600,(0.02,0,.04,1-K(12.5,12.9,t)))
    if 16.4<t<16.5 or 20.3<t<20.4:rect(c,-300,-300,W+600,H+600,(1,.97,.8,.55))
    if t<5.2:
        al=1 if t<4.5 else 1-(t-4.5)/.7
        c.save();c.translate(0,0)
        text(c,'ЗАРПЛАТА ЕСТЬ —',W/2,330,88,(1,1,1,al),stroke=INK,sw=18);text(c,'ДЕНЕГ НЕТ?',W/2,450,112,(1,.85,.2,al),stroke=INK,sw=20)
        c.restore()
CUTS=[0,5.4,9.2,12.45,16.4,20.3,25.2,28.5,32.4,36,40.5,e]
NAMES=['hook','queen','promise','cafe','daily','year','rule1','rule2','rule3','happy','teaser']
def _mk(a,b):
    def fn(c,u,t,bo):world(c,a+u*(b-a),a+t)
    return fn
SH_LIST=[(NAMES[i],CUTS[i],CUTS[i+1],_mk(CUTS[i],CUTS[i+1]),0) for i in range(len(NAMES))]
GR=[(0,1,1,1,1),(11.5,1,1,1,1),(12.5,1.08,.96,.86,1.02),(20,1.04,.96,.92,1),(21.5,.8,.8,1.0,.86),(25.0,.82,.82,1.0,.88),(26.5,1,1,1,1),(35.5,1,1,1,1),(37.5,1.1,.98,.84,1.08),(e+1,1.1,.98,.84,1.08)]
_gf=PchipInterpolator([g[0] for g in GR],np.array([g[1:] for g in GR]))
def POST(a,t):
    g=_gf(t)
    if abs(g-1).sum()>.01:a=grade(a,g[:3],g[3])
    if not(11.9<t<12.7):
        c0,c1=camat(t),camat(t+1/30)
        dx=c1.x-c0.x;dy=c1.y-c0.y
        if abs(dx)+abs(dy)>32:a=speed_blur(a,max(-180,min(180,dx*.55)),max(-180,min(180,dy*.55)))
    return a
CAP=make_caps(T,json.load(open('script.json'))['captions'])
MUSIC_STOP=('hook','queen')
def CUES(f,d):
    for t,g in((0.2,.5),(9.5,.6),(10.8,.5),(12.5,.6),(14.0,.3),(15.4,.3),(16.8,.4),(22.3,.4),(23.9,.5),(24.8,.7),(32.6,.5),(36.5,.4),(40.7,.5)):f['whoosh'](t,g)
    f['thud'](16.45,.5);f['ding'](16.5,1240,.25);f['thud'](18.3,.4);f['ding'](18.4,1560,.25);f['thud'](20.35,.6);f['ding'](20.4,880,.3)
    for t in (13.0,14.3,15.6):f['ding'](t+.35,1760,.2)
    for i in range(10):f['tick'](20.8+i*.22,.28,2400)
    for i in range(6):f['tick'](25.5+i*.4,.2,2000)
    f['crack'](30.0,.5);f['ding'](34.8,1568,.35);f['ding'](36.2,1046,.25);f['ding'](40.6,1318,.3)
