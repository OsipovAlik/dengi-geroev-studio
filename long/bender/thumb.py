import os,sys
os.environ['LANDSCAPE']='1'
sys.path.insert(0,'/home/claude/long1');sys.path.insert(0,'/home/user/dengi-geroev-studio/story_engine')
from shots import *
from PIL import Image
s,c=surf(W,H)
rect(c,0,0,W,H,rg(1250,450,60,1500,[(0,'#2f5fd0'),(.55,'#14285f'),(1,'#070d26')]))
# rays
for i in range(14):
    c.save();c.translate(1330,520);c.rotate(i*math.pi/7);poly(c,[(0,0),(1800,-70),(1800,70)],(1,.85,.3,.07),None);c.restore()
# phone with x1,5
phone(c,420,760,1.35,1,0,[]);
text(c,'×1,5',420,720,120,'#ffd23f',stroke=INK,sw=14);text(c,'ЗА МЕСЯЦ!',420,810,52,'#ffffff',stroke=INK,sw=8)
# Bender
bender(c,1450,1120,1.75,1,mouth='grin',eyes='normal',look=(-.4,-.1),hl=(-200,-300),hr=(190,-420),wink=True)
# text
text(c,'5 СХЕМ',560,200,170,'#ffd23f',stroke=INK,sw=26,center=True)
text(c,'БЕНДЕРА',620,370,215,'#ffffff',stroke=INK,sw=28)
rect(c,1000,930,860,120,'#e02a2a',INK,10);text(c,'ТЫ НЕ ПОПАДЁШЬСЯ',1430,1014,72,'#ffffff')
s.flush();arr=np.ndarray((H,W,4),np.uint8,s.get_data()).copy()
Image.fromarray(arr[...,[2,1,0]]).resize((1280,720),Image.LANCZOS).save('/home/claude/out/thumb_bender.jpg',quality=92)
