"""Matière du fond du site : python3 scripts/texture/matiere.py

Une surface presque lisse, voilée de poussière fine. Deux couches sans raccord, de tailles sans
rapport simple, superposées en CSS (atlas.css) : leurs motifs ne retombent ensemble qu'au bout de
plus d'un million de pixels, l'œil ne voit pas de répétition. Pas de brume ni de grandes taches
claires : seulement des grains et des points.

  voiles  1400 px  grains regroupés en voiles, nets d'un côté, fondus de l'autre
  grains   757 px  grains épars, quelques points plus gros, de rares fibres

Chaque couche existe en deux versions (seed fixe, relancer redonne les mêmes images) :
  -sombre  poussière claire sur noir, fondue en `screen` sur les fonds sombres
  -claire  poussière sombre sur blanc, fondue en `multiply` sur les bandes bone
Le noir (screen) et le blanc (multiply) ne changent rien : seule la poussière touche le fond.
"""
import os

import numpy as np
from PIL import Image

OUT = 'public/images/texture/'
rng = np.random.default_rng(11)


def grid(n):
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    return yy, xx


def wrap(d, n):
    return (d + n / 2) % n - n / 2


def lowfreq(n, px):
    # bruit périodique lissé : px = taille des variations
    fy = np.fft.fftfreq(n)[:, None]
    fx = np.fft.fftfreq(n)[None, :]
    f = np.hypot(fx, fy)
    w = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((n, n))) * np.exp(-((f * px) ** 2))))
    return (w - w.mean()) / w.std()


def voiles(n=1400, cells=17):
    # cellules de Voronoï sur le tore : bords droits, comme des plis ; chaque cellule a sa densité
    # et s'estompe dans une direction tirée au hasard
    yy, xx = grid(n)
    seeds = rng.uniform(0, n, (cells, 2))
    dist = np.stack([np.hypot(wrap(xx - sx, n), wrap(yy - sy, n)) for sx, sy in seeds])
    cell = dist.argmin(0)
    density = np.zeros((n, n))
    for k, (sx, sy) in enumerate(seeds):
        m = cell == k
        level = rng.choice([0, 0, 0, 0.1, 0.25, 0.45, 0.7, 1.0])
        ang = rng.uniform(0, 2 * np.pi)
        along = wrap(xx - sx, n) * np.cos(ang) + wrap(yy - sy, n) * np.sin(ang)
        fade = np.clip(0.5 + along / rng.uniform(160, 480), 0, 1) ** rng.uniform(1, 2.5)
        density[m] = (level * fade)[m]
    # jamais uniforme : trouée par un bruit doux, à deux échelles
    density *= np.clip(1 + 0.6 * lowfreq(n, 60) + 0.3 * lowfreq(n, 15), 0, None)
    dust = np.zeros((n, n))
    hit = rng.random((n, n)) < 0.14 * density
    dust[hit] = rng.uniform(0.1, 0.45, hit.sum())
    return dust


def grains(n=757):
    yy, xx = grid(n)
    dust = np.zeros((n, n))
    # grains isolés, plus ou moins serrés selon l'endroit
    p = 0.003 * np.clip(1 + 0.8 * lowfreq(n, 50), 0.1, None)
    hit = rng.random((n, n)) < p
    dust[hit] = rng.uniform(0.1, 0.4, hit.sum())
    # points plus gros
    for _ in range(int(n * n / 18000)):
        cx, cy = rng.uniform(0, n, 2)
        r = rng.uniform(0.5, 1.1)
        d2 = wrap(xx - cx, n) ** 2 + wrap(yy - cy, n) ** 2
        dust = np.maximum(dust, rng.uniform(0.3, 0.7) * np.exp(-d2 / (2 * r**2)))
    # rares fibres : petites courbes de 6 à 22 px, 1 px d'épaisseur
    for _ in range(5):
        x, y = rng.uniform(0, n, 2)
        a = rng.uniform(0, 2 * np.pi)
        bend = rng.normal(0, 0.04)
        v = rng.uniform(0.2, 0.4)
        for _ in range(int(rng.uniform(6, 22))):
            dust[int(y) % n, int(x) % n] = max(dust[int(y) % n, int(x) % n], v)
            a += bend
            x += np.cos(a)
            y += np.sin(a)
    return dust


def save(name, dust, amp_dark, amp_light, lossless=True):
    dust = np.clip(dust, 0, 1)
    for suffix, img in (
        ('sombre', dust * amp_dark),
        ('claire', 255 - dust * amp_light),
    ):
        path = f'{OUT}matiere-{name}-{suffix}.webp'
        im = Image.fromarray(img.round().astype(np.uint8), 'L')
        if lossless:
            im.save(path, 'WEBP', lossless=True, method=6)
        else:
            im.save(path, 'WEBP', quality=80, method=6)
        print(path, os.path.getsize(path), 'octets')


os.makedirs(OUT, exist_ok=True)
# amp = niveau maximal d'un grain : screen sur le bleu minéral, multiply sur le bone
save('voiles', voiles(), 85, 45)
save('grains', grains(), 85, 45)
