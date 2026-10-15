// @ts-nocheck
// B-L3 · Suppliers · A guess gets the credit (white '99 Supra = car-01, turbo = part-01 crop, Jules = red RX-7 car-13; install photos = img/lab Supra turbo)
import React from "react";
import { AbsoluteFill } from "remotion";
import { ProductWindow, Triptych, Cam, Abs, Photo, Tile, Avatar, Bubble, Comment, Phone, Ring, Tap, Chip, Label, Icon, Caret, typed, pop, spring, clamp, lin, eo, eio, mix, IMG, GREY, INK, RED } from "./lib";
import { BuildPage, RowCard, LogCard, UrlPill } from "./fmb";
import { TrimBurst, Strike } from "./remocn/ports";
import { zoomBlur } from "./remocn/zoom-blur";
import { whipPan } from "./remocn/whip-pan";
import { focusPull } from "./remocn/focus-pull";
import { pushThrough } from "./remocn/push-through";
import { caretWipe } from "./remocn/caret-wipe";
import { lensZoom } from "./remocn/lens-zoom";

const CAR = "car-01", JULES = "car-13";
const TURBO = { zoom: 2.05, fx: 0.3, fy: 0.475 }; // turbo inside the part-01 kit shot (checked on stills)
const Turbo = ({ w, h = w, r = 34, label = true }) => (
  <Photo id="part-01" w={w} h={h} r={r} bg="linear-gradient(180deg,#FFFFFF 0%,#F4F4F6 60%,#EBEBEE 100%)" {...TURBO}
    zoom={TURBO.zoom * (1 + 0.06 * Math.sin((2 * Math.PI * (window.__T || 0)) / 5))}>{/* slow Ken Burns: 0 at t = 0 and t = 30, moving at the loop seam */}
    {label ? <div style={{ position: "absolute", left: 24, top: 20 }}><Label style={{ fontSize: 28 }}>Turbo · detail</Label></div> : null}
  </Photo>
);
// typing-indicator (remocn ui/typing-indicator): three bouncing dots
const Dots = ({ t }) => (
  <span style={{ display: "inline-flex", gap: 9, padding: "6px 2px" }}>{[0, 1, 2].map((k) => {
    const ph = ((t * 2.2 - k * 0.18) % 1 + 1) % 1; const b = Math.max(0, Math.sin(ph * Math.PI * 2));
    return <span key={k} style={{ width: 16, height: 16, borderRadius: 8, background: "#8E8E93", opacity: 0.45 + 0.55 * b, transform: `translateY(${-6 * b}px)` }} />; })}</span>
);
const JulesQ = ({ t, full = 1, w = 470 }) => (
  <Bubble who={full ? "jules.rx7" : " "} av={JULES} avBg="#EEDDDD" w={w} size={36} text={full ? "What turbo is that?" : <Dots t={t} />} />
);

// ---------------------------------------------------------------- A · who made this turbo? (0-3)
export const A = ({ t }) => {
  const b = pop(t, 1.0, { rise: 30, s0: 0.8 });
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[0, 540, 905, 1], [0.9, 430, 1010, 1.1], [1.2, 430, 1010, 1.1], [1.8, 540, 950, 1.02], [3, 540, 945, 1.03]]}>
        <Abs x={90} y={470}><Tile id={CAR} w={900} h={380} r={40} fit={0.78} floor={0.1} /></Abs>
        <Abs x={90} y={880}><Turbo w={400} /></Abs>
        {t >= 1.0 ? <Abs x={520} y={960} style={b}><JulesQ t={t} full={t >= 2.0 ? 1 : 0} w={470} /></Abs> : null}
      </Cam></ProductWindow>
      {t >= 1.9 ? <Tap t={t} t0={2.0} x={760} y={1080} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B · first reply, next reply, same guess copied (3-11)
const CY = [500, 770, 1040];
const bob = (t, k) => 13 * Math.sin((2 * Math.PI * (t - 3)) / 2.6 + k * 2.1) * lin(t, 3.0, 3.6);
const R1 = "Demo Brand B, I think";
export const B = ({ t }) => {
  const frz = eo(lin(t, 8.0, 8.35));
  const grey = lin(t, 5.0, 5.25);
  const r1 = typed(R1, t, 4.0, 4.85);
  const brand1 = r1.slice(0, 12), rest1 = r1.slice(12);
  const firm = 1 + 0.05 * Math.sin(Math.PI * clamp((t - 7.0) / 0.22));
  const al = t >= 9.0; const tr = eo(lin(t, 10.0, 10.55));
  // brand-name boxes (stage coords) for the alignment + copy trace
  const B1 = { x: 212, y: CY[1] + 58 + bob(t, 1), w: 324, h: 72 }, B2 = { x: 426, y: CY[2] + 58 + bob(t, 2), w: 324, h: 72 }; // ride their rows' bob
  const path = `M ${B1.x + B1.w} ${B1.y + B1.h / 2} C ${B1.x + B1.w + 260} ${B1.y + 20}, ${B2.x + B2.w + 200} ${B2.y - 40}, ${B2.x + B2.w + 8} ${B2.y + B2.h / 2}`;
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[3, 540, 905, 1.05], [3.4, 540, 905, 1], [7.9, 540, 905, 1.045], [8.4, 540, 860, 0.92], [11, 540, 860, 0.95]]}>
        <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.5 * frz})` }}>
          {/* rows bob gently from 3 s; the 9 s rings, copy trace and chip ride the same bob, so they stay on the brand names */}
          <Abs x={90} y={CY[0] + bob(t, 0)}><Comment who="jules.rx7" av={JULES} avBg="#EEDDDD" meta="3h">What turbo is that?</Comment></Abs>
          <Abs x={90} y={CY[1] + bob(t, 1)} style={pop(t, 3.0, { rise: 30 })}>
            <Comment who="boost.bri" av="car-04" avBg="#DDE3EC" meta="2h">
              {t < 4.0 ? <Dots t={t} /> : <><span>{brand1}</span><span style={{ color: mix(0, 1, grey) ? `rgba(134,134,139,${0.4 + 0.6 * grey})` : undefined, fontStyle: grey > 0.5 ? "italic" : "normal" }}>{rest1}</span>{t < 4.95 ? <Caret t={t} h={50} /> : null}</>}
            </Comment>
          </Abs>
          {t >= 6.0 ? <Abs x={90} y={CY[2] + bob(t, 2)} style={{ ...pop(t, 6.0, { rise: 30 }), transform: `${pop(t, 6.0, { rise: 30 }).transform} scale(${firm})` }}>
            <Comment who="k.yamada" av="car-12" avBg="#E7E7E7" meta="1h">
              {t < 7.0 ? <Dots t={t} /> : <Strike t={t} t0={7.0} dur={0.55} from={<span style={{ color: GREY }}>Demo Brand B, I think</span>} to={<b style={{ fontWeight: 600 }}>Definitely Demo Brand B.</b>} fontSize={48} />}
            </Comment>
          </Abs> : null}
          {al ? <><Ring t={t} t0={9.0} {...B1} r={18} sw={5} /><Ring t={t} t0={9.08} {...B2} r={18} sw={5} /></> : null}
          {tr > 0 ? <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={path} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tr} />
            {tr > 0.95 ? <path d={`M ${B2.x + B2.w + 8} ${B2.y + B2.h / 2} l 26 -22 M ${B2.x + B2.w + 8} ${B2.y + B2.h / 2} l 32 10`} stroke={RED} strokeWidth={6} strokeLinecap="round" fill="none" /> : null}
          </svg> : null}
          {tr > 0 ? <Abs x={800} y={CY[1] + 160 + bob(t, 1)} style={pop(t, 10.25, { rise: 12 })}><Chip style={{ height: 60, fontSize: 30 }}>Copied</Chip></Abs> : null}
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- C · Brand B gets the credit (11-13)
export const C = ({ t }) => {
  const sl = spring(t, 11.0, 190, 20); const stop = eo(lin(t, 12.0, 12.25));
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[11, 540, 905, 1.04], [11.4, 540, 905, 1], [13, 540, 905, 1.03]]}>
        <Abs x={90} y={560}><Turbo w={460} h={560} /></Abs>
        <Abs x={mix(1100, 570, sl)} y={700}>
          <div style={{ width: 430, padding: "26px 28px", borderRadius: 34, background: mix(0, 1, stop) ? "#E9E9EB" : "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 18px 22px -16px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize: 28, color: GREY, fontWeight: 500 }}>{stop > 0.5 ? "Comment claim" : "Credited to"}</div>
            <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-.03em", color: INK, lineHeight: 1.12, whiteSpace: "nowrap" }}>{stop > 0.5 ? "“Demo Brand B”" : "Demo Brand B"}</div>
          </div>
        </Abs>
        {t >= 12 ? <Abs x={570} y={920} style={pop(t, 12.1, { rise: 14 })}><Label style={{ whiteSpace: "normal", width: 410 }}>From two comments, not from the build record</Label></Abs> : null}
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D · where's the owner's record? (13-16)
const LINK = "fuelmybuild.com/kai-supra";
export const D = ({ t }) => {
  const press = Math.sin(Math.PI * clamp((t - 15.0) / 0.3));
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[13, 540, 905, 1.04], [13.4, 540, 905, 1], [16, 540, 925, 1.03]]}>
        <Abs x={90} y={480} style={pop(t, 13.0, { rise: 20 })}><Comment who="jules.rx7" av={JULES} avBg="#EEDDDD" meta="3h">What turbo is that?</Comment></Abs>
        <Abs x={90} y={690}><Tile id={CAR} w={900} h={330} r={36} fit={0.7} floor={0.1}>
          <div style={{ position: "absolute", left: 24, top: 20, display: "flex", alignItems: "center", gap: 12 }}><Avatar id={CAR} size={52} /><Label style={{ color: INK, fontWeight: 600 }}>kai.supra</Label><Label>· owner’s post</Label></div></Tile></Abs>
        {t >= 14 ? <Abs x={90} y={1060} style={pop(t, 14.0, { rise: 24 })}>
          <div style={{ fontSize: 30, color: GREY, fontWeight: 500, marginBottom: 12 }}>Owner’s build, linked on the post</div>
          <UrlPill url={LINK} press={press} />
        </Abs> : null}
        <Tap t={t} t0={15.0} x={360} y={1150} />
      </Cam>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- E/F · the Supra's build (16-21), then the log (21-26)
const PW = 430, PX = 540 - PW / 2, PY = 470;
const ROWS = [
  { img: "part-01", name: "Turbo kit", sub: "Demo Brand A", date: "Mar 14" },
  { img: "part-02", name: "Coilovers", sub: "Demo Brand C", date: "Apr 2" },
  { img: "part-03", name: "18-inch wheels", sub: "Demo Brand D", date: "Apr 3" },
  { img: "part-04", name: "Intake", sub: "Demo Brand E", date: "Apr 19" },
];
const Page = (o) => <BuildPage car={CAR} title="White ’99 Supra" owner="kai.supra" ownerAv={CAR} url={LINK} rows={ROWS} {...o} />;
export const E = ({ t }) => {
  const e = spring(t, 16.0, 150, 20);
  return (
    <AbsoluteFill><ProductWindow>
      <Abs x={mix(130, PX, e)} y={mix(1100, PY, e)} style={{ opacity: clamp((t - 16) / 0.12) }}><Phone w={mix(140, PW, e)}><div style={{ position: "absolute", inset: 0, filter: "blur(14px)", opacity: 0.85 }}><Page /></div></Phone></Abs>
    </ProductWindow></AbsoluteFill>
  );
};
const S = PW / 430, ROW_Y = PY + 14 * S + 556 * S, ROW_X = PX + 14 * S + 16 * S;
export const F = ({ t }) => {
  const lift = eo(lin(t, 18.0, 18.45)); const ls = spring(t, 18.0, 200, 19);
  const rowP = clamp((t - 18.0) / 0.15);
  const cx = mix(ROW_X, 100, ls), cy = mix(ROW_Y, 600, ls), cs = mix((PW - 60) / 880, 1, ls);
  const bf = spring(t, 19.0, 220, 18); const rev = eo(lin(t, 20.0, 20.3));
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[17, 540, 905, 1.06], [17.6, 540, 905, 1], [21, 540, 905, 1.02]]}>
        <Abs x={PX} y={PY} style={{ opacity: 1 - 0.72 * lift, transform: `scale(${1 - 0.05 * lift})`, transformOrigin: "50% 40%" }}><Phone w={PW}><Page hl={0} hlP={rowP} /></Phone></Abs>
        {t >= 18 ? <Abs x={cx} y={cy} style={{ transformOrigin: "0 0", transform: `scale(${cs})`, opacity: clamp((t - 18) / 0.1) }}>
          <RowCard img="part-01" name="Turbo kit" brand="Demo Brand A" date="March 14" brandFocus={bf} brandReveal={rev} />
        </Abs> : null}
      </Cam></ProductWindow>
    </AbsoluteFill>
  );
};
// two real install photos (img/lab), cover-cropped to 0.66-high tiles in the log (keeps the old card height above the subtitles); tpos = crop focus on the turbo for the 430x640 enlargement (23-24)
const PHOTOS = [
  { id: "lab/b-supra-turbo-during.jpg", label: "During", tpos: [0.2, 0.5] },
  { id: "lab/b-supra-turbo-after.jpg", label: "After", tpos: [0.16, 0.5] },
];
export const G = ({ t }) => {
  const settle = spring(t, 24.0, 170, 20); // 24: pull back to the parts row + log context
  const cmp = spring(t, 25.0, 190, 20);   // 25: the tentative comment beside the recorded brand
  const logY = mix(520, 860, settle);
  const rowY = mix(-500, 470, settle);
  return (
    <AbsoluteFill>
      <ProductWindow><Cam t={t} keys={[[21, 540, 905, 1], [26, 540, 905, 1.02]]}>
        <Abs x={100} y={rowY} style={{ transformOrigin: "50% 0", transform: `scale(${0.82})`, opacity: settle * (1 - cmp) }}>
          <RowCard img="part-01" name="Turbo kit" brand="Demo Brand A" date="March 14" />
        </Abs>
        <Abs x={100} y={logY} style={{ opacity: 1 - cmp, transformOrigin: "50% 0", transform: `scale(${mix(1, 0.86, settle)})` }}>
          <LogCard date="March 14" title="Turbo install" note="Turbo, wastegate and vacuum lines installed. Photos below." photos={PHOTOS} aspect={0.66}
            photoP={[0, 1].map((k) => spring(t, 21.25 + k * 0.1, 200, 18))} />
        </Abs>
        <Ring t={t} t0={22.0} t1={23.0} x={130} y={logY + 70} w={820} h={90} r={22} sw={5} />
        {t >= 25 ? <>
          <Abs x={90} y={500} style={pop(t, 25.0, { rise: 24 })}><Comment who="boost.bri" av="car-04" avBg="#DDE3EC" meta="2h"><span>Demo Brand B, </span><i style={{ color: GREY }}>I think</i></Comment></Abs>
          <Abs x={100} y={800} style={pop(t, 25.1, { rise: 24 })}><RowCard img="part-01" name="Turbo kit" brand="Demo Brand A" date="March 14" brandFocus={0.6} /></Abs>
          <Abs x={110} y={748} style={pop(t, 25.2, { rise: 10 })}><Label style={{ fontSize: 28 }}>Owner’s record</Label></Abs>
        </> : null}
      </Cam></ProductWindow>
      {t >= 22.7 && t < 23.4 ? <Tap t={t} t0={23.0} x={540} y={940} /> : null}
      <Triptych t={t} t0={23.0} t1={24.0} photos={PHOTOS} from={{ x: 140, y: 792, w: 391, h: 258 }} to={{ y: 520, w: 430, h: 640 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- H · which brand gets misnamed? CTA, restore opening (26-30)
export const H = ({ t }) => {
  const q = spring(t, 27.0, 200, 18);
  const restore = t >= 29;
  const cta = t >= 28;
  return (
    <AbsoluteFill>
      <Cam t={t} keys={[[26, 540, 905, 1.04], [26.4, 540, 905, 1], [27.9, 540, 905, 1], [28.35, 540, 860, 0.97], [30, 540, 860, 0.97]]}>
        {!restore ? <>
          <Abs x={90} y={500}><Comment who="jules.rx7" av={JULES} avBg="#EEDDDD" meta="3h">What turbo is that?</Comment></Abs>
          <Abs x={90} y={740} style={{ opacity: 0.55 }}><Comment who="boost.bri" av="car-04" avBg="#DDE3EC" meta="2h"><span>Demo Brand B, </span><i style={{ color: GREY }}>I think</i></Comment></Abs>
          {t >= 27 ? <Abs x={90} y={1000} style={pop(t, 27.0, { rise: 24 })}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Turbo w={250} r={26} label={false} />
              <div style={{ width: 630, height: 120, borderRadius: 60, background: "#fff", display: "flex", alignItems: "center", padding: "0 34px", fontSize: 38, color: INK,
                boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 12px 22px -14px rgba(0,0,0,.18)" }}>Which part gets misnamed?<Caret t={t} h={42} /></div>
            </div></Abs> : null}
        </> : <>
          <Abs x={90} y={580} style={pop(t, 29.0, { rise: 0, s0: 0.96 })}><Turbo w={400} /></Abs>
          <Abs x={520} y={700 + 10 * Math.sin((2 * Math.PI * t) / 2.5)} style={pop(t, 29.06, { rise: 20 })}><JulesQ t={t} w={470} /></Abs>
        </>}
      </Cam>
      {cta ? <Abs x={0} y={440} w={1080} style={{ display: "flex", justifyContent: "center", ...pop(t, 28.0, { rise: 20, s0: 0.85 }) }}>
        <Chip red style={{ height: 84, fontSize: 40, padding: "0 46px", transform: `scale(${1 - 0.06 * Math.sin(Math.PI * clamp((t - 28.12) / 0.2))})` }}>{t < 28.3 ? "Follow" : <><Icon n="heart" size={34} color="#fff" sw={2.2} /> Following</>}</Chip>
      </Abs> : null}
      <TrimBurst t={t} t0={28.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={0} spread={20} /><TrimBurst t={t} t0={28.15} x={540} y={482} inner={170} reach={40} count={3} weight={5} rotation={180} spread={20} seed={7} />
    </AbsoluteFill>
  );
};

export const SHOTS = [
  { C: A, a: 0, b: 3 },
  { C: B, a: 3, b: 11, tin: { p: zoomBlur({ blur: 18 }), L: 0.3 } },
  { C: C, a: 11, b: 13, tin: { p: whipPan({ direction: "left", blur: 26 }), L: 0.3 } },
  { C: D, a: 13, b: 16, tin: { p: lensZoom({ inRotationTo: -3, outRotationFrom: 357, shakeTranslatePx: 16, inBlurTo: 26, outBlurFrom: 20, lensSteps: 5, blurSamples: 4, inScaleTo: 140, outScaleFrom: 128, inFovTo: 110, outFovFrom: 100 }), L: 20 / 30 } },
  { C: E, a: 16, b: 17 },
  { C: F, a: 17, b: 21, tin: { p: focusPull({ blur: 18 }), L: 0.46 } },
  { C: G, a: 21, b: 26, tin: { p: caretWipe({ caretColor: "#F43034", caretWidth: 6, caretHeight: 0.42 }), L: 0.5 } },
  { C: H, a: 26, b: 30.5, tin: { p: pushThrough({ zoom: 1.8, blur: 12 }), L: 0.44 } },
];
