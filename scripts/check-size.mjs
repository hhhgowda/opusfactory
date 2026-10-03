// NFR-2: initial JS (entry chunk + its static imports) must stay under budget (gzip).
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 50;
const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
const entry = Object.values(manifest).find((c) => c.isEntry);
const seen = new Set();
const walk = (chunk) => {
  if (!chunk || seen.has(chunk.file)) return;
  seen.add(chunk.file);
  for (const imp of chunk.imports ?? []) walk(manifest[imp]);
};
walk(entry);
let total = 0;
for (const file of seen) {
  const kb = gzipSync(readFileSync(`dist/${file}`)).length / 1024;
  total += kb;
  console.log(`${kb.toFixed(1).padStart(6)} KB  ${file}`);
}
console.log(`${total.toFixed(1).padStart(6)} KB  initial JS total (budget ${BUDGET_KB} KB)`);
if (total > BUDGET_KB) {
  console.error(
    `✖ Initial JS exceeds budget by ${(total - BUDGET_KB).toFixed(1)} KB. Create an intent to address it.`,
  );
  process.exit(1);
}
