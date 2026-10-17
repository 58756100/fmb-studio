#!/usr/bin/env python3
# python3 -I beats.py <id> -> comma list of storyboard times (s): one per spoken sentence, just after its last word lands
import json, sys
w = json.load(open(f"src/vo/{sys.argv[1]}/words.json"))
ts, last = [], -9
for i, x in enumerate(w):
    word, s, e = x[0], x[1], x[2]
    nxt = w[i + 1][1] if i + 1 < len(w) else e + 0.6
    if word[-1] in ".?:!" or i == len(w) - 1:
        t = min(e + 0.15, (e + nxt) / 2)
        if t - last > 1.2: ts.append(round(t, 2)); last = t
ts.append(round(w[-1][2] + 0.8, 2))
print(",".join(map(str, ts)))
