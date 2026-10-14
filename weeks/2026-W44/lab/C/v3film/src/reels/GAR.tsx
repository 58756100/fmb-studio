// @ts-nocheck
// C3-GAR "You never told me" (garages). A split-flap week board carries the story (events, not a clock);
// the record is shown on the shop's flat counter monitor, turned toward the customer. No phone, no thread.
// remocn (all new to the visual bank): caption-split-flap (board engine), staggered-fade-up (monitor entry),
// micro-scale-fade (chips, pills), caption-dim-progress (subtitles). Camera: hard punch-in/out only.
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, LINE, clamp, lerp, seg, eo, eio, sp, Cut, Canvas, Guides } from "../lib/core";
import { FlapBoard, staggeredFadeUp, microScaleFade, Captions } from "../lib/remocn";
import { IMG, NAMES, WEEP, Photo, CounterBell } from "../assets";
import TL from "../timeline/C3-GAR.json";

const E = TL.ev;
export const DUR = TL.duration;
const COUNTER = 1170;           // counter top line (screen y, wide shot)
const BOARD_TOP = 250;

// ---- counter monitor: designed at 1280x800 (screen) + 24 bezel, scaled as a whole ----
const MW = 1280 + 48, MH = 800 + 48, STAND = 90;
const Entry = ({ t }) => {
  const f = (i, at) => staggeredFadeUp(t, at, 0, 0.1, 30);
  return <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: "Inter, sans-serif" }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: SOFT, borderBottom: `1px solid ${LINE}`, fontSize: 28, fontWeight: 500, color: GREY, ...f(0, E.eHeader) }}>
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="2" strokeLinecap="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2" /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" /></svg>fuelmybuild.com/okafor/r34</span>
      <span>Okafor's R34 · Build log</span>
    </div>
    <div style={{ position: "absolute", left: 48, top: 92, fontSize: 76, fontWeight: 650, letterSpacing: "-.035em", lineHeight: 1.05, ...f(1, E.eTitle) }}>Oil weep at head gasket</div>
    <div style={{ position: "absolute", left: 48, top: 188, display: "flex", alignItems: "center", gap: 16, fontSize: 62, fontWeight: 600, letterSpacing: "-.02em", ...f(2, E.eDate) }}>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.8" strokeLinecap="round"><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>Tue, Oct 20</div>
    <div style={{ position: "absolute", left: 48, top: 286, ...f(3, E.ePhoto) }}>
      <Photo path={IMG.r34WeepPhoto} name="c3-r34-head-weep.jpg" desc="Inline-six, head-to-block seam, thin oil weep along the gasket line" w={640} h={480} r={18} />
    </div>
    <div style={{ position: "absolute", left: 724, top: 300, width: 508, padding: "30px 32px", borderRadius: 30, background: SOFT, ...f(4, E.eChip) }}>
      <div style={{ fontSize: 60, fontWeight: 600, color: GREY, lineHeight: 1.1 }}>logged by</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
        <div style={{ width: 76, height: 76, borderRadius: 38, background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700 }}>G</div>
        <div style={{ fontSize: 76, fontWeight: 650, letterSpacing: "-.03em" }}>Gus</div>
      </div>
      <div style={{ fontSize: 60, fontWeight: 600, color: GREY, lineHeight: 1.1, marginTop: 18 }}>{NAMES.garage}</div>
    </div>
  </div>;
};
const Monitor = ({ t, x, y, k, rotY, entry = true }) => {
  // x,y = top-left of the bezel on screen; k = scale; rotY in degrees (180 = back to camera)
  const back = Math.cos(rotY * Math.PI / 180) < 0;
  return <div style={{ position: "absolute", left: x, top: y, width: MW, height: MH + STAND, transformOrigin: "0 0", transform: `scale(${k})`, zIndex: 30 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH + STAND, transformStyle: "preserve-3d", transform: `perspective(2600px) rotateY(${rotY}deg)` }}>
      {/* stand */}
      <div style={{ position: "absolute", left: MW / 2 - 70, top: MH - 4, width: 140, height: STAND - 16, background: back ? "#3A3A3C" : "#48484A" }} />
      <div style={{ position: "absolute", left: MW / 2 - 220, top: MH + STAND - 22, width: 440, height: 22, borderRadius: 11, background: "#2C2C2E" }} />
      {back ? <div style={{ position: "absolute", inset: `0 0 ${STAND}px 0`, borderRadius: 26, background: "linear-gradient(180deg,#3A3A3C,#232325)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.06)" }}>
        <div style={{ position: "absolute", left: "38%", right: "38%", top: "34%", bottom: "34%", borderRadius: 18, background: "rgba(255,255,255,.05)" }} /></div>
        : <div style={{ position: "absolute", inset: `0 0 ${STAND}px 0`, borderRadius: 26, background: "#111113", padding: 24 }}>
          <div style={{ position: "relative", width: 1280, height: 800, borderRadius: 8, overflow: "hidden", background: "#fff" }}>{entry ? <Entry t={t} /> : null}</div>
        </div>}
    </div>
  </div>;
};

const Pill = ({ t, a, b, text, top }) => {
  const st = microScaleFade(t, a, b); if (t < a - 0.01 || t > b + 0.3) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", zIndex: 70 }}>
    <div style={{ height: 88, padding: "0 36px", borderRadius: 44, background: "#fff", display: "flex", alignItems: "center", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 10px 26px -16px rgba(0,0,0,.3)", ...st }}>{text}</div>
  </div>;
};

export const GAR = ({ t, check }) => {
  // ---- camera: hard 1-frame punch-in 1.8-5.0, slow push into the photo 16-18.8, drift to the car 21.6-24, home by 24.8
  let cs = 1, cox = 540, coy = BOARD_TOP, cty = 0;
  if (t >= E.punchIn && t < E.punchOut) { cs = 1.16; cox = 540; coy = BOARD_TOP - 40; }
  const push = eio(seg(t, E.pushPhoto, E.pushPhoto + 2.8)) * (1 - eio(seg(t, E.monBack, E.monBack + 0.6)));
  const drift = eio(seg(t, E.drift, E.drift + 1.6)) * (1 - eio(seg(t, E.camHome, E.camHome + 0.8)));
  // monitor geometry
  const kC = 600 / MW, kF = 900 / MW;
  const slide = eo(seg(t, E.monSlide, E.monSlide + 0.9));
  const turn = eio(seg(t, E.monTurn, E.monTurned));
  const fill = eio(seg(t, E.monFill, E.monFill + 0.55));
  const back = eio(seg(t, E.monBack, E.monBack + 0.8));
  const out = eio(seg(t, E.monOut, E.monOut + 0.6));
  const counterY = COUNTER - (MH + STAND) * kC; // top when standing on the counter
  let mx = lerp(-700, 40, slide), my = counterY, mk = kC, mr = 180 - 180 * turn;
  mx = lerp(mx, (1080 - MW * kF) / 2, fill); my = lerp(my, 672, fill); mk = lerp(mk, kF, fill);
  mx = lerp(mx, -60, back); my = lerp(my, counterY, back); mk = lerp(mk, kC, back); mr = lerp(mr, -58, back);
  mx = lerp(mx, -760, out);
  const showMon = t >= E.monSlide && t < E.monOut + 0.65;
  // push target: the gasket line in the photo (photo at 48,286 + 24 bezel inside the monitor)
  const px = mx + (24 + 48 + 640 * WEEP.x) * mk, py = my + (24 + 286 + 480 * WEEP.y) * mk;
  if (push > 0) { cs = 1 + 0.06 * push; cox = px; coy = py; }
  if (drift > 0) { cs = 1 + 0.08 * drift; cox = 600; coy = 900; }
  // props
  const ding = t > E.ding ? Math.exp(-(t - E.ding) * 22) : 0;
  const bellX = lerp(790, 905, eio(seg(t, E.bellAside, E.bellAside + 0.5)) * (1 - eio(seg(t, E.bellBack, E.bellBack + 0.5))));
  const blockIn = t < E.blockOut ? eo(seg(t, E.block, E.block + 0.7)) : 1 - ei2(seg(t, E.blockOut, E.blockOut + 0.6));
  const blockX = lerp(1120, 560, blockIn), blockRot = (1 - blockIn) * 10;
  const chipGrey = eio(seg(t, E.chipGrey, E.chipGrey + 0.6)) * (1 - eio(seg(t, E.chipRed, E.chipRed + 0.4)));
  const chipBounce = t > E.chipBounce ? Math.exp(-(t - E.chipBounce) * 9) * Math.sin((t - E.chipBounce) * 30) * 10 : 0;
  const chipBg = `rgb(${Math.round(lerp(244, 229, chipGrey))},${Math.round(lerp(48, 229, chipGrey))},${Math.round(lerp(52, 234, chipGrey))})`;
  return <Canvas>
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${cox}px ${coy}px`, transform: `scale(${cs})` }}>
      {/* the board */}
      <div style={{ position: "absolute", left: 0, right: 0, top: BOARD_TOP, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <FlapBoard t={t} states={TL.board} initial={["NEVER TOLD ME", "", "", ""]} rows={4} cols={14} fw={60} fh={86} gap={4} rgap={8} pad={18} />
      </div>
      {/* R34 on its tile */}
      <div style={{ position: "absolute", left: 60, width: 960, top: 712, height: 400, borderRadius: 48, background: SOFT, zIndex: 2 }} />
      <Cut img={IMG.r34} x={110} y={768} w={860} z={3} />
      <div style={{ position: "absolute", left: 104, top: 676 + chipBounce, zIndex: 25, height: 80, padding: "0 30px", borderRadius: 40, background: chipBg, color: chipGrey > 0.5 ? GREY : "#fff", display: "flex", alignItems: "center", fontSize: 44, fontWeight: 600, letterSpacing: "-.015em", boxShadow: "0 8px 20px -14px rgba(0,0,0,.4)" }}>Head gasket · $1,850</div>
      {/* counter */}
      <div style={{ position: "absolute", left: 0, right: 0, top: COUNTER, height: 420, background: "linear-gradient(180deg,#EDEDF0,#F7F7F9 30%,#FFFFFF)", borderTop: "3px solid #D1D1D6", zIndex: 4 }} />
      {/* engine block on its stand, rolled in on the counter */}
      {blockIn > 0 ? <Cut img={IMG.block} x={blockX} y={COUNTER - 214} w={220} rot={blockRot} z={6} /> : null}
      {/* brass bell */}
      <div style={{ position: "absolute", left: bellX, top: COUNTER - 156 + 4, zIndex: 8 }}><CounterBell w={200} squash={ding} /></div>
      {showMon ? <Monitor t={t} x={mx} y={my} k={mk} rotY={mr} /> : null}
    </div>
    <Pill t={t} a={TL.labels[0].a} b={TL.labels[0].b} text={TL.labels[0].text} top={1320} />
    <Pill t={t} a={TL.labels[1].a} b={TL.labels[1].b} text={TL.labels[1].text} top={1240} />
    <GarCTA t={t} />
    <Captions t={t} vo={TL.vo} style="dim" />
    {check ? <Guides /> : null}
  </Canvas>;
};
const ei2 = p => p * p;
// CTA sits on the counter front (the board holds the top band and must read NEVER TOLD ME for the loop)
const GarCTA = ({ t }) => {
  const a = E.ctaIn, out = E.ctaOut; const pout = 1 - eo(seg(t, out, out + 0.25)); if (t < a || pout <= 0) return null;
  const w = i => { const p = eo(seg(t, a + 0.15 + i * 0.1, a + 0.55 + i * 0.1)); return { opacity: p * pout, transform: `translateY(${(1 - p) * 24}px)` }; };
  return <div style={{ position: "absolute", left: 60, right: 60, top: 1190, zIndex: 80, textAlign: "center" }}>
    <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.02, fontVariationSettings: '"opsz" 32', ...w(0) }}>Log every find.</div>
    <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-.025em", color: RED, marginTop: 10, ...w(1) }}>fuelmybuild.com</div>
    <div style={{ fontSize: 32, fontWeight: 500, color: GREY, marginTop: 6, ...w(2) }}>Illustrative story</div>
  </div>;
};
