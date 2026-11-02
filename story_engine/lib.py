import cairo,math,os,random,numpy as np
FONT=os.environ.get('STORY_FONT','Inter')
from scipy.ndimage import gaussian_filter
W,H=1080,1920;FPS=30;SW,SH=1400,2400
def rgb(h,a=1.0):
    if isinstance(h,tuple):return h if len(h)==4 else (*h,a)
    h=h.lstrip('#');return (int(h[:2],16)/255,int(h[2:4],16)/255,int(h[4:6],16)/255,a)
def surf(w=SW,h=SH):
    s=cairo.ImageSurface(cairo.FORMAT_ARGB32,w,h);return s,cairo.Context(s)
def blur(s,sig):
    s.flush();w,h=s.get_width(),s.get_height()
    a=np.ndarray((h,w,4),np.uint8,s.get_data()).astype(np.float32)
    o=np.stack([gaussian_filter(a[...,i],sig) for i in range(4)],-1).clip(0,255).astype(np.uint8)
    r,_=surf(w,h);r.flush();np.ndarray((h,w,4),np.uint8,r.get_data())[:]=o;r.mark_dirty();return r
def lg(c,x0,y0,x1,y1,stops):
    g=cairo.LinearGradient(x0,y0,x1,y1)
    for p,col in stops:g.add_color_stop_rgba(p,*(rgb(col) if isinstance(col,str) else col))
    return g
def rg(x,y,r0,r1,stops):
    g=cairo.RadialGradient(x,y,r0,x,y,r1)
    for p,col in stops:g.add_color_stop_rgba(p,*(rgb(col) if isinstance(col,str) else col))
    return g
def poly(c,pts,fill=None,line=None,lw=8):
    c.move_to(*pts[0])
    for p in pts[1:]:c.line_to(*p)
    c.close_path()
    if fill is not None:
        c.set_source(fill) if isinstance(fill,cairo.Pattern) else c.set_source_rgba(*rgb(fill))
        c.fill_preserve()
    if line:c.set_source_rgba(*rgb(line));c.set_line_width(lw);c.set_line_join(cairo.LINE_JOIN_ROUND);c.stroke()
    else:c.new_path()
def rect(c,x,y,w,h,fill=None,line=None,lw=8):poly(c,[(x,y),(x+w,y),(x+w,y+h),(x,y+h)],fill,line,lw)
def circ(c,x,y,r,fill=None,line=None,lw=8):
    c.new_path();c.arc(x,y,r,0,2*math.pi)
    if fill is not None:
        c.set_source(fill) if isinstance(fill,cairo.Pattern) else c.set_source_rgba(*rgb(fill))
        c.fill_preserve()
    if line:c.set_source_rgba(*rgb(line));c.set_line_width(lw);c.stroke()
    else:c.new_path()
def ell(c,x,y,rx,ry,fill,rot=0):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(rx,ry);c.arc(0,0,1,0,2*math.pi);c.restore()
    c.set_source(fill) if isinstance(fill,cairo.Pattern) else c.set_source_rgba(*(fill if isinstance(fill,tuple) else rgb(fill)))
    c.fill()
def text(c,s,x,y,size,col='#ffffff',font=None,bold=True,stroke=None,sw=8,center=True,rot=0):
    c.save();c.select_font_face(font or FONT,cairo.FONT_SLANT_NORMAL,cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    c.set_font_size(size);e=c.text_extents(s);c.translate(x,y);c.rotate(rot)
    if center:c.translate(-e.width/2-e.x_bearing,0)
    c.move_to(0,0);c.text_path(s)
    if stroke:c.set_source_rgba(*rgb(stroke));c.set_line_width(sw);c.set_line_join(cairo.LINE_JOIN_ROUND);c.stroke_preserve()
    c.set_source_rgba(*rgb(col));c.fill();c.restore()
def wob(seed,n,amp):
    r=random.Random(seed);return [r.uniform(-amp,amp) for _ in range(n)]
def blob(c,x,y,rx,ry,seed=0,amp=2.5,n=36):
    w=wob(seed,n,amp);c.new_path()
    for i in range(n):
        a=i/n*2*math.pi;c.line_to(x+(rx+w[i])*math.cos(a),y+(ry+w[i])*math.sin(a))
    c.close_path()
INK='#17121f'
def limb(c,a,b,bend=0,lw=11,col=INK):
    mx,my=(a[0]+b[0])/2,(a[1]+b[1])/2;dx,dy=b[0]-a[0],b[1]-a[1];L=math.hypot(dx,dy)+1e-3
    q=(mx-dy/L*bend,my+dx/L*bend)
    c.set_source_rgba(*rgb(col));c.set_line_width(lw);c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.move_to(*a);c.curve_to(a[0]+(q[0]-a[0])*.7,a[1]+(q[1]-a[1])*.7,b[0]+(q[0]-b[0])*.7,b[1]+(q[1]-b[1])*.7,*b);c.stroke()
def shade(col,f):
    r,g,b,_=rgb(col);return (r*f,g*f,b*f,1)
def char(c,x,y,s=1,body='#d8342b',hat=None,mouth='flat',eyes='normal',brow=0,look=(0,0),hl=None,hr=None,fl=(-42,0),fr=(42,0),boil=0,tilt=0,mst=False,sweat=0,gog=False,bow=None,star=False,pick=None,lit=-1,skin='#fbf3df',shadow=True,shadow_col=(.08,.1,.42,.42),rim='#ffd9a0',bandana=None,gold=False,wink=False):
    """feet at x,y. lit=-1 light from left, +1 from right"""
    if shadow:
        c.save();c.translate(x,y);c.transform(cairo.Matrix(1,0,-lit*.9*.9,.28,0,0));c.scale(s,s)
        ell(c,0,-210,70,210,shadow_col);ell(c,0,-440,118,118,shadow_col);c.restore()
    c.save();c.translate(x,y);c.scale(s,s)
    hl=hl or (-120,-210);hr=hr or (120,-210)
    # legs
    limb(c,(-28,-160),fl,bend=-8,lw=13);limb(c,(28,-160),fr,bend=8,lw=13)
    for f in (fl,fr):
        ell(c,f[0],f[1]-3,28,12,INK)
    c.rotate(tilt)
    # far arm + torso
    limb(c,(-62,-285),hl,bend=-18,lw=12);
    blob(c,0,-235,76,100,seed=boil+1,amp=2)
    c.set_source(lg(c,-76*-lit*-1,0,76*-lit*-1,0,[(0,shade(body,1.18)),(.6,shade(body,.92)),(1,shade(body,.5))]));c.fill_preserve()
    c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke()
    # stripes on vest
    c.save();blob(c,0,-235,74,98,seed=boil+1,amp=2);c.clip();c.set_source_rgba(1,1,1,.13);c.set_line_width(5)
    for i in range(-5,6):
        c.move_to(i*16,-340);c.line_to(i*16,-130);c.stroke()
    c.restore()
    if bow:
        poly(c,[(0,-322),(-34,-342),(-34,-300)],bow,INK,6);poly(c,[(0,-322),(34,-342),(34,-300)],bow,INK,6)
    if star:
        pts=[]
        for i in range(10):
            a=-math.pi/2+i*math.pi/5;r=30 if i%2==0 else 13;pts.append((-26+r*math.cos(a),-260+r*math.sin(a)))
        poly(c,pts,'#ffd23f',INK,5)
    limb(c,(62,-285),hr,bend=18,lw=12)
    for h in (hl,hr):circ(c,h[0],h[1],15,INK)
    # head
    hx,hy=0,-440;R=132
    blob(c,hx,hy,R,R*.97,seed=boil,amp=2.4)
    c.set_source(rg(hx+lit*50,hy-40,10,R*1.25,[(0,'#fffdf4'),(.55,skin),(.85,shade(skin,.8)),(1,(.62,.60,.86,1))]));c.fill_preserve()
    c.set_source_rgba(*rgb(INK));c.set_line_width(11);c.stroke()
    # rim light
    c.set_source_rgba(*rgb(rim,.95));c.set_line_width(6);c.new_path();mid=math.pi if lit<0 else 0
    c.arc(hx,hy,R-9,mid-.9,mid+.5);c.stroke()
    lx,ly=look
    # eyes
    ex=46;ey=hy-10
    for sgn in(-1,1):
        px=sgn*ex
        if eyes=='wide':
            ell(c,px,ey,27,34,'#ffffff');c.new_path();c.save();c.translate(px,ey);c.scale(27,34);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.stroke()
            circ(c,px+lx*8,ey+ly*10,9,INK)
        elif eyes=='half':
            c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.move_to(px-24,ey-4);c.line_to(px+24,ey-4);c.stroke()
            circ(c,px+lx*8,ey+7,10,INK)
        elif wink and sgn==1:
            c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.move_to(px-22,ey+4);c.curve_to(px-8,ey-12,px+8,ey-12,px+22,ey+4);c.stroke()
        else:
            ell(c,px+lx*5,ey+ly*5,13,20,INK)
            ell(c,px+lx*5-4,ey+ly*5-7,4,6,'#ffffff')
        # brows
        c.set_source_rgba(*rgb(INK));c.set_line_width(11);c.set_line_cap(cairo.LINE_CAP_ROUND)
        c.move_to(px-sgn*-26,ey-46-brow*sgn*0-(brow*12 if False else 0)+(-brow*18));c.line_to(px+sgn*-26,ey-46+(brow*18));c.stroke()
    if gog:
        for sgn in(-1,1):
            circ(c,sgn*ex,ey,44,rg(sgn*ex-10,ey-14,4,44,[(0,(1,1,1,.42)),(1,(.55,.8,.95,.12))]),'#8a5a22',11)
        c.set_source_rgba(*rgb('#8a5a22'));c.set_line_width(11);c.move_to(-ex+44,ey);c.line_to(ex-44,ey);c.stroke()
    # mouth
    my=hy+62;c.set_line_width(10);c.set_source_rgba(*rgb(INK));c.new_path()
    if mouth=='flat':c.move_to(-30,my);c.line_to(30,my);c.stroke()
    elif mouth=='smirk':c.move_to(-34,my+4);c.curve_to(-8,my+12,20,my+8,44,my-16);c.stroke()
    elif mouth=='grin':
        poly(c,[(-58,my-10),(58,my-10),(36,my+30),(-36,my+30)],'#ffffff',INK,8)
        if gold:rect(c,8,my-8,22,28,'#ffc833')
        c.set_line_width(4);c.move_to(-48,my+8);c.line_to(48,my+8);c.stroke()
    elif mouth in('open','yell'):
        k=1 if mouth=='open' else 1.7
        ell(c,0,my+8*k,34*k,26*k,'#471723');c.save();c.translate(0,my+8*k);c.scale(34*k,26*k);c.arc(0,0,1,0,6.3);c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.stroke()
        ell(c,0,my+22*k,20*k,10*k,'#d3435a')
    elif mouth=='o':
        ell(c,0,my+4,14,17,'#471723')
    if mst:
        c.set_source_rgba(*rgb(mst if isinstance(mst,str) else '#3a2414'))
        for sgn in(-1,1):
            c.move_to(sgn*2,my-22);c.curve_to(sgn*40,my-42,sgn*78,my-22,sgn*84,my-4);c.curve_to(sgn*54,my-16,sgn*26,my-8,sgn*2,my-10);c.close_path();c.fill()
    if bandana:
        c.save();blob(c,hx,hy,R-4,R*.95,amp=0);c.clip();rect(c,-R,my-16,2*R,R,bandana);c.set_source_rgba(1,1,1,.35)
        for i in range(-3,4):circ(c,i*38,my+30,6,(1,1,1,.45))
        c.restore();c.set_source_rgba(*rgb(INK));c.set_line_width(7);c.move_to(-R+5,my-16);c.line_to(R-5,my-16);c.stroke()
    if pick:
        limb(c,(26,my+6),(100,my-12),lw=7,col='#c49a4e')
    if sweat:
        d=(.47,.82,1,1);c.save();c.translate(R*.72,hy-R*.6+sweat*50);c.move_to(0,-22);c.curve_to(22,8,12,24,0,24);c.curve_to(-12,24,-22,8,0,-22);c.set_source_rgba(*d);c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(5);c.stroke();c.restore()
    # hats
    def band(y0,w,col):rect(c,-w,y0,2*w,20,col,INK,5)
    top=hy-R+18
    if hat=='top':
        poly(c,[(-74,top-120),(74,top-120),(84,top+10),(-84,top+10)],lg(c,-80,0,80,0,[(0,'#3e3a60'),(1,'#15132b')]),INK,10)
        band(top-24,82,'#d8342b');ell(c,0,top+14,150,22,INK)
    elif hat=='bowler':
        c.new_path();c.arc(0,top+10,92,math.pi,0);c.close_path();c.set_source(lg(c,-90,0,90,0,[(0,'#7c552c'),(1,'#3a2413')]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(10);c.stroke()
        band(top-8,90,'#ffd23f');ell(c,0,top+14,140,16,INK)
    elif hat in('cowboy','sheriff'):
        col=('#c79a5b','#6e4a22') if hat=='sheriff' else ('#514a6b','#1f1c33')
        poly(c,[(-72,top-92),(0,top-66),(72,top-92),(90,top+4),(-90,top+4)],lg(c,-90,0,90,0,[(0,col[0]),(1,col[1])]),INK,10)
        band(top-14,88,'#2c1a10')
        c.move_to(-198,top-22);c.curve_to(-140,top+36,140,top+36,198,top-22);c.curve_to(120,top+2,-120,top+2,-198,top-22);c.close_path()
        c.set_source_rgba(*col[1 if hat=='cowboy' else 0],1) if False else c.set_source(lg(c,-200,0,200,0,[(0,col[0]),(1,col[1])]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(9);c.stroke()
    c.restore()
def clock(c,x,y,r,minute=0.,hour=12.,glow=True,num=True,rimc='#c8912e'):
    if glow:circ(c,x,y,r*1.5,rg(x,y,r*.7,r*1.5,[(0,(1,.85,.45,.5)),(1,(1,.7,.3,0))]))
    circ(c,x,y,r*1.07,lg(c,x-r,y-r,x+r,y+r,[(0,'#ffe08a'),(.5,rimc),(1,'#6b4210')]),INK,r*.03+4)
    circ(c,x,y,r*.93,rg(x-r*.25,y-r*.3,r*.1,r*1.05,[(0,'#fffdf0'),(.75,'#fbeec7'),(1,'#d7b780')]),INK,r*.012+3)
    for i in range(60):
        a=i/60*2*math.pi;L=.08 if i%5==0 else .035
        c.set_source_rgba(*rgb(INK));c.set_line_width(r*.018 if i%5==0 else r*.007)
        c.move_to(x+r*.88*math.sin(a),y-r*.88*math.cos(a));c.line_to(x+r*(.88-L)*math.sin(a),y-r*(.88-L)*math.cos(a));c.stroke()
    if num:
        rom=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI']
        for i,n in enumerate(rom):
            a=i/12*2*math.pi;c.save();c.translate(x+r*.68*math.sin(a),y-r*.68*math.cos(a));text(c,n,0,r*.05,r*.13,INK,font='DejaVu Serif');c.restore()
    h=(hour%12+minute/60)/12*2*math.pi;m=minute/60*2*math.pi
    c.set_line_cap(cairo.LINE_CAP_ROUND);c.set_source_rgba(*rgb(INK))
    c.set_line_width(r*.045);c.move_to(x,y);c.line_to(x+r*.46*math.sin(h),y-r*.46*math.cos(h));c.stroke()
    c.set_source_rgba(*rgb('#c52a22'));c.set_line_width(r*.028);c.move_to(x,y);c.line_to(x+r*.76*math.sin(m),y-r*.76*math.cos(m));c.stroke()
    circ(c,x,y,r*.05,'#c8912e',INK,3)
def gear(c,x,y,r,teeth,ang,col='#b5772a',dark='#5e3a14'):
    n=teeth*4;pts=[]
    for i in range(n):
        a=ang+i/n*2*math.pi;rr=r*(1.0 if i%4 in(0,1) else .86);pts.append((x+rr*math.cos(a),y+rr*math.sin(a)))
    poly(c,pts,lg(c,x-r,y-r,x+r,y+r,[(0,col),(1,dark)]),INK,6)
    circ(c,x,y,r*.68,(0,0,0,0),(0,0,0,.33),4)
    for i in range(5):
        a=ang+i/5*2*math.pi;circ(c,x+r*.45*math.cos(a),y+r*.45*math.sin(a),r*.14,'#2a1a0c',INK,3)
    circ(c,x,y,r*.13,'#ffd98a',INK,4)
def planks(c,x0,x1,yh,yb,n,vp,cols=('#8e5a2c','#a56c35','#7a4a22')):
    """perspective floor from horizon yh to bottom yb, vanishing at vp x"""
    rect(c,x0,yh,x1-x0,yb-yh,lg(c,0,yh,0,yb,[(0,'#6e431f'),(1,'#b57538')]))
    r=random.Random(5)
    for i in range(-n,n+1):
        xb=vp+i*(x1-x0)/n*1.2;xb2=vp+(i+1)*(x1-x0)/n*1.2
        col=r.choice(cols);poly(c,[(vp+(xb-vp)*.18,yh),(vp+(xb2-vp)*.18,yh),(xb2,yb),(xb,yb)],col,'#2c1a0e',3)
def motes(c,t,n,seed=1,col=(1,.93,.7),rmax=5):
    r=random.Random(seed)
    for i in range(n):
        x=r.uniform(0,SW);y=r.uniform(0,SH);v=r.uniform(8,30);p=r.uniform(0,6);rd=r.uniform(1.5,rmax)
        xx=(x+math.sin(t*.7+p)*30);yy=(y-v*t)%SH
        circ(c,xx,yy,rd,(col[0],col[1],col[2],.25+.35*abs(math.sin(t+p))))
def ease(u):u=max(0,min(1,u));return u*u*(3-2*u)
def eout(u):u=max(0,min(1,u));return 1-(1-u)**3

SMALL={'—','и','в','во','на','с','со','к','а','но','по','не','за','у','от','до','из','о','об','же','ли','что','как','это','ты','ей','он','она'}
def make_caps(T,captions=None):
    """one or two words at a time, timed by word length; small words stick to the next word"""
    out=[]
    for n,ph in enumerate(T):
        ws=(captions[n] if captions else ph['text']).split();L=sum(len(w)+2 for w in ws);tt=ph['start'];d=ph['end']-ph['start'];i=0
        while i<len(ws):
            w=ws[i];dt=d*(len(w)+2)/L
            if w.lower().strip(',.!?:\u00ab\u00bb') in SMALL and i+1<len(ws):
                dt+=d*(len(ws[i+1])+2)/L;w=w+' '+ws[i+1];i+=1
            out.append([tt,tt+dt,w]);tt+=dt;i+=1
    return out
