// @ts-nocheck
// C3-COL (lane C, collectors): "Loser buys dinner." Marisol (2021) and Dev (2017) bet dinner on the year her Evo's intake
// went on. Her build page says Jun 14, 2019: both two years off, nobody won, they split the check.
// Device: time as distance. A cream year ruler across the lower third; one continuous lateral camera (no cuts);
// the argument is the red-tinted tape between two flags; the 2019 tick splits and the log card rises out of the tape.
// Hero: Evo VI (legacy cutout, not in the bank yet) + cold-air intake (C04); card photo = C04 in the home garage (F02).
// Transitions (no cuts by design): lateral camera glides, pull-back, tick-split portal (card opens out of the tick),
// fold-back into the tape, CTA landing over the story frame.
// remocn (ported): squiggle -> measure lines, inline-highlight (years), typewriter (URL), focus-blur-resolve (card fields),
// period-drop. New vs B-L3: squiggle-style measure lines, per-character date rise.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, DrawPath, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD, Studio } from "./laneB";

export const HOOK_WORDS = 3;
export const TAIL = 1.0;
export const LIFE = 1.8; // white set: stronger camera drift keeps holds alive
export const BG = "#FFFFFF";
export const TEXT = { ...HTEXT, size: 116 };
export const IMAGES = ["EVO", "C04", "F02"];
const HOOKS = { A: "Loser buys dinner.", B: "Every car friend / has this bet.", C: "Dinner's on it." };
const PX = 205, TAPE_Y = 1290, CREAM = "#F2EBDD";

// the check presenter (no bank image yet): black leatherette folder with a paper edge
const Check = ({ x, y, s = 1, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - 95, top: y - 58, width: 190, height: 116, transform: `rotate(${rot}deg) scale(${s})`, zIndex: 12 }}>
    <div style={{ position: "absolute", left: 22, top: -14, width: 140, height: 40, background: "#FBFAF7", borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(160deg,#2B2B2D,#111113 60%,#1d1d1f)", boxShadow: "0 14px 22px -8px rgba(0,0,0,.55), inset 0 0 0 2px rgba(255,255,255,.06)" }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 10, bottom: 10, borderRadius: 7, border: "2px dashed rgba(255,255,255,.12)" }} />
  </div>
);
const Flag = ({ x, y, name, year, lift = 0, wave = 0, t, left = false }) => {
  const sway = Math.sin(t * 3.1 + x * 0.01) * 3 + wave;
  return <div style={{ position: "absolute", left: x - 4, top: y - 250 - lift, width: 300, height: 260, zIndex: 14, transform: left ? "scaleX(-1)" : undefined, transformOrigin: "4px 0" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 260, borderRadius: 4, background: "#8E8E93" }} />
    <div style={{ position: "absolute", left: 8, top: 6, width: 210, height: 128, background: RED, clipPath: `polygon(0 0, 100% ${8 + sway}%, ${92 + sway * 0.3}% 50%, 100% ${92 - sway}%, 0 100%)`,
      boxShadow: "0 8px 16px rgba(0,0,0,.15)", padding: "12px 20px" }}>
      <div style={{ transform: left ? "scaleX(-1)" : undefined, transformOrigin: "85px 50%" }}>
        <div style={inter(40, "rgba(255,255,255,.9)", 600)}>{name}</div>
        <div style={inter(56, "#fff", 700)}>{year}</div>
      </div>
    </div>
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    mar: at("marisol's"), when: at("when"), intake: at("intake"), on: at("on?"), y21: at("twenty"), hot: at("hot"), y17: at("seventeen"), held: at("held"),
    he: at("he"), witness: at("witness"), himself: at("himself"), fine: at("fine"), look: at("look"), int2: at("intake", 2), june: at("june"), nineteen: at("nineteen"),
    her: at("her"), photo: at("photo"), two: at("two"), off: at("off"), both: at("both"), nobody: at("nobody"), split: at("split"), check: at("check"),
    date: tl.cta("save") ?? at("date"), end: tl.last,
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const heads = [
    { words: wordsFor(tl.hook, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [4] : [0] },
    B("Marisol's Evo.", T.mar, { hold: 0.7 }),
    fx(B("Intake: what year?", T.when), [T.intake, T.intake + 0.25, T.on]),
    fx(B("2021. Hot summer.", T.y21), [T.y21, T.hot, at("summer")]),
    fx(B("2017.", T.y17), [T.y17]),
    B("I held the light.", T.held - 0.3, { key: [3] }),
    fx(B("Witness: himself.", T.he), [T.witness, T.himself]),
    B("Fine. Look it up.", T.fine, { exit: { at: T.int2 - 0.3, mode: "push", to: { x: 540, y: TAPE_Y } } }),
    B("Two years off.", T.two, { key: [2] }),
    B("Both of us.", T.both, { exit: { at: Math.max(T.both + 0.75, T.nobody - 0.42), mode: "up" } }),
    B("Nobody won.", T.nobody, { hold: 0.5 }),
    B("They split the check.", T.split - 0.2, { key: [3], hold: 0.5 }),
    { ...ctaHead(tl, "Save this one", T.date), key: [2] },
  ];
  heads[2].key = [2];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  const scene = (t) => {
    // camera: centre year + zoom (world: x = (year - camYear) * PX)
    const cam = track(t, { y: 2019, k: 1 }, [
      [T.y21 - 0.1, { y: 2020.3 }, 1.0], [T.y17 - 0.15, { y: 2017.7 }, 1.2], [T.he - 0.1, { y: 2019, k: 0.94 }, 0.9],
      [T.fine - 0.05, { k: 1.1 }, 1.2], [T.two - 0.2, { k: 1.0 }, 0.8], [T.date - 0.2, { k: 0.96 }, 1.0],
    ]);
    // end card: the ruler keeps gliding slowly under the CTA (a held end frame never reads as a still)
    const glide = 0.35 * EASE.io(seg(t, T.date - 0.2, tl.last + 1.2));
    const X = (yr) => 540 + (yr - cam.y - glide) * PX * cam.k;
    const d = drift(t, "col", 3, 0.22);
    const tint = ez(t, T.y17 - 0.1, 1.0) * (1 - ez(t, T.split - 0.1, 0.8));
    const open = ez(t, T.look - 0.05, 0.6, EASE.camera) * (1 - ez(t, T.date - 0.3, 0.8, EASE.camera));
    const card = ez(t, T.int2 - 0.25, 0.7, EASE.camera) * (1 - ez(t, T.two - 0.25, 0.6, EASE.camera));
    const mini = ez(t, T.two - 0.25, 0.6, EASE.camera) * (1 - ez(t, T.date - 0.3, 0.7, EASE.camera));
    const checkYr = lerp(2019, 2019.25, ez(t, T.witness, 0.5)) * 1;
    const checkX = X(lerp(checkYr, 2019, ez(t, T.split - 0.1, 0.6)));
    const slap = hook === "A" ? tl.hook[2].s : hook === "C" ? tl.hook[0].s - 0.5 : tl.hook[5].s;
    const drop = spr(t - (slap - 0.25), 260, 16);
    const mLift = 30 * Math.sin(Math.PI * seg(t, T.y21 - 0.15, T.y21 + 0.25)), dLift = 30 * Math.sin(Math.PI * seg(t, T.y17 - 0.15, T.y17 + 0.25));
    const carO = 1 - 0.85 * card;
    const measure = ez(t, T.two + 0.2, 0.5);
    return <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.4) }}>
        {/* the car (parallax: moves a third of the camera) */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(2019 - cam.y) * PX * 0.3}px)`, opacity: carO }}>
          <Cut id="EVO" cx={560} cy={790} w={760 * (1 + 0.03 * (cam.k - 1))} shadow={0.35} />
          <Cut id="C04" cx={150} cy={lerp(1010, 985, ez(t, T.intake - 0.1, 0.4))} w={210} rot={-8 + Math.sin(t * 0.9) * 1.5} shadow={0.3} />
        </div>
        {/* leader line from the intake to the "?" */}
        <DrawPath d={`M 200 1040 C 300 1100, ${X(2019) - 120} 1130, ${X(2019) - 34} 1080`} p={ez(t, T.intake, 0.5) * (1 - ez(t, T.y21 - 0.2, 0.3))} color={GREY} width={5} />
        {/* the ruler */}
        <div style={{ position: "absolute", left: 0, right: 0, top: TAPE_Y, height: 110, background: CREAM, boxShadow: "inset 0 2px 0 rgba(0,0,0,.04), 0 10px 20px -14px rgba(0,0,0,.25)" }} />
        <div style={{ position: "absolute", top: TAPE_Y, height: 110, left: X(2017), width: Math.max(0, X(2021) - X(2017)), background: `rgba(244,48,52,${0.2 * tint})` }} />
        {Array.from({ length: 9 * 4 + 1 }, (_, i) => {
          const yr = 2015 + i / 4, x = X(yr), major = i % 4 === 0;
          if (x < -40 || x > 1120) return null;
          const isT = Math.abs(yr - 2019) < 0.01;
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - (major ? 2.5 : 1.5) - (isT ? open * 30 : 0), top: TAPE_Y, width: major ? 5 : 3, height: major ? 44 : 24, background: "#5A5650" }} />
            {isT && open > 0.01 && <div style={{ position: "absolute", left: x - 2.5 + open * 30, top: TAPE_Y, width: 5, height: 44, background: "#5A5650" }} />}
            {isT && open > 0.01 && <div style={{ position: "absolute", left: x - open * 30, top: TAPE_Y, width: open * 60, height: 110, background: "radial-gradient(closest-side, rgba(255,250,235,1), rgba(255,250,235,0))" }} />}
            {major && <div style={{ position: "absolute", left: x - 60, width: 120, top: TAPE_Y + 52, textAlign: "center", ...inter(44, isT && t > T.june ? RED : "#5A5650", 600) }}>{Math.round(yr)}</div>}
          </React.Fragment>;
        })}
        {/* "?" over the gap */}
        <div style={{ position: "absolute", left: X(2019) - 40, top: 1030, width: 80, textAlign: "center", ...inter(96, "#C7C7CC", 600), opacity: 1 - open, transform: `scale(${1 + 0.06 * Math.sin(t * 2.2)})` }}>?</div>
        <Flag t={t} x={X(2017)} y={TAPE_Y} name="Dev" year="2017" lift={dLift} />
        <Flag t={t} x={X(2021)} y={TAPE_Y} name="Marisol" year="2021" lift={mLift} left />
        {/* measure lines: two years each side */}
        {measure > 0.01 && [[2017, 2019], [2021, 2019]].map(([a, b], i) => <React.Fragment key={i}>
          <div style={{ position: "absolute", top: TAPE_Y - 40, left: Math.min(X(a), lerp(X(a), X(b), measure)), width: Math.abs(lerp(X(a), X(b), measure) - X(a)), height: 4, background: INK, opacity: (1 - ez(t, T.date - 0.3, 0.4)) }} />
          <div style={{ position: "absolute", top: TAPE_Y - 104, left: (X(a) + X(b)) / 2 - 90, width: 180, textAlign: "center", ...inter(44, INK, 600), opacity: seg(t, T.off - 0.1, T.off + 0.2) * (1 - ez(t, T.date - 0.3, 0.4)) }}>2 years</div>
        </React.Fragment>)}
        <Check x={checkX} y={TAPE_Y - 70 - (1 - drop) * 300} s={1} rot={-4 + 3 * Math.sin(t * 0.7)} />
        {/* the log card rises out of the 2019 tick */}
        {card > 0.01 && <LogCard t={t} p={card} T={T} x={540} />}
        {mini > 0.01 && <div style={{ position: "absolute", left: X(2019) - 170, top: TAPE_Y - 340 + (1 - mini) * 80, width: 340, ...CARD, borderRadius: 26, padding: "16px 20px", opacity: mini, zIndex: 20 }}>
          <div style={inter(40, INK, 600)}>Intake</div><div style={inter(44, RED, 600)}>Jun 14, 2019</div>
        </div>}
        {/* CTA URL under the headline */}
      </div>
    </AbsoluteFill>;
  };
  // sound: one cue per on-screen action (one continuous shot; headline landings are added by audio/score.py)
  const slap = hook === "A" ? tl.hook[2].s : hook === "C" ? tl.hook[0].s - 0.5 : tl.hook[5].s;
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [Math.max(0, slap - 0.12), "leather-slap"], [T.intake - 0.1, "part-lift"], [T.intake, "pencil-line"],
    [T.y21 - 0.15, "flag-flutter"], [T.y21 - 0.1, "air-glide"], [T.y17 - 0.2, "air-glide-long"], [T.y17 - 0.05, "flag-flutter"], [T.y17 + 0.1, "tint-swell"],
    [T.he - 0.1, "air-pull"], [T.witness, "leather-slide"], [T.fine - 0.05, "air-slow-push"], [T.look - 0.05, "tape-split"],
    [T.int2 - 0.25, "card-rise"], [T.june - 0.05, "value-tick"], [T.june + 0.5, "photo-settle"], [T.her, "pop-soft"], [T.her + 0.25, "tick-soft"],
    [T.two - 0.25, "card-fold"], [T.two + 0.2, "measure-draw-x2"], [T.two + 0.35, "card-settle"], [T.off - 0.1, "label-in"],
    [T.split - 0.1, "leather-slide"], [T.split + 0.1, "tint-drain"], [T.date - 0.3, "paper-fold", 0.7], [ctaT, "cta-pop"],
  ];
  // music (as in the lab): the band stops for the look-up, dead air with the restaurant under it, back in on "two years off"
  const music = { bpm: 96, root: 50, mode: "minor", style: "warm", cut: T.look - 0.4, ret: T.two - 0.25, room: "restaurant" };
  return { shots: [{ at: 0, render: scene }], heads, sfx, music };
}

const LogCard = ({ t, p, T, x }) => {
  const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 24}px)`, filter: q < 0.6 ? `blur(${(1 - q / 0.6) * 8}px)` : undefined }; };
  return <div style={{ position: "absolute", left: x - 450, top: lerp(TAPE_Y - 40, 540, p), width: 900, height: lerp(60, 840, p), overflow: "hidden", zIndex: 25, borderRadius: 40,
    background: "rgba(255,255,255,.9)", backdropFilter: "blur(20px)", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 40px 60px -30px rgba(0,0,0,.35)", opacity: clamp(p * 3) }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 300, left: ((t * 160) % 1500) - 500, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.4), rgba(255,255,255,0))", zIndex: 2 }} />
    <div style={{ padding: "40px 44px" }}>
      <div style={{ ...inter(66, INK, 650), ...f(T.int2) }}>Intake · Velden Air</div>
      <div style={{ ...inter(52, RED, 600), marginTop: 8, ...f(T.june - 0.05) }}>Jun 14, 2019</div>
      <div style={{ marginTop: 26, height: 450, borderRadius: 28, overflow: "hidden", position: "relative", ...f(T.june + 0.5) }}>
        <img src={src("F02")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 72%", filter: "blur(3px) brightness(.9)", transform: "scale(1.1)" }} />
        <Cut id="C04" cx={406} cy={240} w={600 * (1 + 0.03 * seg(t, T.her, T.her + 4))} rot={-6} shadow={0.6} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22, ...f(T.her) }}>
        <span style={{ padding: "8px 24px", borderRadius: 30, background: "#F2F2F7", ...inter(40, GREY, 500) }}>logged by Marisol</span>
      </div>
      <div style={{ marginTop: 10, ...inter(40, GREY, 500), ...f(T.her + 0.25) }}>fuelmybuild.com/marisol/evo</div>
    </div>
  </div>;
};
