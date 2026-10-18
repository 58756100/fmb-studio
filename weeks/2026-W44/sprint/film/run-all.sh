#!/bin/bash
# ./run-all.sh id1 id2 ...  -> for each reel in turn: master.sh, gate.py, then push the masters + bed to `renders`
# (one commit per file) and commit code + final sheet to the working branch, before starting the next reel.
cd "$(dirname "$0")"; R=$(git rev-parse --show-toplevel)
for ID in "$@"; do
  echo "######## $ID $(date +%T)"
  ./master.sh $ID > out/$ID.log 2>&1 || { echo "$ID: master.sh failed"; grep -i error out/$ID.log | head; exit 1; }
  python3 gate.py $ID || { echo "$ID: gate failed, stopping"; exit 1; }
  for h in A B C; do ./push-render.sh out/masters/$ID-$h.mp4 2026-W44/sprint/masters/$ID-$h.mp4 "Sprint W44 master $ID-$h (1080x1920 30fps H.264, -14 LUFS, AAC 48k)" || exit 1; done
  ./push-render.sh out/audio/$ID-A-bed.wav 2026-W44/sprint/masters/$ID-bed.wav "Sprint W44 $ID music+SFX stem (hook A timing, no VO)" || exit 1
  git -C "$R" add weeks/2026-W44/sprint/film weeks/2026-W44/sprint/storyboard/$ID-final-sheet.jpg
  git -C "$R" commit -q -m "Sprint W44 masters: $ID finished (3 hook masters + bed on renders, final sheet)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016g3Ws6RKPFxbXeFgZ5cwJK" || true
  git -C "$R" pull --rebase --autostash -q && git -C "$R" push -q origin HEAD:claude/focused-ritchie-6w1221 || echo "$ID: branch push failed (renders are pushed)"
  echo "$ID done $(date +%T)"
done
