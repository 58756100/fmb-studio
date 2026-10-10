// node shoot.mjs C1  -> out/C1/<frame>.png + out/C1/frames.json + out/C1/sheet.jpg
import { chromium } from "/opt/npm-tools/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const reel = process.argv[2]; const dir = `out/${reel}`; mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on("pageerror", e => console.log("ERR", e.message)); p.on("console", m => m.type() === "error" && console.log("CONSOLE", m.text()));
await p.goto("file://" + process.cwd() + "/page.html?reel=" + reel);
await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
await p.waitForTimeout(400);
const frames = await p.evaluate(() => window.FRAMES); const meta = await p.evaluate(() => window.META || {});
for (const f of frames) await p.locator("#" + f.id).screenshot({ path: `${dir}/${f.id}.png` });
writeFileSync(`${dir}/frames.json`, JSON.stringify(frames, null, 1)); writeFileSync(`${dir}/meta.json`, JSON.stringify(meta, null, 1));
await b.close();
execFileSync("python3", ["sheet.py", reel], { stdio: "inherit" });
console.log(reel, frames.length, "frames");
