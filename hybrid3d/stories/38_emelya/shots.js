import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#b0784a'),rB=K.room('rB','#4a6a8a');
// рисованная стойка (щука, билет, копилка)
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
const pikeDraw=(c,w,h)=>{c.lineJoin='round';c.lineWidth=14;c.strokeStyle=INK;
 c.fillStyle='#4f8f5a';c.beginPath();c.ellipse(w*.47,h*.55,w*.36,h*.2,0,0,7);c.fill();c.stroke();
 c.beginPath();c.moveTo(w*.8,h*.55);c.lineTo(w*.97,h*.33);c.lineTo(w*.97,h*.77);c.closePath();c.fill();c.stroke();
 c.fillStyle='#8fcf7a';for(let i=0;i<5;i++){c.beginPath();c.ellipse(w*(.3+i*.09),h*.5,w*.03,h*.07,0,0,7);c.fill()}
 c.fillStyle='#fff';c.beginPath();c.arc(w*.2,h*.48,w*.04,0,7);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(w*.21,h*.48,w*.017,0,7);c.fill();
 c.beginPath();c.moveTo(w*.11,h*.6);c.lineTo(w*.24,h*.62);c.stroke();
 c.fillStyle='#ffd23f';c.beginPath();c.moveTo(w*.17,h*.34);c.lineTo(w*.2,h*.2);c.lineTo(w*.24,h*.3);c.lineTo(w*.28,h*.18);c.lineTo(w*.31,h*.33);c.closePath();c.fill();c.stroke()};
const pike=drawn(2.8,1.8,pikeDraw,.8,1.6,-3.7);rB.g.add(pike);
const bucket=cyl(.55,.8,'#8a6a4a',.8,.4,-3.2);rB.g.add(bucket);
const stove=new THREE.Group();stove.add(box(2.2,1.5,1.6,'#f4efe6',0,.75,0),box(1.0,2.4,.8,'#e8e1d4',.5,2.7,-.3),box(.6,.5,.1,'#2a2420',-.5,.5,.81));stove.position.set(1.3,0,-3.0);rA.g.add(stove);
const glow=box(.5,.4,.05,'#ff8a2a',-.5,.5,.83);stove.add(glow);
const jar=drawn(1.4,1.8,(c,w,h)=>{c.lineWidth=12;c.strokeStyle=INK;c.fillStyle='#bfe8ff';c.beginPath();c.roundRect(w*.12,h*.18,w*.76,h*.76,40);c.fill();c.stroke();c.fillStyle='#8a5a3a';c.fillRect(w*.2,h*.06,w*.6,h*.13);c.strokeRect(w*.2,h*.06,w*.6,h*.13);
 c.fillStyle='#ffd23f';for(let i=0;i<9;i++){c.beginPath();c.ellipse(w*(.3+(i%3)*.2),h*(.82-Math.floor(i/3)*.12),w*.09,h*.04,0,0,7);c.fill();c.stroke()}
 c.fillStyle=INK;c.font='800 '+Math.round(w*.13)+'px Pop';c.textAlign='center';c.fillText('КОПИЛКА',w/2,h*.4)},-1.6,1.6,-3.6);rA.g.add(jar);
const tbl=K.makeTable('tbl','ПРАВИЛО ЩУКИ',[['5 В НЕДЕЛЮ','в копилку, не в билет'],['В ДЕНЬ ПОЛУЧКИ','сразу, а не потом'],['5 ЛЕТ = 1300','ваши, гарантированно']]);
const tw=K.tower('#4caf62',-3.2,-1.2);tw.set(0);tbl.g.add(tw.g);
const ticket=drawn(2.6,1.3,(c,w,h)=>{c.fillStyle='#ff5ab4';c.fillRect(0,0,w,h);c.strokeStyle=INK;c.lineWidth=14;c.strokeRect(7,7,w-14,h-14);c.setLineDash([16,12]);c.beginPath();c.moveTo(w*.72,10);c.lineTo(w*.72,h-10);c.stroke();c.setLineDash([]);
 c.fillStyle='#fff';c.font='800 '+Math.round(h*.24)+'px Pop';c.textAlign='center';c.fillText('ЛОТЕРЕЯ',w*.36,h*.36);c.font='800 '+Math.round(h*.16)+'px Pop';c.fillText('12  27  33  41',w*.36,h*.68);c.font='800 '+Math.round(h*.3)+'px Pop';c.fillText('5',w*.86,h*.6)},3.0,.06,-1.6);
ticket.rotation.x=-Math.PI/2;ticket.rotation.z=.15;tbl.g.add(ticket);
K.billboard(city.g,'1 : 1 000 000','ШАНС ДЖЕКПОТА',0,9,-26,16,9,'#ff5ab4');K.billboard(city.g,'ЗАВТРА','ЗАЯЦ',0,9,24,16,9,'#ffd23f');
const em=new Puppet('man',2.3);scene.add(em.m);em.hide();
const O={col:'#d6453a',hair:'#e0b050',tie:'#ffd23f'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});tw.g.visible=false;ticket.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=true;f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(-.3,.5,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);pike.visible=false;bucket.visible=false;stove.visible=false;jar.visible=false;r.color(u,r.base,new THREE.Color(to))};
const inLife=T('В жизни'),k260=T('260 в год.'),k1300=T('1300.'),kop=T('в копилку,');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rA,'#b0784a',0);stove.visible=true;
 em.pose(1.0,-2.9,{expr:'sly',look:.4,sit:1,aR:[1.3,1.0],propR:'card',...O,blink:blink(t)},1.5);
 camPath(u,[-1.4,.7,3.8],[-.6,1.1,3.4],[.8,2.1,-2.5],[.9,1.9,-2.5],[64,58],-.04);fx.draw=K.hook(['ЖДЁТЕ ЧУДА?','БИЛЕТ КУПЛЕН?'],0,S('s02')-.1)}},
{id:'calc',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb(()=>{ticket.visible=true});fx.draw=K.big('РАСЧЁТ',S('s02')+.1,S('s03'),'#7dff9a',170,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'pike',t0:S('s03'),t1:inLife,in:'whipUp',out:'whipL',f(t,u){room(rB,'#4a6a8a',0);pike.visible=true;bucket.visible=true;pike.position.y=1.6+Math.sin(t*3)*.08;
 em.pose(-.8,-1.2,{expr:'smile',look:.5,aL:[.6,.6],...O,blink:blink(t)});
 fx.tags=[{txt:'ВОЛШЕБНАЯ ЩУКА',t:S('s03')+.3,xy:[.5,.2]}];camPath(u,[2.0,.6,3.7],[-.3,1.2,3.6],[.5,1.8,-2],[.3,1.7,-2],[66,58],.05)}},
{id:'nopike',t0:inLife,t1:S('s04'),in:'whipL',out:'zoom',f(t,u){room(rB,'#555a66',ss(0,.7,u));bucket.visible=true;
 em.pose(-.6,-1.3,{expr:'shock',look:.5,...O,blink:blink(t)});
 fx.tags=[{txt:'ЩУКИ НЕТ',t:inLife+.2,xy:[.5,.2]}];camPath(u,[-1.8,2.6,3.2],[-.4,3.4,1.4],[.8,.4,-3.2],[.8,.3,-3.2],[60,50],-.06)}},
{id:'chance',t0:S('s04'),t1:S('s05'),in:'zoom',out:'whipR',f(t,u){city.g.visible=true;scene.background=SKY;
 linPath(u,[-11,6,12],[0,8.5,7],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'ticket',t0:S('s05'),t1:k260,in:'whipR',out:'whipUp',f(t,u){tb(()=>{ticket.visible=true});const a=lerp(0,1.2,u);cam.position.set(3.0+Math.sin(a)*.4,lerp(5,3.2,ease(u)),-1.6+Math.cos(a)*.4);cam.up.set(0,0,-1);cam.lookAt(3.0,0,-1.6);cam.up.set(0,1,0);cam.fov=50;cam.updateProjectionMatrix();
 fx.draw=K.big('5 × 52 НЕДЕЛИ',S('s05')+.2,k260-.05,'#ffffff',120,.14)}},
{id:'y260',t0:k260,t1:S('s06'),in:'whipUp',out:'whipL',f(t,u){tb(()=>{ticket.visible=true});fx.draw=K.big('260 В ГОД',k260,S('s06'),'#ff5ab4',210,.17);camPath(u,[-4,2.2,6.5],[0,5,4],[2,0.4,-1.5],[2.5,.1,-1.5],[56,50],.05)}},
{id:'loss',t0:S('s06'),t1:S('s07'),in:'whipL',out:'whipUp',f(t,u){room(rA,'#c4453a',ss(0,.5,u));stove.visible=true;const k=t>k1300?Math.max(0,1-(t-k1300)/.5):0;
 em.pose(-1.0,-1.4,{expr:t>k1300?'shock':'neutral',look:.3,aR:[.4,.4],propR:'card',...O,blink:blink(t)});
 camPath(u,[1.6,.7,3.8],[.7,1.1,3.3],[-.6,1.8,-1],[-.6,1.6,-1],[66,58],.04);cam.position.x+=Math.sin(t*53)*.2*k;
 fx.crack={p:[-.2,2.2,-3.9],a:t>k1300?clamp((t-k1300)*2.5):0,seed:9};fx.flash=k*.8;fx.draw=K.big('−1300',k1300,S('s07'),'#ff5a5a',240,.17)}},
{id:'rule',t0:S('s07'),t1:kop,in:'whipUp',out:'whipR',f(t,u){tb(()=>{tw.g.visible=true;tw.set(2);tbl.hl[0].material.opacity=.7});fx.draw=K.big('СВОЯ ЩУКА',S('s07')+.1,kop-.05,'#7dff9a',160,.17);orb(u,8,5,1.5,2.5,.2-u*.4,-1)}},
{id:'payday',t0:kop,t1:S('s08'),in:'whipR',out:'zoom',f(t,u){room(rA,'#59b86a',ss(0,.8,u));stove.visible=true;jar.visible=true;
 em.pose(-.4,-1.4,{expr:'smile',look:-.4,aL:[1.2,1.1],propL:'cash',...O,blink:blink(t)});
 fx.tags=[{txt:'ДЕНЬ ПОЛУЧКИ',t:kop+.2,xy:[.5,.2]}];camPath(u,[1.8,.6,3.8],[-.4,1.2,2.4],[-1.2,1.7,-2.5],[-1.5,1.6,-3.6],[64,56],-.04)}},
{id:'grow',t0:S('s08'),t1:S('s09'),in:'zoom',out:'whipL',f(t,u){tb(()=>{tw.g.visible=true;tw.set(Math.min(10,2+Math.floor(u*10)));tbl.hl[2].material.opacity=.7});fx.draw=K.big('+1300',S('s08')+.2,S('s09'),'#7dff9a',240,.17);camPath(u,[-5,2.4,5.5],[-1,5,4],[-3,1.2,-1.2],[-2,.6,-1],[56,50],.05)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipL',out:'whipUp',f(t,u){room(rB,'#59b86a',ss(0,.8,u));pike.visible=true;bucket.visible=true;pike.position.y=1.6;
 em.pose(-.7,-1.2,{expr:'smile',look:.5,aR:[1.2,1.1],propR:'cash',...O,blink:blink(t)});
 fx.draw=K.big('КОПИЛКА РАСТЁТ',S('s09'),S('s10')-.05,'#7dff9a',120,.17);camPath(u,[2.6,.8,3.6],[-1,1.2,3.0],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){em.hide();s.f(t,u)}}))};
