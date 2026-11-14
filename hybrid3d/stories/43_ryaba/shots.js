import {kit} from '/lib_ru.js';
// 43 Курочка Ряба: всё в одном месте — одна случайность забирает 100%; три места — только треть
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#c79a5a'),rB=K.room('rB','#3a5a8a');
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.y=Math.atan2(cam.position.x-p.x,cam.position.z-p.z)};
// --- курица-ряба (своя рисовка): пёстрое тело, гребешок, клюв
const henDraw=(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 c.beginPath();c.moveTo(w*.42,h*.86);c.lineTo(w*.4,h*.97);c.moveTo(w*.58,h*.86);c.lineTo(w*.6,h*.97);c.strokeStyle='#e0a020';c.lineWidth=14;c.stroke();c.strokeStyle=INK;c.lineWidth=12;
 c.fillStyle='#f4efe6';c.beginPath();c.moveTo(w*.12,h*.38);c.quadraticCurveTo(w*.05,h*.15,w*.22,h*.3);c.quadraticCurveTo(w*.2,h*.9,w*.55,h*.88);c.quadraticCurveTo(w*.86,h*.86,w*.8,h*.55);c.closePath();c.fill();c.stroke();
 c.fillStyle='#f4efe6';c.beginPath();c.arc(w*.7,h*.32,w*.2,0,7);c.fill();c.stroke();
 c.fillStyle='#3a3a44';for(let i=0;i<16;i++){const a=i*2.4,r=.08+(i%5)*.045;c.beginPath();c.ellipse(w*(.45+Math.cos(a)*r*1.2),h*(.62+Math.sin(a)*r),w*.025,h*.018,a,0,7);c.fill()}
 c.fillStyle='#e8322a';for(let i=0;i<3;i++){c.beginPath();c.arc(w*(.62+i*.07),h*.12,w*.05,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.86,h*.42,w*.035,0,7);c.fill();
 c.fillStyle='#ffb020';c.beginPath();c.moveTo(w*.88,h*.3);c.lineTo(w*.99,h*.35);c.lineTo(w*.88,h*.39);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(w*.75,h*.28,w*.045,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.765,h*.28,w*.02,0,7);c.fill()};
const hen=drawn(1.3,1.3,henDraw,-1.5,.65,-2.3);rA.g.add(hen);
// --- мышка
const mouse=drawn(.9,.55,(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=10;c.beginPath();c.moveTo(w*.08,h*.7);c.quadraticCurveTo(w*.0,h*.2,w*.22,h*.55);c.stroke();
 c.fillStyle='#9a9aa6';c.beginPath();c.ellipse(w*.5,h*.62,w*.3,h*.3,0,0,7);c.fill();c.stroke();c.beginPath();c.arc(w*.72,h*.32,w*.1,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.arc(w*.86,h*.6,w*.03,0,7);c.fill();c.beginPath();c.arc(w*.74,h*.52,w*.025,0,7);c.fill()},0,.28,0);rA.g.add(mouse);
// --- золотое яйцо на табурете, осколки
const stool=box(.8,.8,.8,'#8a5a2e',.4,.4,-2.2);rA.g.add(stool);
const egg=new THREE.Mesh(new THREE.SphereGeometry(.3,32,20),new THREE.MeshLambertMaterial({color:'#ffc93a',emissive:'#6a4a00'}));egg.scale.set(1,1.3,1);egg.position.set(.4,1.19,-2.2);egg.castShadow=true;rA.g.add(egg);
const shards=drawn(1.8,1.8,(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=8;c.fillStyle='#ffc93a';const R=[[.3,.4],[.55,.3],[.7,.55],[.45,.65],[.25,.7],[.62,.78]];
 R.forEach(([x,y],i)=>{c.beginPath();c.moveTo(w*x,h*y);c.lineTo(w*(x+.12),h*(y-.05+i%2*.03));c.lineTo(w*(x+.08),h*(y+.1));c.lineTo(w*(x-.03),h*(y+.06));c.closePath();c.fill();c.stroke()})},.4,.03,-1.6);shards.rotation.x=-Math.PI/2;rA.g.add(shards);
const eggs3=[-1.0,0,1.0].map(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.24,28,18),new THREE.MeshLambertMaterial({color:'#ffc93a',emissive:'#6a4a00'}));e.scale.set(1,1.3,1);e.position.set(x+.2,.32,-1.6);e.castShadow=true;rA.g.add(e);return e});
const izbaSign=K.stand(2.2,.75,'#fff3d6',[{t:'ИЗБА',s:80,y:.52,c:'#5a3a1a'}],-1.6,3.4,-3.9);rA.g.add(izbaSign);
// --- банк/карта: огромная карта «ВСЕ ДЕНЬГИ», цифра 100%
const cardDraw=(blocked)=>(c,w,h)=>{c.lineJoin='round';c.fillStyle=blocked?'#7a7a84':'#2f6fd0';c.strokeStyle=INK;c.lineWidth=16;c.beginPath();c.roundRect(10,10,w-20,h-20,40);c.fill();c.stroke();
 c.fillStyle='#ffd23f';c.fillRect(w*.1,h*.28,w*.16,h*.2);c.strokeRect(w*.1,h*.28,w*.16,h*.2);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.font='800 '+Math.round(h*.15)+'px Pop';c.fillText('ВСЕ ДЕНЬГИ',w*.55,h*.62);
 c.font='800 '+Math.round(h*.09)+'px Pop';c.fillText('•••• •••• •••• 0001',w*.55,h*.82);
 if(blocked){c.save();c.translate(w/2,h/2);c.rotate(-.18);c.fillStyle='#e8322a';c.strokeStyle='#fff';c.lineWidth=10;c.fillRect(-w*.46,-h*.13,w*.92,h*.26);c.strokeRect(-w*.46,-h*.13,w*.92,h*.26);c.fillStyle='#fff';c.font='800 '+Math.round(h*.13)+'px Pop';c.fillText('ЗАБЛОКИРОВАНА',0,h*.01);c.restore()}};
const card=drawn(3.2,2.0,cardDraw(false),.3,2.4,-3.6),cardX=drawn(3.2,2.0,cardDraw(true),.3,2.4,-3.6);rB.g.add(card,cardX);
const n100=K.stand(2.6,1.3,'#fff',[{t:'−100%',s:150,y:.5,c:'#c4453a'}],.3,2.4,-3.6);rB.g.add(n100);
const bankSign=K.stand(2.0,.7,'#fff',[{t:'ОДНА КАРТА',s:70,y:.52,c:'#2a3a5a'}],-1.7,3.6,-3.9);rB.g.add(bankSign);
// --- стол сверху: три места
const tbl=K.makeTable('tbl','ТРИ МЕСТА',[['ПОДУШКА','отдельный счёт'],['НАКОПЛЕНИЯ','надёжный банк'],['НАЛИЧНЫЕ','немного дома']]);
const tEggs=[-1,0,1].map(i=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.32,28,18),new THREE.MeshLambertMaterial({color:'#ffc93a',emissive:'#6a4a00'}));e.scale.set(1,1,1.3);e.position.set(3.1,.33,i*1.8);e.castShadow=true;tbl.g.add(e);return e});
const tShard=drawn(1.4,1.4,(c,w,h)=>{c.strokeStyle=INK;c.lineWidth=8;c.fillStyle='#ffc93a';for(let i=0;i<4;i++){const x=.2+i*.17,y=.35+(i%2)*.25;c.beginPath();c.moveTo(w*x,h*y);c.lineTo(w*(x+.14),h*(y-.04));c.lineTo(w*(x+.08),h*(y+.14));c.closePath();c.fill();c.stroke()}},3.1,.05,1.8);tShard.rotation.x=-Math.PI/2;tbl.g.add(tShard);
// --- город
K.billboard(city.g,'ВСЁ В ОДНОМ','МЕСТЕ?',0,9,-26,16,9,'#ff5a5a');K.billboard(city.g,'ЗАВТРА','ЛЕБЕДЬ, РАК И ЩУКА',0,9,24,16,9,'#7dff9a');
// --- дед и баба
const ded=new Puppet('man',2.2),baba=new Puppet('woman',2.0);[ded,baba].forEach(p=>{scene.add(p.m);p.hide()});
const D={col:'#5a7a3a',hair:'#eeeeee',tie:'#c4453a'},B={col:'#a84a6a',hair:'#dddddd'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});tEggs.forEach(e=>e.visible=true);tShard.visible=false;scene.background=new THREE.Color('#e9c58c');f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(.3,-.4,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const izba=(to,u,m='egg')=>{mouse.scale.set(1,1,1);resetRoom(rA);rA.color(u,rA.base,new THREE.Color(to));egg.visible=m==='egg';shards.visible=m==='broken';eggs3.forEach(e=>e.visible=m==='three');stool.visible=m!=='three';mouse.visible=false;hen.visible=true};
const bank=(to,u,m)=>{resetRoom(rB);rB.color(u,rB.base,new THREE.Color(to));card.visible=m==='card';cardX.visible=m==='blocked';n100.visible=m==='100'};
const ryT=T('Курочка Ряба знает,'),babT=T('Баба била —'),hvost=T('махнула хвостиком —'),boom=T('и яйцо разбилось.'),blk=T('блокировка карты,'),f100=T('забирает 100%.');
const shots=[
{id:'hook',t0:0,t1:ryT,out:'whipR',f(t,u){izba('#c79a5a',0);camPath(u,[1.8,.6,3.6],[.9,.9,3.1],[-.6,1.4,-2],[-.4,1.3,-2.3],[66,58],.04);face(hen);
 fx.draw=K.hook(['ВСЕ ДЕНЬГИ','НА ОДНОЙ КАРТЕ?'],0,ryT-.05)}},
{id:'egg',t0:ryT,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){izba('#e8a84a',ss(0,1,u));const a=lerp(0,1.5,u);cam.position.set(.4+Math.sin(a)*.2,lerp(3.6,2.7,ease(u)),-2.2+Math.cos(a)*.2);cam.up.set(Math.sin(a),0,Math.cos(a));cam.lookAt(.4,1.2,-2.2);cam.up.set(0,1,0);cam.fov=74;cam.updateProjectionMatrix();face(hen);
 fx.tags=[{txt:'КУРОЧКА РЯБА',t:ryT+.1,xy:[.3,.18]},{txt:'ЗОЛОТОЕ ЯЙЦО',t:ryT+.6,xy:[.68,.24]}]}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-11,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u));
 fx.draw=K.big('3 МЕСТА',T('трёх мест.'),S('s03')-.05,'#7dff9a',170,.12)}},
{id:'ded',t0:S('s03'),t1:babT,in:'whipL',out:'whipR',f(t,u){izba('#c79a5a',0);const hit=Math.abs(Math.sin(t*7));ded.pose(1.5,-2.0,{expr:'angry',look:-.6,aL:[lerp(1.2,2.3,hit),.4],...D,blink:blink(t)});
 camPath(u,[-2.2,.8,3.6],[-.8,1.2,3.0],[.6,1.5,-2],[.6,1.4,-2.3],[66,58],-.04);face(hen);fx.tags=[{txt:'ДЕД',t:S('s03')+.1,xy:[.3,.2]},{txt:'НЕ РАЗБИЛ',t:T('не разбил.'),xy:[.68,.26]}]}},
{id:'baba',t0:babT,t1:S('s04'),in:'whipR',out:'whipUp',f(t,u){izba('#c79a5a',0);const hit=Math.abs(Math.sin(t*7));baba.pose(1.4,-1.9,{expr:'angry',look:-.6,aL:[lerp(1.2,2.3,hit),.4],...B,blink:blink(t)});
 camPath(u,[2.6,1.0,3.4],[1.2,1.3,2.8],[.2,1.5,-2],[.3,1.4,-2.3],[66,58],.04);face(hen);fx.tags=[{txt:'БАБА',t:babT+.1,xy:[.3,.2]},{txt:'НЕ РАЗБИЛА',t:T('не разбила.'),xy:[.68,.26]}]}},
{id:'impact',t0:S('s04'),t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){const hit=t>boom;izba(hit?'#8a4a3a':'#c79a5a',hit?ss(0,.5,(t-boom)/2):0,hit?'broken':'egg');const k=hit?Math.max(0,1-(t-boom)/.5):0;
 mouse.visible=true;mouse.scale.set(1.7,1.7,1);const mu=clamp((t-S('s04'))/(boom+.3-S('s04')));mouse.position.set(lerp(-2.0,-.3,mu),.47,-1.1);if(hit)egg.visible=false;
 camPath(u,[-1.0,1.1,2.8],[-.2,1.2,1.9],[-.2,.6,-1.6],[.3,.8,-1.9],[62,56],-.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.06*k;face(mouse);face(hen);
 fx.crack={p:[.4,.6,-2.0],a:hit?clamp((t-boom)*2.5):0,seed:7};fx.flash=k*.8;fx.tags=[{txt:'МЫШКА',t:S('s04')+.1,xy:[.3,.18]}];fx.draw=K.big('ХРУСЬ!',boom,S('s05')-.05,'#ffd23f',200,.15)}},
{id:'card',t0:S('s05'),t1:S('s06'),in:'zoom',out:'whipL',f(t,u){bank(t>blk?'#7a3a3a':'#3a5a8a',t>blk?ss(0,1,(t-blk)/1.5):0,t>blk?'blocked':'card');
 camPath(u,[-2.0,.9,3.6],[.0,1.6,2.4],[.3,2.2,-3],[.3,2.4,-3.6],[66,56],-.04);
 fx.tags=[{txt:'КРАЖА ТЕЛЕФОНА',t:T('кража телефона'),xy:[.32,.16]},{txt:'БАНК ЛОПНУЛ',t:T('или лопнувший банк.'),xy:[.68,.22]}]}},
{id:'all',t0:S('s06'),t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){bank('#a83a3a',ss(0,.6,u),'100');camPath(u,[2.2,.8,3.8],[.5,1.6,1.4],[.3,2.0,-3],[.3,2.4,-3.6],[66,54],.05);
 fx.draw=K.big('ВСЁ СРАЗУ',S('s06')+.1,f100-.05,'#ff5a5a',160,.14)}},
{id:'third',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'whipR',f(t,u){tb(()=>{const b=t>T('только треть.');tEggs[2].visible=!b;tShard.visible=b});
 const a=lerp(-.3,.8,u);cam.position.set(.55+Math.sin(a)*.4,lerp(11,10,ease(u)),Math.cos(a)*.4);cam.up.set(0,0,-1);cam.lookAt(.55,0,0);cam.up.set(0,1,0);cam.fov=56;cam.updateProjectionMatrix();
 fx.draw=K.big('−⅓, А НЕ ВСЁ',T('только треть.'),S('s08')-.05,'#7dff9a',130,.12)}},
{id:'rule',t0:S('s08'),t1:S('s09'),in:'whipR',out:'zoom',f(t,u){tb(()=>{const a=[T('подушка отдельно,'),T('накопления в банке,'),T('немного наличных')];tbl.hl.forEach((h,i)=>{h.material.opacity=t>a[i]?.75:0;h.material.color.set('#7dff9a')})});
 orb(u,9,6.5,1.5,2.5,.2-u*.4,-.3);fx.draw=K.big('ПРАВИЛО',S('s08')+.05,T('подушка отдельно,')+.3,'#ffffff',150,.12)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'zoom',out:'whipL',f(t,u){izba('#e8b84a',ss(0,1,u),'three');mouse.visible=true;mouse.scale.set(1.4,1.4,1);mouse.position.set(-.9,.38,-.6);
 camPath(u,[1.8,.7,3.6],[.6,1.1,2.8],[-.2,.8,-2],[-.2,.7,-2],[66,60],-.04);face(hen);face(mouse);fx.draw=K.big('ТРИ ЯЙЦА',T('Три сразу —'),S('s10')-.05,'#ffd23f',170,.15)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipL',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){ded.hide();baba.hide();s.f(t,u)}}))};
