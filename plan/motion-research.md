# Motion upgrade: research and plan (2026-10-17)

**Problem (Wayne):** things just appear instead of flowing, transitions don't carry the story, text doesn't flow, and the screen is unbalanced (too much or too little of visuals, text and motion), so the viewer misses the gist.

**What we have now:** the W44 lab films (`weeks/2026-W44/lab/A/aplus`, `B/film`, `C/v3film`) already animate everything. Each one rebuilds the same tools: a damped `spring`, directional SVG motion blur (`MBDefs`/`mb`/`mblur`), kinetic text (`KText`, `Headline`), idle life (`idle`, `wob`, `Sweep`/`Sheen`), and its own ports of remocn's `zoom-blur`, `whip-pan`, `push-through` and `focus-pull`. Two problems follow from that:
1. **Transitions are generic.** `kit/remotion/src/Reel.tsx` alternates zoomBlur, whipPan and pushThrough on 14 cuts. None of them knows what is on screen, so the cut never says "this object becomes that scene".
2. **Text belongs to each scene.** Headlines live inside a scene, so they're born and die at the cut. They can't flow across a cut or hand a word to the next beat.

This plan answers both: transitions that take **anchors** (the rect or point of the object we talk about), a **text layer above the cuts**, and one shared `kit/motion/` module. Three of the transitions are prototyped and render (section 6).

---

## 1. Resource shortlist

Reachability from this environment: **npm works** (`npm view @remotion/transitions version` returns 4.0.536; the lab pins 4.0.534). **raw.githubusercontent.com works** (HTTP 200). **api.github.com returned 403** through the proxy, so use raw URLs or `npm pack` to read source.

### Remotion packages (pin exact versions; every `remotion`/`@remotion/*` package must use the same version)
| Resource | Licence | Good for |
|---|---|---|
| [`@remotion/transitions`](https://www.remotion.dev/docs/transitions) | Remotion License (package.json says "UNLICENSED") | `TransitionSeries`, `linearTiming`/`springTiming`, custom presentations (our signature transitions plug in here), `TransitionSeries.Overlay` (an element centred on a cut without shortening the scenes, e.g. a flash or a carried object). Built-in presentations in 4.0.534: fade, slide, wipe, flip, clockWipe, iris, none, plus newer ones (zoom-blur, blur-slide, push-cut, cross-zoom, crosswarp, dreamy-zoom, film-burn, ripple, swap, book-flip, linear-blur, dissolve, zoom-in-out). Several of the newer ones are HTML-in-canvas shaders, so test them under our headless shell before relying on them. **Needs React 19:** its index imports React 19 internals, and the bundle fails on React 18.3.1, which all lab projects pin (lab B only imported its types, so it never hit this). |
| [`@remotion/motion-blur`](https://www.remotion.dev/docs/motion-blur) | MIT | `<CameraMotionBlur shutterAngle samples>`: real multi-sample blur for whips and fast pushes. It renders the subtree `samples` times, so wrap only the transition window (the prototype does this; 7 s rendered in 68 s on 4 cores). `<Trail>` gives echo trails. |
| [`@remotion/paths`](https://www.remotion.dev/docs/paths) | MIT | `evolvePath` (draw-on lines), `interpolatePath` (shape morphs), `getPointAtLength`/`getTangentAtLength` (objects that ride a path), `getBoundingBox`. |
| [`@remotion/noise`](https://www.remotion.dev/docs/noise) | MIT | `noise2D/3D`: deterministic organic drift for idle life, replacing our hand-written sinusoids (no lockstep, no visible period). |
| [`@remotion/shapes`](https://www.remotion.dev/docs/shapes) | MIT | `makeRect/makeCircle/...` paths that feed `interpolatePath` morphs and clip masks. |
| [`@remotion/layout-utils`](https://www.remotion.dev/docs/layout-utils) | MIT | `measureText`/`fitText` for word layout. Note that it ignores `font-variation-settings` (Inter opsz 32), so the prototype measures in the DOM with the full style. |
| [`@remotion/captions`](https://www.remotion.dev/docs/captions) | MIT | `createTikTokStyleCaptions` paging from words.json, a good base for headline beats. |
| [`@remotion/lottie`](https://www.remotion.dev/docs/lottie) | Remotion License | Frame-accurate Lottie playback (`<Lottie animationData>`), for icon and illustration moments. |
| [`@remotion/sfx`](https://www.remotion.dev/docs/sfx) | MIT (package) | Has `whoosh`, `whip`, `pageTurn`, `uiSwitch`, `mouseClick`, `shutterModern`, `ding`. Most other entries are meme sounds (vine boom and similar), which are off-brand. The source of each sound wasn't verified, so check before shipping; our synthesised SFX remain the default. |
| `@remotion/light-leaks` | Remotion License | Probably off-brand (house style bans glow washes). Skip. |

**Remotion licence:** free for individuals and for-profit companies with **up to 3 employees**; 4+ need a company licence ($25/seat/month for creators) ([licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md), [FAQ](https://www.remotion.dev/docs/license/faq), [pricing](https://www.remotion.dev/docs/pricing)). This already applies to our use of `remotion` itself. **Wayne should confirm FuelMyBuild's headcount.** The terms change in Remotion 5.0.

### Motion libraries and assets
| Resource | Licence | Good for |
|---|---|---|
| [remocn](https://github.com/Remocn/remocn) (already in use, `.claude/skills/motion/references/remocn-catalog.md`) | MIT (copy in `references/REMOCN-LICENSE.txt`) | 200+ pieces. Most useful for this upgrade: transitions `push-through`, `focus-pull`, `lens-zoom`, `zoom-blur`, `slide-swap`, `spring-settle`; typography `mask-reveal-up`, `kinetic-center-build`, `inline-pill-takeover`, `shared-axis-y/z`, `per-word-crossfade`, `blur-out-up`, `inline-word-roll`, `period-drop`, `path-ride`; captions `caption-rise`, `caption-weight`, `caption-dim-progress`; layout `stage`, `drift`. Copy source; keep the licence file. |
| [gl-transitions](https://github.com/gl-transitions/gl-transitions) ([npm](https://npmjs.com/package/gl-transitions)) | MIT repo; each shader carries its own author/licence header | GLSL source for morph, directional warp, crosswarp and others. Remotion's docs recommend porting them and crediting the author plus licence above the shader ([Remotion: custom presentation](https://www.remotion.dev/docs/contributing/presentation)). Use sparingly: most look "video editor". |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | MIT (README; attribution appreciated) | 81 Remotion snippets: transitions (iris, clock wipe, blinds, morph, zoom-through), charts, counters, card flip, notification pop. Reference code, not house style. |
| [ashad001/remotion-transitions](https://www.skills.sh/ashad001/remotion-transitions/remotion-transitions) | MIT (LICENSE checked) | 6 transitions with full source. Worth reading. |
| [lucide-animated (pqoqubbw/icons)](https://lucide-animated.com/index.md) | MIT; Lucide base ISC | 350+ animated icon designs. They animate with Framer Motion (time-based), so port the paths and choreography to frame-driven code; don't import the components. |
| [lottie-web](https://www.npmjs.com/package/lottie-web), [dotlottie-web](https://www.npmjs.com/package/@lottiefiles/dotlottie-web) | MIT | Players (`@remotion/lottie` uses lottie-web). |
| [LottieFiles free animations](https://help.lottiefiles.com/animation-licensing-basics-) | Lottie Simple License, but **varies by creator** ([AE docs](https://docs.lottiefiles.com/en/integrations/after-effects/02_explore/premium-animations.md)) | Commercial use OK and attribution not required under the Simple License, but you can't redistribute the raw files, and the licence text has a same-terms condition ([quoted text](https://doc.qt.io/QT-6/qtlottieanimation-attribution-user-interface.html)). Check each file's page and log creator, URL and licence in the project. Prefer our own drawn SVG for brand pieces. |
| [flubber](https://www.npmjs.com/package/flubber) | MIT | Robust morphs between very different shapes (receipt → phone card) where `interpolatePath` needs matched point counts. |
| [culori](https://www.npmjs.com/package/culori) | MIT | Perceptual (OKLCH) colour mixes for ink → red emphasis. Optional. |

### Techniques from top short-form ads (craft, not assets)
- **Kinetic typography in sync with speech:** one animated heading per screen and consistent easing curves ([LottieFiles trends](https://lottiefiles.com/blog/inspiration/animation-and-motion-design-trends), [Pixflow 2025](https://pixflow.net/blog/top-video-editing-trends-2025/)). Our version: key words only, landing on their spoken frame.
- **Vertical-first moves:** design for 9:16 with centred text and close framing, because a cropped horizontal transition looks wrong ([AutoAE 2026](https://autoae.online/blog/motion-graphics-trends-2026)). Prefer vertical and depth moves (push, pull, rise) over long lateral ones.
- **Match cut:** same shape, position or motion vector across two shots (wheel → gauge, receipt → phone card). The eye keeps tracking, so the cut feels invisible.
- **Morph cut / shape morph:** one outline becomes another. This is our "old way → FuelMyBuild" device.
- **Mask reveal / object wipe:** the next scene shows through a shape or behind a moving object (car drive-by, hand, card edge).
- **Parallax depth:** 2–3 layers at different speeds (photo, cutout, text) during a push. Cheap depth on a flat canvas.
- **Camera moves:** push-in for focus, pull-back for context, whip for a jump in place or time, rack focus for calm.
- **Sound-led cuts:** cut to silence before a reveal, and let a whoosh or tick land on the exact cut frame.

---

## 2. Signature transitions for FuelMyBuild (10)

Durations are in seconds, with frames at our 60 fps master in brackets. Every transition takes **anchors** (named rects or points that scenes export, e.g. `part.tile`) instead of magic numbers. That's how the object we talk about becomes the next scene. Easing names refer to `EASE` in `kit/motion` (section 5): `camera` = bezier(.65,0,.25,1), `out` = bezier(.22,1,.36,1), `in` = bezier(.64,0,.78,0), `whip` = bezier(.7,0,.2,1).

| # | Name | What it does | Story function, when to use | How to build (Remotion) | Duration and easing | Sound cue |
|---|---|---|---|---|---|---|
| 1 | **Portal** ✅ prototyped | The camera flies into an object (tile, photo, phone screen) while the next scene opens out of that object's rect, corners relaxing to square. Headline words push past the lens. **Reverse = Pull-back:** the scene shrinks into a tile inside a bigger context. | **Zoom into detail** (part → install photo, car → build page). Reverse: **reveal of scale/context** ("and that's just one of 40 builds"). | Custom `TransitionPresentation`: entering = animated `clip-path: inset(... round r)` from the anchor rect to full frame, plus scale 1.18 → 1 about the rect centre. Exiting = translate+scale so the rect tracks the opening window, blur 0 → 8 px. FlowText exit mode `push`. | 0.55–0.7 s [33–42]; `camera` | Low air whoosh that rises into the cut, plus a soft "thup" as the corners square |
| 2 | **Match cut** | Hard cut where shape, position and size match across scenes (round turbo inlet → round gauge; side profile → same profile in a photo). A camera move continues across the cut, so it reads as one shot. | **Time jump / before → after** on the same object, or **cause → effect**. | Both scenes export the same anchor. The kit aligns scene B's camera so B's anchor lands on A's anchor at the cut, then eases B's camera home. Continuous push of 2–3 % scale across the cut. A 1-frame white flash at 15 % via `TransitionSeries.Overlay` is optional. | Cut is 0 frames; continuity move 0.4 s [24] `out` | Tick or click exactly on the cut frame; music hit if it's a time jump |
| 3 | **Whip carry** ✅ prototyped | Fast lateral camera whip with real camera motion blur. The incoming scene lands with a small overshoot settle; leaving headline words get flung in the whip direction. | **Next item or place** (shop → owner → buyer), list beats, re-hooks. **Use at most twice per video.** | Custom presentation (translateX with `whip` easing, 4 % overshoot on entering) plus `<CameraMotionBlur shutterAngle={200} samples={10}>` around the series only during the window. FlowText exit `left`/`right`. | 0.35–0.45 s [21–27]; `whip` | Whip/whoosh panned in the move direction; small thud on landing |
| 4 | **Word carry** ✅ prototyped | One key word from the headline survives the cut and travels (on an arc, growing or shrinking, turning red) into its place in the next scene: a label, a field, a chip. The other words leave with the transition. | **Topic hand-off / keep the thread:** "This one went on a **Supra**" → Supra label under the car. Best text-led transition; pairs with 1, 3 and 7. | FlowText layer **above** the TransitionSeries: `carry: { i, at, dur, to: {x,y,size} }`. Spring 150/19 position, arc height 80 px, colour ink → `#F43034`. Target comes from the next scene's anchor. | 0.5–0.65 s [30–40]; spring with light overshoot | Soft "tick-swish", then a key click when it seats in its field |
| 5 | **Object wipe** | A real object crosses the frame (car drive-by, ratchet swing, hand, folder) and its edge is the wipe line. Behind it is the next scene. | **Time jump / chapter** ("three years later", day → night at the shop). | Clip-path polygon whose x follows the object cutout's leading edge. The object is a cutout on its own layer with directional motion blur from velocity (existing `mblur`) and a slight parallax lag. Ease the object, not the wipe. | 0.6–0.8 s [36–48]; `in` then `out` (accelerate through) | Pass-by sound for the object (engine pass, swoosh), Doppler-panned |
| 6 | **Tap-to-open** | A finger tap ripples on a UI card; the card lifts and expands (iOS zoom transition) into the next full-screen scene, keeping the card's corner radius until the end. | **Cause → effect** in product beats (tap the receipt → the record; tap Share → the buyer sees it). | Variant of Portal: anchor = card rect, `springTiming({config:{damping:200}})`, card chrome cross-fades out over the first 30 %. Tap ripple from remocn `cursor`/x-follow-card ripple, ported. | 0.5 s [30]; iOS spring (no overshoot) | iOS tap click, then soft sheet "whoomp" |
| 7 | **Shape morph** | The outline of the old thing (receipt, crumpled folder, notebook page) morphs into the FuelMyBuild card or phone screen, and the content cross-dissolves inside the morphing shape. | **Product turn** (the old way → FuelMyBuild), the "aha" beat. | `@remotion/paths interpolatePath` (or `flubber` when point counts differ) on an SVG `clipPath`. Content layers A/B inside. `@remotion/shapes` for the target rounded rect. | 0.7–0.9 s [42–54]; `camera` | Paper rustle → glassy "ting" as it becomes UI |
| 8 | **Speaker swap (shared axis)** | Two speakers (builder, shop, buyer) are cards with their car as avatar on one horizontal axis. The camera glides along the axis; the outgoing card dims and shrinks to 92 %, the incoming card rises to 100 %, and the speech bubble stays anchored and re-types. | **Switch speaker** / dialogue / two sides of a deal. | `slide` presentation variant on one shared canvas (remocn `slide-swap`/`shared-axis` idea): both scenes in one stage, camera = remocn `stage` keyframes. Bubble text via FlowText per-word crossfade. | 0.45 s [27]; `camera` | Short two-note "handoff" chime, pitched per speaker |
| 9 | **Silence punch** | Music cuts. Half a beat of near stillness (breathing only), then a hard cut to the reveal with a 6 % punch-in that settles in 5 frames, plus a red keyword stamp. | **Reveal / twist** ("it was never logged", "it sold for $14k more"). One per video. | Hard cut + scale 1.06 → 1 with a spring (remocn `lens-zoom` settle, no distortion). Keyword via FlowText emphasis `stamp`. The audio plan carries `silence: [t-0.35, t]`. | 0.35 s silence + cut + 0.15 s settle [21 + 9]; spring 260/22 | Silence → sub "thump" + the word's stamp |
| 10 | **CTA landing** | The final story frame stays (no new layout). Everything else clears in stagger, the frame drifts back 4 %, and the CTA builds in its band: headline word by word, URL typed with red caret, period drop. | **CTA landing** over the last story frame (production standard). | Pull-back (reverse Portal at 30 % strength) on the last scene. FlowText for the CTA; `Typed` for the URL; remocn `period-drop` ported. | Clear 0.3 s [18] `in`; build 1.0–1.4 s | Music resolves; key clicks on the URL; soft "ding" on the period |

Rules across all ten:
- **No transition without a reason.** Pick it by story function (the column above), not by variety. Variety comes from the story.
- **Cut placement:** the cut lands 2–4 frames (at 60 fps) before the first word of the new beat (already in the skill). A transition's midpoint sits on the cut.
- **At most 2 of the "loud" transitions (3, 5, 9) per 30 s.** The rest are 1, 2, 4, 6, 7 or a plain cut with camera continuity.
- **Every transition exports its sound cue** (name, frame, pan) to the timeline, so the audio pipeline places it within one frame.

---

## 3. Visual-density guideline

These are house rules. The reading-speed numbers come from subtitling practice: about 12–17 characters per second, roughly 2.5–3 words per second for a full two-line subtitle ([UCL eye-tracking study](https://discovery-pp.ucl.ac.uk/10050653/1/journal.pone.0199331.pdf), [GoTranscript](https://gotranscript.com/public/exploring-subtitling-eye-tracking-reading-speed-and-best-practices), [md-subs](https://md-subs.com/blog/tis1-reading-speed)). Our headlines are not subtitles: the voice carries the sentence, and the screen carries the **gist**.

**Budget per beat (one beat = one idea, ≈ one spoken sentence)**
| | Normal | Fast cuts (hooks, montage, list) | Calm (reveal, record, emotional beat, CTA) |
|---|---|---|---|
| Shot length | 2.0–3.0 s | 1.2–2.0 s | 3.0–4.5 s |
| Transition length | 0.4–0.7 s | 0.2–0.4 s | 0.6–1.0 s, or a plain cut on silence |
| Focal groups on screen | **max 3**: headline + hero object/UI + 1 support (label, chip, line) | **max 2**: headline + hero | **max 2**, plenty of white |
| Headline words | **≤ 6** (2 lines × ≤ 16 characters at 104–124 px) | **≤ 4** (1 line) | ≤ 6, or a single word |
| Support text (labels, chips, UI copy) | ≤ 4 words each, ≤ 2 items | 0–1 item, ≤ 2 words | ≤ 1 item |
| Red accents | 1 word or 1 element | 1 | 1 |
| Motion starts (anything beginning to move, siblings in a stagger count once) | ≤ 2 per second | ≤ 3 per second | ≤ 1 per second; idle life only during holds |
| Concurrent big moves | 1 (camera *or* hero *or* text) | 1 | 1 |

**Hold times (reading)**
- The headline stays fully readable after its last word lands for at least **max(0.6 s, 0.25 s × word count)**. At 6 words that's 1.5 s.
- Total on screen ≥ **0.3 s × words + 0.6 s**. If the beat is shorter than that, cut words, don't speed up.
- A number or price needs **≥ 1.0 s** of full legibility, and nothing else moves while it holds (idle drift only).
- UI the viewer must read (a record, a card) gets **≥ 1.5 s** in calm mode with only a light sweep, Ken Burns or 3 px float. This replaces "hold completely still" while keeping the always-alive rule.

**When to stay calm**
- During any reveal, number, record or claim the viewer must believe.
- The 0.3–0.5 s before a Silence punch (#9).
- Under the CTA: the story frame drifts, nothing new enters except the CTA.
- At most one loud transition every 15 s. After a loud one, the next cut is quiet (match cut, word carry or plain cut).

**Pace variants:** the same script can render Fast or Normal. Fast trims support text to 0–1 items, drops headlines to ≤ 4 words, moves 1.0 → 0.7 s holds only for non-critical beats (never numbers or records), and shortens transitions by about 40 %. The hook (first 3 s) is always Fast; the body is Normal; reveal and CTA are always Calm. The rhythm comes from that contrast.

**Checks (automate in `kit/motion/lint`):** count focal groups and headline words per beat from the timeline; flag holds below the formula; flag more than 3 motion starts in any 1 s window; keep the existing frame-difference energy check (no window below the static threshold) **and** add an upper bound (flag any 0.5 s window above roughly 3× the reel median as visual noise).

---

## 4. Text-flow guideline (headline text in sync with speech)

1. **Screen the gist, not the transcript.** Each spoken sentence gets a headline of its 2–6 most meaningful words in spoken order ("This one went on a Supra" → full, or "Went on a Supra"). Line 2 in `#86868B` when it's context, ink when it's the point.
2. **Words land on their spoken time.** Each word *starts* rising 3–5 frames (60 fps) before its onset in words.json, so it is readable as it's heard. The rise is a baseline mask (clip-path bottom edge only), 0.95 em of travel, spring 210/20, opacity over 5 frames. No fades from nothing, and no whole-line pops.
3. **Enter from the action.** The rise direction follows where the action is: up out of the baseline by default; from the side the object came from after a whip; out of the object (scale from its rect) after a portal.
4. **Emphasis on the stressed syllable.** The key word turns red (and swells in weight, `caption-weight` style, no layout shift) on the stressed syllable's time, not on the word start. One per beat.
5. **Leave into the next beat.** Exits start 3–8 frames before the cut and take the transition's direction: `push` (grow past the lens) for Portal, `left/right` with Whip, `up` + blur for a plain cut, `into` an anchor when the words become an object. 1.5-frame stagger, 10–12 frames, `in` easing, blur to 10 px. **Nothing outlives its beat by accident, and nothing vanishes in place.**
6. **Carry one word when the thought continues.** If the next beat continues the same subject, carry the keyword (#4) instead of exiting it. At most one carried word per cut.
7. **Text lives above the cuts.** Headlines render on a FlowText layer outside the TransitionSeries, timed in absolute frames. Scenes never own headline text, so text can flow across a cut while the picture changes under it.
8. **Gaps in speech = gaps on screen.** When the voice pauses ≥ 0.4 s mid-thought, hold the headline (with idle drift). When the voice ends a thought, exit. Don't fill silence with new text.
9. **One headline at a time.** The old headline is at ≤ 30 % opacity before any new word reaches 50 %.
10. **Typed moments stay typed:** URLs, search fields and log entries use `Typed` with the red caret at about 26 cps, timed so typing finishes as the voice finishes the phrase.

---

## 5. Implementation plan: `kit/motion/`

**Goal:** one module every project imports, so the three copies of spring, blur and kinetic text in the W44 lab collapse into one. Transitions become anchor-aware, and text becomes a layer above the cuts.

```
kit/motion/
  index.ts            re-exports
  LICENSES.md         remocn MIT, gl-transitions per-shader credits, Lottie sources, Remotion licence note
  time.ts             useT(), seg(), lerp, clamp, spring(f, fps, k, d), EASE {out,in,camera,whip}, fps-aware s→frames
  alive.ts            drift() on @remotion/noise, kenBurns(), Sheen, bump(); replaces lab per/wob/idle
  blur.tsx            MBDefs + mblur(vx,vy) (directional SVG, cheap) and <WhipBlur from to> (CameraMotionBlur on a window)
  anchors.ts          defineAnchors({ tile: {x,y,w,h,r} }), so scenes export where their objects are
  transitions/        portal, pullBack, matchCut, whipCarry, objectWipe, tapOpen, shapeMorph, speakerSwap, silencePunch, ctaLand
                      each = TransitionPresentation factory + `cue` (sfx name, offset, pan) + `textExit` default
  text/
    FlowText.tsx      words-on-voice headline with exit modes + carry (prototype in motionlab)
    Typed.tsx         typewriter with red caret
    measure.ts        DOM measure with Inter opsz (cached)
  film.tsx            <Film> = TransitionSeries of beats + FlowText layer + WhipBlur windows; emits cues.json for audio
  lint.ts             density + hold checks (section 3) for the stills step
  gallery/            one composition per transition (the review reel Wayne sees)
```

**API sketch**
```tsx
import { Film, beat, portal, whipCarry, wordCarry, silencePunch, ctaLand, anchors } from "../../kit/motion";
import words from "./words.json";

export const PartTile = { scene: Scene1, anchors: anchors({ tile: { x: 250, y: 760, w: 580, h: 580, r: 48 } }) };

const beats = [
  beat("part",    { scene: PartTile,     head: { text: "Every part has a story", key: "story" } }),
  beat("install", { scene: InstallPhoto, enter: portal({ from: "part.tile" }),
                    head: { text: "This one went on a Supra", key: "Supra", carry: { word: "Supra", to: "car.label" } } }),
  beat("car",     { scene: CarSide,      enter: whipCarry({ dir: "left" }), head: { text: "Now it's on the record", key: "record" } }),
  beat("reveal",  { scene: Record,       enter: silencePunch(), pace: "calm" }),
  beat("cta",     { scene: Record,       enter: ctaLand({ url: "fuelmybuild.com" }) }),
];

export const Reel = () => <Film fps={60} words={words} beats={beats} pace="normal" />;
// <Film> places each cut 3 frames before the beat's first word, derives headline word times from words.json,
// resolves anchors, wraps whip windows in CameraMotionBlur, writes out/cues.json (sfx + silence windows) for audio.py,
// and lint() reports density/hold violations before any full render.
```

**Rollout**
1. **Platform bump (half a day).** Move kit and new projects to React 19.1 with exact-pinned `remotion`/`@remotion/*` versions (use `"4.0.534"`, not `^`; carets pulled renderer 4.0.536 next to bundler 4.0.534 in the prototype and Remotion warned). Check that one existing lab film still renders the same.
2. **Extract core (1 day).** Lift `time`/`alive`/`blur`/`Typed`/`DrawPath` from `C/v3film/src/lib/{core,motion}.tsx` and `A/aplus/src/alive.tsx` into `kit/motion`. Delete the duplicates in new work (leave the W44 lab untouched).
3. **Port the prototypes (1 day).** Portal, Whip carry, Word carry/FlowText from `motionlab/src/kit/motion.tsx`; add anchors and cues.
4. **Build the other 7 (2–3 days),** each with a 3–4 s gallery strip. Render the gallery for Wayne's approval (artifact page with clips and the table from section 2).
5. **`<Film>` + `lint` (1–2 days),** wired to words.json and to `audio.py` via cues.json.
6. **Skill update.** Point `.claude/skills/motion/SKILL.md` at `kit/motion` and this guideline. First production use on the next week's reel, then compare retention in analytics.

---

## 6. Prototype (works)

Scratch project: `/tmp/claude-0/-home-user-fmb-studio/19726ae0-4b0b-55b8-beec-a2335b901467/scratchpad/motionlab` (not committed; it survived the container restart and the render was re-checked: 210 frames, 1080×1920).
- `src/kit/motion.tsx`: `portal()` and `whip()` presentations, `FlowText` (voice-timed baseline-mask rise, exit modes `push/left/right/up/into`, word `carry`), `DrawLine` (`@remotion/paths` `evolvePath`), `drift` (`@remotion/noise`).
- `src/index.tsx`: 7 s strip. Turbo tile → **Portal** into the install photo (headline pushes past the lens) → **Whip** with `CameraMotionBlur` to the Supra side view, while **"Supra" carries** from the headline into the label under the car → leader line draws on → "Now it's on the record" with "record" in red.
- Render: `node render.mjs` → **`/tmp/claude-0/-home-user-fmb-studio/19726ae0-4b0b-55b8-beec-a2335b901467/scratchpad/motionlab/out/strip.mp4`** (1080×1920, 30 fps, 7 s, 68 s render on 4 cores). Contact sheet: `.../motionlab/out/strip-sheet.png`.
- Findings: (a) `@remotion/transitions` needs **React 19**. (b) Text must sit above the series to carry across cuts. (c) Words exiting `into` a point cross each other and look messy; `push` (scale away from the focus point) reads as one camera move. (d) Frame 0 is empty in the prototype; production hooks must show the hero on frame 0.

Sources: [Remotion licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) · [Remotion pricing](https://www.remotion.dev/docs/pricing) · [Licence FAQ](https://www.remotion.dev/docs/license/faq) · [Transitions presentations](https://www.remotion.dev/docs/transitions/presentations) · [Custom presentation](https://www.remotion.dev/docs/contributing/presentation) · [Crosswarp (gl-transitions port)](https://www.remotion.dev/docs/transitions/presentations/crosswarp) · [gl-transitions](https://github.com/gl-transitions/gl-transitions) · [remotion-templates](https://github.com/reactvideoeditor/remotion-templates) · [remotion-transitions skill](https://www.skills.sh/ashad001/remotion-transitions/remotion-transitions) · [LottieFiles licensing](https://help.lottiefiles.com/animation-licensing-basics-) · [LottieFiles premium/free terms](https://docs.lottiefiles.com/en/integrations/after-effects/02_explore/premium-animations.md) · [Lottie Simple License text (Qt)](https://doc.qt.io/QT-6/qtlottieanimation-attribution-user-interface.html) · [lucide-animated](https://lucide-animated.com/index.md) · [LottieFiles motion trends](https://lottiefiles.com/blog/inspiration/animation-and-motion-design-trends) · [Pixflow 2025 trends](https://pixflow.net/blog/top-video-editing-trends-2025/) · [AutoAE 2026 trends](https://autoae.online/blog/motion-graphics-trends-2026) · [UCL subtitle speed study](https://discovery-pp.ucl.ac.uk/10050653/1/journal.pone.0199331.pdf) · [GoTranscript reading speed](https://gotranscript.com/public/exploring-subtitling-eye-tracking-reading-speed-and-best-practices) · [md-subs reading speed](https://md-subs.com/blog/tis1-reading-speed)
