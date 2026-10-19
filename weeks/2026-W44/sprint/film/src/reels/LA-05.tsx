// @ts-nocheck
// LA-05 (lane A, garages): "The Same Puddle, Two Different Questions" (ChatGPT concept and look, Claude execution). Paper
// Birch Garage replaced this coupe's roof seal; now the carpet's wet again and everyone wonders whether the part or the
// labor failed. Okay, but what exactly happened last time? The build entry has dated photos, the seal's brand and credit
// for the shop and technician. Those photos show what was replaced, not why water's getting in today, so the record helps
// the shop plan another inspection, including the drains. Same facts; responsibility isn't settled. LINK CTA.
// Look (ChatGPT): rain blue, graphite, small amber highlights; plain sans headlines (Inter); hand-drawn amber circles
// around physical evidence; a technician's annotated contact sheet.
// Device: the puddle is a lens. Its surface reflects the roofline; the camera pushes in and the reflection opens into the
// car in the rain; the "Part?" / "Labor?" tabs swing outside the record; the drains get circled on a paper note.
// Car: A02 white coupe side (unbadged). Drawn: footwell, puddle, rain, tabs, contact-sheet photos, roof plan, hands.
// Fictional: Paper Birch Garage, Theo (technician), Lowmark Seals.
// Transitions: drop ripple pushes into the puddle (portal), reflection flips into the car (match), tabs swing aside onto
// the record (wipe-like), seal path leads around the roof plan (match), hands carry the tabs to the note (match), CTA.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.6;
export const LIFE = 1.75;
const RAIN = "#3E6E95", RAINL = "#A9C6DD", GRAPH = "#2B2F35", GRAPHL = "#4A5058", AMBER = "#F2A33A", PALE = "#EEF3F7", MUTE = "#6B7682";
export const BG = PALE;
export const TEXT = { font: "Inter", weight: 750, size: 104, min: 70, ls: "-0.035em", opsz: 32, color: GRAPH, accent: RAIN, line2: null, align: "left", x0: 80, maxW: 920, top: 266, lead: 1.0 };
export const IMAGES = ["A02"];
const HOOKS = { A: "Comeback / job.", B: "The guessing / game.", C: "Start with / what happened." };
const SANS = (size, color = GRAPH, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
const SHEET = { background: "#fff", boxShadow: "0 16px 28px -14px rgba(43,47,53,.45)", borderRadius: 6 };

// a hand-drawn circle (two loose passes)
const Ring = ({ x, y, rx, ry, p = 1, color = AMBER, w = 7 }) => (
  <svg width={rx * 2 + 60} height={ry * 2 + 60} viewBox={`${-rx - 30} ${-ry - 30} ${rx * 2 + 60} ${ry * 2 + 60}`} style={{ position: "absolute", left: x - rx - 30, top: y - ry - 30, overflow: "visible", pointerEvents: "none" }}>
    <path d={`M ${-rx * 0.9} ${-ry * 0.2} C ${-rx} ${-ry * 1.1} ${rx * 1.05} ${-ry * 1.05} ${rx} ${0} C ${rx * 0.95} ${ry * 1.1} ${-rx * 1.1} ${ry} ${-rx * 0.95} ${-ry * 0.1} C ${-rx * 0.85} ${-ry * 0.6} ${-rx * 0.3} ${-ry * 1.0} ${rx * 0.2} ${-ry * 1.08}`}
      fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </svg>
);
// the footwell, top-down: carpet, mat edge, the puddle with a reflected roofline. drop: ripple time
const Footwell = ({ t, w = 1000, h = 900, drop = 0.4, reflect = 1 }) => {
  const rp = (k) => { const dt = t - drop - k * 1.6; return dt < 0 ? null : (dt % 3.2); };
  return <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: GRAPH, backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1px, transparent 2px)", backgroundSize: "6px 6px" }}>
    <div style={{ position: "absolute", left: -20, top: h * 0.06, width: w * 0.42, height: h * 0.9, borderRadius: 30, background: GRAPHL, transform: "rotate(-6deg)", boxShadow: "inset 0 0 0 10px rgba(0,0,0,.2)" }} />
    <svg width={w} height={h} viewBox="0 0 1000 900" style={{ position: "absolute", inset: 0 }}>
      <defs><radialGradient id="pd" cx=".45" cy=".45"><stop offset="0" stopColor="#6E95B5" /><stop offset=".7" stopColor="#355B7A" /><stop offset="1" stopColor="#24384A" /></radialGradient>
        <clipPath id="pdc"><path d="M 420 420 C 430 300 640 260 780 330 C 920 400 900 560 780 620 C 640 690 520 660 460 600 C 400 540 410 480 420 420 Z" /></clipPath></defs>
      <path d="M 420 420 C 430 300 640 260 780 330 C 920 400 900 560 780 620 C 640 690 520 660 460 600 C 400 540 410 480 420 420 Z" fill="url(#pd)" opacity={0.92} />
      <g clipPath="url(#pdc)" opacity={0.55 * reflect}>
        <path d={`M 440 ${520 + 3 * Math.sin(t * 2)} C 520 430 600 410 700 430 C 760 444 820 480 880 520`} stroke="#DDE8F1" strokeWidth={10} fill="none" />
        <path d={`M 470 ${560 + 3 * Math.sin(t * 2)} L 860 560`} stroke="#DDE8F1" strokeWidth={5} fill="none" opacity={0.6} />
      </g>
      {[0, 1, 2].map((k) => { const dt = rp(k); return dt == null ? null : <ellipse key={k} cx={640} cy={470} rx={20 + dt * 90} ry={12 + dt * 50} fill="none" stroke="#DDE8F1" strokeWidth={4} opacity={Math.max(0, 0.8 - dt * 0.3)} clipPath="url(#pdc)" />; })}
      <ellipse cx={560} cy={380} rx={60} ry={14} fill="rgba(255,255,255,.35)" transform="rotate(-12 560 380)" />
    </svg>
  </div>;
};
// rain overlay: thin falling lines
const Rain = ({ t, o = 1, n = 46 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: o }}>
    {Array.from({ length: n }, (_, i) => { const x = (i * 197) % 1100, sp = 900 + (i % 7) * 80, y = ((t * sp + i * 311) % 2100) - 100; return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 70} stroke={RAINL} strokeWidth={3} opacity={0.5} />; })}
  </svg>
);
// a hanging paper tab on a string
const Tab = ({ x, y, text, swing = 0, o = 1, t = 0 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transformOrigin: "50% -120px", transform: `rotate(${swing + Math.sin(t * 1.6 + x) * 3}deg)`, opacity: o, zIndex: 30 }}>
    <div style={{ position: "absolute", left: "50%", top: -120, width: 3, height: 120, background: MUTE }} />
    <div style={{ padding: "16px 28px", ...SHEET, background: "#FFF8EA", borderTop: `8px solid ${AMBER}` }}><span style={SANS(56, GRAPH, 750)}>{text}</span></div>
  </div>
);
// a contact-sheet photo of the seal job (drawn): removed / label / installed
const SealShot = ({ kind, w, h, t }) => (
  <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: kind === "label" ? "#D9D4C8" : "linear-gradient(170deg, #5E646C, #2C3036)" }}>
    {kind === "label" ? <div style={{ position: "absolute", left: "12%", top: "22%", width: "76%", height: "56%", background: "#fff", borderRadius: 6, boxShadow: "0 6px 12px rgba(0,0,0,.25)", padding: "8% 8%" }}>
      <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: w * 0.12, color: RAIN }}>LOWMARK</div><div style={{ height: w * 0.03, width: "70%", background: "#C9CED3", marginTop: w * 0.04, borderRadius: 4 }} /><div style={{ height: w * 0.03, width: "50%", background: "#C9CED3", marginTop: w * 0.03, borderRadius: 4 }} /></div>
      : <svg width={w} height={h} viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <path d="M -10 150 Q 150 90 310 150 L 310 230 L -10 230 Z" fill="#C9CED3" />
        <path d="M -10 140 Q 150 80 310 140" stroke={kind === "removed" ? "#7A6F62" : "#111214"} strokeWidth={14} fill="none" strokeDasharray={kind === "removed" ? "26 14" : "none"} />
        {kind === "removed" && <path d="M 200 40 Q 240 70 230 120 Q 222 150 250 190" stroke="#4A4038" strokeWidth={12} fill="none" />}
      </svg>}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,230,190,.15), rgba(0,0,0,.08))" }} />
  </div>
);
// a flat hand reaching in from a side (anonymous)
const Hand = ({ x, y, flip = false, tone = "#D9A27E" }) => (
  <svg width={420} height={220} viewBox="0 0 420 220" style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, zIndex: 40 }}>
    <rect x={200} y={40} width={260} height={140} rx={60} fill={tone} />
    {[[40, 48, 200], [10, 84, 230], [30, 120, 210], [70, 154, 170]].map(([fx, fy, fw], i) => <rect key={i} x={fx} y={fy} width={fw} height={34} rx={17} fill={tone} />)}
    <rect x={120} y={10} width={130} height={38} rx={19} fill={tone} transform="rotate(16 250 30)" />
    <rect x={400} y={30} width={60} height={160} rx={10} fill={flip ? "#3E6E95" : "#4A5058"} />
  </svg>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    paper: at("paper"), replaced: at("replaced"), seal: at("seal."), now: at("now"), wet: at("wet"), everyones: at("everyone's"), part: at("part"), labor: at("labor"),
    failed: at("failed."), okay: at("okay,"), exactly: at("exactly"), entry: at("entry"), dated: at("dated"), brand: at("brand,"), credit: at("credit"), technician: at("technician."),
    those: at("those"), replaced2: at("replaced.", 2), dont: at("don't"), today: at("today."), so: at("so"), inspection: at("inspection,"), drains: at("drains."),
    we: at("we"), visible: at("visible,"), facts: at("facts."), settle: at("settle"), guessing: at("guessing."), cta: tl.cta("your") ?? at("your"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [0] : hook === "B" ? [2] : [2, 3], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Same / symptom.", T.now), [T.now, T.wet]), key: [1], hold: 0.6 },
    { ...fx(B("Reopen the / original work.", T.okay), [T.okay, T.exactly - 0.1, T.exactly, at("happened")]), key: [2, 3], hold: 0.5 },
    { ...fx(B("Record first. / Inspect next.", T.those), [T.those, at("photos", 2), T.so, T.inspection]), key: [2, 3], hold: 0.5 },
    { ...fx(B("The same / facts.", T.everyones2 ?? at("everyone")), [at("everyone"), at("same"), T.facts]), key: [1, 2], hold: 0.6 },
    { ...ctaHead(tl, "Keep the work / visible.", T.cta), key: [3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Pale = ({ t, children, rain = 0 }) => (
    <AbsoluteFill style={{ background: PALE }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 360, left: ((t * 70) % 1700) - 420, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.5), rgba(255,255,255,0))" }} />
      {children}
      {rain > 0 && <Rain t={t} o={rain} />}
    </AbsoluteFill>
  );
  // ---------------------------------------------------------------- 1. the footwell puddle (hook); push into the reflection
  const puddle = (t) => {
    const d = drift(t, "pu", 3, 0.3);
    const push = EASE.in(seg(t, T.paper - 0.7, T.paper));
    const dropY = lerp(-200, 470, seg(t, 0, 0.4));
    return <Pale t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 2.6 * push})`, transformOrigin: "680px 1080px" }}>
      <div style={{ position: "absolute", left: 40, top: 600, width: 1000, height: 900, borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 50px -26px rgba(0,0,0,.5)" }}>
        <Footwell t={t} drop={0.4} />
        {t < 0.42 && <div style={{ position: "absolute", left: 632, top: dropY, width: 16, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#DDE8F1" }} />}
      </div>
    </div></Pale>;
  };
  // ---------------------------------------------------------------- 2. the car in the rain; Part? / Labor? tabs
  const car = (t) => {
    const d = drift(t, "ca", 3, 0.3);
    const flipIn = EASE.camera(seg(t, T.paper - 0.1, T.paper + 0.7));
    const tabP = spr(t - (T.part - 0.2), 120, 10), tabL = spr(t - (T.labor - 0.2), 120, 10);
    const aside = EASE.io(seg(t, T.okay - 0.2, T.exactly + 0.2));
    const drip = ez(t, T.wet - 0.1, 0.5);
    return <Pale t={t} rain={0.8}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 620, background: "linear-gradient(180deg, #9DB3C6, #7E98AE)", opacity: 0.6 }} />
      <div style={{ transform: `scaleY(${lerp(-1, 1, flipIn)})`, transformOrigin: "540px 1150px", opacity: 0.3 + 0.7 * flipIn }}><Cut id="A02" cx={540} cy={1150} w={1000} shadow={0.35} /></div>
      {/* the reflection on the wet ground */}
      <div style={{ transform: "scaleY(-1)", transformOrigin: "540px 1330px", opacity: 0.18 * flipIn }}><Cut id="A02" cx={540} cy={1150} w={1000} shadow={0} /></div>
      <div style={{ position: "absolute", left: 80, top: 1430, padding: "12px 22px", borderRadius: 30, background: GRAPH, ...land(t, T.paper + 0.2) }}><span style={SANS(44, "#fff", 650)}>Paper Birch Garage</span><span style={SANS(42, RAINL, 500)}>  · roof seal</span></div>
      <Ring x={590} y={1110} rx={90} ry={60} p={drip} />
      <Tab x={lerp(200, -400, aside)} y={720} text="Part?" swing={lerp(-14, 0, clamp(tabP)) - 30 * aside} o={clamp(tabP * 2)} t={t} />
      <Tab x={lerp(640, 1200, aside)} y={740} text="Labor?" swing={lerp(14, 0, clamp(tabL)) + 30 * aside} o={clamp(tabL * 2)} t={t} />
    </div></Pale>;
  };
  // ---------------------------------------------------------------- 3. the original entry as a contact sheet: removed / label / installed; credits; circles; "don't prove"
  const sheet = (t) => {
    const d = drift(t, "sh", 3, 0.3);
    const rec = ez(t, T.okay + 0.1, 0.7, EASE.camera);
    const sh = (k, tt) => spr(t - tt, 180, 16);
    const ring = ez(t, T.replaced2 - 0.3, 0.6, EASE.io);
    const notProve = ez(t, T.dont, 0.5, EASE.io);
    const plan = EASE.camera(seg(t, T.so - 0.2, T.inspection));
    const drains = ez(t, T.drains - 0.2, 0.6, EASE.io);
    const shots3 = [["removed", "Old seal out", T.entry - 0.3], ["label", "Lowmark seal", T.entry + 0.1], ["installed", "New seal in", T.dated - 0.1]];
    return <Pale t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: lerp(980, 640, plan), ...SHEET, borderRadius: 26, opacity: rec, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 36, top: 26, display: "flex", gap: 12, alignItems: "baseline" }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: GRAPH }}>Fuel<span style={{ color: RAIN }}>My</span>Build</span><span style={SANS(42, MUTE, 500)}>· customer's coupe</span></div>
        <div style={{ position: "absolute", left: 36, top: 96, ...SANS(50, GRAPH, 750) }}>Roof seal replaced</div>
        <div style={{ position: "absolute", left: 36, top: 160, ...SANS(44, RAIN, 650) }}>Mar 11, 2026</div>
        {shots3.map(([k, cap, tt], i) => { const p = sh(k, tt); return <div key={i} style={{ position: "absolute", left: 36 + i * 300, top: 240, width: 280, opacity: clamp(p * 2), transform: `translateY(${(1 - clamp(p)) * 40}px)` }}>
          <div style={{ padding: 8, paddingBottom: 10, background: "#F4F6F8", borderRadius: 6 }}><SealShot kind={k} w={264} h={200} t={t} /></div>
          <div style={{ ...SANS(42, GRAPH, 650), marginTop: 6 }}>{cap}</div></div>; })}
        <div style={{ position: "absolute", left: 36, top: 540, padding: "12px 20px", borderRadius: 26, background: rgba(RAIN, 0.1), display: "flex", gap: 12, alignItems: "center", ...land(t, T.credit) }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: RAIN, display: "grid", placeItems: "center", ...SANS(42, "#fff", 700) }}>T</div><span style={SANS(44, GRAPH, 650)}>Theo · Paper Birch Garage</span></div>
      </div>
      <Ring x={735} y={950} rx={150} ry={130} p={ring} />
      {notProve > 0.01 && <div style={{ position: "absolute", left: 80, top: 1270, transform: `rotate(-2deg)`, opacity: notProve * (1 - plan), padding: "14px 24px", ...SHEET, background: "#FFF8EA" }}><span style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 700, color: GRAPH }}>Replaced ≠ why it leaks</span></div>}
      {/* the off-app inspection note: roof plan with drains circled */}
      {plan > 0.01 && <div style={{ position: "absolute", left: 140, top: lerp(1700, 1270, plan), width: 800, height: 320, ...SHEET, background: "#FFF8EA", padding: "18px 26px", transform: "rotate(-1.5deg)" }}>
        <div style={{ fontFamily: "Caveat", fontSize: 60, fontWeight: 700, color: GRAPH }}>Re-inspect: seating + drains</div>
        <svg width={740} height={210} viewBox="0 0 740 210" style={{ position: "absolute", left: 30, top: 96 }}>
          <rect x={200} y={20} width={340} height={170} rx={60} fill="none" stroke={GRAPH} strokeWidth={4} /><rect x={250} y={50} width={240} height={110} rx={30} fill="none" stroke={GRAPH} strokeWidth={3} strokeDasharray="10 8" />
          {[[230, 40], [510, 40], [230, 170], [510, 170]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={9} fill={RAIN} />)}</svg>
        {[[256, 152], [536, 152], [256, 282], [536, 282]].map(([x, y], i) => <Ring key={i} x={x} y={y} rx={34} ry={30} p={clamp(drains * 4 - i)} w={5} />)}
      </div>}
    </div></Pale>;
  };
  // ---------------------------------------------------------------- 4. same facts: two hands, one composition; tabs onto the note (and CTA)
  const facts = (t, end) => {
    const d = drift(t, "fa" + (end ? "e" : ""), 3, 0.3);
    const hands = end ? 1 : EASE.camera(seg(t, T.we - 0.2, T.visible + 0.3));
    const tabs = end ? 1 : EASE.io(seg(t, T.settle - 0.3, T.guessing));
    const away = end ? 1 : ez(t, T.guessing, 0.6, EASE.io);
    const url = end ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    return <Pale t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {/* the footwell photo, the original entry, the inspection note */}
      <div style={{ position: "absolute", left: 70, top: 620, width: 440, padding: 10, ...SHEET, transform: "rotate(-3deg)" }}><Footwell t={t} w={420} h={340} drop={0.4} /></div>
      <div style={{ position: "absolute", left: 540, top: 600, width: 460, padding: "18px 22px", ...SHEET, borderRadius: 22, transform: "rotate(2deg)" }}>
        <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: GRAPH }}>Fuel<span style={{ color: RAIN }}>My</span>Build</div>
        <div style={{ ...SANS(46, GRAPH, 750), marginTop: 6 }}>Roof seal replaced</div><div style={SANS(42, RAIN, 650)}>Mar 11, 2026</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>{["removed", "label", "installed"].map((k) => <SealShot key={k} kind={k} w={130} h={100} t={t} />)}</div>
        <div style={{ ...SANS(42, MUTE, 600), marginTop: 8 }}>Theo · Paper Birch</div></div>
      <div style={{ position: "absolute", left: 160, top: 1070, width: 760, padding: "16px 24px", ...SHEET, background: "#FFF8EA", transform: "rotate(-1deg)" }}>
        <div style={{ fontFamily: "Caveat", fontSize: 58, fontWeight: 700, color: GRAPH }}>Next: inspect seating + drains</div>
        <div style={{ display: "flex", gap: 18, marginTop: 8, height: 90 }}>
          {[["Part?", 0], ["Labor?", 1]].map(([x, i]) => <div key={i} style={{ padding: "10px 22px", ...SHEET, background: "#fff", borderTop: `6px solid ${AMBER}`, opacity: tabs, transform: `translateY(${(1 - tabs) * -260}px) rotate(${i ? 3 : -3}deg)` }}><span style={SANS(46, GRAPH, 750)}>{x}</span></div>)}
        </div></div>
      <Hand x={lerp(-480, -160, hands) - 300 * away} y={1400} />
      <Hand x={lerp(1140, 820, hands) + 300 * away} y={1420} flip />
      {end && url > 0.01 && <div style={{ position: "absolute", left: 250, top: 1440, padding: "14px 26px", borderRadius: 34, background: GRAPH, display: "flex", gap: 14, alignItems: "baseline", opacity: clamp(url * 2), transform: `translateY(${(1 - clamp(url)) * 30}px)` }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: "#fff" }}>Fuel<span style={{ color: AMBER }}>My</span>Build</span><span style={SANS(44, RAINL, 600)}>fuelmybuild.com</span></div>}
    </div></Pale>;
  };

  const shots = [
    { at: 0, render: puddle },
    { at: T.paper - 0.05, render: car, enter: { kind: "match" } },
    { at: T.okay + 0.2, render: sheet, enter: { kind: "rise", d: 0.5 } },
    { at: T.we - 0.12, render: (t) => facts(t, false), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.cta - 0.1, render: (t) => facts(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.38, "bottle-tap", 0.6], [1.9, "tick-soft"], [T.paper - 0.5, "portal"], [T.wet - 0.1, "draw"], [T.part - 0.2, "tap"], [T.labor - 0.2, "tap"], [T.okay - 0.1, "whoosh"],
    [T.entry - 0.3, "shutter"], [T.entry + 0.1, "shutter"], [T.dated - 0.1, "shutter"], [T.credit, "pop-soft"], [T.replaced2 - 0.3, "pencil-line"], [T.dont, "pencil-write"],
    [T.so - 0.2, "paper-unfold"], [T.drains - 0.2, "pencil-line"], [T.we - 0.2, "whip"], [T.settle - 0.3, "paper-flutter"], [T.guessing, "card-settle"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 88, root: 50, mode: "minor", style: "observe", cut: T.okay + 0.1, ret: T.those - 0.1 };
  return { shots, heads, sfx, music };
}
