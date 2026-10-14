// @ts-nocheck
// C3-GAR "You never told me" (garages). A split-flap week board carries the story (events, not a clock);
// the record is shown on the shop's flat counter monitor, turned toward the customer. No phone, no thread.
// remocn (phase 1): caption-split-flap (board engine), staggered-fade-up (monitor entry), micro-scale-fade, caption-dim-progress.
// remocn (phase 2, always alive): lens-zoom (the punch-ins land with a lens settle), shimmer-sweep (light across the board
// and the monitor glass), caption-weight (spoken word swells), spring-scale-in (pills, per word), per-character-rise (date),
// blur-out-up (exits), typewriter (URL), trim-burst (bell ring).
import React from "react";
import { Img, staticFile } from "remotion";
import { RED, INK, GREY, SOFT, LINE, clamp, lerp, seg, eo, eio, sp, Cut, Canvas, Guides } from "../lib/core";
import { FlapBoard, staggeredFadeUp, Captions } from "../lib/remocn";
import { per, bump, spr, MBDefs, mblur, KText, Typed, TrimBurst, Sheen, sheenAt, wt, mix } from "../lib/motion";
import { IMG, NAMES, WEEP, Photo, CounterBell } from "../assets";
import TL from "../timeline/C3-GAR.json";

const E = TL.ev;
export const DUR = TL.duration;
const COUNTER = 1170;
const BOARD_TOP = 250;
// stalled THU flaps twitch (half-lift and drop back) while nobody knows: [time, column]
export const TWITCH = [[9.3, 6], [10.85, 9], [13.05, 7], [14.95, 11], [16.7, 8], [17.95, 6], [18.7, 10]];

const MW = 1280 + 48, MH = 800 + 48, STAND = 90;
const L6 = n => wt(TL, 6, n);
const Entry = ({ t, out }) => {
  const f = (at) => staggeredFadeUp(t, at, 0, 0.1, 30);
  const ph = eo(seg(t, E.ePhoto, E.ePhoto + 0.55));
  const kb = 1.12 - 0.12 * eo(seg(t, E.ePhoto, E.ePhoto + 1.0)) + 0.05 * eio(seg(t, E.ePhoto + 1.0, 21.5));
  const chip = spr(t, E.eChip, 230, 14);
  const gusPop = bump(t, L6("gus"), 0.12, 6, 16);
  return <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: "Inter, sans-serif" }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: SOFT, borderBottom: `1px solid ${LINE}`, fontSize: 28, fontWeight: 500, color: GREY, ...f(E.eHeader) }}>
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="2" strokeLinecap="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2" /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" /></svg>
        <Typed t={t} at={E.eHeader + 0.05} text="fuelmybuild.com/okafor/r34" cps={40} color={GREY} caret={GREY} /></span>
      <span>Okafor's R34 · Build log</span>
    </div>
    <div style={{ position: "absolute", left: 48, top: 92, fontSize: 76, fontWeight: 650, letterSpacing: "-.035em", lineHeight: 1.05, whiteSpace: "nowrap" }}>
      <KText t={t} text="Oil weep at head gasket" at={E.eTitle} stagger={0.07} dist={50} weight={650} seed="gt" float={0.7} out={out} />
    </div>
    <div style={{ position: "absolute", left: 48, top: 188, display: "flex", alignItems: "center", gap: 16, fontSize: 62, fontWeight: 600, letterSpacing: "-.02em" }}>
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GREY} strokeWidth="1.8" strokeLinecap="round" style={{ opacity: clamp((t - E.eDate) / 0.15), transform: `scale(${Math.min(1.05, spr(t, E.eDate, 300, 16)) + bump(t, L6("tuesday"), 0.15)}) rotate(${(1 - clamp((t - E.eDate) / 0.3)) * -30}deg)` }}><rect x="3.8" y="5.2" width="16.4" height="14.8" rx="2.6" /><path d="M3.8 9.6h16.4M8.4 3.4v3.4M15.6 3.4v3.4" /></svg>
      <KText t={t} text="Tue, Oct 20" unit="char" at={E.eDate} times={[L6("tuesday") - 0.06, L6("tuesday") + 0.12, L6("tuesday") + 0.22]} emph={{ "Tue,": L6("tuesday") + 0.15 }} dist={30} seed="gd" float={0.6} out={out} />
    </div>
    <div style={{ position: "absolute", left: 48, top: 286, opacity: clamp((t - E.ePhoto) / 0.1), clipPath: `inset(${(1 - ph) * 100}% 0 0 0 round 18px)`, transform: `translateY(${(1 - ph) * 30}px) scale(${1 + bump(t, L6("photo"), 0.02)})` }}>
      <Photo path={IMG.r34WeepPhoto} name="c3-r34-head-weep.jpg" w={640} h={480} r={18} zoom={kb} focus={WEEP}>
        <Sheen p={seg(t, L6("photo") - 0.05, L6("photo") + 0.7)} op={0.35} />
      </Photo>
    </div>
    <div style={{ position: "absolute", left: 724, top: 300, width: 508, padding: "30px 32px", borderRadius: 30, background: SOFT, opacity: clamp((t - E.eChip) / 0.12), transform: `translateX(${(1 - Math.min(1, chip)) * 40}px) scale(${0.8 + 0.2 * Math.min(1.05, chip)})`, transformOrigin: "0 50%" }}>
      <div style={{ fontSize: 60, fontWeight: 600, color: GREY, lineHeight: 1.1 }}><KText t={t} text="logged by" at={E.eChip + 0.05} color={GREY} dist={24} float={0} seed="lb" /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
        <div style={{ width: 76, height: 76, borderRadius: 38, background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700, transform: `scale(${Math.min(1.08, spr(t, E.eChip + 0.12, 300, 13)) + gusPop}) rotate(${(1 - Math.min(1, spr(t, E.eChip + 0.12, 300, 13))) * -120}deg)` }}>G</div>
        <div style={{ fontSize: 76, fontWeight: 650, letterSpacing: "-.03em" }}><KText t={t} text="Gus" at={E.eChip + 0.18} weight={650} emphWeight={780} emph={{ Gus: L6("gus") }} keepColor={false} dist={30} seed="gus" /></div>
      </div>
      <div style={{ fontSize: 60, fontWeight: 600, color: GREY, lineHeight: 1.1, marginTop: 18 }}><KText t={t} text={NAMES.garage} at={E.eChip + 0.28} color={GREY} stagger={0.07} dist={24} float={0} seed="ps" /></div>
    </div>
  </div>;
};
const Monitor = ({ t, x, y, k, rotY, blur, out }) => {
  const c = Math.cos(rotY * Math.PI / 180); const back = c < 0;
  // a light sweep crosses the panel as it turns, then a slow sweep crosses the glass every 2.2 s while it faces us
  const turnSheen = clamp(Math.abs(Math.sin(rotY * Math.PI / 180)));
  const glass = rotY > -1 && rotY < 1 ? sheenAt(t, 12.4, 2.2, 1.0) : 0;
  return <div style={{ position: "absolute", left: x, top: y, width: MW, height: MH + STAND, transformOrigin: "0 0", transform: `scale(${k})`, zIndex: 30, filter: blur }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH + STAND, transformStyle: "preserve-3d", transform: `perspective(2600px) rotateY(${rotY}deg)` }}>
      <div style={{ position: "absolute", left: MW / 2 - 70, top: MH - 4, width: 140, height: STAND - 16, background: back ? "#3A3A3C" : "#48484A" }} />
      <div style={{ position: "absolute", left: MW / 2 - 220, top: MH + STAND - 22, width: 440, height: 22, borderRadius: 11, background: "#2C2C2E" }} />
      {back ? <div style={{ position: "absolute", inset: `0 0 ${STAND}px 0`, borderRadius: 26, background: "linear-gradient(180deg,#3A3A3C,#232325)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.06)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "38%", right: "38%", top: "34%", bottom: "34%", borderRadius: 18, background: "rgba(255,255,255,.05)" }} />
        <Sheen p={turnSheen} op={0.18} width={0.25} />
      </div>
        : <div style={{ position: "absolute", inset: `0 0 ${STAND}px 0`, borderRadius: 26, background: "#111113", padding: 24 }}>
          <div style={{ position: "relative", width: 1280, height: 800, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <Entry t={t} out={out} />
            <Sheen p={glass} op={0.22} width={0.14} angle={24} />
            {turnSheen > 0.02 ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.35 * turnSheen})` }} /> : null}
          </div>
        </div>}
    </div>
  </div>;
};

const PILL_EMPH = { "Shows when. Not the call.": { "Not": wt(TL, 7, "called") }, "Back to the car": { "car": wt(TL, 9, "engine") } };
const Pill = ({ t, a, b, text, top }) => {
  if (t < a - 0.01 || t > b + 0.6) return null;
  const p = spr(t, a, 260, 16), q = eio(seg(t, b, b + 0.35));
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", zIndex: 70 }}>
    <div style={{ height: 88, padding: "0 36px", borderRadius: 44, background: "#fff", display: "flex", alignItems: "center", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 10px 26px -16px rgba(0,0,0,.3)", opacity: clamp((t - a) / 0.12) * (1 - q), transform: `translateY(${(1 - Math.min(p, 1.05)) * 24 - q * 20 + 2 * per(t, 4.5)}px) scale(${(0.86 + 0.14 * Math.min(p, 1.05)) * (1 - 0.05 * q)})`, filter: q > 0.02 ? `blur(${q * 8}px)` : undefined, willChange: "transform" }}>
      <KText t={t} text={text} at={a + 0.06} out={b - 0.05} emph={PILL_EMPH[text] || {}} stagger={0.08} dist={26} float={0.6} seed={text} /></div>
  </div>;
};

export const GAR = ({ t, check }) => {
  // ---- camera: lens-zoom punch-in/out (hard cut + 5-frame lens settle), slow push into the photo, drift to the car
  let cs = 1, cox = 540, coy = BOARD_TOP, zb = 0;
  if (t >= E.punchIn && t < E.punchOut) { const x = t - E.punchIn; cs = 1.16 + 0.07 * Math.exp(-x * 14) * Math.cos(x * 9); cox = 540; coy = BOARD_TOP - 40; zb = 6 * Math.exp(-x * 30); }
  if (t >= E.punchOut && t < E.punchOut + 0.6) { const x = t - E.punchOut; cs = 1 - 0.05 * Math.exp(-x * 14) * Math.cos(x * 9); zb = 6 * Math.exp(-x * 30); }
  const push = eio(seg(t, E.pushPhoto, E.pushPhoto + 2.8)) * (1 - eio(seg(t, E.monBack, E.monBack + 0.6)));
  const drift = eio(seg(t, E.drift, E.drift + 1.6)) * (1 - eio(seg(t, E.camHome, E.camHome + 0.8)));
  // monitor geometry
  const kC = 600 / MW, kF = 900 / MW;
  const geo = tt => {
    const slide = Math.min(1.04, spr(tt, E.monSlide, 110, 14));
    const turn = eio(seg(tt, E.monTurn, E.monTurned));
    const fill = Math.min(1.03, spr(tt, E.monFill, 120, 15));
    const back = eio(seg(tt, E.monBack, E.monBack + 0.8));
    const out = eio(seg(tt, E.monOut, E.monOut + 0.6));
    const counterY = COUNTER - (MH + STAND) * kC;
    let mx = lerp(-700, 40, slide), my = counterY, mk = kC, mr = 180 - 180 * turn + 8 * bump(tt, E.monTurned, 1, 6, 14);
    mx = lerp(mx, (1080 - MW * kF) / 2, fill); my = lerp(my, 672, fill); mk = lerp(mk, kF, fill);
    mx = lerp(mx, -60, back); my = lerp(my, counterY, back); mk = lerp(mk, kC, back); mr = lerp(mr, -58, back);
    mx = lerp(mx, -760, out);
    return { mx, my, mk, mr, counterY };
  };
  const { mx, my, mk, mr, counterY } = geo(t); const g0 = geo(t - 1 / 30);
  const monV = mx - g0.mx, monVy = my - g0.my;
  const showMon = t >= E.monSlide && t < E.monOut + 0.65;
  const px = mx + (24 + 48 + 640 * WEEP.x) * mk, py = my + (24 + 286 + 480 * WEEP.y) * mk;
  if (push > 0) { cs = 1 + 0.06 * push; cox = px; coy = py; }
  if (drift > 0) { cs = 1 + 0.08 * drift; cox = 600; coy = 900; }
  // loop-safe breathing on top of every camera state
  const bx = 6 * per(t, 9, 0.5), by = 5 * per(t, 6.75, 1.9), bs = 1 + 0.006 * per(t, 13.5, 0.7);
  // props
  const ding = t > E.ding ? Math.exp(-(t - E.ding) * 22) : 0;
  const ring = t > E.ding ? Math.exp(-(t - E.ding) * 3.2) * Math.sin((t - E.ding) * 40) : 0;
  const bellXf = tt => lerp(790, 905, Math.min(1.06, spr(tt, E.bellAside, 160, 13)) * (1 - (tt >= E.bellBack ? Math.min(1.06, spr(tt, E.bellBack, 160, 13)) : 0)));
  const bellX = bellXf(t), bellV = bellX - bellXf(t - 1 / 30);
  const blockF = tt => tt < E.blockOut ? Math.min(1.03, spr(tt, E.block, 90, 13)) : 1 - Math.pow(seg(tt, E.blockOut, E.blockOut + 0.6), 2);
  const blockIn = blockF(t), blockV = (blockIn - blockF(t - 1 / 30)) * -560;
  const blockX = lerp(1120, 560, blockIn), blockRot = (1 - Math.min(1, blockIn)) * 10 + 3 * bump(t, E.block + 0.55, 1, 5, 14) + blockV * 0.12;
  const chipGrey = eio(seg(t, E.chipGrey, E.chipGrey + 0.6)), chipRed = eio(seg(t, E.chipRed, E.chipRed + 0.45));
  const chipBounce = bump(t, E.chipBounce, 10, 9, 30) + bump(t, E.chipRed + 0.45, 4, 8, 20);
  const r34x = -4 * per(t, 9, 0.5 + Math.PI), r34y = 2 * per(t, 6.75, 2.4);
  const glow = clamp(Math.cos(mr * Math.PI / 180)) * (showMon ? 1 : 0) * (1 - eio(seg(t, E.monFill, E.monFill + 0.4)) + eio(seg(t, E.monBack, E.monBack + 0.8)) * 0.7);
  const twitch = (r, c) => { if (r !== 3 || t < E.thuStall || t >= E.rowSorry) return 0; for (const [a, col] of TWITCH) { const x = t - a; if (c === col && x > 0 && x < 0.24) return -30 * Math.sin(Math.PI * x / 0.24); } return 0; };
  const boardSheen = sheenAt(t, 0.6, 4.5, 1.1);
  return <Canvas>
    <MBDefs />
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${cox}px ${coy}px`, transform: `translate(${bx}px,${by}px) scale(${cs * bs})`, filter: zb > 0.4 ? `blur(${zb}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: BOARD_TOP, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <FlapBoard t={t} states={TL.board} initial={["NEVER TOLD ME", "", "", ""]} rows={4} cols={14} fw={60} fh={86} gap={4} rgap={8} pad={18} twitch={twitch}>
          <Sheen p={boardSheen} op={0.09} width={0.12} angle={28} />
        </FlapBoard>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 712, height: 400, borderRadius: 48, background: SOFT, zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${r34x}px,${r34y}px)`, zIndex: 3 }}><Cut img={IMG.r34} x={110} y={768} w={860} z={3} /></div>
      {/* the $1,850 chip: red, wipes to grey at 22.0, wipes back to red for the loop */}
      <div style={{ position: "absolute", left: 104, top: 676 + chipBounce + 2 * per(t, 4.5, 1.1), zIndex: 25, height: 80, borderRadius: 40, overflow: "hidden", boxShadow: "0 8px 20px -14px rgba(0,0,0,.4)" }}>
        {[["#F43034", "#fff", 1], ["#E5E5EA", GREY, chipGrey], ["#F43034", "#fff", chipRed]].map(([bg, col, p], i) => p > 0 ? <div key={i} style={{ position: i ? "absolute" : "relative", inset: i ? 0 : undefined, height: 80, padding: "0 30px", background: bg, color: col, display: "flex", alignItems: "center", fontSize: 44, fontWeight: 600, letterSpacing: "-.015em", clipPath: i ? `inset(0 ${(1 - p) * 100}% 0 0)` : undefined, whiteSpace: "nowrap" }}>Head gasket · $1,850</div> : null)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: COUNTER, height: 420, background: "linear-gradient(180deg,#EDEDF0,#F7F7F9 30%,#FFFFFF)", borderTop: "3px solid #D1D1D6", zIndex: 4 }} />
      {glow > 0.01 ? <div style={{ position: "absolute", left: mx + 40, width: MW * mk - 80, top: COUNTER + 2, height: 60, zIndex: 5, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(210,228,255,.55), rgba(255,255,255,0))", opacity: glow }} /> : null}
      {blockIn > 0 ? <div style={{ position: "absolute", left: 0, top: 0, zIndex: 6, filter: mblur(blockV, 0, 0.5) }}><Cut img={IMG.block} x={blockX} y={COUNTER - 214} w={220} rot={blockRot} z={6} /></div> : null}
      <div style={{ position: "absolute", left: bellX, top: COUNTER - 156 + 4, zIndex: 8, filter: mblur(bellV, 0, 0.5), transform: `rotate(${-bellV * 0.3}deg)`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: "6%", right: "6%", bottom: -6, height: 16, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.3),rgba(0,0,0,0))", filter: "blur(4px)" }} />
        <CounterBell w={200} squash={ding} ring={ring} gleam={0.5 + 0.5 * per(t, 6.75, 0.3)} />
      </div>
      {/* the ding rings out: two arcs above the bell */}
      {[0, 0.12].map((d, i) => { const p = seg(t, E.ding + d, E.ding + d + 0.6); if (p <= 0 || p >= 1) return null; const r = 60 + 90 * eo(p);
        return <svg key={i} style={{ position: "absolute", left: bellX + 100 - r, top: COUNTER - 150 - r * 0.55, overflow: "visible", zIndex: 9 }} width={2 * r} height={r}><path d={`M ${r * 0.25} ${r * 0.75} A ${r} ${r * 0.9} 0 0 1 ${r * 1.75} ${r * 0.75}`} fill="none" stroke="#B88A2C" strokeWidth={4} strokeLinecap="round" opacity={(1 - p) * 0.8} /></svg>; })}
      <TrimBurst t={t} at={E.ding} x={bellX + 100} y={COUNTER - 150} n={6} r0={40} r1={96} color="#B88A2C" w={4} rot={-90} spread={150} dur={0.3} z={9} />
      {showMon ? <Monitor t={t} x={mx} y={my} k={mk} rotY={mr} blur={mblur(monV, monVy, 0.45)} out={99} /> : null}
    </div>
    <Pill t={t} a={TL.labels[0].a} b={TL.labels[0].b} text={TL.labels[0].text} top={1320} />
    <Pill t={t} a={TL.labels[1].a} b={TL.labels[1].b} text={TL.labels[1].text} top={1240} />
    <GarCTA t={t} />
    <Captions t={t} vo={TL.vo} style="dim" />
    {check ? <Guides /> : null}
  </Canvas>;
};
// CTA sits on the counter front (the board holds the top band and must read NEVER TOLD ME for the loop)
const GarCTA = ({ t }) => {
  const a = E.ctaIn, out = E.ctaOut - 0.2; if (t < a || t > out + 0.7) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 1190, zIndex: 80, textAlign: "center", willChange: "transform" }}>
    <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-.038em", lineHeight: 1.02, fontVariationSettings: '"opsz" 32' }}>
      <KText t={t} text="Log every find." at={a + 0.1} out={out} times={[wt(TL, 10, "log"), wt(TL, 10, "every"), wt(TL, 10, "find")]} emph={{ "find.": wt(TL, 10, "find") + 0.05 }} dist={64} seed="gcta" /></div>
    <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-.025em", marginTop: 10, minHeight: 70 }}><Typed t={t} at={wt(TL, 10, "fuelmybuild") - 0.05} text="fuelmybuild.com" cps={24} out={out} /></div>
    <div style={{ fontSize: 32, fontWeight: 500, color: GREY, marginTop: 6 }}><KText t={t} text="Illustrative story" at={a + 0.55} out={out} color={GREY} dist={20} stagger={0.08} float={0} seed="gil" /></div>
  </div>;
};
