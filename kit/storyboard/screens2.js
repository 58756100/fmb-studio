// Flexible iOS 26 screens for story reels. All screens are 402 x 874 pt (wrap with device()).
// Everything takes data, so any reel can reuse them. Avatars are always a car or a part, never a blank face.

// car/part avatar (builders use their car as their profile picture)
const avc = (img, size = 34, ring = false) => `<div style="width:${size}px;height:${size}px;border-radius:50%;flex:none;overflow:hidden;position:relative;background:linear-gradient(160deg,#F7F7F9,#E4E4EA);${ring ? "box-shadow:0 0 0 2px #fff,0 0 0 4px #F43034;" : ""}"><img src="${IMG}${img}.png" style="position:absolute;left:-18%;top:8%;width:136%;height:84%;object-fit:contain"></div>`;
// shop / brand avatar: monogram on ink
const avm = (txt, size = 34, bg = "#1D1D1F") => `<div style="width:${size}px;height:${size}px;border-radius:${size * .28}px;flex:none;background:${bg};color:#fff;display:grid;place-items:center;font-weight:700;font-size:${size * .42}px;letter-spacing:-.04em">${txt}</div>`;

// ---------- build page ----------
// buildPage({hero:"car-01", title:"White ’99 Supra", owner:"marcus.supra", ownerCar:"car-01", meta:"212 entries · Public",
//   url:"fuelmybuild.com/marcus-supra", tab:"Parts", section:"Installed · 24 parts",
//   rows:[{img:"part-01", name:"Turbo kit", brand:"{brand}", date:"Mar 12, 2019", hl:true, sub:"Kessler Motorsport"}], sheet:"", scroll:0})
const buildPage = (o) => {
  const rows = (o.rows || []).map(r => `<div class="row" style="--ins:72px;min-height:68px;${r.hl ? "background:var(--red-soft);" : ""}">
      ${ph(r.img, "", 44, 44, { r: 10, inset: 4 })}
      <div class="main"><div class="body" style="font-weight:500">${r.name}</div>
      <div class="sh" style="display:flex;align-items:center;gap:4px;margin-top:1px;color:${r.red ? "#F43034" : "rgba(60,60,67,.6)"}">${r.red ? seal(14) : ""}${r.brand}<span class="sec">${r.date ? " · " + r.date : ""}</span></div>
      ${r.sub ? `<div class="fn sec" style="margin-top:1px">${r.sub}</div>` : ""}</div>
      ${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`).join("");
  const tabs = ["Overview", "Parts", "Log", "Media"].map(t => `<span class="${t === (o.tab || "Parts") ? "on" : ""}">${t}</span>`).join("");
  return `<div class="ios grouped">
  <div style="position:absolute;top:0;left:0;width:402px;height:300px;background:linear-gradient(180deg,#F2F2F5,#E6E6EB)"><img src="${IMG}${o.hero || "car-01"}.png" style="position:absolute;left:6%;top:24%;width:88%;height:70%;object-fit:contain"></div>
  ${statusBar(false)}
  <div class="navbtns"><div class="gbtn glass">${ic("chevL", 20, "#000", 2.2)}</div><div style="display:flex;gap:10px"><div class="gbtn glass">${ic("share", 20, "#000", 1.9)}</div><div class="gbtn glass">${ic("ellipsis", 20, "#000")}</div></div></div>
  <div style="position:absolute;top:${276 - (o.scroll || 0)}px;left:0;right:0;bottom:0;background:var(--grouped);border-radius:28px 28px 0 0;padding-top:20px">
    <div style="padding:0 20px"><div class="lt">${o.title}</div>
      <div class="sh sec" style="display:flex;align-items:center;gap:7px;margin-top:4px">${avc(o.ownerCar || o.hero || "car-01", 22)}<span><b style="color:#000;font-weight:600">${o.owner}</b> · ${o.meta || "Public"}</span></div>
      ${o.url ? `<div class="fn" style="margin-top:6px;display:flex;align-items:center;gap:5px;color:var(--label2)">${ic("link", 13, "rgba(60,60,67,.6)", 2)}${o.url}</div>` : ""}
      <div class="seg" style="margin-top:14px">${tabs}</div></div>
    ${o.section ? `<div class="hdr" style="margin-top:18px">${o.section}</div>` : `<div style="height:16px"></div>`}
    <div class="list">${rows}</div>${o.below || ""}</div>
  ${tabbar(0)}${o.sheet || ""}</div>`;
};

// ---------- log entry sheet (glass-backed bottom sheet) ----------
// logSheet({title:"Turbo install", date:"Mar 12, 2019", by:"Kessler Motorsport", byMono:"K", photos:["part-01","car-01"], note:"Rerouted vacuum line — check here first.", h:520})
const logSheet = (o) => `<div style="position:absolute;inset:0;background:rgba(0,0,0,.28);z-index:27"></div>
  <div class="sheet" style="height:${o.h || 520}px"><div class="grab"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0">
    <div class="gbtn" style="background:var(--fill)">${ic("x", 18, "#000", 2.2)}</div><div class="hl">Log entry</div><div class="gbtn" style="background:var(--fill)">${ic("share", 18, "#000", 1.9)}</div></div>
  <div style="padding:16px 20px 0">
    <div class="t3">${o.title}</div>
    <div class="sh sec" style="margin-top:3px;display:flex;align-items:center;gap:6px">${ic("calendar", 15, "rgba(60,60,67,.6)", 2)}${o.date}${o.by ? ` · ${o.byMono ? avm(o.byMono, 18) : ""}<b style="color:#000;font-weight:600">${o.by}</b>` : ""}</div>
    <div style="display:grid;grid-template-columns:repeat(${Math.min((o.photos || []).length, 3)},1fr);gap:8px;margin-top:14px">${(o.photos || []).map(p => ph(p, "", 116, 116, { r: 14, inset: 6, style: "width:100%" })).join("")}</div>
    ${o.note ? `<div class="body" style="margin-top:14px;padding:12px 14px;border-radius:14px;background:var(--grouped)">${o.note}</div>` : ""}
    ${o.extra || ""}</div></div>`;

// ---------- iMessage thread ----------
// chat({name:"Walt · 240Z", avatar:"car-05", msgs:[{me:true,text:"Any service records?"},{text:"Motor was rebuilt…"},{typing:true},{link:{title:"’72 240Z — Walt", url:"fuelmybuild.com/walt-240z", img:"car-05"}}], status:"Delivered"})
const chat = (o) => {
  const bubble = m => {
    if (m.typing) return `<div style="align-self:flex-start;background:#E9E9EB;border-radius:20px;padding:12px 16px;display:flex;gap:5px">${[0, 1, 2].map(i => `<i style="width:9px;height:9px;border-radius:50%;background:#8E8E93;opacity:${[.9, .6, .35][i]}"></i>`).join("")}</div>`;
    if (m.link) return `<div style="align-self:${m.me ? "flex-end" : "flex-start"};width:250px;border-radius:18px;overflow:hidden;background:#E9E9EB">${ph(m.link.img, "", 250, 140, { r: 0, inset: 6 })}<div style="padding:9px 12px"><div class="sh" style="font-weight:600">${m.link.title}</div><div class="fn sec">${m.link.url}</div></div></div>`;
    return `<div style="align-self:${m.me ? "flex-end" : "flex-start"};max-width:270px;background:${m.me ? "#0A84FF" : "#E9E9EB"};color:${m.me ? "#fff" : "#000"};border-radius:20px;padding:9px 14px;font-size:17px;line-height:1.28;${m.hl ? "box-shadow:0 0 0 3px #F43034;" : ""}">${m.text}${m.tap ? `<div style="position:absolute"></div>` : ""}</div>${m.react ? `<div style="align-self:${m.me ? "flex-end" : "flex-start"};margin-top:-14px;${m.me ? "margin-right:-6px" : "margin-left:-6px"};width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);display:grid;place-items:center;font-size:15px;color:#F43034">${m.react}</div>` : ""}`;
  };
  return `<div class="ios" style="background:#fff">${statusBar(false)}
  <div style="position:absolute;top:54px;left:0;right:0;height:96px;display:flex;flex-direction:column;align-items:center;gap:4px;border-bottom:.5px solid var(--sep);background:rgba(249,249,249,.94);z-index:5">
    <div style="position:absolute;left:14px;top:14px">${ic("chevL", 22, "#0A84FF", 2.4)}</div>${avc(o.avatar || "car-05", 46)}<div class="fn" style="font-weight:500">${o.name} ${ic("chevR", 10, "rgba(60,60,67,.4)", 2.4)}</div></div>
  <div style="position:absolute;top:166px;left:12px;right:12px;bottom:90px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px">
    ${(o.msgs || []).map(bubble).join("")}${o.status ? `<div class="c1 sec" style="align-self:flex-end;margin-top:-2px">${o.status}</div>` : ""}</div>
  <div style="position:absolute;left:12px;right:12px;bottom:34px;height:40px;display:flex;align-items:center;gap:10px"><div class="gbtn" style="width:36px;height:36px;background:var(--fill)">${ic("plus", 18, "#000", 2)}</div><div style="flex:1;height:36px;border-radius:18px;border:1px solid var(--sep);display:flex;align-items:center;padding:0 14px" class="sh sec">${o.draft || "iMessage"}</div></div>
  </div>`;
};

// ---------- lock-screen / banner notifications (generic) ----------
// notifs([{app:"chat"|"fmb", who:"Tacoma owner", text:"Any update on my car?", time:"now", avatar:"car-06"}], {wall:"#1C1C1E", time:"10:48"})
const lockScreen = (items, o = {}) => `<div class="ios" style="background:${o.wall || "linear-gradient(180deg,#2B2B30,#0E0E10)"}">
  ${statusBar(true)}
  <div style="position:absolute;top:96px;left:0;right:0;text-align:center;color:rgba(255,255,255,.92)">
    <div style="font-size:19px;font-weight:600">${o.date || "Friday, October 16"}</div>
    <div style="font-size:96px;font-weight:700;letter-spacing:-.04em;line-height:1;margin-top:2px;font-variation-settings:'opsz' 32">${o.time || "9:41"}</div></div>
  <div style="position:absolute;left:10px;right:10px;bottom:${o.bottom || 120}px;display:flex;flex-direction:column;gap:8px">
    ${items.map(n => `<div class="glass dk" style="border-radius:26px;padding:12px 14px;display:flex;gap:11px;align-items:center;color:#fff;opacity:${n.op ?? 1}">
      ${n.avatar ? avc(n.avatar, 38) : appIcon(38, n.app || "chat")}<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600"><span>${n.who}</span><span style="font-weight:400;opacity:.6;font-size:13px">${n.time || "now"}</span></div>
      <div style="font-size:15px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.92">${n.text}</div></div></div>`).join("")}
    ${o.more ? `<div style="text-align:center;color:rgba(255,255,255,.7);font-size:13px;font-weight:600;margin-top:4px">${o.more}</div>` : ""}</div></div>`;

// ---------- social post (generic, not a real platform's chrome) ----------
// post({who:"vesk.wheels", avatar:"part-03", img:"car-15", caption:"…", sponsored:true, likes:"3,812", w:402})
const post = (o) => `<div style="background:#fff;width:${o.w || 402}px;border-radius:${o.r ?? 0}px;overflow:hidden">
  <div style="display:flex;align-items:center;gap:10px;padding:10px 12px">${avc(o.avatar || "car-01", 32)}<div style="flex:1"><div class="sh" style="font-weight:600">${o.who}</div>${o.sponsored ? `<div class="c1 sec">Sponsored</div>` : o.place ? `<div class="c1 sec">${o.place}</div>` : ""}</div>${ic("ellipsis", 20, "#000")}</div>
  ${ph(o.img || "car-01", "", o.w || 402, Math.round((o.w || 402) * 1.0), { r: 0, inset: 4 })}
  <div style="display:flex;gap:16px;padding:10px 12px 4px">${ic("heart", 24, "#000", 1.8)}${ic("bubble", 24, "#000", 1.8)}${ic("send", 24, "#000", 1.8)}<span style="flex:1"></span>${ic("bookmark", 24, "#000", 1.8)}</div>
  <div class="sh" style="padding:0 12px 12px"><b style="font-weight:600">${o.likes || "1,204"} likes</b><br><b style="font-weight:600">${o.who}</b> ${o.caption || ""}</div></div>`;

// ---------- order / tracking card ----------
// orderCard({id:"A-2207", item:"Korvane turbo kit", img:"part-01", steps:[["Shipped","Mar 2"],["In transit","Mar 4"],["Delivered","Mar 6"]], done:3})
const orderCard = (o) => `<div style="background:#fff;border-radius:28px;padding:22px;width:${o.w || 760}px;box-shadow:0 40px 90px -30px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04)">
  <div style="display:flex;gap:18px;align-items:center">${ph(o.img || "part-01", "", 120, 120, { r: 20, inset: 4 })}<div><div style="font-size:24px;color:var(--label2)">Order ${o.id}</div><div style="font-size:36px;font-weight:600;letter-spacing:-.02em">${o.item}</div></div></div>
  <div style="display:flex;justify-content:space-between;margin-top:26px;position:relative">
    <div style="position:absolute;left:18px;right:18px;top:17px;height:4px;background:#E5E5EA"></div>
    <div style="position:absolute;left:18px;top:17px;height:4px;width:${Math.max(0, (o.done || 1) - 1) / Math.max(1, (o.steps || []).length - 1) * 100}%;max-width:calc(100% - 36px);background:#1D1D1F"></div>
    ${(o.steps || []).map(([s, d], i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;z-index:1;width:150px"><div style="width:38px;height:38px;border-radius:50%;background:${i < (o.done || 1) ? "#1D1D1F" : "#E5E5EA"};display:grid;place-items:center">${i < (o.done || 1) ? ic("check", 20, "#fff", 2.6) : ""}</div><div style="font-size:24px;font-weight:600">${s}</div><div style="font-size:22px;color:var(--label2)">${d}</div></div>`).join("")}</div></div>`;

// ---------- simple line chart (svg) ----------
// lineChart({w:900,h:520, pts:[[0,0],[.1,.4],[.2,1],[.3,.05],[1,.02]], color:"#F43034", label:"Sponsored post", pts2:[...], color2:"#1D1D1F", label2:"Vesk page", xl:["1h","12h","24h","Day 30"]})
const lineChart = (o) => {
  const W = o.w || 900, Hh = o.h || 520, P = 40;
  const path = pts => pts.map(([x, y], i) => `${i ? "L" : "M"}${(P + x * (W - 2 * P)).toFixed(1)},${(Hh - P - y * (Hh - 2 * P)).toFixed(1)}`).join("");
  return `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" style="display:block;overflow:visible">
    ${[0, .25, .5, .75, 1].map(g => `<line x1="${P}" x2="${W - P}" y1="${Hh - P - g * (Hh - 2 * P)}" y2="${Hh - P - g * (Hh - 2 * P)}" stroke="#E5E5EA" stroke-width="2"/>`).join("")}
    ${o.pts ? `<path d="${path(o.pts)}" fill="none" stroke="${o.color || "#F43034"}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` : ""}
    ${o.pts2 ? `<path d="${path(o.pts2)}" fill="none" stroke="${o.color2 || "#1D1D1F"}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` : ""}
    ${(o.xl || []).map((l, i, a) => `<text x="${P + i / (a.length - 1) * (W - 2 * P)}" y="${Hh}" text-anchor="middle" font-size="26" fill="#86868B" font-family="Inter">${l}</text>`).join("")}
  </svg>`;
};

// ---------- receipt (thermal paper card) ----------
// receipt({lines:[["Coilovers","$1,400.00"]], date:"", faded:.6, stain:true, w:420, rot:-4})
const receipt = (o) => `<div style="width:${o.w || 420}px;padding:30px 30px 40px;background:#FBF8F1;transform:rotate(${o.rot || 0}deg);box-shadow:0 30px 60px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.04);font-family:'Inter';color:rgba(40,40,40,${1 - (o.faded || 0)});position:relative;-webkit-mask-image:linear-gradient(180deg,#000 92%,transparent),radial-gradient(#000,#000);">
  <div style="text-align:center;font-size:28px;font-weight:600;letter-spacing:-.01em">${o.shop || "Westside Performance"}</div>
  <div style="text-align:center;font-size:17px;margin-top:4px">${o.date || "&nbsp;"}</div>
  <div style="border-top:2px dashed rgba(0,0,0,${.25 * (1 - (o.faded || 0))});margin:16px 0"></div>
  ${(o.lines || []).map(([a, b]) => `<div style="display:flex;justify-content:space-between;font-size:26px;margin:8px 0"><span>${a}</span><span>${b}</span></div>`).join("")}
  ${o.stain ? `<div style="position:absolute;right:40px;top:60px;width:150px;height:150px;border-radius:50%;box-shadow:inset 0 0 0 10px rgba(140,90,40,.22),inset 0 0 30px rgba(140,90,40,.12)"></div>` : ""}</div>`;

// ---------- title card (trailer) ----------
const titleCard = (big, small = "", o = {}) => `<div class="abs" style="left:0;right:0;top:${o.top || 760}px;text-align:center;z-index:6">
  <div style="font-size:${o.size || 220}px;font-weight:800;letter-spacing:-.05em;line-height:1;color:${o.color || "#1D1D1F"};font-variation-settings:'opsz' 32">${big}</div>
  ${small ? `<div style="font-size:48px;font-weight:500;letter-spacing:-.02em;color:${o.color2 || "#86868B"};margin-top:24px">${small}</div>` : ""}</div>`;

// ---------- end card ----------
const endCard = (line, cta = "fuelmybuild.com", o = {}) => `<div class="abs" style="left:50%;top:${o.top || 720}px;transform:translateX(-50%)">${logo(560)}</div>
  <div class="sub" style="top:${(o.top || 720) + 150}px">${line}</div>
  <div class="abs" style="left:0;right:0;top:${(o.top || 720) + 290}px;text-align:center;font-size:52px;font-weight:600;letter-spacing:-.02em;color:#F43034">${cta}</div>
  ${o.illustrative === false ? "" : `<div class="abs" style="left:0;right:0;bottom:200px;text-align:center;font-size:24px;color:#86868B">Illustrative story</div>`}`;

// small helpers
const big = (html, x, y, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;font-size:${o.size || 124}px;font-weight:${o.w || 700};letter-spacing:-.045em;line-height:1;color:${o.color || "#1D1D1F"};font-variant-numeric:tabular-nums;font-variation-settings:'opsz' 32;z-index:${o.z || 6};${o.style || ""}">${html}</div>`;
const txt = (html, x, y, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;${o.w ? `width:${o.w}px;` : ""}font-size:${o.size || 40}px;font-weight:${o.weight || 500};letter-spacing:-.02em;color:${o.color || "#1D1D1F"};z-index:${o.z || 6};${o.style || ""}">${html}</div>`;
