#!/usr/bin/env python3
"""Pull last week's numbers for every posted item in state/queue.json and write state/metrics/<week>.json.

usage: fetch_metrics.py --queue state/queue.json --week 2026-W42 --out state/metrics/
Then the analyst agent reads the JSON and updates state/learnings.md.
"""
import argparse, json, os, sys, datetime as dt
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "publishing", "scripts"))
import platforms as P

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--queue", required=True); ap.add_argument("--week", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    q = []
    for x in json.load(open(a.queue)):
        # the publisher stores IG ids as media_id and YouTube ids as video_id; accept any of them
        pid = x.get("post_id") or x.get("media_id") or x.get("video_id")
        if x.get("status") == "posted" and pid:
            q.append({**x, "post_id": pid})
    end = dt.date.today(); start = end - dt.timedelta(days=14)
    out = {"week": a.week, "pulled": dt.datetime.utcnow().isoformat() + "Z", "items": []}
    yt_ids = [x["post_id"] for x in q if x["platform"] == "youtube"]
    tt_ids = [x["post_id"] for x in q if x["platform"] == "tiktok"]
    yt_tot, yt_curves = (P.yt_stats(yt_ids, start.isoformat(), end.isoformat()) if yt_ids else ({}, {}))
    yt_rows = {r[0]: r[1:] for r in yt_tot.get("rows", [])} if yt_tot else {}
    tt = {v["id"]: v for v in (P.tt_stats(tt_ids) if tt_ids else [])}
    for x in q:
        m = {}
        try:
            if x["platform"] == "instagram": m = P.ig_insights(x["post_id"])
            elif x["platform"] == "youtube":
                r = yt_rows.get(x["post_id"])
                if r: m = dict(zip(["views", "avg_view_s", "avg_view_pct", "likes", "shares", "subs"], r))
                # find the steepest drop in the retention curve (seconds into the video)
                c = yt_curves.get(x["post_id"], [])
                if len(c) > 3 and x.get("duration_s"):
                    drops = [(c[i][1] - c[i + 1][1], c[i][0]) for i in range(len(c) - 1)]
                    d, at = max(drops); m["steepest_drop_at_s"] = round(at * x["duration_s"], 1); m["steepest_drop"] = round(d, 3)
                    m["retention_curve"] = [[round(r0 * x["duration_s"], 1), round(r1, 3)] for r0, r1, *_ in c]
            elif x["platform"] == "tiktok": m = tt.get(x["post_id"], {})
        except SystemExit as e:
            m = {"error": str(e)}
        out["items"].append({**{k: x[k] for k in ("concept", "hook", "platform", "placement", "date", "post_id")}, "metrics": m})
    os.makedirs(a.out, exist_ok=True)
    json.dump(out, open(os.path.join(a.out, f"{a.week}.json"), "w"), indent=1)
    print(f"wrote {len(out['items'])} items")

if __name__ == "__main__":
    main()
