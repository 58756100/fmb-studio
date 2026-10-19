// @ts-nocheck
// LB-09 (lane B, parts suppliers): "A logo is a starting point" (ChatGPT concept and script, Claude build). Lina is buying a
// used branded oil cooler, but look-alikes can copy the lettering too. The seller's sure; Lina wants to know where it came
// from. A sourcing note names the original dealer, but that note could be copied too, so she uses the history to ask
// questions rather than as an authenticity certificate. The entry names the original dealer and date; she contacts them
// independently and brings the cooler in; they examine it and confirm it. The page supplied context; the dealer examining
// the cooler supplied the answer. LINK CTA ("Document it at fuelmybuild.com"). Hook A only.
// Device (reserved): a cloth wipe across a logo that cannot settle the question. The polishing cloth wipes the logo plate
// in the hook, again before the CTA, and the dealer's note stays beside it the second time.
// Car: A39 white coupe front (unbadged, parked). Drawn: the cooler (finned core, end tanks, logo plate, identifier plate),
// printed lettering copy, install photo, dealer invoice, desk sign, loupe, inspection note. Cloth: b2kit napkin.
// Fictional: Lina, Bramble Core (cooler maker), Larch Point Parts (supplying dealer).
// Transitions: cloth wipe reveals the face (wipe), cooler turns to its underside (match), plate aligns with the install
// photo (match), photo opens into the record (rise), dealer name match-cuts to the desk sign (match), pull back to the
// counter (pull), cloth crosses again into the CTA.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Sweep, Cloth, CLOTH, mixPts } from "./b2kit";

export const HOOK_WORDS = 7;
export const TAIL = 1.5;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["A39"];
const HOOKS = { A: "More than / a logo.", B: "What / proves it?", C: "Looks / right…" };
const BRAMBLE = "#2E5E4E";

// the oil cooler: finned core between two end tanks, AN fittings, logo plate. under: shows the identifier plate instead
const Cooler = ({ x, y, w = 760, turn = 0, under = false, glint = 0, id = "c" }) => {
  const sx = Math.cos(turn * Math.PI * 0.25);
  return <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.32, width: w, height: w * 0.64, transform: `scaleX(${sx.toFixed(3)})` }}>
    <svg width={w} height={w * 0.64} viewBox="0 0 500 320" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs><linearGradient id={`ct${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9ECEF" /><stop offset=".5" stopColor="#A7AEB5" /><stop offset="1" stopColor="#6E757C" /></linearGradient>
        <pattern id={`fn${id}`} width="7" height="10" patternUnits="userSpaceOnUse"><rect width="7" height="10" fill="#8A9198" /><path d="M 0 5 L 3.5 0 L 7 5 L 3.5 10 Z" fill="#C3C9CF" /></pattern>
        <clipPath id={`cc${id}`}><rect x={70} y={40} width={360} height={240} /></clipPath></defs>
      <rect x={70} y={40} width={360} height={240} fill={`url(#fn${id})`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={70} y={40 + i * 30} width={360} height={4} fill="#5D646B" />)}
      <g clipPath={`url(#cc${id})`}><rect x={-80 + 640 * glint} y={20} width={50} height={300} fill="rgba(255,255,255,.35)" transform="skewX(-20)" /></g>
      <rect x={30} y={26} width={48} height={268} rx={12} fill={`url(#ct${id})`} stroke="#5D646B" strokeWidth={2} />
      <rect x={422} y={26} width={48} height={268} rx={12} fill={`url(#ct${id})`} stroke="#5D646B" strokeWidth={2} />
      {[[54, 10], [446, 10], [54, 296], [446, 296]].map(([cx, cy], i) => <g key={i}><rect x={cx - 14} y={cy - 10} width={28} height={22} rx={4} fill={i % 2 ? "#2F67C8" : "#C8352F"} /><rect x={cx - 9} y={cy - 22} width={18} height={14} fill="#B8BEC4" /></g>)}
    </svg>
    {!under ? <div style={{ position: "absolute", left: "33%", top: "40%", width: "34%", height: "20%", borderRadius: 6, background: "linear-gradient(180deg, #F4F5F6, #C9CED3)", boxShadow: "0 2px 6px rgba(0,0,0,.35)", display: "grid", placeItems: "center" }}>
      <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: w * 0.05, letterSpacing: "0.08em", color: BRAMBLE }}>BRAMBLE CORE</span></div>
      : <div style={{ position: "absolute", left: "30%", top: "38%", width: "40%", height: "24%", borderRadius: 6, background: "linear-gradient(180deg, #D7DBDF, #9EA4AA)", display: "grid", placeItems: "center", boxShadow: "inset 0 2px 4px rgba(0,0,0,.3)" }}>
        <span style={{ fontFamily: "IBM Plex Mono", fontWeight: 500, fontSize: w * 0.04, color: "#3A3F45" }}>BC-OC19 · 2211</span></div>}
  </div>;
};
// the seller's install photo (drawn bay, cooler mounted)
const InstallPhoto = ({ w, h, t }) => (
  <div data-check="photo" style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "radial-gradient(120% 90% at 50% 40%, #50545A, #1E2023)" }}>
    <div style={{ position: "absolute", left: w * 0.08, top: h * 0.62, width: w * 0.84, height: h * 0.1, background: "#2A2C30", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `scale(${1.02 + 0.02 * Math.sin(t * 0.5)})` }}><Cooler x={w * 0.5} y={h * 0.42} w={w * 0.62} glint={(t * 0.2) % 1} id={"ip" + w} /></div>
    <div style={{ position: "absolute", left: w * 0.05, top: h * 0.08, width: w * 0.2, height: h * 0.6, background: "linear-gradient(180deg, #33363B, #222428)", borderRadius: 10 }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,220,170,.2), rgba(0,0,0,.12))" }} />
  </div>
);
const Invoice = ({ x, y, rot = 0, o = 1, ghost = 0, w = 420 }) => o <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: "20px 24px", background: ghost ? "#ECECEC" : "#FFFFFF", boxShadow: "0 14px 24px -12px rgba(0,0,0,.35)", transform: `rotate(${rot}deg)`, opacity: o, filter: ghost ? "contrast(.8)" : undefined, zIndex: 20 }}>
    <div style={inter(42, GREY, 600)}>Larch Point Parts</div>
    <div style={{ ...inter(46, INK, 700), marginTop: 4 }}>Invoice · oil cooler</div>
    {[0, 1].map((i) => <div key={i} style={{ height: 12, borderRadius: 6, width: i ? "55%" : "80%", background: "#C9CED3", marginTop: 14 }} />)}
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    buying: at("buying"), cooler: at("cooler,"), but: at("but"), copy: at("copy"), lettering: at("lettering"), seller: at("seller's"), wants: at("wants"), from: at("from,"),
    claims: at("claims."), sourcing: at("sourcing"), dealer: at("dealer,"), copied: at("copied"), so: at("so"), history: at("history"), questions: at("questions,"),
    rather: at("rather"), certificate: at("certificate."), entry: at("entry"), date: at("date."), contacts: at("contacts"), brings: at("brings"), examine: at("examine"),
    confirm: at("confirm"), now: at("now"), page: at("page"), answer: at("answer."), thats: at("that's"), cta: tl.cta("document") ?? at("document"), dot: at("dot"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook] ?? HOOKS.A, 0), key: [2, 3], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Lettering can / be copied.", T.but), [T.lettering - 0.2, T.copy, T.copy + 0.15, T.lettering]), key: [3], hold: 0.4 },
    { ...fx(B("Where did it / come from?", T.wants), [T.wants, at("know"), at("where"), at("came"), T.from]), key: [3, 4], hold: 0.4 },
    { ...fx(B("Check the / source.", T.copied), [at("could"), T.copied - 0.1, T.copied]), key: [2], hold: 0.4 },
    { ...fx(B("History isn't / certification.", T.rather), [T.rather, at("treating"), T.certificate]), key: [2], hold: 0.4 },
    { ...fx(B("Examined / in person.", T.examine), [T.examine, T.confirm]), key: [1, 2], hold: 0.6 },
    { ...ctaHead(tl, "Keep the / history.", T.cta), key: [2] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. hook: the cloth wipes across the logo plate; the cooler partly visible
  const wipe = (t, end) => {
    const d = drift(t, "wi" + (end ? "e" : ""), 3, 0.3);
    const t0 = end ? T.thats - 0.1 : 0.2;
    const pass = EASE.io(seg(t, t0, t0 + 1.8));
    const reveal = end ? 1 : EASE.camera(seg(t, 1.6, T.buying));
    const note = end ? 1 : 0;
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const url = end ? spr(t - (T.dot - 0.6), 190, 16) : 0;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${lerp(1.35, 1, reveal) * (1 - 0.04 * ctaP)})`, transformOrigin: "540px 1000px" }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1250, height: 700, background: "linear-gradient(180deg, #E4E6EA, #D3D6DB)" }} />
      <Cooler x={540} y={1000} w={760} glint={(t * 0.3) % 1} id={end ? "we" : "wh"} />
      {note > 0 && <div style={{ position: "absolute", left: 90, top: 1270, width: 520, padding: "18px 24px", background: "#FFFDF4", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", transform: "rotate(-3deg)" }}>
        <div style={{ fontFamily: "Caveat", fontSize: 60, fontWeight: 700, color: INK, lineHeight: 1.05 }}>Examined in person.</div>
        <div style={{ fontFamily: "Caveat", fontSize: 50, fontWeight: 600, color: GREY }}>Larch Point Parts</div></div>}
      <Cloth t={t} x={lerp(-700, 1100, pass)} y={820} w={560} h={360} shape={mixPts(CLOTH.crumpled, CLOTH.draped, 0.6 + 0.4 * Math.sin(pass * Math.PI))} kind="napkin" seed={end ? "nape" : "nap"} rot={-8 + 10 * pass} z={30} />
      {end && url > 0.01 && <div style={{ position: "absolute", left: 300, top: 1470, padding: "14px 26px", borderRadius: 34, ...CARD, display: "flex", gap: 14, alignItems: "center", opacity: clamp(url * 2), transform: `translateY(${(1 - clamp(url)) * 30}px)` }}><Wordmark size={44} /><span style={inter(44, GREY, 500)}>fuelmybuild.com</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the counter: the cooler turns; a printed copy of the lettering slides past; underside identifiers
  const counter = (t) => {
    const d = drift(t, "co", 3, 0.3);
    const turn = Math.sin(t * 0.9) * 0.6;
    const copyX = lerp(1200, -700, EASE.io(seg(t, T.copy - 0.3, T.copy + 1.4)));
    const under = t > T.from - 0.25;
    const flip = clamp(1 - Math.abs(t - (T.from - 0.25)) / 0.25);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1250, height: 700, background: "linear-gradient(180deg, #E4E6EA, #D3D6DB)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, filter: "blur(3px)", opacity: 0.85 }}><Cut id="A39" cx={800} cy={760} w={460} shadow={0.2} /></div>
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${(1 - 0.9 * flip).toFixed(3)})`, transformOrigin: "540px 1000px" }}>
        <Cooler x={540} y={1000} w={720} turn={turn} under={under} glint={(t * 0.3) % 1} id="cc" /></div>
      <div style={{ position: "absolute", left: copyX, top: 1300, padding: "18px 30px", background: "#FFFFFF", boxShadow: "0 10px 20px -10px rgba(0,0,0,.35)", transform: "rotate(-2deg)" }}><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 64, letterSpacing: "0.08em", color: BRAMBLE }}>BRAMBLE CORE</span></div>
      {under && <div style={{ position: "absolute", left: 100, top: 1340, padding: "12px 22px", borderRadius: 30, ...CARD, ...land(t, T.claims - 0.2) }}><span style={inter(44, INK, 600)}>"It's genuine." </span><span style={inter(42, GREY, 500)}>· seller</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the sourcing note and the install photo; the note can be copied; her finger traces photo -> dealer
  const source = (t) => {
    const d = drift(t, "so", 3, 0.3);
    const ph = spr(t - (T.sourcing - 0.2), 160, 16), inv = spr(t - (T.dealer - 0.3), 170, 16);
    const ghost = EASE.camera(seg(t, T.copied - 0.3, T.copied + 0.6));
    const trace = ez(t, T.history, 1.2, EASE.io);
    const certX = ez(t, T.certificate - 0.4, 0.6, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {ph > 0.01 && <div style={{ position: "absolute", left: 80, top: 600, width: 620, padding: 14, paddingBottom: 18, background: "#fff", boxShadow: "0 24px 40px -20px rgba(0,0,0,.45)", transform: `rotate(${-3 + 2 * clamp(ph)}deg) translateY(${(1 - clamp(ph)) * 200}px)`, opacity: clamp(ph * 2) }}>
        <InstallPhoto w={592} h={420} t={t} /></div>}
      <Invoice x={540} y={1100} rot={4} o={clamp(inv * 2)} />
      <Invoice x={lerp(540, 120, ghost)} y={lerp(1100, 1260, ghost)} rot={lerp(4, -6, ghost)} o={ghost * 0.9} ghost />
      {ghost > 0.5 && <div style={{ position: "absolute", left: 640, top: 1380, width: 330, height: 120, border: `4px dashed ${GREY}`, borderRadius: 14, opacity: ghost * (1 - trace), }} />}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d="M 400 830 C 520 960 600 1040 700 1150" stroke={RED} strokeWidth={6} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - trace)} strokeLinecap="round" /></svg>
      {certX > 0.01 && <div style={{ position: "absolute", left: 640, top: 600, width: 360, height: 250, border: `5px double ${GREY}`, borderRadius: 10, opacity: 0.8 * certX * (1 - ez(t, T.certificate + 0.6, 0.5)), display: "grid", placeItems: "center", background: "rgba(255,255,255,.7)" }}>
        <span style={{ ...inter(46, GREY, 600), position: "relative" }}>Certificate<div style={{ position: "absolute", left: -10, right: -10, top: 28, height: 5, background: RED, transform: `scaleX(${certX})`, transformOrigin: "0 50%" }} /></span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. the record around the photo and the sourcing note
  const record = (t) => {
    const d = drift(t, "re", 3, 0.25);
    const rec = ez(t, T.entry - 0.3, 0.7, EASE.camera);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 580, width: 960, height: 1000, ...CARD, background: `rgba(255,255,255,${rec})`, boxShadow: rec > 0.5 ? CARD.boxShadow : "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", opacity: rec }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· seller's coupe</span></div>
        <div style={{ position: "absolute", left: lerp(20, 40, rec), top: lerp(20, 110, rec), width: lerp(620, 880, rec), height: lerp(420, 440, rec), borderRadius: 26, overflow: "hidden" }}><InstallPhoto w={lerp(620, 880, rec)} h={lerp(420, 440, rec)} t={t} /><Sweep t={t} w={880} o={0.25} /></div>
        <div style={{ position: "absolute", left: 40, top: 580, ...land(t, T.entry) }}><div style={inter(54, INK, 700)}>Oil cooler fitted</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Feb 14, 2023</span><span style={inter(42, GREY, 500)}>Oil cooler · Bramble Core</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 770, padding: "14px 22px", borderRadius: 22, background: "#F2F2F5", ...land(t, at("dealer", 2) - 0.2) }}><span style={inter(44, INK, 600)}>Purchased from Larch Point Parts</span></div>
      </div>
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 5. the dealer's desk: sign, mat, loupe, examination note
  const dealer = (t) => {
    const d = drift(t, "de", 3, 0.3);
    const set = spr(t - (T.brings - 0.2), 170, 16);
    const loupe = EASE.io(seg(t, T.examine - 0.2, T.confirm + 0.4));
    const note = spr(t - (T.confirm + 0.2), 170, 15);
    const pull = EASE.camera(seg(t, T.now - 0.2, T.page + 0.4));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.1 * pull})`, transformOrigin: "540px 1150px" }}>
      <div style={{ position: "absolute", left: 220, top: 600, padding: "16px 36px", borderRadius: 12, background: BRAMBLE }}><span style={inter(58, "#fff", 700)}>Larch Point Parts</span></div>
      <div style={{ position: "absolute", left: 60, top: 980, width: 960, height: 420, borderRadius: 26, background: "#2B3A34", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }} />
      <div style={{ opacity: clamp(set * 2), transform: `translateY(${(1 - clamp(set)) * -200}px)` }}><Cooler x={540} y={1180} w={640} glint={(t * 0.3) % 1} id="dc" /></div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: loupe > 0.01 && loupe < 0.99 ? 1 : loupe >= 0.99 ? 0.7 : 0 }}>
        <g transform={`translate(${lerp(300, 760, loupe)} ${1120 + 40 * Math.sin(loupe * Math.PI)})`}><circle r={80} fill="rgba(200,225,255,.25)" stroke="#2B2E33" strokeWidth={14} /><rect x={50} y={50} width={30} height={150} rx={12} fill="#2B2E33" transform="rotate(-45 65 65)" /></g></svg>
      {note > 0.01 && <div style={{ position: "absolute", left: 120, top: 1300, width: 520, padding: "18px 24px", background: "#FFFDF4", boxShadow: "0 14px 24px -12px rgba(0,0,0,.4)", transform: `rotate(${-3 + 2 * (1 - clamp(note))}deg) translateY(${(1 - clamp(note)) * 80}px)`, opacity: clamp(note * 2) }}>
        <div style={{ fontFamily: "Caveat", fontSize: 60, fontWeight: 700, color: INK, lineHeight: 1.05 }}>Examined in person.</div>
        <div style={{ fontFamily: "Caveat", fontSize: 50, fontWeight: 600, color: GREY }}>Larch Point Parts</div></div>}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: pull }}><Cut id="A39" cx={830} cy={860} w={380} shadow={0.25} /></div>
    </div></Studio></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => wipe(t, false) },
    { at: T.buying - 0.1, render: counter, enter: { kind: "match" } },
    { at: T.sourcing - 0.3, render: source, enter: { kind: "rise", d: 0.5 } },
    { at: T.entry - 0.35, render: record, enter: { kind: "match" } },
    { at: T.contacts - 0.12, render: dealer, enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.thats - 0.15, render: (t) => wipe(t, true), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.2, "cloth"], [1.0, "cloth"], [T.buying, "slide-soft"], [T.copy - 0.3, "paper-flutter"], [T.from - 0.3, "creak-soft"], [T.claims - 0.2, "msg-pop"],
    [T.sourcing - 0.2, "photo-settle"], [T.dealer - 0.3, "paper-thud"], [T.copied - 0.3, "paper-unfold"], [T.history, "pencil-line"], [T.certificate - 0.4, "pencil-write"],
    [T.entry - 0.3, "card-settle"], [T.contacts - 0.2, "whip"], [T.brings - 0.2, "clunk", 0.7], [T.examine - 0.2, "lens-settle"], [T.confirm + 0.2, "pencil-write"],
    [T.thats - 0.1, "cloth"], [T.thats + 0.8, "cloth"], [ctaT, "cta-pop"], [T.dot - 0.6, "pop-soft"],
  ];
  const music = { bpm: 94, root: 51, mode: "minor", style: "investigate", cut: T.entry - 0.35, ret: T.contacts - 0.12 };
  return { shots, heads, sfx, music };
}
