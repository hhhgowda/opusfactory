---
name: ship-intent
description: Drive an accepted intent from spec to a merged-ready pull request — plan, parallel build, feedback loop, review, PR. Use when the user says "build intent NNNN", "implement this spec", or "ship it".
---

# Ship an intent (playbook Build → Test → Deploy)

Precondition: `docs/intents/NNNN-*/requirements.md` and `design.md` exist (else run `intent-to-spec`).

1. **Branch**: `git switch -c intent/NNNN-slug`.
2. **Plan (plan mode)**: present a numbered plan grouped by requirement ID: files, tests, order, risks.
   Mark which steps are independent. Wait for approval.
3. **Build in parallel where independent**: dispatch subagents with tight scopes, e.g.
   - `test-writer` — write failing tests for FR-x… from requirements.md.
   - main session — implement against those tests.
   - For truly separate areas (e.g. two screens) use separate worktrees/sessions; each owns distinct files.
4. **Feedback loop**: `npm test` after each change; `npm run test:e2e -- --project=android` before review.
   Do not weaken a test to make it pass — fix the code or raise it with the user.
5. **Self-review**: run the `mobile-compat-reviewer` and `spec-reviewer` agents on the diff (`git diff main...`).
   Address findings or record why not.
6. **Verify**: `npm run verify` must be green. Update `design.md` if the implementation diverged.
7. **Commit & PR**: conventional commits (`feat(intent-NNNN): …`). Push the branch and open a PR with the template;
   fill the requirement checklist and the real-device checkbox stays for the human.
8. Mark the intent `Status: Done` only after merge.
