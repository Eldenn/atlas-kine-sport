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
N = 400  # px ; affichée à 400 px CSS
AMP = 12  # niveaux de gris par écart-type : le grain reste sous le texte
QUALITY = 70
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


# Crépi fin : l'essentiel du relief est un grain de 2 à 8 px, éclairé en biais, piqué de petits
# trous plus sombres ; les variations de teinte à grande échelle restent à peine perceptibles.
clouds = field(band(120, 400))  # teinte très douce, à grande échelle
grain = field(band(3, 8))  # le sable de l'enduit
lumps = field(band(8, 22))  # petits amas


def splat(count, radius):
    # impulsions aléatoires lissées par une gaussienne périodique (sans raccord)
    imp = np.zeros((N, N))
    pts = rng.integers(0, N, (count, 2))
    np.add.at(imp, (pts[:, 0], pts[:, 1]), rng.uniform(0.5, 1, count))
    kern = np.exp(-(f**2) * (2 * np.pi * radius) ** 2 / 2)
    return np.real(np.fft.ifft2(np.fft.fft2(imp) * kern))


# trous (bulles d'air, grains arrachés) : plus nombreux petits, quelques plus gros
pits = splat(N * N // 600, 0.7) + 0.6 * splat(N * N // 4000, 1.4)
# regroupés par endroits, et déchiquetés par le grain : pas de points ronds réguliers
pits *= np.clip(1 + 0.9 * field(band(25, 90)), 0.1, None) * np.clip(1 + 0.6 * grain, 0.2, None)
pits = pits / pits.std()
rough = np.maximum(grain, 0) ** 1.6  # crêtes du sable, plus vives que les creux

# relief éclairé depuis le haut à gauche ; un trou se creuse : ombre en haut, lumière en bas
H = 0.7 * grain + 0.6 * rough + 0.5 * lumps - 0.9 * pits
gy = (np.roll(H, -1, 0) - np.roll(H, 1, 0)) / 2
gx = (np.roll(H, -1, 1) - np.roll(H, 1, 1)) / 2
shade = -(gx + gy) * 0.7
shade = (shade - shade.mean()) / shade.std()
tex = 0.85 * shade + 0.3 * grain - 0.9 * pits + 0.2 * lumps + 0.25 * clouds
tex = (tex - tex.mean()) / tex.std()
g = np.clip(128 + AMP * np.clip(tex, -3, 3), 0, 255).round().astype(np.uint8)
Image.fromarray(g, 'L').save(OUT, 'WEBP', quality=QUALITY, method=6)
print(OUT, 'écart-type', round(float(g.std()), 1), 'min', g.min(), 'max', g.max())
