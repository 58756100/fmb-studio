// @ts-nocheck
// A-L3 (lane A+, suppliers): "Someone guessed your turbo." A tentative reply gets copied until it sounds like fact;
// the fix is the part and its brand named on the build where it's used, shared as the build page's public link.
// Hero: '99 Supra (B01 showroom photo) + turbo (C01), install photo G01.
// Transitions: whip carry (the guessed replies are flung aside, the turbo lands), silence punch (the fix), word carry
// (BRAND -> its field), shared-element assembly into the build page, match cut back to the thread, CTA landing.
// remocn (ported): strikethrough-replace ("I think" struck), caret (empty brand field), lens-zoom settle (silence punch),
// typewriter (link reply), period-drop (CTA). New vs A-L2: strikethrough-replace, lens-zoom.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, Typed, rgba, src } from "../kit";
import { textStyle, BuildPage, mono, ui, Frame } from "./laneA";

export const HOOK_WORDS = 4;
export const TAIL = 1.0;
const pal = { bg: "#1D1B20", tx: "#F1EDF7", em: "#C8B4E8", panel: "#29262E", paper: "#F1EDF7", ink: "#1D1B20", ink2: "#4A4552" };
export const BG = pal.bg;
export const TEXT = { ...textStyle(pal), size: 104 };
export const IMAGES = ["B01", "C01", "A02", "G01"];
const HOOKS = { A: ["Someone guessed your turbo."], B: ["Your turbo.", "Their guess."], C: ["First reply.", "Wrong brand."] };

// a comment in the thread: avatar (their car), handle, text. Dark glass card in the lane palette.
const Comment = ({ t, t0, y, who, children, w = 888, x = 96, o = 1, s = 1, dim = 0, z = 5, origin = "0 50%", hl = 0 }) => {
  if (t < t0 || o <= 0.002) return null;
  const p = spr(t - t0, 210, 19);
  return <div style={{ position: "absolute", left: x, top: y, width: w, opacity: clamp(p * 2) * o * (1 - 0.6 * dim), zIndex: z, transformOrigin: origin,
    transform: `translateY(${(1 - p) * 40}px) scale(${(0.94 + 0.06 * p) * s})`, background: hl ? rgba(pal.em, 0.16) : pal.panel, borderRadius: 26, padding: "22px 28px",
    boxShadow: `0 0 0 2px ${rgba(pal.tx, hl ? 0.3 : 0.08)}, 0 24px 40px -24px rgba(0,0,0,.7)`, display: "flex", gap: 22, alignItems: "flex-start" }}>
    <div style={{ width: 84, height: 84, borderRadius: 42, overflow: "hidden", background: "#3A3640", flex: "none", position: "relative" }}>
      <img src={src(who.av)} style={{ position: "absolute", left: -46, top: 22, width: 190 }} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={mono(40, rgba(pal.tx, 0.6))}>{who.name}</div>
      <div style={{ ...ui(54, pal.tx), marginTop: 4, whiteSpace: "nowrap" }}>{children}</div>
    </div>
  </div>;
};
const P = { asker: { name: "@nightboost", av: "A02" }, r1: { name: "@kuro_garage", av: "A02" }, r2: { name: "@lowmiles99", av: "A02" }, own: { name: "@supra.ken", av: "A02" } };

export function build(tl, hook) {
  const at = tl.at;
  const tryAt = (w, n = 1) => { try { return at(w, n); } catch (e) { return null; } };
  const T = {
    next: at("the"), repeats: at("repeats"), now: at("now"), fact: at("fact"), missing: at("missing"), brand1: at("brand"), heres: at("here's"),
    name: at("name"), record: at("record"), brand2: at("brand", 2), on: at("on"), used: at("used"), we: at("we"), fuel: at("fuel"), registry: at("registry"),
    page: at("page") - 0.31, pub: at("public"), link: at("link"), share: at("share"), less: at("less"), more: at("more"), sup: tryAt("suppliers"),
    mis: tryAt("misidentified"), follow: tl.cta("know") ?? at("follow"),
  };
  const WHIP = T.missing - 0.22, PUNCH = T.heres - 0.05, BACK = T.share - 0.08;
  const hk = HOOKS[hook].map((txt, i) => ({ words: wordsFor(tl.hook, txt, i ? tl.hook[2].s - 0.05 : 0) }));
  const B = (txt, from, extra = {}) => ({ words: wordsFor(tl.body, txt, from), ...extra });
  const heads = [
    ...hk,
    B("The next person repeats it.", T.next, { key: [3] }),
    B("The guess sounds like fact.", T.now + 0.2, { key: [4], exit: { at: WHIP - 0.15, mode: "left" } }),
    B("The missing detail?", T.missing - 0.2),
    B("The brand.", T.brand1 - 0.2, { key: [1], hold: 0.9 }),
    B("Here's the fix:", T.heres),
    B("Name the part,", T.name),
    B("Record its brand,", T.record, { key: [2], carry: { i: 2, at: T.brand2 + 0.35, dur: 0.5, to: { x: 96 + 52 + 66, y: 846 + 34 + 150 + 26, size: 40 }, fade: T.brand2 + 0.9, color: pal.em } }),
    B("On the build where it's used.", T.on - 0.1, { key: [2] }),
    B("In the parts registry", T.we, { key: [2, 3] }),
    B("Build page. Public link.", T.page - 0.1, { key: [3] }),
    B("Share it when someone asks.", T.share, { exit: { at: T.less - 0.3, mode: "up" } }),
    B("Less guesswork.", T.less, { hold: 0.6 }),
    B("More context.", T.more, { key: [1], hold: 1.0 }),
    ...(T.mis && T.mis < T.follow ? [B("Most misidentified part?", T.sup, { key: [1] })] : []),
    { ...ctaHead(tl, "Send them this", T.follow), key: [2] },
  ];
  const fx = (h, ts) => { h.words = h.words.map((w, i) => ({ ...w, t: ts[i] ?? w.t })); };
  fx(heads.find((h) => h.words[0].w === "In"), [at("both"), at("in"), at("parts"), T.registry]);
  fx(heads.find((h) => h.words[0].w === "Build"), [T.page, at("page"), T.pub, T.link]);
  fx(heads.find((h) => h.words[0].w === "Share"), [T.share, at("that"), at("when"), at("someone"), at("asks")]);
  const most = heads.find((h) => h.words[0].w === "Most"); if (most) fx(most, [T.mis - 0.3, T.mis, tl.after("part", T.mis)]);
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shot 1 / 4: the thread under the Supra photo
  const thread = (t, phase) => {
    const d = drift(t, "th", 3, 0.25);
    const strike = EASE.out(seg(t, T.repeats + 0.35, T.repeats + 0.7));
    const big = ez(t, T.now + 0.3, 0.6, EASE.camera);
    const after = phase === 2;
    const less = ez(t, T.less, 0.6, EASE.camera);
    const cta = EASE.camera(seg(t, T.follow - 0.2, T.follow + 0.8));
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.04 * cta}) ${dT(d, 0.6)}`, transformOrigin: "50% 50%" }}>
        <Frame pal={pal} t={t} id="B01" x={96} y={400} w={888} h={380} fx={0.5} fy={0.62} kb={0.02} />
        <Comment t={t} t0={-1} y={820} who={P.asker}>What turbo is that?</Comment>
        {!after && <>
          <Comment t={t} t0={hook === "A" ? tl.hook[3].s - 0.25 : tl.hook[1].s} y={1000} x={150} w={834} who={P.r1} dim={big}>Brand B, I think.</Comment>
          <Comment t={t} t0={T.repeats - 0.2} y={lerp(1000, 1180, ez(t, T.repeats - 0.2, 0.45, EASE.camera))} x={150} w={834} s={1 + 0.12 * big} who={P.r2} z={6} hl={big}>
            Brand B<span style={{ position: "relative", display: "inline-block", verticalAlign: "bottom", whiteSpace: "nowrap", overflow: seg(t, T.now, T.now + 0.3) > 0 ? "hidden" : "visible", opacity: 1 - seg(t, T.now, T.now + 0.3), maxWidth: `${(1 - EASE.camera(seg(t, T.now + 0.1, T.now + 0.5))) * 6}em` }}>, I think<span style={{ position: "absolute", left: 0, top: "52%", height: 6, background: pal.em, width: `${strike * 100}%` }} /></span>.
          </Comment>
        </>}
        {after && <>
          <Comment t={t} t0={-1} y={1000} x={150} w={834} who={P.r1} o={1 - less} dim={less}>Brand B, I think.</Comment>
          <Comment t={t} t0={-1} y={1180} x={150} w={834} who={P.r2} o={1 - less} dim={less}>Brand B.</Comment>
          <Comment t={t} t0={T.share + 0.15} y={lerp(1360, 1000, less)} x={150} w={834} who={P.own} hl={less}>
            <Typed t={t} t0={T.share + 0.35} t1={T.share + 1.3} text="fuelmybuild.com/ken/supra" caret={pal.em} style={{ ...mono(46, pal.tx) }} keepCaret={0.6} />
          </Comment>
          {less > 0.01 && <div style={{ position: "absolute", left: 150, top: 1190, width: 834, opacity: ez(t, T.more, 0.4), transform: `translateY(${(1 - ez(t, T.more, 0.5)) * 30}px)`,
            background: pal.paper, borderRadius: 18, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={mono(40, pal.ink2)}>TURBO KIT · BRAND</div><div style={ui(56, pal.ink)}>Arden · 1999 Supra</div></div>
            <div style={{ width: 150, height: 110, position: "relative" }}><Cut id="C01" cx={75} cy={55} w={130} shadow={0.2} /></div>
          </div>}
        </>}
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 2: the turbo, its brand field empty
  const s2 = (t) => {
    const d = drift(t, "tb", 5, 0.3);
    const fieldP = spr(t - (T.brand1 - 0.3), 190, 18);
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * seg(t, WHIP, PUNCH)})`, transformOrigin: "50% 45%" }}>
        <Cut id="C01" cx={540 + d.x} cy={780 + d.y} w={640} rot={d.r * 4} shadow={0.55} />
        <div style={{ position: "absolute", left: 160, width: 760, top: 1170, opacity: clamp(fieldP * 2), transform: `translateY(${(1 - fieldP) * 40}px)` }}>
          <div style={mono(44, rgba(pal.tx, 0.6))}>BRAND</div>
          <div style={{ marginTop: 10, height: 110, borderRadius: 18, border: `4px solid ${pal.em}`, background: rgba(pal.em, 0.08), display: "flex", alignItems: "center", padding: "0 28px" }}>
            <span style={{ width: 6, height: 64, background: pal.em, borderRadius: 3, opacity: Math.floor(t * 2.4) % 2 ? 0.15 : 1 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shot 3: the fix, on the registry card; then the build page assembles around it
  const s3 = (t) => {
    const d = drift(t, "s3", 3, 0.25);
    const card = track(t, { y: 846 }, [[T.page - 0.15, { y: 968 }, 0.7]]);
    const page = ez(t, T.page - 0.05, 0.6, EASE.out);
    const head = ez(t, T.fuel - 0.1, 0.45, EASE.out);
    const rows = [
      { label: "PART", v: "Turbo kit", at: T.name + 0.45 },
      { label: "BRAND", v: "Arden", at: T.brand2 + 0.75 },
      { label: "ON BUILD", v: "1999 Supra · 2JZ", at: T.on + 0.35 },
    ];
    const link = ez(t, T.on + 0.4, 0.5);
    return <AbsoluteFill style={{ background: pal.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)}` }}>
        {page > 0.01 && <BuildPage pal={pal} t={t} x={70} y={390} w={940} h={1150} o={page} photo="B01" photoH={250} title="1999 Supra" sub="Parts · 14" url="fuelmybuild.com/ken/supra" urlAt={T.pub} urlBig={ez(t, T.link, 0.4)} brandAt={T.page - 0.05} />}
        <Cut id="C01" cx={lerp(800, 860, page)} cy={lerp(610, 1050, page)} w={lerp(330, 150, page)} rot={d.r * 3} shadow={0.5} z={7} o={1} />
        <div style={{ position: "absolute", left: 96, top: card.y, width: 888, background: pal.paper, borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 60px -24px rgba(0,0,0,.7)", zIndex: 6, padding: "34px 40px 30px 52px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: pal.em }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 240, left: ((t * 150) % 1300) - 400, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))" }} />
          <div style={{ position: "relative", height: 60, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
            <span style={ui(48, pal.ink)}>Fuel<span style={{ color: "#8A6FB8" }}>My</span>Build</span><span style={{ ...mono(40, pal.ink2), marginLeft: 18 }}>· Parts registry</span>
          </div>
          {rows.map((r, i) => {
            const p = spr(t - r.at, 200, 19);
            return <div key={i} style={{ position: "relative", height: 150, borderTop: `3px solid ${rgba(pal.ink, 0.12)}` }}>
              <div style={{ ...mono(40, pal.ink2), position: "absolute", left: 0, top: 18, opacity: i === 1 ? seg(t, T.brand2 + 0.8, T.brand2 + 0.95) : 1 }}>{r.label}</div>
              {t >= r.at ? <div style={{ ...ui(66, pal.ink), position: "absolute", left: 0, top: 64, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 24}px)` }}>{r.v}</div>
                : <div style={{ position: "absolute", left: 0, top: 84, width: 360, height: 30, borderRadius: 15, background: rgba(pal.ink, 0.07) }} />}
            </div>;
          })}
          {/* the build line: ties the named part to the build it's on */}
          <div style={{ position: "absolute", right: 46, top: 140, width: 6, height: 300 * link, background: pal.em, borderRadius: 3 }} />
        </div>
      </div>
    </AbsoluteFill>;
  };
  const shots = [
    { at: 0, render: (t) => thread(t, 1) },
    { at: WHIP, render: s2, enter: { kind: "whip", d: 0.42, dir: -1 } },
    { at: PUNCH, render: s3, enter: { kind: "punch" } },
    { at: BACK, render: (t) => thread(t, 2), enter: { kind: "match" } },
  ];
  // sound: one cue per on-screen action (transitions and headline landings are added by audio/score.py)
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [hook === "A" ? tl.hook[3].s - 0.25 : tl.hook[1].s, "msg-pop"], [T.repeats - 0.2, "msg-pop"], [T.repeats + 0.35, "pencil-line"], [T.now, "chip-fade"], [T.now + 0.3, "emph-pop"],
    [T.brand1 - 0.3, "card-rise"], [T.name + 0.45, "value-tick"], [T.brand2 + 0.75, "stamp"], [T.on + 0.35, "value-tick"], [T.on + 0.4, "draw"],
    [T.page - 0.15, "slide-soft"], [T.page - 0.05, "card-rise"], [T.fuel - 0.1, "pop-soft"], [T.pub, "typing:0.86"], [T.link, "emph-pop"],
    [T.share + 0.15, "msg-pop"], [T.share + 0.35, "typing:0.95"], [T.less, "air-pull"], [T.more, "card-settle"], [ctaT, "cta-pop"],
  ];
  // music: dead silence before the fix (silence punch), back in on the punch
  const music = { bpm: 98, root: 49, mode: "minor", style: "investigate", cut: PUNCH - 0.5, ret: PUNCH };
  return { shots, heads, sfx, music };
}
