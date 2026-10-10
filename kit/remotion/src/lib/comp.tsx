// @ts-nocheck
import React from "react";
import { clamp, lin, easeOutCubic, caretOn } from "./anim";

export const Html = ({ html, style, className }) => <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
export const Abs = ({ children, style }) => <div style={{ position: "absolute", ...style }}>{children}</div>;

// soft blur-in per word (enter) + optional blur-out-up exit
export const wordStyle = (t, t0, te = 1e9, dur = 0.34) => {
  const p = easeOutCubic(lin(t, t0, t0 + dur));
  const q = lin(t, te, te + 0.26);
  return {
    display: "inline-block",
    opacity: p * (1 - q),
    filter: `blur(${(1 - p) * 12 + q * 10}px)`,
    transform: `translateY(${(1 - p) * 0.22 - q * 0.28}em)`,
    whiteSpace: "pre",
  };
};

// lines: array of arrays of {s, t, c?, html?}
export const Head = ({ t, lines, top, size = 112, exit = 1e9, color = "#1D1D1F", left = 60, right = 60, align = "center", lh = 1.03 }) => (
  <div style={{ position: "absolute", left, right, top, textAlign: align, fontWeight: 600, fontSize: size, lineHeight: lh, letterSpacing: "-.038em", color, fontVariationSettings: "'opsz' 32" }}>
    {lines.map((ln, i) => (
      <div key={i} style={{ whiteSpace: "nowrap" }}>
        {ln.map((w, j) => (
          <span key={j} style={{ ...wordStyle(t, w.t, exit), color: w.c === "g" ? "#86868B" : w.c === "r" ? "#F43034" : w.c === "d" ? "#3A3A3C" : undefined }}>
            {w.html ? <span dangerouslySetInnerHTML={{ __html: w.html }} /> : w.s}
          </span>
        ))}
      </div>
    ))}
  </div>
);

export const Caret = ({ t, on = true, h = ".84em" }) => (
  <span style={{ display: "inline-block", width: ".062em", height: h, background: "#F43034", verticalAlign: "-.06em", marginLeft: ".05em", borderRadius: 3, opacity: on ? 1 : 0 }} />
);

// typewriter headline: lines [{text, c}], chars typed between t0..t1 (continuous across lines)
export const TypeHead = ({ t, lines, t0, t1, top, size = 112, exit = 1e9, caretUntil = 1e9, align = "center", left = 60, right = 60, color = "#1D1D1F", lead = 0 }) => {
  const total = lines.reduce((a, l) => a + l.text.length, 0);
  let n = Math.round(clamp((t - t0) / (t1 - t0)) * total) + lead;
  n = Math.min(total, n);
  const typing = t >= t0 && t < t1;
  const q = lin(t, exit, exit + 0.26);
  let left_n = n;
  const caretVisible = t < caretUntil && (typing || caretOn(t));
  const lastLine = (() => { let acc = 0; for (let i = 0; i < lines.length; i++) { acc += lines[i].text.length; if (n <= acc) return i; } return lines.length - 1; })();
  return (
    <div style={{ position: "absolute", left, right, top, textAlign: align, fontWeight: 600, fontSize: size, lineHeight: 1.03, letterSpacing: "-.038em", color, fontVariationSettings: "'opsz' 32",
      opacity: 1 - q, filter: `blur(${q * 10}px)`, transform: `translateY(${-q * 0.28}em)` }}>
      {lines.map((l, i) => {
        const k = Math.max(0, Math.min(l.text.length, left_n)); left_n -= l.text.length;
        return (
          <div key={i} style={{ whiteSpace: "pre", minHeight: "1.03em" }}>
            <span style={{ color: l.c === "g" ? "#86868B" : l.c === "r" ? "#F43034" : undefined }}>{l.text.slice(0, k)}</span>
            {i === lastLine ? <Caret t={t} on={caretVisible} /> : null}
          </div>
        );
      })}
    </div>
  );
};
