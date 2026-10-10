// @ts-nocheck
// Story engine: turns an approved storyboard (kit/storyboard/w42/<REEL>.js) into a timed, animated reel.
// Every frame is a pure function of t. Beats come from public/tl/<REEL>.json (built from the voiceover alignment).
// Motion: per-element spring entrances (staggered, blur-in), headline words revealed on the voice, slow camera push,
// rolling numbers, line-chart draw-on, typing-dot pulse, device float, remocn transitions between beats.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, continueRender, delayRender, staticFile } from "remotion";
import { zoomBlur } from "../remocn/zoom-blur";
import { whipPan } from "../remocn/whip-pan";
import { pushThrough } from "../remocn/push-through";
import { focusPull } from "../remocn/focus-pull";

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const spring = (x, k = 170, d = 19) => { if (x <= 0) return 0; const w0 = Math.sqrt(k), z = d / (2 * w0); const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + (z * w0 / wd) * Math.sin(wd * x)); };
const eo = p => 1 - Math.pow(1 - clamp(p), 3);

const TRANS = {
  push: L => ({ p: pushThrough({ zoom: 1.9, blur: 14 }), L }),
  zoom: L => ({ p: zoomBlur({ blur: 20 }), L }),
  whipL: L => ({ p: whipPan({ direction: "left", blur: 26 }), L }),
  whipU: L => ({ p: whipPan({ direction: "up", blur: 26 }), L }),
  focus: L => ({ p: focusPull({ blur: 18 }), L }),
  cut: () => ({ p: null, L: 0 }),
};

// load the storyboard kit + reel file once, in page scope, and collect its frames
const loadScript = src => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("script " + src)); document.head.appendChild(s); });
let KIT = null;
const loadKit = async (reel) => {
  if (KIT) return KIT;
  const css = document.createElement("link"); css.rel = "stylesheet"; css.href = staticFile("sbkit/ui.css"); document.head.appendChild(css);
  window.IMGROOT = staticFile("img/");
  const pre = document.createElement("script"); pre.text = `var IMGROOT=${JSON.stringify(staticFile("img/"))};`; document.head.appendChild(pre);
  for (const f of ["logo.js", "kit.js", "screens.js", "screens2.js", "prelude.js", `w42/${reel}.js`, "post.js"]) await loadScript(staticFile("sbkit/" + f));
  const font = new FontFace("Inter", `url(${staticFile("fonts/inter-latin-opsz-normal.woff2")}) format("woff2-variations")`, { weight: "100 900" });
  document.fonts.add(await font.load());
  const tl = await fetch(staticFile(`tl/${reel}.json`)).then(r => r.json());
  const frames = Object.fromEntries(window.__F.map(f => [f.id, f]));
  // preload every image used
  const srcs = new Set(); for (const f of window.__F) for (const m of f.html.matchAll(/src="([^"]+)"/g)) srcs.add(m[1]);
  await Promise.all([...srcs].map(src => new Promise(r => { const i = new Image(); i.onload = () => i.decode().then(r, r); i.onerror = r; i.src = src; })));
  KIT = { frames, tl }; return KIT;
};

const EMO = h => h.replace(/\u{1F525}/gu, `<img src="${staticFile("emoji/1f525.png")}" style="height:1.15em;width:1.15em;vertical-align:-.2em;display:inline-block">`)
  .replace(/\u{1F440}/gu, `<img src="${staticFile("emoji/1f440.png")}" style="height:1.15em;width:1.15em;vertical-align:-.2em;display:inline-block">`);

// ---------- one beat ----------
const Beat = ({ html, lt, dur, words, prevNums, kind, heroText }) => {
  const ref = useRef(null);
  const info = useRef(null);
  // build DOM once per beat
  useLayoutEffect(() => {
    const host = ref.current; host.innerHTML = EMO(html);
    const frame = host.querySelector(".frame"); frame.style.margin = "0";
    const tc = frame.querySelector(".tc"); if (tc) tc.remove();
    const bg = frame.querySelector(".bg");
    const stage = document.createElement("div"); stage.style.cssText = "position:absolute;inset:0;transform-origin:50% 42%";
    const kids = [...frame.children].filter(c => c !== bg);
    const items = [];
    kids.forEach(k => {
      const w = document.createElement("div"); w.style.cssText = "position:absolute;inset:0;pointer-events:none"; w.style.zIndex = getComputedStyle(k).zIndex === "auto" ? "" : getComputedStyle(k).zIndex;
      stage.appendChild(w); w.appendChild(k);
      const isH = k.classList.contains("h") || k.classList.contains("sub");
      items.push({ w, k, isH });
    });
    frame.appendChild(stage);
    // measure centers for transform origins
    items.forEach(it => { const r = it.k.getBoundingClientRect(), fr = frame.getBoundingClientRect(); it.cx = r.left - fr.left + r.width / 2; it.cy = r.top - fr.top + r.height / 2; it.w.style.transformOrigin = `${it.cx}px ${it.cy}px`; it.area = r.width * r.height; it.img = !!it.k.querySelector('img') && !it.k.querySelector('.device') && !it.k.classList.contains('device'); });
    // headline words
    let wi = 0;
    items.filter(i => i.isH).forEach(it => {
      const walk = n => { if (n.nodeType === 3) { const parts = n.textContent.split(/(\s+)/); const frag = document.createDocumentFragment(); parts.forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p)); else { const s = document.createElement("span"); s.textContent = p; s.style.display = "inline-block"; s.dataset.w = String(wi++); frag.appendChild(s); } }); n.replaceWith(frag); } else if (n.nodeType === 1 && !n.classList.contains("caret")) [...n.childNodes].forEach(walk); };
      walk(it.k);
    });
    // rolling numbers inside chips and big numbers
    const nums = [];
    frame.querySelectorAll(".glass, .abs").forEach(el => {
      [...el.childNodes].forEach(function walk(n) { if (n.nodeType === 3 && /\$?\d[\d,]{2,}/.test(n.textContent)) nums.push({ n, txt: n.textContent }); else if (n.nodeType === 1 && n.tagName !== "svg") [...n.childNodes].forEach(walk); });
    });
    // svg line paths to draw on
    const paths = [...frame.querySelectorAll("svg path")].filter(p => p.getAttribute("fill") === "none" && +(p.getAttribute("stroke-width") || 0) >= 4 && !p.getAttribute("stroke-dasharray")).map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; return { p, L }; });
    // typing dots: element with exactly three <i> children
    const dots = [...frame.querySelectorAll("div")].filter(d => d.children.length === 3 && [...d.children].every(c => c.tagName === "I"));
    const devices = [...frame.querySelectorAll(".device")];
    const words = [...frame.querySelectorAll("[data-w]")];
    info.current = { stage, items, nums, paths, dots, devices, words };
  }, [html]);

  // animate per frame
  useLayoutEffect(() => {
    const I = info.current; if (!I) return;
    const nH = I.words.length;
    // camera: slow push across the beat
    const cam = 1 + 0.035 * eo(lt / Math.max(dur, 0.5));
    I.stage.style.transform = `scale(${cam})`;
    // entrances
    let k = 0;
    I.items.forEach(it => {
      if (it.isH) return;
      const d = 0.06 + Math.min(k++, 6) * 0.075;
      const p = spring(lt - d, 150, 18);
      const blur = (1 - clamp(p)) * 14;
      const big = it.area > 500000;
      it.w.style.opacity = String(clamp(p * 1.4));
      // after arriving, each element keeps a gentle, depth-staggered drift so nothing sits dead still
      const fl = Math.sin(lt * 1.15 + k * 1.7) * (big ? 4 : 7), rot = it.img ? Math.sin(lt * 0.9 + k) * 0.6 : 0;
      const par = 1 + (k % 3) * 0.006 * clamp(lt / Math.max(dur, 0.5));
      it.w.style.transform = (big ? `translateY(${(1 - p) * 70 + fl}px) scale(${(0.94 + 0.06 * p) * par})` : `translateY(${(1 - p) * 46 + fl}px) scale(${(0.9 + 0.1 * p) * par})`) + (rot ? ` rotate(${rot}deg)` : "");
      it.w.style.filter = blur > 0.3 ? `blur(${blur}px)` : "";
    });
    // headline words: soft blur-in, paced like speech (or on given word times)
    I.words.forEach((s, j) => {
      const at = words && words[j] != null ? words[j] : 0.02 + j * 0.12;
      const p = eo((lt - at) / 0.28);
      s.style.opacity = String(p); s.style.transform = `translateY(${(1 - p) * 22}px)`; s.style.filter = p < 0.98 ? `blur(${(1 - p) * 10}px)` : "";
    });
    // rolling numbers from previous beat values
    I.nums.forEach((o, i) => {
      const m = o.txt.match(/(\$?)(\d[\d,]*)/); if (!m) return;
      const to = +m[2].replace(/,/g, ""); const from = prevNums && prevNums[i] != null ? prevNums[i] : to;
      const p = eo((lt - 0.12) / 0.7); const v = Math.round(from + (to - from) * p);
      const fmt = m[2].includes(",") || v >= 10000 ? v.toLocaleString("en-US") : String(v);
      o.n.textContent = o.txt.replace(m[0], m[1] + fmt);
    });
    I.paths.forEach(({ p, L }) => { p.style.strokeDashoffset = String(L * (1 - eo((lt - 0.25) / 1.1))); });
    I.dots.forEach(d => [...d.children].forEach((c, j) => { c.style.opacity = String(0.35 + 0.6 * Math.max(0, Math.sin(lt * 7 - j * 0.9))); }));
    I.devices.forEach((d, j) => { d.style.translate = `0 ${Math.sin(lt * 1.3 + j) * 5}px`; });
  });
  return <AbsoluteFill><div ref={ref} style={{ width: 1080, height: 1920 }} /></AbsoluteFill>;
};

// numbers in a beat (to roll the next beat from)
const numsOf = html => [...html.replace(/<[^>]+>/g, " ").matchAll(/\$?(\d[\d,]{2,})/g)].map(m => +m[1].replace(/,/g, ""));

const Wrap = ({ tr, prog, dir, children }) => {
  if (!tr || !tr.p) return <AbsoluteFill>{children}</AbsoluteFill>;
  const C = tr.p.component;
  return <C presentationProgress={prog} presentationDirection={dir} passedProps={tr.p.props}>{children}</C>;
};

// kinetic hook opener for hooks that have no storyboard frames: the hook line, word by word on the voice, over the reel's hero image
const hookHtml = (line, hero) => `<div class="frame"><div class="bg studio"></div>
  ${hero ? `<div class="abs" style="left:90px;right:90px;top:980px;height:640px;display:grid;place-items:center;z-index:2"><img src="${hero}" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 40px 50px rgba(0,0,0,.18))"></div>` : ""}
  <div class="h" style="top:330px;font-size:104px">${line}</div></div>`;

export const Story = ({ reel, part }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const [kit, setKit] = useState(KIT);
  const [h] = useState(() => (KIT ? null : delayRender("kit " + reel)));
  useEffect(() => { if (!KIT) loadKit(reel).then(k => { setKit(k); continueRender(h); }).catch(e => { console.error(e); }); }, []);
  if (!kit) return <AbsoluteFill style={{ background: "#fff" }} />;
  const P = kit.tl.parts[part];
  const beats = P.beats;
  const layers = [];
  beats.forEach((b, i) => {
    const tin = i > 0 ? TRANS[beats[i - 1].out || "zoom"](beats[i - 1].L ?? 0.36) : null;
    const tout = i < beats.length - 1 ? TRANS[b.out || "zoom"](b.L ?? 0.36) : null;
    const Lin = tin ? tin.L : 0, Lout = tout ? tout.L : 0;
    const from = b.a - Lin / 2, to = b.b + Lout / 2;
    if (t < from || t >= to) return;
    const html = b.hook ? hookHtml(b.hook, b.hero ? staticFile(b.hero) : null) : kit.frames[b.fid].html;
    const prevHtml = i > 0 ? (beats[i - 1].hook ? "" : kit.frames[beats[i - 1].fid]?.html || "") : (P.prevFid ? kit.frames[P.prevFid]?.html || "" : "");
    let node = <Beat key={b.fid || "hook" + i} html={html} lt={t - b.a} dur={b.b - b.a} words={b.words} prevNums={numsOf(prevHtml)} />;
    if (tin && tin.L && t < b.a + Lin / 2) node = <Wrap tr={tin} prog={clamp((t - from) / Lin)} dir="entering">{node}</Wrap>;
    else if (tout && tout.L && t > b.b - Lout / 2) node = <Wrap tr={tout} prog={clamp((t - (b.b - Lout / 2)) / Lout)} dir="exiting">{node}</Wrap>;
    layers.push({ i, node });
  });
  return <AbsoluteFill style={{ background: "#fff", fontFamily: "Inter, sans-serif" }}>{layers.map(({ i, node }) => <AbsoluteFill key={i}>{node}</AbsoluteFill>)}</AbsoluteFill>;
};
