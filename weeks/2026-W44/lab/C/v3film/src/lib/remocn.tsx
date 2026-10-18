// @ts-nocheck
// remocn pieces (github.com/Remocn/remocn, MIT, see ../../LICENSE-remocn.txt), ported to pure functions of
// absolute time t (seconds) so one reel can drive many instances from its timeline JSON. Restyled to the FMB
// house look (white canvas, Inter, #F43034 sparingly). None of these were used in the visual bank's videos.
//   stage, speed-lines, mask-reveal-up, caption-rise            -> C3-COL
//   caption-split-flap, staggered-fade-up, micro-scale-fade,
//   caption-dim-progress                                         -> C3-GAR
//   paper-sticker, caption-handwrite (ink sweep), soft-blur-in,
//   caption-underline                                            -> C3-SUP
import React from "react";
import { clamp, lerp, seg, eo, eio, expo, hash, INK, GREY, CAP_TOP } from "./core";

// ============================================================ stage
// Keyframed camera over one plane (remocn `stage` resolveStagePose). keys: [{at, x, y, zoom, ease?}] in world
// units; between keys the pose eases with the right key's easing (expo by default, as in remocn).
export const stagePose = (t, keys) => {
  if (t <= keys[0].at) return keys[0];
  const L = keys[keys.length - 1]; if (t >= L.at) return L;
  const i = keys.findIndex(k => t <= k.at); const a = keys[i - 1], b = keys[i];
  const p = (b.ease || expo)((t - a.at) / (b.at - a.at));
  return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), zoom: lerp(a.zoom, b.zoom, p) };
};
// Places world point (pose.x, pose.y) at screen (ax, ay) with scale pose.zoom.
export const StageWorld = ({ pose, ax = 540, ay = 960, children, w = 6000, h = 4000 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: `translate(${ax - pose.x * pose.zoom}px, ${ay - pose.y * pose.zoom}px) scale(${pose.zoom})` }}>{children}</div>
);

// ============================================================ speed-lines (trail mode, simplified)
// An object falls from y0 to y1 over `dur`, leaves parallel streaks behind it, then lands with squash and a
// small bounce. Returns the motion; <Streaks/> draws the trail in the object's local space.
export const speedDrop = (t, at, dur = 0.22, lift = 60) => {
  const p = seg(t, at, at + dur);
  const fall = p * p;                                           // accelerate into the landing
  const after = t - (at + dur);
  if (after > 1.2) return { dy: 0, sx: 1, sy: 1, p: 1, landed: true }; // settled exactly (keeps loops pixel-identical)
  const bounce = after > 0 ? Math.exp(-after * 9) * Math.sin(after * 26) : 0;
  const squash = after > 0 ? Math.exp(-after * 14) * 0.16 : 0;
  return { dy: t < at ? -lift : (p < 1 ? -lift * (1 - fall) : -bounce * 10), sx: 1 + squash, sy: 1 - squash, p, landed: p >= 1 };
};
export const Streaks = ({ t, at, dur = 0.22, x, y, w = 60, len = 120, n = 4, color = "rgba(29,29,31,.35)", seed = "s" }) => {
  const life = seg(t, at + dur * 0.15, at + dur + 0.16); if (life <= 0 || life >= 1) return null;
  return <svg style={{ position: "absolute", left: x - w / 2 - 10, top: y - len - 20, overflow: "visible", pointerEvents: "none" }} width={w + 20} height={len + 20}>
    {Array.from({ length: n }, (_, i) => {
      const fx = 10 + (i + 0.5) * (w / n) + (hash(seed + i) - .5) * 8; const l = len * (0.55 + 0.45 * hash(seed + "l" + i));
      const head = eo(clamp(life * 1.6)), tail = eo(clamp((life - 0.25) * 1.6));
      return <line key={i} x1={fx} x2={fx} y1={len + 10 - l * (1 - tail)} y2={len + 10 - l * (1 - head) * 0.2} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={1 - life} />;
    })}
  </svg>;
};

// ============================================================ mask-reveal-up
// Lines rise into place with a soft masked feel: 23-frame enter, 11-frame travel, 3-frame stagger, blur 6 -> 0;
// exit 16 frames, upward 22 px. Times in seconds; `out` optional.
const bez = (x1, y1, x2, y2) => p => { // cubic-bezier easing (same curves as remocn)
  let t = p; for (let i = 0; i < 6; i++) { const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx; const x = ((ax * t + bx) * t + cx) * t - p; const d = (3 * ax * t + 2 * bx) * t + cx; if (Math.abs(d) < 1e-6) break; t -= x / d; }
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by; return ((ay * t + by) * t + cy) * t;
};
const MRU_IN = bez(0.22, 1, 0.36, 1), MRU_OUT = bez(0.64, 0, 0.78, 0);
export const maskRevealUp = (t, at, i = 0, out = 1e9, distance = 30) => {
  const li = (t - at) * 30 - i * 3, lo = (t - out) * 30 - i * 2;
  const pin = MRU_IN(clamp(li / 23)), tin = MRU_IN(clamp(li / 11)), pout = MRU_OUT(clamp(lo / 16)), tout = MRU_OUT(clamp((lo - 8) / 8));
  const op = pin * (1 - pout); const y = distance * (1 - tin) - 22 * tout; const blur = 6 * (1 - pin) + 6 * pout;
  return { opacity: op, transform: `translateY(${y}px)`, filter: blur > 0.15 ? `blur(${blur}px)` : undefined };
};
export const MaskLines = ({ t, at, out, lines, style = {}, lineStyle = () => ({}) }) => (
  <div style={style}>{lines.map((L, i) => <div key={i} style={{ overflow: "hidden", paddingBottom: 6 }}><div style={{ ...maskRevealUp(t, at, i, out), ...lineStyle(i) }}>{L}</div></div>)}</div>
);

// ============================================================ staggered-fade-up / micro-scale-fade / soft-blur-in
export const staggeredFadeUp = (t, at, i = 0, stagger = 0.1, dist = 28) => { const p = eo(seg(t, at + i * stagger, at + i * stagger + 0.45)); return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` }; };
export const microScaleFade = (t, at, out = 1e9) => { const p = eo(seg(t, at, at + 0.3)), q = eo(seg(t, out, out + 0.25)); return { opacity: p * (1 - q), transform: `scale(${(0.94 + 0.06 * p) * (1 - 0.03 * q)})` }; };
// per-character fade with a gentle blur and upward motion (remocn soft-blur-in: 2-frame stagger, 18-frame rise)
export const SoftBlurIn = ({ t, at, text, out = 1e9, stagger = 0.022, style = {} }) => {
  const q = eo(seg(t, out, out + 0.25)); let n = 0;
  return <span style={{ display: "inline", opacity: 1 - q, ...style }}>{text.split(" ").map((w, wi) => <React.Fragment key={wi}>{wi ? " " : ""}<span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{[...w].map((c, ci) => {
    const i = n++; const p = eo(seg(t, at + i * stagger, at + i * stagger + 0.6));
    return <span key={ci} style={{ display: "inline-block", whiteSpace: "pre", opacity: p, transform: `translateY(${(1 - p) * 14}px)`, filter: p < .99 ? `blur(${(1 - p) * 8}px)` : undefined }}>{c}</span>;
  })}</span></React.Fragment>)}</span>;
};

// ============================================================ paper-sticker (stop-motion landing)
// Lands over two poses on a 2-frame step (15 fps feel): scale 1.12 then 1, with a per-pose paper jitter.
export const paperSticker = (t, at, seed = "p", maxTilt = 2.6, step = 2 / 30) => {
  if (t < at) return { visible: false };
  const k = Math.floor((t - at) / step); const pose = Math.min(k, 2);
  const tilt = (hash(seed + ":rot") * 2 - 1) * maxTilt;
  const jx = (hash(seed + "x" + k) - .5) * 1.4, jy = (hash(seed + "y" + k) - .5) * 1.4, jr = (hash(seed + "r" + k) - .5) * 0.4;
  return { visible: true, pose, scale: pose < 2 ? (pose === 0 ? 1.12 : 1.04) : 1, rot: tilt + jr, jx, jy };
};

// ============================================================ caption-handwrite ink sweep (for tag writing)
// Each word is inked left to right through a moving mask edge; each word and glyph sits at its own slight slant.
export const InkWrite = ({ t, at, text, dur = 0.6, wobble = 1, seed = "ink", color = "#1D1D1F", style = {} }) => {
  const ws = text.split(" "); const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return <span style={{ ...style, color }}>{ws.map((w, wi) => {
    const a = at + dur * (acc / total); const d = Math.max(0.12, dur * (w.length / total)); acc += w.length + 1;
    const p = clamp((t - a) / d); const head = p * 122; const sd = `${seed}-${wi}`;
    const mask = p > 0 && p < 1 ? `linear-gradient(90deg,#000 ${head - 22}%,transparent ${head}%)` : undefined;
    return <React.Fragment key={wi}>{wi ? " " : ""}<span style={{ display: "inline-block", whiteSpace: "nowrap", opacity: p > 0 ? 1 : 0, transform: `translateY(${(hash(sd + "l") * .08 - .04) * wobble}em) rotate(${(hash(sd + "t") * 3 - 1.5) * wobble}deg)`, WebkitMaskImage: mask, maskImage: mask }}>
      {[...w].map((c, ci) => <span key={ci} style={{ display: "inline-block", transform: `rotate(${(hash(sd + ci) * 6 - 3) * wobble}deg)` }}>{c}</span>)}
    </span></React.Fragment>;
  })}</span>;
};

// ============================================================ caption-split-flap engine (board scale)
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// One character's flap state: flips through 3-8 random glyphs, 60 ms per flip, from `from` to `to`.
export const flapState = (t, from, to, start, seed, stall = false) => {
  const flips = stall ? 8 : 3 + Math.floor(hash(seed + "f") * 6);
  // stall: flips slow down (50 ms -> 200 ms) and land on blank
  const durOf = k => stall ? lerp(0.05, 0.2, Math.pow(k / flips, 1.6)) : 0.06;
  if (t < start) return { cur: from, next: from, p: null };
  let tt = start, k = 0; while (k < flips && tt + durOf(k) <= t) { tt += durOf(k); k++; }
  if (k >= flips) return { cur: to, next: to, p: null, since: t - tt };
  const g = j => j <= 0 ? from : j >= flips ? to : GLYPHS[Math.floor(hash(`${seed}-${j}`) * GLYPHS.length)];
  return { cur: g(k), next: g(k + 1), p: (t - tt) / durOf(k) };
};
const Leaf = ({ ch, bg, fg, fs, clip, tf, br = 1, r }) => (
  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: fg, borderRadius: r, clipPath: clip, transform: tf, transformOrigin: "50% 50%", filter: br < 1 ? `brightness(${br})` : undefined }}>
    <span style={{ fontSize: fs, fontWeight: 700, lineHeight: 1 }}>{ch}</span></span>
);
export const FlapTile = ({ st, w, h, bg = "#141415", fg = "#FFFFFF", twitch = 0 }) => {
  const fs = h * 0.64, r = h * 0.07, P = `perspective(${h * 4}px)`; const { cur, next, p } = st;
  // landing: the top leaf slaps down and bounces a few degrees (real split-flap behaviour); twitch: a leaf half-lifts and drops back
  const since = st.since == null ? 9 : st.since;
  const land = since < 0.2 ? -16 * Math.exp(-since * 26) * Math.abs(Math.sin(since * 48)) : 0;
  const lift = land + twitch;
  return <span style={{ position: "relative", display: "inline-block", width: w, height: h, flex: "none" }}>
    {p === null ? (lift !== 0 ? <>
      <Leaf ch={cur} bg={bg} fg={fg} fs={fs} r={r} clip="inset(50% 0 0 0)" />
      <Leaf ch={cur} bg={bg} fg={fg} fs={fs} r={r} clip="inset(0 0 50% 0)" tf={`${P} rotateX(${lift}deg)`} br={1 + lift / 60} />
    </> : <Leaf ch={cur} bg={bg} fg={fg} fs={fs} r={r} />) : <>
      <Leaf ch={next} bg={bg} fg={fg} fs={fs} r={r} clip="inset(0 0 50% 0)" br={0.55 + 0.45 * p} />
      <Leaf ch={cur} bg={bg} fg={fg} fs={fs} r={r} clip="inset(50% 0 0 0)" br={1 - 0.45 * clamp((p - 0.5) * 2)} />
      {p < .5 ? <Leaf ch={cur} bg={bg} fg={fg} fs={fs} r={r} clip="inset(0 0 50% 0)" tf={`${P} rotateX(${-180 * p}deg)`} br={1 - .7 * p} />
        : <Leaf ch={next} bg={bg} fg={fg} fs={fs} r={r} clip="inset(50% 0 0 0)" tf={`${P} rotateX(${180 * (1 - p)}deg)`} br={.65 + .7 * (p - .5)} />}
    </>}
    <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, transform: "translateY(-50%)", background: "rgba(0,0,0,.65)" }} />
    <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", borderRadius: `${r}px ${r}px 0 0`, background: "linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,0))", pointerEvents: "none" }} />
  </span>;
};
// A board: rows of `cols` flaps. states: [{row, at, text, tone?, stall?}] (sorted per row by `at`).
export const FlapBoard = ({ t, states, rows = 4, cols = 14, fw = 60, fh = 86, gap = 4, rgap = 8, pad = 18, initial = [], twitch = () => 0, children = null }) => {
  const tone = { grey: { bg: "#3A3A3C", fg: "#AEAEB2" }, ink: { bg: "#232325", fg: "#FFFFFF" } };
  return <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: rgap, padding: pad, background: "#0A0A0A", borderRadius: 22, overflow: "hidden", boxShadow: "0 1px 0 rgba(255,255,255,.08) inset, 0 18px 40px -22px rgba(0,0,0,.55)" }}>{children}
    {Array.from({ length: rows }, (_, r) => {
      const rs = states.filter(s => s.row === r).sort((a, b) => a.at - b.at);
      let i = -1; rs.forEach((s, k) => { if (s.at <= t) i = k; });
      const prev = i > 0 ? rs[i - 1] : { text: initial[r] || "", tone: "ink" }, cur = i >= 0 ? rs[i] : { text: initial[r] || "", tone: "ink", at: -1 };
      const A = (prev.text || "").padEnd(cols).slice(0, cols), B = (cur.text || "").padEnd(cols).slice(0, cols);
      const force = i >= 0 && A === B; // re-clatter onto the same text
      return <div key={r} style={{ display: "flex", gap }}>{Array.from({ length: cols }, (_, c) => {
        const from = A[c] === " " ? "" : A[c], to = B[c] === " " ? "" : B[c];
        let st = { cur: to, next: to, p: null };
        const stallCol = cur.stall && c >= (cur.text || "").length + 2;
        if (i >= 0 && (from !== to || (force && to) || stallCol)) st = flapState(t, from, stallCol ? "" : to, cur.at + c * 0.02, `${r}-${i}-${c}`, stallCol);
        const tn = st.p === null && !to ? tone.ink : (tone[cur.tone] || tone.ink);
        return <FlapTile key={c} st={st} w={fw} h={fh} bg={tn.bg} fg={tn.fg} twitch={st.p === null ? twitch(r, c) : 0} />;
      })}</div>;
    })}
  </div>;
};

// ============================================================ captions (three styles over one plate)
// Shared: the current VO line (from the timeline JSON) on a white plate in the subtitle band, speaker tag in grey.
// Word animation per reel: caption-rise (COL), caption-dim-progress (GAR), caption-underline (SUP).
// Phase 2 adds, on every style: the plate springs in, emphasis words pop on their spoken time (caption-active-pop:
// accent colour + scale; caption-weight: the word swells heavier), and the line leaves word by word (blur-out-up).
export const curLine = (t, vo, clipEnd = 26.6) => {
  for (let k = 0; k < vo.length; k++) { const L = vo[k], nx = vo[k + 1]; const end = Math.min(L.b + 0.2, nx ? nx.a - 0.12 : 99, clipEnd); if (t >= L.a - 0.12 && t < end) return { L, end }; }
  return null;
};
const cw = w => w.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
const RED_ = "#F43034";
const spr_ = (x, k = 260, d = 17) => { if (x <= 0) return 0; const w0 = Math.sqrt(k), z = d / (2 * w0), wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x)); };
const bump_ = (x, amp) => x <= 0 ? 0 : amp * 1.25 * Math.exp(-x * 6.5) * Math.sin(x * 17);
const mixc = (p) => `rgb(${Math.round(lerp(29, 244, p))},${Math.round(lerp(29, 48, p))},${Math.round(lerp(31, 52, p))})`;
export const Captions = ({ t, vo, style = "rise", narrator = "Narrator", clipEnd = 26.6, top = CAP_TOP }) => {
  const c = curLine(t, vo, clipEnd); if (!c) return null; const { L, end } = c;
  const ps = spr_(t - (L.a - 0.12), 300, 20), pin = clamp((t - (L.a - 0.12)) / 0.12);
  const exitAt = end - 0.3; const n = L.words.length;
  const plateOut = eio(clamp((t - (end - 0.2)) / 0.2));
  const tag = L.speaker !== narrator ? L.speaker : null;
  const emw = new Set((L.emphasis || []).flatMap(e => e.split(" ").map(cw)));
  const exitOf = i => eio(clamp((t - (exitAt + i * Math.min(0.03, 0.18 / n))) / 0.2));
  const word = (w, i) => {
    const sp = t - w.a; const q = exitOf(i); const em = emw.has(cw(w.w));
    const ex = { opacity: 1 - q, filter: q > 0.02 ? `blur(${q * 7}px)` : undefined };
    const ey = -q * 18;
    const emP = em ? clamp(sp / 0.1) : 0; const pop = em ? bump_(sp, 0.17) : 0;
    const col = em ? mixc(emP) : INK;
    const box = (inner, extra = {}) => <span key={i} style={{ display: "inline-grid", marginRight: ".26em", verticalAlign: "bottom", position: "relative", ...extra }}>
      <span style={{ gridArea: "1/1", visibility: "hidden", fontWeight: em ? 760 : 600 }}>{w.w}</span>{inner}</span>;
    if (style === "rise") {
      const p = spr_(sp, 320, 21);
      return box(<span style={{ gridArea: "1/1", overflow: "hidden", display: "inline-block", paddingBottom: 4 }}><span style={{ display: "inline-block", color: col, fontWeight: em ? lerp(600, 760, emP) : 600, transform: `translateY(${(1 - Math.min(p, 1.06)) * 105 + ey}%) scale(${1 + pop})`, transformOrigin: "50% 80%", ...ex }}>{w.w}</span></span>);
    }
    if (style === "dim") {
      const p = clamp(sp / 0.12);
      // caption-weight: the spoken word swells heavy, then relaxes (emphasis words stay heavy and turn red)
      const sw = clamp(sp / 0.1) * (1 - clamp((sp - (w.b - w.a) - 0.05) / 0.2));
      const wt = em ? lerp(600, 780, emP) : lerp(600, 690, sw);
      return box(<span style={{ gridArea: "1/1", display: "inline-block", color: col, opacity: lerp(0.3, 1, p) * (1 - q), fontWeight: wt, transform: `translateY(${ey}px) scale(${1 + pop})`, transformOrigin: "50% 80%", filter: ex.filter }}>{w.w}</span>);
    }
    // underline: text stays, emphasis gets inline-highlight (ink -> red) + pop
    return box(<span style={{ gridArea: "1/1", display: "inline-block", color: col, fontWeight: em ? lerp(600, 740, emP) : 600, transform: `translateY(${ey}px) scale(${1 + pop})`, transformOrigin: "50% 80%", opacity: (sp > -0.05 ? 1 : 0.34) * (1 - q), filter: ex.filter }}>{w.w}</span>);
  };
  let bar = null;
  if (style === "underline") {
    const ws = L.words; let k = ws.findIndex(w => t < w.b + 0.08); if (k < 0) k = ws.length - 1;
    const wb = ws[k]; const mv = eio(clamp((t - wb.a + 0.08) / 0.16));
    bar = { k, prev: Math.max(0, k - 1), mv, on: t >= ws[0].a - 0.05, out: exitOf(n) };
  }
  return <div style={{ position: "absolute", left: 70, right: 70, top, zIndex: 90, display: "flex", justifyContent: "center", opacity: pin * (1 - plateOut), transform: `translateY(${(1 - Math.min(ps, 1)) * 14}px) scale(${(0.94 + 0.06 * ps) * (1 - 0.04 * plateOut)})` }}>
    <div style={{ maxWidth: 940, padding: "16px 32px 18px", borderRadius: 30, background: "rgba(255,255,255,.96)", boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 8px 24px -12px rgba(0,0,0,.2)", textAlign: "center", fontSize: 48, lineHeight: 1.2, fontWeight: 600, letterSpacing: "-.02em", color: INK, textWrap: "balance", willChange: "transform" }}>
      {tag ? <span style={{ color: GREY, marginRight: 14, display: "inline-block", opacity: 1 - exitOf(0), transform: `translateX(${(1 - Math.min(1, spr_(t - L.a + 0.12, 300, 22))) * -16}px)` }}>{tag}</span> : null}
      {L.words.map((w, i) => {
        const el = word(w, i);
        if (style === "underline" && bar && bar.on && (i === bar.k || i === bar.prev)) {
          return <span key={i} style={{ display: "inline-block", position: "relative" }}>{el}
            <span style={{ position: "absolute", left: 0, right: "0.26em", bottom: -4, height: 5, borderRadius: 3, background: emw.has(cw(w.w)) ? RED_ : INK, opacity: 1 - bar.out, transformOrigin: i === bar.k ? "0 50%" : "100% 50%", transform: `scaleX(${i === bar.k ? bar.mv : (bar.k === bar.prev ? 1 : 1 - bar.mv)})` }} /></span>;
        }
        return el;
      })}
    </div>
  </div>;
};
