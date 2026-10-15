// @ts-nocheck
// "Always alive" kit for lane A+ (motion skill, 2026-10-14): springs with overshoot, per-word and per-character
// reveals with real exits, directional motion blur from velocity, and idle life for holds (sway, float,
// Ken Burns inside photo frames, light sweeps). Everything is a pure function of absolute time t.
// The look (palettes, fonts, layout) stays ChatGPT's; only how things move changes.
import React from "react";

export const FPS = 30;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// ---------- springs (frames). Underdamped closed form so fractional frames and velocities are exact.
// zeta 0.55 ~ 12 % overshoot (default), 0.38 ~ 27 % (kinetic pops). w in rad/frame.
export function spring(f, zeta = 0.55, w = 0.42) {
  if (f <= 0) return 0;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * f) * (Math.cos(wd * f) + ((zeta * w) / wd) * Math.sin(wd * f));
}
export const springV = (f, zeta, w) => spring(f + 0.5, zeta, w) - spring(f - 0.5, zeta, w); // per frame

// ---------- directional motion blur. Film mounts <MBDefs/>; mb(vx, vy) returns a CSS filter for a velocity in px/frame.
const MAXB = 24;
export const MBDefs = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      {Array.from({ length: MAXB }, (_, i) => i + 1).flatMap((n) => [
        <filter key={"x" + n} id={`mbx${n}`} x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation={`${n} 0`} /></filter>,
        <filter key={"y" + n} id={`mby${n}`} x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation={`0 ${n}`} /></filter>,
      ])}
    </defs>
  </svg>
);
export function mb(vx = 0, vy = 0, k = 0.32) {
  const MAXB = 16; // cap so text on long moves reads again quickly
  const bx = Math.min(MAXB, Math.round(Math.abs(vx) * k)), by = Math.min(MAXB, Math.round(Math.abs(vy) * k));
  const f = [];
  if (bx >= 1) f.push(`url(#mbx${bx})`);
  if (by >= 1) f.push(`url(#mby${by})`);
  return f.length ? f.join(" ") : undefined;
}

// ---------- idle life: slow sinusoids (period in s). seed shifts the phase so neighbours never move in lockstep.
const S = (t, P, seed) => Math.sin((2 * Math.PI * t) / P + seed * 2.39996);
export const idle = (t, seed = 0, { x = 0, y = 0, r = 0, s = 0 } = {}) => ({
  x: x * S(t, 6.1, seed), y: y * S(t, 4.7, seed + 1), r: r * S(t, 5.3, seed + 2), s: 1 + s * (0.5 + 0.5 * S(t, 7.3, seed + 3)),
});
export const idleT = (t, seed, amp) => { const i = idle(t, seed, amp); return `translate(${i.x.toFixed(2)}px, ${i.y.toFixed(2)}px) rotate(${i.r.toFixed(3)}deg) scale(${i.s.toFixed(4)})`; };
// Ken Burns inside a photo frame: zoom breathes and the subject pans a little; the frame itself stays put.
export const kenBurns = (t, seed = 0, zoom = 0.035, pan = 12) => ({ z: 1 + zoom * (0.5 + 0.5 * S(t, 4.6, seed)), dx: pan * S(t, 5.8, seed + 1), dy: pan * 0.5 * S(t, 4.1, seed + 2) });

// a soft light band crossing a box (parent must clip). Continuous so a hold never reads as a still.
export const Sweep = ({ t, period = 3.4, seed = 0, color = "255,255,255", alpha = 0.09, width = 0.45, angle = 18 }) => {
  const p = (((t / period + seed * 0.37) % 1) + 1) % 1;
  return (
    <div data-sweep="1" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 20 }}>
      <div style={{ position: "absolute", top: "-50%", height: "200%", width: `${width * 100}%`, left: `${-width * 100 - 10 + p * (120 + width * 100)}%`,
        transform: `rotate(${angle}deg)`, background: `linear-gradient(90deg, rgba(${color},0) 0%, rgba(${color},${alpha}) 50%, rgba(${color},0) 100%)` }} />
    </div>
  );
};

// ---------- text reveals
// Words / Chars: each unit springs up into place (stagger in frames), optional kinetic pop (scale overshoot) per word,
// and leaves on `out` with a staggered rise + fade. Motion blur follows each unit's vertical speed.
// pops: set of word indices (or a predicate) that get the pop.
export function unitStyle(t, ts, to, { rise = 30, pop = false, outDur = 7, outRise = 22, zeta = 0.55, w = 0.42 } = {}) {
  // ts: this unit's start time (null = already landed), to: this unit's exit start (null = stays)
  const f = ts == null ? 999 : (t - ts) * FPS;
  if (f <= 0) return { opacity: 0 };
  const z = pop ? 0.36 : zeta, ww = pop ? 0.38 : w;
  const p = spring(f, z, ww), v = springV(f, z, ww);
  let o = cl(f / 5), y = (pop ? Math.max(0, 1 - p) : 1 - p) * rise, vy = pop && p > 1 ? 0 : -v * rise; // pops overshoot in scale only
  // pops stretch mostly vertically (from the cap line), so the overshoot never runs into the next word
  const sx = pop ? 0.9 + 0.1 * p : 1, sc = pop ? 0.62 + 0.38 * p : 1;
  if (to != null && t >= to) {
    const g = (t - to) * FPS, q = cl(g / outDur), e = q * q * (3 - 2 * q);
    const qv = cl((g + 0.5) / outDur), qv0 = cl((g - 0.5) / outDur);
    o *= 1 - cl(g / (outDur * 0.6)); y += -outRise * e; vy += -outRise * ((qv * qv * (3 - 2 * qv)) - (qv0 * qv0 * (3 - 2 * qv0)));
  }
  if (o <= 0.001) return { opacity: 0 };
  return { opacity: o, transform: `translateY(${y.toFixed(2)}px)${Math.abs(sc - 1) > 1e-4 ? ` scale(${sx.toFixed(4)}, ${sc.toFixed(4)})` : ""}`, filter: mb(0, vy, 0.38) };
}
export const Words = ({ t, t0, text, out = null, pops = null, style, stagger = 4, rise = 30, outStagger = 1, outDur = 6, outRise = 14, render, offset = 0 }) => {
  if (t0 == null && out == null) return <span style={style}>{text}</span>;
  const words = String(text).split(" ");
  return (
    <span style={{ whiteSpace: "nowrap", ...style }}>
      {words.map((wd, i) => {
        const pop = pops ? (typeof pops === "function" ? pops(wd, i) : pops.has(i)) : false;
        const st = unitStyle(t, t0 == null ? null : t0 + ((i + offset) * stagger) / FPS, out == null ? null : out + (i * outStagger) / FPS, { rise, pop, outDur, outRise });
        // pops grow from the line's outer edge and the cap line, so the overshoot never leaves the safe box
        const ox = i === 0 ? "0%" : i === words.length - 1 ? "100%" : "50%";
        return <React.Fragment key={i}>{i ? " " : ""}<span style={{ display: "inline-block", transformOrigin: `${ox} 15%`, ...st }}>{render ? render(wd) : wd}</span></React.Fragment>;
      })}
    </span>
  );
};
// per character (monospace strings, e.g. URLs and dates, where splitting can't change the width)
export const Chars = ({ t, t0, text, out = null, style, stagger = 1.2, rise = 18 }) => {
  if (out == null && (t0 == null || t - t0 > 3)) return <span style={style}>{text}</span>;
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {Array.from(String(text)).map((c, i) => <span key={i} style={{ display: "inline-block", ...unitStyle(t, t0 == null ? null : t0 + (i * stagger) / FPS, out == null ? null : out + (i * 0.6) / FPS, { rise, w: 0.5 }) }}>{c}</span>)}
    </span>
  );
};

// ---------- subtitles (replaces the whole-phrase caption-subtitle): words appear in reading order across the spoken
// part of the VO window (weighted by length, so they track a ~3 words/s read), and leave with a short staggered
// rise that finishes on the window's end. Same font, size, colour, shadow and band as before.
export const SubtitleWords = ({ t, subs, color, font, size = 52, top = 1220, height = 190, left = 96, width = 784 }) => {
  const cur = subs.find(([, a, b]) => t >= a - 0.1 && t < b);
  if (!cur) return null;
  const [text, a, b] = cur;
  const words = text.split(" ");
  const wt = words.map((w) => w.length + 1), tot = wt.reduce((x, y) => x + y, 0);
  const span = Math.min(0.82 * (b - a), 0.32 * words.length + 0.2);
  let acc = 0;
  const starts = wt.map((w) => { const s0 = a - 0.06 + (span * acc) / tot; acc += w; return s0; });
  const n = words.length, outDur = 4, ost = n > 1 ? Math.min(1, (5.5 - outDur) / (n - 1) + 0.3) : 0;
  const outT = b - (outDur + ost * (n - 1) + 1) / FPS;
  return (
    <div data-sub="1" style={{ position: "absolute", left, top, width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: font, fontWeight: 600, fontSize: size, lineHeight: 1.18, color, textAlign: "center", textWrap: "balance",
        textShadow: "0 2px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.35)" }}>
        {words.map((w, i) => <React.Fragment key={i}>{i ? " " : ""}<span style={{ display: "inline-block", ...unitStyle(t, starts[i], outT + (i * ost) / FPS, { rise: 16, outDur, outRise: 12, w: 0.55, zeta: 0.6 }) }}>{w}</span></React.Fragment>)}
      </div>
    </div>
  );
};

// ---------- stage camera: a gentle handheld breathe for everything under the headline (not the headline or subtitles,
// so their left edge and band stay fixed). Scale 1.000-1.014 about (540, 800) plus a slow +/-5 px vertical drift:
// text at x >= 112 / bottom <= 1190 stays inside the safe box and above the subtitle band.
const cam = (t, amt = 1) => ({ k: 1 + amt * 0.014 * (0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 4.4)), dy: amt * 5 * Math.sin((2 * Math.PI * t) / 3.3 + 0.7) });
export const Stage = ({ t, children, amt = 1 }) => {
  const { k, dy } = cam(t, amt);
  return <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy.toFixed(2)}px) scale(${k.toFixed(5)})`, transformOrigin: "540px 800px" }}>{children}</div>;
};
// closing hold (24 s on): the breathe grows to 2x so the last seconds never settle (L2, L3)
export const endAmt = (t) => 1 + 1.0 * Math.min(1, Math.max(0, (t - 24) / 1.2));
// cancels the stage camera for text that sits right on the safe edge (x 96): the follow lines, edge labels
export const Unstage = ({ t, children, amt = 1 }) => {
  const { k, dy } = cam(t, amt);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${(1 / k).toFixed(6)}) translateY(${(-dy).toFixed(2)}px)`, transformOrigin: "540px 800px", pointerEvents: "none" }}>{children}</div>;
};
