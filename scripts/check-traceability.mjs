// Every functional requirement verified by an automated test must have a test named with its ID.
// Runs in CI (checks job). Requirements marked "manual" or "superseded" in the "Verified by" column are skipped.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, filter, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== 'node_modules') walk(p, filter, out);
    } else if (filter(p)) out.push(p);
  }
  return out;
}

const reqFiles = walk('docs/intents', (p) => p.endsWith('requirements.md'));
const testText = walk('src', (p) => /\.test\.tsx?$/.test(p))
  .concat(walk('e2e', (p) => p.endsWith('.spec.ts')))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n');

const missing = [];
let checked = 0;
for (const file of reqFiles) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*(FR-\d+)\s*\|/);
    if (!m) continue;
    const cells = line.split('|').map((c) => c.trim());
    const verifiedBy = cells[cells.length - 2] ?? '';
    if (/^(manual|superseded)/i.test(verifiedBy)) continue;
    checked++;
    if (!new RegExp(`['"\`]${m[1]}\\b`).test(testText)) missing.push(`${m[1]} (${file})`);
  }
}

if (missing.length) {
  console.error(`✖ Requirements without a test named with their ID:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${checked} functional requirements traced to tests`);
