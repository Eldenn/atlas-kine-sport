"""Matière du fond du site : python3 scripts/texture/matiere.py

Une surface presque lisse, voilée de poussière fine : des zones de grains très fins, nettes d'un
côté (comme le long d'un pli) et qui s'estompent de l'autre, quelques points plus gros et de
courtes fibres. Tout est construit sur un tore N x N : la tuile se répète sans raccord.

Sorties (seed fixe, relancer redonne les mêmes images) :
  public/images/texture/matiere-sombre.webp  poussière claire sur noir, fondue en `screen`
  public/images/texture/matiere-claire.webp  poussière sombre sur blanc, fondue en `multiply`
Noir en screen et blanc en multiply ne changent rien : seule la poussière touche la couleur du
fond, qui reste celle du moodboard.
"""
import numpy as np
from PIL import Image

N = 1024  # px ; affichée à 1024 px CSS : les voiles de poussière sont grands, la répétition ne se lit pas
rng = np.random.default_rng(11)
yy, xx = np.mgrid[0:N, 0:N].astype(float)


def wrap(d):
    return (d + N / 2) % N - N / 2


# 1. Zones de poussière : cellules de Voronoï sur le tore (bords droits, comme des plis). Chaque
#    cellule a sa densité et s'estompe dans une direction : bord net d'un côté, fondu de l'autre.
K = 11
seeds = rng.uniform(0, N, (K, 2))
dist = np.stack([np.hypot(wrap(xx - sx), wrap(yy - sy)) for sx, sy in seeds])
cell = dist.argmin(0)
density = np.zeros((N, N))
for k, (sx, sy) in enumerate(seeds):
    m = cell == k
    level = rng.choice([0, 0, 0.15, 0.35, 0.6, 1.0])
    ang = rng.uniform(0, 2 * np.pi)
    along = wrap(xx - sx) * np.cos(ang) + wrap(yy - sy) * np.sin(ang)
    fade = np.clip(0.5 + along / rng.uniform(200, 420), 0, 1) ** 1.5
    density[m] = (level * fade)[m]


# variations douces à l'intérieur des zones (poussière jamais uniforme)
def lowfreq(px):
    fy = np.fft.fftfreq(N)[:, None]
    fx = np.fft.fftfreq(N)[None, :]
    f = np.hypot(fx, fy)
    w = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((N, N))) * np.exp(-((f * px) ** 2))))
    return (w - w.mean()) / w.std()


density *= np.clip(1 + 0.5 * lowfreq(70), 0, None)

dust = np.zeros((N, N))
# 2. Grains très fins : 1 px, très nombreux dans les zones, rares ailleurs
p = 0.003 + 0.14 * density
hit = rng.random((N, N)) < p
dust[hit] = rng.uniform(0.1, 0.45, hit.sum())

# 3. Points plus gros, épars
for _ in range(60):
    cx, cy = rng.uniform(0, N, 2)
    r = rng.uniform(0.5, 1.1)
    dust = np.maximum(dust, rng.uniform(0.3, 0.7) * np.exp(-(wrap(xx - cx) ** 2 + wrap(yy - cy) ** 2) / (2 * r**2)))

# 4. Courtes fibres : petites courbes de 6 à 22 px, 1 px d'épaisseur
for _ in range(10):
    x, y = rng.uniform(0, N, 2)
    a = rng.uniform(0, 2 * np.pi)
    bend = rng.normal(0, 0.04)
    v = rng.uniform(0.2, 0.4)
    for _ in range(int(rng.uniform(6, 22))):
        dust[int(y) % N, int(x) % N] = max(dust[int(y) % N, int(x) % N], v)
        a += bend
        x += np.cos(a)
        y += np.sin(a)

dust = np.clip(dust, 0, 1)


def save(path, img):
    Image.fromarray(img, 'L').save(path, 'WEBP', lossless=True, method=6)
    print(path)


AMP_DARK = 85  # niveau max d'un grain en screen sur le bleu minéral
AMP_LIGHT = 45  # niveau max d'un grain en multiply sur le bone
save('public/images/texture/matiere-sombre.webp', (dust * AMP_DARK).round().astype(np.uint8))
save('public/images/texture/matiere-claire.webp', (255 - dust * AMP_LIGHT).round().astype(np.uint8))
