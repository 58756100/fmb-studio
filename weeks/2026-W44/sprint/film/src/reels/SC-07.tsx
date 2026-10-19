// @ts-nocheck
// SC-07 (lane C, parts suppliers): Thad (owner, Halvard Wheel Co.) asks his rep Kofi whether people are still running
// their wheels three years later. Reviews only cover the day they arrived. Three customers sent Kofi their build pages:
// an E30 that put them on in 2023 (two track days later, still on), an S2000 that tried another brand and went back,
// and a WRX owner who just bought a second set for winter, which Thad thought never happens. "That's three. I'll ask the
// others." CTA: DM PARTS.
// Device: the rolling ladder. Thad's push carries it down the aisle to the back wall (horizontal search ends: clang);
// then Kofi climbs, and each rung lights one line from a customer's build page: going up = going further in time.
// Bank: warehouse aisle F04, Kofi E07, Thad K4-01 (person only), bronze wheel C07, E30 A10, S2000 A31, WRX A28.
// Drawn: the ladder, the review card. Fictional: Thad, Kofi, Halvard Wheel Co.
// Transitions: dolly down the aisle (photo push) with the ladder, hard stop (clang + wobble), camera tilt up as Kofi
// climbs, rung-to-card slide-outs, tilt down to Thad, back up, CTA landing over the parked ladder (wheel on the top step).
// remocn (ported): spring settle (wobble), micro-scale-fade (rung light), focus-blur-resolve, period-drop.
// New vs the previous reels: vertical ladder timeline.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark, Who } from "./b2kit";

export const HOOK_WORDS = 10;
export const TAIL = 1.3;
export const LIFE = 1.3;
export const BG = "#1F2023";
export const TEXT = { ...HTEXT, size: 108, color: "#F5F5F7" };
export const IMAGES = ["F04", "E07", "K4-01", "C07", "A10", "A31", "A28"];
const HOOKS = { A: "Still on / three years later?", B: "Good reviews. / Still on?", C: "4,000 sets. / Where?" };

const LAD = { x: 120, w: 230, top: 700, bot: 1720 }; // ladder rails
const RUNGS = 9;
const rungY = (i) => LAD.bot - 40 - i * ((LAD.bot - LAD.top - 80) / (RUNGS - 1));
const Ladder = ({ t, lit = [], wob = 0 }) => (
  <div style={{ position: "absolute", left: LAD.x, top: LAD.top, width: LAD.w, height: LAD.bot - LAD.top, transformOrigin: "50% 100%", transform: `rotate(${wob}deg)`, zIndex: 8 }}>
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? LAD.w - 22 : 0, top: 0, width: 22, height: "100%", borderRadius: 8, background: "linear-gradient(90deg, #8E959D, #E5E8EB, #8E959D)" }} />)}
    {Array.from({ length: RUNGS }, (_, i) => { const y = rungY(i) - LAD.top, L = lit[i] ?? 0;
      return <div key={i} style={{ position: "absolute", left: 10, top: y, width: LAD.w - 20, height: 18, borderRadius: 6, background: L > 0 ? `rgba(255,${Math.round(200 - 40 * L)},${Math.round(120 - 60 * L)},1)` : "linear-gradient(180deg, #C7CCD1, #8E959D)", boxShadow: L > 0 ? `0 0 ${24 * L}px ${10 * L}px rgba(255,180,80,${0.5 * L})` : "none" }} />; })}
    <div style={{ position: "absolute", left: -10, top: -30, width: LAD.w + 20, height: 40, borderRadius: 10, background: "linear-gradient(180deg, #D7DBDF, #8E959D)" }} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? LAD.w - 46 : -10, bottom: -40, width: 56, height: 56, borderRadius: 28, background: "radial-gradient(circle, #555 0 30%, #222 32%)", transform: `rotate(${t * 400}deg)` }} />)}
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    honestly: at("honestly?"), reviews: at("reviews"), arrived: at("arrived."), exactly: at("exactly."), so: at("so"), after: at("after"), three: at("three"), sent: at("sent"),
    look: at("look"), this1: at("this"), e30: at("thirty"), twenty: at("twenty"), track: at("track"), still: at("still"), this2: at("this", 2), s2000: at("thousand"), another: at("another"),
    back: at("back"), sure: at("sure."), nobody: at("nobody"), twice: at("twice."), this3: at("this", 3), wrx: at("owner"), second: at("second"), winter: at("winter."), huh: at("huh."),
    thats: at("that's"), ask: at("ask"), cta: tl.cta("d") ?? at("d"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [2] : [0], hold: 0.7 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.4)))].s));
  const heads = [
    hk,
    { ...fx(B("Reviews: / day one only.", T.reviews), [T.reviews, T.arrived - 0.3, T.arrived - 0.15, T.arrived]), key: [1], hold: 0.6 },
    { ...fx(B("And after / that?", T.so), [T.so, T.after, at("that?")]), key: [1], hold: 0.5 },
    { ...fx(B("Three / build pages.", T.three), [T.three, at("build"), at("pages.")]), key: [1], hold: 0.6 },
    { ...fx(B("Nobody buys / twice?", T.nobody), [T.nobody, at("buys"), T.twice]), key: [2], hold: 0.6 },
    { ...fx(B("Three cars. / Ask the rest.", T.thats), [at("three.", 2), at("three.", 2) + 0.2, T.ask, at("others"), at("theirs.")]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "DM PARTS", T.cta), key: [1] },
  ];
  heads[heads.length - 1].words = [{ w: "DM", t: T.cta, line: 0 }, { w: "PARTS", t: at("parts"), line: 0 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // the three rung lines (rung index, car, lines, time)
  const LINES = [
    { r: 2, car: "A10", t: T.e30, l1: "Halvard 5-spoke", d1: "'89 E30 · 2023", l2: "Track day", d2: "May 2026", t2: T.track },
    { r: 4, car: "A31", t: T.s2000, l1: "Other wheels", d1: "2024", l2: "Halvard 5-spoke", d2: "Sep 2025", t2: T.back, grey1: true },
    { r: 6, car: "A28", t: T.wrx, l1: "Halvard 5-spoke", d1: "2022", l2: "Second set (winter)", d2: "Oct 2026", t2: T.second },
  ];
  const BUMP = T.so + 0.95; // the ladder hits the back wall
  const scene = (t) => {
    const roll = EASE.io(seg(t, 0, T.honestly)) * 0.45 + EASE.in(seg(t, T.exactly + 0.1, BUMP)) * 0.55;
    const wob = t > BUMP ? 4 * Math.exp(-(t - BUMP) * 4) * Math.sin((t - BUMP) * 18) : 0;
    const climb = t > T.look - 0.2;
    // Kofi's step: rung index over time
    const step = t < T.look ? 0 : t < T.e30 ? lerp(0, 2, ez(t, T.look, 0.8)) : t < T.s2000 ? lerp(2, 4, ez(t, T.this2 - 0.3, 0.6)) : t < T.wrx ? 4 + 2 * ez(t, T.this3 - 0.3, 0.6) : 6 + 0.6 * ez(t, T.thats - 0.3, 0.6);
    const ky = rungY(Math.min(8, step));
    const tilt = climb ? 0 : 0;
    const pan = ez(t, T.look - 0.2, 0.8, EASE.camera); // ladder slides to the left edge, cards on the right
    const lx = lerp(330, 0, pan);
    const thadDown = ez(t, T.sure - 0.3, 0.6, EASE.camera) * (1 - ez(t, T.this3 - 0.3, 0.6, EASE.camera));
    const lit = Array.from({ length: RUNGS }, (_, i) => { const L = LINES.find((x) => x.r === i); return L ? ez(t, L.t - 0.25, 0.3) : 0; });
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7));
    const d = drift(t, "lad", 3, 0.3);
    return <AbsoluteFill style={{ background: "#1F2023" }}>
      {/* the aisle: the photo dollies in as the ladder rolls, stops hard at the back wall */}
      <div style={{ position: "absolute", inset: -60, transform: `scale(${1.05 + 0.55 * roll - 0.04 * ctaP}) translateY(${(1 - pan) * 0 + 40 * thadDown}px)`, transformOrigin: "50% 45%", filter: `blur(${t > T.exactly && t < BUMP ? 3 : 0}px) brightness(.72)` }}>
        <Img src={src("F04")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,20,22,.6) 0%, rgba(20,20,22,0) 30%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateY(${-160 * thadDown}px) scale(${1 - 0.03 * ctaP})`, transformOrigin: "50% 60%" }}>
        {/* the review card on the shelf edge */}
        {t < T.exactly + 0.4 && t > T.reviews - 0.4 && <div style={{ position: "absolute", left: lerp(1200, 600, ez(t, T.reviews - 0.4, 0.5)) - 900 * ez(t, T.exactly, 0.4, EASE.in), top: 900, padding: "22px 28px", borderRadius: 24, ...CARD, transform: "rotate(-2deg)", zIndex: 12 }}>
          <div style={{ ...inter(48, "#FF9F0A", 700), letterSpacing: "0.1em" }}>★★★★★</div><div style={inter(46, INK, 600)}>"Arrived fast"</div><div style={inter(40, GREY, 500)}>day one</div></div>}
        <div style={{ position: "absolute", left: lx, top: 0, width: W, height: H }}>
          <Ladder t={t} lit={lit} wob={wob} />
          <Cut id="C07" cx={LAD.x + LAD.w / 2 + 70} cy={LAD.top - 95 - 3 * Math.sin(t * 2)} w={150} shadow={0} z={10} />
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${LAD.x + LAD.w / 2}px ${LAD.bot}px`, transform: `rotate(${wob}deg)`, zIndex: 9 }}>
            <Cut id="E07" cx={LAD.x + LAD.w / 2 - 10} cy={ky - 190} w={300} shadow={0} />
          </div>
        </div>
        {/* Thad, pushing at first, then looking up from below */}
        <Cut id="K4-01" cx={lerp(lx + 520, 820, pan)} cy={lerp(1500, 1720, pan) + 120 * (1 - thadDown) * pan} w={lerp(520, 560, pan)} shadow={0} />
        {/* the rung lines */}
        {LINES.map((L, i) => { if (t < L.t - 0.3) return null; const q = spr(t - (L.t - 0.25), 190, 18), y = rungY(L.r) - 150;
          return <div key={i} style={{ position: "absolute", left: lerp(LAD.x + LAD.w - 60, 400, clamp(q)), top: y, width: 620, padding: "18px 22px", borderRadius: 30, ...CARD, opacity: clamp(q * 2), transform: `scale(${0.6 + 0.4 * clamp(q)})`, transformOrigin: "0 50%", zIndex: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 150, height: 74, position: "relative", flex: "none" }}><Cut id={L.car} cx={75} cy={37} w={150} shadow={0.2} /></div>
              <div><div style={inter(40, L.grey1 ? GREY : INK, 600)}>{L.l1}</div><div style={inter(40, GREY, 500)}>{L.d1}</div></div></div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "2px solid #E5E5EA", display: "flex", justifyContent: "space-between", ...land(t, L.t2 - 0.1) }}>
              <span style={inter(44, INK, 650)}>{L.l2}</span><span style={inter(42, RED, 650)}>{L.d2}</span></div>
          </div>; })}
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#C7C7CC", 500)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "caster-roll"], [1.0, "caster-roll"], [T.reviews - 0.4, "slide-soft"], [T.exactly, "air-glide"], [T.exactly + 0.2, "caster-roll"], [BUMP, "clunk"],
    [T.look, "tick-soft"], ...LINES.flatMap((L) => [[L.t - 0.25, "chime"], [L.t2 - 0.1, "pop-soft"]]), [T.this2 - 0.3, "tick-soft"], [T.this3 - 0.3, "tick-soft"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 53, mode: "major", style: "warm", cut: BUMP - 0.05, ret: T.look - 0.2, room: "shop" };
  return { shots: [{ at: 0, render: scene }], heads, sfx, music };
}
