import {kit} from '/lib_ru.js';
// 53 Морозко: просить прибавку вежливо и с цифрами (что сделал, цена рынка, сколько прошу); +10% к зарплате = 1,2 зарплаты за год
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Морозко (своя рисовка): синяя шуба, белая борода, посох со снежинкой
const moroz=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#8a5a30';c.fillRect(w*.83,h*.12,w*.035,h*.86);c.strokeRect(w*.83,h*.12,w*.035,h*.86);
 c.strokeStyle='#bfe8ff';c.lineWidth=10;for(let i=0;i<3;i++){const a=i*PI/3;c.beginPath();c.moveTo(w*.848+Math.cos(a)*w*.08,h*.1+Math.sin(a)*w*.08);c.lineTo(w*.848-Math.cos(a)*w*.08,h*.1-Math.sin(a)*w*.08);c.stroke()}c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#2a5ad0';c.beginPath();c.moveTo(w*.36,h*.42);c.lineTo(w*.64,h*.42);c.lineTo(w*.78,h*.97);c.lineTo(w*.22,h*.97);c.closePath();c.fill();c.stroke();
 c.fillStyle='#f4f8ff';c.fillRect(w*.47,h*.42,w*.06,h*.55);c.strokeRect(w*.47,h*.42,w*.06,h*.55);c.beginPath();c.roundRect(w*.2,h*.92,w*.6,h*.06,14);c.fill();c.stroke();
 c.fillStyle='#2a5ad0';c.beginPath();c.roundRect(w*.62,h*.45,w*.22,h*.09,20);c.fill();c.stroke();c.fillStyle='#f6c8a8';c.beginPath();c.arc(w*.84,h*.5,w*.05,0,7);c.fill();c.stroke();
 const hy=.26,hr=.24;c.fillStyle='#f6c8a8';c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#f4f8ff';c.beginPath();c.moveTo(w*.28,h*(hy+.02));c.quadraticCurveTo(w*.3,h*(hy+.3),w*.5,h*(hy+.34));c.quadraticCurveTo(w*.7,h*(hy+.3),w*.72,h*(hy+.02));c.quadraticCurveTo(w*.5,h*(hy+.1),w*.28,h*(hy+.02));c.fill();c.stroke();
 c.fillStyle='#2a5ad0';c.beginPath();c.moveTo(w*.27,h*(hy-.08));c.quadraticCurveTo(w*.5,h*(hy-.3),w*.73,h*(hy-.08));c.closePath();c.fill();c.stroke();c.fillStyle='#f4f8ff';c.beginPath();c.roundRect(w*.25,h*(hy-.1),w*.5,h*.05,16);c.fill();c.stroke();
 c.fillStyle='#ff9aa0';c.beginPath();c.arc(w*.5,h*(hy+.03),w*.05,0,7);c.fill();c.stroke();
 c.lineWidth=9;const ey=hy-.02;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.1),h*ey,w*.05,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.1),h*(ey+.004),w*.023,0,7);c.fill()}
 c.strokeStyle='#f4f8ff';c.lineWidth=16;for(const s of[-1,1]){c.beginPath();if(mood==='stern'){c.moveTo(w*(.5+s*.17),h*(ey-.05));c.lineTo(w*(.5+s*.04),h*(ey-.03))}else{c.moveTo(w*(.5+s*.17),h*(ey-.035));c.quadraticCurveTo(w*(.5+s*.1),h*(ey-.065),w*(.5+s*.04),h*(ey-.045))}c.stroke()}
 c.strokeStyle=INK;c.lineWidth=9;c.beginPath();if(mood==='stern'){c.moveTo(w*.44,h*(hy+.1));c.lineTo(w*.56,h*(hy+.1))}else c.arc(w*.5,h*(hy+.07),w*.06,PI*.15,PI*.85);c.stroke()};
const MZ={};['kind','stern'].forEach(md=>{MZ[md]=drawn(1.5,2.4,moroz(md),0,0,0);scene.add(MZ[md]);MZ[md].visible=false});
const putM=(md,x,z,t)=>{Object.values(MZ).forEach(m=>m.visible=false);const m=MZ[md];m.visible=true;m.position.set(x,Math.abs(Math.sin(t*2.4))*.02,z)};
// ---------- зимний лес
const gF=new THREE.Group();
gF.add(Object.assign(plane(200,200,lam('#eaf2ff'),0,0,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<40;i++){const R=rng(300+i);const z=-50+i*2.6+R()*1.5,x=(i%2?1:-1)*(3.2+R()*10);const tr=new THREE.Group();tr.add(cyl(.18,1,'#5a3a22',0,.5,0));for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.3-k*.3,1.5,8),lam(k%2?'#2a6a4a':'#1f5a40'));c.position.y=1.4+k*.9;c.castShadow=true;tr.add(c);const sn=new THREE.Mesh(new THREE.ConeGeometry(.55-k*.12,.5,8),lam('#ffffff'));sn.position.y=1.9+k*.9;tr.add(sn)}tr.position.set(x,0,z);tr.scale.setScalar(1+R()*.5);gF.add(tr)}
const bigFir=new THREE.Group();bigFir.position.set(-1.4,0,-2.2);gF.add(bigFir);bigFir.add(cyl(.3,1.2,'#5a3a22',0,.6,0));for(let k=0;k<4;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(2.0-k*.4,1.8,9),lam(k%2?'#2a6a4a':'#1f5a40'));c.position.y=1.7+k*1.1;c.castShadow=true;bigFir.add(c)}
// сундук (и для вида сверху)
const chest=new THREE.Group();chest.position.set(.9,0,-.4);gF.add(chest);chest.add(box(1.1,.6,.7,'#a0522d',0,.3,0));chest.add(box(1.14,.1,.74,'#ffc93a',0,.55,0));
const lid=new THREE.Group();lid.position.set(0,.6,-.35);chest.add(lid);lid.add(box(1.1,.22,.7,'#a0522d',0,.11,.35));lid.add(box(1.14,.06,.74,'#ffc93a',0,.04,.35));
const gold=new THREE.Group();chest.add(gold);for(let i=0;i<14;i++){const R=rng(70+i);const cn=cyl(.1,.03,'#ffd23f',(R()-.5)*.8,.58+R()*.06,(R()-.5)*.45);cn.rotation.x=(R()-.5)*.6;gold.add(cn)}
const glow=plane(.95,.55,new THREE.MeshBasicMaterial({color:'#ffdd66',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}),0,.7,0,-PI/2);chest.add(glow);
const NS=120;const snow=new THREE.InstancedMesh(new THREE.SphereGeometry(.03,5,4),new THREE.MeshBasicMaterial({color:'#ffffff'}),NS);snow.frustumCulled=false;gF.add(snow);const dm=new THREE.Matrix4();
gF.add(new THREE.HemisphereLight('#dfe9ff','#6a7aa0',3.0));sunRig(gF,[8,18,8],[0,0,-1],'#e8f0ff',2.6,14);addSet('forest',gF);
const pad=new Puppet('woman',1.8),dau=new Puppet('woman',1.8);[pad,dau].forEach(p=>scene.add(p.m));
const PD={col:'#d8263f',hair:'#c98a3a'},DD={col:'#8a3ad8',hair:'#3a2a1a'};
const forest=(t,{open=0,gl=0,coins=1,night=0}={})=>{gF.visible=true;scene.background=new THREE.Color('#9ab8e8').lerp(new THREE.Color('#2a3a7a'),night);lid.rotation.x=-open*1.9;gold.visible=coins>0;glow.material.opacity=gl;
 const R=rng(9);for(let i=0;i<NS;i++){const x=(R()-.5)*14,z=-6+R()*10,sp=.4+R()*.5;const y=((R()*5-t*sp)%5+5)%5;dm.makeTranslation(cam.position.x*.0+x+Math.sin(t+i)*.2,y,z);snow.setMatrixAt(i,dm)}snow.instanceMatrix.needsUpdate=true};
// ---------- офис: начальник и сотрудник
const rO=K.room('rO','#2a3a5a');
const desk=new THREE.Group();desk.position.set(.7,0,-1.6);rO.g.add(desk);desk.add(box(2.4,.1,1.1,'#6a4428',0,.82,0));desk.add(box(2.3,.78,.1,'#5a3418',0,.4,.5));desk.add(box(.5,.35,.05,'#15131a',.6,1.05,-.2));
rO.g.add(K.stand(1.7,.5,'#ffd23f',[{t:'ПРИБАВКА?',s:100,y:.55,c:'#15131a'}],-2.0,2.9,-3.9));
const boss=new Puppet('big',2.2),wrk=new Puppet('man',2.0);[boss,wrk].forEach(p=>scene.add(p.m));
const office=(t,{col='#2a3a5a',u=0}={})=>{resetRoom(rO);rO.col(u,col)};
// ---------- лист «как просить» сверху
const tA=K.makeTable('tA','КАК ПРОСИТЬ ПРИБАВКУ',[['ЧТО Я СДЕЛАЛ','результат в цифрах'],['СКОЛЬКО ПЛАТЯТ ДРУГИЕ','цена такой работы'],['СКОЛЬКО ПРОШУ','одна точная цифра']]);
const mug=new THREE.Group();mug.position.set(3.2,0,-1.6);tA.g.add(mug);mug.add(cyl(.45,.7,'#d8263f',0,.35,0));mug.add(cyl(.38,.02,'#5a3418',0,.71,0));
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#7dff9a')})};
// ---------- зарплата и 12 прибавок по 10%
const rZ=K.room('rZ','#24404a');
const sal=box(1.2,2.0,.9,'#ffc93a',-.8,1.0,-2.2);rZ.g.add(sal);
const adds=[];for(let i=0;i<12;i++){const b=box(1.2,.19,.9,i>=10?'#7dff9a':'#ffe08a',.8,0,-2.2);rZ.g.add(b);adds.push(b)}
const line=box(4.4,.03,.03,'#ff5a5a',0,2.0,-1.74);rZ.g.add(line);
rZ.g.add(K.stand(1.3,.42,'#fff',[{t:'ЗАРПЛАТА',s:80,y:.55,c:'#15131a'}],-.8,2.35,-1.7));const lbA=K.stand(1.3,.42,'#fff',[{t:'+10% × 12',s:80,y:.55,c:'#1f8a4a'}],.8,2.8,-1.7);rZ.g.add(lbA);
const salary=(t,{n=0,col='#24404a',u=0}={})=>{resetRoom(rZ);rZ.col(u,col);adds.forEach((b,i)=>{const k=ease(clamp(n-i));b.visible=k>0;b.position.y=lerp(3.6,.1+i*.2,k)});line.visible=n>10.5};
// ---------- город
K.billboard(city.g,'КАК ПРОСИТЬ,','ЧТОБЫ ДАЛИ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ТРИШКИН КАФТАН',0,9,24,16,9,'#ff9a6a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const mol=T('Молчание может стоить'),padc=T('Падчерица'),sund=T('сундук добра.'),nich=T('ничего.'),plat=T('платите больше» —'),skol=T('сколько за такую работу'),cel=T('целая зарплата'),vezh=T('отвечала вежливо —');
const HOOK=['БОИТЕСЬ ПРОСИТЬ','ПРИБАВКУ?'];
const shots=[
{id:'hook',t0:0,t1:mol,out:'whipR',f(t,u){forest(t);putM('kind',.4,-.6,t);pad.pose(-.6,.6,{expr:'shock',look:.5,aL:[.5,.6],aR:[.5,.6],blink:blink(t),...PD});camPath(u,[-.8,.7,5.2],[-.2,1.0,3.9],[-.1,1.5,-.4],[0,1.6,-.4],[60,54],.03);fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'silent',t0:mol,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){office(t,{col:'#3a2a4a',u:ss(0,1,u)});boss.pose(.9,-2.3,{expr:'neutral',look:-.5,blink:blink(t),col:'#3a3a3a',tie:'#d02a1a'});wrk.pose(-1.3,-.4,{expr:'shock',look:.6,aL:[.2,.4],aR:[.2,.4],blink:blink(t,.4),col:'#2a8a7a'});
 const a=lerp(-.7,-.2,u);cam.position.set(-.3+Math.sin(a)*4.2,lerp(1.5,1.8,u),-1.0+Math.cos(a)*4.2);cam.lookAt(-.2,1.6,-1.2);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.hook(HOOK,0,S('s02')-.05);fx.tags=[{txt:'−1,2 ЗАРПЛАТЫ В ГОД',t:T('больше зарплаты'),xy:[.5,.38]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'ask',t0:S('s03'),t1:padc,in:'whipL',out:'whipR',f(t,u){forest(t,{night:.4});putM('kind',.5,-.8,t);pad.pose(-1.0,-.2,{expr:'neutral',look:.5,blink:blink(t),...PD});
 camPath(u,[4.0,3.2,4.2],[2.2,1.6,3.2],[0,1.2,-.6],[-.1,1.4,-.6],[58,54],-.02);fx.tags=[{txt:'ТЕПЛО ЛИ ТЕБЕ?',t:T('тепло ли тебе?'),xy:[.5,.12]}]}},
{id:'polite',t0:padc,t1:sund,in:'whipR',out:'whipUp',f(t,u){forest(t,{night:.4});putM('kind',.5,-.8,t);pad.pose(-1.0,-.2,{expr:'smile',look:.5,talk:talk(t,t>vezh&&t<vezh+1),aL:[.5,1.4],blink:blink(t),...PD});
 const a=lerp(.6,.1,u);cam.position.set(-.2+Math.sin(a)*3.6,lerp(1.3,1.5,u),-.4+Math.cos(a)*3.6);cam.lookAt(-.3,1.45,-.5);cam.fov=56;cam.updateProjectionMatrix();fx.tags=[{txt:'ТЕПЛО, МОРОЗУШКО',t:vezh,xy:[.5,.12]}]}},
{id:'chest',t0:sund,t1:S('s04'),in:'whipUp',out:'whipL',f(t,u){const k=ss(sund,sund+.6,t);forest(t,{open:k,gl:k*.5});top(u,-.5,.4,4.4,3.3,.9,-.4,56);fx.draw=K.big('СУНДУК ДОБРА',sund+.05,S('s04')-.05,'#ffd23f',170,.16)}},
{id:'rude',t0:S('s04'),t1:nich,in:'whipL',out:'whipUp',f(t,u){forest(t,{night:.7});putM('stern',.5,-.8,t);dau.pose(-1.0,-.2,{expr:'rage',look:.5,talk:talk(t),aR:[1.9,.3],aL:[1.2,1.0],blink:false,...DD});
 linPath(u,[-3.8,1.2,2.4],[-2.6,1.4,3.6],[-.4,1.4,-.5],[-.2,1.5,-.5],[56,54],0);fx.tags=[{txt:'ДАВАЙ БОЛЬШЕ!',t:T('и требовала —'),xy:[.5,.12]}]}},
{id:'nothing',t0:nich,t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){const h=t-nich;forest(t,{open:1-ss(nich,nich+.2,t),coins:0,night:.7});top(u,.3,-.2,4.0,3.5,.9,-.4,56);
 const k=h>0?Math.max(0,1-h/.5):0;cam.position.x+=Math.sin(t*53)*.12*k;cam.position.z+=Math.sin(t*41)*.06*k;if(h>.15){fx.crack={p:[.9,.7,-.4],a:clamp((h-.15)*3),seed:21};fx.flash=Math.max(0,1-(h-.15)/.25)}
 fx.draw=K.big('НИЧЕГО',nich+.15,S('s05')-.05,'#ff5a5a',220,.16)}},
{id:'demand',t0:S('s05'),t1:S('s06'),in:'zoom',out:'whipR',f(t,u){office(t,{col:'#6a2a2a',u:ss(0,.6,u)});boss.pose(.9,-2.3,{expr:t>plat?'angry':'neutral',look:-.5,blink:blink(t),col:'#3a3a3a',tie:'#d02a1a'});wrk.pose(-.9,-1.1,{expr:'rage',look:.6,aR:[1.9,.2],talk:talk(t),blink:false,col:'#2a8a7a'});
 camPath(u,[-2.2,1.3,2.6],[-1.0,1.6,1.6],[-.4,1.6,-1.6],[0,1.7,-1.8],[62,56],.03);fx.tags=[{txt:'«МНЕ МАЛО!»',t:T('«Мне мало,'),xy:[.5,.12]}]}},
{id:'calm',t0:S('s06'),t1:skol,in:'whipR',out:'whipUp',f(t,u){office(t,{col:'#2a5a4a',u:ss(0,1,u)});boss.pose(.9,-2.3,{expr:'neutral',look:-.5,blink:blink(t),col:'#3a3a3a',tie:'#d02a1a'});wrk.pose(-.9,-1.1,{expr:'smile',look:.6,aR:[1.1,.9],propR:'clip',talk:talk(t),blink:blink(t,.4),col:'#2a8a7a'});
 const a=lerp(-.2,.4,u);cam.position.set(Math.sin(a)*4.0,lerp(1.6,1.9,u),-1.2+Math.cos(a)*4.0);cam.lookAt(0,1.6,-1.4);cam.fov=58;cam.updateProjectionMatrix();fx.tags=[{txt:'С ЦИФРАМИ',t:T('и с цифрами:'),xy:[.5,.12]}]}},
{id:'list',t0:skol,t1:S('s07'),in:'whipUp',out:'whipL',f(t,u){table([1,t>skol+.05,t>T('и сколько прошу.')]);top(u,-.5,.2,10.5,8.2,0,0,58)}},
{id:'adds',t0:S('s07'),t1:cel,in:'whipL',out:'whipUp',f(t,u){salary(t,{n:ss(S('s07')+.2,cel,t)*10});camPath(u,[.9,1.9,3.8],[.4,2.0,3.5],[.1,1.4,-2.2],[0,1.5,-2.2],[66,64],.02);fx.draw=K.big('+10%',S('s07')+.1,T('за год это')-.02,'#7dff9a',240,.13);fx.tags=[{txt:'12 МЕСЯЦЕВ',t:T('за год это'),xy:[.5,.12]}]}},
{id:'year',t0:cel,t1:S('s08'),in:'whipUp',out:'zoom',f(t,u){salary(t,{n:10+ss(cel,T('и ещё пятая часть.')+.3,t)*2,col:'#2a5a3a',u:ss(0,1,u)});const a=lerp(-.3,.2,u);cam.position.set(Math.sin(a)*5.6,lerp(2.0,2.4,u),-2.2+Math.cos(a)*5.6);cam.lookAt(0,1.4,-2.2);cam.fov=64;cam.updateProjectionMatrix();fx.draw=K.big('= 1,2 ЗАРПЛАТЫ',T('и ещё пятая часть.'),S('s08')-.05,'#7dff9a',130,.13)}},
{id:'end',t0:S('s08'),t1:S('s09'),in:'zoom',out:'whipR',f(t,u){forest(t,{open:1,gl:.6});putM('kind',-.9,-1.0,t);pad.pose(.5,.2,{expr:'smile',look:.5,aL:[1.6,.3],blink:blink(t),...PD});
 camPath(u,[2.2,1.5,5.6],[1.0,1.8,4.8],[-.2,1.2,-.5],[-.2,1.3,-.5],[56,52],-.03);fx.draw=K.big('ВЕЖЛИВО + ЦИФРА',T('но с цифрой.')-.4,S('s09')-.05,'#ffd23f',150,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
const BB=Object.values(MZ);
shots.forEach(s=>{const f=s.f;s.f=function(t,u){[pad,dau,boss,wrk].forEach(p=>p.hide());BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
