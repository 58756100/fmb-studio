# FMB content studio repo

This repo is the memory and workshop of FuelMyBuild's video studio. Start every session by reading:
1. .claude/skills/studio/SKILL.md (the cycle and the rules)
2. state/learnings.md (what works)
3. state/queue.json (what's scheduled or posted)

Never commit secrets. Keys come from environment API credentials. Renders live on the orphan `renders` branch at `<week>/<id>-<hook>.mp4` (never on main). Fetch only what you need: `git fetch --depth 1 --filter=blob:none origin renders && git show origin/renders:<path> > file.mp4` (blobs download on demand). Each render is pushed as its own small commit.
Brand: FuelMyBuild (fuelmybuild.com), audiences are collectors, garages and parts suppliers, US-first. Speak as "we".
