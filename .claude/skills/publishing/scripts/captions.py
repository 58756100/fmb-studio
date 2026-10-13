#!/usr/bin/env python3
"""Pull the posting captions for one concept out of its script file.

usage:
  captions.py weeks/<week>/scripts/<concept>.md          -> JSON with ig_tiktok, youtube_title, youtube_description, pinned_comment
  captions.py weeks/<week>/scripts/<concept>.md --field ig_tiktok   -> just that text (ready to paste or pass to platforms.py)

Reads the "## 6. Captions" section. Handles both script styles used so far:
  - **IG / TikTok:** "line" (93 chars)            +  next line "  #tag #tag"
  - **IG/TikTok first line (93 chars):** line      +  "  - Hashtags: #tag #tag"
Exits 2 with a message if the file or a field is missing, so a run never posts with an empty caption.
"""
import json, re, sys

def section(text):
    m = re.search(r"^## *\d*\.? *Captions\s*$(.*?)(?=^## |\Z)", text, re.M | re.S | re.I)
    return m.group(1) if m else ""

def clean(s):
    s = s.strip()
    s = re.sub(r"\s*\(\d+ chars\)\s*$", "", s)
    if len(s) >= 2 and s[0] == s[-1] == '"':
        s = s[1:-1]
    return s.strip()

def field(lines, pattern):
    for i, line in enumerate(lines):
        m = re.match(r"\s*-\s*\*\*(.+?)\*\*\s*(.*)$", line)
        if m and re.search(pattern, m.group(1), re.I):
            return i, clean(m.group(2))
    return None, ""

def parse(path):
    lines = section(open(path, encoding="utf-8").read()).splitlines()
    out = {}
    i, first = field(lines, r"IG\s*/\s*TikTok")
    tags = ""
    if i is not None:
        for nxt in lines[i + 1:i + 3]:
            t = re.sub(r"^\s*-?\s*(Hashtags:)?\s*", "", nxt, flags=re.I).strip()
            if t.startswith("#"):
                tags = t
                break
    out["ig_tiktok"] = (first + ("\n\n" + tags if tags else "")).strip()
    out["youtube_title"] = field(lines, r"YouTube.*title")[1]
    out["youtube_description"] = field(lines, r"YouTube.*description")[1]
    out["pinned_comment"] = field(lines, r"Pinned comment")[1]
    return out

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    try:
        caps = parse(sys.argv[1])
    except FileNotFoundError:
        print(f"MISSING_SCRIPT {sys.argv[1]}", file=sys.stderr); sys.exit(2)
    if "--field" in sys.argv:
        key = sys.argv[sys.argv.index("--field") + 1]
        if not caps.get(key):
            print(f"MISSING_FIELD {key} in {sys.argv[1]}", file=sys.stderr); sys.exit(2)
        print(caps[key])
    else:
        missing = [k for k in ("ig_tiktok", "youtube_title", "youtube_description") if not caps[k]]
        print(json.dumps(caps, indent=1, ensure_ascii=False))
        if missing:
            print("MISSING_FIELD " + ",".join(missing), file=sys.stderr); sys.exit(2)
