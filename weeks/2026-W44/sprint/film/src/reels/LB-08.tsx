// @ts-nocheck
// LB-08 (lane B, parts suppliers): "The date won't tell you" (ChatGPT concept and script, Claude build). Two revisions,
// one unhelpful purchase date. Nessa needs to identify her fitted shifter; the maker revised it but old stock stayed
// available, so the purchase date won't settle which fits. She needs its identifier. Her old install photo shows the
// edge clearly; she opens it in her build log, sends the maker the link, and the maker confirms the early plate from its
// identifying notch. She adds that confirmation, keeping the original install date. Share CTA.
// Device (reserved by ChatGPT): the plate edge / revision notch. One notched selector plate carries the transitions;
// the camera follows its edge; the notch stays hidden by the crop until the maker reads it.
// Car: liftback A40 (bank; the script's orange liftback is requested). Boxes D14. Drawn: the plate, the console photo,
// the maker's reference drawing, the revision notice, the date note. Fictional: Nessa, Kelm Shift, Hale Arc Auto.
// Transitions: plate-edge pans (match), box edge follows the plate edge, date note folds down, the drawing's notch
// guides the camera into the install photo (portal), the record arrives around the fixed photo, the photo edge match-cuts
// to the maker's drawing, the confirmation note returns to the record, CTA over the plate and the car.
// remocn (ported): focus-pull (date note), card fold, inline highlight, focus-blur-resolve, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A40", "D14"];
const HOOKS = { A: "Which / revision?", B: "Does the date / tell you?", C: "Later isn't / revised." };
const BLUEP = "#1F3F8F";

// the selector plate: brushed metal, H-gate slot, bolt holes; notch on the right edge (shown when notch > 0)
const Plate = ({ x, y, w = 520, rot = 0, notch = 1, glint = 0, ink = false }) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 400 300" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.375, transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    <defs><linearGradient id={`pl${ink ? "i" : ""}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={ink ? "#fff" : "#E9ECEF"} /><stop offset=".5" stopColor={ink ? "#fff" : "#AEB4BA"} /><stop offset="1" stopColor={ink ? "#fff" : "#7C838A"} /></linearGradient></defs>
    <path d={`M 40 20 L 360 20 Q 380 20 380 40 L 380 ${notch ? 130 : 260} ${notch ? "L 360 140 L 380 150" : ""} L 380 260 Q 380 280 360 280 L 40 280 Q 20 280 20 260 L 20 40 Q 20 20 40 20 Z`}
      fill={`url(#pl${ink ? "i" : ""})`} stroke={ink ? BLUEP : "#5C636A"} strokeWidth={ink ? 4 : 3} />
    <path d="M 130 90 L 130 210 M 200 90 L 200 210 M 270 90 L 270 210 M 130 150 L 270 150" stroke={ink ? BLUEP : "#2B2F33"} strokeWidth={ink ? 4 : 22} strokeLinecap="round" fill="none" />
    {[[50, 50], [350, 50], [50, 250], [350, 250]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={10} fill={ink ? "none" : "#3A3F45"} stroke={ink ? BLUEP : "none"} strokeWidth={3} />)}
    {!ink && <rect x={-60 + 520 * glint} y={0} width={50} height={300} fill="rgba(255,255,255,.35)" transform="skewX(-20)" />}
  </svg>
);
const DateNote = ({ x, y, fold = 0, blur = 0, rot = -6 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 380, padding: "20px 26px", background: "#FFFDF4", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", transformOrigin: "50% 100%", transform: `rotate(${rot}deg) perspective(900px) rotateX(${fold * 80}deg)`, opacity: Math.max(0, 1 - Math.max(0, fold - 0.45) * 2.6), filter: blur > 0.3 ? `blur(${blur}px)` : undefined, zIndex: 20 }}>
    <div style={inter(40, GREY, 500)}>Purchased</div><div style={{ fontFamily: "Caveat", fontSize: 76, fontWeight: 700, color: INK }}>2019</div></div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    nessa: at("nessa"), fitted: at("fitted"), the: at("the"), maker: at("maker"), old: at("old"), stock: at("stock"), so: at("so"), purchase: at("purchase"), settle: at("settle"),
    she: at("she"), identifier: at("identifier,"), guess: at("guess."), her: at("her", 2), photo: at("photo"), edge: at("edge"), so2: at("so", 2), opens: at("opens"), log: at("log."),
    she2: at("she", 3), sends: at("sends"), link: at("link,"), confirms: at("confirms"), early: at("early"), notch: at("notch."), she3: at("she", 4), adds: at("adds"), keeping: at("keeping"),
    cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [2] : [2], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Old stock / stayed available.", T.old), [T.old, T.stock, at("stayed"), at("available.")]), key: [1], hold: 0.4 },
    { ...fx(B("The date / isn't enough.", T.purchase), [T.purchase, at("date"), T.settle, at("fits.")]), key: [1], hold: 0.4 },
    { ...fx(B("Find the / identifier.", T.she), [T.she, T.she + 0.2, T.identifier]), key: [2], hold: 0.8 },
    { ...fx(B("Early / plate.", T.early), [T.early, at("plate")]), key: [1], hold: 0.5 },
    { ...ctaHead(tl, "Send to / 'all the same'", T.cta), key: [] },
  ];
  heads[heads.length - 1].words = [{ w: "Send", t: T.cta, line: 0 }, { w: "to", t: at("to", 2), line: 0 }, { w: "'all", t: at("all"), line: 1 }, { w: "the", t: tl.after("the", at("all")), line: 1 }, { w: "same'", t: at("same”"), line: 1 }];
  heads[heads.length - 1].key = [4];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the plate (hook), the car, the shelf, the date note
  const plate = (t, phase) => {
    const d = drift(t, "pl" + phase, 3, 0.3);
    const end = phase === "end";
    const turn = end ? 0 : Math.sin(t * 0.7) * 6;
    const noteBlur = end ? 0 : ez(t, 0.8, 1.2) * 6;
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.03 * ctaP})` }}>
        {end && <Cut id="A40" cx={540} cy={1380} w={980} shadow={0.4} />}
        {/* the crop hides the notch (right edge) until the end, where the full plate shows */}
        <div style={{ position: "absolute", left: end ? 120 : 0, top: end ? 560 : 640, width: end ? 840 : 820, height: end ? 520 : 760, overflow: "hidden", borderRadius: 30 }}>
          <Plate x={end ? 420 : 560} y={end ? 260 : 380} w={end ? 560 : 900} rot={turn} notch={end ? 1 : 1} glint={(t * 0.35) % 1} />
        </div>
        <DateNote x={end ? 640 : 560} y={end ? 1000 : 1240} blur={noteBlur} />
      </div>
    </Studio></AbsoluteFill>;
  };
  const car = (t) => {
    const d = drift(t, "car", 3, 0.3);
    const ring = spr(t - (T.fitted - 0.1), 200, 15);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Cut id="A40" cx={540} cy={1150} w={1000} shadow={0.4} />
      <div style={{ position: "absolute", left: 470, top: 960, width: 120, height: 120, borderRadius: 60, border: `8px solid ${RED}`, transform: `scale(${clamp(ring)})`, boxShadow: `0 0 0 ${10 + 4 * Math.sin(t * 5)}px ${rgba(RED, 0.2)}` }} />
      <div style={{ position: "absolute", left: 70, top: 1440, padding: "14px 26px", borderRadius: 30, ...CARD, ...land(t, T.nessa) }}><Who ch="N" name="Nessa" role="her liftback" bg="#FF9F0A" size={56} /></div>
    </div></Studio></AbsoluteFill>;
  };
  const shelf = (t) => {
    const d = drift(t, "sh", 3, 0.3);
    const fold = ez(t, T.so - 0.1, 0.5, EASE.in);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 60, top: 1180, width: 960, height: 40, borderRadius: 8, background: "linear-gradient(180deg, #C9A77C, #8E6E4B)" }} />
      <Cut id="D14" cx={300} cy={1010} w={360} shadow={0.3} />
      <div style={{ position: "absolute", left: 180, top: 1060, padding: "6px 16px", background: "#fff", ...inter(42, INK, 700), boxShadow: "0 4px 8px rgba(0,0,0,.25)" }}>Kelm · early</div>
      <div style={{ position: "absolute", left: 560, top: 620, width: 420, padding: "26px 28px", background: "#FFFFFF", boxShadow: "0 18px 30px -14px rgba(0,0,0,.4)", transform: "rotate(2deg)", ...land(t, T.maker) }}>
        <div style={inter(42, GREY, 600)}>KELM SHIFT</div><div style={{ ...inter(48, INK, 700), marginTop: 8 }}>Revision notice</div>
        <div style={{ ...inter(42, "#3A3A3C", 500, { whiteSpace: "normal" }), marginTop: 8 }}>Selector plate revised.</div></div>
      <DateNote x={600} y={1300} fold={fold} />
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the maker's reference drawing (blueprint)
  const drawing = (t, phase) => {
    const d = drift(t, "dr" + phase, 3, 0.3);
    const ring = phase === "maker" ? ez(t, T.notch - 0.4, 0.6, EASE.io) : ez(t, T.identifier, 0.6, EASE.io);
    const note = phase === "maker" ? spr(t - (T.early - 0.1), 200, 15) : 0;
    return <AbsoluteFill style={{ background: "#F2F5FB" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(31,63,143,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(31,63,143,.07) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: 80, top: 580, width: 920, height: 820, background: "#fff", boxShadow: "0 20px 40px -20px rgba(0,0,0,.3)", borderRadius: 8 }}>
          <div style={{ position: "absolute", left: 30, top: 24, ...inter(42, BLUEP, 700) }}>KELM SHIFT · reference</div>
          <Plate x={420} y={400} w={620} notch={1} ink />
          <svg width={920} height={820} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <ellipse cx={700} cy={400} rx={90} ry={90} fill="none" stroke={RED} strokeWidth={7} strokeDasharray="600" strokeDashoffset={600 * (1 - ring)} /></svg>
          {phase === "maker" && <div style={{ position: "absolute", left: 40, top: 640, width: 360, height: 150, borderRadius: 10, overflow: "hidden", boxShadow: "0 10px 20px -8px rgba(0,0,0,.4)", ...land(t, T.confirms - 0.3) }}><ConsolePhoto w={360} h={150} /></div>}
        </div>
        {note > 0.01 && <div style={{ position: "absolute", left: 600, top: 1320, padding: "18px 28px", background: "#FFF6C9", transform: `rotate(${4 - 2 * clamp(note)}deg) scale(${0.8 + 0.2 * clamp(note)})`, opacity: clamp(note * 2), boxShadow: "0 14px 24px -12px rgba(0,0,0,.45)" }}>
          <div style={{ fontFamily: "Caveat", fontSize: 72, fontWeight: 700, color: INK }}>Early plate</div><div style={{ fontFamily: "Caveat", fontSize: 50, fontWeight: 600, color: GREY }}>Kelm Shift</div></div>}
      </div>
    </AbsoluteFill>;
  };
  // the console-off install photo (drawn, photographic treatment)
  function ConsolePhoto({ w, h, t = 0 }) { return <div style={{ position: "relative", width: w, height: h, background: "radial-gradient(120% 90% at 40% 40%, #3A3C40, #141517)", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.2) 0 1px, transparent 2px)", backgroundSize: "6px 6px" }} />
    <div style={{ position: "absolute", left: w * 0.08, top: h * 0.05, width: w * 0.84, height: h * 0.9 }}><Plate x={w * 0.42} y={h * 0.45} w={w * 0.72} notch={1} /></div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,210,150,.18), rgba(0,0,0,0) 60%)" }} /></div>; }
  // ---------------------------------------------------------------- the build log entry around the fixed photo, then the added confirmation
  const log = (t) => {
    const d = drift(t, "lg", 3, 0.25);
    const rec = ez(t, T.log - 0.2, 0.6, EASE.camera);
    const add = spr(t - (T.adds - 0.1), 190, 17);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· Nessa's build log</span></div>
        <div style={{ position: "absolute", left: lerp(0, 40, rec), top: lerp(0, 110, rec), width: lerp(960, 880, rec), height: lerp(620, 420, rec), borderRadius: 22, overflow: "hidden" }}><ConsolePhoto w={lerp(960, 880, rec)} h={lerp(620, 420, rec)} /></div>
        <div style={{ position: "absolute", left: 40, top: 560, ...land(t, T.log) }}><div style={inter(54, INK, 700)}>Shifter fitted</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 6 }}><span style={{ ...inter(46, RED, 650) }}>Jul 11, 2019</span><span style={inter(42, GREY, 500)}>Kelm Shift · Hale Arc Auto</span></div></div>
        {add > 0.01 && <div style={{ position: "absolute", left: 40, top: 770, width: 880, padding: "20px 24px", borderRadius: 24, background: rgba("#34C759", 0.12), opacity: clamp(add * 2), transform: `translateY(${(1 - clamp(add)) * 40}px)` }}>
          <div style={inter(48, "#1E7F3A", 700)}>Revision confirmed</div><div style={inter(42, "#3A3A3C", 500)}>Oct 2026 · Kelm Shift: early plate</div></div>}
      </div>
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => plate(t, "hook") },
    { at: T.nessa - 0.12, render: car, enter: { kind: "match" } },
    { at: T.the - 0.12, render: shelf, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.she - 0.12, render: (t) => drawing(t, "ref"), enter: { kind: "rise", d: 0.5 } },
    { at: T.her - 0.12, render: log, enter: { kind: "portal", d: 0.6, rect: { x: 640, y: 940, w: 180, h: 180 }, r: 90 } },
    { at: T.sends - 0.12, render: (t) => drawing(t, "maker"), enter: { kind: "match" } },
    { at: T.she3 - 0.12, render: log, enter: { kind: "match" } },
    { at: T.cta - 0.12, render: (t) => plate(t, "end"), enter: { kind: "rise", d: 0.5 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "slide-soft"], [0.8, "lens-settle"], [T.fitted - 0.1, "pop-soft"], [T.maker, "paper-thud"], [T.so - 0.1, "card-fold"], [T.identifier, "draw"],
    [T.her - 0.4, "portal"], [T.log - 0.2, "card-settle"], [T.link, "tap"], [T.notch - 0.4, "draw"], [T.early - 0.1, "paper-thud"], [T.adds - 0.1, "check"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 98, root: 52, mode: "minor", style: "investigate", cut: T.log - 0.3, ret: T.sends - 0.12 };
  return { shots, heads, sfx, music };
}
