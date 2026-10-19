// @ts-nocheck
// SC-05 (lane C, garages): Otis on his creeper under a customer's car: the other hangers are rubber, this one's bent
// steel. He was ready to cut it, but the weld's tidy, so he checked the car's build page first. July 2022: the rubber
// one tore, the muffler hit the diff cover, so a bracket went on. "Hang on, that's my creeper in the photo." Logged by...
// Otis. "Oh. That was me." Checked it, added today's note. It's staying.
// Device: the creeper view. The camera lies on its back for the whole film (G08 exhaust underside as the ceiling, warm
// swinging work light). When the record appears, the floor pan above him opens into one card like a hatch; a push-in on
// the photo's corner finds the red-taped creeper handle, which match-cuts to the same handle at the frame edge.
// Drawn: rubber hangers, the steel bracket and its weld, the cut-off wheel, the creeper handle (no bank images).
// Brand safety: the VO names the car's model; no car exterior is shown at all (underside only, bank G08).
// Fictional: Otis. Transitions: hatch portal (ceiling -> card), push-in on the photo corner + match cut on the red tape,
// camera slide down the card to the attribution, new line lands, CTA landing over frame 0's ceiling.
// remocn (ported): lens push, focus-blur-resolve, typewriter, period-drop. New vs the previous reels: hatch portal,
// fixed supine camera.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark, Who, Sweep } from "./b2kit";

export const HOOK_WORDS = 9;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#121314";
export const TEXT = { ...HTEXT, size: 106, color: "#F5F5F7" };
export const IMAGES = ["G08"];
const HOOKS = { A: "Who fitted / this bracket?", B: "About to / cut it.", C: "Check / before you cut." };

// hangers along the pipe (positions on the ceiling), the steel one in the middle
const HANG = [{ x: 200, y: 920, rubber: true }, { x: 540, y: 1000, rubber: false }, { x: 880, y: 1080, rubber: true }];
const Rubber = ({ x, y, t, torn = 0 }) => <div style={{ position: "absolute", left: x - 64, top: y - 64, width: 128, height: 128, borderRadius: "50%", border: "30px solid #1a1a1a", boxSizing: "border-box", boxShadow: "0 6px 10px rgba(0,0,0,.6), inset 0 0 6px rgba(255,255,255,.1)", transform: `rotate(${t * 4}deg)`, clipPath: torn ? "polygon(0 0, 100% 0, 100% 45%, 55% 50%, 100% 60%, 100% 100%, 0 100%)" : undefined }} />;
const Bracket = ({ x, y, s = 1, weldGlow = 0 }) => (
  <svg width={260 * s} height={150 * s} viewBox="0 0 260 150" style={{ position: "absolute", left: x - 130 * s, top: y - 75 * s, overflow: "visible" }}>
    <defs><linearGradient id="stl" x1="0" x2="1"><stop offset="0" stopColor="#2b2d30" /><stop offset=".5" stopColor="#4a4e53" /><stop offset="1" stopColor="#222" /></linearGradient></defs>
    <path d="M 10 30 L 150 30 L 200 110 L 250 110 L 250 132 L 186 132 L 136 52 L 10 52 Z" fill="url(#stl)" stroke="#111" strokeWidth={3} />
    <circle cx={40} cy={41} r={8} fill="#111" /><circle cx={232} cy={121} r={8} fill="#111" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <ellipse key={i} cx={146 + i * 5} cy={42 + i * 9} rx={7} ry={5} fill={`rgba(${180 + 60 * weldGlow},${170 + 40 * weldGlow},${150},.9)`} />)}
  </svg>
);
const Creeper = ({ t, o = 1 }) => <div style={{ position: "absolute", left: -40, top: 1700, width: 1160, height: 90, opacity: o, zIndex: 30 }}>
  <div style={{ position: "absolute", left: 0, top: 30, width: 1160, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #3d3f43, #1b1c1e)" }} />
  <div style={{ position: "absolute", left: 120, top: 26, width: 120, height: 48, background: RED, borderRadius: 6, transform: "skewX(-8deg)" }} />
  <div style={{ position: "absolute", left: 128, top: 34, width: 104, height: 6, background: "rgba(255,255,255,.35)" }} />
</div>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    other: at("other"), rubber: at("rubber."), this: at("this"), steel: at("steel."), i: at("i"), ready: at("ready"), cut: at("cut"), but: at("but"), weld: at("weld's"), tidy: at("tidy."),
    maybe: at("maybe"), so: at("so"), checked: at("checked"), page: at("page"), july: at("july"), tore: at("tore,"), muffler: at("muffler"), bracket: at("bracket"), hang: at("hang"),
    creeper: at("creeper"), photo: at("photo."), logged: at("logged"), otis: at("otis."), oh: at("oh."), me: at("me."), checked2: at("checked", 2), added: at("added"), staying: at("staying."),
    cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [3] : [2], hold: 0.5 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.2)))].s));
  const heads = [
    hk,
    { ...fx(B("One isn't / rubber.", T.this), [T.this, T.this + 0.2, T.rubber > T.this ? T.steel : T.steel]), key: [], hold: 0.4 },
    { ...fx(B("Ready / to cut.", T.ready), [T.ready, at("to"), T.cut]), key: [2], hold: 0.3 },
    { ...fx(B("Tidy weld. / Why?", T.weld), [T.tidy, T.weld, T.maybe + 0.3]), key: [0], hold: 0.5 },
    { ...fx(B("That was / me.", T.oh), [tl.after("that", T.oh), at("was", 2), T.me]), key: [2], hold: 0.6 },
    { ...fx(B("It's / staying.", T.staying), [at("it's"), T.staying]), key: [1], hold: 0.4 },
    { ...ctaHead(tl, "For the tech / who cuts first", T.cta), key: [4] },
  ];
  heads[1].words = [{ w: "One", t: T.this, line: 0 }, { w: "isn't", t: T.this + 0.2, line: 0 }, { w: "rubber.", t: at("bent"), line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the ceiling (under the car)
  const ceiling = (t, phase) => {
    const end = phase === "end";
    const swing = Math.sin(t * 1.1) * 260 + Math.sin(t * 0.37) * 80;
    const taps = [T.other + 0.2, T.rubber - 0.1, T.steel - 0.1];
    const tap = (i) => t > taps[i] && t < taps[i] + 0.5;
    const ptr = track(t, { x: 120, y: 1500, o: 0 }, [[T.other, { x: HANG[0].x, y: HANG[0].y, o: 1 }, 0.3], [T.rubber - 0.25, { x: HANG[2].x, y: HANG[2].y }, 0.3], [T.steel - 0.3, { x: HANG[1].x, y: HANG[1].y }, 0.3], [T.ready, { o: 0 }, 0.2]]);
    const wheel = ez(t, T.ready - 0.3, 0.6, EASE.camera) * (1 - ez(t, T.but + 0.2, 0.6, EASE.in));
    const macro = phase === "first" ? ez(t, T.but - 0.1, 0.7, EASE.camera) * (1 - ez(t, T.so - 0.4, 0.5, EASE.camera)) : 0;
    const press = phase === "first" ? ez(t, T.checked - 0.3, 0.4) : 0;
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "#121314" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${HANG[1].x}px ${HANG[1].y}px`, transform: `scale(${1 + 1.6 * macro - 0.03 * ctaP})` }}>
        <div style={{ position: "absolute", inset: -60, transform: `rotate(180deg) scale(1.15)` }}>
          <Img src={src("G08")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 30%", filter: "brightness(.38) saturate(.8) blur(3px)" }} /></div>
        {/* work light swinging */}
        <div style={{ position: "absolute", left: 540 + swing - 500, top: 600, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,226,170,.45), rgba(255,226,170,0))", mixBlendMode: "screen" }} />
        {/* the exhaust run overhead */}
        <div style={{ position: "absolute", left: -100, top: 950, width: 1300, height: 96, borderRadius: 48, background: "linear-gradient(180deg, #8d9399, #d5d9dd 40%, #5f656b)", transform: "rotate(9deg)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
        {HANG.map((h, i) => h.rubber ? <Rubber key={i} x={h.x} y={h.y - 70} t={t} /> : <Bracket key={i} x={h.x} y={h.y - 110} s={1.7} weldGlow={macro} />)}
        {ptr.o > 0.01 && <div style={{ position: "absolute", left: ptr.x - 30, top: ptr.y - 100, width: 60, height: 60, borderRadius: 30, border: "5px solid #fff", opacity: ptr.o, transform: `scale(${[0, 1, 2].some(tap) ? 0.8 : 1})`, boxShadow: "0 0 20px rgba(255,255,255,.5)" }} />}
        {/* the cut-off wheel rises toward the steel */}
        {wheel > 0.01 && <div style={{ position: "absolute", left: lerp(900, 620, wheel), top: lerp(1900, 1040, wheel), width: 300, height: 300, zIndex: 20 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 0deg, #6b6f75, #c6c9cd, #6b6f75, #c6c9cd, #6b6f75)", transform: `rotate(${t * 900}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
          <div style={{ position: "absolute", left: 120, top: 120, width: 60, height: 60, borderRadius: 30, background: "#222" }} />
          <div style={{ position: "absolute", left: -20, top: 150, width: 340, height: 170, borderRadius: "0 0 170px 170px", background: "#E8C21A" }} /></div>}
        {press > 0.01 && <div style={{ position: "absolute", left: 300, top: 640, width: 480, height: 300, borderRadius: 20, border: `4px solid rgba(255,255,255,${0.5 * press})`, boxShadow: `0 0 40px rgba(255,255,255,${0.35 * press})` }} />}
        {end && <div style={{ position: "absolute", left: 140, top: 1300, padding: "16px 26px", borderRadius: 28, ...CARD, zIndex: 25 }}>
          <span style={inter(44, INK, 600)}>Checked · Oct 2026 · Otis</span></div>}
        {end && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#E5E5EA", 500)} keepCaret={0.4} /></div>}
      </div>
      <Creeper t={t} />
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the card in the hatch
  const card = (t) => {
    const corner = ez(t, T.hang - 0.1, 0.7, EASE.camera) * (1 - ez(t, T.logged - 0.3, 0.6, EASE.camera));
    const down = ez(t, T.logged - 0.3, 0.6, EASE.camera);
    const added = spr(t - (T.added - 0.2), 190, 17);
    const PH = { x: 100, y: 820, w: 880, h: 420 }; // photo rect (absolute)
    const cx = PH.x + PH.w - 120, cy = PH.y + PH.h - 70; // the creeper in the photo's corner
    return <AbsoluteFill style={{ background: "#121314" }}>
      <div style={{ position: "absolute", inset: -60, transform: "rotate(180deg) scale(1.15)" }}><Img src={src("G08")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.3) blur(6px)" }} /></div>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.8 * corner}) translateY(${-300 * down}px)` }}>
        <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1180, ...CARD, background: "#FBFBFC", overflow: "hidden" }}>
          <Sweep t={t} o={0.2} />
          <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center" }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· customer's build log</span></div>
          <div style={{ position: "absolute", left: 40, top: 110, ...inter(58, INK, 700), ...land(t, T.july - 0.4) }}>Rear muffler hanger</div>
          <div style={{ position: "absolute", left: 40, top: 186, ...inter(48, RED, 650), ...land(t, T.july) }}>Jul 2022</div>
          {/* the photo: torn rubber hanger, dented diff cover, the new bracket going on, and a red-taped creeper in the corner */}
          <div style={{ position: "absolute", left: PH.x - 60, top: PH.y - 560, width: PH.w, height: PH.h, borderRadius: 22, overflow: "hidden", background: "#222", ...land(t, T.tore - 0.3) }}>
            <Img src={src("G08")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 50%", filter: "brightness(.8)" }} />
            <div style={{ position: "absolute", left: 90, top: 80 }}><Rubber x={60} y={60} t={0} torn={1} /></div>
            <div style={{ position: "absolute", left: 300, top: 70 }}><Bracket x={140} y={80} s={0.9} /></div>
            <div style={{ position: "absolute", left: PH.w - 280, top: PH.h - 100, width: 300, height: 60 }}>
              <div style={{ position: "absolute", left: 0, top: 18, width: 300, height: 26, borderRadius: 13, background: "#2b2d30" }} />
              <div style={{ position: "absolute", left: 120, top: 14, width: 70, height: 34, background: RED, borderRadius: 4 }} /></div>
          </div>
          <div style={{ position: "absolute", left: 40, top: 720, width: 880, ...inter(46, "#3A3A3C", 550, { whiteSpace: "normal" }), ...land(t, T.bracket - 0.2) }}>Rubber hanger tore, muffler hit the diff. Steel bracket fitted.</div>
          <div style={{ position: "absolute", left: 40, top: 880, ...land(t, T.logged - 0.2) }}><Who ch="O" name="Logged by Otis" bg="#FF9F0A" size={60} /></div>
          {added > 0.01 && <div style={{ position: "absolute", left: 40, top: 980, width: 880, padding: "18px 22px", borderRadius: 22, background: rgba("#34C759", 0.12), opacity: clamp(added * 2), transform: `translateY(${(1 - clamp(added)) * 40}px)` }}>
            <span style={inter(46, "#1E7F3A", 650)}>Checked · Oct 2026 · left as is · Otis</span></div>}
        </div>
      </div>
      {/* match cut: the creeper handle at the frame edge, same red tape */}
      <div style={{ opacity: corner > 0.9 ? 1 : 0.0 }}><Creeper t={t} /></div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => ceiling(t, "first") },
    { at: T.page - 0.1, render: card, enter: { kind: "portal", d: 0.65, rect: { x: 300, y: 640, w: 480, h: 300 }, r: 20 } },
    { at: T.cta - 0.12, render: (t) => ceiling(t, "end"), enter: { kind: "pull", d: 0.6, rect: { x: 140, y: 1300, w: 640, h: 90 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "creak-soft"], [T.other + 0.2, "tap"], [T.rubber - 0.1, "tap"], [T.steel - 0.1, "ceramic"], [T.ready - 0.3, "tint-swell"], [T.but - 0.1, "lens-settle"], [T.but + 0.2, "air-short"],
    [T.checked - 0.3, "paper-thud"], [T.page - 0.1, "portal"], [T.july, "pop-soft"], [T.tore - 0.3, "photo-settle"], [T.hang - 0.1, "lens-settle"], [T.logged - 0.2, "pop-soft"],
    [T.added - 0.2, "check"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 92, root: 50, mode: "minor", style: "investigate", cut: T.logged - 0.3, ret: T.oh - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
