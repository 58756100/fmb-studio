// @ts-nocheck
// S0-10 (lane C, garages): "That's my seat install." "And our shop." The shop's post (300K views) just says Lorraine's
// Garage, not a word about Danny. Lorraine: our bay, our lift, our customer. Danny: with my hands; put both names on it.
// "Fair. I'll fix the post. And both names go on the car's build page." Lorraine's Garage. Seat installed by Danny.
// "Can my name be bigger?" "No."
// Device: one printed photo. The argument happens on its back in pen (shop stamp vs "DANNY", duelling underlines); the
// answer is on its front, which grows into the build-page entry. On "bigger?" his name swells and snaps back on "No."
// Bank: S2000 front A31 (spoken model, bank set A), seat C09, cage/interior photo G05, Danny E05, Lorraine E10, bay F01.
// Fictional: Danny, Lorraine, Lorraine's Garage, Corvo (seat brand).
// Transitions: the print slaps down, card flip (front -> back), pen duel, post caption update, flip back + grow into the
// page (shape), the name gag, CTA landing with the entry where the print sat in frame 0.
// remocn (ported): card flip, handwriting typewriter, inline highlight, focus-blur-resolve, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark, Who, Sweep } from "./b2kit";

export const HOOK_WORDS = 7;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#1D1E21";
export const TEXT = { ...HTEXT, size: 106, color: "#F5F5F7" };
export const IMAGES = ["A31", "C09", "G05", "E05", "E10", "F01"];
const HOOKS = { A: "My install. / Our shop.", B: "300K views. / No name.", C: "Whose name / goes on it?" };
const HAND = (size, color = "#1D3B8A") => ({ fontFamily: "Caveat", fontSize: size, fontWeight: 700, color, lineHeight: 1.0, whiteSpace: "nowrap" });

// the photo print (front: the seat install; back: shop stamp + pen)
const Print = ({ t, x, y, w = 680, rot = 0, flip = 0, danny = 0, lines = 0, s = 1, z = 20 }) => {
  const h = w * 0.68;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${s}) perspective(1600px) rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d", zIndex: z }}>
    <div style={{ position: "absolute", inset: 0, background: "#FAFAF7", padding: 18, boxSizing: "border-box", boxShadow: "0 20px 34px -14px rgba(0,0,0,.6)", backfaceVisibility: "hidden" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#222" }}>
        <Img src={src("G05")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.75)" }} />
        <div style={{ position: "absolute", left: "34%", top: "8%", width: "52%" }}><Cut id="C09" cx={0} cy={0} w={w * 0.36} shadow={0} style={{ left: 0, top: 0, position: "relative" }} /></div>
      </div>
    </div>
    <div style={{ position: "absolute", inset: 0, background: "#F4F1EA", transform: "rotateY(180deg)", backfaceVisibility: "hidden", boxShadow: "0 20px 34px -14px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, top: 50, padding: "10px 18px", border: "5px solid #C8323A", borderRadius: 10, transform: "rotate(-6deg)", ...inter(44, "#C8323A", 800), letterSpacing: "0.05em", opacity: 0.85 }}>LORRAINE'S GARAGE</div>
      {danny > 0 && <div style={{ position: "absolute", left: 380, top: 190, clipPath: `inset(0 ${100 - 100 * danny}% 0 0)` }}><span style={HAND(110)}>DANNY</span></div>}
      {[0, 1, 2, 3].map((i) => lines > i && <div key={i} style={{ position: "absolute", left: i % 2 ? 380 : 40, top: (i % 2 ? 320 : 150) + Math.floor(i / 2) * 22, width: (i % 2 ? 290 : 420) * clamp(lines - i), height: 7, borderRadius: 4, background: i % 2 ? "#1D3B8A" : "#C8323A", transform: "rotate(-2deg)" }} />)}
    </div>
  </div>;
};
// the shop's own social post (styled, no phone frame)
const Post = ({ t, x, y, caption, hiAt = -9, o = 1, s = 1 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 620, padding: "22px 24px", borderRadius: 30, ...CARD, opacity: o, transform: `scale(${s}) rotate(3deg)`, zIndex: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #FF9F0A, #FF375F)" }} />
      <div><div style={inter(42, INK, 650)}>lorrainesgarage</div><div style={inter(40, GREY, 500)}>300K views</div></div></div>
    <div style={{ marginTop: 14, ...inter(44, "#3A3A3C", 500, { whiteSpace: "normal" }) }}>{caption.split("Lorraine's Garage").map((p, i, arr) => <React.Fragment key={i}>{p}{i < arr.length - 1 &&
      <span style={{ background: `linear-gradient(90deg, ${rgba("#FFD60A", 0.6)} ${100 * ez(t, hiAt, 0.4)}%, rgba(0,0,0,0) ${100 * ez(t, hiAt, 0.4)}%)`, borderRadius: 6 }}>Lorraine's Garage</span>}</React.Fragment>)}</div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    the: at("the"), post: at("post"), lorraines: at("lorraine's"), not: at("not"), it: at("it"), bay: at("bay,"), customer: at("customer."), with: at("with"), hands: at("hands."),
    put: at("put"), names: at("names"), on: at("on"), fair: at("fair."), fix: at("fix"), post2: at("post.", 2), and2: at("and", 2), car: at("car's"), page: at("page."),
    lg: at("lorraine's", 2), seat: at("seat"), danny: at("danny."), okay: at("okay,"), better: at("better."), can: at("can"), bigger: at("bigger?"), no: at("no."), cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [3] : [1], hold: 0.5 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Both names, / on the car.", T.and2), [at("both", 2), at("names", 2), T.on + 4 > T.car ? T.car - 0.2 : T.car, at("the", 3), T.car]), key: [3], hold: 0.5 },
    { ...ctaHead(tl, "Start your shop's / build pages", T.cta), key: [3] },
  ];
  heads[1].words = [{ w: "Both", t: at("both", 2), line: 0 }, { w: "names,", t: at("names", 2), line: 0 }, { w: "on", t: T.car - 0.3, line: 1 }, { w: "the", t: T.car - 0.15, line: 1 }, { w: "car.", t: T.car, line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const bench = (t, phase) => {
    const d = drift(t, "bn" + phase, 3, 0.3);
    const slap = spr(t - 0.05, 260, 16);
    const flip = phase === "first" ? ez(t, T.hands, 0.6, EASE.camera) * (1 - ez(t, T.and2 - 0.2, 0.5, EASE.camera)) : 0;
    const danny = phase === "first" ? seg(t, T.put, T.names + 0.4) : 0;
    const lines = phase === "first" ? 4 * seg(t, T.it + 6 > T.on ? T.on : T.on, T.fix) : 0;
    const lor = phase === "first" ? spr(t - (T.it - 0.3), 170, 17) : 1;
    const caption = t > T.post2 - 0.2 ? "Seat install by Danny at Lorraine's Garage" : "Fresh bucket seat install at Lorraine's Garage";
    const grow = phase === "first" ? ez(t, T.and2 - 0.1, 0.8, EASE.camera) : 0;
    return <AbsoluteFill style={{ background: "#1D1E21" }}>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.05)` }}>
        <Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.55) blur(4px)" }} />
      </div>
      {/* the steel bench */}
      <div style={{ position: "absolute", left: -40, right: -40, top: 1080, height: 900, background: "linear-gradient(180deg, #9AA0A6, #6B7076)", boxShadow: "0 -10px 0 #C9CDD2" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, rgba(0,0,0,0) 2px 9px)" }} /></div>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <Post t={t} x={380} y={560} caption={caption} hiAt={T.lorraines} o={1 - grow} />
        <Print t={t} x={200} y={1100 - (1 - clamp(slap)) * 200} rot={-4} flip={flip} danny={danny} lines={lines} s={lerp(1, 1.2, grow)} z={20} />
        {/* the two pressing fingertips */}
        {grow < 0.5 && [[220, 1120], [860, 1530]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: "rgba(255,255,255,.18)", border: "4px solid rgba(255,255,255,.7)", zIndex: 25, transform: `scale(${1 + 0.06 * Math.sin(t * 5 + i)})`, opacity: 1 - grow * 2 }} />)}
      </div>
      <Cut id="E05" cx={lerp(140, 120, grow)} cy={1640} w={460} shadow={0} />
      {lor > 0.01 && <Cut id="E10" cx={lerp(1400, 900, clamp(lor))} cy={1650} w={560} shadow={0} />}
    </AbsoluteFill>;
  };
  // the page entry (the print's front, grown)
  const page = (t, phase) => {
    const d = drift(t, "pg" + phase, 3, 0.25);
    const big = ez(t, T.bigger - 0.3, 0.4) * (1 - ez(t, T.no, 0.2, EASE.in));
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "#1D1E21" }}>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.05)` }}><Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.55) blur(4px)" }} /></div>
      <Cut id="A31" cx={540} cy={820} w={700} shadow={0.3} style={{ filter: "brightness(.85) blur(1px)" }} />
      <div style={{ position: "absolute", left: 60, top: 1000, width: 960, ...CARD, padding: "30px 36px", boxSizing: "border-box", transform: `${dT(d, 0.4)} scale(${1 - 0.03 * ctaP})`, overflow: "hidden" }}>
        <Sweep t={t} o={0.25} />
        <div style={{ display: "flex", gap: 22 }}>
          <div style={{ width: 300, height: 220, borderRadius: 20, overflow: "hidden", flex: "none", position: "relative", background: "#222" }}>
            <Img src={src("G05")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.75)" }} />
            <div style={{ position: "absolute", left: 110, top: 30 }}><Cut id="C09" cx={0} cy={0} w={130} shadow={0} style={{ position: "relative", left: 0, top: 0 }} /></div></div>
          <div><div style={{ display: "flex", gap: 12, alignItems: "center" }}><Wordmark size={40} /></div>
            <div style={{ ...inter(54, INK, 700), marginTop: 10 }}>Bucket seat · Corvo</div><div style={inter(46, RED, 650)}>Oct 2026</div></div>
        </div>
        <div style={{ marginTop: 24, display: "inline-block", padding: "6px 10px", borderRadius: 12, background: phase === "read" ? rgba("#FFD60A", 0.4 * seg(t, T.lg, T.lg + 0.3) * (1 - seg(t, T.seat - 0.2, T.seat))) : "none" }}>
          <Who ch="L" name="Lorraine's Garage" role="garage" bg="#FF375F" size={56} /></div>
        <div style={{ marginTop: 16, ...inter(50, "#1D1D1F", 600), transformOrigin: "0 50%" }}>Seat installed by <span style={{ display: "inline-block", color: RED, transform: `scale(${1 + 0.6 * big})`, transformOrigin: "0 70%", background: phase === "read" ? rgba("#FFD60A", 0.4 * seg(t, T.seat, T.seat + 0.3)) : "none", borderRadius: 8 }}>Danny</span></div>
      </div>
      {phase === "end" && <Cut id="E10" cx={960} cy={1700} w={420} shadow={0} />}
      {phase === "end" && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", zIndex: 40 }}>
        <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#E5E5EA", 500)} keepCaret={0.4} /></div>}
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => bench(t, "first") },
    { at: T.page - 0.1, render: (t) => page(t, "read"), enter: { kind: "portal", d: 0.6, rect: { x: 160, y: 1060, w: 760, h: 520 }, r: 10 } },
    { at: T.cta - 0.12, render: (t) => page(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "paper-thud"], [T.lorraines, "draw"], [T.it - 0.3, "slide-soft"], [T.hands, "page-turn"], [T.put, "pen-write"], [T.on, "pen-write"], [T.fair - 0.2, "pen-write", 0.6],
    [T.post2 - 0.2, "pop-soft"], [T.and2 - 0.1, "page-turn"], [T.lg, "pop-soft"], [T.seat, "pop-soft"], [T.bigger - 0.3, "tint-swell"], [T.no, "pop-soft"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 108, root: 55, mode: "major", style: "warm", cut: T.can - 0.2, ret: T.cta - 0.12, room: "shop" };
  return { shots, heads, sfx, music };
}
