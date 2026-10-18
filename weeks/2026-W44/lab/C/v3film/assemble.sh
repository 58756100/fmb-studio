#!/bin/bash
# ./assemble.sh C3-COL -> out/final/<id>-A.mp4 (hook A opener spliced onto the body, one re-encode, mastered music+SFX as AAC 48 kHz),
#                        out/final/<id>-A-bed.wav (music+SFX at mix level), out/final/<id>-A-sfx.wav (no-music stem),
#                        ../v3storyboard/<id>-final-sheet.jpg (12 stills from the master), checks + motion check
set -euo pipefail
cd "$(dirname "$0")"
ID=$1; F=out/final; mkdir -p $F
python3 audio/score.py $ID out/audio | tail -2
ffmpeg -v error -y -i out/$ID-hookA.mp4 -i out/$ID-body.mp4 -i out/audio/$ID-master.wav \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0,fps=30,format=yuv420p[v]" -map "[v]" -map 2:a \
  -c:v libx264 -preset slow -crf 16 -profile:v high -r 30 -c:a aac -b:a 256k -ar 48000 -t 27 -movflags +faststart $F/$ID-A.mp4
cp out/audio/$ID-bed.wav $F/$ID-A-bed.wav; cp out/audio/$ID-sfx.wav $F/$ID-A-sfx.wav
# 12-still final sheet from the master
declare -A TS=([C3-COL]="0.0 1.1 3.3 5.9 8.9 12.4 13.9 16.6 19.6 22.9 25.6 26.8" [C3-GAR]="0.0 0.2 2.6 7.9 10.9 13.9 17.6 19.4 22.4 24.4 25.7 26.8" [C3-SUP]="0.0 4.4 5.2 8.6 13.4 14.7 15.5 17.8 19.7 21.0 25.6 26.8")
rm -rf out/sheet-$ID; mkdir -p out/sheet-$ID
for t in ${TS[$ID]}; do ffmpeg -v error -y -ss $t -i $F/$ID-A.mp4 -frames:v 1 -vf scale=432:-1 out/sheet-$ID/$(printf %05.2f $t).png; done
python3 - "$ID" <<'PY'
import sys, glob
from PIL import Image, ImageDraw, ImageFont
ID = sys.argv[1]; fs = sorted(glob.glob(f"out/sheet-{ID}/*.png")); ims = [Image.open(f) for f in fs]; w, h = ims[0].size
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26); small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
S = Image.new("RGB", (6 * w + 7 * 14, 2 * (h + 36) + 14 + 64), "#E8E8ED"); d = ImageDraw.Draw(S)
d.text((14, 18), f"{ID}-A  final master  (12 stills from the H.264 file; photos and three cutouts are code-built stand-ins until Wayne's images land)", fill="#1D1D1F", font=font)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = 14 + (i % 6) * (w + 14), 64 + (i // 6) * (h + 36)
    d.text((x, y + 4), "%.2f s" % float(f.split("/")[-1][:-4]), fill="#6E6E73", font=small); S.paste(im, (x, y + 30))
S.save(f"../v3storyboard/{ID}-final-sheet.jpg", quality=88)
PY
echo "== $ID"
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=codec_name,profile,width,height,r_frame_rate,nb_read_frames,pix_fmt -of csv=p=0 $F/$ID-A.mp4
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 $F/$ID-A.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $F/$ID-A.mp4
ffmpeg -hide_banner -nostats -i $F/$ID-A.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A20 "Summary" | grep -E "I:|LRA:|Peak:"
TP=$(ffmpeg -hide_banner -nostats -i $F/$ID-A.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary | grep Peak: | awk '{print $2}')
python3 -c "import sys; tp=float('$TP'); print('true peak after AAC %.1f dBTP' % tp); sys.exit(0 if tp <= -1.0 else 1)" || { echo "TRUE PEAK OVER -1 dBTP"; exit 1; }
python3 motion_check.py $F/$ID-A.mp4
