import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapWebToPvx, validateWebPvxMapping } from './server/web-pvx-mapping-core.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const farmersRoot = process.env.FARMERS408_ROOT || path.resolve(root, '../408farmers');
for (const [route, program] of [['healthcare','healthcare'],['teachers','teachers'],['tech','technology'],['engineers','engineers']]) {
  const html = fs.readFileSync(path.join(farmersRoot, route, 'index.html'), 'utf8');
  assert.match(html, /data-pvx-native-entry/);
  assert.match(html, /data-pvx-native-mount/);
  assert.match(html, /data-pvx-legacy-recovery="true"/);
  assert.match(html, /pvx-native-entry\.js/);
  assert.match(html, /Text Dylan/);
  const mapping = mapWebToPvx({ entry_type:'professional', route_path:`/${route}/`, professional_program:program, customer_selection:'review_professional_home', customer_words:'Yes — build my home Snapshot' });
  assert.equal(mapping.context.professional.program, program);
  assert.equal(mapping.context.professional.eligibilityDetermined, false);
  assert.equal(mapping.context.professional.discountDetermined, false);
  assert.equal(mapping.discovery.answers.shoppingReason, undefined);
  assert.equal(validateWebPvxMapping(mapping).valid, true);
}
console.log(JSON.stringify({ sprint:'408-CF-PVX-WEB-1.6', pass:true, checks:40 }));
