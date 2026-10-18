// @ts-nocheck
// S0-05 (lane 0, collectors): "Door Closing", a two-voice skit. Hal (K4-01) is leaving for three weeks and his daughter
// Jo (K4-02) keeps his panda AE86 (A39). He hit the garage button on the way out: every fact he rattles off (coolant
// sweats, idles rough till warm, timing belt 2019 at Rocco's) is cut short by the door coming down a panel at a time,
// and Jo seems to be texting. The door stops. Jo: "Relax. It's all going on her page." The closed panels ARE the record.
// "She's never been out in the rain. Keep it that way." "Logged." The door shuts with the whole record on its face.
// Device: the door is the clock and the page. Five white panels drop one per fact; the visible car shrinks by a panel per
// line; on the reveal the outer face of the door reads as the car's log, bottom panel last.
// Look: morning facade (warm siding, concrete drive), lit home garage (F02) behind the opening, white door, one red line.
// Transitions: none cut; one continuous shot. The camera pushes toward the shrinking gap, the door stops dead (silence),
// the camera pulls back to reveal the panels as log lines, the bottom panel types the last line, the door closes, a
// knock, the CTA over the closed door, and the door rolls back up to frame 0 (loop).
// remocn (ported): stage camera keyframes, typewriter (bottom panel), focus-blur-resolve (panel lines), period-drop.
// New vs S0-11: a door as the timer and the page in one object.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed } from "../kit";
import { font } from "./s0kit";

export const HOOK_WORDS = 11;
export const TAIL = 1.0;
export const LIFE = 1.4;
export const BG = "#EDE7DC";
export const TEXT = { font: "Inter", weight: 650, size: 108, min: 76, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["F02", "A39", "K4-01", "K4-02"];
const OP = { x: 250, y: 640, w: 760, h: 800 }, PH = 160; // the opening and one panel
const LINES = [
  { a: "Hal's AE86 · fuelmybuild.com", sub: "with Jo for 3 weeks" },
  { a: "Coolant: light sweat, normal", sub: "logged by Jo · from Hal" },
  { a: "Idles rough till warm · 2 min", sub: "logged by Jo · from Hal" },
  { a: "Timing belt · 2019 · Rocco's", sub: "logged by Jo · from Hal" },
  { a: "Never out in the rain.", sub: "Keep it that way. (Hal)", red: true },
];

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    okay: at("okay!"), coolant: at("coolant"), sweats2: at("sweats,"), got1: at("got", 1), she: at("she"), give: at("give"), got2: at("got", 2), timing: at("timing"), rocco: at("rocco's"),
    uh: at("uh..."), dad: at("dad."), door: at("door."), last: at("last"), imp: at("important"), one: at("one..."), relax: at("relax."), page: at("page."), then: at("then"),
    never: at("never"), rain: at("rain."), keep: at("keep", 2), logged: at("logged."), flight: at("flight."), your: tl.cta("your") ?? at("your"),
  };
  const STOP = T.one + 0.25;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["Dad,", hw[0].s], ["the", hw[1].s], ["door's", hw[2].s], ["closing.", hw[3].s]], { key: [3], hold: 0.3 }), W_([["Ten", hw[6].s], ["seconds.", hw[7].s], ["Everything.", hw[10].s]], { key: [2] })]
    : hook === "B" ? [W_([["Everything's", hw[0].s], ["in", hw[5].s], ["Dad's", hw[7].s], ["head.", hw[8].s]], { key: [3], hold: 0.3 }), W_([["His", hw[10].s], ["ride's", hw[11].s], ["outside.", hw[12].s]], { key: [2] })]
    : [W_([["Dad's", hw[1].s], ["service", hw[3].s], ["manual", hw[4].s]], { key: [2], hold: 0.3 }), W_([["Walking", hw[8].s], ["out", hw[9].s], ["that", hw[10].s], ["door.", hw[11].s]], { key: [3] })];
  hk[hk.length - 1].exit = { at: T.okay - 0.1, mode: "up" };
  const heads = [
    ...hk,
    W_([["Relax.", T.relax]], { hold: 0.6 }),
    W_([["It's", at("it's")], ["all", at("all")], ["on", at("on")], ["her", at("her", 2)], ["page.", T.page]], { key: [4], hold: 1.0 }),
    W_([["Never", T.never], ["in", at("in", 1)], ["the", at("the", 4)], ["rain.", T.rain]], { key: [3], hold: 1.0 }),
    W_([["Logged.", T.logged]], { key: [0], hold: 1.2 }),
    { ...ctaHead(tl, "Your build page is waiting", T.your), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // door position (panels down, 0..5): creeps in the hook, one panel per fact, stops dead at the gap, closes on "Logged."
  const doorAt = (t) => {
    const h0 = hook === "B" ? 0.15 + 0.6 * ez(t, 0.35, 3.2, EASE.io) : 0.35 + 0.5 * seg(t, 0, T.okay);
    const steps = [[T.okay, 1.1], [T.she, 2.05], [T.timing, 3.0], [T.dad, 3.95], [T.imp - 0.2, 4.72]];
    let d = h0;
    for (const [t0, v] of steps) if (t >= t0 - 0.1) d = lerp(d, v, EASE.io(seg(t, t0 - 0.1, t0 + 1.4)));
    d = Math.min(d, 4.72);
    d = lerp(d, 5, EASE.io(seg(t, T.logged + 0.1, T.logged + 1.2)));
    d = lerp(d, 0.4, EASE.camera(seg(t, tl.last - 0.2, tl.last + 0.95)));
    return d;
  };
  const scene = (t) => {
    const d = doorAt(t), bottom = OP.y + d * PH; // door bottom edge
    const gapC = (bottom + OP.y + OP.h) / 2;
    const cam = track(t, { z: 1, y: 0 }, [[T.timing - 0.3, { z: 1.1, y: -60 }, 2.5, EASE.io], [T.dad - 0.2, { z: 1.2, y: -170 }, 1.6, EASE.io], [STOP + 0.15, { z: 0.97, y: 30 }, 1.3, EASE.camera], [T.your - 0.2, { z: 1.0, y: 0 }, 2.5, EASE.io]]);
    // Hal: turns back (hook C), crouches at the timing belt, one knee at "Dad. The door.", stands and knocks after "Logged."
    const crouch = ez(t, T.timing - 0.2, 0.7, EASE.camera) * 0.5 + ez(t, T.door - 0.2, 0.6, EASE.camera) * 0.5 - ez(t, T.flight - 0.6, 0.8, EASE.camera);
    const knock = t > T.flight + 0.15 && t < T.flight + 0.75 ? Math.abs(Math.sin((t - T.flight - 0.15) * Math.PI * 3.3)) * 14 : 0;
    const d2 = drift(t, "hal", 5, 0.35);
    const typing = t > T.got1 - 1.2 && t < STOP;
    return <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${cam.y}px) scale(${cam.z})`, transformOrigin: `620px ${gapC}px` }}>
        {/* facade: siding above and around the opening, the concrete drive below */}
        <div style={{ position: "absolute", left: -200, top: -200, width: W + 400, height: OP.y + OP.h + 200, background: "repeating-linear-gradient(180deg, #ECE6DA 0 46px, #DED6C8 46px 48px)" }} />
        <div style={{ position: "absolute", left: -200, top: OP.y + OP.h, width: W + 400, height: 900, background: "linear-gradient(180deg, #CFCAC2, #E4E0D9 30%, #D8D3CB)" }} />
        <div style={{ position: "absolute", left: OP.x - 26, top: OP.y - 26, width: OP.w + 52, height: OP.h + 26, background: "#F7F4EE", boxShadow: "0 0 0 2px rgba(0,0,0,.05)" }} />
        {/* inside: the lit garage, the AE86, Jo with her thumbs going */}
        <div style={{ position: "absolute", left: OP.x, top: OP.y, width: OP.w, height: OP.h, overflow: "hidden", background: "#1A1610" }}>
          <img src={src("F02")} style={{ position: "absolute", left: -200, top: -260, width: OP.w + 400, height: OP.h + 520, objectFit: "cover", objectPosition: "50% 70%", filter: "brightness(.9)" }} />
          <Cut id="A39" cx={330} cy={610} w={640} shadow={0.55} />
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${Math.sin(t * 1.7) * 3}px)` }}><Cut id="K4-02" cx={640} cy={560} w={330} shadow={0} /></div>
          {typing && <div style={{ position: "absolute", left: 610, top: 640, width: 70, height: 40, borderRadius: 20, background: "rgba(190,215,255,.55)", filter: "blur(10px)", opacity: 0.6 + 0.4 * Math.sin(t * 13) }} />}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: Math.max(0, bottom - OP.y) + 30, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.35))" }} />
        </div>
        {/* the door: five panels, the outside face; lines show from the reveal */}
        <div style={{ position: "absolute", left: OP.x, top: OP.y, width: OP.w, height: OP.h, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: bottom - OP.y - 5 * PH, width: OP.w, height: 5 * PH }}>
            {LINES.map((ln, i) => {
              const q = i === 4 ? 1 : spr(t - (T.relax + 0.25 + (4 - i) * 0.18), 200, 19);
              const show = t > T.relax + 0.1;
              return <div key={i} style={{ position: "absolute", left: 0, top: i * PH, width: OP.w, height: PH, background: "linear-gradient(180deg, #FFFFFF, #F1F1F3 70%, #E3E3E6)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,.08), inset 0 2px 0 #fff" }}>
                {show && i < 4 && <div style={{ position: "absolute", left: 30, top: 22, opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 14}px)`, filter: q < 0.6 ? `blur(${(1 - q / 0.6) * 6}px)` : undefined }}>
                  <div style={font("Inter", i === 0 ? 46 : 44, INK, 650)}>{ln.a}</div><div style={{ ...font("Inter", 40, GREY, 500), marginTop: 4 }}>{ln.sub}</div></div>}
                {i === 4 && t > T.never - 0.1 && <div style={{ position: "absolute", left: 30, top: 22 }}>
                  <Typed t={t} t0={T.never - 0.05} t1={T.rain + 0.1} text={ln.a} caret={RED} style={font("Inter", 46, RED, 650)} />
                  <div style={{ ...font("Inter", 40, GREY, 500), marginTop: 4, opacity: ez(t, T.keep, 0.4) }}>{ln.sub}</div></div>}
              </div>;
            })}
          </div>
        </div>
        {/* Hal, outside at the left edge, on the drive */}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${d2.x + crouch * 30}px, ${crouch * 230 + knock * 0}px) rotate(${crouch * 4 + (hook === "C" ? -6 * (1 - ez(t, 0.4, 0.8)) : 0)}deg)`, transformOrigin: "160px 1900px" }}>
          <Cut id="K4-01" cx={150} cy={1420} w={520} shadow={0.3} />
        </div>
        {/* knock: two taps on the closed door */}
        {[0, 1].map((k) => { const tk = T.flight + 0.25 + k * 0.28, p = seg(t, tk, tk + 0.4); return p > 0 && p < 1 && <div key={k} style={{ position: "absolute", left: 330 - 40, top: 1100 - 40, width: 80, height: 80, borderRadius: 40, border: "4px solid rgba(29,29,31,.35)", transform: `scale(${0.5 + 1.6 * p})`, opacity: 1 - p }} />; })}
      </div>
    </AbsoluteFill>;
  };
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...(hook === "B" ? [[0.3, "notif", 0.4], [0.35, "caster-roll"]] : [[0.05, "caster-roll", 0.7]]),
    [T.okay - 0.1, "caster-roll"], [T.okay + 0.1, "clunk", 0.6], [T.got1 - 1.0, "typing:1.2"], [T.she - 0.1, "caster-roll"], [T.she + 0.1, "clunk", 0.6], [T.got2 - 0.3, "typing:0.8"],
    [T.timing - 0.1, "caster-roll"], [T.timing + 0.1, "clunk", 0.6], [T.dad - 0.1, "caster-roll"], [T.imp - 0.2, "caster-roll"], [STOP, "muted-stop"],
    [T.relax + 0.25, "tick-soft-x3"], [T.never - 0.05, "typing:1.0"], [T.logged + 0.1, "caster-roll"], [T.logged + 1.15, "clunk"],
    [T.flight + 0.25, "paper-thud", 0.8], [T.flight + 0.53, "paper-thud", 0.8], [ctaT, "cta-pop"], [tl.last - 0.2, "caster-roll-out"],
  ];
  // music: warm and hurried; stops dead with the door (silence before "Relax"), returns on the reveal
  const music = { bpm: 112, root: 52, mode: "major", style: "warm", cut: STOP - 0.05, ret: T.relax - 0.02 };
  return { shots: [{ at: 0, render: scene }], heads, sfx, music };
}
