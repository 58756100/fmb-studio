// @ts-nocheck
// S0-09 (lane 0, garages): "47 Bolts", a mock movie trailer. Tomás puts 47 bolts back into an '89 E30 after an intake
// swap and one is left on the fender. The owner is due at four. The last person on this intake (the owner, Dana Kim)
// logged a photo last spring: the bolt holds the throttle bracket. Bolt 48 goes home and Tomás logs today's swap.
// Device: a trailer whose title cards are built from hardware. The title "47 BOLTS" is a grid of hex bolt heads with
// one bolt missing; that bolt drops out of the title into the bay. The stakes card is a clock face of washers whose
// hour hand is the leftover bolt. Look: trailer black, cool steel, one red accent; Barlow Condensed caps.
// Transitions: bolt-follow drop (title -> bay), portal into the bolt (macro), match cut (macro bolt = clock hand),
// object wipe (a washer rolls across into the dim bay), silence punch (the record slides out from under the tray),
// portal into the ringed bolt in the photo, pull-back into the stacked log, pull-back into the closing title (CTA).
// remocn (ported): kinetic-center-build (hardware title assembling), lens-zoom settle (punch), focus-blur-resolve
// (card fields), period-drop (CTA). New vs the previous sprint reel: kinetic-center-build as a pixel grid of parts.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, mbx, mby } from "../kit";
import { Full, Scrim, Vignette, glass, font, MetalDefs, HexHead, Washer, SideBolt } from "./s0kit";

export const HOOK_WORDS = 11;
export const HOOK_PAD = { B: 1.0 }; // hook B opens on 1.0 s of picture only: one bolt drops and bounces
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#07080A";
export const TEXT = { font: "Barlow Condensed", weight: 700, size: 124, min: 84, ls: "0.01em", upper: true, color: "#F5F5F7", accent: RED, line2: null, align: "center", maxW: 930, top: 280, lead: 1.0 };
export const IMAGES = ["F01", "A10", "E05", "C04", "G12", "D04"];
const BC = "Barlow Condensed";

// ---------------------------------------------------------------- the hardware title: 5x7 glyphs, every pixel a bolt head
const G = {
  "4": ["10010", "10010", "10010", "11111", "00010", "00010", "00010"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
};
const cells = (word, pitch, cx, top) => {
  const cols = word.length * 6 - 1, x0 = cx - (cols * pitch) / 2 + pitch / 2, out = [];
  [...word].forEach((ch, k) => G[ch].forEach((row, r) => [...row].forEach((v, c) => { if (v === "1") out.push({ x: x0 + (k * 6 + c) * pitch, y: top + r * pitch + pitch / 2, ch, r, c }); })));
  return out;
};
const TITLE_Y = 690;
const P47 = cells("47", 66, 540, TITLE_Y), PB = cells("BOLTS", 31, 540, TITLE_Y + 7 * 66 + 46);
const GAP = PB.findIndex((p) => p.ch === "S" && p.r === 6 && p.c === 3); // the missing bolt: bottom of the S
const ALL = [...P47.map((p) => ({ ...p, r0: 28 })), ...PB.map((p, i) => ({ ...p, r0: 13.5, gap: i === GAP }))];
const GAPPT = PB[GAP];
const hash = (i, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
// mode: "fly" (bolts fly in from the edges), "burst" (out of one point), "slam" (drop from above with a hit)
const Title = ({ t, t0, mode = "fly", from = GAPPT, s = 1, o = 1, gapFilled = 0, sub = 0 }) => {
  if (o <= 0.002) return null;
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o, overflow: "visible", transform: `scale(${s})`, transformOrigin: "540px 860px" }}>
    {ALL.map((p, i) => {
      if (p.gap && gapFilled <= 0) return null;
      const delay = mode === "burst" ? Math.hypot(p.x - from.x, p.y - from.y) / 1800 : mode === "slam" ? hash(i, 3) * 0.25 : hash(i) * 0.9 + (p.r0 > 20 ? 0 : 0.35);
      const q = p.gap ? gapFilled : spr(t - t0 - delay, 230, 21);
      if (q <= 0) return null;
      let sx, sy;
      if (mode === "burst") { sx = from.x; sy = from.y; }
      else if (mode === "slam") { sx = p.x; sy = p.y - 700; }
      else { const a = hash(i, 2) * Math.PI * 2; sx = 540 + Math.cos(a) * 1300; sy = 900 + Math.sin(a) * 1500; }
      const x = lerp(sx, p.x, q), y = lerp(sy, p.y, q);
      return <g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity={clamp(q * 3)}><HexHead r={p.r0} rot={(1 - q) * 240 + hash(i, 5) * 30} shine={Math.max(0, 1 - Math.abs(t - t0 - delay - 0.35) * 5) * 0.8} /></g>;
    })}
    {sub > 0 && <text x={540} y={TITLE_Y + 7 * 66 + 46 + 7 * 31 + 84} textAnchor="middle" style={{ fontFamily: BC, fontWeight: 700, fontSize: 52, letterSpacing: "0.32em", fill: "#C9CCD2", opacity: sub }}>NOW SHOWING</text>}
  </svg>;
};
// magnetic parts tray (dark steel dish) seen at a low angle
const Tray = ({ x, y, w = 300, glow = 0, tip = 0 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.18, width: w, height: w * 0.36, transform: `rotate(${-tip}deg)`, transformOrigin: "10% 80%", zIndex: 12 }}>
  {glow > 0 && <div style={{ position: "absolute", left: -20, right: -20, bottom: -26, height: 40, borderRadius: "50%", background: "rgba(255,248,220,.95)", filter: "blur(14px)", opacity: glow }} />}
  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(60% 70% at 45% 40%, #5B6068, #1E2126 70%, #0E1013)", boxShadow: "inset 0 6px 10px rgba(255,255,255,.18), 0 14px 22px rgba(0,0,0,.6)" }} />
  <div style={{ position: "absolute", left: "12%", right: "12%", top: "16%", bottom: "26%", borderRadius: "50%", background: "radial-gradient(70% 70% at 50% 40%, #2A2E34, #121418)" }} />
</div>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    tomas: at("tomás"), forty: at("forty-seven"), okay: at("okay"), where: at("where"), every: at("every"), fear: at("fear"), owner: at("owner's"), four: at("four."),
    the: at("the", 2), write: at("write"), he: at("he", 2), did: at("did", 2), spring: at("spring's"), photo: at("photo,"), there: at("there"), throttle: at("throttle"),
    f48: at("forty-eight."), and2: at("and", 3), logging: at("logging"), send: tl.cta("send") ?? at("send"),
  };
  const CUT = tl.cut; // end of the hook line
  const MACRO = T.where - 0.55, CLOCK = T.every - 0.12, DIM = T.the - 0.4, REC = T.he - 0.06, HOME = T.f48 - 0.12, STACK = T.and2 - 0.15, END = T.send - 0.35;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = hook === "A" ? [fx({ words: wordsFor(hw, "One man. One wrench.", 0) }, [hw[0].s, hw[1].s, hw[2].s, hw[4].s]),
                            { words: wordsFor(hw, "A bolt / nobody wrote down.", hw[5].s), key: [2], exit: { at: tl.cut - 0.75, mode: "up" } }]
    : hook === "B" ? [{ words: wordsFor(hw, "One bolt. No home.", 0), key: [3], exit: { at: Math.max(hw[3].e + 0.3, tl.cut - 0.75), mode: "up" } }]
    : [{ words: wordsFor(hw, "Forget before-and-afters.", 0), hold: 0.5 }, { words: wordsFor(hw, "Your best work / deserves a trailer.", hw[2].s), key: [5], exit: { at: tl.cut - 0.75, mode: "up" } }];
  const heads = [
    ...hk,
    fx(B("47 bolts. Back in.", T.forty), [T.forty, at("bolts"), at("back"), at("into")]),
    { ...B("Bolt 48?", T.where), words: [{ w: "Bolt", t: T.where, line: 0 }, { w: "48?", t: at("one", 1), line: 0 }], key: [1], hold: 0.9 },
    B("Oldest fear.", T.every + 0.4, { key: [1], hold: 0.6 }),
    B("Owner due at four.", T.owner, { key: [3], out: "down" }),
    B("Did anyone / write it down?", T.write - 0.9, { words: [{ w: "Did", t: at("did", 1), line: 0 }, { w: "anyone", t: at("he", 1), line: 0 }, { w: "write", t: T.write, line: 1 }, { w: "it", t: at("anything"), line: 1 }, { w: "down?", t: at("down?") , line: 1 }], key: [2] }),
    B("He did.", T.he, { key: [1], hold: 0.5 }),
    B("There it is.", T.there, { hold: 0.8 }),
    { words: [{ w: "Bolt", t: T.f48, line: 0 }, { w: "48:", t: T.f48 + 0.15, line: 0 }, { w: "home.", t: T.f48 + 0.45, line: 0 }], key: [2], hold: 0.7 },
    B("I'm logging it.", at("i'm"), { key: [2], hold: 0.6 }),
    { ...ctaHead(tl, "Send this / to that tech", T.send), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shot 1: the hardware title on black (hook)
  const DROP = CUT - 0.55; // the missing bolt leaves the title
  const titleShot = (t) => {
    const t0 = hook === "B" ? 1.05 : hook === "C" ? hw[2].s - 0.25 : -0.45;
    const mode = hook === "B" ? "burst" : hook === "C" ? "slam" : "fly";
    const lift = ez(t, DROP - 0.1, 0.9, EASE.camera); // camera follows the bolt down: the title lifts away
    // hook C: grey before/after split, knocked off by the title slam
    const knock = hook === "C" ? ez(t, t0 + 0.1, 0.5, EASE.in) : 1;
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: hook === "B" && t < 1.3 ? `radial-gradient(${60 + 30 * Math.sin(t * 5)}% 45% at ${30 + 50 * seg(t, 0, 1.2)}% 60%, #333A44 0%, #07080A 75%)` : "radial-gradient(70% 45% at 50% 48%, #1D2127 0%, #07080A 75%)" }} />
      {hook === "C" && knock < 1 && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 490, top: 640, width: 470, height: 700, borderRadius: 24, overflow: "hidden",
        transform: `translate(${(i ? 1 : -1) * knock * 700}px, ${knock * 300}px) rotate(${(i ? 1 : -1) * knock * 25}deg)`, filter: `grayscale(1) brightness(.75) ${knock > 0.05 ? "url(#mbx4)" : ""}` }}>
        <img src={src(i ? "G12" : "A10")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: i ? "50% 50%" : "30% 50%" }} />
        <div style={{ position: "absolute", left: 24, bottom: 20, ...font("Inter", 44, "#fff", 600) }}>{i ? "After" : "Before"}</div>
      </div>)}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-lift * 1300}px)` }}>
        <Title t={t} t0={t0} mode={mode} gapFilled={hook === "B" && t > 1.25 && t < DROP ? 1 : 0} />
        {/* the gap in the S shows faintly where the bolt is missing */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><circle cx={GAPPT.x} cy={GAPPT.y} r={12} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={2} strokeDasharray="4 5" opacity={ez(t, t0 + 1.2, 0.4)} /></svg>
      </div>
      {/* hook B: the single bolt falls and bounces before the title builds around it */}
      {hook === "B" && t < 1.3 && (() => { const f = clamp(t / 0.55), y = t < 0.55 ? lerp(GAPPT.y - 760, GAPPT.y, f * f) : GAPPT.y - Math.abs(Math.sin((t - 0.55) * 9)) * 60 * Math.exp(-(t - 0.55) * 6);
        const x = lerp(560, GAPPT.x, EASE.out(f));
        return <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{ALL.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r0 * 0.8} fill="none" stroke="#fff" strokeWidth={2} opacity={(0.12 + 0.4 * Math.max(0, Math.sin(t * 9 - p.x / 70 - p.y / 110))) * seg(t, 0.0, 0.25) * (1 - seg(t, 1.05, 1.3))} />)}<g transform={`translate(${x},${y})`}><HexHead r={lerp(46, 26, f) - 12.5 * seg(t, 0.9, 1.25)} rot={t * 200} /></g></svg>; })()}
    </AbsoluteFill>;
  };
  // the bolt that falls out of the title and lands on the fender (overlay above the cut)
  const LAND = { x: 760, y: 1418 };
  const fallBolt = (t) => {
    if (t < DROP || t > MACRO + 0.2) return null;
    const p = seg(t, DROP, CUT + 0.25);
    if (p < 1) { const y = lerp(GAPPT.y, LAND.y, EASE.in(p)), x = lerp(GAPPT.x, LAND.x, p);
      return <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 40 }}><g transform={`translate(${x},${y}) scale(1,${1 + 0.6 * p})`} filter={p > 0.2 ? "url(#mby3)" : undefined}><HexHead r={lerp(13.5, 22, p)} rot={t * 400} /></g></svg>; }
    return null;
  };
  // ---------- shot 2 / 5: the bay (F01), the E30, Tomás, the tray and the leftover bolt
  const bay = (t, dimMode) => {
    const tilt = dimMode ? 0 : ez(t, T.okay - 0.2, 1.1, EASE.camera); // camera tilts down to the tray and the bolt
    const push = dimMode ? ez(t, DIM, 3.4, EASE.io) : 0;
    const k = 1 + 0.32 * tilt + 0.12 * push;
    const ox = LAND.x, oy = LAND.y - 40;
    const bounce = dimMode ? 0 : (t > CUT + 0.25 ? Math.abs(Math.sin((t - CUT - 0.25) * 10)) * 26 * Math.exp(-(t - CUT - 0.25) * 6) : 0);
    const chipQ = spr(t - (T.tomas + 0.3), 200, 18);
    const glowT = at("down?") - 0.3;
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${k}) translateY(${-tilt * 40}px)` }}>
        <Full id="F01" t={t} t0={CUT} t1={DIM + 4} k0={1.08} k1={1.16} fy={0.55} dim={dimMode ? 0.62 : 0.38} sat={0.8} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, height: 770, background: "linear-gradient(180deg, rgba(8,9,11,0), rgba(8,9,11,.55) 40%, rgba(8,9,11,.8))", zIndex: 2 }} />
        <div style={{ zIndex: 4, position: "absolute", inset: 0, filter: dimMode ? "brightness(.55)" : undefined }}>
          <Cut id="E05" cx={250} cy={980} w={500} shadow={0} style={{ transform: `translateY(${Math.sin(t * 1.1) * 4}px)` }} />
          <Cut id="A10" cx={590} cy={1220} w={1000} shadow={0.55} />
        </div>
        {/* fender cover strip on the front wing */}
        <div style={{ position: "absolute", left: 610, top: 1400, width: 330, height: 46, borderRadius: 10, background: "linear-gradient(180deg,#2B2F35,#15171B)", transform: "rotate(-3deg)", zIndex: 6, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} />
        <Tray x={880} y={1540} w={260} glow={dimMode ? clamp(0.35 + 0.65 * seg(t, glowT, glowT + 0.5)) * (0.85 + 0.15 * Math.sin(t * 5)) : 0} />
        {!dimMode && t > CUT + 0.2 && <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 13 }}><g transform={`translate(${LAND.x},${LAND.y - 8 - bounce})`}><HexHead r={22} rot={20 + Math.sin(t * 0.8) * 4} /></g></svg>}
        {dimMode && WASHERS.map((w, i) => { const q = EASE.out(seg(t, DIM + w.d, DIM + w.d + 1.0)); const x = lerp(W + 120, w.x, q), y = w.y - Math.abs(Math.sin(q * Math.PI * 3)) * 30 * (1 - q);
          return <svg key={i} width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 11 }}><g transform={`translate(${x},${y})`}><Washer r={w.r} rot={-q * 720} /></g></svg>; })}
      </div>
      <Scrim a={0.6} />
      {!dimMode && <div style={{ position: "absolute", left: 60, top: 600, display: "flex", alignItems: "center", gap: 18, padding: "12px 30px 12px 12px", borderRadius: 60, ...glass(0.16), zIndex: 30,
        opacity: clamp(chipQ * 2) * (1 - ez(t, T.okay - 0.2, 0.4)), transform: `translateY(${(1 - chipQ) * 30}px)` }}>
        <div style={{ width: 120, height: 80, position: "relative", borderRadius: 40, background: "rgba(255,255,255,.9)" }}><Cut id="C04" cx={60} cy={40} w={104} shadow={0} /></div>
        <span style={font("Inter", 44, "#fff", 600)}>Intake swap · '89 E30</span>
      </div>}
    </AbsoluteFill>;
  };
  const WASHERS = [{ x: 470, y: 1360, r: 30, d: 0.0 }, { x: 640, y: 1330, r: 24, d: 0.15 }, { x: 330, y: 1450, r: 26, d: 0.3 }, { x: 760, y: 1470, r: 28, d: 0.42 }];
  // ---------- shot 3: macro on the bolt (spinning thread), bay blurred behind
  const MAC = { x: 200, y: 900, L: 680, h: 132 };
  const macro = (t) => {
    const spin = (t - MACRO) * 3.0, d = drift(t, "mac", 16, 0.5);
    const turn = ez(t, CLOCK - 0.5, 0.45, EASE.camera); // the bolt settles horizontal for the match cut
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={MACRO} t1={CLOCK} k0={1.6} k1={1.9} fy={0.8} dim={0.7} blur={22} />
      <Vignette a={0.7} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5 }}><g transform={`translate(${MAC.x + d.x * (1 - turn)},${MAC.y + d.y * (1 - turn)}) rotate(${lerp(-14 + d.r * 4, 0, turn)}, ${MAC.L / 2}, 0)`}><SideBolt L={MAC.L} h={MAC.h} phase={spin} /></g></svg>
      <div style={{ position: "absolute", left: MAC.x + MAC.L - 120, top: MAC.y + 140, width: 240, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.07)", filter: "blur(8px)" }} />
    </AbsoluteFill>;
  };
  // ---------- shot 4: the clock face of washers; the bolt is the hour hand and swings to four
  const CK = { x: 540, y: 1060, R: 330 };
  const clock = (t) => {
    const into = ez(t, CLOCK, 0.6, EASE.camera); // bolt shrinks from macro size into the hand
    const swing = spr(t - (T.four - 0.35), 120, 13);
    const ang = 30 * swing; // 3 o'clock -> 4 o'clock (30 deg below horizontal), spring overshoot
    const L = lerp(MAC.L, CK.R * 0.86, into), h = lerp(MAC.h, 40, into), x0 = lerp(MAC.x, CK.x, into);
    const spill = ez(t, DIM - 0.5, 0.5, EASE.in);
    const tick = (Math.floor((t - CLOCK) * 2) % 2) * 0.5;
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 40% at 50% 55%, #22262D 0%, #07080A 80%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2, q = spr(t - (CLOCK + 0.15 + i * 0.07), 260, 17);
          const isFour = i === 4, r = isFour ? 34 : 24, x = CK.x + Math.cos(a) * CK.R, y = CK.y + Math.sin(a) * CK.R;
          const sp = spill * (1 + i * 0.1);
          return q > 0 && <g key={i} transform={`translate(${x + sp * 400 * Math.cos(a)},${y - (1 - q) * 500 + sp * 900}) scale(${q})`} opacity={1 - spill}>
            <Washer r={r} rot={i * 30 + t * 8} tint={isFour && t > T.four ? "url(#brass)" : "url(#steel)"} /></g>; })}
        <circle cx={CK.x} cy={CK.y} r={CK.R + 70} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={2} opacity={into} />
        <g transform={`translate(${x0},${lerp(MAC.y, CK.y, into)}) rotate(${ang}) translate(${-lerp(0, 40, into)},0)`} opacity={1 - spill}><SideBolt L={L} h={h} phase={(t - MACRO) * 2.2 * (1 - into)} /></g>
        <circle cx={CK.x} cy={CK.y} r={18 * into} fill="url(#steelR)" opacity={1 - spill} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: CK.y + CK.R + 120, textAlign: "center", ...font(BC, 64, "#C9CCD2", 700, { letterSpacing: "0.2em" }), opacity: ez(t, T.owner, 0.4) * (1 - spill), transform: `translateY(${(1 - ez(t, T.owner, 0.5)) * 30}px)` }}>DUE 4:00 PM</div>
      <div style={{ position: "absolute", left: CK.x - 7, top: CK.y - CK.R * 0.62, width: 14, height: CK.R * 0.62, transformOrigin: "50% 100%", transform: `rotate(${(t - CLOCK) * 30 + tick}deg)`, background: "rgba(244,48,52,.9)", borderRadius: 7, opacity: into * (1 - spill) }} />
    </AbsoluteFill>;
  };
  // ---------- shot 6: the record (glass card out from under the tray)
  const CARDR = { x: 70, y: 560, w: 940, h: 980 };
  const PHR = { x: 110, y: 830, w: 860, h: 480 };
  const RING = { x: PHR.x + 0.56 * PHR.w, y: PHR.y + 0.6 * PHR.h };
  const record = (t) => {
    const slide = spr(t - REC, 170, 20);
    const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 18}px)`, filter: q < 0.6 ? `blur(${(1 - q / 0.6) * 8}px)` : undefined }; };
    const ring = ez(t, T.there - 0.1, 0.6);
    const zoom = ez(t, T.throttle - 0.2, 1.4, EASE.io);
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={REC} t1={HOME} k0={1.3} k1={1.48} fy={0.8} dim={0.72} blur={16} />
      <Tray x={540} y={1690} w={420} glow={0.75 + 0.25 * Math.sin(t * 4)} tip={4 * slide} />
      <div style={{ position: "absolute", left: CARDR.x, top: CARDR.y + (1 - slide) * 900, width: CARDR.w, height: CARDR.h, ...glass(0.13), zIndex: 10, overflow: "hidden", opacity: clamp(slide * 3) }}>
        <div style={{ position: "absolute", top: -100, bottom: -100, width: 260, left: lerp(-400, 1300, seg(t, REC + 0.25, REC + 1.6)), transform: "rotate(14deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0))" }} />
        <div style={{ position: "absolute", left: 40, top: 36, ...font("Inter", 40, "rgba(255,255,255,.7)", 500), ...f(REC + 0.2) }}>Build log · '89 E30</div>
        <div style={{ position: "absolute", left: 40, top: 92, ...font("Inter", 68, "#fff", 650), ...f(T.spring - 0.1) }}>Throttle bracket</div>
        <div style={{ position: "absolute", left: 40, top: 172, ...font("Inter", 48, RED, 600), ...f(T.spring + 0.15) }}>Apr 18, 2026</div>
      </div>
      <div style={{ position: "absolute", left: PHR.x, top: PHR.y + (1 - slide) * 900, width: PHR.w, height: PHR.h, borderRadius: 30, overflow: "hidden", zIndex: 11, ...f(T.photo - 0.25) }}>
        <img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "56% 60%", transform: `scale(${1.15 + 0.25 * zoom})` }} />
        <svg width={PHR.w} height={PHR.h} style={{ position: "absolute", inset: 0 }}>
          <circle cx={0.56 * PHR.w} cy={0.6 * PHR.h} r={58 + 6 * Math.sin(t * 4)} fill="none" stroke="#fff" strokeWidth={7} strokeDasharray={`${ring * 380} 400`} transform={`rotate(-90 ${0.56 * PHR.w} ${0.6 * PHR.h})`} opacity={0.95} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: CARDR.x + 40, top: PHR.y + PHR.h + 40 + (1 - slide) * 900, display: "flex", alignItems: "center", gap: 16, zIndex: 12, ...f(T.photo + 0.3) }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#5E5CE6", display: "grid", placeItems: "center", ...font("Inter", 40, "#fff", 600) }}>D</div>
        <span style={font("Inter", 44, "#fff", 500)}>logged by Dana Kim</span>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 7: inside the photo, bolt 48 goes home, the torque wrench clicks
  const home = (t) => {
    const drop = spr(t - (HOME + 0.2), 220, 16), wr = ez(t, T.f48 + 0.35, 0.5, EASE.camera), clk = t > T.f48 + 0.85 ? Math.exp(-(t - T.f48 - 0.85) * 10) : 0;
    return <AbsoluteFill>
      <Full id="G12" t={t} t0={HOME} t1={STACK + 1} k0={1.9} k1={2.05} fx={0.56} fy={0.6} dim={0.15} />
      <Vignette a={0.6} />
      <Scrim a={0.65} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 5 }}><g transform={`translate(540,${lerp(600, 1000, clamp(drop))})`}><HexHead r={58} rot={lerp(160, 0, clamp(drop)) + clk * 8} shine={clk} /></g>
        <circle cx={540} cy={1000} r={120} fill="none" stroke="#fff" strokeWidth={6} opacity={0.8 * (1 - ez(t, HOME + 0.3, 0.5))} /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, zIndex: 6, transformOrigin: "540px 1000px", transform: `rotate(${lerp(-60, -8, wr) + clk * 3}deg)`, opacity: clamp(wr * 3) }}>
        <Cut id="D04" cx={540 + 330} cy={1000 + 210} w={820} shadow={0} />
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 8: the stack (new entry on top of last spring's)
  const NEWR = { x: 70, y: 600, w: 940, h: 300 };
  const stack = (t) => {
    const up = spr(t - (STACK + 0.25), 190, 19), d = drift(t, "stk", 3, 0.3);
    const card = (y, o, children, z) => <div style={{ position: "absolute", left: 70, top: y, width: 940, height: 300, ...glass(0.14), zIndex: z, opacity: o, display: "flex", alignItems: "center", gap: 30, padding: "0 36px", boxSizing: "border-box" }}>{children}</div>;
    return <AbsoluteFill>
      <Full id="F01" t={t} k0={1.3} k1={1.36} fy={0.8} dim={0.75} blur={16} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        {card(lerp(1000, 960, up), 0.8, <>
          <div style={{ width: 210, height: 210, borderRadius: 26, overflow: "hidden" }}><img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "56% 60%" }} /></div>
          <div><div style={font("Inter", 54, "#fff", 650)}>Throttle bracket</div><div style={{ ...font("Inter", 42, "rgba(255,255,255,.7)", 500), marginTop: 8 }}>Apr 18, 2026 · Dana Kim</div></div></>, 5)}
        {card(lerp(1000, NEWR.y, up), clamp(up * 2), <>
          <div style={{ width: 210, height: 210, borderRadius: 26, background: "rgba(255,255,255,.92)", position: "relative" }}><Cut id="C04" cx={105} cy={105} w={190} shadow={0} /></div>
          <div><div style={font("Inter", 54, "#fff", 650)}>Intake swap</div><div style={{ ...font("Inter", 42, RED, 600), marginTop: 8 }}>Oct 2026 · Tomás</div></div></>, 6)}
        <div style={{ position: "absolute", left: 104, top: 940, width: 6, height: lerp(0, 60, up), background: "rgba(255,255,255,.35)", zIndex: 4 }} />
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 9: closing title "47 BOLTS · NOW SHOWING" (CTA over it), a fresh bolt drops at the end (loop)
  const ending = (t) => {
    const t0 = END + 0.1, loop = tl.last - 0.3;
    const fall = seg(t, loop, loop + 0.6);
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 45% at 50% 48%, #1D2127 0%, #07080A 75%)" }} />
      <Title t={t} t0={t0} mode="burst" from={{ x: 540, y: 1300 }} s={1 - 0.03 * seg(t, t0, tl.last + 1)} gapFilled={0} sub={ez(t, t0 + 0.9, 0.5)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1524, textAlign: "center", ...font("Inter", 44, "rgba(255,255,255,.75)", 500), opacity: ez(t, t0 + 1.1, 0.5) }}>fuelmybuild.com</div>
      {fall > 0 && <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}><g transform={`translate(${GAPPT.x},${lerp(GAPPT.y - 0, 2100, EASE.in(fall))})`}><HexHead r={13.5} rot={t * 300} /></g></svg>}
    </AbsoluteFill>;
  };
  const MACRECT = { x: LAND.x - 90, y: LAND.y - 90, w: 180, h: 180 };
  const WASH = (t, p) => { const x = lerp(W + 260, -260, EASE.io(p)); return <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 50, filter: "url(#mbx3)" }}><g transform={`translate(${x},1060)`}><Washer r={260} rot={-p * 540} /></g></svg>; };
  const shots = [
    { at: 0, render: titleShot },
    { at: CUT, render: (t) => bay(t, false), enter: { kind: "rise", d: 0.7 } },
    { at: MACRO, render: macro, enter: { kind: "portal", d: 0.6, rect: { x: LAND.x - 60, y: LAND.y - 60, w: 120, h: 120 }, r: 60 } },
    { at: CLOCK, render: clock, enter: { kind: "match" } },
    { at: DIM, render: (t) => bay(t, true), enter: { kind: "wipe", d: 0.75, dir: -1, edge: (p) => lerp(W + 260, -260, EASE.io(p)), obj: WASH } },
    { at: REC, render: record, enter: { kind: "punch" } },
    { at: HOME, render: home, enter: { kind: "portal", d: 0.6, rect: { x: RING.x - 70, y: RING.y - 70, w: 140, h: 140 }, r: 70 } },
    { at: STACK, render: stack, enter: { kind: "pull", d: 0.6, rect: { x: 106, y: 645, w: 210, h: 210 }, r: 26 } },
    { at: END, render: ending, enter: { kind: "pull", d: 0.6, rect: { x: 390, y: 1300, w: 300, h: 533 }, r: 30 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const t0h = hook === "B" ? 1.05 : hook === "C" ? hw[2].s - 0.25 : 0.05;
  const sfx = [
    ...(hook === "A" ? [[0.05, "air-glide-long"], [0.35, "tick-ripple"], [0.9, "tick-ripple"], [1.5, "tick-ripple"], [2.0, "low-hit"]] : []),
    ...(hook === "B" ? [[0.0, "air-drop", 0.6], [0.55, "clunk"], [0.75, "tick-soft"], [1.05, "tick-ripple"], [1.3, "tick-ripple"], [1.6, "low-hit"]] : []),
    ...(hook === "C" ? [[0.15, "slide-soft"], [t0h, "low-hit"], [t0h + 0.1, "whoosh"], [t0h + 0.15, "tick-ripple"]] : []),
    [DROP, "air-drop"], [CUT + 0.25, "clunk"], [CUT + 0.45, "tick-soft"], [T.tomas + 0.3, "pop-soft"], [T.okay - 0.2, "air-slow-push", 0.7],
    [MACRO + 0.4, "ruler-tick", 0.6], [MACRO + 0.8, "ruler-tick", 0.6], [CLOCK + 0.15, "tick-ripple"], [CLOCK + 0.5, "low-hit"], [T.four - 0.35, "creak-soft"], [T.four, "bell-ding", 0.6],
    [DIM - 0.5, "exhaust-rattle", 0.8], [DIM + 0.1, "caster-roll-out"], [at("down?") - 0.3, "tint-swell"],
    [REC + 0.05, "slide-soft"], [T.spring - 0.1, "pop-soft"], [T.photo - 0.25, "photo-settle"], [T.there - 0.1, "draw"],
    [HOME + 0.3, "clunk"], [T.f48 + 0.85, "tape-click"], [STACK + 0.25, "card-rise"], [END + 0.1, "tick-ripple"], [END + 0.3, "low-hit"], [ctaT, "cta-pop"], [tl.last - 0.3, "air-drop", 0.5],
  ];
  // music: trailer bed (low, minor, observe groove), drops out on "He did." and returns on "Forty-eight."
  const music = { bpm: 92, root: 45, mode: "minor", style: "observe", cut: REC - 0.3, ret: HOME + 0.12 };
  return { shots, heads, sfx, music, over: (t) => <><MetalDefs />{fallBolt(t)}</> };
}
