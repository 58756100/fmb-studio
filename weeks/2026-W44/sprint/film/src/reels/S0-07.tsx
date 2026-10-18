// @ts-nocheck
// S0-07 (lane C, garages): Grant doubts that Luis at Fifth Street Lube does anything but oil changes. Luis walks him to
// the lot: a Civic whose rewired engine has every connector photographed on its build page, then the white car at the
// end of the row: standalone ECU, base map, dyno, all on its page. "Whose car is that?" "Mine. I tune on Sundays."
// "Can we talk about mine on Tuesday?" CTA: DM SHOP.
// Device: the shop's small white windshield service sticker. The camera pushes into each sticker and its rectangle
// opens into that car's build page (portal); the page folds back into the sticker afterwards (pull).
// Cars: Miata A07, Civic A37, the white one at the end A39 (row with an S2000 front A31). Grant E08, Luis E05 (bank).
// ECU C17, loom photos G09, dyno photo G10, bay F01. Fictional: Fifth Street Lube, Luis, Grant.
// remocn (ported): lens push (sticker), focus-blur-resolve, inline pill takeover (owner chip), typewriter, period-drop.
// New vs the previous reels: sticker portal (a real-world rectangle becomes the UI card).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep } from "./b2kit";

export const HOOK_WORDS = 11;
export const TAIL = 1.3;
export const LIFE = 1.3;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A07", "A37", "A39", "A31", "E08", "E05", "C17", "G09", "G10", "F01"];
const HOOKS = { A: "Only oil / changes?", B: "Known for / oil changes.", C: "Show me / one first." };
const AR = { A37: 1, A39: 1, A31: 1 };

// the shop sticker on a windshield (white rect with the shop's red mark)
const Sticker = ({ x, y, w = 70, o = 1 }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.62, borderRadius: 4, background: "#fff", opacity: o, boxShadow: "0 0 0 2px rgba(0,0,0,.08)", zIndex: 9 }}>
  <div style={{ position: "absolute", left: w * 0.12, top: w * 0.12, width: w * 0.3, height: w * 0.3, borderRadius: "50%", background: RED }} />
  {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: w * 0.5, top: w * (0.14 + i * 0.16), width: w * 0.38, height: w * 0.07, background: "#C7C7CC" }} />)}
</div>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    standalone: at("standalone"), come: at("come"), civic: at("civic"), first: at("first."), we: at("we"), rewired: at("rewired"), connectors: at("connector's"),
    page: at("page."), okay: at("okay,"), wiring: at("wiring."), actual: at("actual"), the: at("the", 2), white: at("white"), end: at("end."), sa2: at("standalone", 2),
    base: at("base"), dyno: at("dyno."), work: at("work"), page2: at("page.", 2), whose: at("whose"), mine: at("mine."), sundays: at("sundays."), can: at("can"), tuesday: at("tuesday?"),
    cta: tl.cta("d") ?? at("d", 3),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [2] : [2], hold: 0.8, color: "#F5F5F7" };
  if (hook === "A") fx(hk, [hw[7].s, hw[9].s, hw[10].s]);
  else fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.5)))].s));
  const heads = [
    hk,
    { ...fx(B("Whole engine, / rewired.", T.we), [T.we + 0.1, at("whole"), T.rewired]), key: [2], hold: 1.0 },
    { ...fx(B("Standalone ECU. / Base map.", T.sa2), [T.sa2, at("e", 3), T.base, at("map,")]), key: [3], hold: 0.8 },
    { ...fx(B("Tuesday?", T.can), [T.tuesday]), key: [0], hold: 0.6, color: "#F5F5F7" },
    { ...ctaHead(tl, "DM SHOP / we load your first builds", T.cta), key: [1], color: "#F5F5F7" },
  ];
  heads[heads.length - 1].words = [{ w: "DM", t: T.cta, line: 0 }, { w: "SHOP.", t: at("shop"), line: 0 }, { w: "We'll", t: at("we'll"), line: 1 }, { w: "load", t: at("load"), line: 1 }, { w: "your", t: at("your"), line: 1 }, { w: "builds", t: at("builds"), line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = null;

  // ---------------------------------------------------------------- the bay door: Grant with the ECU box, Luis, the Miata
  const bay = (t, phase) => {
    const d = drift(t, "bay", 3, 0.3);
    const end = phase === "end";
    const box = end ? ez(t, T.can + 0.3, 0.7, EASE.camera) : 0; // the box goes onto the Miata's roof
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.06 - 0.03 * ctaP})` }}>
        <Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", filter: "brightness(.9) saturate(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,16,20,.7) 0%, rgba(14,16,20,.2) 38%, rgba(14,16,20,0) 55%)" }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 570, width: 800, padding: "18px 0", borderRadius: 16, background: "#fff", textAlign: "center", boxShadow: "0 20px 30px -14px rgba(0,0,0,.5)", transform: `rotate(${0.4 * Math.sin(t * 0.7)}deg)` }}>
        <span style={{ ...inter(70, INK, 800), letterSpacing: "0.02em" }}>FIFTH STREET <span style={{ color: RED }}>LUBE</span></span></div>
      <div style={{ transform: `scale(${1 - 0.03 * ctaP})`, transformOrigin: "50% 80%", position: "absolute", inset: 0 }}>
        <Cut id="E05" cx={860} cy={1330} w={430} shadow={0} />
        <Cut id="A07" cx={500} cy={1460} w={900} shadow={0.45} />
        <Cut id="E08" cx={170} cy={1420} w={300} shadow={0} />
        <Cut id="C17" cx={lerp(250, 470, box)} cy={lerp(1330, 1205, box) - Math.sin(Math.PI * box) * 120} w={lerp(220, 200, box)} rot={lerp(-10, 0, box)} shadow={box > 0.9 ? 0.3 : 0} />
        {end && <Cut id="A39" cx={980} cy={1020} w={260} shadow={0.25} style={{ filter: "brightness(.9)" }} />}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the lot: a row of cars nose-out, each with a sticker
  // row (front views): positions; the camera pushes into a sticker (Civic first, then whips to the white one)
  const ROW = [{ id: "A31", x: 330 }, { id: "A37", x: 960 }, { id: "A07", x: 1590 }, { id: "A39", x: 2220 }];
  const ST = { A31: [0.62, 0.3], A37: [0.64, 0.32], A07: [0.62, 0.34], A39: [0.64, 0.3] };
  const CW = 560;
  const lot = (t, phase) => {
    const d = drift(t, "lot", 3, 0.3);
    // camera x: Civic (phase civic), then whip to the end (phase ae86)
    const targ = phase === "civic" ? ROW[1] : ROW[3];
    const push = phase === "civic" ? ez(t, T.civic - 0.1, 0.9, EASE.camera) : phase === "ae86" ? ez(t, T.end - 0.1, 0.7, EASE.camera) : 0;
    const back = phase === "whose" ? 1 - ez(t, T.whose - 0.1, 0.6, EASE.camera) : 0;
    const k = 1 + 1.2 * Math.max(push, back);
    const camX = 540 - targ.x;
    const owner = phase === "whose" ? spr(t - (T.mine - 0.05), 220, 15) : 0;
    const grant = phase === "civic" ? 0 : 0;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: -200, right: -200, top: 1120, height: 900, background: "linear-gradient(180deg, #DADBDF, #C9CBD0)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, height: 8, background: "repeating-linear-gradient(90deg, #fff 0 120px, transparent 120px 200px)", opacity: 0.8 }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${k})`, transformOrigin: `540px ${1090 - 0.18 * CW}px` }}>
        <div style={{ position: "absolute", left: camX, top: 0, width: 3000, height: H }}>
          {ROW.map((c) => { const h = CW / (1598 / 770); const [u, v] = ST[c.id];
            return <React.Fragment key={c.id}><Cut id={c.id} cx={c.x} cy={1090} w={CW} shadow={0.35} />
              <Sticker x={c.x - CW / 2 + u * CW} y={1090 - h / 2 + v * h} w={44} /></React.Fragment>; })}
        </div>
      </div>
      {phase === "whose" && owner > 0.01 && <div style={{ position: "absolute", left: 330, top: 1380, padding: "16px 28px", borderRadius: 40, ...CARD, opacity: clamp(owner * 2), transform: `scale(${0.85 + 0.15 * clamp(owner)})` }}>
        <Who ch="L" name="Owner: Luis" role="Sundays" bg={RED} size={60} /></div>}
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- a build page opened from the sticker
  const page = (t, which) => {
    const civic = which === "civic";
    const d = drift(t, which, 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, overflow: "hidden", transform: dT(d, 0.5) }}>
        <Sweep t={t} o={0.25} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 280, background: "radial-gradient(120% 90% at 50% 70%, #fff, #E9E9EE)" }}>
          <Cut id={civic ? "A37" : "A39"} cx={480} cy={150} w={440} shadow={0.3} />
          <div style={{ position: "absolute", left: 24, top: 22, padding: "8px 20px", borderRadius: 26, background: "rgba(255,255,255,.85)" }}><Wordmark size={42} /></div></div>
        <div style={{ position: "absolute", left: 40, top: 304, ...inter(56, INK, 700), ...land(t, (civic ? T.we : T.sa2) + 0.05) }}>{civic ? "Engine harness rebuild" : "Standalone ECU + base map"}</div>
        <div style={{ position: "absolute", left: 40, top: 380, display: "flex", gap: 20, alignItems: "center", ...land(t, (civic ? T.rewired : T.base) + 0.1) }}>
          <span style={{ ...inter(46, RED, 650), background: rgba(RED, 0.08), padding: "2px 14px", borderRadius: 12 }}>{civic ? "Aug 2026" : "May 2026"}</span>
          <Who ch="F" name="Fifth Street Lube" bg={RED} size={50} /></div>
        {civic ? <div style={{ position: "absolute", left: 40, top: 480, display: "flex", gap: 20 }}>
          {[[0.3, 0.5], [0.55, 0.45], [0.8, 0.55]].map(([fx_, fy], i) => <div key={i} style={land(t, T.connectors + i * 0.18)}><Thumb id="G09" w={280} h={300} t={t} fx={fx_} fy={fy} k={1.8} r={22} /></div>)}
        </div> : <>
          <div style={{ position: "absolute", left: 40, top: 480, display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 300, height: 300, borderRadius: 22, background: "#F2F2F7", position: "relative", ...land(t, T.base + 0.3) }}><Cut id="C17" cx={150} cy={150} w={260} shadow={0.2} /></div>
            <div style={land(t, T.dyno - 0.1)}><Thumb id="G10" w={560} h={300} t={t} fx={0.5} fy={0.55} k={1.08} r={22} /></div></div>
          <div style={{ position: "absolute", left: 40, top: 810, ...inter(46, "#3A3A3C", 550), ...land(t, T.work) }}>Installed and mapped by Luis</div>
        </>}
        {civic && <div style={{ position: "absolute", left: 40, top: 810, ...inter(46, "#3A3A3C", 550), ...land(t, T.connectors + 0.6) }}>Every connector photographed</div>}
      </div>
    </Studio></AbsoluteFill>;
  };
  // Grant, unconvinced
  const grant = (t) => {
    const d = drift(t, "gr", 3, 0.3);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Cut id="E08" cx={380} cy={1180} w={560} shadow={0} />
      <Cut id="C17" cx={560} cy={1060} w={260} rot={-8} shadow={0} />
      <div style={{ position: "absolute", left: 560, top: 640, padding: "24px 30px", borderRadius: 40, ...CARD, ...land(t, T.okay + 0.1) }}>
        <div style={inter(48, INK, 600)}>That's wiring.</div><div style={inter(48, RED, 650)}>An actual ECU?</div></div>
    </div></Studio></AbsoluteFill>;
  };

  const stickerRect = (id, push) => { const c = ROW.find((r) => r.id === id); const h = CW / (1598 / 770); const [u, v] = ST[id]; const k = 2.2;
    const sx = 540 + (c.x - CW / 2 + u * CW - c.x) * k, sy = 1090 - 0.18 * CW + ((1090 - h / 2 + v * h) - (1090 - 0.18 * CW)) * k; return { x: sx, y: sy, w: 44 * k, h: 44 * 0.62 * k }; };
  const shots = [
    { at: 0, render: (t) => bay(t, "start") },
    { at: T.standalone - 0.1, render: (t) => lot(t, "civic"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.we - 0.1, render: (t) => page(t, "civic"), enter: { kind: "portal", d: 0.6, rect: stickerRect("A37"), r: 6 } },
    { at: T.okay - 0.1, render: grant, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.the - 0.1, render: (t) => lot(t, "ae86"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.sa2 - 0.1, render: (t) => page(t, "ae86"), enter: { kind: "portal", d: 0.6, rect: stickerRect("A39"), r: 6 } },
    { at: T.whose - 0.1, render: (t) => lot(t, "whose"), enter: { kind: "pull", d: 0.6, rect: stickerRect("A39") } },
    { at: T.can - 0.1, render: (t) => bay(t, "end"), enter: { kind: "rise", d: 0.55 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.15, "pop-soft", 0.6], [T.civic - 0.1, "air-glide"], [T.we + 0.1, "card-settle"], [T.connectors, "shutter"], [T.connectors + 0.18, "shutter"], [T.connectors + 0.36, "shutter"],
    [T.okay + 0.1, "pop-soft"], [T.end - 0.1, "air-glide"], [T.base + 0.3, "card-settle"], [T.dyno - 0.1, "shutter"], [T.work, "pop-soft"], [T.mine - 0.05, "chip-pop"],
    [T.can + 0.3, "part-lift"], [T.can + 1.0, "clunk", 0.6], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 104, root: 52, mode: "minor", style: "investigate", cut: T.whose - 0.3, ret: T.can - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
