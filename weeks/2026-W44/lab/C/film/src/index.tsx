// @ts-nocheck
import React from "react";
import { registerRoot, Composition } from "remotion";
import { useT } from "./lib/core";
import { C1, C1_DUR } from "./reels/C1";
const REELS = { C1: [C1, C1_DUR] };
try { const g = require("./reels/G2"); REELS.G2 = [g.G2, g.G2_DUR]; } catch (e) {}
try { const p = require("./reels/P1"); REELS.P1 = [p.P1, p.P1_DUR]; } catch (e) {}
const make = R => ({ check }) => { const t = useT(); return <R t={t} check={check} />; };
const Root = () => <>{Object.entries(REELS).map(([id, [R, dur]]) =>
  <Composition key={id} id={id} component={make(R)} durationInFrames={Math.round(dur * 30)} fps={30} width={1080} height={1920} defaultProps={{ check: false }} />)}</>;
registerRoot(Root);
