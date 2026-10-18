// @ts-nocheck
// B-L2 (lane B, garages): "Same car. Different proof." Nora needs an engine swap; two garages show the same polished
// Miata. Shop A's gallery shows the finish; Shop B's public build shows the garage, the contributor (Eli), a dated log
// and the install photos.
// Hero: red Miata (A07/A08/A09) ; Nora E10 ; Eli E05 ; the Miata's engine swap (lab photos L04/L05, same car).
// Transitions: speaker swap (shop tiles slide on one axis to Nora's message), match cut back to the pair, tap-to-open
// (Shop A tile -> its gallery), gallery collapse to one photo, tap-to-open (Shop B's link -> its build page), focus walk
// down the record, match cut back to the pair with Shop B credited, CTA landing.
// remocn (ported): shared-axis (speaker swap), simulated-cursor ripple, typewriter (message + URL), inline-highlight
// (credit fields), period-drop. New vs B-L1: shared-axis, inline-highlight.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD, Studio, Avatar, LetterAv, Pic, rise, PageCard } from "./laneB";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
export const BG = HBG;
export const TEXT = { ...HTEXT, size: 116 };
export const IMAGES = ["A07", "A08", "A09", "E10", "E05", "L04", "L05", "F10"];
const HOOKS = { A: "Same car. / Different proof.", B: "Who actually / built it?", C: "Your work / needs a name." };
const NORA = { x: 0.37, y: 0.15, z: 2.6 }, ELI = { x: 0.5, y: 0.16, z: 2.3 };

// a shop tile: the Miata on a studio tile, the shop chip, and a credit line (empty dashes or filled)
const ShopTile = ({ t, x, y, w = 960, h = 420, shop, credit = 0, creditText, o = 1, s = 1, sel = 0, z }) => {
  if (o <= 0.002) return null;
  const k = 1 + 0.012 * Math.sin(t * 0.6 + (shop === "B" ? 1.3 : 0));
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, zIndex: z, transform: `scale(${s})`, ...CARD, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#FFFFFF 0%,#F4F4F6 60%,#E9E9EC 100%)" }} />
    <Cut id="A08" cx={w * 0.56} cy={h * 0.52} w={w * 0.72 * k} shadow={0.35} />
    <div style={{ position: "absolute", left: 28, top: 26, display: "flex", alignItems: "center", gap: 14, padding: "8px 22px 8px 8px", borderRadius: 40, background: "rgba(255,255,255,.85)", boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}>
      <LetterAv ch={shop} size={60} bg={shop === "A" ? "#8E8E93" : "#0A84FF"} /><span style={inter(42, INK)}>Shop {shop}</span>
    </div>
    {credit > 0.01 && <div style={{ position: "absolute", left: 28, right: 28, bottom: 22, height: 74, borderRadius: 37, display: "flex", alignItems: "center", padding: "0 26px", opacity: clamp(credit * 2),
      background: creditText ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.6)", border: creditText ? `3px solid ${RED}` : "3px dashed #C7C7CC", ...inter(40, creditText ? INK : GREY, 500) }}>
      {creditText || "Built by: —"}</div>}
    {sel > 0.01 && <div style={{ position: "absolute", inset: 0, borderRadius: 44, boxShadow: `inset 0 0 0 6px ${RED}`, opacity: sel }} />}
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    nora: at("nora"), swap: at("swap"), two: at("two"), same: at("same"), who: at("who"), shopA: at("shop"), finish: at("finish"), but: at("but"),
    installed: at("installed"), a: at("photo"), answer: at("answer"), so: at("so"), opens: at("opens"), pub: at("public"), fuel: at("fuel"),
    garage: at("garage"), contrib: at("contributor"), eli: at("eli"), dated: at("dated"), install: at("install"), now: at("now"), whodid: at("who", 3),
    which: at("which"), call: at("call"), follow: tl.cta("got") ?? at("follow"),
  };
  const SWAP = T.nora - 0.12, BACK = T.two - 0.08, TAPA = T.shopA - 0.08, TAPB = T.so - 0.05, BACK2 = T.which - 0.08;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const heads = [
    { words: wordsFor(tl.hook, HOOKS[hook], 0), key: hook === "A" ? [3] : [] },
    fx(B("Nora: engine swap", T.nora), [T.nora, at("engine"), T.swap]),
    B("Two garages.", T.two, { hold: 0.7 }),
    B("Same polished Miata.", T.same),
    B("Who did the work?", T.who, { key: [3] }),
    B("Shop A's gallery", T.shopA, { hold: 0.6 }),
    B("Shows the finish.", at("shows"), { key: [2] }),
    B("Who installed the engine?", T.who + 3.5, { key: [1] }),
    B("A photo can't answer.", T.a - 0.3, { key: [2], hold: 1.0 }),
    fx(B("Shop B's public build", T.opens), [at("shop", 2), at("b's"), T.pub, at("build")]),
    B("Garage: Shop B.", T.garage),
    B("Contributor: Eli.", T.contrib, { key: [1] }),
    B("Dated log.", T.dated, { exit: { at: T.install - 0.4, mode: "up" } }),
    B("Install photos.", T.install - 0.1, { hold: 0.8 }),
    fx(B("Who did what.", T.now), [T.whodid, at("did", 2), at("what")]),
    B("Which would you call?", T.which, { key: [3], exit: { at: T.follow - 0.35, mode: "up" } }),
    { ...ctaHead(tl, "Send this their way", T.follow), key: [3] },
  ];
  // "Who installed the engine?" must find "who" after "but"
  heads[7] = B("Who installed the engine?", at("who", 2), { key: [1] });
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- pair of shops (shot 1, 3, 7)
  const pair = (t, phase) => {
    const d = drift(t, "pr", 3, 0.25);
    const credit = phase === 2 ? ez(t, T.who - 0.1, 0.4) : phase === 3 ? 1 : 0;
    const align = phase === 2 ? ez(t, T.same, 0.5) : 0;
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * cta})`, transformOrigin: "50% 50%" }}>
        <ShopTile t={t} x={60} y={600} shop="A" credit={credit} sel={0} o={phase === 3 ? 0.55 + 0.45 * (1 - ez(t, BACK2 + 0.3, 0.5)) : 1} />
        <ShopTile t={t} x={60} y={1080} shop="B" credit={credit} creditText={phase === 3 ? "Shop B · Eli · Engine, Jul 18" : null} sel={phase === 3 ? ez(t, T.call, 0.4) : 0} />
        {align > 0.01 && align < 0.99 && <div style={{ position: "absolute", left: 60, right: 60, top: 600, height: 900, borderLeft: `4px solid ${RED}`, borderRight: `4px solid ${RED}`, opacity: Math.sin(Math.PI * align) * 0.8 }} />}
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- Nora's message (speaker swap)
  const nora = (t) => {
    const p = ez(t, SWAP, 0.45, EASE.camera);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 620, display: "flex", alignItems: "center", gap: 24, ...rise(t, SWAP + 0.05) }}>
        <Avatar id="E10" size={150} face={NORA} bg="#E6DED3" />
        <div><div style={inter(60, INK)}>Nora</div><div style={inter(42, GREY, 500)}>'91 Miata · customer</div></div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 840, width: 960, ...CARD, padding: "40px 44px", ...rise(t, SWAP + 0.2) }}>
        <div style={inter(38, GREY, 500)}>New message</div>
        <div style={{ ...inter(56, INK, 500, { whiteSpace: "normal", lineHeight: 1.22 }), marginTop: 10 }}>
          <Typed t={t} t0={SWAP + 0.4} t1={T.swap + 0.3} text="Looking for an engine swap on my Miata. Who's done one?" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 1260, display: "flex", gap: 20, opacity: 0.9 }}>
        {["A", "B"].map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 24px 8px 8px", borderRadius: 40, ...CARD, ...rise(t, T.swap + 0.1 + i * 0.12) }}>
          <LetterAv ch={s} size={60} bg={s === "A" ? "#8E8E93" : "#0A84FF"} /><span style={inter(42, INK)}>Shop {s}</span></div>)}
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- Shop A's gallery, then collapse to one photo
  const gallery = (t) => {
    const col = ez(t, T.a - 0.2, 0.6, EASE.camera);
    const tiles = [["A07", 0.5], ["A08", 0.5], ["A09", 0.5], ["A08", 0.25], ["A07", 0.7], ["A09", 0.3]];
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 590, display: "flex", alignItems: "center", gap: 14, ...rise(t, TAPA + 0.2) }}>
        <LetterAv ch="A" size={64} bg="#8E8E93" /><span style={inter(46, INK)}>Shop A</span><span style={inter(40, GREY, 500)}>· Gallery</span>
      </div>
      {tiles.map(([id], i) => {
        const cx = i % 2, cy = Math.floor(i / 2);
        const x0 = 60 + cx * 486, y0 = 690 + cy * 300;
        const big = i === 0;
        const x = big ? lerp(x0, 60, col) : x0, y = big ? lerp(y0, 700, col) : y0, w = big ? lerp(474, 960, col) : 474, h = big ? lerp(288, 600, col) : 288;
        const p = spr(t - (TAPA + 0.15 + i * 0.07), 200, 19);
        const o = big ? 1 : 1 - col;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, overflow: "hidden", opacity: clamp(p * 2) * o, transform: `scale(${0.9 + 0.1 * p})`,
          background: "linear-gradient(180deg,#FFFFFF 0%,#F1F1F4 60%,#E6E6EA 100%)", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 20px 30px -20px rgba(0,0,0,.25)" }}>
          <Cut id={id} cx={w / 2} cy={h * 0.52} w={w * 0.8 * (1 + 0.02 * Math.sin(t * 0.7 + i))} shadow={0.3} />
        </div>;
      })}
      {col > 0.01 && <div style={{ position: "absolute", left: 60, top: 1340, width: 960, height: 110, borderRadius: 55, border: "4px dashed #C7C7CC", display: "flex", alignItems: "center", padding: "0 34px",
        opacity: col, ...inter(46, GREY, 500) }}>Engine installed by: <span style={{ color: RED, marginLeft: 14 }}>?</span></div>}
      {/* Shop B's reply with the link (lands just before the tap) */}
      {t > TAPB - 0.9 && <div style={{ position: "absolute", left: 60, top: 1340, width: 960, ...CARD, padding: "26px 34px", display: "flex", alignItems: "center", gap: 20, ...rise(t, TAPB - 0.9), zIndex: 5 }}>
        <LetterAv ch="B" size={70} bg="#0A84FF" /><div><div style={inter(36, GREY, 500)}>Shop B replied</div><div style={inter(44, RED, 500)}>fuelmybuild.com/shopb/miata</div></div>
      </div>}
    </Studio></AbsoluteFill>;
  };
  // ---------- Shop B's build page: attribution, dated log, install photos
  const page = (t) => {
    const g = ez(t, T.garage - 0.1, 0.35), c = ez(t, T.contrib - 0.1, 0.35);
    const lift = ez(t, T.dated - 0.15, 0.6, EASE.camera), pull = ez(t, T.now - 0.1, 0.6, EASE.camera);
    const d = drift(t, "bp", 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <PageCard t={t} y={590} h={980} hero="L05" heroH={340} fy={0.55} title="'91 Miata · Engine swap" owner="Shop B · Public build" ownerAv={<LetterAv ch="B" size={56} bg="#0A84FF" />}
          brandAt={T.fuel - 0.1} s={1 - 0.05 * lift} o={1 - 0.65 * lift}>
          <div style={{ marginTop: 22, borderRadius: 30, background: "#F2F2F7", padding: "6px 26px" }}>
            {[["Garage", "Shop B", <LetterAv ch="B" size={64} bg="#0A84FF" />, g], ["Contributor", "Eli", <Avatar id="E05" size={64} face={ELI} bg="#DDD6CC" />, c]].map(([l, v, av, f], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 104, borderTop: i ? "1px solid rgba(60,60,67,.16)" : undefined, opacity: 0.35 + 0.65 * f }}>
                {av}<span style={inter(40, GREY, 500)}>{l}</span><span style={{ ...inter(52, f > 0.5 ? INK : GREY), marginLeft: "auto", padding: "4px 16px", borderRadius: 16, background: `rgba(244,48,52,${0.1 * f * (1 - lift)})` }}>{v}</span>
              </div>))}
          </div>
        </PageCard>
        {lift > 0.01 && <div style={{ position: "absolute", left: 60, top: lerp(1300, lerp(640, 760, pull), lift), width: 960, ...CARD, padding: "34px 40px 40px", opacity: clamp(lift * 2.5), zIndex: 8 }}>
          <div style={inter(38, GREY, 500)}>Build log · dated entry</div>
          <div style={{ ...inter(62, INK), marginTop: 6 }}>Jul 18, 2026 <span style={{ color: GREY }}>·</span> Engine install</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}><Avatar id="E05" size={56} face={ELI} bg="#DDD6CC" /><span style={inter(42, "#3A3A3C", 500)}>Eli · Shop B</span></div>
          <div style={{ display: "flex", gap: 18, marginTop: 24 }}>{[["L04", T.install - 0.1], ["L05", T.install + 0.25]].map(([id, tt], i) => {
            const p = spr(t - tt, 220, 18), on = t >= tt;
            return <div key={id} style={{ flex: 1, height: 330, borderRadius: 26, overflow: "hidden", border: on ? "none" : "4px dashed #C7C7CC", position: "relative" }}>
              {on && <img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.2 - 0.14 * clamp(p)})`, opacity: clamp(p * 2) }} />}
            </div>;
          })}</div>
        </div>}
      </div>
    </Studio></AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: (t) => pair(t, 1) },
    { at: SWAP, render: nora, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: BACK, render: (t) => pair(t, 2), enter: { kind: "whip", d: 0.38, dir: 1 } },
    { at: TAPA, render: gallery, enter: { kind: "tap", d: 0.5, rect: { x: 60, y: 600, w: 960, h: 420 }, r: 44 } },
    { at: TAPB, render: page, enter: { kind: "tap", d: 0.55, rect: { x: 60, y: 1340, w: 960, h: 130 }, r: 44 } },
    { at: BACK2, render: (t) => pair(t, 3), enter: { kind: "pull", d: 0.6, rect: { x: 60, y: 1080, w: 960, h: 420 } } },
  ];
  // sound: one cue per on-screen action (transitions and headline landings are added by audio/score.py)
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [SWAP + 0.05, "pop-soft"], [SWAP + 0.2, "card-rise"], [SWAP + 0.4, `typing:${Math.max(0.5, T.swap - 0.1 - SWAP).toFixed(2)}`], [T.swap + 0.1, "pop-soft"], [T.swap + 0.22, "pop-soft"],
    [T.who - 0.1, "tick-soft"], [T.same, "measure-draw-x2"],
    [TAPA + 0.15, "tick-ripple"], [T.a - 0.2, "card-fold"], [T.a + 0.25, "muted-stop"], [TAPB - 0.9, "notif"],
    [T.fuel - 0.1, "pop-soft"], [T.garage - 0.1, "check"], [T.contrib - 0.1, "check"], [T.dated - 0.15, "card-rise"],
    [T.install - 0.1, "shutter"], [T.install + 0.25, "shutter"], [T.now - 0.1, "slide-soft"],
    [BACK2 + 0.3, "chip-fade"], [T.call, "tick-soft"], [ctaT, "cta-pop"],
  ];
  // music: Shop B's reply lands in silence; the music returns as the build page opens
  const music = { bpm: 104, root: 50, mode: "major", style: "warm", cut: TAPB - 1.0, ret: TAPB };
  return { shots, heads, sfx, music };
}
