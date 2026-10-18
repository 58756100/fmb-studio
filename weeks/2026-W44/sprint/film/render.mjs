// node render.mjs <id> [hooks=A,B,C] -> out/video/<id>-<hook>.mp4 (silent, full composition, 1080x1920, 30 fps, H.264 crf 16)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs"; import os from "node:os";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, hooks = "A,B,C"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
fs.mkdirSync("out/video", { recursive: true });
for (const hook of hooks.split(",")) {
  const comp = await selectComposition({ serveUrl, id: `${id}-${hook}`, puppeteerInstance: browser, inputProps: {} });
  const o = `out/video/${id}-${hook}.mp4`, t0 = Date.now(); let last = 0;
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: o, puppeteerInstance: browser, concurrency: Number(process.env.CONC || os.cpus().length),
    crf: 16, pixelFormat: "yuv420p", x264Preset: "slow", imageFormat: "jpeg", jpegQuality: 95, muted: true, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000, inputProps: {},
    onProgress: ({ progress }) => { if (progress - last >= 0.25) { last = progress; console.log(id, hook, (progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
  console.log("done", o, comp.durationInFrames, "frames", ((Date.now() - t0) / 1000).toFixed(0) + "s");
}
await browser.close({ silent: true });
