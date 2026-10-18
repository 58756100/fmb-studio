#!/bin/sh
# Assemble public/ (gitignored) from the lane-A fonts and the kit cut-outs.
set -e
D=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$D/public/img" "$D/public/fonts"
cp "$D/../fonts/"*.woff2 "$D/public/fonts/"
for n in car-05 car-09 car-01 part-06 part-01; do cp "$D/../../../../../kit/remotion/public/img/$n.png" "$D/public/img/"; done
echo prepped
