import {kit} from '/lib_ru.js';
// 59 Солдат («Огниво»): платить за всех — деньги кончились, друзья исчезли; угощать на 30 из 100 = 360 в год, запас 0; правило: угощение и развлечения ≤ 10 из 100 = 120 в год, а 240 — в запас
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x=0,y=0,z=0)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
const BB=[];const mk=(w,h,d)=>{const m=drawn(w,h,d);scene.add(m);m.visible=false;BB.push(m);return m};
// ---------- собака с глазами как блюдца (своя рисовка)
const dogD=(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#b8742a';c.beginPath();c.ellipse(w*.5,h*.72,w*.3,h*.22,0,0,7);c.fill();c.stroke();
 for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.18)-w*.06,h*.78,w*.12,h*.2,14);c.fill();c.stroke()}
 c.beginPath();c.moveTo(w*.78,h*.7);c.quadraticCurveTo(w*.98,h*.6,w*.92,h*.45);c.stroke();
 for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.3),h*.3,w*.08,h*.14,s*.4,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*.34,w*.3,0,7);c.fill();c.stroke();
 c.fillStyle='#e8c08a';c.beginPath();c.ellipse(w*.5,h*.46,w*.14,h*.08,0,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*.42,w*.05,h*.03,0,0,7);c.fill();
 for(const s of[-1,1]){c.fillStyle='#fff';c.beginPath();c.arc(w*(.5+s*.15),h*.28,w*.13,0,7);c.fill();c.stroke();c.fillStyle='#4a8ad8';c.beginPath();c.arc(w*(.5+s*.15),h*.28,w*.06,0,7);c.fill();c.fillStyle=INK;c.beginPath();c.arc(w*(.5+s*.15),h*.28,w*.03,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(w*(.5+s*.15)+w*.02,h*.26,w*.012,0,7);c.fill()}};
const dog=mk(1.5,1.6,dogD);
// ---------- люди
const sol=new Puppet('man',1.9);const SOL={col:'#c0302a',hair:'#3a2a1a'};
const fr=[new Puppet('woman',1.8),new Puppet('big',1.85),new Puppet('man',1.85)];const FRC=[{col:'#3ac0ff',hair:'#f0c040'},{col:'#6a4fa3',hair:'#2a1a1a'},{col:'#2d8a4f',hair:'#8a5a2a'}];
scene.add(sol.m,...fr.map(p=>p.m));
const P=[sol,...fr];
// ---------- трактир
const rT=K.room('rT','#9a5a3a');
rT.g.add(box(3.2,.12,1.4,'#7a4a24',0,.95,-1.6));for(const x of[-1.4,1.4])for(const z of[-2.1,-1.1])rT.g.add(box(.12,.95,.12,'#5a3a1a',x,.47,z));
const party=new THREE.Group();rT.g.add(party);
const cupC=['#ffd23f','#ff7aa8','#7dff9a','#3ac0ff','#ffd23f','#ff9a3a'];cupC.forEach((cl,i)=>party.add(cyl(.12,.26,cl,-1.2+i*.48,1.14,-1.5+(i%2)*.3)));
const gold=new THREE.Group();rT.g.add(gold);for(let i=0;i<14;i++){const R=rng(40+i);gold.add(cyl(.14,.06,'#ffd23f',-.3+R()*.6,1.04+Math.floor(i/5)*.07,-1.7+R()*.3))}
const bill=K.stand(1.1,1.2,'#ffffff',[{t:'СЧЁТ',s:70,y:.25,c:'#15131a'},{t:'30',s:200,y:.66,c:'#e8322a'}],1.9,1.6,-1.9,-.3,'#15131a');rT.g.add(bill);
const tav=(t,{col='#9a5a3a',u=0,full=1}={})=>{resetRoom(rT);rT.col(u,col);party.visible=full>0;gold.visible=full>0;bill.visible=full>0};
// ---------- поляна с дуплистым деревом
const gF=new THREE.Group();
gF.add(Object.assign(plane(200,200,lam('#6aa84f'),0,0,0,-PI/2),{receiveShadow:true}));
{const tr=cyl(.9,4,'#7a4a24',0,2,-2.4);gF.add(tr);const crown=new THREE.Mesh(new THREE.SphereGeometry(2.4,12,10),lam('#2a7a3a'));crown.position.set(0,5,-2.4);crown.castShadow=true;gF.add(crown);gF.add(plane(.7,1.1,new THREE.MeshBasicMaterial({color:'#1a0f0a'}),0,1.4,-1.48))}
for(let i=0;i<18;i++){const R=rng(700+i);const s=i%2?1:-1;const x=s*(5+R()*12),z=-18+i*2.4;const tr=new THREE.Mesh(new THREE.ConeGeometry(1+R()*.6,3+R()*2,7),lam(i%3?'#2a6a3a':'#1f5a32'));tr.position.set(x,2.2,z);tr.castShadow=true;gF.add(tr)}
gF.add(new THREE.HemisphereLight('#fff6e0','#4a6a3a',3.1));sunRig(gF,[-8,18,10],[0,0,-1],'#fff1d0',2.6,16);addSet('glade',gF);
const glade=()=>{gF.visible=true;scene.background=new THREE.Color('#9ad8ff')};
// ---------- лестница на чердак (вид сверху)
const gS=new THREE.Group();
gS.add(Object.assign(plane(200,200,lam('#3a3550'),0,0,0,-PI/2),{receiveShadow:true}));
gS.add(cyl(.5,7.4,'#6a5a7a',0,3.7,0));
for(let i=0;i<28;i++){const a=i*.42,y=.25+i*.25;const st=box(1.7,.12,.6,i%2?'#c88a4a':'#b07a3a',Math.cos(a)*1.2,y,Math.sin(a)*1.2);st.rotation.y=-a;gS.add(st)}
const atticDoor=new THREE.Group();gS.add(atticDoor);atticDoor.add(box(1.3,.15,1.3,'#7a4a24',0,7.45,0));
const atticTag=K.stand(1.25,.45,'#ffd23f',[{t:'ЧЕРДАК',s:70,y:.56,c:'#15131a'}],0,7.55,0);atticTag.rotation.x=-PI/2;atticDoor.add(atticTag);
gS.add(new THREE.HemisphereLight('#e6e0ff','#2a2238',3.0));sunRig(gS,[-6,20,8],[0,0,0],'#fff1d9',2.2,12);addSet('stair',gS);
const stair=()=>{gS.visible=true;scene.background=new THREE.Color('#2a2238')};
// ---------- монеты: 24 стопки, раскладка по кадру
const gK=new THREE.Group();
gK.add(Object.assign(plane(200,200,lam('#4a3f66'),0,0,0,-PI/2),{receiveShadow:true}));
const ST=[];for(let i=0;i<24;i++){const g=new THREE.Group();const mat=lam('#ffd23f');for(let k=0;k<12;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;c.receiveShadow=true;g.add(c)}gK.add(g);ST.push({g,mat})}
const tags={};const T2=(k,w,bg,txt,s,col='#15131a')=>{const m=K.stand(w,.6,bg,[{t:txt,s,y:.56,c:col}],0,0,0);gK.add(m);tags[k]=m;return m};
T2('treat30',2.4,'#e8322a','УГОЩЕНИЕ 30',64,'#fff');T2('rest70',2.0,'#ffffff','ОСТАЛЬНОЕ 70',56);T2('y360',2.0,'#e8322a','−360',110,'#fff');
T2('treat10',2.4,'#7dff9a','УГОЩЕНИЕ 10',64);T2('y120',1.8,'#7dff9a','120',110);T2('y240',2.4,'#ffd23f','В ЗАПАС 240',64);
gK.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('coins',gK);
const coins=(t,lay,tg={},sky=0)=>{gK.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#2a2238'),sky);Object.values(tags).forEach(m=>m.visible=false);
 ST.forEach((s,i)=>{const L=lay(i);if(!L||L.n<=0){s.g.visible=false;return}s.g.visible=true;s.g.position.set(L.x,0,L.z);s.mat.color.set(L.c);s.g.children.forEach((c,k)=>c.visible=k<Math.round(L.n))});
 for(const k in tg){const m=tags[k];m.visible=true;m.position.set(...tg[k])}};
// ---------- копилка-банка «ЗАПАС» (на чердаке)
const rA=K.room('rA','#4a4f66');
const jar=new THREE.Group();jar.position.set(.3,0,-1.4);rA.g.add(jar);
jar.add(new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,1.6,28,1,true),new THREE.MeshLambertMaterial({color:'#cfefff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false})));jar.children[0].position.y=.8;
jar.add(cyl(.74,.12,'#8a6a4a',0,1.66,0));
const fill=cyl(.66,1,'#ffd23f',0,.5,0);jar.add(fill);
const jarTag=K.stand(1.5,.55,'#ffffff',[{t:'ЗАПАС',s:80,y:.56,c:'#15131a'}],0,2.1,.2);jar.add(jarTag);
const zero=K.stand(1.3,1.0,'#e8322a',[{t:'0',s:220,y:.58,c:'#fff'}],0,.8,.75);jar.add(zero);
const full=K.stand(1.3,.7,'#2d8a4f',[{t:'240',s:150,y:.58,c:'#fff'}],0,.8,.75);jar.add(full);
const attic=(t,{lvl=0,col='#4a4f66',u=0,z=0}={})=>{resetRoom(rA);rA.col(u,col);fill.visible=lvl>.01;fill.scale.y=Math.max(.01,lvl*1.5);fill.position.y=lvl*.75;zero.visible=z===0;full.visible=z===1};
// ---------- правило сверху
const tR=K.makeTable('tR','ПРАВИЛО',[['УГОЩЕНИЕ ≤ 10 ИЗ 100','лимит — до зарплаты'],['10 × 12 = 120 В ГОД','на радость без долгов'],['240 В ГОД — В ЗАПАС','на чёрный день']]);
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО',0,9,-26,16,9,'#ff9a3a');K.billboard(city.g,'ЗАВТРА','ДЕМЬЯНОВА УХА',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const solT=T('Солдат из «Огнива»'),kon=T('Деньги кончились —'),cher=T('к нему на чердак.'),c360=T('это 360'),nol=T('ноль.'),c10=T('10 из 100.'),c240=T('А 240'),ost=T('остаются вам —'),sub=T('Подпишись,');
const HOOK=['ПЛАТИТЕ ЗА ВСЕХ,','А САМИ','В МИНУСЕ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const gang=(t,on=1,mood='smile')=>{const xs=[-2.0,1.2,2.2],zs=[-.6,-.4,-1.0];fr.forEach((p,i)=>p.pose(xs[i],zs[i],{...FRC[i],expr:mood,look:i?-.6:.6,aR:on?[2.0+.3*Math.sin(t*6+i),.6]:[.2,.2],aL:[.2,.2],propR:on?'cup':undefined,talk:on?talk(t+i):0,blink:blink(t,i*.3)}))};
// раскладки монет
const grid100=(red,g=1)=>(i)=>i<10?{x:-2.25+(i%5)*1.1,z:-1-Math.floor(i/5)*1.3,n:10*g,c:i<red?'#e8322a':'#ffd23f'}:null;
const row12=(c,n,x,g)=>(i)=>i<12?{x,z:.6-i*.62,n:n*clamp(g*12-i),c}:null;
const shots=[
{id:'hook',t0:0,t1:solT,out:'whipR',f(t,u){tav(t);sol.pose(-.3,-.4,{...SOL,expr:t>T('в минусе?')?'shock':'smile',look:.4,aR:[1.6,1.2],aL:[.2,.2],propR:'cash',blink:blink(t)});gang(t);camPath(u,[-.4,.7,3.5],[.2,.9,2.8],[0,1.5,-1.4],[.3,1.6,-1.6],[64,56],.03);fx.draw=K.hook(HOOK,0,solT-.05)}},
{id:'hero',t0:solT,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){glade();sol.pose(-.9,.6,{...SOL,expr:'smile',look:.5,aL:[.2,.2],aR:[.6,.4],blink:blink(t)});dog.visible=true;dog.position.set(.8,0,.2);linPath(u,[-2.8,.8,5.4],[-1.2,1.0,4.8],[0,1.3,-.6],[0,1.5,-.8],[56,52],.02);fx.draw=K.big('СОЛДАТ ИЗ «ОГНИВА»',solT+.05,S('s02')-.05,'#ff9a3a',130,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'friends',t0:S('s03'),t1:kon,in:'whipL',out:'whipR',f(t,u){tav(t,{col:'#e8a23a',u:1});sol.pose(-.3,-.4,{...SOL,expr:'smile',look:.4,aR:[2.2,.4],aL:[2.2,.4],blink:blink(t)});gang(t);const a=lerp(-.6,.4,u);cam.position.set(Math.sin(a)*4.2,lerp(1.2,1.6,u),-.8+Math.cos(a)*4.2);cam.lookAt(0,1.4,-.9);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.big('ДРУЗЬЯ!',T('были и друзья.'),kon-.05,'#ffd23f',200,.16)}},
{id:'gone',t0:kon,t1:cher,in:'whipR',out:'whipUp',f(t,u){tav(t,{col:'#4a4f66',u:ss(kon,kon+.8,t),full:0});sol.pose(-.3,-.4,{...SOL,expr:'shock',look:.2,aR:[.3,.3],aL:[.3,.3],blink:blink(t)});camPath(u,[0,.9,2.8],[0,2.6,3.4],[-.3,1.3,-.4],[-.3,1.0,-.6],[60,64],-.02);fx.draw=K.big('НИКОГО',T('и никто')+.05,cher-.05,'#ffffff',200,.16)}},
{id:'attic',t0:cher,t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){stair();sol.pose(.9,.4,{...SOL,expr:'neutral',look:0,aL:[.2,.2],aR:[.2,.2],blink:blink(t)},7.52);topv(u,-.9,.5,22,16,0,0,0,54)}},
{id:'split',t0:S('s04'),t1:c360,in:'zoom',out:'whipR',f(t,u){const r=ss(T('угощать на 30')-.1,T('угощать на 30')+.4,t);coins(t,grid100(Math.round(3*r)),r>.5?{treat30:[-1.15,.4,-3.9],rest70:[1.3,.4,-3.9]}:{});topv(u,-.4,.3,9.4,8.0,0,0,-1.6,60);fx.draw=K.big('30 ИЗ 100',T('угощать на 30'),c360-.05,'#ff5a3a',180,.12)}},
{id:'year',t0:c360,t1:S('s05'),in:'whipR',out:'whipL',f(t,u){coins(t,row12('#e8322a',3,0,ss(c360-.05,c360+.9,t)),t>c360+.8?{y360:[0,1.0,-7.4]}:{},.2);camPath(u,[-3.0,3.4,4.0],[-1.4,4.4,4.6],[0,.2,-2.6],[0,.4,-3.4],[58,56],.03);fx.draw=K.big('30 × 12 = 360',c360+.05,S('s05')-.05,'#ff5a3a',150,.16)}},
{id:'zero',t0:S('s05'),t1:S('s06'),in:'whipL',out:'zoom',f(t,u){attic(t);sol.pose(-1.4,-.4,{...SOL,expr:t>nol?'shock':'neutral',look:.6,aL:[.3,.3],aR:[.3,.3],blink:blink(t)});camPath(u,[1.4,.9,3.4],[.8,1.3,2.0],[.3,1.0,-1.4],[.3,1.0,-1.4],[58,52],.03);shake(t,nol,.25,.6);const h=t-nol;if(h>0){fx.crack={p:[.3,.8,-.65],a:clamp(h*3),seed:59};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('ЗАПАС = 0',nol+.05,S('s06')-.05,'#ffffff',170,.16)}},
{id:'rule',t0:S('s06'),t1:c10,in:'zoom',out:'whipUp',f(t,u){table([t>T('на угощение')-.1,0,0]);topv(u,-.4,.25,10.2,8.4,0,0,0,58)}},
{id:'limit',t0:c10,t1:S('s07'),in:'whipUp',out:'whipR',f(t,u){coins(t,grid100(1),{treat10:[0,1.6,-3.9]});const a=lerp(.5,-.2,u);cam.position.set(Math.sin(a)*6.4,lerp(5.2,3.8,u),-1.6+Math.cos(a)*6.4);cam.lookAt(0,.3,-1.6);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('10 ИЗ 100',c10,S('s07')-.05,'#7dff9a',180,.16)}},
{id:'y120',t0:S('s07'),t1:ost,in:'whipR',out:'whipL',f(t,u){const g1=ss(S('s07')-.05,S('s07')+.8,t),g2=ss(c240-.1,c240+.7,t);coins(t,(i)=>i<12?row12('#7dff9a',1,-1.2,g1)(i):row12('#ffd23f',2,1.2,g2)(i-12),{...(g1>.9?{y120:[-1.2,1.0,-7.4]}:{}),...(g2>.9?{y240:[1.3,1.0,-7.4]}:{})});camPath(u,[-3.4,3.8,4.6],[2.2,4.4,4.4],[-.4,.2,-3.0],[.6,.3,-3.4],[58,56],.03);fx.draw=K.big(t<c240?'120 НА РАДОСТЬ':'240 В ЗАПАС',t<c240?S('s07'):c240,t<c240?c240-.02:ost-.05,t<c240?'#7dff9a':'#ffd23f',140,.16)}},
{id:'jar',t0:ost,t1:S('s08'),in:'whipL',out:'whipR',f(t,u){const l=ss(ost,S('s08'),t);attic(t,{lvl:l,col:'#e8a23a',u:1,z:l>.5?1:2});sol.pose(-1.4,-.4,{...SOL,expr:'smile',look:.6,aL:[.2,.2],aR:[1.4,1.0],blink:blink(t)});const a=lerp(-.4,.4,u);cam.position.set(.3+Math.sin(a)*3.4,lerp(1.0,1.5,u),-1.4+Math.cos(a)*3.4);cam.lookAt(-.2,1.1,-1.2);cam.fov=60;cam.updateProjectionMatrix()}},
{id:'real',t0:S('s08'),t1:S('s09'),in:'whipR',out:'whipUp',f(t,u){tav(t,{col:'#e8a23a',u:1,full:0});sol.pose(-.3,-.4,{...SOL,expr:'smile',look:.4,aR:[2.0,.6],aL:[.2,.2],propR:'cup',blink:blink(t)});gang(t,1,'smile');camPath(u,[1.6,.7,3.5],[.6,1.0,3.0],[0,1.4,-.8],[0,1.5,-.8],[60,56],-.02);fx.draw=K.big('НАСТОЯЩИЕ ДРУЗЬЯ',S('s08')+.05,S('s09')-.05,'#ffd23f',130,.16)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){glade();sol.pose(-.8,.8,{...SOL,expr:'smile',look:.5,aL:[.2,.2],aR:[2.2+.3*Math.sin(t*8),.4],blink:blink(t)});dog.visible=true;dog.position.set(.8,0,.3);camPath(u,[2.6,.8,5.6],[1.2,1.0,4.6],[0,1.3,-.4],[0,1.4,-.4],[56,52],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);P.forEach(p=>p.hide());f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
