// @ts-nocheck
// LA-09 (lane A, used and rebuilt parts suppliers): "A Clean Housing Can't Tell You" (ChatGPT concept and look, Claude
// execution). Owen is selling a rebuilt carburetor from his project car; the buyer likes the finish but wants to know what
// happened inside. He adds old photos to the car's build log with their original dates: the rebuild, the installation, the
// rebuilder and the replacement-parts brand. So there's more to discuss than a polished shell, and the buyer can ask what's
// happened since. We keep that history on the car's public build page: a reference for the conversation, not a guarantee.
// LINK CTA (fuelmybuild.com).
// Look (ChatGPT): cream, tarnished brass, deep navy; serif headlines (Fraunces, OFL) with quiet sans labels. A parts
// counter rewinds through nested trays of component photos and reconnects to the car.
// Device: the counter paper curls back into a photo tray; one casting mark ("B7" diamond) lines up across every photo.
// Car: 240Z side A05 (classic carbureted project car, unbadged cutout). Drawn: the carburetor in four states, the trays,
// the buyer's hand, the page. Fictional: Owen, Bracken Bench Rebuilds, Mossline Seals.
// Transitions: paper curl (wipe), finger point through the housing (portal), tray-to-log snap (match), casting-mark line
// up (match), timeline gap opens (rise), pull back to the counter with the car page (pull), CTA over the same counter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.6;
export const LIFE = 1.75;
const CREAM = "#F3EAD8", NAVY = "#1B2A44", BRASS = "#A88B4A", BRASSL = "#CDB57A", MIDN = "#5B6478", PAPERC = "#FBF6EA";
export const BG = CREAM;
export const TEXT = { font: "Fraunces", weight: 600, size: 104, min: 70, ls: "-0.01em", opsz: 32, color: NAVY, accent: BRASS, line2: null, align: "left", x0: 80, maxW: 920, top: 270, lead: 1.04 };
export const IMAGES = ["A05"];
const HOOKS = { A: "What does / 'rebuilt' mean?", B: "Show / underneath.", C: "More than / the finish." };
const SANS = (size, color = NAVY, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
const PAPER = { background: PAPERC, boxShadow: "0 18px 30px -14px rgba(27,42,68,.45)", borderRadius: 14 };

// the carburetor. state: polished | opened | rebuilt | installed. mark: casting mark ring (0..1)
const Carb = ({ x, y, w = 520, state = "polished", mark = 0, glint = 0, id = "c" }) => {
  const dirty = state === "opened";
  const body = dirty ? ["#8D8A80", "#5E5B53"] : ["#EEF1F3", "#9AA2AA"];
  return <svg width={w} height={w} viewBox="0 0 400 400" style={{ position: "absolute", left: x - w / 2, top: y - w / 2, overflow: "visible" }}>
    <defs>
      <linearGradient id={`cb${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={body[1]} /><stop offset=".35" stopColor={body[0]} /><stop offset="1" stopColor={body[1]} /></linearGradient>
      <linearGradient id={`cr${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7E6A3A" /><stop offset=".4" stopColor={BRASSL} /><stop offset="1" stopColor="#7E6A3A" /></linearGradient>
      <clipPath id={`cc${id}`}><rect x={110} y={110} width={180} height={190} rx={18} /></clipPath>
    </defs>
    {state === "installed" && <><rect x={60} y={300} width={280} height={70} rx={10} fill="#3B3F45" /><path d="M 340 330 Q 390 330 400 380" stroke="#1E1F22" strokeWidth={22} fill="none" /></>}
    <rect x={90} y={296} width={220} height={26} rx={6} fill={`url(#cb${id})`} stroke="#5A6068" strokeWidth={2} />
    <circle cx={110} cy={309} r={7} fill="#4A4F55" /><circle cx={290} cy={309} r={7} fill="#4A4F55" />
    <rect x={110} y={110} width={180} height={190} rx={18} fill={`url(#cb${id})`} stroke="#5A6068" strokeWidth={2} />
    <g clipPath={`url(#cc${id})`}><rect x={60 + 300 * glint} y={100} width={36} height={220} fill="rgba(255,255,255,.5)" transform="skewX(-18)" /></g>
    <rect x={290} y={170} width={70} height={110} rx={14} fill={`url(#cb${id})`} stroke="#5A6068" strokeWidth={2} />
    <path d="M 110 200 L 60 210 L 52 250" stroke={dirty ? "#6C6A62" : "#C3C9CF"} strokeWidth={10} fill="none" strokeLinecap="round" />
    <circle cx={60} cy={210} r={12} fill={`url(#cr${id})`} />
    {state === "opened" ? <>
      <ellipse cx={200} cy={106} rx={86} ry={20} fill="#2A2824" />
      {[160, 200, 240].map((jx) => <rect key={jx} x={jx - 7} y={96} width={14} height={30} rx={4} fill="#9C8248" />)}
    </> : <>
      <rect x={120} y={64} width={160} height={50} rx={10} fill={`url(#cr${id})`} stroke="#6E5C30" strokeWidth={2} />
      <ellipse cx={200} cy={64} rx={80} ry={16} fill={`url(#cr${id})`} stroke="#6E5C30" strokeWidth={2} />
      <ellipse cx={200} cy={64} rx={60} ry={10} fill="#3A3528" />
      {state === "rebuilt" && <rect x={112} y={110} width={176} height={6} fill="#A3412C" />}
    </>}
    {/* casting mark */}
    <g transform="translate(200 210)"><path d="M 0 -28 L 28 0 L 0 28 L -28 0 Z" fill="none" stroke={dirty ? "#4E4B44" : "#7A828A"} strokeWidth={4} />
      <text x={0} y={9} textAnchor="middle" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 24 }} fill={dirty ? "#4E4B44" : "#6D757D"}>B7</text>
      {mark > 0 && <circle r={48} fill="none" stroke={BRASS} strokeWidth={6} strokeDasharray="302" strokeDashoffset={302 * (1 - mark)} />}</g>
  </svg>;
};
// a print of the carb in a given state (photographic treatment), dated
const Print = ({ state, date, w = 300, h = 380, mark = 0, t = 0, rot = 0, s = 1, o = 1, x, y, label, z = 1 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: 14, paddingBottom: 64, background: "#FFFDF7", boxShadow: "0 16px 26px -12px rgba(27,42,68,.5)", transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: z }}>
    <div style={{ position: "relative", width: w - 28, height: h - 92, overflow: "hidden", background: state === "opened" ? "radial-gradient(110% 90% at 40% 35%, #6A5E4C, #2C2720)" : "radial-gradient(110% 90% at 40% 35%, #5C6472, #222832)" }}>
      <Carb x={(w - 28) / 2} y={(h - 92) / 2 + 6} w={(w - 28) * 0.92} state={state} mark={mark} id={"p" + state} glint={(t * 0.3) % 1} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,214,150,.22), rgba(0,0,0,.12) 70%)" }} />
    </div>
    <div style={{ position: "absolute", left: 16, bottom: 12, ...SANS(42, NAVY, 650) }}>{date}</div>
  </div>
);
// the buyer's hand, pointing up-left to (x,y)
const Hand = ({ x, y, p }) => p <= 0.01 ? null : (
  <svg width={560} height={420} viewBox="0 0 560 420" style={{ position: "absolute", left: x - 30 + (1 - p) * 500, top: y - 20 + (1 - p) * 300, overflow: "visible", zIndex: 30 }}>
    <path d="M 20 30 Q 6 22 14 10 Q 22 0 38 8 L 200 120 L 250 110 Q 300 104 330 130 L 560 260 L 560 420 L 330 420 Q 260 380 230 300 L 210 240 L 180 170 Z" fill="#C98F6E" />
    <path d="M 20 30 Q 6 22 14 10 Q 22 0 38 8 L 70 30" fill="#E7B595" />
    <path d="M 330 130 L 560 260 L 560 420 L 330 420 Q 290 400 280 360" fill="#1B2A44" opacity={0.92} />
  </svg>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    owen: at("owen's"), carb: at("carburetor"), project: at("project"), buyer: at("buyer"), finish: at("finish,"), inside: at("inside."), adds: at("adds"), photos: at("photos"),
    log: at("log,"), original: at("original"), dates: at("dates."), rebuild: at("rebuild,"), installation: at("installation,"), rebuilder: at("rebuilder"), brands: at("brands."),
    so: at("so"), polished: at("polished"), shell: at("shell."), ask: at("ask"), since: at("since"), keep: at("keep"), history: at("history"), public: at("public"),
    reference: at("reference"), guarantee: at("guarantee"), condition: at("condition."), cta: tl.cta("your") ?? at("your"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [1] : [2], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Under the / finish.", T.buyer), [T.finish - 0.3, T.finish - 0.1, T.finish]), key: [2], hold: 0.8 },
    { ...fx(B("The work, / in order.", T.original), [T.original, T.original + 0.15, T.dates, T.dates + 0.15]), key: [3], hold: 0.6 },
    { ...fx(B("And since / then?", T.ask), [T.ask, T.since - 0.15, T.since]), key: [2], hold: 0.6 },
    { ...fx(B("A record / to examine.", T.reference), [T.reference, T.reference + 0.2, T.guarantee - 0.1, T.guarantee]), key: [3], hold: 0.5 },
    { ...ctaHead(tl, "Keep the work / with the build.", T.cta), key: [5] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Counter = ({ t, curl = 0, children }) => (
    <AbsoluteFill style={{ background: CREAM }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, bottom: 0, background: "linear-gradient(180deg, #E4D6B8, #D2C19C)" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 760, height: 760 * (1 - curl), borderRadius: 6, background: PAPERC, backgroundImage: "repeating-linear-gradient(0deg, rgba(168,139,74,.08) 0 2px, transparent 2px 48px)", boxShadow: "0 18px 30px -18px rgba(27,42,68,.4)" }} />
      {curl > 0.01 && <div style={{ position: "absolute", left: 40, right: 40, top: 760 + 760 * (1 - curl) - 70, height: 140, borderRadius: 70, background: "linear-gradient(180deg, #FFFFFF, #E6DCC6 60%, #C9BB98)", boxShadow: "0 18px 26px -10px rgba(27,42,68,.4)" }} />}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 360, left: ((t * 80) % 1600) - 400, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,250,235,.35), rgba(255,255,255,0))" }} />
      {children}
    </AbsoluteFill>
  );
  // ---------------------------------------------------------------- 1. the counter: polished carb, label tag; buyer's hand; push into the housing
  const counter = (t) => {
    const d = drift(t, "co", 3, 0.3);
    const push = EASE.in(seg(t, T.inside - 0.5, T.adds));
    const hand = EASE.camera(seg(t, T.buyer - 0.2, T.buyer + 0.6)) * (1 - ez(t, T.inside - 0.6, 0.4, EASE.in));
    const q = spr(t - (T.finish + 0.2), 190, 15);
    const cardO = EASE.out(seg(t, T.inside - 0.7, T.inside - 0.3));
    return <Counter t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 3 * push})`, transformOrigin: "540px 1150px" }}>
      <Carb x={540} y={1130} w={600} state="polished" glint={(t * 0.32) % 1} />
      <div style={{ position: "absolute", left: 90, top: 1390, padding: "14px 22px", ...PAPER, transform: "rotate(-4deg)" }}><div style={SANS(42, MIDN, 600)}>Bracken Bench Rebuilds</div><div style={{ ...SANS(44, NAVY, 700) }}>Rebuilt carburetor</div></div>
      <div style={{ position: "absolute", left: 380, top: 1500, padding: "12px 22px", borderRadius: 30, background: NAVY, ...land(t, T.owen) }}><span style={SANS(44, CREAM, 650)}>Owen</span><span style={SANS(42, BRASSL, 500)}>  · from his project car</span></div>
      {q > 0.01 && <div style={{ position: "absolute", left: 760, top: 840, width: 160, height: 160, borderRadius: 18, ...PAPER, display: "grid", placeItems: "center", transform: `scale(${clamp(q)}) rotate(${6 - 6 * clamp(q)}deg)`, opacity: 1 - cardO }}><span style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 110, color: BRASS }}>?</span></div>}
      <Hand x={600} y={1110} p={hand} />
    </div></Counter>;
  };
  // ---------------------------------------------------------------- 2. the tray of prints, rewinding to 2019; they line up by the casting mark; then the log
  const tray = (t) => {
    const d = drift(t, "tr", 3, 0.3);
    const P = [
      { st: "opened", date: "Mar 9, 2019", t0: T.adds - 0.1, tx: 50, ty: 840 },
      { st: "rebuilt", date: "Mar 23, 2019", t0: T.photos - 0.05, tx: 390, ty: 800 },
      { st: "installed", date: "Apr 6, 2019", t0: T.photos + 0.3, tx: 730, ty: 840 },
    ];
    const line = EASE.io(seg(t, T.original - 0.2, T.dates + 0.3));
    const logP = EASE.camera(seg(t, T.rebuild - 0.3, T.installation));
    const credit = spr(t - (T.rebuilder - 0.1), 190, 17), brand = spr(t - (T.brands - 0.3), 190, 17);
    return <AbsoluteFill style={{ background: CREAM }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 560, height: 1000, borderRadius: 26, background: NAVY, boxShadow: "inset 0 0 60px rgba(0,0,0,.45)", backgroundImage: "radial-gradient(rgba(255,255,255,.05) 1px, transparent 2px)", backgroundSize: "6px 6px" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        {P.map((p, i) => {
          const s0 = spr(t - p.t0, 170, 16);
          const lx = lerp(p.tx, 70 + i * 320, line), ly = lerp(p.ty, 820, line);
          const fx2 = lerp(lx, 80, logP), fy2 = lerp(ly, 640 + i * 280, logP);
          return <Print key={i} state={p.st} date={p.date} x={fx2} y={fy2} w={lerp(300, 260, logP)} h={lerp(440, 250, logP)} rot={lerp((i - 1) * 7 * (1 - line), 0, logP)} s={0.7 + 0.3 * clamp(s0)} o={clamp(s0 * 2)} mark={line} t={t} z={i} />;
        })}
        {/* the casting-mark line */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: line * (1 - logP) }}><line x1={60} y1={1020} x2={60 + 960 * line} y2={1020} stroke={BRASSL} strokeWidth={4} strokeDasharray="12 10" /></svg>
        {/* log captions beside each print */}
        {["Carburetor opened", "Rebuilt · new seals", "Installed on the car"].map((c, i) => <div key={i} style={{ position: "absolute", left: 380, top: 690 + i * 280, opacity: seg(logP, 0.7, 1), transform: `translateX(${(1 - logP) * 60}px)` }}>
          <div style={SANS(48, CREAM, 650)}>{c}</div><div style={SANS(42, BRASSL, 500)}>{["Mar 9, 2019", "Mar 23, 2019", "Apr 6, 2019"][i]}</div></div>)}
        <div style={{ position: "absolute", left: 80, top: 590, opacity: logP, display: "flex", gap: 12 }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: CREAM }}>Fuel<span style={{ color: BRASSL }}>My</span>Build</span><span style={SANS(42, "#9AA6BC", 500)}>· Owen's project car</span></div>
        {credit > 0.01 && <div style={{ position: "absolute", left: 380, top: 1100, padding: "10px 18px", borderRadius: 24, background: rgba(CREAM, 0.14), opacity: clamp(credit * 2), transform: `translateY(${(1 - clamp(credit)) * 30}px)` }}><span style={SANS(42, CREAM, 600)}>Owen · Bracken Bench</span></div>}
        {brand > 0.01 && <div style={{ position: "absolute", left: 380, top: 1170, padding: "10px 18px", borderRadius: 24, background: BRASS, opacity: clamp(brand * 2), transform: `translateY(${(1 - clamp(brand)) * 30}px)` }}><span style={SANS(42, NAVY, 700)}>Mossline Seals kit</span></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the timeline: 2019 prints | open gap | today's loose part
  const gap = (t) => {
    const d = drift(t, "ga", 3, 0.3);
    const open = EASE.camera(seg(t, T.so - 0.1, T.shell));
    const bub = spr(t - (T.ask - 0.1), 180, 15);
    const tick = (t * 0.6) % 1;
    return <Counter t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, height: 6, background: NAVY, opacity: 0.85 }} />
      {[0, 1, 2].map((i) => <Print key={i} state={["opened", "rebuilt", "installed"][i]} date={["Mar 2019", "Mar 2019", "Apr 2019"][i]} x={60 + i * 60} y={760 + i * 40} w={260} h={330} rot={-6 + i * 5} t={t} z={i} />)}
      <div style={{ position: "absolute", left: lerp(420, 380, open), top: 1250, width: lerp(0, 330, open), height: 100, borderLeft: `4px dashed ${BRASS}`, borderRight: `4px dashed ${BRASS}`, background: `repeating-linear-gradient(90deg, ${rgba(BRASS, 0.18)} 0 14px, transparent 14px 28px)`, backgroundPosition: `${tick * 28}px 0` }} />
      <div style={{ position: "absolute", left: 470, top: 1370, opacity: open, ...SANS(42, MIDN, 600) }}>since 2019</div>
      <div style={{ position: "absolute", left: lerp(1100, 700, open), top: 820 }}><div style={{ position: "relative", width: 320, height: 420 }}><Carb x={160} y={230} w={340} state="polished" glint={(t * 0.32) % 1} id="g" /></div>
        <div style={{ ...SANS(42, MIDN, 600), marginLeft: 90 }}>today</div></div>
      {bub > 0.01 && <div style={{ position: "absolute", left: 360, top: 1450, padding: "18px 26px", ...PAPER, borderRadius: 30, transform: `scale(${clamp(bub)})`, transformOrigin: "50% 0" }}><span style={SANS(46, NAVY, 600)}>What's happened since?</span></div>}
    </div></Counter>;
  };
  // ---------------------------------------------------------------- 4. the counter again: the removed carb, the car's public page beside it (and the CTA)
  const page = (t, end) => {
    const d = drift(t, "pg" + (end ? "e" : ""), 3, 0.3);
    const slide = end ? 1 : EASE.camera(seg(t, T.keep - 0.1, T.public + 0.2));
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const url = end ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    return <Counter t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1100px" }}>
      <div style={{ position: "absolute", left: lerp(1100, 90, slide), top: 600, width: 620, height: 820, ...PAPER, background: "#fff", overflow: "hidden", transform: `rotate(${lerp(8, -2, slide)}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 300, background: "linear-gradient(180deg, #DCE2EA, #F4F1EA)" }}><Cut id="A05" cx={310} cy={170} w={560} shadow={0.35} /></div>
        <div style={{ position: "absolute", left: 30, top: 316, ...SANS(48, NAVY, 700) }}>Owen's project car</div>
        <div style={{ position: "absolute", left: 30, top: 380, ...SANS(42, MIDN, 500) }}>Public build page</div>
        {["Opened · Mar 9, 2019", "Rebuilt · Mar 23, 2019", "Installed · Apr 6, 2019"].map((r, i) => <div key={i} style={{ position: "absolute", left: 30, top: 470 + i * 96, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", position: "relative", background: "#2B313B" }}><Carb x={35} y={38} w={66} state={["opened", "rebuilt", "installed"][i]} id={"r" + i + (end ? "e" : "")} /></div>
          <span style={SANS(42, NAVY, 600)}>{r}</span></div>)}
      </div>
      <Carb x={820} y={1270} w={380} state="polished" glint={(t * 0.32) % 1} id="pc" />
      {end && url > 0.01 && <div style={{ position: "absolute", left: 90, top: 1460, padding: "16px 26px", borderRadius: 34, background: NAVY, display: "flex", gap: 16, alignItems: "center", opacity: clamp(url * 2), transform: `translateY(${(1 - clamp(url)) * 30}px)` }}>
        <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: CREAM }}>Fuel<span style={{ color: BRASSL }}>My</span>Build</span><span style={SANS(44, BRASSL, 600)}>fuelmybuild.com</span></div>}
    </div></Counter>;
  };

  const shots = [
    { at: 0, render: counter },
    { at: T.adds - 0.12, render: tray, enter: { kind: "portal", d: 0.6, rect: { x: 470, y: 1080, w: 140, h: 140 }, r: 20 } },
    { at: T.so - 0.12, render: gap, enter: { kind: "rise", d: 0.5 } },
    { at: T.keep - 0.15, render: (t) => page(t, false), enter: { kind: "match" } },
    { at: T.cta - 0.12, render: (t) => page(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.15, "part-lift"], [0.5, "clunk", 0.6], [T.buyer - 0.1, "slide-soft"], [T.finish + 0.2, "pop-soft"], [T.inside - 0.4, "portal"],
    [T.adds, "shutter"], [T.photos, "shutter"], [T.photos + 0.35, "shutter"], [T.original - 0.1, "draw"], [T.rebuild - 0.2, "card-settle"], [T.rebuilder, "tap"], [T.brands - 0.3, "pop-soft"],
    [T.so - 0.2, "paper-unfold"], [T.ask, "msg-pop"], [T.keep - 0.15, "slide-soft"], [T.public, "photo-settle"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 90, root: 50, mode: "major", style: "warm", cut: T.adds - 0.2, ret: T.so - 0.1 };
  return { shots, heads, sfx, music };
}
