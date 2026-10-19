// @ts-nocheck
// LB-02 (lane B, collectors): "The fix was quiet" (ChatGPT concept and script, Claude build). Sound-led mystery. New owner
// Tessa's "fixed" passenger seat clicks again before she leaves the driveway. The old owner called padding a fix, but quiet
// and repaired aren't the same, so she leaves it parked for a check. She opens the previous owner's build entry: "temporary
// packing", with a photo. Her technician pulls the strip, finds rail movement and arranges a proper repair. Share CTA.
// Device (reserved): the peeling packing strip / muffled click. The click is drawn as a live sound line under the seat rail:
// sharp spikes when the seat clicks, flattened spikes while the strip muffles it. The strip carries the transitions.
// Car: K1-10 silver coupe graded to charcoal (the script's unbadged charcoal coupe; no maker named). Seat C09. Drawn: rail
// macro, foam strip, glove, old work photo, job sheet, tray. Fictional: Tessa, Linden Bench Auto.
// Transitions: rail click pulls back to the parked car (pull), the strip slides into the macro (match), the car rolls
// into the bay (whip), the loose photo rotates into the entry (rise + match), the photo's strip edge leads back into the
// rail (portal), the job sheet edge follows the seat back to the wide bay (match), CTA over the seat and the tray.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep } from "./b2kit";

export const HOOK_WORDS = 5;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["K1-10", "C09"];
const HOOKS = { A: "It came / back.", B: "Fixed / how?", C: "Click." };
const CHAR = { filter: "grayscale(1) brightness(.42) contrast(1.25)" };
const FOAM = "#E8D9B8";

// the sound line: low noise, with a decaying spike after each click (amp 1 = sharp, 0.25 = muffled)
const Wave = ({ t, clicks, x = 60, y, w = 960, h = 120, color = INK, o = 1 }) => {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, px = x + u * w;
    let v = Math.sin(u * 40 + t * 9) * 2.2 + Math.sin(u * 17 - t * 5) * 1.6;
    for (const c of clicks) {
      const dt = t - c.t; if (dt < 0 || dt > 1.4) continue;
      const travel = dt * 900, dist = Math.abs(px - (x + w / 2)) - travel * 0.0;
      const env = Math.exp(-dt * 5) * Math.exp(-Math.pow((px - (x + w / 2)) / (60 + travel * 0.5), 2));
      v += c.amp * h * 0.45 * env * Math.sin(px * 0.25 - dt * 60);
    }
    pts.push(`${px.toFixed(1)},${(y + v).toFixed(1)}`);
  }
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o, pointerEvents: "none" }}><polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" /></svg>;
};
// the macro: carpet, seat rail, seat base and bracket; strip (in, lift 0..1), rock (seat movement, deg)
const Glove = ({ x, y, s = 1 }) => (
  <svg width={520} height={300} viewBox="0 0 520 300" style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: `scale(${s})`, transformOrigin: "0 50%", zIndex: 6 }}>
    <defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5C8CEB" /><stop offset="1" stopColor="#2F5FC4" /></linearGradient></defs>
    <rect x={250} y={70} width={300} height={170} rx={70} fill="url(#gl)" />
    {[[40, 78, 230], [10, 118, 260], [30, 158, 240], [80, 196, 190]].map(([fx, fy, fw], i) => <rect key={i} x={fx} y={fy} width={fw + 40} height={40} rx={20} fill="url(#gl)" stroke="#244C9E" strokeWidth={3} />)}
    <rect x={150} y={30} width={170} height={46} rx={23} fill="url(#gl)" stroke="#244C9E" strokeWidth={3} transform="rotate(18 300 50)" />
    <path d="M 270 100 Q 300 160 280 220" stroke="rgba(255,255,255,.25)" strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
// the macro: carpet, seat rail, the seat on its bracket; strip (in 0..1), lift (one end up), rock (deg), glove, peel
const Rail = ({ t, strip = 0, lift = 0, rock = 0, glove = 0, peel = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 640, width: 1080, height: 820 }}>
    <div style={{ position: "absolute", left: -40, right: -40, top: 640, height: 140, backgroundColor: "#2E2F32", backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1px, transparent 2px)", backgroundSize: "7px 7px" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 640, transformOrigin: "300px 560px", transform: `rotate(${rock}deg)` }}>
      <Cut id="C09" cx={540} cy={500 - 300} w={480} shadow={0} />
      <div style={{ position: "absolute", left: 300, top: 486, width: 480, height: 62, borderRadius: 8, background: "linear-gradient(180deg, #9EA4AA, #5D6268)" }} />
      {[340, 740].map((bx) => <div key={bx} style={{ position: "absolute", left: bx - 18, top: 498, width: 36, height: 36, borderRadius: 18, background: "radial-gradient(#D7DBDF, #6B7177)" }} />)}
    </div>
    {strip > 0.01 && <div style={{ position: "absolute", left: lerp(1100, 330, strip) + peel * 700, top: 546 - lift * 40 - peel * 140, width: 420, height: 30, borderRadius: 6, background: FOAM, backgroundImage: "radial-gradient(rgba(120,90,40,.25) 1px, transparent 2px)", backgroundSize: "8px 6px", transformOrigin: "0 50%", transform: `rotate(${-lift * 6 - peel * 14}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.35)", zIndex: 3 }} />}
    <div style={{ position: "absolute", left: 40, top: 574, width: 1000, height: 72, borderRadius: 10, background: "linear-gradient(180deg, #C9CED3, #7D848B 60%, #5A6066)" }}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 68, top: 26, width: 34, height: 20, borderRadius: 4, background: "#33373B" }} />)}
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: ((t * 120) % 1300) - 200, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))" }} />
    </div>
    {glove > 0.01 && <Glove x={lerp(1150, 700, glove) + peel * 240} y={420 - peel * 110} />}
  </div>
);
// the old work photo of the strip (drawn macro, photo treatment)
const StripPhoto = ({ w, h, t }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#2A2B2E" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1460, transform: `scale(${w / 760}) translate(${-180}px, ${-980}px)`, transformOrigin: "0 0" }}>
      <Rail t={0} strip={1} /></div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, rgba(255,190,120,.28), rgba(0,0,0,.15) 70%)", mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 70px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${Math.sin(t * 0.6) * 4}px)` }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    tessa: at("tessa"), heard: at("heard"), driveway: at("driveway."), old: at("old"), padding: at("padding"), fix: at("fix."), but: at("but"), quiet: at("quiet"),
    repaired: at("repaired"), same: at("same,"), so: at("so"), parked: at("parked"), check: at("check."), first: at("first,"), opens: at("opens"), entry: at("entry,"),
    work: at("work,"), phrase: at("phrase."), says: at("says"), temporary: at("temporary"), photo: at("photo"), technician: at("technician"), look: at("look."),
    finds: at("finds"), movement: at("movement"), arranges: at("arranges"), proper: at("proper"), record: at("record"), explained: at("explained"), inspected: at("inspected"),
    cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook, hookEnd = hw[hw.length - 1].e;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [1] : [0], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Still / parked.", T.heard), [T.heard, T.driveway]), key: [1], hold: 0.4 },
    { ...fx(B("Padding?", T.padding), [T.padding]), key: [0], hold: 0.5 },
    { ...fx(B("Quiet isn't / repaired.", T.quiet), [T.quiet, at("aren't"), T.repaired]), key: [2], hold: 0.5 },
    { ...fx(B("The work, / not the phrase.", T.work), [T.work - 0.15, T.work, at("not"), tl.after("the", at("not")), T.phrase]), key: [1], hold: 0.4 },
    { ...fx(B("Rail / movement.", T.finds), [T.finds + 0.1, T.movement]), key: [1], hold: 0.5 },
    { ...ctaHead(tl, "Send to your / 'fixed it' friend.", T.cta), key: [3, 4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // the clicks (sharp) and the muffled ones under the strip
  const CL = [
    { t: hookEnd - 0.35, amp: 1 }, { t: T.heard + 0.25, amp: 1 }, { t: T.quiet + 0.1, amp: 0.22 }, { t: T.same + 0.1, amp: 0.8 },
    { t: T.movement - 0.1, amp: 1 }, { t: T.movement + 0.5, amp: 0.8 }, { t: tl.last + 0.5, amp: 0.7 },
  ];
  const rockAt = (t) => CL.reduce((r, c) => { const dt = t - c.t; return dt < 0 || dt > 0.6 ? r : r + c.amp * 1.4 * Math.exp(-dt * 9) * Math.sin(dt * 45); }, 0) + Math.sin(t * 2.4) * 0.12;

  // ---------------------------------------------------------------- 1. the seat, macro on the rail (hook); strip slides in; strip lifts; glove peels
  const macro = (t, phase) => {
    const d = drift(t, "ma" + phase, 3, 0.3);
    const hookP = phase === "hook";
    const strip = phase === "pad" ? EASE.camera(seg(t, T.padding - 0.3, T.fix)) : phase === "tech" ? 1 : 0;
    const lift = phase === "pad" ? EASE.io(seg(t, T.same - 0.2, T.same + 0.3)) * (1 - 0.6 * ez(t, T.so, 0.4)) : 0;
    const glove = phase === "tech" ? EASE.camera(seg(t, T.technician - 0.2, T.look)) * (1 - 0.0) : 0;
    const peel = phase === "tech" ? EASE.io(seg(t, T.look - 0.1, T.finds + 0.3)) : 0;
    const zoom = hookP ? 1.08 - 0.08 * ez(t, 0, 2.2, EASE.camera) : 1;
    const sheetIn = phase === "tech" ? spr(t - (T.arranges - 0.1), 180, 17) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${zoom})`, transformOrigin: "540px 1080px" }}>
      <Rail t={t} strip={strip} lift={lift} rock={rockAt(t)} glove={glove} peel={peel} />
      <Wave t={t} clicks={CL} y={1490} color={INK} o={0.85} />
      {sheetIn > 0.01 && <div style={{ position: "absolute", left: 60, top: 600, width: 520, padding: "24px 28px", background: "#FFFDF6", boxShadow: "0 18px 30px -14px rgba(0,0,0,.45)", transform: `rotate(${-3 + 2 * (1 - clamp(sheetIn))}deg) translateX(${(1 - clamp(sheetIn)) * -500}px)` }}>
        <div style={inter(42, GREY, 600)}>Linden Bench Auto</div><div style={{ ...inter(52, INK, 700), marginTop: 6 }}>Job sheet</div>
        <div style={{ ...inter(44, INK, 500), marginTop: 10 }}>Passenger seat rail</div>
        <div style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 700, color: RED, marginTop: 4 }}>Repair booked</div></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the parked charcoal coupe (driveway, then the bay)
  const car = (t, phase) => {
    const d = drift(t, "car" + phase, 3, 0.3);
    const bay = phase !== "drive";
    const roll = phase === "bay" ? EASE.camera(seg(t, T.so - 0.2, T.parked + 0.3)) : 1;
    const ring = (tt) => { const dt = t - tt; return dt < 0 || dt > 0.9 ? 0 : 1 - dt / 0.9; };
    const r = Math.max(ring(T.heard + 0.25), phase === "wide" ? ring(tl.last + 0.5) : 0);
    const tray = phase === "wide" ? spr(t - (T.record - 0.1), 170, 17) : 0;
    const cx = bay ? lerp(1500, 540, roll) : 540, cy = 1180, w = 1000;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {bay ? <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1340, height: 580, background: "linear-gradient(180deg, #E6E8EB, #D3D6DA)" }} />
        {[120, 960].map((x) => <div key={x} style={{ position: "absolute", left: x - 6, top: 1340, width: 12, height: 580, background: "#F2C94C", transform: "skewX(" + (x < 540 ? 20 : -20) + "deg)", transformOrigin: "0 0" }} />)}
        <div style={{ position: "absolute", left: 80, top: 640, ...inter(44, GREY, 600), opacity: 0.9 }}>Linden Bench Auto · Bay 2</div>
      </> : <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1340, height: 580, background: "linear-gradient(180deg, #DADBD7, #C7C8C3)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1340, height: 6, background: "#B9BAB4" }} />
      </>}
      <Cut id="K1-10" cx={cx} cy={cy} w={w} shadow={0.45} style={CHAR} />
      {/* passenger seat position (near side window): the click ring */}
      {r > 0 && <div style={{ position: "absolute", left: cx + 40 - 90, top: cy - 70 - 90, width: 180, height: 180, borderRadius: 90, border: `6px solid ${RED}`, transform: `scale(${0.4 + 0.9 * (1 - r)})`, opacity: r }} />}
      {phase === "drive" && <div style={{ position: "absolute", left: 80, top: 1440, padding: "14px 24px", borderRadius: 30, ...CARD, ...land(t, T.tessa) }}><Who ch="T" name="Tessa" role="new owner" bg="#FF9F0A" size={60} /></div>}
      {tray > 0.01 && <div style={{ position: "absolute", left: 300, top: 1440, width: 480, height: 90, borderRadius: 16, background: "linear-gradient(180deg, #E9ECEF, #B9BFC5)", boxShadow: "0 16px 24px -12px rgba(0,0,0,.4)", opacity: clamp(tray * 2), transform: `translateY(${(1 - clamp(tray)) * 60}px)` }}>
        <div style={{ position: "absolute", left: 40, top: 26, width: 400, height: 30, borderRadius: 6, background: FOAM, transform: "rotate(-3deg)" }} /></div>}
      {phase === "wide" && <Wave t={t} clicks={CL} y={1600} o={0.6} />}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the loose photo, then the entry around it
  const record = (t) => {
    const d = drift(t, "rc", 3, 0.25);
    const ph = spr(t - (T.first - 0.1), 150, 16);
    const rec = ez(t, T.says - 0.3, 0.7, EASE.camera);
    const hi = ez(t, T.temporary, 0.5, EASE.io);
    const fixedX = ez(t, T.phrase - 0.2, 0.4, EASE.io);
    const rot = lerp(-14, 0, clamp(ph)) * (1 - rec) + 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      {/* the old owner's phrase, crossed out */}
      <div style={{ position: "absolute", left: 120, top: 1440, opacity: (1 - rec) * clamp((t - T.because) * 3), ...inter(64, GREY, 600) }}>"Fixed it."
        <div style={{ position: "absolute", left: -10, top: 38, height: 6, width: 340 * fixedX, background: RED }} /></div>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· previous owner</span></div>
        <div style={{ position: "absolute", left: lerp(110, 40, rec), top: lerp(160, 110, rec), width: lerp(740, 880, rec), height: lerp(560, 460, rec), borderRadius: lerp(6, 26, rec), overflow: "hidden", transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * clamp(ph)})`, opacity: clamp(ph * 2), boxShadow: rec < 0.5 ? "0 30px 40px -20px rgba(0,0,0,.5), 0 0 0 14px #fff" : "none" }}>
          <StripPhoto w={lerp(740, 880, rec)} h={lerp(560, 460, rec)} t={t} /><Sweep t={t} w={880} o={0.25} /></div>
        <div style={{ position: "absolute", left: 40, top: 600, ...land(t, T.says - 0.1) }}><div style={inter(56, INK, 700)}>Passenger-seat noise</div>
          <div style={{ ...inter(46, RED, 650), marginTop: 6 }}>May 6, 2025</div></div>
        <div style={{ position: "absolute", left: 40, top: 780, padding: "12px 22px", borderRadius: 18, background: rgba("#FF9F0A", 0.22 * hi), ...land(t, T.temporary - 0.1) }}><span style={inter(52, INK, 650)}>Temporary packing</span></div>
        <div style={{ position: "absolute", left: 40, top: 880, ...inter(42, GREY, 500), ...land(t, T.photo) }}>Strip under the rail bracket · photo above</div>
      </div>
    </div></Studio></AbsoluteFill>;
  };
  T.because = at("because");

  const shots = [
    { at: 0, render: (t) => macro(t, "hook") },
    { at: T.tessa - 0.12, render: (t) => car(t, "drive"), enter: { kind: "pull", d: 0.6, rect: { x: 520, y: 1020, w: 160, h: 90 } } },
    { at: T.old - 0.12, render: (t) => macro(t, "pad"), enter: { kind: "portal", d: 0.6, rect: { x: 520, y: 1020, w: 160, h: 90 }, r: 20 } },
    { at: T.so - 0.12, render: (t) => car(t, "bay"), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.first - 0.12, render: record, enter: { kind: "rise", d: 0.5 } },
    { at: T.technician - 0.25, render: (t) => macro(t, "tech"), enter: { kind: "portal", d: 0.6, rect: { x: 170, y: 670, w: 800, h: 400 }, r: 26 } },
    { at: T.record - 0.15, render: (t) => car(t, "wide"), enter: { kind: "pull", d: 0.6, rect: { x: 420, y: 1060, w: 240, h: 140 } } },
    { at: T.cta - 0.12, render: (t) => ctaShot(t), enter: { kind: "match" } },
  ];
  // ---------------------------------------------------------------- CTA: the seat over the rail, strip on its tray beside it
  function ctaShot(t) {
    const d = drift(t, "ct", 3, 0.3);
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.05 * ctaP})`, transformOrigin: "540px 1100px" }}>
      <Cut id="C09" cx={500} cy={1010} w={560} rot={rockAt(t) * 0.8} shadow={0.35} />
      <div style={{ position: "absolute", left: 120, top: 1290, width: 840, height: 60, borderRadius: 10, background: "linear-gradient(180deg, #C9CED3, #7D848B 60%, #5A6066)" }} />
      <div style={{ position: "absolute", left: 600, top: 1410, width: 380, height: 80, borderRadius: 14, background: "linear-gradient(180deg, #E9ECEF, #B9BFC5)", boxShadow: "0 16px 24px -12px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 30, top: 24, width: 320, height: 28, borderRadius: 6, background: FOAM, transform: "rotate(-3deg)" }} /></div>
      <Wave t={t} clicks={CL} x={100} w={460} y={1460} o={0.7} />
    </div></Studio></AbsoluteFill>;
  }
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...CL.filter((c) => c.t < tl.last + 0.9).map((c) => [c.t, c.amp > 0.5 ? "torque-click" : "tick-soft", c.amp > 0.5 ? 1 : 0.6]),
    [T.tessa - 0.3, "clunk", 0.7], [T.padding - 0.3, "fabric-pull"], [T.so - 0.2, "whoosh"], [T.first - 0.2, "slide-soft"], [T.says - 0.3, "card-settle"],
    [T.technician - 0.3, "portal"], [T.look - 0.1, "fabric-pull"], [T.arranges - 0.1, "paper-thud"], [T.record - 0.2, "whoosh"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 92, root: 50, mode: "minor", style: "investigate", cut: T.says - 0.35, ret: T.technician - 0.25 };
  return { shots, heads, sfx, music };
}
