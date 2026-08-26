import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  ACTION_READINESS_STATES,
  CHANGE_SCOPES,
  DESIRED_NEXT_ACTIONS,
  SEMANTIC_BOUNDARIES,
  appendImmutable,
  extendReadinessRecord,
  readinessState
} from './server/pvx-readiness-core.mjs';

if (process.env.COVERAGEFIT_REGRESSION !== '1') assert.equal(fs.readFileSync('VERSION','utf8').trim(), '3.20.176');
assert.deepEqual(ACTION_READINESS_STATES, ['open_if_fit','wants_explanation_first','price_dependent','exploring','not_sure']);
assert.deepEqual(CHANGE_SCOPES, ['coverage_structure','carrier','either','not_sure']);
assert.equal(DESIRED_NEXT_ACTIONS.length, 7);
const legacy = extendReadinessRecord({ checkpointId:'legacy' });
assert.deepEqual(legacy.actionReadinessExpressions, []);
assert.deepEqual(legacy.changeScopeExpressions, []);
assert.equal(readinessState(legacy).missingReadiness, true);
assert.equal(readinessState(legacy).missingChangeScope, true);
const withReadiness = appendImmutable(legacy, 'actionReadinessExpressions', { expressionId:'pvr_12345678', state:'exploring', sourceCheckpoint:'snapshot', expressedAt:'2026-08-22T00:00:00.000Z' });
assert.equal(readinessState(withReadiness).currentActionReadiness.state, 'exploring');
assert.equal(readinessState(withReadiness).currentChangeScope, null);
assert.equal(SEMANTIC_BOUNDARIES.opportunityProjectionIsLeadScore, false);
assert.throws(() => appendImmutable(withReadiness, 'actionReadinessExpressions', { expressionId:'pvr_12345678', state:'open_if_fit', sourceCheckpoint:'snapshot' }), /Immutable/);
console.log(JSON.stringify({sprint:'CF-PVX-READY-1.0',pass:true,checks:12}));
