"""Rasterise the land of Natural Earth (public domain) to public/3d/earth-land.png.

An equirectangular mask (white land, black sea) that the globe's shader colours in the site's tones.
The source is the world-atlas package (TopoJSON of Natural Earth 1:50m):

    npm pack world-atlas@2.0.2 && tar xzf world-atlas-2.0.2.tgz
    python3 scripts/atlas-3d/earth.py package/land-50m.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "3d" / "earth-land.png"
W, H = 2048, 1024
SS = 2  # supersampling, for clean coastlines


def decode_arcs(topo):
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    return arcs


def ring(arcs, idxs):
    out = []
    for i in idxs:
        pts = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(pts if not out else pts[1:])
    return out


def unwrap(pts):
    out = []
    shift = 0.0
    for i, (lon, lat) in enumerate(pts):
        if i:
            step = lon - pts[i - 1][0]
            if step > 180:
                shift -= 360
            elif step < -180:
                shift += 360
        out.append((lon + shift, lat))
    return out


def main(path: str) -> int:
    topo = json.loads(Path(path).read_text())
    arcs = decode_arcs(topo)
    img = Image.new("L", (W * SS, H * SS), 0)
    draw = ImageDraw.Draw(img)

    def px(lon, lat):
        return ((lon + 180) / 360 * W * SS, (90 - lat) / 180 * H * SS)

    for geom in topo["objects"]["land"]["geometries"]:
        polys = geom["arcs"] if geom["type"] == "MultiPolygon" else [geom["arcs"]]
        for poly in polys:
            for r, rng in enumerate(poly):
                # Rings that cross the antimeridian (Chukotka, Fiji) are unwrapped to continuous
                # longitudes and drawn three times, a turn apart, so the image edge cuts them.
                lonlat = unwrap(ring(arcs, rng))
                if len(lonlat) < 3:
                    continue
                for turn in (-360, 0, 360):
                    pts = [px(lon + turn, lat) for lon, lat in lonlat]
                    draw.polygon(pts, fill=255 if r == 0 else 0)
    # The 1:50m land stops short of the pole: close the Antarctic cap.
    draw.rectangle([0, px(0, -85.5)[1], W * SS, H * SS], fill=255)
    img = img.resize((W, H), Image.LANCZOS)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, optimize=True)
    print(OUT.relative_to(ROOT), OUT.stat().st_size, "bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1]))
