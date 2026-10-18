# W44 sprint: production masters of the 9 lab reels

Remotion 4.0.534 (exact pins) + React 19.1, 1080x1920, 30 fps. One project for all nine reels; compositions are
`<id>-<hook>` (A-L1..3, B-L1..3, C3-COL/GAR/SUP x hooks A/B/C).

- `./prep.sh` fills `public/` (git-ignored): image bank v2, the legacy Evo cutout, the 7 story-specific W44 lab photos,
  fonts, and the eleven_v4 VO from the `renders` branch. `src/vo/<id>/*.json` are the word timings (copied from
  weeks/2026-W44/lab/vo). Every cut and headline word is looked up by spoken word (`tl.at("word", n)`), so a VO
  re-render retimes the films without code changes as long as the wording stays the same.
- `src/kit.tsx`: voice timeline (hook B/C openers spliced onto the body), shots with object-led transitions (portal,
  match cut, whip carry, object wipe, tap-to-open, silence punch, rise, pull-back), FlowText headlines above the cuts
  (words land on their spoken time, leave into the next beat, word carry, period-drop), bank image components.
- `src/reels/laneA.tsx` (A+ look), `src/reels/laneB.tsx` (house look, also used by C3), one file per reel.
- `node stills.mjs <id> <hook> <t1,t2|auto:N> [check]` renders stills; `check` adds the review overlay (text < 40 px,
  outside the safe box, overlaps). `python3 -I beats.py <id>` gives one storyboard time per spoken sentence;
  `python3 -I sheet.py <dir> <out.jpg> "<title>" [cols]` makes a contact sheet.

## Sources and licences
- remocn (MIT, `LICENSE-remocn.txt`): ideas ported to frame-driven code (blur-out-up, period-drop, typewriter caret,
  marker-highlight, focus-blur-resolve, caption-split-flap, lens-zoom settle, path-ride, shared-axis, simulated-cursor
  ripple, micro-scale-fade, strikethrough-replace, inline-highlight, squiggle). No remocn files are copied verbatim.
- @remotion/noise, @remotion/paths (MIT). Remotion licence: free tier (FuelMyBuild is a one-person company).
- Images: kit/remotion/public/img/bank (ChatGPT image bank v2, made for FuelMyBuild), plus legacy car-14 (Evo, not in the
  bank) and kit/remotion/public/img/lab b-* photos (W44 lab pack) where the bank has no shot of the story's car and job.
- Fonts: Inter (OFL), Barlow Condensed (OFL), Source Sans 3 (OFL), IBM Plex Mono (OFL).
