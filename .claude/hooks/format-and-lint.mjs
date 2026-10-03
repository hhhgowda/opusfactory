// PostToolUse(Edit|Write) — format the touched file with Biome and feed lint errors back to Claude.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { block, projectDir, readInput, rel } from './lib.mjs';

const { tool_input = {} } = await readInput();
const path = tool_input.file_path;
if (!path || !existsSync(path) || !/\.(tsx?|jsx?|mjs|json|css)$/.test(path)) process.exit(0);

const result = spawnSync('npx', ['biome', 'check', '--write', '--no-errors-on-unmatched', path], {
  cwd: projectDir,
  encoding: 'utf8',
});
if (result.status !== 0) {
  block(`Biome found problems in ${rel(path)} — fix them:\n${(result.stdout + result.stderr).slice(-4000)}`);
}
