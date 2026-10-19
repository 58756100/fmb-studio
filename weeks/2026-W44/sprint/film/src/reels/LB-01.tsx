// @ts-nocheck
// LB-01 (lane B, collectors): "It goes down. Does it come back up?" (ChatGPT concept and script, Claude build). Ellis is
// buying a silver roadster from two states away. The seller said the roof worked; Ellis watched it open, but nobody showed
// it closing again. He can't press the button himself, and he wants the seal replacement explained: careful maintenance,
// maybe, but not proof the roof behaves today. He asks for the build link before his inspection: rear seal replaced in
// June, with a photo and the fitting garage. Now his request is specific: show it closing, including that seal. It closes,
// and he still keeps the inspection. LINK CTA ("Start at fuelmybuild.com").
// Device (reserved): the folding roof / incomplete cycle. A drawn cloth roof folds over the roof-down cutout; its return
// arc stays a dashed, unfinished path until the second video, where the roof closes and the arc completes.
// Car: K1-04 silver collector roadster (no maker named in VO; unbadged cutout). Drawn: roof, player, chair, button, seal,
// seal-fitting photo, calendar. Fictional: Ellis, Alder Bay Auto, Mina.
// Transitions: hinge into the player (portal), playback edge becomes the return arc (match), chair arm leads to the button
// (whip), button ring becomes the seal (match), photo settles into the entry (rise), seal in the photo match-cuts to
// today's seal in the fresh video (match), latch line back to Ellis's calendar (whip), CTA over the roadster.
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
export const IMAGES = ["K1-04"];
const HOOKS = { A: "Half / a test.", B: "Out of / state.", C: "It opens…" };
const IW = 2047, IH = 708;
const UP = [[1040, 82], [1110, 64], [1380, 64], [1520, 118], [1650, 228], [1300, 214], [1060, 198]];
const DN = [[1330, 198], [1360, 178], [1520, 178], [1565, 190], [1605, 226], [1450, 222], [1330, 214]];
const WUP = [[1090, 96], [1365, 88], [1468, 168], [1105, 190]];

// the roadster with its drawn cloth roof. p: 0 roof up (closed), 1 folded down (open). arc: the dashed return path
const Roadster = ({ cx, cy, w, p = 1, arc = 0, arcDone = 0, glint = 0, o = 1 }) => {
  const h = w * IH / IW;
  const pts = UP.map((u, i) => [lerp(u[0], DN[i][0], p), lerp(u[1], DN[i][1], p)]);
  const win = WUP.map(([x, y]) => [lerp(x, 1440, p), lerp(y, 200, p)]);
  return <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <Cut id="K1-04" cx={cx} cy={cy} w={w} shadow={0.35} />
    <svg width={w} height={h} viewBox={`0 0 ${IW} ${IH}`} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, overflow: "visible" }}>
      <defs><linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3D42" /><stop offset="1" stopColor="#1E2023" /></linearGradient></defs>
      {arc > 0 && <path d="M 1100 70 Q 1340 -120 1560 190" fill="none" stroke={arcDone > 0 ? RED : GREY} strokeWidth={9} strokeDasharray={arcDone > 0 ? "1" : "24 18"} pathLength={1} style={{ strokeDasharray: arcDone > 0 ? `${arcDone} 1` : "0.04 0.03" }} opacity={arc} />}
      <polygon points={pts.map((q) => q.join(",")).join(" ")} fill="url(#rf)" stroke="#111" strokeWidth={4} />
      {p < 0.7 && <polygon points={win.map((q) => q.join(",")).join(" ")} fill="rgba(200,215,228,.55)" opacity={1 - p / 0.7} />}
      {p > 0.6 && [0, 1, 2].map((i) => <path key={i} d={`M ${1345 + i * 6} ${200 - i * 7} L ${1560 - i * 8} ${200 - i * 7}`} stroke="rgba(255,255,255,.15)" strokeWidth={4} opacity={(p - 0.6) / 0.4} />)}
      <rect x={1040 + 600 * glint} y={60} width={40} height={170} fill="rgba(255,255,255,.12)" transform="skewX(-20)" />
    </svg>
  </div>;
};
// a plain video player card (not FMB UI)
const Player = ({ t, x, y, w = 960, h = 620, prog = 0, children, live = false }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, background: "#111214", overflow: "hidden", boxShadow: "0 30px 50px -26px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #E9ECEF, #CDD2D7)" }} />
    {children}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55))" }} />
    <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 8, borderRadius: 4, background: "rgba(255,255,255,.35)" }}>
      <div style={{ width: `${prog * 100}%`, height: 8, borderRadius: 4, background: "#fff" }} /></div>
    <div style={{ position: "absolute", left: 30, top: 24, padding: "6px 16px", borderRadius: 16, background: "rgba(0,0,0,.45)", ...inter(42, "#fff", 600) }}>{live ? "Today" : "Seller's video"}</div>
  </div>
);
// the rubber seal profile (hollow bulb on a flat flange), rotating slowly in 3/4
const Seal = ({ x, y, s = 1, rot = 0 }) => (
  <svg width={420 * s} height={300 * s} viewBox="0 0 420 300" style={{ position: "absolute", left: x - 210 * s, top: y - 150 * s, overflow: "visible", transform: `rotate(${rot}deg)` }}>
    <defs><linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#55585D" /><stop offset="1" stopColor="#141517" /></linearGradient></defs>
    {[0, 1, 2, 3].map((k) => <g key={k} transform={`translate(${k * 22} ${-k * 14})`} opacity={k === 3 ? 1 : 0.35 + k * 0.15}>
      <rect x={40} y={190} width={260} height={30} rx={8} fill="url(#sl)" />
      <path d="M 90 192 C 90 90 250 90 250 192 Z M 125 192 C 125 128 215 128 215 192 Z" fill="url(#sl)" fillRule="evenodd" />
      <path d="M 300 205 L 360 170 L 368 182 L 306 220 Z" fill="#26282B" />
    </g>)}
    <path d="M 160 112 Q 200 98 240 116" stroke="rgba(255,255,255,.3)" strokeWidth={6} fill="none" strokeLinecap="round" transform="translate(66 -42)" />
  </svg>
);
// the seal-fitting photo (drawn, phone-photo treatment): the rear roof edge, the new seal half pressed in, a trim tool
const SealPhoto = ({ w, h, t, press = 1 }) => (
  <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "linear-gradient(170deg, #6A6E74, #2C2E31)" }}>
    <svg width={w} height={h} viewBox="0 0 880 480" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <path d="M -20 300 Q 440 200 900 300 L 900 480 L -20 480 Z" fill="#B9BEC4" />
      <path d="M -20 300 Q 440 200 900 300" stroke="#E6E9EC" strokeWidth={6} fill="none" />
      <path d="M -20 284 Q 440 184 900 284" stroke="#111214" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M 520 262 Q 700 250 900 276" stroke="#2C2E31" strokeWidth={30} fill="none" transform="translate(0 -26)" />
      <path d="M -20 220 Q 440 120 900 220 L 900 -20 L -20 -20 Z" fill="#2A2C30" />
      <g transform={`translate(${470 + 8 * Math.sin(t * 1.2)} 150) rotate(28)`}><rect x={0} y={0} width={60} height={190} rx={14} fill="#F2B632" /><path d="M 6 190 L 30 240 L 54 190 Z" fill="#E0A21E" /></g>
    </svg>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,220,170,.22), rgba(0,0,0,.15))" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    seller: at("seller"), watched: at("watched"), open: at("open."), but: at("but"), closing: at("closing"), again: at("again."), hes: at("he's"), away: at("away,"),
    lean: at("lean"), button: at("button"), himself: at("himself."), and: at("and", 2), seal: at("seal"), explained: at("explained."), could: at("could"), maintenance: at("maintenance."),
    today: at("today."), so: at("so", 2), link: at("link"), inspection: at("inspection."), there: at("there"), rear: at("rear"), replaced: at("replaced"), photo: at("photo"),
    garage: at("garage."), now: at("now"), show: at("show"), closing2: at("closing", 2), closes: at("closes,"), keeps: at("keeps"), inspection2: at("inspection.", 2),
    thats: at("that's"), answer: at("answer."), cta: tl.cta("start") ?? at("start"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook, hookEnd = hw[hw.length - 1].e;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [0] : hook === "B" ? [2] : [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("…and back / up?", T.but), [T.but, T.closing, T.again]), key: [2], hold: 0.5 },
    { ...fx(B("Two states / away.", T.hes), [at("two"), at("states"), T.away]), key: [2], hold: 0.4 },
    { ...fx(B("A repair, / not an answer.", T.could), [T.could, T.maintenance, at("doesn't"), at("roof"), T.today]), key: [3, 4], hold: 0.5 },
    { ...fx(B("Rear seal / replaced.", T.rear), [T.rear, T.rear + 0.15, T.replaced]), key: [2], hold: 0.6 },
    { ...fx(B("Close it / fully.", T.show), [T.show, T.closing2, at("including"), at("seal", 3)]), key: [2], hold: 0.4 },
    { ...fx(B("Keep the / inspection.", T.keeps), [T.keeps, T.keeps + 0.15, T.inspection2]), key: [2], hold: 0.5 },
    { ...ctaHead(tl, "Start your / car's record.", T.cta), key: [2, 3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. hook: the roof folds into the deck; the return arc stays dashed
  const hookShot = (t) => {
    const d = drift(t, "hk", 3, 0.3);
    const p = EASE.io(seg(t, 0.3, hookEnd - 0.2));
    const push = EASE.in(seg(t, T.seller - 0.6, T.seller));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.9 * push})`, transformOrigin: "640px 1080px" }}>
      <div style={{ position: "absolute", left: 90, top: 1300, width: 900, height: 120, borderRadius: "50%", background: "radial-gradient(closest-side, #E4E5E9, rgba(228,229,233,0))" }} />
      <Roadster cx={540} cy={1150} w={1000} p={p} arc={ez(t, hookEnd - 0.6, 0.5)} glint={(t * 0.3) % 1} />
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the seller's video: it opens; the clip ends with the roof down
  const video = (t, live) => {
    const d = drift(t, "vd" + (live ? "l" : ""), 3, 0.3);
    const p = live ? 1 - EASE.io(seg(t, T.closing2 - 0.2, T.closes)) : EASE.io(seg(t, T.watched, T.open + 0.6));
    const prog = live ? seg(t, T.now - 0.1, T.closes + 0.4) : seg(t, T.seller, T.again);
    const arcO = live ? 1 : ez(t, T.closing - 0.3, 0.5);
    const latch = live ? spr(t - T.closes, 220, 14) : 0;
    const cam = live ? EASE.camera(seg(t, T.closing2 - 0.2, T.closes)) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Player t={t} x={60} y={640} w={960} h={720} prog={prog} live={live}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1.25 + 0.15 * cam}) translate(${-60 * cam}px, 0)`, transformOrigin: "60% 55%" }}>
          <Roadster cx={480} cy={400} w={900} p={p} arc={arcO} arcDone={live ? seg(t, T.closing2 - 0.2, T.closes) : 0} glint={(t * 0.3) % 1} /></div>
        {!live && t > T.again && <div style={{ position: "absolute", left: 420, top: 270, width: 120, height: 120, borderRadius: 60, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center", ...land(t, T.again) }}>
          <svg width={50} height={50} viewBox="0 0 50 50"><path d="M 14 8 L 42 25 L 14 42 Z" fill="#fff" /></svg></div>}
        {latch > 0.01 && <div style={{ position: "absolute", left: 520, top: 210, width: 100, height: 100, borderRadius: 50, border: `6px solid ${RED}`, transform: `scale(${0.5 + 0.8 * clamp(latch)})`, opacity: 1 - clamp((t - T.closes) / 1.2) }} />}
      </Player>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. two states away: the empty chair beside the small window; the button nobody presses
  const away = (t) => {
    const d = drift(t, "aw", 3, 0.3);
    const btn = EASE.camera(seg(t, T.lean - 0.3, T.button));
    const ring = 0.5 + 0.5 * Math.sin(t * 4);
    const finger = EASE.camera(seg(t, T.press ?? T.button - 0.4, T.button + 0.2)) * (1 - ez(t, T.himself + 0.1, 0.4));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ opacity: 1 - btn, transform: `scale(${1 - 0.1 * btn})`, transformOrigin: "540px 1000px" }}>
        <Player t={t} x={540} y={700} w={440} h={300} prog={1}><div style={{ position: "absolute", inset: 0, transform: "scale(1)" }}><Roadster cx={220} cy={170} w={420} p={1} /></div></Player>
        <svg width={520} height={760} viewBox="0 0 520 760" style={{ position: "absolute", left: 60, top: 760 }}>
          <rect x={90} y={40} width={300} height={360} rx={50} fill="#3A3D42" /><rect x={60} y={380} width={360} height={90} rx={30} fill="#2B2E33" />
          <rect x={230} y={470} width={20} height={170} fill="#55595F" /><path d="M 120 680 L 240 640 L 360 680" stroke="#55595F" strokeWidth={16} fill="none" strokeLinecap="round" />
          <rect x={30} y={330} width={40} height={140} rx={16} fill="#26292D" /><rect x={410} y={330} width={40} height={140} rx={16} fill="#26292D" /></svg>
      </div>
      {btn > 0.01 && <div style={{ position: "absolute", left: 540 - 170, top: 1000 - 170, width: 340, height: 340, borderRadius: 170, background: "radial-gradient(circle at 40% 35%, #F4F5F6, #9AA0A6 70%, #6E747A)", boxShadow: `0 0 0 ${16 + 10 * ring}px ${rgba(RED, 0.18 * btn)}, 0 20px 40px rgba(0,0,0,.35)`, opacity: btn, transform: `scale(${0.6 + 0.4 * btn})` }}>
        <svg width={340} height={340} viewBox="0 0 340 340" style={{ position: "absolute", inset: 0 }}><path d="M 100 200 Q 170 110 240 200" stroke="#3A3D42" strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M 230 160 L 248 204 L 204 200" stroke="#3A3D42" strokeWidth={12} fill="none" strokeLinejoin="round" /></svg></div>}
      {btn > 0.5 && <div style={{ position: "absolute", left: 600, top: lerp(1900, 1210, finger), width: 120, height: 520, borderRadius: "60px 60px 30px 30px", background: "linear-gradient(90deg, #C98F6E, #E7B595 45%, #D09A78)", opacity: 0.95 }} />}
    </div></Studio></AbsoluteFill>;
  };
  T.press = at("press");
  // ---------------------------------------------------------------- 4. the seal; the fitting photo; "doesn't mean the roof will behave today"
  const seal = (t) => {
    const d = drift(t, "se", 3, 0.3);
    const ph = spr(t - (T.could - 0.2), 160, 16);
    const strike = ez(t, at("doesn't") - 0.1, 0.6, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Seal x={540 - 260 * clamp(ph)} y={lerp(1000, 760, clamp(ph))} s={lerp(1.5, 0.8, clamp(ph))} rot={-6 + 8 * Math.sin(t * 0.8)} />
      {ph > 0.01 && <div style={{ position: "absolute", left: 220, top: 860, width: 700, padding: 14, paddingBottom: 18, background: "#fff", boxShadow: "0 24px 40px -20px rgba(0,0,0,.45)", transform: `rotate(${3 - 2 * clamp(ph)}deg) translateY(${(1 - clamp(ph)) * 120}px)`, opacity: clamp(ph * 2) }}>
        <SealPhoto w={672} h={480} t={t} /></div>}
      {strike > 0.01 && <div style={{ position: "absolute", left: 160, top: 1420, padding: "14px 26px", borderRadius: 30, ...CARD, opacity: strike }}>
        <span style={{ ...inter(46, INK, 600), position: "relative" }}>Roof works today<div style={{ position: "absolute", left: -6, right: -6, top: 28, height: 5, background: RED, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} /></span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 5. the build link, then the entry around the photo
  const entry = (t) => {
    const d = drift(t, "en", 3, 0.25);
    const pill = spr(t - (T.link - 0.2), 190, 16);
    const rec = ez(t, T.there - 0.2, 0.7, EASE.camera);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      {rec < 0.99 && <div style={{ position: "absolute", left: 160, top: 1000, padding: "18px 30px", borderRadius: 40, ...CARD, opacity: clamp(pill * 2) * (1 - rec), transform: `scale(${0.8 + 0.2 * clamp(pill)})` }}><span style={inter(46, "#0A64D8", 600)}>fuelmybuild.com/silver-roadster</span></div>}
      <Ripple t={t} t0={T.inspection - 0.3} x={540} y={1040} />
      <div style={{ position: "absolute", left: 60, top: 600, width: 960, height: 980, ...CARD, opacity: rec, transform: `translateY(${(1 - rec) * 80}px)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center" }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· silver roadster</span></div>
        <div style={{ position: "absolute", left: 40, top: 110, width: 880, height: 480, borderRadius: 26, overflow: "hidden" }}><SealPhoto w={880} h={480} t={t} /><Sweep t={t} w={880} o={0.25} /></div>
        <div style={{ position: "absolute", left: 40, top: 630, ...land(t, T.rear) }}><div style={inter(56, INK, 700)}>Rear seal replaced</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Jun 8, 2024</span><span style={inter(42, GREY, 500)}>Alder Bay Auto</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 810, padding: "12px 22px", borderRadius: 30, background: "#F2F2F5", ...land(t, T.garage - 0.2) }}><Who ch="M" name="Mina" role="fitted it" bg="#30B0C7" size={58} /></div>
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 6. Ellis keeps the inspection: paper desk calendar
  const calendar = (t) => {
    const d = drift(t, "ca", 3, 0.3);
    const circ = ez(t, T.inspection2 - 0.3, 0.6, EASE.io);
    const fold = EASE.io(seg(t, T.thats - 0.1, T.thats + 0.6));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <Roadster cx={540} cy={1150} w={960} p={0} o={fold} />
      <div style={{ position: "absolute", left: 160, top: 640, width: 760, height: 820, ...CARD, borderRadius: 18, transformOrigin: "50% 0", transform: `perspective(1600px) rotateX(${fold * 100}deg)`, opacity: 1 - fold * 0.9, overflow: "hidden" }}>
        <div style={{ height: 120, background: RED, display: "grid", placeItems: "center" }}><span style={inter(56, "#fff", 700)}>Thursday</span></div>
        <div style={{ textAlign: "center", ...inter(260, INK, 700), lineHeight: 1.1, marginTop: 30 }}>14</div>
        <div style={{ position: "relative", margin: "20px auto 0", width: 520, textAlign: "center" }}>
          <span style={{ fontFamily: "Caveat", fontSize: 70, fontWeight: 700, color: INK }}>10:00 inspection</span>
          <svg width={600} height={170} style={{ position: "absolute", left: -40, top: -40, overflow: "visible" }}><ellipse cx={300} cy={85} rx={290} ry={70} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="1500" strokeDashoffset={1500 * (1 - circ)} /></svg>
        </div>
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 7. the closed roadster tilts; CTA over it, the roof starts folding toward the hook
  const final = (t, end) => {
    const d = drift(t, "fi" + (end ? "e" : ""), 3, 0.3);
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const p = end ? EASE.io(seg(t, tl.last - 0.4, tl.last + 1.4)) * 0.6 : 0;
    const url = end ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} rotate(${Math.sin(t * 0.5) * 1.2}deg) scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1150px" }}>
      <div style={{ position: "absolute", left: 90, top: 1300, width: 900, height: 120, borderRadius: "50%", background: "radial-gradient(closest-side, #E4E5E9, rgba(228,229,233,0))" }} />
      <Roadster cx={540} cy={1150} w={1000} p={p} arc={end ? 0.6 : 0} arcDone={end ? 1 : 0} glint={(t * 0.3) % 1} />
      <div style={{ position: "absolute", left: 650, top: 1330, ...land(t, end ? -9 : T.thats + 0.2) }}><Tick p={end ? 1 : ez(t, T.thats + 0.2, 0.6)} size={70} /></div>
      {end && url > 0.01 && <div style={{ position: "absolute", left: 230, top: 1450, padding: "16px 28px", borderRadius: 34, ...CARD, display: "flex", gap: 14, alignItems: "center", opacity: clamp(url * 2), transform: `translateY(${(1 - clamp(url)) * 30}px)` }}><Wordmark size={44} /><span style={inter(44, GREY, 500)}>fuelmybuild.com</span></div>}
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: hookShot },
    { at: T.seller - 0.1, render: (t) => video(t, false), enter: { kind: "match" } },
    { at: T.hes - 0.12, render: away, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.and - 0.12, render: seal, enter: { kind: "match" } },
    { at: T.so - 0.12, render: entry, enter: { kind: "rise", d: 0.5 } },
    { at: T.now - 0.12, render: (t) => video(t, true), enter: { kind: "match" } },
    { at: tl.after("and", T.closes) - 0.1, render: calendar, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.thats + 0.4, render: (t) => final(t, false), enter: { kind: "match" } },
    { at: T.cta - 0.12, render: (t) => final(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.3, "creak-soft"], [hookEnd - 0.3, "tape-click"], [T.seller - 0.3, "portal"], [T.watched, "creak-soft"], [T.again, "muted-stop"], [T.hes - 0.2, "whip"],
    [T.button - 0.3, "air-slow-push"], [T.seal, "leather-slide"], [T.could - 0.2, "photo-settle"], [at("doesn't"), "pencil-line"], [T.link - 0.2, "pop-soft"], [T.inspection - 0.3, "tap"],
    [T.there - 0.2, "card-settle"], [T.garage - 0.2, "pop-soft"], [T.closing2 - 0.2, "creak-soft"], [T.closes, "torque-click"], [T.inspection2 - 0.3, "pencil-write"],
    [T.thats - 0.1, "paper-flutter"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 96, root: 53, mode: "major", style: "observe", cut: T.so - 0.3, ret: T.now - 0.12 };
  return { shots, heads, sfx, music };
}
