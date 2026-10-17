// @ts-nocheck
// Compositions: <id>-<hook> for the 9 reels x hooks A/B/C. 1080x1920, 30 fps. Length follows the VO.
import React, { useEffect, useMemo, useState } from "react";
import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, delayRender, continueRender, staticFile, getInputProps } from "remotion";
import { FPS, W, H, makeTL, Shots, Heads, MBDefs, src } from "./kit";
import { Checker } from "./checker";
import * as AL1 from "./reels/A-L1";
import * as AL2 from "./reels/A-L2";
import * as AL3 from "./reels/A-L3";
import * as BL1 from "./reels/B-L1";
import * as BL2 from "./reels/B-L2";
import * as BL3 from "./reels/B-L3";
import * as COL from "./reels/C3-COL";
import * as GAR from "./reels/C3-GAR";
import * as SUP from "./reels/C3-SUP";

const VO = {};
const ctx = require.context("./vo", true, /\.json$/);
ctx.keys().forEach((k) => { const [, id, f] = k.match(/\.\/([^/]+)\/(.+)\.json$/); (VO[id] = VO[id] || {})[f] = ctx(k); });

export const REELS = { "A-L1": AL1, "A-L2": AL2, "A-L3": AL3, "B-L1": BL1, "B-L2": BL2, "B-L3": BL3, "C3-COL": COL, "C3-GAR": GAR, "C3-SUP": SUP };
export const timeline = (id, hook) => {
  const v = VO[id], R = REELS[id];
  return makeTL(v.words, R.HOOK_WORDS, hook === "A" ? null : v[`hook-${hook}.words`]);
};
const FONTS = {
  Inter: ["inter-latin-opsz-normal.woff2", "100 900"],
  "Barlow Condensed": ["barlow-condensed-latin-700-normal.woff2", "700"],
  "Source Sans 3": ["source-sans-3-latin-600-normal.woff2", "600"],
  "IBM Plex Mono": ["ibm-plex-mono-latin-500-normal.woff2", "500"],
};
let loaded = {};
const load = (ids) => {
  const key = ids.join(",");
  return loaded[key] || (loaded[key] = (async () => {
    await Promise.all(Object.entries(FONTS).map(async ([fam, [file, w]]) => { const f = new FontFace(fam, `url(${staticFile("fonts/" + file)}) format("woff2")`, { weight: w }); document.fonts.add(await f.load()); }));
    await Promise.all(ids.map((id) => new Promise((r) => { const i = new Image(); i.onload = () => i.decode().then(r, r); i.onerror = r; i.src = src(id); })));
  })());
};

const Reel = ({ id, hook }) => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const R = REELS[id];
  const tl = useMemo(() => timeline(id, hook), [id, hook]);
  const film = useMemo(() => R.build(tl, hook), [tl]);
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("assets " + id));
  useEffect(() => { load(R.IMAGES).then(() => { setOk(true); continueRender(h); }); }, []);
  if (!ok) return <AbsoluteFill style={{ background: R.BG }} />;
  return (
    <AbsoluteFill style={{ background: R.BG, overflow: "hidden" }}>
      <MBDefs />
      <Shots t={t} shots={film.shots} />
      {film.over ? film.over(t) : null}
      <Heads t={t} heads={film.heads} st={R.TEXT} />
      {getInputProps().check ? <Checker t={t} /> : null}
    </AbsoluteFill>
  );
};
export const durationOf = (id, hook) => { const tl = timeline(id, hook); return Math.ceil((tl.last + REELS[id].TAIL) * FPS); };
const Root = () => <>{Object.keys(REELS).flatMap((id) => ["A", "B", "C"].map((hook) => (
  <Composition key={id + hook} id={`${id}-${hook}`} component={Reel} defaultProps={{ id, hook }} fps={FPS} width={W} height={H} durationInFrames={durationOf(id, hook)} />)))}</>;
registerRoot(Root);
