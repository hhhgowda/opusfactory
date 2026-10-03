// PreToolUse(Edit|Write) — protects files where a mistake is expensive.
import { existsSync } from 'node:fs';
import { ask, block, readInput, rel } from './lib.mjs';

const input = await readInput();
const { tool_input = {} } = input;
const file = rel(tool_input.file_path);

// Hard blocks
if (/(^|\/)\.env(\.|$)/.test(file)) block('Blocked: never write .env files from Claude.');
if (/(^|\/)package-lock\.json$/.test(file)) block('Blocked: do not hand-edit package-lock.json; use npm.');
if (/^(dist|dev-dist|node_modules)\//.test(file)) block(`Blocked: ${file} is generated.`);

// Schema changes are rare and risky (ADR 0002: migrations are append-only) — always ask a human.
if (file === 'src/db/schema.ts') {
  ask(
    'Approval gate: IndexedDB schema change. Confirm existing migration steps are untouched (append-only, ADR 0002).',
  );
}

// Human approval for governance & pipeline files.
const GATED = [
  [/^\.github\//, 'CI/CD and review configuration'],
  [/^\.claude\/(settings\.json|hooks\/)/, 'Claude governance hooks/settings'],
  [/^docs\/adr\/.+\.md$/, 'an architecture decision record'],
  [/^vite\.config\.ts$/, 'build / PWA manifest / service-worker configuration'],
];
for (const [re, what] of GATED) {
  if (re.test(file)) ask(`Approval gate: ${file} is ${what}. Confirm this change is intended.`);
}

// Creating a new intent is free; changing an existing one changes agreed scope.
if (/^docs\/intents\/[^/]+\/intent\.md$/.test(file) && existsSync(tool_input.file_path)) {
  ask(`Approval gate: ${file} is an existing intent (agreed scope). Confirm the scope change.`);
}
