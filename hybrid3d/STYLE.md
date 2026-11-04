# Деньги героев: Hybrid 3D style (chosen 2026-11-04)
Flat 2D stick characters inside real 3D rooms. A real camera moves through the rooms all the time. Three.js in headless Chromium, 1080x1920, 30 fps. The style language comes from a reference the owner likes; every story, character, set and shot here must be our own, never copied from another channel.

## Look
- Rooms: brick or plain walls with thin ink lines, hard window light with bar shadows on the floor, a soft light shaft, glowing ceiling lamps, flat saturated colour. One story colour idea (for example grey-blue turning gold when the money appears).
- Characters: `Puppet` billboards with thick black outlines and big heads; they always face the camera and cast real shadows on walls and floor. Faces do the acting: `neutral sly smile angry rage shock`.
- Keep motion on the camera. Characters make small pose changes, blink, bob and react.
- Props tell the joke: labels, signs, price tags, cash stacks, logs, stamps, counters.

## Camera and editing
- 15-25 shots a minute, each 1.5-4 s. Every shot has a camera move: low wide push, orbit, crane, side track, top-down rotation, drone arc.
- Nearly stop on the word that matters. Shake on impacts (`cam.position.x+=Math.sin(t*51)*.05`).
- No plain cuts. Each shot has `in` and `out` set to `whipL`, `whipR`, `whipUp` or `zoom`; matching values on neighbours join them. `zoom` is for flying through something real: door, hatch, monitor, keyhole. The first shot has no `in`, the last no `out`.
- Use at least 4 places, one top-down macro of the key object, one drone or big-space shot, one big impact with `fx.crack`, debris and `fx.flash`.
- End hard on the last line with no outro.

## Captions and safe zones
1-3 words, Inter 800 white with a dark outline, centred at y=1344. Keep faces, signs and graphics out of y 1260-1430 and the right 130 px below y 1100 (YouTube buttons).

## Story folder: stories/NN_slug/
- `script.json`: `[["s01","Фраза для озвучки, числа словами.",["Подпись","по словам","3 месяца?"]], ...]`. Chunk text must be unique in the video if used as a time anchor.
- `shots.js`: `export default (E)=>{ const {...}=E; ...build sets once...; return [{id,t0,t1,in,out,f(t,u){...}},...] }`. Shots must cover 0 to `TM.dur` without gaps. `u` runs 0-1 through the shot. Everything must be a pure function of `t`; use `rng(seed)`, never `Math.random` or `Date.now`.
- `sound.json`: `{"music":{"calm":[[A,B]],"stop":A,"stop_len":1.3},"cues":[{"at":A,"fx":"thud","d":.3,"f":85,"g":.9}]}`. A = seconds, `{"cap":"Caption chunk","off":.1}` or `{"seg":"s03","k":"t"|"e","off":0}`. fx: whoosh thud tick crack rumble debris roller glug clink coin ping pluck; `n` + `every` repeat a cue. Shot transitions get whooshes automatically.
`stories/01_pink` is the worked example: learn the API from it, never reuse its shots.

## API (E)
- Time: `cap("chunk").t`, `seg("s01").t/.e`, `TM.dur`; `ss lerp clamp ease rng`.
- Camera: `camPath(u,p0,p1,look0,look1,fov,roll)` eased, `linPath` linear. `fov` may be `[a,b]`.
- Build: `box(w,h,d,col,x,y,z)`, `cyl(r,h,col,x,y,z)`, `plane(w,h,mat,x,y,z,rx,ry)`, `lam(col,opts)`, `label(w,h,bg,[{t,s,y,c}],{border,bw})` (a text texture), `canvasTex(w,h,draw)`, `addSet(name,group)`, `sunRig(group,pos,target,col,int,size)`. Add new sets at the top of `shots.js`, hide them with `g.visible=false` via `addSet`, and show them in `f`.
- Rooms: `makeCell(name)` returns a brick room 6 wide x 8 deep x 4.3 high with window, bench and lamp. Call `resetRoom(room)` first in each `f`, then `room.color(u,fromColor,toColor)`. Also `room.pback`, `room.maskC`, `room.mt` with `paintMask` for walls changing colour in strokes, `room.debris`, `room.divider`.
- Ready sets: `corr` (corridor with 6 doors, `corr.doors[i].pivot.rotation.y`, `.im`, `.lp`), `desk` (top-down table; hide what you don't use), `city` (drone landscape, `scene.background=SKY`, `city.blocks[i].roof`), `booth` (night desk with monitor).
- People: `new Puppet(kind,heightMetres)` then `scene.add(p.m)`. Kinds: `man woman big researcher officer officer2 inmate player`. Call `p.hide()` for your own puppets at the top of `f`; `E.P` puppets hide automatically. `p.pose(x,z,{expr,look,blink,talk,aL,aR,propL,propR,propA,col,hair,tie,lean,tilt,walk,sit,tint,tag,red},y)`. Arms are `[shoulderAngle,elbowBend]`: 0 is down, 2.4 is overhead. Props: `cash bag phone key card cup clip roller`.
- Overlays: `fx.crack={p:[x,y,z],a:0..1,seed}`, `fx.flash=0..1`, `fx.watch={v,max,x,y,lab:'МИН'}`, `fx.tags=[{txt,t,xy:[.3,.2]}]`, `fx.bars={v,rise,labels:['А','Б']}`, `fx.draw=(C,W,H,t,toScreen)=>{}` for any 2D graphic on a 1080x1920 canvas.

## Commands (from this folder)
npm i three@0.170.0 @fontsource/inter; export NODE_PATH=$(npm root -g)
/home/claude/tts_venv/bin/python tts_ru.py stories/NN dmitry     # vo.wav + timing.json; may retry for a long time
node render.cjs --story stories/NN --gw 360 --gh 640 --sm 1024 --stills 1,5,9     # out/stills/*.jpg, about 0.5 s each
node render.cjs --story stories/NN --shots id1,id2     # re-render one shot after deleting nothing else
bash build.sh stories/NN OUT.mp4     # about 1.1 s per frame on 2 cores, resumes finished shots; run in background

## Russian text
All on-screen text is Russian, passed explicitly to `label`, `fx.tags`, `fx.watch.lab`, `fx.bars.labels` and `fx.draw`. `stories/01_pink` is in English only because it is an API example. Heroes are drawn with `man woman big` plus props and colours, or with your own 2D drawing in `shots.js`; public-domain characters only, drawn originally, never copied from film adaptations.

## Rules learned
- Check whether the camera sits inside an object; backfaces vanish.
- Lambert light needs hemisphere intensity about 3.4 for bright flat colour.
- `box` with a shadow-casting wall between sun and room blocks the window light.
- Cracks and overlays go in `fx`, which resets every frame.
- Look at transitions at `t1-.1` and `t0+.05`, not only mid-shot.
