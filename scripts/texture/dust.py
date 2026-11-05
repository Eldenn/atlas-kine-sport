"""The site's background texture: python3 scripts/texture/dust.py

An almost smooth surface, veiled with fine dust. Two seamless layers whose sizes share no simple
ratio, stacked in CSS (atlas.css): their patterns only line up again after more than a million
pixels, so the eye sees no repetition. No haze and no large light patches: only grains and dots.

  veils   1400 px  grains clustered into veils, sharp on one side, faded on the other
  grains   757 px  scattered grains, a few larger dots, rare fibres

Each layer comes in two versions (fixed seed: running it again gives the same images):
  -dark   light dust on black, blended with `screen` over the dark backgrounds
  -light  dark dust on white, blended with `multiply` over the bone bands
Black (screen) and white (multiply) change nothing: only the dust touches the background.
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
    # smoothed periodic noise: px = size of the variations
    fy = np.fft.fftfreq(n)[:, None]
    fx = np.fft.fftfreq(n)[None, :]
    f = np.hypot(fx, fy)
    w = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((n, n))) * np.exp(-((f * px) ** 2))))
    return (w - w.mean()) / w.std()


def veils(n=1400, cells=17):
    # Voronoi cells on the torus: straight edges, like folds; each cell has its own density
    # and fades out in a random direction
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
    # never uniform: holed by soft noise, at two scales
    density *= np.clip(1 + 0.6 * lowfreq(n, 60) + 0.3 * lowfreq(n, 15), 0, None)
    dust = np.zeros((n, n))
    hit = rng.random((n, n)) < 0.14 * density
    dust[hit] = rng.uniform(0.1, 0.45, hit.sum())
    return dust


def grains(n=757):
    yy, xx = grid(n)
    dust = np.zeros((n, n))
    # lone grains, denser in some places than others
    p = 0.003 * np.clip(1 + 0.8 * lowfreq(n, 50), 0.1, None)
    hit = rng.random((n, n)) < p
    dust[hit] = rng.uniform(0.1, 0.4, hit.sum())
    # larger dots
    for _ in range(int(n * n / 18000)):
        cx, cy = rng.uniform(0, n, 2)
        r = rng.uniform(0.5, 1.1)
        d2 = wrap(xx - cx, n) ** 2 + wrap(yy - cy, n) ** 2
        dust = np.maximum(dust, rng.uniform(0.3, 0.7) * np.exp(-d2 / (2 * r**2)))
    # rare fibres: short curves of 6 to 22 px, 1 px thick
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
        ('dark', dust * amp_dark),
        ('light', 255 - dust * amp_light),
    ):
        path = f'{OUT}dust-{name}-{suffix}.webp'
        im = Image.fromarray(img.round().astype(np.uint8), 'L')
        if lossless:
            im.save(path, 'WEBP', lossless=True, method=6)
        else:
            im.save(path, 'WEBP', quality=80, method=6)
        print(path, os.path.getsize(path), 'bytes')


os.makedirs(OUT, exist_ok=True)
# amp = a grain's maximum level: screen over the mineral blue, multiply over the bone
save('veils', veils(), 85, 45)
save('grains', grains(), 85, 45)
