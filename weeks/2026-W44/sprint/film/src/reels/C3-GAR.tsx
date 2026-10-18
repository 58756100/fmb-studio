// @ts-nocheck
// C3-GAR (lane C, garages): "You never told me." Okafor slaps the counter bell over an $1,850 head-gasket job.
// Gus walks the week on a split-flap board and Thursday stalls blank. The counter monitor turns: the weep was logged
// Tuesday, with a photo and Gus's name. It proves when, not the call: "You still should've called." "I should have."
// Device: airport split-flap word board (events, not a clock); the counter monitor swivels from its back.
// Hero: R34 (A14) + inline-six head (C16, the engine on the counter); weep photo G07.
// Transitions: board clatter (row flips carry the beats), punch-in/out, monitor swivel (object turns into the record),
// slow push into the photo, monitor turns half back, board clatters back to frame 0 under the CTA.
// remocn (ported): caption-split-flap (board engine), lens-zoom settle (punch-ins), shimmer-sweep (glass),
// typewriter (URL), period-drop. New vs C3-COL: caption-split-flap, lens-zoom.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD } from "./laneB";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
export const BG = "#FFFFFF";
export const TEXT = { ...HTEXT, size: 112 };
export const IMAGES = ["A14", "C16", "G07"];
const COLS = 13, CW = 70, CH = 92, BX = 540 - (COLS * CW) / 2, BY = 600;
const GLYPHS = "ABCDEFGHIJKLMNOPRSTUVWY0123456789";

// one split-flap cell: cycles glyphs until it lands at t1 (deterministic per cell)
const Cell = ({ t, ch, t0, t1, col, row, color = "#F5F5F7", twitch = 0 }) => {
  let shown = ch, flip = 0;
  if (t >= t0 && t < t1) {
    const k = Math.floor((t - t0) / 0.045); flip = ((t - t0) / 0.045) % 1;
    shown = GLYPHS[(k * 7 + col * 3 + row * 5) % GLYPHS.length];
  } else if (t < t0) shown = null;
  const lift = twitch > 0 ? Math.sin(Math.PI * twitch) * 0.5 : 0;
  return <div style={{ position: "absolute", left: BX + col * CW + 3, top: BY + row * (CH + 10), width: CW - 6, height: CH, borderRadius: 7, background: "#1C1C1E", overflow: "hidden",
    boxShadow: "inset 0 -2px 0 rgba(255,255,255,.04), 0 3px 6px rgba(0,0,0,.35)" }}>
    {shown && shown !== " " && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", ...inter(62, color, 700, { letterSpacing: 0 }), transform: `scaleY(${flip ? 1 - 0.85 * Math.sin(Math.PI * flip) : 1 - lift})`, transformOrigin: "50% 50%" }}>{shown}</div>}
    <div style={{ position: "absolute", left: 0, right: 0, top: CH / 2 - 1, height: 2, background: "rgba(0,0,0,.55)" }} />
  </div>;
};
// a row of text that clatters in at t0 (each column lands a little later), optionally replacing an older text
const Row = ({ t, row, text, t0, prev, prevAt = -9, color, twitchAt = [] }) => {
  const s = text.padEnd(COLS).slice(0, COLS), p = (prev ?? "").padEnd(COLS).slice(0, COLS);
  return <>{[...s].map((c, i) => {
    const land = t0 + 0.3 + i * 0.035;
    const showPrev = t < t0 && prev != null && t >= prevAt;
    const tw = twitchAt.reduce((a, tt) => Math.max(a, seg(t, tt + i * 0.01, tt + 0.18 + i * 0.01) < 1 && t > tt ? seg(t, tt, tt + 0.18) : 0), 0);
    return <Cell key={i} t={t} ch={showPrev ? p[i] : c} t0={showPrev ? -99 : (c === " " && p[i] === " " ? 99 : t0)} t1={showPrev ? -98 : land} col={i} row={row} color={color} twitch={tw} />;
  })}</>;
};
// brass counter bell (no bank image yet)
const Bell = ({ x, y, hit }) => {
  const ring = hit >= 0 && hit < 0.6 ? hit : -1;
  return <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 130, zIndex: 12 }}>
    <div style={{ position: "absolute", left: 82, top: 6 + (ring >= 0 && ring < 0.08 ? 10 : 0), width: 16, height: 28, borderRadius: 6, background: "linear-gradient(90deg,#9a9a9e,#e4e4e8,#8e8e93)" }} />
    <div style={{ position: "absolute", left: 22, top: 30, width: 136, height: 72, borderRadius: "68px 68px 8px 8px", background: "radial-gradient(60% 80% at 35% 30%, #F6D98A, #C9A043 55%, #8C6A1F)" }} />
    <div style={{ position: "absolute", left: 6, top: 96, width: 168, height: 24, borderRadius: 12, background: "linear-gradient(180deg,#2c2c2e,#0d0d0f)" }} />
    {ring >= 0 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 90 - 60 - i * 30 - ring * 160, top: 60 - 60 - i * 30 - ring * 160, width: 120 + i * 60 + ring * 320, height: 120 + i * 60 + ring * 320,
      borderRadius: "50%", border: `4px solid ${rgba("#C9A043", 0.6 * (1 - ring / 0.6))}`, clipPath: "inset(0 0 50% 0)" }} />)}
  </div>;
};
// the counter monitor (front: the build log entry on the R34's build page)
const Monitor = ({ t, T, x, y, w, rot, push = 0 }) => {
  const h = w * 0.64, c = Math.cos((rot * Math.PI) / 180), back = c < 0;
  const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 18}px)` }; };
  const hl = (t0) => ez(t, t0 - 0.05, 0.25);
  const k = w / 920;
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h + 70 * k, zIndex: 30, perspective: 2400 }}>
    <div style={{ position: "absolute", inset: 0, transform: `rotateY(${rot}deg)` }}>
      <div style={{ position: "absolute", left: w / 2 - 40 * k, top: h - 6, width: 80 * k, height: 60 * k, background: "#3A3A3C" }} />
      <div style={{ position: "absolute", left: w / 2 - 160 * k, top: h + 50 * k, width: 320 * k, height: 18 * k, borderRadius: 9, background: "#2C2C2E" }} />
      {back ? <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 22 * k, background: "linear-gradient(180deg,#3A3A3C,#1f1f21)" }} />
        : <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 22 * k, background: "#0E0E10", padding: 16 * k }}>
          <div style={{ position: "relative", width: w - 32 * k, height: h - 32 * k, borderRadius: 8 * k, overflow: "hidden", background: "#fff" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 438, transformOrigin: "0 0", transform: `scale(${(w - 32 * k) / 700})` }}>
              <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "#F5F5F7" }}>
                <Typed t={t} t0={T.logged - 0.6} t1={T.logged + 0.4} text="fuelmybuild.com/okafor/r34" caret={GREY} style={inter(30, GREY, 500)} keepCaret={0} />
              </div>
              <div style={{ position: "absolute", left: 22, top: 64, ...inter(44, INK, 650), ...f(T.logged - 0.3) }}>Oil weep at head gasket</div>
              <div style={{ position: "absolute", left: 22, top: 118, padding: "0 10px", borderRadius: 8, background: `rgba(244,48,52,${0.12 * hl(T.logged + 0.6)})`, ...inter(36, hl(T.logged + 0.6) > 0.5 ? RED : INK, 600), ...f(T.logged) }}>Tue, Oct 20</div>
              <div style={{ position: "absolute", left: 22, top: 172, width: 390, height: 248, borderRadius: 14, overflow: "hidden", boxShadow: `0 0 0 ${4 * hl(T.photo)}px ${RED}`, ...f(T.photo - 0.15) }}>
                <img src={src("G07")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 60%", transformOrigin: "42% 55%", transform: `scale(${1.05 + 0.12 * push})` }} />
              </div>
              <div style={{ position: "absolute", left: 430, top: 180, width: 250, padding: "16px 18px", borderRadius: 18, background: "#F5F5F7", ...f(T.gus - 0.2), boxShadow: `0 0 0 ${4 * hl(T.gus)}px ${RED}` }}>
                <div style={inter(30, GREY, 500)}>logged by</div>
                <div style={inter(44, INK, 650)}>Gus</div>
                <div style={{ ...inter(30, GREY, 500), marginTop: 8, whiteSpace: "normal", lineHeight: 1.05 }}>Pell Street Garage</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: ((t * 120) % 1400) - 300, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.25), rgba(255,255,255,0))" }} />
          </div>
        </div>}
    </div>
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    okafor: at("okafor's"), did: at("did"), call: at("call?"), tue: at("tuesday,"), wed: at("wednesday,"), parts: at("parts."), thu: at("thursday..."),
    so: at("so"), didnt: at("didn't."), hang: at("hang"), logged: at("logged"), photo: at("photo."), gus: at("gus's"), still: at("still"), should: at("i"),
    then: at("then"), engine: at("engine."), log: tl.cta("shop") ?? at("log"), end: tl.last,
  };
  const h0 = tl.hook[0].s;
  const bellAt = hook === "C" ? 0.05 : hook === "B" ? tl.hook[2].s : 0.02;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const heads = [
    fx(B("Okafor's R34.", T.okafor), [T.okafor, at("r")]),
    B("Did Gus ever call?", T.did, { key: [3] }),
    B("So you didn't.", T.so, { key: [2], hold: 1.0 }),
    B("Hang on.", T.hang, { hold: 0.5 }),
    B("You still should've called.", T.still - 0.25, { key: [3] }),
    B("Then they talked engine.", T.then, { key: [3] }),
    { ...ctaHead(tl, "Shop owners, save this.", T.log), key: [2, 3] },
  ];
  fx(heads[5], [T.then, at("they"), at("talked"), T.engine]);
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  const scene = (t) => {
    const cam = track(t, { k: 1, y: 0 }, [[T.okafor - 0.05, { k: 1.06, y: 40 }, 0.18, EASE.out], [T.tue - 0.1, { k: 1, y: 0 }, 0.3], [T.engine - 0.6, { k: 1.04, y: -50 }, 1.2, EASE.io], [T.log - 0.2, { k: 0.97, y: 0 }, 0.9]]);
    const punch = t >= T.okafor - 0.05 && t < T.okafor + 0.2 ? 1 + 0.02 * (1 - spr(t - T.okafor + 0.05, 260, 22)) : 1;
    const d = drift(t, "gar", 3, 0.22);
    const mon = track(t, { x: 860, y: 1140, w: 240, rot: 180, o: 0 }, [
      [T.hang - 0.1, { o: 1 }, 0.2, EASE.out], [T.hang, { x: 540, y: 600, w: 960, rot: 0 }, 0.95, EASE.camera],
      [T.should - 0.15, { x: 860, y: 1100, w: 300, rot: 160, o: 0 }, 0.8, EASE.camera],
    ]);
    const push = ez(t, T.still - 0.2, 1.6, EASE.io) * (1 - ez(t, T.should - 0.15, 0.4));
    const boardDim = clamp(mon.w / 960) * (mon.rot < 90 ? 1 : 0);
    const chipGrey = ez(t, T.engine - 0.2, 0.6) * (1 - ez(t, T.log + 0.3, 0.4));
    const chipDrop = hook === "B" ? spr(t - (h0 - 0.05), 260, 15) : spr(t - 0.45, 260, 15);
    // board text timeline
    const r0 = t < T.tue - 0.15 ? "NEVER TOLD ME" : t < T.log - 0.2 ? "MON  CAR IN" : "NEVER TOLD ME";
    const r0t0 = t < T.tue - 0.15 ? (hook === "C" ? 0.25 : 0.05) : t < T.log - 0.2 ? T.tue - 0.15 : T.log - 0.2;
    const thuText = t < T.should - 0.05 ? "THU" : "THU  SORRY";
    const twitches = [T.so - 0.2, T.didnt + 0.1, T.hang - 0.3].filter((x) => x < T.should - 0.1);
    return <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 45%", transform: `scale(${cam.k * punch}) translateY(${cam.y}px) ${dT(d, 0.4)}` }}>
        {/* the board */}
        <div style={{ position: "absolute", left: BX - 22, top: BY - 22, width: COLS * CW + 44, height: 4 * (CH + 10) + 34, borderRadius: 26, background: "#0B0B0C", boxShadow: "0 30px 50px -24px rgba(0,0,0,.5)", opacity: 1 - 0.75 * boardDim }} />
        <div style={{ opacity: 1 - 0.75 * boardDim }}>
          <Row t={t} row={0} text={r0} t0={r0t0} prev={t < T.log - 0.2 ? "NEVER TOLD ME" : "MON  CAR IN"} prevAt={0} color={r0 === "NEVER TOLD ME" ? "#FF6B6E" : "#F5F5F7"} />
          <Row t={t} row={1} text={t < T.tue - 0.15 ? (t >= T.okafor ? "PELL ST GARAGE".slice(0, COLS) : "") : t < T.log - 0.2 ? "TUE  FOUND IT" : ""} t0={t < T.tue - 0.15 ? T.okafor : t < T.log - 0.2 ? T.tue - 0.05 : T.log - 0.1} prev={t < T.tue - 0.15 ? "" : t < T.log - 0.2 ? "PELL ST GARAG" : "TUE  FOUND IT"} prevAt={0} color="#C7C7CC" />
          <Row t={t} row={2} text={t >= T.wed - 0.1 && t < T.log - 0.2 ? "WED  PARTS" : ""} t0={t < T.log - 0.2 ? T.wed - 0.1 : T.log} prev={t >= T.log - 0.2 ? "WED  PARTS" : ""} prevAt={0} />
          <Row t={t} row={3} text={t >= T.thu - 0.1 && t < T.log - 0.2 ? thuText : ""} t0={t < T.should - 0.05 ? T.thu - 0.1 : T.should - 0.05} prev={t >= T.should - 0.05 && t < T.log - 0.2 ? "THU" : t >= T.log - 0.2 ? "THU  SORRY" : ""} prevAt={0}
            color={thuText.includes("SORRY") ? "#FF6B6E" : "#F5F5F7"} twitchAt={twitches} />
        </div>
        {/* the car, the engine on the counter, the job chip, the bell */}
        <Cut id="A14" cx={600} cy={1210} w={700} shadow={0.35} />
        <Cut id="C16" cx={190} cy={1290} w={280} rot={-3 + Math.sin(t * 0.6)} shadow={0.35} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1372, height: 3, background: "#E5E5EA" }} />
        <div style={{ position: "absolute", left: 96, top: 1062 - (1 - chipDrop) * 200, opacity: clamp(chipDrop * 3), padding: "12px 26px", borderRadius: 34,
          background: chipGrey > 0.5 ? "#E5E5EA" : RED, ...inter(44, chipGrey > 0.5 ? "#6E6E73" : "#fff", 600), transition: "none" }}>Head gasket · $1,850</div>
        <Bell x={930} y={1300} hit={t - bellAt} />
        {mon.o > 0.01 && <div style={{ opacity: mon.o }}><Monitor t={t} T={T} x={mon.x} y={mon.y} w={mon.w} rot={mon.rot} push={push} /></div>}
      </div>
    </AbsoluteFill>;
  };
  return { shots: [{ at: 0, render: scene }], heads };
}
