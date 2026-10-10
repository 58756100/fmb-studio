import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx") });
const comp = await selectComposition({ serveUrl, id: "Reel", browserExecutable: B });
for (const [a, b] of [[972, 1133]]) {
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: `out/seg_${a}.mp4`, browserExecutable: B, concurrency: 2, frameRange: [a, b],
    crf: 14, pixelFormat: "yuv420p", x264Preset: "slow", imageFormat: "jpeg", jpegQuality: 95, muted: true, chromiumOptions: { gl: "swangle" } });
  console.log("seg", a, b);
}
