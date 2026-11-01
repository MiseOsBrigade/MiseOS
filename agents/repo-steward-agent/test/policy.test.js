import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAction } from '../src/policy.js';
import { formatReport } from '../src/report.js';

test('dangerous actions are tier3', () => {
  assert.equal(classifyAction('rotate credentials'), 'tier3');
});

test('reports include certainty tags', () => {
  const report = formatReport({ validation: [{ name: 'npm test', status: 'CONFIRMED', detail: 'passed' }] });
  assert.match(report, /CONFIRMED/);
});
