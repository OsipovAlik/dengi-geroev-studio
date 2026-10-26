"""Oblomov (Goncharov) - lounging landowner in a dressing gown on the shared Watson rig, own palette."""
import chars as C
from chars import *

OBL = dict(
    coat=(150, 70, 60, 255), coat_dk=(120, 52, 46, 255), vest=(236, 226, 200, 255),
    trousers=(190, 176, 150, 255), shirt=WHITE, tie=(236, 226, 200, 255), hair=(96, 66, 44, 255),
    stache=(96, 66, 44, 255), hat=(60, 40, 90, 255), eye=(110, 90, 60, 255), shoe=(150, 70, 60, 255))


def draw_oblomov(ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    try:
        C.WATSON.update(OBL)
        C.W_CFG.update(brow=(96, 66, 44, 255), eye=OBL["eye"], hair=OBL["hair"], stache=OBL["stache"], hat=OBL["hat"])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)
