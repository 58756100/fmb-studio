# QA for the A+ masters: python3 check.py A-L1 [A-L2 A-L3]
# duration/format, loudness of the muxed audio, A/V-mux lag vs the master wav, SFX onsets at the spec hit points (±1 frame),
# and the 9-still final contact sheet from the rendered mp4.
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000; FR = 1 / 30
sys.path.insert(0, os.path.join(HERE, "audio")); import master  # noqa
SHEET_T = {"A-L1": [0.5, 3.6, 7.6, 10.6, 13.6, 16.6, 19.6, 23.6, 27.5], "A-L2": [0.5, 3.8, 5.6, 9.6, 12.6, 15.6, 16.6, 21.6, 26.6],
           "A-L3": [0.5, 3.6, 5.6, 7.6, 10.6, 15.6, 17.6, 19.6, 26.6]}
TITLE = {"A-L1": "A-L1 (A+)  Collectors: the upgrade a finished-car photo cannot prove", "A-L2": "A-L2 (A+)  Garages: the same finished-car photo can hide very different work",
         "A-L3": "A-L3 (A+)  Parts suppliers: a guess can become the answer"}
FONT = os.path.join(HERE, "..", "fonts", "ibm-plex-mono-latin-500-normal.woff2")


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,width,height,r_frame_rate,sample_rate,nb_frames,profile", "-of", "json", p], capture_output=True, text=True)
    return json.loads(r.stdout)


def onset(x, t, pre=0.02, post=0.06):
    a, b = max(0, int((t - pre) * SR)), int((t + post) * SR); seg = np.abs(x[a:b]).max(1)
    thr = 0.2 * seg.max(); i = int(np.argmax(seg > thr))
    return (a + i) / SR - t


def sheet(vid, mp4):
    d = os.path.join(HERE, "..", "storyboard", vid); os.makedirs(d, exist_ok=True)
    W, H, cols, pad, lab, top = 360, 640, 5, 24, 46, 80
    ims = []
    for t in SHEET_T[vid]:
        f = os.path.join(HERE, "out", f"{vid}-f{t:.1f}.png")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t}", "-i", mp4, "-frames:v", "1", f], check=True)
        ims.append((t, f))
    rows = (len(ims) + cols - 1) // cols
    sh = Image.new("RGB", (cols * W + (cols + 1) * pad, top + rows * (H + lab + pad) + pad), "#0E0E0E"); dr = ImageDraw.Draw(sh)
    try: fnt = lambda s: ImageFont.truetype(FONT, s)
    except Exception: fnt = None
    def font(s):
        try: return ImageFont.truetype(FONT, s)
        except Exception: return ImageFont.load_default(size=s)
    dr.text((pad, 24), TITLE[vid] + "  · final render", fill="#DDDDDD", font=font(28))
    for i, (t, f) in enumerate(ims):
        im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
        x = pad + (i % cols) * (W + pad); y = top + (i // cols) * (H + lab + pad)
        dr.text((x, y + 4), f"{t:04.1f} s", fill="#FFFFFF", font=font(30)); sh.paste(im, (x, y + lab)); dr.rectangle([x - 1, y + lab - 1, x + W, y + lab + H], outline="#555555")
        os.remove(f)
    out = os.path.join(d, f"{vid}-final-sheet.png"); sh.save(out, optimize=True); return out


report = {}
for vid in sys.argv[1:] or ["A-L1", "A-L2", "A-L3"]:
    v = vid[2:]; mp4 = os.path.join(HERE, "out", f"{vid}-A.mp4")
    info = probe(mp4)
    wav = os.path.join(HERE, "out", f"{vid}-mux.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-vn", "-c:a", "pcm_f32le", wav], check=True)
    loud = master.measure(wav); mux, _ = sf.read(wav); ref, _ = sf.read(os.path.join(HERE, "audio", "out", f"{vid}-master.wav"))
    n = 3 * SR; c = np.correlate(mux[:n + 2000, 0], ref[:n, 0], "valid"); lag = int(np.argmax(c))
    os.remove(wav)
    ev = json.load(open(os.path.join(HERE, "audio", "out", f"{vid}-events.json")))
    sfx, _ = sf.read(os.path.join(HERE, "audio", "out", f"{vid}-sfx.wav")); mus, _ = sf.read(os.path.join(HERE, "audio", "out", f"{vid}-music.wav"))
    hits = []
    for h in ev["hits"]:
        has = any(abs(t - h) < 0.005 for t, _ in ev["events"])
        off = onset(sfx if has else mus, h)
        hits.append({"t": h, "layer": "sfx" if has else "music", "offset_ms": round(off * 1000, 1), "ok": abs(off) <= FR})
    cues = [{"t": t, "name": nm, "offset_ms": round(onset(sfx, t) * 1000, 1)} for t, nm in ev["events"]]
    report[vid] = {"duration": float(info["format"]["duration"]), "streams": info["streams"], "loudness_mp4": loud, "mux_lag_samples": lag,
                   "hits": hits, "all_hits_ok": all(h["ok"] for h in hits), "cues_max_offset_ms": max(abs(c["offset_ms"]) for c in cues), "sheet": sheet(vid, mp4)}
    print(vid, json.dumps({k: report[vid][k] for k in ("duration", "loudness_mp4", "mux_lag_samples", "all_hits_ok", "cues_max_offset_ms", "sheet")}))
    print("   hits", [(h["t"], h["layer"], h["offset_ms"]) for h in hits])
json.dump(report, open(os.path.join(HERE, "out", "qa.json"), "w"), indent=1)
