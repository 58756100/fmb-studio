> **Superseded (2026-10-17):** these clips were cut with the old pause trimming, which could clip word starts. They are being re-rendered with the fixed tts.py, and the timings below will be replaced.

# Sprint VO batch 2 (W44): 10 reels, eleven_v4

Generated with `scripts/tts.py --dialogue ... --tighten --model eleven_v4` (one dialogue JSON per call; one speed and stability per call). Masters = hook A + body + CTA. Hook B and C are separate opener clips, rendered for every reel because all ten reels air three times on the calendar (A, B, C). Files: `weeks/2026-W44/sprint/vo/<id>/` (vo.wav, words.json as [word, start, end], hook-B.wav and hook-B.words.json, hook-C.wav and hook-C.words.json, casting.json). WAVs and word files are on the `renders` branch at `2026-W44/sprint/vo/<id>/`, not on this branch.

## Results

| Reel | Voices (script name → voice) | Pace (calendar) | Speed / stab. / style | Target (s) | Raw (s) | atempo | Final (s) | vs target | Words | Words/s (span) | Hook B (s) | Hook C (s) | Chars M / B / C | Chars |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S0-01 | Brian → Jerry B. (Gene); Chris → Dan (Cody); Eric → Justin Case (CTA) | normal | 1.00 / 0.55 / 0.10 | 39 | 46.42 | 1.06 | 43.79 | +12.3% | 107 | 2.45 | 3.67 | 3.06 | 571 / 64 / 47 | 682 |
| S0-02 | Rita → Emma (Joan); Brian → Jerry B. (Ed); Eric → Justin Case (CTA) | fast | 1.08 / 0.50 / 0.15 | 54 | 59.93 | 1.06 | 56.54 | +4.7% | 137 | 2.43 | 2.98 | 3.52 | 748 / 20 / 51 | 819 |
| S0-03 | Eric → Justin Case (host, CTA); Brian → Jerry B. (Lou); Rita → Emma (Tasha); Chris → Dan (Andre) | fast (two-voice) | 1.04 / 0.50 / 0.15 | 38 | 43.40 | 1.06 | 40.95 | +7.8% | 94 | 2.30 | 3.96 | 4.34 | 516 / 69 / 72 | 657 |
| S0-05 | Rita → Emma (Jo); Brian → Jerry B. (Hal); Eric → Justin Case (CTA) | fast (two-voice) | 1.08 / 0.50 / 0.15 | 37 | 41.12 | 1.06 | 38.80 | +4.9% | 98 | 2.53 | 4.57 | 4.12 | 529 / 70 / 62 | 661 |
| S0-06 | Eric → Justin Case (narrator, CTA); Rita → Emma (Mia) | fast | 1.04 / 0.50 / 0.15 | 45 | 50.80 | 1.06 | 47.93 | +6.5% | 119 | 2.49 | 3.51 | 4.90 | 684 / 54 / 64 | 802 |
| S0-08 | Rita → Emma (Dolores); Chris → Dan (Pete); Eric → Justin Case (CTA) | fast | 1.08 / 0.50 / 0.15 | 32 | 34.42 (incl. 1.0 s open) | 1.06 | 32.47 | +1.5% | 83 | 2.64 | 3.07 | 4.06 | 434 / 53 / 52 | 539 |
| S0-09 | Brian → Jerry B. (trailer voice, audition); Chris → Dan (Tomás) | normal | 1.00 / 0.55 / 0.10 | 32 | 32.58 | 1.018 | 32.00 | 0.0% | 79 | 2.48 | 2.18 | 4.91 | 422 / 18 / 67 | 507 |
| S0-11 | Eric → Justin Case (narrator, CTA); Chris → Dan (Ben) | normal (Justin house) | 0.96 / 0.50 / 0.15 | 42 | 46.96 | 1.06 | 44.31 | +5.5% | 114 | 2.58 | 3.44 | 4.11 | 620 / 57 / 62 | 739 |
| S0-14 | Eric → Jerry B. (narrator, CTA, calendar lead voice); Chris → Dan (Omar) | fast | 1.08 / 0.55 / 0.10 | 32 | 34.98 | 1.06 | 33.00 | +3.1% | 83 | 2.52 | 4.27 | 2.46 | 462 / 52 / 26 | 540 |
| S0-15 | Chris → Frank (wrench, audition, CTA); Eric → Justin Case (Nate) | fast | 1.08 / 0.50 / 0.15 | 36 | 38.63 | 1.06 | 36.45 | +1.3% | 96 | 2.64 | 4.14 | 3.75 | 499 / 49 / 62 | 610 |

**Batch total: 6,556 characters** for one full pass (master + hook B + hook C per reel, counted as sent). Budget 10,000. Retakes: 0. Remaining: 3,444. Credits used match this count (eleven_v4 bills per character).

Words/s is words divided by the speech span (first word start to last word end), so scripted pauses lower it. Batch 1 used the same measure.

## Method notes
- Targets are the script "Target length" lines. Raw is the tts.py output length; atempo is applied only when the master is over its target, capped at 1.06, and the same factor goes to that reel's hook openers. No reel was slowed down.
- Silent opens: S0-08 hook A's 1.0 s silence is padded onto the master (its 1.0 s is inside the 32 s target). S0-02 hook B's 1.0 s silence is padded onto its opener. S0-09 hook B's 1.0 s silence is NOT added, because the script says the edit builds it. Pad times are shifted into the word files and the atempo scales them with the audio.
- Scripted pauses use the `gap` before a line, and long pauses (0.3 to 0.8 s) are set by splitting a line where needed. Word ends are clamped to the file length (ElevenLabs timing tail, up to about 0.07 s).
- Dialogue lines carry one speed per call, so each multi-voice reel runs all voices at the reel's pace. Justin Case reels use 0.96 (normal) or 1.04 (fast, 0.96 x 1.08), as in batch 1. S0-03's host is Justin Case, so it runs at 1.04. S0-05 has no Justin Case line except the CTA, so it runs at 1.08.
- Text is kept as written. Readings only: FuelMyBuild → Fuel My Build (none in these VO lines), fuelmybuild.com → fuel my build dot com, WRX → W R X (script says read as letters), R thirty-four and E thirty as the scripts already write them. "POV" is kept as written. Break and emphasis tags are not used (none in these scripts).

## Casting and deviations (flags)
- **Mapping:** Eric → Justin Case, Brian → Jerry B., Chris → Dan, Rita/Sarah → Emma, per the sprint brief. The S0-06 script names Sarah as the slot default for Mia. It is Emma here, because the sprint roster maps Rita/Sarah to Emma.
- **S0-09 and S0-15 (audition):** trailer voice on Jerry B. (S0-09), wrench on Frank (S0-15), as the brief specifies. Frank was not auditioned or measured on this batch, so his pace is unmeasured (wps not in the roster yet).
- **S0-14 narrator:** the script's casting line says Eric (Justin Case). The calendar's voice column says Jerry B. The calendar says one voice per body, the lead voice, so the narrator is on Jerry B. Omar is on Dan. Re-cast to Justin Case if Wayne wants the script's version.
- **S0-01 hook C:** the script says hook C never airs (LB-03 takes its slot), but the calendar has S0-01 hook C on Nov 8 at 11:00. The calendar governs, so hook C is rendered (47 characters). The script's slot notes (Oct 26, Oct 31) are also stale against the calendar (Oct 29, Nov 3, Nov 8). Other script slot times (S0-03 at 15:30, for example) differ from the calendar too. The calendar was used for every airing and pace.
- **S0-01 over target:** after the capped atempo the master is still 12.3 percent long (43.8 s against 39 s). Per the brief, words were not cut. Jerry B. at speed 1.0 measured about 2.3 wps in the roster, and the reel is slow with three countdown beats split for their 0.35 s clicks. Options for Wayne: a Jerry B. speed of 1.08 (calendar says normal, so not applied), or trim the countdown pauses.
- **Duration vs target:** nine masters are within 8 percent of target. S0-01 is the only one still over 10 percent.
- **Speed reconciliation:** the speed on Justin Case reels is set to the house factor, and speaker-specific speed is not possible in one tts.py call (tts.py takes one speed per call). A per-voice speed would need a tts.py change; not made.
- **Retakes:** none. No ALL_KEYS_FAILED. Both env keys were available and the script rotated as needed (no key errors in the log).

## Commits
- `renders` branch: one commit per reel, `2026-W44/sprint/vo/<id>/` (vo.wav, words.json, hook-B.wav, hook-B.words.json, hook-C.wav, hook-C.words.json).
- `claude/focused-ritchie-6w1221`: this file and `2026-W44/sprint/vo/<id>/casting.json` for each reel.
