// @ts-nocheck
// A-L2 (lane A+, garages): "Same car. Same photo." Two shops, one finished Miata photo each; the record behind
// Shop B's photo (brake kit, dated install photo, parts and brands, garage, contributor) is what makes them judgeable.
// Hero: Miata (A08 cutout in the F10 detailing studio) + brake kit (C03), install photo G03, contributor E05.
// Transitions: tap-to-open (Shop B photo -> its record), focus walk down the record (camera), match cut back to the
// exact opening crop, shared-element assembly into the build page (Shop A whips out), CTA landing.
// remocn (ported): micro-scale-fade (row labels), fade-through (selection outline), typewriter caret (URL),
// period-drop (CTA), focus-blur-resolve (rows coming into focus). New vs A-L1: micro-scale-fade, focus-blur-resolve.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, mbx, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, PeriodDrop, rgba, src } from "../kit";
import { textStyle, BuildPage, mono, ui } from "./laneA";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
const pal = { bg: "#22211E", tx: "#F3EEE4", em: "#E9BB62", panel: "#2E2C28", paper: "#F3EEE4", ink: "#22211E", ink2: "#4A463E" };
export const BG = pal.bg;
export const TEXT = { ...textStyle(pal), size: 104 };
export const IMAGES = ["F10", "A08", "C03", "G03", "E05"];
const HOOKS = { A: [["Same car. Same photo.", 0]], B: [["Which shop would you hire?", 0]], C: [["This photo hides the work.", 0]] };

// the "finished photo": the Miata cutout in the detailing studio, always the same crop
const MiataPhoto = ({ t, x, y, w, h, o = 1, label, sel = 0, s = 1, z, seed = "m" }) => {
  if (o <= 0.002) return null;
  const k = 1.02 + 0.015 * Math.sin(t * 0.5 + (seed === "b" ? 1 : 0));
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z, transform: `scale(${s})`, borderRadius: 20 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden", boxShadow: `0 0 0 2px ${rgba(pal.tx, 0.14)}, 0 40px 60px -30px rgba(0,0,0,.8)` }}>
      <img src={src("F10")} style={{ position: "absolute", left: 0, top: h - w * 2048 / 1152 * 0.9, width: w, height: w * 2048 / 1152, objectFit: "cover", transformOrigin: "50% 90%", transform: `scale(${k})` }} />
      <Cut id="A08" cx={w / 2} cy={h * 0.62} w={w * 0.78 * k} shadow={0.65} />
    </div>
    {label && <div style={{ position: "absolute", left: 22, top: 20, ...mono(42, pal.bg), background: pal.em, padding: "2px 14px", borderRadius: 6 }}>{label}</div>}
    {sel > 0.01 && <div style={{ position: "absolute", inset: -14, borderRadius: 30, border: `6px solid ${pal.em}`, opacity: sel }} />}
  </div>;
};
// one record row: label (mono), value (UI), optional media at right; enters with focus-blur-resolve
const Row = ({ t, at, label, value, media, y, focus = 0, mono: m }) => {
  const p = spr(t - at, 180, 20), bl = (1 - clamp((t - at) / 0.35)) * 14;
  if (t < at - 0.05) return null;
  return <div style={{ position: "absolute", left: 40, right: 40, top: y, height: 136, opacity: clamp(p * 1.6), filter: bl > 0.5 ? `blur(${bl.toFixed(1)}px)` : undefined, transform: `translateY(${(1 - p) * 30}px)` }}>
    <div style={{ position: "absolute", left: -40, top: 0, bottom: 0, width: 12, background: pal.em, opacity: 0.25 + 0.75 * focus }} />
    <div style={{ ...mono(40, pal.ink2), position: "absolute", left: 18, top: 16 }}>{label}</div>
    <div style={{ position: "absolute", left: 18, top: 64, ...(m ? mono(56, pal.ink) : ui(62, pal.ink)) }}>{value}</div>
    {media}
    <div style={{ position: "absolute", left: 18, right: 0, bottom: 0, height: 3, background: rgba(pal.ink, 0.12) }} />
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const tryAt = (w, n = 1) => { try { return at(w, n); } catch (e) { return null; } };
  const T = {
    which: at("which"), hire: at("hire"), you: at("you"), cant: at("can't"), now: at("now"), photo: at("photo"), leaves: at("leaves"),
    brake: at("brake"), dated: at("dated"), parts: at("parts"), garage: at("garage"), contrib: at("contributor"), same: at("same"), more: at("more"),
    we: at("we"), fuel: at("fuel"), page: at("page"), share: at("share"), link: at("link"), what: tryAt("what", 2), follow: tl.cta("send") ?? at("follow"),
  };
  const OPEN = T.now - 0.08, BACK = T.same - 0.08;
  const hk = HOOKS[hook].map(([txt]) => ({ words: wordsFor(tl.hook, txt, 0) }));
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const heads = [
    ...hk,
    ...(hook === "B" ? [] : [B("Which shop would you hire?", T.which, { key: [1] })]),
    B("You can't tell.", at("you", 2), { key: [2], hold: 0.8 }),
    B("What the photo leaves out", T.now + 0.2, { key: [3, 4], exit: { at: OPEN + 0.0, mode: "push", to: { x: 540, y: 1040 } } }),
    B("Brake kit.", T.brake),
    B("Dated install photo.", T.dated, { key: [0] }),
    B("Parts and brands.", T.parts),
    B("The garage that did it.", T.garage - 0.2, { key: [1] }),
    B("The contributor.", T.contrib - 0.2, { key: [1] }),
    B("Same finished car.", T.same),
    B("More to judge.", T.more, { key: [2] }),
    B("Connected on a build page", T.we, { key: [3, 4] }),
    B("Share its public link.", T.share, { key: [3] }),
    ...(T.what && T.what < T.follow ? [B("Easy until you do it?", T.what + 0.5, { key: [0], exit: { at: T.follow - 0.32, mode: "up" } })] : []),
    { ...ctaHead(tl, "Send this to the shop owner", T.follow), key: [4, 5] },
  ];
  // non-verbatim heads: spread over their spoken line
  const fix = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); };
  const hi = (txt) => heads.find((h) => h.words.map((w) => w.w).join(" ").startsWith(txt));
  fix(hi("Connected"), [T.we + 0.2, at("details"), at("build", 1), T.page]);
  fix(hi("What the"), [at("what"), at("the", 1), T.photo, T.leaves, at("out")]);
  if (hi("Easy")) { const u = at("until"); fix(hi("Easy"), [at("easy"), u, tl.after("you", u), tl.after("do", u), tl.after("it", u)]); }

  // the record behind Shop B's photo
  const rows = [
    { at: T.brake - 0.05, label: "PART", value: "Brake kit", media: <div style={{ position: "absolute", right: 0, top: -30, width: 210, height: 200 }}><Cut id="C03" cx={105} cy={100} w={190} shadow={0.25} /></div> },
    { at: T.dated - 0.05, label: "LOG · INSTALL", value: "Sep 4, 2026", mono: 1, media: <div style={{ position: "absolute", right: 0, top: 10, width: 200, height: 130, borderRadius: 10, overflow: "hidden", border: `4px solid ${pal.em}` }}><img src={src("G03")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div> },
    { at: T.parts - 0.05, label: "PARTS · BRAND", value: "Brake kit · Halden" },
    { at: T.garage - 0.05, label: "GARAGE", value: "Ridgeline Garage" },
    { at: T.contrib - 0.05, label: "CONTRIBUTOR", value: "Marco Ruiz", media: <div style={{ position: "absolute", right: 10, top: 6, width: 136, height: 136, borderRadius: 68, overflow: "hidden", background: "#D9D2C4" }}><img src={src("E05")} style={{ position: "absolute", left: -12, top: 4, width: 160 }} /></div> },
  ];
  const focusIdx = (t) => { let k = -1; rows.forEach((r, i) => { if (t >= r.at) k = i; }); return k; };

  // ---------- shot 1: two shops, one photo
  const s1 = (t) => {
    const sel = track(t, { y: 0, o: 0 }, [[T.which, { o: 1 }, 0.2, EASE.out], [T.hire - 0.1, { y: 1 }, 0.35], [T.hire + 0.45, { y: 0.5 }, 0.35], [T.cant, { o: 0 }, 0.3, EASE.in]]);
    const d = drift(t, "s1", 3, 0.25);
    const breathe = 1 + 0.02 * seg(t, 0, OPEN);
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${breathe}) ${dT(d, 0.6)}`, transformOrigin: "50% 55%" }}>
        <MiataPhoto t={t} x={96} y={430} w={888} h={480} label="SHOP A" seed="a" />
        <MiataPhoto t={t} x={96} y={960} w={888} h={480} label="SHOP B" seed="b" />
        {sel.o > 0.01 && <div style={{ position: "absolute", left: 82, top: 416 + sel.y * 530, width: 916, height: 508, borderRadius: 30, border: `6px solid ${pal.em}`, opacity: sel.o }} />}
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2: Shop B's record (the photo becomes the header, rows build below; camera walks down)
  const s2 = (t) => {
    const k = focusIdx(t);
    const camY = 0;
    const d = drift(t, "s2", 3, 0.25);
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${camY}px) ${dT(d, 0.6)}` }}>
        <MiataPhoto t={t} x={96} y={400} w={888} h={340} label="SHOP B" seed="b" />
        <div style={{ position: "absolute", left: 96, top: 770, width: 888, height: 40 + rows.length * 142, background: pal.paper, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px -24px rgba(0,0,0,.65)",
          clipPath: `inset(0 0 ${(1 - ez(t, OPEN + 0.2, 0.5)) * 100}% 0 round 14px)` }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: ((t * 150) % 1300) - 400, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.3), rgba(255,255,255,0))" }} />
          {rows.map((r, i) => t < r.at + 0.1 && <div key={"g" + i} style={{ position: "absolute", left: 58, top: 20 + i * 142 + 30, height: 22, borderRadius: 11, background: rgba(pal.ink, 0.09),
            width: 300 * EASE.out(seg(t, OPEN + 0.35 + i * 0.12, OPEN + 0.85 + i * 0.12)), opacity: 1 - seg(t, r.at - 0.05, r.at + 0.1) }} />)}
          {rows.map((r, i) => t < r.at + 0.1 && <div key={"h" + i} style={{ position: "absolute", left: 58, top: 20 + i * 142 + 74, height: 30, borderRadius: 15, background: rgba(pal.ink, 0.06),
            width: 480 * EASE.out(seg(t, OPEN + 0.45 + i * 0.12, OPEN + 0.95 + i * 0.12)), opacity: 1 - seg(t, r.at - 0.05, r.at + 0.1) }} />)}
          {rows.map((r, i) => <Row key={i} t={t} {...r} y={20 + i * 142} focus={k === i ? 1 : 0} />)}
        </div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: back to the exact opening crop; Shop B's record now sits under its photo; then the build page
  const s3 = (t) => {
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    const d = drift(t, "s3", 3, 0.25);
    const A = track(t, { x: 96, y: 430, h: 480, o: 1 }, [[T.more - 0.1, { y: 400, h: 300, o: 0.35 }, 0.6], [T.we - 0.05, { x: -1100 }, 0.55, EASE.whip]]);
    const Bp = track(t, { x: 96, y: 960, w: 888, h: 480 }, [[T.more - 0.1, { y: 730 }, 0.6], [T.we, { x: 70, y: 486, w: 940, h: 330 }, 0.75]]);
    const R = track(t, { y: 1236, o: 0 }, [[T.more + 0.05, { o: 1 }, 0.45, EASE.out], [T.we, { y: 1050 }, 0.75]]);
    const pg = ez(t, T.we + 0.1, 0.5, EASE.out);
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.04 * cta}) ${dT(d, 0.6)}`, transformOrigin: "50% 50%" }}>
        {pg > 0.01 && <BuildPage pal={pal} t={t} x={70} y={390} w={940} h={960} o={pg} photo="F10" photoH={330} title="1991 Miata" sub="Ridgeline Garage" url="fuelmybuild.com/rg/miata" urlAt={T.share + 0.3} urlBig={ez(t, T.link, 0.4)} brandAt={T.fuel} />}
        {A.x > -1000 && <div style={{ position: "absolute", left: A.x, top: A.y, filter: mbx(Math.abs(A.vx) / 12) }}><MiataPhoto t={t} x={0} y={0} w={888} h={A.h} o={A.o} label="SHOP A" seed="a" /></div>}
        <MiataPhoto t={t} x={Bp.x} y={Bp.y} w={Bp.w} h={Bp.h} label={pg > 0.4 ? null : "SHOP B"} seed="b" z={5} />
        {R.o > 0.01 && <div style={{ position: "absolute", left: 96, top: R.y, width: 888, background: pal.paper, borderRadius: 14, zIndex: 6,
          overflow: "hidden", opacity: R.o, clipPath: `inset(0 0 ${(1 - R.o) * 100}% 0 round 14px)`, boxShadow: "0 30px 60px -24px rgba(0,0,0,.65)", padding: "18px 30px 22px 42px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: pal.em }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 220, left: ((t * 150) % 1300) - 400, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.3), rgba(255,255,255,0))" }} />
          {[["LOG", "Sep 4 · Brake install"], ["GARAGE", "Ridgeline Garage"], ["CONTRIBUTOR", "Marco Ruiz"]].map(([l, v], i) => (
            <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 72 }}><span style={mono(40, pal.ink2)}>{l}</span><span style={ui(52, pal.ink)}>{v}</span></div>))}
        </div>}
      </div>
    </AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: s1 },
    { at: OPEN, render: s2, enter: { kind: "tap", d: 0.55, rect: { x: 96, y: 960, w: 888, h: 480 }, r: 20 } },
    { at: BACK, render: s3, enter: { kind: "match" } },
  ];
  heads[heads.length - 1].dot = tl.last + 0.1;
  // sound: one cue per on-screen action (transitions and headline landings are added by audio/score.py)
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [T.which, "tick-soft"], [T.hire - 0.1, "slide-soft"], [T.hire + 0.45, "slide-soft"], [T.cant, "chip-fade"],
    [OPEN + 0.2, "paper-unfold"], [rows[0].at, "card-settle"], [rows[1].at, "shutter"], [rows[2].at, "value-tick"], [rows[3].at, "stamp"], [rows[4].at, "pop-soft"],
    [T.more - 0.1, "slide-soft"], [T.more + 0.05, "paper-unfold", 0.7], [T.we - 0.05, "whip"], [T.we + 0.1, "card-rise"], [T.fuel, "pop-soft"],
    [T.share + 0.3, "typing:0.82"], [T.link, "emph-pop"], [ctaT, "cta-pop"],
  ];
  // music: tape stop into the open (what the photo leaves out), silence, back in on the first record row
  const music = { bpm: 92, root: 52, mode: "minor", style: "warm", cut: OPEN - 0.55, ret: rows[0].at };
  return { shots, heads, sfx, music };
}
const CTA_DOT = { x: 640, y: 446 };
