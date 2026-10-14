// node stills.mjs B-L1 0,0.5,1.2 [scale]  -> stills/B-L1-<t>.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, ts, sc] = process.argv.slice(2);
const publicDir = path.resolve("../../../../../kit/remotion/public");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const comp = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
fs.mkdirSync("stills", { recursive: true });
for (const t of ts.split(",").map(Number)) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  await renderStill({ composition: comp, serveUrl, frame: f, output: `stills/${id}-${t.toFixed(2)}.png`, puppeteerInstance: browser, scale: Number(sc || 0.5) });
}
await browser.close({ silent: true });
console.log("done", ts.split(",").length);
