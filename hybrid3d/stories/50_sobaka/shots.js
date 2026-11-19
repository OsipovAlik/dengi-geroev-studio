import {kit} from '/lib_ru.js';
// 50 Собака и её тень: «удвоим за месяц» — отражение в воде; отдал 100 — остался 0; рискуй максимум 10 из 100
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- собака (своя рисовка): большая голова, висячие уши, кусок мяса в зубах
const meat=(c,w,h,x,y,s)=>{c.fillStyle='#d8505a';c.beginPath();c.ellipse(x,y,w*.16*s,h*.07*s,-.15,0,7);c.fill();c.stroke();c.fillStyle='#f6d6c8';c.beginPath();c.ellipse(x-w*.05*s,y-h*.012*s,w*.06*s,h*.025*s,-.15,0,7);c.fill();c.stroke();
 c.fillStyle='#fff6ea';c.beginPath();c.roundRect(x+w*.1*s,y-h*.012*s,w*.14*s,h*.024*s,6);c.fill();c.stroke();for(const d of[-1,1]){c.beginPath();c.arc(x+w*.25*s,y+d*h*.016*s,w*.022*s,0,7);c.fill();c.stroke()}};
const dog=(mood,piece=1,col='#c8843a')=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle=col;c.beginPath();c.roundRect(w*.26,h*.55,w*.48,h*.36,w*.16);c.fill();c.stroke();for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.14)-w*.05,h*.82,w*.1,h*.15,12);c.fill();c.stroke()}
 c.fillStyle='#f3dcb4';c.beginPath();c.ellipse(w*.5,h*.72,w*.11,h*.1,0,0,7);c.fill();c.stroke();
 const hy=.33,hr=.27;c.fillStyle='#7a4a22';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*hr*.95),h*(hy+.02),w*.08,h*.13,s*.35,0,7);c.fill();c.stroke()}
 c.fillStyle=col;c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();c.fillStyle='#7a4a22';c.beginPath();c.ellipse(w*.4,h*(hy-.06),w*.07,h*.05,.4,0,7);c.fill();
 c.fillStyle='#f3dcb4';c.beginPath();c.ellipse(w*.5,h*(hy+.08),w*.15,h*.075,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.045),w*.05,h*.028,0,0,7);c.fill();
 const ey=hy-.06,dx=.1,big=mood==='greedy'||mood==='shock';c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*ey,w*(big?.065:.05),0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*(ey+(mood==='greedy'?.02:.005)),w*(big?.022:.025),0,7);c.fill()}
 if(mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.06)),h*(ey-.03));c.lineTo(w*(.5+s*(dx-.05)),h*(ey-.06));c.stroke()}}
 c.lineWidth=10;const my=hy+.14;
 if(mood==='shock'||mood==='greedy'){c.fillStyle='#7a1a1a';c.beginPath();c.ellipse(w*.5,h*my,w*.08,h*.05,0,0,7);c.fill();c.stroke();c.fillStyle='#e86a7a';c.beginPath();c.ellipse(w*.5,h*(my+.025),w*.045,h*.02,0,0,7);c.fill()}
 else if(mood==='sad'){c.beginPath();c.arc(w*.5,h*(my+.04),w*.07,PI*1.15,PI*1.85);c.stroke()}
 else{c.beginPath();c.arc(w*.5,h*(my-.03),w*.07,PI*.15,PI*.85);c.stroke()}
 if(piece>0)meat(c,w,h,w*.5,h*(my+.01),piece)};
const MOODS=['happy','greedy','shock','sad'];
const mkDog=(g,sz=1)=>{const o={};MOODS.forEach(md=>{o[md]=drawn(1.4*sz,1.75*sz,dog(md,md==='greedy'||md==='shock'?0:(md==='sad'?0:1)),0,0,0);g.add(o[md])});o.happy2=drawn(1.4*sz,1.75*sz,dog('happy',1),0,0,0);g.add(o.happy2);return o};
const putD=(o,mood,x,y,z,t,walk=0)=>{Object.entries(o).forEach(([k,m])=>{m.visible=k===mood;if(k===mood){m.position.set(x,y+.88+Math.abs(Math.sin(t*(walk?9:4)))*(walk?.06:.02),z);face(m)}})};
const hideD=(o)=>Object.values(o).forEach(m=>m.visible=false);
// ---------- речка и мост
const gR=new THREE.Group();
gR.add(Object.assign(plane(200,200,lam('#8ccc5a'),0,.02,0,-PI/2),{receiveShadow:true}));
const wTex=canvasTex(1024,1024,(c,w,h)=>{c.fillStyle='#3d8fd6';c.fillRect(0,0,w,h);c.strokeStyle='rgba(20,40,90,.55)';c.lineWidth=5;const R=rng(3);for(let i=0;i<60;i++){const x=R()*w,y=R()*h,l=30+R()*70;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-10,x+l,y);c.stroke()}},{wrap:true});wTex.repeat.set(3,3);
const water=plane(120,9,lam('#fff',{map:wTex}),0,.05,0,-PI/2);water.receiveShadow=true;gR.add(water);
for(const s of[-1,1])gR.add(box(120,.5,.3,'#6a8a3a',0,.08,s*4.6));
const bridge=new THREE.Group();gR.add(bridge);for(let i=0;i<14;i++){const b=box(1.6,.12,.7,i%2?'#b8783f':'#a8693a',0,.95,-4.9+i*.75);b.castShadow=b.receiveShadow=true;bridge.add(b)}
for(const x of[-.85,.85])for(let i=0;i<4;i++){bridge.add(cyl(.09,1.0,'#6a4428',x,.5,-4.5+i*3))}
for(let i=0;i<22;i++){const R=rng(700+i);const a=i/22*PI*2,r=12+R()*8;const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0));const cr=new THREE.Mesh(new THREE.ConeGeometry(1.5+R(),4.2,7),lam(i%3?'#2f8a4a':'#47a84a'));cr.position.y=3.6;cr.castShadow=true;tr.add(cr);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(z)<6)continue;tr.position.set(x,0,z);gR.add(tr)}
const D1=mkDog(gR,1);
// отражение: лежит на воде, вдвое больший кусок, синеватое
const refl=drawn(1.6,2.0,(c,w,h)=>{c.save();c.translate(0,h);c.scale(1,-1);dog('happy',0,'#a8b8d8')(c,w,h);c.restore();meat(c,w,h,w*.5,h*(1-.48),2.0)},0,0,0);refl.material.opacity=.85;refl.material.transparent=true;refl.castShadow=false;refl.rotation.set(-PI/2,0,0);gR.add(refl);
const ownMeat=drawn(.7,.35,(c,w,h)=>{c.strokeStyle=INK;c.lineWidth=8;c.lineJoin='round';meat(c,w,h,w*.3,h*.5,1.8)},0,0,0);ownMeat.castShadow=true;gR.add(ownMeat);
const ringM=new THREE.MeshBasicMaterial({color:'#e8f6ff',transparent:true,opacity:.8,side:THREE.DoubleSide});const rings=[0,1,2].map(i=>{const m=new THREE.Mesh(new THREE.RingGeometry(.4,.5,40),ringM.clone());m.rotation.x=-PI/2;gR.add(m);return m});
const NS=26;const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.07,8,6),lam('#dff2ff'),NS);drops.frustumCulled=false;gR.add(drops);
gR.add(new THREE.HemisphereLight('#ffffff','#7a8a6a',3.1));sunRig(gR,[-8,20,10],[0,0,0],'#fff1d9',2.6,12);addSet('river',gR);
const dm=new THREE.Matrix4();
const river=(t,{splash=-1,grey=0}={})=>{gR.visible=true;scene.background=new THREE.Color(SKY).lerp(new THREE.Color('#8a96a6'),grey);hideD(D1);wTex.offset.x=t*.04;refl.visible=false;ownMeat.visible=false;rings.forEach(r=>r.visible=false);drops.visible=false;
 if(splash>=0){const k=splash;ownMeat.visible=k<.45;ownMeat.position.set(lerp(.5,1.5,ss(0,.45,k)),lerp(1.9,.1,ss(0,.45,k)),1.0);ownMeat.rotation.set(0,0,k*6);
  rings.forEach((r,i)=>{const q=clamp((k-.4-i*.12)/.6);r.visible=q>0&&q<1;r.position.set(1.5,.07,.9);r.scale.setScalar(.3+q*4);r.material.opacity=.8*(1-q)});
  const q=clamp((k-.4)/.5);drops.visible=q>0&&q<1;if(q>0){const R=rng(31);for(let i=0;i<NS;i++){const a=R()*6.28,sp=.6+R()*1.4;dm.identity();dm.setPosition(1.5+Math.cos(a)*sp*q,.1+(2.2+R())*q*(1-q)*2,.9+Math.sin(a)*sp*q);drops.setMatrixAt(i,dm)}drops.instanceMatrix.needsUpdate=true}}};
const showRefl=(op,sc=1,wob=0,t=0)=>{refl.visible=true;refl.position.set(1.8+Math.sin(t*3)*wob,.08,1.3);refl.scale.set(sc*(1+Math.sin(t*7)*wob),sc,1);refl.material.opacity=op};
// ---------- комната «Удвоим за месяц»
const rM=K.room('rM','#2a3a5a');
const sign=K.stand(3.4,.9,'#ffd23f',[{t:'УДВОИМ ЗА МЕСЯЦ!',s:120,y:.55,c:'#15131a'}],0,3.25,-3.9);rM.g.add(sign);
const desk=new THREE.Group();desk.add(box(3.2,.12,1.4,'#7a4a2a',0,1.0,0));for(const x of[-1.4,1.4])for(const z of[-.55,.55])desk.add(box(.12,1.0,.12,'#5a3418',x,.5,z));desk.position.set(0,0,-1.6);rM.g.add(desk);
const coinPile=(n,lab)=>{const g=new THREE.Group();for(let j=0;j<n;j++)g.add(cyl(.32,.12,'#ffc93a',0,.07+j*.13,0));if(lab){const l=K.stand(.9,.5,'#fff',[{t:lab,s:110,y:.55,c:'#15131a'}],0,n*.13+.45,0);g.add(l);g.userData.l=l}return g};
const pile100=coinPile(8,'100');rM.g.add(pile100);
const paper200=K.stand(1.3,.9,'#fff6d0',[{t:'ОБЕЩАНИЕ',s:44,y:.3,c:'#15131a'},{t:'200',s:120,y:.68,c:'#2a8a3a'}],0,0,0);rM.g.add(paper200);
const zero=K.stand(1.2,1.0,'#fff',[{t:'0',s:220,y:.55,c:'#d02a1a'}],0,0,0);rM.g.add(zero);
const slick=new Puppet('man',2.2);scene.add(slick.m);
const NB=30;const bits=new THREE.InstancedMesh(new THREE.BoxGeometry(.22,.02,.16),lam('#fff6d0'),NB);bits.frustumCulled=false;bits.castShadow=true;rM.g.add(bits);
const office=(t,{give=0,paper=0,burn=-1,col='#2a3a5a',u=0}={})=>{resetRoom(rM);rM.col(u,col);slick.hide();bits.visible=false;
 slick.pose(.4,-2.6,{expr:burn>=0?'sly':'smile',look:.6,aL:[.5+.3*Math.sin(t*3),.6],aR:[paper>0&&burn<0?1.2:.3,.8],talk:talk(t,burn<0?1:0),blink:blink(t),col:'#3a3a8a',tie:'#ffd23f'},0);
 pile100.visible=give<1;pile100.position.set(lerp(-1.2,.4,ease(give)),1.06,lerp(-1.2,-1.9,ease(give)));pile100.scale.setScalar(1-ss(.85,1,give)*.9);
 paper200.visible=paper>0&&burn<.35;paper200.position.set(lerp(.6,-.6,ease(paper)),lerp(1.3,1.7,ease(paper)),-1.3);paper200.rotation.y=Math.sin(t*2)*.1;paper200.scale.setScalar(paper>0?(.6+.4*ease(paper))*(burn>0?1+burn*.6:1):1);
 zero.visible=burn>=.3;zero.position.set(-.6,1.75,-1.3);zero.scale.setScalar(.6+.4*ss(.3,.5,burn));
 if(burn>.3){bits.visible=true;const R=rng(55);const q=clamp((burn-.3)/.7);for(let i=0;i<NB;i++){const a=R()*6.28,sp=1+R()*2.5;dm.makeRotationFromEuler(new THREE.Euler(q*R()*9,q*R()*9,q*R()*9));dm.setPosition(-.6+Math.cos(a)*sp*q,Math.max(.03,1.7+(R()*2)*q-3.2*q*q),-1.3+Math.sin(a)*sp*q);bits.setMatrixAt(i,dm)}bits.instanceMatrix.needsUpdate=true}};
// ---------- комната риска: 10 стопок по 10
const rK=K.room('rK','#2a5a4a');
const piles=[];for(let i=0;i<10;i++){const g=coinPile(5,'10');g.position.set(-2.0+(i%5)*1.0,0,-2.4+Math.floor(i/5)*1.3);rK.g.add(g);piles.push(g)}
const riskTag=K.stand(1.4,.6,'#ff8a5a',[{t:'РИСК',s:110,y:.55,c:'#15131a'}],0,0,0);rK.g.add(riskTag);
const riskRoom=(t,{out=0,lose=0,col='#2a5a4a',u=0}={})=>{resetRoom(rK);rK.col(u,col);piles.forEach((g,i)=>{g.visible=true;g.scale.setScalar(1);g.position.set(-2.0+(i%5)*1.0,0,-2.4+Math.floor(i/5)*1.3);g.userData.l.visible=true});
 const g=piles[9];g.position.set(lerp(2.0,2.2,out),Math.sin(out*PI)*.6,lerp(-1.1,.2,ease(out)));g.scale.setScalar(1-ss(0,1,lose)*.98);g.visible=lose<.98;riskTag.visible=out>.5&&lose<.5;riskTag.position.set(2.2,1.6,.6)};
// ---------- стол сверху: правило
const tA=K.makeTable('tA','ПРАВИЛО',[['НАСТОЯЩЕЕ','не меняй на обещанное'],['РИСК','максимум 10 из 100'],['ХУДШИЙ СЛУЧАЙ','останется 90']]);
const coinsT=new THREE.Group();coinsT.position.set(-3.4,0,-1.4);for(let i=0;i<9;i++){const g=new THREE.Group();g.position.set((i%3)*.8,0,Math.floor(i/3)*.8);for(let j=0;j<3;j++)g.add(cyl(.32,.12,'#ffc93a',0,.07+j*.13,0));coinsT.add(g)}tA.g.add(coinsT);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- город
K.billboard(city.g,'ПРАВИЛО,','КОТОРОЕ СПАСЁТ СБЕРЕЖЕНИЯ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','БРАТЕЦ ИВАНУШКА',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const nsp=T('Не разжимайте'),vvode=T('В воде'),snap=T('Разинула пасть —'),drown=T('и свой кусок'),otr=T('Там было'),give=T('Отдаёте'),poluch=T('получаете'),z0=T('у вас 0.'),risk=T('Рискуешь —'),worst=T('В худшем случае'),o90=T('останется 90.');
const BB=[...Object.values(D1)];
const HOOK=['УДВОИМ ВАШИ ДЕНЬГИ','ЗА МЕСЯЦ?'];
const shots=[
{id:'hook',t0:0,t1:nsp,out:'whipR',f(t,u){river(t);putD(D1,'happy',0,.97,.9,t);camPath(u,[-3.6,1.5,5.2],[-2.4,1.8,3.8],[0,2.0,.9],[0,2.1,.9],[60,54],.03);fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'teeth',t0:nsp,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){river(t);putD(D1,'happy',0,.97,.9,t);const a=lerp(.6,.2,u);cam.position.set(Math.sin(a)*3,lerp(2.0,2.2,u),.9+Math.cos(a)*3);cam.lookAt(0,2.1,.9);cam.fov=48;cam.updateProjectionMatrix();fx.draw=K.hook(HOOK,0,S('s02')-.05);fx.tags=[{txt:'ДЕРЖИ КРЕПЧЕ',t:nsp+.1,xy:[.5,.42]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'walk',t0:S('s03'),t1:vvode,in:'whipL',out:'whipR',f(t,u){river(t);const z=lerp(-3.8,.9,ease(clamp((t-S('s03'))/(vvode-S('s03')))));putD(D1,'happy',0,.97,z,t,1);linPath(u,[7.5,2.6,-4],[6.5,2.2,2.2],[0,1.8,z-1],[0,1.8,z],[52,50],0);fx.tags=[{txt:'БАСНЯ ЭЗОПА',t:S('s03')+.05,xy:[.5,.15]}]}},
{id:'look',t0:vvode,t1:T('вдвое больше.'),in:'whipR',out:'whipUp',f(t,u){river(t);putD(D1,'greedy',.5,.97,.9,t);showRefl(ss(vvode,vvode+.4,t)*.85,1,0,t);camPath(u,[2.8,2.4,4.8],[2.0,3.0,4.6],[1.0,1.5,1.1],[1.3,1.1,1.2],[62,60],.03)}},
{id:'top',t0:T('вдвое больше.'),t1:snap,in:'whipUp',out:'whipL',f(t,u){river(t);putD(D1,'greedy',.5,.97,.9,t);showRefl(.85,1.05,.01,t);top(u,-.5,.3,6.0,4.6,1.4,1.2,56);fx.draw=K.big('×2',T('вдвое больше.')+.1,snap-.05,'#7dff9a',220,.16)}},
{id:'snap',t0:snap,t1:otr,in:'whipL',out:'zoom',f(t,u){const k=ss(drown,drown+1.4,t);river(t,{splash:k});putD(D1,t<drown?'greedy':'shock',.5,.97,.9,t);showRefl(.85*(1-ss(drown+.2,drown+.9,t)),1.05,.06*k,t);
 const a=lerp(.9,.5,u);cam.position.set(Math.sin(a)*4.4,lerp(1.0,1.4,u),.9+Math.cos(a)*4.4);cam.lookAt(1.0,.9,.9);cam.fov=56;cam.updateProjectionMatrix();const h=t-drown-.55,sk=h>0?Math.max(0,1-h/.5):0;cam.position.x+=Math.sin(t*51)*.08*sk;
 if(h>0)fx.flash=Math.max(0,.4-h/.3);fx.tags=t>drown+.4?[{txt:'БУЛЬК!',t:drown+.4,xy:[.5,.15]}]:[]}},
{id:'refl',t0:otr,t1:S('s05'),in:'zoom',out:'whipR',f(t,u){river(t,{grey:.4});putD(D1,'sad',.5,.97,.9,t);camPath(u,[3.8,.6,4.0],[2.8,1.0,3.2],[1.6,.3,1.2],[.8,1.6,.9],[58,54],-.03);fx.draw=K.big('ТОЛЬКО ОТРАЖЕНИЕ',T('лишь отражение.'),S('s05')-.05,'#9ad0ff',120,.15)}},
{id:'office',t0:S('s05'),t1:give,in:'whipR',out:'whipL',f(t,u){office(t);camPath(u,[-2.0,1.2,3.2],[-.4,1.7,2.4],[0,2.6,-3.6],[0,2.3,-2.6],[70,66],.04);fx.tags=[{txt:'ТО ЖЕ ОТРАЖЕНИЕ',t:T('то же отражение.'),xy:[.5,.12]}]}},
{id:'give',t0:give,t1:poluch,in:'whipL',out:'whipUp',f(t,u){office(t,{give:ss(give+.3,poluch,t)});camPath(u,[-2.2,2.0,1.6],[-1.6,2.3,.8],[-1.0,1.2,-1.4],[-.2,1.3,-1.8],[60,56],.02);fx.draw=K.big('100 НАСТОЯЩИХ',T('100 настоящих,'),poluch-.05,'#ffd23f',140,.13)}},
{id:'paper',t0:poluch,t1:z0-.15,in:'whipUp',out:'whipR',f(t,u){office(t,{give:1,paper:ss(poluch,poluch+.6,t),col:'#3a5a3a',u:ss(0,1,u)*.6});camPath(u,[1.4,1.7,1.6],[.8,1.8,.6],[-.4,1.6,-1.3],[-.6,1.7,-1.3],[62,54],-.03);fx.draw=K.big('ОБЕЩАНИЕ 200',T('обещание 200.'),z0-.2,'#7dff9a',140,.13)}},
{id:'zero',t0:z0-.15,t1:S('s07'),in:'whipR',out:'whipUp',f(t,u){const h=t-z0;office(t,{give:1,paper:1,burn:clamp(h/1.2+.3),col:'#8a2a2a',u:ss(0,.25,h)});
 camPath(u,[0,1.9,2.4],[.2,1.8,1.6],[-.5,1.7,-1.3],[-.6,1.75,-1.3],[60,52],.02);const k=h>0?Math.max(0,1-h/.55):0;cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>0){fx.crack={p:[-.6,1.7,-1.25],a:clamp(h*3),seed:5};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('У ВАС 0',z0+.05,S('s07')-.05,'#ff5a5a',200,.13)}},
{id:'rule',t0:S('s07'),t1:risk,in:'whipUp',out:'whipR',f(t,u){table([t>T('настоящее'),0,0],'#7dff9a');top(u,-.5,.2,10.5,8.0,0,0,58);fx.draw=K.big('ПРАВИЛО',S('s07'),T('настоящее')+.3,'#ffffff',170,.13)}},
{id:'risk',t0:risk,t1:worst,in:'whipR',out:'whipL',f(t,u){riskRoom(t,{out:ss(T('максимум 10 из 100.'),T('максимум 10 из 100.')+.8,t)});camPath(u,[-1.8,2.4,3.4],[-.4,3.0,2.6],[0,.4,-1.4],[.6,.5,-.8],[66,62],.03);fx.draw=K.big('10 ИЗ 100',T('максимум 10 из 100.')+.1,worst-.05,'#ff8a5a',190,.13)}},
{id:'worst',t0:worst,t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){riskRoom(t,{out:1,lose:ss(worst+.3,worst+1.0,t)});const a=lerp(PI/2+.3,PI/2-.3,u);cam.position.set(Math.sin(a)*.3,lerp(4.0,3.7,ease(u)),-1.2+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(0,0,-1.2);cam.up.set(0,1,0);cam.fov=80;cam.updateProjectionMatrix();
 fx.draw=K.big('ОСТАЛОСЬ 90',o90,S('s08')-.05,'#7dff9a',170,.13)}},
{id:'sum',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){river(t);putD(D1,'happy2',-1.2,.12,5.6,t);const a=lerp(-.6,.2,u);cam.position.set(-1.2+Math.sin(a)*4.6,lerp(1.1,2.6,ease(u)),5.6+Math.cos(a)*4.6);cam.lookAt(-1.2,1.3,5.6);cam.fov=56;cam.updateProjectionMatrix();
 fx.draw=K.big('ДЕРЖИ СВОЁ',T('держи свой кусок.'),S('s09')-.05,'#ffd23f',170,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){slick.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
