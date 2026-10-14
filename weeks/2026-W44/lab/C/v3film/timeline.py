# python3 timeline.py  -> src/timeline/C3-COL.json, C3-GAR.json, C3-SUP.json
# One timeline per reel: VO windows (subtitles + later ducking), estimated word times (replace with the
# real words.json once Wayne's VO is recorded), named motion events the scene code reads, and SFX cues
# placed on the same times. Lead hook A for each reel. 30 fps, 27.0 s.
import json, os, re

FPS, DUR = 30, 27.0
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "timeline")


def words(line, a, b):
    """Spread words over [a, b]; '|(0.2)' marks a scripted pause. Weight = letters + 2 (rough syllables)."""
    parts = re.split(r"\s*\|\s*\(([\d.]+)\)\s*", line)
    chunks, pauses = parts[0::2], [float(p) for p in parts[1::2]]
    toks = [[w for w in c.split() if w] for c in chunks]
    span = (b - a) - sum(pauses)
    wt = [len(re.sub(r"[^A-Za-z0-9]", "", w)) + 2 for c in toks for w in c]
    k = span / sum(wt)
    out, t, i = [], a, 0
    for ci, c in enumerate(toks):
        for w in c:
            d = wt[i] * k
            out.append({"w": w.replace("*", ""), "a": round(t, 2), "b": round(t + d * 0.92, 2)})
            t += d; i += 1
        if ci < len(pauses):
            t += pauses[ci]
    return out


def vo(rows):
    res = []
    for n, (a, b, who, line) in enumerate(rows, 1):
        emph = re.findall(r"\*([^*]+)\*", line)
        res.append({"n": n, "a": a, "b": b, "speaker": who, "line": re.sub(r"\s*\|\s*\([\d.]+\)\s*", " ", line).replace("*", ""),
                    "emphasis": emph, "words": words(line, a, b)})
    return res


def sfx(rows):
    return [{"t": t, "frame": round(t * FPS), "name": n, "note": note} for t, n, note in sorted(rows, key=lambda r: r[0])]



# ---------------------------------------------------------------- phase 2 (always alive): extra action cues + music plan
# Every new on-screen motion added in phase 2 gets its own sound, on the same time the scene code uses.
def _col_ruler_ticks():
    """Camera read-head crossing ruler ticks during the four glides (same keyframes and easings as COL.tsx)."""
    X = lambda yr: 400 + (yr - 2016) * 250
    expo = lambda p: 1 if p >= 1 else 1 - 2 ** (-10 * p)
    eio = lambda p: 4 * p ** 3 if p < .5 else 1 - (-2 * p + 2) ** 3 / 2
    segs = [(1.85, 4.7, X(2019), X(2019.45), eio), (5.0, 5.95, X(2019.45), X(2021) - 60, expo),
            (8.0, 9.05, X(2021) - 60, X(2017) + 60, eio), (11.0, 11.9, X(2017) + 60, X(2019), expo)]
    out = []
    for a, b, x0, x1, ease in segs:
        prev = x0
        for i in range(1, 601):
            tt = a + (b - a) * i / 600; x = x0 + (x1 - x0) * ease(i / 600)
            for q in range(0, 33):
                tx = X(2016 + q / 4)
                if (prev - tx) * (x - tx) < 0:
                    out.append((round(tt, 3), "ruler-tick-major" if q % 4 == 0 else "ruler-tick", "read-head passes a tick"))
            prev = x
    return out

def _typing(at, n, cps, note):
    return [(round(at + k / cps, 3), "key", note) for k in range(n)]

EXTRA = {
    "C3-COL": _col_ruler_ticks() + [
        (1.1, "tick-ripple", "slap ripples through the ticks"), (24.6, "tick-ripple", "tick close ripples out"),
        (1.85, "label-out", "bet chip leaves (blur-out-up)"),
        (3.2, "pop-soft", "'?' pops as the leader line arrives"),
        (5.9, "pennant-snap", "Marisol's pennant snaps after the plant"), (9.35, "pennant-snap", "Dev's pennant snaps"),
        (1.95, "label-in", "'Installed: ?' words spring in"), (5.25, "label-in", "'Marisol: 2021'"), (8.3, "label-in", "'Four years apart'"),
        (11.15, "label-in", "'Witness: also Dev'"), (19.0, "label-in", "'Both off by two'"), (21.6, "label-in", "'Split down the middle'"),
        (4.0, "emph-pop", "'?' pops on 'intake'"), (5.9, "emph-pop", "2021 turns red"), (9.0, "emph-pop", "'Four years' red"),
        (12.42, "emph-pop", "'Dev' red on 'Himself'"), (19.51, "emph-pop", "'two' red on 'off'"), (22.75, "emph-pop", "'middle' red"),
        (15.24, "tick-soft", "date characters land (Jun)"), (15.64, "tick-soft", "14,"), (16.18, "tick-soft", "2019"),
        (17.83, "shimmer", "light sweep across the photo on 'photo'"), (15.95, "shimmer-soft", "glass sheen on the card"),
        (19.35, "tick-soft", "'2 years' characters"), (19.5, "cap-pop-x2", "measure end caps spring up"),
        (24.91, "emph-pop", "'once' red"), (26.35, "label-in", "bet chip returns for the loop"),
    ] + _typing(15.5, 30, 30, "URL types under the card") + _typing(25.47, 15, 24, "CTA URL types, red caret"),
    "C3-GAR": [(a, "flap-twitch", "a stalled THU flap half-lifts and drops back") for a in (9.3, 10.85, 13.05, 14.95, 16.7, 17.95, 18.7)] + [
        (0.06, "ring-out", "bell rings out (arcs above the bell)"), (6.15, "clunk", "engine stand stops, rocks"),
        (12.91, "emph-pop", "'Tue' turns red on 'Tuesday'"), (12.7, "tick-soft", "date characters"), (14.12, "shimmer", "sweep across the weep photo"),
        (14.9, "emph-pop", "'Gus' swells on 'Gus's name'"), (18.15, "emph-pop", "'Not' red on 'called'"), (21.8, "pill-pop", "'Back to the car'"),
        (23.44, "emph-pop", "'car' red on 'engine'"), (24.3, "chip-wipe", "chip wipes back to red"), (25.02, "emph-pop", "'find' red"),
        (5.1, "lens-settle", "punch-out lens settle"), (1.9, "lens-settle", "punch-in lens settle"),
    ] + _typing(12.3, 26, 40, "monitor header URL types") + _typing(25.56, 15, 24, "CTA URL types"),
    "C3-SUP": [(round(0.682 + k * 27 / 16, 3), "creak-soft", "string creaks at each end of its sway") for k in range(16)] + [
        (3.85, "paper-flutter", "'Which car?' tag flies in"), (7.5, "paper-flutter", "'Who fitted it?' tag flies in"),
        (6.75, "value-tick", "Day 1 -> 2"), (9.85, "value-tick", "Day 2 -> 4"), (11.33, "value-tick", "Day 4 -> 6"), (22.9, "value-tick", "Day 6 -> 1"),
        (1.95, "label-in", "'Car? Fitter? Date? Unknown.'"), (11.2, "label-in", "'Still rattling'"), (20.0, "label-in", "'A place to start'"),
        (4.05, "emph-pop", "'Unknown.' red"), (11.6, "emph-pop", "'rattling' red and shaking"), (20.97, "emph-pop", "'start' red"),
        (13.37, "emph-pop", "'Return?' pops on 'return'"), (3.1, "pop-soft", "'?' pops in the outline"),
        (16.1, "tick-soft-x3", "card title words"), (17.21, "tick-soft", "date characters"), (18.59, "emph-pop", "chip pops on 'Northline'"),
        (19.2, "string-zip", "path-ride: cotton draws along its curve"), (19.85, "knot", "the slack pulls taut"),
        (23.0, "tag-swing", "tag 1 swings home"), (24.95, "emph-pop", "'build' red"),
    ] + _typing(18.7, 28, 30, "URL types under the card") + _typing(25.57, 15, 24, "CTA URL types"),
}
MUSIC = {
    "C3-COL": {"bpm": 96, "root": 50, "mode": "minor", "style": "warm", "cut": 13.0, "ret": 21.4, "T0": 21.4, "room": "restaurant"},
    "C3-GAR": {"bpm": 92, "root": 45, "mode": "minor", "style": "observe", "cut": 12.0, "ret": 21.5, "T0": 21.5, "room": "shop", "soft_after": 0.75},
    "C3-SUP": {"bpm": 100, "root": 48, "mode": "minor", "style": "investigate", "thin": 16.0, "cut": 16.0, "ret": 22.6, "T0": 22.6, "room": "office", "one_note": True},
}


def write(reel):
    os.makedirs(OUT, exist_ok=True)
    reel["sfx"] = sfx([(t, n, note) for t, n, note in [(c["t"], c["name"], c["note"]) for c in reel["sfx"]] + EXTRA.get(reel["id"], [])])
    reel["music"] = MUSIC[reel["id"]]
    reel.update({"fps": FPS, "duration": DUR, "frames": int(DUR * FPS), "width": 1080, "height": 1920,
                 "vo_status": "estimated from the script windows; replace word times with words.json after Wayne records"})
    with open(os.path.join(OUT, reel["id"] + ".json"), "w") as f:
        json.dump(reel, f, indent=1)
    print("wrote", reel["id"], len(reel["vo"]), "VO lines,", len(reel["sfx"]), "SFX cues")


# ---------------------------------------------------------------- C3-COL
write({
    "id": "C3-COL", "title": "Loser buys dinner", "hook": "A", "turn": 14.4, "cta_clear": 26.6,
    "remocn": ["stage (keyframed camera over one long plane, whole film)", "speed-lines (trail + squash/bounce on each flag plant)",
               "mask-reveal-up (card lines and beat labels rising out of the tape)", "caption-rise (subtitles)"],
    "vo": vo([
        (0.1, 1.8, "Narrator", "Loser buys *dinner*."),
        (1.9, 5.0, "Narrator", "Marisol's Evo. |(0.15) When did the *intake* go on?"),
        (5.1, 7.9, "Marisol", "Twenty twenty-one. |(0.2) Hot *summer*."),
        (8.1, 10.9, "Dev", "*Seventeen*. |(0.2) I held the light."),
        (11.0, 12.9, "Narrator", "He had a witness. |(0.3) *Himself*."),
        (13.0, 14.4, "Marisol", "Fine. |(0.1) Look it *up*."),
        (14.5, 18.3, "Narrator", "Intake. |(0.2) June twenty nineteen. |(0.3) Her own *photo*."),
        (18.5, 21.3, "Dev", "Two years *off*. |(0.2) Both of us."),
        (21.5, 23.8, "Narrator", "Nobody won. |(0.2) They split the *check*."),
        (24.0, 26.9, "Narrator", "Date it *once*. |(0.15) fuelmybuild.com."),
    ]),
    # named motion events (seconds). The scene code reads these; SFX below sit on the same times.
    "ev": {
        "checkLift": 0.55, "checkSlap": 1.05, "flagTwitch": 1.12,
        "glide1": 1.85, "intakeLift": 2.35, "leader": 2.6,
        "camMarisol": 5.0, "flagMLift": 5.25, "flagMPlant": 5.7,
        "camDev": 8.0, "tintFrom": 8.15, "tintTo": 9.0, "flagDLift": 8.75, "flagDPlant": 9.15,
        "pullBack": 11.0, "checkNudge": 12.25,
        "musicCut": 13.0, "camTick": 13.0, "tickSplit": 13.45,
        "cardRise": 14.4, "cardLines": 14.55, "cardPhoto": 14.8, "cardChip": 15.15, "holdEnd": 18.4,
        "cardShrink": 18.4, "lean": 18.85, "measure": 19.05,
        "musicBack": 21.4, "tintDrain": 21.4, "checkCenter": 22.75,
        "fold": 24.0, "flagsBack": 24.35, "checkBack": 24.4, "tickClose": 24.55, "camHome": 24.0, "qBack": 25.0,
        "ctaIn": 24.1, "ctaOut": 26.35, "chipBack": 26.35,
    },
    "labels": [
        {"a": 0.0, "b": 1.85, "text": "Bet: one dinner", "kind": "chip"},
        {"a": 1.95, "b": 5.0, "text": "Installed: ?"},
        {"a": 5.25, "b": 8.0, "text": "Marisol: 2021"},
        {"a": 8.3, "b": 11.0, "text": "Four years apart"},
        {"a": 11.15, "b": 13.0, "text": "Witness: also Dev"},
        {"a": 19.0, "b": 21.3, "text": "Both off by two"},
        {"a": 21.6, "b": 23.6, "text": "Split down the middle"},
        {"a": 26.35, "b": 27.0, "text": "Bet: one dinner", "kind": "chip", "loop": True},
    ],
    "sfx": sfx([
        (0.0, "room-tone-restaurant", "low bed under the whole film (-38 dB); it stays through the music cut"),
        (0.55, "leather-lift", "check presenter lifts off the tape"),
        (1.05, "leather-slap", "check presenter slaps the tape; lands on 'dinner'"),
        (1.12, "pin-twitch-x2", "both flags twitch, 2 ticks 60 ms apart"),
        (1.85, "air-glide", "camera glides right (soft, long)"),
        (2.35, "part-lift", "intake lifts 20 px"),
        (2.6, "pencil-line", "grey leader line draws to the '?'"),
        (5.0, "air-glide", "camera to Marisol's flag"),
        (5.25, "flag-flutter", "her pennant lifts"),
        (5.7, "tape-click", "replant on 2021 (speed-lines landing)"),
        (8.0, "air-glide-long", "longest pan, across the gap"),
        (8.15, "tint-swell", "red tint follows the camera over four years"),
        (8.75, "flag-flutter", "his pennant lifts"),
        (9.15, "tape-click", "replant on 2017"),
        (11.0, "air-pull", "pull back to both flags"),
        (12.25, "leather-slide", "check slides 40 px toward Marisol"),
        (13.0, "music-cut", "dead stop; room tone only"),
        (13.45, "tape-split", "2019 tick splits (soft zip + creak)"),
        (14.4, "card-rise", "glass card rises out of the tape (air, no whoosh peak)"),
        (14.55, "tick-soft-x3", "card lines land, 3 ticks"),
        (14.8, "photo-settle", "install photo lands (soft paper tap)"),
        (15.15, "chip-pop", "'logged by Marisol' chip"),
        (18.4, "air-short", "card shrinks to the tick"),
        (18.85, "pin-creak-x2", "flags lean in"),
        (19.05, "measure-draw-x2", "two grey measure lines draw, '2 yrs' each"),
        (21.4, "music-return", "music back on the downbeat"),
        (21.4, "tint-drain", "red drains (reverse swell)"),
        (22.75, "leather-slide", "check slides to the middle; lands on 'check'"),
        (24.0, "card-fold", "card folds into the tape"),
        (24.35, "tape-click-x2", "flags spring back to 2017 and 2021"),
        (24.4, "leather-slide", "check back to its frame-0 spot"),
        (24.55, "tape-close", "tick closes"),
        (24.1, "cta-pop", "CTA band in"),
        (26.35, "cta-out", "CTA clears (soft)"),
    ]),
})

# ---------------------------------------------------------------- C3-GAR
write({
    "id": "C3-GAR", "title": "You never told me", "hook": "A", "turn": 12.0, "cta_clear": 26.6,
    "remocn": ["caption-split-flap (the board's flap engine, scaled up to a 14 x 4 board)",
               "staggered-fade-up (the monitor's log entry)", "micro-scale-fade (chips and beat pills)",
               "caption-dim-progress (subtitles)"],
    "vo": vo([
        (0.2, 1.8, "Okafor", "You *never* told me."),
        (1.9, 5.0, "Narrator", "Okafor's R34. |(0.15) Did Gus ever *call*?"),
        (5.1, 8.9, "Gus", "Tuesday, found it. |(0.2) Wednesday, parts. |(0.3) Thursday..."),
        (9.1, 10.3, "Okafor", "So you *didn't*."),
        (10.7, 11.9, "Gus", "Hang on."),
        (12.1, 15.9, "Narrator", "Logged *Tuesday*. |(0.2) One photo. |(0.2) Gus's name."),
        (16.1, 18.9, "Okafor", "You still should've *called*."),
        (19.1, 21.4, "Gus", "I *should* have."),
        (21.6, 23.9, "Narrator", "Then they talked about the *engine*."),
        (24.0, 26.9, "Narrator", "Log every *find*. |(0.15) fuelmybuild.com."),
    ]),
    "ev": {
        "ding": 0.03, "reclatter": 0.05, "chipBounce": 0.25,
        "punchIn": 1.8, "rowGarage": 2.0, "rowDidHe": 3.55, "punchOut": 5.0,
        "rowMon": 5.05, "rowTue": 5.3, "block": 5.6, "rowWed": 6.45, "rowThu": 7.75, "thuStall": 8.6,
        "monSlide": 9.35, "bellAside": 9.55, "monTurn": 10.6, "monTurned": 11.5,
        "monFill": 12.0, "musicCut": 12.0, "eHeader": 12.25, "eTitle": 12.35, "eDate": 12.5, "ePhoto": 13.2, "eChip": 13.45, "holdEnd": 16.0,
        "pushPhoto": 16.0, "pillWhen": 16.35,
        "rowSorry": 19.1,
        "monBack": 21.5, "drift": 21.6, "chipGrey": 22.0, "pillCar": 21.8, "musicBack": 21.5,
        "monOut": 24.0, "blockOut": 24.1, "boardBack": 24.2, "chipRed": 24.3, "bellBack": 24.4, "camHome": 24.0,
        "ctaIn": 24.1, "ctaOut": 26.35,
    },
    "board": [
        {"row": 0, "at": 0.05, "text": "NEVER TOLD ME", "note": "re-clatter onto the frame-0 text on the ding"},
        {"row": 1, "at": 2.0, "text": "PELL ST GARAGE"},
        {"row": 2, "at": 3.55, "text": "DID HE?", "tone": "grey"},
        {"row": 0, "at": 5.05, "text": "MON  CAR IN"}, {"row": 1, "at": 5.3, "text": "TUE  FOUND IT"}, {"row": 2, "at": 5.15, "text": ""},
        {"row": 2, "at": 6.45, "text": "WED  PARTS"}, {"row": 3, "at": 7.75, "text": "THU", "stall": True},
        {"row": 3, "at": 19.1, "text": "THU  SORRY"},
        {"row": 0, "at": 24.2, "text": "NEVER TOLD ME"}, {"row": 1, "at": 24.25, "text": ""}, {"row": 2, "at": 24.3, "text": ""}, {"row": 3, "at": 24.35, "text": ""},
    ],
    "labels": [
        {"a": 16.35, "b": 21.5, "text": "Shows when. Not the call."},
        {"a": 21.8, "b": 24.0, "text": "Back to the car"},
    ],
    "sfx": sfx([
        (0.0, "room-tone-shop", "low shop bed (-38 dB): compressor hum, far radio"),
        (0.03, "bell-ding", "brass counter bell, hand slap (frame 1)"),
        (0.05, "flap-clatter-13", "board re-clatters to NEVER TOLD ME (one click per flap, summed)"),
        (0.25, "chip-drop", "$1,850 chip bounces"),
        (1.8, "punch-in-thump", "hard cut in (low thump, no whoosh)"),
        (2.0, "flap-clatter-14", "PELL ST GARAGE"),
        (3.55, "flap-clatter-7", "DID HE? (grey flaps)"),
        (5.0, "punch-out-thump", "hard cut out"),
        (5.05, "flap-clatter-11", "MON  CAR IN"),
        (5.3, "flap-clatter-13", "TUE  FOUND IT"),
        (5.6, "caster-roll", "engine stand rolls in"),
        (6.45, "flap-clatter-10", "WED  PARTS"),
        (7.75, "flap-spin-slowing", "THU row spins, slows, stalls blank (clicks spread out, last click 8.6)"),
        (9.35, "monitor-slide", "monitor slides along the counter"),
        (9.55, "bell-slide", "bell pushed aside"),
        (10.6, "monitor-swivel", "stand swivel creak"),
        (11.5, "screen-on-tick", "screen faces us"),
        (12.0, "music-cut", "music cuts to room tone"),
        (12.35, "ui-tick-x3", "title, date land"),
        (13.2, "photo-settle", "weep photo lands (on 'photo')"),
        (13.45, "chip-pop", "logged by Gus chip"),
        (16.0, "air-slow-push", "camera eases into the photo"),
        (16.35, "pill-pop", "'Shows when. Not the call.'"),
        (19.1, "flap-clatter-5", "THU  SORRY (the only flip in the window)"),
        (21.5, "monitor-swivel", "monitor turns half back"),
        (21.5, "music-return", "music back, softer"),
        (22.0, "chip-fade", "chip red to grey (soft tick)"),
        (24.0, "monitor-slide-out", ""),
        (24.1, "caster-roll-out", ""),
        (24.2, "flap-clatter-full", "board back to NEVER TOLD ME, rows 2-4 blank"),
        (24.4, "bell-slide-back", "bell to its frame-0 spot (no ding: the ding is frame 1)"),
        (24.1, "cta-pop", ""),
        (26.35, "cta-out", ""),
    ]),
})

# ---------------------------------------------------------------- C3-SUP
write({
    "id": "C3-SUP", "title": "Rattle. Fix?", "hook": "A", "turn": 14.5, "cta_clear": 26.6,
    "remocn": ["paper-sticker (each tag lands in two stop-motion poses with paper jitter)",
               "caption-handwrite (its ink-sweep mask writes the tag text)", "soft-blur-in (log card fields, beat labels)",
               "caption-underline (subtitles)"],
    "vo": vo([
        (0.1, 1.8, "Noor", "Rattle. |(0.2) Fix? |(0.2) That's *it*."),
        (1.9, 5.0, "Narrator", "Noor had his *order number*. |(0.2) Nothing else."),
        (5.1, 5.9, "Noor", "Which car?"),
        (6.6, 7.9, "Theo", "A W-R-X."),
        (8.1, 9.1, "Noor", "Who *fitted* it?"),
        (9.8, 10.9, "Theo", "Some shop."),
        (11.0, 13.9, "Narrator", "Day *six*. |(0.2) Theo asked about a *return*."),
        (14.1, 15.9, "Theo", "Just read my *build*."),
        (16.1, 19.4, "Narrator", "Calder exhaust. |(0.2) July twenty-second. |(0.2) *Northline* Auto."),
        (19.6, 21.9, "Noor", "That rear *hanger*. |(0.2) Worth a look."),
        (22.0, 23.6, "Narrator", "Six days. |(0.2) One *link*."),
        (23.7, 26.9, "Narrator", "Ask for the *build*. |(0.15) fuelmybuild.com."),
    ]),
    "ev": {
        "swing": 0.12, "rattle1": 0.3,
        "camDrop": 1.85, "outline": 2.4, "write2": 4.2, "land2": 5.0, "sag1": 5.05, "pencil2": 6.75, "wrxIn": 6.95,
        "write3": 7.85, "land3": 8.45, "sag2": 8.5, "pencil3": 9.85,
        "sag3": 11.05, "rattle2": 11.6, "returnChip": 12.9,
        "snap": 14.5, "toCenter": 14.75, "unfold": 15.35, "cardIn": 15.95, "chipIn": 18.3, "holdEnd": 19.5,
        "tieTag": 19.65, "writeCheck": 20.25,
        "foldBack": 22.0, "tagHome": 22.45, "lift": 22.6, "returnOut": 22.4,
        "wrxOut": 23.8, "outlineOut": 24.2, "camHome": 23.8,
        "ctaIn": 23.8, "ctaOut": 26.35,
    },
    "labels": [
        {"a": 1.95, "b": 5.0, "text": "Car? Fitter? Date? Unknown."},
        {"a": 11.2, "b": 14.4, "text": "Still rattling"},
        {"a": 20.0, "b": 22.0, "text": "A place to start"},
    ],
    "sfx": sfx([
        (0.0, "room-tone-office", "quiet support desk bed (-40 dB)"),
        (0.12, "string-creak", "tag swings on its loop"),
        (0.3, "exhaust-rattle", "short metallic rattle (heat shield on stainless)"),
        (1.85, "air-drop", "camera drops down the string"),
        (2.4, "outline-draw", "grey car outline draws"),
        (4.2, "pen-write", "'Which car?' written in ink"),
        (5.0, "paper-thud", "tag 2 lands (two poses: thud + small slap)"),
        (5.05, "pipe-sag-rattle", "sag 40 px, light rattle"),
        (6.75, "pencil-write", "'WRX · day 2'"),
        (6.95, "slide-soft", "WRX slides into the outline"),
        (7.85, "pen-write", "'Who fitted it?'"),
        (8.45, "paper-thud", "tag 3 lands"),
        (8.5, "pipe-sag-rattle", "sag 60 px + tilt 4 deg"),
        (9.85, "pencil-write", "'Some shop · day 4'"),
        (11.05, "pipe-sag-groan", "last sag, string creak"),
        (11.6, "exhaust-rattle", "rattle repeats"),
        (12.9, "chip-drop-red", "'Return?' chip"),
        (14.5, "string-snap-x2", "two tags snap off"),
        (14.6, "paper-fall-x2", "tags fall out of frame"),
        (14.75, "air-short", "first tag swings to center"),
        (15.35, "paper-unfold", "tag unfolds along its fold"),
        (15.95, "card-settle", "glass card settles; music thins to one note"),
        (18.3, "chip-pop", "'installed by Northline Auto' (on 'Northline')"),
        (19.65, "string-tie", "small tag ties onto the rear hanger, swings once"),
        (20.25, "pen-write", "'Check first'"),
        (22.0, "paper-fold", "card folds back into the tag"),
        (22.6, "pipe-lift-spring", "pipe lifts to level, music returns"),
        (22.4, "chip-slide-out", "'Return?' leaves"),
        (23.8, "slide-soft", "WRX leaves"),
        (23.8, "cta-pop", ""),
        (26.35, "cta-out", ""),
    ]),
})
