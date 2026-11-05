import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#f08ab4'),rB=K.room('rB','#5a4a7a'),rC=K.room('rC','#7a9a5a');
const tbl=K.makeTable('tbl','КРЕДИТ НА ТЕБЯ',[['СУММА ДОЛГА','записана на тебя'],['ДЕНЬГИ ПОЛУЧАЕТ ДРУГ','а платишь ты'],['ЕСЛИ НЕ ПЛАТИШЬ','штрафы и суд']]);
const jamG=new THREE.Group();const barrel=cyl(1.3,2.4,'#7a2150',-1.7,1.2,.2);const bl=plane(2.2,1.1,new THREE.MeshBasicMaterial({map:label(512,256,'#fff',[{t:'ВАРЕНЬЕ',s:96,y:.5}],{border:'#15131a',bw:10})}),0,1.3,1.32);barrel.add(bl);jamG.add(barrel);
const basket=cyl(1.4,.9,'#c9a15c',1.9,.45,.2);jamG.add(basket);for(let i=0;i<7;i++){const c=cyl(.4,.12,'#e8b96a',1.9+Math.cos(i)*.7,.95+(i%2)*.1,.2+Math.sin(i)*.7);jamG.add(c)}tbl.g.add(jamG);
const cards=[['1','КТО ПЛАТИТ?',-2.7],['2','ЧТО СПРОСЯТ?',0],['3','КТО ОТВЕЧАЕТ?',2.7]].map(([n,tx,x])=>{const m=K.stand(2.4,3,'#fff',[{t:n,s:200,y:.34,c:'#d0173a'},{t:tx,s:56,y:.72}],x,1.5,-.5);m.visible=false;tbl.g.add(m);return m});
const one=K.tower('#59b86a',-1.8,0),hun=K.tower('#e0304a',1.8,0);tbl.g.add(one.g,hun.g);
const sg1=K.stand(2.6,1.3,'#fff',[{t:'1',s:150,y:.5}],-1.8,3.5,0),sg2=K.stand(2.6,1.3,'#ffd23f',[{t:'100',s:150,y:.5}],1.8,4.6,0);tbl.g.add(sg1,sg2);
const coin=K.stand(2.8,1.4,'#59b86a',[{t:'+1000',s:120,y:.5,c:'#fff'}],0,.15,3.6);coin.rotation.set(-Math.PI/2,0,0);tbl.g.add(coin);
const debt=K.stand(5.6,1.8,'#e0304a',[{t:'ДОЛГ 100 000',s:120,y:.5,c:'#fff'}],0,.15,3.6);debt.rotation.set(-Math.PI/2,0,0);tbl.g.add(debt);
const stopS=K.stand(1.6,1.6,'#d0173a',[{t:'НЕТ',s:130,y:.5,c:'#fff'}],-2.2,2.0,-3.9);rA.g.add(stopS);
const jam2=cyl(1.0,1.6,'#7a2150',-1.9,.8,-2.4);rB.g.add(jam2);
K.billboard(city.g,'3','ВОПРОСА ДО СОГЛАСИЯ',0,9,-26,16,9);K.billboard(city.g,'ЗАВТРА','КИБАЛЬЧИШ И ОБЩЕЕ ДЕЛО',0,9,24,16,9,'#f0559c');
const pl=new Puppet('man',2.7),en=new Puppet('big',3.0);[pl,en].forEach(p=>{scene.add(p.m);p.hide()});
const PL={col:'#c0392b',hair:'#e0a030',tie:'#ffd23f'},EN={col:'#3a2f3f',hair:'#15131a',tie:'#e7c14c'};
const T=(c)=>cap(c).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>h.material.opacity=0);jamG.visible=false;cards.forEach(c=>c.visible=false);one.set(0);hun.set(0);sg1.visible=false;sg2.visible=false;coin.visible=false;debt.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=false;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const shots=[
{id:'hook',t0:0,t1:2.7,out:'whipR',f(t,u){stopS.visible=false;resetRoom(rA);rA.color(0,rA.base,rA.base);
 pl.pose(.2,-.8,{expr:'sly',look:-.3,aR:[1.3,1.3],propR:'bag',...PL,blink:blink(t)});
 camPath(u,[1.4,.6,3.6],[.4,1.0,2.6],[.2,1.8,-.5],[.2,2.3,-.5],[66,56],.04);fx.draw=K.hook(['ЛЁГКИЕ ДЕНЬГИ','ЗА ПУСТЯК?'],0,2.6)}},
{id:'barrel',t0:2.7,t1:4.49,in:'whipR',out:'whipUp',f(t,u){tb(()=>{jamG.visible=true});orb(u,9,6,1.5,2.5,-.2+u*.4,.8)}},
{id:'drone',t0:4.49,t1:7.75,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(Math.pow(u,1.3),[22,16,6],[0,9.2,-9],[0,6,-26],[0,9,-26],[60,48],.1-u*.1)}},
{id:'deal',t0:7.75,t1:10.54,in:'zoom',out:'whipL',f(t,u){resetRoom(rB);rB.color(0,rB.base,rB.base);
 pl.pose(-1.2,-1.1,{expr:'smile',...PL,aR:[1.1,1.3],blink:blink(t,.2)});en.pose(1.4,-1.7,{expr:'sly',look:-1,...EN,aL:[.8,.5],propL:'bag',blink:blink(t)});
 fx.tags=[{txt:'ПЛОХИШ',t:T('Плохиш'),xy:[.27,.2]},{txt:'ВРАГ',t:T('продался врагам'),xy:[.74,.2]}];
 camPath(u,[-2.4,.7,3.8],[1.5,1.5,3.0],[0,1.9,-1],[.2,2.1,-1],[68,60],.05)}},
{id:'card',t0:10.54,t1:14.4,in:'whipL',out:'whipUp',f(t,u){tb(()=>{tbl.paper.visible=true;const g=ss(T('получи 1000.')-.1,T('получи 1000.')+.2,t);coin.visible=g>0;coin.scale.setScalar(lerp(2,1,g));tbl.hl[1].material.opacity=t>T('для друга —')?.55:0});
 fx.draw=K.big('+1000',T('получи 1000.'),14.4,'#7dff9a',260,.17);orb(u,10,6.5,1.2,1.8,-.2+u*.4,.5)}},
{id:'debt',t0:14.4,t1:16.4,in:'whipUp',out:'whipR',f(t,u){const hit=T('100 000.');tb(()=>{tbl.paper.visible=true;debt.visible=t>hit;const s=ss(hit,hit+.1,t);debt.scale.setScalar(lerp(2,1,s));tbl.hl[0].material.opacity=.6;tbl.hl[0].material.color.set('#e0304a');tbl.hl[2].material.opacity=t>hit?.6:0;tbl.hl[2].material.color.set('#e0304a')});
 const k=t>hit?Math.max(0,1-(t-hit)/.5):0;cam.position.set(0,lerp(8,5.2,ease(u)),3.5);cam.lookAt(0,0,.5);cam.fov=54;cam.rotateZ(.1);cam.position.x+=Math.sin(t*53)*.2*k;cam.updateProjectionMatrix();
 fx.crack={p:[0,0,3.6],a:t>hit?clamp((t-hit)*2.5):0,seed:8};fx.flash=k*.9}},
{id:'scale',t0:16.4,t1:19.2,in:'whipR',out:'whipL',f(t,u){tb(()=>{jamG.visible=true;jamG.scale.setScalar(.5);jamG.position.set(0,0,-2.5);one.set(1);hun.set(Math.floor(clamp((t-T('1 против 100.'))/1.2)*10+(t>T('1 против 100.')?1:0)));sg1.visible=true;sg2.visible=t>T('1 против 100.')+.4});
 pl.pose(0,-4.2,{expr:t>T('1 против 100.')+1?'shock':'neutral',...PL,aL:[.4,.4],aR:[.4,.4],blink:blink(t)});
 camPath(u,[-6,1.6,7],[4,2.6,5.8],[0,1.8,0],[0,2.2,0],[62,54],.04)}},
{id:'sad',t0:19.2,t1:21.57,in:'whipL',out:'whipUp',f(t,u){stopS.visible=false;resetRoom(rA);rA.color(0,rA.base,new THREE.Color('#5a3a5a'));
 pl.pose(-.3,-1.0,{expr:'angry',...PL,aL:[.3,.3],aR:[.5,.5],blink:false});
 camPath(u,[1.6,.5,3.6],[0,1.4,2.0],[-.3,1.9,-1],[-.3,2.1,-1],[68,54],-.04)}},
{id:'q1',t0:21.57,t1:24.6,in:'whipUp',out:'whipR',f(t,u){tb(()=>{cards.forEach(c=>c.visible=true);cards[0].scale.setScalar(lerp(1,1.15,Math.sin(t*6)*.5+.5))});
 fx.draw=K.big('КТО ПЛАТИТ?',T('кто платит'),24.5,'#fff',150,.17);
 camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'hidden',t0:24.6,t1:27.28,in:'whipR',out:'whipL',f(t,u){resetRoom(rC);rC.color(0,rC.base,rC.base);
 pl.pose(-1.2,-1.2,{expr:'neutral',...PL,aR:[1.0,1.3],propR:'phone',blink:blink(t)});en.pose(1.3,-1.6,{expr:'sly',look:-1,...EN,aL:[1.0,.5],propL:'cash',blink:blink(t,.5)});
 fx.draw=K.big('ЦЕНА СПРЯТАНА',T('цена спрятана.'),27.28,'#ff5a5a',130,.17);
 camPath(u,[3,.9,3.8],[-2.2,1.3,3.4],[0,1.9,-1],[0,2,-1],[68,62],-.05)}},
{id:'q23',t0:27.28,t1:32.45,in:'whipL',out:'zoom',f(t,u){tb(()=>{cards.forEach(c=>c.visible=true);const s3=t>T('Третий:');cards[1].scale.setScalar(!s3?1.18:1);cards[2].scale.setScalar(s3?1.18:1);cards[0].scale.setScalar(1)});
 fx.draw=K.big(t<T('Третий:')?'ЧТО СПРОСЯТ?':'КТО ОТВЕЧАЕТ?',27.4,32.3,'#7fe0ff',130,.17);
 camPath(u,[3,3.0,7.5],[-3,3.6,6.8],[0,1.4,0],[0,1.6,0],[56,52],-.04)}},
{id:'no',t0:32.45,t1:34.36,in:'zoom',out:'whipR',f(t,u){resetRoom(rA);rA.color(0,rA.base,new THREE.Color('#c4453a'));stopS.visible=true;
 pl.pose(-.4,-.6,{expr:'angry',...PL,aR:[2.0,.2],aL:[.3,.3],blink:false});en.pose(1.6,-1.9,{expr:'sly',look:-1,...EN,aL:[.8,.5],propL:'bag',blink:blink(t)});
 camPath(u,[1.6,.5,3.5],[.2,.9,2.4],[-.5,1.8,-1],[-.5,2.1,-1],[68,56],.04)}},
{id:'sweet',t0:34.36,t1:37.23,in:'whipR',out:'whipUp',f(t,u){tb(()=>{jamG.visible=true;tbl.paper.visible=false;const g=ss(T('тем внимательнее')-.1,T('тем внимательнее')+.2,t);sg2.visible=false;coin.visible=false});
 fx.draw=K.big('ЧИТАЙ!',T('тем внимательнее'),37.1,'#7dff9a',260,.17);orb(u,8,4.5,1.5,3,.2-u*.4,.6)}},
{id:'next',t0:37.23,t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
