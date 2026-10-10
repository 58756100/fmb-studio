// @ts-nocheck
import React, { useEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender, staticFile } from "remotion";
import "./lib/ui.css";
import { ws, we } from "./cues";
import { FPS, clamp } from "./lib/anim";
import * as S from "./Scenes";
import { zoomBlur } from "./remocn/zoom-blur";
import { whipPan } from "./remocn/whip-pan";
import { pushThrough } from "./remocn/push-through";
import { focusPull } from "./remocn/focus-pull";

export const DURATION = 44.0;

// cut points (absolute seconds) and the transition that crosses each cut
const c1 = ws(11) - 0.06, c2 = ws(14) - 0.08, c3 = ws(24) - 0.1, c4 = ws(30) - 0.08, c5 = ws(33) - 0.06, c6 = ws(36) - 0.06,
  c7 = we(40) + 0.22, c8 = ws(47) - 0.12, c9 = ws(56) - 0.08, c10 = ws(70) - 0.1, c11 = ws(73) - 0.1, c12 = ws(85) - 0.1, c13 = ws(97) - 0.1, c14 = ws(107) - 0.12;

const SCENES = [
  { C: S.S1, a: 0, b: c1 },
  { C: S.S2, a: c1, b: c2 },
  { C: S.S3, a: c2, b: c3 },
  { C: S.S4, a: c3, b: c4 },
  { C: S.S5a, a: c4, b: c5 },
  { C: S.S5b, a: c5, b: c6 },
  { C: S.S5c, a: c6, b: c7, extra: { dis0: we(40) - 0.42, dis1: c7 - 0.02 } },
  { C: S.S6, a: c7, b: c8 },
  { C: S.S7, a: c8, b: c9 },
  { C: S.S8, a: c9, b: c10 },
  { C: S.S9, a: c10, b: c11 },
  { C: S.S10, a: c11, b: c12 },
  { C: S.S11, a: c12, b: c13 },
  { C: S.S12, a: c13, b: c14 },
  { C: S.S13, a: c14, b: DURATION + 1 },
];
// transition i sits on the cut between scene i and i+1
const TR = [
  { p: zoomBlur({ blur: 18 }), L: 0.36 },
  { p: whipPan({ direction: "left", blur: 26 }), L: 0.34 },
  { p: zoomBlur({ blur: 22 }), L: 0.42 },
  { p: whipPan({ direction: "up", blur: 26 }), L: 0.32 },
  { p: whipPan({ direction: "left", blur: 26 }), L: 0.3 },
  { p: whipPan({ direction: "left", blur: 26 }), L: 0.3 },
  { p: null, L: 0 },
  { p: pushThrough({ zoom: 2.0, blur: 14 }), L: 0.5 },
  { p: zoomBlur({ blur: 18 }), L: 0.4 },
  { p: pushThrough({ zoom: 2.2, blur: 14 }), L: 0.46 },
  { p: zoomBlur({ blur: 20 }), L: 0.42 },
  { p: focusPull({ blur: 18 }), L: 0.46 },
  { p: zoomBlur({ blur: 18 }), L: 0.4 },
  { p: pushThrough({ zoom: 1.8, blur: 12 }), L: 0.46 },
];
export const CUTS = { c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14 };

const Wrap = ({ tr, prog, dir, children }) => {
  if (!tr || !tr.p) return <AbsoluteFill>{children}</AbsoluteFill>;
  const Comp = tr.p.component;
  return <Comp presentationProgress={prog} presentationDirection={dir} passedProps={tr.p.props}>{children}</Comp>;
};

const PRELOAD = ["car-01", "car-02", "car-03", "car-04", "car-05", "car-06", "car-07", "car-08", "car-09", "car-10", "car-11", "car-12", "car-13", "car-14", "car-15", "car-16", "car-17", "car-18", "car-19", "mech",
  "part-01", "part-02", "part-03", "part-04", "part-05", "part-06", "part-07"];

export const Reel = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [h] = useState(() => delayRender("assets"));
  useEffect(() => {
    const font = new FontFace("Inter", `url(${staticFile("fonts/inter-latin-opsz-normal.woff2")}) format("woff2-variations")`, { weight: "100 900" });
    const imgs = [...PRELOAD.map(n => staticFile(`img/${n}.png`)), staticFile("emoji/1f440.png"), staticFile("emoji/1f525.png")].map(src => new Promise(res => { const i = new Image(); i.onload = () => i.decode().then(res, res); i.onerror = res; i.src = src; }));
    Promise.all([font.load().then(f => document.fonts.add(f)), ...imgs]).then(() => continueRender(h));
  }, []);
  const layers = [];
  SCENES.forEach((sc, i) => {
    const tin = i > 0 ? TR[i - 1] : null, tout = i < TR.length ? TR[i] : null;
    const Lin = tin ? tin.L : 0, Lout = tout ? tout.L : 0;
    const from = sc.a - Lin / 2, to = sc.b + Lout / 2;
    if (t < from || t >= to) return;
    let node = <sc.C t={t} a={sc.a} b={sc.b} {...(sc.extra || {})} />;
    if (tin && tin.L && t < sc.a + Lin / 2) node = <Wrap tr={tin} prog={clamp((t - from) / Lin)} dir="entering">{node}</Wrap>;
    else if (tout && tout.L && t > sc.b - Lout / 2) node = <Wrap tr={tout} prog={clamp((t - (sc.b - Lout / 2)) / Lout)} dir="exiting">{node}</Wrap>;
    layers.push({ i, node });
  });
  // entering scene above exiting scene
  layers.sort((x, y) => x.i - y.i);
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: "Inter, sans-serif" }}>
      {layers.map(({ i, node }) => <AbsoluteFill key={i}>{node}</AbsoluteFill>)}
    </AbsoluteFill>
  );
};
