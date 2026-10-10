// C1 · The shoebox — storyboard key frames (lead hook B). Times are from the beat sheet; the build retimes to words.json.
// Spine: one offer chip in the headline band rolls $68,000 → $61,000 → back to $68,000.
const offer = (v, state = "red") => chip(`<span style="color:var(--label2);font-weight:500">Offer</span><span style="font-variant-numeric:tabular-nums;color:${state === "red" ? "#F43034" : state === "grey" ? "#AEAEB2" : "#1D1D1F"}">${v}</span>`, 0, 210, { h: 92, fs: 44, style: "left:50%;transform:translateX(-50%)" });
// shoebox drawn in CSS (new cutout requested: see prompts)
const box = (x, y, w, open = true) => cut("obj/shoebox", { x, y: y - w * .12, w, z: 3 });

// hook B (0–2.5 s): the number first, then the box springs up under it
add("c1-01", 0.4, `${big("$68,000", 0, 520, { size: 210, color: "#F43034", style: "left:0;right:0;text-align:center" })}
  ${H(`<span class="g">and it came down to</span>`, 770, { size: 76 })}
  ${cut("obj/shoebox", { x: 230, y: 1010, w: 620, op: .9, filter: "blur(2px)" })}`, "studio", "Hook B. rolling-number slams in, red. VO: “Sixty-eight thousand dollars…”");
add("c1-02", 1.6, `${big("$68,000", 0, 360, { size: 160, color: "#F43034", style: "left:0;right:0;text-align:center" })}
  ${H(`<span class="g">a shoebox.</span>`, 560, { size: 96 })}
  ${cut("car-02", { x: 120, y: 820, w: 840, op: .35, filter: "blur(10px)" })}${box(250, 1150, 580, true, -170, -10)}`, "studio", "Box springs up under the number (lid sfx). Supra blurred behind.");

// body
add("c1-03", 3.4, `${offer("$68,000", "ink")}${H(`Eleven years.<br><span class="g">One shoebox.</span>`, 360, { size: 96 })}
  ${cut("obj/receipt-01", { x: 300, y: 640, w: 500, rot: -4, z: 5 })}
  ${box(210, 1240, 660)}`, "studio", "push-through into the box; a faded receipt rises out of it. VO: “Marcus’s first receipt for the Supra? Blank.”");
add("c1-04", 6.6, `${offer("$64,500")}${H(`That for<br><span class="g">the turbo?</span>`, 360, { size: 96 })}
  ${cut("obj/receipt-01", { x: 40, y: 700, w: 470, rot: -6, z: 4 })}
  ${cut("part-01", { x: 470, y: 820, w: 580 })}
  ${chip("Turbo kit · <span style='color:#AEAEB2'>date unreadable</span>", 0, 1420, { style: "left:50%;transform:translateX(-50%)" })}`, "studio", "Buyer voice (Chris). Offer chip rolls $68,000 → $64,500, red on the drop. Tick sfx.");
add("c1-05", 9.6, `${offer("$61,000")}${H(`$1,400.<br><span class="g">No date.</span>`, 360, { size: 96 })}
  ${cut("part-02", { x: 90, y: 700, w: 360 })}
  ${cut("obj/receipt-01", { x: 450, y: 720, w: 520, rot: 5, z: 4 })}
  ${chip("Coilovers · $1,400 · <span style='color:#F43034'>no date</span>", 0, 1440, { style: "left:50%;transform:translateX(-50%)" })}`, "studio", "whip-pan to the coilovers. Coffee-ring receipt. Second drop.");
add("c1-06", 12.6, `${offer("$61,000", "grey")}${H(`He stopped<br><span class="g">asking.</span>`, 360, { size: 96 })}
  ${cut("obj/receipts-scatter", { x: 60, y: 640, w: 960, op: .95 })}
  ${box(330, 1330, 420)}`, "studio", "Music cuts to silence. Receipts spill and float, offer chip dims grey, the buyer’s shadow leaves.");
add("c1-07", 15.6, `${H(`Lid on.`, 300, { size: 96 })}${box(250, 1420, 580, false, -6, 0)}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "marcus.supra", meta: "212 entries · Public", url: "fuelmybuild.com/marcus-supra", section: "Installed · 24 parts", rows: [{ img: "part-01", name: "Turbo kit", brand: "{brand}", date: "Mar 12, 2019" }, { img: "part-02", name: "Coilovers", brand: "{brand}", date: "Aug 3, 2021" }] }), { x: 300, y: 560, w: 480, z: "z-index:3" })}`, "studio", "Lid drops (thud) and drives the phone up on the same spring. VO: “He handed over his phone.”");
add("c1-08", 18.4, `${offer("$61,000", "grey")}${H(`Every part.<br><span class="g">Dated.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "marcus.supra", meta: "212 entries · Public", url: "fuelmybuild.com/marcus-supra", section: "Installed · 24 parts",
    rows: [{ img: "part-01", name: "Turbo kit", brand: "{brand}", date: "Mar 12, 2019", hl: true }, { img: "part-02", name: "Coilovers", brand: "{brand}", date: "Aug 3, 2021" }, { img: "part-06", name: "Brake kit", brand: "{brand}", date: "May 9, 2022" }],
    sheet: logSheet({ title: "Turbo install", date: "Mar 12, 2019", by: "Kessler Motorsport", byMono: "K", photos: ["part-01", "car-03", "car-01"], h: 470 }) }), { x: 240, y: 640, w: 600 })}${cursor(640, 1340)}`, "gray", "FMB turn (17 s, 59%). Tap the turbo row, log sheet slides up with date + photos.");
add("c1-09", 21.6, `${offer("$66,000")}${H(`Kept<br><span class="g">scrolling.</span>`, 360, { size: 96 })}
  ${device(buildPage({ hero: "car-01", title: "White ’99 Supra", owner: "marcus.supra", meta: "212 entries · Public", url: "fuelmybuild.com/marcus-supra", section: "Installed · 24 parts", scroll: 120,
    rows: [{ img: "part-02", name: "Coilovers", brand: "{brand}", date: "Aug 3, 2021" }, { img: "part-06", name: "Brake kit", brand: "{brand}", date: "May 9, 2022" }, { img: "part-04", name: "Intake", brand: "{brand}", date: "Jan 14, 2023" }, { img: "part-05", name: "Exhaust", brand: "{brand}", date: "Jun 2, 2023" }] }), { x: 240, y: 640, w: 600 })}
  ${touch(560, 1420)}`, "gray", "Thumb scroll (no cursor). Offer rolls back up, rising-pitch sfx.");
add("c1-10", 25.2, `${offer("$68,000")}${H(`Asking.`, 360, { size: 110 })}
  ${cut("car-01", { x: 90, y: 760, w: 900 })}${box(620, 1350, 360, false, -4, 0)}`, "studio", "Offer locks on $68,000 with spring overshoot. Wide: Supra + closed box (matches frame 1 for the loop).");
add("c1-11", 27.6, endCard("Start your build’s record."), "white", "CTA (Justin): “Start your build’s record at fuelmybuild.com.”");

window.META = { reel: "C1", title: "The shoebox", lead: "B", voice: "Justin (narrator), Chris (buyer)",
  remocn: ["rolling-number", "push-through", "whip-pan", "particle-dissolve (receipts)", "simulated-cursor"],
  newCutouts: [["shoebox", "A worn cardboard shoebox, lid slightly open, a few faded paper receipts sticking out, studio product photo on pure white, soft contact shadow, no background, 3/4 view, high detail"], ["receipt-01", "A single faded thermal paper receipt, slightly curled, a faint coffee ring stain, studio photo on pure white, no background, top-down"]] };
