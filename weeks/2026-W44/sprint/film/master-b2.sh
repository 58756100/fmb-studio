#!/bin/bash
# ./master-b2.sh <id> [hooks]  -> like master.sh, but hooks B/C render only their opener (up to the first transition
# after the hook line) and are spliced onto hook A's body: B = B[0, fB) + A[fA, end), re-encoded once, frame count
# padded/trimmed to the B composition. The body after the splice is the same film shifted by the hook's length.
set -euo pipefail
cd "$(dirname "$0")"
ID=$1; HOOKS=${2:-A,B,C}
clean() { find /tmp -maxdepth 1 -name "remotion-webpack-bundle-*" -mmin +240 -exec rm -rf {} + 2>/dev/null || true; }
clean
node cues.mjs $ID $HOOKS
for h in ${HOOKS//,/ }; do python3 audio/score.py $ID $h out/audio | tail -1; done
node render-b2.mjs $ID A 2>&1 | grep -E "^done|Error" || true
for h in ${HOOKS//,/ }; do
  [ $h = A ] && continue
  read FB FA NB < <(python3 - $ID $h <<'PY'
import json, sys
I, h = sys.argv[1:]
a = json.load(open(f"out/cues/{I}-A.json")); b = json.load(open(f"out/cues/{I}-{h}.json"))
k = next(i for i, s in enumerate(b["shots"]) if s["at"] > b["hookEnd"] + 0.3)
fb = round(b["shots"][k]["at"] * 30); fa = round(a["shots"][k]["at"] * 30)
print(fb, fa, b["frames"])
PY
)
  echo "$ID-$h: opener 0-$((FB-1)) + A from $FA, total $NB"
  node render-b2.mjs $ID $h 0-$((FB-1)) 2>&1 | grep -E "^done|Error" || true
  ffmpeg -v error -y -i out/video/$ID-$h-part.mp4 -i out/video/$ID-A.mp4 -filter_complex \
    "[0:v]setpts=PTS-STARTPTS[p];[1:v]trim=start_frame=$FA,setpts=PTS-STARTPTS[q];[p][q]concat=n=2:v=1:a=0,tpad=stop_mode=clone:stop=60,trim=end_frame=$NB,setpts=PTS-STARTPTS[v]" \
    -map "[v]" -r 30 -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart out/video/$ID-$h.mp4
  rm -f out/video/$ID-$h-part.mp4
done
clean
for h in ${HOOKS//,/ }; do echo "== $ID-$h"; ./assemble.sh $ID $h; done
rm -rf out/sheet/$ID; mkdir -p out/sheet/$ID
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/masters/$ID-A.mp4)
for i in $(seq 0 11); do t=$(python3 -c "print(f'{($i+0.5)*$D/12:.2f}')"); ffmpeg -v error -y -ss $t -i out/masters/$ID-A.mp4 -frames:v 1 out/sheet/$ID/$(printf %05.2f $t).png; done
python3 -I sheet.py out/sheet/$ID ../storyboard/$ID-final-sheet.jpg "$ID-A final master: 12 stills" 6
