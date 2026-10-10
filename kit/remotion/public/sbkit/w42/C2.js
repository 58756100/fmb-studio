// C2 · Any service records? — storyboard key frames (lead hook A, dialogue: Chris = Jay, Brian = Walt). Times are from the beat sheet; the build retimes to words.json.
// Spine: one iMessage thread (contact chip "Walt · 240Z" stays in the headline band) until the link breaks it open.
const R = w => `<span class="r">${w}</span>`;
const who = chip(`${avc("car-05", 60)}<span>Walt · 240Z</span>`, 0, 200, { h: 96, fs: 40, style: "left:50%;transform:translateX(-50%)" });

// thread drawn at phone-readable size (iMessage look: grey incoming, blue outgoing). all sizes in em so a frame can push in with fs.
const dots = (me, op = 1, sc = 1) => `<div style="font-size:${sc}em;flex:none;align-self:${me ? "flex-end" : "flex-start"};background:${me ? "#0A84FF" : "#E9E9EB"};border-radius:1.2em;padding:.62em .85em;display:flex;gap:.28em;opacity:${op}">${[.9, .6, .35].map(o => `<i style="width:.46em;height:.46em;border-radius:50%;background:${me ? "#fff" : "#8E8E93"};opacity:${o}"></i>`).join("")}</div>`;
const msg = m => {
  const side = m.me ? "flex-end" : "flex-start";
  if (m.dots) return dots(m.me, m.op ?? 1, m.s ?? 1);
  if (m.link) return `<div style="flex:none;align-self:${side};width:13.4em;border-radius:.9em;overflow:hidden;background:#E9E9EB">${ph(m.link.img, "", 670, 330, { r: 0, inset: 4, style: "width:100%;height:6.6em" })}
      <div style="padding:.34em .6em .5em"><div style="font-size:.66em;font-weight:600;line-height:1.2;letter-spacing:-.015em">${m.link.title}</div><div style="font-size:.56em;color:#8E8E93;margin-top:.1em">${m.link.url}</div></div></div>`;
  return `<div style="flex:none;align-self:${side};position:relative;max-width:14.6em;background:${m.me ? "#0A84FF" : "#E9E9EB"};color:${m.me ? "#fff" : "#000"};border-radius:1.12em;padding:.42em .74em;line-height:1.22;letter-spacing:-.015em">${m.text}
    ${m.react ? `<div style="position:absolute;left:-.5em;top:-.5em;width:1.2em;height:1.2em;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.2);display:grid;place-items:center;font-size:.72em;font-weight:800;color:#F43034">${m.react}</div>` : ""}</div>`;
};
const thread = (msgs, top, o = {}) => `<div class="abs" style="left:60px;right:60px;${o.bottom ? `top:${top}px;bottom:${o.bottom}px;justify-content:flex-end;` : `top:${top}px;`}z-index:4;font-size:${o.fs || 52}px;display:flex;flex-direction:column;gap:.26em">
  ${msgs.map((m, i) => `${i && !!msgs[i - 1].me !== !!m.me ? `<div style="height:.12em"></div>` : ""}${msg(m)}`).join("")}
  ${o.status ? `<div style="align-self:flex-end;font-size:.52em;color:#8E8E93;margin:-.1em .3em 0 0">${o.status}</div>` : ""}</div>`;

const J1 = { me: true, text: "Before I book the flight — any service records on the Z?" };
const W2 = { text: "Motor was rebuilt. Around… 2015?" }, J2 = { me: true, text: "Around?" };
const J3 = { me: true, text: "By who?" }, W3 = { text: "Guy in Reno. He retired." };
const J4 = { me: true, text: "Got another Z to look at Sunday." };
const LINK = { link: { title: "1972 Datsun 240Z · Walt’s build", url: "fuelmybuild.com/walt-240z", img: "car-05" } };

// hook A (0–2.5 s): pure cold open, already in the thread. the contact avatar is the 240Z
add("c2-01", 0.3, `<div class="abs" style="left:360px;top:300px;z-index:3">${avc("car-05", 360)}</div>
  ${txt("Walt · 240Z", 0, 700, { size: 50, weight: 600, style: "left:0;right:0;text-align:center;letter-spacing:-.025em" })}
  ${thread([J1], 960, { fs: 66 })}`, "white", "Hook A (lead). Chris as Jay, quick: “Before I book the flight — any service records on the Z?” Jay’s blue bubble lands at frame 0 with the send whoosh (imessage-chat-flow, already open). No headline on purpose: the genre is the hook.");
add("c2-02", 1.9, `${who}${H(`Any service<br><span class="g">${R("records")}?</span>`, 360, { size: 104 })}
  ${thread([J1, { dots: true, s: 2.3 }], 640, { fs: 56, status: "Delivered" })}`, "white", "Walt’s typing dots pop in under the bubble (soft pop sfx, music bed ducks). Camera: slow 3% push on the thread. Seam into body line 1.");

// body
add("c2-03", 3.3, `${who}${H(`Stopped.<br><span class="g">Typing again.</span>`, 360, { size: 104 })}
  ${thread([J1, { dots: true, op: .2, s: 2.3 }], 640, { fs: 56, status: "Delivered" })}`, "white", "VO (Chris): “Typing… stopped. Typing again.” Dots vanish on a single frame and all sound cuts to silence on each stall (0.35 s). Dots return with a custom pulse. typing-indicator is the villain.");
add("c2-04", 5.6, `${who}${H(`${R("Around")}?`, 360, { size: 150 })}
  ${thread([J1, W2, J2], 600, { fs: 56, bottom: 440 })}`, "white", "VO: Brian (Walt, older, slow): “Motor was rebuilt. Around… 2015?” Chris, clipped: “Around?” Grey bubble eases in, the one-word reply snaps in on a fast spring (pop sfx). Slow push-in on the thread.");
add("c2-05", 9.2, `${who}${H(`Guy in Reno.<br><span class="g">He ${R("retired")}.</span>`, 340, { size: 104 })}
  ${thread([J1, W2, J2, J3, W3], 600, { fs: 54, bottom: 440 })}
  ${notif({ who: "New listing", text: "1972 240Z · “all records”", w: 920, s: 2.2, style: "position:absolute;left:80px;top:1385px;z-index:8" })}`, "white", "VO: Chris: “By who?” Brian: “Guy in Reno. He retired.” On “retired” an iOS 26 glass banner drops from the top with spring overshoot and covers Walt’s bubble (the only time the thread is covered). Notification ding.");
add("c2-06", 12.4, `${who}${H(`Got another Z<br><span class="g">Sunday.</span>`, 340, { size: 104 })}
  ${thread([J3, W3, J4, { dots: true, s: 1.6 }], 600, { fs: 56, bottom: 440 })}`, "white", "VO: Chris: “Got another Z to look at Sunday.” Then 1.2 s of dead air: Walt’s long dots, no VO, only soft room tone (the longest silence in the film, reveal silence). Camera creeps 4% toward the dots (drift).");
add("c2-07", 15.4, `${who}${H(`One ${R("link")}.`, 360, { size: 124 })}
  ${thread([J4, { text: "Hang on. Here." }, LINK], 560, { fs: 54, bottom: 440 })}${touch(380, 1290)}`, "white", "VO: Brian, steady now: “Hang on. Here.” FMB turn (15 s, 56%). The link card springs in with a rich preview, new object type in the thread. Thumb taps the card (tap sfx). The orange 240Z cutout in the preview becomes the page header next.");
add("c2-08", 18.2, `${who}${H(`May 9, 2015.<br><span class="g">Photos.</span>`, 340, { size: 104 })}
  ${device(buildPage({ hero: "car-05", title: "1972 Datsun 240Z", owner: "walt.240z", ownerCar: "car-05", meta: "Public", url: "fuelmybuild.com/walt-240z", tab: "Log", section: "Log · Engine, 2015",
    rows: [{ img: "part-04", name: "Engine rebuild", brand: "Sierra Z Works", date: "May 9, 2015", hl: true }, { img: "part-02", name: "Suspension refresh", brand: "Sierra Z Works", date: "Sep 20, 2016" }],
    sheet: logSheet({ title: "Engine rebuild", date: "May 9, 2015", by: "Sierra Z Works", byMono: "S", photos: ["engine-block", "part-04", "part-05"], h: 500,
      extra: `<div style="margin-top:12px;display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:14px;background:var(--grouped)">${ph("part-04", "", 38, 38, { r: 9, inset: 4 })}<div><div class="sh" style="font-weight:500">Carburetors</div><div class="fn sec">{brand} · 2015</div></div></div>` }) }),
    { x: 250, y: 600, w: 580 })}`, "gray", "VO: Chris, slower, reading it himself: “Rebuilt L24… May 9th, 2015… twelve photos…” push-through (shared-axis-z) from the link card into the build page in the same phone. The 240Z cutout from the preview continues as the page header. Log sheet slides up (sheet sfx); page-turn paper rustle under the VO.");
add("c2-09", 21.4, `${who}${H(`Logged<br><span class="g">by the ${R("shop")}.</span>`, 340, { size: 104 })}
  ${device(buildPage({ hero: "car-05", title: "1972 Datsun 240Z", owner: "walt.240z", ownerCar: "car-05", meta: "Public", url: "fuelmybuild.com/walt-240z", tab: "Log", section: "Log · 14 entries",
    rows: [{ img: "mech", name: "Engine rebuild", brand: "Logged by Sierra Z Works", date: "May 9, 2015" }, { img: "mech", name: "Valve adjustment", brand: "Logged by Sierra Z Works", date: "Mar 2, 2019" }, { img: "mech", name: "Brake overhaul", brand: "Logged by Sierra Z Works", date: "Oct 14, 2023" }] }), { x: 250, y: 600, w: 580 })}
  ${chip(`${ph("mech", "", 76, 76, { r: 38, inset: 0, fit: "cover" })}<span>Logged by Sierra Z Works</span>${seal(30)}`, 110, 1085, { h: 108, fs: 38, z: 9 })}`, "gray", "VO: Chris: “The Reno shop logged this?” Brian, certain: “Every visit.” Scroll reveal: three entries stack, 2015 → 2023, each stamped with the same shop and the veteran mechanic as its avatar. Soft scroll tick per row.");
add("c2-10", 23.8, `${who}${H(`${R("Deal.")}`, 360, { size: 150 })}
  ${thread([{ me: true, text: "The Reno shop logged this?" }, { text: "Every visit." }, { me: true, text: "…Deal.", react: "!!" }, { text: "Saturday?" }, { dots: true, me: true, s: 1.5 }], 600, { fs: 58, bottom: 440 })}`, "white", "VO: Chris, soft: “…Deal.” Brian: “Saturday?” Back in the thread. “Deal.” stamps in as a blue bubble with a tiny red tapback (caption-stamp energy, UI-native). Then Jay’s dots appear and hold: matches frame 0 for the loop. Thud sfx on the stamp, then silence.");
add("c2-11", 25.6, endCard("Records your buyer can open."), "white", "CTA (Brian): “Records your buyer can open: fuelmybuild.com.” Logo spring, URL in red.");

window.META = { reel: "C2", title: "Any service records?", lead: "A", voice: "Chris (Jay, buyer), Brian (Walt, seller)",
  remocn: ["imessage-chat-flow (thread, tapback)", "typing-indicator (custom pulse, single-frame vanish)", "message-bubble", "toast (as the top-drop notification banner)", "drift (4% creep on the long stall)", "shared-axis-z (link card into page)", "push-through", "caption-speaker (two-voice captions)", "caption-stamp (Deal.)"],
  newCutouts: [["engine-block", "A bare cast-iron inline-six engine block (Datsun L24) on a rolling engine stand, studio product photo on pure white, soft contact shadow, no background, 3/4 view, high detail"], ["carburetors", "A matched pair of triple side-draft carburetors with velocity stacks, studio product photo on pure white, soft contact shadow, no background, 3/4 view"]] };
