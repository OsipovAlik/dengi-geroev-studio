import {kit} from '/lib_ru.js';
// 55 Лисица и виноград: «всё равно не накоплю» — цель кажется недостижимой и её бросают; 120 тысяч = 12 месяцев × 10 тысяч ≈ 330 в день; правило: большая цель — это маленькие шаги
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- лиса (своя рисовка): синий жилет
const fox=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#f07a1e';c.beginPath();c.moveTo(w*.62,h*.82);c.quadraticCurveTo(w*.98,h*.78,w*.92,h*.5);c.quadraticCurveTo(w*.86,h*.66,w*.6,h*.72);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.9,h*.53,w*.05,h*.04,.4,0,7);c.fill();
 c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.1)-w*.05,h*.82,w*.1,h*.16,12);c.fill();c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.66,w*.2,h*.2,0,0,7);c.fill();c.stroke();
 c.fillStyle='#2a6ad8';c.beginPath();c.moveTo(w*.32,h*.54);c.lineTo(w*.68,h*.54);c.lineTo(w*.64,h*.8);c.lineTo(w*.36,h*.8);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff3e0';c.beginPath();c.ellipse(w*.5,h*.66,w*.07,h*.12,0,0,7);c.fill();c.stroke();
 const hy=.3,hr=.27;c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.1),h*(hy-hr*.55));c.lineTo(w*(.5+s*.27),h*(hy-hr*1.45));c.lineTo(w*(.5+s*.3),h*(hy-hr*.2));c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.moveTo(w*(.5+s*.2),h*(hy-hr*.75));c.lineTo(w*(.5+s*.265),h*(hy-hr*1.25));c.lineTo(w*(.5+s*.27),h*(hy-hr*.6));c.fill();c.fillStyle='#f07a1e'}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#fff3e0';c.beginPath();c.moveTo(w*.25,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.2),w*.75,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.1),w*.25,h*(hy+.02));c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.07),w*.04,h*.022,0,0,7);c.fill();
 c.lineWidth=10;const ey=hy-.03;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*ey,w*.06,h*.035,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.11+.015),h*(ey+.004),w*.025,0,7);c.fill()}
 if(mood==='sly'){c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*(ey-.016),w*.068,h*.024,0,PI,0);c.fill();c.stroke()}}
 c.lineWidth=9;c.beginPath();c.moveTo(w*.42,h*(hy+.115));c.quadraticCurveTo(w*.5,h*(hy+.14),w*.6,h*(hy+.1));c.stroke()};
const FX={};['smile','sly'].forEach(md=>{FX[md]=drawn(1.25,1.85,fox(md),0,0,0);scene.add(FX[md]);FX[md].visible=false});
const putF=(md,x,z,t,y=0)=>{Object.values(FX).forEach(m=>m.visible=false);const m=FX[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.025,z)};
// ---------- виноградник
const gV=new THREE.Group();
gV.add(Object.assign(plane(200,200,lam('#7ac85a'),0,0,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<30;i++){const R=rng(400+i);const z=-40+i*2.4,x=(i%2?1:-1)*(4+R()*12);const b=new THREE.Mesh(new THREE.SphereGeometry(.9+R()*.6,10,8),lam(i%3?'#3a8a3a':'#2a7a3a'));b.position.set(x,.7,z);b.castShadow=true;gV.add(b)}
[-2.6,2.6].forEach(x=>{gV.add(box(.18,3.6,.18,'#7a4a24',x,1.8,-1.2))});gV.add(box(5.6,.14,.14,'#7a4a24',0,3.55,-1.2));
for(let i=0;i<9;i++){const R=rng(60+i);const l=new THREE.Mesh(new THREE.SphereGeometry(.35+R()*.15,8,6),lam(i%2?'#2f8a3a':'#4aa83a'));l.scale.y=.5;l.position.set(-2.4+i*.6,3.55+R()*.1,-1.2+(R()-.5)*.3);l.castShadow=true;gV.add(l)}
const bunch=new THREE.Group();bunch.position.set(.6,3.45,-1.2);gV.add(bunch);
for(let r=0;r<6;r++){const n=6-r;for(let i=0;i<n;i++){const a=i/n*PI*2+r;const rr=(n-1)*.05;const g=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8),lam(i%2?'#7a2a9a':'#9a3ab8'));g.position.set(Math.cos(a)*rr,-.12-r*.15,Math.sin(a)*rr);g.castShadow=true;bunch.add(g)}}
bunch.add(cyl(.03,.25,'#5a3a1a',0,.05,0));
const b2=bunch.clone();b2.position.set(-1.6,3.45,-1.3);gV.add(b2);
const ladder=new THREE.Group();ladder.position.set(.6,0,-.2);ladder.rotation.x=-.25;gV.add(ladder);
[-.35,.35].forEach(x=>ladder.add(box(.08,2.8,.08,'#c88a4a',x,1.4,0)));const rungs=[];for(let i=0;i<12;i++){const r=box(.7,.06,.08,'#ffd23f',0,.2+i*.21,0);ladder.add(r);rungs.push(r)}
const lbL=K.stand(1.3,.4,'#fff',[{t:'12 СТУПЕНЕК',s:80,y:.55,c:'#15131a'}],-1.4,2.3,-1.1);gV.add(lbL);
gV.add(new THREE.HemisphereLight('#fff6e0','#5a7a4a',3.1));sunRig(gV,[8,18,8],[0,0,-1],'#fff1d0',2.6,14);addSet('vine',gV);
const vine=(t,{steps=-1,sunset=0}={})=>{gV.visible=true;scene.background=new THREE.Color('#9ad8ff').lerp(new THREE.Color('#ff9a6a'),sunset);ladder.visible=steps>=0;rungs.forEach((r,i)=>r.visible=i<steps);lbL.visible=steps>=12};
// ---------- копилка-цель: прозрачная башня 120 и 12 кубиков по 10
const rS=K.room('rS','#2a3a5a');
const ghost=box(1.6,3.0,1.1,'#ffffff',0,1.5,-2.2);ghost.material=ghost.material.clone();ghost.material.transparent=true;ghost.material.opacity=.22;ghost.castShadow=false;rS.g.add(ghost);
const gEdge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6,3.0,1.1)),new THREE.LineBasicMaterial({color:'#15131a'}));gEdge.position.set(0,1.5,-2.2);rS.g.add(gEdge);
const blocks=[];for(let i=0;i<12;i++){const b=box(1.5,.24,1.0,i%2?'#ffd23f':'#ffc020',0,0,-2.2);rS.g.add(b);blocks.push(b)}
rS.g.add(K.stand(1.9,.45,'#ffd23f',[{t:'ЦЕЛЬ: 120 ТЫСЯЧ',s:70,y:.55,c:'#15131a'}],0,3.5,-1.6));
const goal=(t,{n=0,col='#2a3a5a',u=0,fall=0}={})=>{resetRoom(rS);rS.col(u,col);blocks.forEach((b,i)=>{const k=ease(clamp(n-i));b.visible=k>0;b.position.y=lerp(3.8,.12+i*.25,k)});ghost.visible=gEdge.visible=fall<1;ghost.rotation.z=gEdge.rotation.z=fall*.25;ghost.position.x=gEdge.position.x=fall*.4};
// ---------- план на год сверху
const tA=K.makeTable('tA','ПЛАН НА ГОД',[['ЦЕЛЬ: 120 ТЫСЯЧ','кажется недостижимой'],['12 МЕСЯЦЕВ × 10 ТЫСЯЧ','по шагу в месяц'],['≈ 330 В ДЕНЬ','маленький ежедневный шаг']]);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58,cy=0)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#7dff9a')})};
// ---------- город
K.billboard(city.g,'КАК ДОТЯНУТЬСЯ','ДО ЛЮБОЙ ЦЕЛИ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','СКУПОЙ РЫЦАРЬ',0,9,24,16,9,'#ff9a6a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const tak=T('Так рассуждала'),jump=T('но не допрыгнула —'),said=T('и сказала:'),zel=T('«он зелен».'),brs=T('и мы бросаем.'),den=T('Это около 330'),god=T('и через год'),mal=T('это маленькие');
const HOOK=['«ВСЁ РАВНО','НЕ НАКОПЛЮ»?'];
const shots=[
{id:'hook',t0:0,t1:tak,out:'whipR',f(t,u){goal(t,{n:1});putF('smile',-.5,.35,t);camPath(u,[-.7,.8,3.2],[-.3,1.0,2.6],[-.3,2.0,-1.4],[-.2,2.0,-1.4],[64,58],.03);fx.draw=K.hook(HOOK,0,tak-.05)}},
{id:'look',t0:tak,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){vine(t);putF('smile',.2,.4,t);camPath(u,[-1.6,.5,4.0],[-.8,1.4,3.6],[.2,1.2,-.4],[.5,2.8,-1.2],[60,56],.02)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'see',t0:S('s03'),t1:jump,in:'whipL',out:'whipR',f(t,u){vine(t);putF('smile',.2,.4,t);const a=lerp(.8,.2,u);cam.position.set(.4+Math.sin(a)*4.6,lerp(1.0,1.5,u),-.6+Math.cos(a)*4.6);cam.lookAt(.4,2.2,-.8);cam.fov=60;cam.updateProjectionMatrix();fx.tags=[{txt:'СПЕЛЫЙ ВИНОГРАД',t:T('спелый виноград,'),xy:[.5,.12]}]}},
{id:'jump',t0:jump,t1:said,in:'whipR',out:'whipL',f(t,u){vine(t);const j=Math.abs(Math.sin((t-jump)*5.5))*.55;putF('smile',.45,.1,t,j);linPath(u,[-2.6,1.4,3.6],[-1.2,1.6,3.6],[0,1.8,-.6],[.4,1.9,-.6],[58,56],0)}},
{id:'green',t0:said,t1:S('s04'),in:'whipL',out:'whipUp',f(t,u){vine(t,{sunset:.3});putF('sly',-.4,.6,t);camPath(u,[.6,1.0,3.4],[.1,1.1,2.8],[-.4,1.0,.4],[-.4,1.05,.4],[56,52],-.02);fx.draw=K.big('«ОН ЗЕЛЕН!»',zel,S('s04')-.05,'#9ad86a',190,.16)}},
{id:'topgr',t0:S('s04'),t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){vine(t,{sunset:.3});putF('sly',-.6,.6,t);camPath(u,[.2,.35,1.6],[.35,.5,1.0],[.5,2.6,-1.2],[.6,3.1,-1.2],[64,58],.05);fx.tags=[{txt:'ВИСЕЛ ВЫСОКО',t:T('Просто висел'),xy:[.5,.12]}]}},
{id:'goal',t0:S('s05'),t1:brs,in:'zoom',out:'whipUp',f(t,u){goal(t,{n:0,col:'#3a2a4a',u:ss(0,1,u)});camPath(u,[1.2,.4,2.6],[.6,.5,2.0],[0,2.2,-2.2],[0,2.6,-2.2],[70,66],.04);fx.draw=K.big('120 ТЫСЯЧ',T('120 тысяч'),brs-.05,'#ffffff',190,.16)}},
{id:'quit',t0:brs,t1:S('s06'),in:'whipUp',out:'whipL',f(t,u){const h=t-brs;goal(t,{n:0,col:'#5a1e22',fall:ss(brs+.1,brs+.7,t)*1.2});camPath(u,[0,1.2,3.2],[0,1.4,2.9],[0,1.6,-2.2],[0,1.5,-2.2],[66,64],0);
 const q=h>0?Math.max(0,1-h/.5):0;cam.position.x+=Math.sin(t*53)*.12*q;cam.position.y+=Math.sin(t*41)*.06*q;if(h>.1){fx.crack={p:[0,1.6,-1.6],a:clamp((h-.1)*3),seed:23};fx.flash=Math.max(0,1-(h-.1)/.25);rS.debris.visible=true}
 fx.draw=K.big('БРОСИЛИ',brs+.1,S('s06')-.05,'#ff5a5a',220,.16)}},
{id:'plan',t0:S('s06'),t1:den,in:'whipL',out:'whipUp',f(t,u){table([1,t>T('на 12 месяцев:')]);top(u,-.5,.2,10.5,8.4,0,0,58);fx.draw=K.big('120 : 12 = 10',T('на 12 месяцев:'),den-.05,'#ffd23f',170,.08)}},
{id:'day',t0:den,t1:S('s07'),in:'whipUp',out:'zoom',f(t,u){table([0,0,1]);top(u,.3,-.3,7.0,5.4,0,1.0,58);fx.draw=K.big('≈ 330 В ДЕНЬ',den+.1,S('s07')-.05,'#7dff9a',150,.08)}},
{id:'ladder',t0:S('s07'),t1:god,in:'zoom',out:'whipR',f(t,u){vine(t,{steps:ss(S('s07'),god-.1,t)*12});putF('smile',-.3,.5,t);const a=lerp(-.6,-.2,u);cam.position.set(.4+Math.sin(a)*4.4,lerp(.8,2.6,ease(u)),-.4+Math.cos(a)*4.4);cam.lookAt(.5,lerp(.8,2.6,ease(u)),-.6);cam.fov=60;cam.updateProjectionMatrix()}},
{id:'reach',t0:god,t1:S('s08'),in:'whipR',out:'whipUp',f(t,u){vine(t,{steps:12,sunset:.15});const k=ease(ss(god,god+.9,t));putF('smile',.75,-.05,t,lerp(.3,1.55,k));camPath(u,[2.6,2.4,3.4],[1.6,2.7,2.8],[.6,2.6,-.8],[.6,2.7,-.8],[58,54],-.02);fx.draw=K.big('ДОТЯНУЛАСЬ!',T('гроздь в руках.'),S('s08')-.05,'#ffd23f',170,.14)}},
{id:'rule',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){goal(t,{n:ss(S('s08'),T('Сделайте первый'),t)*12,col:'#2a5a3a',u:ss(0,1,u)});putF('smile',-.8,-.2,t);const a=lerp(-.25,.12,u);cam.position.set(Math.sin(a)*5.4,lerp(1.6,2.2,u),-2.2+Math.cos(a)*5.4);cam.lookAt(0,1.6,-2.2);cam.fov=64;cam.updateProjectionMatrix();fx.draw=K.big('МАЛЕНЬКИЕ ШАГИ',mal,S('s09')-.05,'#7dff9a',140,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
const BB=Object.values(FX);
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
