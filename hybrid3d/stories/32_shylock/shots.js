import {kit} from '/lib_ru.js';
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,seg,cap,city,camPath,linPath,resetRoom,Puppet,blink,box,cyl,plane,label,addSet}=E;
const K=kit(E);
const rA=K.room('rA','#6f8fa6'),rB=K.room('rB','#4d6fa5'),rC=K.room('rC','#8a6fb0');
const tbl=K.makeTable('tbl','ДОГОВОР ЗАЙМА',[['ШТРАФ ЗА ПРОСРОЧКУ','мелким шрифтом'],['КТО ОТВЕЧАЕТ ЗА ДОЛГ','заёмщик и поручитель'],['ДОСРОЧНОЕ ПОГАШЕНИЕ','условия возврата']]);
const gr=K.tower('#59b86a',-1.4,0),rd=K.tower('#e0304a',1.4,0);tbl.g.add(gr.g,rd.g);
const sgn=K.stand(3.6,1.5,'#fff',[{t:'ВЗЯЛ 100',s:120,y:.5}],-1.4,4.3,-1.2);const sgn2=K.stand(3.6,1.5,'#ffd23f',[{t:'ШТРАФ',s:120,y:.5}],1.4,4.3,-1.2);tbl.g.add(sgn,sgn2);
const x2=K.stand(3.6,2.2,'#ffd23f',[{t:'×2',s:420,y:.5,c:'#d0173a'}],0,3,1.6);x2.visible=false;tbl.g.add(x2);
const ok=K.stand(4.2,2,'#59b86a',[{t:'ПРОЧИТАЛ',s:150,y:.5,c:'#fff'}],0,.15,2.4);ok.rotation.set(-Math.PI/2,0,-.2);ok.visible=false;tbl.g.add(ok);
const clock=new THREE.Group();clock.position.set(1.6,.08,2.1);const face=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.12,48),new THREE.MeshLambertMaterial({color:'#fff'}));clock.add(face);const hand=box(.1,.05,.8,'#d0173a',0,.1,-.35);const pv=new THREE.Group();pv.add(hand);clock.add(pv);tbl.g.add(clock);clock.visible=false;
const stopS=K.stand(1.5,1.5,'#d0173a',[{t:'СТОП',s:110,y:.5,c:'#fff'}],-2.2,2.0,-3.9);stopS.visible=false;rA.g.add(stopS);
const cal=K.stand(1.7,2.0,'#fff',[{t:'ЗАВТРА',s:96,y:.4,c:'#d0173a'},{t:'6',s:260,y:.72}],-1.9,2.3,-3.9);rB.g.add(cal);
K.billboard(city.g,'3','СТРОКИ ДО ПОДПИСИ',0,9,-26,16,9);K.billboard(city.g,'ЗАВТРА','ПЛОХИШ И ВАРЕНЬЕ',0,9,24,16,9,'#f0559c');
const jam=cyl(1.2,2.2,'#7a2150',6,1.1,26);city.g.add(jam);
const shy=new Puppet('man',2.9),ant=new Puppet('man',2.8),plg=new Puppet('woman',2.7);[shy,ant,plg].forEach(p=>{scene.add(p.m);p.hide()});
const SH='#2b2233',AN='#3f6fb5';
const hideP=()=>{shy.hide();ant.hide();plg.hide()};
const T=(c)=>cap(c).t,TE=(c)=>cap(c).e;
const tb=(extra)=>{tbl.g.visible=true;tbl.hl.forEach(h=>h.material.opacity=0);gr.set(0);rd.set(0);sgn.visible=false;sgn2.visible=false;x2.visible=false;ok.visible=false;clock.visible=false;scene.background=new THREE.Color('#e9c58c');tbl.paper.visible=true;extra&&extra()};
const dur=TM.dur;
const shots=[
{id:'hook',t0:0,t1:2.7,out:'whipR',f(t,u){hideP();resetRoom(rA);rA.color(0,rA.base,new THREE.Color('#c4453a'));rA.color(ss(1,2.7,t)*.0,rA.base,rA.base);
 shy.pose(.2,-.8,{expr:'sly',look:-.3,aR:[1.5,1.2],propR:'clip',col:SH,hair:'#15131a',tie:'#d8263f',blink:blink(t)});
 camPath(u,[1.4,.6,3.6],[.4,1.0,2.6],[.2,1.8,-.5],[.2,2.3,-.5],[66,56],.04);fx.draw=K.hook(['ЧИТАЕШЬ ДОГОВОР','ПЕРЕД ПОДПИСЬЮ?'],0,2.6)}},
{id:'top',t0:2.7,t1:4.94,in:'whipR',out:'whipUp',f(t,u){hideP();tb(()=>{tbl.hl[0].material.opacity=.0});
 const a=lerp(0,.5,u);cam.position.set(Math.sin(a)*1.5,lerp(11,7,ease(u)),Math.cos(a)*1.5+.5);cam.lookAt(0,0,0);cam.fov=50;cam.rotateZ(-.25+u*.5);cam.updateProjectionMatrix()}},
{id:'drone',t0:4.94,t1:8.30,in:'whipUp',out:'zoom',f(t,u){city.g.visible=true;scene.background=SKY;linPath(Math.pow(u,1.3),[-22,16,6],[0,9.2,-9],[0,6,-26],[0,9,-26],[60,48],-.1+u*.1)}},
{id:'sign',t0:8.30,t1:11.66,in:'zoom',out:'whipL',f(t,u){hideP();resetRoom(rB);rB.color(0,rB.base,rB.base);
 ant.pose(-1.3,-1.1,{expr:'smile',col:AN,hair:'#7a4a22',tie:'#e7c14c',aR:[1.1,1.4],propR:'clip',blink:blink(t,.2)});
 shy.pose(1.4,-1.7,{expr:'sly',look:-1,col:SH,hair:'#15131a',tie:'#d8263f',aL:[.7,.6],blink:blink(t)});
 fx.tags=[{txt:'АНТОНИО',t:T('Купец Антонио'),xy:[.27,.2]},{txt:'ШЕЙЛОК',t:T('Купец Антонио')+.5,xy:[.74,.2]}];
 camPath(u,[-2.4,.7,3.8],[1.5,1.5,3.0],[.0,1.9,-1],[.2,2.1,-1],[68,60],.05)}},
{id:'cl1',t0:11.66,t1:14.9,in:'whipL',out:'whipUp',f(t,u){hideP();tb(()=>{const p=ss(T('Штраф')-.1,T('Штраф')+.2,t);tbl.hl[0].material.opacity=.55+.3*Math.sin(t*9)*(p>0?1:0);tbl.hl[0].material.color.set(p>.5?'#e0304a':'#ffd23f')});
 fx.draw=K.big('ШТРАФ 10% В ДЕНЬ'.length?'10% В ДЕНЬ':'',T('Штраф'),14.9,'#ff5a5a',200,.17);
 cam.position.set(lerp(1.2,-1.2,u),lerp(8,5.4,ease(u)),lerp(3,1.5,u));cam.lookAt(0,0,lerp(-.8,-.2,u));cam.fov=52;cam.rotateZ(.2-u*.35);cam.updateProjectionMatrix()}},
{id:'days',t0:14.9,t1:19.9,in:'whipUp',out:'whipR',f(t,u){hideP();tb(()=>{sgn.visible=true;sgn2.visible=t>T('Опоздал')-.2;gr.set(10);const d=Math.floor(clamp((t-T('на 10 дней —'))/(TE('это 100%.')-T('на 10 дней —')-.2))*10+.001);rd.set(t<T('на 10 дней —')?0:Math.min(10,Math.max(1,d)));
  const dd=t<T('на 10 дней —')?0:Math.min(10,Math.max(1,d));
  fx.draw=(C,W,H,tt)=>{if(!dd)return;C.save();C.translate(W/2,H*.2);K.outlined(C,'ДЕНЬ '+dd,0,0,190,dd>=10?'#ff5a5a':'#fff',24);C.restore()}});
 camPath(u,[-6,1.4,7],[4,2.4,5.5],[0,1.7,0],[0,1.9,0],[62,54],.04)}},
{id:'boom',t0:19.9,t1:22.52,in:'whipR',out:'whipL',f(t,u){hideP();const hit=T('вернул 200.');tb(()=>{sgn.visible=true;sgn2.visible=true;gr.set(10);rd.set(10);x2.visible=t>hit;const s=ss(hit,hit+.12,t);x2.scale.setScalar(lerp(2,1,s))});
 ant.pose(0,-3.2,{expr:t>hit?'shock':'neutral',col:AN,hair:'#7a4a22',tie:'#e7c14c',aL:[t>hit?2.2:.3,.4],aR:[t>hit?2.2:.3,.4],blink:false});
 const k=Math.max(0,1-(t-hit)/.5)*(t>hit?1:0);camPath(u,[0,1.8,8],[0,2.3,5.4],[0,2,0],[0,2.2,0],[60,50],0);cam.position.x+=Math.sin(t*53)*.12*k;cam.position.y+=Math.sin(t*47)*.1*k;
 fx.crack={p:[0,3,1.6],a:k>0||t>hit?clamp((t-hit)*2.5):0,seed:5};fx.flash=k*.9;fx.bars=undefined}},
{id:'guar',t0:22.52,t1:26.78,in:'whipL',out:'whipUp',f(t,u){hideP();resetRoom(rC);rC.color(0,rC.base,rC.base);
 ant.pose(-1.2,-1.2,{expr:t>T('или поручитель?')-.4?'shock':'angry',col:AN,hair:'#7a4a22',tie:'#e7c14c',aR:[.5,.5],propR:'bag',blink:blink(t)});
 const pl=ss(T('Только ты')-.2,T('Только ты')+.2,t);plg.pose(lerp(4,1.3,pl),-1.6,{expr:'sly',look:-1,aL:[1.0,1.3],propL:'cash',blink:blink(t,.4)});
 fx.tags=[{txt:'ТЫ',t:T('Только ты'),xy:[.27,.2]},{txt:'ПОРУЧИТЕЛЬ',t:T('или поручитель?'),xy:[.72,.2]}];
 camPath(u,[3,.9,3.8],[-2.2,1.3,3.4],[0,1.9,-1],[0,2,-1],[68,62],-.05)}},
{id:'cl3',t0:26.78,t1:29.46,in:'whipUp',out:'zoom',f(t,u){hideP();tb(()=>{tbl.hl[2].material.opacity=.7;clock.visible=true;pv.rotation.y=-t*7;tbl.paper.visible=true});
 fx.draw=K.big('РАНЬШЕ СРОКА?'.length?'РАНЬШЕ?':'',26.8,29.4,'#7fe0ff',210,.17);
 cam.position.set(lerp(-1,1,u),lerp(10,6.5,ease(u)),lerp(4,2.8,u));cam.lookAt(.4,0,lerp(1,1.6,u));cam.fov=52;cam.rotateZ(-.2+u*.3);cam.updateProjectionMatrix()}},
{id:'stop',t0:29.46,t1:31.8,in:'zoom',out:'whipR',f(t,u){hideP();resetRoom(rA);rA.color(0,rA.base,new THREE.Color('#c4453a'));stopS.visible=true;rA.g.visible=true;
 ant.pose(-.4,-.6,{expr:'angry',col:AN,hair:'#7a4a22',tie:'#e7c14c',aR:[2.0,.2],aL:[.3,.3],blink:false});shy.pose(1.6,-1.9,{expr:'sly',look:-1,col:SH,hair:'#15131a',tie:'#d8263f',blink:blink(t)});
 camPath(u,[1.6,.5,3.5],[.2,.9,2.4],[-.5,1.8,-1],[-.5,2.1,-1],[68,56],.04)}},
{id:'tomorrow',t0:31.8,t1:34.16,in:'whipR',out:'whipL',f(t,u){hideP();resetRoom(rB);rB.color(0,rB.base,new THREE.Color('#4fa86a'));
 ant.pose(lerp(1.5,-.2,ss(0,.8,u)),-1.0,{expr:'smile',col:AN,hair:'#7a4a22',tie:'#e7c14c',aR:[1.0,1.3],propR:'clip',walk:Math.sin(t*9)*(1-ss(.6,.9,u)),blink:blink(t)});
 camPath(u,[1.4,.5,3.6],[-1.2,2.6,2.9],[-1.9,2.3,-3],[-1.5,2.1,-2],[64,52],-.05)}},
{id:'rule',t0:34.16,t1:36.9,in:'whipL',out:'whipUp',f(t,u){hideP();tb(()=>{ok.visible=t>T('потом подписал.')-1.2;const s=ss(T('потом подписал.')-1.2,T('потом подписал.')-.9,t);ok.scale.setScalar(lerp(2.5,1,s));tbl.hl.forEach(h=>h.material.opacity=.0)});
 cam.position.set(lerp(2,-1,u),lerp(10,6,ease(u)),lerp(5,3.5,u));cam.lookAt(0,0,.8);cam.fov=54;cam.rotateZ(.15-u*.3);cam.updateProjectionMatrix()}},
{id:'next',t0:36.9,t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
return shots};
