// @ts-nocheck
// B-L1 · Collectors · The work the photo misses (Maya, orange '72 240Z = car-05, brake kit = part-06 in the UI; real photos from img/lab for the wheel, wheel-off assembly and log)
import React from "react";
import { AbsoluteFill } from "remotion";
import { ProductWindow, Cam, Abs, Photo, Tile, Avatar, Bubble, Phone, PHONE_H, Ring, Tap, Chip, Empty, Label, Icon, pop, spring, clamp, lin, eo, eio, mix, IMG, GREY, INK, RED } from "./lib";
import { BuildPage, RowCard, LogCard } from "./fmb";
import { TrimBurst, slideIn, slideOut, drift, swipeX } from "./remocn/ports";
import { zoomBlur } from "./remocn/zoom-blur";
import { whipPan } from "./remocn/whip-pan";
import { focusPull } from "./remocn/focus-pull";
import { pushThrough } from "./remocn/push-through";
import { lensZoom } from "./remocn/lens-zoom";

const CAR = "car-05";
// front-wheel focus inside a 900x640 exterior photo of car-05 (checked on stills)
const WHEEL = { fx: 0.55, fy: 0.72 };
const PH = { x: 90, y: 470, w: 900, h: 640 };
// real photos (kit/remotion/public/img/lab). Wheel close-up 1536x1152 covers the 900x640 frame at 0.586 (17 px cropped top and bottom);
// the caliper shows only in slivers between the right-hand spokes at ~(950, 520) image px -> frame (557, 288)
const WHEEL_PIC = "lab/b-240z-wheel-closeup.jpg", BRAKE = "lab/b-brake-assembly-cutout.png";
const CAL_IN_PH = { x: PH.x + 557, y: PH.y + 288 };

// ---------------------------------------------------------------- A · inquiry + 240Z (0-2, and 29-30 loop)
const Attach = ({ o = 1 }) => (
  <div style={{ marginTop: 18, opacity: o }}><Photo id={CAR} w={330} h={220} r={22} fit={0.9} /><div style={{ fontSize: 26, color: GREY, marginTop: 8 }}>240Z-exterior.jpg</div></div>
);
const Inquiry = ({ attachO = 1, style }) => (
  <Bubble who="Appraisal inquiry" meta="fictional" av="letter:A" w={880} size={40}
    text={<span>Hi Maya, please document the brake work on the 240Z.</span>} attach={<Attach o={attachO} />} style={style} />
);
// attachment thumbnail rect in stage coords (checked on stills)
const TH = { x: 232, y: 760, w: 330, h: 220 };
export const A = ({ t, a }) => {
  const loop = a > 20; const lt = loop ? 0 : t; // 29-30 holds the exact frame-0 pose
  const cam = loop ? [[0, 540, 905, 1]] : [[0, 540, 905, 1], [0.95, 470, TH.y + TH.h / 2 - 40, 1.12]];
  // 1.0: the attached photo opens (shared element) into the full exterior photo
  const p = loop ? 0 : eo(lin(t, 1.0, 1.34)); const sp = loop ? 0 : spring(t, 1.0, 200, 20);
  const [, cx, cy, s] = (() => { const k = cam; if (lt <= k[0][0] || k.length < 2) return k[0]; const q = eio(lin(lt, k[0][0], k[1][0])); return [0, ...k[0].slice(1).map((v, i) => mix(v, k[1][i + 1], q))]; })();
  const sx = (x) => 540 + (x - cx) * s, sy = (y) => 905 + (y - cy) * s;
  const from = { x: sx(TH.x), y: sy(TH.y), w: TH.w * s, h: TH.h * s };
  const r = { x: mix(from.x, PH.x, sp), y: mix(from.y, PH.y, sp), w: mix(from.w, PH.w, sp), h: mix(from.h, PH.h, sp) };
  return (
    <AbsoluteFill>
      <Cam t={lt} keys={cam}>
        <Abs x={100} y={470}><Inquiry attachO={p > 0 ? 0 : 1} /></Abs>
        <Abs x={90} y={1030}><Tile id={CAR} w={900} h={330} r={36} fit={0.62} floor={0.12} /></Abs>
      </Cam>
      {t >= 0.98 && !loop ? <>
        <AbsoluteFill style={{ background: `rgba(245,245,247,${0.92 * p})` }} />
        <Abs x={r.x} y={r.y}><Photo id={CAR} w={r.w} h={r.h} r={mix(22 * s, 34, sp)} fit={0.9} /></Abs>
      </> : null}
      {!loop ? <Tap t={t} t0={1.0} x={sx(TH.x + TH.w / 2)} y={sy(TH.y + TH.h / 2)} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B1 · the exterior photo, Maya's 240Z (2-3)
const MayaChip = ({ t, t0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, ...pop(t, t0, { rise: 26 }) }}>
    <Avatar id={CAR} size={84} bg="#EEE8D6" />
    <div><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-.025em", color: INK }}>Maya</div><div style={{ fontSize: 28, color: GREY }}>’72 240Z · owner</div></div>
  </div>
);
export const B1 = ({ t }) => {
  const land = spring(t, 2.0, 170, 15);
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[2, 540, 905, 1], [3.2, 540, 890, 1.03]]}>
        <Abs x={PH.x} y={PH.y}><Photo id={CAR} w={PH.w} h={PH.h} r={34} fit={0.9} imgStyle={{ translate: `0 ${(1 - land) * -70}px` }} /></Abs>
        <Abs x={PH.x + 10} y={PH.y + PH.h + 40}><MayaChip t={t} t0={2.06} /></Abs>
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B2 · wheel punch-in, caliper, pull back, swipe, freeze (3-8)
const Loupe = ({ t, t0, t1, x, y, R = 175 }) => {
  const p = spring(t, t0, 210, 17); const o = clamp((t - t0) / 0.12) * (1 - lin(t, t1, t1 + 0.25));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", opacity: o, transform: `scale(${0.6 + 0.4 * p})`,
      boxShadow: `0 0 0 8px #fff, 0 0 0 13px ${RED}, 0 18px 24px -12px rgba(0,0,0,.3)`, background: "#EDEDF0" }}>
      <img src={IMG(BRAKE)} style={{ position: "absolute", width: 2 * R * 2.3, left: R - 2 * R * 2.3 * (1040 / 1536), top: R - 2 * R * 2.3 * (690 / 1536) }} />
    </div>
  );
};
const Dots = ({ i, n = 3 }) => <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>{Array.from({ length: n }, (_, k) => <div key={k} style={{ width: 16, height: 16, borderRadius: 8, background: k === i ? INK : "#C7C7CC" }} />)}</div>;
export const B2 = ({ t }) => {
  // crop zoom: punched in on the wheel 3-5, pulled back to the photo's edges by 5.6
  const z = mix(3.0, 1, eio(lin(t, 5.0, 5.6))) * (1 + 0.04 * lin(t, 3, 5));
  const wx = PH.x + WHEEL.fx * PH.w, wy = PH.y + WHEEL.fy * PH.h;
  const sw = t >= 6.0; // 6.0 swipe to another exterior angle
  const fz = eo(lin(t, 7.0, 7.4)); // 7.0 freeze: the gallery collapses, the gap is explicit
  const freezeSnap = 1 + 0.025 * Math.sin(Math.PI * clamp((t - 7.0) / 0.2));
  const g = (k) => ({ x: mix(PH.x, 90 + k * 310, fz), y: mix(PH.y, 520, fz), w: mix(PH.w, 280, fz), h: mix(PH.h, 200, fz) });
  const g0 = g(0), g1 = g(1);
  const edge = lin(t, 5.05, 5.6) * (1 - lin(t, 5.85, 6.0));
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[3, 540, 905, 1], [5, 540, 905, 1.0], [8, 540, 905, 1.02]]}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${freezeSnap})`, transformOrigin: "540px 800px", filter: `saturate(${1 - 0.35 * fz})` }}>
          {/* photo 1: front three-quarter */}
          <Abs x={g0.x} y={g0.y} style={sw && fz === 0 ? { translate: `${swipeX(t, 6.0).out}px` } : {}}>
            <Photo id={CAR} w={g0.w} h={g0.h} r={mix(34, 22, fz)} fit={0.9} zoom={fz > 0 ? 1 : z} fx={WHEEL.fx} fy={WHEEL.fy} />
          </Abs>
          {/* 3-5: the real wheel close-up (slow push toward the caliper); a 4-frame dissolve at 5.0 hands over to the pull-back */}
          {t < 5.14 ? <Abs x={PH.x} y={PH.y} style={{ opacity: 1 - lin(t, 5.0, 5.134) }}>
            <Photo id={WHEEL_PIC} w={PH.w} h={PH.h} r={34} zoom={1 + 0.05 * lin(t, 3, 5)} fx={557 / 900} fy={288 / 640} />
          </Abs> : null}
          {/* photo 2: the other side */}
          {sw ? <Abs x={g1.x} y={g1.y} style={fz > 0 ? {} : { translate: `${swipeX(t, 6.0).in}px` }}><Photo id={CAR} w={g1.w} h={g1.h} r={mix(34, 22, fz)} fit={0.9} flip /></Abs> : null}
          {fz > 0 ? <Abs x={90 + 2 * 310} y={520} style={pop(t, 7.08, { rise: 20 })}><Photo id={CAR} w={280} h={200} r={22} fit={1.25} zoom={1} fx={0.2} fy={0.7} /></Abs> : null}
          {fz > 0 ? <>
            <Abs x={90} y={780} style={pop(t, 7.12)}><Label style={{ fontSize: 34, color: INK, fontWeight: 600 }}>Install photos</Label></Abs>
            <Abs x={90} y={840} style={pop(t, 7.16)}><Empty w={900} h={380} r={34} label="No photos of the work" pulse={0.5 + 0.5 * Math.sin((t - 7) * 6)} /></Abs>
          </> : null}
          {/* 5.0: corner marks trace the photo's edges, no installation detail anywhere */}
          {edge > 0 && fz === 0 ? <div style={{ position: "absolute", left: PH.x - 14, top: PH.y - 14, width: PH.w + 28, height: PH.h + 28, borderRadius: 44, border: `5px solid rgba(134,134,139,${0.8 * edge})` }} /> : null}
        </div>
        {fz === 0 ? <Abs x={0} y={PH.y + PH.h + 44} w={1080}><Dots i={sw ? 1 : 0} /></Abs> : null}
      </Cam>
      {t < 5.4 ? <Loupe t={t} t0={4.0} t1={5.0} x={CAL_IN_PH.x + 60} y={CAL_IN_PH.y - 20} /> : null}
      <TrimBurst t={t} t0={4.0} x={CAL_IN_PH.x + 60} y={CAL_IN_PH.y - 20} inner={190} reach={50} count={10} weight={5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- C · wheel-off illustration (8-13)
// regions inside the 900x900 illustration tile (b-brake-assembly-cutout at fit .8: tile px = 90 + 0.469 * cutout px), checked on stills
const IL = { x: 90, y: 460, w: 900, h: 900 };
const CAL = { x: 500, y: 222, w: 190, h: 440 }, BRK = { x: 422, y: 545, w: 112, h: 112 }, LINE = { x: 618, y: 160, w: 128, h: 410 };
export const C = ({ t }) => {
  const cam = [[8, 540, 910, 1.1], [8.5, 540, 910, 1], [9.0, 540, 910, 1], [9.7, 690, 860, 1.22], [13, 700, 850, 1.26]];
  const focus = t >= 10 ? (t < 11 ? CAL : t < 12 ? BRK : LINE) : null;
  const dim = lin(t, 10.0, 10.25);
  return (
    <AbsoluteFill>
      <Cam t={t} keys={cam}>
        <Abs x={IL.x} y={IL.y}>
          <Tile id={BRAKE} w={IL.w} h={IL.h} r={44} fit={0.8}>
            <div style={{ position: "absolute", left: 300, top: 30 }}><Label>Illustration · wheel off</Label></div>
          </Tile>
          {/* everything but the focused part dims */}
          {focus ? <div style={{ position: "absolute", inset: 0, borderRadius: 44, background: `rgba(245,245,247,${0.62 * dim})`,
            WebkitMaskImage: `radial-gradient(ellipse ${focus.w * 0.75}px ${focus.h * 0.75}px at ${focus.x + focus.w / 2}px ${focus.y + focus.h / 2}px, transparent 60%, #000 100%)` }} /> : null}
          <Ring t={t} t0={10.0} t1={11.0} {...CAL} r={60} />
          <Ring t={t} t0={11.0} t1={12.0} {...BRK} r={40} />
          <Ring t={t} t0={12.0} {...LINE} r={64} />
          <Abs x={CAL.x - 230} y={CAL.y + 40} style={{ ...pop(t, 10.04, { rise: 16 }), opacity: (t < 11 ? 1 : 0) * pop(t, 10.04).opacity }}><Chip>Caliper</Chip></Abs>
          <Abs x={BRK.x - 150} y={BRK.y + 130} style={{ ...pop(t, 11.04, { rise: 16 }), opacity: (t >= 11 && t < 12 ? 1 : 0) }}><Chip>Bracket</Chip></Abs>
          <Abs x={LINE.x - 300} y={LINE.y - 50} style={{ ...pop(t, 12.1, { rise: 16 }), opacity: t >= 12 ? 1 : 0 }}><Chip>Brake line</Chip></Abs>
        </Abs>
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D · inquiry + three empty evidence slots (13-15)
export const D = ({ t }) => {
  const pulse = 0.5 + 0.5 * Math.sin((t - 14) * 5.5) * lin(t, 14, 14.2);
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[13, 540, 905, 1.04], [13.6, 540, 905, 1], [15, 540, 920, 1.03]]}>
        <Abs x={100} y={480} style={slideIn(t, 13.0)}><Bubble who="Appraisal inquiry" meta="fictional" av="letter:A" w={880} size={40} text="Hi Maya, please document the brake work on the 240Z." /></Abs>
        {["Before", "During", "After"].map((l, k) => (
          <Abs key={k} x={90 + k * 310} y={860} style={pop(t, 13.12 + k * 0.1, { rise: 30 })}><Empty w={280} h={360} r={30} label={l} pulse={pulse} /></Abs>
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- E · Maya opens her record (15-17)
const PW = 440, PX = 540 - PW / 2, PY = 470;
const ROWS = [
  { img: "part-06", name: "Brake kit", sub: "Demo Brand A", date: "Mar 12" },
  { img: "part-02", name: "Coilovers", sub: "Demo Brand C", date: "Feb 2" },
  { img: "part-03", name: "15-inch wheels", sub: "Demo Brand D", date: "Jan 18" },
  { img: "part-05", name: "Exhaust", sub: "Demo Brand E", date: "Nov 9" },
];
const Page = (o) => <BuildPage car={CAR} title="’72 240Z" owner="maya.240z" ownerAv={CAR} url="fuelmybuild.com/maya-240z" rows={ROWS} {...o} />;
export const E = ({ t }) => {
  const up = spring(t, 15.0, 120, 17);
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[15, 540, 760, 1], [15.9, 540, 905, 1], [16.0, 540, 905, 1], [17, 540, 820, 1.3]]}>
        <Abs x={PX} y={PY + (1 - up) * 900}><Phone w={PW}><div style={{ position: "absolute", inset: 0, filter: "blur(14px)", opacity: 0.85 }}><Page /></div></Phone></Abs>
      </Cam></ProductWindow>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- F · the record (17-29)
// row 0 of the parts list sits at ~ y 540 pt inside the 402x874 screen
const S = PW / 430, ROW_Y = PY + 14 * S + 556 * S, ROW_X = PX + 14 * S + 16 * S;
// pos = cover-crop focus for the square log thumbs and the 900x720 viewer; tpos = the 280x640 portrait strip (21-22); zoom frames the brake in the thumbs
const PHOTOS = [
  { id: "lab/b-240z-log-before.jpg", label: "Before", pos: [0.46, 0.5], tpos: [0.48, 0.5], zoom: 1.3, fx: 0.49, fy: 0.62 },
  { id: "lab/b-240z-log-during.jpg", label: "During", pos: [0.9, 0.5], tpos: [0.68, 0.5], zoom: 1.3, fx: 0.6, fy: 0.6 },
  { id: "lab/b-240z-log-after.jpg", label: "After", pos: [0.82, 0.5], tpos: [0.62, 0.5], zoom: 1.3, fx: 0.58, fy: 0.58 },
];
const BigPhoto = ({ p, w = 900, h = 720 }) => (
  <div>
    <Photo id={p.id} w={w} h={h} r={40} pos={p.pos} imgStyle={p.imgStyle}>{p.extra}</Photo>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 32, color: GREY, fontWeight: 500 }}><span>March 12 · Brake install</span><span>{p.label}</span></div>
  </div>
);
export const F = ({ t }) => {
  const lift = eo(lin(t, 18.0, 18.45)); const liftS = spring(t, 18.0, 200, 19);
  const rowP = clamp((t - 18.0) / 0.15) * (1 - lin(t, 20.0, 20.3));
  const sheet = spring(t, 20.0, 170, 20); // 20.0 the dated log entry opens as a sheet
  const viewer = t >= 22 && t < 25.0; // 22-25 before / during / after, one by one
  const vIn = spring(t, 22.0, 220, 22), vOut = eo(lin(t, 25.0, 25.35));
  const photoIdx = t < 23 ? 0 : t < 24 ? 1 : 2;
  const cam = [[17, 540, 905, 1.06], [17.6, 540, 905, 1], [26.9, 540, 905, 1], [27.35, 540, 790, 1], [29, 540, 800, 1.02]];
  // enlarged row card flies out of the list
  const card0 = { x: ROW_X, y: ROW_Y, s: (PW - 60) / 880 }, card1 = { x: 100, y: 560, s: 1 };
  const cx = mix(card0.x, card1.x, liftS), cy = mix(card0.y, card1.y, liftS), cs = mix(card0.s, card1.s, liftS);
  const brandF = spring(t, 19.0, 220, 18) * (1 - lin(t, 20.0, 20.25));
  const logY = mix(1500, 470, sheet);
  const ctaP = spring(t, 27.0, 220, 15);
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={cam}>
        <Abs x={PX} y={PY} style={{ opacity: 1 - 0.72 * lift, transform: `scale(${1 - 0.05 * lift})`, transformOrigin: "50% 40%" }}>
          <Phone w={PW}><Page hl={0} hlP={rowP} /></Phone>
        </Abs>
        {t >= 18.0 && t < 20.4 ? (
          <Abs x={cx} y={cy} style={{ transformOrigin: "0 0", transform: `scale(${cs})`, opacity: clamp((t - 18.0) / 0.1) * (1 - lin(t, 20.0, 20.3)) }}>
            <RowCard img="part-06" name="Brake kit" brand="Demo Brand A" date="March 12" brandFocus={brandF} />
          </Abs>) : null}
        {t >= 20.0 ? (
          <Abs x={100} y={logY}>
            <LogCard date="March 12" title="Brake install" note="Front calipers, brackets and braided brake lines replaced." photos={PHOTOS}
              photoP={[0, 1, 2].map((k) => spring(t, 20.25 + k * 0.1, 200, 18))} />
          </Abs>) : null}
        {t >= 20.7 && t < 21.5 ? <Tap t={t} t0={21.0} x={540} y={980} /> : null}
      </Cam></ProductWindow>
      {t >= 21 && t < 22.4 ? (
        <AbsoluteFill style={{ background: `rgba(245,245,247,${0.9 * eo(lin(t, 21, 21.3)) * (1 - lin(t, 22.0, 22.3))})` }}>
          {PHOTOS.map((p, k) => { const e = spring(t, 21.0 + k * 0.08, 200, 19); const x0 = 140 + k * 273, y0 = 790, x1 = 90 + k * 310, y1 = 520;
            return <Abs key={k} x={mix(x0, x1, e)} y={mix(y0, y1, e)} style={{ opacity: 1 - lin(t, 22.0, 22.3) }}>
              <Photo id={p.id} w={mix(255, 280, e)} h={mix(255, 640, e)} r={26} pos={p.tpos} zoom={mix(p.zoom || 1, 1, e)} fx={p.fx} fy={p.fy} imgStyle={p.imgStyle}>{p.extra}</Photo>
              <div style={{ fontSize: 32, color: GREY, fontWeight: 500, marginTop: 12, textAlign: "center", width: mix(255, 280, e) }}>{p.label}</div></Abs>; })}
        </AbsoluteFill>) : null}
      {viewer || (t >= 25 && vOut < 1) ? (
        <AbsoluteFill style={{ background: `rgba(245,245,247,${0.94 * vIn * (1 - vOut)})` }}>
          {[0, 1, 2].map((k) => {
            if (k !== photoIdx && !(t >= 23 + (k - 1) && t < 23.4 + (k - 1) && k === photoIdx - 1)) return null;
            const st = k === 0 ? {} : t < 23 + (k - 1) + 0.6 ? slideIn(t, 22 + k) : {};
            const out = k < photoIdx ? slideOut(t, 22 + photoIdx) : {};
            return <Abs key={k} x={90} y={470} style={{ ...st, ...out, opacity: (st.opacity ?? 1) * (out.opacity ?? 1) * vIn * (1 - vOut), transform: `scale(${0.92 + 0.08 * vIn - 0.06 * vOut})` }}><BigPhoto p={PHOTOS[k]} /></Abs>;
          })}
        </AbsoluteFill>) : null}
      {/* CTA (27-29): the Follow button enters below the headline band; the log stays visible beneath */}
      {t >= 27 ? (
        <Abs x={0} y={440} w={1080} style={{ display: "flex", justifyContent: "center", ...pop(t, 27.0, { rise: 20, s0: 0.85 }) }}>
          <Chip red style={{ height: 84, fontSize: 40, padding: "0 46px", transform: `scale(${1 - 0.06 * Math.sin(Math.PI * clamp((t - 27.12) / 0.2))})` }}>
            {t < 27.3 ? "Follow" : <><Icon n="heart" size={34} color="#fff" sw={2.2} /> Following</>}
          </Chip>
        </Abs>) : null}
      <TrimBurst t={t} t0={27.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={0} spread={20} /><TrimBurst t={t} t0={27.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={180} spread={20} seed={7} />
    </AbsoluteFill>
  );
};

export const SHOTS = [
  { C: A, a: 0, b: 2 },
  { C: B1, a: 2, b: 3 },
  { C: B2, a: 3, b: 8, tin: { p: lensZoom({ inRotationTo: -3, outRotationFrom: 357, shakeTranslatePx: 16, inBlurTo: 26, outBlurFrom: 20, lensSteps: 5, blurSamples: 4, inScaleTo: 140, outScaleFrom: 128, inFovTo: 110, outFovFrom: 100 }), L: 20 / 30 } },
  { C: C, a: 8, b: 13 },
  { C: D, a: 13, b: 15, tin: { p: whipPan({ direction: "left", blur: 26 }), L: 0.34 } },
  { C: E, a: 15, b: 17, tin: { p: zoomBlur({ blur: 18 }), L: 0.3 } },
  { C: F, a: 17, b: 29, tin: { p: focusPull({ blur: 18 }), L: 0.46 } },
  { C: A, a: 29, b: 30.5, tin: { p: zoomBlur({ blur: 18 }), L: 0.36 } },
];
