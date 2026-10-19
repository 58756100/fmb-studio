// @ts-nocheck
// SC-09 (lane C, parts suppliers): "Ortiz, who's your best customer?" "Easy. Dutch. Calls twice a week." What did Dutch
// buy this year? Brake fluid, and about forty opinions. Whose car has she actually seen her parts on? Nobody's: it all
// leaves in a box. Then Arlo: "You can see mine. It's on my build page." Her clutch, her exhaust, her coilovers: four
// years of her shelf on one car, and she'd never seen it. "So, who's your best customer?" "Arlo. Don't tell Dutch."
// Device: Ortiz's label maker. Every answer is typed and printed; strips curl off the counter. At the turn she labels
// what she reads on Arlo's page and lays each strip on his car where the part sits.
// Car: the coupe side view A26 (the script's AE86 is one slot away in LA-10 and an E30 one slot later in S0-13 the same
// day, so Arlo's car changed; the VO never names it). Parts: clutch C13, exhaust C05, coilovers C02, steering wheel C10, gauge pod C18 (the box on the
// counter). Ortiz E04, Arlo E03, counter F05. Fictional: Ortiz Speed Parts, Ortiz, Dutch, Arlo.
// Transitions: push-in on the counter, rack focus to Arlo at the far end, portal out of the flat phone (the page header
// photo becomes the car laid along the counter), pull back, back to the counter for the callback, CTA landing.
// remocn (ported): typewriter (label maker), path-curl strips, focus-pull (rack), focus-blur-resolve, period-drop.
// New vs the previous reels: printed label strips as the text device.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep } from "./b2kit";

export const HOOK_WORDS = 5;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["F05", "E04", "E03", "A26", "C13", "C05", "C02", "C10", "C18", "D01"];
const HOOKS = { A: "Ortiz / Speed Parts", B: "Loudest isn't / best.", C: "Who calls / the most?" };
const TAPE = { fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 50, color: "#111", letterSpacing: "0.06em", whiteSpace: "nowrap" };

// a printed label strip (white tape, mono caps), curling as it leaves
const Strip = ({ text, x, y, rot = 0, curl = 0, o = 1, s = 1, z = 30, reveal = 1 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 50%", transform: `rotate(${rot}deg) scale(${s}) perspective(800px) rotateY(${-curl * 25}deg) rotateZ(${curl * -6}deg)`, opacity: o, zIndex: z }}>
    <div style={{ padding: "10px 22px", background: "linear-gradient(180deg, #FFFFFF, #EDEDED)", borderRadius: 4, boxShadow: "0 8px 14px -6px rgba(0,0,0,.45)", minWidth: 120, clipPath: `inset(0 ${100 - 100 * reveal}% 0 0)` }}>
      <span style={TAPE}>{text}</span></div>
  </div>
);
// the label maker (drawn): grey body, small display, keys
const Maker = ({ x, y, text = "", t, rot = -6 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 360, height: 520, transform: `rotate(${rot}deg) scale(0.82)`, transformOrigin: "0 100%", zIndex: 25, borderRadius: 50, background: "linear-gradient(160deg, #7C8087, #4B4F55)", boxShadow: "0 30px 40px -20px rgba(0,0,0,.6), inset 0 0 0 4px rgba(255,255,255,.12)" }}>
    <div style={{ position: "absolute", left: 30, top: 30, width: 300, height: 90, borderRadius: 14, background: "#9DB39A", boxShadow: "inset 0 0 0 4px #3A3D42", display: "flex", alignItems: "center", padding: "0 16px", boxSizing: "border-box" }}>
      <span style={{ ...TAPE, fontSize: 44, color: "#1E2A1C" }}>{text}<span style={{ opacity: Math.floor(t * 3) % 2 ? 0 : 1 }}>_</span></span></div>
    <div style={{ position: "absolute", left: 30, top: 140, width: 300, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ height: 40, borderRadius: 8, background: "linear-gradient(180deg, #E9EBEE, #B9BDC3)" }} />)}</div>
    <div style={{ position: "absolute", left: 100, top: -14, width: 160, height: 20, borderRadius: 6, background: "#222" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    oh: at("oh,"), dutch: at("dutch."), calls: at("calls"), and1: at("and"), buy: at("buy?"), brake: at("brake"), fluid: at("fluid."), opinions: at("opinions."), okay: at("okay."),
    whose: at("whose"), honestly: at("honestly?"), nobodys: at("nobody's."), leaves: at("leaves"), box: at("box,"), sorry: at("sorry,"), arlo: at("arlo."), you: at("you", 2),
    build: at("build"), page: at("page."), thats: at("that's", 2), clutch: at("clutch."), exhaust: at("exhaust."), coilovers: at("coilovers..."), four: at("four"), steering: at("steering"),
    gauges: at("gauges"), four2: at("four", 2), never: at("never"), so: at("so."), whos: at("who's"), arlo2: at("arlo.", 2), dont: at("don't"), dutch3: at("dutch.", 3),
    cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: [], hold: 0.5 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, hk.words.length)))].s));
  const heads = [
    hk,
    { ...fx(B("Whose car / has she seen?", T.whose), [T.whose, at("car"), at("seen"), at("seen") + 0.15, at("on?")]), key: [1], hold: 0.5 },
    { ...fx(B("Four years, / one car.", T.four2), [T.four2, at("years", 2), at("one"), at("car.", 2)]), key: [2], hold: 1.2 },
    { ...ctaHead(tl, "Send this to your / parts counter", T.cta), key: [5] },
  ];
  heads[3].words = [{ w: "Send", t: T.cta, line: 0 }, { w: "this", t: at("this", 4), line: 0 }, { w: "to", t: at("to"), line: 0 }, { w: "your", t: at("to") + 0.1, line: 0 }, { w: "parts", t: at("parts", 2), line: 1 }, { w: "counter", t: at("counter"), line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const typed = (t) => t >= T.dont - 0.5 ? "ARLO" : t > T.nobodys - 0.2 ? "" : t > T.brake - 0.3 ? "BRAKE FLUID".slice(0, Math.round(seg(t, T.brake - 0.3, T.fluid) * 11)) : t > T.oh ? "DUTCH".slice(0, Math.round(seg(t, T.oh, T.dutch) * 5)) : "";
  // ---------------------------------------------------------------- the counter
  const counter = (t, phase) => {
    const d = drift(t, "ctr" + phase, 3, 0.3);
    const push = phase === "first" ? EASE.io(seg(t, 0, T.sorry)) : 1;
    const rack = phase === "first" ? ez(t, T.sorry - 0.4, 0.6) : 0;
    const arloIn = phase === "first" ? ez(t, T.leaves - 0.2, 0.6) : 0;
    const ring = phase === "end" && t > T.dutch3 - 0.2 && t < T.dutch3 + 1.6 ? Math.sin(t * 70) * 5 : 0;
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    const strip = (txt, t0, i) => { if (t < t0) return null; const p = ez(t, t0, 0.5), away = ez(t, t0 + 1.4, 0.8, EASE.in);
      return <Strip key={i} text={txt} x={lerp(380, 120 - away * 500, away)} y={lerp(1180, 1050 - i * 40, p) - away * 200} rot={-6 - away * 30} curl={away} o={1 - seg(away, 0.7, 1)} reveal={p} />; };
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.04 + 0.05 * push - 0.03 * ctaP})` }}>
        <Img src={src("F05")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", filter: `blur(${(1.5 + 2 * (1 - rack) * 0).toFixed(1)}px) brightness(1.04)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(245,245,247,.9) 0%, rgba(245,245,247,.4) 30%, rgba(245,245,247,0) 50%)" }} />
      </div>
      {/* Arlo at the far end of the counter: out of focus, then racked in as he steps up */}
      {arloIn > 0.01 && <div style={{ filter: `blur(${(8 * (1 - rack)).toFixed(1)}px)`, opacity: arloIn }}><Cut id="E03" cx={lerp(920, 830, rack)} cy={lerp(1010, 1180, rack)} w={lerp(300, 520, rack)} shadow={0} /></div>}
      <div style={{ filter: `blur(${(5 * rack).toFixed(1)}px)` }}><Cut id="E04" cx={lerp(560, 360, rack)} cy={1180} w={560} shadow={0} /></div>
      {phase === "end" && <><Cut id="C18" cx={760} cy={1420} w={300} shadow={0.35} />
        <div style={{ position: "absolute", left: 870, top: 1240, transform: `translateX(${ring}px) rotate(-12deg)` }}><Cut id="D01" cx={0} cy={0} w={150} shadow={0.3} />
          {Math.abs(ring) > 0.5 && <div style={{ position: "absolute", left: -90, top: -150, width: 180, height: 300, borderRadius: 24, boxShadow: `0 0 40px 10px ${rgba("#34C759", 0.6)}` }} />}</div>
        {t > T.arlo2 - 0.2 && <Strip text="ARLO" x={lerp(330, 640, ez(t, T.dont - 0.1, 0.5))} y={lerp(1180, 1370, ez(t, T.dont - 0.1, 0.5))} rot={lerp(-6, -3, ez(t, T.dont, 0.4))} reveal={ez(t, T.arlo2 - 0.2, 0.4)} z={35} />}</>}
      <Maker x={60} y={1260} text={typed(t)} t={t} />
      {phase === "first" && <>{strip("DUTCH", T.dutch, 0)}{strip("BRAKE FLUID", T.fluid, 1)}{strip("", T.leaves, 2)}</>}
      {phase === "first" && t > T.sorry + 0.3 && <div style={{ position: "absolute", left: 470, top: lerp(1700, 1430, ez(t, T.mine ?? T.you, 0.5)), width: 330, height: 180, borderRadius: 30, background: "#111", transform: "rotate(-4deg)", boxShadow: "0 20px 30px -10px rgba(0,0,0,.5)", padding: 10, boxSizing: "border-box", zIndex: 28 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 22, overflow: "hidden", background: "#E9E9EE", position: "relative" }}><Cut id="A26" cx={155} cy={80} w={250} shadow={0} /></div></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- Arlo's page: the car along the counter, entries, labels land
  const CAR = { x: 160, y: 720, w: 760 }; const CH = CAR.w / (1605 / 620);
  const page = (t, phase) => {
    const d = drift(t, "pg" + phase, 3, 0.25);
    const back = phase === "back" ? ez(t, T.four2 - 0.3, 0.8, EASE.camera) : 0; const R0 = 100 + CH + 50;
    const rows = [["C13", "Clutch kit", "Jul 2022 · Ortiz", T.clutch], ["C05", "Exhaust", "2023 · Ortiz", T.exhaust], ["C02", "Coilovers", "2024 · Ortiz", T.coilovers], ["C10", "Steering wheel", "2025", T.steering]];
    const labs = [["CLUTCH · 2022", 0.5, 0.58, T.clutch + 0.3], ["EXHAUST · 2023", 0.85, 0.18, T.exhaust + 0.3], ["COILOVERS · 2024", 0.2, 1.0, T.coilovers + 0.3]];
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.5)}` }}>
        <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, overflow: "hidden" }}>
          <Sweep t={t} o={0.25} />
          <div style={{ position: "absolute", left: 32, top: 26, display: "flex", alignItems: "center", gap: 14 }}><Wordmark size={42} /><span style={inter(44, INK, 650)}>Arlo · '86 coupe</span></div>
          <div style={{ position: "absolute", left: 0, top: 100, width: 960, height: CH + 40, background: "radial-gradient(120% 90% at 50% 70%, #fff, #EDEDF1)" }}>
            <Cut id="A26" cx={480} cy={20 + CH / 2} w={CAR.w} shadow={0.3} /></div>
          {rows.map(([img, k, v, tt], i) => <div key={i} style={{ position: "absolute", left: 30, top: R0 + i * 116, width: 900, height: 106, borderRadius: 22, background: i === 3 && t > T.steering ? rgba("#FFD60A", 0.18) : "#F2F2F7", display: "flex", alignItems: "center", gap: 20, padding: "0 20px", boxSizing: "border-box", ...land(t, Math.min(tt, T.clutch) - 0.6 + i * 0.12) }}>
            <div style={{ width: 110, height: 86, position: "relative", flex: "none" }}><Cut id={img} cx={55} cy={43} w={100} shadow={0} /></div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}><span style={inter(46, INK, 650)}>{k}</span><span style={inter(42, i < 3 ? RED : GREY, 550)}>{v}</span></div></div>)}
          {/* the empty gauge slot */}
          <div style={{ position: "absolute", left: 30, top: R0 + 4 * 116, width: 900, height: 96, borderRadius: 22, border: "4px dashed #C7C7CC", display: "flex", alignItems: "center", padding: "0 24px", boxSizing: "border-box", ...land(t, T.gauges - 0.2) }}>
            <span style={inter(44, GREY, 600)}>Gauges · this weekend</span></div>
        </div>
        {labs.map(([txt, u, v, tt], i) => { if (t < tt - 0.3) return null; const p = spr(t - (tt - 0.3), 200, 15);
          return <Strip key={i} text={txt} x={lerp(40, Math.min(560, CAR.x + u * CAR.w - 150), clamp(p))} y={lerp(1700, 560 + 100 + 20 + v * CH - 40, clamp(p))} rot={lerp(-20, -4 + i * 3, clamp(p))} s={0.85} z={40} />; })}
      </div>
      {back > 0.01 && <><Cut id="E04" cx={lerp(-200, 150, back)} cy={1700} w={380} shadow={0} /><Cut id="E03" cx={lerp(1300, 930, back)} cy={1720} w={420} shadow={0} /></>}
    </Studio></AbsoluteFill>;
  };

  const PHONE = { x: 480, y: 1440, w: 310, h: 160 };
  const shots = [
    { at: 0, render: (t) => counter(t, "first") },
    { at: T.page - 0.1, render: (t) => page(t, "read"), enter: { kind: "portal", d: 0.65, rect: PHONE, r: 22 } },
    { at: T.four2 - 0.3, render: (t) => page(t, "back"), enter: { kind: "match" } },
    { at: T.so - 0.12, render: (t) => counter(t, "end"), enter: { kind: "rise", d: 0.55 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [T.oh, "typing:0.8"], [T.dutch, "tape-click-x2"], [T.brake - 0.3, "typing:0.9"], [T.fluid, "tape-click-x2"], [T.leaves, "tape-click-x2"], [T.sorry - 0.4, "lens-settle"],
    [T.you, "slide-soft"], [T.page - 0.1, "portal"], [T.clutch + 0.0, "tape-click"], [T.exhaust, "tape-click"], [T.coilovers, "tape-click"], [T.steering, "shimmer-soft"],
    [T.gauges - 0.2, "pop-soft"], [T.four2 - 0.3, "pull"], [T.arlo2 - 0.2, "typing:0.4"], [T.dont - 0.1, "paper-thud"], [T.dutch3 - 0.2, "notif"], [T.dutch3 + 0.6, "notif"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 104, root: 55, mode: "major", style: "warm", cut: T.page - 0.4, ret: T.thats - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
