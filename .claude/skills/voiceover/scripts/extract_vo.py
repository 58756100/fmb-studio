#!/usr/bin/env python3
"""Pull every voice line out of a studio script (.md) into segments for TTS.

usage: extract_vo.py weeks/2026-W42/scripts/*.md --out weeks/2026-W42/vo/jobs.json
Each script -> {"hooks": {"A": [seg..]}, "body": [seg..], "cta": [seg..]}, seg = {"speaker","voice","text"}.
"""
import argparse, json, re, collections, os
ROSTER = {"Eric": "cjVigY5qzO86Huf0OWal", "Brian": "nPczCjzI2devNBz1zQrb", "Chris": "iP95p4xoKVk53GoZ742B",
          "Rita": "EXAVITQu4vr4xnSDxMaL"}  # Rita: ElevenLabs premade "Sarah" until Wayne casts a new female voice
SPK = re.compile(r'\*\*(Eric|Brian|Chris|Rita)(?: \([^)]*\))?:\*\*\s*"(.*?)"(?=\s*(?:\*\*|\||$|\n|On screen))', re.S)

def clean(t):
    t = t.replace("`", "")
    t = re.sub(r'(?<![<\w])\*([^*]+)\*', r'\1', t)          # italics = emphasis direction only
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def segs(cell, default):
    out = [{"speaker": m.group(1), "text": clean(m.group(2))} for m in SPK.finditer(cell)]
    if not out:
        q = re.findall(r'"(.*?)"', cell.replace('time="', "time='").replace('s" />', "s' />"))
        q = [x.replace("time='", 'time="').replace("s' />", 's" />') for x in q]
        if q: out = [{"speaker": default, "text": clean(" ".join(q))}]
    for s in out: s["voice"] = ROSTER[s["speaker"]]
    return out

def parse(md):
    t = open(md).read()
    names = collections.Counter(re.findall(r'\*\*(Eric|Brian|Chris|Rita)[^*]*:\*\*', t))
    narr = names.most_common(1)[0][0]
    hooks = {}
    hsec = t.split("## 2. Hooks", 1)[1].split("## 3.", 1)[0]
    for m in re.finditer(r'^\| ([ABC]) \| [^|]+ \| ([^|]+) \|', hsec, re.M):
        hooks[m.group(1)] = segs(m.group(2), narr)
    for m in re.finditer(r'### Hook ([ABC])[^\n]*\n- \*\*Voice(?: \((\w+)\))?:\*\*\s*(.+)', hsec):
        hooks[m.group(1)] = segs(f'**{m.group(2) or narr}:** {m.group(3)}', narr)
    body = []
    bsec = t.split("## 3. Beat sheet", 1)[1].split("## 4.", 1)[0]
    for row in re.findall(r'^\| [\d.]+–[\d.]+ \| (.+?) \|', bsec, re.M):
        body += segs(row, narr)
    csec = re.split(r'## 5\. CTA[^\n]*\n', t)[1].split("## 6.", 1)[0]
    first = csec.strip().splitlines()[0]
    cta = segs(first, narr)
    return {"narrator": narr, "hooks": hooks, "body": body, "cta": cta}

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("scripts", nargs="+"); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    jobs = {os.path.basename(p)[:-3]: parse(p) for p in sorted(a.scripts)}
    json.dump(jobs, open(a.out, "w"), indent=1, ensure_ascii=False)
    for k, j in jobs.items():
        print(k, j["narrator"], {h: len(v) for h, v in j["hooks"].items()}, "body", len(j["body"]), "cta", len(j["cta"]),
              "chars", sum(len(s["text"]) for v in [*j["hooks"].values(), j["body"], j["cta"]] for s in v))
