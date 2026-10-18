// @ts-nocheck
// S0-12 (lane C, parts suppliers): Priya runs Laurel Wheel Co. She sold 38 sets of wheels this year; only four
// customers sent her their build pages. Her easy spring call was doubling the bronze 18s. Two of the four pages show
// rubbing at full lock, then a switch to 17s from another brand. Two cars aren't the whole picture, so she holds the big
// order, asks those two about their setups and trials a small batch of 17s. The other 34 sets: no idea. Next time she
// asks for the link.
// Device: the cap wall. One spare center cap from every set she sold, 38 on a pegboard, 4 glowing (the customers who
// sent pages). A lit cap's face opens like a porthole onto that car's page.
// Hero: bronze wheel C07 (and black C08), Camaro A19, Mustang A16, Priya = E10 (fictional), wheel-arch photo G06.
// Caps, pegboard, order form and pen are drawn (no bank images; requested as I09-I12 in the script).
// Transitions: tilt down (rise) wall -> order form, tilt up, porthole portal into the Camaro page, whip carry to the
// Mustang page, the two portholes side by side, pull back to the whole wall, tilt down to the form (cross out, new line),
// tilt up to the wall, CTA landing over the wall with the revised form on the counter.
// remocn (ported): lens-zoom settle (porthole), strikethrough-replace (order line), focus-blur-resolve (log rows),
// marker squiggle, typewriter (URL), period-drop. New vs the previous reels: porthole iris, handwritten form.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Thumb, Sweep } from "./b2kit";

export const HOOK_WORDS = 15;
export const TAIL = 1.2;
export const LIFE = 1.3;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["C07", "C08", "A19", "A16", "E10", "G06"];
const HOOKS = { A: "38 sets sold. / 4 showed me.", B: "Almost doubled / my bestseller.", C: "Two customers / switched wheels." };
const BRONZE = ["#E2B979", "#9C6A2E"], BLACK = ["#5A5D63", "#1B1C1F"], INKB = "#24409A", GLOW = "#FFB547";

// cap wall layout: rows of 7,6,7,6,7,5 = 38 caps, honeycomb
const ROWS = [7, 6, 7, 6, 7, 5], CS = 112, DX = 136, DY = 118, WALL_Y = 660;
const CAPS = []; ROWS.forEach((n, r) => { for (let c = 0; c < n; c++) CAPS.push({ x: 540 + (c - (n - 1) / 2) * DX, y: WALL_Y + r * DY, bronze: (r * 3 + c * 5) % 3 !== 0, r, c }); });
const LIT = { camaro: 9, mustang: 23, a: 5, b: 28 }; // indices into CAPS
[LIT.camaro, LIT.mustang, LIT.b].forEach((i) => (CAPS[i].bronze = true));
const Cap = ({ x, y, size = CS, bronze, lit = 0, open = 0, children, t, dim = 0 }) => {
  const g = bronze ? BRONZE : BLACK;
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, zIndex: 5 + (open > 0 ? 5 : 0) }}>
    {lit > 0 && <div style={{ position: "absolute", inset: -size * 0.32, borderRadius: "50%", background: `radial-gradient(closest-side, ${rgba(GLOW, 0.95 * lit)}, ${rgba(GLOW, 0)})` }} />}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${g[0]} 0%, ${g[1]} 75%)`, filter: dim > 0 ? `saturate(${1 - 0.55 * dim}) brightness(${1 - 0.12 * dim})` : undefined, boxShadow: `0 6px 10px rgba(0,0,0,.28), inset 0 0 0 ${size * 0.05}px rgba(255,255,255,.18)` }}>
      {/* five spokes embossed */}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {[0, 72, 144, 216, 288].map((a) => <rect key={a} x={47} y={14} width={6} height={30} rx={3} fill="#fff" transform={`rotate(${a} 50 50)`} />)}
        <circle cx={50} cy={50} r={11} fill="none" stroke="#fff" strokeWidth={3} />
      </svg>
      {lit > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `0 0 0 ${7 * lit}px ${rgba(GLOW, 1)}, 0 0 30px ${10 * lit}px ${rgba(GLOW, 0.6)}` }} />}
    </div>
    {open > 0.01 && <div style={{ position: "absolute", left: size / 2 - (size * 0.86 * open) / 2, top: size / 2 - (size * 0.86 * open) / 2, width: size * 0.86 * open, height: size * 0.86 * open, borderRadius: "50%", overflow: "hidden", background: "#fff" }}>{children}</div>}
  </div>;
};
const Pegboard = ({ t, children, dx = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FBFBFC" }}>
    <div style={{ position: "absolute", left: -100 + dx, top: 570, width: 1280, height: 790, background: "radial-gradient(circle, #D9DBE0 0 5px, transparent 6px) 0 0 / 34px 34px, #F3F4F6", borderRadius: 18, boxShadow: "inset 0 0 0 2px #E5E6EA" }} />
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx}px)` }}>{children}</div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    my: at("my"), due: at("due,"), doubling: at("doubling"), bronze: at("bronze"), best: at("best."), but: at("but"), read: at("read"), four: at("four", 1), me: at("me."),
    camaro: at("camaro"), rubbing: at("rubbing"), lock: at("lock."), few: at("few"), seventeens: at("seventeens"), brand: at("brand."),
    then: at("then"), mustang: at("mustang"), rub2: at("rubbing", 2), same: at("same"), two: at("two"), whole: at("whole"), but2: at("but", 2), four2: at("four", 2), see: at("see."),
    so: at("so"), holding: at("holding"), asking: at("asking"), setups: at("setups,"), trying: at("trying"), smaller: at("smaller"), sev2: at("seventeens", 2),
    other: at("other"), idea: at("no"), next: at("next"), link: at("link."), cta: tl.cta("see") ?? at("see", 2),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const LT = hw[Math.min(9, hw.length - 1)].s; // the four caps light up on "four" (hook A) or late in the hook
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [3] : hook === "B" ? [2] : [2], hold: 1.1 };
  if (hook === "A") fx(hk, [hw[2].s, hw[3].s, hw[4].s, hw[8].s, hw[9].s, hw[10].s]);
  else fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length - 1) / (hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Double the / bronze 18s?", T.doubling), [T.doubling, at("the", 2), T.bronze, T.bronze + 0.3]), key: [2] },
    { ...B("Read first.", T.but), words: [{ w: "Read", t: T.but, line: 0 }, { w: "first.", t: at("first,"), line: 0 }], key: [0], hold: 1.6 },
    { ...fx(B("Same / switch.", T.same), [T.same, at("switch.")]), key: [1], hold: 0.9 },
    { ...fx(B("Two / of four.", T.but2), [at("two", 2), at("of"), T.four2]), key: [2], hold: 1.6 },
    { ...fx(B("Hold. Ask. / Try 17s.", T.holding), [T.holding, T.asking, T.trying, T.sev2]), key: [3], hold: 1.5 },
    { ...ctaHead(tl, "See how build / pages work", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const capOf = (i) => CAPS[i];
  // ---------------------------------------------------------------- the wall (hook, "two of four", "the other 34", CTA)
  const wall = (t, phase) => {
    const d = drift(t, "wall", 3, 0.25);
    const slide = phase === "hook" ? lerp(40, -40, EASE.io(seg(t, 0, 6))) : phase === "pull" ? 0 : lerp(-20, 20, EASE.io(seg(t, T.other - 0.5, tl.last + 1)));
    const litAt = phase === "hook" ? (i) => seg(t, LT + 0.15 * i, 99) : () => 1;
    const lits = [LIT.camaro, LIT.mustang, LIT.a, LIT.b];
    const openTwo = phase === "pull" ? 1 : 0;
    const ctaP = EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7));
    return <AbsoluteFill><Pegboard t={t} dx={slide}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateY(${phase === "end" ? 60 * EASE.camera(seg(t, T.other - 0.4, T.other + 0.4)) : 0}px) scale(${phase === "end" ? lerp(1, 0.82, EASE.camera(seg(t, T.other - 0.4, T.other + 0.4))) : 1})`, transformOrigin: "540px 480px" }}>
        {CAPS.map((c, i) => { const li = lits.indexOf(i); const lit = li >= 0 ? clamp(litAt(li) * 4) * (0.85 + 0.15 * Math.sin(t * 2.3 + i)) : 0;
          const open = openTwo && (i === LIT.camaro || i === LIT.mustang) ? spr(t - (T.two - 0.1 + (i === LIT.mustang ? 0.15 : 0)), 180, 16) : 0;
          return <Cap key={i} x={c.x} y={c.y} bronze={c.bronze} lit={lit} open={clamp(open)} t={t} dim={li < 0 ? clamp(litAt(0) * 2) : 0}>
            <Cut id={i === LIT.camaro ? "A19" : "A16"} cx={48} cy={50} w={110} shadow={0} /></Cap>; })}
      </div>
      {phase === "hook" && <>
        <Cut id="E10" cx={790} cy={1560} w={560} shadow={0} />
        <div style={{ position: "absolute", left: 70, top: 1400, padding: "16px 28px", borderRadius: 40, ...CARD, ...land(t, 0.3) }}>
          <div style={inter(44, INK)}>Priya</div><div style={inter(40, GREY, 500)}>Laurel Wheel Co.</div></div>
      </>}
      {phase === "end" && <div style={{ position: "absolute", left: 170, top: 1140, width: 740, height: 460, overflow: "hidden", borderRadius: 26, transform: `rotate(-2deg) translateY(${(1 - EASE.out(seg(t, T.other - 0.4, T.other + 0.4))) * 500}px) scale(${1 - 0.04 * ctaP})`,
        WebkitMaskImage: "linear-gradient(180deg, #000 82%, transparent)" }}>
        <OrderForm t={t} T={T} w={740} final />
      </div>}
      {phase === "end" && t > T.cta + 0.7 && <div style={{ position: "absolute", left: 0, right: 0, top: 548, textAlign: "center", zIndex: 70 }}>
        <span style={{ display: "inline-block", padding: "8px 26px", borderRadius: 30, background: "rgba(255,255,255,.92)" }}><Typed t={t} t0={T.cta + 0.8} t1={T.cta + 1.5} text="fuelmybuild.com" style={inter(46, GREY, 500)} keepCaret={0.4} /></span></div>}
    </Pegboard></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the counter: the order form + the growing wheel stack
  const counter = (t, phase) => {
    const d = drift(t, "ctr", 3, 0.25);
    const stack = phase === "first" ? Math.round(lerp(2, 6, EASE.out(seg(t, T.doubling, T.best + 0.3)))) : 6;
    const shrink = phase === "second" ? EASE.in(seg(t, T.holding, T.holding + 0.6)) : 0;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, height: 500, background: "linear-gradient(180deg, #E9E3DA, #D9D0C2)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        {Array.from({ length: stack }, (_, i) => { const p = phase === "first" ? spr(t - (T.doubling + (i - 2) * 0.18), 220, 15) : 1;
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: (i < 2 ? 1 : clamp(p * 2)) * (i >= 3 ? 1 - shrink * 0.85 : 1) }}>
            <Cut id="C07" cx={880} cy={1400 - i * 70 - (1 - clamp(p)) * 60} w={340} rot={0} shadow={i === 0 ? 0.3 : 0} style={{ transform: "scaleY(0.42)" }} /></div>; })}
        <div style={{ position: "absolute", left: 90, top: 600, transform: "rotate(-2deg)" }}><OrderForm t={t} T={T} w={780} phase={phase} /></div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- a customer's build page (seen through the porthole)
  const page = (t, who) => {
    const camaro = who === "camaro";
    const car = camaro ? "A19" : "A16", t0 = camaro ? T.camaro : T.mustang;
    const rows = camaro ? [["Wheels · Laurel bronze 18", "JUL 2026", t0 - 0.1, "C07"], ["Rubbing at full lock", "owner", T.rubbing, "G06"], ["Wheels · Stellan 17", "AUG 2026", T.seventeens, "C08"]]
      : [["Wheels · Laurel bronze 18", "SEP 2026", t0 + 0.1, "C07"], ["Rubbing at full lock", "owner", T.rub2, "G06"], ["Wheels · Stellan 17", "OCT 2026", T.same - 0.3, "C08"]];
    const d = drift(t, who, 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 1000, ...CARD, overflow: "hidden", transform: dT(d, 0.5) }}>
        <Sweep t={t} o={0.25} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 330, background: "radial-gradient(120% 90% at 50% 70%, #fff, #ECEDF0)" }}>
          <Cut id={car} cx={480} cy={180} w={600} shadow={0.3} />
          <div style={{ position: "absolute", left: 28, top: 24, padding: "8px 20px", borderRadius: 26, background: "rgba(255,255,255,.85)" }}><Wordmark size={40} /></div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 356, ...inter(60, INK, 650) }}>{camaro ? "Dom's Camaro" : "Rae's Mustang"}</div>
        {rows.map(([txt, when, tt, img], i) => { const red = i === 1;
          return <div key={i} style={{ position: "absolute", left: 40, top: 460 + i * 170, width: 880, height: 150, borderRadius: 26, background: red ? rgba(RED, 0.07) : "#F2F2F7", display: "flex", alignItems: "center", gap: 24, padding: "0 20px", boxSizing: "border-box", ...land(t, tt - 0.05) }}>
            {img === "G06" ? <Thumb id="G06" w={170} h={116} t={t} fx={0.62} fy={0.62} k={1.5} r={18} /> : <div style={{ width: 170, height: 116, position: "relative", flex: "none" }}><Cut id={img} cx={85} cy={58} w={112} shadow={0} /></div>}
            <div><div style={inter(46, red ? RED : INK, 600)}>{txt}</div><div style={inter(40, GREY, 500)}>{red ? "logged by the owner" : when}</div></div></div>; })}
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the two portholes side by side ("the same switch")
  const pair = (t) => {
    const d = drift(t, "pair", 3, 0.25);
    const row = (car, when, x, t0) => { const q = spr(t - t0, 180, 17);
      return <div style={{ position: "absolute", left: x, top: 640, width: 460, opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 40}px)` }}>
        <div style={{ width: 440, height: 440, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 60%, #fff, #E9EAEE)", boxShadow: `0 0 0 16px ${BRONZE[1]}, 0 0 0 22px ${GLOW}, 0 30px 50px -20px rgba(0,0,0,.4)`, position: "relative", margin: "0 10px" }}>
          <Cut id={car} cx={220} cy={240} w={400} shadow={0.25} /></div>
        <div style={{ marginTop: 70, padding: "18px 22px", borderRadius: 24, ...CARD, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 70, height: 60, position: "relative" }}><Cut id="C08" cx={35} cy={30} w={60} shadow={0} /></div>
          <div><div style={inter(42, INK)}>Stellan 17</div><div style={inter(40, GREY, 500)}>{when}</div></div></div>
      </div>; };
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {row("A19", "AUG 2026", 40, T.same - 0.45)}{row("A16", "OCT 2026", 560, T.same - 0.3)}
    </div></Studio></AbsoluteFill>;
  };

  const cap = (i) => ({ x: CAPS[i].x - CS / 2 - 40, y: CAPS[i].y - CS / 2, w: CS, h: CS });
  const shots = [
    { at: 0, render: (t) => wall(t, "hook") },
    { at: T.my - 0.12, render: (t) => counter(t, "first"), enter: { kind: "rise", d: 0.55 } },
    { at: T.but - 0.15, render: (t) => wall(t, "mid"), enter: { kind: "rise", d: 0.5 } },
    { at: T.camaro - 0.55, render: (t) => page(t, "camaro"), enter: { kind: "portal", d: 0.65, rect: cap(LIT.camaro), r: CS / 2 } },
    { at: T.then - 0.1, render: (t) => page(t, "mustang"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.same - 0.5, render: pair, enter: { kind: "pull", d: 0.55, rect: { x: 600, y: 640, w: 440, h: 440 } } },
    { at: T.two - 0.15, render: (t) => wall(t, "pull"), enter: { kind: "pull", d: 0.6, rect: cap(LIT.camaro) } },
    { at: T.so - 0.12, render: (t) => counter(t, "second"), enter: { kind: "rise", d: 0.55 } },
    { at: T.other - 0.12, render: (t) => wall(t, "end"), enter: { kind: "rise", d: 0.55 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [LT, "tick-soft"], [LT + 0.15, "tick-soft"], [LT + 0.3, "tick-soft"], [LT + 0.45, "tick-soft"], [0.3, "pop-soft"],
    [T.due, "pen-write"], [T.doubling + 0.2, "pen-write"], [T.doubling + 0.1, "clunk", 0.5], [T.doubling + 0.5, "clunk", 0.5], [T.best, "clunk", 0.5],
    [T.read, "shimmer-soft"], [T.rubbing - 0.05, "card-settle"], [T.seventeens - 0.05, "card-settle"], [T.rub2 - 0.05, "card-settle"],
    [T.same - 0.45, "pop-soft"], [T.same - 0.3, "pop-soft"], [T.two, "lens-settle"],
    [T.holding + 0.1, "draw"], [T.trying, "pen-write"], [T.setups - 0.1, "paper-thud"], [T.other, "air-glide"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 96, root: 52, mode: "minor", style: "investigate", cut: T.two - 0.3, ret: T.so - 0.12 };
  return { shots, heads, sfx, music };

  function OrderForm({ t, T, w = 780, phase = "first", final = false }) {
    const s = w / 780;
    const write18 = final || phase === "second" ? 1 : seg(t, T.doubling + 0.1, T.bronze + 0.4);
    const strike = final ? 1 : phase === "second" ? ez(t, T.holding, 0.5, EASE.io) : 0;
    const trial = final ? 1 : phase === "second" ? seg(t, T.trying, T.sev2 + 0.4) : 0;
    const note = final ? 1 : phase === "second" ? spr(t - (T.asking + 0.1), 200, 14) : 0;
    const hand = (sz, c = INKB) => ({ fontFamily: "Inter", fontStyle: "italic", fontWeight: 500, fontSize: sz, color: c, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
    const Row = ({ y, label, qty, qp = 1, struck = 0, nl = false }) => <div style={{ position: "absolute", left: 40, top: y, width: 700, height: 96, borderBottom: "2px solid #E3E3E8", display: "flex", alignItems: "center" }}>
      <span style={inter(46, INK, 550)}>{label}</span>
      <div style={{ marginLeft: "auto", width: 170, height: 76, border: "3px solid #C7C7CC", borderRadius: 14, position: "relative", display: "grid", placeItems: "center" }}>
        <span style={{ ...hand(54), clipPath: `inset(0 ${100 - 100 * qp}% 0 0)` }}>{qty}</span>
        {struck > 0 && <svg width={170} height={76} style={{ position: "absolute", inset: 0 }}><path d={`M 12 50 L ${12 + 146 * struck} ${30}`} stroke={RED} strokeWidth={7} strokeLinecap="round" /></svg>}
      </div></div>;
    return <div style={{ width: 780, height: 900, transformOrigin: "0 0", transform: `scale(${s})`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, ...CARD, borderRadius: 30, background: "#FFFEFB" }} />
      <div style={{ position: "absolute", left: 40, top: 36, ...inter(54, INK, 700) }}>Laurel Wheel Co.</div>
      <div style={{ position: "absolute", left: 40, top: 104, ...inter(42, GREY, 500) }}>Spring order</div>
      <div style={{ position: "absolute", left: 40, top: 180, ...hand(50) }}>Sold this year: 38</div>
      <Row y={270} label="Bronze 18" qty="40" qp={write18} struck={strike} />
      <Row y={366} label="Black 18" qty="12" />
      {trial > 0 && <Row y={462} label="Bronze 17 · trial" qty="8" qp={clamp(trial * 1.5)} />}
      <div style={{ position: "absolute", left: 40, top: 800, width: 380, borderBottom: "3px solid #1D1D1F" }}><span style={inter(40, GREY, 500)}>Signed</span></div>
      {note > 0.01 && <div style={{ position: "absolute", left: 360, top: 600, width: 380, height: 170, background: "#FFE27A", boxShadow: "0 14px 24px -12px rgba(0,0,0,.35)", transform: `rotate(${4 - 2 * clamp(note)}deg) scale(${0.8 + 0.2 * clamp(note)})`, opacity: clamp(note * 2), padding: 22, boxSizing: "border-box" }}>
        <div style={hand(42, "#3A3A3C")}>Call Camaro +</div><div style={hand(42, "#3A3A3C")}>Mustang: setups?</div></div>}
    </div>;
  }
}
