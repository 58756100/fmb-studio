// @ts-nocheck
// SC-08 (lane C, parts suppliers): one missing line in a fuel pump's install sheet cost Zeke an hour: step four says
// drop it in and turn the lock ring, but the seal rolls under the ring. He pencils a warning in the margin, and the sheet
// goes in the bin with the box, so Corliss never sees it. This time he logs the note on the E30's build page with a
// photo of the seal. A week later the owner sends Corliss the link to say thanks; Desmond, their sheet writer, reads it,
// checks it with their engineers, and the next print run fixes step four. "Huh. Nothing left to write."
// Device: a carbon copy. When Zeke logs the job, the install sheet lifts and the build entry sits underneath like the
// carbon page of an old work order, in carbon blue. The note later lines up exactly beside printed step four.
// Drawn: the install sheet + diagram, the seal replay, pencil, bin, cork board (no bank images for these; requested).
// Bank: parts box D14, Zeke E05, Desmond E07, warehouse F04, fuel pump C19, E30 front A10.
// Fictional: Zeke, Desmond, Corliss Fuel Systems, Mill Road Garage. (Model name is spoken: bank set A only.)
// Transitions: rack focus (sheet), punch into the seal replay, match cut on the printed header (bin -> office cork
// board), sheet lifts (carbon reveal), the entry slides out of the garage into the office (whip carry), punch to the
// test bench, circle becomes print, match back to the sheet macro for the CTA (frame 0's framing, empty margin).
// remocn (ported): focus-pull (rack focus), handwriting typewriter (Caveat), carbon typewriter, squiggle circle,
// period-drop. New vs the previous reels: carbon-copy reveal, rack focus on print.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, src, rgba, DrawPath } from "../kit";
import { TEXT as HTEXT, inter, CARD, Studio } from "./laneB";
import { land, Wordmark, Who } from "./b2kit";

export const HOOK_WORDS = 12;
export const TAIL = 1.3;
export const LIFE = 1.75;
export const BG = "#F5F5F7";
export const TEXT = { ...HTEXT, size: 108 };
export const IMAGES = ["D14", "E05", "E07", "F04", "C19", "A10"];
const HOOKS = { A: "One missing / line.", B: "Never reaches / the brand.", C: "Pencil, / then print." };
const CARBON = "#2F4FA8", PAPER = "#FBFAF6";
const HAND = (size, color = "#3A3A3C", weight = 600) => ({ fontFamily: "Caveat", fontSize: size, fontWeight: weight, color, lineHeight: 1.0, whiteSpace: "nowrap" });
const mono = (size, color = "#2B2B2E", w = 500) => ({ fontFamily: "'IBM Plex Mono'", fontSize: Math.max(42, size), fontWeight: w, color, lineHeight: 1.15, whiteSpace: "nowrap" });

// the pump diagram: tank opening, lock ring, seal (rolled = folded under on one side)
const Diagram = ({ t, x, y, s = 1, roll = 0, ring = 0 }) => (
  <svg width={360 * s} height={300 * s} viewBox="0 0 360 300" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <ellipse cx={180} cy={190} rx={150} ry={46} fill="none" stroke="#2B2B2E" strokeWidth={4} />
    <rect x={130} y={40} width={100} height={150} rx={14} fill="none" stroke="#2B2B2E" strokeWidth={4} />
    <g transform={`rotate(${ring * 40} 180 182)`}><ellipse cx={180} cy={182} rx={122} ry={36} fill="none" stroke="#2B2B2E" strokeWidth={6} strokeDasharray="22 10" /></g>
    <path d={`M 62 192 Q 180 ${236 + 30 * roll} 298 192`} fill="none" stroke="#111" strokeWidth={12} strokeLinecap="round" />
    {roll > 0.01 && <path d={`M 250 ${200 + 8 * roll} q ${18 * roll} ${22 * roll} ${-6 * roll} ${30 * roll}`} fill="none" stroke="#111" strokeWidth={12} strokeLinecap="round" />}
  </svg>
);
// the printed install sheet. step4: "orig" | "revised"; note: pencil progress 0..1; focus: blur on the print (rack focus)
const Sheet = ({ t, x = 90, y = 600, w = 900, rot = -1.5, step4 = "orig", note = 0, noteCarbon = 0, focus = 1, header = true, circle = 0, o = 1, lift = 0, z = 10, children }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.18, opacity: o, zIndex: z, transformOrigin: "50% 0%", transform: `rotate(${rot}deg) perspective(1600px) rotateX(${lift * 70}deg) translateY(${-lift * 240}px)` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 1062, transformOrigin: "0 0", transform: `scale(${w / 900})`, background: PAPER, boxShadow: "0 30px 50px -24px rgba(0,0,0,.45)", padding: "40px 48px", boxSizing: "border-box" }}>
      {header && <div style={{ ...inter(48, "#1D1D1F", 800), letterSpacing: "0.04em" }}>CORLISS FUEL SYSTEMS</div>}
      <div style={{ ...inter(42, GREY, 500), marginTop: 4 }}>In-tank pump · install sheet</div>
      <div style={{ filter: focus < 0.99 ? `blur(${((1 - focus) * 7).toFixed(1)}px)` : undefined }}>
        {["1  Relieve fuel pressure.", "2  Remove the access cover.", "3  Lift out the old pump."].map((l, i) => <div key={i} style={{ ...mono(42), marginTop: 22 }}>{l}</div>)}
        <div style={{ ...mono(42, "#1D1D1F", 600), marginTop: 22, padding: "6px 10px", margin: "16px -10px 0", borderRadius: 8, position: "relative" }}>
          {step4 === "orig" ? "4  Drop it in, turn the lock ring." : <><div>4  <span style={{ color: RED }}>Seat the seal flat,</span></div><div>{"\u00A0\u00A0 "}then turn the lock ring.</div></>}
          {circle > 0 && <svg width={860} height={90} style={{ position: "absolute", left: -20, top: -14, overflow: "visible" }}><ellipse cx={380} cy={40} rx={420} ry={44} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="2700" strokeDashoffset={2700 * (1 - circle)} /></svg>}
        </div>
        <div style={{ ...mono(42), marginTop: 22 }}>5  Refit the cover.</div>
      </div>
      <Diagram t={t} x={60} y={560} s={1.1} />
      {/* the margin note: pencil, or in carbon blue under the sheet */}
      {note > 0 && <div style={{ position: "absolute", left: 500, top: 610, transform: "rotate(-4deg)" }}>
        <Typed t={note >= 1 ? 999 : t} t0={0} t1={1} text="" caret="rgba(0,0,0,0)" keepCaret={0} />
        <div style={{ ...HAND(54, noteCarbon ? CARBON : "#55555A"), clipPath: `inset(0 ${100 - 100 * clamp(note * 1.4)}% 0 0)` }}>seal rolls here!</div>
        <div style={{ ...HAND(54, noteCarbon ? CARBON : "#55555A"), clipPath: `inset(0 ${100 - 100 * clamp(note * 1.4 - 0.4)}% 0 0)` }}>check it sits flat</div>
        <div style={{ height: 4, width: 300 * clamp(note * 2 - 1), background: noteCarbon ? CARBON : "#55555A", marginTop: 6, borderRadius: 2 }} />
      </div>}
    </div>
    {children}
  </div>
);
const Pencil = ({ x, y, rot = -35, o = 1 }) => o <= 0.002 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: 520, height: 34, transformOrigin: "0 50%", transform: `rotate(${rot}deg)`, opacity: o, zIndex: 40, filter: "drop-shadow(0 12px 10px rgba(0,0,0,.35))" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 60, height: 34, background: "#E8C9A0", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: 13, width: 16, height: 8, background: "#333", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />
    <div style={{ position: "absolute", left: 60, top: 0, width: 400, height: 34, background: "linear-gradient(180deg, #F7C948, #E0A923)" }} />
    <div style={{ position: "absolute", left: 460, top: 0, width: 26, height: 34, background: "linear-gradient(180deg, #d4d6da, #9aa0a6)" }} />
    <div style={{ position: "absolute", left: 486, top: 0, width: 34, height: 34, borderRadius: "0 10px 10px 0", background: "#E59A9A" }} />
  </div>
);

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    step: at("step"), drop: at("drop"), ring: at("ring."), but: at("but"), seal: at("seal"), rolls: at("rolls"), so: at("so"), pencilled: at("pencilled"), margin: at("margin"),
    guy: at("guy."), but2: at("but", 2), bin: at("bin"), box: at("box,"), so2: at("so", 2), corliss: at("corliss"), never: at("never"), so3: at("so", 3), zeke: at("zeke"),
    logs: at("logs"), note: at("note"), build: at("build"), photo: at("photo"), seal2: tl.after("seal", at("photo")), a: at("a", 3), week: at("week"), owner: at("owner"), link: at("link"),
    and: at("and", 2), and2: at("and", 3), desmond: at("desmond,"), reads: at("reads"), he: at("he"), checks: at("checks"), engineers: at("engineers,"), next: at("next", 2), print: at("print"),
    fixes: at("fixes"), four: at("four.", 1), huh: at("huh."), nothing: at("nothing"), write: at("write."), cta: tl.cta("send") ?? at("send"),
  };
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const hw = tl.hook;
  const hk = { words: wordsFor(hw, HOOKS[hook], 0), key: hook === "A" ? [1] : hook === "B" ? [1] : [2], hold: 0.8 };
  fx(hk, hk.words.map((w, i) => hw[Math.min(hw.length - 1, Math.round(i * (hw.length * 0.45) / Math.max(1, hk.words.length - 1)))].s));
  const heads = [
    hk,
    { ...fx(B("The seal / rolls.", T.seal), [T.seal - 0.15, T.seal, T.rolls]), key: [2], hold: 0.6 },
    { ...fx(B("Corliss / never saw it.", T.corliss), [T.corliss, T.never, at("saw"), at("it.", 2)]), key: [1], hold: 0.7 },
    { ...fx(B("A week / later.", T.a), [T.a, T.week, at("later")]), key: [], hold: 0.8 },
    { ...fx(B("Step 4, / revised.", T.next), [T.print, T.print + 0.1, T.fixes]), key: [2], hold: 0.9 },
    { ...ctaHead(tl, "Send this to your / sheet writer", T.cta), key: [5] },
  ];
  heads[heads.length - 1].words = [{ w: "Send", t: T.cta, line: 0 }, { w: "this", t: at("this", 2), line: 0 }, { w: "to", t: at("to", 2), line: 0 }, { w: "your", t: at("your"), line: 1 }, { w: "sheet", t: at("sheets"), line: 1 }, { w: "writer", t: at("sheets") + 0.25, line: 1 }];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.15;

  // ---------------------------------------------------------------- the bench: the sheet macro (frame 0, the note, the CTA)
  const bench = (t, phase) => {
    const d = drift(t, "bn" + phase, 3, 0.3);
    const focus = phase === "hook" ? ez(t, T.step - 0.3, 0.6, EASE.io) * 1 + (t < T.step - 0.3 ? 0.35 : 0) : 1;
    const note = phase === "note" ? seg(t, T.pencilled - 0.1, T.guy) : 0;
    const fold = phase === "note" ? ez(t, T.but2 - 0.05, 0.45, EASE.in) : 0;
    const end = phase === "end";
    const pen = end ? track(t, { x: 640, y: 1460, r: 20 }, [[T.nothing - 0.6, { x: 600, y: 1260, r: 30 }, 0.6], [T.write, { x: 640, y: 1560, r: 8 }, 0.6]])
      : phase === "note" ? { x: 600 + 330 * note, y: 1260 + 30 * Math.sin(t * 9) * (note > 0 && note < 1 ? 1 : 0), r: 30 } : { x: 116, y: 1080, r: 28 };
    const ctaP = end ? EASE.camera(seg(t, T.cta - 0.3, T.cta + 0.7)) : 0;
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #8A6E52, #5E4632)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 40% 40%, rgba(255,220,170,.35), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1.04 + 0.03 * EASE.io(seg(t, 0, 6)) - 0.04 * ctaP})`, transformOrigin: "50% 50%" }}>
        {fold < 0.98 && <Sheet t={t} step4={end ? "revised" : "orig"} note={note} focus={clamp(focus)} lift={0} rot={-1.5 + 30 * fold} o={1 - fold} x={90 + fold * 300} y={600 + fold * 500} />}
        {fold > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${fold * 120}px, ${(1 - fold) * 200 + EASE.in(seg(t, T.bin - 0.3, T.box)) * 900}px) rotate(${-8 + 20 * seg(t, T.bin - 0.3, T.box)}deg)`, opacity: 1 - seg(t, T.box - 0.1, T.box + 0.2) }}>
          <Cut id="D14" cx={560} cy={1150} w={560} shadow={0.35} /></div>}
        {phase === "note" && t > T.but2 && <div style={{ position: "absolute", left: 300, top: lerp(1950, 1380, ez(t, T.but2, 0.5)), width: 520, height: 640, zIndex: 30 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 90, borderRadius: "50%", background: "#3A3D42" }} />
          <div style={{ position: "absolute", left: 0, top: 45, width: 520, height: 600, borderRadius: "0 0 40px 40px", background: "linear-gradient(90deg, #6B6F76, #9AA0A6 40%, #5A5E64)", backgroundSize: "100% 100%" }}>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 100, top: 40, width: 18, height: 500, borderRadius: 9, background: "rgba(0,0,0,.15)" }} />)}</div></div>}
        <Pencil x={pen.x} y={pen.y} rot={pen.r} o={1 - fold} />
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the seal replay (code): pump drops, ring turns, seal rolls under
  const replay = (t) => {
    const d = drift(t, "rp", 3, 0.3);
    const roll = ez(t, T.rolls, 0.6, EASE.io), ring = ez(t, T.seal - 0.2, 0.9, EASE.io);
    return <AbsoluteFill><Studio t={t}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      <div style={{ position: "absolute", left: 90, top: 640, width: 900, height: 760, borderRadius: 40, background: PAPER, boxShadow: "0 30px 60px -30px rgba(0,0,0,.4)" }} />
      <Diagram t={t} x={145} y={700} s={2.2} roll={roll} ring={ring} />
      {roll > 0.2 && <div style={{ position: "absolute", left: 640, top: 1110, width: 150, height: 150, borderRadius: "50%", border: `8px solid ${RED}`, transform: `scale(${spr(t - T.rolls - 0.2, 220, 14)})` }} />}
    </div></Studio></AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the Corliss office: the master copy pinned to the cork board
  const office = (t, phase) => {
    const d = drift(t, "of" + phase, 3, 0.3);
    const desk = phase === "desmond";
    const circle = desk ? 0 : 0;
    const arrive = desk ? spr(t - (T.and - 0.2), 160, 18) : 0;
    return <AbsoluteFill style={{ background: "#E9E7E2" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, #C79A63 0 2px, transparent 3px) 0 0 / 22px 22px, linear-gradient(160deg, #D9AE78, #B9875A)", opacity: desk ? 0 : 1 }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
        {!desk && <><Sheet t={t} rot={1.2} x={110} y={520} w={860} />
          <div style={{ position: "absolute", left: 520, top: 500, width: 44, height: 44, borderRadius: "50%", background: RED, boxShadow: "0 6px 10px rgba(0,0,0,.4)", zIndex: 20 }} /></>}
        {desk && <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1100, height: 820, background: "linear-gradient(180deg, #CFC6B8, #B9AE9E)" }} />
          <Sheet t={t} rot={-1} x={60} y={560} w={560} />
          {/* the entry arrives beside it, its note lining up with step four */}
          <div style={{ position: "absolute", left: lerp(1300, 570, clamp(arrive)), top: 760, width: 440, ...CARD, padding: "24px 26px", boxSizing: "border-box", background: "#F4F6FB", boxShadow: `0 0 0 3px ${rgba(CARBON, 0.35)}, 0 30px 40px -20px rgba(0,0,0,.35)` }}>
            <div style={inter(42, CARBON, 700)}>Fuel pump · Corliss</div>
            <div style={{ ...HAND(54, CARBON), marginTop: 10 }}>seal rolls here!</div><div style={HAND(54, CARBON)}>check it sits flat</div>
            <div style={{ ...inter(40, "#5A6B9A", 500), marginTop: 10 }}>Mill Road Garage · Zeke</div></div>
          <Cut id="E07" cx={lerp(1400, 800, clamp(spr(t - (T.desmond - 0.3), 160, 18)))} cy={1560} w={560} shadow={0} />
        </>}
      </div>
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the carbon reveal: the sheet lifts, the entry underneath
  const carbon = (t) => {
    const d = drift(t, "cb", 3, 0.3);
    const flash = 1 - seg(t, T.so3 + 0.2, T.so3 + 0.45);
    const lift = ez(t, T.zeke - 0.1, 0.7, EASE.camera);
    const go = EASE.in(seg(t, T.a - 0.25, T.a + 0.2));
    return <AbsoluteFill style={{ background: "linear-gradient(180deg, #8A6E52, #5E4632)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} translateX(${go * -1200}px)` }}>
        <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 980, background: "#F3F5FA", boxShadow: "0 30px 50px -24px rgba(0,0,0,.45)", padding: "40px 48px", boxSizing: "border-box",
          backgroundImage: `repeating-linear-gradient(180deg, rgba(47,79,168,0) 0 70px, rgba(47,79,168,.08) 70px 72px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Wordmark size={44} /><span style={inter(42, "#5A6B9A", 500)}>· E30 build log</span></div>
          <div style={{ ...inter(60, CARBON, 700), marginTop: 22, ...land(t, T.logs) }}>Fuel pump · Corliss</div>
          <div style={{ ...inter(48, RED, 600), marginTop: 6, ...land(t, T.note) }}>Oct 2026</div>
          <div style={{ marginTop: 26, display: "flex", gap: 26, alignItems: "center" }}>
            <div style={{ width: 360, height: 300, borderRadius: 24, background: PAPER, position: "relative", overflow: "hidden", ...land(t, T.photo) }}><Diagram t={t} x={10} y={20} s={0.95} roll={1} /></div>
            <div style={{ ...land(t, T.build) }}>
              <div style={{ ...HAND(58, CARBON), clipPath: `inset(0 ${100 - 100 * seg(t, T.build, T.seal2)}% 0 0)` }}>seal rolls here!</div>
              <div style={{ ...HAND(58, CARBON), clipPath: `inset(0 ${100 - 100 * seg(t, T.photo, T.seal2 + 0.3)}% 0 0)` }}>check it sits flat</div></div>
          </div>
          <div style={{ marginTop: 34, display: "flex", gap: 24, ...land(t, T.seal2) }}><Who ch="M" name="Mill Road Garage" bg={CARBON} size={56} /><Who ch="Z" name="Zeke" bg="#FF9F0A" size={56} /></div>
        </div>
        {/* the printed sheet lifts off it like the top copy of a work order */}
        {lift < 0.99 && <Sheet t={t} lift={lift} o={1 - seg(lift, 0.7, 1)} note={1} rot={-1.5} />}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * (t > T.so3 + 0.2 ? 1 : 0), zIndex: 90 }} />
    </AbsoluteFill>;
  };
  // ---------------------------------------------------------------- the engineers' test bench (warehouse) and the reprint
  const test = (t) => {
    const d = drift(t, "ts", 3, 0.3);
    const roll = ez(t, T.engineers - 0.1, 0.6, EASE.io);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: -40, transform: `${dT(d, 0.8)} scale(1.06)` }}><Img src={src("F04")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.9) blur(3px)" }} /></div>
      <div style={{ position: "absolute", left: 120, top: 760, width: 840, height: 640, borderRadius: 40, background: "rgba(251,250,246,.96)", boxShadow: "0 30px 60px -30px rgba(0,0,0,.5)" }}>
        <Diagram t={t} x={40} y={60} s={1.6} roll={roll} ring={ez(t, T.checks, 0.8, EASE.io)} />
        <div style={{ position: "absolute", right: 40, top: 40 }}><Cut id="C19" cx={-90} cy={60} w={240} shadow={0} /></div>
      </div>
    </AbsoluteFill>;
  };
  const reprint = (t) => {
    const d = drift(t, "rpr", 3, 0.3);
    const circle = ez(t, T.and + 0.0, 0.6, EASE.io), print = seg(t, T.fixes - 0.1, T.fixes + 0.2);
    return <AbsoluteFill style={{ background: "#E9E7E2" }}><div style={{ position: "absolute", inset: 0, transform: dT(d, 0.6) }}>
      {[2, 1].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 14, top: 520 + i * 14, width: 900, height: 1062, background: PAPER, boxShadow: "0 10px 20px -10px rgba(0,0,0,.3)" }} />)}
      <Sheet t={t} rot={0} step4={print > 0.5 ? "revised" : "orig"} circle={print > 0.5 ? 0 : circle} />
    </div></AbsoluteFill>;
  };

  const shots = [
    { at: 0, render: (t) => bench(t, "hook") },
    { at: T.but - 0.08, render: replay, enter: { kind: "punch" } },
    { at: T.so - 0.08, render: (t) => bench(t, "note"), enter: { kind: "match" } },
    { at: T.so2 - 0.08, render: (t) => office(t, "board"), enter: { kind: "match" } },
    { at: T.so3 - 0.1, render: carbon, enter: { kind: "match" } },
    { at: T.week - 0.1, render: (t) => office(t, "desmond"), enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: T.he - 0.08, render: test, enter: { kind: "punch" } },
    { at: T.and2 - 0.1, render: reprint, enter: { kind: "rise", d: 0.5 } },
    { at: T.huh - 0.15, render: (t) => bench(t, "end"), enter: { kind: "match" } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.1, "pencil-write", 0.5], [T.step - 0.3, "lens-settle"], [T.seal - 0.2, "ratchet"], [T.rolls, "low-hit", 0.6], [T.pencilled - 0.1, "pencil-write"], [T.margin, "pencil-write"],
    [T.but2 - 0.05, "paper-fold"], [T.bin - 0.3, "air-short"], [T.box, "clunk"], [T.so2 - 0.08, "match"], [T.so3 + 0.2, "shutter"], [T.zeke - 0.1, "paper-unfold"],
    [T.build, "typing:1.2"], [T.a - 0.25, "whip"], [T.and - 0.2, "slide-soft"], [T.desmond - 0.3, "pop-soft"], [T.engineers - 0.1, "ratchet"], [T.and2 + 0.05, "draw"],
    [T.fixes - 0.1, "stamp"], [T.nothing - 0.6, "pencil-write", 0.4], [T.write, "tap"], [ctaT, "cta-pop"],
  ];
  const music = { bpm: 100, root: 50, mode: "minor", style: "investigate", cut: T.so3 - 0.35, ret: T.so3 - 0.1, room: "shop" };
  return { shots, heads, sfx, music };
}
