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
# ---- sets
def meadow():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#1f6be0'),(.7,'#8fd8ff'),(1,'#fff0b8')]))
    sets.clouds(c,5,150,800,col=(1,1,1,.95))
    circ(c,1180,420,300,rg(1180,420,50,300,[(0,(1,1,.8,1)),(.35,(1,.92,.5,.7)),(1,(1,.8,.3,0))]))
    poly(c,[(0,1650),(0,1320),(400,1230),(800,1350),(1100,1270),(1400,1380),(1400,1650)],lg(c,0,0,SW,0,[(0,'#7fce4a'),(1,'#2f8a4e')]),INK,5)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#59b83c'),(1,'#1f6a35')]))
    r=random.Random(3)
    for i in range(260):
        y=r.uniform(1520,SH);k=(y-1400)/1000;x=r.uniform(0,SW);c.set_source_rgba(.1,.3,.12,.6);c.set_line_width(5*k);c.move_to(x,y);c.line_to(x+r.uniform(-12,12)*k,y-46*k);c.stroke()
    return s
def mill_tower(c,x,y,s):
    poly(c,[(x-70*s,y),(x+70*s,y),(x+42*s,y-320*s),(x-42*s,y-320*s)],lg(c,x-70*s,0,x+70*s,0,[(0,'#f3e4c4'),(1,'#a98a62')]),INK,7)
    poly(c,[(x-62*s,y-320*s),(x+62*s,y-320*s),(x,y-420*s)],'#8a3b24',INK,7)
    rect(c,x-16*s,y-120*s,32*s,120*s,'#4a2a14',INK,5)
def blades(c,x,y,s,ang):
    c.save();c.translate(x,y);c.rotate(ang)
    for i in range(4):
        c.rotate(math.pi/2);rect(c,-8*s,-30*s,16*s,-300*s,'#6b4a2a',INK,5);rect(c,10*s,-300*s,70*s,-210*s,'#fff2d6',INK,5)
    c.restore();circ(c,x,y,22*s,'#3a2414',INK,5)
def field():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1600,[(0,'#2a1a73'),(.45,'#b8407f'),(.75,'#ff9a50'),(1,'#ffe08a')]))
    circ(c,300,1300,380,rg(300,1300,40,380,[(0,(1,.96,.7,1)),(.4,(1,.8,.45,.7)),(1,(1,.6,.3,0))]))
    sets.clouds(c,11,200,900,col=(1,.8,.7,.6),n=6)
    poly(c,[(0,1700),(0,1420),(500,1340),(900,1440),(1400,1360),(1400,1700)],lg(c,0,1340,0,1700,[(0,'#5a3f6e'),(1,'#2c1b45')]),INK,5)
    mill_tower(c,1000,1500,1.5);mill_tower(c,420,1460,1.0)
    rect(c,0,1560,SW,SH-1560,lg(c,0,1560,0,SH,[(0,'#9a7a3a'),(1,'#4a3418')]))
    r=random.Random(5)
    for i in range(40):
        x=r.uniform(0,SW);y=r.uniform(1600,SH);k=(y-1500)/900;c.set_source_rgba(.25,.17,.05,.7);c.set_line_width(5*k);c.move_to(x,y);c.line_to(x,y-80*k);c.stroke()
    return blur(s,1.0)
def library():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#7a4426'),(1,'#341a12')]))
    r=random.Random(7)
    for j in range(7):
        y=420+j*190;rect(c,60,y+150,1280,34,'#4a2a14',INK,6);x=80
        while x<1300:
            w=r.uniform(40,70);h=r.uniform(100,150);col=r.choice(['#c52a22','#2f8f64','#e5a33a','#3b6fc9','#7a4fb2','#d9542f'])
            rect(c,x,y+150-h,w,h,lg(c,x,0,x+w,0,[(0,shade(col,1.15)),(1,shade(col,.6))]),INK,4)
            rect(c,x+w*.2,y+150-h*.7,w*.6,10,'#ffd98a');x+=w+3
    sets.planks(c,0,SW,1850,SH,10,700)
    c.save();c.set_operator(cairo.OPERATOR_ADD);circ(c,1000,700,1100,rg(1000,700,40,1100,[(0,(1,.75,.35,.55)),(1,(1,.5,.2,0))]));c.restore()
    return blur(s,1.3)
def barren():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#2b2f55'),(.7,'#7c7aa0'),(1,'#c9b9a4')]))
    sets.clouds(c,14,200,900,col=(.55,.55,.7,.8),n=7)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#8c7a5e'),(1,'#463a2a')]))
    r=random.Random(9)
    for i in range(70):
        x=r.uniform(0,SW);y=r.uniform(1540,SH);ell(c,x,y,r.uniform(30,110)*(y/1900),r.uniform(6,14),(.2,.15,.1,.35))
    for x,y in((260,1560),(1100,1620)):
        c.set_source_rgba(*rgb(INK));c.set_line_width(14);c.move_to(x,y);c.line_to(x,y-260);c.stroke();c.move_to(x,y-150);c.line_to(x+70,y-230);c.stroke();c.move_to(x,y-110);c.line_to(x-60,y-190);c.stroke()
    return blur(s,1.0)
def house():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#14285f'),(.7,'#4a68c0'),(1,'#f6b46a')]))
    r=random.Random(2)
    for i in range(80):circ(c,r.uniform(0,SW),r.uniform(0,900),r.uniform(1,3.4),(1,1,1,r.uniform(.3,.9)))
    rect(c,0,1560,SW,SH-1560,lg(c,0,1560,0,SH,[(0,'#5fae46'),(1,'#1f5a30')]))
    poly(c,[(300,1620),(1100,1620),(1100,880),(300,880)],lg(c,300,0,1100,0,[(0,'#f6dcae'),(1,'#b88a5c')]),INK,10)
    poly(c,[(250,890),(1150,890),(700,520)],lg(c,250,0,1150,0,[(0,'#c24a30'),(1,'#6c2224')]),INK,10)
    rect(c,610,1260,180,360,'#7a3d1c',INK,8);circ(c,760,1450,10,'#ffd23f',INK,3)
    for x in(380,860):
        rect(c,x,1020,160,170,lg(c,0,1020,0,1190,[(0,'#ffe9a8'),(1,'#f6a93c')]),INK,8);rect(c,x+76,1020,8,170,INK)
    circ(c,700,1280,700,rg(700,1280,60,700,[(0,(1,.8,.4,.35)),(1,(1,.6,.2,0))]))
    return blur(s,1.1)
# ---- characters
def dq(c,x,y,s,t,b,helm=True,lance=False,**k):
    k.setdefault('mst','#4a3a30')
    char(c,x,y,s,body='#9aa6c8',skin='#fdf3e0',boil=b,hat=None,**k)
    c.save();c.translate(x,y);c.scale(s,s)
    poly(c,[(-18,-440+78),(18,-440+78),(0,-440+128)],'#4a3a30',INK,5)
    if helm:
        c.new_path();c.arc(0,-440-110+28,104,math.pi,0);c.close_path();c.set_source(lg(c,-104,0,104,0,[(0,'#f2f4ff'),(.5,'#aab4d0'),(1,'#55607f')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke()
        ell(c,0,-440-82+28,128,18,lg(c,-128,0,128,0,[(0,'#dfe5f7'),(1,'#5b6684')]));
        c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.new_path();c.save();c.translate(0,-440-82+28);c.scale(128,18);c.arc(0,0,1,0,6.3);c.restore();c.stroke()
        poly(c,[(-8,-440-214+28),(8,-440-214+28),(0,-440-262+28)],'#c52a22',INK,5)
    if lance:
        hr=k.get('hr',(120,-210));c.set_source_rgba(*rgb('#c49a4e'));c.set_line_width(14);c.move_to(hr[0]-120,hr[1]+220);c.line_to(hr[0]+260,hr[1]-720);c.stroke()
        poly(c,[(hr[0]+250,hr[1]-690),(hr[0]+290,hr[1]-690),(hr[0]+270,hr[1]-780)],'#d6dcec',INK,5)
    c.restore()
def helmet_macro(c,x,y,r,rust=1.0):
    c.new_path();c.arc(x,y,r,math.pi,0);c.close_path();c.set_source(lg(c,x-r,y-r,x+r,y,[(0,'#f2f4ff'),(.5,'#98a2c0'),(1,'#4b5675')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(r*.05);c.stroke()
    ell(c,x,y,r*1.2,r*.16,lg(c,x-r,0,x+r,0,[(0,'#dfe5f7'),(1,'#4b5675')]));c.new_path();c.save();c.translate(x,y);c.scale(r*1.2,r*.16);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(r*.05);c.stroke()
    for i in range(7):circ(c,x-r*.7+i*r*.23,y-r*.62+abs(i-3)*r*.07,r*.02,'#6a3b1e')
    ell(c,x-r*.35,y-r*.55,r*.12,r*.28,(1,1,1,.45),-.4)
    poly(c,[(x-r*.12,y-r),(x+r*.12,y-r),(x,y-r*1.45)],'#c52a22',INK,5)
def book(c,x,y,w,h,col,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);rect(c,-w/2,-h/2,w,h,lg(c,-w/2,0,w/2,0,[(0,shade(col,1.2)),(1,shade(col,.6))]),INK,6);rect(c,-w/2+w*.12,-h*.2,w*.76,h*.1,'#ffd98a');rect(c,-w/2+w*.12,h*.05,w*.5,h*.07,'#ffd98a');c.restore()
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()
def hook(c,txt,u):
    k=max(.02,eout(u/.12));c.save();c.translate(W/2,340);c.scale(k,k)
    for i,l in enumerate(txt):text(c,l,0,i*125,98,'#ffd23f',stroke=INK,sw=22)
    c.restore()
def dark(c,cx=W/2,cy=620):rect(c,0,0,W,H,rg(cx,cy,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]))
def purple(c):rect(c,0,0,W,H,rg(W/2,700,100,1400,[(0,'#6a46c4'),(1,'#1a1048')]))
def pop(c,u,x,y,dur=.2):
    k=max(.05,eout(u/dur));c.translate(x,y);c.scale(k,k)
# ---- shots
def s_hook(c,u,t,b):
    c.save();cam(c,700,1330-80*u,.98+.2*u);bg(c,'meadow')
    dq(c,700,2020,1.35,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-170,-300),hr=(170,-300))
    for i in range(6):coin(c,200+i*190+math.sin(t*6+i)*20,900+((t*500+i*160)%700),42,t*9+i)
    c.restore();hook(c,['ВСЁ ПОТРАТИЛИ','НА МЕЧТУ?'],u)
def s_books(c,u,t,b):
    cam(c,700,1350,1.0+.15*u);bg(c,'library')
    dq(c,520,2020,1.15,t,b,helm=False,mouth='smirk',eyes='wide',look=(.6,.3),hl=(-120,-250),hr=(230,-330))
    for i,col in enumerate(('#c52a22','#3b6fc9','#2f8f64','#e5a33a')):book(c,950,1950-i*70,300,64,col,.05*(i%2*2-1))
def s_sale(c,u,t,b):
    cam(c,700,1300,.95+.12*u);bg(c,'field')
    rect(c,860,1360,16,300,'#4a2a14',INK,5)
    c.save();c.translate(870,1330);c.rotate(-.06+.02*math.sin(t*5));rect(c,-250,-110,500,220,'#fff2d6',INK,9);text(c,'ПРОДАНО',0,26,92,'#c52a22');c.restore()
    dq(c,420,2040,1.0,t,b,helm=False,mouth='flat',look=(.8,0),hl=(-120,-220),hr=(130,-220))
def s_promise(c,u,t,b):
    purple(c);k=max(.02,eout(u/.25));c.save();c.translate(W/2,600);c.scale(k,k);rect(c,-300,-180,600,420,'#ffd23f',INK,12);text(c,'30',0,50,230,INK);text(c,'СЕКУНД',0,180,70,INK);c.restore()
    text(c,'И ПРАВИЛО',W/2,1050,110,'#ffd23f',stroke=INK,sw=14) if u>.35 else None
def s_prom2(c,u,t,b):
    cam(c,700,1330,1.15+.2*u);bg(c,'meadow')
    dq(c,700,2060,1.4,t,b,mouth='smirk',eyes='wide',look=(.3,-.3),hl=(-190,-300),hr=(190,-420))
def s_armor(c,u,t,b):
    dark(c,W/2,700);k=1.0+.2*u;c.save();c.translate(W/2,1000);c.scale(k,k);c.rotate(-.05+.03*math.sin(t*3));helmet_macro(c,0,200,330);c.restore()
    text(c,'ДОСПЕХИ',W/2,420,150,'#ffffff',stroke=INK,sw=18)
def s_ride(c,u,t,b):
    x=-100+1500*u;cam(c,x+60,1440,1.02);bg(c,'field');st=math.sin(t*12)
    dq(c,x,2040,1.05,t,b,lance=True,mouth='open',eyes='wide',look=(1,-.2),fl=(-42+st*40,0),fr=(42-st*40,0),hl=(-120,-250),hr=(150,-320))
def s_empty(c,u,t,b):
    cam(c,700,1330,1.05+.15*u);bg(c,'barren')
    dq(c,700,2040,1.1,t,b,helm=False,mouth='o',eyes='wide',sweat=min(1,u*2),look=(0,.5),hl=(-200,-230),hr=(200,-230))
    for i in range(2):
        c.save();c.translate(700+(-1)**i*330,1700);c.rotate((-1)**i*.5);poly(c,[(-60,0),(60,0),(40,-130),(-40,-130)],'#e8d7b8',INK,6);c.restore()
def s_zero(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,760,100,1300,[(0,'#5a1a2a'),(1,'#1a0510')]));k=max(.05,eout(u/.2));text(c,'ПОЛЕЙ',W/2,420,150,'#ffffff',stroke=INK,sw=18)
    sx,sy=shake(t,6*(u<.4));c.save();c.translate(W/2+sx,860+sy);c.scale(k,k);text(c,'0',0,320,700,'#ff4f5e',stroke=INK,sw=34);c.restore()
def s_dream(c,u,t,b):
    cam(c,700,1280,.95+.14*u);bg(c,'field');blades(c,1000,1180,1.5,t*2.2)
    dq(c,450,2040,1.0,t,b,mouth='smirk',eyes='half',look=(.8,-.5),hl=(-120,-230),hr=(250,-480))
    text(c,'МЕЧТА ✓',W/2,560,110,'#7dff9a',stroke=INK,sw=16)
def s_all(c,u,t,b):
    purple(c);k=max(.05,eout(u/.2));c.save();c.translate(W/2,700);c.scale(k,k)
    text(c,'ВСЁ',0,-80,260,'#ffffff',stroke=INK,sw=22);text(c,'СРАЗУ',0,150,220,'#ff4f5e',stroke=INK,sw=22);c.restore()
    if u>.35:
        c.set_source_rgba(*rgb('#ff4f5e'));c.set_line_width(36);c.set_line_cap(cairo.LINE_CAP_ROUND);m=eout((u-.35)/.3)
        c.move_to(260,1100);c.line_to(260+560*m,1100+330*m);c.stroke();c.move_to(820,1100);c.line_to(820-560*m,1100+330*m);c.stroke()
def s_rule(c,u,t,b):
    dark(c,W/2,800);text(c,'ДОЛЯ ДОХОДА',W/2,330,120,'#ffffff',stroke=INK,sw=16)
    cx,cy,r=W/2,860,320;circ(c,cx,cy,r,'#2c5a80',INK,12);a=eout(u/.5)*.1*2*math.pi
    c.new_path();c.move_to(cx,cy);c.arc(cx,cy,r,-math.pi/2,-math.pi/2+max(.02,a));c.close_path();c.set_source_rgba(*rgb('#ffd23f'));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke()
    text(c,'МЕЧТА',W/2,1370,100,'#ffd23f',stroke=INK,sw=14)
def s_pct(c,u,t,b):
    purple(c);k=max(.05,eout(u/.25));c.save();c.translate(W/2,860);c.scale(k,k);text(c,'10%',0,200,430,'#ffd23f',stroke=INK,sw=34);c.restore()
    for i in range(5):coin(c,180+i*180,1360+math.sin(t*4+i)*20,50,t*8+i)
def s_math(c,u,t,b):
    dark(c,W/2,700)
    k=max(.05,eout(u/.2));c.save();c.translate(W/2,520);c.scale(k,k);rect(c,-380,-200,760,400,'#fff6d8',INK,12);text(c,'ДОХОД',0,-70,90,INK);text(c,'100',0,110,200,'#2a8f4e');c.restore()
    k2=max(.05,eout((u-.4)/.2));c.save();c.translate(W/2,1050);c.scale(k2,k2);rect(c,-380,-200,760,400,'#fff6d8',INK,12);text(c,'ДОСПЕХИ',0,-70,90,INK);text(c,'60',0,110,200,'#c52a22');c.restore()
def s_months(c,u,t,b):
    purple(c);text(c,'10 В МЕСЯЦ',W/2,330,120,'#ffd23f',stroke=INK,sw=16)
    for i in range(6):
        on=u*7>i+.4;x=150+(i%3)*270;y=470+(i//3)*330
        rect(c,x,y,230,270,'#fff6d8' if on else (1,1,1,.12),INK,8)
        if on:rect(c,x,y,230,70,'#c52a22',INK,8);text(c,str(i+1),x+115,y+195,150,INK)
    text(c,'6 МЕС',W/2,1330,170,'#ffd23f',stroke=INK,sw=20) if u>.6 else None
def s_done(c,u,t,b):
    sx,sy=shake(t,4);cam(c,700+sx,1330+sy,1.0+.18*u);bg(c,'field');blades(c,1000,1180,1.5,t*1.6)
    dq(c,520,2040,1.15,t,b,mouth='grin',eyes='normal',look=(.4,0),hl=(-160,-300),hr=(190,-440))
    for i in range(5):coin(c,300+i*150,900+((t*400+i*140)%500),38,t*9+i)
def s_home(c,u,t,b):
    cam(c,700,1330,.95+.14*u);bg(c,'house')
    dq(c,420,2040,1.0,t,b,helm=False,mouth='smirk',look=(.7,0),hl=(-120,-230),hr=(150,-250))
    text(c,'ДОМ ЦЕЛ',W/2,520,130,'#ffd23f',stroke=INK,sw=18)
def s_ask(c,u,t,b):
    sx,sy=shake(t,3);cam(c,700+sx,1360+sy,1.3+.2*u);bg(c,'meadow')
    dq(c,700,2150,1.55,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-210,-250),hr=(210,-250))
def s_ask2(c,u,t,b):
    purple(c);k=max(.05,eout(u/.2));c.save();c.translate(W/2,700);c.scale(k,k)
    text(c,'ВАША',0,-120,170,'#ffffff',stroke=INK,sw=18);text(c,'МЕЧТА?',0,80,190,'#ffd23f',stroke=INK,sw=18);c.restore()
    text(c,'ПИШИТЕ В КОММЕНТАРИИ',W/2,1050,62,'#ffffff',stroke=INK,sw=12) if u>.4 else None
def s_next(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,760,100,1400,[(0,'#2a2a8a'),(1,'#0a0a2a')]))
    clock(c,W/2,860,330,minute=0,hour=12-(1-eout(u))*.4,glow=True,num=True)
    text(c,'ЗАВТРА',W/2,330,130,'#ffd23f',stroke=INK,sw=16);text(c,'ЗОЛУШКА',W/2,1420,170,'#ffffff',stroke=INK,sw=18)
st=lambda i:T[i]['start']
e=T[-1]['end']+.4
PLAN=[(0,[('h1',s_hook)]),(1,[('books',s_books),('sale',s_sale)]),(2,[('promise',s_promise),('prom2',s_prom2)]),(3,[('armor',s_armor),('ride',s_ride)]),(4,[('empty',s_empty),('zero',s_zero)]),(5,[('dream',s_dream),('all',s_all)]),(6,[('rule',s_rule)]),(7,[('pct',s_pct)]),(8,[('math',s_math)]),(9,[('months',s_months),('done',s_done)]),(10,[('home',s_home)]),(11,[('ask',s_ask),('ask2',s_ask2)]),(12,[('next',s_next)])]
LAST=len(T)-1
SH_LIST=[]
for i,fns in PLAN:
    a=0 if i==0 else st(i)-.03;b=e if i==LAST else st(i+1)-.03;n=len(fns)
    for j,(nm,fn) in enumerate(fns):SH_LIST.append((nm,a+(b-a)*j/n,a+(b-a)*(j+1)/n,fn,1 if j==0 else 0))
CAP=make_caps(T,json.load(open('script.json'))['captions'])
MUSIC_STOP=('promise','rule')
def CUES(f,d):
    for i in range(5):f['tick'](d['h1'][1]+i*.22,.3,3000)
    f['thud'](d['sale'][1]+.1,.4)
    f['ding'](d['promise'][1]+.1,1320,.25)
    f['crack'](d['armor'][1]+.1,.5)
    f['noise'](d['ride'][1],d['ride'][2],400,2000,.1,mod=2)
    f['thud'](d['zero'][1]+.15,.55)
    f['crack'](d['all'][1]+.5,.5)
    f['ding'](d['rule'][1]+.3,880,.3)
    f['ding'](d['pct'][1]+.15,1560,.35)
    f['thud'](d['math'][1]+.1,.35);f['thud'](d['math'][1]+.55*(d['math'][2]-d['math'][1]),.35)
    m=d['months']
    for i in range(6):f['tick'](m[1]+(i+.4)*(m[2]-m[1])/7,.42,1400+i*100)
    f['ding'](d['done'][1]+.1,1560,.34)
    f['ding'](d['home'][1]+.1,1320,.3)
    f['ding'](d['next'][1]+.2,1040,.3)
