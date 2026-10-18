// node rangecheck.mjs <id> <hook> <f0-f1,...> -> out/range/<id>-<hook>-<f0>.mp4 (fast preview renders for the energy check)
import { bundle } from "@remotion/bundler"; import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs"; import os from "node:os";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, hook, ranges] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const comp = await selectComposition({ serveUrl, id: `${id}-${hook}`, puppeteerInstance: browser, inputProps: {} });
fs.mkdirSync("out/range", { recursive: true });
for (const r of ranges.split(",")) { const [a, b] = r.split("-").map(Number);
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: `out/range/${id}-${hook}-${a}.mp4`, puppeteerInstance: browser, concurrency: os.cpus().length, frameRange: [a, Math.min(b, comp.durationInFrames - 1)],
    crf: 20, x264Preset: "veryfast", imageFormat: "jpeg", muted: true, chromiumOptions: { gl: "swangle" }, inputProps: {} });
  console.log("done", r); }
await browser.close({ silent: true });
