import {kit} from '/lib_ru.js';
// 41 Каша из топора: цена «от» + добавки = полная цена; считай итог до покупки
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#c79a5a'),rB=K.room('rB','#4a7ab0');
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
const axeDraw=(c,w,h)=>{c.lineJoin='round';c.lineWidth=12;c.strokeStyle=INK;c.fillStyle='#a0682e';c.fillRect(w*.44,h*.2,w*.12,h*.78);c.strokeRect(w*.44,h*.2,w*.12,h*.78);
 c.fillStyle='#c9ccd2';c.beginPath();c.moveTo(w*.5,h*.06);c.lineTo(w*.95,h*.02);c.quadraticCurveTo(w*.85,h*.22,w*.95,h*.42);c.lineTo(w*.5,h*.36);c.closePath();c.fill();c.stroke()};
// --- изба: печь, котелок с топором, мешки
const stove=box(2.2,1.6,1.6,'#f1e6d6',1.6,.8,-3.1);rA.g.add(stove);
const pot=new THREE.Group();pot.add(cyl(.55,.7,'#2b2b30',0,.35,0,{r2:.65}));pot.add(cyl(.52,.05,'#e8d9a8',0,.74,0));const potAxe=drawn(.7,.95,axeDraw,0,.8,0);potAxe.rotation.x=-Math.PI/2;pot.add(potAxe);pot.position.set(1.4,1.6,-2.9);rA.g.add(pot);
const sackK=K.stand(.9,1.0,'#e8d9a8',[{t:'КРУПА',s:60,y:.5}],-1.8,.5,-2.6),sackM=K.stand(.9,1.0,'#ffd23f',[{t:'МАСЛО',s:60,y:.5}],-.7,.5,-2.9);rA.g.add(sackK,sackM);
const izbaSign=K.stand(2.4,.8,'#fff3d6',[{t:'ИЗБА СТАРУХИ',s:76,y:.52,c:'#5a3a1a'}],-1.2,3.3,-3.9);rA.g.add(izbaSign);
// --- магазин: ценник «от 100», витрина, чек
const tagDraw=(txt,sub,bg)=>(c,w,h)=>{c.lineWidth=14;c.strokeStyle=INK;c.fillStyle=bg;c.beginPath();c.moveTo(w*.2,10);c.lineTo(w-10,10);c.lineTo(w-10,h-10);c.lineTo(w*.2,h-10);c.lineTo(10,h/2);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(w*.16,h/2,h*.07,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.textAlign='center';c.textBaseline='middle';c.font='800 '+Math.round(h*.2)+'px Pop';c.fillText(sub,w*.6,h*.28);c.font='800 '+Math.round(h*.42)+'px Pop';c.fillText(txt,w*.6,h*.64)};
const tag100=drawn(2.6,1.3,tagDraw('100','ЦЕНА ОТ','#ffd23f'),.6,2.6,-3.7),tag140=drawn(2.6,1.3,tagDraw('140','НА КАССЕ','#ff5a5a'),.6,2.6,-3.7);rB.g.add(tag100,tag140);
const phoneBox=box(.7,1.2,.5,'#22242c',.6,1.3,-3.5);const shelf=box(3.4,.12,.9,'#f2f2f2',.6,.7,-3.5);rB.g.add(phoneBox,shelf);
const shopSign=K.stand(2.2,.7,'#fff',[{t:'МАГАЗИН',s:80,y:.52,c:'#2a3a5a'}],-1.5,3.5,-3.9);rB.g.add(shopSign);
const cmpA=K.stand(1.6,1.4,'#fff',[{t:'МАГАЗИН А',s:44,y:.22},{t:'от 90',s:46,y:.47,c:'#777'},{t:'итог 145',s:58,y:.75,c:'#c4453a'}],-1.3,2.4,-3.8),cmpB=K.stand(1.6,1.4,'#fff',[{t:'МАГАЗИН Б',s:44,y:.22},{t:'от 100',s:46,y:.47,c:'#777'},{t:'итог 125',s:58,y:.75,c:'#2f9e6e'}],1.1,2.4,-3.8);rB.g.add(cmpA,cmpB);
// --- стол сверху: чек
const tbl=K.makeTable('tbl','ЧЕК',[['ТЕЛЕФОН','100'],['ЧЕХОЛ + СТЕКЛО','+10 и +5'],['СТРАХОВКА + ДОСТАВКА','+15 и +10']]);
const pen=box(.12,.12,2.2,'#2a3a8a',1.6,.12,1.4);pen.rotation.y=.6;tbl.g.add(pen);
const stack=K.tower('#4caf62',-2.6,-2.0);tbl.g.add(stack.g);
const total=drawn(2.2,1.2,(c,w,h)=>{c.lineWidth=22;c.strokeStyle=INK;c.lineJoin='round';c.fillStyle='#ff5a5a';c.font='800 '+Math.round(h*.8)+'px Pop';c.textAlign='center';c.textBaseline='middle';c.strokeText('140',w/2,h*.55);c.fillText('140',w/2,h*.55)},3.3,.06,1.9);total.rotation.x=-Math.PI/2;tbl.g.add(total);
const tblAxe=drawn(1.2,1.6,axeDraw,3.2,.06,-1.6);tblAxe.rotation.x=-Math.PI/2;tbl.g.add(tblAxe);
// --- город
K.billboard(city.g,'ЦЕНА «ОТ»','ЭТО ТОЛЬКО ТОПОР',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ВОЛК И РЫБА',0,9,24,16,9,'#7dff9a');
// --- герои
const sol=new Puppet('man',2.3),old=new Puppet('woman',2.0);[sol,old].forEach(p=>{scene.add(p.m);p.hide()});
const SO={col:'#4a6a2a',hair:'#5a3a1a',tie:'#c4453a'},OL={col:'#8a5a9a',hair:'#e6e6e6'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});stack.g.visible=false;total.visible=false;tblAxe.visible=true;scene.background=new THREE.Color('#e9c58c');f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(.3,-.4,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const izba=(to,u,sk=0)=>{resetRoom(rA);rA.color(u,rA.base,new THREE.Color(to));sackK.visible=sk>0;sackM.visible=sk>1};
const shop=(to,u,m='tag')=>{resetRoom(rB);rB.color(u,rB.base,new THREE.Color(to));tag100.visible=m==='tag';tag140.visible=m==='bad';phoneBox.visible=shelf.visible=m!=='cmp';cmpA.visible=cmpB.visible=m==='cmp'};
const solT=T('Солдат так варил'),kr=T('крупу и масло.'),tot=T('Итого 140 —'),dor=T('Каша дороже.'),ad=T('А чехол, стекло,');
const shots=[
{id:'hook',t0:0,t1:solT,out:'whipR',f(t,u){shop('#4a7ab0',0,'tag');sol.pose(-1.4,-1.0,{expr:'sly',look:.5,aR:[.6,.8],...SO,blink:blink(t)});
 camPath(u,[1.4,.7,3.8],[.6,1.0,3.3],[-.2,2.0,-2],[0,1.9,-2.5],[66,58],.04);fx.draw=K.hook(['ЦЕНА «ОТ 100»,','А ПЛАТИТЕ 140?'],0,solT-.05)}},
{id:'soldier',t0:solT,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){izba('#c79a5a',0,0);sol.pose(-.6,-1.2,{expr:'smile',look:.6,aR:[1.2,.6],...SO,blink:blink(t)});
 fx.tags=[{txt:'СОЛДАТ',t:solT+.1,xy:[.3,.2]},{txt:'КАША ИЗ ТОПОРА',t:solT+.5,xy:[.66,.27]}];camPath(u,[-2.2,.7,3.8],[-.6,1.2,3.2],[.6,1.7,-2],[.8,1.7,-2.4],[68,58],-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){tb();fx.draw=K.big('ТРЮК',S('s02')+.1,S('s03'),'#ff5a5a',200,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'izba',t0:S('s03'),t1:kr,in:'whipL',out:'whipR',f(t,u){izba('#c79a5a',0,t>T('а старуха добавила')?2:0);sol.pose(.0,-1.0,{expr:'sly',look:-.5,...SO,blink:blink(t)});old.pose(-1.6,-1.4,{expr:'neutral',look:.5,aR:[.9,.6],...OL,blink:blink(t,.3)});
 camPath(u,[2.4,2.6,3.6],[.8,1.2,3.2],[-.4,1.2,-2],[-.4,1.5,-2],[66,58],.03)}},
{id:'pot',t0:kr,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){izba('#e8a84a',ss(0,1,u),2);const a=lerp(0,1.4,u);cam.position.set(1.4+Math.sin(a)*.2,lerp(4.1,3.5,ease(u)),-2.9+Math.cos(a)*.2);cam.up.set(Math.sin(a),0,Math.cos(a));cam.lookAt(1.4,1.6,-2.9);cam.up.set(0,1,0);cam.fov=78;cam.updateProjectionMatrix();
 fx.tags=[{txt:'+ КРУПА',t:kr+.05,xy:[.3,.2]},{txt:'+ МАСЛО',t:kr+.35,xy:[.7,.24]}]}},
{id:'shops',t0:S('s04'),t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){shop('#4a7ab0',0,'tag');
 fx.draw=K.big('ДЕШЁВАЯ ОСНОВА',S('s04')+.1,T('дорогие добавки.')-.05,'#ffd23f',130,.17);const d=K.big('ДОРОГИЕ ДОБАВКИ',T('дорогие добавки.'),S('s05')-.05,'#ff5a5a',120,.17),d0=fx.draw;fx.draw=(C,W,H,tt,ts)=>{d0(C,W,H,tt,ts);d(C,W,H,tt,ts)};
 camPath(u,[-2.0,.8,3.6],[.3,2.0,.2],[.4,2.2,-3],[.6,2.6,-3.7],[64,52],-.04)}},
{id:'receipt',t0:S('s05'),t1:S('s06'),in:'zoom',out:'whipL',f(t,u){tb(()=>{stack.g.visible=true;stack.set(t>ad?(t>T('ещё 40.')?7:5+Math.floor(clamp((t-ad)/1.6)*2)):5);tbl.hl[0].material.opacity=.7;tbl.hl[1].material.opacity=t>ad?.7:0;tbl.hl[2].material.opacity=t>T('страховка, доставка —')?.7:0;tbl.hl[1].material.color.set('#ff9a9a');tbl.hl[2].material.color.set('#ff9a9a')});
 const a=lerp(-.3,.8,u);cam.position.set(Math.sin(a)*.5-.5,lerp(10,9,ease(u)),Math.cos(a)*.5);cam.up.set(0,0,-1);cam.lookAt(-.5,0,0);cam.up.set(0,1,0);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'impact',t0:S('s06'),t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){shop('#a83a3a',ss(0,.5,u),t>tot?'bad':'tag');const k=t>tot?Math.max(0,1-(t-tot)/.5):0;
 sol.pose(-1.5,-1.0,{expr:'shock',look:.5,aR:[1.6,.4],...SO,blink:false});
 camPath(u,[-.4,.8,3.6],[.0,1.3,2.8],[.4,2.2,-3],[.6,2.4,-3.6],[66,58],-.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.08*k;
 fx.crack={p:[.6,2.6,-3.65],a:t>tot?clamp((t-tot)*2.5):0,seed:9};fx.flash=k*.8;fx.draw=K.big('+40%',tot,S('s07')-.05,'#ff5a5a',230,.17)}},
{id:'rule',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'whipR',f(t,u){tb(()=>{total.visible=true;stack.g.visible=true;stack.set(7);tbl.hl.forEach(h=>{h.material.opacity=.7;h.material.color.set('#7dff9a')})});
 fx.draw=K.big('СЧИТАЙ ИТОГ',S('s07')+.1,S('s08')-.05,'#7dff9a',150,.17);orb(u,8,5.5,1.5,2.5,.2-u*.4,-.5)}},
{id:'compare',t0:S('s08'),t1:S('s09'),in:'whipR',out:'zoom',f(t,u){shop('#59b86a',ss(0,.7,u),'cmp');sol.pose(-.2,-.6,{expr:'smile',look:.4,aR:[1.3,.3],...SO,blink:blink(t)});
 fx.draw=K.big('ПОЛНАЯ ЦЕНА',S('s08')+.1,S('s09')-.05,'#ffffff',140,.17);camPath(u,[2.4,.9,3.6],[-.4,1.2,3.0],[0,2.1,-2],[0,2.1,-2.5],[68,60],-.05)}},
{id:'axe',t0:S('s09'),t1:dor,in:'zoom',out:'whipUp',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-11,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'kasha',t0:dor,t1:S('s10'),in:'whipUp',out:'whipL',f(t,u){izba('#e8a84a',0,2);sol.pose(-.2,-.8,{expr:'smile',look:.6,aR:[1.0,.6],...SO,blink:blink(t)});old.pose(-1.3,-1.6,{expr:'smile',look:.5,...OL,blink:blink(t,.3)});
 fx.draw=K.big('КАША ДОРОЖЕ',dor,S('s10')-.05,'#ffd23f',150,.17);camPath(u,[1.8,.7,3.8],[.8,1.0,3.3],[.2,1.7,-2],[.2,1.6,-2],[66,60],-.04)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipL',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){sol.hide();old.hide();s.f(t,u)}}))};
