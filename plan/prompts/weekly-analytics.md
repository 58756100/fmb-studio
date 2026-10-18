# Weekly analytics review: paste into a new Claude Code chat (fmb-studio environment)

Run every Sunday. The text between the lines is the prompt.

---

You are FuelMyBuild's studio analyst running the Sunday review. Work in the repo 58756100/fmb-studio, in this cloud environment (it holds the API credentials as environment variables).

**Read first:** CLAUDE.md, .claude/skills/studio/SKILL.md, .claude/skills/analytics/SKILL.md, state/learnings.md, state/production-standards.md, state/visual-bank.md, plan/2wk-sprint-2026-10-26.md and plan/2wk-calendar.md. Read state/queue.json from origin/main: the posting routine writes there, so it has the latest posted items.

**Window:** everything published in the last 7 days (Monday to Sunday, US Eastern). Re-pull posts from the week before as well, mark them "day N", and keep them out of this week's rankings.

**Rules**
- Never print, log or commit any key or token. Redact any URL that contains `access_token` before you show it.
- Read-only API calls only: no posting, deleting, replying or editing captions.
- Never invent a number. If a metric isn't available, write "n/a" and say why.
- Files you may write: state/metrics/, state/learnings.md, lab/scoreboard.md, weeks/<week>/review/, and the analytics scripts, if a fix is needed.
- Commit and push to your working branch when done, and tell me if anything should merge to main.

## Step 0: preflight (do this first; report problems at once, in plain steps)
1. Confirm these environment variables exist (names only): IG_USER_ID, IG_ACCESS_TOKEN, TT_CLIENT_KEY, TT_CLIENT_SECRET, TT_REFRESH_TOKEN.
2. Instagram: call `GET /{IG_USER_ID}?fields=username,followers_count,media_count`.
   - If it fails with OAuth error 190, the token is dead. Give me the regeneration steps from .claude/skills/publishing/references/platform-setup.md, then carry on with TikTok.
   - Also run a debug_token call and tell me how many days the token has left. Warn me if it's under 10.
3. TikTok: exchange the refresh token for an access token, then call `/v2/user/info/?fields=follower_count,following_count,likes_count,video_count`.
   - Record these as this week's account totals, next to last week's in state/metrics/.
   - The sandbox app can't get `video.list`, so the API has no per-video numbers. Don't try `/v2/video/list/` or `/v2/video/query/`.
4. If a platform stays blocked, ask me for screenshots or CSV exports instead (Instagram Insights per reel; TikTok Studio per video, including the retention graph). Analyse those, and mark which numbers came from screenshots.

## Step 1: collect the numbers
**Instagram, per reel**
- From `/{IG_USER_ID}/media`: id, caption, timestamp, permalink, thumbnail_url, like_count and comments_count.
- From `/{media_id}/insights`: views, reach, likes, comments, shares, saved, total_interactions, ig_reels_avg_watch_time and ig_reels_video_view_total_time.
- Also try follows, profile_visits and profile_activity. Drop any metric the API rejects, and list it.
- Comment text from `/{media_id}/comments`.

**Instagram, account level:** daily follower count, reach, profile views and website clicks for the window, wherever the API allows.

**TikTok, per video (from screenshots):** at the start of the run, ask me for TikTok Studio screenshots. Studio is at tiktok.com/tiktokstudio on a computer, or Creator tools → Analytics in the app. Ask for:
- the Content list for the week (each video's views, likes, comments and shares)
- for each of the 5 most-viewed and 3 least-viewed videos, its analytics page: total play time, average watch time, % watched in full, the retention graph, traffic sources and new followers

Read the numbers off the screenshots, mark them "from screenshot", and wait for them before you rank TikTok. Account totals (followers, total likes, video count) come from the API.

**Match every post to its queue item**
- Instagram: by `media_id`.
- TikTok: Wayne posts the drafts by hand, so the queue has no TikTok id. Match each screenshot row to its queue item by posting day (draft day ±1), the cover frame and the caption. List any you couldn't match.

**Fix `.claude/skills/analytics/scripts/fetch_metrics.py` while you're there**
- It only reads `post_id`, but posted Instagram items store `media_id`, so the last run found nothing.
- Make it use `media_id` for Instagram, and pull TikTok account totals from `/v2/user/info/`.

Save the raw data to state/metrics/<week>.json.

## Step 2: join each post with how it was made
For every post, record:
- concept id, lane (0, A, B, C, lab or INTL) and audience (collectors, garages or suppliers)
- hook variant and its exact hook line (first spoken line and first on-screen words)
- CTA family and exact CTA line
- voice_name and voice_id, pace (fast or normal), language and country
- length in seconds, post time (ET), weekday and platform
- full caption and hashtags

Sources: the queue, the scripts under weeks/*/, the VO word timings and the storyboards.

**Watch every top-5 and bottom-5 video.**
1. Fetch the render with `git fetch --depth 1 --filter=blob:none origin renders`, then `git show origin/renders:<path> > file.mp4`.
2. Pull frames at 0, 0.5, 1, 2, 3 and 5 s, every 5 s after that, and the last frame.
3. Read the VO transcript next to them.

## Step 3: metrics (per post, then per group)
**Per post**
- views and reach
- average watch time in seconds, and as a % of length
- likes, comments, shares and saves, each per 1,000 views
- engagement rate: (likes + comments + shares + saves) / reach
- follows per 1,000 views, profile visits and link taps where available

**Fairness rules**
- Compare posts of the same age. Use the views at the same day N, or flag the age.
- Shares and saves weigh most: they drive reach.

**Rank** the top 5 and bottom 5 overall, per platform and per audience.

## Step 4: creative breakdown (each top-5 and bottom-5 post)
- **Hook (0–3 s):** what was said and shown. Does it name the audience in the first 2 s, open a curiosity gap, and show motion in frame 1?
- **Storyline:** setup, turn and payoff. When does the turn land? Is it a story or an ad? Is it clear with sound off, and with sound on only?
- **Voice:** which voice, pace and delivery. Does it sound natural or robotic? Any clipped words, odd pauses or mispronunciations? Does it fit the audience?
- **Visuals:**
  - Images: bank photos, cutouts or code-drawn.
  - Text: size, legibility and safe zones.
  - Density: no more than 3 groups on screen, and headlines of 6 words or fewer.
  - Motion: transitions that carry the story, and any frozen moments.
  - Does it look premium or "AI"?
- **Sound:** music, sound effects and loudness.
- **Retention:** where viewers leave (Instagram average watch vs length; TikTok curve if given), and what was on screen and being said at that second.
- **Caption, hashtags and CTA:** CTA family, whether it got keyword comments or DMs, and whether the caption adds anything.
- **Comments:** sentiment, questions and objections, quoted.
- **Verdict:** keep, fix or retire, with one concrete fix and a target number (e.g. "turn lands at 6 s → move it to 3 s, target average watch +3 s").

## Step 5: scoreboards
Compare these, with sample sizes, and call anything under 3 posts an "early signal":
- lanes: C vs 0 vs A vs B vs lab, on matched topics
- voices, per audience
- pace: fast vs normal
- hooks A vs B vs C of the same body
- length: under 35 s, 35–45 s, over 45 s
- audience
- CTA family
- posting slot and weekday
- Instagram vs TikTok for the same body
- the international countries (UK, DE, AU), once they air

## Step 6: growth
- Followers gained per platform, profile visits, website clicks, keyword comments (BUILD, SHOP, PARTS), and DMs (ask me for the DM count).
- The trend against earlier weeks in state/metrics/.
- Are we on track for 10 a day? Note any posting failures in the queue (blocked tokens, skipped slots).

## Step 7: update the system
- state/learnings.md: follow the analytics skill (Proven, Promising, Disproven, open tests; every line cites reel ids and numbers; under 150 lines; merge, don't append).
- lab/scoreboard.md: the lane, voice and pace scoreboards.
- weeks/<week>/review/report.md: the full breakdown.
- A list of the 10 most valuable changes for next week. Tie each one to specific unposted items in plan/2wk-calendar.md (scripts, hooks, voices, visuals, captions, CTAs, post times). Propose; don't re-render or re-voice anything.

## Step 8: report to me
1. Publish a private Artifact page, "FMB weekly review <week>", with:
   - a 5-line summary
   - top and bottom tables
   - one card per top and bottom video: thumbnail, numbers and breakdown
   - the scoreboards and the growth trend
   - the 10 changes
   - what couldn't be measured, and why
2. In chat: 5 bullets, the link, and anything I need to do (expiring or dead tokens, screenshots to send, DMs to count).
3. Commit and push.

---
