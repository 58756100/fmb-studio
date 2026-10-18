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

## CTA patch, 2026-10-17

Closing CTAs replaced with share/save lines, spoken by each reel's narrator at the reel's own speed and the same atempo as its master. Masters on `renders` at `2026-W44/lab/vo/<id>/` (one commit per reel). Words files here are the new tails. Hook openers (hook-B/C) are unchanged: none of them carries a CTA or a brand name.

| Reel | Narrator | Speed / stab. / style | atempo | New CTA line | Chars | Old CTA (removed) | Master (s) before to after |
|---|---|---|---|---|---|---|---|
| A-L1 | Jerry B. | 1.08 / 0.55 / 0.10 | 1.038 | Got a friend whose best upgrade has zero proof? Send them this. | 63 | Follow for better build records. | 28.00 to 30.23 |
| A-L2 | Jerry B. | 1.00 / 0.55 / 0.10 | 1.06 | Send this to the shop owner whose best work never makes the photos. | 67 | Follow for better build records. | 30.67 to 32.61 |
| A-L3 | Emma | 1.00 / 0.50 / 0.15 | 1.06 | Know a parts brand that keeps getting guessed? Send them this. | 62 | Follow for better build records. | 29.34 to 30.61 |
| B-L1 | Emma | 1.08 / 0.50 / 0.15 | 1.032 | Send this to the collector who still says, trust me, it's done. | 63 | Follow for documented builds. | 30.01 to 32.58 |
| B-L2 | Emma | 1.08 / 0.50 / 0.15 | 1.06 | Got a buddy picking a shop right now? Send this their way. | 58 | Follow for documented builds. | 30.22 to 31.16 |
| B-L3 | Jerry B. | 1.08 / 0.55 / 0.10 | 1.06 | Send this to whoever answers 'what turbo is that' first in your group chat. (full re-render) | 417 (whole master) | Follow for documented builds. | 30.91 to 32.20 |
| C3-COL | Justin Case | 1.04 / 0.50 / 0.15 | 1.022 | Save this for the next time someone in your crew swears they remember the year. | 79 | fuel my build dot com. | 27.00 to 29.45 |
| C3-GAR | Justin Case | 0.96 / 0.50 / 0.15 | none | Shop owners, save this one for the next 'you never told me'. | 60 | fuel my build dot com. | 25.58 to 27.59 |
| C3-SUP | Justin Case | 0.96 / 0.50 / 0.15 | 1.06 | Send this to the parts brand still answering 'rattle, fix?' with ten questions. | 79 | fuel my build dot com. | 29.85 to 32.84 |

**Characters used in this patch: 948 of 1,500** (8 CTA lines at 531, plus B-L3 full master at 417). One pass, no retakes.

### Joins
- Splice method (eight reels): the old CTA starts at the audio onset found from the master's own waveform, not from words.json. The cut sits 0.05 s before that onset, inside verified digital silence. The silence before the new line is set to 0.40 s from the last body speech (measured 0.39 to 0.41 s in the output). A 12 ms crossfade is applied at each join. The body prefix is bit-identical to the old master.
- Tails: the new tail matches the old tail, with a 0.10 s minimum.
- B-L3 was re-rendered in full rather than spliced, because "Demo Brand B" sits in line 1 and "Demo Brand A" in line 4, and each would have been a join inside a single take. The line 2 "Brand B" and line 1 "Definitely B" are not literal "Demo Brand" strings and were left as written.

### Risky join
- **B-L1:** the word timing for "Follow" sat 0.17 s after the audio onset (word-time cut would have landed 0.12 s inside the CTA's first word). The cut was placed on the audio onset instead. Checked: silence before the cut, 0.40 s seam, no clipping. Worth a listen.
- **C3-GAR:** word timing trailed the audio by 0.19 s at the old CTA. Same audio-based cut, seam verified.

### Flags
- **Runtimes grew.** All masters now run longer than their scripts' targets (targets 28 / 30 / 27 s): A-L1 +8%, A-L2 +16%, A-L3 +9%, B-L1 +9%, B-L2 +4%, B-L3 +7%, C3-COL +9%, C3-GAR +2%, C3-SUP +22%. The new CTA is longer than the old "Follow ..." tag. Per the brief, words were not cut and atempo was not raised past the existing factor. Options for Wayne: trim a body line (retention-editor), or accept.
- **B-L3 line 2 still says "Brand B"** ("Now Brand B gets the credit") next to Vantor and Kestrel. Left as written because the brief named only "Demo Brand B" and "Demo Brand A". Check with Wayne.
- **B-L3 hook openers** do not mention the names, so they were not re-rendered.
- **Word ends** are clamped to file length (ElevenLabs tail timing).

## Names patch, 2026-10-18 (no placeholder names)

Wayne's rule (state/production-standards.md, Names): no "Shop A" / "Brand B" style names, on screen or in the VO. Only the spoken placeholder lines were re-voiced, with each reel's own voice and settings (eleven_v4, `tts.py --tighten --tempo 1.06`, run with `</dev/null`), and spliced into the existing master. Hook openers are unchanged (none carries a name).

| Reel | Voice | Speed / stab. / style | Old line(s) | New line(s) | Chars |
|---|---|---|---|---|---|
| B-L3 | Jerry B. (Dg1lUQiSAGVHkoQMG3QX) | 1.08 / 0.55 / 0.10 | Next reply: Definitely B. / Now Brand B gets the credit. | Next reply: Definitely Vantor. / Now Vantor gets the credit. | 57 |
| B-L2 | Emma (9HBoEQ8LqyvVZFYDodnr) | 1.08 / 0.50 / 0.15 | Shop A's gallery shows the finish. / So Nora opens Shop B's public build on Fuel My Build. Garage: Shop B. | Delmar Auto's gallery shows the finish. / So Nora opens Tanner Street's public build on Fuel My Build. Garage: Tanner Street Motors. | 129 |

**Characters used: 186** (four takes, one pass, no retakes).

- Splice: same method as the CTA patch. Each cut sits 0.05 s before an audio onset found from the master's waveform (8 frames of silence required before the onset, -55 dB threshold), inside verified silence; the new take is trimmed to its own speech (0.05 s lead, 30 ms fade-out) and followed by the old line's trailing silence (0.30 / 0.40 s for B-L3, 0.30 / 0.38 s for B-L2); 12 ms crossfades at each join. Speech level of the new takes is within about 1 dB of the neighbouring lines; integrated level of the VO file unchanged (B-L3 -20.8 to -20.7 LUFS, B-L2 -22.1 LUFS).
- Lengths: B-L3 master VO 32.20 to 32.47 s; B-L2 31.16 to 32.15 s.
- Words files: `words.json` here, in `sprint/film/src/vo/<id>/` and `sprint/film/public/vo/<id>/`. WAVs replaced on `renders` at `2026-W44/lab/vo/<id>/vo.wav`.
- A-L2 and A-L3 had placeholders on screen only (VO clean), so no re-voice.
