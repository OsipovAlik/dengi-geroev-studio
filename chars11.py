"""Khlestakov (Gogol, The Government Inspector) and Robinson Crusoe (Defoe) on the shared Watson rig, own palettes."""
import chars as C
from chars import *

KHLEST = dict(
    coat=(60, 100, 150, 255), coat_dk=(44, 78, 120, 255), vest=(236, 214, 120, 255),
    trousers=(214, 206, 188, 255), shirt=WHITE, tie=(190, 50, 60, 255), hair=(190, 150, 80, 255),
    stache=(190, 150, 80, 255), hat=(40, 36, 40, 255), eye=(80, 120, 150, 255), shoe=(36, 28, 24, 255))
ROBIN = dict(
    coat=(120, 84, 52, 255), coat_dk=(92, 62, 38, 255), vest=(170, 130, 84, 255),
    trousers=(110, 86, 60, 255), shirt=(226, 214, 186, 255), tie=(170, 130, 84, 255), hair=(80, 56, 38, 255),
    stache=(80, 56, 38, 255), hat=(150, 110, 60, 255), eye=(90, 70, 50, 255), shoe=(70, 50, 34, 255))


def _draw(pal, brow, ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    try:
        C.WATSON.update(pal)
        C.W_CFG.update(brow=brow, eye=pal["eye"], hair=pal["hair"], stache=pal["stache"], hat=pal["hat"])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)


def draw_khlestakov(ctx, pose):
    _draw(KHLEST, (150, 110, 60, 255), ctx, pose)


def draw_robinson(ctx, pose):
    _draw(ROBIN, (70, 50, 34, 255), ctx, pose)
