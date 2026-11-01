import test from 'node:test';
import assert from 'node:assert/strict';
import { routeModel, listModelFamilies } from '../src/routeModel.js';

test('routes workflow execution to agentic model class', () => {
  assert.equal(routeModel('execute-workflow'), 'agentic');
});

test('registry includes core model families', () => {
  assert.ok(listModelFamilies().includes('multimodal'));
});
