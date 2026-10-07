---
name: grill-plan
description: Skeptically grill a work plan before any code is written - either clarify the brief before planning (brief mode) or review an existing plan against CLAUDE.md, ADRs and a checklist of past lessons (review mode). Use when the user runs /grill-plan, asks to "grill" a plan ("grillowanie"), to interrogate a plan ("przesłuchanie planu"), or for a critical review of a plan.
---

# Grill plan

Goal: catch wrong assumptions, rule violations and missing decisions while they
are still cheap to fix - before code exists.

Reply to the user in Polish. Keep code identifiers, paths and commands in English.

## Pick the mode

- **brief** - there is no plan yet (the user is about to start planning).
- **review** - a plan exists: in this conversation, or in a file the user points
  to (usually `docs/plans/YYYY-MM-DD-slug.md`).

If the user passed `brief` or `review` as an argument, use it. Otherwise infer it;
ask only if both are plausible.

## Mode 1: brief (before the plan)

1. Read `CLAUDE.md`, the titles of `docs/decisions/` and anything in the repo the
   task obviously touches. Do not ask what these already answer.
2. Ask the user with `AskUserQuestion` (max 4 questions per call, max 2 rounds)
   only about what is still open:
   - business goal and audience (who uses this, what should they do or feel),
   - definition of done (what must be true to call it finished),
   - scope, and explicitly what is OUT of scope,
   - constraints: devices, languages (PL/EN), accessibility, performance,
   - decisions that belong to the user, not the AI (copy, visual direction,
     new dependencies, trade-offs between cost and quality).
   Offer concrete options with a recommended one first; skip any question with a
   sensible default from the repo and state that default instead.
3. Finish with a short summary of the findings ("Ustalenia do planu"), formatted
   so the user can paste it into the planning prompt: goal, done criteria, in
   scope, out of scope, constraints, decisions made, defaults assumed.

## Mode 2: review (after the plan)

1. Get the plan: from the conversation, or read the file the user named. If it is
   ambiguous which plan to review, ask.
2. Read context first, fully: `CLAUDE.md`, every file in `docs/decisions/`, and
   the plans in `docs/plans/` related to the same area. Check claims in the plan
   against the real code (files, configs, CI) instead of trusting them.
3. Read `checklist.md` (next to this file) and go through it item by item.
   Skip items that do not apply. Report only real problems: each one needs a
   concrete scenario in this repo where it hurts. A vague "consider X" is not a
   finding.
4. Do not edit the plan or any file. The output is the review.

## Review output format

1. **Werdykt** - one sentence. If the plan has no serious problems, say so
   plainly. Never invent findings to make the list longer.
2. **Znaleziska**, sorted by severity:
   - **Blokujące** - the plan breaks a rule/ADR, loses data, ships something
     wrong to production, or cannot work as written.
   - **Ważne** - likely bug, missing test for a behavior or safeguard, costly
     rework later.
   - **Drobne** - clarity, naming, small gaps.
   For each: what is wrong (with a reference: plan section, ADR, file:line),
   the concrete scenario where it hurts, the proposed fix.
3. **Decyzje dla użytkownika** - questions the AI must not settle on its own
   (copy, scope, new dependencies, changing an ADR, cost vs. quality). For each,
   give the options and a recommendation.
4. **Poprawki do wklejenia** - ready-to-paste text that amends the plan (in
   Polish, like the plans themselves), covering every finding above.

## Keeping the checklist alive

When a review (or a bug found later) teaches a new lesson, propose adding it to
`checklist.md` in the right group: short item, "why", example from this repo.
