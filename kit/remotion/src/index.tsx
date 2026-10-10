// @ts-nocheck
import React from "react";
import { registerRoot, Composition, staticFile } from "remotion";
import { Reel, DURATION } from "./Reel";
import { Story } from "./story/Story";
const Root = () => <>
  <Composition id="Reel" component={Reel} durationInFrames={Math.round(DURATION * 60)} fps={60} width={1080} height={1920} />
  <Composition id="Story" component={Story} fps={60} width={1080} height={1920} durationInFrames={60}
    defaultProps={{ reel: "C1", part: "body" }}
    calculateMetadata={async ({ props }) => {
      const tl = await fetch(staticFile(`tl/${props.reel}.json`)).then(r => r.json());
      return { durationInFrames: Math.round(tl.parts[props.part].dur * 60) };
    }} />
</>;
registerRoot(Root);
