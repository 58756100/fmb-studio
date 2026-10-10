// G3 · Any update on my car? — storyboard key frames (lead hook C, relatable). Times are from the beat sheet; the build retimes to words.json.
// Spine: a buzz counter chip (red while climbing, grey at 9) in the headline band + a wall clock top right. Each tick has its own buzz sfx and a 2-frame phone shake.
const buzz = (n, state = "red") => chip(`<span style="color:var(--label2);font-weight:500">Buzz</span><span style="font-variant-numeric:tabular-nums;color:${state === "red" ? "#F43034" : "#AEAEB2"}">${n}</span>`, 0, 210, { h: 92, fs: 44, style: "left:50%;transform:translateX(-50%)" });
const topChat = (o) => chat(o).replace("justify-content:flex-end", "justify-content:flex-start");
// wall clock drawn in CSS (new cutout requested)
const wallClock = (x, y, s, h, m) => `<div class="abs" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:#fff;border:${s * .05}px solid #1D1D1F;box-shadow:0 24px 40px -18px rgba(0,0,0,.3);z-index:6">
  ${[...Array(12)].map((_, i) => `<div style="position:absolute;left:50%;top:6%;width:${s * (i % 3 ? .012 : .022)}px;height:${s * (i % 3 ? .06 : .09)}px;margin-left:${-s * .006}px;background:#1D1D1F;transform-origin:50% ${s * .44}px;transform:rotate(${i * 30}deg)"></div>`).join("")}
  <div style="position:absolute;left:50%;top:50%;width:${s * .03}px;height:${s * .27}px;margin-left:${-s * .015}px;margin-top:${-s * .27}px;background:#1D1D1F;border-radius:4px;transform-origin:50% 100%;transform:rotate(${(h % 12) * 30 + m * .5}deg)"></div>
  <div style="position:absolute;left:50%;top:50%;width:${s * .02}px;height:${s * .38}px;margin-left:${-s * .01}px;margin-top:${-s * .38}px;background:#F43034;border-radius:4px;transform-origin:50% 100%;transform:rotate(${m * 6}deg)"></div>
  <div style="position:absolute;left:50%;top:50%;width:${s * .07}px;height:${s * .07}px;margin:${-s * .035}px;border-radius:50%;background:#1D1D1F"></div></div>`;
const clockLbl = (x, y, t) => txt(t, x, y, { size: 34, weight: 600, color: "#86868B", style: "font-variant-numeric:tabular-nums;text-align:center;width:160px" });
const clk = (h, m, t) => `${wallClock(850, 130, 160, h, m)}${clockLbl(850, 300, t)}`;
// bench top view with a face-down phone (shared by the hook and the loop frame so the two match exactly)
const bench = (o = {}) => `<div class="abs" style="left:-20px;right:-20px;top:1000px;height:600px;background:linear-gradient(180deg,#fff,#F1F1F4);border-top:2px solid #E5E5EA;box-shadow:0 -30px 60px -40px rgba(0,0,0,.2);z-index:1"></div>
  <div class="abs" style="left:400px;top:1060px;width:280px;height:540px;z-index:5;transform:rotate(-7deg)">
    <div style="position:absolute;inset:0;border-radius:52px;background:linear-gradient(160deg,#4A4A4E,#2C2C2E);box-shadow:0 30px 50px -20px rgba(0,0,0,.5)"></div>
    <div style="position:absolute;left:22px;top:22px;width:104px;height:104px;border-radius:30px;background:#1D1D1F;box-shadow:inset 0 0 0 3px rgba(255,255,255,.12)"><div style="position:absolute;left:14px;top:14px;width:34px;height:34px;border-radius:50%;background:#0B0B0C;box-shadow:0 0 0 3px #3A3A3C"></div><div style="position:absolute;left:56px;top:56px;width:34px;height:34px;border-radius:50%;background:#0B0B0C;box-shadow:0 0 0 3px #3A3A3C"></div></div></div>
  ${[[-1, 0], [1, 0]].map(([d]) => [0, 1, 2].map(i => `<div class="abs" style="left:${d < 0 ? 330 - i * 34 : 690 + i * 34}px;top:${1230 - i * 8}px;width:14px;height:${160 + i * 40}px;border-radius:8px;border-${d < 0 ? "left" : "right"}:8px solid rgba(29,29,31,${.5 - i * .14});z-index:5"></div>`).join("")).join("")}
  ${o.sticky ? "" : ""}`;
const glove = (x, y) => `<div class="abs" style="left:${x}px;top:${y}px;z-index:7;width:520px;height:300px;opacity:.88;filter:blur(1px)">
  <div style="position:absolute;left:150px;top:90px;width:420px;height:120px;border-radius:60px;background:#2C2C2E;transform:rotate(-10deg)"></div>
  <div style="position:absolute;left:30px;top:50px;width:210px;height:170px;border-radius:70px 50px 50px 80px;background:#3A3A3C;transform:rotate(-10deg)"></div>
  ${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:${-30 + i * 6}px;top:${40 + i * 40}px;width:110px;height:38px;border-radius:19px;background:#3A3A3C;transform:rotate(${-12 + i * 5}deg)"></div>`).join("")}</div>`;
// garage list (custom)
const garageScreen = () => `<div class="ios grouped">${statusBar(false)}
  <div style="position:absolute;top:104px;left:20px;right:20px"><div class="lt">Garage</div><div class="sh sec" style="display:flex;align-items:center;gap:8px;margin-top:6px">${avm("R", 24)}<b style="color:#000;font-weight:600">Rita’s Shop</b> · 3 on the lift today</div></div>
  <div class="list" style="position:absolute;top:230px;left:0;right:0">
    ${[["car-09", "Red Miata", "Brakes · logged 11:42", true], ["car-10", "Yellow Civic EG", "Clutch · logged 11:48", false], ["car-06", "Grey Tacoma", "Brake job · in progress", false]].map(([c, n, s, h]) => `<div class="row" style="--ins:84px;min-height:92px;${h ? "background:var(--red-soft);" : ""}">${avc(c, 60)}<div class="main"><div class="body" style="font-weight:600">${n}</div><div class="sh sec">${s}</div></div>${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`).join("")}</div>
  ${tabbar(0)}</div>`;
// new log entry sheet (custom): photo, auto date, Post
const entryScreen = () => `<div class="ios grouped">${statusBar(false)}
  <div style="position:absolute;top:66px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:17px;color:var(--label2)">Cancel</span><span class="hl">New log entry</span><div class="pillbtn fill" style="height:36px;padding:0 16px;font-size:16px">Post</div></div>
  <div class="list" style="position:absolute;top:140px;left:0;right:0">
    <div class="row" style="min-height:60px"><div class="main"><div class="body" style="font-weight:500">Part arrived${caret}</div></div></div>
    <div class="row" style="min-height:52px">${ic("calendar", 20, "rgba(60,60,67,.6)", 2)}<div class="main"><div class="body">Today · 11:42 am</div></div><span class="badge">Auto</span></div>
    <div class="row" style="min-height:52px">${avc("car-09", 28)}<div class="main"><div class="body">Red Miata</div></div></div></div>
  <div style="position:absolute;top:400px;left:16px;right:16px;display:flex;gap:10px">${ph("part-07", "", 150, 150, { r: 18, inset: 6 })}<div style="width:150px;height:150px;border-radius:18px;border:2px dashed rgba(60,60,67,.3);display:grid;place-items:center">${ic("camera", 34, "rgba(60,60,67,.5)", 1.7)}</div></div></div>`;

// ---- hook C (0–2.5 s): the interruption is the bridge into body line 1
add("g3-01", 0.5, `${buzz(1)}${clk(10, 20, "10:20")}${H(`You own the shop.<br><span class="g">And the phone.</span>`, 360, { size: 92 })}
  ${cut("car-06", { x: 160, y: 640, w: 760, op: .55, filter: "blur(5px)" })}${bench()}${glove(640, 1120)}`, "studio", "Hook C (lead). VO (Rita, new female voice): “I’m under a Tacoma, brake fluid to my elbows, and—” On screen the ‘POV’ line is rewritten in sentence case (no all-caps). A gloved hand slides in from the right for the buzzing phone (buzz sfx, 2-frame shake); counter pops to 1. Customer cuts her off on the beat.");

// ---- body
add("g3-02", 3.6, `${buzz(4)}${clk(10, 31, "10:31")}${H(`Still on<br><span class="g">the lift.</span>`, 360, { size: 96 })}
  ${device(topChat({ name: "Miata guy", avatar: "car-09", msgs: [{ text: "Quick one — any update?" }, { me: true, text: "Still on the lift." }] }), { x: 290, y: 640, w: 500 })}
  ${cut("car-06", { x: 60, y: 1380, w: 420, op: .5, filter: "blur(4px)" })}`, "studio", "VO (Chris, Miata guy): “Quick one — any update?” Rita: “Still on the lift.” imessage-chat-flow pops over the bench. Counter rolls 3 -> 4 with a buzz sfx; wall clock 10:31.");
add("g3-03", 6.6, `${buzz(5)}${clk(10, 48, "10:48")}${H(`Different<br><span class="g">car.</span>`, 360, { size: 96 })}
  ${device(topChat({ name: "Miata guy", avatar: "car-09", msgs: [{ me: true, text: "Still on the lift." }] }), { x: 70, y: 700, w: 440, rot: "rotate(-5deg)", z: "opacity:.6;" })}
  ${device(topChat({ name: "Civic customer", avatar: "car-10", msgs: [{ text: "The Civic — any update?" }, { me: true, text: "Waiting on a part." }] }), { x: 400, y: 650, w: 500 })}`, "studio", "VO: Civic customer: “The Civic — any update?” Rita: “Waiting on a part.” A new thread slides over the first as a stacked glass card (stack depth = overload). Counter 5, clock 10:48. Tacoma behind: one wheel off.");
add("g3-04", 9.6, `${buzz(7)}${clk(11, 0, "11:00")}${H(`Eleven<br><span class="g">minutes.</span>`, 360, { size: 96 })}
  <div class="abs" style="left:90px;top:590px;z-index:20;transform:scale(.9)">${notif({ who: "Civic customer", text: "Any update?", w: 900, s: 1.8 })}</div>
  <div class="abs" style="left:90px;top:640px;z-index:21;transform:scale(.95)">${notif({ who: "Tacoma owner", text: "Hey, how’s it going?", w: 900, s: 1.8 })}</div>
  <div class="abs" style="left:90px;top:690px;z-index:22">${notif({ who: "Miata guy", text: "Did the part come?", w: 900, s: 1.8 })}</div>
  ${device(topChat({ name: "Miata guy", avatar: "car-09", msgs: [{ text: "Did the part come?" }, { me: true, text: "It’s been eleven minutes." }] }), { x: 320, y: 880, w: 440 })}`, "studio", "VO: Miata guy: “Did the part come?” Rita: “It’s been eleven minutes.” Miata thread back on top, two buzzes stacked (counter 6 -> 7), notification stack grows to three. Comic deadpan.");
add("g3-05", 12.6, `${buzz(7)}${H(`Due at 3.`, 360, { size: 110 })}
  ${wallClock(660, 640, 330, 11, 31)}${txt("11:31", 660, 990, { size: 44, weight: 600, color: "#86868B", w: 330, style: "text-align:center;font-variant-numeric:tabular-nums" })}
  ${lift2()}${cut("car-06", { x: 70, y: 980, w: 640 })}
  <div class="abs" style="left:100px;top:760px;width:260px;height:230px;background:#FFF3A8;border-radius:6px;transform:rotate(-4deg);box-shadow:0 20px 30px -14px rgba(0,0,0,.3);z-index:7;padding:30px;font-size:46px;font-weight:600;letter-spacing:-.03em;line-height:1.1;color:#3A3A3C">Due<br>3 pm</div>`, "studio", "VO (Rita): “That Tacoma hasn’t moved in an hour.” Camera pulls back from the phone to the one wide shot: wall clock rolls 10:31 -> 11:31 (tick sfx), Tacoma still wheel-off on the lift, ‘Due 3 pm’ sticky note slaps on (paper sfx).");
add("g3-06", 14.9, `${buzz(8)}${clk(11, 31, "11:31")}${H(`Watch <span class="r">this.</span>`, 360, { size: 110 })}
  ${device(topChat({ name: "Civic customer", avatar: "car-10", msgs: [{ text: "Any update on the Civic?" }, { me: true, text: "Waiting on a part." }, { text: "Still no part?" }, { me: true, text: "Not yet." }, { text: "Last one—" }], draft: "No. Watch this." }), { x: 220, y: 600, w: 600 })}${glove(640, 1250)}`, "studio", "VO: Civic customer: “Last one—” Rita: “No. Watch this.” Buzz 8. Her hand flips the phone face-up and the camera pushes into the screen (push-through). 0.2 s breath before ‘Watch this’.");
add("g3-07", 17.2, `${buzz(8)}${H(`Every car,<br><span class="g">its own page.</span>`, 360, { size: 96 })}
  ${device(garageScreen(), { x: 20, y: 640, w: 500 })}${device(entryScreen(), { x: 560, y: 700, w: 500 })}${cursor(280, 880)}`, "gray", "FMB turn (15.5 s, 57 %). VO (Rita): “Every car gets a page. I post as I work.” Shop garage view with Tacoma, Miata, Civic as car-avatar rows. simulated-cursor taps Miata -> Add log entry; photo of the part box, ‘Part arrived · 11:42’ auto-dated, Post (tap sfx). Same for the Civic. Label ‘progress page’ is (confirm); built from live features (public build page + dated log entries with photos).");
add("g3-08", 19.8, `${buzz(8)}${H(`Sent.`, 360, { size: 110 })}
  ${[["Miata guy", "car-09", "Red Miata", "miata", 0, 700], ["Civic customer", "car-10", "Yellow Civic EG", "civic", 360, 770], ["Tacoma owner", "car-06", "Grey Tacoma", "tacoma", 720, 840]].map(([n, a, t, u, x, y]) => device(topChat({ name: n, avatar: a, msgs: [{ me: true, link: { title: t + " · Rita’s Shop", url: `fuelmybuild.com/rita-shop/${u}`, img: a } }] }), { x, y, w: 360 })).join("")}`, "studio", "VO (Rita): “Link. Link. Link.” 0.4 s of silence first. Three share sheets fire on the beat, each with a whoosh; whip-pan between the threads, each landing on a link preview with its car cutout (fuelmybuild.com/rita-shop/miata, /civic, /tacoma).");
add("g3-09", 22.2, `${buzz(9, "grey")}${H(`No rush.`, 360, { size: 110 })}
  <div class="abs" style="left:90px;top:560px;z-index:20">${notif({ who: "Tacoma owner", text: "Oh nice, pads are on. No rush.", w: 900, s: 1.8 })}</div>
  ${device(buildPage({ hero: "car-06", title: "Grey Tacoma", owner: "rita-shop", ownerCar: "car-06", meta: "6 entries · Public", url: "fuelmybuild.com/rita-shop/tacoma", tab: "Log", section: "Log · newest first",
    rows: [{ img: "part-06", name: "Front pads on", brand: "Logged by Rita’s Shop", date: "Today 2:14", hl: true, red: true }, { img: "part-06", name: "Caliper off", brand: "Logged by Rita’s Shop", date: "Today 11:20" }] }), { x: 290, y: 720, w: 500 })}`, "gray", "VO (Chris, Tacoma owner): “Oh nice, pads are on. No rush.” Buzz 9 is a happy one: the counter turns from red to grey, his link opens on a fresh photo of the pads. Then ALL sound drops to room tone for the silence beat.");
add("g3-10", 24.0, `${buzz(9, "grey")}${H(`Done.<br><span class="g">2:51.</span>`, 360, { size: 100 })}
  ${wallClock(380, 700, 320, 2, 51)}${txt("2:51", 380, 1040, { size: 46, weight: 600, color: "#86868B", w: 320, style: "text-align:center;font-variant-numeric:tabular-nums" })}
  ${cut("car-06", { x: 120, y: 1130, w: 840 })}`, "studio", "VO (Rita): “Done. Two fifty-one.” The wall clock jumps to 2:51 (hard tick), the Tacoma lowers onto its wheels on a soft spring (thud), wheel back on. 0.3 s of room tone, then the sting.");
add("g3-11", 25.2, `${buzz(1)}${clk(2, 51, "2:51")}${H(`My brakes<br><span class="g">next?</span>`, 360, { size: 96 })}
  ${cut("car-06", { x: 160, y: 640, w: 760, op: .55, filter: "blur(5px)" })}${bench()}`, "studio", "Loop. VO (Chris): “My brakes next?” One final buzz: the phone shakes on the bench exactly as in g3-01 (same position, scale, shadow, buzz arcs) minus the hand. Cut to the end card.");
add("g3-12", 26.4, endCard("Give every car a page."), "white", "CTA (Rita): “Give every car a page. fuelmybuild.com.”");

function lift2() { return `<div class="abs" style="left:50px;top:1335px;width:700px;height:20px;border-radius:10px;background:#C9C9CF;z-index:1"></div><div class="abs" style="left:80px;top:1335px;width:60px;height:300px;border-radius:12px;background:linear-gradient(90deg,#D9D9DE,#ECECEF);z-index:1"></div><div class="abs" style="left:600px;top:1335px;width:60px;height:300px;border-radius:12px;background:linear-gradient(90deg,#D9D9DE,#ECECEF);z-index:1"></div>`; }

window.META = { reel: "G3", title: "Any update on my car?", lead: "C", voice: "Rita (Emma, female), customers (Chris)",
  remocn: ["imessage-chat-flow (signature: stacking threads)", "rolling-number (buzz counter)", "number-wheel (wall clock)", "toast (notification stack)", "push-through (into the phone)", "simulated-cursor (garage tap)", "whip-pan (triple link)"],
  newCutouts: [["wall-clock", "A round white wall clock with black frame, black hour hand and red second hand, studio product photo on pure white, no background, soft contact shadow, front view"], ["phone-face-down", "A smartphone lying face-down on a white bench top view, camera bump visible, studio product photo on pure white, soft contact shadow"], ["work-glove", "A black mechanic work glove reaching in, studio product photo on pure white, no background, soft contact shadow"], ["sticky-note-due", "A yellow sticky note reading Due 3 pm stuck on a steel lift post, studio product photo on pure white, no background, soft contact shadow"], ["car-lift", "A two-post hydraulic car lift, minimal industrial grey, arms extended, empty, studio product photo on pure white, no background, soft contact shadow, side view"]] };
