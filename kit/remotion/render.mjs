import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.tsx") });
const comp = await selectComposition({ serveUrl, id: "Reel", browserExecutable: B });
const t0 = Date.now(); let last = 0;
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: "out/video.mp4", browserExecutable: B, concurrency: Number(process.env.CONC || 4),
  crf: 14, pixelFormat: "yuv420p", x264Preset: "slow", imageFormat: "jpeg", jpegQuality: 95, muted: true, chromiumOptions: { gl: "swangle" },
  onProgress: ({ progress }) => { if (progress - last > 0.05) { last = progress; console.log((progress * 100).toFixed(0) + "%", ((Date.now() - t0) / 1000).toFixed(0) + "s"); } } });
console.log("done", (Date.now() - t0) / 1000);
