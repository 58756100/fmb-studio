// @ts-nocheck
// Review-only composition: every stand-in on one frame (not rendered into any reel).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Photo, CheckPresenter, CounterBell, HangTag } from "./assets";
export const AssetsSheet = () => <AbsoluteFill style={{ background: "#fff", fontFamily: "Inter, sans-serif", padding: 30, display: "flex", flexDirection: "column", gap: 30 }}>
  <Photo name="c3-evo-intake-install.jpg" w={1020} h={765} />
  <div style={{ display: "flex", gap: 20 }}>
    <Photo name="c3-r34-head-weep.jpg" w={500} h={375} />
    <Photo name="c3-wrx-exhaust-underside.jpg" w={500} h={375} />
  </div>
  <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
    <CheckPresenter w={300} /><CounterBell w={260} /><HangTag w={240}><div style={{ fontSize: 46, fontWeight: 600 }}>Rattle. Fix?</div></HangTag>
  </div>
</AbsoluteFill>;
