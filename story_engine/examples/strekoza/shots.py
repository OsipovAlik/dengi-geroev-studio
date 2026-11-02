from lib import *
import sets,json,math,random
T=json.load(open('timing.json'))
_cache={}
def S(n):
    if n not in _cache:_cache[n]=globals()[n]() if n in globals() else getattr(sets,n)()
    return _cache[n]
def cam(c,cx,cy,z,r=0):
    hv,hh=960/z+30,540/z+30
    cy=min(max(cy,hv),SH-hv) if 2*hv<SH else SH/2
    cx=min(max(cx,hh),SW-hh) if 2*hh<SW else SW/2
    c.translate(W/2,H/2);c.rotate(r);c.scale(z,z);c.translate(-cx,-cy)
def bg(c,n):
    c.set_source_surface(S(n),0,0);c.get_source().set_filter(cairo.FILTER_BILINEAR);c.paint()
def shake(t,a,s=0):return a*math.sin(t*71+s)*math.cos(t*43),a*math.sin(t*59+s+1)
# ---- sets
def meadow():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#1f6be0'),(.7,'#8fd8ff'),(1,'#fff0b8')]))
    sets.clouds(c,5,150,800,col=(1,1,1,.95))
    circ(c,180,420,300,rg(180,420,50,300,[(0,(1,1,.8,1)),(.35,(1,.92,.5,.7)),(1,(1,.8,.3,0))]))
    poly(c,[(0,1650),(0,1320),(400,1230),(800,1350),(1100,1270),(1400,1380),(1400,1650)],lg(c,0,0,SW,0,[(0,'#7fce4a'),(1,'#2f8a4e')]),INK,5)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#59b83c'),(1,'#1f6a35')]))
    r=random.Random(3)
    for i in range(260):
        y=r.uniform(1520,SH);k=(y-1400)/1000;x=r.uniform(0,SW);c.set_source_rgba(.1,.3,.12,.6);c.set_line_width(5*k);c.move_to(x,y);c.line_to(x+r.uniform(-12,12)*k,y-46*k);c.stroke()
    for i in range(46):
        y=r.uniform(1560,SH);k=(y-1400)/1000;x=r.uniform(0,SW);col=r.choice(['#ff5a6e','#ffd23f','#ffffff','#ff8ad0'])
        c.set_source_rgba(.1,.3,.12,1);c.set_line_width(5*k);c.move_to(x,y);c.line_to(x,y-60*k);c.stroke();circ(c,x,y-64*k,15*k,col,INK,3)
    return s
def winter():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#10174f'),(.65,'#3a56b5'),(1,'#a9c7ee')]))
    poly(c,[(0,1600),(0,1300),(500,1220),(900,1350),(1400,1250),(1400,1600)],lg(c,0,0,SW,0,[(0,'#e9f3ff'),(1,'#7f9fd8')]),INK,5)
    rect(c,0,1520,SW,SH-1520,lg(c,0,1520,0,SH,[(0,'#f0f7ff'),(.5,'#b9d0f2'),(1,'#5f7cc4')]))
    r=random.Random(8)
    for x,h in((170,520),(1200,640),(760,380)):
        c.set_source_rgba(*rgb(INK));c.set_line_width(30);c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(x,1560);c.line_to(x,1560-h);c.stroke();c.set_line_width(13)
        for i in range(5):
            y=1560-h*(.42+i*.12);d=(-1)**i;c.move_to(x,y);c.line_to(x+d*(180-i*22),y-110);c.stroke()
    for i in range(70):ell(c,r.uniform(0,SW),r.uniform(1560,SH),r.uniform(30,90),r.uniform(5,14),(.28,.36,.72,.3))
    return s
def burrow():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#6e3f1e'),(.6,'#44240f'),(1,'#20112a')]))
    for i in range(9):
        y=500+i*170;rect(c,120,y,1160,22,'#8a5a2c',INK,5)
        r=random.Random(i)
        for k in range(40):circ(c,160+k*27+r.uniform(-5,5),y-14-r.uniform(0,60)*(.3+.7*(i/9)),r.uniform(8,13),r.choice(['#e8b53e','#d99a2b','#f2cf6a']),INK,2)
    c.save();c.set_operator(cairo.OPERATOR_ADD);circ(c,200,500,1500,rg(200,500,40,1500,[(0,(1,.75,.4,.8)),(1,(1,.5,.2,0))]));c.restore()
    sets.planks(c,0,SW,2000,SH,10,500)
    return blur(s,1.4)
def office():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#2d4f86'),(1,'#141f4a')]))
    for x in(120,520,920):
        rect(c,x,240,320,760,lg(c,0,240,0,1000,[(0,'#b9e6ff'),(1,'#5a93d8')]),INK,10)
    sets.planks(c,0,SW,1720,SH,10,700,cols=('#5f6a86','#4e5874','#3e4662'))
    rect(c,120,1520,1160,60,'#8c5a2e',INK,8)
    return blur(s,1.2)
# ---- characters (original designs)
def wings(c,x,y,s,t):
    f=.25*math.sin(t*38)
    for sg in(-1,1):
        for dy,l in((-330,300),(-260,250)):
            c.save();c.translate(x+sg*40*s,y+dy*s);c.rotate(sg*(.28+f));ell(c,sg*l*.55*s,0,l*.6*s,60*s,(.72,.95,1,.58));c.restore()
def strekoza(c,x,y,s,t,b,**k):
    wings(c,x,y,s,t);char(c,x,y,s,body='#37c0b4',skin='#f6ffe8',boil=b,bow='#ff4f8b',**k)
def ant(c,x,y,s,b,**k):
    char(c,x,y,s,body='#7a3a18',skin='#ffe7c9',hat='bowler',boil=b,**k)
    for sg in(-1,1):
        c.set_source_rgba(*rgb(INK));c.set_line_width(9*s);c.move_to(x+sg*70*s,y-575*s);c.curve_to(x+sg*100*s,y-680*s,x+sg*170*s,y-690*s,x+sg*190*s,y-640*s);c.stroke();circ(c,x+sg*190*s,y-640*s,13*s,INK)
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()
def hook(c,txt,u):
    k=max(.02,eout(u/.12));c.save();c.translate(W/2,340);c.scale(k,k)
    for i,l in enumerate(txt):text(c,l,0,i*118,104,'#ffd23f',stroke=INK,sw=22)
    c.restore()
# ---- shots
def s0(c,u,t,b):
    c.save();cam(c,700,1250-130*u,.95+.22*u);bg(c,'meadow');strekoza(c,700,2020,1.45,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-170,-250),hr=(170,-250));
    for i in range(5):coin(c,300+i*200+math.sin(t*5+i)*16,1000+((t*600+i*170)%500),40,t*9+i)
    c.restore();hook(c,['ЗАРПЛАТА','КОНЧАЕТСЯ','РАНЬШЕ','МЕСЯЦА?'],u)
def s1(c,u,t,b):
    cam(c,700,1450,1.0+.14*u);bg(c,'meadow');strekoza(c,700,2020,1.2,t,b,mouth='smirk',look=(.5,0),hl=(-150,-300),hr=(160,-280))
def s2(c,u,t,b):
    rect(c,0,0,W,H,lg(c,0,0,0,H,[(0,'#14285f'),(1,'#0b153b')]));k=max(.02,eout(u/.25))
    c.save();c.translate(W/2,600);c.scale(k,k);rect(c,-300,-180,600,420,'#ffd23f',INK,12);text(c,'30',0,50,230,INK);text(c,'СЕКУНД',0,180,70,INK);c.restore();text(c,'И ПРАВИЛО',W/2,1050,110,'#ffd23f',stroke=INK,sw=14) if u>.35 else None
def s3a(c,u,t,b):
    cam(c,700,1420,.96+.2*u);bg(c,'meadow');p=math.sin(t*12);strekoza(c,700+p*14,2040,1.1,t,b,mouth='open',eyes='normal',look=(0,-.5),hl=(-170,-430+p*50),hr=(170,-430-p*50))
    for i in range(6):text(c,'♪',250+i*190,1050+math.sin(t*5+i)*60-(t*120+i*80)%300,74,'#ffffff',font='DejaVu Sans',stroke=INK,sw=7)
def s3b(c,u,t,b):
    cam(c,700,1240,1.5+.1*u,-.03);bg(c,'meadow');
    for i in range(4):coin(c,350+i*220,1500-(t*700+i*170)%700,70,t*11+i)
    text(c,'0',700,1180,330,'#ff4f5e',stroke=INK,sw=20)
def s4a(c,u,t,b):
    x=-80+1500*u;cam(c,x+60,1500,1.02);bg(c,'meadow');st=math.sin(t*14);ant(c,x,2080,1.0,b,mouth='flat',look=(1,0),fl=(-42+st*40,0),fr=(42-st*40,0),hl=(130,-470),hr=(180,-470));ell(c,x+150,1530,36,24,'#e8b53e')
def s4b(c,u,t,b):
    cam(c,700,1250,.9+.1*u);bg(c,'burrow');ant(c,500,2200,1.08,b,mouth='smirk',eyes='half',look=(.7,0),hl=(-130,-240),hr=(160,-380))
def s5(c,u,t,b):
    sx,sy=shake(t,5);cam(c,700+sx,1120+sy,1.34+.18*u);bg(c,'meadow');strekoza(c,700,1960,1.55,t,b,mouth='yell',look=(0,0),hl=(-190,-400),hr=(190,-400),tilt=.05*math.sin(t*12))
def s6(c,u,t,b):
    cam(c,700,1300,.9+.14*u);bg(c,'winter')
    r=random.Random(int(t*15))
    for i in range(130):
        x=(r.uniform(0,SW)+t*40)%SW;y=(r.uniform(0,SH)+t*220)%SH;circ(c,x,y,r.uniform(3,9),(1,1,1,.85))
def s7a(c,u,t,b):
    cam(c,700,1420,.98+.12*u);bg(c,'winter');st=math.sin(t*5)*.5;strekoza(c,560+u*150,2040,.98,t*.1,b,mouth='flat',eyes='wide',look=(.5,.4),sweat=(u%.5)*2,hl=(-90,-200),hr=(90,-200),fl=(-30+st*20,0),fr=(30-st*20,0))
    rect(c,980,1320,330,730,lg(c,980,0,1310,0,[(0,'#a4622c'),(1,'#5c2f12')]),INK,10);circ(c,1020,1700,15,'#ffd23f',INK,4)
def s7b(c,u,t,b):
    sx,sy=shake(t,14*(int(t*6)%2));cam(c,700+sx,1250+sy,1.1,0);bg(c,'winter');rect(c,380,620,700,1400,lg(c,380,0,1080,0,[(0,'#b86f35'),(1,'#5c2f12')]),INK,14);rect(c,470,760,520,420,None,INK,8);rect(c,470,1260,520,560,None,INK,8);circ(c,1010,1340,24,'#ffd23f',INK,5)
    text(c,'ТУК',700,1080,150,'#ffffff',stroke=INK,sw=16,rot=-.1)
def s8(c,u,t,b):
    cam(c,700,1210,1.25+.14*u);bg(c,'burrow');ant(c,700,1900,1.45,b,mouth='smirk',eyes='half',look=(-.5,0),brow=.5,hl=(-160,-250),hr=(180,-500))
def s9(c,u,t,b):
    cam(c,700,1320,.95+.14*u);bg(c,'office');char(c,700,2040,1.15,body='#3b6fc9',hat=None,mouth='o',eyes='wide',boil=b,sweat=min(1,u*1.5),look=(0,.4),hl=(-130,-250),hr=(150,-340))
    c.save();c.translate(1000,1450);c.rotate(-.15+.05*math.sin(t*4));rect(c,-170,-110,340,220,'#fff6d8',INK,8);text(c,'УВОЛЕН',0,18,64,'#c52a22');c.restore()
def s10(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,620,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]));r=W/2;k=min(1,u/.5)
    c.save();c.translate(0,0);rect(c,290,300,500,760,None,INK,14);rect(c,298,1060-700*.1-700*k*.2,484,70+700*k*.2,lg(c,0,500,0,1060,[(0,'#ffe78a'),(1,'#c8912e')]));c.restore()
    poly(c,[(290,300),(790,300),(790,1060),(290,1060)],(1,1,1,.13),INK,14)
    for i in range(3):coin(c,540,300+((t*900+i*260)%700),58,t*10+i)
    text(c,'10%',W/2,250,150,'#ffd23f',stroke=INK,sw=16)
def s11(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,620,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]));k=eout(u)
    for i in range(10):
        on=u*11>i
        x=170+(i%5)*185;y=340+(i//5)*300
        rect(c,x,y,155,235,lg(c,0,y,0,y+235,[(0,'#ffe78a'),(1,'#c8912e')]) if on else (1,1,1,.1),INK,7)
        if on:text(c,'10%',x+78,y+135,44,INK)
    text(c,'=',W/2,1000,120,'#ffffff',stroke=INK,sw=12);text(c,'1 МЕСЯЦ',W/2,1170,108,'#ffd23f',stroke=INK,sw=16) if u>.65 else None
def s12(c,u,t,b):
    cam(c,700,1310,.92+.08*u);bg(c,'desert') if False else bg(c,'winter');rect(c,0,0,SW,SH,(.05,.03,.2,.35))
    char(c,700,2040,1.06,body='#8c4fbf',hat='top',mst='#2a1810',boil=b,mouth='smirk',look=(.5,-.2),hl=(-130,-250),hr=(170,-500))
    text(c,'ЗАВТРА',700,720,120,'#ffd23f',stroke=INK,sw=16)
st=lambda i:T[i]['start']
e=T[-1]['end']+.4
SH_LIST=[('h1',0,st(1)-.03,s0,0),('h2',st(1)-.03,st(2)-.03,s1,1),('promise',st(2)-.03,st(3)-.03,s2,1),('sing',st(3)-.03,st(3)+1.6,s3a,1),('zero',st(3)+1.6,st(4)-.03,s3b,0),('antw',st(4)-.03,st(4)+1.3,s4a,1),('antb',st(4)+1.3,st(5)-.03,s4b,0),('laugh',st(5)-.03,st(6)-.03,s5,1),('winter',st(6)-.03,st(7)-.03,s6,1),('walk',st(7)-.03,st(7)+1.3,s7a,0),('door',st(7)+1.3,st(8)-.03,s7b,0),('dance',st(8)-.03,st(9)-.03,s8,0),('fired',st(9)-.03,st(10)-.03,s9,1),('jar',st(10)-.03,st(11)-.03,s10,1),('month',st(11)-.03,st(12)-.03,s11,0),('next',st(12)-.03,e,s12,1)]
CAP=make_caps(T)
MUSIC_STOP=('winter','fired')
def CUES(f,d):
    for i in range(5):f['tick'](d['h1'][1]+i*.22,.3,3000)
    f['ding'](d['promise'][1]+.1,1320,.25)
    w=d['zero'];f['thud'](w[1]+.1,.35)
    f['noise'](d['winter'][1],d['walk'][2],400,2000,.1,mod=2)
    p=d['door']
    for i in range(3):f['thud'](p[1]+i*.2,.42)
    f['ding'](d['dance'][1]+.1,520,.3)
    f['thud'](d['fired'][1]+.1,.5)
    m=d['month']
    for i in range(10):f['tick'](m[1]+i*(m[2]-m[1])/11,.42,1600+i*80)
    f['ding'](m[1]+.68*(m[2]-m[1]),1560,.34)
