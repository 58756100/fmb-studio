// node stills.mjs A-L1 0,1.5,2.5 [check]  -> stills/<id>/<id>-<t>.png  (times in seconds)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, times, mode] = process.argv.slice(2);
const check = mode === "check";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const inputProps = { check };
const comp = await selectComposition({ serveUrl, id, puppeteerInstance: browser, inputProps });
const out = path.resolve("stills", id); fs.mkdirSync(out, { recursive: true });
for (const s of times.split(",").map(Number)) {
  const f = Math.min(839, Math.round(s * 30));
  await renderStill({ composition: comp, serveUrl, frame: f, output: `${out}/${id}-${s.toFixed(2)}${check ? "-chk" : ""}.png`, puppeteerInstance: browser, inputProps });
}
await browser.close({ silent: true });
console.log("done", out);
