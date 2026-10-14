// @ts-nocheck
// Every image the three v3 reels use. Paths are relative to kit/remotion/public.
// SIX IMAGES ARE ON ORDER FROM WAYNE (lab/image-requests/2026-W44.md, batch 2). Until they arrive each one is null and
// renders a finished stand-in built in code (no placeholder tags in the masters):
//   cutouts (check presenter, counter bell, manila hang tag): drawn in SVG with shading;
//   photos (Evo intake, R34 head weep, WRX underside): composed from kit images inside a photo frame, marked
//   "Illustrative example".
// TO SWAP ONE IN: save the file to kit/remotion/public/img/lab/ and replace `null` with the path on its line below.
// Nothing else changes; re-render the reel (see ../README-phase2.md).
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

  // on order (null = code-built stand-in). One line each:
  checkPresenter: null,   // "img/lab/c3-check-presenter.png"     cutout, C3-COL
  evoIntakePhoto: null,   // "img/lab/c3-evo-intake-install.jpg"  photo 4:3, C3-COL log card
  counterBell: null,      // "img/lab/c3-counter-bell.png"        cutout, C3-GAR
  r34WeepPhoto: null,     // "img/lab/c3-r34-head-weep.jpg"       photo 4:3, C3-GAR monitor entry
  hangTag: null,          // "img/lab/c3-hang-tag-manila.png"     cutout, C3-SUP (every tag)
  wrxUndersidePhoto: null, // "img/lab/c3-wrx-exhaust-underside.jpg" photo 4:3, C3-SUP log card
};

// Where the rear hanger sits in the underside photo (fractions of the photo). The stand-in draws it here; when the
// real photo lands, check where its rear hanger is and adjust these two numbers.
export const HANGER = { x: 0.68, y: 0.42 };
// Where the head-gasket line sits in the weep photo (camera eases toward it at 16 s). Same: adjust for the real photo.
export const WEEP = { x: 0.52, y: 0.47 };

// Fictional names (scripts). Change here.
export const NAMES = { intakeBrand: "Velden Air", exhaustBrand: "Calder", fitter: "Northline Auto", garage: "Pell Street Garage" };

const S = p => staticFile(p);
const IllusChip = () => <div style={{ position: "absolute", left: 14, bottom: 14, zIndex: 6, height: 38, padding: "0 14px", borderRadius: 19, background: "rgba(255,255,255,.88)", color: "#6E6E73", fontSize: 22, fontWeight: 600, display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", letterSpacing: "-.01em", boxShadow: "0 0 0 1px rgba(0,0,0,.06)" }}>Illustrative example</div>;
const Grade = ({ warm = 0.08 }) => <>
  <div style={{ position: "absolute", inset: 0, background: `rgba(255,170,90,${warm})`, mixBlendMode: "soft-light" }} />
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 95% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.28))" }} />
</>;

// ---------- photo stand-ins (composed from kit images; 4:3; a phone-photo feel; clearly illustrative) ----------
const EvoIntakeStandIn = () => <div style={{ position: "absolute", inset: 0, background: "#3a3a3c", overflow: "hidden" }}>
  {/* an engine bay, out of focus (kit photo), warm garage light */}
  <Img src={S("img/lab/b-supra-turbo-after.jpg")} style={{ position: "absolute", left: "-30%", top: "-38%", width: "160%", filter: "blur(7px) saturate(.75) brightness(.78)" }} />
  {/* a sliver of the blue wing, out of focus at the left edge */}
  <div style={{ position: "absolute", left: "-6%", top: "-10%", bottom: "-10%", width: "12%", borderRadius: "0 60% 60% 0 / 0 50% 50% 0", background: "linear-gradient(90deg,#0E2A73,#2457C8 70%,#6C95EE)", filter: "blur(6px)" }} />
  {/* the freshly fitted red cone intake, in focus */}
  <div style={{ position: "absolute", left: "33%", top: "14%", width: "56%" }}>
    <div style={{ position: "absolute", left: "10%", right: "6%", bottom: "-4%", height: "16%", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(0,0,0,.55),rgba(0,0,0,0))", filter: "blur(8px)" }} />
    <Img src={S("img/part-04.png")} style={{ position: "relative", width: "100%", display: "block", filter: "saturate(1.05) contrast(1.04)" }} />
  </div>
  <Grade warm={0.12} />
  <IllusChip />
</div>;

// close-up of the head-to-block seam: cast texture above (head) and below (block) from the kit's engine-block cutout,
// a gasket line between them and a wet oil weep along it at WEEP
const R34WeepStandIn = () => <div style={{ position: "absolute", inset: 0, background: "#2b2b2e", overflow: "hidden" }}>
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${WEEP.y * 100}%`, overflow: "hidden" }}>
    <Img src={S("img/obj/engine-block.png")} style={{ position: "absolute", left: "-62%", bottom: "-128%", width: "250%", transform: "scaleY(-1)", filter: "brightness(.78) contrast(1.15) saturate(.7)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.15),rgba(255,255,255,.06) 85%,rgba(255,255,255,.18))" }} />
  </div>
  <div style={{ position: "absolute", left: 0, right: 0, top: `${WEEP.y * 100}%`, bottom: 0, overflow: "hidden" }}>
    <Img src={S("img/obj/engine-block.png")} style={{ position: "absolute", left: "-62%", top: "-92%", width: "250%", filter: "brightness(.92) contrast(1.1)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,0) 22%)" }} />
  </div>
  <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <defs><linearGradient id="weep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#24170a" stopOpacity="0" /><stop offset=".18" stopColor="#3a2408" stopOpacity=".92" /><stop offset=".82" stopColor="#4a2d0a" stopOpacity=".95" /><stop offset="1" stopColor="#24170a" stopOpacity="0" /></linearGradient></defs>
    {/* gasket line */}
    <rect x="0" y={300 * WEEP.y - 4} width="400" height="7" fill="#151517" />
    <rect x="0" y={300 * WEEP.y - 1} width="400" height="1.5" fill="rgba(170,150,110,.45)" />
    {/* the weep */}
    <path d={`M110 ${300 * WEEP.y + 5} C 170 ${300 * WEEP.y + 8} 240 ${300 * WEEP.y + 7} 300 ${300 * WEEP.y + 4}`} stroke="url(#weep)" strokeWidth="9" strokeLinecap="round" fill="none" />
    <path d={`M188 ${300 * WEEP.y + 8} C 189 ${300 * WEEP.y + 26} 187 ${300 * WEEP.y + 40} 190 ${300 * WEEP.y + 58}`} stroke="#3a2408" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".9" />
    <circle cx="190" cy={300 * WEEP.y + 60} r="4" fill="#3a2408" opacity=".9" />
    <path d={`M246 ${300 * WEEP.y + 7} C 247 ${300 * WEEP.y + 16} 246 ${300 * WEEP.y + 24} 248 ${300 * WEEP.y + 32}`} stroke="#3a2408" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".85" />
    <path d={`M130 ${300 * WEEP.y + 3} C 180 ${300 * WEEP.y + 6} 240 ${300 * WEEP.y + 5} 290 ${300 * WEEP.y + 2}`} stroke="rgba(255,236,200,.6)" strokeWidth="1.4" fill="none" />
    <ellipse cx="189" cy={300 * WEEP.y + 30} rx="1.4" ry="6" fill="rgba(255,236,200,.5)" />
  </svg>
  <Grade warm={0.06} />
  <IllusChip />
</div>;

// rear rubber hanger is drawn at HANGER so the "Check first" tag ties onto it
const WrxUndersideStandIn = () => <div style={{ position: "absolute", inset: 0, background: "#1f2023", overflow: "hidden" }}>
  {/* shop ceiling light falling past the car's edge (kit photo, blurred) */}
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 60% at 80% 0%, rgba(255,255,255,.35), rgba(255,255,255,0) 70%), radial-gradient(60% 50% at 10% 100%, rgba(255,214,140,.18), rgba(0,0,0,0) 70%)" }} />
  <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <defs><linearGradient id="pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c2d31" /><stop offset="1" stopColor="#161619" /></linearGradient>
      <linearGradient id="arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5C531" /><stop offset="1" stopColor="#B88A0C" /></linearGradient></defs>
    {/* floor pan with pressed ribs and the tunnel */}
    <path d="M0 30 L 400 18 L 400 250 L 0 262 Z" fill="url(#pan)" />
    {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${20 + i * 56} ${40 - i * 1.6} l 30 -1 l 0 205 l -30 1 Z`} fill="rgba(255,255,255,.02)" />)}
    <path d="M0 30 L 400 18" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
    <path d="M0 98 C 120 92 280 86 400 82 L 400 150 C 280 154 120 160 0 164 Z" fill="rgba(0,0,0,.18)" />
    {/* lift arm pad, bottom-left, just in frame */}
    <path d="M0 268 L 120 252 L 124 272 L 0 290 Z" fill="url(#arm)" />
    <rect x="96" y="238" width="34" height="18" rx="3" fill="#2c2c2e" />
  </svg>
  {/* the stainless cat-back, along the tunnel */}
  <div style={{ position: "absolute", left: "-2%", top: "10%", width: "100%", transform: "rotate(-4deg)" }}>
    <Img src={S("img/part-05.png")} style={{ width: "100%", display: "block", transform: "scaleY(.86)", filter: "brightness(.92) contrast(1.06)" }} />
  </div>
  {/* rubber hangers: a front one (left) and the rear one at HANGER; each rod runs from the floor pan into the pipe */}
  {[HANGER].map((h, i) => <svg key={i} viewBox="0 0 60 90" style={{ position: "absolute", left: `${h.x * 100 - 6}%`, top: `${h.y * 100 - 20}%`, width: "12%", overflow: "visible" }}>
    <rect x="18" y="0" width="24" height="12" rx="3" fill="#3a3b3f" stroke="#55565b" strokeWidth="1" />
    <path d="M30 10 L 30 26" stroke="#A9ABB0" strokeWidth="6" strokeLinecap="round" />
    <rect x="6" y="24" width="48" height="34" rx="14" fill="#121214" stroke="#34353a" strokeWidth="2" />
    <circle cx="20" cy="41" r="6" fill="#26272b" /><circle cx="40" cy="41" r="6" fill="#26272b" />
    <path d="M12 29 Q 30 22 48 29" stroke="rgba(255,255,255,.2)" strokeWidth="2.4" fill="none" />
    <path d="M30 56 L 30 84" stroke="#C4C6CB" strokeWidth="6" strokeLinecap="round" />
    <path d="M27.5 58 L 27.5 82" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" />
  </svg>)}
  <Grade warm={0.04} />
  <IllusChip />
</div>;

const STAND_IN = { "c3-evo-intake-install.jpg": EvoIntakeStandIn, "c3-r34-head-weep.jpg": R34WeepStandIn, "c3-wrx-exhaust-underside.jpg": WrxUndersideStandIn };

// Photo: the real JPG if present, else the composed stand-in. zoom/focus drive a slow Ken Burns from the scene.
export const Photo = ({ path, name, w, h, r = 22, focus = null, zoom = 1, style = {}, children = null }) => {
  const SI = STAND_IN[name];
  const tf = { transform: `scale(${zoom})`, transformOrigin: focus ? `${focus.x * 100}% ${focus.y * 100}%` : "50% 50%" };
  return <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", flex: "none", background: "#E8E8ED", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)", ...style }}>
    {path ? <Img src={S(path)} style={{ width: "100%", height: "100%", objectFit: "cover", ...tf }} />
      : <div style={{ position: "absolute", inset: 0, ...tf }}><SI /></div>}
    {children}
  </div>;
};

// ---------- cutout stand-ins ----------
// Check presenter: closed black leatherette folder, stitched edge, a blank bill edge peeking out (three-quarter view)
export const CheckPresenter = ({ w = 260 }) => IMG.checkPresenter
  ? <Img src={S(IMG.checkPresenter)} style={{ width: w, display: "block" }} />
  : <svg viewBox="0 0 260 162" width={w} height={w * 162 / 260} style={{ display: "block", overflow: "visible" }}>
    <defs>
      <linearGradient id="cpBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3B3B3F" /><stop offset=".45" stopColor="#222225" /><stop offset="1" stopColor="#111113" /></linearGradient>
      <linearGradient id="cpSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".16" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <linearGradient id="cpPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#ECEAE4" /></linearGradient>
    </defs>
    {/* the bill, peeking out of the top */}
    <path d="M40 6 L 206 0 L 210 44 L 44 50 Z" fill="url(#cpPaper)" stroke="rgba(0,0,0,.12)" />
    <path d="M40 6 L 206 0 L 207 8 L 41 14 Z" fill="rgba(0,0,0,.05)" />
    {/* folder body (slight 3/4 skew), spine on the left */}
    <path d="M6 40 Q 6 32 14 32 L 248 26 Q 256 26 256 34 L 256 150 Q 256 158 248 158 L 14 160 Q 6 160 6 152 Z" fill="url(#cpBody)" />
    <path d="M6 40 Q 6 32 14 32 L 30 32 L 30 160 L 14 160 Q 6 160 6 152 Z" fill="rgba(0,0,0,.35)" />
    <path d="M30 32 L 30 160" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />
    {/* stitching */}
    <path d="M38 40 L 246 35 L 246 150 L 38 152 Z" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" strokeDasharray="5 4" />
    {/* leather sheen */}
    <path d="M40 38 L 250 32 L 250 70 L 40 78 Z" fill="url(#cpSheen)" opacity=".8" />
    <path d="M14 33 L 248 27" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />
  </svg>;

// Counter bell: brass dome, chrome plunger, black base. squash 0..1 presses the plunger and flattens the dome.
export const CounterBell = ({ w = 220, squash = 0, ring = 0, gleam = 0.3 }) => IMG.counterBell
  ? <Img src={S(IMG.counterBell)} style={{ width: w, display: "block", transform: `scaleY(${1 - squash * 0.08}) scaleX(${1 + squash * 0.04 + ring * 0.01})`, transformOrigin: "50% 100%" }} />
  : <svg viewBox="0 0 220 172" width={w} height={w * 172 / 220} style={{ display: "block", overflow: "visible" }}>
    <defs>
      <radialGradient id="brass" cx=".34" cy=".25" r=".9"><stop offset="0" stopColor="#FFF1C2" /><stop offset=".22" stopColor="#E8C062" /><stop offset=".6" stopColor="#B88A2C" /><stop offset="1" stopColor="#6E4E12" /></radialGradient>
      <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8E8E93" /><stop offset=".45" stopColor="#F2F2F7" /><stop offset="1" stopColor="#7C7C80" /></linearGradient>
      <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3A3C" /><stop offset="1" stopColor="#0E0E10" /></linearGradient>
    </defs>
    <g transform={`translate(0 ${squash * 8})`}>
      <rect x="104" y="0" width="12" height="40" rx="5" fill="url(#chrome)" />
      <ellipse cx="110" cy="4" rx="22" ry="8" fill="url(#chrome)" />
      <ellipse cx="110" cy="2" rx="14" ry="4" fill="rgba(255,255,255,.7)" />
    </g>
    <g transform={`translate(110 140) scale(${1 + squash * 0.035 + ring * 0.012} ${1 - squash * 0.06 - ring * 0.008}) translate(-110 -140)`}>
      <path d="M18 138 C 18 70 60 34 110 34 C 160 34 202 70 202 138 Z" fill="url(#brass)" />
      <path d="M48 118 C 50 82 72 56 104 50" stroke="#FFF6D8" strokeWidth="6" strokeLinecap="round" fill="none" opacity={0.25 + gleam * 0.5} />
      <ellipse cx={70 + gleam * 50} cy={74 - gleam * 10} rx="16" ry="9" fill="#FFFBEA" opacity={0.35 + 0.3 * gleam} transform={`rotate(-30 ${70 + gleam * 50} ${74 - gleam * 10})`} />
    </g>
    <ellipse cx="110" cy="148" rx="104" ry="20" fill="url(#base)" />
    <ellipse cx="110" cy="141" rx="98" ry="11" fill="#2C2C2E" />
    <path d="M18 142 C 60 132 160 132 202 142" stroke="rgba(255,255,255,.14)" strokeWidth="2" fill="none" />
  </svg>;

// Manila hang tag (portrait, clipped top corners, reinforced eyelet, centre fold crease). Children are the ink.
export const TAG_AR = 1.4; // h / w (the real cutout is stretched to this ratio; adjust if it looks off)
export const HangTag = ({ w = 300, children, shade = 0, crease = 0.5 }) => (
  <div style={{ position: "relative", width: w, height: w * TAG_AR }}>
    {IMG.hangTag ? <Img src={S(IMG.hangTag)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }} />
      : <svg viewBox="0 0 100 140" width={w} height={w * TAG_AR} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="manila" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EED6A4" /><stop offset=".5" stopColor="#E3C792" /><stop offset="1" stopColor="#D2B47A" /></linearGradient>
          <filter id="fibre" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n" /><feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .33  0 0 0 0 .15  0 0 0 .10 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
          <radialGradient id="eyelet" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#F4E2B8" /><stop offset="1" stopColor="#BF9F62" /></radialGradient>
        </defs>
        <path d="M18 0 H82 L100 18 V136 Q100 140 96 140 H4 Q0 140 0 136 V18 Z" fill="url(#manila)" />
        <path d="M18 0 H82 L100 18 V136 Q100 140 96 140 H4 Q0 140 0 136 V18 Z" fill="#000" filter="url(#fibre)" />
        <path d="M18 0 H82 L100 18 V136 Q100 140 96 140 H4 Q0 140 0 136 V18 Z" fill="none" stroke="#B99A5C" strokeWidth=".7" />
        {/* centre fold crease (the tag opens along it) */}
        <path d="M50 26 V 138" stroke="rgba(120,90,40,.16)" strokeWidth=".8" />
        <path d="M50.8 26 V 138" stroke="rgba(255,255,255,.25)" strokeWidth=".6" />
        <circle cx="50" cy="15" r="7.4" fill="url(#eyelet)" stroke="#A88A50" strokeWidth=".5" />
        <circle cx="50" cy="15" r="3.9" fill="#FFFFFF" stroke="rgba(0,0,0,.18)" strokeWidth=".5" />
      </svg>}
    {shade > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})`, clipPath: "polygon(18% 0,82% 0,100% 13%,100% 100%,0 100%,0 13%)" }} /> : null}
    <div style={{ position: "absolute", left: "9%", right: "8%", top: "24%", bottom: "8%" }}>{children}</div>
  </div>
);
