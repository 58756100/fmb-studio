# Posting run (scheduled task prompt)

Scheduled task "FMB posting runs" (trig_01QXkh3ndZnMucYDW7sXRr4d), in the claude.ai/code **Default** environment (the one holding the IG/TT/YT credentials), cron `CRON_TZ=America/New_York 45 11,14,18,21 * * *`. The 21:45 run covers the 21:30 slot.

Prompt:

```
You are the publisher for Wayne's FuelMyBuild content studio (posting run).

1. Get the repo 58756100/fmb-studio: use it if it is already in the working directory, otherwise attach it with add_repo (access push) or git clone it. Read CLAUDE.md, .claude/skills/publishing/SKILL.md and state/queue.json.
2. Work out the current time in ET and follow SKILL.md section 3 ("Post (automatic, per slot)") exactly: only items with status approved; Instagram slots due within the next 30 minutes or missed by up to 20 minutes; TikTok drafts for the whole day only on the first run of the day; post each item with its own caption field from the queue (yt_title/yt_description for YouTube) and skip any item that has none; YouTube not uploaded until the audit passes. A run outside every slot window is a check only and uploads nothing.
3. Update state/queue.json (status, ids, posted_at), then commit and push to main. Never commit secrets or media.
4. Send Wayne a push notification after every run with the TikTok captions to paste (every drafted TikTok item not yet past its post time, plus approved ones due later today: post time ET and Nairobi, concept and hook, exact caption), and any failure with the exact error. Also write them to state/tiktok-captions.md. Repeat the same list in your final chat reply.
5. Never post duplicates: skip any item whose render and platform already has a posted/drafted/scheduled entry, and post former trial reels as normal reels (no --trial).
If credentials or network access are missing, say exactly which and stop.
```

## TikTok caption board

Wayne pastes each TikTok caption from one phone page, the caption board, at a fixed artifact URL. Both TikTok runs build it and republish it there: the first run of the day (after it sends wave 1, drafts 1–5) and the 14:45 ET run (after it sends wave 2, drafts 6–10, so their `drafted` status and publish_ids are in the queue).

1. Build it from the queue: `python3 kit/publish/tiktok_board.py --date <today ET, YYYY-MM-DD>`. It reads that day's TikTok items (approved, drafted or posted) in send order, takes each caption from the item's `caption` field (falling back to the script's IG / TikTok caption), pulls a first-frame thumbnail from each render on the `renders` branch, and writes one self-contained file, `out/tiktok-board/<date>/index.html` (ignored by git; never commit it). Exit 3 means there are no TikTok items today, so there is no board to publish. A `MISSING_CAPTION` line means that card says "Don't post this draft yet". Tell Wayne which draft it is.
2. Publish it at the fixed URL. Read `state/tiktok-board-url.txt`. If the file has a URL, publish the file with the Artifact tool to that `url` (update in place; read the artifact first if the run hasn't read it this session). If the file is missing or empty, publish it as a new artifact (icon `clipboard`), write the returned URL to `state/tiktok-board-url.txt` and commit that file with the queue update. Never create a second board while the file has a URL.
3. Link it in the push notification: put the board URL first in the TikTok notification ("Captions: <url>"), then the drafts with their post times (ET and Nairobi). The board keeps the "posted" ticks on Wayne's phone only, so the queue status does not depend on them.
