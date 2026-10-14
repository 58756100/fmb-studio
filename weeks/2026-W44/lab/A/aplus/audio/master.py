# Master: gain to -14 LUFS integrated, true-peak limit to -1.5 dBTP (4x oversampled look-ahead limiter), verify with
# ffmpeg ebur128. Also writes the music+SFX bed for Wayne's VO at -20 LUFS (headroom for the voice).
# python3 master.py L1 [L2 L3] -> out/A-<id>-master.wav, out/A-<id>-bed.wav
import os, re, subprocess, sys, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "out"); SR = 48000


def measure(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", path, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    s = r[r.rfind("Summary:"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)); LRA = float(re.search(r"LRA:\s+(-?[\d.]+) LU", s).group(1))
    TP = float(re.search(r"Peak:\s+(-?[\d.inf]+) dBFS", s).group(1))
    return {"I": I, "LRA": LRA, "TP": TP}


def limit(x, ceil_db=-1.5, look=0.0015, rel=0.03):
    c = 10 ** (ceil_db / 20)
    up = np.stack([resample_poly(x[:, k], 4, 1) for k in range(x.shape[1])], 1)
    pk = np.abs(up).max(1).reshape(-1, 4).max(1)[: len(x)]
    need = np.minimum(1.0, c / np.maximum(pk, 1e-9))
    L = max(1, int(look * SR))
    # look-ahead: running minimum over the next L samples
    pad = np.concatenate([need, np.ones(L)])
    from numpy.lib.stride_tricks import sliding_window_view
    g = sliding_window_view(pad, L + 1).min(1)[: len(x)]
    # smooth: instant attack (already ahead), exponential release
    a = np.exp(-1 / (rel * SR)); out = np.empty_like(g); cur = 1.0
    for i, v in enumerate(g):
        cur = v if v < cur else a * cur + (1 - a) * v
        out[i] = cur
    # short attack smoothing so the gain never steps
    k = np.ones(L) / L
    out = np.minimum(out, np.convolve(out, k, mode="same"))
    return x * out[:, None]


def render(x, target, tp_ceil, path):
    y = x.copy()
    for _ in range(4):
        tmp = path + ".tmp.wav"; sf.write(tmp, y.astype(np.float32), SR, subtype="FLOAT")
        m = measure(tmp)
        if abs(m["I"] - target) < 0.1 and m["TP"] <= tp_ceil + 0.5: break
        y = limit(y * 10 ** ((target - m["I"]) / 20), tp_ceil)
    os.remove(tmp)
    sf.write(path, y.astype(np.float32), SR, subtype="PCM_24")
    return measure(path)


if __name__ == "__main__":
    res = {}
    for vid in sys.argv[1:] or ["L1", "L2", "L3"]:
        x, sr = sf.read(os.path.join(OUT, f"A-{vid}-premaster.wav")); assert sr == SR
        m = render(x, -14.0, -1.5, os.path.join(OUT, f"A-{vid}-master.wav"))
        b = render(x, -20.0, -1.5, os.path.join(OUT, f"A-{vid}-bed.wav"))
        res[vid] = {"master": m, "bed": b}
        print(vid, "master", m, "bed", b)
    json.dump(res, open(os.path.join(OUT, "loudness.json"), "w"), indent=1)
