// @ts-nocheck
// Lane A+ motion kit: every element is a pure function of absolute time t (seconds, 30 fps).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender, staticFile, getInputProps } from "remotion";
import { FPS, maskRevealIn, maskRevealOut, Subtitles } from "./remocn";
import { MBDefs, mb, idleT, kenBurns, Sweep, Words, SubtitleWords } from "./alive";
export { FPS };

export const HL = "'Barlow Condensed'", UI = "'Source Sans 3'", MONO = "'IBM Plex Mono'";
export const SAFE = { x0: 96, x1: 880, y0: 240, y1: 1430, w: 784 };

// ---------- easing + tracks
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const E = {
  lin: (p) => p,
  out: (p) => 1 - Math.pow(1 - p, 3),
  snap: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  in: (p) => p * p * p,
  back: (p) => { const c1 = 1.35, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};
const lerp = (a, b, p) => a + (b - a) * p;
// track(t, init, [[t0, {changes}, dur?, ease?], ...]) -> state. Changes tween from the settled previous state.
function _track(t, init, kfs, dur, ease, cutUntil = -1) {
  let cur = { ...init };
  for (const [t0, val, d = dur, ez = ease] of kfs) {
    if (t < t0 && !(d <= 0 && t0 <= cutUntil)) break;
    const next = { ...cur, ...val };
    const p = d <= 0 ? 1 : clamp((t - t0) / d);
    if (p < 1) {
      const e = ez(p), out = {};
      for (const k of Object.keys(next)) out[k] = typeof next[k] === "number" && typeof cur[k] === "number" ? lerp(cur[k], next[k], e) : next[k];
      return out;
    }
    cur = next;
  }
  return cur;
}
// track(): the state at t plus its velocity (vx, vy in px/frame, from x+dx / y+dy). Hard cuts (0-length keyframes)
// are applied to the previous frame too, so a cut never reads as speed (no blur on cuts).
export function track(t, init, kfs, dur = 0.45, ease = E.out) {
  const a = _track(t, init, kfs, dur, ease), b = _track(t - 1 / 30, init, kfs, dur, ease, t);
  const X = (q) => (q.x ?? 0) + (q.dx ?? 0), Y = (q) => (q.y ?? 0) + (q.dy ?? 0);
  a.vx = X(a) - X(b); a.vy = Y(a) - Y(b);
  return a;
}
// 0..1 progress of an entrance at t0 (for pops, line draws, fades)
export const prog = (t, t0, d = 0.35, ez = E.out) => (t0 == null ? 1 : ez(clamp((t - t0) / d)));
export const pick = (t, cues, def = null) => { let v = def; for (const [t0, x] of cues) if (t >= t0) v = x; return v; };

// ---------- text measurement (fonts are loaded before the first frame)
let _cv;
export function textW(text, family, size, ls = 0) {
  _cv = _cv || document.createElement("canvas");
  const c = _cv.getContext("2d");
  c.font = `${family === HL ? 700 : family === UI ? 600 : 500} ${size}px ${family}`;
  let w = 0;
  for (const part of String(text).split("→")) w += c.measureText(part).width + part.length * ls * size;
  return w + (String(text).split("→").length - 1) * size * 1.02;
}
export function fit(lines, family, start, min, maxW = SAFE.w, ls = 0) {
  let s = start;
  while (s > min && Math.max(...lines.map((l) => textW(l, family, s, ls))) > maxW) s -= 1;
  return s;
}

// ---------- primitives
// live: idle amplitudes {x, y, r, s, seed} for holds; sweep: a light band crossing the box ({alpha, period, seed, color})
export const Box = ({ s, style = {}, children, v, z, live, sweep, t }) => {
  if (!s || (s.o !== undefined && s.o <= 0.001)) return null;
  const tt = t ?? (typeof window !== "undefined" ? window.__T : 0) ?? 0;
  return (
    <div data-v={v ? "1" : undefined} style={{
      position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, opacity: s.o ?? 1, zIndex: z,
      transform: `translate(${s.dx || 0}px, ${s.dy || 0}px) scale(${s.s ?? 1})${live ? " " + idleT(tt, live.seed || 0, live) : ""}`, transformOrigin: s.origin || "50% 50%", boxSizing: "border-box",
      filter: mb(s.vx, s.vy), ...style,
    }}>{children}{sweep && <Sweep t={tt} {...sweep} />}</div>
  );
};
export const Img = ({ name, style = {} }) => <img src={staticFile(`img/${name}.png`)} style={{ display: "block", ...style }} />;

// a cut-out inside a rectangular frame so it reads as a photo. s: x y w h o s, cw (cut-out width), cy (centre y in frame), zoom
// alive: Ken Burns (zoom breathes, subject pans) inside the fixed frame, plus a faint light sweep
export const Photo = ({ s, name, aspect, pal, label, children, shadow = true, z, seed = 0, kb = 1, sweep = 0.07, live = null }) => {
  if (!s || s.o <= 0.001) return null;
  const tt = window.__T || 0, K = kenBurns(tt, seed, 0.06 * kb, 22 * kb);
  const cw = (s.cw || s.w * 0.92) * (s.zoom || 1) * K.z, ch = cw / aspect;
  const cx = (s.cx ?? s.w / 2) + K.dx, cy = (s.cy ?? s.h / 2) + K.dy;
  return (
    <Box s={s} v z={z} live={live} sweep={sweep ? { alpha: sweep, seed, period: 2.8 } : null} style={{ background: pal.pn, overflow: "hidden", boxShadow: `inset 0 0 0 2px ${pal.tx}38` }}>
      {shadow && <div style={{ position: "absolute", left: cx - cw * 0.46, top: cy + ch * 0.36, width: cw * 0.92, height: ch * 0.2, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />}
      <Img name={name} style={{ position: "absolute", left: cx - cw / 2, top: cy - ch / 2, width: cw, height: ch }} />
      {label}
      {children}
    </Box>
  );
};
// a free cut-out (no frame) centred in its box, contained
export const Cut = ({ s, name, aspect, z, style, seed = 0, sway = 1 }) => {
  if (!s || s.o <= 0.001) return null;
  let w = s.w, h = w / aspect; if (h > s.h) { h = s.h; w = h * aspect; }
  return (
    <Box s={s} v z={z} style={style} live={sway ? { seed, x: 6 * sway, y: 10 * sway, r: 2.0 * sway, s: 0.03 * sway } : null}>
      <Img name={name} style={{ position: "absolute", left: (s.w - w) / 2, top: (s.h - h) / 2, width: w, height: h }} />
    </Box>
  );
};
export const ARROW = ({ size, color }) => (
  <svg width={size * 0.96} height={size * 0.66} viewBox="0 0 92 64" style={{ display: "inline-block", verticalAlign: "-0.04em", margin: `0 ${size * 0.03}px` }}>
    <path d="M4 32 H76 M52 8 L80 32 L52 56" fill="none" stroke={color} strokeWidth="13" strokeLinecap="butt" strokeLinejoin="miter" />
  </svg>
);
const withArrows = (line, size, color) => {
  const parts = line.split("→");
  return parts.flatMap((p, i) => (i ? [<ARROW key={i} size={size} color={color} />, p] : [p]));
};

// Headline: cues [[t0, "LINE 1\nLINE 2", {color}]]. Changed lines leave word by word (staggered rise + fade, motion blur)
// and the new words spring up 4 frames apart with a little overshoot; emphasis words (emph) get a kinetic scale pop.
// Unchanged lines hold, with a slow vertical float so a held headline never reads as a still.
const norm = (w) => w.replace(/[^A-Z0-9+→]/gi, "").toUpperCase();
export const Headline = ({ t, cues, pal, top = 254, size = 96, min = 80, lh = 0.98, color, emph = [] }) => {
  let idx = -1; cues.forEach(([t0], i) => { if (t >= t0) idx = i; });
  if (idx < 0) return null;
  const cur = cues[idx], prev = idx > 0 ? cues[idx - 1] : null;
  const L = cur[1].split("\n"), P = prev ? prev[1].split("\n") : [];
  const fsC = fit(L, HL, cur[2]?.size || size, min, SAFE.w - 4, 0.005);
  const fsP = prev ? fit(P, HL, prev[2]?.size || size, min, SAFE.w - 4, 0.005) : fsC;
  const col = (c) => c[2]?.color || color || pal.tx;
  const same = (i) => P[i] === L[i] && fsP === fsC && col(prev) === col(cur);
  const lineStyle = { display: "block", whiteSpace: "nowrap", height: Math.round(fsC * lh) };
  const E2 = new Set(emph.map(norm));
  const pops = (w) => E2.has(norm(w));
  const arrow = (fs, c) => (w) => (w === "→" ? <ARROW size={fs} color={c} /> : w);
  const out = [];
  if (prev) P.forEach((line, i) => {
    if (same(i)) return;
    if ((t - cur[0]) * FPS > 6 + 0.6 * line.split(" ").length + 2) return;
    out.push(<div key={"p" + i} style={{ position: "absolute", left: 0, top: i * Math.round(fsP * lh), fontSize: fsP, color: col(prev), whiteSpace: "nowrap" }}>
      <Words t={t} t0={null} out={cur[0] + i * 0.02} text={line} render={arrow(fsP, col(prev))} outStagger={0.6} /></div>);
  });
  let off = 0;
  L.forEach((line, i) => {
    const landed = same(i);
    const t0 = landed ? null : cur[0] <= 0 ? -0.3 : cur[0] + 0.15; // the hook's first words are already landing on frame 0
    out.push(<div key={"c" + i} style={{ position: "absolute", left: 0, top: i * Math.round(fsC * lh), fontSize: fsC, color: col(cur), ...lineStyle }}>
      <Words t={t} t0={t0} text={line} pops={cur[0] > 0 ? pops : null} offset={off} render={arrow(fsC, col(cur))} /></div>);
    if (!landed) off += line.split(" ").length;
  });
  // idle: a slow vertical float (never sideways, so the left edge stays on x 96)
  const fy = 6 + 2.5 * Math.sin((2 * Math.PI * t) / 3.1) + 1.5 * Math.sin((2 * Math.PI * t) / 1.9 + 1); // 2..10 px: spring/pop overshoot never lifts a word above the safe line
  return <div data-hl="1" style={{ position: "absolute", left: SAFE.x0, top, width: SAFE.w, fontFamily: HL, fontWeight: 700, lineHeight: lh, letterSpacing: "0.005em", transform: `translateY(${fy.toFixed(2)}px)` }}>{out}</div>;
};

export const Tag = ({ pal, children = "DEMO BUILD", size = 44, solid, onPaper }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", fontFamily: MONO, fontWeight: 500, fontSize: size, lineHeight: 1.15, padding: "2px 14px",
    border: `3px solid ${onPaper ? pal.bg : pal.em}`, color: solid ? pal.bg : onPaper ? pal.bg : pal.em, background: solid ? pal.em : "transparent" }}>{children}</span>
);
export const mono = (size = 44, extra = {}) => ({ fontFamily: MONO, fontWeight: 500, fontSize: size, lineHeight: 1.15, whiteSpace: "nowrap", ...extra });
export const ui = (size = 56, extra = {}) => ({ fontFamily: UI, fontWeight: 600, fontSize: size, lineHeight: 1.12, whiteSpace: "nowrap", ...extra });

// ---------- film wrapper: loads fonts + images, paints the canvas, burns subtitles, optional checker
const FONTS = [["Barlow Condensed", "barlow-condensed-latin-700-normal.woff2", 700], ["Source Sans 3", "source-sans-3-latin-600-normal.woff2", 600], ["IBM Plex Mono", "ibm-plex-mono-latin-500-normal.woff2", 500]];
const IMGS = ["car-05", "car-09", "car-01", "part-06", "part-01"];
export const useT = () => useCurrentFrame() / FPS;

export const Film = ({ pal, subs, children }) => {
  const t = useT();
  const [h] = useState(() => delayRender("assets"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts = FONTS.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile("fonts/" + file)}) format("woff2")`, { weight: String(w) }).load().then((f) => document.fonts.add(f)));
    const imgs = IMGS.map((n) => new Promise((res) => { const i = new Image(); i.onload = () => i.decode().then(res, res); i.onerror = res; i.src = staticFile(`img/${n}.png`); }));
    Promise.all([...fonts, ...imgs]).then(() => { setReady(true); continueRender(h); });
  }, []);
  if (!ready) return <AbsoluteFill style={{ background: pal.bg }} />;
  window.__T = t;
  return (
    <AbsoluteFill style={{ background: pal.bg, color: pal.tx, overflow: "hidden" }}>
      <MBDefs />
      {children(t)}
      <SubtitleWords t={t} subs={subs} color={pal.tx} font={UI} />
      {getInputProps().check ? <Checker t={t} /> : null}
    </AbsoluteFill>
  );
};

// Review overlay (stills only): red = text under 44 px, text outside the essential box, or text overlapping text;
// magenta = a visual inside the subtitle band (y > 1215). Lists the issues in a banner at the bottom.
const Checker = ({ t }) => {
  const [issues, setIssues] = useState(null);
  const [hd] = useState(() => delayRender("check"));
  useEffect(() => {
    requestAnimationFrame(() => {
      const res = [], boxes = [];
      const root = document.querySelector("#film-root") || document.body;
      const op = (el) => { let o = 1; while (el) { o *= +getComputedStyle(el).opacity; el = el.parentElement; } return o; };
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (el.closest("[data-check]")) continue;
        if (op(el) < 0.5 || getComputedStyle(el).visibility === "hidden") continue;
        const sc = el.getBoundingClientRect().width / (el.offsetWidth || 1);
        const px = parseFloat(getComputedStyle(el).fontSize) * (isFinite(sc) && sc > 0 ? sc : 1);
        const r = document.createRange(); r.selectNodeContents(n);
        for (const b of r.getClientRects()) {
          if (b.width < 2) continue;
          const lab = n.textContent.trim().slice(0, 24);
          if (px < 43.5) res.push({ b, m: `${lab}: ${px.toFixed(0)}px` });
          if (b.left < 95 || b.right > 881 || b.top < 239 || b.bottom > 1431) res.push({ b, m: `${lab}: outside` });
          const k = b.height * 0.2; // glyph box, not the line box
          boxes.push({ b: { left: b.left, right: b.right, top: b.top + k, bottom: b.bottom - k }, el, lab });
        }
      }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const A = boxes[i], B = boxes[j]; if (A.el === B.el) continue;
        const ix = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left), iy = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
        if (ix > 3 && iy > 6) res.push({ b: A.b, m: `overlap: ${A.lab} / ${B.lab}` });
      }
      for (const v of document.querySelectorAll("[data-v]")) {
        const b = v.getBoundingClientRect();
        if (op(v) > 0.2 && b.bottom > 1216 && b.top < 1410 && b.width > 4) res.push({ b, m: "visual in subtitle band", c: "#f0f" });
      }
      setIssues(res.map(({ b, m, c }) => ({ x: b.left, y: b.top, w: b.width, h: b.height, m, c })));
      requestAnimationFrame(() => continueRender(hd));
    });
  }, []);
  if (!issues) return null;
  return (
    <AbsoluteFill data-check="1" style={{ pointerEvents: "none" }}>
      {issues.map((i, k) => <div key={k} style={{ position: "absolute", left: i.x, top: i.y, width: i.w, height: i.h, outline: `3px solid ${i.c || "#f00"}` }} />)}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1080, background: issues.length ? "#c00" : "#070", color: "#fff", font: "24px monospace", padding: 8, whiteSpace: "pre-wrap" }}>
        {`t=${t.toFixed(2)} issues=${issues.length}\n` + [...new Set(issues.map((i) => i.m))].slice(0, 8).join("\n")}
      </div>
    </AbsoluteFill>
  );
};
