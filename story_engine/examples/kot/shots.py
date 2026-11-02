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
def coin(c,x,y,r,rot=0):
    c.save();c.translate(x,y);c.scale(max(.15,abs(math.cos(rot))),1);circ(c,0,0,r,lg(c,-r,-r,r,r,[(0,'#ffe78a'),(1,'#c8912e')]),INK,r*.1+2);circ(c,0,0,r*.68,(0,0,0,0),(.45,.27,.05,1),r*.06);c.restore()

# ---- Cat (Perrault) - original design on char()
def hut():
    s,c=surf();rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#b9803f'),(1,'#6e4220')]))
    for y in range(0,1720,170):rect(c,0,y,SW,170,None,'#3d2410',3)
    rect(c,820,300,360,420,lg(c,0,300,0,720,[(0,'#cfeeff'),(1,'#74b4ea')]),INK,12);rect(c,990,300,12,420,INK);rect(c,820,500,360,12,INK)
    c.save();c.set_operator(cairo.OPERATOR_ADD);circ(c,1000,520,700,rg(1000,520,30,700,[(0,(1,.85,.5,.55)),(1,(1,.6,.2,0))]));c.restore()
    sets.planks(c,0,SW,1720,SH,10,700)
    return blur(s,1.2)
def sack(c,x,y,s=1,full=0,t=0):
    c.save();c.translate(x,y);c.scale(s,s)
    c.move_to(-130,0);c.curve_to(-190,-150,-120,-260,-50,-300);c.line_to(50,-300);c.curve_to(120,-260,190,-150,130,0);c.close_path()
    c.set_source(lg(c,-150,0,150,0,[(0,'#e2bd80'),(1,'#9a6f38')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke()
    poly(c,[(-58,-296),(58,-296),(70,-340),(30,-318),(0,-352),(-30,-318),(-70,-340)],'#c99a58',INK,8)
    c.set_source_rgba(*rgb('#c52a22'));c.set_line_width(12);c.move_to(-60,-292);c.line_to(60,-292);c.stroke()
    if full:
        for i in range(int(full)):coin(c,-50+(i%3)*50,-330-(i//3)*10,24,t*3+i)
    c.restore()
def cat(c,x,y,s,t,b,hatc='#c52a22',tailw=0,**k):
    c.save();c.translate(x,y);c.scale(s,s)
    gray='#8d8a99'
    c.set_source_rgba(*rgb(gray));c.set_line_width(34);c.set_line_cap(cairo.LINE_CAP_ROUND)
    sw=math.sin(t*5)*30*tailw
    c.move_to(-50,-200);c.curve_to(-200,-180,-250+sw,-330,-190+sw,-470);c.stroke()
    c.set_source_rgba(*rgb(INK));c.set_line_width(8);c.set_dash([]);
    for sg in(-1,1):
        poly(c,[(sg*38,-545),(sg*112,-700),(sg*128,-520)],lg(c,0,-700,0,-520,[(0,'#aaa7b8'),(1,gray)]),INK,10)
        poly(c,[(sg*58,-555),(sg*106,-662),(sg*112,-545)],'#f0a3b4',None)
    c.restore()
    char(c,x,y,s,body='#7b3fb5',skin='#f1ece4',boil=b,**k)
    c.save();c.translate(x,y);c.scale(s,s)
    tl=k.get('tilt',0);c.rotate(tl)
    lx,ly=k.get('look',(0,0))
    # nose, whiskers
    poly(c,[(-13+lx*4,-418),(13+lx*4,-418),(lx*4,-400)],'#ef7a93',INK,5)
    c.set_source_rgba(*rgb(INK));c.set_line_width(5)
    for sg in(-1,1):
        for dy in(-14,6,26):
            c.move_to(sg*50,-400+dy*.4);c.line_to(sg*168,-400+dy*1.6);c.stroke()
    # hat with feather
    poly(c,[(-74,-548),(74,-548),(56,-624),(-56,-624)],lg(c,0,-624,0,-548,[(0,hatc),(1,shade(hatc,.6))]),INK,9)
    rect(c,-76,-560,152,22,'#ffd23f',INK,5)
    c.set_source_rgba(1,1,1,1);c.set_line_width(12);c.move_to(30,-610);c.curve_to(130,-690,190,-640,170,-560);c.stroke()
    c.set_source_rgba(*rgb(INK));c.set_line_width(4);c.move_to(30,-610);c.curve_to(130,-690,190,-640,170,-560);c.stroke()
    c.restore()
    # tall boots
    fl,fr=k.get('fl',(-42,0)),k.get('fr',(42,0));c.save();c.translate(x,y);c.scale(s,s)
    for f in(fl,fr):
        poly(c,[(f[0]-24,f[1]-120),(f[0]+24,f[1]-120),(f[0]+30,f[1]-10),(f[0]+58,f[1]+8),(f[0]-30,f[1]+8)],lg(c,0,f[1]-120,0,f[1],[(0,'#8a5a2e'),(1,'#4a2b12')]),INK,7)
        poly(c,[(f[0]-34,f[1]-150),(f[0]+34,f[1]-150),(f[0]+40,f[1]-112),(f[0]-40,f[1]-112)],'#b98a4a',INK,6)
    c.restore()
def hook(c,txt,u):
    k=max(.02,eout(u/.12));c.save();c.translate(W/2,340);c.scale(k,k)
    for i,l in enumerate(txt):text(c,l,0,i*125,112,'#ffd23f',stroke=INK,sw=22)
    c.restore()
def dark(c,cx=W/2,cy=620):rect(c,0,0,W,H,rg(cx,cy,100,1300,[(0,'#2f8f64'),(1,'#0c2f28')]))
def purple(c):rect(c,0,0,W,H,rg(W/2,700,100,1400,[(0,'#6a46c4'),(1,'#1a1048')]))
# ---- shots
def s_hook(c,u,t,b):
    c.save();cam(c,700,1330-80*u,.98+.2*u);bg(c,'meadow')
    cat(c,780,2020,1.45,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-170,-300),hr=(170,-300),tailw=1)
    sack(c,330,2020,.9,0,t)
    c.restore();hook(c,['НЕТ ДЕНЕГ','НА СТАРТ?'],u)
def s_wide(c,u,t,b):
    c.save();cam(c,760-60*u,1480,.82+.16*u);bg(c,'meadow')
    st=math.sin(t*7)
    cat(c,760,2060,1.1,t,b,mouth='flat',eyes='half',look=(.4,0),hl=(-120,-210),hr=(130,-210),fl=(-42+st*14,0),fr=(42-st*14,0),tailw=1)
    sack(c,400,2060,.8,0,t)
    c.restore()
    text(c,'ВСЁ ИМУЩЕСТВО',W/2,330,84,'#ffffff',stroke=INK,sw=14) if u>.25 else None
def s_sackm(c,u,t,b):
    sx,sy=shake(t,4,2);c.save();cam(c,700+sx,1500+sy,1.55+.18*u,-.02);bg(c,'meadow')
    sack(c,700,2100,2.2,0,t)
    c.restore();k=eout(u/.3);c.save();c.translate(W/2,520);c.scale(k,k);text(c,'ПУСТО',0,0,230,'#ff4f5e',stroke=INK,sw=24,rot=-.06);c.restore()
def s_promise(c,u,t,b):
    rect(c,0,0,W,H,lg(c,0,0,0,H,[(0,'#14285f'),(1,'#0b153b')]));k=max(.02,eout(u/.25))
    c.save();c.translate(W/2,600);c.scale(k,k);rect(c,-300,-180,600,420,'#ffd23f',INK,12);text(c,'30',0,50,230,INK);text(c,'СЕКУНД',0,180,70,INK);c.restore()
    if u>.3:text(c,'И ПЛАН',W/2,1050,120,'#ffd23f',stroke=INK,sw=14)
def s_son(c,u,t,b):
    cam(c,700,1400,.92+.12*u);bg(c,'hut')
    char(c,430,2060,1.2,body='#3b6fc9',hat=None,mouth='flat',eyes='half',look=(.5,.5),boil=b,hl=(-110,-170),hr=(110,-170),brow=-.6)
    cat(c,960,2060,.95,t,b,mouth='smirk',look=(-.6,0),hl=(-120,-210),hr=(120,-210),tailw=1)
def s_catface(c,u,t,b):
    sx,sy=shake(t,3);cam(c,700+sx,1370+sy,1.7+.2*u,.02*math.sin(t*3));bg(c,'hut')
    cat(c,700,2300,2.0,t,b,mouth='smirk',eyes='wide',look=(0,.1),hl=(-160,-120),hr=(160,-120),tailw=1)
def s_boots(c,u,t,b):
    cam(c,740,1900-60*u,1.9+.2*u,.04);bg(c,'meadow')
    st=math.sin(t*10)
    cat(c,740,2060,1.5,t,b,mouth='grin',look=(0,0),fl=(-42+st*20,0),fr=(42-st*20,0),hl=(-150,-230),hr=(150,-230))
def s_walk(c,u,t,b):
    x=-60+1500*u;cam(c,x+80,1450,1.0);bg(c,'meadow');st=math.sin(t*12)
    sack(c,x-150,2050,.75,0,t)
    cat(c,x,2060,1.12,t,b,mouth='smirk',look=(1,0),fl=(-42+st*40,0),fr=(42-st*40,0),hl=(-90,-330),hr=(150,-250),tailw=1)
def s_plan(c,u,t,b):
    purple(c);k=max(.02,eout(u/.2));c.save();c.translate(W/2,640);c.rotate(-.06+.02*math.sin(t*3));c.scale(k,k)
    rect(c,-330,-320,660,640,'#fff6d8',INK,12)
    for i in range(3):
        circ(c,-230,-190+i*150,22,'#c52a22',INK,5);rect(c,-170,-205+i*150,380*(.6+.4*math.sin(i)),30,'#17121f')
    c.restore();text(c,'ПЛАН',W/2,1190,200,'#ffd23f',stroke=INK,sw=20) if u>.3 else None
def s_goal(c,u,t,b):
    dark(c);k=max(.05,eout(u/.25));text(c,'ЦЕЛЬ',W/2,420,150,'#ffffff',stroke=INK,sw=18)
    c.save();c.translate(W/2,820);c.scale(k,k);text(c,'60',0,150,420,'#ffd23f',stroke=INK,sw=30);c.restore()
    for i in range(8):coin(c,150+i*115,1180+math.sin(t*4+i)*18,46,t*8+i)
def s_term(c,u,t,b):
    dark(c,W/2,700);text(c,'СРОК',W/2,360,150,'#ffffff',stroke=INK,sw=18)
    for i in range(6):
        on=u*7>i+.4;x=150+(i%3)*270;y=500+(i//3)*330
        rect(c,x,y,230,270,'#fff6d8' if on else (1,1,1,.12),INK,8)
        if on:rect(c,x,y,230,70,'#c52a22',INK,8);text(c,str(i+1),x+115,y+195,150,INK)
    text(c,'6 МЕС',W/2,1330,170,'#ffd23f',stroke=INK,sw=20) if u>.6 else None
def s_ten(c,u,t,b):
    dark(c,W/2,800)
    k=max(.05,eout(u/.2));c.save();c.translate(W/2,520);c.scale(k,k);text(c,'60 ÷ 6',0,0,230,'#ffffff',stroke=INK,sw=20);c.restore()
    k2=max(.05,eout((u-.3)/.2));c.save();c.translate(W/2,900);c.scale(k2,k2);text(c,'= 10',0,0,330,'#ffd23f',stroke=INK,sw=26);text(c,'В МЕСЯЦ',0,160,140,'#ffffff',stroke=INK,sw=16);c.restore()
    sack(c,W/2,1480,1.0,6,t)
    for i in range(3):coin(c,W/2-60+i*60,1000+((t*500+i*160)%420),40,t*9+i)
def s_someday(c,u,t,b):
    c.save();cam(c,700,1340,.95+.1*u);bg(c,'meadow')
    cat(c,700,2040,1.15,t,b,mouth='flat',eyes='half',look=(0,-.5),hl=(-200,-240),hr=(200,-240),tilt=.05*math.sin(t*6),tailw=.5)
    c.restore();c.save();c.translate(W/2,430);c.rotate(-.05);text(c,'«КОГДА-НИБУДЬ»',0,0,92,'#ffffff',stroke=INK,sw=14)
    k=eout(u/.4);c.set_source_rgba(*rgb('#ff3b4e'));c.set_line_width(22);c.move_to(-340,-26);c.line_to(-340+680*k,-26);c.stroke();c.restore()
def s_exact(c,u,t,b):
    dark(c,W/2,700);k=max(.05,eout(u/.25));c.save();c.translate(W/2,560);c.scale(k,k)
    rect(c,-330,-250,660,500,'#fff6d8',INK,12);rect(c,-330,-250,660,110,'#c52a22',INK,12);text(c,'1 ЧИСЛО',0,-170,70,'#ffffff');text(c,'10',0,110,300,INK);c.restore()
    if u>.4:text(c,'СУММА + ДАТА',W/2,1040,120,'#ffd23f',stroke=INK,sw=16)
def s_rule(c,u,t,b):
    purple(c)
    for i,(w,col) in enumerate((('1. ЦЕЛЬ','#fff6d8'),('2. СРОК','#fff6d8'),('3. СУММА','#ffd23f'))):
        k=max(.05,eout((u-.1-i*.22)/.15));c.save();c.translate(W/2,430+i*250);c.scale(k,k);rect(c,-380,-95,760,190,col,INK,10);text(c,w,0,38,100,INK);c.restore()
def s_pay(c,u,t,b):
    c.save();cam(c,700,1330,1.0+.14*u);bg(c,'meadow')
    cat(c,820,2040,1.25,t,b,mouth='grin',eyes='normal',look=(-.6,0),hl=(-150,-260),hr=(150,-290),tailw=1)
    sack(c,380,2040,1.0,int(2+u*6),t)
    for i in range(4):coin(c,430+i*70,1000+((t*500+i*150)%700),42,t*9+i)
    c.restore()
    k=eout(u/.2);c.save();c.translate(W/2,420);c.rotate(.08*math.sin(t*5));c.scale(k,k);rect(c,-200,-110,400,220,'#fff6d8',INK,10);text(c,'ПОЛУЧКА',0,20,84,'#2a8f4e');c.restore()
def s_ask(c,u,t,b):
    sx,sy=shake(t,3);cam(c,700+sx,1360+sy,1.35+.2*u);bg(c,'meadow')
    cat(c,700,2150,1.6,t,b,mouth='open',eyes='wide',look=(0,-.3),hl=(-210,-250),hr=(210,-250),tailw=1)
def s_ask2(c,u,t,b):
    purple(c);k=max(.05,eout(u/.2));c.save();c.translate(W/2,700);c.scale(k,k)
    text(c,'ВАША',0,-120,170,'#ffffff',stroke=INK,sw=18);text(c,'ПЕРВАЯ ЦЕЛЬ?',0,60,118,'#ffd23f',stroke=INK,sw=18);c.restore()
    text(c,'ПИШИТЕ В КОММЕНТАРИИ',W/2,1050,62,'#ffffff',stroke=INK,sw=12) if u>.4 else None
def s_next(c,u,t,b):
    cam(c,700,1310,.92+.08*u);bg(c,'winter');rect(c,0,0,SW,SH,(.05,.03,.2,.35))
    char(c,700,2040,1.06,body='#8c4fbf',hat='top',mst='#2a1810',boil=b,mouth='smirk',look=(.5,-.2),hl=(-130,-250),hr=(170,-500))
    text(c,'ЗАВТРА',700,640,120,'#ffd23f',stroke=INK,sw=16);text(c,'ДОН КИХОТ',700,790,130,'#ffffff',stroke=INK,sw=16)
st=lambda i:T[i]['start']
e=T[-1]['end']+.4
PLAN=[(0,[('h1',s_hook)]),(1,[('wide',s_wide),('sackm',s_sackm)]),(2,[('promise',s_promise)]),(3,[('son',s_son),('catface',s_catface)]),(4,[('boots',s_boots),('walk',s_walk),('plan',s_plan)]),(5,[('goal',s_goal),('term',s_term)]),(6,[('ten',s_ten)]),(7,[('someday',s_someday),('exact',s_exact)]),(8,[('rule',s_rule)]),(9,[('pay',s_pay)]),(10,[('ask',s_ask),('ask2',s_ask2)]),(11,[('next',s_next)])]
SH_LIST=[]
for i,fns in PLAN:
    a=0 if i==0 else st(i)-.03;b=e if i==11 else st(i+1)-.03;n=len(fns)
    for j,(nm,fn) in enumerate(fns):SH_LIST.append((nm,a+(b-a)*j/n,a+(b-a)*(j+1)/n,fn,1 if j==0 else 0))
CAPTIONS=["Нет денег на старт?","У Кота в сапогах не было ничего, кроме мешка.","Через полминуты — с чего начать.","Младшему сыну достался только кот.","Кот не ныл. Взял сапоги, мешок и составил план.","Три числа: цель 60, срок 6 месяцев.","Значит, 10 в месяц.","Не «когда-нибудь», а точная сумма и дата.","Правило: цель, срок, сумма.","Откладывай в день получки.","Ваша первая финансовая цель? Напишите!","Завтра — Дон Кихот. Подпишись, чтобы не пропустить."]
CAP=make_caps(T,CAPTIONS)
MUSIC_STOP=('promise','rule')
def CUES(f,d):
    for i in range(5):f['tick'](d['h1'][1]+i*.22,.3,3000)
    f['ding'](d['promise'][1]+.1,1320,.25)
    f['thud'](d['sackm'][1]+.1,.4)
    f['ding'](d['plan'][1]+.15,880,.3)
    f['thud'](d['goal'][1]+.2,.4)
    f['ding'](d['ten'][1]+.45,1560,.34)
    for i in range(3):f['tick'](d['rule'][1]+.3+i*.5,.4,1800+i*200)
    f['tick'](d['someday'][1]+.3,.4,900)
    f['ding'](d['pay'][1]+.2,1320,.3)
