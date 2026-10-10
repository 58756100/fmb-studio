// P2 · One post, 24 hours — storyboard key frames (lead hook A). Times are from the beat sheet; the build retimes to words.json.
// Shared helpers (stamp, supplierPage, simTag) are defined per reel file on purpose; kit.js is not edited.
const stamp = (t, x, y, rot = -8) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:9;transform:rotate(${rot}deg);padding:10px 36px 14px;border:9px solid #F43034;border-radius:22px;color:#F43034;font-size:84px;font-weight:800;letter-spacing:-.04em;background:rgba(255,255,255,.72)">${t}</div>`;
// Supplier page (simulation): brand header, verified seal, builds grid, parts list.
const supplierPage = (o) => {
  const cols = o.cols || 3, gap = cols > 3 ? 8 : 10;
  const tiles = (o.builds || []).map(b => b.more
    ? `<div style="aspect-ratio:1;border-radius:14px;background:var(--fill);display:grid;place-items:center;font-size:20px;font-weight:600;color:var(--label2)">${b.more}</div>`
    : `<div style="position:relative;min-width:0">${ph(b.img, "", 100, 100, { r: 14, inset: 6, style: `width:100%;height:auto;aspect-ratio:1;${b.hl ? "box-shadow:0 0 0 2.5px #F43034;" : ""}`, inner: b.badge ? `<span class="badge ${b.hl ? "r" : ""}" style="position:absolute;left:5px;top:5px;height:18px;font-size:10px;padding:0 6px;z-index:2">${b.badge}</span>` : "" })}${b.tag ? `<div class="c1 sec" style="margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.tag}</div>` : ""}</div>`).join("");
  const parts = (o.parts || []).map(p => `<div class="row" style="--ins:72px;min-height:58px">${ph(p.img, "", 42, 42, { r: 10, inset: 4 })}<div class="main"><div class="body" style="font-weight:500">${p.name}</div><div class="sh sec">${p.meta}</div></div>${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`).join("");
  return `<div class="ios grouped">${statusBar(false)}
    <div class="navbtns"><div class="gbtn glass">${ic("chevL", 20, "#000", 2.2)}</div><div class="gbtn glass">${ic("share", 20, "#000", 1.9)}</div></div>
    <div style="position:absolute;top:104px;left:0;right:0;text-align:center">
      <div style="display:flex;justify-content:center">${avm(o.mono, 84)}</div>
      <div class="lt" style="margin-top:12px;display:flex;justify-content:center;align-items:center;gap:6px">${o.name}${seal(22)}</div>
      <div class="sh sec" style="margin-top:2px">${o.sub}</div>
      <div style="margin-top:12px"><span class="pillbtn ink" style="height:36px;font-size:15px;padding:0 22px">Follow</span></div></div>
    <div style="position:absolute;top:300px;left:0;right:0">
      <div class="hdr" style="display:flex;justify-content:space-between"><span>Builds running ${o.short}</span><span>${o.count}</span></div>
      <div class="list" style="padding:12px"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${tiles}</div></div>
      <div class="hdr" style="margin-top:16px">Parts</div><div class="list">${parts}</div></div>
    ${tabbar(2)}</div>`;
};

// Spine: one chart is the set. A red line (the sponsored post) spikes and flatlines; a dark line (the Vesk page) steps up. A Vesk chip rides the headline band.
const spine = (label, val, state = "ink") => chip(`<span style="color:var(--label2);font-weight:500">${label}</span><span style="font-variant-numeric:tabular-nums;color:${state === "red" ? "#F43034" : "#1D1D1F"}">${val}</span>`, 0, 210, { h: 92, fs: 44, style: "left:50%;transform:translateX(-50%)" });
const cp = (x, y, W, H, xf, yf) => [x + 40 + xf * (W - 80), y + H - 40 - yf * (H - 80)];
const chartAt = (x, y, o) => { const { xl = [], ...rest } = o, W = o.w || 900, Hh = o.h || 520; return `<div class="abs" style="left:${x}px;top:${y}px;z-index:3">${lineChart(rest)}<div style="position:absolute;left:38px;top:0;width:4px;height:${Hh - 40}px;border-radius:2px;background:#D1D1D6"></div>${xl.map((l, i, a) => `<div style="position:absolute;left:${40 + i / (a.length - 1) * (W - 80)}px;top:${Hh - 34}px;transform:translateX(-50%);font-size:${o.lf || 32}px;font-weight:500;letter-spacing:-.01em;color:#86868B;white-space:nowrap">${l}</div>`).join("")}</div>`; };
// phone-readable social post: the kit post() scaled up
const bigPost = (o, s, x, y, extra = "") => `<div class="abs" style="left:${x}px;top:${y}px;width:${402 * s}px;z-index:${o.z || 1};${extra}"><div style="transform:scale(${s});transform-origin:0 0;width:402px;border-radius:26px;overflow:hidden;box-shadow:0 30px 70px -26px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)">${post({ ...o, w: 402 })}</div></div>`;
const dot = (x, y, r = 16, ring = true) => `<div class="abs" style="left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#F43034;z-index:7"></div>${ring ? `<div class="abs" style="left:${x - r * 2}px;top:${y - r * 2}px;width:${r * 4}px;height:${r * 4}px;border-radius:50%;border:4px solid rgba(244,48,52,.35);z-index:7"></div>` : ""}`;
// real price-tag cutout with the amount overlaid on its face (rotated to the tag)
const priceTag = (x, y, w = 470, label = "$2,400") => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:8"><img src="${IMG}obj/price-tag.png" style="width:100%;display:block;filter:drop-shadow(0 26px 30px rgba(0,0,0,.22))"><div style="position:absolute;left:31%;top:45%;width:56%;text-align:center;transform:rotate(-18deg);color:#fff;font-size:${w * .1}px;font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums">${label}</div></div>`;
const FLAT = [[0, .02], [.03, .02], [.045, 1], [.065, .02], [1, .02]];
const STEPS = [[.065, .1], [.3, .1], [.3, .3], [.55, .3], [.55, .5], [.8, .5], [.8, .7], [1, .7]];
const legend = (x, y) => `${txt(`<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#F43034;margin-right:14px;vertical-align:-1px"></span>Sponsored post`, x, y, { size: 34, color: "#6E6E73" })}${txt(`<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#1D1D1F;margin-right:14px;vertical-align:-1px"></span>Vesk page`, x + 460, y, { size: 34, color: "#6E6E73" })}`;

// ---- hook A (0–3 s): empty axes, the red price tag drops onto the y-axis and swings
add("p2-01", 0.6, `${H(`What does $2,400<br><span class="g">of attention look like?</span>`, 360, { size: 92 })}
  ${chartAt(90, 740, { w: 900, h: 780, xl: ["1h", "6h", "12h", "18h", "24h"] })}
  ${priceTag(10, 570, 580)}`, "studio", "Hook A. VO (Eric): “What does $2,400 of attention look like on a graph?” animated-line-chart axes draw in; the red price tag drops onto the y-axis and swings once (spring, tag-flick sfx).");

// ---- body
add("p2-02", 3.6, `${H(`One post.<br><span class="g">One creator.</span>`, 360, { size: 100 })}
  ${bigPost({ who: "vesk.wheels", avatar: "part-03", img: "part-03", caption: "New bronze drop.", sponsored: true, likes: "312" }, 1.0, 600, 650)}
  ${cut("car-15", { x: 90, y: 1090, w: 880 })}
  ${cut("part-03", { x: 130, y: 830, w: 250, rot: -14, z: 4 })}
  ${[[400, 1000], [430, 960]].map(([x, y]) => `<div class="abs" style="left:${x - 130}px;top:${y - 120}px;width:100px;height:3px;border-radius:2px;background:rgba(0,0,0,.14);transform:rotate(-30deg);z-index:3"></div>`).join("")}
  ${spine("Spent", "$2,400")}`, "studio", "VO: “Jonah, Vesk Wheels. One creator, one GR86.” The bronze wheel cutout spins in and snaps onto the GR86 (spring overshoot + clunk). Sponsored post card sits behind. Chip: Spent $2,400.");
{
  const [px, py] = cp(90, 800, 900, 700, .5, 1);
  add("p2-03", 6.6, `${spine("Hour", "12")}${H(`The line climbs.<br><span class="g">Hour 12: peak.</span>`, 360, { size: 92 })}
  ${chartAt(90, 800, { w: 900, h: 700, pts: [[0, .02], [.1, .1], [.22, .36], [.36, .7], [.5, 1]], xl: ["1h", "6h", "12h", "18h", "24h"] })}
  ${dot(px, py, 16)}
  ${big("38,000", 0, 590, { size: 150, style: "left:0;right:0;text-align:center;color:#1D1D1F" })}${txt("views", 0, 800 - 0, { size: 36, color: "#86868B", style: "left:0;right:0;text-align:center;top:740px" })}`, "studio", "animated-line-chart draws up; rolling-number ticks to 38,000 as the line crests at 12h. Rising-pitch whoosh under the climb; red dot lands on the peak with a pop.");
}
{
  const [dx, dy] = cp(90, 780, 900, 700, .065, .02);
  add("p2-04", 9.6, `${spine("Day", "30")}${H(`Flat.<br><span class="g">Forever.</span>`, 360, { size: 110 })}
  ${chartAt(90, 780, { w: 900, h: 700, pts: FLAT, xl: ["Day 1", "Day 10", "Day 20", "Day 30"] })}
  ${dot(dx, dy, 14)}
  ${txt("The $2,400 spike", 220, 800, { size: 36, color: "#86868B" })}`, "gray", "Silence reveal: all motion freezes for 0.6 s after “Hour twenty-four.” except the pulsing red dot (no music hit, room tone only). The axis zooms out from 24 h to 30 days and the spike shrinks to a sliver.");
}
add("p2-05", 12.6, `${H(`Same week.<br><span class="g">Free.</span>`, 360, { size: 104 })}
  ${bigPost({ who: "tucson.miata", avatar: "car-09", img: "car-09", caption: "just put the Vesks on 🔥", place: "Tucson, AZ", likes: "48" }, 1.5, 220, 620, "transform:rotate(-2deg);")}
  ${cut("part-03", { x: 507, y: 1018, w: 118, z: 6, shadow: false })}
  ${chip("$0", 730, 570, { h: 128, fs: 84, z: 9, color: "#F43034", style: "padding:0 54px;font-weight:700;letter-spacing:-.04em" })}
  ${chip("just put the Vesks on 🔥", 130, 1450, { h: 88, fs: 42, z: 9 })}
  ${spine("Tucson Miata", "$0", "red")}`, "studio", "Hard cut (the chart is gone) to a new car: red Miata with bronze wheels, phone post card “just put the Vesks on 🔥”. $0 chip pops in red. Thumb-tap sfx.");
const pc = ["car-08", "car-12", "car-10", "car-16", "car-04", "car-05", "car-07", "car-11", "car-13", "car-14", "car-17", "car-18"];
const tx = i => 50 + (i % 4) * 250, ty = i => 940 + Math.floor(i / 4) * 208;
add("p2-06", 15.6, `${H(`<span class="r">19</span> builds.<br><span class="g">0 links.</span>`, 360, { size: 104 })}
  <svg class="abs" style="left:0;top:0;z-index:1" width="1080" height="1920" viewBox="0 0 1080 1920">${pc.map((_, i) => { const x0 = tx(i) + 115, y0 = ty(i) + 95, x1 = 540, y1 = 790; const e = .78; return `<line x1="${x0}" y1="${y0}" x2="${x0 + (x1 - x0) * e}" y2="${y0 + (y1 - y0) * e}" stroke="#C7C7CC" stroke-width="4" stroke-linecap="round"/>`; }).join("")}</svg>
  <div class="abs" style="left:465px;top:725px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:6px">${avm("V", 150)}</div>
  ${pc.map((c, i) => `<div class="abs" style="left:${tx(i)}px;top:${ty(i)}px;z-index:3">${ph(c, "", 230, 190, { r: 26, inset: 6 })}</div>`).join("")}
  ${spine("Builds", "19")}`, "gray", "Cutouts pop into a grid (stagger 4 frames); number-wheel lands on 19 with “Nineteen”. Thin grey lines draw from every car toward the Vesk node and snap off at 80% (2-frame flicker + tiny snap sfx).");
add("p2-07", 18.6, `${H(`Until their<br><span class="g">build pages did.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-09", title: "Red Miata", owner: "tucson.miata", meta: "Public", url: "fuelmybuild.com/tucson-miata", section: "Installed · 11 parts",
    rows: [{ img: "part-03", name: "Wheels", brand: "Vesk", red: true, date: "17x9", hl: true }, { img: "part-02", name: "Coilovers", brand: "Installed Mar 3", date: "" }, { img: "part-05", name: "Exhaust", brand: "Installed Jun 18", date: "" }] }), { x: 260, y: 640, w: 560 })}
  ${[["car-08", 20, 920, -10], ["car-12", 880, 800, 9], ["car-16", 40, 1330, 7], ["car-04", 870, 1250, -8]].map(([c, x, y, r]) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:6;transform:rotate(${r}deg);filter:blur(1.5px)">${ph(c, "", 170, 150, { r: 24, inset: 6, style: "box-shadow:0 24px 40px -16px rgba(0,0,0,.35);" })}</div>`).join("")}
  ${cursor(600, 1040)}
  ${spine("Builds", "19", "red")}`, "gray", "FMB turn (18 s, 56%). push-through from the grid into the Miata’s iOS 26 build page; parts row “Wheels · Vesk · 17x9” lights red. simulated-cursor taps it; the other builds fly in from the grid on springs. Tap + whoosh.");
add("p2-08", 20.6, `${H(`One page.<br><span class="g">Every build.</span>`, 360, { size: 104 })}
  ${device(supplierPage({ mono: "V", name: "Vesk Wheels", short: "Vesk", sub: "Verified supplier · Bronze wheels", count: "19 builds", cols: 4,
    builds: [{ img: "car-09", badge: "New", hl: true }, { img: "car-08" }, { img: "car-12" }, { img: "car-10" }, { img: "car-16" }, { img: "car-04" }, { img: "car-05" }, { img: "car-07" }, { img: "car-11" }, { img: "car-13" }, { img: "car-14" }, { more: "+8" }],
    parts: [{ img: "part-03", name: "Bronze wheel · 17x9", meta: "Vesk" }, { img: "part-03", name: "Bronze wheel · 18x9.5", meta: "Vesk" }] }), { x: 250, y: 640, w: 580 })}
  ${[["car-17", 30, 900, -10], ["car-18", 900, 1180, 8]].map(([c, x, y, r]) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:6;transform:rotate(${r}deg);filter:blur(1.5px)">${ph(c, "", 150, 130, { r: 22, inset: 6, style: "box-shadow:0 24px 40px -16px rgba(0,0,0,.35);" })}</div>`).join("")}
  ${spine("Builds", "19")}`, "studio", "Cursor tap resolves to the Vesk supplier page (simulated, corner tag). The 19 tiles fly in from the grid and stack into rows (spring, 3-frame stagger); number-wheel 19.");
{
  const W = 900, Hh = 640, X = 90, Y = 780;
  const labs = [[.065, .1, "19"], [.3, .3, "20"], [.55, .5, "21"], [.8, .7, "22"]].map(([xf, yf, t]) => { const [a, b] = cp(X, Y, W, Hh, xf, yf); return chip(t, a - 40, b - 100, { h: 64, fs: 34, z: 8, style: "padding:0 22px" }); }).join("");
  add("p2-09", 23.6, `${spine("Builds", "22")}${H(`Each build adds a car.<br><span class="g">It <span class="r">stacks</span>.</span>`, 360, { size: 88 })}
  ${legend(90, 700)}
  ${chartAt(X, Y, { w: W, h: Hh, pts: FLAT, pts2: STEPS, color: "#F43034", color2: "#1D1D1F", xl: ["Day 1", "Day 10", "Day 20", "Day 30"] })}${labs}`, "gray", "Back to the same chart, new truth: a second, darker line steps up one notch each time a tile lands (soft tick per step); rolling-number counts 19 → 22. The flat red line stays flat underneath.");
}
add("p2-10", 26.6, `${H(`Post: zero.<br><span class="g">Page: <span class="r">counting</span>.</span>`, 360, { size: 96 })}
  ${card(`<div style="font-size:36px;font-weight:600;letter-spacing:-.02em;margin-bottom:6px">Sponsored post</div>${lineChart({ w: 400, h: 380, pts: FLAT, xl: [] })}<div style="display:flex;justify-content:space-between;font-size:30px;font-weight:500;color:#86868B;padding:0 30px;margin-top:-6px"><span>Day 1</span><span>Day 30</span></div><div style="font-size:92px;font-weight:700;letter-spacing:-.045em;margin-top:34px;color:#AEAEB2">0</div><div style="font-size:30px;color:var(--label2)">new views a day</div>`, 50, 700, 470, { z: 4 })}
  ${card(`<div style="font-size:36px;font-weight:600;letter-spacing:-.02em;margin-bottom:6px">Vesk page</div>${lineChart({ w: 400, h: 380, pts2: STEPS, color2: "#1D1D1F", xl: [] })}<div style="display:flex;justify-content:space-between;font-size:30px;font-weight:500;color:#86868B;padding:0 30px;margin-top:-6px"><span>Day 1</span><span>Day 30</span></div><div style="font-size:92px;font-weight:700;letter-spacing:-.045em;margin-top:34px">22</div><div style="font-size:30px;color:var(--label2)">builds and counting</div>`, 560, 700, 470, { z: 4 })}
  ${spine("Day", "30")}`, "gray", "Split-screen snap: left the flat red line, right the stepping dark line, both pinned at Day 30 (cards spring in from opposite sides, 2-frame shake on the left’s zero). Soft chord on “counting”.");
{
  const W = 960, Hh = 700, X = 60, Y = 860;
  const [px, py] = cp(X, Y, W, Hh, .55, 1);
  add("p2-11", 28.0, `${H(`Before your next<br><span class="r">$2,400</span><br><span class="g">watch this line.</span>`, 300, { size: 88 })}
  ${chartAt(X, Y, { w: W, h: Hh, pts: [[0, .02], [.18, .05], [.36, .4], [.55, 1], [.72, .28], [1, .02]], xl: ["1h", "6h", "12h", "18h", "24h"] })}
  ${dot(px, py, 16)}${priceTag(10, 640, 430)}`, "studio", "Loop: zoom back into the first spike so the frame matches the hook (axes + tag + a red line shooting up). VO: “Before your next $2,400, watch this line.” Music dips, then resolves on the cut.");
}
add("p2-12", 29.4, endCard("First 100 brands get a free page."), "white", "CTA (Eric): “First 100 brands get a free page. fuelmybuild.com.” Logo springs in, URL in red. Illustrative-story line in the footer.");

window.META = { reel: "P2", title: "One post, 24 hours", lead: "A", voice: "Eric (narrator)",
  remocn: ["animated-line-chart (the whole film: spike, 30-day zoom-out, second stepping line)", "rolling-number (38,000 and 19 → 22)", "number-wheel (19 landing)", "push-through (turn)", "simulated-cursor", "spring-scale-in (price tag, split cards)"],
  newCutouts: [] };
