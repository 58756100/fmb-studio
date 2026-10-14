// @ts-nocheck
// Lane C core: every visual is a pure function of absolute time t (seconds). No Math.random, no timers.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../../../../../../../kit/remotion/public/sbkit/ui.css"; // house iOS 26 kit (Inter opsz font-face, .ios, .glass, .list ...)

export const RED = "#F43034", INK = "#1D1D1F", GREY = "#86868B", SOFT = "#F5F5F7";

// ---------- math ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const eo = p => 1 - Math.pow(1 - clamp(p), 3);              // ease-out cubic
export const eio = p => { p = clamp(p); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
export const ei = p => Math.pow(clamp(p), 3);
// damped spring, x in seconds since start; light overshoot by default (house: springs with light overshoot)
export const spring = (x, k = 170, d = 19) => { if (x <= 0) return 0; const w0 = Math.sqrt(k), z = d / (2 * w0); if (z >= 1) return 1 - Math.exp(-w0 * x) * (1 + w0 * x); const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x)); };
export const sp = (t, t0, k, d) => spring(t - t0, k, d);
export const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
export const src = p => staticFile(p);

// ---------- cutouts ----------
// Studio cutout with a soft contact shadow. Position is the box's top-left; height follows the image aspect.
export const Cut = ({ img, x = 0, y = 0, w = 600, rot = 0, op = 1, s = 1, shadow = true, z = 2, flip = false, blur = 0, origin = "50% 100%", style = {}, clip = undefined }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: op, transformOrigin: origin, transform: `rotate(${rot}deg) scale(${s})${flip ? " scaleX(-1)" : ""}`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, ...style }}>
    {shadow ? <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "-2%", height: "9%", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.26),rgba(0,0,0,0))", filter: "blur(6px)" }} /> : null}
    <Img src={src(img)} style={{ position: "relative", width: "100%", display: "block", clipPath: clip }} />
  </div>
);
export const Tile = ({ x, y, w, h, r = 56, bg = SOFT, z = 1, style = {} }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: bg, zIndex: z, ...style }} />;

// ---------- glass chip ----------
export const Chip = ({ children, x = 540, y, h = 84, fs = 40, z = 40, op = 1, s = 1, ty = 0, center = true, bg = "#fff", color = INK, style = {} }) => (
  <div className="glass" style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: op, transform: `${center ? "translateX(-50%) " : ""}translateY(${ty}px) scale(${s})`, transformOrigin: "50% 50%", display: "flex", alignItems: "center", gap: 14, height: h, padding: `0 ${h * .36}px`, borderRadius: h / 2, fontSize: fs, fontWeight: 600, letterSpacing: "-.015em", whiteSpace: "nowrap", background: bg, color, ...style }}>{children}</div>
);

// ---------- headline (words revealed on their spoken time) ----------
// lines: [{ text, color?, size? }]; at: start time of each word in order (seconds, absolute). Missing -> paced 0.12 s apart from `from`.
export const Headline = ({ t, lines, at = [], from = 0, out = 1e9, top = 300, size = 104, z = 30, gap = 0 }) => {
  let wi = 0; const fade = 1 - seg(t, out, out + 0.25);
  if (fade <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, zIndex: z, textAlign: "center", fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.04, fontVariationSettings: '"opsz" 32', opacity: fade, transform: `translateY(${-14 * seg(t, out, out + 0.25)}px)` }}>
      {lines.map((L, li) => (
        <div key={li} style={{ fontSize: L.size || size, color: L.color || (li ? GREY : INK), marginTop: li ? gap : 0, fontWeight: L.weight || 600, letterSpacing: L.track || "-.038em" }}>
          {L.text.split(" ").map((w, k) => {
            const a = at[wi] != null ? at[wi] : from + wi * 0.12; wi++;
            const p = eo((t - a) / 0.3);
            return <span key={k} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 22}px)`, filter: p < .98 ? `blur(${(1 - p) * 10}px)` : undefined, marginRight: "0.24em" }}>{w}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- captions (house caption style: caption-subtitle plate + caption-speaker tag) ----------
// cues: [{ a, b, text, who: "Eric" | "Chris" }]; Chris plays Dale in C1 and gets a grey speaker tag.
export const CAP_TOP = 1418; // band 1418–1556; nothing important below 1560 (platform UI)
export const Captions = ({ t, cues, tags = {} }) => {
  const c = cues.find(c => t >= c.a - 0.12 && t < c.b + 0.16);
  if (!c) return null;
  const pin = eo((t - (c.a - 0.12)) / 0.12), pout = 1 - clamp((t - c.b) / 0.16);
  const op = Math.min(pin, pout);
  const tag = tags[c.who];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: CAP_TOP, zIndex: 90, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${(1 - pin) * 8}px)` }}>
      <div style={{ maxWidth: 900, padding: "14px 30px 16px", borderRadius: 30, background: "rgba(255,255,255,.86)", backdropFilter: "blur(18px) saturate(180%)", WebkitBackdropFilter: "blur(18px) saturate(180%)", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 8px 24px -10px rgba(0,0,0,.18)", textAlign: "center", fontSize: 48, lineHeight: 1.18, fontWeight: 600, letterSpacing: "-.02em", color: INK, textWrap: "balance" }}>
        {tag ? <span style={{ color: GREY, fontWeight: 600, marginRight: 12 }}>{tag}</span> : null}{c.cap || c.text}
      </div>
    </div>
  );
};

// ---------- iOS glyphs (subset of kit/storyboard/kit.js) ----------
const P = {
  chevL: '<path d="M15 4.8 7.8 12 15 19.2"/>', chevR: '<path d="M9 4.8 16.2 12 9 19.2"/>',
  share: '<path d="M12 14.5V3.8M8.2 7.4 12 3.6l3.8 3.8"/><path d="M8.4 10.2H6.6c-1 0-1.8.8-1.8 1.8v6.6c0 1 .8 1.8 1.8 1.8h10.8c1 0 1.8-.8 1.8-1.8V12c0-1-.8-1.8-1.8-1.8h-1.8"/>',
  ellipsis: '<circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  calendar: '<rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6"/><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4"/>',
  wrench: '<path d="M14.6 4.2a4.6 4.6 0 0 0-5.3 6.2l-5.4 5.4a1.9 1.9 0 0 0 2.7 2.7l5.4-5.4a4.6 4.6 0 0 0 6.2-5.3l-2.7 2.7-2.4-.5-.5-2.4z"/>',
  plus: '<path d="M12 4.5v15M4.5 12h15"/>', x: '<path d="M6 6 18 18M18 6 6 18"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
  photo: '<rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.8"/><circle cx="8.6" cy="9.6" r="1.7"/><path d="m3.6 17 5.2-4.6 3.6 3.1 3.1-2.6 4.9 4.3"/>',
  box: '<path d="M3.8 7.6 12 3.6l8.2 4v8.8L12 20.4l-8.2-4z"/><path d="M3.8 7.6 12 11.6l8.2-4M12 11.6v8.8"/>',
  check: '<path d="M5 12.6 9.6 17.2 19.2 7.2"/>', truck: '<path d="M2.8 6.4h10.8v9.8H2.8zM13.6 9.6h4.2l3.4 3.4v3.2h-7.6"/><circle cx="7" cy="17.4" r="1.8"/><circle cx="17.2" cy="17.4" r="1.8"/>',
  star: '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z"/>',
  grid: '<rect x="4" y="4" width="6.6" height="6.6" rx="1.6"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="1.6"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="1.6"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1.6"/>',
  aa: '<path d="M3 18 7.6 6h.8L13 18M4.7 14h6.6M15 18l2.8-7.4h.4L21 18M15.9 15.6h4.2"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.6 4.4v4.2h-4.2"/>',
};
export const Icon = ({ n, s = 24, c = "currentColor", sw = 1.9, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ color: c, display: "inline-block", flex: "none" }} dangerouslySetInnerHTML={{ __html: P[n] }} />
);
const SB = ({ c }) => <span className="r" style={{ display: "flex", gap: 6, alignItems: "center" }}>
  <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx=".9" fill={c} /><rect x="5" y="5.4" width="3.2" height="6.6" rx=".9" fill={c} /><rect x="10" y="2.8" width="3.2" height="9.2" rx=".9" fill={c} /><rect x="15" y="0" width="3.2" height="12" rx=".9" fill={c} /></svg>
  <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.6" fill="none" stroke={c} strokeOpacity=".4" strokeWidth="1.1" /><rect x="2.4" y="2.4" width="19.2" height="8.2" rx="2.2" fill={c} /></svg></span>;
export const StatusBar = ({ dark = false }) => <>
  <div className="sb" style={{ color: dark ? "#fff" : "#000" }}><span style={{ fontVariantNumeric: "tabular-nums" }}>9:41</span><SB c={dark ? "#fff" : "#000"} /></div><div className="island" /></>;

// ---------- iPhone frame (screen designed at 402x874 pt, scaled to width w px) ----------
export const Device = ({ x, y, w, rot = 0, s = 1, op = 1, z = 10, children, dark = false, origin = "50% 50%", style = {}, screenBg = "#fff" }) => {
  const k = w / 430, band = 4 * k, bez = 14 * k, R = 68 * k, H = 902 * k;
  return (
    <div className="device" style={{ left: x, top: y, width: w, height: H, ["--R"]: `${R}px`, ["--band"]: `${band}px`, zIndex: z, opacity: op, transformOrigin: origin, transform: `rotate(${rot}deg) scale(${s})`, ...style }}>
      <div className="btn" style={{ left: -3 * k, top: 200 * k, width: 4 * k, height: 36 * k }} />
      <div className="btn" style={{ left: -3 * k, top: 260 * k, width: 4 * k, height: 64 * k }} />
      <div className="btn" style={{ right: -3 * k, top: 250 * k, width: 4 * k, height: 96 * k }} />
      <div className="dbody" /><div className="bezel" />
      <div className={"screen" + (dark ? " dark" : "")} style={{ left: bez, top: bez, width: 402, height: 874, borderRadius: 56, transform: `scale(${k})`, background: screenBg }}>{children}<div className="homeind" /></div>
    </div>
  );
};
// device geometry helper: canvas position of a point (px,py) given in screen pt
export const devPt = (d, px, py) => { const k = d.w / 430; return [d.x + 14 * k + px * k, d.y + 14 * k + py * k]; };

// ---------- small motion atoms ----------
// typing-indicator (remocn atom, rebuilt): N dots driven by t; `on` toggles the pulse for an irregular stall
export const TypingDots = ({ t, on = true, s = 1, bg = "#E9E9EB" }) => (
  <div style={{ background: bg, borderRadius: 20 * s, padding: `${12 * s}px ${16 * s}px`, display: "inline-flex", gap: 5 * s }}>
    {[0, 1, 2].map(j => { const v = on ? 0.35 + 0.6 * Math.max(0, Math.sin(t * 7.5 - j * 0.9)) : 0.35; return <i key={j} style={{ width: 9 * s, height: 9 * s, borderRadius: "50%", background: "#8E8E93", opacity: v, transform: `translateY(${on ? -2.5 * s * Math.max(0, Math.sin(t * 7.5 - j * 0.9)) : 0}px)` }} />; })}
  </div>
);
// trim-burst (remocn, rebuilt): short strokes shoot out from a point and vanish in flight
export const TrimBurst = ({ t, at, x, y, r0 = 40, r1 = 110, n = 8, color = INK, w = 6, dur = 0.42, rot = 0 }) => {
  const p = (t - at) / dur; if (p <= 0 || p >= 1) return null;
  const head = eo(p), tail = eo(clamp((p - 0.18) / 0.82));
  return <svg style={{ position: "absolute", left: x - r1 - 10, top: y - r1 - 10, zIndex: 60, overflow: "visible" }} width={2 * r1 + 20} height={2 * r1 + 20}>
    {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + rot; const c = r1 + 10; const ra = lerp(r0, r1, tail), rb = lerp(r0, r1, head);
      return <line key={i} x1={c + Math.cos(a) * ra} y1={c + Math.sin(a) * ra} x2={c + Math.cos(a) * rb} y2={c + Math.sin(a) * rb} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={1 - clamp((p - .7) / .3)} />; })}
  </svg>;
};
// touch indicator (thumb, no cursor)
export const Touch = ({ x, y, op = 1, press = 0 }) => <div style={{ position: "absolute", left: x - 38, top: y - 38, width: 76, height: 76, borderRadius: "50%", background: `rgba(0,0,0,${.13 + .07 * press})`, boxShadow: "0 0 0 10px rgba(0,0,0,.05)", zIndex: 70, opacity: op, transform: `scale(${1 - .14 * press})` }} />;
// simulated-cursor (remocn, rebuilt): arrow + click ripple
export const Cursor = ({ x, y, t, click = -1, op = 1, s = 1.4 }) => {
  const rp = click > 0 ? seg(t, click, click + 0.4) : 0; const press = click > 0 ? Math.max(0, 1 - Math.abs(t - click - 0.05) / 0.09) : 0;
  return <>
    {rp > 0 && rp < 1 ? <div style={{ position: "absolute", left: x - 40 * rp, top: y - 40 * rp, width: 80 * rp, height: 80 * rp, borderRadius: "50%", border: `3px solid rgba(0,0,0,${.35 * (1 - rp)})`, zIndex: 79 }} /> : null}
    <svg style={{ position: "absolute", left: x - 6 * s, top: y - 3 * s, width: 36 * s, height: 36 * s, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.28))", zIndex: 80, opacity: op, transform: `scale(${1 - .12 * press})`, transformOrigin: "20% 10%" }} viewBox="0 0 24 24"><path d="M5 2.8v16.4l4.4-4.2 3 6.6 2.8-1.3-3-6.4h6z" fill="#000" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  </>;
};

// rolling-number (remocn, rebuilt): every place rolls on its own clock and lands exactly on the target
export const RollingNumber = ({ t, from, to, at, dur = 0.8, prefix = "$", color = INK, h = 1.0 }) => {
  const fmt = v => v.toLocaleString("en-US");
  const A = fmt(from), B = fmt(to); const L = Math.max(A.length, B.length);
  const a = A.padStart(L, " "), b = B.padStart(L, " ");
  const down = to < from;
  let digitIdx = 0;
  return <span style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums", color }}>
    {prefix}
    {[...b].map((ch, i) => {
      const ca = a[i];
      if (!/\d/.test(ch) || !/\d/.test(ca)) return <span key={i}>{ch === " " ? "" : ch}</span>;
      const da = +ca, db = +ch; const d0 = digitIdx++;
      let steps = down ? (da - db + 10) % 10 : (db - da + 10) % 10;
      const p = eio(seg(t, at + d0 * 0.06, at + d0 * 0.06 + dur));
      const pos = down ? da - steps * p : da + steps * p; // continuous digit position
      const fl = Math.floor(pos), fr = pos - fl;
      const cur = ((fl % 10) + 10) % 10, nxt = (cur + 1) % 10;
      return <span key={i} style={{ display: "inline-block", position: "relative", height: `${h}em`, overflow: "hidden", width: "0.62em", textAlign: "center" }}>
        <span style={{ position: "absolute", left: 0, right: 0, top: `${-fr * h}em` }}>{cur}</span>
        <span style={{ position: "absolute", left: 0, right: 0, top: `${(1 - fr) * h}em` }}>{nxt}</span>
      </span>;
    })}
  </span>;
};
// value-swap (remocn): swap a label in place with a vertical slide so the layout never shifts
export const ValueSwap = ({ t, a, b, at, dur = 0.35, w }) => {
  const p = eo(seg(t, at, at + dur));
  return <span style={{ display: "inline-block", position: "relative", width: w, height: "1.15em", overflow: "hidden", verticalAlign: "bottom" }}>
    <span style={{ position: "absolute", left: 0, right: 0, top: `${-p * 1.15}em`, opacity: 1 - p }}>{a}</span>
    <span style={{ position: "absolute", left: 0, right: 0, top: `${(1 - p) * 1.15}em`, opacity: p }}>{b}</span>
  </span>;
};
// typewriter (remocn, rebuilt) with the house red caret
export const Typewriter = ({ t, text, at, cps = 16, caret = true, caretColor = RED, hideCaretAfter = 1e9 }) => {
  const n = Math.floor(clamp((t - at) * cps, 0, text.length));
  const blink = t > at + text.length / cps ? (Math.floor((t - at) * 2.2) % 2 === 0 ? 1 : 0) : 1;
  return <>{text.slice(0, n)}{caret && t < hideCaretAfter ? <span style={{ display: "inline-block", width: ".07em", height: ".9em", background: caretColor, verticalAlign: "-.08em", marginLeft: ".04em", borderRadius: 3, opacity: blink }} /> : null}</>;
};

// ---------- shots + remocn transitions ----------
import { pushThrough } from "../remocn/push-through";
import { whipPan } from "../remocn/whip-pan";
import { focusPull } from "../remocn/focus-pull";
import { zoomBlur } from "../remocn/zoom-blur";
export const TR = {
  push: (L = .5) => ({ p: pushThrough({ zoom: 1.9, blur: 14 }), L }),
  whipL: (L = .45) => ({ p: whipPan({ direction: "left", blur: 26 }), L }),
  whipR: (L = .45) => ({ p: whipPan({ direction: "right", blur: 26 }), L }),
  focus: (L = .6) => ({ p: focusPull({ blur: 16 }), L }),
  zoom: (L = .35) => ({ p: zoomBlur({ blur: 18 }), L }),
  cut: () => ({ p: null, L: 0 }),
};
const Wrap = ({ tr, prog, dir, children }) => { const C = tr.p.component; return <C presentationProgress={prog} presentationDirection={dir} passedProps={tr.p.props}>{children}</C>; };
// shots: [{ a, b, out?: TR.x(), render: (t, lt) => JSX }] -- transitions centred on each boundary
export const Shots = ({ t, shots }) => {
  const layers = [];
  shots.forEach((s, i) => {
    const tin = i > 0 ? (shots[i - 1].out || TR.cut()) : null, tout = i < shots.length - 1 ? (s.out || TR.cut()) : null;
    const Lin = tin ? tin.L : 0, Lout = tout ? tout.L : 0;
    const from = s.a - Lin / 2, to = s.b + Lout / 2;
    if (t < from || t >= to) return;
    let node = <AbsoluteFill>{s.render(t, t - s.a)}</AbsoluteFill>;
    if (tin && tin.p && t < s.a + Lin / 2) node = <Wrap tr={tin} prog={clamp((t - from) / Lin)} dir="entering">{node}</Wrap>;
    else if (tout && tout.p && t > s.b - Lout / 2) node = <Wrap tr={tout} prog={clamp((t - (s.b - Lout / 2)) / Lout)} dir="exiting">{node}</Wrap>;
    layers.push(<AbsoluteFill key={i}>{node}</AbsoluteFill>);
  });
  return <>{layers}</>;
};
export const Studio = ({ children }) => <AbsoluteFill style={{ background: "radial-gradient(120% 70% at 50% 42%,#FFFFFF 40%,#F5F5F7 100%)" }}>{children}</AbsoluteFill>;
export const Cam = ({ s = 1, x = 0, y = 0, origin = "50% 50%", children }) => <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s})`, transformOrigin: origin }}>{children}</AbsoluteFill>;
// review overlay: guides for the subtitle band and the platform-safe bottom (only when check=true)
export const Guides = () => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: 140, background: "rgba(10,132,255,.07)", zIndex: 999, borderTop: "2px dashed rgba(10,132,255,.5)" }} />
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "rgba(244,48,52,.06)", zIndex: 999, borderTop: "2px dashed rgba(244,48,52,.5)" }} />
</>;
