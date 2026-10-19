// @ts-nocheck
// LB-10 (lane B, everyone): "That isn't the packaging" (ChatGPT concept and script, Claude build). During a garage
// cleanout Omar nearly recycles a box: a bracket slides out with a fitting note. It looks like spare metal, but something
// made him keep its note. Before deciding he checks the work behind his alternator swap: what came off, without making
// another mystery box. The entry explains why he kept the bracket: it's the original mount from the old setup. He keeps
// bracket and note together, adds their photo to the log, and only the empty carton gets recycled. DONE-FOR-YOU CTA
// ("Comment BUILD"). Hook A only.
// Device (reserved): apparently empty packaging revealing a retained original. The cardboard sleeve tips over the blue
// recycling tote; the bracket catches the lip; at the end the sleeve, now empty, flattens and drops into the tote.
// Car: A26 coupe graded burgundy (unbadged; the script's touring coupe), engine bay G12. Drawn: sleeve, tote, bracket,
// fitting note, tray, mystery box, zip bag. Fictional: Omar, West Fen Auto, Aven Coil (alternator brand).
// Transitions: bracket catch (hook), slide onto the mat (match), note unfolds around the bracket (in shot), tray edge back
// to the sleeve (whip), bracket rotates into the photo's angle (match), photo opens into the entry (rise), photo edge
// back to the bench (match), carton drops into the tote under the CTA.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep, Thumb } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.5;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A26", "G12"];
const HOOKS = { A: "What's / inside?", B: "Keep or / recycle?", C: "Not / empty." };
const BURG = { filter: "saturate(.75) brightness(.62) hue-rotate(-12deg)" };
const CARD_BOARD = ["#D9B98C", "#B8935F"];

const Bracket = ({ x, y, s = 1, rot = 0, o = 1 }) => o <= 0.01 ? null : (
  <svg width={300 * s} height={220 * s} viewBox="0 0 300 220" style={{ position: "absolute", left: x - 150 * s, top: y - 110 * s, overflow: "visible", transform: `rotate(${rot}deg)`, opacity: o, zIndex: 25 }}>
    <defs><linearGradient id="br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6A7078" /><stop offset="1" stopColor="#2F3338" /></linearGradient></defs>
    <path d="M 20 40 Q 20 20 40 20 L 200 20 Q 220 20 220 40 L 220 120 L 280 140 Q 296 146 290 162 L 276 196 Q 270 210 254 206 L 180 180 Q 160 174 160 154 L 160 80 L 40 80 Q 20 80 20 60 Z" fill="url(#br)" stroke="#1E2125" strokeWidth={3} />
    {[[60, 50], [130, 50], [250, 176]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11} fill="#16181B" stroke="#8C9399" strokeWidth={2} />)}
    <path d="M 30 26 L 210 26" stroke="rgba(255,255,255,.25)" strokeWidth={3} />
  </svg>
);
const Note = ({ x, y, open = 1, rot = 0, o = 1, w = 520 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 300, transformOrigin: "50% 0", transform: `rotate(${rot}deg) perspective(1000px) rotateX(${(1 - open) * 80}deg)`, opacity: o, background: "#FFFDF4", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", padding: "18px 24px", zIndex: 20 }}>
    <div style={{ fontFamily: "Caveat", fontSize: 58, fontWeight: 700, color: INK, lineHeight: 1.05 }}>Original mount.</div>
    <div style={{ fontFamily: "Caveat", fontSize: 50, fontWeight: 600, color: INK, lineHeight: 1.05 }}>Keep with old setup.</div>
    <div style={{ fontFamily: "Caveat", fontSize: 44, fontWeight: 600, color: GREY, marginTop: 8 }}>West Fen Auto</div>
  </div>
);
const Tote = ({ x, y, w = 520 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.62 }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)", background: "linear-gradient(180deg, #2F6FD6, #1F4FA6)" }} />
    <div style={{ position: "absolute", left: -10, right: -10, top: -10, height: 26, borderRadius: 8, background: "#2A62C2" }} />
    <svg width={90} height={90} viewBox="0 0 90 90" style={{ position: "absolute", left: w / 2 - 45, top: w * 0.2 }}><path d="M 45 12 L 60 38 M 45 12 L 30 38 M 18 58 L 72 58 M 18 58 L 30 38 M 72 58 L 60 38" stroke="rgba(255,255,255,.7)" strokeWidth={7} fill="none" strokeLinecap="round" /></svg>
  </div>
);
const Sleeve = ({ x, y, rot = 0, flat = 0, o = 1 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 460, height: lerp(260, 40, flat), transformOrigin: "100% 50%", transform: `rotate(${rot}deg)`, opacity: o, zIndex: 30 }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${CARD_BOARD[0]}, ${CARD_BOARD[1]})`, borderRadius: 6, boxShadow: "0 16px 24px -12px rgba(0,0,0,.4)" }} />
    {flat < 0.5 && <div style={{ position: "absolute", left: 0, top: 20, width: 40, height: 220, background: "#6E5434", borderRadius: "6px 0 0 6px" }} />}
    <div style={{ position: "absolute", right: 40, top: "40%", width: 120, height: 10, background: "rgba(0,0,0,.15)" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    cleaning: at("cleaning"), bracket: at("bracket"), slides: at("slides"), note: at("note."), box: at("box"), empty: at("empty."), looks: at("looks"), keep: at("keep"),
    before: at("before"), checks: at("checks"), swap: at("swap."), what: at("what"), mystery: at("mystery"), box2: at("box", 2), entry: at("entry"), kept: at("kept"),
    original: at("original"), mount: at("mount"), setup: at("setup."), so: at("so"), together: at("together,"), adds: at("adds"), log: at("log."), carton: at("carton"),
    recycled: at("recycled."), stays: at("stays"), cta: tl.cta("comment") ?? at("comment"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook] ?? HOOKS.A, 0), key: [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Not / empty.", T.box), [T.box + 0.1, T.empty]), key: [1], hold: 0.4 },
    { ...fx(B("Why was / it kept?", T.looks), [at("something"), at("made"), T.keep]), key: [2], hold: 0.4 },
    { ...fx(B("No mystery / box.", T.mystery), [at("not"), T.mystery, T.box2]), key: [2], hold: 0.5 },
    { ...fx(B("Original / mount.", T.original), [T.original, T.mount]), key: [1], hold: 0.5 },
    { ...fx(B("Carton out. / Part kept.", T.carton), [at("empty", 2), T.carton, T.recycled - 0.2, T.recycled]), key: [3], hold: 0.5 },
    { ...ctaHead(tl, "Comment / BUILD", T.cta), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Bench = ({ t, d, children, car = 1 }) => (
    <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {car > 0 && <div style={{ position: "absolute", left: 0, top: 0, filter: "blur(4px)", opacity: 0.8 * car }}><Cut id="A26" cx={760} cy={720} w={620} shadow={0.2} style={BURG} /></div>}
      <div style={{ position: "absolute", left: -40, right: -40, top: 1180, height: 760, background: "linear-gradient(180deg, #A88660, #8C6E4E)" }} />
      <div style={{ position: "absolute", left: 120, top: 1220, width: 840, height: 300, borderRadius: 18, background: "#2E3135", boxShadow: "inset 0 0 0 4px #3C4045" }} />
      {children}
    </div></Studio></AbsoluteFill>
  );
  // ---------------------------------------------------------------- 1. hook: sleeve tips over the tote; bracket catches the lip
  const hookShot = (t) => {
    const d = drift(t, "hk", 3, 0.3);
    const tip = EASE.io(seg(t, 0.2, 1.3));
    const peek = EASE.out(seg(t, 1.0, 1.7));
    const knock = t > 1.7 && t < 2.2 ? Math.sin((t - 1.7) * 40) * 6 * (1 - (t - 1.7) / 0.5) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1420, height: 500, background: "#CFC8BC" }} />
      <Tote x={280} y={1180} w={520} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${knock * 0.3}deg)`, transformOrigin: "760px 900px" }}>
        <Sleeve x={300} y={780} rot={-28 * tip} />
        <Bracket x={lerp(380, 300, peek)} y={lerp(900, 980, peek) + knock} s={1.2} rot={-28 * tip - 12} o={peek > 0.01 ? 1 : 0} />
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the bench: bracket slides out, note unfolds; tray; pause
  const bench = (t) => {
    const d = drift(t, "be", 3, 0.3);
    const slide = EASE.camera(seg(t, T.slides - 0.2, T.slides + 0.6));
    const note = EASE.io(seg(t, at("with") - 0.1, T.note + 0.4));
    const tray = spr(t - (T.looks - 0.2), 170, 16);
    const toward = EASE.io(seg(t, T.looks, at("metal,"))) * (1 - EASE.io(seg(t, T.keep - 0.3, T.keep + 0.3)));
    return <Bench t={t} d={d}>
      <Sleeve x={-120} y={1010} rot={0} />
      <Bracket x={lerp(200, 420, slide) + 260 * toward} y={1370 - 30 * toward} s={1.3} rot={lerp(-20, 0, slide) + 10 * toward} />
      <Note x={lerp(120, 480, note)} y={lerp(1180, 1240, note)} open={note} rot={4} o={clamp(note * 3)} w={480} />
      {tray > 0.01 && <div style={{ position: "absolute", left: lerp(1100, 690, clamp(tray)), top: 1040, width: 330, height: 140, borderRadius: 14, background: "linear-gradient(180deg, #6E747B, #4A4F55)", boxShadow: "0 14px 22px -12px rgba(0,0,0,.5)" }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 60, top: 40 + (i % 2) * 30, width: 40, height: 14, borderRadius: 4, background: "#9EA4AA", transform: `rotate(${i * 30}deg)` }} />)}</div>}
    </Bench>;
  };
  // ---------------------------------------------------------------- 3. the engine-bay photo; the bracket turns to the photo's angle; the mystery box slides off
  const photo = (t) => {
    const d = drift(t, "ph", 3, 0.3);
    const ph = spr(t - (T.checks - 0.2), 160, 16);
    const align = EASE.io(seg(t, T.what - 0.1, at("off,")));
    const box = spr(t - (T.mystery - 0.3), 180, 15) * (1 - EASE.in(seg(t, T.box2 + 0.2, T.box2 + 0.9)));
    const rec = ez(t, T.entry - 0.2, 0.7, EASE.camera);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 60, top: 580, width: 960, height: lerp(1000, 1000, rec), ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· Omar's coupe</span></div>
        <div style={{ position: "absolute", left: lerp(20, 40, rec), top: lerp(40, 110, rec), width: lerp(920, 880, rec), height: lerp(620, 460, rec), borderRadius: 26, overflow: "hidden", opacity: clamp(ph * 2), transform: `rotate(${(1 - rec) * -2}deg)` }}>
          <Thumb id="G12" w={lerp(920, 880, rec)} h={lerp(620, 460, rec)} t={t} r={0} fx={0.35} fy={0.45} k={1.12} />
          <div style={{ position: "absolute", left: "26%", top: "34%", width: 180, height: 140, borderRadius: 90, border: `6px solid ${RED}`, opacity: ez(t, T.swap - 0.2, 0.5) }} /></div>
        <div style={{ position: "absolute", left: 40, top: 610, ...land(t, T.entry) }}><div style={inter(54, INK, 700)}>Alternator changed</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>May 21, 2022</span><span style={inter(42, GREY, 500)}>Alternator · Aven Coil</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 780, padding: "12px 22px", borderRadius: 30, background: "#F2F2F5", ...land(t, T.kept - 0.2) }}><Who ch="W" name="West Fen Auto" bg="#8E5A3C" size={56} /></div>
        <div style={{ position: "absolute", left: 40, top: 880, ...inter(44, INK, 600), ...land(t, T.original - 0.1) }}>Original mount retained with old setup</div>
      </div>
      <div style={{ opacity: 1 - rec }}><Bracket x={lerp(780, 400, align)} y={lerp(1400, 900, align)} s={lerp(1.1, 0.8, align)} rot={lerp(25, -8, align)} /></div>
      {box > 0.01 && <div style={{ position: "absolute", left: lerp(640, 1300, EASE.in(seg(t, T.box2 + 0.2, T.box2 + 0.9))), top: 1300, width: 260, height: 200, background: `linear-gradient(180deg, ${CARD_BOARD[0]}, ${CARD_BOARD[1]})`, borderRadius: 6, display: "grid", placeItems: "center", transform: `scale(${clamp(box)}) rotate(4deg)`, boxShadow: "0 16px 24px -12px rgba(0,0,0,.4)" }}><span style={{ ...inter(120, "#6E5434", 700) }}>?</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. keep together, photo to the log; the empty carton into the tote (and CTA)
  const keepShot = (t, end) => {
    const d = drift(t, "ke" + (end ? "e" : ""), 3, 0.3);
    const bag = end ? 1 : EASE.camera(seg(t, at("keeps") - 0.1, T.together + 0.3));
    const snap = end ? 0 : (t > T.adds && t < T.adds + 0.35 ? 1 - (t - T.adds) / 0.35 : 0);
    const drop = end ? 1 : EASE.in(seg(t, T.carton - 0.2, T.recycled + 0.3));
    const flat = end ? 1 : EASE.io(seg(t, T.carton - 0.4, T.carton));
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1100px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, filter: "blur(3px)", opacity: 0.85 }}><Cut id="A26" cx={720} cy={700} w={640} shadow={0.2} style={BURG} /></div>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1180, height: 760, background: "linear-gradient(180deg, #A88660, #8C6E4E)" }} />
      <Tote x={620} y={1200} w={380} />
      {/* bracket + note in a clear zip bag */}
      <div style={{ position: "absolute", left: 110, top: 1010, width: 500, height: 440, borderRadius: 18, border: `4px solid rgba(255,255,255,${0.8 * bag})`, background: `rgba(220,235,245,${0.35 * bag})`, boxShadow: bag > 0.5 ? "0 18px 30px -16px rgba(0,0,0,.45)" : "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 8, background: `rgba(30,80,200,${0.6 * bag})` }} />
        <Note x={30} y={70} rot={-3} w={440} />
        <Bracket x={300} y={300} s={1.1} rot={-6} />
      </div>
      <Sleeve x={lerp(560, 640, drop)} y={lerp(960, 1260, drop)} rot={lerp(0, 70, drop)} flat={flat} o={1 - ez(t, T.recycled + 0.2, 0.3) * (end ? 1 : 1)} />
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: snap * 0.8, pointerEvents: "none" }} />
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: hookShot },
    { at: T.cleaning - 0.1, render: bench, enter: { kind: "match" } },
    { at: T.checks - 0.2, render: photo, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.so - 0.12, render: (t) => keepShot(t, false), enter: { kind: "match" } },
    { at: T.cta - 0.1, render: (t) => keepShot(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.3, "paper-flutter"], [1.7, "clunk"], [T.slides - 0.2, "slide-soft"], [T.note - 0.2, "paper-unfold"], [T.looks - 0.2, "caster-roll"], [T.keep - 0.3, "muted-stop"],
    [T.checks - 0.3, "whip"], [T.swap - 0.2, "draw"], [T.what - 0.1, "creak-soft"], [T.mystery - 0.3, "pop-soft"], [T.box2 + 0.2, "whoosh"], [T.entry - 0.2, "card-settle"],
    [T.original - 0.1, "tick-soft"], [at("keeps") - 0.1, "string-zip"], [T.adds, "shutter"], [T.carton - 0.4, "paper-thud"], [T.recycled, "clunk", 0.6], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 52, mode: "major", style: "warm", cut: T.entry - 0.3, ret: T.so - 0.12 };
  return { shots, heads, sfx, music };
}
