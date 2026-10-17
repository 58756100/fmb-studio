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

## TikTok captions in the chat (Wayne, 2026-10-17)

Wayne copies TikTok captions straight from the run's chat reply and the push notification. He doesn't want to open links. After every run that sent or still has TikTok drafts for today:

1. Run `python3 kit/publish/tiktok_board.py --date <today ET, YYYY-MM-DD> --md`. It prints one block per draft in send order:
   - wave, draft number and post time (ET and Nairobi)
   - `Video: <id>, "<title>": <one-line description of what the video shows>`
   - `Opens with: "<hook line>"`
   - the caption and hashtags in their own code block, so the copy button copies exactly that text

   Give the queue item a `video_desc` field to override the description. A draft with no caption is marked "Don't post this draft".
2. Paste that output, unchanged, as the main body of the run's final chat reply. Write the same text to `state/tiktok-captions.md` and commit it with the queue update.
3. Send the push notification with the same list. If the push fails validation (too long), send one push per wave (drafts 1–5, then 6–10). If it still fails, send one push per draft: time, video id and title, and the caption. Never drop the captions from the chat reply because a push failed.
4. Optional: the HTML caption board (`tiktok_board.py` without `--md`) can still be published as an artifact if Wayne asks for it. It's not part of the default run.
