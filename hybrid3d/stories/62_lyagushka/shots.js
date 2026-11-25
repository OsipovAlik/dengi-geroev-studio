import {kit} from '/lib_ru.js';
// 62 Лягушка и Вол (Крылов): статус в кредит — телефон как у друга, машина как у соседа; 100 под 30% на год ≈ 117, три такие покупки = 51 лишний; правило: в кредит только нужное, статус — на накопленные
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- лягушка (своя рисовка): зелёная, с золотой бабочкой-галстуком
const frog=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;const G='#5cbf3a';
 c.fillStyle=G;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.3),h*.9,w*.16,h*.07,0,0,7);c.fill();c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.64,w*.36,h*.3,0,0,7);c.fill();c.stroke();
 c.fillStyle='#d8f0a0';c.beginPath();c.ellipse(w*.5,h*.7,w*.22,h*.2,0,0,7);c.fill();c.stroke();
 c.fillStyle='#ffd23f';c.beginPath();c.moveTo(w*.5,h*.45);c.lineTo(w*.38,h*.39);c.lineTo(w*.38,h*.51);c.closePath();c.moveTo(w*.5,h*.45);c.lineTo(w*.62,h*.39);c.lineTo(w*.62,h*.51);c.closePath();c.fill();c.stroke();
 const hy=.3;c.fillStyle=G;c.beginPath();c.ellipse(w*.5,h*hy,w*.4,h*.2,0,0,7);c.fill();c.stroke();
 for(const s of[-1,1]){c.fillStyle=G;c.beginPath();c.arc(w*(.5+s*.22),h*.14,w*.14,0,7);c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(w*(.5+s*.22),h*.14,w*.1,0,7);c.fill();c.stroke();
  c.fillStyle=INK;const r=mood==='shock'?.03:.05;c.beginPath();c.arc(w*(.5+s*.22),h*.15,w*r,0,7);c.fill()}
 if(mood==='puff'){c.fillStyle='#ff7a6a';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.27),h*.34,w*.07,h*.04,0,0,7);c.fill()}c.lineWidth=10;c.beginPath();c.moveTo(w*.38,h*.38);c.lineTo(w*.62,h*.38);c.stroke();
  for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.34),h*.05);c.lineTo(w*(.5+s*.12),h*.08);c.stroke()}}
 else if(mood==='shock'){c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*.38,w*.07,h*.05,0,0,7);c.fill()}
 else{c.lineWidth=10;c.beginPath();c.moveTo(w*.3,h*.33);c.quadraticCurveTo(w*.5,h*.44,w*.7,h*.33);c.stroke()}};
// ---------- вол (своя рисовка): рыжий, белая морда, светлые рога
const ox=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=14;const B='#a8642e';
 c.fillStyle=B;for(const x of[.2,.34,.66,.8]){c.beginPath();c.roundRect(w*x-w*.045,h*.66,w*.09,h*.32,10);c.fill();c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.6,w*.42,h*.22,0,0,7);c.fill();c.stroke();
 c.fillStyle='#f0e6d0';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.12),h*.12);c.quadraticCurveTo(w*(.5+s*.32),h*.12,w*(.5+s*.3),h*.0+12);c.quadraticCurveTo(w*(.5+s*.24),h*.08,w*(.5+s*.12),h*.18);c.closePath();c.fill();c.stroke()}
 c.fillStyle=B;c.beginPath();c.ellipse(w*.5,h*.27,w*.17,h*.17,0,0,7);c.fill();c.stroke();
 for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.2),h*.2,w*.06,h*.03,s*.3,0,7);c.fill();c.stroke()}
 c.fillStyle='#f4efe4';c.beginPath();c.ellipse(w*.5,h*.37,w*.11,h*.07,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.045),h*.37,w*.015,h*.012,0,0,7);c.fill()}
 c.lineWidth=10;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*.24,w*.035,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*.245,w*.017,0,7);c.fill()}
 if(mood==='calm'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.11),h*.215);c.lineTo(w*(.5+s*.03),h*.215);c.stroke()}}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const FR=mk(frog,['smile','puff','shock'],1.0,1.0),OX=mk(ox,['look','calm'],3.4,2.8);
const BB=[...Object.values(FR),...Object.values(OX)];
const put=(set,md,x,z,t,sc=1,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.scale.set(sc,sc,1);m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.02,z)};
// ---------- луг с прудом
const gM=new THREE.Group();
const grass=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#7cc85a';c.fillRect(0,0,w,h);const R=rng(7);c.strokeStyle='rgba(30,70,20,.5)';c.lineWidth=3;for(let i=0;i<220;i++){const x=R()*w,y=R()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*8,y-10-R()*10);c.stroke()}},{wrap:true});grass.repeat.set(30,30);
const gr=plane(200,200,lam('#fff',{map:grass}),0,0,0,-PI/2);gr.receiveShadow=true;gM.add(gr);
const pond=cyl(2.6,.04,'#4aa0e0',3.2,.02,-2.6);gM.add(pond);gM.add(cyl(2.75,.03,'#15131a',3.2,.01,-2.6));
const R1=rng(3);for(let i=0;i<14;i++){const a=R1()*PI*2;gM.add(box(.06,.6+R1()*.6,.06,'#3a7a2a',3.2+Math.cos(a)*2.7,.4,-2.6+Math.sin(a)*2.7))}
for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.7+R1()*.6,14,10),lam('#3f9a3a'));b.position.set(-8+i*3.2,.4,-9-R1()*3);b.castShadow=true;gM.add(b)}
for(let i=0;i<12;i++){gM.add(box(.12,1,.12,'#8a5a30',-6+i*1.1,.5,-6.5))}gM.add(box(13,.1,.08,'#8a5a30',0,.8,-6.5));gM.add(box(13,.1,.08,'#8a5a30',0,.45,-6.5));
const lily=cyl(.5,.03,'#2f8a3a',2.4,.05,-2.0);gM.add(lily);
const jar=new THREE.Group();jar.position.set(.1,0,-.3);gM.add(jar);jar.add(new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.7,20,1,true),new THREE.MeshBasicMaterial({color:'#bfe8ff',transparent:true,opacity:.35,side:THREE.DoubleSide})));jar.children[0].position.y=.35;jar.add(cyl(.34,.06,'#15131a',0,.72,0));
const jc=[];for(let k=0;k<6;k++){const c=cyl(.26,.08,'#ffd23f',0,.06+k*.1,0);jar.add(c);jc.push(c)}
const N=40;const deb=new THREE.InstancedMesh(new THREE.BoxGeometry(.16,.1,.02),lam('#5cbf3a'),N);deb.castShadow=true;deb.frustumCulled=false;gM.add(deb);const DR=rng(62),DV=[...Array(N)].map(()=>[DR()-.5,DR()*1.2+.4,DR()-.5,DR()*6]);
gM.add(new THREE.HemisphereLight('#fffbe6','#5a7a3a',3.3));sunRig(gM,[-6,14,9],[0,0,-1.5],'#fff1d9',2.6,14);addSet('meadow',gM);
const FX0=-.9,FZ=-.4,OXX=1.6,OXZ=-2.2;
const meadow=(t,{debris=-1,jarK=0}={})=>{gM.visible=true;scene.background=new THREE.Color('#a9dcfb');jar.visible=jarK>0;jc.forEach((c,k)=>c.visible=k<Math.round(jarK*6));
 deb.visible=debris>=0;if(debris>=0){const M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();DV.forEach((v,i)=>{const s=debris*(1.6+v[1]);const y=Math.max(.02,.9+v[1]*3*debris-4.9*debris*debris);e.set(v[3]+debris*8,v[3]*2,debris*5);q.setFromEuler(e);M.compose(new THREE.Vector3(FX0+v[0]*s*3,y,FZ+v[2]*s*3),q,new THREE.Vector3(1,1,1));deb.setMatrixAt(i,M)});deb.instanceMatrix.needsUpdate=true}};
// ---------- магазин: телефон «как у друга»
const rS=K.room('rS','#3a5aa8');
rS.g.add(box(4.2,1.0,.8,'#e6e6ee',0,.5,-1.6));rS.g.add(box(4.3,.06,.9,'#15131a',0,1.03,-1.6));
const phone=new THREE.Group();phone.position.set(.7,1.06,-1.6);rS.g.add(phone);phone.add(box(.5,.9,.07,'#15131a',0,.46,0));
phone.add(plane(.42,.8,new THREE.MeshBasicMaterial({map:canvasTex(200,360,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffd23f');g.addColorStop(1,'#ff5a8a');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font='800 64px Pop';c.textAlign='center';c.fillText('NEW',w/2,h*.55)})}),0,.47,.04));
rS.g.add(K.stand(2.6,.8,'#ffd23f',[{t:'ТЕЛЕФОН — 100',s:80,y:.55,c:'#15131a'}],-.6,2.8,-3.85));
const credS=K.stand(1.8,.7,'#e8322a',[{t:'В КРЕДИТ',s:90,y:.56,c:'#ffffff'}],1.6,2.8,-3.85);rS.g.add(credS);
const shop=(t,{col='#3a5aa8',u=0,cr=0}={})=>{resetRoom(rS);rS.col(u,col);credS.visible=cr>0};
const buy=new Puppet('man',1.85);const BUY={col:'#2d8a4f',hair:'#3a2a1a'};scene.add(buy.m);
// ---------- гараж: машина «как у соседа»
const rG=K.room('rG','#5a5a6a');
const car=new THREE.Group();car.position.set(.6,0,-1.6);rG.g.add(car);car.add(box(3.0,.7,1.4,'#e8322a',0,.6,0));car.add(box(1.7,.6,1.3,'#e8322a',-.2,1.2,0));car.add(box(1.5,.45,1.32,'#9ad0ff',-.2,1.22,0));
for(const x of[-1,1])for(const z of[-.7,.7]){const w=cyl(.32,.2,"#15131a",x,.32,z);w.rotation.x=PI/2;car.add(w)}
rG.g.add(K.stand(2.8,.8,'#ffffff',[{t:'КАК У СОСЕДА',s:80,y:.55,c:'#15131a'}],.4,3.0,-3.85));
const stamp=K.stand(1.9,.8,'#e8322a',[{t:'В КРЕДИТ',s:96,y:.56,c:'#ffffff'}],.6,2.1,-.85);rG.g.add(stamp);
const garage=(t,{st=0,col='#5a5a6a',u=0}={})=>{resetRoom(rG);rG.col(u,col);stamp.visible=st>0;stamp.scale.setScalar(1+Math.max(0,.4-st*2))};
// ---------- монеты: 100 + 17, ещё две переплаты
const gK=new THREE.Group();gK.add(Object.assign(plane(200,200,lam('#3a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const mkStack=(col,n)=>{const g=new THREE.Group();const mat=lam(col);const cs=[];for(let k=0;k<n;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;c.receiveShadow=true;g.add(c);cs.push(c)}gK.add(g);return{g,cs}};
const GOLD=[...Array(10)].map((_,i)=>{const s=mkStack('#ffd23f',10);s.g.position.set(-2.2+(i%5)*1.1,0,-1.2-Math.floor(i/5)*1.2);return s});
const RED=[];[[-1.1,-3.6],[1.1,-3.6],[3.3,-3.6]].forEach(([x,z])=>{const a=mkStack('#e8322a',10),b=mkStack('#e8322a',7);a.g.position.set(x-.3,0,z);b.g.position.set(x+.3,0,z);RED.push([a,b])});
const t100=K.stand(2.4,.6,'#ffffff',[{t:'ЦЕНА 100',s:70,y:.56,c:'#15131a'}],-1.3,1.5,-4.8);gK.add(t100);
const t17=K.stand(2.4,.6,'#e8322a',[{t:'+17',s:80,y:.56,c:'#ffffff'}],-1.1,1.6,-4.8);gK.add(t17);
gK.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('coins',gK);
const grow=(s,k)=>{s.g.visible=k>0;s.cs.forEach((c,j)=>c.visible=j<Math.round(k*s.cs.length))};
const coins=(t,g1,g2,g3,bg=0)=>{gK.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#5a1a2a'),bg);
 GOLD.forEach((s,i)=>grow(s,clamp(g1*10-i)));RED.forEach((p,i)=>{const k=i==0?g2:clamp(g3*2-(i-1));grow(p[0],clamp(k*1.6));grow(p[1],clamp(k*1.6-.6))});t17.visible=g2>.9&&g3<.05;t100.visible=g2<.9};
// ---------- правило (вид сверху)
const tP=K.makeTable('tP','ПРАВИЛО',[['НУЖНО ИЛИ ВИДНО?','спросите до покупки'],['КРЕДИТ — ТОЛЬКО НУЖНОЕ','а не «не хуже других»'],['СТАТУС — НА СВОИ','сначала накопите сумму']],'#9ac58e');
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl)=>{tP.g.visible=true;scene.background=new THREE.Color('#cfe9c0');tP.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ЦЕНА «СТАТУСА»',0,9,-26,16,9,'#ff9a3a');K.billboard(city.g,'ЗАВТРА','ВОЛК И ЖУРАВЛЬ',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const lop=T('Так лопнула'),duts=T('и стала дуться,'),ask=T('«Я уже как он?» —'),burst=T('и лопнула.'),mash=T('машина'),vkr=T('в кредит.'),c117=T('около 117.'),tri=T('Три таких покупки —'),c51=T('51 лишний.'),neto=T('а не то,'),sub=T('Подпишись,');
const HOOK=['КРЕДИТ, ЧТОБЫ','БЫТЬ НЕ ХУЖЕ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const puffK=(t)=>1+1.3*ss(duts,burst,t);
const shots=[
{id:'hook',t0:0,t1:lop,out:'whipR',f(t,u){meadow(t);put(FR,'puff',FX0,FZ,t,1.6);put(OX,'look',OXX,OXZ,t);camPath(u,[-2.6,.5,4.6],[-1.6,.7,3.6],[.2,1.3,-1.4],[.2,1.4,-1.6],[64,56],.03);fx.draw=K.hook(HOOK,0,lop-.05)}},
{id:'title',t0:lop,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){meadow(t);put(FR,'puff',FX0,FZ,t,1.6);put(OX,'calm',OXX,OXZ,t);camPath(u,[1.4,.8,4.4],[-.6,1.3,4.8],[-.1,1.1,-1.2],[.1,1.2,-1.4],[62,58],-.03);fx.draw=K.big('ЛЯГУШКА И ВОЛ',lop+.05,S('s02')-.05,'#ffd23f',140,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'see',t0:S('s03'),t1:duts,in:'whipL',out:'whipUp',f(t,u){meadow(t);put(FR,'smile',FX0,FZ,t);put(OX,'look',OXX,OXZ,t);camPath(u,[-2.2,.25,2.0],[-2.0,.6,1.6],[FX0+.6,.9,FZ-1],[OXX,1.9,OXZ],[60,54],.02);fx.tags=[{txt:'ВОЛ',t:T('увидела вола')+.1,xy:[.62,.13]}]}},
{id:'puff',t0:duts,t1:ask,in:'whipUp',out:'whipR',f(t,u){meadow(t);put(FR,'puff',FX0,FZ,t,puffK(t));put(OX,'look',OXX,OXZ,t);camPath(u,[-2.6,.4,2.4],[-1.6,1.5,3.0],[FX0,.8,FZ],[FX0+.5,1.2,FZ-.5],[58,60],.03);fx.draw=K.big('ДУЕТСЯ…',duts+.05,ask-.05,'#ffd23f',150,.15)}},
{id:'ask',t0:ask,t1:burst,in:'whipR',out:'whipL',f(t,u){meadow(t);put(FR,'puff',FX0,FZ,t,puffK(t));put(OX,'calm',OXX,OXZ,t);linPath(ease(u)*.4+u*.6,[-3.6,1.2,3.4],[-2.4,1.3,3.6],[0,1.4,-1.2],[.2,1.4,-1.2],[58,56],0);fx.draw=K.big('«Я УЖЕ КАК ОН?»',ask+.05,burst-.05,'#ffffff',120,.15)}},
{id:'burst',t0:burst,t1:S('s04'),in:'whipL',out:'zoom',f(t,u){const h=t-burst-.15;meadow(t,{debris:h>0?clamp(h/1.2):-1});if(h<=0)put(FR,'shock',FX0,FZ,t,2.4);put(OX,'calm',OXX,OXZ,t);camPath(u,[-3.0,1.0,3.6],[-2.6,1.4,3.2],[FX0+.4,1.0,FZ],[FX0+.4,.9,FZ],[60,62],0);shake(t,burst+.15,.3,.7);if(h>0){fx.crack={p:[FX0,1.0,FZ],a:clamp(h*3),seed:62};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('ЛОП!',burst+.15,S('s04')-.05,'#ff5a3a',280,.15)}},
{id:'phone',t0:S('s04'),t1:mash,in:'zoom',out:'whipR',f(t,u){shop(t,{cr:t>T('как у друга,')});buy.pose(-.6,-.6,{...BUY,expr:'smile',look:.6,aR:[1.3,.6],aL:[.3,.2],propR:'card',blink:blink(t)});camPath(u,[-1.4,1.3,3.0],[-.6,1.5,2.6],[.2,1.9,-2.6],[.3,2.0,-2.8],[66,62],.02);fx.draw=K.big('КАК У ДРУГА',T('как у друга,'),mash-.05,'#ffd23f',150,.14)}},
{id:'car',t0:mash,t1:S('s05'),in:'whipR',out:'whipUp',f(t,u){garage(t,{st:clamp((t-vkr)*3),col:'#e8322a',u:ss(vkr,vkr+.5,t)});buy.pose(-1.7,-.4,{...BUY,expr:t>vkr?'shock':'smile',look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t)});const a=lerp(-.6,.25,u);cam.position.set(.2+Math.sin(a)*4.6,lerp(1.2,1.8,u),-1.2+Math.cos(a)*4.6);cam.lookAt(.2,1.4,-1.8);cam.fov=58;cam.updateProjectionMatrix();shake(t,vkr+.05,.08,.3)}},
{id:'c100',t0:S('s05'),t1:c117,in:'whipUp',out:'whipL',f(t,u){coins(t,ss(S('s05'),T('в кредит')+.3,t),0,0);camPath(u,[-2.4,4.8,3.6],[-1.2,5.2,3.8],[0,0,-2.0],[0,0,-2.4],[58,56],.03);fx.draw=K.big('30% НА ГОД',T('под 30% на год —'),c117-.05,'#ff9a3a',150,.13)}},
{id:'c117',t0:c117,t1:tri,in:'whipL',out:'whipR',f(t,u){coins(t,1,ss(c117-.1,c117+.6,t),0,.3);topv(u,-.6,.5,9.0,7.6,0,0,-2.4,60);fx.draw=K.big('117',c117+.05,tri-.05,'#ffd23f',280,.13)}},
{id:'c51',t0:tri,t1:S('s06'),in:'whipR',out:'zoom',f(t,u){coins(t,1,1,ss(tri,c51,t),ss(tri,c51+.3,t));camPath(u,[4.6,3.0,4.2],[2.8,3.6,4.6],[1.1,.4,-3.0],[1.1,.4,-3.4],[60,58],-.03);shake(t,c51+.15,.25,.6);const h=t-c51-.15;if(h>0){fx.crack={p:[1.1,.5,-3.6],a:clamp(h*3),seed:51};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('51 ЛИШНИЙ',c51+.1,S('s06')-.05,'#ff5a3a',180,.13)}},
{id:'rule',t0:S('s06'),t1:neto,in:'zoom',out:'whipL',f(t,u){table([0,t>T('в кредит —'),0]);topv(u,-.4,.25,10.2,8.4,0,0,0,58)}},
{id:'rule2',t0:neto,t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){table([1,1,1]);topv(u,.3,-.3,7.6,6.2,0,0,-.4,58);fx.draw=K.big('НУЖНО ≠ ВИДНО',neto+.05,S('s07')-.05,'#2d8a4f',140,.1)}},
{id:'save',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'whipR',f(t,u){meadow(t,{jarK:ss(S('s07'),S('s08')-.3,t)});put(FR,'smile',FX0,FZ,t);put(OX,'calm',OXX,OXZ,t);camPath(u,[-1.4,.5,2.6],[-.8,.7,1.9],[-.3,.5,-.4],[-.3,.5,-.4],[58,52],.02);fx.draw=K.big('КОПИТЕ',T('копите.'),S('s08')-.05,'#ffffff',180,.16)}},
{id:'next',t0:S('s08'),t1:sub,in:'whipR',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){meadow(t,{jarK:1});put(FR,'smile',FX0,FZ,t,1,Math.abs(Math.sin(t*5))*.15);put(OX,'calm',OXX,OXZ,t);camPath(u,[1.6,.9,4.4],[.6,1.0,3.4],[0,1.0,-1],[-.1,1.1,-1.1],[58,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);buy.hide();deb.visible=false;f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
