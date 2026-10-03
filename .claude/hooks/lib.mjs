// Shared helpers for Claude Code hooks. Hooks receive a JSON payload on stdin.
import { relative } from 'node:path';

export async function readInput() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

export function rel(path) {
  return path ? relative(projectDir, path).replaceAll('\\', '/') : '';
}

/** Hard block: exit 2, stderr is fed back to Claude. */
export function block(reason) {
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}

/** Approval gate: ask the human to approve this specific tool call (PreToolUse only). */
export function ask(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}
