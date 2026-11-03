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
    poly(c,[(0,1650),(0,1320),(400,1230),(800,1350),(1100,1270),(1400,1380),(1400,1650)],lg(c,0,0,SW,0,[(0,'#7fce4a'),(1,'#2f8a4e')]),INK,5)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#59b83c'),(1,'#1f6a35')]))
    return s
def hearth():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#4a3a46'),(1,'#251a2c')]))
    r=random.Random(4)
    for x in range(0,SW,120):rect(c,x,0,120,1750,None,'#150e16',4)
    rect(c,700,900,560,720,lg(c,0,900,0,1620,[(0,'#2a1a1a'),(1,'#7a3a12')]),INK,12)
    poly(c,[(780,1620),(1180,1620),(1100,1280),(860,1280)],lg(c,0,1280,0,1620,[(0,'#ffcf5a'),(1,'#ff5a1c')]),INK,6)
    c.save();c.set_operator(cairo.OPERATOR_ADD);circ(c,980,1450,700,rg(980,1450,40,700,[(0,(1,.6,.2,.6)),(1,(1,.4,.1,0))]));c.restore()
    sets.planks(c,0,SW,1750,SH,10,500,cols=('#5a4a52','#4a3c44','#6a5a62'))
    rect(c,120,1000,300,26,'#6a4a2a',INK,6)
    for i in range(3):circ(c,190+i*80,980,30,'#9a9aa8',INK,5)
    return blur(s,1.3)
def ballroom():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1700,[(0,'#3a1a6e'),(1,'#a8407e')]))
    for x in(160,520,880,1240):
        poly(c,[(x-90,300),(x+90,300),(x+90,1450),(x-90,1450)],lg(c,x-90,0,x+90,0,[(0,'#f4e0b0'),(1,'#a8845a')]),INK,8)
        rect(c,x-60,500,120,520,lg(c,0,500,0,1020,[(0,'#1f1650'),(1,'#5a3a9a')]),INK,6)
    for x in(300,700,1100):
        circ(c,x,260,70,rg(x,260,6,120,[(0,(1,.95,.7,1)),(1,(1,.8,.3,0))]));rect(c,x-3,0,6,200,INK)
    poly(c,[(0,SH),(SW,SH),(SW,1560),(0,1560)],lg(c,0,1560,0,SH,[(0,'#f2d9a0'),(1,'#a8743a')]))
    for i in range(10):
        for j in range(10):
            if (i+j)%2==0:poly(c,[(i*140,1560+j*85),(i*140+140,1560+j*85),(i*140+140,1645+j*85),(i*140,1645+j*85)],(.35,.2,.3,.18))
    return blur(s,1.2)
def night():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1700,[(0,'#070a2e'),(.7,'#232b78'),(1,'#5a4a9a')]))
    r=random.Random(3)
    for i in range(120):circ(c,r.uniform(0,SW),r.uniform(0,1100),r.uniform(1,3.6),(1,1,1,r.uniform(.3,.9)))
    circ(c,1060,420,150,rg(1060,420,40,150,[(0,'#fffbe0'),(.7,(1,.95,.7,.9)),(1,(1,.9,.6,0))]))
    poly(c,[(560,1650),(840,1650),(810,500),(590,500)],lg(c,560,0,840,0,[(0,'#6a68b8'),(1,'#2a2a6a')]),INK,8)
    poly(c,[(540,510),(860,510),(700,300)],'#4a2a6a',INK,8)
    clock(c,700,740,170,minute=0,hour=12,glow=True,num=False)
    sets.houses(c,1660,h0=200,h1=360)
    rect(c,0,1660,SW,SH-1660,lg(c,0,1660,0,SH,[(0,'#4a4a8a'),(1,'#1a1a44')]))
    r=random.Random(5)
    for i in range(50):ell(c,r.uniform(0,SW),r.uniform(1700,SH),r.uniform(30,100),r.uniform(6,14),(.1,.1,.3,.4))
    return blur(s,1.1)
# ---- characters
def zol(c,x,y,s,t,b,dress='#6bb7e8',**k):
    char(c,x,y,s,body=dress,skin='#fff0e0',boil=b,hat=None,bow='#ffffff',**k)
    c.save();c.translate(x,y);c.scale(s,s)
    # hair cap + bun
    c.save();c.new_path();c.arc(0,-440,126,0,6.3);c.clip();ell(c,0,-440-108,150,66,'#8a5a2a');c.restore()
    circ(c,0,-440-150,52,'#8a5a2a',INK,8)
    c.restore()
def hanger_dress(c,x,y,s,col='#ff7ac8'):
    c.save();c.translate(x,y);c.scale(s,s)
    c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.move_to(0,-330);c.line_to(0,-290);c.stroke();c.move_to(-90,-250);c.line_to(0,-300);c.line_to(90,-250);c.stroke()
    poly(c,[(-50,-250),(50,-250),(40,-130),(190,150),(-190,150),(-40,-130)],lg(c,-190,0,190,0,[(0,shade(col,1.2)),(1,shade(col,.65))]),INK,9)
    for i in range(5):circ(c,-110+i*55,60+(i%2)*40,9,'#ffffff')
    c.restore()
def pumpkin(c,x,y,r,glow=0):
    if glow:circ(c,x,y,r*1.8,rg(x,y,r*.5,r*1.8,[(0,(1,.95,.5,.8*glow)),(1,(1,.8,.3,0))]))
    for dx in(-.55,-.28,0,.28,.55):ell(c,x+dx*r,y,r*.5,r*.82,lg(c,x,y-r,x,y+r,[(0,'#ffb347'),(1,'#d95a14')]))
    for dx in(-.55,-.28,0,.28,.55):
        c.save();c.translate(x+dx*r,y);c.scale(r*.5,r*.82);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(r*.04);c.stroke()
    rect(c,x-r*.08,y-r*1.05,r*.16,r*.28,'#3f7a2a',INK,5)
def carriage(c,x,y,r):
    for dx in(-.9,.9):
        circ(c,x+dx*r,y+r*.7,r*.45,'#ffd23f',INK,r*.06)
        for i in range(6):
            a=i/6*math.pi;c.set_source_rgba(*rgb(INK));c.set_line_width(r*.04);c.move_to(x+dx*r+math.cos(a)*r*.45,y+r*.7+math.sin(a)*r*.45);c.line_to(x+dx*r-math.cos(a)*r*.45,y+r*.7-math.sin(a)*r*.45);c.stroke()
    pumpkin(c,x,y,r,glow=1);rect(c,x-r*.3,y-r*.2,r*.6,r*.5,'#ffe9a8',INK,5)
def book(c,x,y,w,h,col,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);rect(c,-w/2,-h/2,w,h,lg(c,-w/2,0,w/2,0,[(0,shade(col,1.2)),(1,shade(col,.6))]),INK,6);rect(c,-w/2+w*.12,-h*.2,w*.76,h*.1,'#ffd98a');rect(c,-w/2+w*.12,h*.05,w*.5,h*.07,'#ffd98a');c.restore()
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()
def hook(c,txt,u):
    k=max(.02,eout(u/.12));c.save();c.translate(W/2,340);c.scale(k,k)
    for i,l in enumerate(txt):text(c,l,0,i*125,112,'#ffd23f',stroke=INK,sw=22)
    c.restore()
def dark(c,cx=W/2,cy=620):rect(c,0,0,W,H,rg(cx,cy,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]))
def purple(c):rect(c,0,0,W,H,rg(W/2,700,100,1400,[(0,'#6a46c4'),(1,'#1a1048')]))
def pop(c,u,x,y,dur=.2):
    k=max(.05,eout(u/dur));c.translate(x,y);c.scale(k,k)
# ---- shots
def s_hook(c,u,t,b):
    c.save();cam(c,700,1350-80*u,.98+.2*u);bg(c,'hearth')
    zol(c,640,2020,1.35,t,b,mouth='open',eyes='wide',look=(.4,-.3),hl=(-170,-300),hr=(170,-300))
    c.restore();hanger_dress(c,900+0*u,1150,1.0) if False else None
    hook(c,['ВСЯ ЗАРПЛАТА','НА ОДИН ВЕЧЕР?'],u)
def s_nocoin(c,u,t,b):
    cam(c,700,1350,1.0+.15*u);bg(c,'hearth')
    zol(c,600,2030,1.2,t,b,mouth='flat',eyes='half',look=(0,.5),hl=(-210,-230),hr=(210,-230))
    for i in range(2):
        c.save();c.translate(600+(-1)**i*300,1650);c.rotate((-1)**i*.5);poly(c,[(-60,0),(60,0),(40,-130),(-40,-130)],'#e8d7b8',INK,6);c.restore()
def s_ballgate(c,u,t,b):
    cam(c,700,1330,.95+.14*u);bg(c,'ballroom')
    zol(c,520,2040,1.1,t,b,dress='#ffe08a',mouth='open',eyes='wide',look=(.7,-.2),hl=(-120,-230),hr=(180,-380))
def s_promise(c,u,t,b):
    purple(c);k=max(.02,eout(u/.25));c.save();c.translate(W/2,600);c.scale(k,k);rect(c,-300,-180,600,420,'#ffd23f',INK,12);text(c,'30',0,50,230,INK);text(c,'СЕКУНД',0,180,70,INK);c.restore()
    text(c,'И ПРАВИЛО',W/2,1050,110,'#ffd23f',stroke=INK,sw=14) if u>.35 else None
def s_prom2(c,u,t,b):
    cam(c,700,1330,1.15+.2*u);bg(c,'ballroom')
    zol(c,700,2060,1.4,t,b,dress='#ffe08a',mouth='smirk',eyes='wide',look=(.3,-.3),hl=(-190,-300),hr=(190,-420))
def s_pump(c,u,t,b):
    dark(c,W/2,800);k=1+.2*u;c.save();c.translate(W/2,1000);c.scale(k,k);pumpkin(c,0,200,330,glow=.5+.5*math.sin(t*8));c.restore()
    text(c,'ТЫКВА',W/2,420,160,'#ffffff',stroke=INK,sw=18)
def s_carr(c,u,t,b):
    dark(c,W/2,800);k=.7+.5*eout(u);c.save();c.translate(W/2,980);c.scale(k,k);c.translate(0,math.sin(t*10)*6);carriage(c,0,200,300);c.restore()
    text(c,'КАРЕТА',W/2,420,160,'#ffd23f',stroke=INK,sw=18)
def s_clock(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,760,100,1400,[(0,'#2a2a8a'),(1,'#0a0a2a')]));sx,sy=shake(t,5*(u>.5))
    c.save();c.translate(sx,sy);clock(c,W/2,860,360,minute=50+10*eout(u),hour=11+eout(u)*.99,glow=True,num=True);c.restore()
    text(c,'ДО ПОЛУНОЧИ',W/2,330,120,'#ffd23f',stroke=INK,sw=16)
def s_run(c,u,t,b):
    x=1500-1600*u;cam(c,x-60,1450,1.02);bg(c,'night');st=math.sin(t*12)
    zol(c,x,2040,1.05,t,b,dress='#ffe08a',mouth='open',eyes='wide',look=(-1,-.2),fl=(-42+st*40,0),fr=(42-st*40,0),hl=(-120,-250),hr=(150,-320))
def s_rent(c,u,t,b):
    cam(c,700,1350,1.0+.14*u);bg(c,'ballroom')
    zol(c,470,2040,1.1,t,b,dress='#ff7ac8',mouth='grin',eyes='normal',look=(.5,0),hl=(-150,-300),hr=(190,-420))
    c.save();c.translate(880,1250);c.rotate(.08*math.sin(t*4));rect(c,-210,-90,420,180,'#fff6d8',INK,9);text(c,'НАПРОКАТ',0,26,68,'#2a8f4e');c.restore()
def s_buy1(c,u,t,b):
    dark(c,W/2,700);k=max(.05,eout(u/.25));c.save();c.translate(W/2,820);c.scale(k,k);rect(c,-380,-260,760,520,'#fff6d8',INK,12);text(c,'КУПИТЬ',0,-90,110,INK);text(c,'60',0,150,250,'#c52a22');c.restore()
def s_buy2(c,u,t,b):
    dark(c,W/2,700);k=max(.05,eout(u/.25));c.save();c.translate(W/2,820);c.scale(k,k);rect(c,-380,-260,760,520,'#fff6d8',INK,12);text(c,'НАПРОКАТ',0,-90,100,INK);text(c,'10',0,150,250,'#2a8f4e');c.restore()
def s_hanger(c,u,t,b):
    dark(c,W/2,800);c.save();c.translate(W/2,1050);k=1.5+.3*u;c.scale(k,k);c.rotate(.05*math.sin(t*3));hanger_dress(c,0,0,1.0);c.restore()
def s_happy(c,u,t,b):
    cam(c,700,1330,1.0+.14*u);bg(c,'ballroom');p=math.sin(t*9)
    zol(c,640+p*20,2040,1.15,t,b,dress='#ff7ac8',mouth='grin',eyes='normal',look=(.3,0),hl=(-170,-420+p*40),hr=(190,-420-p*40))
def s_save(c,u,t,b):
    purple(c);k=max(.05,eout(u/.25));c.save();c.translate(W/2,820);c.scale(k,k);text(c,'−50',0,220,470,'#7dff9a',stroke=INK,sw=34);c.restore()
    for i in range(5):coin(c,180+i*180,1350+math.sin(t*4+i)*20,50,t*8+i)
def s_limit(c,u,t,b):
    dark(c,W/2,800);text(c,'ПОТОЛОК ТРАТ',W/2,330,120,'#ffffff',stroke=INK,sw=16)
    h=700*eout(u/.6);rect(c,380,1300-h,320,h,'#ffd23f',INK,10);rect(c,380,1300-700,320,700,None,INK,10)
    c.set_source_rgba(*rgb('#ff4f5e'));c.set_line_width(14);c.set_dash([30,20]);c.move_to(280,640);c.line_to(900,640);c.stroke();c.set_dash([])
    text(c,'ЛИМИТ',W/2+250,610,80,'#ff4f5e',stroke=INK,sw=12)
def s_debt(c,u,t,b):
    sx,sy=shake(t,3);cam(c,700+sx,1350+sy,1.05+.15*u);bg(c,'hearth')
    zol(c,700,2040,1.1,t,b,mouth='o',eyes='wide',sweat=min(1,u*2),look=(0,.5),hl=(-200,-230),hr=(200,-230))
    c.save();c.translate(W/2,520);c.rotate(-.05);rect(c,-250,-120,500,240,'#fff6d8',INK,10);text(c,'ДОЛГ',0,30,130,'#c52a22');c.restore()
def s_ask(c,u,t,b):
    sx,sy=shake(t,3);cam(c,700+sx,1360+sy,1.3+.2*u);bg(c,'meadow')
    zol(c,700,2150,1.55,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-210,-250),hr=(210,-250))
def s_ask2(c,u,t,b):
    purple(c);k=max(.05,eout(u/.2));c.save();c.translate(W/2,700);c.scale(k,k)
    text(c,'ЧТО БРАЛИ',0,-120,150,'#ffffff',stroke=INK,sw=18);text(c,'НАПРОКАТ?',0,80,160,'#ffd23f',stroke=INK,sw=18);c.restore()
    text(c,'ПИШИТЕ В КОММЕНТАРИИ',W/2,1050,62,'#ffffff',stroke=INK,sw=12) if u>.4 else None
def s_next(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,760,100,1400,[(0,'#6adf9a'),(1,'#0c3a30')]))
    c.save();c.translate(W/2,900);k=.8+.2*eout(u);c.scale(k,k)
    for i in range(8):
        a=i/8*2*math.pi;ell(c,math.cos(a)*190,math.sin(a)*190,150,70,lg(c,0,-100,0,100,[(0,'#ffb0e0'),(1,'#e0408a')]),a)
    circ(c,0,0,90,'#ffd23f',INK,8);c.restore()
    text(c,'ЗАВТРА',W/2,330,130,'#ffd23f',stroke=INK,sw=16);text(c,'ДЮЙМОВОЧКА',W/2,1380,120,'#ffffff',stroke=INK,sw=18)
st=lambda i:T[i]['start']
e=T[-1]['end']+.4
PLAN=[(0,[('h1',s_hook)]),(1,[('nocoin',s_nocoin),('gate',s_ballgate)]),(2,[('promise',s_promise),('prom2',s_prom2)]),(3,[('pump',s_pump),('carr',s_carr)]),(4,[('clock',s_clock),('run',s_run)]),(5,[('rent',s_rent),('hanger',s_hanger)]),(6,[('buy1',s_buy1),('buy2',s_buy2)]),(7,[('save',s_save),('happy',s_happy)]),(8,[('limit',s_limit)]),(9,[('debt',s_debt)]),(10,[('ask',s_ask),('ask2',s_ask2)]),(11,[('next',s_next)])]
LAST=len(T)-1
SH_LIST=[]
for i,fns in PLAN:
    a=0 if i==0 else st(i)-.03;b=e if i==LAST else st(i+1)-.03;n=len(fns)
    for j,(nm,fn) in enumerate(fns):SH_LIST.append((nm,a+(b-a)*j/n,a+(b-a)*(j+1)/n,fn,1 if j==0 else 0))
CAP=make_caps(T,json.load(open('script.json'))['captions'])
MUSIC_STOP=('promise','limit')
def CUES(f,d):
    for i in range(5):f['tick'](d['h1'][1]+i*.22,.3,3000)
    f['thud'](d['nocoin'][1]+.1,.4)
    f['ding'](d['promise'][1]+.1,1320,.25)
    f['ding'](d['pump'][1]+.1,1040,.3);f['ding'](d['carr'][1]+.1,1560,.35)
    m=d['clock']
    for i in range(6):f['tick'](m[1]+i*(m[2]-m[1])/6,.4,1200+i*120)
    f['thud'](d['run'][1]+.05,.5)
    f['ding'](d['rent'][1]+.2,1320,.3)
    f['thud'](d['buy1'][1]+.1,.35);f['thud'](d['buy2'][1]+.1,.35)
    f['ding'](d['save'][1]+.15,1560,.35)
    f['crack'](d['limit'][1]+.6,.4)
    f['thud'](d['debt'][1]+.1,.5)
    f['ding'](d['next'][1]+.2,1040,.3)
