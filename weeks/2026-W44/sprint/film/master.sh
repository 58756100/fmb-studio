#!/bin/bash
# ./master.sh <id> [hooks]  -> cues, score/mix/master, render, mux + checks for each hook, and the 12-still final sheet (hook A)
set -euo pipefail
cd "$(dirname "$0")"
ID=$1; HOOKS=${2:-A,B,C}
clean() { find /tmp -maxdepth 1 -name "remotion-webpack-bundle-*" -mmin +20 -exec rm -rf {} + 2>/dev/null || true; }  # each bundle copies public/ (85 MB)
clean
node cues.mjs $ID $HOOKS
for h in ${HOOKS//,/ }; do python3 audio/score.py $ID $h out/audio | tail -1; done
node render.mjs $ID $HOOKS 2>&1 | grep -E "^done|Error" || true
clean
for h in ${HOOKS//,/ }; do echo "== $ID-$h"; ./assemble.sh $ID $h; done
rm -rf out/sheet/$ID; mkdir -p out/sheet/$ID
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/masters/$ID-A.mp4)
for i in $(seq 0 11); do t=$(python3 -c "print(f'{($i+0.5)*$D/12:.2f}')"); ffmpeg -v error -y -ss $t -i out/masters/$ID-A.mp4 -frames:v 1 out/sheet/$ID/$(printf %05.2f $t).png; done
python3 -I sheet.py out/sheet/$ID ../storyboard/$ID-final-sheet.jpg "$ID-A final master: 12 stills" 6
