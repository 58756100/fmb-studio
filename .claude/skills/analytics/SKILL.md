---
name: analytics
description: This skill should be used when reviewing performance of FuelMyBuild posts — "how did the week do", "pull analytics", "what worked", "update learnings", "which hook won" — and when feeding results back into next week's content.
---

# Analytics and the learning loop

1. Run `scripts/fetch_metrics.py --queue state/queue.json --week <week> --out state/metrics/`.
2. Build one table per week: lane, voice, pace (fast/normal), language/country, concept, hook, format, hook family, audience, platform, runtime, views, 3-second hold (IG views/reach and the TikTok/YouTube equivalents where available), average watch time and % viewed, shares, saves, link taps and profile visits.
3. Read every YouTube retention curve. For each reel, note the second of the steepest drop, what was on screen, the voice line at that second, and the beat type (setup, list, product mention, transition). These are the body diagnostics.
4. Update `state/learnings.md` (keep it under 150 lines; merge rather than append):
   - **Proven** (3 or more reels agree), **Promising** (1–2), **Disproven**, plus open questions to test next week.
   - Every line cites its evidence (reel ids and the numbers).
   - For each reel's drop point, write one concrete fix with a target, e.g. "drops at 5 s while the product name appears → move the turn to 3 s, target 10 s average watch". Do the same for weak interaction: "0 comments → end on a question the audience can answer in one word, target 2+".
5. Decide next week's mix: about 60% proven formats and hooks, 40% experiments, never the bottom two formats again without a change, and promote any winning hook B or C to the main version for its concept.
6. Lab scoreboard: compare lanes 0, A, B and C on the matched topics (same topic, slot and platform) for 3-second hold, average watch time, % viewed, likes, comments, shares and saves. Name the leading lane per metric and what it did differently, and fold winning moves into lane 0. Write it to `lab/scoreboard.md`.
7. Voice and pace scoreboard: compare voices (by voice_name, per audience) and pace variants on the same metrics, and name the best-performing voice and pace. Feed the winners into next week's casting and edit pace.
8. Publish a short weekly report to Wayne: 5 lines and the table.
