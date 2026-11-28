import {kit} from '/lib_ru.js';
// 69 Петух и жемчужное зерно (Крылов): не выбрасывать то, что кажется мусором, — чек и гарантийный талон; телефон сломался через 10 месяцев при гарантии 12: с чеком ремонт бесплатно, без чека — 150 из своего кармана; правило: в день покупки сфотографировать чек и гарантию и хранить в одной папке
// Цветовая идея: серо-бурый двор и мусор → перламутровый белый жемчуга → тревожный красный мастерской → спокойный бирюзовый правила
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Петух (своя рисовка): большая круглая голова, красный гребень, жёлтый клюв, рыжее тело, хвост дугами
const rooster=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 // хвост
 const TC=['#1f8a5a','#e8322a','#1f5aa8','#ffb02a'];TC.forEach((col,i)=>{c.strokeStyle=INK;c.lineWidth=30;c.beginPath();c.arc(w*.7,h*.52,w*(.2-i*.03),-PI*.95+i*.12,-PI*.15);c.stroke();c.strokeStyle=col;c.lineWidth=18;c.stroke()});c.strokeStyle=INK;c.lineWidth=11;
 // ноги
 for(const s of[-1,1]){c.strokeStyle=INK;c.lineWidth=20;c.beginPath();c.moveTo(w*(.5+s*.06),h*.72);c.lineTo(w*(.5+s*.07),h*.95);c.lineTo(w*(.5+s*.07+.07),h*.97);c.stroke();c.strokeStyle='#ffc020';c.lineWidth=9;c.stroke()}c.strokeStyle=INK;c.lineWidth=11;
 // тело
 c.fillStyle='#e8762a';c.beginPath();c.ellipse(w*.52,h*.62,w*.25,h*.15,0,0,7);c.fill();c.stroke();
 c.fillStyle='#c85a1a';c.beginPath();c.ellipse(w*.58,h*.61,w*.13,h*.07,.3,0,7);c.fill();c.stroke();
 // голова
 const hx=.36,hy=.3,hr=.19;
 c.fillStyle='#e8322a';for(let i=0;i<3;i++){c.beginPath();c.arc(w*(hx-.07+i*.07),h*(hy-.13),w*.055,0,7);c.fill();c.stroke()}
 c.fillStyle='#ffd8a0';c.beginPath();c.arc(w*hx,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#ffc020';c.beginPath();c.moveTo(w*(hx-.15),h*(hy+.0));c.lineTo(w*(hx-.32),h*(hy+.035));c.lineTo(w*(hx-.15),h*(hy+.07));c.closePath();c.fill();c.stroke();
 if(mood==='talk'){c.beginPath();c.moveTo(w*(hx-.15),h*(hy+.075));c.lineTo(w*(hx-.28),h*(hy+.11));c.lineTo(w*(hx-.15),h*(hy+.095));c.closePath();c.fill();c.stroke()}
 c.fillStyle='#e8322a';c.beginPath();c.ellipse(w*(hx-.11),h*(hy+.13),w*.035,h*.045,0,0,7);c.fill();c.stroke();
 c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.065),h*(hy-.035),w*.04,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.065-.012),h*(hy-.03),w*.019,0,7);c.fill()}
 if(mood==='talk'||mood==='sly'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(hx+s*.11),h*(hy-.1));c.lineTo(w*(hx+s*.03),h*(hy-.075));c.stroke()}}
 if(mood==='happy'){c.beginPath();c.arc(w*(hx+.03),h*(hy+.1),w*.04,PI*.15,PI*.85);c.stroke()}
 c.fillStyle='rgba(255,90,90,.5)';for(const s of[-1,1]){c.beginPath();c.arc(w*(hx+s*.12),h*(hy+.05),w*.025,0,7);c.fill()}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const RO=mk(rooster,['happy','sly','talk'],1.5,1.7);
const BB=[...Object.values(RO)];
const put=(md,x,z,t,y=0,bob=1)=>{BB.forEach(m=>m.visible=false);const m=RO[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.6))*.03*bob,z)};
const pearlM=()=>new THREE.MeshPhongMaterial({color:'#fbf8ff',emissive:'#30303c',shininess:120,specular:'#ffffff'});
const glowTex=canvasTex(256,256,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,'rgba(220,235,255,.45)');g.addColorStop(1,'rgba(220,235,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
const mkGlow=(s)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));m.scale.set(s,s,1);return m};
const receiptTex=label(300,560,'#ffffff',[{t:'ЧЕК',s:70,y:.1,c:'#15131a'},{t:'ТЕЛЕФОН',s:40,y:.3,c:'#15131a'},{t:'ИТОГО',s:40,y:.7,c:'#15131a'},{t:'ДАТА: 01.02',s:34,y:.86,c:'#15131a'}],{border:'#9a9a9a',bw:6,extra:(c,w,h)=>{c.fillStyle='#c9c3b2';for(let i=0;i<6;i++)c.fillRect(30,h*(.38+i*.045),w-60-(i%2)*70,10)}});
// ---------- комната с мусорным ведром (хук)
const rH=K.room('rH','#8a8a7a');
const bin=new THREE.Group();bin.position.set(1.2,0,-2.0);bin.add(new THREE.Mesh(new THREE.CylinderGeometry(.45,.36,.9,20,1,true),lam('#6a7a8a',{side:THREE.DoubleSide})));bin.children[0].position.y=.45;bin.children[0].castShadow=true;bin.add(cyl(.36,.04,'#2a2a2a',0,.05,0));
for(let i=0;i<5;i++){const R=rng(30+i);const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,0),lam(['#c8c0a8','#a8b8c8','#d8c890'][i%3],{flatShading:true}));b.position.set((R()-.5)*.4,.75+R()*.12,(R()-.5)*.4);bin.add(b)}
const binLab=K.stand(.8,.3,'#ffd23f',[{t:'МУСОР',s:56,y:.56,c:'#15131a'}],0,.45,.46);bin.add(binLab);rH.g.add(bin);
const rcpt=new THREE.Mesh(new THREE.PlaneGeometry(.42,.78),new THREE.MeshLambertMaterial({map:receiptTex,side:THREE.DoubleSide}));rcpt.castShadow=true;rH.g.add(rcpt);
const room=(t,{u=0,toss=0}={})=>{resetRoom(rH);rH.col(u,'#5a5a4a');const k=ease(clamp(toss));rcpt.position.set(lerp(-.2,1.2,k),lerp(1.4,.85,k)+Math.sin(k*PI)*.9,lerp(-1.6,-2.0,k));rcpt.rotation.set(k*4,k*3,k*2)};
// ---------- скотный двор: навозная куча с жемчужиной
const gY=new THREE.Group();
const dirtT=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#b89a6a';c.fillRect(0,0,w,h);const R=rng(69);for(let i=0;i<260;i++){c.fillStyle=`rgba(${80+R()*40},${60+R()*30},30,.35)`;c.beginPath();c.arc(R()*w,R()*h,2+R()*6,0,7);c.fill()}},{wrap:true});dirtT.repeat.set(30,30);
gY.add(Object.assign(plane(200,200,lam('#fff',{map:dirtT}),0,0,0,-PI/2),{receiveShadow:true}));
const heap=new THREE.Group();heap.position.set(0,0,-1.5);gY.add(heap);const RH=rng(7);for(let i=0;i<14;i++){const a=RH()*PI*2,r=RH()*1.3;const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.5+RH()*.4,1),lam(i%2?'#6a4a2a':'#5a3a1a',{flatShading:true}));s.position.set(Math.cos(a)*r,.15+RH()*.3,Math.sin(a)*r);s.scale.y=.55;s.castShadow=true;s.receiveShadow=true;heap.add(s)}
for(let i=0;i<10;i++){const st=box(.04,.04,.6,'#e8c860',(RH()-.5)*2.4,.5+RH()*.2,(RH()-.5)*2.4);st.rotation.y=RH()*3;heap.add(st)}
const pearl=new THREE.Mesh(new THREE.SphereGeometry(.22,32,24),pearlM());pearl.position.set(.5,.62,.6);pearl.castShadow=true;heap.add(pearl);const pg=mkGlow(1.6);pg.position.copy(pearl.position);heap.add(pg);
const barley=[];for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),lam('#e8c040'));b.scale.set(1,.6,1.8);b.position.set(-1.6+i*.18,.05,1.4+Math.sin(i)*.2);b.castShadow=true;gY.add(b);barley.push(b)}
// забор и сарай
for(let i=0;i<24;i++){gY.add(box(.18,1.3,.12,'#c89a5a',-11+i*.95,.65,-7))}gY.add(box(23,.12,.1,'#a87a3a',0,.9,-6.92));gY.add(box(23,.12,.1,'#a87a3a',0,.4,-6.92));
const barn=new THREE.Group();barn.position.set(-5.5,0,-11);barn.add(box(5,3.4,4,'#c8402a',0,1.7,0));const rf=new THREE.Mesh(new THREE.ConeGeometry(3.9,1.8,4),lam('#5a3a2a'));rf.rotation.y=PI/4;rf.position.y=4.3;rf.castShadow=true;barn.add(rf);barn.add(box(1.4,2.2,.08,'#7a2a1a',0,1.1,2.02));gY.add(barn);
for(let i=0;i<10;i++){const R=rng(900+i);const s=i%2?1:-1;const tr=new THREE.Mesh(new THREE.ConeGeometry(1.2+R()*.6,3.5+R()*2,7),lam(i%3?'#3a7a3a':'#2a6a32'));tr.position.set(s*(8+R()*10),2.4,-14-R()*10);tr.castShadow=true;gY.add(tr)}
gY.add(new THREE.HemisphereLight('#fff6e0','#6a5a3a',3.1));sunRig(gY,[-9,18,10],[0,0,-1],'#fff1d0',2.6,16);addSet('yard',gY);
const yard=(t,{bg='#a8d8ff',pr=1,glow=1}={})=>{gY.visible=true;scene.background=new THREE.Color(bg);pearl.visible=pr>0;pg.visible=pr>0;pg.material.opacity=glow*(.75+.25*Math.sin(t*4))};
// ---------- вид сверху: жемчуг против ячменя
const gP=new THREE.Group();gP.add(Object.assign(plane(80,80,lam('#5a3a1a'),0,0,0,-PI/2),{receiveShadow:true}));
const bigPearl=new THREE.Mesh(new THREE.SphereGeometry(1.3,48,32),pearlM());bigPearl.position.set(0,1.3,0);bigPearl.castShadow=true;gP.add(bigPearl);const bpg=mkGlow(3.6);bpg.position.set(0,1.4,0);gP.add(bpg);
const bigBar=new THREE.Mesh(new THREE.SphereGeometry(.5,20,14),lam('#e8c040'));bigBar.scale.set(1,.6,1.8);bigBar.position.set(2.6,.3,0);bigBar.castShadow=true;gP.add(bigBar);
const RP=rng(3);for(let i=0;i<16;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.4+RP()*.4,1),lam('#6a4a2a',{flatShading:true}));const a=RP()*PI*2,r=2.2+RP()*2.5;s.position.set(Math.cos(a)*r,.1,Math.sin(a)*r);s.scale.y=.5;gP.add(s)}
gP.add(new THREE.HemisphereLight('#fff','#3a2a1a',3.0));sunRig(gP,[-5,14,6],[0,0,0],'#fff1d9',2.5,8);addSet('pearl',gP);
const pearlTop=(t,{bar=0}={})=>{gP.visible=true;scene.background=new THREE.Color('#3a2414');bigBar.visible=bar>0;bigBar.scale.set(Math.max(.001,bar),.6*Math.max(.001,bar),1.8*Math.max(.001,bar));bpg.material.opacity=.7+.3*Math.sin(t*4)};
// ---------- стол: чек и гарантийный талон (сверху)
const tW=K.makeTable('tW','ГАРАНТИЙНЫЙ ТАЛОН',[['СРОК: 12 МЕСЯЦЕВ','с даты покупки'],['РЕМОНТ БЕСПЛАТНО','при наличии чека']],'#8a9aa8');
const rc2=new THREE.Mesh(new THREE.PlaneGeometry(2.2,4.1),new THREE.MeshLambertMaterial({map:receiptTex}));rc2.rotation.x=-PI/2;rc2.rotation.z=.2;rc2.position.set(3.6,.05,.3);rc2.receiveShadow=true;tW.g.add(rc2);
const tp=new THREE.Mesh(new THREE.SphereGeometry(.5,32,24),pearlM());tp.position.set(-3.1,.5,-2.2);tp.castShadow=true;tW.g.add(tp);
const warranty=(t,hl=[0,0])=>{tW.g.visible=true;scene.background=new THREE.Color('#d8e8f0');tW.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dffd8')})};
// ---------- 12 месяцев гарантии: кубики-месяцы
const gM=new THREE.Group();gM.add(Object.assign(plane(200,200,lam('#24304a'),0,0,0,-PI/2),{receiveShadow:true}));
const MO=[];for(let i=0;i<12;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),[lam('#7dd8c8'),lam('#7dd8c8'),new THREE.MeshLambertMaterial({map:label(200,200,'#7dd8c8',[{t:String(i+1),s:120,y:.55,c:'#15131a'}],{border:INK,bw:10})}),lam('#7dd8c8'),new THREE.MeshLambertMaterial({map:label(200,200,'#7dd8c8',[{t:String(i+1),s:120,y:.55,c:'#15131a'}],{border:INK,bw:10})}),lam('#7dd8c8')]);b.castShadow=true;b.position.set(-2.5+(i%6)*1.0,.4,-1-Math.floor(i/6)*1.1);gM.add(b);MO.push(b)}
const mPhone=new THREE.Group();mPhone.add(box(.7,1.2,.1,'#15131a',0,.6,0));const mScr=plane(.6,1.05,new THREE.MeshBasicMaterial({color:'#5ab0ff'}),0,.62,.055);mPhone.add(mScr);gM.add(mPhone);
gM.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gM,[-6,18,8],[0,0,-1],'#fff1d9',2.4,12);addSet('months',gM);
const months=(t,{n=0,broke=0}={})=>{gM.visible=true;scene.background=new THREE.Color('#2a3a6a');MO.forEach((b,i)=>{const k=clamp(n*10-i);b.position.y=.4+(i<10?k*.25:0);b.material.forEach(m=>m.color&&m.color.set(i<10&&k>0?'#ffd8a0':'#ffffff'))});const i=Math.min(9,Math.floor(n*10));const b=MO[Math.max(0,i)];mPhone.position.set(b.position.x,b.position.y+.4,b.position.z);mScr.material.color.set(broke?'#15131a':'#5ab0ff')};
// ---------- мастерская: прилавок, телефон с трещиной, ценник
const rR=K.room('rR','#4aa89a');
const counter=box(4.0,1.05,.9,'#d8dde4',0,.52,-1.6);rR.g.add(counter);rR.g.add(box(4.1,.06,1.0,'#5a6a7a',0,1.07,-1.6));
const rPhone=new THREE.Group();rPhone.position.set(-.5,1.1,-1.6);rPhone.add(box(.9,1.6,.12,'#15131a',0,.8,0));const rScr=plane(.78,1.42,new THREE.MeshBasicMaterial({map:canvasTex(200,360,(c,w,h)=>{c.fillStyle='#2a2a3a';c.fillRect(0,0,w,h);c.strokeStyle='#ffffff';c.lineWidth=4;const R=rng(2);for(let i=0;i<9;i++){c.beginPath();c.moveTo(w*.6,h*.4);let x=w*.6,y=h*.4;for(let k=0;k<4;k++){x+=(R()-.5)*90;y+=(R()-.5)*140;c.lineTo(x,y)}c.stroke()}})}),0,.82,.065);rPhone.add(rScr);rR.g.add(rPhone);
const tagFree=K.stand(1.5,.8,'#7dff9a',[{t:'РЕМОНТ',s:56,y:.32,c:'#15131a'},{t:'0',s:90,y:.72,c:'#15131a'}],.85,1.55,-1.55);rR.g.add(tagFree);
const tagPay=K.stand(1.5,.8,'#ff5a3a',[{t:'РЕМОНТ',s:56,y:.32,c:'#ffffff'},{t:'150',s:90,y:.72,c:'#ffffff'}],.85,1.55,-1.55);rR.g.add(tagPay);
const repair=(t,{u=0,red=0}={})=>{resetRoom(rR);rR.col(u,'#c8302a');tagFree.visible=!red;tagPay.visible=!!red};
// ---------- правило
const tR=K.makeTable('tR','ПРАВИЛО',[['СФОТОГРАФИРУЙ','чек и гарантию в день покупки'],['ХРАНИ ВМЕСТЕ','в одной папке']],'#b58a5e');
const ph2=new THREE.Group();ph2.position.set(3.2,.06,-1.2);ph2.add(box(1.3,.1,2.4,'#15131a',0,0,0));const ph2s=plane(1.15,2.2,new THREE.MeshBasicMaterial({map:receiptTex}),0,.06,0,-PI/2);ph2.add(ph2s);tR.g.add(ph2);
const rule=(t,hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#9ae0d8');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dffd8')})};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- город: билборды
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРИВЫЧКА',0,9,-26,16,9,'#7dffd8');K.billboard(city.g,'ДАЛЬШЕ','СКУПОЙ РЫЦАРЬ',0,9,24,16,9,'#ffd23f');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const pe=T('Петух'),pn=T('Петух нашёл'),jz=T('жемчужное зерно:'),is=T('какая вещь'),kv=T('какая вещь'),lb=T('Лучше бы'),ya=T('ячменное.'),pm=T('мимо жемчуга.'),ch=T('Чек'),nj=T('наш жемчуг.'),pv=T('Пока всё работает,'),mu=T('мусором.'),ts=T('Телефон сломался'),m10=T('через 10 месяцев,'),gy=T('гарантия — год.'),sc=T('С чеком'),bc=T('без чека —'),n150=T('150.'),pr=T('Правило:'),sf=T('сфотографируйте'),ih=T('и храните'),nv=T('Не всё,'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:pe,out:'whipR',f(t,u){room(t,{toss:ss(.1,.75,u)});put('sly',-.5,-1.9,t);camPath(u,[-.4,1.1,3.2],[0,1.1,2.5],[.3,1.0,-2.0],[.4,1.0,-2.0],[62,58],.03);fx.draw=K.hook(['ВЫБРАСЫВАЕТЕ ЧЕК','СРАЗУ?'],-1,pe-.05)}},
{id:'name',t0:pe,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){yard(t);put('happy',-.6,-1.5,t,.6);const a=lerp(-.8,-.2,u);cam.position.set(Math.sin(a)*10,lerp(8,4,ease(u)),-1.5+Math.cos(a)*10);cam.lookAt(0,1.4,-1.5);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('ПЕТУХ ИЗ БАСНИ',pe+.05,S('s02')-.05,'#ffd23f',140,.13)}},
{id:'promise',t0:S('s02'),t1:pn,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'find',t0:pn,t1:jz,in:'zoom',out:'whipUp',f(t,u){yard(t);put('happy',-.5,-1.3,t,.55);camPath(u,[-1.6,.5,4.2],[-.6,.7,2.8],[-.2,1.0,-1.2],[0,.95,-1.2],[58,54],.02);fx.tags=[{txt:'НАВОЗ',t:pn+.3,xy:[.5,.14]}]}},
{id:'pearl',t0:jz,t1:is,in:'whipUp',out:'whipR',f(t,u){pearlTop(t);topv(u,-.6,.6,12,9.5,0,1.3,0,58);fx.draw=K.big('ЖЕМЧУГ',jz+.1,is-.05,'#ffffff',200,.13)}},
{id:'talk',t0:is,t1:lb,in:'whipR',out:'whipUp',f(t,u){yard(t,{glow:.5});put(t>kv-.1?'talk':'sly',-.5,-1.3,t,.55);camPath(u,[1.6,.7,2.6],[.8,.85,1.8],[-.4,1.4,-1.3],[-.45,1.45,-1.3],[56,52],-.03);fx.draw=K.big('ПУСТАЯ ВЕЩЬ!',kv,lb-.05,'#ffffff',150,.13)}},
{id:'barley',t0:lb,t1:S('s04'),in:'whipUp',out:'whipL',f(t,u){pearlTop(t,{bar:ss(lb,lb+.4,t)});topv(u,.4,-.3,11,10,1.3,.5,0,58);fx.draw=K.big('ЯЧМЕНЬ',ya,S('s04')-.05,'#ffd23f',190,.13)}},
{id:'away',t0:S('s04'),t1:ch,in:'whipL',out:'zoom',f(t,u){yard(t);put('happy',lerp(-.5,-3.8,ss(0,1,u)),lerp(-.8,1.2,u),t,0,3);linPath(u,[3.2,.5,3.4],[1.4,.6,3.6],[.5,.6,-.9],[-.4,.7,-.6],[54,50],.02);fx.tags=[{txt:'ЖЕМЧУГ ОСТАЛСЯ',t:pm,xy:[.5,.14]}]}},
{id:'card',t0:ch,t1:pv,in:'zoom',out:'whipR',f(t,u){warranty(t,[t>nj-.2,0]);topv(u,-.4,.3,11.5,9.8,.6,0,0,60);fx.draw=K.big('НАШ ЖЕМЧУГ',nj,pv-.05,'#ffffff',150,.13)}},
{id:'trash',t0:pv,t1:ts,in:'whipR',out:'whipUp',f(t,u){room(t,{u:.4,toss:ss(pv+.2,mu,t)});camPath(u,[2.6,1.8,1.2],[2.0,1.4,.4],[1.2,.8,-2.0],[1.2,.75,-2.0],[56,52],.03);fx.draw=K.big('МУСОР?',mu,ts-.05,'#ffffff',200,.13)}},
{id:'months',t0:ts,t1:sc,in:'whipUp',out:'whipL',f(t,u){months(t,{n:ss(ts+.2,m10+.6,t),broke:t>ts+.5});const a=lerp(-.5,.4,u);cam.position.set(Math.sin(a)*1.5,lerp(8.6,9.8,ease(u)),lerp(5.2,5.8,u));cam.lookAt(0,0,-1.6);cam.fov=56;cam.updateProjectionMatrix();
 fx.draw=K.big(t<gy?'10 МЕСЯЦЕВ':'ГАРАНТИЯ 12',ts+.1,sc-.05,t<gy?'#ffd8a0':'#7dffd8',150,.13)}},
{id:'free',t0:sc,t1:bc,in:'whipL',out:'whipR',f(t,u){repair(t);camPath(u,[-1.8,1.5,3.2],[-.6,1.6,2.6],[.2,1.7,-1.6],[.2,1.7,-1.6],[58,56],.02);fx.draw=K.big('С ЧЕКОМ — 0',sc+.1,bc-.05,'#7dff9a',150,.13)}},
{id:'boom',t0:bc,t1:pr,in:'whipR',out:'whipUp',f(t,u){const h=t-n150;repair(t,{u:ss(bc,n150,t),red:t>n150-.05});camPath(u,[1.2,1.5,3.4],[.4,1.6,2.6],[.2,1.7,-1.6],[.2,1.7,-1.6],[60,56],-.02);shake(t,n150,.35,.8);if(h>0){fx.flash=Math.max(0,1-h/.25);fx.crack={p:[.3,2.2,-1.5],a:clamp(h*3),seed:69}}fx.draw=K.big(t<n150?'БЕЗ ЧЕКА':'−150',bc+.05,pr-.05,t<n150?'#ffffff':'#ff5a3a',t<n150?160:240,.13)}},
{id:'rule',t0:pr,t1:nv,in:'whipUp',out:'zoom',f(t,u){rule(t,[t>sf-.1,t>ih-.1]);topv(u,-.4,.25,10.6,9.0,.6,0,0,60);fx.draw=K.big(t<ih?'ФОТО ЧЕКА':'ОДНА ПАПКА',pr+.1,nv-.05,'#ffffff',150,.13)}},
{id:'final',t0:nv,t1:S('s09'),in:'zoom',out:'whipUp',f(t,u){yard(t);put('happy',-1.0,-.6,t);camPath(u,[-2.2,.4,5.0],[-1.0,.55,3.6],[-.2,.9,-1.2],[-.2,1.0,-1.2],[58,52],-.02);fx.draw=K.hook(['НЕ ВСЁ ПОХОЖЕЕ','НА МУСОР — МУСОР'],nv+.05,S('s09')-.05)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){yard(t);put('happy',-1.0,.6,t,0,2);camPath(u,[1.4,.8,5.6],[.4,1.0,4.4],[-.6,1.1,.6],[-.6,1.15,.6],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
