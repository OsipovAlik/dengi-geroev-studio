import {kit} from '/lib_ru.js';
// 52 Лиса и журавль: «0% рассрочка» — тарелка, с которой не съесть; 100 + страховка 6 + оповещения 1×12 = 118, переплата 18%; правило: до подписи сложить все платежи
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- лиса (своя рисовка): зелёный жилет лавочницы
const fox=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#f07a1e';c.beginPath();c.moveTo(w*.62,h*.82);c.quadraticCurveTo(w*.98,h*.78,w*.92,h*.5);c.quadraticCurveTo(w*.86,h*.66,w*.6,h*.72);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.9,h*.53,w*.05,h*.04,.4,0,7);c.fill();
 c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.1)-w*.05,h*.82,w*.1,h*.16,12);c.fill();c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.66,w*.2,h*.2,0,0,7);c.fill();c.stroke();
 c.fillStyle='#2f9a5a';c.beginPath();c.moveTo(w*.32,h*.54);c.lineTo(w*.68,h*.54);c.lineTo(w*.64,h*.8);c.lineTo(w*.36,h*.8);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff3e0';c.beginPath();c.ellipse(w*.5,h*.66,w*.07,h*.12,0,0,7);c.fill();c.stroke();
 const hy=.3,hr=.27;c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.1),h*(hy-hr*.55));c.lineTo(w*(.5+s*.27),h*(hy-hr*1.45));c.lineTo(w*(.5+s*.3),h*(hy-hr*.2));c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.moveTo(w*(.5+s*.2),h*(hy-hr*.75));c.lineTo(w*(.5+s*.265),h*(hy-hr*1.25));c.lineTo(w*(.5+s*.27),h*(hy-hr*.6));c.fill();c.fillStyle='#f07a1e'}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#fff3e0';c.beginPath();c.moveTo(w*.25,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.2),w*.75,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.1),w*.25,h*(hy+.02));c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.07),w*.04,h*.022,0,0,7);c.fill();
 c.lineWidth=10;const ey=hy-.03;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*ey,w*.06,h*.035,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.11+.015),h*(ey+.004),w*.025,0,7);c.fill()}
 if(mood==='sly'){c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*(ey-.016),w*.068,h*.024,0,PI,0);c.fill();c.stroke()}}
 c.lineWidth=9;c.beginPath();c.moveTo(w*.42,h*(hy+.115));c.quadraticCurveTo(w*.5,h*(hy+.14),w*.6,h*(hy+.1));c.stroke()};
// ---------- журавль (своя рисовка): серый, красная шапочка, длинный клюв
const crane=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#e8a33a';for(const s of[-1,1]){c.fillRect(w*(.5+s*.06)-w*.012,h*.7,w*.024,h*.28);c.strokeRect(w*(.5+s*.06)-w*.012,h*.7,w*.024,h*.28)}
 c.fillStyle='#b8c2cc';c.beginPath();c.ellipse(w*.5,h*.62,w*.24,h*.12,0,0,7);c.fill();c.stroke();
 c.fillStyle='#3a4450';c.beginPath();c.moveTo(w*.28,h*.6);c.quadraticCurveTo(w*.12,h*.7,w*.2,h*.76);c.quadraticCurveTo(w*.3,h*.7,w*.36,h*.68);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e9eef2';c.beginPath();c.moveTo(w*.46,h*.52);c.lineTo(w*.46,h*.32);c.lineTo(w*.54,h*.32);c.lineTo(w*.54,h*.52);c.closePath();c.fill();c.stroke();
 const hy=.24,hr=.2;c.fillStyle='#f4f6f8';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#d8263f';c.beginPath();c.arc(w*.5,h*(hy-.06),w*hr*.75,PI*1.12,PI*1.88);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e8a33a';c.beginPath();c.moveTo(w*.66,h*(hy+.01));c.lineTo(w*.99,h*(hy+.04));c.lineTo(w*.66,h*(hy+.06));c.closePath();c.fill();c.stroke();
 c.lineWidth=9;const ey=hy-.005;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*ey,w*.05,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08+.012),h*(ey+.004),w*.022,0,7);c.fill()}
 if(mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.13),h*(ey-.045));c.lineTo(w*(.5+s*.03),h*(ey-.03));c.stroke()}c.beginPath();c.arc(w*.5,h*(hy+.12),w*.05,PI*1.15,PI*1.85);c.stroke()}
 else{c.beginPath();c.arc(w*.5,h*(hy+.07),w*.05,PI*.15,PI*.85);c.stroke()}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md),0,0,0);scene.add(o[md]);o[md].visible=false});return o};
const FX=mk(fox,['smile','sly'],1.25,1.85),CR=mk(crane,['happy','sad'],1.35,2.25);
const BB=[...Object.values(FX),...Object.values(CR)];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.025,z)};
// ---------- изба лисы: стол и плоская тарелка
const rH=K.room('rH','#7a4a2a');
const tbl=new THREE.Group();tbl.position.set(0,0,-.8);rH.g.add(tbl);tbl.add(box(2.4,.1,1.3,'#8a5a30',0,.8,0));for(const x of[-1.05,1.05])for(const z of[-.5,.5])tbl.add(box(.1,.8,.1,'#5a3418',x,.4,z));
const plate=new THREE.Group();plate.position.set(0,.86,0);tbl.add(plate);plate.add(cyl(.5,.03,'#f4f1ea',0,0,0));plate.add(cyl(.42,.025,'#e8c040',0,.02,0));
const plTex=canvasTex(256,256,(c,w,h)=>{c.fillStyle='#e8c040';c.fillRect(0,0,w,h);const R=rng(5);c.fillStyle='#f6dc78';for(let i=0;i<60;i++){c.beginPath();c.arc(R()*w,R()*h,6+R()*8,0,7);c.fill()}c.fillStyle='#ff9a3a';c.beginPath();c.arc(w*.55,h*.45,22,0,7);c.fill()});
plate.add(plane(.8,.8,lam('#fff',{map:plTex,transparent:true}),0,.035,0,-PI/2));
const beak=new THREE.Mesh(new THREE.ConeGeometry(.06,.9,10),lam('#e8a33a'));beak.castShadow=true;scene.add(beak);beak.visible=false;
rH.g.add(K.stand(2.2,.6,'#fff6d0',[{t:'УГОЩАЙСЯ!',s:110,y:.55,c:'#15131a'}],0,3.55,-3.9));
const hut=(t,{col='#7a4a2a',u=0}={})=>{resetRoom(rH);rH.col(u,col);beak.visible=false};
// ---------- лавка: «0%» на тарелке-вывеске, телефон
const rS=K.room('rS','#1f3f6a');
const ctr=box(3.4,1.0,.9,'#c84a2a',0,.5,-1.4);rS.g.add(ctr);rS.g.add(box(3.5,.06,1.0,'#f4f1ea',0,1.03,-1.4));
const sign=drawn(1.8,1.8,(c,w,h)=>{c.lineWidth=18;c.strokeStyle=INK;c.fillStyle='#f4f1ea';c.beginPath();c.arc(w/2,h/2,w*.46,0,7);c.fill();c.stroke();c.strokeStyle='#c9c3b2';c.lineWidth=10;c.beginPath();c.arc(w/2,h/2,w*.36,0,7);c.stroke();c.fillStyle='#d02a1a';c.font='800 210px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('0%',w/2,h*.47);c.fillStyle=INK;c.font='800 62px Pop';c.fillText('РАССРОЧКА',w/2,h*.72)},1.9,1.35,-3.9);sign.castShadow=false;rS.g.add(sign);
const phone=new THREE.Group();phone.position.set(.3,1.06,-1.4);rS.g.add(phone);phone.add(box(.5,.9,.07,'#15131a',0,.46,0));
const scr=canvasTex(200,360,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#5ad0ff');g.addColorStop(1,'#a06aff');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font='800 70px Pop';c.textAlign='center';c.fillText('100',w/2,h*.55)});
phone.add(plane(.42,.8,new THREE.MeshBasicMaterial({map:scr}),0,.47,.04));
const tag=K.stand(.9,.5,'#ffd23f',[{t:'ЦЕНА 100',s:70,y:.55,c:'#15131a'}],1.15,1.32,-1.2);rS.g.add(tag);
const shop=(t,{col='#1f3f6a',u=0}={})=>{resetRoom(rS);rS.col(u,col)};
// ---------- договор сверху
const tC=K.makeTable('tC','ДОГОВОР РАССРОЧКИ',[['ЦЕНА: 100','0% на 12 месяцев'],['СТРАХОВКА: 6','обязательная'],['ОПОВЕЩЕНИЯ: 1 × 12','каждый месяц']]);
const pen=new THREE.Group();pen.add(cyl(.06,1.6,'#1f3f6a',0,0,0));pen.rotation.set(PI/2,0,.6);pen.position.set(2.8,.08,1.6);tC.g.add(pen);
const tR=K.makeTable('tR','ГРАФИК ПЛАТЕЖЕЙ',[['СЛОЖИТЕ ВСЁ','каждый платёж по графику'],['СУММА > ЦЕНЫ','значит, это не 0%'],['ДО ПОДПИСИ','а не после']],'#9a6a3e');
const calc=new THREE.Group();calc.position.set(-3.4,0,-1.4);tR.g.add(calc);calc.add(box(1.5,.12,2.1,'#3a4450',0,.06,0));
const calTx=canvasTex(300,420,(c,w,h)=>{c.fillStyle='#3a4450';c.fillRect(0,0,w,h);c.fillStyle='#bfe8a0';c.fillRect(20,20,w-40,100);c.fillStyle=INK;c.font='800 80px Pop';c.textAlign='right';c.fillText('118',w-40,100);for(let i=0;i<12;i++){c.fillStyle=i%4==3?'#ffb43a':'#e9eef2';c.fillRect(24+(i%4)*68,150+Math.floor(i/4)*86,56,66)}});
calc.add(plane(1.4,2.0,lam('#fff',{map:calTx}),0,.125,0,-PI/2));
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(T_,hl,col)=>{T_.g.visible=true;scene.background=new THREE.Color('#e9c58c');T_.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- столбцы: 100 + 6 + 12
const rB=K.room('rB','#24404a');const SC=.024;
const colG=box(1.0,100*SC,1.0,'#ffc93a',0,0,0),colI=box(1.0,6*SC,1.0,'#e8442a',0,0,0),colA=box(1.0,12*SC,1.0,'#ff7a3a',0,0,0);[colG,colI,colA].forEach(b=>rB.g.add(b));
const lbG=K.stand(1.3,.5,'#fff',[{t:'ЦЕНА',s:80,y:.55,c:'#15131a'}],0,0,0),lbI=K.stand(1.3,.5,'#fff',[{t:'СТРАХОВКА',s:60,y:.55,c:'#d02a1a'}],0,0,0),lbA=K.stand(1.3,.5,'#fff',[{t:'ОПОВЕЩЕНИЯ',s:52,y:.55,c:'#d02a1a'}],0,0,0);[lbG,lbI,lbA].forEach(b=>rB.g.add(b));
const bars=(t,{merge=0,col='#24404a',u=0}={})=>{resetRoom(rB);rB.col(u,col);const gh=100*SC;colG.position.set(-1.1*(1-merge),gh/2,-2.2);
 const k1=ease(clamp(merge*1.6)),k2=ease(clamp(merge*1.6-.6));
 colI.position.set(lerp(0,-1.1*(1-merge),k1)*1,lerp(6*SC/2,gh+6*SC/2,k1)+Math.sin(k1*PI)*1.0,-2.2);
 colA.position.set(lerp(1.1,-1.1*(1-merge),k2),lerp(12*SC/2,gh+6*SC+12*SC/2,k2)+Math.sin(k2*PI)*1.0,-2.2);
 lbG.position.set(colG.position.x,gh+.4,-1.68);lbI.position.set(colI.position.x,Math.max(.5,colI.position.y+.45),-1.68);lbA.position.set(colA.position.x,Math.max(.5,colA.position.y+.45),-1.68);lbI.visible=lbA.visible=merge<.4;lbG.visible=merge<.4};
// ---------- город
K.billboard(city.g,'ПРОВЕРКА','ЗА 1 МИНУТУ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','МОРОЗКО',0,9,24,16,9,'#9ad0ff');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const pere=T('Можно переплатить'),kasha=T('кашу'),ugo=T('угощение есть,'),tel=T('Телефон стоит 100.'),dog=T('А в договоре:'),str=T('страховка — 6'),opo=T('и оповещения —'),s118=T('118.'),perep=T('Переплата'),summ=T('Больше цены —');
const HOOK=['РАССРОЧКА 0%?','ПЕРЕПЛАТА 18%'];
const shots=[
{id:'hook',t0:0,t1:pere,out:'whipR',f(t,u){shop(t);put(FX,'sly',-.9,-2.2,t);camPath(u,[-.3,1.6,2.6],[-.2,1.7,1.6],[-.1,1.75,-2.4],[-.1,1.8,-2.6],[62,58],.03);fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'tag',t0:pere,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){shop(t,{col:'#5a2a3a',u:ss(0,1,u)});put(FX,'smile',-.9,-2.2,t);const a=lerp(.6,.15,u);cam.position.set(.3+Math.sin(a)*2.6,lerp(1.5,1.7,u),-1.4+Math.cos(a)*2.6);cam.lookAt(.1,1.75,-1.6);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'hut',t0:S('s03'),t1:ugo,in:'whipL',out:'whipUp',f(t,u){hut(t);put(FX,'sly',-.85,-1.8,t);put(CR,'happy',.85,-1.8,t);linPath(u,[2.0,1.7,3.6],[-1.2,1.8,3.4],[.2,1.5,-1.2],[-.2,1.5,-1.2],[60,58],0);fx.tags=[{txt:'КАША',t:kasha,xy:[.5,.12]}]}},
{id:'plate',t0:ugo,t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){hut(t);beak.visible=true;const tap=Math.abs(Math.sin((t-ugo)*7));beak.position.set(.55,.86+.5+.06+tap*.35,-.8+.15);beak.rotation.set(0,0,-.5+tap*.1);beak.rotation.x=PI;beak.rotation.z=.5;
 top(u,-.4,.5,3.8,3.1,.2,-.8,56);fx.draw=K.big('НЕ СЪЕСТЬ',T('а не съесть.'),S('s04')-.05,'#ff8a5a',170,.18)}},
{id:'same',t0:S('s04'),t1:S('s05'),in:'zoom',out:'whipR',f(t,u){shop(t);put(FX,'sly',-.9,-2.2,t);camPath(u,[1.0,1.6,3.6],[1.4,2.0,1.4],[1.9,2.1,-3.9],[1.9,2.2,-3.9],[64,54],-.04);fx.tags=[{txt:'ТА ЖЕ ТАРЕЛКА',t:T('та же тарелка.'),xy:[.5,.12]}]}},
{id:'phone',t0:S('s05'),t1:dog,in:'whipR',out:'zoom',f(t,u){shop(t);put(FX,'smile',-.9,-2.2,t);camPath(u,[1.8,1.5,1.4],[.9,1.5,.2],[.3,1.5,-1.4],[.3,1.5,-1.4],[56,48],.03);fx.draw=K.big('0% НА ГОД',T('0% на год.'),dog-.05,'#7dff9a',170,.13)}},
{id:'contract',t0:dog,t1:opo,in:'zoom',out:'whipL',f(t,u){table(tC,[1,t>str,0],'#ff8a5a');top(u,-.4,.1,9.5,7.4,0,0,58);fx.draw=K.big('+6',str+.1,opo-.05,'#ff5a5a',230,.13)}},
{id:'alerts',t0:opo,t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){table(tC,[1,1,t>opo+.3],'#ff8a5a');top(u,.2,-.3,6.2,5.0,0,1.6,58);fx.draw=K.big('1 × 12 = 12',T('по 1 в месяц.')+.05,S('s06')-.05,'#ff5a5a',170,.13)}},
{id:'sum',t0:S('s06'),t1:perep,in:'whipUp',out:'whipR',f(t,u){const m=ss(S('s06')+.3,s118-.05,t);const h=t-s118;bars(t,{merge:m,col:'#6a2a2a',u:ss(0,.3,h)});
 camPath(u,[.6,1.8,3.8],[.2,1.9,3.4],[-.3,1.5,-2.2],[-.4,1.7,-2.2],[66,62],.02);const k=h>0?Math.max(0,1-h/.5):0;cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>0){fx.crack={p:[-.6,2.9,-3.9],a:clamp(h*3),seed:12};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('118',s118,perep-.02,'#ff5a5a',260,.13)}},
{id:'over',t0:perep,t1:S('s07'),in:'whipR',out:'whipUp',f(t,u){bars(t,{merge:1,col:'#6a2a2a',u:1});const a=lerp(-.6,.4,u);cam.position.set(Math.sin(a)*3.4,lerp(3.6,2.8,u),-2.2+Math.cos(a)*3.4);cam.lookAt(0,2.4,-2.2);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.big('+18%',perep+.1,S('s07')-.05,'#ff5a5a',260,.13)}},
{id:'rule',t0:S('s07'),t1:summ,in:'whipUp',out:'whipL',f(t,u){table(tR,[t>T('сложите все платежи.'),0,t>T('до подписи')],'#7dff9a');top(u,-.5,.2,10.5,8.2,-.6,0,58);fx.tags=[{txt:'ДО ПОДПИСИ',t:T('до подписи'),xy:[.5,.12]}]}},
{id:'notzero',t0:summ,t1:S('s08'),in:'whipL',out:'zoom',f(t,u){table(tR,[1,1,0],'#ff8a5a');top(u,.3,-.3,7.0,5.4,-1.6,-.8,58);fx.draw=K.big('ЭТО НЕ 0%',T('значит, не ноль.'),S('s08')-.05,'#ff5a5a',150,.13)}},
{id:'end',t0:S('s08'),t1:S('s09'),in:'zoom',out:'whipR',f(t,u){hut(t,{col:'#2a5a4a',u:ss(0,1,u)});put(FX,'smile',-.85,-1.8,t);put(CR,'sad',.85,-1.8,t);const a=lerp(.4,-.25,u);cam.position.set(Math.sin(a)*5.0,lerp(1.4,1.6,ease(u)),-1.2+Math.cos(a)*5.0);cam.lookAt(0,1.05,-1.2);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('ОБЩАЯ СУММА',T('а общую сумму.'),S('s09')-.05,'#7dff9a',160,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);beak.visible=false;f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
