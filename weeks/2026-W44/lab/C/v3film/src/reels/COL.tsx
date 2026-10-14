// @ts-nocheck
// C3-COL "Loser buys dinner" (collectors). One continuous camera along a giant year ruler; no cuts.
// remocn (phase 1): stage (keyframed camera), speed-lines (flag plants), mask-reveal-up, caption-rise.
// remocn (phase 2, always alive): spring-scale-in (beat labels, per word), caption-active-pop (emphasis words),
// blur-out-up (every exit), trim-burst (slap + plants), drift (loop-safe camera breathing), typewriter (URL, red caret).
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, expo, sp, Cut, Canvas, Guides } from "../lib/core";
import { stagePose, StageWorld, speedDrop, Streaks, Captions } from "../lib/remocn";
import { per, wob, bump, spr, MBDefs, mblur, KText, Typed, DrawPath, TrimBurst, Sheen, sheenAt, wt, TAU } from "../lib/motion";
import { IMG, NAMES, Photo, CheckPresenter } from "../assets";
import TL from "../timeline/C3-COL.json";

const E = TL.ev;
export const DUR = TL.duration;
// ---- world geometry (world px; the camera maps world -> screen) ----
const X = yr => 400 + (yr - 2016) * 250;      // 250 world px per year, 2016..2024
const TAPE_T = 1100, TAPE_H = 150, TAPE_C = TAPE_T + TAPE_H / 2;
const CREAM = "#F2EBDD";
const ZZ = 1.15, YZ = TAPE_C - 70 / 1.15;
const HOME = { x: X(2019), y: TAPE_C, zoom: 0.9 };
const CARD_CAM = { x: X(2019), y: TAPE_C - 55, zoom: 1.0 };
const CAM = [
  { at: 0, ...HOME }, { at: E.glide1, ...HOME },
  { at: 4.7, x: X(2019.45), y: TAPE_C, zoom: 1.04, ease: eio },
  { at: E.camMarisol, x: X(2019.45), y: TAPE_C, zoom: 1.04 },
  { at: E.camMarisol + 0.95, x: X(2021) - 60, y: YZ, zoom: ZZ },
  { at: E.camDev, x: X(2021) - 60, y: YZ, zoom: ZZ },
  { at: E.camDev + 1.05, x: X(2017) + 60, y: YZ, zoom: ZZ, ease: eio },
  { at: E.pullBack, x: X(2017) + 60, y: YZ, zoom: ZZ },
  { at: E.pullBack + 0.9, x: X(2019), y: TAPE_C, zoom: 0.82 },
  { at: E.camTick, x: X(2019), y: TAPE_C, zoom: 0.82 },
  { at: E.camTick + 0.85, ...CARD_CAM },
  { at: E.holdEnd, ...CARD_CAM, zoom: 1.02, ease: p => p },
  { at: E.cardShrink + 0.7, x: X(2019), y: TAPE_C, zoom: 0.86 },
  { at: E.camHome, x: X(2019), y: TAPE_C, zoom: 0.86 },
  { at: E.camHome + 1.2, ...HOME, ease: eio },
];
const AY = 1160;
// camera with loop-safe breathing (remocn drift, but periodic so the last frame flows into frame 0)
const camAt = t => { const p = stagePose(t, CAM); return { x: p.x + 10 * per(t, 9, 0.4), y: p.y + 6 * per(t, 6.75, 1.3), zoom: p.zoom * (1 + 0.007 * per(t, 13.5, 2.1)) }; };

// ---- ruler: ticks pluck as the camera's read-head passes, and ripple out from impacts ----
const RIPPLES = [[E.checkSlap, 2019.5, 0.55], [E.flagMPlant, 2021, 0.4], [E.flagDPlant, 2017, 0.4], [E.tickClose, 2019, 0.6], [E.checkCenter, 2019, 0.3]];
const Ruler = ({ t, tint, split, pose, camV }) => {
  const ticks = [];
  for (let q = 0; q <= 32; q++) {
    const yr = 2016 + q / 4, x = X(yr), major = q % 4 === 0;
    if (major && yr === 2019 && split > 0) continue;
    const read = clamp(Math.abs(camV) / 18) * Math.exp(-Math.pow((x - pose.x) / 150, 2));
    const rip = RIPPLES.reduce((s, [at, y0, a]) => s + bump(t, at + Math.abs(yr - y0) * 0.07, a, 7, 19), 0);
    const sy = 1 + 0.55 * read + rip;
    const h = major ? 62 : (q % 2 ? 22 : 34);
    ticks.push(<div key={q} style={{ position: "absolute", left: x - (major ? 2 : 1.5), top: TAPE_T, width: major ? 4 : 3, height: h, background: "#6B5E45", opacity: (major ? .9 : .55) + 0.1 * read, transformOrigin: "50% 0", transform: `scaleY(${sy})` }} />);
    if (major) ticks.push(<div key={"n" + q} style={{ position: "absolute", left: x - 80, width: 160, top: TAPE_T + 70, textAlign: "center", fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", color: "#5B4F39", fontVariantNumeric: "tabular-nums", transform: `translateY(${rip * 10}px)` }}>{yr}</div>);
  }
  const gap = 70 * split;
  const edgeX = X(2021) - (X(2021) - X(2017)) * tint;
  return <div style={{ position: "absolute", left: 0, top: 0 }}>
    <div style={{ position: "absolute", left: X(2015.4), width: X(2024.6) - X(2015.4), top: TAPE_T, height: TAPE_H, background: CREAM, borderRadius: 10, boxShadow: `0 1px 0 rgba(0,0,0,.06), ${-camV * 0.4}px 10px 22px -16px rgba(60,40,10,.45)` }} />
    {tint > 0 ? <>
      <div style={{ position: "absolute", left: edgeX, width: X(2021) - edgeX, top: TAPE_T, height: TAPE_H, background: "rgba(244,48,52,.18)" }} />
      {tint < 1 && tint > 0.01 ? <div style={{ position: "absolute", left: edgeX - 6, width: 26, top: TAPE_T, height: TAPE_H, background: "linear-gradient(90deg,rgba(244,48,52,0),rgba(244,48,52,.35),rgba(244,48,52,.18))" }} /> : null}
    </> : null}
    {ticks}
    {split > 0 ? <>
      <div style={{ position: "absolute", left: X(2019) - gap / 2, width: gap, top: TAPE_T, height: TAPE_H, background: "linear-gradient(180deg,#FFFFFF,#FFFDF8 60%,#F7F0E2)", boxShadow: "inset 0 0 12px rgba(120,90,40,.18)" }} />
      {/* light from inside the tape: soft rays that breathe while it is open */}
      <div style={{ position: "absolute", left: X(2019) - 160, width: 320, top: TAPE_T - 180 * split, height: 180 * split + 20, background: `radial-gradient(50% 100% at 50% 100%, rgba(255,246,222,${0.85 * split}), rgba(255,255,255,0))`, opacity: 0.8 + 0.2 * per(t, 1.35) }} />
      <div style={{ position: "absolute", left: X(2019) - gap / 2 - 4, top: TAPE_T, width: 4, height: 62, background: "#6B5E45", transform: `rotate(${-6 * split}deg)`, transformOrigin: "50% 0" }} />
      <div style={{ position: "absolute", left: X(2019) + gap / 2, top: TAPE_T, width: 4, height: 62, background: "#6B5E45", transform: `rotate(${6 * split}deg)`, transformOrigin: "50% 0" }} />
      <div style={{ position: "absolute", left: X(2019) - 80, width: 160, top: TAPE_T + 70, textAlign: "center", fontSize: 50, fontWeight: 600, color: "#5B4F39", opacity: 1 - split, filter: split > 0.05 ? `blur(${split * 6}px)` : undefined }}>2019</div>
    </> : null}
  </div>;
};

// ---- pennant flag: SVG swallowtail with a travelling ripple; lift with anticipation, plant with speed-lines + snap ----
const FW = 24 / 27; // ripple frequency (whole cycles in 27 s)
const Flag = ({ t, x, dir, name, year, lift, plantAt, lean, twitch, yearPop }) => {
  const d = speedDrop(t, plantAt, 0.2, 34);
  const antic = t > lift - 0.08 && t < lift ? 7 * Math.sin(Math.PI * (t - lift + 0.08) / 0.08) : 0;
  const hover = t >= lift && t < plantAt ? -34 * Math.min(1.06, spr(t, lift, 260, 15)) + 3 * Math.sin((t - lift) * 14) : 0;
  const up = t < lift ? antic : t < plantAt ? hover : d.dy;
  const tw = twitch != null && t > twitch && t < twitch + 2 ? Math.exp(-(t - twitch) * 7) * Math.sin((t - twitch) * 38) * 3 : 0;
  const settle = bump(t, plantAt + 0.2, 2.2, 6, 16); // pin rocks after landing
  const PIN = 230, PW = 252, PH = 132;
  const A = 4.5 + 13 * Math.exp(-Math.max(0, t - plantAt - 0.2) * 4.5) * (t > plantAt ? 1 : 0) + (t > lift && t < plantAt + 0.2 ? 8 : 0) + 6 * Math.exp(-Math.max(0, t - (twitch || -9)) * 5) * (t > (twitch || 99) ? 1 : 0);
  const ph = name.length;
  const dy = u => A * Math.pow(u, 1.15) * Math.sin(TAU * (u * 0.85 - t * FW) + ph);
  const N = 16; const top = [], bot = [];
  for (let i = 0; i <= N; i++) { const u = i / N; top.push(`${u * PW},${dy(u)}`); bot.push(`${u * PW},${PH + dy(u)}`); }
  const notch = `${0.9 * PW},${PH / 2 + dy(0.9)}`;
  const path = `M${top.join(" L")} L${notch} L${bot.reverse().join(" L")} Z`;
  const stops = [0, 0.25, 0.5, 0.75, 1].map(u => { const s = Math.cos(TAU * (u * 0.85 - t * FW) + ph) * Math.min(1, A / 6); return <stop key={u} offset={u} stopColor={`rgb(${Math.round(244 - 26 * s)},${Math.round(48 - 10 * s)},${Math.round(52 - 10 * s)})`} />; });
  const gid = "pg" + name;
  const tu = 0.4, ty = dy(tu), slope = (dy(tu + 0.05) - dy(tu - 0.05)) / (0.1 * PW);
  const pop = bump(t, yearPop, 0.18, 6, 17);
  return <div style={{ position: "absolute", left: x, top: TAPE_T, width: 0, height: 0, zIndex: 7 }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translateY(${up}px) rotate(${lean * dir + tw + settle}deg) scale(${d.sx},${d.sy})` }}>
      <div style={{ position: "absolute", left: -3, top: -PIN, width: 6, height: PIN + 14, borderRadius: 3, background: "linear-gradient(90deg,#AEAEB2,#8E8E93 60%,#6E6E73)" }} />
      <div style={{ position: "absolute", left: -7, top: -PIN - 10, width: 14, height: 14, borderRadius: 7, background: "radial-gradient(circle at 35% 35%,#D1D1D6,#7C7C80)" }} />
      <svg style={{ position: "absolute", top: -PIN - 4, left: dir > 0 ? 3 : -PW - 3, overflow: "visible" }} width={PW} height={PH}>
        <defs><linearGradient id={gid} x1={dir > 0 ? 0 : 1} y1="0" x2={dir > 0 ? 1 : 0} y2="0">{stops}</linearGradient></defs>
        <g transform={dir > 0 ? undefined : `translate(${PW} 0) scale(-1 1)`}><path d={path} fill={`url(#${gid})`} /></g>
      </svg>
      <div style={{ position: "absolute", top: -PIN + 10, left: dir > 0 ? 27 : -PW - 3, width: PW - 24, textAlign: dir > 0 ? "left" : "right", paddingRight: dir > 0 ? 0 : 24, color: "#fff", transform: `translateY(${ty}px) skewY(${Math.atan(slope) * 57 * dir * 0.6}deg)` }}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1 }}>{name}</div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.05, marginTop: 6, fontVariantNumeric: "tabular-nums", display: "inline-block", transform: `scale(${1 + pop})`, transformOrigin: dir > 0 ? "0 70%" : "100% 70%" }}>{year}</div>
      </div>
    </div>
    <Streaks t={t} at={plantAt} dur={0.2} x={dir * 40} y={-PIN - 8} w={90} len={110} seed={name} />
    <TrimBurst t={t} at={plantAt + 0.2} x={0} y={0} n={5} r0={12} r1={56} color="#6B5E45" w={4} rot={-90} spread={150} dur={0.3} />
  </div>;
};

// ---- the record: a frosted card that rises out of the 2019 tick ----
const L7 = n => wt(TL, 7, n);
const Card = ({ t, ty, clipB, s = 1, ox, oy, tilt, blur }) => {
  const W = 930, Hh = 860;
  const out = E.fold - 0.05;
  const ph = eo(seg(t, E.cardPhoto, E.cardPhoto + 0.5)); const phq = eio(seg(t, out, out + 0.3));
  const kb = 1.1 - 0.1 * eo(seg(t, E.cardPhoto, E.cardPhoto + 0.9)) + 0.05 * eio(seg(t, E.cardPhoto + 0.9, E.holdEnd + 0.6));
  const photoPop = bump(t, L7("photo"), 0.025, 6, 15);
  const ch = spr(t, E.cardChip, 240, 14); const chq = eio(seg(t, out, out + 0.3));
  const float = 3 * per(t, 3.375, 0.5), rot = 0.35 * per(t, 5.4, 1.2);
  const sheen = Math.max(sheenAt(t, 15.95, 1.6, 0.9) * (t < E.holdEnd ? 1 : 0), 0);
  const calPop = bump(t, L7("june"), 0.2, 6, 16);
  return <div style={{ position: "absolute", left: ox - W / 2, top: oy - Hh, width: W, height: Hh, zIndex: 40, transformOrigin: "50% 100%", transform: `translateY(${ty + float}px) scale(${s}) perspective(2200px) rotateX(${tilt}deg) rotate(${rot}deg)`, clipPath: `inset(-60px -60px ${clipB}px -60px)`, filter: blur }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", boxShadow: `0 0 0 1px rgba(0,0,0,.07), 0 ${18 - float * 2}px 40px -26px rgba(0,0,0,.35)`, overflow: "hidden" }}><Sheen p={sheen} op={0.5} width={0.16} /></div>
    <div style={{ position: "absolute", left: 34, right: 34, top: 30, willChange: "transform" }}>
      <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.035em", lineHeight: 1.18, whiteSpace: "nowrap" }}>
        <KText t={t} text={`Intake · ${NAMES.intakeBrand}`} at={L7("intake")} out={out} stagger={0.09} dist={50} times={[L7("intake"), L7("intake") + 0.16, L7("intake") + 0.24, L7("intake") + 0.33]} seed="ct" float={0.8} />
      </div>
      <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, color: INK, display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round" style={{ opacity: clamp((t - L7("june") + 0.1) / 0.2) * (1 - eio(seg(t, out, out + 0.25))), transform: `scale(${Math.min(1.05, spr(t, L7("june") - 0.1, 300, 16)) + calPop}) rotate(${(1 - clamp((t - L7("june") + 0.1) / 0.3)) * -30}deg)` }}><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>
        <KText t={t} text="Jun 14, 2019" at={L7("june")} unit="char" out={out} stagger={0} dist={34} times={[L7("june"), L7("twenty"), L7("nineteen")]} seed="cd" emph={{ "2019": L7("nineteen") + 0.25 }} keepColor={false} float={0.6} />
      </div>
      <div style={{ marginTop: 20, opacity: ph * (1 - phq), transform: `translateY(${(1 - ph) * 40 - phq * 20}px) scale(${1 + photoPop})`, clipPath: `inset(${(1 - ph) * 100}% 0 0 0 round 20px)` }}>
        <Photo path={IMG.evoIntakePhoto} name="c3-evo-intake-install.jpg" w={862} h={484} r={20} zoom={kb} focus={{ x: 0.6, y: 0.45 }}>
          <Sheen p={seg(t, L7("photo") - 0.05, L7("photo") + 0.75)} op={0.38} width={0.2} />
        </Photo>
      </div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: clamp((t - E.cardChip) / 0.12) * (1 - chq), transform: `translateY(${-chq * 16}px) scale(${0.7 + 0.3 * Math.min(ch, 1.06)})`, transformOrigin: "0 50%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 24px 0 10px", borderRadius: 32, background: SOFT, fontSize: 40, fontWeight: 600, color: GREY }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, overflow: "hidden", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.06)", transform: `rotate(${(1 - Math.min(1, ch)) * -90}deg)` }}><Img src={staticFile(IMG.evo)} style={{ width: 110, marginLeft: -32, marginTop: 6 }} /></div>
          <KText t={t} text="logged by Marisol" at={E.cardChip + 0.08} out={out} stagger={0.06} dist={20} color={GREY} float={0} seed="cl" />
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 30, fontWeight: 500 }}><Typed t={t} at={E.cardChip + 0.35} text="fuelmybuild.com/marisol/evo-vi" cps={30} out={out} color={GREY} /></div>
    </div>
  </div>;
};

// ---- beat labels in the headline band: per-word spring in, emphasis pop, blur-out-up exit ----
const EMPH = {
  "Installed: ?": { "?": wt(TL, 2, "intake") },
  "Marisol: 2021": { "2021": E.flagMPlant + 0.2 },
  "Four years apart": { "Four": E.tintTo, "years": E.tintTo + 0.06 },
  "Witness: also Dev": { "Dev": wt(TL, 5, "himself") },
  "Both off by two": { "two": wt(TL, 8, "off") },
  "Split down the middle": { "middle": E.checkCenter },
};
const Label = ({ t, L }) => {
  if (t < L.a - 0.05 || t > L.b + 0.7) return null;
  if (L.kind === "chip") {
    const inP = L.loop ? spr(t, L.a, 260, 16) : 1; const outAt = L.loop ? 99 : L.b - 0.05;
    const q = eio(seg(t, outAt, outAt + 0.35));
    const slap = bump(t, E.checkSlap, 0.07, 6, 16);
    const wig = 7 * Math.exp(-Math.max(0, t - E.checkSlap) * 5) * Math.sin((t - E.checkSlap) * 22) * (t > E.checkSlap ? 1 : 0) + 3 * per(t, 3.375, 0.2);
    return <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 60, opacity: (L.loop ? clamp((t - L.a) / 0.15) : 1) * (1 - q) }}>
      <div style={{ height: 92, padding: "0 38px", borderRadius: 46, display: "flex", alignItems: "center", gap: 16, background: "#fff", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 10px 26px -16px rgba(0,0,0,.3)", transform: `translateY(${(1 - Math.min(inP, 1.05)) * 30 - q * 30 + 2 * per(t, 4.5)}px) scale(${(0.9 + 0.1 * Math.min(inP, 1.04)) * (1 + slap) * (1 - 0.06 * q)})`, filter: q > 0.02 ? `blur(${q * 8}px)` : undefined }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" style={{ transform: `rotate(${wig}deg)` }}><path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v5M10.5 3v5M3.5 3v5a3.5 3.5 0 0 0 7 0V3M17 21V3c2.2 1.2 3.5 3.6 3.5 7v4H17" /></svg>
        <span>{L.loop ? <KText t={t} text={L.text} at={L.a} stagger={0.045} dist={24} float={0} seed="chip" /> : L.text}</span></div>
    </div>;
  }
  return <div style={{ position: "absolute", left: 50, right: 50, top: 290, zIndex: 60, textAlign: "center", paddingBottom: 8, willChange: "transform" }}>
    <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.08, fontVariationSettings: '"opsz" 32' }}>
      <KText t={t} text={L.text} at={L.a} out={L.b} emph={EMPH[L.text] || {}} stagger={0.1} dist={60} seed={L.text} />
    </div>
  </div>;
};

const CTA = ({ t }) => {
  const a = E.ctaIn, out = E.ctaOut - 0.2;
  if (t < a - 0.05 || t > out + 0.7) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 246, zIndex: 80, textAlign: "center", willChange: "transform" }}>
    <div style={{ fontSize: 108, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.02, fontVariationSettings: '"opsz" 32' }}>
      <KText t={t} text="Date it once." at={a} out={out} times={[wt(TL, 10, "date"), wt(TL, 10, "it"), wt(TL, 10, "once")]} emph={{ "once.": wt(TL, 10, "once") + 0.05 }} dist={70} seed="cta" />
    </div>
    <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-.025em", marginTop: 14, minHeight: 72 }}><Typed t={t} at={wt(TL, 10, "fuelmybuild") - 0.05} text="fuelmybuild.com" cps={24} out={out} /></div>
    <div style={{ fontSize: 34, fontWeight: 500, color: GREY, marginTop: 10 }}><KText t={t} text="Illustrative story" at={a + 0.5} out={out} color={GREY} dist={20} stagger={0.08} float={0} seed="il" /></div>
  </div>;
};

export const COL = ({ t, check }) => {
  const pose = camAt(t), prev = camAt(t - 1 / 30);
  const camV = (pose.x - prev.x) * pose.zoom, camVy = (pose.y - prev.y) * pose.zoom;
  // ruler state
  const tint = t < E.tintFrom ? 0 : t < E.tintDrain ? eio(seg(t, E.tintFrom, E.tintTo)) : 1 - eo(seg(t, E.tintDrain, E.tintDrain + 0.8));
  const split = t < E.tickSplit ? 0 : t < E.fold ? Math.min(1.08, spr(t, E.tickSplit, 140, 13)) : 1 - eio(seg(t, E.tickClose - 0.15, E.tickClose + 0.25));
  // check presenter: lift with anticipation, slam, squash; slides with springs, lean into the move, motion blur
  const chHover = t < E.checkLift - 0.06 ? 0 : t < E.checkLift ? -0.08 * Math.sin(Math.PI * (t - E.checkLift + 0.06) / 0.06)
    : t < E.checkSlap - 0.12 ? Math.min(1.04, spr(t, E.checkLift, 200, 15)) : t < E.checkSlap ? lerp(1, 0, Math.pow(seg(t, E.checkSlap - 0.12, E.checkSlap), 2)) : 0;
  const chSquash = t > E.checkSlap ? Math.exp(-(t - E.checkSlap) * 16) * 0.12 : 0;
  const chXf = tt => {
    let x = X(2019.5);
    x += 40 * Math.min(1.1, spr(tt, E.checkNudge, 160, 12));
    x = lerp(x, X(2019), Math.min(1.06, spr(tt, E.checkCenter - 0.35, 120, 14)));
    x = lerp(x, X(2019.5), t >= E.checkBack ? Math.min(1.04, spr(tt, E.checkBack, 120, 15)) : 0);
    return x;
  };
  const chX = chXf(t), chV = (chX - chXf(t - 1 / 30)) * pose.zoom;
  const chRot = -6 + 4 * Math.max(0, chHover) - chV * 0.5 + 0.6 * per(t, 4.5, 0.8);
  // flags lean in at 18.85 and spring back at the fold
  const lean = t < E.flagsBack ? 10 * Math.min(1.08, spr(t, E.lean, 150, 13)) : (t > E.flagsBack + 1.5 ? 0 : 10 * (1 - sp(t, E.flagsBack, 200, 14)));
  // intake lift + leader line (draws, then erases from its start)
  const liftP = Math.min(1.1, spr(t, E.intakeLift, 220, 14)) * (1 - eio(seg(t, E.camMarisol, E.camMarisol + 0.4)));
  const lift = 20 * liftP + (liftP > 0.05 ? 5 * Math.sin((t - E.intakeLift) * 5.2) * liftP : 0) + 2 * per(t, 3.375, 2.2);
  const lead = eo(seg(t, E.leader, E.leader + 0.6)), leadTail = eio(seg(t, E.camMarisol, E.camMarisol + 0.45));
  const qIn = t < E.tickSplit ? 1 - eio(seg(t, E.tickSplit - 0.25, E.tickSplit)) : Math.min(1.08, spr(t, E.qBack, 260, 14));
  const qPop = bump(t, E.leader + 0.6, 0.25, 6, 16) + bump(t, E.flagTwitch, 0.18, 6, 16);
  // card motion (screen space, on the 2019 tick)
  const riseF = tt => Math.min(1.05, spr(tt, E.cardRise, 120, 14));
  const rise = riseF(t);
  const shrink = eio(seg(t, E.cardShrink, E.cardShrink + 0.7));
  const fold = eio(seg(t, E.fold, E.fold + 0.55));
  const showCard = t >= E.cardRise && t < E.fold + 0.6;
  const tickScreenX = 540 + (X(2019) - pose.x) * pose.zoom, tapeTopScreen = AY + (TAPE_T - pose.y) * pose.zoom;
  const cardS = lerp(1, 0.3, shrink);
  const gap = 80 * shrink * pose.zoom;
  const cardTy = (1 - rise) * 860 + fold * (860 * cardS + gap);
  const cardV = ((1 - rise) - (1 - riseF(t - 1 / 30))) * 860 + (fold - eio(seg(t - 1 / 30, E.fold, E.fold + 0.55))) * 860 * cardS;
  const tilt = 24 * (1 - Math.min(1, rise)) + 70 * fold;
  // measure lines: draw from 2019 out to each flag, end caps spring up
  const meas = eo(seg(t, E.measure, E.measure + 0.6)), measOut = eio(seg(t, E.fold - 0.1, E.fold + 0.25));
  const evoPx = 0.12 * (pose.x - HOME.x), evoPy = 0.06 * (pose.y - HOME.y);
  return <Canvas>
    <MBDefs />
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: mblur(camV, camVy, 0.35) }}>
      <StageWorld pose={pose} ax={540} ay={AY}>
        {/* the Evo sits further back: 12 % parallax against the ruler */}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${evoPx}px,${evoPy}px)` }}>
          <Cut img={IMG.evo} x={X(2019) - 330} y={506} w={740} z={2} sh={0.24 + 0.04 * per(t, 6.75)} />
        </div>
        <div style={{ position: "absolute", left: 590 + evoPx, top: 690 - lift + evoPy, width: 196, zIndex: 3, transform: `rotate(${-4 * liftP + 1.2 * per(t, 4.5, 1)}deg)` }}>
          <Cut img={IMG.intake} x={0} y={0} w={196} sh={0.26 * (1 - 0.5 * liftP)} />
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 4 }} width={10} height={10}>
          <DrawPath d={`M ${740 + evoPx} ${862 - lift + evoPy} Q ${880} ${985} ${X(2019) - 66} ${975}`} p={lead} tail={leadTail} stroke={GREY} w={4} />
          {lead > 0 && lead < 1 ? <circle cx={lerp(740, X(2019) - 66, lead)} cy={lerp(862, 975, lead) + 30 * Math.sin(Math.PI * lead) * 0.6} r={6} fill={GREY} /> : null}
        </svg>
        {qIn > 0 ? <div style={{ position: "absolute", left: X(2019) - 60, width: 120, top: 900 + 5 * per(t, 2.7, 0.3), textAlign: "center", fontSize: 120, fontWeight: 600, color: "#AEAEB2", opacity: clamp(qIn), lineHeight: 1, zIndex: 3, transform: `scale(${(0.6 + 0.4 * qIn) * (1 + qPop)}) rotate(${3 * per(t, 3.375, 1.7)}deg)`, filter: qIn < 0.9 ? `blur(${(1 - qIn) * 8}px)` : undefined }}>?</div> : null}
        <Ruler t={t} tint={tint} split={split} pose={pose} camV={camV} />
        <TrimBurst t={t} at={E.checkSlap} x={X(2019.5)} y={TAPE_T + TAPE_H - 30} n={7} r0={70} r1={150} color="#6B5E45" w={5} rot={-90} spread={160} dur={0.32} />
        <div style={{ position: "absolute", left: chX - 95, top: TAPE_T + TAPE_H - 38, zIndex: 6, transformOrigin: "50% 100%", transform: `translateY(${-chHover * 90}px) rotate(${chRot}deg) scale(${1 + chSquash},${1 - chSquash})`, filter: mblur(chV, 0, 0.5) }}>
          <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -8, height: 18, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.28),rgba(0,0,0,0))", filter: "blur(5px)", opacity: 1 - Math.max(0, chHover) * 0.6, transform: `scale(${1 - 0.3 * Math.max(0, chHover)})` }} />
          <CheckPresenter w={190} />
        </div>
        <Flag t={t} x={X(2017)} dir={1} name="Dev" year="2017" lift={E.flagDLift} plantAt={E.flagDPlant} lean={lean} twitch={E.flagTwitch} yearPop={wt(TL, 4, "seventeen")} />
        <Flag t={t} x={X(2021)} dir={-1} name="Marisol" year="2021" lift={E.flagMLift} plantAt={E.flagMPlant} lean={lean} twitch={E.flagTwitch + 0.06} yearPop={wt(TL, 3, "twenty-one")} />
        {meas > 0 && measOut < 1 ? [[2019, 2017], [2019, 2021]].map(([a, b], i) => {
          const x0 = X(a) + (b > a ? 14 : -14), x1 = X(b) + (b > a ? -14 : 14), y = TAPE_T - 50;
          const cap = Math.min(1.1, spr(t, E.measure + 0.45, 300, 14)) * (1 - measOut);
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, zIndex: 5 }}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <DrawPath d={`M ${x0} ${y} L ${x1} ${y}`} p={meas} tail={measOut} stroke={INK} w={4} />
              <line x1={x1} x2={x1} y1={y - 18 * cap} y2={y + 18 * cap} stroke={INK} strokeWidth={4} strokeLinecap="round" />
              <line x1={x0} x2={x0} y1={y - 18 * Math.min(1, meas * 3) * (1 - measOut)} y2={y + 18 * Math.min(1, meas * 3) * (1 - measOut)} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: (x0 + x1) / 2 - 110, width: 220, top: y - 32, textAlign: "center" }}>
              <span style={{ display: "inline-block", padding: "0 16px", background: "#fff", fontSize: 46, fontWeight: 600, letterSpacing: "-.02em", lineHeight: "60px", whiteSpace: "nowrap" }}>
                <KText t={t} text="2 years" at={E.measure + 0.3 + i * 0.08} out={E.fold - 0.1} unit="char" dist={26} float={0.6} seed={"m" + i} emph={{ "2": wt(TL, 8, "two") + 0.02 }} keepColor={false} /></span>
            </div>
          </div>;
        }) : null}
      </StageWorld>
    </div>
    {showCard ? <Card t={t} ty={cardTy} clipB={Math.max(0, cardTy - gap) / cardS} s={cardS} ox={tickScreenX} oy={tapeTopScreen - 2 - gap} tilt={tilt} blur={mblur(0, cardV, 0.4)} /> : null}
    {showCard && shrink > 0 ? <div style={{ position: "absolute", left: tickScreenX - 2, top: tapeTopScreen - gap, width: 4, height: gap, background: "#8E8E93", zIndex: 39, opacity: 1 - fold, transformOrigin: "50% 100%", transform: `scaleY(${eo(seg(t, E.cardShrink + 0.3, E.cardShrink + 0.7))})` }} /> : null}
    {TL.labels.map((L, i) => <Label key={i} t={t} L={L} />)}
    <CTA t={t} />
    <Captions t={t} vo={TL.vo} style="rise" />
    {check ? <Guides /> : null}
  </Canvas>;
};
