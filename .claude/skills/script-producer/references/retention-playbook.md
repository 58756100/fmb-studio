# Retention playbook — fixing the body

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
