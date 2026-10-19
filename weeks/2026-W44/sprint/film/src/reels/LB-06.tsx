// @ts-nocheck
// LB-06 (lane B, garages): "Whose winters?" (ChatGPT concept and script, Claude build). At Stillwater Lane Tire a stored
// winter set has lost its owner label. Sera has the size, but two customers use that size, so she won't put a name on
// yet. One customer remembers a repair inside a rim, but "mine has a mark" isn't enough. Hollis sends his build link:
// last fall's photo shows the repair beside one particular spoke. She checks that entry before opening the bag: his cream
// hatchback, that wheel, that mark, the old fitting date. Then the actual rim: same repair, same position. She relabels
// the set and checks the collection paperwork. AUDIENCE CTA: "Shops, DM SHOP". Hook A only.
// Device (reserved): the wheel-bag zip. The zip ring around the bag opens the bag, becomes the round boundary of the old
// photo, and closes again over the relabelled set.
// Images: C08 graphite wheel (the stored set), A38 hatchback tinted cream (unbadged), A07 front (the other customer).
// Drawn: wheel bag, zip, label sleeve, storage sheet, repair mark, page. Fictional: Sera, Hollis, Stillwater Lane Tire,
// Merrit Forge (wheel maker).
// Transitions: bag rolls in (whip), sheet edge aligns with the sleeve (match), zip opens into the wheel (portal), zip ring
// becomes the photo boundary (match), photo spoke edge wipes into today's rim (match), zip closes on the label (match).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, wordsFor, Cut, rgba } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who, Sweep, Tick } from "./b2kit";

export const HOOK_WORDS = 6;
export const TAIL = 1.5;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["C08", "A38", "A07"];
const HOOKS = { A: "Whose / winters?", B: "The name's / gone.", C: "Size isn't / an owner." };
const CREAM = { filter: "grayscale(1) sepia(.45) brightness(1.62) contrast(.92)" };
const MARK = { x: 0.69, y: 0.33 }; // repair mark position on the C08 image (inner lip by one spoke)

// the stored wheel bag: grey nylon disc, zip ring (open 0..1 = unzipped arc), label sleeve with optional name
const Bag = ({ x, y, r = 360, rot = 0, open = 0, name = null, write = 1, t = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `rotate(${rot}deg)` }}>
    <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs><radialGradient id="bagg" cx=".4" cy=".35"><stop offset="0" stopColor="#7A7F86" /><stop offset="1" stopColor="#3F4349" /></radialGradient></defs>
      <circle r={98} fill="url(#bagg)" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-90 + i * 4} ${-30 + i * 14} Q 0 ${-50 + i * 18 + 3 * Math.sin(t + i)} ${90 - i * 4} ${-30 + i * 14}`} stroke="rgba(255,255,255,.06)" strokeWidth={3} fill="none" />)}
      <circle r={78} fill="none" stroke="#22252A" strokeWidth={5} strokeDasharray="2 2.2" />
      {open > 0 && <circle r={78} fill="none" stroke="#111" strokeWidth={8} pathLength={1} strokeDasharray={`${open} 1`} transform="rotate(-90)" />}
      <circle cx={Math.cos(open * Math.PI * 2 - Math.PI / 2) * 78} cy={Math.sin(open * Math.PI * 2 - Math.PI / 2) * 78} r={7} fill="#C9CED3" stroke="#555" strokeWidth={1.5} />
    </svg>
    <div style={{ position: "absolute", left: r * 0.52, top: r * 1.32, width: r * 0.96, height: r * 0.4, borderRadius: 10, background: "rgba(235,240,245,.55)", border: "3px solid rgba(255,255,255,.75)", display: "grid", placeItems: "center", overflow: "hidden" }}>
      {name && <span style={{ fontFamily: "Caveat", fontWeight: 700, fontSize: r * 0.15, color: INK, clipPath: `inset(0 ${100 - write * 100}% 0 0)` }}>{name}</span>}
    </div>
  </div>
);
// the graphite wheel with its cosmetic repair mark (ring = highlight)
const Wheel = ({ cx, cy, w, ring = 0, rot = 0, mark = 1 }) => {
  const h = w * 1035 / 1021;
  return <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `rotate(${rot}deg)` }}>
    <Cut id="C08" cx={w / 2} cy={h / 2} w={w} shadow={0} />
    <div style={{ position: "absolute", left: w * MARK.x - w * 0.04, top: h * MARK.y - w * 0.015, width: w * 0.08, height: w * 0.03, borderRadius: w * 0.015, background: "linear-gradient(90deg, #8E8A80, #B7B2A6)", opacity: 0.9 * mark, transform: "rotate(58deg)" }} />
    {ring > 0 && <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}><circle cx={w * MARK.x} cy={h * MARK.y} r={w * 0.09} fill="none" stroke={RED} strokeWidth={Math.max(4, w * 0.012)} strokeDasharray="1000" strokeDashoffset={1000 - 1000 * ring * (2 * Math.PI * w * 0.09) / 1000} /></svg>}
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    sera: at("sera"), size: at("size,"), off: at("off."), two: at("two"), so: at("so"), name: at("name"), yet: at("yet."), one: at("one"), repair: at("repair"),
    mine: at("mine"), enough: at("enough."), hollis: at("hollis"), link: at("link."), last: at("last"), spoke: at("spoke."), she: at("she", 2), checks: at("checks"),
    bag: at("bag."), its: at("it's"), cream: at("cream"), date: at("date."), now: at("now"), actual: at("actual"), same: at("same"), position: at("position."),
    relabels: at("relabels"), paperwork: at("paperwork."), right: at("right"), home: at("home."), cta: tl.cta("shops,", "shops") ?? at("shops,"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook] ?? HOOKS.A, 0), key: [1], hold: 0.6 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round((i + 1) * (hw.length - 1) / (hk.words.length + 0.3)))].s));
  const heads = [
    hk,
    { ...fx(B("Owner / unknown.", T.off), [T.off - 0.2, T.off]), key: [1], hold: 0.4 },
    { ...fx(B("Don't / guess.", T.so), [T.so + 0.1, T.yet]), key: [1], hold: 0.4 },
    { ...fx(B("Show the / mark.", T.mine), [T.mine, at("mark"), at("enough.")]), key: [2], hold: 0.4 },
    { ...fx(B("Beside this / spoke.", T.last), [at("shows"), at("beside"), T.spoke]), key: [2], hold: 0.5 },
    { ...fx(B("Same repair, / same position.", T.same), [T.same, at("repair", 3), at("same", 2), T.position]), key: [3], hold: 0.6 },
    { ...ctaHead(tl, "Shops: / DM SHOP.", T.cta), key: [2, 3] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- 1. the bag rolls in and stops; blank sleeve
  const bagShot = (t, phase) => {
    const d = drift(t, "bg" + phase, 3, 0.3);
    const roll = phase === "hook" ? EASE.out(seg(t, 0, 1.6)) : 1;
    const open = phase === "open" ? EASE.io(seg(t, T.one - 0.1, T.repair + 0.6)) : phase === "end" ? 1 - EASE.io(seg(t, T.relabels - 0.2, T.relabels + 0.8)) : 0;
    const wheelO = phase === "open" ? EASE.camera(seg(t, T.repair, T.rim ?? T.repair + 0.8)) : 0;
    const turn = phase === "open" ? 40 * EASE.io(seg(t, T.mine - 0.3, T.enough)) : 0;
    const name = phase === "end";
    const write = phase === "end" ? ez(t, T.relabels + 0.3, 0.9, EASE.io) : 0;
    const paper = phase === "end" ? spr(t - (at("collection") - 0.2), 180, 16) : 0;
    const ctaP = phase === "end" ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.8)) : 0;
    const bx = lerp(-500, 540, roll), rot = (1 - roll) * -260;
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * ctaP})`, transformOrigin: "540px 1100px" }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1420, height: 600, background: "linear-gradient(180deg, #E1E3E7, #CFD2D7)" }} />
      <Bag x={bx} y={1060} r={360} rot={rot} open={open} name={name ? "Hollis · Bay 14" : null} write={write} t={t} />
      {wheelO > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `circle(${280 * wheelO}px at 540px 1060px)` }}><Wheel cx={540} cy={1060} w={600} rot={turn} /></div>}
      {phase === "end" && <div style={{ position: "absolute", left: 0, top: 0 }}><Cut id="A38" cx={840} cy={740} w={420} shadow={0.25} style={CREAM} /></div>}
      {paper > 0.01 && <div style={{ position: "absolute", left: 80, top: 1440, padding: "14px 22px", borderRadius: 24, ...CARD, display: "flex", gap: 14, alignItems: "center", opacity: clamp(paper * 2), transform: `translateY(${(1 - clamp(paper)) * 40}px)` }}><Tick p={ez(t, at("collection"), 0.6)} size={52} /><span style={inter(44, INK, 600)}>Collection paperwork</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 2. the storage sheet: size known, owner off; two customers; the blank label
  const sheet = (t) => {
    const d = drift(t, "sh", 3, 0.3);
    const c1 = spr(t - (T.two - 0.1), 180, 16), c2 = spr(t - (T.two + 0.25), 180, 16);
    const lab = EASE.camera(seg(t, T.so - 0.1, T.yet));
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 80, top: 600, width: 920, padding: "28px 34px", background: "#FFFEF8", boxShadow: "0 18px 30px -14px rgba(0,0,0,.35)", transform: "rotate(-1.5deg)" }}>
        <div style={inter(42, GREY, 600)}>Stillwater Lane Tire · storage</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, paddingBottom: 14, borderBottom: "2px solid #E2E2E6" }}><span style={inter(48, INK, 650)}>Bay 14</span><span style={inter(48, INK, 650)}>17" winter set</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, alignItems: "center" }}><span style={inter(46, GREY, 600)}>Owner</span>
          <span style={{ width: 360, height: 6, background: RED, borderRadius: 3, opacity: ez(t, T.off - 0.2, 0.4) }} /></div>
      </div>
      {[[c1, 120, "A38", CREAM], [c2, 560, "A07", {}]].map(([c, x, id, st], i) => c > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: 1020, width: 400, height: 260, borderRadius: 28, ...CARD, overflow: "hidden", opacity: clamp(c * 2), transform: `translateY(${(1 - clamp(c)) * 60}px)` }}>
        <div style={{ position: "absolute", inset: 0 }}><Cut id={id} cx={200} cy={130} w={360} shadow={0.25} style={st} /></div>
        <div style={{ position: "absolute", left: 18, top: 14, padding: "4px 14px", borderRadius: 16, background: "rgba(0,0,0,.6)", ...inter(42, "#fff", 600) }}>17"</div></div>)}
      <div style={{ position: "absolute", left: 300, top: lerp(1700, 1360, lab), width: 480, height: 150, borderRadius: 14, background: "#FFFFFF", border: `4px dashed ${GREY}`, opacity: lab, transform: "rotate(2deg)" }} />
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 3. the link, last fall's photo (round, the zip boundary), the entry
  const record = (t) => {
    const d = drift(t, "re", 3, 0.25);
    const pill = spr(t - (T.link - 0.3), 190, 16);
    const circ = EASE.camera(seg(t, T.last - 0.2, at("photo") + 0.3));
    const ring = ez(t, at("beside") - 0.1, 0.6, EASE.io);
    const rec = ez(t, T.she - 0.2, 0.7, EASE.camera);
    const R = lerp(150, 300, circ);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
      <div style={{ position: "absolute", left: 60, top: 580, width: 960, height: 1010, ...CARD, opacity: rec, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center" }}><Wordmark size={42} /><span style={inter(42, GREY, 500)}>· Hollis's hatchback</span></div>
        <div style={{ position: "absolute", left: 40, top: 640, ...land(t, T.she) }}><div style={inter(54, INK, 700)}>Winter set fitted</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}><span style={inter(46, RED, 650)}>Nov 2, 2025</span><span style={inter(42, GREY, 500)}>Wheels · Merrit Forge</span></div></div>
        <div style={{ position: "absolute", left: 40, top: 820, padding: "12px 22px", borderRadius: 30, background: "#F2F2F5", ...land(t, T.cream - 0.2) }}><Who ch="S" name="Stillwater Lane Tire" bg="#5E5CE6" size={56} /></div>
        <div style={{ position: "absolute", left: 600, top: 110, width: 330, height: 220, borderRadius: 20, overflow: "hidden", background: "#EDEFF2", ...land(t, T.cream - 0.1) }}><Cut id="A38" cx={165} cy={115} w={310} shadow={0.25} style={CREAM} /></div>
      </div>
      {rec < 0.99 && <div style={{ opacity: (1 - circ) * (1 - rec) }}><Bag x={540} y={1060} r={360} open={1} t={t} /></div>}
      {/* the photo inside the zip ring */}
      <div data-check="photo" style={{ position: "absolute", left: lerp(240, 100, rec), top: lerp(760, 690, rec), width: 600, height: 600, borderRadius: 300, overflow: "hidden", clipPath: `circle(${R}px at 300px 300px)`, background: "radial-gradient(#55585E, #24262A)", transform: `scale(${lerp(1, 0.85, rec)})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.6)", transformOrigin: `${MARK.x * 100}% ${MARK.y * 100}%` }}><Wheel cx={300} cy={300} w={560} ring={ring} /></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,220,170,.2), rgba(0,0,0,.1))" }} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: circ * (1 - rec) }}><circle cx={540} cy={1060} r={R + 6} fill="none" stroke="#22252A" strokeWidth={10} strokeDasharray="6 7" /></svg>
      {rec < 0.99 && <div style={{ position: "absolute", left: 140, top: 640, padding: "16px 28px", borderRadius: 40, ...CARD, opacity: clamp(pill * 2) * (1 - rec) }}><span style={inter(44, "#0A64D8", 600)}>fuelmybuild.com/hollis</span></div>}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- 4. the actual rim: the photo's spoke edge wipes into today's wheel; same position
  const compare = (t) => {
    const d = drift(t, "cp", 3, 0.3);
    const wipe = EASE.io(seg(t, T.now - 0.1, T.actual + 0.4));
    const ring = ez(t, T.same - 0.1, 0.6, EASE.io);
    const tick = ez(t, T.position, 0.6);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: -40, right: -40, top: 1420, height: 600, background: "linear-gradient(180deg, #E1E3E7, #CFD2D7)" }} />
      <Wheel cx={540} cy={1040} w={760} ring={ring} rot={Math.sin(t * 0.6) * 2} />
      <div data-check="photo" style={{ position: "absolute", left: 80, top: 600, width: 300, height: 300, borderRadius: 150, overflow: "hidden", background: "radial-gradient(#55585E, #24262A)", clipPath: `inset(0 ${wipe * 100}% 0 0)`, boxShadow: "0 0 0 8px #fff" }}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.6)", transformOrigin: `${MARK.x * 100}% ${MARK.y * 100}%` }}><Wheel cx={150} cy={150} w={280} ring={1} /></div></div>
      <div style={{ position: "absolute", left: 760, top: 1440, ...land(t, T.position) }}><Tick p={tick} size={80} /></div>
    </div></Studio></AbsoluteFill>;
  };
  T.rim = at("rim,");

  const shots = [
    { at: 0, render: (t) => bagShot(t, "hook") },
    { at: T.sera - 0.1, render: sheet, enter: { kind: "rise", d: 0.5 } },
    { at: T.one - 0.15, render: (t) => bagShot(t, "open"), enter: { kind: "whip", d: 0.42, dir: 1 } },
    { at: T.hollis - 0.12, render: record, enter: { kind: "match" } },
    { at: T.now - 0.12, render: compare, enter: { kind: "rise", d: 0.5 } },
    { at: T.relabels - 0.3, render: (t) => bagShot(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "caster-roll"], [1.5, "fabric-pull"], [T.sera - 0.2, "slide-soft"], [T.off - 0.2, "pencil-line"], [T.two - 0.1, "tap"], [T.two + 0.25, "tap"], [T.so, "paper-thud"],
    [T.one - 0.1, "string-zip"], [T.mine - 0.3, "creak-soft"], [T.link - 0.3, "pop-soft"], [T.last - 0.2, "portal"], [at("beside") - 0.1, "draw"], [T.she - 0.2, "card-settle"],
    [T.now - 0.1, "wipe"], [T.same - 0.1, "draw"], [T.position, "check"], [T.relabels + 0.3, "pen-write"], [T.relabels - 0.2, "string-zip"], [at("collection"), "check"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 98, root: 50, mode: "major", style: "investigate", cut: T.she - 0.3, ret: T.now - 0.12 };
  return { shots, heads, sfx, music };
}
