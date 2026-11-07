import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#6f8fb0'),rB=K.room('rB','#4a6a5a'),rC=K.room('rC','#7a5a6a');
const tbl=K.makeTable('tbl','МОЯ ЦЕЛЬ',[['СУММА','1200'],['СРОК','12 месяцев'],['В МЕСЯЦ','1200 ÷ 12 = 100']]);
const jar=cyl(1.1,2.0,'#e8d9a8',-2.6,1.0,.2);jar.add(plane(1.8,.9,new THREE.MeshBasicMaterial({map:label(512,256,'#fff',[{t:'НА ЦЕЛЬ',s:90,y:.5}],{border:'#15131a',bw:10})}),0,.2,1.12));tbl.g.add(jar);
const cards=[['ЦЕЛЬ',-2.8],['СУММА',0],['СРОК',2.8]].map(([tx,x])=>{const m=K.stand(2.4,2.2,'#fff',[{t:tx,s:80,y:.5}],x,1.2,-.5);m.visible=false;tbl.g.add(m);return m});
const tw=K.tower('#59b86a',2.2,0);tbl.g.add(tw.g);
const dateS=K.stand(3.6,1.6,'#ffd23f',[{t:'ДЕНЬ ДОХОДА',s:80,y:.5}],0,.15,3.6);dateS.rotation.set(-Math.PI/2,0,0);tbl.g.add(dateS);
const hund=K.stand(3.4,1.6,'#59b86a',[{t:'100',s:200,y:.5,c:'#fff'}],0,.15,3.6);hund.rotation.set(-Math.PI/2,0,0);tbl.g.add(hund);
const zero=K.stand(3.4,1.8,'#e0304a',[{t:'0',s:240,y:.5,c:'#fff'}],0,.15,3.6);zero.rotation.set(-Math.PI/2,0,0);tbl.g.add(zero);
const bigN=K.stand(3.6,3.6,'#ffd23f',[{t:'100',s:300,y:.4},{t:'в месяц',s:70,y:.8}],1.9,2.2,-1.2);rA.g.add(bigN);
K.billboard(city.g,'ОБЩЕЕ','ДЕЛО',0,9,-26,16,9);K.billboard(city.g,'ЗАВТРА','ВОЛК И 7 КОЗЛЯТ',0,9,24,16,9,'#7fb5ff');
const kb=new Puppet('man',2.7);scene.add(kb.m);kb.hide();
const KB={col:'#c0392b',hair:'#6a3a1a',tie:'#ffd23f'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});jar.visible=false;cards.forEach(c=>c.visible=false);tw.set(0);dateS.visible=false;hund.visible=false;zero.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=false;f&&f()};
const dur=TM.dur;
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(0,.6,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);bigN.visible=false;r.color(u,r.base,new THREE.Color(to))};
const s5b=T('1200 ÷ 12 ='),s6=S('s06'),zhit=T('это ноль.');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rA,'#6f8fb0',0);
 kb.pose(.2,-.8,{expr:'sly',look:-.3,aR:[1.3,1.3],propR:'bag',...KB,blink:blink(t)});
 camPath(u,[1.4,.6,3.8],[.5,1.0,3.7],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],.04);fx.draw=K.hook(['ДЕНЬГИ','УТЕКАЮТ?'],0,S('s02')-.1)}},
{id:'jar',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{jar.visible=true;tbl.paper.visible=false});fx.draw=K.big('30 СЕКУНД',S('s02'),S('s03'),'#7dff9a',200,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'drone',t0:S('s03'),t1:S('s04'),in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(Math.pow(u,1.3),[22,16,6],[0,9.2,-9],[0,6,-26],[0,9,-26],[60,48],.1-u*.1)}},
{id:'cards',t0:S('s04'),t1:S('s05'),in:'zoom',out:'whipL',f(t,u){tb(()=>{cards.forEach((c,i)=>{c.visible=t>[T('Нужны цель,'),T('сумма'),T('и срок.')][i]-.1;c.scale.setScalar(1)});cards[0].visible=true});
 fx.draw=K.big('ЦЕЛЬ · СУММА · СРОК',S('s04')+1.2,S('s05')-.1,'#fff',100,.17);camPath(u,[-4,2.6,7.5],[3,3.4,6.5],[0,1.4,0],[0,1.6,0],[56,52],.04)}},
{id:'calc1',t0:S('s05'),t1:s5b,in:'whipL',out:'whipUp',f(t,u){tb(()=>{tbl.paper.visible=true;tbl.hl[0].material.opacity=.6;tbl.hl[1].material.opacity=t>T('срок:')?.6:0});
 fx.draw=K.big('1200 · 12 МЕС.',S('s05'),s5b,'#ffd23f',150,.17);orb(u,10,6.5,1.2,1.8,-.2+u*.4,.5)}},
{id:'calc2',t0:s5b,t1:s6,in:'whipUp',out:'whipR',f(t,u){const h=T('100 в месяц.');tb(()=>{tbl.paper.visible=true;tbl.hl[2].material.opacity=.6;hund.visible=t>h;hund.scale.setScalar(lerp(2,1,ss(h,h+.15,t)));tw.set(Math.round(clamp((t-h)/1.5)*10))});
 fx.draw=K.big('1200 ÷ 12 = 100',s5b,s6-.1,'#7dff9a',130,.17);cam.position.set(0,lerp(8,5.4,ease(u)),3.5);cam.lookAt(0,0,.5);cam.fov=54;cam.rotateZ(.1*u);cam.updateProjectionMatrix()}},
{id:'zero',t0:s6,t1:S('s07'),in:'whipR',out:'whipL',f(t,u){room(rC,'#7a5a6a',0);const k=t>zhit?Math.max(0,1-(t-zhit)/.5):0;
 kb.pose(-.3,-1.0,{expr:t>zhit?'shock':'neutral',...KB,aL:[.3,.3],aR:[.4,.4],blink:blink(t)});
 fx.draw=K.big(t>zhit?'ОСТАНЕТСЯ: 0':'100 В МЕСЯЦ',s6,S('s07')-.05,t>zhit?'#ff5a5a':'#7dff9a',130,.17);
 camPath(u,[3,.9,3.8],[-1.6,1.3,3.2],[0,1.9,-1],[0,2,-1],[68,62],-.05);cam.position.x+=Math.sin(t*53)*.12*k;
 fx.crack={p:[0,1.5,-3.5],a:t>zhit?clamp((t-zhit)*2.5):0,seed:5};fx.flash=k*.8}},
{id:'day',t0:S('s07'),t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){tb(()=>{dateS.visible=true;hund.visible=t>T('в день дохода,');tw.set(t>T('в день дохода,')?10:0)});
 fx.draw=K.big('В ДЕНЬ ДОХОДА',S('s07')+.5,S('s08')-.1,'#ffd23f',130,.17);orb(u,8,4.5,1.5,3,.2-u*.4,.6)}},
{id:'pay',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){room(rA,'#e8b93a',ss(.2,1,u));
 kb.pose(-.4,-.9,{expr:'smile',...KB,aR:[1.2,1.2],propR:'cash',blink:blink(t,.3)});
 fx.draw=K.big('СНАЧАЛА — ЦЕЛЬ',S('s08'),S('s09')-.1,'#fff',120,.17);
 camPath(u,[1.8,.5,3.8],[-.2,1.3,2.4],[-.4,1.8,-1],[-.4,2.1,-1],[68,56],-.04)}},
{id:'lesson',t0:S('s09'),t1:S('s10'),in:'whipR',out:'whipUp',f(t,u){room(rA,'#e8b93a',1);bigN.visible=true;bigN.scale.setScalar(1+.08*Math.sin(t*5));
 kb.pose(-1.4,-1.0,{expr:'smile',...KB,aR:[1.9,.6],blink:blink(t)});
 camPath(u,[-1.5,1.2,3.8],[1.4,2.2,3.0],[1.9,2.2,-1.2],[1.6,2.2,-1.2],[62,50],.05)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
