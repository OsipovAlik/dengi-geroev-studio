import {kit} from '/lib_ru.js';
// 40 Красная Шапочка: «мама» с нового номера просит денег — перезвони на старый номер
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#7a9a5a'),rB=K.room('rB','#3a4a7a');
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
// --- избушка бабушки: кровать, волк в чепце, табличка
const bed=new THREE.Group();bed.add(box(2.4,.5,1.7,'#8a5a33',0,.25,0));bed.add(box(2.3,.18,1.6,'#f2f2f2',0,.58,0));bed.add(box(.18,1.3,1.7,'#6d3f1d',-1.2,.65,0));
const quilt=box(1.7,.16,1.62,'#e85a6a',.3,.72,0);bed.add(quilt);bed.position.set(1.1,0,-2.6);rA.g.add(bed);
const wolf=drawn(1.7,1.7,(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.lineWidth=14;c.strokeStyle=INK;
 // уши
 c.fillStyle='#7d828c';for(const s of[-1,1]){c.beginPath();c.moveTo(w*.5+s*w*.12,h*.3);c.lineTo(w*.5+s*w*.3,h*.04);c.lineTo(w*.5+s*w*.34,h*.36);c.closePath();c.fill();c.stroke()}
 // чепец
 c.fillStyle='#fff';c.beginPath();c.ellipse(w*.5,h*.42,w*.42,h*.3,0,Math.PI,0);c.fill();c.stroke();
 for(let i=0;i<9;i++){c.beginPath();c.arc(w*(.12+i*.095),h*.43,w*.05,Math.PI,0);c.fill();c.stroke()}
 // морда
 c.fillStyle='#8e939c';c.beginPath();c.ellipse(w*.5,h*.6,w*.3,h*.24,0,0,7);c.fill();c.stroke();
 c.fillStyle='#c9ccd2';c.beginPath();c.ellipse(w*.5,h*.74,w*.2,h*.13,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*.65,w*.06,h*.04,0,0,7);c.fill();
 // хитрые глаза
 for(const s of[-1,1]){c.fillStyle='#ffd23f';c.beginPath();c.ellipse(w*.5+s*w*.12,h*.53,w*.055,h*.04,0,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.5+s*w*.12,h*.535,w*.018,0,7);c.fill();c.lineWidth=12;c.beginPath();c.moveTo(w*.5+s*w*.04,h*.49);c.lineTo(w*.5+s*w*.2,h*.47);c.stroke()}
 // зубы
 c.fillStyle='#fff';c.lineWidth=7;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(w*(.5+i*.05-.022),h*.79);c.lineTo(w*(.5+i*.05),h*.84);c.lineTo(w*(.5+i*.05+.022),h*.79);c.closePath();c.fill();c.stroke()}
 // ленточка
 c.fillStyle='#d8263f';c.lineWidth=10;for(const s of[-1,1]){c.beginPath();c.moveTo(w*.5,h*.9);c.lineTo(w*.5+s*w*.14,h*.84);c.lineTo(w*.5+s*w*.14,h*.97);c.closePath();c.fill();c.stroke()}},1.15,1.35,-2.75);rA.g.add(wolf);
const hutSign=K.stand(2.2,.8,'#fff3d6',[{t:'ДОМ БАБУШКИ',s:80,y:.52,c:'#5a3a1a'}],-1.2,3.3,-3.9);rA.g.add(hutSign);
const basket=drawn(.8,.6,(c,w,h)=>{c.lineWidth=10;c.strokeStyle=INK;c.fillStyle='#c58a4e';c.beginPath();c.moveTo(w*.08,h*.4);c.lineTo(w*.92,h*.4);c.lineTo(w*.8,h*.95);c.lineTo(w*.2,h*.95);c.closePath();c.fill();c.stroke();c.beginPath();c.arc(w*.5,h*.4,w*.3,Math.PI,0);c.stroke();c.fillStyle='#ffd23f';c.beginPath();c.arc(w*.4,h*.38,w*.08,0,7);c.fill();c.stroke()},-1.0,.5,-1.0);rA.g.add(basket);
// --- комната с телефоном: огромный экран чата
const chat=(c,w,h,st)=>{c.lineWidth=16;c.strokeStyle=INK;c.fillStyle='#22242c';c.beginPath();c.roundRect(8,8,w-16,h-16,60);c.fill();c.stroke();
 c.fillStyle=st==='bad'?'#ffd9d9':'#eef6ff';c.fillRect(40,90,w-80,h-180);
 c.fillStyle='#3f6fb5';c.fillRect(40,90,w-80,140);c.fillStyle='#fff';c.font='800 58px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('МАМА',w/2,140);c.font='800 34px Pop';c.fillStyle='#ffd23f';c.fillText('новый номер',w/2,198);
 const bub=(y,txt,col)=>{c.fillStyle=col;c.beginPath();c.roundRect(70,y,w-170,96,30);c.fill();c.lineWidth=6;c.strokeStyle=INK;c.stroke();c.fillStyle=INK;c.font='800 44px Pop';c.textAlign='left';c.fillText(txt,100,y+50,w-230)};
 if(st!=='ok'){bub(280,'Это мой новый номер','#fff');bub(400,'Срочно переведи!','#fff');bub(520,'Никому не говори','#fff')}
 if(st==='bad'){c.fillStyle='#c4453a';c.font='800 70px Pop';c.textAlign='center';c.fillText('ОТПРАВЛЕНО',w/2,h-200)}
 if(st==='ok'){c.textAlign='center';c.fillStyle='#2f9e6e';c.font='800 '+Math.round(w*.15)+'px Pop';c.fillText('ЗВОНОК',w/2,h*.47);c.fillText('МАМЕ',w/2,h*.55);c.font='800 '+Math.round(w*.09)+'px Pop';c.fillStyle=INK;c.fillText('старый номер',w/2,h*.63);c.fillStyle='#2f9e6e';c.beginPath();c.arc(w/2,h*.77,w*.12,0,7);c.fill();c.lineWidth=8;c.stroke()}};
const phoneA=drawn(1.7,3.0,(c,w,h)=>chat(c,w,h,''),.9,1.95,-3.7),phoneB=drawn(1.7,3.0,(c,w,h)=>chat(c,w,h,'bad'),.9,1.95,-3.7),phoneC=drawn(1.7,3.0,(c,w,h)=>chat(c,w,h,'ok'),.9,1.95,-3.7);
rB.g.add(phoneA,phoneB,phoneC);
const avatar=K.stand(1.3,1.3,'#fff',[{t:'ФОТО',s:70,y:.35},{t:'МАМЫ',s:70,y:.68}],-1.7,2.9,-3.9);rB.g.add(avatar);
// --- стол сверху: три признака
const tbl=K.makeTable('tbl','ТРИ ПРИЗНАКА ВОЛКА',[['НОВЫЙ НОМЕР','«мой старый сломался»'],['СРОЧНО','не дают подумать'],['НИКОМУ НЕ ГОВОРИ','отрезают от помощи']]);
const pen=box(.12,.12,2.2,'#d8263f',1.6,.12,1.4);pen.rotation.y=.6;tbl.g.add(pen);
const three=drawn(1.6,2.0,(c,w,h)=>{c.lineWidth=26;c.strokeStyle=INK;c.lineJoin='round';c.fillStyle='#d8263f';c.font='800 '+Math.round(h*.95)+'px Pop';c.textAlign='center';c.textBaseline='middle';c.strokeText('3',w/2,h*.52);c.fillText('3',w/2,h*.52)},-3.0,.06,-1.6);three.rotation.x=-Math.PI/2;tbl.g.add(three);
const phoneT=box(.9,.1,1.7,'#22242c',3.3,.05,-1.4);tbl.g.add(phoneT);
// --- город: билборды
K.billboard(city.g,'ПЕРЕЗВОНИ','НА СТАРЫЙ НОМЕР',0,9,-26,16,9,'#7dff9a');K.billboard(city.g,'ЗАВТРА','КАША ИЗ ТОПОРА',0,9,24,16,9,'#ffd23f');
// --- герои
const hood=new Puppet('woman',2.3);scene.add(hood.m);hood.hide();
const HD={col:'#d8263f',hair:'#b01c2e'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});pen.visible=true;three.visible=true;phoneT.visible=true;scene.background=new THREE.Color('#e9c58c');f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(.3,-.4,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const hut=(to,u)=>{resetRoom(rA);rA.color(u,rA.base,new THREE.Color(to))};
const flat=(to,u,ph)=>{resetRoom(rB);rB.color(u,rB.base,new THREE.Color(to));phoneA.visible=ph==='a';phoneB.visible=ph==='b';phoneC.visible=ph==='c'};
const gone=T('и деньги ушли'),old=T('на старый номер.'),hd2=T('Шапочка тоже'),scm=T('чужой аккаунт,');
const shots=[
{id:'hook',t0:0,t1:hd2,out:'whipR',f(t,u){flat('#3a4a7a',0,'a');hood.pose(-1.3,-1.2,{expr:'neutral',look:.5,aR:[.9,1.3],propR:'phone',...HD,blink:blink(t)});
 camPath(u,[-1.4,.7,3.8],[-.4,1.1,3.2],[.2,1.9,-2],[.4,1.9,-2.5],[66,58],.04);fx.draw=K.hook(['МАМА ПИШЕТ','С НОВОГО НОМЕРА?'],0,hd2-.05)}},
{id:'hood',t0:hd2,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){hut('#7a9a5a',0);hood.pose(-1.1,-1.0,{expr:'smile',look:.5,aL:[.4,.4],...HD,blink:blink(t)});
 fx.tags=[{txt:'ШАПОЧКА',t:hd2+.1,xy:[.3,.2]},{txt:'«БАБУШКА»',t:hd2+.6,xy:[.68,.2]}];camPath(u,[2.4,.7,3.8],[.6,1.1,3.2],[0,1.4,-2],[.2,1.3,-2.2],[68,60],-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){tb();fx.draw=K.big('ПРАВИЛО',S('s02')+.1,S('s03'),'#7dff9a',180,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'wolf',t0:S('s03'),t1:S('s04'),in:'whipL',out:'whipR',f(t,u){hut('#5a6a8a',ss(0,1,u));hood.pose(-1.3,-.6,{expr:'neutral',look:.6,...HD,blink:blink(t)});
 fx.tags=[{txt:'ВОЛК В ЧЕПЦЕ',t:S('s03')+.3,xy:[.62,.18]}];camPath(u,[2.2,1.5,2.8],[1.5,1.5,.5],[1.1,1.2,-2.7],[1.1,1.3,-2.7],[58,46],.03)}},
{id:'scam',t0:S('s04'),t1:scm,in:'whipR',out:'whipL',f(t,u){flat('#3a4a7a',0,'a');hood.pose(-1.4,-1.0,{expr:'neutral',look:.6,aR:[.9,1.3],propR:'phone',...HD,blink:blink(t)});
 camPath(u,[-2.6,.8,3.6],[-1.2,1.0,3.0],[0,2,-2.5],[.4,2,-3],[66,60],-.04)}},
{id:'screen',t0:scm,t1:S('s05'),in:'whipL',out:'zoom',f(t,u){flat('#3a4a7a',0,'a');
 fx.tags=[{txt:'ЧУЖОЙ АККАУНТ',t:scm+.05,xy:[.5,.12]},{txt:'РОДНОЕ ФОТО',t:T('родное фото,'),xy:[.5,.2]},{txt:'СРОЧНАЯ БЕДА',t:T('срочная беда.'),xy:[.5,.28]}];
 camPath(u,[.2,1.6,1.6],[.85,1.95,-2.0],[.9,1.95,-3.7],[.9,1.95,-3.7],[60,50],0)}},
{id:'signs',t0:S('s05'),t1:S('s06'),in:'zoom',out:'whipUp',f(t,u){tb(()=>{tbl.hl[0].material.opacity=t>T('новый номер,')?.7:0;tbl.hl[1].material.opacity=t>T('срочно,')?.7:0;tbl.hl[2].material.opacity=t>T('никому не говори.')?.7:0});
 const a=lerp(-.2,.9,u);cam.position.set(Math.sin(a)*.6-.6,lerp(12,10.5,ease(u)),Math.cos(a)*.6);cam.up.set(0,0,-1);cam.lookAt(-.6,0,0);cam.up.set(0,1,0);cam.fov=56;cam.updateProjectionMatrix()}},
{id:'sent',t0:S('s06'),t1:gone,in:'whipUp',out:'whipR',f(t,u){flat('#3a4a7a',0,'a');hood.pose(-1.3,-1.1,{expr:'neutral',look:.5,aR:[1.1,1.2],propR:'phone',...HD,blink:blink(t)});
 fx.draw=K.big('ПЕРЕВОД',S('s06')+.05,gone-.05,'#ffffff',170,.17);camPath(u,[1.8,.7,3.7],[.8,1.0,3.3],[-.6,1.8,-1.5],[-.6,1.7,-1.5],[64,56],.05)}},
{id:'impact',t0:gone,t1:S('s07'),in:'whipR',out:'whipL',f(t,u){flat('#8a2a2a',ss(0,.4,u),'b');const k=Math.max(0,1-(t-gone)/.5);
 hood.pose(-1.4,-1.0,{expr:'shock',look:.5,aR:[1.6,.4],...HD,blink:false});
 camPath(u,[-.6,.9,3.6],[-.2,1.3,3.0],[.4,2,-3],[.5,1.9,-3],[66,58],-.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.08*k;
 fx.crack={p:[.9,2.0,-3.65],a:clamp((t-gone)*2.5),seed:7};fx.flash=k*.8;fx.draw=K.big('ДЕНЬГИ УШЛИ',gone,S('s07')-.05,'#ff5a5a',140,.17)}},
{id:'rule',t0:S('s07'),t1:old,in:'whipL',out:'zoom',f(t,u){flat('#59b86a',ss(0,.7,u),'c');hood.pose(-1.3,-1.1,{expr:'smile',look:.5,aR:[1.9,.5],propR:'phone',...HD,blink:blink(t)});
 fx.draw=K.big('ПЕРЕЗВОНИ',S('s07')+.1,old-.05,'#7dff9a',160,.17);camPath(u,[2.2,.8,3.6],[1.0,1.6,1.0],[0,1.9,-2],[.9,1.95,-3.7],[66,54],.04)}},
{id:'oldnum',t0:old,t1:S('s08'),in:'zoom',out:'whipUp',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-10,6,10],[0,8.5,4],[0,9,-26],[0,9,-26],[62,54],.06*(1-u))}},
{id:'ask',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){hut('#5a6a8a',0);hood.pose(-.8,-1.0,{expr:'sly',look:.6,talk:E.talk(t),aL:[1.2,.6],...HD,blink:blink(t)});
 fx.draw=K.big('СВОЙ ЗНАЕТ',S('s08')+.1,S('s09')-.05,'#ffd23f',150,.17);fx.tags=[{txt:'КАКОЙ ПИРОГ?',t:S('s08')+.6,xy:[.62,.3]}];
 camPath(u,[-1.2,.9,3.8],[.2,1.1,3.0],[.4,1.5,-2.6],[.9,1.3,-2.7],[66,56],-.04)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipR',out:'whipUp',f(t,u){tb(()=>tbl.hl.forEach(h=>{h.material.opacity=.7;h.material.color.set('#7dff9a')}));
 fx.draw=K.big('ПРОВЕРЬ ДВАЖДЫ',S('s09')+.05,S('s10')-.05,'#ffd23f',130,.17);orb(u,8,5,1.5,2.5,.2-u*.4,-1)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){hood.hide();s.f(t,u)}}))};
