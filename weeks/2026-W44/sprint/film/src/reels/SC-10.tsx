// @ts-nocheck
// SC-10 (lane C, everyone): Wendell's Mustang is steaming 1,100 miles from home; his brother gets married Saturday and
// this is the getaway car. He limps into Two Forks Garage; Leland has never seen the car. The electric fan isn't running
// and somebody wired the conversion their own way. Wendell opens the fan entry on her build page and holds it up under
// the hood: Teller fan, 2021, Coldwater Auto, a photo, "relay under the battery tray". Found it, cooked, one on the
// shelf. Leland logs the repair, so Two Forks is part of her story now. "Whoever opens this hood next gets your note."
// Device: the record lives under the hood. The entry grows out of the phone's screen and settles on the raised hood's
// underside, a clean white panel on dark steel; Leland reads it where he works, and later adds his own entry under it.
// Brand safety: the VO names the Mustang, so only bank set A (A16/A17) is used. Fictional: Wendell (E08), Leland (E05),
// Two Forks Garage, Coldwater Auto, Teller Cooling. Road F12, bay F01, engine bay G12, radiator + fan C12. The relay,
// the battery tray, the steam and the ribbon are drawn (no bank images; requested as I42/I43 in the script).
// Transitions: object wipe (the car rolls across into the bay), hood rise (rise), whip to Wendell, portal (phone screen
// -> hood panel), camera drops (rise) to the battery tray, match back to the fan, rise to the hood panel, hood closes
// (pull), match to the road for the CTA (same road as frame 0, no steam).
// remocn (ported): lens-zoom settle, marker-highlight (Leland reads fields), focus-blur-resolve, typewriter, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep, Ripple } from "./b2kit";

export const HOOK_WORDS = 11;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A16", "A17", "F12", "F01", "G12", "C12", "E05", "E08", "D02"];
const HOOKS = { A: "1,100 miles / from home.", B: "A bad place / to steam.", C: "Who fixes it / out here?" };
const STEEL = ["#2B2E33", "#16181B"];

const Steam = ({ t, x, y, k = 1, seed = 0 }) => k <= 0.01 ? null : <>{Array.from({ length: 9 }, (_, i) => {
  const q = ((t * 0.55 + i / 9 + seed) % 1); const s = 60 + 160 * q;
  return <div key={i} style={{ position: "absolute", left: x - s / 2 + 40 * Math.sin(i * 2.1 + t) + 60 * q * Math.sin(i), top: y - 380 * q - s / 2, width: s, height: s, borderRadius: "50%",
    background: "rgba(255,255,255,.75)", filter: "blur(18px)", opacity: k * Math.sin(Math.PI * q) * 0.8, zIndex: 30 }} />; })}</>;
const Ribbon = ({ x, y, t, s = 1 }) => (
  <svg width={170 * s} height={120 * s} viewBox="0 0 170 120" style={{ position: "absolute", left: x, top: y, zIndex: 25, overflow: "visible" }}>
    <path d={`M85 50 C60 10 20 15 25 45 C30 70 70 62 85 50 Z`} fill="#FBFBF7" stroke="#D8D6CE" strokeWidth={3} />
    <path d={`M85 50 C110 10 150 15 145 45 C140 70 100 62 85 50 Z`} fill="#FBFBF7" stroke="#D8D6CE" strokeWidth={3} />
    <path d={`M80 55 L ${55 + 6 * Math.sin(t * 3)} 118 L 68 112 M90 55 L ${118 + 6 * Math.sin(t * 3 + 1)} 116 L 104 112`} stroke="#FBFBF7" strokeWidth={14} fill="none" strokeLinecap="round" />
    <circle cx={85} cy={52} r={11} fill="#EDEBE4" />
  </svg>
);
// the hood underside: dark stamped steel with an insulation pad outline
const Hood = ({ t, children, close = 0 }) => (
  <div style={{ position: "absolute", left: -60, top: 380, width: 1200, height: 1260, perspective: 1800, zIndex: 5 }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `rotateX(${close * 80}deg)`, opacity: 1 - seg(close, 0.55, 0.95), borderRadius: "48px 48px 20px 20px", overflow: "hidden",
      background: `radial-gradient(120% 90% at 50% 30%, ${STEEL[0]}, ${STEEL[1]})`, boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 250, top: 80, width: 170, height: 1100, borderRadius: 60, background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.04)" }} />)}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 300, left: ((t * 120) % 2000) - 600, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.08), rgba(255,255,255,0))" }} />
      {children}
    </div>
  </div>
);
const Relay = ({ x, y, s = 1, burnt = 0, z = 20 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150 * s, height: 130 * s, zIndex: z }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 150 * s, height: 110 * s, borderRadius: 14 * s, background: "linear-gradient(160deg, #3a3d42, #15171a)", boxShadow: "0 10px 18px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {burnt > 0 && <div style={{ position: "absolute", right: -30 * s, top: -30 * s, width: 120 * s, height: 120 * s, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,40,20,.95) 0 30%, rgba(120,70,30,.6) 55%, rgba(0,0,0,0) 72%)", opacity: burnt }} />}
      <div style={{ position: "absolute", left: 16 * s, top: 18 * s, width: 70 * s, height: 10 * s, borderRadius: 4, background: "rgba(255,255,255,.25)" }} />
    </div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: (22 + i * 32) * s, top: 108 * s, width: 10 * s, height: 22 * s, background: "linear-gradient(90deg,#b88a3c,#f2d08a,#b88a3c)" }} />)}
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    his: at("his"), saturday: at("saturday,"), getaway: at("getaway"), so: at("so"), limps: at("limps"), shop: at("shop"), leland: at("leland's"), never: at("never"),
    your: at("your"), fan: at("fan's"), and2: at("and", 3), wired: at("wired"), who: at("who"), notes: at("notes?"), coldwater: at("coldwater,"), hang: at("hang"), page: at("page."),
    he: tl.after("he", at("page.")), opens: at("opens"), entry: at("entry"), hood: at("hood."), teller: at("teller"), twenty: at("twenty"), cauto: at("coldwater", 2), photo: at("photo."),
    relay: at("relay's"), tray: at("tray?"), found: at("found"), cooked: at("cooked."), shelf: at("shelf."), shelfE: tl.end("shelf."), before: tl.after("before", at("shelf.")), fanOn: at("shelf.") + 0.3, logs: at("logs"),
    two: at("two"), story: at("story"), good: at("good."), whoever: at("whoever"), next: at("next"), cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [0] : hook === "B" ? [2] : [0], hold: 1.2 };
  if (hook === "A") fx(hk, [hw[6].s, hw[8].s, hw[9].s, hw[10].s]);
  else fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Saturday. / Getaway car.", T.his), [T.saturday, T.getaway, at("car.")]), key: [0], hold: 0.7 },
    { words: [], key: [3], hold: 1.6, color: "#FFFFFF" },
    { ...ctaHead(tl, "Start your / car's record", T.cta), key: [3] },
  ];
  heads[2].words = [{ w: "Logged", t: T.logs, line: 0 }, { w: "by", t: T.logs + 0.25, line: 0 }, { w: "Two", t: T.two, line: 1 }, { w: "Forks.", t: at("forks"), line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the road (frame 0 and the CTA)
  const road = (t, phase) => {
    const end = phase === "end";
    const roll = end ? lerp(1250, 520, EASE.out(seg(t, T.cta - 0.6, T.cta + 2.2))) : lerp(860, 520, EASE.out(seg(t, 0, 3.6))) - (t > T.his ? 40 * EASE.io(seg(t, T.his, T.so)) : 0);
    const steam = end ? 0 : clamp(0.5 + t / 3);
    const bob = 3 * Math.sin(t * 7);
    const d = drift(t, "road", 3, 0.3);
    const rib = !end && t > T.saturday - 0.3 ? spr(t - (T.saturday - 0.3), 200, 14) : end ? 1 : 0;
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.04 + 0.02 * Math.sin(t * 0.2)})` }}>
        <Img src={src("F12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,250,240,.72) 0%, rgba(255,250,240,.35) 26%, rgba(255,255,255,0) 42%)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: bob, width: W, height: H }}>
        <Cut id="A17" cx={roll} cy={1440} w={960} shadow={0.45} />
        {rib > 0.01 && <div style={{ opacity: clamp(rib * 2), transform: `scale(${clamp(rib)})`, transformOrigin: `${roll + 300}px 1360px` }}><Ribbon x={roll + 280} y={1330} t={t} s={0.9} /></div>}
        <Steam t={t} x={roll - 400} y={1400} k={steam} />
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- Two Forks Garage: the bay, Leland steps out
  const bay = (t) => {
    const d = drift(t, "bay", 3, 0.3);
    const roll = lerp(1300, 600, EASE.out(seg(t, T.so - 0.3, T.leland)));
    const lel = spr(t - (T.leland - 0.1), 160, 17);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.05)` }}>
        <Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 55%", filter: "sepia(.25) saturate(1.1) brightness(1.02)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,240,215,.55) 0%, rgba(255,240,215,0) 40%)" }} />
      </div>
      {/* the painted shop sign */}
      <div style={{ position: "absolute", left: 120, top: 560, width: 840, padding: "26px 0", background: "linear-gradient(180deg, #F6EBD3, #E9D7B0)", borderRadius: 14, border: "6px solid #6B4E2E", textAlign: "center", boxShadow: "0 20px 30px -14px rgba(0,0,0,.5)",
        transform: `rotate(${-1 + 0.4 * Math.sin(t * 0.8)}deg) translateY(${(1 - spr(t - (T.so + 0.1), 170, 15)) * -300}px)` }}>
        <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 92, letterSpacing: "0.04em", color: "#6B2E1E", lineHeight: 1 }}>TWO FORKS</div>
        <div style={{ ...inter(46, "#6B4E2E", 700), letterSpacing: "0.3em", marginTop: 6 }}>GARAGE</div>
      </div>
      <Cut id="A16" cx={roll} cy={1400} w={900} shadow={0.45} />
      <Steam t={t} x={roll - 120} y={1330} k={0.7} seed={0.3} />
      {lel > 0.01 && <Cut id="E05" cx={lerp(1300, 860, clamp(lel))} cy={1460} w={520} shadow={0} />}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the engine bay (top-down): fan still, the odd wiring
  const WIRE = "M 300 1260 C 420 1180 520 1240 610 1150 C 690 1070 760 1120 820 1040";
  const engine = (t, phase) => {
    const d = drift(t, "eng", 3, 0.3);
    const spin = phase === "fixed" ? clamp((t - T.fanOn) / 0.6) : 0;
    const ang = phase === "fixed" ? 900 * Math.pow(Math.max(0, t - T.fanOn), 1.6) : 0;
    return <AbsoluteFill style={{ background: "#1E2024" }}>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.06 + 0.02 * seg(t, T.your, T.who)})` }}>
        <Img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", filter: "brightness(.8)" }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 560, borderRadius: 24, background: "radial-gradient(120% 100% at 50% 30%, #f4f5f7, #d9dce1)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        <Cut id="C12" cx={400} cy={290} w={700} shadow={0} />
        {/* fan blades: still, then a blur disc when it spins */}
        <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ position: "absolute", left: 120, top: 100, opacity: 0.9 }}>
          <g transform={`rotate(${ang})`}>{[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0 C 30 -40 40 -110 10 -150 C -10 -110 -20 -50 0 0" fill={`rgba(40,42,46,${0.95 - 0.7 * spin})`} transform={`rotate(${a})`} />)}</g>
          {spin > 0 && <circle r={150} fill={`rgba(60,62,66,${0.35 * spin})`} />}
          <circle r={26} fill="#2a2c30" />
        </svg>
      </div>
      {phase === "still" && <>
        <DrawPath d={WIRE} p={ez(t, T.wired - 0.1, 1.0, EASE.io)} color="#FF8A1F" width={12} z={40} />
        <div style={{ position: "absolute", left: 780, top: 990, width: 160, height: 110, borderRadius: 14, background: "linear-gradient(160deg, #4a4d52, #22252a)", boxShadow: "0 12px 20px rgba(0,0,0,.5)", zIndex: 41 }} />
        <div style={{ position: "absolute", left: 230, top: 1200, ...land(t, T.your + 0.3), zIndex: 45, padding: "14px 26px", borderRadius: 36, ...CARD }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 22, height: 22, borderRadius: 11, background: RED }} /><span style={inter(44, INK)}>Fan not running</span></div></div>
      </>}
      {phase === "fixed" && <div style={{ position: "absolute", left: 230, top: 1200, zIndex: 45, padding: "14px 26px", borderRadius: 36, ...CARD, ...land(t, T.fanOn + 0.3) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 22, height: 22, borderRadius: 11, background: "#34C759" }} /><span style={inter(44, INK)}>Fan running</span></div></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- Wendell with his phone
  const PH = { x: 560, y: 900, w: 330, h: 690 };
  const wendell = (t) => {
    const d = drift(t, "wen", 3, 0.3);
    const up = spr(t - (T.hang - 0.2), 170, 17);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="E08" cx={300} cy={1150} w={600} shadow={0} />
        <div style={{ position: "absolute", left: 70, top: 1500, padding: "14px 26px", borderRadius: 36, ...CARD, ...land(t, T.coldwater) }}><Who ch="W" name="Wendell" role="from Coldwater" bg="#0A84FF" size={60} /></div>
        <div style={{ position: "absolute", left: PH.x, top: PH.y + (1 - clamp(up)) * 500, width: PH.w, height: PH.h, borderRadius: 54, background: "#111", boxShadow: "0 30px 50px -16px rgba(0,0,0,.5)", padding: 14, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 42, background: "#F5F5F7", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 18, right: 18, top: 70, padding: 18, borderRadius: 22, background: "#fff", ...land(t, T.page - 0.3) }}>
              <div style={inter(42, INK, 650, { whiteSpace: "normal" })}>Electric fan</div><div style={inter(42, GREY, 500)}>Jun 2021</div></div>
            <div style={{ position: "absolute", left: 18, right: 18, top: 250, height: 140, borderRadius: 22, background: "#E9E9EE", ...land(t, T.page - 0.2) }} />
            <div style={{ position: "absolute", left: 18, right: 18, top: 410, height: 140, borderRadius: 22, background: "#E9E9EE", ...land(t, T.page - 0.1) }} />
            <Ripple t={t} t0={T.opens} x={150} y={130} />
          </div>
        </div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the hood underside with the record
  const hoodShot = (t, phase) => {
    const later = phase === "later";
    const close = later ? EASE.in(seg(t, T.good - 0.1, T.good + 0.5)) : 0;
    const mark = (t0) => ({ background: `linear-gradient(90deg, ${rgba("#FFD60A", 0.55)} ${100 * ez(t, t0, 0.35)}%, rgba(255,214,10,0) ${100 * ez(t, t0, 0.35)}%)`, borderRadius: 8, padding: "0 6px", margin: "0 -6px" });
    const hi = (t0) => (later ? {} : mark(t0));
    const newE = later ? spr(t - (T.logs - 0.1), 180, 17) : 0;
    return <AbsoluteFill style={{ background: "#121316" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 50% 100%, rgba(255,190,120,.25), rgba(0,0,0,0))" }} />
      {later && close > 0.01 && <div style={{ position: "absolute", inset: -40, opacity: seg(close, 0.3, 1), transform: `scale(${1.08 - 0.03 * seg(t, T.good, tl.last)})` }}>
        <Img src={src("F01")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 55%", filter: "sepia(.25) brightness(.95)" }} />
        <Cut id="A16" cx={620} cy={1400} w={900} shadow={0.45} /></div>}
      <Hood t={t} close={close}>
        <div style={{ position: "absolute", left: 120, top: 200, width: 960, borderRadius: 34, background: "#fff", padding: "34px 40px", boxSizing: "border-box", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
          <Sweep t={t} o={0.3} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Wordmark size={42} /><span style={inter(40, GREY, 500)}>· her build log</span></div>
          <div style={{ ...inter(60, INK, 700), marginTop: 18 }}>Electric fan conversion</div>
          <div style={{ display: "flex", gap: 22, marginTop: 14, alignItems: "baseline" }}>
            <span style={{ ...inter(48, INK, 600), ...hi(T.teller) }}>Teller Cooling</span><span style={{ ...inter(48, RED, 600), ...hi(T.twenty) }}>Jun 2021</span></div>
          <div style={{ marginTop: 14, display: "inline-block", ...hi(T.cauto) }}><Who ch="C" name="Coldwater Auto" role="garage" bg="#5E5CE6" size={56} /></div>
          <div style={{ marginTop: 22, display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ width: 300, height: 210, borderRadius: 22, overflow: "hidden", position: "relative", background: "radial-gradient(circle, #fff, #dfe2e6)", boxShadow: later ? "none" : `0 0 0 ${6 * ez(t, T.photo - 0.1, 0.3)}px #FFD60A` }}>
              <Cut id="C12" cx={150} cy={105} w={300} shadow={0} /></div>
            <div style={{ ...inter(46, "#3A3A3C", 550, { whiteSpace: "normal" }), width: 520 }}>Note: <span style={hi(T.relay)}>relay mounted under the battery tray</span></div>
          </div>
        </div>
        {later && newE > 0.01 && <div style={{ position: "absolute", left: 120, top: 830 + (1 - clamp(newE)) * 200, width: 960, borderRadius: 34, background: "#fff", padding: "30px 40px", boxSizing: "border-box", opacity: clamp(newE * 2), boxShadow: `0 0 0 5px ${rgba("#34C759", 0.5 * (1 - seg(t, T.logs + 0.4, T.story)))}, 0 20px 40px rgba(0,0,0,.5)` }}>
          <div style={inter(56, INK, 700)}>Fan relay replaced</div>
          <div style={{ display: "flex", gap: 22, marginTop: 10, alignItems: "center" }}><span style={inter(46, RED, 600)}>Oct 2026</span><Who ch="L" name="Two Forks" role="· Leland" bg="#FF9F0A" size={52} /></div>
          <div style={{ position: "absolute", right: 40, top: 30, width: 150, height: 130 }}><Relay x={0} y={0} s={0.9} /></div>
        </div>}
      </Hood>
      {later && t > T.good + 0.3 && <Cut id="E08" cx={300} cy={lerp(1900, 1400, ez(t, T.good + 0.2, 0.6))} w={560} shadow={0} />}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the battery tray: lifted, the cooked relay, the new one
  const tray = (t) => {
    const d = drift(t, "tray", 3, 0.3);
    const lift = ez(t, T.tray, 0.5, EASE.camera);
    const out = EASE.in(seg(t, T.shelf - 0.2, T.shelf + 0.2)), inn = spr(t - (T.shelf + 0.1), 260, 16);
    const probe = ez(t, T.tray + 0.45, 0.35);
    return <AbsoluteFill style={{ background: "radial-gradient(100% 70% at 50% 45%, #3A3D42, #16181B)" }}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: 160, top: 1000, width: 760, height: 420, borderRadius: 20, background: "linear-gradient(180deg, #2a2d31, #1b1d20)", boxShadow: "inset 0 0 0 6px #3a3d42" }} />
        {/* battery lifted away */}
        <div style={{ position: "absolute", left: 200, top: 620 - lift * 520, width: 680, height: 420, borderRadius: 26, background: "linear-gradient(170deg, #34373c, #121316)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", zIndex: 30, transform: `rotate(${-3 * lift}deg)` }}>
          <div style={{ position: "absolute", left: 80, top: -36, width: 90, height: 50, borderRadius: 10, background: "#C9302C" }} /><div style={{ position: "absolute", right: 80, top: -36, width: 90, height: 50, borderRadius: 10, background: "#2a2c30", border: "4px solid #555" }} /></div>
        <Relay x={460} y={1120 - out * 600} s={1.3} burnt={1} z={20} />
        {inn > 0.01 && <Relay x={460} y={1120 - (1 - clamp(inn)) * 500} s={1.3} burnt={0} z={21} />}
        {/* meter probes */}
        {probe > 0.01 && out < 0.5 && <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 25 }}>
          <path d={`M -40 ${1500 - 100 * probe} Q 250 1400 ${lerp(200, 480, probe)} ${lerp(1500, 1265, probe)}`} stroke="#d62b2b" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d={`M 1120 ${1500 - 100 * probe} Q 820 1400 ${lerp(900, 640, probe)} ${lerp(1500, 1265, probe)}`} stroke="#1a1a1a" strokeWidth={14} fill="none" strokeLinecap="round" /></svg>}
        <div style={{ position: "absolute", left: 300, top: 1460, padding: "14px 26px", borderRadius: 36, ...CARD, opacity: seg(t, T.found, T.found + 0.2) * (1 - seg(t, T.shelf - 0.2, T.shelf)), zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 22, height: 22, borderRadius: 11, background: RED }} /><span style={inter(44, INK)}>Relay: no signal</span></div></div>
      </div>
    </AbsoluteFill>;
  };

  const CARWIPE = (t, p) => { const x = lerp(1500, -900, EASE.io(p)); return <div style={{ position: "absolute", left: 0, top: 0, zIndex: 50, filter: "url(#mbx3)" }}><Cut id="A17" cx={x} cy={1440} w={1100} shadow={0.4} /></div>; };
  const shots = [
    { at: 0, render: (t) => road(t, "start") },
    { at: T.so - 0.05, render: bay, enter: { kind: "wipe", d: 0.75, dir: 1, edge: (p) => lerp(1500, -900, EASE.io(p)) + 550, obj: CARWIPE } },
    { at: T.your - 0.12, render: (t) => engine(t, "still"), enter: { kind: "rise", d: 0.55 } },
    { at: T.coldwater - 0.12, render: wendell, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.he - 0.05, render: (t) => hoodShot(t, "read"), enter: { kind: "portal", d: 0.7, rect: { x: PH.x + 14, y: PH.y + 14, w: PH.w - 28, h: PH.h - 28 }, r: 42 } },
    { at: T.found - 0.45, render: tray, enter: { kind: "rise", d: 0.5 } },
    { at: T.shelf + 0.2, render: (t) => engine(t, "fixed"), enter: { kind: "match" } },
    { at: T.logs - 0.35, render: (t) => hoodShot(t, "later"), enter: { kind: "rise", d: 0.55 } },
    { at: T.cta - 0.12, render: (t) => road(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "air-slow-push", 0.6], [T.saturday - 0.3, "pop-soft"], [T.so + 0.1, "slide-soft"], [T.leland - 0.1, "gravel", 0.6],
    [T.your + 0.3, "chip-pop"], [T.wired - 0.1, "draw"], [T.hang - 0.2, "slide-soft"], [T.page - 0.3, "pop-soft"], [T.opens, "tap"],
    [T.teller, "tick-soft"], [T.twenty, "tick-soft"], [T.cauto, "tick-soft"], [T.photo - 0.1, "tick-soft"], [T.relay, "pen-write", 0.6],
    [T.tray, "clunk"], [T.tray + 0.45, "tap"], [T.found, "low-hit", 0.6], [T.shelf - 0.2, "part-lift"], [T.shelf + 0.1, "torque-click"],
    [T.fanOn, "tint-swell"], [T.logs - 0.1, "card-rise"], [T.logs + 0.4, "check"], [T.good - 0.1, "clunk"], [ctaT, "cta-pop"],
  ];
  // road-movie warmth; the band stops while Leland tests the relay and comes back when the fan runs
  const music = { bpm: 98, root: 52, mode: "major", style: "warm", cut: T.found - 0.5, ret: T.shelf + 0.2, room: "shop" };
  return { shots, heads, sfx, music };
}
