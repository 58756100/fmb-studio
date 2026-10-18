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

## Sprint overrides (Wayne, 2026-10-15; see plan/2wk-sprint-2026-10-26.md "Decisions")
- YouTube paused: no uploads or scheduling until Wayne says it's set up.
- TikTok: two waves of 5 inbox drafts a day (first run of the day, then the 14:45 ET run). Put every draft's caption in the run's chat reply and push notification (`tiktok_board.py --md`: wave and number, post time ET and Nairobi, video id, title and a one-line description, opening line, caption in its own copyable block). See references/posting-run.md, "TikTok captions in the chat".
- Instagram: 10 a day.
- **Run times from Oct 19 (Wayne approved the full sprint schedule on 2026-10-18):** two routines fire 10 runs a day, at 07:55, 09:25, 10:55, 12:25, 13:55, 15:25, 16:55, 18:25, 19:55 and 21:55 ET, a few minutes before each sprint slot (08:00, 09:30, 11:00, 12:30, 14:00, 15:30, 17:00, 18:30, 20:00, 22:00).
  - Each run posts every `approved` Instagram item whose slot is due within the next 35 minutes, or was missed by up to 3 hours. The wide catch-up window covers the older W42 slot times and any skipped run.
  - Post them oldest first, one at a time, at least 2 minutes apart.
- **TikTok waves:** wave 1 is the first run of the day (07:55), with the day's slots 1–5. Wave 2 is the 13:55 run (or the first run after it), with slots 6–10. Before Oct 26, the first run sends all of the day's TikTok items (5 at most).
- **Render check:** a sprint item's `render` must exist on `origin/renders` (`git cat-file -e origin/renders:<path>`). If it doesn't, skip it, say "not rendered yet" in the run's reply, and leave it `approved` so a later run picks it up.

## 3. Post (automatic, per slot)
Posting runs fire at the times in "Sprint overrides" above (before Oct 19: 11:45, 14:45, 18:45 and 21:45 ET). Each run handles only `approved` items inside the window set there, then marks them in the queue and commits:
- **Captions:** every queue item carries its own caption, written in when the week is queued and checked before approval: `caption` for Instagram/TikTok (first line + 5 hashtags) and `yt_title` + `yt_description` for YouTube, all taken from `scripts/captions.py weeks/<week>/scripts/<concept>.md`. Post with exactly that text. If an item has no caption (or the YouTube fields), skip it and tell Wayne; never post with an empty, placeholder or made-up caption. When queuing a new week, fill these fields with captions.py and drop any item whose script has no Captions section.
- **Instagram:** `platforms.py ig-prepare` then `ig-publish` right away, always as a normal reel (never `--trial`; the account is below Instagram's trial reel follower requirement and Wayne decided on 2026-10-14 to post every former trial reel as a normal reel). Mark `posted` with the media id.
- **No duplicates (hard rule):** before any upload, re-read the latest `state/queue.json` from `origin/main` and skip the item if it is not `approved`, or if any item with the same `render` and `platform` is already `posted`, `drafted` or `scheduled`. Mark the item `posting` and push before calling `ig-publish`; if `ig-prepare` succeeded but `ig-publish` failed, record the container id and reuse it, never prepare a second container. If a result is unknown (timeout), check the account's recent media before retrying.
- **TikTok:** our app is unaudited, so it can only send inbox drafts, and TikTok ignores any caption sent with a draft. The first run of the day runs `tt-draft` (see the TikTok waves in "Sprint overrides") for all of that day's approved TikTok items (TikTok allows at most 5 pending drafts per 24 h, so never more than 5), marks them `drafted` with the publish_id, and sends Wayne ONE push notification listing, in order, for every draft: post time (ET and Nairobi), concept and hook, how to recognise the video (its opening voice-over line, taken from the hook table in weeks/<week>/scripts/<concept>.md, plus the first on-screen visual), and the caption to paste, ready to copy. Wayne asked on 2026-10-14 for this on every run so he can match caption to video. His only job is open draft, paste caption, tap Post at that time. **After every run** (not only the first) send Wayne a push notification with the ready-to-paste TikTok caption for every TikTok item that is `drafted` and not yet past its post time, or approved and due later today: post time (ET and Nairobi), concept and hook, and the exact `caption` text. Also keep the same list in `state/tiktok-captions.md` (overwritten each run, no secrets). Put the same captions list in the run's final chat reply too, so the captions appear in the notification, the chat and the file. Direct Post is blocked (`unaudited_client_can_only_post_to_private_accounts`); do not try it.
- **YouTube Shorts:** until Google's API audit passes, uploads are locked private, so do not upload. The weekly run includes a YouTube Studio pack (file, title, description, publish time) for Wayne to schedule. After the audit: `platforms.py yt-schedule` with `publishAt` for every approved Short, marked `scheduled`.
- A run outside every slot window (e.g. someone pressed Run now) is a check only: confirm repo access, credentials (names only, never values) and network, list today's remaining approved items, upload nothing.
- Any failure (expired token, API error, missing file) stops that item only; notify Wayne with the exact error.

## Setup (once)
Follow `references/platform-setup.md`. Missing credentials or a blocked domain means: stop, say which one, and fall back to delivering the files with captions for manual posting.
