// @ts-nocheck
// LB-07 (lane B, parts suppliers): "Same again, please" (ChatGPT concept and script, Claude build). Dana asks Birch
// Mile Wheels for the same tires again; the slip she remembers is from 2022, for wheels that aren't on her car anymore.
// She'd bought another set later and forgotten when. Ivo asks for her build link: the later entry has a date and a
// photo, today's set with the tire brand recorded. He still checks the fitted tires before ordering. The old slip goes
// in the drawer. CTA link.
// Device (reserved by ChatGPT): a correct old purchase slip sliding under the wrong current wheel. Upgrades: the 2022
// photo is the same car with the older black wheels composited on (C08), the current set is the car's own satin wheels;
// the wheel rolls between the two photos; tap-open from the link pill into the dated entry; match cut rim -> sidewall.
// Car: unbadged silver coupe A32 (bank has no violet coupe; requested). Dana E10, Ivo E05, counter F05.
// Fictional: Birch Mile Wheels, Dana, Ivo, Orris Wheelworks, Merrow Tire.
// remocn (ported): kinetic text, typewriter (link), simulated-cursor tap ripple, focus-blur-resolve, text-on-path
// (sidewall), period-drop. New vs the previous reels: text on a circular path, drawer close.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep, Ripple, Tick } from "./b2kit";

export const HOOK_WORDS = 7;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 110 };
export const IMAGES = ["A32", "C08", "C07", "F05", "E10", "E05"];
const HOOKS = { A: "The older set.", B: "Same as / which set?", C: "Right receipt…" };
const AR = 1609 / 624, WF = { u: 0.219, v: 0.70 }, WR = { u: 0.785, v: 0.70 }, WD = 0.168;

// the coupe; old = the 2022 black wheels composited over its own
const Coupe = ({ x, y, w, old = 0, spin = 0, shadow = 0.4, z }) => {
  const h = w / AR;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z }}>
    <Cut id="A32" cx={w / 2} cy={h / 2} w={w} shadow={shadow} />
    {old > 0.01 && [WF, WR].map((p, i) => <div key={i} style={{ position: "absolute", left: p.u * w - (WD * w) / 2, top: p.v * h - (WD * w) / 2, width: WD * w, height: WD * w, opacity: old, transform: `rotate(${spin}deg)` }}>
      <Img src={src("C08")} style={{ width: "100%", height: "100%" }} /></div>)}
  </div>;
};
// the purchase slip
const Slip = ({ t, x, y, w = 620, rot = 0, o = 1, blank = false, hi = -9, z = 30 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.62, transform: `rotate(${rot}deg)`, opacity: o, zIndex: z }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 620, height: 384, transformOrigin: "0 0", transform: `scale(${w / 620})`, background: "#FFFFFF", borderRadius: 10, boxShadow: "0 18px 30px -14px rgba(0,0,0,.4)", padding: "30px 36px", boxSizing: "border-box",
      backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 62px, rgba(0,0,0,.05) 62px 64px)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: "repeating-linear-gradient(90deg, #fff 0 12px, #E5E5EA 12px 24px)" }} />
      {!blank && <>
        <div style={inter(44, INK, 700)}>Birch Mile Wheels</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}><span style={inter(42, GREY, 500)}>Customer</span><span style={inter(44, INK, 600)}>Dana</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}><span style={inter(42, GREY, 500)}>Date</span>
          <span style={{ ...inter(44, t >= hi ? RED : INK, 600), background: t >= hi ? rgba(RED, 0.1 * ez(t, hi, 0.3)) : "none", borderRadius: 8, padding: "0 8px" }}>Jul 2022</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}><span style={inter(42, GREY, 500)}>Set</span><span style={inter(44, INK, 600)}>Black 17s + tires</span></div>
      </>}
      {blank && <div style={{ ...inter(44, "#C7C7CC", 600), marginTop: 10 }}>Birch Mile Wheels</div>}
    </div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    tells: at("tells"), same: at("“same", 1), remembering: at("remembering"), twentytwo: at("twenty-two."), but: at("but"), those: at("those"), anymore: at("anymore."),
    shed: at("she'd"), later: at("later,"), so: at("so"), ivo: at("ivo"), build: at("build"), link: at("link."), the: tl.after("the", at("link.")), entry: at("entry"),
    date: at("date"), photo: at("photo."), thats: at("that's"), tire: at("tire", 2), recorded: at("recorded."), he: at("he"), checks: at("checks"), fitted: at("fitted"),
    now: at("now"), same2: at("“same", 2), running: at("running."), old: at("old"), slip: at("slip"), drawer: at("drawer."), cta: tl.cta("log") ?? at("log"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [3] : [0], hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Same again.", T.same), [T.same, at("again,”")]), key: [1], hold: 1.6 },
    { ...fx(B("Different / wheels now.", T.those), [T.those, T.those + 0.3, T.anymore]), key: [0], hold: 1.0 },
    { ...fx(B("There was / another set.", T.shed), [T.shed, T.shed + 0.15, at("another"), at("set", 2)]), key: [2], hold: 0.8 },
    { ...fx(B("Check / what's fitted.", T.checks), [T.checks, T.fitted, T.fitted + 0.2]), key: [1], hold: 1.2 },
    { ...fx(B("This set.", T.now), [T.now + 0.1, T.same2 + 0.2]), key: [1], hold: 1.6 },
    { ...ctaHead(tl, "Record your / next set", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // close framing: front wheel at (540, 1150)
  const CW = 2400, CH = CW / AR, CX = 540 - WF.u * CW, CY = 1150 - WF.v * CH;
  const wheelShot = (t, phase) => {
    const d = drift(t, "wh", 3, 0.3);
    const cta = phase === "cta";
    const slipIn = cta ? spr(t - (T.cta + 0.3), 150, 18) : spr(t - 0.15, 150, 18);
    const out = phase === "hook" ? ez(t, T.tells - 0.3, 0.4, EASE.in) : 0;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: -200, right: -200, top: 1330, height: 600, background: "linear-gradient(180deg, #ECECEF, #E2E2E6)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.04 * t})`, transformOrigin: "540px 1150px" }}>
        <Slip t={t} x={lerp(-700, 240, clamp(slipIn))} y={1250} w={620} rot={-3} blank={cta} z={4} o={1 - out} />
        <Coupe x={CX} y={CY} w={CW} z={6} />
      </div>
    </Studio></AbsoluteFill>;
  };
  // the counter: Dana, her slip, the 2022 date
  const counter = (t) => {
    const d = drift(t, "ctr", 3, 0.3);
    const away = ez(t, T.but - 0.1, 0.5, EASE.in);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.05)` }}>
        <Img src={src("F05")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.06) saturate(.9)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(245,245,247,.85) 0%, rgba(245,245,247,.25) 34%, rgba(245,245,247,0) 60%)" }} />
      </div>
      <Cut id="E10" cx={340} cy={1500} w={700} shadow={0} />
      <Slip t={t} x={lerp(200, 1300, away)} y={lerp(1300, 600, spr(t - (T.tells - 0.2), 160, 17))} w={680} rot={lerp(-6, 3, ez(t, T.tells, 0.6))} hi={T.twentytwo} z={20} />
    </AbsoluteFill>;
  };
  // the two photos: 2022 (black wheels), then the later set (her own wheels), the wheel rolls between them
  const photos = (t) => {
    const d = drift(t, "ph", 3, 0.3);
    const p1 = spr(t - (T.but - 0.05), 170, 17), p2 = spr(t - (T.shed - 0.1), 170, 17);
    const roll = ez(t, T.shed - 0.2, 0.6, EASE.camera);
    const Print = ({ y, old, label, q, rot, dim }) => <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 470, background: "#fff", borderRadius: 26, boxShadow: "0 30px 50px -24px rgba(0,0,0,.4)", opacity: clamp(q * 2) * (1 - 0.45 * dim),
      transform: `translateX(${(1 - clamp(q)) * 500}px) rotate(${rot}deg)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 360, background: "radial-gradient(120% 90% at 50% 70%, #fff, #E9E9EE)", overflow: "hidden" }}>
        <Coupe x={70} y={40} w={760} old={old} spin={-roll * 360 * (old ? 1 : 0)} shadow={0.3} /></div>
      <div style={{ position: "absolute", left: 30, top: 380, display: "flex", alignItems: "center", gap: 18 }}>{label}</div>
    </div>;
    return <AbsoluteFill><Studio t={t}><Sweep t={t} w={1080} o={0.45} speed={300} /><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.02 * Math.max(0, t - T.but)})` }}>
      <Print y={560} old={1} q={p1} rot={-1.5} dim={roll} label={<><span style={{ ...inter(44, "#fff", 650), background: GREY, padding: "4px 16px", borderRadius: 12 }}>2022</span><span style={inter(44, GREY, 500)}>Black 17s</span></>} />
      {t > T.shed - 0.2 && <Print y={1070} old={0} q={p2} rot={1.2} dim={0} label={<><span style={{ ...inter(44, RED, 650), background: rgba(RED, 0.1), padding: "4px 16px", borderRadius: 12 }}>later · when?</span><span style={inter(44, INK, 600)}>The set on her car</span></>} />}
    </div></Studio></AbsoluteFill>;
  };
  // the link: Ivo asks, Dana's link pill
  const PILL = { x: 120, y: 1110, w: 840, h: 110 };
  const linkShot = (t) => {
    const d = drift(t, "lk", 3, 0.3);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Cut id="E05" cx={780} cy={1540} w={560} shadow={0} />
      <div style={{ position: "absolute", left: 90, top: 640, padding: "26px 34px", borderRadius: 40, ...CARD, ...land(t, T.ivo) }}>
        <Who ch="I" name="Ivo" role="Birch Mile Wheels" bg="#FF9F0A" size={64} />
        <div style={{ ...inter(52, INK, 600), marginTop: 18 }}>Got your build link?</div></div>
      <div style={{ position: "absolute", left: PILL.x, top: PILL.y, width: PILL.w, height: PILL.h, borderRadius: 55, ...CARD, display: "flex", alignItems: "center", gap: 18, padding: "0 34px", boxSizing: "border-box", ...land(t, T.build - 0.1) }}>
        <svg width={44} height={44} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke={RED} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
        <Typed t={t} t0={T.build} t1={T.link + 0.2} text="fuelmybuild.com/dana/coupe" style={inter(46, INK, 500)} keepCaret={0} />
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // the later entry: date, photo, parts registry
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, overflow: "hidden", transform: dT(d, 0.5) }}>
        <Sweep t={t} o={0.25} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 400, background: "radial-gradient(120% 90% at 50% 70%, #fff, #E9E9EE)", overflow: "hidden", ...land(t, T.the + 0.15) }}>
          <Coupe x={40} y={50} w={880} shadow={0.3} />
          <div style={{ position: "absolute", left: 24, top: 22, padding: "8px 20px", borderRadius: 26, background: "rgba(255,255,255,.85)" }}><Wordmark size={42} /></div></div>
        <div style={{ position: "absolute", left: 40, top: 424, ...inter(56, INK, 700), ...land(t, T.entry - 0.1) }}>Wheel and tire set purchased</div>
        <div style={{ position: "absolute", left: 40, top: 500, display: "flex", gap: 20, alignItems: "center", ...land(t, T.date - 0.05) }}>
          <span style={{ ...inter(48, RED, 650), background: rgba(RED, 0.08), padding: "2px 14px", borderRadius: 12 }}>Apr 26, 2024</span><span style={inter(44, GREY, 500)}>logged by Dana</span></div>
        {[["C07", "Wheels", "Orris Wheelworks", T.thats], ["C08", "Tires", "Merrow Tire", T.tire]].map(([img, k, v, tt], i) =>
          <div key={i} style={{ position: "absolute", left: 40, top: 600 + i * 170, width: 880, height: 150, borderRadius: 26, background: "#F2F2F7", display: "flex", alignItems: "center", gap: 24, padding: "0 24px", boxSizing: "border-box", ...land(t, tt) }}>
            <div style={{ width: 110, height: 110, position: "relative", flex: "none" }}><Cut id={img} cx={55} cy={55} w={104} shadow={0} style={{ filter: img === "C07" ? "saturate(0) brightness(1.2)" : undefined }} /></div>
            <div><div style={inter(42, GREY, 500)}>{k}</div><div style={inter(50, INK, 650)}>{v}</div></div>
            {i === 1 && <div style={{ marginLeft: "auto" }}><Tick p={seg(t, T.recorded, T.recorded + 0.4)} size={56} /></div>}
          </div>)}
      </div>
    </Studio></AbsoluteFill>;
  };
  // the sidewall check: the front wheel huge, MERROW on the sidewall, Ivo's tick
  const SW = 5000, SH = SW / AR;
  const sidewall = (t) => {
    const d = drift(t, "sw", 3, 0.3);
    const cx = 540, cy = 1000, r = (WD * SW) / 2;
    const ok = spr(t - (T.fitted + 0.3), 220, 16);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.03 * seg(t, T.he, T.now)})`, transformOrigin: "540px 1000px" }}>
        <Coupe x={cx - WF.u * SW} y={cy - WF.v * SH} w={SW} shadow={0} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs><path id="sidewall" d={`M ${cx - r * 0.86} ${cy} A ${r * 0.86} ${r * 0.86} 0 0 1 ${cx + r * 0.86} ${cy}`} /></defs>
          <text style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 64, letterSpacing: "0.3em" }} fill={`rgba(235,235,240,${0.55 + 0.35 * ez(t, T.checks, 0.4)})`}>
            <textPath href="#sidewall" startOffset="50%" textAnchor="middle">MERROW · 225/45</textPath></text>
        </svg>
        <div style={{ position: "absolute", left: 300, top: 1500, padding: "16px 30px", borderRadius: 40, ...CARD, display: "flex", alignItems: "center", gap: 16, opacity: clamp(ok * 2), transform: `scale(${0.9 + 0.1 * clamp(ok)})` }}>
          <Tick p={seg(t, T.fitted + 0.3, T.fitted + 0.8)} size={56} /><span style={inter(46, INK, 600)}>Merrow on the car</span></div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // the whole car, the drawer, the CTA
  const full = (t) => {
    const d = drift(t, "full", 3, 0.3);
    const dr = ez(t, T.old - 0.2, 0.4, EASE.out) * (1 - ez(t, T.drawer + 0.1, 0.4, EASE.in));
    const slipDrop = ez(t, T.slip - 0.1, 0.6, EASE.in);
    const fresh = spr(t - (T.cta + 0.4), 150, 18);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: -200, right: -200, top: 1180, height: 800, background: "linear-gradient(180deg, #ECECEF, #E2E2E6)" }} />
      <Sweep t={t} w={1080} o={0.5} speed={320} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.014 * Math.max(0, t - T.now)})`, transformOrigin: "540px 1000px" }}>
        <Coupe x={40} y={820} w={1000} />
        {/* the drawer: opens under the frame, the old slip drops in, it closes */}
        {t > T.old - 0.3 && t < T.drawer + 0.6 && <>
          <div style={{ position: "absolute", left: 140, top: lerp(1920, 1400, dr), width: 800, height: 260, borderRadius: 20, background: "linear-gradient(180deg, #C9A77C, #A9835A)", boxShadow: "0 -10px 30px rgba(0,0,0,.25)", zIndex: 20 }}>
            <div style={{ position: "absolute", left: 340, top: 30, width: 120, height: 24, borderRadius: 12, background: "#6B4E2E" }} /></div>
          <Slip t={t} x={240} y={lerp(1200, 1460, slipDrop)} w={lerp(560, 480, slipDrop)} rot={-4} o={1 - seg(slipDrop, 0.85, 1)} z={19} />
        </>}
        {fresh > 0.01 && <Slip t={t} x={lerp(-700, 70, clamp(fresh))} y={1225} w={600} rot={-2} blank z={4} />}
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(48, GREY, 500)} keepCaret={0.4} /></div>}
      </div>
    </Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => wheelShot(t, "hook") },
    { at: T.tells - 0.12, render: counter, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.but - 0.1, render: photos, enter: { kind: "match" } },
    { at: T.so - 0.1, render: linkShot, enter: { kind: "rise", d: 0.5 } },
    { at: T.the - 0.1, render: entry, enter: { kind: "tap", d: 0.5, rect: PILL, r: 55 } },
    { at: T.he - 0.1, render: sidewall, enter: { kind: "match" } },
    { at: T.now - 0.1, render: full, enter: { kind: "pull", d: 0.6, rect: { x: 40 + WF.u * 1000 - 90, y: 820 + WF.v * (1000 / AR) - 90, w: 180, h: 180 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.15, "slide-soft"], [T.tells - 0.2, "paper-flutter"], [T.twentytwo, "pop-soft"], [T.but - 0.1, "chip-slide-out"], [T.but, "photo-settle"],
    [T.shed - 0.2, "air-short"], [T.shed, "shutter"], [T.ivo, "pop-soft"], [T.build, "typing:0.8"], [T.the + 0.15, "card-settle"], [T.date - 0.05, "tick-soft"],
    [T.thats, "pop-soft"], [T.tire, "pop-soft"], [T.recorded, "check"], [T.checks, "cloth", 0.7], [T.fitted + 0.3, "check"],
    [T.old - 0.2, "slide-soft"], [T.slip, "paper-thud"], [T.drawer + 0.1, "clunk", 0.7], [T.cta + 0.4, "slide-soft"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 53, mode: "major", style: "warm", cut: T.the - 0.35, ret: T.he - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
