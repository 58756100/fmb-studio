// node cues.mjs <id[,id]> [hooks=A,B,C] -> out/cues/<id>-<hook>.json (timeline export for audio/score.py)
import { build } from "esbuild"; import { execFileSync } from "node:child_process";
await build({ entryPoints: ["src/cues-entry.tsx"], bundle: true, platform: "node", format: "esm", outfile: "out/cues-bundle.mjs", jsx: "automatic", logLevel: "error",
  banner: { js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" } });
execFileSync("node", ["out/cues-bundle.mjs", ...process.argv.slice(2)], { stdio: "inherit" });
