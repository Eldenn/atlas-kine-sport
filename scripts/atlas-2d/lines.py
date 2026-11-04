"""Builds the mask of the illustration's gold lines from the traced SVG.

The illustration is a stacked trace: 2,587 filled shapes painted in order, a gold silhouette first
and the bronze shapes over it, so a gold line is wherever gold is left showing. The mask repaints
every shape in the same order, gold ones white and the others black (anti-aliasing tones in
between), inside an SVG <mask>: the result is white, opaque exactly where the gold lines are.

    python3 scripts/atlas-2d/lines.py source.svg out.svg
"""

import re
import sys

source, out = sys.argv[1], sys.argv[2]
svg = open(source, encoding="utf-8").read()
width, height = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups()
paths = re.findall(r'<path fill="(#[0-9a-fA-F]{6})" d="([^"]+)"\s*/>', svg)


def level(hex_colour: str) -> float:
    """0 for bronze, 1 for gold, by luminance; quarter steps for the blended edges."""
    r, g, b = (int(hex_colour[i : i + 2], 16) / 255 for i in (1, 3, 5))
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    t = min(1.0, max(0.0, (lum - 0.40) / 0.18))
    return round(t * t * (3 - 2 * t) * 4) / 4


parts, current = [], None
for fill, d in paths:
    value = level(fill)
    if value != current:
        if current is not None:
            parts.append("</g>")
        grey = round(value * 255)
        parts.append(f'<g fill="#{grey:02x}{grey:02x}{grey:02x}">')
        current = value
    parts.append(f'<path d="{d}"/>')
parts.append("</g>")

open(out, "w", encoding="utf-8").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">'
    f'<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="{width}" height="{height}">'
    + "".join(parts)
    + f'</mask><rect width="{width}" height="{height}" fill="#fff" mask="url(#m)"/></svg>'
)
print(out, len(paths), "shapes")
