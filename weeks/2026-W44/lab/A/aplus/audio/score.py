# Lane A+ sound: original instrumental beds + frame-timed SFX for A-L1..L3, ducked under the VO windows.
# Everything is synthesised here (no samples, no vocals, no engine/turbo/cash-register sounds), so the beds are
# cleared for IG, TikTok and YouTube.   python3 score.py L1 [L2 L3]  -> out/<id>-premaster.wav, out/<id>-sfx.wav, out/<id>-events.json
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)
SR = 48000; DUR = 28.0; N = int(DUR * SR)
VO = json.load(open(os.path.join(HERE, "..", "src", "vo.json")))


def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype="high", fs=SR, output="sos"), x)
def env(n, a, d):
    t = np.arange(n) / SR; e = np.exp(-t / max(d, 1e-4))
    if a > 0: e *= np.clip(t / a, 0, 1)
    return e
def sine(f, n, ph=0.0):
    if np.isscalar(f): return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def fade(x, a=0.004, r=0.03):
    n = len(x); e = np.ones(n); ia = int(a * SR); ir = int(r * SR)
    if ia: e[:ia] = np.linspace(0, 1, ia)
    if ir and ir < n: e[-ir:] *= np.linspace(1, 0, ir)
    return x * e


class Track:
    def __init__(self, seed):
        self.buf = np.zeros((N, 2)); self.rng = np.random.default_rng(seed)
    def noise(self, n): return self.rng.standard_normal(n)
    def add(self, x, t, g=1.0, pan=0.0):
        i = int(round(t * SR))
        if i < 0: x = x[-i:]; i = 0
        j = min(N, i + len(x))
        if j <= i: return
        l = np.cos((pan + 1) * np.pi / 4) * 1.414; r = np.sin((pan + 1) * np.pi / 4) * 1.414
        self.buf[i:j, 0] += x[:j - i] * g * l; self.buf[i:j, 1] += x[:j - i] * g * r


# ------------------------------------------------------------------ instruments (music)
def kick_soft(T, g=1.0, f0=48):
    n = int(0.35 * SR); t = np.arange(n) / SR
    x = sine(f0 + 70 * np.exp(-t / 0.03), n) * env(n, 0.001, 0.16)
    return lp(np.tanh(1.4 * x), 2200) * g
def rim(T, g=1.0):
    n = int(0.06 * SR)
    return (bp(T.noise(n), 1800, 5200) * env(n, 0, 0.006) * 0.6 + sine(1650, n) * env(n, 0, 0.008) * 0.4) * g
def shaker(T, g=1.0):
    n = int(0.07 * SR)
    return hp(T.noise(n), 5500) * env(n, 0.006, 0.022) * 0.35 * g
def snare_dry(T, g=1.0):
    n = int(0.18 * SR)
    return (bp(T.noise(n), 1300, 6000) * env(n, 0, 0.05) * 0.55 + sine(190, n) * env(n, 0, 0.035) * 0.5) * g
def hat_e(T, g=1.0, d=0.012):
    n = int(0.06 * SR); return hp(T.noise(n), 8000) * env(n, 0, d) * 0.4 * g
def clap_e(T, g=1.0):
    n = int(0.22 * SR); x = np.zeros(n)
    for k, o in enumerate([0, 0.009, 0.018]):
        i = int(o * SR); x[i:] += bp(T.noise(n - i), 1000, 3200) * env(n - i, 0, 0.01 if k < 2 else 0.07)
    return x * 0.5 * g
def bass_pulse(m, dur, bright=500):
    n = int(dur * SR); f = note(m)
    x = sine(f, n) + 0.3 * sine(2 * f, n) + 0.1 * sine(3 * f, n)
    return lp(fade(np.tanh(1.2 * x), 0.008, min(0.12, dur * 0.4)), bright) * 0.55
def bass_short(m, dur=0.16):
    n = int(dur * SR); f = note(m)
    saw = 2 * ((np.arange(n) * f / SR) % 1) - 1
    return lp(saw, 700) * env(n, 0.002, 0.07) * 0.5 + sine(f, n) * env(n, 0.002, 0.1) * 0.45
def warm_bass(m, dur):
    n = int(dur * SR); f = note(m)
    saw = 2 * ((np.arange(n) * f / SR) % 1) - 1
    x = lp(saw, 420) * 0.6 + sine(f, n) * 0.6
    return fade(np.tanh(1.3 * x), 0.012, min(0.1, dur * 0.3)) * 0.5
def pad(T, ms, dur, cut=1200, att=0.5, rel=0.7):
    n = int(dur * SR); x = np.zeros(n)
    for m in ms:
        for d in (-0.08, 0.0, 0.08):
            f = note(m) * 2 ** (d / 12); x += 2 * ((np.arange(n) * f / SR + T.rng.random()) % 1) - 1
    x = lp(x / (len(ms) * 3), cut, 2)
    a = np.minimum(1, np.arange(n) / (att * SR)); r = np.minimum(1, (n - np.arange(n)) / (rel * SR))
    return x * a * r * 0.3
def ep(m, dur, d=1.1):
    # soft electric piano (2-op FM), no attack click
    n = int(dur * SR); t = np.arange(n) / SR; f = note(m)
    I = 1.6 * np.exp(-t / 0.25) + 0.15
    x = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    return fade(x * env(n, 0.003, d), 0.003, min(0.25, dur * 0.3)) * 0.22
def chord(ms, dur, d=1.1, spread=0.012):
    n = int(dur * SR) + int(spread * len(ms) * SR); x = np.zeros(n)
    for k, m in enumerate(ms):
        i = int(k * spread * SR); y = ep(m, dur, d); x[i:i + len(y)] += y
    return x
def boom(g=1.0, f0=44, d=0.45):
    n = int(1.4 * SR); t = np.arange(n) / SR
    return np.tanh(1.6 * sine(f0 + 40 * np.exp(-t / 0.05), n) * env(n, 0.002, d)) * 0.6 * g


# ------------------------------------------------------------------ SFX (short, dry, crisp)
def s_click(T, f=3200, g=1.0):
    n = int(0.03 * SR); return (hp(T.noise(n), 1500) * env(n, 0, 0.003) + 0.4 * sine(f, n) * env(n, 0, 0.004)) * 0.6 * g
def s_firm_click(T):
    n = int(0.06 * SR); t = np.arange(n) / SR
    return np.concatenate([s_click(T, 2600, 1.0), np.zeros(n - int(0.03 * SR))]) + np.tanh(2 * sine(170 * (1 + 0.5 * np.exp(-t / 0.01)), n) * env(n, 0.0005, 0.018)) * 0.45
def s_soft_click(T): return lp(s_click(T, 2200, 0.8), 6000)
def s_tick(T, f=2500, g=1.0):
    n = int(0.025 * SR); return (sine(f, n) * env(n, 0, 0.006) * 0.5 + hp(T.noise(n), 4000) * env(n, 0, 0.0015) * 0.3) * g
def s_key(T, g=1.0):
    n = int(0.035 * SR)
    return (bp(T.noise(n), 2500, 9000) * env(n, 0, 0.004) + 0.3 * sine(T.rng.uniform(1600, 2200), n) * env(n, 0, 0.006)) * g * 0.8
def s_paper_slap(T):
    n = int(0.16 * SR); t = np.arange(n) / SR
    body = bp(T.noise(n), 250, 4200) * env(n, 0.0005, 0.03)
    flap = hp(T.noise(n), 2500) * env(n, 0.0, 0.012) * 0.6
    low = sine(120 * (1 + 0.6 * np.exp(-t / 0.01)), n) * env(n, 0.0005, 0.025) * 0.5
    return np.tanh(1.5 * (body + flap + low)) * 0.75
def s_shutter(T):
    n = int(0.11 * SR); x = np.zeros(n)
    for o, g in ((0, 1.0), (0.05, 0.75)):
        i = int(o * SR); m = int(0.028 * SR); x[i:i + m] += (bp(T.noise(m), 1500, 7000) * env(m, 0, 0.005) + sine(900, m) * env(m, 0, 0.004) * 0.3) * g
    return x * 0.7
def s_snap(T):
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (hp(T.noise(n), 2500) * env(n, 0, 0.0025) * 0.9 + sine(1900 * (1 + 0.3 * np.exp(-t / 0.004)), n) * env(n, 0, 0.012) * 0.35)
def s_cal_tick(T):
    a = s_tick(T, 2300, 1.0); b = s_tick(T, 3100, 0.7); x = np.zeros(int(0.1 * SR))
    x[:len(a)] += a; i = int(0.065 * SR); x[i:i + len(b)] += b; return x
def s_confirm(T, f1=1568, f2=2093, g=0.7):
    n = int(0.09 * SR); x = np.zeros(int(0.22 * SR)); c = s_soft_click(T); x[:len(c)] += c
    for k, f in enumerate((f1, f2)):
        i = int((0.0 + 0.07 * k) * SR); x[i:i + n] += sine(f, n) * env(n, 0.002, 0.03) * 0.22 * g
    return x
def s_slide(T, L=0.32, f0=500, f1=1800, g=0.6):
    n = int(L * SR); x = T.noise(n); out = np.zeros(n); seg = 480
    for i in range(0, n, seg):
        p = i / n; fc = f0 * (f1 / f0) ** p; out[i:i + seg] = bp(x[i:i + seg], max(80, fc * 0.6), min(20000, fc * 1.7), 1)
    e = np.minimum(1, np.arange(n) / (0.012 * SR)) * np.linspace(1, 0, n) ** 1.5
    return out * e * 0.5 * g
def s_pop(T, f=900, g=1.0):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return sine(f * (1 + 0.8 * np.exp(-t / 0.01)), n) * env(n, 0.0008, 0.025) * 0.55 * g
def s_notif(T, g=1.0):
    a = s_pop(T, 820, 1.0); b = s_pop(T, 1230, 0.7); x = np.zeros(int(0.15 * SR)); x[:len(a)] += a; i = int(0.055 * SR); x[i:i + len(b)] += b; return x * g
def s_thud(T, f=70, d=0.09, g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return np.tanh(2.2 * sine(f * (1 + 0.6 * np.exp(-t / 0.02)), n) * env(n, 0.0008, d)) * 0.7 * g
def s_metal_tap(T):
    # muted metallic tap: inharmonic partials, fast damping, low-passed (not a bell or register chime)
    n = int(0.12 * SR); f = 640
    x = sum(a * sine(f * r, n) * env(n, 0.0005, d) for r, a, d in ((1, 0.6, 0.035), (2.76, 0.35, 0.02), (5.4, 0.2, 0.012)))
    return lp(x + bp(T.noise(n), 2000, 6000) * env(n, 0, 0.002) * 0.4, 5000) * 0.6
def s_mech_click(T):
    x = np.zeros(int(0.06 * SR)); a = s_click(T, 2400, 0.9); b = lp(s_click(T, 1500, 0.7), 4000)
    x[:len(a)] += a; i = int(0.024 * SR); x[i:i + len(b)] += b; return x
def s_tap(T, g=1.0):
    n = int(0.03 * SR); return (bp(T.noise(n), 800, 2600) * env(n, 0, 0.004) + sine(420, n) * env(n, 0, 0.008) * 0.5) * 0.7 * g
def s_paper_slide(T): return s_slide(T, 0.36, 900, 3600, 0.8)
def s_note(T, f=1046.5, g=0.6):
    n = int(0.5 * SR); return (sine(f, n) + 0.3 * sine(2 * f, n)) * env(n, 0.003, 0.14) * 0.25 * g
def s_two_note(T):
    x = np.zeros(int(0.5 * SR)); a = s_note(T, 1318.5, 0.9); b = s_note(T, 1975.5, 0.8); x[:len(a)] += a; i = int(0.12 * SR); x[i:i + len(b)] += b[:len(x) - i]; return x
def s_send(T):
    x = np.zeros(int(0.2 * SR)); c = s_click(T, 3000, 1.0); w = s_slide(T, 0.16, 1200, 5000, 0.5); x[:len(c)] += c; x[:len(w)] += w; return x
def s_copy(T):
    x = np.zeros(int(0.05 * SR)); a = s_click(T, 3600, 0.9); b = s_click(T, 4200, 0.6); x[:len(a)] += a; i = int(0.018 * SR); x[i:i + len(b)] += b; return x
def s_tick_pulse(T, n=6, step=0.0833):
    x = np.zeros(int((n * step + 0.05) * SR))
    for k in range(n):
        y = s_tick(T, 2800, 0.6 * (1 - k / (n + 2))); i = int(k * step * SR); x[i:i + len(y)] += y
    return x


# ------------------------------------------------------------------ scores
def grid(bpm): return 60 / bpm
def steps(t0, t1, step):
    k = int(np.ceil(t0 / step - 1e-6)); out = []
    while k * step < t1 - 1e-6: out.append(round(k * step, 6)); k += 1
    return out


def score_L1():
    M, S = Track(11), Track(12); ev = []
    def sfx(t, x, g=1.0, name="", pan=0.0): S.add(x, t, g, pan); ev.append((t, name))
    B = grid(90); E8 = B / 2
    prog = [(38, [62, 65, 69, 72]), (34, [62, 65, 69, 70]), (41, [60, 65, 69, 72]), (36, [60, 64, 67, 72])]  # Dm9 Bbmaj7 F C (D minor)
    def chord_at(t): return prog[int(t // (4 * B)) % 4]
    # 0.0 hit: low boom + Dm stab, gap at 1-2
    M.add(boom(0.9), 0.0); M.add(chord([50, 57, 62, 65, 69], 1.0, 0.45), 0.0, 0.9)
    # 2.0 low pulse (8ths), restrained
    for t in steps(2.0, 22.0, E8):
        root, _ = chord_at(t)
        if 6.0 <= t < 7.0: g = 0.5
        elif 7.0 <= t < 8.0: continue
        else: g = 0.8 if (round(t / E8) % 2 == 0) else 0.55
        M.add(bass_pulse(root, E8 * 0.9), t, g)
    # muted percussion from 2.667 (bar 2) to 6.0, back on the 8.0 downbeat to 22.0
    for t in steps(2.0, 22.0, E8):
        if 6.0 <= t < 8.0 or t < 2.66: continue
        k = round(t / E8) % 8
        if k in (0, 4): M.add(kick_soft(M, 0.8), t)
        if k in (2, 6): M.add(rim(M, 0.55), t, 1, 0.15)
        M.add(shaker(M, 0.5 if k % 2 else 0.8), t, 1, -0.3)
    # pads: thin until 8, then bed; "music opens" at 15 (brighter, wider)
    for bar in range(0, 11):
        t = bar * 4 * B
        if t >= 26.0: break
        root, ch = chord_at(t + 0.01); dur = min(4 * B, 26.0 - t)
        if t + dur <= 2.0: continue
        a = max(t, 2.0); d = t + dur - a
        if a < 8.0 and a + d > 6.0:  # thins at 6, gone 7-8
            d1 = max(0, 6.0 - a)
            if d1 > 0.3: M.add(pad(M, ch, d1 + 0.3, 700, 0.6, 0.5), a, 0.45)
            if a + d > 8.0: M.add(pad(M, ch, a + d - 8.0, 1100, 0.2, 0.6), 8.0, 0.6)
            continue
        cut = 2400 if a >= 15.0 else 1100
        M.add(pad(M, ch, d, cut, 0.5, 0.6), a, 0.7 if a >= 15.0 else 0.55)
        if a >= 15.0 and a < 22.0:  # opens: soft e-piano broken chord
            for k, m in enumerate(ch):
                M.add(ep(m + 12, 0.9, 0.5), a + k * 2 * E8, 0.5, (-0.4, 0.4)[k % 2])
    # hits (musical accents): 7 reveal, 9, 12, 14, 19
    for th, ch in ((7.0, [46, 53, 58, 62]), (9.0, [50, 57, 62, 65]), (12.0, [46, 53, 58, 65]), (14.0, [53, 60, 65, 69]), (19.0, [48, 55, 60, 64])):
        M.add(boom(0.55 if th != 7.0 else 0.8, 46), th); M.add(chord(ch, 0.9, 0.35, 0.0), th, 0.6)
    # 20.0 warm bass note
    M.add(warm_bass(38, 1.9), 20.0, 1.1)
    # 22-26 bed only (pad + slow pulse already stops at 22): sustained Bb-F pad
    M.add(pad(M, [58, 62, 65, 69], 4.1, 1000, 0.3, 0.6), 22.0, 0.65); M.add(bass_pulse(34, 4.0, 300), 22.0, 0.55)
    # 26 final chord Dm(add9), short tail
    M.add(chord([38, 50, 57, 62, 64, 69], 2.0, 1.4, 0.018), 26.0, 1.0); M.add(pad(M, [50, 57, 62, 64, 69], 1.95, 1600, 0.05, 0.9), 26.0, 0.6)
    M.add(boom(0.5, 40, 0.8), 26.0)
    M.buf[int(1.0 * SR):int(2.0 * SR)] *= np.linspace(1, 0, int(1.0 * SR))[:, None] ** 6  # brief musical gap
    # SFX per row
    sfx(0.0, s_paper_slap(S), 1.0, "paper slap"); sfx(3.0, s_tick(S, 2400), 0.8, "soft tick"); sfx(4.0, s_tick(S, 2700), 0.8, "second tick")
    sfx(5.0, s_shutter(S), 0.55, "small camera click"); sfx(7.0, s_snap(S), 1.0, "reveal snap"); sfx(9.0, s_firm_click(S), 1.0, "firm click")
    sfx(10.0, s_key(S), 0.8, "light key tap"); sfx(11.0, s_key(S), 0.8, "light key tap"); sfx(12.0, s_cal_tick(S), 1.0, "calendar tick")
    sfx(13.0, s_shutter(S), 0.9, "camera click"); sfx(14.0, s_confirm(S), 1.0, "soft confirmation click"); sfx(16.0, s_slide(S, 0.32, 400, 1400, 0.45), 1.0, "quiet slide")
    sfx(19.0, s_click(S), 1.0, "single click"); sfx(25.0, s_soft_click(S), 0.8, "soft closing click")
    return M.buf, S.buf, ev


def score_L2():
    M, S = Track(21), Track(22); ev = []
    def sfx(t, x, g=1.0, name="", pan=0.0): S.add(x, t, g, pan); ev.append((t, name))
    B = grid(105); X = B / 4  # 16th; 1 s = 7 sixteenths
    prog = [(41, [65, 69, 72, 76]), (38, [62, 65, 69, 72]), (34, [62, 65, 70, 74]), (36, [64, 67, 70, 72])]  # Fmaj7 Dm7 Bbmaj7 C7sus (F major)
    def chord_at(t): return prog[int(t // (4 * B)) % 4]
    # 0-4: bed holds one note (F), hits at 0 and 3; break 4-5
    M.add(pad(M, [53, 65], 4.0, 900, 0.08, 0.05), 0.0, 0.8)
    M.add(boom(0.6, 44), 0.0); M.add(chord([53, 60, 65, 69, 76], 0.9, 0.4), 0.0, 0.7)
    M.add(chord([50, 57, 62, 65, 69], 0.8, 0.35), 3.0, 0.55); M.add(boom(0.35, 46), 3.0)
    # 5: hit, bed back; 6: rhythm begins (pickup fill), groove until 22
    M.add(boom(0.6, 44), 5.0); M.add(chord([53, 60, 65, 69], 0.9, 0.4), 5.0, 0.65)
    for k in range(4): M.add(snare_dry(M, 0.3 + 0.12 * k), 6.0 + k * X)
    for t in steps(6.0 + 4 * X, 22.0, X):
        k = round(t / X) % 16
        if k in (0, 7, 10): M.add(kick_soft(M, 0.9, 52), t)
        if k in (4, 12): M.add(snare_dry(M, 0.75), t, 1, 0.1)
        if k % 2 == 0: M.add(hat_e(M, 0.55 if k % 4 else 0.8, 0.02), t, 1, -0.35)
    for t in steps(5.0, 22.0, 2 * X):  # warm bass line, 8ths with rests
        k = round(t / X) % 16; root, ch = chord_at(t)
        if t < 6.0 and k % 8: continue
        if k in (0, 3 * 2, 10) or (k == 14 and t > 8):
            M.add(warm_bass(root + (12 if k == 14 else 0), 2 * X * 0.95), t, 0.9)
    for bar in range(0, 13):
        t = bar * 4 * B
        if t + 4 * B <= 5.0: continue
        if t >= 26.0: break
        a = max(t, 5.0); d = min(t + 4 * B, 26.0) - a; root, ch = chord_at(t + 0.01)
        if d > 0.2: M.add(pad(M, ch, d, 1500, 0.3, 0.5), a, 0.5)
    for th, ch in ((8.0, [50, 57, 62, 65]), (12.0, [46, 53, 58, 62]), (15.0, [53, 60, 65, 69]), (21.0, [48, 55, 60, 64])):
        M.add(boom(0.45, 46), th); M.add(chord(ch, 0.8, 0.35), th, 0.55)
    M.add(warm_bass(29, 1.5), 16.0, 1.3)  # fuller bass note
    M.add(pad(M, [58, 62, 65, 69], 4.1, 1100, 0.3, 0.6), 22.0, 0.6); M.add(warm_bass(34, 4.0), 22.0, 0.5)
    M.add(chord([41, 53, 60, 64, 67, 69], 2.0, 1.4, 0.018), 26.0, 1.0); M.add(pad(M, [53, 60, 64, 67, 69], 1.95, 1800, 0.05, 0.9), 26.0, 0.55)
    M.add(boom(0.45, 41, 0.8), 26.0)
    M.buf[int(4.0 * SR):int(5.0 * SR)] *= 0.0  # break: beat cuts briefly
    M.buf[int(4.0 * SR) - 480:int(4.0 * SR)] *= np.linspace(1, 0, 480)[:, None]
    sfx(0.0, s_click(S, 3000), 0.9, "tight click 1"); sfx(0.1, s_click(S, 3300), 0.8, "tight click 2")
    sfx(2.0, s_tap(S), 0.8, "light tap"); sfx(3.0, s_tap(S, 1.1), 0.9, "second tap"); sfx(5.0, s_paper_slide(S), 1.0, "paper slide")
    sfx(7.0, s_mech_click(S), 0.9, "mechanical click"); sfx(8.0, s_metal_tap(S), 1.0, "muted metallic tap"); sfx(9.0, s_shutter(S), 0.9, "camera click")
    sfx(10.0, s_key(S), 0.8, "key tap 1"); sfx(10.15, s_key(S), 0.7, "key tap 2"); sfx(12.0, s_firm_click(S), 1.0, "firm click")
    sfx(13.0, s_tap(S), 0.75, "light tap"); sfx(14.0, s_note(S, 1396.9, 0.8), 1.0, "soft confirmation note")
    sfx(15.0, s_click(S, 3000), 0.9, "opening click repeats"); sfx(15.1, s_click(S, 3300), 0.8, "opening click repeats 2")
    sfx(17.0, s_slide(S, 0.32, 400, 1400, 0.45), 1.0, "quiet slide"); sfx(21.0, s_click(S), 1.0, "single click"); sfx(25.0, s_tap(S, 0.8), 0.8, "soft closing tap")
    return M.buf, S.buf, ev


def score_L3():
    M, S = Track(31), Track(32); ev = []
    def sfx(t, x, g=1.0, name="", pan=0.0): S.add(x, t, g, pan); ev.append((t, name))
    B = grid(120); X = B / 4
    prog = [(40, [64, 67, 71, 74]), (36, [64, 67, 72, 76]), (43, [62, 67, 71, 74]), (38, [62, 66, 69, 74])]  # Em7 C G D (E minor)
    def chord_at(t): return prog[int(t // (4 * B)) % 4]
    # 0-6: ticking pulse + short bass notes; tension note at 4; low thud at 5; stop 6.0
    for t in steps(1.0, 6.0, X * 2):
        M.add(hat_e(M, 0.45 if round(t / X) % 4 else 0.65), t, 1, 0.3)
    for t in steps(2.0, 6.0, B):
        M.add(bass_short(40 if t < 4 else 41), t, 0.9)
    for th, ch, g in ((0.0, [52, 59, 64, 67], 0.7), (2.0, [52, 59, 64, 67], 0.45), (3.0, [52, 59, 64, 67], 0.4)):
        M.add(chord(ch, 0.5, 0.18, 0.0), th, g); M.add(kick_soft(M, 0.7, 50), th)
    M.add(pad(M, [64, 65], 2.0, 1400, 0.25, 0.05), 4.0, 0.7)  # tension: E against F
    M.add(boom(0.7, 40, 0.5), 5.0); M.add(kick_soft(M, 0.9, 44), 5.0)
    M.buf[int(6.0 * SR):int(8.0 * SR)] = 0.0  # bed stops 6.0 -> 8.0
    M.buf[int(6.0 * SR) - 480:int(6.0 * SR)] *= np.linspace(1, 0, 480)[:, None]
    # 8.0 main beat enters
    for t in steps(8.0, 22.0, X):
        k = round(t / X) % 16
        if k in (0, 8, 11): M.add(kick_soft(M, 1.0, 50), t)
        if k in (4, 12): M.add(clap_e(M, 0.7), t, 1, 0.05)
        M.add(hat_e(M, 0.7 if k % 4 == 2 else 0.4), t, 1, -0.3)
        if k % 2 == 0:
            root, ch = chord_at(t)
            if k in (0, 4, 6, 10, 14): M.add(bass_short(root), t, 0.8)
    for bar in range(4, 13):
        t = bar * 4 * B
        if t >= 26.0: break
        root, ch = chord_at(t + 0.01); d = min(4 * B, 26.0 - t)
        M.add(pad(M, ch, d, 1300 if t < 20 else 2000, 0.3, 0.4), t, 0.4 if t < 20 else 0.55)
    for th, ch in ((8.0, [52, 59, 64, 67]), (10.0, [52, 59, 64, 71]), (17.0, [50, 57, 62, 66]), (19.0, [52, 59, 64, 67])):
        M.add(chord(ch, 0.5, 0.2, 0.0), th, 0.55); M.add(boom(0.35, 44, 0.3), th)
    M.add(s_slide(M, 0.5, 300, 3000, 0.5), 19.5, 0.6)  # small rise into the resolve at 20
    M.add(chord([48, 55, 60, 64, 67, 71], 1.2, 0.9), 20.0, 0.6)  # tension resolves (C maj7)
    M.add(pad(M, [55, 59, 62, 66, 69], 1.0, 2400, 0.08, 0.3), 21.0, 0.7); M.add(chord([43, 55, 59, 62, 66], 1.0, 0.8), 21.0, 0.6)  # warm chord (Gmaj9)
    M.add(pad(M, [60, 64, 67, 71], 4.1, 1100, 0.3, 0.6), 22.0, 0.6); M.add(bass_pulse(36, 4.0, 300), 22.0, 0.5)
    M.add(chord([40, 52, 59, 64, 66, 68], 2.0, 1.4, 0.018), 26.0, 1.0); M.add(pad(M, [52, 59, 64, 66, 68], 1.95, 1800, 0.05, 0.9), 26.0, 0.55)  # resolve to E major (add9)
    M.add(boom(0.45, 40, 0.8), 26.0)
    sfx(0.0, s_notif(S), 1.0, "notification pop"); sfx(1.0, s_tick_pulse(S), 0.9, "short ticking pulse"); sfx(2.0, s_notif(S, 0.6), 1.0, "second, quieter pop")
    sfx(3.0, s_copy(S), 1.0, "dry copy click"); sfx(4.0, pad(S, [76, 77], 0.9, 3000, 0.02, 0.4) * 0.6, 1.0, "tension note")
    sfx(5.0, s_thud(S, 62, 0.11), 1.0, "low thud"); sfx(7.0, s_snap(S), 1.0, "single sharp click"); sfx(9.0, s_key(S), 0.85, "key tap")
    sfx(10.0, s_confirm(S, 1760, 2349, 0.8), 1.0, "firm confirmation click"); sfx(10.0, s_firm_click(S), 0.6, "firm confirmation click (body)")
    sfx(11.0, s_slide(S, 0.3, 400, 1500, 0.45), 1.0, "soft slide"); sfx(13.0, s_two_note(S), 1.0, "two-note accent")
    sfx(16.0, s_slide(S, 0.32, 400, 1400, 0.45), 1.0, "quiet slide"); sfx(17.0, s_click(S), 1.0, "single click")
    sfx(18.0, s_notif(S), 1.0, "opening pop repeats"); sfx(19.0, s_send(S), 1.0, "send click"); sfx(25.0, s_soft_click(S), 0.8, "soft closing click")
    return M.buf, S.buf, ev


SCORES = {"L1": score_L1, "L2": score_L2, "L3": score_L3}
HITS = {"L1": [0, 7, 9, 12, 14, 19], "L2": [0, 3, 5, 8, 12, 15, 21], "L3": [0, 2, 3, 5, 7, 8, 10, 17, 19]}


def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def bus_comp(x, thr_db, ratio=3.0, att=0.004, rel=0.12):
    # feed-forward peak compressor on the music bus (tames drum/boom crest so the master needs little limiting)
    lvl = np.abs(x).max(1); a_a = np.exp(-1 / (att * SR)); a_r = np.exp(-1 / (rel * SR))
    e = np.empty_like(lvl); cur = 0.0
    for i, v in enumerate(lvl):
        cur = a_a * cur + (1 - a_a) * v if v > cur else a_r * cur + (1 - a_r) * v
        e[i] = cur
    over = np.maximum(0, 20 * np.log10(e + 1e-9) - thr_db)
    return x * (10 ** (-over * (1 - 1 / ratio) / 20))[:, None]


def duck_curve(windows, depth_db=-7.0, att=0.08, rel=0.2):
    g = np.zeros(N)  # 0 = no duck, 1 = full duck
    t = np.arange(N) / SR
    for a, b in windows:
        up = np.clip((t - (a - att)) / att, 0, 1); down = np.clip(((b + rel) - t) / rel, 0, 1)
        g = np.maximum(g, np.minimum(up, down))
    return 10 ** (depth_db * g / 20)


if __name__ == "__main__":
    for vid in sys.argv[1:] or ["L1", "L2", "L3"]:
        music, sfx, ev = SCORES[vid]()
        music[int(27.95 * SR):] = 0
        music[int(27.2 * SR):int(27.95 * SR)] *= np.linspace(1, 0, int(0.75 * SR))[:, None] ** 2  # short tail
        nz = np.abs(music).sum(1) > 1e-6
        music *= 10 ** ((-23 - rms_db(music[nz])) / 20)
        music = bus_comp(music, -19.0, 3.0)
        music *= 10 ** ((-23 - rms_db(music[nz])) / 20)
        th = 10 ** (-16.5 / 20); music = th * np.tanh(music / th)  # soft-clip the few transients left over the bus
        sfx *= 10 ** ((-15 - 20 * np.log10(np.abs(sfx).max())) / 20)  # loudest SFX peak at -15 dBFS pre-master (about 8 dB over the bed RMS, 15 dB over the ducked bed)
        d = duck_curve(VO[vid]["windows"])
        mix = music * d[:, None] + sfx
        sf.write(os.path.join(OUT, f"A-{vid}-premaster.wav"), mix.astype(np.float32), SR, subtype="FLOAT")
        sf.write(os.path.join(OUT, f"A-{vid}-sfx.wav"), sfx.astype(np.float32), SR, subtype="FLOAT")
        sf.write(os.path.join(OUT, f"A-{vid}-music.wav"), (music * d[:, None]).astype(np.float32), SR, subtype="FLOAT")
        json.dump({"events": ev, "hits": HITS[vid], "duck_db": -7.0, "windows": VO[vid]["windows"]}, open(os.path.join(OUT, f"A-{vid}-events.json"), "w"), indent=1)
        print(vid, "events", len(ev), "music rms", round(rms_db(music[nz]), 1), "peak", round(20 * np.log10(np.abs(mix).max()), 1))
