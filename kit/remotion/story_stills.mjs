// node story_stills.mjs C2 body 0.2,0.5,1,2 -> stills/C2-body-<t>.png + stills/C2-body-sheet.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path"; import fs from "node:fs"; import { execFileSync } from "node:child_process";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [reel, part, ts] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), webpackOverride: c => c, publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { browserExecutable: B, chromiumOptions: { gl: "swangle" } });
const inputProps = { reel, part };
const comp = await selectComposition({ serveUrl, id: "Story", inputProps, puppeteerInstance: browser });
fs.mkdirSync("stills", { recursive: true });
const outs = [];
for (const t of ts.split(",").map(Number)) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(t * 30)); const o = `stills/${reel}-${part}-${t}.png`;
  await renderStill({ composition: comp, serveUrl, frame: f, output: o, inputProps, puppeteerInstance: browser, scale: 0.5 }); outs.push(o);
}
await browser.close({ silent: true });
execFileSync("python3", ["-c", `
import sys
from PIL import Image
fs=sys.argv[2:]; ims=[Image.open(f).convert('RGB') for f in fs]; w,h=ims[0].size
s=Image.new('RGB',(min(len(ims),6)*(w+10),((len(ims)+5)//6)*(h+10)),'#888')
for i,im in enumerate(ims): s.paste(im,((i%6)*(w+10),(i//6)*(h+10)))
s.thumbnail((2400,2400)); s.save(sys.argv[1],quality=85)`, `stills/${reel}-${part}-sheet.jpg`, ...outs]);
console.log("done", outs.length);
