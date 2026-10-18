// @ts-nocheck
// S0-11 (lane 0, parts suppliers): "The Return Desk". Ben (K4-04) runs returns for Ridgeback Suspension. A coilover comes
// back filthy with a two-word note from Rick: "It failed." No miles, no photos, nothing about the truck; from the part
// alone he can't tell a bad unit from hard miles, which usually means a refund and Rick gone for good. Except Rick's
// shop (Hartley Garage) wrote one more line on the slip: the truck's build page. Installed 2022, 30,000 miles, a curb
// strike in May, no alignment after. "It didn't fail. It got hit." No refund: a rebuild at cost, and Rick stays.
// Device: a case file on a return desk. Every object on the desk gets matched to a log line: the coilover to its install
// entry, the grime to the mileage, the wheel to the curb strike; the alignment slot stays empty.
// Look: warm white desk (#F3EFE8) under a soft warehouse (F04), kraft, ink, a red case tab. Inter + handwriting italic.
// Transitions: portal into the note, rise (note -> Ben at the desk), portal into the coilover, morph (clean <-> worn,
// freezes half-and-half), object wipe (the refund form slides across), match (the form moves off the slip), shape morph
// (the handwritten line lifts and unfolds into the truck's page), case-file thumbs fly to their log lines, silence
// punch (verdict), object wipe (the new box slides in), CTA over the box and the truck, note flips face up (loop).
// remocn (ported): typewriter (handwritten slip line), marker-highlight (matched rows), focus-blur-resolve, period-drop.
// New vs S0-03: clean/worn wipe morph, matching rows with flying thumbs.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed } from "../kit";
import { Full, Scrim, glass, font } from "./s0kit";

export const HOOK_WORDS = 9;
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#F3EFE8";
export const TEXT = { font: "Inter", weight: 650, size: 108, min: 74, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["F04", "D14", "C20", "K4-04", "A22", "A23", "B07"];
const DESK = "#F3EFE8", PAPER = "#FBF8F1", HAND = { fontFamily: "Inter", fontStyle: "italic", fontWeight: 600, letterSpacing: "-0.02em", color: "#2A2B35" };
const CLEAN = "saturate(1.35) brightness(1.18) contrast(1.08)", WORN = "sepia(.55) saturate(.7) brightness(.72) contrast(1.15)";

// the desk set: soft warehouse above, desk surface below the edge at y
const Desk = ({ t, edge = 1240, dim = 0 }) => <>
  <Full id="F04" t={t} k0={1.2} k1={1.26} fy={0.45} blur={16} sat={0.6} dim={0.05 + dim} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(243,239,232,.78), rgba(243,239,232,.55) 50%, rgba(243,239,232,.2))" }} />
  <div style={{ position: "absolute", left: 0, right: 0, top: edge, bottom: 0, background: `linear-gradient(180deg, #E9E3D8, ${DESK} 8%, #EEE8DE)`, boxShadow: "0 -2px 0 rgba(0,0,0,.06)" }} />
</>;
// the coilover with a clean/worn wipe: w = 0 worn, 1 clean; split = wipe position 0..1 along x
const Coil = ({ cx, cy, w, rot = 0, clean = 0, dust = 0, t = 0 }) => {
  const h = w / (1579 / 1023);
  return <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `rotate(${rot}deg)` }}>
    <img src={src("C20")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: WORN }} />
    {clean > 0.001 && <img src={src("C20")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: CLEAN, clipPath: `inset(0 ${(1 - clean) * 100}% 0 0)` }} />}
    {clean > 0.02 && clean < 0.98 && <div style={{ position: "absolute", top: "-5%", bottom: "-5%", left: `${clean * 100}%`, width: 6, marginLeft: -3, background: "rgba(255,255,255,.9)", boxShadow: "0 0 18px rgba(255,255,255,.9)" }} />}
    {dust > 0 && Array.from({ length: 14 }, (_, i) => { const ph = (t * 0.35 + i * 0.137) % 1; return <div key={i} style={{ position: "absolute", left: `${18 + ((i * 53) % 64)}%`, top: `${50 + ph * 70}%`, width: 7, height: 7, borderRadius: 4, background: "rgba(120,96,70,.55)", opacity: dust * (1 - ph) }} />; })}
  </div>;
};
const Note = ({ x, y, w = 560, h = 300, flip = 0, rot = 0, s = 1, text = "It failed." }) => {
  const a = flip * 180, back = a > 90;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `perspective(1600px) rotate(${rot}deg) rotateY(${a}deg) scale(${s})`, zIndex: 20 }}>
    <div style={{ position: "absolute", inset: 0, background: PAPER, borderRadius: 8, boxShadow: "0 18px 30px -16px rgba(0,0,0,.4)", transform: back ? "scaleX(-1)" : undefined,
      backgroundImage: "repeating-linear-gradient(180deg, transparent 0 58px, rgba(90,120,170,.18) 58px 60px)" }}>
      {!back && <div style={{ position: "absolute", left: 40, top: h / 2 - 60, ...HAND, fontSize: 96 }}>{text}</div>}
    </div>
  </div>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    ben: at("ben", 1), note: at("note"), says: at("says:"), failed: at("'it"), how: at("failed", 2), no1: at("no", 1), photos: at("photos,"), nothing: at("nothing"),
    and: at("and", 2), alone: at("alone,"), cant: at("can't"), bad: at("bad"), hard: at("hard"), which: at("which"), refund: at("refund,"), gone: at("gone"),
    except: at("except"), one: at("one"), slip: at("slip:"), build: at("build"), page: at("page."), inst: at("installed"), thirty: at("thirty"), curb: at("curb"), may: at("may."),
    noal: at("no", 3), it1: at("it", 2), didnt: at("didn't"), it2: at("it", 3), hit: at("hit."), so: at("so"), ben2: at("ben", 2), rebuild: at("rebuild"), stays: at("stays."), dm: tl.cta("dm") ?? at("dm"),
  };
  const CUT = tl.cut, BEN = T.ben - 0.2 + 0.0, MORPH = T.and - 0.3, REF = T.which - 0.35, SLIP = T.except - 0.3, VERD = T.it1 - 0.12, OUT = T.so - 0.25;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["Came", hw[2].s], ["back", hw[3].s], ["filthy.", hw[4].s]], { key: [2], hold: 0.5 }), W_([["One-line", hw[7].s], ["note.", hw[8].s]], { exit: { at: T.ben - 0.4, mode: "up" } })]
    : hook === "B" ? [W_([["Parts", hw[2].s], ["brands:", hw[3].s]], { hold: 0.4 }), W_([["Your", hw[7].s], ["returns", hw[8].s], ["miss", hw[9].s], ["this.", hw[10].s]], { key: [2], exit: { at: T.ben - 0.4, mode: "up" } })]
    : [W_([["A", hw[0].s], ["refund", hw[1].s], ["loses", hw[3].s], ["him.", hw[5].s]], { key: [2], hold: 0.4 }), W_([["The", hw[6].s], ["page", hw[8].s], ["kept", hw[9].s], ["him.", hw[10].s]], { key: [2], exit: { at: T.ben - 0.4, mode: "up" } })];
  const heads = [
    ...hk,
    W_([["Ben", T.ben], ["runs", at("runs")], ["returns.", at("returns,")]], { hold: 0.7 }),
    W_([["Failed", T.how], ["how?", at("how,")]], { key: [1], hold: 0.5 }),
    W_([["No", T.no1], ["miles.", at("miles,")], ["No", at("no", 2)], ["photos.", T.photos]], { hold: 0.7 }),
    W_([["Bad", T.bad], ["unit", at("unit,")], ["or", at("or")], ["hard", T.hard, 1], ["miles?", at("miles.", 2), 1]], { key: [3, 4], hold: 0.5 }),
    W_([["Refund.", T.refund], ["Rick", at("rick", 1)], ["gone.", T.gone]], { key: [2], out: "down" }),
    W_([["One", T.one], ["more", at("more")], ["line.", at("thing")]], { key: [2], hold: 0.9 }),
    W_([["Installed", T.inst], ["2022.", at("twenty-two,")]], { hold: 0.4 }),
    W_([["30,000", T.thirty], ["miles.", at("miles", 3)]], { hold: 0.4 }),
    W_([["Curb", T.curb], ["strike,", at("strike")], ["May.", T.may]], { key: [0, 1], hold: 0.4 }),
    W_([["No", T.noal], ["alignment.", at("alignment")]], { hold: 0.6 }),
    W_([["It", T.it1], ["didn't", T.didnt], ["fail.", at("fail.")]], { hold: 0.4 }),
    W_([["It", T.it2], ["got", at("got")], ["hit.", T.hit]], { key: [2], hold: 0.5 }),
    W_([["Rebuild,", T.rebuild], ["not", T.rebuild + 0.3], ["refund.", T.rebuild + 0.55]], { key: [0], hold: 0.8 }),
    { ...ctaHead(tl, "DM PARTS. / See where they end up.", T.dm), key: [1] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shot 1 (hook): the box on the desk; the worn coilover rises out with dust, the note slides after it
  const BOX = { cx: 540, cy: 1300, w: 640 };
  const hookShot = (t) => {
    const r = EASE.out(seg(t, -0.2, 2.2)), n = spr(t - 2.0, 180, 18);
    const refundIn = hook === "C" ? spr(t - 0.25, 190, 18) * (1 - ez(t, hw[6].s - 0.1, 0.4, EASE.in)) : 0;
    return <AbsoluteFill>
      <Desk t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * seg(t, 0, CUT)})`, transformOrigin: "540px 1100px" }}>
        <Cut id="D14" cx={BOX.cx} cy={BOX.cy} w={BOX.w} shadow={0.35} />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BOX.cy - 60, overflow: "hidden" }}>
          <Coil cx={560} cy={lerp(1260, 900, r)} w={640} rot={lerp(10, -8, r)} dust={1} t={t} />
        </div>
        <Note x={lerp(1200, 430, n)} y={1370} w={460} h={200} rot={lerp(20, -4, n)} />
        {refundIn > 0.01 && <div style={{ position: "absolute", left: lerp(1200, 520, refundIn), top: 1360, width: 480, height: 300, background: "#fff", borderRadius: 10, boxShadow: "0 18px 30px -16px rgba(0,0,0,.4)", padding: 30, boxSizing: "border-box", zIndex: 25 }}>
          <div style={font("Inter", 48, INK, 700)}>Refund</div><div style={{ marginTop: 18, height: 6, width: 300, background: "#E5E5EA" }} /><div style={{ marginTop: 26, height: 6, width: 360, background: "#E5E5EA" }} /></div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2: Ben at the desk; the note in front, flips (blank back); he turns the coilover
  const NOTE = { x: 80, y: 1310, w: 520, h: 260 };
  const desk = (t) => {
    const flip = ez(t, at("failed.'") + 0.35, 0.5, EASE.camera);
    const turn = Math.sin((t - T.how) * 1.6) * 14 * seg(t, T.how - 0.3, T.how + 0.3);
    const d = drift(t, "dk", 4, 0.3);
    return <AbsoluteFill>
      <Desk t={t} edge={1300} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1310, overflow: "hidden" }}><Cut id="K4-04" cx={720} cy={1180} w={720} shadow={0} /></div>
        <Coil cx={560 + 40 * Math.sin(t * 0.7)} cy={1130 + Math.cos(t * 0.9) * 8} w={540} rot={-24 + turn} />
        <Note x={NOTE.x} y={NOTE.y} w={NOTE.w} h={NOTE.h} flip={flip} rot={-3} />
        <div style={{ position: "absolute", left: 620, top: 1340, width: 360, padding: "20px 24px", background: PAPER, borderRadius: 8, boxShadow: "0 14px 24px -14px rgba(0,0,0,.35)", transform: "rotate(2deg)",
          opacity: ez(t, at("rick's") - 0.1, 0.3) }}>
          <div style={font("Inter", 40, GREY, 500)}>Return slip</div><div style={{ ...font("Inter", 44, INK, 600), marginTop: 6 }}>R. Doyle · '72 F-100</div>
        </div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: macro on the coilover: clean <-> worn wipe twice, freezes half-and-half; the refund form wipes across
  const morph = (t) => {
    const a = MORPH + 0.5;
    const c = t < a ? 0 : t < T.bad ? 0.5 - 0.5 * Math.cos((t - a) * Math.PI * 1.1) : lerp(0.5 - 0.5 * Math.cos((T.bad - a) * Math.PI * 1.1), 0.5, ez(t, T.bad, 0.4));
    return <AbsoluteFill>
      <Desk t={t} edge={1500} />
      <Coil cx={540} cy={1080} w={1000} rot={-16 + 4 * Math.sin(t * 0.6)} clean={clamp(c)} />
      <div style={{ position: "absolute", left: 80, top: 1450, ...font("Inter", 44, GREY, 600), opacity: ez(t, T.bad - 0.1, 0.3) }}>Bad unit?</div>
      <div style={{ position: "absolute", right: 80, top: 1450, ...font("Inter", 44, GREY, 600), opacity: ez(t, T.hard - 0.1, 0.3) }}>Hard miles?</div>
    </AbsoluteFill>;
  };
  // ---------- shot 4/5: the refund form over the slip; then the slip's last line lifts into the truck's page; case file
  const FORM = { x: 96, y: 626, w: 888, h: 850 };
  const PAGE = { x: 60, y: 540, w: 960 };
  const slip = (t, phase) => {
    const off = phase === 0 ? 0 : ez(t, SLIP + 0.05, 0.6, EASE.camera); // the form moves aside, uncovering the slip
    const pen = phase === 0 ? Math.sin(t * 3) * 10 : 0;
    const lift = ez(t, T.build - 0.15, 0.75, EASE.camera); // handwritten line -> page card
    const d = drift(t, "sl", 3, 0.3);
    const rows = [
      { t: T.inst - 0.1, thumb: "coil", a: "Coilovers · Ridgeback", b: "Apr 2022 · Hartley Garage" },
      { t: T.thirty - 0.1, thumb: "grime", a: "30,000 miles", b: "since install" },
      { t: T.curb - 0.15, thumb: "wheel", a: "Curb strike · May 2026", b: "logged by Rick", red: true },
      { t: T.noal - 0.1, thumb: "empty", a: "Alignment", b: "nothing logged", empty: true },
    ];
    const thumb = (k) => k === "coil" ? <Coil cx={70} cy={60} w={150} rot={-18} />
      : k === "grime" ? <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 18 }}><img src={src("C20")} style={{ position: "absolute", width: 420, left: -190, top: -40, filter: WORN }} /></div>
      : k === "wheel" ? <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 18 }}><img src={src("A22")} style={{ position: "absolute", width: 600, left: -400, top: -110 }} /></div>
      : <div style={{ position: "absolute", inset: 6, borderRadius: 16, border: "4px dashed #C7C7CC" }} />;
    return <AbsoluteFill>
      <Desk t={t} edge={1700} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        {/* the return slip with its extra handwritten line */}
        <div style={{ position: "absolute", left: 90, top: 640, width: 900, height: 820, background: PAPER, borderRadius: 10, boxShadow: "0 18px 30px -16px rgba(0,0,0,.35)", transform: `rotate(-1.5deg) scale(${1 - 0.06 * lift})`, opacity: 1 - 0.85 * lift }}>
          <div style={{ padding: "40px 48px" }}>
            <div style={font("Inter", 44, GREY, 500)}>Return slip · Ridgeback Suspension</div>
            <div style={{ ...font("Inter", 56, INK, 650), marginTop: 18 }}>R. Doyle · '72 F-100</div>
            <div style={{ ...HAND, fontSize: 60, marginTop: 30 }}>It failed.</div>
            <div style={{ ...font("Inter", 42, GREY, 500), marginTop: 50 }}>Installed by Hartley Garage</div>
            <div style={{ ...HAND, fontSize: 48, marginTop: 34, color: "#1F3A8A", opacity: 1 - lift }}>build: <Typed t={t} t0={T.one - 0.1} t1={T.slip + 0.3} text="fuelmybuild.com/rdoyle/f100" caret="rgba(0,0,0,0)" keepCaret={0} style={{}} /></div>
          </div>
        </div>
        {/* the refund form (shot 4) slides off to the left on "Except" */}
        <div style={{ position: "absolute", left: FORM.x - off * 1100, top: FORM.y, width: FORM.w, height: FORM.h, background: "#fff", borderRadius: 12, boxShadow: "0 24px 40px -20px rgba(0,0,0,.45)", padding: 48, boxSizing: "border-box",
          transform: `rotate(${2 - off * 8}deg)`, zIndex: 10 }}>
          <div style={font("Inter", 64, INK, 700)}>Refund request</div>
          {["Order", "Reason", "Amount"].map((l, i) => <div key={l} style={{ marginTop: 40 }}><div style={font("Inter", 40, GREY, 500)}>{l}</div><div style={{ height: 4, background: "#E5E5EA", marginTop: 34 }} /></div>)}
          <div style={{ position: "absolute", left: 48, bottom: 60, width: 60, height: 60, borderRadius: 10, border: "5px solid #C7C7CC" }} />
          <div style={{ position: "absolute", left: 130, bottom: 66, ...font("Inter", 44, INK, 600) }}>Approve refund</div>
        </div>
        {/* pen hovering over the approve box */}
        <div style={{ position: "absolute", left: 210 - off * 1100, top: 1180 + pen - 120 * (1 - spr(t - (REF + 0.3), 160, 16)), width: 30, height: 360, borderRadius: 15, background: "linear-gradient(90deg,#1C1C1E,#3A3A3C,#1C1C1E)", transform: "rotate(28deg)", transformOrigin: "50% 100%", zIndex: 12,
          opacity: phase === 0 ? 1 : 1 - off }} />
        {/* the page: the handwritten line lifts off and unfolds into a frameless card; then the case-file rows */}
        {lift > 0.01 && <div style={{ position: "absolute", left: lerp(150, PAGE.x, lift), top: lerp(1230, PAGE.y, lift), width: lerp(760, PAGE.w, lift), height: lerp(70, 1040, lift), borderRadius: lerp(6, 40, lift), overflow: "hidden", zIndex: 20,
          background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 40px 60px -30px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: PAGE.w, height: 1040, opacity: clamp((lift - 0.5) * 2) }}>
            <div style={{ height: 300, position: "relative", background: "linear-gradient(180deg,#EEF2F7,#E3E8EF)", overflow: "hidden" }}>
              <Cut id="A22" cx={PAGE.w / 2 + 40} cy={170} w={560} shadow={0.4} />
              <div style={{ position: "absolute", left: 24, top: 22, padding: "8px 20px", borderRadius: 30, background: "rgba(255,255,255,.85)", ...font("Inter", 40, INK, 600) }}>Fuel<span style={{ color: RED }}>My</span>Build</div>
            </div>
            <div style={{ padding: "22px 36px 0" }}><div style={font("Inter", 58, INK, 650)}>Rick's '72 F-100</div></div>
            {rows.map((r, i) => { const q = spr(t - r.t, 200, 19), on = t >= r.t;
              const hl = r.red ? ez(t, r.t + 0.2, 0.4) : 0;
              return <div key={i} style={{ position: "absolute", left: 30, top: 410 + i * 155, width: PAGE.w - 60, height: 140, display: "flex", alignItems: "center", gap: 24, padding: "0 16px", boxSizing: "border-box", borderRadius: 22,
                background: hl ? `rgba(244,48,52,${0.08 * hl})` : "transparent", opacity: on ? clamp(q * 2) : 0, transform: `translateX(${(1 - clamp(q)) * 60}px)` }}>
                <div style={{ width: 150, height: 120, position: "relative", flex: "none", borderRadius: 18, background: "#F2F2F5", transform: `translate(${(1 - clamp(q)) * -200}px, ${(1 - clamp(q)) * 300}px) scale(${0.6 + 0.4 * clamp(q)})` }}>{thumb(r.thumb)}</div>
                <div><div style={font("Inter", 48, r.empty ? GREY : INK, 600)}>{r.a}</div><div style={font("Inter", 40, r.red ? RED : GREY, 500)}>{r.b}</div></div>
              </div>; })}
          </div>
        </div>}
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 6: verdict: Ben, straight at the card; the note goes face down
  const verdict = (t) => {
    const d = drift(t, "vd", 3, 0.3), down = ez(t, T.hit - 0.1, 0.5, EASE.camera);
    return <AbsoluteFill>
      <Desk t={t} edge={1300} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1310, overflow: "hidden", transform: dT(d, 0.6) }}><Cut id="K4-04" cx={540} cy={1240} w={900} shadow={0} /></div>
      <Note x={260} y={1380} w={560} h={260} flip={1 - 0.0 * down} rot={-3 + 2 * down} s={1 - 0.05 * down} />
    </AbsoluteFill>;
  };
  // ---------- shot 7: the new box; the rebuild goes in; the F-100 rolls along the desk edge; CTA; the note flips face up
  const outro = (t) => {
    const box = spr(t - (OUT + 0.1), 170, 19), kit = spr(t - (T.rebuild - 0.2), 180, 15), truck = EASE.out(seg(t, T.ben2 - 0.2, T.stays + 0.6));
    const loop = ez(t, tl.last + 0.25, 0.5, EASE.camera);
    return <AbsoluteFill>
      <Desk t={t} edge={1300} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1270, overflow: "hidden" }}>
        <Coil cx={540} cy={lerp(500, 1180, clamp(kit))} w={560} rot={-12} clean={1} />
      </div>
      <div style={{ transform: `translateX(${(1 - box) * 900}px)` }}><Cut id="D14" cx={540} cy={1220} w={620} shadow={0.35} /></div>
      <div style={{ position: "absolute", left: 640, top: 1150, padding: "8px 22px", background: "#fff", borderRadius: 10, boxShadow: "0 8px 16px rgba(0,0,0,.2)", ...font("Inter", 42, RED, 650), transform: `rotate(-4deg) scale(${spr(t - (T.rebuild + 0.4), 240, 14)})` }}>Rebuild · at cost</div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${lerp(-1100, 0, truck)}px)` }}><Cut id="A23" cx={540} cy={1500} w={760} shadow={0.45} /></div>
      {loop > 0 && <Note x={260} y={1320} w={560} h={260} flip={1 - loop} rot={-3} />}
    </AbsoluteFill>;
  };
  const FORMWIPE = (t, p) => { const x = lerp(W + 50, FORM.x, EASE.out(p)); return <div style={{ position: "absolute", left: x, top: FORM.y, width: FORM.w, height: FORM.h, background: "#fff", borderRadius: 12, boxShadow: "-30px 24px 40px -20px rgba(0,0,0,.45)", zIndex: 50, transform: "rotate(2deg)" }} />; };
  const BOXWIPE = (t, p) => { const x = lerp(W + 400, -400, EASE.io(p)); return <div style={{ position: "absolute", left: 0, top: 0, zIndex: 50, filter: "url(#mbx3)" }}><Cut id="D14" cx={x} cy={1000} w={900} shadow={0} /></div>; };
  const shots = [
    { at: 0, render: hookShot },
    { at: CUT, render: desk, enter: { kind: "portal", d: 0.6, rect: { x: 430, y: 1370, w: 460, h: 200 }, r: 8 } },
    { at: MORPH, render: morph, enter: { kind: "portal", d: 0.6, rect: { x: 330, y: 960, w: 460, h: 300 }, r: 30 } },
    { at: REF, render: (t) => slip(t, 0), enter: { kind: "wipe", d: 0.7, dir: 1, edge: (p) => lerp(W + 50, FORM.x, EASE.out(p)), obj: FORMWIPE } },
    { at: SLIP, render: (t) => slip(t, 1), enter: { kind: "match" } },
    { at: VERD, render: verdict, enter: { kind: "punch" } },
    { at: OUT, render: outro, enter: { kind: "wipe", d: 0.7, dir: 1, edge: (p) => lerp(W + 400, -400, EASE.io(p)) + 300, obj: BOXWIPE } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    ...(hook === "C" ? [[0.25, "slide-soft"], [hw[6].s - 0.1, "paper-fold"]] : []),
    [0.05, "part-lift"], [0.6, "paper-flutter", 0.5], [2.0, "slide-soft"], [at("rick's") - 0.1, "photo-settle"], [at("failed.'") + 0.35, "card-fold"],
    [T.how - 0.3, "exhaust-rattle", 0.6], [MORPH + 0.5, "shimmer-soft"], [T.bad, "tick-soft"], [T.hard, "tick-soft"], [REF + 0.3, "pen-write", 0.5],
    [SLIP + 0.05, "slide-soft"], [T.one - 0.1, "pencil-write"], [T.build - 0.15, "paper-unfold"], [T.inst - 0.1, "card-settle"], [T.thirty - 0.1, "card-settle"],
    [T.curb - 0.15, "card-settle"], [T.curb + 0.05, "emph-pop"], [T.noal - 0.1, "muted-stop"], [T.hit - 0.1, "paper-thud"],
    [T.rebuild - 0.2, "part-lift"], [T.rebuild + 0.2, "paper-thud"], [T.rebuild + 0.4, "chip-pop"], [T.ben2 - 0.2, "air-glide-long"], [ctaT, "cta-pop"], [tl.last + 0.25, "card-fold"],
  ];
  // music: investigate, minor; dead air into the verdict ("It didn't fail.") and back in on "So no refund"
  const music = { bpm: 98, root: 50, mode: "minor", style: "investigate", cut: VERD - 0.35, ret: OUT + 0.1, room: "office" };
  return { shots, heads, sfx, music };
}
