"""Old woman (Pushkin, Tale of the Fisherman and the Fish) and Korobochka (Gogol, Dead Souls)
on the shared Hudson rig, own palettes."""
import chars as C
from chars import *

STARUHA = dict(
    dress=(120, 96, 70, 255), dress_dk=(96, 74, 52, 255), apron=(200, 190, 168, 255),
    hair=(170, 166, 160, 255), cap=(216, 200, 160, 255), eye=(70, 90, 80, 255), shawl=(86, 110, 90, 255))
STARUHA_NOBLE = dict(
    dress=(150, 40, 60, 255), dress_dk=(118, 30, 48, 255), apron=(232, 196, 90, 255),
    hair=(170, 166, 160, 255), cap=(232, 196, 90, 255), eye=(70, 90, 80, 255), shawl=(236, 226, 200, 255))
STARUHA_QUEEN = dict(
    dress=(88, 50, 120, 255), dress_dk=(66, 36, 94, 255), apron=(240, 230, 210, 255),
    hair=(170, 166, 160, 255), cap=(232, 190, 60, 255), eye=(70, 90, 80, 255), shawl=(244, 240, 232, 255))
KOROBOCHKA = dict(
    dress=(70, 96, 70, 255), dress_dk=(54, 76, 54, 255), apron=(244, 236, 210, 255),
    hair=(150, 120, 90, 255), cap=(250, 246, 236, 255), eye=(110, 80, 50, 255), shawl=(206, 160, 70, 255))


def _draw(pal, ctx, pose):
    saved, scfg = dict(C.HUDSON), dict(C.U_CFG)
    try:
        C.HUDSON.update(pal)
        C.U_CFG.update(brow=(120, 112, 104, 255), eye=pal["eye"], hair=pal["hair"], cap=pal["cap"])
        C.draw_hudson(ctx, pose)
    finally:
        C.HUDSON.update(saved)
        C.U_CFG.update(scfg)


def draw_staruha(ctx, pose):
    _draw(STARUHA, ctx, pose)


def draw_staruha_noble(ctx, pose):
    _draw(STARUHA_NOBLE, ctx, pose)


def draw_staruha_queen(ctx, pose):
    _draw(STARUHA_QUEEN, ctx, pose)


def draw_korobochka(ctx, pose):
    _draw(KOROBOCHKA, ctx, pose)
