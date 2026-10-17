# Sprint VO batch 2 (W44): 10 reels, eleven_v4 (re-rendered with fixed tts.py)

Generated with `scripts/tts.py --dialogue ... --tighten --model eleven_v4` (one dialogue JSON per call; one speed and stability per call). Masters = hook A + body + CTA. Hook B and C are separate opener clips, rendered for every reel because all ten reels air three times on the calendar (A, B, C). Files: `weeks/2026-W44/sprint/vo/<id>/` (vo.wav, words.json as [word, start, end], hook-B.wav and hook-B.words.json, hook-C.wav and hook-C.words.json, casting.json). WAVs are on the `renders` branch at `2026-W44/sprint/vo/<id>/`, not on this branch. Raw takes (one per line, pre-trim) are kept in the session scratchpad so re-cuts never re-spend credits.

## Re-render (2026-10-17, fixed tts.py)

Re-rendered with the fixed trimming (only real silence cut, 0.4 s breaths kept at sentence ends and 0.24 s at commas, 12 ms crossfades). Same dialogue JSONs and settings as the first pass. The first-pass numbers are superseded.

| Reel | Voices (script name → voice) | Pace (calendar) | Speed / stab. / style | Target (s) | Raw (s) | atempo | Final (s) | vs target | Words | Words/s (span) | Hook B (s) | Hook C (s) | Chars M / B / C | Chars |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S0-01 | Brian → Jerry B. (Gene); Chris → Dan (Cody); Eric → Justin Case (CTA) | normal | 1.00 / 0.55 / 0.10 | 39 | 46.32 | 1.06 | 43.71 | +12.1% | 107 | 2.45 | 3.81 | 3.06 | 571 / 64 / 47 | 682 |
| S0-02 | Rita → Emma (Joan); Brian → Jerry B. (Ed); Eric → Justin Case (CTA) | fast | 1.08 / 0.50 / 0.15 | 54 | 59.71 | 1.06 | 56.34 | +4.3% | 137 | 2.44 | 3.17 (1.0 s pad) | 3.37 | 748 / 20 / 51 | 819 |
| S0-03 | Eric → Justin Case (host, CTA); Brian → Jerry B. (Lou); Rita → Emma (Tasha); Chris → Dan (Andre) | fast (two-voice) | 1.04 / 0.50 / 0.15 | 38 | 43.26 | 1.06 | 40.82 | +7.4% | 94 | 2.31 | 4.04 | 4.35 | 516 / 69 / 72 | 657 |
| S0-05 | Rita → Emma (Jo); Brian → Jerry B. (Hal); Eric → Justin Case (CTA) | fast (two-voice) | 1.08 / 0.50 / 0.15 | 37 | 41.78 | 1.06 | 39.42 | +6.5% | 98 | 2.49 | 4.35 | 3.98 | 529 / 70 / 62 | 661 |
| S0-06 | Eric → Justin Case (narrator, CTA); Rita → Emma (Mia) | fast | 1.04 / 0.50 / 0.15 | 45 | 51.54 | 1.06 | 48.63 | +8.1% | 119 | 2.45 | 3.44 | 5.03 | 684 / 54 / 64 | 802 |
| S0-08 | Rita → Emma (Dolores); Chris → Dan (Pete); Eric → Justin Case (CTA) | fast | 1.08 / 0.50 / 0.15 | 32 | 35.04 (incl. 1.0 s open) | 1.06 | 33.06 | +3.3% | 83 | 2.59 | 3.06 | 4.41 | 434 / 53 / 52 | 539 |
| S0-09 | Brian → Jerry B. (trailer voice, audition); Chris → Dan (Tomás) | normal | 1.00 / 0.55 / 0.10 | 32 | 33.22 | 1.038 | 32.01 | 0.0% | 79 | 2.48 | 2.20 | 4.67 | 422 / 18 / 67 | 507 |
| S0-11 | Eric → Justin Case (narrator, CTA); Chris → Dan (Ben) | normal (Justin house) | 0.96 / 0.50 / 0.15 | 42 | 47.22 | 1.06 | 44.55 | +6.1% | 114 | 2.57 | 3.45 | 3.89 | 620 / 57 / 62 | 739 |
| S0-14 | Eric → Jerry B. (narrator, CTA, calendar lead voice); Chris → Dan (Omar) | fast | 1.08 / 0.55 / 0.10 | 32 | 35.26 | 1.06 | 33.27 | +4.0% | 83 | 2.50 | 4.19 | 2.38 | 462 / 52 / 26 | 540 |
| S0-15 | Chris → Frank (wrench, audition, CTA); Eric → Justin Case (Nate) | fast | 1.08 / 0.50 / 0.15 | 36 | 38.59 | 1.06 | 36.40 | +1.1% | 96 | 2.65 | 3.97 | 3.67 | 499 / 49 / 62 | 610 |

**Batch 2 one pass: 6,556 characters** (master + hook B + hook C per reel, as sent). Re-render was run once for all ten reels (no retakes). Batch-2 re-render spend: 6,556 characters.

Still over 10% long after the capped atempo: **S0-01 (+12.1%)**. Per the brief, words were not cut. Jerry B. at speed 1.0 runs about 2.3 words/s in the roster, and the countdown has split pauses for its clicks.

Words/s is words divided by the speech span (first word start to last word end), so scripted pauses lower it. Batch 1 used the same measure.

Raw runtimes went up versus the first pass (for example S0-06 from 50.80 to 51.54 s raw, S0-02 from 59.93 to 59.71 s; S0-08 +1.0 s pad). The gentler trimming keeps the breaths. Targets were not changed.

## Method notes
- Targets are the script "Target length" lines. Atempo is applied only when the master is over its target, capped at 1.06, and the same factor goes to that reel's hook openers. No reel was slowed down.
- Silent opens: S0-08's hook A 1.0 s silence is padded onto the master (inside the 32 s target). S0-02 hook B's 1.0 s silence is padded onto its opener. S0-09 hook B's 1.0 s silence is NOT added, because the script says the edit builds it.
- Pauses use the `gap` before a line. Long pauses (0.3 to 0.8 s) are set by splitting a line where the script asks for it.
- Word ends are clamped to file length (ElevenLabs timing tail, up to about 0.07 s).
- Dialogue lines carry one speed per call, so each multi-voice reel runs all voices at the reel's pace. Justin Case reels use 0.96 (normal) or 1.04 (fast, 0.96 x 1.08), as in batch 1. S0-03's host is Justin Case, so it runs at 1.04. S0-05 has Justin Case only on the CTA, so it runs at 1.08.
- Text is kept as written. Readings only: fuelmybuild.com → fuel my build dot com, WRX → W R X (read as letters), R thirty-four and E thirty as the scripts already write them. "POV" is kept as written. No break or emphasis tags.

## Casting and deviations (flags)
- **Mapping:** Eric → Justin Case, Brian → Jerry B., Chris → Dan, Rita/Sarah → Emma, per the sprint brief. The S0-06 script names Sarah as the slot default for Mia; it is Emma here, per the sprint roster.
- **S0-09 and S0-15 (audition):** trailer voice on Jerry B. (S0-09) and wrench on Frank (S0-15), as the brief specifies. Frank has no measured pace yet.
- **S0-14 narrator:** the script's casting line says Eric (Justin Case). The calendar's voice column says Jerry B. The calendar says one voice per body, the lead voice, so the narrator is on Jerry B. Omar is on Dan. Re-cast to Justin Case if Wayne prefers.
- **S0-01 hook C:** the script says hook C never airs, but the calendar has S0-01 hook C on Nov 8 at 11:00. The calendar governs, so hook C is rendered. The script's slot notes (Oct 26, Oct 31) are also stale against the calendar (Oct 29, Nov 3, Nov 8). The calendar was used for every airing and pace.
- **Speed reconciliation:** speaker-specific speed is not possible in one tts.py call. A per-voice speed would need a tts.py change; not made.

## Commits
- `renders` branch: one commit per reel, `2026-W44/sprint/vo/<id>/` (vo.wav, words.json, hook-B.wav, hook-B.words.json, hook-C.wav, hook-C.words.json).
- `claude/focused-ritchie-6w1221`: this file, the word files and `casting.json` for each reel.
