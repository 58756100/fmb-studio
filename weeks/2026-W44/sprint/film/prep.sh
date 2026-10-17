#!/bin/sh
# Fill public/ (git-ignored) from the repo: image bank, the legacy Evo cutout (not in the bank), fonts, VO from the renders branch.
set -e
cd "$(dirname "$0")"; R=../../../..
mkdir -p public/img public/fonts public/vo
cp -u $R/kit/remotion/public/img/bank/*.webp $R/kit/remotion/public/img/bank/*.jpg public/img/
cp -u $R/kit/remotion/public/img/car-14.png public/img/legacy-evo-car-14.png
cp -u $R/kit/remotion/public/fonts/inter-latin-opsz-normal.woff2 public/fonts/
cp -u $R/weeks/2026-W44/lab/A/aplus/public/fonts/*.woff2 public/fonts/
git -C $R fetch --depth 1 --filter=blob:none origin renders >/dev/null 2>&1 || true
for id in A-L1 A-L2 A-L3 B-L1 B-L2 B-L3 C3-COL C3-GAR C3-SUP; do
  mkdir -p public/vo/$id
  for f in vo.wav words.json hook-B.wav hook-B.words.json hook-C.wav hook-C.words.json; do
    [ -s public/vo/$id/$f ] || git -C $R show origin/renders:2026-W44/lab/vo/$id/$f > public/vo/$id/$f
  done
done
echo prep done
