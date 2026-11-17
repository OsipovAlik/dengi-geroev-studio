import {kit} from '/lib_ru.js';
// 48 Петушок (Кот, петух и лиса): мошенники звонят второй раз — «поможем вернуть», за возврат заранее не платят
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- герои (своя рисовка)
const eyes=(c,w,h,y,mood,dx=.09,r=.055)=>{c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*y,w*r,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx+(mood==='sly'?.015:0)),h*(y+.005),w*r*.45,0,7);c.fill()}
 if(mood==='angry'||mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.07)),h*(y-(mood==='sad'?.035:.06)));c.lineTo(w*(.5+s*(dx-.05)),h*(y-(mood==='sad'?.06:.035)));c.stroke()}}
 if(mood==='sly'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.06)),h*(y-.04));c.lineTo(w*(.5+s*(dx-.05)),h*(y-.05));c.stroke()}}};
const mouth=(c,w,h,y,mood)=>{c.lineWidth=10;c.beginPath();if(mood==='shock'){c.fillStyle='#7a1a1a';c.ellipse(w*.5,h*y,w*.05,h*.035,0,0,7);c.fill();c.stroke();return}if(mood==='angry'||mood==='sad')c.arc(w*.5,h*(y+.045),w*.08,PI*1.15,PI*1.85);else if(mood==='sly')c.arc(w*.53,h*(y-.02),w*.08,PI*.12,PI*.72);else c.arc(w*.5,h*(y-.03),w*.09,PI*.15,PI*.85);c.stroke()};
const rooster=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 [['#2f9a5a',.86,.28],['#2a5fc0',.92,.42],['#8a3ac0',.84,.56]].forEach(([col,x,y])=>{c.fillStyle=col;c.beginPath();c.moveTo(w*.62,h*.66);c.quadraticCurveTo(w*x,h*(y-.08),w*(x+.04),h*y);c.quadraticCurveTo(w*(x-.08),h*(y+.14),w*.62,h*.74);c.closePath();c.fill();c.stroke()});
 c.strokeStyle='#e8a820';c.lineWidth=12;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.86);c.lineTo(w*(.5+s*.09),h*.97);c.lineTo(w*(.5+s*.15),h*.98);c.stroke()}c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#e8662a';c.beginPath();c.ellipse(w*.5,h*.7,w*.24,h*.17,0,0,7);c.fill();c.stroke();c.fillStyle='#ffb03a';c.beginPath();c.ellipse(w*.5,h*.74,w*.13,h*.1,0,0,7);c.fill();c.stroke();
 c.fillStyle='#e8242a';[.36,.5,.64].forEach((x,i)=>{c.beginPath();c.arc(w*x,h*(.12-(i===1?.03:0)),w*.08,0,7);c.fill();c.stroke()});
 c.fillStyle='#ffc23a';c.beginPath();c.arc(w*.5,h*.3,w*.24,0,7);c.fill();c.stroke();
 eyes(c,w,h,.26,mood,.1,.06);c.fillStyle='#ffd23f';c.strokeStyle=INK;c.beginPath();c.moveTo(w*.42,h*.34);c.lineTo(w*.58,h*.34);c.lineTo(w*.5,h*.42);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e8242a';c.beginPath();c.ellipse(w*.5,h*.47,w*.045,h*.045,0,0,7);c.fill();c.stroke();if(mood==='shock'){c.fillStyle='#fff';c.font='800 120px Pop';c.textAlign='center';c.fillStyle=INK;c.fillText('!',w*.88,h*.2)}};
const cat=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const fur='#8a93a3';
 c.lineWidth=22;c.beginPath();c.moveTo(w*.72,h*.9);c.quadraticCurveTo(w*.98,h*.8,w*.9,h*.5);c.stroke();c.strokeStyle=fur;c.lineWidth=12;c.stroke();c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle=fur;c.beginPath();c.roundRect(w*.25,h*.5,w*.5,h*.46,w*.18);c.fill();c.stroke();c.fillStyle='#e9edf2';c.beginPath();c.ellipse(w*.5,h*.72,w*.13,h*.13,0,0,7);c.fill();c.stroke();
 c.fillStyle=fur;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.1),h*.12);c.lineTo(w*(.5+s*.25),h*.0);c.lineTo(w*(.5+s*.26),h*.22);c.closePath();c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*.29,w*.27,0,7);c.fill();c.stroke();c.lineWidth=8;for(const s of[-1,1])for(let i=0;i<2;i++){c.beginPath();c.moveTo(w*(.5+s*.27),h*(.27+i*.05));c.lineTo(w*(.5+s*.17),h*(.28+i*.04));c.stroke()}
 for(const s of[-1,1])for(let i=0;i<2;i++){c.beginPath();c.moveTo(w*(.5+s*.1),h*(.38+i*.025));c.lineTo(w*(.5+s*.34),h*(.36+i*.05));c.stroke()}
 c.fillStyle='#f08aa0';c.beginPath();c.moveTo(w*.46,h*.33);c.lineTo(w*.54,h*.33);c.lineTo(w*.5,h*.36);c.closePath();c.fill();c.stroke();eyes(c,w,h,.25,mood,.1);c.strokeStyle=INK;mouth(c,w,h,.41,mood)};
const fox=(mood,fat)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const or='#e8742a';
 c.fillStyle=or;c.beginPath();c.moveTo(w*.72,h*.85);c.quadraticCurveTo(w*1.0,h*.7,w*.92,h*.45);c.quadraticCurveTo(w*.86,h*.72,w*.66,h*.78);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(w*.92,h*.47,w*.05,0,7);c.fill();
 const bw=fat?.3:.2;c.fillStyle=or;c.beginPath();c.roundRect(w*(.5-bw),h*.48,w*bw*2,h*.48,w*.14);c.fill();c.stroke();c.fillStyle='#fff6ea';c.beginPath();c.ellipse(w*.5,h*.66,w*bw*.6,h*.14,0,0,7);c.fill();c.stroke();
 c.fillStyle=or;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.16);c.lineTo(w*(.5+s*.22),h*.0);c.lineTo(w*(.5+s*.24),h*.2);c.closePath();c.fill();c.stroke()}
 c.beginPath();c.moveTo(w*.26,h*.22);c.quadraticCurveTo(w*.5,h*.06,w*.74,h*.22);c.lineTo(w*.5,h*.46);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff6ea';c.beginPath();c.moveTo(w*.36,h*.32);c.lineTo(w*.64,h*.32);c.lineTo(w*.5,h*.46);c.closePath();c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.arc(w*.5,h*.45,w*.03,0,7);c.fill();eyes(c,w,h,.25,mood,.1);c.strokeStyle=INK;c.lineWidth=8;c.beginPath();if(mood!=='sad')c.arc(w*.5,h*.37,w*.06,PI*.2,PI*.8);else c.arc(w*.5,h*.42,w*.06,PI*1.2,PI*1.8);c.stroke();
 if(mood==='sing'||mood==='phone'){c.fillStyle='#1b1d24';c.beginPath();c.roundRect(w*.08,h*.2,w*.13,h*.2,10);c.fill();c.stroke()}};
const mkChars=(g)=>{const o={r:{happy:drawn(1.1,1.3,rooster('happy'),0,0,0),shock:drawn(1.1,1.3,rooster('shock'),0,0,0)},
 c:{happy:drawn(1.25,1.55,cat('happy'),0,0,0),angry:drawn(1.25,1.55,cat('angry'),0,0,0)},
 fx:{sly:drawn(1.7,2.1,fox('sly',false),0,0,0),phone:drawn(1.7,2.1,fox('phone',false),0,0,0),fat:drawn(1.9,2.1,fox('sly',true),0,0,0),sad:drawn(1.7,2.1,fox('sad',false),0,0,0)}};Object.values(o).forEach(v=>Object.values(v).forEach(m=>g.add(m)));return o};
const put=(set,who,mood,x,y,z,t,ph=0)=>{Object.entries(set[who]).forEach(([k,m])=>{m.visible=k===mood;if(k===mood){m.position.set(x,y+Math.abs(Math.sin(t*5+ph))*.03,z);face(m)}})};
const hideAll=(set)=>Object.values(set).forEach(v=>Object.values(v).forEach(m=>m.visible=false));
// ---------- двор с избушкой
const gY=new THREE.Group();
gY.add(Object.assign(plane(200,200,lam('#86c45a'),0,0,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<24;i++){const R=rng(300+i);const a=i/24*PI*2+R()*.2,r=10+R()*6;if(Math.sin(a)>.4)continue;const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0));const cr=new THREE.Mesh(new THREE.ConeGeometry(1.6+R(),4.4,7),lam(i%3?'#2f8a4a':'#47a84a'));cr.position.y=3.7;cr.castShadow=true;tr.add(cr);tr.position.set(Math.cos(a)*r,0,Math.sin(a)*r-3);gY.add(tr)}
const logTex=canvasTex(512,512,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=i%2?'#a8693a':'#b8783f';c.fillRect(0,i*h/8,w,h/8);c.strokeStyle=INK;c.lineWidth=5;c.beginPath();c.moveTo(0,i*h/8);c.lineTo(w,i*h/8);c.stroke()}});
const hut=new THREE.Group();hut.position.set(0,0,-1.2);gY.add(hut);
const walls=new THREE.Mesh(new THREE.BoxGeometry(3.4,2.4,3),lam('#fff',{map:logTex}));walls.position.y=1.2;walls.castShadow=walls.receiveShadow=true;hut.add(walls);
const roofM=lam('#c83a2a');for(const s of[-1,1]){const r=box(2.1,.14,3.4,roofM,s*.85,3.0,0);r.rotation.z=-s*.62;hut.add(r)}
const gable=new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-1.7,0),new THREE.Vector2(1.7,0),new THREE.Vector2(0,1.25)])),lam('#b8783f',{side:THREE.DoubleSide}));gable.position.set(0,2.4,1.51);hut.add(gable);
const winBg=plane(1.2,1.05,new THREE.MeshBasicMaterial({color:'#2a2a4a'}),0,1.35,1.52);hut.add(winBg);
[[0,1.9,1.55,1.5,.14],[0,.8,1.55,1.5,.14]].forEach(([x,y,z,w,h])=>hut.add(box(w,h,.12,'#f3e2b0',x,y,z)));[-.68,.68].forEach(x=>hut.add(box(.14,1.2,.12,'#f3e2b0',x,1.35,1.55)));
for(const s of[-1,1]){const sh=box(.5,1.1,.06,'#3a8ac0',s*1.0,1.35,1.58);hut.add(sh)}
hut.add(box(.9,1.7,.08,'#6a4428',1.15,.85,1.53));
const Y=mkChars(gY);
gY.add(new THREE.HemisphereLight('#ffffff','#9a8a6a',3.1));sunRig(gY,[-8,20,10],[0,0,0],'#fff1d9',2.6,12);addSet('yard',gY);
const yard=(t)=>{gY.visible=true;scene.background=SKY;hideAll(Y)};
// ---------- комната с телефоном
const rP=K.room('rP','#2a3a6a');
const phone=new THREE.Group();phone.position.set(0,2.0,-2.6);rP.g.add(phone);phone.add(box(2.2,3.9,.22,'#1b1d24',0,0,0));
const scr=(top,num,col,ns=200)=>{const m=plane(1.95,3.55,new THREE.MeshBasicMaterial({map:canvasTex(512,930,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(0,0,w,110);c.fillStyle='#fff';c.font='800 60px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(top,w/2,230,w-40);c.font=`800 ${ns}px Pop`;c.fillText(num,w/2,480,w-30);
 c.fillStyle='#e8342a';c.beginPath();c.arc(w*.3,790,62,0,7);c.fill();c.fillStyle='#2fbf5a';c.beginPath();c.arc(w*.7,790,62,0,7);c.fill()})}),0,0,.12);phone.add(m);return m};
const screens={ring:scr('ВХОДЯЩИЙ','«ВЕРНЁМ»','#2f6fd0',110),stolen:scr('СО СЧЁТА','−100','#d03a3a'),help:scr('ПОМОЖЕМ ВЕРНУТЬ','10%','#8a3ac0'),end:scr('ЗВОНОК','СБРОШЕН','#1f9a6a',105)};
const P1=mkChars(rP.g);
const phoneRoom=(t,which,to,u,foxMood)=>{resetRoom(rP);rP.col(u||0,to||'#2a3a6a');Object.entries(screens).forEach(([k,m])=>m.visible=k===which);hideAll(P1);if(foxMood)put(P1,'fx',foxMood,1.75,1.05,-1.6,t,2)};
// ---------- комната потерь
const rM=K.room('rM','#3a2a4a');
const bar=box(1.4,1,1,'#e04a3a',-.6,.5,-2.4);rM.g.add(bar);const bar2=box(1.4,1,1,'#9a1a2a',1.4,.5,-2.4);rM.g.add(bar2);
const l100=K.stand(1.4,.8,'#fff',[{t:'−100',s:150,y:.55,c:'#d02a1a'}],-.6,0,-2.4);const l10=K.stand(1.4,.8,'#fff',[{t:'−10',s:160,y:.55,c:'#9a1a2a'}],1.4,0,-2.4);rM.g.add(l100,l10);
const P2=mkChars(rM.g);
const dm=new THREE.Matrix4();
const debris=(r,t,t0,cx,cz)=>{const dd=clamp((t-t0)/1.2);r.debris.visible=t>t0;if(t<=t0)return;const R=rng(31);for(let i=0;i<46;i++){const a=R()*6.28,sp=1.5+R()*3.5;const X=cx+Math.cos(a)*sp*dd,Y=clamp(1.2+R()*2+(2.6*dd-3.8*dd*dd),.1,4.1),Z=cz+Math.sin(a)*sp*dd;dm.makeRotationFromEuler(new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4));dm.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));r.debris.setMatrixAt(i,dm)}r.debris.instanceMatrix.needsUpdate=true};
const mroom=(t,k1,drop,to,u,foxMood)=>{resetRoom(rM);rM.col(u||0,to||'#3a2a4a');const hh=Math.max(.01,k1*3.0);bar.scale.y=hh;bar.position.y=hh/2;l100.visible=k1>.02;l100.position.y=hh+.5;
 bar2.visible=l10.visible=drop!==null;if(drop!==null){const rh=.3;bar2.scale.y=rh;bar2.position.y=rh/2+drop;l10.position.y=rh+.5+drop}
 hideAll(P2);if(foxMood)put(P2,'fx',foxMood,-2.1,1.05,-1.2,t,2)};
// ---------- стол сверху: телефон и правило
const tA=K.makeTable('tA','ЕСЛИ ЗВОНЯТ «ВЕРНУТЬ»',[['НЕ ПЛАТИТЬ ЗАРАНЕЕ','за возврат денег'],['ПОЛОЖИТЬ ТРУБКУ','не спорить'],['ПОЗВОНИТЬ САМОМУ','номер с карты']]);
const tph=new THREE.Group();tph.position.set(3.4,0,-.6);tA.g.add(tph);tph.add(box(1.3,.12,2.4,'#1b1d24',0,.07,0));
const tScr=(top,col)=>{const m=plane(1.12,2.15,new THREE.MeshBasicMaterial({map:canvasTex(256,500,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font='800 40px Pop';c.textAlign='center';c.textBaseline='middle';top.forEach((l,i)=>c.fillText(l,w/2,170+i*70,w-20))})}),0,.135,0,-PI/2);tph.add(m);return m};
const tsR=tScr(['ВХОДЯЩИЙ','«ВЕРНЁМ','ДЕНЬГИ»'],'#8a3ac0'),tsE=tScr(['ЗВОНОК','СБРОШЕН'],'#1f9a6a');
const card=new THREE.Group();card.position.set(3.4,0,2.0);tA.g.add(card);card.add(box(1.7,.05,1.1,'#2a5fc0',0,.04,0));card.add(plane(1.6,1.0,new THREE.MeshBasicMaterial({map:canvasTex(320,200,(c,w,h)=>{c.fillStyle='#2a5fc0';c.fillRect(0,0,w,h);c.fillStyle='#ffd23f';c.fillRect(24,60,50,38);c.fillStyle='#fff';c.font='800 26px Pop';c.textAlign='left';c.fillText('НОМЕР БАНКА —',24,140);c.fillText('НА ОБОРОТЕ',24,176)})}),0,.07,0,-PI/2));
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col,end)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')});tsR.visible=!end;tsE.visible=!!end};
// ---------- город
K.billboard(city.g,'ВТОРОЙ ЗВОНОК?','ТА ЖЕ ЛИСА',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ТЕРЕМОК',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const zv=T('и вдруг звонят:'),nz=T('А назавтра лиса'),ok=T('снова под окном —'),sk=T('потом звонят:'),pv=T('«Поможем вернуть.'),vz=T('Нужен взнос — 10%».'),pr=T('просят ещё 10.'),zp=T('Заплатили —'),m110=T('минус 110.'),again=T('И лиса придёт снова.'),pt=T('Положите трубку'),nk=T('по номеру с карты.');
let FLAT=false;const BB=[...[Y,P1,P2].flatMap(o=>Object.values(o).flatMap(v=>Object.values(v)))];
const shots=[
{id:'hook',t0:0,t1:zv,out:'whipR',f(t,u){phoneRoom(t,'stolen','#5a2a3a',0);camPath(u,[.8,1.4,3.4],[.3,1.7,2.2],[0,2.0,-2.6],[0,2.0,-2.6],[70,62],.03);
 fx.draw=K.hook(['ВАС УЖЕ ОБМАНУЛИ?','А ТЕПЕРЬ — «ВЕРНЁМ»'],0,S('s02')-.05)}},
{id:'ring',t0:zv,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){phoneRoom(t,'ring','#2a3a6a',0,'phone');const a=lerp(.7,-.1,u);cam.position.set(.9+Math.sin(a)*3.6,lerp(1.3,1.6,u),-1.8+Math.cos(a)*3.6);cam.lookAt(.8,1.7,-2.1);cam.fov=68;cam.updateProjectionMatrix();
 cam.position.x+=Math.sin(t*40)*.015;fx.draw=K.hook(['ВАС УЖЕ ОБМАНУЛИ?','А ТЕПЕРЬ — «ВЕРНЁМ»'],0,S('s02')-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'save',t0:S('s03'),t1:nz,in:'whipL',out:'whipR',f(t,u){yard(t);const k=ease(clamp((t-S('s03'))/1.6));put(Y,'c','angry',lerp(-2.4,-.7,k),.78,1.8,t,0);put(Y,'r','shock',lerp(-2.1,-.35,k),1.35,1.9,t,1);put(Y,'fx','sad',lerp(.9,3.2,k),1.05,2.1,t,2);
 camPath(u,[-2.0,1.6,7.2],[0,1.4,6.4],[-.3,1.2,1.8],[.3,1.2,1.8],[60,58],.04*(1-u));fx.tags=[{txt:'КОТ СПАС ПЕТУШКА',t:S('s03')+.1,xy:[.5,.15]}]}},
{id:'window',t0:nz,t1:S('s04'),in:'whipR',out:'zoom',f(t,u){yard(t);put(Y,'r',t<ok+.6?'happy':'shock',0,1.3,.38,t,1);put(Y,'fx','sly',1.55,1.05,1.4,t,2);
 camPath(u,[2.8,.7,5.8],[.9,1.2,3.2],[.6,1.3,.8],[.2,1.35,.4],[60,52],-.03);fx.tags=[{txt:'«ВЫГЛЯНИ В ОКОШКО!»',t:ok,xy:[.5,.15]}]}},
{id:'stolen',t0:S('s04'),t1:sk,in:'zoom',out:'whipL',f(t,u){phoneRoom(t,'stolen','#5a2a3a',ss(0,1,u),'fat');camPath(u,[-1.5,1.1,3.4],[-.6,1.5,2.6],[0,1.8,-2.4],[.2,1.8,-2.4],[70,64],.03);
 fx.tags=[{txt:'МОШЕННИКИ ТАК ЖЕ',t:S('s04')+.05,xy:[.5,.15]},{txt:'СНАЧАЛА УКРАЛИ',t:T('Сначала украли,'),xy:[.5,.22]}]}},
{id:'help',t0:sk,t1:S('s05'),in:'whipL',out:'whipUp',f(t,u){phoneRoom(t,t<pv?'ring':'help','#4a2a6a',ss(0,1,u),'phone');const a=lerp(-.6,.35,u);cam.position.set(.8+Math.sin(a)*4.6,lerp(1.2,1.5,u),-1.9+Math.cos(a)*4.6);cam.lookAt(.6,1.9,-2.2);cam.fov=68;cam.updateProjectionMatrix();
 fx.tags=t>vz?[{txt:'ВЗНОС 10%',t:vz,xy:[.5,.15]}]:[]}},
{id:'lost',t0:S('s05'),t1:m110,in:'whipUp',out:'whipR',f(t,u){const k1=ss(S('s05'),S('s05')+.6,t);const drop=t<pr?null:(t<zp?2.6:2.6*(1-ss(zp,zp+.3,t)));mroom(t,k1,drop,'#5a2a3a',ss(0,1,u),'sly');
 camPath(u,[-2.2,1.2,3.4],[-1.0,1.6,2.9],[-.2,1.6,-2.2],[.2,1.6,-2.3],[70,64],-.03);fx.tags=[{txt:'ПРОПАЛО 100',t:S('s05')+.1,xy:[.3,.15]},...(t>pr?[{txt:'ПРОСЯТ ЕЩЁ 10',t:pr,xy:[.68,.21]}]:[])]}},
{id:'impact',t0:m110,t1:again,in:'whipR',out:'whipL',f(t,u){const h=t-m110-.15;mroom(t,1,0,h>0?'#8a2a2a':'#5a2a3a',ss(0,.5,Math.max(0,h)),'fat');if(h>0)debris(rM,t,m110+.17,.4,-2.4);
 const k=h>0?Math.max(0,1-h/.5):0;camPath(u,[1.0,1.0,3.6],[.4,1.4,2.8],[.4,1.4,-2.4],[.4,1.5,-2.4],[72,64],.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>0){fx.crack={p:[.4,.1,-2.4],a:clamp(h*3),seed:7};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('−110',m110+.1,again-.05,'#ff5a5a',260,.15)}},
{id:'again',t0:again,t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){yard(t);const k=ease(u);put(Y,'fx','sly',lerp(4,.9,k),1.05,lerp(3.5,1.9,k),t,2);put(Y,'r','shock',0,1.3,.38,t,1);
 const a=lerp(.9,.2,u);cam.position.set(Math.sin(a)*9,lerp(7,5.5,u),-1.2+Math.cos(a)*9);cam.lookAt(.5,.8,.2);cam.fov=56;cam.updateProjectionMatrix();fx.tags=[{txt:'ЛИСА ПРИДЁТ СНОВА',t:again+.05,xy:[.5,.15]}]}},
{id:'rule',t0:S('s06'),t1:pt,in:'whipUp',out:'zoom',f(t,u){table([t>T('за возврат денег'),0,0],'#ffb0a0');top(u,-.5,.3,11,9,.6,0,58);
 fx.draw=K.big('ЗАРАНЕЕ — НЕ ПЛАТИТЬ',T('заранее не платят.'),pt-.05,'#ffffff',110,.13)}},
{id:'hang',t0:pt,t1:nk,in:'zoom',out:'whipR',f(t,u){phoneRoom(t,t<pt+.5?'ring':'end','#2a6a4a',ss(0,1,u));camPath(u,[0,1.9,1.4],[.4,1.8,3.0],[0,2.0,-2.6],[0,2.0,-2.6],[60,66],-.02);
 fx.tags=t>T('и сами позвоните в банк')?[{txt:'ЗВОНИТЕ САМИ',t:T('и сами позвоните в банк'),xy:[.5,.15]}]:[]}},
{id:'card',t0:nk,t1:S('s07'),in:'whipR',out:'whipL',f(t,u){table([1,1,1],'#7dff9a',true);top(u,.4,-.3,6.5,5.4,3.3,1.2,56);fx.draw=K.big('НОМЕР С КАРТЫ',nk+.05,S('s07')-.05,'#ffffff',130,.13)}},
{id:'sum',t0:S('s07'),t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){yard(t);const k=ease(clamp((t-S('s07'))/2));put(Y,'c','angry',1.0,.78,1.4,t,0);put(Y,'r','happy',0,1.3,.38,t,1);put(Y,'fx','sad',lerp(2.4,6,k),1.05,lerp(2.4,3.6,k),t,2);
 const a=lerp(-.5,.3,u);cam.position.set(Math.sin(a)*6.5,lerp(1.5,2.1,u),.4+Math.cos(a)*6.5);cam.lookAt(.6,1.2,.8);cam.fov=60;cam.updateProjectionMatrix();
 fx.draw=K.big('ВТОРОЙ ЗВОНОК = ЛИСА',T('второй звонок —'),S('s08')-.05,'#ffd23f',110,.13)}},
{id:'next',t0:S('s08'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){FLAT=false;f.call(this,t,u);if(!FLAT)BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
