// @ts-nocheck
// LA-08 (lane A, parts suppliers): "Same Car, Different Space" (ChatGPT concept and look, Claude execution). Another
// "will this fit?" message with only a model year. Both owners give the same year, but one has added cooling hardware
// right where the bracket would sit; the other's standard. A build page keeps those surrounding parts, their brands and
// dated install photos together, so the next question starts with that context. The supplier still checks fit.
// Look (ChatGPT's): pale mint, dark ink, lemon; clear sans headlines; paper engineering: hood flaps hinge open on two
// matched car cut-outs (spot-the-difference). No fitment verdicts, no inbox feature.
// Bank: matched coupes A37 (front, unbadged), stock bay G12, cooling hardware C12 (radiator/fan) + C11, install photo
// G01 crop. Fictional: Wrenfield Brackets (the parts brand), Tidewell Cooling, owner Jae.
// Transitions: the message thumbnail grows into the two cars (portal), paper hood flaps lift, the modified bay's outline
// carries into its install photo on the page (match), the photo slides beside the inquiry, pull back to the desk.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.75;
const MINT = "#DDF1E7", INKD = "#14211C", LEMON = "#F2E14A", MID = "#6E8A7E";
export const BG = MINT;
export const TEXT = { font: "Inter", weight: 750, size: 100, min: 66, ls: "-0.02em", opsz: 32, upper: true, color: INKD, accent: "#C9A800", line2: null, align: "left", x0: 80, maxW: 920, top: 268, lead: 1.0 };
export const IMAGES = ["A37", "G12", "C12", "C11", "G01"];
const HOOKS = { A: "Same question. / Missing context.", B: "Look / underneath", C: "What else / changed?" };
const SANS = (size, color = INKD, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap" });
const PAPER = { background: "#FBFEFC", boxShadow: "0 18px 30px -14px rgba(20,33,28,.45)", borderRadius: 18 };

const Message = ({ t, x, y, s = 1, o = 1, thumbK = 0 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 760, padding: "24px 28px", ...PAPER, opacity: o, transform: `scale(${s})`, transformOrigin: "0 0", zIndex: 20 }}>
    <div style={SANS(40, MID, 600)}>Message to Wrenfield Brackets</div>
    <div style={{ display: "flex", gap: 20, marginTop: 14, alignItems: "center" }}>
      <div style={{ width: 170, height: 110, borderRadius: 14, background: "#EEF7F2", position: "relative", overflow: "hidden" }}><Cut id="A37" cx={85} cy={60} w={150} shadow={0} /></div>
      <div><div style={SANS(50, INKD, 700)}>"Will this fit?"</div><div style={SANS(44, MID, 500)}>It's a 2009.</div></div></div>
  </div>
);
// a car with its hood flap and the bay revealed above it
const Bay = ({ t, x, open, mod, hi = 0, label }) => {
  const W2 = 460, BY = 700, CY = 1290;
  return <div style={{ position: "absolute", left: x, top: 0, width: W2, height: H }}>
    {/* the bay photo under the flap */}
    <div style={{ position: "absolute", left: 0, top: BY, width: W2, height: 340, borderRadius: 16, overflow: "hidden", ...PAPER }}>
      <Img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", transform: `scale(${1.05 + 0.03 * Math.sin(t * 0.5)})` }} />
      {mod && <div style={{ position: "absolute", left: 40, top: 60, width: 300 }}><Cut id="C12" cx={150} cy={100} w={300} shadow={0.3} /></div>}
      {mod && hi > 0 && <div style={{ position: "absolute", left: 30, top: 40, width: 330, height: 230, border: `7px dashed ${LEMON}`, borderRadius: 18, opacity: hi, boxShadow: `0 0 0 ${8 * hi}px ${rgba(LEMON, 0.25)}` }} />}
    </div>
    {/* the paper hood flap, hinged at its top edge */}
    <div style={{ position: "absolute", left: 0, top: BY, width: W2, height: 340, perspective: 1200, zIndex: 5 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${open * 160}deg)`, background: `linear-gradient(180deg, #E9F5EF, #CFE8DC)`, borderRadius: 16, boxShadow: "0 18px 30px -14px rgba(20,33,28,.45)", backfaceVisibility: "hidden", display: "grid", placeItems: "center" }}>
        <span style={SANS(44, MID, 700)}>{label}</span></div>
    </div>
    <Cut id="A37" cx={W2 / 2} cy={CY} w={W2} shadow={0.3} />
    <div style={{ position: "absolute", left: W2 / 2 - 80, top: CY + 150, padding: "6px 18px", background: INKD, borderRadius: 10, ...SANS(42, MINT, 700) }}>2009</div>
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    both: at("both"), same: at("same"), year: at("year,"), but: at("but"), added: at("added"), cooling: at("cooling"), right: at("right"), sit: at("sit."), other: at("other's"),
    standard: at("standard."), a: at("a"), page: at("page"), surrounding: at("surrounding"), brands: at("brands"), dated: at("dated"), photos: at("photos"), so: at("so"), context: at("context."),
    we: at("we"), visible: at("visible."), supplier: at("supplier"), checks: at("checks"), model2: at("model", 2), story: at("story."), cta: tl.cta("your") ?? at("your"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [1] : [2], hold: 0.5 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Same model. / Different space.", T.same), [T.same, at("model"), T.right, T.sit]), key: [3], hold: 1.0 },
    { ...fx(B("Show the / surrounding build", T.surrounding), [T.page, T.page + 0.15, T.surrounding, T.surrounding + 0.3]), key: [2], hold: 1.2 },
    { ...fx(B("Context before / confirmation", T.supplier), [T.supplier, T.checks, at("fit;")]), key: [2], hold: 0.8 },
    { ...ctaHead(tl, "Give the question / context", T.cta), key: [3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Grid = ({ t }) => <div style={{ position: "absolute", inset: 0, background: MINT }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${rgba(INKD, 0.08)} 0 2px, transparent 3px)`, backgroundSize: "36px 36px", backgroundPosition: `${(t * 5) % 36}px ${(t * 3) % 36}px` }} />
    <div style={{ position: "absolute", top: -300, width: 500, height: 2600, left: ((t * 160) % 2000) - 700, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", transform: "rotate(16deg)" }} />
  </div>;
  // ---------------------------------------------------------------- the inquiry
  const inquiry = (t) => {
    const d = drift(t, "iq", 3, 0.3);
    const q = spr(t - 0.1, 200, 17);
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Message t={t} x={160} y={lerp(900, 760, clamp(q))} o={clamp(q * 2)} />
        <div style={{ position: "absolute", left: 120, top: 1300, width: 840, height: 300, borderRadius: 24, background: "linear-gradient(180deg, #C9B79A, #A8946F)", boxShadow: "0 20px 30px -14px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 60, top: 60 }}><Cut id="C11" cx={180} cy={80} w={360} shadow={0.3} /></div></div>
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the two cars, flaps lift
  const pair = (t, phase) => {
    const d = drift(t, "pr" + phase, 3, 0.3);
    const open = phase === "end" ? 1 : ez(t, T.but - 0.1, 0.8, EASE.camera);
    const hi = phase === "end" ? 0.6 : ez(t, T.right - 0.1, 0.4);
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    const enter = phase === "end" ? 1 : spr(t - (T.both - 0.3), 170, 18);
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${(phase === "end" ? 0.88 : 1) - 0.03 * ctaP})`, transformOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - clamp(enter)) * -400}px)`, opacity: clamp(enter * 2) }}><Bay t={t} x={60} open={open} mod={false} label="Owner 1" /></div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - clamp(enter)) * 400}px)`, opacity: clamp(enter * 2) }}><Bay t={t} x={560} open={open} mod={true} hi={hi} label="Owner 2" /></div>
        {phase === "end" && <><div style={{ position: "absolute", left: 360, top: 1640, padding: "16px 22px", ...PAPER }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: INKD }}>Fuel<span style={{ color: "#C9A800" }}>My</span>Build</span></div></>}
        {phase === "end" && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 80, top: 520, zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" caret={INKD} style={SANS(48, INKD, 700)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the owner's page: surrounding parts, brands, dated install photos
  const page = (t) => {
    const d = drift(t, "pg", 3, 0.25);
    const slide = ez(t, T.so - 0.2, 0.7, EASE.camera);
    const rows = [["C12", "Radiator + fan", "Tidewell Cooling", T.surrounding], ["C11", "Coolant reservoir", "Tidewell Cooling", T.brands]];
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...PAPER, transform: `${dT(d, 0.5)} translateX(${-0 * slide}px)`, overflow: "hidden" }}>
        <div style={{ height: 90, background: INKD, display: "flex", alignItems: "center", gap: 14, padding: "0 30px" }}>
          <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 46, color: MINT }}>Fuel<span style={{ color: LEMON }}>My</span>Build</span><span style={SANS(42, "#9FC0B2", 600)}>· Jae's 2009 coupe</span></div>
        {rows.map(([img, k, v, tt], i) => <div key={i} style={{ position: "absolute", left: 30, top: 120 + i * 150, width: 900, height: 130, display: "flex", alignItems: "center", gap: 22, borderBottom: `2px solid ${rgba(INKD, 0.1)}`, ...land(t, tt) }}>
          <div style={{ width: 140, height: 110, position: "relative", flex: "none" }}><Cut id={img} cx={70} cy={55} w={130} shadow={0} /></div>
          <div><div style={SANS(48, INKD, 700)}>{k}</div><div style={SANS(42, MID, 600)}>{v}</div></div></div>)}
        <div style={{ position: "absolute", left: 30, top: 450, display: "flex", gap: 20, ...land(t, T.dated - 0.1) }}>
          {[["Mar 14, 2026", 0.55], ["Mar 15, 2026", 0.8]].map(([dt, fxp], i) => <div key={i}>
            <div style={{ width: 430, height: 300, borderRadius: 16, overflow: "hidden", position: "relative", border: i === 0 ? `6px dashed ${LEMON}` : "none" }}><Img src={src(i ? "G12" : "G01")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fxp * 100}% 50%` }} /></div>
            <div style={{ ...SANS(42, INKD, 700), marginTop: 10 }}>{dt}</div></div>)}
        </div>
      </div>
      {/* the install photo slides beside the original inquiry */}
      
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the supplier's desk: calipers, a plain note
  const desk = (t) => {
    const d = drift(t, "dk", 3, 0.3);
    const cal = spr(t - (T.supplier - 0.2), 170, 17), slideJaw = 40 * Math.sin(Math.min(1, seg(t, T.checks, T.checks + 1.2)) * Math.PI);
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: 60, top: 1050, width: 960, height: 700, borderRadius: 30, background: "linear-gradient(180deg, #C9B79A, #A8946F)" }} />
        <div style={{ position: "absolute", left: 120, top: 640, transform: "rotate(-2deg)", transformOrigin: "0 0" }}><Message t={t} x={0} y={0} /></div>
        {/* vernier calipers (drawn) */}
        <svg width={800} height={260} viewBox="0 0 800 260" style={{ position: "absolute", left: 140, top: lerp(1900, 1200, clamp(cal)), transform: "rotate(-8deg)" }}>
          <rect x={40} y={90} width={700} height={44} rx={8} fill="#C9CDD2" stroke="#7C8288" strokeWidth={3} />
          {Array.from({ length: 34 }, (_, i) => <line key={i} x1={80 + i * 19} y1={90} x2={80 + i * 19} y2={i % 5 ? 104 : 112} stroke="#3A3D42" strokeWidth={2} />)}
          <path d="M 40 30 L 80 30 L 80 200 L 40 200 Z" fill="#B9BEC4" stroke="#7C8288" strokeWidth={3} />
          <g transform={`translate(${200 + slideJaw} 0)`}><path d="M 0 60 L 120 60 L 120 160 L 40 160 L 40 220 L 0 220 Z" fill="#DDE1E5" stroke="#7C8288" strokeWidth={3} /></g>
        </svg>
        <div style={{ position: "absolute", left: 560, top: 1430, padding: "22px 26px", background: LEMON, transform: "rotate(4deg)", boxShadow: "0 12px 20px -10px rgba(0,0,0,.4)", ...land(t, T.model2 - 0.2) }}>
          <div style={{ fontFamily: "Caveat", fontSize: 60, fontWeight: 700, color: INKD }}>check clearance</div><div style={{ fontFamily: "Caveat", fontSize: 52, fontWeight: 600, color: INKD }}>at the reservoir</div></div>
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: inquiry },
    { at: T.both - 0.12, render: (t) => pair(t, "open"), enter: { kind: "portal", d: 0.6, rect: { x: 192, y: 856, w: 170, h: 110 }, r: 14 } },
    { at: T.a - 0.1, render: page, enter: { kind: "portal", d: 0.6, rect: { x: 590, y: 740, w: 400, h: 280 }, r: 18 } },
    { at: T.we - 0.1, render: desk, enter: { kind: "rise", d: 0.55 } },
    { at: T.cta - 0.12, render: (t) => pair(t, "end"), enter: { kind: "pull", d: 0.6, rect: { x: 120, y: 640, w: 760, h: 240 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "msg-pop"], [T.both - 0.3, "slide-soft"], [T.but - 0.1, "paper-unfold"], [T.but + 0.1, "paper-flutter"], [T.right - 0.1, "draw"], [T.surrounding, "pop-soft"],
    [T.brands, "pop-soft"], [T.dated - 0.1, "shutter"], [T.so - 0.2, "slide-soft"], [T.supplier - 0.2, "part-lift"], [T.checks, "tick-soft"], [T.model2 - 0.2, "paper-thud"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 55, mode: "major", style: "observe", cut: T.right - 0.3, ret: T.a - 0.1 };
  return { shots, heads, sfx, music };
}
