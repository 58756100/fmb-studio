// node render.mjs B-L1,B-L2,B-L3 [body,hookA] -> out/<id>-body.mp4 (frames 60-899), out/<id>-hookA.mp4 (frames 0-59), silent
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [ids, parts = "body,hookA"] = process.argv.slice(2);
const publicDir = path.resolve("../../../../../kit/remotion/public");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir });
fs.mkdirSync("out", { recursive: true });
const RANGE = { hookA: [0, 59], body: [60, 899] }; // hook A = seconds 0-2, body = 2-30
for (const id of ids.split(",")) for (const part of parts.split(",")) {
  const o = `out/${id}-${part}.mp4`; const comp = await selectComposition({ serveUrl, id, browserExecutable: B });
  const t0 = Date.now(); let last = 0;
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: o, browserExecutable: B, concurrency: Number(process.env.CONC || 4), frameRange: RANGE[part],
    crf: 14, pixelFormat: "yuv420p", x264Preset: "medium", imageFormat: "jpeg", jpegQuality: 95, muted: true, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { if (progress - last > 0.2) { last = progress; console.log(id, part, (progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
  console.log("done", o, ((Date.now() - t0) / 1000).toFixed(0) + "s");
}
