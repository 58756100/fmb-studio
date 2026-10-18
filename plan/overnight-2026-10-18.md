# Overnight run, Oct 18–19: finish the sprint bodies and schedule them

Wayne, 2026-10-18 (Nairobi night): "finish up all the videos and schedule them esp for these weeks and remember tiktok captions displayed after every run. am going to bed so self approve everything for now." This approves the storyboards, builds, renders and the posting schedule for the sprint (Oct 26 – Nov 8). It does not change the brand rules or the security rules.

Every agent reads this file, `state/production-standards.md` (including the new **Names** rule), `state/visual-bank.md` and its own skill. Pass paths, not contents.

## Order of work (first airing date decides priority)
| Group (first airing) | Bodies needing build |
|---|---|
| G1 Mon Oct 26 | S0-09, S0-14, S0-08, SC-04, LA-03, S0-12, S0-04, SC-10 |
| G2 Tue Oct 27 | S0-03, S0-11, LB-07, SC-01, S0-07, SC-08, SC-06 |
| G3 Wed Oct 28 | S0-05, SC-07, S0-15, LA-06, SC-02, LA-10, SC-09, S0-13 |
| G4 Thu Oct 29 | SC-05, S0-10, S0-01, LA-08, S0-06, SC-03, LA-07, S0-02 |
| G5 Fri Oct 30 | LB-08, LB-03, LB-02, LA-09, LB-05, LA-01, LA-04, LB-01, LA-02, LA-05 |
| Late singles (Nov 4, Nov 7) | LB-09, LB-06, LB-04, LB-10 |
| INTL (Nov 2–8) | native-language versions of LA-03, LB-07, LA-06, LA-08, LB-05 (later; see plan/intl-research.md) |

Slot, audience, length, CTA, pace and voice for every body are in `plan/2wk-calendar.md`. Hooks needed: G1–G4 bodies air three times (hooks A, B, C); G5 bodies twice (A, B); late singles once (A).

## Shared rules for tonight
- Voice: eleven_v4 through `.claude/skills/voiceover/scripts/tts.py` (run with `</dev/null`). Batches of 10k credits or less. About 52k credits are left across both keys. Calendar voice "audition" → choose from the Sprint roster in `.claude/skills/voiceover/references/voice-roster.md` (Dan, Frank), and record voice_id and voice_name.
- Collector bodies: use the collector bank (`kit/remotion/public/img/bank/K1-*`, `K2-*`, `K3-*`, `K4-*`) where the story fits. About a third of collector bodies get a hook that names collectors in the first 2 s (make that hook B or C, so hook A stays the tested script).
- Build in `weeks/2026-W44/sprint/film/` with the same kit, `master.sh`, `gate.py` and `audio/score.py` the 9 lab masters used; one `src/reels/<id>.tsx` per body. Every master must pass the gate (1080×1920 30 fps, −14 LUFS, TP ≤ −1 dBTP after AAC, A/V lag 0, no 0.5 s window under the static threshold, no subtitles, no labels).
- The machine has 4 cores and other renders run at the same time: render with `--concurrency 2`, and clear old Remotion bundles in /tmp (`master.sh` does it).
- Renders go to the `renders` branch at `2026-W44/sprint/masters/<id>-<hook>.mp4` (plus `<id>-bed.wav`), one commit per file, with `push-render.sh`. Never put mp4 or wav on the working branch.
- Source, logs and check JSON go to `claude/focused-ritchie-6w1221`. Other agents push to it too: commit only your own files, then `git pull --rebase origin claude/focused-ritchie-6w1221` and push, retrying on rejection.
- Add each finished body to `state/visual-bank.md` (premise, device, props, names used).
- Write a status line to `plan/overnight-status.md` after each body: id, hooks rendered, lengths, gate result, renders paths, anything skipped.
- If you hit a usage limit, write where you stopped in `plan/overnight-status.md` and stop; the run resumes from there.
