const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const ROOT=__dirname;const A=process.argv.slice(2);const arg=(k,d)=>{const i=A.indexOf('--'+k);return i>=0?A[i+1]:d};
// usage: node render.cjs --story stories/NN_slug [--stills 1,2,3] [--shots id,id]
const types={'.js':'text/javascript','.json':'application/json','.html':'text/html','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{const p=decodeURIComponent(q.url.split('?')[0]);if(p==='/page.html'){r.setHeader('content-type','text/html');return r.end('<!doctype html><body style="margin:0;background:#000"><script type="module" src="/core.js'+q.url.slice(q.url.indexOf('?'))+'"></script>')}const f=path.join(ROOT,p);if(!fs.existsSync(f)){r.statusCode=404;return r.end()}r.setHeader('content-type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)}).listen(0,async()=>{const port=srv.address().port;
const story=arg('story');const OUT=path.join(ROOT,story,'out');fs.mkdirSync(OUT,{recursive:true});const gw=+arg('gw',810),gh=+arg('gh',1440),w=+arg('w',1080),h=+arg('h',1920),fps=+arg('fps',30);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:400,height:400}});
p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('ERR',m.text().slice(0,300))});
await p.goto(`http://localhost:${port}/page.html?gw=${gw}&gh=${gh}&w=${w}&h=${h}&sm=${arg('sm',1536)}&story=${story}`);await p.waitForFunction('window.READY===true',{timeout:120000});
const shots=await p.evaluate('window.SHOTS');fs.writeFileSync(path.join(OUT,'shots.json'),JSON.stringify(shots));
const stills=arg('stills');
if(stills){const dir=arg('dir',path.join(OUT,'stills'));fs.mkdirSync(dir,{recursive:true});for(const t of stills.split(',').map(Number)){const t0=Date.now();const id=await p.evaluate(x=>window.renderAt(x),t);const d=await p.evaluate(()=>window.grab(.88));fs.writeFileSync(`${dir}/${t.toFixed(2).padStart(6,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'));console.log(t,id,Date.now()-t0,'ms')}await b.close();srv.close();return}
const only=arg('shots');fs.mkdirSync(path.join(OUT,'shots'),{recursive:true});let frame=0;
for(const [i,s] of shots.entries()){const name=path.join(OUT,'shots',`${String(i).padStart(2,'0')}_${s.id}.mp4`);if(only&&!only.split(',').includes(s.id))continue;if(!only&&fs.existsSync(name))continue;
 const f0=Math.round(s.t0*fps),f1=Math.round(s.t1*fps);const tmp=name.replace('.mp4','.tmp.mp4');const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',String(fps),tmp],{stdio:['pipe','inherit','inherit']});const T=Date.now();
 for(let k=f0;k<f1;k++){await p.evaluate(x=>window.renderAt(x),(k+.5)/fps);const d=await p.evaluate(()=>window.grab(.94));const buf=Buffer.from(d.split(',')[1],'base64');if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
 ff.stdin.end();const code=await new Promise(r=>ff.on('close',r));if(code===0)fs.renameSync(tmp,name);console.log(s.id,f1-f0,'frames',((Date.now()-T)/1000).toFixed(0)+'s',((Date.now()-T)/(f1-f0)).toFixed(0)+'ms/f');}
await b.close();srv.close()});
