// @ts-nocheck
// LA-10 (lane A, everyone): "Which Session Was That?" (ChatGPT concept and look, Claude execution). After one session at
// a closed-course track day, Tess says the car felt calmer. Great, except: before or after the wheel change? Someone
// remembers another adjustment; they're comparing three sessions as if nothing changed. On the build page they write
// session names into dated log entries with the photos and notes; the registry names the brands and the credits name
// who did the work. It won't explain every change in feel, but next time they're discussing the same version of the car.
// Look (ChatGPT's): asphalt, cream and signal yellow; wide caps headlines (Inter 800, open tracking), monospaced session
// labels (IBM Plex Mono); paddock contact sheets that slide across a workbench and become dated log entries.
// Car: unbadged white coupe A40 (stationary), the wheel change composited with C07 (session 2+); adjustment photo G06.
// Fictional: Tess, Sol, Ridgeway Forged (wheels). No lap times, telemetry or racing footage.
// Transitions: the top contact sheet tilts away, a third sheet slides out from under the stack, the sheets sort into
// order (shared-axis slide), each sheet folds into its dated entry (match), the "Felt calmer" note drops onto its entry,
// pull back to the bench with the car and the page, CTA landing over the same frame.
// remocn (ported): shared-axis sort, contact-sheet frame wipes, focus-blur-resolve, typewriter, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.2;
const ASPH = "#2A2B2D", CREAM = "#F2ECDD", YEL = "#FFD21F", INKD = "#1A1A1A";
export const BG = ASPH;
export const TEXT = { font: "Inter", weight: 800, size: 96, min: 66, ls: "0.03em", opsz: 32, upper: true, color: CREAM, accent: YEL, line2: null, align: "left", x0: 80, maxW: 920, top: 268, lead: 1.0 };
export const IMAGES = ["A40", "C07", "G06"];
const HOOKS = { A: "Same car. / Different setup.", B: "What changed / when?", C: "Before or after / the change?" };
const MONO = (size, color = INKD, w = 500) => ({ fontFamily: "'IBM Plex Mono'", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.1, whiteSpace: "nowrap", letterSpacing: "0.02em" });
const HAND = (size, color = INKD) => ({ fontFamily: "Caveat", fontSize: size, fontWeight: 700, color, lineHeight: 1.0, whiteSpace: "nowrap" });
const AR = 1622 / 639, WF = { u: 0.225, v: 0.725 }, WR = { u: 0.769, v: 0.725 }, WD = 0.158;

// the coupe; v = setup version (1 stock wheels, 2+ bronze wheels)
const Car = ({ x, y, w, v = 1, shadow = 0.35 }) => { const h = w / AR;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    <Cut id="A40" cx={w / 2} cy={h / 2} w={w} shadow={shadow} />
    {v >= 2 && [WF, WR].map((p, i) => <div key={i} style={{ position: "absolute", left: p.u * w - (WD * w) / 2, top: p.v * h - (WD * w) / 2, width: WD * w, height: WD * w }}><Img src={src("C07")} style={{ width: "100%", height: "100%" }} /></div>)}
  </div>; };
// a paddock contact sheet: cream paper, a film strip with three frames of one session
const Sheet = ({ n, v, x, y, rot = 0, s = 1, o = 1, z = 10, adj = false, label = true }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 880, height: 330, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: "50% 50%", opacity: o, zIndex: z, background: CREAM, boxShadow: "0 22px 36px -16px rgba(0,0,0,.6)", padding: "18px 22px", boxSizing: "border-box" }}>
    {label && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={MONO(42, INKD, 600)}>SESSION {n}</span><span style={MONO(42, "#7A746A")}>PADDOCK B</span></div>}
    <div style={{ marginTop: 12, height: 220, background: "#141414", display: "flex", gap: 12, padding: "22px 14px", boxSizing: "border-box", position: "relative" }}>
      {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 10, right: 10, top: r ? 198 : 6, height: 12, backgroundImage: "repeating-linear-gradient(90deg, #EDE7D7 0 14px, transparent 14px 34px)", opacity: 0.8 }} />)}
      {[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, background: "#5A5B5E", overflow: "hidden", position: "relative" }}>
        {adj && i === 2 ? <Img src={src("G06")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 60%" }} />
          : <div style={{ position: "absolute", left: -20 + i * 6, top: 40 - i * 4, width: 300 }}><Car x={0} y={0} w={300 + i * 30} v={v} shadow={0.25} /></div>}
      </div>)}
    </div>
  </div>
);
const Note = ({ x, y, rot = -4, s = 1, o = 1 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, padding: "18px 28px", background: YEL, transform: `rotate(${rot}deg) scale(${s})`, opacity: o, boxShadow: "0 14px 20px -8px rgba(0,0,0,.5)", zIndex: 40 }}>
    <div style={HAND(76)}>"Felt calmer"</div><div style={{ ...HAND(48, "#5A4A00") }}>Tess</div></div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    after: at("after"), tess: at("tess"), felt: at("felt"), great: at("great,"), except: at("except"), before: at("before"), wheel: at("wheel"), and: at("and"),
    remembers: at("remembers"), another: at("another"), theyre: at("they're"), three: at("three"), so: at("so"), sequence: at("sequence"), on: at("on"), write: at("write"),
    dated: at("dated"), attach: at("attach"), notes: at("notes."), parts: at("parts"), brands: at("brands;"), credits: at("credits"), we: at("we"), context: at("context"),
    wont: at("won't"), but: at("but"), same: at("same"), version: at("version"), cta: tl.cta("comment") ?? at("comment"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [1] : [2], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Before / or after?", T.before), [T.before, at("or"), T.after > T.before ? T.after : tl.after("after", T.before)]), key: [2], hold: 0.6 },
    { ...fx(B("Three different / versions", T.three), [T.three, at("sessions"), at("changed,")]), key: [2], hold: 1.2 },
    { words: [], key: [2], hold: 1.6 },
    { words: [], key: [1], hold: 0.6 },
    { ...ctaHead(tl, "Comment BUILD", T.cta), key: [1] },
  ];
  heads[3].words = [{ w: "Match", t: T.attach, line: 0 }, { w: "the", t: T.attach + 0.12, line: 0 }, { w: "note", t: T.notes, line: 0 }, { w: "to", t: T.notes + 0.25, line: 1 }, { w: "the", t: T.notes + 0.35, line: 1 }, { w: "build", t: T.notes + 0.5, line: 1 }];
  heads[4].words = [{ w: "The", t: T.same - 0.2, line: 0 }, { w: "same", t: T.same, line: 0 }, { w: "version", t: T.version, line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Asphalt = ({ t }) => <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 40% 30%, #3A3B3E, ${ASPH})` }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) 0 1px, transparent 2px), radial-gradient(circle, rgba(0,0,0,.4) 0 1px, transparent 2px)", backgroundSize: "9px 9px, 13px 13px", backgroundPosition: `${(t * 3) % 9}px 0, 0 ${(t * 2) % 13}px` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1700, height: 36, background: `repeating-linear-gradient(90deg, ${YEL} 0 120px, ${ASPH} 120px 200px)`, opacity: 0.85, transform: `translateX(${-(t * 20) % 200}px)` }} />
  </div>;
  // ---------------------------------------------------------------- the bench: mixed stack -> sorted -> entries
  const bench = (t) => {
    const d = drift(t, "bn", 3, 0.3);
    const tilt = ez(t, 0.2, 0.7, EASE.camera); // the top sheet tilts to reveal the same car
    const third = ez(t, T.and - 0.1, 0.7, EASE.camera); // a third sheet pulled out from under the stack
    const sort = ez(t, T.so - 0.2, 1.0, EASE.camera); // mixed -> ordered top to bottom
    const note = ez(t, T.felt - 0.2, 0.5, EASE.out);
    const mixed = [{ x: 120, y: 760, r: 6 }, { x: 80, y: 700, r: -5 }, { x: 100, y: 820, r: 2 }];
    const ordered = [{ x: 100, y: 580, r: 0 }, { x: 100, y: 940, r: 0 }, { x: 100, y: 1300, r: 0 }];
    const pos = (i) => { const m = mixed[i], o = ordered[i]; let x = lerp(m.x, o.x, sort), y = lerp(m.y, o.y, sort), r = lerp(m.r, o.r, sort);
      if (i === 0) { x += (1 - sort) * tilt * 40; y += (1 - sort) * tilt * 380; r += (1 - sort) * tilt * 6; }
      if (i === 2) { y += (1 - sort) * (lerp(0, 560, third) - 0); x += (1 - sort) * third * -10; }
      return { x, y, r }; };
    const zs = sort > 0.5 ? [10, 11, 12] : [12, 10, 9];
    return <AbsoluteFill><Asphalt t={t} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        {[1, 0, 2].map((i) => { const p = pos(i); return <Sheet key={i} n={i + 1} v={i === 0 ? 1 : 2} adj={i === 2} x={p.x} y={p.y} rot={p.r} z={zs[i]} o={i === 2 ? clamp(third * 3 + sort) : 1} />; })}
        <Note x={lerp(600, 560, sort)} y={lerp(1380, 1040, sort) - (1 - note) * 300} rot={-6 + 2 * Math.sin(t * 1.2)} o={note} s={lerp(1, 0.8, sort)} />
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the build page: dated session entries, the note lands
  const page = (t) => {
    const d = drift(t, "pg", 3, 0.25);
    const drop = spr(t - (T.notes - 0.2), 200, 14);
    const rows = [["SESSION ONE", "09:40", 1, false], ["SESSION TWO", "11:10", 2, false], ["SESSION THREE", "13:30", 2, true]];
    return <AbsoluteFill><Asphalt t={t} />
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1060, background: CREAM, boxShadow: "0 30px 60px -24px rgba(0,0,0,.6)", transform: dT(d, 0.5) }}>
        <div style={{ height: 90, background: INKD, display: "flex", alignItems: "center", gap: 16, padding: "0 30px" }}>
          <span style={{ fontFamily: "Inter", fontWeight: 900, fontSize: 46, color: CREAM }}>Fuel<span style={{ color: YEL }}>My</span>Build</span><span style={MONO(42, "#B9B2A3")}>· SEP 12, 2026</span></div>
        {rows.map(([lab, tm, v, adj], i) => <div key={i} style={{ position: "absolute", left: 30, top: 120 + i * 230, width: 900, height: 210, display: "flex", gap: 22, alignItems: "center", borderBottom: "2px solid #DCD4C2", ...land(t, T.write + i * 0.35) }}>
          <div style={{ width: 300, height: 180, background: "#5A5B5E", overflow: "hidden", position: "relative", flex: "none" }}>
            {adj ? <Img src={src("G06")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 60%" }} /> : <div style={{ position: "absolute", left: -10, top: 50 }}><Car x={0} y={0} w={330} v={v} shadow={0.25} /></div>}</div>
          <div><div style={MONO(46, INKD, 600)}>{lab}</div><div style={MONO(42, "#7A746A")}>{tm} · {["stock wheels", "Ridgeway wheels", "alignment"][i]}</div></div>
        </div>)}
        <div style={{ position: "absolute", left: 30, top: 830, display: "flex", gap: 16, flexWrap: "wrap", width: 900 }}>
          <span style={{ ...MONO(42, INKD, 600), background: YEL, padding: "8px 16px", ...land(t, T.parts) }}>Wheels · Ridgeway Forged</span>
          <span style={{ ...MONO(42, CREAM, 600), background: INKD, padding: "8px 16px", ...land(t, T.credits) }}>Alignment · Sol</span></div>
      </div>
      {/* the note drops onto session two */}
      {t > T.notes - 0.3 && <Note x={lerp(700, 640, clamp(drop))} y={lerp(300, 840, clamp(drop))} rot={lerp(-20, -4, clamp(drop))} s={0.75} />}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- pull back: bench, the car, the page, the weather prop
  const wide = (t) => {
    const d = drift(t, "wd", 3, 0.3);
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7));
    return <AbsoluteFill><Asphalt t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "50% 60%" }}>
        <Car x={60} y={1220} w={960} v={2} />
        <div style={{ position: "absolute", left: 80, top: 560, width: 920, background: CREAM, boxShadow: "0 20px 30px -14px rgba(0,0,0,.6)", zIndex: 12 }}>
          <div style={{ height: 84, background: INKD, display: "flex", alignItems: "center", padding: "0 28px", gap: 14 }}><span style={{ fontFamily: "Inter", fontWeight: 900, fontSize: 44, color: CREAM }}>Fuel<span style={{ color: YEL }}>My</span>Build</span><span style={MONO(42, "#B9B2A3")}>· SEP 12</span></div>
          {[["SESSION ONE", "stock"], ["SESSION TWO", "Ridgeway"], ["SESSION THREE", "alignment"]].map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", borderTop: i ? "2px solid #DCD4C2" : "none", position: "relative" }}>
            <span style={MONO(44, INKD, 600)}>{a}</span><span style={MONO(42, "#7A746A")}>{b}</span>
            {i === 1 && <div style={{ position: "absolute", left: 420, top: 4, padding: "4px 14px", background: YEL, transform: "rotate(-5deg)", boxShadow: "0 8px 12px -6px rgba(0,0,0,.5)" }}><span style={HAND(52)}>"Felt calmer"</span></div>}</div>)}
        </div>
        {/* the weather prop: paper sun half behind a paper cloud */}
        <div style={{ position: "absolute", left: 800, top: 1020, width: 200, height: 140, zIndex: 12, transform: `rotate(${3 * Math.sin(t * 0.8)}deg)`, ...land(t, T.wont) }}>
          <div style={{ position: "absolute", left: 20, top: 0, width: 110, height: 110, borderRadius: "50%", background: YEL, boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />
          <div style={{ position: "absolute", left: 50, top: 50, width: 150, height: 80, borderRadius: 40, background: CREAM, boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} /></div>
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 80, top: 470, zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" caret={YEL} style={MONO(44, CREAM, 600)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: bench },
    { at: T.on - 0.1, render: page, enter: { kind: "rise", d: 0.55 } },
    { at: T.we - 0.12, render: wide, enter: { kind: "pull", d: 0.65, rect: { x: 80, y: 560, w: 920, h: 420 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "paper-thud"], [0.35, "paper-thud", 0.7], [0.6, "paper-thud", 0.5], [0.2, "page-turn"], [T.felt - 0.2, "paper-flutter"], [T.and - 0.1, "slide-soft"],
    [T.so - 0.2, "paper-flutter"], [T.so + 0.5, "tick-soft"], [T.so + 0.8, "tick-soft"], [T.write, "pop-soft"], [T.write + 0.35, "pop-soft"], [T.write + 0.7, "pop-soft"],
    [T.notes - 0.2, "paper-thud"], [T.parts, "chip-pop"], [T.credits, "chip-pop"], [T.wont, "paper-flutter"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 52, mode: "major", style: "observe", cut: T.and - 0.2, ret: T.so - 0.2 };
  return { shots, heads, sfx, music };
}
