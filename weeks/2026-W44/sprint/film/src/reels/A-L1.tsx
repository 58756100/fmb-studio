// @ts-nocheck
// A-L1 (lane A+, collectors): "Prove the work." The 240Z photo can't show the brake work; a blank paper record fills
// field by field, becomes a log on the build page, and returns under the car as its record.
// Hero: 240Z (B02 showroom photo) + brake kit (C03), install photo G03.
// Transitions: portal (front wheel -> caliper photo), match cut (rotor -> kit cutout), word carry x5 (headline keyword
// -> record field label), shared-element pull-back (record -> build-page log), morph back to the opening layout, CTA landing.
// remocn (ported, frame-driven): blur-out-up (headline exits), fade-through (field values), typewriter caret (date, URL),
// ink-underline -> leader line via evolvePath, period-drop (CTA). New vs the previous reel (A+ L1): blur-out-up, period-drop.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Photo, DrawPath, PeriodDrop, rgba, src } from "../kit";
import { textStyle, Frame, Paper, Requester, BuildPage, mono, ui } from "./laneA";

export const HOOK_WORDS = 3;
export const TAIL = 1.0;
export const LIFE = 1.4; // camera drift strength (hook C holds longer on the opening dossier)
const pal = { bg: "#171A18", tx: "#F2EBDD", em: "#E6A16A", panel: "#262C28", paper: "#F2EBDD", ink: "#171A18", ink2: "#3F4A42" };
export const BG = pal.bg;
export const TEXT = { ...textStyle(pal), size: 106 };
export const IMAGES = ["B02", "G03", "C03"];

const HOOKS = { A: [["Prove the work.", 0]], B: [["Prove this / upgrade?", 0]], C: [["Nice car.", 0], ["Where's the proof?", 1]] };

export function build(tl, hook) {
  const at = tl.at;
  const tryAt = (w, n = 1) => { try { return at(w, n); } catch (e) { return null; } };
  const T = {
    q: at("that's"), ins: at("insurer"), app: at("appraiser"), fin: at("finished"), cant: at("can't"), under: at("underneath"),
    start: at("start"), kit: at("brake"), name: at("name"), part: at("part"), show: at("show", 2), brand: at("brand"), date: at("date"), install: at("install"),
    attach: at("attach"), photo: at("photo", 2), credit: at("credit"), garage: at("garage"), we: at("we"), fuel: at("fuel"), build: at("build", 2), page: at("page"),
    one: at("one"), link: at("link"), now: at("now"), record: at("record", 2), what: tryAt("what's", 2), follow: tl.cta("got") ?? at("follow"), end: tl.last,
  };
  const PORTAL = T.under - 0.05, MATCH = T.start - 0.1;
  // ---------- headlines (≤4 words, fast pace)
  const hk = HOOKS[hook].map(([txt, n]) => ({ words: wordsFor(tl.hook, txt, tl.hook[0].s + (n ? 0.9 : 0)) }));
  const fieldHead = (txt, from, carryWord, row) => {
    const words = wordsFor(tl.body, txt, from);
    const i = words.findIndex((w) => w.w.toUpperCase().startsWith(carryWord));
    const ca = words[i].t + 0.3;
    return { words, key: [i], carry: { i, at: ca, dur: 0.5, to: { x: ROWX + carryW[row] / 2, y: rowY(row) + 30, size: 40 }, fade: ca + 0.33, color: pal.em } };
  };
  const heads = [
    ...hk.map((h, i) => (i === hk.length - 1 ? { ...h, exit: { at: T.fin - 0.35, mode: "up" } } : h)),
    { words: wordsFor(tl.body, "Finished-car photo", T.fin), out: "up" },
    { words: wordsFor(tl.body, "What's underneath?", T.cant + 0.4), key: [1], exit: { at: PORTAL - 0.25, mode: "push", to: { x: 300, y: 820 } } },
    { words: wordsFor(tl.body, "The brake kit.", T.kit - 0.2), key: [1, 2], exit: { at: T.name - 0.32, mode: "up" } },
    fieldHead("Name the part.", T.name, "PART", 0),
    fieldHead("Show the brand.", T.show, "BRAND", 1),
    fieldHead("Date the install.", T.date, "DATE", 2),
    fieldHead("Attach the photo.", T.attach, "PHOTO", 3),
    fieldHead("Credit the garage.", T.credit, "GARAGE", 4),
    { words: wordsFor(tl.body, "On a build page", T.we + 0.5), key: [2, 3] },
    { words: wordsFor(tl.body, "One public link.", T.one), key: [2] },
    { words: wordsFor(tl.body, "Work, recorded.", T.now), key: [1], keyAt: T.record },
    ...(T.what && T.what < T.follow ? [{ words: wordsFor(tl.body, "Hardest to prove?", T.what), key: [2] }] : []),
    { ...ctaHead(tl, "Send them this", T.follow), key: [2] },
  ];
  // fix the "The work, recorded." timing: its words are not spoken verbatim, spread them over the line
  const rec = heads[heads.length - 3];
  rec.words = rec.words.map((w, i) => ({ ...w, t: [T.now + 0.45, T.record][i] }));
  // the CTA words don't match the spoken words one to one either


  // ---------- record rows (filled by the carried words)
  const ROWS = (full) => [
    { label: "PART", value: "Brake kit", at: full ? -9 : T.part + 0.55, labelAt: full ? null : T.part + 0.86 },
    { label: "BRAND", value: "Halden", at: full ? -9 : T.brand + 0.5, labelAt: full ? null : T.brand + 0.86 },
    { label: "DATE", value: "OCT 12, 2026", mono: 1, typed: !full, at: full ? -9 : T.install + 0.35, labelAt: full ? null : T.date + 0.95 },
    { label: "PHOTO", thumb: "G03", at: full ? -9 : T.photo + 0.5, labelAt: full ? null : T.photo + 0.86 },
    { label: "GARAGE", value: "Eastside Classic Works", at: full ? -9 : T.garage + 0.5, labelAt: full ? null : T.garage + 0.86 },
  ];

  // ---------- shot 1: the opening dossier (car photo + blank record), push to the front wheel
  const s1 = (t) => {
    const cam = track(t, { k: 1, x: 96, y: 400, w: 888, h: 560, card: 0 }, [
      [T.fin - 0.15, { x: 40, y: 430, w: 1000, h: 667, card: 1 }, 0.6],
      [T.cant, { k: 1.32 }, PORTAL - T.cant + 0.2, EASE.io],
    ]);
    const d = drift(t, "s1", 4, 0.25);
    const cardY = 1010 + EASE.in(cam.card) * 900;
    const cardW = 520; // narrow card during the hook so the requesters can point at the empty rows
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.06 * EASE.io(seg(t, T.q, T.fin))}) ${dT(d, 0.5)}`, transformOrigin: "50% 60%" }}>
        <Frame pal={pal} t={t} id="B02" x={cam.x} y={cam.y} w={cam.w} h={cam.h} k={cam.k} fx={0.22} fy={0.6} kb={0.015} />
        <Paper pal={pal} t={t} x={96} y={cardY} w={cardW} rows={ROWS(false).map((r) => ({ ...r, at: null }))} rowH={84} pad={34} drawAt={0.05} o={1 - cam.card * 0.3} seed="p0" />
        <Requester pal={pal} t={t} t0={T.ins - 0.1} x={630} y={1068} text="INSURER" out={T.fin - 0.3} />
        <Requester pal={pal} t={t} t0={T.app - 0.1} x={630} y={1236} text="APPRAISER" out={T.fin - 0.25} />
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2: what's underneath (install photo opened out of the wheel)
  const s2 = (t) => <AbsoluteFill style={{ background: "#000" }}>
    <Photo id="G03" x={0} y={0} w={W} h={H} r={0} t={t} t0={PORTAL} t1={MATCH + 0.4} k0={1.0} k1={1.08} fx={0.38} fy={0.5} shadow={false} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(23,26,24,.82), rgba(23,26,24,0) 30%, rgba(23,26,24,0) 75%, rgba(23,26,24,.5))" }} />
  </AbsoluteFill>;

  // ---------- shot 3: kit + record -> build page -> back under the car (one continuous camera)
  const s3 = (t) => {
    // kit: matched to the rotor in the photo (big, left), then settles top centre; leaves as the page assembles
    const kit = track(t, { cx: 400, cy: 960, w: 1500, o: 1 }, [
      [MATCH + 0.02, { cx: 540, cy: 600, w: 470 }, 0.75],
      [T.we, { cx: 880, cy: 790, w: 170 }, 0.7],
      [T.now - 0.1, { o: 0 }, 0.3],
    ]);
    const card = track(t, { s: 1, x: 96, y: 840, o: 0 }, [
      [MATCH + 0.35, { o: 1 }, 0.3, EASE.out],
      [T.we, { y: 900 }, 0.7],
    ]);
    const page = track(t, { o: 0, s: 1.06 }, [[T.we + 0.15, { o: 1, s: 1 }, 0.55, EASE.out], [T.now - 0.15, { o: 0, s: 1.02 }, 0.35, EASE.in]]);
    const fin = ez(t, T.now - 0.15, 0.6, EASE.camera); // morph to the opening layout, now complete
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    const d = drift(t, "s3", 4, 0.22);
    const cardFull = t >= T.now - 0.15;
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.025 * seg(t, MATCH, T.we) - 0.04 * cta}) ${dT(d, 0.5)}`, transformOrigin: "50% 55%" }}>
        <BuildPage pal={pal} t={t} o={page.o} s={page.s} photo="B02" title="1972 240Z" sub="Brake upgrade · log" url="fuelmybuild.com/ellis/240z" urlAt={T.one} urlBig={ez(t, T.link, 0.4)} brandAt={T.fuel} photoH={230} y={390} x={70} w={940} h={1190} />
        {fin > 0 && <Frame pal={pal} t={t} id="B02" x={96} x={lerp(70, 96, fin)} y={lerp(486, 400, fin)} w={lerp(940, 888, fin)} h={lerp(230, 560, fin)} r={lerp(0, 18, fin)} o={clamp(fin * 3)} fx={0.5} fy={0.6} kb={0.015} />}
        {!cardFull && <Paper pal={pal} t={t} x={card.x} y={card.y} w={888} s={card.s} origin="0 0" o={card.o} rows={ROWS(false)} rowH={112} pad={40} drawAt={MATCH + 0.4} seed="p1" />}
        {cardFull && <Paper pal={pal} t={t} x={96} y={lerp(900, 1010, fin)} w={888} origin="0 0" rows={ROWS(true)} rowH={lerp(112, 84, fin)} pad={lerp(40, 34, fin)} seed="p2" title={null} />}
        {kit.o > 0.01 && <Cut id="C03" cx={kit.cx} cy={kit.cy} w={kit.w} o={kit.o} rot={drift(t, "kit", 1, 0.3).r * 3} shadow={0.5} z={6} />}
        <DrawPath d="M 300 760 C 300 900, 160 940, 150 1046" p={ez(t, T.record - 0.1, 0.5)} color={pal.em} width={6} z={30} />
      </div>
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: s1 },
    { at: PORTAL, render: s2, enter: { kind: "portal", d: 0.62, rect: { x: 300 - 120, y: 830 - 120, w: 240, h: 240 }, r: 120 } },
    { at: MATCH, render: s3, enter: { kind: "match" } },
  ];
  heads[heads.length - 1].dot = tl.last + 0.1;
  // sound: one cue per on-screen action (same times as the scene code); transitions and headline landings are added by audio/score.py
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "outline-draw"], [T.ins - 0.1, "label-in"], [T.app - 0.1, "label-in"],
    [T.fin - 0.15, "air-drop", 0.8], [T.cant, "air-slow-push"],
    [MATCH + 0.35, "card-rise"], [MATCH + 0.4, "outline-draw"], [MATCH + 0.77, "card-settle"],
    [T.part + 0.55, "pen-write"], [T.brand + 0.5, "pen-write"], [T.install + 0.35, "typing:0.5"], [T.photo + 0.5, "shutter"], [T.garage + 0.5, "pen-write"],
    [T.we, "air-glide"], [T.we + 0.15, "card-rise"], [T.fuel, "pop-soft"], [T.one, "typing:0.93"], [T.link, "emph-pop"],
    [T.now - 0.15, "air-pull"], [T.now + 0.45, "card-settle"], [T.record - 0.1, "pencil-line"], [ctaT, "cta-pop"],
  ];
  // music: dead silence before the build-page reveal, back in on its downbeat
  const music = { bpm: 96, root: 50, mode: "minor", style: "observe", cut: T.we - 0.55, ret: T.we + 0.15 };
  return { shots, heads, sfx, music };
}
// record row geometry (shot 3, full-size card at x 96, y 840, pad 40, rowH 112, title none)
const ROWX = 96 + 40 + 12;
const rowY = (i) => 840 + 40 + i * 112;
const carryW = [96, 120, 96, 120, 144];
const CTA_DOT = { x: 760, y: 448 };
