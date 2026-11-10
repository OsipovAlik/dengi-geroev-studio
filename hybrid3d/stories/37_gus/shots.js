import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#7a6a9a'),rB=K.room('rB','#5a6a7a'),rC=K.room('rC','#a8864a');
const tbl=K.makeTable('tbl','ПРАВИЛО ГУСЯ',[['НАКОПЛЕНИЯ','это гусь'],['ПРОЦЕНТЫ','это яйца'],['ТРАТИМ ЯЙЦА','гуся не режем']]);
const tw=K.tower('#4caf62',-3.2,-1.2);tw.set(10);tbl.g.add(tw.g);tw.g.visible=false;
const egg=cyl(.35,.5,'#ffd23f',3.0,.3,-1.5);tbl.g.add(egg);egg.visible=false;
const goose=K.stand(2.4,2.4,'#fff6c8',[{t:'ГУСЬ',s:110,y:.5}],1.2,1.3,-3.6);rC.g.add(goose);
const gooseB=K.stand(2.4,2.4,'#444',[{t:'ПУСТО',s:100,y:.5,c:'#fff'}],1.2,1.3,-3.6);rB.g.add(gooseB);
const eggs=[0,1,2,3,4].map(i=>{const e=cyl(.25,.35,'#ffd23f',-2.4+i*.55,.2,-1.0);rC.g.add(e);return e});
const jar=K.stand(2.4,1.6,'#fff',[{t:'ОТДЕЛЬНО',s:90,y:.5,c:'#2a9d4a'}],-2.0,2.4,-3.8);
const bill=K.billboard(city.g,'−50','В ГОД',0,9,-26,16,9,'#ff5a5a');K.billboard(city.g,'ЗАВТРА','ЕМЕЛЯ',0,9,24,16,9,'#ffd23f');
const ow=new Puppet('big',2.8);scene.add(ow.m);ow.hide();
const O={col:'#7a4a8a',hair:'#333333',tie:'#e7c14c'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});tw.g.visible=false;egg.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=true;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);goose.visible=false;gooseB.visible=false;jar.visible=false;eggs.forEach(e=>e.visible=false);r.color(u,r.base,new THREE.Color(to))};
[jar].forEach(m=>rA.g.add(m));
const cut=T('разрезал гуся.'),nic=T('ничего.'),t1k=T('Тысяча — пятьдесят'),s6=S('s06'),s7=S('s07');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rB,'#5a6a7a',0);
 ow.pose(-1.0,-1.2,{expr:'shock',look:.3,aR:[.9,1.0],propR:'cash',...O,blink:blink(t)});
 camPath(u,[1.6,.6,3.8],[.8,1.0,3.5],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],.04);fx.draw=K.hook(['СНЯТЬ ВСЁ','РАДИ ПОКУПКИ?'],0,S('s02')-.1)}},
{id:'steps',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{tw.g.visible=true});fx.draw=K.big('СОХРАНИ ДОХОД',S('s02'),S('s03'),'#7dff9a',130,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'goose',t0:S('s03'),t1:T('Хозяину стало мало —'),in:'whipUp',out:'whipL',f(t,u){room(rC,'#a8864a',0);goose.visible=true;eggs.forEach((e,i)=>e.visible=t>S('s03')+.4+i*.45);
 ow.pose(-1.0,-1.2,{expr:'smile',look:.3,...O,aL:[.5,.5],blink:blink(t)});
 fx.tags=[{txt:'ЗОЛОТЫЕ ЯЙЦА',t:T('Гусь нёс')+.2,xy:[.55,.2]}];camPath(u,[1.8,.8,3.7],[-.2,1.2,3.0],[0,1.9,-1],[-.3,1.8,-1],[68,60],.05)}},
{id:'greed',t0:T('Хозяину стало мало —'),t1:S('s04'),in:'whipL',out:'zoom',f(t,u){room(rC,'#c4453a',ss(0,.8,u));goose.visible=true;eggs.forEach(e=>e.visible=true);
 ow.pose(-1.0,-1.2,{expr:'rage',look:.3,...O,aL:[1.8,.8],propL:'roller',blink:false});
 camPath(u,[-2.6,.8,3.7],[1.8,1.5,3.2],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'empty',t0:S('s04'),t1:S('s05'),in:'zoom',out:'whipR',f(t,u){room(rB,'#3a3a4a',0);gooseB.visible=true;const k=t>nic?Math.max(0,1-(t-nic)/.5):0;
 ow.pose(-1.2,-1.2,{expr:'shock',look:.3,...O,blink:blink(t)});
 cam.position.x+=0;camPath(u,[1.8,.8,3.7],[.6,1.2,3.0],[.6,1.8,-1],[.8,1.6,-1],[66,60],.04);cam.position.x+=Math.sin(t*53)*.2*k;
 fx.crack={p:[1.2,1.3,-3.5],a:t>nic?clamp((t-nic)*2.5):0,seed:7};fx.flash=k*.8;fx.tags=[{txt:'ВНУТРИ ПУСТО',t:S('s04')+.2,xy:[.5,.2]}]}},
{id:'rule',t0:S('s05'),t1:t1k,in:'whipR',out:'whipUp',f(t,u){tb(()=>{tw.g.visible=true;egg.visible=true;tbl.hl[0].material.opacity=.7});fx.tags=[{txt:'ГУСЬ = НАКОПЛЕНИЯ',t:S('s05')+.3,xy:[.3,.22]}];orb(u,8,5,1.5,2.5,.2-u*.4,-1)}},
{id:'fifty',t0:t1k,t1:s6,in:'whipUp',out:'whipL',f(t,u){tb(()=>{tw.g.visible=true;egg.visible=true;tbl.hl[1].material.opacity=.7});fx.draw=K.big('1000 → 50',t1k,s6,'#ffd23f',200,.17);camPath(u,[-4,2.2,6.5],[0,5,4],[-3,0.6,-1.5],[-1,.2,-1],[56,50],.05)}},
{id:'lost',t0:s6,t1:s7,in:'whipL',out:'whipR',f(t,u){city.g.visible=true;scene.background=SKY;
 linPath(u,[-8,5,-6],[3,7,-14],[0,9,-26],[0,9,-26],[60,52],.08*(1-u));fx.tags=[{txt:'НАСОВСЕМ',t:T('насовсем.')-.2,xy:[.5,.3]}]}},
{id:'eggs',t0:s7,t1:S('s08'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{tw.g.visible=true;egg.visible=true;tbl.hl[2].material.opacity=.7;tbl.hl[1].material.opacity=.4});
 fx.draw=K.big('ТРАТИМ ЯЙЦА',s7,S('s08')-.05,'#7dff9a',130,.17);camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'apart',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipL',f(t,u){room(rA,'#59b86a',ss(0,.8,u));jar.visible=true;
 ow.pose(-.8,-1.1,{expr:'smile',...O,aR:[1.2,1.2],propR:'cash',blink:blink(t)});
 fx.draw=K.big('КОПИ ОТДЕЛЬНО',S('s08'),S('s09')-.05,'#7dff9a',120,.17);camPath(u,[1.6,.6,3.8],[.6,1.0,3.4],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],-.04)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipL',out:'whipUp',f(t,u){room(rC,'#59b86a',ss(0,.8,u));goose.visible=true;eggs.forEach(e=>e.visible=true);
 ow.pose(-1.0,-1.2,{expr:'smile',look:.3,...O,aL:[.5,.5],blink:blink(t)});
 fx.draw=K.big('НЕ РЕЖЬ ГУСЯ',S('s09'),S('s10')-.05,'#7dff9a',130,.17);camPath(u,[2.6,.8,3.6],[-1,1.2,3.0],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){ow.hide();s.f(t,u)}}))};
