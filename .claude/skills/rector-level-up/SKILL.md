---
name: rector-level-up
description: Raise one Rector level (type coverage, dead code or code quality) in apps/api by exactly one step, apply it safely, verify with QA and commit. Use when asked to level up Rector or gradually modernize PHP code.
---

# Rector level up

Goal: small, reviewable, safe improvement of the API codebase.

## Steps

1. Read `apps/api/rector.php`. Pick the level with the LOWEST value among
   `withTypeCoverageLevel`, `withDeadCodeLevel`, `withCodeQualityLevel`.
2. Increase that single level by 1. Change nothing else.
3. Run `cd apps/api && vendor/bin/rector --dry-run`.
   - No changes → increase the same level by 1 again and repeat (max 5 times).
4. Apply: `composer fix`.
5. Verify: `composer qa`.
6. If QA fails and the fix is not obvious: revert all changes
   (`git checkout -- apps/api`) and report what failed. Do NOT force it.
7. On success, commit:
   `refactor(api): raise rector <level-name> to <N>`

## Report to the user (in Polish)

- which level changed and to what value
- list of applied Rector rules with one-line explanation each
- files changed count
