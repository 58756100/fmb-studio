// @ts-nocheck
// S0-04 (lane C, collectors): Ruth's '72 F-100. Its oldest job is twelve years old and she's logging it today, because
// Gil (restoring one too, asks about everything) is coming over and she can't remember half of it. She kept photos and
// a few receipts: the repaint invoice (Jun 14, 2014, Pine Hollow Body) goes on the build page first with that date, the
// 2019 carb rebuild from the photos' own dates, last month's Bolder fuel pump she fitted herself. Not the whole story,
// a start. Gil's early; she sends him the link; he arrives already asking about Pine Hollow. "Since this morning."
// Device: an open socket case on the tailgate, seen from above. The lid's flat inside becomes the truck's build page;
// each socket Ruth seats clicks one entry into it. The lid pocket holds the evidence (prints, the folded invoice).
// Brand safety: the VO names the truck (F-100, Ford), so only bank set A trucks (A22/A23) and B07 are used, no K bank.
// Fictional: Ruth (E02), Gil (E01), Pine Hollow Body, Bolder (fuel pump C19). Carb photo = G12 crop.
// Transitions: rise (case -> truck), whip (truck -> case), invoice unfold to camera, invoice shrinks into the lid entry
// (shape morph), pull back to the whole case, whip to the driveway (F11) where Gil's truck waits, link strip flies down
// the driveway, match back to frame 0's top-down case for the CTA, now filled.
// remocn (ported): micro-scale-fade (markers), focus-blur-resolve (entries), card flip (photo date), typewriter (URL
// strip), period-drop. New vs the previous reels: socket-seat clicks as entry beats, photo flip.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Thumb, Sweep, Ripple } from "./b2kit";

export const HOOK_WORDS = 14;
export const TAIL = 1.3;
export const LIFE = 1.3;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["D05", "A22", "A23", "B07", "C19", "E01", "E02", "F11", "G12", "D02"];
const HOOKS = { A: "Ruth's '72 / F-100", B: "Log it / years later.", C: "Every photo. / No story." };
const PAINT = "#F1EEE6", BLUE = "#2F6DB0";
// the case (top-down): D05 at w 960, centred; lid interior and five empty socket slots in the base
const CASE = { cx: 540, cy: 1110, w: 960 }; const CH = 960 / (1118 / 1040);
const CY0 = CASE.cy - CH / 2; // 664
const LID = { x: 140, y: CY0 + 0.07 * CH, w: 800, h: 0.38 * CH };
const SLOTS = [0, 1, 2, 3, 4].map((i) => ({ x: 300 + i * 120, y: CY0 + 0.79 * CH }));
const PAGE = { x: 90, y: 300, w: 900, h: CY0 + 0.45 * CH - 300 }; // the lid page grows up out of the lid

const Tailgate = ({ t, children }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${PAINT} 0%, #E7E3D8 100%)` }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, background: `linear-gradient(180deg, ${BLUE}, #22528A)`, boxShadow: "0 -8px 0 #C9CDD3, 0 -12px 0 #8E959D" }} />
    <div style={{ position: "absolute", top: -200, width: 520, height: 2400, left: ((t * 60) % 1700) - 500, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", transform: "rotate(18deg)" }} />
    {children}
  </div>
);
const Socket = ({ x, y, p = 1, size = 74 }) => p <= 0 ? null : (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2 - (1 - clamp(p)) * 120, width: size, height: size, borderRadius: "50%", opacity: clamp(p * 3), zIndex: 12,
    background: "radial-gradient(circle at 50% 50%, #2a2c30 0 34%, #c8ccd2 36%, #f4f6f8 52%, #8c939b 72%, #c9cdd2 100%)", boxShadow: "0 6px 10px rgba(0,0,0,.4)", transform: `scale(${1 + 0.12 * Math.max(0, 1 - Math.abs(p - 1) * 6) * (p > 1 ? 0 : 1)})` }} />
);
// an old print (sepia) with a white border
const Print = ({ id, x, y, w = 300, h = 220, rot = 0, o = 1, fx = 0.5, fy = 0.5, flip = 0, back, z = 20 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) perspective(1200px) rotateY(${flip * 180}deg)`, opacity: o, zIndex: z, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", inset: 0, background: "#FBF8F0", padding: 14, boxSizing: "border-box", boxShadow: "0 16px 26px -12px rgba(0,0,0,.45)", backfaceVisibility: "hidden" }}>
      <img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, filter: "sepia(.45) saturate(.8) contrast(.92) brightness(1.04)" }} />
    </div>
    {back && <div style={{ position: "absolute", inset: 0, background: "#F4EFE2", transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "grid", placeItems: "center", boxShadow: "0 16px 26px -12px rgba(0,0,0,.45)" }}>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 46, color: "#C8562B", transform: "rotate(-4deg)" }}>{back}</span></div>}
  </div>
);
const Invoice = ({ t, x, y, w, rot = 0, unfold = 1, o = 1, z = 30 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.1, transformOrigin: "50% 0", transform: `rotate(${rot}deg) perspective(1400px) rotateX(${(1 - unfold) * 70}deg)`, opacity: o, zIndex: z }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 836, transformOrigin: "0 0", transform: `scale(${w / 760})`, background: "linear-gradient(170deg, #FBF6E6, #EFE6CC)", boxShadow: "0 30px 50px -20px rgba(0,0,0,.45)", padding: "44px 48px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 418, height: 2, background: "rgba(0,0,0,.08)" }} />
      <div style={inter(60, "#3B342A", 750)}>PINE HOLLOW BODY</div>
      <div style={{ ...inter(42, "#7A705F", 500), marginTop: 8 }}>Invoice 2281</div>
      <div style={{ marginTop: 60, display: "flex", justifyContent: "space-between" }}><span style={inter(46, "#3B342A", 500)}>Date</span><span style={{ ...inter(50, "#3B342A", 650) }}>Jun 14, 2014</span></div>
      <div style={{ marginTop: 34, display: "flex", justifyContent: "space-between" }}><span style={inter(46, "#3B342A", 500)}>Work</span><span style={inter(50, "#3B342A", 650)}>Cab and bed repaint</span></div>
      <div style={{ marginTop: 34, display: "flex", justifyContent: "space-between" }}><span style={inter(46, "#3B342A", 500)}>Vehicle</span><span style={inter(50, "#3B342A", 650)}>'72 F-100</span></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ marginTop: 40, height: 3, background: "rgba(59,52,42,.15)" }} />)}
      <div style={{ position: "absolute", left: 48, bottom: 48, ...inter(42, "#7A705F", 500, { fontStyle: "italic" }) }}>Paid · thank you</div>
    </div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    gils: at("gil's"), restoring: at("restoring"), asks: at("asks"), everything: at("everything."), and1: at("and", 2), half: at("half"), but: at("but"), photos: at("photos,"),
    few: at("few"), receipts: at("receipts."), heres: at("here's"), repaint: at("repaint"), june: at("june"), pine: at("pine"), so: at("so"), build: at("build"), date: at("date."),
    carb: at("carb"), nineteen: at("nineteen,"), photos2: at("photos", 2), dateOn: at("date", 2), lastm: at("last"), fuel: at("fuel"), bolder: at("bolder."), myself: at("myself."),
    its: tl.after("it's", at("myself.")), start: at("start."), oh: at("oh,"), early: at("early."), send: at("send"), link: at("link."), pine2: at("pine", 2), since: at("since"), morning: at("morning."),
    cta: tl.cta("comment") ?? at("comment"),
  };
  // clicks: page opens, 2014, 2019, 2026, link strip; plus the fifth socket under the CTA
  const CL = [T.so - 0.05, T.build + 0.1, T.dateOn + 0.1, T.bolder, T.send - 0.1];
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: [], hold: 3 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length * 0.5) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Gil asks / everything.", T.restoring), [T.gils, T.asks, T.everything]), key: [2] },
    { ...fx(B("Photos. / A few receipts.", T.photos), [T.photos, T.few - 0.1, T.few, T.receipts]), key: [0], hold: 0.9 },
    { ...fx(B("It's / a start.", T.its), [T.its, at("a", 3) ?? T.start, T.start]), key: [2], hold: 1.2 },
    { ...fx(B("Gil's / early.", T.oh), [at("gil's", 2), T.early]), key: [1], hold: 0.7 },
    { ...ctaHead(tl, "Comment BUILD", T.cta), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the case (top-down on the tailgate)
  const PR = [{ id: "B07", fx: 0.5, fy: 0.6 }, { id: "A23", fx: 0.5, fy: 0.5 }, { id: "G12", fx: 0.45, fy: 0.45 }];
  const caseShot = (t, phase) => {
    const d = drift(t, "case", 3, 0.25);
    const ev = phase === "evidence", pg = phase === "page" || phase === "wide" || phase === "cta";
    const fan = ev ? spr(t - (T.photos - 0.1), 160, 15) : 0;
    const inv = ev ? spr(t - (T.few - 0.05), 170, 16) : 0;
    const big = ev ? ez(t, T.heres - 0.2, 0.7, EASE.camera) : 0;
    const unfold = ev ? ez(t, T.repaint - 0.1, 0.6, EASE.io) : 0;
    const into = ev ? ez(t, T.so - 0.35, 0.5, EASE.in) : 0;
    const wide = phase === "wide" ? ez(t, T.its - 0.2, 0.8, EASE.camera) : phase === "cta" ? 1 : 0;
    const cam = phase === "cta" ? { s: 1 } : { s: lerp(1, 0.9, wide) };
    const seated = (i) => (phase === "hook" || phase === "evidence" ? 0 : phase === "cta" ? (i < 4 ? 1 : spr(t - (T.cta + 0.4), 260, 16)) : (t >= CL[i] - 0.15 ? spr(t - (CL[i] - 0.15), 260, 16) : 0));
    return <AbsoluteFill><Tailgate t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateY(${170 * wide * (phase === "wide" ? 1 : 0)}px) scale(${cam.s})`, transformOrigin: "50% 60%" }}>
        <Cut id="D05" cx={CASE.cx} cy={CASE.cy} w={CASE.w} shadow={0.45} ground={0.5} />
        {SLOTS.map((s, i) => <div key={i} style={{ position: "absolute", left: s.x - 40, top: s.y - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #0c0d0f 0 60%, #2a2c30 62%)", zIndex: 11 }} />)}
        {SLOTS.map((s, i) => <Socket key={i} x={s.x} y={s.y} p={seated(i)} />)}
        {/* the lid pocket: prints peeking out */}
        {!pg && fan < 0.05 && <div style={{ position: "absolute", left: LID.x + 470, top: LID.y + 30, zIndex: 10 }}>
          {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i * 40, top: i * 10, width: 220, height: 150, background: "#FBF8F0", transform: `rotate(${-6 + i * 9 + Math.sin(t * 1.2 + i)}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.35)" }} />)}
        </div>}
        {/* evidence: prints fan out, then the folded invoice */}
        {ev && PR.map((p, i) => <Print key={i} id={p.id} fx={p.fx} fy={p.fy} x={lerp(LID.x + 470, [80, 380, 680][i], clamp(fan))} y={lerp(LID.y + 40, [1380, 1420, 1370][i], clamp(fan)) + 300 * into} w={300} h={220}
          rot={lerp(-6, [-9, 4, 11][i], clamp(fan))} o={clamp(fan * 3) * (1 - 0.6 * big)} z={20 + i} />)}
        {ev && inv > 0.01 && <Invoice t={t} x={lerp(LID.x + 420, 160, big)} y={lerp(LID.y + 60, 330, big) - into * 0} w={lerp(260, 760, big) * (1 - 0.55 * into)} rot={lerp(8, -1, big)} unfold={lerp(0.15, 1, unfold)} o={clamp(inv * 3) * (1 - into)} z={40} />}
        {pg && <LidPage t={t} T={T} CL={CL} />}
        {/* the carb photo: flips to show its date, then drops into the 2019 entry */}
        {phase === "page" && t > T.carb - 0.3 && t < CL[2] + 0.5 && (() => { const inP = spr(t - (T.carb - 0.3), 170, 16), flip = ez(t, T.photos2 - 0.1, 0.6, EASE.io), drop = ez(t, CL[2] - 0.25, 0.45, EASE.in);
          return <Print id="G12" fx={0.5} fy={0.3} back="Aug 3, 2019" x={lerp(1100, 560, clamp(inP)) - drop * 380} y={1180 - drop * 480} w={lerp(380, 150, drop)} h={lerp(280, 120, drop)} rot={lerp(8, -4, clamp(inP))} flip={flip} o={1 - seg(drop, 0.8, 1)} z={40} />; })()}
        {/* the fuel pump rises beside the largest socket */}
        {phase === "page" && t > T.fuel - 0.3 && t < CL[3] + 0.5 && <div style={{ position: "absolute", left: 0, top: 0, zIndex: 40, opacity: 1 - seg(t, CL[3], CL[3] + 0.4), transform: `translate(${-ez(t, CL[3] - 0.2, 0.5, EASE.in) * 360}px, ${(1 - spr(t - (T.fuel - 0.3), 170, 15)) * 400 - ez(t, CL[3] - 0.2, 0.5, EASE.in) * 330}px)` }}>
          <Cut id="C19" cx={760} cy={1300} w={420} rot={-8} shadow={0.35} /></div>}
      </div>
    </Tailgate></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the truck: three jobs she can't place grey out
  const truck = (t) => {
    const d = drift(t, "trk", 3, 0.3);
    const marks = [[0.5, 0.42, T.restoring], [0.86, 0.36, T.asks], [0.68, 0.62, T.everything]];
    const TR = { cx: 610, cy: 1080, w: 980 }, th = TR.w / (1611 / 851);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="A22" cx={TR.cx} cy={TR.cy} w={TR.w} />
        {marks.map(([u, v, t0], i) => { const p = spr(t - t0, 220, 15), grey = seg(t, t0 + 0.4, t0 + 0.8);
          const x = TR.cx - TR.w / 2 + u * TR.w, y = TR.cy - th / 2 + v * th;
          return t >= t0 && <div key={i} style={{ position: "absolute", left: x - 56, top: y - 56, width: 112, height: 112, borderRadius: "50%", transform: `scale(${clamp(p) * (1 + 0.04 * Math.sin(t * 4 + i))})`,
            background: `rgba(${Math.round(lerp(244, 142, grey))},${Math.round(lerp(48, 142, grey))},${Math.round(lerp(52, 147, grey))},.88)`, display: "grid", placeItems: "center", boxShadow: "0 0 0 8px rgba(255,255,255,.8), 0 14px 24px rgba(0,0,0,.25)", zIndex: 20 }}>
            <span style={inter(64, "#fff", 800)}>?</span></div>; })}
        <Cut id="E02" cx={220} cy={1520} w={430} shadow={0} />
        <div style={{ position: "absolute", left: 470, top: 1440, padding: "14px 26px", borderRadius: 36, ...CARD, ...land(t, T.gils + 0.1) }}>
          <div style={inter(44, INK)}>Ruth</div><div style={inter(40, GREY, 500)}>'72 F-100, since 2014</div></div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the driveway: Gil's truck, the link strip, Gil walks up
  const drive = (t) => {
    const d = drift(t, "drv", 3, 0.3);
    const walk = EASE.io(seg(t, T.pine2 - 0.6, T.since));
    const strip = ez(t, T.send - 0.05, 0.3), fly = EASE.in(seg(t, T.link + 0.1, T.link + 0.7));
    const ruth = spr(t - (T.since - 0.4), 170, 17);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(${1.05 + 0.03 * seg(t, T.oh, tl.last)})` }}>
        <img src={src("F11")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 60%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 35%)" }} />
      </div>
      <Cut id="A22" cx={lerp(820, 760, walk)} cy={1180} w={330} shadow={0.35} />
      {/* Gil walks up the driveway */}
      {t > T.pine2 - 0.7 && <Cut id="E01" cx={lerp(760, 690, walk)} cy={lerp(1220, 1390, walk)} w={lerp(170, 560, walk)} shadow={0} o={clamp((t - T.pine2 + 0.7) * 3)} />}
      {/* the phone, share sheet, the link strip flying down the driveway to Gil */}
      {t < T.pine2 && <div style={{ position: "absolute", left: 120, top: lerp(1500, 1080, spr(t - (T.oh + 0.3), 180, 18)), width: 470, padding: 26, borderRadius: 40, ...CARD, zIndex: 30, opacity: 1 - seg(t, T.pine2 - 0.3, T.pine2) }}>
        <div style={inter(40, GREY, 500)}>Share build page</div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16 }}><Who ch="G" name="Gil" bg="#8E8E93" size={60} /></div>
        <div style={{ marginTop: 18, padding: "14px 0", borderRadius: 24, background: t > T.send ? "#34C759" : "#0A84FF", textAlign: "center", ...inter(44, "#fff", 650) }}>{t > T.send + 0.05 ? "Sent" : "Send"}</div>
        <Ripple t={t} t0={T.send - 0.02} x={235} y={260} />
      </div>}
      {strip > 0.01 && fly < 1 && <div style={{ position: "absolute", left: lerp(160, 740, fly), top: lerp(940, 1150, fly), padding: "14px 24px", borderRadius: 30, ...CARD, transform: `scale(${lerp(1, 0.35, fly)})`, transformOrigin: "0 50%", opacity: clamp(strip * 2) * (1 - seg(fly, 0.85, 1)), zIndex: 31 }}>
        <span style={inter(42, INK, 600)}>fuelmybuild.com/ruth/f100</span></div>}
      {ruth > 0.01 && <Cut id="E02" cx={lerp(-200, 210, clamp(ruth))} cy={1500} w={440} shadow={0} />}
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => caseShot(t, "hook") },
    { at: T.gils - 0.15, render: truck, enter: { kind: "rise", d: 0.55 } },
    { at: T.and1 - 0.1, render: (t) => caseShot(t, "evidence"), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.so - 0.05, render: (t) => caseShot(t, "page"), enter: { kind: "match" } },
    { at: T.its - 0.1, render: (t) => caseShot(t, "wide"), enter: { kind: "match" } },
    { at: T.oh - 0.12, render: drive, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.cta - 0.12, render: (t) => caseShot(t, "cta"), enter: { kind: "rise", d: 0.55 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.15, "tape-click"], [T.restoring, "pop-soft"], [T.asks, "pop-soft"], [T.everything, "pop-soft"], [T.restoring + 0.4, "chip-fade"], [T.everything + 0.4, "chip-fade"],
    [T.photos - 0.1, "paper-flutter"], [T.few - 0.05, "paper-thud"], [T.heres - 0.2, "paper-unfold"], [T.so - 0.35, "card-fold"],
    ...CL.map((c) => [c - 0.02, "torque-click"]), [T.build + 0.15, "card-settle"], [T.photos2 - 0.1, "page-turn"], [T.dateOn + 0.15, "card-settle"], [T.fuel - 0.2, "part-lift"], [T.bolder + 0.05, "card-settle"],
    [T.its - 0.2, "pull"], [T.oh - 0.3, "gravel"], [T.oh + 0.3, "slide-soft"], [T.send - 0.02, "tap"], [T.link + 0.1, "whoosh"], [T.pine2 - 0.6, "gravel"],
    [T.cta + 0.4, "torque-click"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 55, mode: "major", style: "warm", cut: T.its - 0.3, ret: T.oh - 0.12 };
  return { shots, heads, sfx, music };

  function LidPage({ t, T, CL }) {
    // the lid interior lights and grows into the build page; entries click in one per socket
    const open = ez(t, CL[0] - 0.05, 0.6, EASE.camera) * (1 - ez(t, T.cta - 0.3, 0.6, EASE.camera));
    const r = { x: lerp(LID.x, PAGE.x, open), y: lerp(LID.y, PAGE.y, open), w: lerp(LID.w, PAGE.w, open), h: lerp(LID.h, PAGE.h, open) };
    const E = [
      { t: CL[1], date: "JUN 14, 2014", title: "Repaint", sub: "Pine Hollow Body", thumb: "inv" },
      { t: CL[2], date: "AUG 3, 2019", title: "Carb rebuild", sub: "2 photos", thumb: "G12" },
      { t: CL[3], date: "SEP 2026", title: "Fuel pump · Bolder", sub: "logged by Ruth", thumb: "C19" },
    ];
    const s = r.w / PAGE.w;
    return <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 30, overflow: "hidden", zIndex: 15, background: "#fff", boxShadow: `0 0 0 6px #1b1c1f, 0 30px 50px -20px rgba(0,0,0,.5)`, opacity: t > T.cta - 0.4 ? 1 : clamp(open * 4) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: PAGE.w, height: PAGE.h, transformOrigin: "0 0", transform: `scale(${s})` }}>
        <Sweep t={t} w={PAGE.w} o={0.25} />
        <div style={{ position: "absolute", left: 0, top: 0, width: PAGE.w, height: 200, overflow: "hidden" }}>
          <img src={src("B07")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 62%", transform: `scale(${1.04 + 0.02 * Math.sin(t * 0.4)})` }} />
          <div style={{ position: "absolute", left: 24, top: 20, padding: "8px 20px", borderRadius: 26, background: "rgba(255,255,255,.85)" }}><Wordmark size={46} /></div>
        </div>
        <div style={{ position: "absolute", left: 36, top: 214, display: "flex", alignItems: "baseline", gap: 18 }}><span style={inter(58, INK, 700)}>'72 F-100</span><span style={inter(46, GREY, 500)}>Ruth</span></div>
        {/* timeline spine */}
        <div style={{ position: "absolute", left: 60, top: 310, width: 4, height: 30 + 140 * E.filter((e) => t >= e.t).length, background: "#E5E5EA", borderRadius: 2 }} />
        {E.map((e, i) => { const on = t >= e.t - 0.05; if (!on) return null; const flash = 1 - seg(t, e.t, e.t + 0.5);
          return <div key={i} style={{ position: "absolute", left: 36, top: 318 + i * 140, width: 830, height: 130, display: "flex", alignItems: "center", gap: 22, ...land(t, e.t - 0.05) }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: RED, boxShadow: `0 0 0 ${10 * flash}px ${rgba(RED, 0.25)}`, flex: "none" }} />
            <div style={{ width: 140, height: 112, borderRadius: 18, overflow: "hidden", position: "relative", flex: "none", background: "#F2F2F7" }}>
              {e.thumb === "inv" ? <div style={{ position: "absolute", left: 18, top: 8, width: 114, height: 104, background: "#F7F0DC", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}><div style={{ margin: 12, height: 10, background: "#3B342A", opacity: 0.7 }} />{[0, 1, 2, 3].map((k) => <div key={k} style={{ margin: "10px 12px", height: 5, background: "#3B342A", opacity: 0.25 }} />)}</div>
                : e.thumb === "C19" ? <Cut id="C19" cx={75} cy={60} w={140} shadow={0} /> : <img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />}
            </div>
            <div><div style={inter(50, INK, 650)}>{e.title}</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 6 }}><span style={{ ...inter(44, RED, 650), padding: "2px 12px", borderRadius: 10, background: rgba(RED, 0.08) }}>{e.date}</span><span style={inter(44, GREY, 500)}>{e.sub}</span></div></div>
          </div>; })}
      </div>
    </div>;
  }
}
