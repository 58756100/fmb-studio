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
const nadia = chip(`${avc("car-05", 60)}<span>Nadia’s 1972 240Z</span>`, 0, 200, { h: 96, fs: 40, style: "left:50%;transform:translateX(-50%)" });

// numbered red dot (hook)
const dot = (x, y, n) => `<div class="abs" style="left:${x - 70}px;top:${y - 70}px;width:140px;height:140px;z-index:8"><div style="position:absolute;inset:0;border-radius:50%;border:5px solid rgba(244,48,52,.35)"></div>
  <div style="position:absolute;left:41px;top:41px;width:58px;height:58px;border-radius:50%;background:#F43034;color:#fff;font-weight:700;font-size:32px;display:grid;place-items:center;box-shadow:0 6px 16px rgba(244,48,52,.4)">${n}</div></div>`;
const tag = (t, x, y) => chip(t, x, y, { h: 76, fs: 38, z: 9 });

// odometer cells (number-wheel). roll = last wheel mid-turn
const odo = (digits, x, y, s = 1, roll = true, z = 7) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:${z};display:flex;gap:${6 * s}px;padding:${9 * s}px;border-radius:${16 * s}px;background:#2A2A2D;box-shadow:0 ${18 * s}px ${36 * s}px -${14 * s}px rgba(0,0,0,.4)">
  ${[...digits].map((d, i) => { const last = roll && i === digits.length - 1, h = 106 * s; return `<div style="position:relative;width:${76 * s}px;height:${h}px;background:#111;border-radius:${8 * s}px;overflow:hidden;color:#fff;font-weight:600;font-size:${80 * s}px;font-variant-numeric:tabular-nums">
    <div style="position:absolute;left:0;right:0;top:0;transform:translateY(${last ? -.4 * h : 0}px);${last ? "filter:blur(1px)" : ""}">${[d, (+d + 1) % 10].slice(0, last ? 2 : 1).map(v => `<div style="height:${h}px;display:grid;place-items:center">${v}</div>`).join("")}</div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45),transparent 30%,transparent 70%,rgba(0,0,0,.45))"></div></div>`; }).join("")}</div>`;

// speedometer face with the odometer window
const gauge = (cx, cy, r, digits) => {
  let svg = "";
  for (let v = 0; v <= 140; v += 10) {
    const a = (210 - v / 140 * 240) * Math.PI / 180, major = v % 20 === 0, c = Math.cos(a), s = Math.sin(a);
    svg += `<line x1="${r + c * r * (major ? .80 : .86)}" y1="${r - s * r * (major ? .80 : .86)}" x2="${r + c * r * .93}" y2="${r - s * r * .93}" stroke="#1D1D1F" stroke-width="${major ? 7 : 3.5}" stroke-linecap="round"/>`;
    if (major) svg += `<text x="${r + c * r * .64}" y="${r - s * r * .64 + 14}" text-anchor="middle" font-size="40" font-weight="600" fill="#1D1D1F" font-family="Inter">${v}</text>`;
  }
  const na = 210 * Math.PI / 180;
  svg += `<line x1="${r}" y1="${r}" x2="${r + Math.cos(na) * r * .5}" y2="${r - Math.sin(na) * r * .5}" stroke="#1D1D1F" stroke-width="10" stroke-linecap="round"/><circle cx="${r}" cy="${r}" r="${r * .07}" fill="#1D1D1F"/>
    <text x="${r}" y="${r + r * .3}" text-anchor="middle" font-size="32" font-weight="500" fill="#86868B" font-family="Inter">mph</text>`;
  return `<div class="abs" style="left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:#fff;box-shadow:0 0 0 14px #1D1D1F,0 50px 100px -30px rgba(0,0,0,.35);z-index:3"><svg width="${2 * r}" height="${2 * r}" viewBox="0 0 ${2 * r} ${2 * r}">${svg}</svg></div>
    ${odo(digits, cx - 209, cy + r * .5, .9, true, 4)}`;
};

// hand-drawn red circle
const scribble = (cx, cy, rx, ry, rot = -8) => { let d = ""; const n = 90; for (let i = 0; i <= n; i++) { const t = i / n * Math.PI * 2 * 1.12, k = 1 + .05 * Math.sin(t * 3) + i / n * .09; d += (i ? "L" : "M") + (cx + Math.cos(t) * rx * k).toFixed(1) + "," + (cy + Math.sin(t) * ry * k).toFixed(1); }
  return `<svg class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:9;overflow:visible" viewBox="0 0 1080 1920"><path d="${d}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#F43034" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>`; };

// masking tape on a dash panel (drawn; new cutout requested)
const zig = side => Array.from({ length: 13 }, (_, i) => `${side === "l" ? (i % 2 ? 1.2 : 0) : (i % 2 ? 98.8 : 100)}% ${(i / 12 * 100).toFixed(1)}%`);
const tapeStrip = `<div class="abs" style="left:150px;top:900px;width:780px;height:300px;z-index:5;transform:rotate(-2.5deg);filter:drop-shadow(0 14px 18px rgba(0,0,0,.22))">
  <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ECDFBC,#ECDFBC 7px,#E7D9B3 7px,#E7D9B3 9px);clip-path:polygon(${zig("l").join(",")},${zig("r").reverse().join(",")})"></div>
  <div style="position:absolute;left:0;right:0;top:0;bottom:0;display:grid;place-items:center;font-size:84px;font-weight:600;font-style:italic;letter-spacing:-.025em;line-height:1.1;color:#1F2A44;text-align:center;transform:rotate(1deg)">ask Ray about<br>the motor.</div></div>`;
const dash = `<div class="abs" style="left:70px;top:720px;width:940px;height:680px;border-radius:44px;background:linear-gradient(180deg,#E2E2E7,#D4D4DA);z-index:2;box-shadow:inset 0 2px 0 rgba(255,255,255,.7),0 40px 90px -36px rgba(0,0,0,.35)"></div>
  <div class="abs" style="left:130px;top:770px;width:820px;height:46px;border-radius:23px;z-index:3;background:repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 3px,transparent 3px 22px)"></div>`;

// open manila folder, empty
const folder = (x, y, w) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .7}px;z-index:3;filter:drop-shadow(0 40px 40px rgba(0,0,0,.22))">
  <div style="position:absolute;left:0;top:-52px;width:${w * .32}px;height:70px;border-radius:24px 24px 0 0;background:#D8B472;display:flex;align-items:flex-start;padding:8px 0 0 30px;font-size:30px;font-weight:600;color:#6E5530">Paperwork</div>
  <div style="position:absolute;inset:0;border-radius:6px 28px 28px 28px;background:#D8B472"></div>
  <div style="position:absolute;left:3%;top:5%;width:46%;bottom:5%;border-radius:10px 0 0 10px;background:linear-gradient(90deg,#EFD9A5,#E6CB92);box-shadow:inset -22px 0 30px -18px rgba(90,60,10,.35)"></div>
  <div style="position:absolute;right:3%;top:5%;width:46%;bottom:5%;border-radius:0 10px 10px 0;background:linear-gradient(270deg,#EFD9A5,#E8CD96);box-shadow:inset 22px 0 30px -18px rgba(90,60,10,.35)"></div></div>`;

const Hbp = (o = {}) => buildPage({ hero: "car-05", title: "Hal’s 1972 Datsun 240Z", owner: "hal.240z", ownerCar: "car-05", meta: "Owner 3 · Public", url: "fuelmybuild.com/hal-240z", tab: "Log", section: "Log · 1989–2025", ...o });
const mini = d => `<div style="display:flex;gap:3px;padding:4px;border-radius:7px;background:#2A2A2D">${[...d].map(c => `<div style="width:24px;height:34px;border-radius:4px;background:#111;color:#fff;display:grid;place-items:center;font-weight:600;font-size:24px">${c}</div>`).join("")}</div>`;
const entry = (img, name, who, date, hl) => ({ img, name, brand: who, date, hl });

// ---- hook A (0–2.8 s): the car on a tile, three red dots blink onto it on the beat
const hookCar = `${tile(40, 640, 1000, 860, 56)}${cut("car-05", { x: 60, y: 880, w: 960, z: 3 })}`;
add("c3-01", 0.8, `${nadia}${H(`Three things<br><span class="g">didn’t add up.</span>`, 360, { size: 104 })}${hookCar}${dot(473, 999, 1)}`, "white", "Hook A (lead). Brian, low and true-crime: “Nadia found three things on her new 240Z that didn’t add up.” Orange 240Z on a white tile, slow lens-zoom. Red dot 1 blinks onto the car on the beat (tick sfx), dots 2 and 3 follow. Named character plus car inside 5 s.");
add("c3-02", 2.0, `${nadia}${H(`Three things<br><span class="g">didn’t add up.</span>`, 360, { size: 104 })}${hookCar}${dot(473, 999, 1)}${dot(194, 1072, 2)}${dot(655, 972, 3)}
  ${tag("Odometer", 150, 800)}${tag("Rear quarter", 80, 1260)}${tag("Dash", 740, 800)}`, "white", "All three dots are on (one tick each, rising pitch). Camera: lens-zoom creeps toward the odometer, ready to punch into clue one at 2.8 s. Seam into body line 1.");

// ---- body
add("c3-03", 3.6, `${clueChips(["now", "off", "off"])}${H(`${R("41,000")} miles.<br><span class="g">On a ’72?</span>`, 360, { size: 104 })}${gauge(540, 1140, 370, "41037")}`, "white", "VO: “Clue one: forty-one thousand miles. On a 1972.” lens-zoom into a drawn five-digit odometer; number-wheel rolls to 41,0xx and stops (wheel clicks, one per digit, last one lands with a thunk). Chip: Clue 1/3.");
add("c3-04", 6.8, `${clueChips(["past", "now", "off"])}${H(`A shade<br><span class="g">too ${R("new")}.</span>`, 360, { size: 104 })}
  ${tile(40, 760, 1000, 740, 56)}${cut("car-05", { x: 40, y: 960, w: 1000, z: 3 })}
  <div class="abs" style="left:120px;top:1050px;width:420px;height:260px;border-radius:50%;z-index:4;mix-blend-mode:screen;transform:rotate(-8deg);background:radial-gradient(closest-side,rgba(255,196,110,.85),rgba(255,196,110,0))"></div>${scribble(250, 1190, 230, 140, -10)}`, "white", "VO: “Clue two: a weld, too new. Crashed?” whip-pan to the 240Z (whoosh). A red scribble-circle draws around the rear quarter (pen scratch sfx) and a patch of slightly brighter orange shimmers. Chip: Clue 2/3.");
add("c3-05", 10.2, `${clueChips(["past", "past", "now"])}${H(`Who’s ${R("Ray")}?`, 360, { size: 130 })}${dash}${tapeStrip}`, "white", "VO: “Clue three was worse. Tape: ‘Ask Ray.’” Masking tape slaps onto the dash (paper-wobble, tape rip sfx), the line is handwritten on it (handwrite, pen squeak). Turn word “worse” lands on the slap. Chip: Clue 3/3. The build keeps the type in Inter-weight handwrite.");
add("c3-06", 13.4, `${clueChips(["redact", "redact", "redact"])}${H(`${R("No")}<br><span class="g">paperwork.</span>`, 360, { size: 104 })}${folder(110, 860, 860)}`, "white", "VO: “No paperwork. So who was Ray?” A manila folder opens: empty. All three clue chips go black (caption-redact bars slam shut, one thunk each). 0.5 s of reveal silence after “paperwork”; do not tighten.");
add("c3-07", 16.2, `<div class="abs" style="left:0;top:0;width:1080px;height:790px;background:#0D0D0F;z-index:1"></div>${clueChips(["redact", "redact", "redact"], true)}
  ${H(`Then:<br><span class="g">the ${R("glovebox")}.</span>`, 340, { size: 104, style: "color:#fff;z-index:5" })}
  <div class="abs" style="left:90px;top:640px;width:900px;height:84px;border-radius:42px;background:#000;box-shadow:inset 0 3px 10px rgba(255,255,255,.08),0 0 0 3px #232326;z-index:6"></div>
  ${card(`<div style="display:flex;align-items:center;justify-content:space-between">${mark(64)}<span style="font-size:30px;color:#86868B">Every owner. Every repair.</span></div>
    <div style="font-size:54px;font-weight:600;letter-spacing:-.025em;margin-top:150px;white-space:nowrap">fuelmybuild.com/hal-240z${caret}</div>`, 140, 700, 800, { z: 4, pad: 44, style: "height:520px;transform:rotate(-2deg)" })}`, "white", "VO: “Then: the glovebox.” Hard cut into the one dark beat. A small card slides out of the dark slot into white light (latch click, slide). Typewriter with red caret types fuelmybuild.com/hal-240z (key ticks). Chips dim for the dark frame.");
add("c3-08", 18.6, `${clueChips(["ok", "redact", "redact"])}${H(`Rolled over.<br><span class="g">${R("1991")}.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("car-05", "Odometer rolled over", "Hal · owner", "1991", true), entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017"), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019")],
    sheet: logSheet({ title: "Odometer rolled over", date: "1991", by: "Hal (owner)", byMono: "H", h: 480, photos: [],
      extra: `<div style="margin-top:10px;height:150px;border-radius:14px;background:linear-gradient(160deg,#D0D0D5,#B4B4BB);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">${mini("00012")}<div class="fn" style="color:#3C3C43">Cluster scan · 99,999 → 0</div></div>` }) }), { x: 250, y: 600, w: 580 })}`, "gray", "VO: “Hal logged everything. Odometer: rolled over, 1991.” FMB turn (17 s, 57%). push-through from the card into Hal’s build page in the iPhone frame. The log sheet slides up with the scanned cluster photo. Clue chip 1 unredacts (bar pulls away, caption-redact) and gets a red check (chime).");
add("c3-09", 21.4, `${clueChips(["ok", "ok", "redact"])}${H(`Shop-signed.<br><span class="g">And ${bar(150)}?</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("car-05", "Odometer rolled over", "Hal · owner", "1991"), entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017", true), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019")],
    sheet: logSheet({ title: "Rear quarter rust repair", date: "Apr 2017", by: "Coastline Body", byMono: "C", h: 480, photos: [],
      extra: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px">${["Before", "After"].map((l, i) => `<div style="position:relative;overflow:hidden;border-radius:14px;height:124px;background:linear-gradient(160deg,#F7F7F9,#E4E4EA)"><img src="${IMG}car-05.png" style="position:absolute;width:210%;left:-6%;top:-4px;${i ? "" : "filter:saturate(.8) brightness(.95)"}">${i ? "" : `<div style="position:absolute;left:12%;top:46%;width:64px;height:40px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,60,20,.75),transparent)"></div>`}<span class="glass" style="position:absolute;left:8px;bottom:8px;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:600">${l}</span></div>`).join("")}</div>` }) }), { x: 250, y: 600, w: 580 })}`, "gray", "VO: “Weld: rust repair, 2017, shop-signed. And Ray?” Entry two opens: before/after photos, “Work by Coastline Body”. Chip 2 checks (chime, pitch up). Then “Ray” rises as a black bar, still redacted (low tone).");
add("c3-10", 24.0, `${clueChips(["ok", "ok", "ok"])}${H(`Ray ${R("rebuilt")}<br><span class="g">the motor.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("part-04", "Rear quarter rust repair", "Coastline Body", "Apr 2017"), entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019", true)],
    sheet: logSheet({ title: "Engine rebuild", date: "Jun 2019", by: "Ray (mechanic)", byMono: "R", h: 520, photos: ["mech", "part-04", "part-05"],
      extra: `<div style="margin-top:10px;border-radius:14px;background:var(--grouped);overflow:hidden">${[["part-07", "Pistons"], ["part-04", "Carbs"]].map(([im, n], i) => `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;${i ? "border-top:.5px solid var(--sep)" : ""}">${ph(im, "", 36, 36, { r: 9, inset: 4 })}<div><div class="sh" style="font-weight:500">${n}</div><div class="fn sec">{brand}</div></div></div>`).join("")}</div>` }) }), { x: 250, y: 600, w: 580 })}
  ${chip(`${ph("mech", "", 76, 76, { r: 38, inset: 0, fit: "cover" })}<span>Logged by Ray</span>${seal(30)}`, 150, 740, { h: 108, fs: 38, z: 9 })}`, "gray", "VO: “Ray rebuilt the motor. Logged it himself.” Character reveal: the veteran mechanic’s face at last (the first face in the film; warm swell under the VO). Parts rows land: Pistons, Carbs. Chip 3 checks, all three red checks held (resolve chord).");
add("c3-11", 26.4, `${clueChips(["ok", "ok", "ok"])}${H(`Keep<br><span class="g">${R("writing")}.</span>`, 340, { size: 104 })}
  ${device(Hbp({ rows: [entry("mech", "Engine rebuild", "Ray · mechanic", "Jun 2019"), entry("car-05", "Handover", "Hal · owner", "Oct 2025", true)], sheet: logSheet({ title: "Handover", date: "Oct 2025", by: "Hal (owner)", byMono: "H", h: 420, photos: [] }) }), { x: 250, y: 600, w: 580 })}
  ${card(`<div style="font-size:52px;font-weight:600;line-height:1.14;letter-spacing:-.025em">She’s yours now.<br>Keep writing.${caret}</div>`, 100, 960, 880, { z: 9, pad: 44 })}
  ${chip(`${avc("car-05", 64)}<span>Owner 4 · Nadia</span>`, 250, 1420, { h: 100, fs: 38, z: 9 })}`, "gray", "VO (pause 0.4 s before the quote): “Hal’s last entry: ‘Keep writing.’” The final entry types out (typewriter, red caret, key ticks), then the owner row springs in: Owner 4 · Nadia. (confirm: ownership transfer. If it isn’t live, end on Hal’s entry; drop the owner chip.) Held breath, then music resolves.");
add("c3-12", 28.4, `${tile(110, 250, 860, 470, 56)}${cut("car-05", { x: 160, y: 330, w: 760, z: 3 })}${odo("41037", 560, 650, .6, false, 6)}${endCard("Owner five won’t have to guess.", "fuelmybuild.com", { top: 860 })}`, "white", "CTA (Brian): “Owner five won’t have to guess. fuelmybuild.com.” Wide: the 240Z on its tile, the small odometer (same as the clue-one zoom target) fades in so the replay re-opens the case. Logo, URL in red.");

window.META = { reel: "C3", title: "Owner number four", lead: "A", voice: "Brian (narrator)",
  remocn: ["number-wheel (odometer)", "caption-redact (clue chips, redacted name)", "scribble-circle (rear quarter)", "handwrite + paper-wobble (tape)", "typewriter (URL, Hal’s entry, red caret)", "lens-zoom (hook into clue one)", "whip-pan", "push-through", "paper-sticker (tape on the dash)"],
  newCutouts: [["masking-tape", "A strip of cream masking tape with torn ends, slightly crinkled, studio product photo on pure white, no background, soft contact shadow, top-down, high detail (handwriting is added in the edit)"], ["manila-folder", "An open empty manila file folder with a tab, studio product photo on pure white, no background, soft contact shadow, top-down, high detail"], ["glovebox-card", "A plain white business-size card with a small red logo mark and blank space for a typed web address, slightly sliding out of a dark car glovebox slot, studio photo, soft shadow"], ["cluster-scan", "A scanned vintage photo print of a 1970s Datsun 240Z instrument cluster, speedometer and odometer reading 00012, slightly faded, studio photo on pure white, no background"], ["dash-panel", "A closeup of a 1972 Datsun 240Z dashboard top pad in grey vinyl, empty, studio product photo on pure white, no background, soft contact shadow"]] };
