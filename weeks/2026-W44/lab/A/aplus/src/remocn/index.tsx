// @ts-nocheck
// remocn pieces (github.com/Remocn/remocn, MIT, see .claude/skills/motion/references/REMOCN-LICENSE.txt),
// ported to pure functions of absolute time t so each beat can be timed to its spec row.
// Motion curves, frame lengths and travel are the originals; the look (fonts, colours) comes from the spec.
import React from "react";
import { Easing } from "remotion";

export const FPS = 30;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (x, a, b) => cl((x - a) / (b - a));

// ---- mask-reveal-up (typography): lines rise 30px out of a 6px blur, 23f enter / 11f travel, 3f stagger;
// exit 16f, -22px, blur back to 6px.
const enterEase = Easing.bezier(0.22, 1, 0.36, 1);
const exitEase = Easing.bezier(0.64, 0, 0.78, 0);
export function maskRevealIn(t, t0, i = 0, distance = 30) {
  const f = (t - t0) * FPS - i * 3;
  const p = enterEase(seg(f, 0, 23));
  const y = (1 - enterEase(seg(f, 0, 11))) * distance;
  return { opacity: p, translate: `0 ${y}px`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined };
}
export function maskRevealOut(t, t0, i = 0) {
  // exit shortened from 16f to 9f so a held headline never ghosts under the next one (1 s rows)
  const f = (t - t0) * FPS - i * 2;
  const p = exitEase(seg(f, 0, 9));
  const y = -22 * exitEase(seg(f, 3, 9));
  return { opacity: 1 - seg(f, 0, 6), translate: `0 ${y}px`, filter: p > 0 ? `blur(${p * 6}px)` : undefined, done: p >= 1 };
}

// ---- value-swap (typography): a value slides 12px and fades over 10f with inOut cubic.
const swapEase = Easing.inOut(Easing.cubic);
export function valueIn(t, t0, distance = 12, frames = 10) {
  if (t0 == null) return { opacity: 1 };
  const p = swapEase(seg((t - t0) * FPS, 0, frames));
  return { opacity: p, translate: `0 ${(1 - p) * distance}px` };
}
export const ValueSwap = ({ t, values, at, style }) => {
  // values[i] shows from at[i-1]; the outgoing one leaves upward as the next arrives
  let k = 0; for (let i = 0; i < at.length; i++) if (t >= at[i]) k = i + 1;
  const sizer = values.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      <span style={{ visibility: "hidden" }}>{sizer}</span>
      {values.map((v, i) => {
        if (i > k) return null;
        const pin = i === 0 ? 1 : swapEase(seg((t - at[i - 1]) * FPS, 0, 10));
        const pout = i < k ? swapEase(seg((t - at[i]) * FPS, 0, 10)) : 0;
        const o = pin * (1 - pout); if (o < 0.002) return null;
        return <span key={i} style={{ position: "absolute", left: 0, top: 0, opacity: o, translate: `0 ${(1 - pin) * 12 - pout * 12}px` }}>{v}</span>;
      })}
    </span>
  );
};

// ---- strikethrough-replace (typography): a strike draws across the old text (first 40%), old fades out
// while the new text fades in 8px below (40–60%), then holds. dur in seconds.
export const StrikeReplace = ({ t, t0, dur, from, to, lineColor, lineH = 5, style }) => {
  const p = cl((t - t0) / dur);
  const line = seg(p, 0, 0.4) * 100;
  const fo = 1 - seg(p, 0.4, 0.6), ti = seg(p, 0.4, 0.6);
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      <span style={{ visibility: "hidden" }}>{p < 0.5 ? from : to}</span>
      {fo > 0 && <span style={{ position: "absolute", left: 0, top: 0, opacity: fo }}>{from}
        {from && to && from.startsWith(to)
          ? <span style={{ position: "absolute", top: "54%", height: lineH, left: `${(to.length / from.length) * 100}%`, width: `${line * (1 - to.length / from.length)}%`, background: lineColor, translate: "0 -50%" }} />
          : <span style={{ position: "absolute", top: "54%", height: lineH, left: 0, width: `${line}%`, background: lineColor }} />}
      </span>}
      {ti > 0 && <span style={{ position: "absolute", left: 0, top: 0, opacity: ti, translate: `0 ${(1 - ti) * 8}px` }}>{to}</span>}
    </span>
  );
};

// ---- caption-subtitle (captions): whole phrase, no word animation, 120ms in / 160ms out, legibility shadow, no plate.
export const Subtitles = ({ t, subs, color, font, size = 52, top = 1220, height = 190, left = 96, width = 784 }) => {
  const cur = subs.find(([, a, b]) => t >= a && t < b);
  if (!cur) return null;
  const [text, a, b] = cur;
  const next = subs.find(([, a2]) => Math.abs(a2 - b) < 0.02);
  const enter = seg((t - a) * 1000, 0, 120);
  const exit = next ? 1 : seg((b - t) * 1000, 0, 160);
  return (
    <div data-sub="1" style={{ position: "absolute", left, top, width, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: font, fontWeight: 600, fontSize: size, lineHeight: 1.18, color, textAlign: "center", textWrap: "balance",
        opacity: Math.min(enter, exit), textShadow: "0 2px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.35)" }}>{text}</div>
    </div>
  );
};

// ---- drift (layout): slow push-in over a window, grow 0.035 by default.
export const drift = (t, t0, t1, grow = 0.035) => 1 + grow * cl((t - t0) / (t1 - t0));

// ---- caret (ui, from typewriter): deterministic blink, ~1.1 Hz, square end.
export const Caret = ({ t, t0 = 0, color, w = 6, h = "1em" }) => {
  const on = Math.floor((t - t0) * 2.2) % 2 === 0;
  return <span style={{ display: "inline-block", width: w, height: h, background: color, opacity: on ? 1 : 0, verticalAlign: "text-bottom" }} />;
};
