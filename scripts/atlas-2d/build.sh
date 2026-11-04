#!/usr/bin/env sh
# Builds the home page's Atlas from the traced illustration (atlas_moderne_web.svg, 850 KB):
#   public/images/atlas/atlas.svg        the picture, rounded to whole units (~260 KB, 86 KB gzip)
#   public/images/atlas/atlas-lines.svg  the mask of its gold lines (lines.py; ~230 KB, 76 KB gzip)
#
#   sh scripts/atlas-2d/build.sh path/to/atlas_moderne_web.svg
set -eu
src="$1"
dir="$(dirname "$0")"
tmp="$(mktemp -d)"
svgo="npx --yes svgo@3.3.2 --config $dir/svgo.config.cjs"
python3 "$dir/lines.py" "$src" "$tmp/lines.svg"
$svgo -i "$src" -o public/images/atlas/atlas.svg
$svgo -i "$tmp/lines.svg" -o public/images/atlas/atlas-lines.svg
rm -rf "$tmp"
ls -l public/images/atlas/
