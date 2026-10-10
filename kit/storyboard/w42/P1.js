// P1 · After checkout — storyboard key frames (lead hook A). Times are from the beat sheet; the build retimes to words.json.
// Spine 1: one red dashed route line (out of the box, past "Delivered", onto the Supra). Spine 2: the A-2207 chip in the headline band.
const spine = (val, state = "ink") => chip(`<span style="color:var(--label2);font-weight:500">A-2207</span><span style="font-variant-numeric:tabular-nums;color:${state === "red" ? "#F43034" : "#1D1D1F"}">${val}</span>`, 0, 210, { h: 92, fs: 44, style: "left:50%;transform:translateX(-50%)" });
const route = (d, o = {}) => `<svg class="abs" style="left:0;top:0;z-index:${o.z || 5}" width="1080" height="1920" viewBox="0 0 1080 1920"><path d="${d}" fill="none" stroke="#F43034" stroke-width="${o.w || 8}" stroke-dasharray="${o.dash || "24 22"}" stroke-linecap="round"/>${o.end || ""}</svg>`;
const star = (s = 56, c = "#1D1D1F") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="flex:none"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" fill="${c}" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
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

// ---- hook A (0–2.5 s): the turbo drops into the box, the lid snaps, a red dashed line leaves
add("p1-01", 0.4, `${H(`We tried to follow<br><span class="g">one turbo</span>`, 360, { size: 96 })}
  ${cut("obj/shipping-box-open", { x: 190, y: 930, w: 700, z: 3 })}
  ${cut("part-01", { x: 330, y: 700, w: 420, z: 4, shadow: false })}`, "studio", "Hook A. VO (Eric): “We tried to follow one turbo…” Turbo kit drops into the white box on a spring; flaps flutter. Paper-rustle + thud.");
add("p1-02", 1.6, `${H(`after it<br><span class="g">shipped.</span>`, 360, { size: 96 })}
  ${cut("obj/shipping-box-closed", { x: 150, y: 940, w: 700, z: 3 })}
  ${route("M830,1300 C960,1300 1020,1180 1120,1040", { w: 9 })}`, "studio", "Lid snaps shut (tape-rip + snap sfx). The red dashed line draws out of the box toward the frame edge (SVG stroke-dashoffset). Spine starts here.");
add("p1-03", 3.4, `${H(`A Korvane turbo.<br><span class="g">Shipped March 2nd.</span>`, 360, { size: 92 })}
  <div class="abs" style="left:110px;top:700px;z-index:5">${orderCard({ id: "A-2207", item: "Korvane turbo kit", img: "part-01", steps: [["Shipped", "Mar 2"], ["In transit", "Mar 4"], ["Delivered", "Mar 6"]], done: 1, w: 860 })}</div>
  ${cut("part-01", { x: 270, y: 1130, w: 540 })}
  ${spine("Shipped")}`, "studio", "drawer: the order card slides up from the bottom (glass sheet spring). VO: “Order A-2207: a Korvane turbo, shipped March 2nd.” Chip taps in with a soft tick.");
add("p1-04", 6.6, `${H(`Then<br><span class="g">nothing.</span>`, 360, { size: 104 })}
  <div class="abs" style="left:60px;top:760px;z-index:5">${orderCard({ id: "A-2207", item: "Korvane turbo kit", img: "part-01", steps: [["Shipped", "Mar 2"], ["In transit", "Mar 4"], ["Delivered", "Mar 6"]], done: 3, w: 700 })}</div>
  ${cut("obj/shipping-box-closed", { x: 70, y: 1200, w: 420, z: 3 })}
  ${route("M682,947 L790,947 C940,947 1010,1010 950,1130 C890,1250 640,1200 700,1330 C750,1440 920,1440 1120,1560", { w: 9 })}
  ${spine("Delivered")}`, "studio", "Timeline dots tick Shipped → In transit → Delivered (three ticks). Then the red dashed line keeps going past the last dot and wanders off into empty white. Music cuts for “Then: nothing.”");
const gridCars = ["car-11", "car-15", "car-07", "car-13", "car-04", "car-05", "car-01", "car-12", "car-09"];
const gx = 89, gy = 640, gw = 290, gg = 16, gpos = i => [gx + (i % 3) * (gw + gg), gy + Math.floor(i / 3) * (gw + gg)];
const gridHtml = gridCars.map((c, i) => { const [x, y] = gpos(i); return `<div class="abs" style="left:${x}px;top:${y}px;z-index:2">${ph(c, "", gw, gw, { r: 26, inset: 6 })}</div>`; }).join("");
add("p1-05", 9.6, `${H(`Tagged posts.<br><span class="g">None say whose.</span>`, 360, { size: 96 })}
  ${gridHtml}
  ${[0, 1, 5].map(i => { const [x, y] = gpos(i); return chip("turbo?", x + 70, y + 18, { h: 58, fs: 30, z: 7 }); }).join("")}
  ${stamp("Dead end", 330, 1230, -7)}${cursor(560, 1060)}
  ${spine("Clue 1/3")}`, "gray", "Counter number-wheel rolls 0/3 → 1/3. Grid fills with tagged cars (stagger 4 frames); simulated-cursor hovers each tile, “turbo?” tooltips pop. “Dead end” stamp slams 1.15 → 1.0 with a 2-frame shake. Clue ding.");
add("p1-06", 12.6, `${H(`The review.<br><span class="g">Deadpan.</span>`, 360, { size: 100 })}
  <div class="abs" style="left:90px;top:660px;z-index:5;width:900px;border-radius:40px;background:#fff;padding:44px 46px 52px;box-shadow:0 40px 90px -30px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04)">
    <div style="display:flex;align-items:center;gap:22px">${ph("part-01", "", 110, 110, { r: 22, inset: 4 })}<div><div style="font-size:38px;font-weight:600;letter-spacing:-.02em">Korvane turbo kit</div><div style="font-size:28px;color:var(--label2);margin-top:2px">Verified purchase</div></div></div>
    <div style="display:flex;gap:10px;margin-top:40px">${[0, 1, 2, 3, 4].map(() => star(66)).join("")}</div>
    <div style="font-size:104px;font-weight:600;letter-spacing:-.04em;margin-top:22px;line-height:1">Arrived fast.${caret}</div>
    <div style="font-size:28px;color:var(--label2);margin-top:30px">1 review</div></div>
  ${cut("part-01", { x: 230, y: 1250, w: 460 })}
  ${stamp("Dead end", 580, 1170, 6)}
  ${spine("Clue 2/3")}`, "gray", "Counter rolls to 2/3. Review types in (typewriter, slow cadence, red caret) so “Arrived fast.” lands on the VO; hold, deadpan. Stamp slams after the pause (the laugh).");
add("p1-07", 15.6, `${H(`So we searched<br><span class="g">the part.</span>`, 360, { size: 96 })}
  <div class="abs" style="left:90px;top:700px;width:900px;height:132px;border-radius:66px;background:var(--fill);z-index:5;display:flex;align-items:center;gap:22px;padding:0 44px">${ic("search", 54, "#86868B", 2.2)}<span style="font-size:58px;font-weight:500;letter-spacing:-.03em">Korvane turbo kit${caret}</span></div>
  <svg class="abs" style="left:480px;top:960px;z-index:5" width="120" height="120" viewBox="0 0 24 24">${Array.from({ length: 12 }, (_, i) => `<rect x="11.1" y="2" width="1.8" height="5.4" rx=".9" fill="#1D1D1F" opacity="${(0.12 + i * .075).toFixed(2)}" transform="rotate(${i * 30} 12 12)"/>`).join("")}</svg>
  ${[0, 1, 2].map(i => `<div class="abs" style="left:90px;top:${1190 + i * 120}px;width:900px;height:88px;display:flex;align-items:center;gap:22px;opacity:${1 - i * .25}"><div style="width:88px;height:88px;border-radius:20px;background:var(--fill)"></div><div style="flex:1"><div style="height:24px;width:${[56, 44, 50][i]}%;border-radius:12px;background:var(--fill)"></div><div style="height:20px;width:${[34, 26, 30][i]}%;border-radius:10px;background:var(--fill2);margin-top:12px"></div></div></div>`).join("")}
  ${cursor(790, 780)}
  ${spine("Clue 3/3")}`, "white", "Hard cut to pure white (visual reset). Counter 3/3. simulated-cursor clicks the bar, typewriter types “Korvane turbo kit” with the red caret, spinner turns. Key-click per character; room tone drops to near silence before the reveal.");
add("p1-08", 18.6, `${H(`Found it.<br><span class="g">A white ’99 Supra.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "ohio.supra", meta: "Public", url: "fuelmybuild.com/ohio-supra", section: "Installed · 24 parts",
    rows: [{ img: "part-01", name: "Turbo kit", brand: "Korvane", red: true, date: "Installed Mar 14", hl: true, sub: "Kessler Motorsport" }, { img: "part-06", name: "Brake kit", brand: "Installed Jun 2", date: "", sub: "Kessler Motorsport" }, { img: "part-04", name: "Intake", brand: "Installed Mar 28", date: "", sub: "Kessler Motorsport" }] }), { x: 240, y: 640, w: 600 })}
  ${chip(`${avm("K", 44)}Kessler Motorsport`, 40, 1260, { h: 72, fs: 30, z: 20, style: "color:#424245" })}
  ${spine("Found it", "red")}`, "studio", "FMB turn (17.5 s, 56%). push-through from the search result into the iOS 26 build page; 0.6 s reveal silence first. Parts row lights red (seal + “Korvane”); Kessler garage chip pops in neutral grey. Whoosh + soft chime.");
add("p1-09", 21.6, `${H(`The owner<br><span class="g">logs everything.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "ohio.supra", meta: "Public", url: "fuelmybuild.com/ohio-supra", tab: "Log", section: "Log · newest first", scroll: 120,
    rows: [{ img: "car-02", name: "Dyno day", brand: "Jul 9", date: "Kessler Motorsport" }, { img: "part-04", name: "Boost leak fixed", brand: "Mar 28", date: "Kessler Motorsport" }, { img: "part-01", name: "Turbo install", brand: "Mar 14", date: "Kessler Motorsport" }] }), { x: 240, y: 640, w: 600 })}${touch(560, 1400)}
  ${spine("Still logging")}`, "gray", "Thumb scroll (no cursor); entries slide up with their dates rolling forward Mar 14 → Mar 28 → Jul 9 (number-wheel on the date). Photo thumbs stagger in. Scroll-swish + tick per entry.");
add("p1-10", 24.6, `${H(`And it links<br><span class="g">back to Korvane.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "ohio.supra", meta: "Public", tab: "Parts", section: "Installed · 24 parts", rows: [{ img: "part-01", name: "Turbo kit", brand: "Korvane", red: true, date: "Installed Mar 14", hl: true }, { img: "part-06", name: "Brake kit", brand: "Installed Jun 2", date: "" }] }), { x: -330, y: 700, w: 560, rot: "rotate(-5deg)", z: "filter:blur(7px);opacity:.55;" })}
  ${device(supplierPage({ mono: "K", name: "Korvane Turbo", short: "Korvane", sub: "Verified supplier · Turbo kits", count: "1 build", builds: [{ img: "car-01", tag: "ohio.supra", badge: "New", hl: true }, { img: "car-11" }, { img: "car-13" }], parts: [{ img: "part-01", name: "Turbo kit", meta: "Korvane" }, { img: "part-04", name: "Intake", meta: "Korvane" }] }), { x: 420, y: 640, w: 580 })}
  ${cursor(300, 1040)}
  ${spine("Linked")}`, "studio", "simulated-cursor taps “Korvane” on the parts row, then whip-pan (motion blur, 0.4 s) to the Korvane page; the Supra tile slots in first with a red ring. Whip sfx + pop.");
add("p1-11", 27.6, `${H(`Delivered.<br><span class="g">Now they know where.</span>`, 360, { size: 84 })}
  <div class="abs" style="left:60px;top:700px;z-index:5">${orderCard({ id: "A-2207", item: "Korvane turbo kit", img: "part-01", steps: [["Shipped", "Mar 2"], ["In transit", "Mar 4"], ["Delivered", "Mar 6"]], done: 3, w: 700 })}</div>
  ${cut("car-01", { x: 160, y: 1170, w: 760 })}
  ${route("M682,887 L800,887 C930,887 990,950 990,1050 C990,1130 960,1170 900,1230", { w: 9, end: `<circle cx="900" cy="1230" r="18" fill="#F43034"/><circle cx="900" cy="1230" r="34" fill="none" stroke="#F43034" stroke-width="5" opacity=".4"/>` })}
  ${spine("Delivered")}`, "studio", "Pull back: the Korvane page shrinks into the tracking card; the red dashed line, which ran off into nothing, now ends on the Supra with a red pin (spring pop). Frame matches the hook’s start for the loop. VO: “Receipt says delivered. Now they know where.” Music resolves.");
add("p1-12", 29.4, endCard("First 100 brands get a free page."), "white", "CTA (Eric): “First 100 brands get a free page. fuelmybuild.com.” Logo springs in, URL in red. Illustrative-story line in the footer.");

window.META = { reel: "P1", title: "After checkout", lead: "A", voice: "Eric (narrator)",
  remocn: ["drawer (order card)", "number-wheel (clue counter 1/3 → 3/3)", "typewriter (review + search)", "simulated-cursor", "push-through (turn)", "whip-pan (supplier page)", "SVG stroke-dashoffset red route line (Remotion evolve-path, not remocn)"],
  newCutouts: [] };
