// @ts-nocheck
// LA-06 (lane A, garages): "What That One Line Hides" (ChatGPT concept and look, Claude execution). "The dealer's
// cheaper." Maybe it is. The shop asks whether both quotes cover the same work: one line ("Mount replacement") can hide
// a lot. On a similar build, a seized fastener and a damaged bracket needed attention before the mount could go in; the
// finished photo misses all of that. The build page keeps those dated photos together, with the part's brand and credit
// for the people who did the work. The quote still needs explaining, but now the customer has something to look at.
// Look (ChatGPT's): warm grey, safety orange, rich black; heavy grotesk headlines (Inter 900 caps), light sans paper
// labels (Source Sans 3); exploded technical drawing grid; an accordion-fold estimate that opens into photo layers.
// Bank: car A20 (unbadged), repair photos G07 (corrosion), G01 (hands at work), G04 (mount going in), G12 (finished),
// parts box D14, Lena E06. Fictional: Copper Shed Garage, Lena, Stonewake Mounts. No prices anywhere.
// Transitions: estimates slap down, the line folds out into an accordion of photos (shape unfold), the finished photo
// slides over and is lifted away, the photos regroup into the build page (match), the page turns sideways into a
// reference card beside the quote (pull), CTA landing over the same conversation frame.
// remocn (ported): accordion unfold (rotateX panels), marker highlight, focus-blur-resolve, typewriter, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.2;
const ORANGE = "#FF6A13", BLACK = "#141414", GREYW = "#8E8780", PAPER = "#F3EFE8";
export const BG = "#7C766F";
export const TEXT = { font: "Inter", weight: 900, size: 104, min: 70, ls: "-0.025em", opsz: 32, upper: true, color: BLACK, accent: ORANGE, line2: null, align: "left", x0: 80, maxW: 920, top: 268, lead: 0.98 };
export const IMAGES = ["A20", "G07", "G01", "G04", "G12", "D14", "E06"];
const HOOKS = { A: "The price / pushback", B: "Shops: show / the work", C: "Compare / the scope" };
const SS = (size, color = BLACK, w = 600) => ({ fontFamily: "'Source Sans 3'", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.12, whiteSpace: "nowrap" });

const Grid = ({ t }) => <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #8E8780, #6F6963)` }}>
  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.07) 2px, transparent 2px)", backgroundSize: "90px 90px", backgroundPosition: `${(t * 6) % 90}px ${(t * 4) % 90}px` }} />
  <div style={{ position: "absolute", top: -300, width: 500, height: 2600, left: ((t * 120) % 2000) - 700, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.08), rgba(255,255,255,0))", transform: "rotate(16deg)" }} />
</div>;
// a paper estimate (no prices): header strip, lines, the one line "Mount replacement"
const Estimate = ({ t, x, y, w = 430, rot = 0, who, hi = 0, o = 1, s = 1, z = 10 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.25, opacity: o, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: "50% 0", zIndex: z, background: PAPER, boxShadow: "0 24px 40px -18px rgba(0,0,0,.55)", borderRadius: 6, overflow: "hidden" }}>
    <div style={{ height: 70, background: BLACK, display: "flex", alignItems: "center", padding: "0 22px" }}><span style={SS(42, "#fff", 700)}>{who}</span></div>
    <div style={{ padding: "26px 22px" }}>
      <div style={SS(42, "#6B6560", 600)}>Estimate</div>
      {[0, 1].map((i) => <div key={i} style={{ height: 10, borderRadius: 5, background: "#D9D3C9", margin: "22px 0", width: `${80 - i * 18}%` }} />)}
      <div style={{ ...SS(44, BLACK, 700), padding: "6px 8px", margin: "0 -8px", borderRadius: 6, background: `linear-gradient(90deg, ${rgba(ORANGE, 0.45)} ${hi * 100}%, rgba(0,0,0,0) ${hi * 100}%)` }}>Mount replacement</div>
      {[0, 1].map((i) => <div key={i} style={{ height: 10, borderRadius: 5, background: "#D9D3C9", margin: "22px 0", width: `${70 - i * 25}%` }} />)}
    </div>
  </div>
);
const PH = [["G07", "Seized fastener", 0.5, 0.45], ["G01", "Bracket repaired", 0.75, 0.5], ["G04", "New mount in", 0.5, 0.5]];

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    maybe: at("maybe"), this: at("this"), both: at("both"), same: at("same"), because: at("because"), one: at("one"), hide: at("hide"), on: at("on"), similar: at("similar"),
    seized: at("seized"), damaged: at("damaged"), before: at("before"), mount: at("mount"), the: at("the", 3), finished: at("finished"), misses: at("misses"), their: at("their"),
    fuel: at("fuel"), dated: at("dated"), brand: at("brand"), credit: at("credit"), we: at("we"), visible: at("visible."), quote: at("quote"), now: at("now"), something: at("something"),
    cta: tl.cta("your") ?? at("your"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [3] : [2], hold: 0.7 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("What's / included?", T.both), [T.same, at("work,")]), key: [1], hold: 1.2 },
    { ...fx(B("Before the / new part", T.seized), [T.seized, T.damaged, T.mount, T.mount + 0.2]), key: [3], hold: 1.2 },
    { ...fx(B("The work / behind the line", T.their), [T.dated, T.dated + 0.15, at("together,"), at("together,") + 0.15, at("together,") + 0.3]), key: [4], hold: 1.0 },
    { ...fx(B("Something / to point to", T.now), [T.something, at("concrete"), at("look"), at("at.")]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "Show what / goes into it", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the quotes, the accordion of hidden work
  const quotes = (t, phase) => {
    const d = drift(t, "q", 3, 0.3);
    const slap = (k) => spr(t - (0.15 + k * 0.25), 240, 16);
    const hi = ez(t, T.one - 0.1, 0.5);
    const open = phase === "open" ? ez(t, T.on - 0.4, 0.9, EASE.camera) : 0;
    const fin = phase === "open" ? spr(t - (T.finished - 0.1), 170, 17) : 0;
    const finOut = phase === "open" ? ez(t, T.their - 0.5, 0.45, EASE.in) : 0;
    const P = 3, PH0 = 900, PHH = 230; // accordion panels under the shop's quote
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)}` }}>
        <Cut id="A20" cx={540} cy={lerp(1500, 1700, open)} w={lerp(900, 700, open)} shadow={0.4} o={1 - 0.6 * open} />
        <Estimate t={t} x={lerp(70, 40, open)} y={lerp(560, 540, open) + (1 - clamp(slap(0))) * -500} rot={-4} who="Dealer" hi={hi} s={lerp(1, 0.62, open)} o={clamp(slap(0) * 3) * (1 - 0.4 * open)} />
        <Estimate t={t} x={lerp(560, 600, open)} y={lerp(600, 540, open) + (1 - clamp(slap(1))) * -500} rot={3} who="Copper Shed Garage" hi={hi} s={lerp(1, 0.62, open)} o={clamp(slap(1) * 3)} z={12} />
        {/* the accordion: the line folds out downward into photo panels */}
        {open > 0.01 && <div style={{ position: "absolute", left: 120, top: PH0, width: 840, perspective: 1600, zIndex: 20 }}>
          {PH.map(([id, lab, fx_, fy], i) => { const pi = clamp(open * P - i), ang = (1 - pi) * (i % 2 ? -90 : 90), show = ez(t, [T.seized, T.damaged, T.mount][i] - 0.2, 0.3);
            return <div key={i} style={{ height: PHH * pi, overflow: "visible" }}>
              <div style={{ height: PHH, transformOrigin: i % 2 ? "50% 100%" : "50% 0%", transform: `rotateX(${ang}deg)`, background: PAPER, borderTop: `3px solid ${ORANGE}`, display: "flex", gap: 18, padding: 14, boxSizing: "border-box",
                boxShadow: `inset 0 ${i % 2 ? -30 : 30}px 40px -30px rgba(0,0,0,${0.5 * (1 - pi)})` }}>
                <div style={{ width: 300, height: PHH - 28, overflow: "hidden", borderRadius: 4, position: "relative", flex: "none", opacity: 0.35 + 0.65 * show }}>
                  <Img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx_ * 100}% ${fy * 100}%`, transform: `scale(${1.1 + 0.05 * Math.sin(t * 0.5 + i)})` }} /></div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                  <span style={SS(42, "#6B6560", 600)}>{["01", "02", "03"][i]}</span><span style={SS(48, BLACK, 700)}>{lab}</span></div>
              </div></div>; })}
          {/* the finished photo slides over the process photos, then is lifted away */}
          {fin > 0.01 && finOut < 1 && <div style={{ position: "absolute", left: lerp(900, 0, clamp(fin)), top: 0 - finOut * 600, width: 840, height: PHH * 3, overflow: "hidden", boxShadow: "0 30px 50px -20px rgba(0,0,0,.6)", transform: `rotate(${finOut * -8}deg)`, opacity: 1 - seg(finOut, 0.6, 1) }}>
            <Img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 20, bottom: 20, padding: "8px 18px", background: BLACK, ...SS(44, "#fff", 700) }}>Finished</div></div>}
        </div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the build page (photos regrouped, dated, brand, credit)
  const REF = { x: 520, y: 1130, w: 480, h: 470 };
  const page = (t) => {
    const d = drift(t, "pg", 3, 0.25);
    const rows = [["MAR 03", "Seized fastener cut out", "G07", T.dated - 0.2], ["MAR 04", "Bracket rebuilt", "G01", T.dated], ["MAR 05", "Mount fitted · Stonewake", "G04", T.brand - 0.2]];
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1020, background: PAPER, boxShadow: "0 30px 60px -24px rgba(0,0,0,.6)", transform: dT(d, 0.5), overflow: "hidden" }}>
        <div style={{ height: 90, background: BLACK, display: "flex", alignItems: "center", gap: 14, padding: "0 30px" }}>
          <span style={{ fontFamily: "Inter", fontWeight: 900, fontSize: 46, color: "#fff" }}>Fuel<span style={{ color: ORANGE }}>My</span>Build</span><span style={SS(42, "#B9B2A8", 600)}>· similar build</span></div>
        <div style={{ position: "absolute", left: 30, top: 110, width: 900, height: 230, overflow: "hidden" }}><Cut id="A20" cx={450} cy={125} w={620} shadow={0.3} /></div>
        {rows.map(([dt, txt, img, tt], i) => <div key={i} style={{ position: "absolute", left: 30, top: 350 + i * 150, width: 900, height: 130, display: "flex", alignItems: "center", gap: 20, borderTop: "2px solid #DED7CB", ...land(t, tt) }}>
          <div style={{ width: 160, height: 110, overflow: "hidden", flex: "none" }}><Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div><div style={{ ...SS(42, ORANGE, 700), letterSpacing: "0.04em" }}>{dt}</div><div style={SS(48, BLACK, 700)}>{txt}</div></div></div>)}
        <div style={{ position: "absolute", left: 30, top: 820, display: "flex", gap: 16, ...land(t, T.credit) }}>
          <span style={{ ...SS(42, "#fff", 700), background: BLACK, padding: "8px 18px" }}>Lena</span><span style={{ ...SS(42, BLACK, 700), border: `3px solid ${BLACK}`, padding: "5px 16px" }}>Copper Shed Garage</span></div>
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the conversation frame: the quote and the reference card
  const talk = (t) => {
    const d = drift(t, "tk", 3, 0.3);
    const ring = ez(t, T.something - 0.2, 0.6, EASE.io);
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7));
    return <AbsoluteFill><Grid t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "50% 60%" }}>
        <Cut id="A20" cx={540} cy={1690} w={760} shadow={0.35} />
        <Estimate t={t} x={80} y={600} rot={-3} who="Copper Shed Garage" hi={1} w={420} />
        <Estimate t={t} x={90} y={1050} rot={4} who="Dealer" hi={1} w={400} z={9} />
        {/* the reference card: the build page turned sideways */}
        <div style={{ position: "absolute", left: REF.x, top: 590, width: REF.w, background: PAPER, boxShadow: "0 24px 40px -18px rgba(0,0,0,.55)", transform: "rotate(2deg)", zIndex: 14, overflow: "hidden" }}>
          <div style={{ height: 70, background: BLACK, display: "flex", alignItems: "center", padding: "0 18px" }}><span style={{ fontFamily: "Inter", fontWeight: 900, fontSize: 42, color: "#fff" }}>Fuel<span style={{ color: ORANGE }}>My</span>Build</span></div>
          {PH.map(([id, lab], i) => <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", borderTop: i ? "2px solid #DED7CB" : "none", position: "relative" }}>
            <div style={{ width: 150, height: 100, overflow: "hidden", flex: "none", position: "relative" }}><Img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {i === 1 && ring > 0 && <svg width={150} height={100} style={{ position: "absolute", inset: 0, overflow: "visible" }}><ellipse cx={75} cy={50} rx={80} ry={56} fill="none" stroke={ORANGE} strokeWidth={7} strokeDasharray="420" strokeDashoffset={420 * (1 - ring)} /></svg>}</div>
            <span style={SS(42, BLACK, 700)}>{["Fastener", "Bracket", "Mount"][i]}</span></div>)}
        </div>
        <Cut id="E06" cx={880} cy={1520} w={360} shadow={0} />
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 80, top: 520, zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" caret={ORANGE} style={SS(48, BLACK, 700)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => quotes(t, "closed") },
    { at: T.because - 0.1, render: (t) => quotes(t, "open"), enter: { kind: "match" } },
    { at: T.their - 0.1, render: page, enter: { kind: "rise", d: 0.55 } },
    { at: T.we - 0.12, render: talk, enter: { kind: "pull", d: 0.6, rect: { x: REF.x, y: 590, w: REF.w, h: 520 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.15, "paper-thud"], [0.4, "paper-thud"], [T.one - 0.1, "draw"], [T.on - 0.4, "paper-unfold"], [T.seized - 0.2, "tap"], [T.damaged - 0.2, "tap"], [T.mount - 0.2, "tap"],
    [T.finished - 0.1, "slide-soft"], [T.their - 0.5, "air-short"], [T.dated - 0.2, "shutter"], [T.dated, "shutter"], [T.brand - 0.2, "shutter"], [T.credit, "pop-soft"],
    [T.something - 0.2, "draw"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 96, root: 52, mode: "minor", style: "observe", cut: T.finished - 0.3, ret: T.their - 0.1 };
  return { shots, heads, sfx, music };
}
