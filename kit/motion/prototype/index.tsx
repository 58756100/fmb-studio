// @ts-nocheck
import React, { useEffect, useState } from "react";
import { registerRoot, Composition, AbsoluteFill, Img, staticFile, useCurrentFrame, delayRender, continueRender } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { portal, whip, FlowText, DrawLine, drift, spring, seg, lerp, EASE, W, H, INK, GREY } from "./kit/motion";

const FPS = 30;
// timeline (frames). S1 0-75, portal 57-75, S2 57-132, whip 120-132, S3 120-210
const S1 = 75, S2 = 75, S3 = 90, TP = 18, TW = 12;
const S2_AT = S1 - TP, S3_AT = S2_AT + S2 - TW, TOTAL = S3_AT + S3;
const TILE = { x: 250, y: 760, w: 580, h: 580 };

const Scene1 = () => {
  const f = useCurrentFrame(); const d = drift(f, "tile", 5);
  const pop = spring(f - 4, FPS, 200, 17);
  return <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <div style={{ position: "absolute", left: TILE.x, top: TILE.y, width: TILE.w, height: TILE.h, borderRadius: 48, background: "#F5F5F7", overflow: "hidden",
      transform: `translate(${d.x}px, ${d.y}px) scale(${0.9 + 0.1 * pop})`, opacity: seg(f, 4, 10) }}>
      <div style={{ position: "absolute", left: "12%", right: "12%", bottom: "13%", height: "7%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.22), rgba(0,0,0,0))", filter: "blur(6px)" }} />
      <Img src={staticFile("img/C01-turbocharger.webp")} style={{ position: "absolute", left: "10%", top: "8%", width: "80%", transform: `rotate(${d.r * 3}deg)` }} />
    </div>
  </AbsoluteFill>;
};
const Scene2 = () => {
  const f = useCurrentFrame(); const k = lerp(1.04, 1.12, f / S2);
  return <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile("img/G01-turbo-install.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k}) translateX(${-f * 0.3}px)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,0) 34%)" }} />
  </AbsoluteFill>;
};
const Scene3 = () => {
  const f = useCurrentFrame(); const land = spring(f - 4, FPS, 160, 15); const d = drift(f, "car", 3);
  const line = "M 540 1130 C 540 1060, 610 1030, 640 960";
  return <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <div style={{ position: "absolute", left: 60, top: 700, width: 960, transform: `translate(${(1 - land) * 140 + d.x}px, ${d.y}px)` }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "-3%", height: "10%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.25), rgba(0,0,0,0))", filter: "blur(8px)" }} />
      <Img src={staticFile("img/A02-supra-side.webp")} style={{ width: "100%", position: "relative" }} />
    </div>
    <DrawLine d={line} p={EASE.out(seg(f, 22, 36))} end={{ x: 640, y: 960 }} />
  </AbsoluteFill>;
};

// voice-timed headlines (word frames would come from words.json)
const H1 = [["Every", 6, 0], ["part", 11, 0], ["has", 17, 0], ["a", 21, 1], ["story", 24, 1]].map(([w, f, line]) => ({ w, f, line }));
const H2 = [["This", 70, 0], ["one", 75, 0], ["went", 79, 0], ["on", 85, 1], ["a", 89, 1], ["Supra", 92, 1]].map(([w, f, line]) => ({ w, f, line }));
const H3 = [["Now", 150, 0], ["it's", 155, 0], ["on", 160, 0], ["the", 166, 1], ["record", 170, 1]].map(([w, f, line]) => ({ w, f, line }));

const Strip = () => {
  const f = useCurrentFrame();
  const series = <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={S1}><Scene1 /></TransitionSeries.Sequence>
    <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TP })} presentation={portal({ rect: TILE, radius: 48 })} />
    <TransitionSeries.Sequence durationInFrames={S2}><Scene2 /></TransitionSeries.Sequence>
    <TransitionSeries.Transition timing={linearTiming({ durationInFrames: TW })} presentation={whip({ dir: -1 })} />
    <TransitionSeries.Sequence durationInFrames={S3}><Scene3 /></TransitionSeries.Sequence>
  </TransitionSeries>;
  const whipping = f >= S3_AT - 1 && f <= S3_AT + TW + 1;
  return <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
    {whipping ? <CameraMotionBlur shutterAngle={200} samples={10}>{series}</CameraMotionBlur> : series}
    {/* text layer lives above the cuts so it can flow across them */}
    <FlowText frame={f} words={H1} color={INK} exit={{ at: S2_AT - 1, mode: "push", stagger: 0, dur: 12, to: { x: TILE.x + TILE.w / 2, y: TILE.y + TILE.h / 2 } }} />
    <FlowText frame={f} words={H2} color="#FFFFFF" accent={{ 5: 96 }} exit={{ at: S3_AT - 3, mode: "left" }}
      carry={{ i: 5, at: S3_AT - 4, dur: 18, to: { x: 540, y: 1180, size: 72 } }} />
    <FlowText frame={f} words={H3} color={INK} accent={{ 4: 176 }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: "Inter", fontSize: 26, color: GREY }}>motionlab prototype: portal · whip + camera blur · word carry · leader line</div>
  </AbsoluteFill>;
};

let ready = null;
const loadFont = () => ready || (ready = (async () => {
  const font = new FontFace("Inter", `url(${staticFile("fonts/inter-latin-opsz-normal.woff2")}) format("woff2-variations")`, { weight: "100 900" });
  document.fonts.add(await font.load());
})());
const Root2 = () => {
  const [ok, setOk] = useState(false); const [h] = useState(() => delayRender("font"));
  useEffect(() => { loadFont().then(() => { setOk(true); continueRender(h); }); }, []);
  return ok ? <Strip /> : <AbsoluteFill style={{ background: "#fff" }} />;
};
const Root = () => <Composition id="Strip" component={Root2} fps={FPS} width={W} height={H} durationInFrames={TOTAL} />;
registerRoot(Root);
