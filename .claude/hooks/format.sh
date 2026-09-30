#!/usr/bin/env bash
# PostToolUse: format the file Claude just edited.
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0

case "$file" in
  */apps/api/*.php)
    cd "$CLAUDE_PROJECT_DIR/apps/api"
    vendor/bin/pint "$file" --quiet
    ;;
  # apps/web: Prettier/ESLint added in stage 3
esac

exit 0