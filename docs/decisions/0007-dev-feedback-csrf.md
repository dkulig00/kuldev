# 0007: Dev feedback endpoint and CSRF risk

Date: 2026-10-06
Status: accepted

## Context

The dev feedback overlay posts comments to `/api/dev-feedback`, which writes
JSON files into `.ai-feedback/`. An AI assistant reads those files and changes
the code. The endpoint has no authentication. Its only barrier is that it
returns 404 outside `NODE_ENV=development`.

## Decision

- Require `Content-Type: application/json`. A cross-site HTML `<form>` cannot
  send that type without a CORS preflight, so a plain form cannot reach the
  endpoint.
- Require the `Origin` header, and require its host (including port) to match
  the `Host` header.
- Limit the body to 50 kB and validate every field, including length limits.
- Build file names only from a whitelisted slug, and verify that the target

## Risk if ignored

Any page open in the same browser while `pnpm dev` runs could submit a
comment. Because the files are read by an AI assistant with repository access,
a crafted comment is a prompt-injection vector: someone outside the project
could plant instructions the assistant would follow.

## Revisit when

If the endpoint ever runs outside localhost or the LAN (for example in a
remote dev container), Origin and Host checks are not enough. Add a per-session
token before enabling it there.
