// @ts-nocheck
// LA-02 (lane A, collectors): "The Right Shape, the Wrong Evidence" (ChatGPT concept and look, Claude execution). At the
// show, the judge asks Nora whether these wheels belong in the car's period. She opens last year's installation photo,
// which proves when they went on, not when that wheel design existed or whether this set is a later reproduction. So she
// adds the casting-mark photo and a period catalog image to the build log, with the wheel's brand in the parts registry:
// something specific to examine. We keep that material together on a public build page; the judge still decides. SHARE CTA.
// Look (ChatGPT): ivory, bottle green, oxblood; narrow serif headlines (Fraunces, tight), small sans document labels; a
// photographic judging table that becomes an archival lightbox; museum object labels.
// Device: the judge's paper pointer and the judging table that turns into a lightbox. The install date grows into a
// calendar sheet; two near-identical wire wheels sit under museum labels; the camera pushes through a spoke to the hub's
// casting mark, which lines up with the catalog drawing.
// Car: K1-24 silver GT (collector, no maker named; unbadged side cutout). Drawn: wire wheels, pointer, slip, calendar,
// casting photo, catalog page. Fictional: Nora, Harrow Field Classics, Aldwick Wire Wheel Co. (catalog marked fictional).
// Transitions: pointer leads to the slip (match), photo slides onto the table (rise), date becomes the calendar (match),
// spoke push-through (portal), casting mark aligns to the catalog (match), table lights into the lightbox, pull back to the
// whole car for the CTA (pull).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.6;
export const LIFE = 1.75;
const IVORY = "#F6F1E6", BOTTLE = "#173C30", OX = "#6B1F24", OXL = "#A2464C", FELT = "#21483A", MUTE = "#6F6A5E", INKD = "#1F1C18";
export const BG = IVORY;
export const TEXT = { font: "Fraunces", weight: 600, size: 106, min: 72, ls: "-0.035em", opsz: 32, color: BOTTLE, accent: OX, line2: null, align: "left", x0: 80, maxW: 900, top: 266, lead: 1.02 };
export const IMAGES = ["K1-24"];
const HOOKS = { A: "Period / correct?", B: "Looks aren't / proof.", C: "Show day. / One question." };
const SANS = (size, color = INKD, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
const LABEL = { background: "#FFFDF7", boxShadow: "0 12px 22px -12px rgba(31,28,24,.45)", borderRadius: 4, borderLeft: `8px solid ${OX}` };
const WX = 380 / 2008, WY = 504 / 724; // front wheel centre in K1-24

// a wire wheel: tyre, chrome rim, crossed spokes, two-eared knock-off. repro: slightly different lacing and spinner
const WireWheel = ({ x, y, r = 200, rot = 0, repro = false, back = false, mark = 0 }) => {
  const n = repro ? 60 : 72;
  return <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200" style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }}>
    <defs><radialGradient id={`rim${repro ? "r" : ""}${back ? "b" : ""}`}><stop offset=".7" stopColor="#8E959C" /><stop offset=".86" stopColor="#F2F4F6" /><stop offset="1" stopColor="#6E757C" /></radialGradient></defs>
    {!back && <circle r={98} fill="#1B1C1E" />}
    <circle r={back ? 96 : 76} fill={`url(#rim${repro ? "r" : ""}${back ? "b" : ""})`} />
    <circle r={back ? 84 : 68} fill={back ? "#3A3D42" : "#2A2C30"} />
    <g transform={`rotate(${rot})`}>
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, off = (i % 2 ? 1 : -1) * (repro ? 0.22 : 0.3); return <line key={i} x1={Math.cos(a + off) * 14} y1={Math.sin(a + off) * 14} x2={Math.cos(a) * (back ? 82 : 66)} y2={Math.sin(a) * (back ? 82 : 66)} stroke="#D7DBDF" strokeWidth={0.9} />; })}
      <circle r={18} fill="#C9CED3" stroke="#7D848B" strokeWidth={2} />
      {!back && <path d={repro ? "M -30 -6 L 30 -6 L 30 6 L -30 6 Z" : "M -34 -5 Q 0 -12 34 -5 L 34 5 Q 0 12 -34 5 Z"} fill="#E9ECEF" stroke="#6E757C" strokeWidth={1.5} />}
      {back && <g><circle r={30} fill="#9EA4AA" /><text x={0} y={5} textAnchor="middle" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 14 }} fill="#4A4F55">AW 71</text>
        {mark > 0 && <circle r={40} fill="none" stroke={OXL} strokeWidth={3} strokeDasharray="252" strokeDashoffset={252 * (1 - mark)} />}</g>}
    </g>
  </svg>;
};
// the judge's paper pointer (oxblood card arrow)
const Pointer = ({ x, y, rot = 0, len = 520, o = 1 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: len, height: 54, transformOrigin: "0 50%", transform: `rotate(${rot}deg)`, opacity: o, zIndex: 40 }}>
    <svg width={len} height={54} viewBox={`0 0 ${len} 54`}><path d={`M 0 27 L 50 0 L 50 16 L ${len} 16 L ${len} 38 L 50 38 L 50 54 Z`} fill={OX} /><path d={`M 60 20 L ${len - 10} 20`} stroke="rgba(255,255,255,.25)" strokeWidth={3} /></svg></div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    show: at("show,"), judge: at("judge"), nora: at("nora"), period: at("period."), she: at("she"), opens: at("opens"), installation: at("installation"), photo: at("photo."),
    which: at("which"), proves: at("proves"), sure: at("sure."), doesnt: at("doesn't"), design: at("design"), existed: at("existed,"), later: at("later"), repro: at("reproduction."),
    so: at("so"), casting: at("casting-mark"), catalog: at("catalog"), brand: at("brand"), registry: at("registry."), now: at("now"), examine: at("examine."),
    we: at("we"), public: at("public"), judge2: at("judge", 2), decides: at("decides"), beyond: at("beyond"), cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [2] : [2, 3], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("The install / date.", T.opens), [T.opens, T.installation - 0.1, T.installation]), key: [2], hold: 0.5 },
    { ...fx(B("When fitted, / not when made.", T.doesnt), [T.which, T.proves, T.doesnt, at("when", 2), T.design]), key: [3, 4], hold: 0.6 },
    { ...fx(B("Identify / the part.", T.casting), [T.casting, T.catalog, T.brand]), key: [2], hold: 0.6 },
    { ...fx(B("The judge / still decides.", T.judge2), [T.judge2 - 0.1, T.judge2, at("still"), T.decides]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "Give the details / a home.", T.cta), key: [2, 4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // the judging table: green felt that can light up into a lightbox
  const Table = ({ t, light = 0, children }) => (
    <AbsoluteFill style={{ background: IVORY }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: FELT, backgroundImage: "radial-gradient(rgba(255,255,255,.04) 1px, transparent 2px)", backgroundSize: "6px 6px" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 600, bottom: 300, borderRadius: 18, background: "linear-gradient(180deg, #FFFDF5, #F1EAD8)", opacity: light, boxShadow: `0 0 ${80 * light}px rgba(255,248,220,${0.6 * light})` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(107,31,36,.08) 2px, transparent 2px), linear-gradient(90deg, rgba(107,31,36,.08) 2px, transparent 2px)", backgroundSize: "80px 80px" }} /></div>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 360, left: ((t * 70) % 1700) - 420, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,250,235,.25), rgba(255,255,255,0))" }} />
      {children}
    </AbsoluteFill>
  );
  const carW = 980, carCX = 540, carCY = 900, carH = carW * 724 / 2008;
  const wheelX = carCX - carW / 2 + carW * WX, wheelY = carCY - carH / 2 + carH * WY;
  // ---------------------------------------------------------------- 1. the car on the table; the pointer stops at the wheel; the judging slip; the install photo
  const table = (t) => {
    const d = drift(t, "ta", 3, 0.3);
    const pt = EASE.camera(seg(t, 0.2, 1.6));
    const slip = spr(t - (T.judge - 0.1), 180, 16);
    const ph = spr(t - (T.opens - 0.15), 160, 16);
    const toCal = EASE.in(seg(t, T.which - 0.4, T.which + 0.05));
    return <Table t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.15 * toCal})`, transformOrigin: "700px 1300px" }}>
      <Cut id="K1-24" cx={carCX} cy={carCY} w={carW} shadow={0.4} />
      <div style={{ position: "absolute", left: wheelX - 90, top: wheelY - 90, width: 180, height: 180, borderRadius: 90, border: `5px solid ${OXL}`, opacity: ez(t, 1.4, 0.4) * (0.6 + 0.4 * Math.sin(t * 3)) }} />
      <Pointer x={lerp(1150, wheelX + 70, pt)} y={wheelY + 40} rot={-8} len={560} />
      {slip > 0.01 && <div style={{ position: "absolute", left: 80, top: 1190, width: 470, padding: "18px 24px", ...LABEL, transform: `rotate(-2deg) translateY(${(1 - clamp(slip)) * 60}px)`, opacity: clamp(slip * 2) }}>
        <div style={SANS(42, MUTE, 600)}>Harrow Field Classics</div>
        <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 52, color: BOTTLE }}>Wheels: period?</div>
        <div style={{ ...SANS(42, OX, 650), marginTop: 4, ...land(t, T.nora) }}>Entrant: Nora</div></div>}
      {ph > 0.01 && <div style={{ position: "absolute", left: 560, top: 1080, width: 440, padding: 12, paddingBottom: 120, background: "#fff", boxShadow: "0 18px 30px -12px rgba(0,0,0,.5)", transform: `rotate(${4 - 2 * clamp(ph)}deg) translateY(${(1 - clamp(ph)) * 300}px)`, opacity: clamp(ph * 2) }}>
        <div data-check="photo" style={{ position: "relative", width: 416, height: 260, overflow: "hidden", background: "linear-gradient(180deg, #B9BEC4, #8A9096)" }}><WireWheel x={208} y={150} r={130} rot={t * 6} /></div>
        <div style={{ position: "absolute", left: 14, bottom: 8 }}><div style={SANS(42, INKD, 700)}>Wheels fitted</div><div style={{ ...SANS(42, OX, 700) }}>May 14, 2025</div></div></div>}
    </div></Table>;
  };
  // ---------------------------------------------------------------- 2. the date becomes a calendar sheet; then two near-identical wheels under museum labels
  const compare = (t) => {
    const d = drift(t, "co", 3, 0.3);
    const cal = clamp(spr(t - (T.which - 0.05), 170, 16));
    const aside = EASE.camera(seg(t, T.doesnt - 0.2, T.design));
    const w1 = spr(t - (T.design - 0.1), 170, 15), w2 = spr(t - (T.later - 0.1), 170, 15);
    const push = EASE.in(seg(t, T.so - 0.5, T.so));
    return <Table t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 3 * push})`, transformOrigin: "300px 1040px" }}>
      <div style={{ position: "absolute", left: lerp(290, -380, aside), top: 640, width: 500, height: 560, background: "#FFFDF7", boxShadow: "0 18px 30px -14px rgba(0,0,0,.45)", transform: `rotate(${lerp(-3, -12, aside)}deg) scale(${0.6 + 0.4 * cal})`, opacity: cal * (1 - aside), borderRadius: 6, overflow: "hidden" }}>
        <div style={{ height: 120, background: OX, display: "grid", placeItems: "center" }}><span style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 64, color: IVORY }}>May 2025</span></div>
        <div style={{ textAlign: "center", fontFamily: "Fraunces", fontWeight: 600, fontSize: 260, color: BOTTLE, lineHeight: 1.3 }}>14</div>
        <div style={{ textAlign: "center", ...SANS(44, MUTE, 600) }}>wheels went on</div></div>
      <WireWheel x={300} y={1040} r={210 * clamp(w1) + 0.01} rot={t * 8} />
      <WireWheel x={790} y={1040} r={210 * clamp(w2) + 0.01} rot={t * 8 + 3} repro />
      {[[w1, 120, "Design: 1960s?"], [w2, 600, "Or a later reproduction?"]].map(([w, x, txt], i) => <div key={i} style={{ position: "absolute", left: x, top: 1300, width: i ? 380 : 380, padding: "14px 20px", ...LABEL, opacity: clamp(w * 2), transform: `rotate(${i ? 2 : -2}deg)` }}>
        <div style={{ ...SANS(42, INKD, 650), whiteSpace: "normal" }}>{txt}</div></div>)}
    </div></Table>;
  };
  // ---------------------------------------------------------------- 3. the hub's casting mark; the catalog drawing; the log entry with the registry brand
  const evidence = (t) => {
    const d = drift(t, "ev", 3, 0.3);
    const mark = ez(t, T.casting, 0.7, EASE.io);
    const cat = spr(t - (T.catalog - 0.15), 160, 16);
    const align = EASE.io(seg(t, T.now - 0.2, T.examine));
    const logP = EASE.camera(seg(t, at("build") - 0.3, T.registry));
    return <Table t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {/* casting photo (hub back) */}
      <div style={{ position: "absolute", left: lerp(90, 80, logP), top: lerp(640, 700, logP), width: lerp(520, 420, logP), padding: 12, paddingBottom: 14, background: "#fff", boxShadow: "0 18px 30px -12px rgba(0,0,0,.5)", transform: `rotate(${lerp(-3, -1, logP)}deg)` }}>
        <div data-check="photo" style={{ position: "relative", width: lerp(496, 396, logP), height: lerp(496, 396, logP), overflow: "hidden", background: "radial-gradient(#5A5E63, #2A2C2F)" }}>
          <WireWheel x={lerp(248, 198, logP)} y={lerp(248, 198, logP)} r={lerp(330, 270, logP)} rot={0} back mark={mark} /></div></div>
      {/* period catalog page (fictional) */}
      {cat > 0.01 && <div style={{ position: "absolute", left: lerp(560, 540, logP), top: lerp(700, 700, logP), width: 440, height: 520, background: "#EFE5CC", boxShadow: "0 18px 30px -12px rgba(0,0,0,.45)", transform: `rotate(${3 - 2 * clamp(cat)}deg) translateX(${(1 - clamp(cat)) * 400}px)`, opacity: clamp(cat * 2), padding: "22px 24px" }}>
        <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 48, color: OX }}>Aldwick</div>
        <div style={SANS(42, MUTE, 600)}>Wire wheels · catalog</div>
        <svg width={392} height={300} viewBox="0 0 392 300" style={{ marginTop: 10 }}>
          <circle cx={196} cy={150} r={120} fill="none" stroke={INKD} strokeWidth={2} />{Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2; return <line key={i} x1={196 + Math.cos(a) * 30} y1={150 + Math.sin(a) * 30} x2={196 + Math.cos(a) * 110} y2={150 + Math.sin(a) * 110} stroke={INKD} strokeWidth={1} />; })}
          <circle cx={196} cy={150} r={40} fill="none" stroke={align > 0 ? OXL : INKD} strokeWidth={align > 0 ? 4 : 2} /><text x={196} y={156} textAnchor="middle" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 16 }} fill={INKD}>AW 71</text></svg>
        <div style={{ ...SANS(42, MUTE, 500), position: "absolute", left: 24, bottom: 18 }}>Fictional reference</div></div>}
      {/* the alignment line between the two marks */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: align }}><path d={`M ${lerp(350, 300, logP)} ${lerp(900, 905, logP)} L ${lerp(350, 300, logP) + 420 * align} ${lerp(900, 905, logP) - 20 * align}`} stroke={OXL} strokeWidth={4} strokeDasharray="10 8" /></svg>
      {/* the log: registry brand, both photos credited */}
      {logP > 0.01 && <div style={{ position: "absolute", left: 80, top: 1250, width: 920, padding: "18px 26px", background: "#fff", borderRadius: 18, boxShadow: "0 18px 30px -16px rgba(0,0,0,.4)", opacity: logP, transform: `translateY(${(1 - logP) * 60}px)` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: INKD }}>Fuel<span style={{ color: OXL }}>My</span>Build</span><span style={SANS(42, MUTE, 500)}>· parts registry</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span style={SANS(46, INKD, 700)}>Wire wheels</span><span style={SANS(46, OX, 700)}>Aldwick</span></div></div>}
    </div></Table>;
  };
  // ---------------------------------------------------------------- 4. the lightbox: page, wheel, sources before the pointer; pull back to the car (and CTA)
  const lightbox = (t, end) => {
    const d = drift(t, "lb" + (end ? "e" : ""), 3, 0.3);
    const light = end ? 1 : ez(t, T.we - 0.2, 0.8);
    const pt = end ? 1 : EASE.camera(seg(t, T.judge2 - 0.3, T.decides));
    const back = end ? EASE.camera(seg(t, T.cta - 0.5, T.cta + 0.7)) : 0;
    const url = end ? spr(t - (T.cta + 1.2), 190, 16) : 0;
    return <Table t={t} light={light}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 80, top: 650, width: 560, ...land(t, end ? -9 : T.public - 0.2), background: "#fff", borderRadius: 26, boxShadow: "0 24px 40px -22px rgba(0,0,0,.45)", padding: "22px 26px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: INKD }}>Fuel<span style={{ color: OXL }}>My</span>Build</span></div>
        <div style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 54, color: BOTTLE, marginTop: 4 }}>Nora's GT</div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <div data-check="photo" style={{ position: "relative", width: 160, height: 160, background: "radial-gradient(#5A5E63, #2A2C2F)", overflow: "hidden", borderRadius: 10 }}><WireWheel x={80} y={80} r={110} back /></div>
          <div data-check="photo" style={{ width: 160, height: 160, background: "#EFE5CC", borderRadius: 10, display: "grid", placeItems: "center" }}><WireWheel x={80} y={80} r={0.01} /><svg width={130} height={130} viewBox="0 0 130 130"><circle cx={65} cy={65} r={55} fill="none" stroke={INKD} strokeWidth={2} />{Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; return <line key={i} x1={65 + Math.cos(a) * 14} y1={65 + Math.sin(a) * 14} x2={65 + Math.cos(a) * 50} y2={65 + Math.sin(a) * 50} stroke={INKD} strokeWidth={1} />; })}</svg></div>
          <div data-check="photo" style={{ position: "relative", width: 160, height: 160, background: "linear-gradient(180deg, #B9BEC4, #8A9096)", overflow: "hidden", borderRadius: 10 }}><WireWheel x={80} y={90} r={70} rot={t * 6} /></div>
        </div>
        <div style={{ ...SANS(42, MUTE, 600), marginTop: 12 }}>Aldwick · fitted May 2025</div>
      </div>
      <WireWheel x={810} y={830} r={190} rot={t * 6} />
      <Pointer x={lerp(1150, 880, pt)} y={1060} rot={-150} len={300} />
      <div style={{ position: "absolute", left: 0, top: 0, opacity: back }}><Cut id="K1-24" cx={540} cy={1250} w={900} shadow={0.4} /></div>
      {end && url > 0.01 && <div style={{ position: "absolute", left: 300, top: 1480, padding: "12px 24px", borderRadius: 30, background: BOTTLE, display: "flex", gap: 14, alignItems: "baseline", opacity: clamp(url * 2) }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: IVORY }}>Fuel<span style={{ color: "#E6A9AD" }}>My</span>Build</span><span style={SANS(42, "#CFE0D8", 500)}>fuelmybuild.com</span></div>}
    </div></Table>;
  };

  const shots = [
    { at: 0, render: table },
    { at: T.which - 0.05, render: compare, enter: { kind: "match" } },
    { at: T.so - 0.05, render: evidence, enter: { kind: "portal", d: 0.6, rect: { x: 250, y: 990, w: 100, h: 100 }, r: 50 } },
    { at: T.we - 0.12, render: (t) => lightbox(t, false), enter: { kind: "rise", d: 0.5 } },
    { at: T.cta - 0.1, render: (t) => lightbox(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.2, "slide-soft"], [1.5, "tap"], [T.judge - 0.1, "paper-thud"], [T.opens - 0.15, "photo-settle"], [T.which - 0.05, "paper-flutter"], [T.design - 0.1, "pop-soft"],
    [T.later - 0.1, "pop-soft"], [T.so - 0.4, "portal"], [T.casting, "shutter"], [T.catalog - 0.15, "page-turn"], [T.now - 0.2, "draw"], [at("build") - 0.3, "card-settle"],
    [T.we - 0.2, "tint-swell"], [T.public - 0.2, "card-settle"], [T.judge2 - 0.3, "slide-soft"], [T.decides, "tap"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 92, root: 48, mode: "minor", style: "investigate", cut: T.so - 0.2, ret: T.we - 0.12 };
  return { shots, heads, sfx, music };
}
