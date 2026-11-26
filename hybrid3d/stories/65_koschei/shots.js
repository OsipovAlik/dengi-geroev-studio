import {kit} from '/lib_ru.js';
// 65 Кощей Бессмертный (русская народная сказка): всё в одном яйце — все сбережения в одном месте; 100 в одном месте: заблокировали — 0; 4 места по 25: пропало одно — осталось 75; правило: запас в трёх местах — два разных надёжных банка и немного под рукой
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Кощей (своя рисовка): худой, серо-зелёный, чёрный плащ, золотая зубчатая корона
const kos=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const SK='#b8c8a8';
 c.fillStyle='#15131a';c.beginPath();c.moveTo(w*.2,h*.98);c.lineTo(w*.38,h*.4);c.lineTo(w*.62,h*.4);c.lineTo(w*.8,h*.98);c.closePath();c.fill();c.stroke();
 c.fillStyle='#7a1030';c.beginPath();c.moveTo(w*.42,h*.42);c.lineTo(w*.58,h*.42);c.lineTo(w*.54,h*.9);c.lineTo(w*.46,h*.9);c.closePath();c.fill();c.stroke();
 const arm=mood==='dead'?-2.5:-.35;for(const s of[-1,1]){c.save();c.translate(w*(.5+s*.12),h*.43);c.rotate(s*arm);c.fillStyle='#15131a';c.beginPath();c.roundRect(-w*.03,0,w*.06,h*.24,8);c.fill();c.stroke();c.fillStyle=SK;c.beginPath();c.arc(0,h*.25,w*.035,0,7);c.fill();c.stroke();c.restore()}
 const hy=.25,hr=.15;c.fillStyle=SK;c.beginPath();c.ellipse(w*.5,h*hy,w*hr,h*.11,0,0,7);c.fill();c.stroke();
 c.fillStyle='#8a9a7a';c.beginPath();c.ellipse(w*.42,h*(hy+.04),w*.03,h*.03,0,0,7);c.fill();c.beginPath();c.ellipse(w*.58,h*(hy+.04),w*.03,h*.03,0,0,7);c.fill();
 c.fillStyle='#ffd23f';c.beginPath();c.moveTo(w*.36,h*(hy-.07));for(let k=0;k<=6;k++){c.lineTo(w*(.36+k*.0467),h*(hy-(k%2?.11:.16)));}c.lineTo(w*.64,h*(hy-.07));c.closePath();c.fill();c.stroke();
 c.lineWidth=9;c.fillStyle='#e0203a';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.06),h*(hy-.01),w*.035,h*(mood==='dead'?.028:.016),0,0,7);c.fill();c.stroke()}
 if(mood==='dead'){c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.07),w*.04,h*.03,0,0,7);c.fill()}
 else{c.fillStyle='#fff';c.beginPath();c.moveTo(w*.42,h*(hy+.055));c.quadraticCurveTo(w*.5,h*(hy+.09),w*.6,h*(hy+.045));c.lineTo(w*.42,h*(hy+.055));c.fill();c.stroke();c.lineWidth=10;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.11),h*(hy-.05));c.lineTo(w*(.5+s*.02),h*(hy-.03));c.stroke()}}};
// ---------- Иван (своя рисовка): красная рубаха с поясом, русые волосы, синие штаны
const iva=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#2f4f9a';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.09)-w*.06,h*.66,w*.12,h*.28,10);c.fill();c.stroke()}
 c.fillStyle='#7a4a20';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*.96,w*.09,h*.03,0,0,7);c.fill();c.stroke()}
 c.fillStyle='#e0283a';c.beginPath();c.moveTo(w*.3,h*.7);c.lineTo(w*.34,h*.42);c.lineTo(w*.66,h*.42);c.lineTo(w*.7,h*.7);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ffd23f';c.fillRect(w*.32,h*.6,w*.36,h*.035);c.strokeRect(w*.32,h*.6,w*.36,h*.035);
 const up=mood==='win'?1:0;for(const s of[-1,1]){c.save();c.translate(w*(.5+s*.16),h*.45);c.rotate(s*(up?-2.5:-.3));c.fillStyle='#e0283a';c.beginPath();c.roundRect(-w*.04,0,w*.08,h*.19,10);c.fill();c.stroke();c.fillStyle='#f0c098';c.beginPath();c.arc(0,h*.2,w*.045,0,7);c.fill();c.stroke();c.restore()}
 const hy=.27,hr=.18;c.fillStyle='#f0c098';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#e8b040';c.beginPath();c.ellipse(w*.5,h*(hy-.07),w*.2,h*.07,0,PI,0);c.lineTo(w*.7,h*(hy-.04));c.lineTo(w*.3,h*(hy-.04));c.closePath();c.fill();c.stroke();
 c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.075),h*(hy+.005),w*.045,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.075),h*(hy+.008),w*.022,0,7);c.fill()}
 c.beginPath();c.arc(w*.5,h*(hy+.06),w*.07,PI*.15,PI*.85);c.stroke()};
// ---------- утка и заяц (своя рисовка)
const duck=(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=11;c.fillStyle='#f4f4ef';c.beginPath();c.ellipse(w*.45,h*.65,w*.36,h*.24,0,0,7);c.fill();c.stroke();c.beginPath();c.arc(w*.68,h*.32,w*.17,0,7);c.fill();c.stroke();
 c.fillStyle='#ff9a1a';c.beginPath();c.moveTo(w*.82,h*.3);c.lineTo(w*.99,h*.36);c.lineTo(w*.82,h*.4);c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.72,h*.29,w*.03,0,7);c.fill();
 c.fillStyle='#cfcfc4';c.beginPath();c.ellipse(w*.4,h*.6,w*.18,h*.1,-.3,0,7);c.fill();c.stroke()};
const hare=(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=11;c.fillStyle='#b89a7a';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*.16,w*.06,h*.15,s*.15,0,7);c.fill();c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.72,w*.28,h*.24,0,0,7);c.fill();c.stroke();c.beginPath();c.arc(w*.5,h*.4,w*.2,0,7);c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.5,h*.76,w*.13,h*.14,0,0,7);c.fill();c.stroke();c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*.38,w*.03,0,7);c.fill()}
 c.fillStyle='#ff8aa0';c.beginPath();c.arc(w*.5,h*.45,w*.03,0,7);c.fill()};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const KO=mk(kos,['smug','dead'],1.5,2.3),IV=mk(iva,['happy','win'],1.25,1.8);
const DK=drawn(1.1,.9,duck),HR=drawn(1.0,1.3,hare);scene.add(DK,HR);DK.visible=HR.visible=false;
const BB=[...Object.values(KO),...Object.values(IV),DK,HR];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.02,z)};
const egg=(col,s=1)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.5,28,20),lam(col));m.scale.set(.78*s,1*s,.78*s);m.castShadow=true;m.receiveShadow=true;return m};
// ---------- зал Кощея: сундуки золота
const rK=K.room('rK','#4a2a6a');const CH=[];for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(-1.6+i*1.6,0,-2.9);g.add(box(1.2,.7,.8,'#8a4a22',0,.35,0));g.add(box(1.22,.08,.82,'#ffd23f',0,.7,0));for(let k=0;k<6;k++)g.add(cyl(.16,.06,'#ffd23f',-.4+(k%3)*.4,.78,-.2+Math.floor(k/3)*.35));rK.g.add(g);CH.push(g)}
const throne=new THREE.Group();throne.position.set(0,0,-1.9);throne.add(box(1.3,.5,1.0,'#2a1a3a',0,.25,0));throne.add(box(1.3,2.2,.2,'#2a1a3a',0,1.1,-.45));throne.add(box(1.0,.12,.12,'#ffd23f',0,2.15,-.36));rK.g.add(throne);
const CO=[];const RC=rng(65);for(let i=0;i<22;i++){const c=cyl(.14,.05,'#ffd23f',0,0,0);c.userData={a:RC()*PI*2,v:1.5+RC()*3,up:3+RC()*3};rK.g.add(c);CO.push(c)}
const hallK=(t,{col='#4a2a6a',u=0,boom=-1}={})=>{resetRoom(rK);rK.col(u,col);CO.forEach(c=>{c.visible=boom>=0&&boom<1.6;if(!c.visible)return;const d=c.userData;c.position.set(Math.cos(d.a)*d.v*boom,Math.max(.03,.9+d.up*boom-4.9*boom*boom),-2.6+Math.sin(d.a)*d.v*boom);c.rotation.set(boom*7,0,boom*5)})};
// ---------- остров с дубом
const gO=new THREE.Group();
const grass=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#5aa04a';c.fillRect(0,0,w,h);const R=rng(9);c.strokeStyle='rgba(20,60,20,.5)';c.lineWidth=3;for(let i=0;i<200;i++){const x=R()*w,y=R()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*8,y-12);c.stroke()}},{wrap:true});grass.repeat.set(12,12);
const sea=plane(600,600,lam('#2f7ac8'),0,-.4,0,-PI/2);gO.add(sea);const isl=cyl(14,.8,lam('#fff',{map:grass}),0,0,0);isl.receiveShadow=true;gO.add(isl);
const oak=new THREE.Group();gO.add(oak);oak.add(cyl(.9,6,'#6a4020',0,3.4,0));for(const [x,y,z,r] of[[0,8,0,3.2],[-2.2,7,.6,2.2],[2.2,7.2,-.4,2.3],[.4,9.6,.3,2.2],[-1,6.6,-1.6,1.8]]){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),lam('#2f7a3a',{flatShading:true}));s.position.set(x,y,z);s.castShadow=true;s.receiveShadow=true;oak.add(s)}
const chest=new THREE.Group();chest.add(box(1.0,.6,.7,'#8a4a22',0,.3,0));chest.add(box(1.02,.07,.72,'#ffd23f',0,.6,0));chest.add(box(.16,.2,.05,'#ffd23f',0,.4,.36));
const chestTop=chest.clone();chestTop.position.set(2.6,4.6,1.8);oak.add(chestTop);for(const s of[-1,1])oak.add(cyl(.02,1.4,'#3a2a1a',2.6+s*.35,5.9,1.8));oak.add(box(.25,.25,2.6,'#6a4020',2.4,6.6,.9));
const chestG=chest.clone();chestG.position.set(1.4,.4,2.2);gO.add(chestG);
const egG=egg('#f6f0e0',.55);egG.position.set(1.4,.95,2.2);gO.add(egG);
const RT=rng(4);for(let i=0;i<10;i++){const a=RT()*PI*2,r=8+RT()*4;const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.8+RT()*.6,0),lam('#3a8a44',{flatShading:true}));b.position.set(Math.cos(a)*r,.9,Math.sin(a)*r);b.castShadow=true;gO.add(b)}
gO.add(new THREE.HemisphereLight('#fff4e0','#2a4a3a',3.0));sunRig(gO,[-12,22,10],[0,3,0],'#ffe2b0',2.6,16);addSet('island',gO);
const island=(t,{bg='#9ad0ff',top=1,ground=0,eg=0}={})=>{gO.visible=true;scene.background=new THREE.Color(bg);chestTop.visible=!!top;chestG.visible=!!ground;egG.visible=!!eg};
// ---------- макро: игла и яйцо на бархате (сверху)
const gM=new THREE.Group();gM.add(Object.assign(plane(60,60,lam('#7a1030'),0,0,0,-PI/2),{receiveShadow:true}));
const needle=new THREE.Group();const nd=cyl(.04,2.4,'#d8dde4',0,0,0);nd.rotation.z=PI/2;needle.add(nd);const tip=new THREE.Mesh(new THREE.ConeGeometry(.04,.3,10),lam('#d8dde4'));tip.rotation.z=-PI/2;tip.position.x=1.35;needle.add(tip);const eye=new THREE.Mesh(new THREE.TorusGeometry(.07,.02,8,16),lam('#d8dde4'));eye.position.x=-1.25;needle.add(eye);needle.position.y=.1;gM.add(needle);
const half2=new THREE.Group();const nd2=needle.clone();half2.add(nd2);half2.visible=false;gM.add(half2);
const bigEgg=egg('#f6f0e0',2.2);bigEgg.rotation.z=PI/2;bigEgg.position.y=.2;gM.add(bigEgg);
gM.add(new THREE.HemisphereLight('#fff','#5a2a3a',3.0));sunRig(gM,[-5,14,6],[0,0,0],'#fff1d9',2.4,8);addSet('macro',gM);
const macro=(t,{eg=0,brk=0}={})=>{gM.visible=true;scene.background=new THREE.Color('#5a0a20');const s=Math.max(.001,eg);bigEgg.scale.set(.78*2.2*s,1*2.2*s,.78*2.2*s);bigEgg.visible=eg>0;needle.rotation.y=brk*.5;needle.position.x=-brk*.6;nd2.rotation.y=-brk*.6;half2.visible=brk>0;half2.position.x=brk*.6};
// ---------- луг: утка и заяц
const gL=new THREE.Group();const lg=plane(200,200,lam('#fff',{map:grass}),0,0,0,-PI/2);lg.receiveShadow=true;gL.add(lg);
for(let i=0;i<12;i++){const x=-8+i*1.5,z=-5-(i%3);const tr=new THREE.Group();tr.position.set(x,0,z);tr.add(cyl(.15,1.2,'#5a3418',0,.6,0));const cn=new THREE.Mesh(new THREE.ConeGeometry(.9,2.4,10),lam(i%2?'#2f6a3a':'#3a7a44'));cn.position.y=2.2;cn.castShadow=true;tr.add(cn);gL.add(tr)}
gL.add(new THREE.HemisphereLight('#fff1e0','#2a3a2a',3.1));sunRig(gL,[-7,14,8],[0,0,-1.5],'#ffd9a8',2.6,12);addSet('meadow',gL);
const meadow=(t,bg='#ffc98a')=>{gL.visible=true;scene.background=new THREE.Color(bg)};
// ---------- стол сверху: одна карта / четыре яйца по 25
const tT=K.makeTable('tT','',[]);tT.paper.visible=false;
const card=plane(3.4,2.15,new THREE.MeshLambertMaterial({map:canvasTex(680,430,(c,w,h)=>{c.fillStyle='#2f6fc8';c.fillRect(0,0,w,h);c.fillStyle='#ffd23f';c.fillRect(50,150,110,80);c.strokeStyle=INK;c.lineWidth=8;c.strokeRect(4,4,w-8,h-8);c.fillStyle='#fff';c.font='800 70px Pop';c.textAlign='center';c.fillText('ВСЁ ЗДЕСЬ',w/2+60,330);c.font='800 44px Pop';c.fillText('•••• 0001',w/2+80,210)})}),0,.04,0,-PI/2);card.receiveShadow=true;tT.g.add(card);
const EG4=[];for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set(i%2?1.2:-1.2,0,i<2?-1.2:1.2);const e=egg('#ffd23f',1.4);e.position.y=.7;g.add(e);const tg=plane(1.1,.55,new THREE.MeshBasicMaterial({map:label(256,128,'#ffffff',[{t:'25',s:96,y:.55,c:'#15131a'}],{border:INK,bw:8})}),0,1.5,.0,-PI/2);g.add(tg);tT.g.add(g);EG4.push(g)}
const table=(t,{mode='card',lost=0,bg='#e9c58c'}={})=>{tT.g.visible=true;scene.background=new THREE.Color(bg);card.visible=mode==='card';EG4.forEach((g,i)=>{g.visible=mode==='eggs'&&!(i==1&&lost>=1);const k=i==1?1-lost:1;g.scale.setScalar(Math.max(.001,k));g.position.y=i==1?lost*1.5:0})};
// ---------- банк: один сейф
const rB=K.room('rB','#c8d0e0');const safe=new THREE.Group();safe.position.set(0,0,-2.6);rB.g.add(safe);safe.add(box(2.0,2.4,1.2,'#5a6a7a',0,1.2,0));safe.add(cyl(.35,.12,'#ffd23f',0,1.3,.62).rotateX(PI/2));safe.add(box(1.4,.08,.05,'#ffd23f',0,1.9,.62));
const bankSign=K.stand(2.6,.7,'#ffffff',[{t:'ОДИН БАНК',s:84,y:.56,c:'#15131a'}],0,3.25,-2.9);rB.g.add(bankSign);
const bank=(t,{u=0}={})=>{resetRoom(rB);rB.col(u,'#ff6a6a')};
// ---------- стопки: 100 в одном месте
const gK=new THREE.Group();gK.add(Object.assign(plane(200,200,lam('#2a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const ST=[...Array(10)].map((_,i)=>{const g=new THREE.Group();const mat=lam('#ffd23f');const cs=[];for(let k=0;k<10;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;g.add(c);cs.push(c)}g.position.set(-1.0+(i%5)*.5,0,-1.6-Math.floor(i/5)*.5);gK.add(g);return{g,cs}});
const lock=K.stand(2.8,.8,'#ff5a5a',[{t:'ЗАБЛОКИРОВАНО',s:70,y:.56,c:'#ffffff'}],0,2.2,-1.7);gK.add(lock);
gK.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('stacks',gK);
const stacks=(t,{g=1,gone=0,lk=0}={})=>{gK.visible=true;scene.background=new THREE.Color('#9ab8ff').lerp(new THREE.Color('#3a1020'),gone);lock.visible=lk>0;ST.forEach((s,i)=>{let k=clamp(g*10-i)*(1-clamp(gone*2-(i%5)*.15));s.g.visible=k>0;s.cs.forEach((c,j)=>c.visible=j<Math.round(k*10))})};
// ---------- правило
const tR=K.makeTable('tR','ПРАВИЛО',[['ЗАПАС В ТРЁХ МЕСТАХ','не всё в одно яйцо'],['ДВА РАЗНЫХ БАНКА','надёжных, где вклады застрахованы'],['НЕМНОГО ПОД РУКОЙ','на первые дни']],'#b58a5e');
const rule=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО ТРЁХ МЕСТ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ДАЛЬШЕ','БЕЛКА',0,9,24,16,9,'#9ad0ff');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const tak=T('Так погиб'),sm=T('Смерть Кощея —'),ivy=T('игла в яйце,'),yu=T('яйцо в утке,'),zs=T('заяц в сундуке.'),vse=T('Всё'),inh=T('Иван нашёл'),sl=T('сломал иглу —'),ik=T('и конец.'),kar=T('всё на одной карте'),ob=T('или в одном банке.'),sto=T('Сто'),zab=T('заблокировали —'),c0=T('у вас 0.'),chm=T('Четыре места'),pro=T('пропало одно —'),o75=T('осталось 75.'),dv=T('два разных банка'),nem=T('и немного'),np=T('Не прячьте всё'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:tak,out:'whipR',f(t,u){hallK(t);put(KO,'smug',0,-1.6,t,.5);camPath(u,[-1.4,.8,2.4],[-.6,1.0,1.6],[0,2.2,-2.2],[0,2.3,-2.2],[62,58],.03);fx.draw=K.hook(['ВСЕ ДЕНЬГИ','В ОДНОМ МЕСТЕ?'],0,tak-.05)}},
{id:'title',t0:tak,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){island(t,{bg:'#ffb07a'});linPath(u,[-22,9,26],[-14,8,20],[0,5,0],[0,6,0],[54,50],.04);fx.draw=K.big('КОЩЕЙ',tak+.05,S('s02')-.05,'#ffd23f',190,.14)}},
{id:'promise',t0:S('s02'),t1:sm,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'needle',t0:sm,t1:yu,in:'zoom',out:'whipL',f(t,u){macro(t,{eg:ss(ivy-.1,ivy+.5,t)});topv(u,-.6,.6,5.2,4.4,0,0,0,58);fx.tags=[{txt:'ИГЛА',t:T('в игле,'),xy:[.5,.12]},{txt:'В ЯЙЦЕ',t:ivy,xy:[.5,.18]}]}},
{id:'duck',t0:yu,t1:zs,in:'whipL',out:'whipUp',f(t,u){meadow(t);DK.visible=true;DK.position.set(-.9,0,-1.2);HR.visible=t>T('утка в зайце,')-.2;HR.position.set(.8,Math.abs(Math.sin(t*6))*.25,-1.0);linPath(u,[-2.0,.8,2.6],[.4,.9,2.8],[-.5,.7,-1.2],[.2,.8,-1.1],[58,56],0);fx.tags=[{txt:'В УТКЕ',t:yu,xy:[.5,.12]},{txt:'В ЗАЙЦЕ',t:T('утка в зайце,'),xy:[.5,.18]}]}},
{id:'oak',t0:zs,t1:inh,in:'whipUp',out:'whipR',f(t,u){island(t);const k=ease(clamp(u*1.5))*.9+u*.1;linPath(k,[10,11,18],[5.2,5.6,6.8],[0,6,0],[2.6,4.9,1.8],[56,50],.03);fx.draw=K.big('ВСЁ В ОДНОМ МЕСТЕ',vse,inh-.05,'#ffffff',110,.13)}},
{id:'ivan',t0:inh,t1:sl,in:'whipR',out:'zoom',f(t,u){island(t,{top:0,ground:1,eg:1,bg:'#9ad0ff'});put(IV,'happy',.4,2.6,t,.4);camPath(u,[-1.8,1.2,7.2],[-.6,1.3,6.2],[.8,1.3,2.4],[.9,1.35,2.4],[58,54],.02)}},
{id:'break',t0:sl,t1:ik,in:'zoom',out:'whipL',f(t,u){const b=ss(sl+.3,sl+.6,t);macro(t,{brk:b});topv(u,.3,-.2,3.2,2.8,0,0,0,58);shake(t,sl+.35,.3,.6);const h=t-sl-.35;if(h>0){fx.flash=Math.max(0,1-h/.25);fx.crack={p:[0,.1,0],a:clamp(h*3),seed:65}}fx.draw=K.big('ХРУСЬ!',sl+.35,ik-.05,'#ffffff',200,.14)}},
{id:'end',t0:ik,t1:S('s05'),in:'whipL',out:'whipUp',f(t,u){const h=t-ik;hallK(t,{col:'#3a1020',u:1,boom:h});put(KO,'dead',0,-1.6,t,.5-ss(0,.8,h)*.6);shake(t,ik,.45,.9);if(h>0){fx.flash=Math.max(0,.9-h*3);fx.crack={p:[0,1.6,-1.6],a:clamp(h*3),seed:7}}camPath(u,[-1.0,1.0,2.2],[-.4,1.2,1.8],[0,1.5,-2.0],[0,1.4,-2.0],[60,56],.02)}},
{id:'card',t0:S('s05'),t1:ob,in:'whipUp',out:'zoom',f(t,u){table(t);topv(u,-.5,.4,5.6,4.6,0,0,0,58);fx.draw=K.big('ОДНА КАРТА',kar,ob-.05,'#ffd23f',150,.13)}},
{id:'bank',t0:ob,t1:sto,in:'zoom',out:'whipR',f(t,u){bank(t);linPath(u,[-1.8,1.4,2.6],[.8,1.5,2.2],[0,1.6,-2.6],[0,1.7,-2.6],[60,56],0)}},
{id:'zero',t0:sto,t1:chm,in:'whipR',out:'whipUp',f(t,u){const gone=ss(c0-.3,c0+.6,t);stacks(t,{g:ss(sto,zab,t),gone,lk:t>zab-.05});camPath(u,[-2.0,3.8,3.2],[-.8,4.4,3.6],[0,.4,-1.9],[0,.3,-1.9],[58,56],.03);shake(t,c0+.1,.25,.6);fx.draw=K.big(t<c0?'100':'0',sto+.05,chm-.05,t<c0?'#ffd23f':'#ff5a3a',t<c0?260:340,.14)}},
{id:'eggs',t0:chm,t1:S('s07'),in:'whipUp',out:'whipL',f(t,u){table(t,{mode:'eggs',lost:ss(pro,pro+.6,t),bg:t>o75?'#9ae8a8':'#e9c58c'});topv(u,-.5,.5,8.4,7.6,0,0,.7,58);fx.draw=K.big(t<o75?'4 × 25':'ОСТАЛОСЬ 75',chm+.1,S('s07')-.05,t<o75?'#ffffff':'#7dff9a',t<o75?200:150,.13)}},
{id:'rule',t0:S('s07'),t1:np,in:'whipL',out:'zoom',f(t,u){rule([t>T('в трёх местах:')-.1,t>dv-.1,t>nem-.1]);topv(u,-.4,.25,10.2,8.4,0,0,0,60)}},
{id:'egg1',t0:np,t1:S('s09'),in:'zoom',out:'whipUp',f(t,u){macro(t,{eg:1});const a=lerp(-.6,.4,u);cam.position.set(Math.sin(a)*4.6,lerp(1.4,1.8,u),Math.cos(a)*4.6);cam.lookAt(0,.6,0);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.hook(['НЕ ПРЯЧЬТЕ ВСЁ','В ОДНО ЯЙЦО'],np+.05,S('s09')-.05)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){island(t,{top:0,ground:1,eg:1});put(IV,'win',.4,2.6,t,.4+Math.abs(Math.sin(t*5))*.1);camPath(u,[1.2,1.3,6.8],[.5,1.4,6.0],[.6,1.3,2.4],[.5,1.4,2.4],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
