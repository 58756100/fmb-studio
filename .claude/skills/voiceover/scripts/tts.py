#!/usr/bin/env python3
"""ElevenLabs TTS with key rotation, timestamps, pause tightening and two-voice dialogue.

usage:
  tts.py --voice VOICE_ID --text-file line.txt --out out/vo          # single voice
  tts.py --dialogue dialogue.json --out out/vo                        # [{"voice": id, "text": "...", "gap": 0.18}, ...]
  options: --speed 1.0 --stability 0.5 --style 0.15 --tighten --tempo 1.0
writes out/vo.wav and out/vo.words.json ([[word, start, end], ...])
"""
import argparse, base64, json, os, subprocess, sys, urllib.request, urllib.error, tempfile
import numpy as np, soundfile as sf

API = "https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps?output_format=mp3_44100_128"
ROTATE = {401, 402, 403, 429}

def keys():
    ks = [k.strip() for k in os.environ.get("ELEVENLABS_API_KEYS", "").split(",") if k.strip()]
    f = os.path.join(os.path.dirname(__file__), "..", "..", "..", "secrets", "elevenlabs_keys.txt")
    for p in (f, "secrets/elevenlabs_keys.txt"):
        if os.path.exists(p):
            ks += [l.strip() for l in open(p) if l.strip() and not l.startswith("#")]
    seen = []
    [seen.append(k) for k in ks if k not in seen]
    return seen

def synth(vid, text, a):
    body = json.dumps({"text": text, "model_id": a.model,
        "voice_settings": {"stability": a.stability, "similarity_boost": 0.8, "style": a.style, "use_speaker_boost": True, "speed": a.speed}}).encode()
    errs = []
    for i, k in enumerate(keys()):
        req = urllib.request.Request(API.format(vid=vid), data=body, headers={"xi-api-key": k, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:200]
            errs.append(f"key#{i+1}: {e.code} {msg}")
            if e.code in ROTATE or "quota" in msg.lower():
                continue
            raise SystemExit("ElevenLabs error: " + errs[-1])
    raise SystemExit("ALL_KEYS_FAILED\n" + "\n".join(errs) + "\nAsk Wayne for a new ElevenLabs key.")

def words_from(al, offset=0.0):
    ch, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    out, cur, cs, ce, tag = [], "", 0, 0, False
    for c, s, e in zip(ch, st, en):
        if c == "<": tag = True
        if tag:
            if c == ">": tag = False
            if cur: out.append([cur, cs + offset, ce + offset]); cur = ""
            continue
        if c.isspace():
            if cur: out.append([cur, cs + offset, ce + offset]); cur = ""
            continue
        if not cur: cs = s
        cur += c; ce = e
    if cur: out.append([cur, cs + offset, ce + offset])
    return out

def decode(b64):
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(base64.b64decode(b64)); mp3 = f.name
    wav = mp3[:-4] + ".wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-ac", "1", "-ar", "48000", wav], check=True)
    y, sr = sf.read(wav); return y, sr

def tighten(y, sr, words, lead=0.12):
    """Shorten long pauses without touching speech. A pause is only cut inside audio that is
    actually silent (frame RMS well below the speech level), with 60 ms of untouched room kept
    after the last word and before the next one, and every splice crossfaded over 12 ms.
    ElevenLabs word times can be early or late by 50-100 ms, so the timings alone are never
    trusted to decide where speech is (v1 cut by timings only and clipped word onsets)."""
    hop = int(0.01 * sr)
    n = len(y) // hop
    rms = np.sqrt(np.mean(y[:n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12) if n else np.zeros(0)
    speech = np.percentile(rms[rms > 0], 90) if n else 1.0
    quiet = rms < speech * 10 ** (-38 / 20)          # 38 dB under loud speech counts as silence
    keep_after, keep_before, xf = 0.06, 0.06, 0.012
    cuts = []
    for i in range(len(words) - 1):
        w, s, e = words[i]; gap = words[i + 1][1] - e
        t = 0.30 if w[-1:] in ".?!:" or w.endswith('"') else (min(gap, 0.18) if w.endswith(",") else gap)
        if gap <= t + 0.04:
            continue
        # longest silent run between the two words, measured on the audio itself
        f0, f1 = int(max(e - 0.05, 0) / 0.01), int(min(words[i + 1][1] + 0.05, len(y) / sr) / 0.01)
        best, run = (0, 0), None
        for f in range(f0, min(f1, n)):
            if quiet[f]:
                run = f if run is None else run
                if f - run + 1 > best[1] - best[0]:
                    best = (run, f + 1)
            else:
                run = None
        sil0, sil1 = best[0] * 0.01 + keep_after, best[1] * 0.01 - keep_before
        remove = min(gap - t, sil1 - sil0)
        if remove > 0.04:
            mid = (sil0 + sil1) / 2
            cuts.append((mid - remove / 2, mid + remove / 2))
    parts, last = [], 0.0
    fx = int(xf * sr)
    ramp = np.linspace(0, 1, fx) if fx else np.zeros(0)
    for a, b in cuts:
        seg = y[int(last * sr):int(a * sr)].copy()
        if fx and len(seg) > fx:
            seg[-fx:] *= ramp[::-1]
        if parts and fx and len(seg) > fx:
            seg[:fx] *= ramp
        parts.append(seg); last = b
    tail = y[int(last * sr):].copy()
    if parts and fx and len(tail) > fx:
        tail[:fx] *= ramp
    parts.append(tail)
    out = np.concatenate([np.zeros(int(lead * sr))] + parts)
    def rm(t):
        d = sum((b - a) if t >= b else max(0, t - a) for a, b in cuts)
        return round(t - d + lead, 3)
    return out, [[w, rm(s), rm(e)] for w, s, e in words]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice"); ap.add_argument("--text-file"); ap.add_argument("--dialogue"); ap.add_argument("--out", required=True)
    ap.add_argument("--model", default=os.environ.get("ELEVENLABS_MODEL", "eleven_v4"))
    ap.add_argument("--speed", type=float, default=1.0); ap.add_argument("--stability", type=float, default=0.5); ap.add_argument("--style", type=float, default=0.15)
    ap.add_argument("--tighten", action="store_true"); ap.add_argument("--tempo", type=float, default=1.0)
    a = ap.parse_args()
    if not keys(): raise SystemExit("No ElevenLabs keys. Set ELEVENLABS_API_KEYS or secrets/elevenlabs_keys.txt")
    lines = json.load(open(a.dialogue)) if a.dialogue else [{"voice": a.voice, "text": open(a.text_file).read().strip(), "gap": 0}]
    audio, words, t, sr = [], [], 0.0, 48000
    for ln in lines:
        r = synth(ln["voice"], ln["text"], a)
        y, sr = decode(r["audio_base64"])
        w = words_from(r["alignment"])
        os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
        sf.write(f"{a.out}.take{len(audio)//2}.wav", y, sr)
        json.dump(w, open(f"{a.out}.take{len(audio)//2}.words.json", "w"))
        if a.tighten: y, w = tighten(y, sr, w, lead=0.0)
        g = ln.get("gap", 0.18) if audio else 0.12
        audio += [np.zeros(int(g * sr)), y]; t += g
        words += [[x, s + t, e + t, ln["voice"]] for x, s, e in w]; t += len(y) / sr
    y = np.concatenate(audio)
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    sf.write(a.out + ".raw.wav", y, sr)
    if abs(a.tempo - 1) > 1e-3:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.out + ".raw.wav", "-af", f"atempo={a.tempo}", a.out + ".wav"], check=True)
        words = [[w, round(s / a.tempo, 3), round(e / a.tempo, 3), *rest] for w, s, e, *rest in words]
    else:
        os.replace(a.out + ".raw.wav", a.out + ".wav")
    json.dump(words, open(a.out + ".words.json", "w"))
    print(f"ok {a.out}.wav {len(y)/sr/a.tempo:.2f}s {len(words)} words")

if __name__ == "__main__":
    main()
