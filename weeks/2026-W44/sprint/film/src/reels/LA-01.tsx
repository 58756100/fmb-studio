// @ts-nocheck
// LA-01 (lane A, collectors): "Bolted In Isn't Finished" (ChatGPT concept and look, Claude execution). Eli bought an
// unfinished coupe with the cooling "supposedly done": one less job to budget for. The photo looked convincing, a radiator
// exactly where a radiator should sit, but had anyone tested it? Rebuilding the timeline on a build page, the dated photos
// show the radiator going in and no record of a test afterward. That's useful: list the part and brand, credit the
// installer, keep the unknown honest, so the next conversation starts with evidence. LINK CTA.
// Look (ChatGPT): charcoal, faded orange, warm paper; condensed headlines (Barlow Condensed), simple sans labels; an
// exploded model-kit world built from car photographs and paper tabs (workshop assembly manual).
// Device: a model-kit sprue frame. The radiator is snapped out and fitted; the hoses are still on the sprue. The crop of
// the "convincing" photo opens to show the loose hose ends; a hose becomes the timeline line, which stops at a paper tab.
// Car: K1-18 orange collector coupe (no maker named; unbadged cutout), radiator C12. Drawn: sprue, hoses, clamps, tabs,
// note, budget slip, page. Fictional: Eli, Copper Finch Cooling, Mara at Dock Lantern Garage.
// Transitions: badge flips into the handover note (flip), the photo expands to fill the frame (portal), the crop opens
// (camera pull inside one shot), hose curve becomes the timeline (match), last photo folds into the page card (match),
// CTA over the car and its page with the unresolved hose.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, src, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.6;
export const LIFE = 1.75;
const PAPER = "#F1E6D2", CHAR = "#2A2A2D", ORANGE = "#D9733A", ORL = "#E9A777", SPRUE = "#8F9399", MUTE = "#6E6A62";
export const BG = PAPER;
export const TEXT = { font: "Barlow Condensed", weight: 700, size: 124, min: 84, ls: "0.005em", opsz: 32, upper: true, color: CHAR, accent: ORANGE, line2: null, align: "left", x0: 80, maxW: 920, top: 262, lead: 0.96 };
export const IMAGES = ["K1-18", "C12"];
const HOOKS = { A: "Project car. / Big claims.", B: "What counts / as done?", C: "Look / closer." };
const SANS = (size, color = CHAR, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
const CARDP = { background: "#FBF6EC", boxShadow: "0 16px 28px -14px rgba(42,42,45,.5)", borderRadius: 10 };

// hoses: two black curves with open ends (connected 0..1 would close them, never happens here)
const Hoses = ({ x, y, s = 1, sway = 0 }) => (
  <svg width={600 * s} height={420 * s} viewBox="0 0 600 420" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <path d={`M 40 60 C 160 ${40 + sway * 20} 220 ${200 + sway * 10} 330 ${230 + sway * 14}`} stroke="#1D1D1F" strokeWidth={34} fill="none" strokeLinecap="butt" />
    <ellipse cx={334} cy={232 + sway * 14} rx={10} ry={17} fill="#444" />
    <path d={`M 60 360 C 200 ${330 - sway * 16} 300 ${300 - sway * 10} 470 ${330 - sway * 12}`} stroke="#1D1D1F" strokeWidth={30} fill="none" />
    <ellipse cx={472} cy={330 - sway * 12} rx={9} ry={15} fill="#444" />
    {[[90, 64], [110, 352]].map(([cx, cy], i) => <rect key={i} x={cx - 8} y={cy - 24} width={16} height={48} rx={4} fill="#B8BCC1" />)}
  </svg>
);
// a numbered paper tab
const Tab = ({ x, y, n, text, o = 1, rot = 0, accent = false }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12, padding: "10px 18px 10px 10px", ...CARDP, opacity: o, transform: `rotate(${rot}deg)`, zIndex: 30 }}>
    <div style={{ width: 54, height: 54, borderRadius: 27, background: accent ? ORANGE : CHAR, display: "grid", placeItems: "center", ...SANS(42, "#fff", 800) }}>{n}</div>
    <span style={SANS(44, CHAR, 650)}>{text}</span></div>
);
// the sprue frame with cells
const Sprue = ({ x, y, w = 960, h = 520, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `14px solid ${SPRUE}`, borderRadius: 18, opacity: o, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.25), 0 14px 24px -14px rgba(0,0,0,.4)" }}>
    <div style={{ position: "absolute", left: w * 0.5 - 7, top: 0, bottom: 0, width: 14, background: SPRUE }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.5 - 7, height: 14, background: SPRUE }} />
  </div>
);
// the engine-bay photo (drawn bay, real radiator cutout). open: crop widens to show the loose hoses
const BayPhoto = ({ t, w, h, open = 0 }) => (
  <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "radial-gradient(120% 90% at 50% 40%, #4A4744, #1E1D1C)" }}>
    <div style={{ position: "absolute", left: w / 2, top: h / 2, width: 0, height: 0, transform: `scale(${lerp(1.9, 1, open) * (w / 900)})` }}>
      <div style={{ position: "absolute", left: -470, top: -330, width: 940, height: 660, borderRadius: 30, background: "linear-gradient(180deg, #3B3936, #2A2826)", boxShadow: "inset 0 0 50px rgba(0,0,0,.6)" }} />
      <Cut id="C12" cx={0} cy={-40} w={520} shadow={0} />
      <Hoses x={-430} y={-120} s={1} sway={Math.sin(t * 1.3)} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(255,200,140,.18), rgba(0,0,0,.1))" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    eli: at("eli"), coupe: at("coupe"), cooling: at("cooling"), done: at("done,"), figured: at("figured"), budget: at("budget"), and: at("and"), photo: at("photo"),
    convincing: at("convincing."), radiator: at("radiator,"), sit: at("sit."), but: at("but"), tested: at("tested"), when: at("when"), timeline: at("timeline"),
    dated: at("dated"), going: at("going"), no: at("no"), record: at("record"), test: at("test"), afterward: at("afterward."), thats: at("that's"), list: at("list"),
    brand: at("brand,"), installer: at("installer,"), unknown: at("unknown"), evidence: at("evidence."), cta: tl.cta("your") ?? at("your"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2, 3] : hook === "B" ? [3] : [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Cooling / done?", T.cooling), [T.cooling, T.done]), key: [1], hold: 0.6 },
    { ...fx(B("Fitted isn't / tested.", T.but), [T.but, at("anyone"), T.tested]), key: [2], hold: 0.6 },
    { ...fx(B("The record / stops here.", T.no), [T.no, T.record, T.test, T.afterward]), key: [2, 3], hold: 0.6 },
    { ...fx(B("A clear / starting point.", tl.after("so", T.unknown)), [tl.after("so", T.unknown), at("next"), at("starts"), T.evidence]), key: [2, 3], hold: 0.5 },
    { ...ctaHead(tl, "Build your / record.", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Paper = ({ t, children }) => (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(rgba(120,100,70,.12) 1px, transparent 2px)", backgroundSize: "9px 9px" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 380, left: ((t * 70) % 1700) - 420, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,250,240,.4), rgba(255,255,255,0))" }} />
      {children}
    </AbsoluteFill>
  );
  // ---------------------------------------------------------------- 1. the coupe arrives with its badge; the badge flips into the handover note; radiator photo drops
  const arrive = (t) => {
    const d = drift(t, "ar", 3, 0.3);
    const inC = EASE.camera(seg(t, 0, 1.3));
    const flip = EASE.io(seg(t, T.eli - 0.4, T.eli + 0.3));
    const ph = spr(t - (T.done - 0.1), 160, 15);
    const slip = spr(t - (T.figured), 180, 16), strike = ez(t, T.budget, 0.5, EASE.io);
    const grow = EASE.in(seg(t, T.and - 0.35, T.and + 0.05));
    const bob = Math.sin(t * 2.2) * 3;
    return <Paper t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Cut id="K1-18" cx={lerp(1500, 540, inC)} cy={1180} w={1000} shadow={0.35} />
      {/* the badge / handover note on a string */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><path d={`M ${lerp(1500, 540, inC) + 120} 1080 Q ${lerp(1500, 540, inC) + 40} 900 ${lerp(1580, 620, inC)} ${770 + bob}`} stroke={MUTE} strokeWidth={3} fill="none" /></svg>
      <div style={{ position: "absolute", left: lerp(1400, 440, inC), top: 600 + bob, width: 420, height: 230, transform: `rotate(${-5 + 3 * flip}deg) scaleX(${Math.max(0.02, Math.abs(Math.cos(flip * Math.PI)))})` }}>
        {flip < 0.5 && <div style={{ position: "absolute", inset: 0, ...CARDP, background: ORANGE, display: "grid", placeItems: "center" }}><span style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 92, color: "#fff", textTransform: "uppercase" }}>Cooling done</span></div>}
        {flip >= 0.5 && <div style={{ position: "absolute", inset: 0, ...CARDP, padding: "22px 26px" }}>
          <div style={SANS(42, MUTE, 600)}>Handover note</div>
          <div style={{ fontFamily: "Caveat", fontSize: 70, fontWeight: 700, color: CHAR, lineHeight: 1 }}>Cooling's done.</div>
          <div style={{ fontFamily: "Caveat", fontSize: 54, fontWeight: 600, color: MUTE }}>No worries there.</div></div>}
      </div>
      {/* Eli's budget slip */}
      {slip > 0.01 && <div style={{ position: "absolute", left: 90, top: 1400, width: 420, padding: "18px 22px", ...CARDP, opacity: clamp(slip * 2), transform: `rotate(-3deg) translateY(${(1 - clamp(slip)) * 40}px)` }}>
        <div style={SANS(42, MUTE, 600)}>Eli's budget</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, position: "relative" }}><span style={SANS(46, CHAR, 650)}>Cooling</span><span style={SANS(46, ORANGE, 700)}>$0</span>
          <div style={{ position: "absolute", left: -6, top: 28, height: 5, width: 380 * strike, background: CHAR }} /></div></div>}
      {/* the radiator photo drops beneath the note, then grows to fill the frame */}
      {ph > 0.01 && <div style={{ position: "absolute", left: lerp(560, 60, grow), top: lerp(1360, 560, grow), width: lerp(400, 960, grow), height: lerp(300, 1000, grow), padding: lerp(12, 0, grow), background: "#fff", boxShadow: "0 18px 30px -12px rgba(0,0,0,.45)", transform: `rotate(${lerp(4, 0, grow) * clamp(ph)}deg) translateY(${(1 - clamp(ph)) * -120}px)`, opacity: clamp(ph * 2), zIndex: 40 }}>
        <BayPhoto t={t} w={lerp(376, 960, grow)} h={lerp(276, 1000, grow)} open={0} /></div>}
    </div></Paper>;
  };
  // ---------------------------------------------------------------- 2. the convincing photo; the crop opens to show the loose hoses
  const photo = (t) => {
    const d = drift(t, "ph", 3, 0.3);
    const open = EASE.camera(seg(t, T.sit - 0.2, T.tested));
    const ring = ez(t, T.radiator, 0.6, EASE.io) * (1 - open);
    const tab = spr(t - (T.tested + 0.1), 190, 15);
    return <Paper t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, overflow: "hidden", boxShadow: "0 24px 40px -20px rgba(0,0,0,.5)" }}>
        <BayPhoto t={t} w={960} h={1000} open={open} />
        <svg width={960} height={1000} style={{ position: "absolute", inset: 0 }}><rect x={140} y={220} width={680} height={440} rx={20} fill="none" stroke={ORL} strokeWidth={6} strokeDasharray="2300" strokeDashoffset={2300 * (1 - ring)} /></svg>
      </div>
      <Tab x={120} y={1440} n="?" text="Hoses: not connected" o={clamp(tab * 2)} rot={-2} accent />
    </div></Paper>;
  };
  // ---------------------------------------------------------------- 3. the timeline: a hose becomes the line; dated photos; the line stops at a paper tab
  const timeline = (t) => {
    const d = drift(t, "tl", 3, 0.3);
    const line = EASE.camera(seg(t, T.when - 0.1, T.dated + 0.3));
    const p1 = spr(t - (T.dated - 0.05), 180, 16), p2 = spr(t - (T.going - 0.1), 180, 16);
    const stop = spr(t - (T.no - 0.05), 200, 14);
    const pageP = EASE.camera(seg(t, T.thats - 0.3, T.list));
    return <Paper t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d="M -40 1180 C 200 1180 260 1000 520 1000 L 760 1000" stroke="#1D1D1F" strokeWidth={22} fill="none" strokeDasharray="1200" strokeDashoffset={1200 * (1 - line)} />
        <circle cx={770} cy={1000} r={18} fill={ORANGE} opacity={clamp(stop * 2)} />
      </svg>
      <div style={{ position: "absolute", left: 80, top: 560, display: "flex", gap: 14, alignItems: "center", opacity: line }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: CHAR }}>Fuel<span style={{ color: ORANGE }}>My</span>Build</span><span style={SANS(42, MUTE, 500)}>· Eli's coupe</span></div>
      {[[p1, 140, "Mar 3, 2024", "Radiator in"], [p2, 470, "Mar 3, 2024", "Mounted"]].map(([p, x, dte, cap], i) => p > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: 660, width: 300, padding: 10, paddingBottom: 14, background: "#fff", boxShadow: "0 14px 24px -12px rgba(0,0,0,.45)", transform: `rotate(${i ? 3 : -3}deg) translateY(${(1 - clamp(p)) * 60}px)`, opacity: clamp(p * 2) }}>
        <BayPhoto t={t} w={280} h={200} open={i ? 0.4 : 0} /><div style={{ ...SANS(42, CHAR, 700), marginTop: 8 }}>{cap}</div><div style={SANS(42, ORANGE, 650)}>{dte}</div></div>)}
      <Tab x={600} y={1100} n="!" text="Test unrecorded" o={clamp(stop * 2)} rot={2} accent />
    </div></Paper>;
  };
  // ---------------------------------------------------------------- 4. the kit: part + brand, installer credit, the unknown kept honest; settles into the page beside the car (and CTA)
  const kit = (t, end) => {
    const d = drift(t, "ki" + (end ? "e" : ""), 3, 0.3);
    const a1 = end ? 1 : spr(t - (T.brand - 0.3), 180, 16), a2 = end ? 1 : spr(t - (T.installer - 0.3), 180, 16), a3 = end ? 1 : spr(t - (T.unknown - 0.2), 180, 16);
    const note = end ? 1 : spr(t - (T.evidence - 0.4), 170, 15);
    const settle = end ? 1 : EASE.camera(seg(t, T.evidence + 0.2, T.cta - 0.2));
    const url = end ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const rows = [[a1, "Radiator", "Copper Finch Cooling"], [a2, "Installed by", "Mara · Dock Lantern Garage"], [a3, "Cooling test", "Unknown"]];
    return <Paper t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1100px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - settle, transform: `translateY(${settle * 200}px)` }}>
        <Sprue x={40} y={940} w={1000} h={600} />
        <Cut id="C12" cx={290} cy={1090} w={330} shadow={0} />
        <Hoses x={570} y={990} s={0.62} sway={Math.sin(t * 1.3)} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 110, top: 1340, width: 70, height: 70, borderRadius: 35, border: "12px solid #B8BCC1" }} />)}
        <div style={{ position: "absolute", left: 600, top: 1320, width: 380, height: 160, border: `5px dashed ${ORANGE}`, borderRadius: 12, display: "grid", placeItems: "center", opacity: clamp(a3 * 2) }}><span style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 64, color: ORANGE }}>TEST ?</span></div>
        <Tab x={70} y={960} n="1" text="Fitted" o={clamp(a1 * 2)} rot={-2} />
        <Tab x={600} y={960} n="2" text="Loose" o={clamp(a2 * 2)} rot={2} accent />
      </div>
      <Cut id="K1-18" cx={540} cy={lerp(1700, 1310, settle)} w={980} shadow={0.35} o={settle} />
      <div style={{ position: "absolute", left: 80, top: 560, width: 920, padding: "26px 30px", ...CARDP, background: "#FFFDF8" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: CHAR }}>Fuel<span style={{ color: ORANGE }}>My</span>Build</span><span style={SANS(42, MUTE, 500)}>· Eli's coupe</span></div>
        {rows.map(([p, k, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "2px solid rgba(42,42,45,.12)", opacity: clamp(p * 2), transform: `translateX(${(1 - clamp(p)) * 60}px)` }}>
          <span style={SANS(44, MUTE, 600)}>{k}</span><span style={SANS(44, i === 2 ? ORANGE : CHAR, 700)}>{v}</span></div>)}
      </div>
      {note > 0.01 && <div style={{ position: "absolute", left: 600, top: 1000, padding: "16px 24px", background: "#FFF3B8", boxShadow: "0 12px 20px -10px rgba(0,0,0,.45)", transform: `rotate(${5 - 2 * clamp(note)}deg) scale(${0.85 + 0.15 * clamp(note)})`, opacity: clamp(note * 2) * (1 - 0.0 * settle), zIndex: 30 }}>
        <span style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 700, color: CHAR }}>Verify before use</span></div>}
      {/* the unresolved hose beside the documented radiator */}
      <div style={{ position: "absolute", left: 40, top: 1300, opacity: settle }}><Hoses x={0} y={0} s={0.5} sway={Math.sin(t * 1.3)} /></div>
      {end && url > 0.01 && <div style={{ position: "absolute", left: 300, top: 1500, padding: "14px 26px", borderRadius: 34, background: CHAR, display: "flex", gap: 16, alignItems: "center", opacity: clamp(url * 2), transform: `translateY(${(1 - clamp(url)) * 30}px)` }}>
        <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: PAPER }}>Fuel<span style={{ color: ORL }}>My</span>Build</span><span style={SANS(44, ORL, 600)}>fuelmybuild.com</span></div>}
    </div></Paper>;
  };

  const shots = [
    { at: 0, render: arrive },
    { at: T.and + 0.05, render: photo, enter: { kind: "match" } },
    { at: T.when - 0.12, render: timeline, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.thats - 0.12, render: (t) => kit(t, false), enter: { kind: "rise", d: 0.5 } },
    { at: T.cta - 0.12, render: (t) => kit(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "whoosh"], [1.2, "paper-thud"], [T.eli - 0.4, "paper-flutter"], [T.done - 0.1, "photo-settle"], [T.figured, "pencil-write"], [T.budget, "pencil-line"],
    [T.and - 0.35, "portal"], [T.radiator, "draw"], [T.but - 0.1, "air-slow-push"], [T.tested + 0.1, "pop-soft"], [T.when - 0.2, "whip"], [T.dated - 0.05, "shutter"],
    [T.going - 0.1, "shutter"], [T.no - 0.05, "paper-thud"], [T.brand - 0.3, "tick-soft"], [T.installer - 0.3, "tick-soft"], [T.unknown - 0.2, "tick-soft"],
    [T.evidence - 0.4, "paper-unfold"], [T.evidence + 0.2, "card-settle"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 94, root: 50, mode: "minor", style: "observe", cut: T.when - 0.3, ret: T.thats - 0.1 };
  return { shots, heads, sfx, music };
}
