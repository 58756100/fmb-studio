// @ts-nocheck
import React from "react";
import { registerRoot, Composition } from "remotion";
import { useT } from "./lib/core";
import { COL, DUR as COL_DUR } from "./reels/COL";
const REELS = { "C3-COL": [COL, COL_DUR] };
try { const g = require("./reels/GAR"); REELS["C3-GAR"] = [g.GAR, g.DUR]; } catch (e) {}
try { const s = require("./reels/SUP"); REELS["C3-SUP"] = [s.SUP, s.DUR]; } catch (e) {}
const make = R => ({ check }) => { const t = useT(); return <R t={t} check={check} />; };
const Root = () => <>{Object.entries(REELS).map(([id, [R, dur]]) =>
  <Composition key={id} id={id} component={make(R)} durationInFrames={Math.round(dur * 30)} fps={30} width={1080} height={1920} defaultProps={{ check: false }} />)}</>;
registerRoot(Root);
