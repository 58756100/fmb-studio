// @ts-nocheck
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Reel, DURATION } from "./Reel";
const Root = () => <Composition id="Reel" component={Reel} durationInFrames={Math.round(DURATION * 60)} fps={60} width={1080} height={1920} />;
registerRoot(Root);
