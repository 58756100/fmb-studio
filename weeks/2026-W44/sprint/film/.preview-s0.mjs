// node preview.mjs <id> <hook>  (run from the film dir) -> out/range/<id>-<hook>-prev.mp4 at 0.25 scale for the energy check
import { bundle } from "@remotion/bundler"; import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, hook] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const comp = await selectComposition({ serveUrl, id: `${id}-${hook}`, puppeteerInstance: browser, inputProps: {} });
fs.mkdirSync("out/range", { recursive: true }); const t0 = Date.now();
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: `out/range/${id}-${hook}-prev.mp4`, puppeteerInstance: browser, concurrency: 2, scale: 0.25,
  crf: 20, x264Preset: "veryfast", imageFormat: "jpeg", muted: true, chromiumOptions: { gl: "swangle" }, inputProps: {} });
console.log("done", id, hook, ((Date.now() - t0) / 1000).toFixed(0) + "s");
await browser.close({ silent: true });
