#!/usr/bin/env python3
"""Slot a week of concepts and hook versions so the feed never repeats itself.

input  brief JSON: [{"id":"C1","audience":"collectors","format":"mini-story","hooks":["A","B","C"], "title":"..."}]
output queue JSON + a markdown calendar.

Rules
- Feed (main release, hook A): 2 slots a day at 12:00 and 19:00 ET. Same file goes to IG feed, TikTok and YouTube Shorts.
- Consecutive feed posts never share an audience, and never share a format if it can be avoided.
- Combined ("everyone") pieces land mid-week and at the weekend.
- Hook B goes out 2-3 days after A (IG Trial Reel + YouTube Shorts). Hook C goes out 2-3 days after B (IG Trial Reel + TikTok).
  Variants that fall past Sunday roll into next week's queue.
- At most 2 variant posts per platform per day, and never a variant of the same concept on the same day as another post of it.
usage: schedule.py brief.json --start 2026-10-12 --out weeks/2026-W42/
"""
import argparse, json, datetime as dt, os

SLOTS = ["12:00", "19:00"]          # ET
VAR_SLOTS = ["15:00", "21:30"]      # ET, variants sit between feed posts

def order_feed(items, pinned_first=None):
    pool = items[:]
    seq = []
    if pinned_first:
        p = next(i for i in pool if i["id"] == pinned_first); seq.append(p); pool.remove(p)
    n_total = len(items)
    while pool:
        last = seq[-1] if seq else None
        pos = len(seq)
        def cost(it):
            c = 0
            if last and it["audience"] == last["audience"]: c += 100
            if last and it.get("format") == last.get("format"): c += 20
            if len(seq) >= 2 and it["audience"] == seq[-2]["audience"]: c += 8
            if it["audience"] == "everyone":     # prefer middle and end of week
                target = [n_total // 2, n_total - 1]
                c += min(abs(pos - t) for t in target) * 3
            # spread audiences: prefer the audience least used so far
            c += sum(1 for s in seq if s["audience"] == it["audience"]) * 2
            return c
        nxt = min(pool, key=cost); seq.append(nxt); pool.remove(nxt)
    return seq

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("brief"); ap.add_argument("--start", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--first", help="concept id to open the week")
    a = ap.parse_args()
    items = json.load(open(a.brief))
    start = dt.date.fromisoformat(a.start)
    feed = order_feed(items, a.first)
    queue = []
    day_of = {}
    for k, it in enumerate(feed):
        d = start + dt.timedelta(days=k // 2); t = SLOTS[k % 2]
        day_of[it["id"]] = d
        for p in ("instagram", "tiktok", "youtube"):
            queue.append({"concept": it["id"], "hook": it["hooks"][0], "date": d.isoformat(), "time_et": t, "platform": p,
                          "placement": "feed" if p == "instagram" else "post", "status": "draft"})
    # variants
    load = {}
    def free(d, plat):
        return load.get((d, plat), 0) < 2
    for it in feed:
        hooks = it["hooks"]; d0 = day_of[it["id"]]
        plan = [(1, [("instagram", "trial_reel"), ("youtube", "post")], 2), (2, [("instagram", "trial_reel"), ("tiktok", "post")], 2)]
        prev = d0
        for hi, plats, gap in plan:
            if hi >= len(hooks): break
            d = prev + dt.timedelta(days=gap)
            while not all(free(d, p) for p, _ in plats) or d == day_of[it["id"]]:
                d += dt.timedelta(days=1)
            slot = max(load.get((d, p), 0) for p, _ in plats)   # one variant = one time slot on every platform
            for j, (p, place) in enumerate(plats):
                load[(d, p)] = slot + 1
                queue.append({"concept": it["id"], "hook": hooks[hi], "date": d.isoformat(), "time_et": VAR_SLOTS[slot],
                              "platform": p, "placement": place, "status": "draft"})
            prev = d
    queue.sort(key=lambda q: (q["date"], q["time_et"], q["platform"]))
    os.makedirs(a.out, exist_ok=True)
    json.dump(queue, open(os.path.join(a.out, "queue.json"), "w"), indent=1)
    names = {i["id"]: i.get("title", i["id"]) for i in items}
    aud = {i["id"]: i["audience"] for i in items}
    lines = ["| Date | Time ET | Concept | Hook | Audience | Where |", "|---|---|---|---|---|---|"]
    grouped = {}
    for q in queue:
        grouped.setdefault((q["date"], q["time_et"], q["concept"], q["hook"]), []).append(q["platform"] + ("" if q["placement"] in ("feed", "post") else " trial"))
    for (d, t, c, h), plats in sorted(grouped.items()):
        wd = dt.date.fromisoformat(d).strftime("%a %b %d")
        lines.append(f"| {wd} | {t} | {c} {names[c]} | {h} | {aud[c]} | {', '.join(plats)} |")
    open(os.path.join(a.out, "calendar.md"), "w").write("\n".join(lines) + "\n")
    print("\n".join(lines))

if __name__ == "__main__":
    main()
