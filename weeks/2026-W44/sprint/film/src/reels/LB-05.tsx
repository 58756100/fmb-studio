// @ts-nocheck
// LB-05 (lane B, garages): "The block can wait" (ChatGPT concept and script, Claude build). Jori's best engine move was
// stopping. The block is back from the machine shop, but its measurement card has vanished from the bench. A coworker
// remembers one number; that's not enough to put somebody else's engine together, so they leave it alone. Jori remembers
// photographing the block before unpacking, with the card beside it: it's in the build log under machining, clear enough
// to read, but Jori still calls the machinist, who confirms and sends another copy. Measurements, not a good guess. Share
// CTA ("whoever photographs everything").
// Device (reserved): glove occlusion revealing the source photo. Jori's work glove stops the piston in the hook, turns
// over to show the empty bench, covers the card in the old photo and slides aside to reveal it, and returns for the loop.
// Images: block C15 (bank). Drawn: piston, glove, stand, card, sleeve, tray and cloth, wall phone, machinist's desk.
// Fictional: Jori, Hal Vale, Cedar Slot Engines, Vale Bench Machine. No measurement values are readable (source detail).
// Transitions: glove carries the camera down to the empty card space (match), lowering finger becomes the tray cover
// (wipe-like slide), shutter flash into the old photo (punch), photo straightens into the entry (match), tap opens the
// source crop (tap), phone cord leads to the machinist (whip), fresh sheet slides back to the bench (whip), CTA on the bench.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep, Ripple, Tick } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.5;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["C15"];
const HOOKS = { A: "Stop / here.", B: "The card's / missing.", C: "Waiting / on paper." };
const TAN = ["#D9B98C", "#B48A57", "#8C6638"];
const BORE = { x: 393, y: 964 }; // first bore of the block at cx 540 cy 1100 w 700

// a work glove, palm down, fingers pointing left. flip shows the palm (turned over)
const Glove = ({ x, y, rot = 0, s = 1, flip = 0, o = 1 }) => o <= 0.01 ? null : (
  <svg width={560} height={300} viewBox="0 0 560 300" style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: `rotate(${rot}deg) scale(${s}, ${s * (1 - 2 * flip * 0)})`, transformOrigin: "0 50%", opacity: o, zIndex: 40 }}>
    <defs><linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={flip > 0.5 ? TAN[1] : TAN[0]} /><stop offset="1" stopColor={TAN[2]} /></linearGradient></defs>
    <g transform={`translate(0 ${150 - 150 * Math.cos(flip * Math.PI)}) scale(1 ${Math.cos(flip * Math.PI)})`} style={{ transformOrigin: "0 150px" }}>
      <rect x={250} y={70} width={340} height={170} rx={70} fill="url(#gv)" stroke="#6E4E28" strokeWidth={3} />
      {[[40, 78, 230], [10, 118, 260], [30, 158, 240], [80, 196, 190]].map(([fx, fy, fw], i) => <rect key={i} x={fx} y={fy} width={fw + 40} height={40} rx={20} fill="url(#gv)" stroke="#6E4E28" strokeWidth={3} />)}
      <rect x={150} y={30} width={170} height={46} rx={23} fill="url(#gv)" stroke="#6E4E28" strokeWidth={3} transform="rotate(18 300 50)" />
      <rect x={520} y={60} width={60} height={190} rx={20} fill="#6E5A44" />
      {[300, 360, 420].map((sx) => <path key={sx} d={`M ${sx} 90 L ${sx + 10} 220`} stroke="rgba(110,78,40,.5)" strokeWidth={3} strokeDasharray="6 6" />)}
    </g>
  </svg>
);
// a piston with its rod
const Piston = ({ x, y, w = 150 }) => (
  <svg width={w} height={w * 2.2} viewBox="0 0 100 220" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.2, overflow: "visible", zIndex: 30 }}>
    <defs><linearGradient id="ps" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8E959C" /><stop offset=".4" stopColor="#F1F3F5" /><stop offset="1" stopColor="#7D848B" /></linearGradient></defs>
    <rect x={38} y={60} width={24} height={150} rx={8} fill="url(#ps)" stroke="#5A6068" strokeWidth={1.5} />
    <rect x={6} y={0} width={88} height={80} rx={10} fill="url(#ps)" stroke="#5A6068" strokeWidth={1.5} />
    {[14, 22, 30].map((gy) => <line key={gy} x1={6} y1={gy} x2={94} y2={gy} stroke="#5A6068" strokeWidth={1.5} />)}
  </svg>
);
// the machine shop's measurement card (values deliberately unreadable: source detail only)
const MCard = ({ x, y, w = 420, rot = 0, o = 1, s = 1, sharp = 1, copy = false, z = 20 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: "22px 24px", background: copy ? "#FFFFFF" : "#FBF7EC", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: z, borderTop: `10px solid ${copy ? "#5E5CE6" : "#C7A64A"}` }}>
    <div style={inter(42, GREY, 600)}>Vale Bench Machine</div>
    <div style={{ ...inter(46, INK, 700), marginTop: 4 }}>Measurement card</div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center" }}>
      <div style={{ width: 120, height: 14, borderRadius: 7, background: "#C9C6BC" }} />
      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "#7C7A72", filter: sharp < 1 ? `blur(${(1 - sharp) * 4}px)` : undefined }} />
    </div>)}
  </div>
);
// the bench: steel top, the block on its stand
const BenchScene = ({ t, children, blockO = 1, k = 1, ox = 540, oy = 1100, d }) => (
  <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${d ? dT(d, 0.6) : ""} scale(${k})`, transformOrigin: `${ox}px ${oy}px` }}>
    <div style={{ position: "absolute", left: -60, right: -60, top: 1290, height: 700, background: "linear-gradient(180deg, #C8CCD1, #AEB3B9 30%, #9EA3A9)" }} />
    <div style={{ position: "absolute", left: -60, right: -60, top: 1290, height: 10, background: "#E6E9EC" }} />
    <div style={{ position: "absolute", left: 360, top: 1290, width: 360, height: 40, background: "#3A3D42", borderRadius: "0 0 10px 10px" }} />
    {blockO > 0 && <Cut id="C15" cx={540} cy={1100} w={700} shadow={0.4} o={blockO} />}
    {children}
  </div></Studio></AbsoluteFill>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    jori: at("jori"), block: at("block"), card: at("card"), vanished: at("vanished"), bench: at("bench."), coworker: at("coworker"), number: at("number."), enough: at("enough"),
    so: at("so"), leave: at("leave"), alone: at("alone"), check: at("check"), back: at("back."), then: at("then"), photo: at("photo"), unpacking: at("unpacking,"),
    beside: at("beside"), its: at("it's"), log: at("log,"), machining: at("machining."), original: at("original"), sheet: at("sheet"), read: at("read,"), calls: at("calls"),
    machinist: at("machinist."), confirms: at("confirms"), sends: at("sends"), copy: at("copy."), now: at("now"), measurements: at("measurements,"), guess: at("guess."),
    waiting: at("waiting"), twice: at("twice."), cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook, hookEnd = hw[hw.length - 1].e;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [0] : [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Measurements / missing.", T.card), [at("measurement"), T.vanished]), key: [1], hold: 0.4 },
    { ...fx(B("Memory isn't / the sheet.", T.enough), [T.number, at("not"), T.enough, T.enough + 0.2]), key: [3], hold: 0.4 },
    { ...fx(B("In the / same frame.", T.beside), [at("while"), at("card", 2), T.beside, T.beside + 0.25]), key: [3], hold: 0.5 },
    { ...fx(B("Confirm with / the machinist.", T.calls), [T.calls, T.calls + 0.2, tl.after("the", T.calls), T.machinist]), key: [3], hold: 0.5 },
    { ...fx(B("Measurements, / not a guess.", T.measurements), [T.measurements, at("not", 2), tl.after("a", at("not", 2)), T.guess]), key: [0], hold: 0.6 },
    { ...ctaHead(tl, "Send to your / photo person.", T.cta), key: [3, 4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. hook: the piston descends; the glove stops it. Then the glove carries the camera to the empty card space
  const hookShot = (t) => {
    const d = drift(t, "hk", 3, 0.3);
    const pis = EASE.out(seg(t, 0, 1.4));
    const stop = EASE.camera(seg(t, 0.9, 1.5));
    return <BenchScene t={t} d={d} k={1.12 - 0.08 * ez(t, 0, hookEnd, EASE.camera)} ox={BORE.x} oy={BORE.y}>
      <Piston x={BORE.x} y={lerp(420, 640, pis) + 6 * Math.sin(t * 3) * stop} w={130} />
      <Glove x={lerp(1100, BORE.x - 120, stop)} y={760} rot={-4} s={0.85} />
    </BenchScene>;
  };
  const bench = (t) => {
    const d = drift(t, "be", 3, 0.3);
    const outline = ez(t, T.card - 0.1, 0.5, EASE.io);
    const turn = EASE.io(seg(t, T.vanished, T.bench + 0.3));
    const finger = EASE.camera(seg(t, T.coworker, T.number)) * (1 - EASE.io(seg(t, T.enough - 0.1, T.so)));
    const cover = EASE.camera(seg(t, T.leave - 0.2, T.alone + 0.3));
    const bub = spr(t - (T.number - 0.3), 190, 15) * (1 - ez(t, T.enough, 0.4));
    return <BenchScene t={t} d={d}>
      {/* the empty card space */}
      <div style={{ position: "absolute", left: 640, top: 1350, width: 380, height: 220, border: `5px dashed ${rgba(RED, 0.8)}`, borderRadius: 10, opacity: outline, transform: "rotate(-3deg)" }} />
      <Glove x={lerp(700, 610, turn)} y={lerp(1300, 1320, turn)} rot={-3} s={0.7} flip={turn} />
      {/* parts tray with pistons, then the cover */}
      <div style={{ position: "absolute", left: 70, top: 1370, width: 460, height: 160, borderRadius: 16, background: "linear-gradient(180deg, #5B6068, #3D4147)", boxShadow: "0 16px 24px -12px rgba(0,0,0,.45)", overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 105, top: 30, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(#F1F3F5, #8E959C)" }} />)}
        <div style={{ position: "absolute", left: 0, top: 0, width: 460 * cover, height: 160, background: "linear-gradient(180deg, #E4E1DA, #C9C4B8)", boxShadow: "4px 0 10px rgba(0,0,0,.3)" }} />
      </div>
      {/* the coworker's finger and the one remembered number (unreadable) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={`M ${lerp(-40, 120, finger)} ${lerp(820, 860, finger)} L ${lerp(100, 300, finger)} ${lerp(860, 900, finger)}`} stroke={TAN[1]} strokeWidth={46} strokeLinecap="round" opacity={finger > 0.02 ? 1 : 0} /></svg>
      {bub > 0.01 && <div style={{ position: "absolute", left: 120, top: 640, padding: "18px 28px", borderRadius: 30, ...CARD, transform: `scale(${clamp(bub)})`, transformOrigin: "0 100%", display: "flex", gap: 14, alignItems: "center" }}>
        <span style={inter(46, INK, 600)}>"It was</span><span style={{ ...inter(50, INK, 700), filter: "blur(9px)" }}>00.00</span><span style={inter(46, INK, 600)}>…"</span></div>}
      <div style={{ position: "absolute", left: 80, top: 640, ...land(t, T.jori), opacity: (land(t, T.jori).opacity ?? 1) * (1 - outline) }}><Who ch="J" name="Jori" role="Cedar Slot" bg="#FF9F0A" size={56} /></div>
    </BenchScene>;
  };
  // ---------------------------------------------------------------- 2. check what came back: empty sleeve; shutter flash into the old photo; the glove slides aside
  const sleeve = (t) => {
    const d = drift(t, "sl", 3, 0.3);
    const sl = spr(t - (T.check - 0.1), 180, 16);
    return <BenchScene t={t} d={d} k={1.04}>
      <div style={{ position: "absolute", left: 540, top: 1330, width: 420, height: 240, borderRadius: 12, background: "linear-gradient(160deg, rgba(220,232,240,.85), rgba(170,190,205,.65))", border: "3px solid rgba(255,255,255,.8)", transform: `rotate(-4deg) translateY(${(1 - clamp(sl)) * 80}px)`, opacity: clamp(sl * 2), boxShadow: "0 16px 24px -12px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 24, top: 18, ...inter(42, "#55606A", 600) }}>Vale Bench Machine</div>
        <div style={{ position: "absolute", left: 24, top: 80, ...inter(42, "#7B8691", 500) }}>(empty)</div></div>
      <Sweep t={t} w={1080} o={0.25} />
    </BenchScene>;
  };
  const OldPhoto = ({ t, w, h, reveal = 1 }) => (
    <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#B9BEC4" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${w / 980}) translate(-50px, -760px)`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: -60, right: -60, top: 1290, height: 700, background: "linear-gradient(180deg, #BFC3C8, #A6ABB1)" }} />
        <Cut id="C15" cx={540} cy={1100} w={700} shadow={0.4} />
        <MCard x={640} y={1330} w={400} rot={-3} />
        <Glove x={lerp(580, 900, reveal)} y={1330} rot={-3} s={0.72} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,230,190,.25), rgba(0,0,0,.08))" }} />
    </div>
  );
  const photo = (t) => {
    const d = drift(t, "ph", 3, 0.3);
    const flash = t > T.photo - 0.05 && t < T.photo + 0.4 ? 1 - (t - T.photo + 0.05) / 0.45 : 0;
    const reveal = EASE.io(seg(t, T.beside - 0.3, T.beside + 0.9));
    const par = ez(t, T.photo, 4, EASE.camera);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 60, top: 580, width: 960, padding: 18, paddingBottom: 20, background: "#fff", boxShadow: "0 30px 50px -24px rgba(0,0,0,.45)", transform: `rotate(${lerp(-4, -1.5, par)}deg) translateX(${lerp(-20, 10, par)}px)` }}>
        <OldPhoto t={t} w={924} h={860} reveal={reveal} />
      </div>
    </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: clamp(flash) }} />
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the entry around the photo; tap opens the source crop
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    const rec = ez(t, T.its - 0.1, 0.7, EASE.camera);
    const open = EASE.camera(seg(t, T.original - 0.35, T.sheet + 0.2));
    const ph = { x: lerp(40, 0, open), y: lerp(110, 0, open), w: lerp(880, 960, open), h: lerp(520, 1000, open) };
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: 1000, ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· customer's engine</span></div>
        <div style={{ position: "absolute", left: 40, top: 660, ...land(t, T.log), opacity: (land(t, T.log).opacity ?? 1) * (1 - open) }}><div style={inter(54, INK, 700)}>Block returned from machining</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Aug 19, 2026</span><span style={inter(42, GREY, 500)}>Jori · Cedar Slot Engines</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 840, padding: "10px 20px", borderRadius: 22, background: "#F2F2F5", ...land(t, T.machining), opacity: (land(t, T.machining).opacity ?? 1) * (1 - open) }}><span style={inter(42, INK, 600)}>Machining</span></div>
        <div style={{ position: "absolute", left: ph.x, top: ph.y, width: ph.w, height: ph.h, borderRadius: lerp(26, 44, open), overflow: "hidden", zIndex: 5 }}>
          {/* the photo crop, then the full-resolution source crop on the card */}
          <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1, 1.0, open)})` }}><OldPhoto t={t} w={ph.w} h={ph.h * (1 - open) + 1} reveal={1} /></div>
          {open > 0.01 && <div style={{ position: "absolute", inset: 0, background: "#D8D2C2", opacity: clamp(open * 1.6) }}>
            <MCard x={100} y={260} w={700} rot={-1.5} s={1} sharp={1} z={1} /></div>}
        </div>
        <Ripple t={t} t0={T.original - 0.4} x={700} y={420} />
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. the machinist: original + fresh copy
  const machinist = (t) => {
    const d = drift(t, "ma", 3, 0.3);
    const copyOut = spr(t - (T.sends - 0.1), 160, 16);
    const away = EASE.in(seg(t, T.copy + 0.1, T.now - 0.1));
    const tick = ez(t, T.confirms, 0.6);
    return <AbsoluteFill style={{ background: "#ECE7DD" }}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1180, height: 760, background: "linear-gradient(180deg, #9C7B55, #7E6143)" }} />
      <div style={{ position: "absolute", left: 80, top: 600, width: 300, height: 120, borderRadius: 60, background: "#2B2E33", display: "flex", alignItems: "center", justifyContent: "center", ...land(t, T.machinist - 0.3) }}><span style={inter(44, "#fff", 600)}>Hal Vale</span></div>
      <MCard x={120} y={900} w={460} rot={-3} />
      <div style={{ position: "absolute", left: 470, top: 880, ...land(t, T.confirms) }}><Tick p={tick} size={90} /></div>
      <MCard x={lerp(560, -900, away)} y={lerp(1300, 1260, clamp(copyOut))} w={460} rot={4 - 2 * clamp(copyOut)} o={clamp(copyOut * 2)} copy />
      <div style={{ position: "absolute", left: 560, top: 760, ...inter(42, "#6B5A45", 600), opacity: 0.9 }}>Vale Bench Machine</div>
    </div></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 5. back on the bench: fresh sheet beside the photo; cover off; glove over the block (and CTA)
  const ready = (t, end) => {
    const d = drift(t, "re" + (end ? "e" : ""), 3, 0.3);
    const inS = end ? 1 : spr(t - (T.now - 0.2), 160, 17);
    const off = end ? 1 : EASE.camera(seg(t, T.waiting - 0.1, T.twice));
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const gl = end ? EASE.io(seg(t, tl.last - 0.9, tl.last + 0.4)) : 0;
    return <BenchScene t={t} d={d} k={1 - 0.04 * ctaP}>
      <MCard x={lerp(1200, 560, clamp(inS))} y={1300} w={420} rot={-3} copy />
      <div style={{ position: "absolute", left: 780, top: 1170, width: 200, height: 150, padding: 8, background: "#fff", transform: "rotate(6deg)", boxShadow: "0 10px 18px -8px rgba(0,0,0,.4)", opacity: clamp(inS), zIndex: 21 }}><OldPhoto t={t} w={184} h={134} /></div>
      <div style={{ position: "absolute", left: 70, top: 1370, width: 460, height: 160, borderRadius: 16, background: "linear-gradient(180deg, #5B6068, #3D4147)", boxShadow: "0 16px 24px -12px rgba(0,0,0,.45)", overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 105, top: 30, width: 90, height: 90, borderRadius: 45, background: "radial-gradient(#F1F3F5, #8E959C)" }} />)}
        <div style={{ position: "absolute", left: 460 * off, top: 0, width: 460, height: 160, background: "linear-gradient(180deg, #E4E1DA, #C9C4B8)" }} />
      </div>
      <Glove x={lerp(700, BORE.x - 120, gl)} y={lerp(1180, 760, gl)} rot={-4} s={lerp(0.7, 0.85, gl)} />
    </BenchScene>;
  };

  const shots = [
    { at: 0, render: hookShot },
    { at: T.jori - 0.12, render: bench, enter: { kind: "match" } },
    { at: T.check - 0.12, render: sleeve, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.photo - 0.05, render: photo, enter: { kind: "punch" } },
    { at: T.its - 0.12, render: entry, enter: { kind: "match" } },
    { at: T.calls + 0.1, render: machinist, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.now - 0.12, render: (t) => ready(t, false), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.cta - 0.12, render: (t) => ready(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.2, "slide-soft"], [1.2, "fabric-pull"], [1.5, "muted-stop"], [T.card - 0.1, "draw"], [T.vanished, "cloth"], [T.number - 0.3, "msg-pop"], [T.leave - 0.2, "cloth"],
    [T.check - 0.2, "whoosh"], [T.photo - 0.05, "shutter"], [T.beside - 0.3, "fabric-pull"], [T.its - 0.1, "card-settle"], [T.original - 0.4, "tap"],
    [T.calls, "key-turn"], [T.calls + 0.1, "whip"], [T.confirms, "check"], [T.sends - 0.1, "paper-unfold"], [T.now - 0.2, "whip"], [T.waiting - 0.1, "cloth-toss"],
    [ctaT, "cta-pop"], [tl.last - 0.6, "fabric-pull"],
  ];
  const music = { bpm: 96, root: 48, mode: "minor", style: "investigate", cut: T.its - 0.3, ret: T.calls + 0.1 };
  return { shots, heads, sfx, music };
}
