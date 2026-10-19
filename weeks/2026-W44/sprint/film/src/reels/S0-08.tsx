// @ts-nocheck
// S0-08 (lane 0, garages): "Film Strip". Dolores (E04) runs the shop; Pete's blue WRX (A28) is in for a three-day
// coilover job and Pete calls every day at four, twenty minutes a call. Last job: three calls, same answer, "it's on
// the lift". This time she sent one link at drop-off and kept shooting: wheel off, coilovers in, alignment, every frame
// dated on the car's page. Day two, four o'clock, nothing rings. Pete (E08): "Saw the alignment. I'll grab it at five."
// Device: a 35 mm film strip IS the job record. Frames are log entries and the edge print is each entry's date and
// time. The old way rewinds as a grey roll of blank, unexposed frames printed "4:00 PM"; it snaps, and a colour roll
// threads in whose leader is the link. Look: house white, black film base, amber edge print (IBM Plex Mono), Inter.
// Transitions: strip whip-in (hook), portal out of frame 1 into the bay, pull-back into the strip + rewind (colour
// drains to grey), snap (grey roll breaks), leader carry (link card slides off right, whip carry to Pete's side),
// scrub, portal into the DAY 2 frame, pull-back to the strip in front of Pete, rewind to frame 1 under the CTA (loop).
// remocn (ported): whip-pan with directional blur, typewriter (link leader), grayscale drain, period-drop.
// New vs S0-14: strip scrub with sprocket-locked frames, grey drain.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed, mbx } from "../kit";
import { Full, Scrim, glass, font } from "./s0kit";
import { Studio, Avatar } from "./laneB";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
export const LIFE = 1.4;
export const BG = "#F5F5F7";
export const TEXT = { font: "Inter", weight: 650, size: 112, min: 76, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 930, top: 280, lead: 1.04 };
export const IMAGES = ["F01", "A28", "E04", "E08", "G02", "C02", "G06"];
const AMBER = "#F2A43A", MONO = "IBM Plex Mono";
const FW = 640, FH = 470, PITCH = 700, BAND = 96, SH = FH + BAND * 2; // frame, pitch, strip band, strip height
const SY = 760; // strip top

// frame pictures
const Drop = ({ t }) => <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
  <img src={src("F01")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 70%", transform: "scale(1.15)" }} />
  <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: FH }}><Cut id="A28" cx={FW * 0.47} cy={FH * 0.66} w={FW * 0.8} shadow={0.5} /><Cut id="E04" cx={FW * 0.86} cy={FH * 0.66} w={FW * 0.32} shadow={0} /></div>
</div>;
const Pic = ({ id, fx = 0.5, fy = 0.5, k = 1.08 }) => <img src={src(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `scale(${k})` }} />;
const Coils = () => <div style={{ position: "absolute", inset: 0, background: "#fff" }}><Cut id="C02" cx={FW / 2} cy={FH / 2} w={FW * 0.78} shadow={0.25} /></div>;
const Quiet = () => <div style={{ position: "absolute", inset: 0 }}><img src={src("F01")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", filter: "brightness(.85)" }} />
  <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: FH }}><Cut id="A28" cx={FW * 0.5} cy={FH * 0.5} w={FW * 0.72} shadow={0.3} /></div></div>;

// the strip: frames laid out left to right from x0; each frame { pic, print, grey }. grey 0..1 drains colour.
const Light = ({ h = 720, a = 0.92 }) => <div style={{ position: "absolute", left: 0, top: 0, width: W, height: h, zIndex: 3, background: `linear-gradient(180deg, rgba(245,245,247,${a}) 0%, rgba(245,245,247,${a * 0.8}) 50%, rgba(245,245,247,0) 100%)` }} />;
const Strip = ({ t, x0, frames, y = SY, grey = 0, blur = 0, rot = 0, s = 1, o = 1, origin = "540px 1000px", hi = -1 }) => {
  if (o <= 0.002) return null;
  const n = frames.length, len = n * PITCH + 400;
  return <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: o, transformOrigin: origin, transform: `rotate(${rot}deg) scale(${s})`, zIndex: 10 }}>
    <div style={{ position: "absolute", left: x0 - 200, top: y, width: len, height: SH, background: "#121212", filter: blur > 0.6 ? mbx(blur) : undefined, boxShadow: "0 30px 50px -30px rgba(0,0,0,.6)" }}>
      {/* sprocket holes */}
      {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: r ? SH - 46 : 18, height: 28, backgroundImage: "linear-gradient(90deg, #F5F5F7 0 26px, transparent 26px 50px)", backgroundSize: "50px 28px", opacity: 0.95, borderRadius: 4 }} />)}
      {frames.map((f, i) => { const fxp = 200 + i * PITCH + (PITCH - FW) / 2;
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: fxp, top: BAND, width: FW, height: FH, borderRadius: 10, overflow: "hidden", background: f.blank ? "#3A3A3C" : "#222",
            filter: grey > 0 || f.grey ? `grayscale(${Math.max(grey, f.grey ?? 0)}) brightness(${1 - 0.25 * Math.max(grey, f.grey ?? 0)})` : undefined, boxShadow: hi === i ? `0 0 0 8px ${RED}` : undefined }}>
            {f.blank ? <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #48484A, #2C2C2E)" }} /> : f.pic}
          </div>
          {f.print && <div style={{ position: "absolute", left: fxp, top: BAND + FH + 6, ...font(MONO, 40, f.blank ? "#9A9A9E" : AMBER, 500, { letterSpacing: "0.04em" }) }}>{f.print}</div>}
        </React.Fragment>; })}
    </div>
  </div>;
};
const frameX = (i, x0) => x0 - 200 + 200 + i * PITCH + (PITCH - FW) / 2; // left of frame i on screen
const centreX0 = (i) => 540 - FW / 2 - (i * PITCH + (PITCH - FW) / 2); // x0 that centres frame i

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    pete: at("pete"), every: at("every"), four: at("four,"), twenty: at("twenty"), three: at("three"), coil: at("coilover"), same: at("same"), its: at("it's"), lift: at("lift."),
    so: at("so"), drop: at("drop-off,"), one: at("one"), link: at("link"), kept: at("kept"), wheel: at("wheel"), coils: at("coilovers"), align: at("alignment,"), frame: at("frame"),
    dated: at("dated"), page: at("page."), day: at("day", 2), oclock: at("o'clock..."), saw: at("saw"), grab: at("grab"), five: at("five."), dm: tl.cta("dm") ?? at("dm"),
  };
  const CUT = tl.cut, BAY = CUT, OLD = T.three - 0.35, SNAP = T.so - 0.25, PETE = T.wheel - 0.3, DAY2 = T.day - 0.25, ENDS = T.saw - 0.3;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const W_ = (list) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })) });
  const hw = tl.hook;
  const hk = hook === "A" ? [{ ...W_([["Okay,", hw[0].s], ["Pete.", hw[1].s], ["Watch", hw[2].s], ["this.", hw[3].s]]), key: [2, 3] }]
    : hook === "B" ? [{ ...W_([["What", hw[0].s], ["if", hw[1].s], ["your", hw[2].s, 1], ["customer", hw[3].s, 1], ["just", hw[5].s, 1], ["watched?", hw[6].s, 1]]), key: [5] }]
    : [{ ...W_([["POV:", hw[0].s], ["you're", hw[1].s], ["the", hw[2].s], ["customer.", hw[3].s]]), hold: 0.4 }, { ...W_([["Never", hw[6].s], ["had", hw[7].s], ["to", hw[8].s], ["call.", hw[9].s]]), key: [3] }];
  const heads = [
    ...hk,
    { ...W_([["Every", T.every], ["day.", at("day", 1)], ["4", T.four], ["pm.", T.four + 0.2]]), key: [2, 3], hold: 0.5 },
    { ...W_([["That's", at("that's", 1)], ["20", T.twenty], ["minutes.", at("minutes")]]), key: [1, 2] },
    { ...W_([["Last", T.three], ["job:", T.three + 0.1], ["3", at("calls", 2)], ["calls.", at("calls", 2) + 0.1]]), key: [2, 3], hold: 1.0 },
    { ...W_([["“It's", T.its], ["on", at("on", 2)], ["the", at("the", 1)], ["lift.”", T.lift]]) , out: "down" },
    { ...W_([["One", T.one], ["link.", T.link], ["Kept", T.kept], ["shooting.", at("shooting.")]]), key: [1] },
    { ...W_([["Every", T.frame - 0.38], ["frame,", T.frame], ["dated.", T.dated]]), key: [2] },
    { ...W_([["Day", T.day], ["2.", at("two,")], ["4:00", at("four", 2)], ["pm.", T.oclock]]), hold: 1.3 },
    { ...W_([["“I'll", at("i'll")], ["grab", T.grab], ["it", at("it", 1)], ["at", at("at", 3)], ["five.”", T.five]]), key: [4] },
    { ...ctaHead(tl, "DM SHOP. / We'll load your builds.", T.dm), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // the colour roll (the WRX's page) and the old grey roll
  const ROLL = [
    { pic: <Drop />, print: "DROP-OFF · OCT 26 8:05" },
    { pic: <Pic id="G02" fx={0.4} />, print: "WHEEL OFF · 10:14" },
    { pic: <Coils />, print: "COILOVERS IN · 2:32" },
    { pic: <Pic id="G06" fx={0.55} />, print: "ALIGNMENT · OCT 27 11:48" },
    { pic: <Quiet />, print: "DAY 2 · 4:00 PM" },
  ];
  const OLDROLL = [{ blank: 1, print: "MON 4:00 PM" }, { blank: 1, print: "TUE 4:00 PM" }, { blank: 1, print: "WED 4:00 PM" }, { blank: 1, print: "" }];

  // ---------- shot 1 (hook): the strip whips in from the right and stops on frame 1
  const hookShot = (t) => {
    const stop = hook === "A" ? 0.85 : hook === "B" ? hw[hw.length - 1].s : 1.2;
    let x0;
    if (hook === "B") { const k = Math.min(3, Math.floor(seg(t, 0, stop) * 4)), p = seg(t, 0, stop) * 4 - k; x0 = centreX0(0) + (3 - k - EASE.out(clamp(p * 2))) * PITCH * 0.5 + 0; }
    else { const p = EASE.out(seg(t, 0, stop)); x0 = lerp(centreX0(0) + 700, centreX0(0), p); }
    const v = hook === "B" ? 0 : Math.abs(lerp(700, 0, EASE.out(seg(t, 0, stop))) - lerp(700, 0, EASE.out(seg(t - 1 / 30, 0, stop))));
    const z = hook === "C" ? 1 + 0.08 * EASE.io(seg(t, 0.8, CUT)) : 1;
    return <AbsoluteFill><Studio t={t}>
      <Strip t={t} x0={x0} frames={ROLL} blur={Math.min(8, v / 18)} s={z} />
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 2: the bay (frame 1 opened full screen): Dolores and the WRX; DAY 1 edge print
  const bay = (t) => {
    const d = drift(t, "bay", 5, 0.3);
    const P = spr(t - (T.four - 0.1), 200, 16);
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={BAY} t1={OLD} k0={1.1} k1={1.18} fy={0.7} dim={0.02} />
      <Light />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Cut id="A28" cx={500} cy={1250} w={1000} shadow={0.6} />
        <Cut id="E04" cx={880} cy={1240} w={420} shadow={0} />
      </div>
      {/* edge print band down the left side: this is still a film frame */}
      <div style={{ position: "absolute", left: 60, top: 1500, padding: "8px 18px", borderRadius: 12, background: "rgba(18,18,18,.85)", ...font(MONO, 40, AMBER, 500), opacity: ez(t, BAY + 0.3, 0.4) }}>DAY 1</div>
      {/* 4 PM: one red call chip pulses at the same time each day */}
      <div style={{ position: "absolute", left: 640, top: 1494, padding: "10px 24px", borderRadius: 30, background: RED, ...font("Inter", 42, "#fff", 600), transform: `scale(${P})`, opacity: clamp(P * 2) * (1 - ez(t, OLD - 0.3, 0.2)) }}>Pete · 4:00 PM</div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: back in the strip, rewinding into last job: colour drains, blank frames printed 4:00 PM
  const old = (t) => {
    const rw = EASE.io(seg(t, OLD, OLD + 0.9));
    const x0 = lerp(centreX0(0), centreX0(1) - 1200, rw) + (t > OLD + 0.9 ? -(t - OLD - 0.9) * 16 : 0);
    const g = ez(t, OLD + 0.1, 0.7);
    const frames = rw < 0.5 ? ROLL : OLDROLL;
    const blankX = centreX0(1) - 1200 - (t - OLD - 0.9) * 16;
    const snap = ez(t, SNAP - 0.05, 0.5, EASE.in);
    if (rw < 0.5) return <AbsoluteFill><Studio t={t}><Strip t={t} x0={lerp(centreX0(0), centreX0(0) + 1600, rw * 2)} frames={ROLL} grey={g} blur={rw * 10} /></Studio></AbsoluteFill>;
    const kx = track(t, { x: centreX0(0) + 900 }, [[OLD + 0.45, { x: centreX0(0) }, 0.5, EASE.out], [at("calls", 2) - 0.35, { x: centreX0(1) }, 0.45], [T.same - 0.35, { x: centreX0(2) }, 0.45], [T.its - 0.2, { x: centreX0(2) - 60 }, 1.4, EASE.io]]);
    const x1 = kx.x;
    const label = (k, t0) => { const q = spr(t - t0, 220, 16); return q > 0.01 && <div key={k} style={{ position: "absolute", left: frameX(k, x1) + FW / 2, top: SY + BAND + FH / 2, transform: `translate(-50%,-50%) scale(${q})`, opacity: clamp(q * 2) * (1 - snap),
      ...font("Inter", 44, "#D1D1D6", 600), zIndex: 20 }}>{"☎"} 20 min</div>; };
    return <AbsoluteFill><Studio t={t}>
      {/* left half falls one way, right half the other on the snap */}
      <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 50% 0 0)", transform: `translate(${-snap * 120}px, ${snap * 900}px) rotate(${-snap * 14}deg)`, transformOrigin: "540px 1000px" }}><Strip t={t} x0={x1} frames={OLDROLL} /></div>
      <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 50%)", transform: `translate(${snap * 120}px, ${snap * 900}px) rotate(${snap * 14}deg)`, transformOrigin: "540px 1000px" }}><Strip t={t} x0={x1} frames={OLDROLL} /></div>
      {label(0, T.three + 0.05)}{label(1, at("calls", 2) - 0.1)}{label(2, T.same)}
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 4: the new colour roll threads in from the left; its leader is the link; it runs off right
  const thread = (t) => {
    const inP = EASE.out(seg(t, SNAP + 0.1, SNAP + 1.3));
    const off = EASE.in(seg(t, T.kept - 0.2, PETE + 0.1));
    const lx = lerp(-900, 60, inP) + (t - SNAP) * 22 + off * 1300; // leader card left: keeps travelling right (the roll is being pulled)
    const d = drift(t, "th", 3, 0.3);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <Strip t={t} x0={lx - 4 * PITCH - 200 - 40} frames={ROLL.slice(0, 4)} />
        <div style={{ position: "absolute", left: lx, top: SY + 150 + Math.sin(t * 2.4) * 14, transform: `rotate(${Math.sin(t * 1.7) * 1.2}deg)`, width: 860, height: 340, borderRadius: 40, background: "#fff", zIndex: 12, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 30px 50px -26px rgba(0,0,0,.35)" }}>
          <div style={font("Inter", 42, GREY, 500)}>Pete's WRX · build page</div>
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 14 }}>
            <svg width={44} height={44} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke={RED} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            <Typed t={t} t0={T.one - 0.1} t1={T.link + 0.6} text="fuelmybuild.com/dolores/wrx" style={font("Inter", 46, INK, 600)} />
          </div>
          <div style={{ marginTop: 16, ...font("Inter", 40, GREY, 500), opacity: ez(t, T.drop, 0.3) }}>Sent at drop-off · 8:05</div>
        </div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 5: Pete's side: the roll scrubs under his thumb; every frame dated; stops on DAY 2 4:00 PM
  const scrub = (t) => {
    const stops = [[PETE, 0], [T.wheel + 0.05, 1], [T.coils - 0.1, 2], [T.align - 0.1, 3], [T.day - 0.6, 4]];
    let x0 = centreX0(0) + 900;
    for (const [t0, i] of stops) { const p = EASE.camera(seg(t, t0, t0 + 0.45)); if (t >= t0) x0 = lerp(x0, centreX0(i), p); }
    const cur = stops.reduce((a, [t0, i]) => (t >= t0 + 0.2 ? i : a), 0);
    const thumbX = 540 + Math.sin(t * 7) * 10, thumbOn = 1 - ez(t, T.day - 0.3, 0.3);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", left: 60, top: 560, display: "flex", alignItems: "center", gap: 18, opacity: ez(t, PETE + 0.2, 0.4) }}>
        <div style={{ width: 120, height: 80, borderRadius: 16, overflow: "hidden", position: "relative", background: "#E9EEF5" }}><Cut id="A28" cx={60} cy={42} w={112} shadow={0} /></div>
        <div><div style={font("Inter", 48, INK, 650)}>Pete's WRX</div><div style={font("Inter", 40, GREY, 500)}>fuelmybuild.com/dolores/wrx</div></div>
      </div>
      <Strip t={t} x0={x0} frames={ROLL} hi={-1} />
      {/* thumb press point that scrubs (a soft touch disc) */}
      <div style={{ position: "absolute", left: 60, top: SY + SH + 50, ...font("Inter", 42, GREY, 500), opacity: ez(t, T.page - 0.3, 0.4) }}>Logged by Dolores · Corbin Road Garage</div>
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 6: inside the DAY 2 frame: the bay, quiet; then a soft notification card arrives
  const quiet = (t) => {
    const n = spr(t - (T.saw - 0.35), 200, 18);
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={DAY2} t1={ENDS + 1} k0={1.08} k1={1.16} fy={0.65} dim={0.1} />
      <Light />
      <Cut id="A28" cx={540} cy={1200} w={900} shadow={0.5} />
      <div style={{ position: "absolute", left: 60, top: 1500, padding: "8px 18px", borderRadius: 12, background: "rgba(18,18,18,.85)", ...font(MONO, 40, AMBER, 500) }}>DAY 2 · 4:00 PM</div>
    </AbsoluteFill>;
  };
  // ---------- shot 7: Pete, relaxed, the strip in front of him on the alignment frame; rewinds to frame 1 under the CTA
  const pete = (t) => {
    const rw = EASE.camera(seg(t, T.dm + 0.6, tl.last + 0.5));
    const x0 = lerp(centreX0(3), centreX0(0), rw);
    const d = drift(t, "pt", 4, 0.3);
    const msg = spr(t - (T.saw - 0.2), 200, 18);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5), zIndex: 15 }}>
        <Cut id="E08" cx={905} cy={1190} w={330} shadow={0.25} style={{ transform: `rotate(${Math.sin(t * 0.8) * 0.8}deg)` }} />
      </div>
      <Strip t={t} x0={x0} frames={ROLL} y={SY + 20} blur={Math.abs(rw - EASE.camera(seg(t - 1 / 30, T.dm + 0.6, tl.last + 0.5))) * PITCH * 3 / 18} />
      <div style={{ position: "absolute", left: 60, top: 1462, display: "flex", alignItems: "center", gap: 16, padding: "14px 30px 14px 14px", borderRadius: 50, ...glass(0.85), zIndex: 20,
        opacity: clamp(msg * 2) * (1 - ez(t, T.dm - 0.2, 0.3)), transform: `translateY(${(1 - msg) * 40}px)` }}>
        <Avatar id="E08" size={64} face={{ x: 0.5, y: 0.08, z: 4.4 }} bg="#DCE3EE" /><span style={font("Inter", 42, INK, 600)}>Pete: Saw the alignment.</span>
      </div>
    </Studio></AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: hookShot },
    { at: BAY, render: bay, enter: { kind: "portal", d: 0.6, rect: { x: 540 - FW / 2, y: SY + BAND, w: FW, h: FH }, r: 10 } },
    { at: OLD, render: old, enter: { kind: "pull", d: 0.55, rect: { x: 540 - FW / 2, y: SY + BAND, w: FW, h: FH }, r: 10 } },
    { at: SNAP, render: thread, enter: { kind: "match" } },
    { at: PETE, render: scrub, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: DAY2, render: quiet, enter: { kind: "portal", d: 0.6, rect: { x: 540 - FW / 2, y: SY + BAND, w: FW, h: FH }, r: 10 } },
    { at: ENDS, render: pete, enter: { kind: "pull", d: 0.6, rect: { x: 540 - FW / 2, y: SY + 20 + BAND, w: FW, h: FH }, r: 10 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...(hook === "B" ? [0, 1, 2, 3].map((k) => [k * hw[hw.length - 1].s / 4 + 0.02, "tick-soft"]) : [[0.0, "whip"], [hook === "A" ? 0.6 : 0.9, "tick-ripple"]]),
    [BAY + 0.3, "label-in"], [T.four - 0.1, "chip-drop-red"], [OLD + 0.05, "tape-close"], [OLD + 0.45, "tick-ripple"],
    [T.three + 0.05, "muted-stop"], [at("calls", 2) - 0.1, "muted-stop"], [T.same, "muted-stop"], [SNAP - 0.05, "string-snap-x2"], [SNAP + 0.1, "slide-soft"],
    [T.one - 0.1, "typing:1.0"], [T.kept - 0.2, "air-glide"], [T.wheel + 0.05, "shutter"], [T.coils - 0.1, "shutter"], [T.align - 0.1, "shutter"], [T.day - 0.6, "tick-ripple"],
    [T.saw - 0.35, "notif"], [T.dm + 0.6, "air-glide-long"], [tl.last + 0.3, "tick-soft"], [ctaT, "cta-pop"],
  ];
  // music: warm groove; cuts before "Day two, four o'clock" (room tone only, nothing rings) and returns on Pete's line
  const music = { bpm: 100, root: 52, mode: "major", style: "warm", cut: T.day - 0.3, ret: T.saw - 0.05, room: "shop" };
  return { shots, heads, sfx, music };
}
