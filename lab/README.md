# Lab: Claude vs ChatGPT lanes

A separate test bed. It never edits lane 0's weeks, scripts or queue entries; it adds its own.

## Lanes
| Lane | Creative (idea, hook, script, VO direction, captions) | Visuals | ChatGPT sees |
|---|---|---|---|
| 0 Control | Claude studio pipeline | Claude | n/a |
| A Blind | ChatGPT, from the brief only | Claude | `prompts/00-brief.md` + `01-lane-a.md` |
| B Informed | ChatGPT, with our full context pack | Claude | + `02-lane-b.md` and `context/<week>.md` (learnings, scripts, VO notes, house-style refs) |
| C Critic | Claude's lane-0 reel, rebuilt from ChatGPT's critique | Claude | + `03-lane-c.md`, the lane-0 render and its metrics |

Only Claude makes visuals, on opus. ChatGPT describes visual *intent* per beat; motion-director turns it into frames in the house style (or deliberately outside it for lane A, if that's what the intent asks for).

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
