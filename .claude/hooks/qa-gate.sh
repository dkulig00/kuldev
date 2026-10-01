#!/usr/bin/env bash
# Stop: Claude cannot finish while API or web QA is red.
# Blocks up to MAX_ATTEMPTS times per session, then gives up and warns the user.
set -uo pipefail

MAX_ATTEMPTS=3

input=$(cat)
session=$(echo "$input" | jq -r '.session_id // "unknown"')
counter="/tmp/claude-qa-gate-$session"

cd "$CLAUDE_PROJECT_DIR"

errors=""

if git status --porcelain -- apps/api | grep -q .; then
  if ! out=$(cd apps/api && composer qa 2>&1); then
    errors+=$'composer qa failed in apps/api:\n'"$(echo "$out" | tail -n 40)"$'\n\n'
  fi
fi

if git status --porcelain -- apps/web | grep -q .; then
  if ! out=$(cd apps/web && pnpm qa 2>&1); then
    errors+=$'pnpm qa failed in apps/web:\n'"$(echo "$out" | tail -n 40)"$'\n\n'
  fi
fi

# All green: reset counter and allow stopping.
if [ -z "$errors" ]; then
  rm -f "$counter"
  exit 0
fi

attempts=$(cat "$counter" 2>/dev/null || echo 0)

# Too many attempts: stop blocking, tell the user instead of looping forever.
if [ "$attempts" -ge "$MAX_ATTEMPTS" ]; then
  rm -f "$counter"
  echo '{"systemMessage": "QA gate: still failing after '"$MAX_ATTEMPTS"' attempts. Check composer qa / pnpm qa manually."}'
  exit 0
fi

echo $((attempts + 1)) > "$counter"
echo "Fix these QA failures before finishing (attempt $((attempts + 1))/$MAX_ATTEMPTS):" >&2
echo "$errors" >&2
exit 2