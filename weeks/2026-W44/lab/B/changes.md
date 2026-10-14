# Lane B (W44): build notes and deviations from ChatGPT's specs

Built from `B-specs.md` (B-L1, B-L2, B-L3, hook A only). Each video follows ChatGPT's beats, seconds, on-screen text and story. Every row's on-screen text appears in the headline band on that row's second, and every listed sound fires on its second. This file logs where the build departs from a literal reading, and why.

Code: `film/` (Remotion + remocn; `src/L1.tsx`, `L2.tsx`, `L3.tsx`, shared `lib.tsx` and `fmb.tsx`, timings in `src/data/<id>.json`, audio in `film/audio/score.py`).

## Needs Wayne before posting
- **B-L2 shows garage and contributor attribution ("Garage · Shop B", "Contributor · Eli") as FuelMyBuild fields.** Resolved 2026-10-14: attribution is listed as live in the W42 brief and now in `state/learnings.md`, so no change is needed.
- No VO yet. Wayne records to `vo-script.md`; the masters carry music, SFX and burned-in subtitles only.

## Shared (all three)
- **Enlarged record fields instead of a readable miniature phone** (ChatGPT asks for this): the phone stays small and dims, and the active parts row, brand field, log entry or attribution lifts out as a native-size card (row titles 58 px, brand 54 px). The phone is context; the card is what you read.
- **On-screen text vs subtitles:** the spec's on-screen column runs in the headline band (y 260–420, auto-fitted to x 96–984, 64–112 px). The VO lines are burned in separately as subtitles on a white plate, bottom edge at y 1530 (bottom 360 px clear), shown only inside each line's VO window. Red marks only the spec's emphasis words.
- **"Illustrative example"** sits on every frame at y 196–236 in #86868B, 32 px. Demo URLs are labelled "demo URL" in the UI. All people, shops, brands ("Demo Brand A/B/…") and accounts are fictional.
- **Install photos are illustrative composites made from studio cutouts.** No real photos exist, so a "before / during / after" set is the same cutout at a matching angle: worn (desaturated), with a gloved hand (during), clean (after). L2 uses the engine block, the car lift and the finished car. L3 uses the turbo with vacuum lines, the wastegate and the kit.
- **"Enlarge the log's photo area":** the photo strip lifts out into a full-height triptych instead of a camera zoom into the card. In the stills, the camera zoom pushed the card's title into the headline band.
- **Product-window mask:** shots with big camera pushes are soft-masked to y 440–1436, so nothing crosses the headline band or the subtitles.
- **CTA:** a red "Follow" pill pops just below the headline band, gets tapped and turns to "Following". The record beneath stays visible, so the camera lowers the content about 110 px for the CTA seconds.
- **Cuts on the second:** with no VO yet there's no words.json, so cuts and actions sit on the spec's row seconds, and the VO is recorded to those windows (`vo-script.md`).
- **30 fps** (the brief's master spec) rather than the motion skill's 60 fps default.
- **Hook A only:** the 0–2 s opener is rendered as its own range and spliced onto the 2–30 s body (concat, one re-encode), per the motion skill.

## B-L1 · The work the photo misses
- 1–2 "Open the attached exterior photo": a shared-element expansion from the inquiry's attachment thumbnail into the full photo.
- 4–5 "Show the caliper through the wheel": the 240Z cutout can't show a caliper through its spokes, so a red-rimmed circular loupe with the brake-kit cutout's caliper opens over the front wheel. It closes when the camera pulls back at 5.0.
- 5–6 "Pull back to the photo's edges": the crop eases out and a grey outline traces the photo's edges. No installation detail anywhere.
- 7–8 "Freeze the gallery; the gap is explicit": the gallery collapses to three exterior thumbnails above an empty dashed "Install photos: No photos of the work" slot.
- 8–13 wheel-off illustration: the brake-kit cutout labelled "Illustration · wheel off". A red ring and a label isolate the caliper, then the bracket, and a hose draws on for the brake line, because the cutout has no lines. No installation instruction.
- 13–15 the three empty evidence positions are labelled Before / During / After, which sets up the 22–24 s payoff.
- 15–17 "no product reveal yet": the phone rises with the camera, but its screen stays defocused until a focus-pull resolves the build page at 17.0.
- 29–30 returns to the exact frame-0 composition (inquiry + 240Z), so the loop is seamless.

## B-L2 · Same car. Different proof.
- 3–4: ChatGPT gave no inquiry text, so Nora types "Who can do an engine swap on my Miata?" with a red caret. Nora's avatar is her own black NA Miata, and both shops show the same red Miata at the same scale and lighting.
- 5–6 "Align both images exactly": Shop B's tile starts 46 px low and snaps level, with red dashed alignment guides.
- 7–8 "No credit accompanies either photo": dashed "Who did the work · No credit" slots under each tile.
- 12–14 "Reduce the gallery to one image": the photo contracts and an empty "Engine install credit ?" slot appears beside it.
- **Music return:** the spec cuts the music at 16 but never brings it back, so it returns at 23.0, on "Resolve" (a bar line), once the record has landed. This mirrors L1 and L3, where the music returns after the record. The "Brief silence" at 13 is the music only (13.0–13.6); the "A photo can't answer" window (12.0–13.85) carries on over it.
- 24–26 "no winner stamp": Shop B's record card sits under its tile and Shop A gets a neutral "Finished photos only" label, so both choices stay comparable.
- 28–30 the record collapses into Shop B's tile, then the exact opening cars, labels and framing return.

## B-L3 · A guess gets the credit
- 1–2: Jules's bubble lands showing typing dots (remocn typing-indicator); the avatar, name and full question resolve at 2.0, as the spec splits it.
- 4–6: the first reply types with a red caret; at 5.0 "I think" turns grey and italic (the uncertainty).
- 7–8 "Remove the tentative phrasing": strikethrough-replace turns "Demo Brand B, I think" into "Definitely Demo Brand B.".
- 9–11: red boxes align the two brand names, then a red trace with a "Copied" tag shows the repetition.
- 11–13: the guessed name slides beside the turbo detail, then turns into a grey quote, "“Demo Brand B”", labelled "From two comments, not from the build record". It's a comment claim, not a product field.
- 19–20: the brand field is focused but blurred at 19 and resolves to "Demo Brand A" at 20.0, so the reveal lands on its second. There's no verification seal. Subtitles split "Brand:" (19.00–19.75) from "Demo Brand A." (19.95–20.98), and "First reply:" from the quoted guess, so the captions never spoil the reveal.
- 21: the parts row → log cut uses remocn caret-wipe in brand red (its glow removed to match the house style).
- 27: the audience question appears as a comment composer ("Which part gets misnamed?") beside the turbo.
- 29–30 restores the opening turbo crop with Jules's question under the CTA, as specced (not the exact frame 0, which has no question yet).

## remocn per beat (new this reel vs the W42 reels, which used zoom-blur, whip-pan, push-through and focus-pull)
- **lens-zoom** (new): L1 3.0 punch into the wheel, L2 10.0 pivot, L3 13.0 reset. Toned down for the house look (less rotation and shake, 5 lens steps).
- **caret-wipe** (new): L3 21.0, red caret, no glow.
- **trim-burst** (new): only where it can't cross text: the L1 caliper loupe (4.0), the L2 alignment snap (5.0), and short sideways strokes off every CTA tap. In the review stills, bursts placed over cards crossed copy, so those were removed.
- **strikethrough-replace** (new): L3 7.0.
- **slide-swap** (new): spring for the L1 6.0 gallery swipe and the L1 13.0 card slide.
- **typing-indicator** (new): L3 replies.
- Reused: zoom-blur, whip-pan, focus-pull (every product reveal at 17.0), push-through (L2 24.0, L3 26.0), drift-style slow pushes.
- The remocn pieces are time-driven ports (`film/src/remocn/ports.tsx`, MIT, licence alongside).

## Sound
- One sound per listed action, each starting on its spec second (checked ±1 frame with `film/audio/check_audio.py`; 82 of 82 cues pass). No extra transition whooshes: the spec lists every sound.
- Scores are original, with the tempo set so the music cut and return both land on bar lines:
  - L1: 96 bpm, E minor, soft kick, felt-piano motif. Thins at 14.0 (pad and sub only), cuts at 16.0, returns at 26.0.
  - L2: 102.9 bpm, B♭ major, rim and shaker. Dips -8 dB at 7–8, silent 13.0–13.6, cuts at 16.0, returns at 23.0.
  - L3: 109.1 bpm, D minor, pizzicato plucks. Cuts at 16.0, returns at 27.0.
- Each cut is a 0.12 s tape stop ending exactly on the second, followed by dead silence.
- The music ducks 7 dB under every VO window (80 ms attack before the window, 200 ms release after).
- Masters: -14 LUFS integrated, true peak ≤ -1 dBTP measured on the delivered AAC (not just the wav). The master is gain-matched, true-peak limited at -2.0 dBTP, then encoded and decoded. Any spot where the AAC rings above -1.2 dBTP gets a short local gain dip. This applied to three transients: L1 20.0 (sheet-open) and L2 0.0 (the opening hit on sample 0) and 20.0. Each is a few dB lower for about 60 ms, with its onset unchanged.
- Beds: the same mix at mix-reference level for Wayne's VO (peaks at -3 dBFS, not loudness-normalised).

## 2026-10-14 · Real install photos swapped in (re-render of B-L1, B-L2, B-L3, hook A)
Wayne supplied ChatGPT-generated photos and cutouts (`kit/remotion/public/img/lab/`, index in its README). They replace the studio-cutout composites described under "Shared" above. Timings, headlines, subtitles, cues, music, ducking and the audio masters are unchanged (the score re-runs bit-identical, and the beds are byte-identical, so only the three `.mp4` masters were replaced on `renders`).
- **Photo handling (`lib.tsx`):** a `.jpg` id in `Photo` is a real photo, cover-cropped about a focus point (`pos`) and never stretched; `IMG` accepts file names with extensions; the new files are preloaded. `LogCard` takes 2 or 3 photos and a tile `aspect`. `Triptych` takes per-photo `tpos` crops and a `from.h`, and its labels fade in after the tiles lift (on the first frames, the lifted label sat on the card's identical label).
- **B-L1:**
  - 3–5: `b-240z-wheel-closeup.jpg` is the wheel punch-in (lens-zoom into it, slow push toward the caliper), with a 4-frame dissolve at 5.0 into the exterior pull-back. The caliper only shows in slivers between the spokes, so the red loupe stays at 4.0, now over those slivers and magnifying the new assembly's caliper.
  - 8–13: `b-brake-assembly-cutout.png` is the "Illustration · wheel off". It includes the braided line, so the drawn-on hose is gone and the 12.0 ring isolates the real line. Rings were re-fitted to the caliper, the lower bracket ear and the line. The chips moved inside x 96–984 for the pushed-in camera.
  - 20–25: `b-240z-log-before/during/after.jpg` fill the log thumbs (square crops on the brake, zoom 1.3), the 21 s portrait strip and the 22–25 viewer. The desaturated before and the glove overlay are gone.
- **B-L2:** `b-miata-engine-hoist.jpg` ("On the hoist") and `b-miata-engine-installed.jpg` ("Installed") replace the three-cutout set (engine block, car lift, finished-car crop). They sit as two whole 4:3 photos in the log card and enlarge into a 430×640 pair at 21.0. `b-tech-eli-cutout.png` is Eli's contributor avatar (18–24 attribution card), replacing the overused mechanic portrait.
- **B-L3:** `b-supra-turbo-during.jpg` ("During") and `b-supra-turbo-after.jpg` ("After") replace the vacuum-line, wastegate and kit cutouts. Log tiles are cropped to 0.66 high, so the card keeps its old height above the subtitles at 24–25, and they enlarge into a 430×640 pair at 23.0. The note text still reads "Turbo, wastegate and vacuum lines installed." The 23.0 enlargement now starts from the tiles' real position (it used to start ~390 px low), and its tap moved onto the photos.
- **Unchanged:** the 240Z, Miata and Supra car cutouts in the hooks, galleries and build pages; the part-01 turbo crop (0–3, 11–13, 27–30); every UI card.
- **Checks (delivered AAC):** all three are 30.000 s, 900 frames, 1080×1920 at 30 fps, mux offset 0.00 ms, 82 of 82 cues within ±1 frame. B-L1 -14.1 LUFS, -1.5 dBTP; B-L2 -14.1 LUFS, -1.8 dBTP; B-L3 -14.2 LUFS, -1.8 dBTP. Review: 31 stills from the composition and 28 from the masters around the changed beats, with no clipped or overlapping text and "Illustrative example" on every frame. Final sheets regenerated (`storyboard/B-L*-final-sheet.png`).
