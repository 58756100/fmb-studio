// @ts-nocheck
import React, { useEffect, useState } from "react";
import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, delayRender, continueRender, staticFile } from "remotion";
import "./ui.css";
import { Shots, Headline, Subtitles, Illustrative, BG, FPS } from "./lib";
import * as L1 from "./L1";
import * as L2 from "./L2";
import * as L3 from "./L3";
import D1 from "./data/B-L1.json";
import D2 from "./data/B-L2.json";
import D3 from "./data/B-L3.json";

const VIDS = { "B-L1": [L1, D1], "B-L2": [L2, D2], "B-L3": [L3, D3] };
const PRE = ["car-01", "car-05", "car-09", "car-13", "car-19", "car-12", "car-04", "mech", "part-01", "part-02", "part-03", "part-05", "part-06",
  "obj/work-glove", "obj/engine-block", "obj/car-lift", "obj/vacuum-line-photo", "obj/wastegate", "obj/tool-drawer"];
let ready = null;
const load = () => ready || (ready = (async () => {
  const font = new FontFace("Inter", `url(${staticFile("fonts/inter-latin-opsz-normal.woff2")}) format("woff2-variations")`, { weight: "100 900" });
  document.fonts.add(await font.load());
  await Promise.all(PRE.map((n) => new Promise((r) => { const i = new Image(); i.onload = () => i.decode().then(r, r); i.onerror = r; i.src = staticFile(`img/${n}.png`); })));
})());

const Video = ({ id }) => {
  const frame = useCurrentFrame(); const t = frame / FPS;
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("assets"));
  useEffect(() => { load().then(() => { setOk(true); continueRender(h); }); }, []);
  const [M, D] = VIDS[id];
  if (!ok) return <AbsoluteFill style={{ background: BG }} />;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      <Shots t={t} shots={M.SHOTS} />
      {M.Overlay ? <M.Overlay t={t} /> : null}
      <Illustrative />
      <Headline t={t} heads={D.heads} />
      <Subtitles t={t} subs={D.subs} />
    </AbsoluteFill>
  );
};
const Root = () => <>{Object.keys(VIDS).map((id) => <Composition key={id} id={id} component={Video} defaultProps={{ id }} fps={FPS} width={1080} height={1920} durationInFrames={30 * FPS} />)}</>;
registerRoot(Root);
