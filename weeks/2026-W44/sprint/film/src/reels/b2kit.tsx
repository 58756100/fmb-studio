// @ts-nocheck
// Second builder's helpers for the sprint bodies (house look unless a reel says otherwise). Pure functions of t.
//  - Cloth: a code-drawn cloth (shop rag, napkin, kitchen towel) whose outline morphs between crumpled / draped / folded
//  - Entry: a FuelMyBuild build-log entry card (title, meta, lines, photo, contributor) with focus-blur field landings
//  - Blur-in helper, smooth closed paths, a simple wordmark
import React from "react";
import { Img } from "remotion";
import { W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, src, rgba, mixColor } from "../kit";
import { inter, CARD } from "./laneB";

// smooth closed path through points (Catmull-Rom -> cubic Bezier)
export const smooth = (P, k = 1) => {
  const n = P.length; let d = `M ${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * k, p1[1] + (p2[1] - p0[1]) / 6 * k], c2 = [p2[0] - (p3[0] - p1[0]) / 6 * k, p2[1] - (p3[1] - p1[1]) / 6 * k];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
};
// cloth outlines in a 0..1 box, 12 points each (same count so they morph)
export const CLOTH = {
  crumpled: [[0.18, 0.22], [0.36, 0.08], [0.55, 0.18], [0.74, 0.06], [0.9, 0.24], [0.84, 0.46], [0.96, 0.66], [0.78, 0.9], [0.55, 0.8], [0.32, 0.94], [0.1, 0.76], [0.16, 0.5]],
  draped: [[0.02, 0.1], [0.2, 0.05], [0.4, 0.08], [0.6, 0.04], [0.8, 0.07], [0.98, 0.12], [0.94, 0.5], [1.0, 0.92], [0.7, 0.98], [0.42, 0.9], [0.12, 0.97], [0.05, 0.55]],
  folded: [[0.04, 0.06], [0.26, 0.05], [0.5, 0.06], [0.74, 0.05], [0.96, 0.06], [0.97, 0.3], [0.96, 0.62], [0.97, 0.94], [0.6, 0.95], [0.3, 0.94], [0.03, 0.95], [0.04, 0.5]],
  flat: [[0.0, 0.0], [0.33, 0.01], [0.66, 0.0], [1.0, 0.01], [0.99, 0.33], [1.0, 0.66], [0.99, 1.0], [0.66, 0.99], [0.33, 1.0], [0.0, 0.99], [0.01, 0.66], [0.0, 0.33]],
};
export const mixPts = (A, B, p) => A.map((a, i) => [lerp(a[0], B[i][0], p), lerp(a[1], B[i][1], p)]);
// a cloth at (x,y) size (w,h). shape: array of points (use mixPts); kind: "rag" (red shop cloth), "napkin", "towel" (red check)
// wob: wobble amount (living fabric), folds: fold-line count, grey: memory desaturation 0..1
export const Cloth = ({ t, x, y, w, h, shape, kind = "rag", wob = 1, rot = 0, s = 1, o = 1, grey = 0, z = 20, seed = "rag", folds = 3, children, blurX = 0 }) => {
  if (o <= 0.002) return null;
  const P = shape.map(([u, v], i) => [u * w + wob * 5 * Math.sin(t * 2.1 + i * 1.7 + seed.length), v * h + wob * 4 * Math.cos(t * 1.7 + i * 2.3)]);
  const d = smooth(P);
  const id = `cl-${seed}`;
  const base = kind === "rag" ? ["#B91E24", "#E2373C"] : kind === "towel" ? ["#F7F3EE", "#FFFFFF"] : ["#ECE8E1", "#FAF8F4"];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z, transform: `rotate(${rot}deg) scale(${s})`, filter: `${grey > 0.01 ? `grayscale(${grey}) ` : ""}${blurX > 0.6 ? `url(#mbx${Math.min(8, Math.round(blurX))})` : ""}` || undefined }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={base[1]} /><stop offset="1" stopColor={base[0]} /></linearGradient>
          <pattern id={`${id}-w`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
            <path d="M0 3.5 H7 M3.5 0 V7" stroke={kind === "rag" ? "rgba(0,0,0,.10)" : "rgba(0,0,0,.035)"} strokeWidth="1.2" /></pattern>
          {kind === "towel" && <pattern id={`${id}-c`} width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(4)">
            <rect width="28" height="56" fill="rgba(214,40,46,.55)" /><rect width="56" height="28" fill="rgba(214,40,46,.55)" /></pattern>}
          <clipPath id={`${id}-clip`}><path d={d} /></clipPath>
          <filter id={`${id}-sh`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity=".28" /></filter>
        </defs>
        <path d={d} fill={`url(#${id}-g)`} filter={`url(#${id}-sh)`} />
        <g clipPath={`url(#${id}-clip)`}>
          {kind === "towel" && <rect x={-60} y={-60} width={w + 120} height={h + 120} fill={`url(#${id}-c)`} />}
          <rect x={-20} y={-20} width={w + 40} height={h + 40} fill={`url(#${id}-w)`} />
          {/* fold shading: soft dark and light bands that drift */}
          {Array.from({ length: folds }, (_, i) => {
            const fx = (0.22 + i * 0.27 + 0.03 * Math.sin(t * 0.9 + i)) * w;
            return <g key={i}><rect x={fx - 26} y={-40} width={22} height={h + 80} fill="rgba(0,0,0,.16)" transform={`rotate(${-18 + i * 14} ${fx} ${h / 2})`} style={{ filter: "blur(9px)" }} />
              <rect x={fx} y={-40} width={16} height={h + 80} fill="rgba(255,255,255,.22)" transform={`rotate(${-18 + i * 14} ${fx} ${h / 2})`} style={{ filter: "blur(7px)" }} /></g>;
          })}
        </g>
        <path d={d} fill="none" stroke={kind === "rag" ? "rgba(120,10,14,.55)" : "rgba(0,0,0,.12)"} strokeWidth={3} strokeDasharray={kind === "rag" ? "2 5" : undefined} />
      </svg>
      {children}
    </div>
  );
};

// soft landing of a UI field: focus-blur-resolve (remocn) + rise
export const land = (t, t0, dist = 22) => { const q = spr(t - t0, 200, 19); if (t < t0) return { opacity: 0 }; return { opacity: clamp(q * 2), transform: `translateY(${(1 - q) * dist}px)`, filter: q < 0.6 ? `blur(${((1 - q / 0.6) * 8).toFixed(1)}px)` : undefined }; };

// FuelMyBuild wordmark
export const Wordmark = ({ size = 44, color = INK }) => <span style={inter(size, color, 650)}>Fuel<span style={{ color: RED }}>My</span>Build</span>;

// a contributor pill: letter avatar + name (+ role)
export const Who = ({ ch, name, role, bg = "#8E8E93", size = 64 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div data-check="avatar" style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "grid", placeItems: "center", ...inter(size * 0.46, "#fff"), flex: "none" }}>{ch}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}><span style={inter(42, INK)}>{name}</span>{role && <span style={inter(40, GREY, 500)}>{role}</span>}</div>
  </div>
);

// photo inside a UI card (cover crop + slow Ken Burns)
export const Thumb = ({ id, w, h, t, r = 24, fx = 0.5, fy = 0.5, k = 1.04, style = {}, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", flex: "none", background: "#ddd", ...style }}>
    <Img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${(k + 0.02 * Math.sin(t * 0.5)).toFixed(4)})` }} />
    {children}
  </div>
);

// light sweep across a card (keeps held UI alive)
export const Sweep = ({ t, w = 960, speed = 160, o = 0.35 }) => (
  <div style={{ position: "absolute", top: 0, bottom: 0, width: 280, left: ((t * speed) % (w + 900)) - 450, background: `linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,${o}), rgba(255,255,255,0))`, pointerEvents: "none" }} />
);

// tap ripple (simulated cursor, remocn) at (x,y)
export const Ripple = ({ t, t0, x, y, color = "rgba(29,29,31,.35)" }) => {
  if (t < t0 || t > t0 + 0.6) return null; const p = (t - t0) / 0.6;
  return <div style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, background: color, transform: `scale(${0.3 + 1.6 * EASE.out(p)})`, opacity: 0.9 * (1 - p), zIndex: 80, pointerEvents: "none" }} />;
};

// a check mark that draws on
export const Tick = ({ p, size = 44, color = "#34C759", stroke = 7 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{ flex: "none" }}>
    <circle cx="22" cy="22" r="20" fill={color} opacity={clamp(p * 3)} transform={`scale(${0.6 + 0.4 * clamp(p * 2)})`} style={{ transformOrigin: "22px 22px" }} />
    <path d="M12 23 L19 30 L32 15" fill="none" stroke="#fff" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="34" strokeDashoffset={34 * (1 - clamp((p - 0.25) / 0.75))} />
  </svg>
);
