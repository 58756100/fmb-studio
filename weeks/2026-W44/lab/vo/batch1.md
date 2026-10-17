# Lab batch 1 VO (W44): 9 reels, eleven_v4

Generated with `scripts/tts.py --dialogue ... --tighten` (one JSON per reel, one speed per reel call). Masters = hook A + body (the script's line 1 is hook A). Hook B and C are separate opener clips. Files: `weeks/2026-W44/lab/vo/<id>/` (vo.wav, words.json, hook-B/C.wav and .words.json, casting.json). WAVs are on the `renders` branch, not on this branch.

| Reel | Voice(s) | Pace | Duration (s) | Target (s) | vs target | Words | Words/s (speech span) | Characters |
|---|---|---|---|---|---|---|---|---|
| A-L1 | Jerry B. (all lines) | fast (1.08) | 28.94 | 28 (A) | +3.4% | 70 | 2.42 | 448 |
| A-L2 | Jerry B. (all lines) | normal (1.0) + atempo 1.06 | 29.96 | 28 (A) | +7.0% | 71 | 2.37 | 461 |
| A-L3 | Emma (all lines) | normal (1.0) + atempo 1.06 | 29.20 | 28 (A) | +4.3% | 72 | 2.48 | 465 |
| B-L1 | Emma (all lines; spec said Eric, calendar says Emma) | fast (1.08) | 30.51 | 30 (B) | +1.7% | 58 | 1.90 | 436 |
| B-L2 | Emma (all lines; spec said Chris, calendar says Emma) | fast (1.08) | 30.76 | 30 (B) | +2.5% | 67 | 2.19 | 510 |
| B-L3 | Jerry B. (all lines; spec said Eric, calendar says Jerry B.) | fast (1.08) | 31.52 | 30 (B) | +5.1% | 67 | 2.13 | 430 |
| C3-COL | Narrator Justin Case; Marisol Emma; Dev Dan | fast (1.04, Justin house 0.96 x 1.08) | 26.64 | 27 (C) | -1.3% | 56 | 2.11 | 579 |
| C3-GAR | Narrator Justin Case; Okafor Frank; Gus Jerry B. (stretch: no gruff mid-40s voice on roster) | normal (0.96, Justin house) | 25.06 | 27 (C) | -7.2% | 49 | 1.96 | 514 |
| C3-SUP | Narrator Justin Case; Noor Emma; Theo Dan | normal (0.96, Justin house) + atempo 1.06 | 28.97 | 27 (C) | +7.3% | 56 | 1.94 | 596 |

**Batch total: 4,439 characters** (master + hook B + hook C per reel, counted as sent). Budget 10,000; 5,561 left. No retakes were needed.

## Flags
- **Over 10% long before fix:** A-L2 (+13.4%), A-L3 (+10.5%), C3-SUP (+13.7%). Fixed with atempo 1.06 (the skill's cap) on the master and its hook openers, post-render, no re-spend. Now +7.0%, +4.3%, +7.3%. No line is over 10% now.
- **Pace:** no reel is faster than atempo 1.06 overall; measured words/s is 1.9 to 2.5 because the span includes scripted pauses (reveal silences, 0.5 to 1.0 s holds).
- **Calendar Len column** (40, 35, 40, 40, 35, 45, 50, 55 s) disagrees with the scripts' runtimes (28, 28, 28, 30, 30, 30, 27, 27, 27 s). Targets here are the scripts' runtimes; the calendar lengths are marked provisional.
- **Silent-open hooks:** C3-COL hook-C and C3-GAR hook-C have their 1.0 s silence added in post (renderer trimmed the leading break). Their words.json are shifted to match.
- **A-L2 hook B duplicates the body:** its opener is "Which shop would you hire?", which is also body line 2 of the A-L2 master. Keep the text as written, but decide whether this opener is used; the test will show a repeat.
- **B-L3 hook B vs body:** "First reply isn't proof." sits next to body "First reply:" (spoken at 3 s). Mild repeat, flagged for the editor.
- **Text reading changes (not wording):** FuelMyBuild read as Fuel My Build; 240Z as two-forty Z; R34 as R thirty-four; fuelmybuild.com as fuel my build dot com; emphasis asterisks removed (v4 takes no emphasis tags).
- **Casting:** B-lane spec VO direction named Eric (B-L1, B-L3) and Chris (B-L2); the calendar's voice column (Emma, Emma, Jerry B.) was used per the brief. Multi-speaker C3 reels cast from the roster with the best fit; Gus on Jerry B. is the weakest match.
- **Speed per reel:** tts.py takes one speed per call, so each multi-voice reel runs all its voices at the reel's pace. Justin Case fast is 1.04, which is 0.96 times 1.08. Per-voice tempo would need a tts.py change; not made.
- **Model:** eleven_v4 for every call (tts.py default). Break tags were honored in the masters (0.16 to 0.3 s measured); leading breaks at the start of a clip are trimmed by the renderer.
