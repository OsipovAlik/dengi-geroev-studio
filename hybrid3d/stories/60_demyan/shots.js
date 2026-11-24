import {kit} from '/lib_ru.js';
// 60 Демьян («Демьянова уха»): навязанные допродажи — «ещё тарелочку»: телефон 100 + чехол 10 + страховка 15 + доставка 5 + подписка 10 = 140 (+40%); правило: до оплаты спросить итоговую сумму, лишнее — вежливое «нет, спасибо»
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
// ---------- люди
const dem=new Puppet('big',1.95);const DEM={col:'#c0302a',hair:'#8a5a2a'};
const fok=new Puppet('man',1.85);const FOK={col:'#3a6ab8',hair:'#2a1a1a'};
const sel=new Puppet('woman',1.8);const SEL={col:'#ff7aa8',hair:'#f0c040'};
const buy=new Puppet('man',1.85);const BUY={col:'#2d8a4f',hair:'#3a2a1a'};
scene.add(dem.m,fok.m,sel.m,buy.m);const P=[dem,fok,sel,buy];
// ---------- изба Демьяна
const rI=K.room('rI','#c8843a');
rI.g.add(box(3.2,.12,1.4,'#7a4a24',0,.95,-1.6));for(const x of[-1.4,1.4])for(const z of[-2.1,-1.1])rI.g.add(box(.12,.95,.12,'#5a3a1a',x,.47,z));
const bowl=new THREE.Group();bowl.position.set(-.5,1.01,-1.4);rI.g.add(bowl);bowl.add(cyl(.42,.2,'#ffffff',0,.1,0));const soup=cyl(.36,.02,'#f0a23a',0,.2,0);bowl.add(soup);
for(let i=0;i<5;i++){const R=rng(10+i);bowl.add(cyl(.05,.022,'#ffd23f',-.2+R()*.4,.215,-.2+R()*.4))}
const plates=[];for(let i=0;i<9;i++){const p=cyl(.34,.06,i%2?'#f6f2e6':'#e0d8c8',.8,1.04+i*.07,-1.6);rI.g.add(p);plates.push(p)}
const pot=cyl(.4,.6,'#3a3550',1.0,1.31,-1.9);rI.g.add(pot);
const izba=(t,{col='#c8843a',u=0,np=0}={})=>{resetRoom(rI);rI.col(u,col);plates.forEach((p,i)=>p.visible=i<np)};
const plN=(t)=>Math.round(clamp((t-seg('s03').t)/2.2)*6);
// ---------- магазин
const rS=K.room('rS','#5a7ab8');
rS.g.add(box(4.2,1.0,.8,'#e6e6ee',0,.5,-1.6));rS.g.add(box(4.3,.06,.9,'#15131a',0,1.03,-1.6));
const phone=new THREE.Group();phone.position.set(-1.2,1.06,-1.6);rS.g.add(phone);phone.add(box(.46,.82,.08,'#15131a',0,.45,0));phone.add(box(.38,.68,.02,'#3ac0ff',0,.46,.05));
const phTag=K.stand(1.3,.45,'#ffffff',[{t:'ТЕЛЕФОН 100',s:62,y:.56,c:'#15131a'}],0,1.15,.1);phone.add(phTag);
const ADD=[['ЧЕХОЛ +10','#ffd23f'],['СТРАХОВКА +15','#ff9a3a'],['ДОСТАВКА +5','#7dff9a'],['ПОДПИСКА +10','#ff7aa8']];
const adds=ADD.map(([txt,c],i)=>{const g=new THREE.Group();g.add(box(1.5,.38,.6,c,0,.19,0));const s=K.stand(1.46,.32,'#ffffff',[{t:txt,s:60,y:.56,c:'#15131a'}],0,.19,.31);g.add(s);g.position.set(.9,1.06+i*.4,-1.6);rS.g.add(g);return g});
const totalTag=K.stand(1.6,.6,'#e8322a',[{t:'ИТОГО 140',s:76,y:.56,c:'#fff'}],.9,2.95,-1.6);rS.g.add(totalTag);
const AT=['чехол — 10,','страховка — 15,','доставка — 5,','подписка — 10.'];
const shop=(t,{col='#5a7ab8',u=0,n=4,fly=0,tot=0}={})=>{resetRoom(rS);rS.col(u,col);adds.forEach((g,i)=>{const on=i<n;g.visible=on;const k=on?ss(cap(AT[i]).t-.12,cap(AT[i]).t+.18,t):0;const drop=(1-k)*1.2;g.position.set(.9+fly*(i%2?2.5:-2.5)*(1+i*.3),1.06+i*.4+drop+fly*(3+i),-1.6);g.scale.setScalar(Math.max(.01,k))});totalTag.visible=tot>0};
const seller=(t,e='smile',push=1)=>sel.pose(.2,-2.6,{...SEL,expr:e,look:-.4,aR:push?[1.6+.3*Math.sin(t*5),.7]:[.3,.2],aL:[.3,.2],talk:push?talk(t):0,blink:blink(t,.4)});
// ---------- чек и правило (вид сверху)
const tC=K.makeTable('tC','ЧЕК',[['ТЕЛЕФОН — 100','то, за чем пришли'],['ЧЕХОЛ 10 + СТРАХОВКА 15','«ещё тарелочку»'],['ДОСТАВКА 5 + ПОДПИСКА 10','итого 140 вместо 100']]);
const tP=K.makeTable('tP','ПРАВИЛО',[['ИТОГО — ДО ОПЛАТЫ','спросите сумму целиком'],['ЛИШНЕЕ — «НЕТ, СПАСИБО»','вежливо и твёрдо'],['ПЛАТИТЕ 100, А НЕ 140','за то, за чем пришли']],'#9ac58e');
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(T_,hl,bg,hc)=>{T_.g.visible=true;scene.background=new THREE.Color(bg);T_.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(hc)})};
// ---------- монеты: 100 золотом + 40 красным
const gK=new THREE.Group();
gK.add(Object.assign(plane(200,200,lam('#3a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const ST=[];for(let i=0;i<14;i++){const g=new THREE.Group();const mat=lam('#ffd23f');for(let k=0;k<10;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;c.receiveShadow=true;g.add(c)}gK.add(g);ST.push({g,mat})}
const t100=K.stand(2.6,.6,'#ffffff',[{t:'ТЕЛЕФОН 100',s:66,y:.56,c:'#15131a'}],-1.1,1.5,-4.6);gK.add(t100);
const t40=K.stand(2.2,.7,'#e8322a',[{t:'+40%',s:110,y:.56,c:'#fff'}],1.5,1.5,-4.6);gK.add(t40);
gK.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('coins',gK);
const coins=(t,red)=>{gK.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#5a1a2a'),ss(0,1,red));
 ST.forEach((s,i)=>{if(i<10){s.g.visible=true;s.g.position.set(-2.2+(i%5)*1.1,0,-1.2-Math.floor(i/5)*1.2);s.mat.color.set('#ffd23f');s.g.children.forEach(c=>c.visible=true)}else{const k=clamp(red*4-(i-10));s.g.visible=k>0;s.g.position.set(-1.65+(i-10)*1.1,0,-3.6);s.mat.color.set('#e8322a');s.g.children.forEach((c,j)=>c.visible=j<Math.round(k*10))}});t40.visible=red>.95};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','КАК СКАЗАТЬ «НЕТ»',0,9,-26,16,9,'#ff9a3a');K.billboard(city.g,'ДАЛЬШЕ','ГОРШОЧЕК КАШИ',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const title=T('Это Демьянова уха.'),syt=T('Тот давно сыт,'),tel=T('Телефон за 100.'),esh=T('И «ещё тарелочку»:'),dost=T('доставка — 5,'),vm=T('вместо 100.'),p40=T('Плюс 40%.'),lish=T('Всё лишнее —'),sub=T('Подпишись,');
const HOOK=['ПРИШЛИ ЗА ОДНИМ,','А ЧЕК +40%?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const demP=(t,e='smile',push=1)=>dem.pose(.55,-.75,{...DEM,expr:e,look:-.6,aR:push?[1.7+.25*Math.sin(t*6),.8]:[.3,.2],aL:[.3,.2],propR:push?'cup':undefined,talk:push?talk(t):0,blink:blink(t)});
const fokP=(t,e='neutral',o={})=>fok.pose(-.85,-.5,{...FOK,expr:e,look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t,.3),...o});
const shots=[
{id:'hook',t0:0,t1:title,out:'whipR',f(t,u){izba(t,{np:6});demP(t);fokP(t,t>T('на 40%?')?'shock':'neutral');camPath(u,[-.5,.7,3.6],[.1,.9,2.9],[0,1.4,-1.2],[-.2,1.5,-1.3],[64,56],.03);fx.draw=K.hook(HOOK,0,title-.05)}},
{id:'title',t0:title,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){izba(t,{np:6});demP(t,'smile');fokP(t,'shock');const a=lerp(.5,-.1,u);cam.position.set(Math.sin(a)*3.8,lerp(1.0,1.4,u),-.9+Math.cos(a)*3.8);cam.lookAt(-.2,1.4,-1.0);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('ДЕМЬЯНОВА УХА',title+.05,S('s02')-.05,'#ffd23f',150,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'potch',t0:S('s03'),t1:syt,in:'whipL',out:'whipUp',f(t,u){izba(t,{np:plN(t)});demP(t);fokP(t,'smile');camPath(u,[2.4,.8,3.4],[1.2,1.1,2.6],[.2,1.4,-1.0],[0,1.4,-1.2],[60,56],-.03);fx.draw=K.big('«ЕЩЁ ТАРЕЛОЧКУ!»',T('«Ещё тарелочку!»'),syt-.05,'#ffd23f',130,.16)}},
{id:'top',t0:syt,t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){izba(t,{np:plN(t),col:'#e8322a',u:ss(syt,S('s04'),t)});topv(u,-.8,.6,2.9,2.3,.15,1.0,-1.5,64);fx.draw=K.big('СЫТ, НО ЕСТ',syt+.05,S('s04')-.05,'#ffffff',150,.14)}},
{id:'shop',t0:S('s04'),t1:esh,in:'zoom',out:'whipR',f(t,u){shop(t,{n:0});seller(t,'smile',0);buy.pose(-2.0,-.2,{...BUY,expr:'smile',look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t)});linPath(u,[-3.2,1.0,3.6],[-1.6,1.1,3.2],[-1.2,1.5,-1.6],[-.9,1.6,-1.6],[58,54],.02);fx.draw=K.big('ТЕЛЕФОН 100',tel,esh-.05,'#ffffff',160,.14)}},
{id:'add1',t0:esh,t1:dost,in:'whipR',out:'whipUp',f(t,u){shop(t,{n:2,col:'#c8843a',u:ss(esh,dost,t)*.5});seller(t);buy.pose(-2.0,-.2,{...BUY,expr:'neutral',look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t)});const a=lerp(-.5,.3,u);cam.position.set(.6+Math.sin(a)*4.2,lerp(1.2,1.9,u),-1.4+Math.cos(a)*4.2);cam.lookAt(.5,1.6,-1.6);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('«ЕЩЁ ТАРЕЛОЧКУ»',esh,T('чехол — 10,')+.2,'#ffd23f',120,.14)}},
{id:'add2',t0:dost,t1:S('s05'),in:'whipUp',out:'whipL',f(t,u){shop(t,{n:4,col:'#e8322a',u:.5+.5*ss(dost,S('s05'),t)});seller(t);buy.pose(-2.0,-.2,{...BUY,expr:'shock',look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t)});camPath(u,[1.8,1.2,3.4],[.9,3.0,3.4],[.8,1.6,-1.6],[.8,2.3,-1.6],[56,60],.02)}},
{id:'check',t0:S('s05'),t1:vm,in:'whipL',out:'whipR',f(t,u){table(tC,[1,t>S('s05')+.3,t>S('s05')+.6],'#e9c58c','#ff9a9a');topv(u,-.4,.25,10.2,8.4,0,0,.9,58);fx.draw=K.big('ИТОГО 140',S('s05')+.1,vm-.05,'#e8322a',170,.12)}},
{id:'coins',t0:vm,t1:S('s06'),in:'whipR',out:'zoom',f(t,u){const r=ss(vm,p40,t);coins(t,r);camPath(u,[-3.2,3.6,4.4],[-1.4,4.6,4.6],[0,.3,-2.0],[0,.5,-2.6],[58,56],.03);shake(t,p40,.25,.6);const h=t-p40;if(h>0){fx.crack={p:[0,.6,-3.6],a:clamp(h*3),seed:60};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('+40%',p40,S('s06')-.05,'#ff5a3a',260,.15)}},
{id:'rule',t0:S('s06'),t1:lish,in:'zoom',out:'whipUp',f(t,u){table(tP,[t>T('итоговую сумму.')-.1,0,0],'#cfe9c0','#7dff9a');topv(u,-.4,.25,10.2,8.4,0,0,.9,58);fx.draw=K.big('ИТОГО — ДО ОПЛАТЫ',T('итоговую сумму.'),lish-.05,'#2d8a4f',120,.1)}},
{id:'net',t0:lish,t1:S('s07'),in:'whipUp',out:'whipR',f(t,u){const k=ss(T('«нет, спасибо».')-.2,T('«нет, спасибо».')+.6,t);shop(t,{n:4,fly:k,col:'#2d8a4f',u:k,tot:0});seller(t,k>.3?'shock':'smile',k<.3);buy.pose(-1.6,-.2,{...BUY,expr:'smile',look:.6,aR:[2.1,.2],aL:[.3,.2],blink:blink(t)});camPath(u,[-2.6,.8,3.6],[-1.6,1.3,3.0],[-.6,1.5,-1.2],[-.3,1.7,-1.4],[60,56],-.02);fx.draw=K.big('«НЕТ, СПАСИБО»',T('вежливое'),S('s07')-.05,'#7dff9a',140,.14)}},
{id:'polite',t0:S('s07'),t1:S('s08'),in:'whipR',out:'whipUp',f(t,u){izba(t,{np:1,col:'#2d8a4f',u:1});demP(t,'shock',0);fok.pose(-1.5,.2,{...FOK,expr:'smile',look:.6,aR:[2.1,.2],aL:[.3,.2],blink:blink(t,.3)});camPath(u,[-.4,.8,3.6],[-.6,1.2,2.4],[-.6,1.4,-.6],[-.8,1.5,-.4],[58,52],.02);fx.draw=K.big('100, А НЕ 140',S('s07')+.05,S('s08')-.05,'#ffffff',150,.16)}},
{id:'next',t0:S('s08'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){izba(t,{np:0,col:'#ffd23f',u:1});dem.pose(.6,-.6,{...DEM,expr:'smile',look:-.6,aR:[2.2+.3*Math.sin(t*8),.4],aL:[.3,.2],blink:blink(t)});fokP(t,'smile');camPath(u,[1.8,.8,3.8],[.8,1.0,3.0],[0,1.4,-.8],[-.2,1.5,-.9],[58,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){P.forEach(p=>p.hide());f.call(this,t,u)}});
return shots};
