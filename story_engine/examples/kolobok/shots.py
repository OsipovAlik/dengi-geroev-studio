from lib import *
import sets,json,math,random
T=json.load(open('timing.json'));CPT=json.load(open('script.json'))['captions']
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
def forest():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#2a7be0'),(.6,'#a6e0ff'),(1,'#fff0b8')]))
    sets.clouds(c,4,150,700,col=(1,1,1,.95))
    circ(c,1150,380,280,rg(1150,380,50,280,[(0,(1,1,.8,1)),(.35,(1,.92,.5,.7)),(1,(1,.8,.3,0))]))
    r=random.Random(11)
    for layer,(y,col,h) in enumerate(((1380,'#4aa066',420),(1470,'#2f8a4e',520))):
        for i in range(9):
            x=i*175+r.uniform(-40,40)+(layer*80)
            poly(c,[(x-150,y),(x,y-h),(x+150,y)],col,INK,5);poly(c,[(x-120,y-h*.35),(x,y-h*.9),(x+120,y-h*.35)],shade(col,1.12),None)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#59b83c'),(1,'#1f6a35')]))
    poly(c,[(380,1560),(1020,1560),(1400,SH),(0,SH)],lg(c,0,1560,0,SH,[(0,'#d8b074'),(1,'#a07840')]),None)
    for x,h in((90,1100),(1300,1250)):
        rect(c,x-48,1560-h,96,h,lg(c,x-48,0,x+48,0,[(0,'#8a5a2c'),(1,'#4a2c14')]),INK,8)
        circ(c,x,1560-h-60,230,lg(c,x-230,0,x+230,0,[(0,'#3fa65a'),(1,'#1f6a3a')]),INK,8)
    for i in range(240):
        y=r.uniform(1520,SH);k=(y-1400)/1000;x=r.uniform(0,SW);c.set_source_rgba(.1,.3,.12,.6);c.set_line_width(5*k);c.move_to(x,y);c.line_to(x+r.uniform(-12,12)*k,y-46*k);c.stroke()
    return s
def dusk():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,0,1500,[(0,'#3b2a74'),(.6,'#d96a6a'),(1,'#ffc27a')]))
    r=random.Random(5)
    for layer,(y,col,h) in enumerate(((1380,'#2b2a5a',440),(1470,'#1d1c42',540))):
        for i in range(9):
            x=i*175+r.uniform(-40,40)+(layer*80)
            poly(c,[(x-150,y),(x,y-h),(x+150,y)],col,INK,5)
    rect(c,0,1500,SW,SH-1500,lg(c,0,1500,0,SH,[(0,'#3c6a4a'),(1,'#142a2a')]))
    poly(c,[(380,1560),(1020,1560),(1400,SH),(0,SH)],lg(c,0,1560,0,SH,[(0,'#9a7a5a'),(1,'#5a4630')]),None)
    for x,h in((90,1100),(1300,1250)):
        rect(c,x-48,1560-h,96,h,'#2c1a14',INK,8);circ(c,x,1560-h-60,230,'#1f2a52',INK,8)
    return s
def money():
    s,c=surf();rect(c,0,0,SW,SH,rg(SW/2,900,100,1700,[(0,'#2f8f64'),(1,'#0c2f28')]));return s
# ---- characters (original designs)
def kol(c,x,y,s,t,b,mouth='grin',eyes='normal',look=(0,0),spin=0,sweat=0,squash=0,legs=0):
    c.save();c.translate(x,y);c.scale(s,s)
    ell(c,0,0,230,40,(.08,.1,.42,.4))
    ph=math.sin(legs)
    for sg in(-1,1):
        fx=sg*70+sg*40*ph*sg*0+40*ph*sg;fy=-14-(max(0,ph*sg))*34
        limb(c,(sg*60,-150),(fx,fy),bend=sg*10,lw=16);ell(c,fx+8,fy,36,16,INK)
    c.translate(0,-310*(1-squash*.05));c.scale(1+squash*.06,1-squash*.06)
    blob(c,0,0,220,214,seed=b,amp=3)
    c.set_source(rg(-70,-80,20,260,[(0,'#ffe9a0'),(.5,'#f2b84c'),(1,'#a8601c')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(12);c.stroke()
    c.save();c.rotate(spin)
    for i in range(7):
        a=i/7*2*math.pi;c.set_source_rgba(.55,.3,.08,.5);c.set_line_width(7);c.move_to(math.cos(a)*165,math.sin(a)*160);c.line_to(math.cos(a)*190,math.sin(a)*185);c.stroke()
    c.restore()
    lx,ly=look
    for sg in(-1,1):
        px=sg*76;py=-30
        if eyes=='wide':
            ell(c,px,py,36,44,'#ffffff');c.save();c.translate(px,py);c.scale(36,44);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.stroke();circ(c,px+lx*10,py+ly*12,13,INK)
        elif eyes=='half':
            c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.move_to(px-28,py);c.line_to(px+28,py);c.stroke()
        else:
            ell(c,px+lx*6,py+ly*6,17,26,INK);ell(c,px+lx*6-5,py+ly*6-9,5,8,'#ffffff')
        circ(c,sg*128,40,26,(1,.45,.4,.5))
        c.set_source_rgba(*rgb(INK));c.set_line_width(11);c.set_line_cap(cairo.LINE_CAP_ROUND)
        br=-1 if mouth in('o','sad') else 0
        c.move_to(px-28,py-62+br*(-sg)*0-(10 if br else 0)*0);c.line_to(px+28,py-64-(14 if br else 0)*(sg*-1 if False else 1)*0)
        c.stroke()
    my=70;c.set_line_width(11);c.set_source_rgba(*rgb(INK))
    if mouth=='grin':poly(c,[(-62,my-12),(62,my-12),(42,my+36),(0,my+46),(-42,my+36)],'#6e1f2a',INK,8);ell(c,0,my+34,26,11,'#e8546a')
    elif mouth=='o':ell(c,0,my+8,24,32,'#471723')
    elif mouth=='sad':c.move_to(-48,my+36);c.curve_to(-20,my-4,20,my-4,48,my+36);c.stroke()
    elif mouth=='smirk':c.move_to(-44,my+8);c.curve_to(-10,my+22,24,my+14,50,my-14);c.stroke()
    else:c.move_to(-36,my+6);c.line_to(36,my+6);c.stroke()
    if sweat:
        c.save();c.translate(190,-150+sweat*80);c.move_to(0,-26);c.curve_to(26,8,14,28,0,28);c.curve_to(-14,28,-26,8,0,-26);c.set_source_rgba(.47,.82,1,1);c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.stroke();c.restore()
    c.restore()
def ears(c,x,y,s,col,inner='#ffd6c0',dx=0):
    for sg in(-1,1):
        poly(c,[(x+(sg*50+dx)*s,y-500*s),(x+(sg*105+dx)*s,y-700*s),(x+(sg*135+dx)*s,y-480*s)],col,INK,9)
        poly(c,[(x+(sg*72+dx)*s,y-520*s),(x+(sg*105+dx)*s,y-640*s),(x+(sg*120+dx)*s,y-505*s)],inner,None)
def fox(c,x,y,s,t,b,**k):
    # tail behind
    c.save();c.translate(x,y);c.scale(s,s);c.rotate(.12*math.sin(t*6))
    c.move_to(-50,-200);c.curve_to(-260,-170,-330,-330,-250,-470);c.curve_to(-200,-380,-120,-330,-40,-300);c.close_path()
    c.set_source(lg(c,-300,-300,-40,-250,[(0,'#f08a2e'),(1,'#c4561a')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.stroke()
    poly(c,[(-250,-470),(-300,-390),(-262,-340),(-212,-420)],'#ffffff',INK,6)
    c.restore()
    ears(c,x,y,s,'#e8782a');char(c,x,y,s,body='#e8782a',skin='#fff1dd',boil=b,**k)
    lx=k.get('look',(0,0))[0]
    circ(c,x+lx*8*s,y-420*s,15*s,INK)
    ell(c,x,y-400*s,52*s,34*s,(1,1,1,.55))
    circ(c,x+lx*8*s,y-424*s,15*s,INK)
def grey(c,x,y,s,t,b,**k):
    ears(c,x,y,s,'#8a8aa0','#e8c0c8');char(c,x,y,s,body='#6b6b86',skin='#e6e6ee',boil=b,**k)
    for sg in(-1,1):
        c.set_source_rgba(*rgb(INK));c.set_line_width(5*s)
        for dy in(-6,10):c.move_to(x+sg*60*s,y-395*s+dy*s);c.line_to(x+sg*170*s,y-(395-dy*1.5)*s);c.stroke()
def cat(c,x,y,s,t,b,**k):
    ears(c,x,y,s,'#7c7c94','#f0b8c0');char(c,x,y,s,body='#8a3fb8',skin='#f4f1fa',boil=b,hat='top',**k)
    poly(c,[(x-10*s,y-410*s),(x+10*s,y-410*s),(x,y-395*s)],'#e88a96',INK,4)
    for sg in(-1,1):
        c.set_source_rgba(*rgb(INK));c.set_line_width(5*s)
        for dy in(-6,10):c.move_to(x+sg*40*s,y-398*s+dy*s);c.line_to(x+sg*150*s,y-(398-dy*1.5)*s);c.stroke()
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()
def hook(c,txt,u,col='#ffd23f'):
    k=max(.02,eout(u/.12));c.save();c.translate(W/2,340);c.scale(k,k)
    for i,l in enumerate(txt):text(c,l,0,i*118,104,col,stroke=INK,sw=22)
    c.restore()
def pop(c,txt,u,x=W/2,y=700,size=140,col='#ffffff',rot=-.08):
    if u<=0:return
    k=max(.02,eout(u/.18));c.save();c.translate(x,y);c.scale(k,k);text(c,txt,0,0,size,col,stroke=INK,sw=18,rot=rot);c.restore()
# ---- shots
def s0(c,u,t,b):
    c.save();cam(c,700,1330-90*u,.95+.2*u);bg(c,'forest');kol(c,700,2000,1.3,t,b,mouth='o',eyes='wide',look=(0,-.3),squash=math.sin(t*9),legs=t*14)
    for i in range(5):coin(c,300+i*190+math.sin(t*5+i)*16,1000+((t*500+i*170)%500),36,t*9+i)
    c.restore();hook(c,['ВЗЯЛИ В ДОЛГ','И ПРЯЧЕТЕСЬ?'],u)
def s1(c,u,t,b):
    x=300+800*u;cam(c,x+80,1450,1.08);bg(c,'forest');kol(c,x,2040,1.05,t,b,mouth='grin',look=(1,0),spin=t*12,legs=t*18,squash=math.sin(t*18))
    for i in range(4):ell(c,x-150-i*70,2030-i*10,40-i*7,12,(.7,.6,.4,.35))
def s2(c,u,t,b):
    rect(c,0,0,W,H,lg(c,0,0,0,H,[(0,'#14285f'),(1,'#0b153b')]));k=max(.02,eout(u/.25))
    c.save();c.translate(W/2,620);c.scale(k,k);rect(c,-300,-180,600,420,'#ffd23f',INK,12);text(c,'30',0,50,230,INK);text(c,'СЕКУНД',0,180,70,INK);c.restore()
    if u>.35:text(c,'И ЧТО ДЕЛАТЬ',W/2,1050,100,'#ffd23f',stroke=INK,sw=14);text(c,'С ДОЛГОМ',W/2,1170,100,'#ffd23f',stroke=INK,sw=14)
def runner(c,u,t,b,who,dirn=1):
    x=(250 if dirn>0 else 1150)+dirn*(760*u);cam(c,700+(x-700)*.4,1450,1.0+.1*u);bg(c,'forest')
    who(c,x-dirn*0,2040,1.0,t,b)
def s3a(c,u,t,b):
    cam(c,700,1450,1.0+.1*u);bg(c,'forest')
    char(c,330,2040,1.0,body='#c0506e',bow='#ffd23f',boil=b,mouth='o',eyes='wide',look=(1,0),hl=(-120,-420),hr=(150,-430),fl=(-42,0),fr=(42,0))
    kol(c,520+u*600,2040,.95,t,b,mouth='grin',look=(1,0),spin=t*14,legs=t*18,squash=math.sin(t*18));pop(c,'УШЁЛ!',u,x=W/2,y=760)
def s3b(c,u,t,b):
    cam(c,700,1450,1.0+.1*u);bg(c,'forest')
    char(c,1050,2040,1.0,body='#3b6fc9',mst='#c8c8d0',boil=b,mouth='o',eyes='wide',look=(-1,0),hl=(-160,-420),hr=(120,-430))
    kol(c,880-u*620,2040,.95,t,b,mouth='grin',look=(-1,0),spin=-t*14,legs=t*18,squash=math.sin(t*18));pop(c,'УШЁЛ!',u,x=W/2,y=760,rot=.08)
def s3c(c,u,t,b):
    cam(c,700,1450,1.0+.1*u);bg(c,'forest')
    grey(c,330,2040,1.0,t,b,mouth='grin',eyes='normal',look=(1,0),hl=(-150,-330),hr=(160,-430))
    kol(c,560+u*660,2040,.95,t,b,mouth='smirk',look=(1,0),spin=t*14,legs=t*18,squash=math.sin(t*18));pop(c,'УШЁЛ!',u,x=W/2,y=760)
def s4(c,u,t,b):
    sx,sy=shake(t,6*(1 if u<.5 else 0));cam(c,700+sx,1380+sy,1.1+.1*u);bg(c,'dusk')
    fox(c,760,2060,1.25,t,b,mouth='grin',eyes='half',look=(-.6,0),brow=.5,hl=(-160,-300),hr=(150,-420))
    kol(c,330-20*math.sin(t*20),2050,.75,t,b,mouth='o',eyes='wide',look=(1,0),sweat=u)
    pop(c,'НАШЛА!',u,y=620,col='#ffd23f')
def s5(c,u,t,b):
    cam(c,700,1300,1.0+.2*u);bg(c,'dusk');fox(c,700,2100,1.55,t,b,mouth='smirk',eyes='half',look=(.4,0),brow=.4,hl=(-170,-250),hr=(170,-480))
    kol(c,1150,2060,.55,t,b,mouth='sad',eyes='wide',sweat=u)
def s6(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,620,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]))
    k=eout(u/.3);c.save();c.translate(W/2,520);c.scale(max(.02,k),max(.02,k));rect(c,-380,-130,760,260,'#fff6d8',INK,12);text(c,'ДОЛГ 100',0,36,120,INK);c.restore()
    k2=eout((u-.45)/.3)
    if k2>0:
        c.save();c.translate(W/2,900);c.scale(max(.02,k2),max(.02,k2));rect(c,-420,-130,840,260,'#ffd23f',INK,12);text(c,'+1% В ДЕНЬ',0,36,112,'#c52a22');c.restore()
    for i in range(3):coin(c,300+i*240,1250+math.sin(t*4+i)*20,60,t*8+i)
def s7(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,620,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]));k=ease(u/.85)
    rect(c,170,1300,740,18,'#ffffff',INK,4)
    for i,(lab,v) in enumerate((('0',100),('30',135),('60',182),('100',270))):
        kk=ease((u-.1*i)/.4);h=v*3.2*kk;x=200+i*185
        rect(c,x,1300-h,150,h,lg(c,0,1300-h,0,1300,[(0,'#ff8a5a'),(1,'#c52a22')]) if i==3 else lg(c,0,1300-h,0,1300,[(0,'#ffe78a'),(1,'#c8912e')]),INK,7)
        text(c,lab+' дн.',x+75,1380,46,'#ffffff',stroke=INK,sw=7)
    v=int(100+170*k);text(c,str(v),W/2,360,230,'#ffd23f',stroke=INK,sw=20)
def s8(c,u,t,b):
    cam(c,700,1450,1.15+.1*u);bg(c,'forest');kol(c,700,2040,1.05,t,b,mouth='sad',eyes='wide',look=(1,0),sweat=u,spin=t*16,legs=t*20,squash=math.sin(t*20))
    for i in range(3):coin(c,300+i*300,1100+((t*400+i*200)%400),38,t*8)
    text(c,'+',W/2+250,840,160,'#ff4f5e',stroke=INK,sw=16)
def card(c,y,txt,u,col='#fff6d8',tc=INK,size=62):
    k=eout(u);
    if k<=.02:return
    c.save();c.translate(W/2,y);c.scale(k,k);rect(c,-440,-85,880,170,col,INK,10);text(c,txt,0,size*.36,size,tc);c.restore()
def s9(c,u,t,b):
    rect(c,0,0,W,H,rg(W/2,620,100,1300,[(0,'#2f6f9a'),(1,'#0d2438')]))
    card(c,430,'1. НЕ ПРЯЧЬСЯ',u/.2);card(c,700,'2. СКАЖИ ЗАРАНЕЕ',(u-.3)/.2);card(c,970,'3. ДОГОВОРИСЬ О ГРАФИКЕ',(u-.6)/.2,col='#ffd23f',size=52)
    kol(c,540,1560,.55,t,b,mouth='grin',eyes='normal',squash=math.sin(t*6)*.5)
def s10(c,u,t,b):
    cam(c,700,1350,1.0+.12*u);bg(c,'forest')
    fox(c,900,2050,1.15,t,b,mouth='smirk',eyes='normal',look=(-.4,0),hl=(-210,-380+math.sin(t*5)*20),hr=(160,-300))
    kol(c,420,2040,.95,t,b,mouth='grin',look=(1,0),squash=math.sin(t*8)*.4)
    for i in range(4):coin(c,520+i*70+u*40,1350+i*-30-u*80+(i%2)*40,40,t*8+i)
    pop(c,'С ПОЛУЧКИ!',u,y=650,size=120,col='#ffd23f')
def s11(c,u,t,b):
    cam(c,700,1320,.92+.08*u);bg(c,'dusk');rect(c,0,0,SW,SH,(.05,.03,.2,.3))
    cat(c,700,2060,1.1,t,b,mouth='smirk',look=(.5,-.2),hl=(-130,-250),hr=(170,-500))
    text(c,'ЗАВТРА',700,760,120,'#ffd23f',stroke=INK,sw=16)
    text(c,'КОТ В САПОГАХ',700,900,88,'#ffffff',stroke=INK,sw=14)
st=lambda i:T[i]['start']
e=T[-1]['end']+.4
d3=(T[3]['end']-T[3]['start'])/3
SH_LIST=[('h1',0,st(1)-.03,s0,0),('h2',st(1)-.03,st(2)-.03,s1,1),('promise',st(2)-.03,st(3)-.03,s2,1),
 ('g1',st(3)-.03,st(3)+d3,s3a,1),('g2',st(3)+d3,st(3)+2*d3,s3b,1),('g3',st(3)+2*d3,st(4)-.03,s3c,1),
 ('fox',st(4)-.03,st(5)-.03,s4,1),('foxc',st(5)-.03,st(6)-.03,s5,1),('debt',st(6)-.03,st(7)-.03,s6,0),('grow',st(7)-.03,st(8)-.03,s7,1),
 ('run',st(8)-.03,st(9)-.03,s8,0),('rules',st(9)-.03,st(10)-.03,s9,1),('pay',st(10)-.03,st(11)-.03,s10,0),('next',st(11)-.03,e,s11,1)]
CAP=make_caps(T,CPT)
MUSIC_STOP=('fox','foxc')
def CUES(f,d):
    for i in range(5):f['tick'](d['h1'][1]+i*.22,.3,3000)
    f['ding'](d['promise'][1]+.1,1320,.25)
    for n in('g1','g2','g3'):f['whoosh'](d[n][1]+.15,.5)
    f['thud'](d['fox'][1]+.1,.55);f['crack'](d['fox'][1]+.1,.5)
    f['ding'](d['debt'][1]+.1,880,.3)
    w=d['grow']
    for i in range(4):f['tick'](w[1]+i*.4,.4,1000+i*300)
    f['thud'](w[1]+1.6,.5)
    f['ding'](d['pay'][1]+.2,1560,.34)
