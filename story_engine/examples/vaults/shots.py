from flow import *
import json
T=json.load(open('timing.json'))
e=T[-1]['end']+.8
ROB=dict(body='#3b4470',hat='bowler',bandana='#c9362b',rim='#ffe6b4')
ROB2=dict(body='#7a3fb0',hat='cowboy',bandana='#2f6d9c',rim='#ffe6b4')
CASH=dict(body='#e7e2f0',rim='#ffe6b4')
BANK=dict(body='#2f8f5b',hat='top',mst='#3a2414',bow='#ffd23f',rim='#ffe6b4')
HACK=dict(body='#20243a',rim='#74f0c8')
HENCH=dict(body='#e5892a',hat='bowler',bandana='#23304f',rim='#ffe6b4')
VIGNETTE=.16;GRAIN=0;CURVE=.16
KEYS=[(0,-560,-430,1000,-.05),(2.2,-500,-270,1300,0),(3.6,60,-170,1750,.03),(5.2,360,-130,2450,0),(6.25,400,-110,3060,0),
(6.9,-470,70,3090,-.02),(7.6,-240,-200,3400,0),(8.4,-200,-200,3450,.01),(9.1,320,140,3200,.02),(10.2,340,150,3300,0),(11,560,-60,3560,0),
(11.6,640,-130,3950,0),(12.4,0,-60,4790,0),(13.6,0,-30,4950,.02),(14.2,20,-30,4960,0),(14.8,2380,-60,4900,-.02),(15.8,2400,-60,4980,0),
(16.9,2400,-60,5380,0),(17.35,2400,-60,5660,0),(18.6,2400,-60,5790,.03),(19.2,2400,-60,5500,0),(19.75,2400,-30,4900,0),(20.4,2360,-30,4890,0),
(21.2,1800,70,4950,-.02),(22.2,2000,130,5100,0),(23.8,2000,130,5150,.02),(24.4,1400,-30,4650,0),(25.15,1400,-20,4690,0),(25.35,1400,-20,4660,0),
(27,1480,-160,3650,0),(28.58,1480,-200,3400,-.01),(28.62,6000,-40,4000,0),(30.2,6080,-20,4150,.02),(31.3,6000,-20,4560,0),(32.5,6200,50,4350,0),(33.6,6180,60,4300,-.02),
(34.3,6000,-80,4200,0),(35.2,6000,-200,3650,0),(36.6,6000,-200,3800,0),(38.9,6000,-180,4000,0),(39.9,6000,-200,4560,0),(40.7,6000,-200,4620,0),
(41.6,5850,-60,4350,0),(42.6,5800,-30,4400,0),(43.4,5650,60,4600,0),(44.1,5650,280,5100,0),(44.35,5650,300,5550,0),(44.45,5650,160,5620,0),(45.2,5650,120,5900,0),
(46,5640,195,6270,0),(47.2,5640,60,7380,.05),(47.6,5640,0,7500,0),(48.5,5640,40,7820,0),(49.8,5660,-120,7500,0),(51.2,5640,-120,7420,0),(51.9,7100,-80,7900,.01),(53.3,7100,-80,8240,0),(e+.2,7100,-80,8290,0)]
camat=path(KEYS)
PH=[p['start'] for p in T]
# ---------- props
def stars(c,cam):
    def f():
        r=random.Random(4)
        for i in range(70):circ(c,r.uniform(-6000,6000),r.uniform(-9000,-2600),r.uniform(14,34),(1,1,1,.85))
        circ(c,700,-5200,1000,rg(420,-5500,60,1100,[(0,'#fffbe6'),(1,'#e8dcb4')]),'#00000000',0)
    on(c,cam,9000,f)
def hills(c,cam):
    def f():
        for i,(x,w,h) in enumerate([(-1500,900,520),(-300,1100,420),(900,900,620),(2000,1000,460)]):
            c.move_to(x-w,560);c.curve_to(x-w*.4,560-h,x+w*.4,560-h,x+w,560);c.close_path();c.set_source_rgba(*rgb('#6f8fa6' if i%2 else '#7f9fb0'));c.fill()
    on(c,cam,5500,f)
def building(c,cam,x0,x1,top,d,sign=None,col='#c98f5c',roof='#8c3f2e',holes=(),door=True):
    def f():
        wall(c,x0,x1,top,520,lg(c,0,top,0,520,[(0,shade(col,1.05)),(1,shade(col,.78))]),rects=holes)
        poly(c,[(x0-40,top),(x1+40,top),(x1-40,top-120),(x0+40,top-120)],roof,INK,6)
        if door:rect(c,(x0+x1)/2-70,340,140,180,'#5b3620',INK,5)
        if sign:
            rect(c,(x0+x1)/2-180,top+26,360,104,'#f1dfae',INK,6);text(c,sign,(x0+x1)/2,top+108,84,'#3a2312',font='DejaVu Serif')
    on(c,cam,d,f)
def char3(c,cam,x,y,d,s=1,shadowa=.28,**k):
    k.setdefault('shadow',False)
    def f():
        ell(c,x,y,118*s,24*s,(0,0,0,shadowa));char(c,x,y,s,**k)
    on(c,cam,d,f)
def wallclock(c,x,y,R,minute,hour,sw):
    rect(c,x-R*.75,y-R*1.1,R*1.5,R*3,'#6c4122',INK,5);clock(c,x,y-R*.1,R*.66,minute=minute,hour=hour,glow=False)
    a=sw*.3;bx,by=x+math.sin(a)*R*1.05,y+R*.8+math.cos(a)*R*.7
    c.set_source_rgba(*rgb('#e3b54c'));c.set_line_width(7);c.move_to(x,y+R*.6);c.line_to(bx,by);c.stroke();circ(c,bx,by,R*.17,'#e3b54c',INK,4)
def digits(c,x,y,s,col='#ffd23f',rot=0):
    text(c,s,x,y,110,col,stroke=INK,sw=14,rot=rot)
def bottle(c,x,y,s=1,tilt=0,lab='SOUP'):
    c.save();c.translate(x,y);c.rotate(tilt);c.scale(s,s)
    poly(c,[(-22,-230),(22,-230),(26,-160),(82,-70),(82,0),(-82,0),(-82,-70),(-26,-160)],'#ffffff30','#17121f',8)
    poly(c,[(-76,-74),(76,-74),(76,-4),(-76,-4)],'#ffd45a');poly(c,[(-44,-120),(44,-120),(76,-74),(-76,-74)],'#ffe27e')
    rect(c,-24,-258,48,30,'#7b4e2a',INK,5)
    rect(c,-62,-70,124,52,'#f4e8c8',INK,4);text(c,lab,0,-30,36,'#7b2317')
    c.restore()
def old_safe(c,cam,x,d,yb,w=250,h=430,broken=0):
    x0,x1=x-w,x+w;box(c,cam,x0,x1,yb-h*2,yb,d,d+380,lg(c,0,0,0,1,[(0,'#5a6170'),(1,'#5a6170')]) and '#5a6170','#3a3f4c','#6f7787',line=INK,lw=5)
    def f():
        if broken:
            rect(c,x0+30,yb-h*2+30,2*w-60,2*h-60,'#1a151d',INK,5)
        else:
            rect(c,x0+40,yb-h*2+40,2*w-80,2*h-80,'#737c8e',INK,6);circ(c,x+40,yb-h,60,'#c3cbd6',INK,6)
            text(c,'SAFE',x,yb-h*2+140,74,'#e4d59e',font='DejaVu Serif')
    on(c,cam,d,f)
def room(c,cam,x0,x1,top,y,d0,d1,wallc=('#d2a371','#a97b4e'),holes=(),rects=(),fl=None):
    qd(c,cam,[(x0,top,d0),(x1,top,d0),(x1,top,d1),(x0,top,d1)],'#5a3d27',INK,3)
    qd(c,cam,[(x0,top,d0),(x0,top,d1),(x0,y,d1),(x0,y,d0)],shade(wallc[1],.84),INK,3)
    qd(c,cam,[(x1,top,d0),(x1,top,d1),(x1,y,d1),(x1,y,d0)],shade(wallc[1],.9),INK,3)
    floor(c,cam,x0,x1,y,d0,d1,**(fl or {}))
    on(c,cam,d1,lambda:wall(c,x0,x1,top,y,lg(c,0,top,0,y,[(0,wallc[0]),(1,wallc[1])]),holes=holes,rects=rects,lw=3))
# ---------- scenes
def s_night(c,cam,t,ts):
    sky(c,'#2a4d9c','#4f79c9','#b4c2e0',cam);stars(c,cam);hills(c,cam)
    floor(c,cam,-3200,3200,520,cam.z+60,6400,cols=('#8f8a7c','#9c9686','#837e72'),n=10,seams=False)
    bwx=(-1000,-260)
    def bank():
        building(c,cam,*bwx,-250,2400,sign='BANK',col='#b9b0a0',roof='#5f6a7a')
    # far: vault room seen through the back window, then street
    if t>10.6:s_vault(c,cam,t,ts)
    if t<12.2 and cam.z<4700:
        on(c,cam,4700,lambda:wall(c,-1800,3000,-1200,520,lg(c,0,-1200,0,520,[(0,'#b5a489'),(1,'#90816b')]),holes=[(0,-60,300*min(1,max(.02,ease((t-11.2)/.8))))]))
    if t<3.4 or cam.z<2400:bank()
    # robbers walk past the bank, not looking at it
    if cam.z<2250 and t<6:
        k=min(1,t/5.6);xr=-620+1000*k;st=math.sin(ts*9)
        char3(c,cam,xr,520,2500,1.0,boil=int(ts*15)%3,mouth='smirk',look=(1,0),fl=(-42+st*28,0),fr=(42-st*28,0),hl=(-90,-300),hr=(120,-250),**ROB)
        char3(c,cam,xr-300,520,2500,1.0,boil=int(ts*15)%3+1,mouth='flat',look=(1,0),fl=(-42-st*28,0),fr=(42+st*28,0),hr=(90,-300),**ROB2)
    # bedroom interior: only visible through the window until the camera is inside
    if t<12.2 and cam.z>1500:
        if cam.z<3000:
            a=P(cam,280,-280,3000);b=P(cam,520,60,3000);c.save();c.rectangle(a[0],a[1],b[0]-a[0],b[1]-a[1]);c.clip();s_bed(c,cam,t,ts);c.restore()
        else:s_bed(c,cam,t,ts)
    if cam.z<2980:
        def house():
            wall(c,-260,1120,-470,520,lg(c,0,-470,0,520,[(0,'#c96f4a'),(1,'#8f4631')]),rects=[(280,-280,520,60)])
            poly(c,[(-320,-470),(1180,-470),(1020,-760),(-160,-760)],'#6a3227',INK,6)
            rect(c,-120,240,170,280,'#4a2c1a',INK,5)
            c.set_source_rgba(*rgb('#e7c67a'));c.set_line_width(14)
            c.rectangle(280,-280,240,340);c.stroke();c.move_to(400,-280);c.line_to(400,60);c.move_to(280,-110);c.line_to(520,-110);c.stroke()
        on(c,cam,3000,house)
        on(c,cam,3000,lambda:glow(c,400,-110,420,(1,.72,.32),.5*max(0,min(1,(2800-cam.z)/500))))
def s_bed(c,cam,t,ts):
    room(c,cam,-900,920,-640,430,3000,3900,wallc=('#7c9bb0','#587386'),rects=[(520,-300,780,50)])
    def back():
        c.set_source_rgba(*rgb('#e7c67a'));c.set_line_width(14);c.rectangle(520,-300,260,350);c.stroke()
        stop=t>7.75
        wallclock(c,-240,-260,130,0 if not stop else 0,4,0.0 if stop else math.sin(ts*5.5))
        if t>7.75 and t<8.6:text(c,'STOP',-240,-470,74,'#ff6a4a',stroke='#ffffff',sw=10)
    on(c,cam,3895,back)
    # lamp glow
    on(c,cam,3700,lambda:glow(c,70,-180,500,(1,.75,.35),.45))
    # bed
    box(c,cam,-780,-170,250,430,3620,3880,'#6c4122','#4a2c16','#d9c8b0')
    def sleeper():
        c.save();c.translate(-430,250);c.rotate(-1.5);char(c,0,0,.5,shadow=False,eyes='wide' if t>6.6 else 'half',mouth='o' if t>6.6 else 'flat',boil=int(ts*15)%3,**CASH);c.restore()
        rect(c,-420,190,250,80,'#8a3f4e',INK,5)
    on(c,cam,3618,sleeper)
    # chair and cashier, robbers around
    if t>7:
        box(c,cam,210,490,60,430,3550,3790,'#6c4122','#4a2c16','#8a5a2c')
        char3(c,cam,350,430,3540,.82,boil=int(ts*15)%3,sweat=(ts*1.8)%1,mouth='open' if int(ts*6)%2 else 'o',eyes='wide',look=(0,-.3),hl=(-70,-140),hr=(70,-140),**CASH)
        def cuffs():
            for sx in(-1,1):
                c.set_source_rgba(*rgb('#c9ced6'));c.set_line_width(7);circ(c,350+sx*57,315,16,None,'#c9ced6',6)
        on(c,cam,3539,cuffs)
        char3(c,cam,60,430,3500,.95,boil=int(ts*15)%3+1,mouth='flat',look=(1,0),brow=1,hl=(-90,-230),hr=(135,-300),**ROB)
        char3(c,cam,650,430,3500,.95,boil=int(ts*15)%3+2,mouth='flat',look=(-1,0),brow=1,hl=(-135,-300),hr=(90,-230),**ROB2)
    if 9.7<t<12.1:
        k=(t-9.7)/2.2
        def dig():
            digits(c,350+k*290,-130+math.sin(ts*8)*10,'36-24-8',rot=.05*math.sin(ts*5))
        on(c,cam,3640+k*700,dig)
def s_vault(c,cam,t,ts):
    # one big vault hall. Bags at x=0, the new door at x=2400, the safe at x=1300
    room(c,cam,-850,3700,-820,430,4700,5620,wallc=('#b6ab94','#8c8270'),fl=dict(cols=('#a39a88','#8f8775','#b0a795'),n=18,line='#4b4639'))
    def back():
        for sx in(-420,420):
            rect(c,sx-270,-420,540,20,'#6c4122',INK,4);rect(c,sx-270,-60,540,20,'#6c4122',INK,4)
        # sun patch at dawn
        for i in range(10):
            ti=12.45+i*.14
            if t<ti:
                bag(c,-620+(i%5)*300,-420 if i<5 else -60,.95)
        if 13.1<t<14.3:
            k=eout((t-13.1)/.35);text(c,'-$1,600,000',0,-430,96+(1-k)*50,'#ffd23f',stroke=INK,sw=16)
    on(c,cam,5615,back)
    if 12<t<14.1:
        kk=(t-12.5)/1.6;st=math.sin(ts*12)
        char3(c,cam,-200+kk*880,430,5350,.82,boil=int(ts*15)%3,mouth='grin',look=(1,0),fl=(-42+st*26,0),fr=(42-st*26,0),hl=(-120,-210),hr=(130,-150),**ROB)
        on(c,cam,5349,lambda:bag(c,-200+kk*880+150,395,.75))
    if t>12.6:
        # the safe, left of the new door
        if t<25.25:old_safe(c,cam,1300,5230,430)
        else:old_safe(c,cam,1300,5230,430,broken=1)
    if t>12.6 and t<28.5:
        spin=0 if t<18.8 else (t-18.8)*1.2 if t<19.8 else .4*math.sin((t-19.8)*18)*.25+1.2
        if t<25.3:
            # mechanism behind the keyhole
            if cam.z>4920 and 16<t<19.6:
                def mech():
                    rect(c,1600,-900,1600,1700,rg(2400,-60,120,950,[(0,'#6b4414'),(1,'#1c120a')]))
                    gear(c,2110,-300,260,18,ts*.9,col='#d29a3c');gear(c,2720,120,300,22,-ts*.75,col='#b5772a');gear(c,2720,-430,170,12,ts*1.3,col='#e0b050')
                on(c,cam,6500,mech)
                def faces():
                    for i,x in enumerate((2210,2400,2590)):
                        clock(c,x,-60,86,minute=(ts*40+i*17)%60,hour=9,glow=False,num=False,rimc='#e8b53e')
                    text(c,'9:00',2400,-210,70,'#ffd23f',stroke=INK,sw=11)
                on(c,cam,6000,faces)
            on(c,cam,5610,lambda:rdoor(c,2400,-60,470,ts,spin,hole=max(0,(130 if 16<t<19.45 else 0))))
    if 14.2<t<16.2:
        k=eout((t-14.45)/.4);char3(c,cam,2000,430,5230,.95,boil=int(ts*15)%3,mouth='grin',look=(1,0),hr=(150,-420*k-120),hl=(-120,-210),**BANK)
        on(c,cam,5229,lambda:clock(c,2000+142,430-(420*k+120)*.95-70,76,minute=(ts*30)%60,hour=9,glow=False,num=False))
    if 19.3<t<20.8:
        st=math.sin(ts*18)*12
        char3(c,cam,2400,430,5400,1.0,boil=int(ts*15)%3,mouth='open',eyes='wide',sweat=(ts*2)%1,look=(0,-.4),fl=(-70,0),fr=(70,0),hl=(-80+st,-400),hr=(80+st,-400),**BANK)
    if 20.3<t<25.25:
        # robber sneaks in with the soup
        kk=min(1,max(0,(t-20.3)/1.2));xr=1350+500*kk;dr=5400;tilt=-.12*math.sin(ts*4)
        pos=dict(hr=(150,-270),hl=(-110,-220));bx=xr+150;by=200;bs=.92
        if t>23.95:
            k2=ease((t-23.95)/.4);xr=1850-210*k2;dr=5400-200*k2;tilt=-1.3*k2;bx=xr+150*(1-k2)+130*k2;by=200-200*k2;bs=.92-.12*k2
            pos=dict(hr=(150,-270-140*k2),hl=(-110,-220))
        if t>24.85:
            xr=1640+(t-24.85)*2600;tilt=0;bx=xr+150;by=200
        char3(c,cam,xr,430,dr,1.0,boil=int(ts*15)%3,mouth='smirk' if t<24.85 else 'yell',eyes='normal' if t<24.85 else 'wide',look=(1 if t<23.95 else -1,0),**pos,**ROB)
        on(c,cam,dr-1,lambda:bottle(c,bx,by,bs,tilt))
        if 24.3<t<24.85:
            def drip():
                for i in range(5):
                    yy=-40+((ts*520+i*60)%340);ell(c,1565,yy,9,15,'#ffd45a')
            on(c,cam,5190,drip)
    if t>25.2 and t<28.6:
        age=t-25.25
        if age>0:
            if age>.5:
                def fl():
                    glow(c,1300,200,1100,(1,.55,.2),.7);flame(c,1000,430,2.4,ts,1);flame(c,1620,430,2.8,ts,2);flame(c,1300,430,1.8,ts,3)
                on(c,cam,5400,fl)
            on(c,cam,5225,lambda:blast(c,1300,-40,560,age))
            # the safe door flies at the camera
            dz=5230-age*2100;dx=1300+age*120;dy=-40-age*90
            if dz-cam.z>60:
                def fdoor():
                    c.save();c.translate(dx,dy);c.rotate(age*7);rect(c,-210,-270,420,540,'#737c8e',INK,8);circ(c,30,0,60,'#c3cbd6',INK,6);c.restore()
                on(c,cam,dz,fdoor)
def s_front(c,cam,t,ts):
    """the bank's street front during the blast; camera backs out through it"""
    if cam.z>4700:return
    k=max(0,t-26.25)
    def fw():
        # wall with a hole that grows when the front falls
        hole=[(650,-500,2300,520)] if k>0 else [(1040,-300,1900,300)]
        wall(c,-400,3400,-850,520,lg(c,0,-850,0,520,[(0,'#c9a17a'),(1,'#976f4e')]),rects=hole)
        rect(c,1200,-820,560,150,'#f1dfae',INK,8);text(c,'BANK',1480,-700,110,'#3a2312',font='DejaVu Serif')
    if k==0:on(c,cam,4700,fw)
    else:
        on(c,cam,4700,fw)
        r=random.Random(3)
        for i in range(16):
            x0=660+i*110;x=x0+r.uniform(-70,70)*k;y=-380+r.uniform(-90,700)*.2+760*k*k*r.uniform(.6,1.2);ro=k*r.uniform(-4,4)
            def pc(x=x,y=y,ro=ro):
                c.save();c.translate(x,y);c.rotate(ro);rect(c,-70,-55,140,110,'#b3875f',INK,5);c.restore()
            if y<640:on(c,cam,4700-40*i%200-k*120,pc)
def s_street(c,cam):
    sky(c,'#2f418c','#6b5fa8','#e0a184',cam);hills(c,cam)
    floor(c,cam,-1200,5200,520,max(cam.z+60,3000),4700,cols=('#8f8a7c','#9c9686','#837e72'),n=10,seams=False)
def s_ball(c,cam,t,ts):
    sky(c,'#7dc4ea','#b2e1f4','#fbeed1',cam)
    room(c,cam,4700,7300,-900,430,3800,6300,wallc=('#d8bf95','#ad9068'),fl=dict(cols=('#c98f55','#d39a60','#b98249'),n=16))
    def back():
        for x in(5100,6900):
            rect(c,x-180,-560,360,470,'#a9d8ef',INK,6);c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.move_to(x,-560);c.line_to(x,-90);c.stroke()
    on(c,cam,6295,back)
    roll=eout((t-28.7)/1.3);bx=6000+(1-roll)*1100;ang=(1-roll)*-6.5
    def ball():
        ell(c,bx,430,430,60,(0,0,0,.3))
        rect(c,bx-180,330,360,100,'#6c4122',INK,6) if roll>.98 else None
        sphere(c,bx,10,420)
        dx,dy=math.sin(ang)*240,math.cos(ang)*-40
        vis=math.cos(ang)
        if vis>0:
            c.save();c.translate(bx+dx,10+dy);c.scale(max(.15,vis),1)
            circ(c,0,0,190,lg(c,-190,-190,190,190,[(0,'#f2f6f9'),(1,'#71808f')]),INK,9)
            s=ease((t-30.9)/1.6)*5.2 if t>30.9 else 0
            for i in range(12):
                a=s+i/12*6.2832;c.set_source_rgba(*rgb('#3b444f'));c.set_line_width(8);c.move_to(150*math.cos(a),150*math.sin(a));c.line_to(182*math.cos(a+.25),182*math.sin(a+.25));c.stroke()
            for i in range(3):
                a=s*.6+i/3*6.2832;c.set_source_rgba(*rgb('#2f3640'));c.set_line_width(18);c.move_to(0,0);c.line_to(84*math.cos(a),84*math.sin(a));c.stroke();circ(c,84*math.cos(a),84*math.sin(a),17,'#ffd23f',INK,3)
            circ(c,0,0,30,'#ffd23f',INK,4);c.restore()
        if roll>.98:
            rect(c,bx-340,-510,250,90,'#f1dfae',INK,5);text(c,'3,500 LBS',bx-215,-446,46,'#3a2312')
    on(c,cam,5000,ball)
    if t>31.7:
        k=min(1,(t-31.7)/.8);xr=6370+(1-k)*500+math.sin(ts*2)*2
        tilt=-1.2*ease((t-32.1)/.4) if t>32.1 else 0
        char3(c,cam,xr-40,430,4800,1.0,boil=int(ts*15)%3,mouth='open' if t>33.3 else 'smirk',eyes='wide' if t>33.3 else 'normal',look=(-1,-.3),hl=(-140,-430),hr=(90,-230),**ROB)
        on(c,cam,4799,lambda:bottle(c,xr-40-180,-10,.85,tilt))
        if t>32.45:
            def poured():
                for i in range(7):
                    u=(ts*1.5+i/7)%1;px=6140-u*16+math.sin(i)*4;py=-30+u*u*450
                    ell(c,px,py,9,16,'#ffd45a')
                ell(c,6120,428,170,18,'#ffd45a')
            on(c,cam,4790,poured)
def s_door(c,cam,t,ts,crown=False):
    sky(c,'#8ed0ee','#c0e8f6','#fff3d8',cam)
    room(c,cam,3900,8100,-1500,430,3000,6000,wallc=('#b6ab94','#8c8270'),fl=dict(cols=('#a39a88','#8f8775','#b0a795'),n=18,line='#4b4639'))
    on(c,cam,5995,lambda:rdoor(c,6000,-400,800,ts,ts*.12))
    if crown:
        qd(c,cam,[(5600,240,5597),(5700,240,5597),(5700,420,5597),(5600,420,5597)],'#25283a',INK,5)
        on(c,cam,5596,lambda:circ(c,5650,330,62,'#050507','#c7cdd8',8))
        qd(c,cam,[(5640,424,4950),(5660,424,4950),(5660,424,5597),(5640,424,5597)],'#1a1d2a')
        char3(c,cam,6000,430,5400,.96,boil=int(ts*15)%3,mouth='grin',look=(0,0),hl=(-160,-400),hr=(160,-400),**BANK)
        on(c,cam,5399,lambda:poly(c,[(5905,-190),(5915,-260),(5955,-215),(6000,-285),(6045,-215),(6085,-260),(6095,-190)],'#ffd23f',INK,5))
        char3(c,cam,5340,430,5150,1.0,boil=int(ts*15)%3+1,mouth='flat',eyes='half' if t<42.9 else 'wide',look=(.8,0) if t<42.9 else (1,.8),hl=(-110,-210),hr=(120,-210),**ROB)
        on(c,cam,5149,lambda:bottle(c,5340-160,430,.6))
def s_hiro(c,cam,t,ts):
    sky(c,'#a78f7c','#caa98f','#ecd3ae',cam)
    def far():
        c.rectangle(3000,-260,6000,1200);c.set_source_rgba(*rgb('#8e7b69'));c.fill()
        r=random.Random(5)
        for i in range(10):
            x=r.uniform(3700,8400);h=r.uniform(60,270);w=r.uniform(70,170)
            poly(c,[(x-w,-250),(x-w*.7,-250-h),(x-w*.1,-250-h*.6),(x+w*.4,-250-h*.9),(x+w,-250)],'#65554a')
    on(c,cam,7400,far)
    floor(c,cam,2800,9200,430,cam.z+60,6400,cols=('#a8957f','#a2907a','#ab9882'),n=14,seams=False,line='#a08e78')
    op=ease((t-39.2)/.7) if t>39.2 else 0
    def d():
        ell(c,6000,430,700,48,(0,0,0,.38))
        box_t=-400
        rect(c,5120,-1280,1760,1710,lg(c,0,-1280,0,430,[(0,'#6f675d'),(1,'#544d44')]),INK,10)
        circ(c,6000,-400,810,'#1c1610',INK,10)
        if op>0:
            circ(c,6000,-400,780,rg(6000,-400,50,800,[(0,'#ffd98a'),(1,'#7a5420')]))
            for i in range(5):
                for j in range(3):
                    bag(c,5620+i*190,-120-j*170,.95)
            glow(c,6000,-400,820,(1,.8,.45),.4*op)
        c.save();c.translate(6000-op*780,-400);c.scale(1-op*.82,1);rdoor(c,0,0,800,ts,0,steel=('#c7c2b8','#858076','#4d4a44'));c.restore()
    def stubs():
        poly(c,[(3900,430),(3920,-360),(4160,-250),(4300,-420),(4560,-120),(4700,430)],'#6d6054',INK,6)
        poly(c,[(7300,430),(7420,-200),(7640,-420),(7880,-300),(8100,430)],'#6d6054',INK,6)
    on(c,cam,6100,stubs)
    on(c,cam,6000,d)
    r=random.Random(11)
    def ash():
        for i in range(24):
            x=r.uniform(5000,7000);y=(r.uniform(-1000,500)+ts*40*(1+i%3))%1500-1000
            circ(c,x+math.sin(ts+i)*20,y,r.uniform(3,8),(.95,.9,.82,.7))
    on(c,cam,5300,ash)
def s_hack(c,cam,t,ts):
    if t<45.88:
        rect(c,-300,-300,W+600,H+600,'#141a2c')
        room(c,cam,4800,6500,-300,430,5620,6900,wallc=('#2a3350','#1a2238'),fl=dict(cols=('#303853','#29314b','#364061'),n=10,line='#151b30'))
        char3(c,cam,5640,430,6500,1.25,boil=int(ts*15)%3,mouth='smirk',eyes='half',look=(0,.6),hl=(-120,-210),hr=(120,-210),**HACK)
        def hood():
            pass
        box(c,cam,5300,5980,340,430,6300,6450,'#5b3c28','#3d2819','#6c4730')
        def lap():
            rect(c,5390,60,500,280,'#0a1a14','#9ca7ba',14)
            c.save();c.rectangle(5400,70,480,260);c.clip()
            r=random.Random(int(ts*15))
            for i in range(9):
                text(c,''.join(r.choice('$01ATM#') for _ in range(18)),5640,92+i*27,24,'#6dffb4',font='DejaVu Sans Mono',bold=False)
            c.restore()
        on(c,cam,6300,lap)
        on(c,cam,6298,lambda:glow(c,5640,195,620,(.3,1,.7),.45))
    else:
        rect(c,-300,-300,W+600,H+600,rg(W/2,H/2,20,1100,[(0,'#b7ffdb') if t>46.9 else (0,'#0d4c35'),(1,'#02140f')]))
        for i in range(14):
            dd=6400+i*110+(0)
            if dd-cam.z<70:continue
            def ring(i=i,dd=dd):
                s=str((ts*9+i)%1)
                circ(c,5640,120,420,None,(.42,1,.72,.75),8);r=random.Random(i)
                for j in range(8):
                    a=j/8*6.2832+i*.5+ts;text(c,r.choice(('$','01','10','ATM','$$')),5640+350*math.cos(a),120+350*math.sin(a),56,'#a7ffd0',font='DejaVu Sans Mono')
            on(c,cam,dd,ring)
def s_atm(c,cam,t,ts):
    sky(c,'#5cb7ec','#a9def5','#fff1cf',cam);hills(c,cam)
    def bg():
        wall(c,6300,8100,-850,520,lg(c,0,-850,0,520,[(0,'#d3b48f'),(1,'#9c7e5e')]),rects=[(6650,-430,7550,240)])
        rect(c,6800,-760,600,160,'#f1dfae',INK,8);text(c,'BANK',7100,-632,118,'#3a2312',font='DejaVu Serif')
    # vault room behind the bank window
    if cam.x>6200:
        room(c,cam,6300,8000,-650,430,8520,9600,wallc=('#b6ab94','#8c8270'),fl=dict(cols=('#a39a88','#8f8775','#b0a795'),n=12,line='#4b4639'))
        def dr():
            rdoor(c,7100,-90,500,ts,0)
            c.set_source_rgba(1,1,1,.8);c.set_line_width(3)
            for i in range(9):
                c.move_to(6600,-650+i*18);c.curve_to(6680,-610+i*12,6750,-580+i*10,6800-i*20,-650);c.stroke()
        on(c,cam,9590,dr)
        pol=math.sin(ts*5)*90
        char3(c,cam,7380,430,9100,.95,boil=int(ts*15)%3,mouth='smirk',eyes='half',look=(-1,0),hl=(-210+pol,-320),hr=(70,-220),**BANK)
    on(c,cam,8500,bg)
    floor(c,cam,3800,9000,520,max(cam.z+60,7000),8500,cols=('#a9a397','#b5afa3','#9e998d'),n=14,seams=False,line='#6d6859')
    sp=t>47.7
    for i,x in enumerate((5040,5640,6240-0)):
        box(c,cam,x-230,x+230,-280,520,8200,8420,lg(c,0,-280,0,520,[(0,'#3f79b9'),(1,'#264e80')]) and '#3567a3','#27507f','#4b84c0',lw=5)
        def face(x=x):
            rect(c,x-160,-210,320,190,'#0a1a14','#9ca7ba',8);text(c,'ATM',x,-90,66,'#6dffb4',font='DejaVu Sans Mono')
            rect(c,x-160,60,320,34,'#111419','#596170',5)
        on(c,cam,8200,face)
    if t>47.5:
        char3(c,cam,5310,520,8110,1.0,boil=int(ts*15)%3,mouth='grin',look=(1,0),hl=(-90,-200),hr=(120,-240),**HENCH)
        on(c,cam,8109,lambda:bag(c,5430,380,1.3,'#3b3f55'))
    if sp:
        r=random.Random(21)
        for i in range(64):
            xb=r.choice((5040,5640,6240));p=r.uniform(0,1);v=r.uniform(.5,1.1);tt=((ts-47.7)*v+p)%1
            dd=8190-tt*560;x=xb+math.sin(i)*tt*520+math.sin(ts*2+i)*18;y=78-tt*220+tt*tt*600
            if dd-cam.z<60 or y>510:continue
            def b1(x=x,y=y,i=i,tt=tt):bill(c,x,y,110,rot=ts*2+i,flip=math.cos(ts*6+i))
            on(c,cam,dd,b1)
    if t>49.6:
        k=min(1,(t-49.6)/1.35);v=int(1000000000*ease(k)**2)
        def cnt():
            rect(c,5060,-930,1160,210,'#0a1a14','#c9a33f',10);text(c,'$'+format(v,','),5640,-790,110,'#6dffb4',font='DejaVu Sans Mono')
        on(c,cam,8000,cnt)
DIS=[(34.35,34.7,'ball','door'),(36.5,36.9,'door','hiro'),(40.7,41.05,'hiro','won')]
def draw_scene(n,c,cam,t,ts):
    if n=='ball':s_ball(c,cam,t,ts)
    elif n=='door':s_door(c,cam,t,ts)
    elif n=='hiro':s_hiro(c,cam,t,ts)
    elif n=='won':s_door(c,cam,t,ts,crown=True)
def world(c,t,ts):
    cam=camat(t);rk=0
    if 25.25<t<25.75:
        k=(1-(t-25.25)/.5)*34;cam.x+=k*math.sin(t*71);cam.y+=k*math.cos(t*59)
    if 60<t:pass
    c.save();apply_roll(c,cam)
    if t<12.4:s_night(c,cam,t,ts)
    elif t<25.25:
        sky(c);s_vault(c,cam,t,ts)
        if cam.z<4700:pass
    elif t<28.6:
        s_street(c,cam);s_vault(c,cam,t,ts);s_front(c,cam,t,ts)
    elif t<44.42:
        cur=None
        for a,b,x,y in DIS:
            if a<=t<b:
                draw_scene(x,c,cam,t,ts);c.push_group();draw_scene(y,c,cam,t,ts);c.pop_group_to_source();c.paint_with_alpha(ease((t-a)/(b-a)));cur='x';break
        if not cur:
            n='ball' if t<34.35 else 'door' if t<36.5 else 'hiro' if t<40.7 else 'won'
            draw_scene(n,c,cam,t,ts)
        if t>44.2:
            rect(c,-300,-300,W+600,H+600,(.01,.01,.02,min(1,(t-44.2)/.18)))
    elif t<47.3:s_hack(c,cam,t,ts)
    else:
        s_atm(c,cam,t,ts)
        if t<47.6:rect(c,-300,-300,W+600,H+600,(.72,1,.86,1-(t-47.3)/.3))
    c.restore()
    if 28.34<t<29.05:smoke_wipe(c,(t-28.34)/.71)
    if 25.25<t<25.4:
        rect(c,-300,-300,W+600,H+600,(1,.95,.8,.85*(1-(t-25.25)/.15)))
# chunks: render.py expects shots. Cut points just split the file; the camera never cuts
CUTS=[0,3,6.25,8.4,10.5,12.4,14.2,15.9,17.3,19.4,20.5,23.9,25.25,27,28.6,31,34.3,36.7,39.2,40.8,42.8,44.42,46.1,47.5,49.8,51.35,e]
NAMES=['open','walk','bed','clock','combo','vault','bank','door','mech','tug','soup','pour','boom','front','ball','screw','bigdoor','hiro','open2','won','turn','hack','tunnel','atm','count','end']
def _mk(a,b):
    def fn(c,u,t,bo):world(c,a+u*(b-a),a+t)
    return fn
SH_LIST=[(NAMES[i],CUTS[i],CUTS[i+1],_mk(CUTS[i],CUTS[i+1]),0) for i in range(len(NAMES))]
GR=[(0,.66,.60,.96,.86),(10.8,.68,.60,.96,.86),(12.1,1.05,.78,.78,.9),(14.2,1,1,1,1),(20.3,1,1,1,1),(21.1,.68,.60,.98,.88),(28.5,.68,.60,.98,.88),(28.62,1,1,1,1),(44.42,1,1,1,1),(44.5,.72,.74,1.0,.95),(47.25,.72,.74,1,.95),(47.4,1,1,1,1),(e+1,1.03,1,.97,1)]
_gf=PchipInterpolator([g[0] for g in GR],np.array([g[1:] for g in GR]))
def POST(a,t):
    g=_gf(t)
    if abs(g-1).sum()>.01:a=grade(a,g[:3],g[3])
    if not(28.35<t<29.05 or 44.35<t<44.5):
        c0,c1=camat(t),camat(t+1/30);s=F/1000
        dx=(c1.x-c0.x);dy=(c1.y-c0.y);dz=(c1.z-c0.z)
        if abs(dx)+abs(dy)>32:
            a=speed_blur(a,max(-180,min(180,dx*.55)),max(-180,min(180,dy*.55)))
    return a
SMALL={'a','an','the','to','in','at','of','it','so','and','his','by','up','he','one','off','at'}
CAP=[]
for ph in T:
    ws=ph['text'].split();L=sum(len(w)+2 for w in ws);tt=ph['start'];d=ph['end']-ph['start'];row=[]
    for w in ws:
        dt=d*(len(w)+2)/L;row.append([tt,tt+dt,w]);tt+=dt
    i=0
    while i<len(row):
        a=row[i]
        if a[2].lower().strip(',.?!') in SMALL and i+1<len(row) and not a[2].endswith((',','.','?','!')):
            CAP.append([a[0],row[i+1][1],a[2]+' '+row[i+1][2]]);i+=2
        else:CAP.append(a);i+=1
MUSIC_STOP=('hiro','won')
def CUES(f,d):
    for n,g in(('walk',.35),('bed',.5),('vault',.5),('tunnel',.5),('end',.5)):f['whoosh'](d[n][1]+.05,g)
    f['whoosh'](14.5,.7);f['whoosh'](19.3,.4);f['whoosh'](24.4,.3)
    for i in range(8):f['tick'](6.9+i*.11,.35,1900)
    f['thud'](7.78,.5);f['ding'](7.8,1240,.25)
    for i in range(5):f['tick'](9.8+i*.3,.3,2200)
    for i in range(10):f['tick'](12.5+i*.14,.22,1200)
    f['thud'](13.1,.35)
    for i in range(14):f['tick'](17.2+i*.14,.3,1500)
    for i in range(3):f['thud'](19.8+i*.22,.28)
    f['thud'](25.25,1.25);f['crack'](25.28,1.0);f['noise'](25.3,27.5,70,500,.28)
    for t in (26.3,26.6,26.9,27.2):f['crack'](t,.5)
    f['whoosh'](28.36,.8);f['thud'](28.45,.5)
    f['noise'](28.7,30,90,420,.16);f['thud'](30,.4)
    for i in range(10):f['tick'](30.9+i*.16,.4,700)
    f['thud'](32.5,.14)
    f['thud'](37,.3);f['thud'](39.25,.4);f['ding'](39.5,880,.25)
    f['ding'](41,1560,.3);f['whoosh'](43.7,.6);f['whoosh'](44.1,.6)
    for i in range(14):f['tick'](45+i*.09,.18,3100)
    f['noise'](46.1,47.4,1500,6000,.18);f['ding'](47.7,1760,.3)
    for i in range(16):f['tick'](47.8+i*.2,.28,1200)
    for i in range(12):f['tick'](49.8+i*.11,.2,2600)
    f['ding'](51.15,2093,.4);f['whoosh'](51.5,.7);f['ding'](53.4,1046,.2)
