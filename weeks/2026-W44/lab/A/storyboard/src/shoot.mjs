// Shoot lane A key frames: node shoot.mjs [L1,L2,L3] [guides]
// Writes ../<id>/<id>-tNN.png and reports any text outside the essential-text box (x 96-880, y 240-1430).
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import path from "node:path"; import fs from "node:fs"; import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const ids = (process.argv[2] || "L1,L2,L3").split(",");
const guides = process.argv[3] === "guides";
const KEYS = { L1: [0, 5, 7, 10, 13, 19, 21, 24, 27], L2: [0, 3, 5, 9, 13, 15, 16, 21, 24], L3: [0, 3, 5, 7, 10, 15, 17, 19, 24] };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const id of ids) {
  const out = path.join(here, "..", `A-${id}`); fs.mkdirSync(out, { recursive: true });
  for (const t of KEYS[id]) {
    await page.goto(`file://${here}/frames.html?v=${id}&t=${t}${guides ? "&guides=1" : ""}`);
    await page.waitForFunction(() => window.READY === true);
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    const bad = await page.evaluate(() => {
      const res = []; const w = document.createTreeWalker(document.getElementById("c"), NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; let op = 1, e = el; while (e) { op *= +getComputedStyle(e).opacity; e = e.parentElement; }
        if (op < 0.5) continue; // faded, non-essential
        const r = document.createRange(); r.selectNodeContents(n);
        for (const b of r.getClientRects()) if (b.left < 95 || b.right > 881 || b.top < 239 || b.bottom > 1431) res.push(`${n.textContent.trim().slice(0, 30)} [${b.left|0},${b.top|0},${b.right|0},${b.bottom|0}]`);
      }
      const fams = [...document.fonts].filter(f => f.status === "loaded").map(f => f.family);
      return { res, fams };
    });
    const f = path.join(out, `A-${id}-t${String(t).padStart(2, "0")}${guides ? "-guides" : ""}.png`);
    await page.locator("#c").screenshot({ path: f });
    console.log(f.split("/").slice(-1)[0], bad.res.length ? "OUTSIDE: " + bad.res.join(" | ") : "ok", bad.fams.length);
  }
}
await browser.close();
