# Lane A+ (W44): execution changes to ChatGPT's A-L1..L3

A+ = ChatGPT's creative, Claude's execution. Unchanged from the specs: beats, timings, on-screen text, palettes, the three spec fonts, story, hook 1, the VO lines (now for Wayne to record; no synthetic voice). Phase-1 gap decisions (`A-L*-gaps.md`) still apply except where a line below replaces one. No house style, learnings.md or W42 material was used; the motion and sound skills were used for technique only.

Code: `aplus/` (Remotion project `src/`, sound `audio/`, QA `check.py`, VO windows `vo_data.py`). Script for Wayne: `vo-script.md`.

## 1. Scale
- The main visual now fills the middle of the safe area (x 96–880, y ~400–1190) instead of sitting in the top half. Car photos are 784 px wide frames with the cut-out at 700–780 px; the brake kit fills 400–980 at 8 s (L1); the turbo kit fills 440–960 at 6 s (L3); the stacked Miata panels are 784×380 each (L2).
- Records and mockups are sized to the same area. Focus fields are ≥56 px (L1 part value up to 104 px, brand 80 px, log date 66 px; L2 date 72 px, garage 80 px; L3 part/brand 72–76 px; URLs 58–66 px). Supporting labels are ≥44 px, including while L1's record is scaled 0.84 for the pull-back (its base sizes were raised to 54 px so they stay ≥45 px).
- Headlines stay Barlow Condensed Bold 80–104 px (96 px, 92 px for multi-line questions, auto-fit never below 80 px).
- Nothing visual enters the subtitle band (y 1220–1410) once settled. A checker overlay flags any visual there; the only hits were the first 4 frames of L1, while the evidence panel lands.
- The public URLs no longer shrink to fit one line; they break after "fuelmybuild.com/" at 58–66 px.
- The L3 opening composition (question, replies, Supra and turbo kit) is unchanged. It runs top to bottom, so the hero shares the frame with the thread there.

## 2. Motion
- Each scene is now a pure function of time. Elements are shared across beats and move by position and scale (eased tracks) instead of being separate stills: L1's blank evidence panel becomes the dated record; L2's Shop A panel becomes the header and comes back at the exact opening crop; L3's guessed reply is duplicated, stripped and enlarged.
- The changes follow the spec's cut rhythm:
  - L1: immediate open; hold 1–2 s; reveal at 7 s, when the photo slides up off the kit; one record detail per second 9–15 s; pull-back at 15 s; slower assembly 15–22 s; freeze 27–28 s.
  - L2: A/B hold through 4 s, with the selection outline moving to A at 2 s, to B and back to straddle at 3 s, and gone at 4 s; record reveal at 5 s; one detail per second 8–15 s; hard return to the opening crop at 15 s; payoff hold 15–17 s.
  - L3: reply changes at 0, 2 and 3 s; confident wrong answer held 4–6 s; the turbo kit isolated with an empty BRAND field and blinking caret 6–8 s; hard cut at 8 s; resolution at 10 s; return to the question at 18 s.
- "Hold" rows hold: no new element appears and nothing moves. "Music thins" at 6 s in L1 gets only a slow drift push-in (3.5 %).
- No remocn scene transitions were used, because every cut in the specs is a move or a hard cut.
- remocn pieces, ported to time-driven functions in `aplus/src/remocn/` (MIT). All are new versus the previous reel, which used zoom-blur, whip-pan, push-through and focus-pull:
  - mask-reveal-up: headline swaps. Exit shortened from 16 to 9 frames so a changed headline never ghosts over the next 1-second row.
  - value-swap: field values landing.
  - strikethrough-replace: L3 3 s, "I think" struck and dropped. It suits the spec's "editorial correction marks" reference.
  - caption-subtitle: burned subtitles.
  - caret (from typewriter): L3's empty brand field.
  - drift: L1's push-in at 6–7 s.

## 3. Readability
- A review overlay (`check` input prop) outlines any text under 44 px, any text outside x 96–880 / y 240–1430, any text overlapping text, and any visual in the subtitle band. 38 review stills across the three videos were checked and every flagged frame was fixed before the render. Fixes:
  - L1 "LOG DATE: OCT 12, 2026" ran past x 880 because the measurement ignored letter-spacing.
  - Headline ghosting between 1-second rows.
  - L1 garage line overflowing its card.
  - L1/L3 URL boxes clipping the rows they cover (those rows now fade out).
  - L2 date label crowding the DEMO BUILD tag.
  - L3 link reply overlapping the record.
  - L3 Supra photo hidden behind the record at 21 s.
- On the paper record (L1), field labels are #303832 rather than the emphasis colour (#E6A16A on #F2EBDD is about 1.9:1). The DEMO BUILD tag on paper is solid emphasis with dark text. This replaces phase-1 gap 3 for paper surfaces only.
- Subtitles: the VO lines are burned in at Source Sans 3 Semibold 52 px, centred in the band, at most 2 lines, using the windows from `vo-script.md` (caption-subtitle timing: 120 ms in, 160 ms out, soft shadow, no plate). There are no subtitles in silent windows. L3's 15-word line pages at its spec-row boundaries.

## 4. The arrow
- The arrow in "GUESS → ANSWER?" is still an SVG stroke (no font glyph), sized to the Barlow cap height. It is now part of the animated headline.

## Sound (priority)
- All music and SFX are synthesised in `aplus/audio/score.py`: no samples, no vocals, no engine, turbo, acceleration or cash-register sounds. So the beds are original and cleared for IG, TikTok and YouTube.
- L1, 90 BPM, D minor, restrained:
  - 0.0: low boom and Dm stab with the dry paper slap; brief musical gap 1–2 s.
  - 2.0: 8th-note bass pulse begins; muted kick, rim and shaker from 2.67.
  - 6.0: music thins; 7.0 reveal hit.
  - 8.0: beat resumes on the downbeat.
  - Hits at 9, 12, 14 and 19 (Rhodes-like stab and soft boom).
  - 15.0: opens (brighter pad, broken e-piano chords).
  - 20.0: warm bass note.
  - 22.0: percussion out, bed only.
  - 26.0: final Dm(add9) chord, short tail.
- L2, 105 BPM, F major, warm:
  - 0–4: the bed holds one note; hits at 0 and 3.
  - 4.0: break (the beat cuts).
  - 5.0: hit, bed back.
  - 6.0: rhythm begins with a dry-snare pickup into a dry kick/snare/hat groove and warm bass line.
  - Hits at 8, 12, 15 and 21.
  - 16.0: fuller bass note.
  - 22.0: percussion out.
  - 26.0: Fmaj9 closing chord.
- L3, 120 BPM, E minor, dry electronic:
  - Hats and short bass notes from 1 s; hits at 0, 2 and 3.
  - 4.0: E-against-F tension note.
  - 5.0: low thud.
  - 6.0–8.0: dead stop.
  - 8.0: main beat enters (kick, clap, 16th hats, short bass notes).
  - Hits at 10, 17 and 19.
  - 20.0: tension resolves to Cmaj7; 21.0: warm Gmaj9 chord.
  - 22.0: percussion out.
  - 26.0: resolve to E major (add9).
- Every per-row SFX cue in the specs is placed at its row start. This includes paper slap, ticks, camera clicks/shutters, reveal snap, firm and soft clicks, key taps, calendar tick, confirmation click/note, quiet and paper slides, notification pops, copy click, muted metallic tap, mechanical click, send click and two-note accent. Rows marked "Bed continues", "Bed only" or "No extra hit" get no SFX.
- Mix for VO on top:
  - Music bus: compressed and soft-clipped, about -23 dBFS RMS.
  - SFX: loudest peak at -15 dBFS pre-master, each under 0.5 s.
  - Bed: ducked 7 dB inside every VO window, with an 80 ms ramp before the window and a 200 ms release after it.
- Master: gain to -14 LUFS integrated, then a 4×-oversampled look-ahead true-peak limiter with its ceiling at -3 dBTP, verified with ffmpeg ebur128. A -1.5 dBTP ceiling let the AAC encode overshoot to +0.7 dBTP on L2, so the ceiling was lowered. The limiter works on 0.8–1.8 % of samples (single transients, up to about 6–7 dB on the loudest click/kick peaks).
- Bed stem (`<id>-A-bed.wav`, music + SFX, no VO): the same mix at -20 LUFS, so Wayne's VO can sit on top before the final -14 LUFS master.

## Pipeline
- Each video was rendered as the hook-1 opener (frames 0–89) plus the body (90–839), muted. The two were spliced with one re-encode (H.264 High, CRF 17, 30 fps, 1080×1920) and muxed with the master (AAC 256 kb/s, 48 kHz). With hook 1 only, the splice reproduces the single timeline.

## QA of the delivered masters (ffmpeg ebur128 on the mp4's decoded AAC)
| id | duration | integrated | true peak | LRA | hits ±1 frame | A/V-mux lag |
|---|---|---|---|---|---|---|
| A-L1 | 28.0 s, 840 frames | -14.1 LUFS | -2.5 dBTP | 2.0 LU | 6/6 (0.0 ms) | 0 samples |
| A-L2 | 28.0 s, 840 frames | -14.0 LUFS | -1.5 dBTP | 5.8 LU | 7/7 (max 3.4 ms) | 0 samples |
| A-L3 | 28.0 s, 840 frames | -14.1 LUFS | -2.9 dBTP | 5.1 LU | 9/9 (max 0.3 ms; 8.0 is the music downbeat) | 0 samples |

- Every SFX cue starts within 5.3 ms of its row time.
- Bed stems: -20.0 LUFS; true peak -3.0 (L1), -2.5 (L2), -2.3 (L3) dBTP.
- The checker overlay was run on all 27 contact-sheet frames: no text under 44 px, no clipped or overlapping text, no visuals in the subtitle band.
- Not verified by ear: the sound design was checked only by levels, structure (per-half-second RMS shows the gaps and drops at the spec times) and onset timing. Wayne should listen to one of the three before posting.

## Motion pass (2026-10-15, "Always alive" rule)
Improved in place: same story, beats, timings, layout, text, palettes, fonts, VO windows and audio. Every SFX and music cue is untouched; the master wavs and `<id>-A-bed.wav` stems are byte-identical, so only the three `.mp4` masters were replaced on `renders`. No house-style elements were added: the ChatGPT look stays as it was, and only the way things move changed.

**Measure** (`aplus/energy.py`): luma at 270×480, mean absolute frame-to-frame difference (0–255), averaged per 0.5 s window. A window is *static* below 0.35. That threshold is the energy of the slow drift-push holds in lane B, the slowest motion we already treat as alive.

| id | static windows before → after | lowest window before → after | longest frozen run before → after |
|---|---|---|---|
| A-L1 | 38 → 0 | 0.000 → 0.383 (9.5 s) | 1.13 s → 0 |
| A-L2 | 34 → 0 | 0.000 → 0.392 (8.5 s) | 1.17 s → 0 |
| A-L3 | 37 → 0 | 0.000 → 0.364 (26.5 s) | 0.77 s → 0 |

Before the pass, every x.5 window was dead: each row moved in its first ~0.45 s and then froze.

**What moves now** (`aplus/src/alive.tsx`, used by `lib.tsx` and the three scenes):
- **Headlines** go word by word. New words spring up 4 frames apart (closed-form spring, ~12 % overshoot, directional motion blur from velocity). Changed words leave on a 1-frame stagger with a rise, fade and blur, so the exit finishes before the next row reads. Unchanged lines still hold. Emphasis words get a kinetic pop, a stretch that overshoots in scale only, from the cap line: L1 PROVE, UNDERNEATH?, DOCUMENTED, RECORD; L2 WHICH, JUDGE, WORK, MORE, CONNECTED, UNTIL; L3 GUESS, ANSWER?, MISSING?, BRAND, MOST?. There is no pop on the t = 0 hook line, whose first words are already landing on frame 0. Held headlines float 2–10 px vertically, never sideways, so the left edge stays on x 96.
- **Subtitles** (same font, size, colour, shadow and band) reveal per word in reading order across the spoken part of each VO window, weighted by word length to track a ~3 words/s read. They leave with a short staggered rise that ends exactly on the window end, so the VO windows are unchanged.
- **Values** reveal per character for Plex Mono strings (dates, URLs, L3 part/brand, requester labels, PARTS REGISTRY, "FuelMyBuild" titles) and per word for UI strings (part, brand, garage, follow lines). L2's "Miata" exits per character.
- **Drawn lines draw on:** L1's blank-panel rules (staggered at 0 s), L2's selection outline (stroke draws at 2.0 s, then moves as before), and L3's rule under PARTS (8.05 s). The existing joining lines, arrows, strike and ruled job-card lines already drew on.
- **Motion blur on fast moves:** every track now carries its velocity. Moves faster than ~3 px/frame get a directional SVG Gaussian blur along the move, capped at 16 px. Zero-length (hard-cut) keyframes are applied to the previous frame too, so the spec's hard cuts (L2 15 s, L3 8 s and 18 s) never blur.
- **Holds keep living:**
  - Car photos: Ken Burns *inside* the fixed frame (zoom breathes 0–6 %, the subject pans ±22 px) plus a faint light sweep, so the frame edges and layout don't move.
  - Cut-outs (brake kit, turbo kit): gentle sway (±2–3°, ±10–16 px bob, 3–5 % breathing).
  - Cards (L1 paper record, L2 job card and build page, L3 mockup and record): slow float plus a light sweep. Fields, tags, rules and thumbnails ride their card's float, so nothing slides against its card.
  - L3 comment bubbles bob.
  - Short slow pushes on the hero kit where a hold had nothing else (L1 8.45–10 s, L2 8.35–9 s, L3 11.45–14 s). Each is handed back during the next move, so the scale never jumps.
  - A stage camera breathe (scale 1.000–1.014 about 540,800, ±5 px drift) runs under the headline. From 24 s in L2 and L3 it grows to 2× through the closing hold. Text that sits on x 96 (follow lines, L3's empty BRAND slot) and the L3 link bubble are counter-transformed (`Unstage`) so they stay inside the safe box.
- **Spec "hold" and "freeze" rows** (L1 1–2 s hold and 27–28 s freeze, L2 0–4 s, L3 4–6 s): no new element appears and nothing is added to the story, but they now carry idle drift, per Wayne's 2026-10-14 rule that supersedes "nothing moves" from §2.
- remocn: the mask-reveal-up headline is replaced by per-word springs (same rise and blur feel). caption-subtitle is replaced by a per-word reveal. value-swap, strikethrough-replace, caret and drift are kept.

**Checks**
- Delivered mp4s: all three are 28.000 s, 840 frames, 1080×1920 at 30 fps. Mux lag 0 samples, every hit within ±1 frame (max cue offset 3.6 / 4.9 / 5.3 ms).
- Loudness (unchanged audio): A-L1 -14.1 LUFS, -2.5 dBTP; A-L2 -14.0 LUFS, -1.5 dBTP; A-L3 -14.1 LUFS, -2.9 dBTP.
- Review stills:
  - ~110 targeted checker stills (25–30 per video around every changed beat, plus fix re-checks) and a checker sweep every 0.25 s (112 frames per video).
  - New issues found and fixed: pop overshoot leaving the safe box and touching the next word; outgoing headline words ghosting under incoming ones; edge text pushed out by the camera; the L3 link bubble crossing x 880.
  - The sweep's 12 remaining hits are all mid-move transients in the first 2–10 frames of existing tweens and exits (L1 5.3/5.6/18.1 s, L2 5.3/9.1/17.3/21.1 s, L3 2.1/6.3/16.3/19.1/21.1 s). The original code flags the same 12 frames.
  - 24 frames pulled from the delivered mp4s were reviewed. Final sheets were regenerated (`storyboard/A-L*/A-L*-final-sheet.png`).
- Render: hook (0–89) and body (90–839) rendered separately, then spliced and muxed with `finish.sh` as before.
