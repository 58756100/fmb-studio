// @ts-nocheck
// S0-02 (lane 0, collectors): "The Wall of Sharpie". For forty years Ed (E09) has written every job on his '69 Camaro
// (A20) in Sharpie on the garage wall; it's the only copy, and Mom finally won: Saturday it gets painted. Ed says he'll
// remember, but won't explain one line, "'92 DON'T". Joan's forty photos of the wall are useless (good luck finding the
// four-speed in a camera roll). So every line went onto the Camaro's page with its real date from 1986; Ed corrects her
// spelling of Muncie; Saturday the roller covers every date and it doesn't matter. "Fine. Ninety-two. I did the timing
// myself... at night." "Logged." On the fresh white wall Ed writes the first new line.
// Device: ink migration. The handwriting lifts off the wall stroke by stroke and settles as typed lines on a frameless
// white card in front of the wall; the wall goes pale where the ink has left; the roller paints over it all except '92.
// Look: warm night garage wall (plaster #EAE3D3), black Sharpie in Caveat, the hugger-orange Camaro, one red accent.
// Transitions: one lateral camera track along the wall (hook and setup), push into '92, cut to Ed's face, flash cuts
// (each flash prints a photo onto the pile), zoom-out to the whole wall for the migration, the roller as an object wipe
// in long strokes, the '92 ink lifts last, back to the hook framing on the fresh white wall for the CTA (loop).
// remocn (ported): stroke reveal (Sharpie writing), focus-blur-resolve (ink lift), strikethrough-replace (Munsie ->
// Muncie), period-drop. New vs S0-06: handwriting-to-type migration with matched positions.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed } from "../kit";
import { Full, Haze, font } from "./s0kit";

export const HOOK_WORDS = 14;
export const HOOK_PAD = { B: 0 };
export const TAIL = 1.0;
export const LIFE = 1.2;
export const BG = "#EAE3D3";
export const TEXT = { font: "Inter", weight: 700, size: 104, min: 74, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["A20", "E09", "F02"];
const SH = { fontFamily: "Caveat", fontWeight: 700, color: "#1B1B1F", whiteSpace: "nowrap", lineHeight: 1 };
// the wall, in world px (z = 1 matches the screen); WALLW wide; lines in Caveat 84 px
const WALLW = 1960, FLOOR = 1300;
const L = [
  { k: "86", s: "'86 bought her $3,800", x: 80, y: 600, r: -3 },
  { k: "89", s: "'89 new carb", x: 820, y: 540, r: 2 },
  { k: "92", s: "'92 DON'T", x: 1180, y: 700, r: -4, under: true },
  { k: "94", s: "'94 350 rebuild", x: 1460, y: 560, r: 3 },
  { k: "98", s: "'98 brakes", x: 140, y: 860, r: 2 },
  { k: "03", s: "'03 paint", x: 640, y: 800, r: -2 },
  { k: "11", s: "'11 Muncie 4-spd", x: 1020, y: 950, r: 1 },
  { k: "17", s: "'17 tires", x: 1640, y: 880, r: -3 },
];
const TALLY = [[460, 980], [1700, 1040], [300, 1040], [1300, 560]];
const ROWS = [["86", "Jun 1986", "Bought her"], ["94", "1994", "350 rebuild"], ["03", "2003", "Paint"], ["11", "2011", "Munsie 4-speed"]];

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    every: at("every", 1), mom: at("mom"), sat: at("saturday", 1), its: at("it's"), joanie: at("joanie."), ill: at("i'll"), rem: at("remember."), okay: at("okay,"), then: at("then", 1),
    this: at("this"), n92: at("ninety-two,"), says: at("says"), dont: at("'don't.'"), im: at("...i'm"), so1: at("so", 2), photo: at("photographed"), then2: at("then", 2), roll: at("roll."),
    forty: at("forty"), good: at("good"), so3: at("so", 3), line: at("line"), page: at("page"), real: at("real"), starting: at("starting"), eighty: at("eighty-six."),
    you: at("you", 2), muncie: at("muncie"), fix: at("fix"), sat2: at("saturday", 2), roller: at("roller"), honestly: at("honestly,"), matter: at("matter."), fine: at("fine."),
    n92b: at("ninety-two", 2), timing: at("timing"), night: at("night."), logged: at("logged."), put: tl.cta("put") ?? at("put"),
  };
  const ED = T.im - 0.25, PH = T.so1 - 0.2, TURN = T.so3 - 0.25;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["40", hw[3].s], ["years", hw[4].s], ["of", hw[5].s], ["a", hw[6].s], ["Camaro.", hw[8].s]], { key: [4], hold: 0.3 }), W_([["The", hw[11].s], ["only", hw[12].s], ["copy.", hw[13].s]], { key: [1, 2] })]
    : hook === "B" ? [W_([["Wait.", hw[0].s], ["Not", hw[1].s], ["that", hw[2].s], ["wall.", hw[3].s]], { key: [3] })]
    : [W_([["First", hw[1].s], ["date:", hw[2].s], ["1986.", hw[7].s]], { key: [2] })];
  hk[hk.length - 1].exit = { at: T.every - 0.1, mode: "up" };
  const heads = [
    ...hk,
    W_([["Painting:", T.sat - 0.35], ["Saturday.", T.sat]], { key: [1], hold: 0.8 }),
    W_([["“I'll", T.ill], ["remember.”", T.rem]], { hold: 0.7 }),
    W_([["“'92:", T.n92], ["don't.”", T.dont]], { key: [1], hold: 0.7 }),
    W_([["40", T.forty], ["photos.", at("photos")]], { hold: 0.5 }),
    W_([["Good", T.good], ["luck.", at("luck.")]], { key: [1], hold: 0.4 }),
    W_([["Every", at("every", 2)], ["line,", T.line], ["its", at("its", 2)], ["real", T.real], ["date.", at("date,", 1)]], { key: [3, 4], hold: 1.8 }),
    W_([["“You", T.you], ["spelled", at("spelled")], ["Muncie", T.muncie], ["wrong.”", at("wrong.")]], { key: [2], hold: 0.6 }),
    W_([["It", at("it", 5)], ["didn't", at("didn't")], ["matter.", T.matter]], { key: [2], hold: 0.4 }),
    W_([["'92:", T.n92b], ["timing.", T.timing], ["At", at("at")], ["night.", T.night]], { key: [3], hold: 0.4 }),
    W_([["Logged.", T.logged]], { key: [0], hold: 0.6 }),
    { ...ctaHead(tl, "Put every date / somewhere safe", T.put), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- the camera on the wall (one track): z about screen point (540, 700)
  const cam = (t) => {
    const k0 = hook === "B" ? { x: -40, z: 1.22 } : hook === "C" ? { x: -40, z: 1.28 } : { x: 0, z: 1 };
    return track(t, { x: k0.x, z: k0.z }, [
      [hook === "A" ? 0 : 1.6, { x: 260, z: 1 }, hook === "A" ? tl.cut + 0.2 : Math.max(0.6, tl.cut - 1.4), EASE.io],
      [T.every, { x: 880, z: 1 }, T.ill - T.every - 0.2, EASE.io],
      [T.okay, { x: 1180 + 230 - 540, z: 1.55 }, 1.2, EASE.camera],
      [TURN - 0.1, { x: 440, z: 0.55 }, 1.0, EASE.camera],
      [T.put - 0.6, { x: 0, z: 1 }, 1.4, EASE.camera],
    ]);
  };
  const toScreen = (c, wx, wy) => ({ x: 540 + (wx - c.x - 540) * c.z, y: 700 + (wy - 700) * c.z });
  // migration timing: each wall line lifts to its card row
  const LIFT = { "86": T.eighty - 0.3, "94": T.line + 0.2, "03": T.page, "11": T.real - 0.1, "92": T.timing };
  const cardIn = (t) => spr(t - (T.so3 + 0.1), 170, 19) * (1 - ez(t, T.put - 0.6, 0.6, EASE.in));
  const CARD = { x: 80, y: 960, w: 920, h: 590 };
  const rowY = (i) => CARD.y + 110 + i * 92;
  // the roller: bands of fresh white paint (world x ranges) and their times
  const BANDS = [[0, 380, T.roller - 0.2], [380, 760, T.roller + 0.35], [760, 1130, T.honestly - 0.3], [1500, 1960, T.matter - 0.3], [1130, 1500, T.night + 0.2]];
  const paintAt = (t, wx) => { for (const [a, b, t0] of BANDS) if (wx >= a && wx < b) return EASE.io(seg(t, t0, t0 + 0.55)); return 0; };
  const wall = (t) => {
    const c = cam(t);
    const hookRoll = hook === "B" ? Math.sin(Math.PI * seg(t, 0.05, 2.3)) : 0; // the hook-B stroke paints then rewinds
    const ed = spr(t - (T.its - 0.3), 170, 18) * (1 - ez(t, T.okay - 0.2, 0.5, EASE.in));
    const edEnd = spr(t - (T.put - 0.5), 160, 18);
    const newLine = seg(t, T.put + 0.2, T.put + 1.8);
    return <AbsoluteFill style={{ background: "#2A2118" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${540 - (c.x + 540) * c.z}px, ${700 - 700 * c.z}px) scale(${c.z})` }}>
        {/* plaster wall, warm light falloff, floor */}
        <div style={{ position: "absolute", left: -400, top: -400, width: WALLW + 800, height: FLOOR + 400, background: "radial-gradient(60% 55% at 45% 45%, #F1EADB, #E1D7C2 70%, #CDBFA6)" }} />
        <div style={{ position: "absolute", left: -400, top: -400, width: WALLW + 800, height: FLOOR + 400, opacity: 0.35, backgroundImage: "radial-gradient(rgba(120,100,70,.18) 1px, transparent 1.5px)", backgroundSize: "7px 9px" }} />
        <div style={{ position: "absolute", left: -400, top: FLOOR, width: WALLW + 800, height: 1400, background: "linear-gradient(180deg, #7D7466, #5B5348 30%, #463F36)" }} />
        {/* the Sharpie lines; each lifts off when it migrates and leaves a pale ghost */}
        {L.map((l, i) => { const lt = LIFT[l.k]; const gone = lt ? ez(t, lt, 0.5) : 0; const painted = paintAt(t, l.x + 120);
          return <div key={i} style={{ position: "absolute", left: l.x, top: l.y, transform: `rotate(${l.r}deg)`, ...SH, fontSize: 84, opacity: (1 - 0.85 * gone) * (1 - painted) }}>
            {l.s}{l.under && <><div style={{ position: "absolute", left: 0, right: 0, bottom: -10, height: 6, background: "#1B1B1F", borderRadius: 3 }} /><div style={{ position: "absolute", left: 10, right: 20, bottom: -24, height: 5, background: "#1B1B1F", borderRadius: 3 }} /></>}
          </div>; })}
        {TALLY.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, ...SH, fontSize: 56, opacity: 0.6 * (1 - paintAt(t, x)) }}>{["oil 3/88", "plugs", "|||| ||", "belt?"][i]}</div>)}
        {/* fresh paint: the roller's white bands */}
        {BANDS.map(([a, b, t0], i) => { const p = EASE.io(seg(t, t0, t0 + 0.55)); return p > 0 && <div key={i} style={{ position: "absolute", left: a, top: -400, width: b - a, height: (FLOOR + 400) * p, background: "linear-gradient(90deg, #F7F5F0, #FBFAF7 50%, #F4F2EC)" }} />; })}
        {BANDS.map(([a, b, t0], i) => { const p = EASE.io(seg(t, t0, t0 + 0.55)); return p > 0 && p < 1 && <div key={"r" + i} style={{ position: "absolute", left: a - 10, top: -400 + (FLOOR + 400) * p - 60, width: b - a + 20, height: 90, borderRadius: 45,
          background: "linear-gradient(180deg, #FFFFFF, #E4E2DC)", boxShadow: "0 10px 20px rgba(0,0,0,.25)" }} />; })}
        {/* hook B: one roller stroke across '86, then it rewinds */}
        {hookRoll > 0.01 && <div style={{ position: "absolute", left: 40, top: 560, width: 760 * hookRoll, height: 150, background: "#FBFAF7", borderRadius: 20 }}>
          <div style={{ position: "absolute", right: -40, top: -20, width: 80, height: 190, borderRadius: 40, background: "linear-gradient(90deg, #FFFFFF, #DAD7D0)", boxShadow: "0 10px 20px rgba(0,0,0,.25)" }} /></div>}
        {/* the Camaro parked in front, the paint tray and roller waiting at the base */}
        <Cut id="A20" cx={820} cy={1310} w={1300} shadow={0.55} />
        <div style={{ position: "absolute", left: 1700, top: FLOOR + 120, width: 260, height: 70, borderRadius: 10, background: "linear-gradient(180deg, #C9CCD2, #8E939A)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>
          <div style={{ position: "absolute", left: 20, right: 60, top: 12, height: 40, borderRadius: 8, background: "#FBFAF7" }} /></div>
        <div style={{ position: "absolute", left: 1880, top: FLOOR - 230, width: 70, height: 160, borderRadius: 30, background: "linear-gradient(90deg, #FFFFFF, #DAD7D0)", transform: "rotate(-14deg)" }} />
        <div style={{ position: "absolute", left: 1905, top: FLOOR - 80, width: 12, height: 260, background: "#3A3A3C", transform: "rotate(-14deg)" }} />
        <div style={{ position: "absolute", left: 1560, top: FLOOR - 40, width: 140, height: 160, borderRadius: 12, background: "linear-gradient(90deg, #D9DCE1, #F4F5F7, #B4B8BF)" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: 40, ...font("Inter", 40, INK, 700), textAlign: "center" }}>WHITE</div></div>
        {/* Ed's new line on the fresh wall (the loop line, same spot as '86) */}
        {newLine > 0 && <div style={{ position: "absolute", left: 80, top: 600, transform: "rotate(-3deg)", ...SH, fontSize: 84, clipPath: `inset(0 ${(1 - newLine) * 100}% 0 0)` }}>'26 Joan logged it all</div>}
      </div>
      {/* Ed walks in and waves at the wall; at the end he's back with the marker */}
      {ed > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${(1 - ed) * 700}px)` }}><Cut id="E09" cx={760} cy={1500} w={700} shadow={0} /></div>}
      {edEnd > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${(1 - edEnd) * 700}px)` }}><Cut id="E09" cx={800} cy={1560} w={620} shadow={0} /></div>}
      <Haze h={560} a={0.55} c="234,227,211" />
      {/* the page card + migrating ink (screen space) */}
      {(() => { const ci = cardIn(t); if (ci < 0.01) return null;
        return <div style={{ position: "absolute", left: CARD.x, top: CARD.y + (1 - ci) * 200, width: CARD.w, height: CARD.h, opacity: clamp(ci * 2), borderRadius: 40, background: "rgba(255,255,255,.96)", boxShadow: "0 30px 50px -24px rgba(0,0,0,.45)", zIndex: 20 }}>
          <div style={{ position: "absolute", left: 40, top: 32, ...font("Inter", 42, GREY, 500) }}>Ed's '69 Camaro · build log</div>
          <div style={{ position: "absolute", right: 30, top: 24, padding: "6px 18px", borderRadius: 24, background: "#F2F2F5", ...font("Inter", 40, INK, 600) }}>Fuel<span style={{ color: RED }}>My</span>Build</div>
        </div>; })()}
      {[...ROWS, ["92", "1992", "Timing, by Ed (don't)"]].map(([k, d, what], i) => {
        const lt = LIFT[k], ci = cardIn(t); if (t < lt || ci < 0.01) return null;
        const l = L.find((q) => q.k === k), from = toScreen(cam(lt), l.x, l.y);
        const p = EASE.camera(seg(t, lt, lt + 0.8)), y = rowY(i) + (1 - ci) * 200;
        const x = lerp(from.x, CARD.x + 40, p), yy = lerp(from.y, y, p);
        const fix = k === "11" ? ez(t, T.fix - 0.1, 0.4) : 0;
        return <div key={k} style={{ position: "absolute", left: 0, top: 0, zIndex: 21, opacity: clamp(ci * 2) }}>
          <div style={{ position: "absolute", left: x, top: yy, ...SH, fontSize: lerp(84 * cam(lt).z, 52, p), opacity: 1 - p, filter: `blur(${p * 4}px)` }}>{l.s}</div>
          <div style={{ position: "absolute", left: CARD.x + 40, top: y, display: "flex", alignItems: "baseline", gap: 18, opacity: clamp((p - 0.4) * 2), filter: p < 0.7 ? `blur(${(0.7 - p) * 10}px)` : undefined }}>
            <span style={font("Inter", 46, k === "92" ? RED : INK, 650)}>{d}</span>
            <span style={font("Inter", 46, INK, 500)}>{k === "11" ? <>{fix < 0.5 ? <span style={{ textDecoration: fix > 0.05 ? "line-through" : "none", textDecorationColor: RED }}>Munsie</span> : "Muncie"} 4-speed</> : what}</span>
            {k === "11" && fix > 0.5 && <span style={{ padding: "4px 16px", borderRadius: 20, background: "rgba(244,48,52,.1)", ...font("Inter", 40, RED, 600), transform: `scale(${spr(t - T.fix, 260, 14)})` }}>edited by Ed</span>}
          </div>
        </div>; })}
    </AbsoluteFill>;
  };
  // ---------- Ed's face: "...I'm not telling you that one."
  const edFace = (t) => <AbsoluteFill style={{ background: "#2A2118" }}>
    <Full id="F02" t={t} k0={1.35} k1={1.42} fy={0.55} dim={0.2} blur={10} />
    <Haze h={560} a={0.6} c="234,227,211" />
    <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${Math.sin(t * 2.2) * 1.5}deg) translateX(${Math.sin(t * 1.1) * 14}px)`, transformOrigin: "540px 1900px" }}><Cut id="E09" cx={560} cy={1320} w={1100} shadow={0} /></div>
    {/* the whistle: three notes drifting up */}
    {[0, 1, 2].map((i) => { const p = ((t - ED) * 0.8 + i / 3) % 1; return t > ED + 0.4 && <div key={i} style={{ position: "absolute", left: 300 - p * 80 + i * 20, top: 900 - p * 300, ...font("Inter", 64, "#3A3A3C", 600), opacity: (1 - p) * 0.8 }}>{"♪"}</div>; })}
  </AbsoluteFill>;
  // ---------- the forty photos: each flash prints a near-identical beige print onto the pile; the pile slumps
  const photos = (t) => {
    const flashes = [T.photo - 0.1, T.photo + 0.25, at("all") - 0.05, at("it", 3), T.then2, at("find"), at("four-speed"), at("camera"), T.forty - 0.1, at("photos") + 0.1];
    const slump = ez(t, T.good - 0.2, 0.6, EASE.camera);
    const fl = flashes.reduce((a, f) => Math.max(a, t >= f && t < f + 0.18 ? 1 - (t - f) / 0.18 : 0), 0);
    return <AbsoluteFill style={{ background: "#2A2118" }}>
      <Full id="F02" t={t} k0={1.3} k1={1.38} fy={0.75} dim={0.35} blur={8} />
      <Haze h={560} a={0.55} c="234,227,211" />
      <div style={{ position: "absolute", left: -40, top: 1180, width: W + 80, height: 800, background: "linear-gradient(180deg, #7A5A3A, #5A402A)" }} />
      {flashes.map((f, i) => { const q = spr(t - (f + 0.12), 200, 16); if (t < f + 0.1) return null;
        const r = (i * 37 % 15) - 7 + slump * (i - 5) * 4, x = 270 + ((i * 53) % 120) - 60 + slump * (i - 5) * 26, y = 1020 - i * 9 + slump * i * 6;
        return <div key={i} style={{ position: "absolute", left: x, top: lerp(-500, y, clamp(q)), width: 540, height: 400, background: "#F7F3EA", padding: 18, boxSizing: "border-box", boxShadow: "0 12px 24px rgba(0,0,0,.4)", transform: `rotate(${r}deg)` }}>
          <div style={{ width: "100%", height: "100%", background: "radial-gradient(60% 60% at 45% 45%, #EDE5D3, #D8CCB4)", position: "relative", overflow: "hidden" }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 30 + ((i + k) * 41 % 120), top: 40 + k * 100, ...SH, fontSize: 52, opacity: 0.35, filter: "blur(2.5px)" }}>{["'8? bou...", "'0? pa...", "'1? M..."][k]}</div>)}
          </div></div>; })}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: fl * 0.85, zIndex: 40 }} />
    </AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: wall },
    { at: ED, render: edFace, enter: { kind: "match" } },
    { at: PH, render: photos, enter: { kind: "rise", d: 0.55 } },
    { at: TURN, render: wall, enter: { kind: "rise", d: 0.6 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "air-slow-push", 0.5], ...(hook === "B" ? [[0.05, "slide-soft"], [1.2, "air-pull"]] : []), [T.sat, "chip-drop-red"], [T.its - 0.3, "slide-soft"],
    [T.okay, "air-slow-push", 0.7], [T.dont - 0.2, "pen-write"], [ED + 0.4, "shimmer-soft", 0.6],
    ...[T.photo - 0.1, T.photo + 0.25, at("all") - 0.05, at("it", 3), T.then2, at("find"), at("four-speed"), at("camera"), T.forty - 0.1, at("photos") + 0.1].map((f) => [f, "shutter"]),
    [T.good - 0.2, "paper-fall-x2"], [TURN - 0.1, "air-pull"], ...Object.values(LIFT).map((lt) => [lt, "paper-flutter", 0.6]),
    [T.fix - 0.1, "pencil-line"], ...BANDS.map(([a, b, t0]) => [t0, "slide-soft"]), [T.logged, "pop-soft"], [T.put - 0.5, "slide-soft"], [T.put + 0.2, "pen-write"], [ctaT, "cta-pop"],
  ];
  // music: warm, story-at-dinner; drops out under Ed's confession, returns on "Logged."
  const music = { bpm: 94, root: 52, mode: "major", style: "warm", cut: T.fine - 0.3, ret: T.logged - 0.02, room: "shop" };
  return { shots, heads, sfx, music };
}
