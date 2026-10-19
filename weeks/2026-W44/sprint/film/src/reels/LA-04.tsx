// @ts-nocheck
// LA-04 (lane A, garages): "The Shop Behind the Green Door" (ChatGPT concept and look, Claude execution). Everybody nearby
// knows Dock Lantern Garage as the place behind the green door. Beautiful work, but the description doesn't travel. A
// customer recommends them to a cousin out of town: no online presence, and the nickname doesn't show their work. So the
// customer shares their build page, with dated photos and credit for Dock Lantern and the person who did it. We give the
// build a public link, so the recommendation carries the work with it. AUDIENCE CTA: "Shops: DM SHOP".
// Look (ChatGPT): deep green, cream, hot coral; bold humanist sans (Source Sans 3); generous negative space; a miniature
// neighbourhood of photo cut-outs on a folded map that unfolds into a phone-sized build page.
// Device: the green door and a folded paper map. The recommendation is a paper slip that runs to the map's fold and stops;
// outside the circle it flips into the customer's build page; the map unfolds and the credit lines up with the shop sign.
// Images: customer car A11 (E30 side, unbadged), local cars A07/A37/A01 fronts (tiny), cousin's car A29 as a silhouette,
// work photos G05 (cage fitting) and G03 (caliper). Drawn: door, lantern, map, houses, slip, page.
// Fictional: Dock Lantern Garage, Nina (customer), Rafa (fabricator).
// Transitions: push through the door (portal), slip leaves the map (whip), slip flips into the page (flip in place),
// page shrinks onto the unfolding map (pull), CTA over door, car and page.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { land, Thumb, Sweep } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.6;
export const LIFE = 1.75;
const GREEN = "#14402F", GREEN2 = "#1E5A43", CREAM = "#F4EDDC", CORAL = "#FF5A4E", INKG = "#0E2A20", MUTEG = "#5D7A6C";
export const BG = CREAM;
export const TEXT = { font: "Source Sans 3", weight: 600, size: 112, min: 76, ls: "-0.02em", opsz: 32, color: GREEN, accent: CORAL, line2: null, align: "left", x0: 80, maxW: 920, top: 266, lead: 1.0 };
export const IMAGES = ["A11", "A07", "A37", "A01", "A29", "G05", "G03"];
const HOOKS = { A: "Great shop. / Tiny reach.", B: "'Behind the / green door.'", C: "Word of mouth / stops here." };
const SANS = (size, color = INKG, w = 600) => ({ fontFamily: "Inter", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap", letterSpacing: "-0.01em" });
const SLIP = { background: "#FFFDF6", boxShadow: "0 16px 26px -12px rgba(14,42,32,.45)", borderRadius: 8 };

// the green door in a cream wall, lantern above. open 0..1 swings it in
const Door = ({ x, y, w = 420, open = 0, t = 0, sign = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: w * 1.9 }}>
    <div style={{ position: "absolute", left: -40, top: -40, right: -40, bottom: 0, background: "#E8DFCB", borderRadius: "10px 10px 0 0" }} />
    <div style={{ position: "absolute", inset: 0, background: "#1A1A18" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 60% at 50% 60%, rgba(255,200,120,.45), rgba(0,0,0,0))", opacity: open }} />
    </div>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-open * 80}deg)`, background: `linear-gradient(90deg, ${GREEN2}, ${GREEN})`, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.12)" }}>
      {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: "12%", right: "12%", top: `${10 + r * 44}%`, height: "36%", border: "6px solid rgba(0,0,0,.18)", borderRadius: 6 }} />)}
      <div style={{ position: "absolute", right: "10%", top: "50%", width: 26, height: 26, borderRadius: 13, background: "radial-gradient(#F3D38A, #9C7A32)" }} />
    </div>
    <div style={{ position: "absolute", left: w / 2 - 30, top: -150, width: 60, height: 80, borderRadius: "10px 10px 20px 20px", background: "#2B2B28", boxShadow: `0 0 ${40 + 10 * Math.sin(t * 3)}px rgba(255,190,90,.75)` }}>
      <div style={{ position: "absolute", inset: 10, borderRadius: 8, background: "radial-gradient(#FFE2A6, #F2A93B)" }} /></div>
    {sign > 0.01 && <div style={{ position: "absolute", left: -10, top: -260, width: w + 20, textAlign: "center", padding: "10px 0", background: GREEN, borderRadius: 8, opacity: clamp(sign * 2), transform: `translateY(${(1 - clamp(sign)) * -20}px)` }}><span style={{ fontFamily: "Source Sans 3", fontWeight: 600, fontSize: 52, color: CREAM, letterSpacing: "0.02em" }}>Dock Lantern Garage</span></div>}
  </div>
);
// a small paper house
const House = ({ x, y, s = 1, c = "#F7F1E2" }) => (
  <svg width={110 * s} height={110 * s} viewBox="0 0 110 110" style={{ position: "absolute", left: x, top: y }}>
    <path d="M 10 50 L 55 12 L 100 50 L 100 104 L 10 104 Z" fill={c} stroke="rgba(14,42,32,.35)" strokeWidth={3} /><rect x={44} y={70} width={22} height={34} fill={GREEN2} /></svg>
);
// the recommendation slip
const Slip = ({ x, y, rot = 0, s = 1, o = 1, q = 0 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 520, padding: "22px 26px", ...SLIP, transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: 40 }}>
    <div style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 700, color: INKG, lineHeight: 1 }}>Go to the place</div>
    <div style={{ fontFamily: "Caveat", fontSize: 64, fontWeight: 700, color: INKG, lineHeight: 1.05, position: "relative", display: "inline-block" }}>behind the green door.
      <div style={{ position: "absolute", left: 0, bottom: -4, height: 5, width: `${q * 100}%`, background: CORAL, borderRadius: 3 }} /></div>
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    everybody: at("everybody"), knows: at("knows"), dock: at("dock"), behind: at("behind"), door: at("door."), beautiful: at("beautiful"), but: at("but"), travel: at("travel"),
    far: at("far."), customer: at("customer"), cousin: at("cousin"), town: at("town."), theres: at("there's"), online: at("online"), nickname: at("nickname"), work: at("work."),
    so: at("so"), shares: at("shares"), dated: at("dated"), credit: at("credit"), dock2: at("dock", 2), person: at("person"), we: at("we"), public: at("public"),
    link: at("link,"), carry: at("carry"), cta: tl.cta("shops:", "shops") ?? at("shops:"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [2, 3] : hook === "B" ? [2, 3] : [3, 4], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Locals / know.", T.everybody), [at("nearby"), T.knows]), key: [1], hold: 0.6 },
    { ...fx(B("It doesn't / travel.", T.but), [T.but + 0.1, at("doesn't"), T.travel]), key: [2], hold: 0.5 },
    { ...fx(B("Outside the / circle.", T.cousin), [T.cousin, at("out"), T.town]), key: [2], hold: 0.6 },
    { ...fx(B("Work that / travels.", T.dated), [T.dated, at("photos"), tl.after("work", T.dated)]), key: [2], hold: 0.5 },
    { ...fx(B("A name. A build. / A link.", T.we), [T.we, at("give"), at("build", 2) - 0.1, at("build", 2), T.public, T.link]), key: [4, 5], hold: 0.6 },
    { ...ctaHead(tl, "Shops: / DM SHOP.", T.cta), key: [2, 3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  const Cream = ({ t, children }) => (
    <AbsoluteFill style={{ background: CREAM }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 380, left: ((t * 70) % 1700) - 420, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,252,244,.5), rgba(255,255,255,0))" }} />
      {children}</AbsoluteFill>
  );
  // the folded map: green paper with cream roads; unfold 0 = half folded (right panel turned under)
  const MapBase = ({ t, unfold = 0, lines = 0, sign = 0, slip = null }) => {
    const pw = 480;
    return <div style={{ position: "absolute", left: lerp(300, 60, unfold), top: 600, width: 960, height: 900 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: 900, background: GREEN, borderRadius: "14px 0 0 14px", overflow: "hidden", boxShadow: "0 20px 40px -20px rgba(0,0,0,.5)" }}>
        <svg width={pw} height={900} style={{ position: "absolute", inset: 0 }}><path d="M 0 300 L 480 260 M 0 640 L 480 700 M 160 0 L 200 900 M 340 0 L 300 900" stroke={CREAM} strokeWidth={16} opacity={0.85} /></svg>
        <House x={30} y={120} s={0.9} /><House x={250} y={110} s={0.8} c="#FCE9DE" /><House x={30} y={420} s={0.8} c="#FCE9DE" /><House x={360} y={760} s={0.9} />
        {/* the garage */}
        <div style={{ position: "absolute", left: 220, top: 400, width: 200, height: 170, background: "#E8DFCB", borderRadius: 6, boxShadow: "0 10px 16px -8px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 70, top: 60, width: 60, height: 110, background: GREEN2, boxShadow: `0 0 0 4px ${CORAL}` }} /></div>
        <div style={{ position: "absolute", left: 30, top: 330, opacity: 1 }}><Cut id="A07" cx={80} cy={0} w={150} shadow={0} /></div>
        <div style={{ position: "absolute", left: 30, top: 610, opacity: 1 }}><Cut id="A37" cx={90} cy={0} w={150} shadow={0} /></div>
        <div style={{ position: "absolute", left: 280, top: 650, opacity: 1 }}><Cut id="A01" cx={90} cy={0} w={150} shadow={0} /></div>
        <svg width={pw} height={900} style={{ position: "absolute", inset: 0 }}>
          {[[110, 330], [120, 610], [370, 650]].map(([x1, y1], i) => <path key={i} d={`M ${x1} ${y1} Q ${(x1 + 320) / 2} ${(y1 + 480) / 2 - 60} 320 485`} stroke={CORAL} strokeWidth={5} strokeDasharray="10 10" fill="none" strokeDashoffset={-t * 30} opacity={clamp(lines * 3 - i)} />)}
        </svg>
      </div>
      {/* right panel: folded under (dark sliver) or unfolded (the outer region, empty) */}
      <div style={{ position: "absolute", left: pw, top: 0, width: pw, height: 900, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${(1 - unfold) * 88}deg)`, background: `linear-gradient(90deg, ${rgba("#0B241A", 1 - unfold)}, ${GREEN2})`, borderRadius: "0 14px 14px 0", overflow: "hidden" }}>
        <svg width={pw} height={900} style={{ position: "absolute", inset: 0, opacity: unfold }}><path d="M 0 260 L 480 240 M 0 700 L 480 720 M 260 0 L 240 900" stroke={CREAM} strokeWidth={16} opacity={0.6} /></svg>
      </div>
      <div style={{ position: "absolute", left: pw - 6, top: 0, width: 12, height: 900, background: "linear-gradient(90deg, rgba(0,0,0,.35), rgba(255,255,255,.15))", opacity: 1 - unfold * 0.6 }} />
      {sign > 0.01 && <div style={{ position: "absolute", left: 50, top: 330, padding: "8px 18px", background: CREAM, borderRadius: 8, opacity: clamp(sign * 2), transform: `translateY(${(1 - clamp(sign)) * 16}px)`, boxShadow: "0 8px 14px -8px rgba(0,0,0,.5)" }}><span style={{ fontFamily: "Source Sans 3", fontWeight: 600, fontSize: 46, color: GREEN }}>Dock Lantern Garage</span></div>}
      {slip}
    </div>;
  };
  // ---------------------------------------------------------------- 1. the green door (hook); push through it
  const door = (t) => {
    const d = drift(t, "do", 3, 0.3);
    const open = EASE.io(seg(t, T.everybody - 0.9, T.everybody - 0.1));
    const push = EASE.in(seg(t, T.everybody - 0.6, T.everybody));
    return <Cream t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 2.2 * push})`, transformOrigin: "540px 1150px" }}>
      <Door x={540} y={760} w={400} open={open} t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1520, height: 400, background: "#D9CFB8" }} />
    </div></Cream>;
  };
  // ---------------------------------------------------------------- 2. the neighbourhood map; the slip runs to the fold and stops
  const map = (t) => {
    const d = drift(t, "mp", 3, 0.3);
    const lines = ez(t, T.knows - 0.2, 1.2, EASE.io);
    const sign = spr(t - (T.dock - 0.1), 190, 16);
    const sl = EASE.camera(seg(t, T.but, T.far));
    const bump = t > T.far ? Math.sin((t - T.far) * 18) * Math.exp(-(t - T.far) * 5) * 10 : 0;
    const out = EASE.in(seg(t, T.customer - 0.1, T.cousin));
    return <Cream t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <MapBase t={t} lines={lines} sign={sign} slip={<Slip x={lerp(140, 300, sl) + out * 900 + bump} y={lerp(680, 600, sl) - out * 200} rot={lerp(-4, 3, sl)} s={0.62} o={ez(t, T.beautiful - 0.2, 0.4)} q={0} />} />
    </div></Cream>;
  };
  // ---------------------------------------------------------------- 3. out of town: the slip lands beside the cousin's car; the nickname doesn't show the work; flip into the page
  const town = (t) => {
    const d = drift(t, "tw", 3, 0.3);
    const land1 = EASE.camera(seg(t, T.cousin - 0.2, T.town + 0.2));
    const q = ez(t, T.nickname, 0.6, EASE.io);
    const flip = EASE.io(seg(t, T.so - 0.2, T.shares + 0.2));
    const sx = Math.abs(Math.cos(flip * Math.PI));
    return <Cream t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, height: 6, background: rgba(GREEN, 0.25) }} />
      <Cut id="A29" cx={560} cy={1260} w={760} shadow={0.25} style={{ filter: "brightness(0) opacity(.85)" }} o={1 - flip} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scaleX(${Math.max(0.02, sx)})`, transformOrigin: "540px 800px" }}>
        {flip < 0.5 ? <Slip x={lerp(1200, 280, land1)} y={lerp(500, 680, land1)} rot={lerp(10, -3, land1)} s={1} q={q} />
          : <Page t={t} x={110} y={600} k={1} rise={0} />}
      </div>
      {flip < 0.5 && q > 0.3 && <div style={{ position: "absolute", left: 820, top: 610, width: 110, height: 110, borderRadius: 55, background: CORAL, display: "grid", placeItems: "center", transform: `scale(${clamp((q - 0.3) * 2)})` }}><span style={{ fontFamily: "Source Sans 3", fontWeight: 600, fontSize: 80, color: "#fff" }}>?</span></div>}
    </div></Cream>;
  };
  // the customer's build page (phone-sized card): car, dated work photos, credits, public link
  function Page({ t, x, y, k = 1, rise = 0, credit = 1, link = 0, photos = 1 }) {
    return <div style={{ position: "absolute", left: x, top: y, width: 860, transform: `scale(${k})`, transformOrigin: "0 0", background: "#fff", borderRadius: 40, boxShadow: "0 30px 50px -26px rgba(14,42,32,.5)", overflow: "hidden" }}>
      <div style={{ height: 300, background: "linear-gradient(180deg, #E7EFE9, #FBF8F0)", position: "relative" }}><Cut id="A11" cx={430} cy={170} w={700} shadow={0.35} /></div>
      <div style={{ padding: "18px 34px 30px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: INKG }}>Fuel<span style={{ color: CORAL }}>My</span>Build</span><span style={SANS(42, MUTEG, 500)}>· Nina's coupe</span></div>
        <div style={{ display: "flex", gap: 18, marginTop: 18 }}>
          {[["G05", "Cage fitted", "May 2, 2026"], ["G03", "Brakes", "Apr 18, 2026"]].map(([id, c, dte], i) => <div key={i} style={{ width: 386, opacity: clamp(photos * 2 - i * 0.5) }}>
            <Thumb id={id} w={386} h={230} t={t + i} r={20} k={1.06} /><div style={{ ...SANS(44, INKG, 700), marginTop: 8 }}>{c}</div><div style={SANS(42, CORAL, 650)}>{dte}</div></div>)}
        </div>
        <div style={{ marginTop: 18, padding: "14px 20px", borderRadius: 22, background: rgba(GREEN, 0.08), display: "flex", gap: 14, alignItems: "center", opacity: credit }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: GREEN, display: "grid", placeItems: "center", ...SANS(42, CREAM, 700) }}>R</div>
          <span style={SANS(44, INKG, 650)}>Rafa · Dock Lantern Garage</span></div>
        {link > 0.01 && <div style={{ marginTop: 16, padding: "12px 20px", borderRadius: 30, background: GREEN, display: "inline-flex", opacity: clamp(link * 2) }}><span style={SANS(42, CREAM, 600)}>fuelmybuild.com/ninas-coupe</span></div>}
      </div>
      <Sweep t={t} w={860} o={0.3} />
    </div>;
  }
  // ---------------------------------------------------------------- 4. the page builds (dated photos, credit); then the map unfolds behind it and the link carries it (and CTA with the door)
  const page = (t, phase) => {
    const d = drift(t, "pg" + phase, 3, 0.3);
    const end = phase === "end";
    const photos = end ? 1 : ez(t, T.dated - 0.1, 0.8);
    const credit = end ? 1 : ez(t, T.credit - 0.1, 0.5);
    const link = phase === "page" ? ez(t, T.link - 0.2, 0.4) : 1;
    const shrink = phase === "page" ? EASE.camera(seg(t, T.carry - 0.3, T.cta - 0.4)) : 1;
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    return <Cream t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1100px" }}>
      {shrink > 0.01 && <MapBase t={t} unfold={shrink} lines={1} sign={1} />}
      {shrink < 0.99 && <div style={{ opacity: 1 - seg(shrink, 0, 0.5) }}><Page t={t} x={lerp(110, 400, shrink)} y={lerp(600, 760, shrink)} k={lerp(1, 0.7, shrink)} photos={photos} credit={credit} link={link} /></div>}
      {shrink > 0.3 && <div style={{ position: "absolute", left: 500, top: 740, width: 520, background: "#fff", borderRadius: 34, overflow: "hidden", boxShadow: "0 30px 50px -26px rgba(14,42,32,.55)", opacity: seg(shrink, 0.3, 0.8), transform: `translateY(${(1 - seg(shrink, 0.3, 1)) * 40}px)` }}>
        <div style={{ height: 210, background: "linear-gradient(180deg, #E7EFE9, #FBF8F0)", position: "relative" }}><Cut id="A11" cx={260} cy={118} w={470} shadow={0.35} /></div>
        <div style={{ padding: "14px 28px 26px" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: INKG }}>Fuel<span style={{ color: CORAL }}>My</span>Build</div>
          <div style={{ ...SANS(46, INKG, 700), marginTop: 6 }}>Nina's coupe</div>
          <div style={{ ...SANS(42, MUTEG, 600), marginTop: 10 }}>Rafa</div><div style={SANS(44, GREEN, 700)}>Dock Lantern Garage</div>
          <div style={{ marginTop: 14, padding: "10px 18px", borderRadius: 26, background: GREEN, display: "inline-flex" }}><span style={SANS(42, CREAM, 600)}>fuelmybuild.com/nina</span></div>
        </div><Sweep t={t} w={520} o={0.3} /></div>}
      {shrink > 0.3 && <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><path d="M 380 1080 C 430 1180 460 1240 520 1250" stroke={CORAL} strokeWidth={6} strokeDasharray="12 10" fill="none" opacity={seg(shrink, 0.3, 1)} strokeDashoffset={-t * 30} /></svg>}
      {end && <div style={{ position: "absolute", left: 330, top: 1060, width: 60, height: 110, borderRadius: 4, background: "radial-gradient(70% 60% at 50% 60%, rgba(255,200,120,.95), rgba(255,160,80,.2))", opacity: 0.6 + 0.3 * Math.sin(t * 2) }} />}
    </div></Cream>;
  };

  const shots = [
    { at: 0, render: door },
    { at: T.everybody - 0.05, render: map, enter: { kind: "match" } },
    { at: T.customer + 0.25, render: town, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.shares + 0.3, render: (t) => page(t, "page"), enter: { kind: "match" } },
    { at: T.cta - 0.12, render: (t) => page(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.2, "key-turn"], [T.everybody - 0.9, "creak-soft"], [T.everybody - 0.4, "portal"], [T.knows - 0.2, "draw"], [T.dock - 0.1, "pop-soft"],
    [T.but, "paper-flutter"], [T.far, "paper-thud"], [T.customer + 0.1, "whip"], [T.town, "paper-thud"], [T.nickname, "pencil-line"], [T.so - 0.2, "card-fold"],
    [T.dated - 0.1, "shutter"], [T.dated + 0.3, "shutter"], [T.credit - 0.1, "tick-soft"], [T.link - 0.2, "pop-soft"], [T.carry - 0.3, "paper-unfold"], [ctaT, "cta-pop"], [ctaT + 0.6, "chime"],
  ];
  const music = { bpm: 102, root: 52, mode: "major", style: "warm", cut: T.so - 0.3, ret: T.dated - 0.1 };
  return { shots, heads, sfx, music };
}
