// node stills.mjs C3-COL 0,1.5,6 [--check] [--scale 0.5] [--dir name]  -> stills/<reel>[-check]/<t>.png
// --check overlays the subtitle band (1418-1556) and the platform-covered bottom 360 px.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [reel, ts] = process.argv.slice(2); const check = process.argv.includes("--check");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const scale = +arg("--scale", 0.5);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("../../../../../kit/remotion/public") });
const browser = await openBrowser("chrome", { browserExecutable: fs.existsSync(B) ? B : undefined, chromiumOptions: { gl: "swangle" } });
const inputProps = { check };
const comp = await selectComposition({ serveUrl, id: reel, inputProps, puppeteerInstance: browser });
const dir = arg("--dir", `stills/${reel}${check ? "-check" : ""}`); fs.mkdirSync(dir, { recursive: true });
for (const t of ts.split(",").map(Number)) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  await renderStill({ composition: comp, serveUrl, frame: f, output: `${dir}/${t.toFixed(2)}.png`, inputProps, puppeteerInstance: browser, scale });
}
await browser.close({ silent: true });
console.log("done", reel, ts.split(",").length);
