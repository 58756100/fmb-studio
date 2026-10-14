// @ts-nocheck
// A-L2 Garages: the same finished-car photo can hide very different work (hook 1). 105 BPM.
import React from "react";
import { Film, Headline, Photo, Box, Img, Tag, track, prog, E, mono, ui, fit, UI, MONO } from "./lib";
import { valueIn } from "./remocn";
import { Words, Chars, idle, idleT, Stage, Unstage } from "./alive";
// one shared float per host card, so fields and thumbs ride with the card they sit on (job card 5-15, build page 16-28)
const HOST = (t) => (t < 15.5 ? { seed: 3, y: 8, r: 0.15 } : { seed: 5, y: 8, r: 0.15 });
const hostY = (t) => { const h = HOST(t); return idle(t, h.seed, { y: h.y }).y; };
import VO from "./vo.json";

export const PAL2 = { bg: "#22211E", tx: "#F4EBDD", em: "#E9BB62", pn: "#39362F" };
const pal = PAL2;
const CAR = "car-09", CAR_A = 1267 / 569, KIT = "part-06";

const Q = { size: 92 };
const HEAD = [
  [0, "WHICH SHOP?"], [2, "A OR B?"], [4, "NOT ENOUGH TO JUDGE"], [5, "SHOW THE WORK"], [6, "BEHIND THE PHOTO"],
  [8, "BRAKE KIT"], [9, "DATED PHOTO LOG"], [10, "PART + BRAND"], [11, "WHO DID THE WORK?"], [12, "DEMO GARAGE A"],
  [13, "CONTRIBUTOR"], [14, "DEMO CONTRIBUTOR A"], [15, "SAME FINISHED CAR"], [16, "MORE TO JUDGE"], [17, "THE WORK, CONNECTED"],
  [19, "FuelMyBuild"], [20, "BUILD PAGE"], [21, "SHARE THE PUBLIC LINK"],
  [22, "WHAT WORK", Q], [23, "WHAT WORK\nLOOKS EASY…", Q], [24, "WHAT WORK\nLOOKS EASY…\n…UNTIL YOU DO IT?", Q],
];

const lab = (s) => mono(s, { color: pal.em, letterSpacing: "0.02em" });
const HARD = [0, (p) => 1]; // instant change (hard cut back to the opening photo at 15 s)

// a label + value field. st: x y o ls (label size, 0 = hidden) vs (value size) inline (label beside value)
const Field = ({ st, label, value, slot, t, tv, maxW = 736, two }) => {
  if (!st || st.o <= 0.001) return null;
  const vs = value ? fit([two && st.vs >= 64 ? "OCT 12," : value], two ? MONO : UI, st.vs, 44, maxW - (st.inline ? label.length * st.ls * 0.6 + 14 : 0)) : st.vs;
  const showV = value && (tv == null || t >= tv);
  const t0 = tv != null && t < tv + 3 ? tv + 0.03 : null;
  const V = showV ? <span style={{ ...(two ? mono(vs) : ui(vs)), display: "inline-block" }}>{two && st.vs >= 64 ? <><Chars t={t} t0={t0} text="OCT 12," /><br /><Chars t={t} t0={t0 == null ? null : t0 + 0.2} text="2026" /></>
    : two ? <Chars t={t} t0={t0} text={value} /> : <Words t={t} t0={t0} text={value} stagger={3} />}</span>
    : slot ? <div style={{ width: Math.min(maxW, 560), height: 76, border: `4px dashed ${pal.em}`, opacity: 0.7, boxSizing: "border-box", marginTop: 6 }} /> : null;
  return (
    <div style={{ position: "absolute", left: st.x, top: st.y, opacity: st.o, display: st.inline ? "flex" : "block", gap: 14, alignItems: "baseline", zIndex: 6, transform: `translateY(${hostY(t).toFixed(2)}px)` }}>
      {st.ls > 0 && <div style={lab(st.ls)}>{label}</div>}
      {V}
    </div>
  );
};

const Thumb = ({ s, t }) => {
  if (!s || s.o <= 0.001) return null;
  const f = s.f ?? 1;
  return (
    <Box s={s} v z={5} live={{ ...HOST(t), r: 1.4, s: 0.06 }} style={{ background: f > 0 ? pal.bg : "transparent", border: `${5 * f}px solid ${pal.em}` }}>
      <Img name={KIT} style={{ position: "absolute", left: 8 + 8 * f, top: 8 + 8 * f, width: s.w - 2 * (8 + 8 * f) - 10 * f, height: s.h - 2 * (8 + 8 * f) - 10 * f, objectFit: "contain" }} />
      {t >= 9 && t < 9.18 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.85 * (1 - (t - 9) / 0.18) }} />}
    </Box>
  );
};

export const L2 = () => (
  <Film pal={pal} subs={VO.L2.subs}>
    {(t) => {
      const A = track(t, { x: 96, y: 400, w: 784, h: 380, o: 0.7, s: 0.96, cw: 700, cy: 190 }, [
        [0.0, { o: 1, s: 1 }, 0.18, E.back],
        [5.0, { h: 300, cw: 600, cy: 150 }, 0.45, E.inOut],
        [6.0, { h: 220, cw: 440, cy: 110 }, 0.45, E.inOut],
        [8.0, { w: 360, h: 170, cw: 330, cy: 85 }, 0.45, E.inOut],
        [15.0, { x: 96, y: 400, w: 784, h: 380, cw: 700, cy: 190 }, 0],
        [17.0, { h: 260, cw: 520, cy: 130 }, 0.45, E.inOut],
        [18.0, { x: 120, y: 476, w: 736, h: 200, cw: 400, cy: 100 }, 0.45, E.inOut],
        [20.0, { y: 548, h: 160, cw: 320, cy: 80 }, 0.45, E.inOut],
        [21.0, { o: 0 }, 0.2],
        [22.0, { o: 1, y: 626, h: 160 }, 0.4, E.inOut],
      ]);
      const B = track(t, { x: 96, y: 810, w: 784, h: 380, o: 0.6, s: 0.96, cw: 700, cy: 190, dy: 0 }, [
        [0.1, { o: 1, s: 1 }, 0.18, E.back],
        [5.0, { dy: 1100 }, 0.45, E.in],
        [5.5, { o: 0 }, 0],
      ]);
      const O = track(t, { x: 78, y: 588, w: 820, h: 420, o: 0 }, [
        [2.0, { o: 1, y: 382, h: 416 }, 0.4, E.back],
        [3.0, { y: 792 }, 0.32, E.out],
        [3.45, { y: 588, h: 436 }, 0.4, E.inOut],
        [4.0, { o: 0 }, 0.12],
      ]);
      // job folder: the top sheet opens into the record card
      const C = track(t, { x: 96, y: 740, w: 784, h: 450, o: 0, dy: 700 }, [
        [5.0, { o: 1, dy: 0 }, 0.45, E.out],
        [6.0, { y: 650, h: 540 }, 0.45, E.inOut],
        [7.0, { y: 600, h: 590 }, 0.4, E.back],
        [15.0, { o: 0 }, 0],
        [16.0, { x: 96, y: 810, w: 784, h: 380, o: 1 }, 0],
        [17.0, { o: 0 }, 0.3],
      ]);
      const back = (k) => track(t, { o: 0, dy: 700 }, [[5.0 + k * 0.06, { o: 1, dy: 0 }, 0.45, E.out], [7.0, { o: 0, dy: 60 }, 0.3]]);
      const TH = track(t, { x: 120, y: 660, w: 330, h: 470, o: 0, s: 0.9, f: 0 }, [
        [8.0, { o: 1, s: 1 }, 0.35, E.back],
        [9.0, { x: 120, y: 650, w: 340, h: 340, f: 1 }, 0.4, E.inOut],
        [10.0, { w: 220, h: 220 }, 0.4, E.inOut],
        [11.0, { y: 640, w: 160, h: 160 }, 0.4, E.inOut],
        [15.0, { o: 0 }, 0],
        [16.0, { x: 120, y: 832, w: 150, h: 150, o: 1 }, 0],
        [17.0, { x: 170, y: 700, w: 120, h: 120 }, 0.45, E.inOut],
        [18.0, { x: 136, y: 696, w: 100, h: 100 }, 0.45, E.inOut],
        [20.0, { y: 720 }, 0.45, E.inOut],
        [21.0, { y: 812 }, 0.45, E.inOut],
        [22.0, { y: 798 }, 0.4, E.inOut],
      ]);
      // 8.35-9 hold: slow push on the kit, handed back during the 9.0 move
      if (t >= 8.35 && t < 9) TH.s = 1 + 0.1 * E.inOut((t - 8.35) / 0.65);
      else if (t >= 9 && t < 9.4) TH.s = 1.1 - 0.1 * E.inOut((t - 9) / 0.4);
      const DATE = track(t, { x: 490, y: 690, o: 0, ls: 48, vs: 72 }, [
        [9.0, { o: 1 }, 0.3],
        [10.0, { x: 370, y: 700, ls: 44, vs: 54 }, 0.4, E.inOut],
        [11.0, { x: 310, y: 690, vs: 48 }, 0.4, E.inOut],
        [15.0, { o: 0 }, 0],
        [16.0, { x: 290, y: 870, o: 1 }, 0],
        [17.0, { x: 316, y: 712, ls: 0, vs: 52 }, 0.45, E.inOut],
        [18.0, { x: 256, y: 700, vs: 48 }, 0.45, E.inOut],
        [20.0, { y: 724 }, 0.45, E.inOut],
        [21.0, { y: 816 }, 0.45, E.inOut],
        [22.0, { y: 798, vs: 44 }, 0.4, E.inOut],
      ]);
      const PART = track(t, { x: 490, y: 700, o: 0, ls: 48, vs: 64 }, [
        [8.0, { o: 1 }, 0.3],
        [9.0, { y: 960, ls: 44, vs: 52 }, 0.4, E.inOut],
        [10.0, { x: 120, y: 880, ls: 48, vs: 64 }, 0.4, E.inOut],
        [11.0, { o: 0 }, 0.2],
      ]);
      const BRAND = track(t, { x: 120, y: 1010, o: 0, ls: 48, vs: 64 }, [[10.0, { o: 1 }, 0.3], [11.0, { o: 0 }, 0.2]]);
      const PB = track(t, { x: 310, y: 804, o: 0, ls: 0, vs: 48 }, [
        [11.0, { o: 1 }, 0.3],
        [15.0, { o: 0 }, 0],
        [16.0, { x: 120, y: 1000, o: 1 }, 0],
        [17.0, { x: 170, y: 868, vs: 52 }, 0.45, E.inOut],
        [18.0, { x: 136, y: 818, vs: 48 }, 0.45, E.inOut],
        [20.0, { y: 836 }, 0.45, E.inOut],
        [21.0, { y: 926 }, 0.45, E.inOut],
        [22.0, { x: 256, y: 852, vs: 44 }, 0.4, E.inOut],
      ]);
      const GAR = track(t, { x: 120, y: 880, o: 0, ls: 48, vs: 80, inline: false }, [
        [11.0, { o: 1 }, 0.3],
        [13.0, { vs: 60 }, 0.35, E.inOut],
        [15.0, { o: 0 }, 0],
        [16.0, { y: 1060, o: 1, ls: 44, vs: 48, inline: true }, 0],
        [17.0, { x: 170, y: 984 }, 0.45, E.inOut],
        [18.0, { x: 136, y: 878 }, 0.45, E.inOut],
        [20.0, { y: 896 }, 0.45, E.inOut],
        [21.0, { y: 986 }, 0.45, E.inOut],
        [22.0, { y: 912 }, 0.4, E.inOut],
      ]);
      const CON = track(t, { x: 120, y: 1040, o: 0, ls: 48, vs: 64, inline: false }, [
        [13.0, { o: 1 }, 0.3],
        [15.0, { o: 0 }, 0],
        [16.0, { y: 1120, o: 1, ls: 44, vs: 48, inline: true }, 0],
        [17.0, { x: 170, y: 1054, inline: false, vs: 52 }, 0.45, E.inOut],
        [18.0, { x: 136, y: 944 }, 0.45, E.inOut],
        [20.0, { y: 962 }, 0.45, E.inOut],
        [21.0, { y: 1046 }, 0.45, E.inOut],
        [22.0, { y: 972, inline: true, vs: 44 }, 0.4, E.inOut],
      ]);
      const G = track(t, { x: 96, y: 390, w: 784, h: 800, o: 0, s: 1.03 }, [[18.0, { o: 1, s: 1 }, 0.4], [22.0, { y: 546, h: 514 }, 0.45, E.inOut]]);
      const TAG = track(t, { x: 558, y: 760, o: 0 }, [
        [5.0, { o: 1 }, 0.3], [6.0, { y: 670 }, 0.45, E.inOut], [7.0, { y: 620 }, 0.4, E.back], [15.0, { o: 0 }, 0],
        [16.0, { y: 830, o: 1 }, 0], [17.0, { o: 0 }, 0.25], [18.0, { y: 404, o: 1 }, 0.3], [22.0, { y: 560 }, 0.45, E.inOut],
      ]);
      const URL = track(t, { x: 120, y: 1100, w: 736, h: 80, o: 0 }, [[20.0, { o: 1 }, 0.3], [21.0, { y: 548, h: 252 }, 0.45, E.back], [22.0, { o: 0 }, 0.25]]);
      const lineP = t >= 17 && t < 22 ? Math.min(prog(t, 17.2, 0.4), 1 - prog(t, 21.8, 0.2)) : 0;
      const lineX = t < 18 ? 140 : 116, lineTop = A.y + A.h, lineBot = CON.y + 110;
      const anchorLab = t >= 8 && t < 15 ? prog(t, 8.2, 0.3) : 0;
      const shopLab = (s) => s.h >= 300 ? <div style={{ position: "absolute", left: 22, top: 14, ...mono(48, { color: pal.tx }), opacity: 0.92 }}>{s === B ? "SHOP B" : "SHOP A"}</div> : null;
      return (
        <>
          <Headline t={t} cues={HEAD} pal={pal} emph={["WHICH", "JUDGE", "WORK", "MORE", "CONNECTED", "UNTIL"]} />
          <Stage t={t}>
          {/* build page frame (18-28) */}
          <Box s={G} v z={1} live={HOST(19)} sweep={{ alpha: 0.11, period: 2.4, seed: 4 }} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}38` }}>
            {t >= 19 && <Chars t={t} t0={19} text="FuelMyBuild" style={{ position: "absolute", left: 24, top: 12, ...ui(56) }} stagger={1.5} rise={24} />}
            {t >= 20 && t < 22.3 && <span style={{ position: "absolute", left: 24, top: 82, ...ui(60) }}><Chars t={t} t0={20} out={22} text="Miata" stagger={2} rise={24} /></span>}
          </Box>
          <Photo s={A} name={CAR} aspect={CAR_A} pal={pal} z={2} seed={1} kb={A.h < 300 ? 1.7 : 1} live={t >= 17.5 ? HOST(t) : null} label={<div style={{ position: "absolute", left: 22, top: 14, ...mono(48), opacity: A.h >= 300 ? 0.92 : 0 }}>SHOP A</div>} />
          <Photo s={{ ...B, y: B.y + B.dy }} name={CAR} aspect={CAR_A} pal={pal} z={2} seed={1.5} label={<div style={{ position: "absolute", left: 22, top: 14, ...mono(48), opacity: 0.92 }}>SHOP B</div>} />
          {anchorLab > 0 && <div style={{ position: "absolute", left: 486, top: 452, ...mono(52) }}><Chars t={t} t0={8.2} text="SHOP A" stagger={1.5} /></div>}
          <Box s={O} z={4}>
            {/* the selection outline draws itself on at 2.0, then moves */}
            <svg width={O.w} height={O.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <rect x={4} y={4} width={O.w - 8} height={O.h - 8} fill="none" stroke={pal.em} strokeWidth={8} pathLength={1000} strokeDasharray="1000" strokeDashoffset={1000 * (1 - prog(t, 2.0, 0.38, E.inOut))} />
            </svg>
          </Box>
          {[2, 1].map((k) => { const b = back(k); return <Box key={k} s={{ x: 96 + k * 20, y: C.y - 16 * k, w: 784 - 40 * k, h: C.h, o: b.o * (t < 15 ? 1 : 0) * 0.8, dy: b.dy, vy: b.vy }} live={{ seed: 7 + k, y: 3, r: 0.25 }} v z={2} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}30` }} />; })}
          <Box s={{ ...C, y: C.y + C.dy }} v z={3} live={HOST(9)} sweep={{ alpha: 0.09, period: 2.6, seed: 2 }} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}50`, borderTop: `8px solid ${pal.em}` }}>
            {/* 7 s: the opened job card shows its empty ruled lines until the first entry lands */}
            {t >= 7 && t < 8.3 && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 32, top: 110 + i * 90, height: 4, width: [700, 520, 700, 600, 380][i] * prog(t, 7 + i * 0.05, 0.35), background: pal.tx, opacity: 0.16 * (1 - prog(t, 8, 0.25)) }} />)}
          </Box>
          <div style={{ position: "absolute", left: TAG.x, top: TAG.y + (t < 5.5 ? C.dy : 0), opacity: TAG.o, zIndex: 6 }}><Tag pal={pal} size={44} /></div>
          <Thumb s={TH} t={t} />
          <Field st={DATE} label="LOG DATE" value="OCT 12, 2026" two t={t} tv={9} maxW={856 - DATE.x} />
          <Field st={PART} label="PART" value="Brake kit" t={t} tv={8} maxW={856 - PART.x} />
          <Field st={BRAND} label="BRAND" value="Demo Brand A" t={t} tv={10} />
          <Field st={PB} label="" value="Brake kit · Demo Brand A" t={t} tv={11.05} maxW={856 - PB.x} />
          <Field st={GAR} label="GARAGE" value="Demo Garage A" slot t={t} tv={12} maxW={856 - GAR.x} />
          <Field st={CON} label="CONTRIBUTOR" value="Demo Contributor A" slot t={t} tv={14} maxW={856 - CON.x} />
          {lineP > 0 && <div data-v="1" style={{ position: "absolute", left: lineX - 3, width: 6, top: lineTop, height: Math.max(0, lineBot - lineTop) * lineP, background: pal.em, zIndex: 4 }} />}
          <Box s={URL} v z={7} style={{ background: pal.bg, border: `5px solid ${pal.em}`, padding: t < 21 ? "10px 18px" : "22px 28px" }}>
            <div style={lab(t < 21 ? 44 : 48)}>PUBLIC URL · DEMO</div>
            {t >= 21 && <div style={{ ...mono(58), marginTop: 12, lineHeight: 1.22 }}><Chars t={t} t0={21.1} text="fuelmybuild.com/" stagger={0.8} /><br /><Chars t={t} t0={21.3} text="demo-miata" stagger={1} /></div>}
          </Box>
          <Unstage t={t}>{t >= 25 && <div style={{ position: "absolute", left: 96, top: 1078, width: 784, ...ui(50), lineHeight: 1.12, zIndex: 8 }}>
            <Words t={t} t0={25} text="FOLLOW FuelMyBuild" style={{ display: "block" }} pops={(w) => w === "FOLLOW"} />
            {t >= 26 && <Words t={t} t0={26} text="BETTER BUILD RECORDS" style={{ display: "block" }} />}
          </div>}</Unstage>
          </Stage>
        </>
      );
    }}
  </Film>
);
