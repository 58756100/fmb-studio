// @ts-nocheck
// B-L1 (lane B, collectors): "Where's the proof?" An appraisal inquiry asks Maya to document her 240Z's brake work;
// the photos show the car, not the install. Maya opens her build: brake kit, brand, dated install log, before/during/after.
// Hero: 240Z (B02) + brake kit (C03); Maya E02; underside explainer G03; the 240Z job sequence (lab photos L01-L03, same car).
// Transitions: tap-to-open (attachment -> photo), magnifier lens on the wheel, pull into the gallery strip, object wipe
// (floor jack rolls across: "underneath"), match cut back to the inquiry, tap-to-open (Maya's chip -> her build page),
// card lift (log entry out of the page), CTA landing.
// remocn (ported): simulated-cursor tap ripple, kinetic text rise, typewriter (URL), micro-scale-fade (callouts),
// period-drop (CTA). New vs the previous reel (A-L3): simulated-cursor ripple, callout leader draw.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD, Studio, Avatar, LetterAv, Pic, rise, Callout, PageCard } from "./laneB";

export const HOOK_WORDS = 3;
export const TAIL = 1.0;
export const BG = HBG;
export const TEXT = { ...HTEXT, size: 116 };
export const IMAGES = ["B02", "C03", "E02", "G03", "D13", "A04", "L01", "L02", "L03"];
const HOOKS = { A: "Where's the proof?", B: "Installed isn't / documented.", C: "This photo misses / something." };
const MAYA = { x: 0.5, y: 0.17, z: 2.3 };

// the inquiry card: sender, message, attachment (photo or three empty slots)
const CARD_Y = 600, ATT = { x: 100, y: CARD_Y + 300, w: 880, h: 500 };
const Inquiry = ({ t, slots = 0, chip = 0, push = 0 }) => (
  <div style={{ position: "absolute", left: 60, top: CARD_Y, width: 960, height: 860, ...CARD, transform: `scale(${1 + 0.03 * push})`, transformOrigin: "50% 70%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "36px 40px 0" }}>
      <LetterAv ch="H" size={84} bg="#5E5CE6" />
      <div><div style={inter(42, INK)}>Harlow Appraisals</div><div style={inter(36, GREY, 500)}>Inquiry · 240Z brake work</div></div>
    </div>
    <div style={{ ...inter(48, "#1C1C1E", 500, { whiteSpace: "normal", lineHeight: 1.22 }), padding: "26px 40px 0" }}>Please document the brake work on the 240Z.</div>
    {!slots ? <div style={{ position: "absolute", left: ATT.x - 60, top: ATT.y - CARD_Y, width: ATT.w, height: ATT.h, borderRadius: 30, overflow: "hidden" }}>
      <img src={src("B02")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.02 * Math.sin(t * 0.5)})` }} />
    </div> : <div style={{ position: "absolute", left: ATT.x - 60, top: ATT.y - CARD_Y, width: ATT.w, height: ATT.h, display: "flex", gap: 20 }}>
      {["Before", "During", "After"].map((l, i) => { const p = spr(t - slots - i * 0.1, 200, 18); return <div key={l} style={{ flex: 1, borderRadius: 28, border: "4px dashed #C7C7CC", display: "grid", placeItems: "center",
        opacity: clamp(p * 2), transform: `scale(${0.9 + 0.1 * p})`, ...inter(42, GREY, 500) }}>{l}</div>; })}
    </div>}
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    maya: at("maya's"), brake: at("brake"), visible: at("visible"), inst: at("installation"), these: at("these"), photos: at("photos"), but: at("but"),
    under: at("underneath"), cal: at("calipers"), brk: at("brackets"), lines: at("lines"), which: at("which"), send: at("send"), opens: at("opens"),
    fuel: at("fuel"), kit2: at("brake", 3), brand: at("brand"), dated: at("dated"), log: at("log"), then: at("then"), before: at("before"), during: at("during"),
    after: at("after"), now: at("now"), inspect: at("inspect"), follow: at("follow"),
  };
  const TAP1 = T.maya - 0.1, WIPE = T.but - 0.05, BACK = T.which - 0.08, TAP2 = at("maya") - 0.08;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const heads = [
    { words: wordsFor(tl.hook, HOOKS[hook], 0), key: hook === "A" ? [2] : [] },
    fx(B("Maya's 240Z", T.maya), [T.maya, at("two-forty")]),
    B("Brake kit: visible.", T.brake, { key: [2] }),
    B("Installation?", T.inst, { key: [0], hold: 1.1 }),
    B("Photos don't show it.", T.photos),
    B("The work is underneath.", T.but + 0.3, { key: [3], out: "down" }),
    B("Calipers,", T.cal, { hold: 0.8 }),
    B("Brackets,", T.brk, { hold: 0.7 }),
    B("Brake lines.", T.lines - 0.4, { hold: 0.9 }),
    B("Which would you send?", T.which, { key: [3] }),
    B("Maya opens the build", T.opens - 0.5),
    B("Brake kit, brand,", T.kit2, { key: [2] }),
    B("Dated install log.", T.dated, { key: [0] }),
    B("Before, during, after.", T.before, { hold: 0.8 }),
    B("Work to inspect.", T.now + 0.2, { key: [2] }),
    B("Follow for / documented builds", T.follow),
  ];
  heads[heads.length - 1].dot = at("builds") + 0.35;

  // ---------- shot 1 + 4: the inquiry
  const inquiry = (t, phase) => {
    const d = drift(t, "inq", 3, 0.25);
    const chipAt = BACK + 0.6;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        <Inquiry t={t} slots={phase === 2 ? BACK + 0.15 : 0} push={phase === 1 ? seg(t, 0, TAP1) : 0} />
        {phase === 2 && <div style={{ position: "absolute", left: 60, top: 1490, display: "flex", alignItems: "center", gap: 18, padding: "14px 30px 14px 14px", borderRadius: 60, ...CARD, ...rise(t, chipAt) }}>
          <Avatar id="E02" size={84} face={MAYA} bg="#E8DCCB" /><span style={inter(44, INK)}>Maya's build</span>
        </div>}
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 2: Maya's photo, the lens on the wheel, then the gallery that lacks the install
  const PH = { x: 60, y: 600, w: 960, h: 640 };
  const wheel = { x: PH.x + 0.22 * PH.w, y: PH.y + 0.6 * PH.h };
  const photo = (t) => {
    const lens = track(t, { x: 820, y: 1500, r: 0, o: 0 }, [[T.brake - 0.25, { x: wheel.x, y: wheel.y, r: 150, o: 1 }, 0.55, EASE.camera], [T.inst - 0.2, { r: 0, o: 0 }, 0.35, EASE.in]]);
    const g = ez(t, T.these - 0.1, 0.7, EASE.camera); // photo -> first tile of the gallery
    const pull = ez(t, T.inst - 0.2, 0.6, EASE.camera);
    const ph = { x: lerp(PH.x, 60, g), y: lerp(PH.y, 640, g), w: lerp(PH.w, 300, g), h: lerp(PH.h, 300, g) };
    const d = drift(t, "ph", 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * pull * (1 - g)})`, transformOrigin: "50% 45%" }}>
        <Pic id="B02" t={t} {...ph} r={lerp(36, 28, g)} k0={1.0} k1={1.06} t1={T.these} fx={0.4} />
        {g > 0.01 && [{ id: "B02", fx: 0.85 }, { id: "B02", fx: 0.1 }].map((p, i) => {
          const q = spr(t - (T.these + 0.1 + i * 0.12), 190, 19);
          return <Pic key={i} id={p.id} t={t} x={390 + i * 330 + (1 - q) * 400} y={640} w={300} h={300} r={28} fx={p.fx} o={clamp(q * 2)} />;
        })}
        {g > 0.01 && <div style={{ position: "absolute", left: 60, top: 1000, width: 960, height: 380, borderRadius: 36, border: "5px dashed #C7C7CC", display: "grid", placeItems: "center", ...rise(t, T.photos + 0.2) }}>
          <div style={{ textAlign: "center" }}><div style={inter(48, GREY)}>Install photos</div><div style={{ ...inter(64, RED), marginTop: 8 }}>None</div></div>
        </div>}
        {g < 0.05 && <div style={{ position: "absolute", left: 60, top: 1290, display: "flex", alignItems: "center", gap: 18, ...rise(t, TAP1 + 0.25) }}>
          <Avatar id="E02" size={96} face={MAYA} bg="#E8DCCB" /><div><div style={inter(46, INK)}>Maya</div><div style={inter(38, GREY, 500)}>1972 240Z · owner</div></div>
        </div>}
        {lens.o > 0.01 && <div style={{ position: "absolute", left: lens.x - lens.r, top: lens.y - lens.r, width: lens.r * 2, height: lens.r * 2, borderRadius: "50%", overflow: "hidden", opacity: lens.o,
          boxShadow: `0 0 0 10px #1C1C1E, 0 0 0 14px rgba(255,255,255,.7), 0 30px 50px rgba(0,0,0,.35)`, background: "#2a2a2c" }}>
          <img src={src("L03")} style={{ position: "absolute", width: lens.r * 7.2, left: -lens.r * 3.05, top: -lens.r * 1.95 }} />
        </div>}
        {lens.o > 0.01 && <div style={{ position: "absolute", left: lens.x + lens.r * 0.62, top: lens.y + lens.r * 0.62, width: 30, height: lens.r * 1.3, borderRadius: 15, background: "#1C1C1E", transform: "rotate(-45deg)", transformOrigin: "50% 0", opacity: lens.o }} />}
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 3: underneath (explainer photo with callouts)
  const G = { x: 60, y: 600, w: 960, h: 720 };
  const pt = (fx, fy) => ({ x: G.x + fx * G.w, y: G.y + fy * G.h });
  const under = (t) => {
    const c = pt(0.66, 0.5), b = pt(0.55, 0.27), l = pt(0.77, 0.1);
    return <AbsoluteFill><Studio t={t}>
      <Pic id="G03" t={t} {...G} k0={1.0} k1={1.1} t0={WIPE} t1={BACK} fx={0.6} fy={0.4} />
      <Callout t={t} t0={T.cal - 0.1} x={260} y={1180} px={c.x} py={c.y} text="Caliper" out={T.brk - 0.2} red />
      <Callout t={t} t0={T.brk - 0.1} x={250} y={930} px={b.x} py={b.y} text="Bracket" out={at("brake", 2) - 0.2} red />
      <Callout t={t} t0={at("brake", 2) - 0.05} x={330} y={700} px={l.x} py={l.y} text="Brake line" out={BACK - 0.2} red />
      <div style={{ position: "absolute", left: 60, top: 1360, ...rise(t, WIPE + 0.4), ...inter(42, GREY, 500) }}>Underneath: calipers, brackets, lines</div>
    </Studio></AbsoluteFill>;
  };
  // ---------- shot 5: Maya's build page, the parts row, then the dated log lifted out of it
  const page = (t) => {
    const lift = ez(t, T.dated - 0.15, 0.6, EASE.camera);
    const brandF = ez(t, T.brand - 0.1, 0.3);
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    const d = drift(t, "lg", 3, 0.25);
    const photos = [["L01", "Before", T.before], ["L02", "During", T.during], ["L03", "After", T.after]];
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.04 * cta})`, transformOrigin: "50% 50%" }}>
        <PageCard t={t} y={600} h={960} hero="B02" heroH={360} fy={0.62} title="Maya's 240Z" owner="Maya · Public build" ownerAv={<Avatar id="E02" size={56} face={MAYA} bg="#E8DCCB" />}
          url="fuelmybuild.com/maya/240z" urlAt={T.fuel + 0.1} brandAt={T.fuel - 0.1} s={1 - 0.05 * lift} o={1 - 0.65 * lift}>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 24, padding: "18px 24px", borderRadius: 30, background: "#F2F2F7", ...rise(t, T.kit2 - 0.15) }}>
            <div style={{ width: 120, height: 100, position: "relative" }}><Cut id="C03" cx={60} cy={50} w={104} shadow={0.2} /></div>
            <div style={{ flex: 1 }}><div style={inter(36, GREY, 500)}>Parts registry</div><div style={inter(52, INK)}>Brake kit</div></div>
            <div style={{ padding: "10px 22px", borderRadius: 24, background: brandF > 0 ? `rgba(244,48,52,${0.1 * brandF})` : "#fff", boxShadow: `0 0 0 ${4 * brandF}px ${RED}` }}>
              <div style={inter(32, GREY, 500)}>Brand</div><div style={inter(48, INK)}>Halden</div></div>
          </div>
        </PageCard>
        {lift > 0.01 && <div style={{ position: "absolute", left: 60, top: lerp(1300, 640, lift), width: 960, ...CARD, padding: "36px 40px 40px", opacity: clamp(lift * 2.5), zIndex: 8,
          transform: `${dT(d, 0.5)} scale(${0.94 + 0.06 * lift})` }}>
          <div style={inter(38, GREY, 500)}>Build log · dated entry</div>
          <div style={{ ...inter(64, INK), marginTop: 6 }}>Aug 9, 2025 <span style={{ color: GREY }}>·</span> Brake install</div>
          <div style={{ ...inter(42, "#3A3A3C", 500, { whiteSpace: "normal" }), marginTop: 12 }}>Halden kit: calipers, brackets, braided lines.</div>
          <div style={{ display: "flex", gap: 18, marginTop: 28 }}>{photos.map(([id, l, tt], i) => {
            const p = spr(t - (tt - 0.08), 220, 18), on = t >= tt - 0.08;
            return <div key={id} style={{ flex: 1 }}>
              <div style={{ height: 300, borderRadius: 26, overflow: "hidden", border: on ? "none" : "4px dashed #C7C7CC", position: "relative" }}>
                {on && <img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "35% 60%", transform: `scale(${1.25 - 0.17 * clamp(p)})`, opacity: clamp(p * 2) }} />}
                {on && t - tt < 0.1 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - (t - tt + 0.08) / 0.18 }} />}
              </div>
              <div style={{ ...inter(40, on ? INK : GREY, 500), textAlign: "center", marginTop: 12 }}>{l}</div>
            </div>;
          })}</div>
        </div>}
      </div>
    </Studio></AbsoluteFill>;
  };
  const JACK = (t, p) => { const x = lerp(1250, -700, EASE.io(p)); return <div style={{ position: "absolute", left: x, top: 1180, width: 640, height: 440, zIndex: 50, filter: "url(#mbx3)" }}><Cut id="D13" cx={320} cy={220} w={620} flip shadow={0.4} /></div>; };
  const shots = [
    { at: 0, render: (t) => inquiry(t, 1) },
    { at: TAP1, render: photo, enter: { kind: "tap", d: 0.5, rect: ATT, r: 30 } },
    { at: WIPE, render: under, enter: { kind: "wipe", d: 0.75, dir: -1, edge: (p) => lerp(1250, -700, EASE.io(p)) + 40, obj: JACK } },
    { at: BACK, render: (t) => inquiry(t, 2), enter: { kind: "match" } },
    { at: TAP2, render: page, enter: { kind: "tap", d: 0.55, rect: { x: 60, y: 1490, w: 420, h: 112 }, r: 56 } },
  ];
  return { shots, heads };
}
