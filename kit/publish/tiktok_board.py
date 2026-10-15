#!/usr/bin/env python3
"""Build the TikTok caption board: one phone page, one card per inbox draft, in send order.

usage:
  python3 kit/publish/tiktok_board.py --date 2026-10-26
      [--queue state/queue.json] [--out out/tiktok-board/<date>/index.html] [--no-fetch]

For the TikTok items in the queue on that date (status approved, drafted or posted) it writes a
single self-contained HTML file (thumbnails inlined as base64 JPEG) that follows the Artifact page
contract, ready to publish at the board's fixed artifact URL.

Per item it uses, first match wins:
  caption       item["caption"] -> the script's IG / TikTok caption (scripts/captions.py)
  title         item["title"] -> the script's H1 (minus the concept code) -> item["yt_title"] -> concept
  opening line  item["opening_line"] -> the script's hook table row for item["hook"]
                ("Voice line"/"Spoken" column, else the first quoted words "On screen")
  script        item["script"] -> weeks/<week>/scripts/<concept>.md -> weeks/<week>/**/<concept>.md
                -> weeks/**/<concept>.md
  send order    item["slot"] if set, else time_et, then queue order. Drafts 1-5 are wave 1 and
                6-10 wave 2 unless the item has "wave".
  thumbnail     first frame of item["render"] ("renders:<path>") from origin/renders, 240 px wide.

Prints one line per card to stdout and warnings to stderr. Exit 0 when the page was written,
3 when there are no TikTok items for the date, 2 on bad input. An item with no caption still gets a
card, marked "No caption: don't post", and is listed as MISSING_CAPTION on stderr.
"""
import argparse, base64, datetime as dt, glob, html, importlib.util, json, os, re, subprocess, sys, tempfile
from zoneinfo import ZoneInfo

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ET, NBO = ZoneInfo("America/New_York"), ZoneInfo("Africa/Nairobi")
STATUSES = {"approved", "drafted", "posted"}
WAVE_SIZE = 5


def warn(msg):
    print(msg, file=sys.stderr)


def load_captions_module():
    path = os.path.join(REPO, ".claude", "skills", "publishing", "scripts", "captions.py")
    sys.dont_write_bytecode = True  # no __pycache__ inside the skill folder
    spec = importlib.util.spec_from_file_location("fmb_captions", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def find_script(item):
    if item.get("script"):
        p = item["script"] if os.path.isabs(item["script"]) else os.path.join(REPO, item["script"])
        return p if os.path.exists(p) else None
    concept, week = item.get("concept", ""), item.get("week", "")
    if not concept:
        return None
    cands = [os.path.join(REPO, "weeks", week, "scripts", concept + ".md")] if week else []
    if week:
        cands += sorted(glob.glob(os.path.join(REPO, "weeks", week, "**", concept + ".md"), recursive=True))
    cands += sorted(glob.glob(os.path.join(REPO, "weeks", "**", concept + ".md"), recursive=True))
    return next((c for c in cands if os.path.exists(c)), None)


def strip_md(s):
    s = re.sub(r"<[^>]+>", "", s)                    # <break .../> tags
    s = re.sub(r"\*\*[^*]+?:\*\*", "", s)            # **Speaker:**
    s = re.sub(r"\*\([^)]*\)\*", "", s)              # *(1.0 s silence)*
    s = s.replace("**", "").replace("*", "").replace("`", "")
    s = re.sub(r"\s+", " ", s).strip()
    m = re.fullmatch(r"[\"“](.*)[\"”]", s)
    return m.group(1).strip() if m else s


def script_title(text, concept):
    m = re.search(r"^#\s+(.+)$", text, re.M)
    if not m:
        return ""
    t = m.group(1).strip()
    if concept:
        t = re.sub(r"^" + re.escape(concept) + r"\s*[:—–\-/]\s*", "", t)
    return t


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def opening_line(text, hook):
    """Find the hook table and return the spoken line (or first on-screen words) for this hook."""
    lines = text.splitlines()
    hook = (hook or "A").upper()
    hook_num = str(ord(hook) - 64) if len(hook) == 1 and hook.isalpha() else hook
    for i, line in enumerate(lines):
        if not line.lstrip().startswith("|"):
            continue
        head = [h.lower() for h in cells(line)]
        voice = next((j for j, h in enumerate(head) if h.startswith("voice line") or h.startswith("spoken")), None)
        screen = next((j for j, h in enumerate(head) if h.startswith("on screen") or h.startswith("on-screen")), None)
        if voice is None and screen is None:
            continue
        for row in lines[i + 2:]:
            if not row.lstrip().startswith("|"):
                break
            c = cells(row)
            key = re.sub(r"[*_]", "", c[0]).strip()
            first = re.split(r"[\s—–\-]+", key)[0].upper() if key else ""
            if first not in (hook, hook_num):
                continue
            if voice is not None and voice < len(c):
                v = strip_md(c[voice])
                if v and v not in ("—", "-"):
                    return v
            if screen is not None and screen < len(c):
                q = re.search(r"[\"“]([^\"”]+)[\"”]", c[screen])
                return q.group(1).strip() if q else strip_md(c[screen])[:120]
        # no row for this hook (e.g. a beat sheet): keep looking
    # List style: "### Hook A — question" then "- **Voice (Eric):** "line"" / "- **First 1.5 s on screen:** ..."
    m = re.search(r"^###\s*Hook\s+" + re.escape(hook) + r"\b.*?$(.*?)(?=^#|\Z)", text, re.M | re.S | re.I)
    if m:
        block = m.group(1)
        v = re.search(r"^\s*-\s*\*\*(?:Voice|Spoken)[^*]*\*\*\s*(.+)$", block, re.M | re.I)
        if v and strip_md(v.group(1)) not in ("", "—", "-"):
            return strip_md(v.group(1))
        s = re.search(r"^\s*-\s*\*\*[^*]*on screen[^*]*\*\*\s*(.+)$", block, re.M | re.I)
        if s:
            q = re.search(r"[\"“]([^\"”]+)[\"”]", s.group(1))
            return q.group(1).strip() if q else strip_md(s.group(1))[:120]
    return ""


def git(*args, **kw):
    return subprocess.run(["git", "-C", REPO, *args], check=True, **kw)


def fetch_renders():
    try:
        git("fetch", "--depth", "1", "--filter=blob:none", "origin", "renders",
            capture_output=True, timeout=300)
    except Exception as e:  # offline: fall back to whatever origin/renders already points at
        warn(f"WARN renders fetch failed ({e}); using the existing origin/renders ref")
        return
    # In a single-branch clone `git fetch origin renders` only moves FETCH_HEAD; point origin/renders at it.
    git("update-ref", "refs/remotes/origin/renders", "FETCH_HEAD", capture_output=True)


def thumbnail(render, cache):
    """First frame of renders:<path>, 240 px wide JPEG, as a data: URI ('' when unavailable)."""
    path = re.sub(r"^renders:", "", render or "").strip()
    if not path:
        return ""
    if path in cache:
        return cache[path]
    uri = ""
    with tempfile.TemporaryDirectory() as tmp:
        mp4, jpg = os.path.join(tmp, "v.mp4"), os.path.join(tmp, "t.jpg")
        try:
            with open(mp4, "wb") as f:
                git("show", f"origin/renders:{path}", stdout=f, stderr=subprocess.PIPE, timeout=600)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-frames:v", "1",
                            "-vf", "scale=240:-2", "-q:v", "4", jpg], check=True, capture_output=True, timeout=120)
            with open(jpg, "rb") as f:
                uri = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()
        except subprocess.CalledProcessError as e:
            warn(f"WARN no thumbnail for {path}: {(e.stderr or b'').decode(errors='replace').strip()[:200]}")
        except Exception as e:
            warn(f"WARN no thumbnail for {path}: {e}")
    cache[path] = uri
    return uri


def times(date, time_et):
    t = dt.datetime.strptime(f"{date} {time_et}", "%Y-%m-%d %H:%M").replace(tzinfo=ET)
    n = t.astimezone(NBO)
    nbo = n.strftime("%H:%M")
    if n.date() != t.date():
        nbo += " " + n.strftime("%a")
    return t.strftime("%H:%M"), nbo


def build_cards(items, date, fetch=True):
    caps_mod = load_captions_module()
    if fetch:
        fetch_renders()
    ordered = sorted(enumerate(items), key=lambda p: (
        p[1].get("slot") if isinstance(p[1].get("slot"), int) else 10 ** 6, p[1].get("time_et", ""), p[0]))
    cards, cache = [], {}
    for n, (_, it) in enumerate(ordered, 1):
        script = find_script(it)
        text = open(script, encoding="utf-8").read() if script else ""
        caption = (it.get("caption") or "").strip()
        if not caption and script:
            try:
                caption = caps_mod.parse(script).get("ig_tiktok", "").strip()
            except Exception as e:
                warn(f"WARN captions.py failed on {script}: {e}")
        if not caption:
            warn(f"MISSING_CAPTION draft {n} {it.get('concept')}-{it.get('hook')}")
        et, nbo = times(date, it["time_et"])
        cards.append({
            "n": n,
            "wave": int(it.get("wave") or (1 if n <= WAVE_SIZE else 2)),
            "id": f"{it.get('concept')}-{it.get('hook')}",
            "et": et, "nbo": nbo,
            "title": it.get("title") or script_title(text, it.get("concept", "")) or it.get("yt_title") or it.get("concept", ""),
            "opening": it.get("opening_line") or opening_line(text, it.get("hook")),
            "caption": caption,
            "thumb": thumbnail(it.get("render"), cache),
            "status": it.get("status", ""),
        })
    return cards


CSS = """
/* Layout: one narrow column of draft cards, grouped by wave, thumb left of the facts, caption below. */
:root {
  --bg: #f3f4f6; --surface: #ffffff; --fg: #15171c; --muted: #5d6370; --line: #dde0e6;
  --accent: #e0282d; --accent-ink: #ffffff; --soft: #f7f7f9; --ok: #1f7a4d; --ok-soft: #e3f3ea; --warn-soft: #fde8e8;
  --display: "Barlow Semi Condensed", "Arial Narrow", system-ui, sans-serif;
  --body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0f1114; --surface: #1a1d22; --fg: #eceef2; --muted: #9aa1ad; --line: #2c3038;
  --accent: #ff4a4f; --accent-ink: #160607; --soft: #22262c; --ok: #5fd39a; --ok-soft: #173326; --warn-soft: #3a1d1e; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #0f1114; --surface: #1a1d22; --fg: #eceef2; --muted: #9aa1ad; --line: #2c3038;
  --accent: #ff4a4f; --accent-ink: #160607; --soft: #22262c; --ok: #5fd39a; --ok-soft: #173326; --warn-soft: #3a1d1e; color-scheme: dark }
* { box-sizing: border-box }
body { background: var(--bg); color: var(--fg); font: 15px/1.45 var(--body); margin: 0 }
.wrap { max-width: 560px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px 40px; display: grid; gap: 14px }
header { display: grid; gap: 2px }
.eyebrow { font: 600 13px/1.2 var(--display); letter-spacing: .08em; text-transform: uppercase; color: var(--accent) }
h1 { font: 700 28px/1.1 var(--display); margin: 0; text-wrap: balance }
.sub { color: var(--muted); font-size: 14px }
.progress { font-variant-numeric: tabular-nums }
h2 { font: 600 15px/1.2 var(--display); letter-spacing: .06em; text-transform: uppercase; color: var(--muted);
  margin: 14px 0 0; display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 12px; display: grid; gap: 10px }
.card.done { opacity: .55 }
.top { display: flex; align-items: center; justify-content: space-between; gap: 8px }
.label { font: 700 17px/1.2 var(--display); letter-spacing: .02em }
.label b { color: var(--accent) }
.posted { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); cursor: pointer;
  padding: 4px 8px; border-radius: 999px; border: 1px solid var(--line) }
.posted input { width: 18px; height: 18px; margin: 0; accent-color: var(--ok) }
.card.done .posted { color: var(--ok); background: var(--ok-soft); border-color: transparent }
.mid { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 12px; align-items: start }
.thumb { width: 76px; aspect-ratio: 9 / 16; max-width: 100%; border-radius: 8px; object-fit: cover; background: var(--soft);
  border: 1px solid var(--line); display: block }
.nothumb { display: grid; place-items: center; font-size: 11px; color: var(--muted); text-align: center }
.facts { display: grid; gap: 4px; min-width: 0 }
.time { font: 700 22px/1.1 var(--display); font-variant-numeric: tabular-nums }
.time small { font: 500 15px/1.1 var(--display); color: var(--muted); margin-left: 6px }
.title { font-weight: 650; overflow-wrap: anywhere }
.code { font: 500 12px/1.2 var(--body); color: var(--muted); letter-spacing: .04em }
.open { color: var(--muted); font-style: italic; overflow-wrap: anywhere }
.cap { background: var(--soft); border-radius: 10px; padding: 10px 12px; white-space: pre-wrap; overflow-wrap: anywhere;
  margin: 0; font: 15px/1.45 var(--body); user-select: text; -webkit-user-select: text }
.cap.missing { background: var(--warn-soft); color: var(--fg); font-weight: 600 }
.copy { appearance: none; border: 0; border-radius: 10px; background: var(--accent); color: var(--accent-ink);
  font: 700 16px/1 var(--display); letter-spacing: .04em; text-transform: uppercase; padding: 14px; width: 100%; cursor: pointer }
.copy:disabled { background: var(--line); color: var(--muted); cursor: not-allowed }
.copy.ok { background: var(--ok); color: var(--surface) }
.copy:focus-visible, .posted:focus-within { outline: 2px solid var(--fg); outline-offset: 2px }
footer { color: var(--muted); font-size: 12px; margin-top: 8px }
@media (prefers-reduced-motion: no-preference) { .copy { transition: background .15s } }
"""

JS = """
(function () {
  var data = JSON.parse(document.getElementById('board-data').textContent);
  var key = function (id) { return 'fmb-tt-board:' + data.date + ':' + id; };
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { v ? localStorage.setItem(k, '1') : localStorage.removeItem(k); } catch (e) {} }
  var prog = document.getElementById('progress');
  function count() {
    var done = document.querySelectorAll('.card.done').length;
    prog.textContent = done + ' of ' + data.total + ' posted';
  }
  document.querySelectorAll('.card').forEach(function (card) {
    var id = card.getAttribute('data-id'), box = card.querySelector('input[type=checkbox]');
    if (get(key(id))) { box.checked = true; card.classList.add('done'); }
    box.addEventListener('change', function () { card.classList.toggle('done', box.checked); set(key(id), box.checked); count(); });
    var btn = card.querySelector('.copy'), pre = card.querySelector('.cap');
    if (!btn || btn.disabled) return;
    var text = data.captions[id];
    function flash(label, ok) {
      btn.textContent = label; btn.classList.toggle('ok', ok);
      clearTimeout(btn._t); btn._t = setTimeout(function () { btn.textContent = 'Copy caption'; btn.classList.remove('ok'); }, 2200);
    }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      flash(ok ? 'Copied' : 'Selected: tap Copy', ok);
    }
    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash('Copied', true); }, fallback);
      } else { fallback(); }
    });
  });
  count();
})();
"""


def render_page(date, cards, generated):
    d = dt.date.fromisoformat(date)
    nice = d.strftime("%A, %B ") + str(d.day) + d.strftime(", %Y")
    e = html.escape
    parts = [
        '<meta charset="utf-8">',  # the publish skeleton adds one too; this keeps the local file readable
        '<title>TikTok Caption Board</title>',
        '<meta name="claude:viewport-fit-sides" content="cover">',
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&display=swap">',
        f"<style>{CSS}</style>",
        '<div class="wrap">',
        '<header><div class="eyebrow">FuelMyBuild · TikTok drafts</div>',
        f'<h1>{e(nice)}</h1>',
        f'<div class="sub">{len(cards)} drafts in send order · <span class="progress" id="progress">0 of {len(cards)} posted</span></div>',
        '<div class="sub">Open the draft that matches the thumbnail, paste its caption, post at the time shown.</div></header>',
    ]
    wave = None
    for c in cards:
        if c["wave"] != wave:
            wave = c["wave"]
            in_wave = [x for x in cards if x["wave"] == wave]
            when = "first run of the day" if wave == 1 else "14:45 ET run"
            parts.append(f'<h2><span>Wave {wave} · {len(in_wave)} drafts</span><span>sent on the {when}</span></h2>')
        thumb = (f'<img class="thumb" src="{c["thumb"]}" alt="First frame of {e(c["title"])}" width="76" height="135">'
                 if c["thumb"] else '<div class="thumb nothumb">no<br>preview</div>')
        if c["caption"]:
            cap = f'<pre class="cap">{e(c["caption"])}</pre>'
            btn = '<button class="copy" type="button">Copy caption</button>'
        else:
            cap = '<pre class="cap missing">No caption in the queue or script. Don\'t post this draft yet.</pre>'
            btn = '<button class="copy" type="button" disabled>No caption</button>'
        opening = f'<div class="open">“{e(c["opening"])}”</div>' if c["opening"] else ""
        cid = f'{c["n"]}-{c["id"]}'
        parts.append(
            f'<article class="card" data-id="{e(cid)}">'
            f'<div class="top"><div class="label">Wave {c["wave"]} · Draft <b>{c["n"]}</b></div>'
            f'<label class="posted" for="posted-{e(cid)}"><input type="checkbox" id="posted-{e(cid)}"> posted</label></div>'
            f'<div class="mid">{thumb}<div class="facts">'
            f'<div class="time">{c["et"]} ET<small>{e(c["nbo"])} Nairobi</small></div>'
            f'<div class="title">{e(c["title"])}</div><div class="code">{e(c["id"])}</div>{opening}</div></div>'
            f'{cap}{btn}</article>')
    data = {"date": date, "total": len(cards),
            "captions": {f'{c["n"]}-{c["id"]}': c["caption"] for c in cards if c["caption"]}}
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    parts += [f'<footer>Built {e(generated)} from state/queue.json. Times are Eastern (ET) and Nairobi (EAT). '
              'The posted ticks stay on this phone only.</footer></div>',
              f'<script type="application/json" id="board-data">{payload}</script>',
              f"<script>{JS}</script>"]
    return "\n".join(parts) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--date", required=True, help="YYYY-MM-DD (the posting day, ET)")
    ap.add_argument("--queue", default=os.path.join(REPO, "state", "queue.json"))
    ap.add_argument("--out", help="output HTML path (default out/tiktok-board/<date>/index.html)")
    ap.add_argument("--no-fetch", action="store_true", help="don't fetch the renders branch first")
    a = ap.parse_args()
    try:
        dt.date.fromisoformat(a.date)
    except ValueError:
        sys.exit(f"bad --date {a.date!r}, want YYYY-MM-DD")
    queue = json.load(open(a.queue, encoding="utf-8"))
    items = [i for i in queue if i.get("platform") == "tiktok" and i.get("date") == a.date
             and i.get("status") in STATUSES]
    if not items:
        warn(f"NO_ITEMS no approved/drafted TikTok items on {a.date}")
        sys.exit(3)
    if len(items) > 2 * WAVE_SIZE:
        warn(f"WARN {len(items)} TikTok items on {a.date}; more than two waves of {WAVE_SIZE}")
    cards = build_cards(items, a.date, fetch=not a.no_fetch)
    generated = dt.datetime.now(ET).strftime("%b %d, %H:%M ET")
    out = a.out or os.path.join(REPO, "out", "tiktok-board", a.date, "index.html")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(render_page(a.date, cards, generated))
    for c in cards:
        print(f'wave {c["wave"]} draft {c["n"]:>2} {c["et"]} ET / {c["nbo"]} NBO  {c["id"]:<10} '
              f'thumb={"yes" if c["thumb"] else "NO"} caption={"yes" if c["caption"] else "NO"}  {c["title"]}')
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
