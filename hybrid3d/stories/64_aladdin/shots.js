import {kit} from '/lib_ru.js';
// 64 Аладдин («Тысяча и одна ночь»): «новые лампы на старые» — выгодный обмен от чужого; телефон за 30 + доплата 20 = пустая коробка, минус 50; правило: зачем ему моё старое? положи трубку и проверь сам
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
const eyes=(c,w,h,ey,dx,r,mood)=>{c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*ey,w*r,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*ey+(mood==='shock'?0:2),w*r*(mood==='shock'?.3:.5),0,7);c.fill()}};
// ---------- Аладдин (своя рисовка): белая чалма с синим пером, зелёный халат, оранжевый кушак
const ala=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#f4efe4';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*.86,w*.09,h*.1,0,0,7);c.fill();c.stroke()}
 c.fillStyle='#7a4a20';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.12),h*.97,w*.09,h*.025,0,0,7);c.fill();c.stroke()}
 c.fillStyle='#2f9a5a';c.beginPath();c.moveTo(w*.28,h*.78);c.lineTo(w*.34,h*.44);c.lineTo(w*.66,h*.44);c.lineTo(w*.72,h*.78);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ff8a1a';c.fillRect(w*.3,h*.6,w*.4,h*.05);c.strokeRect(w*.3,h*.6,w*.4,h*.05);
 const up=mood==='shock'?1:0;c.fillStyle='#2f9a5a';for(const s of[-1,1]){c.save();c.translate(w*(.5+s*.17),h*.47);c.rotate(s*(up?-2.4:-.25));c.beginPath();c.roundRect(-w*.04,0,w*.08,h*.2,10);c.fill();c.stroke();c.fillStyle='#e8b58a';c.beginPath();c.arc(0,h*.21,w*.045,0,7);c.fill();c.stroke();c.restore();c.fillStyle='#2f9a5a'}
 const hy=.27,hr=.19;c.fillStyle='#e8b58a';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#ffffff';c.beginPath();c.ellipse(w*.5,h*(hy-.085),w*.21,h*.065,0,PI,0);c.lineTo(w*.71,h*(hy-.07));c.lineTo(w*.29,h*(hy-.07));c.closePath();c.fill();c.stroke();
 c.fillStyle='#2f6fc8';c.beginPath();c.ellipse(w*.62,h*(hy-.17),w*.03,h*.05,.5,0,7);c.fill();c.stroke();
 eyes(c,w,h,hy-.01,.075,.05,mood);
 if(mood==='shock'){c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.09),w*.05,h*.035,0,0,7);c.fill()}else{c.beginPath();c.arc(w*.5,h*(hy+.06),w*.07,PI*.15,PI*.85);c.stroke()}};
// ---------- колдун (своя рисовка): высокий, тёмно-фиолетовый халат со звёздами, зелёная чалма с красным камнем, чёрная борода
const mag=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#3a1f5a';c.beginPath();c.moveTo(w*.22,h*.98);c.lineTo(w*.36,h*.42);c.lineTo(w*.64,h*.42);c.lineTo(w*.78,h*.98);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ffd23f';const R=rng(3);for(let i=0;i<9;i++){const x=w*(.34+R()*.32),y=h*(.5+R()*.42);c.beginPath();for(let k=0;k<10;k++){const a=k*PI/5,r=(k%2?.012:.03)*w;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}c.fill()}
 const arm=mood==='shout'?-2.2:-.6;for(const s of[-1,1]){c.save();c.fillStyle='#3a1f5a';c.translate(w*(.5+s*.15),h*.45);c.rotate(s*arm);c.beginPath();c.roundRect(-w*.04,0,w*.08,h*.2,10);c.fill();c.stroke();c.fillStyle='#c89a70';c.beginPath();c.arc(0,h*.21,w*.04,0,7);c.fill();c.stroke();c.restore()}
 const hy=.26,hr=.17;c.fillStyle='#c89a70';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#15131a';c.beginPath();c.moveTo(w*.38,h*(hy+.05));c.quadraticCurveTo(w*.5,h*(hy+.3),w*.62,h*(hy+.05));c.quadraticCurveTo(w*.5,h*(hy+.12),w*.38,h*(hy+.05));c.fill();c.stroke();
 c.fillStyle='#1f8a5a';c.beginPath();c.ellipse(w*.5,h*(hy-.1),w*.22,h*.085,0,PI,0);c.lineTo(w*.72,h*(hy-.08));c.lineTo(w*.28,h*(hy-.08));c.closePath();c.fill();c.stroke();
 c.fillStyle='#e0203a';c.beginPath();c.moveTo(w*.5,h*(hy-.16));c.lineTo(w*.53,h*(hy-.12));c.lineTo(w*.5,h*(hy-.08));c.lineTo(w*.47,h*(hy-.12));c.closePath();c.fill();c.stroke();
 c.lineWidth=9;c.fillStyle='#ffe14a';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.07),h*(hy-.015),w*.045,h*.02,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*(hy-.015),w*.014,0,7);c.fill()}
 c.lineWidth=10;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.12),h*(hy-.055));c.lineTo(w*(.5+s*.03),h*(hy-.035));c.stroke()}
 c.fillStyle='#c89a70';c.beginPath();c.moveTo(w*.5,h*(hy-.01));c.quadraticCurveTo(w*.6,h*(hy+.04),w*.52,h*(hy+.05));c.closePath();c.fill();c.stroke();
 if(mood==='shout'){c.fillStyle='#7a1020';c.beginPath();c.ellipse(w*.5,h*(hy+.1),w*.06,h*.03,0,0,7);c.fill();c.stroke()}
 else{c.fillStyle='#fff';c.beginPath();c.moveTo(w*.42,h*(hy+.085));c.quadraticCurveTo(w*.5,h*(hy+.12),w*.58,h*(hy+.08));c.lineTo(w*.42,h*(hy+.085));c.fill();c.stroke()}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const AL=mk(ala,['happy','shock'],1.25,1.75),MG=mk(mag,['sly','shout'],1.45,2.1);
const BB=[...Object.values(AL),...Object.values(MG)];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.02,z)};
// ---------- лампа: тело, носик, ручка, крышка
const mkLamp=(col,em='#000000')=>{const g=new THREE.Group();const mt=lam(col,{emissive:em});const add=(geo,x,y,z,sx=1,sy=1,sz=1,rz=0)=>{const m=new THREE.Mesh(geo,mt);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.z=rz;m.castShadow=true;g.add(m);return m};
 add(new THREE.SphereGeometry(.3,24,16),0,.16,0,1,.5,.75);add(new THREE.ConeGeometry(.07,.5,14),.42,.24,0,1,1,1,-1.15);add(new THREE.TorusGeometry(.12,.03,8,20),-.36,.2,0,1,1,1,0);
 add(new THREE.SphereGeometry(.13,16,10),0,.27,0,1,.7,1);add(new THREE.SphereGeometry(.04,10,8),0,.37,0);add(new THREE.CylinderGeometry(.12,.15,.07,20),0,.035,0);g.mt=mt;return g};
// ---------- базар
const gB=new THREE.Group();
const sand=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#e8b26a';c.fillRect(0,0,w,h);const R=rng(7);c.strokeStyle='rgba(120,70,20,.5)';c.lineWidth=3;for(let i=0;i<14;i++){const y=R()*h;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w*.3,y+20,w*.6,y-20,w,y);c.stroke()}},{wrap:true});sand.repeat.set(20,20);
const gB0=plane(200,200,lam('#fff',{map:sand}),0,0,0,-PI/2);gB0.receiveShadow=true;gB.add(gB0);
const HC=['#f4e2bf','#f0cf9a','#f6ead2','#e9c08a'];for(let i=-4;i<=4;i++){const w=1.8+(i&1)*.6,h=2.6+((i+9)%3)*.9;const x=i*2.3,z=-5.5-(i&1)*1.2;gB.add(box(w,h,1.6,HC[(i+8)%4],x,h/2,z));gB.add(plane(.6,1.1,lam('#5a2a14'),x,.55,z+.81));if((i+9)%3==1){const d=new THREE.Mesh(new THREE.SphereGeometry(w*.42,20,12,0,PI*2,0,PI/2),lam(i%2?'#2fb0c0':'#ffb020'));d.position.set(x,h,z);d.castShadow=true;gB.add(d)}}
const stall=new THREE.Group();stall.position.set(.3,0,-2.4);gB.add(stall);stall.add(box(2.6,.9,.9,'#8a4a22',0,.45,0));
const awn=canvasTex(512,256,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=i%2?'#fff4e0':'#e0283a';c.fillRect(i*w/8,0,w/8,h)}c.strokeStyle=INK;c.lineWidth=8;c.strokeRect(2,2,w-4,h-4)});
for(const x of[-1.25,1.25])stall.add(box(.08,2.6,.08,'#5a3418',x,1.3,-.4));const aw=plane(2.9,1.1,lam('#fff',{map:awn,side:THREE.DoubleSide}),0,2.6,-.1,-1.0);aw.castShadow=true;stall.add(aw);
const NEW=[];for(let i=0;i<5;i++){const l=mkLamp('#ffcf3a','#4a3000');l.position.set(-1.0+i*.5,.9,.12);l.scale.setScalar(.75);l.rotation.y=.3;stall.add(l);NEW.push(l)}
const signB=K.stand(3.4,.9,'#ffd23f',[{t:'НОВЫЕ ЛАМПЫ',s:84,y:.33,c:'#15131a'},{t:'НА СТАРЫЕ!',s:84,y:.72,c:'#d02a1a'}],.3,3.55,-2.6);gB.add(signB);
const LAN=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),new THREE.MeshBasicMaterial({color:'#ffd36a'}));m.position.set(-6+i*1.5,3.3+Math.sin(i*1.3)*.2,-3.6);gB.add(m);LAN.push(m)}
gB.add(new THREE.HemisphereLight('#fff0d8','#5a3a2a',3.1));sunRig(gB,[-8,10,7],[0,0,-2],'#ffd2a0',2.6,12);addSet('bazaar',gB);
const bazaar=(t,{bg='#ff9a5a'}={})=>{gB.visible=true;aw.visible=true;signB.visible=true;scene.background=new THREE.Color(bg)};
// ---------- пустыня и дворец (дрон)
const gD=new THREE.Group();const dsand=plane(400,400,lam('#fff',{map:sand}),0,0,0,-PI/2);dsand.receiveShadow=true;gD.add(dsand);
const RD=rng(12);for(let i=0;i<14;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(4+RD()*4,20,10,0,PI*2,0,PI/2),lam('#e2a85e'));const a=RD()*PI*2,r=26+RD()*30;d.position.set(Math.cos(a)*r,-1,Math.sin(a)*r);d.scale.y=.35;d.receiveShadow=true;gD.add(d)}
const pal=new THREE.Group();gD.add(pal);pal.add(box(7,2.4,6,'#f6efe0',0,1.2,0));pal.add(box(3.6,1.6,3.6,'#fff8ec',0,3.2,0));
const dome=new THREE.Mesh(new THREE.SphereGeometry(1.9,28,16,0,PI*2,0,PI/2),lam('#2fb0c0'));dome.position.y=4;dome.castShadow=true;pal.add(dome);pal.add(cyl(.12,.8,'#ffd23f',0,6.2,0));
for(const [x,z] of[[-3.2,-2.7],[3.2,-2.7],[-3.2,2.7],[3.2,2.7]]){pal.add(cyl(.38,5.4,'#fff8ec',x,2.7,z));const cn=new THREE.Mesh(new THREE.ConeGeometry(.55,1.3,16),lam('#ffb020'));cn.position.set(x,6.05,z);cn.castShadow=true;pal.add(cn)}
for(let i=0;i<3;i++)pal.add(plane(.9,1.4,lam('#5a2a14'),-2+i*2,.9,3.01));
const DEB=[];const RB=rng(64);for(let i=0;i<26;i++){const b=box(.3+RB()*.4,.3+RB()*.4,.3+RB()*.4,RB()>.5?'#f6efe0':'#2fb0c0',0,0,0);b.userData={a:RB()*PI*2,v:3+RB()*6,up:4+RB()*6,r:RB()*6};gD.add(b);DEB.push(b)}
gD.add(new THREE.HemisphereLight('#fff4e0','#8a5a3a',3.0));sunRig(gD,[-14,22,10],[0,0,0],'#ffe2b0',2.6,16);addSet('desert',gD);
const desert=(t,{gone=0,deb=-1,bg='#ffb46a'}={})=>{gD.visible=true;scene.background=new THREE.Color(bg);pal.visible=gone<1;pal.scale.setScalar(Math.max(.001,1-gone));pal.position.y=gone*9;pal.rotation.y=gone*3;
 DEB.forEach(b=>{b.visible=deb>=0&&deb<2.2;if(!b.visible)return;const d=b.userData;b.position.set(Math.cos(d.a)*(d.r*.3+d.v*deb),Math.max(.15,2.5+d.up*deb-4.9*deb*deb),Math.sin(d.a)*(d.r*.3+d.v*deb));b.rotation.set(deb*4+d.a,deb*3,0)})};
// ---------- дворцовый зал: волшебная лампа на постаменте
const rP=K.room('rP','#2f8f9a');rP.g.add(cyl(.38,1.0,'#f4e4c4',0,.5,-2.6));
const OLD=mkLamp('#9a6a2a','#000000');OLD.position.set(0,1.0,-2.6);OLD.rotation.y=.4;rP.g.add(OLD);
const glow=new THREE.PointLight('#ffcf5a',0,5);glow.position.set(0,1.5,-2.2);rP.g.add(glow);
const halo=plane(1.6,1.6,new THREE.MeshBasicMaterial({map:canvasTex(256,256,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,220,120,1)');g.addColorStop(1,'rgba(255,220,120,0)');c.fillStyle=g;c.fillRect(0,0,w,h)}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),0,1.2,-2.55);rP.g.add(halo);
const maid=new Puppet('woman',1.75);const MD={col:'#d8263f',hair:'#15131a'};scene.add(maid.m);
const hall=(t,{g=0,lx=0,col='#2f8f9a',u=0}={})=>{resetRoom(rP);rP.col(u,col);glow.intensity=g*6;halo.material.opacity=g;halo.lookAt(cam.position);OLD.position.set(lerp(0,-2.2,lx),1.0+Math.sin(lx*PI)*.6,lerp(-2.6,-.2,lx));OLD.rotation.y=.4+lx*3};
// ---------- современная комната: звонок
const rC=K.room('rC','#5a6a9a');const callSign=K.stand(2.4,1.0,'#ffffff',[{t:'«КАРТА УСТАРЕЛА —',s:70,y:.32,c:'#15131a'},{t:'НАЗОВИТЕ КОД»',s:84,y:.7,c:'#d02a1a'}],-.2,2.85,-2.8);rC.g.add(callSign);
const okSign=K.stand(2.4,.8,'#7dff9a',[{t:'ПРОВЕРЮ САМ',s:96,y:.56,c:'#15131a'}],-.2,2.85,-2.8);rC.g.add(okSign);
const man=new Puppet('man',1.8);const MN={col:'#ff8a1a',hair:'#3a2a1a'};scene.add(man.m);
const callRoom=(t,{col='#5a6a9a',u=0,ok=0}={})=>{resetRoom(rC);rC.col(u,col);callSign.visible=!ok;okSign.visible=!!ok};
// ---------- магазин: плакат «сдайте старый»
const rS=K.room('rS','#e8d8f0');const poster=K.stand(3.4,1.5,'#ffd23f',[{t:'СДАЙТЕ СТАРЫЙ',s:80,y:.25,c:'#15131a'},{t:'ТЕЛЕФОН —',s:80,y:.5,c:'#15131a'},{t:'НОВЫЙ СО СКИДКОЙ!',s:70,y:.78,c:'#d02a1a'}],0,2.6,-3.9);rS.g.add(poster);
for(let i=0;i<5;i++){rS.g.add(box(.9,.06,.5,'#ffffff',-1.9+i*.95,1.0,-3.4));rS.g.add(box(.3,.55,.05,'#22242c',-1.9+i*.95,1.3,-3.35))}
const shop=(t,{u=0}={})=>{resetRoom(rS);rS.col(u,'#ffd8a8')};
// ---------- стол сверху: телефон + 20 монет, затем пустая коробка
const tT=K.makeTable('tT','',[]);tT.paper.visible=false;
const phone=new THREE.Group();phone.add(box(.9,.08,1.8,'#22242c',0,.05,0));phone.add(plane(.76,1.55,new THREE.MeshBasicMaterial({map:label(256,520,'#3a4a6a',[{t:'30',s:150,y:.5,c:'#ffffff'}])}),0,.1,0,-PI/2));phone.position.set(-1.3,0,0);tT.g.add(phone);
const COIN=[];for(let k=0;k<10;k++){const c=cyl(.42,.09,'#ffd23f',1.3,.05+k*.1,0);tT.g.add(c);COIN.push(c)}
const tag20=plane(1.2,.6,new THREE.MeshBasicMaterial({map:label(256,128,'#ffffff',[{t:'+20',s:96,y:.55,c:'#15131a'}],{border:INK,bw:8})}),1.3,1.2,1.1,-PI/2);tT.g.add(tag20);
const parcel=new THREE.Group();tT.g.add(parcel);const CB='#c88a4a';parcel.add(box(2.4,.06,2.0,'#5a3a20',0,.04,0));for(const [w,d,x,z] of[[2.4,.08,0,-1.0],[2.4,.08,0,1.0],[.08,2.0,-1.2,0],[.08,2.0,1.2,0]])parcel.add(box(w,1.1,d,CB,x,.55,z));
const flaps=[];for(const s of[-1,1]){const pv=new THREE.Group();pv.position.set(s*1.2,1.1,0);const f=box(1.2,.05,2.0,CB,-s*.6,0,0);pv.add(f);parcel.add(pv);flaps.push([pv,s])}
const table=(t,{mode='pay',open=0,coins=1,bg='#e9c58c'}={})=>{tT.g.visible=true;scene.background=new THREE.Color(bg);const pay=mode==='pay';phone.visible=pay;tag20.visible=pay&&coins>.5;COIN.forEach((c,k)=>c.visible=pay&&k<Math.round(coins*10));parcel.visible=!pay;flaps.forEach(([pv,s])=>pv.rotation.z=s*lerp(0,-2.4,open)*-1)};
// ---------- правило (документ сверху)
const tR=K.makeTable('tR','ПРАВИЛО',[['ЧУЖОЙ САМ ПРЕДЛАГАЕТ?','значит, ваше ценнее'],['ПОЛОЖИТЕ ТРУБКУ','не спорьте, не отвечайте'],['ПРОВЕРЬТЕ САМИ','официальный номер']],'#b58a5e');
const rule=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ВОПРОС-ЗАЩИТА',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ДАЛЬШЕ','КОЩЕЙ',0,9,24,16,9,'#9ad0ff');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const tak=T('Так Аладдин'),lish=T('лишился всего.'),kr=T('Колдун кричал:'),nov=T('«Меняю новые лампы'),vd=T('Во дворце'),sta=T('старую —'),vol=T('волшебную.'),idv=T('И дворец'),isc=T('исчез.'),sd=T('«Сдайте'),otd=T('Отдали телефон'),dop=T('доплатили 20.'),pr=T('Пришла'),m50=T('минус 50.'),zach=T('Зачем ему'),pol=T('Положите трубку'),prv=T('и проверьте сами.'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const alP=(md,x,z,t,y)=>put(AL,md,x,z,t,y);
const manP=(t,o={})=>man.pose(-.6,-2.2,{...MN,expr:'neutral',look:.4,aR:[2.6,2.2],propR:'phone',aL:[.3,.2],blink:blink(t),...o});
const shots=[
{id:'hook',t0:0,t1:tak,out:'whipR',f(t,u){bazaar(t);put(MG,'sly',.4,-2.0,t);signB.visible=false;alP('happy',-.8,-.6,t);camPath(u,[-1.4,.7,2.6],[-.7,.9,1.7],[-.3,1.25,-1.4],[-.3,1.35,-1.5],[62,58],.03);fx.draw=K.hook(['НОВОЕ НА СТАРОЕ —','ВЫГОДНО?'],0,tak-.05)}},
{id:'title',t0:tak,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){const gone=ss(lish-.1,lish+.9,t);desert(t,{gone,bg:gone>.5?'#8a90b0':'#ffb46a'});alP(gone>.3?'shock':'happy',-2.0,10.2,t);camPath(u,[-4.4,1.5,15.8],[-3.6,1.7,15.2],[0,1.4,0],[0,1.9,0],[56,52],.02);fx.draw=K.big('АЛАДДИН',tak+.05,lish,'#ffd23f',170,.14)}},
{id:'promise',t0:S('s02'),t1:kr,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'shout',t0:kr,t1:nov+.4,in:'whipL',out:'whipUp',f(t,u){bazaar(t,{bg:'#ff8a4a'});put(MG,'shout',.4,-2.0,t,Math.abs(Math.sin(t*7))*.05);camPath(u,[1.8,.5,1.8],[.9,1.9,2.6],[.3,1.6,-2.2],[.3,2.4,-2.4],[60,58],-.03)}},
{id:'tray',t0:nov+.4,t1:vd,in:'whipUp',out:'zoom',f(t,u){bazaar(t,{bg:'#ff8a4a'});put(MG,'sly',.4,-2.9,t);NEW.forEach((l,i)=>l.position.y=.9+Math.abs(Math.sin(t*4+i))*.06);aw.visible=false;signB.visible=false;topv(u,-.6,.5,3.0,2.4,.3,.9,-2.3,60)}},
{id:'give',t0:vd,t1:sta,in:'zoom',out:'whipR',f(t,u){hall(t,{g:.3,lx:ss(T('ему отдали'),sta,t)*.8});maid.pose(1.2,-2.2,{...MD,expr:'smile',look:-.6,aL:[1.4,.4],aR:[.3,.2],blink:blink(t)});camPath(u,[2.2,1.3,2.8],[.9,1.5,2.4],[0,1.3,-2.2],[-.6,1.4,-2.0],[60,56],.02)}},
{id:'magic',t0:sta,t1:idv,in:'whipR',out:'whipUp',f(t,u){const g=ss(vol-.2,vol+.4,t);hall(t,{g:.3+g*.9,col:'#ffcf5a',u:g});const k=ease(clamp(u*1.6))*.85+u*.15;linPath(k,[-.9,1.5,-.3],[-.35,1.3,-1.4],[0,1.15,-2.6],[0,1.15,-2.6],[54,46],.02);fx.draw=K.big('ВОЛШЕБНАЯ',vol,idv-.05,'#ffd23f',170,.12)}},
{id:'vanish',t0:idv,t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){const gone=ss(isc-.1,isc+.5,t);desert(t,{gone,deb:t-isc,bg:gone>.3?'#5a6080':'#ffb46a'});alP(gone>.2?'shock':'happy',1.5,10,t);linPath(u,[-16,10,22],[-10,7,19],[0,3,0],[0,3,1],[52,50],.04);shake(t,isc,.5,.9);const h=t-isc;if(h>0){fx.flash=Math.max(0,1-h/.3);fx.crack={p:[0,3,0],a:clamp(h*3),seed:64}}fx.draw=K.big('ИСЧЕЗ!',isc+.05,S('s04')-.05,'#ff5a3a',220,.14)}},
{id:'call',t0:S('s04'),t1:sd,in:'zoom',out:'whipL',f(t,u){callRoom(t);manP(t,{expr:t>T('назовите код».')?'shock':'neutral'});camPath(u,[1.4,1.5,2.2],[.5,1.55,1.5],[-.5,1.6,-2.4],[-.3,1.7,-2.6],[60,58],-.02)}},
{id:'shop',t0:sd,t1:otd,in:'whipL',out:'whipUp',f(t,u){shop(t,{u:u});man.pose(.2,-2.4,{...MN,expr:'smile',look:-.6,aR:[1.0,.6],propR:'phone',aL:[.3,.2],blink:blink(t)});linPath(u,[-1.8,1.5,1.8],[.6,1.5,1.6],[-.6,1.75,-3.6],[0,1.75,-3.6],[60,58],0)}},
{id:'pay',t0:otd,t1:pr,in:'whipUp',out:'zoom',f(t,u){table(t,{coins:ss(dop-.3,dop+.4,t)});topv(u,-.4,.4,6.6,5.9,0,0,0,60);fx.draw=K.big(t<dop?'30':'30 + 20',otd+.6,pr-.05,'#ffffff',200,.13)}},
{id:'box',t0:pr,t1:S('s06'),in:'zoom',out:'whipR',f(t,u){const op=ss(pr+.2,m50-.1,t);table(t,{mode:'box',open:op,bg:t>m50?'#a03040':'#e9c58c'});camPath(u,[1.8,4.4,3.6],[.3,4.2,1.4],[0,.4,0],[0,0,0],[58,54],.02);shake(t,m50,.25,.6);if(t>m50)fx.flash=Math.max(0,.6-(t-m50)*2);fx.draw=K.big('МИНУС 50',m50,S('s06')-.05,'#ff5a3a',200,.14);if(t<m50)fx.tags=[{txt:'ПУСТО',t:T('пустая коробка —')+.2,xy:[.5,.1]}]}},
{id:'rule',t0:S('s06'),t1:zach,in:'whipR',out:'whipL',f(t,u){rule([t>T('чужой сам')-.1,0,0]);topv(u,-.4,.25,10.2,8.4,0,0,0,60)}},
{id:'why',t0:zach,t1:pol,in:'whipL',out:'whipUp',f(t,u){bazaar(t,{bg:'#7a5ac8'});put(MG,'sly',.4,-2.0,t);const a=lerp(.5,-.2,u);cam.position.set(.4+Math.sin(a)*3.0,lerp(1.5,1.7,u),-2.0+Math.cos(a)*3.0);cam.lookAt(.4,1.9,-2.0);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.hook(['ЗАЧЕМ ЕМУ','МОЁ СТАРОЕ?'],zach,pol-.02,['#ffffff','#ffd23f'])}},
{id:'hang',t0:pol,t1:S('s07'),in:'whipUp',out:'whipR',f(t,u){const ok=t>prv-.1;callRoom(t,{col:'#7dff9a',u:ss(pol,prv,t),ok});manP(t,ok?{expr:'smile',aR:[.3,.2],propR:undefined,aL:[.3,.2]}:{expr:'angry',aR:[1.2,.8]});camPath(u,[-1.6,1.5,2.2],[-.6,1.55,1.5],[-.5,1.6,-2.4],[-.3,1.7,-2.6],[60,58],.02)}},
{id:'good',t0:S('s07'),t1:S('s08'),in:'whipR',out:'whipUp',f(t,u){hall(t,{g:1,col:'#ffcf5a',u:1});const a=lerp(-.7,.5,u);cam.position.set(Math.sin(a)*2.4,lerp(1.2,1.5,u),-2.6+Math.cos(a)*2.4);cam.lookAt(0,1.3,-2.6);cam.fov=52;cam.updateProjectionMatrix();fx.draw=K.hook(['ХОРОШИЙ ОБМЕН','НЕ ИЩЕТ ВАС САМ'],S('s07')+.05,S('s08')-.05)}},
{id:'next',t0:S('s08'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){desert(t);alP('happy',0,8.5,t,Math.abs(Math.sin(t*5))*.1);camPath(u,[1.4,.8,12.4],[.6,1.0,11.8],[0,2.2,0],[0,2.6,0],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);maid.hide();man.hide();f.call(this,t,u);[maid,man].forEach(p=>{const q=p.m.position;p.m.rotation.y=Math.atan2(cam.position.x-q.x,cam.position.z-q.z)});BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
