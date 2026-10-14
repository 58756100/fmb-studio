// @ts-nocheck
// FuelMyBuild screens (live features only: build page, parts registry with brand, public URL, dated log entries, photos).
// Garage / contributor attribution (L2) is marked (confirm) in changes.md.
import React from "react";
import { Tile, Photo, Avatar, Icon, StatusBar, INK, GREY, RED, IMG } from "./lib";

// ---------- in-phone build page (402 x 874 pt) ----------
const Row = ({ img, name, sub, date, hl = 0 }) => (
  <div className="row" style={{ ["--ins"]: "72px", minHeight: 68, background: hl ? `rgba(244,48,52,${0.1 * hl})` : undefined }}>
    <Tile id={img} w={44} h={44} r={10} fit={0.86} shadow={false} border={false} />
    <div className="main"><div className="body" style={{ fontWeight: 500 }}>{name}</div>
      <div className="sh sec" style={{ marginTop: 1 }}>{sub}<span> · {date}</span></div></div>
    <Icon n="chevR" size={14} color="rgba(60,60,67,.3)" sw={2.4} />
  </div>
);
export const BuildPage = ({ car, title, owner, ownerAv, url, rows, tab = 1, hl = -1, hlP = 0, extra = null, flip = false, header = null }) => (
  <div className="ios grouped">
    <div style={{ position: "absolute", top: 0, left: 0 }}><Tile id={car} w={402} h={300} r={0} fit={0.9} floor={0.2} flip={flip} border={false} /></div>
    <StatusBar />
    <div className="navbtns"><div className="gbtn glass"><Icon n="chevL" size={20} color="#000" sw={2.2} /></div><div style={{ display: "flex", gap: 10 }}><div className="gbtn glass"><Icon n="share" size={20} color="#000" /></div><div className="gbtn glass"><Icon n="ellipsis" size={20} color="#000" /></div></div></div>
    <div style={{ position: "absolute", top: 262, left: 0, right: 0, bottom: 0, background: "var(--grouped)", borderRadius: "28px 28px 0 0", paddingTop: 20 }}>
      <div style={{ padding: "0 20px" }}>
        <div className="lt">{title}</div>
        <div className="sh sec" style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}><Avatar id={ownerAv} size={22} /><span><b style={{ color: "#000", fontWeight: 600 }}>{owner}</b> · Public</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, height: 30, padding: "0 12px", borderRadius: 15, background: "var(--fill)", width: "fit-content", fontSize: 13 }}>
          <Icon n="globe" size={14} color="rgba(60,60,67,.6)" sw={2} /><span>{url}</span><span style={{ color: GREY }}>· demo URL</span></div>
        <div className="seg" style={{ marginTop: 14 }}>{["Overview", "Parts", "Log", "Media"].map((s, i) => <span key={s} className={i === tab ? "on" : ""}>{s}</span>)}</div>
      </div>
      {header}
      <div className="hdr" style={{ marginTop: 18 }}>{tab === 1 ? `Installed · ${rows.length + 9} parts` : "Recent log"}</div>
      <div className="list">{rows.map((r, i) => <Row key={i} {...r} hl={i === hl ? hlP : 0} />)}</div>
      {extra}
    </div>
  </div>
);

// ---------- enlarged record cards (native px, readable) ----------
const card = { background: "#fff", borderRadius: 44, boxShadow: "0 0 0 1px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.04), 0 22px 24px -18px rgba(0,0,0,.22)" };
export const RowCard = ({ img, name, brand, date, w = 880, brandFocus = 0, brandReveal = 1, brandLabel = "Brand", note = "Owner-entered", style = {} }) => (
  <div style={{ ...card, width: w, padding: "34px 40px", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <Tile id={img} w={150} h={150} r={30} fit={0.86} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 30, color: GREY, fontWeight: 500 }}>Parts registry</div>
        <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-.03em", color: INK, lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontSize: 32, color: GREY, marginTop: 4 }}>Installed {date}</div>
      </div>
    </div>
    <div style={{ marginTop: 28, borderRadius: 30, padding: "20px 28px", background: brandFocus ? `rgba(244,48,52,${0.07 * brandFocus})` : "#F2F2F7",
      boxShadow: brandFocus ? `0 0 0 ${5 * brandFocus}px ${RED}` : undefined, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 28, color: GREY, fontWeight: 500 }}>{brandLabel}</div>
        <div style={{ fontSize: 54, fontWeight: 600, letterSpacing: "-.03em", color: INK, filter: `blur(${(1 - brandReveal) * 14}px)`, opacity: 0.25 + 0.75 * brandReveal }}>{brand}</div>
      </div>
      <div style={{ fontSize: 28, color: GREY, textAlign: "right" }}>{note}</div>
    </div>
  </div>
);
// log entry: date + title, note, photo strip; photos = [{id, label, zoom, fx, fy, flip, imgStyle}]
export const LogCard = ({ date, title, note, photos, w = 880, photoP = [1, 1, 1], by = null, style = {}, children }) => (
  <div style={{ ...card, width: w, padding: "34px 40px 40px", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: GREY, fontWeight: 500 }}><Icon n="cal" size={34} color={GREY} sw={1.8} />Build log · dated entry</div>
    <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-.032em", color: INK, marginTop: 8, lineHeight: 1.08 }}>{date} <span style={{ color: GREY }}>·</span> {title}</div>
    {note ? <div style={{ fontSize: 36, color: "#3A3A3C", marginTop: 14, lineHeight: 1.25, letterSpacing: "-.015em" }}>{note}</div> : null}
    {by}
    {photos ? <div style={{ display: "flex", gap: 18, marginTop: 26 }}>{photos.map((p, i) => (
      <div key={i} style={{ opacity: Math.min(1, (photoP[i] ?? 1) * 1.6), transform: `scale(${0.8 + 0.2 * Math.min(1.05, photoP[i] ?? 1)})` }}>
        <Photo id={p.id} w={(w - 80 - 36) / 3} h={(w - 80 - 36) / 3} r={24} zoom={p.zoom || 1} fx={p.fx} fy={p.fy} flip={p.flip} fit={p.fit} imgStyle={p.imgStyle} />
        <div style={{ fontSize: 28, color: GREY, fontWeight: 500, marginTop: 10, textAlign: "center" }}>{p.label}</div>
      </div>))}</div> : null}
    {children}
  </div>
);
// attribution line (L2): icon + label + value with avatar
export const AttribCard = ({ rows, w = 880, focus = [], style = {} }) => (
  <div style={{ ...card, width: w, padding: "18px 40px", ...style }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "20px 0", borderTop: i ? "1px solid rgba(60,60,67,.14)" : undefined,
        background: focus[i] ? `rgba(244,48,52,${0.06 * focus[i]})` : undefined, margin: "0 -20px", paddingLeft: 20, paddingRight: 20, borderRadius: 24,
        boxShadow: focus[i] ? `0 0 0 ${5 * focus[i]}px ${RED}` : undefined }}>
        <Avatar id={r.av} size={96} bg={r.avBg || "#E6E1DA"} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, color: GREY, fontWeight: 500 }}>{r.label}</div>
          <div style={{ fontSize: 54, fontWeight: 600, letterSpacing: "-.03em", color: INK, lineHeight: 1.1 }}>{r.value}</div>
        </div>
        {r.right ? <div style={{ fontSize: 30, color: GREY }}>{r.right}</div> : null}
      </div>))}
  </div>
);
export const UrlPill = ({ url, w, style = {}, press = 0 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, height: 76, padding: "0 30px", borderRadius: 38, background: press ? `rgba(244,48,52,${0.1 + 0.08 * press})` : "#fff", width: w,
    boxShadow: "0 0 0 1px rgba(0,0,0,.06), 0 10px 20px -12px rgba(0,0,0,.18)", fontSize: 34, letterSpacing: "-.02em", color: INK, whiteSpace: "nowrap", transform: `scale(${1 - 0.04 * press})`, ...style }}>
    <Icon n="link" size={34} color={RED} sw={2.2} /><span style={{ fontWeight: 500 }}>{url}</span><span style={{ color: GREY, fontSize: 28 }}>demo URL</span>
  </div>
);
