"""python3 check_audio.py <id> <outdir> -> cue onset error (frames), music silence inside the cut, duck depth under VO."""
import sys, json, os, numpy as np, soundfile as sf
ID, OUT = sys.argv[1:3]
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "timeline", f"{ID}.json")))
x, sr = sf.read(f"{OUT}/{ID}-sfx.wav"); x = np.abs(x).max(1)
fr = np.sqrt(np.convolve(x ** 2, np.ones(48) / 48, mode="same"))[::48]  # 1 ms rms
bad = []; n = 0
cues = sorted({round(c["t"], 3) for c in D["sfx"] if not c["name"].startswith(("room", "music"))})
for t in cues:
    i = int(t * 1000); pre = fr[max(0, i - 40):max(1, i - 6)].max(); w = fr[max(0, i - 40):i + 60]
    hits = np.nonzero(w > max(pre * 1.6, 1e-4))[0]; n += 1
    on = (max(0, i - 40) + hits[0]) / 1000 if len(hits) else None
    if on is None or abs(on - t) * 30 > 1: bad.append((t, on))
m, _ = sf.read(f"{OUT}/{ID}-music.wav"); m = np.abs(m).max(1); M = D["music"]
db = lambda a, b: 20 * np.log10(np.sqrt(np.mean(m[int(a * sr):int(b * sr)] ** 2)) + 1e-12)
print(f"{ID}: cue onsets checked {n}, off by >1 frame: {len(bad)} {bad[:6]}")
print(f"  music before cut {db(M['cut']-0.8, M['cut']-0.25):.1f} dB | inside cut {db(M['cut']+0.05, M['ret']-0.05):.1f} dB | after return {db(M['ret']+0.05, M['ret']+0.9):.1f} dB")
