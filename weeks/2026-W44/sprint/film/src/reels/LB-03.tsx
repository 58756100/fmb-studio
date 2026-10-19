// @ts-nocheck
// LB-03 (lane B, collectors): "M2 isn't a car" (ChatGPT concept and script, Claude build). Domestic two-voice skit.
// Bea sees "M2" against the green coupe in Owen's collection spreadsheet: did we buy another car? No: second mirror
// repair. First time the glass changed; later the housing cracked. The little star? "Honestly, that just means I should
// explain it." The build entry with the housing photo: passenger side, Len fitted it. The sheet still tracks the whole
// collection; now Bea can read this car's story. Done-for-you CTA (Owen reads it as "we").
// Device (reserved by ChatGPT): one spreadsheet cell that unfolds into a readable mirror repair. The camera lives inside
// one plain external sheet (never FMB UI, no sync implied); the M2 cell stretches, dog-ears, hinges and finally refolds.
// Car: green collector coupe K1-15 (no maker named in VO; unbadged cutout). Mirror, glass, housing, sheet: drawn.
// Fictional: Owen, Bea, Len, Reed Hollow Auto, Fenwick Glass.
// Transitions: fingertip push into the cell (portal), cell stretch (match), corner fold reveals the old photo (rise of the
// flap), exploded mirror (whip), star hinge opens the work photo (portal), photo settles into the entry (match), pull back
// to sheet + entry (pull), mirror reflection carries a sliver of grid to the car (match), CTA over the car with the cell.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep, Ripple } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["K1-15", "K1-23", "K1-21", "K1-03"];
const HOOKS = { A: "Another / car?", B: "What is / M2?", C: "Why / M2?" };
const GRID = "#D6D9DE", HEAD = "#EEF0F3", SEL = "#1A73E8";
const GREEN = "#1E4A37";

// the side mirror: housing (car green), glass, stalk. glassX slides the glass out; crack draws on the housing
const Mirror = ({ x, y, w = 420, glassX = 0, glassY = 0, crack = 0, oldGlass = 0, glint = 0, housingO = 1 }) => (
  <svg width={w} height={w * 0.68} viewBox="0 0 400 272" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.34, overflow: "visible" }}>
    <defs>
      <linearGradient id="mh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3C7A5D" /><stop offset=".45" stopColor={GREEN} /><stop offset="1" stopColor="#0C231A" /></linearGradient>
      <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={oldGlass ? "#8C9399" : "#E8F1F8"} /><stop offset=".55" stopColor={oldGlass ? "#5E666D" : "#AFC3D2"} /><stop offset="1" stopColor={oldGlass ? "#41474D" : "#7E95A6"} /></linearGradient>
      <clipPath id="mgc"><path d="M 70 70 Q 70 50 95 48 L 300 40 Q 330 40 332 70 L 336 168 Q 336 196 306 198 L 100 204 Q 72 204 70 176 Z" /></clipPath>
    </defs>
    <g opacity={housingO}>
      <path d="M 300 200 L 330 250 L 380 252 L 380 232 L 352 226 L 334 196 Z" fill="#14161A" />
      <path d="M 40 70 Q 40 22 96 20 L 304 12 Q 362 12 364 70 L 368 176 Q 368 226 312 228 L 96 236 Q 40 236 40 182 Z" fill="url(#mh)" />
      <path d="M 70 30 Q 200 18 340 26" stroke="rgba(255,255,255,.35)" strokeWidth={6} fill="none" strokeLinecap="round" />
      {crack > 0 && <path d="M 300 228 L 318 200 L 306 186 L 330 160 L 322 140 L 346 118" stroke="#E9EEF0" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset={200 * (1 - crack)} />}
    </g>
    <g transform={`translate(${glassX} ${glassY})`}>
      <path d="M 70 70 Q 70 50 95 48 L 300 40 Q 330 40 332 70 L 336 168 Q 336 196 306 198 L 100 204 Q 72 204 70 176 Z" fill="url(#mg)" stroke="#2A2E33" strokeWidth={4} />
      <g clipPath="url(#mgc)"><rect x={-120 + 520 * glint} y={20} width={60} height={220} fill="rgba(255,255,255,.45)" transform="skewX(-22)" /></g>
    </g>
  </svg>
);

// a plain spreadsheet (external, hand-kept). rows: [thumb id, car, note, star]
const ROWS = [["K1-23", "Silver GT", "Oil · Apr", ""], ["K1-21", "Blue roadster", "Tires '24", ""], ["K1-15", "Green coupe", "M2", "*"], ["K1-03", "Silver spyder", "Cover", ""]];
const Sheet = ({ t, x, y, s = 1, hi = 0, star = 0, origin = "0 0", children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 960, transform: `scale(${s})`, transformOrigin: origin, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 0 0 2px " + GRID + ", 0 30px 50px -30px rgba(0,0,0,.35)" }}>
    <div style={{ display: "flex", height: 84, background: HEAD, borderBottom: `2px solid ${GRID}` }}>
      {[["", 170], ["Car", 380], ["Notes", 260], ["", 150]].map(([h, w], i) => <div key={i} style={{ width: w, borderRight: i < 3 ? `2px solid ${GRID}` : "none", padding: "14px 20px", ...inter(46, GREY, 600) }}>{h}</div>)}
    </div>
    {ROWS.map(([id, car, note, st], r) => (
      <div key={r} style={{ display: "flex", height: 128, borderBottom: `2px solid ${GRID}`, background: r === 2 ? rgba(SEL, 0.05 * hi) : "#fff" }}>
        <div style={{ width: 170, borderRight: `2px solid ${GRID}`, display: "grid", placeItems: "center" }}><Thumb id={id} w={136} h={84} t={t + r} r={10} k={1.25} /></div>
        <div style={{ width: 380, borderRight: `2px solid ${GRID}`, padding: "34px 20px", ...inter(48, INK, 500) }}>{car}</div>
        <div style={{ width: 260, borderRight: `2px solid ${GRID}`, padding: "34px 20px", position: "relative", ...inter(48, INK, r === 2 ? 700 : 500) }}>{note}
          {r === 2 && hi > 0 && <div style={{ position: "absolute", inset: -2, border: `5px solid ${SEL}`, opacity: hi }} />}</div>
        <div style={{ width: 150, display: "grid", placeItems: "center", ...inter(72, GREY, 500), position: "relative" }}>{st && <span style={{ display: "inline-block", transform: `rotateY(${star * 180}deg) scale(${1 + 0.3 * Math.sin(star * Math.PI)})` }}>{st}</span>}</div>
      </div>
    ))}
    {children}
  </div>
);
// a fingertip that rises from the bottom edge to (x,y)
const Finger = ({ x, y, p }) => (
  <div style={{ position: "absolute", left: x - 55, top: lerp(1960, y - 20, p), width: 110, height: 520, borderRadius: "55px 55px 30px 30px", background: "linear-gradient(90deg, #C98F6E, #E7B595 45%, #D09A78)", boxShadow: "0 20px 40px rgba(0,0,0,.25)", zIndex: 60 }}>
    <div style={{ position: "absolute", left: 22, top: 14, width: 66, height: 80, borderRadius: "33px 33px 20px 20px", background: "rgba(255,235,225,.75)" }} />
  </div>
);
// the earlier repair photo (drawn: dark garage, the old mirror with grey glass)
const OldPhoto = ({ w, h, t }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "radial-gradient(120% 90% at 40% 40%, #4A4440, #1A1817)" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.04 + 0.02 * Math.sin(t * 0.5)})` }}><Mirror x={w * 0.5} y={h * 0.5} w={w * 0.7} oldGlass={1} /></div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,200,140,.22), rgba(0,0,0,0) 55%)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 80px rgba(0,0,0,.5)" }} />
  </div>
);
// the housing work photo: the real car's passenger mirror, close
const HousingPhoto = ({ w, h, t, k = 2.3 }) => (
  <Thumb id="K1-15" w={w} h={h} t={t} r={0} fx={0.66} fy={0.32} k={k}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,214,170,.18), rgba(0,0,0,.1))" }} />
  </Thumb>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    no: at("no,"), mirror: at("mirror"), okay: at("okay,"), first: at("first"), glass: at("glass"), changed: at("changed."), housing: at("housing"), cracked: at("cracked"),
    and: at("and"), star: at("star"), which: at("which?"), honestly: at("honestly,"), explain: at("explain"), heres: at("here's"), entry: at("entry,"), photo: at("photo."),
    oh: at("oh,"), passenger: at("passenger"), len: at("len"), fitted: at("fitted"), yep: at("yep."), sheet: at("sheet"), still: at("still"), collection: at("collection."),
    good: at("good."), read: at("read"), story: at("story."), cta: tl.cta("comment") ?? at("comment"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [2] : [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Second / mirror repair.", T.no), [at("second"), T.mirror, at("repair,")]), key: [1, 2], hold: 0.4 },
    { ...fx(B("First / time?", T.first), [T.first, at("time?")]), key: [0], hold: 0.5 },
    { ...fx(B("Glass. Then / housing.", T.glass), [T.glass, at("then"), T.housing]), key: [2], hold: 0.5 },
    { ...fx(B("And the / star?", T.and), [T.and, T.star - 0.2, T.star]), key: [2], hold: 0.5 },
    { ...fx(B("Passenger / side.", T.passenger), [T.passenger, at("side.")]), key: [0], hold: 0.6 },
    { ...fx(B("The sheet / still tracks.", T.sheet), [T.sheet - 0.2, T.sheet, T.still, at("tracks")]), key: [2], hold: 0.5 },
    { ...ctaHead(tl, "Comment / BUILD", T.cta), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. the sheet on the laptop; fingertip to M2 (hook)
  const sheetHook = (t) => {
    const d = drift(t, "sh", 3, 0.3);
    const fp = EASE.camera(seg(t, 0.2, 1.6)) * (1 - ez(t, T.no - 0.6, 0.4, EASE.in));
    const hi = ez(t, 1.4, 0.3);
    const push = EASE.in(seg(t, T.no - 0.7, T.no));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.7 * push})`, transformOrigin: "672px 1073px" }}>
      <div style={{ position: "absolute", left: 30, top: 620, width: 1020, height: 790, borderRadius: 36, background: "#1C1C1E", boxShadow: "0 40px 60px -30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 30, top: 1410, width: 1020, height: 40, borderRadius: "0 0 40px 40px", background: "linear-gradient(180deg, #C7CACF, #9EA2A8)" }} />
      <Sheet t={t} x={60} y={650} s={0.92 + 0.015 * Math.sin(t * 0.6)} hi={hi} origin="0 0" />
      <Finger x={672} y={1090} p={fp} />
      <Ripple t={t} t0={1.45} x={672} y={1073} />
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the M2 cell, stretched: mirror inside; corner fold reveals the old photo
  const cell = (t) => {
    const d = drift(t, "ce", 3, 0.3);
    const st = EASE.camera(seg(t, T.no - 0.1, T.mirror + 0.4));
    const mirrorIn = spr(t - (T.mirror - 0.1), 180, 15);
    const pips = [at("second"), at("repair,")].map((tt) => spr(t - tt, 220, 14));
    const fold = EASE.io(seg(t, T.okay - 0.1, T.first));
    const w = lerp(300, 960, st), h = lerp(128, 560, st);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {/* the neighbouring grid lines keep the sheet context */}
      <div style={{ position: "absolute", left: -40, right: -40, top: 1100 - h / 2 - 2, height: 2, background: GRID }} />
      <div style={{ position: "absolute", left: -40, right: -40, top: 1100 + h / 2, height: 2, background: GRID }} />
      <div style={{ position: "absolute", left: 540 - w / 2, top: 1100 - h / 2, width: w, height: h, background: "#fff", border: `5px solid ${SEL}`, boxShadow: "0 30px 50px -30px rgba(0,0,0,.3)", overflow: "hidden" }}>
        {/* under the fold: the earlier repair photo */}
        <div style={{ position: "absolute", right: 0, top: 0, width: 560, height: 420, clipPath: `polygon(${100 - 100 * fold}% 0, 100% 0, 100% ${100 * fold}%)` }}><OldPhoto w={560} h={420} t={t} /></div>
        <div style={{ position: "absolute", left: lerp(110, 40, st), top: lerp(30, 36, st), ...inter(lerp(44, 72, st), INK, 700) }}>M2</div>
        <div style={{ position: "absolute", left: 40, top: 140, opacity: clamp(mirrorIn * 2), transform: `scale(${0.8 + 0.2 * clamp(mirrorIn)}) rotate(${(1 - clamp(mirrorIn)) * -8}deg)`, transformOrigin: "200px 140px" }}>
          <div style={{ position: "relative", width: 440, height: 300 }}><Mirror x={220} y={150} w={420} glint={(t * 0.4) % 1} /></div></div>
        <div style={{ position: "absolute", left: 520, top: 210, display: "flex", gap: 22, opacity: 1 - fold }}>
          {pips.map((p, i) => <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: i ? RED : "#E5E5EA", display: "grid", placeItems: "center", ...inter(60, i ? "#fff" : INK, 700), transform: `scale(${clamp(p)})` }}>{i + 1}</div>)}
        </div>
        {/* the folding corner itself (paper back) */}
        {fold > 0.01 && <div style={{ position: "absolute", right: 0, top: 0, width: 560 * fold, height: 420 * fold, background: "linear-gradient(225deg, #fff 0 48%, #E3E6EA 50%, #F4F5F7 100%)", clipPath: "polygon(0 0, 100% 100%, 0 100%)", boxShadow: "0 0 20px rgba(0,0,0,.2)", transform: "translate(0,0)" }} />}
      </div>
      <div style={{ position: "absolute", left: 540 + w / 2 + 30, top: 1100 - 60, opacity: 1 - st }}><Thumb id="K1-15" w={150} h={100} t={t} r={12} k={1.2} /></div>
      <div style={{ position: "absolute", left: 60, top: 1100 + h / 2 + 50, opacity: st * (1 - fold * 0.6), ...land(t, T.mirror + 0.3) }}><Thumb id="K1-15" w={300} h={170} t={t} r={18} k={1.15} /></div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. exploded mirror: glass changed, then the housing cracked
  const explode = (t) => {
    const d = drift(t, "ex", 3, 0.3);
    const gOut = EASE.io(seg(t, T.glass - 0.05, T.changed));
    const swap = seg(t, T.changed - 0.05, T.changed + 0.25);
    const gIn = EASE.io(seg(t, T.changed + 0.2, T.changed + 0.7));
    const cam = EASE.camera(seg(t, T.housing - 0.4, T.housing + 0.3));
    const crack = ez(t, T.cracked - 0.05, 0.35, EASE.out);
    const shake = t > T.cracked && t < T.cracked + 0.3 ? Math.sin(t * 90) * 6 * (1 - (t - T.cracked) / 0.3) : 0;
    const gx = swap < 1 ? -380 * gOut : -380 * (1 - gIn);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateX(${lerp(120, -60, cam) + shake}px) scale(${lerp(1, 1.12, cam)})`, transformOrigin: "640px 1100px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}><Mirror x={600} y={1080} w={820} glassX={gx} glassY={-40 * (swap < 1 ? gOut : 1 - gIn)} oldGlass={swap < 0.5 ? 1 : 0} crack={crack} glint={(t * 0.35) % 1} /></div>
    </div>
      <div style={{ position: "absolute", left: 200, top: 1440, padding: "14px 26px", borderRadius: 28, ...CARD, ...land(t, T.changed + 0.1) }}><span style={inter(44, INK, 650)}>New glass</span><span style={inter(42, GREY, 500)}>  · Fenwick Glass</span></div>
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. the star cell hinges; the work photo grows out of it
  const starShot = (t) => {
    const d = drift(t, "st", 3, 0.3);
    const hinge = EASE.io(seg(t, T.star, T.which + 0.3)) + EASE.io(seg(t, T.which + 0.5, T.which + 1.1));
    const grow = EASE.camera(seg(t, T.explain - 0.5, T.heres - 0.1));
    const x0 = 820, y0 = 1110;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.5, 1.2, ez(t, T.and - 0.1, 1.2, EASE.camera))})`, transformOrigin: `${x0}px ${y0}px`, opacity: 1 - 0.5 * grow }}>
        <Sheet t={t} x={60} y={600} s={1} hi={1} star={hinge} />
      </div>
      {/* the photo grows out of the star cell */}
      {grow > 0.01 && <div style={{ position: "absolute", left: lerp(x0 - 60, 100, grow), top: lerp(y0 - 50, 620, grow), width: lerp(120, 880, grow), height: lerp(100, 600, grow), borderRadius: lerp(10, 26, grow), overflow: "hidden", boxShadow: "0 30px 50px -24px rgba(0,0,0,.45)" }}>
        <HousingPhoto w={lerp(120, 880, grow)} h={lerp(100, 600, grow)} t={t} /></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 5. the build entry settles around the fixed photo
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    const rec = ez(t, T.heres - 0.1, 0.7, EASE.camera);
    const ring = ez(t, T.passenger - 0.2, 0.6, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: 1000, ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· Owen's green coupe</span></div>
        <div style={{ position: "absolute", left: lerp(40, 40, rec), top: lerp(100, 110, rec), width: 880, height: lerp(600, 520, rec), borderRadius: 26, overflow: "hidden" }}>
          <HousingPhoto w={880} h={lerp(600, 520, rec)} t={t} />
          <svg width={880} height={520} style={{ position: "absolute", inset: 0 }}><ellipse cx={440} cy={200} rx={150} ry={120} fill="none" stroke={RED} strokeWidth={7} strokeDasharray="900" strokeDashoffset={900 * (1 - ring)} /></svg>
          <Sweep t={t} w={880} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 660, ...land(t, T.entry) }}><div style={inter(56, INK, 700)}>Passenger mirror housing</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Sep 17, 2025</span><span style={inter(42, GREY, 500)}>Reed Hollow Auto</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 840, padding: "14px 22px", borderRadius: 30, background: "#F2F2F5", ...land(t, T.len) }}><Who ch="L" name="Len" role="fitted it" bg="#5E5CE6" size={60} /></div>
        <div style={{ position: "absolute", left: 40, top: 950, ...inter(42, GREY, 500), ...land(t, T.photo) }}>Earlier: glass replaced · Fenwick Glass</div>
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 6. pull back: the sheet keeps the overview, the entry tells the story
  const both = (t) => {
    const d = drift(t, "bo", 3, 0.3);
    const p = EASE.camera(seg(t, T.yep - 0.2, T.sheet + 0.4));
    const link = ez(t, T.still, 0.6, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: lerp(-200, 40, p), top: 640, width: 560, ...CARD, borderRadius: 20, overflow: "hidden", opacity: clamp(p * 1.5), boxShadow: "0 0 0 2px " + GRID + ", 0 30px 50px -30px rgba(0,0,0,.35)" }}>
        {ROWS.map(([id, car, note], r) => <div key={r} style={{ display: "flex", alignItems: "center", gap: 16, height: 112, padding: "0 18px", borderBottom: `2px solid ${GRID}`, background: r === 2 ? rgba(SEL, 0.08) : "#fff" }}>
          <Thumb id={id} w={120} h={76} t={t + r} r={10} k={1.25} /><span style={inter(44, INK, r === 2 ? 700 : 500)}>{note}</span></div>)}
        <Sweep t={t} w={560} o={0.5} />
      </div>
      <div style={{ position: "absolute", left: lerp(60, 520, p), top: lerp(520, 980, p), width: 960, transform: `scale(${lerp(1, 0.54, p)})`, transformOrigin: "0 0", ...CARD, overflow: "hidden", height: 1080 }}>
        <div style={{ position: "absolute", left: 40, top: 40, width: 880, height: 590, borderRadius: 26, overflow: "hidden" }}><HousingPhoto w={880} h={520} t={t} /></div>
        <div style={{ position: "absolute", left: 40, top: 660, ...inter(78, INK, 700) }}>Passenger mirror</div>
        <div style={{ position: "absolute", left: 40, top: 770, ...inter(78, RED, 650) }}>Sep 17, 2025</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d="M 330 1000 C 430 1000 460 1100 520 1120" fill="none" stroke={SEL} strokeWidth={5} strokeDasharray="8 10" opacity={link} />
      </svg>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 7. the real car; the passenger mirror carries a sliver of grid. CTA over it
  const car = (t, end) => {
    const d = drift(t, "car" + (end ? "e" : ""), 3, 0.3);
    const ring = end ? 1 : ez(t, T.read - 0.3, 0.6, EASE.io);
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const cellIn = end ? spr(t - (T.cta + 0.6), 170, 16) : 0;
    const refold = end ? EASE.io(seg(t, tl.last - 1.2, tl.last - 0.2)) : 0;
    const push = end ? 0 : EASE.camera(seg(t, T.good - 0.2, T.story));
    const cx = 540, cy = 1170, w = 1040, mx = cx + 166, my = cy - 81;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${(1 + 0.12 * push) * (1 - 0.06 * ctaP)})`, transformOrigin: `${mx}px ${my}px` }}>
      <Cut id="K1-15" cx={cx} cy={cy} w={w} shadow={0.4} />
      {/* a sliver of grid in the mirror glass */}
      <div style={{ position: "absolute", left: mx - 26, top: my - 14, width: 48, height: 30, borderRadius: 10, overflow: "hidden", opacity: 0.55 + 0.25 * Math.sin(t * 2) }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GRID} 2px, transparent 2px), linear-gradient(90deg, ${GRID} 2px, transparent 2px)`, backgroundSize: "12px 10px", transform: `translateX(${(t * 6) % 12}px)` }} /></div>
      <div style={{ position: "absolute", left: mx - 80, top: my - 80, width: 160, height: 160, borderRadius: 80, border: `7px solid ${RED}`, transform: `scale(${0.6 + 0.4 * ring})`, opacity: ring * (end ? 0.7 : 1), boxShadow: `0 0 0 ${10 + 4 * Math.sin(t * 4)}px ${rgba(RED, 0.15)}` }} />
      {end && cellIn > 0.01 && <div style={{ position: "absolute", left: 90, top: 1460, height: 116, display: "flex", alignItems: "center", background: "#fff", border: `5px solid ${SEL}`, padding: "0 30px", gap: 22, overflow: "hidden", width: lerp(lerp(160, 900, clamp(cellIn)), 160, refold), opacity: clamp(cellIn * 2), boxShadow: "0 20px 30px -20px rgba(0,0,0,.35)" }}>
        <span style={inter(56, INK, 700)}>M2</span>
        <span style={{ ...inter(46, GREY, 500), opacity: 1 - refold }}>= passenger mirror housing</span></div>}
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: sheetHook },
    { at: T.no - 0.1, render: cell, enter: { kind: "match" } },
    { at: T.glass - 0.15, render: explode, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.and - 0.12, render: starShot, enter: { kind: "rise", d: 0.5 } },
    { at: T.heres - 0.05, render: entry, enter: { kind: "match" } },
    { at: T.yep - 0.15, render: both, enter: { kind: "pull", d: 0.6, rect: { x: 520, y: 980, w: 518, h: 583 } } },
    { at: T.good - 0.12, render: (t) => car(t, false), enter: { kind: "portal", d: 0.6, rect: { x: 560, y: 1040, w: 200, h: 120 }, r: 30 } },
    { at: T.cta - 0.12, render: (t) => car(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.3, "tap"], [1.45, "tap"], [T.no - 0.3, "portal"], [T.mirror - 0.1, "pop-soft"], [T.okay - 0.1, "card-fold"], [T.glass - 0.2, "whoosh"], [T.changed, "ceramic"],
    [T.cracked, "plate-rub"], [T.star, "tick-soft"], [T.explain - 0.4, "slide-soft"], [T.heres, "card-settle"], [T.len, "pop-soft"], [T.yep - 0.2, "whoosh"],
    [T.good - 0.3, "portal"], [ctaT, "cta-pop"], [tl.last - 1.0, "card-fold"],
  ];
  const music = { bpm: 104, root: 55, mode: "major", style: "warm", cut: T.heres - 0.3, ret: T.yep - 0.15 };
  return { shots, heads, sfx, music };
}
