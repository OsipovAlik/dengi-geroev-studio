import {kit} from '/lib_ru.js';
// 58 Гензель и Гретель: «бесплатный» пробный период с автопродлением — 7 дней даром, потом 10 в месяц; забыли отменить — 120 в год, три подписки — 360; правило: в день оформления отключи автопродление, нужен — включи сам, раз в месяц проверяй выписку
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x=0,y=0,z=0)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
const BB=[];const mk=(w,h,d)=>{const m=drawn(w,h,d);scene.add(m);m.visible=false;BB.push(m);return m};
// ---------- ведьма (своя рисовка): лиловый плащ, острая шляпа, клюка
const witch=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.strokeStyle='#6a4a2a';c.lineWidth=14;c.beginPath();c.moveTo(w*.86,h*.42);c.lineTo(w*.9,h*.98);c.stroke();c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#6a3a9a';c.beginPath();c.moveTo(w*.4,h*.44);c.lineTo(w*.6,h*.44);c.lineTo(w*.8,h*.97);c.lineTo(w*.2,h*.97);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ff7aa8';c.beginPath();c.roundRect(w*.36,h*.62,w*.28,h*.06,8);c.fill();c.stroke();
 c.fillStyle='#b8d68a';c.beginPath();c.arc(w*.8,h*.5,w*.06,0,7);c.fill();c.stroke();
 const hy=.32,hr=.21;c.fillStyle='#b8d68a';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#d8d8d8';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.2),h*(hy+.03),w*.07,h*.06,0,0,7);c.fill();c.stroke()}
 c.fillStyle='#9ac070';c.beginPath();c.moveTo(w*.48,h*(hy-.01));c.quadraticCurveTo(w*.62,h*(hy+.06),w*.52,h*(hy+.08));c.closePath();c.fill();c.stroke();
 c.lineWidth=10;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.09),h*(hy-.03),w*.05,h*.03,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.09),h*(hy-.028),w*.02,0,7);c.fill()}
 if(mood!=='sweet'){c.lineWidth=11;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.15),h*(hy-.08));c.lineTo(w*(.5+s*.04),h*(hy-.055));c.stroke()}}
 c.lineWidth=9;c.beginPath();if(mood==='evil'){c.fillStyle='#5a1a2a';c.ellipse(w*.5,h*(hy+.12),w*.08,h*.03,0,0,7);c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(w*.47,h*(hy+.1),w*.03,h*.02)}else{c.moveTo(w*.4,h*(hy+.11));c.quadraticCurveTo(w*.5,h*(hy+.16),w*.6,h*(hy+.11));c.stroke()}
 c.lineWidth=12;c.fillStyle='#3a1a5a';c.beginPath();c.ellipse(w*.5,h*(hy-.16),w*.36,h*.035,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(w*.3,h*(hy-.17));c.lineTo(w*.62,h*.01);c.lineTo(w*.7,h*(hy-.17));c.closePath();c.fill();c.stroke();
 c.fillStyle='#ffd23f';c.beginPath();c.roundRect(w*.32,h*(hy-.22),w*.36,h*.035,6);c.fill()};
const WX={};['sweet','evil'].forEach(md=>{WX[md]=mk(1.4,2.1,witch(md))});
const putW=(md,x,z,t)=>{const m=WX[md];m.visible=true;m.position.set(x,Math.abs(Math.sin(t*2.6))*.02,z)};
// ---------- дети
const han=new Puppet('man',1.35),gre=new Puppet('woman',1.3);scene.add(han.m,gre.m);
const HAN={col:'#2d8a4f',hair:'#c88a2a'},GRE={col:'#d9506a',hair:'#f0c040'};
const kids=(t,x,z,o={})=>{han.pose(x,z,{...HAN,expr:'smile',look:.3,aL:[.2,.2],aR:[.2,.2],blink:blink(t),...(o.h||{})});gre.pose(x+.75,z+.15,{...GRE,expr:'smile',look:-.3,aL:[.2,.2],aR:[.2,.2],blink:blink(t,.4),...(o.g||{})})};
// ---------- лес и пряничный домик
const gF=new THREE.Group();
gF.add(Object.assign(plane(200,200,lam('#5a9a48'),0,0,0,-PI/2),{receiveShadow:true}));
gF.add(Object.assign(plane(1.6,30,lam('#c8a060'),0,.01,14,-PI/2),{receiveShadow:true}));
const gh=new THREE.Group();gh.position.set(0,0,-2);gF.add(gh);
gh.add(box(3.2,2.2,2.6,'#b8743a',0,1.1,0));
for(let i=0;i<4;i++)gh.add(box(3.26,.1,2.66,'#fff4f0',0,.4+i*.5,0));
for(const s of[-1,1]){const r=box(1.95,.18,3.1,'#ff7aa8',s*.8,2.75,0);r.rotation.z=-s*.62;gh.add(r)}
gh.add(box(.12,.2,3.15,'#fff4f0',0,3.3,0));
const CAN=['#ffd23f','#3ac0ff','#7dff9a','#ff5a3a','#fff'];for(let i=0;i<10;i++){const s=i%2?1:-1;const k=Math.floor(i/2);const cd=cyl(.13,.12,CAN[i%5],s*(.45+(k%2)*.6),2.5+((k%2)?-.25:.15)+.05,-1.1+k*.55);cd.rotation.z=-s*.62;gh.add(cd)}
gh.add(box(.8,1.3,.08,'#ff7aa8',0,.65,1.32));gh.add(box(.9,.12,.1,'#fff4f0',0,1.32,1.34));
for(const s of[-1,1]){gh.add(box(.6,.6,.06,'#ffe08a',s*1.05,1.35,1.32));gh.add(box(.7,.07,.08,'#fff4f0',s*1.05,1.35,1.36));gh.add(box(.07,.7,.08,'#fff4f0',s*1.05,1.35,1.36))}
for(const [x,z,cl] of [[-2.2,1.4,'#ff5a3a'],[2.3,1.2,'#3ac0ff'],[-1.6,2.4,'#ffd23f']]){gh.add(cyl(.05,1,'#fff',x,.5,z));const sp=new THREE.Mesh(new THREE.SphereGeometry(.3,14,10),lam(cl));sp.position.set(x,1.15,z);sp.castShadow=true;gh.add(sp)}
const freeTag=K.stand(1.9,.6,'#7dff9a',[{t:'БЕСПЛАТНО',s:96,y:.56,c:'#15131a'}],0,3.9,0);gh.add(freeTag);
for(let i=0;i<22;i++){const R=rng(900+i);const s=i%2?1:-1;const x=s*(4.5+R()*12),z=-16+i*2.2;const tr=new THREE.Mesh(new THREE.ConeGeometry(1+R()*.6,3+R()*2,7),lam(i%3?'#2a6a3a':'#1f5a32'));tr.position.set(x,2.2,z);tr.castShadow=true;gF.add(tr);gF.add(box(.3,1,.3,'#5a3a1a',x,.5,z))}
// клетка
const cage=new THREE.Group();gF.add(cage);
for(let i=0;i<12;i++){const a=i/12*PI*2;cage.add(cyl(.04,1.9,'#3a3a44',Math.cos(a)*.62,.95,Math.sin(a)*.62))}
cage.add(cyl(.72,.1,'#3a3a44',0,1.92,0));cage.add(cyl(.72,.08,'#3a3a44',0,.04,0));
const lockTag=K.stand(1.3,.5,'#e8322a',[{t:'ЗАПЕРТО',s:80,y:.56,c:'#fff'}],0,2.3,.1);cage.add(lockTag);
gF.add(new THREE.HemisphereLight('#fff0f6','#4a6a3a',3.1));sunRig(gF,[-8,18,10],[0,0,-1],'#fff1d0',2.6,16);addSet('forest',gF);
const forest=(t,{dark=0,cg=-1}={})=>{gF.visible=true;scene.background=new THREE.Color('#ffc8e0').lerp(new THREE.Color('#3a2a4a'),dark);freeTag.visible=dark<.5;cage.visible=cg>=0;cage.position.set(2.3,Math.max(0,cg)*0,-.2);if(cg>=0)cage.position.y=lerp(3.2,0,ease(clamp(cg)))};
// ---------- комната с телефоном (цвет: серо-синий → тёплый зелёный)
const rP=K.room('rP','#6a7f9a');
rP.g.add(box(2.4,.9,1.2,'#b07a44',0,.45,-2.2));
const scrFree=K.stand(1.3,1.6,'#ffffff',[{t:'ПРОБНЫЙ',s:58,y:.2,c:'#15131a'},{t:'ПЕРИОД',s:58,y:.38,c:'#15131a'},{t:'0',s:220,y:.7,c:'#2d8a4f'}],.5,1.6,-1.7,0,'#15131a');rP.g.add(scrFree);
const scrPaid=K.stand(1.3,1.6,'#ffffff',[{t:'СПИСАНО',s:62,y:.22,c:'#e8322a'},{t:'−10',s:200,y:.6,c:'#e8322a'},{t:'ПОДПИСКА',s:46,y:.88,c:'#15131a'}],.5,1.6,-1.7,0,'#e8322a');rP.g.add(scrPaid);
const scrOff=K.stand(1.3,1.6,'#ffffff',[{t:'АВТО-',s:62,y:.22,c:'#15131a'},{t:'ПРОДЛЕНИЕ',s:50,y:.4,c:'#15131a'},{t:'ВЫКЛ',s:150,y:.7,c:'#2d8a4f'}],.5,1.6,-1.7,0,'#2d8a4f');rP.g.add(scrOff);
const vw=new Puppet('woman',1.85);scene.add(vw.m);const VW={col:'#e8a23a',hair:'#3a2a1a'};
const room=(t,{scr='free',u=0,col='#6a7f9a'}={})=>{resetRoom(rP);rP.col(u,col);scrFree.visible=scr==='free';scrPaid.visible=scr==='paid';scrOff.visible=scr==='off'};
// ---------- календарь сверху
const gC=new THREE.Group();
{const wood=canvasTex(512,512,(c,w,h)=>{for(let i=0;i<8;i++){const v=(i*37)%26;c.fillStyle=`rgb(${176+v},${122+v*.7},${70+v*.4})`;c.fillRect(i*w/8,0,w/8,h);c.strokeStyle='rgba(50,25,10,.75)';c.lineWidth=4;c.strokeRect(i*w/8,-5,w/8,h+10)}},{wrap:true});wood.repeat.set(6,6);const tp=plane(40,40,lam('#fff',{map:wood}),0,0,0,-PI/2);tp.receiveShadow=true;gC.add(tp)}
gC.add(plane(5.2,6.4,lam('#f6f2e6'),0,.02,0,-PI/2));
gC.add(K.stand(4.6,.8,'#f6f2e6',[{t:'ПРОБНЫЙ ПЕРИОД',s:110,y:.55,c:'#15131a'}],0,.03,-2.6).rotateX(-PI/2));
const days=[];for(let i=0;i<8;i++){const x=-1.65+(i%4)*1.1,z=-1.3+Math.floor(i/4)*1.5;const last=i===7;
 const d=K.stand(1,1.3,last?'#e8322a':'#7dff9a',[{t:String(i+1),s:70,y:.25,c:last?'#fff':'#15131a'},{t:last?'−10':'0',s:last?120:140,y:.66,c:last?'#fff':'#15131a'}],x,.04,z);d.rotation.x=-PI/2;gC.add(d);days.push(d)}
const autoTag=K.stand(3.2,.7,'#15131a',[{t:'АВТОПРОДЛЕНИЕ',s:84,y:.55,c:'#ffd23f'}],0,.05,2.3);autoTag.rotation.x=-PI/2;gC.add(autoTag);
gC.add(new THREE.HemisphereLight('#fff','#a89a8f',3.0));sunRig(gC,[-5,24,6],[.5,0,0],'#fff1d9',2.4,10);addSet('cal',gC);
const calendar=(t,n,auto=0)=>{gC.visible=true;scene.background=new THREE.Color('#e9c58c');days.forEach((d,i)=>{const g=clamp(n-i);d.visible=g>0;d.scale.setScalar(.6+.4*ease(g))});autoTag.visible=auto>0};
// ---------- монеты: 3 подписки × 12 месяцев
const gK=new THREE.Group();
gK.add(Object.assign(plane(200,200,lam('#4a3f66'),0,0,0,-PI/2),{receiveShadow:true}));
const stacks=[];for(let r=0;r<3;r++)for(let m=0;m<12;m++){const g=new THREE.Group();g.position.set(-1.7+r*1.7,0,-m*.62);for(let k=0;k<5;k++)g.add(cyl(.24,.09,k%2?'#ffd23f':'#f0b820',0,.05+k*.1,0));gK.add(g);stacks.push({g,r,m})}
const rowTags=[0,1,2].map(r=>{const s=K.stand(1.5,.6,'#ffffff',[{t:'120',s:120,y:.56,c:'#15131a'}],-1.7+r*1.7,1.2,-7.6);gK.add(s);return s});
const subTags=[0,1,2].map(r=>{const s=K.stand(1.5,.55,['#ff7aa8','#3ac0ff','#7dff9a'][r],[{t:'ПОДП. №'+(r+1),s:60,y:.56,c:'#15131a'}],-1.7+r*1.7,.35,.9);gK.add(s);return s});
const slab=new THREE.Group();gK.add(slab);slab.add(box(3.4,.5,1.6,'#e8322a',0,.25,0));{const l=K.stand(3.2,1.4,'#e8322a',[{t:'−360',s:300,y:.56,c:'#fff'}],0,.51,0);l.rotation.x=-PI/2;slab.add(l)}
gK.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-3.4],'#fff1d9',2.4,16);addSet('coins',gK);
const coins=(t,{rows=[0,0,0],tags=[0,0,0],sub=0,drop=-1,sky=0}={})=>{gK.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#2a2238'),sky);
 stacks.forEach(s=>{const g=clamp(rows[s.r]*12-s.m);s.g.visible=g>0;s.g.scale.set(1,Math.max(.01,ease(g)),1)});
 rowTags.forEach((s,i)=>s.visible=tags[i]>0);subTags.forEach((s,i)=>s.visible=sub>i);
 slab.visible=drop>=0;slab.position.set(0,lerp(9,.6,ease(clamp(drop))),-3.4)};
// ---------- правило сверху
const tR=K.makeTable('tR','ПРАВИЛО',[['ВЫКЛЮЧИ АВТОПРОДЛЕНИЕ','в день оформления'],['НУЖЕН — ВКЛЮЧИ САМ','не наоборот'],['РАЗ В МЕСЯЦ — ВЫПИСКА','проверь все подписки']]);
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl)=>{tR.g.visible=true;scene.background=new THREE.Color('#e9c58c');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','КАК НЕ ПОПАСТЬСЯ',0,9,-26,16,9,'#ff7aa8');K.billboard(city.g,'ЗАВТРА','СОЛДАТ ИЗ «ОГНИВА»',0,9,24,16,9,'#ffd23f');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const hk=T('Гензель и Гретель'),dar=T('даром,'),wit=T('а потом ведьма'),lock=T('заперла Гензеля'),dal=T('а дальше'),god=T('за год'),c120=T('120.'),tri=T('три —'),c360=T('уже 360'),zat=T('За то,'),otk=T('отключите'),vkl=T('Нужен сервис —'),mes=T('А раз в месяц'),vyp=T('в выписке.');
const HOOK=['БЕСПЛАТНО,','А ДЕНЬГИ','СПИСАЛИ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const sp=T('списали деньги?');
const shots=[
{id:'hook',t0:0,t1:hk,out:'zoom',f(t,u){room(t,{scr:t<sp?'free':'paid'});vw.pose(-.9,-1.0,{...VW,expr:t>sp?'shock':'smile',look:.6,aR:[1.3,1.4],aL:[.2,.2],propR:'phone',blink:blink(t)});camPath(u,[-.3,.7,3.4],[.3,1.2,1.0],[-.2,1.5,-2.2],[.4,1.6,-1.7],[64,54],.03);shake(t,sp,.08,.4);fx.draw=K.hook(HOOK,0,hk-.05)}},
{id:'kids',t0:hk,t1:S('s02'),in:'zoom',out:'whipUp',f(t,u){forest(t);kids(t,-.6,1.4);linPath(u,[-2.4,.8,6.0],[-1.0,1.0,5.2],[0,1.5,-1],[0,1.7,-1.5],[56,52],.02);fx.draw=K.big('ГЕНЗЕЛЬ И ГРЕТЕЛЬ',hk+.05,S('s02')-.05,'#ff7aa8',140,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'roof',t0:S('s03'),t1:dar,in:'whipL',out:'whipR',f(t,u){forest(t);kids(t,-.6,.8,{h:{expr:'smile',aR:[1.8,1.2]},g:{aL:[1.8,1.2]}});topv(u,-.8,.3,13,10,0,0,-1.4,58)}},
{id:'eat',t0:dar,t1:lock,in:'whipR',out:'whipUp',f(t,u){const w=t>wit;forest(t,{dark:w?.3*ss(wit,lock,t):0});if(w)putW(t>wit+.35?'evil':'sweet',-1.7,.7,t);kids(t,-.3,.7,{h:{aR:w?[.2,.2]:[1.5,1.6],expr:w?'shock':'smile',talk:w?0:talk(t)},g:{aL:w?[.2,.2]:[1.5,1.6],expr:w?'shock':'smile',talk:w?0:talk(t+.3)}});const a=lerp(-.7,-.1,u);cam.position.set(-.4+Math.sin(a)*4.8,lerp(1.0,1.2,u),-.4+Math.cos(a)*4.8);cam.lookAt(-.5,1.4,-.4);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('ДАРОМ!',dar+.05,wit-.02,'#7dff9a',220,.16)}},
{id:'cage',t0:lock,t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){forest(t,{dark:.5,cg:ss(lock,lock+.35,t)});han.pose(2.3,-.2,{...HAN,expr:'shock',look:0,aL:[1.6,1.4],aR:[1.6,1.4],blink:blink(t)});putW('evil',.6,.8,t);camPath(u,[4.2,1.0,4.0],[3.4,1.2,3.4],[1.8,1.3,-.2],[2.0,1.3,-.2],[58,54],.02);shake(t,lock+.35,.15,.4)}},
{id:'cal7',t0:S('s04'),t1:dal,in:'zoom',out:'whipR',f(t,u){calendar(t,lerp(0,7,ss(T('7 дней')-.2,T('бесплатно,')+.4,t)));topv(u,-.4,.3,8.6,7.4,0,0,-.2,58);fx.draw=K.big('7 ДНЕЙ = 0',T('7 дней'),dal-.05,'#7dff9a',170,.12)}},
{id:'day8',t0:dal,t1:S('s05'),in:'whipR',out:'whipL',f(t,u){calendar(t,8,1);camPath(u,[3.2,2.2,3.6],[1.8,1.5,2.0],[1.6,0,.2],[1.65,0,.2],[54,48],.04)}},
{id:'month',t0:S('s05'),t1:god,in:'whipL',out:'whipUp',f(t,u){room(t,{scr:'paid'});vw.pose(-.9,-.8,{...VW,expr:'angry',look:.6,aR:[1.3,1.4],aL:[.2,.2],propR:'phone',blink:blink(t)});camPath(u,[1.6,1.0,2.8],[1.0,1.4,1.6],[.5,1.6,-1.7],[.5,1.6,-1.7],[56,50],-.03);fx.draw=K.big('−10 В МЕСЯЦ',S('s05')+.05,god-.05,'#ff5a3a',150,.16)}},
{id:'year',t0:god,t1:S('s06'),in:'whipUp',out:'whipR',f(t,u){coins(t,{rows:[ss(god,c120+.1,t),0,0],tags:[t>c120-.05?1:0,0,0],sub:1});camPath(u,[-3.4,3.6,4.6],[-1.6,2.6,4.2],[-1.7,.2,-3.0],[-1.7,.3,-3.6],[58,56],.03);fx.draw=K.big('12 × 10 = 120',c120-.05,S('s06')-.05,'#ffd23f',150,.16)}},
{id:'three',t0:S('s06'),t1:c360,in:'whipR',out:'whipUp',f(t,u){const g=ss(tri-.3,c360-.1,t);coins(t,{rows:[1,g,g],tags:[1,g>.95?1:0,g>.95?1:0],sub:t>tri-.3?3:1,sky:.2});const a=lerp(-.5,.3,u);cam.position.set(Math.sin(a)*8.5,lerp(4.2,6.2,u),-3.4+Math.cos(a)*8.5);cam.lookAt(0,.3,-3.4);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'impact',t0:c360,t1:zat,in:'whipUp',out:'zoom',f(t,u){coins(t,{rows:[1,1,1],tags:[1,1,1],sub:3,drop:ss(c360,c360+.3,t),sky:.5});topv(u,-.3,.4,11.5,9.8,0,0,-3.4,62);shake(t,c360+.3,.25,.6);const h=t-c360-.3;if(h>0){fx.crack={p:[0,.1,-3.4],a:clamp(h*3),seed:58};fx.flash=Math.max(0,1-h/.25)}}},
{id:'unused',t0:zat,t1:S('s07'),in:'zoom',out:'whipR',f(t,u){room(t,{scr:'paid',col:'#4a4f66',u:1});vw.pose(-.6,-.6,{...VW,expr:'shock',look:.2,aL:[.3,.3],aR:[.3,.3],blink:blink(t)});camPath(u,[-1.4,.5,3.6],[-1.0,.6,3.0],[-.4,1.5,-1.2],[-.3,1.6,-1.2],[62,58],.02);fx.draw=K.big('НЕ ПОЛЬЗУЕТЕСЬ',zat+.05,S('s07')-.05,'#ffffff',140,.16)}},
{id:'rule',t0:S('s07'),t1:vkl,in:'whipR',out:'whipL',f(t,u){table([t>otk-.1,0,0]);topv(u,-.4,.25,10.2,8.4,0,0,0,58)}},
{id:'off',t0:vkl,t1:mes,in:'whipL',out:'whipUp',f(t,u){room(t,{scr:'off',col:'#5aa86a',u:ss(vkl,vkl+1,t)});vw.pose(-.9,-.9,{...VW,expr:'smile',look:.6,aR:[1.3,1.4],aL:[.2,.2],propR:'phone',blink:blink(t)});camPath(u,[1.4,.8,3.4],[.6,1.2,2.0],[0,1.5,-1.7],[.4,1.6,-1.7],[58,52],-.03);fx.draw=K.big('ВКЛЮЧИ САМ',vkl+.05,mes-.05,'#7dff9a',170,.16)}},
{id:'rule2',t0:mes,t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){table([1,1,t>T('проверяйте подписки')-.1]);topv(u,.3,-.3,8.8,7.6,0,0,.4,58)}},
{id:'next',t0:S('s09'),t1:T('Подпишись,'),in:'whipR',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:T('Подпишись,'),t1:dur,in:'whipL',out:null,f(t,u){forest(t);kids(t,-.4,1.2,{h:{aR:[2.2+.3*Math.sin(t*8),.4]},g:{aL:[2.2+.3*Math.sin(t*8+1),.4]}});camPath(u,[2.6,.7,5.4],[1.2,1.0,4.4],[0,1.4,-1],[0,1.5,-1],[56,52],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);han.hide();gre.hide();vw.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
