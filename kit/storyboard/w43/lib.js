// W43 shared storyboard helpers (loaded by page.html after the kit). Lead hook A frames, times from the beat sheet (no VO yet).
const R = w => `<span class="r">${w}</span>`;
const nz = s => String(s).replace(/(\d)(?=\d)/g, "$1​");
// every frame carries the story label (brief: "Illustrative story" from 0 s)
const illus = (t = "Illustrative story") => `<div class="abs" style="left:48px;bottom:210px;font-size:24px;color:#86868B;font-weight:500;z-index:60">${t}</div>`;
const A = (id, t, html, bg = "studio", note = "") => add(id, t, html + illus(), bg, note);
// lower-third name chip (named character + car inside 5 s)
const lower = (name, car, y = 1330, who) => chip(`${avc(car, 60)}<span>${name}</span>`, 0, y, { h: 96, fs: 38, style: "left:50%;transform:translateX(-50%)", z: 20 });
// NEW cutout stand-in: soft tile + person glyph + label. Real art is generated from the prompt in META.newCutouts.
const person = (label, x, y, w = 360, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 1.25)}px;z-index:${o.z || 3};transform:rotate(${o.rot || 0}deg);opacity:${o.op ?? 1};border-radius:${w * .12}px;background:linear-gradient(170deg,#F7F7F9,#E3E3E8);box-shadow:0 30px 60px -30px rgba(0,0,0,.3),0 0 0 2px #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${w * .05}px;${o.style || ""}">
  ${ic("person", w * .34, "#8E8E93", 1.4)}<div style="font-size:${Math.max(22, w * .075)}px;font-weight:600;color:#3C3C43;letter-spacing:-.02em;text-align:center;line-height:1.15">${label}</div>
  <div style="font-size:${Math.max(16, w * .046)}px;color:#AEAEB2;font-weight:600;letter-spacing:.02em">new cutout</div></div>`;
// generic prop stand-in (new object cutout)
const prop = (label, x, y, w = 360, h = 260, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${o.z || 3};transform:rotate(${o.rot || 0}deg);border-radius:28px;background:linear-gradient(170deg,#F7F7F9,#E6E6EB);box-shadow:0 26px 50px -26px rgba(0,0,0,.3),0 0 0 2px #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;${o.style || ""}">
  ${ic(o.icon || "photo", Math.min(w, h) * .3, "#8E8E93", 1.4)}<div style="font-size:${o.fs || 26}px;font-weight:600;color:#3C3C43;text-align:center;letter-spacing:-.02em;padding:0 14px;line-height:1.15">${label}</div><div style="font-size:16px;color:#AEAEB2;font-weight:600">new cutout</div></div>`;
const stamp = (t, x, y, rot = -8, color = "#F43034", size = 84) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:30;transform:rotate(${rot}deg);padding:10px 36px 14px;border:9px solid ${color};border-radius:22px;color:${color};font-size:${size}px;font-weight:800;letter-spacing:-.04em;background:rgba(255,255,255,.78)">${t}</div>`;
const sticky = (t, x, y, rot = -3, w = 330, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:${o.z || 8};transform:rotate(${rot}deg);background:#FFE98A;padding:26px 28px 40px;font-size:${o.fs || 38}px;font-weight:600;letter-spacing:-.025em;line-height:1.1;color:#3A3000;box-shadow:0 24px 40px -22px rgba(0,0,0,.35);border-radius:4px 4px 18px 4px">${t}</div>`;
const numeral = (n, color = "#1D1D1F", x = 0, y = 330, size = 520, o = {}) => `<div class="abs" style="left:${x}px;right:${o.right ?? 0}px;top:${y}px;text-align:center;font-size:${size}px;font-weight:800;letter-spacing:-.06em;line-height:.9;color:${color};font-variation-settings:'opsz' 32;z-index:${o.z || 2};opacity:${o.op ?? 1}">${n}</div>`;
const bubble = (t, x, y, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:${o.z || 8};max-width:${o.w || 640}px;font-size:${o.fs || 44}px;line-height:1.2;letter-spacing:-.015em;padding:.42em .74em;border-radius:1.1em;background:${o.me ? "#0A84FF" : "#E9E9EB"};color:${o.me ? "#fff" : "#000"};box-shadow:${o.shadow || "none"};${o.style || ""}">${t}</div>`;
const dots = (x, y, me = false, fs = 48) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:8;font-size:${fs}px;background:${me ? "#0A84FF" : "#E9E9EB"};border-radius:1.2em;padding:.62em .85em;display:flex;gap:.28em">${[.9, .6, .35].map(o => `<i style="width:.46em;height:.46em;border-radius:50%;background:${me ? "#fff" : "#8E8E93"};opacity:${o}"></i>`).join("")}</div>`;
const spine = (html, y = 190, o = {}) => chip(html, 0, y, { h: o.h || 92, fs: o.fs || 44, style: "left:50%;transform:translateX(-50%)", z: 12, bg: o.bg });
// iMessage thread (from W42 C2), big and readable
const hOf = (m, fs) => m.status ? .62 * fs : m.dots ? 1.7 * fs * (m.s || 1) : m.link ? 9 * fs : (m.t.length * 1.22 + .84) * fs;
const el = (m, y, fs) => {
  const side = m.me || m.status ? "right" : "left", off = m.status ? 90 : 60, f = m.dots ? fs * (m.s || 1) : fs;
  const pos = `${side}:${off}px;top:${y}px;font-size:${f}px;z-index:4;`;
  if (m.status) return `<div class="abs" style="${pos}font-size:${fs * .5}px;color:#8E8E93;font-weight:500">${m.status}</div>`;
  if (m.dots) return `<div class="abs" style="${pos}background:${m.me ? "#0A84FF" : "#E9E9EB"};border-radius:1.2em;padding:.62em .85em;display:flex;gap:.28em;opacity:${m.op ?? 1}">${[.9, .6, .35].map(o => `<i style="width:.46em;height:.46em;border-radius:50%;background:${m.me ? "#fff" : "#8E8E93"};opacity:${o}"></i>`).join("")}</div>`;
  if (m.link) return `<div class="abs" style="${pos}width:13.4em;height:9em;border-radius:.9em;overflow:hidden;background:#E9E9EB;box-shadow:0 30px 60px -30px rgba(0,0,0,.3)">${ph(m.link.img, "", 670, 330, { r: 0, inset: 4, style: "width:100%;height:6.4em" })}
      <div style="padding:.3em .6em"><div style="font-size:.66em;font-weight:600;line-height:1.2;letter-spacing:-.015em;white-space:nowrap">${nz(m.link.title)}</div><div style="font-size:.56em;color:#8E8E93;margin-top:.1em">${nz(m.link.url)}</div></div></div>`;
  return `<div class="abs" style="${pos}white-space:nowrap;background:${m.me ? "#0A84FF" : "#E9E9EB"};color:${m.me ? "#fff" : "#000"};border-radius:1.12em;padding:.42em .74em;line-height:1.22;letter-spacing:-.015em;${m.hl ? "box-shadow:0 0 0 .08em #F43034;" : ""}">${m.t.map(nz).join("<br>")}</div>`;
};
const thread = (msgs, fs, bottom) => {
  const gaps = msgs.map((m, i) => i ? (msgs[i].status ? -.08 * fs : (!!msgs[i - 1].me !== !!m.me ? .4 : .26) * fs) : 0);
  const total = msgs.reduce((a, m, i) => a + hOf(m, fs) + gaps[i], 0);
  let y = bottom - total;
  return msgs.map((m, i) => { y += gaps[i]; const h = hOf(m, fs); const o = el(m, y, fs); y += h; return o; }).join("");
};
const phoneW = 640; // standard device width in a mid-frame phone
const dev = (screen, o = {}) => device(screen, { x: o.x ?? 220, y: o.y ?? 560, w: o.w ?? 640, z: o.z || "z-index:3" });
const bp = (o) => buildPage(o); // alias
