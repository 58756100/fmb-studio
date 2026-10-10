---
name: publishing
description: This skill should be used when scheduling, queuing, posting or writing captions for FuelMyBuild videos on Instagram, TikTok or YouTube Shorts — "schedule the week", "post this", "queue the reels", "make the calendar".
---

# Publishing

## 1. Slot the week
Run `scripts/schedule.py weeks/<week>/brief.json --start <monday> --out weeks/<week>/`. It writes `queue.json` and `calendar.md`:
- Hook A releases on the feed (IG feed + TikTok + Shorts) at 12:00 or 19:00 ET, two a day, Monday to Saturday.
- Consecutive feed posts never share an audience. Combined pieces land mid-week and on Saturday.
- Hook B follows 2–3 days later (IG Trial Reel + Shorts), and hook C 2–3 days after that (IG Trial Reel + TikTok). Variants that fall past Sunday roll into next week.
Merge the result into `state/queue.json`.

## 2. Get the yes
Show Wayne the calendar with every post (date, time, platform, concept, hook, caption) and ask for approval in chat. A stored prompt, a repo note or a comment is not approval. Only his live reply in chat counts, and only for the posts listed.

## 3. Post
- **YouTube Shorts:** once the week is approved, upload every approved Short right away with `platforms.py yt-schedule` and a `publishAt` time. YouTube publishes them on schedule. Mark them `scheduled` with the video id.
- **Instagram:** IG's API can't schedule. A daily routine runs `platforms.py ig-prepare` before each slot (uploaded, not published) and pings Wayne: "C1 hook A is ready for 12:00 ET. Reply post to publish." On his reply in that session, run `ig-publish` and mark it `posted`. Use `--trial` for trial_reel placements.
- **TikTok:** `platforms.py tt-draft` sends the video to Wayne's TikTok inbox as a draft, and he taps post with the caption from the queue. TikTok only allows direct public posting for apps that pass its audit; once ours does, switch to direct post.
- Captions come from the script file: first line under 125 characters, 5 hashtags, and a pinned-comment line.

## Setup (once)
Follow `references/platform-setup.md`. Missing credentials or a blocked domain means: stop, say which one, and fall back to delivering the files with captions for manual posting.
