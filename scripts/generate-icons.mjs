// Regenerates PWA icons from public/favicon.svg. Run: npm run icons
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname;
const bg = '#0f172a';

await sharp(svg).resize(192, 192).png().toFile(out('pwa-192x192.png'));
await sharp(svg).resize(512, 512).png().toFile(out('pwa-512x512.png'));
// iOS: opaque, no rounded corners (iOS applies its own mask).
const square = Buffer.from(svg.toString().replace('rx="112"', 'rx="0"'));
await sharp(square).resize(180, 180).flatten({ background: bg }).png().toFile(out('apple-touch-icon.png'));
// Maskable: art inside the 80% safe zone on a full-bleed background.
const inner = await sharp(square).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: bg } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(out('maskable-512x512.png'));
console.log('icons generated');
