"""W44 lab lane B score + SFX + mix (adapted from kit/audio/audio.py).

python3 score.py B-L1 OUTDIR  ->  OUTDIR/B-L1-music.wav, -sfx.wav, -bed.wav (music+SFX at mix-reference level, VO-ready),
                                  -master.wav (bed mastered to -14 LUFS, <= -1 dBTP), -cues.json
Everything is timed from src/data/<id>.json: SFX onsets land on their spec second, music cuts/returns on the spec seconds,
music ducks 7 dB under every VO window (the same windows as the burned-in subtitles and vo-script.md).
"""
import json, sys, os, subprocess
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

ID, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, "..", "src", "data", f"{ID}.json")))
SR = 48000; DUR = 30.0; N = int(DUR * SR)
rng = np.random.default_rng({"B-L1": 11, "B-L2": 22, "B-L3": 33}[ID])

def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype="high", fs=SR, output="sos"), x)
def env(n, a, d):
    t = np.arange(n) / SR; e = np.exp(-t / max(d, 1e-4))
    if a > 0: e *= np.clip(t / a, 0, 1)
    return e
def sine(f, n, ph=0):
    if np.isscalar(f): return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def noise(n): return rng.standard_normal(n)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def add(buf, x, t, g=1.0, pan=0.0):
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x))
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += x[:j - i] * g * l * 1.414; buf[i:j, 1] += x[:j - i] * g * r * 1.414

# ------------------------------------------------------------------ instruments
def kick(g=1.0, d=0.2):
    n = int(0.45 * SR); t = np.arange(n) / SR
    x = sine(45 + 90 * np.exp(-t / 0.03), n) * env(n, 0.001, d) + 0.25 * hp(noise(n), 3000) * env(n, 0, 0.003)
    return np.tanh(1.5 * x) * g
def rim():
    n = int(0.12 * SR); return (bp(noise(n), 1500, 4500) * env(n, 0, 0.012) + 0.5 * sine(1700, n) * env(n, 0, 0.01)) * 0.45
def clap():
    n = int(0.3 * SR); x = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR); x[i:] += bp(noise(n - i), 900, 2600) * env(n - i, 0, 0.012 if k < 2 else 0.09)
    return x * 0.4
def hat(o=False):
    n = int((0.16 if o else 0.045) * SR); return hp(noise(n), 7000) * env(n, 0, 0.05 if o else 0.012) * 0.3
def shaker():
    n = int(0.07 * SR); return bp(noise(n), 5000, 11000) * env(n, 0.012, 0.02) * 0.22
def sub(m, dur):
    n = int(dur * SR); f = note(m); x = sine(f, n) + 0.22 * sine(2 * f, n)
    e = np.minimum(1, np.arange(n) / (0.01 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
    return np.tanh(1.2 * x * e) * 0.5
def pluck(m, dur=0.45, bright=3000, dec=0.16):
    n = int(dur * SR); f = note(m)
    saw = 2 * ((np.arange(n) * f / SR) % 1) - 1; saw2 = 2 * ((np.arange(n) * f * 1.004 / SR) % 1) - 1
    return lp(0.5 * (saw + saw2), bright) * env(n, 0.002, dec) * 0.22
def pizz(m, dur=0.3):
    n = int(dur * SR); f = note(m)
    x = sine(f, n) + 0.5 * sine(2 * f, n) + 0.2 * sine(3 * f, n)
    return lp(x, 2600) * env(n, 0.001, 0.07) * 0.28
def keys(m, dur=1.2):  # soft felt-piano-ish tone
    n = int(dur * SR); f = note(m)
    x = sine(f, n) + 0.35 * sine(2 * f, n) * env(n, 0, 0.25) + 0.1 * sine(3 * f, n) * env(n, 0, 0.12)
    return x * env(n, 0.004, 0.55) * 0.18
def pad(ms, dur, cut=1400):
    n = int(dur * SR); x = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.07):
            f = note(m) * 2 ** (d / 12); x += 2 * ((np.arange(n) * f / SR + rng.random()) % 1) - 1
    x = lp(x / (len(ms) * 3), cut, 2)
    a = np.minimum(1, np.arange(n) / (0.5 * SR)); r = np.minimum(1, (n - np.arange(n)) / (0.5 * SR))
    return x * a * r * 0.3

# ------------------------------------------------------------------ score
M = D["music"]; BPM = M["bpm"]; BEAT = 60 / BPM; BAR = 4 * BEAT; T0 = M["T0"]; R = M["root"]
MINOR = [(0, [12, 15, 19]), (-4, [8, 12, 15]), (3, [15, 19, 22]), (-2, [10, 14, 17])]     # i  VI  III  VII
MAJOR = [(0, [12, 16, 19]), (-3, [9, 12, 16]), (5, [17, 21, 24]), (7, [19, 23, 26])]       # I  vi  IV  V
PROG = MINOR if M["mode"] == "minor" else MAJOR
style = M["style"]
cut, ret = M["cut"], M["ret"]; thin = M.get("thin", cut)
music = np.zeros((N, 2))
bar_t = T0 - BAR * int(np.ceil(T0 / BAR))
bi = 0
while bar_t < DUR:
    k = int(round((bar_t - T0) / BAR)); root, ch = PROG[k % 4]
    for b in range(4):
        tb = bar_t + b * BEAT
        if tb < -0.001 or tb >= DUR: continue
        live = tb < cut or tb >= ret - 1e-6
        full = live and not (thin <= tb < cut)
        post = tb >= ret - 1e-6
        if full:
            if style == "observe":
                if b in (0, 2): add(music, kick(0.75), tb)
                add(music, hat(), tb + BEAT / 2, 0.7, 0.3)
                if b == 3 and k % 2: add(music, hat(True), tb + BEAT / 2, 0.5, -0.3)
            elif style == "warm":
                if b in (0, 2): add(music, kick(0.7), tb)
                if b in (1, 3): add(music, rim(), tb, 0.8, 0.15)
                for s in range(4): add(music, shaker(), tb + s * BEAT / 4, 0.8 if s % 2 else 0.5, -0.3)
            else:  # investigate
                if b == 0 or (b == 2 and k % 2 == 0): add(music, kick(0.75, 0.16), tb)
                if b == 1: add(music, kick(0.45, 0.12), tb + BEAT / 2)
                if b in (1, 3): add(music, clap(), tb, 0.55)
                add(music, hat(), tb + BEAT / 2, 0.6, 0.3); add(music, hat(), tb, 0.3, -0.3)
        # arp / plucks (8ths)
        if full:
            for e in range(2):
                te = tb + e * BEAT / 2; idx = (b * 2 + e)
                m = R + ch[[0, 1, 2, 1, 2, 0, 1, 2][idx] % 3] + (12 if post and idx == 7 else 0)
                if style == "investigate":
                    if idx in (0, 3, 5, 6): add(music, pizz(m), te, 0.9, -0.3 if idx % 2 else 0.3)
                elif style == "warm":
                    add(music, pluck(m, 0.4, 3400 if post else 2600, 0.14), te, 0.7, -0.35 if idx % 2 else 0.35)
                else:
                    add(music, pluck(m, 0.5, 1800 if not post else 2600, 0.2), te, 0.6, -0.35 if idx % 2 else 0.35)
    # sustained layers per bar (pad + sub) — play through the "thin" section, stop at the cut
    seg_end = min(bar_t + BAR, cut) if bar_t < cut else bar_t + BAR
    live_bar = bar_t < cut or bar_t >= ret - 1e-6
    if live_bar and seg_end > max(bar_t, 0) + 0.05:
        s0 = max(bar_t, 0.0); dur = seg_end - s0
        add(music, sub(R + root - 12, dur), s0, 0.8)
        add(music, pad([R + c for c in ch], dur + (0.3 if seg_end < cut or bar_t >= ret else 0.02), 1200 if style == "observe" else 1600), s0, 0.5 if bar_t < thin or bar_t >= ret else 0.7)
        if style == "observe" and bar_t >= 0:  # sparse felt-piano motif, the "observant" colour
            add(music, keys(R + 12 + ch[2], 1.6), bar_t + BEAT * 1.5, 0.8, 0.2); add(music, keys(R + 12 + ch[1], 1.6), bar_t + BEAT * 3, 0.6, -0.2)
    bar_t += BAR

# tape stop into the cut (0.12 s, ends exactly on the cut second), dead silence until the return
ts, te = int((cut - 0.12) * SR), int(cut * SR)
seg = music[ts:te].copy(); L = te - ts
pos = np.clip(np.cumsum(np.linspace(1, 0.1, L)), 0, L - 1).astype(int)
music[ts:te] = seg[pos] * np.linspace(1, 0, L)[:, None] ** 0.6
music[te:int(ret * SR)] = 0
# L2: music dip 7-8 s (-8 dB) and brief silence 13.0-13.6 s
def gain_ramp(a, b, g, ramp=0.05):
    e = np.ones(N); i0, i1 = int(a * SR), int(b * SR); r = int(ramp * SR)
    e[i0:i1] = g; e[i0:i0 + r] = np.linspace(1, g, r); e[i1 - r:i1] = np.linspace(g, 1, r) if b < DUR else g
    return e
if "dip" in M: music *= gain_ramp(*M["dip"], 10 ** (-8 / 20))[:, None]
if "silence" in M: music *= gain_ramp(*M["silence"], 0.0, 0.02)[:, None]
# end: stop at 30.0 with a 20 ms fade (the loop restarts on the hook)
music[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))[:, None]

# ------------------------------------------------------------------ SFX (onset = the cue's second)
sfx = np.zeros((N, 2))
def click(f=3200, g=0.6):
    n = int(0.03 * SR); return (hp(noise(n), 1500) * env(n, 0, 0.003) + 0.4 * sine(f, n) * env(n, 0, 0.004)) * g
def tick(f=2400):
    n = int(0.08 * SR); t = np.arange(n) / SR; return sine(f * (1 + 0.3 * np.exp(-t / 0.004)), n) * env(n, 0.0005, 0.018) * 0.4
def tink(f=1800, d=0.09):
    n = int(0.4 * SR); return (sine(f, n) + 0.5 * sine(f * 1.5, n) + 0.2 * sine(f * 2.76, n)) * env(n, 0.001, d) * 0.22
def popf(f=900, d=0.025):
    n = int(0.1 * SR); t = np.arange(n) / SR; return sine(f * (1 + 0.8 * np.exp(-t / 0.01)), n) * env(n, 0.001, d) * 0.4
def thump(f=110, d=0.08, g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR; return np.tanh(2 * sine(f * (1 + 0.6 * np.exp(-t / 0.02)), n) * env(n, 0.001, d)) * 0.5 * g
def whoosh(L, f0=600, f1=4000, g=1.0, peak=0.35):
    n = int(L * SR); x = noise(n); out = np.zeros(n); sg = 512
    for i in range(0, n, sg):
        p = i / n; fc = f0 * (f1 / f0) ** p; out[i:i + sg] = bp(x[i:i + sg], max(80, fc * 0.6), min(20000, fc * 1.6), 1)
    u = np.linspace(0, 1, n); e = np.where(u < peak, (u / peak) ** 0.7, ((1 - u) / (1 - peak)) ** 1.6)
    e[:int(0.002 * SR)] = np.maximum(e[:int(0.002 * SR)], 0.35)  # defined onset on the frame
    return out * e * 0.4 * g
def chime(f=1320, d=0.5):
    n = int(1.2 * SR); return (sine(f, n) + 0.6 * sine(f * 1.5, n) + 0.25 * sine(f * 2, n)) * env(n, 0.002, d) * 0.18
def shutter():
    n = int(0.13 * SR); x = np.zeros(n)
    for o in (0, 0.05):
        i = int(o * SR); m = int(0.03 * SR); x[i:i + m] += bp(noise(m), 1500, 7000) * env(m, 0, 0.006)
    return x * 0.6
def lowhit(f0=50):
    n = int(0.7 * SR); t = np.arange(n) / SR
    return np.tanh(2 * sine(f0 + 70 * np.exp(-t / 0.03), n) * env(n, 0.001, 0.2)) * 0.6 + lp(noise(n), 1000) * env(n, 0, 0.02) * 0.3
def slide(L=0.28, g=0.8):  # card / sheet slide: soft filtered friction with a defined front edge
    n = int(L * SR); y = bp(noise(n), 700, 3500) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.8 * 0.22 * g
    c = click(2600, 0.25); y[:len(c)] += c
    return y
def keyclick():
    n = int(0.035 * SR); return (bp(noise(n), 2500, 9000) * env(n, 0, 0.004) + 0.3 * sine(rng.uniform(1600, 2200), n) * env(n, 0, 0.006)) * rng.uniform(0.7, 1)
def typing(t0, t1, n):
    for k in range(n): add(sfx, keyclick(), t0 + (t1 - t0) * k / n + (0 if k == 0 else rng.uniform(-0.008, 0.008)), 0.6, rng.uniform(-0.25, 0.25))
def muted():  # muted stop: low thud + damped click
    return thump(85, 0.06, 0.9)[:int(0.3 * SR)] + np.pad(click(1800, 0.25), (0, int(0.3 * SR) - int(0.03 * SR)))
def resolve(fs=(1046.5, 1318.5, 1568.0), d=0.6, g=1.0):
    x = np.zeros(int(1.5 * SR))
    for k, f in enumerate(fs):
        c = chime(f, d); i = int(k * 0.06 * SR); x[i:i + len(c)] += c[:len(x) - i]
    return x * g

def place(t, kind):
    P = rng.uniform(-0.2, 0.2)
    if kind == "msgTap": add(sfx, click(3000, 0.5), t); add(sfx, popf(1150), t, 0.8)
    elif kind == "photoOpen": add(sfx, click(3400, 0.6), t); add(sfx, whoosh(0.32, 900, 5000, 0.7, 0.3), t, 0.6, P); add(sfx, shutter(), t + 0.02, 0.35)
    elif kind == "softLand": add(sfx, thump(95, 0.1, 0.9), t); add(sfx, slide(0.18, 0.5), t, 0.6)
    elif kind == "whoosh": add(sfx, whoosh(0.42, 500, 5200, 1.0, 0.3), t, 0.9, P)
    elif kind in ("tick", "smallTick", "shortTick", "lowTick"):
        add(sfx, tick({"tick": 2400, "smallTick": 2800, "shortTick": 3000, "lowTick": 1300}[kind]), t, 0.9 if kind != "lowTick" else 1.0, P)
    elif kind == "qTick": add(sfx, tick(1900), t, 0.9); add(sfx, tick(2550), t + 0.09, 0.8)  # rising two-note "question"
    elif kind == "swipe": add(sfx, whoosh(0.3, 1500, 4500, 0.8, 0.25), t, 0.8, 0.4); add(sfx, click(2600, 0.2), t)
    elif kind in ("mutedStop", "lowStop"): add(sfx, muted(), t, 1.0 if kind == "mutedStop" else 1.1)
    elif kind == "pivotHit": add(sfx, lowhit(48), t, 1.0)
    elif kind == "cardSlide": add(sfx, slide(0.3, 0.9), t, 1.0, -0.2)
    elif kind == "softLift": add(sfx, whoosh(0.5, 300, 1800, 0.7, 0.5), t, 0.8); add(sfx, thump(130, 0.05, 0.5), t)
    elif kind in ("revealClick",): add(sfx, click(3600, 0.7), t); add(sfx, chime(1046.5, 0.7), t + 0.01, 0.7)
    elif kind in ("tap", "lightTap", "rowTap", "linkTap"): add(sfx, click({"tap": 3200, "lightTap": 3800, "rowTap": 3000, "linkTap": 3400}[kind], 0.6), t); add(sfx, popf(1400, 0.015), t, 0.5)
    elif kind == "sheetOpen": add(sfx, slide(0.34, 1.0), t, 1.0); add(sfx, popf(700, 0.04), t + 0.0, 0.5)
    elif kind == "softResolve": add(sfx, resolve((880, 1108.7, 1318.5), 0.7, 0.9), t)
    elif kind in ("ctaTap",): add(sfx, click(3000, 0.8), t); add(sfx, popf(1000, 0.03), t, 0.8); add(sfx, tink(2093, 0.12), t + 0.15, 0.7)
    elif kind == "lightResolve": add(sfx, resolve((1318.5, 1568.0), 0.5, 0.7), t)
    elif kind in ("msgPickup", "openingPickup"): add(sfx, popf(1150), t, 0.8); add(sfx, whoosh(0.3, 2500, 900, 0.5, 0.15), t, 0.6)
    elif kind == "pairedHits": add(sfx, thump(120, 0.08, 0.8), t, 1, -0.4); add(sfx, thump(120, 0.08, 0.8), t + 0.13, 1, 0.4)
    elif kind == "labelTicks": add(sfx, tick(2600), t, 0.9, -0.4); add(sfx, tick(2600), t + 0.12, 0.9, 0.4)
    elif kind == "pairedTaps": add(sfx, click(3200, 0.6), t, 1, -0.4); add(sfx, click(3200, 0.6), t + 0.13, 1, 0.4)
    elif kind == "typing": typing(t, t + 0.85, 11)
    elif kind == "alignClick": add(sfx, click(2200, 0.9), t); add(sfx, tick(3300), t + 0.04, 0.6)
    elif kind == "softContract": add(sfx, whoosh(0.35, 3000, 700, 0.6, 0.2), t, 0.7); add(sfx, thump(160, 0.04, 0.4), t)
    elif kind == "softSettle": add(sfx, thump(140, 0.06, 0.6), t); add(sfx, tink(1568, 0.2), t, 0.5)
    elif kind == "resolve": add(sfx, resolve((1046.5, 1318.5, 1568.0, 2093.0), 0.6, 0.9), t)
    elif kind == "softSlide": add(sfx, slide(0.32, 0.8), t, 0.9, 0.3)
    elif kind == "commentPop": add(sfx, popf(950), t, 0.9, P)
    elif kind == "firmPop": add(sfx, popf(760, 0.04), t, 1.2); add(sfx, thump(150, 0.05, 0.6), t)
    elif kind == "copyTick": add(sfx, tick(2400), t, 0.8); add(sfx, tick(2400), t + 0.11, 0.6)
    elif kind == "cleanResolve": add(sfx, click(3600, 0.4), t); add(sfx, resolve((1318.5, 1975.5), 0.55, 0.8), t)
    else: raise SystemExit("unknown sfx " + kind)
for t, kind in D["sfx"]: place(float(t), kind)
# a soft transition whoosh under each visible cut that has no listed whoosh is NOT added: the spec lists every sound.

# ------------------------------------------------------------------ mix
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
act = lambda x: x[np.abs(x).sum(1) > 1e-5]
music *= 10 ** ((-24 - rms_db(act(music))) / 20)
sfx *= 10 ** ((-25 - rms_db(act(sfx))) / 20)
# duck the music 7 dB under every VO window (attack 80 ms before, release 200 ms after)
duck = np.ones(N)
for a, b, _ in D["subs"]:
    i0, i1 = int((a - 0.08) * SR), int((b + 0.2) * SR); duck[max(0, i0):min(N, i1)] = 10 ** (-7 / 20)
k = int(0.08 * SR); duck = np.convolve(np.pad(duck, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
music_d = music * duck[:, None]
bed = music_d + sfx
os.makedirs(OUT, exist_ok=True)

def true_peak_db(x):
    up = resample_poly(x, 4, 1, axis=0); return 20 * np.log10(np.abs(up).max() + 1e-12)
def limit_tp(x, ceil_db=-1.5):
    """lookahead peak limiter on the 4x-oversampled envelope (fast attack, 80 ms release)"""
    up = np.abs(resample_poly(x, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:len(x)]
    c = 10 ** (ceil_db / 20); g = np.minimum(1, c / np.maximum(up, 1e-12))
    la = int(0.003 * SR); g = _minfilter(g, la)
    rel = np.exp(-1 / (0.08 * SR)); out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else cur * rel + (1 - rel) * g[i]; out[i] = cur
    return x * out[:, None]
def _minfilter(g, la):
    from scipy.ndimage import minimum_filter1d
    return minimum_filter1d(g, size=2 * la + 1, mode="nearest")

def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float(r.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0]); TP = float(r.split("True peak:")[1].split("Peak:")[1].split("dBFS")[0])
    LRA = float(r.split("Loudness range:")[1].split("LRA:")[1].split("LU")[0])
    return I, TP, LRA

base = os.path.join(OUT, ID)
# bed: VO-ready, mix-reference level (music -24 / SFX -25 dB RMS, a VO at about -20 dB RMS sits on top), peaks <= -3 dBFS
pk = np.abs(bed).max(); bed_out = bed * (10 ** (-3 / 20) / pk) if pk > 10 ** (-3 / 20) else bed
sf.write(base + "-bed.wav", bed_out.astype(np.float32), SR, subtype="PCM_24")
sf.write(base + "-music.wav", (music_d * 0.7).astype(np.float32), SR, subtype="PCM_24")
sf.write(base + "-sfx.wav", (sfx * 0.7).astype(np.float32), SR, subtype="PCM_24")
# master: static gain to -14 LUFS integrated, true-peak limit at -2.0 dBTP (AAC margin), iterate once
tmp = base + "-tmp.wav"; x = bed.copy()
for it in range(4):
    sf.write(tmp, x.astype(np.float32), SR, subtype="FLOAT"); I, TP, LRA = lufs(tmp)
    if abs(I + 14) < 0.15 and TP <= -1.8: break
    x = x * 10 ** ((-14 - I) / 20); x = limit_tp(x, -2.0)
sf.write(base + "-master.wav", x.astype(np.float32), SR, subtype="PCM_24")
os.remove(tmp)
I, TP, LRA = lufs(base + "-master.wav")
json.dump({"id": ID, "lufs_I": I, "true_peak_dBTP": TP, "LRA": LRA, "sfx": D["sfx"], "duck_db": -7, "vo_windows": [s[:2] for s in D["subs"]],
           "music": M}, open(base + "-cues.json", "w"), indent=1)
print(ID, "master I=%.2f LUFS TP=%.2f dBTP LRA=%.1f" % (I, TP, LRA))
