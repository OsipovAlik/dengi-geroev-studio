import {kit} from '/lib_ru.js';
// 54 Тришкин кафтан: перекредитование — новый кредит закрывает старый, а долг растёт: 100 → 120 → 144 → 173 (+73%) под 20%; правило: не латать долг долгом, гасить сначала самый дорогой
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Тришка (своя рисовка): красный кафтан, длина рукавов и пол меняется
const CAF='#c8322a',CAF2='#9a2018',SKIN='#f6c8a8';
const trishka=(sl,hem,holes,mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=12;
 // ноги, сапоги
 c.fillStyle='#2a4a8a';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.09)-w*.06,h*.6,w*.12,h*.3,10);c.fill();c.stroke()}
 c.fillStyle='#3a2414';for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.1)-w*.08,h*.86,w*.16,h*.12,14);c.fill();c.stroke()}
 // кафтан
 const hy0=.42,hb=lerp(.6,.9,hem);c.fillStyle=CAF;c.beginPath();c.moveTo(w*.34,h*hy0);c.lineTo(w*.66,h*hy0);c.lineTo(w*(.66+.1*hem+.02),h*hb);c.lineTo(w*(.34-.1*hem-.02),h*hb);c.closePath();c.fill();c.stroke();
 c.fillStyle='#ffd23f';for(let i=0;i<3;i++){c.beginPath();c.arc(w*.5,h*(hy0+.05+i*.05),w*.018,0,7);c.fill();c.stroke()}
 c.strokeStyle=CAF2;c.lineWidth=7;c.beginPath();c.moveTo(w*.5,h*hy0);c.lineTo(w*.5,h*hb-6);c.stroke();c.strokeStyle=INK;c.lineWidth=12;
 // руки: рукав сверху, голая рука ниже
 for(const s of[-1,1]){const x=w*(.5+s*.22),y0=h*.43,len=h*.3,se=y0+len*sl;
  c.fillStyle=SKIN;c.beginPath();c.roundRect(x-w*.04,y0,w*.08,len,14);c.fill();c.stroke();
  c.fillStyle=CAF;c.beginPath();c.roundRect(x-w*.055,y0-h*.01,w*.11,Math.max(h*.04,se-y0),14);c.fill();c.stroke();
  c.fillStyle=SKIN;c.beginPath();c.arc(x,y0+len+h*.01,w*.045,0,7);c.fill();c.stroke();
  if(holes&&sl>.6){c.fillStyle=SKIN;c.beginPath();c.ellipse(x,y0+len*.5,w*.035,h*.022,0,0,7);c.fill();c.stroke()}}
 // голова
 const hy=.24,hr=.2;c.fillStyle=SKIN;c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 c.fillStyle='#c98a3a';c.beginPath();c.arc(w*.5,h*(hy-.02),w*hr*1.02,PI*1.05,PI*1.95);c.quadraticCurveTo(w*.5,h*(hy-.09),w*.3,h*(hy-.03));c.closePath();c.fill();c.stroke();
 c.fillStyle='#ff9a9a';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.13),h*(hy+.05),w*.035,0,7);c.fill()}
 c.lineWidth=9;const ey=hy+.005;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*ey,w*.045,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.08),h*(ey+.004),w*.02,0,7);c.fill()}
 c.beginPath();if(mood==='sad'){c.arc(w*.5,h*(hy+.11),w*.05,PI*1.15,PI*1.85)}else if(mood==='shock'){c.fillStyle=INK;c.ellipse(w*.5,h*(hy+.09),w*.03,h*.025,0,0,7);c.fill()}else c.arc(w*.5,h*(hy+.06),w*.06,PI*.15,PI*.85);c.stroke()};
const TV={full:[1,1,1,'smile'],torn:[1,1,1,'sad'],shortsl:[.35,1,0,'neutral'],tiny:[1,.05,0,'shock'],ok:[1,1,0,'smile']};
const TR={};Object.entries(TV).forEach(([k,v])=>{TR[k]=drawn(1.5,2.4,trishka(...v),0,0,0);scene.add(TR[k]);TR[k].visible=false});
const putT=(k,x,z,t)=>{Object.values(TR).forEach(m=>m.visible=false);const m=TR[k];m.visible=true;m.position.set(x,Math.abs(Math.sin(t*2.6))*.02,z)};
// ---------- изба Тришки
const rT=K.room('rT','#5a3a2a');
const bench=box(2.4,.5,.7,'#8a5a30',1.4,.25,-3.2);rT.g.add(bench);
const sc=new THREE.Group();rT.g.add(sc);[-1,1].forEach(s=>{const b=box(.08,.03,.9,'#cfd6e0',s*.05,0,0);b.rotation.y=s*.25;sc.add(b);const r=cyl(.09,.04,'#d8263f',s*.13,0,.48);sc.add(r)});sc.position.set(1.0,1.0,-.2);
const laugh1=new Puppet('woman',1.8),laugh2=new Puppet('big',2.0);[laugh1,laugh2].forEach(p=>scene.add(p.m));
const izba=(t,{col='#5a3a2a',u=0,sc_=0}={})=>{resetRoom(rT);rT.col(u,col);sc.visible=sc_>0};
// ---------- кафтан сверху на столе, ножницы режут
const flat=(cut)=>(c,w,h)=>{c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=14;c.fillStyle=CAF;c.beginPath();
 c.moveTo(w*.36,h*.06);c.lineTo(w*.64,h*.06);c.lineTo(w*.97,h*.2);c.lineTo(w*.97,h*.34);c.lineTo(w*.7,h*.3);c.lineTo(w*.74,h*.96);c.lineTo(w*.26,h*.96);c.lineTo(w*.3,h*.3);c.lineTo(w*.03,h*.34);c.lineTo(w*.03,h*.2);c.closePath();c.fill();c.stroke();
 c.fillStyle=SKIN;for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.32),h*.27,w*.04,h*.025,0,0,7);c.fill();c.stroke()}
 c.setLineDash([26,18]);c.strokeStyle='#fff';c.lineWidth=10;c.beginPath();if(cut===0){for(const s of[-1,1]){c.moveTo(w*(.5+s*.4),h*.18);c.lineTo(w*(.5+s*.4),h*.36)}}else{c.moveTo(w*.22,h*.7);c.lineTo(w*.78,h*.7)}c.stroke();c.setLineDash([])};
const gD=new THREE.Group();
const wood=canvasTex(1024,1024,(c,w,h)=>{const R=rng(5);for(let i=0;i<8;i++){const x=i*w/8,v=R()*26;c.fillStyle=`rgb(${150+v},${100+v*.7},${60+v*.4})`;c.fillRect(x,0,w/8,h);c.strokeStyle='rgba(50,25,10,.75)';c.lineWidth=4;c.strokeRect(x,-5,w/8,h+10)}},{wrap:true});wood.repeat.set(6,6);
gD.add(Object.assign(plane(40,40,lam('#fff',{map:wood}),0,0,0,-PI/2),{receiveShadow:true}));
const FL=[0,1].map(k=>{const m=plane(4.4,5.2,new THREE.MeshLambertMaterial({map:canvasTex(880,1040,flat(k)),transparent:true,alphaTest:.05}),0,.03,0,-PI/2);m.receiveShadow=true;gD.add(m);return m});
const sc2=new THREE.Group();gD.add(sc2);[-1,1].forEach(s=>{const b=box(.12,.05,1.6,'#cfd6e0',s*.08,.3,0);b.rotation.y=s*.28;b.castShadow=true;sc2.add(b);const r=cyl(.16,.06,'#d8263f',s*.24,.3,.85);sc2.add(r)});
gD.add(new THREE.HemisphereLight('#fff','#a89a8f',3.0));sunRig(gD,[-5,24,6],[.5,0,0],'#fff1d9',2.4,10);addSet('cloth',gD);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const cloth=(k,sx,sz,ang)=>{gD.visible=true;scene.background=new THREE.Color('#e9c58c');FL.forEach((m,i)=>m.visible=i===k);sc2.position.set(sx,0,sz);sc2.rotation.y=ang};
// ---------- комната долга: красная башня растёт
const rD=K.room('rD','#2a3448');
const bar=box(1.4,1,1,'#e0302a',0,.5,-2.2);rD.g.add(bar);
const lbD=K.stand(1.5,.45,'#fff',[{t:'ДОЛГ',s:90,y:.55,c:'#15131a'}],1.5,2.3,-3.9);rD.g.add(lbD);
const three=[['30%','#e0302a',-1.7],['20%','#ff8a3a',0],['10%','#ffc93a',1.7]].map(([t,col,x])=>{const b=box(1.1,1,.9,col,x,.5,-2.4);rD.g.add(b);const s=K.stand(1.0,.42,'#fff',[{t,s:90,y:.55,c:'#15131a'}],x,0,-1.9);rD.g.add(s);return{b,s}});
const debt=(t,{v=100,col='#2a3448',u=0,trio=null}={})=>{resetRoom(rD);rD.col(u,col);const H=v/100*1.0;bar.visible=!trio;bar.scale.y=H;bar.position.y=H/2;
 three.forEach((o,i)=>{o.b.visible=o.s.visible=!!trio;if(trio){const hh=trio[i];o.b.scale.y=Math.max(.02,hh);o.b.position.y=Math.max(.02,hh)/2;o.s.position.y=Math.max(.02,hh)+.4}})};
// ---------- договоры сверху
const tA=K.makeTable('tA','КРЕДИТ ЗА КРЕДИТОМ',[['КРЕДИТ 1: 100','через год должны 120'],['КРЕДИТ 2: 120','через год должны 144'],['КРЕДИТ 3: 144','через год должны 173']]);
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ff8a7a')})};
// ---------- город
K.billboard(city.g,'КАК ВЫБРАТЬСЯ','ИЗ ДОЛГОВОЙ ПЕТЛИ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ЛИСИЦА И ВИНОГРАД',0,9,24,16,9,'#9ad86a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const tak=T('Так долг'),rast=T('он растёт.'),otr=T('отрезал рукава,'),pot=T('потом'),god=T('через год 120.'),esh=T('Ещё раз —'),n173=T('173.'),gas=T('Гасите сначала');
const HOOK=['НОВЫЙ КРЕДИТ —','ЗАКРЫТЬ СТАРЫЙ?'];
const shots=[
{id:'hook',t0:0,t1:tak,out:'whipR',f(t,u){izba(t,{col:'#6a2a2a',u:.5});putT('torn',-.2,-.8,t);camPath(u,[-.9,.8,3.2],[-.3,1.0,2.5],[-.1,2.0,-.8],[-.1,1.95,-.8],[62,56],.03);fx.draw=K.hook(HOOK,0,tak-.05)}},
{id:'grow',t0:tak,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){const k=ss(rast-.3,rast+.4,t);debt(t,{v:100+k*73,col:'#5a1e22',u:k});
 const a=lerp(-.5,.1,u);cam.position.set(Math.sin(a)*5.2,lerp(1.2,1.8,u),-2.2+Math.cos(a)*5.2);cam.lookAt(0,1.3,-2.2);cam.fov=62;cam.updateProjectionMatrix();
 const h=t-rast;const q=h>0?Math.max(0,1-h/.4):0;cam.position.x+=Math.sin(t*51)*.08*q;fx.draw=K.big('ДОЛГ РАСТЁТ',rast,S('s02')-.05,'#ff5a5a',170,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'elbows',t0:S('s03'),t1:otr,in:'whipL',out:'whipUp',f(t,u){izba(t);putT('torn',.2,-1.0,t);const a=lerp(.7,.15,u);cam.position.set(.2+Math.sin(a)*3.4,lerp(1.4,1.6,u),-1.0+Math.cos(a)*3.4);cam.lookAt(.2,1.35,-1.0);cam.fov=54;cam.updateProjectionMatrix();fx.tags=[{txt:'ДЫРЫ НА ЛОКТЯХ',t:T('латал локти:'),xy:[.5,.12]}]}},
{id:'cut1',t0:otr,t1:pot,in:'whipUp',out:'whipL',f(t,u){cloth(0,lerp(2.6,1.76,ease(u)),-1.3,.3+Math.sin(t*16)*.12);top(u,-.4,.2,7.2,6.2,0,0,58);fx.tags=[{txt:'РУКАВА → НА ЛОКТИ',t:otr+.1,xy:[.5,.12]}]}},
{id:'cut2',t0:pot,t1:S('s04'),in:'whipL',out:'whipR',f(t,u){cloth(1,lerp(-2.4,1.2,ease(u)),1.0,PI/2+Math.sin(t*16)*.12);top(u,.3,-.3,6.8,6.0,0,0,58);fx.tags=[{txt:'ПОЛЫ → НА РУКАВА',t:pot+.1,xy:[.5,.12]}]}},
{id:'tiny',t0:S('s04'),t1:S('s05'),in:'whipR',out:'zoom',f(t,u){izba(t,{col:'#7a2a4a',u:ss(0,1,u)});putT(t<T('а кафтан стал')?'shortsl':'tiny',0,-1.0,t);
 laugh1.pose(-1.3,-2.2,{expr:'smile',look:.5,talk:talk(t),blink:blink(t),col:'#3a8ad8',hair:'#3a2a1a'});laugh2.pose(1.9,-2.4,{expr:'smile',look:-.5,talk:talk(t,true),blink:blink(t,.3),col:'#4a8a3a'});
 camPath(u,[1.6,1.1,3.4],[.6,1.4,2.9],[0,1.3,-1.4],[0,1.4,-1.2],[60,56],-.03);fx.draw=K.big('КОРОЧЕ КАМЗОЛА',T('короче камзола.'),S('s05')-.05,'#ffd23f',140,.13)}},
{id:'d100',t0:S('s05'),t1:god,in:'zoom',out:'whipUp',f(t,u){debt(t,{v:100});camPath(u,[-2.6,.8,3.4],[-1.4,1.2,3.0],[0,.9,-2.2],[0,1.0,-2.2],[62,58],.02);fx.draw=K.big('100 ПОД 20%',T('долг 100')+.05,god-.05,'#ffffff',170,.16)}},
{id:'d120',t0:god,t1:S('s06'),in:'whipUp',out:'whipL',f(t,u){const k=ss(god,god+.6,t);debt(t,{v:100+20*k,col:'#3a2a40',u:k});const a=lerp(.2,-.2,u);cam.position.set(Math.sin(a)*4.4,lerp(1.6,1.9,u),-2.2+Math.cos(a)*4.4);cam.lookAt(0,1.0,-2.2);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.big('120',god+.1,S('s06')-.05,'#ff8a7a',300,.16)}},
{id:'papers',t0:S('s06'),t1:esh,in:'whipL',out:'whipUp',f(t,u){table([1,t>T('новым кредитом —'),false]);top(u,-.5,.2,10.5,8.4,0,0,58);fx.draw=K.big('144',T('через год 144.')+.1,esh-.05,'#ff5a5a',300,.16)}},
{id:'boom',t0:esh,t1:S('s07'),in:'whipUp',out:'whipR',f(t,u){const h=t-n173;const k=ss(n173-.3,n173+.15,t);debt(t,{v:144+29*k,col:'#6a1418',u:k});
 linPath(u,[0,.6,3.6],[0,.9,3.2],[0,1.4,-2.2],[0,1.6,-2.2],[66,62],0);const q=h>0?Math.max(0,1-h/.5):0;cam.position.x+=Math.sin(t*53)*.12*q;cam.position.y+=Math.sin(t*41)*.06*q;
 if(h>0){fx.crack={p:[0,1.73,-1.7],a:clamp(h*3),seed:17};fx.flash=Math.max(0,1-h/.25);rD.debris.visible=true}fx.draw=K.big('173',n173,S('s07')-.05,'#ff3a3a',320,.16)}},
{id:'plus73',t0:S('s07'),t1:S('s08'),in:'whipR',out:'zoom',f(t,u){debt(t,{v:173,col:'#6a1418'});const a=lerp(-.5,0,u);cam.position.set(Math.sin(a)*4.6,lerp(3.0,2.3,u),-2.2+Math.cos(a)*4.6);cam.lookAt(0,1.2,-2.2);cam.fov=64;cam.updateProjectionMatrix();
 fx.draw=K.big('+73%',S('s07')+.1,S('s08')-.05,'#ff5a5a',300,.16);fx.tags=[{txt:'А КУПИЛИ — НИЧЕГО',t:T('хотя вы ничего'),xy:[.5,.3]}]}},
{id:'rule',t0:S('s08'),t1:gas,in:'zoom',out:'whipL',f(t,u){izba(t,{col:'#2a5a3a',u:ss(0,1,u)});putT('ok',-.4,-1.0,t);camPath(u,[2.0,1.2,3.3],[1.0,1.4,2.7],[-.3,1.3,-1.0],[-.3,1.4,-1.0],[58,54],-.02);fx.draw=K.big('НЕ ЛАТАЙ ДОЛГ ДОЛГОМ',T('не латайте')-.05,gas-.05,'#7dff9a',120,.13)}},
{id:'pay',t0:gas,t1:S('s09'),in:'whipL',out:'whipR',f(t,u){const k=ss(gas+.3,T('самый дорогой.')+.6,t);debt(t,{trio:[1.6*(1-k),1.2,.8],col:'#2a4a3a'});camPath(u,[-1.6,1.4,3.8],[-.6,1.7,3.4],[-.6,1.0,-2.4],[-.4,1.0,-2.4],[64,60],.02);fx.tags=[{txt:'САМЫЙ ДОРОГОЙ — ПЕРВЫМ',t:gas+.1,xy:[.5,.12]}]}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
const BB=Object.values(TR);
shots.forEach(s=>{const f=s.f;s.f=function(t,u){[laugh1,laugh2].forEach(p=>p.hide());BB.forEach(m=>m.visible=false);f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
