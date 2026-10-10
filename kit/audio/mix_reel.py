#!/usr/bin/env python3
"""Score, sound-design and master one version of a studio reel (hook X + body).

usage: mix_reel.py C1 B --tl kit/remotion/public/tl/C1.json --vo weeks/2026-W42/vo/C1 --out out/C1-B
writes <out>.wav (full mix, -14 LUFS) and <out>-nomusic.wav (voice + sfx).

Music: a synthesized score per audience (key/tempo/colour differ so the week doesn't sound the same):
filtered intro under the hook, groove through the body, a tape stop just before the FMB turn, drop on the turn,
a final sting on the end card. SFX: whoosh on every cut, thump/pop on arrivals, ticks when numbers roll, impact on the turn.
Music is ducked under the voice (sidechain from the VO envelope).
"""
import argparse, json, re, subprocess
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
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
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x))
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += x[:j - i] * g * l * 1.414; buf[i:j, 1] += x[:j - i] * g * r * 1.414

def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    x = sine(45 + 95 * np.exp(-t / 0.035), n) * env(n, 0.001, 0.22) + 0.4 * hp(noise(n), 3000) * env(n, 0, 0.004)
    return np.tanh(1.6 * x) * g
def clap():
    n = int(0.3 * SR); x = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR); x[i:] += bp(noise(n - i), 900, 2600) * env(n - i, 0, 0.012 if k < 2 else 0.11)
    return x * 0.55
def hat(o=False):
    n = int((0.18 if o else 0.05) * SR); return hp(noise(n), 7000) * env(n, 0, 0.06 if o else 0.014) * 0.35
def sub(m, dur):
    n = int(dur * SR); f = note(m); x = sine(f, n) + 0.25 * sine(2 * f, n)
    e = np.minimum(1, np.arange(n) / (0.01 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.06 * SR))
    return np.tanh(1.3 * x * e) * 0.5
def pluck(m, dur=0.5, bright=3500):
    n = int(dur * SR); f = note(m)
    s1 = 2 * ((np.arange(n) * f / SR) % 1) - 1; s2 = 2 * ((np.arange(n) * f * 1.004 / SR) % 1) - 1
    return lp(0.5 * (s1 + s2), bright) * env(n, 0.002, 0.16) * 0.22
def keys(m, dur=0.8):  # soft electric-piano-ish tone for the slower reels
    n = int(dur * SR); f = note(m)
    return (sine(f, n) + 0.35 * sine(2 * f, n) * env(n, 0, 0.3) + 0.1 * sine(3 * f, n) * env(n, 0, 0.12)) * env(n, 0.004, 0.55) * 0.2
def pad(ms, dur, cut=1400):
    n = int(dur * SR); x = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.07):
            x += 2 * ((np.arange(n) * note(m) * 2 ** (d / 12) / SR + rng.random()) % 1) - 1
    x = lp(x / (len(ms) * 3), cut, 2)
    a = np.minimum(1, np.arange(n) / (0.6 * SR)); r = np.minimum(1, (n - np.arange(n)) / (0.8 * SR))
    return x * a * r * 0.32

def whoosh(L, f0=600, f1=4000, g=1.0):
    n = int(L * SR); x = noise(n); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        fc = f0 * (f1 / f0) ** (i / n); out[i:i + seg] = bp(x[i:i + seg], max(80, fc * 0.6), min(20000, fc * 1.6), 1)
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6 * 0.35 * g
def thump(f=110, d=0.08, g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return np.tanh(2 * sine(f * (1 + 0.6 * np.exp(-t / 0.02)), n) * env(n, 0.001, d)) * 0.5 * g
def pop(f=900):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return sine(f * (1 + 0.8 * np.exp(-t / 0.01)), n) * env(n, 0.001, 0.025) * 0.35
def chime(f=1320, d=0.5):
    n = int(1.2 * SR); return (sine(f, n) + 0.6 * sine(f * 1.5, n) + 0.25 * sine(f * 2, n)) * env(n, 0.002, d) * 0.2
def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    s = sine(36 + 50 * np.exp(-t / 0.08), n) * env(n, 0.002, 0.7); nz = lp(noise(n), 2500) * env(n, 0, 0.12) * 0.5
    return np.tanh(1.5 * (s + nz)) * 0.7 + hp(noise(n), 6000) * env(n, 0.05, 0.5) * 0.12
def riser(L):
    n = int(L * SR); t = np.arange(n) / SR
    return (bp(noise(n), 800, 6000) * (t / L) ** 2 * 0.25 + sine(200 + 600 * (t / L) ** 2, n) * (t / L) ** 3 * 0.08)

# per-audience score colour: (bpm, chords [(root, notes)], lead instrument)
STYLE = {
    "C": (92, [(50, [62, 65, 69]), (46, [58, 62, 65, 69]), (53, [60, 65, 69]), (48, [60, 64, 67])], "keys"),   # D minor, warm
    "G": (104, [(55, [67, 70, 74]), (51, [63, 67, 70, 74]), (58, [65, 70, 74]), (53, [65, 69, 72])], "pluck"), # G minor, punchy
    "P": (100, [(53, [65, 68, 72]), (49, [61, 65, 68, 72]), (56, [63, 68, 72]), (51, [63, 67, 70])], "pluck"), # F minor (house)
    "X": (86, [(48, [60, 63, 67]), (44, [56, 60, 63, 67]), (51, [58, 63, 67]), (46, [58, 62, 65])], "keys"),   # C minor, cinematic
}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("reel"); ap.add_argument("hook")
    ap.add_argument("--tl", required=True); ap.add_argument("--vo", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--frames", required=True, help="storyboard frames html dump (json id->html) to detect the turn")
    a = ap.parse_args()
    tl = json.load(open(a.tl)); H = tl["parts"]["hook" + a.hook]; B = tl["parts"]["body"]
    hd = H["dur"]; DUR = hd + B["dur"]; N = int(DUR * SR) + SR
    vo_h, _ = sf.read(f"{a.vo}/hook{a.hook}.wav"); vo_b, _ = sf.read(f"{a.vo}/body.wav")
    VO = np.zeros(N); VO[:len(vo_h)] += vo_h[:N]; i0 = int(hd * SR); VO[i0:i0 + len(vo_b)] += vo_b[:N - i0]
    html = json.load(open(a.frames))
    # beat times on the full timeline
    cuts = [b["a"] for b in H["beats"][1:]] + [hd] + [hd + b["a"] for b in B["beats"][1:]]
    bstarts = [hd + b["a"] for b in B["beats"]]
    turn = None
    for b in B["beats"][1:]:
        h = html.get(b.get("fid", ""), "")
        if ("class=\"device" in h or "device " in h) and hd + b["a"] > hd + 0.3 * B["dur"]:
            turn = hd + b["a"]; break
    if turn is None: turn = hd + B["beats"][len(B["beats"]) // 2]["a"]
    endcard = hd + B["beats"][-1]["a"]
    bpm, prog, lead = STYLE[a.reel[0]]; BEAT = 60 / bpm; BAR = 4 * BEAT
    music = np.zeros((N, 2)); T0 = turn - 8 * BAR  # align the drop to a downbeat on the turn
    while T0 > 0: T0 -= BAR
    stop = turn - 0.34
    t = T0; arp = [0, 1, 2, 1, 2, 3, 2, 1]
    while t < DUR:
        bi = int(round((t - T0) / BAR)); root, ch = prog[bi % 4]
        sec = "intro" if t < hd - 0.05 else "groove" if t < stop else "gap" if t < turn - 0.01 else "drop" if t < endcard else "outro"
        for k in range(4):
            tb = t + k * BEAT
            if tb < 0 or tb >= DUR or sec == "gap" or (sec == "groove" and tb >= stop): continue
            if sec in ("groove", "drop"):
                if k in (0, 2) or (sec == "drop" and k == 3 and bi % 2): add(music, kick(0.85), tb)
                if k in (1, 3): add(music, clap(), tb, 0.7)
                add(music, hat(), tb + BEAT / 2, 0.7, 0.3)
                if sec == "drop": add(music, hat(), tb, 0.4, -0.3)
            if sec in ("intro", "outro") and k == 0: add(music, kick(0.45), tb)
        if sec in ("groove", "drop", "outro") and t >= 0:
            d = min(BAR, (stop - t) if sec == "groove" else BAR)
            if d > 0.05: add(music, sub(root, d), t, 0.85 if sec != "outro" else 0.5)
        for k in range(8):
            tb = t + k * BEAT / 2
            if tb < 0 or tb >= DUR or sec == "gap" or (sec == "groove" and tb >= stop): continue
            m = ch[arp[k] % len(ch)] + (12 if sec == "drop" and k % 4 == 3 else 0)
            if lead == "keys":
                if k % 2 == 0: add(music, keys(m, 0.9), tb, 0.9 if sec != "intro" else 0.6, -0.3 if k % 4 else 0.3)
            else:
                add(music, pluck(m, 0.45, 1600 if sec == "intro" else 3000 if sec == "groove" else 5200), tb, 0.8 if sec != "intro" else 0.55, -0.35 if k % 2 else 0.35)
        if sec in ("groove", "drop", "outro") and t >= 0:
            d = min(BAR, (stop - t) if sec == "groove" else BAR)
            if d > 0.2: add(music, pad([c + 12 for c in ch], d + 0.3, 2200 if sec == "drop" else 1200), t, 0.5 if sec != "groove" else 0.32)
        if sec == "intro" and t >= -BAR:
            add(music, pad([c + 12 for c in ch], BAR + 0.3, 900), max(0, t), 0.45)
        t += BAR
    # hook: low-passed, opens at the splice
    ih = int(hd * SR); music[:ih] = lp(music[:ih].T, 1000).T
    # tape stop before the turn
    ts, te = int((stop - 0.32) * SR), int(stop * SR)
    if ts > 0:
        seg = music[ts:te].copy(); L = te - ts
        pos = np.clip(np.cumsum(np.linspace(1, 0.05, L)), 0, L - 1).astype(int)
        music[ts:te] = seg[pos] * np.linspace(1, 0, L)[:, None] ** 0.5; music[te:int(turn * SR)] = 0
    fs_, fe = int((DUR - 0.9) * SR), int((DUR - 0.1) * SR)
    music[fs_:fe] *= np.linspace(1, 0, fe - fs_)[:, None]; music[fe:] = 0
    # sfx
    sfx = np.zeros((N, 2))
    for c in cuts: add(sfx, whoosh(0.55, 500, 5000), c - 0.27, 0.85, rng.uniform(-0.3, 0.3))
    for s in bstarts[:-1]: add(sfx, pop(rng.uniform(1100, 1600)), s + 0.18, 0.5, rng.uniform(-0.4, 0.4)); add(sfx, thump(rng.uniform(90, 130), 0.08), s + 0.1, 0.6)
    add(sfx, riser(1.4), turn - 1.4 - 0.34, 0.5)
    add(sfx, impact(), turn, 0.9); add(sfx, chime(1046.5, 0.8), turn + 0.1, 0.5)
    add(sfx, chime(1396.9, 0.9), endcard + 0.15, 0.5); add(sfx, pop(1000), endcard + 0.5, 0.5)
    add(sfx, thump(80, 0.12), 0.05, 0.7)
    # rolling numbers: ticks when a number changes between consecutive beats
    prevn = None
    for b in B["beats"]:
        h = re.sub(r"<[^>]+>", " ", html.get(b.get("fid", ""), "")); ns = [m for m in re.findall(r"\$?\d[\d,]{2,}", h)]
        if prevn is not None and ns and ns != prevn:
            for k in range(12): add(sfx, pop(2400 * rng.uniform(0.9, 1.15)) * 0.6, hd + b["a"] + 0.12 + k * 0.055, 0.35, rng.uniform(-0.5, 0.5))
        prevn = ns or prevn
    def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    VO *= 10 ** ((-20 - rms_db(VO[VO != 0])) / 20)
    music *= 10 ** ((-24.5 - rms_db(music[np.abs(music).sum(1) > 0])) / 20)
    sn = np.abs(sfx).sum(1) > 1e-6; sfx *= 10 ** ((-26 - rms_db(sfx[sn])) / 20)
    e = np.abs(VO); k = int(0.03 * SR); e = np.convolve(e, np.ones(k) / k, mode="same"); e /= e.max() + 1e-9
    duck = 1 - 0.55 * np.clip(e * 6, 0, 1); duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), mode="same")
    mix = music * duck[:, None] + sfx + VO[:, None]; stem = sfx + VO[:, None]
    n = int(DUR * SR); mix, stem = mix[:n], stem[:n]
    for name, x in ((a.out, mix), (a.out + "-nomusic", stem)):
        pk = np.abs(x).max(); x = x / pk * 0.89 if pk > 0.89 else x
        sf.write(name + ".raw.wav", x.astype(np.float32), SR)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", name + ".raw.wav", "-af", "loudnorm=I=-14:TP=-1:LRA=9", "-ar", str(SR), name + ".wav"], check=True)
    print(a.reel, a.hook, f"{DUR:.2f}s turn {turn:.2f}")

if __name__ == "__main__":
    main()
