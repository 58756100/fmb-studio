// All screens are 402 x 874 pt, iOS 26 metrics.
const tabbar = (on = 0) => `<div class="tabbar glass">${[["house", "Garage"], ["docs", "Log"], ["search", "Explore"], ["person", "Profile"]].map(([i, t], k) =>
  `<div class="${k === on ? "on" : ""}">${ic(i, 24, k === on ? "#F43034" : "#000", 1.8)}<span>${t}</span></div>`).join("")}</div>`;

// ---------- lock screen with comment notifications ----------
const scrLock = (n = 3, more = "") => {
  const items = [
    ["drift.dev", "what turbo is that?? 👀", "now"], ["k.yamada", "who makes those wheels", "1m"], ["boostedbri", "coilover brand? need these", "2m"],
    ["rx_ryan", "link to the intake pls", "4m"], ["j.moss", "is that the 3076 or the 3582", "6m"]].slice(0, n);
  const s = 1;
  return `<div class="ios" style="background:#111">
    ${ph("img 01", "lock screen wallpaper — ’99 Supra in a dark garage, single overhead light, moody", 402, 874, { r: 0, style: "--a:#3A3A3E;--b:#141416;position:absolute;inset:0", nolabel: true, dark: 1 })}
    ${statusBar(true)}
    <div style="position:absolute;top:96px;left:0;right:0;text-align:center;color:rgba(255,255,255,.92)">
      <div style="font-size:19px;font-weight:600">Saturday, October 10</div>
      <div style="font-size:96px;font-weight:700;letter-spacing:-.04em;line-height:1;margin-top:2px;font-variation-settings:'opsz' 32">9:41</div></div>
    <div style="position:absolute;left:10px;right:10px;bottom:${more ? 128 : 110}px;display:flex;flex-direction:column;gap:8px">
      ${items.map(([w, t, tm], i) => `<div class="glass dk" style="border-radius:26px;padding:12px 14px;display:flex;gap:11px;align-items:center;color:#fff">
        ${av("a0" + (i + 1), 38, "builder portrait")}<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600"><span>${w}</span><span style="font-weight:400;opacity:.6;font-size:13px">${tm}</span></div>
        <div style="font-size:15px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.92">commented: ${t}</div></div></div>`).join("")}
      ${more ? `<div style="text-align:center;color:rgba(255,255,255,.7);font-size:13px;font-weight:600;margin-top:4px">${more}</div>` : ""}
    </div>
    <div style="position:absolute;bottom:44px;left:44px;right:44px;display:flex;justify-content:space-between">
      <div class="glass dk gbtn" style="width:50px;height:50px;border-radius:25px">${ic("flash", 22, "#fff", 1.8)}</div>
      <div class="glass dk gbtn" style="width:50px;height:50px;border-radius:25px">${ic("camera", 22, "#fff", 1.8)}</div></div>
  </div>`;
};

// ---------- build page (Parts tab) ----------
const partRow = (img, name, brand, date, yours, desc) => `<div class="row" style="--ins:72px;min-height:68px">
  ${ph(img, desc, 44, 44, { r: 10 })}
  <div class="main"><div class="body" style="font-weight:500">${name}</div>
  <div class="sh" style="display:flex;align-items:center;gap:4px;margin-top:1px;color:${yours ? "#F43034" : "rgba(60,60,67,.6)"}">${yours ? seal(14) : ""}${brand}<span class="sec"> · ${date}</span></div></div>
  ${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`;
const scrBuild = (sheet = "") => `<div class="ios grouped">
  ${ph("img 02", "’99 Supra, front three-quarter, wet garage floor, dusk", 402, 286, { r: 0, style: "position:absolute;top:0;left:0", fs: 12 })}
  ${statusBar(false)}
  <div class="navbtns"><div class="gbtn glass">${ic("chevL", 20, "#000", 2.2)}</div><div style="display:flex;gap:10px"><div class="gbtn glass">${ic("share", 20, "#000", 1.9)}</div><div class="gbtn glass">${ic("ellipsis", 20, "#000")}</div></div></div>
  <div style="position:absolute;top:262px;left:0;right:0;bottom:0;background:var(--grouped);border-radius:28px 28px 0 0;padding-top:20px">
    <div style="padding:0 20px"><div class="lt">’99 Supra</div>
      <div class="sh sec" style="display:flex;align-items:center;gap:7px;margin-top:4px">${av("a01", 22)}<span><b style="color:#000;font-weight:600">s14.jay</b> · 212 entries · Public</span></div>
      <div class="seg" style="margin-top:16px"><span>Overview</span><span class="on">Parts</span><span>Log</span><span>Media</span></div></div>
    <div class="hdr" style="margin-top:20px">Installed · 37 parts</div>
    <div class="list">
      ${partRow("img 03", "Turbo kit", "Your Brand", "Mar 12", 1, "turbo kit on a workbench, studio light")}
      ${partRow("img 04", "Coilovers", "Northline", "Mar 28", 0, "coilovers boxed, top view")}
      ${partRow("img 05", "18-inch wheels", "Your Brand", "Apr 3", 1, "bronze 18-inch wheel close-up")}
      ${partRow("img 06", "Intake", "Kessler", "Apr 19", 0, "intake pipe installed, engine bay")}
    </div></div>
  ${tabbar(0)}${sheet}</div>`;

// add-part sheet
const sheetAddPart = () => `<div style="position:absolute;inset:0;background:rgba(0,0,0,.30);z-index:27"></div>
  <div class="sheet" style="height:560px"><div class="grab"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0">
    <div class="gbtn" style="background:var(--fill)">${ic("x", 18, "#000", 2.2)}</div><div class="hl">Log part</div><div class="gbtn" style="background:var(--red)">${ic("check", 20, "#fff", 2.6)}</div></div>
  <div style="padding:18px 16px 0;display:flex;flex-direction:column;gap:10px">
    <div class="field"><span class="sec" style="width:64px">Part</span><span>Exhaust</span></div>
    <div class="field" style="box-shadow:0 0 0 2px var(--red);background:#fff"><span class="sec" style="width:64px">Brand</span><span>Your Bra</span><span style="width:2px;height:22px;background:var(--red);border-radius:1px;margin-left:-6px"></span></div>
    <div style="background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.10),0 0 0 .5px rgba(0,0,0,.06);overflow:hidden">
      <div class="row" style="min-height:58px;background:var(--red-soft)">${av("a10", 34, "brand logo mark, simple")}<div class="main"><div style="display:flex;align-items:center;gap:5px;font-weight:600">Your Brand ${seal(16)}</div><div class="fn sec">Verified supplier · 41 parts</div></div>${ic("check", 18, "#F43034", 2.4)}</div>
      <div class="row" style="min-height:52px">${av("a11", 34)}<div class="main"><div>Yourbrand Racing</div><div class="fn sec">12 builds</div></div></div></div>
    <div class="field" style="justify-content:space-between"><span class="sec">Installed</span><span>Today</span></div>
    <div style="display:flex;gap:8px;margin-top:2px">${ph("img 07", "exhaust tip close-up", 84, 84, { r: 14 })}${ph("img 08", "exhaust under car", 84, 84, { r: 14 })}${ph("img 09", "rear three-quarter", 84, 84, { r: 14 })}
      <div style="width:84px;height:84px;border-radius:14px;background:var(--fill);display:grid;place-items:center">${ic("camera", 26, "#000", 1.7)}</div></div>
  </div></div>`;

// ---------- supplier page ----------
const scrSupplier = () => `<div class="ios">
  ${ph("img 10", "supplier cover — product lineup on a dark bench, soft top light", 402, 214, { r: 0, style: "position:absolute;top:0;left:0;--pad:16px", fs: 12, nolabel: 1 })}
  ${statusBar(false)}
  <div class="navbtns"><div class="gbtn glass">${ic("chevL", 20, "#000", 2.2)}</div><div class="gbtn glass">${ic("share", 20, "#000", 1.9)}</div></div>
  <div style="position:absolute;top:168px;left:20px;width:92px;height:92px;border-radius:24px;background:#fff;padding:5px;box-shadow:0 6px 20px rgba(0,0,0,.12)">${ph("img 11", "brand logo", 82, 82, { r: 19 })}</div>
  <div style="position:absolute;top:272px;left:20px;right:20px">
    <div style="display:flex;align-items:center;gap:8px"><span style="font-size:28px;font-weight:700;letter-spacing:-.025em">Your Brand</span>${seal(24)}</div>
    <div class="sh sec" style="margin-top:2px">Performance parts · Verified supplier</div>
    <div style="display:flex;margin-top:16px;gap:0">${[["312", "Builds"], ["41", "Parts"], ["14", "Countries"]].map(([n, l], i) => `<div style="flex:1;${i ? "border-left:.5px solid var(--sep);padding-left:14px" : ""}"><div style="font-size:22px;font-weight:700;letter-spacing:-.02em">${n}</div><div class="fn sec">${l}</div></div>`).join("")}</div>
    <div style="display:flex;gap:10px;margin-top:18px"><div class="pillbtn fill" style="flex:1">${ic("storefront", 20, "#fff", 1.9)} Visit store</div><div class="pillbtn gray" style="flex:1">Follow</div></div>
    <div class="seg" style="margin-top:18px"><span class="on">Builds</span><span>Parts</span><span>About</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
      ${[["img 12", "’04 WRX STI", "Turbo kit"], ["img 13", "’72 240Z", "18-inch wheels"], ["img 14", "’18 Tacoma", "Turbo kit"], ["img 15", "’92 NSX", "Exhaust"]].map(([im, n, p]) => `<div>${ph(im, n + " build, outdoor", 176, 132, { r: 16, nolabel: true })}<div class="sh" style="font-weight:600;margin-top:6px">${n}</div><div class="fn sec">${p}</div></div>`).join("")}
    </div></div></div>`;

// ---------- comments sheet ----------
const comment = (a, who, t, text, likes, hl = false) => `<div style="display:flex;gap:10px;padding:10px 16px;${hl ? "background:var(--red-soft);" : ""}">
  ${av(a, 34)}<div style="flex:1;min-width:0"><div class="fn"><b style="font-weight:600">${who}</b> <span class="sec">${t}</span></div><div class="sh" style="margin-top:1px">${text}</div><div class="fn sec" style="margin-top:4px;font-weight:500">Reply</div></div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:2px">${ic("heart", 16, "rgba(60,60,67,.45)", 1.8)}<span class="c1 sec">${likes}</span></div></div>`;
const scrComments = () => `<div class="ios" style="background:#000">
  ${ph("img 16", "post photo — ’99 Supra rolling shot, motion blur background", 402, 520, { r: 0, style: "position:absolute;top:0;left:0;--a:#4A4A4E;--b:#1C1C1E", nolabel: true, dark: 1 })}
  ${statusBar(true)}
  <div class="sheet" style="height:640px;left:0;right:0;bottom:0;border-radius:38px 38px 0 0"><div class="grab"></div>
    <div style="text-align:center;padding:12px 0 10px" class="hl">214 comments</div>
    <div style="height:.5px;background:var(--sep)"></div>
    ${comment("a02", "m.kado", "2d", "clean 🔥", "48")}
    ${comment("a03", "boostedbri", "2d", "specs??", "12")}
    ${comment("a04", "drift.dev", "2d", "what turbo is that?? 👀", "96", true)}
    ${comment("a05", "k.yamada", "1d", "sound clip pls", "7")}
    ${comment("a06", "rx_ryan", "1d", "which kit is this, need it for my build", "3")}
    ${comment("a07", "j.moss", "22h", "link?", "1")}
    <div style="position:absolute;left:12px;right:12px;bottom:30px;height:48px;border-radius:24px;display:flex;align-items:center;gap:10px;padding:0 8px 0 6px" class="glass">${av("a08", 36)}<span class="sec">Add a comment…</span></div>
  </div></div>`;

// ---------- story expired ----------
const scrStory = () => `<div class="ios" style="background:#000;color:#fff">
  ${ph("img 17", "story — turbo kit in the passenger seat, phone flash", 402, 874, { r: 0, style: "position:absolute;inset:0;--a:#3C3C40;--b:#121214;opacity:.35", nolabel: true, dark: 1 })}
  ${statusBar(true)}
  <div style="position:absolute;top:58px;left:10px;right:10px;display:flex;gap:4px">${[1, 1, .0].map(f => `<i style="flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden;display:block"><b style="display:block;height:100%;width:${f * 100}%;background:#fff"></b></i>`).join("")}</div>
  <div style="position:absolute;top:72px;left:14px;display:flex;align-items:center;gap:8px">${av("a01", 32)}<b class="sh">s14.jay</b><span class="sh" style="opacity:.6">23h</span></div>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center">
    <div style="width:84px;height:84px;margin:0 auto;border-radius:42px;display:grid;place-items:center" class="glass dk">${ic("clock", 40, "#fff", 1.7)}</div>
    <div class="t3" style="margin-top:18px">This story has expired</div>
    <div class="sh" style="opacity:.6;margin-top:6px;line-height:1.4">Stories disappear after 24 hours.<br>So did the turbo it showed.</div></div>
  <div style="position:absolute;left:12px;right:12px;bottom:30px;height:48px;border-radius:24px;display:flex;align-items:center;padding:0 18px;opacity:.5" class="glass dk"><span class="sh">Send message</span></div>
</div>`;

// ---------- forum thread in Safari ----------
const scrThread = () => `<div class="ios" style="background:#fff">
  ${statusBar(false)}
  <div style="position:absolute;top:60px;left:16px;right:16px">
    <div class="fn sec">Forums › Forced induction › Page 47 of 52</div>
    <div style="font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:8px;line-height:1.2">Re: Re: Re: what turbo on the white supra?</div>
    <div class="fn sec" style="margin-top:6px">Last reply 3 years ago · 1,204 replies</div>
    ${[0, 1, 2].map(i => `<div style="margin-top:22px;display:flex;gap:10px">${av("a1" + (i + 2), 30)}<div style="flex:1"><div class="fn"><b style="font-weight:600">${["supra_tt", "midnightwrx", "boost_or_bust"][i]}</b> <span class="sec">${["Mar 2022", "Mar 2022", "Apr 2022"][i]}</span></div>
      <div class="sh" style="margin-top:4px;line-height:1.4;color:#3a3a3c">${["pretty sure it’s the one from the guy in the earlier thread, check page 12", "pics are broken now, can someone repost", "dm’d him, never heard back"][i]}</div></div></div>`).join("")}
    <div style="margin-top:22px;height:150px;border-radius:12px;border:1px dashed rgba(60,60,67,.25);display:grid;place-items:center;color:rgba(60,60,67,.45)" class="fn">${ic("photo", 28, "rgba(60,60,67,.35)", 1.5)}</div>
  </div>
  <div style="position:absolute;left:12px;right:12px;bottom:28px;height:50px;border-radius:25px;display:flex;align-items:center;gap:8px;padding:0 16px" class="glass">${ic("chevL", 18, "#000", 2.2)}<div style="flex:1;text-align:center" class="sh">forums › page 47</div>${ic("ellipsis", 18)}</div>
</div>`;

// ---------- search ----------
const scrSearch = (q = "who makes that turbo") => `<div class="ios grouped">
  ${statusBar(false)}
  <div style="position:absolute;top:62px;left:20px" class="lt">Explore</div>
  <div style="position:absolute;top:122px;left:16px;right:16px">
    <div class="hdr" style="padding:0 16px 7px">Top hit</div>
    <div class="list" style="margin:0;padding:16px;display:flex;align-items:center;gap:12px;box-shadow:0 0 0 2px var(--red)">
      ${ph("img 11", "brand logo", 60, 60, { r: 16 })}<div style="flex:1"><div style="display:flex;align-items:center;gap:6px" class="t3">Your Brand ${seal(20)}</div><div class="sh sec">Supplier · on 312 builds</div></div>
      <div class="pillbtn fill" style="height:36px;padding:0 16px;font-size:15px">View</div></div>
    <div class="hdr" style="padding:20px 16px 7px">Builds running it</div>
    <div class="list" style="margin:0">
      ${[["img 02", "’99 Supra", "s14.jay"], ["img 12", "’04 WRX STI", "boostedbri"], ["img 14", "’18 Tacoma", "k.yamada"], ["img 13", "’72 240Z", "midnightwrx"]].map(([im, n, w]) => `<div class="row" style="--ins:88px;min-height:70px">${ph(im, n, 60, 46, { r: 10 })}<div class="main"><div style="font-weight:500">${n}</div><div class="fn sec">${w} · Turbo kit</div></div>${ic("chevR", 14, "rgba(60,60,67,.3)", 2.4)}</div>`).join("")}
    </div></div>
  <div style="position:absolute;left:16px;right:16px;bottom:26px;height:54px;border-radius:27px;display:flex;align-items:center;gap:10px;padding:0 18px;z-index:26" class="glass">${ic("search", 20, "rgba(60,60,67,.6)", 2)}<span>${q}</span>
    <span style="margin-left:auto;width:22px;height:22px;border-radius:11px;background:rgba(60,60,67,.3);display:grid;place-items:center">${ic("x", 12, "#fff", 3)}</span></div>
</div>`;

// ---------- setup (done for you) ----------
const scrSetup = () => `<div class="ios grouped">
  ${statusBar(false)}
  <div style="position:absolute;top:96px;left:0;right:0;text-align:center">
    <div style="width:84px;height:84px;margin:0 auto;border-radius:20px;background:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.08)">${mark(52)}</div>
    <div style="font-size:28px;font-weight:700;letter-spacing:-.025em;margin-top:20px">Setting up your page</div>
    <div class="sh sec" style="margin-top:6px;padding:0 40px;line-height:1.4">The FuelMyBuild team is doing this for you.<br>Nothing to fill in.</div></div>
  <div class="list" style="position:absolute;top:330px;left:0;right:0">
    ${[["Supplier page created", 1, "storefront"], ["Logo, links and story added", 1, "photo"], ["Catalog imported · 41 parts", 1, "tag"], ["Builds linked · 312", 1, "link"], ["Going live", 0, "globe"]].map(([t, d, i]) => `<div class="row" style="--ins:56px;min-height:58px">
      <div style="width:30px;display:grid;place-items:center">${ic(i, 22, d ? "#000" : "rgba(60,60,67,.45)", 1.8)}</div><div class="main" style="${d ? "" : "color:rgba(60,60,67,.6)"}">${t}</div>
      ${d ? checkCircle(24) : `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="rgba(120,120,128,.2)" stroke-width="3"/><path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" fill="none" stroke="#F43034" stroke-width="3" stroke-linecap="round"/></svg>`}</div>`).join("")}
  </div>
  <div style="position:absolute;top:660px;left:0;right:0;text-align:center"><div class="fn sec">Your time spent</div><div style="font-size:48px;font-weight:700;letter-spacing:-.03em;font-variation-settings:'opsz' 32">0 min</div></div>
</div>`;
