const IMG = (typeof IMGROOT !== "undefined" ? IMGROOT : "../../remotion/public/img/");
// ---------- SF-style glyphs (24 grid, stroke-based, round joins) ----------
const P = {
  search: '<circle cx="10.5" cy="10.5" r="6.6"/><path d="M15.4 15.4 20.5 20.5"/>',
  chevR: '<path d="M9 4.8 16.2 12 9 19.2"/>',
  chevL: '<path d="M15 4.8 7.8 12 15 19.2"/>',
  chevD: '<path d="M5.5 9 12 15.5 18.5 9"/>',
  plus: '<path d="M12 4.5v15M4.5 12h15"/>',
  up: '<path d="M12 19.5V5M5.8 11.2 12 5l6.2 6.2"/>',
  check: '<path d="M5 12.6 9.6 17.2 19.2 7.2"/>',
  x: '<path d="M6 6 18 18M18 6 6 18"/>',
  ellipsis: '<circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  camera: '<path d="M3.5 8.6c0-1.1.9-2 2-2h2.3l1.4-2.1h5.6l1.4 2.1h2.3c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
  photo: '<rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.8"/><circle cx="8.6" cy="9.6" r="1.7"/><path d="m3.6 17 5.2-4.6 3.6 3.1 3.1-2.6 4.9 4.3"/>',
  bubble: '<path d="M12 4.2c4.7 0 8.4 3 8.4 6.9s-3.7 6.9-8.4 6.9c-.9 0-1.8-.1-2.6-.3L5 19.6l1-3.6C4.5 14.7 3.6 13 3.6 11.1 3.6 7.2 7.3 4.2 12 4.2z"/>',
  heart: '<path d="M12 19.6s-7.6-4.6-7.6-10a4.2 4.2 0 0 1 7.6-2.5 4.2 4.2 0 0 1 7.6 2.5c0 5.4-7.6 10-7.6 10z"/>',
  send: '<path d="M20.5 3.5 10.2 13.8M20.5 3.5 14 20.5l-3.8-6.7L3.5 10z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2"/>',
  wrench: '<path d="M14.6 4.2a4.6 4.6 0 0 0-5.3 6.2l-5.4 5.4a1.9 1.9 0 0 0 2.7 2.7l5.4-5.4a4.6 4.6 0 0 0 6.2-5.3l-2.7 2.7-2.4-.5-.5-2.4z"/>',
  house: '<path d="M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.6v-5.4H9.6V20H5a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="4" y="4" width="6.6" height="6.6" rx="1.6"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="1.6"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="1.6"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1.6"/>',
  person: '<circle cx="12" cy="8.4" r="3.8"/><path d="M4.8 20c.8-3.7 3.6-5.6 7.2-5.6s6.4 1.9 7.2 5.6"/>',
  bookmark: '<path d="M6.5 4.5h11v15.4L12 15.8l-5.5 4.1z"/>',
  share: '<path d="M12 14.5V3.8M8.2 7.4 12 3.6l3.8 3.8"/><path d="M8.4 10.2H6.6c-1 0-1.8.8-1.8 1.8v6.6c0 1 .8 1.8 1.8 1.8h10.8c1 0 1.8-.8 1.8-1.8V12c0-1-.8-1.8-1.8-1.8h-1.8"/>',
  storefront: '<path d="M4 9.2 5.4 4.6h13.2L20 9.2c0 1.5-1.2 2.6-2.7 2.6S14.7 10.7 14.7 9.2c0 1.5-1.2 2.6-2.7 2.6S9.3 10.7 9.3 9.2c0 1.5-1.2 2.6-2.6 2.6S4 10.7 4 9.2z"/><path d="M5.4 11.6V20h13.2v-8.4M10 20v-4.6h4V20"/>',
  tag: '<path d="M3.8 12.6V4.8c0-.6.4-1 1-1h7.8l7.6 7.6c.4.4.4 1 0 1.4l-7.8 7.8c-.4.4-1 .4-1.4 0z"/><circle cx="8.4" cy="8.4" r="1.4"/>',
  car: '<path d="M4.2 14.6 5.6 9.8c.3-1 1.2-1.6 2.2-1.6h8.4c1 0 1.9.6 2.2 1.6l1.4 4.8"/><rect x="3" y="13.6" width="18" height="4.6" rx="1.4"/><path d="M5.6 18.2v1.6M18.4 18.2v1.6"/><circle cx="7.4" cy="15.9" r=".9" fill="currentColor"/><circle cx="16.6" cy="15.9" r=".9" fill="currentColor"/>',
  gauge: '<path d="M4 16.4a8.4 8.4 0 1 1 16 0"/><path d="M12 13.6 15.6 9"/><circle cx="12" cy="13.8" r="1.3" fill="currentColor"/>',
  sparkle: '<path d="M12 3.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z"/>',
  calendar: '<rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6"/><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4"/>',
  docs: '<path d="M7 3.6h7.2l4.4 4.4v11.2c0 .7-.5 1.2-1.2 1.2H7c-.7 0-1.2-.5-1.2-1.2V4.8c0-.7.5-1.2 1.2-1.2z"/><path d="M14 3.8V8.4h4.4M9 12.4h6M9 15.6h6"/>',
  globe: '<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.4 2.4 3.4 5.2 3.4 8.4s-1 6-3.4 8.4c-2.4-2.4-3.4-5.2-3.4-8.4s1-6 3.4-8.4z"/>',
  bell: '<path d="M6.2 16.6V11a5.8 5.8 0 0 1 11.6 0v5.6l1.6 1.8H4.6z"/><path d="M10 20.2a2.2 2.2 0 0 0 4 0"/>',
  flash: '<path d="M8.4 3.6h7.2v3.2l-2 3.4V20h-3.2v-9.8l-2-3.4z"/><path d="M8.4 6.8h7.2"/>',
  eye: '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="3"/>',
};
const ic = (name, size = 24, color = "currentColor", sw = 1.9, fill = "none") =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${color}">${P[name]}</svg>`;

// filled verified seal (checkmark.seal.fill)
const seal = (size = 20, color = "#F43034") => {
  let d = ""; const n = 12, R = 10.2, r = 8.6;
  for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r : R; d += (i ? "L" : "M") + (12 + Math.cos(a) * rr).toFixed(2) + "," + (12 + Math.sin(a) * rr).toFixed(2); }
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="${d}Z" fill="${color}" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/><path d="M8 12.3 10.8 15 16 9.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};
const checkCircle = (size = 26, color = "#F43034") => `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${color}"/><path d="M7 12.4 10.4 15.8 17.2 8.6" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// status bar glyphs
const sbIcons = (c = "#000") => `<svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx=".9" fill="${c}"/><rect x="5" y="5.4" width="3.2" height="6.6" rx=".9" fill="${c}"/><rect x="10" y="2.8" width="3.2" height="9.2" rx=".9" fill="${c}"/><rect x="15" y="0" width="3.2" height="12" rx=".9" fill="${c}"/></svg>
  <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.4c2.4 0 4.6.9 6.2 2.5l1.2-1.2C14 1.8 11.4.7 8.5.7S3 1.8 1.1 3.7l1.2 1.2C3.9 3.3 6.1 2.4 8.5 2.4z" fill="${c}"/><path d="M8.5 5.8c1.5 0 2.8.6 3.8 1.5l1.2-1.2C12.2 4.8 10.4 4.1 8.5 4.1S4.8 4.8 3.5 6.1l1.2 1.2c1-.9 2.3-1.5 3.8-1.5z" fill="${c}"/><path d="M8.5 9.1c.6 0 1.1.2 1.5.6L8.5 11.3 7 9.7c.4-.4.9-.6 1.5-.6z" fill="${c}"/></svg>
  <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.6" fill="none" stroke="${c}" stroke-opacity=".4" stroke-width="1.1"/><rect x="2.4" y="2.4" width="19.2" height="8.2" rx="2.2" fill="${c}"/><path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1z" fill="${c}" fill-opacity=".45"/></svg>`;

const statusBar = (dark = false) => `<div class="sb" style="color:${dark ? "#fff" : "#000"}"><span style="font-variant-numeric:tabular-nums">9:41</span><span class="r">${sbIcons(dark ? "#fff" : "#000")}</span></div><div class="island"></div>`;

// ---------- placeholders ----------
// id + description double as the image shot list
const SHOTS = {};
const TONES = [["#ECECEF", "#DCDCE1"], ["#EEEBE7", "#DEDAD4"], ["#E9ECEF", "#D7DCE1"], ["#EFECEC", "#DFD9D9"], ["#EAEDEA", "#D9DDD8"]];
const MAP = {1:"car-01",2:"car-01",3:"part-01",4:"part-02",5:"part-03",6:"part-04",7:"part-05",8:"car-03",9:"car-01",10:"part-07",11:"logo",12:"car-04",13:"car-05",14:"car-06",15:"car-07",16:"car-01",17:"part-01",18:"car-01",19:"car-04",20:"car-09",21:"car-10",22:"car-11",23:"car-08",
  30:"car-04",31:"car-05",32:"car-12",33:"car-07",34:"car-09",35:"car-10",36:"car-11",37:"car-08",38:"car-06"};
const remap = id => { const m = id.match(/^img (\d+)/); return m ? (MAP[+m[1]] || id) : id; };
const GLYPH = id => id.startsWith("car") ? "car" : id.startsWith("part") ? "wrench" : id.startsWith("face") ? "person" : "photo";
const ph = (id0, desc, w, h, o = {}) => {
  const id = o.as || remap(id0);
  if (/^(car|part)-\d\d$|^mech$/.test(id) && !o.placeholder) {  // real studio cutout on a soft tile
    const t0 = TONES[(parseInt(id.replace(/\D/g, "")) || 0) % TONES.length];
    return `<div style="position:relative;flex:none;overflow:hidden;width:${w}px;height:${h}px;border-radius:${o.r ?? 18}px;background:${o.bg || "linear-gradient(160deg,#F7F7F9,#E9E9EE)"};${o.style || ""}"><img src="${IMG}${id}.png" style="position:absolute;inset:${o.inset ?? 8}%;width:${100 - 2 * (o.inset ?? 8)}%;height:${100 - 2 * (o.inset ?? 8)}%;object-fit:${o.fit || "contain"}">${o.inner || ""}</div>`;
  }
  if (id === "logo") return `<div style="width:${w}px;height:${h}px;border-radius:${o.r ?? 18}px;background:#1D1D1F;color:#fff;display:grid;place-items:center;font-weight:800;letter-spacing:-.06em;font-size:${Math.round(w * .36)}px;flex:none;${o.style || ""}">YB</div>`;
  if (desc || !SHOTS[id]) SHOTS[id] = desc || SHOTS[id] || "";
  const t = TONES[(parseInt(id.replace(/\D/g, "")) || 0) % TONES.length];
  const small = Math.min(w, h) < 140;
  return `<div class="ph ${o.dark ? "dk" : ""} ${o.labelTop ? "lt" : ""}" style="width:${w}px;height:${h}px;border-radius:${o.r ?? 18}px;--a:${t[0]};--b:${t[1]};${o.fs ? `--fs:${o.fs}px;` : ""}${o.style || ""}">
    <span class="phg">${ic(GLYPH(id), Math.max(18, Math.min(64, Math.min(w, h) * .26)), "#3C3C43", 1.5)}</span>
    ${!small && !o.nolabel ? `<span class="phl"><b>${id}</b></span>` : ""}${o.inner || ""}</div>`;
};
const AVT = [["#D9C9B8", "#B9A28C"], ["#C9D2DA", "#9AAAB8"], ["#D8CFC9", "#B3A49A"], ["#CDD5C8", "#A3B099"], ["#DCCFD3", "#B9A2A9"], ["#D3CEC4", "#ACA391"]];
const av = (id0, size, desc) => {
  if (id0 === "a10") return ph("logo", "", size, size, { r: size * .26 });
  const n = (parseInt(id0.replace(/\D/g, "")) || 1); const id = "face-0" + (((n - 1) % 8) + 1);
  SHOTS[id] = desc || "portrait, natural light";
  const t = AVT[(parseInt(id.replace(/\D/g, "")) || 0) % AVT.length];
  return `<div class="av" style="width:${size}px;height:${size}px;background:radial-gradient(70% 70% at 35% 30%,${t[0]},${t[1]})"></div>`;
};

// ---------- device ----------
// screen designed at 402x874pt, scaled to width w (px)
const device = (screen, { x, y, w, rot = "", z = "", cls = "", dark = false }) => {
  const s = w / 430, band = 4 * s, bez = 14 * s, R = 68 * s;
  const H = 902 * s;
  return `<div class="device ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${H}px;--R:${R}px;--band:${band}px;transform:${rot};${z}">
    <div class="btn" style="left:${-3 * s}px;top:${200 * s}px;width:${4 * s}px;height:${36 * s}px"></div>
    <div class="btn" style="left:${-3 * s}px;top:${260 * s}px;width:${4 * s}px;height:${64 * s}px"></div>
    <div class="btn" style="right:${-3 * s}px;top:${250 * s}px;width:${4 * s}px;height:${96 * s}px"></div>
    <div class="dbody"></div><div class="bezel"></div>
    <div class="screen ${dark ? "dark" : ""}" style="left:${bez}px;top:${bez}px;width:402px;height:874px;border-radius:${56}px;transform:scale(${s})">${screen}<div class="homeind"></div></div>
  </div>`;
};

// ---------- headline ----------
const caret = '<span class="caret"></span>';
const H = (html, top, o = {}) => `<div class="h" style="top:${top}px;${o.size ? `font-size:${o.size}px;` : ""}${o.style || ""}">${html}</div>`;

// ---------- logo ----------
const logo = (w, ink = "#1D1D1F") => `<svg viewBox="0 0 487 91" style="width:${w}px;display:block"><path fill="#F43034" fill-rule="evenodd" d="${LOGO.mark}"/><path fill="${ink}" fill-rule="evenodd" d="${LOGO.word}"/></svg>`;
const mark = (w) => `<svg viewBox="0 0 86 91" style="width:${w}px;display:block"><path fill="#F43034" fill-rule="evenodd" d="${LOGO.mark}"/></svg>`;

// app icon (FMB) used in notifications etc.
const appIcon = (size, kind = "fmb") => kind === "fmb"
  ? `<div style="width:${size}px;height:${size}px;border-radius:${size * .225}px;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 .5px rgba(0,0,0,.1)">${mark(size * .62)}</div>`
  : `<div style="width:${size}px;height:${size}px;border-radius:${size * .225}px;background:linear-gradient(160deg,#2C2C2E,#000);display:grid;place-items:center">${ic("bubble", size * .56, "#fff", 2)}</div>`;

// ---------- iOS notification (lock screen glass) ----------
const notif = ({ who, text, time = "now", w = 900, s = 2.2, op = 1, style = "" }) => `<div class="glass" style="width:${w}px;border-radius:${26 * s}px;padding:${14 * s}px ${16 * s}px;display:flex;gap:${12 * s}px;align-items:center;opacity:${op};${style}">
  ${appIcon(38 * s, "chat")}
  <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;font-size:${15 * s}px;font-weight:600;letter-spacing:-.01em"><span>${who}</span><span style="font-weight:400;color:var(--label2);font-size:${13 * s}px">${time}</span></div>
  <div style="font-size:${15 * s}px;letter-spacing:-.01em;margin-top:${1 * s}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${text}</div></div></div>`;

const cursor = (x, y, s = 1) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${36 * s}px;height:${36 * s}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.28));z-index:50" viewBox="0 0 24 24"><path d="M5 2.8v16.4l4.4-4.2 3 6.6 2.8-1.3-3-6.4h6z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const touch = (x, y, s = 1) => `<div style="position:absolute;left:${x - 34 * s}px;top:${y - 34 * s}px;width:${68 * s}px;height:${68 * s}px;border-radius:50%;background:rgba(0,0,0,.12);box-shadow:0 0 0 ${10 * s}px rgba(0,0,0,.05);z-index:50"></div>`;

// ---------- real studio cutouts (kit/remotion/public/img) ----------
// cut("car-01", {x, y, w, flip, shadow, rot, op, z, filter}) — transparent PNG with a soft contact shadow
const cut = (name, o = {}) => {
  const { x = 0, y = 0, w = 600, flip = false, shadow = true, rot = 0, op = 1, z = 2, filter = "" } = o;
  const sh = shadow ? `<div style="position:absolute;left:8%;right:8%;bottom:-2%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.28),rgba(0,0,0,0));filter:blur(6px)"></div>` : "";
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};opacity:${op};transform:rotate(${rot}deg)${flip ? " scaleX(-1)" : ""};${filter ? `filter:${filter};` : ""}">${sh}<img src="${IMG}${name}.png" style="position:relative;width:100%;display:block"></div>`;
};
// soft tile behind a cutout (studio look)
const tile = (x, y, w, h, r = 44, bg = "#F5F5F7") => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${bg};z-index:1"></div>`;
// glass pill / chip
const chip = (html, x, y, o = {}) => `<div class="glass abs" style="left:${x}px;top:${y}px;z-index:${o.z || 6};display:flex;align-items:center;gap:12px;height:${o.h || 72}px;padding:0 28px;border-radius:${(o.h || 72) / 2}px;font-size:${o.fs || 32}px;font-weight:600;letter-spacing:-.015em;white-space:nowrap;background:${o.bg || "#fff"};color:${o.color || "#1D1D1F"};${o.style || ""}">${html}</div>`;
// generic iOS card (white rounded, shadow) with custom inner html
const card = (html, x, y, w, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;z-index:${o.z || 4};border-radius:${o.r || 36}px;background:#fff;padding:${o.pad ?? 28}px;box-shadow:0 40px 90px -30px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);${o.style || ""}">${html}</div>`;
