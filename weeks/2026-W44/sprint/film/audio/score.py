"""W44 sprint masters: score + SFX + VO mix + master for one reel version (<id>-<hook>).
Reuses the synth instruments and SFX palette of lab/C/v3film/audio/score.py and lab/B/film/audio/score.py, retimed to the
sprint film: everything comes from out/cues/<id>-<hook>.json (node cues.mjs), which is exported from the same build()
the frames are rendered from, so every SFX lands on the frame of its on-screen action.

python3 audio/score.py A-L1 A OUTDIR -> OUTDIR/<id>-<hook>-bed.wav (music + SFX, no VO, mix-reference level),
    -vo.wav (assembled VO track), -master.wav and -master.m4a (VO + bed, -14 LUFS, true peak <= -1 dBTP measured after
    the AAC encode), -cues.json (what was placed, levels)
Sound rules (sound skill + the brief): one sound per on-screen action (reel cue list + transitions + headline landings),
music cut to silence (tape stop) before the reveal and back in on a downbeat, bed ducked 7 dB under speech, VO on top.
"""
import json, sys, os, subprocess
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import minimum_filter1d

ID, HOOK, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
FILM = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(FILM, "out", "cues", f"{ID}-{HOOK}.json")))
SR = 48000; DUR = D["duration"]; N = int(round(DUR * SR))
rng = np.random.default_rng(sum(map(ord, ID)) * 7 + ord(HOOK))

def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos"), x)
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
def L(s): return int(round(s * SR))

# ------------------------------------------------------------------ instruments
def kick(g=1.0, d=0.2):
    n = L(0.45); t = np.arange(n) / SR
    return np.tanh(1.5 * (sine(45 + 90 * np.exp(-t / 0.03), n) * env(n, 0.001, d) + 0.25 * hp(noise(n), 3000) * env(n, 0, 0.003))) * g
def rim(): n = L(0.12); return (bp(noise(n), 1500, 4500) * env(n, 0, 0.012) + 0.5 * sine(1700, n) * env(n, 0, 0.01)) * 0.45
def hat(o=False): n = L(0.16 if o else 0.045); return hp(noise(n), 7000) * env(n, 0, 0.05 if o else 0.012) * 0.3
def shaker(): n = L(0.07); return bp(noise(n), 5000, 11000) * env(n, 0.012, 0.02) * 0.22
def sub(m, dur):
    n = L(dur); f = note(m); x = sine(f, n) + 0.22 * sine(2 * f, n)
    e = np.minimum(1, np.arange(n) / (0.01 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
    return np.tanh(1.2 * x * e) * 0.5
def pluck(m, dur=0.45, bright=3000, dec=0.16):
    n = L(dur); f = note(m)
    s1 = 2 * ((np.arange(n) * f / SR) % 1) - 1; s2 = 2 * ((np.arange(n) * f * 1.004 / SR) % 1) - 1
    return lp(0.5 * (s1 + s2), bright) * env(n, 0.002, dec) * 0.22
def pizz(m, dur=0.3):
    n = L(dur); f = note(m); return lp(sine(f, n) + 0.5 * sine(2 * f, n) + 0.2 * sine(3 * f, n), 2600) * env(n, 0.001, 0.07) * 0.28
def keys(m, dur=1.2):
    n = L(dur); f = note(m)
    return (sine(f, n) + 0.35 * sine(2 * f, n) * env(n, 0, 0.25) + 0.1 * sine(3 * f, n) * env(n, 0, 0.12)) * env(n, 0.004, 0.55) * 0.18
def pad(ms, dur, cut=1400):
    n = L(dur); x = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.07):
            x += 2 * ((np.arange(n) * note(m) * 2 ** (d / 12) / SR + rng.random()) % 1) - 1
    x = lp(x / (len(ms) * 3), cut, 2)
    return x * np.minimum(1, np.arange(n) / (0.5 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.5 * SR)) * 0.3


# ------------------------------------------------------------------ score (spec from the reel's build(): film.music)
SPEC = {"bpm": 100, "root": 53, "mode": "minor", "style": "investigate"}; SPEC.update(D.get("music") or {})
M = SPEC; BPM = M["bpm"]; BEAT = 60 / BPM; BAR = 4 * BEAT; R = M["root"]
cut, ret = M.get("cut", DUR + 1), M.get("ret", DUR + 1)
T0 = M.get("T0", ret if ret < DUR else 0.0)          # phase: the return lands on a downbeat
MINOR = [(0, [12, 15, 19]), (-4, [8, 12, 15]), (3, [15, 19, 22]), (-2, [10, 14, 17])]   # i VI III VII
MAJOR = [(0, [12, 16, 19]), (-3, [9, 12, 16]), (5, [17, 21, 24]), (7, [19, 23, 26])]    # I vi IV V
PROG = MINOR if M["mode"] == "minor" else MAJOR
style = M["style"]
music = np.zeros((N, 2))
bar_t = T0 - BAR * int(np.ceil(T0 / BAR))
while bar_t < DUR:
    k = int(round((bar_t - T0) / BAR)); root, ch = PROG[k % 4]
    for b in range(4):
        tb = bar_t + b * BEAT
        if tb < -0.001 or tb >= DUR: continue
        live = tb < cut or tb >= ret - 1e-6; post = tb >= ret - 1e-6
        if not live: continue
        if style == "observe":
            if b in (0, 2): add(music, kick(0.7), tb)
            add(music, hat(), tb + BEAT / 2, 0.6, 0.3)
            if b == 3 and k % 2: add(music, hat(True), tb + BEAT / 2, 0.45, -0.3)
        elif style == "warm":
            if b in (0, 2): add(music, kick(0.65), tb)
            if b in (1, 3): add(music, rim(), tb, 0.75, 0.15)
            for s in range(4): add(music, shaker(), tb + s * BEAT / 4, 0.75 if s % 2 else 0.45, -0.3)
        else:
            if b == 0 or (b == 2 and k % 2 == 0): add(music, kick(0.75, 0.16), tb)
            if b == 1: add(music, kick(0.45, 0.12), tb + BEAT / 2)
            add(music, hat(), tb + BEAT / 2, 0.55, 0.3); add(music, hat(), tb, 0.28, -0.3)
        for e in range(2):
            te = tb + e * BEAT / 2; idx = b * 2 + e
            if not (te < cut or te >= ret - 1e-6): continue
            m = R + ch[[0, 1, 2, 1, 2, 0, 1, 2][idx] % 3] + (12 if post and idx == 7 else 0)
            if style == "investigate":
                if idx in (0, 3, 5, 6): add(music, pizz(m), te, 0.9, -0.3 if idx % 2 else 0.3)
            elif style == "warm":
                add(music, pluck(m, 0.4, 3400 if post else 2600, 0.14), te, 0.7, -0.35 if idx % 2 else 0.35)
            else:
                if idx % 2 == 0: add(music, pluck(m, 0.5, 1800 if not post else 2400, 0.2), te, 0.55, -0.35 if idx % 4 else 0.35)
    seg_end = min(bar_t + BAR, cut) if bar_t < cut else bar_t + BAR
    if (bar_t < cut or bar_t >= ret - 1e-6) and seg_end > max(bar_t, 0) + 0.05:
        s0 = max(bar_t, 0.0); dur = seg_end - s0
        add(music, sub(R + root - 12, dur), s0, 0.8)
        add(music, pad([R + c for c in ch], dur + (0.3 if seg_end < cut or bar_t >= ret else 0.02), 1200 if style == "observe" else 1600), s0, 0.5)
        if style == "observe" and bar_t >= 0:
            add(music, keys(R + 12 + ch[2], 1.6), bar_t + BEAT * 1.5, 0.8, 0.2); add(music, keys(R + 12 + ch[1], 1.6), bar_t + BEAT * 3, 0.6, -0.2)
    bar_t += BAR
if cut < DUR:  # tape stop into the cut (0.18 s, ends on the cut), dead silence until the return downbeat
    ts, te = L(cut - 0.18), L(cut)
    sg = music[ts:te].copy(); n_ = te - ts
    pos = np.clip(np.cumsum(np.linspace(1, 0.08, n_)), 0, n_ - 1).astype(int)
    music[ts:te] = sg[pos] * np.linspace(1, 0, n_)[:, None] ** 0.6
    music[te:min(N, L(ret))] = 0
if M.get("one_note") and cut < DUR:  # (lab C3-SUP) the music thins to one held note under the record
    n = L(ret - cut); f = note(R + 12); x = (sine(f, n) + 0.3 * sine(2 * f, n) + 0.08 * sine(3.01 * f, n)) * (0.85 + 0.15 * sine(0.9, n))
    x *= np.minimum(1, np.arange(n) / (0.25 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.2 * SR)) * 0.12
    add(music, x, cut, 1.0)
# ending: fade the music out over the last 0.6 s
music[-L(0.6):] *= np.linspace(1, 0, L(0.6))[:, None] ** 1.5

# ------------------------------------------------------------------ SFX palette (one per cue name)
def click(f=3200, g=0.6): n = L(0.03); return (hp(noise(n), 1500) * env(n, 0, 0.003) + 0.4 * sine(f, n) * env(n, 0, 0.004)) * g
def tick(f=2400, g=0.4): n = L(0.08); t = np.arange(n) / SR; return sine(f * (1 + 0.3 * np.exp(-t / 0.004)), n) * env(n, 0.0005, 0.018) * g
def tink(f=1800, d=0.09): n = L(0.4); return (sine(f, n) + 0.5 * sine(f * 1.5, n) + 0.2 * sine(f * 2.76, n)) * env(n, 0.001, d) * 0.22
def popf(f=900, d=0.025): n = L(0.1); t = np.arange(n) / SR; return sine(f * (1 + 0.8 * np.exp(-t / 0.01)), n) * env(n, 0.001, d) * 0.4
def thump(f=110, d=0.08, g=1.0): n = L(0.35); t = np.arange(n) / SR; return np.tanh(2 * sine(f * (1 + 0.6 * np.exp(-t / 0.02)), n) * env(n, 0.001, d)) * 0.5 * g
def whoosh(Ls, f0=600, f1=4000, g=1.0, peak=0.35):
    n = L(Ls); x = noise(n); out = np.zeros(n); sg = 512
    for i in range(0, n, sg):
        fc = f0 * (f1 / f0) ** (i / n); out[i:i + sg] = bp(x[i:i + sg], max(80, fc * 0.6), min(20000, fc * 1.6), 1)
    u = np.linspace(0, 1, n); e = np.where(u < peak, (u / peak) ** 0.7, ((1 - u) / (1 - peak)) ** 1.6)
    e[:L(0.002)] = np.maximum(e[:L(0.002)], 0.35)
    return out * e * 0.4 * g
def slide(Ls=0.3, g=0.8, lo=700, hi=3500):
    n = L(Ls); y = bp(noise(n), lo, hi) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.8 * 0.22 * g; c = click(2600, 0.25); y[:len(c)] += c; return y
def keyclick(): n = L(0.035); return (bp(noise(n), 2500, 9000) * env(n, 0, 0.004) + 0.3 * sine(rng.uniform(1600, 2200), n) * env(n, 0, 0.006)) * rng.uniform(0.7, 1)
def scratch(Ls, lo=1500, hi=6000, rate=11, grain=True):  # pen / pencil on paper
    n = L(Ls); t = np.arange(n) / SR
    am = 0.5 + 0.5 * np.abs(np.sin(np.pi * rate * t + rng.uniform(0, 3))) ** 0.6
    x = bp(noise(n), lo, hi) * am
    if grain:
        g = np.zeros(n); idx = rng.integers(0, n, int(Ls * 400)); g[idx] = rng.uniform(-1, 1, len(idx)); x += hp(g, 2000) * 1.5
    return x * np.minimum(1, t / 0.01) * np.minimum(1, (Ls - t) / 0.04) * 0.18
def rustle(Ls, g=1.0):
    n = L(Ls); x = np.zeros(n)
    for _ in range(int(Ls * 90)):
        i = rng.integers(0, max(1, n - 900)); m = rng.integers(200, 900); x[i:i + m] += bp(noise(m), 1200, 7000) * env(m, 0.001, 0.006) * rng.uniform(0.3, 1)
    return x * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.5 * 0.5 * g
def creak(Ls=0.4, f=420, g=1.0):  # rope / pin creak: pulsed resonant squeak with a pitch glide
    n = L(Ls); t = np.arange(n) / SR; ff = f * (1 + 0.25 * np.sin(np.pi * t / Ls))
    pulses = (np.sin(2 * np.pi * 38 * t) > 0.6).astype(float)
    x = bp(noise(n) * pulses, 200, 3000) * 0.6 + sine(ff, n) * pulses * 0.25
    u = np.linspace(0, 1, n); e = np.minimum(1, t / 0.012) * (1 - u) ** 1.2
    return lp(x, 2500) * e * 0.35 * g
def metal(f0=1100, n_=6, d=0.06):
    n = L(0.25); x = np.zeros(n)
    for r in (1, 2.41, 3.9, 5.3): x += sine(f0 * r * rng.uniform(.97, 1.03), n) / r
    return x * env(n, 0.0005, d) * 0.2
def rattle(Ls=0.5, g=1.0):
    n = L(Ls); x = np.zeros(n)
    for k in range(int(Ls * 50)):
        tt = rng.uniform(0, Ls * 0.9); m = metal(rng.uniform(900, 2400), d=0.02); i = L(tt); j = min(n, i + len(m)); x[i:j] += m[:j - i] * np.exp(-tt * 4) * rng.uniform(.4, 1)
    return x * g
def bell(f=2350, d=1.4):
    n = L(2.4); x = np.zeros(n)
    for r, a, dd in ((1, 1, d), (2.32, .55, d * .6), (4.25, .3, d * .35), (6.63, .18, d * .2), (1.003, .6, d)): x += sine(f * r, n) * env(n, 0.0005, dd) * a
    x += hp(noise(n), 4000) * env(n, 0, 0.004) * 0.6
    return x * 0.16
def flaps(t0, cols, flips=(3, 8), dt=0.06, stagger=0.02, g=0.55, slowing=False):
    for c in range(cols):
        nf = 8 if slowing else rng.integers(flips[0], flips[1] + 1); tt = t0 + c * stagger
        for k in range(nf):
            d = (0.05 + (0.2 - 0.05) * (k / nf) ** 1.6) if slowing else dt
            add(sfx, click(rng.uniform(1700, 2400), 0.35) + np.pad(tick(rng.uniform(900, 1300), 0.12), (0, 0))[:L(0.03)], tt, g * rng.uniform(.7, 1), rng.uniform(-.5, .5)); tt += d
def swell(Ls=0.8, f=220, down=False):
    n = L(Ls); u = np.linspace(0, 1, n); e = (1 - u) if down else u; e = e ** 1.5 * np.sin(np.pi * u) ** 0.3
    return (sine(f * (1 + 0.02 * u), n) * 0.5 + lp(noise(n), 900) * 0.4) * e * 0.3
def zipf(Ls=0.35, up=True):
    n = L(Ls); t = np.arange(n) / SR; rate = np.linspace(40, 140, n) if up else np.linspace(140, 40, n)
    pulses = (np.sin(2 * np.pi * np.cumsum(rate) / SR) > 0.7).astype(float)
    return bp(noise(n) * pulses, 1500, 7000) * np.sin(np.pi * np.linspace(0, 1, n)) * 0.4
def shimmer(Ls=0.7, g=1.0):
    n = L(Ls); x = np.zeros(n)
    for f in (3520, 4186, 5274, 6272): x += sine(f * rng.uniform(.99, 1.01), n) * rng.uniform(.4, 1)
    return (x * 0.05 + bp(noise(n), 6000, 12000) * 0.12) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * g

def chime(f=1320, d=0.5):
    n = L(1.2); return (sine(f, n) + 0.6 * sine(f * 1.5, n) + 0.25 * sine(f * 2, n)) * env(n, 0.002, d) * 0.18
def shutter():
    n = L(0.13); x = np.zeros(n)
    for o in (0, 0.05):
        i = L(o); m = L(0.03); x[i:i + m] += bp(noise(m), 1500, 7000) * env(m, 0, 0.006)
    return x * 0.6
def lowhit(f0=50):
    n = L(0.7); t = np.arange(n) / SR
    return np.tanh(2 * sine(f0 + 70 * np.exp(-t / 0.03), n) * env(n, 0.001, 0.2)) * 0.6 + lp(noise(n), 1000) * env(n, 0, 0.02) * 0.3
def muted(): return thump(85, 0.06, 0.9)[:L(0.3)] + np.pad(click(1800, 0.25), (0, L(0.3) - L(0.03)))
def resolve(fs=(1046.5, 1318.5, 1568.0), d=0.6, g=1.0):
    x = np.zeros(L(1.5))
    for k, f in enumerate(fs):
        c = chime(f, d); i = L(k * 0.06); x[i:i + len(c)] += c[:len(x) - i]
    return x * g

sfx = np.zeros((N, 2))
def place(t, k):
    P = rng.uniform(-0.25, 0.25)
    if k in ("air-glide", "air-pull"): add(sfx, whoosh(0.8, 300, 1800, 0.7, 0.5), t, 0.7, P)
    elif k == "air-glide-long": add(sfx, whoosh(1.1, 250, 1600, 0.75, 0.5), t, 0.75, -0.3)
    elif k in ("air-short",): add(sfx, whoosh(0.45, 500, 3500, 0.8, 0.35), t, 0.7, P)
    elif k == "air-drop": add(sfx, whoosh(0.9, 1800, 400, 0.7, 0.4), t, 0.7)
    elif k == "air-slow-push": add(sfx, whoosh(2.0, 200, 900, 0.5, 0.6), t, 0.6)
    elif k in ("bell-ding",): add(sfx, bell(), t, 1.0, 0.25); add(sfx, thump(180, 0.03, 0.4), t, 0.6)
    elif k == "ring-out": add(sfx, bell(2350 * 2.01, 0.9) * 0.3, t + 0.05, 0.4, 0.3)
    elif k in ("bell-slide", "bell-slide-back"): add(sfx, slide(0.32, 0.8, 500, 2500), t, 0.8, 0.4); add(sfx, bell(2350, 0.2) * 0.15, t + 0.3, 0.3, 0.4)
    elif k in ("card-fold", "paper-fold"): add(sfx, rustle(0.45), t, 0.9); add(sfx, whoosh(0.35, 2500, 600, 0.5), t, 0.5)
    elif k == "paper-unfold": add(sfx, rustle(0.5, 1.1), t, 1.0); add(sfx, whoosh(0.45, 600, 3000, 0.5), t, 0.5)
    elif k == "card-rise": add(sfx, whoosh(0.6, 300, 2200, 0.6, 0.6), t, 0.8); add(sfx, swell(0.6, 330), t, 0.5)
    elif k == "card-settle": add(sfx, thump(150, 0.05, 0.5), t); add(sfx, tink(1568, 0.25), t + 0.02, 0.5)
    elif k in ("caster-roll", "caster-roll-out"):
        n = L(0.65); x = lp(noise(n), 350) * 0.5 * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.5
        for i in range(10): c = click(rng.uniform(900, 1400), 0.3); j = L(i * 0.06); x[j:j + len(c)] += c[:n - j]
        add(sfx, x, t, 0.9, 0.5 if k == "caster-roll" else -0.3)
    elif k == "clunk": add(sfx, thump(90, 0.07, 1.0), t); add(sfx, metal(700, d=0.08), t, 0.7, 0.4)
    elif k in ("chip-drop", "chip-drop-red"): add(sfx, popf(820, 0.035), t, 1.0); add(sfx, thump(160, 0.04, 0.5), t + 0.02)
    elif k in ("chip-pop", "pill-pop"): add(sfx, popf(1150), t, 0.9, P)
    elif k in ("chip-fade",): add(sfx, tick(1900, 0.3), t, 0.8); add(sfx, whoosh(0.4, 3000, 1200, 0.3), t, 0.4)
    elif k == "chip-wipe": add(sfx, whoosh(0.3, 1200, 4500, 0.5), t, 0.6); add(sfx, tick(2600, 0.3), t + 0.3, 0.7)
    elif k == "chip-slide-out": add(sfx, slide(0.3, 0.7), t, 0.8, -0.4)
    elif k == "cta-pop": add(sfx, popf(1000, 0.03), t, 0.9); add(sfx, tink(2093, 0.15), t + 0.12, 0.6)
    elif k == "cta-out": add(sfx, whoosh(0.35, 3500, 900, 0.5, 0.2), t, 0.6)
    elif k == "exhaust-rattle": add(sfx, rattle(0.5), t, 1.0, 0.1)
    elif k == "flag-flutter": n = L(0.3); add(sfx, bp(noise(n), 300, 2200) * (0.5 + 0.5 * np.sin(2 * np.pi * 19 * np.arange(n) / SR)) * env(n, 0.01, 0.12) * 0.5, t, 0.8, P)
    elif k == "pennant-snap": n = L(0.12); add(sfx, bp(noise(n), 500, 3500) * env(n, 0.001, 0.025) * 0.9, t, 0.8, P); add(sfx, thump(260, 0.02, 0.3), t)
    elif k.startswith("flap-clatter"):
        cols = 14 if k.endswith("full") else int(k.split("-")[-1])
        if k.endswith("full"):
            for r in range(4): flaps(t + r * 0.05, cols, g=0.45)
        else: flaps(t, cols)
    elif k == "flap-spin-slowing": flaps(t, 9, slowing=True, g=0.5)
    elif k == "flap-twitch": add(sfx, click(1900, 0.25), t, 0.6, P); add(sfx, click(1600, 0.25), t + 0.22, 0.7, P)
    elif k == "leather-lift": add(sfx, creak(0.18, 260, 0.6), t, 0.7); add(sfx, whoosh(0.4, 400, 1500, 0.4), t, 0.4)
    elif k == "leather-slap": add(sfx, thump(95, 0.09, 1.2), t); n = L(0.08); add(sfx, bp(noise(n), 700, 5000) * env(n, 0.0005, 0.012) * 1.2, t)
    elif k == "leather-slide": add(sfx, slide(0.4, 0.8, 300, 1800), t, 0.9, P)
    elif k in ("measure-draw-x2",): add(sfx, scratch(0.45, 1800, 6000, 9), t, 0.9, -0.4); add(sfx, scratch(0.45, 1800, 6000, 9), t + 0.06, 0.9, 0.4)
    elif k in ("monitor-slide", "monitor-slide-out"): add(sfx, slide(0.7, 1.1, 250, 1800), t, 1.0, -0.3); add(sfx, thump(120, 0.05, 0.4), t + 0.6)
    elif k == "monitor-swivel": add(sfx, creak(0.6, 300, 0.8), t, 0.8)
    elif k == "screen-on-tick": add(sfx, tick(2800, 0.4), t); add(sfx, swell(0.5, 120), t, 0.4)
    elif k == "outline-draw": add(sfx, scratch(0.7, 1200, 5000, 6, False), t, 0.7, 0.4)
    elif k == "paper-fall-x2": add(sfx, rustle(0.5, 0.8) * np.linspace(1, 0.2, L(0.5)), t, 0.8, -0.3); add(sfx, rustle(0.5, 0.8) * np.linspace(1, 0.2, L(0.5)), t + 0.07, 0.8, 0.3)
    elif k == "paper-thud": add(sfx, thump(140, 0.05, 0.9), t); n = L(0.06); add(sfx, bp(noise(n), 800, 5000) * env(n, 0.0005, 0.01), t, 0.9); add(sfx, bp(noise(n), 1500, 6000) * env(n, 0.0005, 0.008), t + 0.066, 0.5)
    elif k == "part-lift": add(sfx, whoosh(0.4, 500, 2500, 0.5, 0.4), t, 0.6); add(sfx, tick(1200, 0.2), t)
    elif k == "pen-write": add(sfx, scratch(0.55, 2000, 7000, 12), t, 0.9, 0.2)
    elif k in ("pencil-write", "pencil-line"): add(sfx, scratch(0.5 if k == "pencil-write" else 0.55, 1300, 5000, 9), t, 0.85, 0.2)
    elif k == "photo-settle": add(sfx, thump(200, 0.03, 0.4), t); add(sfx, rustle(0.12, 0.6), t, 0.5)
    elif k == "pin-creak-x2": add(sfx, creak(0.25, 520), t, 0.6, -0.4); add(sfx, creak(0.25, 480), t + 0.1, 0.6, 0.4)
    elif k == "pin-twitch-x2": add(sfx, tick(2200, 0.35), t, 0.8, -0.4); add(sfx, tick(2300, 0.35), t + 0.06, 0.8, 0.4)
    elif k == "pipe-lift-spring": add(sfx, whoosh(0.6, 400, 2000, 0.5), t, 0.6); add(sfx, creak(0.4, 380, 0.8), t + 0.1, 0.6); add(sfx, rattle(0.3, 0.6), t + 0.3, 0.6)
    elif k in ("pipe-sag-groan",): add(sfx, creak(0.6, 260, 1.0), t, 0.9); add(sfx, rattle(0.35, 0.6), t, 0.7)
    elif k == "pipe-sag-rattle": add(sfx, rattle(0.35, 0.8), t, 0.9); add(sfx, creak(0.3, 340, 0.7), t, 0.6)
    elif k in ("punch-in-thump", "punch-out-thump"): add(sfx, thump(70 if k.startswith("punch-in") else 90, 0.09, 1.0), t)
    elif k == "lens-settle": add(sfx, tick(3400, 0.18), t, 0.5)
    elif k == "slide-soft": add(sfx, slide(0.35, 0.6), t, 0.7, 0.4)
    elif k in ("string-creak", "tag-swing"): add(sfx, creak(0.4, 600, 0.7), t, 0.7, P)
    elif k == "creak-soft": add(sfx, creak(0.35, rng.uniform(520, 640), 0.35), t, 0.35, rng.uniform(-.3, .3))
    elif k == "string-snap-x2":
        for i, o in enumerate((0, 0.06)): n = L(0.1); add(sfx, hp(noise(n), 2500) * env(n, 0.0002, 0.006) * 1.2 + sine(900, n) * env(n, 0, 0.03) * 0.3, t + o, 1.0, -0.3 + 0.6 * i)
    elif k == "string-tie": add(sfx, rustle(0.25, 0.7), t, 0.7); add(sfx, creak(0.2, 700, 0.6), t + 0.15, 0.7)
    elif k == "string-zip": add(sfx, zipf(0.55, True) * 0.6, t, 0.6, 0.3)
    elif k == "knot": add(sfx, creak(0.15, 760, 0.8), t, 0.7); add(sfx, tick(1500, 0.25), t + 0.1)
    elif k == "tape-click": add(sfx, click(2600, 0.8), t); add(sfx, thump(240, 0.025, 0.5), t)
    elif k == "tape-click-x2": add(sfx, click(2600, 0.8), t, 1, -0.4); add(sfx, click(2500, 0.8), t + 0.07, 1, 0.4)
    elif k == "tape-close": add(sfx, zipf(0.3, False), t, 0.7); add(sfx, click(2200, 0.6), t + 0.28)
    elif k == "tape-split": add(sfx, zipf(0.45, True), t, 0.9); add(sfx, creak(0.3, 420, 0.6), t + 0.1, 0.6)
    elif k in ("tick-soft-x3", "ui-tick-x3"):
        for i in range(3): add(sfx, tick(2600 + i * 200, 0.3), t + i * 0.08, 0.8, -0.3 + 0.3 * i)
    elif k == "tick-soft": add(sfx, tick(2900, 0.25), t, 0.7, P)
    elif k == "tint-swell": add(sfx, swell(0.9, 196), t, 0.7)
    elif k == "tint-drain": add(sfx, swell(0.8, 196, down=True), t, 0.6)
    elif k == "ruler-tick": add(sfx, tick(rng.uniform(3000, 3400), 0.18), t, 0.6, rng.uniform(-.4, .4))
    elif k == "ruler-tick-major": add(sfx, tick(rng.uniform(2200, 2500), 0.3), t, 0.8, rng.uniform(-.3, .3)); add(sfx, click(1800, 0.2), t)
    elif k == "tick-ripple":
        for i in range(8): add(sfx, tick(2800 - i * 90, 0.2 * (1 - i / 10)), t + i * 0.035, 0.7, -0.6 + i * 0.17)
    elif k == "label-in": add(sfx, popf(1300, 0.02), t, 0.6, P); add(sfx, whoosh(0.25, 1500, 5000, 0.3), t, 0.4)
    elif k == "label-out": add(sfx, whoosh(0.3, 4000, 1200, 0.35, 0.2), t, 0.5)
    elif k == "emph-pop": add(sfx, popf(640, 0.035), t, 0.8, P)
    elif k == "pop-soft": add(sfx, popf(1500, 0.02), t, 0.7, P)
    elif k == "cap-pop-x2": add(sfx, popf(1700, 0.015), t, 0.6, -0.4); add(sfx, popf(1700, 0.015), t + 0.04, 0.6, 0.4)
    elif k == "shimmer": add(sfx, shimmer(0.75), t, 0.8, 0.2)
    elif k == "shimmer-soft": add(sfx, shimmer(0.9, 0.6), t, 0.6, -0.2)
    elif k == "key": add(sfx, keyclick(), t, 0.5, rng.uniform(-.25, .25))
    elif k == "paper-flutter": add(sfx, rustle(0.4, 0.8), t, 0.7, 0.5); add(sfx, whoosh(0.4, 900, 3000, 0.4), t, 0.5, 0.5)
    elif k == "value-tick": add(sfx, tick(2400, 0.35), t, 0.8, -0.4); add(sfx, tick(3000, 0.25), t + 0.05, 0.7, -0.4)
    elif k in ("music-cut", "music-return"): pass  # the score itself cuts and returns
    elif k.startswith("room-tone"): pass       # bed below
    # --- lab B palette (ported) and sprint additions
    elif k == "shutter": add(sfx, shutter(), t, 0.9, P)
    elif k == "chime": add(sfx, chime(1320, 0.5), t, 0.8, P)
    elif k == "low-hit": add(sfx, lowhit(48), t, 1.0)
    elif k == "resolve": add(sfx, resolve((1046.5, 1318.5, 1568.0, 2093.0), 0.6, 0.9), t)
    elif k == "soft-resolve": add(sfx, resolve((880, 1108.7, 1318.5), 0.7, 0.8), t)
    elif k == "light-resolve": add(sfx, resolve((1318.5, 1568.0), 0.5, 0.7), t)
    elif k == "muted-stop": add(sfx, muted(), t, 1.0)
    elif k == "tap": add(sfx, click(3200, 0.6), t); add(sfx, popf(1400, 0.015), t, 0.5)
    elif k == "msg-pop": add(sfx, popf(1150), t, 0.8, P); add(sfx, tick(2900, 0.2), t, 0.5)
    elif k.startswith("typing"):  # typing:<seconds>
        dur = float(k.split(":")[1]) if ":" in k else 0.8
        for q in range(max(3, int(dur * 13))): add(sfx, keyclick(), t + q / 13 + (0 if q == 0 else rng.uniform(-0.008, 0.008)), 0.55, rng.uniform(-0.25, 0.25))
    elif k == "stamp": add(sfx, thump(120, 0.06, 1.0), t); add(sfx, click(1500, 0.5), t)
    elif k == "draw": add(sfx, scratch(0.5, 1500, 5500, 10, False), t, 0.6, P)
    elif k == "check": add(sfx, tick(2600, 0.35), t, 0.8, P); add(sfx, tink(2093, 0.12), t + 0.04, 0.5, P)
    elif k == "notif": add(sfx, chime(1568, 0.25), t, 0.6, P); add(sfx, chime(2093, 0.25), t + 0.09, 0.5, P)
    elif k == "whoosh": add(sfx, whoosh(0.42, 500, 5200, 1.0, 0.3), t, 0.9, P)
    elif k == "whip": add(sfx, whoosh(0.4, 400, 6000, 1.1, 0.45), t, 1.0, -0.3)
    elif k == "portal": add(sfx, whoosh(0.7, 250, 3200, 0.9, 0.6), t, 0.9); add(sfx, swell(0.6, 110), t, 0.5)
    elif k == "match": add(sfx, thump(140, 0.05, 0.6), t); add(sfx, tick(3300, 0.15), t, 0.4)
    elif k == "wipe": add(sfx, slide(0.75, 1.0, 300, 2500), t, 0.9, -0.3)
    elif k == "pull": add(sfx, whoosh(0.6, 3000, 500, 0.8, 0.25), t, 0.8)
    elif k == "head-in": add(sfx, whoosh(0.22, 2500, 6000, 0.35, 0.3), t, 0.35, P)
    elif k == "head-out": add(sfx, whoosh(0.25, 5000, 1800, 0.3, 0.2), t, 0.3, P)
    else: raise SystemExit("unknown sfx " + k)

# ------------------------------------------------------------------ cue list: the reel's own actions + transitions + headline landings
reel = [(float(t), k, float(g)) for t, k, g in D["sfx"]]
auto = []
SHOT = {"portal": "portal", "tap": "tap", "whip": "whip", "match": "match", "punch": "punch-in-thump", "wipe": "wipe", "pull": "pull", "rise": "card-rise"}
for s in D["shots"][1:]:
    k = s["kind"]
    if k is None: continue
    t0 = s["at"] - s["d"] / 2
    if k == "tap": auto += [(t0, "tap", 1.0), (t0 + 0.05, "air-short", 0.8)]
    elif k in ("match", "punch"): auto.append((s["at"], SHOT[k], 1.0))
    else: auto.append((t0, SHOT[k], 1.0))
for h in D["heads"]:
    auto.append((h["t0"] - 4 / 30, "head-in", 1.0))
    for kt in h["key"]: auto.append((kt, "pop-soft", 0.8))
    if h["carry"]: auto.append((h["carry"]["land"], "value-tick", 0.9))
    if h["dot"] is not None: auto.append((h["dot"] + 0.28, "chip-drop", 1.0))
    if h["exit"] and h["exit"]["mode"] == "push": auto.append((h["exit"]["at"], "air-short", 0.8))
auto = [c for c in auto if 0 <= c[0] < DUR - 0.1 and all(abs(c[0] - r[0]) > 0.1 for r in reel)]
cues = sorted(reel + auto)
for t, k, g in cues:
    before = sfx.copy() if g != 1 else None
    place(t, k)
    if before is not None: sfx[:] = before + (sfx - before) * g

# room tone (lane C stories: restaurant / shop / office), continuous and low, stays through the music cut
room = np.zeros((N, 2))
if M.get("room"):
    n = N
    if M["room"] == "restaurant":
        base_ = bp(noise(n), 250, 2600) * (0.6 + 0.4 * lp(np.abs(noise(n)), 2)[:n] * 8).clip(0.3, 1.4)
        for _ in range(int(DUR / 2.2)): add(room, tink(rng.uniform(2800, 4200), 0.05) * 0.4, rng.uniform(0.5, DUR - 0.5), 0.5, rng.uniform(-.7, .7))
    elif M["room"] == "shop":
        base_ = lp(noise(n), 500) * 0.6 + (sine(60, n) * 0.25 + sine(120, n) * 0.18) + bp(noise(n), 900, 3000) * 0.08
    else:
        base_ = lp(noise(n), 1800) * 0.4 + sine(50, n) * 0.06
    room[:, 0] += base_; room[:, 1] += np.roll(base_, 2400)

# ------------------------------------------------------------------ VO track (hook B/C openers spliced onto the body, as in makeTL)
def mono(path):
    x, sr = sf.read(os.path.join(FILM, "public", "vo", ID, path), dtype="float32", always_2d=True); x = x.mean(1)
    return resample_poly(x, SR, sr) if sr != SR else x
body = mono("vo.wav")
vo = np.zeros(N)
if HOOK == "A":
    n = min(N, len(body)); vo[:n] = body[:n]
else:
    hk = mono(f"hook-{HOOK}.wav"); hk = np.concatenate([np.zeros(L(D.get("hookPad", 0))), hk]); c = L(D["cut"]); ca = L(D["cutA"]); f = L(0.01)
    h = np.zeros(c + f); h[:min(len(hk), c + f)] = hk[:c + f]; h[c:c + f] *= np.linspace(1, 0, f)
    vo[:min(N, c + f)] += h[:min(N, c + f)]
    b = body[ca:].copy(); b[:f] *= np.linspace(0, 1, f); n = min(N - c, len(b)); vo[c:c + n] += b[:n]
words = D["hookWords"] + D["bodyWords"]
wins = []
for w, s, e in words:
    if wins and s - wins[-1][1] < 0.4: wins[-1][1] = e
    else: wins.append([s, e])

# ------------------------------------------------------------------ mix: VO ~-20 dB RMS on top, music -24 ducked 7 dB under speech, SFX -25
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
act = lambda x: x[np.abs(x).reshape(len(x), -1).sum(1) > 1e-4]
vo *= 10 ** ((-20 - rms_db(act(vo))) / 20)
music *= 10 ** ((-24 - rms_db(act(music))) / 20)
sfx *= 10 ** ((-25 - rms_db(act(sfx))) / 20)
duck = np.ones(N)
for a, b in wins: duck[max(0, L(a - 0.08)):min(N, L(b + 0.2))] = 10 ** (-7 / 20)
k = L(0.08); duck = np.convolve(np.pad(duck, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
music_d = music * duck[:, None]
if M.get("room"): room *= 10 ** ((-42 - rms_db(room)) / 20)
bed = music_d + sfx + room
mix = bed + vo[:, None]
os.makedirs(OUT, exist_ok=True)
base = os.path.join(OUT, f"{ID}-{HOOK}")

def limit_tp(x, ceil_db=-2.0):
    up = np.abs(resample_poly(x, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:len(x)]
    g = np.minimum(1, 10 ** (ceil_db / 20) / np.maximum(up, 1e-12)); g = minimum_filter1d(g, size=2 * L(0.003) + 1, mode="nearest")
    rel = np.exp(-1 / (0.08 * SR)); out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else cur * rel + (1 - rel) * g[i]; out[i] = cur
    return x * out[:, None]
def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float(r.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0]); TP = float(r.split("True peak:")[1].split("Peak:")[1].split("dBFS")[0])
    LRA = float(r.split("Loudness range:")[1].split("LRA:")[1].split("LU")[0]); return I, TP, LRA
def aac(x, path):
    tmp = base + "-tmp.wav"; sf.write(tmp, x.astype(np.float32), SR, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:a", "aac", "-b:a", "256k", "-ar", str(SR), path], check=True); os.remove(tmp)
    return lufs(path)

pk = np.abs(bed).max(); g_ref = (10 ** (-3 / 20) / pk) if pk > 10 ** (-3 / 20) else 1.0
sf.write(base + "-bed.wav", (bed * g_ref).astype(np.float32), SR, subtype="PCM_24")
sf.write(base + "-vo.wav", (vo * g_ref).astype(np.float32), SR, subtype="PCM_24")
x = lp(mix.T, 16000, 4).T   # band-limit so the AAC low-pass cannot ring past the limiter
tmp = base + "-tmp.wav"
for it in range(6):   # gain to -14 LUFS, true-peak limit at -2 dBTP on the wav
    sf.write(tmp, x.astype(np.float32), SR, subtype="FLOAT"); I, TP, LRA = lufs(tmp)
    if abs(I + 14) < 0.1 and TP <= -1.9: break
    x = x * 10 ** ((-14 - I) / 20); x = limit_tp(x, -2.0)
os.remove(tmp)
m4a = base + "-master.m4a"
for it in range(8):   # encode, measure the AAC, fix: dip/trim until the encoded file reads -14 +-0.2 LUFS and <= -1.0 dBTP
    I, TP, LRA = aac(x, m4a)
    print(f"{ID}-{HOOK} aac pass {it}: I={I:.2f} TP={TP:.2f}")
    if TP <= -1.05 and abs(I + 14) <= 0.2: break
    if TP > -1.05: x = limit_tp(x, -2.0 - (TP + 1.05) - 0.2 * (it + 1))
    if abs(I + 14) > 0.2: x = x * 10 ** ((-14 - I) / 20)
sf.write(base + "-master.wav", x.astype(np.float32), SR, subtype="PCM_24")
json.dump({"id": ID, "hook": HOOK, "duration": DUR, "aac_lufs_I": I, "aac_true_peak_dBTP": TP, "LRA": LRA, "duck_db": -7, "vo_windows": wins,
           "music": M, "cues": cues}, open(base + "-cues.json", "w"), indent=0)
print(f"{ID}-{HOOK} master (AAC) I={I:.2f} LUFS TP={TP:.2f} dBTP LRA={LRA:.1f} | cues {len(cues)} ({len(reel)} reel, {len(auto)} auto)")
