// @ts-nocheck
import React from "react";
import { registerRoot, Composition } from "remotion";
import { L1 } from "./L1";
import { L2 } from "./L2";
import { L3 } from "./L3";
const C = { "A-L1": L1, "A-L2": L2, "A-L3": L3 };
const Root = () => <>{Object.entries(C).map(([id, Comp]) => <Composition key={id} id={id} component={Comp} durationInFrames={840} fps={30} width={1080} height={1920} />)}</>;
registerRoot(Root);
