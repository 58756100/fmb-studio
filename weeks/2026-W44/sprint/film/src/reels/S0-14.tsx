// @ts-nocheck
// S0-14 (lane 0, parts suppliers): "Nine Boxes". Omar (E07) runs Sorrel Works, a small brand; his suede steering wheel
// launches in a month. No teaser, no ad: he seals nine boxes for nine builders with one ask, log the install. Box
// seven goes in a Bronco, which he's honestly not sure about. Launch morning, nine build pages already show the wheel,
// dated, with photos, and the Bronco is the one everybody asks about.
// Device: a 3x3 grid of kraft boxes is the whole story board. Packing, a tracking shot along the row as the ask card
// drops into each box, box seven riding off on a Bronco's hood, a light sweep for the month, then the lids pop open in
// order and each box opens into its finished car with a dated sticker. Box seven stays shut until last.
// Look: warm warehouse (F04, soft), kraft #C89B62, marker black, white stickers, one red accent. Inter.
// Transitions: pull (the packed box shrinks into slot 9), rise (grid -> row), tracking camera, match cut (box 7 keeps
// its rect while the world changes to the trail), object wipe (a light band = one month), tap-to-open (box 7 -> the
// Bronco's build card), pull-back into slot 7 (CTA over the open grid), lids close one by one into frame 0.
// remocn (ported): flap-fold (3D lids), staggered spring-settle (grid thuds), typewriter (URL), period-drop.
// New vs S0-09: 3D flap lids, tracking camera along a row.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed } from "../kit";
import { Full, Scrim, glass, font } from "./s0kit";
import { Avatar } from "./laneB";

export const HOOK_WORDS = 7;
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#EDE6DC";
export const TEXT = { font: "Inter", weight: 700, size: 116, min: 80, ls: "-0.04em", opsz: 32, color: "#1D1D1F", accent: RED, line2: null, align: "center", maxW: 930, top: 280, lead: 1.04 };
export const IMAGES = ["F04", "E07", "C10", "A16", "A19", "A10", "A13", "A28", "A31", "A34", "A25", "A07", "A35", "F12", "E03", "E10", "E02"];
const KRAFT = "#C99D66", KRAFT2 = "#B4874F", KRAFT3 = "#E0BC88", MARK = "#1C1A17";
const CARS = [["A16", "Mustang"], ["A19", "Camaro"], ["A10", "E30"], ["A13", "R34"], ["A28", "WRX"], ["A31", "S2000"], ["A34", "Bronco"], ["A25", "911"], ["A07", "Miata"]];
const DATES = ["Oct 9", "Oct 11", "Oct 8", "Oct 12", "Oct 10", "Oct 13", "Oct 14", "Oct 9", "Oct 12"];

// a kraft box, front view with the top face seen from slightly above. (x, y) = top-left of the top face, w = width.
// open 0..1 lifts the two flaps (3D), tape 0..1 draws the seal, car rises out when open, sticker = dated page sticker.
const Box = ({ t, x, y, w, n, label = 1, open = 0, tape = 1, car = null, rise = 0, sticker = 0, date = "", glow = 0, s = 1, z = 1, paper = true }) => {
  const top = w * 0.26, fh = w * 0.7, u = w / 270;
  const flap = (side) => <div style={{ position: "absolute", top: 0, [side]: 0, width: w / 2, height: top, background: `linear-gradient(180deg, ${KRAFT3}, ${KRAFT})`, transformOrigin: `${side} 50%`,
    transform: `perspective(${600 * u}px) rotateY(${(side === "left" ? -1 : 1) * 118 * open}deg)`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)", zIndex: 3 }} />;
  const cw = w * 0.92, ch = car ? cw / (car === "A34" ? 1589 / 953 : 2.05) : 0;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: top + fh, transform: `scale(${s})`, transformOrigin: "50% 100%", zIndex: z }}>
    <div style={{ position: "absolute", left: -w * 0.04, right: -w * 0.04, bottom: -14 * u, height: 30 * u, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.35), rgba(0,0,0,0))", filter: "blur(4px)" }} />
    {/* interior (seen when open) */}
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: top, background: "#5A4128", opacity: open > 0.02 ? 1 : 0 }}>
      {paper && open > 0.02 && <div style={{ position: "absolute", inset: `${top * 0.15}px ${w * 0.06}px`, borderRadius: 12 * u, background: "radial-gradient(30% 60% at 30% 50%, #EADCC4, #CDB894 70%), #D8C6A6", opacity: 0.9 }} />}
    </div>
    {/* the car rising out of the box (clipped at the front edge of the top face) */}
    {car && rise > 0.001 && <div style={{ position: "absolute", left: (w - cw) / 2, top: top - ch - 8 * u, width: cw, height: ch + 8 * u, overflow: "hidden", zIndex: 2, clipPath: `inset(-${ch * 2}px 0 0 0)` }}>
      <div style={{ position: "absolute", left: 0, top: (1 - rise) * (ch + 10 * u) + 4 * u, width: cw, height: ch }}><Cut id={car} cx={cw / 2} cy={ch / 2} w={cw} shadow={0} /></div>
    </div>}
    {flap("left")}{flap("right")}
    {/* closed top face + tape */}
    {open < 0.02 && <div style={{ position: "absolute", left: 0, top: 0, width: w, height: top, background: `linear-gradient(180deg, ${KRAFT3}, ${KRAFT})`, zIndex: 4 }}>
      <div style={{ position: "absolute", left: w / 2 - 1, top: 0, width: 2, height: top, background: "rgba(80,50,20,.35)" }} />
      <div style={{ position: "absolute", left: w / 2 - 16 * u, top: 0, width: 32 * u, height: top * tape, background: "rgba(214,190,150,.85)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)" }} />
    </div>}
    {/* front face */}
    <div style={{ position: "absolute", left: 0, top, width: w, height: fh, background: `linear-gradient(180deg, ${KRAFT2}, ${KRAFT} 30%, ${KRAFT2})`, zIndex: 5, overflow: "hidden", boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)" }}>
      {glow > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.35 * glow})` }} />}
      <div style={{ position: "absolute", left: 14 * u, top: 4 * u, ...font("Barlow Condensed", 92 * u, MARK, 700), opacity: 0.9 }}>{n}</div>
      <div style={{ position: "absolute", right: 16 * u, top: 26 * u, ...font("Barlow Condensed", 46 * u, MARK, 700), opacity: label * 0.85, clipPath: `inset(0 ${(1 - label) * 100}% 0 0)` }}>{CARS[n - 1][1]}</div>
      {sticker > 0.01 && <div style={{ position: "absolute", left: 12 * u, right: 12 * u, bottom: 12 * u, height: 66 * u, borderRadius: 14 * u, background: "#fff", display: "flex", alignItems: "center", gap: 10 * u, padding: `0 ${10 * u}px`,
        boxShadow: "0 6px 12px rgba(0,0,0,.25)", transform: `translateY(${(1 - sticker) * 90 * u}px) rotate(${(1 - sticker) * 6}deg)`, opacity: clamp(sticker * 2) }}>
        <div style={{ width: 46 * u, height: 46 * u, borderRadius: 10 * u, background: "#F2F2F5", position: "relative", flex: "none" }}><Cut id="C10" cx={23 * u} cy={23 * u} w={42 * u} shadow={0} /></div>
        <span style={font("Inter", 40 * u, INK, 600)}>{date}</span>
        <div style={{ marginLeft: "auto", width: 14 * u, height: 14 * u, borderRadius: 7 * u, background: RED, flex: "none" }} />
      </div>}
    </div>
  </div>;
};
// the grid: 3x3, box width 270
const GX = [100, 405, 710], GY = [640, 990, 1340], BW = 270;
const slot = (i) => ({ x: GX[i % 3], y: GY[Math.floor(i / 3)] });

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    omar: at("omar's"), wheel: at("steering"), month: at("month,"), sealing: at("sealing"), nine1: at("nine", 1), builders: at("builders."), no: at("no"), just: at("just"), log: at("log"),
    box: at("box"), bronco: at("bronco,"), honestly: at("honestly,"), launch: at("launch"), nine3: at("nine", 3), already: at("already"), dated: at("dated,"), photos: at("photos."),
    and: at("and", 2), bronco2: at("bronco", 2), every: at("everybody's"), start: tl.cta("start") ?? at("start"), fuel: at("fuel"), link: at("link's"),
  };
  const CUT = tl.cut, GRID = T.nine1 - 0.25, ROW = T.no - 0.15, TRAIL = T.box - 0.1, SWEEP = T.launch - 0.15, TAP = T.bronco2 - 0.35, BACK = T.start - 0.4;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = hook === "A" ? [{ words: wordsFor(hw, "Don't launch your part.", 0), key: [3], hold: 0.4 }, { words: wordsFor(hw, "Launch nine installs.", hw[4].s), key: [2] }]
    : hook === "B" ? [fx({ words: wordsFor(hw, "Nine boxes. Nine builders.", 0), hold: 0.4 }, [hw[0].s, hw[1].s, hw[2].s, hw[3].s]), { words: wordsFor(hw, "Not one announcement.", hw[5].s), key: [2] }]
    : [fx({ words: [{ w: "What's", t: 0, line: 0 }, { w: "in", t: 0, line: 0 }, { w: "box", t: 0, line: 0 }, { w: "7?", t: 0, line: 0 }], key: [3] }, [hw[1].s, hw[3].s, hw[4].s, hw[5].s])];
  const heads = [
    ...hk,
    B("Omar's wheel launches.", T.omar, { words: [{ w: "Omar's", t: T.omar, line: 0 }, { w: "wheel", t: at("wheel"), line: 0 }, { w: "launches.", t: at("launches"), line: 0 }], hold: 0.9 }),
    fx({ words: [{ w: "9", t: 0, line: 0 }, { w: "boxes.", t: 0, line: 0 }, { w: "9", t: 0, line: 0 }, { w: "builders.", t: 0, line: 0 }], key: [3] }, [T.nine1, at("boxes"), at("nine", 2), T.builders]),
    B("No teaser. No ad.", T.no, { hold: 0.5 }),
    B("Just log the install.", T.just, { words: [{ w: "Just", t: T.just, line: 0 }, { w: "log", t: T.log, line: 0 }, { w: "the", t: at("the"), line: 0 }, { w: "install.", t: at("install."), line: 0 }], key: [1] }),
    fx({ words: [{ w: "Box", t: 0, line: 0 }, { w: "7:", t: 0, line: 0 }, { w: "a", t: 0, line: 0 }, { w: "Bronco?", t: 0, line: 0 }], key: [3] }, [T.box, at("seven's"), at("a", 2), T.bronco]),
    B("Honestly? Not sure.", T.honestly, { words: [{ w: "Honestly?", t: T.honestly, line: 0 }, { w: "Not", t: at("not"), line: 0 }, { w: "sure.", t: at("sure") , line: 0 }], hold: 0.5 }),
    B("Launch day.", T.launch, { key: [1], hold: 0.6 }),
    fx({ words: [{ w: "9", t: 0, line: 0 }, { w: "builds", t: 0, line: 0 }, { w: "live.", t: 0, line: 0 }], key: [2] }, [T.nine3, at("build"), T.already]),
    fx({ words: [{ w: "Dated.", t: 0, line: 0 }, { w: "With", t: 0, line: 0 }, { w: "photos.", t: 0, line: 0 }] }, [T.dated, at("with"), T.photos]),
    B("And the Bronco?", T.and, { key: [2], hold: 0.6 }),
    fx({ words: [{ w: "Everyone's", t: 0, line: 0 }, { w: "asking.", t: 0, line: 0 }], key: [1] }, [T.every, at("asking")]),
    { ...ctaHead(tl, "Start your first nine", T.start), key: [3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shot 1: the sealed grid lands on the warehouse floor (hook); hook C starts tight on box 7
  const floor = (t, dim = 0.0) => <>
    <Full id="F04" t={t} k0={1.15} k1={1.22} fy={0.6} blur={14} dim={0.05 + dim} sat={0.7} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(237,230,220,.82) 0%, rgba(237,230,220,.55) 40%, rgba(220,208,190,.75) 100%)" }} />
  </>;
  const gridHook = (t) => {
    const pull = hook === "C" ? EASE.camera(seg(t, 0.2, 2.0)) : 1;
    const s7 = slot(6), k = lerp(3.0, 1, pull), ox = s7.x + BW / 2, oy = s7.y + 120;
    const tapeRun = hook === "B" ? ez(t, hw[5].s - 0.3, 0.8) : 1;
    return <AbsoluteFill>
      {floor(t)}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${k})` }}>
        {CARS.map((c, i) => { const p = slot(i), q = hook === "C" ? 1 : spr(t - (i * 0.16 - 0.05), 240, 16);
          return <Box key={i} t={t} x={p.x} y={p.y - (1 - q) * 260} w={BW} n={i + 1} label={0} tape={i === 0 ? tapeRun : 1} s={1 + 0.04 * (1 - clamp(q))} z={i} />; })}
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2: Omar packs box 9 (open box, the wheel drops in, flaps fold, tape)
  const PK = { x: 90, y: 1170, w: 500 };
  const pack = (t) => {
    const drop = spr(t - (T.wheel - 0.15), 160, 15), close = 1 - ez(t, T.sealing - 0.2, 0.55, EASE.camera), tape = ez(t, T.sealing + 0.3, 0.45);
    const d = drift(t, "om", 4, 0.3);
    const top = PK.w * 0.26;
    return <AbsoluteFill>
      {floor(t)}
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <Cut id="E07" cx={800} cy={1160} w={600} shadow={0} style={{ transform: `rotate(${Math.sin(t * 0.9) * 0.6}deg)` }} />
        {/* wheel drops into the open box; clipped by the box's front edge */}
        <div style={{ position: "absolute", left: PK.x, top: 0, width: PK.w, height: PK.y + top, overflow: "hidden", zIndex: 6, opacity: close > 0.05 ? 1 : 0 }}>
          <div style={{ position: "absolute", left: PK.w / 2 - 190, top: lerp(PK.y - 900, PK.y - 120, clamp(drop)) + (1 - close) * 120, width: 380, height: 380, transform: `rotate(${(1 - clamp(drop)) * 40}deg) rotateX(${50 * clamp(drop)}deg)` }}>
            <Cut id="C10" cx={190} cy={190} w={360} shadow={0} />
          </div>
        </div>
        <Box t={t} x={PK.x} y={PK.y} w={PK.w} n={9} label={0} open={close} tape={tape} z={5} paper />
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: the grid again; marker names written under each number
  const gridLabel = (t) => <AbsoluteFill>
    {floor(t)}
    {CARS.map((c, i) => { const p = slot(i); return <Box key={i} t={t} x={p.x} y={p.y} w={BW} n={i + 1} label={ez(t, T.builders - 0.3 + i * 0.07, 0.3)} z={i} />; })}
  </AbsoluteFill>;
  // ---------- shot 4: tracking along the row; the ask card drops into each box; ends centred on box 7
  const RW = 340, RS = 400, RY = 980;
  const row = (t) => {
    const p = EASE.io(seg(t, ROW + 0.1, TRAIL - 0.25));
    const camX = lerp(0, 6 * RS, p); // box 1 centred -> box 7 centred
    return <AbsoluteFill>
      {floor(t)}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-camX}px)` }}>
        {CARS.map((c, i) => { const bx = 540 - RW / 2 + i * RS, cardT = ROW + 0.2 + (i / 6) * (TRAIL - ROW - 0.75);
          const f = seg(t, cardT, cardT + 0.45);
          return <React.Fragment key={i}>
            {i <= 6 && f > 0 && f < 1 && <div style={{ position: "absolute", left: bx + RW / 2 - 130, top: lerp(RY - 420, RY + 10, EASE.in(f)), width: 260, height: 150, borderRadius: 14, background: "#fff", zIndex: 3,
              boxShadow: "0 10px 20px rgba(0,0,0,.18)", transform: `rotate(${(1 - f) * -8 + i * 2}deg)`, display: "grid", placeItems: "center", textAlign: "center", ...font("Inter", 40, INK, 600, { whiteSpace: "normal", lineHeight: 1.05, fontStyle: "italic" }) }}>Log the install</div>}
            <Box t={t} x={bx} y={RY} w={RW} n={i + 1} label={1} open={i <= 6 ? 0.35 * (1 - seg(t, cardT + 0.45, cardT + 0.7)) * (t > cardT - 0.3 ? 1 : 0) : 0} z={4} />
          </React.Fragment>; })}
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 400, display: "flex", alignItems: "center", gap: 18, ...glass(0.7), borderRadius: 60, padding: "10px 30px 10px 10px", opacity: ez(t, ROW + 0.3, 0.3) * (1 - ez(t, TRAIL - 0.5, 0.3)) }}>
        <Avatar id="E07" size={76} face={{ x: 0.42, y: 0.2, z: 2.6 }} bg="#DCE3EE" /><span style={font("Inter", 42, INK, 600)}>Omar · Sorrel Works</span>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 5: the trail; box 7 rides on the Bronco's hood
  const trail = (t) => {
    const w = ez(t, TRAIL + 0.15, 0.6, EASE.camera); // world changes around the box
    const car = ez(t, T.bronco - 0.5, 1.0, EASE.out);
    const bx = lerp(540 - RW / 2, 540 - 100, car), by = lerp(RY, 1010, car), bw = lerp(RW, 200, car);
    const d = drift(t, "tr", 5, 0.35);
    return <AbsoluteFill>
      {floor(t)}
      <div style={{ position: "absolute", inset: 0, opacity: w }}><Full id="F12" t={t} t0={TRAIL} t1={SWEEP + 1} k0={1.1} k1={1.18} fy={0.7} sat={0.75} dim={0.05} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(240,226,205,.55), rgba(240,226,205,0) 45%, rgba(120,90,60,.25))" }} /></div>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${(1 - car) * 900}px)`, opacity: clamp(car * 3) }}>
          <Cut id="A34" cx={540} cy={1240} w={940} shadow={0.5} />
        </div>
        <Box t={t} x={bx} y={by} w={bw} n={7} label={1} z={8} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 900, width: 110, height: 110, borderRadius: 55, background: "#fff", display: "grid", placeItems: "center", ...font("Inter", 72, RED, 700), zIndex: 10,
        boxShadow: "0 10px 24px rgba(0,0,0,.2)", transform: `scale(${spr(t - (T.honestly + 0.1), 260, 14)}) rotate(${Math.sin(t * 2) * 8}deg)`, opacity: 1 - ez(t, SWEEP - 0.3, 0.2) }}>?</div>
    </AbsoluteFill>;
  };
  // ---------- shot 6: launch morning: lids pop open in order, box 7 stays shut, then opens last
  const opened = (i, t) => { const t0 = i === 6 ? T.and - 0.05 : T.nine3 - 0.1 + [0, 1, 2, 3, 4, 5, 9, 6, 7][i] * 0.3; return spr(t - t0, 200, 15); };
  const grid = (t, closing = false) => {
    const lastClose = tl.last + 0.85;
    return <AbsoluteFill>
      {floor(t)}
      {CARS.map((c, i) => { const p = slot(i);
        let o = opened(i, t);
        if (closing) { const ct = tl.last - 1.0 + i * 0.12; o = 1 - EASE.in(seg(t, ct, ct + 0.22)); }
        const st = closing ? clamp(o * 1.5) : spr(t - (i === 6 ? T.and + 0.4 : T.dated - 0.4 + i * 0.07), 220, 17);
        const pulse = i === 6 && !closing && t < T.and ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
        return <Box key={i} t={t} x={p.x} y={p.y} w={BW} n={i + 1} label={1} open={clamp(o)} car={c[0]} rise={clamp(o)} sticker={st} date={DATES[i]} glow={pulse * seg(t, T.photos, T.photos + 0.3)} z={i} />; })}
    </AbsoluteFill>;
  };
  const sweepT = (t) => grid(t);
  // ---------- shot 7: the Bronco's build card
  const CR = { x: 70, y: 560, w: 940 };
  const bronco = (t) => {
    const d = drift(t, "bc", 3, 0.25);
    const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 18}px)` }; };
    const asks = [["E03", 120, 1500, 0], ["E10", 880, 1450, 0.25], ["E02", 470, 1560, 0.5]];
    return <AbsoluteFill>
      {floor(t, 0.05)}
      <div style={{ position: "absolute", left: CR.x, top: CR.y, width: CR.w, height: 900, borderRadius: 44, background: "#fff", overflow: "hidden", transform: dT(d, 0.5),
        boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 40px 60px -30px rgba(0,0,0,.35)" }}>
        <div style={{ position: "relative", height: 500, overflow: "hidden" }}>
          <Full id="F12" t={t} t0={TAP} t1={BACK + 1} k0={1.05} k1={1.12} fy={0.75} sat={0.8} />
          <div style={{ position: "absolute", left: 0, top: 0, width: CR.w, height: 500 }}><Cut id="A35" cx={470 + (t - TAP) * 14} cy={330} w={760} shadow={0.5} /></div>
          <div style={{ position: "absolute", left: 24, top: 22, padding: "10px 22px", borderRadius: 30, background: "rgba(255,255,255,.82)", ...font("Inter", 40, INK, 600) }}>Fuel<span style={{ color: RED }}>My</span>Build</div>
        </div>
        <div style={{ padding: "26px 40px 0" }}>
          <div style={{ ...font("Inter", 64, INK, 650), ...f(TAP + 0.35) }}>Trail Bronco</div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 22, padding: "16px 22px", borderRadius: 28, background: "#F4F1EC", ...f(TAP + 0.55) }}>
            <div style={{ width: 120, height: 110, position: "relative", flex: "none" }}><Cut id="C10" cx={60} cy={55} w={110} shadow={0.15} /></div>
            <div style={{ flex: 1 }}><div style={font("Inter", 48, INK, 600)}>Steering wheel</div><div style={font("Inter", 40, GREY, 500)}>Sorrel Works</div></div>
            <div style={{ padding: "8px 18px", borderRadius: 20, background: "rgba(244,48,52,.1)", ...font("Inter", 40, RED, 600) }}>Oct 14</div>
          </div>
        </div>
      </div>
      {asks.map(([id, x, y, dl], i) => { const q = spr(t - (T.every - 0.2 + dl), 240, 14); return q > 0.01 && <div key={i} style={{ position: "absolute", left: x - 60, top: y - 60, transform: `scale(${q}) translateY(${Math.sin(t * 2 + i) * 6}px)`, zIndex: 20 }}>
        <div style={{ boxShadow: "0 10px 24px rgba(0,0,0,.2)", borderRadius: 60 }}><Avatar id={id} size={120} face={{ x: 0.5, y: 0.18, z: 2.2 }} bg="#E6E0D6" ring="#fff" /></div>
        <div style={{ position: "absolute", right: -18, top: -14, width: 62, height: 62, borderRadius: 31, background: RED, display: "grid", placeItems: "center", ...font("Inter", 44, "#fff", 700) }}>?</div>
      </div>; })}
    </AbsoluteFill>;
  };
  // ---------- shot 8: back to the open grid; CTA + URL pill; lids close one by one into frame 0
  const ending = (t) => <AbsoluteFill>
    {grid(t, t > tl.last - 1.05)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", opacity: ez(t, T.fuel - 0.2, 0.3), zIndex: 30 }}>
      <div style={{ display: "inline-flex", alignItems: "center", height: 88, padding: "0 34px", borderRadius: 44, background: "#fff", boxShadow: "0 12px 24px -14px rgba(0,0,0,.3)" }}>
        <Typed t={t} t0={T.fuel} t1={T.fuel + 0.9} text="fuelmybuild.com" style={font("Inter", 46, INK, 600)} />
      </div>
    </div>
  </AbsoluteFill>;
  const LIGHT = (t, p) => { const x = lerp(-500, W + 500, EASE.io(p)); return <div style={{ position: "absolute", left: x - 260, top: -200, width: 520, height: H + 400, zIndex: 50, transform: "rotate(14deg)",
    background: "linear-gradient(90deg, rgba(255,250,235,0), rgba(255,250,235,.95) 45%, rgba(255,250,235,.95) 55%, rgba(255,250,235,0))" }} />; };
  const s7 = slot(6);
  const shots = [
    { at: 0, render: gridHook },
    { at: CUT, render: pack, enter: { kind: "rise", d: 0.55 } },
    { at: GRID, render: gridLabel, enter: { kind: "pull", d: 0.55, rect: { x: slot(8).x, y: slot(8).y, w: BW, h: 260 }, r: 10 } },
    { at: ROW, render: row, enter: { kind: "rise", d: 0.5 } },
    { at: TRAIL, render: trail, enter: { kind: "match" } },
    { at: SWEEP, render: sweepT, enter: { kind: "wipe", d: 0.8, dir: 1, edge: (p) => lerp(-500, W + 500, EASE.io(p)), obj: LIGHT } },
    { at: TAP, render: bronco, enter: { kind: "tap", d: 0.5, rect: { x: s7.x, y: s7.y - 60, w: BW, h: 300 }, r: 20 } },
    { at: BACK, render: ending, enter: { kind: "pull", d: 0.6, rect: { x: s7.x, y: s7.y - 100, w: BW, h: 300 }, r: 24 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...(hook === "C" ? [[0.2, "air-slow-push", 0.6]] : Array.from({ length: 9 }, (_, i) => [Math.max(0.02, i * 0.16 + 0.05), "paper-thud", 0.7])),
    ...(hook === "B" ? [[hw[5].s - 0.3, "string-zip"]] : []),
    [T.wheel - 0.15, "air-drop", 0.6], [T.wheel + 0.25, "paper-fall-x2"], [T.sealing - 0.2, "card-fold"], [T.sealing + 0.3, "tape-close"],
    [T.builders - 0.3, "pen-write"], [ROW + 0.3, "pop-soft"], ...[0, 1, 2, 3, 4, 5, 6].map((i) => [ROW + 0.2 + (i / 6) * (TRAIL - ROW - 0.75) + 0.4, "paper-thud", 0.5]),
    [T.bronco - 0.5, "air-glide"], [T.bronco + 0.3, "clunk"], [T.honestly + 0.1, "pop-soft"],
    [SWEEP - 0.4, "shimmer"], ...[0, 1, 2, 3, 4, 5, 7, 8].map((i, k) => [T.nine3 - 0.1 + k * 0.3, "chip-pop", 0.8]), [T.dated - 0.4, "tick-soft-x3"], [T.photos, "shutter"],
    [T.and - 0.05, "paper-unfold"], [T.every - 0.2, "cap-pop-x2"], [T.every + 0.3, "pop-soft"],
    [T.fuel, "typing:0.9"], [ctaT, "cta-pop"], ...Array.from({ length: 9 }, (_, i) => [tl.last - 1.0 + i * 0.12 + 0.2, "paper-thud", 0.45]),
  ];
  // music: warm, fast; drops out for the month that passes (breath before "Launch morning") and returns as the lids pop
  const music = { bpm: 108, root: 50, mode: "major", style: "warm", cut: T.launch - 0.45, ret: T.nine3 - 0.1 };
  return { shots, heads, sfx, music };
}
