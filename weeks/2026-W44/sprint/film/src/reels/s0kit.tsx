// @ts-nocheck
// Shared pieces for the lane-0 sprint bodies (S0-*). Each body keeps its own look; this holds only neutral helpers:
// full-bleed photo backdrops with Ken Burns, dark scrims for text over photos, a frameless glass record card, and
// hex hardware drawn in SVG (bolts, washers) for bodies whose story is about one small part.
import React from "react";
import { W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, src } from "../kit";

// full-bleed photo with a slow push (k0 -> k1 over t0..t1) about (fx, fy)
export const Full = ({ id, t, t0 = 0, t1 = 8, k0 = 1.04, k1 = 1.12, fx = 0.5, fy = 0.5, dim = 0, blur = 0, o = 1, sat = 1, style = {} }) => {
  if (o <= 0.002) return null;
  const k = lerp(k0, k1, EASE.io(seg(t, t0, t1)));
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: o, background: "#000", ...style }}>
    <img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`,
      transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${k})`, filter: `brightness(${1 - dim}) saturate(${sat})${blur > 0.3 ? ` blur(${blur}px)` : ""}` }} />
  </div>;
};
// top scrim so white headlines read over photos (the headline band is y 250-560)
export const Scrim = ({ o = 1, h = 760, a = 0.72 }) => <div style={{ position: "absolute", left: 0, top: 0, width: W, height: h, opacity: o, zIndex: 3,
  background: `linear-gradient(180deg, rgba(0,0,0,${a}) 0%, rgba(0,0,0,${a * 0.75}) 45%, rgba(0,0,0,0) 100%)` }} />;
export const Vignette = ({ a = 0.55 }) => <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `radial-gradient(120% 80% at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,${a}) 100%)` }} />;

// frameless frosted glass card (dark scenes)
export const glass = (a = 0.14) => ({ background: `rgba(255,255,255,${a})`, backdropFilter: "blur(26px) saturate(1.3)", borderRadius: 44,
  boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.22), 0 40px 70px -30px rgba(0,0,0,.7)" });

// text style helper for any family (UI text >= 40 px)
export const font = (fam, size, color = INK, weight = 600, extra = {}) => ({ fontFamily: fam, fontSize: Math.max(40, size), fontWeight: weight, color, whiteSpace: "nowrap", lineHeight: 1.12,
  letterSpacing: fam === "Inter" ? (size >= 60 ? "-0.03em" : "-0.012em") : fam === "Barlow Condensed" ? "0.01em" : "0", fontVariationSettings: fam === "Inter" ? `'opsz' ${size >= 60 ? 32 : 28}` : undefined, ...extra });

// ---------------------------------------------------------------- hardware (SVG)
export const MetalDefs = () => <svg width="0" height="0" style={{ position: "absolute" }}><defs>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F5F7" /><stop offset="0.45" stopColor="#A9AEB6" /><stop offset="0.7" stopColor="#D9DCE1" /><stop offset="1" stopColor="#6E737B" /></linearGradient>
  <linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF0F3" /><stop offset="0.35" stopColor="#B7BBC2" /><stop offset="0.6" stopColor="#7E838B" /><stop offset="1" stopColor="#C9CCD2" /></linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6E3A6" /><stop offset="0.5" stopColor="#C49A3E" /><stop offset="1" stopColor="#7A5A1C" /></linearGradient>
  <radialGradient id="steelR" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#B4B8BF" /><stop offset="1" stopColor="#5D6168" /></radialGradient>
</defs></svg>;
const hexPts = (r) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`; }).join(" ");
// a hex bolt head seen from above, centred on (0,0) inside an <svg> <g>
export const HexHead = ({ r, rot = 0, shine = 0 }) => <g transform={`rotate(${rot})`}>
  <polygon points={hexPts(r)} fill="url(#steel)" stroke="#4A4E55" strokeWidth={Math.max(1, r * 0.07)} />
  <circle r={r * 0.62} fill="url(#steelR)" stroke="rgba(0,0,0,.25)" strokeWidth={Math.max(1, r * 0.04)} />
  {shine > 0 && <circle r={r * 0.62} fill="#fff" opacity={shine * 0.6} />}
</g>;
// a washer seen from above
export const Washer = ({ r, rot = 0, tint = "url(#steel)" }) => <g transform={`rotate(${rot})`}>
  <circle r={r * 0.72} fill="none" stroke={tint} strokeWidth={r * 0.56} />
  <circle r={r} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={Math.max(1, r * 0.04)} />
  <circle r={r * 0.44} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={Math.max(1, r * 0.04)} />
</g>;
// a bolt in side view, head on the left, length L (px), shank height h; thread phase spins the threads
export const SideBolt = ({ L = 600, h = 90, phase = 0 }) => {
  const head = h * 1.25, hw = h * 0.7, sh = L - hw, th = Math.max(8, h * 0.16);
  const n = Math.floor((sh * 0.7) / th);
  return <g>
    <rect x={0} y={-head / 2} width={hw} height={head} rx={h * 0.08} fill="url(#steelV)" stroke="#3E4249" strokeWidth={2} />
    <rect x={hw * 0.33} y={-head / 2} width={hw * 0.34} height={head} fill="rgba(255,255,255,.25)" />
    <rect x={hw - 2} y={-h * 0.62} width={h * 0.12} height={h * 1.24} fill="url(#steelV)" stroke="#3E4249" strokeWidth={1.5} />
    <rect x={hw} y={-h / 2} width={sh} height={h} rx={h * 0.12} fill="url(#steelV)" stroke="#3E4249" strokeWidth={2} />
    {Array.from({ length: n }, (_, i) => { const x = hw + sh * 0.3 + ((i + (phase % 1)) * th); return x < L - th * 0.6 ? <line key={i} x1={x} y1={-h / 2 + 2} x2={x + th * 0.55} y2={h / 2 - 2} stroke="rgba(40,44,50,.55)" strokeWidth={Math.max(1.5, th * 0.28)} /> : null; })}
  </g>;
};
// light top haze so dark headlines read over photos (the headline band is y 250-560)
export const Haze = ({ h = 760, a = 0.88, c = "245,245,247" }) => <div style={{ position: "absolute", left: 0, top: 0, width: W, height: h, zIndex: 3,
  background: `linear-gradient(180deg, rgba(${c},${a}) 0%, rgba(${c},${a * 0.82}) 50%, rgba(${c},0) 100%)` }} />;
