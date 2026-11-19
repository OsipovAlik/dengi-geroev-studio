import {kit} from '/lib_ru.js';
// 51 Братец Иванушка: покупка на эмоциях — копытце; 5 мелочей по 3% = −15% в месяц, ≈1,8 зарплаты в год; правило колодца: сутки, неделя
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- козлёночек (своя рисовка)
const goat=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;c.fillStyle='#f4f1ea';
 c.beginPath();c.roundRect(w*.27,h*.55,w*.46,h*.3,w*.14);c.fill();c.stroke();for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.15)-w*.04,h*.8,w*.08,h*.17,10);c.fill();c.stroke()}
 const hy=.33,hr=.24;c.fillStyle='#c9a46a';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.09),h*(hy-hr*.8));c.quadraticCurveTo(w*(.5+s*.2),h*(hy-hr*1.6),w*(.5+s*.24),h*(hy-hr*1.3));c.lineTo(w*(.5+s*.15),h*(hy-hr*.7));c.closePath();c.fill();c.stroke()}
 c.fillStyle='#f4f1ea';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*hr*1.15),h*(hy-.02),w*.1,h*.04,s*-.3,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();c.fillStyle='#f6c8d0';c.beginPath();c.ellipse(w*.5,h*(hy+.09),w*.11,h*.06,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.035),h*(hy+.085),w*.012,0,7);c.fill()}
 c.lineWidth=9;c.fillStyle='#fff';const ey=hy-.04;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.09),h*ey,w*.055,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.09),h*(ey+.005),w*.025,0,7);c.fill()}
 if(mood==='sad')for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.15),h*(ey-.03));c.lineTo(w*(.5+s*.04),h*(ey-.055));c.stroke()}
 c.fillStyle='#f4f1ea';c.beginPath();c.moveTo(w*.46,h*(hy+.17));c.lineTo(w*.5,h*(hy+.25));c.lineTo(w*.54,h*(hy+.17));c.fill();c.stroke()};
const G={happy:null,sad:null};
// ---------- луг, дорога, копытце, колодец
const gM=new THREE.Group();
gM.add(Object.assign(plane(200,200,lam('#b8cc5a'),0,0,0,-PI/2),{receiveShadow:true}));
gM.add(Object.assign(plane(3,200,lam('#d8b878'),0,.01,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<26;i++){const R=rng(900+i);const z=-60+i*5+R()*2,x=(i%2?1:-1)*(5+R()*9);const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0));const cr=new THREE.Mesh(new THREE.SphereGeometry(1.6+R()*.6,8,6),lam(i%3?'#5a9a3a':'#7ab84a'));cr.position.y=3.0;cr.castShadow=true;tr.add(cr);tr.position.set(x,0,z);gM.add(tr)}
const hoofTex=canvasTex(512,512,(c,w,h)=>{c.lineWidth=14;c.strokeStyle='#5a3a1a';c.fillStyle='#3d7fc6';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.17),h*.52,w*.15,h*.32,s*.15,0,7);c.fill();c.stroke()}c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=8;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.17),h*.42,w*.06,PI*1.1,PI*1.6);c.stroke()}});
const hoof=plane(.9,.9,new THREE.MeshBasicMaterial({map:hoofTex,transparent:true,depthWrite:false}),.9,.02,0,-PI/2);gM.add(hoof);
const well=new THREE.Group();well.position.set(-2.5,0,-14);gM.add(well);well.add(cyl(.9,.9,'#9a9aa6',0,.45,0));well.add(cyl(.72,.05,'#2a4a8a',0,.91,0));for(const x of[-.85,.85])well.add(box(.12,2.0,.12,'#6a4428',x,1.0,0));
const wr=new THREE.Mesh(new THREE.ConeGeometry(1.4,.9,4),lam('#c84a2a'));wr.rotation.y=PI/4;wr.position.y=2.4;wr.castShadow=true;well.add(wr);well.add(K.stand(2.2,.6,'#fff6d0',[{t:'КОЛОДЕЦ',s:100,y:.55,c:'#15131a'}],0,3.25,0));
const bucket=cyl(.2,.3,'#8a6a3a',0,1.2,0);well.add(bucket);
const goatM={};['happy','sad'].forEach(md=>{goatM[md]=drawn(1.15,1.4,goat(md),0,0,0);gM.add(goatM[md])});
const NP=34;const puff=new THREE.InstancedMesh(new THREE.SphereGeometry(.14,8,6),lam('#ffffff'),NP);puff.frustumCulled=false;gM.add(puff);
gM.add(new THREE.HemisphereLight('#ffffff','#8a7a5a',3.1));sunRig(gM,[-8,20,10],[0,0,-2],'#fff1d0',2.8,14);addSet('meadow',gM);
const ivan=new Puppet('man',1.45),alyo=new Puppet('woman',1.95);[ivan,alyo].forEach(p=>scene.add(p.m));
const IV={col:'#3a7ad8',hair:'#e8b84a'},AL={col:'#d8263f',hair:'#8a4a1a'};
const dm=new THREE.Matrix4();
const meadow=(t,{hot=0}={})=>{gM.visible=true;scene.background=new THREE.Color(SKY).lerp(new THREE.Color('#ffb46a'),hot);Object.values(goatM).forEach(m=>m.visible=false);puff.visible=false;ivan.hide();alyo.hide()};
const putG=(md,x,z,t)=>{const m=goatM[md];m.visible=true;m.position.set(x,.7+Math.abs(Math.sin(t*4))*.03,z);face(m)};
const doPuff=(k,x,z)=>{puff.visible=k>0&&k<1;if(!puff.visible)return;const R=rng(41);for(let i=0;i<NP;i++){const a=R()*6.28,sp=.4+R()*1.2,s=(1-k)*(.6+R()*.8)+.05;dm.makeScale(s*2,s*2,s*2);dm.setPosition(x+Math.cos(a)*sp*k,.5+R()*1.2*k+.3,z+Math.sin(a)*sp*k);puff.setMatrixAt(i,dm)}puff.instanceMatrix.needsUpdate=true};
// ---------- магазин: 5 мелочей по 3%
const rS=K.room('rS','#4a2a5a');
const shelf=new THREE.Group();shelf.position.set(0,0,-3.4);rS.g.add(shelf);for(const y of[.9,1.8,2.7])shelf.add(box(5.2,.1,.8,'#7a4a2a',0,y,0));for(const x of[-2.6,2.6])shelf.add(box(.12,3.0,.8,'#5a3418',x,1.5,0));
shelf.add(K.stand(3.6,.8,'#ffd23f',[{t:'ХОЧУ СЕЙЧАС!',s:110,y:.55,c:'#15131a'}],0,3.45,.3));
const ITC=['#ff6a8a','#4ac0ff','#7dff9a','#ffb43a','#c08aff'];
const items=ITC.map((c,i)=>{const g=new THREE.Group();g.add(i%2?cyl(.22,.5,c,0,.25,0):box(.45,.5,.35,c,0,.25,0));const l=K.stand(.62,.34,'#fff',[{t:'3%',s:80,y:.55,c:'#d02a1a'}],0,.72,0);g.add(l);rS.g.add(g);return g});
const cart=new THREE.Group();cart.add(box(1.6,.12,1.1,'#9aa3a8',0,.5,0));for(const [w,d,x,z] of[[1.6,.06,0,.55],[1.6,.06,0,-.55],[.06,1.1,.8,0],[.06,1.1,-.8,0]])cart.add(box(w,.5,d,'#c9ced1',x,.8,z));for(const x of[-.6,.6])for(const z of[-.4,.4])cart.add(cyl(.1,.12,INK,x,.08,z).rotateX(PI/2));cart.position.set(.6,0,-.4);rS.g.add(cart);
const shopper=new Puppet('man',2.1);scene.add(shopper.m);
const shop=(t,{n=0,back=0,col='#4a2a5a',u=0,expr='smile'}={})=>{resetRoom(rS);rS.col(u,col);shopper.hide();
 items.forEach((g,i)=>{const t0=n-i;const k=ease(clamp(t0))*(1-ease(clamp(back*5-i)));const sx=-2.0+i*1.0,sy=1.86,sz=-3.4;g.position.set(lerp(sx,.2+(i%3)*.4,k),lerp(sy,.62+Math.floor(i/3)*.5,k)+Math.sin(k*PI)*1.0,lerp(sz,-.4+(i%2)*.3,k));g.rotation.y=0})
 shopper.pose(-1.6,-.6,{expr,look:.6,aR:[.9,.9],aL:[.4,.6],blink:blink(t),col:'#2a8a7a',talk:0})};
// ---------- зарплата: блоки по 10%
const rZ=K.room('rZ','#2a4a5a');
const blocks=[];for(let s=0;s<2;s++)for(let i=0;i<10;i++){const b=box(1.4,.3,.9,'#ffc93a',0,0,0);rZ.g.add(b);blocks.push(b)}
const zTags=[0,1].map(s=>{const l=K.stand(1.9,.55,'#fff',[{t:'ЗАРПЛАТА',s:80,y:.55,c:'#15131a'}],s?1.3:-1.3,3.75,-2.0);rZ.g.add(l);return l});
const red=lam('#e8442a'),gold=lam('#ffc93a');
const salary=(t,{one=0,drop=0,year=-1,col='#2a4a5a',u=0}={})=>{resetRoom(rZ);rZ.col(u,col);
 blocks.forEach((b,j)=>{const s=Math.floor(j/10),i=j%10;const x=one?0:(s?1.3:-1.3);b.visible=true;b.material=gold;b.rotation.set(0,0,0);b.scale.set(1,1,1);let y=.17+i*.33,z=-2.0,xx=x;
  if(one){b.scale.y=.5;y=.09+j*.165;if(j>=17){b.material=red;const k=clamp(drop-(j-17)*.15);xx+=k*1.1;y=lerp(y,.09,ease(k));z+=k*.9;b.rotation.z=-k*.8}}
  if(year>=0){const lost=(s===0)?i<8||true:i<8;const idx=s*10+i;const gone=idx<18;if(gone){b.material=red;const k=clamp(year*1.4-idx*.03);if(k>0){const R=rng(idx+3);xx+=(R()-.5)*6*k;y+=(R()*3)*k-2.5*k*k;z+=(R()*3)*k;b.rotation.set(k*R()*6,k*R()*6,k*R()*6)}}}
  b.position.set(xx,Math.max(.15,y),z)});zTags.forEach((l,s)=>{l.visible=!one||s===0;l.position.x=one?0:(s?1.3:-1.3)})};
// ---------- стол сверху: правило колодца
const tA=K.makeTable('tA','ПРАВИЛО КОЛОДЦА',[['ЗАХОТЕЛ','подожди сутки'],['ДОРОЖЕ 10% ЗАРПЛАТЫ','подожди неделю'],['ЖЕЛАНИЕ ПРОШЛО?','деньги остались']]);
const cal=new THREE.Group();cal.position.set(-3.5,0,-1.2);tA.g.add(cal);cal.add(plane(2.0,2.2,lam('#fff'),0,.03,0,-PI/2));
const calTex=canvasTex(400,440,(c,w,h)=>{c.fillStyle='#d02a1a';c.fillRect(0,0,w,80);c.fillStyle='#fff';c.font='800 50px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('НЕДЕЛЯ',w/2,42);c.fillStyle=INK;c.font='800 54px Pop';for(let i=0;i<7;i++){c.fillText(String(i+1),60+(i%4)*92,150+Math.floor(i/4)*130)}});
cal.add(plane(1.9,2.1,lam('#fff',{map:calTex}),0,.04,0,-PI/2));
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- город
K.billboard(city.g,'ПРАВИЛО,','КОТОРОЕ ОСТАНОВИТ ТРАТЫ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ЛИСА И ЖУРАВЛЬ',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const okot=T('о которых'),sAl=T('Сестрица Алёнушка'),stal=T('и стал'),kozl=T('козлёночком.'),pyat=T('Пять мелочей'),m15=T('минус 15%'),dve=T('почти две зарплаты.'),ned=T('Дороже 10% зарплаты —'),mnog=T('Многие желания');
const BB=[...Object.values(goatM)];
const HOOK=['ДЕНЬГИ УХОДЯТ','НА МЕЛОЧИ?'];
const shots=[
{id:'hook',t0:0,t1:okot,out:'whipR',f(t,u){meadow(t,{hot:.5});ivan.pose(.4,1.2,{expr:'angry',look:.5,aR:[1.4,1.2],blink:blink(t),...IV});alyo.pose(-.8,.8,{expr:'neutral',look:.5,aL:[.6,.6],blink:blink(t,.3),...AL});camPath(u,[-.6,1.0,4.6],[-.1,1.1,3.6],[-.1,1.25,.9],[-.1,1.3,.9],[60,56],.03);fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'regret',t0:okot,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){shop(t,{n:5,expr:'shock',col:'#5a2a3a',u:ss(0,1,u)});const a=lerp(.5,.1,u);cam.position.set(-.8+Math.sin(a)*3.2,lerp(1.6,1.9,u),-.4+Math.cos(a)*3.2);cam.lookAt(-.6,1.5,-.6);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.hook(HOOK,0,S('s02')-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'road',t0:S('s03'),t1:sAl,in:'whipL',out:'whipR',f(t,u){meadow(t,{hot:.5});const z=lerp(6,3,u);ivan.pose(.3,z,{expr:'angry',look:.5,walk:t*3,aR:[1.4,1.2],blink:blink(t),...IV});alyo.pose(-.7,z-.4,{expr:'neutral',look:.5,walk:t*3,blink:blink(t,.3),...AL});
 linPath(u,[5.5,1.6,z+2],[4.8,1.5,z-1.5],[0,1.1,z+.6],[0,1.1,z-.6],[52,52],0);fx.tags=[{txt:'ПРЯМО СЕЙЧАС',t:T('прямо сейчас.'),xy:[.5,.15]}]}},
{id:'well',t0:sAl,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){meadow(t,{hot:.5});ivan.pose(.3,3,{expr:'angry',look:.5,blink:blink(t),...IV});alyo.pose(-.7,2.6,{expr:'smile',look:.5,aL:[2.0,.1],talk:talk(t),blink:blink(t,.3),...AL});
 camPath(u,[.8,1.4,7.4],[-.6,4.5,9.5],[-.4,1.4,2.6],[-2.0,1.6,-12],[56,50],0);fx.tags=t>T('потерпи до колодца.')?[{txt:'ПОТЕРПИ',t:T('потерпи до колодца.'),xy:[.5,.15]}]:[]}},
{id:'hoof',t0:S('s04'),t1:stal,in:'whipUp',out:'whipL',f(t,u){meadow(t,{hot:.5});ivan.pose(.5,.6,{expr:'smile',look:.5,lean:.3,blink:blink(t),...IV});top(u,-.6,.4,4.6,3.4,.8,0,56);fx.draw=K.big('КОПЫТЦЕ',S('s04')+.15,stal-.05,'#9ad0ff',150,.13)}},
{id:'goat',t0:stal,t1:S('s05'),in:'whipL',out:'zoom',f(t,u){meadow(t);const k=ss(kozl-.15,kozl+.7,t);if(t<kozl+.05)ivan.pose(.5,.6,{expr:'shock',look:.5,blink:false,...IV});else putG('sad',.5,.6,t);alyo.pose(-.8,.2,{expr:t>kozl?'shock':'neutral',look:.5,aL:[1.2,.6],aR:[1.2,.6],blink:blink(t,.3),...AL});doPuff(k,.5,.6);
 const a=lerp(.5,.15,u);cam.position.set(Math.sin(a)*4.4,lerp(1.2,1.4,u),.4+Math.cos(a)*4.4);cam.lookAt(0,1.0,.4);cam.fov=56;cam.updateProjectionMatrix();const h=t-kozl;if(h>0)fx.flash=Math.max(0,.7-h/.3)}},
{id:'shop',t0:S('s05'),t1:pyat,in:'zoom',out:'whipR',f(t,u){shop(t,{n:0,expr:'smile'});camPath(u,[-1.8,1.3,3.2],[-.2,1.7,2.4],[0,2.6,-3.4],[0,2.3,-3.0],[70,64],.04);fx.tags=[{txt:'ТО ЖЕ КОПЫТЦЕ',t:T('то же копытце.'),xy:[.5,.12]}]}},
{id:'items',t0:pyat,t1:m15,in:'whipR',out:'whipUp',f(t,u){shop(t,{n:(t-pyat)/(m15-pyat)*6,expr:'smile'});camPath(u,[1.8,2.2,2.4],[1.0,2.6,1.6],[-.4,1.4,-2.0],[.2,1.0,-1.0],[64,60],-.03);fx.draw=K.big('5 × 3%',T('по 3% зарплаты —'),m15-.05,'#ffd23f',190,.13)}},
{id:'minus',t0:m15,t1:S('s06'),in:'whipUp',out:'whipL',f(t,u){salary(t,{one:1,drop:ss(m15+.1,m15+1.2,t)*1.3});camPath(u,[-1.6,1.6,3.0],[-.4,2.0,2.4],[0,1.7,-2.0],[.4,1.6,-1.6],[64,60],.03);fx.draw=K.big('−15% В МЕСЯЦ',m15+.05,S('s06')-.05,'#ff8a5a',150,.13)}},
{id:'year',t0:S('s06'),t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){const h=t-dve-.3;salary(t,{year:h>0?h:-1,col:'#8a2a2a',u:ss(0,.3,h)});
 camPath(u,[0,1.8,3.6],[0,2.0,2.8],[0,1.8,-2.0],[0,1.7,-2.0],[64,58],.02);const k=h>0?Math.max(0,1-h/.55):0;cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>0){fx.crack={p:[0,1.6,-1.6],a:clamp(h*3),seed:7};fx.flash=Math.max(0,1-h/.25)}fx.tags=[{txt:'ЗА ГОД',t:S('s06')+.05,xy:[.5,.12]}];fx.draw=K.big('≈ 2 ЗАРПЛАТЫ',dve+.3,S('s07')-.05,'#ff5a5a',170,.3)}},
{id:'rule',t0:S('s07'),t1:ned,in:'whipUp',out:'whipR',f(t,u){table([t>T('подожди сутки.'),0,0],'#7dff9a');top(u,-.5,.2,10.5,8.0,0,0,58);fx.draw=K.big('СУТКИ',T('подожди сутки.'),ned-.05,'#ffffff',190,.13)}},
{id:'week',t0:ned,t1:mnog,in:'whipR',out:'whipL',f(t,u){table([1,t>ned+.3,0],'#7dff9a');top(u,.3,-.3,7.5,6.4,-1.6,-.6,58);fx.draw=K.big('НЕДЕЛЮ',T('неделю.'),mnog-.05,'#ffd23f',190,.13)}},
{id:'pass',t0:mnog,t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){shop(t,{n:5,back:ss(mnog+.2,S('s08')-.2,t),expr:'smile',col:'#2a5a4a',u:ss(0,1,u)});camPath(u,[1.6,1.6,3.2],[.4,1.8,2.6],[0,1.8,-3.0],[0,2.0,-3.2],[66,62],-.03);fx.tags=[{txt:'ЖЕЛАНИЕ ПРОШЛО',t:T('пройдут сами.'),xy:[.5,.12]}]}},
{id:'sum',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){meadow(t);ivan.pose(-1.6,-12.6,{expr:'smile',look:.5,aR:[1.6,.4],blink:blink(t),...IV});alyo.pose(-3.4,-12.6,{expr:'smile',look:.5,blink:blink(t,.3),...AL});
 const a=lerp(-.5,.3,u);cam.position.set(-2.5+Math.sin(a)*6,lerp(1.4,2.6,ease(u)),-14+Math.cos(a)*6);cam.lookAt(-2.5,1.4,-13.6);cam.fov=56;cam.updateProjectionMatrix();fx.draw=K.big('КУПИ ЗАВТРА',T('купи завтра.'),S('s09')-.05,'#7dff9a',170,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){[ivan,alyo,shopper].forEach(p=>p.hide());f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
