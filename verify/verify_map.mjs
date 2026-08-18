#!/usr/bin/env node
// Verify a Cartographer map against the real source. Fails loud, exits non-zero.
// Usage: node verify/verify_map.mjs <path...>   (a path may be a file or a directory)
//
// Every check has a negative fixture in verify/fixtures/ that must fail on it, so the
// gate is proven to catch its own soft spot rather than asserted to.
//
// Universal (run on every file):
//   1. citation anchor   - every tbl/fld id in the file exists in source-index.json
//   2. field citation     - every explicit  field "X"  claim resolves to a real field
//   3. ghost-as-live      - a live/leftover block citing a proven-dead field (id OR name) fails
//   4. record count       - any "N records" claim must match source-index record_counts
//   5. no-slurp           - an affirmative "load the whole thing" instruction fails
//
// Structural (run by file role, so the one rule is enforced by shape not phrasing):
//   6. a card file (map/cards/*.md) holds exactly ONE card, complete unless it is a ghost
//   7. the catalog (catalog.md) holds NO full cards (it points only) and does point at cards/
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(readFileSync(join(here, 'source-index.json'), 'utf8'));
const knownIds = new Set([...Object.keys(src.tables), ...Object.keys(src.fields)]);
const ghostFields = new Set(src.ghost_fields || []);
const ghostNames = (src.ghost_names || []).map(n => n.toLowerCase());
const allFieldNames = new Set(Object.values(src.table_fields || {}).flat().map(n => n.toLowerCase()));
const recordCounts = src.record_counts || {};
// folder territories: real file paths (matched by basename) and the ones proven dead
const folders = src.folders || {};
const knownFiles = new Set(Object.values(folders).flatMap(f => (f.files || []).map(p => p.split('/').pop().toLowerCase())));
const ghostFiles = new Set(Object.values(folders).flatMap(f => (f.ghost_files || []).map(p => p.split('/').pop().toLowerCase())));
const SKILL_FILES = new Set(['verify_map.mjs', 'build-source-index.mjs', 'build-examples.mjs', 'source-index.json']);
const FILE_RE = /\b[\w.\-/]+\.(?:ps1|psm1|json|mjs|cjs|js|ts|sql|py|sh|ya?ml|env|toml|ini)\b/gi;
// A real filename has a distinctive stem (underscore, hyphen, digit, or uppercase). This keeps
// code expressions like item.json / response.json / $json out of the file-citation check.
const fileShaped = (base) => { const s = base.slice(0, base.lastIndexOf('.')); return /[_\-]/.test(s) || /\d/.test(s) || /[A-Z]/.test(s); };

function collect(p, acc) {
  const s = statSync(p);
  if (s.isDirectory()) { for (const e of readdirSync(p)) collect(join(p, e), acc); }
  else if (p.endsWith('.md')) acc.push(p);
  return acc;
}

function checkFile(path) {
  const text = readFileSync(path, 'utf8');
  const rel = path.replace(/\\/g, '/');
  const errs = [];

  // 1. citation anchor
  for (const id of new Set(text.match(/\b(?:tbl|fld)[A-Za-z0-9]{14}\b/g) || [])) {
    if (!knownIds.has(id)) errs.push(`uncited: ${id} is not in source-index.json`);
  }
  // 2. field citation — DATABASE territories only (map cites at least one tbl id). On a folder
  //    or SQL territory a phrase like  field "Customer_No"  is a real column, not an Airtable
  //    field, and must not be flagged. Skip captures that are ids (checked by the anchor above).
  if (/\btbl[A-Za-z0-9]{14}\b/.test(text)) {
    for (const m of text.matchAll(/field\s+["'`]([^"'`]+)["'`]/gi)) {
      const nm = m[1].trim();
      if (/^(?:fld|tbl)[A-Za-z0-9]{14}$/.test(nm)) continue;
      if (!allFieldNames.has(nm.toLowerCase())) errs.push(`invented-field: "${nm}" is not a real field of any slice table`);
    }
  }
  // primary table of this file = first table id cited
  const primaryTbl = (text.match(/\btbl[A-Za-z0-9]{14}\b/) || [])[0];
  // 4. record count — only on the Source line (the line that cites the table). Field-level
  //    counts elsewhere should be written as "rows", not "records", and are left alone.
  if (primaryTbl && recordCounts[primaryTbl] != null) {
    for (const line of text.split('\n')) {
      if (!line.includes(primaryTbl)) continue;
      const m = line.match(/\b(\d+)\s+records?\b/i);
      if (m && Number(m[1]) !== recordCounts[primaryTbl]) {
        errs.push(`bad-count: Source line claims ${m[1]} records but source-index has ${recordCounts[primaryTbl]} for ${primaryTbl}`);
      }
    }
  }

  // 8. folder path anchor. A cited code/config/data file must exist in a registered folder index.
  //    If a map cites files but no folder is registered, fail LOUD (do not pass a folder map blind).
  const citedFiles = [...new Set((text.match(FILE_RE) || []).map(p => p.split('/').pop()))]
    .filter(f => !SKILL_FILES.has(f.toLowerCase()) && fileShaped(f))
    .map(f => f.toLowerCase());
  if (citedFiles.length) {
    if (!knownFiles.size) {
      errs.push(`unregistered-folder: cites files (${citedFiles.slice(0, 3).join(', ')}${citedFiles.length > 3 ? '…' : ''}) but no folder index is registered — run: node verify/build-source-index.mjs --dir <folder> --key <name> --write`);
    } else {
      for (const f of citedFiles) if (!knownFiles.has(f)) errs.push(`uncited-file: ${f} is not in any registered folder index`);
    }
  }

  // per-block checks. Skip the catalog: it is points-only (check 7 governs it), so a section
  //    label like "## Retired but kept (leftover)" is not a card and must not demand Hits lines.
  const isCatalog = basename(rel) === 'catalog.md';
  const blocks = isCatalog ? [] : text.split(/^#{1,6}\s+/m).slice(1).map(b => '# ' + b);
  for (const b of blocks) {
    const head = b.split('\n')[0].trim();
    const tag = ((b.match(/\*\*Tag:\*\*\s*([A-Za-z]+)/i) || [])[1]
              || (head.match(/\((live|leftover|ghost|unknown)\b[^)]*\)/i) || [])[1] || '').toLowerCase();
    // 3. ghost-as-live + card completeness (a live/leftover/unknown block is a noun card, anywhere).
    if (tag === 'live' || tag === 'leftover' || tag === 'unknown') {
      // Only the claim region (Source/What/Shape, before "Hits:") counts as presenting a noun.
      // Naming a ghost in Hits / Does not hit is a legitimate warning, not a live claim.
      const claim = b.split(/(?:\*\*)?Hits:/i)[0];
      const cl = claim.toLowerCase();
      const citesGhostId = (claim.match(/\bfld[A-Za-z0-9]{14}\b/g) || []).some(id => ghostFields.has(id));
      const citesGhostName = ghostNames.some(n => cl.includes(n));
      const citesGhostFile = knownFiles.size && [...(claim.match(FILE_RE) || [])].some(p => ghostFiles.has(p.split('/').pop().toLowerCase()));
      if (citesGhostId || citesGhostName || citesGhostFile) errs.push(`ghost-as-live: block "${head.slice(0, 55)}" presents a proven-dead ${citesGhostFile ? 'file' : 'field'} as ${tag}`);
      if (!/\bHits:/i.test(b)) errs.push(`incomplete: card "${head.slice(0, 55)}" has no Hits line`);
      if (!/Does not hit:/i.test(b)) errs.push(`incomplete: card "${head.slice(0, 55)}" has no "Does not hit" line`);
    }
  }

  // 5. no-slurp
  const slurpObj = /(every file|all files|whole (?:objects |cards )?folder|entire (?:base|repo|folder)|everything (?:first|into))/i;
  const leadsNegation = /^(?:[-*]|\d+[.)])?\s*(?:do not|don'?t|never|no\b|avoid|without|instead)/i;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (/^(?:[-*]|\d+[.)])?\s*(load|add|read|import|slurp|ingest)\b/i.test(line) && slurpObj.test(line) && !leadsNegation.test(line)) {
      errs.push(`slurp: "${line.slice(0, 60)}"`);
    }
  }

  // 6. card-file role: exactly one card per file
  if (/\/cards\/[^/]+\.md$/.test(rel)) {
    const cardHeads = text.match(/^#{1,3}\s+.*\((?:live|leftover|ghost|unknown)\b[^)]*\)\s*$/gim) || [];
    if (cardHeads.length !== 1) errs.push(`granularity: a card file must hold exactly one card, found ${cardHeads.length}`);
  }
  // 7. catalog role: points only, no full cards
  if (basename(rel) === 'catalog.md') {
    if (/\bHits:/i.test(text) || /Does not hit:/i.test(text)) errs.push(`catalog: the catalog must point only, it must not embed full cards (found a Hits/Does-not-hit line)`);
    if (!/cards\//.test(text)) errs.push(`catalog: the catalog names no card files (cards/...)`);
  }
  return errs;
}

const args = process.argv.slice(2);
if (!args.length) { console.error('usage: verify_map.mjs <path...>'); process.exit(2); }
const files = [];
for (const a of args) collect(a, files);

let total = 0;
for (const f of files) {
  const errs = checkFile(f);
  const rel = f.replace(/\\/g, '/');
  if (errs.length) { total += errs.length; console.error(`FAIL ${rel}`); for (const e of errs) console.error('  - ' + e); }
  else console.log(`ok   ${rel}`);
}
console.log(total ? `\n${total} problem(s) across ${files.length} file(s)` : `\nclean across ${files.length} file(s)`);
process.exit(total ? 1 : 0);
