import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../../../apps/lineage-editor/index.html', import.meta.url), 'utf8');
const required = [
  'MiseOS Lineage Editor v2',
  'draggable',
  'localStorage',
  'exportMD',
  'exportJSON',
  'Rights Review Dashboard',
  'Misinformation Risk Heatmap',
  'ECTI',
  'STL',
  'CSM',
  'KAQ',
  'GMI'
];
for (const token of required) assert.ok(html.includes(token), `Missing required editor capability: ${token}`);
assert.ok(html.includes('<!doctype html>'), 'Editor must be a complete HTML document');
assert.ok(html.length > 10000, 'Editor build is unexpectedly small');
console.log(`Lineage Editor validation passed (${html.length} bytes, ${required.length} capabilities).`);
