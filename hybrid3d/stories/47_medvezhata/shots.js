import {kit} from '/lib_ru.js';
// 47 Два жадных медвежонка: посредник «поможет поделить» и съест всё комиссиями; спрашивай, сколько дойдёт
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- герои (своя рисовка)
const eyes=(c,w,h,y,mood,dx=.09)=>{c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*y,w*.055,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx+(mood==='sly'?.015:0)),h*(y+.005),w*.024,0,7);c.fill()}
 if(mood==='angry'||mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.07)),h*(y-(mood==='sad'?.035:.06)));c.lineTo(w*(.5+s*(dx-.05)),h*(y-(mood==='sad'?.06:.035)));c.stroke()}}
 if(mood==='sly'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.06)),h*(y-.04));c.lineTo(w*(.5+s*(dx-.05)),h*(y-.05));c.stroke()}}};
const mouth=(c,w,h,y,mood)=>{c.lineWidth=10;c.beginPath();if(mood==='angry'||mood==='sad')c.arc(w*.5,h*(y+.045),w*.08,PI*1.15,PI*1.85);else if(mood==='sly')c.arc(w*.53,h*(y-.02),w*.08,PI*.12,PI*.72);else c.arc(w*.5,h*(y-.03),w*.09,PI*.15,PI*.85);c.stroke()};
const cub=(fur,mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const muz='#e2b884';
 c.fillStyle=fur;c.beginPath();c.roundRect(w*.22,h*.5,w*.56,h*.46,w*.2);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*.74,w*.15,h*.13,0,0,7);c.fill();c.stroke();
 c.fillStyle=fur;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.22),h*.12,w*.09,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*.3,w*.27,0,7);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*.38,w*.12,h*.07,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*.35,w*.04,h*.022,0,0,7);c.fill();eyes(c,w,h,.26,mood);c.strokeStyle=INK;mouth(c,w,h,.41,mood)};
const fox=(mood,fat)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const or='#e8742a';
 c.fillStyle=or;c.beginPath();c.moveTo(w*.72,h*.85);c.quadraticCurveTo(w*1.0,h*.7,w*.92,h*.45);c.quadraticCurveTo(w*.86,h*.72,w*.66,h*.78);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(w*.92,h*.47,w*.05,0,7);c.fill();
 const bw=fat?.3:.2;c.fillStyle=or;c.beginPath();c.roundRect(w*(.5-bw),h*.48,w*bw*2,h*.48,w*.14);c.fill();c.stroke();c.fillStyle='#fff6ea';c.beginPath();c.ellipse(w*.5,h*.66,w*bw*.6,h*.14,0,0,7);c.fill();c.stroke();
 c.fillStyle=or;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.16);c.lineTo(w*(.5+s*.22),h*.0);c.lineTo(w*(.5+s*.24),h*.2);c.closePath();c.fill();c.stroke()}
 c.beginPath();c.moveTo(w*.26,h*.22);c.quadraticCurveTo(w*.5,h*.06,w*.74,h*.22);c.lineTo(w*.5,h*.46);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff6ea';c.beginPath();c.moveTo(w*.36,h*.32);c.lineTo(w*.64,h*.32);c.lineTo(w*.5,h*.46);c.closePath();c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.arc(w*.5,h*.45,w*.03,0,7);c.fill();eyes(c,w,h,.25,mood,.1);c.strokeStyle=INK;if(mood!=='sad'){c.lineWidth=8;c.beginPath();c.arc(w*.5,h*.37,w*.06,PI*.2,PI*.8);c.stroke()}else{c.lineWidth=8;c.beginPath();c.arc(w*.5,h*.42,w*.06,PI*1.2,PI*1.8);c.stroke()}};
const mkChars=(g)=>{const o={c1:{happy:drawn(1.3,1.6,cub('#8a5428','happy'),0,0,0),angry:drawn(1.3,1.6,cub('#8a5428','angry'),0,0,0),sad:drawn(1.3,1.6,cub('#8a5428','sad'),0,0,0)},
 c2:{happy:drawn(1.3,1.6,cub('#a8703a','happy'),0,0,0),angry:drawn(1.3,1.6,cub('#a8703a','angry'),0,0,0),sad:drawn(1.3,1.6,cub('#a8703a','sad'),0,0,0)},
 fx:{sly:drawn(1.7,2.1,fox('sly',false),0,0,0),fat:drawn(1.9,2.1,fox('sly',true),0,0,0),sad:drawn(1.7,2.1,fox('sad',false),0,0,0)}};Object.values(o).forEach(v=>Object.values(v).forEach(m=>g.add(m)));return o};
const put=(set,who,mood,x,y,z,t,ph=0)=>{Object.entries(set[who]).forEach(([k,m])=>{m.visible=k===mood;if(k===mood){m.position.set(x,y+Math.abs(Math.sin(t*5+ph))*.03,z);face(m)}})};
// ---------- лесная поляна с пнём
const gF=new THREE.Group();
gF.add(Object.assign(plane(200,200,lam('#7cc25a'),0,0,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<26;i++){const R=rng(100+i);const a=i/26*PI*2+R()*.2,r=9+R()*6;if(Math.sin(a)>.35)continue;const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0));const cr=new THREE.Mesh(new THREE.ConeGeometry(1.7+R(),4.5,7),lam(i%3?'#2f8a4a':'#3fa04a'));cr.position.y=3.8;cr.castShadow=true;tr.add(cr);tr.position.set(Math.cos(a)*r,0,Math.sin(a)*r-2);gF.add(tr)}
for(let i=0;i<20;i++){const R=rng(700+i);const f=cyl(.08,.02,['#ffffff','#ffd23f','#ff7ab0'][i%3],(R()-.5)*14,.02,(R()-.5)*10);gF.add(f)}
const stump=new THREE.Group();stump.add(cyl(.95,.8,'#9a6a3a',0,.4,0));const ring=plane(1.8,1.8,new THREE.MeshLambertMaterial({map:canvasTex(256,256,(c,w,h)=>{c.fillStyle='#e8c48a';c.beginPath();c.arc(w/2,h/2,w/2,0,7);c.fill();c.strokeStyle='#b8884a';c.lineWidth=5;for(let r=20;r<128;r+=22){c.beginPath();c.arc(w/2,h/2,r,0,7);c.stroke()}}),transparent:true}),0,.805,0,-PI/2);ring.receiveShadow=true;stump.add(ring);gF.add(stump);
const cheeseTex=canvasTex(256,256,(c,w,h)=>{c.fillStyle='#ffcf3a';c.fillRect(0,0,w,h);c.fillStyle='#e8a820';for(let i=0;i<9;i++){const R=rng(40+i);c.beginPath();c.arc(R()*w,R()*h,10+R()*16,0,7);c.fill()}});
const wedge=(th)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,.32,20,1,false,0,th),lam('#fff',{map:cheeseTex}));m.castShadow=true;return m};
const chA=wedge(PI*1.1),chB=wedge(PI*.8);chA.rotation.y=PI*.05;chB.rotation.y=PI*1.2;const chs=new THREE.Group();chs.add(chA,chB);chs.position.set(0,.97,0);gF.add(chs);
const F=mkChars(gF);
gF.add(new THREE.HemisphereLight('#ffffff','#9a8a6a',3.1));sunRig(gF,[-8,20,10],[0,0,0],'#fff1d9',2.6,12);addSet('forest',gF);
// размеры кусков: A больше, лиса кусает по очереди
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const b1=S('s04')+.35,b2=T('больше стал другой.')+.25,cr0=T('И так, пока'),cr1=S('s05')-.2;
const sizes=(t)=>{let a=1,b=.85;const k1=ss(b1,b1+.2,t),k2=ss(b2,b2+.2,t);a-=.3*k1;b-=.2*k2;const kc=ss(cr0,cr1,t);a=lerp(a,.18,kc);b=lerp(b,.18,kc);return[a,b]};
const forest=(t,moods,foxAt,foxMood,fair)=>{gF.visible=true;scene.background=SKY;let[a,b]=fair?[.5,.5]:sizes(t);chA.scale.set(a,1,a);chB.scale.set(b,1,b);
 put(F,'c1',moods[0],-1.6,.8,.9,t,0);put(F,'c2',moods[1],1.6,.8,.9,t,1);if(foxAt){put(F,'fx',foxMood,foxAt[0],1.05,foxAt[1],t,2)}else Object.values(F.fx).forEach(m=>m.visible=false)};
// ---------- комната с телефоном
const rP=K.room('rP','#2a3a6a');
const phone=new THREE.Group();phone.position.set(0,2.0,-2.6);rP.g.add(phone);phone.add(box(2.2,3.9,.22,'#1b1d24',0,0,0));
const scr=(top,num,col)=>{const m=plane(1.95,3.55,new THREE.MeshBasicMaterial({map:canvasTex(512,930,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(0,0,w,110);c.fillStyle='#fff';c.font='800 66px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(top,w/2,230,w-40);c.font='800 260px Pop';c.fillText(num,w/2,500,w-30)})}),0,0,.12);phone.add(m);return m};
const screens={sent:scr('ОТПРАВЛЕНО','100','#2f6fd0'),got:scr('ДОШЛО','86','#d03a3a'),ask:scr('ДОЙДЁТ','?','#1f9a6a')};
const P1=mkChars(rP.g);
const phoneRoom=(t,which,to,u,foxMood)=>{resetRoom(rP);rP.col(u||0,to||'#2a3a6a');Object.entries(screens).forEach(([k,m])=>m.visible=k===which);
 Object.values(P1.c1).concat(Object.values(P1.c2)).forEach(m=>m.visible=false);if(foxMood)put(P1,'fx',foxMood,1.75,1.05,-1.6,t,2);else Object.values(P1.fx).forEach(m=>m.visible=false)};
// ---------- комната денег: столбик 100 → 86
const rM=K.room('rM','#2a4a5a');
const bar=box(1.4,1,1,'#3fae5a',-.6,.5,-2.4);rM.g.add(bar);const redB=box(1.4,1,1,'#e04a3a',1.4,.5,-2.4);rM.g.add(redB);
const nums={};[100,95,90,86].forEach(n=>{nums[n]=K.stand(1.4,.8,'#fff',[{t:String(n),s:170,y:.55,c:'#15131a'}],-.6,0,-2.4);rM.g.add(nums[n])});
const n14=K.stand(1.4,.8,'#fff',[{t:'14',s:170,y:.55,c:'#d02a1a'}],1.4,0,-2.4);rM.g.add(n14);
const P2=mkChars(rM.g);
const dm=new THREE.Matrix4();
const debris=(r,t,t0,cx,cz)=>{const dd=clamp((t-t0)/1.2);r.debris.visible=t>t0;if(t<=t0)return;const R=rng(29);for(let i=0;i<46;i++){const a=R()*6.28,sp=1.5+R()*3.5;const X=cx+Math.cos(a)*sp*dd,Y=clamp(1.2+R()*2+(2.6*dd-3.8*dd*dd),.1,4.1),Z=cz+Math.sin(a)*sp*dd;dm.makeRotationFromEuler(new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4));dm.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));r.debris.setMatrixAt(i,dm)}r.debris.instanceMatrix.needsUpdate=true};
const mroom=(t,v,red,to,u,foxMood)=>{resetRoom(rM);rM.col(u||0,to||'#2a4a5a');const hh=Math.max(.01,v/100*3.0);bar.scale.y=hh;bar.position.y=hh/2;const show=v>=99?100:v>=94?95:v>=89?90:86;Object.entries(nums).forEach(([k,s])=>{s.visible=+k===show;s.position.y=hh+.5});
 redB.visible=n14.visible=red!==null&&red!==undefined;if(redB.visible){const rh=14/100*3;redB.scale.y=rh;redB.position.y=rh/2+red;n14.position.y=rh+.5+red}
 Object.values(P2.c1).concat(Object.values(P2.c2)).forEach(m=>m.visible=false);if(foxMood)put(P2,'fx',foxMood,-2.1,1.05,-1.2,t,2);else Object.values(P2.fx).forEach(m=>m.visible=false)};
// ---------- столы сверху
const tA=K.makeTable('tA','КОМИССИИ ПО ДОРОГЕ',[['ОБМЕН: −5','кусочек маленький'],['ПЕРЕВОД: −5','кусочек маленький'],['СНЯТИЕ: −4','кусочек маленький']]);
const coins=[5,5,4].map((n,i)=>{const g=new THREE.Group();g.position.set(3.2,0,(i-1)*2.2+.25);for(let k=0;k<n;k++){const c=cyl(.32,.12,'#ffc93a',0,.07+k*.13,0);c.castShadow=true;g.add(c)}tA.g.add(g);return g});
const tB=K.makeTable('tB','ДО ОТПРАВКИ',[['СПОСОБ 1: ДОЙДЁТ ?','считайте итог'],['СПОСОБ 2: ДОЙДЁТ ?','считайте итог'],['СПОСОБ 3: ДОЙДЁТ ?','выбирайте больший']]);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(tb,hl,col)=>{tb.g.visible=true;scene.background=new THREE.Color('#e9c58c');tb.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- город
K.billboard(city.g,'КАК ПОЙМАТЬ','ЛИСУ-ПОСРЕДНИКА?',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ПЕТУШОК И ЛИСА',0,9,24,16,9,'#7dff9a');
// ---------- время
const got=T('а дошло 86?'),lis=T('Это лиса-посредник.'),fL=T('Лиса'),ob=T('Обмен — 5,'),pe=T('перевод — 5,'),sn=T('снятие — 4.'),f14=T('14 из 100.'),sev=T('Почти седьмая часть —'),cmp=T('Сравните');
let FLAT=false;const BB=[...[F,P1,P2].flatMap(o=>Object.values(o).flatMap(v=>Object.values(v)))];
const shots=[
{id:'hook',t0:0,t1:lis,out:'whipR',f(t,u){phoneRoom(t,t<got?'sent':'got',t<got?'#2a3a6a':'#6a2a3a',ss(got,got+.4,t));camPath(u,[.8,1.4,3.4],[.3,1.8,1.6],[0,2.0,-2.6],[0,2.0,-2.6],[70,60],.03);
 fx.draw=K.hook(['ОТПРАВИЛИ 100,','А ДОШЛО 86?'],0,lis-.05)}},
{id:'fox',t0:lis,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){phoneRoom(t,'got','#6a2a3a',1,'sly');const a=lerp(.6,-.2,u);cam.position.set(1.0+Math.sin(a)*3.6,lerp(1.2,1.6,u),-1.8+Math.cos(a)*3.6);cam.lookAt(.9,1.6,-2.0);cam.fov=66;cam.updateProjectionMatrix();face(P1.fx.sly);
 fx.tags=[{txt:'ЛИСА-ПОСРЕДНИК',t:lis+.05,xy:[.5,.17]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'cubs',t0:S('s03'),t1:fL,in:'whipL',out:'whipR',f(t,u){forest(t,t<T('и не смогли поделить.')?['happy','happy']:['angry','angry'],null);linPath(u,[-10,7,12],[-1.5,2.4,5.2],[0,0,-2],[0,1.1,0],[60,58],.05*(1-u));
 fx.tags=[{txt:'ДВА МЕДВЕЖОНКА',t:S('s03')+.1,xy:[.5,.17]},{txt:'СЫР',t:T('нашли сыр'),xy:[.5,.26]}]}},
{id:'foxin',t0:fL,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){const k=ease(clamp((t-fL)/1.0));forest(t,['angry','angry'],[lerp(5,0,k),lerp(2,1.7,k)],'sly');camPath(u,[3.5,1.2,5.5],[1.2,1.4,4.8],[1.5,1.2,1.2],[0,1.3,1.0],[64,58],-.03);
 fx.tags=[{txt:'ПОМОГУ ПОДЕЛИТЬ!',t:T('вызвалась помочь.'),xy:[.5,.17]}]}},
{id:'bite1',t0:S('s04'),t1:b2-.15,in:'whipUp',out:'whipL',f(t,u){forest(t,['sad','angry'],[0,1.7],'sly');top(u,-.6,.2,3.6,2.7,0,0,56);
 fx.draw=K.big('КУСЬ!',b1,b2-.2,'#ffd23f',220,.14)}},
{id:'bite2',t0:b2-.15,t1:cr0,in:'whipL',out:'whipUp',f(t,u){forest(t,['angry','sad'],[0,1.7],'sly');camPath(u,[-2.4,1.3,3.2],[-1.2,1.5,2.6],[0,1.0,0],[0,1.1,0],[60,54],.03);
 fx.draw=K.big('КУСЬ!',b2,cr0-.05,'#ffd23f',220,.14)}},
{id:'crumbs',t0:cr0,t1:S('s05'),in:'whipUp',out:'whipR',f(t,u){forest(t,['sad','sad'],[0,1.7],t>T('не остались крошки.')?'fat':'sly');const a=lerp(.3,-.9,u);cam.position.set(Math.sin(a)*.3,lerp(5.5,3.8,ease(u)),.6+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(0,0,.6);cam.up.set(0,1,0);cam.fov=62;cam.updateProjectionMatrix();
 FLAT=true;Object.values(F).forEach(v=>Object.values(v).forEach(m=>{m.rotation.set(-PI/2,0,0);m.position.y=.06}));Object.values(F.fx).forEach(m=>m.position.set(-.9,.06,1.25));Object.values(F.c1).forEach(m=>m.position.set(-1.5,.06,-.4));Object.values(F.c2).forEach(m=>m.position.set(1.3,.06,-.6));
 fx.draw=K.big('КРОШКИ',T('не остались крошки.'),S('s05')-.05,'#ffffff',200,.14)}},
{id:'send',t0:S('s05'),t1:ob,in:'whipR',out:'whipL',f(t,u){mroom(t,100,null);camPath(u,[-.4,.9,3.6],[-.4,1.4,3.0],[-.6,1.7,-2.4],[-.6,1.8,-2.4],[72,66],.03);
 fx.tags=[{txt:'С ПЕРЕВОДАМИ ТАК ЖЕ',t:S('s05')+.05,xy:[.5,.17]}]}},
{id:'fees',t0:ob,t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){const v=100-5*ss(ob,ob+.3,t)-5*ss(pe,pe+.3,t)-4*ss(sn,sn+.3,t);mroom(t,v,null,'#5a2a3a',ss(0,1,u),'sly');
 camPath(u,[-2.2,1.2,3.2],[-1.0,1.6,2.8],[-1.0,1.6,-2.2],[-.8,1.7,-2.3],[70,64],-.03);
 fx.tags=[{txt:'ОБМЕН −5',t:ob,xy:[.3,.17]},{txt:'ПЕРЕВОД −5',t:pe,xy:[.68,.22]},{txt:'СНЯТИЕ −4',t:sn,xy:[.35,.28]}]}},
{id:'small',t0:S('s06'),t1:f14,in:'whipUp',out:'whipR',f(t,u){table(tA,[1,t>T('маленький,'),t>T('маленький,')+.3],'#ffb0a0');coins.forEach(c=>c.visible=true);top(u,-.5,.4,11,8.8,.5,0,58);
 fx.draw=K.big('КАЖДЫЙ МАЛЕНЬКИЙ',S('s06')+.1,f14-.05,'#ffffff',120,.13)}},
{id:'impact',t0:f14,t1:S('s07'),in:'whipR',out:'zoom',f(t,u){const h=t-f14-.25;const fall=h<0?3.0*(1-ss(f14,f14+.25,t)):0;mroom(t,86,fall,h>0?'#8a3a3a':'#5a2a3a',ss(0,.5,Math.max(0,h)),'fat');if(h>0)debris(rM,t,f14+.27,1.4,-2.4);
 const k=h>0?Math.max(0,1-h/.5):0;camPath(u,[1.0,1.0,3.6],[.4,1.4,2.8],[.4,1.4,-2.4],[.5,1.5,-2.4],[72,64],.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>0){fx.crack={p:[1.4,.1,-2.4],a:clamp(h*3),seed:5};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('14 ИЗ 100',f14+.1,sev-.05,'#ff5a5a',200,.14);if(t>sev)fx.tags=[{txt:'≈ 1/7 — ЛИСЕ',t:sev,xy:[.5,.17]}]}},
{id:'rule',t0:S('s07'),t1:cmp,in:'zoom',out:'whipL',f(t,u){phoneRoom(t,'ask','#2a6a4a',ss(0,1,u));camPath(u,[0,1.2,1.6],[.3,1.8,2.8],[0,2.0,-2.6],[0,2.0,-2.6],[60,64],-.02);
 fx.draw=K.big('СКОЛЬКО ДОЙДЁТ?',T('сколько дойдёт'),cmp-.05,'#ffffff',130,.13)}},
{id:'compare',t0:cmp,t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){table(tB,[t>cmp+.1,t>cmp+.45,t>cmp+.8],'#7dff9a');top(u,.5,-.3,10.5,9.0,0,-.2)}},
{id:'sum',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){const k=ease(clamp((t-S('s08'))/1.6));forest(t,['happy','happy'],[lerp(.8,5.5,k),lerp(1.9,2.6,k)],'sad',true);
 const a=lerp(-.5,.4,u);cam.position.set(Math.sin(a)*4.4,lerp(1.4,1.9,u),.6+Math.cos(a)*4.4);cam.lookAt(0,1.0,.4);cam.fov=66;cam.updateProjectionMatrix();Object.values(F).forEach(v=>Object.values(v).forEach(face));
 fx.draw=K.big('ДЕЛИТЕ САМИ',T('делите сами —'),S('s09')-.05,'#7dff9a',170,.14)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){FLAT=false;f.call(this,t,u);if(!FLAT)BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
