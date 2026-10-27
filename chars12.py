"""Original cartoon entrepreneur 'Джефф' (long-form video) on the shared Watson rig: no moustache, casual shirt.
Not a portrait of a real person: a generic storybook figure."""
import chars as C
from chars import *

JEFF = dict(
    coat=(70, 112, 164, 255), coat_dk=(52, 88, 134, 255), vest=(226, 226, 220, 255),
    trousers=(76, 76, 88, 255), shirt=WHITE, tie=(226, 226, 220, 255), hair=(130, 104, 80, 255),
    stache=(130, 104, 80, 255), hat=(60, 60, 60, 255), eye=(80, 110, 140, 255), shoe=(44, 36, 30, 255))
JEFF_OLD = dict(JEFF, coat=(150, 150, 156, 255), coat_dk=(120, 120, 128, 255), vest=(196, 176, 150, 255),
                tie=(196, 176, 150, 255), hair=(232, 230, 226, 255), stache=(232, 230, 226, 255))


def _draw(pal, brow, ctx, pose):
    saved, scfg, face0 = dict(C.WATSON), dict(C.W_CFG), C.face

    def face_nomustache(ctx_, pose_, cfg_, kind):
        face0(ctx_, pose_, cfg_, kind)
        fx = 16 * pose_.get("turn", 0.25)
        ctx_.poly(ell_pts(fx, -60, 40, 10, 24), SKIN, 0, None)

    try:
        C.WATSON.update(pal)
        C.W_CFG.update(brow=brow, eye=pal["eye"], hair=pal["hair"], stache=pal["stache"], hat=pal["hat"])
        C.face = face_nomustache
        C.draw_watson(ctx, pose)
    finally:
        C.face = face0
        C.WATSON.update(saved)
        C.W_CFG.update(scfg)


def draw_jeff(ctx, pose):
    _draw(JEFF, (100, 78, 58, 255), ctx, pose)


def draw_jeff_old(ctx, pose):
    _draw(JEFF_OLD, (190, 188, 184, 255), ctx, pose)
