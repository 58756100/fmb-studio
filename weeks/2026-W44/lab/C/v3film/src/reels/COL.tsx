// @ts-nocheck
// C3-COL "Loser buys dinner" (collectors). One continuous camera along a giant year ruler; no cuts.
// remocn (all new to the visual bank): stage (keyframed camera), speed-lines (flag plants),
// mask-reveal-up (card lines + beat labels rising out of the tape), caption-rise (subtitles).
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, expo, sp, Cut, Canvas, Guides, CTA } from "../lib/core";
import { stagePose, StageWorld, speedDrop, Streaks, maskRevealUp, MaskLines, Captions } from "../lib/remocn";
import { IMG, NAMES, Photo, CheckPresenter } from "../assets";
import TL from "../timeline/C3-COL.json";

const E = TL.ev;
export const DUR = TL.duration;
// ---- world geometry (world px; the camera maps world -> screen) ----
const X = yr => 400 + (yr - 2016) * 250;      // 250 world px per year, 2016..2024
const TAPE_T = 1100, TAPE_H = 150, TAPE_C = TAPE_T + TAPE_H / 2;
const CREAM = "#F2EBDD";
const ZZ = 1.15, YZ = TAPE_C - 70 / 1.15; // zoomed shots keep the tape low so the Evo clears the label band
const HOME = { x: X(2019), y: TAPE_C, zoom: 0.9 };
// card (screen space) sits with its bottom on the tape top while the camera holds at CARD_CAM
const CARD_CAM = { x: X(2019), y: TAPE_C - 55, zoom: 1.0 }; // tape top at screen 1140, card 280-1140
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
  { at: E.holdEnd, ...CARD_CAM, zoom: 1.02, ease: p => p },          // 2 % drift only during the hold
  { at: E.cardShrink + 0.7, x: X(2019), y: TAPE_C, zoom: 0.86 },
  { at: E.camHome, x: X(2019), y: TAPE_C, zoom: 0.86 },
  { at: E.camHome + 1.2, ...HOME, ease: eio },
];
const AY = 1160; // screen y of the camera target

// ---- pieces ----
const Ruler = ({ t, tint, split }) => {
  const ticks = [];
  for (let q = 0; q <= 32; q++) {
    const yr = 2016 + q / 4, x = X(yr), major = q % 4 === 0;
    if (major && yr === 2019 && split > 0) continue; // drawn as two halves below
    ticks.push(<div key={q} style={{ position: "absolute", left: x - (major ? 2 : 1.5), top: TAPE_T, width: major ? 4 : 3, height: major ? 62 : (q % 2 ? 22 : 34), background: "#6B5E45", opacity: major ? .9 : .55 }} />);
    if (major) ticks.push(<div key={"n" + q} style={{ position: "absolute", left: x - 80, width: 160, top: TAPE_T + 70, textAlign: "center", fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", color: "#5B4F39", fontVariantNumeric: "tabular-nums" }}>{yr}</div>);
  }
  const gap = 70 * split;
  return <div style={{ position: "absolute", left: 0, top: 0 }}>
    {/* tape body */}
    <div style={{ position: "absolute", left: X(2015.4), width: X(2024.6) - X(2015.4), top: TAPE_T, height: TAPE_H, background: CREAM, borderRadius: 10, boxShadow: "0 1px 0 rgba(0,0,0,.06), 0 10px 22px -16px rgba(60,40,10,.45)" }} />
    {/* the argument: four years of empty tape between the flags, tinted red */}
    {tint > 0 ? <div style={{ position: "absolute", left: X(2021) - (X(2021) - X(2017)) * tint, width: (X(2021) - X(2017)) * tint, top: TAPE_T, height: TAPE_H, background: "rgba(244,48,52,.18)" }} /> : null}
    {ticks}
    {split > 0 ? <>
      {/* the 2019 tick splits; the tape opens along it with soft light inside */}
      <div style={{ position: "absolute", left: X(2019) - gap / 2, width: gap, top: TAPE_T, height: TAPE_H, background: "linear-gradient(180deg,#FFFFFF,#FFFDF8 60%,#F7F0E2)", boxShadow: "inset 0 0 12px rgba(120,90,40,.18)" }} />
      <div style={{ position: "absolute", left: X(2019) - gap / 2 - 4, top: TAPE_T, width: 4, height: 62, background: "#6B5E45" }} />
      <div style={{ position: "absolute", left: X(2019) + gap / 2, top: TAPE_T, width: 4, height: 62, background: "#6B5E45" }} />
      <div style={{ position: "absolute", left: X(2019) - 80, width: 160, top: TAPE_T + 70, textAlign: "center", fontSize: 50, fontWeight: 600, color: "#5B4F39", opacity: 1 - split }}>2019</div>
    </> : null}
  </div>;
};

// pennant flag on a grey pin; dir = +1 points right (Dev), -1 points left (Marisol)
const Flag = ({ t, x, dir, name, year, lift, plantAt, lean, twitch }) => {
  const d = plantAt != null ? speedDrop(t, plantAt, 0.2, 34) : { dy: 0, sx: 1, sy: 1 };
  const up = plantAt != null && t < plantAt ? -34 * eo(seg(t, lift, lift + 0.22)) : d.dy;
  const tw = twitch != null && t > twitch && t < twitch + 2 ? Math.exp(-(t - twitch) * 7) * Math.sin((t - twitch) * 38) * 3 : 0;
  const PIN = 230, PW = 252, PH = 132;
  return <div style={{ position: "absolute", left: x, top: TAPE_T, width: 0, height: 0 }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translateY(${up}px) rotate(${lean * dir + tw}deg) scale(${d.sx},${d.sy})` }}>
      <div style={{ position: "absolute", left: -3, top: -PIN, width: 6, height: PIN + 14, borderRadius: 3, background: "#8E8E93" }} />
      <div style={{ position: "absolute", top: -PIN - 4, left: dir > 0 ? 3 : -PW - 3, width: PW, height: PH, background: RED, color: "#fff",
        clipPath: dir > 0 ? "polygon(0 0,100% 0,90% 50%,100% 100%,0 100%)" : "polygon(0 0,100% 0,100% 100%,0 100%,10% 50%)",
        padding: dir > 0 ? "14px 0 0 24px" : "14px 24px 0 0", textAlign: dir > 0 ? "left" : "right", borderRadius: 6 }}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1 }}>{name}</div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.05, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{year}</div>
      </div>
    </div>
    {plantAt != null ? <Streaks t={t} at={plantAt} dur={0.2} x={dir * 40} y={-PIN - 8} w={90} len={110} seed={name} /> : null}
  </div>;
};

const Card = ({ t, ty, clipB, s = 1, ox, oy }) => {
  const W = 930, Hh = 860;
  const L = (i) => maskRevealUp(t, E.cardLines, i, E.fold + 0.05);
  const ph = eo(seg(t, E.cardPhoto, E.cardPhoto + 0.4)), ch = eo(seg(t, E.cardChip, E.cardChip + 0.3));
  return <div style={{ position: "absolute", left: ox - W / 2, top: oy - Hh, width: W, height: Hh, zIndex: 40, transformOrigin: "50% 100%", transform: `translateY(${ty}px) scale(${s})`, clipPath: `inset(0 -40px ${clipB}px -40px)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 18px 40px -26px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 34, right: 34, top: 30 }}>
      <div style={{ overflow: "hidden" }}><div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.035em", lineHeight: 1.18, ...L(0) }}>Intake · {NAMES.intakeBrand}</div></div>
      <div style={{ overflow: "hidden" }}><div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, color: INK, ...L(1), display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round"><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>Jun 14, 2019</div></div>
      <div style={{ marginTop: 20, opacity: ph, transform: `translateY(${(1 - ph) * 24}px)` }}>
        <Photo path={IMG.evoIntakePhoto} name="c3-evo-intake-install.jpg" desc="Blue Evo engine bay, red cone intake freshly fitted, fender cover, ratchet" w={862} h={484} r={20} />
      </div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: ch, transform: `scale(${0.96 + 0.04 * ch})`, transformOrigin: "0 50%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 24px 0 10px", borderRadius: 32, background: SOFT, fontSize: 40, fontWeight: 600, color: GREY }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, overflow: "hidden", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}><Img src={staticFile(IMG.evo)} style={{ width: 110, marginLeft: -32, marginTop: 6 }} /></div>
          logged by Marisol</div>
      </div>
      <div style={{ marginTop: 16, fontSize: 30, fontWeight: 500, color: GREY, opacity: ch }}>fuelmybuild.com/marisol/evo-vi</div>
    </div>
  </div>;
};

const Label = ({ t, L }) => {
  if (t < L.a - 0.05 || t > L.b + 0.6) return null;
  if (L.kind === "chip") {
    const p = L.loop ? eo(seg(t, L.a, L.a + 0.25)) : 1, q = L.loop ? 0 : eo(seg(t, L.b - 0.05, L.b + 0.25));
    return <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 60, opacity: L.loop && t >= 26.6 ? 1 : p * (1 - q) }}>
      <div className="glass" style={{ height: 92, padding: "0 38px", borderRadius: 46, display: "flex", alignItems: "center", gap: 16, background: "#fff", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 10px 26px -16px rgba(0,0,0,.3)" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round"><path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v5M10.5 3v5M3.5 3v5a3.5 3.5 0 0 0 7 0V3M17 21V3c2.2 1.2 3.5 3.6 3.5 7v4H17" /></svg>{L.text}</div>
    </div>;
  }
  return <div style={{ position: "absolute", left: 60, right: 60, top: 296, zIndex: 60, textAlign: "center", overflow: "hidden", paddingBottom: 8 }}>
    <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.08, fontVariationSettings: '"opsz" 32', ...maskRevealUp(t, L.a, 0, L.b) }}>{L.text}</div>
  </div>;
};

export const COL = ({ t, check }) => {
  const pose = stagePose(t, CAM);
  // ruler state
  const tint = t < E.tintFrom ? 0 : t < E.tintDrain ? eio(seg(t, E.tintFrom, E.tintTo)) : 1 - eo(seg(t, E.tintDrain, E.tintDrain + 0.8));
  const split = t < E.tickSplit ? 0 : t < E.fold ? eo(seg(t, E.tickSplit, E.tickSplit + 0.6)) : 1 - eio(seg(t, E.tickClose - 0.15, E.tickClose + 0.25));
  // check presenter
  const slap = t < E.checkLift ? 0 : t < E.checkSlap ? eo(seg(t, E.checkLift, E.checkSlap - 0.1)) * (1 - ei2(seg(t, E.checkSlap - 0.1, E.checkSlap))) : 0;
  const chSquash = t > E.checkSlap ? Math.exp(-(t - E.checkSlap) * 16) * 0.12 : 0;
  let chX = X(2019.5);
  chX += 40 * eo(seg(t, E.checkNudge, E.checkNudge + 0.45));
  chX = lerp(chX, X(2019), eio(seg(t, E.checkCenter - 0.35, E.checkCenter + 0.25)));
  chX = lerp(chX, X(2019.5), eio(seg(t, E.checkBack, E.checkBack + 0.6)));
  // flags
  const lean = t < E.flagsBack ? 10 * eo(seg(t, E.lean, E.lean + 0.5)) : (t > E.flagsBack + 1.5 ? 0 : 10 * (1 - sp(t, E.flagsBack, 200, 14)));
  // intake lift + leader line
  const lift = 20 * (eo(seg(t, E.intakeLift, E.intakeLift + 0.35)) - eio(seg(t, E.camMarisol, E.camMarisol + 0.4)));
  const lead = eo(seg(t, E.leader, E.leader + 0.55)) * (1 - seg(t, E.camMarisol, E.camMarisol + 0.3));
  const q = t < E.tickSplit ? 1 - seg(t, E.tickSplit - 0.2, E.tickSplit) : eo(seg(t, E.qBack, E.qBack + 0.4));
  // card motion (screen space, on the 2019 tick)
  const cardRise = eo(seg(t, E.cardRise, E.cardRise + 0.62));
  const shrink = eio(seg(t, E.cardShrink, E.cardShrink + 0.7));
  const fold = eio(seg(t, E.fold, E.fold + 0.55));
  const showCard = t >= E.cardRise && t < E.fold + 0.6;
  const tickScreenX = 540 + (X(2019) - pose.x) * pose.zoom, tapeTopScreen = AY + (TAPE_T - pose.y) * pose.zoom;
  const cardS = lerp(1, 0.3, shrink);
  const gap = 80 * shrink * pose.zoom; // the small card floats above the 2019 tick on a grey pin
  const cardTy = (1 - cardRise) * 860 + fold * (860 * cardS + gap);
  // measure lines (world, under the tape)
  const meas = eo(seg(t, E.measure, E.measure + 0.5)) * (1 - seg(t, E.fold, E.fold + 0.25));
  return <Canvas>
    <StageWorld pose={pose} ax={540} ay={AY}>
      <Cut img={IMG.evo} x={X(2019) - 330} y={506} w={740} z={2} />
      <div style={{ position: "absolute", left: 590, top: 690 - lift, width: 196, zIndex: 3 }}>
        <Cut img={IMG.intake} x={0} y={0} w={196} />
      </div>
      {lead > 0 ? <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 4 }} width={10} height={10}>
        <path d={`M ${740} ${862 - lift} Q ${880} ${985} ${X(2019) - 66} ${975}`} fill="none" stroke={GREY} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lead} />
      </svg> : null}
      {q > 0 ? <div style={{ position: "absolute", left: X(2019) - 60, width: 120, top: 900, textAlign: "center", fontSize: 120, fontWeight: 600, color: "#AEAEB2", opacity: q, lineHeight: 1, zIndex: 3 }}>?</div> : null}
      <Ruler t={t} tint={tint} split={split} />
      <div style={{ position: "absolute", left: chX - 95, top: TAPE_T + TAPE_H - 38 - 90 * slap, zIndex: 6, transformOrigin: "50% 100%", transform: `rotate(${-6 + 4 * slap}deg) scale(${1 + chSquash},${1 - chSquash})` }}>
        <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -8, height: 18, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.28),rgba(0,0,0,0))", filter: "blur(5px)", opacity: 1 - slap * 0.6 }} />
        <CheckPresenter w={190} />
      </div>
      <Flag t={t} x={X(2017)} dir={1} name="Dev" year="2017" lift={E.flagDLift} plantAt={E.flagDPlant} lean={lean} twitch={E.flagTwitch} />
      <Flag t={t} x={X(2021)} dir={-1} name="Marisol" year="2021" lift={E.flagMLift} plantAt={E.flagMPlant} lean={lean} twitch={E.flagTwitch + 0.06} />
      {meas > 0 ? [[2017, 2019], [2019, 2021]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: X(a) + 14, width: X(b) - X(a) - 28, top: TAPE_T - 78, height: 60, zIndex: 5, opacity: meas }}>
        <div style={{ position: "absolute", left: i ? 0 : `${(1 - meas) * 100}%`, right: i ? `${(1 - meas) * 100}%` : 0, top: 28, height: 4, background: INK, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 0, top: 12, width: 4, height: 36, background: INK }} /><div style={{ position: "absolute", right: 0, top: 12, width: 4, height: 36, background: INK }} />
        <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", padding: "0 16px", background: "#fff", fontSize: 46, fontWeight: 600, letterSpacing: "-.02em", lineHeight: "60px", whiteSpace: "nowrap" }}>2 years</div>
      </div>) : null}
    </StageWorld>
    {showCard ? <Card t={t} ty={cardTy} clipB={Math.max(0, cardTy - gap) / cardS} s={cardS} ox={tickScreenX} oy={tapeTopScreen - 2 - gap} /> : null}
    {showCard && shrink > 0 ? <div style={{ position: "absolute", left: tickScreenX - 2, top: tapeTopScreen - gap, width: 4, height: gap, background: "#8E8E93", zIndex: 39, opacity: 1 - fold }} /> : null}
    {TL.labels.map((L, i) => <Label key={i} t={t} L={L} />)}
    <CTA t={t} a={E.ctaIn} out={E.ctaOut} head="Date it once." top={246} />
    <Captions t={t} vo={TL.vo} style="rise" />
    {check ? <Guides /> : null}
  </Canvas>;
};
const ei2 = p => p * p;
