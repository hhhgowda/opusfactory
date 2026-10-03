// Stop — feedback loop: before Claude finishes, lint + typecheck + unit tests must pass
// whenever source files changed. Failures are fed back so Claude keeps working.
import { spawnSync } from 'node:child_process';
import { block, projectDir, readInput } from './lib.mjs';

const input = await readInput();
if (input.stop_hook_active) process.exit(0); // already continuing because of this hook: avoid loops

const changed =
  spawnSync('git', ['status', '--porcelain'], { cwd: projectDir, encoding: 'utf8' }).stdout ?? '';
if (!/\s(src|e2e|index\.html|vite\.config\.ts|tsconfig\.json)/.test(changed)) process.exit(0);

for (const script of ['lint', 'typecheck', 'test']) {
  const r = spawnSync('npm', ['run', '--silent', script], { cwd: projectDir, encoding: 'utf8' });
  if (r.status !== 0) {
    block(
      `Stop hook: \`npm run ${script}\` failed. Fix it before finishing.\n` +
        `${(r.stdout + r.stderr).slice(-6000)}`,
    );
  }
}
