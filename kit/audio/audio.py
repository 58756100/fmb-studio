import json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 44.0
N = int(DUR * SR)
rng = np.random.default_rng(7)

W = json.load(open('/home/claude/fmb/audio/words_final.json'))
ws = lambda i: W[i][1]
we = lambda i: W[i][2]

def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)
def env(n, a, d):  # attack/decay seconds, exp decay
    t = np.arange(n) / SR
    e = np.exp(-t / max(d, 1e-4))
    if a > 0: e *= np.clip(t / a, 0, 1)
    return e
def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x))
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += x[:j - i] * g * l * 1.414
    buf[i:j, 1] += x[:j - i] * g * r * 1.414
def sine(f, n, ph=0):
    if np.isscalar(f): return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def noise(n): return rng.standard_normal(n)
def note(m): return 440 * 2 ** ((m - 69) / 12)

# ------------------------------------------------ instruments
def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / 0.035)
    x = sine(f, n) * env(n, 0.001, 0.22)
    x += 0.4 * hp(noise(n), 3000) * env(n, 0, 0.004)
    return np.tanh(1.6 * x) * g
def clap():
    n = int(0.3 * SR); x = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR); b = bp(noise(n - i), 900, 2600) * env(n - i, 0, 0.012 if k < 2 else 0.11)
        x[i:] += b
    return x * 0.55
def hat(o=False):
    n = int((0.18 if o else 0.05) * SR)
    return hp(noise(n), 7000) * env(n, 0, 0.06 if o else 0.014) * 0.35
def sub(m, dur):
    n = int(dur * SR); f = note(m)
    x = sine(f, n) + 0.25 * sine(2 * f, n)
    e = np.minimum(1, np.arange(n) / (0.01 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.06 * SR))
    return np.tanh(1.3 * x * e) * 0.5
def pluck(m, dur=0.5, bright=3500):
    n = int(dur * SR); f = note(m)
    saw = 2 * ((np.arange(n) * f / SR) % 1) - 1
    saw2 = 2 * ((np.arange(n) * f * 1.004 / SR) % 1) - 1
    x = lp(0.5 * (saw + saw2), bright) * env(n, 0.002, 0.16)
    return x * 0.22
def pad(ms, dur, cut=1400):
    n = int(dur * SR); x = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.07):
            f = note(m) * 2 ** (d / 12)
            x += 2 * ((np.arange(n) * f / SR + rng.random()) % 1) - 1
    x = lp(x / (len(ms) * 3), cut, 2)
    a = np.minimum(1, np.arange(n) / (0.6 * SR)); r = np.minimum(1, (n - np.arange(n)) / (0.8 * SR))
    return x * a * r * 0.32

# ------------------------------------------------ score (F minor, 100 bpm)
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT
DROP = ws(44) - 0.04                        # logo reveal lands on a downbeat
T0 = DROP - round(DROP / BAR) * BAR          # phase so DROP is a bar line
STOP = we(40) + 0.02                         # tape stop at end of "finds again."
END = 43.0                                   # final sting
music = np.zeros((N, 2))
prog = [(53, [65, 68, 72]), (49, [61, 65, 68, 72]), (56, [63, 68, 72]), (51, [63, 67, 70])]  # Fm  Db  Ab  Eb
arp = [0, 1, 2, 1, 2, 3, 2, 1]
b = 0
t = T0 - BAR
while t < DUR:
    bar_i = int(round((t - T0) / BAR))
    root, ch = prog[bar_i % 4]
    sec = 'intro' if t < 3.55 else 'groove' if t < STOP else 'gap' if t < DROP - 0.01 else 'drop' if t < 40.2 else 'outro' if t < END else 'end'
    if sec == 'end': break
    for k in range(4):
        tb = t + k * BEAT
        if tb < 0 or tb >= DUR: continue
        if sec == 'gap' or (sec == 'groove' and tb >= STOP): continue
        if sec in ('groove', 'drop'):
            if k in (0, 2) or (sec == 'drop' and k == 3 and bar_i % 2 == 1): add(music, kick(0.9), tb)
            if k in (1, 3): add(music, clap(), tb, 0.8)
            add(music, hat(), tb + BEAT / 2, 0.8, 0.3)
            if sec == 'drop': add(music, hat(), tb, 0.45, -0.3)
        if sec == 'intro' and k in (0, 2): add(music, kick(0.45), tb)
        if sec == 'outro' and k == 0: add(music, kick(0.6), tb)
    if sec in ('groove', 'drop', 'outro') and t >= 0:
        dur = min(BAR, (STOP - t) if sec == 'groove' else BAR)
        if dur > 0.05: add(music, sub(root - 12 + 12, dur), t, 0.9 if sec != 'outro' else 0.6)
    # arp 8ths
    for k in range(8):
        tb = t + k * BEAT / 2
        if tb < 0 or tb >= DUR: continue
        if sec == 'gap' or (sec == 'groove' and tb >= STOP): continue
        m = ch[arp[k] % len(ch)] + (12 if sec == 'drop' and k % 4 == 3 else 0)
        bright = 1600 if sec == 'intro' else 3000 if sec == 'groove' else 5200 if sec == 'drop' else 2400
        add(music, pluck(m, 0.45, bright), tb, 0.8 if sec != 'intro' else 0.55, -0.35 if k % 2 else 0.35)
    if sec in ('drop', 'outro', 'groove') and t >= 0:
        dur = min(BAR, (STOP - t) if sec == 'groove' else BAR)
        if dur > 0.2: add(music, pad([c + 12 for c in ch], dur + 0.3, 2200 if sec == 'drop' else 1200), t, 0.55 if sec != 'groove' else 0.35)
    t += BAR

# intro low-pass sweep opening into the groove
cut_n = int(3.55 * SR)
music[:cut_n] = lp(music[:cut_n].T, 900).T
# tape stop: pitch-drop the last 0.32s before STOP
ts = int((STOP - 0.32) * SR); te = int(STOP * SR)
seg = music[ts:te].copy(); L = te - ts
pos = np.cumsum(np.linspace(1, 0.05, L)); pos = np.clip(pos, 0, L - 1).astype(int)
music[ts:te] = seg[pos] * np.linspace(1, 0, L)[:, None] ** 0.5
music[te:int((DROP - 0.01) * SR)] = 0
# outro: let last bar ring, fade by 43.9
fade_s, fade_e = int(43.2 * SR), int(43.9 * SR)
music[fade_s:fade_e] *= np.linspace(1, 0, fade_e - fade_s)[:, None]
music[fade_e:] = 0

# ------------------------------------------------ SFX
sfx = np.zeros((N, 2))
def key():
    n = int(0.035 * SR)
    x = bp(noise(n), 2500, 9000) * env(n, 0, 0.004) + 0.3 * sine(rng.uniform(1600, 2200), n) * env(n, 0, 0.006)
    return x * rng.uniform(0.7, 1.0)
def tink(f=1800):
    n = int(0.35 * SR); return (sine(f, n) + 0.5 * sine(f * 1.5, n) + 0.2 * sine(f * 2.76, n)) * env(n, 0.001, 0.09) * 0.22
def whoosh(L, f0=600, f1=4000, g=1.0):
    n = int(L * SR); x = noise(n); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        p = i / n; fc = f0 * (f1 / f0) ** p
        out[i:i + seg] = bp(x[i:i + seg], max(80, fc * 0.6), min(20000, fc * 1.6), 1)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return out * e * 0.35 * g
def thump(f=110, d=0.08, g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return np.tanh(2 * sine(f * (1 + 0.6 * np.exp(-t / 0.02)), n) * env(n, 0.001, d)) * 0.5 * g
def pop(f=900):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return sine(f * (1 + 0.8 * np.exp(-t / 0.01)), n) * env(n, 0.001, 0.025) * 0.35
def click():
    n = int(0.03 * SR); return (hp(noise(n), 1500) * env(n, 0, 0.003) + 0.4 * sine(3200, n) * env(n, 0, 0.004)) * 0.6
def chime(f=1320, d=0.5):
    n = int(1.2 * SR); return (sine(f, n) + 0.6 * sine(f * 1.5, n) + 0.25 * sine(f * 2, n)) * env(n, 0.002, d) * 0.2
def shutter():
    n = int(0.12 * SR); x = np.zeros(n)
    for o in (0, 0.045):
        i = int(o * SR); m = int(0.03 * SR); x[i:i + m] += bp(noise(m), 1500, 7000) * env(m, 0, 0.006)
    return x * 0.6
def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    s = sine(36 + 50 * np.exp(-t / 0.08), n) * env(n, 0.002, 0.7)
    nz = lp(noise(n), 2500) * env(n, 0, 0.12) * 0.5
    sh = hp(noise(n), 6000) * env(n, 0.05, 0.5) * 0.12
    return np.tanh(1.5 * (s + nz)) * 0.7 + sh
def hit():
    n = int(0.6 * SR); t = np.arange(n) / SR
    return np.tanh(2.2 * sine(52 + 70 * np.exp(-t / 0.03), n) * env(n, 0.001, 0.18)) * 0.55 + lp(noise(n), 1200) * env(n, 0, 0.02) * 0.3
def crackle(L):
    n = int(L * SR); x = np.zeros(n)
    for _ in range(int(L * 260)):
        i = rng.integers(0, n - 400); m = rng.integers(40, 300)
        x[i:i + m] += hp(noise(m), 2500) * env(m, 0, 0.002) * rng.uniform(0.2, 1)
    return x * np.linspace(1, 0.2, n) * 0.45
def ticks(t0, t1, count, f=2400, g=0.5):
    for k in range(count):
        add(sfx, pop(f * rng.uniform(0.9, 1.15)) * 0.6, t0 + (t1 - t0) * k / max(1, count - 1), g, rng.uniform(-0.5, 0.5))
def typing(t0, t1, nchar, g=0.55):
    for k in range(nchar):
        add(sfx, key(), t0 + (t1 - t0) * (k + 0.5) / nchar + rng.uniform(-0.01, 0.01), g, rng.uniform(-0.25, 0.25))

# cut times (match Reel.tsx)
c1, c2, c3, c4, c5, c6 = ws(11) - 0.06, ws(14) - 0.08, ws(24) - 0.1, ws(30) - 0.08, ws(33) - 0.06, ws(36) - 0.06
c7, c8, c9, c10, c11 = we(40) + 0.22, ws(47) - 0.12, ws(56) - 0.08, ws(70) - 0.1, ws(73) - 0.1
c12, c13, c14 = ws(85) - 0.1, ws(97) - 0.1, ws(107) - 0.12
TR = [(c1, .36), (c2, .34), (c3, .42), (c4, .32), (c5, .3), (c6, .3), (c8, .5), (c9, .4), (c10, .46), (c11, .42), (c12, .46), (c13, .4), (c14, .46)]
for c, L in TR: add(sfx, whoosh(L + 0.25, 500, 5000), c - (L + 0.25) / 2, 0.9, rng.uniform(-0.3, 0.3))

# S1
typing(-0.06 + 0.07, we(4), 19); swap = ws(5) - 0.04; typing(swap + 0.04, we(10) - 0.05, 23)
for t0, f in zip([0.22, 0.82, 1.42, 2.12, 2.72], [1760, 1975, 1760, 2093, 1975]): add(sfx, tink(f), t0, 0.9, 0.2)
# S2
add(sfx, thump(95, 0.12), c1 + 0.08, 0.9); add(sfx, pop(1300), ws(12) + 0.04, 0.8)
for i in range(4): add(sfx, pop(1500 + i * 180), c1 + 0.5 + i * 0.09, 0.7, -0.4 + i * 0.27)
# S3
sw = ws(20) - 0.08
add(sfx, whoosh(0.45, 300, 2500, 0.9), sw - 0.05, 0.8); add(sfx, pop(1700), ws(15) + 0.12, 0.6); add(sfx, pop(1900), sw + 0.42, 0.6)
add(sfx, click(), ws(23) - 0.06, 0.5)
# S4
add(sfx, whoosh(1.0, 2500, 300, 0.7), c3, 0.5)
ticks(ws(27) - 0.05, ws(27) + 0.9, 18, 2600, 0.45)
# S5
add(sfx, whoosh(0.4, 800, 6000), c5 - 0.42, 0.6)
add(sfx, click(), ws(35) - 0.25, 0.4); add(sfx, click(), ws(35) - 0.05, 0.4); add(sfx, thump(70, 0.15), ws(35) + 0.12, 0.9)
add(sfx, crackle(c7 - (we(40) - 0.42)), we(40) - 0.42, 0.9)
# S6
typing(ws(41), we(43), 11, 0.7)
add(sfx, impact(), DROP, 1.0)
add(sfx, chime(1046.5, 0.8), DROP + 0.12, 0.6)
# S7
add(sfx, whoosh(0.45, 400, 3000, 0.8), 19.6, 0.6)
typing(19.95, 20.32, 7, 0.6); typing(20.45, 20.92, 8, 0.6)
add(sfx, pop(1200), 20.78, 0.6); add(sfx, click(), 21.12, 0.8); add(sfx, tink(2349), ws(53) + 0.02, 0.6)
add(sfx, pop(1500), ws(54), 0.5)
for k in range(3): add(sfx, shutter(), ws(55) + k * 0.11, 0.8, -0.3 + k * 0.3)
add(sfx, click(), 22.66, 0.8); add(sfx, chime(1568, 0.45), 22.86, 0.7)
# S8
for k in range(6): add(sfx, whoosh(0.32, 900, 3500, 0.6), c9 + 0.12 + k * 0.07, 0.5, -0.6 if k % 2 == 0 else 0.6)
add(sfx, whoosh(0.8, 1500, 6000, 0.5), 24.25, 0.5)
for k in range(6): add(sfx, tink(1760 * 2 ** (k / 12 * 2)), 24.85 + k * 0.62 + 0.62, 0.45)
ticks(25.2, 26.6, 22, 3000, 0.3)
# S9
for i in (70, 71, 72): add(sfx, hit(), ws(i), 1.0)
# S10
add(sfx, whoosh(0.5, 400, 2500, 0.8), c11 + 0.25, 0.7)
typing(ws(77) - 0.02, we(80) - 0.12, 20, 0.75)
add(sfx, thump(140, 0.06), 33.08, 0.8); add(sfx, click(), 33.08, 0.6)
add(sfx, whoosh(0.4, 3000, 600, 0.6), 33.1, 0.6)
add(sfx, chime(1318.5, 0.6), ws(84), 0.75)
# S11
for k, (t0, f) in enumerate(zip([34.72, 35.08, 35.44, 35.8, we(96) - 0.05], [1046.5, 1174.7, 1318.5, 1396.9, 1568.0])): add(sfx, chime(f, 0.35), t0, 0.5)
add(sfx, pop(700), ws(92), 0.7)
# S12
ticks(c13 + 0.1, c13 + 0.6, 14, 2200, 0.3)
ticks(ws(101) - 0.05, ws(102) + 0.25, 10, 3200, 0.3)
add(sfx, thump(180, 0.05), ws(102) + 0.12, 0.8); add(sfx, pop(1400), ws(102) + 0.28, 0.6)
# S13
add(sfx, chime(880, 0.9), c14 + 0.05, 0.45); add(sfx, pop(1000), c14 + 0.45, 0.6)
typing(ws(110) - 0.02, we(114) - 0.1, 15, 0.55)
add(sfx, click(), 42.95, 0.9); add(sfx, impact() * 0.5, 43.0, 0.6); add(sfx, chime(1396.9, 0.9), 43.0, 0.55)

# ------------------------------------------------ mix
vo, vsr = sf.read('/home/claude/fmb/audio/vo_final.wav')
assert vsr == SR
if vo.ndim > 1: vo = vo.mean(1)
VO = np.zeros(N); VO[:min(N, len(vo))] = vo[:N]
# normalize stems
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
VO *= 10 ** ((-20 - rms_db(VO[VO != 0])) / 20)
music *= 10 ** ((-24 - rms_db(music[np.abs(music).sum(1) > 0])) / 20)
sfx_n = np.abs(sfx).sum(1) > 1e-6
sfx *= 10 ** ((-25 - rms_db(sfx[sfx_n])) / 20)
# sidechain duck music under VO
e = np.abs(VO); k = int(0.03 * SR)
e = np.convolve(e, np.ones(k) / k, mode='same'); e = e / (e.max() + 1e-9)
duck = 1 - 0.55 * np.clip(e * 6, 0, 1)
duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), mode='same')
music_d = music * duck[:, None]
mix = music_d + sfx + VO[:, None] * np.array([1, 1])
stem = sfx + VO[:, None]
for name, x in (('mix_raw', mix), ('stem_raw', stem), ('music_raw', music)):
    pk = np.abs(x).max(); x = x / pk * 0.89 if pk > 0.89 else x
    sf.write(f'/home/claude/fmb/audio/{name}.wav', x.astype(np.float32), SR)
print('DROP', round(DROP, 3), 'T0', round(T0, 3), 'STOP', round(STOP, 3))
