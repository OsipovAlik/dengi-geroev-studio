import {kit} from '/lib_ru.js';
// 42 Волк («Лиса и волк»): деньги за ночь — ловушка; 2% в день = ×1377 за год; не можешь объяснить доход — не вкладывай
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#6a8fb5'),rB=K.room('rB','#5a3a7a');
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
// --- зимняя река: лёд, прорубь с хвостом, сугробы
const HX=.9,HZ=-1.2;
const ice=drawn(5.8,7.6,(c,w,h)=>{c.fillStyle='#e8f4ff';c.fillRect(0,0,w,h);c.strokeStyle='rgba(90,140,190,.55)';c.lineWidth=6;for(let i=0;i<14;i++){const x=(i*137)%w,y=(i*251)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x+120,y+40);c.lineTo(x+170,y+10);c.stroke()}},0,.01,0);ice.rotation.x=-Math.PI/2;rA.g.add(ice);
const holeDraw=(frozen)=>(c,w,h)=>{c.lineJoin='round';c.lineWidth=14;c.strokeStyle=INK;c.fillStyle=frozen?'#bfe0ff':'#1e3f6e';c.beginPath();c.ellipse(w/2,h/2,w*.36,h*.3,0,0,7);c.fill();c.stroke();
 if(!frozen){c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=6;for(let i=0;i<3;i++){c.beginPath();c.ellipse(w/2,h/2,w*(.1+i*.08),h*(.08+i*.07),0,0,7);c.stroke()}}
 else{c.strokeStyle='#ffffff';c.lineWidth=8;for(let i=0;i<7;i++){const a=i*0.9;c.beginPath();c.moveTo(w/2,h/2);c.lineTo(w/2+Math.cos(a)*w*.3,h/2+Math.sin(a)*h*.25);c.stroke()}}
 // хвост: серая полоса от края к центру
 c.lineWidth=46;c.strokeStyle=INK;c.lineCap='round';c.beginPath();c.moveTo(w*.02,h*.98);c.quadraticCurveTo(w*.2,h*.6,w*.46,h*.52);c.stroke();c.lineWidth=30;c.strokeStyle='#8a8f9a';c.stroke();
 c.fillStyle='#ffd23f';c.strokeStyle=INK;c.lineWidth=8;if(!frozen)for(const [fx_,fy] of [[.62,.4],[.6,.64]]){c.beginPath();c.ellipse(w*fx_,h*fy,w*.07,h*.035,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(w*(fx_+.06),h*fy);c.lineTo(w*(fx_+.11),h*(fy-.03));c.lineTo(w*(fx_+.11),h*(fy+.03));c.closePath();c.fill();c.stroke()}};
const hole=drawn(2.6,2.6,holeDraw(false),HX,.03,HZ),holeF=drawn(2.6,2.6,holeDraw(true),HX,.03,HZ);hole.rotation.x=holeF.rotation.x=-Math.PI/2;rA.g.add(hole,holeF);
const drifts=[[-2.3,-3.3,1.2],[2.2,-3.2,1.0],[-2.4,2.0,.9]].map(([x,z,r])=>{const m=cyl(r,.5,'#ffffff',x,.25,z,{r2:r*1.2});rA.g.add(m);return m});
const riverSign=K.stand(2.2,.75,'#fff',[{t:'РЕКА. НОЧЬ',s:70,y:.52,c:'#2a4a7a'}],-1.6,3.4,-3.9);rA.g.add(riverSign);
// --- «офис схемы»: баннер, огромная цифра
const banner=K.stand(3.0,1.1,'#ffd23f',[{t:'+2% В ДЕНЬ!',s:110,y:.52,c:'#5a1a1a'}],-.6,3.3,-3.9);rB.g.add(banner);
const night=K.stand(3.0,1.1,'#ffd23f',[{t:'ДЕНЬГИ ЗА НОЧЬ',s:84,y:.52,c:'#5a1a1a'}],-.6,3.3,-3.9);rB.g.add(night);
const bigN=drawn(3.4,1.6,(c,w,h)=>{c.fillStyle='#fff';c.strokeStyle=INK;c.lineWidth=16;c.fillRect(8,8,w-16,h-16);c.strokeRect(8,8,w-16,h-16);c.fillStyle='#c4453a';c.textAlign='center';c.textBaseline='middle';c.font='800 '+Math.round(h*.5)+'px Pop';c.fillText('×1377',w/2,h*.42);c.fillStyle=INK;c.font='800 '+Math.round(h*.16)+'px Pop';c.fillText('ЗА ГОД',w/2,h*.8)},.9,1.85,-3.5);rB.g.add(bigN);
const desk=box(2.2,.9,1.0,'#3a2a4a',.9,.45,-3.0);rB.g.add(desk);
const ok=K.stand(2.8,1.1,'#7dff9a',[{t:'ОБЪЯСНИ ДОХОД',s:76,y:.52,c:'#1a5a2a'}],-.6,3.3,-3.9);rB.g.add(ok);
// --- стол сверху: проверка
const tbl=K.makeTable('tbl','ПРОВЕРКА',[['КТО ПЛАТИТ?','имя, адрес, документы'],['ЗА ЧТО?','откуда берётся доход'],['ЕСЛИ ПРОПАДЁТ?','что вы теряете']]);
const pen=box(.12,.12,2.2,'#2a3a8a',1.6,.12,1.4);pen.rotation.y=.6;tbl.g.add(pen);
const stack=K.tower('#4caf62',-3.2,-1.2);stack.set(3);tbl.g.add(stack.g);
// --- город
K.billboard(city.g,'2% В ДЕНЬ','ТАК НЕ ПЛАТЯТ',0,9,-26,16,9,'#ff5a5a');K.billboard(city.g,'ЗАВТРА','КУРОЧКА РЯБА',0,9,24,16,9,'#ffd23f');
// --- герои
const wolf=new Puppet('big',2.6),fox=new Puppet('woman',2.1);[wolf,fox].forEach(p=>{scene.add(p.m);p.hide()});
const ears=(p,col,look=0)=>{const k=E.KIND[p.kind];const c=p.x;const hy=1006-k.leg-k.bh-k.hh+18;c.save();c.globalCompositeOperation='destination-over';c.translate(320+(look||0)*6,hy);c.lineJoin='round';c.lineWidth=12;c.strokeStyle=INK;c.fillStyle=col;for(const s of[-1,1]){c.beginPath();c.moveTo(s*k.hw*.2,-k.hh*.7);c.lineTo(s*k.hw*.95,-k.hh*1.7);c.lineTo(s*k.hw*.9,-k.hh*.3);c.closePath();c.fill();c.stroke()}c.restore();p.t.needsUpdate=true};
const wp=(x,z,o)=>{wolf.pose(x,z,o);ears(wolf,'#6f7684',o.look)},fp=(x,z,o)=>{fox.pose(x,z,o);ears(fox,'#e8742a',o.look)};
const WF={col:'#6f7684',hair:'#4a4f5a',tie:'#c4453a'},F={col:'#e8742a',hair:'#d4561a'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const both=(...fs)=>(C,W,H,t,ts)=>fs.forEach(f=>f&&f(C,W,H,t,ts));
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});stack.g.visible=true;scene.background=new THREE.Color('#bcd6f0');f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(.3,-.4,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const river=(to,u,fr=false)=>{resetRoom(rA);rA.color(u,rA.base,new THREE.Color(to));hole.visible=!fr;holeF.visible=fr};
const office=(to,u,m)=>{resetRoom(rB);rB.color(u,rB.base,new THREE.Color(to));banner.visible=m==='pct';night.visible=m==='night';ok.visible=m==='ok';bigN.visible=m==='pct'};
const top=(u,y0,y1,a0,a1,fov=70)=>{const a=lerp(a0,a1,u);cam.position.set(HX+Math.sin(a)*.2,lerp(y0,y1,ease(u)),HZ+Math.cos(a)*.2);cam.up.set(Math.sin(a),0,Math.cos(a));cam.lookAt(HX,0,HZ);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const wT=T('Волк тоже хотел —'),rib=T('к утру рыба'),frz=T('Хвост примёрз.'),thousand=T('в 1000 раз.'),never=T('Так не платит'),fin=T('В ней остаётся хвост.');
const shots=[
{id:'hook',t0:0,t1:wT,out:'whipR',f(t,u){office('#5a3a7a',0,'night');wp(-1.3,-1.0,{expr:'sly',look:.5,aR:[1.3,.5],propR:'cash',...WF,blink:blink(t)});
 camPath(u,[1.6,.7,3.8],[.7,1.0,3.3],[-.4,2.0,-2],[-.3,1.9,-2.5],[66,58],.04);fx.draw=K.hook(['ЗАРАБОТАТЬ','ЗА ОДНУ НОЧЬ?'],0,wT-.05)}},
{id:'wolf',t0:wT,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){river('#6a8fb5',0);wp(-.5,-1.4,{expr:t>T('остался без хвоста.')?'shock':'smile',look:.5,aL:[.4,.4],...WF,blink:blink(t)});
 fx.tags=[{txt:'ВОЛК',t:wT+.1,xy:[.28,.2]},{txt:'БЕЗ ХВОСТА',t:T('остался без хвоста.'),xy:[.68,.26]}];camPath(u,[-2.2,.7,3.8],[-.6,1.2,3.2],[.6,1.7,-2],[.6,1.7,-2.4],[68,58],-.05)}},
{id:'trap',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){tb();fx.draw=K.big('ЛОВУШКА',S('s02')+.1,S('s03'),'#ff5a5a',190,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'fox',t0:S('s03'),t1:rib,in:'whipL',out:'zoom',f(t,u){river('#6a8fb5',0);fp(-.8,-1.2,{expr:'sly',look:.2,talk:Math.abs(Math.sin(t*14))*.8,aR:[1.2,.9],...F,blink:blink(t,.3)});wp(1.0,-1.9,{expr:'neutral',look:-.6,...WF,blink:blink(t)});
 fx.tags=[{txt:'ЛИСА',t:S('s03')+.1,xy:[.26,.2]}];camPath(u,[2.4,2.4,3.6],[1.4,2.2,1.6],[-.6,1.4,-2],[HX,0,HZ],[66,62],.03)}},
{id:'hole',t0:rib,t1:S('s04'),in:'zoom',out:'whipR',f(t,u){river('#7aa0c8',0);top(u,4.0,3.2,0,1.3,74);
 fx.tags=[{txt:'ПРОРУБЬ',t:rib+.05,xy:[.3,.16]},{txt:'РЫБА САМА?',t:rib+.5,xy:[.7,.22]}]}},
{id:'impact',t0:S('s04'),t1:S('s05'),in:'whipR',out:'whipUp',f(t,u){const hit=t>frz;river('#cfe6ff',ss(0,.4,u),hit);const k=hit?Math.max(0,1-(t-frz)/.5):0;
 wp(0.0,-2.1,{expr:hit?'shock':'smile',look:.6,aL:[1.8,.4],aR:[1.8,.4],...WF,blink:false});
 camPath(u,[-1.4,1.0,3.6],[-.4,1.5,2.6],[.4,.9,HZ-.3],[.5,.7,HZ-.3],[64,58],-.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.08*k;
 fx.crack={p:[HX,.05,HZ],a:hit?clamp((t-frz)*2.5):0,seed:5};fx.flash=k*.8;fx.draw=K.big('ПРИМЁРЗ!',frz,S('s05')-.05,'#9fd8ff',190,.15)}},
{id:'scheme',t0:S('s05'),t1:S('s06'),in:'whipUp',out:'whipL',f(t,u){office('#5a3a7a',0,'pct');fp(-1.6,-1.0,{expr:'sly',look:.5,aR:[1.0,1.3],propR:'phone',...F,blink:blink(t,.3)});
 fx.draw=K.big('2% В ДЕНЬ',S('s05')+.1,S('s06')-.05,'#ffd23f',170,.15);camPath(u,[2.2,.8,3.8],[.4,1.1,3.2],[-.6,2.4,-2],[-.6,2.6,-3],[68,58],.05)}},
{id:'math',t0:S('s06'),t1:never,in:'whipL',out:'zoom',f(t,u){office('#a83a3a',ss(.3,1,u),'pct');
 fx.draw=K.big('В 1000+ РАЗ',thousand,never-.05,'#ff5a5a',150,.14);camPath(u,[-1.2,1.0,3.6],[.7,2.0,.2],[.4,2.0,-3],[.9,2.2,-3.5],[62,50],-.04)}},
{id:'never',t0:never,t1:S('s07'),in:'zoom',out:'whipUp',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-11,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'rule',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'whipR',f(t,u){office('#3f8a5a',ss(0,.7,u),'ok');wp(-.7,-1.0,{expr:'neutral',look:.4,aR:[1.3,.3],...WF,blink:blink(t)});
 fx.draw=K.big('НЕ ВКЛАДЫВАЙ',T('не вкладывай.'),S('s08')-.05,'#7dff9a',140,.15);camPath(u,[2.4,.9,3.6],[-.2,1.2,3.0],[-.4,2.1,-2],[-.4,2.1,-2.5],[68,60],-.05)}},
{id:'check',t0:S('s08'),t1:S('s09'),in:'whipR',out:'zoom',f(t,u){tb(()=>{const a=[T('кто платит,'),T('за что,'),T('и что будет,')];tbl.hl.forEach((h,i)=>{h.material.opacity=t>a[i]?.75:0;h.material.color.set('#7dff9a')})});
 const a=lerp(-.3,.8,u);cam.position.set(Math.sin(a)*.5,lerp(10,8.6,ease(u)),Math.cos(a)*.5);cam.up.set(0,0,-1);cam.lookAt(0,0,0);cam.up.set(0,1,0);cam.fov=56;cam.updateProjectionMatrix();
 fx.draw=K.big('3 ВОПРОСА',S('s08')+.1,S('s09')-.05,'#ffffff',150,.12)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'zoom',out:'whipL',f(t,u){river('#cfe6ff',0,true);wp(.1,-2.4,{expr:'angry',look:.6,...WF,blink:blink(t)});
 fx.draw=K.big('ПРОРУБЬ',T('это прорубь.'),S('s10')-.05,'#9fd8ff',170,.15);camPath(u,[2.6,.8,3.4],[1.6,2.6,2.6],[HX-.6,1.2,HZ],[HX-.4,.6,HZ],[66,60],.04)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipL',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){wolf.hide();fox.hide();s.f(t,u)}}))};
