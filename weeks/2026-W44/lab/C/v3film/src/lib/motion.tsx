// @ts-nocheck
// Lane C v3 phase 2: the "always alive" layer (Wayne, 2026-10-14). Pure functions of absolute time t (s).
// - loop-safe idle motion: every periodic wobble has a whole number of cycles in 27 s, so frame 809 flows into frame 0
// - KText: per-word / per-character kinetic text (spring in with overshoot + blur, emphasis pop in colour, weight and scale,
//   blur-out-up exit, gentle float while held). remocn: spring-scale-in, caption-active-pop / caption-weight, blur-out-up
// - motion blur (directional SVG blur from velocity), draw-on strokes, trim-burst, sheen sweep, typewriter with red caret
import React from "react";
import { RED, INK, GREY, clamp, lerp, seg, eo, eio, hash, spring } from "./core";

export const LOOP = 27, FPS = 30, TAU = Math.PI * 2;
// periodic in 27 s: nearest whole number of cycles to the requested period
export const per = (t, period, ph = 0) => Math.sin(TAU * t * Math.max(1, Math.round(LOOP / period)) / LOOP + ph);
export const wob = (t, seed, amp = 1, period = 3) => amp * per(t, period, hash(seed) * TAU);
// decaying impulse (first lobe positive): 0 before `at`, peaks ~+amp after ~60 ms, rings out
export const bump = (t, at, amp = 1, decay = 7, w = 20) => { const x = t - at; return x <= 0 ? 0 : amp * 1.25 * Math.exp(-x * decay) * Math.sin(x * w); };
// spring overshoot 0 -> 1 (k stiffness, d damping)
export const spr = (t, at, k = 210, d = 16) => spring(t - at, k, d);
// velocity of a scalar function in px per frame
export const vel = (f, t) => (f(t) - f(t - 1 / FPS));

// ---------------------------------------------------------------- motion blur
// One defs block per canvas; blur along x or y, 1..28 px.
export const MBDefs = () => <svg width="0" height="0" style={{ position: "absolute" }}><defs>
  {Array.from({ length: 28 }, (_, i) => <React.Fragment key={i}>
    <filter id={`mbx${i + 1}`} x="-40%" y="-10%" width="180%" height="120%"><feGaussianBlur stdDeviation={`${(i + 1) * 0.5} 0`} /></filter>
    <filter id={`mby${i + 1}`} x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation={`0 ${(i + 1) * 0.5}`} /></filter>
  </React.Fragment>)}
</defs></svg>;
// vx, vy in px per frame -> CSS filter (undefined when slow). k = shutter (0.5 = 180 degrees).
export const mblur = (vx, vy, k = 0.5) => {
  const bx = Math.min(28, Math.round(Math.abs(vx) * k * 2)), by = Math.min(28, Math.round(Math.abs(vy) * k * 2));
  if (bx < 2 && by < 2) return undefined;
  return bx >= by ? `url(#mbx${bx})` : `url(#mby${by})`;
};

// ---------------------------------------------------------------- kinetic text
// emph: { "word": time } (a word's cleaned text, case-insensitive) -> pops at that time and stays in the accent colour.
const clean = w => w.replace(/[^A-Za-z0-9$,]/g, "").toLowerCase();
export const KText = ({ t, text, at, out = 1e9, unit = "word", stagger = 0.11, dist = 44, emph = {}, accent = RED, color = INK,
  weight = 600, emphWeight = 720, blurIn = 7, float = 1.1, k = 210, d = 15, from = "up", outDist = 30, style = {}, seed = "k", times = null, keepColor = true }) => {
  const words = text.split(" ");
  let n = 0;
  const unitStyle = (i, ta) => {
    const x = t - ta; if (x < -0.001) return { opacity: 0 };
    const p = spring(x, k, d), o = clamp(x / 0.16);
    const xo = t - (out + i * stagger * 0.5); const q = eio(clamp(xo / 0.34));
    const fl = float * per(t, 2.7, i * 0.9 + hash(seed) * 6) * clamp((x - 0.3) / 0.5);
    const y = (from === "up" ? (1 - p) * dist : from === "down" ? -(1 - p) * dist : 0) - q * outDist + fl;
    const xs = from === "right" ? (1 - p) * dist : from === "left" ? -(1 - p) * dist : 0;
    const bl = blurIn * (1 - clamp(x / 0.22)) + q * 9;
    return { opacity: o * (1 - q), transform: `translate(${xs}px,${y}px) scale(${0.86 + 0.14 * Math.min(1.08, p)})`, filter: bl > 0.3 ? `blur(${bl}px)` : undefined };
  };
  return <span style={{ display: "inline", ...style }}>{words.map((w, wi) => {
    const ew = Object.keys(emph).find(e => clean(e) === clean(w)); const te = ew != null ? emph[ew] : null;
    const ta = times ? times[wi] : at + wi * stagger;
    let pop = 1, col = color, wt = weight;
    if (te != null && t >= te) {
      const x = t - te; const b = bump(t, te, 0.16, 6, 17);
      pop = 1 + b; const c = clamp(x / 0.12); col = keepColor ? mix(color, accent, c) : mix(color, accent, c * (1 - clamp((x - 0.9) / 0.4)));
      wt = lerp(weight, emphWeight, clamp(x / 0.14));
    }
    const inner = unit === "char"
      ? [...w].map((c, ci) => { const i = n++; return <span key={ci} style={{ display: "inline-block", whiteSpace: "pre", ...unitStyle(i, ta + ci * 0.028) }}>{c}</span>; })
      : (n++, w);
    const us = unit === "word" ? unitStyle(wi, ta) : {};
    return <React.Fragment key={wi}>{wi ? " " : ""}<span style={{ display: "inline-grid", whiteSpace: "nowrap", verticalAlign: "top" }}>
      {/* invisible copy at the emphasis weight reserves the width, so the weight swell never shifts the line */}
      <span style={{ gridArea: "1/1", visibility: "hidden", fontWeight: Math.max(weight, te != null ? emphWeight : weight) }}>{w}</span>
      <span style={{ gridArea: "1/1", display: "inline-block", color: col, fontWeight: wt, transformOrigin: "50% 70%", ...us, transform: `${us.transform || ""} scale(${pop})`, textAlign: "center" }}>{inner}</span>
    </span></React.Fragment>;
  })}</span>;
};
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
export const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(",")})`; };

// ---------------------------------------------------------------- typewriter with a red caret (house style for typed moments)
export const Typed = ({ t, at, text, cps = 26, out = 1e9, color = RED, caret = RED, style = {} }) => {
  const nch = Math.floor(clamp((t - at) * cps, 0, text.length)); if (t < at) return null;
  const done = at + text.length / cps; const q = eio(clamp((t - out) / 0.3));
  const blink = t < done + 0.05 ? 1 : (Math.floor((t - done) / 0.27) % 2 === 0 ? 1 : 0) * (1 - clamp((t - done - 0.9) / 0.2));
  return <span style={{ color, opacity: 1 - q, filter: q > 0 ? `blur(${q * 8}px)` : undefined, transform: `translateY(${-q * 20}px)`, display: "inline-block", ...style }}>
    {text.slice(0, nch)}<span style={{ display: "inline-block", width: ".07em", height: ".9em", marginLeft: ".04em", verticalAlign: "-.1em", borderRadius: 3, background: caret, opacity: blink }} />
    <span style={{ visibility: "hidden" }}>{text.slice(nch)}</span>
  </span>;
};

// ---------------------------------------------------------------- strokes
// draw-on along any SVG path (pathLength=1). p 0..1 (head), tail 0..1 (erase from start)
export const DrawPath = ({ d, p, tail = 0, stroke = INK, w = 4, dash = null, cap = "round", style = {}, opacity = 1 }) => {
  if (p <= 0 || tail >= 1) return null;
  if (!dash) return <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" pathLength={1} strokeDasharray={`${Math.max(0, p - tail)} 2`} strokeDashoffset={-tail} opacity={opacity} style={style} />;
  // dashed line drawn on through a mask
  const id = "m" + Math.round(hash(d) * 1e6);
  return <g opacity={opacity}><mask id={id}><path d={d} fill="none" stroke="#fff" strokeWidth={w + 6} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} /></mask>
    <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap={cap} strokeDasharray={dash} mask={`url(#${id})`} /></g>;
};

// remocn trim-burst: short strokes shoot out from a point and vanish in flight, each start chasing its end
export const TrimBurst = ({ t, at, x, y, n = 7, r0 = 18, r1 = 74, color = INK, w = 4, rot = 0, spread = 360, dur = 0.34, z = 50 }) => {
  const p = (t - at) / dur; if (p <= 0 || p >= 1) return null;
  const head = eo(clamp(p * 1.25)), tail = eio(clamp((p - 0.25) / 0.75));
  return <svg style={{ position: "absolute", left: x - r1 - 10, top: y - r1 - 10, overflow: "visible", zIndex: z, pointerEvents: "none" }} width={2 * r1 + 20} height={2 * r1 + 20}>
    {Array.from({ length: n }, (_, i) => {
      const a = (rot + (spread >= 360 ? i * 360 / n : -spread / 2 + i * spread / Math.max(1, n - 1))) * Math.PI / 180;
      const ra = lerp(r0, r1, tail), rb = lerp(r0, r1, head); const c = r1 + 10;
      return <line key={i} x1={c + Math.cos(a) * ra} y1={c + Math.sin(a) * ra} x2={c + Math.cos(a) * rb} y2={c + Math.sin(a) * rb} stroke={color} strokeWidth={w} strokeLinecap="round" />;
    })}
  </svg>;
};

// light sweep across a glass surface (place inside an overflow:hidden, positioned parent). p 0..1 travel.
export const Sheen = ({ p, op = 0.32, width = 0.22, angle = 18 }) => {
  if (p <= 0 || p >= 1) return null; const x = lerp(-0.4, 1.4, p) * 100;
  return <div style={{ position: "absolute", inset: "-20%", pointerEvents: "none", zIndex: 30, mixBlendMode: "screen",
    background: `linear-gradient(${90 + angle}deg, rgba(255,255,255,0) ${x - width * 100}%, rgba(255,255,255,${op}) ${x}%, rgba(255,255,255,0) ${x + width * 100}%)` }} />;
};
// periodic sheen phase: one sweep every `every` s starting at `from`, lasting `dur`
export const sheenAt = (t, from, every, dur = 0.9) => { if (t < from) return 0; const x = (t - from) % every; return x < dur ? x / dur : 0; };

// spoken time of a word in VO line n (1-based) from the timeline JSON (estimated now; real words.json later)
export const wt = (TL, n, word, which = "a") => { const L = TL.vo[n - 1]; const w = L.words.find(x => x.w.replace(/[^A-Za-z0-9-]/g, "").toLowerCase().startsWith(word.toLowerCase())); return w ? w[which] : L.a; };
