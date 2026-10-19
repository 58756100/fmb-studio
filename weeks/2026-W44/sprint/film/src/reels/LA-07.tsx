// @ts-nocheck
// LA-07 (lane A, parts suppliers): "Twelve Products, Zero Context" (ChatGPT concept and look, Claude execution). Alder
// Loop sells twelve products and can photograph every angle of its bracket, but those pictures don't show it fitted;
// once fitted, the trunk liner covers it, the finished-car photo won't help, and an ambassador program isn't in the
// budget. So they start with one willing owner: dated install photos on a build page, Alder Loop named in the parts
// registry, a public link the maker can share with the owner's permission. CTA: comment BUILD.
// Look (ChatGPT's): bright white, electric blue, workbench brown; friendly geometric sans (Nunito); a pristine
// twelve-item catalog grid gives way to tactile customer-build photos (scrapbook).
// Bank: catalog parts C02 C03 C04 C07 C10 C11 C12 C13 C14 C17 C19 (+ the drawn bracket), rear car photo A30 (unbadged),
// trunk floor drawn. Fictional: Alder Loop, owner Rina.
// Transitions: the liner slides over the catalog photo (hook), the grid tile pulls in to the bracket (portal), the
// white backdrop folds up into the trunk liner, the liner lifts and drops, the glamour photo opens like a scrapbook
// cover into the owner's page, the catalog recedes beside the public page, CTA landing on the fitted bracket.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { land } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.4;
export const LIFE = 1.75;
const BLUE = "#2F5BFF", INKD = "#141B2E", BROWN = "#8A6A47", WHITE = "#FFFFFF";
export const BG = WHITE;
export const TEXT = { font: "Nunito", weight: 900, size: 100, min: 66, ls: "0.005em", upper: true, color: INKD, accent: BLUE, line2: null, align: "left", x0: 80, maxW: 920, top: 268, lead: 1.05 };
export const IMAGES = ["C02", "C03", "C04", "C07", "C10", "C11", "C12", "C13", "C14", "C17", "C19", "A30"];
const HOOKS = { A: "Suppliers: beyond / the catalog", B: "Small brand. / Hidden work.", C: "Small / parts maker" };
const NUN = (size, color = INKD, w = 800) => ({ fontFamily: "Nunito", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.12, whiteSpace: "nowrap" });

// the Alder Loop bracket (drawn, blue powder coat), angle 0..2 = three catalog angles
const Bracket = ({ x, y, w = 320, angle = 0, rot = 0 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 320 224" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.35, transform: `rotate(${rot}deg) scaleX(${[1, 0.82, -1][angle] ?? 1})`, overflow: "visible" }}>
    <defs><linearGradient id="blu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5C82FF" /><stop offset=".55" stopColor={BLUE} /><stop offset="1" stopColor="#1A3BB8" /></linearGradient></defs>
    <path d="M 20 40 L 180 40 L 220 120 L 300 120 L 300 170 L 196 170 L 156 90 L 20 90 Z" fill="url(#blu)" stroke="#12278A" strokeWidth={4} strokeLinejoin="round" />
    <path d={angle === 1 ? "M 30 48 L 176 48" : "M 26 50 L 174 50"} stroke="rgba(255,255,255,.45)" strokeWidth={6} />
    {[[60, 65], [120, 65], [262, 145]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11} fill="#0E1B5C" />)}
  </svg>
);
const Liner = ({ x, y, w, h, lift = 0, z = 20 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1400, zIndex: z }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${lift * 75}deg)`, borderRadius: 18, background: "#4A4D52",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) 0 1px, transparent 2px), radial-gradient(circle, rgba(0,0,0,.25) 0 1px, transparent 2px)", backgroundSize: "7px 7px, 11px 11px", boxShadow: "0 20px 40px -16px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: "45%", top: 24, width: "10%", height: 18, borderRadius: 9, background: "#2B2D31" }} /></div>
  </div>
);
const Floor = ({ x, y, w, h }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: "linear-gradient(180deg, #2E3034, #1C1D20)", overflow: "hidden" }}>
  <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 30px, rgba(0,0,0,.12) 30px 60px)" }} /></div>;
const CAT = ["C02", "C03", "C04", "C07", "C10", "BR", "C11", "C12", "C13", "C14", "C17", "C19"];

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    alder: at("alder"), twelve: at("twelve"), they: at("they"), every: at("every"), angle: at("angle"), bracket: at("bracket,"), but: at("but"), fitted: at("fitted."),
    and: at("and"), fits: at("fits"), liner: at("liner"), covers: at("covers"), finished: at("finished-car"), ambassador: at("ambassador"), budget: at("budget."), so: at("so"),
    one: at("one"), willing: at("willing"), dated: at("dated"), page: at("page,"), alder2: at("alder", 2), registry: at("registry."), we: at("we"), link: at("link."),
    permission: at("permission,"), share: at("share"), actual: at("actual"), cta: tl.cta("comment") ?? at("comment"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2] : hook === "B" ? [3] : [2], hold: 0.4 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Beautiful. / But where's it go?", T.every), [T.every, T.but, T.but + 0.15, at("show"), T.fitted]), key: [3], hold: 0.4 },
    { ...fx(B("The part / underneath", T.covers), [T.liner, T.covers, T.covers + 0.3]), key: [2], hold: 1.6 },
    { ...fx(B("One build / with context", T.one), [T.one, T.willing, T.dated, T.dated + 0.3]), key: [3], hold: 1.6 },
    { ...fx(B("Show the / installed part", T.permission), [T.share, T.actual, at("installation.", 2), at("installation.", 2) + 0.2]), key: [2], hold: 0.6 },
    { ...ctaHead(tl, "Comment BUILD", T.cta), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the catalog (hook + grid)
  const catalog = (t) => {
    const d = drift(t, "cat", 3, 0.3);
    const linerIn = ez(t, 0.4, 0.8, EASE.camera) * (1 - ez(t, T.alder - 0.3, 0.4, EASE.in));
    const grid = ez(t, T.alder - 0.2, 0.7, EASE.camera);
    const ang = t < T.angle ? 0 : t < T.bracket ? 1 : 2;
    const zoom = ez(t, T.they - 0.2, 0.7, EASE.camera);
    const fold = ez(t, T.and - 0.3, 0.5, EASE.in);
    const TILE = 290, GX = 75, GY = 560;
    return <AbsoluteFill style={{ background: WHITE }}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)}`, transformOrigin: "50% 60%" }}>
        {/* the twelve-item grid */}
        {CAT.map((id, i) => { const c = i % 3, r = Math.floor(i / 3), q = spr(t - (T.alder - 0.2 + i * 0.05), 220, 18);
          const isB = id === "BR"; const x = GX + c * (TILE + 20), y = GY + r * (TILE * 0.82 + 20);
          const k = isB ? zoom : 0;
          return <div key={i} style={{ position: "absolute", left: lerp(x, 60, k), top: lerp(y, 560, k), width: lerp(TILE, 960, k), height: lerp(TILE * 0.82, 900, k), borderRadius: 20, background: "#F5F7FF", boxShadow: "0 0 0 2px #E3E8FF",
            opacity: (isB ? 1 : clamp(q * 2) * (1 - zoom)) * (grid > 0.02 ? 1 : 0), transform: `scale(${isB ? 1 : 0.9 + 0.1 * clamp(q)}) translateY(${-fold * (isB ? 900 : 0)}px)`, zIndex: isB ? 5 : 1 }}>
            {isB ? <Bracket x={lerp(TILE, 960, k) / 2} y={lerp(TILE * 0.82, 900, k) / 2} w={lerp(220, 640, k)} angle={ang} rot={k > 0 ? 6 * Math.sin(t * 0.8) : 0} />
              : <Cut id={id} cx={TILE / 2} cy={TILE * 0.41} w={TILE * 0.7} shadow={0.2} />}
            {isB && k > 0.5 && t > T.every - 0.05 && t < T.every + 0.15 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.8 }} />}
          </div>; })}
        {/* hook: the catalog photo, and the trunk liner sliding over it */}
        {grid < 0.02 && <div style={{ position: "absolute", left: 160, top: 640, width: 760, height: 620, borderRadius: 24, background: "#F5F7FF", boxShadow: "0 0 0 2px #E3E8FF" }}><Bracket x={380} y={310} w={520} /></div>}
        {linerIn > 0.01 && <Liner x={lerp(1200, 140, linerIn)} y={620} w={800} h={660} />}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the trunk: the liner lifts, drops; the glamour photo; the budget
  const trunk = (t) => {
    const d = drift(t, "tr", 3, 0.3);
    const lift = ez(t, T.fits - 0.1, 0.5, EASE.camera) * (1 - ez(t, T.covers - 0.1, 0.4, EASE.in));
    const glam = spr(t - (T.finished - 0.2), 170, 17);
    const env = spr(t - (T.ambassador - 0.1), 200, 15), shut = ez(t, T.budget - 0.2, 0.3, EASE.in);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF, #EEF1FA)" }}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Floor x={100} y={640} w={880} h={720} />
        <Bracket x={540} y={1000} w={420} rot={-4} />
        <Liner x={100} y={640} w={880} h={720} lift={lift} />
        {glam > 0.01 && <div style={{ position: "absolute", left: 160, top: lerp(1900, 760, clamp(glam)), width: 760, height: 520, borderRadius: 14, background: "radial-gradient(120% 90% at 50% 70%, #3B3F49, #121318)", boxShadow: "0 30px 50px -20px rgba(0,0,0,.6)", transform: `rotate(${-3 + 2 * Math.sin(t * 0.6)}deg)`, zIndex: 30, overflow: "hidden" }}>
          <Cut id="A30" cx={380} cy={300} w={640} shadow={0.4} />
          <div style={{ position: "absolute", top: -100, width: 160, height: 800, left: ((t * 220) % 1300) - 300, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.16), rgba(255,255,255,0))", transform: "rotate(20deg)" }} /></div>}
        {env > 0.01 && <div style={{ position: "absolute", left: 600, top: lerp(1900, 1250, clamp(env)), width: 380, height: 250, zIndex: 35, transform: "rotate(5deg)" }}>
          <div style={{ position: "absolute", inset: 0, background: "#E9DCC3", borderRadius: 10, boxShadow: "0 16px 26px -12px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 380, height: 140, transformOrigin: "50% 0", transform: `rotateX(${lerp(160, 0, shut)}deg)`, background: "#DCCBAA", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          <div style={{ position: "absolute", left: 30, top: 150, ...NUN(42, BROWN, 800) }}>Ambassadors</div></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the owner's page (scrapbook), the public link, permission
  const PAGE = { x: 60, y: 560, w: 960, h: 1000 };
  const page = (t, phase) => {
    const d = drift(t, "pg" + phase, 3, 0.25);
    const link = phase === "end" ? 1 : ez(t, T.we, 0.5);
    const note = phase === "end" ? 1 : spr(t - (T.permission - 0.3), 200, 15);
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF, #EEF1FA)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.5)} scale(${1 - 0.03 * ctaP})`, transformOrigin: "50% 60%" }}>
        <div style={{ position: "absolute", left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h, borderRadius: 26, background: WHITE, boxShadow: "0 0 0 2px #E3E8FF, 0 30px 50px -24px rgba(20,27,46,.35)", overflow: "hidden" }}>
          <div style={{ height: 90, background: BLUE, display: "flex", alignItems: "center", gap: 14, padding: "0 30px" }}>
            <span style={NUN(46, WHITE, 900)}>FuelMyBuild</span><span style={NUN(42, "#C9D6FF", 700)}>· Rina's hatch</span></div>
          {/* scrapbook: two dated install photos with tape corners */}
          {[["Apr 6, 2026", 0], ["Apr 6, 2026", 1]].map(([dt, i]) => <div key={i} style={{ position: "absolute", left: 40 + i * 450, top: 130, width: 420, ...land(t, T.dated + i * 0.25) }}>
            <div style={{ width: 420, height: 300, borderRadius: 10, overflow: "hidden", position: "relative", boxShadow: "0 10px 20px -10px rgba(0,0,0,.4)", transform: `rotate(${i ? 2 : -2}deg)` }}>
              <Floor x={0} y={0} w={420} h={300} /><Bracket x={210} y={150} w={i ? 260 : 300} rot={i ? 8 : -6} />
              {i === 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 120, background: "#4A4D52", transform: "rotate(-4deg) translateY(-30px)" }} />}
              <div style={{ position: "absolute", left: 160, top: -10, width: 100, height: 30, background: "rgba(255,240,170,.8)", transform: "rotate(-4deg)" }} /></div>
            <div style={{ ...NUN(42, BLUE, 800), marginTop: 12 }}>{dt}</div></div>)}
          <div style={{ position: "absolute", left: 40, top: 560, width: 880, height: 140, borderRadius: 22, background: "#F2F5FF", display: "flex", alignItems: "center", gap: 22, padding: "0 24px", boxSizing: "border-box", ...land(t, T.alder2 - 0.1) }}>
            <div style={{ width: 150, height: 100, position: "relative", flex: "none" }}><Bracket x={75} y={50} w={140} /></div>
            <div><div style={NUN(42, "#6A7390", 700)}>Parts registry</div><div style={NUN(50, INKD, 900)}>Trunk bracket · Alder Loop</div></div></div>
          {link > 0.01 && <div style={{ position: "absolute", left: 40, top: 740, padding: "16px 26px", borderRadius: 40, background: "#F2F5FF", boxShadow: `0 0 0 3px ${BLUE}`, opacity: clamp(link * 2) }}>
            <Typed t={t} t0={T.we + 0.2} t1={T.link} text="fuelmybuild.com/rina/hatch" caret={BLUE} style={NUN(44, INKD, 700)} keepCaret={0.3} /></div>}
        </div>
        {note > 0.01 && <div style={{ position: "absolute", left: 560, top: 1440, padding: "18px 26px", background: "#FFF6C9", transform: `rotate(${5 - 2 * clamp(note)}deg) scale(${0.8 + 0.2 * clamp(note)})`, opacity: clamp(note * 2), boxShadow: "0 14px 24px -12px rgba(0,0,0,.45)", zIndex: 30 }}>
          <div style={{ fontFamily: "Caveat", fontSize: 60, fontWeight: 700, color: INKD }}>OK to share!</div><div style={{ fontFamily: "Caveat", fontSize: 50, fontWeight: 600, color: BROWN }}>Rina</div></div>}
        {t > T.cta + 0.8 && <div style={{ position: "absolute", left: 80, top: 470, zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" caret={BLUE} style={NUN(46, INKD, 800)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: catalog },
    { at: T.and - 0.1, render: trunk, enter: { kind: "rise", d: 0.55 } },
    { at: T.so - 0.1, render: (t) => page(t, "first"), enter: { kind: "portal", d: 0.6, rect: { x: 160, y: 760, w: 760, h: 520 }, r: 14 } },
    { at: T.cta - 0.12, render: (t) => page(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "tick-soft"], [0.4, "slide-soft"], [T.alder - 0.3, "slide-soft"], [T.alder - 0.2, "pop-soft"], [T.they - 0.2, "lens-settle"], [T.every - 0.05, "shutter"], [T.angle - 0.05, "shutter"], [T.bracket - 0.05, "shutter"],
    [T.and - 0.3, "card-fold"], [T.fits - 0.1, "fabric-pull"], [T.covers - 0.1, "cloth-land"], [T.finished - 0.2, "photo-settle"], [T.ambassador - 0.1, "slide-soft"], [T.budget - 0.2, "paper-fold"],
    [T.so - 0.4, "page-turn"], [T.dated, "shutter"], [T.dated + 0.25, "shutter"], [T.alder2 - 0.1, "pop-soft"], [T.we + 0.2, "typing:1.0"], [T.permission - 0.3, "paper-thud"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 104, root: 55, mode: "major", style: "warm", cut: T.finished - 0.2, ret: T.so - 0.1 };
  return { shots, heads, sfx, music };
}
