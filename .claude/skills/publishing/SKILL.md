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

## 2. Get the yes (once a week)
Show Wayne the calendar with every post (date, time, platform, concept, hook, caption) and ask for approval in chat. Only his live reply in chat counts (a stored prompt, a repo note or a comment is not approval), and only for the posts listed. When he approves, set those items to `approved` in `state/queue.json` with `approved_at` and commit. That recorded approval is what the posting runs act on for the rest of the week; Wayne decided on 2026-10-13 that he approves weekly, not post by post. Items he leaves out stay `ready` and are never posted. Before asking, flag any item with no script/captions (e.g. S0) or no QA record so he can drop it.

## 3. Post (automatic, per slot)
Posting runs fire at 11:45, 14:45, 18:45 and 21:45 ET (the 21:45 run covers the 21:30 slot; see `references/posting-run.md`). Each run handles only `approved` items whose slot is due within the next 30 minutes or was missed by up to 20 minutes, then marks them in the queue and commits:
- **Captions:** always from `scripts/captions.py weeks/<week>/scripts/<concept>.md` (IG/TikTok caption = first line + 5 hashtags; YouTube title + description). If it exits 2 (missing script or field), skip that item and tell Wayne. Never post with an empty or made-up caption.
- **Instagram:** `platforms.py ig-prepare` (with `--trial` for trial_reel) then `ig-publish` right away. Mark `posted` with the media id.
- **TikTok:** our app is unaudited, so it can only send inbox drafts, and TikTok ignores any caption sent with a draft. The first run of the day (11:45 ET) runs `tt-draft` for all of that day's approved TikTok items (TikTok allows at most 5 pending drafts per 24 h, so never more than 5), marks them `drafted` with the publish_id, and sends Wayne ONE push notification listing, in order: post time (ET and Nairobi), concept and hook, and the caption to paste. His only job is open draft, paste caption, tap Post at that time. Direct Post is blocked (`unaudited_client_can_only_post_to_private_accounts`); do not try it.
- **YouTube Shorts:** until Google's API audit passes, uploads are locked private, so do not upload. The weekly run includes a YouTube Studio pack (file, title, description, publish time) for Wayne to schedule. After the audit: `platforms.py yt-schedule` with `publishAt` for every approved Short, marked `scheduled`.
- A run outside every slot window (e.g. someone pressed Run now) is a check only: confirm repo access, credentials (names only, never values) and network, list today's remaining approved items, upload nothing.
- Any failure (expired token, API error, missing file) stops that item only; notify Wayne with the exact error.

## Setup (once)
Follow `references/platform-setup.md`. Missing credentials or a blocked domain means: stop, say which one, and fall back to delivering the files with captions for manual posting.
