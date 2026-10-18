// node render-b2.mjs <id> <hook> [fromFrame-toFrame] -> out/video/<id>-<hook>.mp4 (or out/video/<id>-<hook>-part.mp4 for a range)
// Same settings as render.mjs (1080x1920, 30 fps, H.264 crf 16, CONC env, default 2). Used by master-b2.sh, which renders
// hook A in full and only the opener of hooks B/C, then splices the opener onto hook A's body (motion skill: hook versions).
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, hook, range] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
fs.mkdirSync("out/video", { recursive: true });
const comp = await selectComposition({ serveUrl, id: `${id}-${hook}`, puppeteerInstance: browser, inputProps: {} });
const fr = range ? range.split("-").map(Number) : null;
const o = fr ? `out/video/${id}-${hook}-part.mp4` : `out/video/${id}-${hook}.mp4`, t0 = Date.now(); let last = 0;
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: o, puppeteerInstance: browser, concurrency: Number(process.env.CONC || 2),
  crf: 16, pixelFormat: "yuv420p", x264Preset: "slow", imageFormat: "jpeg", jpegQuality: 95, muted: true, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000, inputProps: {},
  ...(fr ? { frameRange: [fr[0], Math.min(fr[1], comp.durationInFrames - 1)] } : {}),
  onProgress: ({ progress }) => { if (progress - last >= 0.25) { last = progress; console.log(id, hook, (progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
console.log("done", o, comp.durationInFrames, "frames", ((Date.now() - t0) / 1000).toFixed(0) + "s");
await browser.close({ silent: true });
