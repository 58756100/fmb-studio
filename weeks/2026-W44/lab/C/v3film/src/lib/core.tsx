// @ts-nocheck
// Lane C v3 core: infrastructure only (math, time, cutouts, review guides). Every visual is a pure function
// of absolute time t in seconds. No Math.random, no timers. Looks live in the reels and in ./remocn.tsx.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../../../../../../../kit/remotion/public/sbkit/ui.css"; // Inter opsz font-face + .glass

export const RED = "#F43034", INK = "#1D1D1F", GREY = "#86868B", SOFT = "#F5F5F7", LINE = "#E5E5EA";
export const W = 1080, H = 1920;
export const CAP_TOP = 1418; // subtitle band 1418-1556; the bottom 360 px (1560+) stays clear of anything important

// ---------- math ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const eo = p => 1 - Math.pow(1 - clamp(p), 3);
export const eio = p => { p = clamp(p); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
export const ei = p => Math.pow(clamp(p), 3);
export const expo = p => { p = clamp(p); return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); };
// damped spring; x in seconds since start; light overshoot by default
export const spring = (x, k = 170, d = 19) => { if (x <= 0) return 0; const w0 = Math.sqrt(k), z = d / (2 * w0); if (z >= 1) return 1 - Math.exp(-w0 * x) * (1 + w0 * x); const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x)); };
export const sp = (t, t0, k, d) => spring(t - t0, k, d);
// deterministic hash in [0,1)
export const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; };
export const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
export const src = p => staticFile(p);

// ---------- cutout with a soft contact shadow (box top-left at x,y; height follows the image) ----------
export const Cut = ({ img, x = 0, y = 0, w = 600, rot = 0, op = 1, s = 1, shadow = true, z = 2, flip = false, origin = "50% 100%", style = {}, sh = 0.26 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: op, transformOrigin: origin, transform: `rotate(${rot}deg) scale(${s})${flip ? " scaleX(-1)" : ""}`, ...style }}>
    {shadow ? <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "-2%", height: "9%", borderRadius: "50%", background: `radial-gradient(closest-side,rgba(0,0,0,${sh}),rgba(0,0,0,0))`, filter: "blur(6px)" }} /> : null}
    <Img src={src(img)} style={{ position: "relative", width: "100%", display: "block" }} />
  </div>
);

export const Canvas = ({ children, bg = "#FFFFFF" }) => <AbsoluteFill style={{ background: bg, fontFamily: "Inter, sans-serif", color: INK, overflow: "hidden" }}>{children}</AbsoluteFill>;

// ---------- review overlay (check=true): subtitle band + platform-covered bottom 360 px ----------
export const Guides = () => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: 140, background: "rgba(10,132,255,.08)", zIndex: 999, borderTop: "2px solid rgba(10,132,255,.55)", borderBottom: "2px solid rgba(10,132,255,.55)" }} />
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "rgba(255,149,0,.10)", zIndex: 999, borderTop: "2px solid rgba(255,149,0,.7)" }} />
</>;

// ---------- CTA band (house: headline band upper middle, URL in red, "Illustrative story" in grey) ----------
export const CTA = ({ t, a, out, head, top = 262 }) => {
  const pin = eo(seg(t, a, a + 0.35)), pout = 1 - eo(seg(t, out, out + 0.25));
  const op = Math.min(pin, pout); if (op <= 0) return null;
  const w = (i) => { const p = eo(seg(t, a + i * 0.1, a + i * 0.1 + 0.4)); return { opacity: p * pout, transform: `translateY(${(1 - p) * 26 - (1 - pout) * 14}px)` }; };
  return <div style={{ position: "absolute", left: 60, right: 60, top, zIndex: 80, textAlign: "center" }}>
    <div style={{ fontSize: 108, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.02, fontVariationSettings: '"opsz" 32', ...w(0) }}>{head}</div>
    <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-.025em", color: RED, marginTop: 14, ...w(1) }}>fuelmybuild.com</div>
    <div style={{ fontSize: 34, fontWeight: 500, color: GREY, marginTop: 10, ...w(2) }}>Illustrative story</div>
  </div>;
};
