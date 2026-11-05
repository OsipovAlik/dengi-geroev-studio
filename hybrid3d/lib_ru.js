// Общие помощники для русских роликов hybrid3d: текст-хук, цифры, стол с документом, стопки денег, билборды
export function kit(E){
const {THREE,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,INK,lerp,clamp,ss,Puppet,scene,makeCell,city,rng}=E;
const PI=Math.PI;
function outlined(C,txt,x,y,size,fill,lw){C.font=`800 ${size}px Pop`;while(C.measureText(txt).width>930&&size>40){size-=6;C.font=`800 ${size}px Pop`}C.textAlign='center';C.textBaseline='middle';C.lineJoin='round';C.strokeStyle='rgba(0,0,0,.5)';C.lineWidth=lw+8;C.strokeText(txt,x+4,y+10);C.strokeStyle='#15131a';C.lineWidth=lw;C.strokeText(txt,x,y);C.fillStyle=fill;C.fillText(txt,x,y)}
// крупный текст-хук (вне полосы субтитров)
function hook(lines,t0,t1,cols=['#ffffff','#ffd23f']){return (C,W,H,t)=>{const a=ss(t0,t0+.15,t)*(1-ss(t1-.25,t1,t));if(a<=0)return;const s=.85+.15*ss(t0,t0+.25,t);C.save();C.globalAlpha=a;C.translate(W/2,H*.2);C.scale(s,s);lines.forEach((l,i)=>outlined(C,l,0,i*190,l.length>12?138:168,cols[i%cols.length],26));C.restore()}}
// большая цифра/слово по центру сверху
function big(txt,t0,t1,col='#ffd23f',size=300,y=.2){return (C,W,H,t)=>{const a=ss(t0,t0+.1,t)*(1-ss(t1-.15,t1,t));if(a<=0)return;const k=t-t0;const s=1+Math.max(0,.35-k*2)*1.2;C.save();C.globalAlpha=a;C.translate(W/2,H*y);C.scale(s,s);outlined(C,txt,0,0,size,col,28);C.restore()}}
function stand(w,h,bg,lines,x,y,z,ry=0,border=INK){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:label(Math.round(w*256),Math.round(h*256),bg,lines,{border,bw:12}),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m}
// стол сверху с договором/документом: rows = [{y(px),h(px)}] подсветки
function makeTable(name,title,clauses,wood0='#c58a4e'){const g=new THREE.Group();
 const wood=canvasTex(1024,1024,(c,w,h)=>{const R=rng(11);for(let i=0;i<8;i++){const x=i*w/8,v=R()*26;c.fillStyle=`rgb(${176+v},${122+v*.7},${70+v*.4})`;c.fillRect(x,0,w/8,h);c.strokeStyle='rgba(50,25,10,.75)';c.lineWidth=4;c.strokeRect(x,-5,w/8,h+10)}},{wrap:true});wood.repeat.set(6,6);
 const top=plane(40,40,lam('#fff',{map:wood}),0,0,0,-PI/2);top.receiveShadow=true;g.add(top);
 const tex=canvasTex(920,1200,(c,w,h)=>{c.fillStyle='#f6f2e6';c.fillRect(0,0,w,h);c.fillStyle=INK;c.font='800 78px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(title,w/2,100,w-60);c.fillStyle='#c9c3b2';for(let i=0;i<5;i++)c.fillRect(70,190+i*44,w-140-(i%2)*160,16);
  clauses.forEach((cl,i)=>{const y=470+i*220;c.fillStyle='#fff';c.fillRect(50,y-60,w-100,170);c.strokeStyle=INK;c.lineWidth=5;c.strokeRect(50,y-60,w-100,170);c.fillStyle=INK;c.beginPath();c.arc(120,y+25,40,0,7);c.fill();c.fillStyle='#fff';c.font='800 54px Pop';c.fillText(String(i+1),120,y+27);c.fillStyle=INK;c.font='800 58px Pop';c.textAlign='left';c.fillText(cl[0],190,y+5,w-270);c.font='800 36px Pop';c.fillStyle='#777';c.fillText(cl[1],190,y+62,w-270);c.textAlign='center'});
  c.fillStyle='#c9c3b2';for(let i=0;i<3;i++)c.fillRect(70,1120-i*30,w-140-(i%2)*200,14)});
 const paper=plane(4.6,6,lam('#fff',{map:tex}),0,.03,0,-PI/2);paper.receiveShadow=true;g.add(paper);
 const hl=clauses.map((_,i)=>{const m=plane(4.5,.92,new THREE.MeshBasicMaterial({color:'#ffd23f',transparent:true,opacity:0,depthWrite:false}),0,.045,(470+i*220+25-600)/200,-PI/2);g.add(m);return m});
 g.add(new THREE.HemisphereLight('#fff','#a89a8f',3.0));const sun=sunRig(g,[-5,24,6],[.5,0,0],'#fff1d9',2.4,10);
 addSet(name,g);return{g,paper,hl,top,sun}}
// башня из «пачек»: n коробок, высота шага .3
function tower(col,x,z){const g=new THREE.Group();const bs=[];for(let i=0;i<10;i++){const b=box(1.1,.28,.7,col,0,.16+i*.3,0);b.visible=false;g.add(b);bs.push(b)}g.position.set(x,0,z);return{g,set(n){bs.forEach((b,i)=>b.visible=i<n)}}}
function billboard(g,txt,sub,x,y,z,w=14,h=8,bg='#ffd23f'){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:label(1024,Math.round(1024*h/w),bg,[{t:txt,s:sub?190:230,y:sub?.4:.5},...(sub?[{t:sub,s:100,y:.76}]:[])],{border:INK,bw:20}),side:THREE.DoubleSide}));m.position.set(x,y,z);g.add(m);const l=box(.5,y,.5,'#444',x-w*.3,y/2,z-.1),r=box(.5,y,.5,'#444',x+w*.3,y/2,z-.1);g.add(l,r);return m}
function room(name,base,to='#ffffff'){const r=makeCell(name);r.base=new THREE.Color(base);r.col=(u,b2)=>r.color(u,r.base,new THREE.Color(b2));return r}
return{hook,big,stand,makeTable,tower,billboard,room,outlined,THREE}}
