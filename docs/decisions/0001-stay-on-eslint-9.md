# 0001: Stay on ESLint 9

Date: 2026-10-01
Status: accepted

## Context

ESLint 10 is released, but eslint-config-next 16.3 depends on
eslint-plugin-react and eslint-plugin-jsx-a11y whose peer range ends at ESLint 9.

## Decision

Stay on ESLint ^9 (maintenance line, still receives fixes).

## Risk if ignored

Plugins running outside their supported range may silently stop reporting,
which looks identical to clean code.

## Revisit when

`npm view eslint-config-next dependencies` shows react and jsx-a11y plugin
versions whose peerDependencies include ESLint ^10.
