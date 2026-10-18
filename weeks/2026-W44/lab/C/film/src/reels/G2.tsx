// @ts-nocheck
// G2 v2 · Show me one you've done. Lead hook A. 22.5 s. Pure function of t; events from timeline/G2.json.
import React from "react";
import { Img } from "remotion";
import TL from "../../../timeline/G2.json";
import { IMG, BRANDS } from "../assets";
import { RED, INK, GREY, SOFT, clamp, lerp, seg, eo, eio, sp, Cut, Chip, Headline, Captions, Icon, StatusBar, Device, TypingDots, Typewriter, Skeleton, Shots, TR, Studio, Cam, Guides, src } from "../lib/core";
import { OnLift } from "./C1";

const E = TL.ev;
export const G2_DUR = TL.dur;

// ---------- frame-0 layout (locked) ----------
const PH = { w: 440, y: 545, L: 65, R: 575 };
const NAMES = ["Redline Works", "Halvorsen Auto"];
const MONO = ["R", "H"];
const E30_0 = { x: 345, y: 1172, w: 390 }; // the E30 on the seam
const Q = "Show me an E30 you’ve done.";
const A = "We do these all the time.";

const Mono = ({ m, s = 34 }) => <div style={{ width: s, height: s, borderRadius: s * .28, flex: "none", background: INK, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: s * .42, letterSpacing: "-.04em" }}>{m}</div>;
const Tile = ({ img, h = 132 }) => <div style={{ position: "relative", height: h, overflow: "hidden", background: "linear-gradient(160deg,#F7F7F9,#E9E9EE)" }}><Img src={src(img)} style={{ position: "absolute", left: "6%", top: "6%", width: "88%", height: "88%", objectFit: "contain" }} /></div>;

// generic photo-grid profile (not a real platform's chrome). One component, instanced twice.
const GridScreen = ({ i }) => (
  <div className="ios" style={{ background: "#fff" }}><StatusBar />
    <div style={{ position: "absolute", top: 70, left: 18, right: 18, display: "flex", alignItems: "center", gap: 14 }}>
      <Mono m={MONO[i]} s={66} /><div style={{ flex: 1 }}><div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.02em" }}>{NAMES[i]}</div><div style={{ fontSize: 17, color: "rgba(60,60,67,.6)" }}>Auto shop · 248 posts</div></div></div>
    <div style={{ position: "absolute", top: 162, left: 18, right: 18, fontSize: 18, lineHeight: 1.3 }}>Swaps · tuning · fabrication.<br /><span style={{ color: "rgba(60,60,67,.6)" }}>DM to book.</span></div>
    <div style={{ position: "absolute", top: 240, left: 18, right: 18, display: "flex", gap: 8 }}><div className="pillbtn gray" style={{ flex: 1, height: 40, fontSize: 17 }}>Follow</div><div className="pillbtn gray" style={{ flex: 1, height: 40, fontSize: 17 }}>Message</div></div>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
      {Array.from({ length: 12 }, (_, k) => <Tile key={k} img={IMG.grid[(k * 3 + Math.floor(k / 3)) % 4]} />)}
    </div>
  </div>
);
// DM thread (generic messaging UI, not Instagram). msgs bottom-anchored; each msg has an `at` time for its pop-in.
const Bubble = ({ m, t }) => {
  const p = m.at != null ? sp(t, m.at, 260, 20) : 1; if (p <= 0) return null;
  const st = { alignSelf: m.me ? "flex-end" : "flex-start", transform: `scale(${0.7 + 0.3 * p})`, opacity: clamp(p * 2), transformOrigin: m.me ? "100% 100%" : "0% 100%" };
  if (m.img) return <div style={{ ...st, width: 250, height: 170, borderRadius: 22, overflow: "hidden", background: "linear-gradient(160deg,#F7F7F9,#E4E4EA)", position: "relative", flex: "none" }}><Img src={src(m.img)} style={{ position: "absolute", left: "5%", top: "8%", width: "90%", height: "84%", objectFit: "contain" }} /></div>;
  if (m.typing) return <div style={st}><TypingDots t={t} on={m.on} s={2} /></div>;
  if (m.link) return <div style={{ ...st, width: 320, borderRadius: 22, overflow: "hidden", background: "#E9E9EB", flex: "none" }}>
    <div style={{ position: "relative", height: 170, background: "linear-gradient(160deg,#F2F2F5,#E3E3E8)" }}><Img src={src(IMG.e30)} style={{ position: "absolute", left: "6%", top: "10%", width: "88%", height: "80%", objectFit: "contain" }} /></div>
    <div style={{ padding: "12px 16px 14px" }}><div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.015em", lineHeight: 1.2 }}>E30 M50 swap · Halvorsen Auto</div><div style={{ fontSize: 17, color: "rgba(60,60,67,.65)", marginTop: 3 }}>fuelmybuild.com/halvorsen/e30-swap</div></div></div>;
  return <div style={{ ...st, maxWidth: 330, background: m.me ? "#0A84FF" : "#E9E9EB", color: m.me ? "#fff" : "#000", borderRadius: 24, padding: "12px 18px", fontSize: 27, lineHeight: 1.22, letterSpacing: "-.015em", flex: "none" }}>{m.text}</div>;
};
const ChatScreen = ({ i, t, msgs, status = null, statusAt = 0, statusStyle = {}, bottom = 96 }) => (
  <div className="ios" style={{ background: "#fff" }}><StatusBar />
    <div style={{ position: "absolute", top: 54, left: 0, right: 0, height: 112, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderBottom: ".5px solid rgba(60,60,67,.18)", background: "rgba(249,249,249,.96)", zIndex: 5, paddingTop: 6 }}>
      <div style={{ position: "absolute", left: 14, top: 22 }}><Icon n="chevL" s={24} c="#0A84FF" sw={2.4} /></div><Mono m={MONO[i]} s={52} /><div style={{ fontSize: 17, fontWeight: 600 }}>{NAMES[i]}</div></div>
    <div style={{ position: "absolute", top: 180, left: 14, right: 14, bottom, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
      {msgs.map((m, k) => <Bubble key={k} m={m} t={t} />)}
      {status && t >= statusAt ? <div style={{ alignSelf: status.left ? "flex-start" : "flex-end", fontSize: 18, fontWeight: 600, color: "rgba(60,60,67,.6)", marginTop: -2, opacity: eo((t - statusAt) / .25), ...statusStyle }}>{status.text}</div> : null}
    </div>
    <div style={{ position: "absolute", left: 14, right: 14, bottom: 34, height: 46, display: "flex", alignItems: "center", gap: 10 }}><div className="gbtn" style={{ width: 40, height: 40, background: "rgba(120,120,128,.12)" }}><Icon n="plus" s={20} c="#000" sw={2} /></div><div style={{ flex: 1, height: 42, borderRadius: 21, border: "1px solid rgba(60,60,67,.18)", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: "rgba(60,60,67,.6)" }}>Message</div></div>
  </div>
);

// mirrored flip: rotateY through 90 degrees, content swaps at the midpoint
const flipAngle = (t, at, dur = 0.32) => { const p = seg(t, at, at + dur); return p <= 0 || p >= 1 ? 0 : p < .5 ? eio(p * 2) * 90 : -90 + eio((p - .5) * 2) * 90; };
const Phone = ({ i, t, children, ang = 0, op = 1, glitch = 0 }) => (
  <div style={{ position: "absolute", inset: 0, transform: `perspective(2200px) rotateY(${ang}deg)`, transformOrigin: `${(i ? PH.R : PH.L) + PH.w / 2}px 1000px`, opacity: op, zIndex: 10 }}>
    <Device x={i ? PH.R : PH.L} y={PH.y} w={PH.w} z={10} style={glitch ? { filter: "drop-shadow(5px 0 0 rgba(244,48,52,.55)) drop-shadow(-5px 0 0 rgba(10,132,255,.55))", transform: "translateX(4px)" } : {}}>{children}</Device>
  </div>
);
const NameChips = ({ op = 1 }) => <>{[0, 1].map(i => <Chip key={i} x={(i ? PH.R : PH.L) + PH.w / 2} y={466} h={62} fs={29} z={30} op={op}>{NAMES[i]}</Chip>)}</>;

// rgb-glitch-text (remocn, rebuilt): three offset copies jitter for a few frames
const Glitch = ({ t, at, children, dur = 0.12 }) => {
  const on = t >= at && t < at + dur; const j = on ? (Math.floor((t - at) * 30) % 2 ? 1 : -1) * 4 : 0;
  return <span style={{ position: "relative", display: "inline-block" }}>
    {on ? <><span style={{ position: "absolute", left: j, top: 0, color: "rgba(244,48,52,.8)" }}>{children}</span><span style={{ position: "absolute", left: -j, top: 0, color: "rgba(10,132,255,.8)" }}>{children}</span></> : null}
    <span style={{ position: "relative" }}>{children}</span></span>;
};

// ---------- headlines ----------
const HEADS = [
  { a: 0, b: 1.72, lines: [{ text: "Nine grand." }, { text: "Which shop?" }], at: [E.w_nine, E.w_grand, E.w_which, E.w_shop] },
  { a: 1.95, b: 4.9, lines: [{ text: "Same feed." }, { text: "Same reply." }], at: [2.2, 2.35, 2.55, 2.7] },
  { a: 5.1, b: 7.85, lines: [{ text: "Not one" }, { text: "E30." }], at: [7.0, 7.12, 7.3] },
  { a: 8.1, b: 10.35, lines: [{ text: "Typing…" }], at: [9.3] },
  { a: 10.65, b: 12.9, lines: [{ text: "One link." }], at: [11.15, 11.3] },
  { a: 13.15, b: 16.35, lines: [{ text: "Same car." }, { text: "Their work." }], at: [13.4, 13.55, E.attrLand - .1, E.attrLand] },
  { a: 16.65, b: 19.35, lines: [{ text: "Shop one:" }, { text: "Seen." }], at: [18.3, 18.45, E.seen] },
];
const Heads = ({ t }) => { const h = HEADS.find(h => t >= h.a && t < h.b + 0.3); return h ? <Headline t={t} lines={h.lines} at={h.at} out={h.b} top={h.lines.length > 1 ? 244 : 300} size={88} /> : null; };

const CTA = ({ t }) => {
  if (t < E.ctaHead - 0.1) return null;
  const out = seg(t, E.textOut, E.textOut + 0.33); if (out >= 1) return null;
  const u = eo((t - E.ctaUrl) / 0.35), il = eo((t - E.ctaUrl - 0.25) / 0.35);
  return <div style={{ opacity: 1 - out }}>
    <Headline t={t} lines={[{ text: "Show your work", size: 84 }]} at={[E.ctaHead, E.ctaHead + .15, E.ctaHead + .3]} top={226} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontSize: 58, fontWeight: 600, letterSpacing: "-.025em", color: RED, opacity: u, transform: `translateY(${(1 - u) * 14}px)`, zIndex: 31 }}>fuelmybuild.com</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 398, textAlign: "center", fontSize: 34, fontWeight: 500, color: GREY, opacity: il, zIndex: 31 }}>Illustrative story</div>
  </div>;
};

// the E30 on the seam + the $9,000 chip and the two arrows (hook)
const SeamCar = ({ t }) => {
  // in frame 0 the car already sits on the seam; hook = a hop and landing; it leaves with the DM flip and drops back for the loop
  const hop = t < E.flip1 ? Math.sin(Math.PI * seg(t, E.hop, E.hopLand)) * 70 : 0;
  const leave = eio(seg(t, E.flip1 - .05, E.flip1 + .3));
  const back = sp(t, E.flip2 + .05, 190, 17);
  let y = E30_0.y - hop, op = 1, s = 1;
  if (t >= E.flip1 - .05 && t < E.flip2) { y = E30_0.y + 60 * leave; op = 1 - leave; s = 1 - .15 * leave; }
  if (t >= E.flip2) { y = lerp(E30_0.y - 520, E30_0.y, back); op = clamp((t - E.flip2) / .12); }
  if (op <= 0) return null;
  const squash = t > E.hopLand && t < E.hopLand + .2 && t < E.flip1 ? 1 - .05 * Math.sin(Math.PI * seg(t, E.hopLand, E.hopLand + .2)) : 1;
  return <Cut img={IMG.e30} x={E30_0.x} y={y} w={E30_0.w} op={op} s={s * squash} z={40} />;
};
const HookChip = ({ t }) => {
  const p = sp(t, E.chipLand - .15, 240, 17), out = eio(seg(t, E.flip1 - .05, E.flip1 + .25));
  if (p <= 0 || out >= 1) return null;
  return <Chip y={1074} h={78} fs={38} z={41} op={clamp(p * 2) * (1 - out)} s={(0.6 + 0.4 * p) * (1 - .2 * out)}><span style={{ color: RED }}>$9,000</span><span>engine swap</span></Chip>;
};
const Arrows = ({ t }) => {
  const p = eo(seg(t, E.arrows, E.arrows + .25)), o = 1 - seg(t, E.flip1 - .2, E.flip1);
  if (p <= 0 || o <= 0) return null;
  return <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, zIndex: 42, opacity: o }}>
    {[[-1, 330], [1, 750]].map(([d, x2], k) => { const x1 = 540 + d * 200, y1 = 1100, y2 = 990; const L = 260;
      return <g key={k}><path d={`M${x1},${y1} Q${(x1 + x2) / 2},${y1 - 10} ${x2},${y2}`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
        {p > .85 ? <path d={`M${x2 - d * 6},${y2 + 30} L${x2},${y2} L${x2 + d * 30},${y2 + 10}`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /> : null}</g>; })}
  </svg>;
};

// right-thread link + build page
const BuildEntry = ({ t }) => {
  const ph = sp(t, E.photoLand - .2, 200, 19), at = sp(t, E.attrLand - .15, 260, 18), rw = [0, 1, 2].map(k => sp(t, E.rows + k * .12, 220, 20));
  return <div className="ios" style={{ background: "#F2F2F7" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 116, zIndex: 19, background: "linear-gradient(180deg,rgba(242,242,247,1) 70%,rgba(242,242,247,0))" }} />
    <StatusBar />
    <div style={{ position: "absolute", top: 58, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20 }}>
      <div className="gbtn glass"><Icon n="chevL" s={20} c="#000" sw={2.2} /></div>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 600 }}>E30 M50 swap</div><div style={{ fontSize: 12, color: "rgba(60,60,67,.6)", display: "flex", alignItems: "center", gap: 3 }}><Icon n="link" s={11} c="rgba(60,60,67,.6)" sw={2} />fuelmybuild.com/halvorsen/e30-swap</div></div>
      <div className="gbtn glass"><Icon n="share" s={20} c="#000" /></div></div>
    <div style={{ position: "absolute", top: 110, left: 12, right: 12, background: "#fff", borderRadius: 26, padding: "16px 18px 16px" }}>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.12 }}>Jun 11 · M50 in,<br />harness wired</div>
      <div style={{ marginTop: 12 }}><Skeleton t={t} at={E.photoLand - .15} w={354} h={172}><OnLift car={IMG.e30} w={354} h={172} /></Skeleton></div>
      <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 16px", borderRadius: 20, background: SOFT, color: GREY, fontSize: 21, fontWeight: 600, opacity: clamp(at * 1.6), transform: `scale(${.85 + .15 * at})`, transformOrigin: "0 50%" }}><Mono m="H" s={24} />Work by Halvorsen Auto</div>
    </div>
    <div style={{ position: "absolute", top: 462, left: 12, right: 12 }}>
      {[["Engine mounts", BRANDS.mounts, IMG.mounts], ["Wiring harness", BRANDS.harness, IMG.harness], ["Clutch", BRANDS.clutch, IMG.engine]].map(([n, b, im], k) =>
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 14px", height: 38, background: "#fff", borderRadius: 14, marginBottom: 4, opacity: clamp(rw[k] * 1.4), transform: `translateY(${(1 - rw[k]) * 16}px)` }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: SOFT, position: "relative", overflow: "hidden" }}><Img src={src(im)} style={{ position: "absolute", inset: "8%", width: "84%", height: "84%", objectFit: "contain" }} /></div>
          <div style={{ fontSize: 17, color: GREY, fontWeight: 500 }}>{n} · {b}</div></div>)}
    </div>
  </div>;
};

export const G2 = ({ t, check = false }) => {
  // left and right thread contents as functions of t
  const leftMsgs = [{ text: A }, { me: true, text: Q, at: E.send - .05 }, { img: IMG.beauty[0], at: E.ping1 }, { img: IMG.beauty[1], at: E.ping2 }, { img: IMG.beauty[2], at: E.ping3 }, { img: IMG.beauty[3], at: E.ping4 }, { img: IMG.beauty[4], at: E.ping5 }];
  const dotsOn = (t >= E.dotsOn1 && t < E.dotsOff1) || (t >= E.dotsOn2 && t < E.dotsOff2) || t >= E.dotsOn3;
  const rightMsgs = [{ text: A }, { me: true, text: Q, at: E.send - .05 }, ...(t >= E.dotsOn1 ? [{ typing: true, on: dotsOn }] : [])];
  const typingP = seg(t, E.typeStart - .25, E.typeStart);
  const split = seg(t, E.split, E.send);
  const dim = 1 - .62 * clamp(seg(t, 2.1, 2.4) - seg(t, E.split, E.send));
  const shots = [
    // 0–10.5: the mirrored split (grids → DMs), frame-locked until the crack
    { a: 0, b: E.whip, out: TR.whipR(0.45), render: t => {
      const a1 = flipAngle(t, E.flip1);
      const showChat = t >= E.flip1 + .16;
      return <Cam s={1 + .015 * seg(t, 0, 10.5)} origin="50% 55%">
        <NameChips />
        {[0, 1].map(i => <Phone key={i} i={i} t={t} ang={a1} op={dim} glitch={i === 1 && t >= E.crack && t < E.crack + .1}>
          {showChat ? <ChatScreen i={i} t={t} msgs={i ? rightMsgs : leftMsgs} status={i ? { text: <Glitch t={t} at={E.crack}>Delivered</Glitch> } : null} statusAt={E.send + .2} /> : <GridScreen i={i} />}
        </Phone>)}
        {/* Jen types once at the centre, then the bubble splits into both threads */}
        {typingP > 0 && t < E.send ? <>
          {[0, 1].map(k => { const tx = lerp(0, (k ? 1 : -1) * 250, eio(split)), ty = lerp(0, 330, eio(split)), sc = lerp(1, .42, eio(split));
            return (k === 0 || split > 0) ? <div key={k} style={{ position: "absolute", left: 120, right: 120, top: 760, zIndex: 45, opacity: typingP * (1 - seg(t, E.send - .08, E.send)), transform: `translate(${tx}px,${ty}px) scale(${sc})`, display: "flex", alignItems: "flex-end", gap: 18 }}>
              {split <= 0 ? <Img src={src(IMG.jenAvatar)} style={{ width: 110, height: 118, flex: "none" }} /> : null}
              <div style={{ flex: 1, background: "#0A84FF", color: "#fff", borderRadius: "56px 56px 18px 56px", padding: "36px 44px", fontSize: 60, fontWeight: 500, letterSpacing: "-.025em", lineHeight: 1.12, boxShadow: "0 30px 60px -30px rgba(10,132,255,.5)" }}><Typewriter t={t} text={Q} at={E.typeStart} cps={Q.length / (E.typeEnd - E.typeStart)} caret={split <= 0} /></div>
            </div> : null; })}
          {split <= 0 ? <div style={{ position: "absolute", left: 250, top: 700, zIndex: 45, fontSize: 32, fontWeight: 600, color: GREY, opacity: typingP }}>Jen · green E30</div> : null}
        </> : null}
      </Cam>; } },
    // 10.5–13: whip-pan to shop two; one link springs in
    { a: E.whip, b: E.push, out: TR.push(0.5), render: t => <Cam s={1 + .02 * seg(t, 10.5, 13)}>
      <Device x={190} y={450} w={700} z={10}><ChatScreen i={1} t={t} msgs={[{ text: A }, { me: true, text: Q }, { link: true, at: E.linkLand - .18 }]} status={{ text: "Delivered" }} statusAt={-1} bottom={300} /></Device>
    </Cam> },
    // 13–16.5: the build page takes the full frame; one legible entry
    { a: E.push, b: E.splitBack, out: TR.zoom(0.35), render: t => <Cam s={1 + .02 * seg(t, 13, 16.5)}>
      <Device x={190} y={450} w={700} z={10}><BuildEntry t={t} /></Device>
    </Cam> },
    // 16.5–22.5: split returns; booking DM vs "Seen"; then both snap back to the frame-0 grids (CTA over it)
    { a: E.splitBack, b: TL.dur + 1, render: t => {
      const a2 = flipAngle(t, E.flip2); const grids = t >= E.flip2 + .16;
      return <Cam s={lerp(1.012, 1, eio(seg(t, E.flip2, E.flip2 + .6)))} origin="50% 55%">
        <NameChips />
        {[0, 1].map(i => <Phone key={i} i={i} t={t} ang={a2}>
          {grids ? <GridScreen i={i} /> : i
            ? <ChatScreen i={1} t={t} msgs={[{ me: true, text: Q }, { link: true }, { me: true, text: "Booking you. Monday drop-off?", at: E.bookMe - .15 }, { text: "Monday works.", at: E.bookThem - .15 }]} />
            : <ChatScreen i={0} t={t} msgs={[{ me: true, text: Q }, { img: IMG.beauty[3] }, { img: IMG.beauty[4] }]} status={{ text: "Seen", left: true }} statusAt={E.seen - .1} statusStyle={{ fontSize: 30, color: GREY }} />}
        </Phone>)}
      </Cam>; } },
  ];
  return <Studio>
    <Shots t={t} shots={shots} />
    <SeamCar t={t} /><HookChip t={t} /><Arrows t={t} />
    <Heads t={t} /><CTA t={t} />
    <Captions t={t} cues={TL.vo} />
    {check ? <Guides /> : null}
  </Studio>;
};
