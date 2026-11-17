import {kit} from '/lib_ru.js';
// 49 Теремок: общая покупка вскладчину без договора; вещь подешевела — доля уходящего 15, а не 25; три строчки до покупки
export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,clamp,lerp,ss,ease,cap,seg,city,camPath,linPath,resetRoom,box,cyl,plane,lam,label,canvasTex,addSet,sunRig,rng,INK}=E;
const K=kit(E);const PI=Math.PI;
const drawn=(w,h,draw,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:canvasTex(Math.round(w*220),Math.round(h*220),draw),transparent:true,side:THREE.DoubleSide,alphaTest:.05}));m.position.set(x,y,z);m.castShadow=true;return m};
const face=(m)=>{const p=new THREE.Vector3();m.getWorldPosition(p);m.rotation.set(0,Math.atan2(cam.position.x-p.x,cam.position.z-p.z),0)};
// ---------- звери (своя рисовка): голова + тело
const eyes=(c,w,h,y,mood,dx=.1)=>{c.lineWidth=9;c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*y,w*.055,0,7);c.fill();c.stroke()}c.fillStyle=INK;for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*dx),h*(y+.005),w*.025,0,7);c.fill()}
 if(mood==='angry'||mood==='sad'){for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*(dx+.07)),h*(y-(mood==='sad'?.035:.06)));c.lineTo(w*(.5+s*(dx-.05)),h*(y-(mood==='sad'?.06:.035)));c.stroke()}}};
const mouth=(c,w,h,y,mood)=>{c.lineWidth=10;c.beginPath();if(mood==='shock'){c.fillStyle='#7a1a1a';c.ellipse(w*.5,h*y,w*.05,h*.035,0,0,7);c.fill();c.stroke();return}if(mood==='angry'||mood==='sad')c.arc(w*.5,h*(y+.045),w*.08,PI*1.15,PI*1.85);else c.arc(w*.5,h*(y-.03),w*.09,PI*.15,PI*.85);c.stroke()};
const KINDS={mouse:['#9aa0aa','round','#f0b8c8'],frog:['#5ab84a','frog','#9ad86a'],hare:['#f2f2f2','long','#f0b8c8'],fox:['#e8742a','point','#fff6ea'],wolf:['#6a7280','point','#c8ccd2'],bear:['#8a5428','round','#e2b884']};
const beast=(kind,mood,body=true)=>(c,w,h)=>{const[col,ears,muz]=KINDS[kind];c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=11;const hy=body?.3:.55,hr=body?.27:.36;
 if(body){c.fillStyle=col;c.beginPath();c.roundRect(w*.24,h*.52,w*.52,h*.44,w*.18);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*.74,w*.13,h*.12,0,0,7);c.fill();c.stroke()}
 c.fillStyle=col;const ey=h*(hy-hr*.75);
 if(ears==='round')for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*hr*.8),ey+h*.03,w*hr*.38,0,7);c.fill();c.stroke()}
 if(ears==='long')for(const s of[-1,1]){c.beginPath();c.ellipse(w*(.5+s*hr*.4),ey-h*hr*.35,w*hr*.17,h*hr*.55,s*.12,0,7);c.fill();c.stroke()}
 if(ears==='point')for(const s of[-1,1]){c.beginPath();c.moveTo(w*(.5+s*hr*.3),ey+h*.04);c.lineTo(w*(.5+s*hr*.8),ey-h*hr*.5);c.lineTo(w*(.5+s*hr*.95),ey+h*.08);c.closePath();c.fill();c.stroke()}
 if(ears==='frog')for(const s of[-1,1]){c.beginPath();c.arc(w*(.5+s*hr*.45),h*(hy-hr*.7),w*hr*.36,0,7);c.fill();c.stroke()}
 c.beginPath();c.arc(w*.5,h*hy,w*hr,0,7);c.fill();c.stroke();c.fillStyle=muz;c.beginPath();c.ellipse(w*.5,h*(hy+hr*.35),w*hr*.45,h*hr*.28,0,0,7);c.fill();c.stroke();
 c.fillStyle=INK;c.beginPath();c.ellipse(w*.5,h*(hy+hr*.22),w*hr*.13,h*hr*.08,0,0,7);c.fill();eyes(c,w,h,hy-hr*.18,mood,hr*.38);c.strokeStyle=INK;mouth(c,w,h,hy+hr*.55,mood)};
const FR=['mouse','frog','hare','fox'];const FCOL={mouse:'#9aa0aa',frog:'#5ab84a',hare:'#e0e0e8',fox:'#e8742a'};
const mkF=(g,moods,sz=1)=>{const o={};[...FR,'wolf','bear'].forEach(k=>{o[k]={};moods.forEach(md=>{const m=drawn((k==='bear'?2.0:1.15)*sz,(k==='bear'?2.4:1.4)*sz,beast(k,md),0,0,0);g.add(m);o[k][md]=m})});return o};
const put=(set,who,mood,x,y,z,t,ph=0)=>{Object.entries(set[who]).forEach(([k,m])=>{m.visible=k===mood;if(k===mood){m.position.set(x,y+Math.abs(Math.sin(t*5+ph))*.03,z);face(m)}})};
const hideAll=(set)=>Object.values(set).forEach(v=>Object.values(v).forEach(m=>m.visible=false));
// ---------- поляна с теремом
const gY=new THREE.Group();
gY.add(Object.assign(plane(200,200,lam('#8ccc5a'),0,0,0,-PI/2),{receiveShadow:true}));
for(let i=0;i<24;i++){const R=rng(500+i);const a=i/24*PI*2+R()*.2,r=10+R()*6;if(Math.sin(a)>.4)continue;const tr=new THREE.Group();tr.add(cyl(.3,2,'#6a4428',0,1,0));const cr=new THREE.Mesh(new THREE.ConeGeometry(1.6+R(),4.4,7),lam(i%3?'#2f8a4a':'#47a84a'));cr.position.y=3.7;cr.castShadow=true;tr.add(cr);tr.position.set(Math.cos(a)*r,0,Math.sin(a)*r-3);gY.add(tr)}
const logTex=canvasTex(512,512,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=i%2?'#a8693a':'#b8783f';c.fillRect(0,i*h/8,w,h/8);c.strokeStyle=INK;c.lineWidth=5;c.beginPath();c.moveTo(0,i*h/8);c.lineTo(w,i*h/8);c.stroke()}});
const ter=new THREE.Group();ter.position.set(0,0,-1.5);gY.add(ter);
const fl1=new THREE.Group(),fl2=new THREE.Group(),rf=new THREE.Group();ter.add(fl1,fl2,rf);
const b1=new THREE.Mesh(new THREE.BoxGeometry(2.8,2.0,2.6),lam('#fff',{map:logTex}));b1.position.y=1.0;b1.castShadow=b1.receiveShadow=true;fl1.add(b1);
const b2=new THREE.Mesh(new THREE.BoxGeometry(2.3,1.6,2.2),lam('#fff',{map:logTex}));b2.position.y=.8;b2.castShadow=b2.receiveShadow=true;fl2.add(b2);fl2.position.y=2.0;
const roof=new THREE.Mesh(new THREE.ConeGeometry(2.0,1.8,4),lam('#d83a2a'));roof.rotation.y=PI/4;roof.position.y=.9;roof.castShadow=true;rf.add(roof);rf.position.y=3.6;
fl1.add(box(.8,1.3,.08,'#6a4428',0,.65,1.32));
const winH=[];const wpos=[[fl1,-.95,1.25,1.33],[fl1,.95,1.25,1.33],[fl2,-.55,.85,1.13],[fl2,.55,.85,1.13]];
wpos.forEach(([gr,x,y,z],i)=>{gr.add(box(.86,.86,.06,'#f3e2b0',x,y,z));gr.add(plane(.7,.7,new THREE.MeshBasicMaterial({color:'#2a2a4a'}),x,y,z+.035));const hd=drawn(.62,.62,beast(FR[i],'happy',false),x,y-.02,z+.06);hd.castShadow=false;gr.add(hd);winH.push(hd)});
const sign=K.stand(1.7,.55,'#fff6d0',[{t:'ДОГОВОР',s:90,y:.55,c:'#15131a'}],0,1.62,1.36);fl1.add(sign);
const Y=mkF(gY,['happy','shock','angry']);
const N=40;const logs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.11,.11,1.1,8),lam('#a8693a'),N);logs.castShadow=true;logs.frustumCulled=false;gY.add(logs);
gY.add(new THREE.HemisphereLight('#ffffff','#9a8a6a',3.1));sunRig(gY,[-8,20,10],[0,0,-1],'#fff1d9',2.6,12);addSet('meadow',gY);
const dm=new THREE.Matrix4();
const meadow=(t,crash,signOn)=>{gY.visible=true;scene.background=SKY;hideAll(Y);sign.visible=!!signOn;const k=clamp(crash||0);
 fl2.position.set(lerp(0,.9,k),lerp(2.0,.15,ss(0,.6,k)),lerp(0,.8,k));fl2.rotation.set(lerp(0,.5,k),0,lerp(0,-.7,k));rf.position.set(lerp(0,-1.6,k),lerp(3.6,.6,ss(0,.7,k)),lerp(0,1.4,k));rf.rotation.set(lerp(0,.9,k),0,lerp(0,1.1,k));
 fl1.scale.y=lerp(1,.45,ss(.2,.8,k));winH.forEach(h=>h.visible=k<.15);logs.visible=k>0;if(k>0){const R=rng(77);for(let i=0;i<N;i++){const a=R()*6.28,sp=1+R()*4;const X=Math.cos(a)*sp*k,Z=-1.5+Math.sin(a)*sp*k+1.2*k,Yy=Math.max(.11,(1+R()*3)*(1-k)+R()*.2+3.5*k*(1-k));dm.makeRotationFromEuler(new THREE.Euler(k*(2+R()*4),R()*6,PI/2+k*R()*3));dm.setPosition(X,Yy,Z);logs.setMatrixAt(i,dm)}logs.instanceMatrix.needsUpdate=true}};
// ---------- комната: складчина
const rM=K.room('rM','#2a4a5a');
const tag=(n,col)=>K.stand(1.5,.75,'#fff',[{t:n,s:150,y:.55,c:col}],0,0,0);
const parts=FR.map((k,i)=>{const b=box(2.0,.75,1.2,FCOL[k],0,0,-2.6);rM.g.add(b);return b});
const top100=tag('100','#15131a'),top60=tag('60','#d02a1a'),t15=tag('15','#d02a1a');rM.g.add(top100,top60,t15);
const stacks=FR.map((k,i)=>{const g=new THREE.Group();for(let j=0;j<5;j++)g.add(cyl(.32,.12,'#ffc93a',0,.07+j*.13,0));const l=K.stand(.9,.5,'#fff',[{t:'25',s:110,y:.55,c:'#15131a'}],0,1.1,0);g.add(l);rM.g.add(g);return g});
const P2=mkF(rM.g,['happy','angry','shock'],.85);
const stackRoom=(t,k,col,u)=>{resetRoom(rM);rM.col(u||0,col||'#2a4a5a');hideAll(P2);parts.forEach(p=>p.visible=false);[top100,top60,t15].forEach(p=>p.visible=false);
 stacks.forEach((g,i)=>{g.visible=true;const x0=-2.1+i*1.4;g.position.set(lerp(x0,0,k),lerp(0,1.2,k)*Math.sin(k*PI),lerp(-.8,-2.6,k));g.scale.setScalar(1-k*.6);g.visible=k<.98});
 FR.forEach((f,i)=>put(P2,f,'happy',-2.1+i*1.4,.6,-.3,t,i));if(k>.9){parts.forEach((p,i)=>{p.visible=true;p.scale.y=1;p.position.set(0,.375+i*.75,-2.6)});top100.visible=true;top100.position.set(0,3.55,-2.6)}};
const shareRoom=(t,v,out,col,u,hareX,moods)=>{resetRoom(rM);rM.col(u||0,col||'#2a4a5a');hideAll(P2);stacks.forEach(g=>g.visible=false);const hp=v/100*.75;
 parts.forEach((p,i)=>{p.visible=true;p.scale.y=hp/.75;let y=hp/2+i*hp,x=0,z=-2.6;if(i===2&&out>0){x=lerp(0,2.0,out);y=lerp(y,hp/2,out);z=lerp(z,-1.6,out)}p.position.set(x,y,z)});
 const tp=out>0?3*hp:4*hp;top100.visible=v>=99;top60.visible=v<99;[top100,top60].forEach(m=>m.position.set(0,tp+.45,-2.6));t15.visible=out>.5;t15.position.set(2.0,hp+.45,-1.6);
 FR.forEach((f,i)=>{if(f==='hare')put(P2,f,moods[1],hareX,.6,-.2,t,i);else put(P2,f,moods[0],-2.3+i*.55,.6,-.6+i*.15,t,i)})};
// ---------- стол сверху: договор вскладчину
const tA=K.makeTable('tA','ДОГОВОР ВСКЛАДЧИНУ',[['КТО СКОЛЬКО ВЛОЖИЛ','мышка 25, лягушка 25...'],['КТО ПЛАТИТ ЗА РЕМОНТ','поровну или по долям'],['ДОЛЯ ПРИ ВЫХОДЕ','по цене вещи сейчас']]);
const pen=new THREE.Group();pen.add(cyl(.09,2.2,'#2a5fc0',0,0,0));pen.rotation.set(PI/2,0,.6);pen.position.set(3.0,.12,1.0);tA.g.add(pen);
const coinsT=new THREE.Group();coinsT.position.set(-3.3,0,-1.5);for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set((i%2)*.9,0,Math.floor(i/2)*.9);for(let j=0;j<3;j++)g.add(cyl(.32,.12,'#ffc93a',0,.07+j*.13,0));coinsT.add(g)}tA.g.add(coinsT);
const top=(u,a0,a1,h0,h1,cx=0,cz=0,fov=58)=>{const a=lerp(a0,a1,u);cam.position.set(cx+Math.sin(a)*.3,lerp(h0,h1,ease(u)),cz+Math.cos(a)*.3);cam.up.set(Math.sin(a),0,-Math.cos(a));cam.lookAt(cx,0,cz);cam.up.set(0,1,0);cam.fov=fov;cam.updateProjectionMatrix()};
const table=(hl,col)=>{tA.g.visible=true;scene.background=new THREE.Color('#e9c58c');tA.hl.forEach((h,i)=>{h.material.opacity=hl[i]?.7:0;h.material.color.set(col||'#ffd23f')})};
// ---------- город
K.billboard(city.g,'3 СТРОЧКИ,','КОТОРЫЕ СПАСУТ ДРУЖБУ',0,9,-26,16,9,'#ffd23f');K.billboard(city.g,'ЗАВТРА','СОБАКА И ЕЁ ТЕНЬ',0,9,24,16,9,'#7dff9a');
// ---------- время
const T=(c)=>cap(c).t,S=(id)=>seg(id).t;const dur=TM.dur;
const ex=T('А если один'),bear=T('Пришёл медведь —'),crash=T('и терем развалился.'),fourT=T('Четверо скинулись'),st100=T('вещь стоит 100.'),god=T('Через год'),v60=T('А вещь стоит 60 —'),d15=T('15.'),tr=T('Тут дружба'),kv=T('Кто сколько вложил.'),rem=T('Кто платит'),dol=T('Как считать долю');
const BB=[...[Y,P2].flatMap(o=>Object.values(o).flatMap(v=>Object.values(v)))];
const shots=[
{id:'hook',t0:0,t1:ex,out:'whipR',f(t,u){meadow(t,0);FR.forEach((f,i)=>put(Y,f,'happy',-1.8+i*1.2,.7,1.6,t,i));camPath(u,[-1.2,1.0,7.8],[0,1.3,6.2],[0,1.6,0],[0,1.7,0],[62,56],.03);
 fx.draw=K.hook(['СКИНУЛИСЬ НА ОБЩЕЕ?','А ЕСЛИ ОДИН УЙДЁТ?'],0,S('s02')-.05)}},
{id:'leave',t0:ex,t1:S('s02'),in:'whipR',out:'whipUp',f(t,u){meadow(t,0);const k=ease(clamp((t-ex)/1.6));FR.forEach((f,i)=>{if(f==='hare')put(Y,f,'angry',lerp(.6,3.4,k),.7,lerp(1.6,.6,k),t,i);else put(Y,f,'shock',-1.8+i*1.2,.7,1.6,t,i)});
 const a=lerp(.5,-.2,u);cam.position.set(Math.sin(a)*6,lerp(1.2,1.6,u),.6+Math.cos(a)*6);cam.lookAt(.4,1.5,.6);cam.fov=60;cam.updateProjectionMatrix();fx.draw=K.hook(['СКИНУЛИСЬ НА ОБЩЕЕ?','А ЕСЛИ ОДИН УЙДЁТ?'],0,S('s02')-.05)}},
{id:'promise',t0:S('s02'),t1:S('s03'),in:'whipUp',out:'whipL',f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-12,6,12],[0,8.5,6],[0,9,-26],[0,9,-26],[62,52],.08*(1-u))}},
{id:'ter',t0:S('s03'),t1:bear,in:'whipL',out:'whipR',f(t,u){meadow(t,0);camPath(u,[2.5,.6,6.5],[.6,2.4,4.4],[0,1.6,-1.5],[0,2.6,-1.5],[60,56],-.04*(1-u));fx.tags=[{txt:'БЕЗ ПРАВИЛ',t:T('звери без правил.'),xy:[.5,.15]}]}},
{id:'bear',t0:bear,t1:S('s04'),in:'whipR',out:'zoom',f(t,u){const k=ss(crash+.1,crash+1.0,t);meadow(t,k);const bk=ease(clamp((t-bear)/.9));put(Y,'bear',k>0?'shock':'happy',lerp(-4,-1.6,bk),1.2,lerp(2.4,1.4,bk),t,0);
 const a=lerp(-.6,.1,u);cam.position.set(Math.sin(a)*8,lerp(2.2,2.8,u),-.6+Math.cos(a)*8);cam.lookAt(-.4,1.7,-.6);cam.fov=58;cam.updateProjectionMatrix();const h=t-crash-.1,sk=h>0?Math.max(0,1-h/.6):0;cam.position.x+=Math.sin(t*53)*.18*sk;cam.position.y+=Math.sin(t*41)*.07*sk;
 if(h>0)fx.flash=Math.max(0,.6-h/.3);fx.tags=t>crash?[{txt:'ТЕРЕМ РАЗВАЛИЛСЯ',t:crash,xy:[.5,.15]}]:[]}},
{id:'chip',t0:S('s04'),t1:st100,in:'zoom',out:'whipL',f(t,u){stackRoom(t,0,'#2a4a5a',0);camPath(u,[-1.6,1.3,3.6],[0,1.7,3.2],[-.6,1.2,-1.2],[0,1.4,-1.4],[72,70],.03);
 fx.tags=[{txt:'ОБЩАЯ ПОКУПКА',t:S('s04')+.05,xy:[.5,.15]},...(t>fourT?[{txt:'4 × 25',t:fourT,xy:[.5,.22]}]:[])]}},
{id:'thing',t0:st100,t1:god,in:'whipL',out:'whipUp',f(t,u){stackRoom(t,ss(st100,st100+.8,t),'#2a5a4a',u);camPath(u,[1.4,1.2,3.6],[.4,1.8,3.0],[0,2.0,-2.6],[0,2.0,-2.6],[70,66],-.03);fx.draw=K.big('ВЕЩЬ = 100',st100+.3,god-.05,'#ffd23f',160,.13)}},
{id:'year',t0:god,t1:v60,in:'whipUp',out:'whipR',f(t,u){const k=ease(clamp((t-T('один уходит'))/1.4));shareRoom(t,100,0,'#2a4a5a',0,lerp(.2,2.4,k),['happy','angry']);
 const a=lerp(.5,-.3,u);cam.position.set(Math.sin(a)*4.6,lerp(1.4,1.8,u),-1.0+Math.cos(a)*4.6);cam.lookAt(.2,1.6,-1.6);cam.fov=68;cam.updateProjectionMatrix();
 fx.tags=[{txt:'ЧЕРЕЗ ГОД',t:god+.05,xy:[.5,.15]},...(t>T('и хочет свои 25.')?[{txt:'«ВЕРНИТЕ МОИ 25!»',t:T('и хочет свои 25.'),xy:[.5,.22]}]:[])]}},
{id:'drop',t0:v60,t1:d15,in:'whipR',out:'whipL',f(t,u){const v=lerp(100,60,ss(v60+.2,v60+1.0,t));shareRoom(t,v,0,'#5a3a2a',ss(0,1,u),2.4,['shock','shock']);
 camPath(u,[-1.8,1.0,3.6],[-.8,1.5,3.0],[0,1.6,-2.6],[0,1.7,-2.6],[72,66],.03);fx.draw=K.big('100 → 60',v60+.2,d15-.05,'#ff8a5a',190,.13)}},
{id:'impact',t0:d15,t1:S('s06'),in:'whipL',out:'whipUp',f(t,u){const h=t-d15;shareRoom(t,60,ss(d15,d15+.35,t),h>.15?'#8a2a2a':'#5a3a2a',ss(.15,.6,h),2.9,['shock','shock']);
 const k=h>.15?Math.max(0,1-(h-.15)/.5):0;camPath(u,[1.6,1.0,3.6],[1.0,1.4,2.6],[.8,1.2,-2.0],[1.0,1.3,-2.0],[72,64],.03);cam.position.x+=Math.sin(t*53)*.2*k;cam.position.y+=Math.sin(t*41)*.07*k;
 if(h>.15){fx.crack={p:[2.0,.05,-1.6],a:clamp((h-.15)*3),seed:9};fx.flash=Math.max(0,1-(h-.15)/.25)}fx.draw=K.big('НЕ 25, А 15',d15+.1,S('s06')-.05,'#ff5a5a',170,.14)}},
{id:'fight',t0:S('s06'),t1:T('Правило:'),in:'whipUp',out:'whipR',f(t,u){meadow(t,1);FR.forEach((f,i)=>put(Y,f,'angry',-2.2+i*1.5,.7,2.6+(i%2)*.3,t,i));camPath(u,[0,7,9],[0,4.5,7.5],[0,.6,0],[0,.8,1.5],[56,60],.05*(1-u));
 fx.tags=[{txt:'ДРУЖБА ТРЕЩИТ',t:tr+.05,xy:[.5,.15]}]}},
{id:'rule',t0:T('Правило:'),t1:kv,in:'whipR',out:'whipUp',f(t,u){table([0,0,0]);top(u,-.6,.2,11.5,9.5,0,0,58);fx.draw=K.big('ДО ПОКУПКИ',T('до покупки'),kv-.05,'#ffffff',150,.13)}},
{id:'c1',t0:kv,t1:dol,in:'whipUp',out:'whipL',f(t,u){table([1,t>rem,0],'#7dff9a');top(u,.3,-.3,7.5,6.6,-.4,-.6,58);fx.tags=[{txt:'1. КТО СКОЛЬКО',t:kv,xy:[.5,.12]},...(t>rem?[{txt:'2. РЕМОНТ',t:rem,xy:[.5,.19]}]:[])]}},
{id:'c3',t0:dol,t1:S('s08'),in:'whipL',out:'whipR',f(t,u){table([1,1,1],'#7dff9a');top(u,-.2,.4,7.0,6.2,0,1.7,58);fx.tags=[{txt:'3. ДОЛЯ ПРИ ВЫХОДЕ',t:dol,xy:[.5,.12]}]}},
{id:'sum',t0:S('s08'),t1:S('s09'),in:'whipR',out:'whipUp',f(t,u){meadow(t,0,true);FR.forEach((f,i)=>put(Y,f,'happy',-1.8+i*1.2,.7,1.8,t,i));const a=lerp(-.5,.4,u);cam.position.set(Math.sin(a)*7,lerp(1.5,2.2,u),-.2+Math.cos(a)*7);cam.lookAt(0,1.7,0);cam.fov=60;cam.updateProjectionMatrix();
 fx.draw=K.big('СНАЧАЛА ДОГОВОР',T('сначала договор —'),S('s09')-.05,'#7dff9a',130,.13)}},
{id:'next',t0:S('s09'),t1:dur,in:'whipUp',out:null,f(t,u){city.g.visible=true;scene.background=SKY;linPath(u,[-26,14,62],[14,11,60],[0,8,24],[0,8.5,24],[58,50],.06*(1-u))}},
];
shots.forEach(s=>{const f=s.f;s.f=function(t,u){f.call(this,t,u);BB.forEach(m=>{if(m.visible)face(m)})}});
return shots};
