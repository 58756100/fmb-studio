// @ts-nocheck
// SC-02 (lane C, collectors / modern trucks): one of the 23 parts Cassie has changed on her truck is clunking. Last time
// she said "a few mods" and the tech spent an hour working out what she'd changed. This time she sent the truck's build
// page before pulling in. Marco reads it: Trailhead did the lift; the end links went on in August. "Yep. I fitted those
// myself." "Then that's where we start." Found the clunk: one end link is loose. "That one's on me." But this time he
// knew where to look first.
// Device: the X-ray. For a moment the truck's body goes translucent and one part glows, linked by Marco's finger path
// from the entry he is reading. An editorial metaphor for the record, never shown as a scanner.
// Brand safety: the VO names the truck's model, so bank set A only (A35 side). People: Cassie E02, Marco K4-04 (person
// only, no car). Bay F01, counter F05, suspension photo G02, wrench D04. Fictional: Cassie, Marco, Trailhead 4x4.
// Transitions: lift -> counter (rise, grey memory), flashlight sweep, bill slides, colour returns as the link card
// slides across, tap into the entry, the finger's path carries into the X-ray on the truck (match), counter <-> lift,
// CTA landing over frame 0's lift shot, quiet.
// remocn (ported): x-ray reveal (layered filters), flashlight mask, simulated-cursor path, typewriter, period-drop.
// New vs the previous reels: X-ray glow as the link between record and part.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep, Ripple } from "./b2kit";

export const HOOK_WORDS = 12;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#1C1D20";
export const TEXT = { ...HTEXT, size: 108, color: "#F5F5F7" };
export const IMAGES = ["A35", "F01", "F05", "E02", "K4-04", "G02", "D04"];
const HOOKS = { A: "23 parts. / One clunk.", B: "23 answers.", C: "My fault?" };
const AMBER = "#FFB23F";
const TR = { cx: 540, cy: 1060, w: 1040 }; const TH = TR.w / (1.0); // placeholder, aspect from Cut
const LINK = { u: 0.27, v: 0.56 }; // the front sway-bar end link on the side view

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    last: at("last"), said: at("said"), mods: at("mods,'"), and: at("and"), hour: at("hour"), changed: at("changed."), so: at("so"), sent: at("sent"), page: at("page"),
    okay: at("okay."), trailhead: at("trailhead"), lift: at("lift."), these: at("these"), links: at("links"), august: at("august?"), yep: at("yep."), fitted: at("fitted"),
    then: at("then"), start: at("start."), found: at("found"), clunk: at("clunk."), loose: at("loose."), yeah: at("yeah."), me: at("me."), but: at("but"), knew: at("knew"),
    look: at("look"), cta: tl.cta("start") ?? at("start", 2),
  };
  const HC = (tl.hook.find((x) => /clunk/i.test(x.w)) ?? tl.hook[tl.hook.length - 1]).s; // the clunk in the hook line
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [0] : [1], hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.2)))].s));
  const heads = [
    hk,
    { ...fx(B("'A few / mods.'", T.said), [at("'a"), at("few"), T.mods]), key: [], hold: 0.6, color: "#1D1D1F" },
    { ...fx(B("An hour / to find out.", T.hour), [at("an"), T.hour, T.changed - 0.3, T.changed - 0.15, T.changed]), key: [1], hold: 0.6, color: "#1D1D1F" },
    { ...fx(B("Build page, / sent ahead.", T.sent), [at("build"), T.page, T.sent, at("before")]), key: [2], hold: 1.3, color: "#1D1D1F" },
    { ...fx(B("I fitted / those.", T.yep), [tl.after("i", T.yep), T.fitted, at("those")]), key: [0], hold: 0.6 },
    { ...fx(B("Found / the clunk.", T.found), [T.found, at("your"), T.clunk]), key: [2], hold: 0.6, color: "#1D1D1F" },
    { ...fx(B("Knew where / to look.", T.knew), [T.knew, tl.after("where", T.knew - 0.1), at("to"), T.look]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "Start your truck's / build page", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the truck on the lift (with the X-ray)
  const lift = (t, phase) => {
    const d = drift(t, "lift" + phase, 3, 0.3);
    const clunk = phase === "hook" ? HC : phase === "check" ? T.start + 0.1 : -9;
    const shake = t > clunk && t < clunk + 0.5 ? Math.sin((t - clunk) * 60) * 8 * (1 - (t - clunk) / 0.5) : 0;
    const xr = phase === "xray" ? ez(t, T.august - 0.1, 0.5) : phase === "check" ? 1 - ez(t, T.found - 0.4, 0.4) : phase === "fix" ? 1 - ez(t, T.look, 0.8) : 0;
    const glow = phase === "xray" ? ez(t, T.august, 0.5) : phase === "check" ? 1 : phase === "fix" ? 1 - ez(t, T.look, 0.8) : 0;
    const wr = phase === "check" ? ez(t, T.then + 0.2, 0.7, EASE.camera) : phase === "fix" ? 1 : 0;
    const torque = phase === "fix" ? 10 * Math.sin(Math.min(1, seg(t, T.but, T.knew + 0.4)) * Math.PI * 3) : 0;
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    const w = TR.w, h = w / (1615 / 830), lx = TR.cx - w / 2 + LINK.u * w, ly = TR.cy - h / 2 + LINK.v * h;
    const shrink = phase === "xray" || phase === "check" ? 0 : 0;
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.06 - 0.03 * ctaP})` }}>
        <Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", filter: `brightness(${0.85 - 0.35 * xr}) saturate(${1 - 0.5 * xr})` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,15,18,.65) 0%, rgba(14,15,18,0) 36%)" }} />
      </div>
      {/* lift arms */}
      <div style={{ position: "absolute", left: 230, top: TR.cy + h * 0.38, width: 620, height: 26, borderRadius: 8, background: "linear-gradient(180deg, #E4B92A, #A7861A)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${shake}px, ${-Math.abs(shake) * 0.4}px) rotate(${shake * 0.06}deg)`, transformOrigin: `${lx}px ${ly}px` }}>
        <Cut id="A35" cx={TR.cx} cy={TR.cy} w={w} shadow={0} style={{ filter: xr > 0.01 ? `grayscale(${xr}) brightness(${1 + 0.6 * xr}) contrast(${1 - 0.3 * xr}) opacity(${1 - 0.55 * xr})` : undefined }} />
        {xr > 0.01 && <div style={{ position: "absolute", left: TR.cx - w / 2, top: TR.cy - h / 2, width: w, height: h, opacity: 0.5 * xr, mixBlendMode: "screen", WebkitMaskImage: `url(${src("A35")})`, WebkitMaskSize: "100% 100%", background: "linear-gradient(180deg, #7FB8FF, #2A5BA8)" }} />}
        {/* the end link (drawn), glowing */}
        {glow > 0.01 && <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs><filter id="glw"><feGaussianBlur stdDeviation="10" /></filter></defs>
          <g opacity={glow}>
            <line x1={lx - 30} y1={ly - 70} x2={lx + 10} y2={ly + 30} stroke={AMBER} strokeWidth={36} strokeLinecap="round" filter="url(#glw)" opacity={0.8 + 0.2 * Math.sin(t * 6)} />
            <line x1={lx - 30} y1={ly - 70} x2={lx + 10} y2={ly + 30} stroke="#FFE2A8" strokeWidth={14} strokeLinecap="round" />
            <circle cx={lx - 30} cy={ly - 70} r={16} fill="#FFE2A8" /><circle cx={lx + 10} cy={ly + 30} r={16} fill="#FFE2A8" />
            <circle cx={lx - 10} cy={ly - 20} r={90 + 10 * Math.sin(t * 4)} fill="none" stroke={AMBER} strokeWidth={4} opacity={0.6} />
          </g></svg>}
        {/* the tech's wrench */}
        {wr > 0.01 && <div style={{ position: "absolute", left: lerp(1300, lx + 10, wr), top: lerp(1700, ly + 30, wr), width: 0, height: 0, transform: `rotate(${lerp(140, 112, wr) + torque}deg)`, zIndex: 20 }}>
          <Cut id="D04" cx={252} cy={137} w={600} shadow={0} /></div>}
      </div>
      {phase === "xray" && <div style={{ position: "absolute", left: 70, top: 1420, padding: "16px 26px", borderRadius: 34, ...CARD, ...land(t, T.yep - 0.2), zIndex: 30 }}>
        <Who ch="C" name="Cassie" role="fitted them herself" bg={RED} size={56} /></div>}
      {phase === "end" && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", zIndex: 40 }}>
        <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#E5E5EA", 500)} keepCaret={0.4} /></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the service counter (grey memory, then colour)
  const URLC = { x: 120, y: 1240, w: 840, h: 110 };
  const counter = (t, phase) => {
    const d = drift(t, "ctr" + phase, 3, 0.3);
    const grey = phase === "memory" ? 1 - ez(t, T.so - 0.4, 0.6) : 0;
    const beam = phase === "memory" ? seg(t, T.and, T.changed + 0.3) : 0;
    const bill = phase === "memory" ? spr(t - (T.hour - 0.1), 180, 17) : 0;
    const crumple = phase === "memory" ? ez(t, T.so - 0.4, 0.4, EASE.in) : 0;
    const card = phase === "memory" ? spr(t - (T.sent - 0.2), 160, 18) : phase === "found" ? 1 : 0;
    return <AbsoluteFill style={{ filter: grey > 0.01 ? `grayscale(${grey}) brightness(${1 - 0.08 * grey})` : undefined }}>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.05)` }}>
        <Img src={src("F05")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", filter: "brightness(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(245,245,247,.88) 0%, rgba(245,245,247,.4) 30%, rgba(245,245,247,0) 50%)" }} />
      </div>
      <Cut id="K4-04" cx={790} cy={1300} w={520} shadow={0} />
      <Cut id="E02" cx={250} cy={1480} w={520} shadow={0} />
      {/* the flashlight beam hunting (memory) */}
      {beam > 0 && beam < 1 && <div style={{ position: "absolute", left: lerp(-300, 900, beam) + 120 * Math.sin(t * 5), top: 820 + 80 * Math.sin(t * 3), width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,250,220,.75), rgba(255,250,220,0))", mixBlendMode: "screen" }} />}
      {bill > 0.01 && crumple < 1 && <div style={{ position: "absolute", left: lerp(1200, 330, clamp(bill)), top: 1180, width: 420, padding: "22px 26px", background: "#FFFDF6", boxShadow: "0 18px 30px -12px rgba(0,0,0,.45)", transform: `rotate(-4deg) scale(${1 - 0.7 * crumple}) rotate(${crumple * 90}deg)`, opacity: 1 - crumple, zIndex: 20 }}>
        <div style={inter(42, GREY, 500)}>Service bill</div><div style={{ ...inter(52, INK, 700), marginTop: 6 }}>Diagnosis</div><div style={inter(48, RED, 650)}>1.0 hr</div></div>}
      {card > 0.01 && <div style={{ position: "absolute", left: lerp(-900, URLC.x, clamp(card)), top: URLC.y, width: URLC.w, height: URLC.h, borderRadius: 55, ...CARD, display: "flex", alignItems: "center", gap: 18, padding: "0 32px", boxSizing: "border-box", zIndex: 25 }}>
        <svg width={44} height={44} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke={RED} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <span style={inter(46, INK, 500)}>fuelmybuild.com/cassie/truck</span></div>}
      {phase === "found" && <div style={{ position: "absolute", left: 300, top: 1000, padding: "20px 28px", background: "#FFFDF6", boxShadow: "0 18px 30px -12px rgba(0,0,0,.45)", transform: "rotate(3deg)", zIndex: 26, ...land(t, T.found) }}>
        <div style={inter(42, GREY, 500)}>Tech note</div><div style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 600, color: INK }}>front left end link loose</div></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the entry Marco reads (finger path runs to the end links)
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    const f = track(t, { x: 820, y: 900, o: 0 }, [[T.trailhead - 0.2, { x: 700, y: 920, o: 1 }, 0.3], [T.these - 0.2, { x: 700, y: 1170 }, 0.5], [T.august - 0.3, { x: 1150, y: 1300 }, 0.45, EASE.in]]);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 980, ...CARD, overflow: "hidden", transform: dT(d, 0.5) }}>
        <Sweep t={t} o={0.25} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 250, background: "radial-gradient(120% 90% at 50% 70%, #fff, #E9E9EE)" }}>
          <Cut id="A35" cx={480} cy={135} w={540} shadow={0.3} />
          <div style={{ position: "absolute", left: 24, top: 22, padding: "8px 20px", borderRadius: 26, background: "rgba(255,255,255,.85)" }}><Wordmark size={42} /></div></div>
        <div style={{ position: "absolute", left: 40, top: 270, ...inter(56, INK, 700) }}>Cassie's truck · 23 parts</div>
        {[["Lift kit", "Trailhead 4x4 · 2023", T.trailhead - 0.1, null], ["Sway-bar end links", "Aug 2026 · logged by Cassie", T.these - 0.1, "G02"]].map(([k, v, tt, img], i) =>
          <div key={i} style={{ position: "absolute", left: 40, top: 370 + i * 250, width: 880, height: 220, borderRadius: 28, background: i ? rgba(AMBER, 0.12) : "#F2F2F7", display: "flex", alignItems: "center", gap: 24, padding: "0 24px", boxSizing: "border-box", ...land(t, tt) }}>
            {img ? <Thumb id={img} w={220} h={170} t={t} fx={0.4} fy={0.6} k={1.3} r={20} /> : <div style={{ width: 220, height: 170, borderRadius: 20, background: "#E5E5EA", display: "grid", placeItems: "center", ...inter(44, GREY, 600) }}>4x4</div>}
            <div><div style={inter(52, INK, 650)}>{k}</div><div style={inter(42, i ? RED : GREY, 550)}>{v}</div></div></div>)}
      </div>
      {f.o > 0.01 && <div style={{ position: "absolute", left: f.x - 30, top: f.y - 30, width: 60, height: 60, borderRadius: 30, background: rgba(AMBER, 0.9), boxShadow: `0 0 0 12px ${rgba(AMBER, 0.3)}`, opacity: f.o, zIndex: 40 }} />}
    </Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => lift(t, "hook") },
    { at: T.last - 0.12, render: (t) => counter(t, "memory"), enter: { kind: "rise", d: 0.55 } },
    { at: T.okay - 0.12, render: entry, enter: { kind: "tap", d: 0.5, rect: URLC, r: 55 } },
    { at: T.august + 0.05, render: (t) => lift(t, "xray"), enter: { kind: "match" } },
    { at: T.then - 0.1, render: (t) => lift(t, "check"), enter: { kind: "match" } },
    { at: T.found - 0.12, render: (t) => counter(t, "found"), enter: { kind: "rise", d: 0.5 } },
    { at: T.but - 0.12, render: (t) => lift(t, "fix"), enter: { kind: "rise", d: 0.5 } },
    { at: T.cta - 0.12, render: (t) => lift(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [HC, "clunk"], [T.last - 0.3, "tint-drain"], [T.and, "air-glide"], [T.hour - 0.1, "slide-soft"], [T.so - 0.4, "paper-fold"], [T.so - 0.3, "tint-swell"],
    [T.sent - 0.2, "slide-soft"], [T.okay - 0.37, "tap"], [T.trailhead - 0.1, "pop-soft"], [T.these - 0.1, "pop-soft"], [T.august, "shimmer"], [T.yep - 0.2, "pop-soft"],
    [T.then + 0.2, "part-lift"], [T.start + 0.1, "clunk"], [T.found, "paper-thud"], [T.but, "ratchet"], [T.knew, "torque-click"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 55, mode: "major", style: "warm", cut: T.then - 0.2, ret: T.found - 0.12, room: "shop" };
  return { shots, heads, sfx, music };
}
