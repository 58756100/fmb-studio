# Lane C v3: three new concepts (replace C1 / G2 / P1 v2 remakes)

Checked against state/visual-bank.md. All characters, shops and brands are fictional; the CTA frame carries "Illustrative story" in #86868B. No end card: the CTA sits over the final story frame, the CTA text clears 0.4 s before the end, and the last frame equals frame 0 so the reel loops.

Principles applied to all three (from the ChatGPT W42 critique lessons as briefed; the critique file itself is not in the repo):
- Concrete stakes on screen inside 2 s, the core question asked by 5 s.
- One legible product record (one expanded entry, type at least 44 px on the 1080-wide canvas), never tiny rows.
- Believable payoff: no price recovery, no verification, no feature that is not live.
- VO at most 3 words a second, counted per beat below (URL read as five words).
- Live features only (build page with public URL, parts registry with brand, dated log entries with photos, garage and contributor attribution; sign-ups open). No ownership transfer shown or said.
- Turn lands at about 50 % of runtime (a little under the 55 % playbook floor, as in the other v2 files, because the critique wants the product earlier). Flag for the retention-editor.

---

## C3-COL: "Loser buys dinner"

- **Audience:** collectors
- **Title:** Loser buys dinner
- **Character + moment + turn:** Marisol (owner of a blue Evo VI) and her friend Dev bet dinner on the year her intake went on. She says 2021, he says 2017. The turn: she opens her build page's dated entry for the intake (June 2019, photo, logged by her). Both were wrong by two years, nobody wins, they split the check. FMB changes the outcome from a memory argument to a dated entry.
- **Tension (audience-tensions.md):** collectors' history lives in memory, not in a record ("one mechanic's memory" extended to the owner's own and her friends'). Not the sale, appraisal, records-request or owner-number tensions the bank already covers.
- **Format:** mini story, two voices (Marisol and Dev, short lines) plus narrator. 27 s.
- **Hook families:** stakes ("Loser buys dinner."), question ("When did the intake go on?"), relatable (every car friend has had this argument).
- **New visual device (one paragraph):** time shown as distance. The whole film is staged on a long cream measuring-tape ruler of years (2016 to 2024) running across the lower third of the white canvas; the camera pans along it instead of cutting. Each friend plants a red flag on the ruler at their guess, so the argument is literally 4 years of empty tape between two flags. The product is not a phone: when Marisol says "look it up", the tick at 2019 between the flags splits open and a frameless glass log card slides up out of the ruler (date, brand, one photo, "logged by Marisol"), then the flags slide toward it. The stakes prop is a restaurant check presenter that sits on the ruler. At the end the flags slide back to 2017 and 2021 and the 2019 card folds back into the tape, which is exactly frame 0. New motion idea: ruler pan and tick-opens-into-card. New to the bank: bet device, tape-measure timeline, frameless product card.
- **Beats (VO words per second in brackets):**

| t (s) | Voice | On screen |
|---|---|---|
| 0–2 | Eric: "Loser buys dinner." (3 words, 1.5) | Frame 0: Evo VI, intake cutout beside it, the ruler, flags "Marisol 2021" and "Dev 2017", chip "Loser buys dinner", check presenter on the tape. |
| 2–5 | Eric: "Marisol's Evo. When did the intake go on?" (8 words, 2.7) | Camera glides along the ruler between the flags; the empty middle shows a grey "?". Question asked by 5 s. |
| 5–8 | Marisol: "Twenty twenty-one. Hot summer." (4 words, 1.3) | Her flag bumps to 2021 with a tape-click. |
| 8–11 | Dev: "Seventeen. I held the light." (5 words, 1.7) | His flag bumps to 2017. The 4-year stretch of empty tape is highlighted in red. |
| 11–13 | Eric: "Marisol stopped arguing." (3 words, 1.5) | Beat of silence; both flags still. |
| 13–14 | Marisol: "Look it up." (3 words) | Tick at 2019 splits open. |
| 14–19 | Eric: "Intake, June twenty nineteen. Her own photo." (7 words, 1.4) | Turn at 14 s (52 %). One log card: "Intake · {brand}", date, one install photo, "logged by Marisol". Held 3 s before anything else moves. |
| 19–22 | Dev: "Two years off. Both of us." (6 words, 2) | Both flags slide toward 2019 and stop two years either side. |
| 22–24 | Eric: "They split the check." (4 words, 2) | Check presenter slides between the two flags. |
| 24–27 | Eric (CTA, over the story frame): "Date it once. fuelmybuild.com." (3 + 5 words, 2.7) | Flags return to 2017 and 2021, card folds into the tape, check back: frame 0. CTA text clears at 26.6 s. |

- **Hero assets (kit):** `kit/remotion/public/img/car-14.png` (Evo VI), `kit/remotion/public/img/part-04.png` (intake). Neither pairing is in the bank. Mechanic portrait, shoebox, receipts, odometer and masking tape are deliberately not used.
- **New images needed (ChatGPT image prompts, one image per request):**
  1. Check presenter (transparent PNG cutout): "Studio product photo of a closed black leatherette restaurant check presenter folder, slightly open at the top with a blank white paper bill tucked inside, three-quarter view from slightly above, soft natural shadow underneath, isolated on a transparent background, PNG, no text, no logos, no writing on the paper."
  2. Install photo for the log card (a photo, not a cutout): "Realistic phone-style photo of an engine bay of a blue Japanese sports sedan with a freshly installed red cone-filter air intake and black pipe, a fender cover and a few hand tools resting on it, warm garage lighting, 4:3, no text, no logos, no license plate."
- **Feature used:** build page with public URL, parts registry with brand, dated log entry with photo, contributor attribution ("logged by Marisol"). All live. Brand shown as a fictional placeholder in the row.
- **Not in the bank because:** nearest is C1 (shoebox) and C2 (service records), both sale scenes about proof for a buyer. This has no buyer, no sale and no money on the table except a dinner; the conflict is two friends' memories, the device is a bet on a year-ruler, and the product is a frameless card, not a phone. It avoids rolling-number counters, text threads, receipts and the Supra/240Z/turbo cluster.

---

## C3-GAR: "You never told me"

- **Audience:** garages
- **Title:** You never told me
- **Character + moment + turn:** Gus, owner of Pell Street Garage, and Mr. Okafor, who has come to pick up his silver R34 and refuses to pay a $1,850 head-gasket line, slapping the counter bell: "You never told me." Gus honestly is not sure he called. The turn: Gus swings the counter monitor around and shows the entry he logged on Tuesday with a photo of the weep. It does not prove Okafor was told; it shows what was found and when. Okafor: "You still should have called." Gus: "I should have." They talk about the car, not about who said what.
- **Tension:** garages, disputes: "you never told me about that" without a record. Not covered by G1 (knowledge leaves), G2 (Instagram), G3 (update calls), A-L2 or B-L2 (credit).
- **Format:** mini story with dialogue (Okafor and Gus, plus short narrator). 27 s.
- **Hook families:** dialogue cold open (bell slap, "You never told me."), stakes ($1,850 chip), visual shock (bell slam and split-flap clatter in the first second).
- **New visual device (one paragraph):** a split-flap board. A black-and-white mechanical flap display (airport style) sits across the top of the white canvas and carries the story: it clatters to "NEVER TOLD ME" at frame 0, then flips through the week as Gus recounts it (MON IN, TUE FOUND, WED PARTS, THU ...) with the THU flap staying blank, which shows the missing call without a line of VO. Time passes by flaps turning, with a mechanical click per letter. The product is shown on the shop's counter monitor (a flat landscape screen seen straight on, turned toward the customer), not a phone: one log entry fills it. The THU flap finishes on "SORRY", then the board flips back to "NEVER TOLD ME", which is frame 0 (the next customer's bell). New motion idea: split-flap clatter as clock and punctuation. New to the bank: mechanical flap board, counter bell, counter-monitor framing.
- **Beats:**

| t (s) | Voice | On screen |
|---|---|---|
| 0–2 | Okafor: "You never told me." (4 words, 2) | Bell slap and flap clatter. Board reads "NEVER TOLD ME". Red chip "Head gasket +$1,850". R34 on its tile behind the bell. |
| 2–5 | Eric: "Gus's shop. Okafor's R34. Did Gus tell him?" (8 words, 2.7) | Camera pushes to the board; "Did he?" flaps in grey. Core question by 5 s. |
| 5–9 | Gus: "Tuesday I found it. Wednesday, parts. Thursday..." (7 words, 1.8) | Board flips MON IN, TUE FOUND, WED PARTS, THU stays blank. Engine-block cutout on its red stand appears beside the R34 as the found problem. |
| 9–12 | Okafor: "Show me." Gus: "Okay." (3 words, 1) | Gus reaches out; counter monitor swings around into frame. |
| 12–17 | Eric: "Tuesday, nine ten. One photo. His name." (7 words, 1.4) | Turn at 12 s (44 %); entry fully legible by 13 s (48 %). One log entry fills the monitor: "Oil weep at head gasket", date, a large photo, "logged by Gus · Pell Street Garage". Held 3 s. |
| 17–21 | Okafor: "You still should've called." Gus: "I should have." (7 words, 1.75) | The entry stays on screen. The THU flap turns to "SORRY". |
| 21–24 | Eric: "The argument was about the car now." (7 words, 2.3) | Monitor turns back; Okafor looks at the R34. No stamp or tick. |
| 24–27 | Eric (CTA, over the story frame): "Log it. fuelmybuild.com." (2 + 5 words, 2.3) | Board flips back to "NEVER TOLD ME" and the bell sits where it started (frame 0). CTA text clears at 26.6 s. |

- **Hero assets (kit):** `kit/remotion/public/img/car-11.png` (R34 silver), `kit/remotion/public/img/obj/engine-block.png` (inline-six block on a red stand). The R34 appears in the bank only in grids, and engine-block only as text in a log entry, so neither is a main prop or a pairing.
- **New images needed (ChatGPT image prompts, one image per request):**
  1. Counter bell (transparent PNG cutout): "Studio product photo of a classic brass service desk call bell with a round plunger button on top, slightly worn, three-quarter view, soft shadow beneath, isolated on a transparent background, PNG, no text, no logos."
  2. Log photo of the weep (a photo, not a cutout): "Realistic close-up phone photo of the side of an inline six-cylinder engine at the cylinder head and block seam, with a thin dark oil film weeping along the gasket line, shop work light from the left, shallow depth of field, 4:3, no text, no logos."
- **Feature used:** build page with public URL, dated log entry with photo, garage and contributor attribution ("logged by Gus · Pell Street Garage"). All live. Not shown or implied: customer approval, client progress page, verification.
- **Not in the bank because:** nearest is G1 (Dave's notes) and G3 (update texts). G1 is about a record outliving a person, G3 is about a customer inbox. This is a confrontation at the counter about what was said; the record is honest about its limit (it shows when the shop wrote it down, not that the customer heard it), the clock is a mechanical flap board instead of a rolling number, and there is no phone and no text thread.

---

## C3-SUP: "Rattle. Fix?"

- **Audience:** parts suppliers (an exhaust brand)
- **Title:** Rattle. Fix?
- **Character + moment + turn:** Noor, who runs support at Calder Exhaust, gets a one-line ticket from Theo: "Exhaust rattles. Fix?" She knows his order number and nothing else: not the car, not who fitted it, not when. Each question costs a day. The turn: Theo finally sends his build page. One entry shows the Calder exhaust, the install date, the shop that fitted it and an underside photo. Noor circles one rear hanger in the photo and says it is worth checking, not that she has found the cause.
- **Tension:** suppliers, installs and outcomes are invisible after the sale; support is the moment that costs a brand. Different from P1 (where parts end up), P2 (sponsored spikes), P3 (reviews at 30,000 miles), A-L3 and B-L3 (misnamed parts in comments).
- **Format:** mini story with narrator, with Theo's replies as short second-voice lines. 27 s.
- **Hook families:** stakes ("Day 1" ticket chip with a one-star draft in the corner), curiosity gap ("Rattle. Fix? That's it."), direct callout ("Brands: this is your inbox.").
- **New visual device (one paragraph):** hang tags and time as weight. A single exhaust hangs by a red string from the top of the white canvas with one blank manila hang tag tied on that reads "Rattle. Fix?". Each question Noor must ask ("Which car?", "Which year?", "Who fitted it?") is handwritten on a new tag that thuds onto the pipe, which visibly sags a little more each day, with a small ink-stamped "Day 2 / Day 4 / Day 6" on each tag when Theo's slow answer arrives. The turn: Theo's link makes the tags drop off and the one remaining tag unfolds into a glass log card (the product shown as a tag turning into a record, not a phone): "Exhaust · Calder · Jul 22 · installed by Northline Auto" and one big underside photo. Noor circles the hanger in red. The pipe lifts back to level, the old tags are gone and the original tag alone hangs there with "Day 1" in the chip, which is frame 0. New motion idea: hanging, sagging, dropping tags (weight as time). New to the bank: tag-and-string, support desk, sag/lift.
- **Beats:**

| t (s) | Voice | On screen |
|---|---|---|
| 0–2 | Noor: "Rattle. Fix? That's it." (4 words, 2) | Frame 0: exhaust hanging, tag "Rattle. Fix?", chip "Ticket · Day 1", a grey one-star draft in the corner. |
| 2–5 | Eric: "Noor knows his order number. Nothing else." (7 words, 2.3) | Camera drops down the string; a red "?" appears over where the car should be. Core question by 5 s: "Which car?" is handwritten. |
| 5–8 | Eric: "Which car? Day two: a WRX." (6 words, 2) | Tag 2 lands; the pipe sags; the WRX cutout slides in small. |
| 8–11 | Eric: "Who fitted it? Day four: 'Some shop.'" (6 words, 2) | Tag 3; more sag; "Some shop" handwritten, grey. |
| 11–14 | Eric: "Day six. The rattle was still there." (7 words, 2.3) | Pipe at its lowest; the one-star draft grows slightly. |
| 14–16 | Theo: "Here's my build." (3 words, 1.5) | Turn at 14 s (52 %). Tags drop away; one tag unfolds. |
| 16–21 | Eric: "Exhaust, Calder. July twenty-second. Northline Auto." (7 words, 1.4) | One log card with parts-registry brand, date, shop attribution and a large underside photo. Held 3 s before anything moves. |
| 21–24 | Noor: "That rear hanger. Worth a look." (6 words, 2) | Red circle on the hanger in the photo. No claim that it is the cause. |
| 24–27 | Eric (CTA, over the story frame): "Get the link. fuelmybuild.com." (3 + 5 words, 2.7) | Pipe level, one tag, chip "Day 1": frame 0. CTA text clears 0.4 s before the end. |

- **Hero assets (kit):** `kit/remotion/public/img/part-05.png` (dual-tip exhaust), `kit/remotion/public/img/car-04.png` (WRX STI). The bank has no exhaust and no WRX as a hero.
- **New images needed (ChatGPT image prompts, one image per request):**
  1. Hang tag (transparent PNG cutout, reused for every tag): "Studio product photo of a single blank manila luggage hang tag with a reinforced hole and a short loop of red cotton string, slightly curled paper edge, lying flat, soft shadow, isolated on a transparent background, PNG, no text, no logos, no writing."
  2. Underside photo for the log card (a photo, not a cutout): "Realistic phone-style photo from below of a stainless dual-tip exhaust system mounted under a blue sedan on a two-post lift, rubber hangers visible along the pipe, shop lighting, 4:3, no text, no logos, no license plate."
- **Feature used:** build page with public URL, parts registry with brand ("Exhaust · Calder"), dated log entry with photo, garage attribution ("installed by Northline Auto"). All live. Not shown: any supplier page, supplier analytics, search or map.
- **Not in the bank because:** nearest is P1 (and P1-v2), where a brand follows a turbo after "Delivered". That is a brand-initiated search. This is a customer-initiated support ticket, the character is a person (Noor) answering one inbox message, the device is hanging tags and a sagging pipe, the product is a tag that unfolds, and the answer is a hint ("worth a look") rather than a trace. No red dashed line, no clue counter, no turbo, no Supra.

---

## Cross-check across the three (so they do not look like each other)
| | C3-COL | C3-GAR | C3-SUP |
|---|---|---|---|
| Time shown as | distance on a year ruler (camera pans) | mechanical flap board (clatter) | weight, sag and day stamps (tags) |
| Product framing | frameless glass card from the ruler | shop counter monitor, flat | tag that unfolds into a card |
| Camera idea | lateral pan along tape | punch-ins to the board | vertical drop down the string |
| Stakes | dinner (light) | $1,850 and a customer at the counter | open ticket, one-star draft |
| Car + part | Evo VI + intake | R34 + engine block | WRX STI + exhaust |
| New props | check presenter | counter bell, weep photo | hang tag, underside photo |
| Payoff | both wrong, split the check | record shows when, not who heard; "I should have" | a hint to check, not a diagnosis |

Open items for the producer: (1) New images are not yet generated; the three videos need them before Remotion work. (2) Flag the turn at 44 to 52 % to the retention-editor. (3) Voices: Marisol and Dev can use Chris plus a second voice from Wayne's new batch; Okafor and Gus likewise; Noor needs a new voice or Eric as fallback.
