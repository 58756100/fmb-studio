// @ts-nocheck
// SC-04 (lane C, garages): "Shift Change". Reggie is off in two minutes; Inez takes over a half-finished WRX intercooler
// job. Last time he just told her and his phone didn't stop all through dinner. This time the job goes on the car's
// build page first: status, a photo, and the odd bumper bolt flagged "check it before you finish". The rag passes.
// His phone doesn't ring once. Next morning her entry sits under his. Two voices (Reggie = Dan, Inez = Emma).
// Device: the red shop rag. It is the transition every time: it is tossed (memory), lands as a napkin (match), sweeps
// the frame clean (rag wipe back to the present), the entry card rises out of its folds and folds back into it, it is
// handed over (whip carry), it becomes a red-check kitchen towel (match), and folds into the morning rag (match).
// Hero: WRX front (A28) + front-mount intercooler (C11); G01 as the in-progress install photo; torque wrench D04;
// phone D01 and mug D10 at home. The bumper bracket with the longer bolt is drawn (no bank photo; requested).
// Transitions: match (rag -> napkin), rag wipe (object wipe), punch-in (bolt), shutter + shrink into the card's photo
// slot, whip carry (the pass), match (rag -> towel), match (towel fold -> morning rag), CTA landing over frame 0's shot.
// remocn (ported): focus-blur-resolve (card fields), simulated-cursor ripple (Save), typewriter (flag line),
// period-drop (CTA). New vs the lab reels: cloth shape morph (crumpled / draped / folded) as the carrier object.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { Cloth, CLOTH, mixPts, land, Wordmark, Who, Thumb, Sweep, Ripple, Tick } from "./b2kit";

export const HOOK_WORDS = 15;
export const TAIL = 1.2;
export const LIFE = 1.4;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 112 };
export const IMAGES = ["A28", "C11", "G01", "D04", "D01", "D10"];
const HOOKS = { A: "Shift change. / 4:58.", B: "Three calls / at dinner.", C: "What Inez / needs." };
const AMBER = "#FF9F0A", GREEN = "#34C759", BLUE = "#1F4FB0";

// car + fender geometry (hook framing); cam shifts the whole bay
const CAR = { cx: 540, cy: 1250, w: 1000 };
const carBox = (c) => { const h = c.w / (1581 / 793); return { x: c.cx - c.w / 2, y: c.cy - h / 2, w: c.w, h }; };
const fender = (c) => { const b = carBox(c); return { x: b.x + 0.47 * b.w, y: b.y + 0.43 * b.h }; };
const RAG = { w: 230, h: 130 };
// card geometry (build phase): rises out of the rag
const CARDR = { x: 60, y: 560, w: 960, h: 860 };
const SLOT = { x: 60 + 40 + 430 + 20, y: 560 + 420, w: 430, h: 270 };

// the bumper support bracket with three bolts, the middle one longer (drawn; full-frame close-up, used as a photo too)
const Bracket = ({ t, ring = 0, glint = 0, push = 0 }) => {
  const bolt = (x, y, long, i) => (
    <g key={i} transform={`translate(${x} ${y})`}>
      {long && <g><rect x={-26} y={-250} width={52} height={250} rx={8} fill="url(#thread)" /><rect x={-26} y={-250} width={52} height={250} rx={8} fill="url(#shaft)" opacity={0.65} /></g>}
      <polygon points="-70,-40 0,-80 70,-40 70,40 0,80 -70,40" fill="url(#hex)" stroke="#5c6066" strokeWidth={3} />
      <polygon points="-48,-27 0,-55 48,-27 48,27 0,55 -48,27" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={4} />
      <circle r={30} fill="url(#washer)" opacity={0.5} />
    </g>);
  return <AbsoluteFill style={{ background: `radial-gradient(120% 80% at ${40 + 8 * Math.sin(t * 0.9)}% 35%, #2D63CF 0%, ${BLUE} 45%, #0E2A66 100%)`, transform: `scale(${1 + 0.14 * push}) rotate(${1.5 * Math.sin(t * 0.8)}deg)` }}>
    {/* bumper paint reflections, sliding */}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: -300, top: ((t * 260 + i * 900) % 2200) - 300, width: 1700, height: 200, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0))", transform: "rotate(-12deg)" }} />)}
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9ced4" /><stop offset=".5" stopColor="#8e959d" /><stop offset="1" stopColor="#5f666e" /></linearGradient>
        <linearGradient id="hex" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9ecef" /><stop offset=".55" stopColor="#9aa1a8" /><stop offset="1" stopColor="#6b7178" /></linearGradient>
        <radialGradient id="washer"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#9aa1a8" stopOpacity="0" /></radialGradient>
        <linearGradient id="shaft" x1="0" x2="1"><stop offset="0" stopColor="#6b7178" /><stop offset=".4" stopColor="#f1f3f5" /><stop offset="1" stopColor="#6b7178" /></linearGradient>
        <pattern id="thread" width="52" height="16" patternUnits="userSpaceOnUse"><rect width="52" height="16" fill="#8e959d" /><path d="M0 4 L52 12" stroke="#4d535a" strokeWidth={4} /></pattern>
      </defs>
      <g transform={`translate(540 1020) rotate(${-4 + 1.2 * Math.sin(t * 0.7)})`}>
        <path d="M -420 -150 L 420 -190 L 450 170 L -440 200 Z" fill="url(#plate)" stroke="#4d535a" strokeWidth={4} />
        <path d="M -400 -120 L 400 -158" stroke="rgba(255,255,255,.4)" strokeWidth={6} />
        <circle cx={-300} cy={60} r={22} fill="#2b2f33" /><circle cx={310} cy={40} r={22} fill="#2b2f33" />
        {bolt(-250, 10, false, 0)}{bolt(0, 0, true, 1)}{bolt(250, -10, false, 2)}
      </g>
      {/* glint on the long bolt */}
      <rect x={512 - 80 + 160 * glint} y={680} width={26} height={300} fill="rgba(255,255,255,.55)" transform="rotate(12 540 900)" opacity={Math.sin(Math.PI * glint)} />
    </svg>
    {ring > 0 && <DrawPath d="M 540 610 C 690 610 720 760 700 880 C 680 1010 600 1110 540 1110 C 420 1110 360 990 370 860 C 380 730 430 610 548 606" p={ring} color={RED} width={10} />}
  </AbsoluteFill>;
};

export function build(tl, hook) {
  const at = tl.at, B_ = tl.body;
  const before = (w) => B_[tl.idx(w) - 1]; // the word before
  const T = {
    inter: at("intercooler's"), piping: at("pipings"), clamps: at("clamps"), last: at("last"), told: at("told"), way: at("way"),
    phone: before("phone").s, stop: at("stop"), dinner: at("dinner."), so: at("so"), build: at("build"), hand: at("hand"),
    bumper: at("bumper"), stripped: at("stripped,"), longer: at("longer"), took: at("took"), photo: at("photo,"), wrote: at("wrote:"),
    check: at("check"), finishE: tl.end("finish."), got: at("got"), too: at("too."), ring: at("ring"), once: tl.end("once."),
    bchk: at("bolt", 3), pdone: at("piping"), leak: at("leak"), update: at("update's"), last2: tl.last,
  };
  T.myph = B_[tl.idx("ring") - 3].s; // "My phone didn't ring once."
  T.send = tl.cta("send") ?? at("send");
  // the pass: the card folds into the rag, the rag is handed over (whip) just before Inez speaks
  T.save = at("you") + 0.05; // Save is tapped as he finishes the sentence
  const PASS = Math.max(T.finishE + 0.02, T.got - 0.4);
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [1] : [2], hold: 4 };
  if (hook === "A") fx(hk, [hw[0].s, hw[1].s, hw[3].s]);
  const heads = [
    hk,
    B("Half done.", T.inter, { key: [1], hold: 1.6 }),
    fx(B("Told her. / Left.", T.told), [T.told, at("her"), T.way]),
    fx(B("Phone, / all dinner.", T.phone), [T.phone + 0.05, at("all"), T.dinner]),
    fx(B("On the / build page.", T.build), [tl.after("the", T.so), T.build, at("page")]),
    { ...fx(B("Didn't ring / once.", T.ring), [B_[tl.idx("ring") - 1].s, T.ring, at("once.")]), key: [2], hold: 1.6 },
    { ...ctaHead(tl, "Send to whoever / takes over", T.send), key: [4] },
  ];
  heads[4].exit = { at: T.hand + 0.1, mode: "down" }; // leaves into the card that rises from the rag
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ------------------------------------------------------------- the bay (frame 0, the build phase, the morning, the CTA)
  const CARD_UP = T.hand - 0.2;               // card rises out of the rag
  const FOLD = PASS - 0.05;                   // card folds back into the rag
  const morning = (t) => t >= T.bchk - 0.5;
  const bay = (t, phase) => {
    // camera: hook framing -> pushed down (card above the car) -> hook framing for the CTA
    const cam = track(t, { y: 0, s: 1 }, phase === "build"
      ? [[T.so - 0.4, { y: 460, s: 1 }, 0.01], [FOLD, { y: 460 }, 0.4]]
      : phase === "morning" ? [[0, { y: 460 }, 0.01], [T.send - 0.35, { y: 0 }, 0.9, EASE.camera]] : []);
    const c = { ...CAR, cy: CAR.cy + cam.y };
    const f = fender(c);
    const grey = phase === "hook" ? ez(t, T.last - 0.25, 0.45) : 0;
    // intercooler (hook only): floats above the car, pipes loose, two clamps hanging open
    const icO = phase === "hook" ? 1 : 0;
    const IC = { cx: 540, cy: 760, w: 780 };
    const icH = IC.w / (1582 / 963);
    const icp = (u, v) => ({ x: IC.cx - IC.w / 2 + u * IC.w, y: IC.cy - icH / 2 + v * icH + 6 * Math.sin(t * 1.3) });
    // status pointer along the job: core -> piping -> clamps
    const P1 = icp(0.47, 0.6), P2 = icp(0.1, 0.28), P3 = icp(0.33, 0.1);
    const pt = track(t, { x: P1.x, y: P1.y, o: 0 }, [[T.inter - 0.15, { o: 1 }, 0.2], [T.piping - 0.2, { x: P2.x, y: P2.y }, 0.45], [T.clamps - 0.2, { x: P3.x, y: P3.y }, 0.45], [T.last - 0.3, { o: 0 }, 0.3]]);
    const chip = (t < T.piping - 0.2 ? ["Core mounted", GREEN, T.inter] : t < T.clamps - 0.2 ? ["Piping loose", AMBER, T.piping] : ["Clamps to torque", AMBER, T.clamps]);
    // rag: crumpled on the fender (hook) -> tossed (memory) / draped (build) / folded (morning) -> lifted (pass)
    let rag = null;
    if (phase === "hook") {
      const toss = ez(t, T.told - 0.05, 0.55, EASE.in);
      rag = { x: f.x - RAG.w / 2 + toss * 700, y: f.y - RAG.h * 0.7 - toss * 900 - Math.sin(Math.PI * toss) * 120, shape: CLOTH.crumpled, rot: -8 + toss * 160, s: 1 - 0.2 * toss, o: 1 };
    } else if (phase === "build") {
      const drop = spr(t - (T.so + 0.15), 170, 14);
      const lift = ez(t, PASS - 0.1, 0.35, EASE.in);
      rag = { x: f.x - RAG.w / 2 + lift * 500, y: f.y - RAG.h * 0.55 - (1 - clamp(drop)) * 260 - lift * 260, shape: mixPts(CLOTH.crumpled, CLOTH.draped, clamp(drop)), rot: -4 + lift * 30, s: 1, o: 1 };
    } else {
      const open = ez(t, T.bchk - 0.35, 0.4) * (1 - ez(t, T.send - 0.45, 0.4));
      rag = { x: f.x - RAG.w / 2, y: f.y - RAG.h * 0.55, shape: mixPts(CLOTH.folded, CLOTH.draped, open), rot: -3, s: 1, o: 1 };
    }
    // the entry card rises out of the rag and folds back into it
    let cardP = 0;
    if (phase === "build") cardP = ez(t, CARD_UP, 0.75, EASE.camera) * (1 - ez(t, FOLD, 0.4, EASE.in));
    if (phase === "morning") cardP = ez(t, T.bchk - 0.3, 0.7, EASE.camera) * (1 - ez(t, T.send - 0.45, 0.45, EASE.in));
    const rg = { x: rag.x, y: rag.y, w: RAG.w, h: RAG.h };
    const warm = phase === "morning" ? 1 : 0;
    return <AbsoluteFill style={{ filter: grey > 0.01 ? `grayscale(${grey}) contrast(${1 - 0.08 * grey}) brightness(${1 + 0.04 * grey})` : undefined }}>
      <Studio t={t}>
        {warm > 0 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,205,140,.42) 0%, rgba(255,232,200,.18) 45%, rgba(255,255,255,0) 75%)" }} />}
        {warm > 0 && <div style={{ position: "absolute", left: -300 + 60 * Math.sin(t * 0.3), top: -200, width: 520, height: 2600, background: "linear-gradient(90deg, rgba(255,226,170,0), rgba(255,226,170,.38), rgba(255,226,170,0))", transform: "rotate(-28deg)" }} />}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${cam.s})`, transformOrigin: "50% 60%" }}>
          <Cut id="A28" cx={c.cx} cy={c.cy} w={c.w} shadow={0.38} />
          {icO > 0 && <>
            <Cut id="C11" cx={IC.cx} cy={IC.cy + 6 * Math.sin(t * 1.3)} w={IC.w} rot={-2 + 1.2 * Math.sin(t * 0.9)} shadow={0.18} />
            {/* the open clamps, swinging */}
            {[icp(0.36, 0.12), icp(0.8, 0.2)].map((q, i) => <div key={i} style={{ position: "absolute", left: q.x - 34, top: q.y + 26, width: 68, height: 68, transformOrigin: "50% 0", transform: `rotate(${14 * Math.sin(t * 2.4 + i * 1.7)}deg)` }}>
              <svg width={68} height={68} viewBox="0 0 68 68"><path d="M 34 6 A 26 26 0 1 1 14 16" fill="none" stroke="#A9AFB6" strokeWidth={7} strokeLinecap="round" /><rect x={8} y={8} width={16} height={12} rx={3} fill="#8E959D" /></svg></div>)}
            {pt.o > 0.01 && <>
              <div style={{ position: "absolute", left: pt.x - 26, top: pt.y - 26, width: 52, height: 52, borderRadius: 26, background: RED, opacity: pt.o, boxShadow: `0 0 0 ${10 + 4 * Math.sin(t * 6)}px ${rgba(RED, 0.22)}`, zIndex: 30 }} />
              <div style={{ position: "absolute", left: clamp(pt.x - 150, 70, 600), top: pt.y + 48, opacity: pt.o * seg(t, chip[2] - 0.15, chip[2] + 0.05), zIndex: 31, padding: "12px 26px", borderRadius: 30, background: "#fff",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,.35)", display: "flex", alignItems: "center", gap: 14, transform: `translateY(${(1 - ez(t, chip[2] - 0.15, 0.3)) * 18}px)` }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: chip[1] }} /><span style={inter(42, INK)}>{chip[0]}</span></div>
            </>}
          </>}
          <Cloth t={t} {...rg} shape={rag.shape} rot={rag.rot} s={rag.s} o={rag.o} kind="rag" seed="rag" z={25} blurX={phase === "build" ? 8 * ez(t, PASS - 0.1, 0.35, EASE.in) : 0} />
        </div>
        {phase === "morning" && t > T.send + 0.5 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", zIndex: 45 }}>
          <Typed t={t} t0={T.send + 0.6} t1={T.send + 1.2} text="fuelmybuild.com" style={inter(46, GREY, 500)} keepCaret={0.4} /></div>}
        {cardP > 0.005 && (phase === "build" ? <BuildCard t={t} T={T} p={cardP} from={rg} /> : <MorningCards t={t} T={T} p={cardP} from={rg} />)}
        {phase === "build" && t >= T.photo && t < T.photo + 0.75 && <PhotoShrink t={t} t0={T.photo} />}
      </Studio>
    </AbsoluteFill>;
  };

  // ------------------------------------------------------------- the memory dinner (grey): napkin, plate, phone buzzing
  const dinner = (t) => {
    const land_ = spr(t - (T.phone - 0.12), 160, 15);
    const buzz = (k) => { const b0 = [T.phone + 0.25, T.stop, T.dinner - 0.1][k]; return t > b0 && t < b0 + 0.6 ? Math.sin((t - b0) * 95) * 7 * (1 - (t - b0) / 0.6) : 0; };
    const bz = buzz(0) + buzz(1) + buzz(2);
    const d = drift(t, "din", 4, 0.3);
    return <AbsoluteFill style={{ filter: "grayscale(1) contrast(.92) brightness(1.03)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 80% at 50% 40%, #E9E1D6 0%, #CDBFAE 100%)" }} />
      <div style={{ position: "absolute", top: -300, width: 500, height: 2600, left: ((t * 240) % 2000) - 700, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", transform: "rotate(20deg)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.08 * seg(t, T.phone - 0.2, T.so)})` }}>
        {/* plate + fork */}
        <div style={{ position: "absolute", left: 200, top: 820, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #fff 0 52%, #F2F0EC 53% 64%, #E2DED8 65% 100%)", boxShadow: "0 30px 50px -20px rgba(0,0,0,.35)" }} />
        <div style={{ position: "absolute", left: 800 + bz * 0.2, top: 820, width: 34, height: 520, borderRadius: 17, background: "linear-gradient(90deg, #9aa1a8, #eef0f2, #9aa1a8)", transform: `rotate(${4 + bz * 0.3}deg)` }} />
        {/* the phone, face up, screen dark, buzzing (no screen shown) */}
        <div style={{ position: "absolute", left: 650, top: 1350, width: 240, height: 0, transform: `translate(${bz}px, 0) rotate(${-14 + bz * 0.25}deg)` }}>
          <Cut id="D01" cx={120} cy={0} w={200} shadow={0.3} />
          {Math.abs(bz) > 0.5 && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 240 : -50, top: -120, width: 30, height: 240, borderRadius: 20, border: "6px solid rgba(29,29,31,.5)", borderLeftColor: "transparent", borderTopColor: "transparent", borderBottomColor: "transparent", transform: `scaleX(${i ? 1 : -1})`, opacity: 0.8 }} />)}
        </div>
        {/* the napkin: the rag that was tossed, landing on the table */}
        <Cloth t={t} x={110 + (1 - clamp(land_)) * 420} y={560 - (1 - clamp(land_)) * 700} w={330} h={200} shape={mixPts(CLOTH.crumpled, CLOTH.draped, clamp(land_))} kind="napkin" rot={-12 + (1 - clamp(land_)) * 90} seed="napkin" z={6} />
      </div>
    </AbsoluteFill>;
  };

  // ------------------------------------------------------------- Inez: the rag on her wrist, the clamp torqued
  const inez = (t) => {
    const IC = { cx: 540, cy: 980, w: 1000 }, icH = IC.w / (1582 / 963);
    const clampP = { x: IC.cx - IC.w / 2 + 0.79 * IC.w, y: IC.cy - icH / 2 + 0.2 * icH };
    const wr = ez(t, T.got + 0.2, 0.6, EASE.camera), click = T.too - 0.15;
    const sw = 18 * ez(t, click - 0.5, 0.5, EASE.io) - 6 * spr(t - click, 300, 12) * (t > click ? 1 : 0);
    const d = drift(t, "inz", 3, 0.3);
    const tight = ez(t, click - 0.1, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="C11" cx={IC.cx} cy={IC.cy} w={IC.w} rot={-2} shadow={0.2} />
        <div style={{ position: "absolute", left: clampP.x - 40, top: clampP.y - 8, width: 80, height: 80 }}>
          <svg width={80} height={80} viewBox="0 0 68 68"><path d={`M 34 6 A 26 26 0 1 1 ${lerp(14, 33, tight)} ${lerp(16, 6, tight)}`} fill="none" stroke="#A9AFB6" strokeWidth={7} strokeLinecap="round" /></svg>
        </div>
        {/* her rag, draped over the left pipe (handed over in the whip) */}
        <Cloth t={t} x={140} y={720} w={RAG.w} h={RAG.h} shape={mixPts(CLOTH.crumpled, CLOTH.draped, ez(t, PASS, 0.5))} kind="rag" seed="rag2" rot={8} z={25} />
        {/* torque wrench swinging onto the clamp */}
        <div style={{ position: "absolute", left: lerp(1250, clampP.x, wr), top: lerp(1500, clampP.y + 20, wr), width: 0, height: 0, transform: `rotate(${lerp(110, 72, wr) + sw}deg)`, zIndex: 26 }}>
          <Cut id="D04" cx={252} cy={137} w={600} shadow={0} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 1440, padding: "16px 30px 16px 16px", borderRadius: 60, ...CARD, ...land(t, T.got + 0.1) }}>
          <Who ch="I" name="Inez" role="evening shift" bg="#5E5CE6" />
        </div>
      </div>
    </Studio></AbsoluteFill>;
  };

  // ------------------------------------------------------------- home: drying a plate with a red-check towel, phone silent
  const kitchen = (t) => {
    const fold = ez(t, T.bchk - 0.9, 0.5, EASE.camera);
    const a = t * 2.2, R = 150;
    const tw = { x: 540 + Math.cos(a) * R * (1 - fold) - 200, y: 980 + Math.sin(a) * R * 0.6 * (1 - fold) - 130 };
    const d = drift(t, "kit", 4, 0.3);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #F7EBDD 0%, #EFDCC6 55%, #E2C9AE 100%)" }} />
      <div style={{ position: "absolute", left: -400 + 40 * Math.sin(t * 0.4), top: -300, width: 700, height: 2800, background: "linear-gradient(90deg, rgba(255,214,150,0), rgba(255,214,150,.35), rgba(255,214,150,0))", transform: "rotate(-24deg)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: 230, top: 700, width: 620, height: 620, borderRadius: "50%", transform: `rotate(${-t * 40}deg)`,
          background: "radial-gradient(circle at 50% 50%, #fff 0 54%, #F4F1EC 55% 66%, #E6E1D9 67% 100%)", boxShadow: "0 40px 60px -26px rgba(80,50,20,.45)" }}>
          <div style={{ position: "absolute", left: 300, top: 10, width: 20, height: 40, borderRadius: 8, background: "#3B6FD8", opacity: 0.8 }} />
        </div>
        <Cloth t={t} x={tw.x} y={tw.y} w={400 - 80 * fold} h={260 - 110 * fold} shape={mixPts(CLOTH.draped, CLOTH.folded, fold)} kind="towel" seed="towel" rot={-10 + 10 * fold} z={10} />
        <div style={{ position: "absolute", left: 700, top: 1390, width: 0, height: 0, transform: "rotate(-8deg)" }}><Cut id="D01" cx={110} cy={0} w={190} shadow={0.3} /></div>
        <Cut id="D10" cx={230} cy={1460} w={250} shadow={0.3} />
        {[0, 1, 2].map((i) => { const q = ((t * 0.45 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 200 + 20 * i + 18 * Math.sin(t * 2 + i), top: 1320 - q * 220, width: 16, height: 60, borderRadius: 8, background: "rgba(255,255,255,.7)", filter: "blur(6px)", opacity: Math.sin(Math.PI * q) }} />; })}
      </div>
    </AbsoluteFill>;
  };

  const RAGWIPE = (t, p) => {
    const x = lerp(1350, -900, EASE.io(p));
    return <div style={{ position: "absolute", left: x, top: 380, width: 900, height: 1300, zIndex: 50, filter: "url(#mbx4)" }}>
      <Cloth t={t} x={0} y={0} w={900} h={1300} shape={CLOTH.draped} kind="rag" seed="wipe" rot={-6} folds={4} />
    </div>;
  };
  const shots = [
    { at: 0, render: (t) => bay(t, "hook") },
    { at: T.phone - 0.12, render: dinner, enter: { kind: "match" } },
    { at: T.so - 0.08, render: (t) => bay(t, "build"), enter: { kind: "wipe", d: 0.7, dir: -1, edge: (p) => lerp(1350, -900, EASE.io(p)) + 120, obj: RAGWIPE } },
    { at: T.bumper - 0.08, render: (t) => <Bracket t={t} ring={ez(t, T.longer - 0.1, 0.6, EASE.io)} glint={(t * 0.6) % 1} push={seg(t, T.bumper, T.photo)} />, enter: { kind: "punch" } },
    { at: T.photo - 0.02, render: (t) => bay(t, "build"), enter: { kind: "match" } },
    { at: PASS + 0.12, render: inez, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.myph - 0.1, render: kitchen, enter: { kind: "match" } },
    { at: T.bchk - 0.45, render: (t) => bay(t, "morning"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "cloth", 0.7], [T.inter - 0.15, "pop-soft"], [T.piping - 0.2, "slide-soft"], [T.clamps - 0.2, "slide-soft"],
    [T.last - 0.25, "tint-drain"], [T.told - 0.05, "cloth-toss"], [T.phone - 0.05, "cloth-land"], [T.phone + 0.25, "buzz"], [T.stop, "buzz"], [T.dinner - 0.1, "buzz"],
    [T.so - 0.45, "tint-swell"], [T.so + 0.2, "cloth-land"], [CARD_UP, "card-rise"], [CARD_UP + 0.6, "card-settle"],
    [T.longer - 0.1, "draw"], [T.photo - 0.02, "shutter"], [T.photo + 0.55, "photo-settle"], [T.wrote, "typing:1.1"], [T.save, "tap"], [T.save + 0.08, "check"],
    [FOLD, "card-fold"], [PASS - 0.05, "cloth-toss"], [T.got + 0.1, "pop-soft"], [T.got + 0.25, "ratchet"], [T.too - 0.15, "torque-click"],
    [T.myph - 0.1, "cloth"], [T.myph + 0.4, "plate-rub", 0.6], [T.once + 0.2, "ceramic", 0.5],
    [T.bchk - 0.9, "card-fold"], [T.bchk - 0.45, "cloth-land"], [T.bchk - 0.3, "paper-unfold"], [T.bchk, "check"], [T.pdone, "check"], [T.leak + 0.3, "check"], [T.update, "card-settle"],
    [T.send - 0.45, "card-fold"], [ctaT, "cta-pop"],
  ].filter(([tt]) => tt > 0);
  // music: warm, quick; it stops for the quiet dinner and comes back with the morning
  const music = { bpm: 104, root: 50, mode: "major", style: "warm", cut: T.myph - 0.3, ret: T.bchk - 0.45, room: "home" };
  return { shots, heads, sfx, music };

  // ----- inner components that need T
  function BuildCard({ t, T, p, from }) {
    const x = lerp(from.x, CARDR.x, p), y = lerp(from.y, CARDR.y, p), w = lerp(from.w, CARDR.w, p), h = lerp(from.h, CARDR.h, p);
    const c = clamp((p - 0.5) / 0.5);
    const saved = t >= T.save + 0.02;
    const rows = [["Core mounted", GREEN, CARD_UP + 0.5], ["Piping loose", AMBER, CARD_UP + 0.65], ["Clamps to torque", AMBER, CARD_UP + 0.8]];
    return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 40, borderRadius: lerp(30, 44, p), overflow: "hidden", ...CARD,
      background: c > 0.4 ? "#fff" : "#C8262B", boxShadow: saved ? `0 0 0 ${6 * (1 - seg(t, T.save + 0.1, T.save + 0.8))}px ${rgba(GREEN, 0.5)}, ${CARD.boxShadow}` : CARD.boxShadow }}>
      <div style={{ position: "absolute", inset: 0, background: "#C8262B", opacity: 1 - c }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: CARDR.w, height: CARDR.h, transformOrigin: "0 0", transform: `scale(${w / CARDR.w}, ${h / CARDR.h})`, opacity: c }}>
        <Sweep t={t} o={0.25} />
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 18, ...land(t, CARD_UP + 0.25) }}><Wordmark size={42} /><span style={inter(40, GREY, 500)}>· WRX build log</span></div>
        <div style={{ position: "absolute", left: 40, top: 104, display: "flex", alignItems: "center", gap: 20, ...land(t, CARD_UP + 0.35) }}>
          <span style={inter(62, INK, 650)}>Intercooler install</span>
          <span style={{ padding: "8px 20px", borderRadius: 24, background: saved ? rgba(GREEN, 0.14) : rgba(AMBER, 0.16), ...inter(40, saved ? "#1E8E3E" : "#B86E00", 600) }}>{saved ? "Saved" : "In progress"}</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 196, ...land(t, CARD_UP + 0.42) }}><Who ch="R" name="Reggie" role="day shift" bg="#FF9F0A" size={56} /></div>
        {rows.map(([txt, col, tt], i) => <div key={i} style={{ position: "absolute", left: 44, top: 280 + i * 62, display: "flex", alignItems: "center", gap: 18, ...land(t, tt) }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: col }} /><span style={inter(44, "#3A3A3C", 500)}>{txt}</span></div>)}
        <div style={{ position: "absolute", left: 40, top: 480, display: "flex", gap: 20 }}>
          <div style={land(t, CARD_UP + 0.9)}><Thumb id="G01" w={430} h={270} t={t} fx={0.8} fy={0.45} k={1.15} /></div>
          <div style={{ width: 430, height: 270, borderRadius: 24, border: t < T.photo + 0.7 ? "4px dashed #C7C7CC" : "none", overflow: "hidden", position: "relative", ...land(t, CARD_UP + 1.0) }}>
            {t >= T.photo + 0.7 && <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${-(W * 0.4 - 430) / 2 - 0}px, ${-(H * 0.4 * 0.53 - 135)}px) scale(0.4)` }}><Bracket t={t} ring={1} /></div>}
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 780, display: "flex", alignItems: "center", gap: 16, opacity: t >= T.wrote - 0.1 ? 1 : 0 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: RED }} />
          <Typed t={t} t0={T.wrote} t1={T.save - 0.12} text="Longer bumper bolt: check before finishing" style={inter(40, RED, 600)} keepCaret={0} />
        </div>
      </div>
      {saved && c > 0.5 && <div style={{ position: "absolute", right: 34, top: 30, zIndex: 3 }}><Tick p={seg(t, T.save + 0.05, T.save + 0.5)} size={64} /></div>}
      <Ripple t={t} t0={T.save - 0.05} x={w - 70} y={62} />
    </div>;
  }
  function PhotoShrink({ t, t0 }) {
    // the bracket close-up shrinks into the card's empty photo slot (the shutter is the cut)
    const e = EASE.camera(seg(t, t0, t0 + 0.7));
    const r = { x: lerp(0, SLOT.x, e), y: lerp(0, SLOT.y, e), w: lerp(W, SLOT.w, e), h: lerp(H, SLOT.h, e) };
    const s = Math.max(r.w / W, r.h / (H * 0.53));
    const flash = 1 - seg(t, t0, t0 + 0.18);
    return <>
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", borderRadius: lerp(0, 24, e), zIndex: 60, boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: (r.w - W * s) / 2, top: (r.h - H * 0.53 * s) / 2 - H * 0.235 * s * e, width: W, height: H, transformOrigin: "0 0", transform: `scale(${s})` }}><Bracket t={t} ring={1} /></div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, zIndex: 70 }} />
    </>;
  }
  function MorningCards({ t, T, p, from }) {
    const x = lerp(from.x, 60, p), y = lerp(from.y, 560, p), w = lerp(from.w, 960, p), h = lerp(from.h, 820, p);
    const c = clamp((p - 0.5) / 0.5);
    const rows = [["Bolt checked", T.bchk], ["Piping and clamps torqued", T.pdone], ["Leak test passed", T.leak + 0.25]];
    const under = ez(t, T.update - 0.1, 0.5, EASE.camera);
    return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 40, overflow: "visible" }}>
      <div style={{ position: "absolute", inset: 0, background: "#C8262B", borderRadius: 30, opacity: 1 - c }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 820, transformOrigin: "0 0", transform: `scale(${w / 960}, ${h / 820})`, opacity: c }}>
        {/* his entry, compact, on top */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 200, ...CARD, overflow: "hidden" }}>
          <Sweep t={t} o={0.25} />
          <div style={{ position: "absolute", left: 36, top: 32 }}><Who ch="R" name="Reggie" role="· Intercooler install" bg="#FF9F0A" size={56} /></div>
          <div style={{ position: "absolute", left: 40, top: 112, display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 20, height: 20, borderRadius: 10, background: RED }} /><span style={inter(40, "#3A3A3C", 500)}>Longer bumper bolt: check</span></div>
        </div>
        {/* her entry, under his */}
        <div style={{ position: "absolute", left: 0, top: lerp(260, 236, under), width: 960, height: 520, ...CARD, overflow: "hidden", boxShadow: `0 0 0 ${4 * under}px ${rgba("#5E5CE6", 0.35)}, ${CARD.boxShadow}` }}>
          <Sweep t={t + 1.3} o={0.25} />
          <div style={{ position: "absolute", left: 36, top: 32, ...land(t, T.bchk - 0.2) }}><Who ch="I" name="Inez" role="· evening shift" bg="#5E5CE6" size={56} /></div>
          <div style={{ position: "absolute", left: 40, top: 118, ...inter(56, INK, 650), ...land(t, T.bchk - 0.1) }}>Intercooler install: done</div>
          {rows.map(([txt, tt], i) => <div key={i} style={{ position: "absolute", left: 40, top: 220 + i * 92, display: "flex", alignItems: "center", gap: 20, ...land(t, tt - 0.05) }}>
            <Tick p={seg(t, tt, tt + 0.45)} size={52} /><span style={inter(46, "#1C1C1E", 550)}>{txt}</span></div>)}
        </div>
      </div>
    </div>;
  }
}
