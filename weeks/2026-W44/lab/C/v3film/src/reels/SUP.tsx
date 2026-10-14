// @ts-nocheck
// C3-SUP "Rattle. Fix?" (parts suppliers). Time as weight: manila tags pile onto an exhaust hanging from one
// off-white cotton string; the pipe sags with each slow answer. The first tag unfolds into the log card.
// Vertical camera only. remocn (all new to the visual bank): paper-sticker (tag landings), caption-handwrite
// ink sweep (tag writing), soft-blur-in (card fields, beat labels), caption-underline (subtitles).
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, LINE, clamp, lerp, seg, eo, eio, sp, Cut, Canvas, Guides, CTA } from "../lib/core";
import { paperSticker, InkWrite, SoftBlurIn, Captions } from "../lib/remocn";
import { IMG, NAMES, HANGER, Photo, HangTag, TAG_AR } from "../assets";
import TL from "../timeline/C3-SUP.json";

const E = TL.ev;
export const DUR = TL.duration;
const HX = 540, HY = 760;          // hang point at frame 0 (screen)
const ROT = 40;                    // turns the 3/4 exhaust cutout so the pipe reads level
const EW = 700;                    // exhaust cutout width
const TW = 260, TH = TW * TAG_AR;  // tag size
const COTTON = "#E6DED0", COTTON_EDGE = "#C9BFAE";
// tag tie points, offsets from the hang point with the pipe level
const ATT = [{ x: -250, y: 62 }, { x: 20, y: 70 }, { x: 270, y: 40 }];
const INK_C = "#1D1D1F", PENCIL = "#8E8E93";

const rot = (p, deg) => { const r = deg * Math.PI / 180; return { x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) }; };
const swing = (t, at, amp = 7, k = 3.2, w = 7) => t > at ? amp * Math.exp(-(t - at) * k) * Math.sin((t - at) * w) : 0;

const TagFace = ({ t, q, qAt, a, aAt, qSize = 50 }) => <div style={{ display: "flex", flexDirection: "column", gap: 12, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.08 }}>
  <div style={{ fontSize: qSize }}>{qAt != null ? <InkWrite t={t} at={qAt} text={q} dur={0.55} seed={q} color={INK_C} /> : q}</div>
  {a ? a.map((ln, i) => <div key={i} style={{ fontSize: 44, fontWeight: 500, marginTop: i ? -6 : 0 }}><InkWrite t={t} at={aAt + i * 0.3} text={ln} dur={0.35} seed={ln} color={PENCIL} /></div>) : null}
</div>;

const String_ = ({ x1, y1, x2, y2, sag = 6 }) => {
  const mx = (x1 + x2) / 2 + sag, my = (y1 + y2) / 2;
  return <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: 3 }} width={10} height={10}>
    <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={COTTON_EDGE} strokeWidth={5} strokeLinecap="round" />
    <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={COTTON} strokeWidth={3} strokeLinecap="round" />
  </svg>;
};

// one tag hanging from (ax, ay) by a short cotton loop, swinging by `ang` degrees
const Hanging = ({ ax, ay, ang = 0, s = 1, op = 1, children, z = 10, loop = 34, dx = 0, dy = 0 }) => (
  <div style={{ position: "absolute", left: ax, top: ay, width: 0, height: 0, zIndex: z, opacity: op, transform: `translate(${dx}px,${dy}px) rotate(${ang}deg) scale(${s})`, transformOrigin: "0 0" }}>
    <svg style={{ position: "absolute", left: -12, top: 0, overflow: "visible" }} width={24} height={loop + 30}><path d={`M 12 0 L 12 ${loop + 22}`} stroke={COTTON_EDGE} strokeWidth={5} /><path d={`M 12 0 L 12 ${loop + 22}`} stroke={COTTON} strokeWidth={3} /></svg>
    <div style={{ position: "absolute", left: -TW / 2, top: loop }}>{children}</div>
  </div>
);

const Chip = ({ children, bg = "#fff", color = INK, style = {} }) => <div style={{ height: 72, padding: "0 26px", borderRadius: 36, background: bg, color, display: "inline-flex", alignItems: "center", gap: 12, fontSize: 40, fontWeight: 600, letterSpacing: "-.015em", whiteSpace: "nowrap", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 8px 22px -16px rgba(0,0,0,.35)", ...style }}>{children}</div>;

const CardFace = ({ t }) => {
  const showTie = t >= E.tieTag;
  const tieDrop = eo(seg(t, E.tieTag, E.tieTag + 0.3));
  const hx = 34 + 862 * HANGER.x, hy = 34 + 78 + 60 + 20 + 646 * HANGER.y;
  return <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(255,255,255,.96)", boxShadow: "0 0 0 1px rgba(0,0,0,.07), 0 18px 40px -26px rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", left: 34, right: 34, top: 30 }}>
      <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.035em", lineHeight: 1.2 }}><SoftBlurIn t={t} at={E.cardIn} text={`Exhaust · ${NAMES.exhaustBrand}`} /></div>
      <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round" style={{ opacity: eo(seg(t, E.cardIn + 0.1, E.cardIn + 0.4)) }}><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>
        <SoftBlurIn t={t} at={E.cardIn + 0.12} text="Jul 22, 2026" /></div>
      <div style={{ marginTop: 20, opacity: eo(seg(t, E.cardIn, E.cardIn + 0.35)) }}>
        <Photo path={IMG.wrxUndersidePhoto} name="c3-wrx-exhaust-underside.jpg" desc="From under a blue WRX on a lift: stainless cat-back, rubber hangers, rear hanger right third" w={862} h={646} r={20} />
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 24px 0 12px", borderRadius: 32, background: SOFT, fontSize: 40, fontWeight: 600, color: GREY, width: "fit-content", opacity: eo(seg(t, E.chipIn, E.chipIn + 0.3)), transform: `scale(${0.95 + 0.05 * eo(seg(t, E.chipIn, E.chipIn + 0.3))})`, transformOrigin: "0 50%" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.9" strokeLinecap="round"><path d="M14.6 4.2a4.6 4.6 0 0 0-5.3 6.2l-5.4 5.4a1.9 1.9 0 0 0 2.7 2.7l5.4-5.4a4.6 4.6 0 0 0 6.2-5.3l-2.7 2.7-2.4-.5-.5-2.4z" /></svg>
        installed by {NAMES.fitter}</div>
      <div style={{ marginTop: 14, fontSize: 30, fontWeight: 500, color: GREY, opacity: eo(seg(t, E.cardIn + 0.3, E.cardIn + 0.6)) }}>fuelmybuild.com/theo/wrx-sti</div>
    </div>
    {showTie ? <div style={{ position: "absolute", left: hx, top: hy - 70 * (1 - tieDrop), opacity: tieDrop, zIndex: 5 }}>
      <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: COTTON, boxShadow: `0 0 0 3px ${COTTON_EDGE}` }} />
      <Hanging ax={0} ay={0} ang={swing(t, E.tieTag + 0.3, 9, 2.6, 6)} loop={26} s={0.66}>
        <HangTag w={TW} badge={false}><TagFace t={t} q="Check first" qAt={E.writeCheck} qSize={58} /></HangTag>
      </Hanging>
    </div> : null}
  </div>;
};

export const SUP = ({ t, check }) => {
  // ---- sag (weight as time) and the lift back ----
  const lift = eio(seg(t, E.lift, E.lift + 0.8));
  const sagRaw = 40 * sp(t, E.sag1, 120, 9) + 60 * sp(t, E.sag2, 120, 9) + 30 * sp(t, E.sag3, 120, 9);
  const sag = sagRaw * (1 - lift);
  const tilt = (4 * sp(t, E.sag2, 120, 9)) * (1 - lift);
  const rattle = [E.rattle1, E.sag1, E.sag2, E.sag3, E.rattle2].reduce((s, a) => s + (t > a && t < a + 0.7 ? Math.exp(-(t - a) * 6) * Math.sin((t - a) * 90) : 0), 0);
  // ---- vertical camera: drops to the pipe at 1.85, follows 60 % of the sag, home by 24.8 ----
  const drop = eio(seg(t, E.camDrop, E.camDrop + 1.1)) * (1 - eio(seg(t, E.camHome, E.camHome + 1.0)));
  const camY = -110 * drop - 0.45 * sag;
  const hy = HY + sag + camY, hx = HX + rattle * 2;
  const pr = ROT + tilt + rattle * 0.5;
  const P = i => { const o = rot(ATT[i], tilt); return { x: hx + o.x, y: hy + o.y }; };
  // ---- tags ----
  const snap = t >= E.snap;
  const fallY = i => { const d = t - E.snap - i * 0.06; return d > 0 ? 0.5 * 4200 * d * d : 0; };
  const s2 = paperSticker(t, E.land2, "tag2"), s3 = paperSticker(t, E.land3, "tag3");
  // tag 1: swings to center and unfolds into the card at the turn; folds back at 22.0
  const toC = eio(seg(t, E.toCenter, E.unfold)) * (1 - eio(seg(t, E.tagHome, E.tagHome + 0.55)));
  const unfold = eio(seg(t, E.unfold, E.cardIn)) * (1 - eio(seg(t, E.foldBack, E.foldBack + 0.5)));
  const cardOn = unfold > 0.5;
  const p1 = P(0);
  const t1x = lerp(p1.x, 540, toC), t1y = lerp(p1.y, 560, toC), t1s = lerp(1, 1.5, toC);
  const sw1 = swing(t, E.swing, 8, 1.8, 5.5) + swing(t, E.sag1, 3) + swing(t, E.sag2, 4) + swing(t, E.sag3, 2);
  // ---- HUD ----
  const outline = eo(seg(t, E.outline, E.outline + 0.5)) * (1 - eo(seg(t, E.outlineOut, E.outlineOut + 0.5)));
  const wrx = eo(seg(t, E.wrxIn, E.wrxIn + 0.5)) * (1 - eio(seg(t, E.wrxOut, E.wrxOut + 0.5)));
  const ret = eo(seg(t, E.returnChip, E.returnChip + 0.35)) * (1 - eio(seg(t, E.returnOut, E.returnOut + 0.4)));
  const retDrop = t > E.returnChip ? Math.exp(-(t - E.returnChip) * 8) * Math.sin((t - E.returnChip) * 24) * 8 : 0;
  const hud = 1 - eo(seg(t, E.ctaIn - 0.1, E.ctaIn + 0.2)) + eo(seg(t, E.ctaOut, E.ctaOut + 0.25)); // chips step aside for the CTA band
  return <Canvas>
    {/* string from the top edge to the hang point */}
    <String_ x1={HX} y1={-40} x2={hx} y2={hy - 18} sag={4 + sag * 0.02} />
    <div style={{ position: "absolute", left: hx - 14, top: hy - 30, width: 28, height: 22, borderRadius: 8, background: COTTON, boxShadow: `0 0 0 2px ${COTTON_EDGE}`, zIndex: 6 }} />
    {/* the exhaust, hanging */}
    <div style={{ position: "absolute", left: hx - EW * 0.56, top: hy - EW * 795 / 830 * 0.47, width: EW, zIndex: 5, transformOrigin: `${EW * 0.56}px ${EW * 795 / 830 * 0.47}px`, transform: `rotate(${pr}deg)` }}>
      <Img src={staticFile(IMG.exhaust)} style={{ width: EW, display: "block" }} />
    </div>
    {/* tags 3, 2 then 1 on top */}
    {s3.visible ? (() => { const p = P(2); return <Hanging ax={p.x} ay={p.y} dy={snap ? fallY(1) : 0} ang={(snap ? (t - E.snap) * 60 : swing(t, E.land3 + 0.13, 7) + swing(t, E.sag3, 2)) + s3.rot} s={s3.scale} z={8} dx={s3.jx}>
      <HangTag w={TW}><TagFace t={t} q="Who fitted it?" qAt={E.write3} a={["Some shop", "day 4"]} aAt={E.pencil3} /></HangTag></Hanging>; })() : null}
    {!s3.visible && t >= E.write3 ? (() => { const p = P(2); return <Hanging ax={p.x} ay={p.y - 70} op={0.98} z={8}><HangTag w={TW}><TagFace t={t} q="Who fitted it?" qAt={E.write3} /></HangTag></Hanging>; })() : null}
    {s2.visible ? (() => { const p = P(1); return <Hanging ax={p.x} ay={p.y} dy={snap ? fallY(0) : 0} ang={(snap ? -(t - E.snap) * 50 : swing(t, E.land2 + 0.13, 7) + swing(t, E.sag2, 3)) + s2.rot} s={s2.scale} z={9} dx={s2.jx}>
      <HangTag w={TW}><TagFace t={t} q="Which car?" qAt={E.write2} a={["WRX", "day 2"]} aAt={E.pencil2} /></HangTag></Hanging>; })() : null}
    {!s2.visible && t >= E.write2 ? (() => { const p = P(1); return <Hanging ax={p.x} ay={p.y - 70} op={0.98} z={9}><HangTag w={TW}><TagFace t={t} q="Which car?" qAt={E.write2} /></HangTag></Hanging>; })() : null}
    {!cardOn ? <div style={{ position: "absolute", left: 0, top: 0, zIndex: 40, transform: unfold > 0 ? `translate(${t1x}px,${t1y}px) scaleX(${1 - unfold * 2}) translate(${-t1x}px,${-t1y}px)` : undefined, transformOrigin: "0 0" }}>
      <Hanging ax={t1x} ay={t1y} ang={toC > 0 ? sw1 * (1 - toC) : sw1} s={t1s} z={40}>
        <HangTag w={TW}><TagFace t={t} q="Rattle. Fix?" qSize={54} /></HangTag>
      </Hanging></div> : null}
    {/* the unfolded tag = the log card, opening from its centre fold */}
    {cardOn ? <div style={{ position: "absolute", left: 75, top: 400, width: 930, height: 996, zIndex: 45, transform: `scaleX(${(unfold - 0.5) * 2}) scale(${lerp(0.55, 1, (unfold - 0.5) * 2)})`, transformOrigin: "50% 40%" }}><CardFace t={t} /></div> : null}
    {/* HUD: ticket chips + the car slot (top right) */}
    <div style={{ position: "absolute", left: 60, top: 250, zIndex: 60, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start", opacity: clamp(hud) }}>
      <div style={{ display: "flex", gap: 12 }}><Chip><span style={{ width: 14, height: 14, borderRadius: 7, background: INK }} />Ticket opened · Day 1</Chip>
        {ret > 0 ? <Chip bg={RED} color="#fff" style={{ opacity: ret, transform: `translateY(${(1 - ret) * -30 + retDrop}px)` }}>Return?</Chip> : null}</div>
      <Chip color={GREY} style={{ background: SOFT }}>{NAMES.exhaustBrand} · Order 20418 · $1,290</Chip>
    </div>
    {outline > 0 ? <div style={{ position: "absolute", left: 640, top: 1180, width: 380, height: 200, zIndex: 20, opacity: outline }}>
      <svg width="380" height="200" viewBox="0 0 380 200" style={{ position: "absolute", inset: 0, opacity: 1 - wrx }}><path d="M30 150 Q28 118 60 108 L120 96 Q150 60 200 56 L250 56 Q290 60 318 96 L346 104 Q362 112 358 150 Z" fill="none" stroke="#AEAEB2" strokeWidth="4" strokeDasharray="10 9" strokeLinejoin="round" /><circle cx="100" cy="152" r="26" fill="#fff" stroke="#AEAEB2" strokeWidth="4" strokeDasharray="10 9" /><circle cx="292" cy="152" r="26" fill="#fff" stroke="#AEAEB2" strokeWidth="4" strokeDasharray="10 9" /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 64, fontWeight: 600, color: "#AEAEB2", opacity: 1 - wrx }}>?</div>
      {wrx > 0 ? <Cut img={IMG.wrx} x={10 + (1 - wrx) * 160} y={34} w={360} op={wrx} /> : null}
    </div> : null}
    {TL.labels.map((L, i) => t >= L.a && t < L.b + 0.4 ? <div key={i} style={{ position: "absolute", right: 60, top: i === 0 ? 252 : 336, zIndex: 70, width: 430, textAlign: "right" }}>
      <div style={{ fontSize: 54, fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.1, fontVariationSettings: '"opsz" 32' }}><SoftBlurIn t={t} at={L.a} out={L.b} text={L.text} /></div>
    </div> : null)}
    <CTA t={t} a={E.ctaIn} out={E.ctaOut} head="Ask for the build." top={250} />
    <Captions t={t} vo={TL.vo} style="underline" />
    {check ? <Guides /> : null}
  </Canvas>;
};
