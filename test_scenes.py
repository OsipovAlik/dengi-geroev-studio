import sys, time
from scenes import *
from engine import finish, camera
ts = [float(x) for x in sys.argv[1:]] or [0.5]*7
row=[]
for i,fn in enumerate(SCENES):
    t0=time.time()
    img, cam = fn(ts[i]*7, 7.0)
    img = camera(img.convert("RGB"), cam["zoom"], cam["cx"], cam["cy"])
    img = finish(img, i)
    print(i, round(time.time()-t0,2))
    row.append(img.resize((360,640)))
sheet = Image.new("RGB",(360*4,640*2),(0,0,0))
for i,im in enumerate(row): sheet.paste(im,((i%4)*360,(i//4)*640))
sheet.save("t_scenes.png")
