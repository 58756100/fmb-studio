// node render.mjs C3-COL,C3-GAR,C3-SUP [hookA,body]  -> out/<id>-hookA.mp4 (frames 0-53 = 0-1.8 s), out/<id>-body.mp4 (54-809), silent
// FIX=a,b renders out/<id>-fix.mp4 for a frame range (re-render only what changed, then splice in assemble.sh)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [ids, parts = "hookA,body"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("../../../../../kit/remotion/public") });
fs.mkdirSync("out", { recursive: true });
const RANGE = { hookA: [0, 53], body: [54, 809], fix: (process.env.FIX || "0,0").split(",").map(Number) };
for (const id of ids.split(",")) for (const part of parts.split(",")) {
  const o = `out/${id}-${part}.mp4`; const comp = await selectComposition({ serveUrl, id, browserExecutable: B, inputProps: { check: false } });
  const t0 = Date.now(); let last = 0;
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: o, browserExecutable: B, concurrency: Number(process.env.CONC || 4), frameRange: RANGE[part],
    inputProps: { check: false }, crf: 14, pixelFormat: "yuv420p", x264Preset: "medium", imageFormat: "jpeg", jpegQuality: 95, muted: true,
    chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { if (progress - last > 0.25) { last = progress; console.log(id, part, (progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
  console.log("done", o, ((Date.now() - t0) / 1000).toFixed(0) + "s");
}
