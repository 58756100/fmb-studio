#!/bin/bash
# Render, mix and assemble every W42 reel version. Safe to re-run: finished parts are skipped.
set -u
cd /home/claude/fmb-studio
mkdir -p out/final out/mix
for R in ${REELS:-C1 G2 P1 C2 G1 X2 C3 G3 P2 X1 P3}; do
  HOOKS=$(python3 -c "import json;print(','.join(k for k in json.load(open('kit/remotion/public/tl/$R.json'))['parts'] if k!='body'))")
  (cd kit/remotion && node render_story.mjs $R body,$HOOKS 2>&1 | grep -E "done|skip|Error|error" )
  for P in ${HOOKS//,/ }; do H=${P#hook}
    O=out/final/$R-$H.mp4
    [ -f $O ] && continue
    python3 kit/audio/mix_reel.py $R $H --tl kit/remotion/public/tl/$R.json --vo weeks/2026-W42/vo/$R --out out/mix/$R-$H --frames kit/remotion/public/tl/$R.html.json
    printf "file '%s'\nfile '%s'\n" "$PWD/kit/remotion/out/story/$R-$P.mp4" "$PWD/kit/remotion/out/story/$R-body.mp4" > out/mix/$R-$H.txt
    ffmpeg -v error -y -f concat -safe 0 -i out/mix/$R-$H.txt -c copy out/mix/$R-$H-v.mp4
    ffmpeg -v error -y -i out/mix/$R-$H-v.mp4 -i out/mix/$R-$H.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart $O
    ffmpeg -v error -y -i out/mix/$R-$H-v.mp4 -i out/mix/$R-$H-nomusic.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/final/$R-$H-nomusic.mp4
    echo "FINAL $O $(ffprobe -v error -show_entries format=duration -of csv=p=0 $O)s"
  done
done
echo ALLDONE
