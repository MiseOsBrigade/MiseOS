import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreSource, classifyClaim } from '../src/sourceScore.js';
import { buildResearchPlan } from '../src/researchPlan.js';

test('primary current cited source scores high', () => {
  assert.equal(scoreSource({ kind: 'primary', current: true, hasCitation: true }), 7);
});

test('claim classification uses supporting sources', () => {
  assert.equal(classifyClaim({ sources: [{ kind: 'primary', current: true, hasCitation: true }] }), 'verified');
});

test('research plan has multiple steps', () => {
  assert.ok(buildResearchPlan('MiseOS').length >= 4);
});
