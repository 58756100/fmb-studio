// @ts-nocheck
// S0-01 (lane 0, collectors): "Knolling Day", a countdown. Gene (K4-06) lays out five parts for this winter's rebuild of
// his '67 fastback (A16/A17) before a bolt turns: 5 control arms, 4 exhaust, 3 fuel pump... His grandson Cody (E03) asks
// how they'll know what's in there later; half of this car only lives in Gene's head. So the bench becomes the page:
// every part, its brand, today's date. 2 the radiator, and number one isn't new: the engine he rebuilt in 1979, logged
// with its real date. "So the record's older than me?" "Older than your dad."
// Device: a knolled bench (parts squared on white paper in a numbered grid) that reorganises into the build page's parts
// list at the same right angles; square 1 stays empty until the 1979 engine rises into it in an aged print.
// Look: warm night garage (F02), white bench paper with a faint grid, kraft labels, red numerals. Inter + Barlow Condensed.
// Transitions: snap-to-grid (hook), pull (top-down bench shrinks into the bench in the garage = camera rises), portal
// back down into the bench, parts slide toward their places on the car's ghost side view, whip to Cody, grey drain across
// the car, grid-to-page morph (squares become rows), rise-from-below (the 1979 block), pull-back to the garage for the
// payoff; CTA over Gene, Cody, the car and the bench.
// remocn (ported): snap-to-grid spring, shared-axis rows, grayscale drain, aged-print (sepia + grain), period-drop.
// New vs S0-15: grid-to-list morph with matched rects.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba } from "../kit";
import { Full, Scrim, Haze, glass, font } from "./s0kit";

export const HOOK_WORDS = 10;
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#1C1712";
export const TEXT = { font: "Inter", weight: 700, size: 108, min: 76, ls: "-0.04em", opsz: 32, color: "#FFFFFF", accent: "#FF5A5E", line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["F02", "A16", "A17", "C14", "C05", "C19", "C12", "C15", "K4-06", "E03"];
const BC = "Barlow Condensed";
// the five squares (top-down bench, paper area x 60-1020, y 600-1560)
const SQ = [
  { n: 5, id: "C14", x: 80, y: 620, w: 450, h: 300, pw: 360, part: "Control arms", brand: "Redbank" },
  { n: 4, id: "C05", x: 550, y: 620, w: 450, h: 300, pw: 400, part: "Exhaust", brand: "Fairline" },
  { n: 3, id: "C19", x: 80, y: 940, w: 450, h: 300, pw: 360, part: "Fuel pump", brand: "Pellan" },
  { n: 2, id: "C12", x: 550, y: 940, w: 450, h: 300, pw: 330, part: "Radiator", brand: "Northcote" },
  { n: 1, id: "C15", x: 80, y: 1260, w: 920, h: 300, pw: 380, part: "Engine rebuild", brand: "by Gene" },
];
const Paper = ({ children, dim = 0 }) => <div style={{ position: "absolute", left: 40, top: 580, width: 1000, height: 1000, background: "#FAF8F3", borderRadius: 6,
  boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)", backgroundImage: "linear-gradient(rgba(60,80,120,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(60,80,120,.07) 2px, transparent 2px)", backgroundSize: "40px 40px", filter: dim ? `brightness(${1 - dim})` : undefined }}>
  {children}</div>;
// one knolled square: outline, red numeral, the part squared to the grid
const Square = ({ s, t, q = 1, o = 1, slide = null, empty = false, glow = 0 }) => {
  const px = s.x + s.w / 2 - 40, py = s.y + s.h / 2 - 580;
  return <>
    <div style={{ position: "absolute", left: s.x - 40, top: s.y - 580, width: s.w, height: s.h, border: `3px ${empty ? "dashed" : "solid"} rgba(60,60,70,.18)`, borderRadius: 14,
      boxShadow: glow ? `inset 0 0 ${40 * glow}px rgba(255,200,120,${0.5 * glow})` : undefined }} />
    <div style={{ position: "absolute", left: s.x - 40 + 18, top: s.y - 580 + 8, ...font(BC, 64, RED, 700) }}>{s.n}</div>
    {!empty && q > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, opacity: o, transform: slide ? `translate(${slide.x}px, ${slide.y}px)` : undefined }}>
      <Cut id={s.id} cx={px + (1 - q) * 0} cy={py - (1 - q) * 500} w={s.pw} rot={(1 - q) * 25} shadow={0.3} />
    </div>}
  </>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    so: at("so", 1), bolt: at("bolt"), sixty: at("sixty-seven,"), bench: at("bench.", 1), five: at("five,"), four: at("four,"), three: at("three,"), pump: at("pump."),
    grandpa: at("grandpa,"), how: at("how"), later: at("later?"), honestly: at("honestly?"), half: at("half"), head: at("head."), so2: at("so", 2), becomes: at("becomes"), page: at("page:"),
    every: at("every"), brand: at("brand,"), today: at("today's"), two: at("two,"), radiator: at("radiator."), and: at("and"), number: at("number"), new: at("new."),
    its: at("it's"), engine: at("engine"), nineteen: at("nineteen"), seventy: at("seventy-nine,"), logged: at("logged"), real: at("real"), so3: at("so", 3), record: at("record's"),
    older2: at("older", 2), dad: at("dad."), comment: tl.cta("comment") ?? at("comment"),
  };
  const CUT = tl.cut, DOWN = T.five - 0.4, CODY = T.grandpa - 0.2, HALF = T.honestly - 0.15, PAGE = T.so2 - 0.2, BACK = T.so3 - 0.2;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["Five", hw[0].s], ["parts.", hw[1].s], ["One", hw[2].s], ["winter.", hw[3].s]], { key: [3], hold: 0.3 }), W_([["All", hw[5].s], ["on", hw[8].s], ["record.", hw[9].s]], { key: [2] })]
    : hook === "B" ? [W_([["No", hw[1].s], ["bolt", hw[4].s], ["turned", hw[2].s + 0.6], ["yet.", hw[5].s]], { hold: 0.3 }), W_([["Already", hw[8].s], ["on", hw[9].s], ["record.", hw[11].s]], { key: [2] })]
    : [W_([["A", hw[2].s], ["build", hw[3].s], ["log", hw[4].s]], { hold: 0.3 }), W_([["before", hw[6].s], ["the", hw[7].s], ["build?", hw[8].s]], { key: [2] })];
  hk[hk.length - 1].exit = { at: T.so - 0.1, mode: "up" };
  const heads = [
    ...hk,
    W_([["Before", at("before")], ["a", at("a")], ["bolt", T.bolt], ["turns.", at("turns")]], { key: [2], hold: 1.3 }),
    W_([["5", T.five], ["·", T.four - 0.02], ["4", T.four], ["·", T.three - 0.02], ["3", T.three]], { key: [4], hold: 0.3 }),
    W_([["How", T.how], ["will", at("will")], ["we", at("we")], ["know?", at("know")]], { key: [3], hold: 0.6 }),
    W_([["Half", T.half], ["lives", at("lives")], ["in", at("in", 2)], ["my", at("my")], ["head.", T.head]], { key: [4], hold: 0.3 }),
    W_([["The", at("the", 3)], ["bench", at("bench", 2)], ["becomes", T.becomes, 1], ["the", at("the", 4), 1], ["page.", T.page, 1]], { key: [4], hold: 2.6 }),
    W_([["Two.", T.two]], { hold: 0.6 }),
    W_([["One", at("one")], ["isn't", at("isn't")], ["new.", T.new]], { key: [2], hold: 0.5 }),
    W_([["Rebuilt", at("rebuilt")], ["in", at("in", 3)], ["1979.", T.nineteen]], { key: [2], hold: 0.9 }),
    W_([["Older", T.older2], ["than", at("than", 2)], ["your", at("your")], ["dad.", T.dad]], { key: [3], hold: 0.5 }),
    { ...ctaHead(tl, "Comment BUILD. / We'll set it up.", T.comment), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shots 1 + 3: the top-down bench (hook snaps; countdown slides parts up toward the car's ghost)
  const benchHook = (t) => {
    const d = drift(t, "bh", 3, 0.3);
    const tq = (i) => hook === "B" ? (i < 3 ? 1 : spr(t - (0.2 + (i - 3) * 1.1), 220, 18)) : hook === "C" ? spr(t - (hw[2].s + i * 0.4), 220, 16) : spr(t - (0.05 + i * 0.55 - 0.45), 230, 16);
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 50% 55%, #3A2E22, #14100C 80%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1.02 + 0.03 * seg(t, 0, CUT)})`, transformOrigin: "540px 1080px" }}>
        <Paper>{SQ.map((s, i) => <Square key={i} s={s} t={t} q={i < 4 ? clamp(tq(i)) : 0} empty={i === 4} glow={i === 4 ? 0.3 + 0.3 * Math.sin(t * 3) : 0} />)}</Paper>
      </div>
    </AbsoluteFill>;
  };
  const ghostCar = (t, grey = 0) => <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 560, overflow: "visible" }}>
    <Cut id="A17" cx={540} cy={500} w={980} shadow={0} style={{ opacity: 0.85, filter: `grayscale(${grey}) brightness(${1 - 0.25 * grey})` }} />
  </div>;
  const countdown = (t) => {
    const d = drift(t, "cd", 3, 0.3);
    // each part slides from its square toward its place on the car's side view and stops just short (still a plan)
    const go = (i, t0, stop = 1) => { const p = EASE.camera(seg(t, t0, t0 + 0.9)) * stop; return p; };
    const tgt = [{ x: 330, y: 470 }, { x: 650, y: 560 }, { x: 560, y: 520 }];
    const parts = [[0, T.five], [1, T.four], [2, T.three]];
    const pumpStop = t > T.grandpa - 0.1 ? 0.5 : 1;
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 50% 55%, #3A2E22, #14100C 80%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateY(${-40 * EASE.io(seg(t, DOWN, CODY))}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 160, opacity: ez(t, DOWN + 0.2, 0.6) }}>{ghostCar(t)}</div>
        <Paper>{SQ.map((s, i) => { const pi = parts.find((p) => p[0] === i);
          let slide = null, o = 1;
          if (pi) { const p = go(i, pi[1] + 0.1) * (i === 2 ? pumpStop : 1); const sx = s.x + s.w / 2 - 40, sy = s.y + s.h / 2 - 580; slide = { x: (tgt[i].x - 40 - sx) * p * 0.85, y: (tgt[i].y + 160 - 580 - sy) * p * 0.85 }; o = 1 - 0.25 * p; }
          return <Square key={i} s={s} t={t} q={i < 4 ? 1 : 0} slide={slide} o={o} empty={i === 4} glow={i === 4 ? 0.3 + 0.3 * Math.sin(t * 3) : 0} />; })}</Paper>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2 + payoff: the garage; Gene at the bench, the fastback under the work light; Cody for the payoff
  const BENCHRECT = { x: 290, y: 1500, w: 500, h: 300 };
  const garage = (t, payoff = false) => {
    const d = drift(t, "gr", 4, 0.3);
    const cody = payoff ? spr(t - (BACK + 0.1), 170, 17) : 0;
    const cheer = payoff ? Math.sin(Math.max(0, t - T.older2) * 9) * 5 * Math.exp(-Math.max(0, t - T.older2) * 1.5) * (t > T.older2 ? 1 : 0) : 0;
    return <AbsoluteFill style={{ background: BG }}>
      <Full id="F02" t={t} k0={1.15} k1={1.22} fy={0.6} dim={0.18} />
      <Scrim a={0.55} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="A16" cx={560} cy={1250} w={900} shadow={0.6} />
        <Cut id="K4-06" cx={payoff ? 250 : 310} cy={1340} w={payoff ? 640 : 720} shadow={0} />
        {payoff && <div style={{ position: "absolute", left: 0, top: 0, opacity: clamp(cody * 2), transform: `translate(${(1 - cody) * 300}px, ${cheer}px)` }}><Cut id="E03" cx={860} cy={1330} w={560} shadow={0} /></div>}
        {/* the bench edge in the foreground: the knolled paper seen at an angle */}
        <div style={{ position: "absolute", left: -40, top: 1560, width: W + 80, height: 420, background: "linear-gradient(180deg, #6B4B2E, #4A3220)", boxShadow: "0 -10px 30px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: BENCHRECT.x, top: BENCHRECT.y + 70, width: BENCHRECT.w, height: 200, background: "#FAF8F3", transform: "perspective(600px) rotateX(55deg)", transformOrigin: "50% 0", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>
          {[["C14", 120, 70], ["C05", 360, 70], ["C19", 120, 150], ["C12", 360, 150]].map(([id, x, y], i) => <Cut key={i} id={id} cx={x} cy={y} w={170} shadow={0} />)}
        </div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 4: Cody asks
  const cody = (t) => <AbsoluteFill style={{ background: BG }}>
    <Full id="F02" t={t} k0={1.4} k1={1.46} fx={0.7} fy={0.6} dim={0.3} blur={8} />
    <Scrim a={0.55} />
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${Math.sin(t * 2.4) * 6}px)` }}><Cut id="E03" cx={540} cy={1330} w={860} shadow={0} /></div>
  </AbsoluteFill>;
  // ---------- shot 5: half of this car lives in his head: the car's side view drains grey on the unlogged half
  const half = (t) => {
    const g = ez(t, T.half - 0.1, 0.9, EASE.camera);
    return <AbsoluteFill style={{ background: BG }}>
      <Full id="F02" t={t} k0={1.25} k1={1.32} fy={0.6} dim={0.45} blur={6} />
      <Scrim a={0.6} />
      <div style={{ position: "absolute", left: 0, top: 0 }}><Cut id="A17" cx={540} cy={960} w={1000} shadow={0.4} /></div>
      <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(0 0 0 ${lerp(100, 50, g)}%)` }}><Cut id="A17" cx={540} cy={960} w={1000} shadow={0} style={{ filter: "grayscale(1) brightness(.55) contrast(.8)" }} /></div>
      <div style={{ position: "absolute", left: 540, top: 700, width: 4, height: 520, background: "rgba(255,255,255,.5)", opacity: g * (1 - ez(t, PAGE - 0.4, 0.3)) }} />
      <div style={{ position: "absolute", left: 600, top: 1260, ...font("Inter", 44, "rgba(255,255,255,.7)", 600), opacity: ez(t, T.head - 0.2, 0.3) }}>not written anywhere</div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${(1 - ez(t, HALF, 0.6)) * -300}px)` }}><Cut id="K4-06" cx={240} cy={1500} w={560} shadow={0} /></div>
    </AbsoluteFill>;
  };
  // ---------- shot 6/7: the bench becomes the page; squares morph into rows; the 1979 block rises into row 1
  const ROW = (i) => ({ x: 70, y: 700 + i * 170, w: 940, h: 150 });
  const page = (t) => {
    const m = ez(t, T.becomes - 0.2, 1.0, EASE.camera);
    const d = drift(t, "pg", 3, 0.3);
    const order = [0, 1, 2, 3, 4];
    const rise = spr(t - (T.engine - 0.2), 140, 16);
    const tl0 = ez(t, T.real - 0.2, 1.0, EASE.camera);
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 50% 55%, #3A2E22, #14100C 80%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <div style={{ position: "absolute", left: lerp(40, 40, m), top: lerp(580, 560, m), width: 1000, height: lerp(1000, 1060, m), background: "#FAF8F3", borderRadius: lerp(6, 40, m), boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 80, top: 590, ...font("Inter", 44, GREY, 500), opacity: m }}>Gene's '67 fastback · parts</div>
        {order.map((i) => { const s = SQ[i], r = ROW(i);
          const landT = i === 3 ? T.radiator - 0.3 : i === 4 ? T.engine : T.becomes + 0.2 + i * 0.12;
          const mm = m;
          const x = lerp(s.x, r.x, mm), y = lerp(s.y, r.y, mm), w = lerp(s.w, r.w, mm), h = lerp(s.h, r.h, mm);
          const q = spr(t - landT, 200, 19);
          const aged = i === 4;
          const pw = lerp(s.pw, 150, mm);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: `3px ${i === 4 && t < T.engine ? "dashed" : "solid"} rgba(60,60,70,${lerp(0.18, 0.08, mm)})`,
            background: i === 4 && t < T.engine ? `rgba(255,190,110,${0.12 + 0.08 * Math.sin(t * 3)})` : mm > 0.5 ? "#fff" : "transparent" }}>
            <div style={{ position: "absolute", left: 18, top: lerp(8, 40, mm), ...font(BC, lerp(64, 60, mm), RED, 700) }}>{s.n}</div>
            {(!aged || t > T.engine - 0.25) && (i !== 3 || m < 0.5 || t > T.two - 0.1) && <div style={{ position: "absolute", left: 0, top: 0, filter: aged ? "sepia(.75) contrast(1.05) brightness(.95)" : undefined,
              transform: aged ? `translateY(${(1 - clamp(rise)) * 700}px)` : i === 3 && m >= 0.5 ? `translateY(${(1 - clamp(spr(t - (T.two - 0.1), 220, 15))) * -260}px)` : undefined, opacity: i === 3 && m >= 0.5 ? clamp(spr(t - (T.two - 0.1), 220, 15) * 3) : 1 }}>
              <Cut id={s.id} cx={lerp(w / 2, 150, mm)} cy={h / 2} w={pw} shadow={0.2} />
            </div>}
            {mm > 0.4 && (i !== 4 || t > T.engine) && <div style={{ position: "absolute", left: 260, top: 22, opacity: clamp(q * 2) * clamp((mm - 0.4) * 2), transform: `translateY(${(1 - clamp(q)) * 14}px)` }}>
              <div style={font("Inter", 50, INK, 650)}>{s.part}</div>
              <div style={{ ...font("Inter", 42, i === 4 ? RED : GREY, 500), marginTop: 2 }}>{i === 4 ? "Jun 1979 · by Gene" : `${s.brand} · Oct 24, 2026`}</div>
            </div>}
          </div>; })}
        {/* the page's timeline stretches from 1979 to 2026 */}
        <div style={{ position: "absolute", left: 100, top: 1560, width: 880, height: 6, background: "#E5E5EA", opacity: tl0 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: `${tl0 * 100}%`, background: RED }} />
          <div style={{ position: "absolute", left: -10, top: 18, ...font("Inter", 40, GREY, 600) }}>1979</div>
          <div style={{ position: "absolute", right: -10, top: 18, ...font("Inter", 40, GREY, 600) }}>2026</div>
        </div>
      </div>
    </AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: benchHook },
    { at: CUT, render: (t) => garage(t), enter: { kind: "pull", d: 0.65, rect: BENCHRECT, r: 8 } },
    { at: DOWN, render: countdown, enter: { kind: "portal", d: 0.6, rect: BENCHRECT, r: 8 } },
    { at: CODY, render: cody, enter: { kind: "whip", d: 0.4, dir: -1 } },
    { at: HALF, render: half, enter: { kind: "whip", d: 0.4, dir: 1 } },
    { at: PAGE, render: page, enter: { kind: "rise", d: 0.6 } },
    { at: BACK, render: (t) => garage(t, true), enter: { kind: "pull", d: 0.65, rect: { x: 290, y: 1500, w: 500, h: 300 }, r: 20 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const snaps = hook === "B" ? [0.2, 1.3] : hook === "C" ? [0, 1, 2, 3].map((i) => hw[2].s + i * 0.4) : [0, 1, 2, 3].map((i) => Math.max(0.02, 0.05 + i * 0.55 - 0.45));
  const sfx = [
    ...snaps.map((s) => [s + 0.25, "tape-click"]),
    [T.five + 0.1, "slide-soft"], [T.five + 0.1, "chip-pop", 0.6], [T.four + 0.1, "slide-soft"], [T.four + 0.1, "chip-pop", 0.6], [T.three + 0.1, "slide-soft"], [T.three + 0.1, "chip-pop", 0.6],
    [T.grandpa - 0.1, "muted-stop"], [T.half - 0.1, "tint-drain"], [T.becomes - 0.2, "card-rise"], ...[0, 1, 2].map((i) => [T.becomes + 0.2 + i * 0.12, "tick-soft"]),
    [T.two - 0.1, "slide-soft"], [T.radiator - 0.3, "card-settle"], [T.new, "tint-swell"], [T.engine - 0.2, "air-drop", 0.6], [T.engine + 0.35, "clunk"], [T.real - 0.2, "measure-draw-x2"],
    [T.older2, "pop-soft"], [ctaT, "cta-pop"],
  ];
  // music: warm night-garage groove; holds its breath before "And number one", returns as the 1979 block lands
  const music = { bpm: 92, root: 50, mode: "major", style: "observe", cut: T.and - 0.35, ret: T.engine + 0.3, room: "shop" };
  return { shots, heads, sfx, music };
}
