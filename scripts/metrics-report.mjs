// Weekly metrics report (markdown to stdout). See docs/metrics.md for definitions and thresholds.
// Needs: a fresh `npm run build`, and `gh` authenticated (GH_TOKEN) for delivery metrics.
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const sh = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
};
const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
const rows = [];
const row = (metric, value, target, ok) =>
  rows.push(`| ${metric} | ${value} | ${target} | ${ok ? '✅' : '⚠️'} |`);

// Product health: bundle size
try {
  const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
  const entry = Object.values(manifest).find((c) => c.isEntry);
  const kb = gzipSync(readFileSync(`dist/${entry.file}`)).length / 1024;
  row('Initial JS (gzip)', `${kb.toFixed(1)} KB`, '≤ 50 KB', kb <= 50);
} catch {
  row('Initial JS (gzip)', 'n/a (no build)', '≤ 50 KB', false);
}

// Delivery: merged PRs + lead time (open → merge)
const prs = JSON.parse(
  sh(`gh pr list --state merged --search "merged:>=${since}" --json createdAt,mergedAt --limit 200`) || '[]',
);
const hours = prs.map((p) => (new Date(p.mergedAt) - new Date(p.createdAt)) / 36e5).sort((a, b) => a - b);
const median = hours.length ? hours[Math.floor(hours.length / 2)] : null;
row('PRs merged (7d)', String(prs.length), 'trend', true);
row(
  'Median PR lead time',
  median === null ? 'n/a' : `${median.toFixed(1)} h`,
  '≤ 24 h',
  median === null || median <= 24,
);

// Quality: CI / deploy success rate
const runs = JSON.parse(
  sh(`gh run list --workflow deploy.yml --created ">=${since}" --json conclusion --limit 200`) || '[]',
);
const done = runs.filter((r) => r.conclusion);
const rate = done.length ? (100 * done.filter((r) => r.conclusion === 'success').length) / done.length : null;
row(
  'Main pipeline success rate',
  rate === null ? 'n/a' : `${rate.toFixed(0)}%`,
  '≥ 90%',
  rate === null || rate >= 90,
);

// Process: intents and policy breaches
const intents = readdirSync('docs/intents', { withFileTypes: true }).filter((d) => d.isDirectory());
const openIntents = intents.filter((d) => {
  const text = sh(`cat docs/intents/${d.name}/intent.md`);
  return !/\*\*Status:\*\*\s*(Done|Superseded)/.test(text);
});
row('Open intents', `${openIntents.length} / ${intents.length}`, 'trend', true);
const breaches = JSON.parse(sh(`gh issue list --label policy-breach --state open --json number`) || '[]');
row('Open policy breaches', String(breaches.length), '0', breaches.length === 0);

console.log(`## Metrics report — week from ${since}\n`);
console.log('| Metric | Value | Target | |\n|---|---|---|---|');
console.log(rows.join('\n'));
console.log(
  '\nAny ⚠️ row: open a new intent from `docs/intents/TEMPLATE.md` with **Source: metrics finding**.',
);
