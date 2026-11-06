import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#e0a030'),rB=K.room('rB','#5a4a7a'),rC=K.room('rC','#3d7a9a');
const tbl=K.makeTable('tbl','ПРАВИЛА КАРТЫ',[['ПОЛОЖИ ТРУБКУ','позвони сам'],['КОД И ПАРОЛЬ','не говори никому'],['ТОРОПЯТ?','значит, обман']]);
const cards=[['1','ПОЛОЖИ ТРУБКУ',-2.7],['2','КОД — НИКОМУ',0],['3','ТОРОПЯТ = ОБМАН',2.7]].map(([n,tx,x])=>{const m=K.stand(2.4,3,'#fff',[{t:n,s:200,y:.34,c:'#2a6fd0'},{t:tx,s:46,y:.72}],x,1.5,-.5);m.visible=false;tbl.g.add(m);return m});
const sms=K.stand(3.6,1.6,'#fff',[{t:'КОД: 4719',s:110,y:.5}],0,.15,2.2);sms.rotation.set(-Math.PI/2,0,0);tbl.g.add(sms);
const nope=K.stand(4.2,1.6,'#e0304a',[{t:'НИКОГДА',s:130,y:.5,c:'#fff'}],0,.2,.6);nope.rotation.set(-Math.PI/2,0,0);tbl.g.add(nope);
const crd=box(3.2,.12,2.0,'#2a6fd0',0,.1,-1.6);tbl.g.add(crd);
const talk=K.stand(2.2,1.4,'#fff',[{t:'ПОЗВОНИ',s:80,y:.35},{t:'САМ',s:110,y:.72,c:'#2a6fd0'}],2.2,2.6,-3.9);rA.g.add(talk);
const hurry=K.stand(2.6,1.4,'#e0304a',[{t:'СРОЧНО!',s:100,y:.5,c:'#fff'}],2.0,2.6,-3.9);rB.g.add(hurry);
const door=new THREE.Group();door.add(box(2.4,3.8,.2,'#8a5a2b',0,1.9,0));door.add(cyl(.12,.3,'#ffd23f',.8,1.8,.2));door.position.set(0,0,-3.6);door.visible=false;rA.g.add(door);
const sgN=K.stand(2.2,1.0,'#ffd23f',[{t:'3 ПРАВИЛА',s:80,y:.5}],0,4.2,-3.0);sgN.visible=false;rA.g.add(sgN);
K.billboard(city.g,'ПРАВИЛО','КАК БЕРЕЧЬ КАРТУ',0,9,-26,16,9);K.billboard(city.g,'ЗАВТРА','РЕПКА: КОПИМ ВСЕЙ СЕМЬЁЙ',0,9,24,16,9,'#f0559c');
const kid=new Puppet('man',2.0),wolf=new Puppet('big',3.0);[kid,wolf].forEach(p=>{scene.add(p.m);p.hide()});
const KD={col:'#f1ead6',hair:'#cfc6a8',tie:'#59b86a'},WF={col:'#6b6f78',hair:'#3a3d44',tie:'#c0392b'};
const T=(c)=>cap(c).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>h.material.opacity=0);cards.forEach(c=>c.visible=false);sms.visible=false;nope.visible=false;crd.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=false;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const roomA=(c)=>{resetRoom(rA);rA.color(0,rA.base,new THREE.Color(c||'#e0a030'));door.visible=false;sgN.visible=false;talk.visible=false};
const shots=[
{id:'hook',t0:0,t1:2.9,out:'whipR',f(t,u){roomA();
 kid.pose(-.3,-.8,{expr:'shock',look:.3,aR:[1.5,1.3],propR:'phone',...KD,blink:blink(t)});wolf.pose(1.6,-1.8,{expr:'sly',look:-1,...WF,aL:[.8,.5],blink:blink(t,.3)});
 camPath(u,[1.4,.6,3.6],[.4,1.0,2.6],[.2,1.8,-.5],[.2,2.3,-.5],[66,56],.04);fx.draw=K.hook(['ПРОСЯТ КОД','«ИЗ БАНКА»?'],0,2.8)}},
{id:'sms',t0:2.9,t1:5.696,in:'whipR',out:'whipUp',f(t,u){tb(()=>{sms.visible=true;crd.visible=true});fx.draw=K.big('КОД: 4719',T('открыли дверь'),5.6,'#ff7a7a',190,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.8)}},
{id:'drone',t0:5.696,t1:8.722,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(Math.pow(u,1.3),[22,16,6],[0,9.2,-9],[0,6,-26],[0,9,-26],[60,48],.1-u*.1)}},
{id:'chalk',t0:8.722,t1:12.379,in:'zoom',out:'whipL',f(t,u){resetRoom(rB);rB.color(0,rB.base,rB.base);hurry.visible=false;
 kid.pose(-1.2,-1.1,{expr:'neutral',...KD,aR:[1.1,1.3],blink:blink(t)});wolf.pose(1.4,-1.7,{expr:'sly',look:-1,...WF,aL:[.8,.5],propL:'clip',blink:blink(t,.2)});
 fx.tags=[{txt:'ВОЛК',t:T('у братьев Гримм'),xy:[.74,.2]},{txt:'МАМИН ГОЛОС',t:T('мамин голос.'),xy:[.3,.2]}];
 camPath(u,[-2.4,.7,3.8],[1.5,1.5,3.0],[0,1.9,-1],[.2,2.1,-1],[68,60],.05)}},
{id:'today',t0:12.379,t1:17.291,in:'whipL',out:'whipUp',f(t,u){resetRoom(rC);rC.color(0,rC.base,rC.base);
 kid.pose(-1.2,-1.2,{expr:'smile',...KD,aR:[1.0,1.3],propR:'phone',blink:blink(t)});wolf.pose(1.3,-1.6,{expr:'sly',look:-1,...WF,aL:[1.0,.5],propL:'phone',blink:blink(t,.5)});
 fx.draw=K.big('ПОХОЖЕ НА НАСТОЯЩЕЕ',T('всё похоже'),17.2,'#ffd23f',92,.17);
 camPath(u,[3,.9,3.8],[-2.2,1.3,3.4],[0,1.9,-1],[0,2,-1],[68,62],-.05)}},
{id:'bank',t0:17.291,t1:20.709,in:'whipUp',out:'whipR',f(t,u){tb(()=>{sms.visible=true;crd.visible=true;tbl.paper.visible=false});fx.draw=K.big('БАНК НЕ ПРОСИТ КОД',T('Но настоящий банк'),20.6,'#fff',100,.17);orb(u,8,5,1.8,3,.2-u*.4,.4)}},
{id:'never',t0:20.709,t1:21.923,in:'whipR',out:'whipL',f(t,u){const hit=T('Никогда.');tb(()=>{sms.visible=true;nope.visible=t>hit;nope.scale.setScalar(lerp(2,1,ss(hit,hit+.12,t)));crd.visible=true});
 const k=t>hit?Math.max(0,1-(t-hit)/.5):0;cam.position.set(0,lerp(8,5.4,ease(u)),3.5);cam.lookAt(0,0,.5);cam.fov=54;cam.rotateZ(.1);cam.position.x+=Math.sin(t*53)*.2*k;cam.updateProjectionMatrix();
 fx.draw=K.big('НИКОГДА',hit,21.9,'#ff5a5a',260,.17);fx.crack={p:[0,0,.6],a:t>hit?clamp((t-hit)*2.5):0,seed:8};fx.flash=k*.9}},
{id:'r1',t0:21.923,t1:26.013,in:'whipL',out:'whipUp',f(t,u){roomA('#3d9a6a');talk.visible=true;
 kid.pose(-.8,-1.0,{expr:'smile',...KD,aR:[2.0,.2],aL:[.4,.4],propR:'phone',blink:blink(t)});
 fx.draw=K.big('ПОЛОЖИ ТРУБКУ',T('положи трубку'),25.9,'#7dff9a',130,.17);
 camPath(u,[1.6,.5,3.6],[0,1.4,2.0],[-.4,1.9,-1],[-.4,2.1,-1],[68,54],-.04)}},
{id:'r2',t0:26.013,t1:29.619,in:'whipUp',out:'whipR',f(t,u){tb(()=>{cards.forEach(c=>c.visible=true);cards[1].scale.setScalar(lerp(1,1.18,Math.sin(t*6)*.5+.5));tbl.hl[1].material.opacity=.5});
 fx.draw=K.big('НИКОМУ',T('не говори никому.'),29.5,'#ffd23f',250,.17);
 camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'r3',t0:29.619,t1:32.065,in:'whipR',out:'whipL',f(t,u){resetRoom(rB);rB.color(0,rB.base,new THREE.Color('#9a3a3a'));hurry.visible=true;
 kid.pose(-.6,-1.0,{expr:'angry',...KD,aR:[1.0,.3],aL:[.4,.4],blink:false});wolf.pose(1.5,-1.9,{expr:'sly',look:-1,...WF,aL:[.8,.5],blink:blink(t)});
 fx.draw=K.big('ТОРОПЯТ = ОБМАН',T('торопят —'),32.0,'#ff7a7a',100,.17);
 camPath(u,[1.6,.5,3.6],[0,1.4,2.0],[-.4,1.9,-1],[-.4,2.1,-1],[68,54],-.04)}},
{id:'door',t0:32.065,t1:34.876,in:'whipL',out:'whipUp',f(t,u){roomA('#e0b040');door.visible=true;
 kid.pose(-.3,-1.2,{expr:'smile',...KD,aL:[.3,.3],aR:[1.4,.8],propR:'key',blink:blink(t)});
 fx.draw=K.big('УЗНАЛ САМ',T('кого узнал сам.'),34.8,'#ffd23f',200,.17);
 camPath(u,[1.0,.4,3.8],[0,1.6,2.4],[0,1.9,-1.2],[0,2.5,-1.2],[70,56],.04)}},
{id:'next',t0:34.876,t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
