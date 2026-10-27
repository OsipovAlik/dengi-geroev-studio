import sys
from scenes import *
from engine import finish, camera
ts = [float(x) for x in sys.argv[1:]] or [0.8]*14
row = []
for i, fn in enumerate(SCENES):
    img, cam = fn(ts[i] * 40, 40.0)
    img = camera(img.convert("RGB"), cam["zoom"], cam["cx"], cam["cy"])
    img = finish(img, i)
    row.append(img.resize((640, 360)))
sheet = Image.new("RGB", (640 * 4, 360 * 4), (0, 0, 0))
for i, im in enumerate(row):
    sheet.paste(im, ((i % 4) * 640, (i // 4) * 360))
sheet.save("t_land.png")
