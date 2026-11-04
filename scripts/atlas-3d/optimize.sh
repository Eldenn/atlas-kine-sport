#!/usr/bin/env sh
# Optimises the Atlas statue exported from Tripo (53 MB, 1.46M triangles, 2048px textures for
# colour, metalness-roughness and normals) into public/3d/atlas.glb (~0.8 MB): welded, simplified
# to ~60k triangles with meshoptimizer, textures resized to 1024px and converted to WebP, geometry
# compressed with Meshopt.
#
#   sh scripts/atlas-3d/optimize.sh path/to/atlas_3d.glb [ratio]
#
# ratio is the share of triangles kept (default 0.041): aim for 50k to 60k triangles.
#
# Then regenerate the poster: scripts/atlas-3d/poster.mjs and poster-webp.py.
set -eu
src="$1"
ratio="${2:-0.041}"
tmp="$(mktemp -d)"
gt="npx --yes @gltf-transform/cli@4.5.1"
$gt weld "$src" "$tmp/1.glb"
$gt simplify "$tmp/1.glb" "$tmp/2.glb" --ratio "$ratio" --error 0.002
$gt resize "$tmp/2.glb" "$tmp/3.glb" --width 1024 --height 1024
$gt webp "$tmp/3.glb" "$tmp/4.glb" --quality 82
$gt meshopt "$tmp/4.glb" public/3d/atlas.glb --level medium
rm -rf "$tmp"
ls -l public/3d/atlas.glb
