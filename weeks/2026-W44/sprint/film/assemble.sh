#!/bin/bash
# ./assemble.sh <id> <hook>  -> out/masters/<id>-<hook>.mp4: the rendered video (out/video, no re-encode) + the AAC master
# from audio/score.py (copied, so the measured AAC is the delivered AAC), then the checks: length, loudness/true peak on the
# delivered file, A/V offset (stream starts + cross-correlation against the master wav), energy per 0.5 s window, streams.
set -euo pipefail
cd "$(dirname "$0")"
ID=$1; HK=$2; V=out/video/$ID-$HK.mp4; A=out/audio/$ID-$HK-master.m4a; O=out/masters/$ID-$HK.mp4
mkdir -p out/masters
ffmpeg -v error -y -i $V -i $A -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart $O
python3 - "$O" "out/audio/$ID-$HK-master.wav" "out/cues/$ID-$HK.json" <<'PY'
import sys, json, subprocess, numpy as np, soundfile as sf
O, W, C = sys.argv[1:]; c = json.load(open(C))
pr = lambda *a: subprocess.run(["ffprobe", "-v", "error", *a, O], capture_output=True, text=True).stdout.strip()
vs = pr("-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height,r_frame_rate,start_time,duration,nb_frames", "-of", "json")
as_ = pr("-select_streams", "a:0", "-show_entries", "stream=codec_name,sample_rate,channels,start_time,duration", "-of", "json")
v = json.loads(vs)["streams"][0]; a = json.loads(as_)["streams"][0]
subs = pr("-select_streams", "s", "-show_entries", "stream=index", "-of", "csv=p=0")
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", O, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(r.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0]); TP = float(r.split("True peak:")[1].split("Peak:")[1].split("dBFS")[0])
dec = subprocess.run(["ffmpeg", "-v", "error", "-i", O, "-f", "f32le", "-ac", "1", "-ar", "48000", "-"], capture_output=True).stdout
y = np.frombuffer(dec, np.float32); x, _ = sf.read(W); x = x.mean(1)
n = min(len(x), len(y), 48000 * 12); seg = slice(48000 * 2, n)
best = max(range(-480, 481, 1), key=lambda k: float(np.dot(x[seg], np.roll(y, -k)[seg])))
vo_len = c["last"]; tail = c["duration"] - c["last"]
last_shot = c["shots"][-1]; cta = c["heads"][-1]
res = {"file": O, "video": f'{v["codec_name"]} {v["width"]}x{v["height"]} {v["r_frame_rate"]} frames={v["nb_frames"]}', "audio": f'{a["codec_name"]} {a["sample_rate"]} ch={a["channels"]}',
       "v_dur": float(v["duration"]), "a_dur": float(a["duration"]), "expected": c["duration"], "vo_end": round(vo_len, 3), "tail": round(tail, 3),
       "v_start": float(v["start_time"]), "a_start": float(a["start_time"]), "xcorr_lag_samples": best, "lufs_I": I, "true_peak": TP, "subtitle_streams": subs or "none",
       "cta": f'"{cta["text"]}" at {cta["t0"]:.2f}s, last shot starts {last_shot["at"]:.2f}s ({"over final frame" if cta["t0"] >= last_shot["at"] + last_shot["d"] / 2 else "BEFORE FINAL SHOT"})'}
for k, val in res.items(): print(f"  {k}: {val}")
json.dump(res, open(O[:-4] + "-check.json", "w"), indent=1)
PY
python3 energy.py $O --json out/masters/$ID-$HK-energy.json
