// @ts-nocheck
import React from "react";
import { AbsoluteFill } from "remotion";
import { wordsFor } from "../kit";
export const HOOK_WORDS = 3; export const TAIL = 1.0; export const BG = "#fff"; export const IMAGES = [];
export const TEXT = { font: "Inter", weight: 600, size: 112, ls: "-0.038em", opsz: 32, color: "#1D1D1F", accent: "#F43034", align: "center", maxW: 900, top: 300, lead: 1.04 };
export const build = (tl) => ({ shots: [{ at: 0, render: () => <AbsoluteFill style={{ background: "#fff" }} /> }], heads: [{ words: wordsFor(tl.all, "stub", 0) }] });
