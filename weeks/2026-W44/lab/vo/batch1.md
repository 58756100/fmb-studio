# Lab batch 1 VO (W44): 9 reels, eleven_v4 (re-rendered with fixed tts.py)

Generated with `scripts/tts.py --dialogue ... --tighten` (one JSON per reel and per hook, one speed and stability per call). Masters = hook A + body (line 1 of each script is hook A). Hook B and C are separate opener clips. Files: `weeks/2026-W44/lab/vo/<id>/` (vo.wav, words.json as [word, start, end], hook-B/C.wav and .words.json, casting.json). WAVs are on the `renders` branch at `2026-W44/lab/vo/<id>/`, not on this branch. Raw takes (one per line, pre-trim) are kept in the session scratchpad so re-cuts never re-spend credits.

## Re-render (2026-10-17, fixed tts.py)

Re-rendered after the trimming fix (only real silence is cut, 0.4 s breaths kept at sentence ends and 0.24 s at commas, 12 ms crossfades). Same dialogue JSONs and settings as the first pass. The first-pass numbers are superseded.

| Reel | Voice(s) | Pace | Speed / stab. / style | Target (s) | Raw (s) | atempo | Final (s) | vs target | Words | Words/s (span) | Hook B (s) | Hook C (s) | Chars M / B / C | Chars |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A-L1 | Jerry B. (all lines) | fast | 1.08 / 0.55 / 0.10 | 28 (A) | 29.06 | 1.038 | 28.00 | 0.0% | 70 | 2.51 | 1.82 | 2.43 | 393 / 27 / 28 | 448 |
| A-L2 | Jerry B. (all lines) | normal | 1.00 / 0.55 / 0.10 | 28 (A) | 32.50 | 1.06 | 30.66 | +9.5% | 71 | 2.32 | 1.62 | 2.16 | 409 / 26 / 26 | 461 |
| A-L3 | Emma (all lines) | normal | 1.00 / 0.50 / 0.15 | 28 (A) | 31.10 | 1.06 | 29.34 | +4.8% | 72 | 2.46 | 2.47 | 2.39 | 416 / 24 / 25 | 465 |
| B-L1 | Emma (all lines) | fast | 1.08 / 0.50 / 0.15 | 30 (B) | 30.95 | 1.032 | 30.00 | 0.0% | 58 | 1.94 | 2.29 | 2.29 | 381 / 27 / 28 | 436 |
| B-L2 | Emma (all lines) | fast | 1.08 / 0.50 / 0.15 | 30 (B) | 32.02 | 1.06 | 30.22 | +0.7% | 67 | 2.23 | 1.72 | 1.79 | 465 / 22 / 23 | 510 |
| B-L3 | Jerry B. (all lines) | fast | 1.08 / 0.55 / 0.10 | 30 (B) | 32.76 | 1.06 | 30.91 | +3.0% | 67 | 2.18 | 2.23 | 2.00 | 382 / 24 / 24 | 430 |
| C3-COL | Justin Case (narrator); Emma (Marisol); Dan (Dev) | fast (Justin house 0.96 x 1.08) | 1.04 / 0.50 / 0.15 | 27 (C) | 27.60 | 1.022 | 27.00 | 0.0% | 56 | 2.08 | 2.31 | 2.20 | 513 / 30 / 36 | 579 |
| C3-GAR | Justin Case (narrator); Frank (Okafor); Jerry B. (Gus) | normal (Justin house) | 0.96 / 0.50 / 0.15 | 27 (C) | 25.58 | none | 25.58 | -5.3% | 49 | 1.92 | 2.60 | 2.40 | 431 / 48 / 35 | 514 |
| C3-SUP | Justin Case (narrator); Emma (Noor); Dan (Theo) | normal (Justin house) | 0.96 / 0.50 / 0.15 | 27 (C) | 31.64 | 1.06 | 29.85 | +10.6% | 56 | 1.89 | 2.69 | 2.84 | 492 / 49 / 55 | 596 |

**Batch 1 one pass: 4,439 characters** (master + hook B + hook C per reel, as sent). Re-render was run once for all nine reels (no retakes). Batch-1 re-render spend: 4,439 characters.

Still over 10% long after the capped atempo: **C3-SUP (+10.6%)**. Per the brief, words were not cut. A-L2 (+9.5%) is just under the line.

Raw runtimes went up versus the first pass (for example A-L2 from 29.96 to 32.50 s raw, C3-SUP from 28.97 to 31.64 s raw). The gentler trimming keeps the 0.4 s sentence and 0.24 s comma breaths that the old cut removed, so the same words run longer. This is the intended natural flow, and the targets were not changed.

## Post step
- Atempo fits every master over its target (cap 1.06), with the same factor applied to its hook openers. C3-GAR is under target, so no tempo was applied.
- Silent opens: C3-COL and C3-GAR hook C have a scripted 1.0 s silent open. The raw takes start at 0.12 s, so the 1.0 s is padded onto the opener and the word file shifted to match.
- Word ends are clamped to file length (the ElevenLabs timing tail is up to about 0.07 s).

## Flags
- **Over budget or target:** C3-SUP is +10.6% after the cap. Options for Wayne: trim a line in the script (retention-editor), or accept.
- **Calendar Len column** (40, 35, 40, 40, 35, 45, 50, 55 s) disagrees with the scripts' runtimes (28, 28, 28, 30, 30, 30, 27, 27, 27 s). Targets here are the scripts' runtimes; the calendar lengths are marked provisional.
- **A-L2 hook B duplicates the body:** its opener is "Which shop would you hire?", which is also body line 2 of the A-L2 master. Text kept as written. Decide whether this opener is used; the test will show a repeat.
- **B-L3 hook B vs body:** "First reply isn't proof." sits next to body "First reply:" (spoken at 3 s). Mild repeat, flagged for the editor.
- **Text readings (not wording):** FuelMyBuild read as Fuel My Build; 240Z as two-forty Z; R34 as R thirty-four; fuelmybuild.com as fuel my build dot com; emphasis asterisks removed (v4 takes no emphasis tags).
- **Casting:** B-lane spec VO direction named Eric (B-L1, B-L3) and Chris (B-L2); the calendar's voice column (Emma, Emma, Jerry B.) was used per the brief. Multi-speaker C3 reels cast from the roster with the best fit; Gus on Jerry B. is the weakest match.
- **Speed per reel:** tts.py takes one speed per call, so each multi-voice reel runs all its voices at the reel's pace. Per-voice speed would need a tts.py change; not made.
- **Model:** eleven_v4 for every call.
