#!/bin/bash
# ./assemble.sh B-L1 "0.3,2.5,..."  -> out/final/<id>-A.mp4 (hook A spliced onto the body + mastered music/SFX), <id>-A-bed.wav,
#                                     ../storyboard/<id>-final-sheet.png (9 stills from the master), plus checks
set -euo pipefail
cd "$(dirname "$0")"
ID=$1; TS=$2; F=out/final; mkdir -p $F ../storyboard
python3 audio/score.py $ID out/audio >/dev/null
# splice: concat filter, one re-encode
if [ -f out/$ID-fix.mp4 ]; then  # a fix range (frames FIX_A..FIX_B) re-rendered and spliced into the body, still one re-encode
  read FA FB < out/$ID-fix.range; A=$((FA-60)); B=$((FB-60+1))
  ffmpeg -v error -y -i out/$ID-hookA.mp4 -i out/$ID-body.mp4 -i out/$ID-fix.mp4 -i out/audio/$ID-master.wav \
    -filter_complex "[1:v]trim=start_frame=0:end_frame=$A,setpts=PTS-STARTPTS[b0];[1:v]trim=start_frame=$B,setpts=PTS-STARTPTS[b1];[0:v][b0][2:v][b1]concat=n=4:v=1:a=0,fps=30,format=yuv420p[v]" -map "[v]" -map 3:a \
    -c:v libx264 -preset slow -crf 16 -profile:v high -r 30 -c:a aac -b:a 256k -ar 48000 -t 30 -movflags +faststart $F/$ID-A.mp4
else
ffmpeg -v error -y -i out/$ID-hookA.mp4 -i out/$ID-body.mp4 -i out/audio/$ID-master.wav \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0,fps=30,format=yuv420p[v]" -map "[v]" -map 2:a \
  -c:v libx264 -preset slow -crf 16 -profile:v high -r 30 -c:a aac -b:a 256k -ar 48000 -t 30 -movflags +faststart $F/$ID-A.mp4
fi
cp out/audio/$ID-bed.wav $F/$ID-A-bed.wav
# 9-still contact sheet from the master
rm -rf out/sheet-$ID; mkdir -p out/sheet-$ID; i=0
for t in ${TS//,/ }; do ffmpeg -v error -y -ss $t -i $F/$ID-A.mp4 -frames:v 1 -vf scale=540:-1 out/sheet-$ID/$ID-$(printf %05.2f $t).png; done
python3 - "$ID" <<'PY'
import sys, glob
from PIL import Image, ImageDraw, ImageFont
ID = sys.argv[1]; fs = sorted(glob.glob(f"out/sheet-{ID}/*.png")); ims = [Image.open(f) for f in fs]; w, h = ims[0].size
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
S = Image.new("RGB", (3 * w + 4 * 16, 3 * (h + 40) + 16 + 60), "#E8E8ED"); d = ImageDraw.Draw(S)
d.text((16, 18), f"{ID}-A · final master · 9 stills", fill="#1D1D1F", font=font)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = 16 + (i % 3) * (w + 16), 60 + (i // 3) * (h + 40)
    d.text((x, y + 4), "%.2f s" % float(f.split("-")[-1][:-4]), fill="#6E6E73", font=font); S.paste(im, (x, y + 34))
S.save(f"../storyboard/{ID}-final-sheet.png", optimize=True)
PY
# checks
echo "== $ID"
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=codec_name,width,height,r_frame_rate,nb_read_frames -of csv=p=0 $F/$ID-A.mp4
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 $F/$ID-A.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $F/$ID-A.mp4
ffmpeg -hide_banner -nostats -i $F/$ID-A.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A20 "Summary" | grep -E "I:|LRA:|Peak:"
