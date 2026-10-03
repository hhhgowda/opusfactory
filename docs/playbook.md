# How this repo implements the AI-Native SDLC Playbook

Course: <https://academy.claude.com/courses/ai-native-sdlc-playbook>

| Stage | Playbook practice | Where it lives here |
|---|---|---|
| 1 Plan | Capture work as `intent.md` | `docs/intents/NNNN-*/intent.md`, `docs/intents/TEMPLATE.md`, GitHub issue form `.github/ISSUE_TEMPLATE/intent.yml` |
| 2 Design | Expand intent into requirements + design | `requirements.md`, `design.md` per intent; `docs/adr/`; skill `intent-to-spec` |
| 3 Build | Plan mode as default | `.claude/settings.json` → `"defaultMode": "plan"` |
| | CLAUDE.md as institutional memory | `CLAUDE.md` (root) |
| | Skills as institutional knowledge | `.claude/skills/` — `intent-to-spec`, `ship-intent`, `add-screen`, `idb-migration` |
| | Parallel sessions & subagents | `.claude/agents/` — `test-writer`, `spec-reviewer`, `mobile-compat-reviewer`; `ship-intent` step 3 |
| 4 Test | Give Claude a feedback loop | Vitest + Playwright; PostToolUse Biome hook; Stop hook runs lint/typecheck/tests |
| | Continuous evals in CI | `.github/workflows/ci.yml` (lint, types, unit+coverage, size budget, traceability, e2e on Chromium+WebKit, Lighthouse) |
| 5 Deploy | AI in the PR review loop | `.github/workflows/claude-review.yml`, `@claude` via `claude.yml`, PR template |
| | Hooks as approval gates | `.claude/hooks/guard-bash.mjs`, `guard-files.mjs` (block / ask), `CODEOWNERS` for human review of critical paths |
| | Breaches become new intents | `ci.yml` → `breach-to-intent` job opens an `intent` + `policy-breach` issue |
| | CI/CD integration | `.github/workflows/deploy.yml` (gate → build → GitHub Pages) |
| 6 Maintain | Close the loop on metrics | `docs/metrics.md`, `.github/workflows/metrics.yml`, `scripts/metrics-report.mjs`, on-device `errors` store |

## The everyday loop

1. Write `docs/intents/NNNN-slug/intent.md` (or open an Intent issue).
2. In Claude Code: *"Run intent-to-spec on intent NNNN."* Review `requirements.md` / `design.md`.
3. *"Ship intent NNNN."* Claude plans (plan mode), you approve, subagents write tests, Claude builds until the Stop hook is green.
4. Push branch → PR. CI + Claude review run. Humans review CODEOWNERS paths and do the real-device check. Merge.
5. `deploy.yml` gates and ships to Pages. Weekly metrics report → new intents.
