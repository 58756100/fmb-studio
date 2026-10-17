// @ts-nocheck
// P1 v2 · After "Delivered". Lead hook A. 28.0 s. Pure function of t; events from timeline/P1.json; CTA text from timeline/P1-cta.json.
import React from "react";
import { Img } from "remotion";
import TL from "../../../timeline/P1.json";
import CTA_TXT from "../../../timeline/P1-cta.json";
import { IMG, BRANDS } from "../assets";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, sp, Cut, Tile, Chip, Headline, Captions, Icon, StatusBar, Device, Cursor, Typewriter, Skeleton, TrimBurst, Shots, TR, Studio, Cam, Guides, src } from "../lib/core";
import { OnLift } from "./C1";

const E = TL.ev;
export const P1_DUR = TL.dur;
const CUES = TL.vo.map(c => c.text.startsWith("@cta") ? { ...c, text: CTA_TXT.vo, cap: CTA_TXT.cap } : c);

// ---------- frame-0 layout (locked) ----------
const F0 = { box: { x: 250, y: 905, w: 580 }, turbo: { x: 325, y: 650, w: 430 }, label: 588 };

// ---------- the one red dashed line, in world coordinates (camera tracks right across 4 panels) ----------
// keypoints: [x, y, time the head reaches it]
const KP = [
  [745, 1160, E.lineStart], [1100, 1160, 2.4], [1150, 952, 2.75], [1290, 952, E.shipped], [1620, 952, E.transit], [1950, 952, E.delivered],
  [2230, 952, 5.0], [2300, 952, 5.85], [3110, 952, 7.6], [3250, 1010, 8.6], [3330, 1010, E.lineStop],
];
const segLen = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const linePts = (t) => {
  if (t < KP[0][2]) return null;
  const pts = [[KP[0][0], KP[0][1]]];
  for (let i = 1; i < KP.length; i++) {
    const a = KP[i - 1], b = KP[i];
    if (t >= b[2]) { pts.push([b[0], b[1]]); continue; }
    const p = (t - a[2]) / (b[2] - a[2]); const q = i === KP.length - 1 ? eo(p) : p;
    pts.push([lerp(a[0], b[0], q), lerp(a[1], b[1], q)]); break;
  }
  return pts;
};
const DashLine = ({ pts, z = 6, w = 9, op = 1 }) => !pts || pts.length < 2 ? null : (
  <svg width="4400" height="1920" style={{ position: "absolute", left: 0, top: 0, zIndex: z, overflow: "visible", opacity: op }}>
    <polyline points={pts.map(p => p.join(",")).join(" ")} fill="none" stroke={RED} strokeWidth={w} strokeDasharray="26 20" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={w * .9} fill={RED} />
  </svg>
);
// camera x per time (panels at 0, 1080, 2160, 3240), eased pans with a little motion blur
const PANS = [[E.pan1, 0, 1080], [E.pan2, 1080, 2160], [E.pan3, 2160, 3240]];
const camX = t => { let x = 0, v = 0; PANS.forEach(([at, a, b]) => { if (t >= at) { const p = seg(t, at - .05, at + .5); x = lerp(a, b, eio(p)); if (p > 0 && p < 1) v = Math.sin(Math.PI * p); } }); return [x, v]; };

// shipping box: open (frame 0) or closed (after the drop), with a squash on the snap
const ShipBox = ({ t, x, y, w, closed, snapAt = -1, z = 4 }) => {
  const sq = snapAt > 0 && t > snapAt && t < snapAt + .22 ? Math.sin(Math.PI * seg(t, snapAt, snapAt + .22)) : 0;
  return <Cut img={closed ? IMG.boxClosed : IMG.boxOpen} x={x} y={closed ? y + w * (0.824 - 0.784) : y} w={w} z={z} style={{ transform: `scale(${1 + .04 * sq}, ${1 - .06 * sq})`, transformOrigin: "50% 100%" }} />;
};

// tracking card (iOS 26), no order ID
const Tracking = ({ t }) => {
  const steps = [["Shipped", "Mar 2", E.shipped], ["In transit", "Mar 4", E.transit], ["Delivered", "Mar 6", E.delivered]];
  const xs = [110, 440, 770];
  const fill = t < E.shipped ? 0 : t < E.transit ? 0 : t < E.delivered ? .5 * eo(seg(t, E.transit - .35, E.transit)) : .5 + .5 * eo(seg(t, E.delivered - .35, E.delivered));
  return <div style={{ position: "absolute", left: 1180, top: 640, width: 880, height: 420, borderRadius: 40, background: "#fff", boxShadow: "0 40px 90px -30px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.04)", zIndex: 4 }}>
    <div style={{ position: "absolute", left: 40, top: 40, display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ width: 120, height: 120, borderRadius: 26, background: SOFT, position: "relative", overflow: "hidden" }}><Img src={src(IMG.turboKit)} style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", objectFit: "contain" }} /></div>
      <div><div style={{ fontSize: 30, color: GREY, fontWeight: 500 }}>Order status</div><div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-.025em" }}>Korvane turbo kit</div></div></div>
    <div style={{ position: "absolute", left: xs[0], width: xs[2] - xs[0], top: 310, height: 6, borderRadius: 3, background: "#E5E5EA" }} />
    <div style={{ position: "absolute", left: xs[0], width: (xs[2] - xs[0]) * fill, top: 310, height: 6, borderRadius: 3, background: INK }} />
    {steps.map(([s, d, at], i) => { const p = sp(t, at - .08, 300, 18);
      return <div key={i} style={{ position: "absolute", left: xs[i] - 90, width: 180, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: p > .02 ? INK : "#E5E5EA", display: "grid", placeItems: "center", transform: `scale(${1 + .25 * Math.sin(Math.PI * clamp(p))})` }}>{p > .02 ? <Icon n="check" s={24} c="#fff" sw={2.8} /> : null}</div>
        <div style={{ fontSize: 30, fontWeight: 600, color: p > .02 ? INK : GREY }}>{s}</div><div style={{ fontSize: 26, color: GREY }}>{d}</div></div>; })}
  </div>;
};
// review card: five stars and "Arrived fast." typed slowly, then held still
const Review = ({ t }) => <div style={{ position: "absolute", left: 2160 + 130, top: 700, width: 820, borderRadius: 40, background: "#fff", padding: "40px 46px", boxShadow: "0 40px 90px -30px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.04)", zIndex: 8 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: 70, height: 70, borderRadius: "50%", background: SOFT, display: "grid", placeItems: "center", fontSize: 30, fontWeight: 700, color: GREY }}>J</div>
    <div><div style={{ fontSize: 32, fontWeight: 600 }}>Verified buyer</div><div style={{ display: "flex", gap: 6, marginTop: 4 }}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} n="star" s={34} c={INK} fill={INK} sw={1.2} />)}</div></div></div>
  <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-.035em", marginTop: 26, minHeight: 92 }}><Typewriter t={t} text="“Arrived fast.”" at={E.reviewType} cps={15 / (E.reviewDone - E.reviewType)} caretColor={INK} hideCaretAfter={E.reviewDone + .05} /></div>
</div>;
// empty, dashed, car-shaped slot with a "?"
const Slot = ({ t, fill }) => <div style={{ position: "absolute", left: 3240 + 130, top: 820, width: 820, height: 380, zIndex: 5 }}>
  <svg width="820" height="380" viewBox="0 0 820 380" style={{ position: "absolute", inset: 0, opacity: 1 - fill }}>
    <path d="M60 300 L60 240 Q60 210 100 200 L230 180 Q300 110 380 95 L540 92 Q610 95 660 170 L740 190 Q775 200 775 240 L775 300 Z" fill="none" stroke={GREY} strokeWidth="5" strokeDasharray="18 14" strokeLinejoin="round" />
    <circle cx="200" cy="300" r="46" fill="#fff" stroke={GREY} strokeWidth="5" strokeDasharray="14 12" /><circle cx="630" cy="300" r="46" fill="#fff" stroke={GREY} strokeWidth="5" strokeDasharray="14 12" />
  </svg>
  <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 110, fontWeight: 600, color: GREY, opacity: 1 - fill }}>?</div>
</div>;

// ---------- phone screens ----------
const SafariBar = () => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, zIndex: 19, background: "linear-gradient(180deg,rgba(255,255,255,1) 72%,rgba(255,255,255,0))" }} />
  <StatusBar />
  <div className="glass" style={{ position: "absolute", top: 58, left: 14, right: 14, height: 48, borderRadius: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", zIndex: 20, fontSize: 16 }}>
    <Icon n="aa" s={20} c="#000" sw={1.8} /><div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Icon n="lock" s={13} c="rgba(60,60,67,.6)" sw={2} />fuelmybuild.com/…/white-99-supra</div><Icon n="refresh" s={18} c="#000" sw={1.9} /></div>
</>;
const ROWS = [["Turbo kit", BRANDS.korvane, IMG.turboKit], ["Coilovers", BRANDS.coilovers, IMG.coilovers], ["Intake", BRANDS.intake, IMG.intake], ["Brake kit", BRANDS.brakes, IMG.brakes]];
const BuildPage = ({ t }) => {
  const hi = eo(seg(t, E.rowHi - .1, E.rowHi + .2));
  const ex = eio(seg(t, E.expand, E.expand + .5)); // row → record
  const dP = sp(t, E.date - .1, 260, 19), aP = sp(t, E.attr - .1, 260, 18);
  return <div className="ios" style={{ background: "#F2F2F7" }}>
    <SafariBar />
    <div style={{ position: "absolute", left: 0, right: 0, top: 112 - 236 * ex }}>
      <div style={{ height: 170, margin: "0 12px", borderRadius: 24, background: "linear-gradient(160deg,#F7F7F9,#E6E6EB)", position: "relative", overflow: "hidden", opacity: 1 - ex }}><Img src={src(IMG.supra)} style={{ position: "absolute", left: "6%", top: "16%", width: "88%" }} /></div>
      <div style={{ padding: "12px 22px 0", opacity: 1 - ex }}><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.025em" }}>White ’99 Supra</div><div style={{ fontSize: 15, color: "rgba(60,60,67,.6)", marginTop: 2 }}>Public build · 186 entries</div></div>
      <div style={{ fontSize: 15, color: "rgba(60,60,67,.6)", padding: "14px 28px 6px", opacity: 1 - ex }}>Parts registry · 24</div>
      {ROWS.map(([n, b, im], i) => {
        if (i === 0) {
          // the Korvane row: highlights, then expands into one legible record
          return <div key={i} style={{ margin: "0 12px 8px", background: hi > 0 && ex < 1 ? `rgba(244,48,52,${.1 * hi * (1 - ex)})` : "#fff", borderRadius: 22, padding: lerp(14, 18, ex), boxShadow: hi > 0 ? `0 0 0 ${2.5 * hi * (1 - ex)}px ${RED}` : undefined }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, background: SOFT, position: "relative", overflow: "hidden", flex: "none" }}><Img src={src(im)} style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", objectFit: "contain" }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: lerp(22, 28, ex), fontWeight: lerp(600, 700, ex), letterSpacing: "-.02em" }}>{n} · <span data-korvane style={{ color: hi > .5 ? RED : INK }}>{b}</span></div>
                {ex < .5 ? <div style={{ fontSize: 18, color: "rgba(60,60,67,.7)", opacity: 1 - ex * 2 }}>Installed · 3 photos</div> : null}</div></div>
            {ex > 0 ? <div style={{ opacity: ex }}>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", marginTop: 14, display: "flex", alignItems: "center", gap: 8, opacity: clamp(dP * 1.5), transform: `translateY(${(1 - dP) * 12}px)` }}><Icon n="calendar" s={24} c={INK} sw={2} />Installed Mar 14</div>
              <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", borderRadius: 21, background: SOFT, color: GREY, fontSize: 21, fontWeight: 600, opacity: clamp(aP * 1.6), transform: `scale(${.85 + .15 * aP})`, transformOrigin: "0 50%" }}><div style={{ width: 24, height: 24, borderRadius: 7, background: INK, color: "#fff", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>K</div>Work by Kessler Motorsport</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <Skeleton t={t} at={E.photos} w={170} h={150}><div style={{ width: 170, height: 150, borderRadius: 16, background: "#E9E5DF", position: "relative", overflow: "hidden" }}><Img src={src(IMG.turboBay)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /></div></Skeleton>
                <Skeleton t={t} at={E.photos + .15} w={170} h={150}><OnLift car={IMG.supra} w={170} h={150} /></Skeleton>
              </div></div> : null}
          </div>;
        }
        return <div key={i} style={{ margin: "0 12px 8px", background: "#fff", borderRadius: 22, padding: 14, display: "flex", gap: 14, alignItems: "center", opacity: 1 - ex, transform: `translateY(${ex * 120}px)` }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: SOFT, position: "relative", overflow: "hidden", flex: "none" }}><Img src={src(im)} style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", objectFit: "contain" }} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.02em" }}>{n} · {b}</div><div style={{ fontSize: 18, color: "rgba(60,60,67,.7)" }}>Installed</div></div></div>;
      })}
    </div>
  </div>;
};
// supplier page mock (concept): header + the Supra tile first + three empty dashed tiles. No counts, no map, no analytics.
const SupplierPage = ({ t }) => {
  const tiles = [E.tile1, E.tile2, E.tile3, E.tile4].map(a => sp(t, a - .15, 240, 18));
  return <div className="ios" style={{ background: "#F2F2F7" }}>
    <SafariBar />
    <div style={{ position: "absolute", top: 126, left: 20, right: 20, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: INK, color: "#fff", fontWeight: 700, fontSize: 28, display: "grid", placeItems: "center" }}>K</div>
      <div><div style={{ fontSize: 15, color: "rgba(60,60,67,.6)" }}>Korvane Turbo</div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.1 }}>Builds listing Korvane</div></div></div>
    <div style={{ position: "absolute", top: 220, left: 14, right: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {tiles.map((p, i) => <div key={i} style={{ height: 150, borderRadius: 20, background: i ? "transparent" : "#fff", border: i ? "3px dashed rgba(60,60,67,.25)" : "none", position: "relative", overflow: "hidden", opacity: clamp(p * 1.5), transform: `scale(${.85 + .15 * p})` }}>
        {i === 0 ? <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: "linear-gradient(160deg,#F7F7F9,#E6E6EB)" }}><Img src={src(IMG.supra)} style={{ position: "absolute", left: "8%", top: "14%", width: "84%" }} /></div>
          <div style={{ position: "absolute", left: 12, bottom: 10, right: 8 }}><div style={{ fontSize: 17, fontWeight: 600 }}>White ’99 Supra</div><div style={{ fontSize: 14, color: "rgba(60,60,67,.65)" }}>Turbo kit · Mar 14</div></div></> : null}
      </div>)}
    </div>
  </div>;
};

// ---------- headlines ----------
const HEADS = [
  { a: 0, b: 2.32, lines: [{ text: "Where do your turbos" }, { text: "end up?" }], at: [0.2, 0.42, 0.62, 0.82, 1.5, 1.7] },
  { a: 2.6, b: 5.38, lines: [{ text: "Last stop:" }, { text: "Delivered" }], at: [3.3, 3.45, E.delivered - .05] },
  { a: 5.6, b: 8.38, lines: [{ text: "Five stars." }, { text: "No car." }], at: [6.1, 6.25, 7.95, 8.1] },
  { a: 8.6, b: 11.28, lines: [{ text: "Which build?" }], at: [10.2, 10.35] },
  { a: 11.6, b: 14.38, inline: true, lines: [{ text: "Listed" }, { text: "by name." }], at: [E.rowHi, E.rowHi + .12, E.rowHi + .24] },
  { a: 14.6, b: 17.88, inline: true, lines: [{ text: "Dated." }, { text: "Attributed." }], at: [E.date + .1, E.attr + .05] },
  { a: 18.1, b: 20.88, inline: true, lines: [{ text: "Every build." }, { text: "One page." }], at: [19.3, 19.45, 20.2, 20.35] },
  { a: 21.1, b: 23.68, lines: [{ text: "Not just delivered." }, { text: "Installed.", color: RED }], at: [21.3, 21.5, 21.75, 23.0] },
];
const Heads = ({ t }) => { const h = HEADS.find(h => t >= h.a && t < h.b + 0.3); if (!h) return null;
  const n = h.lines.map(l => l.text).join(" ").length; const size = h.inline ? (n > 18 ? 76 : 88) : 88;
  return <Headline t={t} lines={h.lines} at={h.at} out={h.b} top={h.inline ? 286 : h.lines.length > 1 ? 250 : 300} size={size} inline={h.inline} />; };

const CTA = ({ t }) => {
  if (t < E.ctaHead - 0.1) return null;
  const out = seg(t, E.textOut, E.textOut + 0.33); if (out >= 1) return null;
  const u = eo((t - E.ctaUrl) / 0.35), il = eo((t - E.ctaUrl - 0.25) / 0.35);
  const w1 = CTA_TXT.head[0].split(" ").length, w2 = CTA_TXT.head[1].split(" ").length;
  const at = [...Array(w1)].map((_, i) => E.ctaHead + .05 + i * .22).concat([...Array(w2)].map((_, i) => E.ctaHead + 1.2 + i * .2));
  return <div style={{ opacity: 1 - out }}>
    <Headline t={t} lines={[{ text: CTA_TXT.head[0], size: 80 }, { text: CTA_TXT.head[1], size: 80, color: INK }]} at={at} top={236} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 412, textAlign: "center", fontSize: 56, fontWeight: 600, letterSpacing: "-.025em", color: RED, opacity: u, transform: `translateY(${(1 - u) * 14}px)`, zIndex: 31 }}>{CTA_TXT.url}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 486, textAlign: "center", fontSize: 31, lineHeight: 1.25, fontWeight: 500, color: GREY, opacity: il, zIndex: 31 }}>{CTA_TXT.small.map((s, i) => <div key={i}>{s}</div>)}</div>
  </div>;
};

export const P1 = ({ t, check = false }) => {
  const shots = [
    // 0–12.55: one continuous world; the camera tracks the dashed line across four panels
    { a: 0, b: E.push1, out: TR.push(0.5), render: t => {
      const [cx, v] = camX(t);
      const drop = sp(t, E.drop, 220, 22); const inBox = seg(t, E.drop + .18, E.dropLand);
      const closed = t >= E.lidSnap;
      const fill = sp(t, E.supraLand - .3, 200, 16);
      return <Cam s={1 + .015 * seg(t, 9, 12.5)} origin="50% 55%">
        <div style={{ position: "absolute", left: 0, top: 0, width: 4400, height: 1920, transform: `translateX(${-cx}px)`, filter: v > .05 ? `blur(${10 * v}px)` : undefined }}>
          {/* panel 0: frame-0 turbo over the open box */}
          {t < E.lidSnap + .02 ? <ShipBox t={t} {...F0.box} closed={false} /> : <ShipBox t={t} {...F0.box} closed snapAt={E.lidSnap} />}
          {t < E.dropLand ? <Cut img={IMG.turboKit} x={F0.turbo.x} y={F0.turbo.y + 230 * drop} w={F0.turbo.w} s={1 - .25 * inBox} op={1 - inBox} z={t > E.drop + .1 ? 3 : 6} shadow={false} origin="50% 50%" /> : null}
          <div style={{ position: "absolute", left: 0, width: 1080, top: F0.label, textAlign: "center", fontSize: 36, fontWeight: 500, color: GREY, zIndex: 7 }}>Korvane Turbo</div>
          {/* panel 1–3 */}
          <Tracking t={t} />
          <Review t={t} />
          <Slot t={t} fill={clamp(fill * 1.4)} />
          {t > E.supraLand - .35 ? <Cut img={IMG.supra} x={3240 + 150} y={lerp(560, 900, fill)} w={780} z={9} op={clamp((t - E.supraLand + .35) / .1)} /> : null}
          <DashLine pts={linePts(t)} z={6} />
        </div>
        <TrimBurst t={t} at={E.supraLand} x={540} y={1090} r0={170} r1={260} n={10} color={INK} w={6} dur={0.38} />
        {t > 12.0 ? <Chip x={540} y={1260} h={64} fs={30} z={12} op={eo((t - 12.0) / .3)}><span style={{ color: GREY, fontWeight: 500 }}>Illustrative example</span></Chip> : null}
      </Cam>; } },
    // 12.55–18.6: the public build page; the Korvane row lights, then expands into one record
    { a: E.push1, b: E.whip, out: TR.whipL(0.45), render: t => {
      const hx = 690, hy = 905; // canvas point of the "Korvane" word in the expanded record (measured from the review still)
      return <Cam s={1 + .02 * seg(t, 12.5, 18.6)}>
        <Device x={150} y={450} w={780} z={10}><BuildPage t={t} /></Device>
        {t > E.tap - .7 ? <Cursor x={lerp(860, hx, eio(seg(t, E.tap - .7, E.tap - .05)))} y={lerp(1300, hy, eio(seg(t, E.tap - .7, E.tap - .05)))} t={t} click={E.tap} op={clamp((t - E.tap + .7) / .15)} /> : null}
        <Chip x={540} y={386} h={52} fs={26} z={12} bg={SOFT} style={{ boxShadow: "none", border: "1px solid rgba(0,0,0,.06)" }}><span style={{ color: GREY, fontWeight: 500 }}>Illustrative example</span></Chip>
      </Cam>; } },
    // 18.6–21: the supplier page (concept), labelled for the whole beat
    { a: E.whip, b: E.pullBack, render: t => <Cam s={1 + .02 * seg(t, 18.6, 21)}>
      <Device x={150} y={450} w={780} z={10}><SupplierPage t={t} /></Device>
      <Chip x={540} y={384} h={58} fs={30} z={14} bg={SOFT} color={GREY} style={{ boxShadow: "none", border: "1px solid rgba(0,0,0,.06)" }}>Concept · in development</Chip>
    </Cam> },
    // 21–28: pull back to the turbo; the line now ends on the Supra; then the box slides back under it (frame 0)
    { a: E.pullBack, b: TL.dur + 1, render: t => {
      const shrink = eio(seg(t, E.pullBack, E.pullBack + .55));
      const home = sp(t, E.turboHome - .1, 170, 19);
      const tileP = sp(t, E.endTile, 220, 18);
      const ret = eio(seg(t, E.retract, E.retract + .55));
      const lineP = eo(seg(t, E.lineDraw, E.lineDraw + .7)) * (1 - ret);
      const box = sp(t, E.boxBack, 190, 18);
      const lineEnd = [lerp(150, 760, lineP), 1160];
      return <Cam s={1}>
        {shrink < 1 ? <div style={{ position: "absolute", inset: 0, opacity: 1 - shrink, transform: `scale(${1 - .82 * shrink})`, transformOrigin: "300px 820px" }}>
          <Device x={150} y={450} w={780} z={10}><SupplierPage t={t} /></Device></div> : null}
        {/* "Delivered" stop on the left, the line, the Supra tile on the right */}
        <div style={{ position: "absolute", left: 70, top: 1128, zIndex: 5, opacity: clamp(lineP * 3), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: INK, display: "grid", placeItems: "center" }}><Icon n="check" s={22} c="#fff" sw={2.8} /></div><div style={{ fontSize: 28, fontWeight: 600, color: GREY }}>Delivered</div></div>
        {lineP > 0 ? <DashLine pts={[[150, 1160], lineEnd]} z={4} /> : null}
        {tileP > 0 && ret < 1 ? <div style={{ position: "absolute", left: 760, top: 1060, width: 260, height: 200, borderRadius: 30, background: "#fff", boxShadow: "0 20px 50px -20px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.05)", zIndex: 6, opacity: clamp(tileP * 1.5) * (1 - ret), transform: `scale(${(.8 + .2 * tileP) * (1 - .2 * ret)})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 130, borderRadius: "30px 30px 0 0", background: "linear-gradient(160deg,#F7F7F9,#E6E6EB)" }}><Img src={src(IMG.supra)} style={{ position: "absolute", left: "6%", top: "18%", width: "88%" }} /></div>
          <div style={{ position: "absolute", left: 18, bottom: 16, fontSize: 24, fontWeight: 600 }}>Installed</div></div> : null}
        {box > 0 ? <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - box) * 1100}px)` }}><ShipBox t={t} {...F0.box} closed={false} /></div> : null}
        <Cut img={IMG.turboKit} x={F0.turbo.x} y={F0.turbo.y} w={F0.turbo.w} s={lerp(.35, 1, home)} op={clamp(home * 2)} z={6} shadow={false} origin="50% 50%" />
        <div style={{ position: "absolute", left: 0, width: 1080, top: F0.label, textAlign: "center", fontSize: 36, fontWeight: 500, color: GREY, zIndex: 7, opacity: t < E.ctaHead ? clamp(home) * (1 - seg(t, 21.2, 21.4)) : seg(t, E.textOut, E.textOut + .33) }}>Korvane Turbo</div>
      </Cam>; } },
  ];
  return <Studio>
    <Shots t={t} shots={shots} />
    <Heads t={t} /><CTA t={t} />
    <Captions t={t} cues={CUES} />
    {check ? <Guides /> : null}
  </Studio>;
};
