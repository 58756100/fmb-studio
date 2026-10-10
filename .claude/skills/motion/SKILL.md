---
name: motion
description: This skill should be used when building, storyboarding, animating or rendering FuelMyBuild videos — "make the storyboard", "build the reel", "animate this script", "render", "use Remotion", "use remocn".
---

# Motion (Remotion + remocn, always together)

Every FMB video is built in Remotion with remocn components. Start from the studio kit (`kit/remotion`), which already contains the iOS 26 UI kit, the cutout library and remocn transitions.

## Before choosing any motion
1. Read `references/house-style.md`, then `references/remocn-design-defaults.md` and `references/remocn-anti-patterns.md`.
2. For each beat in the script, search `references/remocn-catalog.md` for 1–2 candidates. Check the use-when and avoid-when lines and the vibe (prefer clean or premium). Install with `npx shadcn add @remocn/<name>` when the network allows; otherwise copy the source from `github.com/Remocn/remocn` (`registry/remocn/<name>/index.tsx`, MIT).
3. Each reel must use at least one remocn piece the previous reel didn't (log it in the script file) so the week never looks the same twice.
4. remocn is laid out for 1280x720 at 30 fps. Our canvas is 1080x1920 at 60 fps: scale sizes, double frame counts and keep content in the middle 1080x1420 (platform UI covers the edges).

## Storyboard (Wayne's checkpoint)
- Render 1–2 key frames per beat from the real scene code (`node stills.mjs <frames>`). Publish an artifact page with an animatic, contact sheet, the beat table (voice, on screen, motion, sound, remocn pieces) and the image prompts for any new cutouts.
- Stop and wait for approval.

## Build
- Each scene is a pure function of absolute time t. Cuts sit just before the first word of a beat (from words.json). Headline words reveal on their spoken time.
- A visual change every 1.5–2.5 s. Each re-hook in the script gets a visible reset (transition, camera move or new screen).
- Render 30–40 review stills across the timeline before the full render, and fix overlaps, spacing and ghosting first.

## Render
- `node render.mjs` (60 fps, crf 14, concurrency = CPU cores; about 30 min per 44 s on 2 cores).
- Hook versions: render only the 3–4 s opener per hook with the frame range, then splice it onto the body with ffmpeg (concat filter, re-encode once).
- Fixes: re-render only the affected frame range, then splice.
