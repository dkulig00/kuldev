#!/usr/bin/env bash
# Stop: Claude cannot finish while API QA is red.
input=$(cat)

# Avoid infinite loop: if we already blocked once, let it stop.
[ "$(echo "$input" | jq -r '.stop_hook_active')" = "true" ] && exit 0

cd "$CLAUDE_PROJECT_DIR"

# Run only if something changed in apps/api
if git status --porcelain -- apps/api | grep -q .; then
  if ! out=$(cd apps/api && composer qa 2>&1); then
    echo "composer qa failed in apps/api. Fix the issues before finishing:" >&2
    echo "$out" | tail -n 60 >&2
    exit 2
  fi
fi

exit 0