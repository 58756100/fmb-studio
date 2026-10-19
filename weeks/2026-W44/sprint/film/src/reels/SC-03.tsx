// @ts-nocheck
// SC-03 (lane C, collectors): Wes's new mechanic asked one question and he couldn't give him the year of the last
// valve adjustment. A summer: '21? '22? His old shop changed systems and everything before 2022 was gone; searching his
// email for "valve" got three hundred newsletters. He never found that date. Bell Creek did the next one, and this time
// it went on the car's build page: date, measurements, who did it. Next time somebody asks, he's got an answer.
// Device: the road. Each white roadside sign carries an excuse on its face; the car's wind spins it on its post and the
// back shows what actually happened. One continuous tracking drive (drawn parallax road at golden hour), broken once by
// the shop (roll-up door). The fourth sign is solid green: the build page. The wind hits it and it doesn't spin.
// Brand safety: the VO names the car's model; bank set A only (A32 side). Fictional: Wes, Bell Creek Motors.
// Bank: A32, valve-cover-off photo G12. Drawn: road, hills, signs, roll-up door, feeler gauge.
// Transitions: continuous track (parallax), sign spins (rotateY), light drop, roll-up door down/up, the green sign
// rises at the verge, the car decelerates to a stop, CTA landing in frame 0's verge framing with the green sign.
// remocn (ported): kinetic sign flip, parallax stage, focus-blur-resolve, typewriter, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark } from "./b2kit";

export const HOOK_WORDS = 14;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#F3C27A";
export const TEXT = { ...HTEXT, size: 104, color: "#2A1D10" };
export const IMAGES = ["A32", "G12"];
const HOOKS = { A: "He couldn't / give the year.", B: "Three places / let him down.", C: "'I'll remember' / isn't a record." };
const HANDF = (size, color = "#2A2A2A") => ({ fontFamily: "Caveat", fontSize: size, fontWeight: 700, color, lineHeight: 1.0, whiteSpace: "nowrap", textAlign: "center" });
const GREEN = "#0F6B3E";
const CARX = 600, CARY = 1430, CARW = 900;

// a white roadside sign on a wooden post: face / back, spinning on the post (spin 0..1 = 0..180deg)
const Sign = ({ x, face, back, spin = 0, wob = 0 }) => (
  <div style={{ position: "absolute", left: x - 290, top: 640, width: 580, height: 700 }}>
    <div style={{ position: "absolute", left: 270, top: 300, width: 40, height: 430, background: "linear-gradient(90deg, #6B4A2B, #9C7246, #6B4A2B)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 580, height: 340, perspective: 1400 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${spin * 180 + wob}deg)` }}>
        {[[face, 0], [back, 180]].map(([txt, r], i) => <div key={i} style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFFFFF, #ECE7DD)", borderRadius: 10, border: "6px solid #E0D8C8", boxShadow: "0 20px 30px -14px rgba(60,30,0,.5)", backfaceVisibility: "hidden", transform: `rotateY(${r}deg)`, display: "grid", placeItems: "center", padding: 20, boxSizing: "border-box" }}>
          <div style={HANDF(i ? 74 : 84, i ? RED : "#2A2A2A")}>{txt}</div></div>)}
      </div>
    </div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    the: at("the"), last: at("last"), valve: at("valve"), i: at("i"), know: at("know"), summer: at("summer."), t21: at("twenty-one?"), t22: at("twenty-two?"), so: at("so"),
    called: at("called"), shop: at("shop."), theyd: at("they'd"), systems: at("systems,"), everything: at("everything"), before: at("before"), gone: at("gone."), then: at("then"),
    searched: at("searched"), email: at("email"), three: at("three"), newsletters: at("newsletters."), never: at("never"), date: at("date."), so2: at("so", 2), bell: at("bell"),
    next: at("next"), and2: tl.after("and", at("one,")), page: at("page:"), date2: tl.after("date", at("page:")), measurements: at("measurements,"), who: at("who"), so3: at("so", 3), answer: at("answer."),
    cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [0] : [3], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Last valve / adjustment: when?", T.last), [T.last, T.valve, at("adjustment"), at("thousand.")]), key: [3], hold: 0.5 },
    { ...fx(B("Never / found it.", T.never), [T.never, at("found"), T.date]), key: [0], hold: 0.7 },
    { ...fx(B("Bell Creek, / the next one.", T.so2), [T.bell, at("creek"), T.next, T.next + 0.1, at("one,")]), key: [1], hold: 0.4, color: "#F5F5F7" },
    { ...fx(B("Next time: / an answer.", T.so3), [tl.after("next", T.so3), at("time", 2), T.answer - 0.15, T.answer]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "Start your / car's record", T.cta), key: [3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // the drive: world scroll speed; the car slows to a stop at the green sign
  const V = 640;
  const STOP = T.measurements; // the car has stopped by "measurements"
  const pos = (t) => { // world distance travelled (px), with a smooth stop between T.page and STOP, and 0 during the shop
    const vAt = (tt) => (tt < T.so2 - 0.2 ? 1 : tt < T.and2 ? 0.0 : tt < T.page ? 1 : 1 - seg(tt, T.page, STOP));
    let x = 0; const dtt = 1 / 30; for (let tt = 0; tt < t; tt += dtt) x += V * vAt(tt) * dtt; return x;
  };
  const SIGNS = [
    { face: "I'll remember.", back: "Which summer?", pass: T.t21 },
    { face: "The shop has it.", back: "Before 2022: gone", pass: T.before },
    { face: "It's in an email.", back: "'valve': 300 results", pass: T.three },
  ];
  const road = (t, phase) => {
    const P = pos(t);
    const dark = ez(t, T.never - 0.2, 0.6) * (1 - ez(t, T.so2 - 0.3, 0.5)) * 0.35;
    const bob = 3 * Math.sin(t * 9) * (1 - seg(t, T.page, STOP));
    const green = ez(t, T.and2 - 0.1, 0.7, EASE.camera);
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7));
    const gx = 300; // the green sign rises at the verge here (screen x) and stays
    return <AbsoluteFill style={{ background: "#F3C27A" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.03 * ctaP})`, transformOrigin: "50% 70%" }}>
        {/* sky + sun */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #F6D7A4 0%, #F3B66A 45%, #E99A55 70%)" }} />
        <div style={{ position: "absolute", left: 640, top: 760, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #FFF3C9 0 45%, rgba(255,230,160,0) 72%)" }} />
        {/* hills (slow parallax) */}
        {[0, 1].map((k) => <svg key={k} width={W} height={400} viewBox="0 0 1080 400" style={{ position: "absolute", left: ((P * 0.08 + k * W) % (2 * W)) - W, top: 880 }}>
          <path d="M0 260 C 160 160 300 220 460 170 C 620 120 760 230 900 180 C 980 150 1040 170 1080 200 L1080 400 L0 400 Z" fill="#C9874E" opacity=".7" /></svg>)}
        {/* verge (grass) and the road */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 200, background: "linear-gradient(180deg, #A7A04E, #7E7A35)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1370, height: 400, background: "linear-gradient(180deg, #5A5550, #3E3A36)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1600, height: 16, backgroundImage: "repeating-linear-gradient(90deg, #F2E3B5 0 140px, transparent 140px 260px)", backgroundPosition: `${P % 260}px 0` }} />
        {/* the three excuse signs */}
        {SIGNS.map((s, i) => { const x = i === 0 && t < s.pass ? lerp(380, 540, EASE.io(seg(t, 0, s.pass))) : 540 + (t - s.pass) * 330; if (x < -400 || x > 1500) return null;
          const spin = ez(t, s.pass - 0.15, 0.5, EASE.io), wob = (t > s.pass + 0.35 ? 6 * Math.exp(-(t - s.pass - 0.35) * 4) * Math.sin((t - s.pass) * 18) : 0);
          return <Sign key={i} x={x - 120} face={s.face} back={s.back} spin={spin} wob={wob} />; })}
        {/* the green sign: the build page */}
        {green > 0.01 && <div style={{ position: "absolute", left: gx - 260, top: lerp(1300, 600, green), width: 900, opacity: clamp(green * 2), transform: `rotateY(${(t > STOP - 0.4 && t < STOP + 1 ? 3 * Math.sin((t - STOP + 0.4) * 14) * Math.exp(-(t - STOP + 0.4) * 3) : 0)}deg)` }}>
          <div style={{ position: "absolute", left: 420, top: 520, width: 40, height: 400, background: "linear-gradient(90deg, #6E7378, #B8BDC2, #6E7378)" }} />
          <div style={{ position: "relative", background: GREEN, borderRadius: 26, border: "8px solid #F4F4F0", padding: "28px 34px", boxShadow: "0 30px 40px -18px rgba(0,0,0,.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ ...inter(42, "#fff", 700) }}>Fuel<span style={{ color: "#FFD166" }}>My</span>Build</span><span style={inter(40, "#BFE3CF", 500)}>· Wes's build page</span></div>
            <div style={{ ...inter(58, "#fff", 700), marginTop: 12 }}>Valve adjustment</div>
            <div style={{ display: "flex", gap: 24, marginTop: 14, alignItems: "center" }}>
              <div style={{ width: 280, height: 190, borderRadius: 16, overflow: "hidden", flex: "none", ...land(t, T.date2) }}><Img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} /></div>
              <div>
                <div style={{ ...inter(48, "#FFD166", 650), ...land(t, T.date2) }}>Oct 29, 2026</div>
                <div style={{ ...inter(44, "#fff", 600), ...land(t, T.measurements) }}>Clearances logged</div>
                <div style={{ ...inter(44, "#fff", 600), ...land(t, T.who) }}>Bell Creek Motors</div></div></div>
          </div>
        </div>}
        {/* the car */}
        <div style={{ position: "absolute", left: 0, top: bob, width: W, height: H }}>
          <Cut id="A32" cx={CARX} cy={CARY} w={CARW} shadow={0.45} />
          {/* wind streaks */}
          {t < T.page && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: ((P * 1.6 + k * 400) % 1400) - 200, top: 1250 + k * 70, width: 220, height: 4, borderRadius: 2, background: "rgba(255,255,255,.55)" }} />)}
        </div>
        {phase === "hook" && t < T.last + 0.5 && <div style={{ position: "absolute", left: 600, top: 1170, padding: "12px 24px", borderRadius: 30, ...CARD, ...land(t, 0.4), opacity: 1 - seg(t, T.last, T.last + 0.4) }}><span style={inter(42, INK, 600)}>Wes · '01 S2000</span></div>}
        <div style={{ position: "absolute", inset: 0, background: "#0B1020", opacity: dark, pointerEvents: "none" }} />
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#2A1D10", 600)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };
  // the shop insert: roll-up door down, valve cover off + feeler gauge, door up
  const shop = (t) => {
    const door = 1 - ez(t, T.so2 + 0.05, 0.45, EASE.out);
    return <AbsoluteFill style={{ background: "#1E1F22" }}>
      <div style={{ position: "absolute", inset: -40, transform: `scale(${1.04 + 0.06 * seg(t, T.so2, T.and2)})` }}><Img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", filter: "brightness(.85)" }} /></div>
      {/* feeler gauge blades */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(560 1120) rotate(${-25 + 6 * Math.sin(t * 2)})`}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={0} y={-6} width={520} height={20} rx={10} fill={`rgb(${200 - i * 12},${205 - i * 12},${210 - i * 12})`} transform={`rotate(${i * 6})`} stroke="#7A8086" strokeWidth={2} />)}
          <circle cx={0} cy={4} r={24} fill="#55595E" /></g></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: H * door, background: "repeating-linear-gradient(180deg, #8C9298 0 46px, #6E747A 46px 52px)", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }} />
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => road(t, "hook") },
    { at: T.so2 - 0.12, render: shop, enter: { kind: "match" } },
    { at: T.and2 - 0.12, render: (t) => road(t, "back"), enter: { kind: "rise", d: 0.45 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "air-slow-push", 0.6], ...SIGNS.flatMap((s) => [[s.pass - 0.15, "whoosh"], [s.pass + 0.2, "creak-soft"]]), [T.never - 0.2, "tint-drain"],
    [T.so2 - 0.3, "clunk"], [T.so2 + 0.1, "ratchet"], [T.and2 - 0.5, "slide-soft"], [T.and2 - 0.1, "card-rise"], [T.date2, "pop-soft"], [T.measurements, "pop-soft"], [T.who, "pop-soft"],
    [STOP - 0.4, "whoosh"], [STOP, "card-settle"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 53, mode: "major", style: "warm", cut: T.never - 0.2, ret: T.and2 - 0.12 };
  return { shots, heads, sfx, music };
}
