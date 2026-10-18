#!/bin/bash
# ./vo-get.sh <id>  -> src/vo/<id>/*.json (word timings, committed) + public/vo/<id>/*.wav (git-ignored) for one sprint body.
# Word files come from weeks/2026-W44/sprint/vo/<id>/; WAVs from there when present, otherwise from the renders branch
# (2026-W44/sprint/vo/<id>/). Prints the hooks that are voiced (A, plus B/C when their words exist). Exit 1 if no VO yet.
set -uo pipefail
cd "$(dirname "$0")"; R=$(git rev-parse --show-toplevel); ID=$1; V=$R/weeks/2026-W44/sprint/vo/$ID
[ -s $V/words.json ] || { echo "no VO for $ID"; exit 1; }
mkdir -p src/vo/$ID public/vo/$ID
HOOKS=A
for f in words hook-B.words hook-C.words; do [ -s $V/$f.json ] && cp $V/$f.json src/vo/$ID/; done
git -C $R fetch --depth 1 --filter=blob:none origin renders >/dev/null 2>&1 || true
for f in vo hook-B hook-C; do
  [ "$f" != vo ] && [ ! -s src/vo/$ID/$f.words.json ] && continue
  if [ -s $V/$f.wav ]; then cp $V/$f.wav public/vo/$ID/; else git -C $R show origin/renders:2026-W44/sprint/vo/$ID/$f.wav > public/vo/$ID/$f.wav 2>/dev/null || { rm -f public/vo/$ID/$f.wav; echo "missing $f.wav"; exit 1; }; fi
  [ "$f" != vo ] && HOOKS=$HOOKS,${f#hook-}
done
echo $HOOKS
