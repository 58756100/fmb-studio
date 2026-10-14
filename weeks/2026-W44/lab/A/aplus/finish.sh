#!/bin/sh
# Splice the hook opener onto the body (one re-encode), mux the mastered mix: out/<id>-A.mp4
set -e
D=$(cd "$(dirname "$0")" && pwd); id=$1; v=${id#A-}
ffmpeg -y -loglevel error -i "$D/out/$id-hook.mp4" -i "$D/out/$id-body.mp4" -i "$D/audio/out/$id-master.wav" \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0,fps=30,format=yuv420p[v]" -map "[v]" -map 2:a \
  -c:v libx264 -preset slow -crf 17 -profile:v high -r 30 -c:a aac -b:a 256k -ar 48000 -t 28 -movflags +faststart "$D/out/$id-A.mp4"
ffmpeg -y -loglevel error -i "$D/audio/out/$id-bed.wav" -c:a pcm_s24le -ar 48000 "$D/out/$id-A-bed.wav"
echo "$D/out/$id-A.mp4"
