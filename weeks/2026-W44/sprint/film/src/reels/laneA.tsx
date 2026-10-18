// @ts-nocheck
// Lane A+ look (ChatGPT's palette and mood, production execution): dark ground, paper records, one warm accent.
// Barlow Condensed for headlines, Source Sans 3 for UI, IBM Plex Mono for labels and dates.
import React from "react";
import { W, seg, lerp, clamp, spr, EASE, drift, dT, Typed, src, rgba } from "../kit";

export const HL = "'Barlow Condensed'", UI = "'Source Sans 3'", MONO = "'IBM Plex Mono'";
export const textStyle = (pal) => ({ font: HL, weight: 700, size: 112, min: 66, ls: "0.004em", upper: true, color: pal.tx, accent: pal.em, line2: null,
  align: "left", x0: 96, maxW: 888, top: 240, lead: 0.98 }); // top 240: clears the 400 px photo frames by >= 15 px
export const mono = (size, color, extra = {}) => ({ fontFamily: MONO, fontWeight: 500, fontSize: Math.max(42, size), lineHeight: 1.15, whiteSpace: "nowrap", color, ...extra });
export const ui = (size, color, extra = {}) => ({ fontFamily: UI, fontWeight: 600, fontSize: Math.max(42, size), lineHeight: 1.12, whiteSpace: "nowrap", color, ...extra });

// the photo frame of the lane: a showroom photo in a thin rule with a soft vignette (no plain stock look)
export const Frame = ({ pal, x, y, w, h, id, t, k = 1, fx = 0.5, fy = 0.5, kb = 0.03, o = 1, r = 18, children, z }) => {
  if (o <= 0.002) return null;
  const kk = k * (1 + kb * (0.5 + 0.5 * Math.sin(t * 0.45)));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", opacity: o, zIndex: z,
      boxShadow: `0 0 0 2px ${rgba(pal.tx, 0.16)}, 0 40px 70px -30px rgba(0,0,0,.7)` }}>
      <img src={src(typeof id === "string" ? id : id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${kk})` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.28) 100%)" }} />
      {/* showroom light sweep: keeps a held photo alive */}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 300, left: ((t * 170) % (w + 1100)) - 550, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.16), rgba(255,255,255,0))" }} />
      {children}
    </div>
  );
};

// paper record card. rows: [{ label, value, at (s, value lands), labelAt (s, label seated), mono, thumb }]
export const Paper = ({ pal, t, x, y, w, rows, title, tag, o = 1, s = 1, origin = "50% 0%", z = 5, rowH = 112, pad = 40, drawAt = 0, seed = "paper", compact = 0 }) => {
  if (o <= 0.002) return null;
  const d = drift(t, seed, 3, 0.3);
  const h = pad * 2 + (title ? 72 : 0) + rows.length * rowH;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z, transformOrigin: origin, transform: `scale(${s}) ${dT(d, 0.6)}`,
      background: pal.paper, borderRadius: 14, boxShadow: "0 30px 60px -24px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.05)", overflow: "hidden" }}>
      {/* paper tooth: faint horizontal fibres + a light sweep so a held record never reads as a still */}
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, rgba(0,0,0,.018) 0 2px, rgba(0,0,0,0) 2px 7px)` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: ((t * 140) % (w + 900)) - 450, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.28), rgba(255,255,255,0))" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: pal.em }} />
      {title && <div style={{ position: "absolute", left: pad + 12, right: pad, top: pad - 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={mono(40, pal.ink2)}>{title}</span>{tag}
      </div>}
      {rows.map((r, i) => {
        const yy = pad + (title ? 72 : 0) + i * rowH;
        const ruleP = EASE.out(seg(t, drawAt + i * 0.08, drawAt + 0.5 + i * 0.08));
        const lab = r.labelAt == null ? 1 : seg(t, r.labelAt, r.labelAt + 0.12);
        const vp = r.at == null ? 0 : spr(t - r.at, 200, 19);
        return <div key={i} style={{ position: "absolute", left: pad + 12, right: pad, top: yy, height: rowH }}>
          <div style={{ position: "absolute", left: 0, bottom: 14, height: 3, width: `${ruleP * 100}%`, background: rgba(pal.ink, 0.16) }} />
          <div style={{ ...mono(40, pal.ink2), position: "absolute", left: 0, top: 6, opacity: lab }}>{r.label}</div>
          {r.at != null && t >= r.at && !r.thumb && <div style={{ position: "absolute", right: 0, top: 4, textAlign: "right", opacity: clamp(vp * 1.5), transform: `translateY(${(1 - vp) * 26}px)` }}>
            {r.typed ? <Typed t={t} t0={r.at} t1={r.at + r.value.length / 24} text={r.value} caret={pal.em} style={r.mono ? mono(58, pal.ink) : ui(62, pal.ink)} keepCaret={0.3} />
              : <span style={r.mono ? mono(58, pal.ink) : ui(62, pal.ink)}>{r.value}</span>}
          </div>}
          {r.thumb && t >= r.at && <div style={{ position: "absolute", right: 0, top: -6, width: 150, height: rowH - 16, borderRadius: 10, overflow: "hidden", border: `4px solid ${pal.em}`,
            transform: `scale(${0.6 + 0.4 * vp})`, transformOrigin: "100% 50%", opacity: clamp(vp * 2) }}>
            <img src={src(r.thumb)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {t - r.at < 0.16 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.9 * (1 - (t - r.at) / 0.16) }} />}
          </div>}
          {(r.at == null || t < r.at) && <div style={{ position: "absolute", right: 0, top: 30, width: 200, height: 10, borderRadius: 5, background: rgba(pal.ink, 0.08) }} />}
        </div>;
      })}
    </div>
  );
};

// a mono requester tag with a leader arrow pointing left at the card
export const Requester = ({ pal, t, t0, x, y, text, out = 99 }) => {
  if (t < t0) return null;
  const p = spr(t - t0, 200, 18), q = EASE.in(seg(t, out, out + 0.3));
  return <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 10, opacity: clamp(p * 2) * (1 - q), transform: `translateX(${(1 - p) * 60 + q * 80}px)`, zIndex: 20 }}>
    <svg width={64} height={30}><path d={`M 62 15 L ${62 - 56 * clamp(p)} 15`} stroke={pal.em} strokeWidth={5} /><path d="M 18 3 L 4 15 L 18 27" stroke={pal.em} strokeWidth={5} fill="none" opacity={p > 0.9 ? 1 : 0} /></svg>
    <span style={{ ...mono(46, pal.em), padding: "4px 14px", border: `3px solid ${pal.em}`, borderRadius: 6 }}>{text}</span>
  </div>;
};

// the build page, in the lane palette: wordmark, hero photo, title, URL pill, a log or parts section (children)
export const BuildPage = ({ pal, t, x = 96, y = 380, w = 888, photo, title, sub, url, urlAt = 99, urlBig = 0, brandAt = 0, children, o = 1, s = 1, origin = "50% 30%", photoH = 380, z = 4, h }) => {
  if (o <= 0.002) return null;
  const d = drift(t, "page", 2.5, 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s}) ${dT(d, 0.5)}`, transformOrigin: origin, zIndex: z,
      background: pal.panel, borderRadius: 30, boxShadow: `0 0 0 2px ${rgba(pal.tx, 0.12)}, 0 50px 80px -30px rgba(0,0,0,.8)`, overflow: "hidden", paddingBottom: 30 }}>
      <div style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px" }}>
        <span style={{ ...ui(46, pal.tx), opacity: seg(t, brandAt, brandAt + 0.2), transform: `translateY(${(1 - EASE.out(seg(t, brandAt, brandAt + 0.35))) * 20}px)`, display: "inline-block" }}>Fuel<span style={{ color: pal.em }}>My</span>Build</span>
        <span style={mono(40, rgba(pal.tx, 0.6))}>Build page</span>
      </div>
      <div style={{ position: "relative", height: photoH, overflow: "hidden" }}>
        <img src={src(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.03 * Math.sin(t * 0.4)})` }} />
      </div>
      <div style={{ padding: "26px 34px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}><span style={ui(64, pal.tx)}>{title}</span>{sub && <span style={ui(44, rgba(pal.tx, 0.62))}>{sub}</span>}</div>
        
        {url && <div style={{ opacity: seg(t, urlAt - 0.1, urlAt + 0.1), marginTop: 22, display: "inline-flex", alignItems: "center", gap: 16, height: 84 + 26 * urlBig, padding: "0 28px", borderRadius: 42,
          background: rgba(pal.em, 0.12 + 0.1 * urlBig), border: `3px solid ${pal.em}`, transform: `scale(${1 + 0.08 * urlBig})`, transformOrigin: "0 50%" }}>
          <svg width={40} height={40} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke={pal.em} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
          <Typed t={t} t0={urlAt} t1={urlAt + url.length / 28} text={url} caret={pal.em} style={mono(44, pal.tx)} keepCaret={0.8} />
        </div>}
        {children}
      </div>
    </div>
  );
};
