// @ts-nocheck
// C3-SUP "Rattle. Fix?" (parts suppliers). Time as weight: manila tags pile onto an exhaust hanging from one
// off-white cotton string; the pipe sags with each slow answer. The first tag flips open into the log card.
// remocn (phase 1): paper-sticker (tag landings), caption-handwrite ink sweep (tag writing), soft-blur-in (card fields),
// caption-underline (subtitles).
// remocn (phase 2, always alive): path-ride (the tie-on string draws along a curve with the tag riding its head, then pulls
// taut), value-swap (ticket day chip 1 -> 2 -> 4 -> 6 -> 1), inline-highlight (emphasis words turn red in the captions),
// spring-scale-in (labels per word), blur-out-up (exits), typewriter (URL), drift-style pendulum sway on every hanging thing.
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, sp, Cut, Canvas, Guides } from "../lib/core";
import { paperSticker, InkWrite, SoftBlurIn, Captions } from "../lib/remocn";
import { per, bump, spr, MBDefs, mblur, KText, Typed, DrawPath, Sheen, sheenAt, wt, TAU } from "../lib/motion";
import { IMG, NAMES, HANGER, Photo, HangTag, TAG_AR } from "../assets";
import TL from "../timeline/C3-SUP.json";

const E = TL.ev;
export const DUR = TL.duration;
const HX = 540, HY = 760, AX = 540, AYY = -40; // hang point at frame 0; string anchor above the frame
const ROT = 40, EW = 700;
const TW = 260, TH = TW * TAG_AR;
const COTTON = "#E6DED0", COTTON_EDGE = "#C9BFAE";
const ATT = [{ x: -250, y: 62 }, { x: 20, y: 70 }, { x: 270, y: 40 }];
const INK_C = "#1D1D1F", PENCIL = "#8E8E93";

const rot = (p, deg) => { const r = deg * Math.PI / 180; return { x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) }; };
const swing = (t, at, amp = 7, k = 3.2, w = 7) => t > at ? amp * Math.exp(-(t - at) * k) * Math.sin((t - at) * w) : 0;

const TagFace = ({ t, q, qAt, a, aAt, qSize = 50, out = 1e9 }) => <div style={{ display: "flex", flexDirection: "column", gap: 12, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.08 }}>
  <div style={{ fontSize: qSize }}>{qAt != null ? <InkWrite t={t} at={qAt} text={q} dur={0.55} seed={q} color={INK_C} /> : q}</div>
  {a ? a.map((ln, i) => <div key={i} style={{ fontSize: 38, fontWeight: 500, marginTop: i ? -6 : 0, whiteSpace: "nowrap" }}><InkWrite t={t} at={aAt + i * 0.3} text={ln} dur={0.35} seed={ln} color={PENCIL} /></div>) : null}
</div>;

const String_ = ({ x1, y1, x2, y2, bow = 6 }) => {
  const mx = (x1 + x2) / 2 + bow, my = (y1 + y2) / 2; const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 3 }} width={10} height={10}>
    <path d={d} fill="none" stroke={COTTON_EDGE} strokeWidth={5} strokeLinecap="round" /><path d={d} fill="none" stroke={COTTON} strokeWidth={3} strokeLinecap="round" />
  </svg>;
};

// one tag hanging from (ax, ay) by a short cotton loop; loopP draws the loop on; soft shadow shifts with the swing
const Hanging = ({ ax, ay, ang = 0, s = 1, op = 1, children, z = 10, loop = 34, dx = 0, dy = 0, loopP = 1, blur }) => (
  <div style={{ position: "absolute", left: ax, top: ay, width: 0, height: 0, zIndex: z, opacity: op, transform: `translate(${dx}px,${dy}px) rotate(${ang}deg) scale(${s})`, transformOrigin: "0 0", filter: blur }}>
    <svg style={{ position: "absolute", left: -12, top: 0, overflow: "visible" }} width={24} height={loop + 30}>
      <DrawPath d={`M 12 0 L 12 ${loop + 22}`} p={loopP} stroke={COTTON_EDGE} w={5} cap="butt" /><DrawPath d={`M 12 0 L 12 ${loop + 22}`} p={loopP} stroke={COTTON} w={3} cap="butt" /></svg>
    <div style={{ position: "absolute", left: -TW / 2, top: loop, filter: `drop-shadow(${-ang * 0.5}px 8px 7px rgba(60,40,10,.22))` }}>{children}</div>
  </div>
);

const Chip = ({ children, bg = "#fff", color = INK, style = {} }) => <div style={{ height: 72, padding: "0 26px", borderRadius: 36, background: bg, color, display: "inline-flex", alignItems: "center", gap: 12, fontSize: 40, fontWeight: 600, letterSpacing: "-.015em", whiteSpace: "nowrap", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 8px 22px -16px rgba(0,0,0,.35)", ...style }}>{children}</div>;

// remocn value-swap: the day number slides up out, the new one slides in, layout never shifts
const DAYS = [[-1, "1"], [E.pencil2, "2"], [E.pencil3, "4"], [wt(TL, 7, "six"), "6"], [E.lift + 0.3, "1"]];
const DaySwap = ({ t }) => {
  let i = 0; DAYS.forEach(([a], k) => { if (t >= a) i = k; });
  const p = i > 0 ? Math.min(1.06, spr(t, DAYS[i][0], 300, 18)) : 1;
  const prev = i > 0 ? DAYS[i - 1][1] : DAYS[0][1];
  return <span style={{ position: "relative", display: "inline-block", overflow: "hidden", height: "1.2em", verticalAlign: "-.25em", width: "0.7em" }}>
    {p < 1 ? <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-p * 100}%)`, opacity: 1 - p }}>{prev}</span> : null}
    <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - p) * 100}%)`, color: i > 0 && t < DAYS[i][0] + 0.8 ? RED : "inherit" }}>{DAYS[i][1]}</span>
  </span>;
};

const L9 = n => wt(TL, 9, n);
const CardFace = ({ t }) => {
  const out = E.foldBack - 0.05;
  const hx = 34 + 862 * HANGER.x, hy = 34 + 78 + 60 + 20 + 646 * HANGER.y;
  // path-ride: the cotton draws along a curve from the card's top edge to the hanger with the tag riding its head,
  // then the slack pulls in until only the tie loop remains
  const ride = eo(seg(t, E.tieTag - 0.45, E.tieTag + 0.2)), taut = eio(seg(t, E.tieTag + 0.15, E.tieTag + 0.55));
  const P0 = { x: hx - 300, y: 20 }, C = { x: hx - 40, y: hy - 330 }, P1 = { x: hx, y: hy };
  const q = u => ({ x: (1 - u) ** 2 * P0.x + 2 * u * (1 - u) * C.x + u * u * P1.x, y: (1 - u) ** 2 * P0.y + 2 * u * (1 - u) * C.y + u * u * P1.y });
  const head = q(ride);
  const ph = eo(seg(t, E.cardIn, E.cardIn + 0.5)), phq = eio(seg(t, out, out + 0.3));
  const kb = 1.1 - 0.1 * eo(seg(t, E.cardIn, E.cardIn + 1.0)) + 0.05 * eio(seg(t, E.cardIn + 1.0, E.foldBack));
  const chip = spr(t, E.chipIn, 240, 14);
  const sheen = t < E.holdEnd ? sheenAt(t, 16.3, 1.7, 0.9) : 0;
  return <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(255,255,255,.96)", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 18px 40px -26px rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden" }}><Sheen p={sheen} op={0.5} width={0.14} /></div>
    <div style={{ position: "absolute", left: 34, right: 34, top: 30, willChange: "transform" }}>
      <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.035em", lineHeight: 1.2, whiteSpace: "nowrap" }}>
        <KText t={t} text={`Exhaust · ${NAMES.exhaustBrand}`} at={E.cardIn} out={out} times={[L9("calder"), L9("calder") + 0.1, L9("calder") + 0.2]} emph={{ [NAMES.exhaustBrand]: L9("calder") + 0.3 }} keepColor={false} dist={44} seed="se" float={0.7} /></div>
      <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round" style={{ opacity: clamp((t - L9("july") + 0.1) / 0.2) * (1 - phq), transform: `scale(${Math.min(1.05, spr(t, L9("july") - 0.1, 300, 16))}) rotate(${(1 - clamp((t - L9("july") + 0.1) / 0.3)) * -30}deg)` }}><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>
        <KText t={t} text="Jul 22, 2026" unit="char" at={L9("july")} out={out} times={[L9("july"), L9("twenty") + 0.05, L9("twenty") + 0.3]} dist={30} seed="sd" float={0.6} /></div>
      <div style={{ marginTop: 20, opacity: clamp((t - E.cardIn) / 0.1) * (1 - phq), clipPath: `inset(${(1 - ph) * 100}% 0 0 0 round 20px)`, transform: `translateY(${(1 - ph) * 30 - phq * 20}px)` }}>
        <Photo path={IMG.wrxUndersidePhoto} name="c3-wrx-exhaust-underside.jpg" w={862} h={646} r={20} zoom={kb} focus={HANGER}>
          <Sheen p={seg(t, L9("northline") - 0.1, L9("northline") + 0.7)} op={0.3} />
        </Photo>
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 24px 0 12px", borderRadius: 32, background: SOFT, fontSize: 40, fontWeight: 600, color: GREY, width: "fit-content", opacity: clamp((t - E.chipIn) / 0.12) * (1 - phq), transform: `scale(${(0.7 + 0.3 * Math.min(1.06, chip)) * (1 + bump(t, L9("northline") + 0.1, 0.06))})`, transformOrigin: "0 50%" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round" style={{ transform: `rotate(${(1 - Math.min(1, chip)) * -120 + 6 * per(t, 2.7)}deg)` }}><path d="M14.6 4.2a4.6 4.6 0 0 0-5.3 6.2l-5.4 5.4a1.9 1.9 0 0 0 2.7 2.7l5.4-5.4a4.6 4.6 0 0 0 6.2-5.3l-2.7 2.7-2.4-.5-.5-2.4z" /></svg>
        <KText t={t} text={`installed by ${NAMES.fitter}`} at={E.chipIn + 0.05} out={out} color={GREY} stagger={0.06} dist={20} float={0} seed="ib" /></div>
      <div style={{ marginTop: 14, fontSize: 30, fontWeight: 500 }}><Typed t={t} at={E.chipIn + 0.4} text="fuelmybuild.com/theo/wrx-sti" cps={30} out={out} color={GREY} /></div>
    </div>
    {t >= E.tieTag - 0.45 ? <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 4 }} width={10} height={10}>
        <DrawPath d={`M ${P0.x} ${P0.y} Q ${C.x} ${C.y} ${P1.x} ${P1.y}`} p={ride} tail={taut} stroke={COTTON_EDGE} w={5} />
        <DrawPath d={`M ${P0.x} ${P0.y} Q ${C.x} ${C.y} ${P1.x} ${P1.y}`} p={ride} tail={taut} stroke={COTTON} w={3} />
      </svg>
      <div style={{ position: "absolute", left: head.x, top: head.y, zIndex: 5, opacity: 1 - eio(seg(t, out, out + 0.3)) }}>
        <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: COTTON, boxShadow: `0 0 0 3px ${COTTON_EDGE}`, transform: `scale(${Math.min(1.1, spr(t, E.tieTag + 0.15, 400, 14))})` }} />
        <Hanging ax={0} ay={0} ang={(ride < 1 ? -25 * (1 - ride) : 0) + swing(t, E.tieTag + 0.2, 12, 2.2, 6) + 2 * per(t, 2.7, 1)} loop={26} s={0.66}>
          <HangTag w={TW}><TagFace t={t} q="Check first" qAt={E.writeCheck} qSize={58} /></HangTag>
        </Hanging>
      </div>
    </> : null}
  </div>;
};

const LAB_EMPH = { "Car? Fitter? Date? Unknown.": { "Unknown.": wt(TL, 2, "nothing") }, "Still rattling": { "rattling": E.rattle2 }, "A place to start": { "start": wt(TL, 10, "worth") } };

export const SUP = ({ t, check }) => {
  // ---- sag (weight as time) and the lift back (one spring with a little overshoot) ----
  const liftF = tt => Math.min(1.08, spr(tt, E.lift, 110, 10));
  const lift = liftF(t);
  const sagRaw = 40 * sp(t, E.sag1, 120, 9) + 60 * sp(t, E.sag2, 120, 9) + 30 * sp(t, E.sag3, 120, 9);
  const sag = sagRaw * (1 - lift);
  const tilt = (4 * sp(t, E.sag2, 120, 9)) * (1 - lift);
  const rattle = [E.rattle1, E.sag1, E.sag2, E.sag3, E.rattle2].reduce((s, a) => s + (t > a && t < a + 0.7 ? Math.exp(-(t - a) * 6) * Math.sin((t - a) * 90) : 0), 0);
  // pendulum: the whole string sways from its anchor (loop-safe), kicked by every landing
  const sw = 1.0 * per(t, 3.375, 0.3) + [E.land2, E.land3, E.sag3, E.lift].reduce((s, a) => s + bump(t, a, 1.3, 2.4, 6), 0);
  // ---- vertical camera: drops to the pipe at 1.85, follows 45 % of the sag, home by 24.8, breathes ----
  const drop = eio(seg(t, E.camDrop, E.camDrop + 1.1)) * (1 - eio(seg(t, E.camHome, E.camHome + 1.0)));
  const camY = -110 * drop - 0.45 * sag + 5 * per(t, 6.75, 1.7);
  const camX = 4 * per(t, 9, 0.9);
  const Lr = HY - AYY + sag;
  const hx = AX + Lr * Math.sin(sw * Math.PI / 180) + rattle * 2 + camX, hy = AYY + Lr * Math.cos(sw * Math.PI / 180) + camY;
  const pr = ROT + tilt + rattle * 0.5 + sw;
  const P = i => { const o = rot(ATT[i], tilt + sw); return { x: hx + o.x, y: hy + o.y }; };
  const tagLag = -sw * 1.4 + 1.6 * per(t, 2.25, 0.6);
  // ---- tags ----
  const snap = t >= E.snap;
  const fallY = i => { const d = t - E.snap - i * 0.06; return d > 0 ? 0.5 * 4200 * d * d : 0; };
  const fallV = i => { const d = t - E.snap - i * 0.06; return d > 0 ? 4200 * d / 30 : 0; };
  const s2 = paperSticker(t, E.land2, "tag2"), s3 = paperSticker(t, E.land3, "tag3");
  // flying in from the right while Noor writes, hovering beside its tie point
  const fly = (at, land, i) => { const f = tt => Math.min(1.05, spr(tt, at - 0.35, 150, 15)); const p = f(t); const v = (f(t) - f(t - 1 / 30)) * 760;
    return { dx: (1 - p) * 760, dy: -70 - (1 - p) * 120 + 6 * Math.sin((t - at) * 6), ang: (1 - p) * 30 + 4 * Math.sin((t - at) * 4.5), blur: mblur(v, 0, 0.5) }; };
  const toC = eio(seg(t, E.toCenter, E.unfold)) * (1 - eio(seg(t, E.tagHome, E.tagHome + 0.55)));
  const unfold = eio(seg(t, E.unfold, E.cardIn)) * (1 - eio(seg(t, E.foldBack, E.foldBack + 0.5)));
  const cardOn = unfold > 0.5;
  const p1 = P(0);
  const t1x = lerp(p1.x, 540, toC), t1y = lerp(p1.y, 560, toC) - 60 * Math.sin(Math.PI * toC) * (toC < 1 ? 1 : 0), t1s = lerp(1, 1.5, toC);
  const sw1 = swing(t, E.swing, 8, 1.8, 5.5) + swing(t, E.sag1, 3) + swing(t, E.sag2, 4) + swing(t, E.sag3, 2) + swing(t, E.tagHome + 0.55, 6, 2.5, 6) + tagLag;
  // ---- HUD ----
  const outline = eo(seg(t, E.outline, E.outline + 0.7)), outlineOut = eio(seg(t, E.outlineOut, E.outlineOut + 0.5));
  const wrxF = tt => Math.min(1.05, spr(tt, E.wrxIn, 160, 14)) * (1 - eio(seg(tt, E.wrxOut, E.wrxOut + 0.5)));
  const wrx = wrxF(t), wrxV = (wrxF(t) - wrxF(t - 1 / 30)) * -160;
  const ret = Math.min(1.06, spr(t, E.returnChip, 260, 13)) * (1 - eio(seg(t, E.returnOut, E.returnOut + 0.4)));
  const hud = 1 - eo(seg(t, E.ctaIn - 0.1, E.ctaIn + 0.2)) + eo(seg(t, E.ctaOut, E.ctaOut + 0.25));
  const hudIn = t > E.ctaOut ? Math.min(1.05, spr(t, E.ctaOut, 260, 16)) : 1;
  const qPop = bump(t, E.outline + 0.7, 0.25);
  return <Canvas>
    <MBDefs />
    <String_ x1={AX + camX * 0.2} y1={AYY} x2={hx} y2={hy - 18} bow={4 + sag * 0.02 - sw * 6} />
    <div style={{ position: "absolute", left: hx - 14, top: hy - 30, width: 28, height: 22, borderRadius: 8, background: COTTON, boxShadow: `0 0 0 2px ${COTTON_EDGE}`, zIndex: 6, transform: `rotate(${sw}deg)` }} />
    <div style={{ position: "absolute", left: hx - EW * 0.56, top: hy - EW * 795 / 830 * 0.47, width: EW, zIndex: 5, transformOrigin: `${EW * 0.56}px ${EW * 795 / 830 * 0.47}px`, transform: `rotate(${pr}deg)`, filter: `drop-shadow(${-sw * 3}px 18px 16px rgba(0,0,0,.16))` }}>
      <Img src={staticFile(IMG.exhaust)} style={{ width: EW, display: "block" }} />
    </div>
    {/* snapped string ends whip up and fade */}
    {snap && t < E.snap + 0.5 ? [1, 2].map(i => { const p = P(i); const k = eo(seg(t, E.snap, E.snap + 0.4));
      return <svg key={i} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 7, opacity: 1 - k }} width={10} height={10}><path d={`M ${p.x} ${p.y} q ${12 * (i - 1.5)} ${-20 - 30 * k} ${-6} ${-40 - 30 * k}`} stroke={COTTON_EDGE} strokeWidth={4} fill="none" strokeLinecap="round" /></svg>; }) : null}
    {/* tag 3 */}
    {s3.visible ? (() => { const p = P(2); return <Hanging ax={p.x} ay={p.y} dy={snap ? fallY(1) : 0} ang={(snap ? (t - E.snap) * 60 : swing(t, E.land3 + 0.13, 9) + swing(t, E.sag3, 2) + tagLag) + s3.rot} s={s3.scale} z={8} dx={s3.jx} loopP={eo(seg(t, E.land3, E.land3 + 0.15))} blur={snap ? mblur(0, fallV(1), 0.5) : undefined}>
      <HangTag w={TW}><TagFace t={t} q="Who fitted it?" qAt={E.write3} a={["Some shop", "day 4"]} aAt={E.pencil3} /></HangTag></Hanging>; })() : null}
    {!s3.visible && t >= E.write3 - 0.35 ? (() => { const p = P(2), f = fly(E.write3, E.land3, 2); return <Hanging ax={p.x} ay={p.y} dx={f.dx} dy={f.dy} ang={f.ang} z={8} loopP={0} blur={f.blur}><HangTag w={TW}><TagFace t={t} q="Who fitted it?" qAt={E.write3} /></HangTag></Hanging>; })() : null}
    {/* tag 2 */}
    {s2.visible ? (() => { const p = P(1); return <Hanging ax={p.x} ay={p.y} dy={snap ? fallY(0) : 0} ang={(snap ? -(t - E.snap) * 50 : swing(t, E.land2 + 0.13, 9) + swing(t, E.sag2, 3) + tagLag * 0.9) + s2.rot} s={s2.scale} z={9} dx={s2.jx} loopP={eo(seg(t, E.land2, E.land2 + 0.15))} blur={snap ? mblur(0, fallV(0), 0.5) : undefined}>
      <HangTag w={TW}><TagFace t={t} q="Which car?" qAt={E.write2} a={["WRX", "day 2"]} aAt={E.pencil2} /></HangTag></Hanging>; })() : null}
    {!s2.visible && t >= E.write2 - 0.35 ? (() => { const p = P(1), f = fly(E.write2, E.land2, 1); return <Hanging ax={p.x} ay={p.y} dx={f.dx} dy={f.dy} ang={f.ang} z={9} loopP={0} blur={f.blur}><HangTag w={TW}><TagFace t={t} q="Which car?" qAt={E.write2} /></HangTag></Hanging>; })() : null}
    {/* tag 1: swings to centre and flips toward camera; the card flips in from its edge */}
    {!cardOn ? <div style={{ position: "absolute", left: 0, top: 0, zIndex: 40 }}>
      <Hanging ax={t1x} ay={t1y} ang={toC > 0 ? sw1 * (1 - toC) : sw1} s={t1s} z={40}>
        <div style={{ transform: unfold > 0 ? `perspective(1400px) rotateY(${unfold * 180}deg)` : undefined, transformOrigin: "50% 50%" }}>
          <HangTag w={TW} shade={unfold * 0.5}><TagFace t={t} q="Rattle. Fix?" qSize={54} /></HangTag></div>
      </Hanging></div> : null}
    {cardOn ? (() => { const u2 = clamp((unfold - 0.5) * 2); return <div style={{ position: "absolute", left: 75, top: 400, width: 930, height: 996, zIndex: 45, transform: `scale(${lerp(0.55, 1, u2) * (1 + bump(t, E.cardIn, 0.03, 6, 14))}) translateY(${3 * per(t, 3.375, 0.4)}px) rotate(${0.3 * per(t, 5.4, 1)}deg)`, transformOrigin: "50% 40%" }}>
      <div style={{ position: "absolute", inset: 0, transform: `perspective(2400px) rotateY(${-(1 - u2) * 90}deg)` }}><CardFace t={t} /></div></div>; })() : null}
    {/* HUD: ticket chips (day value-swaps) + the car slot */}
    <div style={{ position: "absolute", left: 60, top: 250, zIndex: 60, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start", opacity: clamp(hud), transform: `translateY(${(1 - hudIn) * 30 + 2 * per(t, 4.5, 0.4)}px) scale(${0.92 + 0.08 * hudIn})`, transformOrigin: "0 0" }}>
      <div style={{ display: "flex", gap: 12 }}><Chip><span style={{ width: 14, height: 14, borderRadius: 7, background: INK, transform: `scale(${1 + 0.15 * per(t, 1.35)})` }} />Ticket opened · Day <DaySwap t={t} /></Chip>
        {ret > 0.001 ? <Chip bg={RED} color="#fff" style={{ opacity: clamp(ret), transform: `translateY(${(1 - Math.min(ret, 1.06)) * -40}px) scale(${0.8 + 0.2 * Math.min(ret, 1.06) + bump(t, wt(TL, 7, "return"), 0.1)})` }}>
          <KText t={t} text="Return?" at={E.returnChip + 0.05} unit="char" color="#fff" dist={18} float={0} seed="ret" /></Chip> : null}</div>
      <Chip color={GREY} style={{ background: SOFT }}>{NAMES.exhaustBrand} · Order 20418 · $1,290</Chip>
    </div>
    {outline > 0 && outlineOut < 1 ? <div style={{ position: "absolute", left: 640, top: 1180, width: 380, height: 200, zIndex: 20, opacity: 1 - outlineOut }}>
      <svg width="380" height="200" viewBox="0 0 380 200" style={{ position: "absolute", inset: 0, opacity: 1 - clamp(wrx) }}>
        <DrawPath d="M30 150 Q28 118 60 108 L120 96 Q150 60 200 56 L250 56 Q290 60 318 96 L346 104 Q362 112 358 150 Z" p={outline} stroke="#AEAEB2" w={4} dash="10 9" />
        <DrawPath d="M100 126 a26 26 0 1 0 0.1 0" p={eo(seg(t, E.outline + 0.35, E.outline + 0.75))} stroke="#AEAEB2" w={4} dash="10 9" />
        <DrawPath d="M292 126 a26 26 0 1 0 0.1 0" p={eo(seg(t, E.outline + 0.42, E.outline + 0.82))} stroke="#AEAEB2" w={4} dash="10 9" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 64, fontWeight: 600, color: "#AEAEB2", opacity: (1 - clamp(wrx)) * clamp((t - E.outline - 0.6) / 0.15), transform: `scale(${1 + qPop}) translateY(${3 * per(t, 2.7)}px)` }}>?</div>
      {wrx > 0.001 ? <div style={{ position: "absolute", left: 0, top: 0, filter: mblur(wrxV, 0, 0.5) }}><Cut img={IMG.wrx} x={10 + (1 - wrx) * 160} y={34 - 3 * bump(t, E.wrxIn + 0.35, 1, 6, 18)} w={360} op={clamp(wrx)} /></div> : null}
    </div> : null}
    {TL.labels.map((L, i) => { if (t < L.a - 0.05 || t > L.b + 0.7) return null;
      const jit = L.text === "Still rattling" && t > E.rattle2 ? 5 * Math.exp(-(t - E.rattle2) * 4) * Math.sin((t - E.rattle2) * 70) : 0;
      return <div key={i} style={{ position: "absolute", right: 60, top: i === 0 ? 252 : 336, zIndex: 70, width: 440, textAlign: "right", transform: `translateX(${jit}px)`, willChange: "transform" }}>
        <div style={{ fontSize: 54, fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.1, fontVariationSettings: '"opsz" 32' }}><KText t={t} text={L.text} at={L.a} out={L.b} emph={LAB_EMPH[L.text] || {}} stagger={0.1} dist={40} from="up" seed={L.text} /></div>
      </div>; })}
    <SupCTA t={t} />
    <Captions t={t} vo={TL.vo} style="underline" />
    {check ? <Guides /> : null}
  </Canvas>;
};
const SupCTA = ({ t }) => {
  const a = E.ctaIn, out = E.ctaOut - 0.2; if (t < a - 0.05 || t > out + 0.7) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 250, zIndex: 80, textAlign: "center", willChange: "transform" }}>
    <div style={{ fontSize: 108, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.02, fontVariationSettings: '"opsz" 32' }}>
      <KText t={t} text="Ask for the build." at={a} out={out} times={[wt(TL, 12, "ask"), wt(TL, 12, "for"), wt(TL, 12, "the"), wt(TL, 12, "build")]} emph={{ "build.": wt(TL, 12, "build") + 0.05 }} dist={70} seed="scta" /></div>
    <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-.025em", marginTop: 14, minHeight: 72 }}><Typed t={t} at={wt(TL, 12, "fuelmybuild") - 0.05} text="fuelmybuild.com" cps={24} out={out} /></div>
    <div style={{ fontSize: 34, fontWeight: 500, color: GREY, marginTop: 10 }}><KText t={t} text="Illustrative story" at={a + 0.5} out={out} color={GREY} dist={20} stagger={0.08} float={0} seed="sil" /></div>
  </div>;
};
