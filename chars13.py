"""Gobsek (Balzac) and Tom Sawyer (Twain) on the shared Watson rig, own palettes. Original storybook designs."""
import chars as C
from chars import *

GOBSEK = dict(
    coat=(70, 62, 52, 255), coat_dk=(52, 46, 38, 255), vest=(150, 140, 110, 255),
    trousers=(60, 56, 50, 255), shirt=WHITE, tie=(150, 140, 110, 255), hair=(190, 186, 176, 255),
    stache=(190, 186, 176, 255), hat=(38, 32, 28, 255), eye=(120, 130, 120, 255), shoe=(30, 24, 20, 255))
TOM = dict(
    coat=(196, 160, 100, 255), coat_dk=(160, 126, 78, 255), vest=(120, 140, 170, 255),
    trousers=(90, 110, 150, 255), shirt=WHITE, tie=(190, 60, 52, 255), hair=(170, 110, 60, 255),
    stache=(170, 110, 60, 255), hat=(226, 196, 110, 255), eye=(80, 120, 160, 255), shoe=(110, 80, 56, 255))


def _draw(pal, brow, nostache, ctx, pose):
    saved, scfg, face0 = dict(C.WATSON), dict(C.W_CFG), C.face

    def face_nomustache(ctx_, pose_, cfg_, kind):
        face0(ctx_, pose_, cfg_, kind)
        fx = 16 * pose_.get("turn", 0.25)
        ctx_.poly(ell_pts(fx, -60, 40, 10, 24), SKIN, 0, None)

    try:
        C.WATSON.update(pal)
        C.W_CFG.update(brow=brow, eye=pal["eye"], hair=pal["hair"], stache=pal["stache"], hat=pal["hat"])
        if nostache:
            C.face = face_nomustache
        C.draw_watson(ctx, pose)
    finally:
        C.face = face0
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)


def draw_gobsek(ctx, pose):
    _draw(GOBSEK, (150, 146, 138, 255), False, ctx, pose)


def draw_tom(ctx, pose):
    _draw(TOM, (140, 90, 50, 255), True, ctx, pose)
