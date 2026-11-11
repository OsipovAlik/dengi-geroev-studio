import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,canvasTex,INK}=E;
const K=kit(E);
const rA=K.room('rA','#c79a5a'),rB=K.room('rB','#5a6470');
const drawn=(w,h,draw,x,y,z,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*200),Math.round(h*200),draw),transparent:true,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=ry;return m};
// избушка зайца: лубяные доски + табличка
const hut=drawn(2.6,2.4,(c,w,h)=>{c.lineWidth=12;c.strokeStyle=INK;c.fillStyle='#d9a860';c.beginPath();c.moveTo(w*.08,h*.42);c.lineTo(w*.5,h*.06);c.lineTo(w*.92,h*.42);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e8bf7a';c.fillRect(w*.14,h*.42,w*.72,h*.52);c.strokeRect(w*.14,h*.42,w*.72,h*.52);for(let i=1;i<6;i++){c.beginPath();c.moveTo(w*.14,h*(.42+i*.087));c.lineTo(w*.86,h*(.42+i*.087));c.stroke()}
 c.fillStyle='#fff';c.fillRect(w*.22,h*.5,w*.56,h*.16);c.strokeRect(w*.22,h*.5,w*.56,h*.16);c.fillStyle=INK;c.font='800 '+Math.round(h*.09)+'px Pop';c.textAlign='center';c.textBaseline='middle';c.fillText('ИЗБА ЗАЙЦА',w/2,h*.585)},1.3,1.3,-3.7);rA.g.add(hut);
const bank=K.stand(2.8,1.2,'#fff',[{t:'БАНК',s:120,y:.5,c:'#2a3a5a'}],0,3.2,-3.9);rB.g.add(bank);
const letter=drawn(1.8,2.2,(c,w,h)=>{c.lineWidth=12;c.strokeStyle=INK;c.fillStyle='#fff';c.fillRect(8,8,w-16,h-16);c.strokeRect(8,8,w-16,h-16);c.fillStyle='#c4453a';c.font='800 '+Math.round(w*.11)+'px Pop';c.textAlign='center';c.fillText('ТРЕБОВАНИЕ',w/2,h*.17);
 c.fillStyle=INK;c.font='800 '+Math.round(w*.2)+'px Pop';c.fillText('1000',w/2,h*.45);c.font='800 '+Math.round(w*.1)+'px Pop';c.fillText('+ ШТРАФЫ',w/2,h*.6);c.fillStyle='#c4453a';c.fillText('ПЛАТИТЕ ВЫ',w/2,h*.8)},1.5,1.7,-3.6);rB.g.add(letter);
const hearts=K.stand(1.6,1.0,'#7dff9a',[{t:'ДОМА',s:90,y:.5,c:'#1a5a2a'}],-1.6,2.6,-3.8);rA.g.add(hearts);
const tbl=K.makeTable('tbl','ПОРУЧИТЕЛЬСТВО',[['ДРУГ НЕ ПЛАТИТ','платишь ты'],['ВСЯ СУММА','плюс штрафы'],['ТВОЯ ПОДПИСЬ','это твой долг']]);
const pen=box(.12,.12,2.2,'#2a3a8a',1.6,.12,1.4);pen.rotation.y=.6;tbl.g.add(pen);
const stack=K.tower('#4caf62',-3.2,-1.2);stack.set(4);tbl.g.add(stack.g);
K.billboard(city.g,'1000 + ШТРАФЫ','С ВАС',0,9,-26,16,9,'#ff5a5a');K.billboard(city.g,'ЗАВТРА','ШАПОЧКА',0,9,24,16,9,'#ffd23f');
const hare=new Puppet('man',1.9),fox=new Puppet('woman',2.1);[hare,fox].forEach(p=>{scene.add(p.m);p.hide()});
const H={col:'#c9c9d6',hair:'#f2f2f2',tie:'#ff9ab0'},F={col:'#e8742a',hair:'#d4561a'};
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;
const dur=TM.dur;
const tb=(f)=>{tbl.g.visible=true;tbl.hl.forEach(h=>{h.material.opacity=0;h.material.color.set('#ffd23f')});stack.g.visible=false;pen.visible=true;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=true;f&&f()};
const orb=(u,y0,y1,r0,r1,roll,tz=0)=>{const a=lerp(.3,-.4,u);cam.position.set(Math.sin(a)*lerp(r0,r1,u),lerp(y0,y1,ease(u)),Math.cos(a)*lerp(r0,r1,u)+.5);cam.lookAt(0,0,tz);cam.fov=52;cam.rotateZ(roll);cam.updateProjectionMatrix()};
const room=(r,to,u)=>{resetRoom(r);hut.visible=false;bank.visible=false;letter.visible=false;hearts.visible=false;r.color(u,r.base,new THREE.Color(to))};
const kick=T('и выгнала зайца'),nopay=T('Друг не платит —'),dem=T('Банк требует'),zp=T('ваша зарплата');
const shots=[
{id:'hook',t0:0,t1:S('s02'),out:'whipR',f(t,u){room(rA,'#c79a5a',0);hut.visible=true;
 hare.pose(-1.3,-1.4,{expr:'neutral',look:.4,...H,blink:blink(t)});fox.pose(.3,-1.0,{expr:'sly',look:-.4,aR:[1.0,1.2],propR:'card',...F,blink:blink(t,.4)});
 camPath(u,[1.6,.6,3.8],[.8,1.0,3.5],[-.4,1.8,-.8],[-.4,1.6,-.8],[66,60],.04);fx.draw=K.hook(['ДРУГ ПРОСИТ','СТАТЬ ПОРУЧИТЕЛЕМ?'],0,S('s02')-.1)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipR',out:'whipUp',f(t,u){tb();fx.draw=K.big('ПРАВИЛО',S('s02')+.1,S('s03'),'#7dff9a',180,.17);orb(u,9,6,1.5,2.5,-.2+u*.4,.2)}},
{id:'guest',t0:S('s03'),t1:kick,in:'whipUp',out:'whipL',f(t,u){room(rA,'#c79a5a',0);hut.visible=true;
 hare.pose(-1.4,-1.4,{expr:'smile',look:.4,aL:[.6,.6],...H,blink:blink(t)});fox.pose(.2,-1.2,{expr:'smile',look:-.4,...F,blink:blink(t,.4)});
 fx.tags=[{txt:'ЗАЯЦ',t:S('s03')+.1,xy:[.28,.22]},{txt:'ЛИСА',t:S('s03')+.4,xy:[.66,.22]}];camPath(u,[-2.4,.8,3.7],[-.4,1.2,3.2],[0,1.9,-1],[-.3,1.8,-1],[68,60],-.05)}},
{id:'kick',t0:kick,t1:S('s04'),in:'whipL',out:'zoom',f(t,u){room(rA,'#c4453a',ss(0,.6,u));hut.visible=true;
 hare.pose(lerp(-1.2,-1.7,ss(0,.6,u)),lerp(-1.4,-.2,ss(0,.6,u)),{expr:'shock',look:.5,walk:t*6,...H,blink:false});fox.pose(.2,-1.2,{expr:'rage',look:-.4,aL:[1.8,.5],...F,blink:false});
 camPath(u,[2.2,.8,3.7],[1.0,1.3,3.4],[-.6,1.8,-1],[-.6,1.6,-1],[70,64],.05)}},
{id:'sign',t0:S('s04'),t1:nopay,in:'zoom',out:'whipR',f(t,u){tb(()=>{tbl.hl[2].material.opacity=.7});const a=lerp(0,1.0,u);cam.position.set(Math.sin(a)*.6,lerp(7.5,5.2,ease(u)),.9+Math.cos(a)*.6);cam.up.set(0,0,-1);cam.lookAt(0,0,.9);cam.up.set(0,1,0);cam.fov=50;cam.updateProjectionMatrix();
 fx.tags=[{txt:'ПОДПИСЬ = ВЫ',t:S('s04')+.2,xy:[.5,.2]}]}},
{id:'youpay',t0:nopay,t1:S('s05'),in:'whipR',out:'whipUp',f(t,u){room(rB,'#5a6470',0);bank.visible=true;letter.visible=true;
 hare.pose(-.4,-1.3,{expr:'shock',look:.4,aR:[.5,.5],...H,blink:blink(t)});
 camPath(u,[-1.8,.7,3.8],[-.6,1.1,3.2],[.6,1.9,-2],[.8,1.8,-2.5],[64,56],-.04)}},
{id:'k1000',t0:S('s05'),t1:dem,in:'whipUp',out:'whipL',f(t,u){tb(()=>{stack.g.visible=true;tbl.hl[1].material.opacity=.7});fx.draw=K.big('ВЗЯЛ 1000',S('s05')+.1,dem-.05,'#ffffff',170,.17);camPath(u,[-5,2.4,5.5],[-1.5,4.6,4],[-3,1,-1.2],[-2,.5,-1],[56,50],.05)}},
{id:'demand',t0:dem,t1:S('s06'),in:'whipL',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;
 linPath(u,[-11,6,12],[0,8.5,7],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'impact',t0:S('s06'),t1:S('s07'),in:'zoom',out:'whipUp',f(t,u){room(rA,'#3a3a4a',ss(0,.5,u));hut.visible=true;const k=t>zp?Math.max(0,1-(t-zp)/.5):0;
 hare.pose(-1.3,-1.3,{expr:'shock',look:.4,...H,blink:false});
 camPath(u,[1.8,.7,3.8],[.8,1.2,3.3],[-.2,1.8,-1],[-.2,1.6,-1],[66,58],.04);cam.position.x+=Math.sin(t*53)*.2*k;
 fx.crack={p:[1.3,1.6,-3.6],a:t>zp?clamp((t-zp)*2.5):0,seed:4};fx.flash=k*.8;fx.draw=K.big('ПОД УДАРОМ',S('s06'),S('s07')-.05,'#ff5a5a',150,.17)}},
{id:'rule',t0:S('s07'),t1:S('s08'),in:'whipUp',out:'whipR',f(t,u){tb(()=>{stack.g.visible=true;stack.set(2)});fx.draw=K.big('ГОТОВ ОТДАТЬ?',S('s07')+.1,S('s08')-.05,'#7dff9a',140,.17);orb(u,8,5,1.5,2.5,.2-u*.4,-1)}},
{id:'refuse',t0:S('s08'),t1:S('s09'),in:'whipR',out:'whipL',f(t,u){room(rB,'#59b86a',ss(0,.8,u));
 hare.pose(-1.3,-1.3,{expr:'smile',look:.4,talk:t,aR:[1.3,.3],...H,blink:blink(t)});fox.pose(.4,-1.2,{expr:'angry',look:-.4,...F,blink:blink(t,.4)});
 fx.draw=K.big('ОТКАЖИ ВЕЖЛИВО',S('s08')+.1,S('s09')-.05,'#ffffff',120,.17);camPath(u,[2.6,.8,3.6],[-1,1.2,3.0],[0,1.9,-1],[0,1.7,-1],[68,60],-.05)}},
{id:'sum',t0:S('s09'),t1:S('s10'),in:'whipL',out:'whipUp',f(t,u){room(rA,'#59b86a',ss(0,.8,u));hut.visible=true;hearts.visible=true;
 hare.pose(-.6,-1.3,{expr:'smile',look:.3,aL:[.6,.6],...H,blink:blink(t)});
 fx.draw=K.big('ПОДПИСЬ = ДОЛГ',S('s09'),S('s10')-.05,'#ffd23f',130,.17);camPath(u,[1.6,.6,3.8],[.6,1.0,3.4],[.2,1.8,-.5],[.2,1.5,-.5],[66,60],-.04)}},
{id:'next',t0:S('s10'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots.map(s=>({...s,f(t,u){hare.hide();fox.hide();s.f(t,u)}}))};
