from lib import *
import json,math,random
T=json.load(open('timing.json'));WD=json.load(open('words_aligned.json'))
WW,HH=2200,1240;OX,OY=140,100      # world = screen + (140,100)
_cache={}
def S(n):
    if n not in _cache:_cache[n]=globals()[n]()
    return _cache[n]
def cam(c,cx=1100,cy=620,z=1.0,r=0):
    hh,hv=960/z,540/z
    cx=min(max(cx,hh),WW-hh) if 2*hh<WW else WW/2
    cy=min(max(cy,hv),HH-hv) if 2*hv<HH else HH/2
    c.translate(W/2,H/2);c.rotate(r);c.scale(z,z);c.translate(-cx,-cy)
def bg(c,n):
    c.set_source_surface(S(n),0,0);c.get_source().set_filter(cairo.FILTER_BILINEAR);c.paint()
def shake(t,a,s=0):return a*math.sin(t*71+s)*math.cos(t*43),a*math.sin(t*59+s+1)
# ------------------------------------------------------------ backgrounds (world 2200x1240)
def b_navy():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,lg(c,0,0,WW,HH,[(0,'#14285f'),(1,'#0b153b')]))
    circ(c,1100,500,700,rg(1100,500,50,700,[(0,(.3,.45,.9,.35)),(1,(.1,.15,.4,0))]));return s
def b_street():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,lg(c,0,0,0,900,[(0,'#f2a05a'),(.55,'#ffd9a0'),(1,'#fff0cf')]))
    r=random.Random(4)
    for k,(y0,col) in enumerate(((620,'#b98a6a'),(700,'#8a5f4a'))):
        x=-50
        while x<WW:
            w=r.uniform(170,300);h=r.uniform(380,560)-k*120
            rect(c,x,y0-h+120,w,h+400,col,INK,5)
            for yy in range(int(y0-h+170),y0+80,95):
                for xx in range(int(x+28),int(x+w-50),70):rect(c,xx,yy,38,56,'#ffe7a8' if r.random()<.6 else '#5a4a60',INK,3)
            x+=w
    rect(c,0,860,WW,HH-860,lg(c,0,860,0,HH,[(0,'#8a7a70'),(1,'#4a3f3a')]))
    for i in range(30):
        for j in range(5):rect(c,i*80+(j%2)*40,900+j*70,70,52,(.12,.1,.1,.18),None)
    return s
def b_town():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,lg(c,0,0,0,900,[(0,'#4fa0ee'),(1,'#d6f0ff')]))
    circ(c,1800,230,150,rg(1800,230,20,170,[(0,(1,1,.8,1)),(1,(1,.9,.5,0))]))
    r=random.Random(9)
    rect(c,0,760,WW,HH-760,lg(c,0,760,0,HH,[(0,'#7ec45a'),(1,'#2e7a3c')]))
    for i in range(9):
        x=80+i*250+r.uniform(-30,30);hh_=r.uniform(150,230);w=r.uniform(150,200)
        rect(c,x,820-hh_,w,hh_,r.choice(['#e8c88a','#d9a066','#f0d9a8']),INK,5);poly(c,[(x-14,820-hh_),(x+w/2,820-hh_-110),(x+w+14,820-hh_)],r.choice(['#b5472e','#8f3a2a']),INK,5)
        rect(c,x+w/2-18,820-70,36,70,'#6a4a2a',INK,4)
    rect(c,0,950,WW,HH-950,lg(c,0,950,0,HH,[(0,'#c8a874'),(1,'#7a5a34')]));return s
def b_green():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,rg(WW/2,520,100,1500,[(0,'#2f8f64'),(1,'#0c2f28')]));return s
def b_office():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,lg(c,0,0,WW,0,[(0,'#6b5a74'),(1,'#3a3050')]))
    rect(c,0,860,WW,HH-860,lg(c,0,860,0,HH,[(0,'#7a5030'),(1,'#3a2214')]))
    for x in(200,800,1500):rect(c,x,180,300,420,lg(c,0,180,0,600,[(0,'#bfe6ff'),(1,'#6aa0d8')]),INK,8)
    return s
def b_blue():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,rg(WW/2,500,100,1500,[(0,'#2f6f9a'),(1,'#0d2438')]));return s
def b_red():
    s,c=surf(WW,HH);rect(c,0,0,WW,HH,rg(WW/2,500,100,1500,[(0,'#9a2f3a'),(1,'#2a0c14')]));return s
# ------------------------------------------------------------ characters / props
def bender(c,x,y,s,b,**k):
    k.setdefault('hl',(-130,-230));k.setdefault('hr',(130,-230))
    char(c,x,y,s,body='#23356b',skin='#fbf3df',boil=b,hat=None,**k)
    c.save();c.translate(x,y);c.scale(s,s);top=-440-132+18
    poly(c,[(-96,top-62),(96,top-62),(108,top+10),(-108,top+10)],lg(c,-100,0,100,0,[(0,'#ffffff'),(1,'#cfd6e8')]),INK,8)
    rect(c,-108,top-10,216,22,'#17121f',INK,4);poly(c,[(-108,top+12),(128,top+12),(150,top+34),(-108,top+34)],'#17121f',INK,5)
    circ(c,0,top-34,13,'#ffd23f',INK,3)
    poly(c,[(-16,-318),(16,-318),(10,-250),(-10,-250)],'#c52a22',INK,4)
    c.restore()
def folk(c,x,y,s,b,col,**k):
    k.setdefault('hl',(-120,-210));k.setdefault('hr',(120,-210));char(c,x,y,s,body=col,boil=b,**k)
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()
def pop(c,txt,u,x,y,size=120,col='#ffffff',rot=0,sw=18):
    if u<=0:return
    k=max(.02,eout(u/.18));c.save();c.translate(x,y);c.scale(k,k);text(c,txt,0,0,size,col,stroke=INK,sw=sw,rot=rot);c.restore()
def card(c,x,y,txt,u,w=900,h=150,fill='#fff6d8',tc=INK,size=64):
    k=eout(u)
    if k<=.02:return
    c.save();c.translate(x,y);c.scale(k,k);rect(c,-w/2,-h/2,w,h,fill,INK,10);text(c,txt,0,size*.36,size,tc);c.restore()
def bubble(c,x,y,w,h,u,fill='#ffffff',tail=1):
    k=eout(u)
    if k<=.02:return 0
    c.save();c.translate(x,y);c.scale(k,k);ell(c,0,0,w/2,h/2,fill)
    c.new_path();c.save();c.scale(w/2,h/2);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.stroke()
    poly(c,[(tail*w*.2,h*.4),(tail*w*.38,h*.8),(tail*w*.05,h*.46)],fill,INK,7);c.restore();return k
def phone(c,x,y,s,u,t,lines=None):
    c.save();c.translate(x,y);c.rotate(.06*math.sin(t*30)*(1 if u<.9 else 0));c.scale(s,s)
    rect(c,-120,-230,240,460,'#1c1c2a',INK,10);rect(c,-100,-196,200,380,lg(c,0,-196,0,184,[(0,'#6fb4ff'),(1,'#2a5ab0')]))
    circ(c,0,205,16,'#444444')
    for i,l in enumerate(lines or []):text(c,l,0,-80+i*70,46,'#ffffff',stroke=INK,sw=6)
    c.restore()
def book(c,x,y,s,col,title,year,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s)
    rect(c,-190,-270,380,540,lg(c,-190,0,190,0,[(0,shade(col,1.2)),(1,shade(col,.7))]),INK,10);rect(c,-190,-270,40,540,shade(col,.55),INK,6)
    for i,l in enumerate(title):text(c,l,10,-110+i*80,56,'#ffe9a8',stroke=INK,sw=6)
    text(c,year,10,190,70,'#ffffff',stroke=INK,sw=8);c.restore()
def knife(c,x,y,s,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);poly(c,[(-20,-200),(30,-200),(30,40),(-20,40)],lg(c,-20,0,30,0,[(0,'#ffffff'),(1,'#9aa6b8')]),INK,8);rect(c,-24,40,60,140,'#6a3a1a',INK,8);c.restore()
def xmark(c,x,y,s,u,col='#e02a2a',lw=26):
    k=eout(u)
    if k<=0:return
    c.set_source_rgba(*rgb(col));c.set_line_width(lw);c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.move_to(x-s,y-s);c.line_to(x-s+2*s*k,y-s+2*s*k);c.stroke();c.move_to(x+s,y-s);c.line_to(x+s-2*s*k,y-s+2*s*k);c.stroke()
def chessboard(c,x,y,s,rot=0,fade=1.0):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s)
    for i in range(8):
        for j in range(8):rect(c,-240+i*60,-240+j*60,60,60,'#f3e3bf' if (i+j)%2==0 else '#6a3a1a')
    rect(c,-240,-240,480,480,None,INK,10);c.restore()
def moneybag(c,x,y,s):
    c.save();c.translate(x,y);c.scale(s,s);ell(c,0,0,110,100,'#cfa55c');c.new_path();c.save();c.scale(110,100);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.stroke()
    poly(c,[(-46,-80),(46,-80),(30,-120),(-30,-120)],'#b48c4a',INK,7);text(c,'$',0,26,90,'#5a3a10');c.restore()
def clock2(c,x,y,r,t,ticks=True):
    circ(c,x,y,r,'#fff6d8',INK,10)
    for i in range(12):
        a=i/12*6.283;c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.move_to(x+r*.82*math.sin(a),y-r*.82*math.cos(a));c.line_to(x+r*.95*math.sin(a),y-r*.95*math.cos(a));c.stroke()
    for L,w,sp in ((r*.55,9,.3),(r*.8,6,3.6)):
        a=t*sp;c.set_source_rgba(*rgb('#c52a22' if w==6 else INK));c.set_line_width(w);c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(x,y);c.line_to(x+L*math.sin(a),y-L*math.cos(a));c.stroke()
    circ(c,x,y,10,INK)
def magnifier(c,x,y,s,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);circ(c,0,0,110,(.8,.95,1,.35),'#8a5a22',22);c.set_source_rgba(*rgb('#8a5a22'));c.set_line_width(30);c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(80,80);c.line_to(190,190);c.stroke();c.restore()
def globe(c,x,y,r):
    circ(c,x,y,r,rg(x-r*.3,y-r*.3,r*.1,r*1.1,[(0,'#7ad0ff'),(1,'#1e5aa8')]),INK,8)
    for dx,dy,w,h in((-.3,-.2,.45,.35),(.25,.25,.4,.3),(-.1,.45,.3,.2)):ell(c,x+dx*r,y+dy*r,w*r,h*r,'#4aa24a')
def head_big(c,x,y,s,b,**k):
    bender(c,x,y,s,b,**k)
def coins_rain(c,t,x0,x1,y0,y1,n=12,r=30,seed=1):
    rr=random.Random(seed)
    for i in range(n):
        x=rr.uniform(x0,x1);ph=rr.uniform(0,1);y=y0+((t*.4+ph)%1)*(y1-y0);coin(c,x+math.sin(t*3+i)*20,y,r,t*8+i)
def hdr(c,txt,u,y=150,size=88,col='#ffd23f'):
    k=max(.02,eout(u/.15));c.save();c.translate(W/2,y);c.scale(k,k);text(c,txt,0,0,size,col,stroke=INK,sw=16);c.restore()
def num_badge(c,x,y,n,u,r=60):
    k=eout(u)
    if k<=.02:return
    c.save();c.translate(x,y);c.scale(k,k);circ(c,0,0,r,'#ffd23f',INK,8);text(c,str(n),0,r*.38,r*1.2,INK);c.restore()
# ------------------------------------------------------------ shots   (screen coords: world = screen+OX,OY)
def X(x):return x+OX
def Y(y):return y+OY
def s_title(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.08*u);bg(c,'b_navy');bender(c,X(560),Y(1060),1.15,b,mouth='smirk',eyes='half',look=(.4,0),hl=(-190,-260),hr=(190,-380))
    phone(c,X(1380),Y(620),1.5,u,t,['×1,5','ЗА','МЕСЯЦ!']);c.restore()
    hdr(c,'ОСТАП БЕНДЕР:',u,140,110);hdr(c,'5 СХЕМ ЛЁГКИХ ДЕНЕГ',u-.08,270,110,'#ffffff')
def s_guar(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.05*u);bg(c,'b_navy');pop(c,'ГАРАНТИЯ!',u,W/2+OX,Y(560),230,'#ffd23f',-.05);c.restore()
def s_secret(c,u,t,b):
    c.save();cam(c,1100,620,1.05-.05*u);bg(c,'b_navy');clock2(c,X(560),Y(480),240,t*1.4);card(c,X(1340),Y(420),'ДО ВЕЧЕРА',u/.3,700,150,'#ffd23f');card(c,X(1340),Y(660),'ПО СЕКРЕТУ',(u-.35)/.3,700,150,'#ffffff');c.restore()
def s_street(c,u,t,b):
    c.save();cam(c,1100+80*u,620,1.0+.08*u);bg(c,'b_street');bender(c,X(500+500*u),Y(1060),1.4,b,mouth='smirk',look=(1,0),fl=(-42+30*math.sin(t*8),0),fr=(42-30*math.sin(t*8),0),hl=(-130,-230),hr=(180,-300));c.restore()
    pop(c,'1920-е',u,W/2,420,200,'#fff0cf',-.05)
def s_dream(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.06*u);bg(c,'b_street');bender(c,X(700),Y(1060),1.5,b,mouth='grin',eyes='normal',look=(.4,-.3),hr=(180,-380))
    bubble(c,X(1250),Y(380),700,360,u);moneybag(c,X(1250),Y(420),1.5);coins_rain(c,t,X(1000),X(1500),Y(300),Y(700),6,28)
    for i in range(3):folk(c,X(1480+i*190),Y(1080),.9,b,['#c0506e','#3b6fc9','#2f8f64'][i],mouth='grin',look=(-1,0),hl=(-120,-250),hr=(130,-230))
    c.restore()
def s_five(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();text(c,'ПЯТЬ СХЕМ БЕНДЕРА',W/2,200,96,'#ffd23f',stroke=INK,sw=16)
    names=['МЕЧТА','ВЫВЕСКА','ПИРАМИДА','СРОЧНОСТЬ','ГАРАНТИЯ']
    for i,nm in enumerate(names):
        k=(u-.12*i)/.2;x=190+i*385
        num_badge(c,x,420,i+1,k,70)
        card(c,x,640,nm,k,360,130,'#fff6d8',INK,40)
def s_books(c,u,t,b):
    c.save();cam(c,1100,620,1.0);bg(c,'b_navy');book(c,X(620),Y(560),1.05+.04*u,'#8a3a2a',['12','СТУЛЬЕВ'],'1928',-.06);book(c,X(1300),Y(560),1.05+.04*u,'#2a5a8a',['ЗОЛОТОЙ','ТЕЛЁНОК'],'1931',.06);c.restore()
    text(c,'ИЛЬФ И ПЕТРОВ',W/2,120,80,'#ffd23f',stroke=INK,sw=14)
def s_charm(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.1*u);bg(c,'b_street');bender(c,X(960),Y(1070),1.65,b,mouth='grin',eyes='normal',look=(0,-.2),hl=(-200,-300),hr=(200,-300),wink=True)
    for i in range(5):
        x=X(300+i*330);y=Y(260-((t*60+i*70)%200));text(c,'♥',x,y,80,'#ff4f8b',font='DejaVu Sans',stroke=INK,sw=6)
    c.restore()
def s_knife(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore()
    knife(c,540,520,1.8,.6);xmark(c,540,520,230,(u-.2)/.25);text(c,'НОЖ',540,900,90,'#ffffff',stroke=INK,sw=14)
    k=bubble(c,1380,470,640,330,(u-.5)/.25);text(c,'…',1380,560,200,INK) if k>.9 else None;text(c,'СЛОВО',1380,900,90,'#ffd23f',stroke=INK,sw=14) if u>.6 else None
def s_danger(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.04*u);bg(c,'b_street')
    folk(c,X(560),Y(1060),1.3,b,'#4a4a52',mouth='flat',eyes='half',brow=.8,hl=(-120,-250),hr=(180,-330));knife(c,X(740),Y(700),.8,.4)
    bender(c,X(1360),Y(1060),1.3,b,mouth='smirk',look=(-.4,0),hl=(-130,-230),hr=(190,-330));c.restore()
    card(c,540,200,'ВИДНО',u/.3,520,120,'#ffffff',INK,64);card(c,1380,200,'НЕ ВИДНО',(u-.4)/.3,620,120,'#ffd23f',INK,64)
def s_behind(c,u,t,b):
    c.save();cam(c,1100,620,1.0);bg(c,'b_navy');bubble(c,X(900),Y(500),900,480,1.0);text(c,'«ВЫГОДНО!»',X(900),Y(530),110,INK)
    mx=X(900)+(math.sin(t*1.5)*40);magnifier(c,mx,Y(520),2.0+.1*u,-.4);c.restore()
    text(c,'СМОТРИ НА ТО, ЧТО ЗА СЛОВАМИ',W/2,950,70,'#ffd23f',stroke=INK,sw=12)
def s_vas1(c,u,t,b):
    c.save();cam(c,1100-60*u,620,1.0+.06*u);bg(c,'b_town');chessboard(c,X(1350),Y(560),1.1,.05)
    rect(c,X(260),Y(250),620,180,'#fff6d8',INK,10);text(c,'ШАХМАТНЫЙ ТУРНИР',X(570),Y(360),66,'#c52a22')
    bender(c,X(1000),Y(1060),1.45,b,mouth='grin',look=(.3,-.2),hl=(-130,-230),hr=(190,-330));c.restore()
def s_vas2(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.06*u);bg(c,'b_town');
    for i,(x,y,w,h) in enumerate(((520,330,300,300),(1300,360,300,260),(900,200,300,200))):
        pass
    ell(c,X(960),Y(400),520,300,(1,1,1,.9));globe(c,X(960),Y(400),180);chessboard(c,X(1380),Y(420),.7,.1);text(c,'СТОЛИЦА МИРА!',X(960),Y(190),110,'#ffd23f',stroke=INK,sw=14)
    bender(c,X(560),Y(1060),1.4,b,mouth='grin',look=(.4,-.5),hl=(-130,-230),hr=(180,-380));
    for i in range(3):folk(c,X(1180+i*220),Y(1090),.9,b,['#c0506e','#3b6fc9','#2f8f64'][i],mouth='open',eyes='wide',look=(-.5,-.4),hl=(-120,-250),hr=(130,-250))
    c.restore()
def s_vas3(c,u,t,b):
    c.save();cam(c,1100,620,1.0);bg(c,'b_town')
    bender(c,X(1500),Y(1070),1.4,b,mouth='grin',look=(-1,0),hl=(-130,-230),hr=(130,-230))
    for i in range(4):
        x=X(300+i*190);folk(c,x,Y(1090),.95,b,['#c0506e','#3b6fc9','#2f8f64','#8c4fbf'][i],mouth='smirk',look=(1,0),hl=(-120,-210),hr=(130,-260))
        p=(u*1.6-i*.15)%1.0;coin(c,x+130+(X(1380)-x-130)*p,Y(700)-math.sin(p*3.14)*120,30,t*8+i)
    c.restore()
def s_vas4(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.05*u);bg(c,'b_town');chessboard(c,X(800),Y(560),1.1,0);pop(c,'ПУСТО',(u-.1)/.3,X(800),Y(560),170,'#ff4f5e',-.12)
    bender(c,X(1500+300*max(0,u-.4)),Y(1070),1.4,b,mouth='smirk',look=(1,0),hl=(-130,-230),hr=(130,-230),fl=(-42+30*math.sin(t*8),0),fr=(42-30*math.sin(t*8),0));moneybag(c,X(1350+300*max(0,u-.4)),Y(930),1.0);c.restore()
def s_vas5(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();phone(c,540,560,2.0,u,t,['ВЛОЖИСЬ!','ИЗМЕНИТ','ВСЁ']);k=bubble(c,1300,470,720,330,(u-.4)/.25)
    text(c,'РАСЧЁТ: 0',1300,500,100,'#c52a22') if k>.9 else None
def s_rule1(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore();text(c,'ПРАВИЛО: ПРОСИ ЦИФРЫ',W/2,160,88,'#ffd23f',stroke=INK,sw=16)
    for i,w in enumerate(['ОТКУДА ДЕНЬГИ?','КТО ПЛАТИТ?','СКОЛЬКО?','КОГДА?']):card(c,W/2,330+i*170,w,(u-.18*i)/.2,900,140,'#fff6d8',INK,64)
def sign_rk(c,x,y,s,u=1):
    c.save();c.translate(x,y);c.scale(s,s);rect(c,-460,-110,920,220,lg(c,0,-110,0,110,[(0,'#2a5a8a'),(1,'#15305a')]),INK,12);text(c,'РОГА И КОПЫТА',0,28,100,'#ffe9a8',stroke=INK,sw=8);c.restore()
def s_rog1(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.08*u);bg(c,'b_street');rect(c,X(360),Y(380),1200,700,'#9a7a5a',INK,12)
    for i in range(3):rect(c,X(440+i*360),Y(520),240,320,'#ffe7a8',INK,8)
    rect(c,X(870),Y(740),180,340,'#4a2a14',INK,8);sign_rk(c,X(960),Y(300),1.0+.05*u);c.restore()
def s_rog2(c,u,t,b):
    c.save();bg(c,'b_office');c.restore()
    circ(c,520,520,120,'#c52a22',INK,10);text(c,'ПЕЧАТЬ',520,540,48,'#ffffff');
    for i in range(3):c.save();c.translate(960+i*60,470+i*30);c.rotate(-.1+i*.08);rect(c,-120,-150,240,300,'#fff6d8',INK,8);c.restore()
    text(c,'БЛАНКИ',1010,860,60,'#ffffff',stroke=INK,sw=10)
    pop(c,'РАБОТЫ НЕТ',(u-.3)/.3,W/2,230,110,'#ffd23f');pop(c,'ТОВАРА НЕТ',(u-.55)/.3,W/2,960,110,'#ff7a7a')
def s_rog3(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.05*u);bg(c,'b_office');rect(c,X(500),Y(760),1000,70,'#8c5a2e',INK,8)
    bender(c,X(960),Y(960),1.3,b,mouth='smirk',eyes='half',look=(0,.2),hl=(-120,-230),hr=(120,-230))
    folk(c,X(430),Y(1020),1.0,b,'#555566',mouth='flat',hat='top',eyes='wide');folk(c,X(1500),Y(1020),1.0,b,'#664455',mouth='flat',hat='bowler',eyes='wide');c.restore()
def s_rog4(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore();rect(c,260,220,1400,640,'#e8f0ff',INK,12);rect(c,260,220,1400,90,'#3a5a9a',INK,12);text(c,'rogaikopyta.biz',W/2,282,50,'#ffffff')
    text(c,'МЫ — ЛИДЕР РЫНКА!',W/2,520,100,'#17121f');rect(c,520,640,880,150,'#fff6d8',INK,10);text(c,'«ЛИЦЕНЗИЯ»',W/2,745,80,'#8a6a2a')
    pop(c,'?',(u-.5)/.3,1720,230,240,'#ff4f5e')
def s_rog5(c,u,t,b):
    c.save();bg(c,'b_green');c.restore();text(c,'ОТКУДА ДОХОД?',W/2,160,96,'#ffd23f',stroke=INK,sw=16)
    card(c,460,520,'НОВЫЕ ВКЛАДЧИКИ',u/.3,640,170,'#ffffff',INK,48);card(c,1460,520,'ВЫВЕСКА',(u-.4)/.3,520,170,'#ffd23f',INK,56)
    for i in range(4):
        p=(t*.5+i*.25)%1;coin(c,720+p*520,520,36,t*9+i)
    pop(c,'ЕСЛИ НЕТ ОТВЕТА — ЭТО ВЫВЕСКА',(u-.65)/.3,W/2,860,72,'#ff7a7a',0)
def s_pyr1(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore();text(c,'ПРИВЁЛ ДРУГА — ПОЛУЧИЛ ДЕНЬГИ',W/2,150,76,'#ffd23f',stroke=INK,sw=14)
    for lv in range(4):
        n=2**lv;k=eout((u-.2*lv)/.25)
        for j in range(n):
            x=W/2+(j-(n-1)/2)*(1300/max(n,2))*(1 if n>1 else 0);y=300+lv*190
            if k>0:circ(c,x,y,44*min(1,k),'#fff6d8',INK,6);text(c,'☺',x,y+16,50,INK,font='DejaVu Sans') if k>.8 else None
def s_pyr2(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore()
    for lv in range(8):
        k=eout((u*8-(7-lv))/1.2);n=2**lv;w=40+(7-lv)*100
        if k>0:rect(c,W/2-w/2,820-lv*85,w*k,70,lg(c,0,0,W,0,[(0,'#ffe78a'),(1,'#e08a2a')]) if lv<7 else '#ff4f5e',INK,6) if False else rect(c,W/2-w*k/2,820-lv*85,w*k,70,'#ffe78a' if lv<7 else '#ff7a5a',INK,6)
    text(c,'УРОВНИ ПИРАМИДЫ',W/2,130,84,'#ffd23f',stroke=INK,sw=14)
def s_pyr3(c,u,t,b):
    c.save();bg(c,'b_green');c.restore();k=ease(u/.8);n=int(8589934592*k)
    txt=f'{n:,}'.replace(',',' ');text(c,txt,W/2,520,190,'#ffd23f',stroke=INK,sw=18);text(c,'33-Й УРОВЕНЬ НУЖНО:',W/2,260,80,'#ffffff',stroke=INK,sw=12);text(c,'ЧЕЛОВЕК',W/2,700,90,'#ffffff',stroke=INK,sw=14)
def s_pyr4(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore();globe(c,540,520,220);text(c,'≈ 8 МЛРД',540,860,100,'#ffffff',stroke=INK,sw=14);text(c,'ЛЮДЕЙ НА ЗЕМЛЕ',540,170,66,'#ffd23f',stroke=INK,sw=12)
    k=eout((u-.35)/.3)
    if k>0:
        c.save();c.translate(1380,540);c.scale(k,k);rect(c,-340,-200,680,400,'#ff7a5a',INK,12);text(c,'8,6 МЛРД',0,40,110,INK);text(c,'НУЖНО',0,-100,70,INK);c.restore()
def s_pyr5(c,u,t,b):
    c.save();bg(c,'b_red');c.restore()
    for lv in range(7):
        w=40+(6-lv)*130;col='#ffe78a' if lv<6 else '#ff4f5e';y=820-lv*90;sh=(u>.4)*(lv*12*math.sin(t*20)*(u-.4))
        rect(c,W/2-w/2+sh,y+(u>.6)*(u-.6)*160*(lv%3),w,78,col,INK,6)
    text(c,'ПОСЛЕДНИЕ ТЕРЯЮТ ВСЁ',W/2,150,90,'#ffffff',stroke=INK,sw=16)
def s_pyr6(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();text(c,'ПЛАТЯТ ЗА ПРИВЕДЁННЫХ,',W/2,380,92,'#ffd23f',stroke=INK,sw=16);text(c,'А НЕ ЗА ТОВАР —',W/2,520,92,'#ffd23f',stroke=INK,sw=16)
    pop(c,'ЭТО ПИРАМИДА',(u-.3)/.3,W/2,760,150,'#ff4f5e',-.04)
def s_urg1(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.1*u);bg(c,'b_street');bender(c,X(800),Y(1070),1.6,b,mouth='smirk',look=(.8,0),hl=(-130,-230),hr=(150,-520));folk(c,X(1480),Y(1090),1.3,b,'#3b6fc9',mouth='o',eyes='wide',look=(-1,0),hl=(-120,-230),hr=(130,-230));c.restore()
    pop(c,'«ПО СЕКРЕТУ»',(u-.1)/.3,W/2,230,110,'#ffffff')
def s_urg2(c,u,t,b):
    c.save();cam(c,1100,620,1.0);bg(c,'b_navy');clock2(c,X(1450),Y(420),200,t*2);folk(c,X(640),Y(1060),1.5,b,'#3b6fc9',mouth='o',eyes='wide',look=(.6,0),sweat=u,hl=(-140,-380),hr=(140,-330));c.restore()
    card(c,540,200,'ТОРОПИТСЯ',u/.3,640,130,'#ffd23f');card(c,1380,880,'НЕ ПРОВЕРЯЕТ',(u-.5)/.3,720,130,'#ff7a7a')
def s_urg3(c,u,t,b):
    c.save();bg(c,'b_red');c.restore()
    for i,(tx,y,rot) in enumerate((('ОСТАЛОСЬ 3 МЕСТА',250,-.03),('АКЦИЯ ДО ПОЛУНОЧИ',520,.03),('НИКОМУ НЕ ГОВОРИТЕ',790,-.02))):
        k=eout((u-.25*i)/.2)
        if k>0:c.save();c.translate(W/2,y);c.rotate(rot);c.scale(k,k);rect(c,-640,-90,1280,180,'#ffd23f',INK,12);text(c,tx,0,34,86,INK);c.restore()
def s_urg4(c,u,t,b):
    c.save();bg(c,'b_green');c.restore();text(c,'ПОДОЖДЁТ СУТКИ',W/2,200,110,'#ffd23f',stroke=INK,sw=18)
    rect(c,560,300,800,560,'#fff6d8',INK,12);rect(c,560,300,800,110,'#c52a22',INK,12);text(c,'24 ЧАСА',W/2,640,170,INK)
    pop(c,'НЕЛЬЗЯ ЖДАТЬ — УХОДИ',(u-.45)/.3,W/2,980,80,'#ff7a7a')
def s_gar1(c,u,t,b):
    c.save();bg(c,'b_green');c.restore();pop(c,'10% В МЕСЯЦ',u,W/2,420,250,'#ffd23f');text(c,'ЗВУЧИТ СКРОМНО?',W/2,760,100,'#ffffff',stroke=INK,sw=16) if u>.4 else None
def s_gar2(c,u,t,b):
    c.save();bg(c,'b_green');c.restore();rect(c,300,860,1320,12,'#ffffff')
    for i,(lab,v) in enumerate((('СТАРТ',100),('3 МЕС',133),('6 МЕС',177),('12 МЕС',314))):
        k=ease((u-.12*i)/.4);h=v*2.2*k;x=380+i*340
        rect(c,x,860-h,200,h,'#ff8a5a' if i==3 else '#ffe78a',INK,8);text(c,lab,x+100,930,44,'#ffffff',stroke=INK,sw=7);text(c,str(v),x+100,860-h-30,70,'#ffffff',stroke=INK,sw=10)
    text(c,'100 → 314 ЗА ГОД',W/2,150,96,'#ffd23f',stroke=INK,sw=16)
def s_gar3(c,u,t,b):
    c.save();bg(c,'b_red');c.restore();text(c,'50% В МЕСЯЦ',W/2,240,110,'#ffd23f',stroke=INK,sw=18);k=ease(u/.8)
    text(c,'×'+str(int(1+129*k)),W/2,640,330,'#ffffff',stroke=INK,sw=22);text(c,'ЗА ГОД',W/2,860,90,'#ffd23f',stroke=INK,sw=14)
def s_gar4(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.06*u);bg(c,'b_navy');pop(c,'ТАКИХ ДЕНЕГ',u,W/2,420,180,'#ffffff');pop(c,'НЕ БЫВАЕТ',(u-.25),W/2,640,180,'#ff4f5e');c.restore()
def s_gar5(c,u,t,b):
    c.save();bg(c,'b_red');c.restore();
    k=eout(u/.3);c.save();c.translate(560,540);c.scale(k,k);rect(c,-12,-300,24,600,'#dddddd',INK,8);poly(c,[(12,-300),(460,-200),(12,-100)],'#ff2a2a',INK,10);c.restore()
    text(c,'КРАСНЫЙ ФЛАГ',W/2,200,100,'#ffffff',stroke=INK,sw=16) if False else None
    text(c,'ГАРАНТИЯ ВЫСОКОГО ДОХОДА',1200,880,64,'#ffffff',stroke=INK,sw=12);text(c,'= КРАСНЫЙ ФЛАГ',1200,970,80,'#ffd23f',stroke=INK,sw=14)
QS=[('1','ОТКУДА ДОХОД,','КРОМЕ ДЕНЕГ НОВЫХ ЛЮДЕЙ?'),('2','МОЖНО ЗАБРАТЬ ДЕНЬГИ','И ПРОВЕРИТЬ ДОКУМЕНТЫ?'),('3','ПЛАТЯТ ЗА ТОВАР —','ИЛИ ЗА ПРИВЕДЁННЫХ ДРУЗЕЙ?'),('4','МОЖНО ПОДУМАТЬ СУТКИ','И СПРОСИТЬ СОВЕТА?'),('5','ОБЕЩАНА ГАРАНТИЯ','ВЫСОКОГО ДОХОДА?')]
def mkq(i):
    def f(c,u,t,b):
        c.save();bg(c,'b_blue');c.restore();text(c,'ВОПРОС БЕНДЕРУ',W/2,150,84,'#ffd23f',stroke=INK,sw=14);num_badge(c,W/2,400,QS[i][0],u/.2,110)
        text(c,QS[i][1],W/2,640,90,'#ffffff',stroke=INK,sw=14);text(c,QS[i][2],W/2,770,90,'#ffffff',stroke=INK,sw=14)
        for j in range(5):circ(c,W/2-160+j*80,930,16,'#ffd23f' if j<=i else (1,1,1,.25),INK,4)
    return f
def s_out(c,u,t,b):
    c.save();bg(c,'b_red');c.restore();pop(c,'ЕСЛИ «ДА» НА ПОСЛЕДНИЙ —',u,W/2,420,90,'#ffffff');pop(c,'УХОДИТЕ',(u-.35),W/2,640,230,'#ffd23f')
def s_gen(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.08*u);bg(c,'b_navy');bender(c,X(960),Y(1070),1.7,b,mouth='grin',eyes='normal',look=(0,-.2),hl=(-190,-300),hr=(190,-300),wink=True);c.restore()
    text(c,'ГЕНИЙ КРАСИВЫХ СЛОВ',W/2,140,92,'#ffd23f',stroke=INK,sw=16)
def s_recap(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();names=['МЕЧТА','ВЫВЕСКА','ПИРАМИДА','СРОЧНОСТЬ И ТАЙНА','ГАРАНТИЯ']
    text(c,'5 СХЕМ БЕНДЕРА',W/2,150,96,'#ffd23f',stroke=INK,sw=16)
    for i,n in enumerate(names):
        k=(u-.14*i)/.18;num_badge(c,330,290+i*150,i+1,k,52);card(c,1050,290+i*150,n,k,1000,110,'#fff6d8',INK,52)
def s_only(c,u,t,b):
    c.save();cam(c,1100,620,1.0+.06*u);bg(c,'b_red');pop(c,'«ТОЛЬКО СЕГОДНЯ',u,W/2,420,140,'#ffffff');pop(c,'И ТОЛЬКО ВАМ»',(u-.2),W/2,600,140,'#ffffff');xmark(c,W/2,510,420,(u-.55)/.2,'#ffd23f',30);c.restore()
def s_ask(c,u,t,b):
    c.save();bg(c,'b_blue');c.restore();text(c,'С КАКОЙ ИЗ 5 СХЕМ',W/2,300,100,'#ffd23f',stroke=INK,sw=16);text(c,'ВЫ СТАЛКИВАЛИСЬ?',W/2,430,100,'#ffd23f',stroke=INK,sw=16)
    for i in range(5):num_badge(c,330+i*315,700,i+1,(u-.3-.08*i)/.15,80)
    pop(c,'НАПИШИТЕ ЦИФРУ В КОММЕНТАРИЯХ',(u-.6),W/2,930,64,'#ffffff')
def s_sub(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();bender(c,W/2-500,1020,1.3,b,mouth='grin',look=(.5,0),hl=(-130,-230),hr=(190,-380))
    k=eout(u/.25);c.save();c.translate(W/2+260,500);c.scale(max(.02,k),max(.02,k));rect(c,-420,-120,840,240,'#e02a2a',INK,12);text(c,'ПОДПИСАТЬСЯ',0,32,96,'#ffffff');c.restore()
    text(c,'СЛЕДУЮЩИЕ ИСТОРИИ ГЕРОЕВ',W/2+260,780,60,'#ffffff',stroke=INK,sw=10)
def s_end(c,u,t,b):
    c.save();bg(c,'b_navy');c.restore();text(c,'ДЕНЬГИ ГЕРОЕВ',W/2,480,170,'#ffd23f',stroke=INK,sw=20);text(c,'Не финансовая рекомендация, а объяснение принципа.',W/2,700,54,'#ffffff',stroke=INK,sw=8)
# ------------------------------------------------------------ timeline
st=lambda g:T[g]['start']
cuts=[(0,'title',s_title,0),(1,'guar',s_guar,1),(2,'secret',s_secret,1),(3,'street',s_street,1),(5,'dream',s_dream,1),(6,'five',s_five,1),
 (8,'books',s_books,1),(9,'charm',s_charm,1),(10,'knife',s_knife,1),(12,'danger',s_danger,1),(13,'behind',s_behind,1),
 (14,'vas1',s_vas1,1),(15,'vas2',s_vas2,1),(16,'vas3',s_vas3,1),(17,'vas4',s_vas4,1),(19,'vas5',s_vas5,1),(21,'rule1',s_rule1,1),
 (24,'rog1',s_rog1,1),(25,'rog2',s_rog2,1),(27,'rog3',s_rog3,1),(28,'rog4',s_rog4,1),(29,'rog5',s_rog5,1),
 (32,'pyr1',s_pyr1,1),(34,'pyr2',s_pyr2,1),(35,'pyr3',s_pyr3,1),(36,'pyr4',s_pyr4,1),(37,'pyr5',s_pyr5,1),(39,'pyr6',s_pyr6,1),
 (40,'urg1',s_urg1,1),(41,'urg2',s_urg2,1),(43,'urg3',s_urg3,1),(44,'urg4',s_urg4,1),
 (46,'gar1',s_gar1,1),(48,'gar2',s_gar2,1),(49,'gar3',s_gar3,1),(50,'gar4',s_gar4,1),(51,'gar5',s_gar5,1),
 (53,'q1',mkq(0),1),(54,'q2',mkq(1),1),(55,'q3',mkq(2),1),(56,'q4',mkq(3),1),(57,'q5',mkq(4),1),(58,'out',s_out,1),
 (59,'gen',s_gen,1),(60,'recap',s_recap,1),(61,'only',s_only,1),(62,'ask',s_ask,1),(64,'sub',s_sub,1),(65,'end',s_end,1)]
e=313.4
SH_LIST=[];
for k,(g,name,fn,wh) in enumerate(cuts):
    a=0 if k==0 else st(g)-.03
    b_=e if k==len(cuts)-1 else st(cuts[k+1][0])-.03
    if name=='end':a=T[-1]['end']+.3
    SH_LIST.append((name,a,b_,fn,wh))
SH_LIST[-2]=(SH_LIST[-2][0],SH_LIST[-2][1],SH_LIST[-1][1],SH_LIST[-2][3],SH_LIST[-2][4])
# word captions straight from alignment (1-2 words at a time)
SMALLW={'—','и','в','во','на','с','со','к','а','но','по','не','за','у','от','до','из','о','об','же','ли','что','как','это','ты','ей','он','она','то','вы','вам','нас','нет','да'}
CAP=[];i=0
while i<len(WD):
    w=WD[i];txt=w['w'];s0=w['s'];e0=w['e']
    if txt.lower().strip('«»,.!?:—') in SMALLW and i+1<len(WD) and WD[i+1]['s']-w['e']<.5:
        txt+=' '+WD[i+1]['w'];e0=WD[i+1]['e'];i+=1
    nxt=WD[i+1]['s'] if i+1<len(WD) else e0+.3
    CAP.append([s0,max(e0,min(nxt,s0+1.2)),txt]);i+=1
MUSIC_STOP=('guar','secret')
def CUES(f,d):
    f['ding'](d['title'][1]+1.9,1560,.3)
    f['thud'](d['vas4'][1]+.5,.4);f['ding'](d['vas3'][1]+.3,1320,.25)
    f['thud'](d['pyr5'][1]+.5,.5);f['ding'](d['gar2'][1]+.6,1560,.3);f['thud'](d['urg3'][1]+.2,.35);f['thud'](d['gar5'][1]+.2,.4)
