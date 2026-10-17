// @ts-nocheck
// B-L3 (lane B, suppliers): "Who made this turbo?" Jules asks; the first reply guesses Brand B ("I think"), the next
// says "Definitely B": the same guess, copied, and Brand B gets the credit. Jules opens the Supra's build: turbo kit,
// brand A, the install log and photos. We check before repeating.
// Hero: '99 Supra (A01, B01) + turbo (C01); Jules E03; the Supra's turbo install (lab photos L06/L07, same car).
// Transitions: lens push from the car to the turbo, comment stack (shared axis), copy trace (marker highlight + line
// between the two guesses), credit chip carried to the turbo, tap-to-open (owner's link -> build page), field focus,
// card lift (install log), match cut back to the thread with the record beside it, CTA landing.
// remocn (ported): marker-highlight, inline-pill (credit chip), typewriter, focus-blur-resolve (brand reveal),
// period-drop. New vs B-L2: marker-highlight, focus-blur-resolve.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, DrawPath, src, rgba } from "../kit";
import { BG as HBG, TEXT as HTEXT, inter, CARD, Studio, Avatar, LetterAv, Pic, rise, PageCard } from "./laneB";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
export const BG = HBG;
export const TEXT = { ...HTEXT, size: 116 };
export const IMAGES = ["A01", "B01", "C01", "E03", "L06", "L07"];
const HOOKS = { A: "Who made / this turbo?", B: "First reply / isn't proof.", C: "Watch this / guess spread." };
const JULES = { x: 0.5, y: 0.17, z: 2.4 };

const Comment = ({ t, t0, y, av, name, children, hl = 0, o = 1, x = 60, w = 960, z = 6 }) => {
  if (t < t0 || o <= 0.002) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", gap: 20, padding: "22px 28px", borderRadius: 32, opacity: o, zIndex: z,
    background: hl ? `rgba(244,48,52,${0.06 * hl})` : "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 16px 26px -18px rgba(0,0,0,.2)", ...rise(t, t0) }}>
    {av}
    <div style={{ minWidth: 0 }}>
      <div style={inter(36, GREY, 500)}><b style={{ color: INK, fontWeight: 600 }}>{name}</b> · 2h</div>
      <div style={{ ...inter(52, "#000", 500), marginTop: 4 }}>{children}</div>
    </div>
  </div>;
};
// marker highlight behind a word (remocn marker-highlight, frame-driven)
const Mark = ({ t, t0, children }) => {
  const p = EASE.out(seg(t, t0, t0 + 0.35));
  return <span style={{ position: "relative", display: "inline-block" }}>
    <span style={{ position: "absolute", left: -6, right: -6, top: "12%", bottom: "6%", background: "rgba(244,48,52,.22)", borderRadius: 8, transformOrigin: "0 50%", transform: `scaleX(${p})` }} />
    <span style={{ position: "relative", color: p > 0.5 ? RED : undefined }}>{children}</span>
  </span>;
};

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    jules: at("jules"), first: at("first"), demo: at("demo"), think: at("think"), next: at("next"), def: at("definitely"), but: at("but"), same: at("same"),
    copied: at("copied"), now: at("now"), credit: at("credit"), so: at("so"), record: at("record"), opens: at("opens"), fuel: at("fuel"), turbo: at("turbo"),
    brandF: at("brand", 3), brandA: at("a"), then: at("then"), log: at("log"), photos: at("photos"), we: at("we"), repeating: at("repeating"),
    which: at("which"), mis: at("misnamed"), follow: at("follow"),
  };
  const TAP = T.opens - 0.55, BACK = T.we - 0.08;
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); return h; };
  const heads = [
    { words: wordsFor(tl.hook, HOOKS[hook], 0), key: hook === "A" ? [3] : [] },
    B("Jules asks.", T.jules, { hold: 0.8 }),
    B("First reply:", T.first, { hold: 2.4 }),
    B("Next reply:", T.next, { hold: 1.9 }),
    fx(B("Same guess, copied.", T.same), [T.same, at("guess"), T.copied]),
    fx(B("Brand B gets credit.", T.now), [at("brand", 2), at("b", 3), at("gets"), T.credit]),
    fx(B("Where's the record?", T.so), [at("where's"), at("owner's"), T.record]),
    B("Jules opens the build", T.opens - 0.4),
    B("Turbo kit.", T.turbo, { hold: 0.6 }),
    fx(B("Brand: A.", T.brandF), [T.brandF, T.brandA]),
    fx(B("Install log, photos.", T.then), [at("install"), T.log, T.photos]),
    B("Check before repeating.", T.we + 0.1, { key: [0] }),
    B("Which brand gets misnamed?", T.which, { key: [3] }),
    B("Follow for / documented builds", T.follow),
  ];
  heads[2].key = [];
  heads[heads.length - 1].dot = at("builds") + 0.35;

  // ---------- the post + thread (shot 1 and the return)
  const thread = (t, phase) => {
    const d = drift(t, "th", 3, 0.25);
    const lens = phase === 1 ? ez(t, 0.1, 1.2, EASE.camera) : 1;
    const credit = phase === 1 ? ez(t, T.now + 0.2, 0.6, EASE.camera) : 0;
    const back = phase === 2;
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    const copy = phase === 1 ? ez(t, T.same - 0.1, 0.6) : 0;
    const shift = phase === 1 ? ez(t, T.so - 0.1, 0.5, EASE.camera) : 0;
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 - 0.04 * cta})`, transformOrigin: "50% 50%" }}>
        {/* the post: Supra with the turbo detail pushed in */}
        <div style={{ position: "absolute", left: 60, top: 590, width: 960, height: 420, ...CARD, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#FFFFFF 0%,#F2F2F5 60%,#E6E6EA 100%)" }} />
          <Cut id="A01" cx={lerp(480, 330, lens)} cy={230} w={lerp(760, 560, lens)} shadow={0.3} />
          <div style={{ position: "absolute", left: lerp(700, 640, lens), top: lerp(150, 70, lens), width: 280 * lens + 1, height: 280 * lens + 1, borderRadius: "50%", background: "#fff", overflow: "hidden",
            boxShadow: "0 0 0 6px #fff, 0 18px 30px rgba(0,0,0,.25)", opacity: clamp(lens * 3) }}>
            <Cut id="C01" cx={140 * lens} cy={145 * lens} w={250 * lens} shadow={0} rot={Math.sin(t * 0.8) * 2} />
          </div>
          {/* credit chip carried onto the post */}
          {credit > 0.01 && <div style={{ position: "absolute", left: lerp(120, 610, credit), top: lerp(640, 300, credit), padding: "10px 26px", borderRadius: 30, background: RED, ...inter(44, "#fff"),
            transform: `scale(${0.8 + 0.2 * credit})`, boxShadow: "0 10px 24px rgba(244,48,52,.35)" }}>Brand B</div>}
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-shift * 0}px)` }}>
          <Comment t={t} t0={phase === 1 ? Math.max(0, tl.cut - 0.2) : -1} y={1040} name="jules.wrk" av={<Avatar id="E03" size={84} face={JULES} bg="#DDD8D0" />}>What turbo is that?</Comment>
          <Comment t={t} t0={phase === 1 ? T.first + 0.2 : -1} y={1210} x={140} w={880} name="dm_tuned" av={<LetterAv ch="D" size={84} bg="#8E8E93" />} o={back ? 1 - 0.5 * ez(t, BACK + 0.4, 0.4) : 1 - 0.85 * ez(t, T.so, 0.4)} hl={copy}>
            {phase === 1 ? <><Typed t={t} t0={T.demo} t1={T.think + 0.25} text={"Brand B, I think."} />{copy > 0 && null}</> : "Brand B, I think."}
          </Comment>
          <Comment t={t} t0={phase === 1 ? T.next + 0.2 : -1} y={1380} x={140} w={880} name="boostcase" av={<LetterAv ch="B" size={84} bg="#AEAEB2" />} o={back ? 1 - 0.5 * ez(t, BACK + 0.4, 0.4) : 1 - 0.85 * ez(t, T.so, 0.4)} hl={copy}>
            {phase === 1 && t < T.same ? <Typed t={t} t0={T.def - 0.1} t1={T.def + 0.6} text="Definitely B." /> : <>Definitely <Mark t={t} t0={phase === 1 ? T.same + 0.15 : -9}>B</Mark>.</>}
          </Comment>
          {phase === 1 && t < T.so + 0.3 && <DrawPath d="M 330 1330 C 250 1360, 250 1420, 470 1460" p={ez(t, T.copied - 0.1, 0.45)} color={RED} width={6} z={20} />}
          {/* owner's link reply (where's the record?) */}
          {phase === 1 && t > T.record - 0.1 && <div style={{ position: "absolute", left: 60, top: 1210, width: 960, zIndex: 9 }}>
            <Comment t={t} t0={T.record - 0.1} y={0} name="supra.ken" av={<Avatar id="A01" size={84} face={{ x: 0.42, y: 0.5, z: 2.6 }} bg="#ECECF0" />}>
              <span style={{ color: RED }}>fuelmybuild.com/ken/supra</span>
            </Comment>
          </div>}
          {back && <div style={{ position: "absolute", left: 60, top: 1210, width: 960, zIndex: 9, ...CARD, padding: "22px 30px", display: "flex", alignItems: "center", gap: 22, ...rise(t, BACK + 0.45) }}>
            <div style={{ width: 120, height: 100, position: "relative" }}><Cut id="C01" cx={60} cy={50} w={110} shadow={0.15} /></div>
            <div style={{ flex: 1 }}><div style={inter(36, GREY, 500)}>Owner's record · Parts registry</div><div style={inter(52, INK)}>Turbo kit · Brand A</div></div>
          </div>}
        </div>
      </div>
    </Studio></AbsoluteFill>;
  };
  // ---------- the Supra's build page
  const page = (t) => {
    const row = ez(t, T.turbo - 0.15, 0.45), bf = ez(t, T.brandF - 0.1, 0.35), reveal = seg(t, T.brandA - 0.35, T.brandA + 0.05);
    const lift = ez(t, T.then - 0.1, 0.6, EASE.camera);
    const d = drift(t, "bp", 3, 0.25);
    return <AbsoluteFill><Studio t={t}>
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <PageCard t={t} y={590} h={980} hero="B01" heroH={360} fy={0.62} title="'99 Supra" owner="Ken · Public build" ownerAv={<Avatar id="A01" size={56} face={{ x: 0.42, y: 0.5, z: 2.6 }} bg="#ECECF0" />}
          url="fuelmybuild.com/ken/supra" urlAt={T.fuel + 0.05} brandAt={T.fuel - 0.1} s={1 - 0.05 * lift} o={1 - 0.45 * lift}>
          <div style={{ marginTop: 22, borderRadius: 30, background: "#F2F2F7", padding: "18px 24px", display: "flex", alignItems: "center", gap: 22, opacity: row, transform: `scale(${0.96 + 0.04 * row})` }}>
            <div style={{ width: 130, height: 110, position: "relative" }}><Cut id="C01" cx={65} cy={55} w={120} shadow={0.15} /></div>
            <div style={{ flex: 1 }}><div style={inter(36, GREY, 500)}>Parts registry</div><div style={inter(52, INK)}>Turbo kit</div></div>
            <div style={{ padding: "10px 22px", borderRadius: 24, background: `rgba(244,48,52,${0.1 * bf})`, boxShadow: `0 0 0 ${4 * bf}px ${RED}`, minWidth: 220 }}>
              <div style={inter(32, GREY, 500)}>Brand</div>
              <div style={{ ...inter(50, INK), filter: `blur(${(1 - reveal) * 14}px)`, opacity: 0.25 + 0.75 * reveal }}>Brand A</div>
            </div>
          </div>
        </PageCard>
        {lift > 0.01 && <div style={{ position: "absolute", left: 60, top: lerp(1300, 640, lift), width: 960, ...CARD, padding: "34px 40px 40px", opacity: clamp(lift * 2.5), zIndex: 8 }}>
          <div style={inter(38, GREY, 500)}>Build log · dated entry</div>
          <div style={{ ...inter(62, INK), marginTop: 6 }}>May 2, 2026 <span style={{ color: GREY }}>·</span> Turbo install</div>
          <div style={{ ...inter(42, "#3A3A3C", 500), marginTop: 12 }}>Turbo kit, Brand A. Logged by the owner.</div>
          <div style={{ display: "flex", gap: 18, marginTop: 24 }}>{[["L06", T.photos - 0.2], ["L07", T.photos + 0.25]].map(([id, tt]) => {
            const p = spr(t - tt, 220, 18), on = t >= tt;
            return <div key={id} style={{ flex: 1, height: 330, borderRadius: 26, overflow: "hidden", border: on ? "none" : "4px dashed #C7C7CC" }}>
              {on && <img src={src(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.2 - 0.14 * clamp(p)})`, opacity: clamp(p * 2) }} />}
            </div>;
          })}</div>
        </div>}
      </div>
    </Studio></AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: (t) => thread(t, 1) },
    { at: TAP, render: page, enter: { kind: "tap", d: 0.55, rect: { x: 60, y: 1210, w: 960, h: 140 }, r: 32 } },
    { at: BACK, render: (t) => thread(t, 2), enter: { kind: "pull", d: 0.6, rect: { x: 60, y: 1210, w: 960, h: 140 } } },
  ];
  return { shots, heads };
}
