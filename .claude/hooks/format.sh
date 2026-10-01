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
    */apps/web/*.ts|*/apps/web/*.tsx|*/apps/web/*.css|*/apps/web/*.json|*/apps/web/*.md)
    cd "$CLAUDE_PROJECT_DIR/apps/web"
    pnpm exec prettier --write "$file" > /dev/null
    ;;
esac

exit 0