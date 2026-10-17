// @ts-nocheck
// Prototype of kit/motion: transitions that carry the story + text that flows with the voice.
// Everything is a pure function of the frame. No Math.random, no timers.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { evolvePath } from "@remotion/paths";
import { noise2D } from "@remotion/noise";

export const W = 1080, H = 1920, RED = "#F43034", INK = "#1D1D1F", GREY = "#86868B";
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const seg = (f, a, b) => clamp((f - a) / (b - a));
// house easings (named so every project uses the same curves)
export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),     // entrances
  in: Easing.bezier(0.64, 0, 0.78, 0),      // exits
  camera: Easing.bezier(0.65, 0, 0.25, 1),  // camera pushes, portals
  whip: Easing.bezier(0.7, 0, 0.2, 1),      // fast lateral moves
};
// damped spring in frames (fps-aware), light overshoot by default
export const spring = (f, fps = 30, k = 190, d = 18) => {
  const x = f / fps; if (x <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0);
  if (z >= 1) return 1 - Math.exp(-w0 * x) * (1 + w0 * x);
  const wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x));
};
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mixColor = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(",")})`; };

// ---------------------------------------------------------------- idle life (always alive)
export const drift = (f, seed, amp = 6, speed = 0.012) => ({
  x: amp * noise2D(seed + "x", f * speed, 0), y: amp * noise2D(seed + "y", 0, f * speed), r: 0.4 * noise2D(seed + "r", f * speed, f * speed),
});

// ---------------------------------------------------------------- T1 portal: the object becomes the next scene
// The camera flies into `rect` (a tile, a photo, a phone screen in the outgoing scene) while the incoming scene
// opens out of that same rect, corner radius relaxing to 0.
const PortalPres = ({ children, presentationProgress: p, presentationDirection, passedProps }) => {
  const { rect, radius = 48, blur = 8 } = passedProps;
  const e = EASE.camera(clamp(p));
  const L = lerp(rect.x, 0, e), T = lerp(rect.y, 0, e), R = lerp(W - rect.x - rect.w, 0, e), B = lerp(H - rect.y - rect.h, 0, e);
  if (presentationDirection === "entering") {
    const s = lerp(1.18, 1, e);
    return <AbsoluteFill style={{ clipPath: `inset(${T}px ${R}px ${B}px ${L}px round ${lerp(radius, 0, e)}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${rect.x + rect.w / 2}px ${rect.y + rect.h / 2}px` }}>{children}</AbsoluteFill>
    </AbsoluteFill>;
  }
  // outgoing: scale about the rect centre so the rect tracks the opening window
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
  const winW = W - L - R, winCx = L + winW / 2, winCy = T + (H - T - B) / 2;
  const s = winW / rect.w;
  return <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `translate(${winCx - cx}px, ${winCy - cy}px) scale(${s})`, filter: e > 0.02 ? `blur(${e * blur}px)` : undefined }}>{children}</AbsoluteFill>;
};
export const portal = (props) => ({ component: PortalPres, props });

// ---------------------------------------------------------------- T2 whip: lateral time/place jump
// Pair with <CameraMotionBlur> (from @remotion/motion-blur) around the series during the whip window.
const WhipPres = ({ children, presentationProgress: p, presentationDirection, passedProps }) => {
  const { dir = -1, overshoot = 0.04 } = passedProps;
  const e = EASE.whip(clamp(p));
  const x = presentationDirection === "entering" ? (1 - e) * -dir * 100 : e * dir * 100;
  const settle = presentationDirection === "entering" ? overshoot * Math.sin(Math.PI * clamp((p - 0.7) / 0.3)) * dir * 100 : 0;
  return <AbsoluteFill style={{ transform: `translateX(${x + settle}%)` }}>{children}</AbsoluteFill>;
};
export const whip = (props = {}) => ({ component: WhipPres, props });

// ---------------------------------------------------------------- text measurement (Inter opsz, cached)
const cache = new Map();
export const measure = (text, size, weight = 600) => {
  const k = `${text}|${size}|${weight}`; if (cache.has(k)) return cache.get(k);
  const s = document.createElement("span");
  Object.assign(s.style, { position: "absolute", visibility: "hidden", whiteSpace: "pre", fontFamily: "Inter", fontSize: size + "px", fontWeight: String(weight), letterSpacing: "-0.038em", fontVariationSettings: "'opsz' 32" });
  s.textContent = text; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove();
  cache.set(k, w); return w;
};

// ---------------------------------------------------------------- FlowText: headline that moves with the voice
// words: [{ w, f (spoken frame), line }]. Each word rises out of its own baseline mask on its spoken frame.
// exit: { at, mode: "up" | "left" | "right" | "into", to: {x,y} } -> words leave with the next beat's direction.
// carry: { i, at, dur, to: {x, y, size}, color } -> word i survives the cut and travels into the next scene.
export const FlowText = ({ frame, words, size = 108, top = 300, lead = 1.06, color = INK, accent = {}, exit, carry, fps = 30 }) => {
  const space = measure(" ", size);
  const lines = [...new Set(words.map((w) => w.line))];
  const pos = words.map(() => ({}));
  lines.forEach((ln) => {
    const idx = words.map((w, i) => (w.line === ln ? i : -1)).filter((i) => i >= 0);
    const widths = idx.map((i) => measure(words[i].w, size));
    let x = W / 2 - (widths.reduce((a, b) => a + b, 0) + space * (idx.length - 1)) / 2;
    idx.forEach((i, j) => { pos[i] = { x, y: top + ln * size * lead, w: widths[j] }; x += widths[j] + space; });
  });
  return <>{words.map((wd, i) => {
    const local = frame - wd.f; if (local < 0) return null;
    const pin = spring(local, fps, 210, 20), o = seg(local, 0, 5);
    let tx = 0, ty = (1 - pin) * size * 0.95, sc = 1, op = o, bl = 0, col = color;
    const accentAt = accent[i]; if (accentAt != null) col = mixColor(color, RED, seg(frame, accentAt, accentAt + 6));
    const isCarry = carry && carry.i === i;
    if (exit && !isCarry && frame >= exit.at) {
      const q = EASE.in(seg(frame, exit.at + i * (exit.stagger ?? 1.5), exit.at + i * (exit.stagger ?? 1.5) + (exit.dur ?? 10)));
      if (exit.mode === "left") tx -= q * 260; else if (exit.mode === "right") tx += q * 260;
      else if (exit.mode === "up") ty -= q * 70;
      else if (exit.mode === "push") { // camera flies through: text in front of the lens grows away from the focus point
        const cx = pos[i].x + pos[i].w / 2, cy = pos[i].y + size / 2, k = 1 + 2.2 * q; tx += (cx - exit.to.x) * (k - 1); ty += (cy - exit.to.y) * (k - 1); sc *= k; }
      else if (exit.mode === "into") { const cx = pos[i].x + pos[i].w / 2, cy = pos[i].y + size / 2; tx += q * (exit.to.x - cx); ty += q * (exit.to.y - cy); sc *= 1 - 0.75 * q; }
      op *= 1 - q; bl = q * 10;
    }
    let clip = local < 14 ? `inset(-60% -60% 0 -60%)` : undefined; // baseline mask only while rising
    if (isCarry && frame >= carry.at) {
      const p = spring(frame - carry.at, fps, 150, 19), lin = seg(frame, carry.at, carry.at + carry.dur);
      const cx = pos[i].x + pos[i].w / 2, cy = pos[i].y + size / 2;
      tx += p * (carry.to.x - cx); ty += p * (carry.to.y - cy) - Math.sin(Math.PI * lin) * 80; // arc, not a straight line
      sc *= lerp(1, carry.to.size / size, clamp(p)); col = mixColor(color, carry.color || RED, lin); clip = undefined;
    }
    return <div key={i} style={{ position: "absolute", left: pos[i].x, top: pos[i].y, height: size * 1.2, clipPath: clip, zIndex: isCarry ? 60 : 50 }}>
      <div style={{ fontFamily: "Inter", fontSize: size, fontWeight: 600, letterSpacing: "-0.038em", fontVariationSettings: "'opsz' 32", lineHeight: 1.1, whiteSpace: "pre",
        color: col, opacity: op, transformOrigin: "50% 60%", transform: `translate(${tx}px, ${ty}px) scale(${sc})`, filter: bl > 0.2 ? `blur(${bl}px)` : undefined }}>{wd.w}</div>
    </div>;
  })}</>;
};

// ---------------------------------------------------------------- DrawLine: leader / connector that draws on
export const DrawLine = ({ d, p, color = RED, width = 6, dot = true, end }) => {
  if (p <= 0) return null; const ev = evolvePath(clamp(p), d);
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 40 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
    {dot && end && p > 0.95 ? <circle cx={end.x} cy={end.y} r={10 * spring((p - 0.95) * 200, 30)} fill={color} /> : null}
  </svg>;
};
