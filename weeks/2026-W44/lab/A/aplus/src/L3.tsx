// @ts-nocheck
// A-L3 Parts suppliers: a guess can become the answer to "what turbo is that?" (hook 1). 120 BPM.
import React from "react";
import { Film, Headline, Photo, Cut, Box, Img, Tag, track, prog, E, mono, ui, fit, UI, MONO } from "./lib";
import { valueIn, StrikeReplace, Caret } from "./remocn";
import VO from "./vo.json";

export const PAL3 = { bg: "#1D1B20", tx: "#F3ECE2", em: "#C8B4E8", pn: "#36313C" };
const pal = PAL3;
const CAR = "car-01", CAR_A = 1272 / 522, KIT = "part-01", KIT_A = 831 / 570;

const Q = { size: 92 }, QE = { size: 92, color: pal.em };
const HEAD = [
  [0, "GUESS → ANSWER?"], [2, "\"BRAND B, I THINK\""], [3, "\"BRAND B\""], [4, "A GUESS…", Q], [5, "A GUESS…\n…BECOMES THE ANSWER", Q],
  [6, "WHAT'S MISSING?"], [7, "THE BRAND"], [8, "NAME IT ON THE BUILD"], [9, "PART: TURBO KIT"], [10, "BRAND: DEMO BRAND A"],
  [11, "ON THIS BUILD"], [13, "PART + BRAND"], [14, "FuelMyBuild"], [15, "PARTS REGISTRY"], [16, "BUILD PAGE"], [17, "PUBLIC BUILD LINK"],
  [18, "\"WHAT TURBO IS THAT?\""], [19, "REPLY WITH THE\nBUILD LINK", Q], [20, "LESS GUESSWORK"], [21, "MORE CONTEXT"],
  [22, "WHAT PART", QE], [23, "WHAT PART\nGETS MISIDENTIFIED", QE], [24, "WHAT PART\nGETS MISIDENTIFIED\nTHE MOST?", QE],
];
const lab = (s) => mono(s, { color: pal.em, letterSpacing: "0.02em" });

// generic comment bubble: text only, no avatar/name/time/likes. s: x y o s fs bg dx
const Bubble = ({ s, children, z = 6 }) => {
  if (!s || s.o <= 0.001) return null;
  const fs = s.fs || 54;
  return (
    <div style={{ position: "absolute", left: s.x + (s.dx || 0), top: s.y, opacity: s.o, zIndex: z, transform: `scale(${s.s ?? 1})`, transformOrigin: "0% 100%" }}>
      <div style={{ display: "inline-block", whiteSpace: "nowrap", ...ui(fs, { lineHeight: 1.12 }), padding: `${fs * 0.4}px ${fs * 0.62}px`, borderRadius: fs * 0.62,
        background: `color-mix(in srgb, ${pal.pn} ${Math.round((s.bg ?? 1) * 100)}%, transparent)` }}>{children}</div>
    </div>
  );
};
const pop = (t0) => [t0, { o: 1, s: 1 }, 0.32, E.back];

// a label + value field (Plex Mono for part and brand per spec)
const Field = ({ st, label, value, t, tv, color, slotW = 400, caret }) => {
  if (!st || st.o <= 0.001) return null;
  const showV = t >= tv;
  return (
    <div style={{ position: "absolute", left: st.x, top: st.y, opacity: st.o, zIndex: 6 }}>
      {st.ls > 0 && <div style={lab(st.ls)}>{label}</div>}
      {showV ? <div style={{ ...mono(st.vs, { color: color || pal.tx }), ...valueIn(t, t < tv + 0.4 ? tv : null) }}>{value}</div>
        : <div style={{ width: slotW, height: st.vs * 1.3, border: `4px dashed ${pal.tx}88`, boxSizing: "border-box", marginTop: 6, padding: "6px 14px" }}>{caret && <Caret t={t} t0={caret} color={pal.em} w={6} h={st.vs * 0.9} />}</div>}
    </div>
  );
};

export const L3 = () => (
  <Film pal={pal} subs={VO.L3.subs}>
    {(t) => {
      const QB = track(t, { x: 96, y: 410, o: 1, s: 1, dx: 0 }, [
        [4.0, { o: 0, y: 370 }, 0.3], [18.0, { o: 1, y: 420 }, 0], [19.0, { y: 470 }, 0.4, E.inOut], [21.0, { o: 0, y: 430 }, 0.3],
      ]);
      const R1 = track(t, { x: 230, y: 560, o: 0, s: 0.6, dx: 0 }, [
        pop(0.0),
        [1.0, { x: 386, y: 572 }, 0.5, E.inOut],
        [3.0, { o: 0.35 }, 0.25],
        [4.0, { x: 96, y: 470, o: 0.3 }, 0.4, E.inOut],
        [6.0, { dx: 900, o: 0 }, 0.4, E.in],
        [18.0, { x: 386, y: 550, o: 0.45, dx: 0 }, 0],
        [19.0, { y: 600 }, 0.4, E.inOut],
        [20.0, { dx: 700, o: 0 }, 0.45, E.in],
      ]);
      const R2 = track(t, { x: 386, y: 572, o: 0, s: 1, fs: 54, bg: 1, dx: 0 }, [
        [2.0, { o: 1 }, 0.1],
        [2.0, { x: 300, y: 700 }, 0.4, E.back],
        [4.0, { x: 96, y: 590, fs: 132 }, 0.45, E.inOut],
        [5.0, { bg: 0, x: 40 }, 0.35],
        [6.0, { dx: -900, o: 0 }, 0.4, E.in],
      ]);
      const LK = track(t, { x: 150, y: 716, o: 0, s: 0.6 }, [pop(19.0), [20.0, { y: 680 }, 0.4, E.inOut], [21.0, { o: 0 }, 0.3]]);
      const PH = track(t, { x: 96, y: 840, w: 784, h: 350, o: 1, cw: 540, cx: 300, cy: 175, dy: 0 }, [
        [6.0, { dy: 450, o: 0 }, 0.4, E.in],
        [16.0, { x: 120, y: 556, w: 736, h: 220, cw: 460, cx: 368, cy: 110, dy: 0, o: 1 }, 0.45, E.inOut],
        [17.0, { h: 160, cw: 340, cy: 80 }, 0.4, E.inOut],
        [18.0, { o: 0 }, 0],
        [21.0, { x: 124, y: 540, w: 728, h: 300, cw: 600, cx: 364, cy: 150, o: 1 }, 0.45, E.inOut],
        [22.0, { o: 0 }, 0.25],
      ]);
      const K = track(t, { x: 540, y: 880, w: 340, h: 290, o: 1, s: 1 }, [
        [6.0, { x: 120, y: 440, w: 740, h: 520 }, 0.45, E.inOut],
        [7.0, { x: 140, y: 420, w: 700, h: 470 }, 0.35, E.out],
        [8.0, { x: 540, y: 520, w: 330, h: 300 }, 0],
        [11.0, { x: 570, y: 630, w: 290, h: 230 }, 0.45, E.inOut],
        [13.0, { o: 0.4 }, 0.3],
        [14.0, { o: 1, y: 690 }, 0.45, E.inOut],
        [16.0, { x: 130, y: 860, w: 140, h: 110 }, 0.45, E.inOut],
        [17.0, { y: 790 }, 0.4, E.inOut],
        [18.0, { o: 0 }, 0],
        [22.0, { x: 170, y: 552, w: 640, h: 310, o: 1 }, 0.45, E.out],
      ]);
      const MP = track(t, { x: 96, y: 400, w: 784, h: 790, o: 0 }, [[8.0, { o: 1 }, 0], [18.0, { o: 0 }, 0]]);
      const PL = track(t, { x: 130, y: 430, o: 0, ls: 52 }, [[8.0, { o: 1 }, 0], [11.0, { y: 540 }, 0.45, E.inOut], [14.0, { y: 590 }, 0.45, E.inOut],
        [16.0, { y: 794, ls: 44 }, 0.45, E.inOut], [17.0, { y: 730 }, 0.4, E.inOut], [18.0, { o: 0 }, 0]]);
      const PF = track(t, { x: 130, y: 530, o: 0, ls: 52, vs: 72 }, [[8.0, { o: 1 }, 0], [11.0, { y: 610, vs: 64 }, 0.45, E.inOut], [13.0, { vs: 76 }, 0.3],
        [14.0, { y: 660, vs: 64 }, 0.45, E.inOut], [16.0, { x: 290, y: 850, ls: 0, vs: 52 }, 0.45, E.inOut], [17.0, { y: 782 }, 0.4, E.inOut], [18.0, { o: 0 }, 0]]);
      const BF = track(t, { x: 130, y: 880, o: 0, ls: 52, vs: 72 }, [[8.0, { o: 1 }, 0], [11.0, { y: 790, vs: 64 }, 0.45, E.inOut], [13.0, { y: 800, vs: 76 }, 0.3],
        [14.0, { y: 840, vs: 64 }, 0.45, E.inOut], [16.0, { x: 290, y: 912, ls: 0, vs: 52 }, 0.45, E.inOut], [17.0, { y: 844 }, 0.4, E.inOut], [18.0, { o: 0 }, 0]]);
      const TI = track(t, { x: 130, y: 424, o: 0 }, [[11.0, { o: 1 }, 0.35], [13.0, { o: 0.4 }, 0.3], [14.0, { o: 1, y: 484 }, 0.45, E.inOut], [16.0, { y: 478 }, 0.4], [18.0, { o: 0 }, 0]]);
      const TG = track(t, { x: 550, y: 428, o: 0 }, [[8.0, { o: 1 }, 0], [14.0, { y: 414 }, 0.45, E.inOut], [18.0, { o: 0 }, 0]]);
      const URL = track(t, { x: 120, y: 1070, w: 736, h: 96, o: 0 }, [[16.0, { o: 1 }, 0.3], [17.0, { y: 920, h: 252 }, 0.45, E.back], [18.0, { o: 0 }, 0]]);
      const RC = track(t, { x: 96, y: 880, w: 784, h: 300, o: 0 }, [[18.0, { o: 1 }, 0], [19.0, { y: 900, h: 290 }, 0.4, E.inOut],
        [21.0, { y: 440, h: 750 }, 0.45, E.inOut], [22.0, { y: 872, h: 200 }, 0.45, E.inOut]]);
      const rcMode = t < 21 ? "card" : t < 22 ? "full" : "mini";
      const lineP = t >= 12 && t < 14 ? Math.min(prog(t, 12.0, 0.4), 1 - prog(t, 13.8, 0.2)) : 0;
      const EBF = track(t, { o: 0, dy: 40 }, [[7.0, { o: 1, dy: 0 }, 0.3, E.out], [8.0, { o: 0 }, 0]]);
      return (
        <>
          <Headline t={t} cues={HEAD} pal={pal} />
          {/* 0-6 the argument */}
          <Photo s={{ ...PH, y: PH.y + PH.dy }} name={CAR} aspect={CAR_A} pal={pal} z={t >= 21 ? 4 : 2} />
          {/* mockup crop / build page (8-18) */}
          <Box s={MP} v z={1} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}38` }}>
            {t >= 14 && <span style={{ position: "absolute", left: 34, top: 14, ...ui(56), ...valueIn(t, t < 14.4 ? 14 : null) }}>FuelMyBuild</span>}
          </Box>
          <Cut s={K} name={KIT} aspect={KIT_A} z={4} />
          <Box s={{ x: 96, y: 930, w: 784, h: 220, o: EBF.o, dy: EBF.dy }} z={5}>
            <div style={lab(52)}>BRAND</div>
            <div style={{ height: 120, border: `4px dashed ${pal.tx}88`, boxSizing: "border-box", marginTop: 8, padding: "18px 24px" }}><Caret t={t} t0={7} color={pal.em} w={8} h={76} /></div>
          </Box>
          <div style={{ position: "absolute", left: TI.x, top: TI.y, opacity: TI.o, ...ui(64), zIndex: 6 }}>’99 Supra</div>
          {TG.o > 0 && <div style={{ position: "absolute", left: TG.x, top: TG.y, zIndex: 6 }}><Tag pal={pal} size={44} /></div>}
          {PL.o > 0 && <div style={{ position: "absolute", left: PL.x, top: PL.y, zIndex: 6, ...lab(PL.ls), borderBottom: `3px solid ${pal.tx}44`, paddingBottom: 6, width: 720 }}>{t >= 15 ? <span style={valueIn(t, t < 15.4 ? 15 : null)}>PARTS REGISTRY</span> : "PARTS"}</div>}
          <Field st={PF} label="PART" value="Turbo kit" t={t} tv={9} />
          <Field st={BF} label="BRAND" value="Demo Brand A" t={t} tv={10} color={pal.em} slotW={600} />
          {lineP > 0 && <div data-v="1" style={{ position: "absolute", left: 111, width: 6, top: TI.y + 70, height: (BF.y + 150 - TI.y - 70) * lineP, background: pal.em, zIndex: 6 }} />}
          <Box s={URL} v z={7} style={{ background: pal.bg, border: `5px solid ${pal.em}`, padding: t < 17 ? "10px 18px" : "20px 26px" }}>
            <div style={lab(t < 17 ? 44 : 48)}>PUBLIC URL · DEMO</div>
            {t >= 17 && <div style={{ ...mono(58), ...valueIn(t, 17.05), marginTop: 10, lineHeight: 1.22 }}>fuelmybuild.com/<br />demo-supra</div>}
          </Box>
          {/* 18-28 the record outside the mockup */}
          <Box s={RC} v z={3} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}38`, padding: rcMode === "mini" ? "16px 28px" : "22px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={ui(rcMode === "mini" ? 48 : 54)}>’99 Supra</span><Tag pal={pal} size={44} /></div>
            {rcMode === "mini" ? <>
              <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginTop: 6 }}><span style={lab(44)}>PART</span><span style={mono(48)}>Turbo kit</span></div>
              <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}><span style={lab(44)}>BRAND</span><span style={mono(48, { color: pal.em })}>Demo Brand A</span></div>
            </> : <div style={{ display: "flex", gap: 26, alignItems: "center", marginTop: rcMode === "full" ? 340 : 16 }}>
              <div style={{ width: rcMode === "full" ? 220 : 170, height: rcMode === "full" ? 220 : 170, background: pal.bg, padding: 12, boxSizing: "border-box" }}><Img name={KIT} style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
              <div>
                {rcMode === "full" && <div style={lab(44)}>PART</div>}<div style={mono(rcMode === "full" ? 64 : 56)}>Turbo kit</div>
                {rcMode === "full" && <div style={{ ...lab(44), marginTop: 10 }}>BRAND</div>}<div style={mono(rcMode === "full" ? 64 : 56, { color: pal.em })}>Demo Brand A</div>
              </div>
            </div>}
          </Box>
          {/* bubbles sit outside any mockup */}
          <Bubble s={QB}>What turbo is that?</Bubble>
          <Bubble s={R1}>Brand B, I think.</Bubble>
          <Bubble s={R2} z={7}>{t < 3 ? "Brand B, I think." : <StrikeReplace t={t} t0={3.0} dur={0.75} from="Brand B, I think." to="Brand B" lineColor={pal.tx} />}</Bubble>
          <Bubble s={LK}><span style={{ display: "block" }}>fuelmybuild.com/demo-supra</span><span style={{ display: "block", ...mono(44, { opacity: 0.8 }) }}>(DEMO)</span></Bubble>
          {t >= 25 && <div style={{ position: "absolute", left: 96, top: 1080, width: 784, ...ui(50), lineHeight: 1.12, zIndex: 8 }}>
            <div style={valueIn(t, 25)}>FOLLOW FuelMyBuild</div>
            {t >= 26 && <div style={valueIn(t, 26)}>BETTER BUILD RECORDS</div>}
          </div>}
        </>
      );
    }}
  </Film>
);
