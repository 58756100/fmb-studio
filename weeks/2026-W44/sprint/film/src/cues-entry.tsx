// @ts-nocheck
// Node-side export of every reel's timeline for the audio engine (no React render): duration, voice timeline,
// shots/transitions, headline landings/exits, the reel's own SFX cue list and music spec. Bundled by cues.mjs.
import fs from "node:fs";
import { FPS, makeTL } from "./kit";
import * as AL1 from "./reels/A-L1"; import * as AL2 from "./reels/A-L2"; import * as AL3 from "./reels/A-L3";
import * as BL1 from "./reels/B-L1"; import * as BL2 from "./reels/B-L2"; import * as BL3 from "./reels/B-L3";
import * as COL from "./reels/C3-COL"; import * as GAR from "./reels/C3-GAR"; import * as SUP from "./reels/C3-SUP";
import { S0 } from "./reels/s0-index";
import { B2 } from "./reels/b2-index";
const REELS = { "A-L1": AL1, "A-L2": AL2, "A-L3": AL3, "B-L1": BL1, "B-L2": BL2, "B-L3": BL3, "C3-COL": COL, "C3-GAR": GAR, "C3-SUP": SUP, ...S0, ...B2 };
const rd = (id, f) => JSON.parse(fs.readFileSync(`src/vo/${id}/${f}.json`, "utf8"));
export function exportCues(id, hook) {
  const R = REELS[id];
  const tl = makeTL(rd(id, "words"), R.HOOK_WORDS, hook === "A" ? null : rd(id, `hook-${hook}.words`), R.HOOK_PAD?.[hook] ?? 0);
  const film = R.build(tl, hook);
  const frames = Math.ceil((tl.last + R.TAIL) * FPS);
  // same automatic exits as <Heads>
  const heads = film.heads.map((h, i) => {
    let exit = h.exit;
    if (!exit && film.heads[i + 1]) { const nx = film.heads[i + 1].words[0].t, last = h.words[h.words.length - 1].t; exit = { at: Math.max(last + 0.5, Math.min(nx - 0.42, last + (h.hold ?? 1.3))), mode: h.out || "up" }; }
    return { text: h.words.map((w) => w.w).join(" "), t0: h.words[0].t, words: h.words.map((w) => w.t), key: (h.key ?? []).map((k) => h.keyAt ?? (h.words[k] ? h.words[k].t + 0.08 : null)).filter((x) => x != null),
      exit: exit ? { at: exit.at, mode: exit.mode } : null, carry: h.carry ? { at: h.carry.at, land: h.carry.at + h.carry.dur } : null, dot: h.dot ?? null };
  });
  return { id, hook, fps: FPS, frames, duration: frames / FPS, cut: tl.cut, cutA: tl.cutA, shift: tl.shift, hookPad: tl.pad ?? 0, hookEnd: tl.hookEnd, last: tl.last,
    hookWords: tl.hook.map((x) => [x.w, x.s, x.e]), bodyWords: tl.body.map((x) => [x.w, x.s, x.e]),
    shots: film.shots.map((s) => ({ at: s.at, kind: s.enter?.kind ?? null, d: s.enter?.d ?? 0, dir: s.enter?.dir ?? null })),
    heads, sfx: (film.sfx ?? []).map(([t, k, g]) => [+t.toFixed(4), k, g ?? 1]), music: film.music ?? null };
}
const [ids, hooks = "A,B,C", out = "out/cues"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
for (const id of ids.split(",")) for (const hook of hooks.split(",")) {
  const c = exportCues(id, hook); fs.writeFileSync(`${out}/${id}-${hook}.json`, JSON.stringify(c));
  console.log(id, hook, c.duration.toFixed(2) + "s", c.shots.length, "shots", c.heads.length, "heads", c.sfx.length, "sfx", c.music ? "music" : "NO MUSIC SPEC");
}
