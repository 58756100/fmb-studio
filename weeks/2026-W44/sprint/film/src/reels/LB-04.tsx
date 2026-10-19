// @ts-nocheck
// LB-04 (lane B, garages): "Right box. Wrong pump." (ChatGPT concept and script, Claude build). That pump won't sit down:
// Mara ordered it for this customer's wagon, but the flange is different and the car stays up. The supplier asks if she
// requested this one. She didn't, but that won't clear the lift. She needs the photo sent with the order and the one she
// took when it arrived; they're on the customer's build because she logged the delay while the wagon waited. She sends
// the public link; the supplier agrees to send the correct pump, but the day's gone. Next morning the right flange sits
// flat. LINK CTA ("Keep it at fuelmybuild.com"). Hook A only.
// Device (reserved): the flange profile. A dashed ghost of the old pump's flange sits on the block face; the received
// pump catches on it (one ear in the wrong place); the two photos lock to the same flange feature; next morning the right
// pump drops into the ghost and the outline disappears.
// Car: A11 dark-green sedan on the lift (stands in for the script's green wagon; unbadged). Drawn: pumps, flange ghost, block
// face, lift, request printout, photos, supplier note. Fictional: Mara, Ash Row Garage, Dovren Cooling.
// Transitions: failed fit tracks down (match), rise to the wagon on the lift (rise), flange edge wipes to the request
// (whip), arrival photo flips over the request photo (flip), photos become the entry's photo area (match), bay lights dim
// for the lost day (in shot), next-morning seat (match), CTA.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep, Tick } from "./b2kit";

export const HOOK_WORDS = 5;
export const TAIL = 1.5;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A11"];
const HOOKS = { A: "Won't / fit.", B: "Right / box…", C: "The wagon / stays." };
const GREEN = { filter: "hue-rotate(-95deg) saturate(.7) brightness(.9)" };
// flange ears (angle deg) for the old (correct) pump and the received one
const EARS_OK = [30, 150, 270], EARS_BAD = [30, 150, 230];

// a water pump seen face-on: flange plate with three ears, impeller boss, pulley hub
const Pump = ({ x, y, r = 200, ears = EARS_OK, rot = 0, ghost = false, o = 1, hi = -1 }) => o <= 0.01 ? null : (
  <svg width={r * 2.6} height={r * 2.6} viewBox="-130 -130 260 260" style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, overflow: "visible", opacity: o, transform: `rotate(${rot}deg)` }}>
    <defs><radialGradient id="pm"><stop offset="0" stopColor="#D9DDE1" /><stop offset=".7" stopColor="#9CA3AA" /><stop offset="1" stopColor="#6E757C" /></radialGradient></defs>
    {(() => { const pts = []; ears.forEach((a) => { const r1 = (a - 22) * Math.PI / 180, r2 = (a + 22) * Math.PI / 180, ra = a * Math.PI / 180; pts.push(`L ${Math.cos(r1) * 70} ${Math.sin(r1) * 70} L ${Math.cos(ra - 0.18) * 112} ${Math.sin(ra - 0.18) * 112} Q ${Math.cos(ra) * 126} ${Math.sin(ra) * 126} ${Math.cos(ra + 0.18) * 112} ${Math.sin(ra + 0.18) * 112} L ${Math.cos(r2) * 70} ${Math.sin(r2) * 70}`); });
      const d = `M 70 0 ${pts.join(" ")} Z`;
      return ghost ? <path d={`M ${Math.cos((ears[0] - 22) * Math.PI / 180) * 70} ${Math.sin((ears[0] - 22) * Math.PI / 180) * 70} ${pts.join(" ").replace(/^L/, "L")}`} fill="none" stroke={rgba("#FFFFFF", 0.85)} strokeWidth={4} strokeDasharray="10 8" />
        : <path d={d} fill="url(#pm)" stroke="#555B61" strokeWidth={2} />; })()}
    {!ghost && <circle r={70} fill="url(#pm)" stroke="#555B61" strokeWidth={2} />}
    {ears.map((a, i) => <g key={i}><circle cx={Math.cos(a * Math.PI / 180) * 108} cy={Math.sin(a * Math.PI / 180) * 108} r={9} fill={ghost ? "none" : "#3A3F45"} stroke={ghost ? "#fff" : "none"} strokeWidth={3} />
      {hi === i && <circle cx={Math.cos(a * Math.PI / 180) * 108} cy={Math.sin(a * Math.PI / 180) * 108} r={30} fill="none" stroke={RED} strokeWidth={6} />}</g>)}
    {!ghost && <><circle r={44} fill="#C9CED3" stroke="#6E757C" strokeWidth={2} />{[0, 1, 2, 3].map((i) => <circle key={i} cx={Math.cos(i * Math.PI / 2 + 0.4) * 26} cy={Math.sin(i * Math.PI / 2 + 0.4) * 26} r={5} fill="#555B61" />)}<circle r={10} fill="#8E959C" /></>}
  </svg>
);
// the block face where the pump mounts (graphite casting with the ghost outline)
const BlockFace = ({ children, t }) => (
  <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: 900, borderRadius: 30, background: "radial-gradient(120% 90% at 40% 35%, #4E5258, #26282C)", overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(rgba(255,255,255,.25) 1px, transparent 2px)", backgroundSize: "5px 5px" }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 200, left: ((t * 110) % 1400) - 300, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.07), rgba(255,255,255,0))" }} />
    {children}
  </div>
);
const PumpPhoto = ({ w, h, ears, hi = -1, label }) => (
  <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "linear-gradient(160deg, #6A6F76, #33363B)" }}>
    <Pump x={w / 2} y={h / 2} r={Math.min(w, h) * 0.32} ears={ears} hi={hi} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,225,180,.2), rgba(0,0,0,.1))" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    mara: at("mara"), wagon: at("wagon,"), but: at("but"), flange: at("flange's"), stays: at("stays"), supplier: at("supplier"), requested: at("requested"), she: at("she"),
    lift: at("lift."), needs: at("needs"), photo: at("photo"), and: at("and"), arrived: at("arrived."), theyre: at("they're"), logged: at("logged"), waited: at("waited."),
    first: at("first"), next: at("next"), sends: at("sends"), link: at("link."), agrees: at("agrees"), but2: at("but", 3), gone: at("gone."), least: at("least"),
    morning: at("morning,"), sits: at("sits"), flat: at("flat."), cta: tl.cta("keep") ?? at("keep"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook] ?? HOOKS.A, 0), key: [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Different / flange.", T.flange), [T.flange, at("different.")]), key: [1], hold: 0.4 },
    { ...fx(B("What was / requested?", T.supplier), [T.supplier, T.supplier + 0.2, T.requested]), key: [2], hold: 0.4 },
    { ...fx(B("Sent. / Arrived.", T.needs), [at("sent"), T.arrived]), key: [1], hold: 0.4 },
    { ...fx(B("Why it / waited.", T.logged), [T.logged, at("delay"), T.waited]), key: [2], hold: 0.5 },
    { ...fx(B("The day's / gone.", T.but2), [T.but2, at("day's"), T.gone]), key: [2], hold: 0.5 },
    { ...fx(B("Sits / flat.", T.sits), [T.sits, T.flat]), key: [1], hold: 0.4 },
    { ...ctaHead(tl, "Keep the / record.", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. block face: the received pump catches on the ghost flange (hook); next morning the right one seats (end)
  const face = (t, phase) => {
    const d = drift(t, "fa" + phase, 3, 0.3);
    const good = phase !== "hook";
    const t0 = good ? T.morning - 0.2 : 0.4;
    const drop = EASE.out(seg(t, t0, t0 + 1.4));
    const catchY = good ? 0 : 26 * clamp((t - (t0 + 1.2)) * 4) * Math.exp(-Math.max(0, t - t0 - 1.3) * 3);
    const seated = good ? ez(t, T.flat - 0.2, 0.4) : 0;
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const url = phase === "end" ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1050px" }}>
      <BlockFace t={t}>
        <Pump x={480} y={450} r={210} ears={EARS_OK} ghost o={1 - seated} />
        <Pump x={480 + (good ? 0 : 0)} y={lerp(-300, 450, drop) - catchY} r={210} ears={good ? EARS_OK : EARS_BAD} rot={good ? 0 : 6 * drop} hi={good ? -1 : (t > t0 + 1.3 ? 2 : -1)} />
      </BlockFace>
      {good && seated > 0.01 && <div style={{ position: "absolute", left: 700, top: 1360, ...land(t, T.flat) }}><Tick p={seated} size={90} /></div>}
      {phase === "end" && url > 0.01 && <div style={{ position: "absolute", left: 300, top: 1480, padding: "14px 26px", borderRadius: 34, ...CARD, display: "flex", gap: 14, alignItems: "center", opacity: clamp(url * 2) }}><Wordmark size={44} /><span style={inter(44, GREY, 500)}>fuelmybuild.com</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the wagon on the lift; the two profiles compared side-on
  const lift = (t) => {
    const d = drift(t, "li", 3, 0.3);
    const up = EASE.camera(seg(t, T.mara - 0.2, T.wagon + 0.4));
    const cmp = EASE.io(seg(t, T.but - 0.1, T.flange + 0.3)) * (1 - EASE.io(seg(t, T.stays - 0.2, T.stays + 0.4)));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1450, height: 500, background: "linear-gradient(180deg, #DADDE1, #C9CDD2)" }} />
      {[110, 900].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 640, width: 70, height: 820, background: "linear-gradient(90deg, #C8352F, #9E2A25)", borderRadius: 8 }} />)}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - up) * 300}px)` }}>
        <Cut id="A11" cx={540} cy={860} w={1000} shadow={0} />
        {[[180, 1010], [830, 1010]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 10, top: y, width: 90, height: 24, background: "#4A4F55", borderRadius: 4 }} />)}
      </div>
      {cmp > 0.01 && <div style={{ position: "absolute", left: 90, top: 1060, width: 900, height: 400, borderRadius: 30, ...CARD, opacity: cmp, overflow: "hidden" }}>
        <Pump x={300} y={200} r={130} ears={EARS_OK} hi={2} /><Pump x={620} y={200} r={130} ears={EARS_BAD} hi={2} /></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the request printout; the request photo; the arrival photo flips over it
  const request = (t) => {
    const d = drift(t, "rq", 3, 0.3);
    const pr = spr(t - (T.supplier - 0.2), 170, 16);
    const lifted = EASE.camera(seg(t, T.needs - 0.2, T.photo + 0.3));
    const flip = EASE.io(seg(t, T.and - 0.1, T.arrived));
    const sx = Math.abs(Math.cos(flip * Math.PI));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 100, top: 620, width: 880, height: 820, padding: "28px 34px", background: "#FFFEF8", boxShadow: "0 18px 30px -14px rgba(0,0,0,.35)", transform: `rotate(${-2 + 2 * clamp(pr)}deg) translateY(${(1 - clamp(pr)) * 400}px)`, opacity: clamp(pr * 2) * (1 - 0.5 * lifted) }}>
        <div style={inter(42, GREY, 600)}>Ash Row Garage · parts order</div>
        <div style={{ ...inter(52, INK, 700), marginTop: 8 }}>Water pump · Dovren Cooling</div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 14, borderRadius: 7, width: ["80%", "60%", "70%"][i], background: "#D4D6DA", marginTop: 18 }} />)}
      </div>
      <div style={{ position: "absolute", left: lerp(160, 210, lifted), top: lerp(980, 760, lifted), width: lerp(360, 660, lifted), padding: 12, paddingBottom: 14, background: "#fff", boxShadow: "0 20px 34px -14px rgba(0,0,0,.45)", transform: `rotate(${lerp(-2, 1, lifted)}deg) scaleX(${Math.max(0.02, sx)})`, opacity: clamp(pr * 2) }}>
        <PumpPhoto w={lerp(336, 636, lifted)} h={lerp(240, 460, lifted)} ears={flip < 0.5 ? EARS_OK : EARS_BAD} hi={lifted > 0.9 ? 2 : -1} /></div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. the entry: request photo, swipe to the arrival photo; link; supplier note; the day goes
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    const rec = ez(t, T.theyre - 0.2, 0.7, EASE.camera);
    const swipe = EASE.io(seg(t, T.next - 0.1, T.next + 0.5));
    const pill = spr(t - (T.link - 0.3), 190, 16);
    const note = spr(t - (T.agrees - 0.2), 170, 16);
    const dusk = ez(t, T.but2 - 0.2, 1.4, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 580, width: 960, height: 980, ...CARD, opacity: rec, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center" }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· customer's car</span></div>
        <div style={{ position: "absolute", left: 40, top: 110, width: 880, height: 440, borderRadius: 26, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: -880 * swipe, top: 0, display: "flex" }}><PumpPhoto w={880} h={440} ears={EARS_OK} hi={2} /><PumpPhoto w={880} h={440} ears={EARS_BAD} hi={2} /></div>
          <div style={{ position: "absolute", left: 20, top: 20, padding: "6px 16px", borderRadius: 16, background: "rgba(0,0,0,.5)", ...inter(42, "#fff", 600) }}>{swipe < 0.5 ? "Requested" : "Received"}</div>
          <Sweep t={t} w={880} o={0.2} /></div>
        <div style={{ position: "absolute", left: 40, top: 590, ...land(t, T.logged) }}><div style={inter(52, INK, 700)}>Water-pump delivery mismatch</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Oct 5, 2026</span><span style={inter(42, GREY, 500)}>Mara · Ash Row Garage</span></div></div>
        {pill > 0.01 && <div style={{ position: "absolute", left: 40, top: 790, padding: "12px 24px", borderRadius: 30, background: "#EAF2FE", opacity: clamp(pill * 2) }}><span style={inter(42, "#0A64D8", 600)}>Link sent</span></div>}
      </div>
      {note > 0.01 && <div style={{ position: "absolute", left: 470, top: 1290, width: 520, padding: "18px 24px", background: "#FFFDF4", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", transform: `rotate(${3 - 2 * clamp(note)}deg) translateY(${(1 - clamp(note)) * 80}px)`, opacity: clamp(note * 2), zIndex: 5 }}>
        <div style={{ fontFamily: "Caveat", fontSize: 58, fontWeight: 700, color: INK, lineHeight: 1.05 }}>Correct pump ships today.</div><div style={{ fontFamily: "Caveat", fontSize: 48, fontWeight: 600, color: GREY }}>Dovren Cooling</div></div>}
      <div style={{ position: "absolute", inset: -100, background: "linear-gradient(180deg, rgba(40,46,70,.0), rgba(40,46,70,.55))", opacity: dusk * 0.8, pointerEvents: "none" }} />
      {dusk > 0.01 && <div style={{ position: "absolute", left: 90, top: 1500, padding: "12px 22px", borderRadius: 30, ...CARD, opacity: dusk }}><span style={inter(44, INK, 650)}>6:40 pm · still on the lift</span></div>}
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => face(t, "hook") },
    { at: T.mara - 0.12, render: lift, enter: { kind: "rise", d: 0.5 } },
    { at: T.supplier - 0.12, render: request, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.theyre - 0.15, render: entry, enter: { kind: "match" } },
    { at: T.morning - 0.25, render: (t) => face(t, "good"), enter: { kind: "rise", d: 0.5 } },
    { at: T.cta - 0.1, render: (t) => face(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.4, "air-slow-push", 0.6], [1.6, "clunk"], [T.mara - 0.2, "ratchet"], [T.flange, "draw"], [T.stays, "low-hit", 0.5], [T.supplier - 0.2, "paper-thud"], [T.needs - 0.2, "photo-settle"],
    [T.and - 0.1, "shutter"], [T.theyre - 0.2, "card-settle"], [T.next - 0.1, "slide-soft"], [T.link - 0.3, "tap"], [T.agrees - 0.2, "paper-unfold"], [T.but2 - 0.2, "tint-drain"],
    [T.morning - 0.2, "air-slow-push", 0.6], [T.flat - 0.2, "torque-click"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 96, root: 49, mode: "minor", style: "investigate", cut: T.theyre - 0.3, ret: T.morning - 0.25 };
  return { shots, heads, sfx, music };
}
