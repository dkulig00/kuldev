#!/usr/bin/env bash
# SessionStart: tell Claude how many dev feedback items are still open.
set -euo pipefail

feedback_dir="$CLAUDE_PROJECT_DIR/.ai-feedback"

# No feedback directory yet: nothing to report.
[[ -d "$feedback_dir" ]] || exit 0

shopt -s nullglob
files=("$feedback_dir"/*.json)
count=${#files[@]}

# Nothing open: stay silent so the session context stays clean.
(( count > 0 )) || exit 0

echo "Dev feedback: $count open item(s) in .ai-feedback/. Read the JSON files there before starting work and ask the user whether to address them."