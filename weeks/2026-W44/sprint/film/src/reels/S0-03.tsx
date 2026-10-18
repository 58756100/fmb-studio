// @ts-nocheck
// S0-03 (lane 0, collectors): "Curb Questions", a street interview at a dusk car meet. One question from us (off camera):
// when did you last change your clutch? Lou (E01): "spring-ish?", "2019? Maybe 2020?" Tasha (E02): "whenever my buddy
// was free", "before we moved". Andre (K4-03), leaning on his red Civic: "October ninth, 2023. Hollis Motorsport did it."
// Silence. "How do you know that?" It's on his car's page. Tasha: how do I start one? Andre turns the mic on us:
// "When'd you do yours?" ... "Spring-ish."
// Device: ONE run-on sentence. The guesses type across the top band joined by "..." and never get a full stop; Andre's
// date ends it with a red full stop, and that full stop grows and unfolds into his log card. One lateral dolly between
// the owners (no whip-pans), a foam mic that swings between speakers and finally turns into the lens. The sentence
// restarts at "spring-ish..." on our own answer (loop).
// Look: dusk meet (F06) with parallax, warm-graded cutouts, white text, one red full stop. Inter.
// Transitions: rack focus (mic -> Lou), dolly carries (Lou <-> Tasha, mic swing to the Civic), slide-ins (Lou and Tasha
// lean into Andre's frame), shape morph (full stop -> card), mic turn-around push into the lens, CTA over the meet.
// remocn (ported): typewriter (run-on line), period-drop (the red full stop), focus-blur-resolve (rack focus, card rows).
// New vs S0-08: run-on typed line with measured wrapping, period-to-card morph.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, measure } from "../kit";
import { Full, Scrim, Vignette, glass, font } from "./s0kit";

export const HOOK_WORDS = 9;
export const TAIL = 1.0;
export const LIFE = 1.2;
export const BG = "#0E1220";
export const TEXT = { font: "Inter", weight: 650, size: 104, min: 72, ls: "-0.035em", opsz: 32, color: "#FFFFFF", accent: "#FF5A5E", line2: null, align: "center", maxW: 940, top: 270, lead: 1.06 };
export const IMAGES = ["F06", "E01", "E02", "K4-03", "A37", "C13", "G04"];
const WARM = "brightness(.9) sepia(.18) saturate(1.05)";
const LOU = 540, TASHA = 1640, CIVIC = 2660, ANDRE = 3060;
const RUN = { x: 70, top: 262, size: 66, lead: 80, maxW: 940 };
const RST = { font: "Inter", size: RUN.size, weight: 600, ls: "-0.02em", opsz: 32 };

// the foam mic: ball at (x, y), pointing along angle a (deg; handle trails the other way), scale s
const Mic = ({ x, y, a = 200, s = 1, blur = 0 }) => <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 40, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, overflow: "visible" }}>
  <defs><radialGradient id="foam" cx="0.38" cy="0.35" r="0.75"><stop offset="0" stopColor="#5A5D66" /><stop offset="0.6" stopColor="#2A2C31" /><stop offset="1" stopColor="#141518" /></radialGradient>
    <linearGradient id="hdl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B3E45" /><stop offset="0.5" stopColor="#15161A" /><stop offset="1" stopColor="#2B2D33" /></linearGradient></defs>
  <g transform={`translate(${x},${y}) rotate(${a}) scale(${s})`}>
    <rect x={60} y={-26} width={720} height={52} rx={22} fill="url(#hdl)" />
    <rect x={70} y={-30} width={46} height={60} rx={10} fill="#C9CCD2" />
    <circle r={86} fill="url(#foam)" />
    {Array.from({ length: 34 }, (_, i) => { const r = 20 + ((i * 37) % 60), q = i * 2.399; return <circle key={i} cx={Math.cos(q) * r} cy={Math.sin(q) * r} r={2.6} fill="rgba(255,255,255,.08)" />; })}
  </g>
</svg>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    oh: at("oh,"), spring: at("spring-ish?"), my: at("my", 1), whenever: at("whenever"), free: at("free?"), tw: at("twenty", 1), maybe: at("maybe"), before: at("before", 1),
    defin: at("definitely"), okay: at("okay."), you: at("you,"), civic: at("civic?"), oct: at("october"), ninth: at("ninth,"), tw3: at("twenty-three."), hollis: at("hollis"),
    how: at("...how"), its: at("it's"), date: at("date,"), shop: at("shop,"), clutch: at("clutch"), photos: at("photos,"), okay2: at("okay", 2), start1: at("start", 1),
    whend: at("when'd"), yours: at("yours?"), spring2: at("spring-ish", 2), cta: tl.cta("start") ?? at("start", 2), fuel: at("fuel"),
  };
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["When'd", hw[0].s], ["you", hw[2].s], ["last", hw[3].s], ["do", hw[4].s], ["your", hw[5].s, 1], ["clutch?", hw[6].s, 1]], { key: [5], hold: 0.5 }), W_([["Be", hw[7].s], ["honest.", hw[8].s]], { key: [1], exit: { at: T.oh + 0.2, mode: "up" } })]
    : hook === "B" ? [W_([["We", hw[0].s], ["asked", hw[1].s], ["a", hw[2].s], ["car", hw[3].s], ["meet.", hw[4].s]], { hold: 0.4 }), W_([["Nobody", hw[9].s], ["owns", hw[10].s], ["a", hw[11].s, 1], ["calendar.", hw[12].s, 1]], { key: [3], exit: { at: T.oh + 0.2, mode: "up" } })]
    : [W_([["“It", hw[4].s], ["was", hw[5].s], ["around", hw[6].s], ["2019…”", hw[7].s]], { hold: 0.4 }), W_([["This", hw[9].s], ["one's", hw[10].s], ["for", hw[11].s], ["you.", hw[12].s]], { key: [3], exit: { at: T.oh + 0.2, mode: "up" } })];
  const heads = [
    ...hk,
    W_([["How", T.how], ["do", at("do", 1)], ["you", at("you", 2)], ["know?", at("know")]], { key: [3], hold: 0.8 }),
    W_([["How", at("how", 2)], ["do", at("do", 2)], ["I", at("i")], ["start", T.start1], ["one?", at("one")]], { key: [3], hold: 0.6 }),
    W_([["When'd", T.whend], ["you", at("you", 3)], ["do", at("do", 3)], ["yours?", T.yours]], { key: [3], exit: { at: T.spring2 - 0.35, mode: "up" } }),
    { ...ctaHead(tl, "Start your car's record", T.cta), key: [3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- the run-on sentence: fragments typed on their spoken time; measured word wrap
  const FR = [
    { s: "spring-ish…", t: T.spring - 0.05 },
    { s: "whenever he was free…", t: T.whenever },
    { s: "2019? 2020?…", t: T.tw },
    { s: "before we moved…", t: T.before },
    { s: "Oct 9, 2023", t: T.oct, end: true },
  ];
  const layout = () => {
    const sp = measure(" ", RST); let x = 0, line = 0; const out = [];
    FR.forEach((f, fi) => f.s.split(" ").forEach((w, wi, arr) => {
      const ww = measure(w, RST);
      if (x > 0 && x + ww > RUN.maxW) { x = 0; line++; }
      out.push({ w, x, line, fi, ww, k: wi / arr.length });
      x += ww + sp;
    }));
    return out;
  };
  let LAY = null;
  const dotPos = () => { const l = LAY[LAY.length - 1]; return { x: RUN.x + l.x + l.ww + 6, y: RUN.top + l.line * RUN.lead + RUN.size * 0.72 }; };
  const runOn = (t) => {
    if (typeof document === "undefined") return null;
    LAY = LAY || layout();
    const gone = ez(t, T.how - 0.35, 0.3, EASE.in);
    if (gone >= 1) return null;
    return <div style={{ position: "absolute", inset: 0, zIndex: 55, opacity: 1 - gone }}>
      {LAY.map((l, i) => {
        const f = FR[l.fi], nxt = FR[l.fi + 1];
        const t0 = f.t + l.k * Math.min(0.9, f.s.length / 22);
        if (t < t0 - 0.02) return null;
        const q = spr(t - t0, 220, 20);
        const old = nxt && t > nxt.t ? 0.5 : 1;
        const col = "#FFFFFF";
        return <div key={i} style={{ position: "absolute", left: RUN.x + l.x, top: RUN.top + l.line * RUN.lead, ...font("Inter", RUN.size, col, 600, { letterSpacing: "-0.02em" }), opacity: clamp(q * 2) * old,
          transform: `translateY(${(1 - q) * 30}px)` }}>{l.w}</div>;
      })}
    </div>;
  };
  // the restarted sentence (our own answer) on the loop
  const restart = (t) => { if (t < T.spring2 - 0.05) return null; const q = spr(t - (T.spring2 - 0.05), 220, 20), o = 1 - ez(t, T.cta - 0.35, 0.3, EASE.in);
    return <div style={{ position: "absolute", left: RUN.x, top: RUN.top + 170, ...font("Inter", RUN.size, "#FFFFFF", 600), opacity: clamp(q * 2) * o, transform: `translateY(${(1 - q) * 30}px)`, zIndex: 55 }}>spring-ish…</div>; };

  // ---------- camera (world x), focus, people slides, mic path
  const cam = (t) => track(t, { x: LOU, z: 1 }, [
    [T.my - 0.35, { x: TASHA }, 0.8], [T.tw - 0.4, { x: LOU }, 0.8], [T.before - 0.35, { x: TASHA }, 0.8],
    [T.okay + 0.15, { x: (CIVIC + ANDRE) / 2 }, 1.1], [T.how - 0.6, { z: 0.92 }, 0.8], [T.okay2 - 0.2, { z: 0.96 }, 0.6], [T.whend - 0.2, { z: 1.08 }, 0.9], [T.cta - 0.3, { z: 1.02 }, 1.2],
  ]);
  const scene = (t) => {
    const c = cam(t), cx = c.x;
    const sx = (wx) => wx - cx + 540;
    const focus = ez(t, Math.max(0.6, tl.cut - 0.9), 0.7, EASE.camera); // rack focus mic -> Lou
    // Lou and Tasha lean into Andre's frame for "How do you know that?"
    const lean = ez(t, T.how - 0.7, 0.8, EASE.camera);
    const louX = lerp(LOU, (CIVIC + ANDRE) / 2 - 640, lean), tasX = lerp(TASHA, (CIVIC + ANDRE) / 2 + 560, lean);
    const louS = lerp(1, 0.86, lean), tasS = lerp(1, 0.82, lean);
    const d = drift(t, "meet", 5, 0.3);
    // mic target: the current speaker's mouth (screen space), and the swings between them
    const mk = track(t, { x: 760, y: 1390, a: 38, s: 1 }, [
      [T.my - 0.35, { x: 700, y: 1330, a: 34 }, 0.8], [T.tw - 0.4, { x: 760, y: 1390, a: 38 }, 0.8], [T.before - 0.35, { x: 700, y: 1330, a: 34 }, 0.8],
      [T.okay + 0.15, { x: 860, y: 1380, a: 42 }, 1.1], [T.how - 0.7, { x: 840, y: 1560, a: 20 }, 0.6], [T.whend - 0.3, { x: 540, y: 1420, a: 90, s: 2.3 }, 0.8, EASE.camera],
    ]);
    const micIn = hook === "C" ? ez(t, hw[9].s - 0.4, 0.6) : ez(t, -0.3, 0.6);
    const micBlur = lerp(0, 9, focus) * (1 - ez(t, T.my - 0.4, 0.4));
    const person = (id, wx, cy, w, s, extra = {}) => <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${sx(wx)}px 1920px`, transform: `scale(${s})`, filter: WARM, ...extra }}>
      <Cut id={id} cx={sx(wx)} cy={cy} w={w} shadow={0} /></div>;
    const louBlur = lerp(10, 0, focus);
    return <AbsoluteFill style={{ background: BG }}>
      {/* the meet, parallax at 0.28 of the dolly */}
      <div style={{ position: "absolute", left: -380 - (cx - LOU) * 0.2, top: -60, width: 2700, height: 2100 }}>
        <img src={src("F06")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 50%", filter: "blur(5px) brightness(.85)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${c.z}) ${dT(d, 0.5)}`, transformOrigin: "540px 1300px" }}>
        <Cut id="A37" cx={sx(CIVIC)} cy={1270} w={980} shadow={0.6} style={{ filter: WARM }} />
        {person("K4-03", ANDRE, 1520, 560, 1)}
        {person("E02", tasX, 1430, 760, tasS)}
        {person("E01", louX, 1450, 900, louS, { filter: `${WARM} blur(${louBlur.toFixed(1)}px)` })}
      </div>
      <Scrim a={0.66} h={760} />
      <div style={{ opacity: micIn }}><Mic x={mk.x + (1 - micIn) * 600} y={mk.y + (1 - micIn) * 200} a={mk.a + Math.sin(t * 1.3) * 2} s={mk.s} blur={micBlur} /></div>
      {/* name tags by the shoulder (small, support text) */}
      {[["Lou", sx(louX) - 330, 1080, T.oh - 0.2, T.okay], ["Tasha", sx(tasX) - 300, 1040, T.my - 0.1, T.okay], ["Andre", sx(ANDRE) - 250, 1130, T.civic - 0.1, T.its]].map(([n, x, y, t0, t1], i) => {
        const q = spr(t - t0, 220, 18), o = clamp(q * 2) * (1 - ez(t, t1, 0.3));
        return o > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: y, padding: "8px 22px", borderRadius: 30, background: "rgba(255,255,255,.16)", backdropFilter: "blur(10px)", ...font("Inter", 42, "#fff", 600), opacity: o, zIndex: 30, transform: `translateY(${(1 - q) * 20}px)` }}>{n}</div>;
      })}
    </AbsoluteFill>;
  };
  // ---------- the red full stop: drops after "2023", then grows and unfolds into Andre's log card
  const CARD = { x: 80, y: 520, w: 920, h: 700 };
  const card = (t) => {
    if (typeof document === "undefined" || !LAY) return null;
    const p0 = dotPos(), dropT = T.tw3 + 0.45;
    if (t < dropT) return null;
    const m = ez(t, T.its - 0.25, 0.7, EASE.camera), out = ez(t, T.okay2 - 0.1, 0.6, EASE.camera);
    const dt = t - dropT, fall = clamp(dt / 0.28), bounce = dt > 0.28 ? Math.exp(-(dt - 0.28) * 9) * Math.abs(Math.sin((dt - 0.28) * 20)) * 22 : 0;
    const r = 11;
    const x = lerp(p0.x - r, CARD.x, m), y = lerp(p0.y - r + lerp(-200, 0, fall * fall) - bounce, CARD.y, m), w = lerp(2 * r, CARD.w, m), h = lerp(2 * r, CARD.h, m);
    const cIn = clamp((m - 0.6) / 0.4);
    const f = (t0) => { const q = spr(t - t0, 200, 19); return { opacity: clamp(q * 2) * cIn, transform: `translateY(${(1 - q) * 16}px)`, filter: q < 0.6 ? `blur(${(1 - q / 0.6) * 6}px)` : undefined }; };
    const s = 1 - 0.5 * out, o = 1 - ez(t, T.okay2 + 0.3, 0.3);
    return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 60, borderRadius: lerp(r, 44, m), overflow: "hidden", opacity: o, transform: `scale(${s})`, transformOrigin: "50% 100%",
      background: m < 0.5 ? RED : `rgba(16,18,26,${lerp(0.9, 0.62, cIn)})`, backdropFilter: m > 0.5 ? "blur(26px)" : undefined, boxShadow: m > 0.5 ? "inset 0 0 0 1.5px rgba(255,255,255,.25), 0 40px 70px -30px rgba(0,0,0,.7)" : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transformOrigin: "0 0", transform: `scale(${w / CARD.w}, ${h / CARD.h})` }}>
        <div style={{ position: "absolute", left: 40, top: 34, ...font("Inter", 40, "rgba(255,255,255,.75)", 500), ...f(T.its) }}>Andre's Civic · build log</div>
        <div style={{ position: "absolute", left: 40, top: 92, ...font("Inter", 68, "#fff", 650), ...f(T.date - 0.15) }}>Clutch kit</div>
        <div style={{ position: "absolute", left: 40, top: 178, ...font("Inter", 48, "#FF6B6E", 600), ...f(T.date) }}>Oct 9, 2023</div>
        <div style={{ position: "absolute", left: 40, top: 250, ...font("Inter", 44, "#fff", 500), ...f(T.shop - 0.1) }}>Hollis Motorsport</div>
        <div style={{ position: "absolute", right: 40, top: 250, padding: "6px 20px", borderRadius: 24, background: "rgba(255,255,255,.2)", ...font("Inter", 40, "#fff", 600), ...f(T.clutch) }}>Brayfield Clutch</div>
        <div style={{ position: "absolute", left: 40, top: 340, width: 410, height: 320, borderRadius: 26, overflow: "hidden", background: "#fff", ...f(T.photos - 0.15) }}><Cut id="C13" cx={205} cy={160} w={380} shadow={0.2} /></div>
        <div style={{ position: "absolute", left: 470, top: 340, width: 410, height: 320, borderRadius: 26, overflow: "hidden", ...f(T.photos) }}>
          <img src={src("G04")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.04 * ez(t, T.photos, 2)})` }} /></div>
      </div>
    </div>;
  };
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "air-slow-push", 0.5], [Math.max(0.6, tl.cut - 0.9), "lens-settle"], [T.spring - 0.05, "typing:0.5"], [T.my - 0.35, "air-glide"], [T.whenever, "typing:0.8"],
    [T.tw - 0.4, "air-glide"], [T.tw, "typing:0.6"], [T.before - 0.35, "air-glide"], [T.before, "typing:0.6"], [T.okay + 0.15, "air-glide-long"], [T.oct, "typing:0.5"],
    [T.tw3 + 0.45, "chip-drop-red"], [T.how - 0.7, "slide-soft"], [T.its - 0.25, "card-rise"], [T.date, "value-tick"], [T.clutch, "pop-soft"], [T.photos - 0.15, "shutter"], [T.photos, "shutter"],
    [T.okay2 - 0.1, "card-fold"], [T.whend - 0.3, "air-short"], [T.whend + 0.4, "punch-in-thump", 0.7], [T.spring2 - 0.05, "typing:0.5"], [ctaT, "cta-pop"],
  ];
  // music: warm, relaxed meet groove; dead air after Andre's date (the full stop) and back in on "It's on my car's page"
  const music = { bpm: 96, root: 50, mode: "major", style: "warm", cut: T.tw3 + 0.55, ret: T.its - 0.05, room: "restaurant" };
  return { shots: [{ at: 0, render: scene }], heads, sfx, music, over: (t) => <>{runOn(t)}{card(t)}{restart(t)}</> };
}
