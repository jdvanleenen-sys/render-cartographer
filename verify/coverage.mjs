#!/usr/bin/env node
// Coverage check for a folder territory: every real file must be ACCOUNTED FOR by the map —
// referenced by name in a card, claimed by a card's `**Covers:**` glob, a registered ghost,
// or an explicit excluded-with-reason entry. An unaccounted file is a hole a reader falls
// through, so this fails loud. (This turns rules.md §1's "account for every noun" into a guard.)
//
// Usage: node verify/coverage.mjs <map-dir> <folder-key>
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(readFileSync(join(here, 'source-index.json'), 'utf8'));

const [mapDir, key] = process.argv.slice(2);
if (!mapDir || !key) { console.error('usage: coverage.mjs <map-dir> <folder-key>'); process.exit(2); }
const folder = (src.folders || {})[key];
if (!folder) { console.error(`no folder "${key}" registered in source-index.json`); process.exit(2); }

// gather the map's text
const parts = [];
(function walk(d) { for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.md')) parts.push(readFileSync(p, 'utf8')); } })(mapDir);
const text = parts.join('\n');

const globToRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
const covers = [];
for (const m of text.matchAll(/\*\*Covers:\*\*\s*([^\n]+)/gi)) covers.push(...m[1].split(',').map(s => s.trim()).filter(Boolean));
// a glob with a "/" is matched against the file's relative PATH; a bare glob against its basename
const mkGlob = g => ({ re: globToRe(g), path: g.includes('/') });
const coversG = covers.map(mkGlob);
const exclG = (folder.excluded || []).map(e => mkGlob(typeof e === 'string' ? e : e.glob));
const ghosts = new Set((folder.ghost_files || []).map(p => p.split('/').pop().toLowerCase()));

// a basename is "referenced" if it appears as a whole token, path-prefix allowed
// (tests/foo.py counts; foo.js must NOT match foo.json or barfoo.js)
const referenced = b => new RegExp('(?<![\\w.\\-])' + b.replace(/[.+^${}()|[\]\\*?]/g, '\\$&') + '(?![\\w])', 'i').test(text);

const files = folder.files || [];
const t = { referenced: 0, grouped: 0, ghost: 0, excluded: 0, unaccounted: [] };
for (const f of files) {
  const b = f.split('/').pop();
  if (referenced(b)) t.referenced++;
  else if (coversG.some(c => c.path ? c.re.test(f) : c.re.test(b))) t.grouped++;
  else if (ghosts.has(b.toLowerCase())) t.ghost++;
  else if (exclG.some(c => c.path ? c.re.test(f) : c.re.test(b))) t.excluded++;
  else t.unaccounted.push(f);
}
console.log(`coverage: ${key} — ${files.length} files`);
console.log(`  referenced by name: ${t.referenced}`);
console.log(`  covered by group:   ${t.grouped}`);
console.log(`  ghost:              ${t.ghost}`);
console.log(`  excluded w/ reason: ${t.excluded}`);
console.log(`  UNACCOUNTED:        ${t.unaccounted.length}`);
if (t.unaccounted.length) {
  for (const f of t.unaccounted.slice(0, 40)) console.error('    - ' + f);
  if (t.unaccounted.length > 40) console.error(`    …and ${t.unaccounted.length - 40} more`);
  console.error('\nAccount for each: name it in a card, add a card **Covers:** glob, register it as a ghost, or add it to folders["' + key + '"].excluded with a reason.');
  process.exit(1);
}
console.log('  clean — every file is accounted for.');
process.exit(0);
