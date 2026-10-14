// @ts-nocheck
// B-L2 · Garages · Same car. Different proof. (Nora = black NA Miata car-19; both shops show the same red Miata car-09; Eli = img/lab/b-tech-eli-cutout; install photos = img/lab Miata engine swap)
import React from "react";
import { AbsoluteFill } from "remotion";
import { ProductWindow, Triptych, Cam, Abs, Photo, Tile, Avatar, Bubble, Phone, Ring, Tap, Chip, Empty, Label, Icon, Caret, typed, pop, spring, clamp, lin, eo, eio, mix, IMG, GREY, INK, RED } from "./lib";
import { BuildPage, AttribCard, LogCard, UrlPill } from "./fmb";
import { TrimBurst, swipeX } from "./remocn/ports";
import { zoomBlur } from "./remocn/zoom-blur";
import { whipPan } from "./remocn/whip-pan";
import { focusPull } from "./remocn/focus-pull";
import { pushThrough } from "./remocn/push-through";
import { lensZoom } from "./remocn/lens-zoom";

const CAR = "car-09", NORA = "car-19";
const TA = { x: 90, y: 540, w: 440, h: 500 }, TB = { x: 550, y: 540, w: 440, h: 500 };
const hitPulse = (t, t0) => 1 + 0.035 * Math.sin(Math.PI * clamp((t - t0) / 0.26));
const ShopLabel = ({ name, letter, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, ...style }}><Avatar id={`letter:${letter}`} size={60} /><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-.025em", color: INK }}>{name}</div></div>
);
// the paired shop tiles; lab = label progress per tile, off = B-tile y offset (for the alignment beat)
const Pair = ({ t, t0 = -1, lab = [1, 1], off = 0, under = null }) => (
  <>
    <Abs x={TA.x} y={TA.y} style={{ transform: `scale(${t0 >= 0 ? hitPulse(t, t0) : 1})` }}><Photo id={CAR} w={TA.w} h={TA.h} r={32} fit={0.9} /></Abs>
    <Abs x={TB.x} y={TB.y + off} style={{ transform: `scale(${t0 >= 0 ? hitPulse(t, t0 + 0.13) : 1})` }}><Photo id={CAR} w={TB.w} h={TB.h} r={32} fit={0.9} /></Abs>
    <Abs x={TA.x + 10} y={TA.y + TA.h + 30} style={{ opacity: clamp(lab[0] * 1.6), transform: `translateY(${(1 - lab[0]) * 24}px)` }}><ShopLabel name="Shop A" letter="A" /></Abs>
    <Abs x={TB.x + 10} y={TB.y + TB.h + 30 + off} style={{ opacity: clamp(lab[1] * 1.6), transform: `translateY(${(1 - lab[1]) * 24}px)` }}><ShopLabel name="Shop B" letter="B" /></Abs>
    {under}
  </>
);

// ---------------------------------------------------------------- A · same car, different proof (0-2, 29-30)
export const A = ({ t, a }) => {
  const loop = a > 20;
  const lab = loop ? [1, 1] : [spring(t, 1.0, 220, 17), spring(t, 1.12, 220, 17)];
  return (
    <AbsoluteFill>
      <Cam t={loop ? 0 : t} keys={[[0, 540, 905, 1], [2, 540, 880, 1.03]]}><Pair t={t} t0={loop ? -1 : 0} lab={lab} /></Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B · Nora's contact card + typed inquiry (2-4)
const Q = "Who can do an engine swap on my Miata?";
export const B = ({ t }) => (
  <AbsoluteFill>
    <Cam t={t} keys={[[2, 540, 905, 1.04], [2.5, 540, 905, 1], [4, 540, 920, 1.02]]}>
      <Abs x={90} y={500} style={pop(t, 2.0, { rise: 0 })}>
        <div style={{ width: 900, background: "#fff", borderRadius: 44, padding: "34px 40px", display: "flex", gap: 30, alignItems: "center",
          boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 22px 24px -18px rgba(0,0,0,.2)", transform: `translateX(${(1 - spring(t, 2.0, 200, 22)) * 260}px)` }}>
          <Avatar id={NORA} size={150} bg="#E2E4E8" />
          <div><div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-.03em", color: INK }}>Nora</div>
            <div style={{ fontSize: 34, color: GREY }}>’90 Miata · next project</div></div>
        </div>
      </Abs>
      {t >= 2.9 ? <Abs x={90} y={860} style={pop(t, 2.92, { rise: 20 })}>
        <Bubble who="Nora" av={NORA} avBg="#E2E4E8" w={900} size={52} text={<span>{typed(Q, t, 3.0, 3.85)}<Caret t={t} on={t < 4.6} h={46} /></span>} />
      </Abs> : null}
    </Cam>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- C · two garages, same polished Miata, who did the work? (4-8)
export const C = ({ t }) => {
  const al = eo(lin(t, 5.0, 5.3));
  const off = mix(46, 0, spring(t, 5.0, 260, 20));
  const gd = lin(t, 5.0, 5.2) * (1 - 0.6 * lin(t, 6.0, 6.3));
  const cr = [spring(t, 7.0, 210, 18), spring(t, 7.1, 210, 18)];
  const credit = (x, k) => (
    <Abs x={x} y={1160} style={{ opacity: clamp(cr[k] * 1.5), transform: `translateY(${(1 - cr[k]) * 20}px)` }}>
      <div style={{ width: 440, borderRadius: 30, border: "4px dashed rgba(134,134,139,.7)", padding: "20px 24px", background: "rgba(255,255,255,.6)" }}>
        <div style={{ fontSize: 28, color: GREY, fontWeight: 500 }}>Who did the work</div>
        <div style={{ fontSize: 40, color: "#AEAEB2", fontWeight: 600, letterSpacing: "-.02em" }}>No credit</div>
      </div>
    </Abs>);
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[4, 540, 905, 1.05], [4.4, 540, 905, 1], [6.0, 540, 905, 1], [6.6, 540, 1080, 1.06], [8, 540, 1090, 1.07]]}>
        <Pair t={t} t0={4.0} off={off} under={<>
          {gd > 0 ? <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {[TA.y, TA.y + TA.h].map((y, i) => <line key={i} x1={60} x2={1020} y1={y} y2={y} stroke={RED} strokeWidth={3} strokeDasharray="14 10" opacity={gd} />)}
          </svg> : null}
          {credit(TA.x, 0)}{credit(TB.x, 1)}
        </>} />
        <Tap t={t} t0={4.0} x={TA.x + TA.w / 2} y={TA.y + TA.h / 2} /><Tap t={t} t0={4.13} x={TB.x + TB.w / 2} y={TB.y + TB.h / 2} />
      </Cam></ProductWindow>
      <TrimBurst t={t} t0={5.0} x={540} y={TA.y + TA.h / 2} inner={20} reach={46} count={8} weight={5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D · Shop A's gallery (8-10)
const CELLS = [{}, { flip: true }, { zoom: 1.9, fx: 0.3, fy: 0.62 }, { zoom: 1.7, fx: 0.72, fy: 0.55, flip: true }, { zoom: 1.5, fx: 0.5, fy: 0.5 }, { flip: true, zoom: 1.25 }];
const GW = 290, GX = (k) => 90 + (k % 3) * (GW + 15), GY = (k) => 700 + Math.floor(k / 3) * (GW + 15);
export const D = ({ t }) => {
  const op = spring(t, 9.0, 200, 20);
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[8, 540, 905, 1.05], [8.5, 540, 905, 1], [10, 540, 905, 1.02]]}>
        <Abs x={90} y={500} style={pop(t, 8.0, { rise: 20 })}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}><Avatar id="letter:A" size={110} />
            <div><div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.025em", color: INK }}>shop_a.garage</div><div style={{ fontSize: 30, color: GREY }}>Social gallery · fictional account</div></div></div>
        </Abs>
        {CELLS.map((c, k) => <Abs key={k} x={GX(k)} y={GY(k)} style={pop(t, 8.05 + k * 0.05, { rise: 24 })}><Photo id={CAR} w={GW} h={GW} r={18} fit={1.15} {...c} /></Abs>)}
      </Cam>
      {t >= 8.8 ? <Tap t={t} t0={9.0} x={GX(0) + GW / 2} y={GY(0) + GW / 2} /> : null}
      {t >= 9.0 ? <>
        <AbsoluteFill style={{ background: `rgba(245,245,247,${0.94 * clamp(op)})` }} />
        <Abs x={mix(GX(0), 90, op)} y={mix(GY(0), 520, op)}><Photo id={CAR} w={mix(GW, 900, op)} h={mix(GW, 640, op)} r={mix(18, 36, clamp(op))} fit={mix(1.15, 0.9, clamp(op))} /></Abs>
      </> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- E · But who installed the engine? A photo can't answer. (10-14)
export const E = ({ t }) => {
  const shrink = spring(t, 12.0, 160, 20);
  const pw = mix(900, 520, shrink), ph = mix(560, 400, shrink);
  const hold = lin(t, 13.0, 13.3);
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[10, 540, 905, 1.06], [10.4, 540, 905, 1], [14, 540, 905, 1.03]]}>
        <Abs x={90} y={480} style={pop(t, 10.0, { rise: 20 })}><Bubble who="Nora" av={NORA} avBg="#E2E4E8" w={900} size={44} text="Who installed the engine?" /></Abs>
        <Abs x={90} y={mix(720, 760, shrink)}><Photo id={CAR} w={pw} h={ph} r={34} fit={0.9} /></Abs>
        <Abs x={90} y={mix(720, 760, shrink) + ph + 20} style={pop(t, 11.0, { rise: 12 })}><Label>Shop A · finished photo · no install photos</Label></Abs>
        {t >= 12.0 ? <Abs x={630} y={760} style={pop(t, 12.15, { rise: 20 })}>
          <div style={{ width: 360, height: 400, borderRadius: 34, border: `4px dashed rgba(134,134,139,${0.6 + 0.3 * hold})`, background: "rgba(255,255,255,.6)", display: "grid", placeItems: "center", textAlign: "center" }}>
            <div><div style={{ fontSize: 96, fontWeight: 600, color: "#C7C7CC", lineHeight: 1 }}>?</div><div style={{ fontSize: 32, color: GREY, fontWeight: 500, marginTop: 10 }}>Engine install<br />credit</div></div>
          </div></Abs> : null}
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- F · Shop B replies with its public build link (14-16)
const LINK = "fuelmybuild.com/shop-b/miata";
export const F = ({ t }) => {
  const press = Math.sin(Math.PI * clamp((t - 15.0) / 0.3));
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[14, 540, 905, 1.05], [14.4, 540, 905, 1], [16, 540, 930, 1.04]]}>
        <Abs x={90} y={500} style={{ opacity: 0.5 }}><Bubble who="Nora" av={NORA} avBg="#E2E4E8" w={900} size={44} text="Who installed the engine?" /></Abs>
        <Abs x={90} y={760} style={pop(t, 14.0, { rise: 30 })}>
          <Bubble who="Shop B" av="letter:B" w={900} size={44} text="Here's the build record for the swap we did." attach={<div style={{ marginTop: 18 }}><UrlPill url={LINK} press={press} style={{ fontSize: 30, height: 70 }} /></div>} />
        </Abs>
        <Tap t={t} t0={15.0} x={400} y={1060} />
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- G/H · the public build (16-24)
const PW = 420, PX = 540 - PW / 2, PY = 470;
const ATTR = (
  <div style={{ margin: "14px 16px 0" }}><div className="list" style={{ margin: 0 }}>
    {[["garage", "Garage", "Shop B"], ["person", "Contributor", "Eli"]].map(([i, l, v], k) => (
      <div key={k} className="row" style={{ minHeight: 52 }}><Icon n={i} size={20} color="rgba(60,60,67,.6)" /><div className="main" style={{ padding: "9px 0" }}><div className="fn sec">{l}</div><div className="body" style={{ fontWeight: 500 }}>{v}</div></div></div>))}
  </div></div>
);
const ROWS = [{ img: "obj/engine-block", name: "Engine install", sub: "Shop B · Eli", date: "Mar 14" }, { img: "part-02", name: "Coilovers", sub: "Demo Brand C", date: "Feb 20" }];
const Page = () => <BuildPage car={CAR} title="’94 Miata" owner="shop-b.garage" ownerAv="letter:B" url={LINK.replace("/miata", "/…")} rows={ROWS} tab={0} header={ATTR} />;
export const G = ({ t }) => {
  const e = spring(t, 16.0, 150, 20);
  const x = mix(260, PX, e), y = mix(1000, PY, e), w = mix(140, PW, e);
  return (
    <AbsoluteFill><ProductWindow>
      <Abs x={x} y={y} style={{ opacity: clamp((t - 16) / 0.12) }}><Phone w={w}><div style={{ position: "absolute", inset: 0, filter: "blur(14px)", opacity: 0.85 }}><Page /></div></Phone></Abs>
    </ProductWindow></AbsoluteFill>
  );
};
// two real install photos, shown whole (4:3 tiles) in the log; tpos = crop focus for the 430x640 portrait enlargement (21-22)
const PHOTOS = [
  { id: "lab/b-miata-engine-hoist.jpg", label: "On the hoist", tpos: [0.72, 0.5] },
  { id: "lab/b-miata-engine-installed.jpg", label: "Installed", tpos: [0.54, 0.5] },
];
export const H = ({ t }) => {
  const lift = eo(lin(t, 18.0, 18.4)); const ls = spring(t, 18.0, 200, 19);
  const fo = [spring(t, 18.0, 220, 18) * (1 - lin(t, 19.0, 19.2)), spring(t, 19.0, 220, 18) * (1 - lin(t, 20.0, 20.2))];
  const sheet = spring(t, 20.0, 170, 20);
  const settle = spring(t, 22.0, 170, 20); // 22: attribution + log in one readable view
  const attrY = mix(mix(1100, 520, ls), mix(520, 470, settle), t >= 22 ? 1 : 0);
  const logY = mix(1500, mix(800, 760, settle), sheet);
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[17, 540, 905, 1.06], [17.6, 540, 905, 1], [24, 540, 915, 1.02]]}>
        <Abs x={PX} y={PY} style={{ opacity: 1 - 0.75 * lift, transform: `scale(${1 - 0.05 * lift})`, transformOrigin: "50% 40%" }}><Phone w={PW}><Page /></Phone></Abs>
        {t >= 18 ? <Abs x={100} y={attrY} style={{ opacity: clamp((t - 18) / 0.12), transformOrigin: "50% 0", transform: `scale(${mix(0.6, 1, ls) * (t >= 20 ? mix(1, 0.9, sheet) : 1)})` }}>
          <AttribCard focus={fo} rows={[{ av: "letter:B", label: "Garage", value: "Shop B" }, { av: "eli", avBg: "#E4E6EA", label: "Contributor", value: "Eli", right: "Engine install" }]} /></Abs> : null}
        {t >= 20 ? <Abs x={100} y={logY} style={{ transformOrigin: "50% 0", transform: "scale(0.92)" }}>
          <LogCard date="March 14" title="Engine install" note={t >= 22 ? "By Eli at Shop B. Swap, wiring and first start." : "Swap, wiring and first start."} photos={PHOTOS} aspect={0.75} photoP={[0, 1].map((k) => spring(t, 20.25 + k * 0.1, 200, 18))} />
        </Abs> : null}
      </Cam></ProductWindow>
      {t >= 20.7 && t < 21.4 ? <Tap t={t} t0={21.0} x={540} y={1200} /> : null}
      <Triptych t={t} t0={21.0} t1={22.0} photos={PHOTOS} from={{ x: 176, y: 1006, w: 360, h: 270 }} to={{ y: 520, w: 430, h: 640 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- I · which would you call? CTA, collapse (24-29)
export const I = ({ t }) => {
  const rec = spring(t, 25.0, 200, 18) * (1 - eo(lin(t, 28.0, 28.5)));
  const cta = t >= 26;
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[24, 540, 905, 1.05], [24.4, 540, 905, 1], [25.9, 540, 905, 1], [26.35, 540, 840, 0.94], [28, 540, 840, 0.94], [28.6, 540, 905, 1]]}>
        <Pair t={t} t0={24.0} under={
          <Abs x={TB.x} y={TB.y + TB.h + 100} style={{ opacity: clamp(rec * 1.5), transformOrigin: "50% 0", transform: `translateY(${(1 - rec) * -120}px) scale(${0.6 + 0.4 * rec})` }}>
            <div style={{ width: 440, background: "#fff", borderRadius: 30, padding: "22px 26px", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 18px 22px -16px rgba(0,0,0,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: GREY, fontWeight: 500 }}><Icon n="doc" size={30} color={GREY} />Public build record</div>
              {[["Garage", "Shop B"], ["Contributor", "Eli"], ["Mar 14", "Engine install"]].map(([k, v], i) => <div key={i} style={{ fontSize: 34, color: INK, marginTop: 8, letterSpacing: "-.02em" }}><span style={{ color: GREY }}>{k} · </span><b style={{ fontWeight: 600 }}>{v}</b></div>)}
            </div>
          </Abs>} />
        <Abs x={TA.x} y={TA.y + TA.h + 100} style={{ opacity: clamp(rec * 1.5) }}><Label style={{ width: 440, whiteSpace: "normal", fontSize: 32 }}>Finished photos only</Label></Abs>
      </Cam>
      {cta ? <Abs x={0} y={440} w={1080} style={{ display: "flex", justifyContent: "center", ...pop(t, 26.0, { rise: 20, s0: 0.85 }), opacity: pop(t, 26.0).opacity * (1 - lin(t, 28.0, 28.3)) }}>
        <Chip red style={{ height: 84, fontSize: 40, padding: "0 46px", transform: `scale(${1 - 0.06 * Math.sin(Math.PI * clamp((t - 26.12) / 0.2))})` }}>{t < 26.3 ? "Follow" : <><Icon n="heart" size={34} color="#fff" sw={2.2} /> Following</>}</Chip>
      </Abs> : null}
      <TrimBurst t={t} t0={26.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={0} spread={20} /><TrimBurst t={t} t0={26.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={180} spread={20} seed={7} />
    </AbsoluteFill>
  );
};

export const SHOTS = [
  { C: A, a: 0, b: 2 },
  { C: B, a: 2, b: 4, tin: { p: whipPan({ direction: "left", blur: 26 }), L: 0.3 } },
  { C: C, a: 4, b: 8, tin: { p: zoomBlur({ blur: 18 }), L: 0.3 } },
  { C: D, a: 8, b: 10, tin: { p: whipPan({ direction: "up", blur: 26 }), L: 0.3 } },
  { C: E, a: 10, b: 14, tin: { p: lensZoom({ inRotationTo: -3, outRotationFrom: 357, shakeTranslatePx: 16, inBlurTo: 26, outBlurFrom: 20, lensSteps: 5, blurSamples: 4, inScaleTo: 140, outScaleFrom: 128, inFovTo: 110, outFovFrom: 100 }), L: 20 / 30 } },
  { C: F, a: 14, b: 16, tin: { p: zoomBlur({ blur: 18 }), L: 0.3 } },
  { C: G, a: 16, b: 17 },
  { C: H, a: 17, b: 24, tin: { p: focusPull({ blur: 18 }), L: 0.46 } },
  { C: I, a: 24, b: 29, tin: { p: pushThrough({ zoom: 1.8, blur: 12 }), L: 0.44 } },
  { C: A, a: 29, b: 30.5, tin: { p: zoomBlur({ blur: 18 }), L: 0.36 } },
];
