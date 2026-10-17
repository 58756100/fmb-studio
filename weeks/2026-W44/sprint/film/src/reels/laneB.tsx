// @ts-nocheck
// House look (lanes B and C): white / #F5F5F7 canvas, Inter, one red accent, iOS 26-style cards, bank cutouts with
// soft contact shadows. Sizes are native 1080-wide px, readable on a phone (UI text >= 40 px).
import React from "react";
import { W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, Typed, src, rgba } from "../kit";

export const BG = "#F5F5F7";
export const TEXT = { font: "Inter", weight: 600, size: 112, min: 76, ls: "-0.038em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 920, top: 292, lead: 1.04 };
export const inter = (size, color = INK, weight = 600, extra = {}) => ({ fontFamily: "Inter", fontSize: size, fontWeight: weight, letterSpacing: size >= 60 ? "-0.03em" : "-0.015em",
  fontVariationSettings: `'opsz' ${size >= 60 ? 32 : 28}`, lineHeight: 1.15, color, whiteSpace: "nowrap", ...extra });
export const CARD = { background: "#fff", borderRadius: 44, boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.04), 0 30px 40px -26px rgba(0,0,0,.28)" };

// the studio backdrop: soft radial white with a faint floor
export const Studio = ({ children, t = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 50% 46%, #FFFFFF 42%, #F2F2F5 100%)" }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 420, left: ((t * 90) % 1900) - 600, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))", opacity: 0.6 }} />
    {children}
  </div>
);
// a person / car avatar (bank cutout cropped to the face or the car's front)
export const Avatar = ({ id, size, bg = "#E9E6E1", face = { x: 0.5, y: 0.2, z: 2.0 }, ring }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", background: bg, flex: "none", boxShadow: ring ? `0 0 0 5px ${ring}` : undefined }}>
    <img src={src(id)} style={{ position: "absolute", width: size * face.z, left: size / 2 - size * face.z * face.x, top: size * 0.5 - size * face.z * face.y * 0.95 }} />
  </div>
);
export const LetterAv = ({ ch, size, bg = "#8E8E93" }) => <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "grid", placeItems: "center", ...inter(size * 0.44, "#fff"), flex: "none" }}>{ch}</div>;
// photo in a rounded card, Ken Burns
export const Pic = ({ id, x, y, w, h, t, r = 36, k0 = 1.02, k1 = 1.08, t0 = 0, t1 = 8, fx = 0.5, fy = 0.5, o = 1, s = 1, z, children, style = {} }) => {
  if (o <= 0.002) return null;
  const k = lerp(k0, k1, EASE.io(seg(t, t0, t1)));
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", opacity: o, zIndex: z, transform: `scale(${s})`,
    boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 30px 40px -26px rgba(0,0,0,.3)", ...style }}>
    <img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${k})` }} />
    {children}
  </div>;
};
// enter helper: spring rise + fade
export const rise = (t, t0, dist = 40) => { const p = spr(t - t0, 200, 19); return { opacity: clamp(p * 2), transform: `translateY(${(1 - p) * dist}px) scale(${0.96 + 0.04 * p})` }; };
// a callout pill with a leader line that draws on (from pill to point)
export const Callout = ({ t, t0, x, y, px, py, text, out = 99, red = false }) => {
  if (t < t0) return null;
  const p = ez(t, t0, 0.35), q = EASE.in(seg(t, out, out + 0.25)), pin = spr(t - t0 - 0.2, 220, 16);
  const ex = lerp(x, px, p), ey = lerp(y, py, p);
  return <>
    <svg width={W} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - q, zIndex: 30 }}>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={red ? RED : "#fff"} strokeWidth={6} strokeLinecap="round" />
      <circle cx={px} cy={py} r={14 * clamp(pin)} fill={red ? RED : "#fff"} stroke={red ? "#fff" : RED} strokeWidth={5} />
    </svg>
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * spr(t - t0, 220, 17)})`, opacity: clamp((t - t0) / 0.12) * (1 - q), zIndex: 31,
      background: red ? RED : "#fff", borderRadius: 40, padding: "14px 30px", boxShadow: "0 10px 30px rgba(0,0,0,.25)", ...inter(48, red ? "#fff" : INK) }}>{text}</div>
  </>;
};
// iOS link chip / URL pill (no demo label)
export const UrlPill = ({ t, t0, url, press = 0, w }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 16, height: 88, padding: "0 32px", borderRadius: 44, background: press ? `rgba(244,48,52,${0.08 + 0.06 * press})` : "#fff", width: w,
    boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 12px 24px -14px rgba(0,0,0,.2)", transform: `scale(${1 - 0.04 * press})` }}>
    <svg width={40} height={40} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke={RED} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
    <Typed t={t} t0={t0} t1={t0 + url.length / 26} text={url} style={inter(44, INK, 500)} />
  </div>
);
// FuelMyBuild build page as a full-width card (not a phone): hero, title, owner, URL, then a section (children)
export const PageCard = ({ t, x = 60, y, w = 960, h, hero, heroH = 420, title, owner, ownerAv, url, urlAt = -9, brandAt = -9, o = 1, s = 1, origin = "50% 0%", children, fx = 0.5, fy = 0.6, z = 4 }) => {
  if (o <= 0.002) return null;
  const d = drift(t, "pg", 2.5, 0.25);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s}) ${dT(d, 0.5)}`, transformOrigin: origin, zIndex: z, ...CARD, overflow: "hidden" }}>
    <div style={{ position: "relative", height: heroH, overflow: "hidden" }}>
      <img src={src(hero)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `scale(${1.03 + 0.03 * Math.sin(t * 0.4)})` }} />
      <div style={{ position: "absolute", left: 24, top: 22, padding: "10px 22px", borderRadius: 30, background: "rgba(255,255,255,.78)", backdropFilter: "blur(12px)", ...inter(40, INK),
        opacity: seg(t, brandAt, brandAt + 0.25), transform: `translateY(${(1 - ez(t, brandAt, 0.4)) * -16}px)` }}>Fuel<span style={{ color: RED }}>My</span>Build</div>
    </div>
    <div style={{ padding: "28px 40px 0" }}>
      <div style={inter(68, INK)}>{title}</div>
      {owner && <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>{ownerAv}<span style={inter(42, GREY, 500)}>{owner}</span></div>}
      {url && <div style={{ marginTop: 20, opacity: seg(t, urlAt - 0.1, urlAt + 0.1) }}><UrlPill t={t} t0={urlAt} url={url} /></div>}
      {children}
    </div>
  </div>;
};
