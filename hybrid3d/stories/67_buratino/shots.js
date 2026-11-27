import {kit} from '/lib_ru.js';
// 67 Буратино (А. Толстой): импульсивная покупка — продал азбуку за 4 сольдо ради билета в театр; 2 спонтанные покупки по 10 в неделю = 20, за год 20 × 52 = 1040; правило суток: не по списку — подожди 24 часа
// Цветовая идея: тёплое дерево каморки → кричащий красный соблазна → холодный синий пустого кошелька → спокойный зелёный правила
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*240),Math.round(h*240),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.castShadow=true;m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:m.material.map,alphaTest:.5,side:THREE.DoubleSide});return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- Буратино (своя рисовка): деревянный мальчик, длинный острый нос, зелёный колпак с белыми полосами, жёлтая курточка, красные штанишки
const bur=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const WD='#e9b77a';
 c.fillStyle=WD;for(const s of[-1,1]){c.beginPath();c.roundRect(w*(.5+s*.08)-w*.035,h*.7,w*.07,h*.24,8);c.fill();c.stroke()}
 c.fillStyle='#8a4a22';for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*.1),h*.95,w*.08,h*.028,0,0,7);c.fill();c.stroke()}
 c.fillStyle='#d8323a';c.beginPath();c.roundRect(w*.36,h*.62,w*.28,h*.12,10);c.fill();c.stroke();
 c.fillStyle='#ffcf3a';c.beginPath();c.moveTo(w*.34,h*.64);c.lineTo(w*.37,h*.42);c.lineTo(w*.63,h*.42);c.lineTo(w*.66,h*.64);c.closePath();c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(w*.5,h*.5,w*.02,0,7);c.fill();c.stroke();
 const up=mood==='win'||mood==='buy';for(const s of[-1,1]){c.save();c.translate(w*(.5+s*.14),h*.44);c.rotate(s*(up&&(mood==='win'||s>0)?-2.4:-.25));c.fillStyle='#ffcf3a';c.beginPath();c.roundRect(-w*.03,0,w*.06,h*.15,8);c.fill();c.stroke();c.fillStyle=WD;c.beginPath();c.arc(0,h*.165,w*.035,0,7);c.fill();c.stroke();c.restore()}
 const hy=.29,hr=.17;c.fillStyle=WD;c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();
 // нос
 c.beginPath();c.moveTo(w*.6,h*(hy+.005));c.lineTo(w*.97,h*(hy+.02));c.lineTo(w*.6,h*(hy+.04));c.closePath();c.fill();c.stroke();
 // колпак
 c.fillStyle='#2f9a4a';c.beginPath();c.moveTo(w*.32,h*(hy-.06));c.quadraticCurveTo(w*.5,h*(hy-.2),w*.68,h*(hy-.06));c.lineTo(w*.2,h*(hy-.26));c.closePath();c.fill();c.stroke();
 c.strokeStyle='#fff';c.lineWidth=8;for(const k of[.3,.55]){c.beginPath();c.moveTo(lerp(w*.68,w*.2,k)+0,lerp(h*(hy-.06),h*(hy-.26),k));c.lineTo(lerp(w*.32,w*.2,k),lerp(h*(hy-.06),h*(hy-.26),k)+h*.02);c.stroke()}c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#fff';c.beginPath();c.arc(w*.2,h*(hy-.26),w*.04,0,7);c.fill();c.stroke();
 c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.07),h*(hy-.015),w*.045,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.51+s*.07),h*(hy-.01),w*.022,0,7);c.fill()}
 c.fillStyle='#ff8a7a';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.11),h*(hy+.05),w*.025,0,7);c.fill()}
 if(mood==='sad'){c.beginPath();c.arc(w*.5,h*(hy+.12),w*.05,PI*1.15,PI*1.85);c.stroke()}else{c.beginPath();c.arc(w*.5,h*(hy+.06),w*.06,PI*.15,PI*.85);c.stroke()}};
const mk=(fn,moods,w,h)=>{const o={};moods.forEach(md=>{o[md]=drawn(w,h,fn(md));scene.add(o[md]);o[md].visible=false});return o};
const BU=mk(bur,['happy','sad','buy','win'],1.3,1.9);
const BB=[...Object.values(BU)];
const put=(set,md,x,z,t,y=0)=>{Object.values(set).forEach(m=>m.visible=false);const m=set[md];m.visible=true;m.position.set(x,y+Math.abs(Math.sin(t*3.6))*.03,z)};
const carlo=new Puppet('big',1.95);scene.add(carlo.m);const CAR={hair:'#b8b8b8'};
// ---------- каморка папы Карло: тёплое дерево
const rC=K.room('rC','#a8743a');
const tbl=new THREE.Group();tbl.position.set(.8,0,-2.4);tbl.add(box(1.6,.08,1.0,'#7a4a22',0,.9,0));for(const x of[-.7,.7])for(const z of[-.4,.4])tbl.add(box(.08,.9,.08,'#5a3418',x,.45,z));rC.g.add(tbl);
const abcTex=label(400,520,'#e8402a',[{t:'АЗБУКА',s:84,y:.3,c:'#ffffff'},{t:'А Б В',s:96,y:.66,c:'#ffd23f'}],{border:INK,bw:14});
const abc=new THREE.Mesh(new THREE.BoxGeometry(.5,.08,.65),[lam('#f6f0e0'),lam('#f6f0e0'),new THREE.MeshLambertMaterial({map:abcTex}),lam('#e8402a'),lam('#f6f0e0'),lam('#f6f0e0')]);abc.position.set(.8,.98,-2.4);abc.castShadow=true;rC.g.add(abc);
const hearth=K.stand(1.8,1.4,'#ff9a3a',[{t:'ОЧАГ',s:110,y:.55,c:'#7a2a10'}],-1.6,1.4,-3.95);rC.g.add(hearth);
const shop=(t,u=0)=>{resetRoom(rC);rC.col(u,'#4a6a9a');abc.visible=true};
// ---------- улица с театром (городок)
const gS=new THREE.Group();const road=plane(200,200,lam('#d8c8a0'),0,0,0,-PI/2);road.receiveShadow=true;gS.add(road);
const RS=rng(67);for(let i=0;i<8;i++){const h=3+RS()*3;const col=['#f2b36b','#e88a6a','#9ac0e0','#f0d080'][i%4];const x=(i%2?1:-1)*(5+RS()*2),z=-i*4+6;gS.add(box(3.2,h,3.4,col,x,h/2,z));gS.add(box(3.6,.35,3.8,'#8a3a2a',x,h+.18,z))}
const tent=new THREE.Group();tent.position.set(0,0,-10);const stripes=canvasTex(512,256,(c,w,h)=>{for(let i=0;i<16;i++){c.fillStyle=i%2?'#ffffff':'#e8203a';c.fillRect(i*w/16,0,w/16,h)}},{wrap:true});
const tb=new THREE.Mesh(new THREE.CylinderGeometry(3,3,3.2,32,1,true),lam('#fff',{map:stripes,side:THREE.DoubleSide}));tb.position.y=1.6;tb.castShadow=true;tent.add(tb);
const tr=new THREE.Mesh(new THREE.ConeGeometry(3.4,2.6,32),lam('#fff',{map:stripes}));tr.position.y=4.5;tr.castShadow=true;tent.add(tr);tent.add(cyl(.05,1.2,'#333',0,6.2,0));
const flag=plane(.8,.5,lam('#ffd23f',{side:THREE.DoubleSide}),.4,6.5,0);tent.add(flag);
const tsign=K.stand(4.2,1.1,'#ffd23f',[{t:'ТЕАТР',s:150,y:.56,c:'#e8203a'}],0,3.6,3.05);tent.add(tsign);
const door=box(1.4,2.2,.1,'#3a0a14',0,1.1,2.98);tent.add(door);gS.add(tent);
const lamps=[];for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshBasicMaterial({color:'#ffe680'}));const a=i/10*PI*2;b.position.set(Math.cos(a)*3.05,3.25,Math.sin(a)*3.05);tent.add(b);lamps.push(b)}
gS.add(new THREE.HemisphereLight('#fff4e0','#6a5a4a',3.0));sunRig(gS,[-10,18,10],[0,0,-6],'#ffe2b0',2.6,16);addSet('street',gS);
const street=(t,bg='#ffc070')=>{gS.visible=true;scene.background=new THREE.Color(bg);lamps.forEach((l,i)=>l.material.color.set((Math.floor(t*6)+i)%2?'#ffe680':'#ff6a3a'))};
// ---------- обмен (сверху): азбука → 4 сольдо → билет
const gX=new THREE.Group();gX.add(Object.assign(plane(60,60,lam('#7a2a1a'),0,0,0,-PI/2),{receiveShadow:true}));
const abc2=abc.clone();abc2.scale.setScalar(4);abc2.position.set(0,.18,0);gX.add(abc2);
const sol=[];for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.12,32),[lam('#e0a030'),new THREE.MeshLambertMaterial({map:label(256,256,'#ffcf3a',[{t:'1',s:170,y:.55,c:'#7a4a00'}],{border:'#7a4a00',bw:12})}),lam('#e0a030')]);c.castShadow=true;gX.add(c);sol.push(c)}
const ticket=plane(2.6,1.3,new THREE.MeshLambertMaterial({map:label(520,260,'#ffe680',[{t:'БИЛЕТ',s:120,y:.45,c:'#e8203a'},{t:'В ТЕАТР',s:56,y:.8,c:'#15131a'}],{border:'#e8203a',bw:14}),side:THREE.DoubleSide}),0,.1,0,-PI/2);ticket.castShadow=true;gX.add(ticket);
gX.add(new THREE.HemisphereLight('#fff','#5a2a1a',3.0));sunRig(gX,[-5,14,6],[0,0,0],'#fff1d9',2.5,8);addSet('swap',gX);
const swap=(t,{a=1,s=0,tk=0}={})=>{gX.visible=true;scene.background=new THREE.Color('#5a1a10');abc2.visible=a>0;abc2.scale.setScalar(4*Math.max(.001,a));sol.forEach((c,i)=>{const k=clamp(s*4-i);c.visible=k>0&&tk<1;const ang=i/4*PI*2+PI/4;c.position.set(Math.cos(ang)*1.3*(1-tk),.08+(1-k)*2,Math.sin(ang)*1.3*(1-tk))});ticket.visible=tk>0;ticket.scale.setScalar(Math.max(.001,tk))};
// ---------- импульс: огромный телефон с кнопкой «КУПИТЬ СЕЙЧАС»
const rP=K.room('rP','#e8203a');
const phone=new THREE.Group();phone.position.set(0,0,-2.6);rP.g.add(phone);phone.add(box(2.4,4.0,.25,'#15131a',0,2.0,0));
const scrTex=(bt)=>label(440,760,'#ffffff',[{t:'СКИДКА',s:72,y:.09,c:'#e8203a'},{t:'−50%',s:130,y:.22,c:'#e8203a'},{t:'ТОЛЬКО',s:44,y:.35,c:'#15131a'},{t:'СЕГОДНЯ!',s:60,y:.41,c:'#15131a'}],{border:INK,bw:10,extra:(c,w,h)=>{c.fillStyle='#2fae4a';c.beginPath();c.roundRect(40,h*.48,w-80,h*.2,30);c.fill();c.fillStyle='#fff';c.font='800 66px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('КУПИТЬ',w/2,h*.54);c.fillText('СЕЙЧАС',w/2,h*.62);c.fillStyle='#d8dde4';for(let i=0;i<3;i++)c.fillRect(60,h*(.75+i*.06),w-120-(i%2)*80,18)}});
const scr=plane(2.1,3.6,new THREE.MeshBasicMaterial({map:scrTex(1)}),0,2.0,.13);phone.add(scr);
const cart=new THREE.Group();cart.position.set(1.8,0,-1.0);cart.add(box(1.2,.7,.8,'#c8d0d8',0,.8,0));cart.add(cyl(.03,.9,'#555',.62,1.1,0));for(const x of[-.45,.45])cart.add(cyl(.1,.06,'#333',x,.12,.35).rotateX(PI/2));const parcel=box(.6,.4,.5,'#c89a5a',0,1.35,0);cart.add(parcel);rP.g.add(cart);
const impulse=(t,{u=0,box2=0}={})=>{resetRoom(rP);rP.col(u,'#ff4a8a');parcel.visible=box2>0;parcel.position.y=1.35+(1-box2)*2.5};
// ---------- счёт за год: недели-столбики
const gW=new THREE.Group();gW.add(Object.assign(plane(200,200,lam('#24304a'),0,0,0,-PI/2),{receiveShadow:true}));
const WK=[];const mat=lam('#ff5a3a');for(let i=0;i<52;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.28,.2,.28),mat);b.castShadow=true;const col=i%13,row=Math.floor(i/13);b.position.set(-2.4+col*.4,.1,-1.6-row*.5);gW.add(b);WK.push(b)}
gW.add(new THREE.HemisphereLight('#e6f0ff','#2a2a4a',3.2));sunRig(gW,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('weeks',gW);
const weeks=(t,{n=0,bg=0}={})=>{gW.visible=true;scene.background=new THREE.Color('#ffb08a').lerp(new THREE.Color('#2a3a6a'),bg);WK.forEach((b,i)=>{const k=clamp(n*52-i);b.visible=k>0;b.scale.y=Math.max(.001,k)*4;b.position.y=.4*k})};
// ---------- правило
const tR=K.makeTable('tR','ПРАВИЛО СУТОК',[['НЕ ПО СПИСКУ?','подожди 24 часа'],['ЖЕЛАНИЕ ПРОШЛО?','деньги остались у вас']],'#b58a5e');
const clock=new THREE.Group();clock.position.set(2.6,.05,-1.6);const dial=cyl(1.0,.1,'#ffffff',0,0,0);clock.add(dial);const hand=box(.08,.06,.8,'#e8203a',0,.1,-.4);const hp=new THREE.Group();hp.position.y=.06;hp.add(hand);clock.add(hp);tR.g.add(clock);
const rule=(t,hl,spin=0)=>{tR.g.visible=true;scene.background=new THREE.Color('#9ad8a8');tR.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')});hp.rotation.y=-spin*PI*2};
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
// ---------- город: билборды
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','ПРАВИЛО СУТОК',0,9,-26,16,9,'#7dff9a');K.billboard(city.g,'ДАЛЬШЕ','СВИНЬЯ ПОД ДУБОМ',0,9,24,16,9,'#ffb0c0');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const bu=T('Буратино'),pk=T('Папа Карло'),pr=T('продал куртку,'),ea=T('ему азбуку.'),ab=T('А Буратино'),ut=T('увидел театр'),ip=T('и продал азбуку'),z4=T('за 4 сольдо —'),nb=T('на билет.'),zh=T('Захотелось —'),sk=T('и сразу купил.'),ei=T('Это импульсивная'),un=T('У нас так же:'),kn=T('кнопка'),iv=T('и вещь'),dv=T('Две спонтанные'),p10=T('по 10 в неделю —'),e20=T('это 20.'),zg=T('За год —'),y1040=T('1040.'),ps=T('Правило суток:'),pd=T('подожди 24 часа.'),ch=T('Часто желание'),sa=T('Сначала азбука,'),pt=T('потом театр.'),sub=T('Подпишись,');
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:bu,out:'whipR',f(t,u){shop(t,.6);put(BU,'sad',-.4,-2.0,t);camPath(u,[-1.4,.7,2.0],[-.8,.8,1.3],[-.4,1.65,-2.0],[-.4,1.7,-2.0],[62,58],.03);fx.draw=K.hook(['ЗАРПЛАТЫ НЕТ','ЧЕРЕЗ 3 ДНЯ?'],0,bu-.05)}},
{id:'name',t0:bu,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){street(t);put(BU,'happy',0,2,t);linPath(u,[-3,1.0,7],[-1.2,1.3,5.2],[0,1.5,1.5],[0,1.7,1.5],[58,54],.03);fx.draw=K.big('БУРАТИНО',bu+.05,S('s02')-.05,'#ffcf3a',170,.14)}},
{id:'promise',t0:S('s02'),t1:pk,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'carlo',t0:pk,t1:ea,in:'zoom',out:'whipL',f(t,u){shop(t);const sold=t>pr+.5;carlo.pose(-.8,-2.0,{...CAR,col:sold?'#f0ece0':'#7a5a3a',expr:sold?'smile':'neutral',look:.5,aL:[.3,.2],aR:sold?[1.6,.8]:[.3,.2],propR:sold?'cash':undefined,talk:talk(t),blink:blink(t)});camPath(u,[-2.0,1.0,2.4],[-.6,1.3,1.6],[-.6,1.6,-2.2],[-.2,1.6,-2.2],[60,56],.02);fx.tags=[{txt:'КУРТКА ПРОДАНА',t:pr+.4,xy:[.5,.14]}]}},
{id:'abc',t0:ea,t1:ab,in:'whipL',out:'whipR',f(t,u){shop(t);topv(u,-.5,.4,2.6,2.0,.8,.95,-2.4,58);fx.draw=K.big('АЗБУКА',ea+.05,ab-.05,'#ffffff',180,.13)}},
{id:'theatre',t0:ab,t1:ip,in:'whipR',out:'whipUp',f(t,u){street(t,'#ff9a6a');put(BU,'happy',lerp(-1.4,0,u),lerp(4,1.5,u),t);const a=lerp(-.7,.5,u);cam.position.set(Math.sin(a)*14,lerp(8,4,ease(u)),-4+Math.cos(a)*14);cam.lookAt(0,2.2,-6);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'swap',t0:ip,t1:zh,in:'whipUp',out:'whipL',f(t,u){swap(t,{a:1-ss(z4-.2,z4+.3,t),s:ss(z4,z4+.7,t),tk:ss(nb-.1,nb+.4,t)});topv(u,-.6,.6,6.0,5.2,0,0,0,58);fx.draw=K.big(t<nb?'4 СОЛЬДО':'БИЛЕТ',z4,zh-.05,'#ffcf3a',180,.13)}},
{id:'bought',t0:zh,t1:ei,in:'whipL',out:'whipUp',f(t,u){const h=t-sk-.3;street(t,'#ff5a3a');put(BU,'win',0,1.6,t,Math.abs(Math.sin(t*6))*.15);camPath(u,[-1.4,.6,5.4],[-.6,.8,4.4],[0,1.4,1.6],[0,1.5,1.6],[58,54],.02);shake(t,sk+.3,.35,.7);if(h>0){fx.flash=Math.max(0,1-h/.25);fx.crack={p:[0,2.2,1.4],a:clamp(h*3),seed:67}}fx.draw=K.big('КУПИЛ!',sk+.3,ei-.05,'#ffffff',220,.14)}},
{id:'impulse',t0:ei,t1:S('s05'),in:'whipUp',out:'zoom',f(t,u){impulse(t);linPath(u,[-1.8,1.4,3.6],[.6,1.8,3.2],[0,1.9,-2.6],[0,2.0,-2.6],[60,56],0);fx.draw=K.big('ИМПУЛЬС!',ei+.05,S('s05')-.05,'#ffffff',170,.09)}},
{id:'phone',t0:S('s05'),t1:iv,in:'zoom',out:'whipR',f(t,u){impulse(t,{u:ss(un,kn,t)});const k=ease(u);cam.position.set(lerp(.6,0,k),lerp(2.2,2.0,k),lerp(1.8,-.6,k));cam.lookAt(0,1.6,-2.6);cam.fov=58;cam.updateProjectionMatrix()}},
{id:'cart',t0:iv,t1:dv,in:'whipR',out:'whipUp',f(t,u){impulse(t,{u:1,box2:ss(iv+.2,iv+.8,t)});camPath(u,[.2,1.6,1.8],[.6,2.4,1.2],[1.8,1.1,-1.0],[1.8,1.0,-1.0],[56,54],.03);fx.draw=K.big('В КОРЗИНЕ',iv+.3,dv-.05,'#ffffff',170,.13)}},
{id:'weeks',t0:dv,t1:ps,in:'whipUp',out:'whipL',f(t,u){weeks(t,{n:ss(zg,y1040,t),bg:ss(zg,y1040+.5,t)});const a=lerp(-.5,.4,u);cam.position.set(Math.sin(a)*1+0,lerp(5.2,7.4,ease(u)),lerp(2.6,3.2,u));cam.lookAt(0,0,-2.4);cam.fov=58;cam.updateProjectionMatrix();
 fx.draw=K.big(t<e20?'10 + 10':(t<zg?'= 20 В НЕДЕЛЮ':(t<y1040?'× 52 НЕДЕЛИ':'1040 ЗА ГОД')),dv+.1,ps-.05,t<y1040?'#ffffff':'#ff5a3a',t<e20?220:(t<y1040?130:150),.14);shake(t,y1040+.05,.15,.4)}},
{id:'rule',t0:ps,t1:sa,in:'whipL',out:'zoom',f(t,u){rule(t,[t>pd-.1,t>ch-.1],ss(pd,pd+1.2,t));topv(u,-.4,.25,10.6,9.0,.6,0,0,60);fx.draw=K.big('24 ЧАСА',pd,ch-.05,'#15131a',190,.13)}},
{id:'abc2',t0:sa,t1:S('s09'),in:'zoom',out:'whipUp',f(t,u){shop(t);put(BU,'happy',-.6,-2.0,t);camPath(u,[-1.8,.9,1.8],[-.6,1.1,1.0],[0,1.05,-2.2],[0,1.1,-2.2],[58,54],-.02);fx.draw=K.hook(['СНАЧАЛА АЗБУКА,','ПОТОМ ТЕАТР'],sa+.05,S('s09')-.05)}},
{id:'next',t0:S('s09'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){street(t);put(BU,'win',0,2,t,Math.abs(Math.sin(t*5))*.1);camPath(u,[1.4,.8,6.4],[.6,1.0,5.2],[0,1.15,1.8],[0,1.2,1.8],[56,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){BB.forEach(m=>m.visible=false);carlo.hide();f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
