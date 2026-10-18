"""python3 motion_check.py master.mp4 -> frame-difference energy per 0.5 s (15-frame) window.
Energy = mean absolute luma difference between consecutive frames (0-255 scale, frames decoded at 540x960), averaged over the
window. Reports the lowest non-overlapping window, the lowest sliding window, and the longest run of near-identical frames."""
import sys, subprocess, numpy as np
W, H = 540, 960
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
v = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.int16)
d = np.abs(np.diff(v, axis=0)).mean(axis=(1, 2))           # d[i] = change from frame i to i+1
n = len(d); win = [d[i:i + 15].mean() for i in range(0, n - 14, 15)]
slide = np.array([d[i:i + 15].mean() for i in range(0, n - 14)])
k = int(np.argmin(win)); s = int(np.argmin(slide))
still = d < 0.02; run = best = 0; end = 0
for i, x in enumerate(still):
    run = run + 1 if x else 0
    if run > best: best, end = run, i
print(f"frames {len(v)} | 0.5 s windows {len(win)} | lowest window {min(win):.3f} at {k*0.5:.1f}-{k*0.5+0.5:.1f} s | lowest sliding window {slide[s]:.3f} at {s/30:.2f}-{(s+15)/30:.2f} s | median window {np.median(win):.3f} | longest near-identical run {best} frames | loop seam (last->first) {np.abs(v[-1]-v[0]).mean():.3f}")
