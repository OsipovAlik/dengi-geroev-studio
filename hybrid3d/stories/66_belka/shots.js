import {kit} from '/lib_ru.js';
// 66 Белка («Сказка о царе Салтане», Пушкин): золотые орешки — деньги, которые работают; 1000 под подушкой за 5 лет = 1000, на вкладе под 10% годовых с капитализацией ≈ 1610; правило: отложенные деньги не держать дома — пусть приносят доход в надёжном банке
// Цветовая идея: холодный серо-синий (деньги лежат) → золото (деньги работают)
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Белка (своя рисовка): рыжая, большая круглая голова, кисточки на ушах, пышный хвост, золотой орешек в лапах
const sq=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const F='#e8762a',B='#fff1dc';
 // хвост
 c.fillStyle='#d8601c';c.beginPath();c.moveTo(w*.55,h*.9);c.bezierCurveTo(w*1.02,h*.95,w*1.02,h*.35,w*.82,h*.2);c.bezierCurveTo(w*.7,h*.08,w*.56,h*.2,w*.66,h*.3);c.bezierCurveTo(w*.84,h*.45,w*.78,h*.75,w*.55,h*.78);c.closePath();c.fill();c.stroke();
 // тело
 c.fillStyle=F;c.beginPath();c.ellipse(w*.45,h*.72,w*.2,h*.22,0,0,7);c.fill();c.stroke();
 c.fillStyle=B;c.beginPath();c.ellipse(w*.45,h*.75,w*.11,h*.15,0,0,7);c.fill();c.stroke();
 c.fillStyle=F;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.45+s*.11),h*.95,w*.09,h*.035,0,0,7);c.fill();c.stroke()}
 // голова
 const hy=.3,hr=.2;c.fillStyle=F;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.45+s*.08),h*(hy-.12));c.lineTo(w*(.45+s*.17),h*(hy-.27));c.lineTo(w*(.45+s*.2),h*(hy-.08));c.closePath();c.fill();c.stroke();c.fillStyle='#3a1a0a';c.beginPath();c.moveTo(w*(.45+s*.17),h*(hy-.27));c.lineTo(w*(.45+s*.13),h*(hy-.33));c.lineTo(w*(.45+s*.21),h*(hy-.31));c.closePath();c.fill();c.fillStyle=F}
 c.beginPath();c.arc(w*.45,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle=B;c.beginPath();c.ellipse(w*.45,h*(hy+.06),w*.11,h*.06,0,0,7);c.fill();
 c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.45+s*.08),h*(hy-.01),w*.05,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.45+s*.08),h*hy,w*.025,0,7);c.fill()}
 c.beginPath();c.arc(w*.45,h*(hy+.04),w*.025,0,7);c.fill();
 if(mood==='sad'){c.beginPath();c.arc(w*.45,h*(hy+.13),w*.05,PI*1.15,PI*1.85);c.stroke()}else{c.beginPath();c.arc(w*.45,h*(hy+.07),w*.06,PI*.15,PI*.85);c.stroke();c.fillStyle='#fff';c.fillRect(w*.43,h*(hy+.09),w*.04,h*.03);c.strokeRect(w*.43,h*(hy+.09),w*.04,h*.03)}
 // лапы и орешек
 const up=mood==='win';c.lineWidth=11;
 if(up){for(const s of[-1,1]){c.save();c.translate(w*(.45+s*.15),h*.56);c.rotate(s*-2.4);c.fillStyle=F;c.beginPath();c.roundRect(-w*.035,0,w*.07,h*.15,10);c.fill();c.stroke();c.restore()}}
 c.fillStyle='#ffd23f';c.beginPath();c.ellipse(w*.45,up?h*.36:h*.6,w*.075,h*.055,0,0,7);c.fill();c.stroke();c.strokeStyle='#b8860b';c.lineWidth=5;c.beginPath();c.moveTo(w*.45,(up?h*.36:h*.6)-h*.05);c.lineTo(w*.45,(up?h*.36:h*.6)+h*.05);c.stroke();c.strokeStyle=INK;c.lineWidth=11;
 if(!up){c.fillStyle=F;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.45+s*.07),h*.62,w*.045,h*.035,0,0,7);c.fill();c.stroke()}}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const SQ=mk(sq,['happy','win','sad'],1.3,1.7);
const BB=[...Object.values(SQ)];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.6))*.03,z)};
const man=new Puppet('man',1.85);scene.add(man.m);const MAN={col:'#5a7aa8',hair:'#3a2a1a'};
const nutMesh=(s=1)=>{const g=new THREE.Group();const a=new THREE.Mesh(new THREE.SphereGeometry(.5,24,18,0,PI*2,0,PI/2),lam('#ffd23f',{side:THREE.DoubleSide}));a.scale.set(1,1.2,1);a.castShadow=true;const b=a.clone();b.rotation.x=PI;g.add(a,b);g.userData={a,b};g.scale.setScalar(s);return g};
// ---------- хрустальный терем белки: зал, где цвет уходит в золото
const rH=K.room('rH','#4a6a8a');
const ped=new THREE.Group();ped.position.set(0,0,-2.2);ped.add(cyl(.8,.9,'#e8eef4',0,.45,0));ped.add(cyl(.9,.1,'#ffd23f',0,.92,0));rH.g.add(ped);
const pile=[];const RP=rng(66);for(let i=0;i<24;i++){const n=nutMesh(.22);const a=RP()*PI*2,r=.6+RP()*1.6;n.position.set(Math.cos(a)*r,.13,-2.2+Math.sin(a)*r*.6+.6);n.rotation.set(RP(),RP(),RP());rH.g.add(n);pile.push(n)}
const glass=[];for(const x of[-2.2,2.2]){const p=plane(1.2,3.4,new THREE.MeshBasicMaterial({color:'#bfefff',transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false}),x,1.8,-3.2);rH.g.add(p);glass.push(p)}
const sgH=K.stand(2.8,.7,'#ffd23f',[{t:'КАЗНА',s:96,y:.56,c:'#15131a'}],0,3.6,-3.9);rH.g.add(sgH);
const hall=(t,u=0,sg=1)=>{resetRoom(rH);rH.col(u,'#ffb020');sgH.visible=!!sg};
// ---------- остров: билборды
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО ОРЕШКОВ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ДАЛЬШЕ','БУРАТИНО',0,9,24,16,9,'#ff9a5a');
// ---------- монетный двор (сверху): орешек раскрывается, скорлупа — в монету, ядро — изумруд
const gM=new THREE.Group();gM.add(Object.assign(plane(60,60,lam('#1f5a3a'),0,0,0,-PI/2),{receiveShadow:true}));
const NUT=nutMesh(2.2);NUT.position.y=1.4;gM.add(NUT);
const emer=new THREE.Mesh(new THREE.OctahedronGeometry(.7,0),lam('#2fe08a',{flatShading:true}));emer.position.y=1.4;emer.castShadow=true;gM.add(emer);
const coins=[];const RC=rng(7);for(let i=0;i<14;i++){const c=cyl(.42,.08,'#ffd23f',0,0,0);c.userData={a:i/14*PI*2+RC()*.3,r:2.2+RC()*1.2};gM.add(c);coins.push(c)}
const stampC=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.12,40),[lam('#ffd23f'),new THREE.MeshLambertMaterial({map:label(256,256,'#ffd23f',[{t:'1',s:180,y:.55,c:'#8a5a00'}],{border:'#8a5a00',bw:10})}),lam('#ffd23f')]);stampC.position.set(0,.07,0);stampC.castShadow=true;gM.add(stampC);
gM.add(new THREE.HemisphereLight('#fff','#2a4a3a',3.0));sunRig(gM,[-5,14,6],[0,0,0],'#fff1d9',2.5,8);addSet('mint',gM);
const mint=(t,{open=0,cn=0,st=0}={})=>{gM.visible=true;scene.background=new THREE.Color('#123a26');NUT.visible=true;NUT.userData.a.position.x=open*.9;NUT.userData.b.position.x=-open*.9;NUT.userData.a.rotation.z=-open*.6;NUT.userData.b.rotation.z=open*.6;emer.visible=open>0.05;emer.rotation.y=t*1.5;emer.scale.setScalar(Math.max(.001,open));
 coins.forEach((c,i)=>{const k=clamp(cn*14-i);c.visible=k>0;const d=c.userData;c.position.set(Math.cos(d.a)*d.r,.05+(1-k)*2,Math.sin(d.a)*d.r)});stampC.visible=st>0;stampC.scale.setScalar(Math.max(.001,st))};
// ---------- казна растёт: башни монет
const rT=K.room('rT','#b08a3a');const TW=[-1.8,-.6,.6,1.8].map((x,i)=>{const tw=K.tower('#ffd23f',x,-2.4);rT.g.add(tw.g);return tw});
const treasury=(t,g)=>{resetRoom(rT);rT.col(1,'#ffcf5a');TW.forEach((tw,i)=>tw.set(Math.round(clamp(g*1.3-i*.1)*(4+i*2))))};
// ---------- дом зрителя: подушка, под ней купюра
const rD=K.room('rD','#6a7a90');
const bed=new THREE.Group();bed.position.set(-.6,0,-2.4);bed.add(box(2.6,.5,1.6,'#5a3a2a',0,.25,0));bed.add(box(2.5,.25,1.5,'#e8eef4',0,.62,0));rD.g.add(bed);
const pillow=box(1.1,.32,.8,'#ffffff',-1.6,.9,-2.4);rD.g.add(pillow);
const bill=plane(1.2,.6,new THREE.MeshLambertMaterial({map:label(400,200,'#a8d8a0',[{t:'1000',s:120,y:.55,c:'#1f4a1f'}],{border:'#1f4a1f',bw:10}),side:THREE.DoubleSide}),-1.6,.76,-1.85,-PI/2);rD.g.add(bill);
const sgD=K.stand(2.4,.7,'#ffffff',[{t:'ДОМА',s:96,y:.56,c:'#15131a'}],1.4,3.4,-3.9);rD.g.add(sgD);
const home=(t,{u=0,sh=1,lift=0}={})=>{resetRoom(rD);rD.col(u,'#3a4a5e');bill.scale.setScalar(Math.max(.001,sh));pillow.position.y=.9+lift*.6;pillow.rotation.z=lift*.3};
// ---------- сравнение: подушка и вклад по годам
const gC=new THREE.Group();gC.add(Object.assign(plane(200,200,lam('#2a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const towP=K.tower('#9fb0c4',-1.4,-2.0),towV=K.tower('#ffd23f',1.4,-2.0);gC.add(towP.g,towV.g);
const labP=K.stand(1.9,.6,'#ffffff',[{t:'ПОДУШКА',s:74,y:.56,c:'#15131a'}],-1.4,.0,-1.2),labV=K.stand(1.9,.6,'#ffd23f',[{t:'ВКЛАД',s:80,y:.56,c:'#15131a'}],1.4,.0,-1.2);labP.position.set(-1.4,3.7,-2.0);labV.position.set(1.4,3.7,-2.0);gC.add(labP,labV);
gC.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gC,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('compare',gC);
const YRS=[1000,1100,1210,1331,1464,1611];
const compare=(t,{p=1,v=-1}={})=>{gC.visible=true;scene.background=new THREE.Color('#9ab8ff').lerp(new THREE.Color('#ffd98a'),clamp(v/5));towP.set(p?6:0);towV.g.visible=v>=0;towV.set(v<0?0:Math.round(6*YRS[Math.round(clamp(v,0,5))]/1000))};
// ---------- правило
const tR=K.makeTable('tR','ПРАВИЛО',[['НЕ ДЕРЖИТЕ ДОМА','отложенные деньги'],['ПУСТЬ ПРИНОСЯТ ДОХОД','проценты на проценты'],['В НАДЁЖНОМ БАНКЕ','где вклады застрахованы']],'#b58a5e');
const rule=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#ffd23f')})};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const ub=T('У белки из сказки'),up=T('У Пушкина'),or=T('орешки:'),sk=T('скорлупки золотые,'),ya=T('ядра — изумруд.'),izs=T('Из скорлупок'),lm=T('льют монету.'),kd=T('каждый день,'),ik=T('и казна'),an=T('А наши деньги'),de=T('дешевеют.'),ty=T('Тысяча'),c5=T('через 5 лет —'),tz=T('та же тысяча.'),nv=T('На вкладе'),p10=T('под 10% годовых,'),sp=T('с процентами'),o16=T('около 1600.'),ne=T('не держите дома —'),pd=T('пусть приносят доход'),vn=T('в надёжном банке.'),pk=T('Пусть каждый орешек'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:ub,out:'whipR',f(t,u){hall(t,0,0);put(SQ,'sad',0,-2.2,t,.97);camPath(u,[-1.2,.6,2.2],[-.5,.7,1.5],[0,2.1,-2.2],[0,2.15,-2.2],[62,58],.03);fx.draw=K.hook(['ДЕНЬГИ ЛЕЖАТ','И НЕ РАСТУТ?'],0,ub-.05)}},
{id:'belka',t0:ub,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){hall(t,ss(ub,ub+1.2,t));put(SQ,'happy',0,-2.2,t,.97);camPath(u,[-1.6,.7,2.4],[-.6,1.0,1.4],[0,1.6,-2.2],[0,1.7,-2.2],[60,54],.03);fx.draw=K.big('БЕЛКА',ub+.1,S('s02')-.05,'#ffd23f',200,.14)}},
{id:'promise',t0:S('s02'),t1:up,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'pushkin',t0:up,t1:sk,in:'zoom',out:'whipL',f(t,u){hall(t,1);put(SQ,'happy',0,-2.2,t,.97);const a=lerp(-.9,.5,u);cam.position.set(Math.sin(a)*3.2,lerp(1.0,1.6,u),-2.2+Math.cos(a)*3.2);cam.lookAt(0,1.6,-2.2);cam.fov=56;cam.updateProjectionMatrix();fx.tags=[{txt:'ПУШКИН',t:up+.1,xy:[.5,.12]}]}},
{id:'nut',t0:sk,t1:izs,in:'whipL',out:'whipUp',f(t,u){mint(t,{open:ss(ya-.1,ya+.5,t)});topv(u,-.7,.7,9.5,8.2,0,0,0,58);fx.tags=[{txt:'ЗОЛОТО',t:sk,xy:[.5,.12]},{txt:'ИЗУМРУД',t:ya,xy:[.5,.18]}]}},
{id:'coins',t0:izs,t1:S('s04'),in:'whipUp',out:'whipR',f(t,u){mint(t,{open:1,cn:ss(izs,lm+.6,t),st:ss(lm,lm+.3,t)});const a=lerp(.3,-.5,u);cam.position.set(Math.sin(a)*5.5,lerp(3.0,2.2,ease(u)),Math.cos(a)*5.5);cam.lookAt(0,.3,0);cam.fov=56;cam.updateProjectionMatrix();shake(t,lm+.1,.08,.4);fx.draw=K.big('МОНЕТА',lm,S('s04')-.05,'#ffd23f',190,.13)}},
{id:'grow',t0:S('s04'),t1:S('s05'),in:'whipR',out:'zoom',f(t,u){treasury(t,u);linPath(u,[-2.0,1.4,3.6],[1.4,2.2,3.0],[0,1.4,-2.4],[0,1.8,-2.4],[60,56],0);fx.draw=K.big('РАСТЁТ САМА',ik,S('s05')-.05,'#ffffff',150,.13)}},
{id:'home',t0:S('s05'),t1:de,in:'zoom',out:'whipL',f(t,u){home(t,{lift:ss(an,an+.6,t)});man.pose(.9,-1.6,{...MAN,expr:'neutral',look:-.6,aL:[.3,.2],aR:[.3,.2],blink:blink(t)});camPath(u,[1.6,1.3,2.4],[.4,1.5,1.4],[-1.0,1.0,-2.2],[-1.4,.9,-2.2],[58,52],-.02)}},
{id:'cheap',t0:de,t1:ty,in:'whipL',out:'whipUp',f(t,u){const h=t-de-.2;home(t,{u:ss(de,de+.6,t),sh:1-.5*ss(de+.1,de+.7,t),lift:1});man.pose(.9,-1.6,{...MAN,expr:'shock',look:-.6,aL:[1.6,1.2],aR:[1.6,1.2],blink:0});topv(u,-.3,.2,3.4,2.8,-1.6,.8,-1.85,58);shake(t,de+.2,.3,.6);if(h>0){fx.flash=Math.max(0,1-h/.25);fx.crack={p:[-1.6,.78,-1.85],a:clamp(h*3),seed:66}}fx.draw=K.big('ДЕШЕВЕЮТ',de+.15,ty-.05,'#ff5a3a',170,.14)}},
{id:'pillow',t0:ty,t1:nv,in:'whipUp',out:'whipR',f(t,u){compare(t,{p:1,v:-1});camPath(u,[-3.0,2.0,4.2],[-2.0,2.4,3.4],[-1.0,2.2,-2.0],[-1.0,2.2,-2.0],[56,54],.02);fx.draw=K.big(t<tz?'1000':'ТА ЖЕ 1000',ty+.05,nv-.05,'#ffffff',t<tz?240:170,.14);fx.tags=[{txt:'5 ЛЕТ',t:c5,xy:[.5,.4]}]}},
{id:'deposit',t0:nv,t1:S('s07'),in:'whipR',out:'whipL',f(t,u){const v=ss(sp-.2,o16,t)*5;compare(t,{p:1,v});camPath(u,[0,2.6,6.2],[1.2,3.2,5.4],[0,2.0,-2.0],[.4,2.2,-2.0],[58,56],0);const y=YRS[Math.round(clamp(v,0,5))];fx.draw=K.big(t<p10?'ВКЛАД':(t<o16?String(y):'≈ 1600'),nv+.05,S('s07')-.05,t<p10?'#ffffff':'#ffd23f',t<p10?190:260,.14);fx.tags=[{txt:'10% В ГОД',t:p10,xy:[.5,.4]}]}},
{id:'rule',t0:S('s07'),t1:pk,in:'whipL',out:'zoom',f(t,u){rule([t>ne-.1,t>pd-.1,t>vn-.1]);topv(u,-.4,.25,10.2,8.4,0,0,0,60)}},
{id:'nut1',t0:pk,t1:S('s09'),in:'zoom',out:'whipUp',f(t,u){mint(t,{open:0});const a=lerp(-.6,.4,u);cam.position.set(Math.sin(a)*6.0,lerp(2.2,2.8,u),Math.cos(a)*6.0);cam.lookAt(0,1.2,0);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.hook(['ПУСТЬ ОРЕШЕК','РАБОТАЕТ'],pk+.05,S('s09')-.05)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){hall(t,1);put(SQ,'win',0,-2.2,t,.97+Math.abs(Math.sin(t*5))*.08);camPath(u,[1.4,.9,1.6],[.6,1.1,1.0],[0,1.6,-2.2],[0,1.7,-2.2],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);man.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
