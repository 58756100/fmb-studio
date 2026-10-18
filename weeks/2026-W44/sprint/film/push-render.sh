#!/bin/bash
# ./push-render.sh <local file> <path on renders> "<message>"  -> one small commit on the orphan `renders` branch.
# Uses a temporary index (no checkout, so no render blobs are downloaded); fetches the tip first and retries on a race.
set -euo pipefail
F=$1; P=$2; MSG=$3; R=$(git rev-parse --show-toplevel)
for try in 1 2 3 4 5; do
  git -C "$R" fetch --depth 1 --filter=blob:none origin renders >/dev/null 2>&1
  TIP=$(git -C "$R" rev-parse FETCH_HEAD); IDX=$(mktemp -u)
  BLOB=$(git -C "$R" hash-object -w "$F")
  GIT_INDEX_FILE=$IDX git -C "$R" read-tree "$TIP"
  GIT_INDEX_FILE=$IDX git -C "$R" update-index --add --cacheinfo 100644,"$BLOB","$P"
  TREE=$(GIT_INDEX_FILE=$IDX git -C "$R" write-tree); rm -f "$IDX"
  C=$(printf '%s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_016g3Ws6RKPFxbXeFgZ5cwJK\n' "$MSG" | git -C "$R" commit-tree "$TREE" -p "$TIP")
  if git -C "$R" push origin "$C:refs/heads/renders" 2>&1 | tail -1; then
    git -C "$R" ls-remote origin renders | grep -q "$C" && { echo "pushed $P ($C)"; exit 0; }
  fi
  sleep $((try * 3))
done
echo "FAILED to push $P"; exit 1
