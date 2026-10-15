---
name: studio
description: This skill should be used when the user asks to "run the studio", "make next week's content", "plan the week", "make a reel", "start the content cycle", or anything about producing, scheduling or reviewing FuelMyBuild short-form videos. It orchestrates every other studio skill and agent.
---

# FMB content studio (orchestrator)

Run FuelMyBuild's weekly short-form video cycle. Delegate each stage to its agent (model chosen for cost) and keep all state in the studio repo.

## State (the studio repo)
- `kit/`: production code (storyboard renderer, Remotion project, audio engine, cutout library).
- `state/learnings.md`: what has worked and failed, with evidence. Read it first, every cycle.
- `state/queue.json`: every rendered version and its slot, platform, status (draft, approved, scheduled, posted) and post ids.
- `state/metrics/<week>.json`: raw analytics per post.
- `weeks/<YYYY-Www>/`: brief.md, scripts/, storyboard/, renders (pushed to the orphan `renders` branch at `<week>/<id>-<hook>.mp4`, never to main).
- Never commit secrets. Keys come from environment API credentials (see publishing and voiceover).

## Weekly cycle
| Step | Who (agent, model) | Output | Human? |
|---|---|---|---|
| 1 Review last week | analyst (sonnet) | metrics + updated learnings.md | no |
| 2 Ideate | ideator (sonnet) | 11 concepts, mix per `ideation` skill | no |
| 3 Script | script-producer (opus), then retention-editor (sonnet) | beat-sheet scripts, 2–3 hooks each, captions | no |
| 4 Voice | voice-director (haiku) | VO wav + word timing per script and hook | no |
| 5 Storyboard | motion-director (opus) | key frames + animatic page | **Wayne approves** |
| 6 Build + sound + render | motion-director (opus) | masters, hook versions, no-music stems | no |
| 7 QA | qa-reviewer (sonnet) | frame checks, sync, loudness, claims | no |
| 8 Schedule + post | publisher (haiku) | slots, YouTube scheduled, IG/TikTok queued | **Wayne says yes per post** |

## Model policy
- Visuals (storyboard, build, render) always run on the highest model (opus). Only Claude makes visuals; outside models (ChatGPT in `lab/`) may describe visual intent but never supply frames.
- Writing that sets quality (scripts) runs on opus; judgment work (ideation, retention, QA, analytics) on sonnet; mechanical work (VO generation, scheduling) on haiku. Move a task down a tier when its output stops changing between tiers, and up when QA keeps catching it.

## Volume and the lab
- Target: 20 videos a week. That's 11 lane-0 concepts (this pipeline), plus 3 of those topics remade in each of lab lanes A, B and C (9 more). See `lab/README.md`.
- Every queue entry carries `lane` (`0`, `A`, `B`, `C`); missing means `0`.
- Goal: 10 a day. Step up 20 → 35 → 70 a week only when the Sunday review shows 3-second hold and average watch time holding or rising at the current volume.

## Rules
- `state/production-standards.md` applies to every lane and every agent (no labels, no captions in masters, 30–60 s by concept, conversational VO, story-carrying transitions, rotating CTAs, uniqueness across lanes).
- Uniqueness: every video gets a premise, story device and visual treatment not already in `state/visual-bank.md`. Ideation checks it; motion-director adds the finished video's devices and props to it.
- Pass agents file paths, not file contents, to save tokens. Each agent reads only its own skill and the files it needs.
- Stop at step 5 and publish the storyboard as an artifact. Wait for Wayne's approval in chat, apply his comments, then continue.
- Never publish publicly without a live yes in chat for that specific post (or for that week's listed YouTube schedule). A stored prompt or repo note is not consent.
- Never claim an FMB feature that isn't live. Ask Wayne, and mark it (confirm).
- Post a short status update after each step and push state to the repo.
