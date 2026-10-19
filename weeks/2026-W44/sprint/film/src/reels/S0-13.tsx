// @ts-nocheck
// S0-13 (lane C, parts suppliers): Hank builds exhaust headers and usually only hears about week one. At a show, a
// twenty-year-old header stops him. Renata has kept its history on the car's build page: fitted in 2006, new gaskets in
// 2019, still the same header. "Who made it?" "Little shop called Ashby." (silence) "That's me. I'm Ashby." He never
// knew if any of them lasted. "Then you're going on the page." The newest entry on a twenty-year-old header: met Hank
// Ashby, the man who built it.
// Device: the header in golden light. The heat colour on the tubes is the mood, not data. Renata's dated entries slide
// out alongside the tube like labels on a ruler; the newest forms when she takes the photo.
// Bank: six-into-one header C06 (heat tint added in CSS), green E30 front A10, golden show lawn K3-08 (scene only, no
// identifiable car), Hank E01, Renata K4-02 (person only). Fictional: Hank Ashby, Ashby Fabrication, Renata.
// Transitions: macro pull-back (pull), drop to the tube (rise), entries ride the tube (path slide), the 2006 entry lifts
// toward camera, silence punch on Hank, shutter flash -> the photo becomes the newest entry (shape), pull back for the CTA.
// remocn (ported): lens-zoom settle (silence punch), ruler-label slide, focus-blur-resolve, typewriter, period-drop.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD } from "./laneB";
import { land, Wordmark, Who, Sweep } from "./b2kit";

export const HOOK_WORDS = 11;
export const TAIL = 1.4;
export const LIFE = 1.75;
export const BG = "#2A2118";
export const TEXT = { ...HTEXT, size: 106, color: "#FFF8EC" };
export const IMAGES = ["C06", "A10", "K3-08", "E01", "K4-02"];
const HOOKS = { A: "Hank, / header maker", B: "Twenty years. / Same header.", C: "A stranger / crouched down." };
const GOLD = "#F6B54A";

// the header with its heat colour (gold to violet to blue), golden light sliding along it
const Header = ({ t, cx, cy, w, rot = 0, glow = 1 }) => {
  const h = w / (1582 / 1017);
  return <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `rotate(${rot}deg)` }}>
    <Img src={src("C06")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: `drop-shadow(0 30px 30px rgba(0,0,0,.45))` }} />
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${src("C06")})`, WebkitMaskSize: "100% 100%", background: "linear-gradient(90deg, rgba(230,170,60,.55) 0%, rgba(200,120,70,.5) 35%, rgba(130,80,170,.55) 65%, rgba(70,100,190,.45) 100%)", mixBlendMode: "overlay" }} />
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${src("C06")})`, WebkitMaskSize: "100% 100%", background: `linear-gradient(100deg, rgba(255,240,200,0) ${((t * 22) % 140) - 30}%, rgba(255,240,200,${0.7 * glow}) ${((t * 22) % 140) - 20}%, rgba(255,240,200,0) ${((t * 22) % 140) - 10}%)` }} />
  </div>;
};
const Golden = ({ t, k = 1 }) => <div style={{ position: "absolute", inset: -40, transform: `scale(${1.05 + 0.03 * Math.sin(t * 0.2)})` }}>
  <Img src={src("K3-08")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${4 * k}px) brightness(.9) saturate(1.1)` }} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(40,25,10,.55) 0%, rgba(40,25,10,.1) 40%, rgba(40,25,10,.25) 100%)" }} />
  <div style={{ position: "absolute", top: -300, width: 700, height: 2800, left: ((t * 70) % 2200) - 900, background: "linear-gradient(90deg, rgba(255,210,140,0), rgba(255,210,140,.22), rgba(255,210,140,0))", transform: "rotate(-24deg)" }} />
</div>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    that: at("that"), seen: at("seen"), twenty: at("twenty."), kept: at("kept"), build: at("build"), page: at("page."), fitted: at("fitted"), six: at("six."), new: at("new"),
    nineteen: at("nineteen."), still: at("still"), who: at("who"), little: at("little"), ashby: at("ashby."), thats: at("that's"), im: at("i'm"), never: at("never"), lasted: at("lasted."),
    no: at("no"), then: at("then"), pageE: tl.end("page.", 2), so: at("so"), newest: at("newest"), met: at("met"), built: at("built"), cta: tl.cta("start") ?? at("start"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [3] : [1], hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length * 0.55) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("Twenty years, / same header.", T.still), [T.fitted, T.nineteen, T.still + 0.3, at("header.")]), key: [3], hold: 0.6 },
    { words: [], key: [2], hold: 0.6 },
    { ...ctaHead(tl, "Start a / build page", T.cta), key: [2] },
  ];
  heads[2].words = [{ w: "Met", t: T.met, line: 0 }, { w: "the", t: at("the", 5), line: 0 }, { w: "man", t: at("man"), line: 0 }, { w: "who", t: tl.after("who", T.met), line: 1 }, { w: "built", t: T.built, line: 1 }, { w: "it.", t: T.built + 0.25, line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the show field: macro pull-back, Hank walks in (and the CTA)
  const field = (t, phase) => {
    const d = drift(t, "fd" + phase, 3, 0.3);
    const end = phase === "end";
    const pull = end ? 1 : ez(t, 0.4, 2.4, EASE.camera);
    const walk = end ? 1 : ez(t, 1.6, 2.6, EASE.io);
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "#2A2118" }}>
      <Golden t={t} k={pull} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "50% 60%" }}>
        <Cut id="A10" cx={540} cy={1260} w={980} shadow={0.45} o={clamp(pull * 1.5)} />
        <Cut id="E01" cx={lerp(1200, end ? 860 : 880, walk)} cy={1430} w={460} shadow={0} />
        {end && <Cut id="K4-02" cx={210} cy={1460} w={420} shadow={0} />}
        {/* the macro: the header fills the frame and pulls back into the wheel arch */}
        {pull < 0.999 && <div style={{ opacity: 1 - seg(pull, 0.7, 1) }}><Header t={t} cx={lerp(540, 330, pull)} cy={lerp(980, 1390, pull)} w={lerp(1900, 180, pull)} rot={lerp(-8, 0, pull)} /></div>}
        {end && t > T.cta + 0.8 && <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", zIndex: 40 }}>
          <Typed t={t} t0={T.cta + 0.9} t1={T.cta + 1.6} text="fuelmybuild.com" style={inter(46, "#FFF1D6", 500)} keepCaret={0.4} /></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- under the car: the tube, the entries riding it like ruler labels
  const ENTRIES = [
    { key: "2006", title: "Header", date: "Jun 2006", t: T.fitted, x: 90, y: 560, photo: true },
    { key: "2019", title: "Header gaskets", date: "Apr 2019 · same header", t: T.new, x: 90, y: 1300 },
    { key: "2012", title: "Track day", date: "Sep 2012", t: T.still + 0.6, x: 520, y: 1300, flick: true },
  ];
  const tube = (t, phase) => {
    const d = drift(t, "tb" + phase, 3, 0.3);
    const ren = phase === "story" ? spr(t - (T.twenty - 0.3), 170, 18) : 1;
    const lift = phase === "story" ? ez(t, T.who - 0.1, 0.6, EASE.camera) : 1;
    const brand = phase === "story" ? T.little + 0.2 : -9;
    return <AbsoluteFill style={{ background: "#2A2118" }}>
      <Golden t={t} k={1.6} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Header t={t} cx={540} cy={1000} w={1250} rot={-4} />
        {phase === "story" && ENTRIES.map((e, i) => { if (t < e.t - 0.3) return null;
          const q = spr(t - (e.t - 0.3), 190, 18), fl = e.flick ? EASE.in(seg(t, T.who - 0.6, T.who - 0.1)) : 0;
          const L = i === 0 ? lift : 0;
          return <div key={i} style={{ position: "absolute", left: lerp(e.x - 300, e.x, clamp(q)) + fl * 700, top: e.y - L * 0, width: i === 0 ? lerp(560, 900, L) : 470, padding: "18px 22px", borderRadius: 26, ...CARD, background: "rgba(255,252,245,.96)",
            opacity: clamp(q * 2) * (1 - fl), transform: `scale(${1 + 0.05 * L}) rotate(${(1 - clamp(q)) * -4}deg)`, transformOrigin: "0 0", zIndex: 20 + i }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              {e.photo && <div style={{ width: 170, height: 110, borderRadius: 16, background: "radial-gradient(circle, #fff, #e8e4dc)", position: "relative", flex: "none" }}><Cut id="C06" cx={85} cy={55} w={160} shadow={0} /></div>}
              <div><div style={inter(46, INK, 650)}>{e.title}</div><div style={inter(42, RED, 600)}>{e.date}</div>
                {i === 0 && t > brand && <div style={{ ...inter(44, INK, 700), marginTop: 6, ...land(t, brand) }}>Ashby Fabrication</div>}</div></div>
          </div>; })}
        {phase === "touch" && <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: `radial-gradient(40% 20% at 50% 52%, rgba(255,220,150,${0.25 + 0.1 * Math.sin(t * 2)}), rgba(0,0,0,0))` }} />}
      </div>
      {phase === "story" && <div style={{ position: "absolute", left: 640, top: lerp(1900, 1280, ren), zIndex: 30 }}><Cut id="K4-02" cx={200} cy={250} w={420} shadow={0} /></div>}
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- Hank, close (the silence punch)
  const hank = (t) => {
    const k = ez(t, T.ashby + 0.3, 1.4, EASE.io);
    return <AbsoluteFill style={{ background: "#2A2118" }}><Golden t={t} k={2.2} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${1 + 0.08 * k})`, transformOrigin: "50% 45%" }}>
        <Cut id="E01" cx={540} cy={1250} w={1200} shadow={0} /></div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the photo and the newest entry
  const photo = (t) => {
    const d = drift(t, "ph", 3, 0.3);
    const flash = 1 - seg(t, T.pageE + 0.05, T.pageE + 0.35);
    const toEntry = ez(t, T.so - 0.2, 0.8, EASE.camera);
    const P = { x: lerp(90, 120, toEntry), y: lerp(560, 760, toEntry), w: lerp(900, 360, toEntry), h: lerp(700, 280, toEntry) };
    return <AbsoluteFill style={{ background: "#2A2118" }}><Golden t={t} k={2} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        {toEntry > 0.01 && <div style={{ position: "absolute", left: 80, top: 600, width: 920, height: 760, borderRadius: 40, ...CARD, background: "rgba(255,252,245,.97)", opacity: clamp(toEntry * 2) }}>
          <div style={{ position: "absolute", left: 36, top: 30, display: "flex", gap: 14, alignItems: "center" }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· E30 · header</span></div>
          <div style={{ position: "absolute", left: 440, top: 170, width: 440 }}>
            <div style={inter(44, RED, 600)}>Oct 2026</div>
            <Typed t={t} t0={T.met} t1={T.built + 0.3} text="Met Hank Ashby, who built this header" caret={RED} style={inter(50, INK, 650, { whiteSpace: "normal", lineHeight: 1.18 })} keepCaret={0.3} />
          </div>
          <div style={{ position: "absolute", left: 36, top: 660, ...land(t, T.built) }}><Who ch="R" name="Renata" role="logged it" bg="#AF52DE" size={56} /></div>
        </div>}
        <div style={{ position: "absolute", left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: lerp(10, 24, toEntry), overflow: "hidden", background: "#3A2A18", boxShadow: "0 30px 50px -20px rgba(0,0,0,.6)", zIndex: 20 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 700, transformOrigin: "0 0", transform: `scale(${P.w / 900}, ${P.h / 700})` }}>
            <Img src={src("K3-08")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(.9)" }} />
            <Cut id="A10" cx={520} cy={420} w={900} shadow={0.3} />
            <Cut id="E01" cx={230} cy={560} w={380} shadow={0} />
            <Cut id="K4-02" cx={720} cy={560} w={340} shadow={0} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: t > T.pageE ? flash : 0, zIndex: 90 }} />
    </AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => field(t, "start") },
    { at: T.that - 0.12, render: (t) => tube(t, "first"), enter: { kind: "rise", d: 0.5 } },
    { at: T.twenty - 0.1, render: (t) => tube(t, "story"), enter: { kind: "match" } },
    { at: T.ashby + 0.35, render: hank, enter: { kind: "punch" } },
    { at: T.never - 0.12, render: (t) => tube(t, "touch"), enter: { kind: "match" } },
    { at: T.no - 0.1, render: photo, enter: { kind: "rise", d: 0.5 } },
    { at: T.cta - 0.47, render: (t) => field(t, "end"), enter: { kind: "pull", d: 0.6, rect: { x: 120, y: 760, w: 360, h: 280 } } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.3, "air-slow-push", 0.6], [1.6, "gravel", 0.4], [T.that - 0.12, "air-glide"], [T.twenty - 0.3, "slide-soft"], [T.fitted - 0.3, "card-settle"], [T.new - 0.3, "card-settle"],
    [T.still + 0.3, "slide-soft"], [T.who - 0.6, "air-short"], [T.who - 0.1, "card-rise"], [T.little + 0.2, "pop-soft"], [T.ashby + 0.35, "punch-in-thump"],
    [T.never, "shimmer-soft"], [T.no - 0.1, "slide-soft"], [T.pageE + 0.05, "shutter"], [T.so - 0.2, "card-settle"], [T.met, "typing:1.0"], [ctaT, "cta-pop"],
  ];
  // the band stops for the silence before "That's me" and comes back warm on "Never knew"
  const music = { bpm: 88, root: 50, mode: "major", style: "warm", cut: T.ashby, ret: T.never - 0.12 };
  return { shots, heads, sfx, music };
}
