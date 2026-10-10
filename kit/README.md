# FuelMyBuild reel kit

The production kit behind the supplier reel (Oct 2026). Give this folder to Claude and say "use the FMB reel kit".

- storyboard/ - static key-frame renderer (HTML + Playwright): node shoot.mjs -> out/f*.png
- remotion/ - the animated film: Remotion 4 + remocn transitions (src/remocn), iOS 26 UI kit (src/lib/ui.ts),
  scenes (src/Scenes.tsx), timeline and transitions (src/Reel.tsx), word timings (src/cues.ts).
  Assets: public/img (studio cutouts car-01..19, part-01..07, mech), public/fonts (Inter opsz).
  npm i, then node stills.mjs 120,600 (review stills), node render.mjs (full render), node seg.mjs (re-render a range to splice).
  Set B in the .mjs files to a local Chrome headless shell, or remove browserExecutable.
- audio/ - audio.py synthesises the score (100 bpm, F minor, tape stop, drop on the logo) and frame-timed SFX,
  ducks music under the voice, writes mix/stem wavs. Master: ffmpeg -af loudnorm=I=-14:TP=-1:LRA=9

House style: white canvas, Inter only (opsz 32 headlines, -0.038em), sentence case, one red accent #F43034,
native iOS 26 screens, studio cutouts on soft tiles, headline words revealed on the voice, every on-screen action has its own sound.
