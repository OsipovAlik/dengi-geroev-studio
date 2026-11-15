import {kit} from '/lib_ru.js';
// 44 Лебедь, рак и щука: семейный бюджет без общей цели — каждый тянет в свою сторону; одна цель + общий взнос 20%
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,lam,label,canvasTex,sunRig,addSet,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.y=Math.atan2(cam.position.x-p.x,cam.position.z-p.z)};
// ---------- поле с дорогой, прудом и возом
const fg=new THREE.Group();
const gtex=canvasTex(1024,1024,(c,w,h)=>{const R=rng(3);for(let y=0;y<h;y+=64)for(let x=0;x<w;x+=64){const v=R()*30;c.fillStyle=`rgb(${110+v},${178+v*.6},${80+v*.3})`;c.fillRect(x,y,64,64)}c.strokeStyle='rgba(40,80,30,.35)';c.lineWidth=3;for(let i=0;i<60;i++){const x=R()*w,y=R()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+6,y-16);c.moveTo(x+10,y);c.lineTo(x+12,y-14);c.stroke()}},{wrap:true});gtex.repeat.set(8,8);
const ground=plane(120,120,lam('#fff',{map:gtex}),0,0,0,-PI/2);ground.receiveShadow=true;fg.add(ground);
const road=plane(120,2.6,lam('#d9b77a'),0,.015,0,-PI/2);road.receiveShadow=true;fg.add(road);
for(let i=-12;i<=12;i++)fg.add(plane(.5,.08,new THREE.MeshBasicMaterial({color:'#8a6a3a'}),i*5,.02,-1.1,-PI/2));
const pond=new THREE.Mesh(new THREE.CircleGeometry(2.6,40),lam('#3a8fd0'));pond.rotation.x=-PI/2;pond.position.set(.4,.03,-4.2);pond.receiveShadow=true;fg.add(pond);
const pondRim=new THREE.Mesh(new THREE.RingGeometry(2.6,2.75,40),new THREE.MeshBasicMaterial({color:INK}));pondRim.rotation.x=-PI/2;pondRim.position.set(.4,.035,-4.2);fg.add(pondRim);
const TR=rng(9);for(let i=0;i<26;i++){const a=TR()*6.28,r=16+TR()*30;const x=Math.cos(a)*r,z=Math.sin(a)*r-6;if(Math.abs(z)<3)continue;fg.add(cyl(.15,1.2,'#6a4426',x,.6,z));const cone=new THREE.Mesh(new THREE.ConeGeometry(1.1,2.6,7),lam(i%2?'#3f8f4a':'#2f7a3f',{flatShading:true}));cone.position.set(x,2.4,z);cone.castShadow=true;fg.add(cone)}
const cart=new THREE.Group();fg.add(cart);
cart.add(box(2.0,.5,1.2,'#a8642e',0,.85,0),box(2.1,.12,1.3,'#7a4420',0,.62,0),box(1.6,.5,1.0,'#ffd23f',0,1.32,0));
const wheels=[];for(const[x,z]of[[-.7,.68],[.7,.68],[-.7,-.68],[.7,-.68]]){const wgr=new THREE.Group();wgr.position.set(x,.42,z);const wh=cyl(.42,.1,'#5a3418',0,0,0);wh.rotation.x=PI/2;wgr.add(wh);for(let k=0;k<3;k++){const sp=box(.07,.78,.05,'#2a1a10',0,0,z>0?.06:-.06);sp.rotation.z=k*PI/3;wgr.add(sp)}cart.add(wgr);wheels.push(wgr)}
const cartSign=drawn(1.6,.55,(c,w,h)=>{c.fillStyle='#fff';c.strokeStyle=INK;c.lineWidth=10;c.beginPath();c.roundRect(6,6,w-12,h-12,20);c.fill();c.stroke();c.fillStyle='#2a3a5a';c.font=`800 ${h*.5}px Pop`;c.textAlign='center';c.textBaseline='middle';c.fillText('БЮДЖЕТ',w/2,h*.54)},0,.85,.62);cart.add(cartSign);cartSign.rotation.y=0;
fg.add(new THREE.HemisphereLight('#eaf6ff','#8fb070',3.0));sunRig(fg,[14,22,12],[0,0,0],'#fff4dc',2.4,14);
addSet('field',fg);
// ---------- герои басни (своя рисовка)
const swan=drawn(1.9,1.4,(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;c.fillStyle='#ffffff';
 c.beginPath();c.moveTo(w*.12,h*.25);c.quadraticCurveTo(w*.3,h*.05,w*.48,h*.5);c.quadraticCurveTo(w*.7,h*.02,w*.9,h*.22);c.quadraticCurveTo(w*.72,h*.55,w*.5,h*.62);c.quadraticCurveTo(w*.28,h*.55,w*.12,h*.25);c.fill();c.stroke();
 c.beginPath();c.ellipse(w*.5,h*.68,w*.2,h*.12,0,0,7);c.fill();c.stroke();
 c.beginPath();c.moveTo(w*.66,h*.66);c.quadraticCurveTo(w*.82,h*.7,w*.8,h*.5);c.stroke();c.lineWidth=22;c.strokeStyle='#fff';c.stroke();c.lineWidth=11;c.strokeStyle=INK;
 c.beginPath();c.arc(w*.8,h*.47,w*.06,0,7);c.fill();c.stroke();c.fillStyle='#ff8a1f';c.beginPath();c.moveTo(w*.85,h*.44);c.lineTo(w*.95,h*.48);c.lineTo(w*.85,h*.51);c.closePath();c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.arc(w*.8,h*.46,w*.014,0,7);c.fill()},0,0,0);
const crab=drawn(1.4,.9,(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=10;c.fillStyle='#e0452e';
 for(let i=0;i<3;i++){c.beginPath();c.moveTo(w*(.38+i*.1),h*.66);c.lineTo(w*(.32+i*.12),h*.92);c.stroke()}
 c.beginPath();c.ellipse(w*.5,h*.55,w*.24,h*.2,0,0,7);c.fill();c.stroke();
 c.beginPath();c.moveTo(w*.74,h*.55);c.quadraticCurveTo(w*.9,h*.6,w*.94,h*.75);c.stroke();
 for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.12),h*.42);c.lineTo(w*(.5+s*.28),h*.2);c.stroke();c.beginPath();c.ellipse(w*(.5+s*.32),h*.15,w*.09,h*.09,s*.6,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(w*(.5+s*.32),h*.06);c.lineTo(w*(.5+s*.33),h*.15);c.stroke()}
 c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*.38,w*.04,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*.38,w*.016,0,7);c.fill()}},0,0,0);
const pike=drawn(2.0,.8,(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=10;c.fillStyle='#5aa04a';
 c.beginPath();c.moveTo(w*.08,h*.2);c.lineTo(w*.2,h*.5);c.lineTo(w*.08,h*.8);c.lineTo(w*.22,h*.62);c.closePath();c.fill();c.stroke();
 c.beginPath();c.moveTo(w*.2,h*.5);c.quadraticCurveTo(w*.5,h*.12,w*.92,h*.45);c.quadraticCurveTo(w*.5,h*.86,w*.2,h*.5);c.fill();c.stroke();
 c.fillStyle='#3d7a34';for(let i=0;i<5;i++){c.beginPath();c.ellipse(w*(.35+i*.1),h*.45,w*.025,h*.08,0,0,7);c.fill()}
 c.fillStyle='#fff';c.beginPath();c.arc(w*.78,h*.4,w*.035,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.785,h*.4,w*.014,0,7);c.fill();
 c.beginPath();c.moveTo(w*.92,h*.45);c.lineTo(w*.8,h*.52);c.stroke()},0,0,0);
fg.add(swan,crab,pike);
// канаты: цилиндр между двумя точками
const ropes=[0,1,2].map(()=>{const m=cyl(.035,1,'#4a3520',0,0,0);fg.add(m);return m});
const UP=new THREE.Vector3(0,1,0);
const rope=(m,a,b)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b);const d=B.clone().sub(A);m.position.copy(A).add(B).multiplyScalar(.5);m.scale.set(1,d.length(),1);m.quaternion.setFromUnitVectors(UP,d.normalize())};
// mode 'apart' — в разные стороны; 'together' — все вперёд (−x)
const field=(t,mode,cx=0)=>{fg.visible=true;scene.background=SKY;cart.position.set(cx,0,0);wheels.forEach(w=>w.rotation.z=-cx*1.2);
 const flap=Math.sin(t*9)*.08,jig=Math.sin(t*13)*.04;let S,Cr,P;
 if(mode==='apart'){S=[-1.6+cx,3.4+flap,-.6];Cr=[2.6+cx,.42,.5+jig];P=[.4+cx,.32,-4.0+jig]}
 else{S=[-3.6+cx,2.0+flap,-.4];Cr=[-3.3+cx,.42,.8+jig];P=[-3.0+cx,.32,-1.6]}
 swan.position.set(...S);crab.position.set(...Cr);pike.position.set(...P);[swan,crab,pike].forEach(face);
 rope(ropes[0],[cx-.9,1.3,-.3],[S[0]+.2,S[1]-.3,S[2]]);rope(ropes[1],[cx+.9,.9,.4],[Cr[0]-.3,Cr[1]+.1,Cr[2]]);rope(ropes[2],[cx,.9,-.55],[P[0],P[1]+.1,P[2]+.3])};
// ---------- кухня семьи
const rA=K.room('rA','#5a7aa0');
const goal=(txt,col,x,y,z)=>{const g=K.stand(1.9,.62,col,[{t:txt,s:78,y:.54,c:'#15131a'}],x,y,z);rA.g.add(g);return g};
const gCar=goal('← МАШИНА','#7dc4ff',-1.5,3.35,-2.4),gTrip=goal('ОТПУСК →','#ffd23f',1.5,3.35,-2.4),gMel=goal('↓ МЕЛОЧИ','#ff8fb0',0,3.6,-3.6);
const gAll=K.stand(3.6,.9,'#7dff9a',[{t:'ОБЩАЯ ЦЕЛЬ',s:110,y:.54,c:'#15131a'}],0,3.45,-3.0);rA.g.add(gAll);
const n20=K.stand(2.4,1.4,'#ffffff',[{t:'20%',s:240,y:.52,c:'#1f8a4a'},],0,1.75,-2.2);rA.g.add(n20);
const n20cap=K.stand(2.4,.5,'#1f8a4a',[{t:'ДОХОДА — В ОБЩЕЕ',s:52,y:.55,c:'#fff'}],0,.32,-2.18);rA.g.add(n20cap);
const dad=new Puppet('man',2.2),mom=new Puppet('woman',2.05),kid=new Puppet('man',1.55);[dad,mom,kid].forEach(p=>{scene.add(p.m);p.hide()});
const D={col:'#3a6ab0',hair:'#3a2a1a',tie:'#ffd23f'},M={col:'#c4453a',hair:'#7a3a1a'},Kd={col:'#2f9a5a',hair:'#d8a040',tie:'#ff8fb0'};
// ---------- комната «конец месяца»
const rB=K.room('rB','#6a5a8a');
const monthSign=K.stand(3.0,.75,'#fff',[{t:'КОНЕЦ МЕСЯЦА',s:84,y:.54,c:'#3a2a5a'}],0,3.7,-3.9);rB.g.add(monthSign);
const wallet=drawn(2.6,1.7,(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=16;c.fillStyle='#8a4a2a';c.beginPath();c.roundRect(12,h*.18,w-24,h*.76,40);c.fill();c.stroke();c.fillStyle='#a8603a';c.beginPath();c.roundRect(w*.45,h*.38,w*.53,h*.36,30);c.fill();c.stroke();c.fillStyle='#ffd23f';c.beginPath();c.arc(w*.62,h*.56,h*.08,0,7);c.fill();c.stroke()},0,1.15,-2.6);rB.g.add(wallet);
const zero=K.stand(2.2,1.9,'#ffffff',[{t:'0',s:400,y:.55,c:'#c4453a'}],0,2.55,-2.9);rB.g.add(zero);
const tw=K.tower('#3fae5a',-1.4,-2.4);rB.g.add(tw.g);const tw2=K.tower('#3fae5a',.0,-2.4);rB.g.add(tw2.g);
const yearSign=K.stand(2.0,.6,'#fff',[{t:'ЗА ГОД',s:78,y:.54,c:'#1f6a3a'}],1.6,3.4,-3.6);rB.g.add(yearSign);
const dm=new THREE.Matrix4();
const debris=(r,t,t0,cx,cz)=>{const dd=clamp((t-t0)/1.2);r.debris.visible=t>t0;if(t<=t0)return;const R=rng(17);for(let i=0;i<46;i++){const a=R()*6.28,sp=1.5+R()*3.5;const X=cx+Math.cos(a)*sp*dd,Y=clamp(1.5+R()*2+(2.6*dd-3.8*dd*dd),.1,4.1),Z=cz+Math.sin(a)*sp*dd;dm.makeRotationFromEuler(new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4));dm.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));r.debris.setMatrixAt(i,dm)}r.debris.instanceMatrix.needsUpdate=true};
// ---------- стол сверху: семейный план
const tbl=K.makeTable('tbl','СЕМЕЙНЫЙ ПЛАН',[['ОДНА ОБЩАЯ ЦЕЛЬ','решаем вместе'],['ОБЩИЙ ВЗНОС','20% дохода'],['ОСТАЛЬНОЕ','каждому на своё']]);
const coins=[];for(let i=0;i<5;i++){const c=cyl(.32,.12,'#ffc93a',3.2,.07+i*.13,-1.5);c.castShadow=true;tbl.g.add(c);coins.push(c)}
// ---------- город
K.billboard(city.g,'ОДНО ПРАВИЛО','ЧЕРЕЗ 30 СЕКУНД',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','КВАРТЕТ',0,9,24,16,9,'#7dc4ff');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const lrs=T('Лебедь, рак и щука'),rak=T('рак — назад,'),shch=T('щука — в воду.'),trip=T('другой — на отпуск,'),zeroT=T('ноль.'),r20=T('20% дохода.'),y240=T('240 тыс.');
const kitchen=(to,u)=>{resetRoom(rA);rA.col(u,to);[gCar,gTrip,gMel,gAll,n20,n20cap].forEach(m=>m.visible=false)};
const family=(t,apart)=>{const b=blink(t);
 dad.pose(-1.5,-1.4,{expr:apart?'angry':'smile',look:apart?-.8:.2,aL:apart?[1.9,.3]:[.3,.2],propL:apart?'cash':null,lean:apart?-.12:0,...D,blink:b});
 mom.pose(1.5,-1.4,{expr:apart?'angry':'smile',look:apart?.8:-.2,aR:apart?[1.9,.3]:[.3,.2],propR:apart?'card':null,lean:apart?.12:0,...M,blink:b});
 kid.pose(0,-2.4,{expr:apart?'sly':'smile',look:0,aR:apart?[.8,.6]:[.3,.2],propR:apart?'phone':null,...Kd,blink:b})};
const month=(to,u)=>{resetRoom(rB);rB.col(u,to);wallet.visible=false;zero.visible=false;tw.set(0);tw2.set(0);tw.g.visible=tw2.g.visible=false;yearSign.visible=false;monthSign.visible=true};
const top=(u,a0,a1,h0,h1)=>{const a=lerp(a0,a1,u);cam.position.set(Math.sin(a)*.3,lerp(h0,h1,ease(u)),Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(0,0,0);cam.up.set(0,1,0);cam.fov=58;cam.updateProjectionMatrix()};
const shots=[
{id:'hook',t0:0,t1:lrs,out:'whipR',f(t,u){field(t,'apart');camPath(u,[4.5,.7,7.5],[2.6,1.0,5.6],[0,1.6,-1],[0,1.5,-1],[64,56],.04);
 fx.draw=K.hook(['ДВА ДОХОДА,','А ДЕНЕГ НЕТ?'],0,lrs-.05)}},
{id:'heroes',t0:lrs,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){field(t,'apart');const a=lerp(-.5,.5,u);cam.position.set(Math.sin(a)*7,lerp(2.2,3.2,u),Math.cos(a)*7);cam.lookAt(0,1.4,-1.2);cam.fov=60;cam.updateProjectionMatrix();[swan,crab,pike].forEach(face);
 fx.tags=[{txt:'ЛЕБЕДЬ',t:lrs+.05,xy:[.3,.2]},{txt:'РАК',t:lrs+.35,xy:[.72,.36]},{txt:'ЩУКА',t:lrs+.65,xy:[.5,.48]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'swan',t0:S('s03'),t1:rak,in:'whipL',out:'whipR',f(t,u){field(t,'apart');camPath(u,[-1.0,.5,5.2],[-1.6,2.4,4.6],[-.6,1.2,-.5],[-1.4,3.0,-.6],[62,58],-.05);[swan,crab,pike].forEach(face);
 fx.tags=[{txt:'В ОБЛАКА ↑',t:S('s03')+.4,xy:[.32,.18]}]}},
{id:'pull',t0:rak,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){field(t,'apart');linPath(u,[4.8,.6,3.8],[3.2,.9,-1.0],[2.2,.4,.3],[.4,.3,-3.8],[60,64],.03);[swan,crab,pike].forEach(face);
 fx.tags=[{txt:'НАЗАД →',t:rak+.05,xy:[.3,.2]},{txt:'В ВОДУ ↓',t:shch,xy:[.66,.26]}]}},
{id:'stuck',t0:S('s04'),t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){field(t,'apart');const a=lerp(.2,-.9,u);cam.position.set(Math.sin(a)*.5,lerp(13,9,ease(u)),Math.cos(a)*.5-1.2);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(0,0,-1.2);cam.up.set(0,1,0);cam.fov=60;cam.updateProjectionMatrix();
 fx.draw=K.big('0 МЕТРОВ',T('и ныне там.'),S('s05')-.05,'#ff5a5a',190,.14)}},
{id:'dad',t0:S('s05'),t1:trip,in:'zoom',out:'whipR',f(t,u){kitchen('#5a7aa0',0);gCar.visible=gTrip.visible=gMel.visible=true;family(t,true);
 camPath(u,[-2.4,1.3,3.6],[-1.4,1.6,2.6],[-1.2,2.2,-2],[-1.0,2.2,-2.2],[62,56],.04);
 fx.tags=[{txt:'НА МАШИНУ',t:T('один — на машину,'),xy:[.3,.18]}]}},
{id:'mom',t0:trip,t1:S('s06'),in:'whipR',out:'whipL',f(t,u){kitchen('#5a7aa0',0);gCar.visible=gTrip.visible=gMel.visible=true;family(t,true);
 linPath(u,[2.6,1.2,3.6],[-.6,1.3,3.7],[1.0,1.8,-2.2],[-.2,1.8,-2.6],[62,60],-.03);
 fx.tags=[{txt:'НА ОТПУСК',t:trip+.05,xy:[.68,.18]},{txt:'НА МЕЛОЧИ',t:T('третий — на мелочи.'),xy:[.36,.24]}]}},
{id:'zero',t0:S('s06'),t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){const hit=t>zeroT;month(hit?'#8a3a3a':'#6a5a8a',hit?ss(0,.5,(t-zeroT)/1.5):0);wallet.visible=true;zero.visible=hit;
 const k=hit?Math.max(0,1-(t-zeroT)/.5):0;zero.position.y=hit?lerp(4.6,2.55,clamp((t-zeroT)/.18)):4.6;debris(rB,t,zeroT+.15,0,-2.6);
 camPath(u,[1.8,1.0,3.6],[.3,1.6,2.0],[0,1.6,-2.6],[0,2.0,-2.8],[64,56],-.04);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 fx.crack={p:[0,2.2,-2.8],a:hit?clamp((t-zeroT-.15)*3):0,seed:5};fx.flash=hit?Math.max(0,1-(t-zeroT-.15)/.25)*(t>zeroT+.15?1:0):0;
 fx.tags=[{txt:'КАЖДЫЙ — В СВОЮ',t:S('s06')+.1,xy:[.5,.17]}]}},
{id:'plan',t0:S('s07'),t1:r20,in:'whipUp',out:'whipR',f(t,u){tbl.g.visible=true;scene.background=new THREE.Color('#e9c58c');const a=[T('одна общая цель'),T('и общий взнос —')];tbl.hl.forEach((h,i)=>{h.material.opacity=i<2&&t>a[i]?.7:0;h.material.color.set('#7dff9a')});coins.forEach((c,i)=>c.visible=true);
 top(u,-.4,.5,10.5,8.6);fx.draw=K.big('ПРАВИЛО',S('s07')+.05,T('одна общая цель')+.2,'#ffffff',150,.12)}},
{id:'twenty',t0:r20,t1:S('s08'),in:'whipR',out:'zoom',f(t,u){kitchen('#e0b040',ss(0,1,u));gAll.visible=n20.visible=true;family(t,false);dad.pose(-1.9,-1.0,{expr:'smile',look:.4,aR:[1.2,.3],...D,blink:blink(t)});mom.pose(1.9,-1.0,{expr:'smile',look:-.4,aL:[1.2,.3],...M,blink:blink(t)});kid.hide();
 camPath(u,[0,.6,3.6],[0,1.3,2.4],[0,1.4,-2.2],[0,1.5,-2.2],[62,58],0)}},
{id:'year',t0:S('s08'),t1:S('s09'),in:'zoom',out:'whipL',f(t,u){month('#2f7a5a',ss(0,1,u));monthSign.visible=false;yearSign.visible=true;tw.g.visible=tw2.g.visible=true;const n=Math.round(clamp((t-S('s08'))/(y240-S('s08')))*12);tw.set(Math.min(n,6));tw2.set(Math.max(0,n-6));
 const a=lerp(.6,-.2,u);cam.position.set(-.7+Math.sin(a)*4.2,lerp(1.2,2.4,ease(u)),-2.4+Math.cos(a)*4.2);cam.lookAt(-.7,1.6,-2.4);cam.fov=60;cam.updateProjectionMatrix();
 fx.watch={v:n,max:12,x:.74,y:.2,lab:'МЕС'};fx.draw=K.big('240 ТЫС.',y240,S('s09')-.05,'#ffd23f',190,.33)}},
{id:'together',t0:S('s09'),t1:S('s10'),in:'whipL',out:'whipUp',f(t,u){const cx=lerp(2,-3,u);field(t,'together',cx);linPath(u,[cx+5.5,2.2,6.5],[cx+2.5,1.6,5.4],[cx-1.2,1.3,-.5],[cx-1.8,1.2,-.5],[60,56],.03);
 fx.draw=K.big('ВОЗ ЕДЕТ',T('воз едет,'),S('s10')-.05,'#7dff9a',180,.14)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){dad.hide();mom.hide();kid.hide();fg.visible=false;s.f(t,u)}}))};
