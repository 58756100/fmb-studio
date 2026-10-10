// P3 · Reviews end at install — storyboard key frames (lead hook A). Times are from the beat sheet; the build retimes to words.json.
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
const simTag = `${chip(`${ic("sparkle", 28, "#86868B", 2)}Simulation`, 0, 120, { h: 60, fs: 28, style: "left:auto;right:56px;color:#6E6E73" })}`;

// Spine: an odometer chip in the headline band is the film's clock (0 → 18,000 → 30,000). Myth/fact stamps ride under the headline.
// odometer drawn in CSS (new cutout requested: see prompts)
const odo = (val, state = "ink") => { const str = val.replace(/,/g, ""); const pad = str.padStart(6, "0"); const sig = str.replace(/^0+/, "").length;
  const cells = pad.split("").map((d, i) => `${i === 3 ? `<span style="width:8px"></span>` : ""}<span style="display:grid;place-items:center;width:50px;height:70px;border-radius:12px;background:linear-gradient(180deg,#E9E9ED,#FAFAFB 32%,#FAFAFB 68%,#E9E9ED);box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);font-size:50px;font-weight:700;letter-spacing:-.03em;color:${i >= 6 - sig ? (state === "red" ? "#F43034" : "#1D1D1F") : "#AEAEB2"}">${d}</span>`).join("");
  return chip(`<span style="display:flex;gap:6px;align-items:center">${cells}</span><span style="color:var(--label2);font-weight:500;font-size:38px;margin-left:6px">mi</span>`, 0, 190, { h: 112, fs: 38, style: "left:50%;transform:translateX(-50%);padding:0 30px" }); };
const mythStrip = (label, text, y = 590) => `<div class="abs" style="left:0;right:0;top:${y}px;text-align:center;z-index:6;font-size:42px;font-weight:500;letter-spacing:-.02em;color:#6E6E73"><span style="color:#1D1D1F;font-weight:600">${label}</span>  ${text}</div>`;
const star3 = (n = 5, s = 60, c = "#1D1D1F") => `<div style="display:flex;gap:8px">${Array.from({ length: n }, () => star(s, c)).join("")}</div>`;
const reviewCard = (x, y, w, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:${o.z || 5};border-radius:36px;background:#fff;padding:36px 40px 40px;box-shadow:0 40px 90px -30px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);opacity:${o.op ?? 1};${o.style || ""}">
  ${star3(5, o.ss || 60, o.sc || "#1D1D1F")}<div style="font-size:${o.fs || 54}px;font-weight:600;letter-spacing:-.035em;margin-top:18px;line-height:1.1">${o.quote || "Fits perfect, rides great!!"}</div>
  <div style="display:flex;align-items:center;gap:14px;margin-top:22px;font-size:30px;color:var(--label2)">${avc("car-10", 48)}<span><b style="color:#1D1D1F;font-weight:600">Dani</b> · ${o.meta || "Mar 12 · 0 mi"}</span></div></div>`;

const DANI_MSG = "18k on the Stellans, still riding perfect";
const danBuild = (o = {}) => buildPage({ hero: "car-10", title: "Yellow Civic EG", owner: "dani.eg6", meta: "Public", url: "fuelmybuild.com/dani-eg6", tab: o.tab || "Parts", section: o.section || "Installed · 14 parts", scroll: o.scroll || 0, rows: o.rows });

// ---- hook A (0–3 s): five red stars pop in, a "Day 1" calendar chip slams under them
add("p3-01", 0.4, `${H(`Five-star reviews<br><span class="g">get written on</span>`, 360, { size: 96 })}
  <div class="abs" style="left:0;right:0;top:790px;display:flex;justify-content:center;gap:22px;z-index:5">${[0, 1, 2, 3, 4].map(() => star(150, "#F43034")).join("")}</div>
  ${chip(`${ic("calendar", 44, "#1D1D1F", 2)}Day 1`, 0, 1080, { h: 124, fs: 66, style: "left:50%;transform:translateX(-50%) rotate(-4deg);padding:0 52px;font-weight:700;letter-spacing:-.03em" })}`, "studio", "Hook A. VO (Emma): “Five-star reviews get written on…” Five stars pop in one by one in red (rising ping per star); on the fifth a “Day 1” calendar chip slams under them with a thud + 2-frame shake.");
add("p3-02", 1.6, `${odo("0")}${H(`the one day nobody<br><span class="g">knows anything.</span>`, 360, { size: 96 })}
  <div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center;gap:12px;z-index:5">${[0, 1, 2, 3, 4].map(() => star(92, "#F43034")).join("")}</div>
  ${cut("part-02", { x: 390, y: 820, w: 300 })}
  ${chip(`${ic("calendar", 36, "#1D1D1F", 2)}Day 1`, 690, 1280, { h: 96, fs: 52, style: "font-weight:700;letter-spacing:-.03em" })}`, "studio", "Stars shrink up, coilovers rise into frame, the odometer chip appears reading 000000 mi (number-wheel armed, the film’s clock). Soft room tone, no music hit.");

// ---- body
add("p3-03", 3.6, `${odo("0")}${H(`Zero miles.<br><span class="g">Five stars.</span>`, 360, { size: 104 })}${mythStrip("Myth 1", "five stars = proven", 600)}
  ${cut("car-10", { x: 110, y: 820, w: 860 })}
  ${cut("part-02", { x: 300, y: 690, w: 150, rot: 6, z: 4 })}
  ${[0, 1, 2].map(i => `<div class="abs" style="left:${330 + i * 36}px;top:${640 - i * 20}px;width:3px;height:${48 + i * 14}px;border-radius:2px;background:rgba(0,0,0,.14);z-index:3"></div>`).join("")}
  ${reviewCard(90, 1250, 900, { fs: 58 })}`, "studio", "VO: “Dani’s Civic hadn’t left the driveway. Five stars.” The coilovers drop into the wheel well (clunk); a review card rises: ★★★★★ “Fits perfect, rides great!!” · Mar 12 · 0 mi.");
add("p3-04", 6.6, `${odo("0")}${H(`Review of the box.<br><span class="g">They’ll come back?</span>`, 360, { size: 92 })}
  ${reviewCard(110, 650, 860, { op: .5, ss: 40, fs: 40, sc: "#AEAEB2", style: "padding:24px 34px 28px;transform:rotate(-1.5deg)" })}
  ${stamp("Busted", 600, 630, -9)}
  ${card(`<div style="font-size:34px;font-weight:600;color:#6E6E73">Myth 2</div><div style="font-size:72px;font-weight:700;letter-spacing:-.045em;line-height:1.02;margin-top:16px">They’ll come back</div><div style="margin-top:36px;display:flex;align-items:center;gap:16px;font-size:30px;color:var(--label2)">${avc("car-10", 56)}Dani, after install</div>`, 50, 930, 470, { z: 4, style: "height:480px" })}
  ${card(`<div style="font-size:34px;font-weight:600;color:#6E6E73">Fact</div><div style="margin-top:20px;height:300px;border-radius:26px;border:4px dashed #D1D1D6;display:grid;place-items:center;font-size:110px;font-weight:700;color:#D1D1D6">?</div>`, 560, 930, 470, { z: 4, style: "height:480px" })}`, "gray", "Red “Busted” stamp slams over the five-star review (1.15 → 1.0, 2-frame shake); the card flips (split-screen flip) to “Myth 2: they’ll come back” on the left and an empty “Fact” panel on the right. Page-flip sfx.");
add("p3-05", 9.6, `${odo("18,000", "red")}${H(`Mile 18,000.<br><span class="g">In a group chat.</span>`, 360, { size: 96 })}
  ${device(chat({ name: "Weekend crew", avatar: "car-10", msgs: [{ text: "garage night friday?" }, { me: true, text: "i’m in" }, { text: "who’s coming saturday?" }, { me: true, text: "me, bringing the jack" }, { text: "nice, see you both" }, { text: DANI_MSG, hl: true }], status: "Delivered" }), { x: 290, y: 620, w: 500 })}
  <div class="abs" style="left:90px;top:1330px;z-index:9;transform:rotate(-2deg);max-width:620px;background:#E9E9EB;border-radius:48px;padding:26px 40px;font-size:46px;line-height:1.18;letter-spacing:-.025em;box-shadow:0 0 0 5px #F43034,0 30px 60px -24px rgba(0,0,0,.3)">${DANI_MSG}</div>`, "studio", "Odometer number-wheel rolls 0 → 18,000 on the voice (ticking-wheel sfx slowing to a stop). iMessage group chat: Dani’s bubble drops in with a message-swoosh. Red ring marks it.");
const bits = Array.from({ length: 26 }, (_, i) => { const r = (i * 53 % 17) / 17, q = (i * 31 % 13) / 13; return [20 + r * 520, 60 - q * 70 - i * 3, 8 + (i % 4) * 5, .85 - i * .03]; });
add("p3-06", 12.6, `${odo("18,000")}${H(`Buried by morning.<br><span class="g">Stellan never saw it.</span>`, 360, { size: 92 })}
  ${device(chat({ name: "Weekend crew", avatar: "car-10", msgs: [{ text: "lol" }, { me: true, text: "meet at 7?" }, { text: "who has a 10mm" }, { text: "🔥🔥" }, { me: true, text: "photos from last night" }, { text: "send them" }, { typing: true }] }), { x: 30, y: 740, w: 480 })}
  <div class="abs" style="left:80px;top:640px;z-index:9;-webkit-mask-image:linear-gradient(90deg,#000 20%,transparent 92%);mask-image:linear-gradient(90deg,#000 20%,transparent 92%);filter:blur(1px)"><div style="background:#E9E9EB;border-radius:40px;padding:22px 34px;font-size:38px;letter-spacing:-.02em;opacity:.85;white-space:nowrap">${DANI_MSG}</div></div>
  ${bits.map(([dx, dy, s, o]) => `<div class="abs" style="left:${360 + dx}px;top:${650 + dy}px;width:${s}px;height:${s}px;border-radius:${s * .3}px;background:#C7C7CC;opacity:${o};z-index:9"></div>`).join("")}
  ${card(`<div style="font-size:34px;font-weight:600;color:#6E6E73">Fact</div><div style="margin-top:20px;height:380px;border-radius:26px;border:4px dashed #D1D1D6"></div>`, 580, 830, 470, { z: 4, style: "height:520px" })}
  ${stamp("Busted", 600, 1020, -7)}`, "gray", "Messages stack in fast from the bottom and push Dani’s bubble off the top; it particle-dissolves on exit (grey dust drifting up-right). Red “Busted” stamp lands on the empty Fact panel. Soft message pops accelerate, then silence.");
add("p3-07", 15.6, `${odo("18,000")}${big("Myth <span style='color:#F43034'>3</span>", 0, 480, { size: 250, w: 900, style: "left:0;right:0;text-align:center" })}
  ${txt("Nobody tracks it after install.", 0, 790, { size: 54, color: "#6E6E73", style: "left:0;right:0;text-align:center" })}
  ${cut("part-02", { x: 370, y: 930, w: 340 })}`, "white", "Hard reset to white. “Myth 3” in Inter Black springs in center (spring-scale-in), the myth counter lands on 3/3. Coilovers stand under it. A held breath, no music.");
add("p3-08", 18.6, `${odo("18,000")}${H(`Dani’s build log<br><span class="g">did.</span>`, 360, { size: 104 })}
  ${cut("part-02", { x: -90, y: 1000, w: 300, op: .3, filter: "blur(6px)" })}
  ${device(danBuild({ rows: [{ img: "part-02", name: "Coilovers", brand: "Stellan", red: true, date: "Installed Mar 12", hl: true }, { img: "part-06", name: "Brake kit", brand: "Self-installed", date: "Jun 2" }, { img: "part-04", name: "Intake", brand: "Self-installed", date: "Jan 14" }] }), { x: 240, y: 640, w: 600 })}`, "studio", "FMB turn (17.5 s, 56%). push-through from the coilovers cutout into Dani’s iOS 26 build page (public URL visible). The parts row “Coilovers · Stellan · Installed Mar 12” is the only red element; chime on the highlight.");
add("p3-09", 21.6, `${odo("30,000", "red")}${H(`30,000 miles.<br><span class="g">Same set.</span>`, 360, { size: 104 })}
  ${device(danBuild({ tab: "Log", section: "Log · newest first", scroll: 90, rows: [{ img: "car-10", name: "Corner photo · same coilovers", brand: "Jun 20", date: "30,000 mi" }, { img: "part-02", name: "Alignment, no rattles", brand: "Aug 3", date: "18,000 mi" }, { img: "part-02", name: "Coilover install", brand: "Mar 12", date: "0 mi" }] }), { x: 240, y: 640, w: 600 })}${touch(560, 1400)}`, "gray", "Thumb scroll (no cursor). Entries slide up with dates and photos; the odometer number-wheel rolls 18,000 → 30,000 in the headline band, red on landing. Scroll swish + wheel tick.");
add("p3-10", 24.6, `${odo("30,000")}${H(`Fact:<br><span class="g">it links back.</span>`, 360, { size: 104 })}
  ${device(danBuild({ rows: [{ img: "part-02", name: "Coilovers", brand: "Stellan", red: true, date: "Installed Mar 12", hl: true }, { img: "part-06", name: "Brake kit", brand: "Self-installed", date: "Jun 2" }] }), { x: -330, y: 700, w: 560, rot: "rotate(-5deg)", z: "filter:blur(7px);opacity:.55;" })}
  ${device(supplierPage({ mono: "S", name: "Stellan Suspension", short: "Stellan", sub: "Verified supplier · Coilovers", count: "1 build", builds: [{ img: "car-10", tag: "dani.eg6", badge: "30,000 mi", hl: true }, { img: "car-04" }, { img: "car-14" }], parts: [{ img: "part-02", name: "Coilovers", meta: "Stellan" }, { img: "part-06", name: "Brake kit", meta: "Stellan" }] }), { x: 420, y: 640, w: 580 })}
  ${simTag}${cursor(300, 1040)}`, "studio", "simulated-cursor taps “Stellan” on the parts row, then whip-pan to the Stellan page: Dani’s Civic tile slots in first with a red ring and a “30,000 mi” badge. “Simulation” tag in the corner. Whip sfx + pop.");
add("p3-11", 27.6, `${odo("30,000", "red")}${H(`Day one: stars.<br><span class="g">Mile 30,000: <span class="r">proof</span>.</span>`, 360, { size: 88 })}
  ${card(`<div style="font-size:34px;font-weight:600;color:#AEAEB2">Day one</div><div style="font-size:120px;font-weight:700;letter-spacing:-.05em;color:#AEAEB2;margin-top:6px">0 mi</div><div style="margin-top:20px">${star3(5, 44, "#C7C7CC")}</div><div style="font-size:38px;font-weight:600;letter-spacing:-.03em;color:#AEAEB2;margin-top:14px;line-height:1.12">Fits perfect, rides great!!</div>`, 50, 720, 470, { z: 4, style: "height:620px;opacity:.75" })}
  ${card(`<div style="font-size:34px;font-weight:600;color:#6E6E73">Mile 30,000</div><div style="font-size:92px;font-weight:700;letter-spacing:-.05em;margin-top:6px;white-space:nowrap">30,000 mi</div><div style="margin-top:18px">${ph("car-10", "", 410, 220, { r: 22, inset: 6 })}</div><div style="display:flex;align-items:center;gap:10px;margin-top:18px;font-size:32px;font-weight:600;letter-spacing:-.02em;color:#F43034">${seal(34)}Same Stellan coilovers</div><div style="font-size:28px;color:var(--label2);margin-top:4px">Jun 20 · Dani’s build log</div>`, 560, 720, 470, { z: 4, style: "height:620px" })}`, "gray", "Split-screen snap: left the original review card, grey, “0 mi”; right the 30,000 mi log entry with the red seal. Then zoom into the left card to match the hook’s first frame (loop). Chord on “proof”.");
add("p3-12", 29.4, endCard("First 100 brands get a free page."), "white", "CTA (Emma): “First 100 brands get a free page. fuelmybuild.com.” Logo springs in, URL in red. Illustrative-story line in the footer.");

window.META = { reel: "P3", title: "Reviews end at install", lead: "A", voice: "Emma (narrator)",
  remocn: ["number-wheel (odometer 0 → 18,000 → 30,000)", "particle-dissolve (the buried bubble)", "spring-scale-in (stars, Myth 3, stamps)", "push-through (turn)", "simulated-cursor", "whip-pan (Stellan page)", "staggered-fade-up (log entries)"],
  newCutouts: [["odometer", "A mechanical car odometer gauge showing six white digits on black rollers, mile marker, studio product photo on pure white, no background, soft contact shadow, front view, high detail"], ["review-stars", "Five glossy red rating stars in a row, studio product photo on pure white, no background, soft contact shadow, slight angle"]] };
