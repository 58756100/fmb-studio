// @ts-nocheck
// SC-01 (lane C, collectors): Lyle's dash card has said "All original" for ten years, and it isn't true: the engine was
// rebuilt in '98 and the wheels came off another car. Tomorrow's judge has owned three of these. He could hope the judge
// doesn't notice; instead he puts what he knows on the build page, when each job happened and who did it, and writes
// a new card. Next morning the judge barely looks at the paint; they talk about the rebuild for twenty minutes.
// "New card: mostly original. Ask me."
// Device: the dash card, seen through the windshield. When the studio lights dim, the windshield's reflection is not the
// studio but the car's build page; Lyle writes the new card from it. Frame 0 and the CTA are the same windshield shot.
// Brand safety: the VO names the maker, so no K-bank cars (bank set A coupe A25/A26/A27 only) and no model on screen.
// Fictional: Lyle (E01/E09), the judge (hands only, drawn pen + D06 clipboard), Dutchman's Garage.
// Transitions: pull back out of the windshield (pull), cloth-led slide along the body, match cut to the bench, whip to
// the windshield, lights dim and the reflection resolves (focus-blur), hard cut to morning (punch), match back to the
// windshield with the new card, CTA landing over the same frame.
// remocn (ported): focus-blur-resolve (reflection), handwriting typewriter (Caveat), light sweep, period-drop.
// New vs the previous reels: reflection-as-UI, handwritten card reveal.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark } from "./b2kit";

export const HOOK_WORDS = 9;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#0F1013";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A25", "A26", "A27", "F10", "F03", "E01", "E09", "D06"];
const HOOKS = { A: "All original? / It's wrong.", B: "The judge / knows these.", C: "All original?" };
const HAND = (size, color = "#1D1D1F", weight = 600) => ({ fontFamily: "Caveat", fontSize: size, fontWeight: weight, color, lineHeight: 1.0, whiteSpace: "nowrap" });
const PAINT = ["#E23A2E", "#9E1B14"];

// the tent card on the dash (folded white card, hand-lettered)
const TentCard = ({ t, lines, x = 540, y = 1180, w = 560, rot = 0, o = 1, write = null }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: w * 0.5, opacity: o, transform: `rotate(${rot}deg) perspective(900px) rotateX(16deg)`, transformOrigin: "50% 100%", zIndex: 12 }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFFFFF, #ECEAE4)", borderRadius: 6, boxShadow: "0 24px 30px -12px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {lines.map(([txt, sz, col], i) => write ? <Typed key={i} t={t} t0={write[i][0]} t1={write[i][1]} text={txt} caret="rgba(0,0,0,0)" keepCaret={0} style={HAND(sz, col)} />
        : <span key={i} style={HAND(sz, col)}>{txt}</span>)}
    </div>
  </div>
);
// the windshield shot: cabin, dash, card, glass reflections, the red bonnet in front. refl = 0..1 build page reflection
const Windshield = ({ t, card, dim = 0, refl = 0, children }) => {
  const sweep = (k, sp, off) => ((t * sp + off) % 2600) - 800;
  return <AbsoluteFill style={{ background: "#0B0C0F" }}>
    {/* cabin and dash */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1500, background: "radial-gradient(90% 60% at 50% 70%, #26282D, #0B0C0F)" }} />
    <div style={{ position: "absolute", left: -100, right: -100, top: 1290, height: 220, background: "linear-gradient(180deg, #1A1B1F, #050506)", borderRadius: "60% 60% 0 0 / 30% 30% 0 0" }} />
    {card}
    {/* glass: soft studio reflections that slide (LED strips) */}
    <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.75 * dim, pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", top: -300, width: 90 + 40 * i, height: 2600, left: sweep(i, 70 + 25 * i, i * 700), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.13), rgba(255,255,255,0))", transform: "rotate(24deg)" }} />)}
    </div>
    {refl > 0.01 && children}
    {/* the red bonnet in the foreground, with LED strips sliding over the paint */}
    <div style={{ position: "absolute", left: -200, right: -200, top: 1500, height: 600, borderRadius: "50% 50% 0 0 / 22% 22% 0 0", overflow: "hidden", background: `linear-gradient(180deg, ${PAINT[0]}, ${PAINT[1]})`, filter: `brightness(${1 - 0.35 * dim})` }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", top: -200, width: 120, height: 1000, left: sweep(i, 90 + 30 * i, 300 + i * 900), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))", transform: "rotate(-30deg)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0))" }} />
    </div>
    {/* glass edge (A-pillars) */}
    <div style={{ position: "absolute", left: -60, top: 0, width: 140, height: 1560, background: "#08090B", transform: "skewX(8deg)" }} />
    <div style={{ position: "absolute", right: -60, top: 0, width: 140, height: 1560, background: "#08090B", transform: "skewX(-8deg)" }} />
  </AbsoluteFill>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    ten: at("ten"), dash: at("dash,"), true_: at("true."), engine: at("engine"), ninety: at("ninety-eight,"), wheels: at("wheels"), car: at("car."), but: at("but"),
    judge: at("judge"), three: at("three"), i: at("i"), hope: at("hope"), doesnt: at("doesn't."), instead: at("instead,"), know: at("know"), page: at("page:"), when: at("when"),
    happened: at("happened,"), who: at("who"), did: at("did"), next: at("next"), paint: at("paint."), we: at("we"), rebuild: at("rebuild"), twenty: at("twenty"),
    newc: at("new"), mostly: at("mostly"), ask: at("ask"), me: tl.end("me."), cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [1] : [1], color: "#F5F5F7", hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Ten years / on the dash.", T.ten), [T.ten, at("years"), T.dash - 0.3, T.dash - 0.15, T.dash]), key: [0], hold: 0.8, color: "#F5F5F7" },
    { ...fx(B("Engine / rebuilt '98.", T.engine), [T.engine, at("rebuilt"), T.ninety]), key: [2], hold: 0.9, color: "#F5F5F7" },
    { ...fx(B("He's owned / three.", T.judge), [T.judge, at("owned"), T.three]), key: [2], hold: 1.2, color: "#F5F5F7" },
    { ...fx(B("Next / morning.", T.next), [T.next, at("morning,")]), key: [], color: "#1D1D1F", hold: 0.9 },
    { ...fx(B("That rebuild: / twenty minutes.", T.we), [at("that"), T.rebuild, T.twenty, at("minutes.")]), key: [2], color: "#1D1D1F", hold: 0.8 },
    { ...ctaHead(tl, "Start your / car's story", T.cta), key: [3], color: "#F5F5F7" },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const OLD = [["All original", 96, "#1D1D1F"]];
  const NEW = [["Mostly original.", 78, "#1D1D1F"], ["Ask me.", 78, RED], ["Engine rebuilt '98 · Dutchman's", 44, "#5A5A60"]];
  // ---------------------------------------------------------------- the windshield (hook)
  const glassHook = (t) => {
    const push = 1 + 0.05 * EASE.io(seg(t, 0, 4));
    return <AbsoluteFill style={{ transform: `scale(${push})` }}><Windshield t={t} card={<TentCard t={t} lines={OLD} />} /></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- Lyle with the coupe in the detailing studio
  const studio = (t) => {
    const d = drift(t, "st", 3, 0.3);
    const CW = 1150, CH = CW / (1605 / 620), cx = 470, cy = 1260;
    const ring = (u, v, t0, k) => { const p = spr(t - t0, 200, 15); return t > t0 && <div key={k} style={{ position: "absolute", left: cx - CW / 2 + u * CW - 80, top: cy - CH / 2 + v * CH - 80, width: 160, height: 160, borderRadius: "50%", border: "8px solid #fff", transform: `scale(${clamp(p)})`, opacity: 0.95, boxShadow: "0 0 30px rgba(255,255,255,.6)", zIndex: 20 }} />; };
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.06)` }}>
        <Img src={src("F10")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.95)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,12,.55) 0%, rgba(10,10,12,0) 40%)" }} />
      </div>
      <Cut id="A26" cx={cx} cy={cy} w={CW} shadow={0.5} />
      {ring(0.86, 0.38, T.engine - 0.1, "e")}{ring(0.205, 0.74, T.wheels - 0.1, "w")}
      <Cut id="E01" cx={880} cy={1620} w={520} shadow={0} />
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the bench: show badge + the judge's clipboard
  const bench = (t) => {
    const d = drift(t, "bn", 3, 0.3);
    const dim = ez(t, T.i - 0.2, 0.8, EASE.io);
    const card = spr(t - (T.hope - 0.3), 170, 17);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #2A2520, #15120F)" }}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6), filter: `brightness(${1 - 0.35 * dim})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, height: 820, background: "linear-gradient(180deg, #7A5A3A, #4E3722)" }} />
        <Cut id="D06" cx={720} cy={1060} w={560} rot={6} shadow={0.4} />
        {/* blank score sheet lines on the clipboard */}
        <div style={{ position: "absolute", left: 560, top: 900, width: 300, height: 320, transform: "rotate(6deg)", zIndex: 5 }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 3, background: "rgba(0,0,0,.18)", margin: "38px 0" }} />)}</div>
        {/* the show entry badge */}
        <div style={{ position: "absolute", left: 120, top: 860, width: 340, height: 420, zIndex: 6, transform: `rotate(${-6 + Math.sin(t * 0.9)}deg)` }}>
          <div style={{ position: "absolute", left: 120, top: 0, width: 100, height: 160, background: "linear-gradient(90deg, #1F4FB0, #2D63CF)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }} />
          <div style={{ position: "absolute", left: 20, top: 110, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #F7E7B4, #C9A54A)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 0 0 10px rgba(255,255,255,.25)", display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center" }}><div style={inter(42, "#5A4314", 700)}>ENTRY</div><div style={{ ...inter(96, "#3B2B0A", 800), lineHeight: 1 }}>47</div></div></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${30 + ((t * 40) % 100)}%, rgba(255,255,255,.35) ${40 + ((t * 40) % 100)}%, rgba(255,255,255,0) ${50 + ((t * 40) % 100)}%)`, borderRadius: "50%", mixBlendMode: "screen" }} />
        </div>
        {/* he holds the old card, deciding */}
        {card > 0.01 && <div style={{ opacity: clamp(card * 2), transform: `translateY(${(1 - clamp(card)) * 300}px) rotate(${-4 + 2 * Math.sin(t * 0.7)}deg)` }}><TentCard t={t} lines={OLD} x={560} y={1360} w={520} /></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the windshield at night: the reflection is the build page
  const glassNight = (t, phase) => {
    const dim = phase === "end" ? 0 : 1;
    const refl = phase === "end" ? 0 : ez(t, T.instead - 0.1, 0.9, EASE.camera);
    const write = phase === "night" ? [[T.happened + 0.3, T.did], [T.did, T.me - 0.2], [T.me, T.me + 0.4]] : null;
    const newCard = phase === "night" ? t > T.happened + 0.2 : true;
    const rows = [["Engine rebuild", "1998", "Dutchman's Garage", T.page - 0.2, RED], ["Wheels", "2009", "from another car", T.when - 0.1, GREY]];
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    const card = newCard ? <div style={{ opacity: phase === "night" ? seg(t, T.happened + 0.1, T.happened + 0.4) : 1 }}><TentCard t={t} lines={phase === "night" ? NEW.slice(0, 1).concat([["", 78, RED], ["", 44, GREY]]) : NEW} write={phase === "night" ? [[T.happened + 0.3, T.did + 0.2], [99, 99], [99, 99]] : null} y={1120} w={640} /></div>
      : <TentCard t={t} lines={OLD} />;
    return <AbsoluteFill style={{ transform: `scale(${1 - 0.04 * ctaP})` }}>
      <Windshield t={t} dim={dim} refl={refl} card={card}>
        <div style={{ position: "absolute", left: 120, top: 360, width: 840, opacity: 0.88 * refl, filter: `blur(${(1 - refl) * 14}px)`, transform: `skewY(-2deg) scale(${0.96 + 0.04 * refl})`, zIndex: 8 }}>
          <div style={{ padding: "30px 36px", borderRadius: 34, background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.18)", backdropFilter: "blur(2px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Wordmark size={44} color="#F5F5F7" /><span style={inter(42, "rgba(245,245,247,.7)", 500)}>· Lyle's coupe</span></div>
            {rows.map(([job, yr, who, tt, col], i) => <div key={i} style={{ marginTop: 28, ...land(t, tt) }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}><span style={inter(56, "#F5F5F7", 650)}>{job}</span><span style={{ ...inter(52, col === RED ? "#FF6B5E" : "#C7C7CC", 650) }}>{yr}</span></div>
              <div style={inter(44, "rgba(245,245,247,.75)", 500)}>{who}</div></div>)}
          </div>
        </div>
      </Windshield>
      {phase === "end" && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", zIndex: 40 }}>
        <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(48, "#C7C7CC", 500)} keepCaret={0.4} /></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- next morning: the show hall, the judge's pen goes to the card
  const hall = (t) => {
    const d = drift(t, "hl", 3, 0.3);
    const pen = track(t, { x: 1250, y: 900 }, [[T.next + 0.2, { x: 760, y: 1100 }, 0.8], [T.paint - 0.1, { x: 560, y: 1230 }, 0.6]]);
    const laugh = spr(t - (T.we - 0.2), 170, 16);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.06)` }}>
        <Img src={src("F03")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.08)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.8) 0%, rgba(255,255,255,.2) 35%, rgba(255,255,255,0) 55%)" }} />
      </div>
      <Cut id="A25" cx={540} cy={1250} w={1000} shadow={0.45} />
      {/* the honest card on the dash, seen through the glass */}
      <div style={{ position: "absolute", left: 470, top: 1080, padding: "6px 14px", background: "#fff", transform: "rotate(-3deg)", boxShadow: "0 6px 10px rgba(0,0,0,.4)", zIndex: 8 }}><span style={HAND(44)}>Ask me.</span></div>
      {/* the judge's pen */}
      <div style={{ position: "absolute", left: pen.x, top: pen.y, width: 230, height: 22, borderRadius: 11, background: "linear-gradient(180deg, #3a3d42, #16181b)", transform: `rotate(${-28 + 4 * Math.sin(t * 1.3)}deg)`, transformOrigin: "0 50%", zIndex: 30, boxShadow: "0 10px 16px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: -26, top: 6, width: 30, height: 18, background: "#C9CDD3", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} /></div>
      {laugh > 0.01 && <Cut id="E09" cx={lerp(1400, 760, clamp(laugh))} cy={1560} w={640} shadow={0} />}
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: glassHook },
    { at: T.ten - 0.1, render: studio, enter: { kind: "pull", d: 0.6, rect: { x: 300, y: 1080, w: 300, h: 300 } } },
    { at: T.but - 0.1, render: bench, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.instead - 0.12, render: (t) => glassNight(t, "night"), enter: { kind: "match" } },
    { at: T.next - 0.08, render: hall, enter: { kind: "punch" } },
    { at: T.newc - 0.12, render: (t) => glassNight(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "shimmer-soft", 0.6], [T.ten - 0.1, "pull"], [T.engine - 0.1, "pop-soft"], [T.wheels - 0.1, "pop-soft"], [T.but - 0.1, "whip"], [T.judge, "tick-soft"],
    [T.hope - 0.3, "paper-flutter"], [T.i - 0.2, "tint-drain"], [T.instead, "shimmer"], [T.when - 0.1, "tick-soft"], [T.who - 0.1, "tick-soft"], [T.happened + 0.3, "pen-write"],
    [T.next - 0.08, "punch-in-thump"], [T.paint - 0.1, "tap"], [T.we - 0.2, "slide-soft"], [T.newc - 0.12, "paper-flutter"], [T.mostly, "pen-write", 0.5], [ctaT, "cta-pop"],
  ];
  // confession mood; silence on "I could hope he doesn't", the band returns with the next morning
  const music = { bpm: 92, root: 50, mode: "minor", style: "observe", cut: T.i - 0.3, ret: T.next - 0.08, room: "office" };
  return { shots, heads, sfx, music };
}
