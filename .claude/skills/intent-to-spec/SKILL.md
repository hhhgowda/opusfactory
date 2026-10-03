---
name: intent-to-spec
description: Turn a docs/intents/NNNN-*/intent.md into requirements.md and design.md (playbook Plan→Design). Use when a new intent is written or the user says "spec this", "write requirements", or "design this feature".
---

# Intent → Requirements → Design

Input: a folder `docs/intents/NNNN-slug/` containing `intent.md`. If none exists, create it from
`docs/intents/TEMPLATE.md` with the user first (next free number, kebab-case slug) and stop for their review.

## Steps

1. Read `intent.md`, `CLAUDE.md`, every ADR in `docs/adr/`, and the most recent prior intent's
   `requirements.md` (for ID style and what already exists).
2. List open questions. If any would change scope, ask the user (max 3 questions) before writing.
3. Write `requirements.md` in the same folder:
   - Functional table: `| ID | Requirement | Acceptance criteria | Verified by |`.
     IDs continue the project-wide sequence (check the highest FR-/NFR- number across all intents).
   - Every "Success looks like" bullet in the intent maps to ≥ 1 requirement.
   - "Verified by" names the concrete test file (unit in `src/**`, e2e in `e2e/**`) or "manual" + why.
   - Non-functional table for budgets, platforms, a11y, privacy. Reuse NFR-1…NFR-8 by reference rather than repeating.
4. Write `design.md`:
   - Modules touched/added (paths), data model changes (new migration step number), routes added to `src/routes.ts`.
   - iOS Safari vs Android differences and how each is handled.
   - Failure modes → which failure shell variant or inline error.
   - Risks/open questions.
5. If the design makes a decision that is hard to reverse (new dependency, storage model, SW strategy),
   draft `docs/adr/NNNN-title.md` (status: Proposed).
6. Summarize for the user: requirement IDs, files to create, tests to write, any ADR. Do **not** write code —
   the next step is plan mode for implementation (`ship-intent` skill).
