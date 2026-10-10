import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const frames = process.argv[2].split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), webpackOverride: c => c });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const comp = await selectComposition({ serveUrl, id: "Reel", puppeteerInstance: browser });
fs.mkdirSync("stills", { recursive: true });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `stills/f${f}.png`, puppeteerInstance: browser });
}
await browser.close({ silent: true });
console.log("done", frames.length);
