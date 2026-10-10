#!/usr/bin/env python3
"""Assemble one reel's voiceover from per-line segments and build the motion timeline.

usage: assemble_reel.py C2 --week weeks/2026-W42 --frames kit/storyboard/w42/out/C2/frames.json --out kit/remotion/public/tl
Inputs:  <week>/vo/jobs.json (lines per hook/body/cta), <week>/vo/seg/<id>.wav + .al.json (generated lines),
         <week>/scripts/<reel>.md (beat-sheet row times), storyboard frames.json (frame ids + beat-sheet times).
Outputs: <week>/vo/<reel>/{body,hookA,hookB,hookC}.wav + .words.json, and <out>/<reel>.json (beats per part).

Pacing: each voice is measured (words/s while speaking); narrators are nudged toward ~2.7 w/s with atempo (never slower,
at most 1.08x). Dialogue lines keep their natural speed. Gaps: 0.22 s within a speaker, 0.14 s at a speaker change.
"""
import argparse, json, os, re, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__))
from tts import words_from
from extract_vo import ROSTER

SR = 48000
HOUSE_WPS = 2.7
TRS = ["push", "zoom", "whipL", "focus", "whipU", "zoom"]

def load_seg(week, sid):
    p = f"{week}/vo/seg/{sid}"
    if not os.path.exists(p + ".wav"): return None
    y, sr = sf.read(p + ".wav"); assert sr == SR
    w = words_from(json.load(open(p + ".al.json")))
    if not w: return None
    a, b = max(0, w[0][1] - 0.03), min(len(y) / SR, w[-1][2] + 0.09)
    y = y[int(a * SR):int(b * SR)]
    return y, [[x, s - a, e - a] for x, s, e in w]

def wps(segs):
    n = sum(len(w) for _, w in segs); d = sum(len(y) / SR for y, _ in segs)
    return n / d if d else HOUSE_WPS

def atempo(y, f):
    if abs(f - 1) < 0.005: return y
    tmp = "/tmp/_at.wav"; sf.write(tmp, y, SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={f:.4f}", "-ar", str(SR), tmp + ".o.wav"], check=True)
    return sf.read(tmp + ".o.wav")[0]

def build(lines, segs, tempo, lead=0.12, tail=0.25):
    out, words, starts, t, prev = [np.zeros(int(lead * SR))], [], [], lead, None
    for ln, (y, w) in zip(lines, segs):
        if prev is not None:
            g = 0.22 if ln["speaker"] == prev else 0.14
            out.append(np.zeros(int(g * SR))); t += g
        f = tempo.get(ln["voice"], 1.0)
        y2 = atempo(y, f)
        starts.append(t)
        words += [[x, round(t + s / f, 3), round(t + e / f, 3), ln["speaker"]] for x, s, e in w]
        out.append(y2); t += len(y2) / SR; prev = ln["speaker"]
    out.append(np.zeros(int(tail * SR)))
    return np.concatenate(out), words, starts, t + tail

def beat_rows(md):
    t = open(md).read()
    sec = t.split("## 3. Beat sheet", 1)[1].split("## 4.", 1)[0]
    rows = []
    for m in re.finditer(r'^\| ([\d.]+)–([\d.]+) \| (.+?) \|', sec, re.M):
        n = len(re.findall(r'\*\*(Eric|Brian|Chris|Rita)(?: \([^)]*\))?:\*\*\s*"', m.group(3))) or (1 if '"' in m.group(3) else 0)
        rows.append((float(m.group(1)), n, "fuelmybuild.com" in m.group(3).lower()))
    return rows

def interp(x, xs, ys):
    if x <= xs[0]: return ys[0] + (x - xs[0])
    for i in range(len(xs) - 1):
        if xs[i] <= x <= xs[i + 1]:
            return ys[i] + (x - xs[i]) / (xs[i + 1] - xs[i]) * (ys[i + 1] - ys[i]) if xs[i + 1] > xs[i] else ys[i]
    return ys[-1] + (x - xs[-1])

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("reel"); ap.add_argument("--week", required=True)
    ap.add_argument("--frames", required=True); ap.add_argument("--out", required=True); ap.add_argument("--lead")
    ap.add_argument("--hero", default="")
    a = ap.parse_args(); R = a.reel; W = a.week
    jobs = json.load(open(f"{W}/vo/jobs.json"))[R]
    frames = json.load(open(a.frames))
    ex = {}
    # load segments
    def seglist(kind, lst):
        out = []
        for i, ln in enumerate(lst):
            sid = f"{R}.{kind}.{i:02d}" if kind == "body" else f"{R}.{kind}.{i}"
            s = load_seg(W, sid)
            if s is None: raise SystemExit(f"missing segment {sid}")
            out.append(s)
        return out
    body_segs = seglist("body", jobs["body"]); cta_segs = seglist("cta", jobs["cta"])
    hook_segs = {h: seglist("hook" + h, v) for h, v in jobs["hooks"].items()}
    # pacing per voice (narration only: voices with 4+ lines in this reel)
    allsegs = {}
    for ln, s in zip(jobs["body"] + jobs["cta"], body_segs + cta_segs): allsegs.setdefault(ln["voice"], []).append(s)
    tempo = {}
    for v, ss in allsegs.items():
        r = wps(ss); tempo[v] = min(1.08, max(1.0, HOUSE_WPS / r)) if len(ss) >= 4 else 1.0
    # body + cta
    blines = jobs["body"] + jobs["cta"]; bsegs = body_segs + cta_segs
    y, words, starts, dur = build(blines, bsegs, tempo, lead=0.10, tail=0.0)
    cta_start = starts[len(jobs["body"])] if jobs["cta"] else dur
    y = np.concatenate([y, np.zeros(int(1.3 * SR))]); dur += 1.3
    od = f"{W}/vo/{R}"; os.makedirs(od, exist_ok=True)
    sf.write(f"{od}/body.wav", y, SR); json.dump(words, open(f"{od}/body.words.json", "w"))
    # beat-sheet rows -> actual time
    rows = beat_rows(f"{W}/scripts/{R}.md")
    xs, ys, k = [], [], 0
    for t0, n, is_cta in rows:
        if is_cta: break
        if k < len(jobs["body"]): xs.append(t0); ys.append(starts[k])
        k += max(n, 1) if n else 0
    body0 = rows[0][0]
    lead_hook = a.lead
    hook_frames = [f for f in frames if f["t"] < body0 - 0.05]
    body_frames = [f for f in frames if f["t"] >= body0 - 0.05]
    end_frame = body_frames[-1]; body_frames = body_frames[:-1]
    beats = []
    for i, f in enumerate(body_frames):
        at = 0.0 if i == 0 else max(0.0, interp(f["t"], xs, ys) - 0.08)
        beats.append({"fid": f["id"], "a": round(at, 3)})
    beats.append({"fid": end_frame["id"], "a": round(cta_start - 0.12, 3)})
    # enforce order and a minimum beat length
    for i in range(1, len(beats)):
        beats[i]["a"] = max(beats[i]["a"], beats[i - 1]["a"] + 0.9)
    for i, b in enumerate(beats):
        b["b"] = beats[i + 1]["a"] if i + 1 < len(beats) else dur
        b["out"] = TRS[i % len(TRS)]; b["L"] = 0.34
    parts = {"body": {"dur": round(dur, 3), "beats": beats}}
    # hooks
    for h, segs in hook_segs.items():
        hy, hw, hs, hd = build(jobs["hooks"][h], segs, {}, lead=0.12, tail=0.32)
        sf.write(f"{od}/hook{h}.wav", hy, SR); json.dump(hw, open(f"{od}/hook{h}.words.json", "w"))
        if h == lead_hook and hook_frames:
            span = body0; hb = []
            for i, f in enumerate(hook_frames):
                at = 0.0 if i == 0 else f["t"] / span * hd
                hb.append({"fid": f["id"], "a": round(at, 3)})
            for i, b in enumerate(hb):
                b["b"] = hb[i + 1]["a"] if i + 1 < len(hb) else hd; b["out"] = "zoom"; b["L"] = 0.3
        else:
            line = re.sub(r'^\w+(?: \([^)]*\))?:\s*', '', " ".join(l["text"] for l in jobs["hooks"][h]))
            line = re.sub(r'<break[^>]*/>', '', line).replace('"', '').strip()
            disp = [w for w in line.split() if w]
            ws = [round(x[1] - 0.04, 3) for x in hw]
            hb = [{"hook": line, "hero": a.hero, "words": ws[:len(disp)], "a": 0.0, "b": round(hd, 3)}]
        parts["hook" + h] = {"dur": round(hd, 3), "beats": hb}
    os.makedirs(a.out, exist_ok=True)
    json.dump({"reel": R, "tempo": tempo, "parts": parts}, open(f"{a.out}/{R}.json", "w"), indent=1)
    print(R, {k: v["dur"] for k, v in parts.items()}, "tempo", {ROSTER_INV.get(k, k): round(v, 3) for k, v in tempo.items()}, "beats", len(beats))

ROSTER_INV = {"cjVigY5qzO86Huf0OWal": "Eric", "nPczCjzI2devNBz1zQrb": "Brian", "iP95p4xoKVk53GoZ742B": "Chris", "DtQLDxHbTiQTpVVanTy1": "Justin", "Dg1lUQiSAGVHkoQMG3QX": "Jerry", "9HBoEQ8LqyvVZFYDodnr": "Emma", "EXAVITQu4vr4xnSDxMaL": "Sarah"}

if __name__ == "__main__":
    main()
