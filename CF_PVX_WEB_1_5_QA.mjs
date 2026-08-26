import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeSmsIntent } from './server/sms-conversation-core.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const farmersRoot = process.env.FARMERS408_ROOT || path.resolve(root, '../408farmers');
const auto = fs.readFileSync(path.join(farmersRoot, 'auto-bundle/index.html'), 'utf8');
assert.match(auto, /data-pvx-native-entry/);
assert.match(auto, /data-pvx-native-mount/);
assert.match(auto, /data-pvx-legacy-recovery="true"/);
assert.match(auto, /pvx-native-entry\.js/);
assert.equal(normalizeSmsIntent('Hi Dylan, I want to review my home and auto coverage.'), 'bundle');
assert.equal(normalizeSmsIntent('Hi Dylan, I want to check an auto and renters bundle.'), 'bundle');
assert.equal(normalizeSmsIntent('Hi Dylan, I’d like to review my home insurance.'), 'home_review');
assert.equal(normalizeSmsIntent('Hi Dylan, I just submitted a homebuyer coverage request.'), 'buyer');

const smsBodies = [];
for (const dirent of fs.readdirSync(farmersRoot, { recursive: true, withFileTypes: true })) {
  if (!dirent.isFile() || !dirent.name.endsWith('.html')) continue;
  const file = path.join(dirent.parentPath, dirent.name);
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="sms:[^"]*[?&](?:amp;)?body=([^"&]*)/g)) smsBodies.push(decodeURIComponent(match[1].replace(/\+/g, ' ')));
}
assert.ok(smsBodies.length >= 15, 'real 408FARMERS SMS bodies discovered');
const outcomes = smsBodies.map(body => ({ body, intent: normalizeSmsIntent(body) || 'producer_safe_fallback' }));
assert.ok(outcomes.every(item => ['buyer','home_review','bundle','other','producer_safe_fallback'].includes(item.intent)));
assert.ok(outcomes.some(item => item.body.includes('home and auto') && item.intent === 'bundle'));
assert.ok(outcomes.filter(item => /life insurance|professional discounts|insurance review/i.test(item.body)).every(item => item.intent === 'producer_safe_fallback'));
console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.5', pass: true, checks: 13, realSmsBodies: smsBodies.length }));
