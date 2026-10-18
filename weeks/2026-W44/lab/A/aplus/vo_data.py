# VO windows for Wayne, shared by the subtitles (src/vo.json), the bed ducking (audio/score.py)
# and the script (../vo-script.md).  python3 vo_data.py
# Line text is ChatGPT's VO column, rows joined with a space, unchanged. Windows let a line run into the
# next "—" row or flow across rows so no line needs much more than 3 spoken words a second.
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))

VOICE = {
    "L1": "One conversational US voice, medium-low register, calm and exact. 155–165 wpm during spoken passages, with roughly 0.7 seconds of silence after the opening. Give *underneath* a slight emphasis; deliver the four documentation steps crisply. The closing question should sound curious, not accusatory.",
    "L2": "One US voice with the easy authority of an experienced service writer. 160–170 wpm during spoken passages. Medium energy; warmer than L1. \"You can't tell\" is matter-of-fact. Pause briefly after \"Same finished car,\" then land \"More to judge.\" Let the closing question sound like a conversation between people who have done the work.",
    "L3": "One US voice, mid register, conversational with a slight edge of amused frustration. 165–175 wpm during spoken passages. No shouting or announcer delivery. Emphasize the difference between *guess* and *fact*. Pause before \"The brand.\" Shift into a helpful tone at \"Here's the fix.\" Speak the supplier question directly and leave it space.",
}
TITLE = {
    "L1": "A-L1 · Collectors · The upgrade a finished-car photo cannot prove",
    "L2": "A-L2 · Garages · The same finished-car photo can hide very different work",
    "L3": "A-L3 · Parts suppliers · A guess can become the answer to \"what turbo is that?\"",
}

# (spec rows, text, start, end, delivery note, optional subtitle pages "a | b | c")
LINES = {
    "L1": [
        ("0–1 (+ “—” 1–2)", "Prove the work.", 0.00, 1.30, "Calm, exact, unhurried. Then about 0.7 s of silence."),
        ("2–5", "That's the question an insurer or appraiser can ask.", 2.00, 4.95, "Even and informative; one breath."),
        ("5–8", "A finished-car photo can't show what's underneath.", 5.00, 7.90, "Slight emphasis on “underneath”; it lands as the photo slides up at 7.0."),
        ("8–10", "Start with the brake kit.", 8.00, 9.90, "Practical, a touch brighter."),
        ("10–11", "Name the part.", 10.00, 10.98, "Crisp; one step per second."),
        ("11–12", "Show the brand.", 11.00, 11.98, "Crisp."),
        ("12–13", "Date the install.", 12.00, 12.98, "Crisp."),
        ("13–14", "Attach the photo.", 13.00, 13.98, "Crisp."),
        ("14–15", "Credit the garage.", 14.00, 14.98, "Crisp; slight lift, the list is complete."),
        ("15–19", "We put that record on a FuelMyBuild build page.", 15.00, 18.90, "Relaxed; read “Fuel My Build”."),
        ("19–20", "One public link.", 18.95, 19.95, "Plain statement."),
        ("20–22", "Now the work has a record.", 20.00, 21.95, "Settled, quiet satisfaction."),
        ("22–24 (+ “—” 24–25)", "What's your hardest upgrade to prove?", 22.00, 24.60, "Curious, not accusatory; let it hang."),
        ("25–27 (+ “—” 27–28)", "Follow for better build records.", 25.00, 27.20, "Warm, low-key sign-off."),
    ],
    "L2": [
        ("0–1 (+ “—” 1–2)", "Same car. Same photo.", 0.00, 1.60, "Two even beats with a small gap between."),
        ("2–4", "Which shop would you hire?", 2.00, 3.95, "Genuine question."),
        ("4–5", "You can't tell.", 4.00, 4.98, "Matter-of-fact."),
        ("5–8", "Now show what the photo leaves out.", 5.05, 7.95, "Service-writer authority; easy."),
        ("8–9", "Brake kit.", 8.00, 8.80, "Listing; one item per second."),
        ("9–10", "Dated install photo.", 8.95, 9.95, "Listing."),
        ("10–11", "Parts and brands.", 10.00, 10.98, "Listing."),
        ("11–13", "The garage that did it.", 11.00, 12.95, "A little credit in the voice."),
        ("13–15", "The contributor behind the work.", 13.00, 14.95, "Same warmth."),
        ("15–16", "Same finished car.", 15.00, 15.95, "Then a brief pause."),
        ("16–17", "More to judge.", 16.10, 17.10, "Land it."),
        ("17–21", "We connect those details on a FuelMyBuild build page.", 17.15, 20.70, "Steady; read “Fuel My Build”."),
        ("21–22 (flows into 22)", "Share its public link.", 20.80, 22.10, "Light, practical."),
        ("22–25", "What work looks easy until you do it?", 22.20, 25.00, "Shop-floor conversation between people who have done the work."),
        ("25–27 (+ “—” 27–28)", "Follow for better build records.", 25.00, 27.20, "Warm sign-off."),
    ],
    "L3": [
        ("0–1 (+ “—” 1–2)", "Someone guessed your turbo.", 0.00, 1.50, "Amused frustration, conversational."),
        ("2–4", "The next person repeats it.", 2.00, 3.95, "Dry."),
        ("4–6", "Now the guess sounds like fact.", 4.00, 5.95, "Contrast “guess” and “fact”."),
        ("6–7", "The missing detail?", 6.00, 6.95, "Then a short pause."),
        ("7–8", "The brand.", 7.15, 7.95, "Plain, after the pause."),
        ("8–13", "Here's the fix: name the part, record its brand, on the build where it's used.", 8.00, 12.95,
         "Shift into a helpful tone at “Here's the fix”.", "Here's the fix: | name the part, record its brand, | on the build where it's used."),
        ("13–16", "We put both in FuelMyBuild's parts registry.", 13.00, 15.90, "Read “Fuel My Build's”."),
        ("16–18 (flows into 18)", "The build page has a public link.", 16.00, 18.30, "Even."),
        ("18–20", "Share that when someone asks.", 18.40, 20.05, "Helpful."),
        ("20–21", "Less guesswork.", 20.15, 20.95, "Relieved."),
        ("21–22", "More context.", 21.00, 21.90, "Relieved."),
        ("22–25", "Suppliers: what part gets misidentified the most?", 22.00, 24.80, "Direct to suppliers; leave it space."),
        ("25–27 (+ “—” 27–28)", "Follow for better build records.", 25.00, 27.20, "Easy sign-off."),
    ],
}


def spoken_words(text):
    t = text.replace("FuelMyBuild's", "Fuel My Build's").replace("FuelMyBuild", "Fuel My Build").replace("-", " ")
    return len(re.findall(r"[A-Za-z0-9']+", t))


def pages(line):
    rows, text, a, b, note = line[:5]
    if len(line) < 6:
        return [[text, a, b]]
    parts = [p.strip() for p in line[5].split("|")]
    assert " ".join(parts) == text, text
    n = [spoken_words(p) for p in parts]
    out, t = [], a
    for p, k in zip(parts, n):
        d = (b - a) * k / sum(n)
        out.append([p, round(t, 3), round(t + d, 3)])
        t += d
    return out


data = {}
for vid, lines in LINES.items():
    data[vid] = {"windows": [[l[2], l[3]] for l in lines], "subs": [pg for l in lines for pg in pages(l)]}
json.dump(data, open(os.path.join(HERE, "src", "vo.json"), "w"), indent=1)

md = ["# Lane A+ VO script for Wayne (W44, hook 1)", "",
      "Windows are seconds from the start of the 28.0 s master. The music bed already dips about 7 dB inside each window, and the burned-in subtitles use the same windows, so record to them. Line text is ChatGPT's VO column, unchanged; where a row was crowded the line runs into the next “—” row or across rows (the spec allows fragments to flow). Pace = spoken words over the window, counting “FuelMyBuild” as three words (Fuel My Build). “FuelMyBuild” is always read “Fuel My Build”.", "",
      "Lay the VO over `<id>-A-bed.wav` (music + SFX, no VO) from the renders branch, then master the full mix to -14 LUFS integrated, true peak -1 dBTP.", ""]
for vid, lines in LINES.items():
    md += [f"## {TITLE[vid]}", "", f"**Voice (spec VO DIRECTION):** {VOICE[vid]} Read “FuelMyBuild” as “Fuel My Build.”", "",
           "| # | Spec rows | VO line (exact) | Window (s) | Words | Pace target | Delivery |", "|---|---|---|---|---|---|---|"]
    for i, l in enumerate(lines, 1):
        rows, text, a, b, note = l[:5]
        w = spoken_words(text); d = b - a
        md.append(f"| {i} | {rows} | {text} | {a:.2f}–{b:.2f} | {w} | {w / d:.1f} w/s ({60 * w / d:.0f} wpm) | {note} |")
    tw = sum(spoken_words(l[1]) for l in lines); td = sum(l[3] - l[2] for l in lines)
    md += ["", f"Total: {tw} spoken words in {td:.1f} s of windows, about {60 * tw / td:.0f} wpm while speaking. Silence everywhere else.", ""]
open(os.path.join(HERE, "..", "vo-script.md"), "w").write("\n".join(md))
for vid, lines in LINES.items():
    for l in lines:
        w = spoken_words(l[1]); r = w / (l[3] - l[2])
        if r > 3.2: print("FAST", vid, l[1], round(r, 2))
print("ok")
