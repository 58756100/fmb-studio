// @ts-nocheck
// S0-06 (lane 0, garages): "Day One". Mia (E06) on her first day at Colleen's (E10) shop; the silver R34 (A13) on her lift
// runs hot. At her last shop a hot Skyline meant the radiator, every time, so before lunch she's draining coolant and
// pricing a $900 radiator. Colleen walks over, says nothing, taps the tool chest. Top drawer: the radiator was replaced
// six weeks ago by Sato Garage, with photos and the brand. Next drawer: the hoses are still the factory originals. Under
// the lower clamp, there's the split. One hose, one hour, logged under Mia's name.
// Device: a red rolling tool chest whose drawers hold the car's history instead of tools. Each drawer bed (black foam)
// is a section of the R34's page, laid out at right angles like tools: entry cards, photos, part cutouts.
// Look: clean shop bay (F01), the red chest as the hero object, black foam drawer beds, white entry cards, one red accent.
// Transitions: push-in past Mia to the radiator, lift-out (radiator rises out of the car onto the bench), object wipe
// (Colleen's shadow crosses the order form), tap (two taps on the chest), drawer open = portal toward the camera, drawer
// swap (close/open), drop straight down out of the drawer to the lower hose, pull-back to the chest for the payoff, CTA,
// the drawer shuts flush (loop).
// remocn (ported): drawer slide (spring settle), right-angle knolling grid, typewriter (order form), period-drop.
// New vs S0-01: drawers as page sections, a drop-down camera move into a code-drawn macro.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ctaHead, W, H, RED, INK, GREY, seg, lerp, clamp, spr, EASE, ez, drift, dT, track, wordsFor, Cut, src, rgba, Typed } from "../kit";
import { Full, Scrim, Haze, glass, font } from "./s0kit";

export const HOOK_WORDS = 13;
export const TAIL = 1.0;
export const LIFE = 1.3;
export const BG = "#F2F2F4";
export const TEXT = { font: "Inter", weight: 700, size: 108, min: 76, ls: "-0.04em", opsz: 32, color: INK, accent: RED, line2: null, align: "center", maxW: 940, top: 270, lead: 1.04 };
export const IMAGES = ["F01", "A13", "E06", "E10", "C12", "G12", "G07"];
const CHEST = { x: 210, y: 760, w: 660, h: 760 }, DR = [{ y: 30, h: 110 }, { y: 150, h: 110 }, { y: 270, h: 130 }, { y: 410, h: 150 }, { y: 570, h: 170 }];

const Steam = ({ t, x, y, k = 1 }) => <>{Array.from({ length: 6 }, (_, i) => { const p = ((t * 0.45 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: x - 60 + Math.sin(t * 1.3 + i) * 30, top: y - p * 260,
  width: 120 + p * 120, height: 120 + p * 120, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(150,158,170,.75), rgba(150,158,170,0))", opacity: k * (1 - p) * 0.8, filter: "blur(6px)", zIndex: 8 }} />; })}</>;
// the red rolling chest; open = which drawer is out (index) and by how much (0..1)
const Chest = ({ t, x = CHEST.x, y = CHEST.y, s = 1, open = -1, amt = 0, tap = 0 }) => <div style={{ position: "absolute", left: x, top: y, width: CHEST.w, height: CHEST.h, transform: `scale(${s})`, transformOrigin: "50% 100%", zIndex: 6 }}>
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 20, borderRadius: 18, background: "linear-gradient(90deg, #A31A1F, #D7343A 30%, #C2252B 70%, #8E161B)", boxShadow: "0 30px 50px -20px rgba(0,0,0,.6)" }} />
  {DR.map((d, i) => { const o = i === open ? amt : 0;
    return <div key={i} style={{ position: "absolute", left: 22 - o * 14, right: 22 - o * 14, top: d.y + o * 30, height: d.h, borderRadius: 10, background: "linear-gradient(180deg, #E33E44, #B8232A)", boxShadow: `inset 0 2px 0 rgba(255,255,255,.3), 0 ${4 + o * 20}px ${8 + o * 20}px rgba(0,0,0,.35)`, transform: `scale(${1 + o * 0.06})`, zIndex: i === open ? 3 : 1 }}>
      <div style={{ position: "absolute", left: "20%", right: "20%", top: d.h / 2 - 9, height: 18, borderRadius: 9, background: "linear-gradient(180deg, #F4F5F7, #9EA3AA)" }} />
    </div>; })}
  {[0.15, 0.85].map((u, i) => <div key={i} style={{ position: "absolute", left: `${u * 100}%`, bottom: -10, width: 54, height: 54, marginLeft: -27, borderRadius: 27, background: "radial-gradient(circle at 40% 35%, #555, #111)" }} />)}
  {tap > 0 && tap < 1 && <div style={{ position: "absolute", left: CHEST.w - 120, top: 40, width: 90, height: 90, borderRadius: 45, border: "5px solid rgba(255,255,255,.8)", transform: `scale(${0.4 + 1.6 * tap})`, opacity: 1 - tap }} />}
</div>;
const Lift = () => <>{[160, 920].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 30, top: 520, width: 60, height: 1100, background: "linear-gradient(90deg, #1C3F8F, #2E5BC4, #1C3F8F)", zIndex: 1 }} />)}
  <div style={{ position: "absolute", left: 200, top: 1210, width: 680, height: 26, background: "linear-gradient(180deg, #F2C230, #C79B12)", borderRadius: 6, zIndex: 3 }} /></>;

export function build(tl, hook) {
  const at = tl.at;
  const T = {
    colleen: at("colleen", 1), points: at("points"), runs: at("runs"), figure: at("figure"), okay: at("okay,"), last: at("last"), hot: at("hot", 2), skyline: at("skyline"), meant: at("meant"),
    radiator1: at("radiator.", 1), every: at("every"), so: at("so", 2), lunch: at("lunch"), draining: at("draining"), pricing: at("pricing"), nine: at("nine-hundred-dollar"),
    then: at("then"), walks: at("walks"), taps: at("taps"), top: at("top"), drawer1: at("drawer."), rad3: at("radiator", 3), replaced: at("replaced"), six: at("six"), photos: at("photos,"),
    brand: at("brand,"), shop: at("shop,", 2), every2: at("everything."), not: at("not"), next: at("next"), hoses: at("hoses,"), factory: at("factory"), orig: at("originals."),
    under: at("under", 1), clamp: at("clamp,"), split: at("split."), one: at("one", 2), hour: at("hour."), logging: at("logging"), name: at("name."), send: tl.cta("send") ?? at("send"),
  };
  const CUT = tl.cut, PUSH = T.okay - 0.15, BENCH = T.so - 0.2, TAPS = T.then - 0.2, OPEN = T.rad3 - 0.45, DROP = T.under - 0.35, BACK = T.one - 0.3;
  const hw = tl.hook;
  const W_ = (list, extra = {}) => ({ words: list.map(([w, t, line = 0]) => ({ w, t, line })), ...extra });
  const hk = hook === "A" ? [W_([["Mia's", hw[0].s], ["first", hw[1].s], ["day.", hw[2].s]], { hold: 0.3 }), W_([["Already", hw[11].s], ["overheating.", hw[12].s]], { key: [1] })]
    : hook === "B" ? [W_([["She", hw[0].s], ["almost", hw[1].s], ["replaced", hw[2].s], ["it.", hw[4].s]], { hold: 0.3 }), W_([["Six", hw[7].s], ["weeks", hw[8].s], ["old.", hw[9].s]], { key: [2] })]
    : [W_([["POV:", hw[0].s], ["day", hw[4].s - 0.2], ["one.", hw[4].s]], { exit: { at: hw[6].s - 0.4, mode: "up" } }), W_([["The", hw[6].s], ["last", hw[7].s], ["tech", hw[8].s], ["left", hw[10].s], ["notes.", hw[11].s]], { key: [4] })];
  hk[hk.length - 1].exit = { at: T.colleen - 0.1, mode: "up" };
  const heads = [
    ...hk,
    W_([["“Runs", T.runs], ["hot.", at("hot,")], ["Figure", T.figure], ["it", at("it")], ["out.”", at("out.")]], { key: [1], hold: 0.5 }),
    W_([["Hot", T.hot], ["Skyline", T.skyline], ["=", T.meant], ["radiator?", T.radiator1]], { key: [3], hold: 1.1 }),
    W_([["$900.", T.nine], ["Whole", T.nine + 0.35], ["first", T.nine + 0.55], ["day.", T.nine + 0.75]], { key: [0], hold: 0.7 }),
    W_([["Top", T.top], ["drawer.", T.drawer1]], { key: [1], hold: 0.5 }),
    W_([["Replaced", T.replaced], ["six", T.six], ["weeks", at("weeks")], ["ago.", at("ago.")]], { key: [1, 2], hold: 2.4, color: "#FFFFFF" }),
    W_([["Not", T.not], ["the", at("the", 5)], ["radiator.", at("radiator", 4)]], { hold: 0.3, color: "#FFFFFF" }),
    W_([["Hoses:", T.hoses], ["factory", T.factory], ["originals.", T.orig]], { key: [2], hold: 0.5, color: "#FFFFFF" }),
    W_([["There's", at("there's")], ["the", at("the", 9)], ["split.", T.split]], { key: [2], hold: 0.6, color: "#FFFFFF" }),
    W_([["One", T.one], ["hose.", at("hose,")], ["One", at("one", 3)], ["hour.", T.hour]], { hold: 0.4 }),
    { ...ctaHead(tl, "Send this to that shop", T.send), key: [4] },
  ];
  heads[heads.length - 1].hold = 9;
  heads[heads.length - 1].dot = tl.last + 0.1;

  // ---------- shots 1-3: the bay; the R34 steaming on the lift; Colleen points; push in past Mia to the radiator
  const bay = (t, phase = 0) => {
    const d = drift(t, "bay", 4, 0.3);
    const col = phase === 1 ? spr(t - (T.colleen - 0.2), 160, 18) * (1 - ez(t, T.figure + 0.3, 0.7, EASE.in)) : 0;
    const push = phase === 2 ? EASE.camera(seg(t, PUSH, PUSH + 1.4)) : 0;
    const lift = phase === 2 ? spr(t - (T.meant - 0.1), 150, 15) : 0;
    const steam = phase === 2 ? 0.5 : 1;
    const radB = hook === "B" && phase === 0 ? 1 - ez(t, CUT - 0.6, 0.5) : 0;
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={0} t1={BENCH} k0={1.06} k1={1.14} fy={0.65} dim={0.08} />
      <Haze h={700} a={0.85} />
      <div style={{ position: "absolute", inset: 0, transform: `${dT(d, 0.6)} scale(${1 + 0.75 * push})`, transformOrigin: "540px 1000px" }}>
        <Lift />
        <div style={{ zIndex: 4, position: "absolute", inset: 0 }}><Cut id="A13" cx={540} cy={1000} w={900} shadow={0.35} /></div>
        <Steam t={t} x={540} y={880} k={steam} />
        {/* the radiator lifts out of the front of the car */}
        {lift > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, zIndex: 9, transform: `translateY(${-lift * 180}px)`, opacity: clamp(lift * 3), filter: `drop-shadow(0 0 ${20 * lift}px rgba(255,170,60,.8))` }}><Cut id="C12" cx={540} cy={1020} w={300} shadow={0} /></div>}
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 7, opacity: 1 - push }}><Cut id="E06" cx={phase === 1 ? 830 : 250} cy={1440} w={520} shadow={0.3} /></div>
        {col > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, zIndex: 8, transform: `translateX(${(1 - col) * -600}px)` }}><Cut id="E10" cx={260} cy={1430} w={640} shadow={0.3} /></div>}
      </div>
      {radB > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(242,242,244,${0.92 * radB})`, zIndex: 20 }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `perspective(1400px) rotateY(${Math.sin(t * 1.2) * 28}deg)`, transformOrigin: "540px 1050px" }}><Cut id="C12" cx={540} cy={1050} w={760} shadow={0.3} /></div>
      </div>}
    </AbsoluteFill>;
  };
  // ---------- shot 4: the bench; the radiator beside the parts order; the order fills in; Colleen's shadow crosses
  const bench = (t) => {
    const d = drift(t, "bn", 3, 0.3), sh = ez(t, TAPS - 0.8, 0.8, EASE.in);
    return <AbsoluteFill>
      <Full id="F01" t={t} k0={1.4} k1={1.45} fy={0.8} dim={0.2} blur={10} />
      <Haze h={700} a={0.85} />
      <div style={{ position: "absolute", left: -40, top: 1060, width: W + 80, height: 900, background: "linear-gradient(180deg, #9EA3AA, #7B8087)", boxShadow: "0 -6px 18px rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <Cut id="C12" cx={300} cy={1040} w={460} shadow={0.4} />
        <div style={{ position: "absolute", left: 560, top: 640, width: 460, height: 700, background: "#fff", borderRadius: 10, boxShadow: "0 20px 30px -16px rgba(0,0,0,.45)", padding: 34, boxSizing: "border-box", transform: "rotate(3deg)" }}>
          <div style={font("Inter", 46, INK, 700)}>Parts order</div>
          <div style={{ marginTop: 30, ...font("Inter", 40, GREY, 500) }}>R34 · cooling</div>
          <div style={{ marginTop: 36, ...font("Inter", 48, INK, 600) }}><Typed t={t} t0={T.pricing - 0.1} t1={T.pricing + 0.6} text="Radiator" /></div>
          <div style={{ marginTop: 20, ...font("Inter", 64, RED, 700), opacity: ez(t, T.nine, 0.2), transform: `scale(${0.8 + 0.2 * spr(t - T.nine, 260, 14)})`, transformOrigin: "0 50%" }}>$900</div>
          <div style={{ position: "absolute", left: 34, bottom: 40, ...font("Inter", 40, GREY, 500) }}>Drain: in progress</div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(0,0,0,0) ${lerp(110, -20, sh)}%, rgba(0,0,0,.28) ${lerp(130, 0, sh)}%)`, zIndex: 30 }} />
    </AbsoluteFill>;
  };
  // ---------- shot 5: the chest; Colleen taps it twice
  const chest = (t) => {
    const col = spr(t - (TAPS + 0.1), 170, 18), d = drift(t, "ch", 3, 0.3);
    const tap = Math.max(seg(t, T.taps - 0.05, T.taps + 0.35), seg(t, T.taps + 0.25, T.taps + 0.65) > 0 && t > T.taps + 0.25 ? seg(t, T.taps + 0.25, T.taps + 0.65) : 0);
    const out = ez(t, T.top - 0.1, 0.5, EASE.out) * 0.4;
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={TAPS} t1={OPEN} k0={1.12} k1={1.18} fy={0.7} dim={0.1} />
      <Haze h={700} a={0.85} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <Chest t={t} open={0} amt={out} tap={tap} />
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 8, transform: `translateX(${(1 - col) * -700}px)` }}><Cut id="E10" cx={150} cy={1430} w={560} shadow={0.3} /></div>
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 8 }}><Cut id="E06" cx={930} cy={1480} w={430} shadow={0.3} /></div>
      </div>
    </AbsoluteFill>;
  };
  // ---------- shots 6-7: inside the drawers (black foam beds = page sections)
  const Card = ({ x, y, w, h, t0, t, children, rot = 0 }) => { const q = spr(t - t0, 200, 18); return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#fff", borderRadius: 18,
    boxShadow: "0 14px 24px -10px rgba(0,0,0,.6)", opacity: clamp(q * 2), transform: `translateY(${(1 - clamp(q)) * 60}px) rotate(${rot}deg)`, overflow: "hidden" }}>{children}</div>; };
  const Bed = ({ children, t }) => <AbsoluteFill style={{ background: "#16171A" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 60% at 50% 55%, #2B2D33, #121316)", backgroundImage: "radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(90deg, #8E161B, #C2252B)" }} />
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(270deg, #8E161B, #C2252B)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230, background: "linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,0))" }} />
    {children}
  </AbsoluteFill>;
  const drawer1 = (t) => {
    const close = ez(t, T.not - 0.2, 0.5, EASE.in);
    return <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-close * 1920}px)` }}>
        <Bed t={t}>
          <div style={{ position: "absolute", left: 80, top: 560, ...font("Inter", 42, "rgba(255,255,255,.6)", 600) }}>R34 · cooling · build log</div>
          <Card t={t} t0={T.rad3 - 0.1} x={80} y={630} w={920} h={230}>
            <div style={{ position: "absolute", left: 30, top: 24 }}><div style={font("Inter", 58, INK, 700)}>Radiator</div>
              <div style={{ ...font("Inter", 46, RED, 600), marginTop: 6 }}>Sep 16, 2026</div></div>
            <div style={{ position: "absolute", right: 20, top: 10, width: 260, height: 210 }}><Cut id="C12" cx={130} cy={105} w={250} shadow={0.2} /></div>
          </Card>
          <Card t={t} t0={T.photos - 0.1} x={80} y={890} w={450} h={340}><img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 40%" }} /></Card>
          <Card t={t} t0={T.photos + 0.1} x={550} y={890} w={450} h={340}><img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 70%", transform: "scale(1.5)" }} /></Card>
          <Card t={t} t0={T.brand - 0.1} x={80} y={1260} w={440} h={120}><div style={{ padding: "18px 26px" }}><div style={font("Inter", 40, GREY, 500)}>Brand</div><div style={font("Inter", 46, INK, 650)}>Varden Cooling</div></div></Card>
          <Card t={t} t0={T.shop - 0.1} x={540} y={1260} w={460} h={120}><div style={{ padding: "18px 26px" }}><div style={font("Inter", 40, GREY, 500)}>Installed by</div><div style={font("Inter", 46, INK, 650)}>Sato Garage</div></div></Card>
        </Bed>
      </div>
      {close > 0 && <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - close) * 1920}px)` }}>{drawer2(t)}</div>}
    </AbsoluteFill>;
  };
  const drawer2 = (t) => <Bed t={t}>
    <div style={{ position: "absolute", left: 80, top: 560, ...font("Inter", 42, "rgba(255,255,255,.6)", 600) }}>R34 · cooling · next drawer</div>
    <Card t={t} t0={T.hoses - 0.1} x={80} y={630} w={920} h={230}>
      <div style={{ position: "absolute", left: 30, top: 24 }}><div style={font("Inter", 58, INK, 700)}>Coolant hoses</div>
        <div style={{ ...font("Inter", 46, GREY, 600), marginTop: 6 }}>Factory original · logged by owner</div></div>
    </Card>
    <Card t={t} t0={T.factory - 0.1} x={80} y={890} w={920} h={520}><img src={src("G12")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "25% 75%", transform: `scale(${1.6 + 0.1 * seg(t, T.factory, DROP)})`, transformOrigin: "25% 75%" }} /></Card>
  </Bed>;
  // ---------- shot 8: under the car: the lower hose, the clamp, the split weeping coolant
  const hose = (t) => {
    const sq = ez(t, T.clamp - 0.2, 0.5) * (1 - ez(t, T.split + 0.6, 0.4)) * Math.abs(Math.sin(t * 4));
    const drip = (k) => ((t - DROP) * 1.2 + k * 0.33) % 1;
    return <AbsoluteFill style={{ background: "#14161A" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 40% at 50% 50%, #3A3F48, #101216 80%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="rub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A4D53" /><stop offset="0.35" stopColor="#202226" /><stop offset="1" stopColor="#0C0D0F" /></linearGradient>
          <linearGradient id="clp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4F5F7" /><stop offset="1" stopColor="#8A8F96" /></linearGradient></defs>
        <path d={`M -100 ${780 + sq * 4} C 300 ${760 + sq * 6} 500 ${1060} 1180 1100`} stroke="url(#rub)" strokeWidth={170} fill="none" strokeLinecap="round" />
        <g transform="translate(560 960) rotate(18)"><rect x={-40} y={-110} width={80} height={220} rx={12} fill="url(#clp)" /><rect x={-14} y={-140} width={28} height={50} rx={6} fill="#B9BDC3" /></g>
        <path d="M 640 1010 l 22 18 l -10 10 l 24 16" stroke="#D9E6B0" strokeWidth={5} fill="none" opacity={ez(t, T.split - 0.3, 0.3)} />
        {[0, 1, 2].map((k) => { const p = drip(k); return t > T.clamp && <ellipse key={k} cx={668} cy={1060 + p * 520} rx={11} ry={16} fill="#9FD46A" opacity={(1 - p) * 0.9 * ez(t, T.clamp, 0.4)} />; })}
      </svg>
      <div style={{ position: "absolute", left: 720, top: 1160, padding: "10px 24px", borderRadius: 30, background: RED, ...font("Inter", 44, "#fff", 650), transform: `scale(${spr(t - T.split, 240, 14)})` }}>split</div>
    </AbsoluteFill>;
  };
  // ---------- shot 9: back at the chest; the top drawer out; Mia's entry drops in beside the radiator; it shuts (loop)
  const payoff = (t) => {
    const d = drift(t, "po", 3, 0.3);
    const outAmt = 1 - ez(t, tl.last + 0.2, 0.6, EASE.in);
    const e = spr(t - (T.logging - 0.1), 190, 17);
    const nod = Math.sin(Math.max(0, t - T.send) * 5) * 3 * Math.exp(-Math.max(0, t - T.send) * 1.2) * (t > T.send ? 1 : 0);
    return <AbsoluteFill>
      <Full id="F01" t={t} t0={BACK} t1={tl.last + 1} k0={1.12} k1={1.18} fy={0.7} dim={0.1} />
      <Haze h={700} a={0.85} />
      <div style={{ position: "absolute", inset: 0, transform: dT(d, 0.5) }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${nod}px)` }}><Cut id="E10" cx={140} cy={1360} w={420} shadow={0.2} style={{ filter: "blur(1.5px)" }} /></div>
        <Chest t={t} open={0} amt={0.6 * outAmt} />
        {/* the open top drawer's bed seen from above: two entries side by side */}
        <div style={{ position: "absolute", left: 160, top: 560, width: 760, height: 250, borderRadius: 16, background: "#1D1F23", opacity: outAmt, transform: `translateY(${(1 - outAmt) * 160}px) scaleY(${outAmt})`, transformOrigin: "50% 100%", zIndex: 9, boxShadow: "0 18px 30px rgba(0,0,0,.4)" }}>
          <div style={{ position: "absolute", left: 20, top: 20, width: 350, height: 210, background: "#fff", borderRadius: 14, padding: 20, boxSizing: "border-box" }}>
            <div style={font("Inter", 42, INK, 650)}>Radiator</div><div style={font("Inter", 40, GREY, 500)}>Sep 16 · Sato</div></div>
          <div style={{ position: "absolute", left: 390, top: 20, width: 350, height: 210, background: "#fff", borderRadius: 14, padding: 20, boxSizing: "border-box", opacity: clamp(e * 2), transform: `translateY(${(1 - clamp(e)) * -300}px)` }}>
            <div style={font("Inter", 42, INK, 650)}>Lower hose</div><div style={font("Inter", 40, RED, 600)}>Oct 2026 · Mia</div></div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 8 }}><Cut id="E06" cx={930} cy={1480} w={430} shadow={0.3} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1540, textAlign: "center", ...font("Inter", 42, INK, 600), opacity: ez(t, T.send + 0.6, 0.4), zIndex: 30 }}>fuelmybuild.com</div>
    </AbsoluteFill>;
  };
  const DR0 = { x: CHEST.x + 22, y: CHEST.y + DR[0].y, w: CHEST.w - 44, h: DR[0].h };
  const shots = [
    { at: 0, render: (t) => bay(t, 0) },
    { at: CUT, render: (t) => bay(t, 1), enter: { kind: "match" } },
    { at: PUSH, render: (t) => bay(t, 2), enter: { kind: "match" } },
    { at: BENCH, render: bench, enter: { kind: "rise", d: 0.6 } },
    { at: TAPS, render: chest, enter: { kind: "whip", d: 0.4, dir: -1 } },
    { at: OPEN, render: drawer1, enter: { kind: "portal", d: 0.65, rect: DR0, r: 10 } },
    { at: DROP, render: hose, enter: { kind: "rise", d: 0.55 } },
    { at: BACK, render: payoff, enter: { kind: "pull", d: 0.6, rect: { x: 160, y: 560, w: 760, h: 250 }, r: 16 } },
  ];
  const ctaT = heads[heads.length - 1].words[0].t;
  const sfx = [
    [0.05, "air-slow-push", 0.5], ...(hook === "B" ? [[0.2, "shimmer-soft"], [CUT - 0.6, "air-short"]] : []), [T.colleen - 0.2, "slide-soft"], [T.points, "pop-soft"],
    [PUSH, "air-slow-push", 0.7], [T.meant - 0.1, "part-lift"], [T.radiator1, "shimmer-soft"], [T.pricing - 0.1, "typing:0.6"], [T.nine, "chip-drop-red"], [TAPS - 0.8, "air-glide"],
    [T.taps - 0.05, "paper-thud"], [T.taps + 0.25, "paper-thud"], [T.top - 0.1, "caster-roll"], [T.rad3 - 0.1, "card-settle"], [T.photos - 0.1, "shutter"], [T.photos + 0.1, "shutter"],
    [T.brand - 0.1, "pop-soft"], [T.shop - 0.1, "pop-soft"], [T.not - 0.2, "caster-roll-out"], [T.hoses - 0.1, "card-settle"], [T.clamp - 0.2, "creak-soft"], [T.split, "emph-pop"],
    [T.logging - 0.1, "card-settle"], [T.logging + 0.3, "pen-write"], [ctaT, "cta-pop"], [tl.last + 0.2, "caster-roll-out"], [tl.last + 0.75, "clunk", 0.6],
  ];
  // music: warm shop groove; cuts when Colleen walks over in silence, returns when the drawer opens
  const music = { bpm: 100, root: 50, mode: "major", style: "warm", cut: T.then - 0.3, ret: T.top - 0.05, room: "shop" };
  return { shots, heads, sfx, music };
}
