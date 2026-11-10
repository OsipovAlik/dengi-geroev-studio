import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#9a8a4a'),rB=K.room('rB','#6a7a5a');
const tbl=K.makeTable('tbl','ОБЩИЙ БЮДЖЕТ',[['ОБЩАЯ ЦЕЛЬ','одна сумма на всех'],['СВОЯ ДОЛЯ','каждому по силам'],['В ДЕНЬ ПОЛУЧКИ','откладываем сразу']]);
const solo=K.tower('#4caf62',-3.3,-1.5),fam=[0,1,2,3].map(i=>K.tower('#4caf62',3.0,-2.6+i*1.3));
solo.g.visible=false;fam.forEach(t=>{t.g.visible=false;t.set(3);tbl.g.add(t.g)});solo.set(3);tbl.g.add(solo.g);
const repka=K.stand(2.4,2.4,'#ff9a3c',[{t:'РЕПКА',s:110,y:.5}],1.2,1.3,-3.6);rA.g.add(repka);
const repkaB=repka.clone();rB.g.add(repkaB);
const mouse=K.stand(.9,.9,'#aaaaaa',[{t:'МЫШКА',s:70,y:.5}],-1.8,.5,-1.0);
const goal=K.stand(2.4,1.6,'#fff',[{t:'ЦЕЛЬ',s:100,y:.5,c:'#2a9d4a'}],-2.0,2.4,-3.8);rB.g.add(goal);
const bb480=K.billboard(city.g,'480','В ГОД',0,9,-26,16,9,'#7dff9a');K.billboard(city.g,'ЗАВТРА','ГУСЬ',0,9,24,16,9,'#ffd23f');
const dd=new Puppet('man',2.2),ba=new Puppet('woman',2.0),ch=new Puppet('man',1.5),ms=new Puppet('man',0.9);[dd,ba,ch,ms].forEach(p=>{scene.add(p.m);p.hide()});
const D={col:'#c9a26a',hair:'#dddddd',tie:'#8a4a2a'},B={col:'#d46a8a',hair:'#bbbbbb'},C={col:'#4a8fd6',hair:'#6a4a2a'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});solo.g.visible=false;fam.forEach(t=>t.g.visible=false);scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=true;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);repka.visible=false;repkaB.visible=false;goal.visible=false;r.color(u,r.base,new THREE.Color(to))};
const call=T('Позвал всех'),s6b=T('Шаг второй:'),k480=T('Четыреста восемьдесят');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rA,'#9a8a4a',0);repka.visible=true;
 dd.pose(-1.0,-1.2,{expr:'shock',look:.3,aR:[.9,1.0],...D,blink:blink(t)});
 camPath(u,[1.6,.6,3.8],[.8,1.0,3.5],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],.04);fx.draw=K.hook(['КОПИШЬ ОДИН?','ДЕНЕГ НЕТ?'],0,S('s02')-.1)}},
{id:'steps',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{solo.g.visible=true;solo.set(2)});fx.draw=K.big('СЕМЕЙНЫЙ БЮДЖЕТ',S('s02'),S('s03'),'#7dff9a',120,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'pull',t0:S('s03'),t1:call,in:'whipUp',out:'whipL',f(t,u){room(rB,'#6a7a5a',0);repkaB.visible=true;
 dd.pose(-.6,-1.2,{expr:'angry',look:.3,...D,aL:[1.8,1.2],aR:[1.8,1.2],lean:.2,blink:false});
 fx.tags=[{txt:'ДЕД',t:S('s03'),xy:[.3,.2]}];camPath(u,[1.8,.8,3.7],[-.2,1.2,3.0],[0,1.9,-1],[-.3,1.8,-1],[68,60],.05)}},
{id:'crowd',t0:call,t1:S('s04'),in:'whipL',out:'whipR',f(t,u){room(rA,'#9a8a4a',0);repka.visible=true;
 dd.pose(-1.8,-1.0,{expr:'neutral',...D,aL:[1.5,1],aR:[1.5,1],blink:blink(t)});ba.pose(-.4,-1.0,{expr:'smile',...B,aL:[1.5,1],aR:[1.5,1],blink:blink(t,.3)});ch.pose(.9,-1.0,{expr:'smile',...C,aL:[1.5,1],aR:[1.5,1],blink:blink(t,.6)});
 camPath(u,[-2.6,.8,3.7],[2.0,1.5,3.2],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'one',t0:S('s04'),t1:T('Сто двадцать'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{solo.g.visible=true;solo.set(3)});fx.tags=[{txt:'ОДИН: 10',t:S('s04')+.4,xy:[.3,.22]}];orb(u,8,5,1.5,2.5,.2-u*.4,-1)}},
{id:'y120',t0:T('Сто двадцать'),t1:S('s05'),in:'whipUp',out:'whipL',f(t,u){tb(()=>{solo.g.visible=true;solo.set(3)});fx.draw=K.big('120 В ГОД',T('Сто двадцать'),S('s05'),'#ffd23f',220,.17);camPath(u,[-4,2.2,6.5],[0,5,4],[-3,0.6,-1.5],[-1,.2,-1],[56,50],.05)}},
{id:'four',t0:S('s05'),t1:k480,in:'whipL',out:'zoom',f(t,u){tb(()=>{fam.forEach((t_,i)=>{t_.g.visible=t>S('s05')+.3+i*.4;t_.set(3)});solo.g.visible=true;solo.set(3)});fx.draw=K.big('4 × 10 = 40',S('s05')+.3,k480-.05,'#7dff9a',140,.17);orb(u,7,4.8,1.4,3,-.2+u*.3,-.5)}},
{id:'y480',t0:k480,t1:S('s06'),in:'zoom',out:'whipR',f(t,u){city.g.visible=true;scene.background=SKY;const k=t>k480?Math.max(0,1-(t-k480)/.5):0;
 linPath(u,[-8,5,-6],[3,7,-14],[0,9,-26],[0,9,-26],[60,52],.08*(1-u));cam.position.x+=Math.sin(t*53)*.3*k;
 fx.crack={p:[0,9,-25.5],a:t>k480?clamp((t-k480)*2.5):0,seed:5};fx.flash=k*.8}},
{id:'s1',t0:S('s06'),t1:s6b,in:'whipR',out:'whipUp',f(t,u){tb(()=>{tbl.hl[0].material.opacity=.7;fam.forEach(t_=>t_.g.visible=true)});
 fx.draw=K.big('ОБЩАЯ ЦЕЛЬ',S('s06'),s6b-.05,'#7dff9a',150,.17);camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'s2',t0:s6b,t1:S('s07'),in:'whipUp',out:'whipL',f(t,u){room(rB,'#6a7a5a',0);goal.visible=true;
 dd.pose(-1.8,-1.0,{expr:'smile',...D,aR:[.5,.5],propR:'cash',blink:blink(t)});ba.pose(-.4,-1.0,{expr:'smile',...B,aR:[.5,.5],propR:'cash',blink:blink(t,.3)});ch.pose(.9,-1.0,{expr:'smile',...C,aR:[.5,.5],propR:'cash',blink:blink(t,.6)});
 fx.draw=K.big('СВОЯ ДОЛЯ',s6b,S('s07')-.05,'#ffd23f',150,.17);camPath(u,[1.6,.6,3.8],[.6,1.0,3.4],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],-.04)}},
{id:'mouse',t0:S('s07'),t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){room(rA,'#9a8a4a',0);repka.visible=true;
 dd.pose(-2.2,-1.1,{expr:'angry',...D,aL:[1.6,1],aR:[1.6,1],blink:false});ba.pose(-.9,-1.1,{expr:'angry',...B,aL:[1.6,1],aR:[1.6,1],blink:false});ms.pose(.2,-.6,{expr:'smile',look:-.3,col:'#999',hair:'#777',aL:[1.6,1],aR:[1.6,1],blink:blink(t)});
 fx.tags=[{txt:'МЫШКА',t:S('s07')+.2,xy:[.55,.25]}];camPath(u,[2.8,.5,3.6],[-1,1,3.0],[0,1.5,-1],[-.5,1.3,-1],[68,60],.05)}},
{id:'talk',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){room(rB,'#59b86a',ss(0,.8,u));goal.visible=true;
 dd.pose(-1.8,-1.0,{expr:'smile',...D,talk:t,aR:[1,1],blink:blink(t)});ba.pose(-.4,-1.0,{expr:'smile',...B,talk:t,blink:blink(t,.3)});ch.pose(.9,-1.0,{expr:'smile',...C,talk:t,blink:blink(t,.6)});
 fx.draw=K.big('ВСЛУХ',S('s08'),S('s09')-.05,'#7dff9a',200,.17);camPath(u,[2.6,.8,3.6],[-1,1.2,3.0],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{tbl.hl.forEach(h=>{h.material.opacity=.7;h.material.color.set('#59b86a')});fam.forEach(t_=>t_.g.visible=true);solo.g.visible=true;solo.set(3)});
 fx.draw=K.big('ВМЕСТЕ БЫСТРЕЕ',S('s09'),S('s10')-.05,'#7dff9a',130,.17);orb(u,9,6.5,1.2,2,-.2+u*.4,.5)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){[dd,ba,ch,ms].forEach(p=>p.hide());s.f(t,u)}}))};
