import { chromium } from "/opt/npm-tools/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("out", { recursive: true });
const only = process.argv[2] ? process.argv[2].split(",") : null;
const b = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on("pageerror", e => console.log("ERR", e.message)); p.on("console", m => m.type()==="error" && console.log("CONSOLE", m.text()));
await p.goto("file://" + process.cwd() + "/frames.html");
await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.fonts].map(f=>f.load().catch(()=>{}))); });
await p.waitForTimeout(500);
const frames = await p.evaluate(() => window.FRAMES);
const uses = await p.evaluate(() => Object.fromEntries(F.map(f => [f.id, [...new Set([...f.html.matchAll(/img \d+b?/g)].map(m => m[0]))]])));
writeFileSync("uses.json", JSON.stringify(uses));
writeFileSync("shotlist.json", JSON.stringify(await p.evaluate(() => window.SHOTLIST), null, 1));
for (const f of frames) { if (only && !only.includes(f.id)) continue;
  await p.locator("#" + f.id).screenshot({ path: `out/${f.id}.png` }); }
console.log(frames.length, "frames"); await b.close();
