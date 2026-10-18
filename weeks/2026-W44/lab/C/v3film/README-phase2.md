# Lab C v3, phase 2: build notes (C3-COL, C3-GAR, C3-SUP, hook A)

Masters on the `renders` branch: `2026-W44/lab/<id>-A.mp4` (1080x1920, 30 fps, H.264 High, AAC 48 kHz 256k, 27.0 s),
`<id>-A-bed.wav` (music + SFX at mix level, VO-ready) and `<id>-A-sfx.wav` (no-music stem: SFX + room tone).
Final sheets: `../v3storyboard/<id>-final-sheet.jpg` (12 stills from each master). No VO yet: Wayne records to `../v3-vo-script.md`.

## Rebuild
```
python3 timeline.py                      # timelines (VO windows, events, every SFX cue incl. phase-2 action cues, music plan)
node render.mjs C3-COL,C3-GAR,C3-SUP     # hook A opener (frames 0-53) + body (54-809), silent
./assemble.sh C3-COL                     # score/mix/master, splice (one re-encode), mux, sheet, loudness + true-peak gate, motion check
```

## When Wayne's images land (one line each in `src/assets.tsx`, then re-render that reel)
| image | line in `IMG` | reel | also check |
|---|---|---|---|
| c3-check-presenter.png | `checkPresenter` | COL | nothing |
| c3-evo-intake-install.jpg | `evoIntakePhoto` | COL | nothing |
| c3-counter-bell.png | `counterBell` | GAR | nothing |
| c3-r34-head-weep.jpg | `r34WeepPhoto` | GAR | `WEEP` (where the gasket line is; the 16 s push eases toward it) |
| c3-hang-tag-manila.png | `hangTag` | SUP | `TAG_AR` (stretch ratio) |
| c3-wrx-exhaust-underside.jpg | `wrxUndersidePhoto` | SUP | `HANGER` (the "Check first" tag ties there) |
Until then: the three cutouts are drawn in SVG; the three photos are composed from kit images (supra-turbo bay + intake cutout;
engine-block texture + drawn seam and weep; drawn floor pan + exhaust cutout + drawn rubber hanger), each marked "Illustrative example".
Re-render only the affected reel: `node render.mjs C3-GAR && ./assemble.sh C3-GAR`, then push a new render commit.

## Always alive (Wayne, 2026-10-14)
- Text: every label, card field, chip, pill, CTA and subtitle animates in per word or per character (springs with overshoot,
  3-4 frame staggers, a short blur), emphasis words pop on their spoken time (scale + weight + red), and every line leaves with
  blur-out-up. URLs type with a red caret. Drawn lines draw on (leader line, measure lines, car outline, tie-on string, tag loops).
- Holds: loop-safe camera breathing (whole cycles in 27 s, so the last frame flows into frame 0), parallax (COL Evo at 12 %),
  pennant ripple, exhaust pendulum and tag flutter, bell gleam, light sweeps on the card and monitor glass, Ken Burns on photos,
  stalled THU flaps that twitch. Motion blur (directional SVG blur from velocity) on glides, slides, falls and the monitor.
- Physical beats: split-flap leaves slap down and bounce, tags fly in, land in two paper poses and swing, the pipe sags on springs,
  the check presenter winds up and slams (ticks ripple out along the ruler), flags dip before lifting and snap after planting.

Motion check (`motion_check.py`: mean absolute luma change between consecutive frames, 540x960, per 0.5 s window):
| reel | lowest 0.5 s window | lowest sliding window | median window | near-identical frame runs | loop seam |
|---|---|---|---|---|---|
| C3-COL | 0.231 (10.0-10.5 s) | 0.205 | 0.703 | 0 | 0.383 |
| C3-GAR | 0.322 (3.0-3.5 s) | 0.307 | 0.871 | 0 | 0.379 |
| C3-SUP | 0.209 (17.0-17.5 s) | 0.202 | 1.055 | 0 | 0.831 |

## Sound
Score per reel (synthesized, original): COL D minor 96 bpm warm (rim, shaker, plucks); GAR A minor 92 bpm observant (felt keys);
SUP C minor 100 bpm investigate (pizz). Tape stop into each turn, silence under the record (SUP thins to one held note), back on
the return downbeat. Room tone under everything (restaurant / shop / support desk). One sound per on-screen action: 134 / 94 / 111
cues (flap clatter per flap, bell strike and ring-out, paper landings in two poses, pen and pencil scratch, string creaks and snaps,
ruler ticks as the read-head passes each tick, pennant snaps, key clicks for typed URLs, pops for emphasis words). Each cue
synthesized alone lands within one frame of its event (`CUECHECK=1 python3 audio/score.py <id> out/audio`), except two intended
swells. Music ducks 7 dB under every VO window. Master: -14 LUFS target, band-limited at 16 kHz, true-peak limited, then an
AAC encode/decode loop dips any overshoot; `assemble.sh` refuses a master above -1 dBTP measured on the muxed file.
| reel | integrated | true peak (AAC, muxed) | LRA |
|---|---|---|---|
| C3-COL | -14.1 LUFS | -1.6 dBTP | 3.9 LU |
| C3-GAR | -14.4 LUFS | -1.4 dBTP | 7.3 LU |
| C3-SUP | -14.2 LUFS | -1.1 dBTP | 3.6 LU |
Nobody has listened yet: Wayne, please listen to one reel before posting (new sound design).

## remocn per reel (all ported to pure functions of t; MIT, see LICENSE-remocn.txt)
- COL: stage, speed-lines, mask-reveal-up, caption-rise (phase 1); new in phase 2: spring-scale-in, caption-active-pop,
  blur-out-up, trim-burst, drift, typewriter.
- GAR: caption-split-flap, staggered-fade-up, micro-scale-fade, caption-dim-progress (phase 1); new: lens-zoom, shimmer-sweep,
  caption-weight, per-character-rise, spring-scale-in, blur-out-up, typewriter, trim-burst.
- SUP: paper-sticker, caption-handwrite, soft-blur-in, caption-underline (phase 1); new: path-ride, value-swap, inline-highlight,
  spring-scale-in, blur-out-up, typewriter.

## Deviations and open items
- The scripts asked for the record to "hold completely still for 3.0 s"; Wayne's always-alive rule replaces that: the card text
  is static and legible, while the card floats 3 px, a light sweep crosses it, and the photo eases (Ken Burns).
- SUP ticket chip now counts Day 1 -> 2 -> 4 -> 6 -> 1 (value-swap); the script only said the chips "return to Day 1".
- GAR punch-ins keep the 1-frame cut and add a 5-frame lens settle.
- Past-dated log entry (C3-COL, Jun 14, 2019): resolved, state/learnings.md lists past dates as live (Wayne, 2026-10-14).
- Word times are estimates; after Wayne records, replace the `words` in timeline.py with the real words.json and re-render.
