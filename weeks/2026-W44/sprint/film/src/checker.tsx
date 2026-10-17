// @ts-nocheck
// Review overlay (stills only, never in masters): text under 40 px, text outside the safe box (x 60-1020, y 230-1600),
// and text overlapping text. Lists the issues in a banner.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";

export const Checker = ({ t }) => {
  const [issues, setIssues] = useState(null);
  const [hd] = useState(() => delayRender("check"));
  useEffect(() => {
    requestAnimationFrame(() => {
      const res = [], boxes = [];
      const op = (el) => { let o = 1; while (el) { o *= +getComputedStyle(el).opacity; el = el.parentElement; } return o; };
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (el.closest("[data-check]")) continue;
        if (op(el) < 0.5) continue;
        const sc = el.getBoundingClientRect().width / (el.offsetWidth || 1);
        const px = parseFloat(getComputedStyle(el).fontSize) * (isFinite(sc) && sc > 0 ? sc : 1);
        const r = document.createRange(); r.selectNodeContents(n);
        for (const b of r.getClientRects()) {
          if (b.width < 2) continue;
          const lab = n.textContent.trim().slice(0, 22);
          if (px < 39.5) res.push({ b, m: `${lab}: ${px.toFixed(0)}px` });
          if (b.left < 60 || b.right > 1020 || b.top < 230 || b.bottom > 1600) res.push({ b, m: `${lab}: outside` });
          const k = b.height * 0.2;
          boxes.push({ b: { left: b.left, right: b.right, top: b.top + k, bottom: b.bottom - k }, el, lab });
        }
      }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const A = boxes[i], B = boxes[j]; if (A.el === B.el) continue;
        const ix = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left), iy = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
        if (ix > 3 && iy > 6) res.push({ b: A.b, m: `overlap: ${A.lab} / ${B.lab}` });
      }
      setIssues(res.map(({ b, m }) => ({ x: b.left, y: b.top, w: b.width, h: b.height, m })));
      requestAnimationFrame(() => continueRender(hd));
    });
  }, []);
  if (!issues) return null;
  return (
    <AbsoluteFill data-check="1" style={{ pointerEvents: "none" }}>
      {issues.map((i, k) => <div key={k} style={{ position: "absolute", left: i.x, top: i.y, width: i.w, height: i.h, outline: "3px solid #f00" }} />)}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1080, background: issues.length ? "#c00" : "#070", color: "#fff", font: "24px monospace", padding: 8, whiteSpace: "pre-wrap" }}>
        {`t=${t.toFixed(2)} issues=${issues.length}\n` + [...new Set(issues.map((i) => i.m))].slice(0, 8).join("\n")}
      </div>
    </AbsoluteFill>
  );
};
