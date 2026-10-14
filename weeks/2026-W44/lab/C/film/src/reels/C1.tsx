// @ts-nocheck
// C1 v2 · The shoebox. Lead hook B. 30.0 s. Every element is a pure function of t; event times come from timeline/C1.json.
import React from "react";
import { AbsoluteFill } from "remotion";
import TL from "../../../timeline/C1.json";
import { IMG, BRANDS } from "../assets";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, ei, sp, Cut, Tile, Chip, Headline, Captions, Icon, StatusBar, Device, Touch, RollingNumber, ValueSwap, TrimBurst, Shots, TR, Studio, Cam, Guides, src } from "../lib/core";
import { Img } from "remotion";

const E = TL.ev;
export const C1_DUR = TL.dur;

// ---------- frame-0 layout (locked: the last frame must equal this) ----------
const F0 = { tile: { x: 100, y: 600, w: 880, h: 520 }, car: { x: 150, y: 650, w: 780 }, box: { x: 255, y: 900, w: 570 } };
const BOX_H = 0.704; // shoebox.png aspect (h/w)

// shoebox split into body / lid / dark interior so the lid can lift (image % coordinates)
const LID = "polygon(0% 7%, 45% 0%, 100% 12%, 100% 26.5%, 63% 49.5%, 0% 23.5%)";
const BODY = "polygon(0% 23.5%, 63% 49.5%, 100% 26.5%, 100% 100%, 0% 100%)";
const HOLE = "polygon(1% 11%, 44% 3%, 99% 14%, 99% 29%, 63% 52%, 1% 26%)";
const Shoebox = ({ x, y, w, lid = 0, s = 1, z = 4, origin = "50% 100%" }) => {
  // lid: 0 closed, 1 lifted (up and tipped back on its rear edge)
  const L = clamp(lid, -0.2, 1.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * BOX_H, zIndex: z, transform: `scale(${s})`, transformOrigin: origin }}>
      <div style={{ position: "absolute", left: "6%", right: "6%", bottom: "-2.5%", height: "10%", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.28),rgba(0,0,0,0))", filter: "blur(7px)" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: HOLE, background: "linear-gradient(170deg,#2B1E12,#4A3522 60%,#5B4329)" }} />
      <Img src={src(IMG.shoebox)} style={{ position: "absolute", inset: 0, width: "100%", clipPath: BODY }} />
      <Img src={src(IMG.shoebox)} style={{ position: "absolute", inset: 0, width: "100%", clipPath: LID, transformOrigin: "70% 8%", transform: `translateY(${-L * w * 0.17}px) rotate(${-L * 7}deg)`, filter: `drop-shadow(0 ${10 + 20 * L}px ${8 + 10 * L}px rgba(0,0,0,${.12 + .1 * clamp(L)}))` }} />
    </div>
  );
};

// a person's soft cast shadow (Dale). p: 0 off-frame right, 1 leaning in
const DaleShadow = ({ p, lean = 0, z = 20, y = 520 }) => (
  <svg width="900" height="1500" viewBox="0 0 900 1500" style={{ position: "absolute", left: lerp(1180, 520, p), top: y, zIndex: z, opacity: clamp(p * 1.4) * 0.9, transform: `rotate(${-8 - lean * 6}deg)`, transformOrigin: "80% 100%", filter: "blur(22px)" }}>
    <path d="M330 120c70 0 120 55 120 135 0 60-28 108-70 128 130 30 250 110 300 260 40 120 50 400 50 857H-20c0-430 30-700 90-820 60-120 150-180 250-205-45-22-75-70-75-130 0-80 50-135 120-135z" fill="rgba(20,20,24,.17)" />
  </svg>
);

// thermal receipt with paper grain; fade 0 = crisp print, 1 = blank paper; dissolve shrinks the visible paper from the edges
const Receipt = ({ x, y, w = 520, rot = 0, s = 1, fade = 0, dissolve = 0, stain = false, keep = null, lines, z = 8, op = 1, title = "Westside Performance", date = "03/12/2019  14:22" }) => {
  const ink = a => `rgba(48,44,40,${a})`;
  const R = lerp(140, 18, eio(dissolve));
  const mask = dissolve > 0 ? `radial-gradient(closest-side, #000 ${Math.max(0, R - 30)}%, transparent ${R}%)` : undefined;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: z, opacity: op, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "relative", padding: "38px 40px 56px", background: "#FBF7EE", boxShadow: "0 30px 60px -24px rgba(0,0,0,.30), 0 0 0 1px rgba(0,0,0,.04)", WebkitMaskImage: mask, maskImage: mask, fontFamily: "Inter", color: ink(1 - fade), clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .35, mixBlendMode: "multiply" }}><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" /><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .5  0 0 0 0 .42  0 0 0 .55 0" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg>
        <div style={{ textAlign: "center", fontSize: 34, fontWeight: 600, letterSpacing: "-.01em" }}>{title}</div>
        <div style={{ textAlign: "center", fontSize: 24, marginTop: 6 }}>{date}</div>
        <div style={{ borderTop: `3px dashed ${ink(.3 * (1 - fade))}`, margin: "22px 0" }} />
        {lines.map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, margin: "12px 0", color: keep === i ? ink(.95) : undefined, fontWeight: keep === i ? 600 : 400 }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ borderTop: `3px dashed ${ink(.3 * (1 - fade))}`, margin: "22px 0 14px" }} />
        <div style={{ textAlign: "center", fontSize: 22 }}>Thank you</div>
        {stain ? <div style={{ position: "absolute", right: 34, top: 70, width: 190, height: 190, borderRadius: "50%", boxShadow: "inset 0 0 0 12px rgba(140,90,40,.20), inset 0 0 34px rgba(140,90,40,.12)" }} /> : null}
      </div>
    </div>
  );
};

// ---------- the offer chip (headline band spine) ----------
const OfferChip = ({ t }) => {
  if (t < E.chipIn) return null;
  const pin = sp(t, E.chipIn, 210, 20); const out = eio(seg(t, E.chipOut, E.chipOut + 0.6));
  if (out >= 1) return null;
  const dim = seg(t, E.chipDim, E.chipDim + 0.5);
  const dropping = (t > E.drop1 && t < E.drop1 + 1.1) || (t > E.drop2 && t < E.drop2 + 1.1);
  const numColor = dim > 0 ? `rgba(174,174,178,${dim})` : dropping ? RED : INK;
  const v = t < E.drop2 ? <RollingNumber t={t} from={68000} to={64500} at={E.drop1} color={dim > 0.5 ? "#AEAEB2" : numColor} /> : <RollingNumber t={t} from={64500} to={61000} at={E.drop2} color={dim > 0.5 ? "#AEAEB2" : numColor} />;
  return <Chip y={176} h={86} fs={42} op={clamp(pin * 1.5) * (1 - out)} s={0.86 + 0.14 * pin} ty={-240 * out} style={{ color: dim > 0.5 ? "#AEAEB2" : INK }}>
    <span style={{ color: dim > .5 ? "#C7C7CC" : GREY, fontWeight: 500 }}><ValueSwap t={t} a="Asking" b="Dale’s offer" at={E.labelSwap} w={t < E.labelSwap ? 132 : 232} /></span>{v}
  </Chip>;
};

// ---------- phone screens (402 x 874 pt) ----------
const PageBar = () => <>
  <StatusBar />
  <div style={{ position: "absolute", top: 58, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
    <div className="gbtn glass"><Icon n="chevL" s={20} c="#000" sw={2.2} /></div>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 600 }}>White ’99 Supra</div><div style={{ fontSize: 12, color: "rgba(60,60,67,.6)", display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}><Icon n="link" s={11} c="rgba(60,60,67,.6)" sw={2} />fuelmybuild.com/marcus-supra</div></div>
    <div className="gbtn glass"><Icon n="share" s={20} c="#000" /></div>
  </div>
</>;
const Photo = ({ img, w, h, r = 16, inner = null, bg = "linear-gradient(160deg,#F4F4F6,#E3E3E8)", inset = 6 }) => <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", background: bg, flex: "none" }}>{img ? <Img src={src(img)} style={{ position: "absolute", left: `${inset}%`, top: `${inset}%`, width: `${100 - 2 * inset}%`, height: `${100 - 2 * inset}%`, objectFit: "contain" }} /> : null}{inner}</div>;
// the car on a two-post lift (install photo composite)
export const OnLift = ({ car, w, h }) => <div style={{ position: "relative", width: w, height: h, borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg,#EDEDF0,#DADADF)", flex: "none" }}>
  <Img src={src(IMG.lift)} style={{ position: "absolute", left: "4%", top: "4%", width: "92%", height: "92%", objectFit: "contain" }} />
  <Img src={src(car)} style={{ position: "absolute", left: "13%", top: "34%", width: "74%", objectFit: "contain" }} />
</div>;

// one legible entry (turbo) and the log rows under it; `scroll` in pt
const LogScreen = ({ t, scroll = 0, entryP = 1, photoP = [1, 1], rowsP = [1, 1, 1], press = -1 }) => (
  <div className="ios" style={{ background: "#F2F2F7" }}>
    <PageBar />
    <div style={{ position: "absolute", left: 0, right: 0, top: 120 - scroll }}>
      {/* the expanded turbo entry */}
      <div style={{ margin: "0 12px", background: "#fff", borderRadius: 26, padding: "18px 18px 20px", opacity: clamp(entryP * 1.3), transform: `translateY(${(1 - entryP) * 30}px)` }}>
        <div style={{ fontSize: 15, color: "rgba(60,60,67,.6)", display: "flex", alignItems: "center", gap: 6 }}><Icon n="wrench" s={15} c="rgba(60,60,67,.6)" />Log entry · Installed part</div>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.025em", marginTop: 6, lineHeight: 1.1 }}>Turbo kit · {BRANDS.turbo}</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}><Icon n="calendar" s={24} c={INK} sw={2} />Installed Mar 12, 2019</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[IMG.turboBay, IMG.turboKit].map((im, i) => <div key={i} style={{ opacity: clamp(photoP[i] * 1.4), transform: `scale(${0.9 + 0.1 * photoP[i]})` }}><Photo img={im} w={175} h={150} inset={i ? 8 : 0} bg={i ? undefined : "#E9E5DF"} /></div>)}
        </div>
        <div style={{ fontSize: 24, marginTop: 12, letterSpacing: "-.02em", lineHeight: 1.2 }}>New oil feed and return lines.</div>
      </div>
      {/* the rest of the log */}
      <div style={{ fontSize: 15, color: "rgba(60,60,67,.6)", padding: "18px 28px 8px" }}>Installed · 24 parts</div>
      {[[IMG.coilovers, `Coilovers · ${BRANDS.coilovers}`, "Aug 3, 2021", "4 photos"], [IMG.brakes, `Brake kit · ${BRANDS.brakes}`, "May 9, 2022", "3 photos"], [IMG.intake, `Intake · ${BRANDS.intake}`, "Jan 14, 2023", "2 photos"]].map(([im, n, d, ph], i) => (
        <div key={i} style={{ margin: "0 12px 8px", background: press === i ? "#E5E5EA" : "#fff", borderRadius: 22, padding: "14px 14px", display: "flex", gap: 14, alignItems: "center", opacity: clamp(rowsP[i] * 1.3), transform: `translateY(${(1 - rowsP[i]) * 24}px)` }}>
          <Photo img={im} w={74} h={74} r={14} inset={8} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.02em" }}>{n}</div><div style={{ fontSize: 20, color: "rgba(60,60,67,.75)", fontWeight: 500, marginTop: 2 }}>{d} · {ph}</div></div>
          <Icon n="chevR" s={16} c="rgba(60,60,67,.3)" sw={2.4} />
        </div>))}
    </div>
  </div>
);
// alignment sheet (remocn drawer, rebuilt as an iOS 26 sheet): p 0 closed, 1 open
const AlignSheet = ({ p }) => p <= 0 ? null : <>
  <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${.25 * clamp(p)})`, zIndex: 27 }} />
  <div className="sheet" style={{ height: 520, transform: `translateY(${(1 - p) * 560}px)` }}>
    <div className="grab" />
    <div style={{ padding: "16px 22px 0" }}>
      <div style={{ fontSize: 15, color: "rgba(60,60,67,.6)" }}>Log entry · Coilovers</div>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.025em", marginTop: 4 }}>Alignment</div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}><Icon n="calendar" s={24} c={INK} sw={2} />Sep 14, 2021</div>
      <div style={{ marginTop: 14 }}><OnLift car={IMG.supra} w={358} h={200} /></div>
      <div style={{ fontSize: 22, marginTop: 12, color: "rgba(60,60,67,.85)" }}>Four-wheel alignment after the coilovers.</div>
    </div>
  </div>
</>;

// ---------- the wide story frame (hook, loop, CTA) ----------
const Wide = ({ t, lid = 0, hand = 0, shadow = 0, scatter = 0 }) => (
  <>
    <Tile {...F0.tile} r={64} />
    <Cut img={IMG.supra} {...F0.car} z={2} />
    {scatter > 0 ? <Cut img={IMG.receiptsScatter} x={150} y={760} w={780} op={scatter} z={3} shadow={false} s={0.9 + 0.1 * scatter} origin="50% 50%" /> : null}
    <Shoebox {...F0.box} lid={lid} z={5} />
    {hand > 0 ? (
      <div style={{ position: "absolute", left: lerp(1120, 650, hand), top: 840, width: 380, zIndex: 9, transform: `rotate(${lerp(14, -6, hand)}deg)`, transformOrigin: "60% 100%" }}>
        <Img src={src(IMG.handPhone)} style={{ width: "100%", display: "block" }} />
        {/* screen overlay on the cutout's blank screen: the build page, small */}
        <div style={{ position: "absolute", left: "35.5%", top: "3.2%", width: "31.8%", height: "61%", borderRadius: 18, overflow: "hidden", background: "#F2F2F7" }}>
          <div style={{ height: "30%", background: "linear-gradient(180deg,#F2F2F5,#E3E3E8)", position: "relative" }}><Img src={src(IMG.supra)} style={{ position: "absolute", left: "4%", top: "26%", width: "92%" }} /></div>
          <div style={{ padding: "6px 7px" }}><div style={{ fontSize: 12, fontWeight: 700 }}>White ’99 Supra</div>
            {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ height: 15, borderRadius: 4, background: "#fff", marginTop: 5, display: "flex", alignItems: "center", gap: 3, padding: "0 3px" }}><div style={{ width: 9, height: 9, borderRadius: 2, background: "#E3E3E8" }} /><div style={{ height: 3, width: `${40 + i * 9 % 30}%`, background: "#C7C7CC", borderRadius: 2 }} /></div>)}</div>
        </div>
      </div>) : null}
    {shadow > 0 ? <DaleShadow p={shadow} lean={0.6} z={12} y={560} /> : null}
  </>
);

// ---------- headlines per beat ----------
const HEADS = [
  { a: 0, b: 2.42, lines: [{ text: "$68,000", color: RED, size: 124 }, { text: "One shoebox.", size: 96 }], at: [E.w_grand, E.w_one, E.w_shoebox] },
  { a: 2.6, b: 5.42, lines: [{ text: "11 years." }, { text: "One shoebox." }], at: [2.75, 2.95, 3.6, 3.75] },
  { a: 6.9, b: 8.42, lines: [{ text: "Minus $3,500.", color: INK }], at: [7.25, 7.4] },
  { a: 8.65, b: 11.42, lines: [{ text: "$1,400." }, { text: "No date." }], at: [9.3, 10.6, 10.75] },
  { a: 11.7, b: 13.92, lines: [{ text: "No more" }, { text: "questions." }], at: [12.2, 12.32, 12.44] },
  { a: 14.1, b: 15.92, lines: [{ text: "Lid on." }], at: [E.lidDrop - .05, E.lidDrop + .1] },
  { a: 16.15, b: 19.42, lines: [{ text: "Dated." }, { text: "With photos." }], at: [E.dateLine, 18.2, 18.35] },
  { a: 19.6, b: 21.92, lines: [{ text: "Kept scrolling." }], at: [20.9, 21.05] },
  { a: 22.1, b: 24.42, lines: [{ text: "A question." }, { text: "A dated answer." }], at: [22.3, 22.45, E.sheetLand - .1, E.sheetLand, E.sheetLand + .1] },
  { a: 24.6, b: 26.92, lines: [{ text: "Not the" }, { text: "receipts." }], at: [25.9, 26.02, 26.14] },
];
const Heads = ({ t }) => { const h = HEADS.find(h => t >= h.a && t < h.b + 0.3); return h ? <Headline t={t} lines={h.lines} at={h.at} out={h.b} top={292} size={100} /> : null; };

// CTA over the final story frame (no end card)
const CTA = ({ t }) => {
  if (t < E.ctaHead - 0.1) return null;
  const out = seg(t, E.textOut, E.textOut + 0.33); if (out >= 1) return null;
  const u = eo((t - E.ctaUrl) / 0.35), il = eo((t - E.ctaUrl - 0.25) / 0.35);
  return <div style={{ opacity: 1 - out }}>
    <Headline t={t} lines={[{ text: "Start your build’s record", size: 84 }]} at={[E.ctaHead, E.ctaHead + .12, E.ctaHead + .3, E.ctaHead + .45]} top={268} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 378, textAlign: "center", fontSize: 64, fontWeight: 600, letterSpacing: "-.025em", color: RED, opacity: u, transform: `translateY(${(1 - u) * 16}px)`, zIndex: 31 }}>fuelmybuild.com</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 476, textAlign: "center", fontSize: 36, fontWeight: 500, letterSpacing: "-.01em", color: GREY, opacity: il, zIndex: 31 }}>Illustrative story</div>
  </div>;
};

export const C1 = ({ t, check = false }) => {
  const shots = [
    // HOOK B (0–2.5): frame 0 = wide box, lid closed. Lid lifts on "shoebox".
    { a: 0, b: E.push1, out: TR.push(0.5), render: t => <Cam s={1 + 0.02 * eo(t / 2.5)} origin="50% 60%"><Wide t={t} lid={sp(t, E.lidLift, 160, 15)} /></Cam> },
    // 2.5–8.5: into the box. Receipt rises and fades to blank; Dale's shadow leans in; first drop.
    { a: E.push1, b: E.whip1, out: TR.whipL(0.45), render: (t) => {
      const rise = sp(t, E.receiptRise, 120, 17), fade = seg(t, 3.4, E.fadeBlank + 0.3), dis = seg(t, 4.2, 5.4) * 0.55;
      const settle = eio(seg(t, 5.45, 6.0));
      return <Cam s={1 + 0.03 * seg(t, 2.5, 8.5)}>
        <Shoebox x={-120} y={1080} w={1320} lid={1.25} z={2} />
        <Receipt x={lerp(280, 150, settle)} y={lerp(1150, 520, rise) + 40 * settle} w={520} rot={lerp(-8, -3, rise)} s={lerp(.8, 1.08, rise) - .16 * settle} fade={fade} dissolve={dis} z={8}
          lines={[["Turbo kit", "$4,280.00"], ["Install labor", "$1,150.00"], ["Oil feed lines", "$212.00"]]} title="Westside Performance" date="03/12/2019  14:22" />
        <Cut img={IMG.turboKit} x={lerp(1100, 600, eo(seg(t, E.turboIn, E.turboIn + .55)))} y={lerp(780, 830, settle)} w={430} z={7} rot={-4} />
        <DaleShadow p={eo(seg(t, E.daleIn, E.daleIn + 0.9))} lean={eo(seg(t, 6.2, 7.4))} z={20} y={400} />
        {t > E.daleIn + .3 ? <div style={{ position: "absolute", left: 640, top: 1190, zIndex: 22, fontSize: 36, fontWeight: 500, color: GREY, opacity: eo((t - E.daleIn - .3) / .4) }}>Dale · buyer</div> : null}
      </Cam>; } },
    // 8.5–11.5: whip-pan to the coilovers; coffee-ring receipt lands, only $1,400 readable; second drop.
    { a: E.whip1, b: E.silence, out: TR.focus(0.6), render: (t) => {
      const land = sp(t, E.receiptLand - .25, 190, 16);
      return <Cam s={1.0 + 0.03 * seg(t, 8.5, 11.5)}>
        <Tile x={110} y={620} w={360} h={720} r={48} />
        <Cut img={IMG.coilovers} x={150} y={650} w={290} z={3} rot={-2} />
        <Receipt x={470} y={lerp(260, 690, land)} w={500} rot={lerp(16, 5, land)} s={lerp(1.25, 1, land)} fade={0.86} keep={0} stain z={8} op={clamp(land * 3)}
          lines={[["$1,400.00", ""], ["Coilover set", ""], ["Install", "—"]]} title="Northline Dist." date="" />
      </Cam>; } },
    // 11.5–14: silence. Wide-ish: the spilled receipts, Dale's shadow slides out.
    { a: E.silence, b: E.lidDrop - 0.2, render: (t) => <Cam s={1.06 - 0.02 * seg(t, 11.5, 14)} origin="50% 62%">
      <Wide t={t} lid={1} scatter={eo(seg(t, 11.55, 12.2))} shadow={1 - eio(seg(t, E.daleOut, E.daleOut + 1.0))} />
    </Cam> },
    // 13.8–16: lid on, phone out (one spring drives both, 4-frame stagger).
    { a: E.lidDrop - 0.2, b: E.push2, out: TR.push(0.5), render: (t) => {
      const lid = 1 - sp(t, E.lidDrop - 0.12, 260, 16); const ph = sp(t, E.phoneUp, 150, 15); const bx = eio(seg(t, E.phoneUp, E.phoneUp + .8));
      return <Cam s={1.0}>
        <Shoebox x={lerp(255, 120, bx)} y={lerp(900, 1060, bx)} w={570} s={lerp(1, .62, bx)} lid={lid} z={5} origin="0% 100%" />
        <Device x={300} y={lerp(1950, 560, ph)} w={520} rot={lerp(6, 0, ph)} z={12} screenBg="#0B0B0C">
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1C1C1E,#0B0B0C)" }} /><StatusBar dark />
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,.9)", fontSize: 86, fontWeight: 600, letterSpacing: "-.03em", fontVariationSettings: '"opsz" 32', opacity: .9 }}>9:41</div>
        </Device>
      </Cam>; } },
    // 16–22: FMB turn. One legible entry, then Dale takes the phone and scrolls.
    { a: E.push2, b: E.tap - 0.25, render: (t) => {
      const hand = eio(seg(t, E.handoff, E.handoff + 0.6)); const sc = eio(seg(t, E.scroll, 21.8)) * 300;
      const rowsP = [sp(t, E.row1 - .5, 200, 20), sp(t, E.row2 - .5, 200, 20), sp(t, E.row3 - .5, 200, 20)];
      const ty = lerp(0, 10, hand);
      return <Cam s={1 + 0.02 * seg(t, 16, 22)}>
        <Device x={150} y={530 + ty} w={780} rot={lerp(0, -2.5, hand) + 2.5 * eio(seg(t, E.handoff + .6, E.handoff + 1.2))} z={12}>
          <LogScreen t={t} scroll={sc} entryP={sp(t, E.entryIn, 200, 20)} photoP={[sp(t, E.photo1, 220, 18), sp(t, E.photo2, 220, 18)]} rowsP={t < E.scroll ? [0, 0, 0] : rowsP} />
        </Device>
        {t > E.scroll - .15 && t < 21.9 ? <Touch x={720} y={lerp(1330, 980, eio(seg(t, E.scroll, 21.8)))} op={clamp((t - E.scroll + .15) / .15) * (1 - seg(t, 21.7, 21.9))} press={1} /> : null}
      </Cam>; } },
    // 22.7–24.5: Marcus taps the coilovers row; the alignment sheet slides up and lands on "since".
    { a: E.tap - 0.25, b: E.wide, render: (t) => {
      const p = sp(t, E.sheetUp, 170, 20);
      return <Cam s={1.02 + 0.015 * seg(t, 22.7, 24.5)}>
        <Device x={150} y={540} w={780} z={12}>
          <LogScreen t={t} scroll={300} press={t > E.tap - .05 && t < E.tap + .25 ? 0 : -1} />
          <AlignSheet p={p} />
        </Device>
        {t < E.tap + .3 ? <Touch x={560} y={1130} op={clamp((t - E.tap + .35) / .15) * (1 - seg(t, E.tap + .15, E.tap + .3))} press={t > E.tap - .05 ? 1 : 0} /> : null}
      </Cam>; } },
    // 24.5–30: cut wide; Dale's hand holds the phone over the closed box; CTA over this frame; camera eases home to frame 0.
    { a: E.wide, b: TL.dur + 1, render: (t) => {
      const home = eio(seg(t, E.camHome, E.camHome + 1.5));
      const hand = t < E.handOut ? sp(t, E.wide + .05, 140, 18) : 1 - eio(seg(t, E.handOut, E.handOut + 0.75));
      return <Cam s={lerp(0.86 + 0.03 * eo(seg(t, 24.5, 27)), 1, home)} y={lerp(40, 0, home)} origin="50% 55%">
        <Wide t={t} lid={0} hand={hand} shadow={t < E.handOut ? eo(seg(t, E.wide, E.wide + .8)) : 1 - eio(seg(t, E.handOut, E.handOut + 0.9))} />
      </Cam>; } },
  ];
  return <Studio>
    <Shots t={t} shots={shots} />
    <OfferChip t={t} />
    <Heads t={t} />
    <CTA t={t} />
    <TrimBurst t={t} at={E.drop1 + .55} x={700} y={219} r0={30} r1={70} n={6} color={RED} w={5} />
    <Captions t={t} cues={TL.vo} tags={{ Chris: "Dale" }} />
    {check ? <Guides /> : null}
  </Studio>;
};
