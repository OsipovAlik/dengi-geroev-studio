import {kit} from '/lib_ru.js';
// 68 Свинья под дубом (Крылов): тратить запас вместо дохода — подрывать корни, которые кормят; 1000 под 10% годовых = 100 в год навсегда; снимать по 300 в год: 800 → 580 → 338 → 72 (меньше 100 через 4 года); правило: тратьте жёлуди (доход), а не корни (запас)
// Цветовая идея: холодный синий «до зарплаты» → сочный зелёный дуба → сухой коричневый подрытых корней → снова зелёный правила
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Свинья (своя рисовка): розовая, большая круглая голова, пятачок, уши-треугольники, хвостик-завиток
const pig=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const PK='#f6a0b4',PD='#e07890';
 // хвостик
 c.beginPath();c.moveTo(w*.86,h*.52);c.bezierCurveTo(w*.97,h*.45,w*.97,h*.6,w*.9,h*.58);c.bezierCurveTo(w*.85,h*.56,w*.9,h*.5,w*.95,h*.5);c.stroke();
 // ноги
 c.fillStyle=PD;for(const x of[.42,.52,.72,.8]){c.beginPath();c.roundRect(w*x-w*.035,h*.7,w*.07,h*.22,8);c.fill();c.stroke()}
 // тело
 c.fillStyle=PK;c.beginPath();c.ellipse(w*.62,h*.58,w*.27,h*.2,0,0,7);c.fill();c.stroke();
 c.fillStyle=PD;c.beginPath();c.ellipse(w*.66,h*.52,w*.08,h*.05,.3,0,7);c.fill();
 // голова
 const hx=.32,hy=.4,hr=.22;
 c.fillStyle=PK;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(hx+s*.1),h*(hy-.14));c.lineTo(w*(hx+s*.2),h*(hy-.3));c.lineTo(w*(hx+s*.2-s*.12),h*(hy-.2));c.closePath();c.fill();c.stroke()}
 c.beginPath();c.arc(w*hx,h*hy,w*hr,0,7);c.fill();c.stroke();
 // пятачок
 c.fillStyle='#ff8aa6';c.beginPath();c.ellipse(w*hx,h*(hy+.08),w*.085,h*.055,0,0,7);c.fill();c.stroke();c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(hx+s*.032),h*(hy+.08),w*.014,h*.02,0,0,7);c.fill()}
 // глаза
 c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.08),h*(hy-.05),w*.042,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;const ly=mood==='sad'?.02:0;for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.08+(mood==='sly'?.015:0)),h*(hy-.045+ly),w*.02,0,7);c.fill()}
 if(mood==='sly'){c.strokeStyle=INK;c.lineWidth=9;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(hx+s*.12),h*(hy-.11));c.lineTo(w*(hx+s*.04),h*(hy-.085));c.stroke()}}
 if(mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(hx+s*.12),h*(hy-.09));c.lineTo(w*(hx+s*.04),h*(hy-.115));c.stroke()}}
 // рот
 c.lineWidth=9;c.strokeStyle=INK;
 if(mood==='sad'){c.beginPath();c.arc(w*hx,h*(hy+.2),w*.05,PI*1.15,PI*1.85);c.stroke()}
 else if(mood==='eat'){c.fillStyle='#7a1a2a';c.beginPath();c.ellipse(w*hx,h*(hy+.165),w*.05,h*.03,0,0,7);c.fill();c.stroke();c.fillStyle='#b07a3a';c.beginPath();c.ellipse(w*(hx+.04),h*(hy+.16),w*.03,h*.025,0,0,7);c.fill();c.stroke()}
 else {c.beginPath();c.arc(w*hx,h*(hy+.12),w*.07,PI*.2,PI*.8);c.stroke()}
 c.fillStyle='rgba(255,90,120,.55)';for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.15),h*(hy+.06),w*.028,0,7);c.fill()}};
// ---------- Ворон: чёрный, большая голова, серый клюв
const raven=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=10;const B='#2a2a3a';
 c.fillStyle='#d8a020';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.06),h*.86);c.lineTo(w*(.5+s*.1),h*.98);c.stroke()}
 c.fillStyle=B;c.beginPath();c.moveTo(w*.72,h*.6);c.lineTo(w*.95,h*.92);c.lineTo(w*.7,h*.82);c.closePath();c.fill();c.stroke();
 c.beginPath();c.ellipse(w*.52,h*.68,w*.26,h*.2,0,0,7);c.fill();c.stroke();
 c.fillStyle='#3e3e55';c.beginPath();c.ellipse(w*.6,h*.68,w*.16,h*.12,.4,0,7);c.fill();c.stroke();
 c.fillStyle=B;c.beginPath();c.arc(w*.44,h*.36,w*.25,0,7);c.fill();c.stroke();
 const op=mood==='warn';c.fillStyle='#9aa0aa';c.beginPath();c.moveTo(w*.22,h*.34);c.lineTo(w*.02,h*(op?.36:.4));c.lineTo(w*.22,h*.42);c.closePath();c.fill();c.stroke();
 if(op){c.beginPath();c.moveTo(w*.22,h*.43);c.lineTo(w*.05,h*.5);c.lineTo(w*.22,h*.47);c.closePath();c.fill();c.stroke()}
 c.fillStyle='#fff';c.lineWidth=8;for(const s of[-1,1]){c.beginPath();c.arc(w*(.42+s*.09),h*.3,w*.06,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.41+s*.09),h*.31,w*.028,0,7);c.fill()}
 if(op){c.lineWidth=9;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.42+s*.16),h*.21);c.lineTo(w*(.42+s*.04),h*.24);c.stroke()}}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const PG=mk(pig,['happy','sad','sly','eat'],1.9,1.5);const RV=mk(raven,['calm','warn'],.9,1.0);
const BB=[...Object.values(PG),...Object.values(RV)];
const put=(set,md,x,z,t,y=0,bob=1)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.4))*.03*bob,z)};
const acornG=(s=1)=>{const g=new THREE.Group();const n=new THREE.Mesh(new THREE.SphereGeometry(.1*s,12,10),lam('#c88a3a'));n.scale.y=1.3;n.castShadow=true;g.add(n);const cp=new THREE.Mesh(new THREE.SphereGeometry(.105*s,12,8,0,PI*2,0,PI/2),lam('#6a4020'));cp.position.y=.06*s;cp.castShadow=true;g.add(cp);g.add(cyl(.015*s,.06*s,'#4a2a10',0,.17*s,0));return g};
// ---------- кухня «до зарплаты»: банка ЗАПАС
const rK=K.room('rK','#5a7aa8');
const tblK=new THREE.Group();tblK.position.set(.9,0,-2.2);tblK.add(box(1.8,.08,1.0,'#7a5a3a',0,.9,0));for(const x of[-.8,.8])for(const z of[-.4,.4])tblK.add(box(.08,.9,.08,'#4a3420',x,.45,z));rK.g.add(tblK);
const jar=new THREE.Group();jar.position.set(1.3,.94,-2.2);jar.add(new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.7,24),new THREE.MeshLambertMaterial({color:'#bfe6f0',transparent:true,opacity:.55})));jar.children[0].position.y=.35;jar.add(cyl(.34,.1,'#d0a030',0,.74,0));
const jarCoins=[];for(let i=0;i<8;i++){const c=cyl(.22,.05,'#ffd23f',0,.06+i*.06,0);jar.add(c);jarCoins.push(c)}
const jarLab=K.stand(.62,.26,'#ffffff',[{t:'ЗАПАС',s:44,y:.56,c:'#15131a'}],0,.4,.34);jar.add(jarLab);rK.g.add(jar);
const cal=K.stand(1.3,1.4,'#ffffff',[{t:'ДО ЗАРПЛАТЫ',s:34,y:.18,c:'#e8322a'},{t:'5',s:170,y:.58,c:'#15131a'},{t:'ДНЕЙ',s:50,y:.88,c:'#15131a'}],-1.6,2.3,-3.94);rK.g.add(cal);
const kitchen=(t,{u=0,coins=8}={})=>{resetRoom(rK);rK.col(u,'#3a4a7a');jarCoins.forEach((c,i)=>c.visible=i<coins)};
// ---------- поляна с вековым дубом
const gF=new THREE.Group();
const grass=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#6aae4a';c.fillRect(0,0,w,h);const R=rng(68);c.strokeStyle='rgba(20,70,20,.45)';c.lineWidth=3;for(let i=0;i<220;i++){const x=R()*w,y=R()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*8,y-12);c.stroke()}},{wrap:true});grass.repeat.set(30,30);
gF.add(Object.assign(plane(200,200,lam('#fff',{map:grass}),0,0,0,-PI/2),{receiveShadow:true}));
const oak=new THREE.Group();oak.position.set(0,0,-3);gF.add(oak);
const trunkM=lam('#7a4a24');const tk=new THREE.Mesh(new THREE.CylinderGeometry(.7,1.0,5,14),trunkM);tk.position.y=2.5;tk.castShadow=true;tk.receiveShadow=true;oak.add(tk);
const crownM=lam('#2f8a3a',{flatShading:true});const crown=[];for(const [x,y,z,r] of[[0,6.4,0,2.8],[-2.2,5.6,.5,2.0],[2.3,5.8,-.3,2.1],[.3,8.0,.2,2.0],[-1,5.2,-1.6,1.7],[1.4,5.0,1.4,1.6]]){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),crownM);s.position.set(x,y,z);s.castShadow=true;s.receiveShadow=true;oak.add(s);crown.push(s)}
const branch=box(2.8,.22,.22,'#6a4020',-2.2,3.1,1.4);oak.add(branch);
const roots=[];for(let i=0;i<7;i++){const a=i/7*PI*2+.3;const r=new THREE.Mesh(new THREE.CylinderGeometry(.12,.28,2.6,8),trunkM);r.castShadow=true;const g=new THREE.Group();g.rotation.y=-a;r.rotation.z=PI/2-.12;r.position.set(1.9,0,0);g.add(r);oak.add(g);roots.push(r)}
const dirt=[];for(let i=0;i<9;i++){const a=i/9*PI*2;const d=new THREE.Mesh(new THREE.SphereGeometry(.6,10,6),lam('#6a4a2a'));d.scale.set(1,.3,1);d.position.set(Math.cos(a)*2.4,0,Math.sin(a)*2.4);d.castShadow=true;oak.add(d);dirt.push(d)}
const ACF=[];const RA=rng(5);for(let i=0;i<26;i++){const a=acornG(1.4);const ang=RA()*PI*2,rr=1.3+RA()*3;a.position.set(Math.cos(ang)*rr,.1,Math.sin(ang)*rr+1);a.rotation.z=(RA()-.5)*1.4;oak.add(a);ACF.push(a)}
const fall=[];for(let i=0;i<8;i++){const a=acornG(1.6);a.userData={x:(RA()-.5)*4,z:(RA()-.5)*2+1,ph:RA()};oak.add(a);fall.push(a)}
for(let i=0;i<20;i++){const R=rng(800+i);const s=i%2?1:-1;const x=s*(7+R()*14),z=-24+i*2.4;const tr=new THREE.Mesh(new THREE.ConeGeometry(1.2+R()*.6,3.5+R()*2,7),lam(i%3?'#2a6a3a':'#1f5a32'));tr.position.set(x,2.4,z);tr.castShadow=true;gF.add(tr)}
const sSav=K.stand(2.6,.7,'#ffd23f',[{t:'СБЕРЕЖЕНИЯ',s:80,y:.56,c:'#15131a'}],0,1.8,-1.95);oak.add(sSav);sSav.position.set(0,1.8,1.05);
const sInc=K.stand(1.9,.7,'#7dff9a',[{t:'ДОХОД',s:96,y:.56,c:'#15131a'}],0,0,0);oak.add(sInc);sInc.position.set(2.4,1.2,2.6);
gF.add(new THREE.HemisphereLight('#fff6e0','#4a6a3a',3.1));sunRig(gF,[-9,18,10],[0,0,-2],'#fff1d0',2.6,16);addSet('glade',gF);
const glade=(t,{dig=0,dry=0,bg='#9ad8ff',signs=0,drop=0,shk=0}={})=>{gF.visible=true;scene.background=new THREE.Color(bg).lerp(new THREE.Color('#e0b070'),dry*.6);
 crownM.color.set('#2f8a3a').lerp(new THREE.Color('#9a7a3a'),dry);crown.forEach((s,i)=>s.scale.setScalar(1-dry*.12*(i%3)));
 oak.rotation.z=Math.sin(t*37)*.012*shk;
 roots.forEach((r,i)=>{r.position.y=lerp(-.35,.12,clamp(dig*1.4-i*.06))});dirt.forEach((d,i)=>{d.visible=dig>i/12;d.scale.set(1,.3*clamp(dig*2),1)});
 sSav.visible=signs>0;sInc.visible=signs>0;
 fall.forEach((a,i)=>{a.visible=drop>0;const p=((t*.6+a.userData.ph)%1);a.position.set(a.userData.x,lerp(4.6,.15,p*p),a.userData.z);a.rotation.z=p*6})};
// ---------- вид сверху: монета-запас 1000 и жёлуди-проценты по кругу
const gC=new THREE.Group();gC.add(Object.assign(plane(80,80,lam('#2f6a3a'),0,0,0,-PI/2),{receiveShadow:true}));
const coin=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,.3,48),[lam('#e0a030'),new THREE.MeshLambertMaterial({map:label(512,512,'#ffcf3a',[{t:'ЗАПАС',s:84,y:.32,c:'#7a4a00'},{t:'1000',s:180,y:.6,c:'#7a4a00'}],{border:'#7a4a00',bw:16})}),lam('#e0a030')]);coin.position.y=.15;coin.castShadow=true;gC.add(coin);
const yr=[];for(let i=0;i<6;i++){const g=new THREE.Group();const a=acornG(4);g.add(a);const l=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.6),new THREE.MeshBasicMaterial({map:label(260,120,'#7dff9a',[{t:'+100',s:84,y:.56,c:'#15131a'}],{border:INK,bw:10}),transparent:true}));l.rotation.x=-PI/2;l.position.set(0,.6,.9);g.add(l);const ang=i/6*PI*2;g.position.set(Math.cos(ang)*3.1,.3,Math.sin(ang)*3.1);gC.add(g);yr.push(g)}
gC.add(new THREE.HemisphereLight('#fff','#2a4a2a',3.1));sunRig(gC,[-5,14,6],[0,0,0],'#fff1d9',2.5,8);addSet('coin',gC);
const coinTop=(t,n=0)=>{gC.visible=true;scene.background=new THREE.Color('#1f4a2a');yr.forEach((g,i)=>{const k=clamp(n*6-i);g.visible=k>0;g.scale.setScalar(Math.max(.001,k));g.position.y=.3+(1-k)*2})};
// ---------- две башни: тратим доход / тратим запас
const gT=new THREE.Group();gT.add(Object.assign(plane(200,200,lam('#2a3450'),0,0,0,-PI/2),{receiveShadow:true}));
const twL=K.tower('#4ab85a',-1.5,0),twR=K.tower('#e8503a',1.5,0);gT.add(twL.g,twR.g);
gT.add(K.stand(2.4,.8,'#7dff9a',[{t:'ТРАТИМ',s:60,y:.32,c:'#15131a'},{t:'ДОХОД',s:76,y:.72,c:'#15131a'}],-1.5,3.7,0));
gT.add(K.stand(2.4,.8,'#ffb0a0',[{t:'ТРАТИМ',s:60,y:.32,c:'#15131a'},{t:'ЗАПАС',s:76,y:.72,c:'#15131a'}],1.5,3.7,0));
gT.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gT,[-6,16,9],[0,0,0],'#fff1d9',2.4,10);addSet('towers',gT);
const BAL=[1000,800,580,338,72];
const towers=(t,k=0,bg=0)=>{gT.visible=true;scene.background=new THREE.Color('#ffb08a').lerp(new THREE.Color('#2a3a6a'),bg);twL.set(10);const y=Math.min(4,Math.floor(k*5));twR.set(Math.max(1,Math.round(BAL[y]/100)));return y};
// ---------- правило
const tR=K.makeTable('tR','ПРАВИЛО ДУБА',[['ЖЁЛУДИ','доход — можно тратить'],['КОРНИ','запас — только в беде']],'#b58a5e');
const ac2=acornG(6);ac2.position.set(2.9,.3,-1.4);tR.g.add(ac2);
const rule=(t,hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#9ad8a8');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(i?'#ffb0a0':'#7dff9a')})};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- город: билборды
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО ДУБА',0,9,-26,16,9,'#7dff9a');K.billboard(city.g,'ДАЛЬШЕ','ПЕТУХ И ЖЕМЧУГ',0,9,24,16,9,'#ffd23f');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const sv=T('Свинья'),sn=T('Свинья наелась'),ip=T('и стала подрывать'),vo=T('Ворон:'),dz=T('дуб засохнет!'),ao=T('А она:'),lb=T('лишь бы'),nz=T('Но жёлуди'),ra=T('растут'),vd=T('Ваш дуб —'),zh=T('Жёлуди —'),ty=T('Тысяча'),d100=T('даёт 100 в год —'),it=T('всегда.'),sn2=T('Снимаете'),p300=T('по 300 —'),c4=T('через 4 года'),m100=T('меньше 100.'),pr=T('Правило:'),dz2=T('Сам запас —'),kr=T('Корни'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:sv,out:'whipR',f(t,u){kitchen(t,{coins:Math.round(lerp(8,5,ss(.3,.9,u)))});put(PG,'sad',-.3,-2.0,t);camPath(u,[-1.6,.8,2.2],[-.6,.9,1.5],[.2,1.25,-2.1],[.4,1.25,-2.1],[62,56],.03);fx.draw=K.hook(['БЕРЁТЕ ИЗ ЗАПАСА','ДО ЗАРПЛАТЫ?'],-1,sv-.05)}},
{id:'name',t0:sv,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){glade(t);put(PG,'happy',1.0,.4,t);const a=lerp(-.8,-.3,u);cam.position.set(Math.sin(a)*11,lerp(9,5,ease(u)),-1+Math.cos(a)*11);cam.lookAt(0,2.6,-2);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('СВИНЬЯ ПОД ДУБОМ',sv+.05,S('s02')-.05,'#ffd23f',130,.13)}},
{id:'promise',t0:S('s02'),t1:sn,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'eat',t0:sn,t1:ip,in:'zoom',out:'whipUp',f(t,u){glade(t,{drop:1});put(PG,'eat',.9,.6,t);camPath(u,[-1.2,.5,4.6],[.2,.7,3.4],[.6,.9,.4],[.7,.85,.4],[58,54],.02);fx.tags=[{txt:'ЖЁЛУДИ',t:sn+.4,xy:[.5,.14]}]}},
{id:'dig',t0:ip,t1:vo,in:'whipUp',out:'whipUp',f(t,u){glade(t,{dig:ss(ip,vo,t)});put(PG,'eat',2.2,-.6,t,0,3);camPath(u,[4.8,.6,2.8],[3.7,.85,1.7],[1.2,.3,-1.8],[1.0,.35,-1.9],[60,56],.03);fx.draw=K.big('КОРНИ',T('корни дуба.'),vo-.05,'#ffffff',190,.13)}},
{id:'raven',t0:vo,t1:ao,in:'whipUp',out:'whipR',f(t,u){glade(t,{dig:1,dry:ss(dz,ao,t)*.4});put(RV,t>dz-.2?'warn':'calm',-3.4,-1.6,t,3.21,0);camPath(u,[-5.6,2.4,2.6],[-4.6,3.2,1.2],[-3.4,3.6,-1.6],[-3.4,3.75,-1.6],[56,50],.03);fx.draw=K.big('ДУБ ЗАСОХНЕТ!',dz,ao-.05,'#ff5a3a',150,.13)}},
{id:'reply',t0:ao,t1:nz,in:'whipR',out:'whipL',f(t,u){glade(t,{dig:1,dry:.4});put(PG,'sly',.6,.6,t);camPath(u,[1.8,.6,3.6],[.9,.75,2.6],[.3,1.0,.6],[.35,1.0,.6],[56,52],-.03);fx.tags=[{txt:'ЛИШЬ БЫ ЖЁЛУДИ',t:lb,xy:[.5,.14]}]}},
{id:'boom',t0:nz,t1:vd,in:'whipL',out:'zoom',f(t,u){const h=t-ra;glade(t,{dig:1,dry:lerp(.4,.9,ss(ra,vd,t)),shk:h>0?Math.max(0,1-h)*3:0});put(PG,h>0?'sad':'sly',1.0,-.6,t);camPath(u,[0,1.2,7.5],[0,1.4,6.2],[0,2.0,-2.6],[0,2.2,-2.6],[64,60],0);shake(t,ra,.35,.8);if(h>0){fx.flash=Math.max(0,1-h/.25);fx.crack={p:[0,2.6,-2.2],a:clamp(h*3),seed:68}}fx.draw=K.hook(['ЖЁЛУДИ РАСТУТ','НА ЭТОМ ДУБЕ'],ra,vd-.05)}},
{id:'meta',t0:vd,t1:ty,in:'zoom',out:'whipUp',f(t,u){glade(t,{signs:1,drop:1});put(PG,'happy',-2.2,1.6,t);const a=lerp(.5,-.4,u);cam.position.set(Math.sin(a)*9,lerp(3.4,4.4,u),-2+Math.cos(a)*9);cam.lookAt(.6,2.0,-1.6);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'coin',t0:ty,t1:sn2,in:'whipUp',out:'whipR',f(t,u){coinTop(t,ss(d100,sn2-.1,t));topv(u,-.5,.6,14,12.5,0,0,0,58);fx.draw=K.big(t<it?'+100 В ГОД':'И ТАК ВСЕГДА',d100,sn2-.05,'#7dff9a',150,.13)}},
{id:'towers',t0:sn2,t1:pr,in:'whipR',out:'whipL',f(t,u){const y=towers(t,ss(p300,m100+.2,t)*.999,ss(c4,m100+.4,t));camPath(u,[-3.2,2.2,11],[2.4,2.6,11],[0,1.9,0],[.3,1.8,0],[56,54],.02);shake(t,m100,.15,.4);
 fx.draw=K.big(t<p300?'−300 В ГОД':('ЗАПАС: '+BAL[y]),sn2+.05,pr-.05,y>=3?'#ff5a3a':'#ffffff',150,.13)}},
{id:'rule',t0:pr,t1:dz2,in:'whipL',out:'whipUp',f(t,u){rule(t,[t>T('тратьте жёлуди,')-.1,t>T('а не корни.')-.1]);topv(u,-.4,.25,10.6,9.0,.6,0,0,60);fx.draw=K.big('ЖЁЛУДИ, НЕ КОРНИ',pr+.1,dz2-.05,'#ffffff',120,.13)}},
{id:'rule2',t0:dz2,t1:kr,in:'whipUp',out:'zoom',f(t,u){glade(t,{signs:1});put(PG,'happy',1.0,1.0,t);camPath(u,[3.6,1.3,6.0],[1.6,1.8,5.0],[.8,.5,-.4],[.6,.55,-.4],[58,54],-.02);fx.draw=K.big('ЗАПАС — В БЕДЕ',dz2+.05,kr-.05,'#ffb0a0',140,.13)}},
{id:'roots',t0:kr,t1:S('s09'),in:'zoom',out:'whipUp',f(t,u){glade(t,{drop:1});put(PG,'happy',1.2,.8,t);camPath(u,[-2,.6,6.8],[-.8,.8,5.2],[0,.8,-2],[0,1.0,-2],[58,52],-.02);fx.draw=K.hook(['КОРНИ','НЕ ТРОГАЙ'],kr+.05,S('s09')-.05)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){glade(t,{drop:1});put(PG,'happy',0,1.4,t,Math.abs(Math.sin(t*5))*.1);camPath(u,[1.4,1.0,6.4],[.6,1.1,5.0],[0,.45,1.2],[0,.5,1.2],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
