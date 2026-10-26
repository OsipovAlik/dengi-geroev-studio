"""Onegin's father (Pushkin, Eugene Onegin) - old landowner on the shared Watson rig, own palette."""
import chars as C
from chars import *

SENIOR = dict(
    coat=(46, 86, 78, 255), coat_dk=(34, 64, 58, 255), vest=(176, 140, 70, 255),
    trousers=(226, 220, 200, 255), shirt=WHITE, tie=(200, 60, 52, 255), hair=(232, 230, 226, 255),
    stache=(232, 230, 226, 255), hat=(30, 28, 30, 255), eye=(90, 110, 130, 255), shoe=(30, 24, 20, 255))
_SRC = {k: dict(v) for k, v in (("W", C.WATSON),)}["W"]
_CFG0 = dict(C.W_CFG)


def draw_senior(ctx, pose):
    saved, scfg = dict(C.WATSON), dict(C.W_CFG)
    try:
        C.WATSON.update(SENIOR)
        C.W_CFG.update(brow=(190, 188, 184, 255), eye=SENIOR["eye"], hair=SENIOR["hair"], stache=SENIOR["stache"], hat=SENIOR["hat"])
        C.draw_watson(ctx, pose)
    finally:
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)
