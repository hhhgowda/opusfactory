// PreToolUse(Bash) — governance gate for shell commands.
import { ask, block, readInput } from './lib.mjs';

const { tool_input: { command = '' } = {} } = await readInput();
const cmd = command.replace(/\s+/g, ' ').trim();

const BLOCK = [
  [/\bgit push\b.*(--force|-f\b)/, 'Force-push is not allowed. Open a PR instead.'],
  [
    /\bgit push\b.*(\s|:)(main|master)(\s|$)/,
    'Direct pushes to main are not allowed. Push a branch and open a PR.',
  ],
  [/\brm -rf? (\/|~|\.)(\s|$)/, 'Refusing to delete the project root, home or filesystem root.'],
  [/\bnpm publish\b/, 'This app is never published to npm.'],
  [/\b(cat|less|more|head|tail)\b.*\.env\b/, 'Do not read .env files; secrets stay out of the transcript.'],
  [/--no-verify\b/, 'Do not bypass git hooks with --no-verify.'],
];
for (const [re, reason] of BLOCK)
  if (re.test(cmd)) block(`Blocked by .claude/hooks/guard-bash.mjs: ${reason}`);

const ASK = [
  [
    /\bnpm (i|install|add|uninstall|remove)\b(?!\s*$)/,
    'Adds/removes a dependency. Check bundle budget (NFR-2) and license.',
  ],
  [/\bgit (reset --hard|clean -[a-z]*f)/, 'Destructive git operation — local work may be lost.'],
  [/\bgh (pr merge|release create)\b/, 'Merging/releasing is a human decision.'],
];
for (const [re, reason] of ASK) if (re.test(cmd)) ask(`Approval gate: ${reason}`);
