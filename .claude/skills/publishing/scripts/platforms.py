#!/usr/bin/env python3
"""Free official APIs for Instagram, YouTube and TikTok. Standard library only.

Credentials come from environment variables (store them as API credentials on the cloud
environment, never in the repo):
  IG_USER_ID, IG_ACCESS_TOKEN                 (long-lived token, Instagram Graph API via the linked Facebook Page)
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
  TT_CLIENT_KEY, TT_CLIENT_SECRET, TT_REFRESH_TOKEN
Allowed domains needed on the environment:
  graph.facebook.com, rupload.facebook.com, oauth2.googleapis.com, www.googleapis.com,
  youtube.googleapis.com, youtubeanalytics.googleapis.com, open.tiktokapis.com

usage:
  platforms.py ig-prepare  video.mp4 caption.txt [--trial]      -> prints container id (uploaded, NOT published)
  platforms.py ig-publish  CONTAINER_ID                          -> publishes (only after Wayne's live yes)
  platforms.py yt-schedule video.mp4 title.txt desc.txt 2026-10-12T16:00:00Z   -> private upload that auto-publishes
  platforms.py tt-draft    video.mp4                             -> sends to Wayne's TikTok inbox as a draft
"""
import json, os, sys, time, urllib.request, urllib.parse, urllib.error

GV = "v21.0"

def http(method, url, data=None, headers=None, raw=False):
    h = dict(headers or {})
    if data is not None and not isinstance(data, (bytes, bytearray)):
        if h.get("Content-Type") == "application/json":
            data = json.dumps(data).encode()
        else:
            data = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            body = r.read()
            if raw: return r, body
            return json.loads(body or b"{}")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{method} {url.split('?')[0]} -> {e.code}: {e.read().decode()[:400]}")

# ---------------- Instagram (Graph API, Reels) ----------------
def ig_prepare(video, caption, trial=False):
    uid, tok = os.environ["IG_USER_ID"], os.environ["IG_ACCESS_TOKEN"]
    params = {"media_type": "REELS", "upload_type": "resumable", "caption": caption, "share_to_feed": "true", "access_token": tok}
    if trial:  # Trial Reels: shown to non-followers first; graduate manually after reviewing results
        params["trial_params"] = json.dumps({"graduation_strategy": "MANUAL"})
    c = http("POST", f"https://graph.facebook.com/{GV}/{uid}/media", params)
    cid = c["id"]
    size = os.path.getsize(video)
    http("POST", f"https://rupload.facebook.com/ig-api-upload/{GV}/{cid}", open(video, "rb").read(),
         {"Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(size)})
    for _ in range(60):
        s = http("GET", f"https://graph.facebook.com/{GV}/{cid}?fields=status_code,status&access_token={tok}")
        if s.get("status_code") == "FINISHED": return cid
        if s.get("status_code") == "ERROR": raise SystemExit(f"IG processing error: {s}")
        time.sleep(10)
    raise SystemExit("IG container not ready after 10 minutes")

def ig_publish(cid):
    uid, tok = os.environ["IG_USER_ID"], os.environ["IG_ACCESS_TOKEN"]
    r = http("POST", f"https://graph.facebook.com/{GV}/{uid}/media_publish", {"creation_id": cid, "access_token": tok})
    return r["id"]

def ig_media(limit=50):
    uid, tok = os.environ["IG_USER_ID"], os.environ["IG_ACCESS_TOKEN"]
    return http("GET", f"https://graph.facebook.com/{GV}/{uid}/media?fields=id,caption,timestamp,media_product_type,permalink&limit={limit}&access_token={tok}")["data"]

def ig_insights(mid):
    tok = os.environ["IG_ACCESS_TOKEN"]
    m = "views,reach,saved,shares,comments,likes,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time"
    d = http("GET", f"https://graph.facebook.com/{GV}/{mid}/insights?metric={m}&access_token={tok}")["data"]
    return {x["name"]: x["values"][0]["value"] for x in d}

# ---------------- YouTube (Data API + Analytics API) ----------------
def yt_token():
    r = http("POST", "https://oauth2.googleapis.com/token", {"client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
             "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"})
    return r["access_token"]

def yt_schedule(video, title, desc, publish_at):
    tok = yt_token()
    meta = {"snippet": {"title": title[:100], "description": desc, "categoryId": "2"},
            "status": {"privacyStatus": "private", "publishAt": publish_at, "selfDeclaredMadeForKids": False}}
    r, _ = http("POST", "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", meta,
                {"Authorization": f"Bearer {tok}", "Content-Type": "application/json", "X-Upload-Content-Type": "video/mp4"}, raw=True)
    loc = r.headers["Location"]
    v = http("PUT", loc, open(video, "rb").read(), {"Authorization": f"Bearer {tok}", "Content-Type": "video/mp4"})
    return v["id"]

def yt_stats(video_ids, start, end):
    tok = yt_token(); H = {"Authorization": f"Bearer {tok}"}
    q = urllib.parse.urlencode({"ids": "channel==MINE", "startDate": start, "endDate": end, "dimensions": "video",
        "metrics": "views,averageViewDuration,averageViewPercentage,likes,shares,subscribersGained", "filters": "video==" + ",".join(video_ids)})
    totals = http("GET", "https://youtubeanalytics.googleapis.com/v2/reports?" + q, headers=H)
    curves = {}
    for vid in video_ids:   # retention curve: share of viewers still watching at each 1% of the video
        q = urllib.parse.urlencode({"ids": "channel==MINE", "startDate": start, "endDate": end, "dimensions": "elapsedVideoTimeRatio",
            "metrics": "audienceWatchRatio,relativeRetentionPerformance", "filters": f"video=={vid}"})
        curves[vid] = http("GET", "https://youtubeanalytics.googleapis.com/v2/reports?" + q, headers=H).get("rows", [])
    return totals, curves

# ---------------- TikTok (Content Posting API, inbox draft) ----------------
def tt_token():
    r = http("POST", "https://open.tiktokapis.com/v2/oauth/token/", {"client_key": os.environ["TT_CLIENT_KEY"], "client_secret": os.environ["TT_CLIENT_SECRET"],
             "grant_type": "refresh_token", "refresh_token": os.environ["TT_REFRESH_TOKEN"]})
    return r["access_token"]

def tt_draft(video):
    tok = tt_token(); size = os.path.getsize(video)
    r = http("POST", "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
             {"source_info": {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": size, "total_chunk_count": 1}},
             {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    url = r["data"]["upload_url"]
    http("PUT", url, open(video, "rb").read(), {"Content-Type": "video/mp4", "Content-Range": f"bytes 0-{size-1}/{size}"}, raw=True)
    return r["data"]["publish_id"]

def tt_stats(video_ids):
    tok = tt_token()
    r = http("POST", "https://open.tiktokapis.com/v2/video/query/?fields=id,title,create_time,view_count,like_count,comment_count,share_count",
             {"filters": {"video_ids": video_ids}}, {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    return r.get("data", {}).get("videos", [])

if __name__ == "__main__":
    cmd, *a = sys.argv[1:] or ["-h"]
    if cmd == "ig-prepare": print(ig_prepare(a[0], open(a[1]).read(), "--trial" in a))
    elif cmd == "ig-publish": print(ig_publish(a[0]))
    elif cmd == "yt-schedule": print(yt_schedule(a[0], open(a[1]).read().strip(), open(a[2]).read(), a[3]))
    elif cmd == "tt-draft": print(tt_draft(a[0]))
    else: print(__doc__)
