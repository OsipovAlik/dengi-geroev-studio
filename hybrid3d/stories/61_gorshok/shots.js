import {kit} from '/lib_ru.js';
// 61 Горшочек каши (братья Гримм): овердрафт и кредитный лимит — деньги кончились, а оплата проходит; минус 100 под 30% годовых — через год около 130; правило: знать своё «не вари» — отключить овердрафт или поставить лимит трат на карту
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK,Puppet,blink,talk}=E;
const K=kit(E);const PI=Math.PI;
// ---------- люди
const mom=new Puppet('woman',1.85);const MOM={col:'#6a4fa3',hair:'#8a5a2a'};
const girl=new Puppet('woman',1.35);const GIRL={col:'#e8322a',hair:'#f0c040'};
const buy=new Puppet('man',1.85);const BUY={col:'#2d8a4f',hair:'#3a2a1a'};
scene.add(mom.m,girl.m,buy.m);const P=[mom,girl,buy];
// ---------- кухня с горшочком
const rK=K.room('rK','#e8a23a');
rK.g.add(box(1.4,.9,1.0,'#3a3550',.9,.45,-1.8));rK.g.add(box(1.5,.06,1.1,'#15131a',.9,.92,-1.8));
const pot=new THREE.Group();pot.position.set(.9,.95,-1.8);rK.g.add(pot);
pot.add(cyl(.42,.55,'#c0302a',0,.28,0));pot.add(cyl(.44,.08,'#ffd23f',0,.4,0));pot.add(cyl(.46,.06,'#15131a',0,.56,0));
const KC='#f6dc8a';const kTop=cyl(.4,.04,KC,0,.57,0);pot.add(kTop);
const dome=new THREE.Mesh(new THREE.SphereGeometry(.42,20,12,0,PI*2,0,PI/2),lam(KC));dome.castShadow=true;pot.add(dome);
const spill=cyl(1,.04,KC,.9,.02,-1.8);rK.g.add(spill);
const flood=box(5.9,1,7.9,KC,0,.5,0);rK.g.add(flood);
const kitchen=(t,{col='#e8a23a',u=0,boil=1,sp=0,fl=0}={})=>{resetRoom(rK);rK.col(u,col);
 const b=boil*(.5+.5*Math.sin(t*9));dome.visible=boil>0;dome.position.y=.57;dome.scale.set(1,Math.max(.05,boil*(.6+sp*2.5)+b*.15),1);
 spill.visible=sp>0;spill.scale.set(.5+sp*2.6,1,.5+sp*2.6);flood.visible=fl>0;flood.scale.y=Math.max(.01,fl*.7);flood.position.y=fl*.35};
const momP=(t,e='smile',o={})=>mom.pose(-1.0,-.6,{...MOM,expr:e,look:.6,aR:[1.5,.8],aL:[.3,.2],talk:talk(t),blink:blink(t),...o});
// ---------- магазин с терминалом
const rS=K.room('rS','#5a7ab8');
rS.g.add(box(4.2,1.0,.8,'#e6e6ee',0,.5,-1.6));rS.g.add(box(4.3,.06,.9,'#15131a',0,1.03,-1.6));
const term=new THREE.Group();term.position.set(.6,1.06,-1.5);rS.g.add(term);term.add(box(.5,.22,.7,'#15131a',0,.11,0));term.add(box(.46,.5,.08,'#15131a',0,.45,-.25));
const scr={ok:K.stand(1.5,.5,'#7dff9a',[{t:'ОПЛАТА ПРОШЛА',s:56,y:.56,c:'#15131a'}],0,1.0,-.2),stop:K.stand(1.5,.5,'#ffd23f',[{t:'ЛИМИТ: СТОП',s:62,y:.56,c:'#15131a'}],0,1.0,-.2)};Object.values(scr).forEach(m=>term.add(m));
const bal={};[['0','#ffffff','#15131a'],['−40','#ff9a9a','#15131a'],['−100','#e8322a','#ffffff']].forEach(([v,bg,c])=>{const m=K.stand(2.4,.9,bg,[{t:'БАЛАНС',s:50,y:.3,c},{t:v,s:110,y:.7,c}],-.9,2.7,-3.8);rS.g.add(m);bal[v]=m});
const shop=(t,{col='#5a7ab8',u=0,b='0',s='ok'}={})=>{resetRoom(rS);rS.col(u,col);for(const k in bal)bal[k].visible=k===b;for(const k in scr)scr[k].visible=k===s};
const buyP=(t,e='smile',o={})=>buy.pose(-.6,-.5,{...BUY,expr:e,look:.6,aR:[1.3,.6],aL:[.3,.2],propR:'card',blink:blink(t),...o});
// ---------- правило (вид сверху)
const tP=K.makeTable('tP','ПРАВИЛО',[['ОТКЛЮЧИТЬ ОВЕРДРАФТ','в приложении банка'],['ЛИМИТ ТРАТ НА КАРТУ','на день или на месяц'],['ТРАТИТЬ ТОЛЬКО СВОЁ','баланс 0 — значит, стоп']],'#9ac58e');
const topv=(u,a0,a1,h0,h1,cx=0,cy=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,cy+lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,cy,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl)=>{tP.g.visible=true;scene.background=new THREE.Color('#cfe9c0');tP.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#7dff9a')})};
// ---------- монеты долга: 100 + 30
const gK=new THREE.Group();
gK.add(Object.assign(plane(200,200,lam('#3a3550'),0,0,0,-PI/2),{receiveShadow:true}));
const ST=[];for(let i=0;i<13;i++){const g=new THREE.Group();const mat=lam('#e8322a');for(let k=0;k<10;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.09,20),mat);c.position.y=.05+k*.1;c.castShadow=true;c.receiveShadow=true;g.add(c)}gK.add(g);ST.push({g,mat})}
const tm100=K.stand(2.4,.6,'#ffffff',[{t:'МИНУС 100',s:70,y:.56,c:'#15131a'}],-1.3,1.5,-4.6);gK.add(tm100);
const t30=K.stand(2.8,.7,'#ffd23f',[{t:'+30 ЗА ГОД',s:80,y:.56,c:'#15131a'}],1.5,1.5,-4.6);gK.add(t30);
gK.add(new THREE.HemisphereLight('#ffe6f0','#3a2a4a',3.2));sunRig(gK,[-6,20,8],[0,0,-2],'#fff1d9',2.4,16);addSet('coins',gK);
const coins=(t,g1,g2)=>{gK.visible=true;scene.background=new THREE.Color('#ffb38a').lerp(new THREE.Color('#5a1a2a'),g2);
 ST.forEach((s,i)=>{const k=i<10?clamp(g1*10-i):clamp(g2*3-(i-10));s.g.visible=k>0;s.g.position.set(i<10?-2.2+(i%5)*1.1:-1.1+(i-10)*1.1,0,i<10?-1.2-Math.floor(i/5)*1.2:-3.6);s.mat.color.set(i<10?'#e8322a':'#8a1a2a');s.g.children.forEach((c,j)=>c.visible=j<Math.round(k*10))});t30.visible=g2>.95};
// ---------- город: билборды и каша на улицах
K.billboard(city.g,'ЧЕРЕЗ 30 СЕКУНД','СЛОВО «СТОП»',0,9,-26,16,9,'#ff9a3a');K.billboard(city.g,'ЗАВТРА','ЛЯГУШКА И ВОЛ',0,9,24,16,9,'#7dff9a');
const street=plane(400,400,lam(KC),0,0,0,-PI/2);street.receiveShadow=true;city.g.add(street);street.visible=false;
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const title=T('Это горшочек'),nev=T('а слов «не вари»'),zal=T('Каша залила'),konch=T('деньги кончились,'),prohod=T('а оплата проходит.'),tolk=T('Только это'),c130=T('отдаёте около 130.'),ili=T('или поставьте'),sub=T('Подпишись,');
const HOOK=['ДЕНЕГ НОЛЬ,','А КАРТА ПЛАТИТ?'];
const shake=(t,t0,amp=.12,len=.5)=>{const h=t-t0;const q=h>0?Math.max(0,1-h/len):0;cam.position.x+=Math.sin(t*53)*amp*q;cam.position.y+=Math.sin(t*41)*amp*.5*q};
const shots=[
{id:'hook',t0:0,t1:title,out:'whipR',f(t,u){shop(t,{b:'0'});buyP(t,t>T('денег уже ноль?')?'shock':'smile');camPath(u,[-1.6,.8,3.6],[-.6,1.0,2.9],[0,1.5,-1.4],[0,1.6,-1.6],[64,56],.03);fx.draw=K.hook(HOOK,0,title-.05)}},
{id:'title',t0:title,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){kitchen(t,{boil:1});girl.pose(-.4,-.3,{...GIRL,expr:'smile',look:.6,aR:[.3,.2],aL:[.3,.2],blink:blink(t)});const a=lerp(.6,-.1,u);cam.position.set(.4+Math.sin(a)*3.6,lerp(1.0,1.5,u),-1.0+Math.cos(a)*3.6);cam.lookAt(.4,1.3,-1.5);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('ГОРШОЧЕК КАШИ',title+.05,S('s02')-.05,'#ffd23f',150,.16)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'mom',t0:S('s03'),t1:nev,in:'whipL',out:'whipUp',f(t,u){kitchen(t,{boil:1,sp:.2*ss(S('s03'),nev,t)});momP(t);camPath(u,[-2.4,.8,3.4],[-1.2,1.1,2.6],[0,1.4,-1.2],[.3,1.4,-1.4],[60,56],-.03);fx.draw=K.big('«ГОРШОЧЕК, ВАРИ!»',T('«Горшочек, вари!» —'),nev-.05,'#ffd23f',120,.16)}},
{id:'top',t0:nev,t1:zal,in:'whipUp',out:'whipR',f(t,u){const s=.2+.8*ss(nev,zal,t);kitchen(t,{boil:1,sp:s});momP(t,'shock',{aR:[2.2,.3],aL:[2.2,.3],talk:0});topv(u,-.9,.7,2.6,1.9,.9,1.0,-1.8,62);fx.draw=K.big('А «НЕ ВАРИ»?',nev+.05,zal-.05,'#ffffff',150,.14)}},
{id:'flood',t0:zal,t1:S('s04'),in:'whipR',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;street.visible=true;street.position.y=lerp(.05,2.2,ss(zal,S('s04'),t));linPath(u,[30,22,40],[10,16,30],[0,2,0],[0,3,-6],[60,56],.06*(1-u));fx.draw=K.big('КАША НА УЛИЦЕ',T('дом и улицу.'),S('s04')-.05,'#ffd23f',130,.16)}},
{id:'pay',t0:S('s04'),t1:konch,in:'zoom',out:'whipUp',f(t,u){shop(t,{b:'0'});buyP(t,'smile');linPath(u,[-2.2,1.0,3.4],[-1.2,1.1,3.0],[-.4,1.5,-1.6],[0,1.6,-1.6],[58,54],.02);fx.draw=K.big('ОВЕРДРАФТ',S('s04')+.05,konch-.05,'#ff9a3a',160,.14)}},
{id:'pay2',t0:konch,t1:tolk,in:'whipUp',out:'whipL',f(t,u){const b=t<prohod?'0':t<prohod+.8?'−40':'−100';shop(t,{b,col:'#e8322a',u:ss(konch,tolk,t)});buyP(t,b==='−100'?'shock':'smile');camPath(u,[1.6,1.0,3.6],[.4,2.4,3.6],[0,1.6,-1.8],[-.4,2.3,-2.6],[56,60],.02)}},
{id:'dolg',t0:tolk,t1:S('s05'),in:'whipL',out:'whipR',f(t,u){kitchen(t,{boil:1,sp:1,fl:.9,col:'#e8322a',u:1});momP(t,'shock',{aR:[2.2,.3],aL:[2.2,.3],talk:0});camPath(u,[-.6,1.6,3.6],[-.4,1.4,2.4],[-.4,1.5,-.8],[-.6,1.5,-.8],[60,54],.03);fx.draw=K.big('ЭТО ДОЛГ',T('уже долг.'),S('s05')-.05,'#e8322a',160,.16)}},
{id:'coins',t0:S('s05'),t1:c130,in:'whipR',out:'whipUp',f(t,u){coins(t,ss(S('s05'),T('под 30% годовых —')+.3,t),0);tm100.visible=true;camPath(u,[-3.2,3.6,4.4],[-1.4,4.4,4.6],[0,.3,-1.8],[0,.4,-2.4],[58,56],.03);fx.draw=K.big('30% ГОДОВЫХ',T('под 30% годовых —'),c130-.05,'#ff9a3a',150,.14)}},
{id:'impact',t0:c130,t1:S('s06'),in:'whipUp',out:'zoom',f(t,u){coins(t,1,ss(c130-.1,c130+.25,t));topv(u,-.5,.4,9.6,8.2,0,0,-2.2,60);shake(t,c130+.2,.25,.6);const h=t-c130-.2;if(h>0){fx.crack={p:[0,.6,-3.6],a:clamp(h*3),seed:61};fx.flash=Math.max(0,1-h/.25)}fx.draw=K.big('130',c130+.15,S('s06')-.05,'#ff5a3a',300,.14)}},
{id:'rule',t0:S('s06'),t1:ili,in:'zoom',out:'whipR',f(t,u){table([t>T('Отключите овердрафт')-.1,0,0]);topv(u,-.4,.25,10.2,8.4,0,0,0,58);fx.draw=K.big('«НЕ ВАРИ»',T('«не вари».'),ili-.05,'#2d8a4f',170,.1)}},
{id:'limit',t0:ili,t1:S('s07'),in:'whipR',out:'whipL',f(t,u){shop(t,{b:'0',s:'stop',col:'#2d8a4f',u:1});buyP(t,'smile',{aR:[.3,.2],propR:undefined,aL:[.3,.2]});const a=lerp(-.4,.3,u);cam.position.set(.4+Math.sin(a)*3.8,lerp(1.3,1.6,u),-1.4+Math.cos(a)*3.8);cam.lookAt(.2,1.7,-1.6);cam.fov=58;cam.updateProjectionMatrix();fx.draw=K.big('ЛИМИТ ТРАТ',T('лимит трат'),S('s07')-.05,'#7dff9a',160,.14)}},
{id:'stop',t0:S('s07'),t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){kitchen(t,{boil:0,col:'#2d8a4f',u:1});girl.pose(-.2,-.3,{...GIRL,expr:'smile',look:.6,aR:[2.1,.2],aL:[.3,.2],talk:talk(t),blink:blink(t)});momP(t,'smile',{talk:0,aR:[.3,.2]});camPath(u,[-.2,.8,3.6],[.2,1.1,2.4],[.2,1.2,-1.2],[.4,1.2,-1.4],[58,52],.02);fx.draw=K.big('ТОЛЬКО СВОЁ',S('s07')+.05,S('s08')-.05,'#ffffff',160,.16)}},
{id:'next',t0:S('s08'),t1:sub,in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
{id:'sub',t0:sub,t1:dur,in:'whipL',out:null,f(t,u){kitchen(t,{boil:0,col:'#ffd23f',u:1});girl.pose(-.2,-.3,{...GIRL,expr:'smile',look:.6,aR:[2.2+.3*Math.sin(t*8),.4],aL:[.3,.2],blink:blink(t)});momP(t,'smile',{talk:0,aR:[.3,.2]});camPath(u,[1.8,.8,3.8],[.8,1.0,3.0],[0,1.3,-.8],[-.1,1.4,-.9],[58,54],-.02)}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){P.forEach(p=>p.hide());street.visible=false;f.call(this,t,u)}});
return shots};
