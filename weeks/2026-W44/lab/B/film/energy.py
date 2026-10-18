# Frame-difference energy per 0.5 s window ("Always alive" check, motion skill).
#   python3 energy.py video.mp4 [--json out.json] [--thr 0.35]
# Decodes luma at 270x480, takes the mean absolute difference between consecutive frames (0-255 scale),
# and averages it over each 0.5 s window. A window is static when its energy is below --thr, i.e. the
# frame reads as a still for that half second. Also lists the longest run of near-identical frames.
import json, subprocess, sys
import numpy as np

def energy(path, w=270, h=480):
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", path], capture_output=True, text=True)
    a, b = pr.stdout.strip().split()[0].strip(",").split("/"); fps = float(a) / float(b)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={w}:{h}:flags=area,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))  # d[i] = change from frame i to i+1
    d = np.concatenate([[d[0] if len(d) else 0.0], d])  # frame 0 inherits the first change
    n = int(round(fps * 0.5))
    wins = [(i * 0.5, float(d[i * n:(i + 1) * n].mean())) for i in range(len(d) // n)]
    # longest run of frames whose change is below 0.02 (a true freeze)
    run = best = 0; end = 0
    for i, x in enumerate(d):
        run = run + 1 if x < 0.02 else 0
        if run > best: best, end = run, i
    return fps, wins, best / fps, (end - best + 1) / fps

if __name__ == "__main__":
    path = sys.argv[1]; thr = 0.35; out = None
    if "--thr" in sys.argv: thr = float(sys.argv[sys.argv.index("--thr") + 1])
    if "--json" in sys.argv: out = sys.argv[sys.argv.index("--json") + 1]
    fps, wins, frz, frz_at = energy(path)
    static = [(t, e) for t, e in wins if e < thr]
    lo = min(wins, key=lambda x: x[1])
    print(f"{path}: {len(wins)} windows, lowest {lo[1]:.3f} at {lo[0]:.1f}s, static(<{thr}) {len(static)}, longest freeze {frz:.2f}s at {frz_at:.2f}s")
    print("  static:", " ".join(f"{t:.1f}({e:.2f})" for t, e in static))
    if out: json.dump({"fps": fps, "thr": thr, "windows": wins, "static": static, "lowest": lo, "freeze_s": frz, "freeze_at": frz_at}, open(out, "w"), indent=0)
