# Lane B VO script for Wayne (W44, hook A)

Windows are seconds from the start of each 30.0 s master. The burned-in subtitles appear on exactly these windows, and the music bed dips 7 dB inside each one (80 ms before the start to 200 ms after the end), so record to them. Line text is ChatGPT's VO column, unchanged; fragments that ChatGPT split across one-second rows are joined into the sentence they form, and each line starts on its row's second (two start 0.05–0.15 s early to keep the pace easy: “Maya's 240Z.” at 1.85 and “Demo Brand A.” at 19.95). Pace counts spoken words, with “FuelMyBuild” as three (Fuel My Build) and “240Z” as “two-forty Z”. Nothing needs more than about 3 words a second; where a line sits at 3.0 the note says so.

**Laying the VO:** each video has `2026-W44/lab/<id>-A-bed.wav` on the `renders` branch (music + SFX, no VO, 48 kHz 24-bit, ducked already). It sits at mix-reference level (music about -24 dB RMS, SFX about -25 dB RMS), so put the VO at about -20 dB RMS on top, then master the full mix to -14 LUFS integrated and -1 dBTP (`ffmpeg -af loudnorm=I=-14:TP=-1:LRA=9`). The `-A.mp4` masters already carry the same bed mastered to -14 LUFS, with the subtitles burned in.

## B-L1 · Collectors · The work the photo misses

**Voice: Eric** (spec VO DIRECTION). Calm, observant, mildly tense. About 150 wpm while speaking, with room for the visual holds. Emphasise “installation”, “underneath” and “inspect”. Brief pause after “Installation?” and before the product reveal. No dramatic promise of recovered value.

| # | Spec rows | VO line (exact) | Window (s) | Words | Pace | Delivery | Emphasis |
|---|---|---|---|---|---|---|---|
| 1 | 0–1 (+ “—” 1–2) | Where's the proof? | 0.00–1.30 | 3 | 2.3 w/s (138 wpm) | Calm, observant, a little tense. Then about 0.5 s of air while the photo opens. | proof |
| 2 | 2–3 | Maya's 240Z. | 1.85–2.95 | 3 | 2.7 w/s (164 wpm) | Plain introduction; lands as the car settles. Read “240Z” as “two-forty Z”. | Maya's |
| 3 | 3–5 | Brake kit: visible. | 3.00–4.95 | 3 | 1.5 w/s (92 wpm) | Two beats: “Brake kit:” (as the wheel punches in at 3.0), small lift on “visible.” (caliper shows at 4.0). | visible |
| 4 | 5–6 | Installation? | 5.00–5.75 | 1 | 1.3 w/s (80 wpm) | Slow and curious, then a brief pause (the spec asks for it). Nothing spoken 5.75–6.0. | installation |
| 5 | 6–8 | These photos don't show it. | 6.00–7.95 | 5 | 2.6 w/s (154 wpm) | Matter-of-fact; the gallery freezes at 7.0 on “show it”. | don't |
| 6 | 8–10 | But the work is underneath. | 8.00–9.95 | 5 | 2.6 w/s (154 wpm) | Turn on “But” with the hard cut at 8.0; lean into “underneath”. | underneath |
| 7 | 10–13 | Calipers, brackets, brake lines. | 10.00–12.95 | 4 | 1.4 w/s (81 wpm) | A list, one item per second: calipers 10, brackets 11, brake lines 12. Each lands on its tick. | calipers, brackets, brake lines |
| 8 | 13–15 | Which photos would you send? | 13.00–14.95 | 5 | 2.6 w/s (154 wpm) | A genuine question to the viewer; let it hang (music thins at 14). | send |
| 9 | 15–18 | Maya opens the build on FuelMyBuild. | 15.00–17.95 | 8 | 2.7 w/s (163 wpm) | Unhurried. Small breath after “the build” (about 16.6; music cuts at 16.0), then land “FuelMyBuild” on the reveal at 17.0. Read “Fuel My Build”. | FuelMyBuild |
| 10 | 18–21 | Brake kit, brand, dated install log. | 18.00–20.95 | 6 | 2.0 w/s (122 wpm) | Plain inventory, no sales lift: “Brake kit” 18, “brand” 19, “dated install log” 20. | dated |
| 11 | 21–25 | Then the photos: before, during, after. | 21.00–24.95 | 6 | 1.5 w/s (91 wpm) | “Then the photos:” at 21, then one word per second: before 22, during 23, after 24. | before, during, after |
| 12 | 25–27 | Now there's work to inspect. | 25.00–26.95 | 5 | 2.6 w/s (154 wpm) | Quiet resolve; emphasis on “inspect”. No promise of value (music returns at 26). | inspect |
| 13 | 27–29 | Follow for documented builds. | 27.00–28.95 | 4 | 2.1 w/s (123 wpm) | Warm, low-key sign-off. Silence 29–30 (the loop). | documented |

Total: 58 spoken words over 27.6 s of windows, about 126 wpm while speaking. Silence everywhere else.

## B-L2 · Garages · Same car. Different proof.

**Voice: Chris** (spec VO DIRECTION). Conversational, like a customer weighing two shops. About 150 wpm. Slight frustration on “Who did the work?”. Pause after “can't answer.” Deliver the attribution plainly, without a sales-voice switch.

| # | Spec rows | VO line (exact) | Window (s) | Words | Pace | Delivery | Emphasis |
|---|---|---|---|---|---|---|---|
| 1 | 0–2 | Same car. Different proof. | 0.00–1.95 | 4 | 2.1 w/s (123 wpm) | Two even beats with a small gap: “Same car.” / “Different proof.” | different proof |
| 2 | 2–4 | Nora needs an engine swap. | 2.00–3.95 | 5 | 2.6 w/s (154 wpm) | Conversational, like a customer explaining her job. | engine swap |
| 3 | 4–6 | Two garages. Same polished Miata. | 4.00–5.95 | 5 | 2.6 w/s (154 wpm) | Weighing two options: “Two garages.” (4.0) “Same polished Miata.” (5.0) | same |
| 4 | 6–8 | Who did the work? | 6.00–7.95 | 4 | 2.1 w/s (123 wpm) | Slight frustration on “Who did the work?” (music dips at 7.0 under “the work”). | work |
| 5 | 8–10 | Shop A's gallery shows the finish. | 8.00–9.98 | 6 | 3.0 w/s (182 wpm) | Plain, a little dry; just about 3 words a second, keep it relaxed. | finish |
| 6 | 10–12 | But who installed the engine? | 10.00–11.95 | 5 | 2.6 w/s (154 wpm) | Raises the bar; firmer on “engine”. | installed, engine |
| 7 | 12–14 | A photo can't answer. | 12.00–13.85 | 4 | 2.2 w/s (130 wpm) | Plain. Then a real pause after “can't answer” (13.85–14.0, the music drops out 13.0–13.6). | can't |
| 8 | 14–18 | So Nora opens Shop B's public build on FuelMyBuild. | 14.00–17.95 | 11 | 2.8 w/s (167 wpm) | Easy, not a sales voice. Land “public build” around 16 (music cuts) and “FuelMyBuild” on the reveal at 17.0. Read “Fuel My Build”. | public build |
| 9 | 18–20 | Garage: Shop B. Contributor: Eli. | 18.00–19.95 | 5 | 2.6 w/s (154 wpm) | Deliver the attribution plainly, like reading a label: “Garage: Shop B.” (18) “Contributor: Eli.” (19) | Shop B, Eli |
| 10 | 20–22 | Dated log. Install photos. | 20.00–21.95 | 4 | 2.1 w/s (123 wpm) | Two short labels: “Dated log.” (20) “Install photos.” (21) | dated |
| 11 | 22–24 | Now we see who did what. | 22.00–23.98 | 6 | 3.0 w/s (182 wpm) | Settled; the point of the piece. About 3 words a second, unhurried (music returns at 23). | who did what |
| 12 | 24–26 | Which would you call? | 24.00–25.95 | 4 | 2.1 w/s (123 wpm) | Genuine question to shop owners and customers; no winner implied. | call |
| 13 | 26–28 | Follow for documented builds. | 26.00–27.95 | 4 | 2.1 w/s (123 wpm) | Low-key sign-off. Silence 28–30 (the loop). | documented |

Total: 67 spoken words over 27.3 s of windows, about 147 wpm while speaking. Silence everywhere else.

## B-L3 · Suppliers · A guess gets the credit

**Voice: Eric** (spec VO DIRECTION). Curious, dry, investigative. About 150–155 wpm. Read “I think” tentatively and “Definitely B” with misplaced confidence, same narrator. Pause briefly before “Demo Brand A.” Keep the reveal factual rather than triumphant.

| # | Spec rows | VO line (exact) | Window (s) | Words | Pace | Delivery | Emphasis |
|---|---|---|---|---|---|---|---|
| 1 | 0–2 | Who made this turbo? | 0.00–1.95 | 4 | 2.1 w/s (123 wpm) | Curious, dry, investigative. | turbo |
| 2 | 2–3 | Jules asks. | 2.00–2.95 | 2 | 2.1 w/s (126 wpm) | Matter-of-fact aside. | Jules |
| 3 | 3–4 | First reply: | 3.00–3.95 | 2 | 2.1 w/s (126 wpm) | Neutral setup. | first |
| 4 | 4–6 | “Demo Brand B, I think.” | 4.00–5.95 | 5 | 2.6 w/s (154 wpm) | Quote the comment: tentative, trailing off on “I think”. | I think (tentative) |
| 5 | 6–7 | Next reply: | 6.00–6.95 | 2 | 2.1 w/s (126 wpm) | Neutral setup. | next |
| 6 | 7–8 | “Definitely B.” | 7.00–7.95 | 2 | 2.1 w/s (126 wpm) | Same narrator, misplaced confidence: “Definitely B.” | Definitely |
| 7 | 8–11 | But that's the same guess, copied. | 8.00–10.95 | 6 | 2.0 w/s (122 wpm) | Turn on “But” (8.0, the pivot hit); dry, a little amused on “copied”. | same, copied |
| 8 | 11–13 | Now Brand B gets the credit. | 11.00–12.98 | 6 | 3.0 w/s (182 wpm) | Flat statement of the problem; just about 3 words a second. | credit |
| 9 | 13–15 | So where's the owner's record? | 13.00–14.90 | 5 | 2.6 w/s (158 wpm) | The investigative question. | owner's record |
| 10 | 15–18 | Jules opens the Supra's build on FuelMyBuild. | 15.00–17.98 | 9 | 3.0 w/s (181 wpm) | Even. Land “FuelMyBuild” on the reveal at 17.0 (music cuts at 16.0). Read “Fuel My Build”. Just about 3 words a second. | build |
| 11 | 18–19 | Turbo kit. | 18.00–18.95 | 2 | 2.1 w/s (126 wpm) | Reading a row label. | turbo kit |
| 12 | 19–20 | Brand: | 19.00–19.75 | 1 | 1.3 w/s (80 wpm) | “Brand:” then a brief pause (the spec asks for it). | brand |
| 13 | 20–21 | Demo Brand A. | 19.95–20.98 | 3 | 2.9 w/s (175 wpm) | Factual reveal, not triumphant. Lands at 20.0 with the field. | Demo Brand A |
| 14 | 21–24 | Then the install log and photos. | 21.00–23.95 | 6 | 2.0 w/s (122 wpm) | Plain; “install log” about 22, “photos” about 23. | log, photos |
| 15 | 24–26 | We check before repeating. | 24.00–25.95 | 4 | 2.1 w/s (123 wpm) | Quiet principle; no lecture. | before |
| 16 | 26–28 | Which brand gets misnamed? | 26.00–27.95 | 4 | 2.1 w/s (123 wpm) | Question to suppliers (music returns at 27). | misnamed |
| 17 | 28–30 | Follow for documented builds. | 28.00–29.95 | 4 | 2.1 w/s (123 wpm) | Low-key sign-off; ends 29.95. | documented |

Total: 67 spoken words over 29.0 s of windows, about 138 wpm while speaking. Silence everywhere else.
