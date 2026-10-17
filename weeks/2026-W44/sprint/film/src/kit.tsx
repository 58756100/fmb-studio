// @ts-nocheck
// W44 sprint kit: the production version of kit/motion/prototype for the 9 lab remakes.
// Everything is a pure function of absolute time t (seconds). No Math.random, no timers.
//  - voice timeline (words.json -> word times, hook variants spliced onto the body)
//  - shots with object-led transitions (portal, match cut, whip carry, object wipe, tap-to-open, silence punch, rise)
//  - FlowText: headlines on a layer above the cuts, words land on their spoken time and leave into the next beat
//  - image bank components (cutouts with contact shadows, photos with Ken Burns)
import React from "react";
import { AbsoluteFill, Easing, staticFile } from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";

export const FPS = 30, W = 1080, H = 1920;
export const RED = "#F43034", INK = "#1D1D1F", GREY = "#86868B", BG2 = "#F5F5F7";
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const seg = (t, a, b) => (b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a)));
export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.64, 0, 0.78, 0),
  camera: Easing.bezier(0.65, 0, 0.25, 1),
  whip: Easing.bezier(0.7, 0, 0.2, 1),
  io: Easing.bezier(0.45, 0, 0.55, 1),
};
// eased progress of a move starting at t0 lasting d
export const ez = (t, t0, d, e = EASE.out) => e(seg(t, t0, t0 + d));
// damped spring on seconds since start (0 before), light overshoot by default
export const spr = (dt, k = 190, d = 18) => {
  if (dt <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0);
  if (z >= 1) return 1 - Math.exp(-w0 * dt) * (1 + w0 * dt);
  const wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * dt) * (Math.cos(wd * dt) + ((z * w0) / wd) * Math.sin(wd * dt));
};
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mixColor = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(",")})`; };
export const rgba = (c, a) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; };

// ---------------------------------------------------------------- idle life (always alive)
// organic drift from @remotion/noise: no lockstep, no visible period
export const drift = (t, seed, amp = 6, speed = 0.35) => ({
  x: amp * noise2D(seed + "x", t * speed, 0.5),
  y: amp * noise2D(seed + "y", 0.5, t * speed),
  r: 0.5 * noise2D(seed + "r", t * speed, t * speed),
  s: noise2D(seed + "s", t * speed * 0.7, 3.1),
});
export const dT = (d, k = 1) => `translate(${(d.x * k).toFixed(2)}px, ${(d.y * k).toFixed(2)}px) rotate(${(d.r * k).toFixed(3)}deg)`;

// ---------------------------------------------------------------- voice timeline
// words.json rows: [word, start, end, voiceId]. A version = hook words + body words, with the body shifted so it
// starts LEAD seconds after the hook line ends (same gap as in the master).
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
export function makeTL(master, hookIdx, hookWords = null) {
  // hookIdx: number of words in the master's hook line (hook A)
  const M = master.map(([w, s, e, v], i) => ({ w, s, e, v, i }));
  const bodyStart = M[hookIdx].s;
  const gapA = bodyStart - M[hookIdx - 1].e;
  const cutA = bodyStart - Math.min(0.14, gapA / 2); // the body cut (splice point) in the master
  let hook = M.slice(0, hookIdx), shift = 0;
  if (hookWords) {
    hook = hookWords.map(([w, s, e, v], i) => ({ w, s, e, v, i }));
    const cutX = hook[hook.length - 1].e + (cutA - M[hookIdx - 1].e);
    shift = cutX - cutA;
  }
  const body = M.slice(hookIdx).map((x, i) => ({ ...x, s: x.s + shift, e: x.e + shift, i }));
  const all = [...hook, ...body];
  const cut = cutA + shift;
  const at = (text, n = 1, from = 0) => {
    const k = norm(text); let c = 0;
    for (const x of body) if (x.i >= from && norm(x.w).startsWith(k) && ++c === n) return x.s;
    throw new Error("word not found: " + text + " #" + n);
  };
  const end = (text, n = 1) => {
    const k = norm(text); let c = 0;
    for (const x of body) if (norm(x.w).startsWith(k) && ++c === n) return x.e;
    throw new Error("word not found: " + text);
  };
  const idx = (text, n = 1) => { const k = norm(text); let c = 0; for (const x of body) if (norm(x.w).startsWith(k) && ++c === n) return x.i; throw new Error("nf " + text); };
  return { hook, body, all, cut, cutA, shift, at, end, idx, last: body[body.length - 1].e, hookEnd: hook[hook.length - 1].e };
}
// headline words timed to speech. text uses "/" for a line break. Tokens are matched in order against the
// spoken words starting at time `from` (seconds); unmatched tokens borrow the previous token's time + 0.1 s.
export function wordsFor(list, text, from, opts = {}) {
  const toks = text.split(" ").filter(Boolean);
  const out = []; let line = 0, j = list.findIndex((x) => x.s >= from - 0.02); if (j < 0) j = list.length - 1;
  let lastT = list[j].s - 0.0;
  for (const tk of toks) {
    if (tk === "/") { line++; continue; }
    const k = norm(tk);
    let hit = -1;
    for (let q = j; q < Math.min(list.length, j + (out.length ? 4 : 2)); q++) {
      const nw = norm(list[q].w);
      if (k && (nw === k || nw.startsWith(k) || k.startsWith(nw) && nw.length > 2)) { hit = q; break; }
    }
    let tt;
    if (hit >= 0) { tt = list[hit].s; j = hit + 1; } else tt = out.length ? lastT + 0.1 : lastT;
    lastT = tt;
    out.push({ w: tk, t: tt, line });
  }
  return out;
}

// ---------------------------------------------------------------- images (bank v2 + one legacy cutout)
const FILES = ["A01-supra-front.webp", "A02-supra-side.webp", "A03-supra-rear.webp", "A04-240z-front.webp", "A05-240z-side.webp", "A06-240z-rear.webp",
  "A07-miata-front.webp", "A08-miata-side.webp", "A09-miata-rear.webp", "A13-r34-front.webp", "A14-r34-side.webp", "A15-r34-rear.webp",
  "A28-wrx-front.webp", "A29-wrx-side.webp", "A30-wrx-rear.webp", "B01-supra-showroom.jpg", "B02-240z-showroom.jpg", "B05-r34-showroom.jpg",
  "B06-wrx-showroom.jpg", "C01-turbocharger.webp", "C03-brake-kit.webp", "C04-cold-air-intake.webp", "C05-cat-back-exhaust.webp", "C15-v8-block.webp",
  "C16-inline-six-head.webp", "D01-smartphone-front.webp", "D03-laptop.webp", "D06-clipboard.webp", "D07-manila-folder.webp", "D09-blank-receipts.webp", "D12-magnifying-glass.webp", "D14-parts-box.webp",
  "D04-torque-wrench.webp", "D08-car-key.webp", "D10-white-mug.webp",
  "E02-collector-woman.webp", "E03-young-enthusiast.webp", "E04-shop-owner.webp", "E05-mechanic-man.webp", "E06-mechanic-woman.webp", "E07-parts-rep.webp",
  "E08-skeptical-customer.webp", "E09-collector-laughing.webp", "E10-owner-explaining.webp", "E01-collector-man.webp",
  "F01-garage-bay.jpg", "F02-home-garage.jpg", "F05-shop-counter.jpg", "F06-car-meet.jpg", "F04-warehouse-aisle.jpg",
  "G01-turbo-install.jpg", "G02-coilover-install.jpg", "G03-caliper-installed.jpg", "G04-engine-hoist.jpg", "G07-head-gasket-leak.jpg", "G08-exhaust-underside.jpg",
  "G12-finished-engine-bay.jpg", "G06-wheel-alignment.jpg", "F10-detailing-studio.jpg", "F03-showroom-floor.jpg", "D13-floor-jack.webp", "D02-smartphone-angle.webp", "legacy-evo-car-14.png"];
export const FILE = { ...Object.fromEntries(FILES.map((f) => [f.slice(0, 3) === "leg" ? "EVO" : f.slice(0, 3), f])),
  L01: "lab-b-240z-log-before.jpg", L02: "lab-b-240z-log-during.jpg", L03: "lab-b-240z-log-after.jpg", L04: "lab-b-miata-engine-hoist.jpg",
  L05: "lab-b-miata-engine-installed.jpg", L06: "lab-b-supra-turbo-during.jpg", L07: "lab-b-supra-turbo-after.jpg" };
export const ASPECT = {
  A01: 1581 / 723, A02: 1602 / 582, A03: 1594 / 783, A04: 1569 / 722, A05: 1586 / 600, A06: 1607 / 787, A07: 1597 / 793, A08: 1583 / 617, A09: 1575 / 801,
  A13: 1606 / 765, A14: 1601 / 591, A15: 1599 / 777, A28: 1581 / 793, A29: 1621 / 649, A30: 1572 / 821, C01: 1335 / 1060, C03: 1113 / 1042, C04: 1607 / 942,
  C05: 1579 / 977, C15: 1572 / 1053, C16: 1611 / 825, D01: 554 / 1036, D03: 1521 / 1067, D06: 1130 / 1078, D07: 1281 / 1002, D09: 1248 / 1047, D12: 1500 / 1003,
  D14: 1473 / 1055, D04: 1578 / 1026, D08: 1485 / 938, D10: 1062 / 953, E02: 850 / 1096, E03: 1378 / 1110, E04: 847 / 1092, E05: 866 / 1101, E06: 960 / 1099, E07: 864 / 1069,
  E08: 490 / 1003, D13: 1513 / 1032, D02: 475 / 1046, E09: 1251 / 1098, E10: 1279 / 1109, E01: 1031 / 1087, EVO: 1241 / 560,
};
export const src = (id) => staticFile("img/" + FILE[id]);
export const preloadList = (ids) => ids.map((id) => src(id));

// a cutout on the canvas, width w, centred on (cx, cy). Cars get a contact shadow at the tyres; parts a soft one.
export const Cut = ({ id, cx, cy, w, rot = 0, s = 1, o = 1, flip = false, shadow = 0.32, ground = null, blurX = 0, z, style = {} }) => {
  if (o <= 0.002) return null;
  const h = w / ASPECT[id];
  const isCar = id[0] === "A" || id === "EVO";
  const gy = ground ?? (isCar ? 0.47 : 0.46);
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: o, zIndex: z, transform: `rotate(${rot}deg) scale(${s})`, filter: blurX > 0.4 ? `url(#mbx${Math.min(8, Math.round(blurX))})` : undefined, ...style }}>
      {shadow > 0 && <div style={{ position: "absolute", left: isCar ? "6%" : "14%", right: isCar ? "6%" : "14%", top: `${(0.5 + gy) * 100 - 4}%`, height: isCar ? "9%" : "8%", borderRadius: "50%",
        background: `radial-gradient(closest-side, rgba(0,0,0,${shadow}), rgba(0,0,0,0))`, filter: "blur(6px)" }} />}
      <img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: flip ? "scaleX(-1)" : undefined }} />
    </div>
  );
};
// a photo: cover-cropped in a rounded box, with Ken Burns (zoom k0->k1 over [t0,t1]) about focus (fx, fy)
export const Photo = ({ id, x, y, w, h, r = 28, t = 0, t0 = 0, t1 = 6, k0 = 1.04, k1 = 1.1, fx = 0.5, fy = 0.5, pan = 0, o = 1, s = 1, z, shadow = true, children, style = {}, imgStyle = {} }) => {
  if (o <= 0.002) return null;
  const p = seg(t, t0, t1), k = lerp(k0, k1, EASE.io(p));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", opacity: o, zIndex: z, transform: `scale(${s})`,
      boxShadow: shadow ? "0 0 0 1px rgba(0,0,0,.06), 0 30px 50px -28px rgba(0,0,0,.45)" : undefined, background: "#111", ...style }}>
      <img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`,
        transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `translateX(${pan * (p - 0.5)}px) scale(${k})`, ...imgStyle }} />
      {children}
    </div>
  );
};
// directional motion-blur filters (horizontal / vertical), referenced as url(#mbxN) / url(#mbyN)
export const MBDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
      <React.Fragment key={n}>
        <filter id={`mbx${n}`} x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation={`${n * 3} 0`} /></filter>
        <filter id={`mby${n}`} x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation={`0 ${n * 3}`} /></filter>
      </React.Fragment>))}</defs>
  </svg>
);
export const mbx = (v) => (Math.abs(v) > 0.6 ? `url(#mbx${Math.min(8, Math.round(Math.abs(v)))})` : undefined);
export const mby = (v) => (Math.abs(v) > 0.6 ? `url(#mby${Math.min(8, Math.round(Math.abs(v)))})` : undefined);

// ---------------------------------------------------------------- shots + object-led transitions
// shots: [{ at, render: (t) => jsx, enter: { kind, d, ... } }]. A transition's midpoint sits on `at`.
//  portal  { rect:{x,y,w,h}, r }  camera flies into rect while the next scene opens out of it (reverse: pull)
//  whip    { dir: -1|1 }          fast lateral carry with directional blur and a small landing overshoot
//  match   { }                    hard cut; scenes are built so the shared object sits in the same place
//  wipe    { edge: p => x, obj: (t,p) => jsx, dir }  an object crosses; its leading edge is the wipe line
//  tap     { rect, r }            tap ripple, the card lifts and expands into the next scene (iOS zoom)
//  punch   { }                    silence punch: hard cut + 6% punch-in settling on a spring
//  rise    { }                    the new scene rises from below as the old one lifts away (vertical push)
//  pull    { rect }               reverse portal: the old scene shrinks into rect inside the new one
export const Shots = ({ t, shots }) => {
  let k = 0; shots.forEach((s, i) => { if (t >= s.at - (s.enter?.d ?? 0) / 2) k = i; });
  const cur = shots[k], tr = cur.enter, d = tr?.d ?? 0;
  const p = d > 0 ? seg(t, cur.at - d / 2, cur.at + d / 2) : 1;
  if (!tr || k === 0 || p >= 1 || tr.kind === "match" || tr.kind === "punch") {
    let style = {};
    if (tr && tr.kind === "punch" && t >= cur.at) { const q = spr(t - cur.at, 260, 22); style = { transform: `scale(${1.06 - 0.06 * q})` }; }
    if (tr && tr.kind === "match" && t >= cur.at) { const q = EASE.out(seg(t, cur.at, cur.at + 0.4)); style = { transform: `scale(${1.03 - 0.03 * q})` }; }
    return <AbsoluteFill style={style}>{cur.render(t)}</AbsoluteFill>;
  }
  const prev = shots[k - 1];
  return <Transition t={t} p={p} tr={tr} A={prev.render(t)} B={cur.render(t)} />;
};
const Transition = ({ t, p, tr, A, B }) => {
  if (tr.kind === "portal" || tr.kind === "tap") {
    const { rect, r = 40 } = tr, e = EASE.camera(p);
    const L = lerp(rect.x, 0, e), T = lerp(rect.y, 0, e), R = lerp(W - rect.x - rect.w, 0, e), Bm = lerp(H - rect.y - rect.h, 0, e);
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2, winW = W - L - R, winCx = L + winW / 2, winCy = T + (H - T - Bm) / 2, s = winW / rect.w;
    const tapRipple = tr.kind === "tap" ? <div style={{ position: "absolute", left: cx - 60, top: cy - 60, width: 120, height: 120, borderRadius: 60, border: "6px solid rgba(255,255,255,.9)",
      transform: `scale(${0.4 + 2.2 * clamp(p * 2.5)})`, opacity: 1 - clamp(p * 2.5), zIndex: 90 }} /> : null;
    return <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `translate(${winCx - cx}px, ${winCy - cy}px) scale(${tr.kind === "tap" ? lerp(1, s, e * 0.35) : s})`, filter: e > 0.03 && tr.kind !== "tap" ? `blur(${(e * 8).toFixed(1)}px)` : undefined }}>{A}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(${T}px ${R}px ${Bm}px ${L}px round ${lerp(r, 0, e)}px)` }}>
        <AbsoluteFill style={{ transform: `scale(${lerp(tr.kind === "tap" ? 1.05 : 1.16, 1, e)})`, transformOrigin: `${cx}px ${cy}px` }}>{B}</AbsoluteFill>
      </AbsoluteFill>
      {tapRipple}
    </AbsoluteFill>;
  }
  if (tr.kind === "pull") { // the old scene shrinks into rect of the new one
    const { rect, r = 36 } = tr, e = EASE.camera(p);
    const s = lerp(1, rect.w / W, e), x = lerp(0, rect.x, e), y = lerp(0, rect.y + (rect.h - H * rect.w / W) / 2, e);
    return <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${lerp(1.12, 1, e)})`, opacity: clamp(e * 3) }}>{B}</AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${s})`, borderRadius: lerp(0, r / Math.max(0.2, s), e), overflow: "hidden", opacity: 1 - seg(e, 0.85, 1) }}>{A}</div>
    </AbsoluteFill>;
  }
  if (tr.kind === "whip") {
    const dir = tr.dir ?? -1, e = EASE.whip(p);
    const v = Math.abs(EASE.whip(clamp(p + 0.04)) - EASE.whip(clamp(p - 0.04))) / 0.08; // speed 0..~2.5
    const blur = Math.min(8, v * 3.2);
    const settle = p > 0.75 ? 0.035 * Math.sin(Math.PI * seg(p, 0.75, 1)) : 0;
    return <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${e * dir * 100}%)`, filter: mbx(blur) }}>{A}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${((1 - e) * -dir + settle * dir) * 100}%)`, filter: mbx(blur) }}>{B}</AbsoluteFill>
    </AbsoluteFill>;
  }
  if (tr.kind === "wipe") {
    const x = tr.edge(p), dir = tr.dir ?? -1; // edge in px; new scene on the trailing side of the object
    const clipB = dir < 0 ? `inset(0 0 0 ${x}px)` : `inset(0 ${W - x}px 0 0)`;
    return <AbsoluteFill>
      <AbsoluteFill>{A}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clipB }}>{B}</AbsoluteFill>
      {tr.obj ? tr.obj(t, p) : null}
    </AbsoluteFill>;
  }
  if (tr.kind === "rise") {
    const e = EASE.camera(p);
    return <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${-e * 30}%) scale(${1 - 0.06 * e})`, opacity: 1 - seg(p, 0.4, 0.9), filter: e > 0.05 ? `blur(${(e * 6).toFixed(1)}px)` : undefined }}>{A}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${(1 - e) * 60}%)`, opacity: clamp(p * 2.2) }}>{B}</AbsoluteFill>
    </AbsoluteFill>;
  }
  // fallback: soft dissolve
  return <AbsoluteFill><AbsoluteFill>{A}</AbsoluteFill><AbsoluteFill style={{ opacity: p }}>{B}</AbsoluteFill></AbsoluteFill>;
};

// ---------------------------------------------------------------- text measurement (DOM, full style, cached)
const cache = new Map();
export const measure = (text, st) => {
  const k = `${text}|${st.font}|${st.size}|${st.weight}|${st.ls}|${st.upper}`; if (cache.has(k)) return cache.get(k);
  const s = document.createElement("span");
  Object.assign(s.style, { position: "absolute", visibility: "hidden", whiteSpace: "pre", fontFamily: st.font, fontSize: st.size + "px", fontWeight: String(st.weight),
    letterSpacing: st.ls, fontVariationSettings: st.opsz ? `'opsz' ${st.opsz}` : "normal", textTransform: st.upper ? "uppercase" : "none" });
  s.textContent = text; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove();
  cache.set(k, w); return w;
};

// ---------------------------------------------------------------- FlowText
// A headline whose words land on their spoken time and leave into the next beat.
// style: { font, weight, size, ls, opsz, upper, color, accent, line2, align: "center"|"left", x0, maxW, top, lead }
// head: { words:[{w,t,line}], key: [indices], keyAt (s), exit: { at, mode: up|left|right|push|down|into, to:{x,y} }, carry: { i, at, dur, to:{x,y,size} } }
export const FlowText = ({ t, head, st }) => {
  if (!head || !head.words.length) return null;
  if (t < head.words[0].t - 0.2) return null;
  if (head.exit && t > head.exit.at + 0.6 && !(head.carry && t < head.carry.at + head.carry.dur + 5)) return null;
  // fit: shrink until every line fits
  const lines = [...new Set(head.words.map((w) => w.line))];
  let size = head.size ?? st.size;
  const lineW = (ln, sz) => { const ws = head.words.filter((w) => w.line === ln); return ws.reduce((a, w) => a + measure(w.w, { ...st, size: sz }), 0) + (ws.length - 1) * measure(" ", { ...st, size: sz }); };
  while (size > (st.min ?? 64) && Math.max(...lines.map((ln) => lineW(ln, size))) > st.maxW) size -= 2;
  const S = { ...st, size }, space = measure(" ", S);
  const pos = head.words.map(() => ({}));
  const top = head.top ?? st.top;
  lines.forEach((ln) => {
    const idx = head.words.map((w, i) => (w.line === ln ? i : -1)).filter((i) => i >= 0);
    const widths = idx.map((i) => measure(head.words[i].w, S));
    const tot = widths.reduce((a, b) => a + b, 0) + space * (idx.length - 1);
    let x = st.align === "left" ? st.x0 : W / 2 - tot / 2;
    idx.forEach((i, j) => { pos[i] = { x, y: top + ln * size * st.lead, w: widths[j] }; x += widths[j] + space; });
  });
  const fy = 3 * Math.sin((2 * Math.PI * t) / 3.4) + 2 * Math.sin((2 * Math.PI * t) / 2.1 + 1); // idle float while held
  const keyset = new Set(head.key ?? []);
  return <>{head.words.map((wd, i) => {
    const lead = 4 / FPS; // words start rising 4 frames before their onset
    const local = t - (wd.t - lead); if (local < 0) return null;
    const pin = spr(local, 210, 20), o = seg(local, 0, 5 / FPS);
    let tx = 0, ty = (1 - pin) * size * 1.15 + fy, sc = 1, op = o, bl = 0;
    let col = (wd.line > 0 && st.line2 && !head.ink2) ? st.line2 : (head.color ?? st.color);
    if (keyset.has(i)) { const ka = head.keyAt ?? wd.t + 0.08; col = mixColor(col.startsWith("#") ? col : st.color, st.accent, seg(t, ka, ka + 0.2)); }
    const isCarry = head.carry && head.carry.i === i;
    const ex = head.exit;
    if (ex && !isCarry && t >= ex.at) {
      const st0 = ex.at + i * (ex.stagger ?? 0.03), q = EASE.in(seg(t, st0, st0 + (ex.dur ?? 0.28)));
      const cx = pos[i].x + pos[i].w / 2, cy = pos[i].y + size / 2;
      if (ex.mode === "left") tx -= q * 320; else if (ex.mode === "right") tx += q * 320;
      else if (ex.mode === "up") ty -= q * 90; else if (ex.mode === "down") ty += q * 90;
      else if (ex.mode === "push") { const k = 1 + 2.0 * q; tx += (cx - ex.to.x) * (k - 1); ty += (cy - ex.to.y) * (k - 1); sc *= k; }
      else if (ex.mode === "into") { tx += q * (ex.to.x - cx); ty += q * (ex.to.y - cy); sc *= 1 - 0.8 * q; }
      op *= 1 - q; bl = q * 12;
    }
    let clip = local < 0.5 ? `inset(-60% -60% 0 -60%)` : undefined; // baseline mask only while rising
    if (isCarry && t >= head.carry.at) {
      const c = head.carry, p = spr(t - c.at, 150, 19), ln = seg(t, c.at, c.at + c.dur);
      const cx = pos[i].x + pos[i].w / 2, cy = pos[i].y + size / 2;
      tx += p * (c.to.x - cx); ty += p * (c.to.y - cy) - Math.sin(Math.PI * ln) * 80;
      sc *= lerp(1, c.to.size / size, clamp(p)); col = mixColor(st.color, c.color || st.accent, ln); clip = undefined;
      if (c.fade != null) op *= 1 - seg(t, c.fade, c.fade + 0.25);
    }
    const dot = head.dot && i === head.words.length - 1 ? <PeriodDrop t={t} t0={head.dot} x={pos[i].w + size * 0.06} y={size * 0.86 - size * 0.2} size={size * 0.2} color={st.accent} /> : null;
    return <div key={i} style={{ position: "absolute", left: pos[i].x, top: pos[i].y, height: size * 1.06, clipPath: dot ? undefined : clip, zIndex: isCarry ? 61 : 60 }}>
      {dot}
      <div style={{ fontFamily: st.font, fontSize: size, fontWeight: st.weight, letterSpacing: st.ls, fontVariationSettings: st.opsz ? `'opsz' ${st.opsz}` : undefined,
        textTransform: st.upper ? "uppercase" : "none", lineHeight: 1.12, whiteSpace: "pre", color: col, opacity: op, transformOrigin: "50% 60%",
        transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`, filter: bl > 0.3 ? `blur(${bl.toFixed(1)}px)` : undefined }}>{wd.w}</div>
    </div>;
  })}</>;
};
// heads list -> automatic exits (each head leaves just before the next one's first word unless it has its own exit)
export const Heads = ({ t, heads, st }) => {
  const hs = heads.map((h, i) => {
    if (h.exit || !heads[i + 1]) return h;
    const nx = heads[i + 1].words[0].t, last = h.words[h.words.length - 1].t;
    // leave just before the next beat, or when the thought ends (gaps in speech = gaps on screen)
    return { ...h, exit: { at: Math.max(last + 0.5, Math.min(nx - 0.42, last + (h.hold ?? 1.3))), mode: h.out || "up" } };
  });
  return <>{hs.map((h, i) => <FlowText key={i} t={t} head={h} st={st} />)}</>;
};

// typed text with a caret (URLs, fields, log entries)
export const Typed = ({ t, t0, t1, text, caret = RED, style = {}, keepCaret = 0.6 }) => {
  if (t < t0) return null;
  const n = Math.round(seg(t, t0, t1) * text.length);
  const on = t < t1 + keepCaret && Math.floor((t - t0) * 2.6) % 2 === 0 || t < t1;
  return <span style={{ whiteSpace: "pre", ...style }}>{text.slice(0, n)}<span style={{ display: "inline-block", width: "0.07em", height: "0.9em", background: caret, verticalAlign: "-0.1em", marginLeft: "0.04em", borderRadius: 2, opacity: on ? 1 : 0 }} /></span>;
};

// line that draws on (@remotion/paths evolvePath)
export const DrawPath = ({ d, p, color = RED, width = 6, dash, cap = "round", z = 40 }) => {
  if (p <= 0) return null; const ev = evolvePath(clamp(p), d);
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: z, pointerEvents: "none" }}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap={cap} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
  </svg>;
};

// remocn period-drop (ported, frame-driven): a dot falls, squashes and settles as the period after a word
export const PeriodDrop = ({ t, t0, x, y, size = 22, color = RED }) => {
  if (t < t0) return null;
  const dt = t - t0, fall = clamp(dt / 0.28), yy = lerp(-260, 0, fall * fall);
  const bounce = dt > 0.28 ? Math.exp(-(dt - 0.28) * 9) * Math.abs(Math.sin((dt - 0.28) * 20)) * 26 : 0;
  const sq = dt > 0.28 && dt < 0.4 ? 1 - 0.35 * Math.sin(Math.PI * (dt - 0.28) / 0.12) : 1;
  return <div style={{ position: "absolute", left: x, top: y + yy - bounce, width: size, height: size * sq, marginTop: size * (1 - sq), borderRadius: "50%", background: color, opacity: clamp(dt / 0.05), zIndex: 70 }} />;
};

// track(t, init, [[t0, {changes}, dur?, ease?], ...]) -> state. Each change tweens from the settled previous state.
// The result also carries vx, vy (px per frame of x/y) for directional blur.
const _track = (t, init, kfs, dur, ease) => {
  let cur = { ...init };
  for (const [t0, val, d = dur, e = ease] of kfs) {
    if (t < t0) break;
    const next = { ...cur, ...val }, p = d <= 0 ? 1 : clamp((t - t0) / d);
    if (p < 1) { const q = e(p), o = {}; for (const k of Object.keys(next)) o[k] = typeof next[k] === "number" && typeof cur[k] === "number" ? lerp(cur[k], next[k], q) : next[k]; return o; }
    cur = next;
  }
  return cur;
};
export const track = (t, init, kfs, dur = 0.5, ease = EASE.camera) => {
  const a = _track(t, init, kfs, dur, ease), b = _track(t - 1 / FPS, init, kfs, dur, ease);
  a.vx = (a.x ?? 0) - (b.x ?? 0); a.vy = (a.y ?? 0) - (b.y ?? 0);
  return a;
};

// the CTA band (Signature 10, CTA landing): sits over the final story frame
export const ctaFrame = (t, t0) => { const e = EASE.camera(seg(t, t0, t0 + 0.9)); return { s: 1 - 0.04 * e, e }; };
