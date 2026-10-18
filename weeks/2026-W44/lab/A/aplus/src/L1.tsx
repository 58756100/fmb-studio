// @ts-nocheck
// A-L1 Collectors: the upgrade a finished-car photo cannot prove (hook 1). 90 BPM.
import React from "react";
import { Film, Headline, Photo, Cut, Box, Img, Tag, track, prog, pick, E, mono, ui, fit, UI, MONO, SAFE } from "./lib";
import { valueIn, ValueSwap, drift } from "./remocn";
import { Words, Chars, mb, Stage, Unstage } from "./alive";
import VO from "./vo.json";

export const PAL1 = { bg: "#171A18", tx: "#F2EBDD", em: "#E6A16A", pn: "#303832" };
const pal = PAL1;
const CAR = "car-05", CAR_A = 1276 / 508, KIT = "part-06", KIT_A = 768 / 831;

const HEAD = [
  [0, "PROVE THE WORK."], [2, "WHEN SOMEONE ASKS…"], [5, "A FINISHED-CAR PHOTO"], [6, "WHAT'S UNDERNEATH?"],
  [8, "START HERE"], [9, "BRAKE KIT"], [10, "PART: BRAKE KIT"], [11, "BRAND: DEMO BRAND A"], [12, "LOG DATE: OCT 12, 2026"],
  [13, "PHOTO ATTACHED"], [14, "GARAGE: DEMO GARAGE A"], [15, "THE WORK, DOCUMENTED"], [17, "FuelMyBuild"], [18, "BUILD PAGE"],
  [19, "ONE PUBLIC LINK"], [20, "THE CAR + ITS RECORD"], [22, "HARDEST UPGRADE"], [23, "HARDEST UPGRADE\nTO PROVE?", { size: 92 }],
];
// 22 s: keep the first line at the same size it will have once the second arrives
HEAD[16][2] = { size: 92 };

// ---------- the paper record: one sheet that goes from blank evidence panel to a complete dated entry
const LAB = pal.pn; // labels on paper
const lab = (s) => mono(s, { color: LAB, letterSpacing: "0.02em" });
const val = (s, extra = {}) => ui(s, { color: pal.bg, ...extra });

// the blank panel's rules draw on as it lands (staggered), then hold
const Ruled = ({ t }) => (
  <>{[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 44, top: 86 + i * 82, height: 4, width: [680, 540, 680, 400][i] * prog(t, -0.05 + i * 0.1, 0.4), background: pal.pn, opacity: 0.28 }} />)}</>
);
const Thumb = ({ size, t, t0 }) => {
  const p = prog(t, t0, 0.3, E.back);
  return (
    <div style={{ position: "relative", width: size, height: size, background: pal.bg, boxSizing: "border-box", border: `5px solid ${pal.em}`, transform: `scale(${1.08 - 0.08 * p})` }}>
      <Img name={KIT} style={{ position: "absolute", left: 16, top: 16, width: size - 32 - 10, height: size - 32 - 10, objectFit: "contain" }} />
      {t - t0 < 0.18 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.85 * (1 - (t - t0) / 0.18) }} />}
    </div>
  );
};
const Slot = ({ w, h }) => <div style={{ width: w, height: h, border: `4px dashed ${pal.pn}`, opacity: 0.5, boxSizing: "border-box" }} />;

const Record = ({ t, mode, w, h }) => {
  const T = { part: 9, brand: 11, date: 12, thumb: 13, garage: 14 };
  const vi = (k) => valueIn(t, t < T[k] + 0.4 ? T[k] : null);
  const has = (k) => t >= T[k];
  const pad = 32;
  if (mode === "blank") return <Ruled t={t} />;
  if (mode === "entry")
    return (
      <div style={{ position: "absolute", inset: 0, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={lab(44)}>PART</div>
          <div style={{ marginTop: 6 }}>{has("part") ? <Words t={t} t0={T.part} text="Brake kit" style={{ ...val(64), display: "inline-block" }} /> : <Slot w={360} h={70} />}</div>
        </div>
        <Tag pal={pal} solid size={44} />
      </div>
    );
  if (mode === "field")
    return (
      <div style={{ position: "absolute", inset: 0, padding: `30px ${pad}px` }}>
        <Tag pal={pal} solid size={44} />
        <div style={{ ...lab(52), marginTop: 44 }}>PART</div>
        <div style={val(fit(["Brake kit"], UI, 104, 56, w - 2 * pad), { marginTop: 4 })}>Brake kit</div>
        {has("brand") && <div style={{ ...vi("brand") }}>
          <div style={{ ...lab(52), marginTop: 60 }}>BRAND</div>
          <div style={val(fit(["Demo Brand A"], UI, 80, 56, w - 2 * pad), { marginTop: 4 })}><Words t={t} t0={T.brand} text="Demo Brand A" /></div>
        </div>}
      </div>
    );
  if (mode === "log") {
    const colW = w - 2 * pad - 260 - 28;
    return (
      <div style={{ position: "absolute", inset: 0, padding: `30px ${pad}px` }}>
        <Tag pal={pal} solid size={54} />
        <div style={{ ...vi("date") }}>
          <div style={{ ...lab(54), marginTop: 22 }}>LOG DATE</div>
          <div style={mono(66, { color: pal.bg })}><Chars t={t} t0={T.date + 0.05} text="OCT 12, 2026" /></div>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 22 }}>
          <div style={{ width: colW }}>
            <div style={lab(54)}>PART</div><div style={val(60)}>Brake kit</div>
            <div style={{ ...lab(54), marginTop: 18 }}>BRAND</div><div style={val(fit(["Demo Brand A"], UI, 60, 54, colW))}>Demo Brand A</div>
          </div>
          <div>
            <div style={lab(54)}>PHOTO</div>
            <div style={{ marginTop: 4 }}>{has("thumb") ? <Thumb size={260} t={t} t0={T.thumb} /> : <Slot w={260} h={260} />}</div>
          </div>
        </div>
        {has("garage") && <div style={{ ...vi("garage"), marginTop: 22 }}>
          <div style={lab(54)}>GARAGE</div><div style={val(60)}><Words t={t} t0={T.garage + 0.05} text="Demo Garage A" /></div>
        </div>}
      </div>
    );
  }
  if (mode === "compact")
    return (
      <div style={{ position: "absolute", inset: 0, padding: "18px 24px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={mono(48, { color: pal.bg })}>OCT 12, 2026</div>
          <div style={val(52, { marginTop: 2 })}>Brake kit</div>
          <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 2 }}><span style={lab(44)}>GARAGE</span><span style={val(48)}>Demo Garage A</span></div>
        </div>
        <Thumb size={164} t={t} t0={-9} />
      </div>
    );
  // rec / recs: the record under the car
  const big = mode === "rec", th = big ? 270 : 184, cw = w - 2 * 28 - th - 28;
  return (
    <div style={{ position: "absolute", inset: 0, padding: big ? "24px 28px" : "18px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tag pal={pal} solid size={44} /><span style={mono(48, { color: pal.bg })}>OCT 12, 2026</span>
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: big ? 18 : 12, alignItems: "center" }}>
        <Thumb size={th} t={t} t0={-9} />
        <div style={{ width: cw }}>
          <div style={val(big ? 60 : 54)}>Brake kit</div>
          <div style={val(big ? 56 : 48, { opacity: 0.78 })}>Demo Brand A</div>
          {big ? <div style={{ marginTop: 6 }}><div style={lab(44)}>GARAGE</div><div style={val(fit(["Demo Garage A"], UI, 56, 44, cw))}>Demo Garage A</div></div>
            : <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 2 }}><span style={lab(44)}>GARAGE</span><span style={val(fit(["Demo Garage A"], UI, 48, 44, cw - 175))}>Demo Garage A</span></div>}
        </div>
      </div>
    </div>
  );
};
const MODES = [[0, "blank"], [8, "entry"], [10, "field"], [12, "log"], [18, "compact"], [20, "rec"], [22, "recs"]];

const RecordCard = ({ t, s }) => {
  if (!s || s.o <= 0.001) return null;
  // content cross-fades over 0.22 s when the mode changes; geometry tweens in the track
  let i = 0; MODES.forEach(([t0], k) => { if (t >= t0) i = k; });
  const [t0, mode] = MODES[i], prev = i > 0 ? MODES[i - 1][1] : null;
  const p = Math.min(1, (t - t0) / 0.22);
  return (
    <Box s={s} v z={5} live={{ seed: 3, x: 3, y: 7, r: 0.3 }} sweep={{ alpha: 0.7, color: "255,253,248", period: 3.0, seed: 2 }} style={{ background: pal.tx, color: pal.bg, overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", borderLeft: mode === "blank" ? undefined : `12px solid ${pal.em}` }}>
      {prev && p < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - p }}><Record t={t} mode={prev} w={s.w - (prev === "blank" ? 0 : 12)} h={s.h} /></div>}
      <div style={{ position: "absolute", inset: 0, opacity: prev ? p : 1 }}><Record t={t} mode={mode} w={s.w - (mode === "blank" ? 0 : 12)} h={s.h} /></div>
    </Box>
  );
};

const Requester = ({ t, t0, y, text }) => {
  const p = prog(t, t0, 0.35, E.back), q = prog(t, t0 + 0.08, 0.3);
  if (t < t0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 580, top: y, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 40}px)`, ...mono(50, { color: pal.em }), padding: "4px 12px", border: `3px solid ${pal.em}` }}><Chars t={t} t0={t0 + 0.05} text={text} stagger={1} /></div>
      <svg data-v="1" style={{ position: "absolute", left: 522, top: y + 18, overflow: "visible" }} width={56} height={28}>
        <path d={`M ${56} 14 L ${56 - 50 * q} 14`} stroke={pal.em} strokeWidth={5} fill="none" />
        {q > 0.95 && <path d="M 16 2 L 2 14 L 16 26" stroke={pal.em} strokeWidth={5} fill="none" />}
      </svg>
    </>
  );
};

export const L1 = () => (
  <Film pal={pal} subs={VO.L1.subs}>
    {(t) => {
      // ---- tracks
      const P = track(t, { x: 96, y: 400, w: 784, h: 600, o: 1, s: 1, cw: 744, cy: 200, zoom: 1 }, [
        [2.0, { h: 420, cy: 210, cw: 700 }, 0.5, E.inOut],
        [5.0, { h: 660, cw: 780, cy: 330 }, 0.5, E.inOut],
        [7.0, { h: 290, cw: 580, cy: 145, zoom: 1 }, 0.42, E.out],
        [8.0, { o: 0, s: 0.9 }, 0.3],
        [18.0, { x: 120, y: 488, w: 736, h: 236, o: 1, s: 1, cw: 540, cy: 118 }, 0.45, E.inOut],
        [20.0, { x: 96, y: 400, w: 784, h: 330, cw: 740, cy: 165 }, 0.5, E.inOut],
        [22.0, { y: 460, h: 270, cw: 620, cy: 135 }, 0.5, E.inOut],
      ]);
      if (t >= 6 && t < 7.0) P.zoom = drift(t, 6, 7, 0.035);
      const R = track(t, { x: 96, y: 760, w: 784, h: 430, o: 1, s: 1, dy: 150, origin: "50% 0%" }, [
        [0.0, { dy: 0 }, 0.16, E.back],
        [2.0, { x: 96, y: 850, w: 424, h: 340 }, 0.5, E.inOut],
        [5.0, { dy: 1100 }, 0.45, E.in],
        [8.0, { x: 96, y: 1000, w: 784, h: 190, dy: 0 }, 0.45, E.out],
        [10.0, { x: 96, y: 400, w: 520, h: 470 }, 0.45, E.inOut],
        [11.0, { h: 790 }, 0.35, E.out],
        [12.0, { y: 400, w: 784, h: 790 }, 0.45, E.inOut],
        [15.0, { s: 0.84, y: 430 }, 0.7, E.inOut],
        [16.0, { y: 492 }, 0.5, E.inOut],
        [18.0, { x: 120, y: 738, w: 736, h: 206, s: 1 }, 0.45, E.inOut],
        [19.0, { o: 0 }, 0.2],
        [20.0, { o: 1 }, 0.2],
        [20.0, { x: 96, y: 790, w: 784, h: 400 }, 0.5, E.inOut],
        [22.0, { y: 760, h: 300 }, 0.5, E.inOut],
      ]);
      const K = track(t, { x: 272, y: 760, w: 536, h: 430, o: 0 }, [
        [7.0, { o: 1 }, 0],
        [7.0, { y: 716, h: 470 }, 0.5, E.out],
        [8.0, { x: 150, y: 400, w: 580, h: 580 }, 0.45, E.inOut],
        [10.0, { x: 640, y: 470, w: 240, h: 330 }, 0.45, E.inOut],
        [12.0, { x: 609, y: 771, w: 218, h: 218 }, 0.45, E.inOut],
        [13.0, { o: 0 }, 0],
      ]);
      // 8.45-10 hold: slow push on the kit, handed back during the 10.0 move (no scale jump)
      if (t >= 8.45 && t < 10) K.s = drift(t, 8.45, 10, 0.05);
      else if (t >= 10 && t < 10.45) K.s = 1.05 - 0.05 * E.inOut((t - 10) / 0.45);
      const G = track(t, { x: 96, y: 400, w: 784, h: 790, o: 0, s: 1.03 }, [[16.0, { o: 1, s: 1 }, 0.4], [20.0, { o: 0, s: 1.02 }, 0.3]]);
      const U = track(t, { x: 120, y: 958, w: 736, h: 214, o: 0 }, [[18.0, { o: 1 }, 0.3, E.out], [19.0, { x: 96, y: 730, w: 784, h: 460 }, 0.45, E.back], [20.0, { o: 0 }, 0.25]]);
      const lineP = t < 20 ? 0 : prog(t, 20.25, 0.35);
      const reqOut = track(t, { dy: 0, o: 1 }, [[5.0, { dy: 900 }, 0.45, E.in]]);
      return (
        <>
          <Headline t={t} cues={HEAD} pal={pal} emph={["PROVE", "UNDERNEATH?", "DOCUMENTED", "RECORD", "PROVE?"]} />
          <Stage t={t}>
          {/* build page frame (16-20) */}
          <Box s={G} v z={1} live={{ seed: 5, y: 5, r: 0.2 }} sweep={{ alpha: 0.08, period: 2.6, seed: 4 }} style={{ background: pal.pn, boxShadow: `inset 0 0 0 2px ${pal.tx}38` }}>
            <div style={{ position: "absolute", left: 24, right: 24, top: 18, display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
              {t >= 17 && <Chars t={t} t0={17} text="FuelMyBuild" style={ui(56)} stagger={1.5} rise={24} />}
              <Tag pal={pal} size={44} />
            </div>
          </Box>
          <Cut s={K} name={KIT} aspect={KIT_A} z={2} seed={2} sway={1.6} />
          <Photo s={P} name={CAR} aspect={CAR_A} pal={pal} z={3} seed={1} />
          {/* requester labels point at the empty record */}
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${reqOut.dy}px)`, zIndex: 6, filter: mb(0, reqOut.vy) }}>
            {t < 5.6 && <><Requester t={t} t0={3} y={890} text="INSURER" /><Requester t={t} t0={4} y={1060} text="APPRAISER" /></>}
          </div>
          <RecordCard t={t} s={R} />
          {/* parts section + public URL inside the page (18-20) */}
          <Box s={{ x: 120, y: 958, w: 736, h: 110, o: t >= 18 && t < 19.3 ? Math.min(prog(t, 18.1, 0.3), 1 - prog(t, 19, 0.2)) : 0 }} z={4}>
            <div style={mono(44, { color: pal.em })}>PARTS</div>
            <div style={ui(fit(["Brake kit · Demo Brand A"], UI, 52, 44, 736))}><Words t={t} t0={18.1} text="Brake kit · Demo Brand A" stagger={3} /></div>
          </Box>
          <Box s={{ ...U, y: U.y + (t < 19 ? 120 : 0), h: t < 19 ? 94 : U.h }} v z={7} style={{ background: pal.bg, border: `5px solid ${pal.em}`, padding: t < 19 ? "10px 18px" : "26px 30px" }}>
            <div style={mono(t < 19 ? 44 : 50, { color: pal.em })}>PUBLIC URL · DEMO</div>
            {t >= 19 && <div style={{ ...mono(66), marginTop: 40, lineHeight: 1.25 }}><Chars t={t} t0={19.1} text="fuelmybuild.com/" stagger={0.8} /><br /><Chars t={t} t0={19.3} text="demo-240z" stagger={1} /></div>}
          </Box>
          {/* the simple line joining car and record (20-28) */}
          {t >= 20 && <div data-v="1" style={{ position: "absolute", left: 485, width: 6, top: P.y + P.h, height: Math.max(0, (R.y - P.y - P.h)) * lineP, background: pal.em, zIndex: 4 }} />}
          {/* follow line */}
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
