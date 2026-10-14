// @ts-nocheck
// FMB house-style building blocks for the W44 lane B reels. Every visual is a pure function of absolute time t (s).
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";

export const FPS = 30;
export const W = 1080, H = 1920;
export const BG = "#F5F5F7", INK = "#1D1D1F", GREY = "#86868B", RED = "#F43034";
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lin = (t, a, b) => clamp((t - a) / (b - a));
export const mix = (a, b, p) => a + (b - a) * p;
export const eo = (p) => 1 - Math.pow(1 - clamp(p), 3);
export const eio = (p) => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
// damped spring with light overshoot; 0 before t0
export const spring = (t, t0, k = 190, d = 17) => {
  const x = t - t0; if (x <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0), wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + ((z * w0) / wd) * Math.sin(wd * x));
};
export const IMG = (n) => staticFile(`img/${n}.png`);

// ---------------------------------------------------------------- layout
// headline band y 260-420, product area ~450-1360, subtitles 1380-1530, bottom 360 px clear
export const HEAD_CY = 340, SAFE_L = 96, SAFE_R = 984;

// ---------------------------------------------------------------- camera
// keys: [[t, cx, cy, s]] — look at (cx, cy) with zoom s; eased between keys
export const camAt = (t, keys) => {
  if (t <= keys[0][0]) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, ...a] = keys[i], [t1, ...b] = keys[i + 1];
    if (t <= t1) { const p = eio((t - t0) / (t1 - t0)); return [t, ...a.map((v, j) => mix(v, b[j], p))]; }
  }
  return keys[keys.length - 1];
};
export const Cam = ({ t, keys, children, oy = 905 }) => {
  const [, cx, cy, s] = camAt(t, keys);
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${540 - cx * s}px, ${oy - cy * s}px) scale(${s})` }}>{children}</AbsoluteFill>;
};
export const Abs = ({ x = 0, y = 0, w, h, style = {}, children }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>;

// enter: spring-in (scale + rise + fade) starting at t0
export const pop = (t, t0, { rise = 40, s0 = 0.9, k = 190, d = 17 } = {}) => {
  const p = spring(t, t0, k, d); const o = clamp((t - t0) / 0.16);
  return { opacity: o, transform: `translateY(${(1 - p) * rise}px) scale(${s0 + (1 - s0) * p})` };
};
export const fadeOut = (t, t0, d = 0.2) => 1 - clamp((t - t0) / d);

// ---------------------------------------------------------------- imagery
const TILE_BG = "linear-gradient(180deg,#FFFFFF 0%,#F6F6F8 58%,#EDEDF0 100%)";
export const PHOTO_BG = "linear-gradient(180deg,#ECEAE6 0%,#E2DFDA 62%,#D6D3CD 100%)"; // reads as a real photo backdrop
// a studio cutout sitting on a soft tile with a contact shadow
export const Tile = ({ id, w, h, r = 36, fit, floor = 0.16, flip = false, bg = TILE_BG, imgStyle = {}, style = {}, children, shadow = true, border = true }) => {
  const isCar = id && id.startsWith("car");
  const f = fit ?? (isCar ? 0.86 : 0.72);
  return (
    <div style={{ position: "relative", overflow: "hidden", width: w, height: h, borderRadius: r, background: bg,
      boxShadow: border ? "0 0 0 1px rgba(0,0,0,.045), 0 1px 2px rgba(0,0,0,.05), 0 14px 24px -14px rgba(0,0,0,.16)" : undefined, ...style }}>
      {id && isCar && shadow ? <div style={{ position: "absolute", left: w * (0.5 - f * 0.42), width: w * f * 0.84, bottom: h * floor - h * 0.025, height: Math.max(8, h * 0.07), borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(0,0,0,.34), rgba(0,0,0,0))", filter: `blur(${Math.min(10, Math.max(2, h * 0.012))}px)` }} /> : null}
      {id && !isCar && shadow ? <div style={{ position: "absolute", left: w * 0.24, width: w * 0.52, bottom: h * 0.1, height: Math.max(8, h * 0.06), borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(0,0,0,.22), rgba(0,0,0,0))", filter: "blur(6px)" }} /> : null}
      {id ? <img src={IMG(id)} style={{ position: "absolute", left: "50%", bottom: isCar ? h * floor : h * 0.5, width: w * f, maxHeight: h * (isCar ? 0.8 : 0.8), objectFit: "contain",
        transform: `translate(-50%, ${isCar ? 0 : 50}%) ${flip ? "scaleX(-1)" : ""}`, ...imgStyle }} /> : null}
      {children}
    </div>
  );
};
// a photo (same studio cutout, photo backdrop) with optional crop: zoom about (fx, fy) in 0..1
export const Photo = ({ id, w, h, r = 28, zoom = 1, fx = 0.5, fy = 0.5, flip, fit, floor, bg = PHOTO_BG, imgStyle, style, children, border = true }) => (
  <div style={{ position: "relative", overflow: "hidden", width: w, height: h, borderRadius: r, background: bg,
    boxShadow: border ? "0 0 0 1px rgba(0,0,0,.05), 0 14px 24px -14px rgba(0,0,0,.18)" : undefined, ...style }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `translate(${(0.5 - fx) * w * clamp(zoom - 1)}px, ${(0.5 - fy) * h * clamp(zoom - 1)}px) scale(${zoom})` }}>
      <Tile id={id} w={w} h={h} r={0} fit={fit} floor={floor} flip={flip} bg="transparent" imgStyle={imgStyle} border={false} />
    </div>
    {children}
  </div>
);
// circular avatar: builders use their car as their avatar
export const Avatar = ({ id, size, bg = "#E9E6E1", style = {} }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", background: bg, flex: "none", ...style }}>
    {id === "mech" ? <img src={IMG("mech")} style={{ position: "absolute", left: "50%", top: "6%", width: "120%", transform: "translateX(-50%)" }} />
      : id.startsWith("letter:") ? <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 600, fontSize: size * 0.42, color: "#fff", background: "#8E8E93" }}>{id.slice(7)}</div>
      : <img src={IMG(id)} style={{ position: "absolute", left: "-30%", top: "24%", width: "190%" }} />}
  </div>
);

// ---------------------------------------------------------------- iOS bits (native px, readable on a phone)
export const Bubble = ({ who, av, avBg, text, w = 760, size = 40, meta, attach, style = {}, children }) => (
  <div style={{ display: "flex", gap: 18, alignItems: "flex-end", width: w, ...style }}>
    <Avatar id={av} size={84} bg={avBg} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 26, color: GREY, fontWeight: 500, margin: "0 0 8px 22px", letterSpacing: "-.01em" }}>{who}{meta ? <span style={{ color: "#AEAEB2" }}> · {meta}</span> : null}</div>
      <div style={{ background: "#E9E9EB", borderRadius: 38, padding: "22px 30px", fontSize: size, lineHeight: 1.22, letterSpacing: "-.02em", color: "#000", display: "inline-block", maxWidth: "100%" }}>
        {text}{attach}
      </div>
      {children}
    </div>
  </div>
);
// comment row (social post comments), native px
export const Comment = ({ who, av, avBg, children, meta = "2h", w = 860, hl = 0, style = {} }) => (
  <div style={{ display: "flex", gap: 20, width: w, padding: "20px 26px", borderRadius: 30, background: hl ? `rgba(244,48,52,${0.08 * hl})` : "#fff",
    boxShadow: "0 0 0 1px rgba(0,0,0,.045), 0 12px 22px -14px rgba(0,0,0,.14)", ...style }}>
    <Avatar id={av} size={76} bg={avBg} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 27, color: GREY, letterSpacing: "-.01em" }}><b style={{ color: INK, fontWeight: 600 }}>{who}</b> · {meta}</div>
      <div style={{ fontSize: 42, lineHeight: 1.2, letterSpacing: "-.022em", marginTop: 4, color: "#000", whiteSpace: "nowrap" }}>{children}</div>
    </div>
  </div>
);
export const Caret = ({ t, on = true, h = 44 }) => <span style={{ display: "inline-block", width: 4, height: h, background: RED, borderRadius: 2, marginLeft: 3, verticalAlign: "-0.12em", opacity: on && Math.floor(t * 2.4) % 2 === 0 ? 1 : on ? 0.15 : 0 }} />;
export const typed = (s, t, t0, t1) => s.slice(0, Math.round(clamp((t - t0) / (t1 - t0)) * s.length));

// iPhone 26 frame. w = outer width in px; children is a 402x874 pt screen
export const Phone = ({ w, children, style = {} }) => {
  const s = w / 430, band = 4 * s, bez = 14 * s, R = 68 * s, Hh = 902 * s;
  return (
    <div className="device" style={{ position: "relative", width: w, height: Hh, ["--R"]: `${R}px`, ["--band"]: `${band}px`, ...style }}>
      <div className="btn" style={{ left: -3 * s, top: 200 * s, width: 4 * s, height: 36 * s }} />
      <div className="btn" style={{ left: -3 * s, top: 260 * s, width: 4 * s, height: 64 * s }} />
      <div className="btn" style={{ right: -3 * s, top: 250 * s, width: 4 * s, height: 96 * s }} />
      <div className="dbody" /><div className="bezel" />
      <div className="screen" style={{ left: bez, top: bez, width: 402, height: 874, borderRadius: 56, transform: `scale(${s})` }}>{children}<div className="homeind" /></div>
    </div>
  );
};
export const PHONE_H = (w) => (902 * w) / 430;
export const StatusBar = () => (
  <><div className="sb"><span style={{ fontVariantNumeric: "tabular-nums" }}>9:41</span><span className="r">
    <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx=".9" /><rect x="5" y="5.4" width="3.2" height="6.6" rx=".9" /><rect x="10" y="2.8" width="3.2" height="9.2" rx=".9" /><rect x="15" y="0" width="3.2" height="12" rx=".9" /></svg>
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.6" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.1" /><rect x="2.4" y="2.4" width="19.2" height="8.2" rx="2.2" /></svg>
  </span></div><div className="island" /></>
);
const P = {
  chevL: <path d="M15 4.8 7.8 12 15 19.2" />, chevR: <path d="M9 4.8 16.2 12 9 19.2" />,
  share: <><path d="M12 3.5v11" /><path d="M8 7.2 12 3.5l4 3.7" /><path d="M7 10.5H5.8a1.8 1.8 0 0 0-1.8 1.8v6.4a1.8 1.8 0 0 0 1.8 1.8h12.4a1.8 1.8 0 0 0 1.8-1.8v-6.4a1.8 1.8 0 0 0-1.8-1.8H17" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3" /></>,
  photo: <><rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.8" /><circle cx="8.6" cy="9.6" r="1.7" /><path d="m3.6 17 5.2-4.6 3.6 3.1 3.1-2.6 4.9 4.3" /></>,
  cal: <><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2l-5.3 5.3a1.6 1.6 0 0 0 2.3 2.3l5.3-5.3a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.3-.6-.6-2.3z" />,
  person: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6" /></>,
  ellipsis: <><circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  heart: <path d="M12 19.6s-7.6-4.6-7.6-10a4.2 4.2 0 0 1 7.6-2.5 4.2 4.2 0 0 1 7.6 2.5c0 5.4-7.6 10-7.6 10z" />,
  doc: <><path d="M6.5 3.5h7l4 4v13h-11z" /><path d="M13.5 3.5v4h4M9 12.5h6M9 16h6" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></>,
  garage: <><path d="M3.5 10 12 4l8.5 6v10h-17z" /><path d="M7 20v-6h10v6M7 17h10" /></>,
};
export const Icon = ({ n, size = 24, color = "currentColor", sw = 1.9 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", flex: "none", color }}>{P[n]}</svg>;

// red focus ring that springs onto a region
export const Ring = ({ t, t0, t1 = 1e9, x, y, w, h, r = 28, sw = 6 }) => {
  const p = spring(t, t0, 230, 18); const o = clamp((t - t0) / 0.12) * (1 - clamp((t - t1) / 0.18));
  if (o <= 0) return null; const s = 1.12 - 0.12 * p;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, border: `${sw}px solid ${RED}`, opacity: o, transform: `scale(${s})` }} />;
};
// touch indicator: grey ripple where a finger taps
export const Tap = ({ t, t0, x, y }) => {
  const p = clamp((t - t0) / 0.42); if (t < t0 - 0.12 || p >= 1) return null;
  const pre = clamp((t - (t0 - 0.12)) / 0.12);
  return <div style={{ position: "absolute", left: x - 46, top: y - 46, width: 92, height: 92, borderRadius: "50%", background: `rgba(29,29,31,${0.16 * (t < t0 ? pre : 1 - p)})`, transform: `scale(${t < t0 ? 0.7 + 0.2 * pre : 0.9 + 0.5 * eo(p)})` }} />;
};
export const Label = ({ children, style = {} }) => <div style={{ fontSize: 30, fontWeight: 500, color: GREY, letterSpacing: "-.01em", whiteSpace: "nowrap", ...style }}>{children}</div>;
export const Chip = ({ children, red = false, style = {} }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, height: 64, padding: "0 28px", borderRadius: 32, fontSize: 32, fontWeight: 600, letterSpacing: "-.02em", whiteSpace: "nowrap",
    background: red ? RED : "#fff", color: red ? "#fff" : INK, boxShadow: red ? undefined : "0 0 0 1px rgba(0,0,0,.06), 0 10px 20px -12px rgba(0,0,0,.18)", ...style }}>{children}</div>
);
// dashed empty slot (missing evidence)
export const Empty = ({ w, h, r = 28, label, style = {}, pulse = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, border: `4px dashed rgba(134,134,139,${0.55 + 0.35 * pulse})`, background: `rgba(255,255,255,${0.55 + 0.2 * pulse})`, display: "grid", placeItems: "center", ...style }}>
    <div style={{ textAlign: "center", color: GREY }}><Icon n="photo" size={Math.min(64, w * 0.3)} color="#AEAEB2" sw={1.6} />{label ? <div style={{ fontSize: w > 500 ? 36 : 28, fontWeight: 500, marginTop: 6 }}>{label}</div> : null}</div>
  </div>
);

// ---------------------------------------------------------------- headline (band y 260-420)
// heads: [[t0, text]] — each holds until the next t0. *word* = red key word, ~word~ = grey.
let _cv = null;
const measure = (s, size) => {
  if (!_cv) _cv = document.createElement("canvas").getContext("2d");
  _cv.font = `600 ${size}px Inter`;
  return _cv.measureText(s).width - 0.038 * size * s.length;
};
export const fitSize = (s, max = 112, min = 64, width = SAFE_R - SAFE_L) => {
  const plain = s.replace(/[*~]/g, ""); const w = measure(plain, 100);
  return Math.max(min, Math.min(max, Math.floor((100 * width * 0.97) / w)));
};
// *a b* = red span, ~a b~ = grey span (spans may cover several words)
export const parse = (s) => { let mode = null; return s.split(" ").map((w) => {
  let body = w;
  if (!mode && (w[0] === "*" || w[0] === "~")) { mode = w[0]; body = w.slice(1); }
  const c = mode === "*" ? RED : mode === "~" ? GREY : undefined;
  if (mode && body.includes(mode)) mode = null;
  return { w: w.replace(/[*~]/g, ""), c }; }); };
export const Headline = ({ t, heads, cy = HEAD_CY }) => {
  const out = [];
  heads.forEach(([t0, text, o = {}], i) => {
    if (!text) return;
    const t1 = i + 1 < heads.length ? heads[i + 1][0] : 1e9;
    if (t < t0 - 0.01 || t >= t1) return;
    const size = o.size || fitSize(text, o.max || 112);
    const words = parse(text);
    const still = o.still || t0 === 0; // frame 0: the hook is already on screen
    const ex = t1 < 1e8 ? lin(t, t1 - 0.2, t1) : 0;
    out.push(
      <div key={i} style={{ position: "absolute", left: SAFE_L - 40, right: 1080 - SAFE_R - 40, top: cy - size * 0.56, textAlign: "center", fontWeight: 600, fontSize: size, lineHeight: 1.08,
        letterSpacing: "-.038em", color: INK, fontVariationSettings: "'opsz' 32", whiteSpace: "nowrap", willChange: "transform" }}>
        {words.map((w, j) => {
          const p = still ? 1 : eo(lin(t, t0 + j * 0.1, t0 + j * 0.1 + 0.3));
          return <span key={j} style={{ display: "inline-block", whiteSpace: "pre", color: w.c, opacity: p * (1 - ex), filter: `blur(${(1 - p) * 12 + ex * 10}px)`,
            transform: `translateY(${(1 - p) * 0.22 - ex * 0.28}em)` }}>{w.w}{j < words.length - 1 ? " " : ""}</span>;
        })}
      </div>);
  });
  return <>{out}</>;
};

// ---------------------------------------------------------------- burned-in VO subtitles (house caption style)
// One line per VO window: Inter 600 on a white plate, key words red, revealed on the window, gone by its end.
export const Subtitles = ({ t, subs, bottom = 1530 }) => {
  const s = subs.find(([a, b]) => t >= a - 0.001 && t < b);
  if (!s) return null;
  const [a, b, text] = s;
  const p = eo(lin(t, a, a + 0.18)), q = lin(t, b - 0.14, b);
  const words = parse(text);
  return (
    <div style={{ position: "absolute", left: SAFE_L, right: 1080 - SAFE_R, top: 0, height: bottom, display: "flex", alignItems: "flex-end", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ maxWidth: SAFE_R - SAFE_L, padding: "16px 30px 18px", borderRadius: 28, background: "rgba(255,255,255,.94)", boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 8px 18px -10px rgba(0,0,0,.16)",
        textAlign: "center", fontSize: 46, fontWeight: 600, lineHeight: 1.18, letterSpacing: "-.025em", color: INK, opacity: p * (1 - q), filter: `blur(${(1 - p) * 6 + q * 4}px)`, transform: `translateY(${(1 - p) * 10}px)` }}>
        {words.map((w, j) => <span key={j} style={{ color: w.c }}>{w.w}{j < words.length - 1 ? " " : ""}</span>)}
      </div>
    </div>
  );
};
export const Illustrative = () => <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center", fontSize: 32, fontWeight: 500, color: GREY, letterSpacing: "-.01em" }}>Illustrative example</div>;

// ---------------------------------------------------------------- shots + remocn transitions
// shots: [{ C, a, b, tin: { p: presentation, L: seconds } | null }] — a transition is centred on its cut.
const Wrap = ({ tr, prog, dir, children }) => {
  const Comp = tr.p.component;
  return <Comp presentationProgress={prog} presentationDirection={dir} passedProps={tr.p.props}>{children}</Comp>;
};
export const Shots = ({ t, shots }) => {
  const layers = [];
  shots.forEach((sc, i) => {
    const tin = sc.tin && sc.tin.p ? sc.tin : null; const nx = shots[i + 1]; const tout = nx && nx.tin && nx.tin.p ? nx.tin : null;
    const Lin = tin ? tin.L : 0, Lout = tout ? tout.L : 0;
    const from = sc.a - Lin / 2, to = sc.b + Lout / 2;
    if (t < from || t >= to) return;
    let node = <AbsoluteFill style={{ background: BG }}><sc.C t={t} a={sc.a} b={sc.b} /></AbsoluteFill>;
    if (tin && t < sc.a + Lin / 2) node = <Wrap tr={tin} prog={clamp((t - from) / Lin)} dir="entering">{node}</Wrap>;
    else if (tout && t > sc.b - Lout / 2) node = <Wrap tr={tout} prog={clamp((t - (sc.b - Lout / 2)) / Lout)} dir="exiting">{node}</Wrap>;
    layers.push(<AbsoluteFill key={i}>{node}</AbsoluteFill>);
  });
  return <>{layers}</>;
};

// product window: soft-masks a shot to y 440-1430 so camera pushes never cross the headline band or the subtitles
export const ProductWindow = ({ children, top = 436, bottom = 1436 }) => (
  <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(to bottom, transparent ${top}px, #000 ${top + 34}px, #000 ${bottom - 34}px, transparent ${bottom}px)` }}>{children}</AbsoluteFill>
);

// a log's photo strip lifts out and enlarges into a triptych (t0 .. t1)
export const Triptych = ({ t, t0, t1, photos, from = { x: 140, y: 790, w: 255 }, to = { y: 520, w: 280, h: 640 } }) => {
  if (t < t0 || t >= t1 + 0.3) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(245,245,247,${0.97 * eo(lin(t, t0, t0 + 0.3)) * (1 - lin(t, t1, t1 + 0.3))})` }}>
      {photos.map((p, k) => { const e = spring(t, t0 + k * 0.08, 200, 19); const x0 = from.x + k * (from.w + 18), x1 = 90 + k * (to.w + 30);
        const w = mix(from.w, to.w, e), h = mix(from.w, to.h, e);
        return <Abs key={k} x={mix(x0, x1, e)} y={mix(from.y, to.y, e)} style={{ opacity: 1 - lin(t, t1, t1 + 0.3) }}>
          <Photo id={p.id} w={w} h={h} r={26} fit={p.fit ? p.fit * 1.25 : 1.0} zoom={p.zoom || 1} fx={p.fx} fy={p.fy} flip={p.flip} imgStyle={p.imgStyle}>{p.extra}</Photo>
          <div style={{ fontSize: 32, color: GREY, fontWeight: 500, marginTop: 12, textAlign: "center", width: w }}>{p.label}</div></Abs>; })}
    </AbsoluteFill>);
};
