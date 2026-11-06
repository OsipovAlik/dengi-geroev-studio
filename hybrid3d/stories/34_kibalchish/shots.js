import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#4a78c8'),rB=K.room('rB','#5a4a7a'),rC=K.room('rC','#7a9a5a');
const tbl=K.makeTable('tbl','КРЕПОСТЬ-ФОНД',[['ЦЕЛЬ','названа заранее'],['ОТДЕЛЬНЫЙ СЧЁТ','не на карте трат'],['ПАУЗА 30 ДНЕЙ','прежде чем снять']]);
const cards=[['1','ОТДЕЛЬНЫЙ СЧЁТ',-2.7],['2','ПАУЗА 30 ДНЕЙ',0],['3','ЦЕЛЬ ИЛИ БЕДА',2.7]].map(([n,tx,x])=>{const m=K.stand(2.4,3,'#fff',[{t:n,s:200,y:.34,c:'#2a6fd0'},{t:tx,s:50,y:.72}],x,1.5,-.5);m.visible=false;tbl.g.add(m);return m});
const fund=K.tower('#59b86a',0,0);tbl.g.add(fund.g);
const sgA=K.stand(2.8,1.3,'#ffd23f',[{t:'120',s:150,y:.5}],0,3.8,0),sgB=K.stand(2.8,1.3,'#e0304a',[{t:'60',s:150,y:.5,c:'#fff'}],0,2.6,0);tbl.g.add(sgA,sgB);
const take=K.stand(2.6,1.2,'#e0304a',[{t:'−20',s:130,y:.5,c:'#fff'}],2.4,2.2,0);tbl.g.add(take);
const frag=[];for(let i=0;i<5;i++){const b=box(1.1,.28,.7,'#59b86a',(i-2)*1.3,.15,3);b.visible=false;tbl.g.add(b);frag.push(b)}
const calS=K.stand(2.0,2.0,'#fff',[{t:'30',s:210,y:.42,c:'#d0173a'},{t:'ДНЕЙ',s:70,y:.78}],2.0,2.4,-3.9);rB.g.add(calS);
const keep=new THREE.Group();[[-2.2,1.6],[2.2,1.6],[0,1.2]].forEach(([x,h],i)=>{keep.add(box(1.6,h*2,1.2,'#9aa5b8',x,h,0))});keep.add(box(5.6,2.0,1.0,'#b4bfd0',0,1.0,.2));for(let i=0;i<6;i++)keep.add(box(.55,.5,.9,'#b4bfd0',-2.5+i,2.25,.2));keep.position.set(0,0,-3.3);keep.visible=false;rA.g.add(keep);
const flag=K.stand(1.6,1.0,'#ffd23f',[{t:'ФОНД',s:90,y:.5}],0,4.6,-3.0);flag.visible=false;rA.g.add(flag);
K.billboard(city.g,'КРЕПОСТЬ','ФОНД НА ОТДЕЛЬНОМ СЧЁТЕ',0,9,-26,16,9);K.billboard(city.g,'ЗАВТРА','ВОЛК И СЕМЕРО КОЗЛЯТ',0,9,24,16,9,'#f0559c');
const pl=new Puppet('man',2.5),en=new Puppet('big',3.0);[pl,en].forEach(p=>{scene.add(p.m);p.hide()});
const PL={col:'#c0392b',hair:'#e0a030',tie:'#ffd23f'},EN={col:'#3a2f3f',hair:'#15131a',tie:'#e7c14c'};
const T=(c)=>cap(c).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>h.material.opacity=0);cards.forEach(c=>c.visible=false);fund.set(0);sgA.visible=false;sgB.visible=false;take.visible=false;frag.forEach(b=>b.visible=false);scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=false;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const shots=[
{id:'hook',t0:0,t1:2.9,out:'whipR',f(t,u){keep.visible=false;flag.visible=false;resetRoom(rA);rA.color(0,rA.base,rA.base);
 pl.pose(.2,-.8,{expr:'shock',look:-.3,aR:[1.3,1.3],propR:'cash',...PL,blink:blink(t)});
 camPath(u,[1.4,.6,3.6],[.4,1.0,2.6],[.2,1.8,-.5],[.2,2.3,-.5],[66,56],.04);fx.draw=K.hook(['КОПИШЬ —','ДЕНЬГИ ТАЮТ?'],0,2.8)}},
{id:'fund',t0:2.9,t1:4.593,in:'whipR',out:'whipUp',f(t,u){tb(()=>{fund.set(10);sgA.visible=false});orb(u,9,6,1.5,2.5,-.2+u*.4,.8)}},
{id:'drone',t0:4.593,t1:7.951,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(Math.pow(u,1.3),[22,16,6],[0,9.2,-9],[0,6,-26],[0,9,-26],[60,48],.1-u*.1)}},
{id:'secret',t0:7.951,t1:10.57,in:'zoom',out:'whipL',f(t,u){resetRoom(rB);rB.color(0,rB.base,rB.base);calS.visible=false;
 pl.pose(-1.2,-1.1,{expr:'angry',...PL,aR:[1.1,1.3],blink:false});en.pose(1.4,-1.7,{expr:'sly',look:-1,...EN,aL:[.8,.5],propL:'bag',blink:blink(t)});
 fx.tags=[{txt:'КИБАЛЬЧИШ',t:T('у Гайдара'),xy:[.27,.2]},{txt:'ТАЙНА',t:T('не выдал'),xy:[.74,.2]}];
 camPath(u,[-2.4,.7,3.8],[1.5,1.5,3.0],[0,1.9,-1],[.2,2.1,-1],[68,60],.05)}},
{id:'desire',t0:10.57,t1:15.414,in:'whipL',out:'whipUp',f(t,u){resetRoom(rC);rC.color(0,rC.base,rC.base);
 pl.pose(-1.2,-1.2,{expr:'neutral',...PL,aR:[1.0,1.3],propR:'card',blink:blink(t)});en.pose(1.3,-1.6,{expr:'sly',look:-1,...EN,aL:[1.0,.5],propL:'phone',blink:blink(t,.5)});
 fx.draw=K.big('ЖЕЛАНИЯ',T('а желания.'),15.3,'#ff5a5a',230,.17);
 camPath(u,[3,.9,3.8],[-2.2,1.3,3.4],[0,1.9,-1],[0,2,-1],[68,62],-.05)}},
{id:'grow',t0:15.414,t1:18.366,in:'whipUp',out:'whipR',f(t,u){const g=clamp((t-T('10 в месяц —'))/1.6);tb(()=>{tbl.paper.visible=false;fund.set(Math.max(1,Math.round(g*10)));sgA.visible=t>T('за год 120.')});
 fx.draw=K.big('120',T('за год 120.'),18.3,'#7dff9a',300,.17);orb(u,8,5,1.8,3,.2-u*.4,.4)}},
{id:'take',t0:18.366,t1:20.126,in:'whipR',out:'whipL',f(t,u){tb(()=>{fund.set(10);sgA.visible=true;take.visible=true;take.scale.setScalar(lerp(1.6,1,ss(0,.3,u)))});
 fx.draw=K.big('−20 × 3',T('Три раза взял'),20.1,'#ff7a7a',220,.17);
 camPath(u,[-5,2.8,7],[3,3.2,5.6],[0,1.6,0],[0,1.8,0],[58,52],.05)}},
{id:'hit',t0:20.126,t1:21.935,in:'whipL',out:'whipR',f(t,u){const hit=T('осталось 60.');tb(()=>{fund.set(t>hit?5:10);sgB.visible=t>hit;sgA.visible=t<=hit;frag.forEach((b,i)=>{b.visible=t>hit&&t<hit+.9;b.position.set((i-2)*1.3+(i-2)*(t-hit)*2,.15+Math.max(0,1.5*(t-hit)-3*(t-hit)*(t-hit)),3+(t-hit))})});
 const k=t>hit?Math.max(0,1-(t-hit)/.5):0;cam.position.set(0,lerp(8,5.4,ease(u)),3.5);cam.lookAt(0,0,.5);cam.fov=54;cam.rotateZ(.1);cam.position.x+=Math.sin(t*53)*.2*k;cam.updateProjectionMatrix();
 fx.draw=K.big('ОСТАЛОСЬ 60',hit,21.9,'#ff5a5a',230,.17);fx.crack={p:[0,0,.5],a:t>hit?clamp((t-hit)*2.5):0,seed:8};fx.flash=k*.9}},
{id:'r1',t0:21.935,t1:24.585,in:'whipR',out:'whipL',f(t,u){tb(()=>{cards.forEach(c=>c.visible=true);cards[0].scale.setScalar(lerp(1,1.18,Math.sin(t*6)*.5+.5))});
 fx.draw=K.big('ОТДЕЛЬНЫЙ СЧЁТ',T('отдельном счёте.'),24.5,'#fff',130,.17);
 camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'r2',t0:24.585,t1:27.663,in:'whipL',out:'whipUp',f(t,u){resetRoom(rB);rB.color(0,rB.base,new THREE.Color('#3d5a8a'));calS.visible=true;
 pl.pose(-.6,-1.0,{expr:'smile',...PL,aR:[2.0,.2],aL:[.4,.4],blink:blink(t)});
 fx.draw=K.big('30 ДНЕЙ',T('30 дней.'),27.6,'#7fe0ff',250,.17);
 camPath(u,[1.6,.5,3.6],[0,1.4,2.0],[-.4,1.9,-1],[-.4,2.1,-1],[68,54],-.04)}},
{id:'r3',t0:27.663,t1:30.156,in:'whipUp',out:'whipR',f(t,u){tb(()=>{cards.forEach(c=>c.visible=true);cards[2].scale.setScalar(lerp(1,1.18,Math.sin(t*6)*.5+.5));tbl.hl[0].material.opacity=.5});
 fx.draw=K.big('ЦЕЛЬ ИЛИ БЕДА',T('только ради цели'),30.1,'#ffd23f',120,.17);
 camPath(u,[3,3.0,7.5],[-3,3.6,6.8],[0,1.4,0],[0,1.6,0],[56,52],-.04)}},
{id:'keep',t0:30.156,t1:33.18,in:'whipR',out:'whipUp',f(t,u){resetRoom(rA);rA.color(0,rA.base,new THREE.Color('#e0b040'));keep.visible=true;flag.visible=true;
 pl.pose(0,-1.0,{expr:'smile',...PL,aL:[.3,.3],aR:[2.1,.3],blink:blink(t)});
 fx.draw=K.big('КРЕПОСТЬ',T('Крепость держит'),33.1,'#ffd23f',250,.17);
 camPath(u,[1.0,.4,3.8],[0,1.6,2.4],[0,1.9,-1.2],[0,2.5,-1.2],[70,56],.04)}},
{id:'next',t0:33.18,t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
