from lib import *
import random,math
def bricks(c,pts,cols,seed=3,rows=26,col_n=10):
    c.save();poly(c,pts);c.new_path();c.move_to(*pts[0])
    for p in pts[1:]:c.line_to(*p)
    c.close_path();c.clip()
    xs=[p[0] for p in pts];ys=[p[1] for p in pts];r=random.Random(seed);y=min(ys);hh=(max(ys)-min(ys))/rows
    for j in range(rows):
        x=min(xs)-(j%2)*40
        while x<max(xs):
            w=80;rect(c,x,y,w,hh,r.choice(cols),'#2a160f',2.2);x+=w
        y+=hh
    c.restore()
def clouds(c,seed,y0,y1,col=(1,.95,.86,.85),n=9):
    r=random.Random(seed);s,cc=surf();
    for i in range(n):
        x=r.uniform(0,SW);y=r.uniform(y0,y1);w=r.uniform(120,340)
        for k in range(7):ell(cc,x+r.uniform(-w,w),y+r.uniform(-30,30),r.uniform(50,w*.55),r.uniform(26,70),col)
    c.set_source_surface(blur(s,7),0,0);c.paint()
def houses(c,y,seed=2,h0=300,h1=540):
    r=random.Random(seed);x=-40
    pal=['#d9542f','#2f8f9c','#e5a33a','#7a4fb2','#3b6fc9','#c2363f']
    while x<SW:
        w=r.uniform(170,290);h=r.uniform(h0,h1);col=r.choice(pal)
        poly(c,[(x,y),(x+w,y),(x+w,y-h),(x,y-h)],lg(c,x,0,x+w,0,[(0,shade(col,1.15)),(1,shade(col,.55))]),INK,6)
        poly(c,[(x-12,y-h),(x+w+12,y-h),(x+w/2,y-h-w*.42)],lg(c,x,0,x+w,0,[(0,'#a2432c'),(1,'#4d2020')]),INK,6)
        for i in range(2):
            for j in range(2):
                wx=x+w*.18+i*w*.4;wy=y-h*.78+j*h*.32
                rect(c,wx,wy,w*.22,h*.18,lg(c,0,wy,0,wy+h*.18,[(0,'#ffe9a8'),(1,'#f6a93c')]),INK,5)
        x+=w
def tower_low():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,0,SH,[(0,'#1f3fbe'),(.42,'#3f7fe8'),(.72,'#ffb765'),(.88,'#ff7b3f'),(1,'#cc3d3d')]))
    clouds(c,4,300,1400)
    circ(c,190,1660,520,rg(190,1660,50,520,[(0,(1,.95,.7,.95)),(.25,(1,.8,.45,.55)),(1,(1,.5,.2,0))]))
    s2,c2=surf();houses(c2,2150,h0=420,h1=720);c.set_source_surface(blur(s2,2.5),0,0);c.paint()
    # tower perspective
    L=[(300,2400),(575,240),(700,240),(700,2400)];Rr=[(700,240),(825,240),(1100,2400),(700,2400)]
    bricks(c,[(250,2400),(560,250),(760,250),(760,2400)],['#e8863f','#f09a4e','#d5702f','#f4ab62'],rows=46)
    bricks(c,[(760,250),(840,250),(1150,2400),(760,2400)],['#3a3f92','#31347c','#454aa6','#2a2c6c'],rows=46)
    poly(c,[(250,2400),(560,250),(840,250),(1150,2400)],None,INK,10)
    # roof
    poly(c,[(530,255),(870,255),(700,-20)],lg(c,530,0,870,0,[(0,'#d94a35'),(.5,'#a4282a'),(1,'#3d1537')]),INK,10)
    # ledge
    poly(c,[(380,1270),(1020,1270),(1040,1320),(360,1320)],lg(c,380,0,1040,0,[(0,'#ffd9a0'),(.55,'#c98f58'),(1,'#3f3a7e')]),INK,8)
    return s
def square():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,0,1300,[(0,'#2f62d8'),(.8,'#ffc178'),(1,'#ff8e4c')]))
    clouds(c,9,150,800)
    s2,c2=surf()
    # far tower
    poly(c2,[(620,1250),(780,1250),(770,380),(630,380)],lg(c2,620,0,780,0,[(0,'#f09a4e'),(1,'#3a3f92')]),INK,7)
    poly(c2,[(610,385),(790,385),(700,230)],'#a4282a',INK,7);clock(c2,700,530,60,minute=10,hour=12,glow=False,num=False)
    c.set_source_surface(blur(s2,1.6),0,0);c.paint()
    r=random.Random(3)
    for side,x0,x1 in((-1,-20,560),(1,840,1420)):
        n=4
        for i in range(n):
            a=i/n;b=(i+1)/n
            xa=x0+(x1-x0)*a;xb=x0+(x1-x0)*b;
            ky=lambda x:(abs(x-700)/700)
            ya,yb=1270+ky(xa)*520,1270+ky(xb)*520
            ha,hb=ky(xa)*920+150,ky(xb)*920+150
            col=['#d9542f','#2f8f9c','#e5a33a','#7a4fb2','#c2363f','#3b6fc9','#e5a33a','#2f8f9c'][(i+(0 if side<0 else 4))%8]
            f=1.2 if side<0 else .55
            poly(c,[(xa,ya),(xb,yb),(xb,yb-hb),(xa,ya-ha)],lg(c,xa,0,xb,0,[(0,shade(col,f)),(1,shade(col,f*.8))]),INK,6)
            wx=(xa+xb)/2;wh=(ha+hb)/2
            rect(c,wx-abs(xb-xa)*.22,(ya+yb)/2-wh*.72,abs(xb-xa)*.44,wh*.24,lg(c,0,0,0,1,[(0,'#ffe9a8'),(1,'#ffe9a8')]),INK,5)
    # ground cobble
    poly(c,[(0,2400),(1400,2400),(1400,1790),(700,1270),(0,1790)],lg(c,0,1270,0,2400,[(0,'#b98a60'),(1,'#7d4f39')]))
    for j in range(40):
        y=1275+(j/40)**1.7*1125;sc=(y-1270)/1130
        for i in range(-14,15):
            x=700+(i+(j%2)*.5)*170*sc
            ell(c,x,y,sc*70+3,sc*22+1.3,(0.08,.05,.15,.25))
    # long shadow right
    poly(c,[(640,1500),(1400,1760),(1400,2200),(600,1800)],(0,0,0,0))
    return s
def interior():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#5c3216'),(.5,'#37200f'),(1,'#1c1230')]))
    r=random.Random(7)
    for x in range(0,SW,110):
        rect(c,x,0,110,SH,None,'#120a06',4)
    planks(c,0,SW,1720,SH,10,600)
    # big clock window back
    x,y=720,850;R=560
    circ(c,x,y,R*1.45,rg(x,y,R*.5,R*1.45,[(0,(1,.8,.45,.75)),(1,(1,.6,.2,0))]))
    circ(c,x,y,R,rg(x-120,y-120,50,R*1.05,[(0,'#fff3c8'),(.6,'#ffc66e'),(1,'#f07a34')]),INK,20)
    for i in range(12):
        a=i/12*2*math.pi;c.set_source_rgba(.1,.07,.09,1);c.set_line_width(14);c.move_to(x+R*.82*math.sin(a),y-R*.82*math.cos(a));c.line_to(x+R*.97*math.sin(a),y-R*.97*math.cos(a));c.stroke()
    circ(c,x,y,R*1.04,(0,0,0,0),'#6b4210',30)
    # shafts
    s3,c3=surf()
    for (a,b,o) in((-.5,.05,.2),(.2,.42,.15),(-1.0,-.68,.1)):
        poly(c3,[(x-R*.5,y),(x+R*.5,y),(x+2200*math.sin(b),y+2200*math.cos(b)),(x+2200*math.sin(a),y+2200*math.cos(a))],lg(c3,0,y,0,y+1700,[(0,(1,.8,.5,o)),(1,(1,.7,.4,0))]))
    c.save();c.set_operator(cairo.OPERATOR_ADD);c.set_source_surface(blur(s3,16),0,0);c.paint();c.restore()
    return blur(s,1.3)
def desert():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,0,1600,[(0,'#120f47'),(.4,'#4b2389'),(.68,'#d1477f'),(.88,'#ff9a50'),(1,'#ffdc8a')]))
    r=random.Random(4)
    for i in range(160):circ(c,r.uniform(0,SW),r.uniform(0,800),r.uniform(1,3.6),(1,1,1,r.uniform(.3,.9)))
    circ(c,1060,1380,180,rg(1060,1380,40,180,[(0,'#fff0b0'),(.6,(1,.8,.45,.8)),(1,(1,.6,.3,0))]))
    for pts,col in(([(0,1600),(0,1240),(220,1220),(280,1320),(520,1330),(600,1600)],('#7d3a7a','#3a1e58')),([(850,1600),(920,1300),(1120,1270),(1200,1400),(1400,1380),(1400,1600)],('#9a4478','#44205e'))):
        poly(c,pts,lg(c,0,1250,0,1600,[(0,col[0]),(1,col[1])]),INK,6)
    poly(c,[(0,SH),(SW,SH),(SW,1560),(0,1600)],lg(c,0,1560,0,SH,[(0,'#b2534f'),(.4,'#7b3548'),(1,'#2c1a3e')]))
    for i in range(60):
        x=r.uniform(0,SW);y=r.uniform(1620,SH);ell(c,x,y,r.uniform(14,44)*(y/1800),r.uniform(5,12)*(y/1800),(.1,.05,.18,.35))
    def cactus(x,y,sc):
        c.set_line_cap(cairo.LINE_CAP_ROUND);c.set_source_rgba(*rgb(INK));c.set_line_width(46*sc);c.move_to(x,y);c.line_to(x,y-300*sc);c.stroke();c.set_line_width(34*sc);c.move_to(x,y-120*sc);c.curve_to(x-80*sc,y-120*sc,x-80*sc,y-220*sc,x-80*sc,y-230*sc);c.stroke();c.move_to(x,y-160*sc);c.curve_to(x+80*sc,y-160*sc,x+80*sc,y-260*sc,x+80*sc,y-270*sc);c.stroke()
        c.set_source_rgba(*rgb('#2f7d56'));c.set_line_width(30*sc);c.move_to(x,y);c.line_to(x,y-300*sc);c.stroke();c.set_line_width(20*sc);c.move_to(x,y-120*sc);c.curve_to(x-80*sc,y-120*sc,x-80*sc,y-220*sc,x-80*sc,y-230*sc);c.stroke();c.move_to(x,y-160*sc);c.curve_to(x+80*sc,y-160*sc,x+80*sc,y-260*sc,x+80*sc,y-270*sc);c.stroke()
    cactus(170,1700,.9);cactus(1230,1660,.7)
    return s
def bank():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,0,1400,[(0,'#2259e6'),(1,'#a6e0ff')]))
    clouds(c,22,100,500,col=(1,1,1,.95))
    # facade
    poly(c,[(120,1860),(1280,1860),(1280,480),(120,480)],lg(c,120,0,1280,0,[(0,'#f1cf8e'),(.7,'#d29a5e'),(1,'#9b6a55')]),INK,12)
    poly(c,[(70,480),(1330,480),(1330,420),(70,420)],'#a2432c',INK,10)
    rect(c,330,520,740,180,lg(c,0,520,0,700,[(0,'#1f5e4a'),(1,'#124035')]),INK,10)
    text(c,'BANK',700,665,150,'#ffd23f',font='DejaVu Serif',stroke=INK,sw=10)
    for x in(150,1040):
        rect(c,x,800,210,300,lg(c,0,800,0,1100,[(0,'#76d2e8'),(1,'#2c6a97')]),INK,10)
        c.set_source_rgba(1,1,1,.4);c.set_line_width(14);c.move_to(x+40,1060);c.line_to(x+140,840);c.stroke()
        rect(c,x-14,1100,238,26,'#5a3517',INK,7)
    # roof shadow on wall
    poly(c,[(120,480),(1280,480),(1280,590),(120,590)],(.1,.06,.3,.0))
    rect(c,120,480,1160,70,None)
    c.set_source(lg(c,0,480,0,640,[(0,(.13,.1,.4,.55)),(1,(.13,.1,.4,0))]));c.rectangle(120,480,1160,160);c.fill()
    # ground
    poly(c,[(0,SH),(SW,SH),(SW,1860),(0,1860)],lg(c,0,1860,0,SH,[(0,'#e9b56e'),(1,'#b57b3a')]))
    r=random.Random(9)
    for i in range(90):
        ell(c,r.uniform(0,SW),r.uniform(1880,SH),r.uniform(8,38),r.uniform(3,9),(.32,.17,.1,.32))
    return s
def door(c,x,y,w,h,col='#8c4a26'):
    rect(c,x,y,w,h,lg(c,x,0,x+w,0,[(0,shade(col,1.2)),(1,shade(col,.68))]),INK,10)
    rect(c,x+w*.12,y+h*.08,w*.76,h*.32,lg(c,0,y,0,y+h*.4,[(0,'#7ad6ea'),(1,'#2d6e9e')]),INK,7)
    rect(c,x+w*.12,y+h*.48,w*.76,h*.42,None,INK,7)
    circ(c,x+w*.86,y+h*.46,11,'#ffd23f',INK,4)
def bankin():
    s,c=surf()
    rect(c,0,0,SW,SH,lg(c,0,0,SW,0,[(0,'#2d8d91'),(.5,'#23717a'),(1,'#153f5c')]))
    for y in range(0,1560,130):
        rect(c,0,y,SW,130,None,'#0f3540',3)
    # vault
    circ(c,1020,1000,340,lg(c,700,700,1300,1300,[(0,'#cfd6e0'),(1,'#59657f')]),INK,12)
    circ(c,1020,1000,250,lg(c,780,760,1260,1240,[(0,'#7f8ca5'),(1,'#333e58')]),INK,8)
    for i in range(6):
        a=i/6*2*math.pi;c.set_source_rgba(*rgb('#ffd23f'));c.set_line_width(24);c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(1020,1000);c.line_to(1020+150*math.cos(a),1000+150*math.sin(a));c.stroke()
    circ(c,1020,1000,50,'#ffd23f',INK,6)
    # teller window
    rect(c,60,700,420,500,lg(c,0,700,0,1200,[(0,'#f0c56f'),(1,'#a4682c')]),INK,10)
    for i in range(7):rect(c,80+i*56,720,10,400,'#2c1a10')
    rect(c,30,1200,480,70,'#6b3b1a',INK,8)
    planks(c,0,SW,1560,SH,10,500,cols=('#8e5a2c','#a56c35','#7a4a22'))
    return blur(s,1.5)
