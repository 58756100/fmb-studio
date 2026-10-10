const F = [];
const add = (id, t, html, bg = "studio") => F.push({ id, t, html: `<div class="frame" id="${id}"><div class="bg ${bg}"></div>${html}<div class="tc">${id} · ${t.toFixed(1)}s</div></div>` });
const DW = 600;
const fadeB = (h = 380, c = "#fff") => `<div class="abs" style="left:0;right:0;bottom:0;height:${h}px;background:linear-gradient(to bottom,${c}00,${c} 80%);z-index:5"></div>`;

// ---------- S1 hook ----------
add("f01", 0.3, `${H(`If you sell<br>car parts,${caret}`, 300)}${device(scrLock(2), { x: 240, y: 760, w: DW })}`);
add("f02", 2.3, `${H(`Your best ad<br><span class="g">isn’t an ad.</span>${caret}`, 300)}${device(scrLock(5, "211 more comments"), { x: 240, y: 760, w: DW })}`);

// ---------- S2 it's a build ----------
(() => {
  const callout = (px, py, label, top, yours) => {
    const ly = top ? 616 : 1484;
    return `<svg class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:3;overflow:visible"><line x1="${px}" y1="${py}" x2="${px}" y2="${top ? ly + 68 : ly}" stroke="#1D1D1F" stroke-width="2.5"/><circle cx="${px}" cy="${py}" r="10" fill="#fff" stroke="#1D1D1F" stroke-width="3.5"/></svg>
    <div class="glass abs" style="z-index:4;left:${px}px;top:${ly}px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;height:68px;padding:0 26px;border-radius:34px;font-size:30px;font-weight:600;letter-spacing:-.015em;white-space:nowrap;background:#fff">${yours ? seal(28) : ""}${label}</div>`;
  };
  add("f03", 3.6, `
    ${H(`It’s a <span class="inl">${ph("img 02", "", 150, 96, { r: 0, nolabel: true })}</span> build.`, 330)}
    <div class="abs" style="left:60px;top:720px;width:960px;height:690px;border-radius:44px;overflow:hidden;box-shadow:0 60px 120px -40px rgba(0,0,0,.30)">${ph("img 02", "hero — ’99 Supra, side profile, clean white studio cyc, soft floor reflection", 960, 690, { r: 0, fs: 22, style: "--pad:30px", as: "car-02" })}</div>
    ${callout(330, 960, "Turbo kit", 1, 1)}${callout(790, 1000, "Exhaust", 1)}${callout(300, 1260, "18-inch wheels", 0, 1)}${callout(760, 1230, "Coilovers", 0)}`);
})();

// ---------- S3 word swap / cover flow ----------
const flow = (id, t, word, car, img, imgL, imgR, part, who, desc) => add(id, t, `
  ${H(`Your <span class="r">${word}</span>,<br><span class="g">in someone’s ${car}.</span>`, 300)}
  <div class="abs" style="left:0;right:0;top:700px;height:900px;perspective:2200px">
    <div class="abs" style="left:-250px;top:110px;transform:rotateY(38deg) scale(.86);opacity:.5;filter:saturate(.6)">${ph(imgL, "", 470, 640, { r: 36, nolabel: true })}</div>
    <div class="abs" style="left:860px;top:110px;transform:rotateY(-38deg) scale(.86);opacity:.5;filter:saturate(.6)">${ph(imgR, "", 470, 640, { r: 36, nolabel: true })}</div>
    <div class="abs" style="left:230px;top:0;width:620px;height:820px;border-radius:44px;overflow:hidden;box-shadow:0 60px 110px -40px rgba(0,0,0,.35)">${ph(img, desc, 620, 820, { r: 0, fs: 20, style: "--pad:28px", labelTop: 1 })}
      <div class="glass abs" style="left:20px;right:20px;bottom:20px;border-radius:30px;padding:22px 24px;display:flex;align-items:center;gap:16px">
        ${ph(part === "Turbo kit" ? "img 03" : "img 04", "", 72, 72, { r: 16 })}<div style="flex:1"><div style="font-size:30px;font-weight:600;letter-spacing:-.015em">${part}</div>
        <div style="font-size:24px;color:var(--label2);display:flex;align-items:center;gap:6px;margin-top:2px">${seal(22)}<span style="color:var(--red);font-weight:600">Your Brand</span> · ${who}</div></div></div></div>
  </div>`);
flow("f04", 5.1, "turbo", "Supra", "img 18", "img 20", "img 21", "Turbo kit", "s14.jay", "’99 Supra engine bay, turbo visible, warm work light");
flow("f05", 6.9, "coilovers", "WRX", "img 19", "img 18", "img 22", "Coilovers", "boostedbri", "’04 WRX STI on a lift, wheel off, coilover visible");

// ---------- S4 thousands ----------
(() => {
  let tiles = "", seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 9 * 12; i++) { const on = rnd() < .3;
    tiles += `<div style="position:relative">${ph("img " + (30 + (i % 9)), "", 150, 112, { r: 14, nolabel: true })}${on ? `<span style="position:absolute;right:8px;top:8px">${seal(26)}</span>` : ""}</div>`; }
  add("f06", 9.0, `
    ${H(`Thousands of builds<br><span class="g">running your parts.</span>`, 300)}
    <div class="abs" style="left:0;right:0;top:640px;bottom:0;perspective:1600px;overflow:hidden">
      <div style="position:absolute;left:-120px;top:-20px;display:grid;grid-template-columns:repeat(9,150px);gap:16px;transform:rotateX(42deg) rotateZ(-12deg);transform-origin:50% 0">${tiles}</div></div>
    <div class="abs" style="left:0;right:0;top:600px;height:160px;background:linear-gradient(#fff,#fff0);z-index:4"></div>${fadeB(420)}`);
})();

// ---------- S5 leaks ----------
add("f07", 10.9, `${H(`Lost in comments,`, 300)}${device(scrComments(), { x: 240, y: 560, w: DW })}`);
add("f08", 12.3, `${H(`stories that expire,`, 300)}${device(scrStory(), { x: 240, y: 560, w: DW, dark: true })}`);
(() => {
  let dots = "", s = 5; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 220; i++) { const x = 600 + rnd() * 470, y = 640 + rnd() * 900, z = 5 + rnd() * 12; const d = (x - 600) / 470;
    dots += `<i style="position:absolute;left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:2px;background:${rnd() < .5 ? "#C7C7CC" : "#E5E5EA"};opacity:${(1 - d * .85).toFixed(2)};z-index:6"></i>`; }
  add("f09", 13.6, `${H(`and threads nobody<br>finds again.`, 280)}
    <div style="-webkit-mask-image:linear-gradient(90deg,#000 0,#000 640px,transparent 860px);position:absolute;inset:0">${device(scrThread(), { x: 240, y: 600, w: DW })}</div>${dots}`);
})();

// ---------- S6 reveal ----------
add("f10", 15.1, `${H(`So we built${caret}`, 860)}`, "white");
add("f11", 16.3, `<div class="abs" style="left:50%;top:850px;transform:translateX(-50%)">${logo(660)}</div>
  <div class="sub" style="top:1010px">The permanent record for every build.</div>`);

// ---------- S7 builders log ----------
add("f12", 18.6, `${H(`Builders log<br><span class="g">every part.</span>`, 260)}${device(scrBuild(sheetAddPart()), { x: 240, y: 600, w: DW })}`, "gray");

// ---------- S8 links to your page ----------
(() => {
  const L = [[690, "img 12", "’04 WRX STI"], [1010, "img 14", "’18 Tacoma"], [1330, "img 02", "’99 Supra"]];
  const R = [[690, "img 13", "’72 240Z"], [1010, "img 15", "’92 NSX"], [1330, "img 23", "’89 E30"]];
  const tx = 540, ty = 1070; // into the builds stat on the device
  const card = (x, y, im, n) => `<div class="abs" style="left:${x}px;top:${y}px;width:220px;border-radius:26px;background:#fff;padding:8px;box-shadow:0 24px 50px -18px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.04);z-index:3">${ph(im, n, 204, 136, { r: 19 })}<div style="font-size:22px;font-weight:600;letter-spacing:-.01em;padding:11px 6px 5px;display:flex;align-items:center;gap:7px">${seal(20)}${n}</div></div>`;
  const path = (sx, sy) => { const mx = (sx + tx) / 2; return `<path d="M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}" fill="none" stroke="#F43034" stroke-opacity=".45" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>`; };
  add("f13", 22.0, `
    ${H(`Every build links<br><span class="g">to your page.</span>`, 260)}
    <svg class="abs" style="left:0;top:0;width:1080px;height:1920px;z-index:1">${L.map(([y]) => path(250, y + 95)).join("")}${R.map(([y]) => path(830, y + 95)).join("")}
      ${[[400, 860], [395, 1075], [405, 1280], [680, 860], [685, 1075], [675, 1280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#F43034"/><circle cx="${x}" cy="${y}" r="18" fill="#F43034" fill-opacity=".15"/>`).join("")}</svg>
    ${device(scrSupplier(), { x: 315, y: 600, w: 450, z: "z-index:2" })}
    ${L.map(([y, im, n]) => card(30, y, im, n)).join("")}${R.map(([y, im, n]) => card(830, y, im, n)).join("")}`);
})();

// ---------- S9 dark beat ----------
add("f14", 24.9, `
  <div class="abs" style="left:100px;top:280px;font-size:124px;font-weight:600;letter-spacing:-.04em;line-height:1.04;color:#F5F5F7;font-variation-settings:'opsz' 32">Permanent.<br>Searchable.<br><span style="color:#48484A">Yours.</span></div>
  ${device(scrSupplier(), { x: 240, y: 1020, w: DW })}
  <div class="abs" style="left:0;right:0;bottom:0;height:300px;background:linear-gradient(#00000000,#000 85%);z-index:5"></div>`, "bg-black");

// ---------- S10 payoff ----------
add("f15", 27.0, `
  ${H(`<span class="g">Next time someone asks,</span>`, 420, { size: 84 })}
  <div class="abs" style="left:-40px;top:720px;display:flex;gap:24px;filter:blur(16px);opacity:.8">${[30, 31, 32, 33, 34].map(i => ph("img " + i, "", 320, 560, { r: 40, nolabel: true })).join("")}</div>
  <div class="glass abs" style="left:-60px;top:860px;width:1300px;height:260px;border-radius:130px;display:flex;align-items:center;gap:36px;padding-left:150px;z-index:3">
    ${ic("search", 96, "rgba(60,60,67,.55)", 2.2)}<span style="font-size:112px;font-weight:500;letter-spacing:-.035em;font-variation-settings:'opsz' 32">who makes th</span><span class="caret" style="height:118px;width:7px;margin-left:-30px;font-size:112px"></span></div>`, "gray");
add("f16", 29.4, `${H(`The answer<br>is <span class="r">you.</span>`, 260)}${device(scrSearch(), { x: 240, y: 600, w: DW })}`, "gray");

// ---------- S11 done for you ----------
add("f17", 32.0, `${H(`We set it all up.<br><span class="g">Zero admin.</span>`, 260)}${device(scrSetup(), { x: 240, y: 600, w: DW })}`, "gray");

// ---------- S12 first 100 ----------
(() => {
  let g = ""; for (let i = 0; i < 100; i++) g += `<i style="display:block;width:54px;height:54px;border-radius:27px;${i === 0 ? "background:#F43034;box-shadow:0 10px 24px -6px rgba(244,48,52,.6)" : "background:#E8E8ED"}"></i>`;
  add("f18", 35.0, `${H(`Free for the<br>first <span class="r">100.</span>`, 300)}
    <div class="abs" style="left:150px;top:760px;display:grid;grid-template-columns:repeat(10,54px);gap:28px">${g}</div>
    <div class="glass abs" style="left:100px;top:660px;height:64px;padding:0 24px;border-radius:32px;display:flex;align-items:center;font-size:28px;font-weight:600;background:#fff;z-index:3">This one’s yours</div>
    <div class="sub" style="top:1610px">Parts brands and shops</div>`);
})();

// ---------- S13 CTA ----------
add("f19", 38.2, `<div class="abs" style="left:50%;top:700px;transform:translateX(-50%)">${logo(600)}</div>
  <div class="sub" style="top:850px">Supplier pilot. Free for the first 100.</div>
  <div class="abs" style="left:50%;top:1000px;transform:translateX(-50%);height:120px;padding:0 60px;border-radius:60px;background:#1D1D1F;color:#fff;display:flex;align-items:center;font-size:48px;font-weight:600;letter-spacing:-.02em;white-space:nowrap">Claim your page</div>
  <div class="abs" style="left:0;right:0;top:1160px;text-align:center;font-size:44px;font-weight:500;letter-spacing:-.02em;color:var(--ink)">fuelmybuild.com${caret}</div>`);
