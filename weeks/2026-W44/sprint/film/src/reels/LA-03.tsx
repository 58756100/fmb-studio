// @ts-nocheck
// LA-03 (lane A, collectors): "Spring You Has Questions" (ChatGPT concept and look, Claude execution). After winter a
// collector finds an empty oil bottle by the car: refilled, probably. Except the bottle belonged to the other car. The
// build page's last dated photo shows the oil draining and there is no refill entry, so it is still a question. Spring
// starts with checking what happened, not trusting the bench.
// Look (ChatGPT's): cold slate that warms to buttery morning yellow, rounded sans (Nunito) headlines, tiny calendar
// numerals (IBM Plex Mono), stop-motion photo collage: every cut-out is a white-edged sticker and moves on twos (12 fps
// steps) while the camera drifts smoothly underneath. The winter cover is a desk-calendar page that peels away.
// Cars (collector bank, no makers, no badges): featured silver GT (K1-23, K2-07), the other car blue roadster (K1-21).
// Props: drawn generic oil bottle (no brand), key D08, drain photo K3-09, white-glove check K3-04.
// Transitions: calendar-page peel (cover), shadow stretch that becomes the divider between two cars, tap into the
// featured car's card (its build page), pull back: the page shrinks into a reference card on the bench, CTA landing
// over the same bench frame (key still beside the record).
// remocn (ported): shared-axis split, focus-blur-resolve (log rows), squiggle check draw, typewriter (URL), period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, mixColor, DrawPath } from "../kit";
import { land, Sweep } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.3;
export const LIFE = 1.2;
const SLATE = "#2F3946", SLATE2 = "#46526283", PAPER = "#F4EEDF", BUTTER = "#F7DA7E", INKD = "#28303B", ACC = "#F08A3C", CREAM = "#F6F0E2";
export const BG = SLATE;
const NUN = "Nunito", MONO = "'IBM Plex Mono'";
export const TEXT = { font: NUN, weight: 900, size: 108, min: 70, ls: "-0.01em", upper: true, color: CREAM, accent: ACC, line2: null, align: "center", maxW: 920, top: 262, lead: 1.0 };
export const IMAGES = ["K1-23", "K1-21", "K2-07", "K3-09", "K3-04", "D08"];
const HOOKS = { A: "Before you / turn the key", B: "Winter's over. / Memory isn't.", C: "Refilled… / right?" };
const nun = (size, color, weight = 800, extra = {}) => ({ fontFamily: NUN, fontSize: Math.max(42, size), fontWeight: weight, lineHeight: 1.12, color, whiteSpace: "nowrap", ...extra });
const mono = (size, color, extra = {}) => ({ fontFamily: MONO, fontWeight: 500, fontSize: Math.max(42, size), lineHeight: 1.1, color, whiteSpace: "nowrap", ...extra });
const STICKER = "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 22px 18px rgba(0,0,0,.35))";
const q2 = (t) => Math.floor(t * 12) / 12; // stop-motion time: collage pieces move on twos

// generic oil bottle (no brand): translucent jug, cap, handle, a trace of oil at the bottom
const Bottle = ({ x, y, s = 1, rot = 0, o = 1, shadowK = 0, dim = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 190, height: 280, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: "50% 100%", opacity: o, zIndex: 20, filter: `${STICKER} saturate(${1 - dim * 0.6}) brightness(${1 - dim * 0.25})` }}>
    <svg width={190} height={280} viewBox="0 0 190 280" style={{ overflow: "visible" }}>
      <defs><linearGradient id="jug" x1="0" x2="1"><stop offset="0" stopColor="#E9E4D6" /><stop offset=".45" stopColor="#FFFDF6" /><stop offset="1" stopColor="#CFC8B6" /></linearGradient></defs>
      <path d="M40 70 Q40 52 62 48 L70 30 L112 30 L118 48 Q150 54 156 86 L162 250 Q162 270 140 270 L50 270 Q28 270 28 250 Z" fill="url(#jug)" stroke="#B9B19E" strokeWidth={3} />
      <path d="M118 60 Q160 62 160 110 L150 110 Q148 78 122 78 Z" fill="#E2DCCB" stroke="#B9B19E" strokeWidth={3} />
      <rect x={66} y={10} width={52} height={26} rx={6} fill="#3E4A5A" />
      <path d="M32 236 Q95 228 160 236 L161 252 Q161 266 140 266 L50 266 Q30 266 30 252 Z" fill="rgba(176,120,40,.45)" />
      <rect x={52} y={120} width={86} height={86} rx={10} fill="rgba(0,0,0,.04)" stroke="rgba(0,0,0,.08)" strokeWidth={2} />
    </svg>
  </div>
);
// a paper card (lane A collage): cream paper, rounded, sticker shadow
const Paper = ({ x, y, w, h, children, rot = 0, s = 1, o = 1, z = 10, origin = "50% 50%", bg = PAPER }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: bg, overflow: "hidden", opacity: o, zIndex: z, transformOrigin: origin,
    transform: `rotate(${rot}deg) scale(${s})`, boxShadow: "0 0 0 5px #fff, 0 26px 40px -16px rgba(0,0,0,.45)" }}>{children}</div>
);
// the desk-calendar page that covers the car in winter
const CalPage = ({ t, peel }) => {
  if (peel >= 0.999) return null;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 1000, perspective: 1600, zIndex: 40 }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${-108 * peel}deg)`, background: PAPER, borderRadius: 22, overflow: "hidden",
      boxShadow: `0 0 0 5px #fff, 0 ${40 - 30 * peel}px 60px -20px rgba(0,0,0,.5)` }}>
      <div style={{ height: 210, background: "#C9D3DE", display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <span style={nun(110, SLATE, 900)}>MARCH</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, padding: "36px 40px" }}>
        {days.map((d) => <div key={d} style={{ ...mono(42, d === 20 ? ACC : "#56606C"), textAlign: "center", padding: "10px 0", borderRadius: 14, background: d === 20 ? rgba(ACC, 0.14) : "transparent" }}>{d}</div>)}
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) ${100 - 70 * peel}%, rgba(0,0,0,${0.35 * peel}))` }} />
    </div>
    {/* spiral binding */}
    <div style={{ position: "absolute", left: 60, right: 60, top: -18, display: "flex", justifyContent: "space-between" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ width: 16, height: 44, borderRadius: 8, background: "linear-gradient(90deg,#8d96a1,#e6eaee,#8d96a1)" }} />)}</div>
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    was: at("was"), refilled: at("refilled"), storage: at("storage?"), empty: at("empty"), probably: at("probably."), except: at("except"),
    bottle2: at("bottle", 2), other: at("other"), car2: at("car."), on: at("on"), fuel: at("fuel"), last: at("last"), dated: at("dated"), photo: at("photo"),
    draining: at("draining."), no: at("no"), refill: at("refill"), still: at("still"), we: at("we"), entries: at("entries"), spring: at("spring"),
    checking: at("checking"), happened: at("happened,"), instead: at("instead"), bench: at("bench."), your: tl.cta("your") ?? at("your"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3, 4] : hook === "B" ? [3] : [0], hold: 4 };
  const spread = (h) => fx(h, h.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, h.words.length - 1)))].s));
  spread(hk);
  const WARM = T.we - 0.1; // slate -> butter
  const DARK = INKD;
  const heads = [
    hk,
    fx(B("Refilled / before storage?", T.refilled), [T.refilled, T.storage - 0.2, T.storage]),
    { ...B("The other / car.", T.other - 0.4), key: [1], hold: 0.7 },
    { ...fx(B("Last recorded: / drained.", T.last), [T.last, T.dated, T.draining]), key: [2], hold: 2.4 },
    { ...fx(B("Check / the record.", T.checking), [T.checking, T.happened - 0.1, T.happened]), key: [2], color: DARK, hold: 2.4 },
    { ...ctaHead(tl, "Give spring / a head start", T.your), key: [1], color: DARK },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const bgCol = (t) => mixColor(SLATE, BUTTER, EASE.io(seg(t, WARM, WARM + 2.4)));
  // ---------------------------------------------------------------- the garage: cover peel, bottle, the other car
  const SPLIT = T.except + 0.5;
  const garage = (t) => {
    const tq = q2(t);
    const peel = EASE.camera(seg(tq, 0.2, 1.15));
    const cam = track(t, { x: 0, y: 0, s: 1 }, [[T.empty - 0.3, { x: -160, y: -120, s: 1.18 }, 0.8], [SPLIT - 0.2, { x: 0, y: 0, s: 1 }, 0.7]]);
    const split = EASE.camera(seg(tq, SPLIT, SPLIT + 0.75));
    const chk = seg(t, T.probably - 0.55, T.probably + 0.2), fall = EASE.in(seg(tq, T.except + 0.1, T.except + 0.7));
    const tap = t > T.empty + 0.1 && t < T.empty + 0.6 ? Math.sin((t - T.empty - 0.1) * 40) * 4 * (1 - (t - T.empty - 0.1) / 0.5) : 0;
    const shadow = ez(tq, T.bottle2 - 0.2, 0.9, EASE.io);
    // featured car: centre -> left card; the other car slides in on the right
    const fc = { cx: lerp(540, 285, split), cy: lerp(1060, 1010, split), w: lerp(920, 470, split) };
    const oc = spr(tq - SPLIT - 0.15, 170, 16);
    const bx = lerp(780, 835, split) + 0 * oc, by = lerp(1250, 1250, split);
    return <AbsoluteFill style={{ background: SLATE }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 70% at 50% 40%, #4A5768 0%, #2F3946 60%, #252D38 100%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, transformOrigin: "75% 70%" }}>
        {/* the bench */}
        <div style={{ position: "absolute", left: -40, right: -40, top: 1470, height: 120, background: "linear-gradient(180deg, #8A7660, #6C5A47)", boxShadow: "0 -6px 0 #A08A70, 0 30px 40px rgba(0,0,0,.35)" }} />
        {/* split cards */}
        {split > 0.01 && <>
          <Paper x={60} y={lerp(700, 690, split)} w={450} h={640} o={split} rot={-1.5} bg="#E3E8EE" />
          <Paper x={570 + (1 - oc) * 500} y={690} w={450} h={640} o={clamp(oc * 2)} rot={1.2} bg="#E3E8EE" />
          {/* the stretched shadow is the divider */}
          <div style={{ position: "absolute", left: 528, top: lerp(1440, 690, split), width: 14, height: lerp(20, 760, split), borderRadius: 7, background: "rgba(20,24,30,.55)", zIndex: 5 }} />
        </>}
        <Cut id="K1-23" cx={fc.cx} cy={fc.cy} w={fc.w} shadow={0} z={12} style={{ filter: STICKER }} />
        {oc > 0.01 && <Cut id="K1-21" cx={795 + (1 - oc) * 500} cy={1010} w={450} shadow={0} z={12} style={{ filter: STICKER }} />}
        {/* bottle shadow stretching toward the other car */}
        <div style={{ position: "absolute", left: bx + 40, top: by + 250, width: 140 + 520 * shadow * (1 - split), height: 34, borderRadius: "50%", background: "rgba(10,14,20,.45)", filter: "blur(4px)", transformOrigin: "0 50%", opacity: 1 - split, zIndex: 6 }} />
        <Bottle x={bx} y={by - (split ? 40 * split : 0)} s={lerp(1, 0.8, split)} rot={tap + 4 * Math.sin(tq * 3) * fall} />
        <Cut id="D08" cx={lerp(240, 200, split)} cy={1450} w={230} rot={-14} shadow={0} style={{ filter: STICKER, zIndex: 21 }} />
        {/* the check mark: draws on the bottle, then wobbles and drops off */}
        {chk > 0 && fall < 1 && <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 30, overflow: "visible" }}>
          <g transform={`translate(0 ${fall * 700}) rotate(${fall * 40 + (t > T.except ? 6 * Math.sin(t * 22) * (1 - fall) : 0)} ${bx + 95} ${by + 120})`}>
            <path d="M 0 0" />
          </g></svg>}
        {chk > 0 && fall < 1 && <div style={{ position: "absolute", inset: 0, zIndex: 30, transformOrigin: `${bx + 95}px ${by + 120}px`, transform: `translateY(${fall * 700}px) rotate(${fall * 40 + (t > T.except ? 7 * Math.sin(t * 22) * (1 - fall) : 0)}deg)` }}>
          <DrawPath d={`M ${bx - 30} ${by + 110} L ${bx + 60} ${by + 200} L ${bx + 250} ${by - 40}`} p={EASE.out(chk)} color={BUTTER} width={30} />
        </div>}
        <CalPage t={t} peel={peel} />
      </div>
    </AbsoluteFill>;
  };

  // ---------------------------------------------------------------- the featured car's build page (log, dated drain photo)
  const page = (t) => {
    const tq = q2(t);
    const d = drift(t, "pg", 3, 0.25);
    const ph = ez(t, T.photo - 0.2, 0.6, EASE.camera); // the drain photo grows to the hero of the page
    return <AbsoluteFill style={{ background: SLATE }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 70% at 50% 40%, #4A5768 0%, #2F3946 60%, #252D38 100%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Paper x={60} y={560} w={960} h={1040} rot={0} z={5}>
          <Sweep t={t} o={0.3} />
          <div style={{ position: "absolute", left: 40, top: 34, ...nun(46, SLATE, 900) }}>Fuel<span style={{ color: ACC }}>My</span>Build</div>
          <div style={{ position: "absolute", right: 40, top: 40, ...mono(42, "#6B7480") }}>build log</div>
          <div style={{ position: "absolute", left: 40, top: 110, width: 880, height: 300, borderRadius: 20, overflow: "hidden" }}>
            <Img src={src("K2-07")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 58%", transform: `scale(${1.04 + 0.03 * Math.sin(t * 0.4)})` }} />
          </div>
          <div style={{ position: "absolute", left: 40, top: 432, ...nun(58, INKD, 900) }}>Ellery's silver GT</div>
          {/* entries */}
          <div style={{ position: "absolute", left: 40, top: 530, display: "flex", alignItems: "center", gap: 22, opacity: 0.5, ...land(t, T.fuel + 0.2) }}>
            <span style={{ ...mono(42, "#6B7480"), padding: "6px 14px", borderRadius: 10, background: "#E7E0CF" }}>OCT 02</span><span style={nun(46, INKD, 700)}>Detailed, covered</span></div>
          <div style={{ position: "absolute", left: 40, top: 616, display: "flex", alignItems: "center", gap: 22, ...land(t, T.last - 0.1) }}>
            <span style={{ ...mono(42, "#fff"), padding: "6px 14px", borderRadius: 10, background: ACC }}>NOV 14</span><span style={nun(46, INKD, 800)}>Oil drained</span></div>
          <div style={{ position: "absolute", left: lerp(40, 40, ph), top: 700, width: lerp(300, 560, ph), height: lerp(170, 220, ph), borderRadius: 18, overflow: "hidden", ...land(t, T.dated - 0.05) }}>
            <Img src={src("K3-09")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 55%", transform: `scale(${1.05 + 0.05 * ph})` }} />
          </div>
          {/* the missing refill: an empty dashed row */}
          <div style={{ position: "absolute", left: 40, top: 950 - 10, width: 880, height: 80, borderRadius: 16, border: "4px dashed #B9B19E", display: "flex", alignItems: "center", gap: 22, padding: "0 20px", boxSizing: "border-box", ...land(t, T.no - 0.1) }}>
            <span style={mono(42, "#9A927E")}>— — —</span><span style={nun(46, "#9A927E", 700)}>Refill</span>
            <span style={{ marginLeft: "auto", ...nun(56, ACC, 900), transform: `rotate(${8 * Math.sin(tq * 5)}deg)`, display: "inline-block" }}>?</span></div>
        </Paper>
      </div>
    </AbsoluteFill>;
  };

  // ---------------------------------------------------------------- spring: the bench, the car, the record as a reference card
  const REF = { x: 600, y: 1150, w: 390, h: 300 };
  const spring = (t) => {
    const tq = q2(t);
    const warm = EASE.io(seg(t, WARM, WARM + 2.4));
    const glove = spr(tq - (T.checking - 0.2), 170, 16), gOut = EASE.in(seg(tq, T.instead - 0.2, T.instead + 0.3));
    const slide = EASE.in(seg(tq, T.instead + 0.4, T.bench + 0.3));
    const d = drift(t, "spr", 3, 0.3);
    const cta = EASE.camera(seg(t, T.your - 0.3, T.your + 0.7));
    return <AbsoluteFill style={{ background: bgCol(t) }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(100% 60% at 30% 25%, rgba(255,250,230,${0.6 * warm}), rgba(255,255,255,0) 70%)` }} />
      <div style={{ position: "absolute", left: -300 + 50 * Math.sin(t * 0.35), top: -300, width: 600, height: 2800, background: `linear-gradient(90deg, rgba(255,240,190,0), rgba(255,240,190,${0.4 * warm}), rgba(255,240,190,0))`, transform: "rotate(-26deg)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.03 * cta})`, transformOrigin: "50% 60%" }}>
        <div style={{ position: "absolute", left: -40, right: -40, top: 1470, height: 120, background: `linear-gradient(180deg, ${mixColor("#8A7660", "#C49A62", warm)}, ${mixColor("#6C5A47", "#9C7646", warm)})`, boxShadow: "0 -6px 0 #D8B98A, 0 30px 40px rgba(0,0,0,.25)" }} />
        <Cut id="K1-23" cx={500} cy={930} w={900} shadow={0} style={{ filter: STICKER, zIndex: 8 }} />
        {/* the record on the bench, beside the key */}
        <Paper x={REF.x} y={REF.y} w={REF.w} h={REF.h} rot={3} z={12}>
          <Img src={src("K3-09")} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 200, objectFit: "cover", objectPosition: "40% 55%" }} />
          <div style={{ position: "absolute", left: 20, top: 220, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ ...mono(42, "#fff"), padding: "4px 12px", borderRadius: 8, background: ACC }}>NOV 14</span><span style={nun(42, INKD, 800)}>Drained</span></div>
        </Paper>
        <Cut id="D08" cx={430} cy={1440} w={230} rot={-14} shadow={0} style={{ filter: STICKER, zIndex: 21 }} />
        <Bottle x={170 - slide * 600} y={1210} rot={-slide * 30} o={1 - slide} dim={ez(t, T.instead - 0.1, 0.4)} />
        {/* gloved check */}
        {glove > 0.01 && gOut < 1 && <Paper x={110} y={560 + (1 - glove) * 200} w={520} h={390} rot={-3} o={clamp(glove * 2) * (1 - gOut)} z={30}>
          <Img src={src("K3-04")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * seg(t, T.checking, T.instead)})` }} /></Paper>}
        {t > T.your + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.your + 0.9} t1={T.your + 1.6} text="fuelmybuild.com" caret={ACC} style={nun(52, INKD, 800)} keepCaret={0.5} /></div>}
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: garage },
    { at: T.on - 0.1, render: page, enter: { kind: "tap", d: 0.55, rect: { x: 60, y: 690, w: 450, h: 640 }, r: 26 } },
    { at: T.we - 0.12, render: spring, enter: { kind: "pull", d: 0.7, rect: REF } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.2, "fabric-pull"], [0.6, "page-turn"], [T.empty + 0.1, "bottle-tap"], [T.probably - 0.55, "draw"], [T.except + 0.1, "chip-fade"], [T.except + 0.55, "bottle-tap", 0.6],
    [T.bottle2 - 0.2, "slide-soft"], [SPLIT, "air-short"], [SPLIT + 0.2, "photo-settle"],
    [T.fuel + 0.2, "pop-soft"], [T.last - 0.1, "card-settle"], [T.dated - 0.05, "shutter"], [T.no - 0.1, "muted-stop"],
    [WARM + 0.3, "tint-swell"], [T.checking - 0.2, "photo-settle"], [T.instead - 0.2, "chip-fade"], [T.instead + 0.4, "slide-soft"],
    [T.your + 0.9, "typing:0.7"], [ctaT, "cta-pop"],
  ];
  // gentle plucked rhythm; one beat drops on the missing refill, warmer chord when spring starts
  const music = { bpm: 92, root: 50, mode: "major", style: "warm", cut: T.no - 0.25, ret: T.we - 0.12 };
  return { shots, heads, sfx, music };
}
