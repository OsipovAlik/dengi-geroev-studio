import * as THREE from '/node_modules/three/build/three.module.js';
const q=new URLSearchParams(location.search);
const GW=+(q.get('gw')||720),GH=+(q.get('gh')||1280),W=+(q.get('w')||1080),H=+(q.get('h')||1920),SM=+(q.get('sm')||1536);
const STORY=q.get('story');const TM=await (await fetch('/'+STORY+'/timing.json')).json();
for(const[n,r]of[['cyrillic','U+0400-04FF,U+2116'],['latin','U+0000-00FF,U+2000-206F,U+20AC']]){const ff=new FontFace('Pop',`url(/node_modules/@fontsource/inter/files/inter-${n}-800-normal.woff2)`,{weight:'800',unicodeRange:r});await ff.load();document.fonts.add(ff)}
const INK='#15131a',PINK=new THREE.Color('#f0559c'),PINK2=new THREE.Color('#f57fb6'),TEAL=new THREE.Color('#5f8c9e'),WHITE=new THREE.Color('#fff');
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lerp=(a,b,u)=>a+(b-a)*u,ss=(a,b,x)=>{const u=clamp((x-a)/(b-a));return u*u*(3-2*u)},ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const seg=id=>TM.segs.find(s=>s.id===id);
const cap=(txt)=>TM.caps.find(c=>c.text===txt);
const gl=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});gl.setPixelRatio(1);gl.setSize(GW,GH);gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFShadowMap;
const out=document.createElement('canvas');out.width=W;out.height=H;const C=out.getContext('2d');document.body.appendChild(out);
const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(60,GW/GH,.05,900);
// ---------- textures
function canvasTex(w,h,draw,opt={}){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=opt.linear?THREE.NoColorSpace:THREE.SRGBColorSpace;t.anisotropy=4;if(opt.wrap){t.wrapS=t.wrapT=THREE.RepeatWrapping}return t}
function brick(tileW=2,opt={}){const R=rng(opt.seed||7);return canvasTex(1024,1024,(c,w,h)=>{c.fillStyle='#b9b9b9';c.fillRect(0,0,w,h);const rows=8,cols=4,bh=h/rows,bw=w/cols;for(let r=0;r<rows;r++)for(let i=-1;i<=cols;i++){const x=i*bw+(r%2?bw/2:0),g=225+R()*30|0;c.fillStyle=`rgb(${g},${g},${g})`;c.fillRect(x+5,r*bh+5,bw-10,bh-10);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x+5,r*bh+5,bw-10,5);c.fillStyle='rgba(0,0,0,.09)';c.fillRect(x+5,r*bh+bh-13,bw-10,8)}c.strokeStyle='rgba(20,20,30,.55)';c.lineWidth=3;for(let r=0;r<rows;r++)for(let i=-1;i<=cols;i++){const x=i*bw+(r%2?bw/2:0);c.strokeRect(x+5,r*bh+5,bw-10,bh-10)}},{wrap:true})}
const BRICK=brick();BRICK.repeat.set(.5,.5);
const CONC=canvasTex(512,512,(c,w,h)=>{const R=rng(3);c.fillStyle='#e9e9e9';c.fillRect(0,0,w,h);for(let i=0;i<1500;i++){c.fillStyle=`rgba(0,0,0,${R()*.04})`;c.fillRect(R()*w,R()*h,3+R()*14,2+R()*6)}c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=2;c.strokeRect(0,0,w,h)},{wrap:true});CONC.repeat.set(.4,.4);
function label(w,h,bg,lines,opt={}){return canvasTex(w,h,(c)=>{if(bg){c.fillStyle=bg;c.fillRect(0,0,w,h)}if(opt.border){c.strokeStyle=opt.border;c.lineWidth=opt.bw||10;c.strokeRect(6,6,w-12,h-12)}c.textAlign='center';c.textBaseline='middle';lines.forEach(l=>{c.fillStyle=l.c||INK;c.font=`800 ${l.s}px Pop`;c.fillText(l.t,w/2,l.y*h,w-30)});opt.extra&&opt.extra(c,w,h)})}
const GLOW=canvasTex(256,256,(c)=>{const g=c.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,256,256)});
const SHAFT=canvasTex(64,256,(c)=>{const g=c.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,64,256)});
// ---------- geometry helpers
function lam(col,o={}){return new THREE.MeshLambertMaterial({color:col,...o})}
const EDGE=new THREE.LineBasicMaterial({color:0x15131a,transparent:true,opacity:.75});
function box(w,h,d,col,x=0,y=0,z=0,o={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),col.isMaterial?col:lam(col,o));m.position.set(x,y,z);m.castShadow=o.cast!==false;m.receiveShadow=true;if(o.edge!==false)m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),EDGE));return m}
function cyl(r,h,col,x=0,y=0,z=0,o={}){const m=new THREE.Mesh(new THREE.CylinderGeometry(o.r2||r,r,h,o.seg||48),col.isMaterial?col:lam(col));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}
function plane(w,h,mat,x=0,y=0,z=0,rx=0,ry=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,0);return m}
function wallShape(w,h,holes=[]){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h);s.lineTo(-w/2,h);s.closePath();for(const [x,y,hw,hh] of holes){const p=new THREE.Path();p.moveTo(x-hw/2,y-hh/2);p.lineTo(x-hw/2,y+hh/2);p.lineTo(x+hw/2,y+hh/2);p.lineTo(x+hw/2,y-hh/2);p.closePath();s.holes.push(p)}return new THREE.ShapeGeometry(s)}
function sunRig(group,pos,target,col,int,size=9){const d=new THREE.DirectionalLight(col,int);d.position.set(...pos);d.target.position.set(...target);d.castShadow=true;d.shadow.mapSize.set(SM,SM);const s=d.shadow.camera;s.left=-size;s.right=size;s.top=size;s.bottom=-size;s.near=.5;s.far=60;d.shadow.bias=-.0006;d.shadow.normalBias=.012;group.add(d,d.target);return d}
// ---------- puppets
const KIND={officer:{leg:300,bw:150,bh:262,hw:124,hh:116,sh:1,col:'#22365f'},officer2:{leg:280,bw:175,bh:252,hw:118,hh:118,sh:1,col:'#22365f'},researcher:{leg:345,bw:128,bh:290,hw:122,hh:122,col:'#f4f6f5'},inmate:{leg:185,bw:345,bh:335,hw:150,hh:124,col:'#ee7a22'},player:{leg:270,bw:230,bh:270,hw:120,hh:118,col:'#2d6a4f'},man:{leg:330,bw:140,bh:280,hw:122,hh:120,col:'#3f6fb5'},woman:{leg:320,bw:125,bh:275,hw:118,hh:118,col:'#d9506a'},big:{leg:230,bw:300,bh:320,hw:128,hh:122,col:'#6a4fa3'}};
function arm(c,sx,sy,a1,a2,len,th){const ex=sx+Math.sin(a1)*len,ey=sy+Math.cos(a1)*len,hx=ex+Math.sin(a1+a2)*len,hy=ey+Math.cos(a1+a2)*len;c.strokeStyle=INK;c.lineWidth=th;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(sx,sy);c.lineTo(ex,ey);c.lineTo(hx,hy);c.stroke();c.fillStyle=INK;c.beginPath();c.arc(hx,hy,th*.8,0,7);c.fill();return[hx,hy]}
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
function prop(c,name,x,y,a){c.save();c.translate(x,y);c.rotate(a||0);c.lineWidth=7;c.strokeStyle=INK;
 if(name==='card'){c.rotate(-.12);c.fillStyle='#fff';rr(c,-62,-150,124,170,6);c.fill();c.stroke();c.fillStyle='#f0559c';c.fillRect(-52,-140,104,110);c.fillStyle=INK;c.font='800 24px Pop';c.textAlign='center';c.fillText('P-618',0,2)}
 if(name==='roller'){c.lineWidth=11;c.beginPath();c.moveTo(0,20);c.lineTo(0,-260);c.stroke();c.lineWidth=7;c.fillStyle='#f0559c';rr(c,-62,-292,124,38,10);c.fill();c.stroke()}
 if(name==='cup'){c.fillStyle='#fff';rr(c,-30,-44,60,44,[3,3,20,20]);c.fill();c.stroke();c.beginPath();c.arc(36,-24,14,-1.4,1.4);c.stroke();c.fillStyle='#fff';c.beginPath();c.ellipse(0,6,46,8,0,0,7);c.fill();c.stroke()}
 if(name==='cash'){c.rotate(-.1);for(let i=0;i<5;i++){c.fillStyle='#6fbf73';rr(c,-70,-44-i*11,140,50,4);c.fill();c.stroke()}c.fillStyle='#fff';c.beginPath();c.arc(0,-68,20,0,7);c.fill();c.stroke();c.fillStyle=INK;c.font='800 30px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('$',0,-67)}
 if(name==='bag'){c.fillStyle='#c9a15c';c.beginPath();c.ellipse(0,-70,72,78,0,0,7);c.fill();c.stroke();c.fillStyle=INK;c.font='800 72px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('$',0,-66);c.lineWidth=11;c.beginPath();c.moveTo(-22,-146);c.lineTo(22,-146);c.stroke()}
 if(name==='phone'){c.fillStyle='#22242c';rr(c,-36,-120,72,130,12);c.fill();c.stroke();c.fillStyle='#8fd3ff';c.fillRect(-27,-108,54,104)}
 if(name==='key'){c.lineWidth=11;c.strokeStyle='#d8a83a';c.beginPath();c.arc(0,-90,24,0,7);c.moveTo(0,-66);c.lineTo(0,0);c.moveTo(0,-12);c.lineTo(20,-12);c.stroke()}
 if(name==='clip'){c.fillStyle='#8a5a33';rr(c,-55,-140,110,150,6);c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(-44,-126,88,124);c.fillStyle='#999';for(let i=0;i<5;i++)c.fillRect(-36,-112+i*22,72,5)}
 c.restore()}
function drawPuppet(c,kind,p){const k=KIND[kind];c.clearRect(0,0,640,1024);c.save();c.translate(320,1006);const talk=p.talk||0;
 const sit=p.sit||0,squat=(p.squat||0);const hipY=-(k.leg-squat)*(1-sit*.42)+(p.bob||0);
 c.lineCap='round';c.lineJoin='round';c.strokeStyle=INK;const legTh=kind==='inmate'?26:17;c.lineWidth=legTh;const legX=k.bw*.27;
 const sw=p.walk||0;
 if(sit>.5){for(const s of[-1,1]){c.beginPath();c.moveTo(s*legX,hipY);c.lineTo(s*(legX+26),-k.leg*.28);c.lineTo(s*(legX+18),-6);c.stroke();c.beginPath();c.moveTo(s*(legX+18),-6);c.lineTo(s*(legX+44),-6);c.stroke()}}
 else for(const s of[-1,1]){const f=s*legX+sw*s*44;c.beginPath();c.moveTo(s*legX,hipY);c.quadraticCurveTo(s*legX+sw*s*10,hipY*.45,f,-Math.max(0,sw*s)*26-6);c.stroke();c.beginPath();c.moveTo(f,-Math.max(0,sw*s)*26-6);c.lineTo(f+(p.look>=0?1:-1)*32,-Math.max(0,sw*s)*26-6);c.stroke()}
 c.rotate(p.lean||0);
 const by=hipY-k.bh;c.lineWidth=11;
 const sy=by+(kind==='inmate'?50:42),sx=k.bw/2-(kind==='inmate'?18:8);const armLen=kind==='inmate'?122:108,armTh=kind==='inmate'?22:14;
 // back arm
 const aL=p.aL||[.25,.2],aR=p.aR||[.25,.2];
 const hL=arm(c,-sx,sy,-aL[0],-aL[1],armLen,armTh);
 c.strokeStyle=INK;c.lineWidth=11;
 if(kind==='inmate'){c.fillStyle=k.col;c.beginPath();c.moveTo(-k.bw/2+22,by);c.quadraticCurveTo(-k.bw/2-4,by+60,-k.bw/2+10,hipY-4);c.lineTo(k.bw/2-10,hipY-4);c.quadraticCurveTo(k.bw/2+4,by+60,k.bw/2-22,by);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';rr(c,-62,by+95,124,54,6);c.fill();c.lineWidth=6;c.stroke();c.fillStyle=INK;c.font='800 36px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(p.num||'4471',0,by+123);c.lineWidth=7;c.beginPath();c.moveTo(-k.bw/2+12,hipY-52);c.lineTo(k.bw/2-12,hipY-52);c.stroke()}
 else{c.fillStyle=p.col||k.col;rr(c,-k.bw/2,by,k.bw,k.bh,[44,44,22,22]);c.fill();c.stroke();
  if(kind.startsWith('officer')){c.fillStyle='#fff';c.beginPath();c.moveTo(-k.bw/2+18,by+8);c.lineTo(0,by+96);c.lineTo(k.bw/2-18,by+8);c.closePath();c.fill();c.lineWidth=6;c.stroke();c.fillStyle='#d8263f';c.beginPath();c.moveTo(-20,by+76);c.lineTo(20,by+76);c.lineTo(0,by+124);c.closePath();c.fill();c.stroke();c.fillStyle='#e7c14c';for(let i=0;i<3;i++){c.beginPath();c.arc(-k.bw/2+36,by+148+i*36,8,0,7);c.fill()}if(p.tag){c.fillStyle='#fff';rr(c,-6,by+140,k.bw/2-8,34,4);c.fill();c.lineWidth=4;c.stroke();c.fillStyle=INK;c.font='800 18px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(p.tag,(k.bw/2-14)/2,by+158)}}
  if(kind==='researcher'){c.lineWidth=6;c.beginPath();c.moveTo(0,by+8);c.lineTo(0,hipY);c.stroke();c.fillStyle='#dfe5e4';c.beginPath();c.moveTo(-34,by+6);c.lineTo(0,by+76);c.lineTo(34,by+6);c.closePath();c.fill();c.stroke();c.fillStyle='#2f9e6e';c.beginPath();c.moveTo(0,by+36);c.lineTo(-34,by+18);c.lineTo(-34,by+56);c.closePath();c.moveTo(0,by+36);c.lineTo(34,by+18);c.lineTo(34,by+56);c.closePath();c.fill();c.stroke();c.fillStyle='#b9c3c1';c.fillRect(22,by+140,34,5)}
  if(['man','big'].includes(kind)&&p.tie!==false){c.fillStyle=p.tie||'#d8263f';c.lineWidth=6;c.beginPath();c.moveTo(-14,by+8);c.lineTo(14,by+8);c.lineTo(20,by+120);c.lineTo(0,by+150);c.lineTo(-20,by+120);c.closePath();c.fill();c.stroke()}
  if(kind==='player'){c.fillStyle='#fff';c.font='800 96px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('12',0,by+130)}}
 // head
 const hx=(p.look||0)*6,hy=by-k.hh+18,hw=k.hw,hh=k.hh;c.save();c.translate(hx,hy);c.rotate(p.tilt||0);
 const headPath=()=>{c.beginPath();if(kind==='inmate')c.roundRect(-hw,-hh,hw*2,hh*2,[hw*.62,hw*.62,hh*.85,hh*.85]);else c.ellipse(0,0,hw,hh,0,0,7)};
 c.fillStyle=p.red?`rgb(255,${236-p.red*90},${225-p.red*110})`:'#f7f0e7';headPath();c.fill();c.save();headPath();c.clip();c.fillStyle='rgba(120,90,110,.13)';c.beginPath();c.ellipse(hw*.52,hh*.5,hw*.95,hh*.9,0,0,7);c.fill();if(kind==='inmate'){c.fillStyle='rgba(60,60,70,.18)';c.fillRect(-hw,hh*.28,hw*2,hh)}c.restore();c.lineWidth=11;c.strokeStyle=INK;headPath();c.stroke();
 const lx=(p.look||0)*hw*.28,fy=hh*.12;const e=p.expr||'neutral';c.strokeStyle=INK;c.fillStyle=INK;c.lineWidth=9;const ex=hw*.36;const blink=p.blink;
 if(kind==='inmate'){c.fillStyle='#f7f0e7';for(const s of[-1,1]){c.beginPath();c.arc(s*hw*1.04,6,17,0,7);c.fill();c.lineWidth=8;c.stroke()}c.fillStyle=INK;c.lineWidth=7;c.strokeStyle='#d8263f';if(e!=='smile'){c.beginPath();c.moveTo(-hw*.72,-hh*.5);c.lineTo(-hw*.48,-hh*.26);c.moveTo(-hw*.48,-hh*.54);c.lineTo(-hw*.7,-hh*.24);c.stroke()}c.strokeStyle=INK;c.lineWidth=9}
 const eyes=(d)=>{for(const s of[-1,1])d(s*ex+lx,fy-hh*.12,s)};
 if(blink&&e!=='smile'&&e!=='rage'){eyes((x,y)=>{c.beginPath();c.moveTo(x-18,y);c.lineTo(x+18,y);c.stroke()})}
 else if(e==='neutral'||e==='sly'){eyes((x,y,s)=>{c.beginPath();c.arc(x,y,11,0,7);c.fill();c.beginPath();const t=e==='sly'?-.18:.02;c.moveTo(x-24,y-24+s*t*24);c.lineTo(x+24,y-24-s*t*24);c.stroke()})}
 else if(e==='smile'){eyes((x,y)=>{c.beginPath();c.arc(x,y+6,18,Math.PI*1.1,Math.PI*1.9);c.stroke()})}
 else if(e==='angry'){eyes((x,y,s)=>{c.beginPath();c.arc(x,y+6,10,0,7);c.fill();c.lineWidth=13;c.beginPath();c.moveTo(x-s*30,y-30);c.lineTo(x+s*30,y-4);c.moveTo(x+s*30,y-4);c.stroke();c.lineWidth=9})}
 else if(e==='rage'){eyes((x,y,s)=>{c.fillStyle='#fff';c.beginPath();c.ellipse(x,y+4,27,20,0,0,7);c.fill();c.stroke();c.fillStyle='#e01530';c.beginPath();c.arc(x,y+4,11,0,7);c.fill();c.fillStyle=INK;c.lineWidth=15;c.beginPath();c.moveTo(x-s*36,y-36);c.lineTo(x+s*36,y-2);c.stroke();c.lineWidth=9})}
 else if(e==='shock'){eyes((x,y)=>{c.fillStyle='#fff';c.beginPath();c.arc(x,y,24,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(x,y,8,0,7);c.fill()})}
 if(kind==='researcher'){c.lineWidth=6;for(const s of[-1,1]){c.beginPath();c.arc(s*ex+lx,fy-hh*.12,32,0,7);c.stroke()}c.beginPath();c.moveTo(lx-ex+32,fy-hh*.12);c.lineTo(lx+ex-32,fy-hh*.12);c.stroke();c.lineWidth=9}
 const my=fy+hh*.42;c.lineWidth=9;
 if(e==='smile'){c.beginPath();c.arc(lx,my-14,30,.25,Math.PI-.25);c.stroke()}
 else if(e==='rage'){c.fillStyle='#fff';rr(c,lx-58,my-16,116,44,12);c.fill();c.stroke();c.lineWidth=5;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(lx+i*20,my-16);c.lineTo(lx+i*20,my+28);c.stroke()}c.beginPath();c.moveTo(lx-58,my+6);c.lineTo(lx+58,my+6);c.stroke()}
 else if(e==='angry'){c.beginPath();c.arc(lx,my+22,30,Math.PI+.5,-.5);c.stroke()}
 else if(e==='shock'||talk>.25){c.fillStyle='#4a1020';c.beginPath();c.ellipse(lx,my,16+talk*6,6+talk*18+(e==='shock'?10:0),0,0,7);c.fill();c.stroke()}
 else{c.beginPath();c.moveTo(lx-18,my);c.lineTo(lx+18,my-(e==='sly'?6:0));c.stroke()}
 // head decor
 if(kind==='officer'){c.fillStyle='#fff';c.beginPath();c.moveTo(-hw*.62,-hh*.72);c.lineTo(-hw*.48,-hh*1.28);c.lineTo(hw*.48,-hh*1.28);c.lineTo(hw*.62,-hh*.72);c.closePath();c.fill();c.lineWidth=9;c.stroke();rr(c,-hw*.72,-hh*.86,hw*1.44,30,14);c.fill();c.stroke();c.lineWidth=11;c.beginPath();c.moveTo(lx-34,my-22);c.quadraticCurveTo(lx,my-4,lx+34,my-22);c.stroke()}
 if(kind==='officer2'){c.fillStyle='#fff';c.beginPath();c.moveTo(-hw*.62,-hh*.72);c.lineTo(-hw*.48,-hh*1.28);c.lineTo(hw*.48,-hh*1.28);c.lineTo(hw*.62,-hh*.72);c.closePath();c.fill();c.lineWidth=9;c.stroke();rr(c,-hw*.72,-hh*.86,hw*1.44,30,14);c.fill();c.stroke();c.fillStyle='#b43f2a';c.beginPath();c.ellipse(lx,my+40,50,20,0,0,7);c.fill()}
 if(kind==='woman'){c.fillStyle=p.hair||'#5b2f1d';for(const s of[-1,1]){c.beginPath();c.ellipse(s*hw*.98,hh*.25,hw*.3,hh*.95,0,0,7);c.fill();c.lineWidth=7;c.stroke()}}
 if(kind==='researcher'||kind==='man'||kind==='big'||kind==='woman'){c.fillStyle=kind==='researcher'?INK:(p.hair||'#3a2418');c.beginPath();c.moveTo(-hw*1.02,-hh*.1);c.quadraticCurveTo(-hw*1.05,-hh*1.25,hw*.1,-hh*1.1);c.quadraticCurveTo(hw*1.05,-hh*1.05,hw*1.0,-hh*.2);c.quadraticCurveTo(hw*.5,-hh*.82,-hw*.3,-hh*.62);c.quadraticCurveTo(-hw*.75,-hh*.6,-hw*1.02,-hh*.1);c.fill()}
 if(kind==='player'){c.fillStyle='#2d6a4f';c.beginPath();c.arc(0,-hh*.42,hw*1.04,Math.PI*.98,Math.PI*2.02);c.fill();c.lineWidth=10;c.stroke();c.strokeStyle='#ddd';c.lineWidth=8;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*46,fy+hh*.44);c.lineTo(i*46,fy+hh*.86);c.stroke()}}
 if(e==='rage'&&p.red){c.strokeStyle='#d01030';c.lineWidth=7;c.beginPath();c.moveTo(hw*.55,-hh*.76);c.lineTo(hw*.72,-hh*.42);c.lineTo(hw*.5,-hh*.46);c.lineTo(hw*.68,-hh*.14);c.stroke()}
 c.restore();
 const hR=arm(c,sx,sy,aR[0],aR[1],armLen,armTh);
 if(p.propR)prop(c,p.propR,hR[0],hR[1],p.propA||0);if(p.propL)prop(c,p.propL,hL[0],hL[1],p.propA||0);
 c.restore()}
class Puppet{constructor(kind,h){this.kind=kind;this.h=h;this.c=document.createElement('canvas');this.c.width=640;this.c.height=1024;this.x=this.c.getContext('2d');this.t=new THREE.CanvasTexture(this.c);this.t.colorSpace=THREE.SRGBColorSpace;const w=h*640/1024;
 const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);this.m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:this.t,transparent:true,alphaTest:.04,side:THREE.DoubleSide}));this.m.castShadow=true;this.m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:this.t,alphaTest:.5,side:THREE.DoubleSide});
 this.blob=plane(w*.72,w*.28,new THREE.MeshBasicMaterial({map:GLOW,color:0x000000,transparent:true,opacity:.42,depthWrite:false}),0,.012,0,-Math.PI/2);this.m.add(this.blob);this.m.frustumCulled=false}
 pose(x,z,p,y=0){this.m.visible=true;this.m.position.set(x,y,z);drawPuppet(this.x,this.kind,p);this.t.needsUpdate=true;this.m.rotation.y=Math.atan2(cam.position.x-x,cam.position.z-z);this.blob.rotation.z=0;this.m.material.color.set(p.tint||'#fff')}
 hide(){this.m.visible=false}}
const blink=(t,s=0)=>((t*.37+s)%1)<.035;const talk=(t,on=1)=>on*(.5+.5*Math.sin(t*19))*(.6+.4*Math.sin(t*7.1));
// ---------- sets
const sets={};function addSet(n,g){g.visible=false;scene.add(g);sets[n]=g;return g}
function makeCell(name){const g=new THREE.Group();const W_=6,D=8,HH=4.3;const wm=new THREE.MeshLambertMaterial({map:BRICK,color:TEAL.clone(),side:THREE.DoubleSide,shadowSide:THREE.DoubleSide});
 const back=new THREE.Mesh(wallShape(W_,HH,[[0,2.75,1.9,1.15]]),wm);back.position.z=-D/2;back.castShadow=back.receiveShadow=true;g.add(back);
 const L=new THREE.Mesh(wallShape(D,HH),wm);L.rotation.y=Math.PI/2;L.position.x=-W_/2;L.castShadow=L.receiveShadow=true;g.add(L);
 const R=new THREE.Mesh(wallShape(D,HH),wm);R.rotation.y=-Math.PI/2;R.position.x=W_/2;R.castShadow=R.receiveShadow=true;g.add(R);
 const F=new THREE.Mesh(wallShape(W_,HH),wm);F.rotation.y=Math.PI;F.position.z=D/2;F.castShadow=F.receiveShadow=true;g.add(F);
 const fm=lam('#9aa3a8',{map:CONC});const floor=plane(W_,D,fm,0,0,0,-Math.PI/2);floor.receiveShadow=true;g.add(floor);
 const cm=lam(TEAL.clone());const ceil=box(W_+.6,.12,D+.6,cm,0,HH+.06,0,{edge:false});g.add(ceil);
 // window
 const wg=new THREE.Group();wg.position.set(0,2.75,-D/2);for(let i=-3;i<=3;i++)wg.add(box(.05,1.15,.05,'#3c4a55',i*.27,0,0,{edge:false}));wg.add(box(1.9,.05,.05,'#3c4a55',0,0,0,{edge:false}));wg.add(box(2.05,.09,.2,'#59656e',0,-.62,.04));wg.add(box(2.05,.09,.2,'#59656e',0,.62,.04));
 wg.add(plane(1.9,1.15,new THREE.MeshBasicMaterial({color:'#f3fbff'}),0,0,-.3));wg.add(plane(4.4,3.4,new THREE.MeshBasicMaterial({map:GLOW,color:'#ffffff',transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,.05));g.add(wg);
 // shaft
 const sm=new THREE.MeshBasicMaterial({map:SHAFT,color:'#fff4e6',transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});const shaft=plane(2.2,5.4,sm,.05,1.55,-2.15,-.62);g.add(shaft);
 // fixture
 const fx=new THREE.Group();fx.position.set(0,HH-.12,.2);fx.add(box(.5,.09,1.9,'#d6dadb',0,0,0));fx.add(plane(.4,1.8,new THREE.MeshBasicMaterial({color:'#fffbe8'}),0,-.05,0,Math.PI/2));const fg=plane(2.6,3.4,new THREE.MeshBasicMaterial({map:GLOW,color:'#fff2d6',transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}),0,-.07,0,Math.PI/2);fx.add(fg);g.add(fx);
 // pipe + vent
 g.add(cyl(.05,D,'#6b757b',W_/2-.18,HH-.2,0).rotateX(Math.PI/2));g.add(box(.8,.5,.06,'#59656e',-1.7,3.75,-D/2+.03));
 // bench on left wall
 const bench=new THREE.Group();bench.position.set(-W_/2+.55,0,.2);bench.add(box(.85,.1,2.8,'#c9ced1',0,.62,0));bench.add(box(.6,.6,.12,'#6b757b',0,.3,-1.1));bench.add(box(.6,.6,.12,'#6b757b',0,.3,1.1));g.add(bench);
 const hemi=new THREE.HemisphereLight('#ffffff','#c9c6cf',3.5);g.add(hemi);const sun=sunRig(g,[1.4,7.2,-10],[-.2,0,1.2],'#fff4df',3.6,8);
 // paint mask overlays
 const maskC=document.createElement('canvas');maskC.width=512;maskC.height=360;const mt=new THREE.CanvasTexture(maskC);mt.colorSpace=THREE.NoColorSpace;mt.repeat.set(1/W_,1/HH);mt.offset.set(.5,0);
 const pm=new THREE.MeshLambertMaterial({map:BRICK,color:PINK.clone(),alphaMap:mt,transparent:true,side:THREE.DoubleSide,depthWrite:false});
 const pback=new THREE.Mesh(wallShape(W_,HH,[[0,2.75,1.9,1.15]]),pm);pback.position.z=-D/2+.006;pback.receiveShadow=true;pback.visible=false;g.add(pback);
 const pm2=pm.clone();const maskC2=document.createElement('canvas');maskC2.width=512;maskC2.height=360;const mt2=new THREE.CanvasTexture(maskC2);mt2.colorSpace=THREE.NoColorSpace;mt2.repeat.set(1/D,1/HH);mt2.offset.set(.5,0);pm2.alphaMap=mt2;const pL=new THREE.Mesh(wallShape(D,HH),pm2);pL.rotation.y=Math.PI/2;pL.position.x=-W_/2+.006;pL.receiveShadow=true;pL.visible=false;g.add(pL);
 // divider for split room
 const divider=box(.16,HH,5,'#3a3f47',0,HH/2,-1.5,{edge:true});divider.visible=false;g.add(divider);
 // tally / debris
 const N=46;const debris=new THREE.InstancedMesh(new THREE.BoxGeometry(.46,.2,.24),lam('#f6a7cc'),N);debris.castShadow=true;debris.frustumCulled=false;debris.visible=false;g.add(debris);
 addSet(name,g);return{g,wm,cm,fm,back,hemi,sun,sm,pback,pL,maskC,mt,maskC2,mt2,pm,pm2,divider,debris,fg,
  color(u,base=TEAL,to=PINK){wm.color.copy(base).lerp(to,u);cm.color.copy(wm.color).multiplyScalar(.86);fm.color.set('#9aa3a8').lerp(to===PINK||to===PINK2?new THREE.Color('#d8a6bb'):to.clone().lerp(new THREE.Color('#9aa3a8'),.72),u)}}}
const cell=makeCell('cell');
// corridor
function makeCorridor(){const g=new THREE.Group();const LEN=46,HH=4.6,DW=1.5,DH=2.65;const holes=[];for(let i=0;i<6;i++)holes.push([i*6-12,DH/2+.001,DW,DH]);
 const up=new THREE.MeshLambertMaterial({map:BRICK,color:'#b5c2c6',side:THREE.DoubleSide,shadowSide:THREE.DoubleSide});const wall=new THREE.Mesh(wallShape(LEN,HH,holes),up);wall.castShadow=wall.receiveShadow=true;g.add(wall);
 // lower tile band pieces
 for(let i=0;i<7;i++){const x0=(i-1)*6-12+DW/2,w=6-DW;if(i>0&&i<6||true){const m=box(w,1.25,.06,'#3f8fa8',x0+w/2,.625,.04);g.add(m)}}
 g.add(box(LEN,.1,.08,'#e9eef0',0,1.3,.05,{edge:false}));
 const floor=plane(LEN,14,lam('#c2c6c4',{map:CONC}),0,0,7,-Math.PI/2);floor.receiveShadow=true;g.add(floor);g.add(plane(LEN,.16,new THREE.MeshLambertMaterial({color:'#e7c14c'}),0,.006,3.1,-Math.PI/2));
 const ceil=box(LEN,.14,14,'#7b8d99',0,HH+.07,7,{edge:false});g.add(ceil);for(let i=-3;i<=3;i++){const b=box(.22,.22,14,'#2f6d96',i*6.2,HH-.12,7);g.add(b)}
 const lm=new THREE.MeshBasicMaterial({color:'#fffef0'});for(let i=-3;i<=3;i++){g.add(box(1.5,.08,.4,'#c5cbce',i*6+3,HH-.28,3.6));g.add(plane(1.4,.32,lm,i*6+3,HH-.33,3.6,Math.PI/2))}
 const doors=[];for(let i=0;i<6;i++){const x=holes[i][0];const dg=new THREE.Group();dg.position.set(x,0,0);
  const fr='#1f4256';dg.add(box(DW+.3,.16,.26,fr,0,DH+.08,.02));dg.add(box(.16,DH,.26,fr,-DW/2-.08,DH/2,.02));dg.add(box(.16,DH,.26,fr,DW/2+.08,DH/2,.02));
  const inside=new THREE.Group();const im=new THREE.MeshLambertMaterial({map:BRICK,color:'#7d9aa8',side:THREE.DoubleSide});const ib=plane(3.2,3.1,im,0,1.5,-3.4);inside.add(ib);const il=plane(3.4,3.1,im,-1.6,1.5,-1.7,0,Math.PI/2);const ir=plane(3.4,3.1,im,1.6,1.5,-1.7,0,-Math.PI/2);inside.add(il,ir);inside.add(plane(3.2,3.4,lam('#a0a5a8',{map:CONC}),0,.002,-1.7,-Math.PI/2));inside.add(plane(3.2,3.4,im,0,3,-1.7,Math.PI/2));inside.add(box(1,.62,.04,'#e9f7ff',0,2.05,-3.38,{edge:false}));for(let b=-2;b<=2;b++)inside.add(box(.03,.62,.05,'#333',b*.2,2.05,-3.36,{edge:false}));inside.add(box(1.5,.08,.5,'#c9ced1',.2,.55,-3.05));
  dg.add(inside);const lp=new THREE.PointLight('#ffffff',0,8);lp.position.set(0,2.5,-1.6);inside.add(lp);
  const pivot=new THREE.Group();pivot.position.set(-DW/2,0,.02);const leaf=box(DW,DH,.08,'#2d6a8c',DW/2,DH/2,0);pivot.add(leaf);const hatch=box(.55,.3,.02,'#d7e3ea',DW/2,1.85,.05,{edge:true});pivot.add(hatch);pivot.add(box(.09,.26,.05,'#c7ccce',DW-.16,1.15,.06));dg.add(pivot);
  const sig=new THREE.Mesh(new THREE.PlaneGeometry(.68,.26),new THREE.MeshLambertMaterial({map:label(272,104,'#f4f4ef',[{t:'D-'+(i+1),s:62,y:.54}],{border:INK,bw:7})}));sig.position.set(0,DH+.42,.03);dg.add(sig);g.add(dg);doors.push({dg,pivot,im,lp,inside})}
 const hemi=new THREE.HemisphereLight('#ffffff','#b9bcc4',3.4);g.add(hemi);const sun=sunRig(g,[-5,10,12],[1,0,0],'#fff3e0',2.6,16);
 addSet('corr',g);return{g,doors,up,hemi,sun,
  sign:(()=>{const s=plane(3.5,.62,new THREE.MeshLambertMaterial({map:label(1024,180,'#1b3652',[{t:'U.S. NAVY CORRECTIONAL · SEATTLE',s:64,y:.52,c:'#f4f4ef'}],{border:'#e7c14c',bw:9})}),0,3.9,.04);g.add(s);return s})(),
  swiss:(()=>{const s=plane(.9,.9,new THREE.MeshLambertMaterial({map:canvasTex(256,256,(c)=>{c.fillStyle='#d6202e';c.fillRect(0,0,256,256);c.fillStyle='#fff';c.fillRect(104,48,48,160);c.fillRect(48,104,160,48)})}),0,3.5,.04);s.visible=false;g.add(s);return s})()}}
const corr=makeCorridor();
// desk (top-down)
const SW=document.createElement('canvas');SW.width=SW.height=512;const swT=new THREE.CanvasTexture(SW);swT.colorSpace=THREE.SRGBColorSpace;
function swirl(u,rot){const c=SW.getContext('2d');const pk=ss(.42,1,u);const col=`rgb(${lerp(250,240,pk)},${lerp(248,85,pk)},${lerp(242,156,pk)})`;c.fillStyle=col;c.fillRect(0,0,512,512);c.save();c.translate(256,256);c.rotate(rot);const am=clamp(u*3)*(1-ss(.72,1,u));for(let a=0;a<3;a++){c.rotate(Math.PI*2/3);c.beginPath();for(let r=0;r<230;r+=4){const th=r*.022*(1+u*2.2);const w=(26*am)*(1-r/300);const x=Math.cos(th)*r,y=Math.sin(th)*r;if(r===0)c.moveTo(x,y);else c.lineTo(x,y)}c.lineCap='round';c.lineWidth=46*am+.1;c.strokeStyle=`rgba(217,28,58,${clamp(am*1.3)})`;c.stroke();c.lineWidth=16*am;c.strokeStyle=`rgba(240,85,156,${clamp(am)})`;c.stroke()}c.restore();swT.needsUpdate=true}
function makeDesk(){const g=new THREE.Group();const wood=canvasTex(1024,1024,(c,w,h)=>{const R=rng(11);for(let i=0;i<8;i++){const x=i*w/8,v=R()*26;c.fillStyle=`rgb(${176+v},${122+v*.7},${70+v*.4})`;c.fillRect(x,0,w/8,h);c.strokeStyle='rgba(50,25,10,.75)';c.lineWidth=4;c.strokeRect(x,-5,w/8,h+10);c.strokeStyle='rgba(80,45,20,.2)';c.lineWidth=2;for(let k=0;k<8;k++){c.beginPath();const xx=x+R()*w/8;c.moveTo(xx,0);c.bezierCurveTo(xx+10,h*.3,xx-10,h*.6,xx+4,h);c.stroke()}}},{wrap:true});
 wood.repeat.set(70/9,70/14);const top=plane(70,70,lam('#fff',{map:wood}),0,0,0,-Math.PI/2);top.receiveShadow=true;g.add(top);
 const mat=plane(5.6,7.6,lam('#fff',{map:canvasTex(1024,1400,(c,w,h)=>{c.fillStyle='#2f8f7f';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=2;for(let i=0;i<w;i+=48){c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.stroke()}for(let i=0;i<h;i+=48){c.beginPath();c.moveTo(0,i);c.lineTo(w,i);c.stroke()}c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=7;c.strokeRect(28,28,w-56,h-56)})}),0,.01,0,-Math.PI/2);mat.receiveShadow=true;g.add(mat);
 // gallon can
 const can=new THREE.Group();const side=canvasTex(1024,256,(c,w,h)=>{c.fillStyle='#e9ecec';c.fillRect(0,0,w,h);c.fillStyle='#1f4256';c.fillRect(0,20,w,52);c.fillRect(0,184,w,52);c.fillStyle=INK;c.font='800 86px Pop';c.textBaseline='middle';for(let i=0;i<2;i++)c.fillText('WHITE LATEX',40+i*512,128)},{wrap:true});
 const body=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1.5,64,1,true),lam('#fff',{map:side,side:THREE.DoubleSide}));body.position.y=.75;body.castShadow=true;can.add(body);const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.05,12,64),lam('#c6cbcd'));rim.rotation.x=Math.PI/2;rim.position.y=1.5;can.add(rim);
 const paint=new THREE.Mesh(new THREE.CircleGeometry(.97,64),new THREE.MeshBasicMaterial({map:swT}));paint.rotation.x=-Math.PI/2;paint.position.y=1.42;can.add(paint);g.add(can);
 const lab=plane(2.2,1.1,new THREE.MeshLambertMaterial({map:label(512,256,'#fffdf3',[{t:'P-618',s:128,y:.52}],{border:INK,bw:10})}),-.1,.03,-2.95,-Math.PI/2,0);lab.rotation.z=.12;lab.castShadow=false;g.add(lab);
 // small can
 const small=new THREE.Group();const ss2=canvasTex(512,128,(c,w,h)=>{c.fillStyle='#d91c3a';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font='800 58px Pop';c.textBaseline='middle';c.fillText('RED',40,66);c.fillText('RED',296,66)},{wrap:true});const sb=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.8,48,1,true),lam('#fff',{map:ss2,side:THREE.DoubleSide}));sb.castShadow=true;small.add(sb);const sin_=new THREE.Mesh(new THREE.CircleGeometry(.48,32),new THREE.MeshBasicMaterial({color:'#b5122d'}));sin_.rotation.x=-Math.PI/2;sin_.position.y=.28;small.add(sin_);g.add(small);
 const streamMat=new THREE.MeshLambertMaterial({color:'#d91c3a'});const stream=new THREE.Mesh(new THREE.BufferGeometry(),streamMat);g.add(stream);
 const stir=box(.13,3,.06,'#caa06c',0,0,0);stir.visible=false;g.add(stir);
 // window gobo above
 const gobo=new THREE.Group();gobo.position.set(0,12,0);const lp=new THREE.MeshBasicMaterial({color:0,colorWrite:false,depthWrite:false});for(let i=-7;i<=7;i++){const a=new THREE.Mesh(new THREE.BoxGeometry(.28,.1,30),lp);a.position.x=i*3;a.castShadow=true;gobo.add(a);const b=new THREE.Mesh(new THREE.BoxGeometry(30,.1,.28),lp);b.position.z=i*3;b.castShadow=true;gobo.add(b)}g.add(gobo);
 const hemi=new THREE.HemisphereLight('#fff','#a89a8f',2.6);g.add(hemi);const sun=sunRig(g,[-5,24,6],[.5,0,0],'#fff1d9',2.4,10);
 // paper + stamp + chip
 const paperTex=label(768,1000,'#f6f2e6',[{t:'CONFINEMENT LOG',s:56,y:.1},{t:'NAVY BRIG · SEATTLE · 1979',s:30,y:.17}],{extra:(c,w,h)=>{c.strokeStyle='#8fa7c2';c.lineWidth=3;for(let i=0;i<14;i++){c.beginPath();c.moveTo(50,260+i*48);c.lineTo(w-50,260+i*48);c.stroke()}c.fillStyle=INK;c.font='800 38px Pop';c.textAlign='left';c.fillText('HOSTILE INCIDENTS:',60,300);c.fillText('ERRATIC BEHAVIOR:',60,492)}});
 const paper=plane(4.8,6.25,lam('#fff',{map:paperTex}),0,.04,0,-Math.PI/2);paper.receiveShadow=true;paper.castShadow=false;paper.visible=false;g.add(paper);
 const stamp1=plane(2.1,.84,new THREE.MeshLambertMaterial({map:label(600,240,null,[{t:'NONE',s:150,y:.54,c:'#d0173a'}],{border:'#d0173a',bw:16}),transparent:true}),.35,.06,-.8,-Math.PI/2);stamp1.visible=false;g.add(stamp1);
 const stamp2=plane(2.1,.84,stamp1.material,.35,.06,.42,-Math.PI/2);stamp2.visible=false;g.add(stamp2);
 const chip=new THREE.Group();const face=canvasTex(640,900,(c,w,h)=>{c.fillStyle='#fbfbf8';c.fillRect(0,0,w,h);c.fillStyle='#f0559c';c.fillRect(30,30,w-60,620);c.fillStyle=INK;c.font='800 74px Pop';c.textAlign='center';c.fillText('BAKER-',w/2,738);c.fillText('MILLER PINK',w/2,822,w-50)});
 const chipM=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.5,.05),[lam('#ddd'),lam('#ddd'),lam('#ddd'),lam('#ddd'),lam('#fff',{map:face}),lam('#fbfbf8')]);chipM.castShadow=true;chip.add(chipM);chip.visible=false;g.add(chip);
 addSet('desk',g);return{g,can,small,stream,streamMat,stir,paint,lab,mat,top,paper,stamp1,stamp2,chip,gobo,sun,hemi}}
const desk=makeDesk();
function makeCity(){const g=new THREE.Group();const R=rng(21);const gt=canvasTex(2048,2048,(c,w,h)=>{const cols=['#7fbf5a','#a5cc62','#5ea84f','#d6c56d','#8fbb4e','#c9b05a','#6fb06a'];for(let y=0;y<h;y+=128)for(let x=0;x<w;x+=128){c.fillStyle=cols[R()*cols.length|0];c.fillRect(x,y,128,128);if(R()<.2){c.fillStyle='rgba(30,90,40,.6)';c.beginPath();c.arc(x+64,y+64,52,0,7);c.fill()}}c.strokeStyle='rgba(60,70,40,.5)';c.lineWidth=3;for(let i=0;i<=16;i++){c.beginPath();c.moveTo(i*128,0);c.lineTo(i*128,h);c.moveTo(0,i*128);c.lineTo(w,i*128);c.stroke()}c.strokeStyle='#2b7fc4';c.lineWidth=26;c.lineCap='round';c.beginPath();c.moveTo(0,1500);c.bezierCurveTo(600,1200,800,1900,1300,1400);c.bezierCurveTo(1600,1100,1800,1300,2048,900);c.stroke();c.strokeStyle='#9aa0a4';c.lineWidth=14;c.beginPath();c.moveTo(0,500);c.lineTo(2048,700);c.moveTo(1000,0);c.lineTo(900,2048);c.stroke()});
 const ground=plane(420,420,lam('#fff',{map:gt}),0,0,0,-Math.PI/2);ground.receiveShadow=true;g.add(ground);
 const blocks=[];for(let i=0;i<18;i++){const a=i*2.399,r=10+i*8.2;const x=Math.cos(a)*r,z=Math.sin(a)*r;const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=R()*1.5;const wall=lam('#cfd3d0');const roof=lam('#8c98a0');const w=7+R()*5,d=5+R()*4;const body=box(w,2.4,d,wall,0,1.2,0);const r2=box(w+.3,.3,d+.3,roof,0,2.55,0);b.add(body,r2);for(let k=0;k<2;k++)b.add(box(w*.3,.4,d*.25,roof,(k-.5)*w*.45,2.9,0));if(i%3===0){b.add(box(1,5,1,wall,w/2+1.5,2.5,d/2+1.5));b.add(box(1.6,.5,1.6,roof,w/2+1.5,5.2,d/2+1.5))}g.add(b);blocks.push({r,roof,x,z})}
 const cl=lam('#fff',{flatShading:true});const cloud=new THREE.IcosahedronGeometry(1,1);for(let i=0;i<34;i++){const cg=new THREE.Group();const x=(R()-.5)*260,z=(R()-.5)*260;for(let k=0;k<5;k++){const m=new THREE.Mesh(cloud,cl);m.position.set((k-2)*2.2,R()*1.2,(R()-.5)*2);m.scale.setScalar(1.7+R()*1.9);m.castShadow=true;cg.add(m)}cg.position.set(x,15+R()*5,z);g.add(cg)}
 g.add(new THREE.HemisphereLight('#e8f5ff','#9dbf88',2.9));const sun=sunRig(g,[60,90,50],[0,0,0],'#fff4dc',2.3,120);sun.shadow.camera.far=260;
 addSet('city',g);return{g,blocks}}
const city=makeCity();
function makeLocker(){const R=rng(5);const lk=new THREE.Group();for(let s of[-1,1])for(let i=0;i<9;i++){const b=box(.5,2.5,.85,'#d94f8f',s*(3-.27),1.25,-3.55+i*.9);lk.add(b);lk.add(box(.03,.16,.5,'#7a2150',s*(3-.54),2.1,-3.55+i*.9,{edge:false}));lk.add(box(.03,.16,.5,'#7a2150',s*(3-.54),1.86,-3.55+i*.9,{edge:false}))}
 const sign=plane(2.4,.6,new THREE.MeshLambertMaterial({map:label(600,150,'#fff',[{t:'VISITORS',s:92,y:.54}],{border:INK,bw:9})}),0,3.75,-3.98);lk.add(sign);const benchA=box(.9,.1,2.2,'#8a5a33',0,.6,-.6);benchA.rotation.y=Math.PI/2;lk.add(benchA);lk.add(box(.14,.6,.14,'#333',-.9,.3,-.6),box(.14,.6,.14,'#333',.9,.3,-.6));lk.visible=false;cell.g.add(lk);return lk}
const locker=makeLocker();
function makeBooth(){const g=new THREE.Group();const wm=lam('#fff',{map:BRICK,color:'#2b3e80'});const back=plane(10,6,wm,0,3,-1.2);back.receiveShadow=true;g.add(back);const fl=plane(10,8,lam('#1e2a63'),0,0,2.5,-Math.PI/2);fl.receiveShadow=true;g.add(fl);
 const deskB=box(5,.16,1.7,'#a9652e',0,1.12,.25);g.add(deskB);g.add(box(4.8,1.1,.1,'#6d3f1d',0,.55,1.05));
 const mon=new THREE.Group();mon.position.set(.2,1.2,-.1);mon.add(box(2.2,1.7,.34,'#22242c',0,1.05,0));mon.add(box(.28,.25,.2,'#22242c',0,.13,0));const sc=canvasTex(640,480,(c,w,h)=>{c.fillStyle='#f27fb1';c.fillRect(0,0,w,h);c.fillStyle='#d65f94';c.fillRect(0,0,w,70);c.fillStyle='#a8a3ad';c.beginPath();c.moveTo(0,h);c.lineTo(110,300);c.lineTo(530,300);c.lineTo(w,h);c.fill();c.fillStyle='#f4fbff';c.fillRect(250,100,140,84);c.strokeStyle='#333';c.lineWidth=6;for(let i=0;i<5;i++){c.beginPath();c.moveTo(250+i*35,100);c.lineTo(250+i*35,184);c.stroke()}c.fillStyle='#ee7a22';c.fillRect(280,250,90,120);c.fillStyle='#f7f0e7';c.beginPath();c.arc(325,226,42,0,7);c.fill();c.strokeStyle=INK;c.lineWidth=6;c.stroke();c.fillStyle='#e0304a';c.font='800 34px Pop';c.fillText('● REC',24,50);c.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<h;i+=6)c.fillRect(0,i,w,2)});const screen=plane(2,1.5,new THREE.MeshBasicMaterial({map:sc}),0,1.05,.175);mon.add(screen);mon.add(plane(4,3.2,new THREE.MeshBasicMaterial({map:GLOW,color:'#ff77b0',transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false}),0,1.05,.2));g.add(mon);
 const sg=plane(3.6,.66,new THREE.MeshLambertMaterial({map:label(1024,190,'#0d1a42',[{t:'COUNTY JAIL · CALIFORNIA',s:72,y:.54,c:'#d9e4ff'}],{border:'#7da2ff',bw:8})}),0,4.2,-1.17);g.add(sg);
 g.add(box(.9,.5,.5,'#22242c',-1.9,1.45,0));g.add(cyl(.2,.32,'#fff',1.9,1.36,.4));
 g.add(new THREE.HemisphereLight('#8ea2ff','#141b46',1.5));const pl=new THREE.PointLight('#ff8fc0',8,8);pl.position.set(.2,2.3,.9);g.add(pl);const sun=sunRig(g,[-5,9,7],[0,1,0],'#a8bbff',1.1,7);
 addSet('booth',g);return{g,mon}}
const booth=makeBooth();
// cast
const P={res:new Puppet('researcher',3.0),off:new Puppet('officer',2.8),off2:new Puppet('officer2',2.7),inm:new Puppet('inmate',3.05),inm2:new Puppet('inmate',2.7),ply:new Puppet('player',2.75)};Object.values(P).forEach(p=>{scene.add(p.m);p.hide()});
function hideAll(){Object.values(sets).forEach(s=>s.visible=false);Object.values(P).forEach(p=>p.hide())}
// paint strokes mask
function paintMask(cv,prog,seed,strokes=16){const c=cv.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,cv.width,cv.height);c.strokeStyle='#fff';c.lineCap='round';c.lineWidth=cv.width/strokes*1.45;const R=rng(seed);const n=prog*strokes;for(let i=0;i<strokes;i++){const u=clamp(n-i);if(u<=0)break;const x=(i+.5)*cv.width/strokes+(R()-.5)*8,dir=i%2;const a=dir?cv.height+50:-50,b=dir?-50:cv.height+50;c.beginPath();c.moveTo(x,a);c.lineTo(x+(R()-.5)*14,lerp(a,b,u));c.stroke()}}
// camera helper
function camPath(u,p0,p1,l0,l1,fov,roll=0){const e=ease(u);cam.position.set(lerp(p0[0],p1[0],e),lerp(p0[1],p1[1],e),lerp(p0[2],p1[2],e));cam.lookAt(lerp(l0[0],l1[0],e),lerp(l0[1],l1[1],e),lerp(l0[2],l1[2],e));cam.fov=Array.isArray(fov)?lerp(fov[0],fov[1],e):fov;cam.rotateZ(roll);cam.updateProjectionMatrix()}
function linPath(u,p0,p1,l0,l1,fov,roll=0){cam.position.set(lerp(p0[0],p1[0],u),lerp(p0[1],p1[1],u),lerp(p0[2],p1[2],u));cam.lookAt(lerp(l0[0],l1[0],u),lerp(l0[1],l1[1],u),lerp(l0[2],l1[2],u));cam.fov=Array.isArray(fov)?lerp(fov[0],fov[1],u):fov;cam.rotateZ(roll);cam.updateProjectionMatrix()}
const fx={};const SKY=new THREE.Color('#a9dcfb');
function resetRoom(r){r.g.visible=true;r.pback.visible=false;r.pL.visible=false;r.divider.visible=false;r.debris.visible=false;r.hemi.intensity=3.5;r.hemi.color.set('#fff');r.sun.intensity=3.6;r.sun.position.set(1.4,7.2,-10);r.sm.opacity=.34;r.fg.material.opacity=.4;r.color(0)}
function resetCell(){resetRoom(cell);locker.visible=false}
const E={THREE,TM,scene,cam,gl,fx,SKY,INK,PINK,PINK2,TEAL,WHITE,clamp,lerp,ss,ease,rng,seg,cap,canvasTex,brick,BRICK,CONC,label,GLOW,SHAFT,lam,box,cyl,plane,wallShape,sunRig,KIND,prop,Puppet,blink,talk,sets,addSet,makeCell,makeCorridor,makeDesk,makeCity,makeBooth,cell,corr,desk,city,locker,booth,P,hideAll,paintMask,camPath,linPath,swirl,resetRoom,resetCell,rr,C,W,H};window.E=E;
const shots=(await import('/'+STORY+'/shots.js')).default(E);
window.SHOTS=shots.map(s=>({id:s.id,t0:s.t0,t1:s.t1,in:s.in||null,out:s.out||null}));window.DUR=TM.dur;
// ---------- compositing
const proj=new THREE.Vector3();function toScreen(p){proj.set(...p).project(cam);return[(proj.x*.5+.5)*W,(-proj.y*.5+.5)*H]}
function cracks(x,y,amt,seed){if(amt<=0)return;const R=rng(seed);C.save();C.lineCap='round';C.lineJoin='round';for(let i=0;i<13;i++){const a=i/13*6.283+R()*.45;const len=(420+R()*760)*clamp(amt);let px=x+Math.cos(a)*110,py=y+Math.sin(a)*140;const pts=[[px,py]];let ang=a;const st=9;for(let k=0;k<st;k++){ang=a+(R()-.5)*1.15;const l=len/st;px+=Math.cos(ang)*l;py+=Math.sin(ang)*l;pts.push([px,py])}
  C.shadowColor='rgba(255,20,50,.85)';C.shadowBlur=22;C.strokeStyle='#c30d2a';C.lineWidth=13-(i%3)*2;C.beginPath();pts.forEach((p,j)=>j?C.lineTo(...p):C.moveTo(...p));C.stroke();C.shadowBlur=0;C.strokeStyle='#ff7a8c';C.lineWidth=3;C.stroke()}C.restore()}
function watchHud(w,t){const R_=W*.115,x=W*w.x,y=H*w.y;C.save();C.translate(x,y);C.rotate(Math.sin(t*2)*.03);C.lineWidth=12;C.strokeStyle=INK;C.fillStyle='#d9dde0';C.beginPath();C.rect(-24,-R_-52,48,44);C.fill();C.stroke();C.beginPath();C.arc(0,0,R_+14,0,7);C.fill();C.stroke();C.fillStyle='#fff';C.beginPath();C.arc(0,0,R_,0,7);C.fill();C.lineWidth=5;C.stroke();C.fillStyle='rgba(240,85,156,.55)';C.beginPath();C.moveTo(0,0);C.arc(0,0,R_-4,-Math.PI/2,-Math.PI/2+6.283*(w.v/w.max>1?1:w.v/60*3));C.fill();C.strokeStyle=INK;for(let i=0;i<12;i++){const a=i/12*6.283;C.lineWidth=i%3?4:7;C.beginPath();C.moveTo(Math.sin(a)*(R_-8),-Math.cos(a)*(R_-8));C.lineTo(Math.sin(a)*(R_-24),-Math.cos(a)*(R_-24));C.stroke()}const a=w.v/60*3*6.283;C.lineWidth=9;C.strokeStyle='#d0173a';C.lineCap='round';C.beginPath();C.moveTo(0,0);C.lineTo(Math.sin(a)*(R_-30),-Math.cos(a)*(R_-30));C.stroke();C.fillStyle=INK;C.font='800 62px Pop';C.textAlign='center';C.textBaseline='middle';C.fillText(Math.floor(w.v+1e-6),0,R_*.38);C.font='800 24px Pop';C.fillText(w.lab,0,R_*.72);C.restore()}
function pillTag(txt,x,y,k){if(k<=0)return;C.save();C.translate(x,y);const s=lerp(.3,1,k)+Math.sin(k*3.14)*.14;C.scale(s,s);C.font='800 54px Pop';const tw=C.measureText(txt).width;C.fillStyle='#fff';C.strokeStyle=INK;C.lineWidth=9;C.beginPath();C.roundRect(-tw/2-24,-44,tw+48,86,12);C.fill();C.stroke();C.fillStyle=INK;C.textAlign='center';C.textBaseline='middle';C.fillText(txt,0,2);C.restore()}
function bars(b){const hh=H*.2,bw=86;for(const[s,col,txt]of[[-1,'#f0559c',(b.labels||['А','Б'])[0]],[1,'#7f97a6',(b.labels||['А','Б'])[1]]]){const x=W/2+s*W*.26,y=H*.09;C.save();C.globalAlpha=b.rise;C.fillStyle='rgba(255,255,255,.92)';C.strokeStyle=INK;C.lineWidth=9;C.beginPath();C.roundRect(x-bw/2,y,bw,hh,12);C.fill();C.stroke();C.fillStyle='#d0173a';const h=hh*b.v-14;C.beginPath();C.roundRect(x-bw/2+9,y+hh-9-h,bw-18,h,7);C.fill();C.font='800 40px Pop';C.textAlign='center';C.fillStyle='#fff';C.strokeStyle=INK;C.lineWidth=10;C.lineJoin='round';C.strokeText(txt,x,y+hh+56);C.fillText(txt,x,y+hh+56);C.restore()}}
function caption(t){const k=TM.caps.find(c=>t>=c.t&&t<c.e+.08);if(!k)return;const pop=ss(0,.09,t-k.t);const cx=W*.5,cy=H*.7;C.save();C.translate(cx,cy);const s=lerp(.86,1,pop);C.scale(s,s);C.font='800 88px Pop';C.textAlign='center';C.textBaseline='middle';C.lineJoin='round';let f=88;while(C.measureText(k.text).width>W*.78&&f>50){f-=4;C.font=`800 ${f}px Pop`}C.fillStyle='rgba(0,0,0,.55)';C.strokeStyle='rgba(0,0,0,.55)';C.lineWidth=20;C.strokeText(k.text,3,9);C.strokeStyle='#0d0c12';C.lineWidth=17;C.strokeText(k.text,0,0);C.fillStyle='#fff';C.fillText(k.text,0,0);C.restore()}
function whipEnv(t,s){let w=0,type=null,sign=1;const D=.2;if(s.in&&t-s.t0<D){w=1-(t-s.t0)/D;type=s.in;sign=-1}else if(s.out&&s.t1-t<D){w=1-(s.t1-t)/D;type=s.out;sign=1}return{w:w*w,type,sign}}
window.renderAt=(t)=>{const s=shots.find(x=>t>=x.t0&&t<x.t1)||shots[shots.length-1];hideAll();scene.background=null;for(const k in fx)delete fx[k];desk.small.visible=true;desk.can.visible=true;desk.mat.visible=true;desk.lab.visible=true;
 const u=clamp((t-s.t0)/(s.t1-s.t0));s.f(t,u);
 const e=whipEnv(t,s);if(e.type&&e.type.startsWith('whip')){const d=e.w*e.sign*(e.type==='whipL'?-1:1);const am=1.9;if(e.type==='whipUp')cam.rotateX(e.w*e.sign*.55);else cam.rotateY(-d*.5*am/1.9);}
 else if(e.type==='zoom'){cam.translateZ(-e.w*e.sign*1.4);cam.fov=cam.fov*(1-e.w*.25);cam.updateProjectionMatrix()}
 gl.render(scene,cam);
 // composite
 C.setTransform(1,0,0,1,0,0);C.globalAlpha=1;C.globalCompositeOperation='source-over';C.imageSmoothingQuality='high';
 if(e.w>.02){C.drawImage(gl.domElement,0,0,W,H);const n=16;for(let i=1;i<=n;i++){const a=1/(i+1);C.globalAlpha=a;const o=i/n;if(e.type==='zoom'){const z=1+o*e.w*.34;C.drawImage(gl.domElement,W/2-W*z/2,H/2-H*z/2,W*z,H*z)}else if(e.type==='whipUp'){C.drawImage(gl.domElement,0,-o*e.w*H*.42*e.sign,W,H)}else{const d=(e.type==='whipL'?-1:1)*e.sign;C.drawImage(gl.domElement,-o*e.w*W*.42*d,0,W,H)}}C.globalAlpha=1}
 else C.drawImage(gl.domElement,0,0,W,H);
 if(fx.crack&&fx.crack.a>.01){const[x,y]=toScreen(fx.crack.p);cracks(x,y,fx.crack.a,fx.crack.seed);C.globalCompositeOperation='multiply';C.fillStyle=`rgba(255,${240-55*clamp(fx.crack.a)},${240-55*clamp(fx.crack.a)},1)`;C.fillRect(0,0,W,H);C.globalCompositeOperation='source-over'}
 if(fx.tags)fx.tags.forEach(g=>{pillTag(g.txt,W*g.xy[0],H*g.xy[1],ss(g.t,g.t+.16,t))});
 if(fx.watch)watchHud(fx.watch,t);if(fx.bars)bars(fx.bars);if(fx.draw)fx.draw(C,W,H,t,toScreen);
 if(fx.flash){C.fillStyle=`rgba(255,240,245,${fx.flash*.85})`;C.fillRect(0,0,W,H)}
 {const R=rng(77);C.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<14;i++){const x=(R()*W+Math.sin(t*.5+i)*50+t*12*(R()-.5))%W,y=(R()*H*.85-t*(10+R()*16)+H*4)%(H*.85),r=2+R()*4;C.globalAlpha=.25+R()*.45;C.beginPath();C.arc(x,y,r,0,7);C.fill()}C.globalAlpha=1}
 const v=C.createRadialGradient(W/2,H*.46,H*.3,W/2,H*.48,H*.72);v.addColorStop(0,'rgba(10,8,25,0)');v.addColorStop(1,'rgba(10,8,25,.34)');C.fillStyle=v;C.fillRect(0,0,W,H);
 if(s.grade){C.globalCompositeOperation='multiply';C.globalAlpha=1;C.fillStyle=s.grade.mul;C.fillRect(0,0,W,H);C.globalCompositeOperation='source-over'}
 caption(t);return s.id};
window.grab=(q=.93)=>out.toDataURL('image/jpeg',q);
window.READY=true;
