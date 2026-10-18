// @ts-nocheck
// C3-SUP (lane C, parts suppliers): "Rattle. Fix? That's it." Noor at Calder support has an order number and nothing
// else. Each question costs days; each answered tag weighs the exhaust down. Day six, Theo asks about a return, then:
// "Just read my build." The first tag unfolds into his build log (Calder exhaust, Jul 22, Northline Auto, the underside
// photo); a fresh tag ties onto the rear hanger: worth a look. Six days, one link.
// Device: time as weight. Manila tags pile onto an exhaust hanging from a cotton string; the pipe sags per answer.
// Hero: WRX (A29) + cat-back exhaust (C05); underside photo G08.
// Transitions (no cuts): camera drop along the string, sag/tilt beats, tags snap off, shape morph (tag -> log card),
// path-ride (a new tag rides onto the hanger in the photo), fold-back + lift to level, CTA landing over frame 0.
// remocn (ported): path-ride, typewriter (ink on tags, URL), focus-blur-resolve (card fields), period-drop.
// New vs C3-GAR: path-ride, ink typewriter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD } from "./laneB";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
export const BG = "#FFFFFF";
export const TEXT = { ...HTEXT, size: 112 };
export const IMAGES = ["C05", "A29", "G08"];
const HOOKS = { A: "Rattle. Fix? / That's it.", B: "Brands: this is / your inbox.", C: "$1,290 exhaust. / Two words." };
const INKC = "#2B2A33", PENCIL = "#7C7A80", MANILA = "#E9D3A4";

// a manila hang tag (no bank image yet): clipped corners, eyelet, ink text, pencil answer
const Tag = ({ x, y, rot = 0, w = 250, h = 200, ink, pencil, inkT, t, s = 1, o = 1, z = 15 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, transformOrigin: "50% 0", transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: z }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, #F1DFB6, ${MANILA} 60%, #DCC28E)`, clipPath: "polygon(16% 0, 84% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)",
      filter: "drop-shadow(0 6px 8px rgba(0,0,0,.18))" }} />
    <div style={{ position: "absolute", left: w / 2 - 11, top: 12, width: 22, height: 22, borderRadius: 11, background: "#fff", boxShadow: "0 0 0 5px #CDB27C" }} />
    <div style={{ position: "absolute", left: 14, right: 14, top: 44, textAlign: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 42, letterSpacing: "-0.02em", color: INKC, fontStyle: "italic", lineHeight: 1.05 }}>
      {inkT != null ? <Typed t={t} t0={inkT} t1={inkT + ink.length / 18} text={ink} caret="rgba(0,0,0,0)" style={{}} keepCaret={0} /> : ink}
    </div>
    {pencil && <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, textAlign: "center", fontFamily: "Inter", fontWeight: 500, fontSize: 42, color: PENCIL, whiteSpace: "nowrap", fontStyle: "italic" }}>{pencil}</div>}
  </div>
);
const Chip = ({ x, y, children, red, o = 1, dy = 0 }) => <div style={{ position: "absolute", left: x, top: y + dy, opacity: o, padding: "12px 26px", borderRadius: 32, background: red ? RED : "#F2F2F7", ...inter(40, red ? "#fff" : "#3A3A3C", 600), zIndex: 20 }}>{children}</div>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    noor: at("noor"), order: at("order"), nothing: at("nothing"), which: at("which"), wrx: at("w-r-x."), who: at("who"), some: at("some"), day: at("day"),
    theo: at("theo"), ret: at("return."), just: at("just"), read: at("read"), calder: at("calder"), july: at("july"), north: at("northline"), that: at("that"),
    hanger: at("hanger."), worth: at("worth"), six: at("six", 2), link: at("link."), ask: tl.cta("send") ?? at("ask"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hk = { words: wordsFor(tl.hook, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [4] : [3] };
  if (hook === "C") fx(hk, [tl.hook[0].s, tl.hook[1].s, tl.hook[2].s, tl.hook[3].s]);
  const heads = [
    hk,
    fx(B("Order number. Nothing else.", T.order), [T.order, at("number."), T.nothing, at("else.")]),
    B("Which car?", T.which, { hold: 0.9 }),
    fx(B("A WRX.", T.wrx), [at("a"), T.wrx]),
    B("Who fitted it?", T.who, { key: [1], hold: 0.7 }),
    B("Some shop.", T.some, { hold: 0.6 }),
    B("Day six.", T.day, { key: [1], hold: 0.6 }),
    fx(B("Asked about a return.", T.theo), [at("asked"), at("about"), at("a", 2), T.ret]),
    B("Just read my build.", T.just, { key: [3], hold: 0.9 }),
    B("That rear hanger.", T.that, { key: [2], hold: 1.2 }),
    fx(B("Six days. One link.", T.six), [T.six, at("days.", 1), at("one"), T.link]),
    { ...ctaHead(tl, "Send this to parts brands.", T.ask), key: [3, 4] },
  ];
  heads[3].words = heads[3].words.map((w, i) => ({ ...w, t: [at("a"), T.wrx][i] }));
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  const scene = (t) => {
    // weight: sag (px) and tilt (deg) per answered question; lift at "One link."
    const sag = 40 * ez(t, T.which + 0.3, 0.5, EASE.out) + 50 * ez(t, T.who + 0.3, 0.5, EASE.out) + 40 * ez(t, T.day, 0.5, EASE.out);
    const lift = ez(t, T.link - 0.3, 0.9, (p) => spr(p * 0.9, 120, 11));
    const S = sag * (1 - lift), tilt = (4 * ez(t, T.who + 0.3, 0.5) + 2 * ez(t, T.day, 0.5)) * (1 - lift);
    const sway = Math.sin(t * 1.3) * 1.2 + (t < 1 ? Math.sin(t * 9) * 4 * (1 - t) : 0);
    const cam = track(t, { y: 0 }, [[T.noor - 0.1, { y: -60 }, 1.0, EASE.io], [T.day - 0.2, { y: -110 }, 0.8, EASE.io], [T.just - 0.1, { y: 0 }, 0.7], [T.ask - 0.3, { y: 0 }, 0.5]]);
    const CX = 540, CY = 930 + S;
    const ang = (-24 + tilt + sway * 0.3) * Math.PI / 180;
    const rot = (-6 + tilt + sway * 0.3) * Math.PI / 180, PW = 820, PHh = 820 * 977 / 1579;
    const pt = (ux, uy) => { const dx = (ux - 0.5) * PW, dy = (uy - 0.5) * PHh; return { x: CX + dx * Math.cos(rot) - dy * Math.sin(rot), y: CY + 40 + dx * Math.sin(rot) + dy * Math.cos(rot) }; };
    const morph = ez(t, T.just + 0.35, 0.7, EASE.camera) * (1 - ez(t, T.six - 0.2, 0.7, EASE.camera));
    const qOff = ez(t, T.just + 0.1, 0.45, EASE.in);
    const car = ez(t, T.wrx - 0.1, 0.6);
    const ret = spr(t - (T.ret - 0.2), 240, 15), retOut = ez(t, T.link - 0.2, 0.4, EASE.in);
    const tagsQ = [
      { u: [0.5, 0.6], len: 60, ink: "Which car?", pencil: "WRX", at: T.which - 0.05, pAt: T.wrx },
      { u: [0.8, 0.62], len: 260, ink: "Who fitted it?", pencil: "Some shop", at: T.who - 0.05, pAt: T.some },
    ];
    const t0p = pt(0.24, 0.3);
    return <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${cam.y}px) ${dT(drift(t, "sup", 2.5, 0.2), 0.5)}` }}>
        {/* ghost car outline that fills with the WRX */}
        <div style={{ position: "absolute", left: 590, top: 560, width: 420, height: 200, opacity: ez(t, T.nothing - 0.2, 0.5) * (1 - morph) * (1 - ez(t, T.ask - 0.2, 0.5)) }}>
          <Cut id="A29" cx={210} cy={100} w={400} shadow={0} style={{ filter: `grayscale(${1 - car}) brightness(${lerp(2.2, 1, car)}) contrast(${lerp(0.25, 1, car)})`, opacity: lerp(0.5, 1, car) }} />
          <div style={{ position: "absolute", left: 180, top: 40, ...inter(80, "#C7C7CC", 600), opacity: 1 - car }}>?</div>
        </div>
        {/* chips */}
        <Chip x={70} y={590} o={1 - morph}>{t > T.ask - 0.1 || t < T.wrx ? "Ticket · Day 1" : t < T.some ? "Ticket · Day 2" : t < T.day ? "Ticket · Day 4" : "Ticket · Day 6"}</Chip>
        <Chip x={70} y={680} o={1 - morph}>Calder · Order 20418 · $1,290</Chip>
        {ret > 0.01 && <Chip x={70} y={770} red o={clamp(ret * 2) * (1 - retOut) * (1 - morph)} dy={(1 - ret) * -40 + retOut * 30}>Return?</Chip>}
        {/* the string and the pipe */}
        <svg width={W} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 8 }}>
          <path d={`M 540 -200 L ${CX} ${CY - 10}`} stroke="#E8E2D4" strokeWidth={5} />
          {tagsQ.map((q, i) => { const p = pt(...q.u); return t >= q.at && <line key={i} x1={p.x} y1={p.y} x2={p.x} y2={p.y + q.len + (qOff * 900)} stroke="#E8E2D4" strokeWidth={3} opacity={1 - qOff} />; })}
          <line x1={t0p.x} y1={t0p.y} x2={t0p.x} y2={t0p.y + 60} stroke="#E8E2D4" strokeWidth={3} opacity={1 - morph} />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - 0.85 * morph, zIndex: 9 }}>
          <Cut id="C05" cx={CX} cy={CY + 40} w={820} rot={-6 + tilt + sway * 0.3} shadow={0} />
        </div>
        {tagsQ.map((q, i) => { const p = pt(...q.u); const drop = spr(t - q.at, 220, 12); if (t < q.at) return null;
          return <Tag key={i} t={t} x={p.x} y={p.y + q.len - (1 - drop) * 140 + qOff * 1100} rot={Math.sin(t * 2 + i) * 3 + (1 - drop) * 10 + qOff * 30} ink={q.ink} inkT={q.at + 0.1}
            pencil={t > q.pAt + 0.1 ? q.pencil : null} o={clamp(drop * 3) * (1 - qOff)} />; })}
        {/* the first tag: "Rattle. Fix?" -> unfolds into the log card -> folds back */}
        {morph < 0.02 ? <Tag t={t} x={t0p.x} y={t0p.y + 60} rot={Math.sin(t * 1.7) * 4} ink="Rattle. Fix?" />
          : <LogCard t={t} T={T} p={morph} from={{ x: t0p.x - 125, y: t0p.y + 60, w: 250, h: 150 }} />}
      </div>
    </AbsoluteFill>;
  };
  return { shots: [{ at: 0, render: scene }], heads };
}

const LogCard = ({ t, T, p, from }) => {
  const x = lerp(from.x, 70, p), y = lerp(from.y, 560, p), w = lerp(from.w, 940, p), h = lerp(from.h, 860, p);
  const c = clamp((p - 0.55) / 0.45);
  const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2) * c, transform: `translateY(${(1 - q) * 20}px)`, filter: q < 0.6 ? `blur(${(1 - q / 0.6) * 8}px)` : undefined }; };
  // the new tag path-rides onto the rear hanger (0.73, 0.18 of the photo)
  const ride = ez(t, T.that - 0.1, 0.8, EASE.camera);
  const PH = { x: 40, y: 190, w: 860, h: 480 };
  const hx = PH.x + 0.73 * PH.w, hy = PH.y + 0.2 * PH.h;
  const rx = lerp(PH.x + PH.w + 160, hx, ride), ry = lerp(PH.y - 120, hy, ride) - Math.sin(Math.PI * ride) * 90;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 30, borderRadius: lerp(10, 40, p), overflow: "hidden",
    background: lerp(0, 1, c) > 0.5 ? "rgba(255,255,255,.94)" : "#EAD6A8", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 40px 60px -30px rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, #F1DFB6, ${MANILA})`, opacity: 1 - c }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 940, height: 860, transformOrigin: "0 0", transform: `scale(${w / 940}, ${h / 860})` }}>
      <div style={{ position: "absolute", left: 40, top: 40, ...inter(66, INK, 650), ...f(T.calder) }}>Exhaust · Calder</div>
      <div style={{ position: "absolute", left: 40, top: 120, ...inter(52, RED, 600), ...f(T.july) }}>Jul 22, 2026</div>
      <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 28, overflow: "hidden", ...f(T.just + 0.95) }}>
        <img src={src("G08")} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "73% 20%", transform: `scale(${1.02 + 0.08 * ez(t, T.that, 1.5, EASE.io)})` }} />
      </div>
      {ride > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, opacity: c }}>
        <svg width={940} height={860} style={{ position: "absolute", inset: 0, overflow: "visible" }}><line x1={hx} y1={hy} x2={rx} y2={ry + 6} stroke="#F4F0E6" strokeWidth={4} /></svg>
        <Tag t={t} x={rx} y={ry} w={240} h={160} rot={Math.sin(t * 3) * 6 * (1 - ride * 0.6)} ink="Check first" inkT={T.worth - 0.1} />
      </div>}
      <div style={{ position: "absolute", left: 40, top: 700, display: "flex", alignItems: "center", gap: 18, ...f(T.north - 0.1) }}>
        <span style={{ padding: "10px 24px", borderRadius: 30, background: "#F2F2F7", ...inter(40, "#3A3A3C", 500) }}>installed by Northline Auto</span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 778, ...inter(40, GREY, 500), ...f(T.north + 0.3) }}>fuelmybuild.com/theo/wrx</div>
    </div>
  </div>;
};
