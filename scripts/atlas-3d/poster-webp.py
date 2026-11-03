"""Turns scripts/atlas-3d/poster.png into the two poster sizes in public/images/."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
img = Image.open(ROOT / "scripts" / "atlas-3d" / "poster.png").convert("RGBA")
for width in (1120, 560):
    out = ROOT / "public" / "images" / f"atlas-3d-{width}.webp"
    img.resize((width, round(img.height * width / img.width)), Image.LANCZOS).save(out, quality=82, method=6)
    print(out.relative_to(ROOT), out.stat().st_size, "bytes")
