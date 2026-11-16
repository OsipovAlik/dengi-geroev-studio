import {kit} from '/lib_ru.js';
// 46 Мужик и медведь («Вершки и корешки»): «пополам» ничего не значит, пока не ясно, ЧТО делим, кто платит расходы и кто выбирает
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- герои (своя рисовка): мужик в синей рубахе с бородой, бурый медведь
const eyes=(c,w,h,y,mood)=>{c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.09),h*y,w*.05,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.09),h*(y+.005),w*.022,0,7);c.fill()}
 c.lineWidth=9;if(mood==='angry'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.16),h*(y-.05));c.lineTo(w*(.5+s*.04),h*(y-.025));c.stroke()}}
 if(mood==='sly'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*.15),h*(y-.035));c.lineTo(w*(.5+s*.04),h*(y-.045));c.stroke()}}};
const mouth=(c,w,h,y,mood)=>{c.lineWidth=10;c.beginPath();if(mood==='angry'||mood==='sad')c.arc(w*.5,h*(y+.04),w*.08,PI*1.15,PI*1.85);else if(mood==='sly')c.arc(w*.53,h*(y-.02),w*.07,PI*.15,PI*.75);else c.arc(w*.5,h*(y-.03),w*.09,PI*.15,PI*.85);c.stroke()};
const muzhik=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;
 c.fillStyle='#4a3a2a';c.fillRect(w*.33,h*.78,w*.12,h*.2);c.fillRect(w*.55,h*.78,w*.12,h*.2);c.strokeRect(w*.33,h*.78,w*.12,h*.2);c.strokeRect(w*.55,h*.78,w*.12,h*.2);
 c.fillStyle='#3d6fd0';c.beginPath();c.roundRect(w*.24,h*.45,w*.52,h*.38,w*.12);c.fill();c.stroke();c.fillStyle='#d8382e';c.fillRect(w*.27,h*.66,w*.46,h*.035);c.strokeRect(w*.27,h*.66,w*.46,h*.035);
 c.fillStyle='#f2c49a';c.beginPath();c.arc(w*.5,h*.29,w*.22,0,7);c.fill();c.stroke();
 c.fillStyle='#c98a3a';c.beginPath();c.moveTo(w*.3,h*.32);c.quadraticCurveTo(w*.5,h*.56,w*.7,h*.32);c.quadraticCurveTo(w*.5,h*.42,w*.3,h*.32);c.fill();c.stroke();
 c.fillStyle='#c98a3a';c.beginPath();c.ellipse(w*.5,h*.12,w*.24,h*.06,0,PI,0);c.fill();c.stroke();
 eyes(c,w,h,.25,mood);c.strokeStyle=INK;c.fillStyle='#e8a37a';c.beginPath();c.arc(w*.5,h*.3,w*.035,0,7);c.fill();c.stroke();mouth(c,w,h,.37,mood)};
const bear=(mood)=>(c,w,h)=>{c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const fur='#8a5428',muz='#d6a46e';
 c.fillStyle=fur;c.beginPath();c.roundRect(w*.18,h*.44,w*.64,h*.52,w*.2);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*.7,w*.18,h*.16,0,0,7);c.fill();c.stroke();
 c.fillStyle=fur;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*.2),h*.1,w*.08,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*.27,w*.25,0,7);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*.34,w*.12,h*.07,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*.31,w*.04,h*.022,0,0,7);c.fill();eyes(c,w,h,.23,mood);c.strokeStyle=INK;mouth(c,w,h,.37,mood)};
// ---------- амбар (кирпичная комната)
const rB=K.room('rB','#5a4a7a');
const deal=K.stand(3.0,.75,'#fff',[{t:'ВСЁ ПОПОЛАМ',s:92,y:.54,c:'#3a2a5a'}],0,3.7,-3.9);rB.g.add(deal);
const zero=K.stand(1.5,1.3,'#ff5a5a',[{t:'0',s:250,y:.56,c:'#fff'}],1.6,3.2,-3.85);rB.g.add(zero);
const share=K.stand(2.6,.75,'#ffd23f',[{t:'ДОЛЯ ОТ ЧЕГО?',s:80,y:.54,c:'#15131a'}],0,3.7,-3.88);rB.g.add(share);
const bM={happy:drawn(1.6,2.2,muzhik('happy'),0,0,0),sly:drawn(1.6,2.2,muzhik('sly'),0,0,0)};
const bB={happy:drawn(1.9,2.3,bear('happy'),0,0,0),sly:drawn(1.9,2.3,bear('sly'),0,0,0),angry:drawn(1.9,2.3,bear('angry'),0,0,0)};
Object.values(bM).forEach(m=>rB.g.add(m));Object.values(bB).forEach(m=>rB.g.add(m));
const roots=new THREE.Group();for(let i=0;i<9;i++){const r=cyl(.05,.9,'#7a5030',0,0,0);r.rotation.set(rng(i)()*2,i,1.2+i*.3);r.position.set((i%3-1)*.25,.25+Math.floor(i/3)*.08,(i%2)*.2);roots.add(r)}roots.position.set(1.1,0,-1.0);rB.g.add(roots);
const dm=new THREE.Matrix4();
const debris=(r,t,t0,cx,cz)=>{const dd=clamp((t-t0)/1.2);r.debris.visible=t>t0;if(t<=t0)return;const R=rng(31);for(let i=0;i<46;i++){const a=R()*6.28,sp=1.5+R()*3.5;const X=cx+Math.cos(a)*sp*dd,Y=clamp(1.6+R()*2+(2.6*dd-3.8*dd*dd),.1,4.1),Z=cz+Math.sin(a)*sp*dd;dm.makeRotationFromEuler(new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4));dm.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));r.debris.setMatrixAt(i,dm)}r.debris.instanceMatrix.needsUpdate=true};
const barn=(t,mM,mB,signs,to,u)=>{resetRoom(rB);rB.col(u||0,to||'#5a4a7a');deal.visible=signs==='deal';zero.visible=signs==='zero';share.visible=signs==='share';roots.visible=signs==='zero';
 Object.entries(bM).forEach(([k,m])=>{m.visible=k===mM;m.position.set(-1.2,1.1+Math.abs(Math.sin(t*5))*.03,-1.2);face(m)});
 Object.entries(bB).forEach(([k,m])=>{m.visible=k===mB;m.position.set(1.2,1.15+Math.abs(Math.sin(t*4+1))*.03,-1.3);face(m)})};
// ---------- поле (своя площадка под небом)
const gF=new THREE.Group();
const soil=canvasTex(1024,1024,(c,w,h)=>{c.fillStyle='#8a5a32';c.fillRect(0,0,w,h);for(let i=0;i<16;i++){c.fillStyle=i%2?'#7a4c28':'#94643a';c.fillRect(0,i*h/16,w,h/32)}c.strokeStyle='rgba(40,20,10,.5)';c.lineWidth=3;for(let i=0;i<16;i++){c.beginPath();c.moveTo(0,i*h/16);c.lineTo(w,i*h/16);c.stroke()}},{wrap:true});soil.repeat.set(3,3);
const field=plane(28,26,lam('#fff',{map:soil}),0,0,-3,-PI/2);field.receiveShadow=true;gF.add(field);
const grass=plane(200,200,lam('#7cc25a'),0,-.02,0,-PI/2);grass.receiveShadow=true;gF.add(grass);
for(let i=0;i<14;i++){const R=rng(100+i);const x=(i%2?1:-1)*(16+R()*10),z=-30+i*4.5;const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0),cyl(1.6,.01,'#3f8a3a',0,0,0));const cr=new THREE.Mesh(new THREE.ConeGeometry(1.8,4,7),lam('#3f9a4a'));cr.position.y=3.6;cr.castShadow=true;tr.add(cr);tr.position.set(x,0,z);gF.add(tr)}
const hut=new THREE.Group();hut.add(box(4,3,3.5,'#c98a4a',0,1.5,0));const roof=new THREE.Mesh(new THREE.ConeGeometry(3.4,2,4),lam('#a83a2a'));roof.rotation.y=PI/4;roof.position.y=4;roof.castShadow=true;hut.add(roof);hut.position.set(-10,0,6);gF.add(hut);
const PL=[];for(let ix=0;ix<9;ix++)for(let iz=0;iz<8;iz++){const g=new THREE.Group();const x=(ix-4)*1.3,z=-10+iz*1.3;g.position.set(x,0,z);
 const tops=new THREE.Group();for(let k=0;k<3;k++){const l=new THREE.Mesh(new THREE.ConeGeometry(.16,.7,5),lam('#3fae4a'));l.position.set(Math.cos(k*2.1)*.12,.35,Math.sin(k*2.1)*.12);l.rotation.set(Math.sin(k*2.1)*.5,0,-Math.cos(k*2.1)*.5);l.castShadow=true;tops.add(l)}
 const turnip=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),lam('#f1e6f2'));turnip.position.y=.05;turnip.scale.y=.9;turnip.castShadow=true;const tc=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),lam('#b35aa8'));tc.position.y=.17;turnip.add(tc);
 const wheat=new THREE.Group();for(let k=0;k<4;k++){const s=cyl(.025,1.1,'#d8b040',Math.cos(k*1.6)*.15,.55,Math.sin(k*1.6)*.15);const e=box(.09,.3,.09,'#f0c850',Math.cos(k*1.6)*.15,1.2,Math.sin(k*1.6)*.15);wheat.add(s,e)}
 g.add(tops,turnip,wheat);gF.add(g);PL.push({g,tops,turnip,wheat})}
const fM={happy:drawn(1.6,2.2,muzhik('happy'),0,0,0),sly:drawn(1.6,2.2,muzhik('sly'),0,0,0)};
const fB={happy:drawn(1.9,2.3,bear('happy'),0,0,0),sly:drawn(1.9,2.3,bear('sly'),0,0,0),angry:drawn(1.9,2.3,bear('angry'),0,0,0)};
Object.values(fM).forEach(m=>gF.add(m));Object.values(fB).forEach(m=>gF.add(m));
const pileV=new THREE.Group();for(let i=0;i<12;i++){const R=rng(200+i);const l=new THREE.Mesh(new THREE.ConeGeometry(.2,.8,5),lam('#4fbe4a'));l.position.set((R()-.5)*1.1,.3+R()*.4,(R()-.5)*.8);l.rotation.set(R()*3,R()*3,R()*3);l.castShadow=true;pileV.add(l)}
const pileR=new THREE.Group();for(let i=0;i<10;i++){const R=rng(300+i);const s=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),lam('#f1e6f2'));const tc=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),lam('#b35aa8'));tc.position.y=.13;s.add(tc);s.position.set((R()-.5)*1.2,.28+(i>5?.45:0),(R()-.5)*.9);s.castShadow=true;pileR.add(s)}
const pileW=new THREE.Group();for(let i=0;i<16;i++){const s=cyl(.04,1.6,'#e0b848',Math.cos(i)*.2,.8,Math.sin(i)*.2);s.rotation.z=Math.cos(i*1.7)*.18;pileW.add(s,box(.12,.35,.12,'#f2cc58',Math.cos(i)*.2+Math.sin(s.rotation.z)*-.8,1.7,Math.sin(i)*.2))}pileW.add(cyl(.3,.12,'#c0392b',0,.9,0));
const pileK=new THREE.Group();for(let i=0;i<12;i++){const R=rng(400+i);const r=cyl(.05,.9,'#7a5030',(R()-.5)*.9,.15+R()*.3,(R()-.5)*.6);r.rotation.set(R()*3,R()*3,PI/2+R());pileK.add(r)}
const sV=K.stand(1.6,.55,'#fff',[{t:'ВЕРШКИ',s:90,y:.56,c:'#2a7a2a'}],0,0,0),sK=K.stand(1.8,.55,'#fff',[{t:'КОРЕШКИ',s:90,y:.56,c:'#7a4a20'}],0,0,0);
const sR=K.stand(1.4,.55,'#fff',[{t:'РЕПА',s:96,y:.56,c:'#8a2a8a'}],0,0,0),sW=K.stand(1.8,.55,'#fff',[{t:'ПШЕНИЦА',s:90,y:.56,c:'#9a6a10'}],0,0,0);
[pileV,pileR,pileW,pileK,sV,sK,sR,sW].forEach(o=>gF.add(o));
gF.add(new THREE.HemisphereLight('#ffffff','#9a8a6a',3.1));sunRig(gF,[-9,22,12],[0,0,-3],'#fff1d9',2.6,16);addSet('field',gF);
// year: 1 = репа, 2 = пшеница; grow 0..1; show: какие кучи
const fieldSet=(t,year,grow,mM,mB,piles)=>{gF.visible=true;scene.background=SKY;
 PL.forEach((p,i)=>{const R=rng(500+i);const gg=clamp(grow*1.3-R()*.3);p.tops.visible=year===1;p.turnip.visible=year===1&&gg>.02;p.turnip.scale.setScalar(Math.max(.01,gg));p.turnip.position.y=.05+gg*.12;p.tops.scale.setScalar(Math.max(.01,year===1?Math.max(.3,gg):1));
  p.wheat.visible=year===2&&gg>.02;p.wheat.scale.set(1,Math.max(.01,gg),1)});
 Object.entries(fM).forEach(([k,m])=>{m.visible=k===mM;m.position.set(-2.2,1.1+Math.abs(Math.sin(t*5))*.03,1.6);face(m)});
 Object.entries(fB).forEach(([k,m])=>{m.visible=k===mB;m.position.set(2.2,1.15+Math.abs(Math.sin(t*4+1))*.03,1.6);face(m)});
 const P=piles||[];pileV.visible=P.includes('V');pileR.visible=P.includes('R');pileW.visible=P.includes('W');pileK.visible=P.includes('K');
 pileV.position.set(3.4,0,1.9);pileK.position.set(3.4,0,1.9);pileR.position.set(-3.4,0,1.9);pileW.position.set(-3.4,0,1.9);
 sV.visible=pileV.visible;sK.visible=pileK.visible;sR.visible=pileR.visible;sW.visible=pileW.visible;
 for(const s of[sV,sK])s.position.set(3.4,1.75,2.1);for(const s of[sR,sW])s.position.set(-3.4,2.05,2.1);[sV,sK,sR,sW].forEach(face)};
// ---------- комната денег: столбики
const rM=K.room('rM','#2a4a6a');
const H=v=>Math.max(.01,v/100*2.9);
const mk=(x,col,t1,t2,tc)=>{const b=box(1.2,1,.9,col,x,.5,-2.3);rM.g.add(b);const s=K.stand(1.5,.9,'#fff',[{t:t1,s:120,y:.4,c:tc||'#15131a'},{t:t2,s:46,y:.82,c:'#555'}],x,0,-2.3);rM.g.add(s);return{b,s,x}};
const BR={rev:mk(-.9,'#ffc93a','100','ВЫРУЧКА'),cost:mk(.9,'#e04a3a','60','РАСХОДЫ'),
 p1:mk(-.9,'#3fae5a','20','ВАМ'),p2:mk(.9,'#3fae5a','20','ЕМУ'),
 v1:mk(-.9,'#3fae5a','50','ВАМ'),v2:mk(.9,'#3fae5a','50','ЕМУ'),vneg:mk(-.9,'#e04a3a','−10','ВАМ','#d02a1a')};
const money=(on,to,u)=>{resetRoom(rM);rM.col(u||0,to||'#2a4a6a');Object.entries(BR).forEach(([k,o])=>{const v=on[k];o.b.visible=o.s.visible=v!==undefined;if(v===undefined)return;const hh=H(Math.abs(v));o.b.scale.y=hh;o.b.position.y=hh/2;o.s.position.y=hh+.62})};
// ---------- стол сверху: договор
const tbl=K.makeTable('tbl','ДОГОВОР: ПОПОЛАМ',[['ЧТО ДЕЛИМ?','вершки или корешки'],['КТО ПЛАТИТ РАСХОДЫ?','семена, работа, аренда'],['КТО ВЫБИРАЕТ?','и когда']]);
const stamp=drawn(2.2,2.2,(c,w,h)=>{c.strokeStyle='#d0302a';c.lineWidth=26;c.beginPath();c.arc(w/2,h/2,w*.42,0,7);c.stroke();c.lineWidth=10;c.beginPath();c.arc(w/2,h/2,w*.33,0,7);c.stroke();c.fillStyle='#d0302a';c.font=`800 ${w*.14}px Pop`;c.textAlign='center';c.textBaseline='middle';c.fillText('НА',w/2,h*.42);c.fillText('БУМАГЕ',w/2,h*.58)},0,0,0);stamp.rotation.x=-PI/2;tbl.g.add(stamp);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,st)=>{tbl.g.visible=true;scene.background=new THREE.Color('#e9c58c');tbl.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set('#ffd23f')});stamp.visible=st>0;stamp.position.set(1.0,.08+(1-st)*3,1.6);stamp.rotation.z=.3};
// ---------- город
K.billboard(city.g,'3 ВОПРОСА','СПАСУТ ПОЛОВИНУ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','ЖАДНЫЕ МЕДВЕЖАТА',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const ask=T('Сначала спросите —'),vB=T('Медведь выбрал вершки —'),aM=T('а мужик'),wh=T('а выросла пшеница.'),half=T('Медведю — ничего.'),boom=half+.25,
 rv=T('Пополам выручку,'),mine=T('а расходы ваши —'),neg=T('у вас минус 10.'),paper=T('И всё — на бумаге.');
const BB=[...Object.values(bM),...Object.values(bB),...Object.values(fM),...Object.values(fB),sV,sK,sR,sW];
const shots=[
{id:'hook',t0:0,t1:ask,out:'whipR',f(t,u){barn(t,'happy','sly','deal');camPath(u,[.3,1.0,4.4],[.1,1.3,3.6],[0,1.6,-1.4],[0,1.7,-1.6],[74,68],.04);
 fx.draw=K.hook(['ДЕЛИМ ПОПОЛАМ?','А ЧТО ИМЕННО?'],0,ask-.05)}},
{id:'ask',t0:ask,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){table([t>T('что именно делим.')],0);top(u,-.4,.3,10.5,8.6,0,-.4);
 fx.draw=K.big('ЧТО ДЕЛИМ?',T('что именно делим.'),S('s02')-.05,'#ffffff',170,.13)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'plow',t0:S('s03'),t1:vB,in:'whipL',out:'whipR',f(t,u){fieldSet(t,1,0,'happy','happy',[]);linPath(u,[-12,7,14],[-2,3.2,8.5],[0,0,-3],[0,1.2,0],[60,58],.06*(1-u));
 fx.tags=[{txt:'МУЖИК',t:S('s03')+.1,xy:[.3,.2]},{txt:'МЕДВЕДЬ',t:S('s03')+.5,xy:[.68,.22]},{txt:'ПОЛЕ ПОПОЛАМ',t:T('пахали поле пополам.'),xy:[.5,.3]}]}},
{id:'tops',t0:vB,t1:aM,in:'whipR',out:'whipUp',f(t,u){fieldSet(t,1,.4+u*.6,'happy','sly',['V']);camPath(u,[5.5,1.2,6.5],[3.2,1.6,5.4],[2.6,1.3,1.6],[2.8,1.4,1.6],[60,54],-.03);
 fx.draw=K.big('ВЕРШКИ — МНЕ',vB+.15,aM-.05,'#7dff9a',150,.14)}},
{id:'turnip',t0:aM,t1:S('s04'),in:'whipUp',out:'whipL',f(t,u){fieldSet(t,1,1,'happy','sly',['V','R']);PL.forEach((p,i)=>{p.turnip.position.y=.05+ss(aM+.3+(i%9)*.04,aM+.8+(i%9)*.04,t)*.35});top(u,.5,-.3,15,11,0,-5.5,60);
 fx.draw=K.big('РЕПА — В ЗЕМЛЕ',T('посеял репу.'),S('s04')-.05,'#ffffff',150,.14)}},
{id:'year2',t0:S('s04'),t1:wh,in:'whipL',out:'whipUp',f(t,u){fieldSet(t,2,ss(S('s04'),wh,t)*.3,'sly','sly',[]);const a=lerp(-.7,.2,u);cam.position.set(Math.sin(a)*9,lerp(7,3.5,ease(u)),-3+Math.cos(a)*9);cam.lookAt(0,1,-1);cam.fov=60;cam.updateProjectionMatrix();
 fx.tags=[{txt:'НА ДРУГОЙ ГОД',t:S('s04')+.05,xy:[.5,.17]},{txt:'КОРЕШКИ — МНЕ!',t:T('медведь взял корешки —'),xy:[.62,.27]}]}},
{id:'wheat',t0:wh,t1:half,in:'whipUp',out:'whipR',f(t,u){fieldSet(t,2,.3+ss(wh,wh+1,t)*.7,'happy','sly',['W']);camPath(u,[-1.5,.5,6.5],[-1.0,1.4,5.6],[-2,1.4,0],[-2.4,1.5,1.2],[64,56],.03);
 fx.draw=K.big('ПШЕНИЦА!',wh+.1,half-.05,'#ffd23f',190,.14)}},
{id:'zero',t0:half,t1:S('s05'),in:'whipR',out:'whipL',f(t,u){const h=t-boom;barn(t,'happy',h>0?'angry':'sly','zero',h>0?'#8a3a3a':'#5a4a7a',ss(0,.5,h));if(h>0)debris(rB,t,boom+.05,1.2,-1.4);const k=h>0?Math.max(0,1-h/.5):0;
 camPath(u,[2.6,1.3,2.8],[1.4,1.7,1.6],[1.2,1.8,-2.2],[1.3,2.0,-2.6],[62,54],.04);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 fx.tags=[{txt:'ДОЛЯ ТА ЖЕ',t:half+.05,xy:[.5,.17]}];if(h>0){fx.crack={p:[1.6,3.2,-3.8],a:clamp(h*3),seed:7};fx.flash=Math.max(0,1-h/.25)}}},
{id:'money',t0:S('s05'),t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){const g1=ss(T('выручка 100,'),T('выручка 100,')+.5,t),g2=ss(T('расходы 60.'),T('расходы 60.')+.5,t);const on={rev:100*g1};if(t>T('расходы 60.')-.05)on.cost=60*g2;money(on);
 camPath(u,[-1.2,1.0,3.6],[.4,1.5,3.0],[0,1.6,-2.3],[0,1.7,-2.3],[72,66],.03);fx.tags=[{txt:'С ДЕНЬГАМИ ТАК ЖЕ',t:S('s05')+.05,xy:[.5,.17]}]}},
{id:'profit',t0:S('s06'),t1:rv,in:'whipUp',out:'whipR',f(t,u){const g=ss(S('s06'),S('s06')+.6,t);money({p1:20*g,p2:20*g},'#2f7a5a',ss(0,1,u));
 const a=lerp(.5,-.4,u);cam.position.set(Math.sin(a)*4.2,lerp(1.4,2.0,u),-2.3+Math.cos(a)*4.2);cam.lookAt(0,1.0,-2.3);cam.fov=62;cam.updateProjectionMatrix();
 fx.draw=K.big('ПРИБЫЛЬ 40 = 20 + 20',S('s06')+.1,rv-.05,'#7dff9a',110,.14)}},
{id:'revenue',t0:rv,t1:S('s07'),in:'whipR',out:'zoom',f(t,u){const g=ss(rv,rv+.5,t);const on=t<neg?{v1:50*g,v2:50*g}:{vneg:10,v2:50};money(on,'#7a2a2a',ss(neg-.2,neg+.3,t));
 camPath(u,[1.8,1.2,3.6],[.3,1.5,3.3],[0,1.6,-2.3],[-.3,1.5,-2.3],[68,64],-.03);const k=Math.max(0,1-Math.abs(t-neg)/.4);cam.position.x+=Math.sin(t*50)*.08*k;
 fx.tags=[{txt:'РАСХОДЫ −60 — ВАШИ',t:mine,xy:[.5,.17]}];fx.draw=K.big('−10',neg,S('s07')-.05,'#ff5a5a',260,.27)}},
{id:'questions',t0:S('s07'),t1:paper,in:'zoom',out:'whipL',f(t,u){table([t>T('что делим,'),t>T('кто платит расходы,'),t>T('кто выбирает.')],0);top(u,.5,-.2,10.5,9.2,0,-.3)}},
{id:'paper',t0:paper,t1:S('s08'),in:'whipL',out:'whipUp',f(t,u){table([1,1,1],ss(paper+.1,paper+.4,t));top(u,-.2,.2,7.5,6.0,.6,.8,56);const k=Math.max(0,1-Math.abs(t-paper-.4)/.3);cam.position.y+=Math.sin(t*47)*.1*k}},
{id:'sum',t0:S('s08'),t1:S('s09'),in:'whipUp',out:'whipR',f(t,u){barn(t,'sly','sly','share','#d0a040',.6);const a=lerp(-.5,.5,u);cam.position.set(Math.sin(a)*4.6,lerp(1.5,1.9,u),-1.3+Math.cos(a)*4.6);cam.lookAt(0,1.7,-1.4);cam.fov=72;cam.updateProjectionMatrix();Object.values(bM).concat(Object.values(bB)).forEach(face);
 fx.draw=K.big('ДОЛЯ = ?',T('важна не доля,'),S('s09')-.05,'#ffffff',190,.14)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipR',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
