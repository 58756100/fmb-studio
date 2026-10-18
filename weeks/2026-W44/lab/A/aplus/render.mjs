// node render.mjs A-L1 [A-L2 A-L3] -> out/<id>-hook.mp4 (frames 0-89, hook 1 opener) + out/<id>-body.mp4 (90-839), muted
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx") });
fs.mkdirSync("out", { recursive: true });
for (const id of process.argv.slice(2)) {
  const comp = await selectComposition({ serveUrl, id, browserExecutable: B });
  for (const [part, range] of [["hook", [0, 89]], ["body", [90, 839]]]) {
    const t0 = Date.now();
    await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: `out/${id}-${part}.mp4`, browserExecutable: B, frameRange: range,
      concurrency: 4, crf: 12, pixelFormat: "yuv420p", x264Preset: "medium", imageFormat: "png", muted: true, chromiumOptions: { gl: "swangle" } });
    console.log(id, part, ((Date.now() - t0) / 1000).toFixed(0) + "s");
  }
}
