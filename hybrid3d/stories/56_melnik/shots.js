import {kit} from '/lib_ru.js';
// 56 Мельник (Крылов): экономят на мелочах, а главная течь — регулярные траты; булочка: 2 в день = 60 в месяц, проценты по карте 3 тыс. под 30% = 75 в месяц; правило: раз в месяц найти три самые большие траты и латать их первыми
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- курица (своя рисовка)
const hen=drawn(.8,.8,(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=10;
 c.strokeStyle='#e8a020';c.lineWidth=9;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.78);c.lineTo(w*(.5+s*.1),h*.97);c.stroke()}c.strokeStyle=INK;c.lineWidth=10;
 c.fillStyle='#ffffff';c.beginPath();c.ellipse(w*.5,h*.6,w*.3,h*.2,0,0,7);c.fill();c.stroke();
 c.beginPath();c.moveTo(w*.22,h*.55);c.lineTo(w*.08,h*.36);c.lineTo(w*.26,h*.46);c.closePath();c.fill();c.stroke();
 c.beginPath();c.arc(w*.68,h*.32,w*.14,0,7);c.fill();c.stroke();
 c.fillStyle='#e8322a';c.beginPath();c.arc(w*.64,h*.17,w*.05,0,7);c.arc(w*.72,h*.16,w*.05,0,7);c.fill();c.stroke();
 c.fillStyle='#ffb020';c.beginPath();c.moveTo(w*.8,h*.3);c.lineTo(w*.93,h*.34);c.lineTo(w*.8,h*.38);c.closePath();c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.arc(w*.71,h*.3,w*.025,0,7);c.fill()},0,0,0);scene.add(hen);hen.visible=false;
// ---------- мельник
const mil=new Puppet('big',2.0);scene.add(mil.m);
const MIL={col:'#f4f1e8',hair:'#8a6a4a'};
// ---------- мельница: пруд, плотина, колесо, дом
const gM=new THREE.Group();
gM.add(Object.assign(plane(200,200,lam('#7ac85a'),0,0,0,-PI/2),{receiveShadow:true}));
const pondM=lam('#3a8ad8');const pond=plane(30,22,pondM,0,1.3,-14.3,-PI/2);pond.receiveShadow=true;gM.add(pond);
gM.add(Object.assign(plane(4.2,40,lam('#3a8ad8'),0,.02,17,-PI/2),{receiveShadow:true}));
const dam=box(9,1.6,.6,'#9a6a34',0,.8,-3.2);gM.add(dam);
for(let i=0;i<5;i++)gM.add(box(9.02,.04,.62,'#5a3a1a',0,.2+i*.32,-3.2));
for(let i=0;i<10;i++)gM.add(box(.06,1.62,.64,'#5a3a1a',-4.2+i*.93,.8,-3.2));
const patches=[];for(let i=0;i<4;i++){const p=box(1.1,.5,.1,'#d9a35a',-2.4+i*1.6,.75,-2.86);p.rotation.z=(i%2?.12:-.1);gM.add(p);patches.push(p)}
const leakM=new THREE.MeshLambertMaterial({color:'#7ac8ff',transparent:true,opacity:.85});
const leaks=[];for(let i=0;i<5;i++){const R=rng(70+i);const l=new THREE.Mesh(new THREE.BoxGeometry(.12,1,.12),leakM);l.scale.x=2;l.position.set(-3+i*1.5+R()*.4,0,-2.85);gM.add(l);leaks.push({m:l,y0:.4+R()*.9,k:i})}
const puddle=new THREE.Mesh(new THREE.CircleGeometry(1,24),leakM);puddle.rotation.x=-PI/2;puddle.position.set(0,.03,-2);gM.add(puddle);
const house=box(3.2,2.8,3.2,'#e9d6a8',4.6,1.4,-.6);gM.add(house);
const roof=new THREE.Mesh(new THREE.ConeGeometry(2.7,1.6,4),lam('#c0442a'));roof.position.set(4.6,3.6,-.6);roof.rotation.y=PI/4;roof.castShadow=true;gM.add(roof);
gM.add(box(.8,1.4,.06,'#6a3a1a',4.6,.7,1.02));gM.add(box(.7,.7,.06,'#ffe08a',3.7,1.9,1.02));
gM.add(K.stand(2.4,.6,'#fff',[{t:'МЕЛЬНИЦА',s:90,y:.55,c:'#15131a'}],4.6,3.0,1.06));
const wheel=new THREE.Group();wheel.position.set(2.75,1.3,.2);gM.add(wheel);
{const rim=new THREE.Mesh(new THREE.TorusGeometry(1.15,.1,8,28),lam('#7a4a24'));rim.rotation.y=PI/2;rim.castShadow=true;wheel.add(rim);
 for(let i=0;i<8;i++){const s=box(.12,2.3,.1,'#9a6a34',0,0,0);s.rotation.x=i*PI/8;wheel.add(s)}
 for(let i=0;i<12;i++){const a=i/12*PI*2;const b=box(.3,.08,.4,'#c88a4a',0,Math.sin(a)*1.15,Math.cos(a)*1.15);b.rotation.x=-a;wheel.add(b)}
 wheel.add(cyl(.18,.4,'#3a2a1a',0,0,0));}
for(let i=0;i<14;i++){const R=rng(300+i);const x=(i%2?1:-1)*(8+R()*14),z=-30+i*4;const tr=new THREE.Mesh(new THREE.SphereGeometry(1+R()*.8,10,8),lam(i%3?'#3a8a3a':'#2a7a3a'));tr.position.set(x,1.2,z);tr.castShadow=true;gM.add(tr);gM.add(box(.25,1.2,.25,'#6a4a2a',x,.6,z))}
const millHemi=new THREE.HemisphereLight('#fff6e0','#5a7a4a',3.1);gM.add(millHemi);sunRig(gM,[-8,18,10],[1,0,-1],'#fff1d0',2.6,16);addSet('mill',gM);
// уровень течи 0..1, патч 0..1, скорость колеса
const mill=(t,{leak=.2,patch=0,ang=0,sky=0}={})=>{gM.visible=true;scene.background=new THREE.Color('#9ad8ff').lerp(new THREE.Color('#8a96a8'),sky);
 millHemi.color.set(new THREE.Color('#fff6e0').lerp(new THREE.Color('#c8d4e8'),sky));
 pond.position.y=lerp(1.3,.55,clamp(leak-.4)*1.4);
 leaks.forEach(L=>{const on=leak*5>L.k*.9;const hh=L.y0;L.m.visible=on&&patch<.9;L.m.scale.set(lerp(1.2,3.6,leak),hh,1);L.m.position.y=hh/2+Math.sin(t*20+L.k)*.01});
 puddle.visible=patch<.9;puddle.scale.setScalar(lerp(.6,3.2,leak));patches.forEach((p,i)=>p.visible=patch*4>i);wheel.rotation.x=ang};
const wheelAng=(t,t0,t1)=>{// крутится со скоростью 1.6, плавно останавливается между t0 и t1
 const v=1.6;if(t<t0)return -t*v;const d=Math.min(t,t1)-t0,D=t1-t0;return -(t0*v+v*(d-d*d/(2*D)))};
// ---------- кухня: булочка и две башни
const rK=K.room('rK','#5f8c9e');
const tableK=box(2.2,.9,1.2,'#b07a44',-1.2,.45,-1.4);rK.g.add(tableK);
const bun=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),lam('#e0a04a'));bun.scale.y=.6;bun.position.set(-1.2,1.05,-1.3);bun.castShadow=true;rK.g.add(bun);
const bunX=K.stand(.7,.7,'#e8322a',[{t:'✕',s:150,y:.55,c:'#fff'}],-1.2,1.55,-1.2);rK.g.add(bunX);
const t60=K.tower('#ffd23f',.6,-2.2);rK.g.add(t60.g);const t75=K.tower('#e8322a',2.0,-2.2);rK.g.add(t75.g);
const s60=K.stand(1.2,.55,'#ffd23f',[{t:'+60',s:120,y:.55,c:'#15131a'}],.6,3.0,-2.0);rK.g.add(s60);
const s75=K.stand(1.2,.55,'#e8322a',[{t:'−75',s:120,y:.55,c:'#ffffff'}],2.0,3.0,-2.0);rK.g.add(s75);
const card=K.stand(1.5,.95,'#2a3a8a',[{t:'КАРТА',s:70,y:.3,c:'#fff'},{t:'ДОЛГ 3 ТЫС.',s:62,y:.62,c:'#ffd23f'},{t:'30% ГОДОВЫХ',s:48,y:.86,c:'#fff'}],-1.2,1.6,-1.0);card.rotation.x=-.2;rK.g.add(card);
const kitchen=(t,{col='#5f8c9e',u=0,n60=0,n75=0,showBun=1,x=0,showCard=0}={})=>{resetRoom(rK);rK.col(u,col);bun.visible=showBun>0;bunX.visible=x>0;bunX.scale.setScalar(x>0?lerp(1.8,1,ss(0,1,x)):1);t60.set(Math.round(n60));t75.set(Math.round(n75));s60.visible=n60>=6;s75.visible=n75>=7;card.visible=showCard>0};
// ---------- выписка сверху
const tS=K.makeTable('tS','ВЫПИСКА ЗА МЕСЯЦ',[['ПРОЦЕНТЫ ПО КАРТЕ −75','самая большая течь'],['ЭКОНОМИЯ НА БУЛОЧКАХ +60','меньше, чем течь'],['3 САМЫЕ БОЛЬШИЕ ТРАТЫ','латать первыми']]);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tS.g.visible=true;scene.background=new THREE.Color('#e9c58c');tS.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- город
K.billboard(city.g,'ГДЕ ТЕЧЁТ','ВАШ БЮДЖЕТ?',0,9,-26,16,9,'#7ac8ff');K.billboard(city.g,'ЗАВТРА','ЛИСА-ЛАПОТНИЦА',0,9,24,16,9,'#ff9a6a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const kry=T('Мельник у Крылова'),lazy=T('Чинить было лень.'),stop=T('мельница встала.'),on=T('А он'),m60=T('60 в месяц.'),m75=T('75 в месяц'),pr=T('найдите в выписке'),lat=T('и латайте');
const HOOK=['ЭКОНОМИТЕ,','А ДЕНЕГ НЕТ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:kry,out:'whipR',f(t,u){kitchen(t,{col:'#5f8c9e'});mil.pose(.4,-1.6,{expr:'sly',look:-.6,aL:[.6,1.2],aR:[.2,.2],blink:blink(t),...MIL});camPath(u,[-2.2,.7,3.4],[-1.6,1.0,2.4],[-1.0,1.3,-1.4],[-.9,1.3,-1.4],[62,54],.03);fx.draw=K.hook(HOOK,0,kry-.05)}},
{id:'miller',t0:kry,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){mill(t,{leak:.2,ang:wheelAng(t,99,100)});mil.pose(1.0,1.6,{expr:'smile',look:.4,talk:talk(t),blink:blink(t),...MIL});linPath(u,[-3.4,1.0,7.0],[-1.6,1.3,6.6],[1.4,1.6,-.4],[2.4,1.8,-.6],[58,56],.02)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'damtop',t0:S('s03'),t1:lazy,in:'whipL',out:'whipR',f(t,u){mill(t,{leak:lerp(.25,.45,u),ang:wheelAng(t,99,100)});camPath(u,[-3.2,.5,1.6],[-1.6,.7,1.2],[-1.0,.8,-2.9],[.4,.8,-2.9],[62,58],.03);fx.tags=[{txt:'ВОДА СОЧИТСЯ',t:T('вода сочилась'),xy:[.5,.12]}]}},
{id:'lazy',t0:lazy,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){mill(t,{leak:.5,ang:wheelAng(t,99,100)});mil.pose(-1.4,.6,{expr:'sly',sit:1,look:.5,aL:[.4,1.4],aR:[.4,1.4],blink:blink(t),...MIL});camPath(u,[-4.2,.45,3.6],[-3.4,.55,2.8],[-.6,1.0,-1.6],[-.4,1.1,-1.8],[62,58],-.03);fx.draw=K.big('«И ТАК СОЙДЁТ»',lazy+.05,S('s04')-.05,'#ffffff',150,.16)}},
{id:'grow',t0:S('s04'),t1:stop,in:'whipUp',out:'zoom',f(t,u){mill(t,{leak:lerp(.55,1,u),ang:wheelAng(t,S('s04'),stop),sky:u*.6});const a=lerp(.9,.4,u);cam.position.set(Math.sin(a)*7.5,lerp(2.2,1.4,u),-2.6+Math.cos(a)*7.5);cam.lookAt(.6,1.0,-2.6);cam.fov=56;cam.updateProjectionMatrix();fx.tags=[{txt:'ТЕЧЬ РАСТЁТ',t:T('Течь росла,'),xy:[.5,.12]}]}},
{id:'stop',t0:stop,t1:on,in:'zoom',out:'whipL',f(t,u){mill(t,{leak:1,ang:wheelAng(t,S('s04'),stop),sky:.7});camPath(u,[1.0,1.1,4.6],[1.2,1.2,4.0],[2.6,1.3,.2],[2.6,1.3,.2],[58,56],0);shake(t,stop+.05,.16,.6);
 const h=t-stop;if(h>.05){fx.crack={p:[2.75,1.3,.25],a:clamp((h-.05)*3),seed:31};fx.flash=Math.max(0,1-(h-.05)/.25)}fx.draw=K.big('МЕЛЬНИЦА ВСТАЛА',stop+.05,on-.05,'#ff5a5a',140,.16)}},
{id:'hen',t0:on,t1:S('s05'),in:'whipL',out:'zoom',f(t,u){mill(t,{leak:1,ang:wheelAng(t,0,.01),sky:.7});const hx=lerp(.6,1.8,u);hen.visible=true;hen.position.set(hx,Math.abs(Math.sin(t*9))*.05,-1.4);
 mil.pose(lerp(-1.6,-.4,u),-.6,{expr:'rage',red:.6,look:1,aR:[2.3,.3],aL:[1.2,-1.0],talk:talk(t),walk:Math.sin(t*9),blink:false,...MIL});camPath(u,[-.6,.8,5.4],[0,.9,4.8],[-.2,1.0,-1.0],[.3,1.0,-1.0],[60,56],.02);fx.draw=K.big('«ПЬЁТ МОЮ ВОДУ!»',T('«пьёт мою воду!»'),S('s05')-.05,'#ffd23f',150,.16)}},
{id:'bun',t0:S('s05'),t1:T('сэкономили 2 в день,'),in:'zoom',out:'whipUp',f(t,u){kitchen(t,{x:t>T('от булочки —')?ss(T('от булочки —'),T('от булочки —')+.2,t):0});mil.pose(.6,-1.8,{expr:'neutral',look:-.8,aL:[.2,.2],aR:[.9,.6],blink:blink(t),...MIL});const a=lerp(-.5,.2,u);cam.position.set(-1.2+Math.sin(a)*2.6,lerp(1.9,1.5,u),-1.3+Math.cos(a)*2.6);cam.lookAt(-1.2,1.1,-1.3);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'sixty',t0:T('сэкономили 2 в день,'),t1:S('s06'),in:'whipUp',out:'whipR',f(t,u){kitchen(t,{showBun:0,n60:ss(T('сэкономили 2 в день,'),m60,t)*6,col:'#5f8c9e'});camPath(u,[-1.6,.6,2.6],[-.8,2.2,2.2],[.6,1.0,-2.2],[.8,2.2,-2.2],[62,58],.02);fx.draw=K.big('+60 В МЕСЯЦ',m60,S('s06')-.05,'#ffd23f',170,.16)}},
{id:'card',t0:S('s06'),t1:m75,in:'whipR',out:'whipL',f(t,u){kitchen(t,{showBun:0,n60:6,showCard:1,col:'#7a3a4a',u:ss(0,1,u)});camPath(u,[-2.0,1.4,2.6],[-1.6,1.6,1.9],[-1.2,1.6,-1.0],[-1.2,1.6,-1.0],[56,52],-.02)}},
{id:'leak75',t0:m75,t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){kitchen(t,{showBun:0,n60:6,n75:ss(m75,m75+.8,t)*7.5,col:'#7a3a4a',u:1});camPath(u,[2.5,.5,2.6],[2.0,.8,2.0],[1.5,1.3,-2.2],[1.3,1.5,-2.2],[64,60],-.03);fx.draw=K.big('−75 В МЕСЯЦ',m75+.05,S('s07')-.05,'#ff5a5a',170,.16)}},
{id:'compare',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'zoom',f(t,u){kitchen(t,{showBun:0,n60:6,n75:7.5,col:'#5a1e22',u:1});const b=T('чем вся экономия.');camPath(u,[1.3,.4,3.6],[1.3,.5,3.0],[1.3,1.6,-2.2],[1.3,1.7,-2.2],[66,62],0);shake(t,b,.08,.4);if(t>b){fx.flash=Math.max(0,1-(t-b)/.2)}fx.draw=K.big('75 > 60',S('s07')+.05,S('s08')-.05,'#ffffff',220,.16)}},
{id:'statement',t0:S('s08'),t1:lat,in:'zoom',out:'whipUp',f(t,u){const k=T('три самые');table([t>pr,t>pr+.6,t>k]);top(u,-.4,.25,10.2,8.0,0,0,58)}},
{id:'patch',t0:lat,t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){const p=ss(lat,lat+1.2,t);mill(t,{leak:lerp(1,.1,p),patch:p,ang:-(t-lat)*1.8*p});mil.pose(-.6,-1.9,{expr:'smile',look:.3,aR:[2.0,.8],aL:[.3,.2],blink:blink(t),...MIL});const a=lerp(-.7,.4,u);cam.position.set(Math.sin(a)*9,lerp(5.5,3.2,u),-2.6+Math.cos(a)*9);cam.lookAt(.8,1,-2.4);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('ЛАТАЙ ГЛАВНОЕ',lat+.05,S('s09')-.05,'#7dff9a',150,.16)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
const BB=[hen];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);mil.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
