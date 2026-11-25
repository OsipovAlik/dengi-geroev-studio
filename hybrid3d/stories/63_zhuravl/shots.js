import {kit} from '/lib_ru.js';
// 63 Волк и Журавль (Крылов): работа без предоплаты — сделал, а вместо платы «скажи спасибо»; заказ на 100: без аванса заказчик исчез — 0, с авансом в половину — уже 50; правило: договор письменно, аванс до начала, оплата за каждый этап
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- журавль (своя рисовка): серый, красная шапочка, синий фартук мастера
const crane=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#e8a33a';for(const s of[-1,1]){c.fillRect(w*(.5+s*.06)-w*.012,h*.7,w*.024,h*.28);c.strokeRect(w*(.5+s*.06)-w*.012,h*.7,w*.024,h*.28)}
 c.fillStyle='#b8c2cc';c.beginPath();c.ellipse(w*.5,h*.62,w*.24,h*.12,0,0,7);c.fill();c.stroke();
 c.fillStyle='#3a4450';c.beginPath();c.moveTo(w*.28,h*.6);c.quadraticCurveTo(w*.12,h*.7,w*.2,h*.76);c.quadraticCurveTo(w*.3,h*.7,w*.36,h*.68);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e9eef2';c.beginPath();c.moveTo(w*.46,h*.52);c.lineTo(w*.46,h*.32);c.lineTo(w*.54,h*.32);c.lineTo(w*.54,h*.52);c.closePath();c.fill();c.stroke();
 const hy=.24,hr=.2;c.fillStyle='#f4f6f8';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#d8263f';c.beginPath();c.arc(w*.5,h*(hy-.06),w*hr*.75,PI*1.12,PI*1.88);c.closePath();c.fill();c.stroke();
 c.fillStyle='#2f6fc8';c.beginPath();c.moveTo(w*.34,h*.56);c.lineTo(w*.66,h*.56);c.lineTo(w*.6,h*.72);c.lineTo(w*.4,h*.72);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e8a33a';c.beginPath();c.moveTo(w*.66,h*(hy+.01));c.lineTo(w*.99,h*(hy+.04));c.lineTo(w*.66,h*(hy+.06));c.closePath();c.fill();c.stroke();
 c.lineWidth=9;const ey=hy-.005;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*ey,w*.05,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08+.012),h*(ey+.004),w*.022,0,7);c.fill()}
 if(mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.13),h*(ey-.045));c.lineTo(w*(.5+s*.03),h*(ey-.03));c.stroke()}c.beginPath();c.arc(w*.5,h*(hy+.12),w*.05,PI*1.15,PI*1.85);c.stroke()}
 else{c.beginPath();c.arc(w*.5,h*(hy+.07),w*.05,PI*.15,PI*.85);c.stroke()}};

// ---------- волк (своя рисовка): серый, жёлтые глаза, красный шарф
const wolf=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;const G='#7a8290';
 c.fillStyle=G;for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.13)-w*.06,h*.8,w*.12,h*.18,12);c.fill();c.stroke()}
 c.beginPath();c.moveTo(w*.7,h*.75);c.quadraticCurveTo(w*.98,h*.7,w*.95,h*.5);c.quadraticCurveTo(w*.86,h*.64,w*.68,h*.66);c.closePath();c.fill();c.stroke();
 c.beginPath();c.ellipse(w*.5,h*.66,w*.24,h*.19,0,0,7);c.fill();c.stroke();
 c.fillStyle='#d8dde4';c.beginPath();c.ellipse(w*.5,h*.69,w*.1,h*.13,0,0,7);c.fill();c.stroke();
 c.fillStyle='#d02a1a';c.beginPath();c.moveTo(w*.3,h*.5);c.lineTo(w*.7,h*.5);c.lineTo(w*.66,h*.57);c.lineTo(w*.34,h*.57);c.closePath();c.fill();c.stroke();
 const hy=.3,hr=.25;c.fillStyle=G;for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*(hy-hr*.7));c.lineTo(w*(.5+s*.26),h*(hy-hr*1.5));c.lineTo(w*(.5+s*.3),h*(hy-hr*.3));c.closePath();c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#d8dde4';c.beginPath();c.ellipse(w*.5,h*(hy+.08),w*.14,h*.08,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.03),w*.045,h*.025,0,0,7);c.fill();
 const ey=hy-.04;c.lineWidth=9;c.fillStyle='#ffd23f';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*ey,w*.055,h*.035,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.1),h*ey,w*(mood==='choke'?.012:.022),0,7);c.fill()}
 if(mood==='sly'){c.fillStyle=G;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*(ey-.016),w*.065,h*.026,0,PI,0);c.fill();c.stroke()}
  c.fillStyle='#fff';c.beginPath();c.moveTo(w*.4,h*(hy+.1));c.quadraticCurveTo(w*.5,h*(hy+.16),w*.62,h*(hy+.09));c.lineTo(w*.4,h*(hy+.1));c.fill();c.stroke()}
 else if(mood==='choke'){c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+.12),w*.06,h*.04,0,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.roundRect(w*.36,h*(hy+.1),w*.28,h*.035,8);c.fill();c.stroke();
  c.fillStyle='#8ad0ff';c.beginPath();c.ellipse(w*.76,h*(hy-.08),w*.025,h*.03,0,0,7);c.fill()}
 else{c.beginPath();c.arc(w*.5,h*(hy+.08),w*.06,PI*.15,PI*.85);c.stroke()}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const WF=mk(wolf,['choke','sly','smile'],1.6,1.9),CR=mk(crane,['happy','sad'],1.35,2.25);
const BB=[...Object.values(WF),...Object.values(CR)];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.2))*.02,z)};
// ---------- лесная поляна
const gF=new THREE.Group();
const moss=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#4f8a46';c.fillRect(0,0,w,h);const R=rng(9);c.strokeStyle='rgba(20,50,20,.55)';c.lineWidth=3;for(let i=0;i<220;i++){const x=R()*w,y=R()*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*8,y-10-R()*10);c.stroke()}},{wrap:true});moss.repeat.set(30,30);
const gr=plane(200,200,lam('#fff',{map:moss}),0,0,0,-PI/2);gr.receiveShadow=true;gF.add(gr);
const RF=rng(4);for(let i=0;i<26;i++){const a=RF()*PI*2,r=6+RF()*10;const x=Math.cos(a)*r,z=Math.sin(a)*r-2;if(z>3&&Math.abs(x)<5)continue;const tr=new THREE.Group();tr.position.set(x,0,z);tr.add(cyl(.18,1.2,'#5a3418',0,.6,0));const h=2+RF()*1.5;for(let k=0;k<3;k++){const cn=new THREE.Mesh(new THREE.ConeGeometry(1.2-k*.3,h*.5,10),lam(k%2?'#2f6a3a':'#3a7a44'));cn.position.y=1.2+k*h*.3;cn.castShadow=true;tr.add(cn)}gF.add(tr)}
gF.add(cyl(.5,.5,'#8a5a30',2.4,.25,-1.8));gF.add(cyl(.45,.02,'#d8b080',2.4,.51,-1.8));
const bone=new THREE.Group();bone.add(box(.5,.07,.07,'#f4efe4',0,0,0));for(const x of[-.27,.27])for(const z of[-.05,.05]){const b=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),lam('#f4efe4'));b.position.set(x,0,z);bone.add(b)}gF.add(bone);
const coinsF=[];for(let k=0;k<5;k++){const c=cyl(.2,.07,'#ffd23f',.55,.05+k*.08,-.8);gF.add(c);coinsF.push(c)}
gF.add(new THREE.HemisphereLight('#fff1e0','#2a3a2a',3.1));sunRig(gF,[-7,14,8],[0,0,-1.5],'#ffd9a8',2.6,14);addSet('forest',gF);
const WX=-.75,WZ=-1.4,CX=.85,CZ=-1.2;
const forest=(t,{bn=-1,coins=0,bg='#ffc98a'}={})=>{gF.visible=true;scene.background=new THREE.Color(bg);bone.visible=bn>=0;if(bn>=0){bone.position.set(lerp(WX+.05,WX+.9,bn),lerp(1.45,.08,ss(.5,1,bn))+Math.sin(bn*PI)*.5,WZ+.25);bone.rotation.z=bn*6}coinsF.forEach((c,k)=>c.visible=k<Math.round(coins*5))};
// ---------- квартира на ремонте
const rR=K.room('rR','#d8d2c4');
const fresh=plane(5.9,3.0,lam('#58b8e8'),0,1.6,-3.95,0);rR.g.add(fresh);
rR.g.add(box(.6,.5,.6,'#e8e8f0',1.6,.25,-2.6));rR.g.add(cyl(.22,.4,'#58b8e8',-1.4,.2,-2.8));
const ladder=new THREE.Group();ladder.position.set(2.0,0,-3.2);rR.g.add(ladder);for(const x of[-.35,.35])ladder.add(box(.08,2.6,.08,'#c0a060',x,1.3,0));for(let k=0;k<6;k++)ladder.add(box(.7,.06,.08,'#c0a060',0,.3+k*.4,0));
const bubble=K.stand(2.6,.8,'#ffffff',[{t:'«ЗАПЛАЧУ ПОТОМ»',s:76,y:.55,c:'#15131a'}],-.9,3.0,-1.6);rR.g.add(bubble);
const repair=(t,{paint=1,bub=0,col='#d8d2c4',u=0}={})=>{resetRoom(rR);rR.col(u,col);fresh.scale.x=Math.max(.01,paint);fresh.position.x=-2.95+2.95*paint;bubble.visible=bub>0};
const wk=new Puppet('man',1.8);const WK={col:'#2f6fc8',hair:'#3a2a1a'};const cl=new Puppet('big',1.9);const CL={col:'#6a4f3a',hair:'#15131a',tie:'#d02a1a'};scene.add(wk.m,cl.m);
// ---------- стопки: заказ на 100 = 50 + 50
const gK=new THREE.Group();gK.add(Object.assign(plane(200,200,lam('#2a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const mkStack=(col,n)=>{const g=new THREE.Group();const mat=lam(col);const cs=[];for(let k=0;k<n;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;c.receiveShadow=true;g.add(c);cs.push(c)}gK.add(g);return{g,cs,mat}};
const ST=[...Array(10)].map((_,i)=>{const s=mkStack('#ffd23f',10);s.g.position.set(-2.2+(i%5)*1.1,0,-1.2-Math.floor(i/5)*1.2);return s});
const lb0=K.stand(2.8,.7,'#ffffff',[{t:'ЗАКАЗ НА 100',s:76,y:.56,c:'#15131a'}],0,1.6,-4.4);gK.add(lb0);
const lbA=K.stand(2.8,.7,'#7dff9a',[{t:'АВАНС 50',s:80,y:.56,c:'#15131a'}],0,1.6,-4.4);gK.add(lbA);
gK.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('stacks',gK);
// mode: g = рост, gone = 0..1 исчезновение всех, adv = 0..1 первые 5 стопок зеленеют и остаются
const stacks=(t,{g=1,gone=0,adv=0,bg=0}={})=>{gK.visible=true;scene.background=new THREE.Color('#9ab8ff').lerp(new THREE.Color('#3a1020'),bg);
 ST.forEach((s,i)=>{let k=clamp(g*10-i);const keep=adv>0&&i%5<5&&Math.floor(i/5)==0;if(gone>0&&!keep)k*=1-clamp(gone*2-(i%5)*.15);s.g.visible=k>0;s.cs.forEach((c,j)=>c.visible=j<Math.round(k*10));s.mat.color.set(keep?'#7dff9a':'#ffd23f');s.g.position.y=gone>0&&!keep?-ss(0,1,gone)*.3:0});lb0.visible=adv==0;lbA.visible=adv>0};
// ---------- договор (вид сверху)
const tP=K.makeTable('tP','ДОГОВОР',[['ДОГОВОР ПИСЬМЕННО','сумма, сроки, этапы'],['АВАНС ДО НАЧАЛА','половина или треть'],['ОПЛАТА ЗА ЭТАП','потом следующий']],'#b58a5e');
const coinP=new THREE.Group();coinP.position.set(3.2,0,-1.2);tP.g.add(coinP);for(let k=0;k<6;k++)coinP.add(cyl(.45,.1,'#ffd23f',0,.06+k*.11,0));
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,cp=0)=>{tP.g.visible=true;scene.background=new THREE.Color('#e9c58c');coinP.visible=cp>0;tP.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- город
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО АВАНСА',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','АЛАДДИН',0,9,24,16,9,'#9ad0ff');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const tak=T('Так обманули'),vyt=T('Журавль вытащил её'),plat=T('и попросил плату.'),awolf=T('А волк:'),zap=T('«Заплачу потом» —'),ich=T('и человек'),bez=T('Без аванса'),c0=T('у вас 0.'),sav=T('С авансом'),c50=T('уже 50.'),avd=T('аванс до начала,'),sd=T('сдали этап —'),sub=T('Подпишись,');
const HOOK=['СДЕЛАЛИ РАБОТУ,','А ДЕНЕГ НЕТ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const wkP=(t,o={})=>wk.pose(.9,-2.4,{...WK,expr:'smile',look:-.4,aR:[2.0,.5],aL:[.3,.2],propR:'roller',blink:blink(t),...o});
const clP=(t,x,o={})=>cl.pose(x,-1.4,{...CL,expr:'sly',look:.5,aR:[.3,.2],aL:[.3,.2],blink:blink(t),...o});
const shots=[
{id:'hook',t0:0,t1:tak,out:'whipR',f(t,u){forest(t);put(WF,'sly',WX,WZ,t);put(CR,'sad',CX,CZ,t);camPath(u,[-1.8,.7,4.2],[-.9,1.0,3.3],[0,1.3,-1.3],[0,1.4,-1.4],[62,56],.03);fx.draw=K.hook(HOOK,0,tak-.05)}},
{id:'title',t0:tak,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){forest(t,{bg:'#ffb07a'});put(WF,'sly',WX,WZ,t);put(CR,'sad',CX,CZ,t);camPath(u,[1.8,.8,4.4],[-.4,1.3,4.6],[0,1.2,-1.3],[.1,1.3,-1.4],[62,58],-.03);fx.draw=K.big('ВОЛК И ЖУРАВЛЬ',tak+.05,S('s02')-.05,'#ffd23f',135,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'choke',t0:S('s03'),t1:vyt,in:'whipL',out:'whipUp',f(t,u){forest(t,{bg:'#8a9ac8'});put(WF,'choke',WX,WZ,t,Math.abs(Math.sin(t*14))*.03);put(CR,'happy',CX+.6,CZ-.6,t);camPath(u,[-2.6,1.0,2.4],[-1.6,1.5,2.0],[WX,1.2,WZ],[WX+.1,1.4,WZ],[56,52],.02);fx.tags=[{txt:'КОСТЬ!',t:T('костью.'),xy:[.5,.12]}]}},
{id:'pull',t0:vyt,t1:plat,in:'whipUp',out:'whipR',f(t,u){const bn=ss(T('клювом')-.2,plat-.1,t);forest(t,{bn,bg:'#8a9ac8'});put(WF,bn>.3?'smile':'choke',WX,WZ,t);put(CR,'happy',CX-.5,CZ,t);camPath(u,[-.6,.9,2.6],[.2,1.1,2.2],[WX+.4,1.3,WZ],[WX+.5,1.2,WZ],[58,54],.02);if(bn>.25&&bn<.6)fx.flash=.25;fx.draw=K.big('ВЫТАЩИЛ!',T('клювом'),plat-.05,'#ffffff',150,.14)}},
{id:'ask',t0:plat,t1:awolf,in:'whipR',out:'whipL',f(t,u){forest(t,{bn:1});put(WF,'smile',WX,WZ,t);put(CR,'happy',CX,CZ,t);const a=lerp(.5,-.1,u);cam.position.set(CX+Math.sin(a)*3.8,lerp(1.3,1.6,u),CZ+Math.cos(a)*3.8);cam.lookAt(CX-.6,1.5,CZ);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('А ПЛАТА?',plat+.1,awolf-.05,'#7dff9a',170,.15)}},
{id:'wolf',t0:awolf,t1:S('s04'),in:'whipL',out:'zoom',f(t,u){forest(t,{bn:1,bg:'#c84a3a'});put(WF,'sly',WX,WZ,t);put(CR,'sad',CX,CZ,t);linPath(ease(u)*.3+u*.7,[-1.9,1.6,2.4],[-1.6,1.6,2.2],[WX,1.5,WZ],[WX,1.55,WZ],[54,50],0);fx.draw=K.big('«СКАЖИ СПАСИБО»',T('«Скажи спасибо,'),S('s04')-.05,'#ffd23f',120,.14)}},
{id:'room',t0:S('s04'),t1:zap,in:'zoom',out:'whipR',f(t,u){repair(t,{paint:ss(S('s04'),zap,t)*.7+.3});wkP(t,{aR:[2.0+.3*Math.sin(t*6),.5]});clP(t,-1.2);camPath(u,[-2.0,1.2,3.6],[-.6,1.5,3.2],[0,1.6,-2],[.3,1.7,-2.4],[62,58],.02);fx.tags=[{txt:'РЕМОНТ',t:S('s04')+.05,xy:[.5,.12]},{txt:'ФРИЛАНС',t:T('фриланс:'),xy:[.5,.18]}]}},
{id:'later',t0:zap,t1:ich,in:'whipR',out:'whipUp',f(t,u){repair(t,{paint:1,bub:1});wkP(t,{expr:'neutral',aR:[.3,.2],propR:undefined,propL:'roller',aL:[.4,.3]});clP(t,-1.2,{talk:talk(t),aR:[1.2,.6]});linPath(u,[-1.8,1.7,3.4],[-1.4,1.8,2.9],[-.6,1.5,-1.8],[-.5,1.6,-1.8],[60,58],0)}},
{id:'gone',t0:ich,t1:S('s05'),in:'whipUp',out:'whipL',f(t,u){repair(t,{paint:1,col:'#6a6a80',u:1});wkP(t,{expr:'shock',aR:[.3,.2],aL:[2.2,.3],propR:undefined});const a=lerp(-.5,.3,u);cam.position.set(Math.sin(a)*4.4,lerp(1.4,1.9,u),-1.4+Math.cos(a)*4.4);cam.lookAt(0,1.5,-2.2);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.big('ПРОПАЛ',T('пропал.'),S('s05')-.05,'#ff5a5a',190,.15)}},
{id:'s100',t0:S('s05'),t1:bez,in:'whipL',out:'whipR',f(t,u){stacks(t,{g:ss(S('s05'),bez-.3,t)});camPath(u,[-2.4,4.8,3.6],[-1.2,5.2,3.8],[0,0,-2.0],[0,0,-2.4],[58,56],.03);fx.draw=K.big('100',S('s05')+.1,bez-.05,'#ffd23f',280,.13)}},
{id:'zero',t0:bez,t1:sav,in:'whipR',out:'whipUp',f(t,u){const gone=ss(c0-.3,c0+.6,t);stacks(t,{gone,bg:gone});topv(u,-.5,.6,9.6,8.0,0,0,-1.8,60);shake(t,c0+.1,.3,.7);const h=t-c0-.1;if(h>0){fx.crack={p:[0,.4,-1.8],a:clamp(h*3),seed:63};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('0',c0+.05,sav-.05,'#ff5a3a',360,.14)}},
{id:'adv',t0:sav,t1:S('s06'),in:'whipUp',out:'zoom',f(t,u){stacks(t,{adv:1,gone:ss(sav+.2,c50,t)});camPath(u,[2.6,2.8,4.2],[1.4,3.2,4.4],[-.6,.6,-1.6],[-.4,.7,-2.0],[62,58],-.03);fx.draw=K.big('УЖЕ 50',c50,S('s06')-.05,'#7dff9a',200,.13)}},
{id:'rule',t0:S('s06'),t1:sd,in:'zoom',out:'whipL',f(t,u){table([t>T('договор письменно,')-.1,t>avd-.1,0],t>avd);topv(u,-.4,.25,10.2,8.4,.6,0,0,60)}},
{id:'stage',t0:sd,t1:S('s07'),in:'whipL',out:'whipR',f(t,u){repair(t,{paint:1,col:'#58b8e8',u:1});wkP(t,{expr:'smile',aR:[.3,.2],propR:'cash',aL:[.3,.2]});clP(t,-1.0,{expr:'smile'});const a=lerp(.4,-.3,u);cam.position.set(Math.sin(a)*4.2,lerp(1.5,1.7,u),-1.4+Math.cos(a)*4.2);cam.lookAt(0,1.5,-2.0);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('ЭТАП → ОПЛАТА',sd+.05,S('s07')-.05,'#ffffff',130,.13)}},
{id:'thanks',t0:S('s07'),t1:S('s08'),in:'whipR',out:'whipUp',f(t,u){forest(t,{bn:1,coins:1,bg:'#ffd98a'});put(WF,'sly',WX,WZ,t);put(CR,'happy',CX,CZ,t);camPath(u,[-.2,.9,3.2],[.2,1.1,2.6],[.3,.9,-.9],[.4,1.0,-1.0],[58,54],.02);fx.draw=K.big('СПАСИБО ≠ ДЕНЬГИ',T('в карман'),S('s08')-.05,'#ffffff',120,.1)}},
{id:'next',t0:S('s08'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){forest(t,{coins:1,bg:'#ffd98a'});put(CR,'happy',CX-.6,CZ,t,Math.abs(Math.sin(t*5))*.12);camPath(u,[1.6,1.0,4.2],[.6,1.2,3.4],[0,1.2,-1],[-.1,1.3,-1.1],[58,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);wk.hide();cl.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
