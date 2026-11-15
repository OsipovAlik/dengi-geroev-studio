import {kit} from '/lib_ru.js';
// 45 Квартет: пересадка (новый банк/карта/приложение) не чинит бюджет; чинит план 50/30/20 до зарплаты
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,blink,box,cyl,plane,lam,label,canvasTex,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.y=Math.atan2(cam.position.x-p.x,cam.position.z-p.z)};
// ---------- музыканты (своя рисовка): тело, голова, инструмент
const beast=(kind)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 const fur={monkey:'#a8662e',donkey:'#9a9aa8',goat:'#f2efe6',bear:'#7a4a26'}[kind],muz={monkey:'#f0c896',donkey:'#d8d8e0',goat:'#ffffff',bear:'#c89a6a'}[kind];
 // тело
 c.fillStyle=fur;c.beginPath();c.roundRect(w*.22,h*.5,w*.56,h*.44,w*.18);c.fill();c.stroke();
 // уши / рога
 c.fillStyle=fur;if(kind==='donkey'){for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.16),h*.1,w*.06,h*.12,s*.3,0,7);c.fill();c.stroke()}}
 if(kind==='monkey'){for(const s of[-1,1]){c.fillStyle=muz;c.beginPath();c.arc(w*(.5+s*.27),h*.3,w*.08,0,7);c.fill();c.stroke()}}
 if(kind==='bear'){for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.2),h*.15,w*.08,0,7);c.fill();c.stroke()}}
 if(kind==='goat'){c.fillStyle='#c8b080';for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.08),h*.16);c.quadraticCurveTo(w*(.5+s*.28),h*.0,w*(.5+s*.3),h*.12);c.lineTo(w*(.5+s*.14),h*.2);c.closePath();c.fill();c.stroke()}}
 // голова
 c.fillStyle=fur;c.beginPath();c.arc(w*.5,h*.31,w*.22,0,7);c.fill();c.stroke();
 c.fillStyle=muz;c.beginPath();if(kind==='donkey'||kind==='goat')c.ellipse(w*.5,h*.4,w*.13,h*.08,0,0,7);else c.ellipse(w*.5,h*.37,w*.14,h*.07,0,0,7);c.fill();c.stroke();
 if(kind==='goat'){c.fillStyle='#fff';c.beginPath();c.moveTo(w*.45,h*.46);c.lineTo(w*.5,h*.56);c.lineTo(w*.55,h*.46);c.closePath();c.fill();c.stroke()}
 c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*.27,w*.045,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*.275,w*.02,0,7);c.fill()}
 c.beginPath();c.arc(w*.5,h*.38,w*.022,0,7);c.fill();
 // инструмент
 const big={monkey:.6,donkey:.7,goat:.95,bear:1.15}[kind];c.save();c.translate(w*.52,h*.73);c.rotate(-.35);c.scale(big,big);
 c.fillStyle='#d9822e';c.beginPath();c.ellipse(0,h*.06,w*.13,h*.09,0,0,7);c.fill();c.stroke();c.beginPath();c.ellipse(0,-h*.06,w*.1,h*.07,0,0,7);c.fill();c.stroke();
 c.fillStyle='#5a3418';c.fillRect(-w*.02,-h*.3,w*.04,h*.26);c.strokeRect(-w*.02,-h*.3,w*.04,h*.26);c.restore();
 c.lineWidth=7;c.beginPath();c.moveTo(w*.18,h*.58);c.lineTo(w*.82,h*.8);c.stroke()};
const kinds=['monkey','donkey','goat','bear'];
// ---------- сцена-поляна (кирпичный зал)
const rS=K.room('rS','#3a4a7a');
const sign=K.stand(2.6,.7,'#fff',[{t:'КВАРТЕТ',s:96,y:.54,c:'#3a2a5a'}],0,3.7,-3.9);rS.g.add(sign);
const fals=K.stand(2.6,.8,'#ff5a5a',[{t:'♪ ФАЛЬШЬ ♪',s:90,y:.54,c:'#fff'}],-1.5,3.3,-3.2);rS.g.add(fals);
const plan=K.stand(2.0,.7,'#7dff9a',[{t:'ПЛАН',s:96,y:.54,c:'#15131a'}],1.5,3.3,-3.2);rS.g.add(plan);
const SEATS=[[-1.8,-1.3],[-.6,-1.9],[.6,-1.9],[1.8,-1.3]];
const chairs=SEATS.map(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);g.add(box(.7,.1,.7,'#8a4a2a',0,.5,0),box(.7,.8,.1,'#8a4a2a',0,.9,-.33));for(const[a,b]of[[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3]])g.add(box(.07,.5,.07,'#5a2a1a',a,.25,b));rS.g.add(g);return g});
const band=kinds.map(k=>{const m=drawn(1.4,1.7,beast(k),0,0,0);rS.g.add(m);return m});
const notes=[0,1,2].map(i=>{const m=drawn(.5,.5,(c,w,h)=>{c.fillStyle='#ffd23f';c.strokeStyle=INK;c.lineWidth=8;c.font=`800 ${h*.9}px Pop`;c.textAlign='center';c.textBaseline='middle';c.strokeText('♪',w/2,h/2);c.fillText('♪',w/2,h/2)},0,0,0);rS.g.add(m);return m});
const PERM=[[0,1,2,3],[1,0,3,2],[3,2,1,0]];
const stage=(t,a,b,k,mood)=>{resetRoom(rS);rS.col(mood==='good'?1:0,'#e0b040');fals.visible=mood==='bad';plan.visible=mood==='good';
 band.forEach((m,i)=>{const pa=SEATS[PERM[a][i]],pb=SEATS[PERM[b][i]];const e=ease(clamp(k));const hop=Math.sin(e*PI)*.6;m.rotation.set(0,0,0);m.position.set(lerp(pa[0],pb[0],e),1.18+hop+Math.abs(Math.sin(t*6+i))*.04,lerp(pa[1],pb[1],e)+.15);face(m)});
 notes.forEach((n,i)=>{const ph=(t*.7+i/3)%1;n.position.set(-1.2+i*1.2+Math.sin(t*3+i)*.2,2.0+ph*1.4,-1.6);n.material.opacity=1-ph;face(n)})};
// ---------- телефон с приложениями
const rP=K.room('rP','#2a3a5a');
const phone=new THREE.Group();phone.position.set(0,2.0,-2.8);rP.g.add(phone);phone.add(box(2.2,3.9,.22,'#1b1d24',0,0,0));
const scr=(title,col,icon)=>{const m=plane(1.95,3.55,new THREE.MeshBasicMaterial({map:canvasTex(512,930,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(0,0,w,110);c.fillStyle='#fff';c.font='800 64px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText(title,w/2,190,w-40);
 c.font='800 230px Pop';c.fillText(icon,w/2,470);})}),0,0,.12);phone.add(m);return m};
const screens=[scr('НОВЫЙ БАНК','#2f6fd0','№1'),scr('НОВАЯ КАРТА','#8a3ad0','№2'),scr('НОВОЕ ПРИЛОЖЕНИЕ','#1f9a6a','№3')];
const apps=K.stand(3.2,.7,'#fff',[{t:'ПЕРЕСАДКА',s:90,y:.54,c:'#2a3a5a'}],0,4.1,-3.9);rP.g.add(apps);
const dm=new THREE.Matrix4();
const debris=(r,t,t0,cx,cz)=>{const dd=clamp((t-t0)/1.2);r.debris.visible=t>t0;if(t<=t0)return;const R=rng(23);for(let i=0;i<46;i++){const a=R()*6.28,sp=1.5+R()*3.5;const X=cx+Math.cos(a)*sp*dd,Y=clamp(1.6+R()*2+(2.6*dd-3.8*dd*dd),.1,4.1),Z=cz+Math.sin(a)*sp*dd;dm.makeRotationFromEuler(new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4));dm.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));r.debris.setMatrixAt(i,dm)}r.debris.instanceMatrix.needsUpdate=true};
const phoneRoom=(to,u,si)=>{resetRoom(rP);rP.col(u,to);screens.forEach((s,i)=>s.visible=i===si);phone.visible=true};
// ---------- столбики 50/30/20 и башня накоплений
const rJ=K.room('rJ','#3a6a5a');
const bars=[[2.5,'#5a8ad0','50%','ОБЯЗАТЕЛЬНОЕ'],[1.5,'#ffb020','30%','НА ЖИЗНЬ'],[1.0,'#3fae5a','20%','ОТЛОЖИТЬ']].map(([hgt,col,p,l],i)=>{const x=(i-1)*1.35;const b=box(.95,1,.9,col,x,.5,-2.4);rJ.g.add(b);
 const s=K.stand(1.3,.9,'#fff',[{t:p,s:150,y:.42,c:'#15131a'},{t:l,s:44,y:.84,c:'#555'}],x,0,-2.4);rJ.g.add(s);return{b,s,hgt,x}});
const tw=K.tower('#3fae5a',1.6,-2.2);rJ.g.add(tw.g);
const jarRoom=(to,u)=>{resetRoom(rJ);rJ.col(u,to);bars.forEach(o=>{o.b.visible=o.s.visible=false});tw.set(0);tw.g.visible=false};
// ---------- стол сверху: план до зарплаты
const tbl=K.makeTable('tbl','ПЛАН ДО ЗАРПЛАТЫ',[['50% — ОБЯЗАТЕЛЬНОЕ','жильё, еда, проезд'],['30% — НА ЖИЗНЬ','кафе, одежда, хобби'],['20% — ОТЛОЖИТЬ','в первый же день']]);
const stacks=[5,3,2].map((n,i)=>{const g=new THREE.Group();g.position.set(3.2,0,(i-1)*2.2+.25);for(let k=0;k<n;k++){const c=cyl(.32,.12,'#ffc93a',0,.07+k*.13,0);c.castShadow=true;g.add(c)}tbl.g.add(g);return g});
// ---------- город
K.billboard(city.g,'ЧТО ЧИНИТ','БЮДЖЕТ?',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','МУЖИК И МЕДВЕДЬ',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const kq=T('Квартет Крылова'),re=T('И начали'),two=T('пересели два —'),same=T('всё та же.'),card=T('новая карта,'),app=T('новое приложение —'),boom=T('та же пересадка.'),half=T('За полгода —');
const top=(u,a0,a1,h0,h1,cx=0)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,0);cam.up.set(0,1,0);cam.fov=58;cam.updateProjectionMatrix()};
const shots=[
{id:'hook',t0:0,t1:kq,out:'whipR',f(t,u){stage(t,0,0,0,'bad');camPath(u,[1.0,1.2,3.6],[.5,1.4,3.0],[0,1.6,-1.6],[0,1.6,-1.7],[74,68],.04);
 fx.draw=K.hook(['3 ПРИЛОЖЕНИЯ,','А ДЕНЕГ НЕТ?'],0,kq-.05)}},
{id:'band',t0:kq,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){stage(t,0,0,0,'bad');const a=lerp(-.6,.5,u);cam.position.set(Math.sin(a)*4.8,lerp(1.6,2.0,u),-1.6+Math.cos(a)*4.8);cam.lookAt(0,1.4,-1.6);cam.fov=72;cam.updateProjectionMatrix();band.forEach(face);
 fx.tags=[{txt:'БАСНЯ КРЫЛОВА',t:kq+.05,xy:[.5,.17]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'play',t0:S('s03'),t1:re,in:'whipL',out:'whipUp',f(t,u){stage(t,0,0,0,'bad');linPath(u,[-2.0,1.1,3.5],[2.0,1.3,3.5],[-.5,1.5,-1.6],[.5,1.5,-1.7],[72,70],.03);
 fx.tags=[{txt:'МАРТЫШКА',t:S('s03')+.05,xy:[.28,.2]},{txt:'ОСЁЛ',t:S('s03')+.4,xy:[.7,.22]},{txt:'КОЗЁЛ',t:T('козёл и мишка'),xy:[.3,.3]},{txt:'МИШКА',t:T('козёл и мишка')+.35,xy:[.7,.32]}]}},
{id:'reseat',t0:re,t1:S('s04'),in:'whipUp',out:'whipR',f(t,u){stage(t,0,1,(t-re)/(S('s04')-re),'bad');const a=lerp(.3,-1.0,u);cam.position.set(Math.sin(a)*.4,lerp(4.1,3.7,ease(u)),-1.6+Math.cos(a)*.4);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(0,0,-1.6);cam.up.set(0,1,0);cam.fov=84;cam.updateProjectionMatrix();band.forEach(m=>{m.rotation.set(-PI/2,0,0)});
 fx.draw=K.big('ПЕРЕСАДКА',re+.1,S('s04')-.05,'#ffd23f',160,.14)}},
{id:'again',t0:S('s04'),t1:S('s05'),in:'whipR',out:'zoom',f(t,u){const k=t<two?0:(t-two)/.8;stage(t,t<two?1:1,2,t<two?0:k,'bad');camPath(u,[0,.7,3.6],[0,1.4,2.4],[0,1.5,-1.6],[0,1.8,-2.2],[64,56],0);band.forEach(face);
 fx.tags=[{txt:'РАЗ',t:S('s04')+.05,xy:[.3,.2]},{txt:'ДВА',t:two,xy:[.7,.2]}];fx.draw=K.big('ВСЁ ТА ЖЕ',same,S('s05')-.05,'#ff5a5a',170,.14)}},
{id:'apps',t0:S('s05'),t1:boom,in:'zoom',out:'whipL',f(t,u){phoneRoom('#2a3a5a',0,t<card?0:t<app?1:2);camPath(u,[-1.4,1.4,2.6],[.4,1.9,1.6],[0,2.0,-2.8],[0,2.1,-2.8],[62,56],-.04);
 fx.tags=[{txt:'ПЕРЕСЕЛИ',t:S('s05')+.1,xy:[.3,.17]}]}},
{id:'crash',t0:boom,t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){const h=t-boom;phoneRoom('#8a3a3a',ss(0,.6,h),2);debris(rP,t,boom+.05,0,-2.6);const k=Math.max(0,1-h/.5);
 camPath(u,[1.6,1.6,2.8],[.3,2.0,1.6],[0,2.0,-2.8],[0,2.1,-2.8],[60,54],.05);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 fx.crack={p:[0,2.2,-2.6],a:clamp(h*3),seed:11};fx.flash=Math.max(0,1-h/.25);fx.draw=K.big('ТРАТЫ ТЕ ЖЕ',boom+.1,S('s06')-.05,'#ffffff',150,.12)}},
{id:'plan',t0:S('s06'),t1:S('s07'),in:'whipUp',out:'whipR',f(t,u){tbl.g.visible=true;scene.background=new THREE.Color('#e9c58c');tbl.hl.forEach(h=>h.material.opacity=0);stacks.forEach(s=>s.visible=false);
 top(u,-.5,.4,11,8.8,.5);fx.draw=K.big('3 ЧИСЛА',T('три числа'),S('s07')-.05,'#ffffff',190,.12)}},
{id:'bars',t0:S('s07'),t1:S('s08'),in:'whipR',out:'zoom',f(t,u){jarRoom('#3a6a5a',0);const at=[S('s07'),T('30% —'),T('20% —')];bars.forEach((o,i)=>{const g=ss(at[i],at[i]+.5,t);o.b.visible=o.s.visible=t>at[i]-.05;const hh=Math.max(.01,o.hgt*g);o.b.scale.y=hh;o.b.position.y=hh/2;o.s.position.y=hh+.62});
 camPath(u,[-.8,1.0,3.6],[.6,1.5,3.2],[-.1,1.7,-2.4],[.1,1.7,-2.4],[74,70],.03)}},
{id:'coins',t0:S('s08'),t1:half,in:'zoom',out:'whipL',f(t,u){tbl.g.visible=true;scene.background=new THREE.Color('#e9c58c');const at=[S('s08')+.2,T('50, 30 и 20.'),T('50, 30 и 20.')+.5];tbl.hl.forEach((h,i)=>{h.material.opacity=t>at[i]?.7:0;h.material.color.set(['#9ac4ff','#ffd27a','#7dff9a'][i])});stacks.forEach((s,i)=>s.visible=t>at[i]);
 top(u,.6,-.3,9.5,8.2,1.0)}},
{id:'half',t0:half,t1:S('s09'),in:'whipL',out:'whipUp',f(t,u){jarRoom('#2f7a5a',ss(0,1,u));tw.g.visible=true;const n=Math.round(clamp((t-half)/.9)*6);tw.set(n);
 const a=lerp(.5,-.3,u);cam.position.set(1.6+Math.sin(a)*4.4,lerp(1.2,2.2,ease(u)),-2.2+Math.cos(a)*4.4);cam.lookAt(1.6,1.3,-2.2);cam.fov=60;cam.updateProjectionMatrix();
 fx.watch={v:n,max:6,x:.26,y:.2,lab:'МЕС'};fx.draw=K.big('120 ТЫС.',T('120 тыс.'),S('s09')-.05,'#ffd23f',190,.33)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipUp',out:'whipR',f(t,u){stage(t,2,2,0,'good');camPath(u,[-1.4,1.0,3.6],[-.4,1.4,3.0],[0,1.7,-1.8],[0,1.7,-1.9],[74,68],-.04);
 fx.draw=K.big('БЕЗ ПЛАНА — ФАЛЬШЬ',T('без плана'),S('s10')-.05,'#ffffff',110,.13)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
