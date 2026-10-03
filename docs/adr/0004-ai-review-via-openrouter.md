# ADR 0004 — AI PR review and @claude via OpenRouter

- **Status:** Accepted · 2026-10-02 · Intent 0001 (CI/CD governance)

## Context
`claude-review.yml` and `claude.yml` use `anthropics/claude-code-action`, which by default needs an
Anthropic API key plus the Claude GitHub App. The owner has neither, so every PR showed a red
"Claude PR review" check. The repo is now public, so the review must not run on untrusted input with
our credentials, and @claude must not be triggerable by strangers.

## Decision
- Route the action through OpenRouter's Anthropic-compatible endpoint
  (`ANTHROPIC_BASE_URL=https://openrouter.ai/api`, `ANTHROPIC_AUTH_TOKEN` = secret `OPENROUTER_API_KEY`).
- Model comes from repo variable `REVIEW_MODEL`, default `z-ai/glm-5.3-flash` (~$0.03/M in, $0.90/M out).
  All Claude Code model tiers map to it so background calls cost the same.
- Use the workflow `GITHUB_TOKEN` instead of the Claude GitHub App.
- The review job skips (notice, not failure) when the secret is absent: fork PRs, Dependabot.
- @claude only runs for OWNER / MEMBER / COLLABORATOR comments.

## Consequences
- + Review cost of about 1–2¢ per PR; no Anthropic account needed.
- − OpenRouter states Claude Code is optimised for Anthropic models; non-Anthropic models are
  unsupported and may mis-use tools. If reviews come back empty or broken, set `REVIEW_MODEL` to an
  Anthropic model on OpenRouter (e.g. a Claude Haiku model). No code change is needed.
- − Comments are posted by `github-actions[bot]`, not the Claude app.
- − The AI review stays advisory; CI and human (CODEOWNERS) review remain the merge gate.

## Alternatives considered
Anthropic API key (preferred quality, but the owner has none). A Claude subscription token via
`claude setup-token` has open auth failures in the action (anthropics/claude-code-action#1281).
Disabling AI review (loses the playbook's AI-in-the-loop review stage).
