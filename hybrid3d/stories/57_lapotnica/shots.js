import {kit} from '/lib_ru.js';
// 57 Лиса-лапотница: «доплатите за приз» — лестница доплат 10 → 20 → 40 → 80 = 150, а приза нет; правило: за выигрыш не платят, первая просьба доплатить — уже обман
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x=0,y=0,z=0)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
const BB=[];const mk=(w,h,d)=>{const m=drawn(w,h,d);scene.add(m);m.visible=false;BB.push(m);return m};
// ---------- лиса (своя рисовка): зелёный сарафан, платок
const fox=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#f07a1e';c.beginPath();c.moveTo(w*.62,h*.82);c.quadraticCurveTo(w*.98,h*.78,w*.92,h*.5);c.quadraticCurveTo(w*.86,h*.66,w*.6,h*.72);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.9,h*.53,w*.05,h*.04,.4,0,7);c.fill();
 c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.1)-w*.05,h*.82,w*.1,h*.16,12);c.fill();c.stroke()}
 c.fillStyle='#2f9a4a';c.beginPath();c.moveTo(w*.36,h*.5);c.lineTo(w*.64,h*.5);c.lineTo(w*.74,h*.86);c.lineTo(w*.26,h*.86);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ffd23f';for(let i=0;i<3;i++){c.beginPath();c.arc(w*(.38+i*.12),h*.8,w*.025,0,7);c.fill()}
 const hy=.3,hr=.27;c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.1),h*(hy-hr*.55));c.lineTo(w*(.5+s*.27),h*(hy-hr*1.45));c.lineTo(w*(.5+s*.3),h*(hy-hr*.2));c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.moveTo(w*(.5+s*.2),h*(hy-hr*.75));c.lineTo(w*(.5+s*.265),h*(hy-hr*1.25));c.lineTo(w*(.5+s*.27),h*(hy-hr*.6));c.fill();c.fillStyle='#f07a1e'}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#fff3e0';c.beginPath();c.moveTo(w*.25,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.2),w*.75,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.1),w*.25,h*(hy+.02));c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.07),w*.04,h*.022,0,0,7);c.fill();
 c.lineWidth=10;const ey=hy-.03;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*ey,w*.06,h*.035,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.11+.015),h*(ey+.004),w*.025,0,7);c.fill()}
 if(mood==='sly'){c.fillStyle='#f07a1e';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.11),h*(ey-.016),w*.068,h*.024,0,PI,0);c.fill();c.stroke()}}
 c.lineWidth=9;c.beginPath();if(mood==='shout'){c.fillStyle='#8a1a1a';c.ellipse(w*.5,h*(hy+.13),w*.06,h*.03,0,0,7);c.fill();c.stroke()}else{c.moveTo(w*.42,h*(hy+.115));c.quadraticCurveTo(w*.5,h*(hy+.14),w*.6,h*(hy+.1));c.stroke()}};
const FX={};['smile','sly','shout'].forEach(md=>{FX[md]=mk(1.25,1.85,fox(md))});
const putF=(md,x,z,t,y=0)=>{const m=FX[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.025,z)};
// ---------- курица, гусь, баран
const henD=(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle='#e8a020';c.lineWidth=9;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.78);c.lineTo(w*(.5+s*.1),h*.97);c.stroke()}c.strokeStyle=INK;c.lineWidth=10;
 c.fillStyle='#b5651d';c.beginPath();c.ellipse(w*.5,h*.6,w*.3,h*.2,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(w*.22,h*.55);c.lineTo(w*.08,h*.36);c.lineTo(w*.26,h*.46);c.closePath();c.fill();c.stroke();
 c.beginPath();c.arc(w*.68,h*.32,w*.14,0,7);c.fill();c.stroke();c.fillStyle='#e8322a';c.beginPath();c.arc(w*.64,h*.17,w*.05,0,7);c.arc(w*.72,h*.16,w*.05,0,7);c.fill();c.stroke();
 c.fillStyle='#ffb020';c.beginPath();c.moveTo(w*.8,h*.3);c.lineTo(w*.93,h*.34);c.lineTo(w*.8,h*.38);c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.71,h*.3,w*.025,0,7);c.fill()};
const gooseD=(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle='#ff8a20';c.lineWidth=10;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.45+s*.07),h*.8);c.lineTo(w*(.45+s*.09),h*.97);c.stroke()}c.strokeStyle=INK;c.lineWidth=10;
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.42,h*.68,w*.3,h*.15,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(w*.6,h*.62);c.quadraticCurveTo(w*.74,h*.45,w*.64,h*.25);c.lineTo(w*.74,h*.22);c.quadraticCurveTo(w*.84,h*.45,w*.72,h*.66);c.closePath();c.fill();c.stroke();
 c.beginPath();c.arc(w*.7,h*.2,w*.09,0,7);c.fill();c.stroke();c.fillStyle='#ff8a20';c.beginPath();c.moveTo(w*.78,h*.18);c.lineTo(w*.95,h*.22);c.lineTo(w*.78,h*.25);c.closePath();c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.72,h*.18,w*.02,0,7);c.fill()};
const ramD=(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=10;c.fillStyle=INK;for(const x of[.3,.42,.58,.7]){c.beginPath();c.roundRect(w*x-w*.03,h*.7,w*.06,h*.28,8);c.fill()}
 c.fillStyle='#f4f1e8';for(let i=0;i<9;i++){const a=i/9*PI*2;c.beginPath();c.arc(w*(.48+Math.cos(a)*.22),h*(.58+Math.sin(a)*.12),w*.11,0,7);c.fill();c.stroke()}c.beginPath();c.ellipse(w*.48,h*.58,w*.24,h*.14,0,0,7);c.fill();
 c.fillStyle='#3a3a3a';c.beginPath();c.ellipse(w*.8,h*.42,w*.11,h*.12,.2,0,7);c.fill();c.stroke();c.strokeStyle='#c8a060';c.lineWidth=16;c.beginPath();c.arc(w*.74,h*.36,w*.08,PI*.8,PI*2.4);c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(w*.83,h*.4,w*.025,0,7);c.fill()};
const hens=[0,1,2].map(()=>mk(.8,.8,henD)),geese=[0,1].map(()=>mk(1.0,1.1,gooseD)),ram=mk(1.5,1.3,ramD);
const carryHen=mk(.6,.6,henD),carryGoose=mk(.75,.8,gooseD);
// ---------- лапоть (3D)
const lapot=new THREE.Group();{const b=box(.7,.18,.3,'#d8b46a',0,.09,0);lapot.add(b);for(let i=0;i<6;i++){const s=box(.03,.19,.31,'#8a6a2a',-.3+i*.12,.095,0);s.rotation.y=.5;lapot.add(s)}lapot.add(box(.2,.12,.3,'#c8a45a',.3,.22,0))}
// ---------- двор
const gY=new THREE.Group();
gY.add(Object.assign(plane(200,200,lam('#8ad06a'),0,0,0,-PI/2),{receiveShadow:true}));
const straw=new THREE.Mesh(new THREE.CircleGeometry(1.6,24),lam('#e8c060'));straw.rotation.x=-PI/2;straw.position.set(0,.02,-.6);straw.receiveShadow=true;gY.add(straw);
const izba=new THREE.Group();izba.position.set(-4.2,0,-4);gY.add(izba);izba.add(box(4,2.8,3.4,'#a8703a',0,1.4,0));for(let i=0;i<7;i++)izba.add(box(4.04,.05,3.44,'#5a3a1a',0,.2+i*.4,0));
{const r=new THREE.Mesh(new THREE.ConeGeometry(3.2,1.8,4),lam('#7a4a2a'));r.position.set(0,3.7,0);r.rotation.y=PI/4;r.castShadow=true;izba.add(r)}izba.add(box(.8,.8,.06,'#ffe08a',.8,1.6,1.72));izba.add(box(.9,1.6,.06,'#5a3a1a',-.9,.8,1.72));
const coop=box(1.8,1.3,1.4,'#c0442a',2.4,.65,-2.6);gY.add(coop);gY.add(K.stand(1.6,.45,'#fff',[{t:'КУРЯТНИК',s:70,y:.55,c:'#15131a'}],2.4,1.6,-1.88));
for(let i=0;i<16;i++){gY.add(box(.12,1,.12,'#9a6a34',-7+i*.95,.5,-7.2))}gY.add(box(15,.08,.1,'#9a6a34',0,.8,-7.2));
for(let i=0;i<10;i++){const R=rng(500+i);const x=(i%2?1:-1)*(9+R()*12),z=-30+i*5;const tr=new THREE.Mesh(new THREE.SphereGeometry(1+R()*.8,10,8),lam(i%3?'#3a8a3a':'#2a7a3a'));tr.position.set(x,1.4,z);tr.castShadow=true;gY.add(tr);gY.add(box(.25,1.4,.25,'#6a4a2a',x,.7,z))}
gY.add(lapot);
gY.add(new THREE.HemisphereLight('#fff6e0','#5a7a4a',3.1));sunRig(gY,[-8,18,10],[0,0,-1],'#fff1d0',2.6,16);addSet('yard',gY);
const yard=(t,{lap=1}={})=>{gY.visible=true;scene.background=new THREE.Color('#9ad8ff');lapot.visible=lap>0;lapot.position.set(0,0,-.6);lapot.rotation.y=.4};
// ---------- лестница доплат
const gS=new THREE.Group();
gS.add(Object.assign(plane(200,200,lam('#5a4a6a'),0,0,0,-PI/2),{receiveShadow:true}));
const VALS=[10,20,40,80],CUM=[10,30,70,150];const steps=[],stepTags=[];
VALS.forEach((v,i)=>{const s=box(2.6,1,1.6,['#ffd23f','#ff9a3a','#ff5a3a','#d8222a'][i],0,0,-i*1.6);gS.add(s);steps.push(s);
 const tg=K.stand(1.3,.6,'#fff',[{t:String(v),s:150,y:.56,c:'#15131a'}],0,0,-i*1.6+.82);gS.add(tg);stepTags.push(tg)});
const prize=new THREE.Group();gS.add(prize);
{prize.add(box(1.2,.9,1.2,'#e8322a',0,.45,0));prize.add(box(.2,.92,1.22,'#ffd23f',0,.45,0));prize.add(box(1.22,.92,.2,'#ffd23f',0,.45,0));
 const hole=plane(1.1,1.1,new THREE.MeshBasicMaterial({color:'#1a0f14'}),0,.905,0,-PI/2);prize.add(hole)}
const lid=new THREE.Group();prize.add(lid);lid.position.set(0,.9,-.6);{const l=box(1.3,.14,1.3,'#e8322a',0,.07,.6);lid.add(l);lid.add(box(.22,.16,1.32,'#ffd23f',0,.07,.6));lid.add(box(1.32,.16,.22,'#ffd23f',0,.07,.6))}
const prizeTag=K.stand(1.4,.5,'#ffd23f',[{t:'ПРИЗ',s:110,y:.56,c:'#15131a'}],0,1.7,.2);prize.add(prizeTag);
const vic=new Puppet('man',1.9);scene.add(vic.m);
gS.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gS,[-6,20,8],[0,0,-3],'#fff1d9',2.4,16);addSet('stairs',gS);
const stairs=(t,{n=0,grow=[],open=0,sky=0}={})=>{gS.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#3a2a4a'),sky);
 let top=0;VALS.forEach((v,i)=>{const g=i<n?1:(grow[i]||0);const H=Math.max(.001,CUM[i]*.05*ease(g));steps[i].visible=g>0;steps[i].scale.y=H;steps[i].position.y=H/2;stepTags[i].visible=g>.5;stepTags[i].position.y=Math.max(.4,H-.5);if(g>0)top=H});
 prize.position.set(0,CUM[3]*.05,-3*1.6);prize.visible=true;lid.rotation.x=-open*2.2;lid.position.y=.9+open*.3;return top};
// ---------- приманка-сообщение (комната)
const rM=K.room('rM','#5f8c9e');
rM.g.add(box(2.4,.9,1.2,'#b07a44',0,.45,-2.2));
const parcel=new THREE.Group();parcel.position.set(-.4,.9,-2.2);rM.g.add(parcel);parcel.add(box(.8,.6,.8,'#e8322a',0,.3,0));parcel.add(box(.14,.62,.82,'#ffd23f',0,.3,0));parcel.add(K.stand(.9,.32,'#ffd23f',[{t:'ПРИЗ',s:90,y:.56,c:'#15131a'}],0,.95,.1));
const msg=K.stand(1.5,1.2,'#ffffff',[{t:'ВЫ ВЫИГРАЛИ!',s:52,y:.22,c:'#15131a'},{t:'ОПЛАТИТЕ',s:58,y:.5,c:'#e8322a'},{t:'ДОСТАВКУ: 10',s:58,y:.76,c:'#e8322a'}],.6,1.55,-1.7,0,'#15131a');rM.g.add(msg);
const room=(t,{col='#5f8c9e',u=0}={})=>{resetRoom(rM);rM.col(u,col)};
// ---------- правило сверху
const tR=K.makeTable('tR','ПРАВИЛО',[['ЗА ВЫИГРЫШ НЕ ПЛАТЯТ','ни доставку, ни налог'],['1-Я ДОПЛАТА = ОБМАН','стоп на первом лапте'],['10+20+40+80 = 150','а приза нет']]);
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- город
K.billboard(city.g,'КАК ОСТАНОВИТЬ','ЛЕСТНИЦУ ДОПЛАТ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ГЕНЗЕЛЬ И ГРЕТЕЛЬ',0,9,24,16,9,'#ff9a6a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const eto=T('Это'),ate=T('«куры съели —'),g2=T('Гуся — к баранам:'),c20=T('20,'),c40=T('40.'),c80=T('уже 80,'),all=T('всего 150.'),net=T('А приза нет.'),first=T('Первая просьба');
const HOOK=['ПРОСЯТ','ДОПЛАТИТЬ','ЗА ПРИЗ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:eto,out:'whipR',f(t,u){room(t);vic.pose(-.9,-1.0,{expr:t>T('а просят ещё?')?'shock':'smile',look:.6,aR:[1.3,1.4],aL:[.2,.2],propR:'phone',blink:blink(t)});camPath(u,[-.2,.6,3.4],[.2,.9,2.4],[-.2,1.5,-2.2],[0,1.6,-2.2],[64,56],.03);fx.draw=K.hook(HOOK,0,eto-.05)}},
{id:'fox',t0:eto,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){yard(t);putF('sly',.9,.4,t);linPath(u,[-2.6,.9,4.4],[-1.0,1.1,4.0],[.6,1.1,-.4],[1.0,1.2,-.4],[56,52],.02);fx.draw=K.big('ЛИСА-ЛАПОТНИЦА',eto+.05,S('s02')-.05,'#ff9a3a',140,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'lapot',t0:S('s03'),t1:ate,in:'whipL',out:'whipR',f(t,u){yard(t);topv(u,-.6,.4,4.2,2.6,0,0,-.6,56);fx.tags=[{txt:'ЛАПОТЬ',t:S('s03')+.2,xy:[.5,.12]}]}},
{id:'demand',t0:ate,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){yard(t,{lap:0});putF('shout',-.6,.2,t);hens.forEach((h,i)=>{h.visible=true;h.position.set(.8+i*.7,0,-1.2+i*.3)});camPath(u,[-2.2,.5,3.4],[-1.4,.6,2.8],[0,.9,-.6],[.2,.9,-.6],[60,56],-.03);fx.draw=K.big('«ОТДАЙТЕ КУРОЧКУ!»',T('отдайте курочку!»'),S('s04')-.05,'#ffd23f',130,.16)}},
{id:'goose',t0:S('s04'),t1:g2,in:'whipUp',out:'whipL',f(t,u){yard(t,{lap:0});putF('shout',-.4,0,t);carryHen.visible=true;carryHen.position.set(-.1,.55,.3);geese.forEach((g,i)=>{g.visible=true;g.position.set(1.0+i*.9,0,-1.0-i*.4)});const a=lerp(-.5,.3,u);cam.position.set(.4+Math.sin(a)*4,lerp(1.4,.9,u),-.4+Math.cos(a)*4);cam.lookAt(.4,.9,-.4);cam.fov=58;cam.updateProjectionMatrix();fx.tags=[{txt:'КУРОЧКА → ГУСЬ',t:S('s04')+.1,xy:[.5,.12]}]}},
{id:'ram',t0:g2,t1:S('s05'),in:'whipL',out:'zoom',f(t,u){yard(t,{lap:0});putF('shout',-.6,.2,t);carryGoose.visible=true;carryGoose.position.set(-.2,.45,.5);ram.visible=true;ram.position.set(1.0,0,-.6);camPath(u,[1.8,3.2,4.4],[.8,1.2,3.4],[.2,.8,-.4],[.2,1.0,-.4],[58,56],.02);fx.tags=[{txt:'ГУСЬ → БАРАН',t:g2+.1,xy:[.5,.12]}]}},
{id:'step10',t0:S('s05'),t1:c20,in:'zoom',out:'whipUp',f(t,u){stairs(t,{grow:[ss(S('s05')+.1,S('s05')+.6,t)]});vic.pose(-.35,1.3,{expr:'neutral',look:-.3,aR:[1.2,1.4],propR:'phone',aL:[.2,.2],blink:blink(t)});camPath(u,[1.6,.8,5.0],[1.0,1.0,4.4],[-.4,.6,0],[-.2,.8,-.4],[60,56],.03);fx.draw=K.big('−10',T('10,'),c20-.05,'#ffd23f',240,.16)}},
{id:'step40',t0:c20,t1:S('s06'),in:'whipUp',out:'whipR',f(t,u){const top=stairs(t,{n:1,grow:[1,ss(c20-.1,c20+.3,t),ss(c40-.1,c40+.3,t)]});vic.pose(-.4,1.6,{expr:'shock',look:-.3,aR:[1.2,1.4],propR:'phone',aL:[.2,.2],blink:blink(t)});camPath(u,[-4.2,1.2,4.6],[-4.6,3.4,2.4],[0,1.0,-1.6],[0,2.6,-2.6],[60,58],.02);fx.draw=K.big(t<c40?'−20':'−40',t<c40?c20:c40,t<c40?c40-.02:S('s06')-.05,t<c40?'#ff9a3a':'#ff5a3a',240,.16)}},
{id:'step80',t0:S('s06'),t1:all,in:'whipR',out:'whipL',f(t,u){stairs(t,{n:3,grow:[1,1,1,ss(c80-.15,c80+.35,t)],sky:.3});const a=lerp(-.9,-.2,u);cam.position.set(Math.sin(a)*12,lerp(5,8,u),-2.4+Math.cos(a)*12);cam.lookAt(0,lerp(3,4.5,u),-2.6);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('−80',c80,all-.05,'#ff3a3a',240,.16)}},
{id:'total',t0:all,t1:net,in:'whipL',out:'whipUp',f(t,u){stairs(t,{n:4,sky:.5});putF('sly',.6,-4.6,t,7.5);camPath(u,[2.4,9.4,1.8],[1.4,9.0,.6],[0,7.8,-4.8],[0,7.9,-4.8],[60,56],-.03);fx.draw=K.big('ВСЕГО −150',all+.05,net-.05,'#ff5a5a',170,.16)}},
{id:'empty',t0:net,t1:S('s07'),in:'whipUp',out:'zoom',f(t,u){stairs(t,{n:4,open:ss(net+.05,net+.4,t),sky:.6});topv(u,-.3,.5,4.2,3.0,0,7.5,-4.8,58);shake(t,net+.1,.2,.6);const h=t-net;if(h>.1){fx.crack={p:[0,8.4,-4.8],a:clamp((h-.1)*3),seed:57};fx.flash=Math.max(0,1-(h-.1)/.25)}fx.draw=K.big('ПРИЗА НЕТ',net+.1,S('s07')-.05,'#ffffff',190,.16)}},
{id:'hold',t0:S('s07'),t1:S('s08'),in:'zoom',out:'whipR',f(t,u){stairs(t,{n:4,sky:.6});vic.pose(-.6,1.6,{expr:'shock',look:-.2,aR:[.3,.3],aL:[.3,.3],blink:blink(t)});putF('sly',.6,-4.6,t,7.5);camPath(u,[-1.4,.4,4.8],[-1.0,.5,4.2],[0,3.2,-3],[0,4.6,-3.6],[66,62],.02);fx.draw=K.big('ЖАЛКО БРОСИТЬ…',S('s07')+.05,S('s08')-.05,'#ffd23f',150,.16)}},
{id:'rule',t0:S('s08'),t1:first,in:'whipR',out:'whipUp',f(t,u){table([t>T('за выигрыш'),0,0]);topv(u,-.4,.25,10.2,8.4,0,0,0,58)}},
{id:'stop',t0:first,t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){stairs(t,{n:1});vic.pose(lerp(-.4,-1.8,u),lerp(1.6,2.6,u),{expr:'smile',look:-1,aL:[.2,.2],aR:[.2,.2],walk:Math.sin(t*8),blink:blink(t)});camPath(u,[1.4,1.0,4.6],[.8,1.2,4.4],[-.6,1.0,1.4],[-1.2,1.1,2.0],[58,56],-.02);fx.draw=K.big('СТОП НА 1-М ШАГЕ',first+.05,S('s09')-.05,'#7dff9a',140,.16)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);vic.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
