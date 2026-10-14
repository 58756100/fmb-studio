// node stills.mjs C1 0,0.5,1.6 [--check] [--scale 0.5]  -> stills/C1/<t>.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [reel, ts] = process.argv.slice(2); const check = process.argv.includes("--check");
const si = process.argv.indexOf("--scale"); const scale = si > 0 ? +process.argv[si + 1] : 0.5;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("../../../../../kit/remotion/public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const inputProps = { check };
const comp = await selectComposition({ serveUrl, id: reel, inputProps, puppeteerInstance: browser });
const dir = `stills/${reel}${check ? "-check" : ""}`; fs.mkdirSync(dir, { recursive: true });
for (const t of ts.split(",").map(Number)) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  await renderStill({ composition: comp, serveUrl, frame: f, output: `${dir}/${t.toFixed(2)}.png`, inputProps, puppeteerInstance: browser, scale });
}
await browser.close({ silent: true });
console.log("done", reel, ts.split(",").length);
