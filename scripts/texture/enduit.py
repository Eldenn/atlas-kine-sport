"""Tuile d'enduit (mur plâtre / chaux) pour le fond du site : python3 scripts/texture/enduit.py

Chaque composante est construite dans l'espace de Fourier sur un tore N x N : la tuile se répète
sans raccord visible. Sortie : une carte de gris centrée sur 128, le neutre du mode de fusion
soft-light. Elle ne porte aucune couleur : le CSS la fond sur la couleur du thème (atlas.css), qui
reste celle du moodboard en moyenne. Seed fixe : relancer le script redonne la même image.
"""
import sys
import numpy as np
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/images/texture/enduit.webp'
N = 640  # px ; affichée à 640 px CSS
AMP = 6  # niveaux de gris par écart-type : le grain reste sous le texte
QUALITY = 85
rng = np.random.default_rng(7)
fy = np.fft.fftfreq(N)[:, None]
fx = np.fft.fftfreq(N)[None, :]
f = np.hypot(fx, fy) + 1e-9
theta = np.arctan2(fy, fx)


def field(filt):
    w = rng.standard_normal((N, N))
    out = np.real(np.fft.ifft2(np.fft.fft2(w) * filt))
    return (out - out.mean()) / out.std()


def band(lo_px, hi_px):
    # keep wavelengths between lo_px and hi_px
    return np.exp(-((np.log(f) - np.log(2 / (lo_px + hi_px))) ** 2) / (2 * 0.6**2))


# 1. large soft clouds (the uneven tone of a lime/plaster wall)
clouds = field(band(120, 420))
# 2. mid mottling
mottle = field(band(25, 80))
# 3. trowel strokes: oriented ridges, direction changing in patches
strokes = np.zeros((N, N))
mask_base = [field(band(200, 500)) for _ in range(4)]
for k, ang in enumerate(np.linspace(0, np.pi, 4, endpoint=False) + rng.uniform(0, 0.4)):
    d = np.cos(theta - ang)
    wedge = np.exp(-(1 - d**2) / (2 * 0.4**2)) * band(30, 110)
    ridges = np.abs(field(wedge))  # sharp crests like trowel marks
    ridges = (ridges - ridges.mean()) / ridges.std()
    m = np.clip(mask_base[k] - 0.3, 0, None)
    strokes += ridges * m
strokes = (strokes - strokes.mean()) / strokes.std()
# 4. fine sand grain
grain = field(np.exp(-((f - 0.35) ** 2) / (2 * 0.12**2)))
# 5. tiny pits (air bubbles) - darker dots
pits = np.zeros((N, N))
pts = rng.integers(0, N, (int(N * N / 9000), 2))
yy, xx = np.mgrid[0:N, 0:N]
for py, px in pts:
    r = rng.uniform(0.8, 1.8)
    dy = (yy - py + N / 2) % N - N / 2
    dx = (xx - px + N / 2) % N - N / 2
    pits -= np.exp(-(dx**2 + dy**2) / (2 * r**2)) * rng.uniform(0.6, 1)

# relief, then lit from the upper left like a wall under a window
# skimmed patches: plateaus with soft edges, where the trowel flattened the plaster
p = field(band(60, 200))
patches = 1 / (1 + np.exp(-4 * (p - 0.4)))
H = 1.0 * mottle + 0.55 * strokes + 1.6 * patches + 0.25 * grain + 1.2 * pits
gy = (np.roll(H, -1, 0) - np.roll(H, 1, 0)) / 2
gx = (np.roll(H, -1, 1) - np.roll(H, 1, 1)) / 2
shade = -(gx * 0.7 + gy * 0.7)
shade = (shade - shade.mean()) / shade.std()
tex = 1.0 * clouds + 0.75 * shade + 0.25 * mottle + 0.35 * patches
tex = (tex - tex.mean()) / tex.std()
g = np.clip(128 + AMP * np.clip(tex, -3, 3), 0, 255).round().astype(np.uint8)
Image.fromarray(g, 'L').save(OUT, 'WEBP', quality=QUALITY, method=6)
print(OUT, 'écart-type', round(float(g.std()), 1), 'min', g.min(), 'max', g.max())
