// node dump_html.mjs C1 -> public/tl/C1.html.json (frame id -> html) for the sound designer
import { chromium } from "/opt/npm-tools/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const reel = process.argv[2];
const b = await chromium.launch({ args: ["--allow-file-access-from-files"] }); const p = await b.newPage();
await p.goto("file://" + process.cwd().replace(/remotion$/, "storyboard/w42") + "/page.html?reel=" + reel);
const m = await p.evaluate(() => Object.fromEntries(F.map(f => [f.id, f.html])));
writeFileSync(`public/tl/${reel}.html.json`, JSON.stringify(m)); await b.close(); console.log(reel, Object.keys(m).length);
