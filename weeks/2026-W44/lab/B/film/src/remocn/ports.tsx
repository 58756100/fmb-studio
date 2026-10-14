// @ts-nocheck
// Time-driven ports of remocn pieces (github.com/Remocn/remocn, MIT, see LICENSE.txt).
// Our scenes are pure functions of absolute time t (seconds), so these take t / t0 instead of
// useCurrentFrame(). Motion constants follow the originals (frames @30 fps).
import React from "react";
import { Easing } from "remotion";

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const FPS = 30;

// ---------- trim-burst (registry/remocn/trim-burst) ----------
// Short strokes shoot out from a point and vanish in flight; punctuates a tap or a landing.
const LIFE = 15, LAG = 3, STAGGER = 1.2;
const END_EASE = Easing.bezier(0.16, 1, 0.3, 1);
const START_EASE = Easing.bezier(0.45, 0, 0.55, 1);
const hash = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TrimBurst = ({ t, t0, x, y, count = 8, inner = 26, reach = 70, weight = 4, color = "#F43034", rotation = 0, spread = 360, seed = 1 }) => {
  const f = (t - t0) * FPS;
  if (f < 0 || f > LIFE + LAG + STAGGER * count + 2) return null;
  const lines = [];
  for (let i = 0; i < count; i++) {
    const a = ((rotation + (spread === 360 ? (i * 360) / count : -spread / 2 + (i * spread) / Math.max(1, count - 1)) + (hash(seed * 31 + i) - 0.5) * 0.5 * (360 / count)) * Math.PI) / 180;
    const sc = 0.8 + 0.4 * hash(seed * 17 + i);
    const fi = f - (i % 3) * STAGGER;
    const pe = END_EASE(clamp(fi / LIFE)), ps = START_EASE(clamp((fi - LAG) / LIFE));
    if (pe <= ps + 0.001) continue;
    const r0 = inner + reach * sc * ps, r1 = inner + reach * sc * pe;
    lines.push(<line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={weight} strokeLinecap="round" />);
  }
  return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>{lines}</svg>;
};

// ---------- strikethrough-replace (registry/remocn/strikethrough-replace) ----------
// Draws a strike through the old text, then fades the new text in beneath it. dur = whole move (s).
export const Strike = ({ t, t0, dur = 0.8, from, to, style = {}, lineColor = "#F43034", fontSize = 40 }) => {
  const p = clamp((t - t0) / dur);
  const line = clamp(p / 0.4) * 100;
  const fo = 1 - clamp((p - 0.4) / 0.2), to_ = clamp((p - 0.4) / 0.2);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", ...style }}>
      <span style={{ position: "absolute", left: 0, whiteSpace: "nowrap", opacity: fo }}>
        {from}
        <span style={{ position: "absolute", left: 0, top: "52%", height: Math.max(2, Math.round(fontSize * 0.08)), width: `${line}%`, background: lineColor, translate: "0 -50%", borderRadius: 2 }} />
      </span>
      <span style={{ whiteSpace: "nowrap", opacity: to_, translate: `0 ${(1 - to_) * 8}px` }}>{to}</span>
    </span>
  );
};

// ---------- slide-swap (registry/remocn/slide-swap) ----------
// Shove one view off and spring the next in. Spring-in with overshoot clamping, power-curve exit.
export const springClamp = (x, k = 300, d = 60, m = 0.5) => { // remotion spring, overshootClamping
  if (x <= 0) return 0; const w0 = Math.sqrt(k / m), z = d / (2 * Math.sqrt(k * m));
  let v; if (z < 1) { const wd = w0 * Math.sqrt(1 - z * z); v = 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x)); } else v = 1 - Math.exp(-w0 * x) * (1 + w0 * x);
  return Math.min(1, v);
};
export const slideIn = (t, t0, size = 1080, axis = "x") => {
  const e = (t - t0) * FPS; if (e >= 30) return {};
  const p = springClamp(Math.max(e, 0) / FPS); const fade = clamp(e / 24);
  const v = 0.28 * size * (1 - p);
  return { translate: axis === "x" ? `${v}px` : `0 ${v}px`, opacity: e < 0 ? 0 : 1 - (1 - fade) * (1 - fade) };
};
export const slideOut = (t, t0, size = 1080, axis = "x") => {
  const e = (t - t0) * FPS; if (e <= 0) return {};
  const k = clamp(e / 22); const v = -0.1 * size * k ** 5;
  return { translate: axis === "x" ? `${v}px` : `0 ${v}px`, opacity: 1 - k * k };
};

// ---------- drift (registry/remocn/drift) ----------
// Slow camera push so no frame is ever static. Returns a scale for [a, b].
export const drift = (t, a, b, grow = 0.035) => 1 + grow * clamp((t - a) / Math.max(0.001, b - a));

// full-width swipe built on the slide-swap spring: returns { out, in } translateX for the old and new view
export const swipeX = (t, t0, dist = 1000) => { const p = springClamp(Math.max(0, t - t0)); return { out: -dist * p, in: dist * (1 - p), p }; };
