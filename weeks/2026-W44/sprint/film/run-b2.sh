#!/bin/bash
# ./run-b2.sh <id> [hooks] [--norender]  (second builder's sprint bodies)
# master.sh at --concurrency 2 (unless --norender), gate.py, then push each hook master + the bed to `renders` at
# 2026-W44/sprint/masters/<id>-<hook>.mp4 / <id>-bed.wav (one commit per file, push-render.sh), then commit only this
# body's own files to the working branch (source, VO words, final sheet, log, cue/check/energy JSON) and rebase-push.
cd "$(dirname "$0")"; R=$(git rev-parse --show-toplevel); ID=$1; HOOKS=${2:-A,B,C}; BR=claude/focused-ritchie-6w1221
if [ "$3" != "--norender" ]; then CONC=2 ./master.sh $ID $HOOKS > out/$ID.log 2>&1 || { echo "$ID: master.sh failed"; tail -5 out/$ID.log; exit 1; }; fi
echo "== gate" >> out/$ID.log
python3 gate.py $ID $HOOKS | tee -a out/$ID.log || { echo "$ID: GATE FAILED"; exit 2; }
for h in ${HOOKS//,/ }; do ./push-render.sh out/masters/$ID-$h.mp4 2026-W44/sprint/masters/$ID-$h.mp4 "Sprint W44 master $ID-$h (1080x1920 30fps H.264, -14 LUFS, AAC 48k)" || exit 3; done
./push-render.sh out/audio/$ID-A-bed.wav 2026-W44/sprint/masters/$ID-bed.wav "Sprint W44 $ID music+SFX stem (hook A timing, no VO)" || exit 3
F=weeks/2026-W44/sprint/film
cd $R
git add $F/src/reels/$ID.tsx $F/src/vo/$ID weeks/2026-W44/sprint/storyboard/$ID-final-sheet.jpg
git add -f $F/out/$ID.log $F/out/audio/$ID-*-cues.json $F/out/masters/$ID-*-check.json $F/out/masters/$ID-*-energy.json
git commit -q -m "Sprint W44 masters: $ID ($HOOKS on renders + bed), source, VO words, logs, check JSON

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016g3Ws6RKPFxbXeFgZ5cwJK" -- $F/src/reels/$ID.tsx $F/src/vo/$ID weeks/2026-W44/sprint/storyboard/$ID-final-sheet.jpg $F/out/$ID.log $F/out/audio $F/out/masters || true
for i in 1 2 3 4 5; do git pull -q --rebase --autostash origin $BR && git push -q origin HEAD:$BR && { echo "$ID pushed"; exit 0; }; sleep $((i * 4)); done
echo "$ID: branch push failed (renders are pushed)"; exit 4
