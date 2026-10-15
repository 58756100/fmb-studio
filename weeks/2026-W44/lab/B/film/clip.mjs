// node clip.mjs <id> <f0> <f1> <out.mp4>  muted test render of a frame range (energy checks before the real render)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, f0, f1, out] = process.argv.slice(2);
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx"), publicDir: path.resolve("../../../../../kit/remotion/public") });
const comp = await selectComposition({ serveUrl, id, browserExecutable: B });
const t = Date.now();
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: out, browserExecutable: B, frameRange: [+f0, +f1], concurrency: 4, crf: 14, muted: true,
  imageFormat: "jpeg", jpegQuality: 95, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000 });
console.log("rendered", out, ((Date.now() - t) / 1000).toFixed(0) + "s");
