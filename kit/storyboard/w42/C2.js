// C2 · Any service records? — storyboard key frames (lead hook A, dialogue: Chris = Jay, Brian = Walt). Times are from the beat sheet; the build retimes to words.json.
// Spine: one iMessage thread (contact chip "Walt · 240Z" stays in the headline band) until the link breaks it open.
const R = w => `<span class="r">${w}</span>`;

// thread drawn at phone-readable size (iMessage look). Every bubble is its own top-level element (heights are deterministic: text is pre-broken) so each one springs in on its own.
const nz = s => String(s).replace(/(\d)(?=\d)/g, "$1\u200b"); // keeps years from rolling like counters
const who = chip(`${avc("car-05", 60)}<span>${nz("Walt · 240Z")}</span>`, 0, 200, { h: 96, fs: 40, style: "left:50%;transform:translateX(-50%)" });
const hOf = (m, fs) => m.status ? .62 * fs : m.dots ? 1.7 * fs * (m.s || 1) : m.link ? 9 * fs : (m.t.length * 1.22 + .84) * fs;
const el = (m, y, fs) => {
  const side = m.me || m.status ? "right" : "left", off = m.status ? 90 : 60, f = m.dots ? fs * (m.s || 1) : fs;
  const pos = `${side}:${off}px;top:${y}px;font-size:${f}px;z-index:4;`;
  if (m.status) return `<div class="abs" style="${pos}font-size:${fs * .5}px;color:#8E8E93;font-weight:500">${m.status}</div>`;
  if (m.dots) return `<div class="abs" style="${pos}background:${m.me ? "#0A84FF" : "#E9E9EB"};border-radius:1.2em;padding:.62em .85em;display:flex;gap:.28em;opacity:${m.op ?? 1}">${[.9, .6, .35].map(o => `<i style="width:.46em;height:.46em;border-radius:50%;background:${m.me ? "#fff" : "#8E8E93"};opacity:${o}"></i>`).join("")}</div>`;
  if (m.link) return `<div class="abs" style="${pos}width:13.4em;height:9em;border-radius:.9em;overflow:hidden;background:#E9E9EB;box-shadow:0 30px 60px -30px rgba(0,0,0,.3)">${ph(m.link.img, "", 670, 330, { r: 0, inset: 4, style: "width:100%;height:6.4em" })}
      <div style="padding:.3em .6em"><div style="font-size:.66em;font-weight:600;line-height:1.2;letter-spacing:-.015em;white-space:nowrap">${nz(m.link.title)}</div><div style="font-size:.56em;color:#8E8E93;margin-top:.1em">${nz(m.link.url)}</div></div></div>`;
  return `<div class="abs" style="${pos}white-space:nowrap;background:${m.me ? "#0A84FF" : "#E9E9EB"};color:${m.me ? "#fff" : "#000"};border-radius:1.12em;padding:.42em .74em;line-height:1.22;letter-spacing:-.015em">${m.t.map(nz).join("<br>")}
    ${m.react ? `<div style="position:absolute;left:-.5em;top:-.5em;width:1.2em;height:1.2em;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.2);display:grid;place-items:center;font-size:.72em;font-weight:800;color:#F43034">${m.react}</div>` : ""}</div>`;
};
const thread = (msgs, fs, bottom) => {
  const gaps = msgs.map((m, i) => i ? (msgs[i].status ? -.08 * fs : (!!msgs[i - 1].me !== !!m.me ? .4 : .26) * fs) : 0);
  const total = msgs.reduce((a, m, i) => a + hOf(m, fs) + gaps[i], 0);
  let y = bottom - total; thread.pos = [];
  return msgs.map((m, i) => { y += gaps[i]; const h = hOf(m, fs); thread.pos.push([y, h]); const o = el(m, y, fs); y += h; return o; }).join("");
};

const J1 = { me: true, t: ["Before I book the", "flight — any service", "records on the Z?"] };
const W2 = { t: ["Motor was rebuilt.", "Around… 2015?"] }, J2 = { me: true, t: ["Around?"] };
const J3 = { me: true, t: ["By who?"] }, W3 = { t: ["Guy in Reno.", "He retired."] };
const J4 = { me: true, t: ["Got another Z to", "look at Sunday."] };
const LINK = { link: { title: "1972 Datsun 240Z · Walt’s build", url: "fuelmybuild.com/walt-240z", img: "car-05" } };
const imgTile = (src, h = 116) => `<div style="position:relative;border-radius:14px;height:${h}px;background:linear-gradient(160deg,#F7F7F9,#E4E4EA)"><img src="${IMG}${src}.png" style="position:absolute;inset:6%;width:88%;height:88%;object-fit:contain"></div>`;

// hook A (0–2.5 s): pure cold open, already in the thread. the contact avatar is the 240Z
add("c2-01", 0.3, `<div class="abs" style="left:330px;top:250px;z-index:3;filter:drop-shadow(0 34px 40px rgba(0,0,0,.2))">${avc("car-05", 420)}</div>
  ${txt("Walt · 240Z", 0, 700, { size: 58, weight: 600, style: "left:0;right:0;text-align:center;letter-spacing:-.025em" })}
  ${txt("iMessage · Today", 0, 1070, { size: 36, weight: 500, color: "#86868B", style: "left:0;right:0;text-align:center" })}
  ${thread([J1], 72, 1480)}`, "white", "Hook A (lead). Chris as Jay, quick: “Before I book the flight — any service records on the Z?” Jay’s blue bubble lands at frame 0 with the send whoosh (imessage-chat-flow, already open). No headline on purpose: the genre is the hook.");
add("c2-02", 1.9, `${H(`Any service<br><span class="g">${R("records")}?</span>`, 360, { size: 104 })}
  ${thread([J1, { status: "Delivered" }, { dots: true, s: 2.8 }], 66, 1480)}${who}`, "white", "Walt’s typing dots pop in under the bubble, huge (soft pop sfx, music bed ducks). Camera: slow 3% push on the thread. Seam into body line 1.");

// body
add("c2-03", 3.3, `${H(`Stopped.<br><span class="g">Typing again.</span>`, 360, { size: 104 })}
  ${thread([J1, { status: "Delivered" }, { dots: true, s: 2.8, op: .2 }], 66, 1480)}${who}`, "white", "VO (Chris): “Typing… stopped. Typing again.” Dots vanish on a single frame and all sound cuts to silence on each stall (0.35 s). Dots return with a custom pulse. typing-indicator is the villain.");
add("c2-04", 5.6, `${H(`${R("Around")}?`, 360, { size: 150 })}
  ${thread([J1, W2, J2], 68, 1480)}${who}`, "white", "VO: Brian (Walt, older, slow): “Motor was rebuilt. Around… 2015?” Chris, clipped: “Around?” Grey bubble eases in, the one-word reply snaps in on a fast spring (pop sfx). Slow push-in on the thread.");
add("c2-05", 9.2, `${H(`Guy in Reno.<br><span class="g">He ${R("retired")}.</span>`, 340, { size: 104 })}
  ${thread([W2, J2, J3, W3], 68, 1480)}
  ${notif({ who: "New listing", text: nz("1972 240Z · “all records”"), w: 920, s: 2.2, style: "position:absolute;left:80px;top:1335px;z-index:8" })}${who}`, "white", "VO: Chris: “By who?” Brian: “Guy in Reno. He retired.” On “retired” an iOS 26 glass banner drops from the top with spring overshoot and covers Walt’s bubble (the only time the thread is covered). Notification ding.");
add("c2-06", 12.4, `${H(`Got another Z<br><span class="g">Sunday.</span>`, 340, { size: 104 })}
  ${thread([J3, W3, J4, { dots: true, s: 1.8 }], 68, 1480)}${who}`, "white", "VO: Chris: “Got another Z to look at Sunday.” Then 1.2 s of dead air: Walt’s long dots, no VO, only soft room tone (the longest silence in the film, reveal silence). Camera creeps 4% toward the dots (drift).");
const T7 = thread([J4, { t: ["Hang on. Here."] }, LINK], 60, 1500), P7 = thread.pos[2];
add("c2-07", 15.4, `${H(`One ${R("link")}.`, 360, { size: 124 })}${T7}${touch(430, P7[0] + P7[1] * .45)}${who}`, "white", "VO: Brian, steady now: “Hang on. Here.” FMB turn (15 s, 56%). The link card springs in with a rich preview, new object type in the thread. Thumb taps the card (tap sfx). The orange 240Z cutout in the preview becomes the page header next.");
add("c2-08", 18.2, `${H(`May 9, 2015.<br><span class="g">Photos.</span>`, 340, { size: 104 })}
  ${device(buildPage({ hero: "car-05", title: "1972 Datsun 240Z", owner: "walt.240z", ownerCar: "car-05", meta: "Public", url: "fuelmybuild.com/walt-240z", tab: "Log", section: "Log · Engine, 2015",
    rows: [{ img: "part-04", name: "Engine rebuild", brand: "Sierra Z Works", date: "May 9, 2015", hl: true }, { img: "part-02", name: "Suspension refresh", brand: "Sierra Z Works", date: "Sep 20, 2016" }],
    sheet: logSheet({ title: "Engine rebuild", date: "May 9, 2015", by: "Sierra Z Works", byMono: "S", photos: [], h: 500,
      extra: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px">${imgTile("obj/engine-block")}${imgTile("obj/carburetors")}${imgTile("part-05")}</div>
      <div style="margin-top:12px;display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:14px;background:var(--grouped)">${imgTile("obj/carburetors", 38)}<div><div class="sh" style="font-weight:500">Carburetors</div><div class="fn sec">{brand} · 2015</div></div></div>` }) }),
    { x: 40, y: 600, w: 560 })}
  ${cut("obj/engine-block", { x: 540, y: 1010, w: 500, z: 6 })}`, "gray", "VO: Chris, slower, reading it himself: “Rebuilt L24… May 9th, 2015… twelve photos…” push-through (shared-axis-z) from the link card into the build page in the same phone. The log sheet slides up (sheet sfx) and the engine block pops out of the photo grid (spring + soft thud); page-turn paper rustle under the VO.");
add("c2-09", 21.4, `${H(`Logged<br><span class="g">by the ${R("shop")}.</span>`, 340, { size: 104 })}
  ${device(buildPage({ hero: "car-05", title: "1972 Datsun 240Z", owner: "walt.240z", ownerCar: "car-05", meta: "Public", url: "fuelmybuild.com/walt-240z", tab: "Log", section: "Log · 14 entries",
    rows: [{ img: "mech", name: "Engine rebuild", brand: "Logged by Sierra Z Works", date: "May 9, 2015" }, { img: "mech", name: "Valve adjustment", brand: "Logged by Sierra Z Works", date: "Mar 2, 2019" }, { img: "mech", name: "Brake overhaul", brand: "Logged by Sierra Z Works", date: "Oct 14, 2023" }] }), { x: 40, y: 600, w: 560 })}
  ${cut("mech", { x: 590, y: 1020, w: 440, z: 6 })}
  ${chip(`<span>Logged by Sierra Z Works</span>${seal(30)}`, 330, 868, { h: 100, fs: 38, z: 9 })}`, "gray", "VO: Chris: “The Reno shop logged this?” Brian, certain: “Every visit.” Scroll reveal: three entries stack, 2015 → 2023, each stamped with the same shop; the veteran mechanic steps in beside the phone. Soft scroll tick per row.");
add("c2-10", 23.8, `${H(`${R("Deal.")}`, 360, { size: 150 })}
  ${thread([{ me: true, t: ["The Reno shop", "logged this?"] }, { t: ["Every visit."] }, { me: true, t: ["…Deal."], react: "!!" }, { t: ["Saturday?"] }, { dots: true, me: true, s: 1.5 }], 64, 1480)}${who}`, "white", "VO: Chris, soft: “…Deal.” Brian: “Saturday?” Back in the thread. “Deal.” stamps in as a blue bubble with a tiny red tapback (caption-stamp energy, UI-native). Then Jay’s dots appear and hold: matches frame 0 for the loop. Thud sfx on the stamp, then silence.");
add("c2-11", 25.6, `${cut("car-05", { x: 140, y: 300, w: 800, z: 3 })}${endCard("Records your buyer can open.")}`, "white", "CTA (Brian): “Records your buyer can open: fuelmybuild.com.” Logo spring, URL in red.");

window.META = { reel: "C2", title: "Any service records?", lead: "A", voice: "Chris (Jay, buyer), Brian (Walt, seller)",
  remocn: ["imessage-chat-flow (thread, tapback)", "typing-indicator (custom pulse, single-frame vanish)", "message-bubble", "toast (as the top-drop notification banner)", "drift (4% creep on the long stall)", "shared-axis-z (link card into page)", "push-through", "caption-speaker (two-voice captions)", "caption-stamp (Deal.)"],
  newCutouts: [] };
