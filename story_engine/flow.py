"""One-take camera for Six Zeros. A small 2.5D world: everything has (x,y,depth), one camera flies through it.
See STYLE.md 'One-take style'. Camera keys: (t,x,y,z,roll). y grows downward; depth scale = 1000/(d-z)."""
from lib import *
from scipy.interpolate import PchipInterpolator
F=1000.;NEAR=50.
class Cam:
    __slots__=('x','y','z','r')
    def __init__(s,x,y,z,r=0):s.x,s.y,s.z,s.r=x,y,z,r
def path(keys):
    ts=[k[0] for k in keys];a=np.array([[*k[1:4],(k[4] if len(k)>4 else 0)] for k in keys],float);f=PchipInterpolator(ts,a)
    def at(t):
        v=f(min(max(t,ts[0]),ts[-1]));return Cam(*[float(x) for x in v])
    return at
def apply_roll(c,cam):
    c.translate(W/2,H/2);c.rotate(cam.r);c.translate(-W/2,-H/2)
def P(cam,x,y,d):
    s=F/(d-cam.z);return (W/2+(x-cam.x)*s,H/2+(y-cam.y)*s)
def _clip(cam,pts):
    n=cam.z+NEAR;o=[]
    for i,p in enumerate(pts):
        q=pts[(i+1)%len(pts)];a=p[2]>=n;b=q[2]>=n
        if a:o.append(p)
        if a!=b:
            k=(n-p[2])/(q[2]-p[2]);o.append((p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k,n))
    return o
def qd(c,cam,pts,fill,line=None,lw=3):
    p=_clip(cam,pts)
    if len(p)>=3:poly(c,[P(cam,*q) for q in p],fill,line,lw)
def on(c,cam,d,fn):
    """draw fn() on a plane facing the camera at depth d, in world units"""
    if d-cam.z<NEAR:return
    s=F/(d-cam.z);c.save();c.translate(W/2-cam.x*s,H/2-cam.y*s);c.scale(s,s);fn();c.restore()
def box(c,cam,x0,x1,y0,y1,d0,d1,front,side='#00000000',top=None,line=INK,lw=4):
    """y0 top, y1 bottom; draws visible faces, front last"""
    if top is not None and cam.y<y0:qd(c,cam,[(x0,y0,d0),(x1,y0,d0),(x1,y0,d1),(x0,y0,d1)],top,line,lw)
    if cam.x<x0:qd(c,cam,[(x0,y0,d0),(x0,y0,d1),(x0,y1,d1),(x0,y1,d0)],side,line,lw)
    if cam.x>x1:qd(c,cam,[(x1,y0,d0),(x1,y0,d1),(x1,y1,d1),(x1,y1,d0)],side,line,lw)
    qd(c,cam,[(x0,y0,d0),(x1,y0,d0),(x1,y1,d0),(x0,y1,d0)],front,line,lw)
def floor(c,cam,x0,x1,y,d0,d1,cols=('#b47a42','#c2884c','#a56e39'),n=14,seams=True,line='#5c381b'):
    r=random.Random(9);dx=(x1-x0)/n
    for i in range(n):
        qd(c,cam,[(x0+i*dx,y,d0),(x0+(i+1)*dx,y,d0),(x0+(i+1)*dx,y,d1),(x0+i*dx,y,d1)],r.choice(cols),line,2.5)
    if seams:
        dd=d0+((cam.z-d0)//260+1)*260 if cam.z>d0 else d0
        c.set_source_rgba(*rgb(line,.65));c.set_line_width(2)
        while dd<d1:
            if dd-cam.z>NEAR:
                a=P(cam,x0,y,dd);b=P(cam,x1,y,dd);c.move_to(*a);c.line_to(*b);c.stroke()
            dd+=260
def sky(c,top='#3fa9e6',mid='#8fd4f2',low='#f6e9c8',cam=None):
    off=-(cam.y*.08) if cam else 0
    c.rectangle(-400,-400,W+800,H+800);c.set_source(lg(c,0,-200+off,0,H*.72+off,[(0,top),(.7,mid),(1,low)]));c.fill()
def glow(c,x,y,r,col=(1,.75,.35),a=.8):
    c.save();c.set_operator(cairo.OPERATOR_ADD);circ(c,x,y,r,rg(x,y,1,r,[(0,(*col,a)),(.45,(*col,a*.35)),(1,(*col,0))]));c.restore()
def wall(c,x0,x1,y0,y1,fill,holes=(),rects=(),line=INK,lw=5):
    """plane helper with even-odd holes; call inside on()"""
    c.save();c.new_path();c.rectangle(x0,y0,x1-x0,y1-y0)
    for hx,hy,hr in holes:
        c.new_sub_path();c.arc(hx,hy,hr,0,6.2832)
    for a,b,e,f in rects:
        c.rectangle(a,b,e-a,f-b)
    c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    c.set_source(fill) if isinstance(fill,cairo.Pattern) else c.set_source_rgba(*rgb(fill));c.fill_preserve()
    c.set_source_rgba(*rgb(line));c.set_line_width(lw);c.stroke();c.restore()
_puffs=[(random.Random(i).uniform(-120,W+120),random.Random(i+500).uniform(-120,H+120),random.Random(i+900).uniform(190,370)) for i in range(70)]
def smoke_wipe(c,u,ox=W/2,oy=H/2):
    """u 0-1: puffs burst from (ox,oy) and fill the frame by u=.42; a scalloped hole opens from .48 to 1"""
    s,cc=surf(W,H)
    for i,(x,y,r) in enumerate(_puffs):
        k=eout(u/.42);xx=ox+(x-ox)*k;yy=oy+(y-oy)*k;rr=r*k
        if rr<2:continue
        circ(cc,xx,yy,rr,rg(xx-rr*.3,yy-rr*.35,rr*.1,rr*1.05,[(0,'#fffdf7'),(.7,'#f2ece1'),(1,'#d7cec2')]))
        cc.set_source_rgba(.45,.42,.4,.18);cc.set_line_width(4);cc.new_path();cc.arc(xx,yy,rr*.8,.3+i,1.5+i);cc.stroke()
    if u>.48:
        k=ease((u-.48)/.52);cc.set_operator(cairo.OPERATOR_DEST_OUT);R=1500*k
        for i in range(16):
            a=i/16*6.2832;circ(cc,W/2+R*.62*math.cos(a),H/2+R*.62*math.sin(a),R*.42,(0,0,0,1))
        circ(cc,W/2,H/2,R*.72,(0,0,0,1));cc.set_operator(cairo.OPERATOR_OVER)
    s.flush();c.set_source_surface(s,0,0);c.paint()
def flame(c,x,y,sc,t,seed=0):
    r=random.Random(int(t*15)+seed)
    for col,k in(('#e8391e',1),('#ff9a21',.68),('#ffe36b',.38)):
        pts=[(x-70*sc*k,y)]
        for i in range(7):pts.append((x-70*sc*k+i*23*sc*k,y-(r.uniform(90,190) if i%2 else r.uniform(30,80))*sc*k*1.4))
        pts.append((x+70*sc*k,y));poly(c,pts,col)
def blast(c,x,y,R,age,seed=2):
    """cartoon explosion: white star, yellow, orange, brown, charcoal. age in seconds"""
    r=random.Random(seed)
    if age<.14:
        for i in range(26):
            a=r.uniform(0,6.28);L=R*r.uniform(.7,1.5)*(.4+age*5);c.set_source_rgba(1,.97,.75,.95);c.set_line_width(r.uniform(5,16));c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(x,y);c.line_to(x+L*math.cos(a),y+L*math.sin(a));c.stroke()
        return
    k=min(1,(age-.14)/1.35)
    ramp=[(0,'#fff0a0','#ffb81f'),(.25,'#ffd24a','#ff8a1c'),(.55,'#f77a21','#b8481a'),(.8,'#7b4a33','#4a2d24'),(1,'#463532','#2d2223')]
    for i in range(len(ramp)-1):
        if ramp[i][0]<=k<=ramp[i+1][0]:
            m=(k-ramp[i][0])/(ramp[i+1][0]-ramp[i][0]);a,b=rgb(ramp[i][1]),rgb(ramp[i+1][1]);a2,b2=rgb(ramp[i][2]),rgb(ramp[i+1][2])
            A=tuple(a[j]+(b[j]-a[j])*m for j in range(3))+(1,);B=tuple(a2[j]+(b2[j]-a2[j])*m for j in range(3))+(1,);break
    gr=eout((age-.14)/.5);rise=age*90
    for i in range(14):
        ang=r.uniform(0,6.28);d=R*r.uniform(.1,.72)*gr;rr=R*r.uniform(.28,.5)*gr
        px,py=x+d*math.cos(ang),y+d*math.sin(ang)*.8-rise
        circ(c,px,py,rr,rg(px-rr*.3,py-rr*.35,rr*.1,rr*1.1,[(0,A),(1,B)]),'#2a1a14',3)
    if age<.75:glow(c,x,y-rise,R*2.2,(1,.7,.3),.8*(1-age/.75))
    for i in range(12):
        ang=r.uniform(-3.1,0);sp=R*r.uniform(1,2.1);px=x+sp*math.cos(ang)*age;py=y+sp*math.sin(ang)*age+520*age*age;ro=age*r.uniform(-9,9)
        c.save();c.translate(px,py);c.rotate(ro);rect(c,-46,-9,92,18,'#a96f39',INK,3);c.restore()
def bill(c,x,y,w,rot=0,flip=1.):
    c.save();c.translate(x,y);c.rotate(rot);c.scale(1,max(.08,abs(flip)));h=w*.45
    rect(c,-w/2,-h/2,w,h,'#7fbe6a',INK,max(2,w*.03));circ(c,0,0,h*.32,'#cfe7b4',INK,max(1.5,w*.015));c.restore()
def bag(c,x,y,s=1,col='#c9a163'):
    c.save();c.translate(x,y);c.scale(s,s);blob(c,0,-70,72,72,seed=3,amp=3);c.set_source(rg(-20,-90,6,90,[(0,shade(col,1.15)),(1,shade(col,.68))]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(6);c.stroke()
    poly(c,[(-24,-138),(24,-138),(36,-170),(-36,-170)],shade(col,.9),INK,5);rect(c,-26,-146,52,10,'#6e3f1e');text(c,'$',0,-44,76,'#3f2a12');c.restore()
def rdoor(c,x,y,R,t=0,spin=0,hole=0,steel=('#dbe2e8','#8896a4','#4c5563')):
    """round vault door facing camera; hole=keyhole radius in the centre (see through)"""
    c.save();c.translate(x,y)
    c.new_path();c.arc(0,0,R,0,6.2832)
    if hole:c.new_sub_path();c.arc(0,0,hole,0,6.2832)
    c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD);c.set_source(lg(c,-R,-R,R,R,[(0,steel[0]),(.5,steel[1]),(1,steel[2])]));c.fill_preserve();c.set_source_rgba(*rgb(INK));c.set_line_width(max(5,R*.018));c.stroke()
    c.set_fill_rule(cairo.FILL_RULE_WINDING)
    circ(c,0,0,R*.93,None,(0,0,0,.28),R*.012+2);circ(c,0,0,R*.72,None,(1,1,1,.3),R*.008+2)
    for i in range(20):
        a=i/20*6.2832;circ(c,R*.83*math.cos(a),R*.83*math.sin(a),R*.038,rg(R*.83*math.cos(a)-3,R*.83*math.sin(a)-3,1,R*.04,[(0,'#f6f8fa'),(1,'#6d7884')]),INK,2)
    if not hole:
        for i in range(3):
            a=spin+i/3*6.2832;c.set_source_rgba(*rgb('#2f3640'));c.set_line_width(R*.05);c.set_line_cap(cairo.LINE_CAP_ROUND);c.move_to(0,0);c.line_to(R*.34*math.cos(a),R*.34*math.sin(a));c.stroke()
            circ(c,R*.34*math.cos(a),R*.34*math.sin(a),R*.042,'#ffd23f',INK,3)
        circ(c,0,0,R*.1,lg(c,-R*.1,-R*.1,R*.1,R*.1,[(0,'#f6c34a'),(1,'#a56f14')]),INK,4)
    else:
        circ(c,0,0,hole,None,'#2f3640',hole*.12)
    c.restore()
def sphere(c,x,y,R,cols=('#e6edf2','#90a0ae','#39424e')):
    circ(c,x,y,R,rg(x-R*.35,y-R*.42,R*.06,R*1.12,[(0,cols[0]),(.5,cols[1]),(1,cols[2])]),INK,max(6,R*.016))
def speed_blur(arr,dx,dy):
    n=4;acc=np.zeros(arr.shape,np.float32)
    for k in range(-n,n+1):acc+=np.roll(arr,(int(dy*k/n),int(dx*k/n)),axis=(0,1))
    return (acc/(2*n+1)).astype(np.uint8)
def grade(rgbarr,g,sat):
    """arr is BGR uint8; g=(r,g,b) gains. Highlights keep their colour so fire and windows still glow."""
    x=rgbarr.astype(np.float32)/255;lum=(x*np.array([.114,.587,.299],np.float32)).sum(-1,keepdims=True)
    y=lum+(x-lum)*sat;y=y*np.array([g[2],g[1],g[0]],np.float32);w=np.clip((lum-.68)/.22,0,1)
    return (np.clip(y*(1-w)+x*w,0,1)*255).astype(np.uint8)
