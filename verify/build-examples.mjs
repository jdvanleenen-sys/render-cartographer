#!/usr/bin/env node
// Regenerate examples.md as a DERIVED flattened view of map/ — so the worked example and the
// real map cannot drift (ICM: one home per fact). Run after you change map/.
//   node verify/build-examples.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const mapDir = join(root, 'map');
const rd = (...p) => readFileSync(join(...p), 'utf8').trim();
const list = (d) => readdirSync(join(mapDir, d)).filter(f => f.endsWith('.md')).sort();

const banner = `# Worked map — the Render Factory (flattened preview)

> GENERATED from \`map/\` by \`verify/build-examples.mjs\` — do not hand-edit this file. It is the
> tour; the wanderable map is \`map/\` (start at \`map/catalog.md\`, open one card, then stop).`;

const parts = [banner, rd(mapDir, 'catalog.md')];
for (const c of list('cards')) parts.push(rd(mapDir, 'cards', c));
for (const w of list('change-walks')) parts.push(rd(mapDir, 'change-walks', w));

writeFileSync(join(root, 'examples.md'), parts.join('\n\n---\n\n') + '\n');
console.log(`examples.md regenerated from map/ (${list('cards').length} cards, ${list('change-walks').length} change-walks).`);
