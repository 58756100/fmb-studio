// X1 · One car, three people — storyboard key frames (lead hook A). Times from the beat sheet; the build retimes to words.json.
// Spine: one white Supra; three name tags (Owner, Garage, Turbo brand) in frame 1 return in the loop frame.
const chap = (t) => chip(t, 60, 190, { h: 64, fs: 30, z: 8 });
const tagc = (html, x, y, o = {}) => chip(html, x, y, { h: 80, fs: 36, z: 7, style: `transform:rotate(${o.rot || 0}deg);box-shadow:0 18px 40px -14px rgba(0,0,0,.35)` });
const supraTags = () => `${cut("car-01", { x: 90, y: 900, w: 900 })}
  ${tagc(`<span style="width:16px;height:16px;border-radius:50%;background:#F43034"></span>Owner`, 110, 1010, { rot: -4 })}
  ${tagc(`<span style="width:16px;height:16px;border-radius:50%;background:#F43034"></span>Garage`, 400, 860, { rot: 2 })}
  ${tagc(`<span style="width:16px;height:16px;border-radius:50%;background:#F43034"></span>Turbo brand`, 600, 1090, { rot: -2 })}`;
const clip = (x, y, w, rot = 0) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.28}px;transform:rotate(${rot}deg);z-index:5">
  <div style="position:absolute;inset:0;border-radius:18px;background:linear-gradient(180deg,#C9A57A,#B48C5E);box-shadow:0 30px 60px -24px rgba(0,0,0,.4)"></div>
  <div style="position:absolute;left:8%;right:8%;top:10%;bottom:6%;border-radius:6px;background:#FBF8F1;padding:7% 9%;box-sizing:border-box">${[0, 1, 2, 3, 4, 5, 6].map(i => `<div style="height:${w * .035}px;margin-bottom:${w * .055}px;border-radius:3px;background:rgba(0,0,0,${i % 3 ? .14 : .2});width:${[88, 70, 80, 55, 76, 60, 40][i]}%"></div>`).join("")}</div>
  <div style="position:absolute;left:32%;right:32%;top:3%;height:9%;border-radius:10px;background:linear-gradient(180deg,#D9D9DE,#9A9AA2);box-shadow:0 4px 8px rgba(0,0,0,.25)"></div></div>`;
const drawer = (x, y, w) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .36}px;z-index:6;border-radius:18px;background:linear-gradient(180deg,#8E9096,#6B6D73);box-shadow:0 28px 50px -20px rgba(0,0,0,.45)">
  <div style="position:absolute;left:30%;right:30%;top:34%;height:22%;border-radius:20px;background:linear-gradient(180deg,#E5E5EA,#B4B4BB)"></div></div>`;
const gauge = (x, y, s) => card(`<svg width="${s}" height="${s * .72}" viewBox="0 0 200 144"><path d="M20 120a80 80 0 0 1 160 0" fill="none" stroke="#E5E5EA" stroke-width="14" stroke-linecap="round"/><path d="M20 120a80 80 0 0 1 22-55" fill="none" stroke="#F43034" stroke-width="14" stroke-linecap="round"/><path d="M100 120 L36 112" stroke="#1D1D1F" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="120" r="11" fill="#1D1D1F"/></svg>
  <div style="text-align:center;font-size:32px;font-weight:600;letter-spacing:-.02em;margin-top:6px">0 psi</div><div style="text-align:center;font-size:24px;color:#86868B">Boost</div>`, x, y, s + 56, { pad: 28, r: 36 });
const pcard = (x, avatar, name, role, body, speaking) => card(`<div style="display:flex;align-items:center;gap:16px">${avatar}<div><div style="font-size:32px;font-weight:600;letter-spacing:-.02em">${name}</div><div style="font-size:24px;color:#86868B">${role}</div></div></div>
  <div style="margin-top:26px;height:380px;border-radius:24px;border:4px dashed #F43034;display:grid;place-items:center;text-align:center;font-size:30px;font-weight:600;letter-spacing:-.02em;color:#1D1D1F;padding:0 12px">${body}</div>`, x, 800, 310, { pad: 24, style: speaking ? "box-shadow:0 0 0 4px #F43034,0 40px 90px -30px rgba(0,0,0,.28)" : "" });
const shareSheet = () => `<div style="position:absolute;inset:0;background:rgba(0,0,0,.28);z-index:27"></div>
  <div class="sheet" style="height:470px"><div class="grab"></div>
  <div style="display:flex;align-items:center;gap:12px;padding:16px 18px 12px;border-bottom:.5px solid var(--sep)">${ph("car-01", "", 52, 52, { r: 12, inset: 4 })}<div style="flex:1"><div class="sh" style="font-weight:600">White ’99 Supra</div><div class="fn sec">fuelmybuild.com/marcus-supra</div></div>${ic("x", 18, "#000", 2.2)}</div>
  <div style="display:flex;gap:18px;padding:18px 18px 8px">${[[avm("S", 62, "#6B6D73"), "Sal"], [avm("KT", 62, "#1D1D1F"), "Korvane"], [avc("car-04", 62), "Dana"], [avc("car-09", 62), "Mia"]].map(([a, n]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:70px">${a}<div class="c1">${n}</div></div>`).join("")}</div>
  <div style="display:flex;gap:18px;padding:12px 18px">${[["bubble", "Messages", "#34C759"], ["link", "Copy link", "#8E8E93"], ["send", "Mail", "#0A84FF"], ["bookmark", "Notes", "#FF9F0A"]].map(([i, n, c]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:70px"><div style="width:62px;height:62px;border-radius:16px;background:${c};display:grid;place-items:center">${ic(i, 30, "#fff", 2)}</div><div class="c1">${n}</div></div>`).join("")}</div>
  <div style="margin:10px 18px;padding:14px 16px;border-radius:14px;background:var(--grouped);display:flex;justify-content:space-between" class="body"><span>Copy link</span>${ic("link", 20, "#000", 2)}</div></div>`;
const bp = (o) => buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "marcus.supra", meta: "212 entries · Public", url: "fuelmybuild.com/marcus-supra", section: "Installed · 24 parts", ...o });
const kRows = (hl) => [{ img: "part-01", name: "Turbo kit", brand: "Korvane Turbo", red: true, date: "Installed Mar 14", sub: "Kessler Motorsport", hl }, { img: "part-02", name: "Coilovers", brand: "Vesk Suspension", date: "Aug 3, 2021" }, { img: "part-06", name: "Brake kit", brand: "Halden Brakes", date: "May 9, 2022" }];

// hook A (0–3 s): the Supra lands, three tags drop on one at a time
add("x1-01", 0.4, `${H(`Three people<br><span class="g">built this Supra.</span>`, 330, { size: 108 })}${supraTags()}
  <div class="sub" style="top:1400px">Ask any of them what’s in it.</div>`, "studio", "Hook A. VO (Eric): “Three people built this Supra. Ask any of them what’s in it.” Supra lands (thud), then tags drop one at a time with a soft tick each: Owner, Garage, Turbo brand. Slow push-in.");

// body, three POV chapters
add("x1-02", 3.4, `${chap("1 · The owner")}${H(`I own it.<br><span class="g">No clue what<br>Kessler changed.</span>`, 330, { size: 92 })}
  ${cut("car-01", { x: 20, y: 880, w: 640 })}
  <div class="abs" style="left:560px;top:790px;z-index:5">${receipt({ shop: "Kessler Motorsport", date: "Labor", lines: [["Turbo install", ""], ["Tune", ""], ["Total", ""]], faded: .35, rot: 4, w: 440 })}</div>
  ${tagc(`${avc("car-01", 52)}Marcus · owner`, 90, 1290)}`, "studio", "Chris (Marcus): “I own it. No clue what Kessler changed.” Chapter tag top left. Receipt slides in from the right with a paper whoosh; Marcus’s tag pops (tick).");
add("x1-03", 5.8, `${chap("2 · The garage")}${H(`Specs?<br><span class="g">Clipboard. Drawer.</span>`, 330, { size: 96 })}
  ${cut("mech", { x: 40, y: 760, w: 520 })}${clip(640, 800, 300, 7)}${drawer(580, 1240, 420)}
  ${tagc(`${avm("K", 52)}Sal · Kessler Motorsport`, 80, 1400)}`, "studio", "whip-pan from frame 2 (swoosh + camera blur, new deep voice lands on the same frame). Brian (Sal): “I changed it. Specs: clipboard, drawer.” Clipboard slides into the drawer, drawer shuts (metal thunk).");
add("x1-04", 8.4, `${chap("3 · The brand")}${H(`Our record<br><span class="g">ends: shipped.</span>`, 330, { size: 96 })}
  ${cut("part-01", { x: 40, y: 740, w: 600 })}
  <div class="abs" style="left:300px;top:1290px;z-index:5;-webkit-mask-image:linear-gradient(90deg,#000 55%,transparent);mask-image:linear-gradient(90deg,#000 55%,transparent)">${orderCard({ id: "K-4471", item: "Turbo kit", img: "part-01", steps: [["Shipped", "Mar 2"], ["", ""], ["", ""]], done: 1, w: 640 })}</div>
  ${tagc(`${avm("KT", 52)}Korvane · turbo brand`, 80, 1160)}`, "studio", "whip-pan, third voice. Eric (Korvane): “Our turbo. Our record ends: shipped.” The order card slides in; its right edge fades to white (page-turn sfx, then silence).");
add("x1-05", 10.8, `${H(`Then the wastegate<br>cracked.<br><span class="g">Which part, exactly?</span>`, 330, { size: 88 })}
  ${cut("car-03", { x: 30, y: 1000, w: 800 })}${gauge(760, 860, 190)}
  ${chip(`${ic("bell", 30, "#F43034", 2.2)}<span style="color:#F43034">Wastegate</span>`, 90, 1010, { h: 84, fs: 38 })}`, "studio", "Hard cut (no whip-pan). Chris (Marcus): “Then the wastegate cracked. Which part, exactly?” Warning chip pops in red with a sharp ping; boost needle drops to zero with a falling whine.");
add("x1-06", 14, `${H(`Three pieces.<br><span class="g">No answer.</span>`, 330, { size: 108 })}
  ${pcard(50, avc("car-01", 76), "Marcus", "Owner", "Which<br>part?", false)}
  ${pcard(385, ph("mech", "", 76, 76, { r: 38, inset: 2 }), "Sal", "Garage", "Clipboard’s<br>gone", true)}
  ${pcard(720, avm("KT", 76), "Korvane", "Turbo brand", `<div><div style="font-size:120px;line-height:1;letter-spacing:-.05em;font-weight:700;font-variant-numeric:tabular-nums">4</div><div>versions</div></div>`, true)}`, "studio", "Quick-fire swap, 120 ms gap. Brian (Sal): “Clipboard’s gone.” Eric (Korvane): “Kit came in four versions.” Cards slide into a row; the slots are red dashed and empty. number-wheel rolls the brand card to 4 (ratchet ticks).");

// the turn
add("x1-07", 17.5, `${H(`So I sent<br><span class="g">one <span class="r">link</span>.</span>`, 330, { size: 108 })}
  ${device(bp({ rows: kRows(false), sheet: shareSheet() }), { x: 250, y: 640, w: 580 })}${touch(470, 1560)}`, "gray", "FMB TURN (17.5 s, 56%). Chris (Marcus): “So I sent one link: my build page.” Share sheet rises (iOS sheet spring), thumb taps Sal, then Korvane (sent whoosh). Push-through into the build page on the cut to frame 8.");
add("x1-08", 20.5, `${H(`My install’s on it.<br><span class="g">Specs and all.</span>`, 330, { size: 96 })}
  ${device(bp({ rows: kRows(true), sheet: logSheet({ title: "Turbo install", date: "Mar 14", by: "Kessler Motorsport", byMono: "K", photos: ["part-01", "car-03", "car-01"], note: "Wastegate spring 7 psi · boost 0.9 bar", extra: `<div style="display:flex;gap:8px;margin-top:12px"><span class="sh" style="padding:6px 12px;border-radius:14px;background:var(--red-soft);color:#F43034;font-weight:600">Kessler Motorsport</span><span class="sh" style="padding:6px 12px;border-radius:14px;background:var(--red-soft);color:#F43034;font-weight:600">Sal</span></div>`, h: 560 }) }), { x: 240, y: 640, w: 600 })}${cursor(620, 1240)}`, "gray", "Brian (Sal): “My install’s on it. Specs and all.” Log entry sheet slides up with photo; garage chip and contributor chip light up in red (two soft ticks).");
add("x1-09", 23.5, `${H(`The row said<br><span class="g">which kit.</span>`, 330, { size: 104 })}
  ${device(bp({ rows: kRows(true) }), { x: 150, y: 560, w: 500 })}
  ${chip(`<span style="color:#F43034">Kit v3</span>`, 640, 1160, { h: 84, fs: 40 })}${cursor(420, 1200)}
  <div class="abs" style="left:260px;top:1300px;z-index:9">${orderCard({ id: "K-4602", item: "Turbo kit v3", img: "part-01", steps: [["Shipped", "Today"], ["Arrives", "Tomorrow"]], done: 1, w: 560 })}</div>`, "gray", "simulated-cursor taps “Korvane” on the parts row (click tick). Eric (Korvane): “The row said which kit. Shipped next day.” Kit v3 tag pops; a new order card slides in with a confirm chime.");
add("x1-10", 26, `${H(`One car. One record.<br><span class="g">Three people,<br>one page.</span>`, 330, { size: 92 })}${supraTags()}`, "studio", "Relay, clipped and even, 150 ms between voices: Chris “One car.” Brian “One record.” Eric “Three people, one page.” kinetic-center-build, one line per voice. The three POV cards collapse into the build page, then pull out to the Supra with its three tags. Match cut to frame 1 for the loop.");
add("x1-11", 29, endCard("Start your car’s record."), "white", "CTA (Eric): “Start your car’s record. fuelmybuild.com.” Brands and people in this story are fictional.");

window.META = { reel: "X1", title: "One car, three people", lead: "A", voice: "Eric (Korvane, narrator), Chris (Marcus), Brian (Sal)",
  remocn: ["whip-pan (chapters 1→2→3)", "number-wheel (4 versions)", "push-through (share sheet → build page)", "simulated-cursor (parts row tap)", "kinetic-center-build (final relay)"],
  newCutouts: [["clipboard", "A worn wooden clipboard with a metal clip and a sheet of handwritten spec notes, studio product photo on pure white, no background, soft contact shadow, slight 3/4 angle, high detail"], ["tool-drawer", "A steel mechanic's tool chest drawer pulled open, empty, studio product photo on pure white, no background, soft contact shadow, 3/4 view, high detail"], ["wastegate", "A cracked turbo wastegate actuator, metal body with a visible crack, studio product photo on pure white, no background, soft contact shadow, high detail"]] };
