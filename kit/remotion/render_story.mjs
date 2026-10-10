// node render_story.mjs C1 body,hookA,hookB,hookC  -> out/story/C1-<part>.mp4 (silent)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [reel, parts] = process.argv.slice(2);
fs.mkdirSync("out/story", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), webpackOverride: c => c, publicDir: path.resolve("public") });
for (const part of parts.split(",")) {
  const inputProps = { reel, part }; const o = `out/story/${reel}-${part}.mp4`;
  if (fs.existsSync(o)) { console.log("skip", o); continue; }
  const comp = await selectComposition({ serveUrl, id: "Story", inputProps, browserExecutable: B });
  const t0 = Date.now(); let last = 0;
  await renderMedia({ composition: comp, serveUrl, inputProps, codec: "h264", outputLocation: o + ".tmp.mp4", browserExecutable: B, concurrency: 2,
    crf: 16, pixelFormat: "yuv420p", x264Preset: "medium", imageFormat: "jpeg", jpegQuality: 92, muted: true, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { if (progress - last > 0.25) { last = progress; console.log(reel, part, (progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
  fs.renameSync(o + ".tmp.mp4", o);
  console.log("done", o, ((Date.now() - t0) / 1000).toFixed(0) + "s", comp.durationInFrames, "frames");
}
