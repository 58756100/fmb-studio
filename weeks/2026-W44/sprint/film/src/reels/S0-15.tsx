// @ts-nocheck
// S0-15 (lane 0, everyone): "The Torque Wrench Knows", POV of an object narrator. A torque wrench (D04) on a pegboard knows
// Nate's red Civic (A37/A38) better than Nate does: it clicked every bolt on the red control arms (C14). Nate (voice only):
// "last summer? Maybe the one before?" It was April, and nobody wrote down a thing. Today Tomás (E05) picks the wrench up
// with the car's page open, and every click is a line: part, brand, date, a photo. The last click names the shop (Oak
// Street Garage), Nate and Tarrow, who made the arms. "Finally. Somebody else knows."
// Device: click = line. The wrench's click is the beat: bolt flashes under the car, then one card line per click, then
// three name chips on the last heavy click. Look: tan pegboard with holes, bench steel, the shop bay soft behind.
// Transitions: wrench swing (rise, camera follows it down to the car), whip (turn to the counter), silence punch (the "?"
// drops as a click, back to the wrench on the bench), match cut (the blank card on the bench = the card in the bay), whip
// back to the pegboard, CTA over the frame-0 composition (loop).
// remocn (ported): kinetic click flashes (spark bursts), line wipe (one-stroke row reveal), shared-axis chips, period-drop.
// New vs S0-05: one-stroke row wipes synced to SFX clicks.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba } from "../kit";
import { Full, Scrim, Haze, glass, font } from "./s0kit";

export const HOOK_WORDS = 14;
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#C9A274";
export const TEXT = { font: "Inter", weight: 700, size: 108, min: 76, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["D04", "D05", "D11", "D12", "F01", "A37", "A38", "C14", "F05", "E05", "G02"];
const PEG = "#C9A274";

const Pegboard = ({ t, x = 0, w = W * 2.4 }) => <div style={{ position: "absolute", left: x, top: -200, width: w, height: H + 400,
  background: `radial-gradient(circle at 24px 24px, rgba(60,40,20,.55) 0 6px, transparent 7px) 0 0 / 48px 48px, linear-gradient(180deg, #D3AE80, ${PEG} 60%, #B78F60)` }} />;
const Hook = ({ x, y }) => <div style={{ position: "absolute", left: x - 8, top: y - 12, width: 16, height: 40, borderRadius: 8, background: "linear-gradient(90deg,#8E9299,#E8EAED,#8E9299)", boxShadow: "0 4px 6px rgba(0,0,0,.35)" }} />;
// the wrench hanging from its head at (x, y); a = extra swing (deg)
const Wrench = ({ x, y, a = 0, w = 720, z = 10 }) => <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${a}deg)`, zIndex: z }}>
  <div style={{ position: "absolute", left: 0, top: 0, transform: "rotate(57deg)", transformOrigin: "0 0" }}>
    <Cut id="D04" cx={w * 0.36} cy={w * 0.08} w={w} shadow={0} style={{ filter: "drop-shadow(0 18px 18px rgba(0,0,0,.35))" }} />
  </div>
</div>;
const Spark = ({ x, y, p }) => p <= 0 || p >= 1 ? null : <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 30, overflow: "visible" }}>
  {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, r0 = 10 + 50 * p, r1 = 20 + 80 * p; return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={1 - p} />; })}
  <circle cx={x} cy={y} r={14 * (1 - p)} fill="#fff" opacity={1 - p} />
</svg>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    clicked: at("clicked"), every1: at("every", 1), bolt: at("bolt"), nates: at("nate's"), red: at("red"), arms1: at("arms."), ask: at("ask"), when: at("when."),
    uh: at("uh..."), last1: at("last", 1), summer: at("summer?"), maybe: at("maybe"), before: at("before?"), april: at("april."), felt: at("felt"), nobody: at("nobody"), wrote: at("wrote"),
    but: at("but"), today: at("today"), tomas: at("tomás"), picks: at("picks"), page: at("page"), open: at("open."), every3: at("every", 3), click2: at("click,", 2), line: at("line:"),
    part: at("part,"), brand: at("brand,"), date: at("date,"), photo: at("photo."), last2: at("last", 2), names: at("names"), shop: at("shop,"), nate: at("nate,"), tarrow: at("tarrow,"),
    fin: at("finally."), some: at("somebody"), send: tl.cta("send") ?? at("send"),
  };
  const CUT = tl.cut, CTR = T.uh - 0.15, BENCH = T.april - 0.08, WORK = T.but - 0.2, BACK = T.fin - 0.3;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["A", hw[1].s], ["torque", hw[2].s], ["wrench.", hw[3].s]], { hold: 0.3 }), W_([["Knows", hw[6].s], ["it", hw[7].s], ["better", hw[9].s], ["than", hw[10].s, 1], ["its", hw[11].s, 1], ["owner.", hw[12].s, 1]], { key: [5] })]
    : hook === "B" ? [W_([["POV:", hw[0].s], ["the", hw[2].s], ["one", hw[3].s], ["tool", hw[4].s]], { hold: 0.3 }), W_([["Nobody", hw[5].s], ["writes", hw[7].s], ["down.", hw[8].s]], { key: [0] })]
    : [W_([["The", hw[0].s], ["most", hw[1].s], ["honest", hw[2].s], ["witness?", hw[3].s]], { key: [2], hold: 0.3 }), W_([["On", hw[9].s], ["the", hw[10].s], ["wall.", hw[11].s]], { key: [2] })];
  hk[hk.length - 1].exit = { at: CUT + 0.05, mode: "down" };
  const heads = [
    ...hk,
    W_([["Nate's", T.nates], ["red", T.red], ["control", at("control")], ["arms.", T.arms1]], { key: [1], hold: 0.4 }),
    W_([["Ask", T.ask], ["him", at("him")], ["when.", T.when]], { key: [2], out: "right" }),
    W_([["Last", T.last1], ["summer?", T.summer], ["Maybe?", T.maybe]], { hold: 0.6 }),
    W_([["April.", T.april]], { key: [0], hold: 0.5 }),
    W_([["Nobody", T.nobody], ["wrote", T.wrote], ["it", at("down")], ["down.", at("thing.")]], { key: [0] }),
    W_([["Today,", T.today], ["Tomás.", T.tomas]], { hold: 0.9 }),
    W_([["Every", T.every3], ["click,", T.click2], ["a", at("a", 2)], ["line.", T.line]], { key: [3], hold: 2.4 }),
    W_([["Shop.", T.shop], ["Owner.", T.nate], ["Brand.", T.tarrow]], { key: [2], hold: 1.0 }),
    W_([["Finally.", T.fin]], { key: [0], hold: 0.4 }),
    W_([["Somebody", T.some], ["else", at("else")], ["knows.", at("knows.")]], { hold: 0.4 }),
    { ...ctaHead(tl, "Send this to that friend", T.send), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  const HX = 540, HY = 820; // the wrench's hook on the pegboard
  // ---------- shot 1 / end: the pegboard (frame-0 composition); hook C slides along the board first
  const peg = (t, end = false) => {
    const slide = hook === "C" && !end ? lerp(-1300, 0, EASE.camera(seg(t, 0, 2.4))) : 0;
    const push = end ? 1.06 - 0.06 * EASE.io(seg(t, BACK, tl.last + 0.9)) : 1 + 0.06 * EASE.io(seg(t, 0, CUT));
    const sway = end ? 10 * Math.exp(-(t - BACK - 0.3) * 1.6) * Math.sin((t - BACK) * 5) * (t > BACK ? 1 : 0) + 1.2 * Math.sin(t * 1.4) : Math.sin(t * 2.2) * (2 + (hook === "A" ? 2 * Math.abs(Math.sin(t * 7)) * (t < hw[hw.length - 1].e ? 1 : 0) : 0));
    const swing = end ? 0 : -ez(t, CUT - 0.45, 0.45, EASE.in) * 40;
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${slide}px) scale(${push})`, transformOrigin: `${HX}px ${HY + 300}px` }}>
        <Pegboard t={t} x={-200} />
        <div style={{ position: "absolute", left: -200, top: 1520, width: W + 1800, height: 500, background: "linear-gradient(180deg, #8F949B, #6E737A 8%, #5B5F66)", boxShadow: "0 -6px 16px rgba(0,0,0,.3)" }} />
        <Hook x={HX} y={HY} />
        <Cut id="D11" cx={HX + 600} cy={1150} w={300} shadow={0} />
        <Cut id="D12" cx={HX + 900} cy={950} w={360} shadow={0} />
        <Cut id="D05" cx={HX + 1250} cy={1300} w={460} shadow={0.3} />
        <Wrench x={HX} y={HY} a={sway + swing} />
        <div style={{ position: "absolute", left: HX + 120, top: HY - 20, padding: "6px 18px", borderRadius: 10, background: "#F3EFE6", ...font("IBM Plex Mono", 40, "#3A2E20", 500), transform: "rotate(-2deg)" }}>TORQUE</div>
      </div>
      {end && <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", ...font("Inter", 42, "#F2F2F7", 600), opacity: ez(t, T.send + 0.4, 0.4) }}>fuelmybuild.com</div>}
    </AbsoluteFill>;
  };
  // ---------- shot 2: the Civic on the bay floor; bolt flashes under the car as the wrench remembers each click
  const car = (t) => {
    const glow = 0.5 + 0.5 * Math.sin(t * 3);
    const flashes = [T.clicked, T.every1, T.bolt, T.nates - 0.1].map((tt, i) => ({ x: [430, 520, 610, 700][i], y: 1430, p: seg(t, tt, tt + 0.35) }));
    const wrIn = EASE.out(seg(t, CUT - 0.2, CUT + 0.8));
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={CUT} t1={CTR} k0={1.1} k1={1.16} fy={0.7} dim={0.25} />
      <Haze />
      <div style={{ position: "absolute", left: 300, top: 1340, width: 480, height: 130, opacity: 0.35 + 0.35 * glow, filter: `drop-shadow(0 0 ${10 + 10 * glow}px rgba(244,48,52,.8))` }}><Cut id="C14" cx={240} cy={65} w={440} shadow={0} /></div>
      <Cut id="A38" cx={540} cy={1300} w={1040} shadow={0.6} />
      {flashes.map((f, i) => <Spark key={i} x={f.x} y={f.y} p={f.p} />)}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - wrIn) * -900}px)` }}><Wrench x={880} y={560} a={-8 + 4 * Math.sin(t * 2)} w={560} z={20} /></div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: the shop counter; Nate is only a voice
  const counter = (t) => <AbsoluteFill>
    <Full id="F05" t={t} t0={CTR} t1={BENCH} k0={1.08} k1={1.18} fy={0.6} dim={0.05} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.4) 35%, rgba(255,255,255,0) 60%)" }} />
    {[["last summer?", T.last1, 160, 1180], ["the one before?", T.maybe, 420, 1330]].map(([s, tt, x, y], i) => { const q = spr(t - tt, 200, 15); return q > 0.01 &&
      <div key={i} style={{ position: "absolute", left: x, top: y, padding: "16px 30px", borderRadius: 40, background: "rgba(255,255,255,.92)", ...font("Inter", 48, GREY, 600, { fontStyle: "italic" }), transform: `scale(${q}) rotate(${i ? 3 : -3}deg)`, boxShadow: "0 12px 24px rgba(0,0,0,.15)" }}>{s}</div>; })}
  </AbsoluteFill>;
  // ---------- shot 4: the wrench on the bench beside a blank card (the record that should exist)
  const CARD = { x: 60, y: 560, w: 960, h: 560 };
  const bench = (t) => {
    const d = drift(t, "bn", 4, 0.3);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #A4A9B0, #7D838B 60%, #6B7078)" }} />
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(100deg, rgba(255,255,255,.04) 0 3px, transparent 3px 9px)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 40, background: "#fff", boxShadow: "0 30px 50px -26px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 40, top: 36, ...font("Inter", 42, "#C7C7CC", 500) }}>'95 Civic · control arms</div>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40, top: 130 + i * 90, width: 520 - i * 80, height: 26, borderRadius: 13, background: "#F2F2F5" }} />)}
          <div style={{ position: "absolute", right: 40, top: 130, width: 300, height: 250, borderRadius: 24, border: "5px dashed #D1D1D6" }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${-60 + 20 * Math.sin(t * 0.8)}px, 0)` }}><Wrench x={150} y={1260} a={-57} w={880} z={8} /></div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 5: the bay; the same card is the Civic's page; clicks write lines; the last click names three
  const work = (t) => {
    const clicks = [T.part, T.brand, T.date, T.photo - 0.05];
    const rows = [["Part", "Control arms", INK], ["Brand", "Tarrow", INK], ["Date", "Apr 22, 2025", RED]];
    const heavy = T.names - 0.15;
    const jolt = [...clicks, heavy].reduce((a, tc) => a + (t > tc && t < tc + 0.25 ? Math.sin((t - tc) * 60) * 3 * (1 - (t - tc) / 0.25) : 0), 0);
    const chips = [["Oak Street Garage", T.shop], ["Nate · owner", T.nate], ["Tarrow", T.tarrow]];
    const tom = spr(t - (T.tomas - 0.1), 160, 18);
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={WORK} t1={BACK} k0={1.12} k1={1.2} fy={0.72} dim={0.3} />
      <Haze h={620} a={0.8} />
      <div style={{ position: "absolute", left: 0, top: 0, opacity: clamp(tom * 2), transform: `translateX(${(1 - tom) * 300}px)` }}><Cut id="E05" cx={930} cy={1250} w={400} shadow={0} /></div>
      <Cut id="A38" cx={500} cy={1400} w={980} shadow={0.6} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${jolt}px, 0)` }}><Wrench x={760} y={1230} a={-70 + jolt} w={460} z={20} /></div>
      {clicks.map((tc, i) => <Spark key={i} x={720} y={1430} p={seg(t, tc, tc + 0.35)} />)}
      <Spark x={720} y={1430} p={seg(t, heavy, heavy + 0.5)} />
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 40, background: "#fff", boxShadow: "0 30px 50px -26px rgba(0,0,0,.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 36, ...font("Inter", 42, GREY, 500) }}>'95 Civic · build log</div>
        <div style={{ position: "absolute", right: 30, top: 26, padding: "6px 18px", borderRadius: 24, background: "#F2F2F5", ...font("Inter", 40, INK, 600), opacity: ez(t, T.page - 0.1, 0.3) }}>Fuel<span style={{ color: RED }}>My</span>Build</div>
        {rows.map(([k, v, c], i) => { const p = EASE.out(seg(t, clicks[i], clicks[i] + 0.22));
          return <div key={i} style={{ position: "absolute", left: 40, top: 120 + i * 90, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
            <span style={font("Inter", 42, GREY, 500)}>{k}  </span><span style={font("Inter", 52, c, 650)}>{v}</span></div>; })}
        {[0, 1, 2].map((i) => t < clicks[i] && <div key={"g" + i} style={{ position: "absolute", left: 40, top: 140 + i * 90, width: 520 - i * 80, height: 26, borderRadius: 13, background: "#F2F2F5" }} />)}
        <div style={{ position: "absolute", right: 40, top: 130, width: 300, height: 250, borderRadius: 24, overflow: "hidden", border: t < clicks[3] ? "5px dashed #D1D1D6" : "none", boxSizing: "border-box" }}>
          {t >= clicks[3] && <img src={src("G02")} style={{ width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${(1 - EASE.out(seg(t, clicks[3], clicks[3] + 0.25))) * 100}% 0 0)` }} />}
        </div>
        <div style={{ position: "absolute", left: 40, top: 420, display: "flex", gap: 16 }}>
          {chips.map(([s, tt], i) => { const q = spr(t - (tt - 0.1), 230, 16); return <div key={i} style={{ padding: "10px 24px", borderRadius: 30, background: i === 2 ? "rgba(244,48,52,.1)" : "#F2F2F5", ...font("Inter", 40, i === 2 ? RED : INK, 600),
            opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 30}px)` }}>{s}</div>; })}
        </div>
      </div>
    </AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: (t) => peg(t) },
    { at: CUT, render: car, enter: { kind: "rise", d: 0.6 } },
    { at: CTR, render: counter, enter: { kind: "whip", d: 0.4, dir: -1 } },
    { at: BENCH, render: bench, enter: { kind: "punch" } },
    { at: WORK, render: work, enter: { kind: "match" } },
    { at: BACK, render: (t) => peg(t, true), enter: { kind: "whip", d: 0.42, dir: 1 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...(hook === "C" ? [[0.05, "air-glide-long"], [2.3, "tick-soft"]] : [[0.05, "creak-soft"]]),
    [CUT - 0.45, "string-creak"], [T.clicked, "tape-click"], [T.every1, "tape-click"], [T.bolt, "tape-click"], [T.nates - 0.1, "tape-click"], [T.red, "tint-swell", 0.6],
    [T.last1, "pop-soft"], [T.maybe, "pop-soft"], [BENCH, "tape-click"], [T.tomas - 0.1, "slide-soft"], [T.page - 0.1, "pop-soft"],
    [T.part, "tape-click"], [T.brand, "tape-click"], [T.date, "tape-click"], [T.photo - 0.05, "tape-click-x2"], [T.names - 0.15, "clunk"], [T.shop - 0.1, "chip-pop"], [T.nate - 0.1, "chip-pop"], [T.tarrow - 0.1, "chip-pop"],
    [BACK + 0.3, "creak-soft"], [ctaT, "cta-pop"],
  ];
  // music: dry comic groove; drops out for Nate's guesses, returns on "April." with the click
  const music = { bpm: 104, root: 48, mode: "minor", style: "observe", cut: T.uh - 0.2, ret: BENCH, room: "shop" };
  return { shots, heads, sfx, music };
}
