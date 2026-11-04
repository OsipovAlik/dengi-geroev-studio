export default (E)=>{const {THREE,TM,scene,cam,fx,SKY,INK,PINK,PINK2,TEAL,clamp,lerp,ss,ease,rng,seg,cap,cell,corr,desk,city,locker,booth,P,paintMask,camPath,linPath,swirl,blink,resetCell}=E;
const S1=seg('s01'),S2=seg('s02'),S3=seg('s03'),S4=seg('s04'),S5=seg('s05'),S6=seg('s06'),S7=seg('s07'),S8=seg('s08'),S9=seg('s09'),S10=seg('s10'),S11=seg('s11'),S12=seg('s12'),S13=seg('s13');
const tBreak=(txt)=>cap(txt).t;
const shots=[
{id:'a_door',t0:0,t1:tBreak('let a researcher')-.05,out:'zoom',f(t,u){corr.g.visible=true;corr.sign.position.x=0;corr.swiss.visible=false;corr.doors.forEach((d,i)=>{d.pivot.rotation.y=0;d.im.color.set('#7d9aa8');d.lp.intensity=0});corr.hemi.intensity=2.3;corr.sun.intensity=1.8;
  linPath(Math.pow(u,1.5),[1.6,.75,10.5],[0,1.87,1.1],[0,3.1,0],[0,1.85,0],[62,44],-.03*(1-u))},grade:{mul:'#c9d9ea',a:.38}},
{id:'b_card',t0:tBreak('let a researcher')-.05,t1:S1.e+.14,in:'zoom',out:'whipR',f(t,u){resetCell();cell.color(0);const up=ss(.15,.5,u);
  P.res.pose(.3,.2,{expr:up>.6?'sly':'neutral',look:-.3,aR:[lerp(.2,1.5,up),lerp(.15,1.2,up)],aL:[.15,.25],propR:up>.15?'card':null,blink:blink(t),talk:0,bob:Math.sin(t*2)*3});
  camPath(u,[-2.2,.55,3.6],[-1.1,.85,2.1],[.2,1.7,-.5],[.5,2.25,0],[66,56],.05)}},
{id:'c_rage',t0:S1.e+.14,t1:S2.e+.15,in:'whipR',out:'whipR',f(t,u){resetCell();cell.color(0);const off=clamp((t-tBreak('could switch off')-.72)/.25);const r=1-off;
  const shake=r*.06;P.inm.pose(-.95,-1.2,{expr:off>.5?'neutral':'rage',red:r,aL:[1.5*r+.2,-2.2*r],aR:[1.5*r+.2,-2.2*r],lean:Math.sin(t*31)*.02*r,blink:off>.5&&blink(t)});
  P.res.pose(1.45,.7,{expr:'sly',look:-1,aR:[.2,.2],aL:[1.2,1.4],propL:'card',blink:blink(t,.3)});
  camPath(u,[1.9,.42,3.8],[.6,.5,3.2],[-.1,1.9,-1],[-.2,2.15,-1],[72,66],.03+Math.sin(t*43)*shake*.2);cam.position.x+=Math.sin(t*51)*shake;
  fx.crack={p:[-.95,2.1,-1.2],a:r*clamp((t-(S1.e+.14))/1.1),seed:4};cell.hemi.color.set(new THREE.Color('#fff').lerp(new THREE.Color('#ff9a9a'),r*.6))},grade:null},
{id:'d_mix',t0:S2.e+.15,t1:S3.e+.14,in:'whipR',out:'whipUp',f(t,u){desk.g.visible=true;desk.paper.visible=false;desk.stamp1.visible=false;desk.stamp2.visible=false;desk.chip.visible=false;desk.can.visible=true;desk.mat.visible=true;
  const pour0=tBreak('of red.')-.2,pour1=tBreak('He called it')-.1;const pu=clamp((t-pour0)/(pour1-pour0));const lift=ss(0,.2,pu)*(1-ss(.8,1,pu));
  desk.small.position.set(lerp(2,1.05,lift),lerp(.4,3.1,lift),lerp(-1.8,-.3,lift));desk.small.rotation.set(lift*-.1,0,lift*1.9);
  const inFlow=lift>.8;desk.stream.visible=inFlow;if(inFlow){const a=new THREE.Vector3(.72,2.92,-.26),b=new THREE.Vector3(.38,2.05,-.1),c=new THREE.Vector3(.12,1.44,0);const cur=new THREE.CatmullRomCurve3([a,b,c]);desk.stream.geometry.dispose();desk.stream.geometry=new THREE.TubeGeometry(cur,18,.05,10,false)}
  swirl(pu,t*1.4);desk.stir.visible=false;desk.lab.visible=t>tBreak('P-618.')-.1;const ls=ss(tBreak('P-618.')-.1,tBreak('P-618.')+.12,t);desk.lab.scale.setScalar(lerp(1.9,.95,ls));
  const a=t*.14;linPath(u,[.0,11.5,3.6],[.4,5.6,1.9],[.1,1,.1],[.2,1.4,.25],56,.4-u*.55)},grade:null},
{id:'e_paint',t0:S3.e+.14,t1:S4.e+.15,in:'whipUp',out:'whipL',f(t,u){resetCell();const p0=S4.t+.2,p1=S4.e-.25,pr=ease(clamp((t-p0)/(p1-p0)));cell.color(0);cell.pback.visible=true;cell.pL.visible=true;paintMask(cell.maskC,clamp(pr*1.8),3);cell.mt.needsUpdate=true;paintMask(cell.maskC2,clamp(pr*2-.8),8,20);cell.mt2.needsUpdate=true;
  const sb=Math.sin(t*5.2);const tgt1=tBreak('Baker'),tgt2=tBreak('and Miller,');
  P.off.pose(-1.2,-1.9,{expr:'neutral',tag:'BAKER',look:-.3,aR:[2.4+sb*.25,.35],propR:'roller',propA:-.15+sb*.15,aL:[.2,.2],blink:blink(t),bob:sb*4});
  P.off2.pose(1.2,-1.5,{expr:'sly',tag:'MILLER',look:.2,aL:[2.4-sb*.25,.35],propL:'roller',propA:.1,aR:[.2,.2],blink:blink(t,.6),bob:-sb*4});
  fx.tags=[{txt:'BAKER',t:tgt1,xy:[.27,.19]},{txt:'MILLER',t:tgt2,xy:[.73,.19]}];
  camPath(u,[-1.3,.42,3.8],[.8,.62,3.0],[.3,2.2,-3],[-.2,2.05,-3],[68,74],-.06+u*.12)},grade:null},
{id:'f_walkin',t0:S4.e+.15,t1:tBreak('After about')-.04,in:'whipL',out:'zoom',f(t,u){corr.g.visible=true;corr.swiss.visible=false;corr.sign.position.x=-40;const d=corr.doors[2];corr.doors.forEach((x,i)=>{x.pivot.rotation.y=i===2?-1.75:0;x.im.color.set(i===2?PINK:'#7d9aa8');x.lp.intensity=i===2?3.5:0;x.lp.color.set('#ff9ccb')});corr.hemi.intensity=3.4;corr.sun.intensity=2.6;const X=0;
  const w=Math.sin(t*9);const zz=lerp(3.1,.5,ss(0,.9,u));const xx=lerp(-1.5,0,ss(.2,.95,u));
  P.inm.pose(xx,zz,{expr:'angry',aL:[1.1,-1.3],aR:[1.1,-1.3],walk:w,blink:false,lean:Math.sin(t*9)*.03});
  P.off.pose(xx-1.45,zz+.2,{expr:'neutral',aR:[1.1,.5],aL:[.2,.2],walk:-w,look:1,blink:blink(t)});P.off2.pose(xx+1.45,zz+.3,{expr:'sly',aL:[1.1,.5],aR:[.2,.2],walk:w,look:-1,blink:blink(t,.5)});
  fx.lock=1;
  camPath(u,[-2.2,.7,9],[.1,1.4,3.6],[-.4,2,0],[0,1.65,-1.2],[58,52],.03)},grade:null},
{id:'g_calm',t0:tBreak('After about')-.04,t1:S5.e+.15,in:'zoom',out:'whipR',f(t,u){resetCell();cell.color(1);cell.hemi.intensity=3.5;const cal=ss(.3,.82,u);const r=1-cal;const sit=cal>.72?1:0;const sw=clamp(u/.92);
  P.inm.pose(sit?-2.05:-.2,sit?.2:-.8,{expr:sit?'smile':cal>.45?'angry':'rage',red:r,sit,aL:[1.2*r+.2,-2*r],aR:sit?[.65,1.5]:[1.2*r+.2,-2*r],propR:sit?'cup':null,lean:Math.sin(t*33)*.018*r,blink:false});
  camPath(u,[1.6,.5,3.3],[.4,.75,1.9],[-.3,2,-1],[-1.5,1.2,0],[70,58],-.05+.05*u);cam.position.x+=Math.sin(t*47)*.04*r;
  fx.crack={p:sit?[-2.05,2,.2]:[-.2,2.1,-.8],a:r*1.1,seed:9};fx.watch={v:sw*15,max:15,x:.76,y:.17,lab:'MIN'};},grade:null},
{id:'h_log',t0:S5.e+.15,t1:S6.e+.2,in:'whipR',out:'whipUp',f(t,u){desk.g.visible=true;desk.can.visible=false;desk.small.visible=false;desk.stream.visible=false;desk.stir.visible=false;desk.lab.visible=false;desk.mat.visible=false;desk.chip.visible=false;desk.paper.visible=true;
  const a=tBreak('No outbursts.')+.1,b=tBreak('No attacks.')+.1;for(const[k,tt]of[[desk.stamp1,a],[desk.stamp2,b]]){k.visible=t>tt;const s=ss(tt,tt+.1,t);k.scale.setScalar(lerp(2.4,1,s));k.rotation.z=-.08}const hit=Math.max(1-(t-a)/.2,0)*(t>a?1:0)+Math.max(1-(t-b)/.2,0)*(t>b?1:0);
  linPath(u,[-.3,9.6,2.0],[.1,7.4,1.6],[0,0,.75],[.1,0,.85],50,-.14+u*.16);cam.position.y-=hit*.45},grade:null},
{id:'i_chip',t0:S6.e+.2,t1:tBreak('Jails.')-.04,in:'whipUp',out:'zoom',f(t,u){desk.g.visible=true;desk.can.visible=false;desk.small.visible=false;desk.stream.visible=false;desk.lab.visible=false;desk.mat.visible=false;desk.paper.visible=false;desk.stamp1.visible=false;desk.stamp2.visible=false;desk.stir.visible=false;desk.chip.visible=true;const e=ss(0,.35,u);desk.chip.position.set(0,lerp(9,.35,e),lerp(-3,-1.15,e));desk.chip.scale.setScalar(.8);desk.chip.rotation.set(-Math.PI/2+.5*(1-e)+Math.sin(t*1.4)*.03,0,-.5*(1-e)+.08);
  const up=ss(.7,1,u);linPath(u,[.4,6.5,1.4],[0,6.1,.5],[0,0,0],[0,0,0],56);cam.position.y+=up*up*22},grade:null},
{id:'j_city',t0:tBreak('Jails.')-.04,t1:tBreak('A football coach')-.04,in:'zoom',out:'whipR',f(t,u){city.g.visible=true;const wave=lerp(-8,158,clamp((t-(tBreak('Jails.')))/(tBreak('A football coach')-tBreak('Jails.')-.1)));city.blocks.forEach(b=>{b.roof.color.set(b.r<wave?'#f0559c':'#8c98a0')});scene.background=SKY;linPath(u,[-34,56,50],[26,38,40],[0,0,-14],[5,0,-12],58,-.12+u*.2)},grade:null},
{id:'k_locker',t0:tBreak('A football coach')-.04,t1:S8.e+.15,in:'whipR',out:'whipL',f(t,u){resetCell();cell.color(1,TEAL,PINK2);locker.visible=true;P.ply.pose(.05,-.75,{expr:'neutral',sit:1,tilt:.08,look:.3,aL:[.55,1.3],aR:[.55,1.3],blink:((t*.5)%1)<.5},.55);P.res.pose(-1.45,-2.6,{expr:'sly',aR:[2.4,.35],propR:'roller',blink:blink(t),look:.5});P.off.hide();camPath(u,[1.5,1.7,3.8],[-.5,1.15,3.5],[0,1.75,-1],[0,1.9,-1],[70,66],.05)},grade:null},
{id:'l_doors',t0:S8.e+.15,t1:S9.e+.15,in:'whipL',out:'whipUp',f(t,u){corr.g.visible=true;corr.sign.position.x=-40;corr.swiss.visible=true;corr.swiss.position.x=9;corr.swiss.position.y=2.75;corr.doors.forEach((d,i)=>{const pk=i===4;d.pivot.rotation.y=pk?-1.75:0;d.im.color.set(pk?PINK:'#7d9aa8');d.lp.intensity=pk?3.5:0;d.lp.color.set('#ff9ccb')});corr.hemi.intensity=3.4;corr.sun.intensity=2.6;const X=lerp(-12,12,ease(clamp(u*1.04)));cam.position.set(X-.2,1.9,lerp(6,4.9,u));cam.lookAt(X+.3,1.8,0);cam.fov=58;cam.rotateZ(-.03);cam.updateProjectionMatrix()},grade:null},
{id:'m_booth',t0:S9.e+.15,t1:tBreak('15 minutes?')-.03,in:'whipUp',out:'zoom',f(t,u){booth.g.visible=true;P.off.pose(-1.65,-.25,{expr:'sly',tag:'',look:1,aR:[.5,1.3],aL:[.3,.5],blink:blink(t),tint:'#8ea2ff'});const up=Math.pow(ss(.55,1,u),2);
  cam.position.set(lerp(-2.4,.2,up+u*.22),lerp(3.8,2.25,ss(0,.6,u)),lerp(6.2,.42,Math.max(up,u*.24)));cam.lookAt(lerp(-.8,.2,ss(0,.7,u)),lerp(2.8,2.25,ss(0,.7,u)),-.2);cam.fov=52;cam.rotateZ(.04*(1-u));cam.updateProjectionMatrix()},grade:null},
{id:'n_flip',t0:tBreak('15 minutes?')-.03,t1:S10.e+.2,in:'zoom',out:'whipR',f(t,u){resetCell();cell.color(1);cell.hemi.intensity=3.5;const f0=tBreak('It flipped.');const fl=ss(f0-.02,f0+.32,t);const calm=t<f0;
  P.inm.pose(calm?-2.05:lerp(-2.05,-.3,fl),calm?.2:lerp(.2,-.8,fl),{expr:calm?'smile':'rage',red:fl,sit:calm?1:0,aR:calm?[.65,1.5]:[1.6,-2.3],aL:calm?[.2,.4]:[1.6,-2.3],propR:calm?'cup':null,lean:Math.sin(t*33)*.02*fl});
  camPath(u,[1.3,.72,2.9],[.75,.42,3.15],[-1.5,1.25,0],[-.45,2.0,-.8],[58,70],fl*.05);cam.position.x+=Math.sin(t*53)*.06*fl;cam.position.y+=Math.sin(t*41)*.05*fl;
  fx.crack={p:[calm?-2.05:lerp(-2.05,-.3,fl),2.05,-.6],a:fl*1.25,seed:17};const v=lerp(15,20,clamp((t-tBreak('20 minutes?'))/.75));fx.watch={v,max:20,x:.76,y:.17,lab:'MIN'};
  const b0=f0+.1;const m=new THREE.Matrix4();const R=rng(41);const dd=t-b0;cell.debris.visible=dd>0;if(dd>0){for(let i=0;i<46;i++){const side=R()<.5?-1:1;const a=R()*6.28;const sp=2.2+R()*4;const X=-.3+Math.cos(a)*sp*dd,Y=clamp(1+R()*3+(2.4*dd-3.4*dd*dd),.12,4.1),Z=-1.2+Math.sin(a)*sp*dd;const rr=new THREE.Euler(dd*(3+R()*4),dd*2,dd*R()*4);m.makeRotationFromEuler(rr);m.setPosition(clamp(X,-2.8,2.8),Y,clamp(Z,-3.7,3.7));cell.debris.setMatrixAt(i,m)}cell.debris.instanceMatrix.needsUpdate=true}fx.flash=Math.max(0,1-(t-f0)/.22)*(t>f0?1:0)},grade:null},
{id:'o_split',t0:S10.e+.2,t1:S12.t-.02,in:'whipR',out:'whipUp',f(t,u){resetCell();cell.color(0,TEAL,PINK);cell.divider.visible=true;cell.pback.visible=true;cell.pL.visible=true;paintMask(cell.maskC,.5,2,2);const c=cell.maskC.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,512,360);c.fillStyle='#fff';c.fillRect(0,0,256,360);cell.mt.needsUpdate=true;const c2=cell.maskC2.getContext('2d');c2.fillStyle='#fff';c2.fillRect(0,0,512,360);cell.mt2.needsUpdate=true;
  const d=clamp((t-tBreak('for three days.'))/.7);cell.sun.position.set(lerp(-4,6,d),7.2,-10);
  P.inm.pose(-1.25,-1.5,{expr:'angry',aL:[.9,-1.3],aR:[.9,-1.3],num:'A-29',blink:false});P.inm2.pose(1.25,-1.5,{expr:'angry',aL:[.9,-1.3],aR:[.9,-1.3],num:'B-30',blink:false});
  camPath(u,[0,3.3,3.9],[0,1.05,3.8],[0,1.6,-2],[0,2.1,-2],[64,72],0);fx.split=clamp((t-tBreak('59 prisoners'))/.2);},grade:null},
{id:'p_bars',t0:S12.t-.02,t1:S12.e+.15,in:'whipUp',out:'whipL',f(t,u){resetCell();cell.color(0);cell.divider.visible=true;cell.pback.visible=true;cell.pL.visible=true;const c=cell.maskC.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,512,360);c.fillStyle='#fff';c.fillRect(0,0,256,360);cell.mt.needsUpdate=true;const c2=cell.maskC2.getContext('2d');c2.fillStyle='#fff';c2.fillRect(0,0,512,360);cell.mt2.needsUpdate=true;
  const drop=ss(.05,.5,u);const ex=drop>.55?'neutral':'angry';P.inm.pose(-1.25,-1.5,{expr:ex,aL:[.9*(1-drop)+.15,-1.3*(1-drop)],aR:[.9*(1-drop)+.15,-1.3*(1-drop)],num:'A-29',blink:drop>.55&&blink(t)});P.inm2.pose(1.25,-1.5,{expr:ex,aL:[.9*(1-drop)+.15,-1.3*(1-drop)],aR:[.9*(1-drop)+.15,-1.3*(1-drop)],num:'B-30',blink:drop>.55&&blink(t,.5)});
  fx.bars={v:lerp(.92,.42,drop),rise:ss(0,.09,u),labels:['PINK','GRAY']};camPath(u,[-.5,1,3.9],[.5,1.05,3.3],[-.1,2.1,-2],[.1,2.25,-2],[72,76],Math.sin(u*3)*.03)},grade:null},
{id:'q_end',t0:S12.e+.15,t1:TM.dur,in:'whipL',out:null,f(t,u){resetCell();cell.color(0);cell.pback.visible=true;cell.pL.visible=false;paintMask(cell.maskC,.46,12);cell.mt.needsUpdate=true;cell.sun.intensity=2.4;
  const shrug=ss(cap('a thing.').t-.1,cap('a thing.').t+.15,t);P.res.pose(1.05,-1.9,{expr:u>.55?'neutral':'sly',look:-.85,aR:[lerp(.45,1.35,shrug),lerp(.3,-1.5,shrug)],propR:'roller',propA:0,aL:[lerp(.22,1.35,shrug),lerp(.2,-1.5,shrug)],tilt:u>.55?-.05:0,blink:blink(t)});
  camPath(u,[1.1,1.7,1.6],[.55,1.15,3.8],[.2,2.2,-3],[.1,2.15,-3],[52,70],.02)},grade:null},
];
return shots};
