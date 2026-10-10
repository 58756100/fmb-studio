// G1 · The notes left with him — storyboard key frames (lead hook B). Times are from the beat sheet; the build retimes to words.json.
// Spine: one clock chip in the headline band (number-wheel) jumps at every beat: Fri 5:42 pm -> Mon 7:58 -> 8:01 -> 8:02 -> 8:06 -> 12:00 -> Fri 5:42.
const clk = (day, t, state = "ink") => chip(`<span style="color:var(--label2);font-weight:500">${day}</span><span style="font-variant-numeric:tabular-nums;color:${state === "red" ? "#F43034" : "#1D1D1F"}">${t}</span>`, 0, 210, { h: 92, fs: 44, style: "left:50%;transform:translateX(-50%)" });

// keys on a counter, drawn in CSS (new cutout requested). Same position/scale in frame 1 and the loop frame.
const keys = (x, y, s = 1) => `<div class="abs" style="left:${x}px;top:${y}px;width:${520 * s}px;height:${300 * s}px;z-index:4">
  <div style="position:absolute;left:4%;right:2%;bottom:2%;height:14%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.30),transparent);filter:blur(8px)"></div>
  <div style="position:absolute;left:6%;top:22%;width:${190 * s}px;height:${190 * s}px;border-radius:50%;border:${22 * s}px solid #B9BCC3;background:transparent;box-shadow:0 10px 16px -8px rgba(0,0,0,.35)"></div>
  ${[[250, 80, 24], [270, 130, -6], [255, 175, -34]].map(([lx, ly, r], i) => `<div style="position:absolute;left:${lx * s}px;top:${ly * s}px;width:${210 * s}px;height:${54 * s}px;border-radius:${27 * s}px 10px 10px ${27 * s}px;background:linear-gradient(180deg,#D9DCE2,#AEB2BA);transform:rotate(${r}deg);transform-origin:left center;box-shadow:0 8px 14px -8px rgba(0,0,0,.4)"></div>`).join("")}
  <div style="position:absolute;left:${10 * s}px;top:${120 * s}px;width:${96 * s}px;height:${150 * s}px;border-radius:${26 * s}px;background:#1D1D1F;transform:rotate(-14deg);box-shadow:0 14px 22px -10px rgba(0,0,0,.45)"><div style="position:absolute;left:30%;top:16%;width:40%;height:18%;border-radius:50%;background:#F43034"></div></div></div>`;
const counter = (y) => `<div class="abs" style="left:-20px;right:-20px;top:${y}px;height:14px;background:#fff;box-shadow:0 18px 40px -10px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05);z-index:3"></div>
  <div class="abs" style="left:0;right:0;top:${y + 14}px;height:400px;background:linear-gradient(180deg,#F1F1F4,#FAFAFB);z-index:2"></div>`;
// walking shadow (hook only)
const shadowMan = (x, y, op = .16) => `<div class="abs" style="left:${x}px;top:${y}px;width:260px;height:760px;z-index:2;opacity:${op};filter:blur(10px)">
  <div style="position:absolute;left:80px;top:0;width:110px;height:130px;border-radius:50%;background:#1D1D1F"></div>
  <div style="position:absolute;left:30px;top:120px;width:200px;height:340px;border-radius:70px 70px 24px 24px;background:#1D1D1F"></div>
  <div style="position:absolute;left:56px;top:440px;width:70px;height:320px;border-radius:30px;background:#1D1D1F;transform:rotate(8deg)"></div>
  <div style="position:absolute;left:128px;top:440px;width:70px;height:320px;border-radius:30px;background:#1D1D1F;transform:rotate(-12deg)"></div></div>`;
// line-drawn two-post lift (new cutout requested)
const lift = (y, raise = 0, w = 900) => `<div class="abs" style="left:90px;top:${y}px;width:${w}px;height:640px;z-index:1">
  ${[110, w - 190].map(px => `<div style="position:absolute;left:${px}px;top:${150 - raise}px;width:80px;height:${490 + raise}px;border-radius:14px;background:linear-gradient(90deg,#D9D9DE,#ECECEF,#D2D2D8);box-shadow:0 20px 30px -16px rgba(0,0,0,.3)"></div><div style="position:absolute;left:${px - 30}px;top:600px;width:140px;height:30px;border-radius:12px;background:#C9C9CF"></div>`).join("")}
  <div style="position:absolute;left:120px;top:${100 - raise}px;width:${w - 240}px;height:22px;border-radius:11px;background:#B9B9C0"></div></div>`;
const floor = (y) => `<div class="abs" style="left:0;right:0;top:${y}px;height:4px;background:#E5E5EA;z-index:1"></div>`;
// iOS 26 outgoing call screen, light (the one dark beat stays on the hook-free build page sheet)
const callScreen = () => `<div class="ios" style="background:linear-gradient(180deg,#EEEEF3,#D9DAE2)">${statusBar(false)}
  <div style="position:absolute;top:130px;left:0;right:0;text-align:center">
    <div style="display:flex;justify-content:center">${avm("D", 120, "#8E8E93")}</div>
    <div style="font-size:34px;font-weight:600;letter-spacing:-.02em;margin-top:18px">Dave</div>
    <div style="font-size:19px;color:var(--label2);margin-top:2px">lead tech</div>
    <div style="font-size:19px;color:var(--label2);margin-top:14px;display:flex;justify-content:center;align-items:center;gap:10px">Voicemail <span style="letter-spacing:4px;color:#8E8E93">&bull;&bull;&bull;</span></div></div>
  <div style="position:absolute;left:34px;right:34px;top:470px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px 20px">
    ${[["speaker", "Speaker"], ["video", "FaceTime"], ["mute", "Mute"], ["plus", "Add"], ["grid", "Keypad"], ["person", "Contacts"]].map(([i, l]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:7px"><div class="glass" style="width:82px;height:82px;border-radius:50%;display:grid;place-items:center">${ic(({ speaker: "bell", video: "camera", mute: "x" })[i] || i, 30, "#1D1D1F", 1.8)}</div><div class="fn" style="font-weight:500">${l}</div></div>`).join("")}</div>
  <div style="position:absolute;left:0;right:0;top:720px;display:flex;justify-content:center"><div style="width:84px;height:84px;border-radius:50%;background:#F43034;display:grid;place-items:center;transform:rotate(135deg)">${ic("flash", 30, "#fff", 1.8)}</div></div></div>`;
// shop garage list (custom)
const garageScreen = (hl = true) => `<div class="ios grouped">${statusBar(false)}
  <div style="position:absolute;top:104px;left:20px;right:20px"><div class="lt">Garage</div>
    <div class="sh sec" style="display:flex;align-items:center;gap:8px;margin-top:6px">${avm("K", 24)}<b style="color:#000;font-weight:600">Kessler Motorsport</b> · 18 builds</div></div>
  <div class="list" style="position:absolute;top:230px;left:0;right:0">
    ${[["car-01", "White ’99 Supra", "212 entries · Dave, Leo", true], ["car-14", "Blue Evo VI", "96 entries · Dave", false], ["car-13", "Red RX-7", "58 entries · Dave, Leo", false], ["car-07", "Black NSX", "41 entries · Leo", false], ["car-05", "Orange 240Z", "133 entries · Dave", false]].map(([c, n, s, h]) => `<div class="row" style="--ins:84px;min-height:84px;${h && hl ? "background:var(--red-soft);" : ""}">${avc(c, 56)}<div class="main"><div class="body" style="font-weight:600">${n}</div><div class="sh sec">${s}</div></div>${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`).join("")}</div>
  ${tabbar(0)}</div>`;
// scribble circle (red) around a point
const scribble = (x, y, w, h) => `<svg class="abs" style="left:${x}px;top:${y}px;z-index:30" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${w * .12},${h * .35} C${w * .3},${-h * .05} ${w * .9},${h * .02} ${w * .96},${h * .5} C${w * 1},${h * .95} ${w * .3},${h * 1.05} ${w * .06},${h * .62} C${w * .02},${h * .35} ${w * .4},${h * .1} ${w * .8},${h * .12}" fill="none" stroke="#F43034" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// photo viewer (light) with Dave's caption
const photoViewer = () => `<div class="ios" style="background:#F2F2F7">${statusBar(false)}
  <div style="position:absolute;top:60px;left:16px;right:16px;display:flex;justify-content:space-between"><div class="gbtn glass">${ic("x", 20, "#000", 2.2)}</div><div class="sh" style="font-weight:600;align-self:center">Turbo install · 4 of 12</div><div class="gbtn glass">${ic("share", 20, "#000", 1.9)}</div></div>
  <div style="position:absolute;top:150px;left:14px;right:14px;height:520px;border-radius:30px;background:linear-gradient(160deg,#FAFAFB,#E6E6EB);overflow:hidden"><img src="${IMG}part-04.png" style="position:absolute;left:-6%;top:-4%;width:112%;height:112%;object-fit:contain"></div>
  <div class="glass" style="position:absolute;left:24px;right:24px;top:586px;padding:14px 16px;border-radius:22px;z-index:5"><div class="fn sec" style="display:flex;align-items:center;gap:6px">${avm("D", 18, "#8E8E93")}<b style="color:#000;font-weight:600">Dave</b> · Mar 14</div><div style="font-size:19px;font-weight:600;letter-spacing:-.015em;margin-top:5px">rerouted vacuum line — check here first</div></div>
  <div style="position:absolute;top:720px;left:20px;right:20px;display:flex;gap:8px">${["part-01", "part-04", "part-05", "car-03", "part-06"].map((p, i) => ph(p, "", 66, 66, { r: 12, inset: 6, style: i === 1 ? "box-shadow:0 0 0 3px #F43034" : "opacity:.8" })).join("")}</div></div>`;

// ---- hook B (0–2.5 s): keys land, a shadow walks out, the door shuts
add("g1-01", 0.4, `${clk("Fri", "5:42 pm", "red")}${H(`Dave left his keys<br><span class="g">and didn’t look back.</span>`, 360, { size: 92 })}
  ${counter(1250)}${keys(260, 960, 1.05)}${shadowMan(-110, 840, .2)}`, "studio", "Hook B (lead). VO (Chris): “Dave left his keys on the counter at 5:42 Friday and didn’t look back.” Keys drop on the white counter (keys sfx), number-wheel clock sits on Fri 5:42 pm, a shadow steps out left, door-close sfx at 1.3 s. Camera: slow push toward the keys.");

// ---- body
add("g1-02", 3.8, `${clk("Mon", "7:58 am", "red")}${H(`Back on<br><span class="g">lift two.</span>`, 360, { size: 96 })}
  ${floor(1500)}${lift(920, 120)}${cut("car-02", { x: 100, y: 800, w: 880 })}${chip("Lift 2", 0, 700, { h: 64, fs: 32, z: 7, style: "left:50%;transform:translateX(-50%)" })}`, "studio", "VO: “Monday: Dave’s Supra is back on lift two.” Clock number-wheels to Mon 7:58. Supra rises 120 px on a spring, contact shadow 2 frames late, camera tilts up with it. Hydraulic hiss.");
add("g1-03", 6.8, `${clk("Mon", "7:58 am")}${H(`Never<br><span class="g">touched it.</span>`, 360, { size: 96 })}
  ${cut("car-02", { x: 60, y: 1060, w: 520, op: .3, filter: "blur(6px)" })}${cut("part-01", { x: 150, y: 700, w: 780 })}
  <div class="abs" style="left:640px;top:870px;width:150px;height:150px;border-radius:50%;box-shadow:0 0 0 8px rgba(244,48,52,.55),0 0 0 26px rgba(244,48,52,.18);z-index:8"></div>`, "studio", "VO: “Boost leak. Dave’s turbo. Leo never touched it.” lens-zoom from the car to the turbo. Red pulse beats at one flange, hiss sfx on each pulse.");
add("g1-04", 9.8, `${clk("Mon", "7:59 am")}${H(`Voicemail.`, 360, { size: 110 })}
  ${device(callScreen(), { x: 290, y: 620, w: 500 })}`, "studio", "VO: “So he called Dave. Voicemail.” iOS call screen, ringing dots pulse, held ring for 0.6 s, then a 1-frame cut to near silence and a single call-ended tone.");
add("g1-05", 12.9, `${clk("Mon", "8:01 am", "red")}${H(`Still on for<br><span class="g">Wednesday?</span>`, 360, { size: 96 })}
  ${device(chat({ name: "Supra owner", avatar: "car-01", msgs: [{ text: "Morning! Any news on the Supra?" }, { me: true, text: "Back on the lift, looking at it" }, { text: "Cool. It’s the boost leak, right?" }, { me: true, text: "Yep. Checking now" }, { text: "Still on for Wednesday?", hl: true }] }), { x: 310, y: 700, w: 460 })}
  <div class="abs" style="left:90px;top:580px;z-index:20">${notif({ who: "Supra owner", text: "Still on for Wednesday?", w: 900, s: 1.8, style: "" })}</div>`, "studio", "VO: “Then the owner texted. ‘Still Wednesday?’” Banner drops from the top with a text-tone, bubble expands. Clock ticks to 8:01 (stakes up).");
add("g1-06", 15.6, `${clk("Mon", "8:02 am")}${H(`He logged<br><span class="g">everything.</span>`, 360, { size: 96 })}
  ${device(garageScreen(true), { x: 20, y: 640, w: 500 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "kessler", ownerCar: "car-01", meta: "212 entries · Public", url: "fuelmybuild.com/kessler/white-supra", section: "Installed · 24 parts", rows: [{ img: "part-01", name: "Turbo kit", brand: "{brand}", date: "Mar 14", hl: true }, { img: "part-02", name: "Coilovers", brand: "{brand}", date: "Aug 3" }] }), { x: 560, y: 700, w: 500 })}${cursor(300, 880)}`, "gray", "FMB turn (15.3 s, 55 %). VO: “But Dave logged everything.” Hold on Leo 0.8 s, push-through into Leo’s phone: the garage view, cursor taps ‘White ’99 Supra’ (tap click), the build page with fuelmybuild.com/kessler/white-supra slides in from the right.");
add("g1-07", 18.2, `${clk("Mon", "8:02 am")}${H(`Turbo install.<br><span class="g">Mar 14.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "kessler", ownerCar: "car-01", meta: "212 entries · Public", url: "fuelmybuild.com/kessler/white-supra", section: "Installed · 24 parts",
    rows: [{ img: "part-01", name: "Turbo kit", brand: "{brand}", date: "Mar 14", hl: true }, { img: "part-02", name: "Coilovers", brand: "{brand}", date: "Aug 3" }],
    sheet: logSheet({ title: "Turbo install", date: "Mar 14", by: "Dave · Kessler Motorsport", byMono: "K", photos: ["part-01", "part-04", "part-05", "car-03", "car-02", "part-06"], h: 560 }) }), { x: 290, y: 620, w: 500 })}`, "gray", "VO: “Turbo install, March 14.” Log sheet slides up on a spring (sheet sfx): ‘logged by Dave · Kessler Motorsport’, a 12-photo grid fills in with a 4-frame stagger.");
add("g1-08", 19.8, `${clk("Mon", "8:03 am")}${H(`Check here<br><span class="r">first.</span>`, 360, { size: 100 })}
  ${device(photoViewer(), { x: 290, y: 620, w: 500 })}${scribble(330, 930, 380, 250)}`, "studio", "VO: “One photo: check here first.” Lens-zoom: one photo fills the screen, Dave’s caption types in, red scribble-circle draws around the vacuum line (marker scratch sfx). Slow the VO on ‘check here first’.");
add("g1-09", 22.0, `${clk("Mon", "8:06 am", "red")}${H(`Four<br><span class="g">minutes.</span>`, 360, { size: 100 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "kessler", ownerCar: "car-01", meta: "214 entries · Public", url: "fuelmybuild.com/kessler/white-supra", tab: "Log", section: "Log · newest first",
    rows: [{ img: "part-04", name: `Vacuum line reseated${caret}`, brand: "Logged by Leo", date: "Mon 8:06", hl: true, red: true }, { img: "part-01", name: "Turbo install", brand: "Logged by Dave", date: "Mar 14" }, { img: "part-02", name: "Coilover set", brand: "Logged by Dave", date: "Aug 3" }] }), { x: 290, y: 620, w: 500 })}`, "gray", "VO: “It was. Four minutes.” Clock sprints 8:02 -> 8:06 (number-wheel, fast). Leo’s entry types in with a red caret and stacks directly under Dave’s: two signatures, one list. Typewriter ticks.");
add("g1-10", 24.4, `${clk("Mon", "12:00 pm")}${H(`His notes<br><span class="g">stayed.</span>`, 360, { size: 100 })}
  ${floor(1500)}${lift(920, 0)}${cut("car-02", { x: 420, y: 960, w: 880, op: .95 })}${speedLines()}`, "studio", "VO: “Dave’s gone. His notes stayed.” Music out 0.5 s before. Clock rolls to Mon 12:00, Supra lowers off the lift and rolls out of frame right (speed-lines), then a hard cut to the keys.");
add("g1-11", 26.0, `${clk("Fri", "5:42 pm", "red")}${H(`Dave left his keys<br><span class="g">and didn’t look back.</span>`, 360, { size: 92 })}
  ${counter(1250)}${keys(260, 960, 1.05)}`, "studio", "Loop. Clock reverses Mon -> Fri 5:42 (number-wheel backwards). Keys identical in position, scale and shadow to g1-01; only the shadow man is gone.");
add("g1-12", 27.4, endCard("Log every job."), "white", "CTA (Chris): “Log every job. fuelmybuild.com.”");

function speedLines() { return [0, 1, 2].map(i => `<div class="abs" style="left:${40 + i * 30}px;top:${1130 + i * 90}px;width:${300 - i * 40}px;height:6px;border-radius:3px;background:#D2D2D7;z-index:1"></div>`).join(""); }

window.META = { reel: "G1", title: "The notes left with him", lead: "B", voice: "Chris (narrator)",
  remocn: ["number-wheel (signature: the clock)", "lens-zoom (turbo, photo)", "typewriter (Leo’s entry, red caret)", "push-through (into Leo’s phone)", "speed-lines (Supra rolls out)", "simulated-cursor (garage tap)"],
  newCutouts: [["shop-keys", "A ring of shop keys with a black rubber fob and a small red dot, resting on a counter, studio product photo on pure white, no background, soft contact shadow, 3/4 view, high detail"], ["car-lift", "A two-post hydraulic car lift, minimal industrial grey, arms extended, empty, studio product photo on pure white, no background, soft contact shadow, side view, high detail"], ["vacuum-line-photo", "A close-up of a rerouted rubber vacuum hose clamped near a turbo flange, shop photo style, sharp, clean lighting, on pure white, no background"]] };
