#!/usr/bin/env node
// Generate source-index.json entries from a live source. No jq needed.
//
// Database (Airtable) mode: index tables/fields from a saved list_tables dump:
//   node verify/build-source-index.mjs <base-dump.json> <tblId> [tblId...] [--write]
//
// Folder mode: index the real file paths of a folder territory:
//   node verify/build-source-index.mjs --dir <folder> --key <name> [--write]
//
// --write merges into source-index.json; without it, the fragment is printed for review.
// Database mode fills tables + table_fields + the fld id map. Folder mode fills folders[<name>].files.
// You still add record_counts / ghost_fields / ghost_names / ghost_files yourself, AFTER probing (dead calls need evidence).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const args = process.argv.slice(2);
const write = args.includes('--write');
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const here = dirname(fileURLToPath(import.meta.url));
const idxPath = join(here, 'source-index.json');

function mergeWrite(patch, msg) {
  if (!write) { console.log(JSON.stringify(patch, null, 2)); console.error('\n// fragment printed. Re-run with --write to merge into source-index.json.'); process.exit(0); }
  const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
  for (const k of Object.keys(patch)) idx[k] = deepMerge(idx[k] || {}, patch[k]);
  writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
  console.log(msg);
  process.exit(0);  // stop here, folder mode must not fall through into database mode
}
function deepMerge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) ? deepMerge(a[k] || {}, b[k]) : b[k];
  return out;
}

// ---- folder mode ----
const dir = flag('--dir');
if (dir) {
  const key = flag('--key');
  if (!key) { console.error('folder mode needs --key <name>'); process.exit(2); }
  const files = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      if (e === '.git' || e === 'node_modules') continue;
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else files.push(relative(dir, p).replace(/\\/g, '/'));
    }
  })(dir);
  files.sort();
  mergeWrite({ folders: { [key]: { files } } },
    `folder "${key}": indexed ${files.length} files into source-index.json. Now add ghost_files (the paths you have proven dead) after probing.`);
}

// ---- database mode ----
const rest = args.filter(a => !a.startsWith('--') && a !== flag('--dir') && a !== flag('--key'));
const dumpPath = rest[0];
const tblIds = rest.slice(1);
if (!dumpPath || !tblIds.length) { console.error(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).join('\n')); process.exit(2); }

const dump = JSON.parse(readFileSync(dumpPath, 'utf8'));
const byId = new Map((dump.tables || []).map(t => [t.id, t]));
const tables = {}, table_fields = {}, fields = {};
for (const id of tblIds) {
  const t = byId.get(id);
  if (!t) { console.error(`not found in dump: ${id}`); process.exit(1); }
  tables[id] = t.name;
  table_fields[id] = t.fields.map(f => f.name);
  for (const f of t.fields) fields[f.id] = `${t.name} / ${f.name}`;
}
mergeWrite({ tables, table_fields, fields },
  `merged ${tblIds.length} table(s): tables, table_fields, and ${Object.keys(fields).length} field ids into source-index.json. Now add record_counts and any ghost_fields/ghost_names you have proven.`);
