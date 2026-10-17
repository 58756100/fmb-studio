# FuelMyBuild playbook pack for the sprint (lane B context)


---
## From state/production-standards.md

These override older notes in skills, lab files and past scripts wherever they disagree.

## Finished video
- **No on-screen labels like "Illustrative example" / "Illustrative story" / "demo URL".** Use fictional names and records, keep every claim true to live features, and let it look like a real product film.
- **No burned-in captions or subtitles by default.** On-screen headlines and story text stay. Subtitles are only for internal review copies or when Wayne asks for a captioned test.
- **Length 30–60 s, set by the concept.** Write to what the story needs: a one-turn idea runs 30–35 s; a story with a setup, a twist and a payoff can take 45–60 s. Never squeeze a 60 s story into 30 or pad a 30 s idea to 60. State the target length and why at the top of each script.

## Voice: conversational, not robotic
- Write how people actually talk: full flowing sentences that connect ("so", "and then", "which is why", "honestly"), natural fillers used sparingly ("look,", "okay so", "right?"), contractions, and a little personality. No stacks of three-word fragments.
- Each line hands off to the next. A viewer who only hears the audio should understand the story.
- Within the first 3–5 s the viewer must know what the video is about and who it's for.
- ElevenLabs: eleven_multilingual_v2 (or v3 for dialogue). Keep stability lower for liveliness and let the voice breathe; don't over-tighten pauses.

## Visual flow: transitions that mean something
- Every transition carries the story: the object we talk about becomes the next scene (match cuts, morphs, a card that opens into the next idea, the camera following an action). No cut-to-unrelated-layout.
- Text moves with the voice and with the scene: it enters from where the action is and leaves into the next beat. Nothing just pops on and sits there.
- Always alive (motion skill): no still half-second.
- You may bring in new animation assets (Lottie, SVG packs, open-licence motion libraries, new remocn pieces) when they lift the work. Log the source and licence in the project.

## Call to action: rotate, push to fuelmybuild.com
Use a different CTA family on consecutive posts. Each CTA fits the story's audience:
- **Done-for-you:** "Comment BUILD and we'll set up your build page for you. No setup on your end." / "DM us your car and we'll build the page." (needs comment/DM replies, see the 2-week plan)
- **Link:** "Your build page is waiting at fuelmybuild.com. Link's in the bio." / "Start your car's record at fuelmybuild.com."
- **Audience-specific:** shops "DM 'SHOP' and we'll load your first builds for you"; brands "DM 'PARTS' and we'll show you where your parts end up" (no supplier-page promise until it's live).
- **Share/save:** "Send this to the friend who still keeps receipts in a glovebox."
Never stack two CTAs. The CTA sits over the final story frame.

## Uniqueness across all lanes
- One shared registry: `state/visual-bank.md` (premises, devices, props, car+part pairings, looks) covers lane 0, A, B and C. Every lane checks it before writing and adds to it once made.
- ChatGPT lanes get the list of premises already taken (premise lines only for lane A, so it stays blind to our style; the full bank for lane B).
- The same premise never ships twice across lanes. Hook variants of one body count as one premise.

## ChatGPT lanes (A and B)
- ChatGPT owns the concept, story, script and hooks. Claude owns the build and may upgrade its UI, layout, motion and transitions to production level (it should never look "AI" next to the other lanes). For lane A, keep ChatGPT's concept and its broad look (palette, mood) but craft the execution properly.

## Images
- Build from the image bank (`kit/remotion/public/img/bank/`, see `lab/image-requests/image-bank-v2.md`). Prefer real-looking photos and clean cutouts over code-drawn stand-ins. If a scene needs an image the bank lacks, add a prompt to the next image request rather than faking it.

---
## From state/learnings.md

## Live FMB features (safe to show)
- Build pages, parts registry with brand, public URL, log entries, photos, garage and contributor attribution (W42 brief)
- Sign-ups open at fuelmybuild.com (Wayne, 2026-10-14)
- Log entries can carry a past date, e.g. an install from 2019 (Wayne, 2026-10-14)
- Ownership transfer: not live; hint only ("the record stays with the car"), at most once, never shown as a flow (Wayne, 2026-10-14)

## Proven
-

## Promising
- 2026-10-10 supplier reel: Notion-style white canvas + iOS UI + studio cutouts approved by Wayne as the house look (no metrics yet)

## Disproven
-

## Body diagnostics (from retention curves)
| Reel | Drop at (s) | What was happening | Fix applied next |
|---|---|---|---|

## Next tests
- 2026-10-11 review: no posts yet (nothing posted in the last 14 days), so no metrics or retention curves. W42 is the baseline week; first real read on Sun Oct 18 (hooks A vs B vs C per concept, drop second per Short).
- Body retention: does a named character in the first 5 s beat a problem statement? (Wayne reports hooks hold to 3-7 s, then drop)
- Dialogue (two voices) vs single narrator

## Offers (Wayne, 2026-10-15)
- Done-for-you setup: "we set up your build page for you, no setup on your end." Usable in CTAs (comment/DM keyword or link in bio).

---
## From .claude/skills/motion/references/house-style.md

- Canvas: white or #F5F5F7. One dark beat per video at most.
- Type: Inter variable only. Headlines use opsz 32, weight 600, -0.038em tracking, 104–124 px, second line #86868B. Sentence case, with no all-caps, monospace or decorative letter-spacing.
- Accent: #F43034 only, on the key word, the caret, the verified seal and the CTA.
- UI: Apple-standard iOS 26 (402x874 pt screens, glass, floating tab bar, sheets, inset grouped lists), in an iPhone frame or full-bleed. Simulated FMB screens must look shippable.
- Imagery: studio cutouts (transparent PNG) on soft tiles with contact shadows. Builders use their car as their avatar. No stock photos, glow blobs or gradient washes.
- Motion: springs with light overshoot, staggered 3–6 frames, ease-out entrances, a camera move at every cut, and a typewriter with a red caret for typed moments.
- Sound: every on-screen action has its own sound. Duck music under the voice, cut to silence before a reveal, master at -14 LUFS.
- Layout: headline band in the upper middle (top 260–420 px), product below it, bottom 360 px clear of important content.

---
## From .claude/skills/script-producer/references/retention-playbook.md

## The diagnosis

FMB reels hold the hook (0–3 s) and lose people between about 3 and 7 seconds. That window is the
**seam**: the moment the video stops making a promise and starts delivering. The seam fails when:

1. **The body changes genre.** The hook is a story or a provocation, then the body becomes an
   explanation, a problem list or a product pitch. The viewer signed up for a story and got a slide.
2. **The first body line is setup.** "Every week, builders post…" is context. Context is where thumbs move.
3. **The promise is paid too late, or never.** The hook opens a question; the body walks away from it
   to explain the category, and the answer comes at 20 s (or never).
4. **Lists instead of causes.** "Comments, stories, threads…" reads as a list and has no forward pull.
   Stories run on *but* and *therefore*, never *and then*.
5. **The brand arrives as an ad.** "So we built X" before the viewer cares turns content into an ad,
   and people skip ads.

## The rules every script must pass

1. **Bridge, don't restart.** The first body line must answer or escalate the hook's exact words,
   inside 1.5 s of the hook ending. Hook: "Three words that kill a sale." Body line 1: "'Any service
   records?' Marcus had none." Never "Let's talk about…"
2. **Cold open into a person.** Name a specific person or car within the first 5 s (Marcus, the white
   '99 Supra, a shop called Kessler). People follow people, not categories.
3. **Pay the hook by 8 s, then open a bigger loop.** Give a partial answer early (proof that watching
   pays), and in the same breath open the next question ("…but that wasn't the expensive part").
   Always open the next loop before closing the current one.
4. **A re-hook every 4–6 s.** At every beat change, a turn word plus a visual reset: "Then it got
   worse." / "Here's the part nobody tells you." / "He checked the log." / a hard cut / a camera move /
   a new screen. Write it into the beat sheet, not just the edit.
5. **But / therefore.** Every beat is caused by the one before. Read the beats with "but" or
   "therefore" between them; if "and then" fits, cut or merge the beat.
6. **Show the moment, don't describe the category.** Not "comments get lost", but the actual comment
   "what turbo is that?? 👀" sliding out of view while the reply count ticks to 214.
7. **The product is the turn, not the topic.** FMB appears as the thing that changes the character's
   outcome, at 55–75 % of the runtime, shown working rather than announced. "So we built FuelMyBuild"
   is allowed once a week, in a brand piece, never in a story piece.
8. **Specific beats vague.** "$1,400 coilovers, installed March 12" beats "expensive parts". Never
   invent statistics about the market: specifics belong to characters and the product UI.
9. **Short.** Default 22–32 s. A body longer than 25 s needs a reason (a twist, a reveal) at every
   6 s mark.
10. **End on a loop.** The last line or frame sets up the first frame, so the replay feels seamless.
    The CTA is one line, on screen and in the voice, after the payoff and never before it.

## The beat sheet (required for every script)

Write the script as a table, one row per beat, 2–4 s per beat:

| t (s) | Voice | On screen | Why keep watching (the open question) | Re-hook device |
|---|---|---|---|---|

The *why keep watching* column may never be empty and may never repeat the previous row. If a beat
has no open question, it's dead: cut it, or move the next question earlier.

## Retention-editor scoring (the critic pass)

Score each 3-second window from 0–2:
- 0 = a viewer could leave and miss nothing
- 1 = mild curiosity
- 2 = they need to see what happens next

Any 0 in the 3–9 s windows fails the script. Average under 1.4 fails. Fix by deleting setup, moving
the reveal earlier, sharpening the turn word, or splitting a long sentence across a visual change.

## Formats to rotate (the same week must use at least 5)

| Format | Shape | Best for |
|---|---|---|
| Mini story | Character, want, obstacle, turn, payoff | All audiences |
| Mystery / investigation | "Something didn't add up…" clues, reveal | Collectors, suppliers |
| POV skit | Two voices (buyer/seller, owner/garage), dialogue only | Garages, collectors |
| Before / after | The old way runs, smash cut, the new way runs | Garages |
| Myth vs fact | Three myths, each busted with proof | Suppliers |
| Countdown with escalating stakes | 3 → 1, the last is the shocker | All |
| Trailer | Movie-trailer cadence, title cards, a "this summer…" voice | Brand pieces |
| Confession / founder note | "We got this wrong" | Brand trust |
| Challenge / test | "We tried to find who made this turbo" | Suppliers |
| Data reveal | One number that changes how you see the problem | Suppliers, garages |

## Hook families (alternate, and never use the same family twice in a row on the feed)

curiosity gap · contrarian claim · in-medias-res story ("He lost the sale at 'any receipts?'") ·
specific number · direct callout ("If you run a shop…") · visual shock (the moment, no words for 1 s) ·
question you can't answer · POV line · "nobody tells you" · stakes/fear · entertainment/absurd
("This turbo has had more owners than my ex").

## How the system learns

The analyst attaches per-reel numbers to each hook family, format, body structure and runtime.
YouTube Shorts supplies a real retention curve: find the exact second where the curve drops, and
log what was on screen and in the voice at that second in `state/learnings.md`. Next week's
scripts must state which learning they apply.

---
## From state/visual-bank.md

**Every new concept must be checked against this file before it is scripted, and added to it once made.** Check premise, story device, main props and hero car + part pairing. Built 2026-10-14 from W42 scripts, W44 lab A, B and C files.

House look unless stated: white/#F5F5F7 canvas, Inter, red #F43034 accent, iOS 26 UI, studio cutouts with soft contact shadows, #86868B grey for secondary text, "Illustrative story" on the CTA frame. Every video so far ends by matching its last frame to frame 0.

Notes: S0 (brand film) has no script in the repo, so it is not banked. lab/critiques/2026-W42-chatgpt.md is not in the repo; C-lane "v2" rows record what the v2 files say they changed.

## Table

| id | lane | concept / premise | story device | key visuals and props | hero car / part | palette / look |
|---|---|---|---|---|---|---|
| C1 | W42 feed, collectors | Marcus sells his Supra; the buyer wants proof, the shoebox receipts are blank | falling offer chip ($68,000 down to $61,000, then back up on the phone) | shoebox, faded thermal receipts dissolving, coffee ring, lid-to-phone swap, build page with dated turbo entry, offer chip | '99 Supra car-01 + turbo kit, coilovers | house look; red only on the dropping chip |
| C2 | W42, collectors | buyer asks a 240Z seller for service records; seller stalls then sends a link | text-message thread, typing dots as villain, banner interrupt | iMessage thread, typing indicator at 3x, new-listing banner, link-preview card, mechanic portrait as shop avatar, "Logged by" lines | 240Z car-05 + carburetors (rebuild) | house look; blue/grey iMessage bubbles, red tapback |
| C3 | W42, collectors | owner four of a 240Z finds three oddities; owner three's page answers them | clue counter 1/3 with redacted chips that unredact | odometer wheel, scribble circle on rear quarter, masking tape "ask Ray", empty manila folder, glovebox card slide-out (one dark beat), typewriter URL | 240Z car-05 + odometer, cluster scan | house look + one dark frame |
| G1 | W42, garages | lead tech Dave quits Friday; Monday his Supra is back with a boost leak | rolling clock Fri 5:42 pm to Mon noon | shop keys on counter, line-drawn lift, call screen to voicemail, owner text banner, vacuum-line photo with scribble circle, stacked "logged by Dave / Leo" entries | Supra car-02 + turbo kit | house look; keys loop |
| G2 | W42, garages | two shops with identical feeds; customer asks for one they've done | mirrored split screen, frame-locked symmetry then rupture | two phones, identical photo grids, doubled DM bubbles, link card, rolodex part rows, red check stamp | green E30 car-08; grid of GR86, Integra, Civic, Corvette, NSX, Mustang | house look; rgb glitch on one side |
| G3 | W42, garages | shop owner Rita gets nine "any update?" texts while under a Tacoma | buzz counter 1 to 9, stacking thread cards | face-down buzzing phone, wall clock, sticky note "Due 3 pm", triple link share sheets, Miata and Civic avatars | Tacoma car-06 (+ red Miata, yellow Civic avatars) | house look; counter red then grey |
| P1 | W42, suppliers | follow one turbo after "Delivered" | clue counter 1/3, "Dead end" stamps, one red dashed line | shipping box, order card, tracking dots, tagged-post grid, review "Arrived fast", blank search bar, supplier page (simulated) | Supra car-01 + turbo kit (Korvane) | house look; red dashed line spine |
| P2 | W42, suppliers | $2,400 sponsored post spikes then flatlines; 19 free builds do not | one animated line chart, second stepping line | red price tag, post card with countdown, chart zoom-out to 30 days, grid of 19 cars, snapping grey lines, supplier page | GR86 car-15 + bronze wheel part-03; red Miata | house look; chart only |
| P3 | W42, suppliers | five-star review at 0 miles vs proof at 30,000 | myth / fact split with "Busted" stamps, odometer as clock | star review card, group chat burying the 18k message, odometer top right, myth 3 empty fact panel, supplier page | Civic EG car-10 + coilovers part-02 | house look; red stamps |
| X1 | W42, everyone | owner, shop and turbo brand each hold a third of the Supra's history; wastegate cracks | three POV chapters, whip-pans, red outline follows the speaker | chapter tags, clipboard into drawer, order card fading, cracked wastegate, boost gauge, share sheet, three name tags on car | Supra car-01/03 + turbo, wastegate; mechanic portrait | house look |
| X2 | W42, everyone | Supra's record outlives the shop, the part and the owner, 2026 to 2049 | trailer year title cards, loss by subtraction, silence drop | rolling years 2026/31/38/44/49, mechanic dissolve, "Closed" sign, grey turbo "Discontinued", scattering receipts, empty outline | Supra car-01/02/03 + turbo | house look; Brian trailer voice |
| A-L1 | A (ChatGPT spec, A+ render) | insurer or appraiser asks for proof of brake work; blank evidence panel gets filled | empty panel fills field by field (part, brand, date, photo, garage) | evidence panel, photo sliding up to reveal the kit, paper record, DEMO labels, build-page crop | 240Z car-05 + brake kit part-06 | dark dossier #171A18, paper #F2EBDD, amber #E6A16A; Barlow Condensed, Source Sans 3, IBM Plex Mono |
| A-L2 | A | same Miata photo from Shop A and B; show the work behind it | stacked identical panels with a hesitating selection outline, exact return to opening crop | A/B Miata panels, job-folder record stack, garage and contributor credit, DEMO labels | red Miata car-09 + brake kit | warm dark #22211E, amber #E9BB62 |
| A-L3 | A | "what turbo is that?" gets a guessed brand that hardens into fact | comment-thread guess, "I think" struck out | question bubble, duplicated reply bubbles, empty BRAND field with caret, plain link reply, part/brand fields | Supra car-01 + turbo kit | dark #1D1B20, lilac #C8B4E8 |
| B-L1 | B (ChatGPT scripts) | appraisal inquiry asks for brake-work documentation; photos show the car, not the install | inquiry card beside photo, gallery swipe, before/during/after photos | inquiry card, wheel-area punch-in, wheel-off illustration, build page, "Illustrative example" tag | 240Z (Maya) + brake kit | house look |
| B-L2 | B | Nora needs an engine swap; two shops show identical Miata photos, Shop B has a build link | identical A/B shops, credit missing, then attribution | paired Miata tiles Shop A / B, Nora contact card, link tap, garage + contributor chips | red Miata car-09 | house look |
| B-L3 | B | Jules asks what turbo; "Brand B, I think" becomes "Definitely B" | comment-thread guess, copied wording aligned | question bubble, two replies, alignment click, parts row, install log | Supra car-01 + turbo kit | house look |
| C1-v2 | C (Claude remake) | C1 with Dale named, no price rebound | offer chip that stalls and slides out; buyer asks again | same shoebox/receipt/phone props, alignment-since entry, CTA over closing box | Supra car-01 + turbo, coilovers | house look |
| G2-v2 | C | G2 with $9,000 chip, crack at 5.3 s, link at 10.5 s | mirrored split screen, shop two keeps typing | same two phones, DM threads, one expanded log entry, "Seen" | E30 car-08 + engine swap | house look |
| P1-v2 | C | P1 brand-level: "Where do your turbos end up?" | one red dashed line past "Delivered" to an empty car slot | tracking card, review, empty dashed slot, Supra snaps in, "Concept in development" chip | Supra car-01 + turbo (Korvane) | house look |
| C3-COL | C v3, collectors | Marisol and Dev bet dinner on the year her Evo's intake went on (she says 2021, he says 2017); her build page says Jun 14, 2019; nobody wins, they split the check | year ruler as distance: one continuous lateral camera (no cuts), the argument is red-tinted tape between two flags; the 2019 tick splits and the log card rises out of the tape, then folds back | cream year ruler 2016-2024 with plucking ticks, rippling red pennant flags on pins, black check presenter, "?" on the tape, grey leader line, frameless frosted log card, "2 years" measure lines | Evo VI car-14 + intake part-04 (Velden Air, fictional) | house look; cream tape #F2EBDD, red tint only on the gap |
| C3-GAR | C v3, garages | Okafor slaps the counter bell: "You never told me." Gus walks the week and Thursday is blank; the build log shows the weep logged Tuesday by Gus; Okafor is still right that he should have called | airport split-flap word board (events, not a clock); the THU row stalls blank, twitches, then flips to SORRY; 1-frame punch-ins with a lens settle; counter monitor swivels from its back | split-flap board, brass counter bell with ring-out arcs, red "Head gasket · $1,850" chip that wipes to grey, engine block on red stand, flat counter monitor with a desktop build-log entry | R34 car-11 + engine block (head-gasket weep) | house look + black flap board |
| C3-SUP | C v3, parts suppliers | Calder's support (Noor) gets "Rattle. Fix?"; six days of one-line answers and a return threat; Theo says "Just read my build", which shows car, fitter and date and points at the rear hanger | time as weight: manila tags pile onto an exhaust hanging from a cotton string and the pipe sags per answer; the first tag flips into the log card; a new tag path-rides onto the hanger in the photo | off-white cotton string, manila hang tags with ink questions and pencil answers, dual-tip exhaust, dashed car outline filled by the WRX, ticket chip counting days (value-swap), red "Return?" chip | WRX STI car-04 + exhaust part-05 (Calder, Northline Auto fictional) | house look; manila tags, cotton string |

## Overused, avoid next
- Phone-frame build page reached by push-through (about 17 videos). Use a different framing of the product.
- Rolling-number counter or clock as the spine (C1, G1, G3, P2, P3, C3 odometer, P1 hook C).
- Text-message / comment thread with bubbles (C2, G3, G2 x2, A-L3, B-L3, P3 group chat).
- Identical A/B shops or photos (G2, G2-v2, A-L2, B-L2). Do not use "two identical X, one proves it" again.
- "Guess hardens into answer" comment thread (A-L3, B-L3, and "what turbo is that?").
- White '99 Supra as hero (C1, G1, P1, X1, X2, A-L3, B-L3, C1-v2, P1-v2) and turbo kit (same list plus P1-v2). 240Z in four (C2, C3, A-L1, B-L1). Brake kit twice (A-L1, A-L2).
- Clue counter "1/3" / chapters / myth numbers (C3, P1, P3, X1).
- Red dashed line (P1, P1-v2), red stamp or check (P1, P3, G2).
- Shoebox and receipts (C1, C1-v2, X2); mechanic portrait (C2, C3, X1, X2); shop keys (G1); wall clock (G3).
- "Dated install entry, March 12/14" and fictional Kessler Motorsport (G1, P1, X1, X2, P1-v2).
- Buyer-and-seller sale scenes (C1, C2, C1-v2); lost-record-on-departure (G1, X2).
- Dark dossier look (A lane only; keep it there). Whip-pan and push-through are on almost every cut.

## Not yet featured (candidates)
Cars: WRX STI car-04, Evo VI car-14, RX-7 car-13, R34 car-11 (grids only), Miata black car-19, AE86 car-12 (grid only; cutout has artifacts), NSX car-07 and Mustang car-17 and Corvette car-18 (grid or photo only). Parts: exhaust part-05, intake part-04 (log thumbnail only), header (crop of part-01/07). Objects: engine-block, work-glove, dash-panel, avatar-badge, car-lift, price-tag, hand-holding-phone (check each before use).

---
## Example scripts (week 44 lane C, made by Claude)

### C3-COL: Loser buys dinner

Lab lane C v3, collectors. Concept approved by Wayne (weeks/2026-W44/lab/C/v3-concepts.md). Checked against state/visual-bank.md and lab/critiques/2026-W42-chatgpt.md.

- **Audience:** collectors
- **Format:** mini story, with dialogue (Marisol and Dev) and a narrator
- **Runtime:** 27.0 s. Hook 0–1.8 s, body 1.8–24.0 s, CTA over the final story frame 24.0–27.0 s. No end card.
- **Device:** time shown as distance. A cream year ruler (2016 to 2024) runs across the lower third and the camera glides along it, with no cuts. The argument is the empty tape between two red flags.
- **Learning applied:** a named person and car in the first 5 s (the Evo at 0 s, "Marisol's Evo" at 2.0 s). Dialogue vs single narrator is the test from learnings.md "Next tests".
- **Critique principles:** stakes on screen at frame 0 (bet chip and check presenter). The core question is asked by 4.9 s. One legible record. Believable payoff: nobody wins and they split the check. CTA over the story frame, last frame = frame 0.
- **FMB turn:** 14.4 s = 53 % of runtime. That's under the playbook's 55 % floor, as briefed in v3-concepts.md. Flag for the retention-editor.
- **Characters:** Marisol, Dev and "Velden Air" (the intake brand) are fictional. "Illustrative story" is on the CTA frame.

## 1. Story spine
1. **Who:** Marisol, owner of a blue Evo VI, at dinner with her friend Dev.
2. **Wants:** to win the bet: what year did her intake go on? Loser buys dinner.
3. **But:** she says 2021 ("hot summer") and Dev says 2017 ("I held the light"). That's four years apart and both are sure. Dev even has a witness: himself.
4. **Therefore:** she stops arguing and looks it up. The 2019 tick on the ruler opens into her build page's dated entry: "Intake · Velden Air, Jun 14, 2019", her photo, logged by Marisol (FMB shown working, 14.4–18.4 s).
5. **Payoff + loop:** both were two years off, nobody won, and they split the check. The flags spring back to 2017 and 2021, ready for next year's argument, which is frame 0.

## 2. Hooks (all run into body line 1: "Marisol's Evo. When did the intake go on?")

Shared frame 0: white canvas. The Evo VI (car-14) sits in the upper half and the intake cutout (part-04) sits small by its front bumper. The cream year ruler runs across the lower third. Red flags "Dev · 2017" and "Marisol · 2021" are planted on it, with a grey "?" on the empty tape between them. The check presenter sits on the tape at 2019. A chip at the top reads "Bet: one dinner". Every hook ends by 1.8 s.

| # | Family | Voice line | On screen, 0–1.8 s | Sentence pair test |
|---|---|---|---|---|
| A | stakes | **Narrator:** "Loser buys *dinner*." | The check presenter slaps onto the tape (leather thud) and the two flags twitch. | "Loser buys dinner. Marisol's Evo. When did the intake go on?" |
| B | relatable / direct callout | **Narrator:** "Every car friend has this *bet*." | The same frame. The flags pop up one by one, Dev's then Marisol's, each with a tape click. | "Every car friend has this bet. Marisol's Evo. When did the intake go on?" |
| C | visual shock (1 s with no words) | *(1.0 s silence)* **Narrator:** "Dinner's on it." | Silence. The check presenter drops, the flags plant hard (two clicks), and the "?" blinks. The voice comes in at 1.0 s. | "Dinner's on it. Marisol's Evo. When did the intake go on?" |

**Lead hook:** A. It puts the stakes on screen and in the voice inside 1.8 s, and the check presenter is the object the payoff pays off. B is the relatable test variant. C tests a silent open.

## 3. Beat sheet

| t (s) | Voice | On screen (text in quotes) | Why keep watching | Re-hook device |
|---|---|---|---|---|
| 0–1.8 | **Narrator:** "Loser buys *dinner*." | Frame 0 as above. Text: "Bet: one dinner" | Who loses, and what's the bet? | Check presenter slap |
| 1.8–5.0 | **Narrator:** "Marisol's Evo. `<break time="0.15s" />` When did the *intake* go on?" | The camera glides right along the ruler. The intake cutout lifts 20 px, and a thin grey leader line runs from it to the "?" on the tape. Text: "Installed: ?" | Which year is right? | Lateral glide + intake lift |
| 5.0–8.0 | **Marisol:** "Twenty twenty-one. `<break time="0.2s" />` Hot *summer*." | Her flag pulls up and replants on 2021 with a tape click. The camera settles on it. Text: "Marisol: 2021" | She sounds sure. Is she? | Flag replant, camera stops |
| 8.0–11.0 | **Dev:** "*Seventeen*. `<break time="0.2s" />` I held the light." | The camera glides left across four years of tape, which tints red as it passes. Dev's flag replants on 2017. Text: "Four years apart" | He was there. Does that make him right? | The longest pan, across the red gap |
| 11.0–12.9 | **Narrator:** "He had a witness. `<break time="0.3s" />` *Himself*." | The camera pulls back to show both flags. The check presenter slides 40 px toward Marisol's flag. Text: "Witness: also Dev" | Is Marisol about to pay? | Pull-back + the check moving (stakes) |
| 13.0–14.4 | **Marisol:** "Fine. `<break time="0.1s" />` Look it *up*." | The 2019 tick between the flags splits along its line, with light from inside the tape. The music cuts. | What's inside the tape? | Tick splits + music cut |
| 14.4–18.4 | **Narrator:** "Intake. `<break time="0.2s" />` June twenty nineteen. `<break time="0.3s" />` Her own *photo*." | **Turn.** A frameless glass card slides up out of the tape at 2019 and holds center, filling 86 % of the width. Line 1: "Intake · Velden Air" (64 px). Line 2: "Jun 14, 2019" (48 px). Then the install photo at full card width, and a grey chip "logged by Marisol". Small #86868B line: "fuelmybuild.com/marisol/evo-vi". Held still for 3.0 s. | It's 2019. So who won? | New object rises out of the device; music out |
| 18.4–21.4 | **Dev:** "Two years *off*. `<break time="0.2s" />` Both of us." | The card shrinks to sit above the 2019 tick. Both flags slide toward it and stop two ticks either side, in mirror. Text: "Both off by two" | Then who pays? | Flags slide in, symmetry |
| 21.4–23.9 | **Narrator:** "Nobody won. `<break time="0.2s" />` They split the *check*." | The check presenter slides to the middle, between the flags. The red tint drains from the tape. Text: "Split down the middle" | Does the argument end here? | Check slides to center, color drains |
| 24.0–26.9 | **Narrator (CTA):** "Date it *once*. `<break time="0.15s" />` fuelmybuild.com." | CTA over the story frame. The card folds back into the tape, the flags spring back to 2017 and 2021, the check returns to its frame-0 spot and the "?" reappears. A headline band reads "Date it once", with fuelmybuild.com in red and "Illustrative story" in #86868B. The text clears at 26.6 s, so 26.6–27.0 s is clean frame 0. | Loop: the same bet, but now you know the answer | Fold-back = frame 0 |

Features shown: build page with public URL, parts registry with brand, dated log entry with photo, contributor attribution. All are live. No ownership transfer, verification or price.

## 4. Voice direction

Wayne records all the voices. The narrator should be one consistent voice across C3-COL, C3-GAR and C3-SUP.

| Speaker | Voice (age, tone) |
|---|---|
| **Narrator** | Man, late 30s to mid 40s. Dry, warm and quietly amused, like the third friend at the table telling the story. Level, never salesy. |
| **Marisol** | Woman, early 30s. Quick, confident, teasing. Her "Fine. Look it up." is a little clipped: she's conceding the argument, not the bet. |
| **Dev** | Man, early 30s. Cocky on "Seventeen", then good-natured and a little sheepish on "Two years off". |

Per-line read. `|` is a pause, with its length in brackets. *Italics* mark the emphasis word. The URL counts as five words ("fuel my build dot com").

| # | Window (s) | Speaker | Line | Words / s | Delivery |
|---|---|---|---|---|---|
| 1 | 0.1–1.8 | Narrator | Loser buys *dinner*. | 3 / 1.7 = 1.8 | Matter-of-fact, half smile. "dinner" lands on the check slap. |
| 2 | 1.9–5.0 | Narrator | Marisol's Evo. \| (0.15) When did the *intake* go on? | 8 / 3.1 = 2.6 | A real question. The question must finish by 5.0 s. |
| 3 | 5.1–7.9 | Marisol | Twenty twenty-one. \| (0.2) Hot *summer*. | 5 / 2.8 = 1.8 | Sure of herself, remembering the heat. |
| 4 | 8.1–10.9 | Dev | *Seventeen*. \| (0.2) I held the light. | 5 / 2.8 = 1.8 | Cocky, the trump card. |
| 5 | 11.0–12.9 | Narrator | He had a witness. \| (0.3) *Himself*. | 5 / 1.9 = 2.6 | Deadpan joke. Let the pause do the work. |
| 6 | 13.0–14.4 | Marisol | Fine. \| (0.1) Look it *up*. | 4 / 1.4 = 2.9 | Clipped. The tightest line, so start it at 13.0 s sharp. |
| 7 | 14.5–18.3 | Narrator | Intake. \| (0.2) June twenty nineteen. \| (0.3) Her own *photo*. | 7 / 3.8 = 1.8 | Slower and level. The date is the proof, so give it weight. |
| 8 | 18.5–21.3 | Dev | Two years *off*. \| (0.2) Both of us. | 6 / 2.8 = 2.1 | Laughing at himself. |
| 9 | 21.5–23.8 | Narrator | Nobody won. \| (0.2) They split the *check*. | 6 / 2.3 = 2.6 | Warm, the button of the story. |
| 10 | 24.0–26.9 | Narrator | Date it *once*. \| (0.15) fuelmybuild.com. | 8 / 2.9 = 2.8 | Clear and unhurried. Finish by 26.9 s. |

No beat is over 3 words a second. The tightest is line 6 (2.9). If it runs long, open its window at 12.9 s by trimming the pause in line 5, never the words.

## 5. On-screen text (in order)
"Bet: one dinner" · "Installed: ?" · "Marisol: 2021" · "Four years apart" · "Witness: also Dev" · (log card) · "Both off by two" · "Split down the middle" · "Date it once" + fuelmybuild.com + "Illustrative story". Everything is sentence case, at least 44 px on the 1080-wide canvas, and never the full voice line.

## 6. CTA
"Date it once. fuelmybuild.com." It's in the voice and the headline band, over the final story frame.

## 7. Captions
- **IG / TikTok:** "Loser buys dinner: what year did the intake go on? She said 2021. He said 2017." (80 chars)
  #mitsubishi #evo #lancerevolution #jdm #carbuild
- **YouTube Shorts title:** "Loser buys dinner"
- **YouTube description:** "Marisol and Dev bet dinner on the year her Evo's intake went on. Four years apart, both sure. An illustrative story about memory vs a dated record. fuelmybuild.com"
- **Pinned comment:** "What's the bet you and your car friends still can't settle?"

## 8. Motion notes
1. **One continuous camera (0–27 s).** No cuts, no whip-pans and no push-throughs (the bank flags both as overused). The camera glides along the ruler on an eased lateral track. Each beat is a destination on the tape: Dev's flag, Marisol's flag, the 2019 tick.
2. **The ruler.** Built in code: a cream band (#F2EBDD, tinted only here) with year ticks 2016–2024 and Inter numerals at 44 px. The empty tape between the flags tints red (#F43034 at 18 %) during 8–11 s and drains at 21.4 s.
3. **Flags.** Built in code: small red pennants on thin grey pins, with name and year labels at 44 px. A replant is lift 30 px → drop on a spring → tape-click sfx.
4. **Tick-opens-into-card (13.0–14.4 s).** The 2019 tick line splits into two halves, with a soft light leak from inside. The card rises out of the gap with no device frame: frosted glass (white at 85 %, 24 px radius, soft contact shadow). Don't show a phone.
5. **One legible record (14.4–17.4 s).** The card holds completely still for 3.0 s. Nothing else moves except a slow 2 % camera drift. No stamps, checkmarks or "verified" marks.
6. **Fold-back loop (24.0–27.0 s).** Run 14.4–18.4 s in reverse: the card folds into the tape and the tick closes. The flags, check presenter, "?" and camera end at the exact frame-0 position, scale and shadow.
7. **Sound.** Restaurant room tone, low. Tape clicks on the flags. Music cuts at 13.0 s and returns at 21.4 s.

## 9. Retention pre-check (self-scored, for the retention-editor)

| Window (s) | 0-3 | 3-6 | 6-9 | 9-12 | 12-15 | 15-18 | 18-21 | 21-24 | 24-27 |
|---|---|---|---|---|---|---|---|---|---|
| Self | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 1 |

The average is 1.67, with no zeros in 3–9 s. The weakest windows are 18–24 s, the payoff. Dev's "Two years off" is a mini-twist that keeps 18–21 s at a 1. Not yet scored by the retention-editor.

## 10. Bank check (state/visual-bank.md)
- **Premise:** no buyer, no sale and no appraisal. The conflict is two friends' memories. That's clear of C1, C2 and C1-v2 (sale scenes).
- **Device:** a year ruler with a lateral pan. It's not a rolling counter or clock, a text thread, a clue counter or an A/B split.
- **Props:** check presenter, flags and ruler, all new. No shoebox, receipts, masking tape, mechanic portrait, odometer, keys, wall clock, stamps, scribble circles or red dashed lines.
- **Product framing:** a frameless card rising from the device, not a phone push-through.
- **Hero pairing:** Evo VI car-14 + intake part-04 is new. The intake appeared once before, only as a log thumbnail.
- **Date:** Jun 14, 2019 avoids the overused "March 12/14" date. No Kessler.
- **Check for Wayne:** the payoff assumes a log entry can carry a past date (work done in 2019, logged with that date). If entries can only take today's date, tell us before production.

## 11. New images needed
Saved to `kit/remotion/public/img/lab/`. Flags, ruler and card are built in code. The Evo (car-14) and intake (part-04) are already in the kit.

1. **c3-check-presenter.png**: CUTOUT (transparent PNG, one subject, ~5% margin, no shadow). "Studio product photo of a closed black leatherette restaurant check presenter folder with a blank white paper bill edge peeking out of the top, three-quarter view from slightly above, even soft studio light, isolated on a fully transparent background, one subject, about 5% margin on every side, no shadow. No text, logos or plates; no writing on the paper."
2. **c3-evo-intake-install.jpg**: PHOTO (4:3, clean garage, phone-photo look). "Realistic phone photo of the open engine bay of a blue late-1990s Japanese four-door rally sedan in a clean home garage, a freshly installed red pleated cone air filter inside a black open heat-shield box with a black intake pipe and silver hose clamps, a fender cover over the front wing with a ratchet resting on it, warm daylight from an open garage door, slight handheld angle, 4:3. No text, logos or plates."

### C3-SUP: Rattle. Fix?

Lab lane C v3, parts suppliers (an exhaust brand). Concept approved by Wayne (weeks/2026-W44/lab/C/v3-concepts.md). Checked against state/visual-bank.md and lab/critiques/2026-W42-chatgpt.md.

- **Audience:** parts suppliers
- **Format:** mini story, with dialogue (Noor and Theo) and a narrator
- **Runtime:** 27.0 s. Hook 0–1.8 s, body 1.8–23.7 s, CTA over the final story frame 23.7–27.0 s. No end card.
- **Device:** time as weight. A stainless exhaust hangs level from one cotton string. Every question Noor has to ask arrives as a new manila tag that lands on the pipe, which sags lower each time. Each of Theo's slow answers is pencilled on the tag with its day. The camera moves vertically, following the sag down the string.
- **Learning applied:** a named person within 2 s (Noor) and a car by 6 s (the WRX). Dialogue vs single narrator is the test from learnings.md.
- **Critique principles:** stakes on screen at frame 0 (an open ticket on a $1,290 exhaust, with a return threatened by 11 s). The core question ("Which car?") is on screen by 4.5 s. One legible record. Believable payoff: a hint worth checking, not a diagnosis. CTA over the story frame, last frame = frame 0. P1's lesson applied: this shows one customer's documented install, not a brand-level search or a supplier page.
- **FMB turn:** 14.5 s = 54 % of runtime. That's under the playbook's 55 % floor, as briefed in v3-concepts.md. Flag for the retention-editor.
- **Characters:** Noor, Theo, Calder Exhaust and Northline Auto are fictional. "Illustrative story" is on the CTA frame.

## 1. Story spine
1. **Who:** Noor, who runs support at Calder Exhaust, opening a ticket from Theo.
2. **Wants:** to fix his problem before it becomes a return.
3. **But:** the whole ticket is "Rattle. Fix?" She has an order number and nothing else. Each question costs days: "Which car?" (day 2: a WRX), "Who fitted it?" (day 4: "Some shop."). By day 6 it's still rattling, and Theo asks about a return.
4. **Therefore:** Theo, fed up, sends "Just read my build." The tags drop off, and the last one unfolds into his build page's entry: "Exhaust · Calder · Jul 22 · installed by Northline Auto", with an underside photo (FMB shown working, 14.5–19.5 s). Noor ties the original "Rattle. Fix?" tag onto the rear hanger in the photo: "That rear hanger. Worth a look."
5. **Payoff + loop:** six days of questions, one link. The pipe lifts back to level, and the single "Rattle. Fix?" tag hangs there alone, which is frame 0 (the next ticket).

## 2. Hooks (all run into body line 1: "Noor had his order number. Nothing else.")

Shared frame 0: white canvas. A stainless dual-tip exhaust (part-05) hangs level, mid-frame, from one off-white cotton string that runs to the top edge. One blank manila tag hangs from the pipe, handwritten in dark ink: "Rattle. Fix?". Top-left, two chips: "Ticket opened · Day 1" and a grey "Calder · Order 20418 · $1,290". Every hook ends by 1.8 s.

| # | Family | Voice line | On screen, 0–1.8 s | Sentence pair test |
|---|---|---|---|---|
| A | curiosity gap | **Noor:** "Rattle. `<break time="0.2s" />` Fix? `<break time="0.2s" />` That's *it*." | The tag swings in on its string and the pipe gives a small metallic rattle (sfx). | "Rattle. Fix? That's it. Noor had his order number. Nothing else." |
| B | direct callout | **Narrator:** "Brands: `<break time="0.15s" />` this is your *inbox*." | The same frame. The ticket chip drops first, then the tag. | "Brands: this is your inbox. Noor had his order number. Nothing else." |
| C | specific number | **Narrator:** "Twelve-ninety exhaust. `<break time="0.15s" />` Two *words*." | The price chip lands, then the tag flips to face camera. | "Twelve-ninety exhaust. Two words. Noor had his order number. Nothing else." |

**Lead hook:** A. It's the customer's actual words, and the joke ("That's it.") is the stakes: a support person with nothing to work with. B is the callout test for brand owners. C is the number test.

## 3. Beat sheet

| t (s) | Voice | On screen (text in quotes) | Why keep watching | Re-hook device |
|---|---|---|---|---|
| 0–1.8 | **Noor:** "Rattle. Fix? That's *it*." | Frame 0 as above. Tag: "Rattle. Fix?" | How do you fix a rattle with two words? | Tag swing + rattle sfx |
| 1.8–5.0 | **Narrator:** "Noor had his *order number*. `<break time="0.2s" />` Nothing else." | The camera drops down the string to the pipe. Beside it, a grey outline of a generic car with a "?" in it. At 4.5 s, a new tag is written in Noor's hand: "Which car?" Text: "Car? Fitter? Date? Unknown." | Which car is this even on? | Vertical camera drop + empty car outline |
| 5.0–8.0 | **Noor:** "Which car?" `<break time="0.3s" />` **Theo:** "A W-R-X." | The "Which car?" tag lands on the pipe with a paper thud, and the pipe sags 40 px. Theo's answer is pencilled on the tag in grey: "WRX · day 2". The blue WRX cutout (car-04) slides small into the outline. | Two days for one answer. What else is missing? | Sag + the car filling the outline |
| 8.0–11.0 | **Noor:** "Who *fitted* it?" `<break time="0.3s" />` **Theo:** "Some shop." | A third tag lands: "Who fitted it?", answered in pencil "Some shop · day 4". The pipe sags further and tilts 4°. | "Some shop" isn't an answer. Can Noor help at all? | Bigger sag + tilt |
| 11.0–14.0 | **Narrator:** "Day *six*. `<break time="0.2s" />` Theo asked about a *return*." | The pipe sits at its lowest, and the camera has followed it down. The rattle sfx repeats. A red chip, "Return?", drops beside the ticket chip. Text: "Still rattling" | Is Calder about to eat a $1,290 return? | Red chip, the stakes peak |
| 14.0–16.0 | **Theo:** "Just read my *build*." | **Turn at 14.5 s.** The two question tags snap off their strings and drop out of frame. The original tag swings to center and unfolds like a paper card. | What's on his build? | Tags dropping + unfold |
| 16.0–19.5 | **Narrator:** "Calder exhaust. `<break time="0.2s" />` July twenty-second. `<break time="0.2s" />` *Northline* Auto." | The unfolded tag becomes a frosted-glass log card filling 86 % of the width. Line 1: "Exhaust · Calder" (64 px). Line 2: "Jul 22, 2026" (48 px). Then the underside photo at full card width and a grey chip "installed by Northline Auto". Small #86868B line: "fuelmybuild.com/theo/wrx-sti". Held still for 3.0 s. | That's everything Noor asked for. Does it explain the rattle? | New object; music drops to one note |
| 19.5–22.0 | **Noor:** "That rear *hanger*. `<break time="0.2s" />` Worth a look." | A fresh blank tag ties itself onto the rear rubber hanger in the photo, on a short cotton string, and swings once. Noor's ink writes on it: "Check first". Text: "A place to start" | Is that the fix? | Tag ties into the photo |
| 22.0–23.6 | **Narrator:** "Six days. `<break time="0.2s" />` One *link*." | The card folds back into a single tag. The pipe lifts back to level with an eased spring, and the "Return?" chip slides out. | Is it solved? (open, honestly) | Lift: the reverse of every sag |
| 23.7–26.9 | **Narrator (CTA):** "Ask for the *build*. `<break time="0.15s" />` fuelmybuild.com." | CTA over the story frame. The tag turns back to "Rattle. Fix?", the chips return to "Ticket opened · Day 1", the WRX leaves and the camera returns to the frame-0 height. A headline band reads "Ask for the build", with fuelmybuild.com in red and "Illustrative story" in #86868B. The text clears at 26.6 s, so 26.6–27.0 s is clean frame 0. | Loop: the next two-word ticket | Return to frame 0 |

Features shown: build page with public URL, parts registry with brand ("Exhaust · Calder"), dated log entry with photo, garage attribution ("installed by Northline Auto"). All are live. Not shown or implied: supplier pages, supplier analytics, search, a map, support-desk integration, or FMB diagnosing anything. The ticket and the replies are generic support UI, read as voices. There's no chat bubble or thread on screen.

## 4. Voice direction

Wayne records all the voices. Use the same narrator as C3-COL and C3-GAR.

| Speaker | Voice (age, tone) |
|---|---|
| **Narrator** | Man, late 30s to mid 40s. Dry, warm, level. A support-desk war story told over coffee. |
| **Noor** | Woman, late 20s to early 30s. Patient, precise, a little wry. "That's it." is a tired half-laugh. "Worth a look." is careful, not triumphant. |
| **Theo** | Man, early to mid 20s. Flat, terse, mildly annoyed. He sounds like he's typing on a phone. "Just read my build." is impatient. |

Per-line read. `|` is a pause, with its length in brackets. *Italics* mark the emphasis word. "WRX" is spelled out (three words) and the URL counts as five.

| # | Window (s) | Speaker | Line | Words / s | Delivery |
|---|---|---|---|---|---|
| 1 | 0.1–1.8 | Noor | Rattle. \| (0.2) Fix? \| (0.2) That's *it*. | 4 / 1.7 = 2.4 | Reading the ticket aloud, then the tired half-laugh. |
| 2 | 1.9–5.0 | Narrator | Noor had his *order number*. \| (0.2) Nothing else. | 7 / 3.1 = 2.3 | Matter-of-fact. "Nothing else" is a small drop. |
| 3 | 5.1–7.9 | Noor, then Theo | Which car? \| (0.3) A W-R-X. | 6 / 2.8 = 2.1 | Noor polite. Theo flat, as if days later. |
| 4 | 8.1–10.9 | Noor, then Theo | Who *fitted* it? \| (0.3) Some shop. | 5 / 2.8 = 1.8 | Noor patient. Theo shrugs it. |
| 5 | 11.0–13.9 | Narrator | Day *six*. \| (0.2) Theo asked about a *return*. | 7 / 2.9 = 2.4 | The stakes line. Lean on "return". |
| 6 | 14.1–15.9 | Theo | Just read my *build*. | 4 / 1.8 = 2.2 | Fed up. That he's fed up is the twist. |
| 7 | 16.1–19.4 | Narrator | Calder exhaust. \| (0.2) July twenty-second. \| (0.2) *Northline* Auto. | 7 / 3.3 = 2.1 | Slow and level, three facts. "Northline" when the chip lands (about 18.4 s). |
| 8 | 19.6–21.9 | Noor | That rear *hanger*. \| (0.2) Worth a look. | 6 / 2.3 = 2.6 | Careful. A lead, not a verdict. |
| 9 | 22.0–23.6 | Narrator | Six days. \| (0.2) One *link*. | 4 / 1.6 = 2.5 | Quiet button. |
| 10 | 23.7–26.9 | Narrator | Ask for the *build*. \| (0.15) fuelmybuild.com. | 9 / 3.2 = 2.8 | Clear, peer to peer. Finish by 26.9 s. |

No beat is over 3 words a second. The tightest is line 10 (2.8). If it runs long, shave the pause in line 9, never the CTA words.

## 5. On-screen text (in order)
Tag "Rattle. Fix?" + chips "Ticket opened · Day 1", "Calder · Order 20418 · $1,290" · "Car? Fitter? Date? Unknown." · tag "Which car?" / "WRX · day 2" · tag "Who fitted it?" / "Some shop · day 4" · "Still rattling" + red chip "Return?" · (log card) · tag "Check first" + "A place to start" · "Ask for the build" + fuelmybuild.com + "Illustrative story". Tag handwriting is set at 44 px or larger. Everything is sentence case.

## 6. CTA
"Ask for the build. fuelmybuild.com." It's in the voice and the headline band, over the final story frame. Sign-ups are open, so this points brands at the builds their customers keep there. It doesn't promise a supplier page.

## 7. Captions
- **IG / TikTok:** "The whole ticket: 'Rattle. Fix?' No car, no shop, no date. Six days of questions later, one link." (98 chars)
  #exhaust #wrx #subaru #aftermarket #customersupport
- **YouTube Shorts title:** "Rattle. Fix?"
- **YouTube description:** "Noor runs support at an exhaust brand. Theo's ticket says two words. Every question costs a day, until he sends his build. An illustrative story for parts brands. fuelmybuild.com"
- **Pinned comment:** "Brands: what's the shortest support ticket you've ever had to solve?"

## 8. Motion notes
1. **Weight as time.** The pipe hangs from one off-white cotton string (code-drawn, 3 px, slight curve). Each tag landing triggers a spring sag: +40 px at 5 s, +60 px and a 4° tilt at 8 s, +30 px at 11 s. The string stretches visually. At 22.0 s everything lifts back in one eased spring. The string is deliberately not red: the bank's red dashed line (P1) and red price tag (P2) stay out of this film.
2. **Vertical camera only.** The camera drops with the pipe and rises with it. No whip-pans and no push-throughs.
3. **Tags.** One manila tag cutout, reused. Questions go on in Noor's dark ink and answers in grey pencil with a "day N", written on with a stroke-reveal. No ink stamps (the bank lists red stamps as overused).
4. **Unfold into the record (14.5–16.0 s).** The tag flips toward camera, splits along a center fold, and opens into the frosted-glass card (white at 85 %, 24 px radius). Don't show a phone.
5. **One legible record (16.0–19.0 s).** The card holds still for 3.0 s, with the photo at full card width. No scroll and no other rows.
6. **The hint (19.5–22.0 s).** A new small tag ties onto the rear hanger inside the photo. It's not a scribble circle (the bank lists those on G1 and C3). No arrows, no "found it", no checkmark.
7. **Loop (23.7–27.0 s).** Pipe level, one tag reading "Rattle. Fix?", chips back to frame 0, and the camera at the frame-0 height and scale.
8. **Sound.** A light metallic rattle on each sag. Paper thuds for the tags. Music thins to one note at 16 s and returns on the lift at 22 s.

## 9. Retention pre-check (self-scored, for the retention-editor)

| Window (s) | 0-3 | 3-6 | 6-9 | 9-12 | 12-15 | 15-18 | 18-21 | 21-24 | 24-27 |
|---|---|---|---|---|---|---|---|---|---|
| Self | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 1 | 1 |

The average is 1.67, with no zeros in 3–9 s. 9–12 s is the softest window (the third tag repeats the second's pattern). The tilt and the "Some shop" joke keep it at a 1, and the return threat lands at 11.5 s to lift 12–15 s. Not yet scored by the retention-editor.

## 10. Bank check (state/visual-bank.md)
- **Premise:** a customer-initiated support ticket, not a brand-initiated search (P1, P1-v2), sponsored spikes (P2), reviews at 30,000 miles (P3) or misnamed parts (A-L3, B-L3).
- **Device:** hanging tags, sag and lift. It's not a counter, clue counter, chart, thread or A/B split. Day marks are pencilled per tag, not a rolling number.
- **Changes from the concept, to stay off the bank:** (1) The one-star draft is replaced by a "Return?" chip, because the star review card is P3's prop. (2) The red string became off-white cotton (P1's red dashed line, P2's red price tag). (3) The ink stamps became pencil marks (red stamps). (4) The red circle on the hanger became a tag tied to the hanger (scribble circles in G1 and C3).
- **Props:** the manila tag is new. The kit's obj/price-tag.png is P2's red price tag and isn't used. No shipping box, tracking dots, review stars, Supra or turbo.
- **Product framing:** a tag unfolding into a card, not a phone.
- **Hero pairing:** WRX STI car-04 + exhaust part-05 is new, and neither has been a hero before.

## 11. New images needed
Saved to `kit/remotion/public/img/lab/`. The string, chips and card are built in code. The WRX (car-04) and exhaust (part-05) are already in the kit. The kit's red price tag is not a substitute (P2 prop, wrong color).

1. **c3-hang-tag-manila.png**: CUTOUT (transparent PNG, one subject, ~5% margin, no shadow). "Studio product photo of a single blank manila shipping tag, rectangular with the two top corners clipped, a reinforced round eyelet near the top edge, no string, matte paper with a slight natural curl at the bottom edge, seen straight on and hanging vertically, even soft studio light, isolated on a fully transparent background, one subject, about 5% margin on every side, no shadow. No text, logos or plates; no writing or printing on the tag."
2. **c3-wrx-exhaust-underside.jpg**: PHOTO (4:3, clean garage, phone-photo look). "Realistic phone photo taken from directly underneath a blue Japanese rally sedan on a two-post lift in a clean, bright garage, showing a polished stainless cat-back exhaust with a single oval muffler and two round tips, the black rubber exhaust hangers clearly visible, with the rear-most hanger near the right third of the frame, a gold wheel partly visible at one edge, slight handheld angle, 4:3. No text, logos or plates."
