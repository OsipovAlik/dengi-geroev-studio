import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#7a6a9a'),rB=K.room('rB','#5a6a7a'),rC=K.room('rC','#8a6a4a');
const tbl=K.makeTable('tbl','ТРИ ШАГА',[['МОЛЧУ','код — никому'],['КЛАДУ ТРУБКУ','сразу'],['ПЕРЕЗВАНИВАЮ САМ','по номеру с карты']]);
const phone=cyl(.9,.25,'#222',-2.4,.2,.4);tbl.g.add(phone);const scr=K.stand(1.6,.9,'#7fe0ff',[{t:'КОД ****',s:70,y:.5}],-2.4,.4,.4);scr.rotation.set(-Math.PI/2,0,0);tbl.g.add(scr);
const cards=[['1','МОЛЧУ',-2.8],['2','ТРУБКА',0],['3','САМ',2.8]].map(([n,tx,x])=>{const m=K.stand(2.4,2.6,'#fff',[{t:n,s:170,y:.36,c:'#2a9d4a'},{t:tx,s:70,y:.74}],x,1.3,-.5);m.visible=false;tbl.g.add(m);return m});
const stopS=K.stand(1.8,1.8,'#d0173a',[{t:'СТОП',s:100,y:.5,c:'#fff'}],-2.2,2.0,-3.9);
const doorS=K.stand(2.2,3.6,'#a5703c',[{t:'ДВЕРЬ',s:80,y:.15,c:'#fff'}],2.0,1.8,-3.7);
const zeroB=K.billboard(city.g,'0','ИСКЛЮЧЕНИЙ',0,9,-26,16,9,'#ff5a5a');K.billboard(city.g,'ЗАВТРА','РЕПКА И СЕМЬЯ',0,9,24,16,9,'#ffd23f');
const kid=new Puppet('man',2.2),wolf=new Puppet('big',3.0);[kid,wolf].forEach(p=>{scene.add(p.m);p.hide()});
const KD={col:'#f4f4f4',hair:'#bbbbbb',tie:'#e0304a'},WF={col:'#55555f',hair:'#2a2a33',tie:'#e7c14c'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});phone.visible=false;scr.visible=false;cards.forEach(c=>c.visible=false);scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=false;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);stopS.visible=false;doorS.visible=false;r.color(u,r.base,new THREE.Color(to))};
[stopS,doorS].forEach((m,i)=>(i?rB:rA).g.add(m));rC.g.add(stopS.clone());
const s7b=T('Шаг третий:'),zero=T('Ноль'),s8=S('s08'),pr=T('пора проверять.');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rB,'#5a6a7a',0);doorS.visible=true;
 kid.pose(-1.0,-1.2,{expr:'shock',look:.3,aR:[.9,1.0],...KD,blink:blink(t)});
 camPath(u,[1.6,.6,3.8],[.8,1.0,3.5],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],.04);fx.draw=K.hook(['ПРОСЯТ КОД','СРОЧНО?'],0,S('s02')-.1)}},
{id:'steps',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{phone.visible=true;scr.visible=true;tbl.paper.visible=true});fx.draw=K.big('3 ШАГА',S('s02'),S('s03'),'#7dff9a',240,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'wolf',t0:S('s03'),t1:S('s04'),in:'whipUp',out:'whipL',f(t,u){room(rC,'#8a6a4a',0);
 wolf.pose(-.9,-1.3,{expr:'sly',look:.3,...WF,aL:[1.1,.6],propL:'roller',blink:blink(t)});kid.pose(1.6,-.6,{expr:'shock',look:-.3,...KD,aL:[.3,.3],blink:blink(t,.3)});
 fx.tags=[{txt:'ВОЛК',t:S('s03'),xy:[.27,.2]}];camPath(u,[1.8,.8,3.7],[-.2,1.2,3.0],[0,1.9,-1],[-.3,1.8,-1],[68,60],.05)}},
{id:'call',t0:S('s04'),t1:S('s05'),in:'whipL',out:'zoom',f(t,u){room(rA,'#7a6a9a',0);
 wolf.pose(-.3,-1.3,{expr:'sly',...WF,aL:[1.0,1.4],propL:'phone',blink:blink(t)});
 fx.tags=[{txt:'«ОТ БАНКА»',t:T('от банка,'),xy:[.5,.2]}];camPath(u,[-2.6,.8,3.7],[1.8,1.5,3.2],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'zero',t0:S('s05'),t1:S('s06'),in:'zoom',out:'whipR',f(t,u){city.g.visible=true;scene.background=SKY;const k=t>zero?Math.max(0,1-(t-zero)/.5):0;
 linPath(u,[-8,5,-6],[3,7,-14],[0,9,-26],[0,9,-26],[60,52],.08*(1-u));cam.position.x+=Math.sin(t*53)*.3*k;
 fx.crack={p:[0,9,-25.5],a:t>zero?clamp((t-zero)*2.5):0,seed:3};fx.flash=k*.8}},
{id:'s1',t0:S('s06'),t1:S('s07'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{tbl.paper.visible=true;tbl.hl[0].material.opacity=.7;cards.forEach(c=>c.visible=true);cards[0].scale.setScalar(1.2);cards[1].scale.setScalar(1);cards[2].scale.setScalar(1)});
 fx.draw=K.big('КОД — НИКОМУ',S('s06'),S('s07')-.1,'#7dff9a',130,.17);camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'s2',t0:S('s07'),t1:s7b,in:'whipUp',out:'whipL',f(t,u){room(rB,'#5a6a7a',0);doorS.visible=true;
 kid.pose(-.8,-1.1,{expr:'angry',...KD,aR:[1.5,1.5],propR:'phone',blink:false});
 fx.draw=K.big('КЛАДУ ТРУБКУ',S('s07'),s7b-.05,'#ffd23f',120,.17);camPath(u,[1.6,.6,3.8],[.6,1.0,3.4],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],-.04)}},
{id:'s3',t0:s7b,t1:s8,in:'whipL',out:'whipUp',f(t,u){tb(()=>{tbl.paper.visible=true;tbl.hl[2].material.opacity=.7;phone.visible=true;scr.visible=true;cards.forEach(c=>c.visible=true);cards[2].scale.setScalar(1.2);cards[0].scale.setScalar(1);cards[1].scale.setScalar(1)});
 fx.draw=K.big('ПЕРЕЗВАНИВАЮ САМ',s7b,s8-.05,'#7fe0ff',110,.17);orb(u,8,4.8,1.5,3,.2-u*.4,.6)}},
{id:'rush',t0:s8,t1:pr,in:'whipUp',out:'whipR',f(t,u){room(rA,'#c4453a',ss(0,.6,u));stopS.visible=true;
 wolf.pose(1.3,-1.8,{expr:'sly',look:-1,...WF,aL:[1.0,.5],propL:'phone',blink:blink(t)});kid.pose(-.6,-.7,{expr:'neutral',look:.5,...KD,aR:[1.6,.4],blink:blink(t,.4)});
 fx.draw=K.big('СПЕШКА = КРЮЧОК',s8,pr-.05,'#ff5a5a',120,.17);camPath(u,[1.6,.5,3.7],[.0,.9,2.8],[-.4,1.8,-1],[-.4,1.6,-1],[68,60],.04)}},
{id:'check',t0:pr,t1:S('s09'),in:'whipR',out:'whipL',f(t,u){room(rC,'#59b86a',ss(0,.8,u));
 kid.pose(-.3,-1.0,{expr:'smile',...KD,aR:[1.2,1.2],propR:'phone',blink:blink(t)});
 fx.draw=K.big('ПРОВЕРЯЙ',pr,S('s09')-.05,'#7dff9a',200,.17);camPath(u,[2.6,.8,3.6],[-1,1.2,3.0],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipL',out:'whipUp',f(t,u){tb(()=>{tbl.paper.visible=true;tbl.hl.forEach(h=>{h.material.opacity=.7;h.material.color.set('#59b86a')});cards.forEach(c=>{c.visible=true;c.scale.setScalar(1)})});
 orb(u,9,6.5,1.2,2,-.2+u*.4,.5)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
