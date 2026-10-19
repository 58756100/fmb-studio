// @ts-nocheck
// SC-06 (lane C, garages / body shops): while the Miata's paint cures, Loretta (Brightwater Collision) does its build
// page now, not tonight, because tonight never happens (last week's jobs are still on the clipboard). Ozzie's photos,
// the new fender, Classic Red basecoat from Larkin, and the bit nobody writes down: Ozzie's match note (blended into the
// driver's door). Brightwater did the job, Ozzie sprayed it. Save. The booth's still warm, so last week's door job goes
// on next with its real date. Two still to go, but today's job won't end up on that clipboard.
// Device: the paint-booth viewing window. Entries appear on the glass, over the car baking behind it; the amber cure
// light is the clock and changes once (to white at "two still to go"). No phone.
// Bank: booth F08, Miata side A08 (spoken model; bank set A), Loretta E04 (reflection), clipboard D06, panel photo G11.
// Drawn: tickets, glass, the seam light. Fictional: Loretta, Ozzie, Brightwater Collision, Larkin Refinish.
// Transitions: window <-> clipboard whips (camera slides), photos drop onto the glass, push-in on the paint row, rack
// focus on the seam behind the note, save-and-shrink into the corner, ticket peels off and flies to the glass (whip
// carry), the light change, CTA landing over frame 0's window.
// remocn (ported): focus-pull (seam), typewriter (note on glass), micro-scale-fade (chips), stamp tick, period-drop.
// New vs the previous reels: glass-written UI over a live scene, single light change as the clock.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark, Who, Tick, Ripple } from "./b2kit";

export const HOOK_WORDS = 13;
export const TAIL = 1.3;
export const LIFE = 1.3;
export const BG = "#1B1C1F";
export const TEXT = { ...HTEXT, size: 108, color: "#F5F5F7" };
export const IMAGES = ["F08", "A08", "E04", "D06", "G11"];
const HOOKS = { A: "While the / paint dries", B: "Tonight / means never.", C: "The code isn't / the job." };
const AMBER = "#FFB54A";
const GLASS = { background: "rgba(255,255,255,.86)", backdropFilter: "blur(6px)", borderRadius: 28, boxShadow: "0 18px 40px -20px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.6)" };
const HAND = (size, color = "#3A3A3C") => ({ fontFamily: "Caveat", fontSize: size, fontWeight: 600, color, lineHeight: 1.0, whiteSpace: "nowrap" });

// a ticket (paper slip) from the clipboard
const Ticket = ({ x, y, rot = 0, txt, date, o = 1, s = 1, z = 10 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 520, height: 150, transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: z, background: "linear-gradient(180deg, #FFFDF5, #F1ECDD)", boxShadow: "0 12px 20px -8px rgba(0,0,0,.45)", padding: "18px 26px", boxSizing: "border-box", borderRadius: 6 }}>
    <div style={HAND(60, "#1D1D1F")}>{txt}</div><div style={{ ...HAND(48, "#8A5A2B"), marginTop: 4 }}>{date}</div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    this: at("this"), booth: at("booth,"), doing: at("doing"), page: at("page"), now: at("now,"), because: at("because"), see: at("see"), clipboard: at("clipboard?"),
    last: at("last"), still: at("still"), ozzies: at("ozzie's"), dent: at("dent,"), primer: at("primer,"), fender: at("fender"), newf: at("new"), classic: at("classic"),
    larkin: at("larkin."), and: at("and", 2), nobody: at("nobody"), match: at("match"), he: at("he"), blended: at("blended"), door: at("door,"), code: at("code"),
    brightwater: at("brightwater"), sprayed: at("sprayed"), save: at("save."), booths: at("booth's"), lastw: at("last", 2), doorjob: at("door", 2), real: at("real"),
    two: at("two"), go: at("go,"), but: at("but"), cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [2] : [1], hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length * 0.4) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Now, / not tonight.", T.now), [T.now, at("not"), at("tonight.")]), key: [2], hold: 0.5 },
    { ...fx(B("Still / waiting.", T.still), [T.still, at("waiting.")]), key: [1], hold: 0.8, color: INK },
    { ...fx(B("The match / note.", T.nobody), [T.nobody, T.match, at("note.")]), key: [1], hold: 0.7 },
    { ...fx(B("One more, / real date.", T.booths), [T.lastw, T.doorjob, T.real, at("date.")]), key: [3], hold: 0.6 },
    { ...fx(B("Two / to go.", T.two), [T.two, at("to"), T.go]), key: [0], hold: 1.0 },
    { ...ctaHead(tl, "Start your next / build page", T.cta), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the booth window
  const WIN = { x: 40, y: 520, w: 1000, h: 1120 };
  const window_ = (t, phase) => {
    const d = drift(t, "win", 3, 0.3);
    const cool = ez(t, T.two - 0.2, 1.2, EASE.io);
    const light = phase === "end" ? 1 : cool;
    const push = phase === "first" ? ez(t, T.larkin - 0.1, 0.8, EASE.camera) * (1 - ez(t, T.blended + 0.8, 1.0, EASE.camera)) : 0;
    const focus = phase === "first" ? ez(t, T.he - 0.2, 0.8) * (1 - ez(t, T.code + 0.6, 0.6)) : 0;
    const saved = phase === "first" ? ez(t, T.save + 0.2, 0.6, EASE.camera) : 1;
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "#1B1C1F" }}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.05 * push - 0.04 * ctaP})`, transformOrigin: "540px 600px" }}>
        {/* the wall around the window */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2A2C30, #17181B)" }} />
        <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 30, overflow: "hidden", boxShadow: "0 0 0 18px #3A3D42, 0 0 0 22px #222428, 0 30px 60px rgba(0,0,0,.6)" }}>
          {/* behind the glass: the booth, the car, the cure light */}
          <div style={{ position: "absolute", inset: -30, transform: `translateX(${-14 * Math.sin(t * 0.25)}px)` }}>
            <Img src={src("F08")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${(4 - 3 * focus).toFixed(1)}px)` }} /></div>
          <div style={{ position: "absolute", left: 0, top: 0, width: WIN.w, height: WIN.h, filter: `blur(${(2.4 - 2.4 * focus).toFixed(1)}px)` }}>
            <Cut id="A08" cx={640} cy={880} w={1700} shadow={0.4} />
            {/* the light running across the fender-to-door seam */}
            <div style={{ position: "absolute", top: 600, width: 180, height: 520, left: lerp(-200, 1200, ((t - 1) * 0.32) % 1), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", transform: "skewX(-18deg)" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${rgba(AMBER, 0.42 * (1 - light))}, ${rgba(AMBER, 0.22 * (1 - light))})`, mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", inset: 0, background: rgba("#FFFFFF", 0.06 + 0.08 * light) }} />
          {/* overspray haze settling + glass reflections + Loretta's faint reflection */}
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 100 + i * 300 + 40 * Math.sin(t * 0.4 + i), top: 200 + ((t * 30 + i * 200) % 700), width: 300, height: 300, borderRadius: "50%", background: "rgba(255,240,220,.18)", filter: "blur(40px)" }} />)}
          <div style={{ position: "absolute", top: -200, width: 220, height: 1700, left: ((t * 90) % 1700) - 400, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.12), rgba(255,255,255,0))", transform: "rotate(22deg)" }} />
          <div style={{ position: "absolute", left: 560, top: 260, opacity: 0.1, transform: "scaleX(-1)", filter: "blur(1px)" }}><Cut id="E04" cx={200} cy={300} w={420} shadow={0} /></div>
          {/* the shop name on the booth door, behind the glass */}
          <div style={{ position: "absolute", left: 40, top: WIN.h - 110, ...inter(42, "rgba(255,255,255,.8)", 700), letterSpacing: "0.12em" }}>BRIGHTWATER COLLISION</div>
        </div>
        {/* entries on the glass */}
        {phase !== "end" && <GlassPage t={t} phase={phase} saved={saved} />}
        {/* saved entries in the corner */}
        {(phase === "end" || saved > 0.98 || phase === "second") && <div style={{ position: "absolute", right: 70, top: 560, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end", zIndex: 30 }}>
          <div style={{ ...GLASS, padding: "12px 22px", display: "flex", gap: 12, alignItems: "center" }}><Tick p={1} size={44} /><span style={inter(42, INK, 600)}>Miata · paint</span></div>
          {(phase === "end" || phase === "second") && <div style={{ ...GLASS, padding: "12px 22px", display: "flex", gap: 12, alignItems: "center", ...(phase === "second" ? land(t, T.two - 0.3) : {}) }}><Tick p={1} size={44} /><span style={inter(42, INK, 600)}>Door · Oct 22</span></div>}
        </div>}
        {phase === "end" && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 90, top: 570, zIndex: 40, ...GLASS, padding: "12px 24px" }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(44, INK, 600)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };
  function GlassPage({ t, phase, saved }) {
    if (phase === "second") {
      // the door job, landed from the clipboard, with its real date
      const q = spr(t - (T.booths + 0.6), 170, 17), out = ez(t, T.two - 0.5, 0.5, EASE.camera);
      return <div style={{ position: "absolute", left: lerp(-700, 110, clamp(q)) + out * 520, top: 640 - out * 60, width: 860, ...GLASS, padding: "30px 36px", boxSizing: "border-box", zIndex: 25, transform: `scale(${1 - 0.6 * out})`, transformOrigin: "100% 0", opacity: 1 - seg(out, 0.8, 1) }}>
        <div style={inter(42, GREY, 500)}>'14 pickup · Brightwater Collision</div>
        <div style={{ ...inter(56, INK, 700), marginTop: 6 }}>Door repaint</div>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 10 }}><span style={{ ...inter(48, RED, 650), background: rgba(RED, 0.08), padding: "2px 14px", borderRadius: 12, ...land(t, T.real) }}>Oct 22, 2026</span><span style={inter(42, GREY, 500)}>photo by Ozzie</span></div>
      </div>;
    }
    const shrink = clamp(saved);
    const P = [["dent", T.dent, "grayscale(1) brightness(.85) contrast(1.2)"], ["primer", T.primer, "grayscale(1) brightness(1.15) contrast(.8)"], ["fitted", T.fender, "saturate(.3) brightness(1.05)"]];
    return <div style={{ position: "absolute", left: 90, top: 560, width: 900, zIndex: 25, transformOrigin: "100% 0", transform: `translate(${shrink * 40}px, 0) scale(${1 - 0.62 * shrink})`, opacity: 1 - seg(shrink, 0.75, 1) }}>
      <div style={{ ...GLASS, padding: "26px 32px", ...land(t, T.doing) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Wordmark size={42} /><span style={inter(40, GREY, 500)}>· build page</span></div>
        <div style={{ ...inter(56, INK, 700), marginTop: 6 }}>'91 Miata · Brightwater Collision</div>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 18 }}>{P.map(([k, tt, f], i) => { const q = spr(t - (tt - 0.15), 200, 15); return t > tt - 0.15 &&
        <div key={k} style={{ width: 288, height: 200, borderRadius: 22, overflow: "hidden", boxShadow: "0 14px 24px -10px rgba(0,0,0,.6)", opacity: clamp(q * 2), transform: `translateY(${(1 - clamp(q)) * -120}px) rotate(${(1 - clamp(q)) * 8}deg)`, position: "relative" }}>
          <Img src={src("G11")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${30 + i * 25}% 50%`, filter: f }} />
          {k === "dent" && <div style={{ position: "absolute", left: 110, top: 70, width: 90, height: 60, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.55), rgba(0,0,0,0))" }} />}
        </div>; })}</div>
      {[["Front fender", "OEM", T.newf - 0.1], ["Basecoat · Classic Red", "Larkin Refinish", T.classic - 0.1]].map(([k, v, tt], i) =>
        <div key={i} style={{ ...GLASS, marginTop: 14, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", ...land(t, tt) }}>
          <span style={inter(46, INK, 600)}>{k}</span><span style={inter(42, GREY, 500)}>{v}</span></div>)}
      {t > T.match - 0.4 && <div style={{ ...GLASS, marginTop: 14, padding: "18px 28px", boxShadow: `${GLASS.boxShadow}, 0 0 0 4px ${rgba(RED, 0.35 * (1 - seg(t, T.door, T.door + 1)))}`, ...land(t, T.match - 0.4) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={inter(42, RED, 650)}>Match note</span><Who ch="O" name="Ozzie" bg="#5E5CE6" size={48} /></div>
        <Typed t={t} t0={T.blended - 0.05} t1={T.door + 0.2} text="Blended into the driver's door" caret={RED} style={HAND(64, "#1D1D1F")} keepCaret={0.3} />
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <span style={{ ...inter(40, INK, 600), padding: "6px 16px", borderRadius: 20, background: "#F2F2F7", ...land(t, T.brightwater) }}>Brightwater Collision</span>
          <span style={{ ...inter(40, INK, 600), padding: "6px 16px", borderRadius: 20, background: "#F2F2F7", ...land(t, T.sprayed) }}>Ozzie · painter</span></div>
      </div>}
      <Ripple t={t} t0={T.save - 0.05} x={780} y={1000} />
    </div>;
  }
  // ---------------------------------------------------------------- the clipboard on the shop wall
  const clip = (t, phase) => {
    const d = drift(t, "cl", 3, 0.3);
    const peel = phase === "second" ? ez(t, T.lastw - 0.1, 0.9, EASE.in) : 0;
    const tk = (i) => spr(t - (T.see + i * 0.12), 200, 15);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #E7E4DE, #D3CEC5)" }}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="D06" cx={540} cy={1120} w={860} shadow={0.4} />
        <Ticket x={290} y={760} rot={-4} txt="Tailgate" date="Oct 19" s={phase === "first" ? clamp(tk(0)) : 1} />
        <Ticket x={300} y={950} rot={3} txt="Quarter panel" date="Oct 20" s={phase === "first" ? clamp(tk(1)) : 1} />
        <Ticket x={280 + peel * 900} y={1140 - peel * 600} rot={-2 + peel * 40} txt="Door" date="Oct 22" s={phase === "first" ? clamp(tk(2)) : 1 - 0.3 * peel} o={1 - seg(peel, 0.8, 1)} z={20} />
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => window_(t, "first") },
    { at: T.see - 0.12, render: (t) => clip(t, "first"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.ozzies - 0.12, render: (t) => window_(t, "first"), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.booths - 0.12, render: (t) => clip(t, "second"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.lastw + 0.45, render: (t) => window_(t, "second"), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.cta - 0.12, render: (t) => window_(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "air-slow-push", 0.5], [T.doing, "pop-soft"], [T.see, "paper-flutter"], [T.dent - 0.15, "photo-settle"], [T.primer - 0.15, "photo-settle"], [T.fender - 0.15, "photo-settle"],
    [T.newf - 0.1, "pop-soft"], [T.classic - 0.1, "pop-soft"], [T.larkin - 0.1, "lens-settle"], [T.match - 0.4, "card-rise"], [T.blended, "pen-write"], [T.brightwater, "chip-pop"],
    [T.sprayed, "chip-pop"], [T.save - 0.05, "tap"], [T.save + 0.1, "check"], [T.save + 0.3, "card-fold"], [T.lastw - 0.1, "paper-flutter"], [T.real, "pop-soft"],
    [T.two - 0.2, "tint-swell"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 104, root: 53, mode: "major", style: "warm", cut: T.nobody - 0.2, ret: T.brightwater - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
