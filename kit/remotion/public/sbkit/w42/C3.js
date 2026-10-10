// C3 · Owner number four — storyboard key frames (lead hook A, Brian narrator). Times are from the beat sheet; the build retimes to words.json.
// Spine: three clue chips in the headline band. They count 1/3, 2/3, 3/3, redact at "No paperwork", then unredact one by one with a red check.
const R = w => `<span class="r">${w}</span>`;
const bar = (w = 150) => `<span style="display:inline-block;width:${w}px;height:.82em;background:#1D1D1F;border-radius:16px;vertical-align:-.06em"></span>`;
const clueChips = (st, dark = false) => st.map((s, i) => {
  const n = i + 1, o = { h: 84, fs: 34, style: "width:270px;justify-content:center;" };
  let html;
  if (dark) { o.bg = "#2C2C2E"; o.color = "#fff"; }
  if (s === "redact") { html = `<span style="opacity:0">Clue ${n}</span>`; o.bg = dark ? "#48484A" : "#1D1D1F"; }
  else if (s === "ok") html = `${checkCircle(38)}<span>Clue ${n}</span>`;
  else if (s === "now") html = `<span style="font-weight:700">Clue ${n}/3</span>`;
  else if (s === "past") html = `<span style="color:#86868B">Clue ${n}</span>`;
  else html = `<span style="color:#AEAEB2">Clue ${n}</span>`;
  return chip(html, 117 + i * 288, 190, o);
}).join("");
const nz = s => String(s).replace(/(\d)(?=\d)/g, "$1\u200b"); // keeps years from rolling like counters
const nadia = chip(`${avc("car-05", 60)}<span>${nz("Nadia’s 1972 240Z")}</span>`, 0, 200, { h: 96, fs: 40, style: "left:50%;transform:translateX(-50%)" });

// numbered red dot (hook)
const dot = (x, y, n) => `<div class="abs" style="left:${x - 70}px;top:${y - 70}px;width:140px;height:140px;z-index:8"><div style="position:absolute;inset:0;border-radius:50%;border:5px solid rgba(244,48,52,.35)"></div>
  <div style="position:absolute;left:41px;top:41px;width:58px;height:58px;border-radius:50%;background:#F43034;color:#fff;font-weight:700;font-size:32px;display:grid;place-items:center;box-shadow:0 6px 16px rgba(244,48,52,.4)">${n}</div></div>`;
const tag = (t, x, y) => chip(t, x, y, { h: 76, fs: 38, z: 9 });

// real 6-digit odometer drum (obj/odometer). we overlay the reading; the last wheel is mid-roll (number-wheel)
const odoHero = (x, y, w, digits, roll = true, z = 4) => { const s = w / 1000, cx = [172, 302, 435, 568, 698, 828], h = 165 * s;
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .628}px;z-index:${z}">
  <div style="position:absolute;left:6%;right:6%;bottom:-3%;height:8%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.3),transparent);filter:blur(8px)"></div>
  <img src="${IMG}obj/odometer.png" style="position:relative;width:100%;display:block">
  ${[...digits].map((d, i) => { const last = roll && i === digits.length - 1; return `<div style="position:absolute;left:${(cx[i] - 56) * s}px;top:${205 * s}px;width:${112 * s}px;height:${h}px;overflow:hidden;background:linear-gradient(90deg,#171717,#0b0b0b 50%,#171717);border-radius:${12 * s}px">
    <div style="transform:translateY(${last ? -.42 * h : 0}px);${last ? "filter:blur(1.2px)" : ""}">${[d, ...(last ? [(+d + 1) % 10] : [])].map(v => `<div style="height:${h}px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:${196 * s}px;line-height:1;transform:scaleX(.72)">${v}</div>`).join("")}</div></div>`; }).join("")}</div>`; };

// hand-drawn red circle
const scribble = (cx, cy, rx, ry, rot = -8) => { let d = ""; const n = 90; for (let i = 0; i <= n; i++) { const t = i / n * Math.PI * 2 * 1.12, k = 1 + .05 * Math.sin(t * 3) + i / n * .09; d += (i ? "L" : "M") + (cx + Math.cos(t) * rx * k).toFixed(1) + "," + (cy + Math.sin(t) * ry * k).toFixed(1); }
  return `<svg class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:9;overflow:visible" viewBox="0 0 1080 1920"><path d="${d}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#F43034" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>`; };

const Hbp = (o = {}) => buildPage({ hero: "car-05", title: "Hal’s 1972 Datsun 240Z", owner: "hal.240z", ownerCar: "car-05", meta: "Owner 3 · Public", url: "fuelmybuild.com/hal-240z", tab: "Log", section: "Log · 1989–2025", ...o });
const entry = (img, name, who, date, hl) => ({ img, name, brand: who, date, hl });
const objImg = (n, extra = "") => `<img src="${IMG}obj/${n}.png" style="${extra}">`;
const crop = (extra = "") => `<img src="${IMG}car-05.png" style="position:absolute;width:230%;left:-14%;top:-30%;${extra}">`;
const label = t => `<span class="glass" style="position:absolute;left:14px;bottom:14px;padding:6px 18px;border-radius:24px;font-size:30px;font-weight:600;letter-spacing:-.015em">${t}</span>`;
const numDot = n => `<span style="position:absolute;left:14px;top:14px;width:52px;height:52px;border-radius:50%;background:#F43034;color:#fff;font-weight:700;font-size:30px;display:grid;place-items:center">${n}</span>`;
const thumb = (n, t, x, inner) => card(`<div style="position:relative;height:300px;background:#F5F5F7">${inner}${numDot(n)}${label(t)}</div>`, x, 1210, 300, { pad: 0, z: 6, r: 32, style: "overflow:hidden" });

// ---- hook A (0–2.8 s): the car on a tile, three red dots blink onto it on the beat
add("c3-01", 0.8, `${H(`Three things<br><span class="g">didn’t add up.</span>`, 360, { size: 104 })}${tile(40, 700, 1000, 780)}${cut("car-05", { x: 40, y: 900, w: 1000, z: 3 })}${dot(470, 1024, 1)}${nadia}`, "white", "Hook A (lead). Brian, low and true-crime: “Nadia found three things on her new 240Z that didn’t add up.” Orange 240Z on a white tile, slow lens-zoom. Red dot 1 blinks onto the car on the beat (tick sfx), dots 2 and 3 follow. Named character plus car inside 5 s.");
add("c3-02", 2.0, `${H(`Three things<br><span class="g">didn’t add up.</span>`, 360, { size: 104 })}${tile(40, 640, 1000, 530)}${cut("car-05", { x: 40, y: 700, w: 1000, z: 3 })}${dot(470, 824, 1)}${dot(180, 900, 2)}${dot(660, 796, 3)}
  ${thumb(1, "Odometer", 60, objImg("cluster-scan", "position:absolute;inset:0;width:100%;height:100%;object-fit:cover"))}${thumb(2, "Rear quarter", 390, crop())}${thumb(3, "Dash", 720, objImg("dash-panel", "position:absolute;left:4%;top:12%;width:92%"))}${nadia}`, "white", "All three dots are on (one tick each, rising pitch) and each drops its evidence card below: odometer, rear quarter, dash. Camera: lens-zoom creeps toward the odometer, ready to punch into clue one at 2.8 s. Seam into body line 1.");

// ---- body
add("c3-03", 3.6, `${H(`${R("41,000")} miles.<br><span class="g">On a ’72?</span>`, 360, { size: 104 })}${tile(40, 700, 1000, 800)}${odoHero(90, 840, 900, "041037")}
  ${chip("<span>Odometer</span>", 90, 730, { h: 76, fs: 38, z: 9 })}${chip(`<span>${nz("1972 Datsun 240Z")} · 54 years</span>`, 190, 1400, { h: 84, fs: 38, z: 9 })}${clueChips(["now", "off", "off"])}`, "white", "VO: “Clue one: forty-one thousand miles. On a 1972.” lens-zoom into the real odometer drum; number-wheel rolls to 41,0xx and stops (wheel clicks, one per digit, last one lands with a thunk). Chip: Clue 1/3.");
add("c3-04", 6.8, `${H(`A shade<br><span class="g">too ${R("new")}.</span>`, 360, { size: 104 })}${tile(40, 700, 1000, 800)}${cut("car-05", { x: 40, y: 780, w: 1000, z: 3 })}
  <div class="abs" style="left:100px;top:880px;width:420px;height:260px;border-radius:50%;z-index:4;mix-blend-mode:screen;transform:rotate(-8deg);background:radial-gradient(closest-side,rgba(255,196,110,.85),rgba(255,196,110,0))"></div>${scribble(210, 996, 230, 140, -10)}
  ${card(`<div style="display:flex;align-items:center;justify-content:space-around;font-size:36px;font-weight:600;letter-spacing:-.02em"><div style="display:flex;align-items:center;gap:20px"><div style="width:110px;height:110px;border-radius:50%;background:#E2641B;box-shadow:inset 0 -8px 16px rgba(0,0,0,.15)"></div>Factory<br>orange</div><span style="font-size:90px;color:#86868B;font-weight:500">≠</span><div style="display:flex;align-items:center;gap:20px"><div style="width:110px;height:110px;border-radius:50%;background:#F58A3A;box-shadow:inset 0 -8px 16px rgba(0,0,0,.1)"></div>Rear<br>quarter</div></div>`, 90, 1250, 900, { z: 6, pad: 40 })}${clueChips(["past", "now", "off"])}`, "white", "VO: “Clue two: a weld, too new. Crashed?” whip-pan to the 240Z (whoosh). A red scribble-circle draws around the rear quarter (pen scratch sfx) and a patch of slightly brighter orange shimmers; a swatch card shows the two oranges don’t match. Chip: Clue 2/3.");
add("c3-05", 10.2, `${H(`Who’s ${R("Ray")}?`, 360, { size: 130 })}${cut("obj/dash-panel", { x: 70, y: 690, w: 940, z: 2 })}
  <div class="abs" style="left:190px;top:900px;width:700px;height:433px;z-index:5;transform:rotate(-3deg);filter:drop-shadow(0 16px 20px rgba(0,0,0,.35))">${objImg("masking-tape", "width:100%;display:block")}
    <div style="position:absolute;inset:0;display:grid;place-items:center;font-size:72px;font-weight:600;font-style:italic;letter-spacing:-.025em;line-height:1.1;color:#1F2A44;text-align:center;transform:rotate(-5deg)">ask Ray about<br>the motor.</div></div>${clueChips(["past", "past", "now"])}`, "white", "VO: “Clue three was worse. Tape: ‘Ask Ray.’” Masking tape slaps onto the real dash (paper-wobble, tape rip sfx), the line is handwritten on it (handwrite, pen squeak; the build keeps the text as an overlay). Turn word “worse” lands on the slap. Chip: Clue 3/3.");
add("c3-06", 13.4, `${H(`${R("No")}<br><span class="g">paperwork.</span>`, 360, { size: 104 })}${tile(60, 660, 960, 880)}${cut("obj/manila-folder", { x: 150, y: 700, w: 780, z: 3 })}${clueChips(["redact", "redact", "redact"])}`, "white", "VO: “No paperwork. So who was Ray?” A manila folder opens: empty. All three clue chips go black (caption-redact bars slam shut, one thunk each). 0.5 s of reveal silence after “paperwork”; do not tighten.");
add("c3-07", 16.2, `${H(`Then:<br><span class="g">the ${R("glovebox")}.</span>`, 340, { size: 104, style: "color:#fff;z-index:5" })}
  <div class="abs" style="left:120px;top:610px;width:840px;z-index:3;border-radius:28px;overflow:hidden;box-shadow:0 0 0 2px #2A2A2D,0 50px 90px -30px rgba(0,0,0,.8)">${objImg("glovebox-card", "width:100%;display:block")}</div>
  ${card(`<div style="display:flex;align-items:center;justify-content:space-between">${mark(64)}<span style="font-size:32px;color:#86868B">Every owner. Every repair.</span></div>
    <div style="font-size:54px;font-weight:600;letter-spacing:-.025em;margin-top:44px;white-space:nowrap">${nz("fuelmybuild.com/hal-240z")}${caret}</div>`, 150, 1170, 780, { z: 7, pad: 44, style: "transform:rotate(-2deg)" })}${clueChips(["redact", "redact", "redact"], true)}`, "bg-black", "VO: “Then: the glovebox.” Hard cut into the one dark beat (whole frame dark). The card slides out of the glovebox and lifts into white light (latch click, slide). Typewriter with red caret types fuelmybuild.com/hal-240z (key ticks). Chips dim for the dark frame.");
add("c3-08", 18.6, `${H(`Rolled over.<br><span class="g">${R("1991")}.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("car-05", "Odometer rolled over", "Hal · owner", "1991", true), entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017"), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019")],
    sheet: logSheet({ title: "Odometer rolled over", date: "1991", by: "Hal (owner)", byMono: "H", h: 480, photos: [],
      extra: `<div style="margin-top:10px;height:150px;border-radius:14px;overflow:hidden;position:relative">${objImg("cluster-scan", "position:absolute;left:0;top:-30%;width:100%")}</div><div class="fn sec" style="margin-top:6px">Cluster scan · 99,999 → 0</div>` }) }), { x: 40, y: 600, w: 560 })}
  ${cut("obj/cluster-scan", { x: 560, y: 1010, w: 470, rot: 4, z: 6 })}${clueChips(["ok", "redact", "redact"])}`, "gray", "VO: “Hal logged everything. Odometer: rolled over, 1991.” FMB turn (17 s, 57%). push-through from the card into Hal’s build page in the iPhone frame. The log sheet slides up and the scanned cluster photo pops out beside the phone (spring + paper slide). Clue chip 1 unredacts (bar pulls away, caption-redact) and gets a red check (chime).");
add("c3-09", 21.4, `${H(`Shop-signed.<br><span class="g">And ${bar(150)}?</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("car-05", "Odometer rolled over", "Hal · owner", "1991"), entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017", true), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019")],
    sheet: logSheet({ title: "Rear quarter rust repair", date: "Apr 2017", by: "Coastline Body", byMono: "C", h: 480, photos: [],
      extra: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px">${["Before", "After"].map((l, i) => `<div style="position:relative;overflow:hidden;border-radius:14px;height:124px;background:linear-gradient(160deg,#F7F7F9,#E4E4EA)"><img src="${IMG}car-05.png" style="position:absolute;width:210%;left:-6%;top:-4px">${i ? "" : `<div style="position:absolute;left:12%;top:46%;width:64px;height:40px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,60,20,.75),transparent)"></div>`}<span class="glass" style="position:absolute;left:8px;bottom:8px;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:600">${l}</span></div>`).join("")}</div>` }) }), { x: 40, y: 600, w: 560 })}
  ${card(`<div style="position:relative;height:270px;background:#F5F5F7">${crop("filter:saturate(.8) brightness(.95)")}<div style="position:absolute;left:11%;top:42%;width:150px;height:90px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,60,20,.75),transparent)"></div>${label("Before")}</div>`, 590, 960, 430, { pad: 0, z: 6, r: 32, style: "overflow:hidden;transform:rotate(3deg)" })}
  ${card(`<div style="position:relative;height:270px;background:#F5F5F7">${crop()}${label("After")}</div>`, 590, 1250, 430, { pad: 0, z: 7, r: 32, style: "overflow:hidden;transform:rotate(-2deg)" })}${clueChips(["ok", "ok", "redact"])}`, "gray", "VO: “Weld: rust repair, 2017, shop-signed. And Ray?” Entry two opens: before/after photos spring out beside the phone, “Work by Coastline Body”. Chip 2 checks (chime, pitch up). Then “Ray” rises as a black bar, still redacted (low tone).");
add("c3-10", 24.0, `${H(`Ray ${R("rebuilt")}<br><span class="g">the motor.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017"), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019", true)],
    sheet: logSheet({ title: "Engine rebuild", date: "Jun 2019", by: "Ray (mechanic)", byMono: "R", h: 520, photos: ["mech", "part-04", "part-05"],
      extra: `<div style="margin-top:10px;border-radius:14px;background:var(--grouped);overflow:hidden">${[["part-07", "Pistons"], ["part-04", "Carbs"]].map(([im, n], i) => `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;${i ? "border-top:.5px solid var(--sep)" : ""}">${ph(im, "", 36, 36, { r: 9, inset: 4 })}<div><div class="sh" style="font-weight:500">${n}</div><div class="fn sec">{brand}</div></div></div>`).join("")}</div>` }) }), { x: 40, y: 600, w: 560 })}
  ${cut("mech", { x: 590, y: 1000, w: 440, z: 6 })}${chip(`<span>Logged by Ray</span>${seal(30)}`, 580, 1430, { h: 100, fs: 38, z: 9 })}${clueChips(["ok", "ok", "ok"])}`, "gray", "VO: “Ray rebuilt the motor. Logged it himself.” Character reveal: the veteran mechanic’s face at last (the first face in the film; he steps in beside the phone, warm swell under the VO). Parts rows land: Pistons, Carbs. Chip 3 checks, all three red checks held (resolve chord).");
add("c3-11", 26.4, `${H(`Keep<br><span class="g">${R("writing")}.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019"), entry("car-05", "Handover", "Hal · owner", "Oct 2025", true)], sheet: logSheet({ title: "Handover", date: "Oct 2025", by: "Hal (owner)", byMono: "H", h: 420, photos: [] }) }), { x: 250, y: 600, w: 580 })}
  ${card(`<div style="font-size:52px;font-weight:600;line-height:1.14;letter-spacing:-.025em">She’s yours now.<br>Keep writing.${caret}</div>`, 100, 960, 880, { z: 9, pad: 44 })}
  ${chip(`${avc("car-05", 64)}<span>Owner 4 · Nadia</span>`, 250, 1420, { h: 100, fs: 38, z: 9 })}${clueChips(["ok", "ok", "ok"])}`, "gray", "VO (pause 0.4 s before the quote): “Hal’s last entry: ‘Keep writing.’” The final entry types out (typewriter, red caret, key ticks), then the owner row springs in: Owner 4 · Nadia. (confirm: ownership transfer. If it isn’t live, end on Hal’s entry; drop the owner chip.) Held breath, then music resolves.");
add("c3-12", 28.4, `${tile(110, 290, 860, 600)}${cut("car-05", { x: 130, y: 380, w: 820, z: 3 })}${odoHero(540, 690, 400, "041037", false, 6)}${endCard("Owner five won’t have to guess.", "fuelmybuild.com", { top: 1010 })}`, "white", "CTA (Brian): “Owner five won’t have to guess. fuelmybuild.com.” Wide: the 240Z on its tile, the small odometer (same as the clue-one zoom target) fades in so the replay re-opens the case. Logo, URL in red.");

window.META = { reel: "C3", title: "Owner number four", lead: "A", voice: "Brian (narrator)",
  remocn: ["number-wheel (odometer)", "caption-redact (clue chips, redacted name)", "scribble-circle (rear quarter)", "handwrite + paper-wobble (tape)", "typewriter (URL, Hal’s entry, red caret)", "lens-zoom (hook into clue one)", "whip-pan", "push-through", "paper-sticker (tape on the dash)"],
  newCutouts: [] };
