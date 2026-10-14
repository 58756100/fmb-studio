// @ts-nocheck
// Every image the three v3 reels use. Paths are relative to kit/remotion/public.
// SIX IMAGES ARE ON ORDER FROM WAYNE (lab/image-requests/2026-W44.md, batch 2). Until they arrive each one
// is null and renders a clearly marked placeholder. To swap one in: save the file to
// kit/remotion/public/img/lab/ and replace `null` with the path on its line below. Nothing else changes.
import React from "react";
import { Img, staticFile } from "remotion";

export const IMG = {
  // in the kit
  evo: "img/car-14.png",              // C3-COL hero, blue Evo VI
  intake: "img/part-04.png",          // C3-COL part
  r34: "img/car-11.png",              // C3-GAR hero, silver R34
  block: "img/obj/engine-block.png",  // C3-GAR found problem (inline-six on a red stand)
  wrx: "img/car-04.png",              // C3-SUP hero, blue WRX STI
  exhaust: "img/part-05.png",         // C3-SUP part, dual-tip exhaust

  // on order (null = placeholder). One line each:
  checkPresenter: null,   // "img/lab/c3-check-presenter.png"     cutout, C3-COL
  evoIntakePhoto: null,   // "img/lab/c3-evo-intake-install.jpg"  photo 4:3, C3-COL log card
  counterBell: null,      // "img/lab/c3-counter-bell.png"        cutout, C3-GAR
  r34WeepPhoto: null,     // "img/lab/c3-r34-head-weep.jpg"       photo 4:3, C3-GAR monitor entry
  hangTag: null,          // "img/lab/c3-hang-tag-manila.png"     cutout, C3-SUP (every tag)
  wrxUndersidePhoto: null, // "img/lab/c3-wrx-exhaust-underside.jpg" photo 4:3, C3-SUP log card
};

// Where the rear hanger sits in the underside photo (fractions of the photo). The prompt asks for it near the
// right third; check the real photo when it lands and adjust here.
export const HANGER = { x: 0.68, y: 0.42 };
// Where the head-gasket line sits in the weep photo (camera eases toward it at 16 s).
export const WEEP = { x: 0.5, y: 0.5 };

// Fictional names (scripts). Change here.
export const NAMES = { intakeBrand: "Velden Air", exhaustBrand: "Calder", fitter: "Northline Auto", garage: "Pell Street Garage" };

// ---------- placeholders ----------
const PH_BADGE = { position: "absolute", left: 10, top: 10, padding: "4px 10px", borderRadius: 8, background: "rgba(255,204,0,.95)", color: "#1D1D1F", fontSize: 20, fontWeight: 700, letterSpacing: 0, zIndex: 5, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" };
export const PhBadge = ({ name, style = {} }) => <div style={{ ...PH_BADGE, ...style }}>Placeholder · {name}</div>;

// Photo: the real JPG if present, else a grey panel that says what it will be.
export const Photo = ({ path, name, desc, w, h, r = 22, focus = null, zoom = 1, style = {} }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", flex: "none", background: "#E8E8ED", ...style }}>
    {path ? <Img src={staticFile(path)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: focus ? `${focus.x * 100}% ${focus.y * 100}%` : "50% 50%" }} />
      : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "#6E6E73", textAlign: "center", padding: 40, background: "repeating-linear-gradient(135deg,#ECECF0 0 22px,#E3E3E8 22px 44px)", transform: `scale(${zoom})`, transformOrigin: focus ? `${focus.x * 100}% ${focus.y * 100}%` : "50% 50%" }}>
        <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.4"><rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.8" /><circle cx="8.6" cy="9.6" r="1.7" /><path d="m3.6 17 5.2-4.6 3.6 3.1 3.1-2.6 4.9 4.3" /></svg>
        <div style={{ fontSize: 34, fontWeight: 600, color: "#48484A" }}>Photo placeholder</div>
        <div style={{ fontSize: 26, fontWeight: 500, maxWidth: "88%", lineHeight: 1.25 }}>{desc}</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#8E8E93" }}>{name}</div>
      </div>}
  </div>
);

// Check presenter: black leatherette folder, bill edge peeking out (code-drawn stand-in)
export const CheckPresenter = ({ w = 260 }) => IMG.checkPresenter
  ? <Img src={staticFile(IMG.checkPresenter)} style={{ width: w, display: "block" }} />
  : <div style={{ position: "relative", width: w, height: w * 0.62 }}>
    <div style={{ position: "absolute", left: "16%", right: "10%", top: 0, height: "30%", background: "#FAFAF7", borderRadius: 4, transform: "rotate(-3deg)", boxShadow: "0 0 0 1px rgba(0,0,0,.08)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: "14%", bottom: 0, borderRadius: 10, background: "linear-gradient(160deg,#3A3A3C,#1C1C1E 60%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.06)" }} />
    <div style={{ position: "absolute", left: "6%", right: "6%", top: "22%", bottom: "8%", borderRadius: 7, border: "2px dashed rgba(255,255,255,.14)" }} />
    <PhBadge name="c3-check-presenter.png" style={{ left: "50%", top: "52%", transform: "translate(-50%,-50%) scale(.78)", fontSize: 18 }} />
  </div>;

// Counter bell: brass dome, chrome plunger, black base (code-drawn stand-in)
export const CounterBell = ({ w = 220, squash = 0 }) => IMG.counterBell
  ? <Img src={staticFile(IMG.counterBell)} style={{ width: w, display: "block", transform: `scaleY(${1 - squash * 0.08}) scaleX(${1 + squash * 0.04})`, transformOrigin: "50% 100%" }} />
  : <div style={{ position: "relative", width: w, height: w * 0.78 }}>
    <div style={{ position: "absolute", left: "47%", width: "6%", top: `${4 + squash * 6}%`, height: "16%", background: "linear-gradient(90deg,#9A9AA0,#E5E5EA,#8E8E93)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: "40%", width: "20%", top: `${squash * 6}%`, height: "8%", borderRadius: "50%", background: "linear-gradient(180deg,#F2F2F7,#AEAEB2)" }} />
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "18%", height: "58%", borderRadius: "50% 50% 8% 8% / 92% 92% 8% 8%", background: "radial-gradient(120% 90% at 35% 20%,#F6DFA0,#C99A3A 55%,#8A6418)", transform: `scaleY(${1 - squash * 0.06})`, transformOrigin: "50% 100%" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: "72%", height: "22%", borderRadius: "50%", background: "linear-gradient(180deg,#2C2C2E,#0F0F10)" }} />
    <PhBadge name="c3-counter-bell.png" style={{ left: "50%", top: "-10%", transform: "translate(-50%,-100%) scale(.8)" }} />
  </div>;

// Manila hang tag (portrait, clipped top corners, eyelet). Children are laid over it (the ink).
export const TAG_AR = 1.4; // h / w (the real cutout is stretched to this ratio; adjust if it looks off)
export const HangTag = ({ w = 300, children, badge = true, shade = 0 }) => (
  <div style={{ position: "relative", width: w, height: w * TAG_AR }}>
    {IMG.hangTag ? <Img src={staticFile(IMG.hangTag)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }} />
      : <svg viewBox="0 0 100 140" width={w} height={w * TAG_AR} style={{ position: "absolute", inset: 0 }}>
        <path d="M18 0 H82 L100 18 V136 Q100 140 96 140 H4 Q0 140 0 136 V18 Z" fill="#E3C894" />
        <path d="M18 0 H82 L100 18 V136 Q100 140 96 140 H4 Q0 140 0 136 V18 Z" fill="none" stroke="#C9A867" strokeWidth=".8" />
        <circle cx="50" cy="15" r="7.2" fill="#D3B57C" /><circle cx="50" cy="15" r="4.2" fill="#FFFFFF" />
      </svg>}
    {shade > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})`, clipPath: "polygon(18% 0,82% 0,100% 11%,100% 100%,0 100%,0 11%)" }} /> : null}
    {!IMG.hangTag && badge ? <PhBadge name="c3-hang-tag-manila.png" style={{ left: "50%", top: "auto", bottom: 8, transform: "translateX(-50%) scale(.62)", transformOrigin: "50% 100%" }} /> : null}
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "24%", bottom: "8%" }}>{children}</div>
  </div>
);
