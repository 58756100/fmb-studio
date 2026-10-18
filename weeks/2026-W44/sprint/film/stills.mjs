// node stills.mjs <id> <hook> <t1,t2,...|auto:N> [check] -> stills/<id>-<hook>/<t>.png  (times in seconds)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, hook = "A", times = "auto:12", mode] = process.argv.slice(2);
const check = mode === "check";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const inputProps = { check };
const comp = await selectComposition({ serveUrl, id: `${id}-${hook}`, puppeteerInstance: browser, inputProps });
const out = path.resolve("stills", `${id}-${hook}${check ? "-chk" : ""}`); fs.mkdirSync(out, { recursive: true });
let ts;
if (times.startsWith("auto:")) { const n = +times.slice(5); ts = Array.from({ length: n }, (_, i) => +(((i + 0.5) * comp.durationInFrames / n) / 30).toFixed(2)); }
else ts = times.split(",").map(Number);
for (const s of ts) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(s * 30));
  await renderStill({ composition: comp, serveUrl, frame: f, output: `${out}/${(f / 30).toFixed(2).padStart(5, "0")}.png`, puppeteerInstance: browser, inputProps, onBrowserLog: (l) => { if (l.text.startsWith("CHECK") && !/ n=0\s*$/.test(l.text)) console.log(l.text); } });
}
await browser.close({ silent: true });
console.log("done", out, comp.durationInFrames, "frames");
