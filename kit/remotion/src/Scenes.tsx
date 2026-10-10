// @ts-nocheck
import React from "react";
import { staticFile } from "remotion";
import { W, ws, we } from "./cues";
import { clamp, lin, mix, spring, SOFT, SNAPPY, BOUNCY, GENTLE, easeOutCubic, easeInCubic, easeInOut, easeOutQuint, typed, caretOn, rnd } from "./lib/anim";
import { Html, Abs, Head, TypeHead, Caret, wordStyle } from "./lib/comp";
import * as U from "./lib/ui";

const BG = { studio: "radial-gradient(120% 70% at 50% 42%,#FFFFFF 40%,#F5F5F7 100%)", gray: "#F5F5F7", white: "#FFFFFF", black: "#000" };
const Stage = ({ bg = "studio", children, push = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: BG[bg], overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + push})` }}>{children}</div>
  </div>
);
const Device = ({ html, x, y, w, style = {}, dark = false }) => (
  <Html html={U.device(html, { w, dark })} style={{ position: "absolute", left: x, top: y, width: w, ...style }} />
);
const tok = (s, t, c) => ({ s, t, c });
const touchDot = (x, y, p) => p > 0 && p < 1 ? `<div style="position:absolute;left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:rgba(0,0,0,${0.18 * (1 - p)});transform:scale(${0.6 + 0.8 * p});z-index:60"></div>` : "";

// ---------------- S1 hook ----------------
export const S1 = ({ t, a, b }) => {
  const dev = spring(t + 0.18, 0, SOFT);
  const arr = [0.22, 0.82, 1.42, 2.12, 2.72].map((t0) => spring(t, t0, SNAPPY));
  const swap = ws(5) - 0.04;
  return (
    <Stage push={0.03 * lin(t, 0, b)}>
      {t < swap + 0.3 && <TypeHead t={t} top={300} lines={[{ text: "If you sell" }, { text: "car parts," }]} t0={-0.06} t1={we(4)} exit={swap} lead={2} />}
      {t >= swap && <TypeHead t={t} top={300} lines={[{ text: "Your best ad" }, { text: "isn’t an ad.", c: "g" }]} t0={swap + 0.04} t1={we(10) - 0.05} />}
      <Device html={U.scrLock(arr, easeOutCubic(lin(t, 3.0, 3.3)))} x={240} y={760 + (1 - dev) * 360} w={600} style={{ transform: `rotateX(${(1 - dev) * 18}deg)`, transformOrigin: "50% 0" }} />
    </Stage>
  );
};

// ---------------- S2 it's a build ----------------
export const S2 = ({ t, a, b }) => {
  const hero = spring(t, a + 0.02, SOFT);
  const chip = spring(t, ws(12) + 0.02, BOUNCY);
  const tileX = 60, tileY = 720, TW = 960, TH = 600;
  const P = (fx, fy) => [98.4 + 883.2 * fx, 937.8 + 279 * fy];
  const calls = [
    { p: P(0.22, 0.36), lx: 300, ly: 600, label: "Turbo kit", yours: 1 },
    { p: P(0.975, 0.8), lx: 880, ly: 600, label: "Exhaust" },
    { p: P(0.186, 0.73), lx: 270, ly: 1400, label: "18-inch wheels", yours: 1 },
    { p: P(0.775, 0.55), lx: 790, ly: 1400, label: "Coilovers" },
  ];
  const chipHtml = `<span class="inl" style="display:inline-block;vertical-align:-.1em;border-radius:.2em;overflow:hidden;box-shadow:0 0 0 2px #fff,0 6px 18px -6px rgba(0,0,0,.25);margin:0 .04em;transform:scale(${chip});width:1.36em;height:.86em">${U.tile("car-01", 152, 96, { r: 0, fit: 0.95, floor: 0.14 })}</span>`;
  return (
    <Stage push={0.02 * lin(t, a, b)}>
      <Head t={t} top={330} lines={[[tok("It’s ", ws(11)), tok("a ", ws(12)), { html: chipHtml, t: ws(12) + 0.02 }, tok(" build.", ws(13))]]} />
      <div style={{ position: "absolute", left: tileX, top: tileY, width: TW, height: TH, borderRadius: 44, overflow: "hidden", boxShadow: "0 60px 120px -40px rgba(0,0,0,.28)",
        transform: `translateY(${(1 - hero) * 120}px) scale(${0.92 + 0.08 * hero})`, opacity: Math.min(1, hero * 1.5) }}>
        <Html html={U.tile("car-02", TW, TH, { r: 0, fit: 0.92, floor: 0.17 })} />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible", zIndex: 3 }}>
        {calls.map((c, i) => {
          const p = easeOutCubic(lin(t, a + 0.3 + i * 0.09, a + 0.55 + i * 0.09));
          const [px, py] = c.p; const ey = c.ly < 1000 ? c.ly + 68 : c.ly;
          return <g key={i} opacity={p > 0 ? 1 : 0}>
            <line x1={px} y1={py} x2={mix(px, c.lx, p)} y2={mix(py, ey, p)} stroke="#1D1D1F" strokeWidth={2.5} />
            <circle cx={px} cy={py} r={10 * Math.min(1, p * 2)} fill="#fff" stroke="#1D1D1F" strokeWidth={3.5} />
          </g>;
        })}
      </svg>
      {calls.map((c, i) => {
        const s = spring(t, a + 0.48 + i * 0.09, BOUNCY);
        return <div key={i} className="glass" style={{ position: "absolute", zIndex: 4, left: c.lx, top: c.ly, transform: `translateX(-50%) scale(${s})`, display: "flex", alignItems: "center", gap: 10, height: 68, padding: "0 26px", borderRadius: 34, fontSize: 30, fontWeight: 600, letterSpacing: "-.015em", whiteSpace: "nowrap", background: "#fff", opacity: s > 0.01 ? 1 : 0 }}
          dangerouslySetInnerHTML={{ __html: (c.yours ? U.seal(28) : "") + c.label }} />;
      })}
    </Stage>
  );
};

// ---------------- S3 word swap carousel ----------------
let _ms = null; const _mc = {};
const measure = (txt, size, weight = 600) => {
    if (typeof document === "undefined") return txt.length * size * 0.5;
  if (!_ms) { _ms = document.createElement("span"); _ms.style.cssText = "position:absolute;left:-9999px;top:0;white-space:pre;font-family:Inter;letter-spacing:-.038em;font-variation-settings:'opsz' 32"; document.body.appendChild(_ms); }
  _ms.style.fontSize = size + "px"; _ms.style.fontWeight = weight; _ms.textContent = txt;
  return _ms.getBoundingClientRect().width;
};
const Roll = ({ t, at, a, b, c, size = 104, tail = "" }) => {
  const p = easeOutQuint(lin(t, at, at + 0.4));
  const w = mix(measure(a + tail, size), measure(b + tail, size), p);
  return (
    <span style={{ display: "inline-block", position: "relative", width: w, height: "1.04em", lineHeight: 1.04, verticalAlign: "-0.14em", overflow: "hidden", color: c === "r" ? "#F43034" : undefined }}>
      <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-p * 100}%)`, opacity: 1 - p, filter: `blur(${p * 6}px)`, whiteSpace: "pre" }}>{a}<span style={{ color: "#1D1D1F" }}>{tail}</span></span>
      <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - p) * 100}%)`, opacity: p, filter: `blur(${(1 - p) * 6}px)`, whiteSpace: "pre" }}>{b}<span style={{ color: "#1D1D1F" }}>{tail}</span></span>
    </span>
  );
};
export const S3 = ({ t, a, b }) => {
  const sw = ws(20) - 0.08;
  const o = spring(t, sw, { stiffness: 140, damping: 19 });
  const cards = [["car-09", "Brake kit", "part-06"], ["car-01", "Turbo kit", "part-01", "s14.jay"], ["car-04", "Coilovers", "part-02", "boostedbri"], ["car-10", "Intake", "part-04"]];
  const enter = spring(t, a, SOFT);
  const wordW = mix(1, 1, 0);
  return (
    <Stage push={0.02 * lin(t, a, b)}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 300, textAlign: "center", fontWeight: 600, fontSize: 104, lineHeight: 1.04, letterSpacing: "-.038em", color: "#1D1D1F", fontVariationSettings: "'opsz' 32" }}>
        <div style={{ whiteSpace: "nowrap" }}>
          <span style={wordStyle(t, ws(14))}>Your </span>
          <span style={wordStyle(t, ws(15))}><Roll t={t} at={sw} a="turbo" b="coilovers" c="r" tail="," /></span>
        </div>
        <div style={{ whiteSpace: "nowrap", color: "#86868B" }}>
          <span style={wordStyle(t, ws(16))}>in </span><span style={wordStyle(t, ws(17))}>someone’s </span>
          <span style={wordStyle(t, ws(18))}><Roll t={t} at={ws(23) - 0.06} a="Supra." b="WRX." /></span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 1000, perspective: 2200 }}>
        {cards.map(([car, part, pimg, who], k) => {
          const d = k - 1 - o;
          const ad = Math.abs(d);
          const x = 540 + d * 600 - 320, sc = 1 - 0.16 * Math.min(1, ad), ry = Math.max(-40, Math.min(40, -d * 40));
          const isC = ad < 0.5;
          const barP = who ? easeOutCubic(lin(t, k === 1 ? ws(15) : sw + 0.25, (k === 1 ? ws(15) : sw + 0.25) + 0.35)) * (1 - easeOutCubic(clamp(ad * 2))) : 0;
          const sealS = who ? spring(t, (k === 1 ? ws(15) : sw + 0.3) + 0.12, BOUNCY) : 0;
          return (
            <div key={k} style={{ position: "absolute", left: x, top: 40 + (1 - enter) * 140, width: 640, height: 800, borderRadius: 48, overflow: "hidden",
              transform: `rotateY(${ry}deg) scale(${sc})`, opacity: (1 - 0.55 * Math.min(1, ad)) * Math.min(1, enter * 1.4), zIndex: 10 - Math.round(ad * 2),
              boxShadow: `0 60px 110px -40px rgba(0,0,0,${0.32 * (1 - Math.min(1, ad))})`, filter: `saturate(${1 - 0.4 * Math.min(1, ad)})` }}>
              <Html html={U.tile(car, 640, 800, { r: 0, fit: 1.0, floor: 0.38 })} />
              {who && <div className="glass" style={{ position: "absolute", left: 22, right: 22, bottom: 22, borderRadius: 32, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16,
                opacity: barP, transform: `translateY(${(1 - barP) * 30}px)` }}>
                <Html html={U.tile(pimg, 76, 76, { r: 18, fit: 0.86 })} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 31, fontWeight: 600, letterSpacing: "-.015em" }}>{part}</div>
                  <div style={{ fontSize: 24, color: "rgba(60,60,67,.6)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span style={{ display: "inline-block", transform: `scale(${sealS})` }} dangerouslySetInnerHTML={{ __html: U.seal(22) }} />
                    <span style={{ color: "#F43034", fontWeight: 600 }}>Your Brand</span> · {who}</div>
                </div>
              </div>}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ---------------- S4 thousands ----------------
const GRIDCARS = ["car-01", "car-04", "car-05", "car-06", "car-07", "car-08", "car-09", "car-10", "car-11", "car-12", "car-13", "car-14", "car-15", "car-16", "car-17", "car-18", "car-19", "car-02"];
export const S4 = ({ t, a, b }) => {
  const pull = easeOutCubic(lin(t, a, a + 1.0));
  const glide = (t - a) * 46;
  const tiles = [];
  for (let r = 0; r < 13; r++) for (let c = 0; c < 9; c++) {
    const i = r * 9 + c; const on = rnd(i * 3.1 + 7) < 0.34;
    const sp = on ? spring(t, ws(27) - 0.05 + (c * 0.035 + r * 0.05), BOUNCY) : 0;
    tiles.push(
      <div key={i} style={{ position: "relative", width: 150, height: 112 }}>
        <Html html={U.tile(GRIDCARS[(i * 7 + r) % GRIDCARS.length], 150, 112, { r: 14, fit: 0.92, floor: 0.12 })} />
        {on && <div style={{ position: "absolute", right: 7, top: 7, transform: `scale(${sp})` }} dangerouslySetInnerHTML={{ __html: U.seal(26) }} />}
      </div>
    );
  }
  return (
    <Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, bottom: 0, perspective: 1600, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -150, top: -60, display: "grid", gridTemplateColumns: "repeat(9,150px)", gap: 16,
          transform: `rotateX(42deg) rotateZ(-12deg) translate(${-glide * 0.6}px, ${-glide}px) scale(${mix(1.9, 1, pull)})`, transformOrigin: "50% 20%" }}>{tiles}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 200, background: "linear-gradient(#fff,#fff0)", zIndex: 4 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440, background: "linear-gradient(#ffffff00,#fff 80%)", zIndex: 5 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 600, background: "#fff", zIndex: 3 }} />
      <div style={{ position: "relative", zIndex: 6 }}>
        <Head t={t} top={300} size={108} lines={[[tok("Thousands ", ws(24)), tok("of ", ws(25)), tok("builds", ws(26))], [tok("running ", ws(27), "g"), tok("your ", ws(28), "g"), tok("parts.", ws(29), "g")]]} />
      </div>
    </Stage>
  );
};

// ---------------- S5 leaks ----------------
const rise = (t, a) => spring(t, a, SOFT);
export const S5a = ({ t, a, b }) => {
  const r = rise(t, a);
  const hl = easeOutCubic(lin(t, ws(32) - 0.1, ws(32) + 0.15));
  const flick = easeInCubic(lin(t, b - 0.42, b));
  const drift = lin(t, a, b - 0.42) * 30;
  return (
    <Stage>
      <Head t={t} top={300} lines={[[tok("Lost ", ws(30)), tok("in ", ws(31)), tok("comments,", ws(32))]]} />
      <Device html={U.scrComments(drift + flick * 520, hl * (1 - flick))} x={240} y={560 + (1 - r) * 280} w={600} />
    </Stage>
  );
};
export const S5b = ({ t, a, b }) => {
  const r = rise(t, a - 0.1);
  const prog = mix(0.55, 1, easeInOut(lin(t, a, ws(35) + 0.05)));
  const exp = spring(t, ws(35) + 0.12, SOFT);
  return (
    <Stage>
      <Head t={t} top={300} lines={[[tok("stories ", ws(33)), tok("that ", ws(34)), tok("expire,", ws(35))]]} />
      <Device html={U.scrStory(prog, Math.min(1, exp))} x={240} y={560 + (1 - r) * 200} w={600} dark />
    </Stage>
  );
};
export const S5c = ({ t, a, b, dis0, dis1 }) => {
  const r = rise(t, a - 0.1);
  // dissolve sweep from right edge to left
  const sw = easeInOut(lin(t, dis0, dis1)); // 0..1
  const edge = mix(1180, -160, sw);
  const mask = `linear-gradient(90deg,#000 ${edge - 140}px,transparent ${edge + 40}px)`;
  const parts = [];
  for (let i = 0; i < 340; i++) {
    const hx = 40 + rnd(i + 1) * 1000, hy = 260 + rnd(i * 2.3 + 5) * 1300;
    const born = mix(dis0, dis1, clamp((1180 - hx) / 1340)) - 0.05;
    const age = t - born; if (age < 0 || age > 0.9) continue;
    const vx = 120 + rnd(i * 4.7) * 260, vy = -40 - rnd(i * 9.1) * 120, z = 4 + rnd(i * 1.7) * 10;
    parts.push(<i key={i} style={{ position: "absolute", left: hx + vx * age, top: hy + vy * age + 60 * age * age, width: z, height: z, borderRadius: 2,
      background: rnd(i * 3.3) < 0.5 ? "#C7C7CC" : "#8E8E93", opacity: (1 - age / 0.9) * 0.9 }} />);
  }
  return (
    <Stage bg="white">
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: t > dis0 ? mask : undefined }}>
        <Head t={t} top={280} lines={[[tok("and ", ws(36)), tok("threads ", ws(37)), tok("nobody", ws(38))], [tok("finds ", ws(39)), tok("again.", ws(40))]]} />
        <Device html={U.scrThread()} x={240} y={600 + (1 - r) * 200} w={600} />
      </div>
      {parts}
    </Stage>
  );
};

// ---------------- S6 reveal ----------------
export const S6 = ({ t, a, b }) => {
  const lg = ws(44) - 0.04;
  const m = spring(t, lg + 0.02, BOUNCY);
  const wipe = easeOutCubic(lin(t, lg + 0.14, lg + 0.57));
  const settle = spring(t, lg, GENTLE);
  return (
    <Stage bg="white">
      {t < lg && <TypeHead t={t} top={850} lines={[{ text: "So we built" }]} t0={ws(41) - 0.03} t1={we(43) - 0.12} exit={lg - 0.08} />}
      {t >= lg && (
        <div style={{ position: "absolute", left: 540, top: 870, transform: `translate(-50%,-50%) scale(${0.94 + 0.06 * settle})` }}>
          <div style={{ position: "relative", width: 700 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 124, transformOrigin: "50% 55%", transform: `scale(${Math.max(0, m)}) rotate(${(1 - m) * -20}deg)` }} dangerouslySetInnerHTML={{ __html: U.mark(124) }} />
            <div style={{ opacity: wipe > 0 ? 1 : 0 }} dangerouslySetInnerHTML={{ __html: U.logo(700, "#1D1D1F", wipe).replace('fill="#F43034"', 'fill="transparent"') }} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", fontSize: 40, fontWeight: 500, letterSpacing: "-.02em", color: "#6E6E73", ...wordStyle(t, lg + 0.55, 1e9, 0.5) }}>The permanent record for every build.</div>
    </Stage>
  );
};

// ---------------- S7 builders log ----------------
export const S7 = ({ t, a, b }) => {
  const r = spring(t, a, SOFT);
  const sh = spring(t, 19.72, { stiffness: 150, damping: 21 });
  const close = spring(t, 22.86, { stiffness: 160, damping: 22 });
  const partTxt = typed("Exhaust", t, 19.95, 20.32);
  const brandTxt = t >= ws(53) ? "Your Brand" : typed("Your Bra", t, 20.45, 20.92);
  const focus = t < 20.4 ? "part" : "brand";
  const sugg = spring(t, 20.78, SNAPPY) * (1 - easeOutCubic(lin(t, ws(53) + 0.05, ws(53) + 0.3)));
  const st = { y: Math.max(0, sh - close), part: partTxt, brand: brandTxt, caret: t < ws(53) && (t < 20.95 || caretOn(t)), focus: t < ws(53) ? focus : "",
    sugg, hl: t > 21.12, picked: t >= ws(53), date: lin(t, ws(54), ws(54) + 0.45), photos: [0, 1, 2].map(k => spring(t, ws(55) + k * 0.11, BOUNCY)), confirm: lin(t, 22.66, 22.86) };
  let html = U.scrBuild(st.y > 0.002 ? U.sheetAddPart(st) : "", t > 22.9 ? { newRow: `background:rgba(244,48,52,${0.1 * (1 - lin(t, 23.0, 23.6))})`, count: 38 } : {});
  html = html.replace(/<\/div>$/, touchDot(200, 545, lin(t, 21.1, 21.45)) + touchDot(370, 70 + 314, lin(t, 22.66, 22.98)) + "</div>");
  return (
    <Stage bg="gray" push={0.02 * lin(t, a, b)}>
      <Head t={t} top={260} lines={[[tok("Builders ", ws(47)), tok("log", ws(48))], [tok("every ", ws(49), "g"), tok("part.", ws(50), "g")]]} />
      <Device html={html} x={240} y={600 + (1 - r) * 260} w={600} style={{ transform: `perspective(2400px) rotateX(${(1 - r) * 16}deg)`, transformOrigin: "50% 0" }} />
    </Stage>
  );
};

// ---------------- S8 links to your page ----------------
const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
export const S8 = ({ t, a, b }) => {
  const L = [[690, "car-04", "’04 WRX STI"], [1010, "car-06", "’18 Tacoma"], [1330, "car-01", "’99 Supra"]];
  const R = [[690, "car-05", "’72 240Z"], [1010, "car-07", "’92 NSX"], [1330, "car-08", "’89 E30"]];
  const target = [540, 1012];
  const dv = spring(t, a + 0.02, SOFT);
  const paths = [...L.map(([y]) => [250, y + 95, -1]), ...R.map(([y]) => [830, y + 95, 1])].map(([sx, sy]) => {
    const mx = (sx + target[0]) / 2; return [[sx, sy], [mx, sy], [mx, target[1]], target];
  });
  const draw = easeInOut(lin(t, 24.25, 25.0));
  const count = Math.round(312 * easeOutCubic(lin(t, 25.2, 26.6)));
  let flash = 0;
  const pulses = [];
  paths.forEach((pp, i) => {
    for (let k = 0; k < 6; k++) {
      const t0 = 24.85 + i * 0.09 + k * 0.62; const u = lin(t, t0, t0 + 0.62);
      if (u <= 0 || u >= 1) { if (t > t0 + 0.62) flash = Math.max(flash, 1 - lin(t, t0 + 0.62, t0 + 0.9)); continue; }
      const [x, y] = bez(...pp, easeInOut(u));
      pulses.push(<g key={i + "-" + k}><circle cx={x} cy={y} r={18} fill="#F43034" fillOpacity={0.15} /><circle cx={x} cy={y} r={8} fill="#F43034" /></g>);
    }
  });
  const card = (x, y, car, n, k, side) => {
    const s = spring(t, a + 0.15 + k * 0.07, { stiffness: 150, damping: 17 });
    return <div key={n} style={{ position: "absolute", left: x + (1 - s) * side * 420, top: y, width: 220, borderRadius: 26, background: "#fff", padding: 8, boxShadow: "0 24px 50px -18px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.04)", zIndex: 3, transform: `rotate(${(1 - s) * side * 8}deg)` }}>
      <Html html={U.tile(car, 204, 136, { r: 19, fit: 0.94, floor: 0.13 })} />
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.01em", padding: "11px 6px 5px", display: "flex", alignItems: "center", gap: 7 }} dangerouslySetInnerHTML={{ __html: U.seal(20) + n }} />
    </div>;
  };
  return (
    <Stage push={0.02 * lin(t, a, b)}>
      <Head t={t} top={260} lines={[[tok("Every ", ws(57)), tok("build ", ws(58)), tok("links", ws(62))], [tok("to ", ws(64), "g"), tok("your ", ws(67), "g"), tok("page.", ws(69), "g")]]} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, zIndex: 1 }}>
        {paths.map((pp, i) => { const d = `M${pp[0][0]},${pp[0][1]} C${pp[1][0]},${pp[1][1]} ${pp[2][0]},${pp[2][1]} ${pp[3][0]},${pp[3][1]}`;
          return <path key={i} d={d} fill="none" stroke="#F43034" strokeOpacity={0.35} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />; })}
      </svg>
      <Device html={U.scrSupplier({ builds: t < 25.2 ? "0" : String(count), flash })} x={315} y={600 + (1 - dv) * 160} w={450} style={{ zIndex: 2, transform: `scale(${0.94 + 0.06 * dv})` }} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, zIndex: 4 }}>{pulses}</svg>
      {L.map(([y, c, n], k) => card(30, y, c, n, k * 2, -1))}
      {R.map(([y, c, n], k) => card(830, y, c, n, k * 2 + 1, 1))}
    </Stage>
  );
};

// ---------------- S9 dark beat ----------------
export const S9 = ({ t, a, b }) => {
  const dv = spring(t, a + 0.15, { stiffness: 90, damping: 18 });
  const word = (s, at) => { const on = lin(t, at - 0.02, at + 0.1); const pop = spring(t, at, BOUNCY);
    return <div style={{ color: `rgb(${mix(58, 245, on)},${mix(58, 245, on)},${mix(60, 247, on)})`, transform: `scale(${1 + 0.03 * Math.sin(Math.PI * clamp(pop)) * (pop < 1 ? 1 : 0)})`, transformOrigin: "0 50%" }}>{s}</div>; };
  return (
    <Stage bg="black">
      <div style={{ position: "absolute", left: 100, top: 280, fontSize: 124, fontWeight: 600, letterSpacing: "-.04em", lineHeight: 1.04, fontVariationSettings: "'opsz' 32", ...wordStyle(t, a - 0.05, 1e9, 0.3) }}>
        {word("Permanent.", ws(70))}{word("Searchable.", ws(71))}{word("Yours.", ws(72))}
      </div>
      <Device html={U.scrSupplier({})} x={240} y={1020 + (1 - dv) * 560} w={600} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(#00000000,#000 85%)", zIndex: 5 }} />
    </Stage>
  );
};

// ---------------- S10 search ----------------
export const S10 = ({ t, a, b }) => {
  const enter = 33.08;
  const q = "who makes that turbo";
  const typedQ = typed(q, t, ws(77) - 0.02, we(80) - 0.12);
  const barIn = spring(t, a + 0.25, { stiffness: 120, damping: 19 });
  const textW = typedQ.length * 57.5;
  const caretX = 150 + 96 + 36 + textW;
  const pan = Math.max(0, caretX - 930);
  const out = easeInCubic(lin(t, enter, enter + 0.24));
  const dIn = easeOutCubic(lin(t, enter + 0.15, enter + 0.52));
  const res = spring(t, enter + 0.25, SOFT);
  const rows = [0, 1, 2, 3].map(k => easeOutCubic(lin(t, enter + 0.35 + k * 0.07, enter + 0.65 + k * 0.07)));
  const hl = easeOutCubic(lin(t, ws(84) - 0.05, ws(84) + 0.2));
  const pop = lin(t, ws(84) - 0.05, ws(84) + 0.35);
  return (
    <Stage bg="gray">
      {/* macro phase */}
      {t < enter + 0.4 && <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.45 * out})`, filter: `blur(${out * 14}px)`, transformOrigin: "50% 55%" }}>
        <Head t={t} top={420} size={84} lines={[[tok("Next ", ws(73), "g"), tok("time ", ws(74), "g"), tok("someone ", ws(75), "g"), tok("asks,", ws(76), "g")]]} />
        <div style={{ position: "absolute", left: -40 - (t - a) * 40, top: 720, display: "flex", gap: 24, filter: "blur(18px)", opacity: 0.85 }}>
          {["car-04", "car-05", "car-12", "car-07", "car-09", "car-10"].map((c, i) => <Html key={i} html={U.tile(c, 320, 560, { r: 40, fit: 1.1, floor: 0.35 })} />)}
        </div>
        <div className="glass" style={{ position: "absolute", left: -60 + (1 - barIn) * 900 - pan, top: 860, width: 1900, height: 260, borderRadius: 130, display: "flex", alignItems: "center", gap: 36, paddingLeft: 150, zIndex: 3 }}>
          <span dangerouslySetInnerHTML={{ __html: U.ic("search", 96, "rgba(60,60,67,.55)", 2.2) }} />
          <span style={{ fontSize: 112, fontWeight: 500, letterSpacing: "-.035em", fontVariationSettings: "'opsz' 32", whiteSpace: "pre" }}>{typedQ}<Caret t={t} on={t < enter && (t > ws(77) - 0.05 && t < we(80) ? true : caretOn(t))} h="1em" /></span>
        </div>
      </div>}
      {/* results phase */}
      {t >= enter + 0.15 && <div style={{ position: "absolute", inset: 0, opacity: dIn, transform: `scale(${1.12 - 0.12 * dIn})`, filter: `blur(${(1 - dIn) * 12}px)`, transformOrigin: "50% 80%" }}>
        <Head t={t} top={260} lines={[[tok("The ", ws(81)), tok("answer", ws(82))], [tok("is ", ws(83)), tok("you.", ws(84), "r")]]} />
        <Device html={U.scrSearch(q, { res: Math.min(1, res), rows, hl, pop })} x={240} y={600} w={600} />
      </div>}
    </Stage>
  );
};

// ---------------- S11 done for you ----------------
export const S11 = ({ t, a, b }) => {
  const r = spring(t, a - 0.05, SOFT);
  const done = [34.72, 35.08, 35.44, 35.8, we(96) - 0.05].map(t0 => spring(t, t0, BOUNCY));
  const zero = 1 + 0.12 * Math.sin(Math.PI * clamp(lin(t, ws(92), ws(92) + 0.4)));
  return (
    <Stage bg="gray" push={0.02 * lin(t, a, b)}>
      <Head t={t} top={260} lines={[[tok("We ", ws(85)), tok("set ", ws(86)), tok("it ", ws(87)), tok("all ", ws(88)), tok("up.", ws(89))], [tok("Zero ", ws(92), "g"), tok("admin.", ws(93), "g")]]} />
      <Device html={U.scrSetup(done.map(d => (d > 0 ? Math.max(0.001, d) : 0)), (t - a) * 420, zero)} x={240} y={600 + (1 - r) * 220} w={600} />
    </Stage>
  );
};

// ---------------- S12 first 100 ----------------
export const S12 = ({ t, a, b }) => {
  const numP = easeOutCubic(lin(t, ws(101) - 0.05, ws(102) + 0.25));
  const n = Math.round(100 * numP);
  const red = spring(t, ws(102) + 0.12, BOUNCY);
  const pill = spring(t, ws(102) + 0.28, SNAPPY);
  const dots = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10; const s = spring(t, a + 0.1 + (r + c) * 0.025, SNAPPY);
    const isRed = i === 0;
    dots.push(<i key={i} style={{ display: "block", width: 54, height: 54, borderRadius: 27, transform: `scale(${isRed ? Math.max(s, 0) * (1 + 0.25 * Math.sin(Math.PI * clamp(red))) : s})`,
      background: isRed ? `rgb(${mix(232, 244, red)},${mix(232, 48, red)},${mix(237, 52, red)})` : "#E8E8ED", boxShadow: isRed && red > 0.5 ? "0 10px 24px -6px rgba(244,48,52,.6)" : "none" }} />);
  }
  return (
    <Stage push={0.02 * lin(t, a, b)}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 300, textAlign: "center", fontWeight: 600, fontSize: 112, lineHeight: 1.03, letterSpacing: "-.038em", color: "#1D1D1F", fontVariationSettings: "'opsz' 32" }}>
        <div><span style={wordStyle(t, ws(97))}>Free </span><span style={wordStyle(t, ws(98))}>for </span><span style={wordStyle(t, ws(99))}>the</span></div>
        <div><span style={wordStyle(t, ws(100))}>first </span><span style={{ ...wordStyle(t, ws(101) - 0.05), color: "#F43034", fontVariantNumeric: "tabular-nums" }}>{n}.</span></div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 760, display: "grid", gridTemplateColumns: "repeat(10,54px)", gap: 28 }}>{dots}</div>
      <div className="glass" style={{ position: "absolute", left: 100, top: 660, height: 64, padding: "0 24px", borderRadius: 32, display: "flex", alignItems: "center", fontSize: 28, fontWeight: 600, background: "#fff", zIndex: 3, transform: `scale(${pill})`, transformOrigin: "30% 100%" }}>This one’s yours</div>
      <Head t={t} top={1610} size={40} lines={[[tok("Parts ", ws(103), "g"), tok("brands ", ws(104), "g"), tok("and ", ws(105), "g"), tok("shops", ws(106), "g")]]} />
    </Stage>
  );
};

// ---------------- S13 CTA ----------------
export const S13 = ({ t, a, b }) => {
  const m = spring(t, a + 0.05, BOUNCY);
  const wipe = easeOutCubic(lin(t, a + 0.15, a + 0.55));
  const btn = spring(t, a + 0.45, SNAPPY);
  const click = lin(t, 42.95, 43.2);
  const press = 1 - 0.05 * Math.sin(Math.PI * click);
  const cur = easeInOut(lin(t, 42.35, 42.95));
  const cx = mix(980, 640, cur), cy = mix(1500, 1080, cur);
  return (
    <Stage>
      <div style={{ position: "absolute", left: 540, top: 760, transform: "translate(-50%,-50%)" }}>
        <div style={{ position: "relative", width: 600 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 106, transformOrigin: "50% 55%", transform: `scale(${Math.max(0, m)}) rotate(${(1 - m) * -20}deg)` }} dangerouslySetInnerHTML={{ __html: U.mark(106) }} />
          <div dangerouslySetInnerHTML={{ __html: U.logo(600, "#1D1D1F", wipe).replace('fill="#F43034"', 'fill="transparent"') }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center", fontSize: 40, fontWeight: 500, letterSpacing: "-.02em", color: "#6E6E73", ...wordStyle(t, a + 0.35, 1e9, 0.45) }}>Supplier pilot. Free for the first 100.</div>
      <div style={{ position: "absolute", left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${btn * press})`, height: 120, padding: "0 60px", borderRadius: 60, background: "#1D1D1F", color: "#fff", display: "flex", alignItems: "center", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", whiteSpace: "nowrap" }}>Claim your page</div>
      {click > 0 && click < 1 && <div style={{ position: "absolute", left: 640 - 60, top: 1080 - 60, width: 120, height: 120, borderRadius: 60, background: `rgba(255,255,255,${0.35 * (1 - click)})`, transform: `scale(${0.4 + click * 1.4})` }} />}
      <TypeHead t={t} top={1160} size={44} lines={[{ text: "fuelmybuild.com" }]} t0={ws(110) - 0.02} t1={we(114) - 0.1} />
      {t > 42.3 && <svg style={{ position: "absolute", left: cx, top: cy, width: 64, height: 64, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.28))", opacity: lin(t, 42.3, 42.45), transform: `scale(${1 - 0.1 * Math.sin(Math.PI * click)})` }} viewBox="0 0 24 24"><path d="M5 2.8v16.4l4.4-4.2 3 6.6 2.8-1.3-3-6.4h6z" fill="#000" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
    </Stage>
  );
};
