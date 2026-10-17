"""python3 check_audio.py <id> <sfx.wav> <music.wav>  -> per-cue onset error (frames @30fps), music cut/return checks"""
import sys, json, os, numpy as np, soundfile as sf
ID, SFX, MUS = sys.argv[1:4]
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data", f"{ID}.json")))
x, sr = sf.read(SFX); x = np.abs(x).max(1) if x.ndim > 1 else np.abs(x)
hop = int(0.001 * sr); fr = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, mode="same"))[::hop]  # 1 ms rms
bad = 0
for t, k in D["sfx"]:
    i = int(t * 1000); pre = fr[max(0, i - 60):i - 8].max() if i > 8 else 0
    s0 = max(0, i - 40); w = fr[s0:i + 60]; thr = max(pre * 2.5, 10 ** (-60 / 20))
    hits = np.nonzero(w > thr)[0]
    on = (s0 + hits[0]) / 1000 if len(hits) else None
    err = None if on is None else (on - t) * 30
    flag = "OK" if err is not None and abs(err) <= 1 else "BAD"; bad += flag == "BAD"
    print(f"{t:5.1f}s {k:14s} onset {on if on is None else round(on,3)}  err {err if err is None else round(err,2)} fr  {flag}")
m, sr = sf.read(MUS); m = np.abs(m).max(1)
M = D["music"]; seg = lambda a, b: 20 * np.log10(np.sqrt(np.mean(m[int(a * sr):int(b * sr)] ** 2)) + 1e-12)
print("music before cut %.1f dB | inside cut %.1f dB | after return %.1f dB" % (seg(M["cut"] - 0.6, M["cut"] - 0.15), seg(M["cut"] + 0.01, M["ret"] - 0.01), seg(M["ret"], M["ret"] + 0.8)))
first = np.nonzero(m[int((M["cut"] - 0.3) * sr):] < 1e-6)[0]; print("music silent from %.3f s" % (M["cut"] - 0.3 + first[0] / sr))
back = np.nonzero(m[int(M["cut"] * sr) + 10:] > 1e-4)[0]; print("music returns at %.3f s" % (M["cut"] + (back[0] + 10) / sr))
if "silence" in M: print("brief silence %.1f-%.1f: %.1f dB" % (M["silence"][0], M["silence"][1], seg(M["silence"][0] + 0.03, M["silence"][1] - 0.03)))
if "dip" in M: print("dip %.1f dB vs before %.1f dB" % (seg(7.1, 7.9), seg(6.1, 6.9)))
print("cues bad:", bad, "of", len(D["sfx"]))
