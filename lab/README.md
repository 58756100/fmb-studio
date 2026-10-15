# Lab: Claude vs ChatGPT lanes

A separate test bed. It never edits lane 0's weeks, scripts or queue entries; it adds its own.

## Lanes
| Lane | Creative (idea, hook, script, VO direction, captions) | Visuals | ChatGPT sees |
|---|---|---|---|
| 0 Control | Claude studio pipeline | Claude | n/a |
| A Blind | ChatGPT, from the brief only | Claude | `prompts/00-brief.md` + `01-lane-a.md` |
| B Informed | ChatGPT, with our full context pack | Claude | + `02-lane-b.md` and `context/<week>.md` (learnings, scripts, VO notes, house-style refs) |
| C Critic | Claude's lane-0 reel, rebuilt from ChatGPT's critique | Claude | + `03-lane-c.md`, the lane-0 render and its metrics |

Only Claude makes visuals, on opus. ChatGPT never makes images or video.

## Who has creative control
(Updated 2026-10-15: see `state/production-standards.md`. ChatGPT owns concept, story, script and hooks in lanes A and B; Claude owns the build and may upgrade UI, layout, motion and transitions to production level in every lane. No lane may repeat a premise from another lane: everything goes through `state/visual-bank.md`.)

- **Lane A: ChatGPT decides everything; Claude only executes.** Motion-director builds from ChatGPT's visual direction alone. It must not read `state/learnings.md`, lane-0 scripts or storyboards, or the house-style refs, and it must not default to the Notion-white/iOS look unless ChatGPT asked for it. It may use the kit (Remotion, remocn, audio engine, cutouts) as tools. Where the direction is silent, pick the most literal reading and log the gap in `weeks/<week>/lab/A/<id>-gaps.md`; don't fill it with house style.
- **Lane B: shared.** ChatGPT writes with full context; Claude builds with full creative control and the house system, and may deviate if it makes ChatGPT's idea work better (log why).
- **Lane C: Claude has full creative control.** ChatGPT critiques; Claude chooses which changes to apply and how.

## ChatGPT setup (do this once, before any context is shared)
Use two separate ChatGPT Projects, both with **project-only memory**. Also turn off "Reference chat history" in Settings → Personalization, so nothing leaks between them.
- **FMB Lab · Blind**: lane A only. Paste `prompts/00-brief.md`. Never add files, screenshots or renders here.
- **FMB Lab · Informed**: lanes B and C. Paste `prompts/00-brief.md`, then attach `context/<week>.md` (Claude writes it each week) and our renders.
Always run lane A first each week. ChatGPT never gets the repo itself, only the exported context file, so it sees the playbook but not keys or code.

## Weekly flow (20 videos)
1. Ideation marks 3 of the 11 lane-0 concepts `lab: true` (one collectors, one garages, one suppliers).
2. Claude writes `context/<week>.md` and the three topic lines for Wayne to paste into the ChatGPT project.
3. Wayne runs lanes A and B in ChatGPT and pastes the answers into `weeks/<week>/lab/A|B/<id>.md`.
4. After lane 0 renders, Wayne gives ChatGPT the renders for lane C; its critique goes in `weeks/<week>/lab/C/<id>.md`.
5. Claude runs voice → storyboard → render → QA on the 9 lab items through the normal pipeline (same voice engine, same QA, same approval gates).
6. Publisher slots each topic's 4 versions on the same platforms at comparable slots (same weekday hour, different days), with `lane` set in the queue.
7. Sunday: analytics writes `scoreboard.md` (lane vs lane on matched topics) and folds winning moves into lane 0.

## Fair-test rules
- Same topic, platforms, slot hour, voice engine, render pipeline, QA and loudness for every lane.
- No lane-0 edits based on lab output until the Sunday review.
- At least 3 weeks of data before calling a winner (9 matched topics).
- FMB feature claims follow the same rule: only live features, others marked (confirm).
